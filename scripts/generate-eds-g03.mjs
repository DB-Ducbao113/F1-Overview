import fs from 'node:fs/promises';
import path from 'node:path';
import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { mergeGeometries, mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { EDS_G03_DESIGN as D } from './eds-g03-design.mjs';

const output = path.resolve(process.argv[2] || 'public/models/eds-g03-preview.glb');

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
scene.name = 'EDS-G03_R3_1_Original_Blockout';
scene.userData = {
  asset: D.id,
  revision: D.revision,
  author: 'Podium Effet De Sol / AI-assisted original parametric workflow',
  source: 'scripts/generate-eds-g03.mjs; scripts/eds-g03-design.mjs',
  units: D.units,
  coordinateSystem: '+Y up; -Z front; +Z rear; X=0 centerline',
  reviewStatus: 'OWNER GATE 1; proportion blockout only; not production approved',
  provenance: 'No C42 mesh, vertices, UVs, textures, deformation or retopology used',
};

const createMaterial = (name, color, roughness, metalness = 0) => {
  const value = new THREE.MeshStandardMaterial({ color, roughness, metalness });
  value.name = `EDS_G03_${name}`;
  return value;
};
const materials = {
  body: createMaterial('BLOCKOUT_BODY', '#6f767d', 0.74),
  aero: createMaterial('BLOCKOUT_AERO', '#50575e', 0.8),
  tire: createMaterial('BLOCKOUT_TIRE', '#17191b', 0.92),
  mechanical: createMaterial('BLOCKOUT_MECHANICAL', '#4d545a', 0.7, 0.08),
  cockpit: createMaterial('BLOCKOUT_COCKPIT', '#262a2e', 0.9),
};
const parts = new Map(Object.keys(materials).map((key) => [key, []]));

function addPart(category, geometry) {
  geometry.deleteAttribute('uv');
  if (!geometry.getAttribute('normal')) geometry.computeVertexNormals();
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

function curveTube(points, radius, tubular = 48, radial = 8, closed = false) {
  const curve = new THREE.CatmullRomCurve3(
    points.map((point) => new THREE.Vector3(...point)),
    closed,
    'centripetal',
  );
  return new THREE.TubeGeometry(curve, tubular, radius, radial, closed);
}

function tireGeometry(x, z, radius, width) {
  const profile = [
    [-0.5, 0.7],
    [-0.46, 0.88],
    [-0.34, 0.98],
    [0, 1],
    [0.34, 0.98],
    [0.46, 0.88],
    [0.5, 0.7],
  ];
  const positions = [];
  const indices = [];
  const radial = 40;
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

function airfoilVolume({ span, z, chord, y, sweep = 0, dihedral = 0, thickness = 0.015 }) {
  const surface = (u, v, upper) => {
    const x = (u - 0.5) * span;
    const spanPosition = Math.abs(2 * u - 1);
    const profile = Math.sin(Math.PI * v);
    return [
      x,
      y + dihedral * spanPosition + (upper ? 1 : -1) * (0.004 + thickness * profile),
      z + chord * v + sweep * spanPosition,
    ];
  };
  const geometries = [
    grid(30, 8, (u, v) => surface(u, v, true), true),
    grid(30, 8, (u, v) => surface(u, v, false)),
  ];
  for (const v of [0, 1]) geometries.push(grid(30, 1, (u, w) => surface(u, v, w === 1), v === 1));
  for (const u of [0, 1]) geometries.push(grid(1, 8, (w, v) => surface(u, v, w === 1), u === 0));
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

// A continuous low centreline loft establishes nose, survival cell and engine-cover proportion.
const centerBody = [
  { z: -2.48, x: 0, y: 0.3, rx: 0.035, ry: 0.035 },
  { z: -2.15, x: 0, y: 0.34, rx: 0.09, ry: 0.07 },
  { z: -1.75, x: 0, y: 0.39, rx: 0.16, ry: 0.11 },
  { z: -1.1, x: 0, y: 0.47, rx: 0.28, ry: 0.18 },
  { z: -0.58, x: 0, y: 0.52, rx: 0.35, ry: 0.22 },
  { z: 0.05, x: 0, y: 0.52, rx: 0.36, ry: 0.22 },
  { z: 0.55, x: 0, y: 0.58, rx: 0.32, ry: 0.31 },
  { z: 1.05, x: 0, y: 0.55, rx: 0.27, ry: 0.27 },
  { z: 1.57, x: 0, y: 0.43, rx: 0.15, ry: 0.16 },
  { z: 1.93, x: 0, y: 0.38, rx: 0.055, ry: 0.07 },
];
addPart(
  'body',
  loft(centerBody, 36, 92, ({ x, y, rx, ry, c, s, z }) => {
    const cockpit = Math.exp(-Math.pow((z + 0.18) / 0.54, 4));
    const valley = 0.13 * cockpit * Math.max(0, s) ** 4;
    const noseKeel = z < -1.05 ? 0.018 * Math.cos(Math.PI * Math.min(1, (-z - 1.05) / 1.43)) : 0;
    return [x + c * rx, y + s * ry - valley - Math.max(0, s) * noseKeel, z];
  }),
);

// Crescent-entry sidepods use a falling outer shoulder and taper independently from the benchmark.
for (const side of [-1, 1]) {
  const stations = [
    { z: -0.62, x: side * 0.38, y: 0.47, rx: 0.025, ry: 0.03 },
    { z: -0.43, x: side * 0.51, y: 0.47, rx: 0.16, ry: 0.13 },
    { z: -0.08, x: side * 0.52, y: 0.46, rx: 0.24, ry: 0.18 },
    { z: 0.45, x: side * 0.48, y: 0.43, rx: 0.28, ry: 0.17 },
    { z: 0.9, x: side * 0.4, y: 0.41, rx: 0.24, ry: 0.14 },
    { z: 1.18, x: side * 0.27, y: 0.4, rx: 0.08, ry: 0.08 },
  ];
  addPart(
    'body',
    loft(stations, 28, 52, ({ x, y, rx, ry, c, s, z }) => {
      const outer = side * c > 0 ? 1 : 0;
      const shoulderFall = outer * 0.045 * THREE.MathUtils.smoothstep(z, -0.1, 1.18);
      const undercut = s < 0 ? 1 + 0.28 * s : 1;
      return [x + c * rx * undercut, y + s * ry - shoulderFall, z];
    }),
  );
  addPart('cockpit', ellipsoid([side * 0.67, 0.5, -0.43], [0.015, 0.1, 0.13], 18, 10));
}

// Cockpit opening, compact airbox and two subtle dorsal ridges are blockout landmarks.
addPart('cockpit', ellipsoid([0, 0.59, -0.14], [0.255, 0.09, 0.43], 30, 12));
addPart('cockpit', ellipsoid([0, 0.95, 0.5], [0.13, 0.1, 0.055], 22, 12));
for (const side of [-1, 1]) {
  addPart(
    'body',
    curveTube(
      [
        [side * 0.09, 0.87, 0.5],
        [side * 0.11, 0.82, 0.82],
        [side * 0.08, 0.67, 1.25],
        [side * 0.04, 0.49, 1.57],
      ],
      0.025,
      42,
      8,
    ),
  );
}

// Continuous floor shell with a shallow throat and a rising twin-channel diffuser.
const floorStart = -1.35;
const floorEnd = 2.3;
const floorWidthStations = [
  [-1.35, 0.34],
  [-0.78, 0.62],
  [-0.18, 0.72],
  [0.78, 0.72],
  [1.55, 0.68],
  [2.3, 0.66],
];
const floorHalfWidth = (z) => {
  let index = 0;
  while (index < floorWidthStations.length - 2 && z > floorWidthStations[index + 1][0]) {
    index += 1;
  }
  const [z0, width0] = floorWidthStations[index];
  const [z1, width1] = floorWidthStations[index + 1];
  return THREE.MathUtils.lerp(width0, width1, THREE.MathUtils.smoothstep(z, z0, z1));
};
const floorY = (x, z) => {
  const throat = 0.035 * Math.exp(-Math.pow((z - 0.25) / 0.75, 2));
  const channel = Math.exp(-Math.pow((Math.abs(x) - 0.38) / 0.2, 2));
  const diffuser = 0.25 * THREE.MathUtils.smoothstep(z, 1.05, 2.3);
  return 0.09 - throat * channel + diffuser;
};
for (const upper of [false, true]) {
  addPart(
    'aero',
    grid(
      24,
      52,
      (u, v) => {
        const z = THREE.MathUtils.lerp(floorStart, floorEnd, v);
        const x = (u * 2 - 1) * floorHalfWidth(z);
        return [x, floorY(x, z) + (upper ? 0.045 : 0), z];
      },
      !upper,
    ),
  );
}
for (const side of [-1, 1]) {
  addPart(
    'aero',
    grid(1, 52, (u, v) => {
      const z = THREE.MathUtils.lerp(floorStart, floorEnd, v);
      const x = side * floorHalfWidth(z);
      return [x, floorY(x, z) + u * 0.045, z];
    }),
  );
}

// Front and rear wing envelopes are volumetric but intentionally free of R3.2 surface detail.
for (let index = 0; index < 3; index += 1) {
  const geometries = airfoilVolume({
    span: 2 - index * 0.09,
    z: -2.6 + index * 0.115,
    chord: 0.22,
    y: 0.11 + index * 0.055,
    sweep: 0.11 + index * 0.015,
    dihedral: 0.045 + index * 0.012,
    thickness: 0.012,
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

airfoilVolume({ span: 1.48, z: 2.08, chord: 0.32, y: 0.92, sweep: 0.05, thickness: 0.02 }).forEach(
  (geometry) => addPart('aero', geometry),
);
airfoilVolume({
  span: 1.42,
  z: 2.16,
  chord: 0.24,
  y: 1.08,
  sweep: 0.045,
  thickness: 0.016,
}).forEach((geometry) => addPart('aero', geometry));
const rearPlate = [
  [1.98, 0.7],
  [2.04, 1.15],
  [2.22, 1.18],
  [2.45, 1.12],
  [2.4, 0.73],
];
for (const side of [-1, 1]) {
  addPart('aero', plateAtX(side * 0.731, rearPlate));
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

// Halo envelope uses three mounts and stays below the locked 1.18 m rear-wing height.
addPart(
  'mechanical',
  curveTube(
    [
      [-0.3, 0.67, 0.15],
      [-0.38, 0.84, -0.12],
      [-0.29, 1.0, -0.45],
      [0, 1.08, -0.56],
      [0.29, 1.0, -0.45],
      [0.38, 0.84, -0.12],
      [0.3, 0.67, 0.15],
    ],
    0.028,
    64,
    10,
  ),
);
addPart('mechanical', rod([0, 0.66, -0.68], [0, 1.08, -0.56], 0.027, 10));

for (const [category, geometries] of parts) {
  if (!geometries.length) continue;
  const merged = mergeGeometries(geometries, false);
  if (!merged) throw new Error(`Unable to merge ${category} geometry`);
  merged.computeBoundingBox();
  merged.computeBoundingSphere();
  const mesh = new THREE.Mesh(merged, materials[category]);
  mesh.name = `EDS_G03_${category.toUpperCase()}`;
  mesh.userData = { assembly: category, gate: 'R3.1', originalGeometry: true };
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
