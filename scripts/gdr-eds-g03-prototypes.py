"""Isolated, non-production R3.2 GDR geometry experiments.

Requires numpy, trimesh and rtree in PYTHONPATH. Reads the committed Revision 4
GLB, never writes to public/models, and exports region-only GLBs to the GDR
evidence directory. These are concept specimens, not Revision 5 candidates.
"""

import hashlib
import json
from pathlib import Path

import numpy as np
import trimesh


SOURCE = Path("public/models/eds-g03-preview.glb")
OUT = Path("docs/commercialization/r3/gdr/evidence")
OUT.mkdir(parents=True, exist_ok=True)
SCENE = trimesh.load(SOURCE, force="scene")
BODY = SCENE.geometry["GLTF"]
MECHANICAL = SCENE.geometry["GLTF_3"]
MOUNTS = [(-0.26, 0.66, 0.12), (0.26, 0.66, 0.12)]


def smoothstep(value, low, high):
    t = np.clip((value - low) / (high - low), 0, 1)
    return t * t * (3 - 2 * t)


def crop(mesh, mask):
    return mesh.submesh([np.flatnonzero(mask)], append=True, repair=False)


def export(label, meshes):
    scene = trimesh.Scene()
    for name, mesh in meshes.items():
        mesh.remove_unreferenced_vertices()
        scene.add_geometry(mesh, geom_name=name)
    data = scene.export(file_type="glb")
    filename = OUT / f"{label}.glb"
    filename.write_bytes(data)
    return {
        "file": str(filename).replace("\\", "/"),
        "sha256": hashlib.sha256(data).hexdigest(),
        "bytes": len(data),
        "groups": {
            name: {
                "vertices": len(mesh.vertices),
                "triangles": len(mesh.faces),
                "bounds": np.round(mesh.bounds, 5).tolist(),
                "windingConsistent": bool(mesh.is_winding_consistent),
                "watertight": bool(mesh.is_watertight),
                "degenerateTriangles": int(np.count_nonzero(mesh.area_faces < 1e-10)),
                "finite": bool(np.isfinite(mesh.vertices).all()),
            }
            for name, mesh in meshes.items()
        },
    }


body_center = BODY.triangles_center
diffuser_mask = (body_center[:, 2] > 0.96) & (body_center[:, 1] < 0.52)
halo_mask = (
    (body_center[:, 2] > -0.96)
    & (body_center[:, 2] < 0.52)
    & (body_center[:, 1] > 0.43)
    & (np.abs(body_center[:, 0]) < 0.55)
)
mechanical_center = MECHANICAL.triangles_center
halo_tube_mask = (
    (mechanical_center[:, 2] > -0.84)
    & (mechanical_center[:, 2] < 0.35)
    & (mechanical_center[:, 1] > 0.61)
    & (mechanical_center[:, 1] < 0.98)
    & (np.abs(mechanical_center[:, 0]) < 0.38)
)
diffuser = crop(BODY, diffuser_mask)
halo_shell = crop(BODY, halo_mask)
halo_tube = crop(MECHANICAL, halo_tube_mask)
results = {"sourceSha256": hashlib.sha256(SOURCE.read_bytes()).hexdigest(), "prototypes": {}}
results["prototypes"]["diffuser-rev4"] = export("diffuser-rev4", {"body_crop": diffuser.copy()})
results["prototypes"]["halo-rev4"] = export(
    "halo-rev4", {"body_crop": halo_shell.copy(), "tube_crop": halo_tube.copy()}
)


