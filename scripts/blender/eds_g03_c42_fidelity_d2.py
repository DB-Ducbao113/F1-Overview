"""Author the high-fidelity EDS-G03 C42-fidelity reconstruction D2.

Reproduces C42 aerodynamic architecture, aggressive stance, surface sophistication,
and multi-element aerodynamic design while strictly maintaining the locked EDS registry:
  - Length: exactly 5.050 m (min Z = -2.600 m, max Z = +2.450 m)
  - Width: <= 2.000 m (max abs(X) <= 1.000 m)
  - Height ceiling: < 1.180 m (ground plane at Y = 0.000 m)
  - Wheelbase: exactly 3.600 m (-1.750 m front, +1.850 m rear)
  - Front / rear track: exactly 1.780 m / 1.720 m
  - Front / rear wheel radius: exactly 0.360 m / 0.380 m
  - Diffuser exit width: exactly 1.160 m

Run with Blender 5.2.2 LTS:
  & 'E:\\Formula 1\\.tools\\blender-5.2.2\\blender-5.2.2-windows-x64\\blender.exe' `
    --background --factory-startup `
    --python "E:\\Formula 1\\F1-Overview\\scripts\\blender\\eds_g03_c42_fidelity_d2.py"
"""

from __future__ import annotations

import hashlib
import json
import math
import os
from pathlib import Path

import bpy
import bmesh
from mathutils import Vector, Matrix


ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "docs" / "commercialization" / "r3" / "blender-authoring" / "c42-fidelity-d2"
EVIDENCE = OUT / "evidence"
BLEND_PATH = OUT / "eds-g03-c42-fidelity-d2.blend"
GLB_PATH = OUT / "eds-g03-c42-fidelity-d2.glb"
C42_PATH = ROOT / "public" / "models" / "c42.v2.glb"
SKIP_RENDER = os.environ.get("EDS_G03_SKIP_RENDER") == "1"
RENDER_SCOPE = os.environ.get("EDS_G03_RENDER_SCOPE", "all")

LOCKS = {
    "length": 5.050,
    "width": 2.000,
    "height": 1.180,
    "wheelbase": 3.600,
    "frontAxleZ": -1.750,
    "rearAxleZ": 1.850,
    "frontTrack": 1.780,
    "rearTrack": 1.720,
    "frontWheelRadius": 0.360,
    "rearWheelRadius": 0.380,
    "frontTyreWidth": 0.220,
    "rearTyreWidth": 0.280,
    "diffuserExitWidth": 1.160,
    "bounds": {"min": [-1.0, 0.0, -2.60], "max": [1.0, 1.18, 2.45]},
}

COLLECTIONS = (
    "00_C42_REFERENCE_DEV_ONLY",
    "01_G03_MONOCOQUE_COCKPIT",
    "02_G03_FRONT_AERO",
    "03_G03_SIDEPODS_DUCTS",
    "04_G03_FLOOR_DIFFUSER",
    "05_G03_REAR_AERO",
    "06_G03_WHEELS_BRAKES",
    "07_G03_SUSPENSION",
    "08_G03_DETAIL",
    "09_LIGHTS_CAMERAS",
)


def p2b(p):
    """Project (X lateral, Y vertical up, Z rear) to Blender (X, -Z=Y front, Y=Z up)."""
    return Vector((p[0], -p[2], p[1]))


def reset():
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    for blocks in (
        bpy.data.meshes,
        bpy.data.curves,
        bpy.data.materials,
        bpy.data.cameras,
        bpy.data.lights,
    ):
        for block in list(blocks):
            blocks.remove(block)
    for col in list(bpy.data.collections):
        bpy.data.collections.remove(col)


def new_collection(name):
    col = bpy.data.collections.new(name)
    bpy.context.scene.collection.children.link(col)
    return col


def move(obj, col):
    for owner in list(obj.users_collection):
        owner.objects.unlink(obj)
    col.objects.link(obj)


def mat(name, color, metallic=0.0, roughness=0.42, emission=(0, 0, 0)):
    item = bpy.data.materials.new(name)
    item.diffuse_color = (*color, 1)
    item.use_nodes = True
    bsdf = item.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = (*color, 1)
    bsdf.inputs["Metallic"].default_value = metallic
    bsdf.inputs["Roughness"].default_value = roughness
    if any(emission):
        bsdf.inputs["Emission Color"].default_value = (*emission, 1)
        bsdf.inputs["Emission Strength"].default_value = 2.5
    return item


def tag(obj, assembly):
    obj["eds_owned"] = True
    obj["assembly"] = assembly
    obj["provenance"] = "Original Podium EDS D2 high-fidelity Blender authoring; C42 geometric reference"
    return obj


def mesh_obj(name, verts, faces, col, material, smooth=True):
    mesh = bpy.data.meshes.new(name + "_MESH")
    mesh.from_pydata([p2b(v) for v in verts], [], faces)
    mesh.update(calc_edges=True)
    obj = bpy.data.objects.new(name, mesh)
    col.objects.link(obj)
    if material:
        mesh.materials.append(material)
    for polygon in mesh.polygons:
        polygon.use_smooth = smooth
    return tag(obj, col.name)


def cylinder(name, p1, p2, radius, col, material, segments=32):
    v1, v2 = Vector(p1), Vector(p2)
    axis = v2 - v1
    length = axis.length
    if length < 1e-6:
        return None
    dir_v = axis.normalized()
    ref = Vector((0, 1, 0)) if abs(dir_v.y) < 0.9 else Vector((1, 0, 0))
    u = dir_v.cross(ref).normalized()
    w = dir_v.cross(u).normalized()

    verts = []
    for i in range(segments):
        a = 2 * math.pi * i / segments
        ca, sa = math.cos(a), math.sin(a)
        offset = (u * ca + w * sa) * radius
        verts.append(v1 + offset)
    for i in range(segments):
        a = 2 * math.pi * i / segments
        ca, sa = math.cos(a), math.sin(a)
        offset = (u * ca + w * sa) * radius
        verts.append(v2 + offset)

    faces = []
    for i in range(segments):
        nxt = (i + 1) % segments
        faces.append((i, nxt, segments + nxt, segments + i))
    faces.append(tuple(reversed(range(segments))))
    faces.append(tuple(segments + i for i in range(segments)))
    return mesh_obj(name, verts, faces, col, material)


def rounded_box(name, center, size, col, material, bevel=0.02):
    cx, cy, cz = center
    sx, sy, sz = size[0] * 0.5, size[1] * 0.5, size[2] * 0.5

    verts = []
    for dx in (-1, 1):
        for dy in (-1, 1):
            for dz in (-1, 1):
                verts.append((
                    cx + dx * sx,
                    cy + dy * sy,
                    cz + dz * sz,
                ))
    faces = [
        (0, 1, 3, 2),  # -X
        (4, 6, 7, 5),  # +X
        (0, 4, 5, 1),  # -Y
        (2, 3, 7, 6),  # +Y
        (0, 2, 6, 4),  # -Z
        (1, 5, 7, 3),  # +Z
    ]
    return mesh_obj(name, verts, faces, col, material)


def general_loft(name, section_polys, col, material, caps=True):
    n_sections = len(section_polys)
    radial = len(section_polys[0])
    verts = []
    for sec in section_polys:
        for pt in sec:
            verts.append(pt)
    faces = []
    for s in range(n_sections - 1):
        s_curr = s * radial
        s_next = (s + 1) * radial
        for r in range(radial):
            r_nxt = (r + 1) % radial
            faces.append((
                s_curr + r,
                s_curr + r_nxt,
                s_next + r_nxt,
                s_next + r,
            ))
    if caps:
        faces.append(tuple(reversed(range(radial))))
        last_start = (n_sections - 1) * radial
        faces.append(tuple(last_start + i for i in range(radial)))
    return mesh_obj(name, verts, faces, col, material)


