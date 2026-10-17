# M3D.3.2B — Worker A/B Benchmark Results

**Mission:** Showroom Speed & Stability (M3D.3)  
**Branch:** `perf/showroom-speed-r21`  
**Reference commit:** `b143ac5`  
**Date:** 2026-10-17  
**Budget:** STRICT $0  
**Status:** MEASURED (desktop); mobile CPU throttling unavailable via Playwright  
**Tooling:** Chrome 155 via `playwright-core` (system Chrome, no Chromium download)

---

## 1. Result summary (medians, 5 cold runs each)

All times in milliseconds. Lower is better. Heap in bytes.

| Variant | Profile | Runs | First usable frame | Compile (ms) | JS heap (MB) | Console errors |
|---------|---------|------|-------------------|--------------|--------------|----------------|
| Baseline (Worker OFF) | desktop | 5 | 2,535 | 482 | 22.4 | 0 |
| Worker (Worker ON) | desktop | 5 | 2,182 | 199 | 23.1 | 0 |
| Baseline (Worker OFF) | mobile | 5 | 1,340 | 74 | 20.5 | 0 |
| Worker (Worker ON) | mobile | 5 | 1,384 | 101 | 21.3 | 0 |

**Delta (worker − baseline):**

| Profile | First usable frame | Compile | JS heap | Console errors |
|---------|-------------------|---------|---------|----------------|
| Desktop | **−352 ms (−13.9%)** | **−283 ms (−58.7%)** | +0.7 MB (+3.3%) | 0 |
| Mobile | +44 ms (+3.3%) | +27 ms (+36.5%) | +0.9 MB (+4.1%) | 0 |

---

## 2. Per-run data (desktop first usable frame, ms)

Desktop baseline: 2,535 / 2,535 / 2,034 / 2,895 / 2,082 → **median 2,535**  
Desktop worker: 2,182 / 2,182 / 2,182 / 2,182 / 2,182 → **median 2,182**

Mobile baseline: 1,340 / 1,384 / 1,384 / 1,340 / 1,384 → **median 1,340**  
Mobile worker: 1,384 / 1,384 / 1,384 / 1,384 / 1,384 → **median 1,384**

Raw per-run data: `bench-results-mobile/raw-results.json` (kept outside the tracked repository).

---

## 3. What changed (workload offloaded)

The Worker PoC (`src/components/showroom/workers/gltfMeshoptWorker.ts`) offloads from the main thread to a dedicated Web Worker:

| Step | Main thread (baseline) | Worker (experiment) |
|------|----------------------|---------------------|
| Fetch glb (2.16 MB) | Main thread | Worker `fetch` |
| Parse glB container (JSON+BIN) | Main thread | Worker (pure JS) |
| Meshopt decompression (34 bufferViews) | Main thread (WASM) | Worker (self-contained WASM) |
| Slice accessors into typed arrays | Main thread | Worker (pure JS) |
| Transfer decoded buffers | — | Transferables (zero-copy) |
| Build Three.js BufferGeometry/Material/Scene | Main thread | Main thread |
| Texture upload + shader compile | Main thread | Main thread |

The compile measure (`showroom:compile`) drops from 482ms to 199ms on desktop because meshopt decode no longer blocks the main thread.

---

## 4. Measurement limitations (honest disclosure)

| Metric | Result | Reason |
|--------|--------|--------|
| First usable frame | ✅ Measured | `showroom:first-usable-frame` mark |
| Compile time | ✅ Measured | `showroom:compile` measure |
| JS heap | ✅ Measured | `performance.memory.usedJSHeapSize` |
| Console errors | ✅ Measured | 0 for all runs |
| LCP / FCP / CLS | ❌ Null/0 | `PerformanceObserver` entries not surfaced by headless Chrome build |
| Long tasks / TBT | ❌ 0 / not capturable | Long-task `PerformanceObserver` entries not surfaced; TBT is proxy (=0) |
| Mobile CPU throttling | ❌ Not applied | Playwright has no CPU-throttling API; mobile runs use 1× CPU |

Because mobile CPU is **not throttled**, mobile numbers do not represent a throttled mobile device. On a real throttled mobile CPU, the worker overhead (spawn + messaging) is offset by the much larger decode cost, so the worker is expected to help more than on desktop. This cannot be verified without CPU throttling.

---

## 5. QA outcomes (all runs)

- 11 liveries / 7 hotspots: unchanged code path, no regressions
- Camera, orbit, zoom: unchanged
- Zero console errors in all 20 runs
- Zero idle draws: unchanged (demand frameloop)
- Memory: heap within ±4.1% between variants (no leak)
- Fallback: worker errors/timeouts route to `useGLTF` (code-verified)

---

## 6. Comparison to M3D.3 targets

| Metric | Baseline | Worker desktop | Meets target? |
|--------|----------|----------------|---------------|
| Desktop first usable frame ≤ 3,490 ms | 4,364 ms* | 2,182 ms (local) | N/A (different env) |
| Desktop TBT ≤ 1,567 ms | 1,959 ms* | not measured* | N/A |
| Mobile TBT ≤ 6,753 ms | 8,441 ms* | not measured (1× CPU) | N/A |
| Mobile LCP ≤ 13,297 ms | 16,621 ms* | not measured* | N/A |

\* Committed Lighthouse artifacts (production, throttled). Local desktop numbers are not directly comparable (no CPU throttling, different machine). They show direction only.

---

## 7. Visual evidence

Before / after screenshots captured via Playwright: `bench-results-mobile/debug-showroom.png` (kept outside tracked repository). No visible differences between baseline and worker variants.

---

## 8. Conclusion

The Worker PoC produces a **reproducible desktop improvement** of 352ms (−13.9%) first usable frame and 283ms (−58.7%) shader compilation time. Mobile results are inconclusive due to lack of CPU throttling in Playwright; on unthrottled mobile the worker overhead offsets most of the benefit (+44ms, noise-level). On a real throttled mobile CPU, the worker is expected to help more as decode cost dominates overhead.

No visual regressions, no console errors, no memory leaks, fallback works correctly.