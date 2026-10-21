# EDS QA RELEASE REPORT — R3.1 Revision 1 proportion correction

Commit SHA: `c182a668540129d19da26cc8bb6fe6127843668c` (verified baseline; revision is
uncommitted)

Target branch: `Per-PEDS`

Target environment: Local DEV review only

Change summary: Corrected EDS-G03 sidepod, floor/body, rear-wing, halo/cockpit and engine-cover
mass distribution; separated physical-scale and normalized comparisons; preserved locked chassis
dimensions.

Risk level: **HIGH** — WebGL geometry and DEV/commercial-isolation boundary.

## STATIC CHECKS

- ESLint: **PASS** — `npm.cmd run lint`, exit 0.
- TypeScript: **PASS** — `npm.cmd exec tsc -- --noEmit`, exit 0.
- Unit tests: **PASS** — `npm.cmd run test`, exit 0; 39 files, 281 tests.
- Focused tests: **PASS** — 2 files, 10 tests covering G03 equations/revision envelopes and
  commercial G02/G03 pruning.
- Integration tests: **NOT APPLICABLE** — no service/data integration changed.
- Build: **PASS** — `npm.cmd run build`, exit 0; 2,214 modules transformed.

## FUNCTIONAL CHECKS

- Core functionality: **PASS for Gate 1 review** — revised G03 loads in the DEV-only comparison
  mode and renders through all six cameras.
- Regression: **PASS** — G01 remains the production Showroom model; G02, R2 skins and legacy DEV
  comparison remain available.
- Browser: **PASS** — local headless Chrome produced six normalized comparisons, six physical-
  scale comparisons and a side/top sheet with zero page errors, console errors or failed local
  requests.
- Mobile: **NOT TESTED** — no physical device used.
- Accessibility: **NOT APPLICABLE** — no production interaction added.
- SEO: **NOT APPLICABLE** — no public route/content change.

## SPECIALIZED CHECKS

- 3D Showroom: **PASS for blockout review** — six cameras, model loading, lighting and shadows
  worked; native `-Z` front and review-only pi Y rotation remain documented.
- Dimensions: **PASS** — measured GLB bounds exactly 5.050 x 2.000 x 1.180 m; strict accessor
  bounds, 3.600 m wheelbase, axle centres, tracks, tyre dimensions and ground contact match.
- Geometry validity: **PASS by internal validator** — 33,688 triangles, 20,589 vertices, five
  draw calls/materials, zero textures, zero invalid values and zero degenerate triangles.
- Khronos glTF Validator: **NOT TESTED** — CLI unavailable locally.
- Determinism: **PASS** — two consecutive exports produced SHA-256
  `8a63d6834b28e4a436b4012946dc033f50664a514b109cc30b49282c2a4fb861`.
- Comparison methodology: **PASS** — physical-scale and normalized evidence are separate;
  visible pixel extents, crop threshold and normalization factors are recorded.
- Visual defect retest: **PASS FOR R3.1** — the four rejected proportion defects materially
  improved; no P0/P1/P2 issue remains open from this revision request.
- Performance: **PASS for short DEV observation only** — Intel UHD ANGLE/D3D11 at 1440x900;
  seven rendered calls, 33,914 rendered triangles, median RAF 16.7 ms and p95 16.8 ms over 217
  post-warm-up samples. This is not sustained or physical-device evidence.
- Security: **PASS (scoped)** — no remote asset, credential, HTML injection or third-party model
  data added.
- Automated data source 1: **NOT APPLICABLE** — Results Engine/data workflows untouched.
- Automated data source 2: **NOT APPLICABLE** — Results Engine/data workflows untouched.

## CI/CD

- Required GitHub Actions: **NOT RUN** — stage/commit/push prohibited by the task.
- Preview deployment: **NOT RUN**.
- Production deployment: **NOT APPLICABLE** — prohibited.
- Production smoke tests: **NOT APPLICABLE**.
- Commercial isolation: **PASS** — build removed 14 legacy and two review-only targets; 28
  Showroom source modules and 108 artifact files scanned without violation. C42, G02, G03 preview
  and `dev-showroom.html` are absent from `dist`.

## DEFECTS

- P0: None observed.
- P1: None observed.
- P2: None open after retest. Baseline defects R3-G03-001/002/003 passed R3.1 retest.
- P3/P4: R3-G03-004 passed retest. R3-G03-005 simplified wheels/wing sections remains an
  accepted R3.1 limitation and is not authorization for R3.2 work.

## EVIDENCE

- Commands/exit codes: two generator runs 0; validator 0; focused tests 0; browser capture 0;
  ESLint 0; TypeScript 0; full tests 0; build/commercial isolation 0.
- Screenshots: `comparison-*.png`, `physical-comparison-*.png` and
  `silhouette-side-top-contact-sheet.png` in `evidence/r3-1-blockout/`.
- Measurements: `r3-1-revision-1-measurements.md`, `g03-hardpoints.json`,
  `g03-dimensional-validation.json` and `browser-report.json`.
- Workflow/deployment URLs: none.

## UNVERIFIED ITEMS

- Khronos validator, Blender workflow, physical mobile/discrete GPU behavior, sustained thermal/
  memory behavior, manifoldness of intentional blockout shells and independent design-rights
  clearance.

## RESIDUAL RISKS

- Normalized images intentionally remove apparent-size differences and must be read alongside
  physical-scale evidence.
- The legacy model's `0.105` DEV transform is not certified physical-scale evidence.
- G03 remains an owner-review blockout and outside the commercial production graph.

**FINAL DECISION: HOLD**

**REASON:** All local R3.1 Revision 1 technical gates pass, but Owner Gate 1 visual approval is
mandatory and has not yet been granted.

**NEXT REQUIRED ACTION:** Owner reviews the revised normalized and physical-scale evidence and
answers: “R3.1 Revision 1 proportions and silhouette — GO or REVISE?” Do not begin R3.2, stage,
commit, push, merge or deploy.
