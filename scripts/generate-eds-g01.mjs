import fs from 'node:fs/promises';
import path from 'node:path';
import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { EDS_G01_DESIGN } from './eds-g01-design.mjs';

const OUTPUT = path.resolve('public/models/eds-g01.glb');

class NodeFileReader {
  result = null;
  onloadend = null;
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then((value) => {
      this.result = value;
      this.onloadend?.({ target: this });
    });
  }
  readAsDataURL(blob) {
    blob.arrayBuffer().then((value) => {
      this.result = `data:${blob.type};base64,${Buffer.from(value).toString('base64')}`;
      this.onloadend?.({ target: this });
    });
  }
}
globalThis.FileReader ??= NodeFileReader;

const scene = new THREE.Scene();
scene.name = 'EDS-G01_Master';
scene.userData = {
  asset: EDS_G01_DESIGN.id,
  revision: EDS_G01_DESIGN.revision,
  author: 'Podium Effet De Sol',
  generationMethod: 'Deterministic original procedural geometry',
  source: 'scripts/generate-eds-g01.mjs',
  units: 'metres',
  dimensions: `${EDS_G01_DESIGN.length}m x ${EDS_G01_DESIGN.width}m; ${EDS_G01_DESIGN.wheelbase}m wheelbase`,
  designNote: EDS_G01_DESIGN.designLanguage.join(', '),
};

const makeMaterial = (name, color, metalness, roughness) => {
  const value = new THREE.MeshStandardMaterial({ color, metalness, roughness });
  value.name = name;
  return value;
};
const materials = {
  carbon: makeMaterial('EDS_MAT_CARBON', '#111820', 0.38, 0.48),
  cockpit: makeMaterial('EDS_MAT_COCKPIT', '#080b0f', 0.18, 0.7),
  mechanical: makeMaterial('EDS_MAT_MECHANICAL', '#303946', 0.72, 0.28),
  body: makeMaterial('EDS_MAT_BODY', '#0a1128', 0.48, 0.2),
  accent: makeMaterial('EDS_MAT_ACCENT', '#00f0ff', 0.44, 0.24),
  tire: makeMaterial('EDS_MAT_TIRE', '#08090b', 0.05, 0.82),
  rim: makeMaterial('EDS_MAT_RIM', '#758294', 0.84, 0.2),
  diffuser: makeMaterial('EDS_MAT_DIFFUSER', '#161c22', 0.58, 0.38),
};

function transformed(geometry, position = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1]) {
  const matrix = new THREE.Matrix4().compose(
    new THREE.Vector3(...position),
    new THREE.Quaternion().setFromEuler(new THREE.Euler(...rotation)),
    new THREE.Vector3(...scale),
  );
  const result = geometry.clone();
  result.applyMatrix4(matrix);
  geometry.dispose();
  return result;
}

const box = (size, position, rotation = [0, 0, 0]) =>
  transformed(new THREE.BoxGeometry(...size), position, rotation);
const cylinder = (radiusTop, radiusBottom, height, segments, position, rotation = [0, 0, 0]) =>
  transformed(
    new THREE.CylinderGeometry(radiusTop, radiusBottom, height, segments),
    position,
    rotation,
  );

function rod(start, end, radius = 0.018, segments = 10) {
  const a = new THREE.Vector3(...start);
  const b = new THREE.Vector3(...end);
  const midpoint = a.clone().add(b).multiplyScalar(0.5);
  const direction = b.clone().sub(a);
  const geometry = new THREE.CylinderGeometry(radius, radius, direction.length(), segments);
  geometry.applyMatrix4(
    new THREE.Matrix4().compose(
      midpoint,
      new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize()),
      new THREE.Vector3(1, 1, 1),
    ),
  );
  return geometry;
}

