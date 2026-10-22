"""Independent exported-GLB topology summary for the Blender clay gate.

Requires trimesh + numpy. It deliberately reports, rather than repairs, open
boundaries and inter-object design seams. Strict self-intersection is marked
NOT TESTED because this asset uses 140+ semantic objects and the available
bounded checker cannot distinguish intended mechanical contact reliably.
"""

import json
import sys
from pathlib import Path

import numpy as np
import trimesh


source = Path(sys.argv[1] if len(sys.argv) > 1 else
              "docs/commercialization/r3/blender-authoring/eds-g03-clay-review.glb")
output = Path(sys.argv[2] if len(sys.argv) > 2 else
              "docs/commercialization/r3/blender-authoring/topology-report.json")
scene = trimesh.load(source, force="scene")


def boundary_count(mesh):
    if not len(mesh.edges_sorted):
        return 0
    _, counts = np.unique(mesh.edges_sorted, axis=0, return_counts=True)
    return int(np.count_nonzero(counts == 1))


groups = {}
totals = {"triangles": 0, "degenerateTriangles": 0, "openBoundaryEdges": 0}
for name, mesh in scene.geometry.items():
    areas = mesh.area_faces
    entry = {
        "triangles": int(len(mesh.faces)),
        "finiteVertices": bool(np.isfinite(mesh.vertices).all()),
        "finiteNormals": bool(np.isfinite(mesh.face_normals).all()),
        "degenerateTriangles": int(np.count_nonzero(areas < 1e-12)),
        "windingConsistent": bool(mesh.is_winding_consistent),
        "watertight": bool(mesh.is_watertight),
        "openBoundaryEdges": boundary_count(mesh),
    }
    groups[name] = entry
    for key in totals:
        totals[key] += entry[key]

bounds = np.asarray(scene.bounds)
report = {
    "source": source.as_posix(),
    "scope": "Independent trimesh/numpy inspection of exported semantic meshes",
    "geometryCount": len(groups),
    "bounds": {"min": bounds[0].tolist(), "max": bounds[1].tolist()},
    "totals": totals,
    "allFinite": all(item["finiteVertices"] and item["finiteNormals"] for item in groups.values()),
    "allWindingConsistent": all(item["windingConsistent"] for item in groups.values()),
    "strictSelfIntersections": "NOT TESTED - no independent whole-scene intersection classifier available",
    "interMeshCollisions": "NOT TESTED - intended mechanical contacts cannot be classified automatically",
    "boundaryClassification": {
        "status": "REVIEW REQUIRED",
        "note": "Open edges include intentional inlet, duct and diffuser outlet apertures plus airfoil seams.",
    },
    "groups": groups,
}
output.parent.mkdir(parents=True, exist_ok=True)
output.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
print(json.dumps({key: value for key, value in report.items() if key != "groups"}, indent=2))
if not report["allFinite"] or totals["degenerateTriangles"]:
    raise SystemExit(1)
