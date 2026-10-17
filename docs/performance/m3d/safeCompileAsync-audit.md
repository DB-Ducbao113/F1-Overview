# M3D.1 — Audit: `safeCompileAsync` Monkey-Patch

**Mission:** Showroom Speed & Stability (M3D.1 + M3D.2)  
**Branch:** `perf/showroom-speed-r21`  
**Base commit:** `2779cac5`  
**M3D.1/M3D.2 commit:** `8c65b93 perf(showroom): M3D.1 fix isReady crash + M3D.2 baseline`  
**File audited:** `src/components/showroom/safeCompileAsync.ts`  
**Integration points:** `src/components/showroom/ShowroomScene.tsx` (`onCreated`), `src/components/showroom/ShowroomStartupCoordinator.tsx` (compile phase)

---

## 1. Summary finding

The patch is **safe for its scope** and is kept. It does not modify global Three.js behavior, prevents (rather than suppresses) the crash, is idempotent per renderer instance, and guards late resolution after unmount.

Its residual risk is reliance on Three.js internals (`WebGLProperties`, `material.properties.currentProgram`, `gl.extensions`), which are not public API. A fully supported-API replacement that retains async, non-blocking compilation does not exist in three@0.165.0 — the supported alternative (sync `gl.compile`) sacrifices the 666 ms async compile overlap and is therefore not recommended for M3D.3.

No change to `safeCompileAsync.ts` is required by this audit.

---

## 2. Checklist findings