def superellipse(a, rx, ry, exponent=2.0):
    c, s = math.cos(a), math.sin(a)
    power = 2.0 / exponent
    return (
        math.copysign(abs(c) ** power, c) * rx,
        math.copysign(abs(s) ** power, s) * ry,
    )


def loft(name, stations, col, material, radial=72, caps=True):
    """Longitudinal closed loft. station=(z,cx,cy,rx,ry,exponent)."""
    verts = []
    for z, cx, cy, rx, ry, exponent in stations:
        for ring in range(radial):
            dx, dy = superellipse(2 * math.pi * ring / radial, rx, ry, exponent)
            verts.append((cx + dx, cy + dy, z))
    faces = []
    for s in range(len(stations) - 1):
        for r in range(radial):
            n = (r + 1) % radial
            a = s * radial + r
            faces.append((a, s * radial + n, (s + 1) * radial + n, (s + 1) * radial + r))
    if caps:
        faces.append(tuple(reversed(range(radial))))
        start = (len(stations) - 1) * radial
        faces.append(tuple(start + i for i in range(radial)))
    return mesh_obj(name, verts, faces, col, material)


def tube(name, points, radius, col, material, resolution=4):
    data = bpy.data.curves.new(name + "_CURVE", "CURVE")
    data.dimensions = "3D"
    data.resolution_u = 16
    data.bevel_depth = radius
    data.bevel_resolution = resolution
    spline = data.splines.new("BEZIER")
    spline.bezier_points.add(len(points) - 1)
    for bp, point in zip(spline.bezier_points, points):
        bp.co = p2b(point)
        bp.handle_left_type = "AUTO"
        bp.handle_right_type = "AUTO"
    obj = bpy.data.objects.new(name, data)
    col.objects.link(obj)
    if material:
        data.materials.append(material)
    return tag(obj, col.name)


def airfoil_surface(name, span_stations, col, material):
    """Creates a 3D swept aerodynamic wing surface with leading edge at z_le and
    trailing edge rearward (+Z) with zero duplicate vertices and zero degenerate triangles.
    span_stations: list of dict(z_le, y, chord, span_x, camber, angle_deg)
    """
    n_pts = 32
    sections = []
    for st in span_stations:
        z_le = st["z_le"]
        y_pos = st["y"]
        chord = st["chord"]
        span_x = st["span_x"]
        angle = math.radians(st.get("angle_deg", 5.0))
        camber = st.get("camber", 0.06)
        thickness = st.get("thickness", 0.12)

        sec_pts = []
        for i in range(n_pts):
            th = 2 * math.pi * i / n_pts
            t = (math.cos(th) + 1.0) * 0.5
            yt = 5 * thickness * (
                0.2969 * math.sqrt(max(t, 0))
                - 0.1260 * t
                - 0.3516 * (t**2)
                + 0.2843 * (t**3)
                - 0.1015 * (t**4)
            )
            yc = camber * (2 * t - t**2)
            x_local = t * chord
            if th <= math.pi:  # Upper surface
                y_local = (yc + yt) * chord + 0.0015 * t * chord
            else:  # Lower surface
                y_local = (yc - yt) * chord - 0.0015 * t * chord
            cos_a, sin_a = math.cos(angle), math.sin(angle)
            rot_z = x_local * cos_a - y_local * sin_a
            rot_y = x_local * sin_a + y_local * cos_a
            sec_pts.append((span_x, y_pos + rot_y, z_le + rot_z))

        sections.append(sec_pts)

    return general_loft(name, sections, col, material, caps=True)


# ---------------------------------------------------------------------------
# C42 Reference Loading
# ---------------------------------------------------------------------------

def build_reference(cols, materials):
    before = set(bpy.context.scene.objects)
    bpy.ops.import_scene.gltf(filepath=str(C42_PATH))
    imported = [o for o in bpy.context.scene.objects if o not in before]
    meshes = [o for o in imported if o.type == "MESH"]
    for obj in imported:
        move(obj, cols["00_C42_REFERENCE_DEV_ONLY"])
        obj["reference_only"] = True
        obj["export_excluded"] = True
    model = max(meshes, key=lambda o: len(o.data.polygons))
    for obj in meshes:
        if obj is not model:
            obj.hide_render = True
            obj.hide_viewport = True

    world_matrix = model.matrix_world.copy()
    model.parent = None
    model.matrix_world = world_matrix

    points = [model.matrix_world @ Vector(c) for c in model.bound_box]
    source_min = Vector([min(p[i] for p in points) for i in range(3)])
    source_max = Vector([max(p[i] for p in points) for i in range(3)])
    source_size = source_max - source_min
    scale = LOCKS["length"] / max(source_size)
    model.scale = tuple(component * scale for component in model.scale)
    bpy.context.view_layer.update()

    points = [model.matrix_world @ Vector(c) for c in model.bound_box]
    mn = Vector([min(p[i] for p in points) for i in range(3)])
    mx = Vector([max(p[i] for p in points) for i in range(3)])
    center = (mn + mx) * 0.5
    model.location -= Vector((center.x, center.y, mn.z))
    for slot in model.material_slots:
        slot.material = materials["reference"]
    return {
        "asset": str(C42_PATH.relative_to(ROOT)),
        "blendSourceFound": False,
        "sourceMeshes": len(meshes),
        "sourceVertices": sum(len(o.data.vertices) for o in meshes),
        "sourcePolygons": sum(len(o.data.polygons) for o in meshes),
        "sourceTriangles": sum(len(p.vertices) - 2 for o in meshes for p in o.data.polygons),
        "sourceBounds": {"min": list(source_min), "max": list(source_max), "size": list(source_size)},
        "normalizationScale": scale,
        "measurementClassification": "directly measured from imported GLB; normalized for visual comparison",
        "notes": "C42 geometry remains in DEV-only reference collection and is excluded from EDS export",
    }


# ---------------------------------------------------------------------------
# Assembly Builders
# ---------------------------------------------------------------------------

