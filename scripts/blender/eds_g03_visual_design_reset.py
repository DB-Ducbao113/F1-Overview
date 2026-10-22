"""Author three original EDS-G03 silhouette concepts and matched evidence.

Run with Blender 5.2 LTS:
  blender --background --factory-startup --python scripts/blender/eds_g03_visual_design_reset.py

This is a silhouette/design-gate deliverable only.  It deliberately excludes
PBR, liveries, production integration and LOD authoring.  All dimensions use
the locked EDS registry in metres (+Y up, -Z front, +Z rear).
"""

from __future__ import annotations

import hashlib
import importlib.util
import json
import math
import os
from pathlib import Path

import bpy


ROOT = Path(__file__).resolve().parents[2]
BASE_PATH = ROOT / "scripts" / "blender" / "eds_g03_clay_authoring.py"
OUT = ROOT / "docs" / "commercialization" / "r3" / "blender-authoring" / "visual-design-reset"
EVIDENCE = OUT.parent / "evidence" / "visual-design-reset"

spec = importlib.util.spec_from_file_location("eds_g03_base", BASE_PATH)
base = importlib.util.module_from_spec(spec)
spec.loader.exec_module(base)

LOCKS = dict(base.LOCKS)
LOCKS["status"] = "LOCKED FOR OWNER SILHOUETTE REVIEW"

CONCEPTS = {
    "aero-predator": {
        "label": "Aero Predator",
        "revision": "EDS-G03-SR-A-r1",
        "intent": "maximally aggressive, low, arrow-like and mechanically exposed",
    },
    "eds-hyper-aero": {
        "label": "EDS Hyper Aero",
        "revision": "EDS-G03-SR-B-r1",
        "intent": "deeply sculpted venturi architecture with flowing shoulder volumes",
    },
    "precision-machine": {
        "label": "Precision Machine",
        "revision": "EDS-G03-SR-C-r1",
        "intent": "restrained, compact and premium with disciplined aero layering",
    },
}

CAMERAS = {
    "front": ((0, 0.82, -6.35), (0, 0.34, -0.72)),
    "side": ((7.35, 1.12, 0), (0, 0.39, 0)),
    "top": ((0.01, 7.9, 0), (0, 0.13, 0)),
    "front-three-quarter": ((4.95, 1.72, -5.05), (0, 0.39, -0.05)),
    "rear-three-quarter": ((-4.95, 1.68, 4.95), (0, 0.39, 0.28)),
    "rear": ((0, 0.86, 6.35), (0, 0.37, 0.72)),
}


def make_materials(slug):
    tint = {
        "aero-predator": (0.43, 0.46, 0.49),
        "eds-hyper-aero": (0.50, 0.53, 0.56),
        "precision-machine": (0.58, 0.59, 0.60),
    }[slug]
    return {
        "clay": base.material("RESET_CLAY", tint, 0.03, 0.39),
        "clay_dark": base.material("RESET_CLAY_DARK", (0.11, 0.13, 0.15), 0.12, 0.34),
        "rubber": base.material("RESET_RUBBER", (0.012, 0.014, 0.016), 0.0, 0.78),
        "metal": base.material("RESET_METAL", (0.12, 0.14, 0.16), 0.62, 0.24),
        "rim": base.material("RESET_RIM", (0.16, 0.18, 0.20), 0.72, 0.20),
        "brake": base.material("RESET_BRAKE", (0.09, 0.10, 0.11), 0.52, 0.30),
        "caliper": base.material("RESET_CALIPER", (0.22, 0.07, 0.035), 0.35, 0.31),
        "carbon": base.material("RESET_AERO", (0.045, 0.052, 0.060), 0.18, 0.42),
        "duct": base.material("RESET_DUCT", (0.006, 0.008, 0.010), 0.0, 0.84),
    }


def collections():
    names = (
        "01_BODY", "02_COCKPIT", "03_SIDEPODS", "04_FRONT_WING",
        "05_REAR_WING", "06_FLOOR_DIFFUSER", "07_WHEELS", "08_MECHANICAL",
    )
    return {name: base.collection(name) for name in names}


