# EDS QA RELEASE REPORT — R3.1 hardpoints and proportion blockout

Commit SHA: `ca2476cf2545cf29b26607a6c79e83ad032fc5f6` (working-tree baseline; R3.1 is uncommitted)

Target branch: `Per-PEDS`

Target environment: Local DEV review only

Change summary: Independently authored EDS-G03 hardpoint registry, deterministic neutral-grey
blockout GLB, dimensional validator, DEV comparison mode, six matched-view comparisons and
side/top silhouette evidence.

Risk level: **HIGH** — new WebGL geometry and commercial-isolation boundary.

## STATIC CHECKS

- ESLint: **PASS** — `npm.cmd run lint`, exit 0.
- TypeScript: **PASS** — `npm.cmd exec tsc -- --noEmit`, exit 0.
- Unit tests: **PASS** — `npm.cmd run test`, exit 0; 39 files, 280 tests.
- Focused tests: **PASS** — 2 files, 9 tests covering G03 equations/envelope and commercial
  G02/G03 pruning.
- Integration tests: **NOT APPLICABLE** — no service or data integration changed.
- Build: **PASS** — `npm.cmd run build`, exit 0; 2,214 modules transformed.

## FUNCTIONAL CHECKS

- Core functionality: **PASS for Gate 1 review** — EDS-G03 loads in a new DEV-only comparison
  mode and renders in all six standardized views.
- Regression: **PASS** — G01 remains the production Showroom model; G02, R2 skins and existing
  DEV comparisons remain present.
- Browser: **PASS** — local headless Chrome captured all evidence with zero page errors, console
  errors or failed local requests.
- Mobile: **NOT TESTED** — no physical mobile device was used; responsive production UI was not
  changed.
- Accessibility: **NOT APPLICABLE** — no new production UI or interaction was introduced.
- SEO: **NOT APPLICABLE** — no public route/content change.

## SPECIALIZED CHECKS

- 3D Showroom: **PASS for blockout review** — native `-Z` front orientation is documented; the
  viewer applies a review-only `π` Y rotation to match legacy cameras. Model loading, shadows and
  six cameras worked.
- Dimensions: **PASS** — measured GLB bounds are exactly 5.050 × 2.000 × 1.180 m; wheelbase,
  axle centres, tracks, tyre radii/widths, ground contact and lateral symmetry match the registry.
- Geometry validity: **PASS by internal validator** — 31,376 triangles, 19,393 vertices, five
  draw calls/materials, zero textures, zero NaN/invalid values and zero degenerate triangles.
- Khronos glTF Validator: **NOT TESTED** — CLI unavailable locally.
- Determinism: **PASS** — two consecutive exports produced identical SHA-256
  `89b6077efbca5562ac57334e32b9b80d2729a401bb7b3ebeffb73a12286520a8`.
- Visual acceptance: **HOLD** — stance and numeric proportions are coherent, but floor/body
  junction, sidepod fullness, rear-wing visual weight and halo width require owner judgement.
- Performance: **PASS for short DEV observation only** — Intel UHD ANGLE/D3D11, 1440×900
  headless Chrome; 7 rendered calls, 31,602 rendered triangles, median RAF 16.7 ms and p95
  16.8 ms over 178 post-warm-up samples. This is not sustained or physical-device evidence.
- Security: **PASS (scoped)** — no remote assets, credentials, HTML injection or third-party
  model data added.
- Automated data source 1: **NOT APPLICABLE** — Results Engine/data workflows untouched.
- Automated data source 2: **NOT APPLICABLE** — Results Engine/data workflows untouched.

## CI/CD

- Required GitHub Actions: **NOT RUN** — stage/commit/push prohibited for this gate.
- Preview deployment: **NOT RUN**.
- Production deployment: **NOT APPLICABLE** — prohibited.
- Production smoke tests: **NOT APPLICABLE**.
- Commercial isolation: **PASS** — build removed 14 legacy and two review-only targets; scanned
  28 Showroom source modules and 108 artifact files without violation. `c42.v2.glb`, G02, G03
  preview and `dev-showroom.html` are absent from `dist`.

## DEFECTS

- P0: None observed.
- P1: None observed.
- P2: `R3-G03-001` floor/body junction remains schematic; `R3-G03-002` sidepod/engine-cover
  transition is too full; `R3-G03-003` rear endplates dominate the rear silhouette.
- P3/P4: `R3-G03-004` halo reads broad from the front; `R3-G03-005` wheels/rims are intentionally
  simplified for the hardpoint gate.

Detailed reproduction/evidence and disposition are in `r3-1-issues.md`.

## EVIDENCE

- Commands and exit codes: generator 0; validator 0; focused tests 0; browser capture 0; lint 0;
  TypeScript 0; full tests 0; build/isolation 0.
- Test results: 39 files / 280 tests; focused 2 files / 9 tests.
- Screenshots: six matched comparisons plus side/top contact sheet in
  `evidence/r3-1-blockout/`.
- Benchmark results: `evidence/r3-1-blockout/browser-report.json`.
- Dimensional evidence: `g03-dimensional-validation.json` and `g03-hardpoints.json`.
- Workflow/deployment URLs: none.

## UNVERIFIED ITEMS

- Blender `.blend` authoring, Khronos validator output, physical mobile/discrete GPU behavior,
  sustained memory/thermal behavior, manifoldness of intentional open blockout surfaces and
  independent design-rights clearance.

## RESIDUAL RISKS

- The blockout is not an approved finished shape and must not be mistaken for R3.2 surfaces.
- Numeric consistency cannot approve aesthetics; the listed P2 silhouette issues remain open.
- G03 is unapproved and must remain outside the commercial production graph/artifact.

**FINAL DECISION: HOLD**

**REASON:** R3.1 implementation and local technical checks pass, but Owner Gate 1 proportion
approval is mandatory and the visual issue list remains open.

**NEXT REQUIRED ACTION:** Owner reviews the six matched views and answers: “R3.1 proportions and
silhouette — GO or REVISE?” Do not begin R3.2, stage, commit, push, merge or deploy.
