import fs from 'node:fs/promises';
import path from 'node:path';
import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { EDS_G02_DESIGN as D } from './eds-g02-design.mjs';

const output = path.resolve(process.argv[2] || 'public/models/eds-g02.glb');

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
scene.name = 'EDS-G02_Original_Review';
scene.userData = {
  asset: D.id,
  revision: D.revision,
  author: 'Podium Effet De Sol / AI-assisted project workflow',
  source: 'scripts/generate-eds-g02.mjs; scripts/eds-g02-design.mjs',
  units: 'metres',
  reviewStatus: 'VISUAL_REVIEW_REQUIRED; not the default Showroom model',
  designNote: D.designLanguage.join('; '),
};

const material = (name, color, roughness, metalness, clearcoat = 0) => {
  const value = new THREE.MeshPhysicalMaterial({
    color,
    roughness,
    metalness,
    clearcoat,
    clearcoatRoughness: 0.18,
  });
  value.name = `EDS_G02_${name}`;
  return value;
};
const materials = {
  body: material('BODY_PAINT', '#12364b', 0.27, 0.18, 0.75),
  accent: material('AERO_ACCENT', '#46dce8', 0.24, 0.38, 0.7),
  carbon: material('SATIN_CARBON', '#131b21', 0.44, 0.24, 0.18),
  tire: material('RUBBER', '#111315', 0.88, 0.02),
  rim: material('FORGED_RIM', '#8899a5', 0.29, 0.77, 0.15),
  metal: material('MECHANICAL_METAL', '#48535d', 0.34, 0.65),
  cockpit: material('COCKPIT', '#080c10', 0.7, 0.12),
  intake: material('INTAKE', '#05090c', 0.85, 0.05),
  seam: material('PANEL_SEAM', '#060a0d', 0.64, 0.05),
};
const parts = new Map(Object.keys(materials).map((key) => [key, []]));

function part(category, geometry) {
  geometry.deleteAttribute('uv');
  if (!geometry.getAttribute('normal')) geometry.computeVertexNormals();
  if (!geometry.index) throw new Error(`Expected indexed geometry for ${category}`);
  parts.get(category).push(geometry);
}

