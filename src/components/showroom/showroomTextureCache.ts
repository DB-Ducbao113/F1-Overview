/**
 * M3B.3 — Bounded, reference-counted procedural texture cache for the Showroom.
 *
 * Design notes (mirrors docs/performance/m3/optimization-proposal.md item 3):
 * - Cache key includes every rendering input that affects generated pixels:
 *   texture slot name, team, language, and a generator revision constant.
 * - Two independent namespaces: `car` and `studio`, because their invalidation
 *   requirements differ (car textures depend on sponsors; studio backdrops on
 *   language) and their lifetimes are tracked separately.
 * - Bounded: retains the active entry set (referenced) plus at most
 *   `MAX_INACTIVE_SETS` fully unreferenced livery sets (LRU eviction).
 * - Reference counting: material-owning code acquires with `acquireSet` and
 *   must release via the returned handle. A texture is disposed only when its
 *   refcount reaches 0 AND its set is evicted.
 * - A cache set is created atomically per set key; concurrent requests for
 *   the same key cannot double-generate (synchronous generation plus entry
 *   insertion happen inside the same guard).
 * - Route unmount / Canvas teardown: consumers release their references;
 *   `disposeAll` clears everything, including retained inactive entries.
 */

import type { Texture } from 'three';

export type TextureNamespace = 'car' | 'studio';

/** Bump when any generator's pixel output or sampling config changes. */
export const CAR_TEXTURE_REVISION = 1;
export const STUDIO_TEXTURE_REVISION = 1;

/** Number of fully-unreferenced livery sets retained beyond the active one. */
export const MAX_INACTIVE_SETS = 1;

export interface CacheStats {
  entries: number;
  referencedEntries: number;
  totalReferences: number;
  pendingDisposals: number;
  inactiveOrderLength: number;
  hits: number;
  misses: number;
}

interface CacheEntry {
  id: symbol;
  textures: Map<string, Texture>;
  refCount: number;
  lastUsed: number;
  disposeWhenUnused: boolean;
}

interface CacheState {
  entries: Map<string, CacheEntry>;
  /** LRU of keys with refCount 0: most-recently-freed first, evict from tail. */
  inactiveOrder: string[];
  hits: number;
  misses: number;
  evictionScheduled: boolean;
  evictionEpoch: number;
}

const namespaces: Record<TextureNamespace, CacheState> = {
  car: {
    entries: new Map(),
    inactiveOrder: [],
    hits: 0,
    misses: 0,
    evictionScheduled: false,
    evictionEpoch: 0,
  },
  studio: {
    entries: new Map(),
    inactiveOrder: [],
    hits: 0,
    misses: 0,
    evictionScheduled: false,
    evictionEpoch: 0,
  },
};

/** Dispose a texture safely; never throws even if already disposed. */
const safeDispose = (texture: Texture | undefined): void => {
  if (texture && typeof texture.dispose === 'function') {
    try {
      texture.dispose();
    } catch {
      // Already disposed or context gone — eviction must not throw.
    }
  }
};

const disposeEntry = (entry: CacheEntry): void => {
  entry.textures.forEach((t) => safeDispose(t));
  entry.textures.clear();
};

const disposeTextureMap = (textures: Map<string, Texture>): void => {
  textures.forEach((texture) => safeDispose(texture));
  textures.clear();
};

const evictIfNeeded = (ns: TextureNamespace): void => {
  const state = namespaces[ns];
  while (state.inactiveOrder.length > MAX_INACTIVE_SETS) {
    const lruKey = state.inactiveOrder[state.inactiveOrder.length - 1];
    const entry = state.entries.get(lruKey);
    if (entry && entry.refCount === 0) {
      disposeEntry(entry);
      state.entries.delete(lruKey);
    }
    state.inactiveOrder.pop();
  }
};

const scheduleEviction = (ns: TextureNamespace): void => {
  const state = namespaces[ns];
  if (state.evictionScheduled) return;
  state.evictionScheduled = true;
  const epoch = state.evictionEpoch;
  queueMicrotask(() => {
    if (state.evictionEpoch !== epoch) return;
    state.evictionScheduled = false;
    evictIfNeeded(ns);
  });
};

const removeFromInactive = (state: CacheState, key: string): void => {
  state.inactiveOrder = state.inactiveOrder.filter((inactiveKey) => inactiveKey !== key);
};

const createRelease = (
  ns: TextureNamespace,
  setKey: string,
  acquiredEntry: CacheEntry,
): (() => void) => {
  let released = false;

  return () => {
    if (released) return;
    released = true;

    const state = namespaces[ns];
    const currentEntry = state.entries.get(setKey);

    // The key may have been disposed and recreated. A handle can only release
    // the exact entry it acquired; it must never mutate a replacement entry.
    if (currentEntry !== acquiredEntry) return;
    if (currentEntry.refCount <= 0) return;

    currentEntry.refCount -= 1;
    if (currentEntry.refCount > 0) return;

    if (currentEntry.disposeWhenUnused) {
      removeFromInactive(state, setKey);
      disposeEntry(currentEntry);
      state.entries.delete(setKey);
      return;
    }

    removeFromInactive(state, setKey);
    state.inactiveOrder.unshift(setKey);
    // React runs the old layout-effect cleanup before setting up the new
    // committed effect. Defer LRU eviction through that setup so a returning
    // key can be retained instead of being evicted one instruction too soon.
    scheduleEviction(ns);
  };
};

