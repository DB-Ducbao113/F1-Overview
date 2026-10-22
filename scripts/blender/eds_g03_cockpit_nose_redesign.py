"""Author the EDS-G03 N30/N20 cockpit, halo and nose proportion studies.

The C42 photograph supplied by the owner is used only for broad packaging and
surface-transition principles. No third-party geometry, topology, UV, texture,
logo or measured proprietary contour is read by this script.
"""

from __future__ import annotations

import hashlib
import importlib.util
import json
import math
import os
import sys
from pathlib import Path

import bpy


ROOT = Path(__file__).resolve().parents[2]
RESET_PATH = ROOT / "scripts" / "blender" / "eds_g03_visual_design_reset.py"
OUT = ROOT / "docs" / "commercialization" / "r3" / "blender-authoring" / "cockpit-nose-redesign"
EVIDENCE = OUT.parent / "evidence" / "cockpit-nose-redesign"
BASELINE_BLEND = OUT.parent / "visual-design-reset" / "eds-g03-precision-machine.blend"

spec = importlib.util.spec_from_file_location("eds_visual_reset", RESET_PATH)
reset = importlib.util.module_from_spec(spec)
spec.loader.exec_module(reset)
base = reset.base

FRONT = -2.60
REAR = 2.45
TOTAL = REAR - FRONT
BASELINE_EDGE = -0.66
SKIP_RENDER = os.environ.get("EDS_G03_SKIP_RENDER") == "1" or "--skip-render" in sys.argv

VARIANTS = {
    "n30": {
        "label": "N30",
        "revision": "EDS-G03-CNR-N30-r1",
        "cockpitForwardEdgeZ": -1.085,
        "cockpitRearEdgeZ": 0.10,
        "ratioTarget": [3, 7],
        "intent": "balanced forward cockpit with long visual taper and viable packaging",
    },
    "n20": {
        "label": "N20",
        "revision": "EDS-G03-CNR-N20-r1",
        "cockpitForwardEdgeZ": -1.590,
        "cockpitRearEdgeZ": -0.12,
        "ratioTarget": [2, 8],
        "intent": "extreme forward cockpit study with the shortest measured A segment",
    },
}

CAMERAS = {
    "top-orthographic": {"position": (0.01, 7.9, 0), "target": (0, 0.15, 0), "ortho": 5.85},
    "side-orthographic": {"position": (7.4, 1.18, 0), "target": (0, 0.38, 0), "ortho": 5.65},
    "front-three-quarter": {"position": (4.95, 1.72, -5.05), "target": (0, 0.39, -0.05)},
    "rear-three-quarter": {"position": (-4.95, 1.68, 4.95), "target": (0, 0.39, 0.28)},
    "cockpit-halo-close-up": {"position": (1.48, 1.26, -0.62), "target": (0, 0.61, -0.34), "lens": 62},
    "nose-monocoque-close-up": {"position": (1.58, 0.91, -2.02), "target": (0, 0.39, -1.42), "lens": 60},
    "cockpit-sidepod-shoulder": {"position": (1.65, 0.98, 0.02), "target": (0.34, 0.48, -0.10), "lens": 64},
    "front-suspension-nose": {"position": (1.64, 0.82, -2.20), "target": (0.38, 0.34, -1.72), "lens": 64},
}


def ratios(edge):
    a = edge - FRONT
    b = REAR - edge
    return {"A": a, "B": b, "Apercent": a / TOTAL * 100, "Bpercent": b / TOTAL * 100}


def add_uv_sphere(name, center, scale, target, mat, segments=32, rings=16):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=segments, ring_count=rings, location=base.p2b(center))
    obj = bpy.context.object
    obj.name = name
    obj.scale = (scale[0], scale[2], scale[1])
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    base.move_to_collection(obj, target)
    return base.finish_mesh(obj, mat)


