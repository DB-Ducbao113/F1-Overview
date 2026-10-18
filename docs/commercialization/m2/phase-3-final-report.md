# EDS QA RELEASE REPORT — M2 Phase 3 Finalization

**M2 FUNCTIONAL ACCEPTANCE: COMPLETE.**

**Base commit:** `73fc1460af5e24e756bdc8a501cfa54590481d0c`
**Target branch:** `Per-PEDS`
**Target environment:** local development browser and production build artifact
**Change summary:** measured reflection optimization, stable Playwright-core GPU harness, complete original-asset build guard and reproducible temporary GLB generation
**Risk level:** HIGH — WebGL rendering and commercial-asset containment

## Change impact and exact scope

M2 changes are limited to the Showroom renderer, QA/generation scripts, dev-only browser automation dependency, M2 evidence and M2 documentation. Existing local edits to `docs/cloudflare-migration-readiness.md` and `.github/workflows/per-peds-ci.yml` are explicitly excluded from this M2 scope. No Results Engine, data workflow, deployment, advertising or `main` change was made.

The verified Phase 3 implementation was committed as `441a03864e7c85ad1f5eb867b7016fb69a8e04d0`. Final milestone cleanup retains the four browser-report JSON files and the baseline/final screenshots needed for comparison, while removing the 16 redundant screenshots from the two rejected tuning candidates. Separately, one modified Cloudflare document and one untracked Per-PEDS workflow remain pre-existing local changes outside the M2 scope.

The only retained render-path change is `MeshReflectorMaterial` resolution 512 → 256. A 1024 → 512 shadow-map candidate was measured and reverted because its desktop gain was within noise and tablet/mobile results declined. DPR remains `[1, 1.25]`, the 1024 shadow map remains, ContactShadows remains 256, and lighting/material/interaction behavior is unchanged.

## Identical-hardware performance

GPU for every retained comparison: `ANGLE (Intel, Intel(R) UHD Graphics (0x00009BC4), Direct3D11)`. Device scale factor was 1 for all samples. Each FPS sample covered approximately 1.5 seconds after the same livery-switch, hotspot and modal workload.

| Viewport | Phase 3 baseline |     Final | Change | Approx. frame time |
| -------- | ---------------: | --------: | -----: | -----------------: |
| 375×812  |        59.09 FPS | 57.53 FPS |  -2.6% |   16.92 → 17.38 ms |
| 768×1024 |        37.31 FPS | 39.32 FPS |  +5.4% |   26.80 → 25.43 ms |
| 1440×900 |        22.89 FPS | 25.93 FPS | +13.3% |   43.69 → 38.57 ms |

Desktop final telemetry: DPR 1; 1439×719 framebuffer; 58 scene draw calls; 9,384 scene triangles; 65 geometries; 17 textures. The GLB itself remains 14 primitives/draw calls, 9,004 triangles, eight materials and contains no textures. The material/draw-call counts are modest; the repeatable desktop benefit from lowering only the reflection target indicates fill-rate/reflection work is the relevant bottleneck on this Intel UHD device. Mobile's -2.6% single-sample difference is within expected run variance and remains near 60 FPS. No further quality reduction was justified.

Livery median latency changed from 428.0 → 415.5 ms desktop, 416.7 → 382.9 ms tablet and 1,242.4 → 1,233.1 ms mobile emulation. Forced-GC heap growth after 50 switches was 3.62 MB mobile, 3.01 MB tablet and 2.76 MB desktop; all stayed below the existing 5 MB observation threshold, but this is not a long-duration soak.

The uncached GLB transfer remained 660,492 bytes on the wire / 660,192 decoded and measured 3.3 ms baseline versus 3.5 ms final. Later viewports used browser cache. Whole-page navigation timing is not treated as a Showroom loading benchmark because sandbox-denied Ergast proxy attempts delayed some load events by about 12 seconds. Browser telemetry exposes texture count but not trustworthy per-texture GPU allocation or per-shader GPU time, so exact GPU memory and shader milliseconds are **NOT AVAILABLE** rather than estimated. No model texture memory exists; the 17 runtime textures are generated studio/UI render resources.

## Asset coverage and containment

