import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { EDS_G03_DESIGN as D, getEDS_G03TargetRatios } from './eds-g03-design.mjs';

const filename = path.resolve(process.argv[2] || 'public/models/eds-g03-preview.glb');
const reportFile = path.resolve(
  process.argv[3] || 'docs/commercialization/r3/g03-dimensional-validation.json',
);
const hardpointFile = path.resolve(
  process.argv[4] || 'docs/commercialization/r3/g03-hardpoints.json',
);
const bytes = await fs.readFile(filename);
const errors = [];
const warnings = [];

if (bytes.toString('ascii', 0, 4) !== 'glTF') errors.push('Invalid GLB header');
if (bytes.readUInt32LE(4) !== 2) errors.push('Expected GLB version 2');
if (bytes.readUInt32LE(8) !== bytes.length) errors.push('GLB length mismatch');
const jsonLength = bytes.readUInt32LE(12);
if (bytes.toString('ascii', 16, 20) !== 'JSON') errors.push('Missing JSON chunk');
const gltf = JSON.parse(bytes.toString('utf8', 20, 20 + jsonLength));
const assetRevision = gltf.scenes?.[gltf.scene ?? 0]?.extras?.revision ?? D.revision;
const binaryChunkOffset = 20 + jsonLength;
if (bytes.toString('ascii', binaryChunkOffset + 4, binaryChunkOffset + 7) !== 'BIN')
  errors.push('Missing binary chunk');
const binaryOffset = binaryChunkOffset + 8;
const data = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
const componentBytes = { 5121: 1, 5123: 2, 5125: 4, 5126: 4 };
const componentCount = { SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4 };

function accessor(index) {
  const definition = gltf.accessors[index];
  const view = gltf.bufferViews[definition.bufferView];
  const components = componentCount[definition.type];
  const offset = binaryOffset + (view.byteOffset ?? 0) + (definition.byteOffset ?? 0);
  const stride = view.byteStride ?? components * componentBytes[definition.componentType];
  function read(item, component = 0) {
    const byte = offset + item * stride + component * componentBytes[definition.componentType];
    if (definition.componentType === 5121) return data.getUint8(byte);
    if (definition.componentType === 5123) return data.getUint16(byte, true);
    if (definition.componentType === 5125) return data.getUint32(byte, true);
    if (definition.componentType === 5126) return data.getFloat32(byte, true);
    throw new Error(`Unsupported component type ${definition.componentType}`);
  }
  return { definition, read };
}

const meshNames = new Map(
  (gltf.nodes ?? [])
    .filter((node) => Number.isInteger(node.mesh))
    .map((node) => [node.mesh, node.name]),
);
const requiredMeshes = ['BODY', 'AERO', 'TIRE', 'MECHANICAL', 'COCKPIT'].map(
  (name) => `EDS_G03_${name}`,
);
for (const required of requiredMeshes) {
  if (![...meshNames.values()].includes(required)) errors.push(`Missing required mesh ${required}`);
}

const bounds = { min: [Infinity, Infinity, Infinity], max: [-Infinity, -Infinity, -Infinity] };
const tirePoints = [];
const aeroPoints = [];
let triangles = 0;
let vertices = 0;
let invalidValues = 0;
let degenerateTriangles = 0;
let invalidNormals = 0;
const invalidNormalSamples = [];
let reversedVertexNormals = 0;
const reversedByMesh = {};
const reversedSamples = [];

for (const [meshIndex, mesh] of (gltf.meshes ?? []).entries()) {
  for (const primitive of mesh.primitives ?? []) {
    const positions = accessor(primitive.attributes.POSITION);
    const normals = accessor(primitive.attributes.NORMAL);
    const indices = accessor(primitive.indices);
    vertices += positions.definition.count;
    triangles += indices.definition.count / 3;
    for (let index = 0; index < positions.definition.count; index += 1) {
      const point = [0, 1, 2].map((axis) => positions.read(index, axis));
      const normal = [0, 1, 2].map((axis) => normals.read(index, axis));
      if (![...point, ...normal].every(Number.isFinite)) invalidValues += 1;
      if (Math.abs(Math.hypot(...normal) - 1) > 0.02) {
        invalidNormals += 1;
        if (invalidNormalSamples.length < 12) invalidNormalSamples.push({ point, normal });
      }
      point.forEach((value, axis) => {
        bounds.min[axis] = Math.min(bounds.min[axis], value);
        bounds.max[axis] = Math.max(bounds.max[axis], value);
      });
      if (meshNames.get(meshIndex) === 'EDS_G03_TIRE') tirePoints.push(point);
      if (meshNames.get(meshIndex) === 'EDS_G03_AERO') aeroPoints.push(point);
    }
    for (let index = 0; index < indices.definition.count; index += 3) {
      const ids = [indices.read(index), indices.read(index + 1), indices.read(index + 2)];
      const points = ids.map((id) => [0, 1, 2].map((axis) => positions.read(id, axis)));
      const a = points[1].map((value, axis) => value - points[0][axis]);
      const b = points[2].map((value, axis) => value - points[0][axis]);
      const cross = [
        a[1] * b[2] - a[2] * b[1],
        a[2] * b[0] - a[0] * b[2],
        a[0] * b[1] - a[1] * b[0],
      ];
      const faceLength = Math.hypot(...cross);
      if (faceLength < 1e-9) degenerateTriangles += 1;
      if (faceLength >= 1e-9) {
        const averageNormal = [0, 1, 2].map(
          (axis) => ids.reduce((sum, id) => sum + normals.read(id, axis), 0) / 3,
        );
        if (cross.reduce((sum, value, axis) => sum + value * averageNormal[axis], 0) < -1e-8) {
          reversedVertexNormals += 1;
          const name = meshNames.get(meshIndex) ?? `mesh-${meshIndex}`;
          reversedByMesh[name] = (reversedByMesh[name] ?? 0) + 1;
          if (reversedSamples.length < 12)
            reversedSamples.push({
              triangle: index / 3,
              point: points[0].map((value) => Number(value.toFixed(3))),
              faceCross: cross.map((value) => Number(value.toFixed(6))),
              averageNormal: averageNormal.map((value) => Number(value.toFixed(4))),
            });
        }
      }
    }
  }
}

