# M3B.1 Showroom demand-driven rendering results

## Scope

M3B.1 changes only Showroom frame scheduling. Model geometry, materials, procedural texture sizes, 512 px reflection, DPR, lighting, shadows, camera presets, auto-rotation, hotspots, loading UI, and responsive composition remain unchanged. No F1 data, API, synchronization, Homepage, Season, or Teams source was changed.

The comparison uses M3A commit `4f85caaee03269b56b695e91b8abb9d441850a1e` as the before revision and Chrome 155 / Lighthouse 13.5.0 on the same Windows workstation. Local production builds were served through Vite Preview. These are lab measurements, not Vercel field data.

## Implementation

- `ShowroomView.tsx:58-67,180,368,379` changes the active Canvas from `always` to `demand` and keeps the existing `never` state for hidden, off-screen, and context-lost conditions. `ShowroomFrameInvalidator` requests a frame when the stage becomes active, its size changes, or scene-relevant React state changes.
- `CameraController.tsx:102-207` invalidates during initial/preset interpolation, zoom, pointer start/change/end, the two-second damping tail, and auto-rotation. At the end of damping it flushes the asymptotically small OrbitControls delta and disables damping until the next pointer start; this prevents Drei's `change` listener from maintaining an infinite demand loop.
- `F1Car3DModel.tsx:37,269` requests a frame after livery textures and materials are assigned.
- `StudioW15Stage.tsx:30,46` requests a frame after the four team/language backdrop textures are ready.
- Resize is covered by R3F size state and the frame invalidator. Visibility, off-screen, and WebGL restoration reactivate the same invalidator. Hotspot/HTML, language, livery, camera, auto-rotation, and zoom state are included in `sceneRevision`.
- No independent `requestAnimationFrame` loop was added. All motion remains inside R3F `useFrame`; React effects and control events only call `invalidate()`.

## Lighthouse result

Each value is the median of three cold runs. Raw reports are in [`artifacts/m3b1/lighthouse`](artifacts/m3b1/lighthouse), and the full comparison is in [`artifacts/m3b1-before-after.csv`](artifacts/m3b1-before-after.csv).

| Profile | Metric      | M3A before | M3B.1 after | Change |
| ------- | ----------- | ---------: | ----------: | -----: |
| Desktop | Score       |         45 |          47 |     +2 |
| Desktop | FCP         |     581 ms |      576 ms |  -5 ms |
| Desktop | LCP         |   2,799 ms |    2,785 ms | -14 ms |
| Desktop | TBT         |   4,078 ms |    2,925 ms | -28.3% |
| Desktop | Main thread |   8,238 ms |    6,358 ms | -22.8% |
| Desktop | CLS         |     0.0012 |      0.0012 |      0 |
| Mobile  | Score       |         31 |          31 |      0 |
| Mobile  | FCP         |   2,900 ms |    2,891 ms |  -9 ms |
| Mobile  | LCP         |  16,367 ms |   16,336 ms | -31 ms |
| Mobile  | TBT         |  14,160 ms |   13,125 ms |  -7.3% |
| Mobile  | Main thread |  28,722 ms |   27,678 ms |  -3.6% |
| Mobile  | CLS         |          0 |           0 |      0 |

Demand rendering removes steady-state work but does not remove Three.js initialization, procedural texture generation, WebGL upload, or shader compilation. The modest Lighthouse change is therefore consistent with the M3A attribution: Lighthouse is dominated by startup, while the largest M3B.1 benefit begins after the scene settles.

## Rendering and interaction result

The browser harness wraps RAF callbacks and WebGL draw calls before application code runs. The complete machine-readable result is [`artifacts/m3b1-interaction-qa.json`](artifacts/m3b1-interaction-qa.json).

| Scenario                          | Result                                                                                   |
| --------------------------------- | ---------------------------------------------------------------------------------------- |
| Auto-rotation OFF, first 5 s idle | 0 RAF callbacks; 0 draw calls; pass                                                      |
| Auto-rotation OFF, full 10 s idle | 0 RAF callbacks; 0 draw calls; pass                                                      |
| Auto-rotation ON, 10 s            | 285 RAF callbacks; 31,768 indexed draws; 1,425 array draws; pass                         |
| Camera preset                     | 6 RAF callbacks and 744 indexed draws; then 0 draws for 5 s; pass                        |
| Orbit drag and damping            | 70 RAF callbacks and 7,608 indexed draws; then 0 draws for 5 s; pass                     |
| Livery switch                     | 2 RAF callbacks and 362 indexed draws; then 0 draws for 5 s; pass                        |
| Hotspot open/close                | overlay opened; 283 indexed draws; then 0 draws for 5 s; pass                            |
| Language change                   | 1 RAF callback and 185 indexed draws; translated UI observed; pass                       |
| Resize                            | 2 RAF callbacks and 216 indexed draws; pass                                              |
| Off-screen, 3 s                   | 0 RAF callbacks and 0 draws; restore rendered 3 callbacks; pass                          |
| Hidden tab, 3 s                   | `document.visibilityState=hidden`, 0 callbacks/draws; restore rendered 2 callbacks; pass |
| WebGL context loss/restore        | extension supported; restored frame rendered; pass                                       |

