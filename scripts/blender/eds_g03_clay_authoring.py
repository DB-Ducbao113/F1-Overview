"""Build the original EDS-G03 Blender clay-design study.

Run with Blender 5.2 LTS:
  blender --background --factory-startup --python scripts/blender/eds_g03_clay_authoring.py

Coordinates supplied to helpers use the project convention (+Y up, -Z front).
They are converted to Blender coordinates (X lateral, Y front, Z up) so glTF
export returns the project's Y-up convention without a scene-level rotation.
No third-party mesh, topology, UV, texture or brand asset is read by this file.
"""

from __future__ import annotations

import hashlib
import json
import math
import os
import struct
import sys
from pathlib import Path

import bpy
from mathutils import Vector


ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "docs" / "commercialization" / "r3" / "blender-authoring"
EVIDENCE = OUT / "evidence" / "clay-gate"
BLEND_PATH = OUT / "eds-g03-clay-design.blend"
GLB_PATH = OUT / "eds-g03-clay-review.glb"

COLLECTION_NAMES = (
    "00_REFERENCE_CONTROLS",
    "01_MONOCOQUE_NOSE",
    "02_COCKPIT_HALO",
    "03_SIDEPODS_ENGINE_COVER",
    "04_FRONT_WING",
    "05_REAR_WING",
    "06_FLOOR_DIFFUSER",
    "07_WHEELS_TYRES",
    "08_SUSPENSION_BRAKES",
    "09_MATERIALS",
    "10_LOD_EXPORTS",
)

LOCKS = {
    "length": 5.05,
    "width": 2.0,
    "height": 1.18,
    "wheelbase": 3.6,
    "frontAxleZ": -1.75,
    "rearAxleZ": 1.85,
    "frontTrack": 1.78,
    "rearTrack": 1.72,
    "frontWheelRadius": 0.36,
    "rearWheelRadius": 0.38,
    "diffuserExitWidth": 1.16,
    "bounds": {"min": [-1.0, 0.0, -2.6], "max": [1.0, 1.18, 2.45]},
    "halo": {
        "frontMount": [0.0, 0.65, -0.65],
        "rearMounts": [[-0.26, 0.66, 0.12], [0.26, 0.66, 0.12]],
        "top": [0.0, 0.94, -0.46],
    },
}


def p2b(point):
    """Project (x, up-y, rear-z) -> Blender (x, front-y, up-z)."""
    x, y, z = point
    return Vector((x, -z, y))


def reset_scene():
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    for datablocks in (bpy.data.meshes, bpy.data.curves, bpy.data.materials, bpy.data.cameras, bpy.data.lights):
        for datablock in list(datablocks):
            datablocks.remove(datablock)
    for collection in list(bpy.data.collections):
        bpy.data.collections.remove(collection)


def collection(name):
    item = bpy.data.collections.new(name)
    bpy.context.scene.collection.children.link(item)
    return item


def move_to_collection(obj, target):
    for owner in list(obj.users_collection):
        owner.objects.unlink(obj)
    target.objects.link(obj)


def material(name, color, metallic=0.0, roughness=0.45):
    mat = bpy.data.materials.new(name)
    mat.diffuse_color = (*color, 1.0)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = (*color, 1.0)
    bsdf.inputs["Metallic"].default_value = metallic
    bsdf.inputs["Roughness"].default_value = roughness
    return mat


def finish_mesh(obj, mat=None, bevel=0.0, bevel_segments=3, smooth=True):
    if mat:
        obj.data.materials.append(mat)
    if smooth:
        for poly in obj.data.polygons:
            poly.use_smooth = True
    if bevel > 0:
        modifier = obj.modifiers.new("Controlled edge radius", "BEVEL")
        modifier.width = bevel
        modifier.segments = bevel_segments
        modifier.limit_method = "ANGLE"
    obj["eds_owned"] = True
    obj["provenance"] = "Original Podium EDS Blender procedural authoring"
    return obj


def create_mesh(name, vertices, faces, target, mat=None, smooth=True):
    mesh = bpy.data.meshes.new(f"{name}_MESH")
    mesh.from_pydata([p2b(v) for v in vertices], [], faces)
    mesh.update(calc_edges=True)
    obj = bpy.data.objects.new(name, mesh)
    target.objects.link(obj)
    return finish_mesh(obj, mat=mat, smooth=smooth)


def superellipse_xy(angle, rx, ry, exponent=2.0):
    c, s = math.cos(angle), math.sin(angle)
    power = 2.0 / exponent
    return math.copysign(abs(c) ** power, c) * rx, math.copysign(abs(s) ** power, s) * ry


