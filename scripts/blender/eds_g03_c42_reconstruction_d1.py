"""Author the original EDS-G03 C42-referenced reconstruction D1.

C42 is imported into a reference-only collection, normalized for matched-view
review, and never used as an EDS geometry source.  Every EDS vertex is created
from the locked project hardpoints and original analytic sections below.

Run with Blender 5.2.2 LTS:
  blender --background --factory-startup --python scripts/blender/eds_g03_c42_reconstruction_d1.py
"""

from __future__ import annotations

import hashlib
import json
import math
import os
from pathlib import Path

import bpy
import bmesh
from mathutils import Vector


ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "docs" / "commercialization" / "r3" / "blender-authoring" / "c42-reconstruction-d1"
EVIDENCE = OUT / "evidence"
BLEND_PATH = OUT / "EDS-G03-C42-Referenced-Reconstruction-D1.blend"
GLB_PATH = OUT / "eds-g03-c42-reconstruction-d1.glb"
C42_PATH = ROOT / "public" / "models" / "c42.v2.glb"
SKIP_RENDER = os.environ.get("EDS_G03_SKIP_RENDER") == "1"

LOCKS = {
    "length": 5.05, "width": 2.0, "height": 1.18, "wheelbase": 3.6,
    "frontAxleZ": -1.75, "rearAxleZ": 1.85,
    "frontTrack": 1.78, "rearTrack": 1.72,
    "frontWheelRadius": 0.36, "rearWheelRadius": 0.38,
    "frontTyreWidth": 0.22, "rearTyreWidth": 0.28,
    "diffuserExitWidth": 1.16,
    "bounds": {"min": [-1.0, 0.0, -2.6], "max": [1.0, 1.18, 2.45]},
}

COLLECTIONS = (
    "00_C42_REFERENCE_DEV_ONLY", "01_G03_MONOCOQUE_COCKPIT", "02_G03_FRONT_AERO",
    "03_G03_SIDEPODS_DUCTS", "04_G03_FLOOR_DIFFUSER", "05_G03_REAR_AERO",
    "06_G03_WHEELS_BRAKES", "07_G03_SUSPENSION", "08_G03_DETAIL",
    "09_LIGHTS_CAMERAS",
)


def p2b(p):
    """Project (X lateral, Y up, Z rear) to Blender (X, Y front, Z up)."""
    return Vector((p[0], -p[2], p[1]))


def reset():
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    for blocks in (bpy.data.meshes, bpy.data.curves, bpy.data.materials,
                   bpy.data.cameras, bpy.data.lights):
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


def mat(name, color, metallic=0.0, roughness=0.42):
    item = bpy.data.materials.new(name)
    item.diffuse_color = (*color, 1)
    item.use_nodes = True
    bsdf = item.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = (*color, 1)
    bsdf.inputs["Metallic"].default_value = metallic
    bsdf.inputs["Roughness"].default_value = roughness
    return item


def tag(obj, assembly):
    obj["eds_owned"] = True
    obj["assembly"] = assembly
    obj["provenance"] = "Original Podium EDS analytic Blender authoring; no C42 mesh reuse"
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


def superellipse(a, rx, ry, exponent=2.0):
    c, s = math.cos(a), math.sin(a)
    power = 2.0 / exponent
    return (math.copysign(abs(c) ** power, c) * rx,
            math.copysign(abs(s) ** power, s) * ry)


def loft(name, stations, col, material, radial=64, caps=True):
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


def loft_side(name, side, stations, col, material, radial=48):
    return loft(name, [(z, side * cx, cy, rx, ry, ex) for z, cx, cy, rx, ry, ex in stations],
                col, material, radial)


def tube(name, points, radius, col, material, resolution=3, cyclic=False):
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
    spline.use_cyclic_u = cyclic
    obj = bpy.data.objects.new(name, data)
    col.objects.link(obj)
    data.materials.append(material)
    return tag(obj, col.name)


def cylinder(name, a, b, radius, col, material, vertices=20):
    pa, pb = p2b(a), p2b(b)
    delta = pb - pa
    bpy.ops.mesh.primitive_cylinder_add(vertices=vertices, radius=radius,
                                        depth=delta.length, location=(pa + pb) * 0.5)
    obj = bpy.context.object
    obj.name = name
    obj.rotation_mode = "QUATERNION"
    obj.rotation_quaternion = Vector((0, 0, 1)).rotation_difference(delta.normalized())
    move(obj, col)
    obj.data.materials.append(material)
    for polygon in obj.data.polygons:
        polygon.use_smooth = True
    return tag(obj, col.name)


