import { describe, it, expect, vi } from 'vitest';
import { ensureSafeCompileAsync } from './safeCompileAsync';
import type { WebGLRenderer, Scene, Camera } from 'three';

describe('ensureSafeCompileAsync', () => {
  it('installs a safe compileAsync wrapper that handles undefined programs without throwing', async () => {
    const material1 = { id: 1, name: 'mat1' };
    const material2 = { id: 2, name: 'mat2' }; // Will have undefined program (disposed material)
    const materialsSet = new Set([material1, material2]);

    const mockProperties = new Map<unknown, { currentProgram?: { isReady: () => boolean } }>();
    mockProperties.set(material1, {
      currentProgram: { isReady: () => true },
    });
    // material2 has NO entry or currentProgram is undefined, mimicking deallocated/disposed material
    mockProperties.set(material2, {});

    const mockExtensions = {
      get: (ext: string) => (ext === 'KHR_parallel_shader_compile' ? {} : null),
    };

    const mockGl = {
      compile: vi.fn(() => materialsSet),
      compileAsync: vi.fn(),
      properties: {
        get: (obj: unknown) => mockProperties.get(obj) ?? {},
      },
      extensions: mockExtensions,
    } as unknown as WebGLRenderer;

    ensureSafeCompileAsync(mockGl);

    const mockScene = {} as Scene;
    const mockCamera = {} as Camera;

    // Should resolve cleanly without throwing TypeError: Cannot read properties of undefined (reading 'isReady')
    const result = await mockGl.compileAsync(mockScene, mockCamera);
    expect(result).toBe(mockScene);
    expect(materialsSet.size).toBe(0);
  });

  it('is idempotent and does not wrap twice', () => {
    const mockGl = {
      compile: vi.fn(() => new Set()),
      compileAsync: vi.fn(),
    } as unknown as WebGLRenderer;

    ensureSafeCompileAsync(mockGl);
    const firstWrapped = mockGl.compileAsync;
    ensureSafeCompileAsync(mockGl);
    expect(mockGl.compileAsync).toBe(firstWrapped);
  });
});
