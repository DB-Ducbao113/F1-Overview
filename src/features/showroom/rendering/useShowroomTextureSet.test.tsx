import React, { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import ReactTestRenderer, { act } from 'react-test-renderer';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Texture } from 'three';
import { __resetCacheForTests, getCacheStats } from './resources/showroomTextureCache';
import { useShowroomTextureSet } from './useShowroomTextureSet';

const SLOTS = ['body', 'wing'] as const;
const makeTexture = (name: string): Texture =>
  ({
    name,
    dispose: vi.fn(),
  }) as unknown as Texture;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describe('useShowroomTextureSet render lifecycle', () => {
  beforeEach(() => {
    __resetCacheForTests();
  });

  it('does not acquire resources during an uncommitted server render', () => {
    const generate = vi.fn((slot: string) => makeTexture(`mercedes_${slot}`));
    const Probe = () => {
      useShowroomTextureSet('car', 'mercedes', SLOTS, generate);
      return <div>probe</div>;
    };

    expect(renderToString(<Probe />)).toContain('probe');
    expect(generate).not.toHaveBeenCalled();
    expect(getCacheStats('car')).toMatchObject({ entries: 0, totalReferences: 0 });
  });

  it('does not leak a handle when React abandons a render', () => {
    const generate = vi.fn((slot: string) => makeTexture(`ferrari_${slot}`));
    const Interrupted = () => {
      useShowroomTextureSet('car', 'ferrari', SLOTS, generate);
      throw new Error('interrupt render');
    };

    expect(() => renderToString(<Interrupted />)).toThrow('interrupt render');
    expect(generate).not.toHaveBeenCalled();
    expect(getCacheStats('car')).toMatchObject({ entries: 0, totalReferences: 0 });
  });

  it('retains committed textures during async transition until new set commits', async () => {
    let capturedTextures: Map<string, Texture> | null = null;
    const generate = vi.fn((slot: string) => makeTexture(slot));

    const Consumer: React.FC<{ setKey: string }> = ({ setKey }) => {
      const textures = useShowroomTextureSet('car', setKey, SLOTS, generate);
      capturedTextures = textures;
      return (
        <div>
          {setKey}:{textures ? 'loaded' : 'loading'}
        </div>
      );
    };

    let renderer: ReactTestRenderer.ReactTestRenderer;
    await act(async () => {
      renderer = ReactTestRenderer.create(<Consumer setKey="ferrari" />);
    });

    // Wait for async generation of Ferrari textures
    await act(async () => {
      await sleep(50);
    });

    expect(capturedTextures).not.toBeNull();
    const ferrariTextures = capturedTextures;
    expect(getCacheStats('car')).toMatchObject({
      entries: 1,
      referencedEntries: 1,
      totalReferences: 1,
    });

    // Switch to Red Bull
    await act(async () => {
      renderer.update(<Consumer setKey="redbull" />);
    });

    // During the in-flight generation of redbull, the hook MUST return the committed Ferrari textures!
    // This prevents scene unmounts that would recreate Drei MeshReflectorMaterial render targets.
    expect(capturedTextures).toBe(ferrariTextures);
    expect(getCacheStats('car')).toMatchObject({
      entries: 1,
      referencedEntries: 1,
      totalReferences: 1,
    });

    // Wait for redbull textures to finish and commit
    await act(async () => {
      await sleep(50);
    });

    // Now redbull is committed, returning the new texture map
    expect(capturedTextures).not.toBeNull();
    expect(capturedTextures).not.toBe(ferrariTextures);
    // Cache has 2 entries (redbull referenced, ferrari unreferenced in LRU)
    expect(getCacheStats('car')).toMatchObject({
      entries: 2,
      referencedEntries: 1,
      totalReferences: 1,
    });

    // Unmount consumer
    await act(async () => {
      renderer.unmount();
      await sleep(10);
    });

    // On unmount, both handles are released. Since MAX_INACTIVE_SETS = 1,
    // the older unreferenced set (ferrari) is evicted, leaving exactly 1 inactive entry (redbull).
    expect(getCacheStats('car')).toMatchObject({
      entries: 1,
      referencedEntries: 0,
      totalReferences: 0,
    });
  });

  it('handles rapid key switches without leaking in-flight prepared sets or double-releasing', async () => {
    const createdTextures: Texture[] = [];
    const generate = vi.fn((slot: string) => {
      const tex = makeTexture(slot);
      createdTextures.push(tex);
      return tex;
    });

    const Consumer: React.FC<{ setKey: string }> = ({ setKey }) => {
      useShowroomTextureSet('car', setKey, SLOTS, generate);
      return <div>{setKey}</div>;
    };

    let renderer: ReactTestRenderer.ReactTestRenderer;
    await act(async () => {
      renderer = ReactTestRenderer.create(<Consumer setKey="team_a" />);
    });

    // Rapidly switch to team_b and team_c before team_a finishes
    await act(async () => {
      renderer.update(<Consumer setKey="team_b" />);
    });
    await act(async () => {
      renderer.update(<Consumer setKey="team_c" />);
    });

    // Wait for settling
    await act(async () => {
      await sleep(50);
    });

    // Only the final committed team should be referenced (1 reference, 0 leaks)
    const stats = getCacheStats('car');
    expect(stats.referencedEntries).toBe(1);
    expect(stats.totalReferences).toBe(1);

    await act(async () => {
      renderer.unmount();
      await sleep(10);
    });

    expect(getCacheStats('car').totalReferences).toBe(0);
  });

  it('disposes in-progress prepared textures if component unmounts mid-generation', async () => {
    const createdTextures: Texture[] = [];
    const generate = vi.fn((slot: string) => {
      const tex = makeTexture(slot);
      createdTextures.push(tex);
      return tex;
    });

    const Consumer: React.FC<{ setKey: string }> = ({ setKey }) => {
      useShowroomTextureSet('car', setKey, ['slot1', 'slot2', 'slot3'], generate);
      return <div>loading</div>;
    };

    let renderer: ReactTestRenderer.ReactTestRenderer;
    await act(async () => {
      renderer = ReactTestRenderer.create(<Consumer setKey="unmount_midway" />);
    });

    // Unmount immediately before full set completes
    await act(async () => {
      renderer.unmount();
      await sleep(20);
    });

    // Cache should hold 0 entries and 0 references
    expect(getCacheStats('car')).toMatchObject({
      entries: 0,
      totalReferences: 0,
    });
  });

  it('cleans up properly in React StrictMode without leaking references', async () => {
    const generate = vi.fn((slot: string) => makeTexture(slot));

    const Consumer: React.FC<{ setKey: string }> = ({ setKey }) => {
      useShowroomTextureSet('car', setKey, SLOTS, generate);
      return <div>strict</div>;
    };

    let renderer: ReactTestRenderer.ReactTestRenderer;
    await act(async () => {
      renderer = ReactTestRenderer.create(
        <StrictMode>
          <Consumer setKey="strict_team" />
        </StrictMode>,
      );
    });

    await act(async () => {
      await sleep(50);
    });

    // After StrictMode double-mount simulation, exactly 1 reference must be held
    expect(getCacheStats('car')).toMatchObject({
      entries: 1,
      referencedEntries: 1,
      totalReferences: 1,
    });

    await act(async () => {
      renderer.unmount();
      await sleep(10);
    });

    expect(getCacheStats('car')).toMatchObject({
      totalReferences: 0,
    });
  });
});
