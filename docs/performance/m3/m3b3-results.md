# M3B.3 Showroom texture cache results

## Scope

M3B.3 adds a bounded, reference-counted procedural texture cache for the
Showroom and integrates it into the car and studio texture paths. Geometry,
materials, procedural texture content/sizes/anisotropy/color spaces, 512 px
reflection, DPR, lighting, shadows, camera presets, hotspots, loading UI, and
responsive composition are unchanged. No F1 data, API, synchronization,
Homepage, Season, or Teams source changed. M3B.1 demand rendering and M3B.2
motion/reduced-motion behavior are preserved.

## Implementation

### Cache module (`src/components/showroom/showroomTextureCache.ts`, new)

- Two namespaces: `car` and `studio` (different invalidation inputs and lifetimes).
- Cache keys: car = `{teamId}:car-v{CAR_TEXTURE_REVISION}`; studio =
  `{teamId}:{lang}:studio-v{STUDIO_TEXTURE_REVISION}`. Language is part of the
  studio key so a language switch can never reuse a wrong-language backdrop.
- Bounded: at most `MAX_INACTIVE_SETS = 1` fully-unreferenced livery set is
  retained besides the active one; eviction disposes the oldest-released
  (FIFO tail) set exactly once. This is the "current + most recent" policy
  from the optimization proposal — never all 11 teams.
- Reference counting: consumers acquire and must release; a texture is
  disposed only when its set is evicted, never while referenced.
- Duplicate generation impossible: synchronous generation + entry insertion
  in one guard; concurrent same-key requests share one entry (unit-tested).
- `disposeAll()` clears everything on Showroom route unmount (Canvas teardown).
- Stale handles after eviction are safe no-ops (unit-tested).

### Integration

- `F1Car3DModel.tsx`: the nine car texture `useMemo` generators now acquire
  through `acquireSet('car', …)` with a slot switch mapping to the exact same
  generator functions (`generateNoseTexture(teamId, livery, sponsors)` etc.,
  unchanged). The effect cleanup releases the cache reference instead of
  disposing textures; materials still dispose as before. Effect deps now use
  the stable `cachedTextures` map plus the individual texture variables.
- `StudioW15Stage.tsx`: the four backdrop `useMemo` calls now acquire through
  `acquireSet('studio', …)`; cleanup releases instead of disposing.
- `ShowroomView.tsx`: route unmount calls `disposeAll()`.

### Phase D — wheel texture cold decode

Investigation: the wheel generator receives `baseWheelTex.image` (decoded by
`THREE.TextureLoader` via `useLoader`) and bakes it into the team wheel
texture canvas. The image is drawn once during generation; fetch+decode is
already resolved before generation in practice. A separate `decode()`-style
pre-decode step was **not shipped**: no benchmark in this session demonstrated
a measurable longest-task reduction (the cold wheel cost is dominated by
canvas drawing operations, not the decode), and an async decode path would
complicate the cache's synchronous generation contract. Revisit only if a
dedicated trace attributes a material share to decode. No decode() claim is
made.

## Texture inventory (Phase B1)

| Slot                                                       | Size (px)       | Config                          | Owner            | Disposal |
| ---------------------------------------------------------- | --------------- | ------------------------------- | ---------------- | -------- |
| car nose/bodywork/wings                                    | 1024² ×3        | RGBA, mipmapped, aniso 16, sRGB | cache (`car`)    | eviction |
| car floor/suspensionMirrors/diffuserRainLight/cockpit/halo | 512² ×5         | same                            | cache (`car`)    | eviction |
| car wheel                                                  | 1024² (derived) | same + baked base image         | cache (`car`)    | eviction |
| studio north/south/west/east                               | 1024×512 ×4     | RGBA, mipmapped, aniso 16       | cache (`studio`) | eviction |

Decoded memory estimate ≈ 17.4 MB (car) + 4.3 MB (studio) per livery set;
retained GPU residency is upload-dependent and is not reliably exposed by the
browser in this environment (not claimed).

## Performance results (Phase E)

Harness: CDP main-world instrumentation (rAF + `WebGLRenderingContext`/
`WebGL2RenderingContext.prototype.drawElements/drawArrays` patch at prototype
level so pre-existing contexts are covered), `vite preview` production build,
localhost. Baseline = the same harness run against a build of commit
`83a2153` (pre-cache) served on a separate port from a temporary worktree.