def side_loft(name, side, stations, target, mat, radial=44):
    mirrored = [(z, side * cx, y, rx, ry, exponent) for z, cx, y, rx, ry, exponent in stations]
    return base.loft(f"{name}_{'L' if side < 0 else 'R'}", mirrored, target, mat, radial=radial)


def floor_plan(name, width_rows, target, mat, profile="flat"):
    xs = [-1 + i / 10 for i in range(21)]
    vertices, upper, lower = [], [], []
    for z, half in width_rows:
        row_u, row_l = [], []
        rear = max(0.0, min(1.0, (z - 0.85) / 1.48))
        for q in xs:
            x = q * half
            channel = math.exp(-((abs(x) - 0.30) / 0.16) ** 2)
            if profile == "predator":
                y = 0.070 + rear * (0.10 + 0.12 * channel) + 0.014 * abs(q) ** 3
            elif profile == "hyper":
                y = 0.068 + rear * (0.12 + 0.15 * channel) + 0.026 * abs(q) ** 2
            else:
                y = 0.076 + rear * (0.095 + 0.09 * channel) + 0.010 * abs(q) ** 4
            thickness = 0.026 + rear * 0.018
            row_u.append(len(vertices)); vertices.append((x, y + thickness, z))
            row_l.append(len(vertices)); vertices.append((x, y, z))
        upper.append(row_u); lower.append(row_l)
    faces = []
    for rows, reverse in ((upper, False), (lower, True)):
        for zi in range(len(width_rows) - 1):
            for xi in range(len(xs) - 1):
                quad = (rows[zi][xi], rows[zi][xi+1], rows[zi+1][xi+1], rows[zi+1][xi])
                faces.append(tuple(reversed(quad)) if reverse else quad)
    for zi in range(len(width_rows) - 1):
        faces.append((upper[zi][0], upper[zi+1][0], lower[zi+1][0], lower[zi][0]))
        faces.append((upper[zi][-1], lower[zi][-1], lower[zi+1][-1], upper[zi+1][-1]))
    faces.append(tuple(reversed(upper[0] + list(reversed(lower[0])))))
    faces.append(tuple(upper[-1] + list(reversed(lower[-1]))))
    return base.create_mesh(name, vertices, faces, target, mat)


def common_running_gear(cols, mats, slug):
    wheel_col, mech = cols["07_WHEELS"], cols["08_MECHANICAL"]
    for side in (-1, 1):
        base.wheel(f"FRONT_{side:+d}", side * 0.89, -1.75, 0.36, 0.22, wheel_col, mech, mats, False)
        base.wheel(f"REAR_{side:+d}", side * 0.86, 1.85, 0.38, 0.28, wheel_col, mech, mats, True)
        for tag, z, root_x, upright_x, centre_y in (
            ("FRONT", -1.75, 0.25, 0.79, 0.36),
            ("REAR", 1.85, 0.29, 0.73, 0.38),
        ):
            sweep = 0.23 if slug == "aero-predator" else (0.17 if slug == "eds-hyper-aero" else 0.13)
            for level, y in (("LOW", centre_y - 0.105), ("HIGH", centre_y + 0.13)):
                for fore in (-1, 1):
                    base.cylinder_between(
                        f"{tag}_{level}_{fore}_{side:+d}",
                        (side * root_x, y + (0.03 if level == "HIGH" else 0), z + fore * sweep),
                        (side * upright_x, centre_y + (0.075 if level == "HIGH" else -0.07), z),
                        0.011 if slug != "precision-machine" else 0.010,
                        mech, mats["metal"], 14,
                    )
            base.cylinder_between(
                f"{tag}_PUSHROD_{side:+d}",
                (side * (root_x * 0.82), centre_y + 0.28, z - 0.07),
                (side * upright_x, centre_y + 0.02, z), 0.010, mech, mats["metal"], 14,
            )


