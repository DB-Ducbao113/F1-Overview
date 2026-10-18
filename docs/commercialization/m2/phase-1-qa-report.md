# EDS QA RELEASE REPORT — M2 Phase 1

**Commit SHA:** `231273fcd5be5b3467dec78f02123ce65560b846` (working tree changes not committed)  
**Target branch:** `Per-PEDS`  
**Target environment:** Local development and production build artifact  
**Change summary:** Original procedural EDS-G01 GLB, six original EDS liveries, feature-flagged Showroom integration, original studio panels, legacy artifact exclusion, provenance and browser QA harness  
**Risk level:** HIGH — original 3D geometry, WebGL runtime, performance and commercial-IP boundary

## STATIC CHECKS

- ESLint: **PASS** — `npm run lint`, exit 0.
- TypeScript: **PASS** — `npx tsc --noEmit`, exit 0; also repeated by production build.
- Unit tests: **PASS** — `npm test`, exit 0; 28 files, 219 tests.
- Integration tests: **PASS (focused)** — 4 Showroom files, 30 tests, including six new EDS livery preset checks.
- Build: **PASS** — `npm run build`, exit 0; 2,203 modules transformed. Legacy exclusion guard confirmed `c42.v2.glb` and `wheel_base.webp` absent from `dist`.
- Full repository formatting: **FAIL (pre-existing)** — `npm run format:check`, exit 1; 64 existing files reported. M2 changed-file formatting is checked separately.

## FUNCTIONAL CHECKS

- Core functionality: **PASS** — EDS-G01 loads as the safe default; six livery controls render; Cyber Kinetic selection is observed.
- Regression: **PASS** — camera/orbit implementation, six hotspots, lighting, reflections, ContactShadows and responsive canvas remain connected.
- Browser: **PASS** — installed Chrome headless DevTools run; WebGL context present at all tested viewports; no console errors or page exceptions.
- Mobile: **PASS (layout/rendering)** — 375×812, no horizontal overflow, WebGL active, six presets present.
- Tablet: **PASS (layout/rendering)** — 768×1024, no horizontal overflow, WebGL active, six presets present.
- Desktop: **PASS (layout/rendering)** — 1440×900, no horizontal overflow, WebGL active, six presets present.
- Accessibility: **PARTIAL** — semantic buttons and page heading observed; keyboard traversal and automated contrast/axe audit NOT RUN.
- SEO: **NOT APPLICABLE** — no metadata, routing, robots or canonical change.

## SPECIALIZED CHECKS

- 3D Showroom: **PASS for Phase 1 prototype** — GLB loads, material switching works, original studio panels render, camera framing was adjusted for narrow viewports.
- Local geometry validator: **PASS** — 249,012 bytes; 9 mesh nodes; 9 primitives/draw calls; 7,272 triangles; 9 materials; 0 errors; 0 warnings.
- Khronos glTF Validator 2.0.0-dev.3.10: **PASS** — 0 errors, 0 warnings, 9 informational unused-UV messages.
- Performance: **HOLD** — repeatable headless SwiftShader sample: mobile 45.9 FPS, tablet 35.2 FPS, desktop 22.2 FPS. This software-rendered run is not production-hardware representative, but tablet/desktop are below the M1 45 FPS hard floor. Real GPU and device measurements remain required.
- Security: **HOLD (pre-existing dependency risk)** — no new package dependency or credential introduced; `npm ci` reports 8 known vulnerabilities (2 moderate, 6 high). No remediation was authorized in M2 Phase 1.
- Automated data source 1: **NOT APPLICABLE** — workflows and data code intentionally unchanged; no release push.
- Automated data source 2: **NOT APPLICABLE** — workflows and data code intentionally unchanged; no release push.

## CI/CD

- Required GitHub Actions: **NOT RUN** — user required stopping before commit/push.
- Preview deployment: **NOT RUN**.
- Production deployment: **NOT RUN**.
- Production smoke tests: **NOT RUN**.

## DEFECTS

- P0: None detected in the Phase 1 implementation.
- P1: None detected in the Phase 1 implementation.
- P2: `EDS-M2-PERF-001` — software-rendered tablet/desktop frame sample is below the 45 FPS hard floor. Hardware validation and geometry/material profiling required before cutover.
- P2: `EDS-M2-IP-002` — legacy team dossier, hotspot imagery/copy, schematic images and non-Showroom commercial-IP findings remain outside Phase 1 and are not commercially cleared.
- P3/P4: Khronos validator reports nine informational unused UV attributes. They are harmless with current solid runtime materials but should be revisited when Phase 2 adds authored texture atlases.

## EVIDENCE

- Commands and exit codes: recorded above; all M2-focused static, test, build, structural validation and browser commands exited 0.
- Model: `public/models/eds-g01.glb`.
- Source: `scripts/generate-eds-g01.mjs`.
- Browser report: `docs/commercialization/m2/evidence/browser-report.json`.
- Screenshots: `mobile-375x812.png`, `tablet-768x1024.png`, `desktop-1440x900.png` under the evidence directory.
- Provenance: `docs/commercialization/m2/asset-provenance-manifest.md` and `eds-g01-authoring-record.md`.
- Workflow run URLs: none; no push.
- Deployment URLs: none; deployment prohibited for this milestone.

## UNVERIFIED ITEMS

- Real-device GPU frame rate, thermals, VRAM and WebGL context-loss recovery.
- 50-cycle livery memory growth and explicit unmount/remount leak profiling.
- Keyboard-only traversal, screen-reader behavior and automated contrast audit.
- LOD1/mobile asset and Meshopt compression ratio; this Phase 1 GLB is small but uncompressed.
- Formal legal clearance of the original design and remaining commercial content.

## RESIDUAL RISKS

- Original or AI-assisted generation is evidence of process, not automatic legal immunity.
- The prototype is intentionally low-poly (7,272 triangles) versus the M1 production-quality LOD0 target range; visual refinement must preserve originality and budgets.
- Legacy assets remain in source control for local comparison. The build guard excludes the two runtime legacy files from `dist`, but the broader site still contains other M1-classified replacement assets.

## FINAL DECISION: HOLD

**REASON:** M2 Phase 1 prototype and local integration gates pass, but production-grade performance/device evidence, remaining IP replacement, accessibility depth, dependency risk disposition, CI and deployment checks are incomplete.  
**NEXT REQUIRED ACTION:** Begin M2 Phase 2 topology/UV/LOD refinement and original hotspot/dossier asset replacement, then rerun real-GPU performance, memory/context-loss, accessibility and full release gates.