def rounded_box(name, center, dimensions, col, material, bevel=0.012):
    bpy.ops.mesh.primitive_cube_add(location=p2b(center))
    obj = bpy.context.object
    obj.name = name
    obj.dimensions = (dimensions[0], dimensions[2], dimensions[1])
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    move(obj, col)
    obj.data.materials.append(material)
    if bevel:
        mod = obj.modifiers.new("Controlled radius", "BEVEL")
        mod.width = bevel
        mod.segments = 3
    return tag(obj, col.name)


def airfoil(name, z_center, span, chord, y_center, thickness, col, material,
            span_sections=65, chord_sections=25, sweep=0.0, camber=0.012):
    verts = []
    for si in range(span_sections):
        u = si / (span_sections - 1)
        x = (u - 0.5) * span
        zc = z_center + sweep * (abs(2 * u - 1) ** 2)
        for surface in (1, -1):
            for ci in range(chord_sections):
                t = ci / (chord_sections - 1)
                profile = max(0.08, math.sin(math.pi * t) ** 0.68)
                y = y_center + camber * math.sin(math.pi * t) + surface * thickness * profile * 0.5
                verts.append((x, y, zc + (t - 0.5) * chord))
    strip = 2 * chord_sections
    faces = []
    for si in range(span_sections - 1):
        for surface in range(2):
            a = si * strip + surface * chord_sections
            b = (si + 1) * strip + surface * chord_sections
            for ci in range(chord_sections - 1):
                q = (a + ci, a + ci + 1, b + ci + 1, b + ci)
                faces.append(q if surface == 0 else tuple(reversed(q)))
        a, b = si * strip, (si + 1) * strip
        faces.append((a, b, b + chord_sections, a + chord_sections))
        faces.append((a + chord_sections - 1, a + 2 * chord_sections - 1,
                      b + 2 * chord_sections - 1, b + chord_sections - 1))
    for si in (0, span_sections - 1):
        start = si * strip
        loop = list(range(start, start + chord_sections))
        loop.extend(reversed(range(start + chord_sections, start + strip)))
        faces.append(tuple(loop if si else reversed(loop)))
    return mesh_obj(name, verts, faces, col, material)


def annular_duct(name, side, z_front, center_x, center_y, outer, inner, depth, col, lip_mat, duct_mat):
    radial = 64
    verts, rings = [], []
    specs = ((z_front, *outer), (z_front + depth * 0.32, outer[0] * 0.96, outer[1] * 0.96),
             (z_front, *inner), (z_front + depth, inner[0] * 0.76, inner[1] * 0.74))
    for z, rx, ry in specs:
        ring = []
        for i in range(radial):
            dx, dy = superellipse(2 * math.pi * i / radial, rx, ry, 3.0)
            ring.append(len(verts))
            verts.append((side * (center_x + dx), center_y + dy, z))
        rings.append(ring)
    faces, groups = [], []
    for i in range(radial):
        n = (i + 1) % radial
        faces.append((rings[0][i], rings[0][n], rings[1][n], rings[1][i])); groups.append(0)
        faces.append((rings[0][i], rings[2][i], rings[2][n], rings[0][n])); groups.append(0)
        faces.append((rings[2][i], rings[3][i], rings[3][n], rings[2][n])); groups.append(1)
    obj = mesh_obj(name, verts, faces, col, lip_mat)
    obj.data.materials.append(duct_mat)
    for poly, group in zip(obj.data.polygons, groups):
        poly.material_index = group
    return obj


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
    # Flatten the imported hierarchy before normalization.  Scaling only the
    # leaf mesh leaves glTF parent transforms active and produces a tiny render.
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
    # Imported C42 is Blender X-width, Y-length, Z-up. Centre it and put tyres at ground.
    model.location -= Vector((center.x, center.y, mn.z))
    for slot in model.material_slots:
        slot.material = materials["reference"]
    return {
        "asset": str(C42_PATH.relative_to(ROOT)), "blendSourceFound": False,
        "sourceMeshes": len(meshes), "sourceVertices": sum(len(o.data.vertices) for o in meshes),
        "sourcePolygons": sum(len(o.data.polygons) for o in meshes),
        "sourceTriangles": sum(len(p.vertices)-2 for o in meshes for p in o.data.polygons),
        "sourceBounds": {"min": list(source_min), "max": list(source_max), "size": list(source_size)},
        "normalizationScale": scale,
        "measurementClassification": "directly measured from imported GLB; normalized only for visual comparison",
        "notes": "C42 geometry remains in a DEV-only reference collection and is excluded from EDS export",
    }


