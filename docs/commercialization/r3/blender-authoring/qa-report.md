# EDS QA RELEASE REPORT

Implementation commit SHA: `43324dbdc89efe9ed18ac1e431418488ecc633f9`
Target branch: `Per-PEDS`
Target environment: DEV-only owner clay-design review
Change summary: new Blender-authored EDS-G03 clay study, reproducible exporter,
review GLB, 40 Blender renders/comparison sheets and QA reports
Risk level: HIGH — new 3D authoring path and WebGL review asset

## STATIC CHECKS

- ESLint: **PASS** — `npm.cmd run lint`, exit 0.
- TypeScript: **PASS** — `npx.cmd tsc --noEmit`, exit 0.
- Unit tests: **PASS** — 39 files, 281 tests, exit 0.
- Integration tests: **PASS (limited)** — Three.js comparison harness loaded
  60 model/view/mode combinations without recorded page, console or request errors.
- Build: **PASS** — production Vite/SEO/prerender build, exit 0.

## FUNCTIONAL CHECKS

- Core functionality: **PASS for DEV review** — GLB loads and all ten requested
  cameras render in diffuse/reflective modes.
- Regression: **PASS (automated)** — existing 281 tests pass; commercial G01 and
  current public G03 files are unmodified.
- Browser: **PASS (headless Chrome)** — 20 matched sheets, zero harness errors.
- Mobile: **PASS only as 375×812 browser emulation**; physical device **NOT RUN**.
- Accessibility: **NOT APPLICABLE** — screenshot-only DEV page.
- SEO: **NOT APPLICABLE** — DEV-only page; production SEO generation still passed.

## SPECIALIZED CHECKS

- 3D Showroom: **HOLD visually** — geometry renders, but four P2 visual issues
  remain in `issues.md`.
- Dimensions: **PASS** — measured `5.050000 × 2.000000 × 1.180000 m`, ground
  `0.000000 m`, wheelbase `3.600 m`, diffuser exit `1.160 m`.
- Determinism: **PASS** — two clean exports both SHA-256
  `2f320533f34c888c706d58c690b56c6defec7c0359741de1dcbd9675dbdc0ce7`.
- Khronos: **PASS** — validator 2.0.0-dev.3.10, 0 errors, 0 warnings,
  131 informational unused-UV notices.
- Independent topology: **PARTIAL PASS** — 157 geometries, 77,426 triangles,
  finite positions/normals, zero degenerates, consistent winding. Open boundary
  edges require review; strict self-intersections and classified inter-mesh
  collisions **NOT TESTED**.
- Performance: **PASS as limited lab evidence** — 1,715,424-byte GLB, 157 draw
  calls, 77,426 triangles, no textures. Median ready time: 205.41 ms desktop and
  188.01 ms mobile emulation across three warm local runs. Median RAF interval
  was 16.7 ms; this is **not GPU render time**.
- Security: **PASS scoped inspection** — no secrets, external runtime URL,
  executable download or third-party texture embedded in repository artifacts.
- Automated data source 1: **NOT RUN / NOT APPLICABLE to owner clay gate**.
- Automated data source 2: **NOT RUN / NOT APPLICABLE to owner clay gate**.

## CI/CD

- Required GitHub Actions: **PENDING after push**.
- Preview deployment: **PENDING after authorized Per-PEDS push**.
- Production deployment: **NOT RUN; prohibited**.
- Production smoke tests: **NOT RUN; prohibited**.

## DEFECTS

- P0: none observed.
- P1: none observed.
- P2: EDS-BLEND-001 through EDS-BLEND-004 — visual design/fidelity gaps.
- P3/P4: EDS-BLEND-005 — 157 draw calls before optimization.

## EVIDENCE

- Commands and exit codes: recorded above; all executed commands exited 0.
- Model/hash: `eds-g03-clay-review.glb`, `eds-g03-clay-review.sha256`.
- Validation: `geometry-report.json`, `topology-report.json`,
  `khronos-validation.json`.
- Screenshots: `evidence/clay-gate/` and `evidence/matched-comparison/`.
- Browser/benchmark: matched comparison `browser-report.json` and
  `browser-performance.json`.

## UNVERIFIED ITEMS

- Physical mobile/desktop GPU and sustained thermal/memory behavior.
- True GPU frame time and WebGL context-loss recovery.
- Whole-scene self-intersection and classified inter-mesh collisions.
- FIA compliance beyond the explicit conflicts in `fia-2026-registry-review.md`.
- Final PBR, UV, LOD and production integration, intentionally not started.

## RESIDUAL RISKS

Open visual P2 defects prevent owner geometry approval. The study also has high
semantic draw-call count and intentional open apertures requiring further
topology review.

**FINAL DECISION: HOLD**

**REASON:** Technical export gates pass, but visual sophistication does not yet
match the Detailed + EDS target and independent collision coverage is incomplete.

**NEXT REQUIRED ACTION:** Owner reviews the matched clay sheets and either
rejects this direction or authorizes focused Blender re-authoring of the inlet,
floor edge and diffuser. Do not begin PBR, LOD, R3.3 or commercial integration.
