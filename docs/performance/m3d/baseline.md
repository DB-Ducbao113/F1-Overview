# M3D.2 — Performance Baseline Report

**Date:** 2026-10-16  
**Mission:** Showroom Speed & Stability (M3D.1 + M3D.2)  
**Branch:** `perf/showroom-speed-r21`  
**Base Commit:** `2779cac5d685a06092d4d38f81e23daccccec1f4`  
**Methodology:** 5 cold-cache Lighthouse runs per page per device profile; WebGL telemetry via Puppeteer CDP; production deployment at `podiumeds.vercel.app`

---

## 1. Lighthouse Score Summary (5-Run Medians)

### Homepage (`/`)

| Metric | Desktop (median) | Mobile (median) |
|---|---|---|
| **Performance Score** | 100 | 84 |
| **FCP** | 460 ms | 2,231 ms |
| **LCP** | 782 ms | 4,159 ms |
| **TBT** | 0 ms | 42 ms |
| **CLS** | 0.0001 | 0 |
| **Speed Index** | 623 ms | 2,232 ms |

### Season 2026 (`/season/2026`)

| Metric | Desktop (median) | Mobile (median) |
|---|---|---|
| **Performance Score** | 100 | 85 |
| **FCP** | 441 ms | 2,151 ms |
| **LCP** | 759 ms | 3,999 ms |
| **TBT** | 0 ms | 36 ms |
| **CLS** | 0.0001 | 0 |
| **Speed Index** | 488 ms | 2,151 ms |

### Showroom (`/showroom`)

| Metric | Desktop (median) | Mobile (median) |
|---|---|---|
| **Performance Score** | 49 | 35 |
| **FCP** | 602 ms | 3,059 ms |
| **LCP** | 2,845 ms | 16,621 ms |
| **TBT** | 1,959 ms | 8,441 ms |
| **CLS** | 0.0001 | 0.0001 |
| **Speed Index** | 2,294 ms | 5,606 ms |

---

## 2. Showroom WebGL Telemetry (Desktop, Production)

| Metric | Value |
|---|---|
| Navigation → Canvas Mount | 566 ms |
| Studio Texture Generation | 208 ms (LONG TASK) |
| GLTF Download | 2.16 MB in 21 ms (CDN cached) |
| GLTF Parse & Geometry Processing | 1,046 ms (LONG TASK) |
| Car Livery Texture Generation | 73 ms |
| Three.js Material Setup | 1,189 ms (LONG TASK) |
| Shader Compilation (`compileAsync`) | 666 ms |
| **First Usable Frame** | **4,364 ms** |
| Zero-Idle Validation (5s window) | 0 RAF / 0 draws |
| Active Rotation Draw Rate | ~102 draws/sec |
| Memory Stability (5 mount/unmount cycles) | 20–29 MB heap (stable, no leaks) |

---

## 3. Build & Bundle Metrics

| Metric | Value | Budget |
|---|---|---|
| Initial JS Bundle (gzip) | **109.9 KiB** | ≤ 180 KiB |
| Showroom Shell Static WebGL Deps | **0** | 0 |
| Build Duration | 9.64s | — |
| TypeScript Compilation | 0 errors | 0 |
| ESLint | 0 errors, 4 warnings | 0 errors |
| Vitest Test Suite | **274/274 PASS** (39 files) | 100% pass |

---

## 4. M3D.3 Experimental Performance Targets

Derived from M3D.2 baselines with a ≥ 20% improvement target:

| Metric | Baseline | M3D.3 Target | Required Delta |
|---|---|---|---|
| **First Usable Showroom Frame (desktop)** | 4,364 ms | **≤ 3,490 ms** | ≥ 20% faster |
| **Desktop Showroom TBT** | 1,959 ms | **≤ 1,567 ms** | ≥ 20% reduction |
| **Mobile Showroom TBT** | 8,441 ms | **≤ 6,753 ms** | ≥ 20% reduction |
| **Desktop Showroom LCP** | 2,845 ms | **≤ 2,500 ms** | ≥ 12% improvement |
| **Mobile Showroom LCP** | 16,621 ms | **≤ 13,297 ms** | ≥ 20% reduction |
| **Initial JS Bundle** | 109.9 KiB gzip | **≤ 180 KiB gzip** | No regression |
| **Zero-Idle Rendering** | 0 RAF / 0 draws | **0 RAF / 0 draws** | Strict preservation |

---

## 5. Key Observations

1. **Homepage & Season pages are healthy** — Desktop scores 100/100, Mobile 84–85 with very low TBT (≤48ms). No optimization urgently needed.

2. **Showroom is the primary bottleneck** — Desktop score 49, Mobile 35. Three long tasks dominate the critical path:
   - GLTF parse: 1,046ms (Bottleneck #1)
   - Procedural textures: 281ms combined (Bottleneck #2)
   - Shader compilation: 666ms (Bottleneck #3)

3. **Zero-idle rendering is correctly maintained** — No unnecessary draw calls or RAF callbacks during static idle state.

4. **isReady bug is fully patched** — 0/30 rapid enter/exit cycles reproduce the error after `safeCompileAsync` integration.

5. **Memory is stable** — No leak detected over 5 full mount/unmount cycles (heap range: 20–29 MB).

---

## 6. Raw Data References

- **Lighthouse JSON Reports:** [`docs/performance/m3d/artifacts/lighthouse/`](file:///E:/Formula%201/F1-Overview/docs/performance/m3d/artifacts/lighthouse/) — 30 individual run reports + summary
- **Shader Investigation:** [`docs/performance/m3d/shader-investigation.md`](file:///E:/Formula%201/F1-Overview/docs/performance/m3d/shader-investigation.md)
- **Optimization Opportunities:** [`docs/performance/m3d/optimization-opportunities.md`](file:///E:/Formula%201/F1-Overview/docs/performance/m3d/optimization-opportunities.md)
- **Release Gates:** [`docs/performance/m3d/release-gates.md`](file:///E:/Formula%201/F1-Overview/docs/performance/m3d/release-gates.md)