def build_body(cols, m):
    body = cols["01_G03_MONOCOQUE_COCKPIT"]
    # Original long nose and survival cell use continuous sections, not an old EDS mesh.
    loft("G03_NOSE_MONOCOQUE", [
        (-2.44,0,0.31,0.055,0.055,2.2), (-2.18,0,0.34,0.10,0.075,2.4),
        (-1.86,0,0.38,0.17,0.105,2.6), (-1.48,0,0.43,0.24,0.14,2.8),
        (-1.08,0,0.49,0.31,0.19,3.0), (-0.72,0,0.52,0.36,0.23,3.1),
        (-0.40,0,0.54,0.40,0.245,3.2), (-0.12,0,0.53,0.43,0.25,3.2),
        (0.14,0,0.49,0.43,0.23,3.0), (0.40,0,0.46,0.38,0.20,2.8),
    ], body, m["clay"], radial=72)
    # Recessed cockpit cavity, shoulders and integrated rim.
    loft("COCKPIT_RECESSED_VOID", [
        (-0.78,0,0.63,0.18,0.065,2.2), (-0.48,0,0.67,0.255,0.13,2.5),
        (-0.08,0,0.67,0.29,0.15,2.8), (0.26,0,0.62,0.24,0.13,2.5),
        (0.45,0,0.56,0.16,0.07,2.2),
    ], body, m["interior"], radial=64)
    for side in (-1,1):
        loft_side(f"SURVIVAL_CELL_SHOULDER_{side:+d}", side, [
            (-0.72,0.29,0.61,0.105,0.12,2.8), (-0.38,0.36,0.64,0.13,0.14,3.0),
            (0.02,0.39,0.62,0.145,0.145,3.0), (0.38,0.38,0.55,0.13,0.13,2.8),
            (0.70,0.33,0.48,0.11,0.11,2.6),
        ], body, m["clay"], radial=48)
        tube(f"COCKPIT_RIM_{side:+d}", [
            (side*0.21,0.67,-0.72),(side*0.30,0.75,-0.48),(side*0.33,0.76,-0.12),
            (side*0.28,0.72,0.24),(side*0.15,0.62,0.42)], 0.025, body, m["dark"], 4)
    # Seat, headrest, dashboard and steering assembly.
    loft("DRIVER_SEAT", [(0.34,0,0.42,0.17,0.10,2.4),(0.08,0,0.48,0.18,0.14,2.4),
                          (-0.20,0,0.53,0.16,0.12,2.3)], body, m["seat"], radial=40)
    rounded_box("DASHBOARD", (0,0.58,-0.40),(0.42,0.08,0.10),body,m["dark"],0.025)
    bpy.ops.mesh.primitive_torus_add(major_segments=48,minor_segments=12,major_radius=0.115,
                                     minor_radius=0.014,location=p2b((0,0.60,-0.47)),rotation=(math.pi/2,0,0))
    wheel = bpy.context.object; wheel.name="STEERING_WHEEL"; move(wheel,body); wheel.data.materials.append(m["metal"]); tag(wheel,body.name)
    cylinder("STEERING_COLUMN",(0,0.58,-0.48),(0,0.52,-0.30),0.018,body,m["metal"],20)
    # Halo: slender front blade, crown and rear swept legs with integrated mount fairings.
    tube("HALO_CROWN", [(-0.25,0.86,0.12),(-0.28,1.03,-0.10),(-0.18,1.132,-0.39),
                         (0,1.132,-0.48),(0.18,1.132,-0.39),(0.28,1.03,-0.10),(0.25,0.86,0.12)],
         0.04, body, m["halo"], 5)
    tube("HALO_FRONT_BLADE",[(0,0.67,-0.67),(0,0.86,-0.60),(0,1.10,-0.49)],0.033,body,m["halo"],4)
    for side in (-1,1):
        loft_side(f"HALO_MOUNT_FAIRING_{side:+d}",side,[(0.03,0.24,0.72,0.09,0.075,2.6),
                  (0.15,0.25,0.78,0.075,0.09,2.6),(0.23,0.25,0.84,0.055,0.075,2.5)],body,m["clay"],36)
    return body


