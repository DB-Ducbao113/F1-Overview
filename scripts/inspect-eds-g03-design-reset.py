"""Independent bounded topology checks for the two design-reset WIP assets."""

import importlib.util
import json
import sys
from pathlib import Path

import numpy as np
import trimesh


ROOT = Path("docs/commercialization/r3/evidence/r3-design-reset")
helper_spec = importlib.util.spec_from_file_location(
    "r3_topology", Path("scripts/check-eds-g03-topology.py")
)
helper = importlib.util.module_from_spec(helper_spec)
helper_spec.loader.exec_module(helper)


def boundary_count(mesh):
    _, counts = np.unique(mesh.edges_sorted, axis=0, return_counts=True)
    return int(np.count_nonzero(counts == 1))


def strict_intermesh_crossings(first, second, region):
    first_triangles = first.triangles
    second_triangles = second.triangles
    first_centres = first_triangles.mean(axis=1)
    second_centres = second_triangles.mean(axis=1)
    if region == "halo":
        bounds = lambda centres: (
            (centres[:, 2] > -0.82)
            & (centres[:, 2] < 0.48)
            & (centres[:, 1] > 0.48)
            & (np.abs(centres[:, 0]) < 0.62)
        )
    else:
        bounds = lambda centres: (centres[:, 2] > 1.0) & (centres[:, 1] < 0.52)
    first_subset = first_triangles[bounds(first_centres)]
    second_subset = second_triangles[bounds(second_centres)]
    if not len(first_subset) or not len(second_subset):
        return {"testedAabbPairs": 0, "strictCrossings": 0, "samples": []}
    tree = trimesh.triangles.bounds_tree(second_subset)
    tested = 0
    samples = []
    crossings = 0
    for first_index, triangle in enumerate(first_subset):
        triangle_bounds = np.hstack((triangle.min(axis=0), triangle.max(axis=0)))
        for second_index in tree.intersection(triangle_bounds):
            tested += 1
            other = second_subset[second_index]
            edges_a = ((triangle[0], triangle[1]), (triangle[1], triangle[2]), (triangle[2], triangle[0]))
            edges_b = ((other[0], other[1]), (other[1], other[2]), (other[2], other[0]))
            hit = any(helper.segment_hits_triangle(a, b, other) for a, b in edges_a) or any(
                helper.segment_hits_triangle(a, b, triangle) for a, b in edges_b
            )
            if hit:
                crossings += 1
                if len(samples) < 12:
                    samples.append([int(first_index), int(second_index)])
    return {"testedAabbPairs": tested, "strictCrossings": crossings, "samples": samples}


def inspect(label):
    scene = trimesh.load(ROOT / f"eds-g03-design-concept-{label}.glb", force="scene")
    groups = {}
    by_role = {}
    geometry_roles = {}
    for node in scene.graph.nodes_geometry:
        geometry_name = scene.graph[node][1]
        role = next(
            (role for role in ["BODY", "AERO", "TIRE", "MECHANICAL", "COCKPIT"] if role in node.upper()),
            node,
        )
        geometry_roles[geometry_name] = role
    for name, mesh in scene.geometry.items():
        role = geometry_roles.get(name, name)
        by_role[role] = mesh
        groups[role] = {
            "sourceName": name,
            "triangles": int(len(mesh.faces)),
            "connectedComponents": "NOT TESTED (no graph engine in isolated QA environment)",
            "watertight": bool(mesh.is_watertight),
            "windingConsistent": bool(mesh.is_winding_consistent),
            "finiteVertices": bool(np.isfinite(mesh.vertices).all()),
            "finiteFaceNormals": bool(np.isfinite(mesh.face_normals).all()),
            "degenerateTriangles": int(np.count_nonzero(mesh.area_faces < 1e-10)),
            "openBoundaryEdges": boundary_count(mesh),
        }
    return {
        "groups": groups,
        "boundedSelfIntersections": {
            "bodyHaloZone": helper.local_crossings(by_role["BODY"], "halo"),
            "aeroDiffuserZone": helper.local_crossings(by_role["AERO"], "diffuser"),
        },
        "boundedIntermeshIntersections": {
            "bodyMechanicalHaloZone": strict_intermesh_crossings(by_role["BODY"], by_role["MECHANICAL"], "halo"),
            "aeroBodyDiffuserZone": strict_intermesh_crossings(by_role["AERO"], by_role["BODY"], "diffuser"),
        },
    }


report = {
    "scope": "Independent trimesh/numpy/rtree inspection of exported WIP GLBs",
    "conceptA": inspect("a"),
    "conceptB": inspect("b"),
    "limitations": [
        "Strict edge/triangle tests are bounded to halo and diffuser regions.",
        "Coplanar overlap, containment and contacts outside those bounds are not detected.",
        "Open boundaries include intentionally open airfoils, ducts and concept-stage surface sheets.",
    ],
}
(ROOT / "topology-inspection.json").write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
print(json.dumps(report, indent=2))
