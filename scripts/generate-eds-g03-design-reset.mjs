import fs from 'node:fs/promises';
import path from 'node:path';
import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { mergeGeometries, mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { EDS_G03_DESIGN as D } from './eds-g03-design.mjs';

const concept = (process.argv[2] ?? 'A').toUpperCase();
if (!['A', 'B'].includes(concept)) throw new Error('Concept must be A or B');
const output = path.resolve(
  process.argv[3] ??
    `docs/commercialization/r3/evidence/r3-design-reset/eds-g03-design-concept-${concept.toLowerCase()}.glb`,
);

class NodeFileReader {
  result = null;
  onloadend = null;
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then((bytes) => {
      this.result = bytes;
      this.onloadend?.({ target: this });
    });
  }
}
globalThis.FileReader ??= NodeFileReader;

const scene = new THREE.Scene();
scene.name = `EDS_G03_DESIGN_RESET_CONCEPT_${concept}`;
scene.userData = {
  asset: 'EDS-G03 original design study',
  concept,
  revision: 'R3 full vehicle design reset / owner design gate',
  author: 'Podium Effet De Sol / AI-assisted original profile authoring',
  source: 'scripts/generate-eds-g03-design-reset.mjs; scripts/eds-g03-design.mjs',
  units: 'metres',
  coordinateSystem: '+Y up; -Z front; +Z rear; X=0 centreline',
  provenance: 'Original EDS geometry; no C42 mesh, vertices, UVs, textures, deformation or retopology',
  reviewStatus: 'DEV REVIEW ONLY; owner design selection pending; not production approved',
};

const materials = {
  body: new THREE.MeshStandardMaterial({ color: concept === 'A' ? '#aeb8c1' : '#a7b1ba', roughness: 0.54, metalness: 0.06 }),
  aero: new THREE.MeshStandardMaterial({ color: '#515b64', roughness: 0.62, metalness: 0.08 }),
  tire: new THREE.MeshStandardMaterial({ color: '#15191d', roughness: 0.9, metalness: 0 }),
  mechanical: new THREE.MeshStandardMaterial({ color: '#434d56', roughness: 0.5, metalness: 0.36 }),
  cockpit: new THREE.MeshStandardMaterial({ color: '#1b2228', roughness: 0.78, metalness: 0.02 }),
};
Object.entries(materials).forEach(([name, material]) => (material.name = `EDS_RESET_${concept}_${name.toUpperCase()}`));
const parts = new Map(Object.keys(materials).map((key) => [key, []]));

function add(category, geometry) {
  geometry.deleteAttribute('uv');
  if (!geometry.index) geometry = mergeVertices(geometry);
  geometry.computeVertexNormals();
  parts.get(category).push(geometry);
}