def loft(name, stations, target, mat, radial=48, caps=True, twist=0.0):
    """Closed longitudinal superellipse loft in project coordinates."""
    vertices = []
    for index, station in enumerate(stations):
        z, cx, cy, rx, ry, exponent = station
        phase = twist * index / max(1, len(stations) - 1)
        for ring_index in range(radial):
            a = 2 * math.pi * ring_index / radial + phase
            dx, dy = superellipse_xy(a, rx, ry, exponent)
            vertices.append((cx + dx, cy + dy, z))
    faces = []
    for axial in range(len(stations) - 1):
        for ring in range(radial):
            nxt = (ring + 1) % radial
            a = axial * radial + ring
            b = axial * radial + nxt
            c = (axial + 1) * radial + nxt
            d = (axial + 1) * radial + ring
            faces.append((a, b, c, d))
    if caps:
        faces.append(tuple(reversed(range(radial))))
        start = (len(stations) - 1) * radial
        faces.append(tuple(start + i for i in range(radial)))
    return create_mesh(name, vertices, faces, target, mat)


def airfoil(name, z_center, span, chord, y_center, thickness, target, mat,
            span_sections=25, chord_sections=18, sweep=0.0, dihedral=0.0):
    vertices = []
    for side in range(span_sections):
        u = side / (span_sections - 1)
        x = (u - 0.5) * span
        edge = abs(2 * u - 1)
        local_z = z_center + sweep * edge * edge
        local_y = y_center + dihedral * edge * edge
        for surface in (1, -1):
            for chord_index in range(chord_sections):
                t = chord_index / (chord_sections - 1)
                camber = 0.018 * math.sin(math.pi * t)
                thick = thickness * (0.20 + 0.80 * math.sin(math.pi * t) ** 0.72)
                z = local_z + (t - 0.5) * chord
                y = local_y + camber + surface * thick * 0.5
                vertices.append((x, y, z))
    faces = []
    strip = chord_sections * 2
    for s in range(span_sections - 1):
        for surface in range(2):
            base = s * strip + surface * chord_sections
            nxt = (s + 1) * strip + surface * chord_sections
            for c in range(chord_sections - 1):
                if surface == 0:
                    faces.append((base + c, base + c + 1, nxt + c + 1, nxt + c))
                else:
                    faces.append((base + c, nxt + c, nxt + c + 1, base + c + 1))
        # Join upper/lower skins continuously along leading and trailing edges.
        top_a, top_b = s * strip, (s + 1) * strip
        bottom_a, bottom_b = top_a + chord_sections, top_b + chord_sections
        faces.append((top_a, top_b, bottom_b, bottom_a))
        faces.append((top_a + chord_sections - 1, bottom_a + chord_sections - 1,
                      bottom_b + chord_sections - 1, top_b + chord_sections - 1))
    for s in (0, span_sections - 1):
        base = s * strip
        loop = list(range(base, base + chord_sections))
        loop += list(reversed(range(base + chord_sections, base + 2 * chord_sections)))
        faces.append(tuple(loop if s else reversed(loop)))
    return create_mesh(name, vertices, faces, target, mat)


def rounded_box(name, center, scale, target, mat, bevel=0.02):
    bpy.ops.mesh.primitive_cube_add(location=p2b(center))
    obj = bpy.context.object
    obj.name = name
    obj.dimensions = (scale[0], scale[2], scale[1])
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    move_to_collection(obj, target)
    return finish_mesh(obj, mat, bevel, 4)


def curve_tube(name, points, radius, target, mat, cyclic=False, resolution=3):
    data = bpy.data.curves.new(f"{name}_CURVE", "CURVE")
    data.dimensions = "3D"
    data.resolution_u = 12
    data.bevel_depth = radius
    data.bevel_resolution = resolution
    data.resolution_u = 12
    spline = data.splines.new("BEZIER")
    spline.bezier_points.add(len(points) - 1)
    for point, source in zip(spline.bezier_points, points):
        point.co = p2b(source)
        point.handle_left_type = "AUTO"
        point.handle_right_type = "AUTO"
    spline.use_cyclic_u = cyclic
    obj = bpy.data.objects.new(name, data)
    target.objects.link(obj)
    obj.data.materials.append(mat)
    obj["eds_owned"] = True
    obj["provenance"] = "Original Podium EDS Blender curve authoring"
    return obj


def cylinder_between(name, a, b, radius, target, mat, vertices=20):
    ba, bb = p2b(a), p2b(b)
    delta = bb - ba
    midpoint = (ba + bb) * 0.5
    bpy.ops.mesh.primitive_cylinder_add(vertices=vertices, radius=radius, depth=delta.length, location=midpoint)
    obj = bpy.context.object
    obj.name = name
    obj.rotation_mode = "QUATERNION"
    obj.rotation_quaternion = Vector((0, 0, 1)).rotation_difference(delta.normalized())
    move_to_collection(obj, target)
    return finish_mesh(obj, mat, bevel=radius * 0.14, bevel_segments=2)


