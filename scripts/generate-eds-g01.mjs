import fs from 'node:fs/promises';
import path from 'node:path';
import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

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
  asset: 'EDS-G01',
  author: 'Podium Effet De Sol',
  generationMethod: 'Original procedural geometry generated from scripts/generate-eds-g01.mjs',
  units: 'metres',
  designNote:
    'Faceted split-keel nose, delta floor shoulders, compact teardrop sidepods and bridge rear wing were authored for EDS-G01 and do not trace the legacy C42 mesh.',
};

const material = (name, color, metalness, roughness) => {
  const value = new THREE.MeshStandardMaterial({ color, metalness, roughness });
  value.name = name;
  return value;
};

const materials = {
  floor: material('EDS_MAT_FLOOR', '#111820', 0.35, 0.52),
  cockpit: material('EDS_MAT_COCKPIT', '#171b20', 0.2, 0.68),
  suspension: material('EDS_MAT_SUSPENSION', '#242b33', 0.62, 0.34),
  bodywork: material('EDS_MAT_BODYWORK', '#0a1128', 0.45, 0.22),
  wings: material('EDS_MAT_WINGS', '#0b1117', 0.48, 0.3),
  wheels: material('EDS_MAT_WHEELS', '#101216', 0.28, 0.72),
  nose: material('EDS_MAT_NOSE', '#0a1128', 0.45, 0.22),
  halo: material('EDS_MAT_HALO', '#94a3b8', 0.75, 0.25),
  diffuser: material('EDS_MAT_DIFFUSER', '#161c22', 0.58, 0.4),
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

function box(size, position, rotation = [0, 0, 0]) {
  return transformed(new THREE.BoxGeometry(...size), position, rotation);
}

function cylinder(radiusTop, radiusBottom, height, segments, position, rotation = [0, 0, 0]) {
  return transformed(
    new THREE.CylinderGeometry(radiusTop, radiusBottom, height, segments, 1, false),
    position,
    rotation,
  );
}

function ellipsoid(radius, position, scale, segments = 24) {
  return transformed(
    new THREE.SphereGeometry(radius, segments, Math.max(10, segments / 2)),
    position,
    [0, 0, 0],
    scale,
  );
}

function rod(start, end, radius = 0.018, segments = 10) {
  const a = new THREE.Vector3(...start);
  const b = new THREE.Vector3(...end);
  const midpoint = a.clone().add(b).multiplyScalar(0.5);
  const direction = b.clone().sub(a);
  const geometry = new THREE.CylinderGeometry(radius, radius, direction.length(), segments);
  const quaternion = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    direction.clone().normalize(),
  );
  const matrix = new THREE.Matrix4().compose(midpoint, quaternion, new THREE.Vector3(1, 1, 1));
  geometry.applyMatrix4(matrix);
  return geometry;
}

function mesh(name, geometries, mat, metadata) {
  const geometry = mergeGeometries(geometries, false);
  if (!geometry) throw new Error(`Unable to merge geometry for ${name}`);
  geometry.computeVertexNormals();
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
  const value = new THREE.Mesh(geometry, mat);
  value.name = name;
  value.castShadow = true;
  value.receiveShadow = true;
  value.userData = metadata;
  scene.add(value);
}

// 001 — delta floor with twin Venturi shoulders and four edge fences.
mesh(
  'EDS_001_Floor_Underfloor',
  [
    box([1.18, 0.08, 3.35], [0, 0.13, 0.05]),
    box([0.16, 0.14, 2.65], [-0.66, 0.18, 0.12], [0, 0, -0.035]),
    box([0.16, 0.14, 2.65], [0.66, 0.18, 0.12], [0, 0, 0.035]),
    box([0.07, 0.18, 2.5], [-0.47, 0.16, 0.18]),
    box([0.07, 0.18, 2.5], [0.47, 0.16, 0.18]),
    box([0.1, 0.04, 3.5], [0, 0.075, 0.08]),
  ],
  materials.floor,
  { primitiveId: '001', assembly: 'Twin Venturi floor and delta edge fences' },
);

