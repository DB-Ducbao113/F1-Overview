import { useEffect, useRef, useState } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import type { GLTF } from 'three-stdlib';

/* ------------------------------------------------------------------ */
/*  M3D.3.2 — Worker-based GLTF ingestion (feature flagged)           */
/* ------------------------------------------------------------------ */
/*
 * `useWorkerGLTF('/models/c42.v2.glb')` mirrors `useGLTF('/models/c42.v2.glb')`
 * but, when the experiment is enabled, performs the worker-compatible part
 * of the pipeline (fetch + glB parse + EXT_meshopt_compression decode) in a
 * dedicated Web Worker and only reconstructs Three.js objects on the main
 * thread.
 *
 * The flag defaults to OFF, in which case this hook delegates to the
 * original `useGLTF` path byte-for-byte — no behaviour change. Flip it on
 * with `VITE_EXPERIMENTAL_WORKER_GLTF=true` for the isolated M3D.3.2
 * benchmark.
 *
 * Worker-compatible (offloaded): glB container parse, meshopt decode
 * (self-contained WASM, runs inside the worker).
 * Main-thread only (kept here): BufferGeometry / BufferAttribute / Mesh /
 * Material / Scene construction — these are plain JS objects and are
 * intentionally NOT moved to the worker. No WebGL context is created in
 * the worker.
 */

export const EXPERIMENTAL_WORKER_GLTF: boolean =
  typeof import.meta !== 'undefined' &&
  import.meta.env &&
  import.meta.env.VITE_EXPERIMENTAL_WORKER_GLTF === 'true';

const GLTF_PATH = '/models/c42.v2.glb';

const COMPONENT_CTORS: Record<number, new (buffer: ArrayBufferLike, byteOffset?: number, length?: number) => any> = {
  5120: Int8Array,
  5121: Uint8Array,
  5122: Int16Array,
  5123: Uint16Array,
  5125: Uint32Array,
  5126: Float32Array,
};

const TYPE_SIZE: Record<string, number> = {
  SCALAR: 1,
  VEC2: 2,
  VEC3: 3,
  VEC4: 4,
  MAT2: 4,
  MAT3: 9,
  MAT4: 16,
};

interface WorkerResult {
  type: 'RESULT';
  id: number;
  descriptor: unknown;
  buffers: ArrayBuffer[];
}

interface WorkerError {
  type: 'ERROR';
  id: number;
  error: string;
}

interface GLTFNodeDescriptor {
  name?: string;
  mesh?: number;
  position?: number[];
  rotation?: number[];
  quaternion?: number[];
  scale?: number[];
  matrix?: number[];
  children?: GLTFNodeDescriptor[];
}

interface GLTFMeshDescriptor {
  name?: string;
  primitives: Array<{
    attributes: Record<string, number>;
    indices: number | null;
    mode: number;
    material: number | null;
  }>;
}

interface GLTFMaterialDescriptor {
  name?: string;
  pbrMetallicRoughness?: {
    roughnessFactor?: number;
    metallicFactor?: number;
    baseColorFactor?: number[];
  };
  emissiveFactor?: number[];
}

interface GLTFAccessorDescriptor {
  bufferView: number;
  byteOffset: number;
  componentType: number;
  type: string;
  count: number;
  normalized: boolean;
  min?: number[];
  max?: number[];
}

interface GLTFSceneDescriptor {
  scene: { name?: string; children: GLTFNodeDescriptor[] };
  meshes: GLTFMeshDescriptor[];
  materials: GLTFMaterialDescriptor[];
  accessors: GLTFAccessorDescriptor[];
  numBufferViews: number;
}

/** Build a Three.js material from the worker-supplied descriptor. */
function buildMaterial(desc: GLTFMaterialDescriptor): THREE.Material {
  const material = new THREE.MeshStandardMaterial();
  if (desc.name) material.name = desc.name;
  const pbr = desc.pbrMetallicRoughness;
  if (pbr) {
    if (typeof pbr.roughnessFactor === 'number')
      material.roughness = pbr.roughnessFactor;
    if (typeof pbr.metallicFactor === 'number')
      material.metalness = pbr.metallicFactor;
    if (pbr.baseColorFactor)
      material.color.setRGB(
        pbr.baseColorFactor[0],
        pbr.baseColorFactor[1],
        pbr.baseColorFactor[2],
      );
  }
  if (desc.emissiveFactor)
    material.emissive.setRGB(
      desc.emissiveFactor[0],
      desc.emissiveFactor[1],
      desc.emissiveFactor[2],
    );
  return material;
}

