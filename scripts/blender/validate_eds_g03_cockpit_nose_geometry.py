import bpy
import json
import math
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
MODEL_DIR = ROOT / "docs/commercialization/r3/blender-authoring/cockpit-nose-redesign"


def validate(label):
    source = MODEL_DIR / f"eds-g03-cockpit-nose-{label}.blend"
    bpy.ops.wm.open_mainfile(filepath=str(source))
    depsgraph = bpy.context.evaluated_depsgraph_get()
    result = {
        "source": source.relative_to(ROOT).as_posix(),
        "meshObjects": 0,
        "triangles": 0,
        "degenerateTriangles": 0,
        "nonFiniteVertices": 0,
        "nonFiniteNormals": 0,
        "inconsistentSharedEdgeDirections": 0,
        "nonManifoldSharedEdges": 0,
    }
    for obj in bpy.context.scene.objects:
        if obj.type != "MESH" or obj.hide_render:
            continue
        evaluated = obj.evaluated_get(depsgraph)
        mesh = evaluated.to_mesh()
        result["meshObjects"] += 1
        mesh.calc_loop_triangles()
        result["triangles"] += len(mesh.loop_triangles)
        for vertex in mesh.vertices:
            if not all(math.isfinite(value) for value in vertex.co):
                result["nonFiniteVertices"] += 1
            if not all(math.isfinite(value) for value in vertex.normal):
                result["nonFiniteNormals"] += 1
        for tri in mesh.loop_triangles:
            if tri.area <= 1e-12:
                result["degenerateTriangles"] += 1
        edge_directions = {}
        for polygon in mesh.polygons:
            vertices = list(polygon.vertices)
            for index, start in enumerate(vertices):
                end = vertices[(index + 1) % len(vertices)]
                key = tuple(sorted((start, end)))
                direction = 1 if start < end else -1
                edge_directions.setdefault(key, []).append(direction)
        for directions in edge_directions.values():
            if len(directions) == 2 and directions[0] == directions[1]:
                result["inconsistentSharedEdgeDirections"] += 1
            elif len(directions) > 2:
                result["nonManifoldSharedEdges"] += 1
        evaluated.to_mesh_clear()
    result["pass"] = not any(
        result[key]
        for key in (
            "degenerateTriangles",
            "nonFiniteVertices",
            "nonFiniteNormals",
            "inconsistentSharedEdgeDirections",
            "nonManifoldSharedEdges",
        )
    )
    return result


report = {
    "scope": "Blender evaluated-mesh geometry diagnostics",
    "note": "Open boundaries are permitted; intersecting-part collision analysis is not included.",
    "variants": {label: validate(label) for label in ("n30", "n20")},
}
report["pass"] = all(item["pass"] for item in report["variants"].values())
(MODEL_DIR / "geometry-validation.json").write_text(
    json.dumps(report, indent=2) + "\n", encoding="utf-8"
)
print(json.dumps(report, indent=2))
if not report["pass"]:
    raise SystemExit(1)