def cockpit_and_halo(cols, mats, slug):
    cockpit, mech = cols["02_COCKPIT"], cols["08_MECHANICAL"]
    cockpit_stations = [
        (-0.66, 0, 0.60, 0.16, 0.08, 2.4),
        (-0.39, 0, 0.64, 0.25, 0.115, 2.8),
        (0.02, 0, 0.64, 0.27, 0.11, 2.8),
        (0.28, 0, 0.62, 0.19, 0.075, 2.5),
    ]
    base.loft("COCKPIT_RECESS", cockpit_stations, cockpit, mats["duct"], radial=42)
    top = (0, 0.94, -0.46)
    rear_z = 0.12 if slug != "aero-predator" else 0.07
    for side in (-1, 1):
        shoulder = (side * 0.255, 0.84, -0.30)
        base.cylinder_between(f"HALO_REAR_{side:+d}", (side * 0.26, 0.66, rear_z), shoulder, 0.031, mech, mats["metal"], 20)
        base.cylinder_between(f"HALO_CROWN_{side:+d}", shoulder, top, 0.031, mech, mats["metal"], 20)
    base.cylinder_between("HALO_FRONT", (0, 0.65, -0.65), top, 0.030, mech, mats["metal"], 20)


def wings(cols, mats, slug):
    front, rear = cols["04_FRONT_WING"], cols["05_REAR_WING"]
    if slug == "aero-predator":
        front_specs = [(-2.47, 2.00, 0.26, 0.105, 0.032, 0.11, 0.035), (-2.32, 1.78, 0.22, 0.17, 0.027, 0.065, 0.050), (-2.19, 1.50, 0.18, 0.23, 0.023, 0.02, 0.065)]
        rear_specs = [(2.27, 1.34, 0.32, 0.91, 0.046, -0.03), (2.17, 1.24, 0.25, 1.10, 0.038, 0.015)]
    elif slug == "eds-hyper-aero":
        front_specs = [(-2.46, 2.00, 0.28, 0.11, 0.036, 0.14, 0.060), (-2.30, 1.84, 0.24, 0.18, 0.031, 0.09, 0.078), (-2.16, 1.62, 0.18, 0.25, 0.025, 0.04, 0.090)]
        rear_specs = [(2.27, 1.44, 0.32, 0.89, 0.052, -0.01), (2.16, 1.38, 0.25, 1.10, 0.041, 0.03)]
    else:
        front_specs = [(-2.47, 2.00, 0.26, 0.11, 0.030, 0.06, 0.018), (-2.31, 1.72, 0.22, 0.175, 0.026, 0.035, 0.030)]
        rear_specs = [(2.28, 1.24, 0.30, 0.92, 0.042, 0.0), (2.18, 1.14, 0.23, 1.09, 0.035, 0.0)]
    for i, (z, span, chord, y, thick, sweep, dihedral) in enumerate(front_specs):
        base.airfoil(f"FRONT_ELEMENT_{i}", z, span, chord, y, thick, front, mats["carbon"], 39, 18, sweep, dihedral)
    for side in (-1, 1):
        cant = -0.035 if slug == "aero-predator" else (0.025 if slug == "eds-hyper-aero" else 0)
        # Keep bevel/cant inside the tyre-defined +/-1.00 m locked envelope.
        plate = base.rounded_box(f"FRONT_ENDPLATE_{side:+d}", (side * 0.973, 0.20, -2.42), (0.032, 0.27, 0.34), front, mats["carbon"], 0.008)
        plate.rotation_euler[1] = side * cant
        base.cylinder_between(f"FRONT_PYLON_{side:+d}", (side * 0.095, 0.285, -2.10), (side * 0.095, 0.16, -2.39), 0.014, front, mats["metal"], 14)
    for i, (z, span, chord, y, thick, sweep) in enumerate(rear_specs):
        base.airfoil(f"REAR_ELEMENT_{i}", z, span, chord, y, thick, rear, mats["carbon"], 31, 18, sweep, 0)
    plate_height = 0.40 if slug == "eds-hyper-aero" else (0.31 if slug == "precision-machine" else 0.36)
    plate_y = 0.98 if slug == "eds-hyper-aero" else 0.99
    for side in (-1, 1):
        base.rounded_box(f"REAR_ENDPLATE_{side:+d}", (side * (rear_specs[0][1] / 2 - 0.012), plate_y, 2.28), (0.028, plate_height, 0.34), rear, mats["carbon"], 0.008)
    if slug == "eds-hyper-aero":
        base.cylinder_between("REAR_CENTRAL_SUPPORT", (0, 0.43, 1.68), (0, 0.89, 2.20), 0.031, rear, mats["metal"], 18)
        for side in (-1, 1):
            base.cylinder_between(f"REAR_SUPPORT_V_{side:+d}", (side * 0.14, 0.45, 1.72), (0, 0.82, 2.10), 0.014, rear, mats["metal"], 16)
    else:
        root_x = 0.24 if slug == "aero-predator" else 0.12
        for side in (-1, 1):
            base.cylinder_between(f"REAR_SUPPORT_{side:+d}", (side * root_x, 0.43, 1.69), (side * root_x, 0.89, 2.20), 0.020, rear, mats["metal"], 16)
    # A full-width integrated upper vane defines the exact 1.18 m envelope;
    # unlike the rejected floating marker, it terminates at both endplates.
    base.rounded_box("REAR_UPPER_VANE", (0, 1.155, rear_specs[1][0]), (rear_specs[1][1], 0.05, 0.07), rear, mats["carbon"], 0.005)


