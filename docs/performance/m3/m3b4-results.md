# M3B.4 — WebGL initialization results

## Scope and fixed comparison points

- Baseline commit: `151cc13dbd02829d4e25e266932a4c1c12e95d2c`.
- Candidate: the final M3B.4 commit recorded by CI after this document is committed.
- Route: `/showroom` from a local production build.
- Browser: Chrome 155.0.8059.40, Lighthouse 13.5.
- Visual resources were preserved: model geometry, materials, full desktop textures, 512 px reflection, lighting and shadows are unchanged.
- M3B.1 demand rendering and M3B.2/M3B.3 lifecycle rules remain active.

## Implementation

The candidate changes initialization in four bounded steps:

1. `useShowroomTextureSet.ts` creates one procedural texture slot per scheduled task and yields between slots. A completed set is committed atomically, so consumers never receive a partial set.
2. `showroomTextureCache.ts` separates preparation from acquisition. Prepared resources that lose an acquisition race are disposed, while the existing idempotent handle and bounded cache policy remain intact.
3. `F1CarTextures.ts` performs wheel pixel readback at the physical 512 × 512 canvas size. The former 1024 × 1024 readback inspected four times as many pixels, including coordinates outside the backing store, and discarded 75% of that work. The visible output remains 512 px.
4. `ShowroomStartupCoordinator.tsx` waits for the car and studio scene nodes, calls `WebGLRenderer.compileAsync`, requests a real submitted frame, and only then clears the DOM loader. Camera animation remains paused until this usable-frame gate is met.

The startup coordinator also repeats the readiness sequence after a WebGL context restore. Cancellation guards prevent a late asynchronous completion from updating an unmounted or replaced scene.

## Paired cold Lighthouse measurements

Five runs per device and candidate were alternated against the two fixed builds. Raw Lighthouse JSON and the complete run table are stored under `artifacts/m3b4/final-paired` and `artifacts/m3b4-before-after.csv`.

| Profile | Candidate |       TBT median (spread) | Main thread median | Longest task median | FCP median | LCP median | CLS median | Requests |    Transfer |
| ------- | --------- | ------------------------: | -----------------: | ------------------: | ---------: | ---------: | ---------: | -------: | ----------: |
| Desktop | baseline  |    5,299 ms (4,828–6,856) |          10,613 ms |            2,562 ms |     595 ms |   2,869 ms |     0.0001 |       26 | 2,995,854 B |
| Desktop | candidate |    4,790 ms (4,687–7,312) |          10,209 ms |            2,081 ms |     604 ms |   2,859 ms |     0.0001 |       26 | 2,996,962 B |
| Mobile  | baseline  | 20,808 ms (18,388–25,110) |          40,429 ms |           10,000 ms |   2,849 ms |  16,480 ms |     0.0000 |       27 | 3,007,572 B |
| Mobile  | candidate | 18,702 ms (16,330–19,243) |          33,819 ms |            8,870 ms |   2,916 ms |  16,478 ms |     0.0001 |       27 | 3,008,680 B |

Median TBT improved by 509 ms (9.6%) on desktop and 2,106 ms (10.1%) on mobile. Median main-thread work improved by 3.8% on desktop and 16.3% on mobile. LCP and request counts remained effectively unchanged. The candidate adds approximately 1.1 KB transferred to the route.

The aspirational TBT targets, desktop ≤1,000 ms and mobile ≤4,000 ms, were not reached. The M3B.4 production release gate is therefore **NO-GO** even though the paired measurements show an initialization improvement.

## Startup profiling

Three-run startup profiles separated initialization from steady rendering. The representative native measurements expose the following application marks:

- Studio texture generation: about 392 ms elapsed in the QA cold run; individual slots were 25–75 ms under instrumentation.
- Car texture generation: about 98 ms elapsed; the wheel slot was 19 ms in that run.
- Full-scene asynchronous compile: about 925 ms in the QA cold run.
- Initial renderer state: 59 geometries, 21 textures and 24 programs.

The paired CPU/trace evidence shows a shorter longest startup task, while the loader remains visible longer because its meaning changed from “React/model mounted” to “the complete scene compiled and submitted.” With the external operational proxy used for both fixed builds, first usable elapsed time changed from approximately 4,301 to 7,223 ms on desktop and 5,820 to 9,384 ms on mobile. This is a measured tradeoff: blocking work is reduced, but the current complete-scene readiness gate increases perceived wait time. It must be addressed before production release.

GLB network cost and parsing were not changed. The representative local GLB response was 2,165,196 bytes and about 29 ms network time; prior M3A measurements placed parsing at 20.6 ms native and 44.4 ms throttled, so GLB parsing was not treated as the primary target.

## Isolated experiments

| Experiment                                    | Outcome                                                                                                                     | Decision                                                                                       |
| --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Bounded texture tasks                         | Candidate paired TBT improved, and texture slots became individually measurable.                                            | Retained.                                                                                      |
| 512 px wheel readback                         | Removes the unused 1024² readback/loop while preserving the 512 px output.                                                  | Retained.                                                                                      |
| `compileAsync` disabled                       | Desktop TBT median 7,288 ms; mobile 17,296 ms in the isolated three-run set.                                                | Rejected; retain `compileAsync`.                                                               |
| Shader validation disabled                    | Desktop TBT 5,101 ms; mobile 17,676 ms.                                                                                     | Rejected; diagnostics remain unchanged.                                                        |
| Synchronous texture generation                | Desktop TBT 3,647 ms; mobile 14,721 ms, but it restores larger uninterrupted startup tasks and loses responsive scheduling. | Rejected because it conflicts with the initialization objective and task-level trace evidence. |
| Early studio-only shader warm-up              | Desktop TBT 4,927 ms; mobile 14,768 ms with high spread and duplicate/competing compile work.                               | Rejected.                                                                                      |
| Loader tied to first complete submitted frame | Correct readiness semantics, but later loader removal was measured.                                                         | Retained for correctness; perceived wait is an open blocker.                                   |

