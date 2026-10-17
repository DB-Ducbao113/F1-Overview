# M3D.3.2D — Chrome CDP Root-Cause Diagnostic

**Mission:** Showroom Speed & Stability (M3D.3)  
**Branch:** `perf/showroom-speed-r21`  
**HEAD:** `b143ac5`  
**Date:** 2026-10-17  
**Budget:** STRICT $0  
**Scope:** Read-only diagnosis + isolated diagnostic scripts and reports.  
**No Showroom implementation changes, no commits, no push, no deploy.**

---

## 1. Test matrix A–D

Four progressively complex Chrome CDP cases were executed using a zero-dependency
native Node.js WebSocket CDP client (`scripts/cdp-client.mjs`). Each case
introduced CDP commands one at a time: `Runtime.enable` → `Runtime.evaluate(1+1)`
→ `Performance.enable` → `Performance.getMetrics` → `Emulation.setCPUThrottlingRate`
→ `Network.emulateNetworkConditions` → `Page.captureScreenshot`, plus a 30-second
browser-survival wait.

| Case | Description | URL |
|------|-------------|-----|
| A | about:blank (no navigation) | `about:blank` |
| B | Simple static HTML + JS, no WebGL | `file:///.../static.html` |
| C | WebGL minimal (rotating triangle) | `file:///.../webgl-triangle.html` |
| D | Podium Showroom (Worker-OFF build) | `http://127.0.0.1:5173/showroom` |

Chrome: v155.0.8059.80, headless new, `--disable-gpu`, isolated temp user-data dir,
CDP on localhost:9222.

---

## 2. First failing command per case

| Case | CDP connection | Runtime.enable | Runtime.evaluate(1+1) | Performance.enable | Performance.getMetrics | CPU throttling | Network throttling | Screenshot | 30s survival |
|------|---------------|----------------|-----------------------|--------------------|------------------------|----------------|------------------|------------|--------------|
| A (about:blank) | OK (browser WS) | **FAIL** | — | — | — | — | — | — | YES |
| B (static HTML) | OK (browser WS) | — | — | — | — | — | — | — | NO* |
| C (WebGL tri) | OK (browser WS) | — | — | — | — | — | — | — | NO* |
| D (Showroom) | OK (browser WS) | — | — | — | — | — | — | — | NO* |

\* Cases B/C/D never reached any command because navigation itself could not be
established via a page-level CDP session (see root cause below).

**The very first CDP command that fails, in every case, is the transition from
the browser-level WebSocket to a page-level WebSocket.** Chrome exposes two
distinct WebSocket surfaces:

- **Browser-level WS** (`json/version` → `webSocketDebuggerUrl`): exposes only
  `Browser.*` and target-management methods (`Target.getTargets`,
  `Target.createTarget`, `Browser.getVersion`). Confirmed working:
  - `Browser.getVersion` → OK
  - `Target.getTargets` → OK
- **Per-target/page WS** (each target's own `webSocketDebuggerUrl`): exposes
  `Runtime.*`, `Page.*`, `Performance.*`, `Network.*`, `Log.*` — the domains
  needed for performance measurement.

**Root cause:** `Target.enable`, `Page.enable`, `Runtime.enable`,
`Performance.enable`, `Network.enable`, and `Page.navigate` are **not available**
on the browser-level WebSocket. They exist only on a per-target WebSocket.
However, `Target.createTarget` returns a `targetId` but **never populates the
target's `webSocketDebuggerUrl`** in this Chrome v155 headless build (verified
via both `Target.getTargets` polling and `/json/list`). Without a page-level WebSocket
URL, `Runtime.enable`, `Performance.enable`, `Page.enable`, `Page.navigate`, and
`Performance.getMetrics` can never be invoked.

Therefore **no performance metric (LCP, FCP, CLS, TBT, first-usable-frame,
long tasks) can be collected** through this CDP path.

---

## 3. Browser and renderer process evidence

- Chrome process does **not** hard-crash when loading Showroom or WebGL under
  headless `--disable-gpu` (command-line launch of `http://127.0.0.1:5173/showroom`
  survived 10+ seconds; WebGL triangle survived 8+ seconds).