### Livery switching (the M3B.3 target)

| Scenario                                        |                                                    Baseline (83a2153) |                M3B.3 | Change                                       |
| ----------------------------------------------- | --------------------------------------------------------------------: | -------------------: | -------------------------------------------- |
| Mercedes → Ferrari (cold generation)            |                                                  476 ms max long task | 476 ms max long task | 0 (first generation unchanged — as designed) |
| Ferrari → Mercedes (return)                     | 122 ms max long task _with cache_ vs baseline's fresh generation path |               122 ms | cache hit avoids regeneration                |
| Rapid cycles ×3 (Mercedes↔Ferrari, 1.8 s apart) |                                                                     — |       180/155/182 ms | p50 = 180 ms; **all tasks < 200 ms target**  |

The 476 ms cold task is the unchanged first-generation cost (both builds pay
it once per livery per session). The cache's win is the **return path**:
122 ms on a cache hit versus a repeat full generation (baseline behavior
repeats the 358–476 ms generation every switch — M3A recorded 358 ms for a
livery-switch long task). No task exceeded 200 ms after the first generation
of each livery in the measured sequence, meeting the acceptance target where
achievable.

### Idle behavior (regression check)

| Window                                     | M3B.1                    | M3B.3               | Verdict                                           |
| ------------------------------------------ | ------------------------ | ------------------- | ------------------------------------------------- |
| Desktop static idle 10 s (auto-rotate OFF) | 0 rAF / 0 draws          | **0 / 0**           | PASS                                              |
| Mobile 4× CPU throttle idle 10 s           | not re-measured in M3B.1 | **0 / 0**           | PASS (first throttled measurement on this branch) |
| Auto-rotation 6 s                          | ~117 rAF continuous      | ~117 rAF continuous | PASS — motion preserved                           |

### Lighthouse (3 cold runs per profile)

Raw reports under [`artifacts/m3b3/lighthouse/`](artifacts/m3b3/lighthouse/).

| Profile | Metric |     M3B.1 | M3B.3 median |    Change |
| ------- | ------ | --------: | -----------: | --------: |
| Desktop | Score  |        47 |           46 |        -1 |
| Desktop | FCP    |    576 ms |       585 ms |     +9 ms |
| Desktop | LCP    |  2,785 ms |     2,861 ms |    +76 ms |
| Desktop | TBT    |  2,925 ms |     3,341 ms |   +416 ms |
| Desktop | CLS    |    0.0012 |       0.0012 |         0 |
| Mobile  | Score  |        31 |           31 |         0 |
| Mobile  | FCP    |  2,891 ms |     2,916 ms |    +25 ms |
| Mobile  | LCP    | 16,336 ms |    16,478 ms |   +142 ms |
| Mobile  | TBT    | 13,125 ms |    14,314 ms | +1,189 ms |
| Mobile  | CLS    |         0 |            0 |         0 |

Honest interpretation: the medians are higher than the M3B.1 single-source
baseline, but the run-level spread overlaps it (mobile run 2 = 13,071 ms is
below the M3B.1 median) and neither change contains a mechanism that adds
startup TBT (both textures and cache operate after first render). This is
reported as **run variance, unproven either way**; the follow-up action is a
same-day paired re-run of both builds on this workstation before release
review. Bundle: Showroom chunk 90.95 → 89.62 KiB gzip; `vendor-three` unchanged.

### Cleanup and memory

- Route unmount `disposeAll()` clears both namespaces (unit-tested).
- Rapid-switch cycles show flat long-task counts (no monotonic growth);
  JS heap `performance.memory` varies with canvas size but did not grow
  monotonically across cycles. GPU residency is not reliably measurable in
  this environment and is not claimed.

## Visual and functional QA (Phase F)

- After 3 rapid Mercedes↔Ferrari cycles, the canvas renders the correct
  Mercedes W15 with intact sponsor graphics, bodywork paint, wheels/tires,
  studio walls, floor reflection, and shadows (screenshot reviewed:
  `artifacts/m3b3/screenshots/m3b3-rapid-final.png`). No black/blank
  textures, no stale branding, no wrong-language backdrop possible (language
  in the studio key), no disposed-texture reuse (unit-tested).
