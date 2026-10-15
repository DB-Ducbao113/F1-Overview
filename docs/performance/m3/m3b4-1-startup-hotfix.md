# M3B.4.1 — Showroom startup readiness hotfix

## Scope and fixed comparison

- Branch: `perf/speed-insights-v2`.
- Fixed M3B.4 baseline: `1f7b0e2d8bcf14098a185ef0caeadaf2fa45f0b3`.
- Final candidate SHA: recorded in the release-gate follow-up after commit.
- Browser: Chrome 155.0.8059.40; Lighthouse 13.0.3.
- Local production builds were served from separate immutable output folders on ports 4191 and 4192.
- Five Lighthouse runs per profile and build were alternated to reduce ordering drift. Every run used a fresh headless Chrome profile and disabled cache.
- Model geometry, materials, procedural textures, 512 px reflection, lights, shadows, DPR rules, F1 data and unrelated routes are unchanged.

## Verified critical path

M3B.4 started `compileAsync` from a normal-priority `useFrame` callback. React Three Fiber still executed its automatic `gl.render()` after that callback in the same frame. The first full-scene draw therefore competed with asynchronous shader preparation and could force the same shaders through a synchronous render path. The loader then waited for that work even though texture generation itself had already finished.

The second readiness issue was semantic. The coordinator detected named scene roots, but it did not prove that all procedural textures were committed and that the car's livery materials had been attached. This could start shader preparation against an incomplete material state and defer the real livery shader work to the submitted frame.

Five cold readiness runs produced these median timestamps from navigation start:

| Profile       | Phase                          |     M3B.4 |  M3B.4.1 |    Change |
| ------------- | ------------------------------ | --------: | -------: | --------: |
| Desktop       | First 3D draw                  |  1,793 ms | 1,190 ms |   -603 ms |
| Desktop       | Required textures ready        |  4,929 ms | 2,221 ms | -2,708 ms |
| Desktop       | Shader compilation complete    |  7,994 ms | 4,891 ms | -3,103 ms |
| Desktop       | First complete submitted frame |  7,994 ms | 4,937 ms | -3,057 ms |
| Desktop       | Loader hidden                  |  8,031 ms | 4,940 ms | -3,091 ms |
| Desktop       | First successful interaction   |  8,063 ms | 4,976 ms | -3,087 ms |
| Mobile 4x CPU | First 3D draw                  |  2,996 ms | 2,238 ms |   -758 ms |
| Mobile 4x CPU | Required textures ready        |  8,054 ms | 4,560 ms | -3,494 ms |
| Mobile 4x CPU | Shader compilation complete    | 11,319 ms | 7,203 ms | -4,116 ms |
| Mobile 4x CPU | First complete submitted frame | 11,315 ms | 7,313 ms | -4,002 ms |
| Mobile 4x CPU | Loader hidden                  | 11,492 ms | 7,335 ms | -4,157 ms |
| Mobile 4x CPU | First successful interaction   | 12,009 ms | 7,586 ms | -4,423 ms |

The small ordering overlap between the baseline compile-end and external submitted-frame probes is instrumentation scheduling in the old implementation. M3B.4.1 adds application-owned marks for committed textures, car/studio readiness, compile completion, complete-frame submission, loader removal and the first real orbit interaction.

The candidate's representative complete scene contains 61 geometries, 20–21 textures and 24 programs. Texture/program counts are unchanged from the baseline. Lighthouse user timings show desktop median studio generation 295 → 255 ms, car generation 89 → 93 ms and full-scene compile 1,856 → 780 ms. Mobile medians were 269 → 241 ms, 81 → 280 ms and 1,776 → 905 ms respectively. The mobile car-generation increase remains bounded and is outweighed by the removal of the competing synchronous render path.

## Approaches evaluated

### A. Prioritize first-visible texture generation

The car and studio caches intentionally publish complete texture sets atomically. Reordering slots cannot make the required set ready earlier, while publishing partial sets would allow a blank or incorrectly textured car/wall and weaken the hardened cache lifecycle. This approach was rejected for M3B.4.1.

### B. Safely overlap initialization without competing renders

This approach was retained. `ShowroomStartupCoordinator` takes the React Three Fiber manual render priority, skips partial/full scene draws while required committed resources or `compileAsync` are pending, submits one complete frame after compilation, and then owns normal demand renders. Existing camera, OrbitControls, auto-rotation, resize, visibility, context restore and scene-state invalidations continue to drive that single renderer; no second RAF loop was added.

The car and studio now publish explicit readiness only after their complete cached texture sets and materials are attached. Layout effects are used where readiness must precede the first complete render. Readiness updates from the outer React tree explicitly invalidate the demand renderer after the committed props reach the coordinator.

## Paired Lighthouse result