## Functional, lifecycle and visual QA

Executed browser QA is stored in `artifacts/m3b4-interaction-qa.json` and `artifacts/m3b4/m3b4-browser-qa.json`.

- Auto-rotation off: zero RAF callbacks and zero draw calls in both the first five seconds and the full ten-second idle window.
- Auto-rotation on: 25,386 indexed draws in ten seconds; frame interval P50/P95 was about 50/50.1 ms in headless Chrome.
- Camera preset, orbit drag/damping, livery switch, hotspot, language change and resize all requested frames and returned to zero recurring draws after settling.
- Hidden-tab and off-screen windows recorded zero draw calls; restoration requested a new frame.
- WebGL context loss/restore was supported and submitted a restored frame.
- Five enter/exit cycles retained one active car and studio reference per mounted route, with no refcount underflow or pending disposal.
- Viewports 390, 768, 1280, 1440 and 1920 px recorded zero horizontal overflow.
- Same-camera baseline/candidate screenshots showed no visible change to geometry, materials, lighting, shadows or reflections.

The full-motion auto-rotation measurement explicitly emulated `prefers-reduced-motion: no-preference`. A first harness run inherited reduced motion from headless Chrome and correctly prevented rotation; that invalid run was replaced rather than reported as an application failure.

## Exact changed files

Application and tests:

- `src/components/showroom/CameraController.tsx`
- `src/components/showroom/F1Car3DModel.tsx`
- `src/components/showroom/F1CarTextures.ts`
- `src/components/showroom/Showroom3DLoader.tsx`
- `src/components/showroom/ShowroomStartupCoordinator.tsx`
- `src/components/showroom/ShowroomView.tsx`
- `src/components/showroom/StudioW15Stage.tsx`
- `src/components/showroom/showroomTaskScheduler.ts`
- `src/components/showroom/showroomTaskScheduler.test.ts`
- `src/components/showroom/showroomTextureCache.ts`
- `src/components/showroom/showroomTextureCache.test.ts`
- `src/components/showroom/useShowroomTextureSet.ts`

Documentation and evidence:

- `docs/performance/m3/m3b4-baseline.md`
- `docs/performance/m3/m3b4-experiments.md`
- `docs/performance/m3/m3b4-results.md`
- `docs/performance/m3/artifacts/m3b4-before-after.csv`
- `docs/performance/m3/artifacts/m3b4-browser-qa.json`
- `docs/performance/m3/artifacts/m3b4-interaction-qa.json`
- `docs/performance/m3/artifacts/m3b4/**`
- `docs/performance/optimization-results.md`
- `docs/performance/release-gates.md`

## Validation

Final local checks passed: ESLint, Prettier, 33 test files / 246 tests, coverage at 63.2% statements, and production build/bundle check with 109.7 KiB initial JavaScript against the 180 KiB budget. The Showroom chunk is 93.62 KiB gzip and `vendor-three` remains route-isolated at 249.28 KiB gzip.

Implementation SHA `fb1184918df6e5e5e673c00956aaddc2ef0a6466` passed [CI run 38718226381](https://github.com/DB-Ducbao113/F1-Overview/actions/runs/38718226381). Vercel reported the matching deployment Ready in its [deployment dashboard](https://vercel.com/bao-bung-bu/podiumeffetdesol/By3TRFajdrJX2uRNnMgp4WLNXTed); the protected [branch Preview alias](https://podiumeffetdesol-git-perf-speed-insights-v2-bao-bung-bu.vercel.app) returned the expected 302 SSO redirect to an unauthenticated request. [Preview Smoke run 38718313823](https://github.com/DB-Ducbao113/F1-Overview/actions/runs/38718313823) passed target validation. Its k6 setup and live smoke steps were skipped because the protection bypass secret is absent, so no high-load request was sent to Preview or Production.

Raw evidence includes Lighthouse reports, compressed Chrome traces, CPU profiles, interaction JSON and screenshots. The documentation-only follow-up commit is verified separately after push because a commit cannot contain its own SHA.

## Known risks

- Both TBT targets remain unmet, and mobile TBT is still extreme under Lighthouse throttling.
- The stricter loader gate increases time before the scene is revealed even though main-thread blocking improves.
- `compileAsync` behavior depends on browser/driver implementation; the synchronous fallback remains necessary.
- Cold livery switching can still produce a large long task during shader/resource initialization.
- Field data cannot validate this branch until it receives real Preview traffic; no production deployment was performed.

## Rollback

Revert the final M3B.4 commit. This removes the startup coordinator, task scheduler, prepared-set cache API, wheel readback correction and loader readiness gate together, restoring the exact `151cc13dbd02829d4e25e266932a4c1c12e95d2c` behavior without changing any F1 data or model assets.
