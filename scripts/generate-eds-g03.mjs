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
scene.name = 'EDS-G03_R3_2_Revision_1_Integrated_Primary_Surfaces';
scene.userData = {
  asset: D.id,
  revision: D.revision,
  author: 'Podium Effet De Sol / AI-assisted original parametric workflow',
  source: 'scripts/generate-eds-g03.mjs; scripts/eds-g03-design.mjs',
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
      const inlet =
        sidepodActive *
        Math.exp(-Math.pow((z + 0.34) / 0.13, 2)) *
        Math.exp(-Math.pow((s - 0.13) / 0.22, 2));
      let bodyX = x + lateral + side * sidepodActive * (0.33 * sidepodCrown - 0.04 * undercut);
      bodyX -= side * inlet * 0.045;
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
      const lipWeight =
        Math.pow(Math.abs(c), 0.5) * THREE.MathUtils.smoothstep(-s, 0.2, 0.65);
      bodyX += side * Math.max(0, floorHalfWidth(z) - Math.abs(bodyX)) * floorActive * lipWeight;
      const underbodyWeight = floorActive * THREE.MathUtils.smootherstep(-s, 0.35, 0.8);
      const lipFraction = THREE.MathUtils.smoothstep(s, -1, -0.58);
      const channel =
        0.028 *
        Math.exp(-Math.pow((Math.abs(bodyX) - 0.35) / 0.15, 2)) *
        Math.exp(-Math.pow((z - 0.25) / 0.7, 2));
      const diffuserRise = 0.16 * THREE.MathUtils.smootherstep(z, 0.95, 2.3);
      const underbodyY = 0.075 + 0.085 * lipFraction + diffuserRise - channel;
      bodyY = THREE.MathUtils.lerp(bodyY, underbodyY, underbodyWeight);

      // The airbox spine and halo-foot fairings deform this shell instead of sitting on pads.
      const topWeight = Math.max(0, s) ** 5;
      bodyY +=
        topWeight *
        Math.exp(-Math.pow(bodyX / 0.17, 2)) *
        (0.12 * Math.exp(-Math.pow((z - 0.48) / 0.42, 2)) +
          0.055 * Math.exp(-Math.pow((z - 0.98) / 0.5, 2)));
      for (const mountX of [-0.26, 0.26]) {
        const foot =
          Math.exp(-Math.pow((bodyX - mountX) / 0.09, 4)) *
          Math.exp(-Math.pow((z - 0.12) / 0.14, 4)) *
          Math.max(0, s) ** 2;
        bodyY += foot * Math.max(0, 0.66 - bodyY);
      }
      return [bodyX, bodyY, z];
    },
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

// The accepted halo tubes enter the analytically fairied body shell at their locked mount points.
addPart(
  'mechanical',
  curveTube(
    [
      [-0.26, 0.66, 0.12],
      [-0.3, 0.82, -0.12],
      [-0.22, 0.9, -0.38],
      [0, 0.94, -0.5],
      [0.22, 0.9, -0.38],
      [0.3, 0.82, -0.12],
      [0.26, 0.66, 0.12],
    ],
    0.022,
    96,
    14,
  ),
);
addPart('mechanical', rod([0, 0.65, -0.65], [0, 0.94, -0.5], 0.022, 10));

for (const [category, geometries] of parts) {
  if (!geometries.length) continue;
  const merged = mergeGeometries(geometries, false);
  if (!merged) throw new Error(`Unable to merge ${category} geometry`);
  merged.computeBoundingBox();
  merged.computeBoundingSphere();
  const mesh = new THREE.Mesh(merged, materials[category]);
  mesh.name = `EDS_G03_${category.toUpperCase()}`;
  mesh.userData = { assembly: category, gate: 'R3.2 Revision 1', originalGeometry: true };
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