function loft(sections, radialSegments = 20) {
  const vertices = [];
  const indices = [];
  for (const section of sections) {
    for (let index = 0; index < radialSegments; index += 1) {
      const angle = (index / radialSegments) * Math.PI * 2;
      vertices.push(
        (section.x ?? 0) + Math.cos(angle) * section.width,
        section.y + Math.sin(angle) * section.height,
        section.z,
      );
    }
  }
  for (let ring = 0; ring < sections.length - 1; ring += 1) {
    for (let index = 0; index < radialSegments; index += 1) {
      const next = (index + 1) % radialSegments;
      const a = ring * radialSegments + index;
      const b = ring * radialSegments + next;
      const c = (ring + 1) * radialSegments + next;
      const d = (ring + 1) * radialSegments + index;
      indices.push(a, b, d, b, c, d);
    }
  }
  for (const [ring, reverse] of [
    [0, true],
    [sections.length - 1, false],
  ]) {
    const section = sections[ring];
    const center = vertices.length / 3;
    vertices.push(section.x ?? 0, section.y, section.z);
    for (let index = 0; index < radialSegments; index += 1) {
      const next = (index + 1) % radialSegments;
      const a = ring * radialSegments + index;
      const b = ring * radialSegments + next;
      indices.push(...(reverse ? [center, b, a] : [center, a, b]));
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function planform(points, y, thickness) {
  const shape = new THREE.Shape();
  shape.moveTo(points[0][0], points[0][1]);
  points.slice(1).forEach(([x, z]) => shape.lineTo(x, z));
  shape.closePath();
  const geometry = new THREE.ExtrudeGeometry(shape, { depth: thickness, bevelEnabled: false });
  geometry.rotateX(Math.PI / 2);
  geometry.translate(0, y + thickness / 2, 0);
  return geometry;
}

function addMesh(name, geometries, mat, assembly) {
  const compatible = geometries.map((geometry) => {
    const normalized = geometry.index ? geometry.toNonIndexed() : geometry;
    normalized.deleteAttribute('uv');
    return normalized;
  });
  const geometry = compatible.length === 1 ? compatible[0] : mergeGeometries(compatible, false);
  if (!geometry) throw new Error(`Unable to merge geometry for ${name}`);
  geometry.computeVertexNormals();
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
  const value = new THREE.Mesh(geometry, mat);
  value.name = name;
  value.castShadow = true;
  value.receiveShadow = true;
  value.userData = { assembly };
  scene.add(value);
}

addMesh(
  'EDS_001_Delta_Floor',
  [
    planform(
      [
        [-0.34, -2.05],
        [-0.76, -1.45],
        [-0.82, 0.8],
        [-0.62, 1.82],
        [0, 2.18],
        [0.62, 1.82],
        [0.82, 0.8],
        [0.76, -1.45],
        [0.34, -2.05],
      ],
      0.11,
      0.065,
    ),
  ],
  materials.carbon,
  'Twin Venturi delta floor',
);

const floorFences = [];
for (const side of [-1, 1]) {
  floorFences.push(box([0.035, 0.16, 2.55], [side * 0.7, 0.2, 0.15], [0, side * 0.03, 0]));
  floorFences.push(box([0.028, 0.1, 2.25], [side * 0.5, 0.16, 0.28], [0, side * 0.02, 0]));
}
addMesh('EDS_002_Venturi_Fences', floorFences, materials.diffuser, 'Venturi tunnel fences');

addMesh(
  'EDS_003_Cockpit_Tub',
  [
    loft([
      { z: -0.85, y: 0.47, width: 0.24, height: 0.15 },
      { z: -0.48, y: 0.54, width: 0.34, height: 0.24 },
      { z: 0.02, y: 0.57, width: 0.38, height: 0.27 },
      { z: 0.38, y: 0.54, width: 0.3, height: 0.22 },
    ]),
  ],
  materials.cockpit,
  'Hexagonal cockpit tub',
);

const suspension = [];
for (const side of [-1, 1]) {
  for (const z of [EDS_G01_DESIGN.frontAxleZ, EDS_G01_DESIGN.rearAxleZ]) {
    const outerX = (side * (z < 0 ? EDS_G01_DESIGN.frontTrack : EDS_G01_DESIGN.rearTrack)) / 2;
    suspension.push(rod([side * 0.38, 0.31, z - 0.2], [outerX, 0.36, z], 0.018));
    suspension.push(rod([side * 0.4, 0.34, z + 0.2], [outerX, 0.36, z], 0.018));
    suspension.push(rod([side * 0.36, 0.54, z], [outerX, 0.36, z], 0.015));
  }
  suspension.push(rod([side * 0.36, 0.66, -0.42], [side * 0.72, 0.66, -0.58], 0.014));
  suspension.push(
    transformed(
      new THREE.OctahedronGeometry(0.1, 0),
      [side * 0.78, 0.66, -0.61],
      [0, 0, Math.PI / 4],
      [1.25, 0.55, 0.75],
    ),
  );
}
addMesh(
  'EDS_004_Suspension_Mirrors',
  suspension,
  materials.mechanical,
  'Triangulated suspension and diamond mirrors',
);

const bodywork = [
  loft(
    [
      { z: -0.45, y: 0.42, width: 0.23, height: 0.2 },
      { z: 0.08, y: 0.52, width: 0.42, height: 0.31 },
      { z: 0.82, y: 0.56, width: 0.36, height: 0.34 },
      { z: 1.48, y: 0.44, width: 0.2, height: 0.22 },
      { z: 1.82, y: 0.36, width: 0.1, height: 0.11 },
    ],
    24,
  ),
];
for (const side of [-1, 1]) {
  bodywork.push(
    loft(
      [
        { z: -0.58, x: side * 0.43, y: 0.42, width: 0.2, height: 0.16 },
        { z: -0.05, x: side * 0.5, y: 0.45, width: 0.3, height: 0.25 },
        { z: 0.48, x: side * 0.46, y: 0.43, width: 0.28, height: 0.22 },
        { z: 1.2, x: side * 0.34, y: 0.37, width: 0.18, height: 0.13 },
      ],
      20,
    ),
  );
}
addMesh(
  'EDS_005_Teardrop_Bodywork',
  bodywork,
  materials.body,
  'Compact teardrop sidepods and engine spine',
);

const cooling = [];
for (const side of [-1, 1]) {
  cooling.push(
    transformed(
      new THREE.TorusGeometry(0.2, 0.035, 8, 20, Math.PI),
      [side * 0.55, 0.53, -0.25],
      [0, (side * Math.PI) / 2, 0],
      [1, 1.35, 1],
    ),
  );
  for (let index = 0; index < 4; index += 1)
    cooling.push(
      box([0.22, 0.018, 0.028], [side * 0.49, 0.72, 0.33 + index * 0.09], [0, side * 0.18, -0.08]),
    );
}
addMesh(
  'EDS_006_Cooling_Channels',
  cooling,
  materials.accent,
  'Sidepod intake lips and cooling louvres',
);

const frontWing = [];
for (let index = 0; index < 4; index += 1) {
  const width = 1.92 - index * 0.12;
  frontWing.push(
    planform(
      [
        [-width / 2, -2.52 + index * 0.1],
        [width / 2, -2.52 + index * 0.1],
        [width * 0.44, -2.34 + index * 0.11],
        [-width * 0.44, -2.34 + index * 0.11],
      ],
      0.13 + index * 0.045,
      0.025,
    ),
  );
}
frontWing.push(box([0.045, 0.37, 0.58], [-0.98, 0.28, -2.35], [0.04, 0.08, 0]));
frontWing.push(box([0.045, 0.37, 0.58], [0.98, 0.28, -2.35], [0.04, -0.08, 0]));
addMesh('EDS_007_Front_Wing', frontWing, materials.accent, 'Four-plane swept front wing');

const rearWing = [
  planform(
    [
      [-0.72, 2.03],
      [0.72, 2.03],
      [0.67, 2.31],
      [-0.67, 2.31],
    ],
    0.78,
    0.055,
  ),
  planform(
    [
      [-0.67, 2.06],
      [0.67, 2.06],
      [0.61, 2.25],
      [-0.61, 2.25],
    ],
    0.99,
    0.045,
  ),
  box([0.045, 0.61, 0.5], [-0.75, 0.78, 2.15], [0, 0.03, 0]),
  box([0.045, 0.61, 0.5], [0.75, 0.78, 2.15], [0, -0.03, 0]),
  rod([-0.55, 0.73, 2.02], [-0.28, 0.39, 1.72], 0.025),
  rod([0.55, 0.73, 2.02], [0.28, 0.39, 1.72], 0.025),
];
addMesh(
  'EDS_008_Bridge_Rear_Wing_DRS',
  rearWing,
  materials.accent,
  'Bridge rear wing and DRS flap',
);

const tires = [];
const rims = [];
const brakes = [];
for (const side of [-1, 1]) {
  for (const z of [EDS_G01_DESIGN.frontAxleZ, EDS_G01_DESIGN.rearAxleZ]) {
    const rear = z > 0;
    const radius = rear ? EDS_G01_DESIGN.rearWheelRadius : EDS_G01_DESIGN.frontWheelRadius;
    const x = (side * (rear ? EDS_G01_DESIGN.rearTrack : EDS_G01_DESIGN.frontTrack)) / 2;
    tires.push(
      transformed(
        new THREE.TorusGeometry(radius - 0.08, 0.08, 16, 36),
        [x, radius, z],
        [0, Math.PI / 2, 0],
      ),
    );
    rims.push(
      cylinder(
        radius * 0.55,
        radius * 0.55,
        rear ? 0.3 : 0.27,
        32,
        [x, radius, z],
        [0, 0, Math.PI / 2],
      ),
    );
    brakes.push(
      cylinder(radius * 0.32, radius * 0.32, 0.31, 24, [x, radius, z], [0, 0, Math.PI / 2]),
    );
  }
}
addMesh('EDS_009_Unbranded_Slick_Tires', tires, materials.tire, 'Unbranded slick tires');
addMesh('EDS_010_Forged_Rims', rims, materials.rim, 'Original aero rims');
addMesh('EDS_011_Carbon_Brakes', brakes, materials.mechanical, 'Carbon brake discs');

addMesh(
  'EDS_012_Split_Keel_Nose',
  [
    loft(
      [
        { z: -2.42, y: 0.3, width: 0.07, height: 0.055 },
        { z: -2.0, y: 0.34, width: 0.12, height: 0.09 },
        { z: -1.42, y: 0.4, width: 0.2, height: 0.14 },
        { z: -0.82, y: 0.46, width: 0.31, height: 0.21 },
        { z: -0.45, y: 0.48, width: 0.34, height: 0.22 },
      ],
      12,
    ),
    rod([-0.08, 0.29, -2.43], [-0.13, 0.2, -2.12], 0.028, 8),
    rod([0.08, 0.29, -2.43], [0.13, 0.2, -2.12], 0.028, 8),
  ],
  materials.body,
  'Faceted spear monocoque and split keel',
);

const haloCurve = new THREE.CatmullRomCurve3([
  new THREE.Vector3(-0.32, 0.64, -0.5),
  new THREE.Vector3(-0.4, 0.83, -0.27),
  new THREE.Vector3(-0.26, 0.96, -0.02),
  new THREE.Vector3(0, 1.0, 0.08),
  new THREE.Vector3(0.26, 0.96, -0.02),
  new THREE.Vector3(0.4, 0.83, -0.27),
  new THREE.Vector3(0.32, 0.64, -0.5),
]);
addMesh(
  'EDS_013_Swept_Halo',
  [
    new THREE.TubeGeometry(haloCurve, 40, 0.028, 10, false),
    rod([0, 0.7, -0.5], [0, 0.99, 0.07], 0.029),
    rod([-0.32, 0.64, -0.5], [-0.28, 0.54, -0.42], 0.032),
    rod([0.32, 0.64, -0.5], [0.28, 0.54, -0.42], 0.032),
  ],
  materials.accent,
  'Swept halo loop and central blade',
);

const diffuser = [
  planform(
    [
      [-0.62, 1.35],
      [0.62, 1.35],
      [0.72, 2.18],
      [-0.72, 2.18],
    ],
    0.16,
    0.07,
  ),
];
for (const x of [-0.56, -0.28, 0, 0.28, 0.56])
  diffuser.push(box([0.03, 0.3, 0.72], [x, 0.3, 1.82], [0.18, 0, 0]));
diffuser.push(box([0.15, 0.09, 0.11], [0, 0.42, 2.2]));
addMesh(
  'EDS_014_Stepped_Diffuser',
  diffuser,
  materials.diffuser,
  'Stepped diffuser, extraction strakes and rain light',
);

const exporter = new GLTFExporter();
const binary = await new Promise((resolve, reject) =>
  exporter.parse(scene, resolve, reject, {
    binary: true,
    onlyVisible: true,
    truncateDrawRange: true,
    includeCustomExtensions: false,
  }),
);
await fs.mkdir(path.dirname(OUTPUT), { recursive: true });
await fs.writeFile(OUTPUT, Buffer.from(binary));
console.log(
  `Generated ${path.relative(process.cwd(), OUTPUT)} (${Buffer.byteLength(binary)} bytes, ${scene.children.length} assemblies, revision ${EDS_G01_DESIGN.revision})`,
);
