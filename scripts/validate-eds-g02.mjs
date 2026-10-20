import fs from 'node:fs/promises';
import path from 'node:path';

const filename = path.resolve(process.argv[2] || 'public/models/eds-g02.glb');
const bytes = await fs.readFile(filename);
const errors = [];
const warnings = [];
if (bytes.toString('ascii', 0, 4) !== 'glTF') errors.push('Invalid GLB header');
if (bytes.readUInt32LE(4) !== 2) errors.push('Expected GLB version 2');
if (bytes.readUInt32LE(8) !== bytes.length) errors.push('GLB length mismatch');
const jsonLength = bytes.readUInt32LE(12);
if (bytes.toString('ascii', 16, 20) !== 'JSON') errors.push('Missing JSON chunk');
const gltf = JSON.parse(bytes.toString('utf8', 20, 20 + jsonLength));
const binChunkOffset = 20 + jsonLength;
if (bytes.toString('ascii', binChunkOffset + 4, binChunkOffset + 7) !== 'BIN')
  errors.push('Missing binary chunk');
const binaryOffset = binChunkOffset + 8;
const data = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
const componentBytes = { 5121: 1, 5123: 2, 5125: 4, 5126: 4 };
const componentCount = { SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4 };
function accessor(index) {
  const def = gltf.accessors[index];
  const view = gltf.bufferViews[def.bufferView];
  const count = componentCount[def.type];
  const offset = binaryOffset + (view.byteOffset ?? 0) + (def.byteOffset ?? 0);
  const stride = view.byteStride ?? count * componentBytes[def.componentType];
  function read(i, component = 0) {
    const byte = offset + i * stride + component * componentBytes[def.componentType];
    switch (def.componentType) {
      case 5121:
        return data.getUint8(byte);
      case 5123:
        return data.getUint16(byte, true);
      case 5125:
        return data.getUint32(byte, true);
      case 5126:
        return data.getFloat32(byte, true);
      default:
        throw new Error(`Unsupported component type ${def.componentType}`);
    }
  }
  return { def, read };
}

const required = ['body', 'accent', 'carbon', 'tire', 'rim', 'metal', 'cockpit', 'intake', 'seam'];
const names = (gltf.nodes ?? [])
  .filter((node) => Number.isInteger(node.mesh))
  .map((node) => node.name);
for (const category of required)
  if (!names.includes(`EDS_G02_${category.toUpperCase()}`)) errors.push(`Missing ${category} mesh`);
let triangles = 0;
let degenerateTriangles = 0;
let opposedNormals = 0;
let invalidNormals = 0;
let vertices = 0;
const meshDiagnostics = [];
const bounds = { min: [Infinity, Infinity, Infinity], max: [-Infinity, -Infinity, -Infinity] };
for (const [meshIndex, mesh] of (gltf.meshes ?? []).entries()) {
  for (const primitive of mesh.primitives ?? []) {
    let meshDegenerate = 0;
    let meshOpposed = 0;
    const opposedSamples = [];
    const positions = accessor(primitive.attributes.POSITION);
    const normals = accessor(primitive.attributes.NORMAL);
    const indices = accessor(primitive.indices);
    vertices += positions.def.count;
    triangles += indices.def.count / 3;
    for (let i = 0; i < positions.def.count; i += 1) {
      for (let axis = 0; axis < 3; axis += 1) {
        const value = positions.read(i, axis);
        bounds.min[axis] = Math.min(bounds.min[axis], value);
        bounds.max[axis] = Math.max(bounds.max[axis], value);
        const normal = normals.read(i, axis);
        if (!Number.isFinite(value) || !Number.isFinite(normal)) invalidNormals += 1;
      }
      const length = Math.hypot(normals.read(i), normals.read(i, 1), normals.read(i, 2));
      if (length < 0.8 || length > 1.2) invalidNormals += 1;
    }
    for (let i = 0; i < indices.def.count; i += 3) {
      const ids = [indices.read(i), indices.read(i + 1), indices.read(i + 2)];
      const p = ids.map((id) => [positions.read(id), positions.read(id, 1), positions.read(id, 2)]);
      const a = p[1].map((value, axis) => value - p[0][axis]);
      const b = p[2].map((value, axis) => value - p[0][axis]);
      const cross = [
        a[1] * b[2] - a[2] * b[1],
        a[2] * b[0] - a[0] * b[2],
        a[0] * b[1] - a[1] * b[0],
      ];
      const length = Math.hypot(...cross);
      if (length < 1e-9) {
        degenerateTriangles += 1;
        meshDegenerate += 1;
        continue;
      }
      const normal = [0, 1, 2].map((axis) =>
        ids.reduce((sum, id) => sum + normals.read(id, axis), 0),
      );
      const dot = cross.reduce((sum, value, axis) => sum + value * normal[axis], 0);
      if (dot < -0.1 * length) {
        opposedNormals += 1;
        meshOpposed += 1;
        if (opposedSamples.length < 6)
          opposedSamples.push({
            points: p.map((point) => point.map((value) => Math.round(value * 1000) / 1000)),
            cosine: Math.round((dot / (length * Math.hypot(...normal))) * 1000) / 1000,
          });
      }
    }
    meshDiagnostics.push({
      name: names[meshIndex],
      degenerate: meshDegenerate,
      opposed: meshOpposed,
      opposedSamples,
    });
  }
}
if (names.length !== required.length)
  errors.push(`Expected ${required.length} grouped meshes, found ${names.length}`);
if (gltf.materials?.length !== required.length) errors.push('Material count mismatch');
if ((gltf.images?.length ?? 0) !== 0) errors.push('Unexpected external/image texture dependency');
if (triangles > 120_000) errors.push(`Geometry review ceiling exceeded: ${triangles}`);
if (bytes.length > 2 * 1024 * 1024)
  errors.push(`GLB review transfer ceiling exceeded: ${bytes.length}`);
if (invalidNormals > 0) errors.push(`${invalidNormals} invalid position/normal values`);
if (degenerateTriangles > 0) warnings.push(`${degenerateTriangles} zero-area triangles`);
if (opposedNormals > 0) warnings.push(`${opposedNormals} triangles with opposed averaged normals`);
if (Math.abs(bounds.max[0] + bounds.min[0]) > 0.08)
  warnings.push('Lateral bounds are unexpectedly asymmetric');
const report = {
  file: path.relative(process.cwd(), filename),
  bytes: bytes.length,
  nodes: names.length,
  drawCalls: (gltf.meshes ?? []).reduce((count, mesh) => count + mesh.primitives.length, 0),
  triangles,
  vertices,
  materials: gltf.materials?.length ?? 0,
  images: gltf.images?.length ?? 0,
  bounds,
  degenerateTriangles,
  opposedNormals,
  invalidNormals,
  meshDiagnostics,
  errors,
  warnings,
};
console.log(JSON.stringify(report, null, 2));
if (errors.length || warnings.length) process.exitCode = 1;
