# M3D.3.2 — Worker-Based GLTF Ingestion: Benchmark

**Mission:** Showroom Speed & Stability (M3D.3)  
**Branch:** `perf/showroom-speed-r21`  
**Base commit:** `b143ac5`  
**Status:** Benchmark environment NOT available offline — measurement plan + baseline recorded; live runs pending

---

## 1. Measurement constraint

The Phase 3 plan requires **≥5 cold runs per profile** (mobile + desktop) under identical conditions, comparing original vs Worker PoC for:
- Model fetch time
- GLTF parse/decode time
- Main-thread long tasks
- Worker CPU time + messaging overhead
- First usable Showroom frame
- Mobile/desktop TBT & LCP
- Memory & peak retained buffers
- JS transfer size
- Worker initialization cost

**This could not be executed.** The offline environment has:
- No Lighthouse CLI
- No Puppeteer / Playwright / browser automation
- No installed browser driveable for repeated cold runs
- Network installs are out of scope ($0 budget, no external retrieval)

The committed Lighthouse artifacts (`docs/performance/m3d/artifacts/lighthouse/`, 30 run reports) are used as the **baseline reference**. Live validation of the Worker PoC requires re-running Lighthouse (or equivalent) with `VITE_EXPERIMENTAL_WORKER_GLTF=true` against a served preview build.

---

## 2. Baseline reference (committed artifacts, 5-run medians)

From `docs/performance/m3d/baseline.md` §2 (desktop, production):

| Phase | Desktop | Mobile (4× sim slowdown) |
|-------|---------|--------------------------|
| Navigation → Canvas Mount | 566 ms | — |
| Studio Texture Generation | 208 ms (LONG TASK) | ~830 ms |
| GLTF Download | 2.16 MB in 21 ms (CDN cached) | — |
| GLTF Parse & Geometry Processing | **1,046 ms (LONG TASK)** | ~4,200 ms |
| Car Livery Texture Generation | 73 ms | — |
| Three.js Material Setup | 1,189 ms (LONG TASK) | — |
| Shader Compilation (compileAsync) | 666 ms | — |
| First Usable Frame | 4,364 ms | — |

Lighthouse showroom scores: Desktop 49 (TBT 1,959 ms, LCP 2,845 ms); Mobile 35 (TBT 8,441 ms, LCP 16,621 ms).

Long-task attribution (committed `showroom-desktop-run3.json`): top tasks by script URL. `vendor-three-DnMMrDP1.js` bundles fetch+parse+decode+geometry+materials+compile together, so Lighthouse **cannot isolate shader CPU from GLTF parse** by URL alone. Telemetry phases (separate `performance.mark` intervals) are the authoritative breakdown.

Long-task attribution warning (from baseline.md §B): a 1.5 s wall-clock interval must **not** be attributed entirely to shader CPU work without profiler/trace evidence.

---

## 3. Expected worker offload (analysis, not measured)

The worker offloads steps 1–4 of the critical path (fetch + glB parse + meshopt decode + accessor slicing). Within the 1,046 ms "GLTF Parse & Geometry Processing" desktop long task, the meshopt decode of 34 compressed bufferViews (~2 MB compressed → several MB decoded) is the dominant CPU component; JSON parse (15 KB) and typed-array slicing are comparatively small.

**Expected main-thread saving:** a meaningful fraction of the 1,046 ms parse/decode long task on desktop, and proportionally more on mobile (4× slowdown magnifies the CPU decode). The residual main-thread work after the worker is: Three.js scene reconstruction (BufferGeometry/BufferAttribute/mesh/material), procedural texture upload, and shader compilation (666 ms) — none of which are worker-compatible.

**Worker costs to account for in measurement:**
- Worker spawn + `MeshoptDecoder` WASM instantiation (one-time, ~tens of ms)
- `postMessage` of the glb `ArrayBuffer` to the worker (Transferable, zero-copy)
- `postMessage` of decoded buffers back (Transferable, zero-copy) — several MB
- JSON scene descriptor (structured clone, small)
- Fallback path overhead if worker fails

**Net saving = (meshopt decode + parse on worker, overlapped with network) − (worker spawn + WASM init + messaging overhead).** This must be measured live; it is not guaranteed positive.

---

## 4. Measurement plan (to be run when browser tooling is available)

1. Serve the production preview build (`npm run build` + `npm run preview`) locally.
2. Enable the experiment: `VITE_EXPERIMENTAL_WORKER_GLTF=true npm run build` and serve.
3. Run **≥5 cold runs per profile** (desktop + mobile) under identical throttling:
   - Desktop: CPU slowdown 1×, RTT 40 ms, 10 Mbps
   - Mobile: CPU slowdown 4×, RTT 150 ms, 1.47 Mbps down / 675 Kbps up
4. Capture per-run: Lighthouse performance scores, FCP/LCP/TBT/SpeedIndex, long-task list (script URL + duration + startTime), and the showroom `performance.measure` intervals (`showroom:compile`, `showroom:studio:texture-generation`, `showroom:first-usable-frame`).
5. Also run the **original** (flag off) with the same ≥5 cold runs under identical conditions for a paired comparison.
6. Distinguish CPU time from wall-clock time; identify overlapping phases (studio texture generation overlaps GLTF download/parse; compileAsync starts only after car+studio ready).

**Acceptance thresholds (from baseline.md §4):**
- Desktop first usable frame ≤ 3,490 ms (≥20% faster than 4,364 ms)
- Desktop TBT ≤ 1,567 ms (≥20% reduction from 1,959 ms)
- Mobile TBT ≤ 6,753 ms (≥20% reduction from 8,441 ms)
- Mobile LCP ≤ 13,297 ms (≥20% reduction from 16,621 ms)
- Initial JS ≤ 180 KiB gzip; zero static WebGL deps in shell; zero console errors; zero idle draws.
