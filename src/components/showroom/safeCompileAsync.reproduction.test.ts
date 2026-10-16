import { describe, it, expect, vi } from 'vitest';
import { ensureSafeCompileAsync } from './safeCompileAsync';
import type { WebGLRenderer, Scene, Camera } from 'three';

/**
 * Phase A — Reproduction & verification for the `isReady` fix (M3D.1).
 *
 * Reproduces the original Three.js r165 `compileAsync` failure:
 *   TypeError: Cannot read properties of undefined (reading 'isReady')
 *
 * The unpatched Three.js loop (WebGLRenderer.js:1006-1013) reads
 * `materialProperties.currentProgram` and calls `program.isReady()` without
 * guarding. When a material is disposed / deallocated while the
 * `setTimeout(checkMaterialsReady, 10)` poll is in-flight,
 * `deallocateMaterial` removes the entry from `WebGLProperties`, so
 * `properties.get(material)` returns an empty object and `currentProgram`
 * is `undefined`.
 *
 * Because the throw happens inside a setTimeout callback (outside the
 * promise executor), `.catch()` on `compileAsync()` can never catch it —
 * it escapes as an uncaught error and the promise never settles.
 */

const mockScene = {} as Scene;
const mockCamera = {} as Camera;

/**
 * Build a renderer mock whose `properties.get` mimics post-dispose behavior:
 * after `deallocateMaterial`, `WebGLProperties.get` returns an empty object
 * (real Three.js `get` auto-creates a fresh entry when the WeakMap entry was
 * removed), so `currentProgram` is `undefined`.
 */
function buildMockGl({
  programFor,
  extensions = { get: () => ({} as unknown) },
}: {
  programFor: (material: unknown) => { isReady: () => boolean } | undefined;
  extensions?: { get: (ext: string) => unknown };
}) {
  const materialsSet = new Set<unknown>();
  const registeredMaterials: unknown[] = [];
  const properties = {
    get: (obj: unknown) => ({
      currentProgram: programFor(obj),
    } as { currentProgram?: { isReady: () => boolean } }),
  };

  const gl = {
    compile: vi.fn((_scene: unknown, _camera: unknown, _target?: unknown) => {
      materialsSet.clear();
      for (const m of registeredMaterials) materialsSet.add(m);
      return materialsSet;
    }),
    compileAsync: vi.fn(),
    properties,
    extensions,
  } as unknown;

  return { gl, register: (...ms: unknown[]) => registeredMaterials.push(...ms), materialsSet };
}

/**
 * Exact copy of the unpatched Three.js r165 `checkMaterialsReady` body.
 * Throws when `currentProgram` is undefined (disposed material).
 */
function runUnpatchedCheck(
  materials: Set<unknown>,
  properties: { get: (obj: unknown) => { currentProgram?: unknown } },
): void {
  materials.forEach((material) => {
    const materialProperties = properties.get(material);
    const program = materialProperties.currentProgram;
    // @ts-expect-error intentionally reproducing the original bug
    if (program.isReady()) {
      materials.delete(material);
    }
  });
}

describe('M3D.1 — isReady crash reproduction & fix verification', () => {
  it('reproduces the original error: unpatched loop throws on disposed material', () => {
    const live = { id: 1 };
    const disposed = { id: 2 };
    const materials = new Set([live, disposed]);
    const properties = {
      get: (obj: unknown) =>
        obj === disposed ? {} : { currentProgram: { isReady: () => true } },
    };

    expect(() => runUnpatchedCheck(materials, properties)).toThrow(
      /Cannot read properties of undefined \(reading 'isReady'\)/,
    );
  });

  it('verifies the fix: patched compileAsync resolves without throwing when a material is disposed mid-poll', async () => {
    let liveReady = false;
    const live = { id: 1 };
    const disposed = { id: 2 };
    const { gl, register, materialsSet } = buildMockGl({
      programFor: (obj) =>
        obj === disposed ? undefined : { isReady: () => liveReady },
    });
    register(live, disposed);

    ensureSafeCompileAsync(gl as WebGLRenderer);

    const promise = (gl as WebGLRenderer).compileAsync(mockScene, mockCamera);

    // The first synchronous poll drops the disposed material (its program
    // entry is gone from WebGLProperties) without throwing, and keeps the
    // not-yet-ready live material.
    expect(materialsSet.has(disposed)).toBe(false);
    expect(materialsSet.has(live)).toBe(true);
    expect(materialsSet.size).toBe(1);

    // Once the remaining live material reports ready, compilation completes.
    liveReady = true;
    await new Promise((resolve) => setTimeout(resolve, 35));
    await expect(promise).resolves.toBe(mockScene);
    expect(materialsSet.size).toBe(0);
  });

  it('is idempotent across remounts: 50 rapid mount/unmount cycles', () => {
    let lastWrapped: unknown;
    for (let cycle = 0; cycle < 50; cycle += 1) {
      // Each remount creates a brand-new WebGLRenderer (new canvas + context).
      const { gl } = buildMockGl({
        programFor: () => ({ isReady: () => true }),
      });

      ensureSafeCompileAsync(gl as WebGLRenderer);
      const wrapped = (gl as WebGLRenderer).compileAsync;

      // Re-installing on the same renderer instance is a no-op.
      ensureSafeCompileAsync(gl as WebGLRenderer);
      expect((gl as WebGLRenderer).compileAsync).toBe(wrapped);

      lastWrapped = wrapped;
    }
    expect(lastWrapped).toBeDefined();
  });

  it('a compile that resolves after navigation away is inert for the consumer', async () => {
    const { gl, register, materialsSet } = buildMockGl({
      programFor: () => ({ isReady: () => false }),
    });
    register({ id: 1 });

    ensureSafeCompileAsync(gl as WebGLRenderer);

    let resolvedWith: unknown = null;
    const compilation = (gl as WebGLRenderer).compileAsync(mockScene, mockCamera);
    void compilation.then((scene) => {
      resolvedWith = scene;
    });

    // Navigation away while compilation is pending: at 35ms the live program
    // still reports not-ready, so nothing has resolved. The patched loop
    // itself never throws (which an uncaught error would surface as here).
    await new Promise((resolve) => setTimeout(resolve, 35));
    expect(resolvedWith).toBe(null);

    // Stop the pending poll so the test harness exits cleanly. In the real
    // coordinator, late resolution is ignored via mountedRef / scene-key.
    materialsSet.clear();
    await expect(compilation).resolves.toBe(mockScene);
  });
});
