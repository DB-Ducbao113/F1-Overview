import { describe, expect, it, beforeEach, vi } from 'vitest';
import {
  acquireSet,
  acquireTexture,
  disposeAll,
  getCacheStats,
  hasSet,
  __resetCacheForTests,
  MAX_INACTIVE_SETS,
} from './showroomTextureCache';
import type { Texture } from 'three';

const makeTexture = (name: string): Texture => ({ name, dispose: vi.fn() }) as unknown as Texture;

const SLOTS = ['nose', 'bodywork', 'wings'] as const;

describe('showroomTextureCache', () => {
  beforeEach(() => {
    __resetCacheForTests();
  });

  it('generates on first acquire (miss) and hits on re-acquire of same key', () => {
    const gen = vi.fn((slot: string) => makeTexture(`t1-${slot}`));
    const first = acquireSet('car', 'mercedes:en', SLOTS, gen);
    expect(first.hit).toBe(false);
    expect(gen).toHaveBeenCalledTimes(SLOTS.length);

    const second = acquireSet('car', 'mercedes:en', SLOTS, gen);
    expect(second.hit).toBe(true);
    expect(gen).toHaveBeenCalledTimes(SLOTS.length); // no regeneration
    expect(second.textures).toBe(first.textures); // same instances

    const stats = getCacheStats('car');
    expect(stats.misses).toBe(1);
    expect(stats.hits).toBe(1);
  });

  it('reference counting: texture not disposed while still referenced', () => {
    const a = acquireSet('car', 'mercedes:en', SLOTS, (s) => makeTexture(`a-${s}`));
    const b = acquireSet('car', 'mercedes:en', SLOTS, (s) => makeTexture(`b-${s}`));
    expect(a.hit).toBe(false);
    expect(b.hit).toBe(true);

    a.release();
    const body = b.textures.get('bodywork')!;
    expect(vi.mocked(body.dispose as ReturnType<typeof vi.fn>).mock.calls.length).toBe(0);

    b.release();
    // Refcount reached 0 -> retained as the single inactive set, so textures
    // are NOT disposed until eviction.
    expect(vi.mocked(body.dispose as ReturnType<typeof vi.fn>).mock.calls.length).toBe(0);
  });

  it('evicts the LRU inactive set beyond capacity and disposes its textures once', () => {
    // Release order defines the inactive order: ferrari freed first -> tail.
    const ferrari = acquireSet('car', 'ferrari:en', SLOTS, (s) => makeTexture(`f-${s}`));
    const mercedes = acquireSet('car', 'mercedes:en', SLOTS, (s) => makeTexture(`m-${s}`));
    // Hold texture references BEFORE release — eviction clears the entry map.
    const ferrariNose = ferrari.textures.get('nose');
    mercedes.release(); // inactive order: [mercedes]
    ferrari.release(); // order: [ferrari, mercedes] -> ferrari is the tail

    const mclaren = acquireSet('car', 'mclaren:en', SLOTS, (s) => makeTexture(`c-${s}`));
    mclaren.release(); // ferrari (tail) evicted to keep MAX_INACTIVE_SETS=1

    const stats = getCacheStats('car');
    expect(stats.entries).toBe(MAX_INACTIVE_SETS);
    expect(hasSet('car', 'ferrari:en')).toBe(false);
    expect(hasSet('car', 'mclaren:en')).toBe(true);

    const tex = ferrariNose as unknown as { dispose: ReturnType<typeof vi.fn> };
    expect(tex.dispose).toHaveBeenCalledTimes(1);
  });

  it('releasing another set evicts the oldest inactive set (FIFO tail)', () => {
    const m = acquireSet('car', 'mercedes:en', SLOTS, (s) => makeTexture(`m-${s}`));
    const mNose = m.textures.get('nose');
    m.release(); // inactive order: [mercedes]
    const f = acquireSet('car', 'ferrari:en', SLOTS, (s) => makeTexture(`f-${s}`));
    f.release(); // order: [ferrari, mercedes] -> mercedes evicted (tail)
    expect(hasSet('car', 'mercedes:en')).toBe(false);
    expect(hasSet('car', 'ferrari:en')).toBe(true);
    const tex = mNose as unknown as { dispose: ReturnType<typeof vi.fn> };
    expect(tex.dispose).toHaveBeenCalledTimes(1);
  });

  it('cache key distinguishes team and language for studio textures', () => {
    const genVi = vi.fn(() => makeTexture('north-vi'));
    const genEn = vi.fn(() => makeTexture('north-en'));

    const viResult = acquireTexture('studio', 'mercedes:vi', 'north', genVi);
    const enResult = acquireTexture('studio', 'mercedes:en', 'north', genEn);
    expect(viResult.hit).toBe(false);
    expect(enResult.hit).toBe(false);
    expect(genVi).toHaveBeenCalledTimes(1);
    expect(genEn).toHaveBeenCalledTimes(1); // different key -> separate generation

    const again = acquireTexture('studio', 'mercedes:vi', 'north', genVi);
    expect(again.hit).toBe(true);
    expect(again.texture).toBe(viResult.texture);

    viResult.release();
    enResult.release();
    again.release();
  });

  it('does not reuse disposed textures after disposeAll', () => {
    const t = acquireTexture('studio', 'mercedes:vi', 'north', () => makeTexture('n'));
    t.release();
    disposeAll('studio');

    const tex = t.texture as unknown as { dispose: ReturnType<typeof vi.fn> };
    expect(tex.dispose).toHaveBeenCalledTimes(1);
    expect(hasSet('studio', 'mercedes:vi')).toBe(false);

    // Next acquire regenerates a fresh texture, not the disposed one.
    const fresh = acquireTexture('studio', 'mercedes:vi', 'north', () => makeTexture('n2'));
    expect(fresh.hit).toBe(false);
    expect(fresh.texture).not.toBe(t.texture);
    fresh.release();
  });

  it('rapid switching keeps the cache bounded with correct refcounts', () => {
    const keys = ['mercedes:en', 'ferrari:en', 'mclaren:en', 'mercedes:en', 'ferrari:en'];
    const handles = keys.map((k, i) =>
      acquireSet('car', k, SLOTS, (s) => makeTexture(`${i}-${k}-${s}`)),
    );
    [...handles].reverse().forEach((h) => h.release());

    const stats = getCacheStats('car');
    // Bounded: at most MAX_INACTIVE_SETS unreferenced entries remain.
    expect(stats.entries).toBeLessThanOrEqual(MAX_INACTIVE_SETS);
    expect(stats.referencedEntries).toBe(0);
  });

  it('concurrent same-key requests share one entry (no double generation)', () => {
    const gen = vi.fn((slot: string) => makeTexture(`shared-${slot}`));
    const a = acquireSet('car', 'mercedes:en', SLOTS, gen);
    const b = acquireSet('car', 'mercedes:en', SLOTS, gen);
    expect(gen).toHaveBeenCalledTimes(SLOTS.length);
    expect(a.textures).toBe(b.textures);
    a.release();
    b.release();
    const stats = getCacheStats('car');
    expect(stats.misses).toBe(1);
    expect(stats.hits).toBe(1);
  });

  it('disposeAll resets hit/miss counters and clears both namespaces', () => {
    acquireSet('car', 'mercedes:en', SLOTS, (s) => makeTexture(`m-${s}`));
    acquireTexture('studio', 'mercedes:vi', 'north', () => makeTexture('n'));
    disposeAll();
    expect(getCacheStats('car').entries).toBe(0);
    expect(getCacheStats('car').misses).toBe(0);
    expect(getCacheStats('studio').entries).toBe(0);
  });

  it('release after eviction is a safe no-op (no crash, no double dispose)', () => {
    const m = acquireSet('car', 'mercedes:en', SLOTS, (s) => makeTexture(`m-${s}`));
    const mNose = m.textures.get('nose');
    m.release();
    const f = acquireSet('car', 'ferrari:en', SLOTS, (s) => makeTexture(`f-${s}`));
    f.release(); // order: [ferrari, mercedes] -> mercedes evicted

    expect(() => m.release()).not.toThrow();
    const tex = mNose as unknown as { dispose: ReturnType<typeof vi.fn> };
    expect(tex.dispose).toHaveBeenCalledTimes(1);
  });
});
