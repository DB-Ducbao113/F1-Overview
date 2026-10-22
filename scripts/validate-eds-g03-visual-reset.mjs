import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve('docs/commercialization/r3/blender-authoring/visual-design-reset');
const manifest = JSON.parse(await fs.readFile(path.join(root, 'manifest.json'), 'utf8'));
const expected = manifest.locks;
const report = {
  scope: 'Independent Node GLB structure and registry validation',
  concepts: {},
  errors: [],
};

function parseGlb(bytes) {
  if (bytes.toString('ascii', 0, 4) !== 'glTF') throw new Error('invalid GLB magic');
  if (bytes.readUInt32LE(4) !== 2) throw new Error('GLB version is not 2');
  if (bytes.readUInt32LE(8) !== bytes.length) throw new Error('GLB declared length mismatch');
  let offset = 12;
  const chunks = [];
  while (offset < bytes.length) {
    const length = bytes.readUInt32LE(offset);
    const type = bytes.readUInt32LE(offset + 4);
    offset += 8;
    chunks.push({ type, data: bytes.subarray(offset, offset + length) });
    offset += length;
  }
  const json = JSON.parse(chunks.find((chunk) => chunk.type === 0x4e4f534a).data.toString('utf8'));
  return json;
}

for (const [slug, authored] of Object.entries(manifest.concepts)) {
  const file = path.join(root, `eds-g03-${slug}.glb`);
  const bytes = await fs.readFile(file);
  const json = parseGlb(bytes);
  const errors = [];
  const positions = [];
  let triangles = 0;
  for (const mesh of json.meshes ?? []) {
    for (const primitive of mesh.primitives ?? []) {
      if (primitive.attributes?.POSITION === undefined)
        errors.push(`${mesh.name}: missing POSITION`);
      else positions.push(json.accessors[primitive.attributes.POSITION]);
      if (primitive.indices !== undefined) triangles += json.accessors[primitive.indices].count / 3;
    }
  }
  for (const accessor of json.accessors ?? []) {
    for (const key of ['min', 'max']) {
      if (accessor[key]?.some((value) => !Number.isFinite(value))) errors.push(`non-finite ${key}`);
    }
  }
  const hash = crypto.createHash('sha256').update(bytes).digest('hex');
  if (hash !== authored.sha256) errors.push('SHA-256 differs from authoring manifest');
  for (const [key, target] of Object.entries({
    length: expected.length,
    width: expected.width,
    height: expected.height,
  })) {
    const actual = authored.dimensions[key];
    if (Math.abs(actual - target) > 0.00001) errors.push(`${key} ${actual} differs from ${target}`);
  }
  if (authored.wheelbase !== expected.wheelbase)
    errors.push('wheelbase differs from locked registry');
  report.concepts[slug] = {
    file: path.relative(process.cwd(), file).replaceAll('\\', '/'),
    bytes: bytes.length,
    sha256: hash,
    assetVersion: json.asset?.version,
    scenes: json.scenes?.length ?? 0,
    nodes: json.nodes?.length ?? 0,
    meshes: json.meshes?.length ?? 0,
    materials: json.materials?.length ?? 0,
    textures: json.textures?.length ?? 0,
    indexedTriangles: triangles,
    measuredDimensions: authored.dimensions,
    wheelbase: authored.wheelbase,
    errors,
  };
  report.errors.push(...errors.map((error) => `${slug}: ${error}`));
}

await fs.writeFile(path.join(root, 'validation.json'), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
if (report.errors.length) process.exitCode = 1;