/** Reconstruct a Three.js GLTF result on the main thread from the worker payload. */
function reconstructGLTF(
  descriptor: GLTFSceneDescriptor,
  decodedBuffers: ArrayBuffer[],
): GLTF {
  const scene = new THREE.Scene();
  if (descriptor.scene.name) scene.name = descriptor.scene.name;

  const materials = descriptor.materials.map(buildMaterial);

  const geometryCache = new Map<string, THREE.BufferGeometry>();
  const meshCache = new Map<number, THREE.Object3D>();

  const buildGeometry = (primitive: GLTFMeshDescriptor['primitives'][number]) => {
    const geometry = new THREE.BufferGeometry();
    const attributes = primitive.attributes;
    for (const attributeName of Object.keys(attributes)) {
      const accessorIdx = attributes[attributeName];
      const accessor = descriptor.accessors[accessorIdx];
      if (!accessor) continue;
      const buffer = decodedBuffers[accessor.bufferView];
      if (!buffer || buffer.byteLength === 0) continue;
      const Ctor = COMPONENT_CTORS[accessor.componentType];
      if (!Ctor) continue;
      const itemSize = TYPE_SIZE[accessor.type] ?? 1;
      const byteOffset = accessor.byteOffset ?? 0;
      const array = new Ctor(buffer, byteOffset, accessor.count * itemSize);
      const attribute = new THREE.BufferAttribute(array, itemSize, accessor.normalized);
      geometry.setAttribute(attributeName, attribute);
    }
    if (primitive.indices !== null) {
      const accessor = descriptor.accessors[primitive.indices];
      if (accessor) {
        const buffer = decodedBuffers[accessor.bufferView];
        if (buffer && buffer.byteLength > 0) {
          const Ctor = COMPONENT_CTORS[accessor.componentType];
          if (Ctor) {
            const itemSize = TYPE_SIZE[accessor.type] ?? 1;
            const byteOffset = accessor.byteOffset ?? 0;
            const array = new Ctor(buffer, byteOffset, accessor.count * itemSize);
            geometry.setIndex(new THREE.BufferAttribute(array, itemSize, accessor.normalized));
          }
        }
      }
    }
    return geometry;
  };

  const buildMesh = (meshIndex: number): THREE.Object3D => {
    const meshDesc = descriptor.meshes[meshIndex];
    if (!meshDesc) return new THREE.Group();
    const meshes: THREE.Object3D[] = [];
    for (const primitive of meshDesc.primitives) {
      const cacheKey = `${primitive.indices}:${Object.entries(primitive.attributes)
        .map(([k, v]) => `${k}:${v}`)
        .sort()
        .join(';')}:${primitive.mode}`;
      let geometry = geometryCache.get(cacheKey);
      if (!geometry) {
        geometry = buildGeometry(primitive);
        geometryCache.set(cacheKey, geometry);
      }
      const materialIdx = primitive.material ?? 0;
      const material = materials[materialIdx] ?? materials[0] ?? new THREE.MeshStandardMaterial();
      const mode = primitive.mode;
      let mesh: THREE.Mesh | THREE.LineSegments | THREE.Line | THREE.Points;
      if (mode === 4 || mode === undefined) {
        mesh = new THREE.Mesh(geometry, material);
      } else if (mode === 5) {
        mesh = new THREE.LineSegments(geometry, material);
      } else if (mode === 6) {
        mesh = new THREE.Line(geometry, material);
      } else if (mode === 7) {
        mesh = new THREE.Points(geometry, material);
      } else {
        mesh = new THREE.Mesh(geometry, material);
      }
      if (meshDesc.name) mesh.name = meshDesc.name;
      meshes.push(mesh);
    }
    if (meshes.length === 1) return meshes[0];
    const group = new THREE.Group();
    if (meshDesc.name) group.name = meshDesc.name;
    for (const m of meshes) group.add(m);
    return group;
  };

  const buildNode = (desc: GLTFNodeDescriptor): THREE.Object3D => {
    let node: THREE.Object3D;
    if (desc.mesh !== undefined) {
      if (!meshCache.has(desc.mesh)) meshCache.set(desc.mesh, buildMesh(desc.mesh));
      node = meshCache.get(desc.mesh)!;
    } else {
      node = new THREE.Group();
    }
    if (desc.name) node.name = desc.name;
    if (desc.matrix) {
      node.applyMatrix4(new THREE.Matrix4().fromArray(desc.matrix));
    } else {
      if (desc.position) node.position.fromArray(desc.position);
      if (desc.rotation) node.quaternion.fromArray(desc.rotation);
      if (desc.scale) node.scale.fromArray(desc.scale);
    }
    if (desc.children) {
      for (const child of desc.children) node.add(buildNode(child));
    }
    return node;
  };

  for (const child of descriptor.scene.children) {
    scene.add(buildNode(child));
  }

  return {
    scene,
    scenes: [scene],
    animations: [],
    cameras: [],
    asset: {},
    parser: undefined as unknown as GLTF['parser'],
    userData: {},
  } as unknown as GLTF;
}