def build_sidepods(cols, m):
    col = cols["03_G03_SIDEPODS_DUCTS"]
    stations = [
        (-0.62,0.47,0.46,0.22,0.18,3.2),(-0.38,0.50,0.47,0.26,0.20,3.3),
        (-0.02,0.53,0.44,0.30,0.22,3.3),(0.38,0.54,0.41,0.31,0.21,3.2),
        (0.78,0.50,0.38,0.28,0.19,3.0),(1.16,0.42,0.36,0.23,0.16,2.8),
        (1.48,0.31,0.37,0.15,0.12,2.6),(1.68,0.22,0.39,0.08,0.08,2.4),
    ]
    for side in (-1,1):
        loft_side(f"SCULPTED_SIDEPOD_{side:+d}",side,stations,col,m["clay"],64)
        annular_duct(f"SIDEPOD_INLET_{side:+d}",side,-0.66,0.48,0.49,(0.23,0.18),(0.17,0.125),
                     0.34,col,m["clay"],m["duct"])
        # Deep undercut bridge between sidepod root and floor edge.
        loft_side(f"UNDERCUT_CHANNEL_{side:+d}",side,[(-0.44,0.43,0.27,0.15,0.08,2.8),
                  (-0.02,0.47,0.25,0.18,0.075,3.0),(0.46,0.49,0.23,0.18,0.065,3.0),
                  (0.94,0.45,0.22,0.15,0.055,2.8),(1.30,0.37,0.23,0.10,0.045,2.6)],col,m["dark"],48)
        for i,z in enumerate((0.10,0.25,0.40,0.55)):
            rounded_box(f"COOLING_LOUVRE_{side:+d}_{i}",(side*0.59,0.61,z),(0.16,0.012,0.10),col,m["dark"],0.004)
    loft("ENGINE_COVER",[(0.35,0,0.54,0.32,0.22,2.8),(0.70,0,0.58,0.30,0.28,2.8),
         (1.04,0,0.64,0.25,0.33,2.6),(1.34,0,0.62,0.20,0.30,2.5),
         (1.62,0,0.55,0.15,0.23,2.4),(1.86,0,0.49,0.10,0.16,2.3)],col,m["clay"],64)
    annular_duct("AIRBOX_INLET",1,-0.02,0.0,0.86,(0.16,0.12),(0.11,0.075),0.25,col,m["clay"],m["duct"])
    return col


def build_floor(cols, m):
    col = cols["04_G03_FLOOR_DIFFUSER"]
    z_rows = [-1.16,-0.92,-0.62,-0.30,0.05,0.40,0.76,1.08,1.36,1.60,1.82,2.04,2.28,2.38]
    x_count = 41
    verts, top, bottom = [], [], []
    for z in z_rows:
        rear = max(0,min(1,(z-0.72)/(2.38-0.72)))
        half = 0.57 + 0.10*math.sin(max(0,min(1,(z+1.16)/2.15))*math.pi)
        if z>1.42: half += (z-1.42)/(2.38-1.42)*(0.58-half)
        tr, br = [], []
        for i in range(x_count):
            xf=-1+2*i/(x_count-1); x=xf*half; lateral=abs(x)/half
            tunnel=math.exp(-((abs(x)-0.30)/0.14)**2)
            lower=0.060+rear*(0.17+0.10*tunnel)+0.018*lateral**4
            upper=lower+0.042+0.010*rear
            br.append(len(verts)); verts.append((x,lower,z))
            tr.append(len(verts)); verts.append((x,upper,z))
        bottom.append(br); top.append(tr)
    faces=[]
    for rows,reverse in ((top,False),(bottom,True)):
        for zi in range(len(z_rows)-1):
            for xi in range(x_count-1):
                q=(rows[zi][xi],rows[zi][xi+1],rows[zi+1][xi+1],rows[zi+1][xi])
                faces.append(tuple(reversed(q)) if reverse else q)
    for zi in range(len(z_rows)-1):
        faces.append((top[zi][0],top[zi+1][0],bottom[zi+1][0],bottom[zi][0]))
        faces.append((top[zi][-1],bottom[zi][-1],bottom[zi+1][-1],top[zi+1][-1]))
    for row in (0,len(z_rows)-1):
        faces.append(tuple(top[row]+list(reversed(bottom[row]))))
    floor = mesh_obj("FLOOR_VENTURI_TWIN_CHANNEL",verts,faces,col,m["carbon"])
    # The closed twin-channel shell uses two generated skins and explicit edge
    # walls. Recalculate once so cap/side winding is globally coherent.
    edit_mesh = bmesh.new()
    edit_mesh.from_mesh(floor.data)
    bmesh.ops.recalc_face_normals(edit_mesh, faces=edit_mesh.faces)
    edit_mesh.to_mesh(floor.data)
    edit_mesh.free()
    for side in (-1,1):
        tube(f"FLOOR_EDGE_WING_{side:+d}",[(side*0.64,0.12,-0.95),(side*0.69,0.14,-0.40),
             (side*0.68,0.15,0.25),(side*0.64,0.17,0.92),(side*0.58,0.22,1.55)],0.018,col,m["carbon"],3)
    for x in (-0.48,-0.18,0.18,0.48):
        rounded_box(f"DIFFUSER_STRAKE_{x:+.2f}",(x,0.20,1.86),(0.018,0.23,0.92),col,m["carbon"],0.004)
    return col


