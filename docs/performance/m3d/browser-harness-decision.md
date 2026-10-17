# M3D.3.2D — Browser Harness Decision

**Mission:** Showroom Speed & Stability (M3D.3)  
**Branch:** `perf/showroom-speed-r21`  
**HEAD:** `b143ac5`  
**Date:** 2026-10-17  
**Budget:** STRICT $0  
**Decision:** **STOP custom CDP development** — harness not reliable enough for reproducible browser performance measurement.

---

## 1. Decision summary

The custom Chrome DevTools Protocol (CDP) harness (`scripts/cdp-client.mjs`,
`scripts/cdp-case-runner.mjs`, `scripts/bench-run.mjs`) is **not reliable
enough** for reproducible browser performance measurement of the Showroom. Per
Phase 5 of the gate, custom CDP development is stopped.

**Recommendation:** Use Chrome DevTools Lighthouse UI (manual, headed Chrome)
or install an existing supported browser automation tool (Lighthouse CLI,
Puppeteer, or Playwright) within the $0 budget, if permitted. No custom CDP
development continues.

---

## 2. Evidence

### 2.1 What works
- Native Node.js CDP client (`scripts/cdp-client.mjs`) correctly implements
  WebSocket framing, masking, fragmented-chunk handling, ping/pong, message IDs,
  pending-request resolution, and clean closure — verified against the
  browser-level WebSocket where `Browser.getVersion` and `Target.getTargets`
  succeed.
- Chrome v155 is stable under headless `--disable-gpu` when loading Showroom or
  a WebGL triangle via **command-line URL** (survived 10+ seconds; no renderer
  crash logs in stderr).

### 2.2 What does not work (blocker)
- The browser-level WebSocket exposes only `Browser.*` and target-management
  methods. `Target.enable`, `Page.enable`, `Runtime.enable`,
  `Performance.enable`, `Network.enable`, `Page.navigate` all fail with
  `'<method>' wasn't found`.
- `Target.createTarget` returns a `targetId` but never populates the target's
  `webSocketDebuggerUrl` (verified via `Target.getTargets` polling and
  `/json/list`).
- Without a page-level WebSocket, `Performance.getMetrics` (LCP/FCP/CLS/TBT)
  and `Runtime.evaluate` (custom marks such as `showroom:first-usable-frame`,
  long tasks) cannot be invoked.

### 2.3 Metrics obtainable vs. required

| Metric | Obtainable via this CDP harness? | Required for M3D.3? |
|--------|----------------------------------|---------------------|
| JS heap / script duration | ✅ Yes (Performance.getMetrics) | — |
| First-meaningful-paint | ✅ Yes (Performance.getMetrics) | — |
| LCP | ❌ No | Yes |
| FCP | ❌ No | Yes |
| CLS | ❌ No | Yes |
| TBT | ❌ No | Yes |
| First usable Showroom frame | ❌ No | Yes |
| Main-thread long tasks | ❌ No | Yes |
| Worker CPU / messaging overhead | ❌ No | Yes |
| Worker initialization cost | ❌ No | Yes |

The harness collects only a small fraction of the required metrics and cannot
produce repeatable Lighthouse-equivalent scores.

---

## 3. Recommended alternative

**Chrome DevTools Lighthouse UI (manual):**
1. Build the baseline and Worker variants (`VITE_EXPERIMENTAL_WORKER_GLTF`
   off / on).
2. Serve both on localhost (two `vite preview` or static-server instances).
3. Open Chrome DevTools → Lighthouse panel → run against `http://localhost:<port>/showroom`.
4. Record LCP, TBT, FCP, CLS, Speed Index, performance score across ≥5 cold
   runs per variant; alternate baseline/Worker to reduce drift.
5. Capture DevTools Performance traces for long-task attribution.

This is the supported, reliable path. It requires no custom harness and no
$0-budget violations.

If programmatic/automated measurement is required, install Lighthouse CLI,
Puppeteer, or Playwright (free) within the $0 budget — those establish their own
CDP sessions to pages and can produce the needed metrics and traces.

---

## 4. What is NOT done (and why)

- **No Lighthouse scores are reported.** No scores were generated and none are
  fabricated.
- **`Performance.getMetrics` is not treated as Core Web Vitals.** It lacks
  LCP/FCP/CLS/TBT in this Chrome/CDP build.
- **No mobile (4× CPU) measurement.** CDP CPU throttling closes the socket in
  this build; mobile profiling must be done via Lighthouse UI on a real or
  properly throttled device.
- **No further CDP harness iterations.** Per the timebox ("One diagnostic
  iteration only"), if the root cause remains unidentified the decision is HOLD
  rather than building another experimental harness. The root cause IS
  identified (no page-level CDP session), so development stops.

---

## 5. Relationship to M3D.3.2 decision

The M3D.3.2 Worker PoC remains **uncommitted, feature-flagged OFF** with
decision **HOLD** (`m3d32-final-decision.md`). This harness STOP decision does
not change that: the Worker experiment still awaits valid browser-based
measurement before any ACCEPT/REJECT. The Lighthouse-UI (or supported
automation) path above is the means to obtain that measurement.