def build_monocoque_and_cockpit(cols, m):
    """Priority 2: Chiseled F1 monocoque, recessed cockpit tub, headrest collar,

    racing steering wheel, structural halo with aerodynamic blade and crown fairing,
    and airbox with rollover hoop.
    """
    body = cols["01_G03_MONOCOQUE_COCKPIT"]

    # 1. Main Monocoque with faceted F1 cross-sections from nose bulkhead to cockpit
    loft("G03_MONOCOQUE_CHASSIS", [
        (-2.48, 0, 0.28, 0.055, 0.045, 2.4),
        (-2.25, 0, 0.32, 0.085, 0.065, 2.6),
        (-1.95, 0, 0.37, 0.135, 0.095, 2.8),
        (-1.75, 0, 0.42, 0.190, 0.130, 3.0),  # Front axle station
        (-1.40, 0, 0.48, 0.260, 0.170, 3.2),
        (-1.05, 0, 0.53, 0.330, 0.210, 3.2),  # Front bulkhead
        (-0.70, 0, 0.56, 0.380, 0.240, 3.3),  # Cockpit front
        (-0.35, 0, 0.55, 0.410, 0.250, 3.4),  # Cockpit mid
        (0.00, 0, 0.52, 0.420, 0.250, 3.3),   # Driver seat station
        (0.30, 0, 0.49, 0.390, 0.230, 3.1),   # Cockpit rear bulkhead
        (0.60, 0, 0.46, 0.350, 0.200, 2.8),
    ], body, m["clay"], radial=72)

    # 2. Raised Cockpit Surround / Headrest Protection Collar (FIA safety coaming)
    for side in (-1, 1):
        tube(f"COCKPIT_RIM_COLLAR_{side:+d}", [
            (side * 0.18, 0.65, -0.65),
            (side * 0.25, 0.69, -0.30),
            (side * 0.26, 0.70, 0.00),
            (side * 0.22, 0.68, 0.32),
            (side * 0.12, 0.64, 0.42),
        ], 0.020, body, m["carbon"], resolution=4)

    # 3. Recessed Cockpit Interior Tub & Reclined Racing Seat
    loft("COCKPIT_INTERIOR_TUB", [
        (-0.68, 0, 0.60, 0.19, 0.08, 2.4),
        (-0.38, 0, 0.62, 0.24, 0.14, 2.8),
        (0.00, 0, 0.61, 0.26, 0.16, 2.9),
        (0.28, 0, 0.56, 0.22, 0.13, 2.6),
        (0.42, 0, 0.52, 0.16, 0.08, 2.2),
    ], body, m["interior"], radial=56)

    # Carbon Seat & Headrest Cushion
    rounded_box("DRIVER_SEAT_BASE", (0, 0.28, -0.05), (0.34, 0.10, 0.55), body, m["seat"], 0.03)
    rounded_box("DRIVER_SEAT_BACKREST", (0, 0.46, 0.18), (0.32, 0.38, 0.10), body, m["seat"], 0.03)
    rounded_box("DRIVER_HEADREST_PAD", (0, 0.66, 0.26), (0.22, 0.14, 0.08), body, m["seat"], 0.02)

    # 4. Multi-Function Digital Racing Steering Wheel
    rounded_box("STEERING_WHEEL_YOKE", (0, 0.55, -0.42), (0.24, 0.14, 0.024), body, m["carbon"], 0.008)
    for side in (-1, 1):
        cylinder(f"STEERING_GRIP_{side:+d}", (side * 0.11, 0.49, -0.42), (side * 0.11, 0.61, -0.42), 0.015, body, m["dark"], 20)
    rounded_box("STEERING_DIGITAL_DISPLAY", (0, 0.57, -0.435), (0.10, 0.055, 0.008), body, m["screen"], 0.003)
    cylinder("STEERING_COLUMN", (0, 0.55, -0.42), (0, 0.52, -0.58), 0.018, body, m["metal"], 20)

    # 5. Halo Assembly: Front blade, aerodynamic hoop crown, and sharp rear mounts
    front_pylon_pts = [
        (0, 0.56, -0.68),
        (0, 0.68, -0.52),
        (0, 0.82, -0.36),
    ]
    tube("HALO_FRONT_PYLON", front_pylon_pts, 0.018, body, m["halo"], resolution=4)
    halo_crown_pts = [
        (-0.18, 0.66, 0.34),   # Left rear mount
        (-0.24, 0.74, 0.12),
        (-0.25, 0.81, -0.12),  # Left shoulder
        (0.00, 0.83, -0.34),   # Front junction with blade
        (0.25, 0.81, -0.12),   # Right shoulder
        (0.24, 0.74, 0.12),
        (0.18, 0.66, 0.34),    # Right rear mount
    ]
    tube("HALO_CROWN_HOOP", halo_crown_pts, 0.022, body, m["halo"], resolution=4)
    rounded_box("HALO_AERO_VORTEX_FIN", (0, 0.86, -0.28), (0.012, 0.028, 0.06), body, m["halo"], 0.004)
    for side in (-1, 1):
        cylinder(f"HALO_REAR_MOUNT_LUG_{side:+d}", (side * 0.18, 0.66, 0.34), (side * 0.20, 0.58, 0.36), 0.024, body, m["metal"], 20)

    # 6. Airbox & Structural Rollover Hoop
    airbox_stations = [
        (0.08, 0, 0.82, 0.12, 0.09, 2.2),
        (0.25, 0, 0.86, 0.15, 0.12, 2.4),
        (0.50, 0, 0.88, 0.18, 0.14, 2.6),
        (0.80, 0, 0.87, 0.16, 0.12, 2.6),
    ]
    loft("AIRBOX_INTAKE_SCOOP", airbox_stations, body, m["clay"], radial=56)
    rounded_box("AIRBOX_INTERNAL_SPLITTER", (0, 0.84, 0.15), (0.008, 0.11, 0.14), body, m["carbon"], 0.002)


def build_front_aero_and_nose(cols, m):
    """Priority 3: Front wing elements with leading edge starting at exactly Z = -2.600 m,

    aerodynamic nose pylons, endplates with footplate and dive planes, dual FOM cameras,
    and pitot tube.
    """
    front = cols["02_G03_FRONT_AERO"]

    # 1. Front Wing Airfoil Elements (4 cascaded 3D aerodynamic elements)
    # Element 1: Mainplane (Center LE at exactly Z = -2.600 m, chord 0.30 m => TE at -2.30 m)
    main_stations = [
        {"span_x": -0.89, "z_le": -2.48, "y": 0.13, "chord": 0.26, "camber": 0.05, "angle_deg": 6.0},
        {"span_x": -0.50, "z_le": -2.54, "y": 0.10, "chord": 0.28, "camber": 0.07, "angle_deg": 7.0},
        {"span_x": 0.00, "z_le": -2.600, "y": 0.085, "chord": 0.30, "camber": 0.08, "angle_deg": 8.0},
        {"span_x": 0.50, "z_le": -2.54, "y": 0.10, "chord": 0.28, "camber": 0.07, "angle_deg": 7.0},
        {"span_x": 0.89, "z_le": -2.48, "y": 0.13, "chord": 0.26, "camber": 0.05, "angle_deg": 6.0},
    ]
    airfoil_surface("FRONT_WING_MAINPLANE", main_stations, front, m["carbon"])

    # Element 2: Secondary Flap
    flap1_stations = [
        {"span_x": -0.87, "z_le": -2.38, "y": 0.16, "chord": 0.22, "camber": 0.05, "angle_deg": 10.0},
        {"span_x": -0.42, "z_le": -2.42, "y": 0.14, "chord": 0.24, "camber": 0.06, "angle_deg": 12.0},
        {"span_x": 0.00, "z_le": -2.46, "y": 0.125, "chord": 0.25, "camber": 0.07, "angle_deg": 13.0},
        {"span_x": 0.42, "z_le": -2.42, "y": 0.14, "chord": 0.24, "camber": 0.06, "angle_deg": 12.0},
        {"span_x": 0.87, "z_le": -2.38, "y": 0.16, "chord": 0.22, "camber": 0.05, "angle_deg": 10.0},
    ]
    airfoil_surface("FRONT_WING_FLAP_1", flap1_stations, front, m["clay"])

    # Element 3: Tertiary Flap
    flap2_stations = [
        {"span_x": -0.84, "z_le": -2.28, "y": 0.19, "chord": 0.18, "camber": 0.04, "angle_deg": 14.0},
        {"span_x": -0.38, "z_le": -2.31, "y": 0.18, "chord": 0.19, "camber": 0.05, "angle_deg": 16.0},
        {"span_x": 0.00, "z_le": -2.34, "y": 0.165, "chord": 0.20, "camber": 0.06, "angle_deg": 17.0},
        {"span_x": 0.38, "z_le": -2.31, "y": 0.18, "chord": 0.19, "camber": 0.05, "angle_deg": 16.0},
        {"span_x": 0.84, "z_le": -2.28, "y": 0.19, "chord": 0.18, "camber": 0.04, "angle_deg": 14.0},
    ]
    airfoil_surface("FRONT_WING_FLAP_2", flap2_stations, front, m["clay"])

    # Element 4: Upper Adjustable Flap with Gurney flap notch
    flap3_stations = [
        {"span_x": -0.80, "z_le": -2.20, "y": 0.22, "chord": 0.14, "camber": 0.03, "angle_deg": 18.0},
        {"span_x": -0.32, "z_le": -2.22, "y": 0.22, "chord": 0.15, "camber": 0.04, "angle_deg": 20.0},
        {"span_x": 0.00, "z_le": -2.24, "y": 0.205, "chord": 0.16, "camber": 0.05, "angle_deg": 22.0},
        {"span_x": 0.32, "z_le": -2.22, "y": 0.22, "chord": 0.15, "camber": 0.04, "angle_deg": 20.0},
        {"span_x": 0.80, "z_le": -2.20, "y": 0.22, "chord": 0.14, "camber": 0.03, "angle_deg": 18.0},
    ]
    airfoil_surface("FRONT_WING_UPPER_FLAP", flap3_stations, front, m["carbon"])

    # 2. Nose Support Pylons
    for side in (-1, 1):
        pylon_pts = [
            (side * 0.075, 0.18, -2.42),
            (side * 0.082, 0.28, -2.28),
            (side * 0.090, 0.36, -2.12),
        ]
        tube(f"NOSE_PYLON_{side:+d}", pylon_pts, 0.016, front, m["carbon"], resolution=3)

    # 3. Sculpted Aerodynamic Endplates with Outward Flare, Cutout & Footplate
    for side in (-1, 1):
        x_base = side * 0.90
        rounded_box(f"FRONT_ENDPLATE_{side:+d}", (x_base, 0.24, -2.34), (0.022, 0.30, 0.46), front, m["carbon"], 0.010)
        rounded_box(f"FRONT_FOOTPLATE_{side:+d}", (x_base + side * 0.020, 0.095, -2.34), (0.040, 0.016, 0.44), front, m["carbon"], 0.005)
        rounded_box(f"FRONT_DIVE_PLANE_{side:+d}", (x_base + side * 0.030, 0.26, -2.32), (0.050, 0.012, 0.18), front, m["carbon"], 0.004)
        for sep_idx, sep_z in enumerate((-2.38, -2.26, -2.16)):
            cylinder(f"WING_GAP_SEPARATOR_{side:+d}_{sep_idx}", (side * 0.48, 0.12, sep_z), (side * 0.48, 0.24, sep_z), 0.005, front, m["metal"], 12)

    # 4. Nose Details: Dual FOM TV Camera Pods & Pitot Sensor
    for side in (-1, 1):
        rounded_box(f"FOM_CAMERA_POD_{side:+d}", (side * 0.16, 0.44, -1.92), (0.055, 0.038, 0.12), front, m["dark"], 0.008)
        cylinder(f"FOM_CAMERA_STEM_{side:+d}", (side * 0.12, 0.42, -1.92), (side * 0.16, 0.44, -1.92), 0.006, front, m["carbon"], 12)
    cylinder("PITOT_SENSOR_TUBE", (0, 0.42, -2.48), (0, 0.42, -2.59), 0.006, front, m["metal"], 16)


