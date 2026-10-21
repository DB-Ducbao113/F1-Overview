"""Independent local topology report for Revision 6 prototype or integrated GLB.

Use the existing numpy/trimesh/rtree QA environment. Does not change assets.
"""

import argparse
import importlib.util
import json
from pathlib import Path

import numpy as np
import trimesh


parser = argparse.ArgumentParser()
parser.add_argument("model", type=Path)
parser.add_argument("--region", choices=["halo", "diffuser"], required=True)
parser.add_argument("--report", type=Path)
args = parser.parse_args()

spec = importlib.util.spec_from_file_location(
    "topology_helper", Path("scripts/check-eds-g03-topology.py")
)
helper = importlib.util.module_from_spec(spec)
spec.loader.exec_module(helper)
scene = trimesh.load(args.model, force="scene")
body = scene.geometry.get("GLTF") or next(iter(scene.geometry.values()))
triangles = body.triangles
centers = triangles.mean(axis=1)
if args.region == "halo":
    mask = (
        (np.abs(centers[:, 0]) < 0.18)
        & (centers[:, 1] > 0.79)
        & (centers[:, 2] > -0.7)
        & (centers[:, 2] < -0.3)
    )
else:
    mask = (centers[:, 2] > 1.5) & (centers[:, 1] < 0.54)
selected = np.flatnonzero(mask)
subset = triangles[selected]
tree = trimesh.triangles.bounds_tree(subset)
crossings = []
tested = 0
for local_i, triangle in enumerate(subset):
    bounds = np.hstack((triangle.min(axis=0), triangle.max(axis=0)))
    for local_j in tree.intersection(bounds):
        if local_j <= local_i:
            continue
        if np.intersect1d(body.faces[selected[local_i]], body.faces[selected[local_j]]).size:
            continue
        tested += 1
        other = subset[local_j]
        edge_a = [(triangle[i], triangle[(i + 1) % 3]) for i in range(3)]
        edge_b = [(other[i], other[(i + 1) % 3]) for i in range(3)]
        if any(helper.segment_hits_triangle(a, b, other) for a, b in edge_a) or any(
            helper.segment_hits_triangle(a, b, triangle) for a, b in edge_b
        ):
            crossings.append([int(selected[local_i]), int(selected[local_j])])

edge_counts = np.bincount(body.edges_unique_inverse)
open_edges = body.edges_unique[edge_counts == 1]
open_midpoints = body.vertices[open_edges].mean(axis=1)
if args.region == "halo":
    inner = (
        (np.abs(open_midpoints[:, 0]) < 0.14)
        & (open_midpoints[:, 1] > 0.85)
        & (open_midpoints[:, 2] > -0.59)
        & (open_midpoints[:, 2] < -0.38)
    )
else:
    inner = np.zeros(len(open_midpoints), dtype=bool)
areas = trimesh.triangles.area(triangles)
result = {
    "asset": str(args.model),
    "region": args.region,
    "triangles": int(len(triangles)),
    "nonfiniteVertices": int(np.count_nonzero(~np.isfinite(body.vertices).all(axis=1))),
    "degenerateTrianglesBelow1e-10m2": int(np.count_nonzero(areas < 1e-10)),
    "windingConsistent": bool(body.is_winding_consistent),
    "strictCrossings": len(crossings),
    "testedAabbPairs": tested,
    "firstCrossings": crossings[:20],
    "openBoundaryEdges": int(len(open_edges)),
    "openEdgesAtHaloT": int(np.count_nonzero(inner)),
    "upperOpenEdgeSamples": open_midpoints[open_midpoints[:, 1] > 0.78][:40].round(4).tolist(),
    "bounds": body.bounds.round(6).tolist(),
}
if args.region == "diffuser":
    exit_points = body.vertices[(body.vertices[:, 2] > 2.295) & (body.vertices[:, 1] < 0.43)]
    result["exitLowerWidthMetres"] = round(float(np.ptp(exit_points[:, 0])), 6)
    result["exitMinimumGroundClearanceMetres"] = round(float(exit_points[:, 1].min()), 6)
    result["exitSectionXY"] = np.round(exit_points[:, :2], 5).tolist()
    channel_strip = body.vertices[(body.vertices[:, 2] > 1.5) & (np.abs(np.abs(body.vertices[:, 0]) - 0.3) < 0.025) & (body.vertices[:, 1] < 0.45)]
    result["channelLongitudinalZY"] = np.round(channel_strip[:, [2, 1]], 5).tolist()
print(json.dumps(result, indent=2))
if args.report:
    args.report.parent.mkdir(parents=True, exist_ok=True)
    args.report.write_text(json.dumps(result, indent=2) + "\n", encoding="utf-8")
