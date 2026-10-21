"""Crop the accepted Rev5 BODY for matched isolated Revision 6 review renders."""

import io
import subprocess
from pathlib import Path

import numpy as np
import trimesh


sha = "ff29e5ae526ddc1df6034861987e112a63e5cc70"
source = "public/models/eds-g03-preview.glb"
out = Path("docs/commercialization/r3/evidence/r3-2-revision-6")
data = subprocess.check_output(["git", "show", f"{sha}:{source}"])
body = trimesh.load(io.BytesIO(data), file_type="glb", force="scene").geometry["GLTF"]
centers = body.triangles_center
for region in ["halo", "diffuser"]:
    if region == "halo":
        keep = (
            (np.abs(centers[:, 0]) < 0.18)
            & (centers[:, 1] > 0.79)
            & (centers[:, 2] > -0.7)
            & (centers[:, 2] < -0.3)
        )
    else:
        keep = (
            (np.abs(centers[:, 0]) < 0.72)
            & (centers[:, 1] < 0.54)
            & (centers[:, 2] > 1.5)
        )
    mesh = body.submesh([np.flatnonzero(keep)], append=True, repair=False)
    scene = trimesh.Scene()
    scene.add_geometry(mesh, node_name=f"Rev5_{region}_BODY")
    out.mkdir(parents=True, exist_ok=True)
    target = out / f"{region}-rev5-crop.glb"
    target.write_bytes(scene.export(file_type="glb"))
    print(f"{target}: {len(mesh.faces)} triangles")
