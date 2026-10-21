"""Read-only geometric measurements for the R3.2 design review."""

import json

import numpy as np
import trimesh


scene = trimesh.load("public/models/eds-g03-preview.glb", force="scene")
body = scene.geometry["GLTF"]
mechanical = scene.geometry["GLTF_3"]
points = body.vertices
result = {"rearStations": [], "haloMounts": []}

for station in [1.0, 1.57, 1.93, 2.18, 2.3]:
    band = points[np.abs(points[:, 2] - station) < 0.018]
    if len(band) == 0:
        continue
    under = band[band[:, 1] < 0.45]
    entries = []
    for left, right in [(0, 0.12), (0.20, 0.40), (0.46, 0.60)]:
        segment = under[(np.abs(under[:, 0]) >= left) & (np.abs(under[:, 0]) < right)]
        if len(segment):
            entries.append(
                {
                    "absXRange": [left, right],
                    "count": len(segment),
                    "yMin": round(float(segment[:, 1].min()), 5),
                    "yMax": round(float(segment[:, 1].max()), 5),
                }
            )
    result["rearStations"].append(
        {
            "zApprox": station,
            "sampleCount": len(band),
            "maxAbsX": round(float(np.abs(band[:, 0]).max()), 5),
            "underbodySamples": entries,
        }
    )

for mount in [(-0.26, 0.66, 0.12), (0.26, 0.66, 0.12), (0, 0.65, -0.65)]:
    center = np.array(mount)
    face_center = body.triangles_center
    local_faces = np.flatnonzero(np.linalg.norm(face_center - center, axis=1) < 0.4)
    local_body = body.submesh([local_faces], append=True, repair=False)
    nearest, distance, _ = trimesh.proximity.closest_point_naive(local_body, center[None, :])
    delta = mechanical.vertices - center
    near_tube = mechanical.vertices[np.linalg.norm(delta, axis=1) < 0.06]
    tube_distances = (
        trimesh.proximity.closest_point_naive(local_body, near_tube)[1]
        if len(near_tube)
        else np.array([])
    )
    result["haloMounts"].append(
        {
            "mount": list(mount),
            "nearestBodyPoint": np.round(nearest[0], 5).tolist(),
            "centerToBodyDistance": round(float(distance[0]), 5),
            "nearMechanicalVertexCount": len(near_tube),
            "mechanicalToBodyUnsignedDistanceMinMedianMax": (
                np.round(
                    [tube_distances.min(), np.median(tube_distances), tube_distances.max()], 5
                ).tolist()
                if len(tube_distances)
                else None
            ),
        }
    )

print(json.dumps(result, indent=2))