| Profile | Metric       |     M3B.4 median (spread) |   M3B.4.1 median (spread) |         Change |
| ------- | ------------ | ------------------------: | ------------------------: | -------------: |
| Desktop | TBT          |    2,137 ms (2,095–3,699) |    1,870 ms (1,630–3,171) |         -12.5% |
| Desktop | Main thread  |    5,210 ms (5,099–6,472) |    4,177 ms (4,040–4,458) |         -19.8% |
| Desktop | Longest task |      1,025 ms (954–1,881) |        863 ms (710–1,833) |         -15.8% |
| Desktop | LCP          |    2,848 ms (2,839–2,857) |    2,846 ms (2,840–2,866) |          -2 ms |
| Desktop | CLS          |                    0.0023 |                    0.0023 |      unchanged |
| Mobile  | TBT          | 12,160 ms (12,142–12,294) |    9,229 ms (9,096–9,395) |         -24.1% |
| Mobile  | Main thread  | 19,461 ms (19,365–19,777) | 14,510 ms (14,244–14,711) |         -25.4% |
| Mobile  | Longest task |    7,100 ms (7,022–7,267) |    5,622 ms (5,487–5,688) |         -20.8% |
| Mobile  | LCP          | 16,477 ms (16,412–16,478) | 16,560 ms (16,470–16,565) | +83 ms / +0.5% |
| Mobile  | CLS          |                    0.0001 |                    0.0001 |      unchanged |

The paired test environment produced lower absolute TBT than the older M3B.4 session, so only the fixed-build paired values above are used for attribution. Candidate TBT, main-thread time and longest task improve on both profiles. Mobile LCP moved by 83 ms, inside 0.5%, with identical request counts and no CLS change.

## Functional, lifecycle and visual QA

Executed browser evidence is in `artifacts/m3b4-1-readiness-qa.json`.

- The loader remained visible until required textures, car/studio readiness, shader compilation and the first complete submitted frame were all recorded in order.
- With auto-rotation off and the camera settled, the five-second idle window recorded zero recurring frames/draws.
- Camera preset, auto-rotation, orbit drag and damping, livery switching, language switching and live reduced-motion changes passed and returned to a settled demand-render state.
- Reduced-motion drag had no damping tail.
- WebGL context loss/restore completed and the restored scene passed the same readiness gate.
- Five complete route enter/exit cycles finished with one active car and studio cache reference, no refcount underflow and no pending disposal.
- Baseline/candidate captures at 390, 768, 1280, 1440 and 1920 px used the same livery, camera, lighting and settled reduced-motion state. Pixel comparison was identical at all five widths, and every viewport had zero horizontal overflow.

Raw evidence:

- `artifacts/m3b4-1/lighthouse/{baseline,candidate}/showroom-*.json`: 20 raw Lighthouse reports.
- `artifacts/m3b4-1/lighthouse/summary.json`: exact run order, rows, medians and spreads.
- `artifacts/m3b4-1/{baseline,candidate-final}/readiness.json`: five cold readiness runs per profile.
- `artifacts/m3b4-1/screenshots/`: ten PNG captures and pixel comparison JSON.
- `artifacts/m3b4-1-before-after.csv`: compact before/after table.
- `artifacts/m3b4-1-readiness-qa.json`: interaction, idle, lifecycle and resource QA.

## Exact application changes

- `CameraController.tsx`: records the first successful real orbit interaction.
- `F1Car3DModel.tsx`: memoizes livery metadata, attaches materials before complete-frame readiness and reports committed car readiness.
- `ShowroomStartupCoordinator.tsx`: owns the render pass, blocks competing startup renders, compiles only complete resources and submits the first complete frame.
- `ShowroomView.tsx`: combines explicit car/studio readiness and records loader removal.
- `StudioW15Stage.tsx`: reports complete committed backdrop readiness before paint.
- `useShowroomTextureSet.ts`: records generated and cache-hit texture readiness.

`Showroom3DLoader.tsx` and `showroomTaskScheduler.ts` were inspected and remain unchanged. Bounded procedural scheduling, cache lifecycle safety, wheel optimization, reduced motion, shader checks and all visual settings are retained.

## Validation and release decision

Final local validation passed: ESLint, Prettier, 33 test files / 246 tests, coverage at 63.2% statements / 59.8% branches / 68.51% functions / 63.96% lines, and the production build plus bundle gate. Initial JavaScript is 109.7 KiB gzip against the 180 KiB budget; the Showroom chunk is 94.28 KiB gzip and the route-isolated `vendor-three` chunk remains 249.28 KiB gzip. Exact-SHA CI, Vercel Preview and Preview Smoke results are recorded after push. Preview live smoke may be skipped when the repository protection-bypass secret is absent; this is reported separately from executed checks.

M3B.4.1 is **GO for branch review** based on measured startup, TBT, interaction, lifecycle and visual evidence. It remains **NO-GO for merge or Production** until the exact final SHA passes CI and Preview verification and the user reviews this gate. M3B.5 and M3C have not started.

## Rollback

Revert the M3B.4.1 application commit. This restores M3B.4's automatic render ownership and root-based readiness behavior without touching the texture scheduler/cache, wheel optimization, model assets, visual quality, F1 data or earlier M1/M2/M3 work.
