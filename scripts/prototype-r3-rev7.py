"""REV7 DESIGN-GATE-ONLY local diffuser and rear-halo surface specimens.

Original EDS section authoring. Reads the current G03 only for a comparison
crop; never writes public/models or edits the integrated generator. Requires
numpy and trimesh. Coordinates are metres, +Y up, +Z rear.
"""

import hashlib
import json
from pathlib import Path

import numpy as np
import trimesh


SOURCE = Path("public/models/eds-g03-preview.glb")
OUT = Path("docs/commercialization/r3/evidence/r3-2-revision-7-prototypes")
OUT.mkdir(parents=True, exist_ok=True)
MOUNTS = [(-0.26, 0.66, 0.12), (0.26, 0.66, 0.12)]


def smooth(value):
    value = np.clip(value, 0.0, 1.0)
    return value * value * (3.0 - 2.0 * value)


def append_loft(rings, wrap=False, reverse=False):
    """Stitch equally sampled consecutive section rings without overlap."""
    count = len(rings[0])
    vertices = np.asarray([point for ring in rings for point in ring], dtype=float)
    faces = []
    for row in range(len(rings) - 1):
        for col in range(count if wrap else count - 1):
            a = row * count + col
            b = row * count + (col + 1) % count
            c = (row + 1) * count + col
            d = (row + 1) * count + (col + 1) % count
            faces.extend([[a, b, c], [b, d, c]] if reverse else [[a, c, b], [b, c, d]])
    return trimesh.Trimesh(vertices=vertices, faces=faces, process=False)


def sample_line(start, end, count, easing=None):
    for index in range(count):
        t = index / (count - 1)
        yield np.asarray(start) * (1 - (easing(t) if easing else t)) + np.asarray(end) * (easing(t) if easing else t)


def diffuser_section(option, z):
    progress = smooth((z - 1.50) / 0.80)
    if option == "A":
        # Parallel rounded-arch tunnels with a 0.06 m low central splitter.
        half_width = 0.56 + 0.02 * progress
        center_half = 0.03
        roof = 0.205 + 0.135 * progress
        bottom = 0.168 - 0.048 * progress
        arch = 0.016 * progress
        shoulder = half_width - 0.025
    else:
        # A flared Venturi pair: narrower upstream mouths, broad rear outlets,
        # swept centre keel and straight, bevelled tunnel shoulders.
        half_width = 0.46 + 0.12 * progress
        center_half = 0.045 + 0.01 * progress
        roof = 0.215 + 0.115 * progress
        bottom = 0.175 - 0.045 * progress
        arch = 0.006 * progress
        shoulder = half_width - 0.035
    section = []

    def add_segment(start, end, count, easing=None):
        points = list(sample_line(start, end, count, easing))
        section.extend(points if not section else points[1:])

    add_segment((-half_width, bottom), (-shoulder, roof - 0.025), 7, smooth)
    left_start = -shoulder
    left_end = -center_half
    for index in range(1, 25):
        t = index / 24
        x = left_start + (left_end - left_start) * t
        if option == "A":
            y = roof + arch * np.sin(np.pi * t) ** 2
        else:
            bevel = smooth(min(t / 0.22, (1 - t) / 0.22))
            y = roof - 0.016 * (1 - bevel)
        section.append([x, y])
    add_segment((-center_half, section[-1][1]), (-center_half, bottom), 7, smooth)
    add_segment((-center_half, bottom), (center_half, bottom), 7)
    add_segment((center_half, bottom), (center_half, roof if option == "A" else roof - 0.016), 7, smooth)
    right_start = center_half
    right_end = shoulder
    for index in range(1, 25):
        t = index / 24
        x = right_start + (right_end - right_start) * t
        if option == "A":
            y = roof + arch * np.sin(np.pi * t) ** 2
        else:
            bevel = smooth(min(t / 0.22, (1 - t) / 0.22))
            y = roof - 0.016 * (1 - bevel)
        section.append([x, y])
    add_segment((shoulder, section[-1][1]), (half_width, bottom), 7, smooth)
    return np.asarray(section)


def diffuser(option):
    rings = []
    for z in np.linspace(1.50, 2.30, 33):
        cross = diffuser_section(option, z)
        rings.append([[x, y, z] for x, y in cross])
    # This is the *underside* of the diffuser. Forward-facing material normals
    # point into the channels (-Y at the roofs), not through the upper body.
    return append_loft(rings, reverse=True)


def fairing_ring(mx, my, mz, option, fraction, segments):
    theta = np.linspace(0, 2 * np.pi, segments, endpoint=False)
    if option == "A":
        # Long, symmetric oval saddle: broad and nearly tangent at the shell.
        rx = 0.205 * (1 - fraction) + 0.038 * fraction
        rz = 0.385 * (1 - fraction) + 0.052 * fraction
        lean = 0.0
        height = 0.576 + 0.084 * smooth(fraction)
    else:
        # Narrow asymmetric boat-tail: extended forward ramp, tight aft heel.
        rx = 0.155 * (1 - fraction) + 0.037 * fraction
        rz = 0.485 * (1 - fraction) + 0.052 * fraction
        lean = -0.055 * (1 - fraction) ** 2
        height = 0.582 + 0.078 * smooth(fraction)
    # A smooth fourth-order oval avoids corners and triangular planform tips.
    c = np.cos(theta)
    s = np.sin(theta)
    signed_c = np.sign(c) * np.abs(c) ** 0.87
    signed_s = np.sign(s) * np.abs(s) ** 0.87
    return np.column_stack((mx + rx * signed_c, np.full(segments, height), mz + lean + rz * signed_s))