/**
 * Hook: loads `/models/c42.v2.glb`.
 *
 * - EXPERIMENTAL_WORKER_GLTF === false (default): identical to `useGLTF`.
 * - === true: worker fetches + parses + decodes; main thread reconstructs.
 *   On any worker failure (init, fetch, decode, message), falls back to the
 *   original `useGLTF` path so the showroom never breaks.
 */
export function useWorkerGLTF(path: string = GLTF_PATH): GLTF | null {
  // Unconditional hook call (hook rules). Used as the fallback result when
  // the worker is disabled or fails.
  const mainThreadGltf = useGLTF(path);

  const [gltf, setGltf] = useState<GLTF | null>(() =>
    mainThreadGltf?.scene ? mainThreadGltf : null,
  );
  const [, setError] = useState<Error | null>(null);
  const workerRef = useRef<Worker | null>(null);
  const abortedRef = useRef(false);
  const startedRef = useRef(false);

  const mainThreadGltfRef = useRef(mainThreadGltf);
  // Keep the ref current via an effect (not during render) so the worker
  // fallback can read the latest main-thread result without breaking hook rules.
  useEffect(() => {
    mainThreadGltfRef.current = mainThreadGltf;
  }, [mainThreadGltf]);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    let cancelled = false;
    let worker: Worker | null = null;

    const finishWithMainThread = () => {
      if (cancelled) return;
      if (mainThreadGltfRef.current?.scene) setGltf(mainThreadGltfRef.current);
    };

    // Worker disabled or unavailable -> original main-thread path.
    if (!EXPERIMENTAL_WORKER_GLTF || typeof Worker === 'undefined') {
      if (mainThreadGltfRef.current?.scene) setGltf(mainThreadGltfRef.current);
      return;
    }

    abortedRef.current = false;
    const loadId = Date.now();

    const timeoutId = setTimeout(() => {
      if (cancelled) return;
      worker?.terminate();
      setError(new Error('glTF worker timeout'));
      finishWithMainThread();
    }, 20000);

    try {
      worker = new Worker(
        new URL('./workers/gltfMeshoptWorker.ts', import.meta.url),
        { type: 'module' },
      );
    } catch {
      clearTimeout(timeoutId);
      finishWithMainThread();
      return;
    }
    workerRef.current = worker;

    worker.onmessage = (event: MessageEvent<WorkerResult | WorkerError>) => {
      const data = event.data ?? {};
      const { id, type } = data;
      if (id !== loadId) return;
      if (type === 'ERROR') {
        if (cancelled) return;
        clearTimeout(timeoutId);
        setError(new Error(data.error));
        finishWithMainThread();
        return;
      }
      if (type === 'RESULT') {
        if (cancelled) return;
        clearTimeout(timeoutId);
        try {
          const workerGltf = reconstructGLTF(
            data.descriptor as GLTFSceneDescriptor,
            data.buffers,
          );
          setGltf(workerGltf);
        } catch (err) {
          setError(err instanceof Error ? err : new Error(String(err)));
          finishWithMainThread();
        }
      }
    };

    worker.onerror = () => {
      if (cancelled) return;
      clearTimeout(timeoutId);
      setError(new Error('glTF worker error'));
      finishWithMainThread();
    };

    fetch(path)
      .then((response) => {
        if (cancelled) throw new Error('glTF load cancelled');
        return response.arrayBuffer();
      })
      .then((glb) => {
        if (cancelled) return;
        worker!.postMessage({ type: 'LOAD', id: loadId, glb }, [glb]);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err);
        finishWithMainThread();
      });

    return () => {
      cancelled = true;
      abortedRef.current = true;
      clearTimeout(timeoutId);
      worker?.terminate();
      workerRef.current = null;
    };
  }, [path]);

  return gltf;
}
