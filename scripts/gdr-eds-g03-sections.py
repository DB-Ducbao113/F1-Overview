"""Sample the actual exported GDR diffuser lower envelope into JSON and SVG."""

import json
from pathlib import Path

import numpy as np
import trimesh


OUT = Path("docs/commercialization/r3/gdr/evidence")
NAMES = ["diffuser-rev4", "diffuser-A-profile", "diffuser-B-resection"]
result = {}
for name in NAMES:
    scene = trimesh.load(OUT / f"{name}.glb", force="scene")
    xyz = next(iter(scene.geometry.values())).vertices
    cross = []
    for x in np.arange(-0.5, 0.501, 0.05):
        points = xyz[(np.abs(xyz[:, 0] - x) < 0.028) & (xyz[:, 2] > 2.255)]
        if len(points):
            cross.append([round(float(x), 3), round(float(points[:, 1].min()), 4)])
    longitudinal = []
    for z in np.arange(1.0, 2.301, 0.1):
        points = xyz[
            (np.abs(np.abs(xyz[:, 0]) - 0.31) < 0.055)
            & (np.abs(xyz[:, 2] - z) < 0.04)
        ]
        if len(points):
            longitudinal.append([round(float(z), 3), round(float(points[:, 1].min()), 4)])
    result[name] = {
        "rearLowerEnvelope": cross,
        "channelLongitudinalLowerEnvelope": longitudinal,
        "minGroundClearanceWithinCrop": round(float(xyz[:, 1].min()), 5),
        "maxAbsXWithinCrop": round(float(np.abs(xyz[:, 0]).max()), 5),
        "rearMaxAbsX": round(float(np.abs(xyz[xyz[:, 2] > 2.255, 0]).max()), 5),
    }


def panel(title, metric, xlo, xhi, ylo, yhi, xoff, yoff):
    lines = [f'<text x="{xoff}" y="{yoff-10}" fill="#fff" font-size="18">{title}</text>']
    lines.append(
        f'<rect x="{xoff}" y="{yoff}" width="620" height="290" fill="#0b1119" stroke="#607282" />'
    )
    for name, color in zip(NAMES, ["#ffffff", "#61c7e8", "#ffbe5c"]):
        points = result[name][metric]
        coords = " ".join(
            f"{xoff+25+(x-xlo)/(xhi-xlo)*570:.1f},{yoff+260-(y-ylo)/(yhi-ylo)*220:.1f}"
            for x, y in points
        )
        lines.append(f'<polyline points="{coords}" fill="none" stroke="{color}" stroke-width="3" />')
    return "\n".join(lines)


svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="1320" height="460" viewBox="0 0 1320 460">
<rect width="1320" height="460" fill="#05080c" />
<text x="28" y="35" fill="#fff" font-size="24">EDS-G03 GDR: exported lower-envelope samples (metres)</text>
{panel("Rear cross-section, z ≥ 2.255 m", "rearLowerEnvelope", -0.5, 0.5, 0.05, 0.4, 28, 85)}
{panel("Channel longitudinal profile, |x| ≈ 0.31 m", "channelLongitudinalLowerEnvelope", 1.0, 2.3, 0.05, 0.4, 670, 85)}
<text x="30" y="425" fill="#fff" font-size="15">WHITE Rev4    CYAN A profile    GOLD B local resection. Samples use nearest exported vertices; not a CFD result.</text>
</svg>'''
(OUT / "diffuser-section-profile.svg").write_text(svg, encoding="utf-8")
(OUT / "diffuser-section-profile.json").write_text(
    json.dumps(result, indent=2) + "\n", encoding="utf-8"
)
print(json.dumps(result, indent=2))