const round = (value, digits = 6) => Number(value.toFixed(digits));
const dimensions = {
  length: bounds.max[2] - bounds.min[2],
  width: bounds.max[0] - bounds.min[0],
  height: bounds.max[1] - bounds.min[1],
};

function measureWheel(axle, side) {
  const axleZ = axle === 'front' ? D.axles.frontZ : D.axles.rearZ;
  const points = tirePoints.filter(
    ([x, , z]) => Math.sign(x) === side && Math.abs(z - axleZ) < 0.5,
  );
  const local = { min: [Infinity, Infinity, Infinity], max: [-Infinity, -Infinity, -Infinity] };
  points.forEach((point) =>
    point.forEach((value, axis) => {
      local.min[axis] = Math.min(local.min[axis], value);
      local.max[axis] = Math.max(local.max[axis], value);
    }),
  );
  return {
    center: local.min.map((value, axis) => (value + local.max[axis]) / 2),
    radius: (local.max[1] - local.min[1]) / 2,
    width: local.max[0] - local.min[0],
    groundY: local.min[1],
  };
}

const wheels = {
  frontLeft: measureWheel('front', -1),
  frontRight: measureWheel('front', 1),
  rearLeft: measureWheel('rear', -1),
  rearRight: measureWheel('rear', 1),
};
const measuredAxles = {
  frontZ: (wheels.frontLeft.center[2] + wheels.frontRight.center[2]) / 2,
  rearZ: (wheels.rearLeft.center[2] + wheels.rearRight.center[2]) / 2,
  frontTrack: wheels.frontRight.center[0] - wheels.frontLeft.center[0],
  rearTrack: wheels.rearRight.center[0] - wheels.rearLeft.center[0],
};
measuredAxles.wheelbase = measuredAxles.rearZ - measuredAxles.frontZ;
const diffuserExitPoints = aeroPoints.filter(([, y, z]) => y < 0.5 && z > 2.28);
const diffuserExitWidth = diffuserExitPoints.length
  ? Math.max(...diffuserExitPoints.map(([x]) => x)) -
    Math.min(...diffuserExitPoints.map(([x]) => x))
  : null;
const requiresDiffuserExitCheck = assetRevision.includes('full vehicle design reset');

