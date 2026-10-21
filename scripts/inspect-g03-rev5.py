"""Independent, bounded Revision 5 topology and dimension inspection.

Requires numpy, trimesh and rtree. Does not modify the GLB. Strict crossing
tests exclude coplanar contacts and are limited to the modified regions.
"""

import importlib.util
import io
import json
import os
import subprocess
from pathlib import Path

import numpy as np
import trimesh


BASELINE = os.environ.get("R3_G03_BASELINE_COMMIT", "47fcfca54cc5a2208216af19c36806ba8d415")
MODEL = Path("public/models/eds-g03-preview.glb")
REPORT = Path(os.environ.get("R3_G03_TOPOLOGY_REPORT", "docs/commercialization/r3/evidence/r3-2-revision-5/topology.json"))
DIAGRAM = REPORT.with_name("diffuser-cross-sections.svg")
spec = importlib.util.spec_from_file_location(
    "topology_helper", Path("scripts/check-eds-g03-topology.py")
)
helper = importlib.util.module_from_spec(spec)
spec.loader.exec_module(helper)


def load(old):
    if old:
        data = subprocess.check_output(["git", "show", f"{BASELINE}:{MODEL.as_posix()}"])
        return trimesh.load(io.BytesIO(data), file_type="glb", force="scene")
    return trimesh.load(MODEL, force="scene")


def crossings(body):
    tri = body.triangles
    centers = tri.mean(axis=1)
    selected = np.flatnonzero(
        (centers[:, 2] > -0.96)
        & (centers[:, 2] < 0.56)
        & (centers[:, 1] > 0.46)
        & (np.abs(centers[:, 0]) < 0.56)
    )
    subset = tri[selected]
    tree = trimesh.triangles.bounds_tree(subset)
    found = []
    for local_i, triangle in enumerate(subset):
        bounds = np.hstack((triangle.min(axis=0), triangle.max(axis=0)))
        for local_j in tree.intersection(bounds):
            if local_j <= local_i:
                continue
            if np.intersect1d(body.faces[selected[local_i]], body.faces[selected[local_j]]).size:
                continue
            other = subset[local_j]
            edge_a = [(triangle[i], triangle[(i + 1) % 3]) for i in range(3)]
            edge_b = [(other[i], other[(i + 1) % 3]) for i in range(3)]
            if any(helper.segment_hits_triangle(a, b, other) for a, b in edge_a) or any(
                helper.segment_hits_triangle(a, b, triangle) for a, b in edge_b
            ):
                found.append(
                    {
                        "faces": [int(selected[local_i]), int(selected[local_j])],
                        "midpoint": np.round((triangle.mean(axis=0) + other.mean(axis=0)) / 2, 4).tolist(),
                    }
                )
    return found


def rear_shell_mechanical_crossings(scene):
    shell = scene.geometry["GLTF"].triangles
    mechanical = scene.geometry["GLTF_3"].triangles
    shell_center = shell.mean(axis=1)
    mechanical_center = mechanical.mean(axis=1)
    shell = shell[(shell_center[:, 2] > -0.35) & (shell_center[:, 2] < 0.42) & (shell_center[:, 1] > 0.5)]
    mechanical = mechanical[(mechanical_center[:, 2] > -0.35) & (mechanical_center[:, 2] < 0.42) & (mechanical_center[:, 1] > 0.58)]
    if not len(shell) or not len(mechanical):
        return {"strictCrossings": 0, "testedAabbPairs": 0}
    tree = trimesh.triangles.bounds_tree(mechanical)
    tested = 0
    strict = 0
    for triangle in shell:
        bounds = np.hstack((triangle.min(axis=0), triangle.max(axis=0)))
        for index in tree.intersection(bounds):
            tested += 1
            other = mechanical[index]
            edge_a = [(triangle[i], triangle[(i + 1) % 3]) for i in range(3)]
            edge_b = [(other[i], other[(i + 1) % 3]) for i in range(3)]
            if any(helper.segment_hits_triangle(a, b, other) for a, b in edge_a) or any(
                helper.segment_hits_triangle(a, b, triangle) for a, b in edge_b
            ):
                strict += 1
    return {"strictCrossings": strict, "testedAabbPairs": tested}


def lower_section(body, station):
    xyz = body.vertices
    slice_vertices = xyz[(np.abs(xyz[:, 2] - station) < 0.016) & (xyz[:, 1] < 0.43)]
    section = []
    for x in np.arange(-0.58, 0.581, 0.02):
        nearby = slice_vertices[np.abs(slice_vertices[:, 0] - x) < 0.015]
        if len(nearby):
            section.append([round(float(x), 3), round(float(nearby[:, 1].min()), 5)])
    return section