def halo_mount(mx, my, mz, option):
    segments = 56
    rings = [fairing_ring(mx, my, mz, option, fraction, segments) for fraction in np.linspace(0, 1, 13)]
    # The innermost annulus is the first tube ring: no intersecting collar.
    # Existing approved mount centre [mx,my,mz] is untouched.
    tube_radius_x = 0.038 if option == "A" else 0.037
    tube_radius_z = 0.052
    for t in np.linspace(0.08, 1.0, 18):
        eased = smooth(t)
        x = mx + np.sign(mx) * 0.04 * eased
        y = my + 0.20 * t
        z = mz - 0.25 * eased
        radius = 1.0 - 0.40 * eased
        theta = np.linspace(0, 2 * np.pi, segments, endpoint=False)
        ring = np.column_stack((
            x + tube_radius_x * radius * np.cos(theta),
            y + 0.012 * t * np.sin(theta),
            z + tube_radius_z * radius * np.sin(theta),
        ))
        rings.append(ring)
    # One connected annular shell/tube mesh per mount; only outer crop and
    # tube tip are open. Shared indexed edges close the angular seam.
    return append_loft(rings, wrap=True)


def halo(option):
    left = halo_mount(*MOUNTS[0], option)
    right = halo_mount(*MOUNTS[1], option)
    return {"rear_left": left, "rear_right": right}


def export(label, geometries):
    scene = trimesh.Scene()
    metrics = {}
    for name, mesh in geometries.items():
        scene.add_geometry(mesh, geom_name=name, node_name=name)
        metrics[name] = {
            "vertices": int(len(mesh.vertices)),
            "triangles": int(len(mesh.faces)),
            "bounds": np.round(mesh.bounds, 6).tolist(),
            "windingConsistent": bool(mesh.is_winding_consistent),
            "degenerateTriangles": int(np.count_nonzero(mesh.area_faces < 1e-10)),
            "finite": bool(np.isfinite(mesh.vertices).all()),
            "openBoundaryEdges": int(np.count_nonzero(np.bincount(mesh.edges_unique_inverse) == 1)),
        }
    data = scene.export(file_type="glb")
    filename = OUT / f"{label}.glb"
    filename.write_bytes(data)
    return {"file": str(filename).replace("\\", "/"), "sha256": hashlib.sha256(data).hexdigest(), "bytes": len(data), "meshes": metrics}


source_scene = trimesh.load(SOURCE, force="scene")
body = source_scene.geometry["GLTF"]
centers = body.triangles_center
baseline_diffuser = body.submesh([np.flatnonzero((centers[:, 2] > 1.5) & (centers[:, 1] < 0.55))], append=True, repair=False)
baseline_halo = body.submesh([np.flatnonzero((centers[:, 2] > -0.35) & (centers[:, 2] < 0.48) & (centers[:, 1] > 0.47) & (np.abs(centers[:, 0]) < 0.53))], append=True, repair=False)
result = {
    "sourceSha256": hashlib.sha256(SOURCE.read_bytes()).hexdigest(),
    "status": "DESIGN PROTOTYPES ONLY; no integrated-model mutation or owner approval",
    "coordinateSystem": "+Y up, -Z front, +Z rear, metres",
    "prototypes": {
        "diffuser-baseline": export("diffuser-baseline", {"body_crop": baseline_diffuser}),
        "diffuser-A-rounded": export("diffuser-A-rounded", {"twin_outlet_section": diffuser("A")}),
        "diffuser-B-flared": export("diffuser-B-flared", {"twin_outlet_section": diffuser("B")}),
        "halo-baseline": export("halo-baseline", {"body_crop": baseline_halo}),
        "halo-A-saddle": export("halo-A-saddle", halo("A")),
        "halo-B-boattail": export("halo-B-boattail", halo("B")),
    },
}
for option in ["A", "B"]:
    exit_section = diffuser_section(option, 2.30)
    result["prototypes"]["diffuser-A-rounded" if option == "A" else "diffuser-B-flared"]["exit"] = {
        "widthMetres": round(float(np.ptp(exit_section[:, 0])), 6),
        "minimumYMetres": round(float(exit_section[:, 1].min()), 6),
        "maximumYMetres": round(float(exit_section[:, 1].max()), 6),
        "profileXY": np.round(exit_section, 6).tolist(),
    }
(OUT / "geometry.json").write_text(json.dumps(result, indent=2) + "\n", encoding="utf-8")
print(json.dumps({name: {"sha256": value["sha256"], "bytes": value["bytes"]} for name, value in result["prototypes"].items()}, indent=2))
