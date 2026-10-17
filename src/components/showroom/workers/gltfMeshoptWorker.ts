import { MeshoptDecoder } from 'three-stdlib';

/* ------------------------------------------------------------------ */
/*  glTF + meshopt decode worker                                      */
/* ------------------------------------------------------------------ */
/*
 * Runs in a dedicated Web Worker. Responsibilities (the only parts of
 * the glTF pipeline that are Worker-compatible):
 *
 *   1. Receive the glb ArrayBuffer (transferred from the main thread).
 *   2. Parse the glB container (JSON + BIN chunks).
 *   3. Instantiate MeshoptDecoder (self-contained embedded WASM; WebAssembly
 *      is available inside Workers, so no external decoder file is needed).
 *   4. Decode every bufferView that uses EXT_meshopt_compression.
 *   5. Post back a JSON scene descriptor + the decoded ArrayBuffers as
 *      Transferables (zero-copy).
 *
 * The main thread owns all Three.js object creation (BufferGeometry,
 * BufferAttribute, Mesh, Material, Scene) and all WebGL calls, which
 * intentionally stay off this worker. No WebGL context is created here.
 */

type ComponentType =
  | 5120 // INT8
  | 5121 // UINT8
  | 5122 // INT16
  | 5123 // UINT16
  | 5125 // UINT32
  | 5126; // FLOAT

interface MeshoptExtension {
  buffer: number;
  byteOffset: number;
  byteLength: number;
  byteStride: number;
  count: number;
  mode: 'ATTRIBUTES' | 'TRIANGLES' | 'INDICES' | string;
  filter: 'NONE' | 'OCTAHEDRAL' | 'QUATERNION' | 'EXPONENTIAL' | string;
}

interface RawNode {
  name?: string;
  mesh?: number;
  position?: number[];
  rotation?: number[];
  quaternion?: number[];
  scale?: number[];
  matrix?: number[];
  children?: number[];
}

interface GLTFNode {
  name?: string;
  mesh?: number;
  position?: number[];
  rotation?: number[];
  quaternion?: number[];
  scale?: number[];
  matrix?: number[];
  children?: GLTFNode[];
}

interface GLTFMeshPrimitive {
  attributes: Record<string, number>;
  indices?: number | null;
  mode?: number;
  material?: number | null;
}

interface GLTFMesh {
  name?: string;
  primitives: GLTFMeshPrimitive[];
}

interface GLTFMaterial {
  name?: string;
  pbrMetallicRoughness?: {
    roughnessFactor?: number;
    metallicFactor?: number;
    baseColorFactor?: number[];
  };
  emissiveFactor?: number[];
}

interface GLTFAccessor {
  bufferView: number;
  byteOffset?: number;
  componentType: ComponentType;
  type: string;
  count: number;
  normalized?: boolean;
  min?: number[];
  max?: number[];
}

interface GLTFBufferView {
  buffer: number;
  byteOffset: number;
  byteLength: number;
  byteStride?: number;
  target?: number;
  extensions?: { EXT_meshopt_compression?: MeshoptExtension };
}

interface RawGLTF {
  asset?: Record<string, unknown>;
  scene?: number;
  scenes?: Array<{ name?: string; nodes?: number[] }>;
  nodes?: RawNode[];
  meshes?: GLTFMesh[];
  materials?: GLTFMaterial[];
  accessors?: GLTFAccessor[];
  buffers?: Array<{ byteLength?: number }>;
  bufferViews?: GLTFBufferView[];
}

interface MeshoptAPI {
  ready: Promise<void>;
  supported: boolean;
  decodeGltfBuffer(
    target: Uint8Array,
    count: number,
    size: number,
    source: Uint8Array,
    mode: 'ATTRIBUTES' | 'TRIANGLES' | 'INDICES',
    filter: 'NONE' | 'OCTAHEDRAL' | 'QUATERNION' | 'EXPONENTIAL',
  ): void;
}

interface GLTFSceneDescriptor {
  asset?: Record<string, unknown>;
  scene: { name?: string; children: GLTFNode[] };
  meshes: GLTFMesh[];
  materials: GLTFMaterial[];
  accessors: GLTFAccessor[];
  numBufferViews: number;
}

interface LoadRequest {
  type: 'LOAD';
  id: number;
  glb: ArrayBuffer;
}

interface ResultMessage {
  type: 'RESULT';
  id: number;
  descriptor: GLTFSceneDescriptor;
}

interface ErrorMessage {
  type: 'ERROR';
  id: number;
  error: string;
}

/** Minimal glTF-Binary (glB) container parser. */
function parseGlb(data: ArrayBuffer): { json: unknown; bin: ArrayBuffer } {
  const uint8 = new Uint8Array(data);
  if (uint8.length < 12) {
    throw new Error('glTF worker: glb too small for header');
  }
  const magic = String.fromCharCode(
    uint8[0],
    uint8[1],
    uint8[2],
    uint8[3],
  );
  if (magic !== 'glTF') {
    throw new Error('glTF worker: invalid glb magic');
  }
  const version = new DataView(data, 0, 12).getUint32(4, true);
  if (version !== 2) {
    throw new Error(`glTF worker: unsupported glTF version ${version}`);
  }
  const length = new DataView(data, 0, 12).getUint32(8, true);

  let offset = 12;
  let json: unknown = null;
  let bin: ArrayBuffer | null = null;

  while (offset < length) {
    const chunkLength = new DataView(data, offset, 4).getUint32(0, true);
    const chunkType = new DataView(data, offset + 4, 4).getUint32(0, true);
    const chunkStart = offset + 8;
    if (chunkType === 0x4e4f534a) {
      // 'JSON'
      json = JSON.parse(
        new TextDecoder().decode(new Uint8Array(data, chunkStart, chunkLength)),
      );
    } else if (chunkType === 0x004e4942) {
      // 'BIN'
      bin = data.slice(chunkStart, chunkStart + chunkLength);
    }
    offset += 8 + chunkLength;
    if (chunkLength % 4) {
      offset += 4 - (chunkLength % 4);
    }
  }

  if (json === null) {
    throw new Error('glTF worker: no JSON chunk found');
  }
  if (bin === null) {
    throw new Error('glTF worker: no BIN chunk found');
  }
  return { json, bin };
}