def inspect(scene):
    groups = {}
    for name, mesh in scene.geometry.items():
        edges, count = np.unique(mesh.edges_sorted, axis=0, return_counts=True)
        boundary = edges[count == 1]
        middle = mesh.vertices[boundary].mean(axis=1)
        groups[name] = {
            "triangles": int(len(mesh.faces)),
            "openBoundaryEdges": int(len(boundary)),
            "mountOpenEdges": int(np.count_nonzero(
                (middle[:, 1] > 0.57) & (middle[:, 1] < 0.86)
                & (middle[:, 2] > -0.9) & (middle[:, 2] < 0.35)
            )),
            "windingConsistent": bool(mesh.is_winding_consistent),
            "degenerateTriangles": int(np.count_nonzero(mesh.area_faces < 1e-10)),
            "finite": bool(np.isfinite(mesh.vertices).all()),
        }
    body = scene.geometry["GLTF"]
    xyz = body.vertices
    at_exit = xyz[(xyz[:, 2] > 2.25) & (xyz[:, 1] < 0.39)]
    crossing_list = crossings(body)
    regions = {"frontMount": 0, "rearMounts": 0, "upperHaloJunction": 0, "other": 0}
    for item in crossing_list:
        x, y, z = item["midpoint"]
        if y > 0.84 and -0.7 < z < -0.35:
            regions["upperHaloJunction"] += 1
        elif -0.85 < z < -0.5 and y <= 0.84:
            regions["frontMount"] += 1
        elif -0.2 < z < 0.34 and abs(x) > 0.1:
            regions["rearMounts"] += 1
        else:
            regions["other"] += 1
    return {
        "groups": groups,
        "rearShellMechanical": rear_shell_mechanical_crossings(scene),
        "diffuserExitLowerWidth": round(float(at_exit[:, 0].max() - at_exit[:, 0].min()), 6),
        "diffuserLowerSections": {
            str(z): lower_section(body, z) for z in [1.0, 2.1, 2.3]
        },
        "bodyLocalStrictCrossings": len(crossing_list),
        "crossingRegions": regions,
        "crossingSamples": crossing_list[:30],
    }


old_scene = load(True)
new_scene = load(False)
def sidepod_vertices(scene):
    xyz = scene.geometry["GLTF"].vertices
    mask = (
        (np.abs(xyz[:, 0]) > 0.2) & (np.abs(xyz[:, 0]) < 0.67)
        & (xyz[:, 1] > 0.2) & (xyz[:, 1] < 0.59)
        & (xyz[:, 2] > -0.55) & (xyz[:, 2] < 1.22)
    )
    return set(map(tuple, np.round(xyz[mask], 6)))

old_sidepod = sidepod_vertices(old_scene)
new_sidepod = sidepod_vertices(new_scene)
result = {
    "baselineCommit": BASELINE,
    "baseline": inspect(old_scene),
    "candidate": inspect(new_scene),
    "sidepodVertexPreservation": {
        "baselineUnique": len(old_sidepod),
        "candidateUnique": len(new_sidepod),
        "missingFromCandidate": len(old_sidepod - new_sidepod),
    },
    "limitations": "Strict bounded edge/triangle tests; coplanar overlap, containment, and full-scene collisions not certified.",
}
REPORT.parent.mkdir(parents=True, exist_ok=True)
REPORT.write_text(json.dumps(result, indent=2) + "\n", encoding="utf-8")
lines = ['<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="540" viewBox="0 0 1200 540">',
         '<rect width="1200" height="540" fill="#10151b"/>',
         '<text x="40" y="42" fill="white" font-size="24">EDS-G03 lower diffuser cross-sections - measured GLB vertices</text>']
colors = {"1.0": "#7696ad", "2.1": "#ffc05d", "2.3": "#54d7c4"}
for panel, label in enumerate(["baseline", "candidate"]):
    left = 40 + panel * 590
    lines.append(f'<text x="{left}" y="80" fill="white" font-size="19">{label.upper()} - exit width {result[label]["diffuserExitLowerWidth"]:.3f} m</text>')
    lines.append(f'<rect x="{left}" y="105" width="530" height="360" fill="#18222d" stroke="#52616d"/>')
    for station, color in colors.items():
        section = result[label]["diffuserLowerSections"][station]
        points = " ".join(f"{left + 265 + x * 420:.1f},{465 - (y - 0.04) * 1000:.1f}" for x, y in section)
        lines.append(f'<polyline points="{points}" fill="none" stroke="{color}" stroke-width="2.5"/>')
        lines.append(f'<text x="{left + 10}" y="{492 + list(colors).index(station) * 15}" fill="{color}" font-size="12">Z={station} m</text>')
lines.append('</svg>')
DIAGRAM.write_text("\n".join(lines) + "\n", encoding="utf-8")
print(json.dumps(result, indent=2))