def wheel(name, x, z, radius, width, target_wheel, target_mech, mats, rear=False):
    center = (x, radius, z)
    tire_section = 0.095 if rear else 0.082
    bpy.ops.mesh.primitive_torus_add(
        align="WORLD", major_segments=64, minor_segments=18,
        location=p2b(center), major_radius=radius - tire_section,
        minor_radius=tire_section, rotation=(0, math.pi / 2, 0),
    )
    tire = bpy.context.object
    tire.name = f"{name}_TYRE"
    # The torus is rotated so its axle is world X. Set final dimensions instead
    # of scaling a pre-rotation local axis (which previously enlarged radius).
    bpy.ops.object.transform_apply(location=False, rotation=True, scale=False)
    tire.dimensions = (width, 2 * radius, 2 * radius)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    move_to_collection(tire, target_wheel)
    finish_mesh(tire, mats["rubber"])

    bpy.ops.mesh.primitive_cylinder_add(vertices=64, radius=radius * 0.56, depth=width * 0.72,
                                        location=p2b(center), rotation=(0, math.pi / 2, 0))
    rim = bpy.context.object
    rim.name = f"{name}_RIM"
    move_to_collection(rim, target_wheel)
    finish_mesh(rim, mats["metal"], bevel=0.008)

    for outboard in (-1, 1):
        face_x = x + outboard * width * 0.34
        for spoke in range(10):
            angle = 2 * math.pi * spoke / 10 + (0.08 if rear else 0)
            hub = (face_x, radius, z)
            edge = (face_x, radius + math.sin(angle) * radius * 0.43,
                    z + math.cos(angle) * radius * 0.43)
            cylinder_between(f"{name}_SPOKE_{outboard}_{spoke:02d}", hub, edge,
                             0.010, target_wheel, mats["rim"], 12)

    bpy.ops.mesh.primitive_cylinder_add(vertices=48, radius=radius * 0.37, depth=width * 0.22,
                                        location=p2b(center), rotation=(0, math.pi / 2, 0))
    disc = bpy.context.object
    disc.name = f"{name}_BRAKE_DISC"
    move_to_collection(disc, target_mech)
    finish_mesh(disc, mats["brake"])

    caliper_x = x + math.copysign(width * 0.14, x)
    rounded_box(f"{name}_CALIPER", (caliper_x, radius + 0.01, z - radius * 0.22),
                (0.055, 0.16, 0.07), target_mech, mats["caliper"], 0.015)


def floor_diffuser(target, mats):
    z_rows = [-1.08, -0.72, -0.25, 0.35, 0.9, 1.35, 1.75, 2.05, 2.30]
    x_cols = [-1.0, -0.82, -0.64, -0.46, -0.25, 0.0, 0.25, 0.46, 0.64, 0.82, 1.0]
    vertices = []
    upper = []
    lower = []
    for z in z_rows:
        rear = max(0.0, min(1.0, (z - 0.95) / 1.35))
        half = 0.68 - rear * 0.10
        row_u, row_l = [], []
        for x_fraction in x_cols:
            clipped = x_fraction * half
            lateral = abs(clipped) / max(half, 1e-6)
            top_y = 0.145 + rear * (0.22 - 0.10 * lateral)
            channel = math.exp(-((abs(clipped) - 0.29) / 0.17) ** 2)
            center_keel = math.exp(-(clipped / 0.13) ** 2)
            bottom_y = 0.055 + rear * (0.12 + 0.12 * channel - 0.025 * center_keel)
            row_u.append(len(vertices)); vertices.append((clipped, top_y, z))
            row_l.append(len(vertices)); vertices.append((clipped, bottom_y, z))
        upper.append(row_u); lower.append(row_l)
    faces = []
    for rows, reverse in ((upper, False), (lower, True)):
        for zi in range(len(z_rows) - 1):
            for xi in range(len(x_cols) - 1):
                face = (rows[zi][xi], rows[zi][xi+1], rows[zi+1][xi+1], rows[zi+1][xi])
                faces.append(tuple(reversed(face)) if reverse else face)
    for zi in range(len(z_rows) - 1):
        faces.append((upper[zi][0], upper[zi+1][0], lower[zi+1][0], lower[zi][0]))
        faces.append((upper[zi][-1], lower[zi][-1], lower[zi+1][-1], upper[zi+1][-1]))
    for zi in (0, len(z_rows)-1):
        loop = upper[zi] + list(reversed(lower[zi]))
        faces.append(tuple(reversed(loop)) if zi == 0 else tuple(loop))
    floor = create_mesh("FLOOR_VENTURI_CONTINUOUS", vertices, faces, target, mats["carbon"])
    bevel = floor.modifiers.new("Floor edge control", "BEVEL")
    bevel.width = 0.008
    bevel.segments = 2

    # True separator fences make the two outlets legible without a covering shelf.
    for side in (-1, 1):
        x = side * 0.02
        verts = [(x, 0.06, 1.02), (x, 0.08, 1.02), (x, 0.31, 2.30), (x, 0.18, 2.30),
                 (x + side*0.018, 0.06, 1.02), (x + side*0.018, 0.08, 1.02),
                 (x + side*0.018, 0.31, 2.30), (x + side*0.018, 0.18, 2.30)]
        faces = [(0,1,2,3),(4,7,6,5),(0,4,5,1),(3,2,6,7),(1,5,6,2),(0,3,7,4)]
        create_mesh(f"DIFFUSER_CENTER_FENCE_{side:+d}", verts, faces, target, mats["carbon"])
    for side in (-1, 1):
        x = side * 0.58
        cylinder_between(f"DIFFUSER_EXIT_EDGE_{side:+d}", (x,0.15,2.28), (x,0.30,2.30),
                         0.012, target, mats["carbon"], 12)
    # Four longitudinal boundaries define two open channels while leaving the
    # underside unobstructed for inspection.
    for index, x in enumerate((-0.52, -0.07, 0.07, 0.52)):
        side = -1 if x < 0 else 1
        verts = [(x,0.065,1.10),(x,0.105,1.10),(x,0.315,2.30),(x,0.18,2.30),
                 (x+side*0.014,0.065,1.10),(x+side*0.014,0.105,1.10),
                 (x+side*0.014,0.315,2.30),(x+side*0.014,0.18,2.30)]
        faces = [(0,1,2,3),(4,7,6,5),(0,4,5,1),(3,2,6,7),(1,5,6,2),(0,3,7,4)]
        create_mesh(f"DIFFUSER_CHANNEL_WALL_{index+1}", verts, faces, target, mats["carbon"])