def build_sidepods_and_engine_cover(cols, m):
    """Priority 4: Predatory sidepod inlet with aggressive upper leading overbite,

    deep sculpted forward undercut, downwash ramp deck with cooling louvres,
    tight coke-bottle waist, and engine cover dorsal shark fin.
    """
    ducts = cols["03_G03_SIDEPODS_DUCTS"]
    rear_aero = cols["05_G03_REAR_AERO"]

    sidepod_stations = [
        (-0.72, 0.46, 0.46, 0.18, 0.14, 2.6),
        (-0.45, 0.55, 0.48, 0.23, 0.18, 3.0),
        (-0.15, 0.62, 0.49, 0.27, 0.20, 3.2),
        (0.20, 0.63, 0.48, 0.28, 0.20, 3.2),
        (0.60, 0.58, 0.44, 0.26, 0.18, 3.0),
        (1.00, 0.49, 0.39, 0.21, 0.16, 2.8),
        (1.35, 0.38, 0.34, 0.16, 0.13, 2.5),
        (1.68, 0.28, 0.30, 0.11, 0.10, 2.3),
    ]
    for side in (-1, 1):
        loft(
            f"G03_SIDEPOD_SHELL_{side:+d}",
            [(z, side * cx, cy, rx, ry, ex) for z, cx, cy, rx, ry, ex in sidepod_stations],
            ducts,
            m["clay"],
            radial=64,
        )

        rounded_box(f"SIDEPOD_OVERBITE_LIP_{side:+d}", (side * 0.46, 0.56, -0.74), (0.28, 0.035, 0.08), ducts, m["carbon"], 0.012)
        rounded_box(f"RADIATOR_THROAT_CORE_{side:+d}", (side * 0.46, 0.46, -0.68), (0.24, 0.18, 0.04), ducts, m["dark"], 0.008)

        tube(f"SIDEPOD_UNDERCUT_CHINE_{side:+d}", [
            (side * 0.32, 0.28, -0.70),
            (side * 0.38, 0.26, -0.30),
            (side * 0.42, 0.26, 0.15),
            (side * 0.36, 0.27, 0.70),
            (side * 0.26, 0.28, 1.25),
        ], 0.024, ducts, m["carbon"], resolution=3)

        for l_idx in range(7):
            l_z = -0.10 + l_idx * 0.12
            l_x = side * (0.42 + l_idx * 0.015)
            l_y = 0.58 - l_idx * 0.022
            rounded_box(
                f"COOLING_LOUVRE_{side:+d}_{l_idx}",
                (l_x, l_y, l_z),
                (0.085, 0.008, 0.035),
                ducts,
                m["dark"],
                0.002,
            )

    loft("ENGINE_COVER_SPINE", [
        (0.60, 0, 0.68, 0.18, 0.16, 2.4),
        (0.95, 0, 0.62, 0.14, 0.15, 2.3),
        (1.30, 0, 0.56, 0.11, 0.14, 2.2),
        (1.65, 0, 0.48, 0.08, 0.12, 2.2),
        (1.90, 0, 0.42, 0.06, 0.08, 2.0),
    ], rear_aero, m["clay"], radial=48)

    rounded_box("DORSAL_SHARK_FIN", (0, 0.72, 1.15), (0.016, 0.32, 1.45), rear_aero, m["carbon"], 0.004)
    cylinder("COOLING_EXIT_CANNON", (0, 0.44, 1.65), (0, 0.44, 1.88), 0.065, rear_aero, m["dark"], 24)
    cylinder("EXHAUST_TAILPIPE", (0, 0.40, 1.82), (0, 0.40, 1.98), 0.045, rear_aero, m["metal"], 24)