def build_predator(cols, mats):
    body, pods, floor = cols["01_BODY"], cols["03_SIDEPODS"], cols["06_FLOOR_DIFFUSER"]
    base.loft("PREDATOR_SPINE", [
        (-2.48,0,0.275,0.028,0.025,3.4),(-2.12,0,0.305,0.075,0.052,3.8),
        (-1.66,0,0.355,0.15,0.095,3.5),(-1.04,0,0.43,0.25,0.15,3.1),
        (-0.48,0,0.49,0.30,0.18,3.2),(0.06,0,0.50,0.29,0.19,3.4),
        (0.52,0,0.55,0.22,0.25,3.0),(1.02,0,0.50,0.15,0.20,3.2),
        (1.53,0,0.405,0.08,0.105,3.0),(1.92,0,0.355,0.035,0.045,2.5)], body, mats["clay"], radial=52)
    stations = [(-0.55,0.43,0.47,0.07,0.12,3.8),(-0.34,0.50,0.47,0.17,0.17,4.0),
                (0.08,0.53,0.44,0.20,0.15,4.2),(0.52,0.48,0.40,0.17,0.12,4.0),
                (0.96,0.38,0.37,0.12,0.09,3.6),(1.38,0.27,0.36,0.055,0.055,3.0)]
    for side in (-1,1):
        side_loft("PREDATOR_SIDEPOD", side, stations, pods, mats["clay"], 44)
        base.curve_tube(f"PREDATOR_BLADE_{side:+d}", [(side*.64,.30,-.30),(side*.68,.25,.22),(side*.62,.21,.75),(side*.48,.20,1.15)], .012, pods, mats["carbon"], False, 2)
        base.rounded_box(f"PREDATOR_INLET_{side:+d}", (side*.55,.47,-.48), (.20,.23,.055), pods, mats["duct"], .025)
    base.loft("PREDATOR_ENGINE_FIN", [(0.22,0,.64,.12,.12,2.5),(0.50,0,.78,.11,.19,2.2),(0.82,0,.72,.09,.17,2.2),(1.28,0,.56,.055,.10,2.4),(1.70,0,.43,.025,.045,2.0)], pods, mats["clay"], radial=40)
    floor_plan("PREDATOR_VENTURI", [(-1.08,.48),(-.55,.66),(0,.71),(.65,.68),(1.20,.62),(2.30,.58)], floor, mats["carbon"], "predator")
    for x in (-.38,0,.38): base.rounded_box(f"PREDATOR_DIFFUSER_{x:+.2f}",(x,.19,2.05),(.018,.22,.50),floor,mats["carbon"],.004)