def build_centrebody(cols, mats, variant):
    body = cols["01_BODY"]
    edge = variant["cockpitForwardEdgeZ"]
    n20 = variant["label"] == "N20"
    # Independently authored longitudinal section network. The upper body stays
    # low and narrow around the opening instead of forming a detached capsule.
    stations = [
        (-2.48, 0, 0.270, 0.026, 0.022, 3.2),
        (-2.18, 0, 0.292, 0.054, 0.038, 3.4),
        (-1.90, 0, 0.322, 0.095, 0.060, 3.5),
        (-1.70, 0, 0.350, 0.135, 0.082, 3.5),
    ]
    if n20:
        stations += [
            (-1.50, 0, 0.382, 0.175, 0.105, 3.5),
            (-1.18, 0, 0.425, 0.225, 0.130, 3.4),
            (-0.78, 0, 0.468, 0.275, 0.155, 3.3),
        ]
    else:
        stations += [
            (-1.34, 0, 0.390, 0.185, 0.112, 3.5),
            (-1.02, 0, 0.435, 0.235, 0.138, 3.4),
            (-0.68, 0, 0.475, 0.280, 0.160, 3.3),
        ]
    stations += [
        (-0.30, 0, 0.495, 0.300, 0.175, 3.3),
        (0.12, 0, 0.500, 0.292, 0.180, 3.2),
        (0.52, 0, 0.545, 0.215, 0.235, 3.0),
        (0.96, 0, 0.490, 0.150, 0.180, 3.0),
        (1.42, 0, 0.412, 0.082, 0.105, 2.8),
        (1.86, 0, 0.354, 0.030, 0.042, 2.4),
    ]
    base.loft(f"{variant['label']}_CONTINUOUS_MONOCOQUE", stations, body, mats["clay"], radial=56)

    # Two low shoulder rails visually stitch the monocoque into sidepod roots.
    for side in (-1, 1):
        base.curve_tube(
            f"{variant['label']}_MONOCOQUE_SHOULDER_{side:+d}",
            [
                (side * 0.20, 0.49, edge - 0.05),
                (side * 0.30, 0.53, -0.63),
                (side * 0.39, 0.55, -0.36),
                (side * 0.47, 0.53, -0.15),
                (side * 0.51, 0.49, 0.10),
            ],
            0.010, body, mats["clay_dark"], False, 3,
        )


def build_sidepods_floor(cols, mats, variant):
    pods, floor = cols["03_SIDEPODS"], cols["06_FLOOR_DIFFUSER"]
    n20 = variant["label"] == "N20"
    inlet_z = -0.42 if n20 else -0.38
    stations = [
        (inlet_z - 0.12, 0.42, 0.445, 0.050, 0.088, 3.2),
        (inlet_z + 0.10, 0.48, 0.455, 0.150, 0.145, 3.4),
        (0.10, 0.49, 0.425, 0.178, 0.140, 3.4),
        (0.46, 0.445, 0.392, 0.145, 0.108, 3.3),
        (0.82, 0.36, 0.372, 0.102, 0.078, 3.2),
        (1.18, 0.29, 0.368, 0.068, 0.057, 3.0),
        (1.44, 0.24, 0.362, 0.038, 0.038, 2.8),
    ]
    for side in (-1, 1):
        reset.side_loft(f"{variant['label']}_SIDEPOD", side, stations, pods, mats["clay"], 46)
        base.rounded_box(
            f"{variant['label']}_INLET_{side:+d}",
            (side * 0.51, 0.458, inlet_z - 0.01),
            (0.155, 0.175, 0.048), pods, mats["duct"], 0.020,
        )
        base.curve_tube(
            f"{variant['label']}_SHOULDER_FLOW_{side:+d}",
            [(side * 0.45, 0.54, inlet_z), (side * 0.55, 0.52, 0.12),
             (side * 0.48, 0.445, 0.66), (side * 0.34, 0.395, 1.10)],
            0.0065, pods, mats["clay_dark"], False, 2,
        )
    base.loft(
        f"{variant['label']}_ENGINE_SPINE",
        [(0.20,0,0.61,0.105,0.10,2.8),(0.45,0,0.735,0.10,0.17,2.6),
         (0.70,0,0.755,0.082,0.165,2.5),(1.06,0,0.60,0.060,0.12,2.6),
         (1.43,0,0.46,0.035,0.065,2.4),(1.75,0,0.385,0.017,0.028,2.2)],
        pods, mats["clay"], radial=44,
    )
    reset.floor_plan(
        f"{variant['label']}_FLOOR",
        [(-1.08,.43),(-.58,.61),(-.10,.66),(.55,.64),(1.16,.61),(2.30,.58)],
        floor, mats["carbon"], "precision",
    )
    for x in (-0.42, 0, 0.42):
        base.rounded_box(f"{variant['label']}_DIFFUSER_{x:+.2f}", (x,.18,2.05), (.014,.18,.48), floor, mats["carbon"], .003)


