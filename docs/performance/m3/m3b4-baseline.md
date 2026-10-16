# M3B.4 WebGL initialization baseline

## Revision and method

- Branch: `perf/speed-insights-v2`
- Hardened baseline: `151cc13dbd02829d4e25e266932a4c1c12e95d2c`
- Baseline worktree: detached at the SHA above; no source modifications.
- Browser: Chrome 155.0.8059.40, Lighthouse 13.5.0.
- Runtime: local Vite production preview, cold browser profile and disabled HTTP cache for every run.
- Desktop viewport: 1440×900. Mobile viewport: 390×844 with 4× CPU throttling for the CDP startup profiles. Lighthouse used its standard desktop/mobile presets.

The Lighthouse launcher bundled with Lighthouse 13.5 timed out while launching Chrome directly on this Windows host. The reproducible harness therefore launches a clean Chrome profile with Puppeteer and connects Lighthouse to that exact CDP port. Baseline and candidate use the same harness.

## Five-run Lighthouse baseline

| Profile        | Score |         FCP |           LCP |           TBT |    CLS | Main-thread work | Longest task |
| -------------- | ----: | ----------: | ------------: | ------------: | -----: | ---------------: | -----------: |
| Desktop median |    44 |      586 ms |      2,861 ms |      4,753 ms | 0.0001 |         9,526 ms |     2,289 ms |
| Desktop spread | 44–44 |     583–608 |   2,853–2,869 |   4,294–5,327 | 0.0001 |     8,637–10,373 |  2,109–2,541 |
| Mobile median  |    30 |    2,914 ms |     16,470 ms |     19,822 ms |      0 |        39,435 ms |    10,000 ms |
| Mobile spread  | 30–31 | 2,809–2,923 | 16,440–16,491 | 18,139–20,515 |      0 |    35,048–42,950 | 8,717–10,000 |

Raw reports and rows are under `artifacts/m3b4/baseline/lighthouse`.

## Startup phase measurements

Three cold SPA navigations per profile were captured with CDP CPU profiling, Chrome tracing, Resource Timing, long-task observation and WebGL API counters.

| Phase                                 |                               Desktop |                       Mobile / 4× CPU | Attribution and limit                                                                                      |
| ------------------------------------- | ------------------------------------: | ------------------------------------: | ---------------------------------------------------------------------------------------------------------- |
| Route click → Showroom chunk complete |                              34–56 ms |                  recorded in raw runs | `ShowroomView` resource timing; local network                                                              |
| GLB download                          | 28.9 ms in representative desktop run |                  recorded in raw runs | 2,165,196 transferred bytes; local network only                                                            |
| GLB parse/decode                      |        20.6 ms native / 44.4 ms at 4× | same isolated loader benchmark as M3A | Generator/model source did not change through `151cc13`; parsing is not a primary blocker                  |
| First WebGL draw                      |                       median 973.6 ms |                     median 2,120.4 ms | WebGL `drawElements`/`drawArrays` wrapper                                                                  |
| Loader disappearance                  |                     median 4,288.8 ms |                     median 5,564.9 ms | MutationObserver; the old loader only tracked asset Suspense and did **not** prove a complete usable scene |
| Long-task total in trace window       |                       median 8,421 ms |                       median 9,648 ms | Instrumented traces add overhead; use comparatively, not as Lighthouse TBT                                 |
| Longest observed long task            |                       median 4,326 ms |                       median 4,559 ms | PerformanceObserver                                                                                        |
| GPU task total                        |                     median 8,201.9 ms |                     median 7,679.4 ms | Chrome GPU trace events; per-resource attribution is unavailable                                           |
| Largest GPU task                      |                       median 773.2 ms |                       median 741.6 ms | Chrome GPU trace event                                                                                     |

The baseline has no application signal that identifies the first frame containing the final car materials and all four studio textures. A later diagnostic pass therefore used the same external operational proxy for both fixed builds: the first frame after at least 100 draw calls, 14 texture uploads, 32 shader compiles and 16 program links, followed by loader disappearance. Under that proxy, the baseline full-scene frame/first-usable elapsed time was approximately 3,907/4,301 ms desktop and 5,179/5,820 ms mobile. This proxy is reproducible browser instrumentation, not an application readiness event; M3B.4 adds the explicit readiness contract.

## Five most expensive startup findings

1. **Synchronous shader/program readiness** — CPU sampling attributes the dominant self time to Three.js `WebGLProgram` program-status function `P` in `vendor-three` line 3743. Representative desktop run 1 sampled about 7.6 seconds across nodes with that source location. It is triggered by the materials and lighting assembled in `F1Car3DModel.tsx` and `StudioW15Stage.tsx`. It is schedulable through `WebGLRenderer.compileAsync` where the parallel-shader extension is available. Risk: loader timing and context-restore behavior.
2. **GPU initialization burst** — desktop GPU task totals were 7.69–8.59 seconds in the instrumented windows, with 721–787 ms maximum tasks. Chrome does not expose reliable per-texture or per-material GPU time, so assigning this to one wall, texture or reflector would be unsupported. Staging resource attachment can reduce contention; changing visual resources is out of scope.
3. **Procedural textures on the commit path** — `useShowroomTextureSet.ts` called synchronous `acquireSet`; nine car and four studio generators ran without yielding. The unchanged M3A isolated benchmark measured 175.1 ms native and 414.3 ms at 4×, with the wheel path at 63.9/383.2 ms. These functions are schedulable between texture slots without changing pixels.
4. **Wheel canvas readback over-allocation** — `generateWheelTexture` requested a logical 1024² `ImageData` from a physical 512² canvas. `getImageData` ignores transforms, so three quarters of the allocation and loop could never be written back to visible pixels. The fix can use the physical dimensions and `willReadFrequently` with no visible-pixel change.
5. **WebGL context creation** — CPU sampling recorded roughly 394 ms in `getContext` in representative desktop run 1. This is a one-time browser/driver cost. It cannot be moved to a worker or skipped while preserving the interactive WebGL view.

The 2.16 MB GLB transfer and its 20.6/44.4 ms parse remain measurable costs, but they are below the five startup costs above and are not changed in M3B.4.

## Evidence limits

- JavaScript wrappers report API call duration, while actual texture upload and shader work can occur asynchronously on driver/GPU threads.
- Chrome exposes aggregate GPU tasks, texture/program counts and CPU samples; it does not provide defensible per-texture upload times or exact VRAM residency.
- CPU profile names are minified in the production build. Source/function attribution is made only where the generated source location maps unambiguously to Three.js shader program status or to a measured application function.
- The startup CPU/trace harness changes timing through profiling overhead. Lighthouse medians are the release comparison; traces explain attribution.
