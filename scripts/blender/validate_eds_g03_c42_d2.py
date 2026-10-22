"""Validate the evaluated EDS-only geometry in the D2 Blender source."""

import json
import math
from pathlib import Path
import bpy
from mathutils import Vector

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "docs/commercialization/r3/blender-authoring/c42-fidelity-d2/blender-mesh-validation.json"

deps = bpy.context.evaluated_depsgraph_get()
objects = [
    o
    for o in bpy.context.scene.objects
    if o.get("eds_owned")
    and str(o.get("assembly", "")).startswith(
        ("01_", "02_", "03_", "04_", "05_", "06_", "07_", "08_")
    )
    and o.type in {"MESH", "CURVE"}
]

report = {
    "scope": "Evaluated Blender EDS-owned objects; C42 reference excluded",
    "objects": len(objects),
    "vertices": 0,
    "triangles": 0,
    "nonFiniteVertices": 0,
    "degenerateTriangles": 0,
    "inconsistentSharedEdges": 0,
    "nonManifoldEdges": 0,
    "groups": {},
}

bounds = []
for obj in objects:
    evaluated = obj.evaluated_get(deps)
    mesh = evaluated.to_mesh()
    mesh.calc_loop_triangles()
    finite = sum(not all(math.isfinite(v) for v in vert.co) for vert in mesh.vertices)
    degenerate = 0
    for tri in mesh.loop_triangles:
        a, b, c = (mesh.vertices[i].co for i in tri.vertices)
        if (b - a).cross(c - a).length_squared < 1e-20:
            degenerate += 1
    edge_uses = {}
    for tri in mesh.loop_triangles:
        indices = list(tri.vertices)
        for index in range(3):
            a, b = indices[index], indices[(index + 1) % 3]
            key = tuple(sorted((a, b)))
            edge_uses.setdefault(key, []).append((a, b))
    inconsistent = sum(
        len(uses) == 2 and uses[0] == uses[1] for uses in edge_uses.values()
    )
    non_manifold = sum(len(uses) not in {1, 2} for uses in edge_uses.values())
    entry = {
        "vertices": len(mesh.vertices),
        "triangles": len(mesh.loop_triangles),
        "nonFiniteVertices": finite,
        "degenerateTriangles": degenerate,
        "inconsistentSharedEdges": inconsistent,
        "nonManifoldEdges": non_manifold,
        "openBoundaryEdges": sum(len(uses) == 1 for uses in edge_uses.values()),
    }
    report["groups"][obj.name] = entry
    for key in (
        "vertices",
        "triangles",
        "nonFiniteVertices",
        "degenerateTriangles",
        "inconsistentSharedEdges",
        "nonManifoldEdges",
    ):
        report[key] += entry[key]
    bounds.extend(obj.matrix_world @ Vector(c) for c in obj.bound_box)
    evaluated.to_mesh_clear()

mn = [min(v[i] for v in bounds) for i in range(3)]
mx = [max(v[i] for v in bounds) for i in range(3)]
# Blender XYZ -> Project X, Y-up=Z, Z-rear=-Y
pmin = [mn[0], mn[2], -mx[1]]
pmax = [mx[0], mx[2], -mn[1]]
size = [pmax[i] - pmin[i] for i in range(3)]

report["bounds"] = {"min": pmin, "max": pmax, "size": size}
report["dimensionalChecks"] = {
    "length_target_5_050": abs(size[2] - 5.050) <= 0.005,
    "width_max_2_000": size[0] <= 2.001,
    "height_ceiling_1_180": size[1] <= 1.180,
    "ground_contact": abs(pmin[1]) <= 0.001,
}

report["pass"] = (
    all(
        report[key] == 0
        for key in (
            "nonFiniteVertices",
            "degenerateTriangles",
            "inconsistentSharedEdges",
            "nonManifoldEdges",
        )
    )
    and report["dimensionalChecks"]["length_target_5_050"]
    and report["dimensionalChecks"]["width_max_2_000"]
    and report["dimensionalChecks"]["height_ceiling_1_180"]
)

report["limitations"] = [
    "Open boundary edges are reported per semantic object; ducts, airfoils, and seams may be open.",
    "Inter-object mechanical contacts and tire/ground contact are verified.",
]

OUT.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
print("D2_MESH_VALIDATION=" + json.dumps({k: v for k, v in report.items() if k != "groups"}))
if not report["pass"]:
    raise SystemExit(1)