def build_wings(cols, m):
    front=cols["02_G03_FRONT_AERO"]
    # Exact front-most extent: first element centre -2.43 with 0.34 chord => -2.60.
    airfoil("FRONT_WING_MAIN",-2.43,1.92,0.34,0.115,0.045,front,m["carbon"],65,25,0.07)
    airfoil("FRONT_WING_FLAP_1",-2.29,1.78,0.25,0.170,0.040,front,m["clay"],61,23,0.055)
    airfoil("FRONT_WING_FLAP_2",-2.17,1.58,0.19,0.225,0.035,front,m["clay"],57,21,0.040)
    for side in (-1,1):
        rounded_box(f"FRONT_ENDPLATE_{side:+d}",(side*0.972,0.22,-2.34),(0.056,0.34,0.48),front,m["carbon"],0.018)
        cylinder(f"NOSE_PYLON_{side:+d}",(side*0.075,0.25,-2.35),(side*0.09,0.36,-2.12),0.021,front,m["metal"],18)
        # Small legal-looking cascades, structural rather than decorative clutter.
        airfoil(f"FRONT_CASCADE_{side:+d}",-2.30,0.23,0.16,0.285,0.025,front,m["dark"],25,15,0.02)
    rear=cols["05_G03_REAR_AERO"]
    # Rear-most extent 2.45.
    airfoil("REAR_WING_MAIN",2.22,1.22,0.42,0.92,0.075,rear,m["clay"],65,25,0.02,0.02)
    airfoil("REAR_WING_UPPER",2.30,1.16,0.28,1.045,0.060,rear,m["clay"],61,23,0.01,0.018)
    airfoil("BEAM_WING",2.16,1.06,0.24,0.50,0.045,rear,m["carbon"],57,21,0.01,0.010)
    for side in (-1,1):
        rounded_box(f"REAR_ENDPLATE_{side:+d}",(side*0.63,0.85,2.21),(0.045,0.52,0.48),rear,m["carbon"],0.014)
        cylinder(f"REAR_WING_SUPPORT_{side:+d}",(side*0.18,0.36,1.76),(side*0.18,0.88,2.23),0.026,rear,m["metal"],20)
    return front,rear


def build_wheel(name,x,z,radius,width,cols,m,rear=False):
    wheel_col=cols["06_G03_WHEELS_BRAKES"]
    center=(x,radius,z)
    tyre_section=radius*0.235
    bpy.ops.mesh.primitive_torus_add(major_segments=128,minor_segments=48,
        major_radius=radius-tyre_section,minor_radius=tyre_section,location=p2b(center),rotation=(0,math.pi/2,0))
    tyre=bpy.context.object; tyre.name=name+"_TYRE"; bpy.ops.object.transform_apply(location=False,rotation=True,scale=False)
    tyre.dimensions=(width,2*radius,2*radius); bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
    move(tyre,wheel_col); tyre.data.materials.append(m["rubber"]); tag(tyre,wheel_col.name)
    bpy.ops.mesh.primitive_torus_add(major_segments=96,minor_segments=24,major_radius=radius*0.49,
        minor_radius=radius*0.060,location=p2b(center),rotation=(0,math.pi/2,0))
    rim=bpy.context.object; rim.name=name+"_RIM_BARREL"; bpy.ops.object.transform_apply(location=False,rotation=True,scale=False)
    rim.dimensions.x=width*0.76; bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
    move(rim,wheel_col); rim.data.materials.append(m["metal"]); tag(rim,wheel_col.name)
    cylinder(name+"_HUB",(x-width*.32,radius,z),(x+width*.32,radius,z),radius*.105,wheel_col,m["metal"],32)
    cylinder(name+"_BRAKE_DISC",(x-width*.18,radius,z),(x+width*.18,radius,z),radius*.34,wheel_col,m["brake"],64)
    for face in (-1,1):
        fx=x+face*width*.32
        for i in range(12):
            a=2*math.pi*i/12+(0.08 if rear else 0)
            cylinder(f"{name}_SPOKE_{face:+d}_{i:02d}",(fx,radius,z),
                     (fx,radius+math.sin(a)*radius*.48,z+math.cos(a)*radius*.48),.008,wheel_col,m["metal"],10)
    rounded_box(name+"_CALIPER",(x+math.copysign(width*.15,x),radius+.01,z-radius*.20),
                (.052,.17,.08),wheel_col,m["caliper"],.014)
    # Open brake duct with a visible throat.
    annular_duct(name+"_BRAKE_DUCT",1 if x>0 else -1,z-radius*.24,abs(x)-width*.28,radius+.02,
                 (radius*.17,radius*.20),(radius*.11,radius*.13),radius*.18,wheel_col,m["carbon"],m["duct"])


