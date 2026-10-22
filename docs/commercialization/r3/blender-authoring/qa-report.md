# EDS QA RELEASE REPORT - Blender refinement Revision 2

Source baseline SHA: `8fda531d222acda2fd68b33ab8cf8b980b9ac6d8`

Delivery commit SHA: recorded in the `Per-PEDS` branch log after commit

Target branch: `Per-PEDS`

Target environment: DEV-only owner design review

Change summary: focused inlet, floor, diffuser and mechanical-detail re-authoring

Risk level: HIGH - 3D geometry, deterministic export and WebGL review

## STATIC CHECKS

- ESLint: **PASS** - `npm.cmd run lint`, exit 0.
- TypeScript: **PASS** - `npx.cmd tsc --noEmit`, exit 0.
- Unit tests: **PASS** - 39 files, 281 tests, exit 0.
- Integration tests: **PASS (limited)** - 66 model/view/mode browser loads across
  22 comparison sheets completed with zero recorded page, console or request errors.
- Build: **PASS** - `npm.cmd run build`, exit 0.
- Commercial isolation: **PASS** - guard scanned 28 Showroom source modules and
  108 artifact files after pruning 14 legacy and 2 review-only targets.

## FUNCTIONAL CHECKS

- Core DEV renderer: **PASS** - candidate loads in Three.js and Blender.
- Geometry locks: **PASS** - measured `5.050000 x 2.000000 x 1.180000 m`,
  wheelbase `3.600 m`, diffuser exit `1.160 m`, ground `0.000000 m`.
- Hardpoints: **PASS** - locked axle, track, wheel and halo registry values are
  unchanged in source and generated report.
- Browser: **PASS (headless Chrome)** - 22 matched sheets and 12 focused sheets.
- Mobile: **PASS as 375x812 emulation only**; physical device **NOT RUN**.
- Accessibility/SEO: **NOT APPLICABLE** to screenshot-only DEV route; production
  SEO/prerender build still completed.

## SPECIALIZED CHECKS

- GLB deterministic export: **PASS** - two clean exports matched SHA-256
  `0f232ec60f645ecabcad2156295867e51e1c4b48e9236396dc4ff1dee249abcf`.
- Khronos Validator 2.0.0-dev.3.10: **PASS** - 0 errors, 0 warnings, 137
  informational unused-UV notices.
- Independent topology: **PARTIAL PASS** - 164 geometries, 71,952 triangles,
  finite positions/normals, zero degenerate triangles and consistent winding.
  Floor, diffuser and the two new transition shells are watertight.
- Open boundaries: **REVIEW REQUIRED** - 11,348 exported primitive boundary
  edges include intentionally open inlet/duct/airfoil/curve apertures.
- Strict self-intersection: **NOT TESTED**.
- Classified inter-mesh collision: **NOT TESTED**.
- Performance: **PASS as limited local evidence** - 1,594,552 bytes, 164 draw
  calls, 71,952 triangles, 0 textures. Three-run median ready time was 190.83 ms
  desktop and 182.33 ms mobile emulation. Median RAF interval was 16.7 ms; RAF
  is not GPU frame time. Versus the prior report, bytes fell 120,872 and
  triangles fell 5,474 while draw calls rose 7.
- Security/provenance: **PASS scoped inspection** - no credentials, external
  runtime assets, logos, tire lettering or third-party geometry added.
- FIA compliance: **NOT CLAIMED**; registry conflicts remain documented in
  `fia-2026-registry-review.md`.
- Physical GPU, sustained thermal/memory and context-loss tests: **NOT RUN**.

## CI/CD

- GitHub Actions: **PENDING** until the authorized `Per-PEDS` push completes.
- Preview deployment: **PENDING** after push; production remains prohibited.
- Production deployment/smoke: **NOT RUN; prohibited**.
- Stage/commit/push: **AUTHORIZED BY OWNER** for `Per-PEDS` only.

## DEFECTS

- P0/P1: none observed.
- P2: EDS-BLEND-001/002/003 await owner visual decision;
  EDS-BLEND-004 fidelity gap remains open.
- P3: EDS-BLEND-005 semantic draw-call density remains open.

## EVIDENCE

- Model/source: `eds-g03-clay-design.blend`, `eds-g03-clay-review.glb`,
  `scripts/blender/eds_g03_clay_authoring.py`.
- Validation: `geometry-report.json`, `topology-report.json`,
  `khronos-validation.json`, `eds-g03-clay-review.sha256`.
- Visual index: `evidence/refinement-revision-2/README.md`.
- Browser/performance: `browser-performance.json` and capture JSON logs.

## UNVERIFIED ITEMS

- Owner visual acceptance.
- Physical desktop/mobile GPU behavior and sustained resource lifetime.
- True GPU frame time.
- Strict whole-scene self-intersection and classified inter-mesh collision.
- PBR, UV, LOD and commercial integration, intentionally outside this gate.

## RESIDUAL RISKS

The revised local surfaces are technically valid and visibly different, but the
candidate still trails the Detailed + EDS reference in component density. Open
apertures inflate primitive boundary counts, and no independent collision
classifier was available.

**FINAL DECISION: HOLD**

**REASON:** mandatory automated checks passed, but owner visual approval and two
independent geometry checks remain outstanding.

**NEXT REQUIRED ACTION:** owner reviews the Revision 2 evidence and issues GO or
REVISE. Do not begin PBR, LOD, R3.3 or commercial integration.
