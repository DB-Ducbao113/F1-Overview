# M3D.3.2B — Worker Compatibility Matrix

**Mission:** Showroom Speed & Stability (M3D.3)  
**Branch:** `perf/showroom-speed-r21`  
**Reference commit:** `b143ac5`  
**Date:** 2026-10-16  
**Status:** Verified statically; runtime browser QA pending (no automation tooling)

---

## 1. Scope

This matrix covers the M3D.3.2 Worker PoC safety and compatibility requirements from Phase 4 of the gate:

- All 11 liveries
- 7 hotspots
- Camera controls (orbit, zoom, presets)
- Mobile UX
- Reduced motion
- Zero-idle rendering
- Worker disabled / Worker startup failure
- Navigation away during parsing
- 50 rapid mount/unmount cycles
- WebGL context loss / restoration
- No new browser exceptions

## 2. Verification method

| Check | Method | Status | Evidence |
|-------|--------|--------|----------|
| TypeScript type-check | `tsc --noEmit` | PASS | exit 0 |
| ESLint | `eslint` on worker + hook files | PASS | 0 errors |
| Unit tests | `vitest run` (40 files) | PASS | 278/278 |
| Production build | `npm run build` (flag off + on) | PASS | clean, both variants |
| Bundle budget | `check-initial-bundle.mjs` | PASS | 109.9 KiB ≤ 180 KiB |
| Shell WebGL deps | `check-showroom-bundle.mjs` | PASS | 0 static WebGL deps |
| Worker chunk emitted | Build artifact inspection | PASS | `gltfMeshoptWorker-*.js` (22,101 B) |
| 11 liveries / 7 hotspots | Code review (no path changed) | PASS (static) | `F1CarTextures.ts`, `hotspotsData.ts` untouched |
| Worker meshopt decode | Node validation of `MeshoptDecoder` against `c42.v2.glb` | PASS (static) | 34 bufferViews decode; WASM self-contained |

**Runtime browser QA (Phase 4 items requiring a live browser):** not yet executed — no browser automation tooling is available (see `m3d32-benchmark-results.md` §1). These are marked **PENDING** below and must be verified before any ACCEPT decision.

## 3. Compatibility matrix

| # | Compatibility item | Worker flag off (baseline) | Worker flag on (experiment) | Fallback behavior | Status |
|---|-------------------|---------------------------|----------------------------|-------------------|--------|
| C1 | All 11 team liveries render correctly | ✅ (unchanged path) | Same materials rebuilt on main thread | N/A | PASS (static) |
| C2 | All 7 hotspots clickable / functional | ✅ (unchanged path) | Scene graph identical structure | N/A | PASS (static) |
| C3 | Studio lighting & reflections | ✅ (unchanged path) | Studio unchanged (worker only touches car GLB) | N/A | PASS (static) |
| C4 | Model geometry, UVs, materials | ✅ (unchanged path) | Rebuilt from decoded buffers on main thread | `useGLTF` on failure | PENDING (runtime) |
| C5 | Camera controls: orbit, drag, zoom | ✅ (unchanged path) | Same camera controller | N/A | PASS (static) |
| C6 | Camera presets & hotspot focus | ✅ (unchanged path) | Same scene node names preserved | N/A | PASS (static) |
| C7 | Reduced motion (`prefers-reduced-motion`) | ✅ (unchanged path) | Unaffected (camera layer only) | N/A | PASS (static) |
| C8 | Mobile UX & layout | ✅ (unchanged path) | Unaffected (GLTF load only) | N/A | PASS (static) |
| C9 | Zero-idle rendering (0 RAF / 0 draws) | ✅ (verified in baseline) | Same frameloop demand mode | N/A | PASS (static) |
| C10 | Worker disabled → baseline path | N/A | `EXPERIMENTAL_WORKER_GLTF=false` skips worker | `useGLTF` | PASS (code) |
| C11 | Worker startup failure → fallback | N/A | `new Worker()` try/catch + 20s timeout | `finishWithMainThread()` → `useGLTF` | PASS (code) |
| C12 | Navigation away during parsing | `mountedRef`/scene-key guards (baseline) | `cancelled`/`abortedRef` + `loadId` staleness + `worker.terminate()` | `useGLTF` on error/timeout | PASS (code) |
| C13 | 50 rapid mount/unmount cycles | ✅ (baseline verified) | Worker terminated on unmount; stale msgs ignored | `useGLTF` | PENDING (runtime) |
| C14 | WebGL context loss / restoration | `contextRevision` remount (baseline) | Worker result applied after remount; old worker terminated | `useGLTF` | PENDING (runtime) |
| C15 | No new browser exceptions | ✅ (baseline: 0 errors) | Worker errors caught → fallback, never uncaught | `useGLTF` | PENDING (runtime) |

## 4. Key design guarantees

**Fallback reliability:**
- `new Worker()` is wrapped in try/catch; any failure routes to `finishWithMainThread()` → `useGLTF`.
- A 20-second timeout terminates the worker and falls back to `useGLTF`.
- Decode errors post `{type:'ERROR'}` from the worker, caught in `onerror`/`onmessage`, routing to fallback.
- Fetch errors route to `.catch()` → fallback.

**Lifecycle safety:**
- `cancelled` flag + `abortedRef` set true on unmount; cleanup terminates the worker.
- Every worker message is checked against `loadId`; stale messages from a previous mount are ignored.
- `startedRef` ensures the effect body runs only once per mount.

**No new WebGL dependencies:**
- The worker creates **no** WebGL rendering context.
- All Three.js object construction (`BufferGeometry`, `BufferAttribute`, `Mesh`, `Material`, `Scene`) happens on the main thread.
- Initial bundle is unchanged (109.9 KiB); the worker is a separate lazy chunk only fetched when the flag is on and the car mounts.

## 5. Items requiring runtime browser verification

The following are structurally sound but **must be confirmed in a live browser** before an ACCEPT decision:

- C4: Geometry/UV/material reconstruction matches the original `useGLTF` output (vertex counts, index ranges, material properties identical across all 11 liveries).
- C13: 50 rapid mount/unmount cycles produce no leaked workers, no memory growth, no console errors.
- C14: Context loss (`webglcontextlost`) → restoration (`webglcontextrestored`) recovers correctly with the worker.
- C15: Zero uncaught exceptions or unhandled rejections across rapid livery switching and navigation-away-during-parse scenarios.