function buildDescriptor(json: unknown): GLTFSceneDescriptor {
  const gltf = json as RawGLTF;

  const sceneIndex = gltf.scene ?? 0;
  const scenes = gltf.scenes ?? [];
  const sceneDef = scenes[sceneIndex];
  const nodeList = gltf.nodes ?? [];

  const resolveNode = (nodeIndex: number): GLTFNode | null => {
    const nd = nodeList[nodeIndex];
    if (!nd) return null;
    const node: GLTFNode = {
      name: nd.name,
      mesh: nd.mesh,
      position: nd.position,
      rotation: nd.rotation,
      quaternion: nd.quaternion,
      scale: nd.scale,
      matrix: nd.matrix,
    };
    if (nd.children) {
      node.children = nd.children
        .map((ci) => resolveNode(ci))
        .filter((n): n is GLTFNode => n !== null);
    }
    return node;
  };

  const children = (sceneDef?.nodes ?? [])
    .map((nodeIndex) => resolveNode(nodeIndex))
    .filter((n): n is GLTFNode => n !== null);

  const meshes = (gltf.meshes ?? []).map((m) => ({
    name: m.name,
    primitives: (m.primitives ?? []).map((p) => ({
      attributes: p.attributes ?? {},
      indices: p.indices ?? null,
      mode: p.mode ?? 4,
      material: p.material ?? null,
    })),
  }));

  const materials = (gltf.materials ?? []).map((m) => ({
    name: m.name,
    pbrMetallicRoughness: m.pbrMetallicRoughness,
    emissiveFactor: m.emissiveFactor,
  }));

  const accessors = (gltf.accessors ?? []).map((a) => ({
    bufferView: a.bufferView,
    byteOffset: a.byteOffset ?? 0,
    componentType: a.componentType,
    type: a.type,
    count: a.count,
    normalized: a.normalized ?? false,
    min: a.min,
    max: a.max,
  }));

  return {
    asset: gltf.asset,
    scene: { name: sceneDef?.name, children },
    meshes,
    materials,
    accessors,
    numBufferViews: gltf.bufferViews?.length ?? 0,
  };
}

const post = (message: unknown, transfer?: ArrayBuffer[]): void => {
  (self as unknown as { postMessage: (m: unknown, t?: ArrayBuffer[]) => void }).postMessage(
    message,
    transfer,
  );
};

self.onmessage = async (event: MessageEvent<LoadRequest>): Promise<void> => {
  const { id, glb } = event.data;

  try {
    const { json, bin } = parseGlb(glb);

    const gltf = json as RawGLTF;
    const bufferViews = gltf.bufferViews ?? [];

    // MeshoptDecoder is self-contained (embedded WASM); WebAssembly is
    // available inside Workers, so no external decoder file is needed.
    const decoder = MeshoptDecoder() as unknown as MeshoptAPI;
    if (!decoder.supported) {
      throw new Error('glTF worker: meshopt decoder not supported');
    }
    await decoder.ready;

    const decodedBuffers: ArrayBuffer[] = [];
    decodedBuffers.length = bufferViews.length;

    // Decode every compressed bufferView. bufferViews reference a logical
    // buffer (buffer 1, declared with EXT_meshopt_compression {fallback});
    // the actual compressed bytes live in buffer 0 (the BIN chunk).
    for (let i = 0; i < bufferViews.length; i += 1) {
      const bv = bufferViews[i];
      const ext = bv.extensions?.EXT_meshopt_compression;
      if (!ext) {
        decodedBuffers[i] = new ArrayBuffer(0);
        continue;
      }

      const source = new Uint8Array(bin, ext.byteOffset, ext.byteLength);
      const stride = ext.byteStride ?? 0;
      const count = ext.count ?? 0;
      const decoded = new ArrayBuffer(count * stride);
      const target = new Uint8Array(decoded);

      decoder.decodeGltfBuffer(
        target,
        count,
        stride,
        source,
        ext.mode as 'ATTRIBUTES' | 'TRIANGLES' | 'INDICES',
        ext.filter as 'NONE' | 'OCTAHEDRAL' | 'QUATERNION' | 'EXPONENTIAL',
      );
      decodedBuffers[i] = decoded;
    }

    const descriptor = buildDescriptor(json);

    // Transfer decoded ArrayBuffers back zero-copy; the descriptor travels
    // as JSON (structured clone).
    post(
      { type: 'RESULT', id, descriptor } as ResultMessage,
      decodedBuffers.filter((b) => b.byteLength > 0),
    );
  } catch (error) {
    post({
      type: 'ERROR',
      id,
      error: error instanceof Error ? error.message : String(error),
    } as ErrorMessage);
  }
};

export {};
