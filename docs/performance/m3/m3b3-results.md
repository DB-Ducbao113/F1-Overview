# M3B.3 hardening and final verification

## Scope and commits

- Fixed baseline: `f6bde5474d9692ef3fa58e8cd466a76abc14f202`.
- Final application candidate: `a66100aba3236f46b8c86865c4a8958fcdc31d68`.
- Branch: `perf/speed-insights-v2`.

No model geometry, car/studio texture dimensions, texture content, materials,
512 px reflection, lighting, shadows, DPR, F1 data, synchronization workflow,
or unrelated route was changed.

## Cache lifecycle implementation

`showroomTextureCache.ts` now gives every acquired entry an identity-bound
release closure. A release is idempotent, refuses to decrement a zero refcount,
and can mutate only the exact entry it acquired. A stale handle therefore
cannot release a replacement entry created later with the same key.

`disposeAll()` immediately disposes inactive entries and marks referenced
entries for disposal after their final consumer releases. This makes parent
and child cleanup order safe during route exit and context teardown. LRU
eviction is deferred through the layout-effect replacement commit, retaining
the current plus most-recent inactive set without disposing a resource between
React cleanup and setup.

`useShowroomTextureSet.ts` acquires in `useLayoutEffect`, never during render.
Abandoned concurrent renders and server renders therefore generate no texture
and own no unreleasable handle. During a committed key transition, the previous
set stays attached only through the layout phase; React replaces it before
paint, which avoids a transient scene unmount.

`F1Car3DModel.tsx` and `StudioW15Stage.tsx` keep the GLB/studio out of the scene
graph during the initial empty acquisition commit. The ready commit mounts the
unchanged scene once. The reflector was moved into a no-prop memoized component
because A/B browser evidence showed each parent rerender recreated five render
target textures and one geometry. Its resolution and every visual parameter
remain unchanged.

## Adversarial tests

The cache and hook tests cover:

- double release and refcount underflow;
- stale release after disposal and same-key reacquisition;
- overlapping consumers and deferred disposal;
- bounded eviction and adjacent return hits;
- repeated mount/teardown cycles;
- route cleanup in either parent/child effect order;
- uncommitted server render and interrupted render;
- StrictMode development mount, unmount, and remount.

StrictMode browser evidence recorded exactly one car and one studio reference
after mount, zero entries after unmount, and one reference each after remount.
The adjacent return path recorded one cache hit in both namespaces.

## Browser resource QA

Raw evidence:

- [`m3b3-resource-qa.json`](artifacts/m3b3-hardening/m3b3-resource-qa.json)
- [`m3b3-strict-leak-qa.json`](artifacts/m3b3-hardening/m3b3-strict-leak-qa.json)
- [`m3b3-texture-ab.json`](artifacts/m3b3-hardening/m3b3-texture-ab.json)
- [`m3b3-heap-sampling-baseline.json`](artifacts/m3b3-hardening/m3b3-heap-sampling-baseline.json)
- [`m3b3-heap-sampling-candidate.json`](artifacts/m3b3-hardening/m3b3-heap-sampling-candidate.json)

### Rapid switching and bounded residency

Five switches across Ferrari, McLaren, and Mercedes kept both namespaces at
two entries, one active reference, zero pending disposals, 61 geometries, 34
renderer textures, and 23 programs after the first cold switch. Repeated
Vietnamese/English changes stayed at 61 geometries and 25 textures after both
language variants were resident. This closes the prior 49 to 94 texture-count
growth caused by reflector render targets being recreated on each stage render.

Measured maximum long tasks during the final rapid team sequence were 279,
273, 333, 254, and 177 ms. Cold procedural generation remains expensive; the
return hit avoids regeneration, but this phase does not reduce texture quality
or implement the M3B.4 startup work.

### Route exit and heap sampling

All five complete Showroom enter/exit cycles ended with car/studio entries `0`,
references `0`, pending disposals `0`, and no renderer diagnostics object. Every
fresh entry reported 61 geometries, 21 textures, and 23 programs.

The five-cycle paired heap harness showed the same detached-tree trend in the
fixed M3B.1 baseline and candidate. After cycle five:

| Measurement     | M3B.1 baseline |    Candidate |
| --------------- | -------------: | -----------: |
| V8 used heap    |   10,133,260 B | 10,123,808 B |
| Embedder heap   |    7,014,048 B |  7,043,288 B |
| Backing storage |    8,949,634 B |  8,954,033 B |
| DOM nodes       |          4,567 |        4,557 |
| Event listeners |            482 |          482 |

Sampling attributes retained allocations mainly to React/Three renderer code.
The matching baseline pattern and zero cache entries/references show that this
is not a new cache regression. It remains a renderer/SPA lifecycle observation
for a later investigation.