export interface AcquireResult {
  textures: Map<string, Texture>;
  /** Must be called exactly once when the consumer stops using the set. */
  release: () => void;
  hit: boolean;
  key: string;
}

/** Acquire an already-generated set without starting synchronous work. */
export const acquireExistingSet = (ns: TextureNamespace, setKey: string): AcquireResult | null => {
  const state = namespaces[ns];
  const existing = state.entries.get(setKey);
  if (!existing) return null;

  if (existing.refCount === 0) removeFromInactive(state, setKey);
  existing.refCount += 1;
  existing.disposeWhenUnused = false;
  existing.lastUsed = performance.now();
  state.hits += 1;
  evictIfNeeded(ns);
  return {
    textures: existing.textures,
    release: createRelease(ns, setKey, existing),
    hit: true,
    key: setKey,
  };
};

/**
 * Commit a fully-generated set atomically. If another committed consumer won
 * the race, its entry is reused and the redundant prepared textures are
 * disposed immediately.
 */
export const acquirePreparedSet = (
  ns: TextureNamespace,
  setKey: string,
  textures: Map<string, Texture>,
): AcquireResult => {
  const existing = acquireExistingSet(ns, setKey);
  if (existing) {
    disposeTextureMap(textures);
    return existing;
  }

  const state = namespaces[ns];
  const entry: CacheEntry = {
    id: Symbol(setKey),
    textures,
    refCount: 1,
    lastUsed: performance.now(),
    disposeWhenUnused: false,
  };
  state.entries.set(setKey, entry);
  state.misses += 1;
  evictIfNeeded(ns);
  return {
    textures,
    release: createRelease(ns, setKey, entry),
    hit: false,
    key: setKey,
  };
};

/** Dispose a generated set that never reached the cache (cancelled render). */
export const disposePreparedSet = (textures: Map<string, Texture>): void => {
  disposeTextureMap(textures);
};

/**
 * Acquire a set of textures for a livery set key.
 *
 * `generate` runs only on a miss and must return a fresh texture per slot.
 * At most one generation happens per key: a synchronous, single-threaded
 * generation plus entry insertion inside the same guard means concurrent
 * requests (two components mounting simultaneously) share one entry.
 */
export const acquireSet = (
  ns: TextureNamespace,
  setKey: string,
  slotNames: readonly string[],
  generate: (slot: string) => Texture,
): AcquireResult => {
  const existing = acquireExistingSet(ns, setKey);
  if (existing) return existing;

  // Miss: generate each requested slot once, then insert atomically.
  const textures = new Map<string, Texture>();
  for (const slot of slotNames) {
    textures.set(slot, generate(slot));
  }
  return acquirePreparedSet(ns, setKey, textures);
};

/** Acquire a single texture (convenience for the four studio backdrops). */
export const acquireTexture = (
  ns: TextureNamespace,
  setKey: string,
  slot: string,
  generate: () => Texture,
): { texture: Texture; release: () => void; hit: boolean } => {
  const result = acquireSet(ns, setKey, [slot], () => generate());
  return { texture: result.textures.get(slot)!, release: result.release, hit: result.hit };
};

/** True when the set exists in the cache (used by cache-hit diagnostics). */
export const hasSet = (ns: TextureNamespace, setKey: string): boolean =>
  namespaces[ns].entries.has(setKey);

/** Diagnostics snapshot for a namespace. */
export const getCacheStats = (ns: TextureNamespace): CacheStats => {
  const state = namespaces[ns];
  let referenced = 0;
  let references = 0;
  let pendingDisposals = 0;
  state.entries.forEach((e) => {
    if (e.refCount > 0) referenced += 1;
    references += e.refCount;
    if (e.disposeWhenUnused) pendingDisposals += 1;
  });
  return {
    entries: state.entries.size,
    referencedEntries: referenced,
    totalReferences: references,
    pendingDisposals,
    inactiveOrderLength: state.inactiveOrder.length,
    hits: state.hits,
    misses: state.misses,
  };
};

/**
 * Dispose every unreferenced texture and mark active entries for disposal as
 * soon as their final consumer releases them. This is safe regardless of
 * parent/child React effect-cleanup order.
 */
export const disposeAll = (ns?: TextureNamespace): void => {
  const targets: TextureNamespace[] = ns ? [ns] : ['car', 'studio'];
  targets.forEach((n) => {
    const state = namespaces[n];
    state.entries.forEach((entry, key) => {
      if (entry.refCount === 0) {
        disposeEntry(entry);
        state.entries.delete(key);
      } else {
        entry.disposeWhenUnused = true;
      }
    });
    state.inactiveOrder.length = 0;
    state.hits = 0;
    state.misses = 0;
    state.evictionScheduled = false;
    state.evictionEpoch += 1;
  });
};

/** Test/teardown helper: full internal reset. */
export const __resetCacheForTests = (): void => {
  (['car', 'studio'] as const).forEach((namespace) => {
    const state = namespaces[namespace];
    state.entries.forEach((entry) => disposeEntry(entry));
    state.entries.clear();
    state.inactiveOrder.length = 0;
    state.hits = 0;
    state.misses = 0;
    state.evictionScheduled = false;
    state.evictionEpoch += 1;
  });
};