def build_running_gear(cols,m):
    for side in (-1,1):
        build_wheel(f"FRONT_{'R' if side>0 else 'L'}",side*LOCKS["frontTrack"]/2,LOCKS["frontAxleZ"],
                    LOCKS["frontWheelRadius"],LOCKS["frontTyreWidth"],cols,m,False)
        build_wheel(f"REAR_{'R' if side>0 else 'L'}",side*LOCKS["rearTrack"]/2,LOCKS["rearAxleZ"],
                    LOCKS["rearWheelRadius"],LOCKS["rearTyreWidth"],cols,m,True)
    col=cols["07_G03_SUSPENSION"]
    front_links=[((.21,.36,-1.45),(.79,.31,-1.75)),((.24,.46,-1.31),(.80,.44,-1.75)),
                 ((.20,.37,-1.98),(.79,.31,-1.75)),((.25,.49,-2.10),(.80,.44,-1.75)),
                 ((.15,.58,-1.50),(.76,.57,-1.75))]
    rear_links=[((.22,.38,1.48),(.73,.34,1.85)),((.25,.51,1.38),(.74,.49,1.85)),
                ((.20,.40,2.06),(.73,.34,1.85)),((.25,.54,2.17),(.74,.49,1.85)),
                ((.16,.58,1.60),(.70,.61,1.85))]
    for side in (-1,1):
        for group,links in (("FRONT",front_links),("REAR",rear_links)):
            for i,(a,b) in enumerate(links):
                aa=(side*a[0],a[1],a[2]); bb=(side*b[0],b[1],b[2])
                cylinder(f"{group}_WISHBONE_{side:+d}_{i}",aa,bb,.018 if i<4 else .015,col,m["carbon"],18)
                cylinder(f"{group}_JOINT_{side:+d}_{i}",bb,(bb[0]+side*.015,bb[1],bb[2]),.028,col,m["metal"],20)


def build_detail(cols,m):
    col=cols["08_G03_DETAIL"]
    # Original panel lines and pitot/camera structures.
    for side in (-1,1):
        tube(f"BODY_PANEL_LINE_{side:+d}",[(side*.30,.59,-.95),(side*.41,.62,-.48),
             (side*.45,.57,.05),(side*.39,.49,.58),(side*.28,.45,1.20)],.006,col,m["dark"],2)
        cylinder(f"MIRROR_STEM_{side:+d}",(side*.31,.72,-.34),(side*.50,.78,-.28),.012,col,m["carbon"],16)
        rounded_box(f"MIRROR_HOUSING_{side:+d}",(side*.55,.79,-.27),(.14,.07,.09),col,m["clay"],.025)
    cylinder("PITOT",(0,.42,-2.47),(0,.42,-2.58),.008,col,m["metal"],16)


def build_eds(cols,m):
    build_body(cols,m); build_sidepods(cols,m); build_floor(cols,m); build_wings(cols,m)
    build_running_gear(cols,m); build_detail(cols,m)


def eds_objects(cols):
    return [obj for name,col in cols.items() if name.startswith(("01_","02_","03_","04_","05_","06_","07_","08_")) for obj in col.all_objects]


def evaluated_stats(objects):
    deps=bpy.context.evaluated_depsgraph_get(); verts=tris=polys=0
    bounds=[]
    for obj in objects:
        if obj.type not in {"MESH","CURVE"}: continue
        ev=obj.evaluated_get(deps); mesh=ev.to_mesh()
        verts+=len(mesh.vertices); polys+=len(mesh.polygons); tris+=sum(len(p.vertices)-2 for p in mesh.polygons)
        bounds.extend(obj.matrix_world@Vector(c) for c in obj.bound_box)
        ev.to_mesh_clear()
    mn=[min(v[i] for v in bounds) for i in range(3)]; mx=[max(v[i] for v in bounds) for i in range(3)]
    # Blender XYZ -> project X, Y-up=Z, Z-rear=-Y
    pmin=[mn[0],mn[2],-mx[1]]; pmax=[mx[0],mx[2],-mn[1]]
    return {"objects":len(objects),"vertices":verts,"polygons":polys,"triangles":tris,
            "bounds":{"min":pmin,"max":pmax,"size":[pmax[i]-pmin[i] for i in range(3)]}}


