"""Bounded independent topology QA for isolated Rev7 design specimens."""

import importlib.util
import json
from pathlib import Path

import numpy as np
import trimesh


ROOT = Path("docs/commercialization/r3/evidence/r3-2-revision-7-prototypes")
NAMES = ["diffuser-A-rounded", "diffuser-B-flared", "halo-A-saddle", "halo-B-boattail"]
spec = importlib.util.spec_from_file_location("g03_topology", Path("scripts/check-eds-g03-topology.py"))
helper = importlib.util.module_from_spec(spec)
spec.loader.exec_module(helper)


def strict_pairs(mesh):
    tris = mesh.triangles
    tree = trimesh.triangles.bounds_tree(tris)
    count = 0
    tested = 0
    for i, triangle in enumerate(tris):
        bounds = np.hstack((triangle.min(axis=0), triangle.max(axis=0)))
        for j in tree.intersection(bounds):
            if j <= i or np.intersect1d(mesh.faces[i], mesh.faces[j]).size:
                continue
            tested += 1
            other = tris[j]
            edges_a = [(triangle[k], triangle[(k + 1) % 3]) for k in range(3)]
            edges_b = [(other[k], other[(k + 1) % 3]) for k in range(3)]
            if any(helper.segment_hits_triangle(a, b, other) for a, b in edges_a) or any(
                helper.segment_hits_triangle(a, b, triangle) for a, b in edges_b
            ):
                count += 1
    return {"strictCrossings": count, "testedAabbPairs": tested}


results = {}
for name in NAMES:
    scene = trimesh.load(ROOT / f"{name}.glb", force="scene")
    regions = {}
    for mesh_name, mesh in scene.geometry.items():
        edge_counts = np.bincount(mesh.edges_unique_inverse)
        edge_ids = mesh.edges_unique[edge_counts == 1]
        middle = mesh.vertices[edge_ids].mean(axis=1)
        if name.startswith("diffuser"):
            intentional = (np.abs(middle[:, 2] - 1.50) < 1e-4) | (np.abs(middle[:, 2] - 2.30) < 1e-4) | (np.abs(np.abs(middle[:, 0]) - 0.58) < 0.12)
            # Longitudinal side edges are also intentional. They may taper
            # from 0.46 to 0.58 in B, so classify by each z's design envelope.
            side_edges = (np.abs(middle[:, 0]) > 0.45) & (middle[:, 2] > 1.50) & (middle[:, 2] < 2.30)
            intentional |= side_edges
            roof = mesh.face_normals[(mesh.triangles_center[:, 1] > 0.29) & (np.abs(mesh.face_normals[:, 1]) > 0.7)]
            undersideNormalY = round(float(np.median(roof[:, 1])), 6) if len(roof) else None
        else:
            intentional = (middle[:, 1] < 0.61) | (middle[:, 1] > 0.83)
            undersideNormalY = None
        regions[mesh_name] = {
            "triangles": int(len(mesh.faces)),
            "finite": bool(np.isfinite(mesh.vertices).all()),
            "degenerateTriangles": int(np.count_nonzero(mesh.area_faces < 1e-10)),
            "windingConsistent": bool(mesh.is_winding_consistent),
            "openBoundaryEdges": int(len(edge_ids)),
            "unclassifiedOpenEdges": int(np.count_nonzero(~intentional)),
            "undersideRoofNormalYMedian": undersideNormalY,
            "bounds": np.round(mesh.bounds, 6).tolist(),
            **strict_pairs(mesh),
        }
    results[name] = regions

(ROOT / "independent-topology.json").write_text(json.dumps(results, indent=2) + "\n", encoding="utf-8")
print(json.dumps(results, indent=2))
failures = [
    f"{name}/{mesh_name}"
    for name, meshes in results.items()
    for mesh_name, item in meshes.items()
    if not item["finite"] or item["degenerateTriangles"] or not item["windingConsistent"]
    or item["strictCrossings"] or item["unclassifiedOpenEdges"]
    or (name.startswith("diffuser") and item["undersideRoofNormalYMedian"] is not None and item["undersideRoofNormalYMedian"] > 0)
]
if failures:
    raise SystemExit(f"Prototype QA failed: {failures}")
