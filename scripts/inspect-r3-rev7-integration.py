"""Compare Revision 6 and the isolated Revision 7 integrated candidate.

Requires numpy/trimesh/rtree in the existing temporary QA environment.
Checks only bounded target zones; not a whole-car collision certificate.
"""

import importlib.util
import json
from pathlib import Path

import numpy as np
import trimesh

base_path = Path("public/models/eds-g03-preview.glb")
candidate_path = Path("docs/commercialization/r3/evidence/r3-2-revision-7/eds-g03-rev7-candidate.glb")
report_path = Path("docs/commercialization/r3/evidence/r3-2-revision-7/integration-measurements.json")
spec = importlib.util.spec_from_file_location("topology", "scripts/check-eds-g03-topology.py")
helper = importlib.util.module_from_spec(spec)
spec.loader.exec_module(helper)

base = trimesh.load(base_path, force="scene")
candidate = trimesh.load(candidate_path, force="scene")
body_a = base.geometry["GLTF"]
body_b = candidate.geometry["GLTF"]
if body_a.vertices.shape != body_b.vertices.shape or body_a.faces.shape != body_b.faces.shape:
    raise RuntimeError("BODY topology unexpectedly changed; indexed comparison is invalid")
vertex_delta = np.linalg.norm(body_b.vertices - body_a.vertices, axis=1)
open_a = body_a.edges_unique[np.bincount(body_a.edges_unique_inverse) == 1]
open_b = body_b.edges_unique[np.bincount(body_b.edges_unique_inverse) == 1]


def region(name, selector):
    a = selector(body_a.vertices)
    b = selector(body_b.vertices)
    shared = a & b
    return {
        "name": name,
        "baselineVertices": int(a.sum()),
        "candidateVertices": int(b.sum()),
        "correspondingVertices": int(shared.sum()),
        "changedCorrespondingVerticesAbove1e-6m": int(np.count_nonzero(vertex_delta[shared] > 1e-6)),
        "maximumDisplacementMetres": round(float(vertex_delta[shared].max(initial=0)), 8),
    }


regions = [
    region("sidepod inlet outer skin", lambda p: (np.abs(p[:, 0]) > 0.40) & (p[:, 2] > -0.55) & (p[:, 2] < -0.15) & (p[:, 1] > 0.25) & (p[:, 1] < 0.70)),
    region("upper halo T", lambda p: (np.abs(p[:, 0]) < 0.18) & (p[:, 1] > 0.79) & (p[:, 2] > -0.70) & (p[:, 2] < -0.30)),
    region("rear halo left", lambda p: (p[:, 0] < -0.10) & (p[:, 0] > -0.48) & (p[:, 1] > 0.48) & (p[:, 2] > -0.45) & (p[:, 2] < 0.56)),
    region("rear halo right", lambda p: (p[:, 0] > 0.10) & (p[:, 0] < 0.48) & (p[:, 1] > 0.48) & (p[:, 2] > -0.45) & (p[:, 2] < 0.56)),
    region("diffuser lower shell", lambda p: (p[:, 2] > 1.5) & (p[:, 1] < 0.50) & (np.abs(p[:, 0]) < 0.65)),
]


def strict_intersections(first, second):
    if not len(first) or not len(second):
        return {"strictCrossings": 0, "testedAabbPairs": 0}
    tree = trimesh.triangles.bounds_tree(second)
    count = 0
    tested = 0
    for triangle in first:
        bounds = np.hstack((triangle.min(axis=0), triangle.max(axis=0)))
        for index in tree.intersection(bounds):
            tested += 1
            other = second[index]
            edges_a = [(triangle[i], triangle[(i + 1) % 3]) for i in range(3)]
            edges_b = [(other[i], other[(i + 1) % 3]) for i in range(3)]
            if any(helper.segment_hits_triangle(a, b, other) for a, b in edges_a) or any(
                helper.segment_hits_triangle(a, b, triangle) for a, b in edges_b
            ):
                count += 1
    return {"strictCrossings": count, "testedAabbPairs": tested}


def rear_body_mechanical(scene):
    body = scene.geometry["GLTF"]
    mechanical_node = next((name for name in scene.graph.nodes_geometry if name == "EDS_G03_MECHANICAL"), None)
    if mechanical_node is None:
        return {"status": "NOT TESTED", "reason": "Mechanical node identity unavailable"}
    mechanical = scene.geometry[scene.graph.get(mechanical_node)[1]]
    body_tri = body.triangles
    mech_tri = mechanical.triangles
    b = body_tri.mean(axis=1)
    m = mech_tri.mean(axis=1)
    body_zone = body_tri[(np.abs(b[:, 0]) < 0.48) & (b[:, 1] > 0.45) & (b[:, 1] < 0.91) & (b[:, 2] > -0.45) & (b[:, 2] < 0.56)]
    mech_zone = mech_tri[(np.abs(m[:, 0]) < 0.48) & (m[:, 1] > 0.45) & (m[:, 1] < 0.91) & (m[:, 2] > -0.45) & (m[:, 2] < 0.56)]
    return {"status": "EXECUTED", "bodyTriangles": len(body_zone), "mechanicalTriangles": len(mech_zone), **strict_intersections(body_zone, mech_zone)}


def exit_metrics(body):
    p = body.vertices
    exit_points = p[(p[:, 2] > 2.295) & (p[:, 1] < 0.43)]
    metrics = {"lowerWidthMetres": round(float(np.ptp(exit_points[:, 0])), 6), "minimumYMetres": round(float(exit_points[:, 1].min()), 6)}
    for name, lo, hi in [("leftRoof", -0.4, -0.2), ("centreDivider", -0.03, 0.03), ("rightRoof", 0.2, 0.4)]:
        sample = exit_points[(exit_points[:, 0] >= lo) & (exit_points[:, 0] <= hi)]
        metrics[name] = {"minimumYMetres": round(float(sample[:, 1].min()), 6), "maximumYMetres": round(float(sample[:, 1].max()), 6)} if len(sample) else None
    return metrics


result = {
    "baseline": str(base_path),
    "candidate": str(candidate_path),
    "bodyVertexCount": len(body_b.vertices),
    "bodyTriangleCount": len(body_b.faces),
    "bodyTriangleIndicesUnchanged": bool(np.array_equal(body_a.faces, body_b.faces)),
    "bodyOpenEdges": {"revision6": len(open_a), "revision7": len(open_b), "indexSetsIdentical": bool(np.array_equal(open_a, open_b))},
    "regions": regions,
    "diffuserExit": {"revision6": exit_metrics(body_a), "revision7": exit_metrics(body_b)},
    "rearBodyMechanical": rear_body_mechanical(candidate),
}
report_path.write_text(json.dumps(result, indent=2) + "\n", encoding="utf-8")
print(json.dumps(result, indent=2))