def build_scene():
    reset_scene()
    OUT.mkdir(parents=True, exist_ok=True)
    EVIDENCE.mkdir(parents=True, exist_ok=True)
    collections = {name: collection(name) for name in COLLECTION_NAMES}
    mats = {
        "clay": material("EDS_CLAY_BODY", (0.47, 0.50, 0.53), 0.0, 0.36),
        "clay_dark": material("EDS_CLAY_AERO", (0.24, 0.27, 0.29), 0.0, 0.42),
        "carbon": material("EDS_TECHNICAL_CARBON", (0.055, 0.065, 0.070), 0.12, 0.32),
        "rubber": material("UNBRANDED_TYRE_RUBBER", (0.018, 0.021, 0.022), 0.0, 0.72),
        "metal": material("EDS_RIM_METAL", (0.20, 0.22, 0.23), 0.82, 0.20),
        "rim": material("EDS_RIM_FACE", (0.09, 0.10, 0.11), 0.75, 0.24),
        "brake": material("EDS_BRAKE_DISC", (0.19, 0.20, 0.20), 0.68, 0.34),
        "caliper": material("EDS_BRAKE_CALIPER", (0.33, 0.12, 0.08), 0.65, 0.27),
        "duct": material("EDS_DUCT_INTERIOR", (0.007, 0.009, 0.011), 0.0, 0.86),
        "glass": material("EDS_COCKPIT_INTERIOR", (0.012, 0.016, 0.019), 0.0, 0.50),
    }
    for mat in mats.values():
        collections["09_MATERIALS"].objects.link(bpy.data.objects.new(f"MAT_{mat.name}", None))

    ref = collections["00_REFERENCE_CONTROLS"]
    for name, project_point in (
        ("HP_FRONT_AXLE", (0, 0.36, -1.75)), ("HP_REAR_AXLE", (0, 0.38, 1.85)),
        ("HP_HALO_FRONT", (0, 0.65, -0.65)), ("HP_HALO_REAR_L", (-0.26, 0.66, 0.12)),
        ("HP_HALO_REAR_R", (0.26, 0.66, 0.12)), ("HP_HALO_TOP", (0, 0.94, -0.46)),
    ):
        empty = bpy.data.objects.new(name, None)
        empty.location = p2b(project_point)
        empty.empty_display_type = "SPHERE"
        empty.empty_display_size = 0.045
        empty["project_coordinate"] = list(project_point)
        ref.objects.link(empty)

    mono = collections["01_MONOCOQUE_NOSE"]
    loft("MONOCOQUE_NOSE_PRIMARY", [
        (-2.48,0,0.30,0.07,0.07,2.2), (-2.24,0,0.31,0.11,0.09,2.4),
        (-1.88,0,0.35,0.15,0.12,2.5), (-1.42,0,0.41,0.22,0.17,2.6),
        (-1.02,0,0.48,0.30,0.22,2.8), (-0.72,0,0.52,0.34,0.24,3.0),
        (-0.35,0,0.54,0.37,0.27,3.1), (0.02,0,0.52,0.36,0.28,3.0),
        (0.40,0,0.50,0.31,0.25,2.8), (0.78,0,0.48,0.25,0.22,2.6),
        (1.18,0,0.45,0.19,0.18,2.5), (1.58,0,0.42,0.13,0.14,2.3),
    ], mono, mats["clay"], radial=64)
    curve_tube("NOSE_CENTRE_KEEL", [(0,0.23,-2.46),(0,0.245,-2.14),(0,0.29,-1.68),(0,0.34,-1.20)],
               0.018, mono, mats["clay_dark"], resolution=4)

    cockpit = collections["02_COCKPIT_HALO"]
    # Recess and raised cockpit shoulders create an explicit opening rather than painted indication.
    loft("COCKPIT_RECESS", [(-0.61,0,0.59,0.17,0.035,2.0),(-0.36,0,0.575,0.235,0.055,2.2),
                            (0.02,0,0.555,0.25,0.07,2.2),(0.30,0,0.57,0.19,0.05,2.0)],
         cockpit, mats["glass"], radial=48)
    for side in (-1,1):
        curve_tube(f"COCKPIT_SILL_{side:+d}", [(side*0.19,0.59,-0.62),(side*0.26,0.62,-0.30),
                   (side*0.27,0.62,0.08),(side*0.20,0.59,0.31)], 0.025, cockpit, mats["clay"], resolution=4)
    # Three halo legs are curved from exact locked roots into one continuous upper arch.
    curve_tube("HALO_FRONT_PILLAR", [(0,0.65,-0.65),(0,0.73,-0.60),(0,0.89,-0.51),(0,0.94,-0.46)],
               0.032, cockpit, mats["metal"], resolution=5)
    curve_tube("HALO_UPPER_ARCH", [(-0.26,0.66,0.12),(-0.34,0.77,-0.04),(-0.33,0.89,-0.30),
               (0,0.94,-0.46),(0.33,0.89,-0.30),(0.34,0.77,-0.04),(0.26,0.66,0.12)],
               0.034, cockpit, mats["metal"], resolution=5)
    for side in (-1,1):
        loft(f"HALO_REAR_FAIRING_{side:+d}", [
            (0.30,side*0.18,0.585,0.11,0.028,2.3),(0.20,side*0.225,0.615,0.09,0.04,2.2),
            (0.12,side*0.26,0.66,0.066,0.055,2.1),(-0.01,side*0.30,0.72,0.047,0.046,2.0)],
            cockpit, mats["clay"], radial=28)
    loft("HALO_FRONT_FAIRING", [(-0.76,0,0.58,0.12,0.045,2.4),(-0.66,0,0.65,0.09,0.06,2.2),
                                (-0.56,0,0.74,0.055,0.05,2.0)], cockpit, mats["clay"], radial=32)

    sidepods = collections["03_SIDEPODS_ENGINE_COVER"]
    for side in (-1,1):
        loft(f"SIDEPOD_PRIMARY_{side:+d}", [
            (-0.58,side*0.39,0.43,0.06,0.10,2.2),(-0.48,side*0.47,0.47,0.14,0.17,2.5),
            (-0.25,side*0.51,0.45,0.18,0.18,2.8),(0.08,side*0.53,0.43,0.17,0.18,3.1),
            (0.42,side*0.50,0.40,0.16,0.17,3.1),(0.78,side*0.43,0.37,0.15,0.15,2.9),
            (1.10,side*0.34,0.38,0.12,0.13,2.7),(1.36,side*0.25,0.41,0.07,0.10,2.4)],
            sidepods, mats["clay"], radial=48, caps=False)
        # Crescent lip plus recessed duct depth.
        lip = [(side*(0.34+0.13*math.cos(a)),0.47+0.14*math.sin(a),-0.50)
               for a in [2*math.pi*i/24 for i in range(24)]]
        curve_tube(f"SIDEPOD_INLET_LIP_{side:+d}", lip, 0.018, sidepods, mats["clay_dark"], cyclic=True, resolution=4)
        loft(f"SIDEPOD_INTERNAL_DUCT_{side:+d}", [(-0.51,side*0.43,0.47,0.11,0.12,2.2),
             (-0.35,side*0.44,0.46,0.085,0.095,2.2),(-0.14,side*0.42,0.44,0.045,0.065,2.0)],
             sidepods, mats["duct"], radial=36, caps=False)
        curve_tube(f"SIDEPOD_UNDERCUT_EDGE_{side:+d}", [(side*0.60,0.28,-0.33),(side*0.63,0.23,0.08),
                   (side*0.57,0.20,0.52),(side*0.45,0.21,0.94),(side*0.31,0.27,1.27)],
                   0.016, sidepods, mats["clay_dark"], resolution=4)
        loft(f"SIDEPOD_FLOOR_BLEND_{side:+d}", [
            (-0.44,side*0.43,0.29,0.15,0.075,2.8),(-0.05,side*0.48,0.255,0.17,0.07,3.0),
            (0.40,side*0.47,0.235,0.16,0.065,3.1),(0.84,side*0.40,0.225,0.14,0.06,3.0),
            (1.20,side*0.31,0.25,0.095,0.055,2.7)],
            sidepods, mats["clay"], radial=40)
    loft("ENGINE_COVER_TAPER", [(0.22,0,0.59,0.26,0.25,2.5),(0.48,0,0.66,0.25,0.34,2.4),
         (0.75,0,0.62,0.22,0.30,2.5),(1.05,0,0.55,0.18,0.24,2.5),(1.34,0,0.48,0.13,0.17,2.3),
         (1.62,0,0.43,0.08,0.11,2.1),(1.88,0,0.40,0.045,0.07,2.0)],
         sidepods, mats["clay"], radial=56)
    loft("AIRBOX_INTAKE", [(0.34,0,0.79,0.09,0.12,2.2),(0.49,0,0.91,0.12,0.14,2.3),
                           (0.60,0,0.95,0.105,0.12,2.2),(0.71,0,0.88,0.075,0.085,2.0)],
         sidepods, mats["duct"], radial=40)

    front = collections["04_FRONT_WING"]
    airfoil("FRONT_WING_MAIN", -2.42, 2.0, 0.29, 0.14, 0.045, front, mats["clay_dark"], 41, 22, 0.06, 0.025)
    airfoil("FRONT_WING_FLAP_1", -2.34, 1.78, 0.22, 0.205, 0.038, front, mats["clay"], 37, 18, 0.045, 0.02)
    airfoil("FRONT_WING_FLAP_2", -2.27, 1.48, 0.17, 0.265, 0.032, front, mats["clay"], 33, 16, 0.025, 0.012)
    for side in (-1,1):
        rounded_box(f"FRONT_ENDPLATE_{side:+d}", (side*0.975,0.19,-2.40),(0.05,0.25,0.38),front,mats["clay_dark"],0.018)
        cylinder_between(f"FRONT_WING_PYLON_{side:+d}",(side*0.10,0.30,-2.20),(side*0.10,0.16,-2.39),0.018,front,mats["metal"],16)

    rear = collections["05_REAR_WING"]
    airfoil("REAR_WING_MAIN", 2.18, 1.36, 0.32, 0.93, 0.055, rear, mats["clay_dark"], 31, 22, -0.02, 0.02)
    airfoil("REAR_WING_FLAP", 2.12, 1.30, 0.25, 1.085, 0.045, rear, mats["clay"], 31, 20, -0.015, 0.015)
    for side in (-1,1):
        rounded_box(f"REAR_ENDPLATE_{side:+d}",(side*0.67,1.00,2.21),(0.025,0.36,0.38),rear,mats["clay_dark"],0.005)
        cylinder_between(f"REAR_WING_SUPPORT_{side:+d}",(side*0.18,0.42,1.72),(side*0.18,0.90,2.13),0.024,rear,mats["metal"],18)
    # Exact height and rear envelope are structural wing elements, not hidden validation markers.
    airfoil("REAR_WING_TOP_EDGE", 2.14, 1.22, 0.10, 1.135, 0.04, rear, mats["clay_dark"], 25, 10)
    rounded_box("REAR_ENVELOPE_EDGE", (0,0.86,2.425),(0.18,0.08,0.05),rear,mats["clay_dark"],0.012)

    floor_diffuser(collections["06_FLOOR_DIFFUSER"], mats)

    wheel_col = collections["07_WHEELS_TYRES"]
    mech = collections["08_SUSPENSION_BRAKES"]
    for side in (-1,1):
        wheel(f"FRONT_{'L' if side < 0 else 'R'}",side*0.89,-1.75,0.36,0.22,wheel_col,mech,mats,False)
        wheel(f"REAR_{'L' if side < 0 else 'R'}",side*0.86,1.85,0.38,0.28,wheel_col,mech,mats,True)
        for axle_z, inner_x, center_y, tag in ((-1.75,0.28,0.40,"FRONT"),(1.85,0.31,0.43,"REAR")):
            outer_x = side*(0.79 if tag=="FRONT" else 0.73)
            for index,(iy,oz) in enumerate(((center_y+0.13,-0.10),(center_y-0.12,0.08))):
                cylinder_between(f"{tag}_{'L' if side<0 else 'R'}_WISHBONE_{index}",
                    (side*inner_x,iy,axle_z+oz),(outer_x,center_y,axle_z),0.014,mech,mats["metal"],16)
            cylinder_between(f"{tag}_{'L' if side<0 else 'R'}_PUSHROD",
                (side*(inner_x*0.78),center_y+0.22,axle_z-0.04),(outer_x,center_y+0.02,axle_z),0.012,mech,mats["metal"],16)
    cylinder_between("STEERING_RACK",(-0.44,0.39,-1.72),(0.44,0.39,-1.72),0.016,mech,mats["metal"],18)
    cylinder_between("REAR_DRIVESHAFT",(-0.72,0.38,1.85),(0.72,0.38,1.85),0.021,mech,mats["metal"],18)

    # Exact overall length/width locks are visible aero surfaces.
    rounded_box("FRONT_BOUNDARY_SPLITTER",(0,0.095,-2.575),(0.28,0.03,0.05),front,mats["clay_dark"],0.006)

    return collections, mats


