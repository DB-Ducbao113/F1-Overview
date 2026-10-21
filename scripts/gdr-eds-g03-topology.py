"""Bounded independent topology diagnostics for isolated GDR region GLBs."""

import importlib.util
import json
from pathlib import Path

import numpy as np
import trimesh


OUT = Path("docs/commercialization/r3/gdr/evidence")
spec = importlib.util.spec_from_file_location(
    "r3_topology", Path("scripts/check-eds-g03-topology.py")
)
helper = importlib.util.module_from_spec(spec)
spec.loader.exec_module(helper)


def open_edges(mesh, label, name):
    edges, count = np.unique(mesh.edges_sorted, axis=0, return_counts=True)
    boundary = edges[count == 1]
    mid = mesh.vertices[boundary].mean(axis=1)
    classes = {}
    remaining = np.ones(len(mid), dtype=bool)
    if label.startswith("diffuser"):
        rules = [
            ("frontCrop", mid[:, 2] < 1.02),
            ("rearExit", mid[:, 2] > 2.25),
            ("upperCrop", mid[:, 1] > 0.48),
        ]
    elif label == "halo-B-welded":
        center_x = -0.26 if "left" in name else 0.26
        radius = np.hypot(mid[:, 0] - center_x, mid[:, 2] - 0.12)
        rules = [("tubeTop", mid[:, 1] > 0.825), ("outerPatch", radius > 0.245)]
    else:
        rules = [
            ("frontCrop", mid[:, 2] < -0.9),
            ("rearCrop", mid[:, 2] > 0.46),
            ("lateralCrop", np.abs(mid[:, 0]) > 0.5),
            ("lowerCrop", mid[:, 1] < 0.47),
        ]
    for key, mask in rules:
        assigned = remaining & mask
        classes[key] = int(np.count_nonzero(assigned))
        remaining &= ~assigned
    classes["other"] = int(np.count_nonzero(remaining))
    return {"total": len(boundary), "locationClasses": classes}


def intermesh_crossings(shell, tube):
    shell_tri = shell.triangles
    tube_tri = tube.triangles
    shell_center = shell_tri.mean(axis=1)
    tube_center = tube_tri.mean(axis=1)
    near_shell = shell_tri[
        (shell_center[:, 2] > -0.35)
        & (shell_center[:, 2] < 0.42)
        & (shell_center[:, 1] > 0.5)
    ]
    near_tube = tube_tri[
        (tube_center[:, 2] > -0.35)
        & (tube_center[:, 2] < 0.42)
        & (tube_center[:, 1] > 0.58)
    ]
    if not len(near_shell) or not len(near_tube):
        return {"testedAabbPairs": 0, "strictCrossings": 0}
    tree = trimesh.triangles.bounds_tree(near_tube)
    pairs = 0
    crossings = 0
    for triangle in near_shell:
        bounds = np.hstack((triangle.min(axis=0), triangle.max(axis=0)))
        for tube_index in tree.intersection(bounds):
            pairs += 1
            other = near_tube[tube_index]
            edges_a = ((triangle[0], triangle[1]), (triangle[1], triangle[2]), (triangle[2], triangle[0]))
            edges_b = ((other[0], other[1]), (other[1], other[2]), (other[2], other[0]))
            if any(helper.segment_hits_triangle(a, b, other) for a, b in edges_a) or any(
                helper.segment_hits_triangle(a, b, triangle) for a, b in edges_b
            ):
                crossings += 1
    return {"testedAabbPairs": pairs, "strictCrossings": crossings}


report = {}
for label in [
    "diffuser-rev4",
    "diffuser-A-profile",
    "diffuser-B-resection",
    "halo-rev4",
    "halo-A-fairing",
    "halo-B-welded",
]:
    scene = trimesh.load(OUT / f"{label}.glb", force="scene")
    groups = {}
    for name, mesh in scene.geometry.items():
        groups[name] = {
            "triangles": len(mesh.faces),
            "openBoundaryEdges": open_edges(mesh, label, name),
            "windingConsistent": bool(mesh.is_winding_consistent),
            "finiteFaceNormals": bool(np.isfinite(mesh.face_normals).all()),
            "degenerateTriangles": int(np.count_nonzero(mesh.area_faces < 1e-10)),
        }
    first = next(iter(scene.geometry.values()))
    if label.startswith("diffuser"):
        local = helper.local_crossings(first, "diffuser")
    elif label == "halo-B-welded":
        local = {
            name: helper.local_crossings(mesh, "halo")
            for name, mesh in scene.geometry.items()
        }
    else:
        local = helper.local_crossings(first, "halo")
    collision = None
    if label in ["halo-rev4", "halo-A-fairing"]:
        meshes = list(scene.geometry.values())
        collision = intermesh_crossings(meshes[0], meshes[1])
    report[label] = {
        "groups": groups,
        "boundedStrictSelfIntersection": local,
        "rearMountShellTubeCrossing": collision,
    }

report["limitations"] = (
    "Region crops have intentional open cut boundaries. Strict segment/triangle tests "
    "do not detect coplanar overlap, containment, or collisions outside the bounded zones."
)
(OUT / "prototype-topology.json").write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
print(json.dumps(report, indent=2))