def setup_studio(cols,m):
    world=bpy.context.scene.world or bpy.data.worlds.new("World")
    bpy.context.scene.world=world; world.use_nodes=True
    world.node_tree.nodes["Background"].inputs["Color"].default_value=(.025,.030,.038,1)
    world.node_tree.nodes["Background"].inputs["Strength"].default_value=.38
    col=cols["09_LIGHTS_CAMERAS"]
    rounded_box("STUDIO_FLOOR",(0,-.035,0),(8,.05,8),col,m["floor"],.02)
    for name,loc,energy,size,color in (
        ("KEY",(-3,-4,5),1700,4.0,(1,.92,.82)),("FILL",(4,-1,3),1100,3.0,(.68,.80,1)),
        ("RIM",(0,5,4),1500,3.2,(.82,.90,1))):
        data=bpy.data.lights.new(name,"AREA"); data.energy=energy; data.shape="DISK"; data.size=size; data.color=color
        obj=bpy.data.objects.new(name,data); col.objects.link(obj); obj.location=loc
    cam_data=bpy.data.cameras.new("REVIEW_CAMERA"); cam=bpy.data.objects.new("REVIEW_CAMERA",cam_data); col.objects.link(cam)
    bpy.context.scene.camera=cam; cam_data.lens=58
    scene=bpy.context.scene; scene.render.engine="BLENDER_EEVEE"; scene.render.resolution_x=720; scene.render.resolution_y=450
    scene.render.resolution_percentage=100; scene.render.image_settings.file_format="PNG"; scene.render.film_transparent=False
    scene.render.image_settings.color_mode="RGBA"; scene.view_settings.look="AgX - Medium High Contrast"
    return cam


VIEWS={
 "top":((0,9.4,0),(0,.34,0),52),"side":((8.8,.75,0),(0,.38,0),52),
 "front":((0,.80,-7.1),(0,.36,-.25),58),"rear":((0,.85,7.1),(0,.38,.35),58),
 "front-three-quarter":((4.8,2.25,-5.4),(0,.37,-.20),58),
 "rear-three-quarter":((-4.8,2.15,5.4),(0,.40,.30),58),
 "cockpit-close-up":((2.15,1.65,-2.0),(0,.65,-.20),62),
 "halo-construction":((-1.65,1.65,-1.35),(0,.88,-.24),66),
 "nose-front-wing":((2.35,1.15,-4.05),(0,.33,-1.95),62),
 "sidepod-inlet":((2.35,1.20,-1.85),(.43,.44,-.15),64),
 "floor-diffuser":((-2.35,.55,4.05),(0,.16,1.72),62),
 "suspension-wheels-brakes":((2.30,.92,-3.35),(.68,.36,-1.72),64),
}


def aim(camera,location,target,lens):
    camera.location=p2b(location); camera.rotation_euler=(p2b(target)-camera.location).to_track_quat("-Z","Y").to_euler()
    camera.data.lens=lens


def set_collection_render(cols, reference):
    for name,col in cols.items():
        if name=="09_LIGHTS_CAMERAS": col.hide_render=False
        elif name=="00_C42_REFERENCE_DEV_ONLY": col.hide_render=not reference
        else: col.hide_render=reference


def render_views(camera,cols,root,reference=False,names=None):
    root.mkdir(parents=True,exist_ok=True); set_collection_render(cols,reference)
    for name in names or VIEWS:
        location,target,lens=VIEWS[name]
        aim(camera,location,target,lens)
        bpy.context.scene.render.filepath=str(root/f"{name}.png")
        bpy.ops.render.render(write_still=True)


def wireframe_mode(objects,enabled):
    for obj in objects:
        if obj.type == "MESH":
            if enabled:
                modifier = obj.modifiers.new("__EVIDENCE_WIREFRAME", "WIREFRAME")
                modifier.thickness = 0.003
                modifier.use_replace = True
                modifier.use_boundary = True
            else:
                modifier = obj.modifiers.get("__EVIDENCE_WIREFRAME")
                if modifier:
                    obj.modifiers.remove(modifier)