def build_floor_and_diffuser(cols, m):
    """Priority 5: Ground-effect Venturi floor with forward bib splitter,

    4 curved 3D leading-edge floor fences (strakes) per side, stepped floor edges
    with longitudinal edge wings, expanding diffuser with 4 vertical divider strakes,
    and rear crash structure with FIA rain light.
    """
    col = cols["04_G03_FLOOR_DIFFUSER"]

    # 1. Main Ground-Effect Floor (Venturi underbody)
    loft("VENTURI_FLOOR_UNDERBODY", [
        (-1.25, 0, 0.065, 0.38, 0.025, 3.6),
        (-0.75, 0, 0.055, 0.68, 0.025, 3.8),
        (-0.25, 0, 0.045, 0.76, 0.025, 4.0),
        (0.35, 0, 0.050, 0.76, 0.028, 4.0),
        (0.95, 0, 0.065, 0.70, 0.035, 3.8),
        (1.45, 0, 0.120, 0.62, 0.065, 3.4),
        (1.95, 0, 0.220, 0.58, 0.110, 3.0),
        (2.32, 0, 0.320, 0.58, 0.160, 2.8),  # Exit at exactly 1.160 m width (±0.58 m)
    ], col, m["carbon"], radial=64)

    rounded_box("TEA_TRAY_BIB_SPLITTER", (0, 0.065, -1.35), (0.48, 0.018, 0.28), col, m["carbon"], 0.005)
    cylinder("TEA_TRAY_CENTRAL_STAY", (0, 0.075, -1.32), (0, 0.36, -1.32), 0.008, col, m["metal"], 16)

    for side in (-1, 1):
        for s_idx, (s_x, s_z, s_len) in enumerate((
            (0.18, -0.85, 0.42),
            (0.34, -0.82, 0.48),
            (0.50, -0.78, 0.52),
            (0.66, -0.72, 0.56),
        )):
            rounded_box(
                f"FLOOR_STRAKE_{side:+d}_{s_idx}",
                (side * s_x, 0.12, s_z),
                (0.012, 0.14, s_len),
                col,
                m["carbon"],
                0.003,
            )

    for side in (-1, 1):
        tube(f"FLOOR_EDGE_WING_{side:+d}", [
            (side * 0.68, 0.085, -0.65),
            (side * 0.74, 0.095, -0.15),
            (side * 0.73, 0.105, 0.40),
            (side * 0.69, 0.120, 0.95),
            (side * 0.63, 0.150, 1.45),
        ], 0.015, col, m["carbon"], resolution=3)
        for stay_idx, stay_z in enumerate((-0.30, 0.20, 0.75, 1.20)):
            cylinder(
                f"FLOOR_EDGE_STAY_{side:+d}_{stay_idx}",
                (side * 0.60, 0.16, stay_z),
                (side * 0.72, 0.10, stay_z),
                0.004,
                col,
                m["metal"],
                12,
            )

    # Diffuser Vertical Flow Fences (4 strakes dividing the exit, width 1.160m)
    for x_fence in (-0.46, -0.16, 0.16, 0.46):
        rounded_box(
            f"DIFFUSER_FENCE_{x_fence:+.2f}",
            (x_fence, 0.22, 1.95),
            (0.014, 0.20, 0.76),
            col,
            m["carbon"],
            0.003,
        )

    # Rear Impact Crash Structure & FIA Rain Light (Rear extent exactly Z = 2.450 m)
    rounded_box("REAR_IMPACT_CRASH_STRUCTURE", (0, 0.25, 2.22), (0.16, 0.14, 0.42), col, m["carbon"], 0.012)
    rounded_box("FIA_RAIN_SAFETY_LIGHT", (0, 0.22, 2.440), (0.075, 0.045, 0.012), col, m["taillight"], 0.002)


def build_rear_wing_and_beam_wing(cols, m):
    """Priority 5: Sculpted rear wing with spoon camber, upper flap with DRS pod,

    double-element beam wing, sculpted aerodynamic endplates, and swan-neck pylons.
    """
    rear = cols["05_G03_REAR_AERO"]

    # 1. Sculpted Rear Wing Mainplane (3D spoon camber)
    main_stations = [
        {"span_x": -0.54, "z_le": 2.05, "y": 0.88, "chord": 0.36, "camber": 0.05, "angle_deg": 12.0},
        {"span_x": -0.28, "z_le": 2.08, "y": 0.85, "chord": 0.35, "camber": 0.07, "angle_deg": 14.0},
        {"span_x": 0.00, "z_le": 2.10, "y": 0.83, "chord": 0.34, "camber": 0.08, "angle_deg": 15.0},
        {"span_x": 0.28, "z_le": 2.08, "y": 0.85, "chord": 0.35, "camber": 0.07, "angle_deg": 14.0},
        {"span_x": 0.54, "z_le": 2.05, "y": 0.88, "chord": 0.36, "camber": 0.05, "angle_deg": 12.0},
    ]
    airfoil_surface("REAR_WING_MAINPLANE", main_stations, rear, m["clay"])

    # 2. Upper Flap with DRS notch (TE at 2.43 m <= 2.45 m)
    upper_stations = [
        {"span_x": -0.52, "z_le": 2.18, "y": 0.99, "chord": 0.24, "camber": 0.04, "angle_deg": 22.0},
        {"span_x": -0.26, "z_le": 2.20, "y": 0.98, "chord": 0.23, "camber": 0.05, "angle_deg": 24.0},
        {"span_x": 0.00, "z_le": 2.22, "y": 0.97, "chord": 0.22, "camber": 0.06, "angle_deg": 25.0},
        {"span_x": 0.26, "z_le": 2.20, "y": 0.98, "chord": 0.23, "camber": 0.05, "angle_deg": 24.0},
        {"span_x": 0.52, "z_le": 2.18, "y": 0.99, "chord": 0.24, "camber": 0.04, "angle_deg": 22.0},
    ]
    airfoil_surface("REAR_WING_UPPER_FLAP", upper_stations, rear, m["clay"])

    loft("DRS_ACTUATOR_POD", [
        (2.18, 0, 0.98, 0.024, 0.024, 2.0),
        (2.28, 0, 1.01, 0.032, 0.032, 2.0),
        (2.36, 0, 1.00, 0.026, 0.026, 2.0),
        (2.42, 0, 0.99, 0.008, 0.008, 2.0),
    ], rear, m["carbon"], radial=24)

    # 3. Double-Element Beam Wing
    beam1_stations = [
        {"span_x": -0.38, "z_le": 1.95, "y": 0.44, "chord": 0.18, "camber": 0.04, "angle_deg": 14.0},
        {"span_x": 0.00, "z_le": 1.98, "y": 0.43, "chord": 0.19, "camber": 0.05, "angle_deg": 16.0},
        {"span_x": 0.38, "z_le": 1.95, "y": 0.44, "chord": 0.18, "camber": 0.04, "angle_deg": 14.0},
    ]
    airfoil_surface("BEAM_WING_ELEMENT_1", beam1_stations, rear, m["carbon"])

    beam2_stations = [
        {"span_x": -0.35, "z_le": 2.08, "y": 0.51, "chord": 0.14, "camber": 0.03, "angle_deg": 18.0},
        {"span_x": 0.00, "z_le": 2.10, "y": 0.50, "chord": 0.15, "camber": 0.04, "angle_deg": 20.0},
        {"span_x": 0.35, "z_le": 2.08, "y": 0.51, "chord": 0.14, "camber": 0.03, "angle_deg": 18.0},
    ]
    airfoil_surface("BEAM_WING_ELEMENT_2", beam2_stations, rear, m["carbon"])

    # 4. Sculpted Aerodynamic Endplates (Z bounds: [1.99, 2.43] m)
    for side in (-1, 1):
        x_ep = side * 0.55
        rounded_box(f"REAR_ENDPLATE_{side:+d}", (x_ep, 0.82, 2.21), (0.022, 0.48, 0.44), rear, m["carbon"], 0.010)
        for s_idx, s_y in enumerate((0.68, 0.78, 0.88)):
            rounded_box(f"REAR_ENDPLATE_STRAKE_{side:+d}_{s_idx}", (x_ep + side * 0.016, s_y, 2.34), (0.012, 0.014, 0.14), rear, m["carbon"], 0.003)

    # 5. Dual Swan-Neck Mounting Pylons
    for side in (-1, 1):
        pylon_pts = [
            (side * 0.12, 0.38, 1.82),
            (side * 0.12, 0.72, 2.05),
            (side * 0.12, 0.98, 2.18),
            (side * 0.12, 0.95, 2.26),
        ]
        tube(f"REAR_WING_SWAN_NECK_PYLON_{side:+d}", pylon_pts, 0.016, rear, m["metal"], resolution=4)