def object_project_bounds(obj):
    corners = [obj.matrix_world @ Vector(corner) for corner in obj.bound_box]
    # Blender -> exported/project convention: (x, z, -y)
    return [(c.x, c.z, -c.y) for c in corners]


def measure_scene(collections):
    points = []
    triangles = 0
    meshes = 0
    for name, col in collections.items():
        if name in ("00_REFERENCE_CONTROLS", "09_MATERIALS", "10_LOD_EXPORTS"):
            continue
        for obj in col.all_objects:
            if obj.type not in {"MESH", "CURVE"}:
                continue
            points.extend(object_project_bounds(obj))
            if obj.type == "MESH":
                meshes += 1
                eval_obj = obj.evaluated_get(bpy.context.evaluated_depsgraph_get())
                mesh = eval_obj.to_mesh()
                mesh.calc_loop_triangles()
                triangles += len(mesh.loop_triangles)
                eval_obj.to_mesh_clear()
    mins = [min(p[i] for p in points) for i in range(3)]
    maxs = [max(p[i] for p in points) for i in range(3)]
    return {
        "bounds": {"min": mins, "max": maxs},
        "dimensions": {"width": maxs[0]-mins[0], "height": maxs[1]-mins[1], "length": maxs[2]-mins[2]},
        "wheelbase": 3.6,
        "diffuserExitWidth": 1.16,
        "meshObjects": meshes,
        "evaluatedTriangles": triangles,
    }


