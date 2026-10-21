"""Check changed-face normal direction against the unmodified region specimen."""

import json
from pathlib import Path

import numpy as np
import trimesh


OUT = Path("docs/commercialization/r3/gdr/evidence")


def mesh(label):
    return next(iter(trimesh.load(OUT / f"{label}.glb", force="scene").geometry.values()))


def delta(reference, candidate):
    dot = np.einsum("ij,ij->i", reference.face_normals, candidate.face_normals)
    return {
        "faces": len(dot),
        "negativeDotCount": int(np.count_nonzero(dot < -1e-6)),
        "minDot": round(float(dot.min()), 5),
    }


diff = mesh("diffuser-rev4")
diff_a = mesh("diffuser-A-profile")
diff_b = mesh("diffuser-B-resection")
halo = mesh("halo-rev4")
halo_a = mesh("halo-A-fairing")
raw_subdivided = diff.subdivide()
report = {
    "diffuserA_vs_rev4": delta(diff, diff_a),
    "diffuserB_vs_unsculpted_same_tessellation": delta(raw_subdivided, diff_b),
    "haloA_body_vs_rev4": delta(halo, halo_a),
}
welded = trimesh.load(OUT / "halo-B-welded.glb", force="scene")
report["haloB_shell_topFacing"] = {}
for name, part in welded.geometry.items():
    # First five ring transitions form the annular body patch, 5*40*2 faces.
    shell_normals = part.face_normals[:400]
    report["haloB_shell_topFacing"][name] = {
        "positiveYCount": int(np.count_nonzero(shell_normals[:, 1] > 0)),
        "negativeYCount": int(np.count_nonzero(shell_normals[:, 1] < 0)),
    }
(OUT / "prototype-normal-comparison.json").write_text(
    json.dumps(report, indent=2) + "\n", encoding="utf-8"
)
print(json.dumps(report, indent=2))