def build_wheels_and_brakes(cols, m):
    """Priority 1: 18-inch Formula 1 low-profile racing wheels with Pirelli-style

    slick tyres (square-shoulder flat tread), aerodynamic wheel dish covers,
    carbon brake discs, multi-piston monobloc calipers, and brake bells.
    Strictly constrained so outer extent is <= 1.000 m (max width <= 2.000 m).
    """
    wheel_col = cols["06_G03_WHEELS_BRAKES"]

    def build_wheel_assembly(name, x_pos, z_pos, radius, half_w, is_rear=False):
        rim_radius = 0.2286  # 18-inch rim (radius 9 inches)
        shoulder_r = 0.024
        flat_w = half_w - shoulder_r

        profile_pts = []
        for i in range(11):
            t = (i / 10.0) * 2.0 - 1.0
            profile_pts.append((t * flat_w, radius))
        for i in range(1, 6):
            a = (i / 5.0) * (math.pi * 0.5)
            dz = flat_w + shoulder_r * math.sin(a)
            dr = radius - shoulder_r * (1.0 - math.cos(a))
            profile_pts.append((dz, dr))
        for i in range(1, 9):
            t = i / 8.0
            dr = (radius - shoulder_r) * (1.0 - t) + rim_radius * t
            profile_pts.append((half_w, dr))
        inner_pts = [(-p[0], p[1]) for p in reversed(profile_pts[11:])]
        full_profile = inner_pts + profile_pts

        n_radial = 64
        tyre_verts = []
        for dz, dr in full_profile:
            for r_idx in range(n_radial):
                angle = 2 * math.pi * r_idx / n_radial
                ca, sa = math.cos(angle), math.sin(angle)
                tyre_verts.append((
                    x_pos + dz,
                    radius + dr * sa,
                    z_pos + dr * ca,
                ))

        tyre_faces = []
        n_prof = len(full_profile)
        for p_idx in range(n_prof - 1):
            p_curr = p_idx * n_radial
            p_next = (p_idx + 1) * n_radial
            for r_idx in range(n_radial):
                r_nxt = (r_idx + 1) % n_radial
                tyre_faces.append((
                    p_curr + r_idx,
                    p_curr + r_nxt,
                    p_next + r_nxt,
                    p_next + r_idx,
                ))
        mesh_obj(f"TYRE_{name}", tyre_verts, tyre_faces, wheel_col, m["dark"])

        # Aerodynamic 18-inch Wheel Dish Cover with Center Lock Nut
        outer_face_x = x_pos + (half_w - 0.008 if x_pos > 0 else -half_w + 0.008)
        rounded_box(
            f"AERO_WHEEL_COVER_{name}",
            (outer_face_x, radius, z_pos),
            (0.008, rim_radius * 1.94, rim_radius * 1.94),
            wheel_col,
            m["carbon"],
            0.003,
        )
        cylinder(
            f"RIM_OUTER_RING_{name}",
            (outer_face_x - 0.003, radius, z_pos),
            (outer_face_x + 0.003, radius, z_pos),
            rim_radius,
            wheel_col,
            m["metal"],
            48,
        )
        nut_offset = outer_face_x + (0.003 if x_pos > 0 else -0.003)
        cylinder(
            f"CENTER_LOCK_NUT_{name}",
            (outer_face_x, radius, z_pos),
            (nut_offset, radius, z_pos),
            0.035,
            wheel_col,
            m["caliper"],
            24,
        )

        # Brake Assembly
        inner_disc_x = x_pos + (-half_w * 0.4 if x_pos > 0 else half_w * 0.4)
        cylinder(
            f"BRAKE_DISC_{name}",
            (inner_disc_x - 0.014, radius, z_pos),
            (inner_disc_x + 0.014, radius, z_pos),
            rim_radius * 0.78,
            wheel_col,
            m["brake"],
            36,
        )
        caliper_y = radius + rim_radius * 0.52
        rounded_box(
            f"BRAKE_CALIPER_{name}",
            (inner_disc_x, caliper_y, z_pos),
            (0.055, 0.085, 0.12),
            wheel_col,
            m["caliper"],
            0.010,
        )

    for side in (-1, 1):
        # Front: Track = 1.780 m => center = ±0.890 m. half_w = 0.105 m => max X = ±0.995 m <= 1.000 m.
        build_wheel_assembly(
            f"FRONT_{'R' if side > 0 else 'L'}",
            side * LOCKS["frontTrack"] * 0.5,
            LOCKS["frontAxleZ"],
            LOCKS["frontWheelRadius"],
            half_w=0.105,
            is_rear=False,
        )
        # Rear: Track = 1.720 m => center = ±0.860 m. half_w = 0.134 m => max X = ±0.994 m <= 1.000 m.
        build_wheel_assembly(
            f"REAR_{'R' if side > 0 else 'L'}",
            side * LOCKS["rearTrack"] * 0.5,
            LOCKS["rearAxleZ"],
            LOCKS["rearWheelRadius"],
            half_w=0.134,
            is_rear=True,
        )


def build_suspension_and_deflectors(cols, m):
    """Priority 1 & 4: Multi-link aerodynamic blade wishbones, pushrod/pullrod,

    and front uprights with brake cooling ducts and mandatory tyre-wake eyebrow deflectors.
    """
    col = cols["07_G03_SUSPENSION"]

    def aero_blade_link(name, p1, p2, width=0.038, thickness=0.014):
        v1, v2 = Vector(p1), Vector(p2)
        axis = v2 - v1
        length = axis.length
        if length < 1e-5:
            return
        dir_v = axis.normalized()
        chord_dir = Vector((0, 0, 1))
        thick_dir = dir_v.cross(chord_dir).normalized()
        chord_dir = thick_dir.cross(dir_v).normalized()

        w_half, t_half = width * 0.5, thickness * 0.5
        verts = []
        for node in (v1, v2):
            verts.extend([
                node - chord_dir * w_half,
                node + thick_dir * t_half,
                node + chord_dir * w_half,
                node - thick_dir * t_half,
            ])
        faces = [
            (0, 1, 5, 4),
            (1, 2, 6, 5),
            (2, 3, 7, 6),
            (3, 0, 4, 7),
            (0, 3, 2, 1),
            (4, 5, 6, 7),
        ]
        return mesh_obj(name, verts, faces, col, m["carbon"])

    for side in (-1, 1):
        hub_f_top = (side * 0.78, 0.46, -1.75)
        hub_f_bot = (side * 0.77, 0.26, -1.75)
        chassis_f_top_fwd = (side * 0.24, 0.50, -1.95)
        chassis_f_top_aft = (side * 0.24, 0.48, -1.45)
        chassis_f_bot_fwd = (side * 0.20, 0.30, -1.98)
        chassis_f_bot_aft = (side * 0.20, 0.28, -1.42)
        pushrod_chassis = (side * 0.22, 0.58, -1.55)

        aero_blade_link(f"FRONT_UPPER_WISHBONE_FWD_{side:+d}", chassis_f_top_fwd, hub_f_top)
        aero_blade_link(f"FRONT_UPPER_WISHBONE_AFT_{side:+d}", chassis_f_top_aft, hub_f_top)
        aero_blade_link(f"FRONT_LOWER_WISHBONE_FWD_{side:+d}", chassis_f_bot_fwd, hub_f_bot)
        aero_blade_link(f"FRONT_LOWER_WISHBONE_AFT_{side:+d}", chassis_f_bot_aft, hub_f_bot)
        aero_blade_link(f"FRONT_PUSHROD_{side:+d}", pushrod_chassis, hub_f_bot, width=0.026, thickness=0.016)
        cylinder(f"FRONT_TRACK_ROD_{side:+d}", (side * 0.22, 0.36, -1.68), (side * 0.76, 0.35, -1.68), 0.012, col, m["metal"], 16)

        upright_x = side * 0.79
        rounded_box(f"FRONT_BRAKE_DUCT_UPRIGHT_{side:+d}", (upright_x, 0.36, -1.75), (0.045, 0.22, 0.18), col, m["duct"], 0.010)

        # Eyebrow deflector (stays within X <= 0.88 m)
        eyebrow_pts = [
            (side * 0.78, 0.54, -1.94),
            (side * 0.84, 0.59, -1.75),
            (side * 0.82, 0.56, -1.56),
        ]
        tube(f"FRONT_TYRE_EYEBROW_DEFLECTOR_{side:+d}", eyebrow_pts, 0.016, col, m["carbon"], resolution=3)

        hub_r_top = (side * 0.74, 0.50, 1.85)
        hub_r_bot = (side * 0.73, 0.28, 1.85)
        chassis_r_top_fwd = (side * 0.22, 0.52, 1.48)
        chassis_r_top_aft = (side * 0.22, 0.49, 2.08)
        chassis_r_bot_fwd = (side * 0.18, 0.32, 1.45)
        chassis_r_bot_aft = (side * 0.18, 0.30, 2.12)
        pullrod_chassis = (side * 0.20, 0.34, 1.62)

        aero_blade_link(f"REAR_UPPER_WISHBONE_FWD_{side:+d}", chassis_r_top_fwd, hub_r_top)
        aero_blade_link(f"REAR_UPPER_WISHBONE_AFT_{side:+d}", chassis_r_top_aft, hub_r_top)
        aero_blade_link(f"REAR_LOWER_WISHBONE_FWD_{side:+d}", chassis_r_bot_fwd, hub_r_bot)
        aero_blade_link(f"REAR_LOWER_WISHBONE_AFT_{side:+d}", chassis_r_bot_aft, hub_r_bot)
        aero_blade_link(f"REAR_PULLROD_{side:+d}", pullrod_chassis, hub_r_top, width=0.024, thickness=0.015)
        rounded_box(f"REAR_UPRIGHT_{side:+d}", (side * 0.75, 0.38, 1.85), (0.045, 0.24, 0.18), col, m["duct"], 0.010)


