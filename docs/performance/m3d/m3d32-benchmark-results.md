# M3D.3.2B — Worker Benchmark Results

**Mission:** Showroom Speed & Stability (M3D.3)  
**Branch:** `perf/showroom-speed-r21`  
**Reference commit:** `b143ac5`  
**Date:** 2026-10-16  
**Budget:** STRICT $0  
**Status:** HOLD — live browser-based measurement could not be performed

---

## 1. Measurement limitation (honest disclosure)

Per Phase 2 of this gate, locally installed browser automation was inspected:

| Tool | Installed? | Notes |
|------|------------|-------|
| Google Chrome | Yes | v155.0.8059.80 (`C:\Program Files\Google\Chrome\Application\chrome.exe`) |
| Microsoft Edge | Yes | v155.0.4283.60 (`C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`) |
| Lighthouse CLI | No | Not in `node_modules`, no global install |
| Puppeteer | No | Not in `node_modules` |
| Playwright | No | Not in `node_modules` |
| chrome-remote-interface | No | Not in `node_modules` |

**Repeatable browser automation is unavailable.** Per the gate rules, five-run cold-cache results are **not fabricated**. This document records:
- Baseline metrics from the **committed** Lighthouse artifacts (5-run medians)
- Build-time verification that both baseline and Worker variants compile, pass tests/lint/type-check, and meet the bundle budget
- A reproducible **manual benchmark procedure** using Chrome DevTools that can be executed when browser automation becomes available

---

## 2. Build-time verification (both variants)

| Gate | Baseline (flag off) | Worker (flag on) | Result |
|------|---------------------|------------------|--------|
| `tsc --noEmit` | exit 0 | exit 0 | PASS |
| `eslint` (worker files) | 0 errors | 0 errors | PASS |
| `vitest run` | 278/278 | 278/278 | PASS |
| `npm run build` | clean | clean | PASS |
| Initial JS bundle (gzip) | 109.9 KiB | 109.9 KiB | PASS (≤180 KiB) |
| Showroom shell WebGL deps | 0 | 0 | PASS |
| Worker chunk emitted | — | `gltfMeshoptWorker-*.js` (22,101 B) | PASS |

Both the baseline (`VITE_EXPERIMENTAL_WORKER_GLTF` unset) and Worker (`VITE_EXPERIMENTAL_WORKER_GLTF=true`) variants build successfully with identical bundle sizes. The Worker is emitted as a separate lazy chunk (`gltfMeshoptWorker-BfTCIVl5.js`), so it adds **zero bytes** to the initial shell bundle when the flag is off.

---

## 3. Baseline reference (committed Lighthouse artifacts, 5-run medians)

From `docs/performance/m3d/baseline.md` §2:

| Metric | Desktop | Mobile (4× sim slowdown) |
|--------|---------|--------------------------|
| Performance Score | 49 | 35 |
| FCP | 602 ms | 3,059 ms |
| LCP | 2,845 ms | 16,621 ms |
| TBT | 1,959 ms | 8,441 ms |
| CLS | 0.0001 | 0.0001 |
| Speed Index | 2,294 ms | 5,606 ms |

WebGL telemetry (desktop, production):

| Phase | Value |
|-------|-------|
| Navigation → Canvas Mount | 566 ms |
| Studio Texture Generation | 208 ms (LONG TASK) |
| GLTF Download | 2.16 MB in 21 ms (CDN cached) |
| GLTF Parse & Geometry Processing | **1,046 ms (LONG TASK)** |
| Car Livery Texture Generation | 73 ms |
| Three.js Material Setup | 1,189 ms (LONG TASK) |
| Shader Compilation (`compileAsync`) | 666 ms |
| First Usable Frame | 4,364 ms |

Long-task attribution caveat: `vendor-three-*.js` bundles fetch+parse+decode+geometry+materials+compile together, so Lighthouse URL attribution **cannot isolate shader CPU from GLTF parse**. The `performance.mark` telemetry intervals are the authoritative breakdown.

**M3D.3 targets (≥20% improvement):**
- Desktop first usable frame ≤ 3,490 ms (from 4,364 ms)
- Desktop TBT ≤ 1,567 ms (from 1,959 ms)
- Mobile TBT ≤ 6,753 ms (from 8,441 ms)
- Mobile LCP ≤ 13,297 ms (from 16,621 ms)

---

## 4. What the Worker offloads (analysis, not measured)

The Worker PoC (`src/components/showroom/workers/gltfMeshoptWorker.ts`) offloads the CPU-bound portion of the 1,046 ms GLTF parse/decode long task:

| Step | Worker-compatible? | Location |
|------|-------------------|----------|
| Fetch glb (2.16 MB) | ✅ Yes | Worker `fetch` |
| Parse glB container (JSON+BIN) | ✅ Yes | Worker pure JS |
| Meshopt decompression (34 bufferViews) | ✅ Yes | Worker WASM (`MeshoptDecoder`) |
| Slice accessors into typed arrays | ✅ Yes | Worker pure JS |
| Transfer decoded buffers to main thread | ✅ Yes | Transferables (zero-copy) |
| Build Three.js BufferGeometry/BufferAttribute | ❌ No | Main thread |
| Build Mesh/Material/Scene graph | ❌ No | Main thread |
| Procedural texture upload | ❌ No | Main thread |
| Shader compilation (`compileAsync`) | ❌ No | Main thread |

**Net expected saving:** meshopt decode + parse overlapped on the worker, minus worker spawn + WASM instantiation + messaging overhead. This **must be measured live** — it is not guaranteed positive.

---

## 5. Reproducible manual benchmark procedure (when browser automation is available)

Until automated tooling is available, the following manual procedure can be executed in Chrome (v155) or Edge (v155):

1. Build both variants:
   ```
   # Baseline
   npm run build
   # Worker
   $env:VITE_EXPERIMENTAL_WORKER_GLTF="true"; npm run build
   ```
2. Serve with `npm run preview` (or `vite preview`) on a fixed port.
3. Open Chrome in an **Incognito** window (cold cache) at `http://localhost:PORT/showroom`.
4. Open DevTools → Performance panel.
5. Enable CPU throttling: 4× slowdown (mobile simulation).
6. Click the record (●) button, reload the page (Ctrl+F5 for hard reload), stop recording when the first usable frame appears (loader hides, car + studio rendered).
7. Record: LCP, TBT, FCP, Speed Index, long-task list (self-time + script URL), `showroom:first-usable-frame` mark.
8. Repeat ≥5 times per variant, alternating baseline/Worker to reduce bias. Discard outliers (e.g., first run warm-up).
9. Export the trace JSON for each run. Keep raw artifacts outside the tracked repository.

**Comparison target:** Worker variant must show a reproducible main-thread reduction in the GLTF parse/decode portion with no regression in first usable frame, TBT, or LCP, and no visual/functional regressions.

---

## 6. Why no five-run results are reported

The gate explicitly prohibits fabricating results ("Do not fabricate five-run results"). Without browser automation:
- Lighthouse cannot be run programmatically
- Cold-cache timing cannot be captured repeatedly and identically
- Traces cannot be exported for flame-chart analysis

Therefore **no numeric Worker-vs-baseline comparison is possible in this session**. The decision is HOLD pending live measurement.
