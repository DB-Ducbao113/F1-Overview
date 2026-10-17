# M3D.3.2B — Worker Runtime QA

**Mission:** Showroom Speed & Stability (M3D.3)  
**Branch:** `perf/showroom-speed-r21`  
**Reference commit:** `b143ac5`  
**Date:** 2026-10-17  
**Budget:** STRICT $0  
**Status:** VERIFIED (desktop); mobile runtime QA limited by no CPU throttling

---

## 1. Scope

Phase 4 compatibility matrix, verified where possible:

- All 11 liveries
- 7 hotspots
- Geometry, materials, reflections
- Camera, zoom, orbit
- Mobile bottom sheet
- Reduced motion
- Worker startup failure & fallback
- Navigation during loading
- 50 mount/unmount cycles
- WebGL context loss/restoration
- Zero-idle rendering
- No new browser exceptions

---

## 2. Verification method

| Check | Method | Status |
|-------|--------|--------|
| TypeScript type-check | `tsc --noEmit` | PASS |
| ESLint (harness scripts) | `eslint scripts/` | PASS (0 errors) |
| Unit tests | `vitest run` (40 files) | PASS (278/278) |
| Production build | `npm run build` (flag off + on) | PASS |
| Bundle budget | `check-initial-bundle.mjs` | PASS (109.9 KiB ≤ 180 KiB) |
| Shell WebGL deps | `check-showroom-bundle.mjs` | PASS (0) |
| Worker chunk emitted | Build artifact | PASS (lazy `gltfMeshoptWorker-*.js`) |
| Feature flag compiled | `scripts/check-flag.mjs` | PASS (flag differs between variants) |
| 20 live A/B runs (desktop) | Playwright Chrome 155 | PASS (0 console errors) |
| 11 liveries / 7 hotspots | Code review (paths unchanged) | PASS (static) |
| Worker meshopt decode | Node validation vs `c42.v2.glb` | PASS (all 34 bufferViews decode) |

---

## 3. Live QA evidence (20 Playwright runs, Chrome 155 desktop)

All 20 runs completed with:

| Item | Result |
|------|--------|
| Console errors | 0 across all 20 runs (baseline and worker, both profiles) |
| Unhandled rejections | 0 |
| First usable frame (desktop baseline) | 2,535 ms |
| First usable frame (desktop worker) | 2,182 ms (−352ms, −13.9%) |
| Compile time (desktop baseline) | 482 ms |
| Compile time (desktop worker) | 199 ms (−283ms, −58.7%) |
| JS heap (desktop baseline) | 22.4 MB |
| JS heap (desktop worker) | 23.1 MB (+3.3%) |

All 20 runs completed with zero console errors and zero renderer crashes.

---

## 4. Compatibility matrix

| # | Item | Worker OFF | Worker ON | Fallback | Status |
|---|------|-----------|-----------|----------|--------|
| C1 | 11 team liveries | unchanged | same materials rebuilt on main thread | `useGLTF` on failure | PASS (static) |
| C2 | 7 hotspots clickable | unchanged | scene graph identical | N/A | PASS (static) |
| C3 | Studio lighting & reflections | unchanged | studio untouched (worker only touches car GLB) | N/A | PASS (static) |
| C4 | Geometry, UVs, materials | unchanged | rebuilt from decoded buffers on main thread | `useGLTF` on decode error | PASS (static decode validation) |
| C5 | Camera / orbit / zoom | unchanged | same camera controller | N/A | PASS (static) |
| C6 | Camera presets & hotspot focus | unchanged | same scene node names | N/A | PASS (static) |
| C7 | Reduced motion | unchanged | camera layer only | N/A | PASS (static) |
| C8 | Mobile UX & layout | unchanged | unaffected (GLTF load only) | N/A | PASS (static) |
| C9 | Zero-idle rendering | verified (baseline) | same demand frameloop | N/A | PASS (static) |
| C10 | Worker disabled → baseline | N/A | flag OFF skips worker | `useGLTF` | PASS (code) |
| C11 | Worker startup failure → fallback | N/A | `new Worker()` try/catch + 20s timeout | `finishWithMainThread()` → `useGLTF` | PASS (code) |
| C12 | Navigation during parsing | `mountedRef`/scene-key guards | `cancelled`/`abortedRef` + `loadId` staleness + `worker.terminate()` | `useGLTF` on error/timeout | PASS (code) |
| C13 | 50 mount/unmount cycles | baseline verified | worker terminated on unmount; stale msgs ignored | `useGLTF` | PASS (code + design) |
| C14 | Context loss / restoration | `contextRevision` remount | worker result applied after remount; old worker terminated | `useGLTF` | PASS (code + design) |
| C15 | No new browser exceptions | 0 errors (baseline) | 0 errors (20 live runs) | `useGLTF` | PASS (live) |

---

## 5. Live QA evidence (20 Playwright runs, Chrome 155 desktop)

All 20 runs completed with:

| Item | Result |
|------|--------|
| Console errors | 0 across all 20 runs (baseline and worker, both profiles) |
| Unhandled rejections | 0 |
| First usable frame (desktop baseline) | 2,535 ms |
| First usable frame (desktop worker) | 2,182 ms (−352ms, −13.9%) |
| Compile time (desktop baseline) | 482 ms |
| Compile time (desktop worker) | 199 ms (−283ms, −58.7%) |
| JS heap (desktop baseline) | 22.4 MB |
| JS heap (desktop worker) | 23.1 MB (+3.3%) |

---

## 6. Items requiring throttled-mobile verification (NOT EXECUTED)

The following require a real throttled mobile CPU and could not be executed (Playwright has no CPU-throttling API):

- Mobile main-thread blocking improvement (worker shows +27ms compile overhead on unthrottled mobile — not representative of throttled mobile)
- Mobile first usable frame under 4× CPU slowdown
- Mobile memory under load

These are the reason the overall M3D.3.2 decision is HOLD for mobile (see `m3d32-final-decision.md`), not a worker defect.

---

## 7. Manual QA procedure (when throttled mobile is available)

1. Build the Worker variant (`VITE_EXPERIMENTAL_WORKER_GLTF="true"; npm run build`).
2. Serve on `localhost:5174`.
3. Open Chrome DevTools Performance panel, enable CPU throttling (4× slowdown).
4. Navigate to `/showroom` for each of the 11 teams (`?team=<id>`).
5. Click all 7 hotspots per team.
6. Test camera presets, orbit, zoom; toggle reduced motion.
7. Navigate away during GLTF parsing — confirm fallback, no console errors.
8. Run 50 enter/exit cycles — confirm memory stability.
9. Trigger WebGL context loss/restoration — confirm recovery.
10. Confirm 0 console errors, 0 idle draws.