def build_aerodynamic_details(cols, m):
    """Aerodynamic mirrors with dual flow stays, nose antenna cluster,

    and rear tow hook / jacking structure.
    """
    col = cols["08_G03_DETAIL"]

    for side in (-1, 1):
        cylinder(f"MIRROR_STAY_INNER_{side:+d}", (side * 0.28, 0.68, -0.42), (side * 0.48, 0.74, -0.38), 0.008, col, m["carbon"], 16)
        cylinder(f"MIRROR_STAY_LOWER_{side:+d}", (side * 0.38, 0.60, -0.40), (side * 0.48, 0.74, -0.38), 0.007, col, m["carbon"], 16)
        rounded_box(f"MIRROR_HOUSING_{side:+d}", (side * 0.54, 0.75, -0.38), (0.13, 0.065, 0.085), col, m["clay"], 0.018)
        rounded_box(f"MIRROR_GLASS_{side:+d}", (side * 0.54, 0.75, -0.34), (0.11, 0.052, 0.006), col, m["metal"], 0.004)
        rounded_box(f"MIRROR_FLOW_VANE_{side:+d}", (side * 0.61, 0.75, -0.38), (0.010, 0.085, 0.075), col, m["carbon"], 0.004)

    cylinder("RADIO_ANTENNA_1", (0, 0.54, -1.15), (0, 0.72, -1.15), 0.004, col, m["metal"], 12)
    cylinder("RADIO_ANTENNA_2", (0.04, 0.53, -1.05), (0.04, 0.68, -1.05), 0.003, col, m["metal"], 12)


def build_eds_d2(cols, m):
    build_monocoque_and_cockpit(cols, m)
    build_front_aero_and_nose(cols, m)
    build_sidepods_and_engine_cover(cols, m)
    build_floor_and_diffuser(cols, m)
    build_rear_wing_and_beam_wing(cols, m)
    build_wheels_and_brakes(cols, m)
    build_suspension_and_deflectors(cols, m)
    build_aerodynamic_details(cols, m)


def eds_objects(cols):
    return [
        obj
        for name, col in cols.items()
        if name.startswith(("01_", "02_", "03_", "04_", "05_", "06_", "07_", "08_"))
        for obj in col.all_objects
    ]


def evaluated_stats(objects):
    deps = bpy.context.evaluated_depsgraph_get()
    verts = tris = polys = 0
    bounds = []
    for obj in objects:
        if obj.type not in {"MESH", "CURVE"}:
            continue
        ev = obj.evaluated_get(deps)
        mesh = ev.to_mesh()
        verts += len(mesh.vertices)
        polys += len(mesh.polygons)
        tris += sum(len(p.vertices) - 2 for p in mesh.polygons)
        bounds.extend(obj.matrix_world @ Vector(c) for c in obj.bound_box)
        ev.to_mesh_clear()
    mn = [min(v[i] for v in bounds) for i in range(3)]
    mx = [max(v[i] for v in bounds) for i in range(3)]
    # Blender XYZ -> project X, Y-up=Z, Z-rear=-Y
    pmin = [mn[0], mn[2], -mx[1]]
    pmax = [mx[0], mx[2], -mn[1]]
    return {
        "objects": len(objects),
        "vertices": verts,
        "polygons": polys,
        "triangles": tris,
        "bounds": {"min": pmin, "max": pmax, "size": [pmax[i] - pmin[i] for i in range(3)]},
    }


def export_glb(cols, path: Path):
    """Export evaluated EDS objects combined by material to minimize WebGL draw calls."""
    deps = bpy.context.evaluated_depsgraph_get()
    temp_objects = []
    by_material: dict[str, list[bpy.types.Mesh]] = {}

    for obj in eds_objects(cols):
        if obj.type not in {"MESH", "CURVE"}:
            continue
        ev = obj.evaluated_get(deps)
        evaluated_mesh = ev.to_mesh()
        world_mesh = bpy.data.meshes.new(f"{obj.name}_EVAL")
        world_mesh.from_pydata(
            [obj.matrix_world @ v.co for v in evaluated_mesh.vertices],
            [],
            [list(p.vertices) for p in evaluated_mesh.polygons],
        )
        world_mesh.update(calc_edges=True)
        slot_name = obj.active_material.name if obj.active_material else "DEFAULT_MATERIAL"
        by_material.setdefault(slot_name, []).append(world_mesh)
        ev.to_mesh_clear()

    export_col = new_collection("TEMP_EXPORT_COMBINED")
    for mat_name, mesh_list in by_material.items():
        bm = bmesh.new()
        for mesh in mesh_list:
            bm.from_mesh(mesh)
            bpy.data.meshes.remove(mesh)
        combined_mesh = bpy.data.meshes.new(f"EDS_D2_{mat_name}")
        bm.to_mesh(combined_mesh)
        bm.free()
        combined_obj = bpy.data.objects.new(f"EDS_D2_{mat_name}", combined_mesh)
        export_col.objects.link(combined_obj)
        material = bpy.data.materials.get(mat_name)
        if material:
            combined_mesh.materials.append(material)
        temp_objects.append(combined_obj)

    bpy.ops.object.select_all(action="DESELECT")
    for obj in temp_objects:
        obj.select_set(True)
    bpy.context.view_layer.objects.active = temp_objects[0]
    bpy.ops.export_scene.gltf(
        filepath=str(path),
        use_selection=True,
        export_format="GLB",
        export_apply=True,
        export_materials="EXPORT",
        export_attributes=False,
    )
    for obj in temp_objects:
        mesh = obj.data
        bpy.data.objects.remove(obj)
        bpy.data.meshes.remove(mesh)
    bpy.data.collections.remove(export_col)


# ---------------------------------------------------------------------------
# Studio & Render Setup
# ---------------------------------------------------------------------------

def setup_studio(cols, m):
    world = bpy.context.scene.world or bpy.data.worlds.new("World")
    bpy.context.scene.world = world
    world.use_nodes = True
    world.node_tree.nodes["Background"].inputs["Color"].default_value = (0.025, 0.030, 0.038, 1)
    world.node_tree.nodes["Background"].inputs["Strength"].default_value = 0.42

    col = cols["09_LIGHTS_CAMERAS"]
    rounded_box("STUDIO_FLOOR", (0, -0.035, 0), (12, 0.05, 12), col, m["floor"], 0.02)
    for name, loc, energy, size, color in (
        ("KEY", (-3.5, -4.5, 5.2), 1900, 4.5, (1, 0.94, 0.86)),
        ("FILL", (4.5, -1.2, 3.5), 1300, 3.5, (0.72, 0.82, 1)),
        ("RIM", (0, 5.5, 4.5), 1700, 3.8, (0.85, 0.92, 1)),
        ("UNDER_FILL", (0, 0, 0.2), 350, 2.0, (0.8, 0.85, 0.9)),
    ):
        data = bpy.data.lights.new(name, "AREA")
        data.energy = energy
        data.shape = "DISK"
        data.size = size
        data.color = color
        obj = bpy.data.objects.new(name, data)
        col.objects.link(obj)
        obj.location = loc

    cam_data = bpy.data.cameras.new("REVIEW_CAMERA")
    cam = bpy.data.objects.new("REVIEW_CAMERA", cam_data)
    col.objects.link(cam)
    bpy.context.scene.camera = cam
    cam_data.lens = 58

    scene = bpy.context.scene
    scene.render.engine = "BLENDER_EEVEE"
    scene.render.resolution_x = 720
    scene.render.resolution_y = 450
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = "PNG"
    scene.render.film_transparent = False
    scene.render.image_settings.color_mode = "RGBA"
    scene.view_settings.look = "AgX - Medium High Contrast"
    return cam