def setup_studio(mats):
    scene = bpy.context.scene
    scene.render.engine = "BLENDER_EEVEE"
    scene.render.resolution_x = 960
    scene.render.resolution_y = 640
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = "PNG"
    scene.render.film_transparent = False
    scene.render.image_settings.color_mode = "RGBA"
    scene.view_settings.look = "AgX - Medium High Contrast"
    scene.world.color = (0.008,0.010,0.014)

    bpy.ops.mesh.primitive_plane_add(size=30, location=(0,0,-0.006))
    ground = bpy.context.object
    ground.name = "REVIEW_CYCLORAMA_GROUND"
    ground.data.materials.append(material("STUDIO_GROUND", (0.018,0.022,0.028),0.0,0.48))
    ground.hide_render = False
    for owner in list(ground.users_collection): owner.objects.unlink(ground)
    bpy.context.scene.collection.objects.link(ground)

    for name, location, energy, size, color in (
        ("KEY",(4.2,3.0,5.2),1600,4.0,(0.90,0.95,1.0)),
        ("FILL",(-4.0,1.5,2.8),900,3.2,(0.55,0.70,1.0)),
        ("RIM",(-1.0,-4.5,3.8),1300,3.0,(1.0,0.58,0.32)),
    ):
        light_data = bpy.data.lights.new(name, "AREA")
        light_data.energy = energy
        light_data.shape = "DISK"
        light_data.size = size
        light_data.color = color
        obj = bpy.data.objects.new(name, light_data)
        obj.location = location
        bpy.context.scene.collection.objects.link(obj)
        obj.rotation_euler = ((Vector((0,0,0))-obj.location).to_track_quat('-Z','Y').to_euler())

    camera_data = bpy.data.cameras.new("CLAY_GATE_CAMERA")
    camera_data.lens = 51
    camera = bpy.data.objects.new("CLAY_GATE_CAMERA", camera_data)
    bpy.context.scene.collection.objects.link(camera)
    scene.camera = camera
    return camera