// 002 — compact cockpit tub and original hexagonal steering display.
mesh(
  'EDS_002_Cockpit_Interior',
  [
    ellipsoid(0.36, [0, 0.49, -0.34], [0.86, 0.64, 1.32], 20),
    box([0.34, 0.08, 0.18], [0, 0.65, -0.72], [-0.18, 0, 0]),
    box([0.12, 0.28, 0.06], [0, 0.54, -0.43], [-0.34, 0, 0]),
  ],
  materials.cockpit,
  { primitiveId: '002', assembly: 'Cockpit tub and telemetry controls' },
);

// 003 — triangulated wishbones and diamond mirrors.
const suspension = [];
for (const side of [-1, 1]) {
  for (const z of [-1.55, 1.45]) {
    suspension.push(rod([side * 0.38, 0.34, z - 0.18], [side * 0.88, 0.31, z], 0.018));
    suspension.push(rod([side * 0.38, 0.34, z + 0.18], [side * 0.88, 0.31, z], 0.018));
    suspension.push(rod([side * 0.42, 0.55, z], [side * 0.88, 0.31, z], 0.016));
  }
  suspension.push(rod([side * 0.38, 0.62, -0.35], [side * 0.72, 0.63, -0.48], 0.014));
  suspension.push(box([0.18, 0.09, 0.12], [side * 0.78, 0.64, -0.5], [0, side * 0.22, 0]));
}
mesh('EDS_003_Suspension_Mirrors', suspension, materials.suspension, {
  primitiveId: '003',
  assembly: 'Triangulated suspension and diamond mirrors',
});

// 004 — teardrop sidepods, faceted engine spine and oval airbox.
mesh(
  'EDS_004_Bodywork_Sidepods',
  [
    ellipsoid(0.55, [-0.48, 0.43, 0.15], [0.72, 0.5, 1.5], 24),
    ellipsoid(0.55, [0.48, 0.43, 0.15], [0.72, 0.5, 1.5], 24),
    ellipsoid(0.46, [0, 0.52, 0.48], [0.72, 0.82, 1.75], 24),
    cylinder(0.2, 0.25, 0.22, 12, [0, 0.88, -0.05], [Math.PI / 2, 0, 0]),
    box([0.06, 0.38, 1.12], [0, 0.69, 0.83], [-0.08, 0, 0]),
  ],
  materials.bodywork,
  { primitiveId: '004', assembly: 'Compact teardrop sidepods and dorsal spine' },
);

// 005 — four front elements and a bridge-mounted rear wing.
const wings = [];
for (let index = 0; index < 4; index += 1) {
  wings.push(
    box(
      [1.86 - index * 0.1, 0.035, 0.16],
      [0, 0.16 + index * 0.055, -2.25 + index * 0.12],
      [-0.08 - index * 0.025, 0, 0],
    ),
  );
}
wings.push(box([0.05, 0.36, 0.58], [-0.94, 0.28, -2.08], [0, 0.08, 0]));
wings.push(box([0.05, 0.36, 0.58], [0.94, 0.28, -2.08], [0, -0.08, 0]));
wings.push(box([1.42, 0.1, 0.28], [0, 0.83, 2.02], [0.1, 0, 0]));
wings.push(box([1.34, 0.07, 0.2], [0, 1.01, 2.06], [-0.12, 0, 0]));
wings.push(box([0.06, 0.58, 0.48], [-0.74, 0.78, 2.0]));
wings.push(box([0.06, 0.58, 0.48], [0.74, 0.78, 2.0]));
wings.push(rod([-0.55, 0.7, 1.88], [-0.32, 0.38, 1.65], 0.025));
wings.push(rod([0.55, 0.7, 1.88], [0.32, 0.38, 1.65], 0.025));
mesh('EDS_005_Wings_Assembly', wings, materials.wings, {
  primitiveId: '005',
  assembly: 'Four-plane front wing and bridge rear wing',
});