const tolerance = {
  dimensionsPercent: 2,
  axlePercent: 1,
  wheelAbsoluteMetres: 0.005,
  symmetryAbsoluteMetres: 0.002,
  lockedBoundsAbsoluteMetres: 0.005,
};
const percentDelta = (actual, target) => ((actual - target) / target) * 100;
const checks = {
  length:
    Math.abs(percentDelta(dimensions.length, D.dimensions.length)) <= tolerance.dimensionsPercent,
  width:
    Math.abs(percentDelta(dimensions.width, D.dimensions.width)) <= tolerance.dimensionsPercent,
  heightLocked: Math.abs(dimensions.height - D.dimensions.height) <= 0.01,
  boundsLocked: ['min', 'max'].every((edge) =>
    bounds[edge].every(
      (value, axis) =>
        Math.abs(value - D.dimensions.bounds[edge][axis]) <= tolerance.lockedBoundsAbsoluteMetres,
    ),
  ),
  wheelbase:
    Math.abs(percentDelta(measuredAxles.wheelbase, D.axles.wheelbase)) <= tolerance.axlePercent,
  frontAxle: Math.abs(measuredAxles.frontZ - D.axles.frontZ) <= 0.01,
  rearAxle: Math.abs(measuredAxles.rearZ - D.axles.rearZ) <= 0.01,
  frontTrack: Math.abs(measuredAxles.frontTrack - D.axles.frontTrack) <= 0.01,
  rearTrack: Math.abs(measuredAxles.rearTrack - D.axles.rearTrack) <= 0.01,
  frontRadius:
    Math.abs(wheels.frontRight.radius - D.wheels.front.radius) <= tolerance.wheelAbsoluteMetres,
  rearRadius:
    Math.abs(wheels.rearRight.radius - D.wheels.rear.radius) <= tolerance.wheelAbsoluteMetres,
  wheelGroundContact: Object.values(wheels).every(
    (wheel) => Math.abs(wheel.groundY - D.coordinateSystem.groundPlaneY) <= 0.001,
  ),
  lateralSymmetry: Math.abs(bounds.max[0] + bounds.min[0]) <= tolerance.symmetryAbsoluteMetres,
  finiteGeometry: invalidValues === 0,
  noDegenerateTriangles: degenerateTriangles === 0,
  unitVertexNormals: invalidNormals === 0,
  normalWindingAgreement: reversedVertexNormals === 0,
  diffuserExitWidth:
    !requiresDiffuserExitCheck ||
    (diffuserExitWidth !== null &&
      Math.abs(diffuserExitWidth - D.landmarks.diffuser.exit.width) <= 0.002),
  materialCount: (gltf.materials?.length ?? 0) === 5,
  textureCount: (gltf.images?.length ?? 0) === 0,
  sidepodFrontWheelClearance:
    D.axles.frontTrack / 2 - D.wheels.front.width / 2 - D.landmarks.sidepods.envelope.x[1] >= 0.015,
  frontWingWheelClearance:
    D.axles.frontZ - D.wheels.front.radius - D.landmarks.frontWing.envelope.z[1] >= 0.08,
};
for (const [name, passed] of Object.entries(checks)) if (!passed) errors.push(`Failed ${name}`);

const ratios = {
  wheelbaseToLength: measuredAxles.wheelbase / dimensions.length,
  widthToLength: dimensions.width / dimensions.length,
  frontWheelDiameterToLength: (2 * wheels.frontRight.radius) / dimensions.length,
  rearWheelDiameterToLength: (2 * wheels.rearRight.radius) / dimensions.length,
};
const report = {
  asset: D.id,
  revision: assetRevision,
  file: path.relative(process.cwd(), filename).replaceAll('\\', '/'),
  sha256: crypto.createHash('sha256').update(bytes).digest('hex'),
  bytes: bytes.length,
  scene: {
    nodes: meshNames.size,
    drawCalls: (gltf.meshes ?? []).reduce((count, mesh) => count + mesh.primitives.length, 0),
    triangles,
    vertices,
    materials: gltf.materials?.length ?? 0,
    textures: gltf.images?.length ?? 0,
  },
  coordinateSystem: D.coordinateSystem,
  target: {
    dimensions: D.dimensions,
    axles: D.axles,
    wheels: D.wheels,
    ratios: getEDS_G03TargetRatios(),
  },
  measured: {
    bounds: {
      min: bounds.min.map((value) => round(value)),
      max: bounds.max.map((value) => round(value)),
    },
    dimensions: Object.fromEntries(
      Object.entries(dimensions).map(([key, value]) => [key, round(value)]),
    ),
    axles: Object.fromEntries(
      Object.entries(measuredAxles).map(([key, value]) => [key, round(value)]),
    ),
    wheels: Object.fromEntries(
      Object.entries(wheels).map(([key, wheel]) => [
        key,
        {
          center: wheel.center.map((value) => round(value)),
          radius: round(wheel.radius),
          width: round(wheel.width),
          groundY: round(wheel.groundY),
        },
      ]),
    ),
    ratios: Object.fromEntries(Object.entries(ratios).map(([key, value]) => [key, round(value)])),
    diffuserExitWidth: diffuserExitWidth === null ? null : round(diffuserExitWidth),
  },
  tolerance,
  checks,
  diagnostics: {
    invalidValues,
    degenerateTriangles,
    invalidNormals,
    invalidNormalSamples,
    reversedVertexNormals,
    reversedByMesh,
    reversedSamples,
    errors,
    warnings,
  },
  khronosValidator:
    'NOT RUN by this internal checker; see the current gate QA report for independent validation',
};

await fs.mkdir(path.dirname(reportFile), { recursive: true });
await fs.writeFile(reportFile, `${JSON.stringify(report, null, 2)}\n`);
await fs.writeFile(
  hardpointFile,
  `${JSON.stringify({ ...D, normalizedRatios: getEDS_G03TargetRatios() }, null, 2)}\n`,
);
console.log(JSON.stringify(report, null, 2));
if (errors.length || warnings.length) process.exitCode = 1;