def build_hyper(cols, mats):
    body, pods, floor = cols["01_BODY"], cols["03_SIDEPODS"], cols["06_FLOOR_DIFFUSER"]
    base.loft("HYPER_MONOCOQUE", [
        (-2.48,0,.29,.030,.030,2.2),(-2.08,0,.34,.085,.065,2.4),(-1.62,0,.40,.17,.12,2.5),
        (-1.00,0,.49,.27,.18,2.4),(-.42,0,.53,.32,.21,2.4),(.18,0,.54,.31,.22,2.5),
        (.62,0,.58,.23,.28,2.2),(1.05,0,.52,.16,.21,2.2),(1.49,0,.43,.09,.12,2.1),(1.92,0,.36,.035,.05,2.0)], body,mats["clay"],radial=56)
    stations = [(-.58,.42,.46,.08,.12,2.4),(-.34,.51,.49,.19,.20,2.5),(.05,.53,.48,.23,.20,2.5),
                (.43,.50,.44,.22,.17,2.4),(.82,.43,.39,.18,.13,2.3),(1.18,.33,.37,.12,.09,2.2),(1.48,.25,.37,.055,.055,2.0)]
    for side in (-1,1):
        side_loft("HYPER_SIDEPOD",side,stations,pods,mats["clay"],50)
        base.curve_tube(f"HYPER_SHOULDER_{side:+d}",[(side*.53,.64,-.30),(side*.65,.61,.10),(side*.62,.52,.55),(side*.48,.43,1.02),(side*.30,.39,1.38)],.014,pods,mats["clay_dark"],False,3)
        base.curve_tube(f"HYPER_UNDERCUT_{side:+d}",[(side*.59,.31,-.33),(side*.69,.22,.06),(side*.67,.18,.48),(side*.56,.18,.93),(side*.38,.22,1.28)],.010,pods,mats["carbon"],False,2)
        base.rounded_box(f"HYPER_INLET_{side:+d}",(side*.55,.48,-.50),(.22,.25,.060),pods,mats["duct"],.030)
    base.loft("HYPER_ENGINE_COVER",[(.18,0,.66,.14,.14,2.2),(.47,0,.84,.14,.23,2.0),(.72,0,.89,.115,.22,2.0),(1.08,0,.69,.08,.16,2.1),(1.46,0,.49,.045,.08,2.0),(1.78,0,.40,.022,.035,2.0)],pods,mats["clay"],radial=48)
    floor_plan("HYPER_CHANNEL_FLOOR",[(-1.08,.45),(-.62,.64),(-.12,.72),(.42,.70),(.88,.64),(1.35,.66),(2.30,.58)],floor,mats["carbon"],"hyper")
    for x in (-.50,-.18,.18,.50): base.curve_tube(f"HYPER_DIFFUSER_{x:+.2f}",[(x,.10,1.35),(x*.96,.16,1.72),(x*.94,.29,2.28)],.009,floor,mats["carbon"],False,2)