def sculpt_diffuser(mesh, scheme):
    result = mesh.copy()
    xyz = result.vertices.copy()
    x, y, z = xyz.T
    along = smoothstep(z, 1.1, 2.27)
    underside = 1 - smoothstep(y, 0.35, 0.55)
    if scheme == "profile":
        paired = np.exp(-((np.abs(x) - 0.31) / 0.16) ** 2)
        xyz[:, 1] -= 0.055 * paired * along * underside
        xyz[:, 1] += 0.028 * along * underside
    else:
        # The denser local grid permits a sharper but smooth W-section and
        # decouples the channel exit profile from the old ring spacing.
        paired = np.exp(-((np.abs(x) - 0.30) / 0.135) ** 4)
        center = np.exp(-(x / 0.12) ** 2)
        xyz[:, 1] += (0.12 - 0.135 * paired - 0.035 * center) * along * underside
    result.vertices = xyz
    return result


results["prototypes"]["diffuser-A-profile"] = export(
    "diffuser-A-profile", {"body_crop": sculpt_diffuser(diffuser, "profile")}
)
# This is a local tessellation/section prototype, not an already stitched
# production exit. Subdivide once before authoring the independent W-section.
diffuser_dense = diffuser.subdivide()
results["prototypes"]["diffuser-B-resection"] = export(
    "diffuser-B-resection", {"body_crop": sculpt_diffuser(diffuser_dense, "resection")}
)


def fairing_trial(mesh):
    result = mesh.copy()
    xyz = result.vertices.copy()
    x, y, z = xyz.T
    for mx, my, mz in MOUNTS:
        radial = np.sqrt(((x - mx) / 0.22) ** 2 + ((z - mz) / 0.32) ** 2)
        weight = (1 - smoothstep(radial, 0.0, 1.0)) * smoothstep(y, 0.42, 0.58)
        xyz[:, 1] += weight * np.maximum(0, my + 0.025 - xyz[:, 1])
    result.vertices = xyz
    return result


results["prototypes"]["halo-A-fairing"] = export(
    "halo-A-fairing", {"body_crop": fairing_trial(halo_shell), "tube_crop": halo_tube.copy()}
)


def welded_mount(mx, my, mz):
    """One shell-to-tube topological specimen; outer patch is intentionally open."""
    segments = 40
    shell_radii = [0.26, 0.20, 0.15, 0.10, 0.065, 0.041]
    vertices = []
    rings = []
    for radius in shell_radii:
        ring = []
        blend = 1 - smoothstep(radius, 0.041, 0.26)
        for i in range(segments):
            theta = 2 * np.pi * i / segments
            px = mx + radius * np.cos(theta)
            pz = mz + radius * np.sin(theta)
            py = 0.565 + 0.095 * blend + 0.014 * (1 - abs(px) / 0.6)
            ring.append(len(vertices))
            vertices.append([px, py, pz])
        rings.append(ring)
    # Reuse the final shell ring as the tube's first ring. A short inclined
    # sweep models the rear diagonal support with a continuously welded edge.
    for step in range(1, 10):
        t = step / 9
        center = np.array([mx + np.sign(mx) * 0.035 * t, my + 0.18 * t, mz - 0.19 * t])
        radius = 0.041 - 0.019 * smoothstep(t, 0, 0.65)
        ring = []
        for i in range(segments):
            theta = 2 * np.pi * i / segments
            ring.append(len(vertices))
            vertices.append(center + [radius * np.cos(theta), 0, radius * np.sin(theta)])
        rings.append(ring)
    faces = []
    for a, b in zip(rings[:-1], rings[1:]):
        for i in range(segments):
            j = (i + 1) % segments
            faces.extend([[a[i], b[i], a[j]], [a[j], b[i], b[j]]])
    return trimesh.Trimesh(vertices=np.asarray(vertices), faces=np.asarray(faces), process=False)


results["prototypes"]["halo-B-welded"] = export(
    "halo-B-welded",
    {
        "left_welded_specimen": welded_mount(*MOUNTS[0]),
        "right_welded_specimen": welded_mount(*MOUNTS[1]),
    },
)

Path(OUT / "prototype-geometry.json").write_text(json.dumps(results, indent=2) + "\n", encoding="utf-8")
print(json.dumps(results, indent=2))
