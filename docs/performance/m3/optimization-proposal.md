# M3B quality-preserving optimization proposal

M3A recommends proceeding with M3B in measured steps. Desktop visual quality remains the reference. Every step must be benchmarked and visually compared before the next one begins.

## 1. Demand-driven frame scheduling

**Files:** `ShowroomView.tsx`, `CameraController.tsx`, and a small new renderer lifecycle component if needed.

Change the Canvas to `frameloop="demand"` and explicitly invalidate for every state that requires a frame:

- Initial model/stage readiness, livery change, hotspot visibility, language change and resize.
- Camera preset interpolation: `CameraController.useFrame` must call `invalidate()` until both target distances settle.
- Orbit interaction and damping: invalidate on control `change`; keep requesting frames from `start` through the damping tail after `end`.
- Auto-rotation: request the next frame from the active auto-rotation loop. Turning it off must allow the loop to settle and stop.
- Modal/HUD changes that affect Drei `Html` overlays.
- Context restore and visibility return.

Setting `frameloop="demand"` alone is explicitly rejected. Without the invalidation paths above, auto-rotation, damping and preset transitions can freeze.

**Expected benefit:** remove almost all idle frame work. The measured upper bound is 9.84 seconds of throttled callback work per ten idle seconds.

**Risk:** missing invalidation can leave a stale camera, texture or overlay. Roll back the scheduler commit if any interaction does not repaint deterministically.

**Acceptance:** after controls settle and auto-rotation is off, no draw call occurs for five seconds; auto-rotation and drag remain smooth; preset transitions complete; resize and restored tabs repaint once; desktop screenshots match the reference.

## 2. Preserve motion only while motion is requested

**Files:** `CameraController.tsx`, `ShowroomQuickHUD.tsx`, `ShowroomControlDock.tsx`.

Represent renderer activity as explicit states: initial load, user orbit, damping tail, preset transition and auto-rotation. Keep full-rate animation on capable desktop while one of those states is active. Pause it immediately when the scene is static, hidden or off-screen.

For `prefers-reduced-motion`, start with auto-rotation disabled and render on demand. Manual camera, livery and hotspot controls remain functional.

**Metrics:** RAF callback count, indexed draws, main-thread frame duration, GPU task duration, dropped frames and INP during control use.

**Risk:** a too-short damping tail can visibly snap. Roll back only the motion-state change while retaining the base demand renderer if necessary.

## 3. Bound and reuse generated textures

**Files:** `F1CarTextures.ts`, `StudioBackdropTexture.ts`, `F1Car3DModel.tsx`, `StudioW15Stage.tsx`; add `showroomTextureCache.ts` with tests.

Introduce a reference-counted cache keyed by team, language and base wheel asset revision. Cache only the current and most recently used livery; dispose the least-recent unreferenced entry. Do not cache all eleven teams, because thirteen full mipmapped textures per team can increase GPU memory substantially.

Keep the existing texture sizes, mipmaps, color spaces, filters and desktop anisotropy in the first experiment. Generate a team once, reuse it when returning to that team, and dispose every cache entry on Canvas teardown/context loss.

If cold generation still creates a long task, test generation in small idle chunks or an `OffscreenCanvas` worker returning `ImageBitmap`. Ship this only if it lowers the longest task without delaying the first usable frame or changing text rendering.

**Acceptance:** second Mercedes → Ferrari → Mercedes switch performs no procedural regeneration for the retained entry; no disposed texture is reused; route exit loses the context and returns heap/renderer memory near baseline; livery screenshots have no pixel-visible degradation.

**Rollback:** disable the cache behind one module-level flag, restore direct generators, and retain the disposal tests.

## 4. Reduce initialization stalls without hiding them

**Files:** `F1Car3DModel.tsx`, `Showroom3DLoader.tsx`, optional renderer warm-up component.

Retain `useGLTF` caching and the existing compressed GLB. The measured parse time does not justify changing the model first. Test these changes independently:

1. Decode the wheel image before invoking the cold wheel generator.
2. Schedule backdrop generation separately from car texture generation while keeping the loading HUD stable.
3. Test `renderer.compileAsync(scene, camera)` after resources exist and before declaring the scene ready.
4. Mark readiness after an actual rendered frame, not merely Canvas mount or Suspense resolution.

**Metrics:** route click to first draw, route click to loader removal, longest task, GPU max task, texture cold time and Lighthouse TBT/LCP.

**Risk:** moving work can make the loader disappear before the model is ready or delay the first frame. Roll back any experiment that only shifts the long task later.

## 5. Isolate reflection and mobile rendering cost

**Files:** `StudioW15Stage.tsx`, `ShowroomView.tsx`.

First run an A/B trace with only the reflector disabled in a local profiling build. This isolates its share; do not ship that visual change. Demand rendering should already prevent reflection work while idle.

If 390/768 active frame time still misses 33.3 ms after steps 1–4, test a mobile-only DPR cap of 1, then test a 256 px reflector target separately. Keep 512 px reflection, shadow map and current DPR behavior on desktop. Approve a mobile setting only after side-by-side 390/768 screenshots show acceptable bodywork, sponsor text, floor reflection and hotspot clarity.

**Rollback:** one adaptive-quality configuration object restores the current DPR and 512 px reflection values.

## 6. Mobile control composition

**Files:** `ShowroomView.tsx`, `ShowroomControlDock.tsx`, `ShowroomQuickHUD.tsx`, `LiverySelector.tsx`.

At 390 and 768, default the detailed dock to collapsed, retain the compact quick actions, and reserve safe areas around the car focal region. Keep every control reachable by keyboard and touch. Internal horizontal livery/hotspot rails remain scrollable and must expose an accessible name.

**Acceptance:** no document overflow; the collapsed dock and HUD do not overlap each other; the car cockpit/body remains visible at the overview preset; 44 px touch targets; focus order follows the visual order; all current actions remain reachable.

## 7. Development-only renderer telemetry

**Files:** new `ShowroomRendererDiagnostics.tsx`, excluded from production by `import.meta.env.DEV`.

Expose `gl.info.render.calls`, triangle count, texture/program counts, DPR and invalidation reason during local profiling. Reset `gl.info` per measured window. Do not send telemetry to a paid service or include the panel in production.

This closes the current gap where CDP can count WebGL calls but cannot name the owning Three resource.

## Validation sequence

After each numbered change:

1. Build the production bundle and run three cold Lighthouse runs at desktop and mobile settings.
2. Repeat route initialization, ten-second idle, auto-rotation, camera, livery and actual hotspot traces.
3. Capture deterministic overview screenshots at 390, 768, 1280, 1440 and 1920.
4. Exercise mouse drag, wheel mode, touch drag/pinch, keyboard focus, Escape, language/livery changes, hidden tab, off-screen stage, reduced motion, context loss/restore and route cleanup.
5. Run lint, format check, tests, coverage and build.

Initial M3B release targets:

- Desktop Lighthouse median TBT ≤ 1,000 ms with no LCP regression over 200 ms.
- Mobile Lighthouse median TBT ≤ 4,000 ms; document any remaining LCP above 2.5 seconds.
- Static idle: zero recurring WebGL draws over five seconds after settling.
- Active desktop animation: median frame ≤ 16.7 ms on the profiling machine with no visual-quality reduction.
- Active mobile animation: median frame ≤ 33.3 ms under the agreed adaptive setting.
- Hidden tab: at most one trailing frame over three seconds.
- Livery switch: no task over 200 ms after the first generated livery; exact colors, logos and sponsor text preserved.
- Cleanup: Canvas removed, context lost, cache emptied and no monotonic heap growth across five route cycles.

## Proposed order and stop points

1. Demand renderer plus explicit invalidation.
2. Motion/reduced-motion lifecycle.
3. Texture cache and wheel decode.
4. Initialization readiness and optional shader warm-up A/B.
5. Reflector/DPR A/B only if active mobile frame time remains high.
6. Mobile panel composition.
7. Full validation and documentation.

Each item is independently reversible. M3B should stop after item 2 for an evidence review if camera damping, auto-rotation or livery repaint is not fully deterministic.
