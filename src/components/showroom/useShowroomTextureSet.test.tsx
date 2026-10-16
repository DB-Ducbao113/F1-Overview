import React from 'react';
import { renderToString } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Texture } from 'three';
import { __resetCacheForTests, getCacheStats } from './showroomTextureCache';
import { useShowroomTextureSet } from './useShowroomTextureSet';

const SLOTS = ['body'] as const;
const makeTexture = (): Texture => ({ dispose: vi.fn() }) as unknown as Texture;

describe('useShowroomTextureSet render lifecycle', () => {
  beforeEach(() => __resetCacheForTests());

  it('does not acquire resources during an uncommitted server render', () => {
    const generate = vi.fn(makeTexture);
    const Probe = () => {
      useShowroomTextureSet('car', 'mercedes', SLOTS, generate);
      return <div>probe</div>;
    };

    expect(renderToString(<Probe />)).toContain('probe');
    expect(generate).not.toHaveBeenCalled();
    expect(getCacheStats('car')).toMatchObject({ entries: 0, totalReferences: 0 });
  });

  it('does not leak a handle when React abandons a render', () => {
    const generate = vi.fn(makeTexture);
    const Interrupted = () => {
      useShowroomTextureSet('car', 'ferrari', SLOTS, generate);
      throw new Error('interrupt render');
    };

    expect(() => renderToString(<Interrupted />)).toThrow('interrupt render');
    expect(generate).not.toHaveBeenCalled();
    expect(getCacheStats('car')).toMatchObject({ entries: 0, totalReferences: 0 });
  });
});
