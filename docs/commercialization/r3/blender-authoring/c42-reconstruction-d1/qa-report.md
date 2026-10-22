# EDS QA RELEASE REPORT — C42-referenced reconstruction D1

Target commit: this D1 commit; baseline SHA
`a3be318cce5157921cc73cbbed7dc5888bf89304`

Target branch: `Per-PEDS`

Target environment: local Blender/DEV review only

Change summary: fresh independently authored EDS-G03 full-car reconstruction,
C42 reference decomposition, GLB and matched Blender evidence

Risk level: HIGH — 3D geometry, performance-sensitive WebGL asset and visual IP boundary

## STATIC CHECKS

- ESLint: PASS — `npm.cmd run lint`, exit 0.
- TypeScript: PASS — production build `tsc`, exit 0.
- Unit tests: PASS — 39 files, 281 tests, exit 0.
- Integration tests: NOT APPLICABLE — no Showroom integration authorized.
- Build: PASS — `npm.cmd run build`, exit 0.
- Commercial isolation: PASS — build guard removed review-only targets and
  verified 73 original EDS assets; D1 was not bundled.
- Dependency audit: NOT APPLICABLE — no dependency or lockfile change.

## FUNCTIONAL CHECKS

- Core authoring: PASS — `.blend` opens, GLB exports and Three.js parses it.
- Regression: PASS in tested scope — G01/G02/prior G03 files were not replaced.
- Browser: PASS for headless DEV WebGL smoke; 3 desktop and 3 mobile-emulation runs, no errors.
- Mobile physical device: NOT RUN.
- Accessibility: NOT APPLICABLE — no UI change.
- SEO: NOT APPLICABLE — no public route change.

## SPECIALIZED CHECKS

- Blender mesh inspection: PASS — 220 EDS objects, 71,810 evaluated vertices,
  141,768 triangles, zero non-finite vertices, degenerate triangles,
  inconsistent shared edges or non-manifold edges.
- Registry/hardpoints: PASS — 5.050 × 2.000 × 1.177853 m; height is below the
  1.180 m ceiling; wheelbase 3.600 m; axle/track/tyre locks unchanged.
- Deterministic export: PASS — two clean exports matched SHA-256
  `b14bae143e5e64ea52fa3564e05bba857a1a46ee8e20d58e6d2edcd4493fde1f`.
- Three.js loading: PASS — 11 meshes/primitives, 141,768 triangles, 11
  materials, zero textures, finite positions and expected bounds.
- Khronos glTF Validator: NOT RUN — the prior isolated validator installation
  is unavailable and no package change was authorized.
- Exhaustive self-intersection/inter-object collision: NOT RUN — no reliable
  classifier is installed; intended mechanical contacts require review.
- Performance lab: PASS only as limited smoke evidence. Headless Chrome reports
  11 draw calls. Desktop median ready time 349.3 ms, RAF median 16.7 ms and
  worst run p95 16.9 ms. Mobile emulation median ready time 287.4 ms, RAF median
  16.7 ms and worst run p95 17.9 ms. RAF interval is not GPU render time.
- Sustained performance, GPU memory, context loss, LOD transitions, throttled
  network and physical mobile/low-end devices: NOT RUN.
- Security: PASS in scoped source review — no secret, external runtime input,
  executable download or production configuration added.
- Automated data source 1/2: NOT APPLICABLE — no release push.

## CI/CD

- Required GitHub Actions: PENDING — evaluated after the authorized push.
- Preview deployment: NOT RUN.
- Production deployment: NOT RUN.
- Production smoke tests: NOT RUN.

## DEFECTS

- P0: none observed.
- P1: none observed.
- P2: five visual/detail gaps; see `component-comparison.md`.
- P3/P4: halo transition softness and Blender thumbnail-cache warning.

## EVIDENCE

- Commands/exit codes: Blender authoring 0; deterministic export 0; Blender
  mesh validation 0; Three.js validation 0; contact sheets 0; ESLint 0;
  Vitest 0; build/commercial isolation 0; headless browser benchmark 0.
- Results: `geometry-report.json`, `blender-mesh-validation.json`,
  `threejs-validation.json`, `browser-performance.json`.
- Renders: 42 direct Blender PNGs and 12 matched comparison sheets indexed in
  `README.md`.
- Deployment/workflow URLs: NOT APPLICABLE.

## UNVERIFIED ITEMS

Khronos validation, exhaustive intersections, driver ergonomics, aero/CFD,
FIA legality, Meshopt/KTX2, desktop/mobile/low-end LODs, context-loss recovery,
GPU memory lifetime, sustained FPS, throttled network, physical devices,
commercial rights clearance and production integration.

## RESIDUAL RISKS

The D1 GLB is 5,522,424 bytes and has no Meshopt compression. The model meets
the requested review triangle range and reduces draw calls to 11, but the
performance acceptance gate cannot pass without LODs and physical-device/
sustained testing. Several visible regions remain materially simpler than C42.

## FINAL DECISION: HOLD

Reason: owner visual review is mandatory; visual-detail findings remain open;
Khronos, physical-device, LOD and sustained performance evidence is incomplete.
The candidate is not approved for PBR, LOD integration, production replacement
or commercial release.

Next required action: owner reviews the actual `.blend`, GLB and matched sheets,
then requests focused D2 rework or accepts D1 as the next authoring baseline.

**OWNER GATE — C42-REFERENCED EDS RECONSTRUCTION REVIEW**