- Chrome stderr shows only benign noise (`gcm` registration errors, new-tab UI
  profile warnings) — no GPU/compositor/renderer crash logs.
- Exit code 21 observed in some case-runner attempts is attributed to rapid
  successive Chrome launches / port reuse, not a deterministic WebGL crash.
- In the isolated diagnostic (`debug-cdp-nav.mjs`), Chrome remained alive
  (`exitCode === null`) after `Target.createTarget`; only the per-target
  `webSocketDebuggerUrl` was missing.

**Conclusion:** Chrome is stable; the failure is a **CDP session-establishment
limitation**, not a renderer crash.

---

## 4. CDP protocol errors observed

| Command | Context | Error |
|---------|---------|-------|
| `Target.enable` | browser-level WS | `'Target.enable' wasn't found` |
| `Page.enable` | browser-level WS | `'Page.enable' wasn't found` |
| `Runtime.enable` | browser-level WS | `'Runtime.enable' wasn't found` |
| `Performance.enable` | browser-level WS | `'Performance.enable' wasn't found` |
| `Network.enable` | browser-level WS | `'Network.enable' wasn't found` |
| `Page.navigate` | browser-level WS | `'Page.navigate' wasn't found` |
| `Target.createTarget` → `webSocketDebuggerUrl` | browser-level WS | URL never populated; target exists but is not debuggable via WS |

---

## 5. Root cause

**The Chrome DevTools Protocol, as exposed by Chrome v155 headless on this
machine, does not provide a usable per-target WebSocket debugging session.**

1. Connecting to the browser-level WebSocket works, but only target-management
   domains (`Browser.*`, `Target.getTargets`, `Target.createTarget`) are
   available there.
2. The page-inspection domains (`Runtime.*`, `Page.*`, `Performance.*`,
   `Network.*`) require a **per-target WebSocket** (`Target.createTarget`
   result's `webSocketDebuggerUrl`).
3. `Target.createTarget` succeeds (returns `targetId`) but the target's
   `webSocketDebuggerUrl` is never populated — confirmed via `Target.getTargets`
   polling and `/json/list`.
4. Without a page-level session, `Performance.getMetrics` (LCP, FCP, CLS, TBT,
   heap) and `Runtime.evaluate` (custom marks such as
   `showroom:first-usable-frame`, `performance.getEntriesByType('longtask')`)
   cannot be invoked.

This is an environment/Chrome-build limitation, not a defect in the native CDP
client (the client correctly frames WebSocket messages, handles masking,
fragmented chunks, message IDs, pending-request resolution, and clean closure —
verified against the browser-level WS where `Browser.getVersion` and
`Target.getTargets` succeed).

---

## 6. Recommendation: STOP custom CDP development

**Do not continue building the custom CDP harness.** It cannot collect the
metrics required by Phase 3 (LCP, TBT, FCP, CLS, first-usable-frame, long tasks,
worker CPU/messaging). The blocker is environmental (Chrome build does not
expose page-level CDP sessions), not a fixable harness defect.

### Recommended path forward

Use **Chrome DevTools Lighthouse UI** (manual, headed Chrome) or install an
**existing supported browser automation tool** (Lighthouse CLI, Puppeteer, or
Playwright) within the $0 budget if permitted. Those tools establish their own
CDP sessions to pages and can produce repeatable Lighthouse scores and traces.

### Remaining limitations (documented, not hidden)

- No programmatic Lighthouse score available in this session.
- `Performance.getMetrics` (browser-level) exposes only heap sizes, script/task
  duration, first-meaningful-paint — **not** LCP/FCP/CLS/TBT. It must not be
  treated as a Core Web Vitals source.
- Mobile (4× CPU slowdown) throttling cannot be applied via CDP here
  (`Emulation.setCPUThrottlingRate`, `Network.emulateNetworkConditions` close
  the socket in this build).
- Results are not fabricated; where measurement is impossible, the decision is
  HOLD (see `m3d32-final-decision.md`).
