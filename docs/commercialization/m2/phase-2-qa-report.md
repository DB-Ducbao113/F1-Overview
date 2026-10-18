# EDS QA RELEASE REPORT — M2 Phase 2

**Commit SHA:** Phase 2 release candidate based on `b9357d4723ac6a49fd005249d9ee3b9313399d9e`; the resulting commit is recorded in Git history
**Target branch:** `Per-PEDS`
**Target environment:** local Vite development and production build artifact
**Change summary:** refined EDS-G01 geometry; original schematic and seven close-ups; EDS hotspot/dossier UX; DEV-only legacy switch; expanded artifact exclusion and GPU browser QA
**Risk level:** HIGH — WebGL geometry, material lifecycle, asset provenance and commercial-build containment

## STATIC CHECKS

- ESLint: **PASS** — `npm run lint`, exit 0 after implementation.
- TypeScript: **PASS** — `npx tsc --noEmit`, exit 0.
- Focused tests: **PASS** — 3 files / 25 tests, including six liveries, seven EDS hotspots and schematic regression.
- Full unit tests: **PASS** — 29 files / 222 tests, exit 0.
- Build: **PASS** — Vite production build completed; nine legacy Showroom targets pruned and original model/schematic verified.
- Changed-file formatting: **PASS** — explicit Prettier check for all Phase 2 text/source files, exit 0.

## FUNCTIONAL CHECKS

- Core functionality: **PASS** — EDS-G01 is the default; all six liveries render; original schematic action is available.
- Hotspots and schematic: **PASS** — seven of seven dialogs opened, all seven original SVG close-ups loaded, and the original schematic dialog/image rendered at mobile, tablet and desktop viewports.
- Camera: **PASS** — overview plus front, side, cockpit, rear and top presets captured; hotspot focus coordinates use EDS geometry.
- Browser: **PASS** — no console errors, page exceptions or failed resource requests in the recorded runs.
- Responsive: **PASS** — 375×812, 768×1024 and 1440×900 reported no document-level horizontal overflow.
- Touch rotation/pinch: **NOT TESTED on a physical touchscreen** — responsive mobile emulation rendered successfully; direct physical gesture evidence is unavailable.
- Accessibility: **PARTIAL** — semantic buttons, modal roles/labels and 44 px key targets added; screen reader and full keyboard audit not run.
- SEO: **NOT APPLICABLE** — no route or metadata changes.

## SPECIALIZED CHECKS

- Geometry validation: **PASS** — 660,192 bytes; 14 meshes/draw calls; 9,004 triangles; 8 materials.
- Khronos glTF Validator 2.0.0-dev.3.10: **PASS** — 0 errors, 0 warnings, 0 infos, 0 hints.
- Reproducibility: **PASS** — consecutive generator runs produced identical SHA-256 `A9A1226D87EC10B3188B82CAD01039200E81BE4999A88EBB27E75D0DA9AC8325`.
- Normal/seam review: **PASS with visual limitations** — front/side/cockpit/rear/top captures show coherent outward lighting with no visible inverted patches or open silhouette seams. This is visual evidence, not a CAD manifold proof.
- WebGL context recovery: **PASS** — `WEBGL_lose_context` loss observed and restoration confirmed on desktop.
- Real GPU identity: **PASS** — Chrome reported `ANGLE (Intel(R) UHD Graphics, Direct3D11)` for both EDS and legacy runs; this was not SwiftShader.
- Comparable FPS sample (1.5 s, single run): EDS **59.4 / 38.9 / 25.3 FPS** vs legacy **57.1 / 35.4 / 23.5 FPS** at mobile/tablet/desktop. No material regression was observed; desktop remains below the aspirational 45 FPS floor for both variants.
- Model transfer/decode size: EDS **660,192 bytes** vs legacy **2,164,896 bytes** (69.5% smaller decoded payload).
- Livery switching: desktop median **150.8 ms**, tablet **133.9 ms**, mobile emulation **967.8 ms**. Mobile latency requires physical-device confirmation.
- Fifty-switch heap growth: **PASS in forced-GC browser sample** — mobile **3.08 MB**, tablet **2.16 MB**, desktop **1.58 MB**, all below the documented 5 MB threshold. This does not replace a long-duration physical-device soak.
- Long-session memory/thermal behavior: **NOT TESTED**.
- Security: **PASS for change scope** — no external URL, secret, dependency or unsafe HTML added.
- Automated data sources 1/2: **NOT APPLICABLE** — data workflows intentionally unchanged.

## CI/CD

- GitHub Actions: **PENDING** — runs after the reviewed commit is pushed to `Per-PEDS`.
- Preview deployment: **NOT RUN**.
- Production deployment/smoke: **NOT RUN**.

## DEFECTS

- P0/P1: none detected.
- P2 `EDS-M2-PERF-001`: desktop absolute frame sample remains below 45 FPS on Intel UHD for both EDS and legacy; further stage/lighting profiling is required without removing UX.
- P2 `EDS-M2-MEM-002`: physical-device long-session memory and thermal testing is incomplete.
- P2 `EDS-M2-IP-003`: non-Showroom editorial constructor thumbnails remain subject to legal review; they are not declared commercially cleared.
- P3 `EDS-M2-MOBILE-004`: mobile emulation livery switch median is high and requires physical touch-device confirmation.

## EVIDENCE

- EDS report: `docs/commercialization/m2/evidence/browser-report.json`.
- Legacy same-GPU baseline: `docs/commercialization/m2/evidence/legacy-baseline/browser-report.json`.
- Before: `docs/commercialization/m2/evidence/before-phase2-desktop.png`.
- After: mobile/tablet/desktop PNGs plus `silhouette-front.png`, `silhouette-side.png`, `silhouette-cockpit.png`, `silhouette-rear.png`, `silhouette-top.png`.
- Asset inventory: `phase-2-asset-replacement.md`.
- Provenance: `asset-provenance-manifest.md` and `eds-g01-authoring-record.md`.

## UNVERIFIED ITEMS

- Physical mobile touch/pinch behavior, thermals and long-duration memory growth.
- Formal legal clearance or freedom-to-operate opinion for the EDS design.
- Non-Showroom editorial image rights.
- CI, preview and production behavior.

## RESIDUAL RISKS

Original procedural generation documents authorship but does not itself establish legal clearance. The refined model remains a stylized engineering prototype rather than production CAD. Hardware performance varies by driver, power state and browser.

## FINAL DECISION: HOLD

**REASON:** implementation, full local static gates and local GPU regression evidence are positive, but physical-device touch/thermal/long-session evidence, CI and legal review remain incomplete.
**NEXT REQUIRED ACTION:** run a physical mobile/desktop soak with forced-GC memory checkpoints, profile the studio lighting/reflection cost, then obtain legal review of remaining editorial visual assets.