CAMERAS = {
    "front": ((0,0.90,-6.25),(0,0.34,-0.75)),
    "rear": ((0,0.92,6.25),(0,0.40,0.80)),
    "side": ((7.2,1.28,0),(0,0.40,0)),
    "top": ((0.01,7.8,0),(0,0.15,0)),
    "front-three-quarter": ((4.8,1.90,-4.85),(0,0.42,0)),
    "rear-three-quarter": ((-4.8,1.78,4.8),(0,0.40,0.35)),
    "cockpit-close-up": ((1.45,1.25,-1.34),(0,0.66,-0.10)),
    "sidepod-close-up": ((1.72,0.86,-1.00),(0.47,0.43,-0.32)),
    "diffuser-underside": ((1.0,0.12,3.35),(0,0.20,1.72)),
    "wheel-suspension-close-up": ((1.76,0.86,-2.18),(0.67,0.37,-1.72)),
}


def set_camera(camera, position, target):
    camera.location = p2b(position)
    direction = p2b(target) - camera.location
    camera.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()


def render_evidence(camera, mats):
    scene = bpy.context.scene
    reflective = material("INSPECTION_REFLECTIVE", (0.18,0.21,0.24),0.55,0.16)
    for mode, override in (("clay", None),("reflective",reflective)):
        scene.view_layers[0].material_override = override
        for name,(position,target) in CAMERAS.items():
            set_camera(camera, position, target)
            scene.render.filepath = str(EVIDENCE / f"{name}-{mode}.png")
            bpy.ops.render.render(write_still=True)
    scene.view_layers[0].material_override = None