| #   | Check                                                                | Result                                               | Evidence                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| --- | -------------------------------------------------------------------- | ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | Does the monkey-patch modify **global** Three.js renderer behavior?  | **No.**                                              | `ensureSafeCompileAsync(gl)` replaces `compileAsync` on the **passed renderer instance only** (`glAny.compileAsync = ...`). It never touches `WebGLRenderer.prototype`. Each R3F `<Canvas>` mount creates a new renderer, so the patch is scoped to that canvas. Showroom shell bundle contract remains intact (no static WebGL dependency).                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| 2   | Does it rely on **undocumented internal objects/properties**?        | **Yes — flagged.**                                   | Reads `gl.properties` (internal `WebGLProperties` WeakMap wrapper), `gl.extensions` (internal extension registry), and `properties.get(material).currentProgram` (internal program cache). These are structurally typed inline in `safeCompileAsync.ts`; no import from Three.js internals. Risk: a future Three.js version that renames/removes `properties`, `currentProgram`, or `compileAsync` would silently change behavior (the `typeof compileAsync === 'function'` guard at least prevents a crash when `compileAsync` is absent).                                                                                                                                                                                                                                          |
| 3   | Is the patch **idempotent across remounts**?                         | **Yes.**                                             | Per-instance `SAFE_COMPILE_INSTALLED` Symbol guard returns early on re-install of the same renderer. Verified by `safeCompileAsync.test.ts` ("does not wrap twice") and by `safeCompileAsync.reproduction.test.ts` (50 rapid install cycles, fresh mock renderer each cycle). Across remounts each new `<Canvas>` creates a new renderer, wrapped exactly once.                                                                                                                                                                                                                                                                                                                                                                                                                      |
| 4   | Can a pending async compile **resolve after unmount**?               | **Promise may resolve; consumer effect is a no-op.** | `ShowroomStartupCoordinator` resolves the compilation `.then()` only when `mountedRef.current === true && sceneKeyRef.current === compilingKey && phaseRef.current === 'compiling'` (lines 96-101). Late resolution after navigation away is dropped. Residual: the patch's internal `setTimeout(checkMaterialsReady, 10)` loop is **not cancelled** on unmount — it keeps ticking until every material reports ready (or forever if the context is lost and never restored). Harmless to React state, but a leaked timer. Verified by reproduction test ("a compile that resolves after navigation away is inert for the consumer").                                                                                                                                                |
| 5   | Are exceptions **suppressed** or **prevented**?                      | **Prevented.**                                       | No `try/catch`, no `window.onerror`, no `.catch()` around the patch. The code guards `!program                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |     | (typeof program.isReady === 'function' && program.isReady())`before invoking`isReady()`, so the `TypeError`cannot occur. This is essential: the original throw happens inside a`setTimeout`callback outside the promise executor, so`.catch()`on`compileAsync()` could never catch it. |
| 6   | Do **material disposal** and **context restoration** remain correct? | **Yes, with one caveat.**                            | Disposal: `deallocateMaterial` removes the material from `WebGLProperties`; the patch then sees `currentProgram === undefined` and drops it from the waiting set instead of crashing. `showroomTextureCache.disposeAll()` / `safeDispose` never throws (try/wrap, disposed-guard). Context: `WebGLContextGuard` in `ShowroomScene` reports `webglcontextlost`/`webglcontextrestored` to `ShowroomView`, which bumps `contextRevision` → new `startupSceneKey` → `ShowroomStartupCoordinator` resets phase to `waiting-resources` and recompiles. Caveat: while the context is lost, an in-flight `compileAsync` poll loop keeps ticking (`isReady()` calls `gl.getProgramParameter`, which returns false on a lost context without throwing); it clears on context-revision remount. |
| 7   | Is a **supported Three.js lifecycle API** alternative possible?      | **Partially — with a trade-off.**                    | `WebGLRenderer.compileAsync` **is** public API, but Three.js exposes **no public API** to observe per-program readiness or to cancel/abort a `compileAsync`. Options: (a) keep the patched `compileAsync` (current — async, non-blocking); (b) drop async entirely and call sync `gl.compile(scene, camera)` — fully supported, deterministic, but blocks the first usable frame for the full 666 ms compile on the main thread (this is already the coordinator's `.catch()` fallback); (c) call-site `compileAsync` + mounted guard + timeout fallback to sync compile — still cannot prevent the internal uncaught throw unless materials are guaranteed to outlive polling. Verdict: the patch is the pragmatic fix; the supported alternative regresses first-usable-frame.     |

---

## 3. Reproduction of the original error

Three.js r165 `WebGLRenderer.compileAsync` (source: `node_modules/three/src/renderers/WebGLRenderer.js:997-1035`) polls `materialProperties.currentProgram.isReady()` every 10 ms. `deallocateMaterial` (invoked via the material `dispose` event on route unmount / texture cache disposal) calls `properties.remove(material)`. After removal, `properties.get(material)` returns an empty object, so `currentProgram` is `undefined` and `program.isReady()` throws:

```
TypeError: Cannot read properties of undefined (reading 'isReady')
```

This throw occurs inside `setTimeout`, outside the promise executor — an uncaught error that also leaves `compileAsync` unresolved forever.

**Pre-fix telemetry (docs/performance/m3d/shader-investigation.md):** CDP reproduction against the local preview bundle captured **11 exceptions**, 100% matching this pattern, during rapid `/showroom` exits and team switches while compilation was pending.

**Post-fix verification:**

- Unit test `src/components/showroom/safeCompileAsync.reproduction.test.ts` reproduces the exact unpatched loop (throws `Cannot read properties of undefined (reading 'isReady')`), then verifies the patched wrapper resolves cleanly with a disposed material mixed in.
- 50-remount idempotency cycle test passes.
- Full suite: **279/279 tests pass** (274 baseline + 5 new).

## 4. Scenario verification (per Phase A plan)

| Scenario                           | Mechanism                                                                                                                  | Status                        |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| 50 rapid mount/unmount cycles      | Per-instance Symbol guard + new renderer per `<Canvas>` mount; cache test covers 5 dispose/allocate cycles                 | Verified (unit tests)         |
| Rapid livery switching             | Cache key `teamId:car-v1` per team; `acquireSet` shares one entry per key; old set released only after replacement commits | Verified (cache tests + code) |
| Navigation away during compilation | `mountedRef.current` + `sceneKeyRef` + `phaseRef` guards in `.then()`                                                      | Verified (unit test + code)   |
| Reduced motion                     | `reducedMotion` only gates auto-rotation; does not touch `compileAsync` or the patch                                       | No interaction                |
| Context loss/restoration           | `WebGLContextGuard` → `contextRevision++` → new startup key → coordinator restarts compile phase                           | Verified (code path)          |

Browser-based CDP reproduction (50-cycle / livery-switch / nav-away / context-loss runs against a live preview) was already executed pre-commit per `shader-investigation.md` (0/30 cycles reproduce post-fix). New Lighthouse/CDP runs cannot be executed in this offline environment (no Lighthouse CLI, no Puppeteer/Playwright) — see Phase C notes.

## 5. Verdict

**Keep the patch.** It is the minimal, non-invasive correction for a confirmed production crash, with no global side effects and no exception suppression. Its reliance on Three.js internals is documented; mitigating option if the team later upgrades Three.js: replace `gl.compileAsync` usage with sync `gl.compile(scene, camera)` inside the coordinator's existing guarded branch, accepting the first-frame compile cost.

**Companion files:**

- `src/components/showroom/safeCompileAsync.ts` — patched wrapper (unchanged by this audit)
- `src/components/showroom/safeCompileAsync.test.ts` — existing unit tests (idempotency, safe resolution)
- `src/components/showroom/safeCompileAsync.reproduction.test.ts` — new: crash reproduction + fix verification + 50-cycle idempotency + post-unmount inertness

---

## Acceptance gate status (baseline, unchanged by this audit)

| Gate              | Requirement                 | Result                                      |
| ----------------- | --------------------------- | ------------------------------------------- |
| Functional        | 274 → 279 vitest tests pass | PASS                                        |
| Lint              | 0 ESLint errors             | PASS (4 pre-existing non-blocking warnings) |
| Type-check        | `tsc --noEmit` exit 0       | PASS                                        |
| Build             | `vite build` exit 0         | PASS                                        |
| Initial JS bundle | ≤ 180 KiB gzip              | 109.9 KiB — PASS                            |
| Showroom shell    | 0 static WebGL deps         | PASS                                        |