function grid(uCount, vCount, point, { wrapU = false, reverse = false } = {}) {
  const positions = [];
  const indices = [];
  const rows = wrapU ? uCount : uCount + 1;
  for (let u = 0; u < rows; u += 1) {
    for (let v = 0; v <= vCount; v += 1) positions.push(...point(u / uCount, v / vCount));
  }
  const at = (u, v) => (u % rows) * (vCount + 1) + v;
  for (let u = 0; u < uCount; u += 1) {
    for (let v = 0; v < vCount; v += 1) {
      const [a, b, c, d] = [at(u, v), at(u + 1, v), at(u, v + 1), at(u + 1, v + 1)];
      indices.push(...(reverse ? [a, c, b, b, c, d] : [a, b, c, b, d, c]));
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function interpolate(stations, z, key) {
  let i = 0;
  while (i < stations.length - 2 && z > stations[i + 1].z) i += 1;
  const a = stations[i];
  const b = stations[i + 1];
  const t = THREE.MathUtils.smootherstep(z, a.z, b.z);
  return THREE.MathUtils.lerp(a[key], b[key], t);
}

function closedLoft(stations, radial = 64, axial = 128, shape = null) {
  const first = stations[0].z;
  const last = stations.at(-1).z;
  return grid(
    radial,
    axial,
    (u, v) => {
      const z = THREE.MathUtils.lerp(first, last, v);
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
      if (shape) return shape(section);
      return [section.x + section.rx * section.c, section.y + section.ry * section.s, z];
    },
    { wrapU: true },
  );
}

function mirroredLoft(stations, radial = 44, axial = 80, deform = null) {
  for (const side of [-1, 1]) {
    add(
      'body',
      closedLoft(stations, radial, axial, (s) => {
        const p = deform ? deform(s, side) : [s.x + s.rx * s.c, s.y + s.ry * s.s, s.z];
        return [side * Math.abs(p[0]), p[1], p[2]];
      }),
    );
  }
}

function box(size, position, rotation = [0, 0, 0], bevel = 0) {
  const geometry = bevel
    ? new THREE.CapsuleGeometry(size[1] / 2, Math.max(0.001, size[2] - size[1]), 8, 18)
    : new THREE.BoxGeometry(...size, 8, 2, 8);
  geometry.rotateX(rotation[0]);
  geometry.rotateY(rotation[1]);
  geometry.rotateZ(rotation[2]);
  geometry.translate(...position);
  return geometry;
}

function rod(a, b, radius, radial = 12) {
  const start = new THREE.Vector3(...a);
  const end = new THREE.Vector3(...b);
  const vector = end.clone().sub(start);
  const geometry = new THREE.CylinderGeometry(radius, radius, vector.length(), radial, 2, false);
  const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), vector.clone().normalize());
  geometry.applyQuaternion(quaternion);
  geometry.translate(...start.clone().add(end).multiplyScalar(0.5).toArray());
  return geometry;
}

function wingElement({ span, z, y, chord, thickness, sweep = 0, dihedral = 0, conceptBias = 0 }) {
  return grid(48, 12, (u, v) => {
    const x = THREE.MathUtils.lerp(-span / 2, span / 2, u);
    const t = v;
    const localZ = z + (t - 0.5) * chord + sweep * Math.pow(Math.abs(x) / (span / 2), 1.6);
    const camber = thickness * (0.32 * Math.sin(Math.PI * t) + (t < 0.5 ? 1 : -1) * 0.12);
    const yOffset = dihedral * Math.pow(Math.abs(x) / (span / 2), 1.5);
    return [x, y + camber + yOffset + conceptBias * x * x, localZ];
  });
}

function wheel(x, y, z, radius, width) {
  const section = radius < 0.37 ? 0.075 : 0.085;
  const tire = new THREE.TorusGeometry(radius - section, section, 18, 48);
  tire.rotateY(Math.PI / 2);
  tire.scale(width / (2 * section), 1, 1);
  tire.translate(x, y, z);
  add('tire', tire);
  const rim = new THREE.CylinderGeometry(radius * 0.55, radius * 0.55, width * 0.72, 36, 2);
  rim.rotateZ(Math.PI / 2);
  rim.translate(x, y, z);
  add('mechanical', rim);
  const hub = new THREE.CylinderGeometry(radius * 0.12, radius * 0.12, width * 0.82, 20, 1);
  hub.rotateZ(Math.PI / 2);
  hub.translate(x, y, z);
  add('cockpit', hub);
}

// Central monocoque: a deliberately separate original spline-profile family,
// not a deformation or copy of the Revision 6 BODY or the C42 reference.
const monocoqueA = [
  { z: -2.48, x: 0, y: 0.29, rx: 0.025, ry: 0.026 },
  { z: -2.10, x: 0, y: 0.34, rx: 0.075, ry: 0.065 },
  { z: -1.72, x: 0, y: 0.39, rx: 0.14, ry: 0.11 },
  { z: -1.05, x: 0, y: 0.48, rx: 0.24, ry: 0.18 },
  { z: -0.56, x: 0, y: 0.52, rx: 0.31, ry: 0.21 },
  { z: 0.15, x: 0, y: 0.53, rx: 0.30, ry: 0.22 },
  { z: 0.68, x: 0, y: 0.55, rx: 0.23, ry: 0.25 },
  { z: 1.20, x: 0, y: 0.48, rx: 0.15, ry: 0.19 },
  { z: 1.68, x: 0, y: 0.40, rx: 0.08, ry: 0.11 },
  { z: 2.12, x: 0, y: 0.34, rx: 0.035, ry: 0.045 },
];
const monocoqueB = [
  { z: -2.48, x: 0, y: 0.27, rx: 0.025, ry: 0.022 },
  { z: -2.05, x: 0, y: 0.31, rx: 0.065, ry: 0.052 },
  { z: -1.62, x: 0, y: 0.37, rx: 0.13, ry: 0.10 },
  { z: -0.96, x: 0, y: 0.46, rx: 0.245, ry: 0.17 },
  { z: -0.48, x: 0, y: 0.51, rx: 0.325, ry: 0.20 },
  { z: 0.12, x: 0, y: 0.52, rx: 0.31, ry: 0.21 },
  { z: 0.52, x: 0, y: 0.58, rx: 0.22, ry: 0.26 },
  { z: 1.00, x: 0, y: 0.53, rx: 0.17, ry: 0.21 },
  { z: 1.46, x: 0, y: 0.44, rx: 0.105, ry: 0.14 },
  { z: 2.10, x: 0, y: 0.34, rx: 0.03, ry: 0.045 },
];
add(
  'body',
  closedLoft(concept === 'A' ? monocoqueA : monocoqueB, 72, 180, ({ x, y, rx, ry, c, s, z }) => {
    const lateral = Math.sign(c) * Math.pow(Math.abs(c), concept === 'A' ? 0.86 : 0.72) * rx;
    const vertical = Math.sign(s) * Math.pow(Math.abs(s), concept === 'A' ? 1.14 : 1.32) * ry;
    const cockpit = Math.exp(-Math.pow((z + 0.08) / 0.54, 4));
    const valley = Math.max(0, s) ** 5 * cockpit * (concept === 'A' ? 0.105 : 0.125);
    const keel = Math.max(0, -s) ** 3 * Math.exp(-Math.pow((z + 1.35) / 0.75, 2)) * 0.025;
    return [x + lateral, y + vertical - valley - keel, z];
  }),
);

// Sidepods use their own longitudinal section network and form a continuous
// shoulder/undercut volume from the inlet to the gearbox taper.
const sidepods = concept === 'A'
  ? [
      { z: -0.50, x: 0.43, y: 0.45, rx: 0.08, ry: 0.14 },
      { z: -0.30, x: 0.47, y: 0.45, rx: 0.18, ry: 0.19 },
      { z: 0.10, x: 0.48, y: 0.43, rx: 0.21, ry: 0.18 },
      { z: 0.58, x: 0.43, y: 0.42, rx: 0.20, ry: 0.16 },
      { z: 1.02, x: 0.33, y: 0.40, rx: 0.15, ry: 0.13 },
      { z: 1.42, x: 0.24, y: 0.39, rx: 0.08, ry: 0.09 },
    ]
  : [
      { z: -0.48, x: 0.43, y: 0.44, rx: 0.06, ry: 0.11 },
      { z: -0.18, x: 0.49, y: 0.47, rx: 0.20, ry: 0.19 },
      { z: 0.22, x: 0.50, y: 0.45, rx: 0.19, ry: 0.16 },
      { z: 0.58, x: 0.42, y: 0.39, rx: 0.15, ry: 0.12 },
      { z: 0.96, x: 0.31, y: 0.39, rx: 0.13, ry: 0.11 },
      { z: 1.42, x: 0.24, y: 0.39, rx: 0.08, ry: 0.09 },
    ];
mirroredLoft(sidepods, 52, 96, ({ x, y, rx, ry, c, s, z }, side) => {
  const topSweep = concept === 'A' ? 0.03 * Math.max(0, s) * (z + 0.5) : -0.045 * Math.max(0, s) * (z + 0.5);
  const tailFade = concept === 'A' ? 1 : 1 - 0.75 * THREE.MathUtils.smootherstep(z, 0.68, 1.22);
  const undercut =
    (concept === 'A' ? 0.07 : 0.105) *
    tailFade *
    Math.exp(-Math.pow((s + 0.55) / 0.22, 2));
  const sectionPower = concept === 'A' ? 0.78 : 0.56;
  return [side * (x + rx * Math.sign(c) * Math.pow(Math.abs(c), sectionPower) - undercut), y + ry * s + topSweep, z];
});

// Explicit dark inlet walls establish duct depth without texture tricks.
for (const side of [-1, 1]) {
  const inlet = new THREE.TorusGeometry(concept === 'A' ? 0.145 : 0.13, 0.018, 12, 36, Math.PI * 1.55);
  inlet.rotateY(Math.PI / 2);
  inlet.rotateZ(side * (concept === 'A' ? 0.18 : -0.12));
  inlet.scale(1, concept === 'A' ? 1.18 : 0.92, 1);
  inlet.translate(side * 0.54, 0.46, -0.43);
  add('aero', inlet);
  const duct = new THREE.CylinderGeometry(0.115, 0.075, 0.28, 32, 6, true);
  duct.rotateZ(Math.PI / 2);
  duct.translate(side * 0.52, 0.45, -0.30);
  add('cockpit', duct);
}

// Sculpted floor ribbon, continuously rising to a true twin-channel rear exit.
const floorWidths = concept === 'A'
  ? [
      { z: -1.10, width: 0.42 }, { z: -0.62, width: 0.64 },
      { z: -0.18, width: 0.70 }, { z: 0.58, width: 0.67 },
      { z: 1.26, width: 0.63 }, { z: 2.30, width: 0.58 },
    ]
  : [
      { z: -1.10, width: 0.36 }, { z: -0.62, width: 0.58 },
      { z: -0.28, width: 0.71 }, { z: 0.28, width: 0.68 },
      { z: 0.86, width: 0.55 }, { z: 1.42, width: 0.62 },
      { z: 2.30, width: 0.58 },
    ];
const floor = grid(48, 96, (u, v) => {
  const z = THREE.MathUtils.lerp(-1.10, 2.30, v);
  const halfWidth = interpolate(floorWidths, z, 'width');
  const q = THREE.MathUtils.lerp(-1, 1, u);
  const x = q * halfWidth;
  const rear = THREE.MathUtils.smootherstep(z, 0.95, 2.30);
  const channel = Math.exp(-Math.pow((Math.abs(x) - 0.30) / (concept === 'A' ? 0.18 : 0.15), 2));
  const centre = Math.exp(-Math.pow(x / 0.09, 2));
  const edge = Math.pow(Math.abs(q), concept === 'A' ? 2.2 : 1.35);
  const y = 0.075 + rear * (0.09 + 0.17 * channel - 0.035 * centre) + 0.025 * edge;
  return [x, y, z];
});
add('aero', floor);
for (const x of [-0.5675, 0, 0.5675])
  add('aero', box([0.025, 0.16, 0.78], [x, 0.19, 1.91], [0.04 * Math.sign(x), 0, 0]));

// Airfoil masses and endplates share one design family per concept.
for (let i = 0; i < (concept === 'A' ? 3 : 2); i += 1)
  add('aero', wingElement({ span: 2 - i * (concept === 'A' ? 0.10 : 0.16), z: -2.45 + i * (concept === 'A' ? 0.10 : 0.14), y: 0.11 + i * (concept === 'A' ? 0.055 : 0.075), chord: concept === 'A' ? 0.20 : 0.24, thickness: 0.035 - i * 0.004, sweep: concept === 'A' ? 0.13 : -0.025, dihedral: concept === 'A' ? 0.04 : 0.085 }));
for (const side of [-1, 1])
  add('aero', box([0.035, 0.25, 0.30], [side * 0.98, 0.205, -2.40]));
for (let i = 0; i < 2; i += 1)
  add('aero', wingElement({ span: 1.36 - i * 0.06, z: 2.16 + i * 0.14, y: 0.96 + i * 0.12, chord: 0.25, thickness: 0.045, sweep: concept === 'A' ? -0.025 : 0.025, dihedral: 0 }));
for (const side of [-1, 1]) add('aero', box([0.045, 0.36, 0.38], [side * 0.67, 1.0, 2.24], [0, concept === 'A' ? side * 0.06 : side * -0.04, 0]));
add('mechanical', rod([0, 0.52, 1.76], [0, 0.92, 2.18], 0.032, 16));

// Halo and cockpit opening remain at the registered hardpoints.
add('cockpit', new THREE.SphereGeometry(1, 36, 18).scale(0.23, 0.085, 0.43).translate(0, 0.59, -0.12));
const leftMount = [-0.26, 0.66, 0.12];
const rightMount = [0.26, 0.66, 0.12];
const top = [0, 0.94, -0.46];
add('mechanical', rod(leftMount, [-0.24, 0.86, -0.34], 0.037, 18));
add('mechanical', rod([-0.24, 0.86, -0.34], top, 0.037, 18));
add('mechanical', rod(top, [0.24, 0.86, -0.34], 0.037, 18));
add('mechanical', rod([0.24, 0.86, -0.34], rightMount, 0.037, 18));
add('mechanical', rod([0, 0.65, -0.65], top, 0.036, 18));
for (const [x, y, z] of [leftMount, rightMount]) {
  const fairing = new THREE.SphereGeometry(1, 32, 16);
  fairing.scale(concept === 'A' ? 0.16 : 0.13, 0.045, concept === 'A' ? 0.28 : 0.36);
  fairing.translate(x, y + 0.01, z - (concept === 'A' ? 0.04 : 0.10));
  add('body', fairing);
}

// Wheels and independent suspension assemblies.
for (const [rear, z, track, radius, width] of [
  [false, D.axles.frontZ, D.axles.frontTrack, D.wheels.front.radius, D.wheels.front.width],
  [true, D.axles.rearZ, D.axles.rearTrack, D.wheels.rear.radius, D.wheels.rear.width],
]) {
  for (const side of [-1, 1]) {
    const x = side * track / 2;
    wheel(x, radius, z, radius, width);
    const innerX = side * (rear ? 0.31 : 0.28);
    for (const upper of [false, true]) {
      const innerY = upper ? 0.59 : 0.28;
      const outerY = radius + (upper ? 0.095 : -0.095);
      for (const offset of [-0.19, 0.19]) add('mechanical', rod([innerX, innerY, z + offset], [x - side * 0.1, outerY, z], 0.013, 12));
    }
    add('mechanical', rod([side * 0.32, 0.68, z - 0.08], [x - side * 0.1, radius, z], 0.011, 12));
  }
}

// Exact approved envelope markers are real aerodynamic surfaces.
add('aero', box([2.0, 0.016, 0.04], [0, 0.10, -2.58]));
add('aero', box([1.34, 0.018, 0.04], [0, 1.171, 2.43]));

for (const [category, geometries] of parts) {
  const merged = mergeGeometries(geometries, false);
  if (!merged) throw new Error(`Failed to merge ${category}`);
  merged.computeBoundingBox();
  merged.computeBoundingSphere();
  const mesh = new THREE.Mesh(merged, materials[category]);
  mesh.name = `EDS_G03_${category.toUpperCase()}`;
  mesh.userData = { assembly: category, concept, reviewOnly: true, originalGeometry: true };
  scene.add(mesh);
}

const binary = await new Promise((resolve, reject) =>
  new GLTFExporter().parse(scene, resolve, reject, { binary: true, onlyVisible: true }),
);
await fs.mkdir(path.dirname(output), { recursive: true });
await fs.writeFile(output, Buffer.from(binary));
console.log(JSON.stringify({ concept, output: path.relative(process.cwd(), output), bytes: binary.byteLength, meshes: scene.children.length }));
