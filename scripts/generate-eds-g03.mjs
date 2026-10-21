import fs from 'node:fs/promises';
import path from 'node:path';
import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { mergeGeometries, mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { EDS_G03_DESIGN as D } from './eds-g03-design.mjs';

const output = path.resolve(process.argv[2] || 'public/models/eds-g03-preview.glb');
const prototypeRegion = process.env.EDS_G03_PROTOTYPE_REGION;

class NodeFileReader {
  result = null;
  onloadend = null;
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then((bytes) => {
      this.result = bytes;
      this.onloadend?.({ target: this });
    });
  }
  readAsDataURL(blob) {
    blob.arrayBuffer().then((bytes) => {
      this.result = `data:${blob.type};base64,${Buffer.from(bytes).toString('base64')}`;
      this.onloadend?.({ target: this });
    });
  }
}
globalThis.FileReader ??= NodeFileReader;

const scene = new THREE.Scene();
scene.name = 'EDS-G03_R3_2_Revision_6_Halo_T_Diffuser';
scene.userData = {
  asset: D.id,
  revision: D.revision,
  author: 'Podium Effet De Sol / AI-assisted original parametric workflow',
  source: 'scripts/generate-eds-g03.mjs; scripts/eds-g03-design.mjs; original EDS parametric geometry',
  units: D.units,
  coordinateSystem: '+Y up; -Z front; +Z rear; X=0 centerline',
  reviewStatus: 'OWNER GATE 2 REVISE; primary surface continuity only; not production approved',
  provenance: 'No C42 mesh, vertices, UVs, textures, deformation or retopology used',
};

const createMaterial = (name, color, roughness, metalness = 0) => {
  const value = new THREE.MeshStandardMaterial({ color, roughness, metalness });
  value.name = `EDS_G03_${name}`;
  return value;
};
const materials = {
  body: createMaterial('INSPECTION_BODY', '#7b8288', 0.68),
  aero: createMaterial('INSPECTION_AERO', '#596168', 0.74),
  tire: createMaterial('INSPECTION_TIRE', '#17191b', 0.92),
  mechanical: createMaterial('INSPECTION_MECHANICAL', '#4d545a', 0.66, 0.08),
  cockpit: createMaterial('INSPECTION_COCKPIT', '#20252a', 0.88),
};
const parts = new Map(Object.keys(materials).map((key) => [key, []]));

function addPart(category, geometry) {
  geometry.deleteAttribute('uv');
  if (!geometry.getAttribute('normal')) geometry.computeVertexNormals();
  if (geometry.getAttribute('position').count !== geometry.getAttribute('normal').count)
    throw new Error(`${category} source position/normal count mismatch`);
  if (!geometry.index) geometry = mergeVertices(geometry);
  parts.get(category).push(geometry);
}

