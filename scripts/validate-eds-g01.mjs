import fs from 'node:fs/promises';
import path from 'node:path';

const modelPath = path.resolve(process.argv[2] || 'public/models/eds-g01.glb');
const data = await fs.readFile(modelPath);
const errors = [];
const warnings = [];

if (data.toString('ascii', 0, 4) !== 'glTF') errors.push('Invalid GLB magic header.');
if (data.readUInt32LE(4) !== 2)
  errors.push(`Expected glTF 2.0, found version ${data.readUInt32LE(4)}.`);
if (data.readUInt32LE(8) !== data.length)
  errors.push('GLB header byte length does not match file size.');

const jsonLength = data.readUInt32LE(12);
const jsonType = data.toString('ascii', 16, 20);
if (jsonType !== 'JSON') errors.push(`First GLB chunk must be JSON, found ${jsonType}.`);
const gltf = JSON.parse(data.toString('utf8', 20, 20 + jsonLength).trim());
const expectedNames = Array.from(
  { length: 14 },
  (_, index) => `EDS_${String(index + 1).padStart(3, '0')}_`,
);
const meshNodes = (gltf.nodes || []).filter((node) => Number.isInteger(node.mesh));
const meshNames = meshNodes.map((node) => node.name || '');

for (const prefix of expectedNames) {
  if (!meshNames.some((name) => name.startsWith(prefix)))
    errors.push(`Missing assembly prefix ${prefix}.`);
}

let primitiveCount = 0;
let triangleCount = 0;
for (const mesh of gltf.meshes || []) {
  for (const primitive of mesh.primitives || []) {
    primitiveCount += 1;
    const indexAccessor = gltf.accessors?.[primitive.indices];
    const positionAccessor = gltf.accessors?.[primitive.attributes?.POSITION];
    const elementCount = indexAccessor?.count ?? positionAccessor?.count ?? 0;
    triangleCount += Math.floor(elementCount / 3);
  }
}

if (meshNodes.length !== 14) errors.push(`Expected 14 mesh nodes, found ${meshNodes.length}.`);
if (primitiveCount > 18)
  errors.push(`Draw-call budget exceeded: ${primitiveCount} primitives > 18.`);
if (triangleCount > 120_000) errors.push(`Triangle ceiling exceeded: ${triangleCount} > 120000.`);
if (data.length > 2 * 1024 * 1024)
  errors.push(`File-size ceiling exceeded: ${data.length} bytes > 2 MiB.`);

const report = {
  asset: path.relative(process.cwd(), modelPath),
  gltfVersion: gltf.asset?.version,
  generator: gltf.asset?.generator,
  bytes: data.length,
  meshNodes: meshNodes.length,
  primitives: primitiveCount,
  estimatedDrawCalls: primitiveCount,
  triangles: triangleCount,
  materials: gltf.materials?.length || 0,
  errors,
  warnings,
};

console.log(JSON.stringify(report, null, 2));
if (errors.length > 0) process.exitCode = 1;