## Paired Lighthouse

Chrome `155.0.8059.40`, Lighthouse `13.5.0`, identical hardware, Vite
production preview, cold cache, and default Lighthouse throttling were used.
Five runs per device per commit were paired, with candidate order reversed on
alternating rounds. Raw rows and configuration are in
[`m3b3-paired-lighthouse.csv`](artifacts/m3b3-hardening/m3b3-paired-lighthouse.csv)
and [`m3b3-paired-lighthouse.json`](artifacts/m3b3-hardening/m3b3-paired-lighthouse.json).

| Profile | Commit    | Score median |     FCP median (range) |        LCP median (range) |        TBT median (range) | Main thread median (range) |    CLS |
| ------- | --------- | -----------: | ---------------------: | ------------------------: | ------------------------: | -------------------------: | -----: |
| Desktop | M3B.1     |           46 |       582 ms (580-583) |    2,810 ms (2,805-2,815) |    3,462 ms (3,249-3,957) |     7,215 ms (6,859-8,199) | 0.0012 |
| Desktop | Candidate |           45 |       585 ms (580-601) |    2,858 ms (2,844-2,881) |    3,270 ms (3,188-4,263) |     6,888 ms (6,627-8,775) | 0.0012 |
| Mobile  | M3B.1     |           31 | 2,902 ms (2,808-2,909) | 16,410 ms (16,400-16,495) | 13,619 ms (12,585-14,326) |  28,157 ms (26,153-29,095) |      0 |
| Mobile  | Candidate |           31 | 2,906 ms (2,903-2,907) | 16,482 ms (16,471-16,518) | 12,874 ms (12,133-13,629) |  25,731 ms (24,495-26,946) |      0 |

Median TBT improved 5.5% on desktop and 5.5% on mobile. Median main-thread work
improved 4.5% and 8.6%. LCP increased 48 ms desktop and 72 ms mobile; CLS was
unchanged. Desktop paired TBT differences were `+724, +146, -274, -73, -27 ms`;
mobile differences were `-992, +146, -1410, +10, -938 ms`. The ranges and
paired rows are reported because WebGL startup remains variable. The final
medians do not show a persistent TBT regression.

Mobile LCP remains far above 2.5 seconds and is still an open release issue.
M3B.4 must address startup work separately.

## Visual and functional verification

Screenshots at 390, 768, 1280, 1440, and 1920 px are under
[`screenshots`](artifacts/m3b3-hardening/screenshots). Review confirmed the
same Mercedes model, materials, sponsor graphics, studio lighting, shadows,
floor reflection, controls, and responsive composition. Reduced motion,
language, hidden/off-screen restoration, WebGL context restore, rapid livery
switching, and five route cycles all passed. Local Vercel telemetry endpoint
404s are expected under Vite preview.

## Final local validation

- ESLint: PASS.
- Prettier check: PASS.
- Tests: 61 files / 456 tests PASS.
- Coverage: 63.2% statements, 59.8% branches, 68.51% functions, 63.96% lines.
- Production build: PASS.
- Showroom chunk: 92.51 KiB gzip.
- `vendor-three`: 249.28 KiB gzip, unchanged and route-isolated.

## Exact changed files

Application and tests:

- `src/components/showroom/CameraController.tsx`
- `src/components/showroom/F1Car3DModel.tsx`
- `src/components/showroom/ShowroomView.tsx`
- `src/components/showroom/StudioW15Stage.tsx`
- `src/components/showroom/showroomTextureCache.ts`
- `src/components/showroom/showroomTextureCache.test.ts`
- `src/components/showroom/useShowroomTextureSet.ts`
- `src/components/showroom/useShowroomTextureSet.test.tsx`

Documentation and evidence:

- `docs/performance/m3/m3b2-final-verification.md`
- `docs/performance/m3/m3b3-results.md`
- `docs/performance/release-gates.md`
- `docs/performance/m3/artifacts/m3b3-hardening/*`

## Risks and rollback

- WebGL context restoration still has a measured finite rebuild long task.
- Startup LCP/TBT remain poor in absolute terms, especially on mobile.
- React/Three route cycling retains a baseline-level amount of DOM/embedder
  state even after forced GC; the candidate does not worsen it.

Rollback the application change with `git revert a66100aba3236f46b8c86865c4a8958fcdc31d68`.
This restores the prior cache implementation without changing F1 data or other
routes.

## Gate decision

Local application, lifecycle, browser, resource, Lighthouse, visual, test, and
build gates are **GO for branch review**. Merge and Production remain **NO-GO**
until exact final documentation commit CI and Vercel Preview are verified. Do
not start M3B.4 until this gate is reviewed.