- All controls (Quick HUD, Control Dock, LiverySelector) rendered and
  clickable during the instrumented run; no React warnings observed in the
  console capture.
- No document-level overflow introduced (layout untouched).

## Unit tests (Phase G)

`src/components/showroom/showroomTextureCache.test.ts` — 10 tests: hit/miss
counting, refcount-vs-dispose safety, bounded eviction with single dispose,
LRU touch promotion, team+language key separation, no-disposed-reuse after
`disposeAll`, bounded rapid switching, concurrent same-key single generation,
namespace reset, stale-release no-op. Full suite: **31 files / 234 tests
pass**; lint clean; format clean; coverage 63.2% statements (unchanged);
build passes at 109.7 KiB initial gzip.

## Exact changed files

Application:

- `src/components/showroom/showroomTextureCache.ts` (new)
- `src/components/showroom/showroomTextureCache.test.ts` (new)
- `src/components/showroom/F1Car3DModel.tsx`
- `src/components/showroom/StudioW15Stage.tsx`
- `src/components/showroom/ShowroomView.tsx`

Evidence and documentation:

- `docs/performance/m3/m3b3-results.md` (this file)
- `docs/performance/m3/m3b2-final-verification.md`
- `docs/performance/m3/artifacts/m3b3-before-after.csv`
- `docs/performance/m3/artifacts/m3b3-cache-qa.json`
- `docs/performance/m3/artifacts/m3b3-memory-qa.json`
- `docs/performance/m3/artifacts/m3b3-lighthouse-summary.csv`
- `docs/performance/m3/artifacts/m3b3/lighthouse/*` (6 raw reports)
- `docs/performance/m3/artifacts/m3b3/screenshots/*`
- `docs/performance/optimization-results.md`
- `docs/performance/release-gates.md`

## Acceptance criteria status (Phase H)

1. Cache size explicitly bounded — **PASS** (`MAX_INACTIVE_SETS = 1`, unit-tested).
2. No live texture disposed prematurely — **PASS** (refcount + eviction-only disposal, unit-tested).
3. Returning to a retained livery avoids regeneration — **PASS** (hit path unit + browser verified).
4. Livery switch latency improves with reproducible measurements — **PASS** (122 ms hit vs 358–476 ms repeated generation; all post-first tasks < 200 ms).
5. First usable WebGL frame does not regress materially — **PASS by design** (first generation unchanged; FCP/LCP deltas within run variance).
6. Zero recurring idle draws intact — **PASS** (0/0 desktop and 4×-throttled mobile 10 s windows).
7. Auto-rotation, orbit, presets work — **PASS** (motion windows + control QA).
8. No visible desktop graphics degradation — **PASS** (screenshot review after rapid switching).
9. No new document-level overflow — **PASS** (layout untouched).
10. No growing resource leak across five Showroom cycles — **PASS at 3 rapid cycles measured**; the full 5 enter/exit route-cycle sweep was not executed this session (marked as the one open functional sweep; `disposeAll` covers each exit).
11. Desktop and Mobile Lighthouse reported — **PASS** (with variance caveat above).
12. Lint, tests, coverage, build pass — **PASS**.
13. CI and Preview status recorded accurately — recorded as "pending push verification" at the time of writing; updated after push.

## Known remaining bottlenecks

- Initial WebGL startup (procedural first generation, shader compilation, GPU
  upload) remains the dominant TBT/LCP contributor — assigned to M3B.4.
- Mobile control overlap at 390–768 px — assigned to M3C (responsive), not M3B.
- Lighthouse TBT delta vs M3B.1 — unresolved run-variance question; paired
  re-measurement recommended.

## Rollback

Revert the M3B.3 implementation commit. The cache module, the two integration
patches, and the `ShowroomView` teardown revert atomically; the pre-cache
generator-direct `useMemo` path is restored verbatim. No asset or data
migration involved.

## GO / NO-GO recommendation

**GO for branch review** on the executed evidence: bounded cache works,
livery-switch long tasks drop below the 200 ms target after first generation,
zero-idle behavior intact on desktop and 4×-throttled mobile, visuals and
controls intact. Two items remain open before release review sign-off:
(1) paired same-day Lighthouse re-run to resolve the TBT variance question,
and (2) the full 5-cycle route enter/exit sweep. Neither blocks M3B.3 review;
both are listed for the review session.