function grid(uCount, vCount, point, reverse = false, wrapU = false) {
  const positions = [];
  const indices = [];
  const rows = wrapU ? uCount : uCount + 1;
  for (let u = 0; u < rows; u += 1) {
    for (let v = 0; v <= vCount; v += 1) positions.push(...point(u / uCount, v / vCount));
  }
  const a = (u, v) => (u % rows) * (vCount + 1) + v;
  for (let u = 0; u < uCount; u += 1) {
    for (let v = 0; v < vCount; v += 1) {
      const q = a(u, v);
      const r = a(u + 1, v);
      const s = a(u, v + 1);
      const t = a(u + 1, v + 1);
      indices.push(...(reverse ? [q, s, r, s, t, r] : [q, r, s, r, t, s]));
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function radialPatch(radial, rings, point) {
  const positions = [...point(0, 0)];
  const indices = [];
  for (let ring = 1; ring <= rings; ring += 1)
    for (let j = 0; j < radial; j += 1)
      positions.push(...point((j / radial) * Math.PI * 2, ring / rings));
  const vertex = (ring, j) => 1 + (ring - 1) * radial + (j % radial);
  for (let j = 0; j < radial; j += 1) indices.push(0, vertex(1, j + 1), vertex(1, j));
  for (let ring = 1; ring < rings; ring += 1)
    for (let j = 0; j < radial; j += 1) {
      const inner = vertex(ring, j);
      const nextInner = vertex(ring, j + 1);
      const outer = vertex(ring + 1, j);
      const nextOuter = vertex(ring + 1, j + 1);
      indices.push(inner, nextInner, outer, nextInner, nextOuter, outer);
    }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function sample(stations, z, field) {
  let i = 0;
  while (i < stations.length - 2 && z > stations[i + 1].z) i += 1;
  const a = stations[i];
  const b = stations[i + 1];
  const before = stations[Math.max(0, i - 1)];
  const after = stations[Math.min(stations.length - 1, i + 2)];
  const t = THREE.MathUtils.clamp((z - a.z) / (b.z - a.z), 0, 1);
  const h = b.z - a.z;
  const slope = (left, right) => (right[field] - left[field]) / (right.z - left.z);
  const current = slope(a, b);
  const previous = before === a ? current : slope(before, a);
  const next = after === b ? current : slope(b, after);
  const monotoneTangent = (first, second) =>
    first * second <= 0 ? 0 : (2 * first * second) / (first + second);
  const m0 = monotoneTangent(previous, current) * h;
  const m1 = monotoneTangent(current, next) * h;
  const t2 = t * t;
  const t3 = t2 * t;
  return (
    (2 * t3 - 3 * t2 + 1) * a[field] +
    (t3 - 2 * t2 + t) * m0 +
    (-2 * t3 + 3 * t2) * b[field] +
    (t3 - t2) * m1
  );
}

function loft(stations, radial = 32, axial = 72, profile = null, angleRange = null) {
  const z0 = stations[0].z;
  const z1 = stations.at(-1).z;
  return grid(
    radial,
    axial,
    (u, v) => {
      const z = z0 + (z1 - z0) * v;
      const angle = angleRange
        ? angleRange[0] + (angleRange[1] - angleRange[0]) * u
        : u * Math.PI * 2;
      const c = Math.cos(angle);
      const s = Math.sin(angle);
      const cx = sample(stations, z, 'x');
      const cy = sample(stations, z, 'y');
      const rx = sample(stations, z, 'rx');
      const ry = sample(stations, z, 'ry');
      return profile ? profile({ cx, cy, rx, ry, c, s, z }) : [cx + c * rx, cy + s * ry, z];
    },
    false,
    angleRange === null,
  );
}

function correctFoldNormals(geometry) {
  // At the buried sidepod-to-engine-cover taper, averaging across a tight bend can
  // oppose a few triangle faces. Split only those vertices and use their face normal.
  const sourcePositions = geometry.getAttribute('position');
  const sourceNormals = geometry.getAttribute('normal');
  const positions = Array.from(sourcePositions.array);
  const normals = Array.from(sourceNormals.array);
  const indices = Array.from(geometry.index.array);
  let corrected = 0;
  for (let offset = 0; offset < indices.length; offset += 3) {
    const ids = indices.slice(offset, offset + 3);
    const p = ids.map((id) => new THREE.Vector3().fromBufferAttribute(sourcePositions, id));
    const face = p[1].clone().sub(p[0]).cross(p[2].clone().sub(p[0]));
    if (face.lengthSq() < 1e-18) continue;
    const average = ids.reduce(
      (sum, id) => sum.add(new THREE.Vector3().fromBufferAttribute(sourceNormals, id)),
      new THREE.Vector3(),
    );
    if (face.dot(average) >= 0) continue;
    face.normalize();
    for (let corner = 0; corner < 3; corner += 1) {
      indices[offset + corner] = positions.length / 3;
      positions.push(...p[corner].toArray());
      normals.push(...face.toArray());
    }
    corrected += 1;
  }
  if (!corrected) return geometry;
  const value = new THREE.BufferGeometry();
  value.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  value.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  value.setIndex(indices);
  return value;
}

function curveTube(points, radius, segments = 48, radial = 8, closed = false) {
  const curve = new THREE.CatmullRomCurve3(
    points.map((point) => new THREE.Vector3(...point)),
    closed,
  );
  return new THREE.TubeGeometry(curve, segments, radius, radial, closed);
}

function rod(a, b, radius, radial = 10, flatten = 1) {
  const start = new THREE.Vector3(...a);
  const end = new THREE.Vector3(...b);
  const direction = end.clone().sub(start);
  const geometry = new THREE.CylinderGeometry(radius, radius, direction.length(), radial, 1);
  geometry.scale(flatten, 1, 1);
  geometry.applyMatrix4(
    new THREE.Matrix4().compose(
      start.add(end).multiplyScalar(0.5),
      new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize()),
      new THREE.Vector3(1, 1, 1),
    ),
  );
  return geometry;
}

function ellipsoid(center, radii, width = 24, height = 16) {
  const geometry = new THREE.SphereGeometry(1, width, height);
  geometry.scale(...radii);
  geometry.translate(...center);
  return geometry;
}

// Single smooth survival-cell/nose loft. The top surface is scooped for a genuine cockpit well.
const hull = [
  { z: -2.46, x: 0, y: 0.33, rx: 0.055, ry: 0.052 },
  { z: -2.23, x: 0, y: 0.35, rx: 0.085, ry: 0.07 },
  { z: -1.75, x: 0, y: 0.39, rx: 0.15, ry: 0.105 },
  { z: -1.15, x: 0, y: 0.47, rx: 0.255, ry: 0.16 },
  { z: -0.7, x: 0, y: 0.51, rx: 0.32, ry: 0.21 },
  { z: -0.1, x: 0, y: 0.5, rx: 0.35, ry: 0.215 },
  { z: 0.43, x: 0, y: 0.56, rx: 0.33, ry: 0.27 },
  { z: 1.05, x: 0, y: 0.56, rx: 0.31, ry: 0.3 },
  { z: 1.48, x: 0, y: 0.49, rx: 0.235, ry: 0.23 },
  { z: 1.87, x: 0, y: 0.4, rx: 0.11, ry: 0.11 },
  { z: 2.02, x: 0, y: 0.36, rx: 0.035, ry: 0.05 },
];
part(
  'body',
  loft(hull, 48, 116, ({ cx, cy, rx, ry, c, s, z }) => {
    const cockpit = Math.exp(-Math.pow((z + 0.29) / 0.53, 4));
    const scoop = 0.16 * cockpit * Math.max(0, s) ** 5;
    return [cx + c * rx, cy + s * ry - scoop, z];
  }),
);

// Sidepods are smooth, closed aerodynamic volumes, not extruded boxes.
for (const side of [-1, 1]) {
  const pod = [
    { z: -0.69, x: side * 0.33, y: 0.45, rx: 0.035, ry: 0.035 },
    { z: -0.5, x: side * 0.49, y: 0.48, rx: 0.155, ry: 0.135 },
    { z: -0.22, x: side * 0.51, y: 0.47, rx: 0.265, ry: 0.205 },
    { z: 0.25, x: side * 0.5, y: 0.46, rx: 0.29, ry: 0.2 },
    { z: 0.76, x: side * 0.43, y: 0.44, rx: 0.255, ry: 0.175 },
    { z: 1.0, x: side * 0.32, y: 0.42, rx: 0.17, ry: 0.125 },
    { z: 1.24, x: side * 0.21, y: 0.4, rx: 0.07, ry: 0.075 },
    { z: 1.42, x: side * 0.16, y: 0.39, rx: 0.025, ry: 0.04 },
  ];
  part(
    'body',
    correctFoldNormals(
      loft(
        pod,
        32,
        64,
        ({ cx, cy, rx, ry, c, s, z }) => {
          const undercut = s < 0 ? 1 + 0.24 * s : 1;
          const upperSweep = s > 0 ? 0.028 * Math.sin((z + 0.69) * 2.2) : 0;
          return [cx + c * rx * undercut, cy + s * ry + upperSweep, z];
        },
        side > 0 ? [-Math.PI + 0.9, Math.PI - 0.9] : [0.9, 2 * Math.PI - 0.9],
      ),
    ),
  );
  // Recessed cooling opening and a rounded original intake lip.
  const intakeZ = -0.49;
  part(
    'intake',
    radialPatch(24, 10, (angle, radius) => {
      return [
        side * (0.49 + 0.135 * Math.cos(angle) * radius),
        0.48 + 0.095 * Math.sin(angle) * radius,
        intakeZ + 0.022 + 0.025 * (1 - radius),
      ];
    }),
  );
  const intakeRim = [];
  for (let i = 0; i < 20; i += 1) {
    const a = (i / 20) * Math.PI * 2;
    intakeRim.push([side * (0.49 + 0.145 * Math.cos(a)), 0.48 + 0.105 * Math.sin(a), intakeZ]);
  }
  part('carbon', curveTube(intakeRim, 0.014, 60, 8, true));
  // Side-facing recessed duct remains legible from the default three-quarter camera.
  part('intake', ellipsoid([side * 0.76, 0.53, -0.22], [0.012, 0.075, 0.13], 20, 12));
  part(
    'carbon',
    curveTube(
      Array.from({ length: 20 }, (_, i) => {
        const a = (i / 20) * Math.PI * 2;
        return [side * 0.772, 0.53 + 0.08 * Math.sin(a), -0.22 + 0.135 * Math.cos(a)];
      }),
      0.011,
      56,
      8,
      true,
    ),
  );
  // Panel cutline follows the upper pod shoulder, with no sponsor-like markings.
  part(
    'seam',
    curveTube(
      [
        [side * 0.59, 0.625, -0.32],
        [side * 0.71, 0.65, 0.05],
        [side * 0.73, 0.625, 0.48],
        [side * 0.58, 0.53, 0.96],
      ],
      0.005,
    ),
  );
  // Cooling gills recess into the body visually instead of projecting as bars.
  for (let i = 0; i < 3; i += 1) {
    const z = 0.47 + i * 0.105;
    part(
      'intake',
      curveTube(
        [
          [side * 0.61, 0.625, z],
          [side * 0.53, 0.663, z + 0.02],
        ],
        0.008,
      ),
    );
  }
}

// Cockpit aperture and inner tub: depression follows the hull rather than hiding it behind a box.
part(
  'cockpit',
  radialPatch(32, 10, (a, r) => {
    return [0.255 * Math.cos(a) * r, 0.565 + 0.075 * r * r, -0.28 + 0.475 * Math.sin(a) * r];
  }),
);
part(
  'carbon',
  curveTube(
    Array.from({ length: 32 }, (_, i) => {
      const a = (i / 32) * 2 * Math.PI;
      return [0.26 * Math.cos(a), 0.642, -0.28 + 0.48 * Math.sin(a)];
    }),
    0.017,
    72,
    8,
    true,
  ),
);
part('cockpit', ellipsoid([0, 0.585, 0.02], [0.19, 0.13, 0.3]));
part(
  'metal',
  curveTube(
    [
      [-0.15, 0.68, -0.45],
      [-0.12, 0.72, -0.47],
      [0.12, 0.72, -0.47],
      [0.15, 0.68, -0.45],
    ],
    0.013,
  ),
);
part('cockpit', ellipsoid([0, 0.69, -0.47], [0.12, 0.055, 0.035]));

// Airbox mouth and tapered dorsal spine retain an original rounded-diamond section.
part('intake', ellipsoid([0, 0.89, 0.53], [0.145, 0.11, 0.035]));
part(
  'carbon',
  curveTube(
    [
      [-0.15, 0.89, 0.53],
      [-0.1, 1.0, 0.52],
      [0, 1.03, 0.52],
      [0.1, 1.0, 0.52],
      [0.15, 0.89, 0.53],
    ],
    0.016,
  ),
);

// Sculpted twin-channel floor shell: underside throat and diffuser expand toward the tail.
const floorZ0 = -1.31;
const floorZ1 = 2.24;
const floorWidth = (z) =>
  0.62 + 0.12 * Math.exp(-Math.pow((z - 0.1) / 1.25, 2)) - 0.11 * Math.max(0, z - 1.75);
const underfloorY = (x, z) => {
  const throat = Math.exp(-Math.pow((z - 0.28) / 0.78, 2));
  const channels = Math.exp(-Math.pow((Math.abs(x) - 0.4) / 0.19, 2));
  const ramp = 0.22 * THREE.MathUtils.smoothstep(z, 1.15, 2.24);
  return 0.105 - 0.048 * throat * channels + ramp + 0.022 * (Math.abs(x) / floorWidth(z)) ** 2;
};
for (const upper of [false, true]) {
  part(
    'carbon',
    grid(
      30,
      62,
      (u, v) => {
        const z = floorZ0 + v * (floorZ1 - floorZ0);
        const x = (2 * u - 1) * floorWidth(z);
        return [x, underfloorY(x, z) + (upper ? 0.045 : 0), z];
      },
      !upper,
    ),
  );
}
for (const side of [-1, 1]) {
  part(
    'carbon',
    grid(
      1,
      62,
      (u, v) => {
        const z = floorZ0 + v * (floorZ1 - floorZ0);
        const x = side * floorWidth(z);
        return [x, underfloorY(x, z) + 0.045 * u, z];
      },
      side < 0,
    ),
  );
}
// Thin curved tunnel vanes: visibly follow the channel exit, not rectangular fins.
for (const x0 of [-0.58, -0.35, 0, 0.35, 0.58]) {
  part(
    'carbon',
    grid(
      1,
      22,
      (u, v) => {
        const z = 1.29 + v * 0.92;
        const x = x0 * (1 + 0.13 * v * v);
        return [x, underfloorY(x, z) + 0.02 + u * (0.08 + 0.14 * v), z];
      },
      x0 > 0,
    ),
  );
}
part('metal', ellipsoid([0, 0.4, 2.19], [0.085, 0.04, 0.035]));

// Airfoil volume: two cambered skins, shared closeout strips and sculpted span sweep.
function aerofoil(span, z0, chord, y0, sweep, dihedral, camber, thickness, category) {
  const surface = (u, v, upper) => {
    const x = (u - 0.5) * span;
    const out = Math.abs(2 * u - 1);
    const z = z0 + sweep * out ** 1.7 + chord * v;
    const profile = Math.sin(Math.PI * v);
    const y =
      y0 +
      dihedral * out ** 1.65 +
      camber * profile +
      (upper ? 1 : -1) * (0.003 + thickness * profile ** 0.7);
    return [x, y, z];
  };
  part(
    category,
    grid(38, 12, (u, v) => surface(u, v, true), true),
  );
  part(
    category,
    grid(38, 12, (u, v) => surface(u, v, false)),
  );
  for (const v of [0, 1])
    part(
      category,
      grid(38, 1, (u, w) => surface(u, v, w === 1), v === 1),
    );
  for (const u of [0, 1])
    part(
      category,
      grid(1, 12, (w, v) => surface(u, v, w === 1), u === 0),
    );
}

for (let i = 0; i < 4; i += 1) {
  aerofoil(
    1.94 - i * 0.075,
    -2.57 + i * 0.105,
    0.215 - i * 0.01,
    0.115 + i * 0.046,
    0.13 + i * 0.025,
    0.07 + i * 0.014,
    0.015,
    0.014,
    i === 0 ? 'carbon' : 'accent',
  );
}

// Bevelled endplates from a bespoke curved outline (not box slabs).
function plate(side, outline, category, thickness = 0.018) {
  const shape = new THREE.Shape();
  shape.moveTo(outline[0][0], outline[0][1]);
  for (let i = 1; i < outline.length; i += 1) shape.lineTo(...outline[i]);
  shape.closePath();
  const points = shape.getPoints();
  const triangles = THREE.ShapeUtils.triangulateShape(points, []);
  const pos = [];
  const idx = [];
  const x0 = side * (outline.x ?? 0);
  for (const x of [x0 - thickness / 2, x0 + thickness / 2])
    for (const [z, y] of points.map((point) => [point.x, point.y])) pos.push(x, y, z);
  const count = points.length;
  for (const [a, b, c] of triangles) {
    idx.push(a, b, c, count + c, count + b, count + a);
  }
  for (let i = 0; i < count; i += 1) {
    const j = (i + 1) % count;
    idx.push(i, j, count + i, j, count + j, count + i);
  }
  const geom = new THREE.BufferGeometry();
  geom.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geom.setIndex(idx);
  geom.computeVertexNormals();
  part(category, geom);
}
for (const side of [-1, 1]) {
  const frontOutline = [
    [-2.61, 0.065],
    [-2.55, 0.39],
    [-2.46, 0.43],
    [-2.34, 0.38],
    [-2.19, 0.3],
    [-2.07, 0.13],
    [-2.13, 0.08],
    [-2.3, 0.09],
  ];
  frontOutline.x = 0.99;
  plate(side, frontOutline, 'carbon', 0.025);
  part(
    'accent',
    curveTube(
      [
        [side * 0.99, 0.39, -2.55],
        [side * 1.0, 0.42, -2.46],
        [side * 0.99, 0.37, -2.34],
      ],
      0.012,
    ),
  );
  part('carbon', rod([side * 0.115, 0.32, -2.15], [side * 0.37, 0.15, -2.35], 0.018));
}

// Rear mainplane and separate hinged active flap; visible supports and hinge line.
aerofoil(1.48, 2.055, 0.34, 0.91, 0.045, 0.015, 0.035, 0.023, 'carbon');
aerofoil(1.43, 2.125, 0.255, 1.125, 0.065, 0.02, 0.025, 0.018, 'accent');
for (const side of [-1, 1]) {
  const rearOutline = [
    [1.99, 0.73],
    [2.07, 1.19],
    [2.21, 1.25],
    [2.39, 1.18],
    [2.48, 0.99],
    [2.4, 0.72],
    [2.27, 0.68],
    [2.13, 0.73],
  ];
  rearOutline.x = 0.76;
  plate(side, rearOutline, 'carbon', 0.025);
  part('metal', rod([side * 0.51, 0.85, 2.13], [side * 0.27, 0.46, 1.66], 0.024));
  part('metal', rod([side * 0.57, 1.105, 2.165], [side * 0.6, 0.965, 2.17], 0.011));
}
part('metal', rod([-0.62, 1.07, 2.17], [0.62, 1.07, 2.17], 0.009));

// Volumetric slicks with rounded shoulders and proper sidewalls; a forged face closes each wheel.
function tireGeometry(x, y, z, radius, width) {
  const profile = [
    [-0.5, 0.56],
    [-0.5, 0.72],
    [-0.47, 0.83],
    [-0.4, 0.95],
    [-0.29, 0.995],
    [0, 1],
    [0.29, 0.995],
    [0.4, 0.95],
    [0.47, 0.83],
    [0.5, 0.72],
    [0.5, 0.56],
    [-0.5, 0.56],
  ];
  const positions = [];
  const indices = [];
  for (const [offset, scale] of profile)
    for (let j = 0; j < 48; j += 1) {
      const a = (j / 48) * Math.PI * 2;
      positions.push(
        x + width * offset,
        y + radius * scale * Math.cos(a),
        z + radius * scale * Math.sin(a),
      );
    }
  for (let i = 0; i < profile.length - 1; i += 1)
    for (let j = 0; j < 48; j += 1) {
      const a = i * 48 + j;
      const b = i * 48 + ((j + 1) % 48);
      const c = (i + 1) * 48 + j;
      const d = (i + 1) * 48 + ((j + 1) % 48);
      indices.push(a, b, c, b, d, c);
    }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}
function axialCylinder(radius, depth, x, y, z, segments = 40) {
  const geometry = new THREE.CylinderGeometry(radius, radius, depth, segments);
  geometry.rotateZ(Math.PI / 2);
  geometry.translate(x, y, z);
  return geometry;
}
for (const side of [-1, 1]) {
  for (const rear of [false, true]) {
    const z = rear ? D.rearAxleZ : D.frontAxleZ;
    const x = (side * (rear ? D.rearTrack : D.frontTrack)) / 2;
    const r = rear ? D.rearWheelRadius : D.frontWheelRadius;
    const width = rear ? D.rearWheelWidth : D.frontWheelWidth;
    part('tire', tireGeometry(x, r, z, r, width));
    const faceX = x + side * (width / 2 + 0.005);
    part('rim', axialCylinder(r * 0.53, width * 0.88, x, r, z));
    part('carbon', axialCylinder(r * 0.34, 0.009, faceX, r, z));
    part('metal', axialCylinder(r * 0.23, 0.011, x - side * width * 0.4, r, z));
    part('rim', axialCylinder(r * 0.09, 0.024, faceX + side * 0.015, r, z));
    for (let i = 0; i < 9; i += 1) {
      const a = (i / 9) * Math.PI * 2;
      part(
        'rim',
        rod(
          [faceX + side * 0.012, r + r * 0.105 * Math.cos(a), z + r * 0.105 * Math.sin(a)],
          [faceX, r + r * 0.43 * Math.cos(a + 0.12), z + r * 0.43 * Math.sin(a + 0.12)],
          0.013,
          8,
        ),
      );
    }
    // Two separated wishbone planes, track rod and sprung pushrod.
    const inner = rear ? 0.32 : 0.29;
    for (const upper of [false, true]) {
      const y0 = upper ? 0.57 : 0.3;
      const y1 = r + (upper ? 0.11 : -0.1);
      for (const dz of [-0.22, 0.22])
        part('carbon', rod([side * inner, y0, z + dz], [x - side * 0.11, y1, z], 0.018, 10));
    }
    part('metal', rod([side * 0.34, 0.7, z - 0.12], [x - side * 0.1, r - 0.06, z], 0.013));
    part('carbon', rod([side * 0.34, 0.36, z + 0.29], [x - side * 0.1, r, z], 0.012));
    part('metal', ellipsoid([x - side * 0.1, r, z], [0.058, 0.07, 0.07], 16, 12));
  }
}

// Three-point halo with blended arch; mirror housings use lens-like curved shells.
part(
  'carbon',
  curveTube(
    [
      [-0.31, 0.69, 0.16],
      [-0.39, 0.81, -0.1],
      [-0.37, 0.94, -0.39],
      [-0.18, 1.0, -0.62],
      [0, 1.01, -0.67],
      [0.18, 1.0, -0.62],
      [0.37, 0.94, -0.39],
      [0.39, 0.81, -0.1],
      [0.31, 0.69, 0.16],
    ],
    0.032,
    84,
    12,
  ),
);
part('carbon', rod([0, 0.7, -0.79], [0, 1.01, -0.67], 0.031, 12));
for (const side of [-1, 1]) {
  part('carbon', rod([side * 0.3, 0.69, 0.16], [side * 0.39, 0.82, -0.1], 0.037, 12));
  part('carbon', rod([side * 0.38, 0.71, -0.48], [side * 0.73, 0.68, -0.65], 0.013));
  part('body', ellipsoid([side * 0.75, 0.69, -0.66], [0.115, 0.043, 0.06], 18, 12));
  part('intake', ellipsoid([side * 0.75, 0.69, -0.693], [0.07, 0.024, 0.009], 16, 8));
}

// Assemble by material without discarding smooth vertex normals. This bounds draw calls.
for (const [category, geometries] of parts) {
  if (!geometries.length) continue;
  const merged = mergeGeometries(geometries, false);
  if (!merged) throw new Error(`Failed to merge ${category}`);
  merged.computeBoundingBox();
  merged.computeBoundingSphere();
  const mesh = new THREE.Mesh(merged, materials[category]);
  mesh.name = `EDS_G02_${category.toUpperCase()}`;
  mesh.userData = { assembly: category, originalGeometry: true };
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
  `Generated ${path.relative(process.cwd(), output)}: ${Buffer.byteLength(binary)} bytes, ${scene.children.length} draw-call groups`,
);