function grid(uCount, vCount, point, reverse = false, wrapU = false) {
  const positions = [];
  const indices = [];
  const rows = wrapU ? uCount : uCount + 1;
  for (let u = 0; u < rows; u += 1) {
    for (let v = 0; v <= vCount; v += 1) positions.push(...point(u / uCount, v / vCount));
  }
  const at = (u, v) => (u % rows) * (vCount + 1) + v;
  for (let u = 0; u < uCount; u += 1) {
    for (let v = 0; v < vCount; v += 1) {
      const a = at(u, v);
      const b = at(u + 1, v);
      const c = at(u, v + 1);
      const d = at(u + 1, v + 1);
      indices.push(...(reverse ? [a, c, b, c, d, b] : [a, b, c, b, d, c]));
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function interpolate(stations, z, field) {
  let index = 0;
  while (index < stations.length - 2 && z > stations[index + 1].z) index += 1;
  const a = stations[index];
  const b = stations[index + 1];
  const t = THREE.MathUtils.smoothstep(z, a.z, b.z);
  return THREE.MathUtils.lerp(a[field], b[field], t);
}

function loft(stations, radial, axial, shape = null) {
  const firstZ = stations[0].z;
  const lastZ = stations.at(-1).z;
  return grid(
    radial,
    axial,
    (u, v) => {
      const z = THREE.MathUtils.lerp(firstZ, lastZ, v);
      const angle = u * Math.PI * 2;
      const section = {
        z,
        x: interpolate(stations, z, 'x'),
        y: interpolate(stations, z, 'y'),
        rx: interpolate(stations, z, 'rx'),
        ry: interpolate(stations, z, 'ry'),
        c: Math.cos(angle),
        s: Math.sin(angle),
      };
      return shape
        ? shape(section)
        : [section.x + section.c * section.rx, section.y + section.s * section.ry, z];
    },
    false,
    true,
  );
}

function ellipsoid(center, radii, width = 24, height = 14) {
  const geometry = new THREE.SphereGeometry(1, width, height);
  geometry.scale(...radii);
  geometry.translate(...center);
  return geometry;
}

function rod(a, b, radius, radial = 8) {
  const start = new THREE.Vector3(...a);
  const end = new THREE.Vector3(...b);
  const direction = end.clone().sub(start);
  const geometry = new THREE.CylinderGeometry(radius, radius, direction.length(), radial, 1);
  geometry.applyMatrix4(
    new THREE.Matrix4().compose(
      start.clone().add(end).multiplyScalar(0.5),
      new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize()),
      new THREE.Vector3(1, 1, 1),
    ),
  );
  return geometry;
}

function tireGeometry(x, z, radius, width) {
  const profile = [
    [-0.5, 0.72],
    [-0.48, 0.84],
    [-0.42, 0.93],
    [-0.3, 0.985],
    [0, 1],
    [0.3, 0.985],
    [0.42, 0.93],
    [0.48, 0.84],
    [0.5, 0.72],
  ];
  const positions = [];
  const indices = [];
  const radial = 64;
  for (const [offset, scale] of profile) {
    for (let index = 0; index < radial; index += 1) {
      const angle = (index / radial) * Math.PI * 2;
      positions.push(
        x + offset * width,
        radius + Math.cos(angle) * radius * scale,
        z + Math.sin(angle) * radius * scale,
      );
    }
  }
  for (let row = 0; row < profile.length - 1; row += 1) {
    for (let index = 0; index < radial; index += 1) {
      const next = (index + 1) % radial;
      const a = row * radial + index;
      const b = row * radial + next;
      const c = (row + 1) * radial + index;
      const d = (row + 1) * radial + next;
      indices.push(a, b, c, b, d, c);
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function axialCylinder(radius, depth, x, y, z, segments = 32) {
  const geometry = new THREE.CylinderGeometry(radius, radius, depth, segments);
  geometry.rotateZ(Math.PI / 2);
  geometry.translate(x, y, z);
  return geometry;
}

function rimRing(radius, tube, x, y, z) {
  const geometry = new THREE.TorusGeometry(radius, tube, 10, 48);
  geometry.rotateY(Math.PI / 2);
  geometry.translate(x, y, z);
  return geometry;
}

function airfoilVolume({
  span,
  z,
  chord,
  y,
  sweep = 0,
  dihedral = 0,
  thickness = 0.04,
  camber = 0.012,
  arch = 0,
}) {
  const surface = (u, v, upper) => {
    const x = (u - 0.5) * span;
    const spanPosition = Math.abs(2 * u - 1);
    const edge = Math.min(0.9999, Math.max(0.0001, v));
    const thicknessProfile =
      5 *
      (0.2969 * Math.sqrt(edge) -
        0.126 * edge -
        0.3516 * edge ** 2 +
        0.2843 * edge ** 3 -
        0.1036 * edge ** 4);
    const camberLine = camber * Math.sin(Math.PI * v);
    const crown = arch * (1 - spanPosition ** 1.7);
    return [
      x,
      y +
        dihedral * spanPosition +
        crown +
        camberLine +
        (upper ? 1 : -1) * thickness * thicknessProfile,
      z + chord * v + sweep * spanPosition,
    ];
  };
  const geometries = [
    grid(
      D.surfaceAuthoring.wingSpanSegments,
      D.surfaceAuthoring.wingChordSegments,
      (u, v) => surface(u, v, true),
      true,
    ),
    grid(D.surfaceAuthoring.wingSpanSegments, D.surfaceAuthoring.wingChordSegments, (u, v) =>
      surface(u, v, false),
    ),
  ];
  for (const v of [0, 1])
    geometries.push(
      grid(D.surfaceAuthoring.wingSpanSegments, 1, (u, w) => surface(u, v, w === 1), v === 1),
    );
  for (const u of [0, 1])
    geometries.push(
      grid(1, D.surfaceAuthoring.wingChordSegments, (w, v) => surface(u, v, w === 1), u === 0),
    );
  return geometries;
}

function plateAtX(x, outline) {
  const shape = new THREE.Shape();
  shape.moveTo(outline[0][0], outline[0][1]);
  outline.slice(1).forEach(([z, y]) => shape.lineTo(z, y));
  shape.closePath();
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 0.018,
    bevelEnabled: false,
    steps: 1,
  });
  geometry.rotateY(-Math.PI / 2);
  geometry.translate(x + 0.009, 0, 0);
  return geometry;
}

// The floor edge is part of the same body cross-section as the sidepod and underbody. These
// approved planform stations constrain the surface rather than producing separate floor plates.
const floorWidthStations = [
  [-1.08, 0.3],
  [-0.58, 0.52],
  [-0.12, 0.66],
  [0.72, 0.68],
  [1.48, 0.62],
  [2.3, 0.58],
];
function floorHalfWidth(z) {
  let index = 0;
  while (index < floorWidthStations.length - 2 && z > floorWidthStations[index + 1][0]) {
    index += 1;
  }
  const [z0, width0] = floorWidthStations[index];
  const [z1, width1] = floorWidthStations[index + 1];
  return THREE.MathUtils.lerp(width0, width1, THREE.MathUtils.smootherstep(z, z0, z1));
}

// Cut each intake from the existing body grid. The lip, tapered duct and back wall
// share its boundary vertices: the dark cavity is geometric, not a painted patch.
function cutSidepodDucts(geometry) {
  const radial = D.surfaceAuthoring.bodyRadialSegments;
  const axial = D.surfaceAuthoring.bodyAxialSegments;
  const rowLength = axial + 1;
  const at = (u, v) => ((u + radial) % radial) * rowLength + v;
  const front = 72;
  const rear = 81;
  const centers = [0, radial / 2];
  // Rectangles are holes in the original survival-cell grid, not overlays. The three
  // attachment sleeves below reuse these exact boundary vertices and become BODY faces.
  const haloHoles = [
    { name: 'front', u0: 15, u1: 21, v0: 60, v1: 68 },
    { name: 'left', u0: 22, u1: 29, v0: 86, v1: 96 },
    { name: 'right', u0: 7, u1: 14, v0: 86, v1: 96 },
  ];
  const original = Array.from(geometry.getAttribute('position').array);
  const positions = [...original];
  const sample = (u, v) => {
    const u0 = Math.floor(u);
    const v0 = Math.floor(v);
    const fu = u - u0;
    const fv = v - v0;
    const point = (row, column, axis) => original[at(row, column) * 3 + axis];
    return [0, 1, 2].map((axis) =>
      THREE.MathUtils.lerp(
        THREE.MathUtils.lerp(point(u0, v0, axis), point(u0 + 1, v0, axis), fu),
        THREE.MathUtils.lerp(point(u0, v0 + 1, axis), point(u0 + 1, v0 + 1, axis), fu),
        fv,
      ),
    );
  };
  // A rounded superellipse deforms the aperture boundary and its neighbouring body grid.
  // The surrounding shell shares these vertices, so the opening cannot float over the body.
  for (const center of centers) {
    for (let u = center - 8; u <= center + 8; u += 1) {
      for (let v = front - 4; v <= rear + 4; v += 1) {
        const p = (u - center) / 5;
        const q = (v - (front + rear) / 2) / ((rear - front) / 2);
        const squareRadius = Math.max(Math.abs(p), Math.abs(q));
        if (squareRadius < 1 || squareRadius > 1.65) continue;
        const roundRadius = (Math.abs(p) ** 2.5 + Math.abs(q) ** 2.5) ** (-1 / 2.5);
        const weight = 1 - THREE.MathUtils.smoothstep(squareRadius, 1, 1.65);
        const scale = 1 + (roundRadius - 1) * weight;
        const moved = sample(center + p * 5 * scale, (front + rear) / 2 + q * 4.5 * scale);
        const id = at(u, v) * 3;
        positions.splice(id, 3, ...moved);
      }
    }
  }
  geometry.getAttribute('position').array.set(positions);
  geometry.getAttribute('position').needsUpdate = true;
  const old = geometry.getIndex().array;
  const indices = [];
  const ductIndices = [];
  let cursor = 0;
  for (let u = 0; u < radial; u += 1) {
    for (let v = 0; v < axial; v += 1) {
      const opening =
        v >= front &&
        v < rear &&
        centers.some((center) => {
          const relative = ((u - center + radial + radial / 2) % radial) - radial / 2;
          return relative >= -5 && relative < 5;
        });
      const haloHole = haloHoles.some(
        (hole) => u >= hole.u0 && u < hole.u1 && v >= hole.v0 && v < hole.v1,
      );
      if (!opening && !haloHole) indices.push(...old.slice(cursor, cursor + 6));
      cursor += 6;
    }
  }

  const coordinate = (id) => positions.slice(id * 3, id * 3 + 3);
  const append = (point) => {
    const id = positions.length / 3;
    positions.push(...point);
    return id;
  };
  for (const center of centers) {
    const outer = [];
    for (let u = center - 5; u < center + 5; u += 1) outer.push(at(u, front));
    for (let v = front; v < rear; v += 1) outer.push(at(center + 5, v));
    for (let u = center + 5; u > center - 5; u -= 1) outer.push(at(u, rear));
    for (let v = rear; v > front; v -= 1) outer.push(at(center - 5, v));
    const side = center === 0 ? 1 : -1;
    const meanAbsX = outer.reduce((sum, id) => sum + Math.abs(coordinate(id)[0]), 0) / outer.length;
    const meanY = outer.reduce((sum, id) => sum + coordinate(id)[1], 0) / outer.length;
    const meanZ = outer.reduce((sum, id) => sum + coordinate(id)[2], 0) / outer.length;
    // Keep a mechanically deliberate inlet seam: the wall starts at the exact
    // cut boundary but carries its own normals through the rolled lip.
    const rings = [outer.map((id) => append(coordinate(id)))];
    for (const [depth, shrink, rearward] of [
      [0.016, 0.975, 0.012],
      [0.05, 0.9, 0.045],
      [0.125, 0.72, 0.115],
      [0.185, 0.52, 0.2],
    ]) {
      rings.push(
        outer.map((id) => {
          const [x, y, z] = coordinate(id);
          const ductX = side * (meanAbsX - depth) + (x - side * meanAbsX) * (1 - depth / 0.185);
          return append([
            ductX,
            meanY + (y - meanY) * shrink,
            meanZ + (z - meanZ) * shrink + rearward,
          ]);
        }),
      );
    }
    for (let layer = 0; layer < rings.length - 1; layer += 1) {
      const outside = rings[layer];
      const inside = rings[layer + 1];
      const target = layer === 0 ? indices : ductIndices;
      for (let index = 0; index < outer.length; index += 1) {
        const next = (index + 1) % outer.length;
        target.push(outside[index], outside[next], inside[index]);
        target.push(outside[next], inside[next], inside[index]);
      }
    }
    const deepest = rings.at(-1);
    const capCenter = append([
      deepest.reduce((sum, id) => sum + coordinate(id)[0], 0) / deepest.length,
      meanY,
      meanZ + 0.2,
    ]);
    for (let index = 0; index < outer.length; index += 1)
      ductIndices.push(deepest[index], deepest[(index + 1) % outer.length], capCenter);
  }
  // Join three local shell apertures to tubes in the same indexed mesh. Each sleeve
  // contracts an oblong grid boundary into a small oblique tube section. Its inner
  // ring is part of the swept halo, so there is no independent shell/tube overlap.
  const tubePaths = [
    {
      points: [
        [-0.26, 0.66, 0.12],
        [-0.3, 0.82, -0.12],
        [-0.22, 0.9, -0.38],
        [0, 0.94, -0.5],
        [0.22, 0.9, -0.38],
        [0.3, 0.82, -0.12],
        [0.26, 0.66, 0.12],
      ],
      ends: [
        { hole: 'left', t: 0.075, mount: [-0.26, 0.66, 0.12] },
        { hole: 'right', t: 0.925, mount: [0.26, 0.66, 0.12] },
      ],
      segments: 96,
      radius: (t) =>
        0.022 +
        0.018 *
          (1 - THREE.MathUtils.smootherstep(t, 0, 0.16) + THREE.MathUtils.smootherstep(t, 0.84, 1)),
    },
    {
      points: [
        [0, 0.65, -0.65],
        [0, 0.74, -0.625],
        [0, 0.87, -0.55],
        [0, 0.94, -0.5],
      ],
      ends: [{ hole: 'front', t: 0.19, mount: [0, 0.65, -0.65] }],
      junctionT: 0.78,
      segments: 40,
      radius: (t) => 0.022 + 0.018 * (1 - THREE.MathUtils.smootherstep(t, 0, 0.48)),
    },
  ];
  function boundary(hole) {
    const loop = [];
    for (let u = hole.u0; u < hole.u1; u += 1) loop.push(at(u, hole.v0));
    for (let v = hole.v0; v < hole.v1; v += 1) loop.push(at(hole.u1, v));
    for (let u = hole.u1; u > hole.u0; u -= 1) loop.push(at(u, hole.v1));
    for (let v = hole.v1; v > hole.v0; v -= 1) loop.push(at(hole.u0, v));
    return loop;
  }
  function bridge(outer, inner) {
    for (let i = 0; i < outer.length; i += 1) {
      const next = (i + 1) % outer.length;
      indices.push(outer[i], outer[next], inner[i], outer[next], inner[next], inner[i]);
    }
  }
  let archJunction = null;
  for (const path of tubePaths) {
    const curve = new THREE.CatmullRomCurve3(
      path.points.map((point) => new THREE.Vector3(...point)),
      false,
      'centripetal',
    );
    const tubeRings = [];
    const slices = path.segments;
    const firstT = path.ends[0].t;
    const lastT = path.junctionT ?? (path.ends.length === 2 ? path.ends[1].t : 1);
    const ringCount = boundary(haloHoles.find((hole) => hole.name === path.ends[0].hole)).length;
    const frames = curve.computeFrenetFrames(slices, false);
    for (let v = 0; v <= slices; v += 1) {
      const t = THREE.MathUtils.lerp(firstT, lastT, v / slices);
      const frame = Math.min(slices, Math.round(t * slices));
      const center = curve.getPointAt(t);
      const ring = [];
      for (let u = 0; u < ringCount; u += 1) {
        const angle = (u / ringCount) * Math.PI * 2;
        const point = center
          .clone()
          .addScaledVector(frames.normals[frame], path.radius(t) * Math.cos(angle))
          .addScaledVector(frames.binormals[frame], path.radius(t) * Math.sin(angle));
        ring.push(append(point.toArray()));
      }
      tubeRings.push(ring);
    }
    for (let v = 0; v < slices; v += 1) {
      const a = tubeRings[v];
      const b = tubeRings[v + 1];
      for (let u = 0; u < ringCount; u += 1) {
        // Remove a real aperture from the underside of the rear arch. The front
        // support terminates in this aperture rather than intersecting the arch.
        if (path === tubePaths[0] && u >= 20 && u < 28 && v >= 45 && v < 51) continue;
        const next = (u + 1) % ringCount;
        indices.push(a[u], a[next], b[u], a[next], b[next], b[u]);
      }
    }
    if (path === tubePaths[0]) {
      const aperture = [];
      for (let u = 20; u < 28; u += 1) aperture.push(tubeRings[45][u]);
      for (let v = 45; v < 51; v += 1) aperture.push(tubeRings[v][28]);
      for (let u = 28; u > 20; u -= 1) aperture.push(tubeRings[51][u]);
      for (let v = 51; v > 45; v -= 1) aperture.push(tubeRings[v][20]);
      archJunction = aperture;
    } else {
      const terminal = tubeRings.at(-1);
      if (archJunction.length !== terminal.length) throw new Error('Halo T-junction ring mismatch');
      let best = null;
      for (const direction of [1, -1])
        for (let shift = 0; shift < terminal.length; shift += 1) {
          const mapped = archJunction.map((_, i) =>
            terminal[(shift + direction * i + terminal.length * 2) % terminal.length],
          );
          const score = mapped.reduce((sum, id, i) => {
            const p = coordinate(archJunction[i]);
            const q = coordinate(id);
            return sum + (p[0] - q[0]) ** 2 + (p[1] - q[1]) ** 2 + (p[2] - q[2]) ** 2;
          }, 0);
          if (!best || score < best.score) best = { mapped, score, direction, shift };
        }
      console.log(`Halo upper T loop: direction ${best.direction}, shift ${best.shift}, squared fit ${best.score.toFixed(4)}`);
      let previous = archJunction;
      for (const blend of [0.22, 0.48, 0.74]) {
        const next = archJunction.map((id, i) => {
          const from = coordinate(id);
          const to = coordinate(best.mapped[i]);
          return append(from.map((value, axis) => THREE.MathUtils.lerp(value, to[axis], axis === 1 ? THREE.MathUtils.smoothstep(blend, 0, 1) : blend)));
        });
        bridge(previous, next);
        previous = next;
      }
      bridge(previous, best.mapped);
    }
    for (const [endIndex, end] of path.ends.entries()) {
      const hole = haloHoles.find((item) => item.name === end.hole);
      const outer = boundary(hole);
      const tubeRing = endIndex === 0 ? tubeRings[0] : tubeRings.at(-1);
      const target = tubeRing.map(coordinate);
      // Match the original grid perimeter to the swept-tube ring with the
      // least torsion. Both orders are checked because the two feet face opposite ways.
      let best = null;
      for (const direction of [1, -1])
        for (let shift = 0; shift < outer.length; shift += 1) {
          const mapped = outer.map(
            (_, i) => tubeRing[(shift + direction * i + outer.length * 2) % outer.length],
          );
          const score = mapped.reduce((sum, id, i) => {
            const p = coordinate(outer[i]);
            const q = coordinate(id);
            return sum + (p[0] - q[0]) ** 2 + (p[2] - q[2]) ** 2;
          }, 0);
          if (!best || score < best.score) best = { mapped, score, direction, shift };
        }
      console.log(
        `Halo ${end.hole} loop: direction ${best.direction}, shift ${best.shift}, squared fit ${best.score.toFixed(4)}`,
      );
      let previous = outer;
      for (const blend of [0.18, 0.42, 0.68, 0.88]) {
        const next = outer.map((id, i) => {
          const from = coordinate(id);
          const to = coordinate(best.mapped[i]);
          return append(
            from.map((value, axis) =>
              THREE.MathUtils.lerp(
                value,
                to[axis],
                axis === 1 ? THREE.MathUtils.smoothstep(blend, 0, 1) : blend,
              ),
            ),
          );
        });
        bridge(previous, next);
        previous = next;
      }
      bridge(previous, best.mapped);
      if (target.length !== outer.length) throw new Error(`Halo ${end.hole} ring mismatch`);
    }
  }
  // The dark inner duct has real walls and a back wall. Its first ring is
  // coincident with the light lip, creating an intentional material boundary.
  const compact = (meshIndices) => {
    const mapping = new Map();
    const compactPositions = [];
    const compactIndices = meshIndices.map((id) => {
      if (!mapping.has(id)) {
        mapping.set(id, compactPositions.length / 3);
        compactPositions.push(...positions.slice(id * 3, id * 3 + 3));
      }
      return mapping.get(id);
    });
    const result = new THREE.BufferGeometry();
    result.setAttribute('position', new THREE.Float32BufferAttribute(compactPositions, 3));
    result.setIndex(compactIndices);
    result.computeVertexNormals();
    return result;
  };
  addPart('cockpit', compact(ductIndices));
  return compact(indices);
}

// One closed lateral cross-section now carries the nose, survival cell, sidepod shoulder,
// undercut, floor edge, Venturi throat and diffuser exit. No sidepod or floor cover mesh is glued
// over the shell. Z windows have zero slope at their ends to preserve the approved nose outline.
const centerBody = [
  { z: -2.48, x: 0, y: 0.3, rx: 0.035, ry: 0.035 },
  { z: -2.15, x: 0, y: 0.34, rx: 0.09, ry: 0.07 },
  { z: -1.75, x: 0, y: 0.39, rx: 0.16, ry: 0.11 },
  { z: -1.1, x: 0, y: 0.46, rx: 0.24, ry: 0.17 },
  { z: -0.58, x: 0, y: 0.5, rx: 0.31, ry: 0.2 },
  { z: 0.05, x: 0, y: 0.5, rx: 0.33, ry: 0.2 },
  { z: 0.55, x: 0, y: 0.54, rx: 0.25, ry: 0.24 },
  { z: 1.05, x: 0, y: 0.49, rx: 0.18, ry: 0.18 },
  { z: 1.57, x: 0, y: 0.42, rx: 0.12, ry: 0.14 },
  { z: 1.93, x: 0, y: 0.38, rx: 0.055, ry: 0.07 },
  { z: 2.3, x: 0, y: 0.34, rx: 0.025, ry: 0.035 },
];
addPart(
  'body',
  cutSidepodDucts(
    loft(
      centerBody,
      D.surfaceAuthoring.bodyRadialSegments,
      D.surfaceAuthoring.bodyAxialSegments,
      ({ x, y, rx, ry, c, s, z }) => {
        const cockpit = Math.exp(-Math.pow((z + 0.18) / 0.54, 4));
        const valley = 0.13 * cockpit * Math.max(0, s) ** 4;
        const noseFactor = 1 - THREE.MathUtils.smoothstep(z, -2.42, -0.95);
        const lowerKeel = s < 0 ? 0.024 * noseFactor * Math.exp(-Math.pow(c / 0.28, 2)) * -s : 0;
        const twinRelief =
          s < 0 ? 0.01 * noseFactor * Math.exp(-Math.pow((Math.abs(c) - 0.52) / 0.18, 2)) * -s : 0;
        const side = Math.sign(c);
        const lateral = side * Math.pow(Math.abs(c), 0.84) * rx;
        const vertical = Math.sign(s) * Math.pow(Math.abs(s), 1.08) * ry;
        const shoulder = 0.012 * Math.max(0, s) * Math.sin(Math.PI * Math.abs(c));
        const sidepodActive =
          THREE.MathUtils.smootherstep(z, -0.55, -0.15) *
          (1 - THREE.MathUtils.smootherstep(z, 0.48, 1.22));
        const sidepodCrown = Math.exp(-Math.pow((s - 0.08) / 0.58, 4));
        const undercut = Math.exp(-Math.pow((s + 0.55) / 0.2, 2));
        let bodyX = x + lateral + side * sidepodActive * (0.33 * sidepodCrown - 0.04 * undercut);
        let bodyY =
          y +
          vertical +
          shoulder -
          valley -
          lowerKeel +
          twinRelief +
          sidepodActive * (0.033 * Math.max(0, s) * sidepodCrown + 0.028 * undercut);

        // The floor lip and Venturi underside are sculpted into the same ring. This removes the
        // broad exposed upper/lower floor sheets and their unsupported side-edge junctions.
        const floorActive = THREE.MathUtils.smootherstep(z, D.landmarks.floor.startZ, -0.38);
        const lipWeight = Math.pow(Math.abs(c), 0.5) * THREE.MathUtils.smoothstep(-s, 0.2, 0.65);
        bodyX += side * Math.max(0, floorHalfWidth(z) - Math.abs(bodyX)) * floorActive * lipWeight;
        const underbodyWeight = floorActive * THREE.MathUtils.smootherstep(-s, 0.35, 0.8);
        const lipFraction = THREE.MathUtils.smoothstep(s, -1, -0.58);
        const rearExpansion = THREE.MathUtils.smootherstep(z, 1.0, 2.25);
        const channel =
          0.028 *
            Math.exp(-Math.pow((Math.abs(bodyX) - 0.35) / 0.15, 2)) *
            Math.exp(-Math.pow((z - 0.25) / 0.7, 2)) +
          0.09 * Math.exp(-Math.pow((Math.abs(bodyX) - 0.32) / 0.19, 2)) * rearExpansion;
        const centerSpine = -0.018 * Math.exp(-Math.pow(bodyX / 0.2, 2)) * rearExpansion;
        const outerRidge =
          0.012 * Math.exp(-Math.pow((Math.abs(bodyX) - 0.55) / 0.08, 2)) * rearExpansion;
        const diffuserRise = 0.19 * THREE.MathUtils.smootherstep(z, 0.95, 2.3);
        const underbodyY =
          0.075 + 0.085 * lipFraction + diffuserRise - channel + centerSpine + outerRidge;
        bodyY = THREE.MathUtils.lerp(bodyY, underbodyY, underbodyWeight);
        const exitBlend = THREE.MathUtils.smootherstep(z, 1.98, 2.3);
        // An authored terminal section removes the old downward turn while
        // retaining a softer twin-channel depression and the accepted throat.
        const channelPair = Math.exp(-Math.pow((Math.abs(bodyX) - 0.3) / 0.16, 2));
        bodyY += exitBlend * underbodyWeight * (0.047 - 0.013 * channelPair);
        // Two deliberately recessed terminal channels remain within the accepted
        // floor envelope. Their depth builds only after the rear-floor transition.
        const channelExit = THREE.MathUtils.smootherstep(z, 1.55, 2.25);
        const broadExitPair = Math.exp(-Math.pow((Math.abs(bodyX) - 0.3) / 0.22, 2));
        bodyY -= 0.04 * broadExitPair * channelExit * underbodyWeight;
        bodyY += 0.018 * exitBlend * s;
        const exitWidthBlend =
          THREE.MathUtils.smootherstep(z, 1.9, 2.3) * THREE.MathUtils.smootherstep(-s, 0.38, 0.78);
        if (exitWidthBlend > 0 && Math.abs(bodyX) > 0.39) {
          bodyX +=
            side *
            Math.max(0, D.landmarks.diffuser.exit.width / 2 - Math.abs(bodyX)) *
            exitWidthBlend;
        }
        const roundedExitZ = z - 0.022 * exitBlend * (1 - THREE.MathUtils.smoothstep(-s, 0, 0.65));

        // The airbox spine and halo-foot fairings deform this shell instead of sitting on pads.
        const topWeight = Math.max(0, s) ** 5;
        bodyY +=
          topWeight *
          Math.exp(-Math.pow(bodyX / 0.17, 2)) *
          (0.12 * Math.exp(-Math.pow((z - 0.48) / 0.42, 2)) +
            0.055 * Math.exp(-Math.pow((z - 0.98) / 0.5, 2)));
        for (const [mountX, mountY, mountZ, spreadX, spreadZ] of [
          [0, 0.65, -0.65, 0.18, 0.32],
          [-0.26, 0.66, 0.12, 0.18, 0.34],
          [0.26, 0.66, 0.12, 0.18, 0.34],
        ]) {
          const radius = Math.hypot((bodyX - mountX) / spreadX, (z - mountZ) / spreadZ);
          const fairing = (1 - THREE.MathUtils.smootherstep(radius, 0, 1)) * Math.max(0, s);
          bodyY += fairing * Math.max(0, mountY + 0.045 - bodyY);
        }
        return [bodyX, bodyY, roundedExitZ];
      },
    ),
  ),
);

// The cockpit inspection recess is retained while all exterior airbox/engine-cover mass comes
// from the continuous body shell above.
addPart('cockpit', ellipsoid([0, 0.58, -0.14], [0.235, 0.085, 0.42], 30, 12));

// Curved NACA-derived wing volumes replace the R3.1 sinusoidal plates while retaining every
// approved span and longitudinal envelope.
for (let index = 0; index < 3; index += 1) {
  const geometries = airfoilVolume({
    span: 2 - index * 0.09,
    z: -2.6 + index * 0.115,
    chord: 0.22,
    y: 0.11 + index * 0.055,
    sweep: 0.11 + index * 0.015,
    dihedral: 0.045 + index * 0.012,
    thickness: 0.03 - index * 0.003,
    camber: 0.012 + index * 0.002,
    arch: 0.008 + index * 0.003,
  });
  geometries.forEach((geometry) => addPart('aero', geometry));
}
const frontPlate = [
  [-2.6, 0.08],
  [-2.55, 0.33],
  [-2.43, 0.34],
  [-2.25, 0.25],
  [-2.2, 0.1],
];
for (const side of [-1, 1]) addPart('aero', plateAtX(side * 0.991, frontPlate));

airfoilVolume({
  span: D.landmarks.rearWing.span,
  z: 2.1,
  chord: 0.31,
  y: 0.91,
  sweep: 0.04,
  thickness: 0.046,
  camber: 0.017,
  arch: 0.01,
}).forEach((geometry) => addPart('aero', geometry));
airfoilVolume({
  span: 1.3,
  z: 2.17,
  chord: 0.235,
  y: 1.08,
  sweep: 0.045,
  thickness: 0.038,
  camber: 0.013,
  arch: 0.008,
}).forEach((geometry) => addPart('aero', geometry));
const rearPlate = [
  [2.06, 0.84],
  [2.1, 1.12],
  [2.18, 1.18],
  [2.36, 1.08],
  [2.34, 0.88],
  [2.24, 0.82],
];
for (const side of [-1, 1]) {
  addPart('aero', plateAtX(side * 0.671, rearPlate));
  addPart('mechanical', rod([side * 0.48, 0.86, 2.08], [side * 0.24, 0.47, 1.63], 0.024));
}

// Wheels and suspension lock stance before any secondary engineering detail is attempted.
for (const side of [-1, 1]) {
  for (const axle of ['front', 'rear']) {
    const rear = axle === 'rear';
    const z = rear ? D.axles.rearZ : D.axles.frontZ;
    const track = rear ? D.axles.rearTrack : D.axles.frontTrack;
    const radius = rear ? D.wheels.rear.radius : D.wheels.front.radius;
    const width = rear ? D.wheels.rear.width : D.wheels.front.width;
    const x = (side * track) / 2;
    addPart('tire', tireGeometry(x, z, radius, width));
    addPart('mechanical', axialCylinder(radius * 0.5, width * 0.82, x, radius, z));
    addPart('cockpit', axialCylinder(radius * 0.28, width * 0.86, x, radius, z));
    addPart('mechanical', rimRing(radius * 0.38, 0.012, x + side * width * 0.38, radius, z));
    const innerX = side * (rear ? 0.31 : 0.28);
    for (const upper of [false, true]) {
      const innerY = upper ? 0.58 : 0.28;
      const outerY = radius + (upper ? 0.1 : -0.1);
      for (const offset of [-0.2, 0.2]) {
        addPart(
          'mechanical',
          rod([innerX, innerY, z + offset], [x - side * 0.1, outerY, z], 0.016),
        );
      }
    }
    addPart('mechanical', rod([side * 0.33, 0.68, z - 0.1], [x - side * 0.1, radius, z], 0.012));
  }
}

// Halo root sections and their original centreline controls are now part of BODY.

for (const [category, geometries] of parts) {
  if (!geometries.length) continue;
  if (prototypeRegion && category !== 'body') continue;
  const merged = mergeGeometries(geometries, false);
  if (!merged) throw new Error(`Unable to merge ${category} geometry`);
  if (prototypeRegion) {
    const source = merged.getAttribute('position');
    const sourceIndices = merged.getIndex().array;
    const kept = [];
    for (let i = 0; i < sourceIndices.length; i += 3) {
      const ids = [sourceIndices[i], sourceIndices[i + 1], sourceIndices[i + 2]];
      const x = ids.reduce((sum, id) => sum + source.getX(id), 0) / 3;
      const y = ids.reduce((sum, id) => sum + source.getY(id), 0) / 3;
      const z = ids.reduce((sum, id) => sum + source.getZ(id), 0) / 3;
      const inside = prototypeRegion === 'halo'
        ? Math.abs(x) < 0.18 && y > 0.79 && z > -0.7 && z < -0.3
        : prototypeRegion === 'diffuser'
          ? Math.abs(x) < 0.72 && y < 0.54 && z > 1.5
          : false;
      if (inside) kept.push(...ids);
    }
    if (!kept.length) throw new Error(`No triangles in ${prototypeRegion} prototype`);
    merged.setIndex(kept);
  }
  if (merged.getAttribute('position').count !== merged.getAttribute('normal').count)
    throw new Error(`${category} position/normal count mismatch before export`);
  merged.computeBoundingBox();
  merged.computeBoundingSphere();
  const mesh = new THREE.Mesh(merged, materials[category]);
  mesh.name = `EDS_G03_${category.toUpperCase()}`;
  mesh.userData = { assembly: category, gate: 'R3.2 Revision 6', originalGeometry: true };
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  scene.add(mesh);
}

const binary = await new Promise((resolve, reject) =>
  new GLTFExporter().parse(scene, resolve, reject, { binary: true, onlyVisible: true }),
);
await fs.mkdir(path.dirname(output), { recursive: true });
await fs.writeFile(output, Buffer.from(binary));
console.log(
  `Generated ${path.relative(process.cwd(), output)}: ${Buffer.byteLength(binary)} bytes, ${scene.children.length} neutral material groups`,
);
