"""Independent, bounded GLB topology diagnostic for the R3.2 Gate 2 surfaces.

Run with trimesh, numpy and rtree installed in the Python environment. This
does not modify either GLB. It tests non-adjacent triangle intersections in
the target BODY regions; coincident/coplanar surfaces need separate inspection.
"""

import io
import json
import subprocess

import numpy as np
import trimesh


BASELINE = "4762005"
GLB = "public/models/eds-g03-preview.glb"


def load_scene(baseline):
    if baseline:
        data = subprocess.check_output(["git", "show", f"{BASELINE}:{GLB}"])
        return trimesh.load(io.BytesIO(data), file_type="glb", force="scene")
    return trimesh.load(GLB, force="scene")


def segment_hits_triangle(a, b, triangle):
    direction = b - a
    edge_one = triangle[1] - triangle[0]
    edge_two = triangle[2] - triangle[0]
    cross = np.cross(direction, edge_two)
    determinant = np.dot(edge_one, cross)
    if abs(determinant) < 1e-10:
        return False
    inverse = 1.0 / determinant
    offset = a - triangle[0]
    u = inverse * np.dot(offset, cross)
    if u < 1e-7 or u > 1 - 1e-7:
        return False
    q = np.cross(offset, edge_one)
    v = inverse * np.dot(direction, q)
    if v < 1e-7 or u + v > 1 - 1e-7:
        return False
    t = inverse * np.dot(edge_two, q)
    return 1e-7 < t < 1 - 1e-7


def local_crossings(mesh, region):
    triangles = mesh.triangles
    centers = triangles.mean(axis=1)
    if region == "diffuser":
        selected = np.flatnonzero((centers[:, 2] > 1.0) & (centers[:, 1] < 0.5))
    else:
        selected = np.flatnonzero(
            (centers[:, 2] > -0.96)
            & (centers[:, 2] < 0.56)
            & (centers[:, 1] > 0.46)
            & (np.abs(centers[:, 0]) < 0.56)
        )
    subset = triangles[selected]
    tree = trimesh.triangles.bounds_tree(subset)
    pairs = 0
    crossings = []
    for local_i, triangle in enumerate(subset):
        bounds = np.hstack((triangle.min(axis=0), triangle.max(axis=0)))
        for local_j in tree.intersection(bounds):
            if local_j <= local_i:
                continue
            face_a = mesh.faces[selected[local_i]]
            face_b = mesh.faces[selected[local_j]]
            if np.intersect1d(face_a, face_b).size:
                continue
            pairs += 1
            other = subset[local_j]
            edges_a = ((triangle[0], triangle[1]), (triangle[1], triangle[2]), (triangle[2], triangle[0]))
            edges_b = ((other[0], other[1]), (other[1], other[2]), (other[2], other[0]))
            if any(segment_hits_triangle(a, b, other) for a, b in edges_a) or any(
                segment_hits_triangle(a, b, triangle) for a, b in edges_b
            ):
                crossings.append([int(selected[local_i]), int(selected[local_j])])
    return {
        "triangles": len(selected),
        "nonAdjacentAabbPairs": pairs,
        "strictEdgeTriangleCrossings": len(crossings),
        "samples": crossings[:12],
    }


def boundaries(mesh):
    edges = mesh.edges_sorted
    unique, counts = np.unique(edges, axis=0, return_counts=True)
    open_edges = unique[counts == 1]
    centers = mesh.vertices[open_edges].mean(axis=1)
    classes = {
        "rearExit": int(np.count_nonzero(centers[:, 2] > 2.18)),
        "frontTip": int(np.count_nonzero(centers[:, 2] < -2.3)),
        "inletZone": int(np.count_nonzero((centers[:, 2] > -0.65) & (centers[:, 2] < 0.4) & (np.abs(centers[:, 0]) > 0.2))),
    }
    classes["other"] = len(open_edges) - sum(classes.values())
    return {"count": len(open_edges), "classes": classes}


def inspect(scene):
    groups = {}
    for name, mesh in scene.geometry.items():
        groups[name] = {
            "triangles": len(mesh.faces),
            "watertight": bool(mesh.is_watertight),
            "windingConsistent": bool(mesh.is_winding_consistent),
            "boundaryEdges": boundaries(mesh),
        }
    body = scene.geometry["GLTF"]
    return {
        "groups": groups,
        "localSelfIntersection": {
            "diffuser": local_crossings(body, "diffuser"),
            "haloShell": local_crossings(body, "halo"),
        },
    }


if __name__ == "__main__":
    result = {
        "baselineCommit": BASELINE,
        "scope": "Within BODY mesh only; strict edge-triangle crossings in diffuser and halo shell zones",
        "limitations": "Does not cover coplanar contacts, containment, inter-mesh overlaps, or surfaces outside the target zones.",
        "baseline": inspect(load_scene(True)),
        "candidate": inspect(load_scene(False)),
    }
    print(json.dumps(result, indent=2))
