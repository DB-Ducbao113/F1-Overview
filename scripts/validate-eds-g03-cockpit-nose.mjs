import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve('docs/commercialization/r3/blender-authoring/cockpit-nose-redesign');
const manifest = JSON.parse(await fs.readFile(path.join(root, 'manifest.json'), 'utf8'));
const report = {
  scope: 'Independent Node GLB and locked-registry validation',
  variants: {},
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
  return JSON.parse(chunks.find((chunk) => chunk.type === 0x4e4f534a).data.toString('utf8'));
}

for (const [slug, authored] of Object.entries(manifest.variants)) {
  const file = path.resolve(authored.glb);
  const bytes = await fs.readFile(file);
  const json = parseGlb(bytes);
  const errors = [];
  let triangles = 0;
  for (const mesh of json.meshes ?? []) {
    for (const primitive of mesh.primitives ?? []) {
      if (primitive.attributes?.POSITION === undefined)
        errors.push(`${mesh.name}: missing POSITION`);
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
  for (const [key, target] of Object.entries({ length: 5.05, width: 2, height: 1.18 })) {
    if (Math.abs(authored.dimensions[key] - target) > 0.00001)
      errors.push(`${key} ${authored.dimensions[key]} differs from ${target}`);
  }
  if (Math.abs(authored.wheelbase - 3.6) > 0.00001) errors.push('wheelbase differs from 3.60 m');
  const targetPercent = slug === 'n30' ? 30 : 20;
  if (Math.abs(authored.proportions.Apercent - targetPercent) > 0.00001)
    errors.push(`A ratio differs from ${targetPercent}%`);
  report.variants[slug] = {
    file: path.relative(process.cwd(), file).replaceAll('\\', '/'),
    bytes: bytes.length,
    sha256: hash,
    gltfVersion: json.asset?.version,
    scenes: json.scenes?.length ?? 0,
    nodes: json.nodes?.length ?? 0,
    meshes: json.meshes?.length ?? 0,
    materials: json.materials?.length ?? 0,
    indexedTriangles: triangles,
    measuredDimensions: authored.dimensions,
    wheelbase: authored.wheelbase,
    proportions: authored.proportions,
    errors,
  };
  report.errors.push(...errors.map((error) => `${slug}: ${error}`));
}

await fs.writeFile(path.join(root, 'validation.json'), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
if (report.errors.length) process.exitCode = 1;