M3A's desktop static window recorded 263 callbacks, 29,442 indexed draws, and 743.9 ms callback work over 12.56 seconds. M3B.1 records zero work over ten seconds. M3A's throttled mobile static window recorded 586 callbacks, 58,014 indexed draws, and 9,838.9 ms callback work over ten seconds; the recurring loop no longer exists in M3B.1. The exact throttled mobile interaction harness was not repeated after implementation, so the zero-idle result is asserted from the native instrumentation and the demand scheduler's state-independent behavior, while Lighthouse supplies the comparable mobile CPU result.

During auto-rotation, measured RAF callback work was 499.2 ms and GPU tasks totaled 526.44 ms over ten seconds. The M3A values were 783.4 ms and 507.8 ms over 10.55 seconds. GPU duration is within run variance and continuous rendering remains active by design. Chrome trace `RunTask` events overlap across processes and nested categories, so their summed duration is not used as main-thread execution; the RAF wrapper and Lighthouse main-thread audit are the non-overlapping reported measures. Per-interaction GPU duration was not technically isolated with reliable markers and is left unreported rather than estimated.

## Visual and responsive evidence

Fresh before and after builds were placed at the overview camera with Mercedes livery, auto-rotation off, unchanged lighting, and identical viewport/device-scale settings. Ten captures are under [`artifacts/m3b1/screenshots`](artifacts/m3b1/screenshots): before/after at 390, 768, 1280, 1440, and 1920 px.

Manual side-by-side review found no change to geometry, bodywork, sponsor textures, floor reflection, lighting, shadows, control placement, or typography. Document overflow is 0 px at all five after viewports. M3B.1 intentionally leaves the previously documented mobile control overlap for a later responsive phase.

## Validation and limitations

- Local required checks: ESLint, Prettier, 29 test files / 215 tests, coverage (63.2%), and production build passed locally; final status is recorded in `release-gates.md`.
- Bundle: Showroom gzip changes from 90.38 KiB to approximately 90.66 KiB; Three.js remains 249.28 KiB gzip and route-isolated.
- Initialization still contains large Three.js and texture/WebGL tasks. Mobile Lighthouse LCP and TBT remain far above release targets and are open M3B.2 issues.
- Headless Chrome active motion ran at approximately 26-27 FPS both before and after. M3B.1 preserves that workload and does not claim a frame-rate improvement while animation is enabled.
- The trace contains GPU task duration but cannot attribute it reliably to an individual draw, texture, or shader. M3B.1 makes no texture/shader claim.

## Exact changed files

Application:

- `src/components/showroom/ShowroomView.tsx`
- `src/components/showroom/CameraController.tsx`
- `src/components/showroom/F1Car3DModel.tsx`
- `src/components/showroom/StudioW15Stage.tsx`

Evidence and documentation:

- `docs/performance/m3/m3b1-results.md`
- `docs/performance/m3/artifacts/m3b1-before-after.csv`
- `docs/performance/m3/artifacts/m3b1-interaction-qa.json`
- `docs/performance/m3/artifacts/m3b1/lighthouse/*`
- `docs/performance/m3/artifacts/m3b1/screenshots/*`
- `docs/performance/m3/artifacts/m3b1/traces/*`
- `docs/performance/optimization-results.md`
- `docs/performance/release-gates.md`

## Risks and rollback

The main regression risk is a missed invalidation leaving the scene stale. The exercised paths cover readiness, preset and orbit camera motion, auto-rotation, livery, hotspot/HTML, resize, visibility, off-screen restoration, context restoration, and language. A new future scene mutation must also invalidate.

Rollback is one commit: revert the M3B.1 commit to restore `frameloop="always"` and remove the four explicit invalidation additions. No asset, model, F1 data, or schema migration is involved.
