# M1 implementation proposal

Prepared from M0 baseline evidence. This is a file-specific plan, not an implementation. Each change must preserve F1 data, the current visual identity, intro behavior, and route functionality.

## 1. Route-wide font CLS

**Files:** `index.html`, `src/index.css`, new subset WOFF2 files under `public/fonts/`, `vercel.json`.

**Evidence:** M0 attributes 0.2319 of representative Homepage desktop CLS (0.2329 total) to the Inter WOFF2 swap in the footer. Google Fonts CSS is render-blocking and the same approximately 0.233 desktop CLS occurs on Homepage, Season, and Teams.

**Change:** Self-host only Inter 400/600/700/800 and Playfair Display 600/700 in WOFF2, define `@font-face` with metric-compatible fallbacks and stable `font-display`, preload only the first-render face(s), and remove Google Fonts connections/style sheet plus their CSP allowances.

**Metrics:** median desktop CLS <= 0.10; reduce render-blocking font savings; retain LCP/FCP within 10% of baseline or improve.

**Risk / rollback:** Font metrics can change editorial wrapping and brand appearance. Keep the existing Google-font URL behind one revert commit until five-width visual comparison passes.

**Acceptance:** Three cold runs for `/`, `/season/2026`, and `/teams`; no footer/navbar shift; visual screenshots at 390, 768, 1280, 1440, 1920.

## 2. Homepage LCP resource discoverability

**Files:** `index.html`, `src/components/home/PodiumBrandHero.tsx`, optionally `vite.config.ts` only if asset manifest injection is required.

**Evidence:** `/images/podium-diffuser-hero-v2.webp` is desktop LCP. It has `fetchpriority="high"`, but client rendering makes it undiscoverable in initial HTML; M0 records 374–482 ms load delay.

**Change:** Add a responsive preload in `index.html` with `imagesrcset`/`imagesizes` matching the rendered hero. Keep the in-component image, explicit width/height or aspect-ratio, `decoding="async"`, and high priority only for the active LCP asset.

**Metrics:** LCP resource load delay <= 100 ms in comparable desktop runs; homepage desktop/mobile median LCP improves without transfer growth beyond the current hero asset.

**Risk / rollback:** A wrong source/media query preloads an unused image, wasting bandwidth. Remove the preload if network evidence shows duplicate or unused fetches.

**Acceptance:** HTML contains the preload; Network shows one hero request and no duplicate; three cold home runs retain the intended hero LCP candidate after intro handling.

## 3. Intro timing and stable LCP candidate

**Files:** `src/components/common/F1StartLightsPreloader.tsx`, `src/components/common/startLightsTiming.ts`, `src/components/common/F1StartLightsPreloader.css`, `src/App.tsx`, associated tests.

**Evidence:** M0 mobile LCP alternates among intro text, heading, and hero image. The current intro is 2,500 ms and fixed over the app, while the homepage mobile LCP varies from 5,503 to 5,772 ms and score from 55 to 66.

**Change:** Preserve the five-light sequence and cue, but ensure the content underneath is already painted, give the intro and its exit a reserved fixed geometry, honor reduced motion, and choose/measure one intended LCP candidate. Do not add a new delay or use session state that hides the requested refresh behavior.

**Metrics:** Same LCP element in at least 2/3 comparable mobile runs; lower LCP variance; CLS <= 0.10.

**Risk / rollback:** Changing the choreography can harm brand character or accessibility. Keep timing constants isolated and restore the existing 2,500 ms schedule by reverting only `startLightsTiming.ts` if visual review fails.

**Acceptance:** refresh, skip, Escape, reduced-motion, hidden-tab return, and direct route loads work; no white screen; intro remains recognizable and ends with content ready.

## 4. Off-screen team images

**Files:** `src/components/home/FullscreenCarStage.tsx`, `src/components/home/HomeView.tsx`, image metadata/helper tests if introduced.

**Evidence:** Homepage requests all 11 team images during initial load despite `loading="lazy"`; images transfer 1.18 MiB of 1.51 MiB total. Lighthouse estimates 879 KiB desktop and 1,033 KiB mobile potential savings.

**Change:** Render the active and immediately adjacent stage images only, mount further images after carousel/section proximity or user navigation, and retain a fixed aspect-ratio placeholder. Do not preload hidden cars.

