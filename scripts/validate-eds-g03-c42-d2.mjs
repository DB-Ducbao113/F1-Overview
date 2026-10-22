import fs from 'node:fs/promises';
import path from 'node:path';
import { Box3, Vector3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

globalThis.ProgressEvent ??= class ProgressEvent {
  constructor(type, init = {}) {
    this.type = type;
    Object.assign(this, init);
  }
};

import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const source = path.join(
  ROOT,
  'docs/commercialization/r3/blender-authoring/c42-fidelity-d2/eds-g03-c42-fidelity-d2.glb',
);
const output = path.join(
  ROOT,
  'docs/commercialization/r3/blender-authoring/c42-fidelity-d2/threejs-validation.json',
);

const bytes = await fs.readFile(source);
const buffer = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
const gltf = await new GLTFLoader().parseAsync(buffer, '');
gltf.scene.updateMatrixWorld(true);

const bounds = new Box3().setFromObject(gltf.scene);
const size = bounds.getSize(new Vector3());

let meshes = 0;
let primitives = 0;
let triangles = 0;
const materials = new Set();
const textures = new Set();
let invalid = 0;

gltf.scene.traverse((node) => {
  if (!node.isMesh) return;
  meshes += 1;
  primitives += Array.isArray(node.material) ? node.material.length : 1;
  const count = node.geometry.index?.count ?? node.geometry.attributes.position.count;
  triangles += count / 3;
  const list = Array.isArray(node.material) ? node.material : [node.material];
  for (const material of list) {
    materials.add(material.uuid);
    for (const key of ['map', 'normalMap', 'roughnessMap', 'metalnessMap']) {
      if (material[key]) textures.add(material[key].uuid);
    }
  }
  const positions = node.geometry.attributes.position.array;
  for (const value of positions) {
    if (!Number.isFinite(value)) invalid += 1;
  }
});

const expected = { x: 2.0, y: 1.18, z: 5.05 };
const report = {
  source: path.relative(process.cwd(), source).replaceAll('\\', '/'),
  bytes: bytes.length,
  meshes,
  primitives,
  triangles,
  materials: materials.size,
  textures: textures.size,
  nonFinitePositionValues: invalid,
  bounds: {
    min: bounds.min.toArray(),
    max: bounds.max.toArray(),
    size: size.toArray(),
  },
  dimensionalChecks: {
    length: Math.abs(size.z - expected.z) <= 0.01,
    width: size.x <= expected.x + 0.005,
    heightCeiling: size.y <= expected.y + 0.005,
    groundContact: Math.abs(bounds.min.y) <= 0.005,
  },
  pass:
    invalid === 0 &&
    Math.abs(size.z - expected.z) <= 0.01 &&
    size.x <= expected.x + 0.005 &&
    size.y <= expected.y + 0.005,
};

await fs.writeFile(output, JSON.stringify(report, null, 2) + '\n', 'utf-8');
console.log('THREEJS_D2_VALIDATION=' + JSON.stringify(report));
if (!report.pass) process.exit(1);