// 006 — unbranded slicks with flush aero-disc centres.
const wheels = [];
for (const x of [-0.88, 0.88]) {
  for (const z of [-1.55, 1.45]) {
    const rear = z > 0;
    const radius = rear ? 0.37 : 0.34;
    const width = rear ? 0.29 : 0.25;
    wheels.push(
      transformed(
        new THREE.TorusGeometry(radius - 0.075, 0.075, 12, 28),
        [x, radius, z],
        [0, Math.PI / 2, 0],
      ),
    );
    wheels.push(
      cylinder(radius * 0.63, radius * 0.63, width, 24, [x, radius, z], [0, 0, Math.PI / 2]),
    );
  }
}
mesh('EDS_006_Wheels_Tires', wheels, materials.wheels, {
  primitiveId: '006',
  assembly: 'Unbranded slick tires and flush aero discs',
});

// 007 — faceted spear nose with a split-keel terminal unique to EDS-G01.
mesh(
  'EDS_007_Monocoque_Nose',
  [
    cylinder(0.12, 0.32, 1.7, 6, [0, 0.42, -1.22], [Math.PI / 2, 0, 0]),
    ellipsoid(0.38, [0, 0.45, -0.42], [0.84, 0.74, 1.2], 20),
    cylinder(0.035, 0.09, 0.58, 5, [-0.09, 0.29, -2.08], [Math.PI / 2, 0, 0.04]),
    cylinder(0.035, 0.09, 0.58, 5, [0.09, 0.29, -2.08], [Math.PI / 2, 0, -0.04]),
  ],
  materials.nose,
  { primitiveId: '007', assembly: 'Faceted spear monocoque and split-keel nose' },
);

// 008 — swept halo loop built from a custom closed path plus three mounts.
const haloCurve = new THREE.CatmullRomCurve3([
  new THREE.Vector3(-0.32, 0.66, -0.48),
  new THREE.Vector3(-0.38, 0.82, -0.27),
  new THREE.Vector3(-0.26, 0.93, -0.06),
  new THREE.Vector3(0, 0.97, 0.02),
  new THREE.Vector3(0.26, 0.93, -0.06),
  new THREE.Vector3(0.38, 0.82, -0.27),
  new THREE.Vector3(0.32, 0.66, -0.48),
]);
mesh(
  'EDS_008_Halo_Structure',
  [
    new THREE.TubeGeometry(haloCurve, 32, 0.027, 10, false),
    rod([0, 0.69, -0.48], [0, 0.96, 0.01], 0.028),
    rod([-0.32, 0.66, -0.48], [-0.28, 0.55, -0.42], 0.032),
    rod([0.32, 0.66, -0.48], [0.28, 0.55, -0.42], 0.032),
  ],
  materials.halo,
  { primitiveId: '008', assembly: 'Swept halo loop and central blade' },
);

// 009 — stepped diffuser, five strakes and a compact rain-light housing.
const diffuser = [box([1.1, 0.08, 0.75], [0, 0.2, 1.7], [0.22, 0, 0])];
for (const x of [-0.5, -0.25, 0, 0.25, 0.5]) {
  diffuser.push(box([0.035, 0.28, 0.68], [x, 0.29, 1.78], [0.2, 0, 0]));
}
diffuser.push(box([0.16, 0.11, 0.12], [0, 0.38, 2.12]));
diffuser.push(cylinder(0.06, 0.07, 0.18, 12, [0, 0.48, 1.76], [Math.PI / 2, 0, 0]));
mesh('EDS_009_Diffuser_RainLight', diffuser, materials.diffuser, {
  primitiveId: '009',
  assembly: 'Stepped diffuser, extraction strakes and rain light housing',
});

const exporter = new GLTFExporter();
const binary = await new Promise((resolve, reject) => {
  exporter.parse(scene, resolve, reject, {
    binary: true,
    onlyVisible: true,
    truncateDrawRange: true,
    includeCustomExtensions: false,
  });
});

await fs.mkdir(path.dirname(OUTPUT), { recursive: true });
await fs.writeFile(OUTPUT, Buffer.from(binary));
console.log(
  `Generated ${path.relative(process.cwd(), OUTPUT)} (${Buffer.byteLength(binary)} bytes)`,
);