- Original runtime coverage: one EDS-G01 GLB, six material-based liveries, seven hotspot SVGs and one schematic SVG.
- All seven hotspot dialogs and the schematic loaded at all three viewports; no local Showroom resource failed.
- The 82 excluded legacy images represent constructor-specific DEV comparison variants, not missing EDS runtime slots. The EDS dossier and livery cards are text/CSS/material driven and need no additional raster replacements.
- Production build verification now requires all nine original outputs and removes the C42 GLB, branded wheel texture, legacy close-ups, team schematics and generic legacy hotspot images.
- Browser sandbox denied Google Fonts and Vercel analytics scripts. These external failures are not Showroom asset misses and were not introduced by M2; local rendering continued with fallbacks.

## Static and functional checks

- ESLint: **PASS** — `npm run lint`, exit 0.
- TypeScript: **PASS** — `npx tsc --noEmit`, exit 0.
- Unit tests: **PASS** — 29 files / 222 tests, exit 0.
- Production build and commercial artifact guard: **PASS** — 2,207 modules transformed; all nine prohibited legacy targets absent and all nine original outputs present.
- Changed-file formatting: **PASS** — scoped Prettier write/check and `git diff --check`, exit 0; generated binary evidence is not formatter input.
- Internal GLB validation: **PASS** — 660,192 bytes, 14 primitives, 9,004 triangles, eight materials, no errors or warnings.
- Khronos glTF Validator 2.0.0-dev.3.10: **PASS** — 0 errors, warnings, infos or hints.
- Reproducibility: **PASS** — two temporary generations and the checked-in model share SHA-256 `A9A1226D87EC10B3188B82CAD01039200E81BE4999A88EBB27E75D0DA9AC8325`.
- Browser visual/functional regression: **PASS** — six liveries, seven hotspots, schematic, responsive widths and WebGL context recovery verified; no console errors or page exceptions.
- Dependency audit: **PASS for production dependencies** — `npm audit --omit=dev` reported 0 vulnerabilities. The full development tree reports six high and two moderate advisories through the existing Tailwind 3 toolchain; `playwright-core` is not listed in those findings. A Tailwind 4 major migration is outside this M2 scope.
- Physical touch/pinch and long-duration thermal soak: **NOT TESTED** — no physical device was available.
- GitHub Actions/deployment: **NOT RUN / NOT APPLICABLE TO THIS STOP-BEFORE-PUSH REVIEW**.

## Defects and residual risks

- P2 `EDS-M2-PERF-001`: desktop Intel UHD remains approximately 25.8 FPS. This is improved with no measured visual/function regression, but remains a pre-launch low-end-device risk.
- P2 `EDS-M2-IP-003`: formal rights/freedom-to-operate review and non-Showroom editorial image review remain required before commercial launch.
- P3 `EDS-M2-MOBILE-004`: physical touch/pinch, livery latency, thermal behavior and long soak remain untested.
- The QA harness now uses `playwright-core` with an installed Chrome executable. It does not download or bundle a browser into production.

## Evidence

- Baseline: `docs/commercialization/m2/evidence/phase-3/baseline/browser-report.json` and matching screenshots.
- Retained final: `docs/commercialization/m2/evidence/phase-3/final/browser-report.json` and matching screenshots/silhouettes.
- Rejected shadow experiment: `docs/commercialization/m2/evidence/phase-3/candidate-shadow-512/browser-report.json`.
- Reflection-only confirmation: `docs/commercialization/m2/evidence/phase-3/candidate-reflection-256/browser-report.json`.

## UNVERIFIED ITEMS

- Physical mobile gesture behavior, sustained thermals and long-duration memory growth.
- Formal legal clearance or freedom-to-operate opinion.
- CI status, preview deployment and production smoke testing; deployment is outside this milestone.

## Pre-commercial launch carry-forward

These launch-gate checks do not reopen M2 functional implementation:

- Physical-device touch and pinch testing.
- Long-duration thermal and memory testing.
- Further desktop GPU optimization if launch-device evidence requires it.
- Final review of asset provenance and third-party rights.

## FINAL DECISION: GO

**REASON:** M2 branch-local functional acceptance criteria are satisfied with complete original Showroom coverage, deterministic generation, commercial-build containment and a measured same-GPU performance improvement without material visual or interaction regression. Outstanding physical-device soak and rights review are explicitly transferred to the commercial pre-launch gate and do not reopen M2 implementation.

**NEXT REQUIRED ACTION:** proceed to M3 Original Visual Assets and Content. Do not launch commercially until the carried-forward pre-launch checks are complete.