def build_cockpit_halo_driver(cols, mats, variant):
    cockpit, mech = cols["02_COCKPIT"], cols["08_MECHANICAL"]
    edge = variant["cockpitForwardEdgeZ"]
    rear = variant["cockpitRearEdgeZ"]
    length = rear - edge
    centre = (edge + rear) * 0.5

    # A dark surface sits below the rim and follows the body crown, reading as a
    # recessed opening rather than a capsule attached above the monocoque.
    base.loft(
        f"{variant['label']}_RECESSED_DRIVER_OPENING",
        [(edge,0,0.548,0.075,0.026,3.2),
         (edge + length*0.18,0,0.570,0.145,0.038,3.2),
         (centre,0,0.585,0.175,0.045,3.3),
         (rear - length*0.16,0,0.578,0.155,0.040,3.2),
         (rear,0,0.552,0.085,0.026,3.0)],
        cockpit, mats["duct"], radial=44,
    )
    for side in (-1, 1):
        base.curve_tube(
            f"{variant['label']}_COCKPIT_RIM_{side:+d}",
            [(side*0.075,0.582,edge),(side*0.145,0.615,edge+length*.20),
             (side*0.178,0.628,centre),(side*0.152,0.620,rear-length*.14),
             (side*0.085,0.580,rear)],
            0.014, cockpit, mats["clay_dark"], False, 3,
        )
    base.curve_tube(
        f"{variant['label']}_COCKPIT_REAR_RIM",
        [(-.085,.580,rear),(-.15,.620,rear-length*.04),(0,.638,rear-length*.08),(.15,.620,rear-length*.04),(.085,.580,rear)],
        0.014, cockpit, mats["clay_dark"], False, 3,
    )

    # Neutral packaging indicators: seat/head and steering wheel, not a livery.
    head_z = rear - length * 0.23
    add_uv_sphere(f"{variant['label']}_DRIVER_HEAD", (0,0.665,head_z), (0.115,0.135,0.105), cockpit, mats["clay_dark"])
    steering_z = edge + length * 0.22
    steering_points = []
    for i in range(24):
        angle = 2 * math.pi * i / 24
        steering_points.append((0.105*math.cos(angle), 0.625+0.075*math.sin(angle), steering_z))
    base.curve_tube(f"{variant['label']}_STEERING_WHEEL", steering_points, 0.010, cockpit, mats["metal"], True, 2)
    base.cylinder_between(f"{variant['label']}_STEERING_COLUMN", (0,0.625,steering_z+0.03), (0,0.585,steering_z+0.23), 0.010, cockpit, mats["metal"], 14)

    # Preserve the registered three halo points and visually integrate them via
    # low mounting fairings rather than changing safety-hardpoint assumptions.
    top = (0, 0.94, -0.46)
    for side in (-1, 1):
        shoulder = (side * 0.235, 0.835, -0.30)
        base.cylinder_between(f"{variant['label']}_HALO_REAR_{side:+d}", (side*.26,.66,.12), shoulder, .029, mech, mats["metal"], 22)
        base.cylinder_between(f"{variant['label']}_HALO_CROWN_{side:+d}", shoulder, top, .029, mech, mats["metal"], 22)
        base.loft(
            f"{variant['label']}_HALO_REAR_FAIRING_{side:+d}",
            [(-0.02,side*.245,.635,.055,.030,2.8),(.16,side*.26,.655,.048,.025,2.6)],
            cockpit, mats["clay"], radial=30,
        )
    base.cylinder_between(f"{variant['label']}_HALO_FRONT", (0,.65,-.65), top, .029, mech, mats["metal"], 22)
    base.loft(
        f"{variant['label']}_HALO_FRONT_FAIRING",
        [(-.76,0,.545,.065,.035,3.0),(-.64,0,.635,.055,.040,2.8),(-.54,0,.675,.038,.030,2.5)],
        cockpit, mats["clay"], radial=32,
    )


def build_variant(slug):
    variant = VARIANTS[slug]
    base.reset_scene()
    cols = reset.collections()
    mats = reset.make_materials("precision-machine")
    build_centrebody(cols, mats, variant)
    build_sidepods_floor(cols, mats, variant)
    build_cockpit_halo_driver(cols, mats, variant)
    reset.wings(cols, mats, "precision-machine")
    reset.common_running_gear(cols, mats, "precision-machine")
    return cols, mats


