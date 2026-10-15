# M3B.4 isolated experiments

## Experiment A — bounded procedural texture tasks

**Change.** `useShowroomTextureSet.ts` prepares one texture slot per task and yields with `scheduler.yield()` or a timer fallback. A completed set is inserted atomically through `acquirePreparedSet`; interrupted sets are disposed.

**Why tested.** The baseline generated nine car and four studio textures in one React layout-effect path. The unchanged M3A generator benchmark measured 175.1 ms native and 414.3 ms under 4× CPU throttling.

**Observed result.** In the combined candidate trace, application texture work no longer forms one contiguous 13-generator task. The browser can paint and process input between slots. A three-run synchronous-texture control produced median Lighthouse TBT of 3,647 ms desktop and 14,721 ms mobile, versus 2,999/11,783 ms for the yielded candidate. Its longest tasks were 1,666/6,218 ms versus 1,317/5,281 ms. Shader work remains dominant, but the isolated control confirms that yielding texture slots contributes independently.

**Decision.** Retained. It improves responsiveness and cancellation safety without altering texture resolution or pixels.

## Experiment B — independently staged studio backdrops

**Change.** Car and studio namespaces complete independently. The four studio canvases can attach in a separate commit from the nine car textures; neither component mounts an untextured object.

**Why tested.** The baseline attached the fully textured stage and car around the same startup burst, combining uploads, material setup, reflection resources and shader compilation.

**Observed result.** CDP recorded an earlier first WebGL draw: median 973.6 → 819.5 ms desktop and 2,120.4 → 1,471.3 ms at 4× CPU. Aggregate GPU task time in the profiled window fell 8,201.9 → 5,944.2 ms desktop and 7,679.4 → 6,037.8 ms mobile. Chrome cannot assign this aggregate GPU reduction to a specific wall or texture, so no per-backdrop claim is made.

**Decision.** Retained. The full-resolution four-wall studio, lights, shadows and 512 px reflector are unchanged.

## Experiment C — asynchronous shader warm-up

**Change.** After both named scene roots are attached, `ShowroomStartupCoordinator` invokes `WebGLRenderer.compileAsync(scene, camera)` and falls back to `compile()` only when necessary. Camera transition and auto-rotation start after the first complete rendered frame.

**Why tested.** The baseline CPU profiles identify Three.js `WebGLProgram` program readiness at generated `vendor-three` line 3743 as the dominant sampled startup function.

**Observed result.** In the combined candidate, median Lighthouse longest task fell 2,289 → 1,317 ms desktop and 10,000 → 5,281 ms mobile. Median Lighthouse TBT fell 4,753 → 2,999 ms desktop and 19,822 → 11,783 ms mobile. The isolated compile-disabled control regressed median TBT to 7,288/17,296 ms and longest task to 4,432/10,000 ms. Disabling Three.js shader diagnostics also regressed to 5,101/17,676 ms TBT, so that production diagnostic change was rejected.

**Decision.** `compileAsync` retained. Shader error checks remain unchanged.

## Experiment D — wheel readback bounds

**Change.** `generateWheelTexture` reads the physical 512×512 canvas instead of requesting a transformed logical 1024×1024 `ImageData`. The wheel context uses `{ willReadFrequently: true }`.

**Why tested.** `getImageData` ignores the 0.5 canvas transform. The old code allocated and iterated 1,048,576 pixels while only the upper-left physical 262,144 pixels could be written to the canvas. The M3A cold wheel benchmark measured 63.9 ms native and 383.2 ms at 4×.

**Visual equivalence.** Loop predicates and modifications for every physical pixel are unchanged. The removed pixels were outside the canvas and were discarded by `putImageData`. Equivalent-camera screenshots remain a required final gate.

**Decision.** Retained, subject to screenshot comparison.

## Experiment E — loader tied to a usable frame

**Change.** Asset progress remains visible, but the overlay is dismissed only after the car and studio roots exist, shader preparation completes, and a subsequent render frame has been submitted. Context restoration gets a new readiness revision.

**Why tested.** The baseline Suspense loader disappeared when GLB assets resolved; it did not represent procedural texture, material, shader or final-frame readiness.

**Observed result.** The old loader disappeared at median 4,288.8 ms desktop and 5,564.9 ms mobile. A same-threshold diagnostic pass placed the baseline full-scene frame/first-usable proxy at about 3,907/4,301 ms desktop and 5,179/5,820 ms mobile. The candidate measured about 7,191/7,223 ms and 9,299/9,384 ms respectively. The candidate loader now has a precise semantic guarantee, but the complete-scene reveal is materially later and remains a release blocker.

**Decision.** Retained. The loader no longer promises readiness before the complete scene is available.

## Combined candidate result before final paired run

| Metric                  | Baseline desktop | Candidate desktop | Baseline mobile | Candidate mobile |
| ----------------------- | ---------------: | ----------------: | --------------: | ---------------: |
| Lighthouse TBT median   |         4,753 ms |          2,999 ms |       19,822 ms |        11,783 ms |
| Main-thread work median |         9,526 ms |          6,554 ms |       39,435 ms |        25,285 ms |
| Longest task median     |         2,289 ms |          1,317 ms |       10,000 ms |         5,281 ms |
| LCP median              |         2,861 ms |          2,841 ms |       16,470 ms |        16,478 ms |
| CLS median              |           0.0001 |            0.0001 |               0 |           0.0001 |

These rows are the initial five-run sets. The release table uses the required alternating fixed-commit run after source, tests and documentation are finalized.

## Rejected early-stage warm-up

An isolated candidate compiled a studio-only stage before the full car scene became available. Across three cold runs it produced median TBT of 4,927 ms desktop and 14,768 ms mobile, with wide desktop spread (2,705–5,602 ms). It also creates competing shader preparation before the complete scene compile. The experiment was rejected and removed.

## Final alternating fixed-build result

Five cold runs per device were alternated between baseline `151cc13dbd02829d4e25e266932a4c1c12e95d2c` and the final source build. Desktop median TBT was 5,299 → 4,790 ms; mobile was 20,808 → 18,702 ms. The smaller 9.6%/10.1% reduction supersedes the non-alternating table above for the release decision. Full rows and spread are recorded in `m3b4-results.md` and `artifacts/m3b4-before-after.csv`.
