import { describe, expect, it, beforeEach, vi } from 'vitest';
import {
  acquireSet,
  acquireExistingSet,
  acquirePreparedSet,
  disposePreparedSet,
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

  it('evicts the LRU inactive set beyond capacity and disposes its textures once', async () => {
    // Release order defines the inactive order: ferrari freed first -> tail.
    const ferrari = acquireSet('car', 'ferrari:en', SLOTS, (s) => makeTexture(`f-${s}`));
    const mercedes = acquireSet('car', 'mercedes:en', SLOTS, (s) => makeTexture(`m-${s}`));
    // Hold texture references BEFORE release — eviction clears the entry map.
    const ferrariNose = ferrari.textures.get('nose');
    mercedes.release(); // inactive order: [mercedes]
    ferrari.release(); // order: [ferrari, mercedes] -> mercedes is the tail

    const mclaren = acquireSet('car', 'mclaren:en', SLOTS, (s) => makeTexture(`c-${s}`));
    mclaren.release(); // ferrari (tail) evicted to keep MAX_INACTIVE_SETS=1
    await Promise.resolve();

    const stats = getCacheStats('car');
    expect(stats.entries).toBe(MAX_INACTIVE_SETS);
    expect(hasSet('car', 'ferrari:en')).toBe(false);
    expect(hasSet('car', 'mclaren:en')).toBe(true);

    const tex = ferrariNose as unknown as { dispose: ReturnType<typeof vi.fn> };
    expect(tex.dispose).toHaveBeenCalledTimes(1);
  });

  it('releasing another set evicts the oldest inactive set (FIFO tail)', async () => {
    const m = acquireSet('car', 'mercedes:en', SLOTS, (s) => makeTexture(`m-${s}`));
    const mNose = m.textures.get('nose');
    m.release(); // inactive order: [mercedes]
    const f = acquireSet('car', 'ferrari:en', SLOTS, (s) => makeTexture(`f-${s}`));
    f.release(); // order: [ferrari, mercedes] -> mercedes evicted (tail)
    await Promise.resolve();
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

  it('rapid switching keeps the cache bounded with correct refcounts', async () => {
    const keys = ['mercedes:en', 'ferrari:en', 'mclaren:en', 'mercedes:en', 'ferrari:en'];
    const handles = keys.map((k, i) =>
      acquireSet('car', k, SLOTS, (s) => makeTexture(`${i}-${k}-${s}`)),
    );
    [...handles].reverse().forEach((h) => h.release());
    await Promise.resolve();

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

  it('commits a prepared set and reuses it without synchronous regeneration', () => {
    const prepared = new Map(SLOTS.map((slot) => [slot, makeTexture(`prepared-${slot}`)]));
    const first = acquirePreparedSet('car', 'mercedes:prepared', prepared);
    const second = acquireExistingSet('car', 'mercedes:prepared');

    expect(first.hit).toBe(false);
    expect(second?.hit).toBe(true);
    expect(second?.textures).toBe(first.textures);
    first.release();
    second?.release();
  });

  it('disposes redundant prepared textures when another consumer wins the key race', () => {
    const winnerTextures = new Map(SLOTS.map((slot) => [slot, makeTexture(`winner-${slot}`)]));
    const loserTextures = new Map(SLOTS.map((slot) => [slot, makeTexture(`loser-${slot}`)]));
    const loserNose = loserTextures.get('nose') as unknown as {
      dispose: ReturnType<typeof vi.fn>;
    };

    const winner = acquirePreparedSet('car', 'mercedes:race', winnerTextures);
    const joined = acquirePreparedSet('car', 'mercedes:race', loserTextures);

    expect(joined.hit).toBe(true);
    expect(joined.textures).toBe(winner.textures);
    expect(loserNose.dispose).toHaveBeenCalledTimes(1);
    expect(loserTextures.size).toBe(0);
    winner.release();
    joined.release();
  });

  it('disposes every texture from an interrupted prepared set', () => {
    const prepared = new Map(SLOTS.map((slot) => [slot, makeTexture(`cancelled-${slot}`)]));
    const textures = [...prepared.values()] as unknown as Array<{
      dispose: ReturnType<typeof vi.fn>;
    }>;

    disposePreparedSet(prepared);

    expect(prepared.size).toBe(0);
    textures.forEach((texture) => expect(texture.dispose).toHaveBeenCalledTimes(1));
    expect(getCacheStats('car').entries).toBe(0);
  });

  it('retains a returning key across React cleanup-before-setup ordering', async () => {
    const generator = vi.fn((slot: string) => makeTexture(`texture-${slot}`));
    const mercedes = acquireSet('car', 'mercedes:en', SLOTS, generator);
    mercedes.release();
    const ferrari = acquireSet('car', 'ferrari:en', SLOTS, generator);

    // A dependency change cleans up Ferrari before the next committed layout
    // effect reacquires Mercedes. Eviction must wait through that setup.
    ferrari.release();
    const returningMercedes = acquireSet('car', 'mercedes:en', SLOTS, generator);
    await Promise.resolve();

    expect(returningMercedes.hit).toBe(true);
    expect(generator).toHaveBeenCalledTimes(SLOTS.length * 2);
    expect(getCacheStats('car')).toMatchObject({
      entries: 2,
      referencedEntries: 1,
      totalReferences: 1,
      inactiveOrderLength: 1,
    });
    returningMercedes.release();
  });

  it('disposeAll resets hit/miss counters and clears both namespaces', () => {
    const car = acquireSet('car', 'mercedes:en', SLOTS, (s) => makeTexture(`m-${s}`));
    const studio = acquireTexture('studio', 'mercedes:vi', 'north', () => makeTexture('n'));
    disposeAll();
    expect(getCacheStats('car').pendingDisposals).toBe(1);
    expect(getCacheStats('studio').pendingDisposals).toBe(1);
    car.release();
    studio.release();
    expect(getCacheStats('car').entries).toBe(0);
    expect(getCacheStats('car').misses).toBe(0);
    expect(getCacheStats('studio').entries).toBe(0);
  });

  it('release after eviction is a safe no-op (no crash, no double dispose)', async () => {
    const m = acquireSet('car', 'mercedes:en', SLOTS, (s) => makeTexture(`m-${s}`));
    const mNose = m.textures.get('nose');
    m.release();
    const f = acquireSet('car', 'ferrari:en', SLOTS, (s) => makeTexture(`f-${s}`));
    f.release(); // order: [ferrari, mercedes] -> mercedes evicted
    await Promise.resolve();

    expect(() => m.release()).not.toThrow();
    const tex = mNose as unknown as { dispose: ReturnType<typeof vi.fn> };
    expect(tex.dispose).toHaveBeenCalledTimes(1);
  });

  it('makes each release handle idempotent without refcount underflow or duplicate LRU keys', () => {
    const handle = acquireSet('car', 'mercedes:en', SLOTS, (slot) => makeTexture(`m-${slot}`));

    handle.release();
    handle.release();
    handle.release();

    expect(getCacheStats('car')).toMatchObject({
      entries: 1,
      referencedEntries: 0,
      totalReferences: 0,
      inactiveOrderLength: 1,
    });
  });

  it('does not let a stale handle mutate a replacement entry with the same key', () => {
    const stale = acquireSet('car', 'mercedes:en', SLOTS, (slot) => makeTexture(`old-${slot}`));
    __resetCacheForTests();

    const replacement = acquireSet('car', 'mercedes:en', SLOTS, (slot) =>
      makeTexture(`new-${slot}`),
    );
    stale.release();

    expect(getCacheStats('car')).toMatchObject({
      entries: 1,
      referencedEntries: 1,
      totalReferences: 1,
    });
    replacement.release();
    expect(getCacheStats('car').totalReferences).toBe(0);
  });

  it('keeps resources valid until every overlapping consumer releases', () => {
    const first = acquireSet('car', 'mercedes:en', SLOTS, (slot) => makeTexture(`shared-${slot}`));
    const second = acquireSet('car', 'mercedes:en', SLOTS, (slot) => makeTexture(`unused-${slot}`));
    const nose = first.textures.get('nose') as unknown as {
      dispose: ReturnType<typeof vi.fn>;
    };

    disposeAll('car');
    expect(getCacheStats('car')).toMatchObject({ totalReferences: 2, pendingDisposals: 1 });
    first.release();
    expect(nose.dispose).not.toHaveBeenCalled();
    second.release();
    expect(nose.dispose).toHaveBeenCalledTimes(1);
    expect(getCacheStats('car').entries).toBe(0);
  });

  it('survives repeated route mount and teardown cycles without retained references', () => {
    for (let cycle = 0; cycle < 5; cycle += 1) {
      const car = acquireSet('car', `team-${cycle}`, SLOTS, (slot) =>
        makeTexture(`${cycle}-${slot}`),
      );
      const studio = acquireTexture('studio', `team-${cycle}:vi`, 'north', () =>
        makeTexture(`${cycle}-north`),
      );

      disposeAll();
      car.release();
      studio.release();

      expect(getCacheStats('car')).toMatchObject({ entries: 0, totalReferences: 0 });
      expect(getCacheStats('studio')).toMatchObject({ entries: 0, totalReferences: 0 });
    }
  });
});
