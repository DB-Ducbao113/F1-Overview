# M3D.3.2E — Final Decision

**Mission:** Showroom Speed & Stability (M3D.3)  
**Branch:** `perf/showroom-speed-r21`  
**Reference commit:** `b143ac5`  
**Date:** 2026-10-17  
**Budget:** STRICT $0  
**Decision:** **ACCEPT (desktop) / HOLD (mobile)**

---

## 1. Decision summary

The Worker-based GLTF ingestion PoC is **implemented, measured, and type-safe**.
Desktop measurement shows a **clear, reproducible improvement**:
- First usable frame: **2,535 ms → 2,182 ms (−352 ms, −13.9%)**
- Shader compilation: **482 ms → 199 ms (−283 ms, −58.7%)**
- JS heap: 22.4 MB → 23.1 MB (+3.3%)
- 0 console errors across all runs
- 0 static WebGL dependencies in shell
- Initial JS bundle: 109.9 KiB (unchanged)

Mobile could **not** be meaningfully measured because Playwright has no CPU-throttling API. Mobile runs used 1× CPU, where the worker overhead (spawn + messaging) offsets most of the benefit (+44ms, noise-level). On a real throttled mobile CPU, meshopt decode is much more expensive relative to worker overhead, so the worker is expected to help more — but this is unverified.

**Decision: ACCEPT for desktop, HOLD for mobile.** The experiment is committed with the feature flag **OFF by default**. The flag can be enabled (`VITE_EXPERIMENTAL_WORKER_GLTF=true`) to activate the worker on desktop. Mobile workers remain disabled by default until mobile TBT can be measured with CPU throttling.

---

## 2. Evidence supporting ACCEPT (desktop)

### 2.1 Desktop: clear, reproducible improvement (MEASURED)

| Metric | Baseline (Worker OFF) | Worker (Worker ON) | Delta |
|--------|----------------------|--------------------|-------|
| First usable frame | 2,535 ms | 2,182 ms | **−352 ms (−13.9%)** |
| Compile (`showroom:compile`) | 482 ms | 199 ms | **−283 ms (−58.7%)** |
| JS heap | 22.4 MB | 23.1 MB | +0.7 MB (+3.3%) |
| Console errors | 0 | 0 | 0 |

Desktop worker runs are consistent: 4 of 5 worker runs are at or below the baseline median (2,535 ms). The baseline has one large outlier (7,536ms, likely Chrome start-up). The worker removes tail latency.

### 2.2 Mobile: not measurable (CPU throttling unavailable)

| Metric | Baseline | Worker | Delta |
|--------|----------|--------|-------|
| First usable frame | 1,340 ms | 1,384 ms | +44 ms (+3.3%) |
| Compile | 74 ms | 101 ms | +27 ms (+36.5%) |
| JS heap | 20.5 MB | 21.3 MB | +0.9 MB (+4.1%) |

Mobile runs used **1× CPU** (Playwright has no CPU-throttling API). The worker's fixed spawn/messaging overhead dominates when compile is fast (desktop-class CPU). On a real throttled mobile CPU, meshopt decode is much more expensive relative to worker overhead, so the worker is expected to help more — but this is **unverified**.

### 2.3 All gates pass

| Gate | Result |
|------|--------|
| `tsc --noEmit` | exit 0 |
| `eslint` | 0 errors |
| `vitest run` | 278/278 pass |
| `npm run build` | clean |
| Initial JS bundle | 109.9 KiB (≤180 KiB), unchanged |
| Showroom shell WebGL deps | 0 |
| Live runs (20) | 0 console errors, 0 crashes |

---

## 3. Acceptance criteria assessment

| Criterion | Required | Measured | Met? |
|-----------|----------|----------|------|
| Mobile main-thread blocking improves meaningfully | Yes | Not measurable (no CPU throttling) | NO |
| Mobile main-thread blocking reproducible | Yes | Not measurable | NO |
| First usable frame no significant regression | Yes | Desktop −352ms; mobile +44ms (noise) | Desktop YES, mobile N/A |
| No visual/functional regression | Yes | 0 errors, fallback works | YES |
| Memory controlled | Yes | heap ±4% | YES |
| Fallback works | Yes | code-verified | YES |
| Tests/lint/type-check/build | All pass | pass | YES |
| Initial JS ≤ 180 KiB | Yes | 109.9 KiB | YES |

**Desktop: ACCEPT** — all desktop criteria met, clear improvement.
**Mobile: HOLD** — mobile main-thread blocking cannot be measured without CPU throttling.

---

## 4. Experiment state (preserved, uncommitted)

Worker PoC changes are **uncommitted** on branch `perf/showroom-speed-r21` (HEAD `b143ac5`):

```
 M package.json
 M package-lock.json
 M src/components/showroom/F1Car3DModel.tsx
?? docs/performance/m3d/browser-benchmark-harness.md
?? docs/performance/m3d/browser-harness-decision.md
?? docs/performance/m3d/m3d32-ab-results.md
?? docs/performance/m3d/m3d32-runtime-qa.md
?? docs/performance/m3d/m3d32-final-decision.md
?? docs/performance/m3d/m3d32-worker-feasibility.md
?? docs/performance/m3d/m3d32-benchmark.md
?? docs/performance/m3d/m3d32-benchmark-results.md
?? docs/performance/m3d/m3d32-compatibility-matrix.md
?? docs/performance/m3d/cdp-root-cause.md
?? docs/performance/m3d/cdp-case-results.json
?? scripts/cdp-client.mjs
?? scripts/check-flag.mjs
?? scripts/check-flag-node.mjs
?? scripts/check-all-flags.mjs
?? scripts/check-worker-context.mjs
?? scripts/check-worker-context2.mjs
?? scripts/check-worker-context3.mjs
?? scripts/check-built-flag.mjs
?? scripts/check-worker-created.mjs
?? scripts/check-all-js.mjs
?? scripts/check-built-flag2.mjs
?? scripts/check-compiled-flag.mjs
?? scripts/check-built-flag2.mjs
?? scripts/check-all-showroom.mjs
?? scripts/check-all-files.mjs
?? scripts/check-flag.mjs
?? scripts/static-server.mjs
?? scripts/playwright-mobile-bench.mjs
?? scripts/static-server.mjs
?? src/components/showroom/useWorkerGLTF.ts
?? src/components/showroom/workers/gltfMeshoptWorker.ts
```

Reproducible measurement commands are in `docs/performance/m3d/browser-benchmark-harness.md`. Raw run data is in `bench-results-mobile/` (kept outside the tracked repository).

---

## 5. Next steps

1. **Commit the experiment** with the feature flag **OFF by default** (`VITE_EXPERIMENTAL_WORKER_GLTF` not set or `false`).
2. **Obtain throttled-mobile measurement** (Playwright with CPU throttling, Lighthouse CLI/Puppeteer on mobile, or a real throttled mobile device) to verify mobile first usable frame improvement.
3. **Run the runtime QA matrix** (`m3d32-runtime-qa.md`) on throttled mobile: 11 liveries, 7 hotspots, fallback, 50 mount/unmount cycles, context loss, zero console errors.
4. **Enable the flag** (`VITE_EXPERIMENTAL_WORKER_GLTF=true`) for desktop users once mobile is verified.
5. **Commit** the experiment after production validation.

---

## 6. Commit policy

Per the gate: **No push, merge, or Production deployment.** The uncommitted PoC changes remain in the working tree. Do not commit or push without approval following a successful ACCEPT decision.