def set_view(camera, definition):
    camera.data.type = "ORTHO" if "ortho" in definition else "PERSP"
    if "ortho" in definition:
        camera.data.ortho_scale = definition["ortho"]
    else:
        camera.data.lens = definition.get("lens", 51)
    base.set_camera(camera, definition["position"], definition["target"])


def render_views(camera, destination):
    destination.mkdir(parents=True, exist_ok=True)
    scene = bpy.context.scene
    reflective = base.material("CNR_DIAGNOSTIC_REFLECTIVE", (0.13,0.16,0.19), .72, .13)
    for mode, override in (("clay", None), ("reflective", reflective)):
        scene.view_layers[0].material_override = override
        for name, definition in CAMERAS.items():
            set_view(camera, definition)
            scene.render.filepath = str(destination / f"{name}-{mode}.png")
            bpy.ops.render.render(write_still=True)
    scene.view_layers[0].material_override = None


def export_glb(cols, output):
    bpy.ops.object.select_all(action="DESELECT")
    exportable = []
    for col in cols.values():
        for obj in col.all_objects:
            if obj.type in {"MESH", "CURVE"}:
                obj.select_set(True)
                exportable.append(obj)
    bpy.context.view_layer.objects.active = exportable[0]
    bpy.ops.export_scene.gltf(filepath=str(output), export_format="GLB", use_selection=True,
                              export_apply=True, export_yup=True, export_materials="EXPORT",
                              export_cameras=False, export_lights=False, export_extras=True)
    base.canonicalize_glb_float_accessors(output)


def render_baseline():
    bpy.ops.wm.open_mainfile(filepath=str(BASELINE_BLEND))
    scene = bpy.context.scene
    scene.render.engine = "BLENDER_EEVEE"
    scene.render.resolution_x = 960
    scene.render.resolution_y = 640
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = "PNG"
    camera = bpy.data.objects.get("CLAY_GATE_CAMERA")
    if camera is None:
        raise RuntimeError("Baseline camera missing")
    render_views(camera, EVIDENCE / "baseline-precision-machine")


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    EVIDENCE.mkdir(parents=True, exist_ok=True)
    manifest = {
        "locks": reset.LOCKS,
        "baseline": {"asset": str(BASELINE_BLEND.relative_to(ROOT)), "cockpitForwardEdgeZ": BASELINE_EDGE, **ratios(BASELINE_EDGE)},
        "variants": {},
        "ratioDefinition": "A=frontmost vehicle point to forward cockpit opening edge; B=edge to rearmost point",
        "frontmostZ": FRONT, "rearmostZ": REAR, "totalLength": TOTAL,
        "provenance": "Original EDS geometry; C42 image used only for general packaging principles",
        "status": "AWAITING OWNER COCKPIT AND NOSE DESIGN APPROVAL",
    }
    for slug, variant in VARIANTS.items():
        cols, mats = build_variant(slug)
        report = base.measure_scene(cols)
        report.update(variant)
        report["proportions"] = ratios(variant["cockpitForwardEdgeZ"])
        report["frontAxleClearanceToCockpitEdge"] = variant["cockpitForwardEdgeZ"] - reset.LOCKS["frontAxleZ"]
        report["hardpoints"] = reset.LOCKS
        camera = base.setup_studio(mats)
        blend = OUT / f"eds-g03-cockpit-nose-{slug}.blend"
        glb = OUT / f"eds-g03-cockpit-nose-{slug}.glb"
        bpy.context.scene["eds_revision"] = variant["revision"]
        bpy.context.scene["eds_status"] = "OWNER COCKPIT AND NOSE DESIGN GATE"
        bpy.ops.wm.save_as_mainfile(filepath=str(blend))
        export_glb(cols, glb)
        if not SKIP_RENDER:
            render_views(camera, EVIDENCE / slug)
        report.update({"blend": str(blend.relative_to(ROOT)), "glb": str(glb.relative_to(ROOT)),
                       "glbBytes": glb.stat().st_size,
                       "sha256": hashlib.sha256(glb.read_bytes()).hexdigest()})
        (OUT / f"{slug}-geometry.json").write_text(json.dumps(report, indent=2)+"\n", encoding="utf-8")
        manifest["variants"][slug] = report
    if not SKIP_RENDER:
        render_baseline()
    (OUT / "manifest.json").write_text(json.dumps(manifest, indent=2)+"\n", encoding="utf-8")
    print(json.dumps(manifest, indent=2))


if __name__ == "__main__":
    main()