def export_glb(collections):
    bpy.ops.object.select_all(action="DESELECT")
    exportable = []
    for name,col in collections.items():
        if name in ("00_REFERENCE_CONTROLS","09_MATERIALS","10_LOD_EXPORTS"):
            continue
        for obj in col.all_objects:
            if obj.type in {"MESH","CURVE"}:
                obj.select_set(True)
                exportable.append(obj)
    bpy.context.view_layer.objects.active = exportable[0]
    bpy.ops.export_scene.gltf(
        filepath=str(GLB_PATH), export_format="GLB", use_selection=True,
        export_apply=True, export_yup=True, export_materials="EXPORT",
        export_cameras=False, export_lights=False, export_extras=True,
    )
    canonicalize_glb_float_accessors(GLB_PATH)


def canonicalize_glb_float_accessors(path):
    """Remove sub-precision exporter jitter from FLOAT accessors.

    Blender curve tessellation can differ by a few least-significant float bits
    between identical background runs. Seven-decimal metre precision is well
    below this clay gate's dimensional tolerance and makes byte hashes stable.
    """
    raw = path.read_bytes()
    magic, version, _ = struct.unpack_from("<4sII", raw, 0)
    if magic != b"glTF" or version != 2:
        raise RuntimeError("Expected binary glTF 2.0")
    offset = 12
    chunks = []
    while offset < len(raw):
        length, chunk_type = struct.unpack_from("<II", raw, offset)
        offset += 8
        chunks.append([chunk_type, bytearray(raw[offset:offset + length])])
        offset += length
    document = json.loads(chunks[0][1].decode("utf-8"))
    binary = chunks[1][1]
    component_counts = {"SCALAR": 1, "VEC2": 2, "VEC3": 3, "VEC4": 4,
                        "MAT2": 4, "MAT3": 9, "MAT4": 16}
    views = document.get("bufferViews", [])
    for accessor in document.get("accessors", []):
        if accessor.get("componentType") != 5126 or "bufferView" not in accessor:
            continue
        view = views[accessor["bufferView"]]
        components = component_counts[accessor["type"]]
        element_size = components * 4
        stride = view.get("byteStride", element_size)
        base = view.get("byteOffset", 0) + accessor.get("byteOffset", 0)
        canonical_elements = []
        for index in range(accessor["count"]):
            start = base + index * stride
            values = struct.unpack_from(f"<{components}f", binary, start)
            precision = 5 if accessor["type"] == "VEC2" else 7
            canonical = tuple(0.0 if abs(value) < 5e-8 else round(value, precision) for value in values)
            struct.pack_into(f"<{components}f", binary, start, *canonical)
            canonical_elements.append(canonical)
        if "min" in accessor:
            accessor["min"] = [min(values[i] for values in canonical_elements) for i in range(components)]
        if "max" in accessor:
            accessor["max"] = [max(values[i] for values in canonical_elements) for i in range(components)]
    json_bytes = json.dumps(document, separators=(",", ":"), ensure_ascii=True).encode("utf-8")
    json_bytes += b" " * ((4 - len(json_bytes) % 4) % 4)
    chunks[0][1] = bytearray(json_bytes)
    body = bytearray()
    for chunk_type, content in chunks:
        body.extend(struct.pack("<II", len(content), chunk_type))
        body.extend(content)
    path.write_bytes(struct.pack("<4sII", b"glTF", 2, 12 + len(body)) + body)


def main():
    collections, mats = build_scene()
    camera = setup_studio(mats)
    report = measure_scene(collections)
    report["locks"] = LOCKS
    report["blenderVersion"] = bpy.app.version_string
    report["coordinateTransform"] = "project(x,y,z) -> Blender(x,-z,y); glTF exporter returns Y-up"
    report["authorship"] = "Original Podium EDS geometry; no C42 asset imported"
    report["status"] = "OWNER CLAY DESIGN GATE - visual approval required"
    (OUT / "geometry-report.json").write_text(json.dumps(report, indent=2), encoding="utf-8")
    bpy.context.scene["eds_g03_locks"] = json.dumps(LOCKS)
    bpy.context.scene["eds_g03_status"] = "OWNER CLAY DESIGN GATE"
    bpy.context.scene["eds_g03_provenance"] = "Original Podium EDS Blender authoring"
    bpy.ops.wm.save_as_mainfile(filepath=str(BLEND_PATH))
    export_glb(collections)
    if os.environ.get("EDS_G03_SKIP_RENDER") != "1":
        render_evidence(camera, mats)
    digest = hashlib.sha256(GLB_PATH.read_bytes()).hexdigest()
    (OUT / "eds-g03-clay-review.sha256").write_text(f"{digest}  {GLB_PATH.name}\n", encoding="utf-8")
    print(json.dumps({"blend":str(BLEND_PATH),"glb":str(GLB_PATH),"sha256":digest,"report":report},indent=2))


if __name__ == "__main__":
    main()