**Metrics:** Initial Homepage requests exclude non-visible team images; image transfer falls materially from 1.18 MiB; no CLS or carousel interaction regression.

**Risk / rollback:** Late mounting can flash on rapid navigation. Keep adjacent images ready and revert to the current all-image mapping if the interaction test exposes visible delay.

**Acceptance:** Network on cold home load fetches active/adjacent images only; keyboard/pointer carousel changes retain smooth first interaction; screenshots preserve the composition.

## 5. Logo size and dimensions

**Files:** `src/components/common/OfficialBrandLogo.tsx`, `public/logo/logo.png`, new optimized logo variants under `public/logo/`, callers in `Navbar.tsx` and `Footer.tsx` only if responsive source selection is necessary.

**Evidence:** `logo.png` is 246,326 bytes yet renders near 118×44 or 150×56. M0 flags about 245 KiB waste and missing intrinsic dimensions.

**Change:** Export an appropriately sized WebP/AVIF or optimized PNG while preserving the metallic artwork; set intrinsic `width`/`height` or CSS `aspect-ratio`; use the compact asset for narrow nav. Keep a PNG fallback where required.

**Metrics:** full-logo transfer reduced by at least 80%; no logo-caused layout shift; the image is never upscaled at normal rendered sizes.

**Risk / rollback:** Aggressive compression can visibly harm glow/edges. Keep the current PNG as fallback and compare at 1x/2x in screenshots.

**Acceptance:** Lighthouse no longer reports oversized/unsized logo; navbar and footer remain visually identical at all five widths.

## 6. Explicit Speed Insights route attribution

**Files:** `src/main.tsx`, new small router-aware `src/components/analytics/SpeedInsightsRoute.tsx` (or equivalent), router tests if practical.

**Evidence:** `beforeSend` normalizes `event.url` today, but M0 says explicit React Router pathname wiring is the stronger route attribution. Existing `Unknown` samples predate the normalization and cannot validate the current code.

**Change:** Render Speed Insights inside `BrowserRouter` through a component using `useLocation().pathname`, pass that pathname as the explicit route, retain `beforeSend` only to remove query strings, and keep `sampleRate={1}` for the agreed 14-day observation window.

**Metrics:** New field samples appear by named pathname after the next seven-day window; no query-string route fragmentation.

**Risk / rollback:** An incorrectly placed component may report a stale pathname. Keep a direct unit/render test for navigation and fall back to the current `beforeSend`-only integration with a one-file revert.

**Acceptance:** Browser navigation changes the route prop; Speed Insights requests remain successful; dashboard is checked after sufficient visits rather than declared from sparse data.

## Showroom prerequisites for M3

**Files:** `src/components/showroom/ShowroomView.tsx`, `F1Car3DModel.tsx`, `F1CarTextures.ts`, `StudioW15Stage.tsx`, `CameraController.tsx`, responsive control/layout components, and route visual tests.

**Evidence:** M0 records 33,251 ms desktop and 154,181 ms mobile TBT. The existing code already pauses canvas work when hidden/out of view and uses DPR 1–1.25, but it builds several procedural canvas textures and keeps an `always` frame loop while active. The 390px showroom view overflows and overlays controls onto the vehicle.

**Plan:** First trace separate phases: GLB parse/program compilation, each texture generation/upload, and an idle 10-second scene. Then render on demand while idle, invalidate only for controls/auto-rotate/transitions, retain desktop texture quality on capable devices, and select lower DPR/texture resolution only for constrained mobile GPUs. Put mobile controls in a non-overlapping, horizontally safe layout.

**Metrics:** initialization long-task duration, idle FPS/frame time, desktop/mobile TBT, memory/GPU texture count where tooling exposes it, and zero document overflow at 390/768.

**Risk / rollback:** Frame-demand logic can freeze controls or reduce desktop quality. Gate each change with side-by-side visual proof, interaction tests, and a feature flag or isolated commit that restores `frameloop="always"`.

**Acceptance:** no overflow at 390/768; auto-rotate, camera presets, hotspots, livery switch, and loading state continue to work; desktop visuals remain equivalent; phase-specific traces show a measured improvement.