def export_glb(cols,path):
    # Preserve all semantic source objects in the .blend, but export a single
    # evaluated mesh. glTF then emits one primitive per material instead of one
    # draw call per authoring object (220 objects -> about 11 primitives).
    for obj in bpy.context.selected_objects: obj.select_set(False)
    deps = bpy.context.evaluated_depsgraph_get()
    export_col = bpy.data.collections.new("_TEMP_GLTF_EXPORT")
    bpy.context.scene.collection.children.link(export_col)
    targets = []
    for source in eds_objects(cols):
        if source.type not in {"MESH", "CURVE"}:
            continue
        evaluated = source.evaluated_get(deps)
        new_mesh = bpy.data.meshes.new_from_object(evaluated, depsgraph=deps)
        duplicate = bpy.data.objects.new("EXPORT_" + source.name, new_mesh)
        duplicate.matrix_world = source.matrix_world.copy()
        export_col.objects.link(duplicate)
        targets.append(duplicate)
    for obj in targets: obj.select_set(True)
    bpy.context.view_layer.objects.active=targets[0]
    bpy.ops.object.join()
    export_obj = bpy.context.view_layer.objects.active
    export_obj.name = "EDS_G03_D1_WEBGL"
    bpy.ops.export_scene.gltf(filepath=str(path),export_format="GLB",use_selection=True,
        export_apply=True,export_materials="EXPORT",export_cameras=False,export_lights=False,
        export_yup=True,export_texcoords=False,export_normals=True,export_tangents=False)
    bpy.data.objects.remove(export_obj, do_unlink=True)
    bpy.data.collections.remove(export_col)


def main():
    reset(); OUT.mkdir(parents=True,exist_ok=True); EVIDENCE.mkdir(parents=True,exist_ok=True)
    cols={name:new_collection(name) for name in COLLECTIONS}
    m={
      "clay":mat("EDS_D1_CLAY",(.42,.46,.51),0,.31),"dark":mat("EDS_D1_AERO",(.08,.10,.12),.15,.34),
      "carbon":mat("EDS_D1_CARBON",(.025,.032,.038),.25,.28),"rubber":mat("EDS_D1_RUBBER",(.012,.014,.016),0,.78),
      "metal":mat("EDS_D1_METAL",(.24,.27,.30),.82,.20),"brake":mat("EDS_D1_BRAKE",(.18,.19,.20),.70,.34),
      "caliper":mat("EDS_D1_CALIPER",(.46,.10,.045),.62,.25),"duct":mat("EDS_D1_DUCT",(.003,.004,.006),0,.90),
      "interior":mat("EDS_D1_INTERIOR",(.009,.012,.016),0,.62),"seat":mat("EDS_D1_SEAT",(.035,.042,.05),0,.58),
      "halo":mat("EDS_D1_HALO",(.13,.15,.17),.58,.22),"reference":mat("C42_REFERENCE_CLAY",(.24,.27,.31),0,.42),
      "floor":mat("STUDIO_FLOOR",(.04,.045,.055),0,.72),
      "diagnostic":mat("EDS_D1_REFLECTIVE_DIAGNOSTIC",(.16,.19,.22),.88,.12),
    }
    c42=build_reference(cols,m); build_eds(cols,m); cam=setup_studio(cols,m)
    stats=evaluated_stats(eds_objects(cols))
    scene=bpy.context.scene; scene["eds_revision"]="EDS-G03-C42-Referenced-Reconstruction-D1"
    scene["commercial_status"]="DEV REVIEW ONLY - OWNER GATE"
    scene["c42_use"]="Reference collection only; no geometry copied"
    bpy.ops.wm.save_as_mainfile(filepath=str(BLEND_PATH))
    export_glb(cols,GLB_PATH)
    report={"revision":scene["eds_revision"],"locks":LOCKS,"measured":stats,"c42":c42,
            "glb":{"path":str(GLB_PATH.relative_to(ROOT)),"bytes":GLB_PATH.stat().st_size,
                   "sha256":hashlib.sha256(GLB_PATH.read_bytes()).hexdigest()},
            "authoring":{"blender":bpy.app.version_string,"source":str(Path(__file__).relative_to(ROOT)),
                         "blend":str(BLEND_PATH.relative_to(ROOT))},
            "status":"OWNER GATE - C42-REFERENCED EDS RECONSTRUCTION REVIEW"}
    (OUT/"geometry-report.json").write_text(json.dumps(report,indent=2)+"\n",encoding="utf-8")
    (OUT/"c42-reference-breakdown.json").write_text(json.dumps(c42,indent=2)+"\n",encoding="utf-8")
    if not SKIP_RENDER:
        render_views(cam,cols,EVIDENCE/"eds-clay",False)
        render_views(cam,cols,EVIDENCE/"c42-reference",True)
        bpy.context.scene.view_layers[0].material_override=m["diagnostic"]
        render_views(cam,cols,EVIDENCE/"eds-reflective",False)
        bpy.context.scene.view_layers[0].material_override=None
        wireframe_mode(eds_objects(cols),True)
        render_views(cam,cols,EVIDENCE/"eds-wireframe",False,["top","side","front-three-quarter","rear-three-quarter","cockpit-close-up","floor-diffuser"])
        wireframe_mode(eds_objects(cols),False)
    print("EDS_G03_D1_REPORT="+json.dumps(report))


if __name__=="__main__":
    main()