def build_precision(cols, mats):
    body, pods, floor = cols["01_BODY"], cols["03_SIDEPODS"], cols["06_FLOOR_DIFFUSER"]
    base.loft("PRECISION_CENTREBODY",[
        (-2.48,0,.285,.028,.025,3.0),(-2.04,0,.325,.07,.055,3.2),(-1.58,0,.375,.15,.10,3.3),
        (-.94,0,.46,.25,.16,3.2),(-.38,0,.505,.30,.19,3.4),(.16,0,.51,.29,.20,3.4),
        (.58,0,.55,.21,.25,3.0),(.98,0,.49,.15,.19,3.1),(1.42,0,.415,.085,.11,3.0),(1.88,0,.355,.032,.045,2.5)],body,mats["clay"],radial=52)
    stations=[(-.50,.42,.455,.055,.10,3.2),(-.27,.49,.46,.16,.16,3.4),(.10,.50,.43,.18,.15,3.4),(.48,.45,.395,.15,.115,3.3),(.82,.36,.375,.105,.08,3.2),(1.18,.29,.37,.07,.06,3.0),(1.45,.24,.365,.04,.04,2.8)]
    for side in (-1,1):
        side_loft("PRECISION_SIDEPOD",side,stations,pods,mats["clay"],44)
        base.rounded_box(f"PRECISION_INLET_{side:+d}",(side*.52,.465,-.44),(.17,.19,.050),pods,mats["duct"],.022)
        base.curve_tube(f"PRECISION_CHARACTER_{side:+d}",[(side*.52,.56,-.20),(side*.57,.53,.25),(side*.49,.45,.70),(side*.34,.40,1.12)],.007,pods,mats["clay_dark"],False,2)
    base.loft("PRECISION_ENGINE_SPINE",[(.24,0,.63,.115,.11,2.8),(.49,0,.77,.11,.19,2.6),(.72,0,.79,.09,.18,2.5),(1.08,0,.62,.065,.13,2.7),(1.45,0,.47,.038,.07,2.5),(1.76,0,.39,.018,.03,2.2)],pods,mats["clay"],radial=42)
    floor_plan("PRECISION_FLOOR",[(-1.08,.43),(-.58,.61),(-.10,.66),(.55,.64),(1.16,.61),(2.30,.58)],floor,mats["carbon"],"precision")
    for x in (-.42,0,.42): base.rounded_box(f"PRECISION_DIFFUSER_{x:+.2f}",(x,.18,2.05),(.014,.18,.48),floor,mats["carbon"],.003)


def build_scene(slug):
    base.reset_scene()
    cols = collections()
    mats = make_materials(slug)
    if slug == "aero-predator": build_predator(cols, mats)
    elif slug == "eds-hyper-aero": build_hyper(cols, mats)
    else: build_precision(cols, mats)
    cockpit_and_halo(cols, mats, slug)
    wings(cols, mats, slug)
    common_running_gear(cols, mats, slug)
    return cols, mats


def render(camera, slug, mats):
    concept_dir = EVIDENCE / slug
    concept_dir.mkdir(parents=True, exist_ok=True)
    reflective = base.material("DIAGNOSTIC_REFLECTIVE", (0.13, 0.16, 0.19), 0.72, 0.13)
    scene = bpy.context.scene
    for mode, override in (("clay", None), ("reflective", reflective)):
        scene.view_layers[0].material_override = override
        for view, (position, target) in CAMERAS.items():
            base.set_camera(camera, position, target)
            scene.render.filepath = str(concept_dir / f"{view}-{mode}.png")
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


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    EVIDENCE.mkdir(parents=True, exist_ok=True)
    manifest = {"locks": LOCKS, "concepts": {}, "blenderVersion": bpy.app.version_string,
                "coordinateSystem": "+Y up, -Z front, +Z rear, X centreline",
                "scope": "silhouette concepts only; no PBR, LOD or production integration"}
    for slug, metadata in CONCEPTS.items():
        cols, mats = build_scene(slug)
        report = base.measure_scene(cols)
        report.update(metadata)
        report["locks"] = LOCKS
        report["authorship"] = "Original EDS geometry; no third-party model imported"
        camera = base.setup_studio(mats)
        blend = OUT / f"eds-g03-{slug}.blend"
        glb = OUT / f"eds-g03-{slug}.glb"
        bpy.context.scene["eds_concept"] = metadata["label"]
        bpy.context.scene["eds_revision"] = metadata["revision"]
        bpy.context.scene["eds_status"] = "AWAITING OWNER SILHOUETTE APPROVAL"
        bpy.ops.wm.save_as_mainfile(filepath=str(blend))
        export_glb(cols, glb)
        if os.environ.get("EDS_G03_SKIP_RENDER") != "1": render(camera, slug, mats)
        digest = hashlib.sha256(glb.read_bytes()).hexdigest()
        report.update({"blend": str(blend.relative_to(ROOT)), "glb": str(glb.relative_to(ROOT)),
                       "glbBytes": glb.stat().st_size, "sha256": digest})
        (OUT / f"{slug}-geometry.json").write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
        manifest["concepts"][slug] = report
    (OUT / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(manifest, indent=2))


if __name__ == "__main__":
    main()
