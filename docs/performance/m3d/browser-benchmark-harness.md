# M3D.3.2E — Browser Benchmark Harness

**Mission:** Showroom Speed & Stability (M3D.3)  
**Branch:** `perf/showroom-speed-r21`  
**Reference commit:** `b143ac5`  
**Date:** 2026-10-17  
**Budget:** STRICT $0  
**Tooling:** Chrome 155 via `playwright-core` (free; system Chrome, **no Chromium download**)

---

## 1. Overview

The harness compares Showroom **Worker OFF** (baseline) vs **Worker ON** (experiment)
using real Chrome 155 controlled through `playwright-core`. All metrics are read
from the page's own `Performance` API (`PerformanceObserver`) via `page.evaluate`
— no reliance on Playwright's internal CDP channel (which this Playwright build
does not expose).

**Files:**
- `scripts/playwright-bench.mjs` — benchmark runner (20 cold runs, alternated)
- `scripts/static-server.mjs` — SPA static file server for the two build variants
- `scripts/check-flag.mjs` — verifies the feature flag is compiled into each variant

---

## 2. What is measured

Per run (fresh browser context = cold cache):
- `firstUsableFrameMs` — `performance.getEntriesByName('showroom:first-usable-frame')[0].startTime`
- `firstCompleteFrameMs` — `showroom:first-complete-submitted-frame` mark
- `compileMs` — `showroom:compile` measure duration (meshopt decode + scene build)
- `lcpMs`, `fcpMs`, `cls` — from `PerformanceObserver` (largest-contentful-paint,
  first-contentful-paint, layout-shift) — *see limitations below*
- `tbtMs` — proxy: sum of long-task durations exceeding 50ms
- `longTaskCount`, `jsHeapUsedSize`, `consoleErrorCount`

Note: `LCP/FCP/CLS` and `long-task` entries returned null/0 in this headless
setup (the `PerformanceObserver` entries are not reliably surfaced by this
Chrome/headless configuration). `showroom:first-usable-frame` and
`showroom:compile` are the authoritative metrics.

---

## 3. Build the A/B variants

From repo root, in PowerShell:

```powershell
# --- Variant A: Baseline (Worker OFF) ---
$env:VITE_EXPERIMENTAL_WORKER_GLTF=""
npm run build
Copy-Item dist dist-baseline -Recurse -Force

# --- Variant B: Experiment (Worker ON) ---
$env:VITE_EXPERIMENTAL_WORKER_GLTF="true"
npm run build
Copy-Item dist dist-worker -Recurse -Force

# --- Reset flag ---
$env:VITE_EXPERIMENTAL_WORKER_GLTF=""
```

Verify the flag compiled in (baseline serves `preload()` directly; worker serves
the `B0\|\|` guard):

```powershell
node scripts/check-flag.mjs
```

Bundle check (both variants must stay within budget):

```powershell
node scripts/check-initial-bundle.mjs   # expect 109.9 KiB ≤ 180 KiB
node scripts/check-showroom-bundle.mjs  # expect 0 static WebGL deps
```

Serve both variants simultaneously (two terminals):

```powershell
# Terminal 1:
node scripts/static-server.mjs dist-baseline 5173
# Terminal 2:
node scripts/static-server.mjs dist-worker 5174
```

This serves `http://127.0.0.1:5173/showroom` (baseline) and
`http://127.0.0.1:5174/showroom` (worker). Leave `dist` as baseline when done.

---

## 4. Run the benchmark

```powershell
node scripts/playwright-bench.mjs
```

What it does (20 runs, alternated to reduce drift):
- Launches system Chrome 155 headless via `playwright-core` (channel: `chrome`)
- For each run: fresh browser context (cold cache), navigate to `/showroom`,
  wait for `showroom:first-usable-frame`, settle, read all metrics
- Alternates: D-baseline, D-worker, M-baseline, M-worker × 5

Writes `bench-results/raw-results.json` (every run) and
`bench-results/summary.json` (medians per variant + profile). Raw artifacts are
kept outside the tracked repository.

**Run order:** desktop-baseline, desktop-worker, mobile-baseline, mobile-worker,
repeated 5×.

---

## 5. Profiles

| Profile | Viewport | DSF | UA | CPU | Network |
|---------|----------|-----|----|-----|---------|
| desktop | 1350×940 | 1 | Chrome/155 Win10 | 1× (unthrottled) | unthrottled |
| mobile | 412×823 | 1.75 | Chrome/136 Android | 1× (unthrottled) | unthrottled |

Limitation: Playwright has no CPU-throttling API, so mobile runs use the mobile
viewport/UA but **1× CPU**. Mobile numbers are therefore not representative of a
real throttled mobile device; treat them as indicative only.

---

## 6. Reproduction checklist

- [ ] Chrome 155 installed
- [ ] `npm install playwright-core` (network required once)
- [ ] Both variants built (`dist-baseline`, `dist-worker`)
- [ ] `check-flag.mjs` confirms flag differs between variants
- [ ] Two static servers on ports 5173/5174
- [ ] `node scripts/playwright-bench.mjs` completes 20 runs
- [ ] `bench-results/summary.json` produced