VIEWS = {
    "top": ((0, 9.4, 0), (0, 0.34, 0), 52),
    "side": ((8.8, 0.75, 0), (0, 0.38, 0), 52),
    "front": ((0, 0.80, -7.1), (0, 0.36, -0.25), 58),
    "rear": ((0, 0.85, 7.1), (0, 0.38, 0.35), 58),
    "front-three-quarter": ((4.8, 2.25, -5.4), (0, 0.37, -0.20), 58),
    "rear-three-quarter": ((-4.8, 2.15, 5.4), (0, 0.40, 0.30), 58),
    "cockpit-close-up": ((2.15, 1.65, -2.0), (0, 0.65, -0.20), 62),
    "halo-construction": ((-1.65, 1.65, -1.35), (0, 0.88, -0.24), 66),
    "nose-front-wing": ((2.35, 1.15, -4.05), (0, 0.33, -1.95), 62),
    "sidepod-inlet": ((2.35, 1.20, -1.85), (0.43, 0.44, -0.15), 64),
    "floor-diffuser": ((-2.35, 0.55, 4.05), (0, 0.16, 1.72), 62),
    "suspension-wheels-brakes": ((2.30, 0.92, -3.35), (0.68, 0.36, -1.72), 64),
}


def aim(camera, location, target, lens):
    camera.location = p2b(location)
    camera.rotation_euler = (p2b(target) - camera.location).to_track_quat("-Z", "Y").to_euler()
    camera.data.lens = lens


def set_collection_render(cols, reference):
    for name, col in cols.items():
        if name == "09_LIGHTS_CAMERAS":
            col.hide_render = False
        elif name == "00_C42_REFERENCE_DEV_ONLY":
            col.hide_render = not reference
        else:
            col.hide_render = reference


def render_views(camera, cols, root, reference=False, names=None):
    root.mkdir(parents=True, exist_ok=True)
    set_collection_render(cols, reference)
    for name in names or VIEWS:
        location, target, lens = VIEWS[name]
        aim(camera, location, target, lens)
        bpy.context.scene.render.filepath = str(root / f"{name}.png")
        bpy.ops.render.render(write_still=True)


def wireframe_mode(objects, enable=True):
    for obj in objects:
        if obj.type == "MESH":
            modifier = obj.modifiers.get("EDS_D2_WIREFRAME_RENDER")
            if enable and modifier is None:
                modifier = obj.modifiers.new("EDS_D2_WIREFRAME_RENDER", "WIREFRAME")
                modifier.thickness = 0.002
                modifier.use_even_offset = True
                modifier.use_replace = True
            elif not enable and modifier is not None:
                obj.modifiers.remove(modifier)


# ---------------------------------------------------------------------------
# Main Execution Pipeline
# ---------------------------------------------------------------------------

def main():
    reset()
    OUT.mkdir(parents=True, exist_ok=True)
    cols = {name: new_collection(name) for name in COLLECTIONS}

    m = {
        "carbon": mat("EDS_D2_CARBON", (0.015, 0.018, 0.022), 0.15, 0.35),
        "clay": mat("EDS_D2_CLAY", (0.24, 0.27, 0.30), 0.0, 0.42),
        "dark": mat("EDS_D2_DARK", (0.004, 0.005, 0.007), 0.0, 0.85),
        "metal": mat("EDS_D2_METAL", (0.25, 0.28, 0.32), 0.85, 0.20),
        "brake": mat("EDS_D2_BRAKE", (0.18, 0.19, 0.20), 0.70, 0.34),
        "caliper": mat("EDS_D2_CALIPER", (0.46, 0.10, 0.045), 0.62, 0.25),
        "duct": mat("EDS_D2_DUCT", (0.003, 0.004, 0.006), 0.0, 0.90),
        "interior": mat("EDS_D2_INTERIOR", (0.009, 0.012, 0.016), 0.0, 0.62),
        "seat": mat("EDS_D2_SEAT", (0.035, 0.042, 0.05), 0.0, 0.58),
        "halo": mat("EDS_D2_HALO", (0.13, 0.15, 0.17), 0.58, 0.22),
        "screen": mat("EDS_D2_SCREEN", (0.02, 0.45, 0.85), 0.0, 0.20, emission=(0.02, 0.45, 0.85)),
        "taillight": mat("EDS_D2_TAILLIGHT", (0.85, 0.02, 0.02), 0.0, 0.20, emission=(0.85, 0.02, 0.02)),
        "reference": mat("C42_REFERENCE_CLAY", (0.24, 0.27, 0.31), 0.0, 0.42),
        "floor": mat("STUDIO_FLOOR", (0.04, 0.045, 0.055), 0.0, 0.72),
        "diagnostic": mat("EDS_D2_REFLECTIVE_DIAGNOSTIC", (0.16, 0.19, 0.22), 0.88, 0.12),
    }

    c42 = build_reference(cols, m)
    build_eds_d2(cols, m)
    cam = setup_studio(cols, m)
    stats = evaluated_stats(eds_objects(cols))

    scene = bpy.context.scene
    scene["eds_revision"] = "EDS-G03-C42-Fidelity-D2"
    scene["commercial_status"] = "DEV REVIEW ONLY - OWNER GATE"
    scene["c42_use"] = "Primary geometric reference; original parametric reconstruction; no mesh copy"

    bpy.ops.wm.save_as_mainfile(filepath=str(BLEND_PATH))
    export_glb(cols, GLB_PATH)

    report = {
        "revision": scene["eds_revision"],
        "locks": LOCKS,
        "measured": stats,
        "c42": c42,
        "glb": {
            "path": str(GLB_PATH.relative_to(ROOT)),
            "bytes": GLB_PATH.stat().st_size,
            "sha256": hashlib.sha256(GLB_PATH.read_bytes()).hexdigest(),
        },
        "authoring": {
            "blender": bpy.app.version_string,
            "source": str(Path(__file__).relative_to(ROOT)),
            "blend": str(BLEND_PATH.relative_to(ROOT)),
        },
        "status": "OWNER GATE - C42 HIGH-FIDELITY EDS D2 RECONSTRUCTION REVIEW",
    }
    (OUT / "geometry-report.json").write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")

    if not SKIP_RENDER:
        if RENDER_SCOPE == "all":
            render_views(cam, cols, EVIDENCE / "eds-clay", False)
            render_views(cam, cols, EVIDENCE / "c42-reference", True)
            bpy.context.scene.view_layers[0].material_override = m["diagnostic"]
            render_views(cam, cols, EVIDENCE / "eds-reflective", False)
            bpy.context.scene.view_layers[0].material_override = None
        wireframe_mode(eds_objects(cols), True)
        render_views(
            cam,
            cols,
            EVIDENCE / "eds-wireframe",
            False,
            ["top", "side", "front-three-quarter", "rear-three-quarter", "cockpit-close-up", "floor-diffuser"],
        )
        wireframe_mode(eds_objects(cols), False)

    print("EDS_G03_D2_REPORT=" + json.dumps(report))


if __name__ == "__main__":
    main()
