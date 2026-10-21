# EDS QA RELEASE REPORT — R3.2 primary surfaces

Verified baseline SHA: `0808b72d62420ff7bfbcab2e6aa7e48f25a692d1`; focused R3.2 review
commit/push authorized by owner on 2026-10-21.

Target branch: `Per-PEDS`

Target environment: Local DEV review only

Change summary: Refined the original EDS-G03 primary body/aero surfaces and added neutral
diffuse/reflective DEV inspection plus Gate 2 evidence. Locked R3.1 hardpoints are unchanged.

Risk level: **HIGH** — WebGL geometry, runtime resource lifetime and commercial isolation.

## STATIC CHECKS

- ESLint: **PASS** — `npm.cmd run lint`, exit 0, zero warnings/errors.
- TypeScript: **PASS** — `npm.cmd exec tsc -- --noEmit`, exit 0.
- Unit tests: **PASS** — `npm.cmd run test`, exit 0; 39 files, 281 tests.
- Focused G03 tests: **PASS** — revision, locked registry and dimensional equations covered.
- Integration tests: **NOT APPLICABLE** — no service/data integration changed.
- Build: **PASS** — `npm.cmd run build`, exit 0; 2,214 modules transformed.

## FUNCTIONAL CHECKS

- Core functionality: **PASS for Gate 2 review** — G03 loads in the DEV comparison, all six
  full-car cameras and six close-ups render, and diffuse/reflective inspection switches work.
- Regression: **PASS** — G01 remains the production Showroom model; G02/R2/legacy DEV assets are
  preserved.
- Browser: **PASS** — local headless Chrome completed capture with zero page errors, console
  errors or failed local requests.
- Mobile / physical device: **NOT TESTED**.
- Accessibility: **NOT APPLICABLE** — no production interaction was added.
- SEO: **NOT APPLICABLE** — no public route or content changed.

## SPECIALIZED CHECKS

- 3D Showroom: **PASS for R3.2 inspection** — neutral diffuse and subtle reflective modes expose
  the surfaces without postprocessing; camera/lighting conditions are matched.
- Dimensions: **PASS** — GLB bounds exactly 5.050 x 2.000 x 1.180 m; 3.600 m wheelbase, axles,
  tracks, tyre dimensions and ground contact match the registry.
- Geometry validity: **PASS by internal validator** — 102,072 triangles, 56,620 vertices, five
  nodes/draw calls/materials, zero textures, zero invalid values and zero degenerate triangles.
- Khronos glTF Validator: **NOT TESTED** — CLI unavailable locally.
- Determinism: **PASS** — two clean exports were byte-identical at SHA-256
  `97c60980185db2ba491d9fa9244da70e2bb1ae73d829ec231fceb0050d957dc9`.
- Resource lifetime: **PASS** — 32 renderer geometries and 10 textures remained unchanged after
  12 inspection-material switches and six G01/G03 unmount/remount cycles.
- Visual acceptance checks: **PASS FOR OWNER REVIEW** — six views and six paired close-ups showed
  no visible flipped surface, white patch, clipping or obvious primary-surface stretch.
- Performance: **PASS for short DEV observation only** — Intel UHD ANGLE/D3D11 at 1440x900;
  seven calls, 102,298 rendered triangles, median RAF 16.7 ms and p95 17.2 ms over the final
  post-switch sample. Not a sustained or physical-device benchmark.
- Security: **PASS (scoped)** — no remote asset, credential, unsafe URL, branding or third-party
  geometry was added.
- Automated data sources 1/2: **NOT APPLICABLE** — Results Engine/data workflows untouched.

## CI/CD

- Required GitHub Actions: **NOT APPLICABLE to this review push** — the tracked `ci.yml` does not
  trigger on `Per-PEDS`. The local untracked `per-peds-ci.yml` is outside this commit.
- Preview deployment: **NOT RUN**.
- Production deployment: **NOT APPLICABLE** — prohibited.
- Production smoke tests: **NOT APPLICABLE**.
- Commercial isolation: **PASS** — build removed 14 legacy and two review-only targets; 28
  Showroom source modules and 108 artifacts scanned. C42, G02, G03 preview and
  `dev-showroom.html` are absent from `dist`.

## DEFECTS

- P0/P1/P2: None open after local retest.
- P3/P4: Primary-form endplates, suspension and wheel internals are intentionally not secondary
  detail. Internal validation does not certify manifoldness.

## EVIDENCE

- Commands/exits: generator x2 0; validator 0; browser capture 0; ESLint 0; TypeScript 0; unit
  tests 0; build/commercial isolation 0.
- Screenshots and browser metrics: `evidence/r3-2-surfaces/`.
- Dimensions/provenance: `g03-dimensional-validation.json`, `g03-hardpoints.json`,
  `r3-2-surface-authorship.md` and `r3-2-issues.md`.
- Workflow/deployment URLs: none.

## UNVERIFIED ITEMS

Khronos validator, Blender inspection, physical mobile/discrete-GPU behavior, sustained thermal/
memory behavior, watertight manifoldness and independent design-rights clearance.

## RESIDUAL RISKS

The triangle count increased from 33,688 to 102,072 for surface smoothness. Short desktop render
timing is stable, but physical-device and sustained-memory evidence are absent. Detailed + EDS is
only a visual benchmark and its DEV scale is not physical metrology.

**FINAL DECISION: HOLD**

**REASON:** All available local R3.2 technical gates pass, but Owner Gate 2 visual approval is
mandatory and physical-device/Khronos checks remain unverified.

**NEXT REQUIRED ACTION:** Push only the owner-authorized R3.2 review scope to `Per-PEDS`, then
report the commit and any CI result. Owner reviews the R3.2 full views, close-ups and before/after
evidence and answers: “R3.2 primary surface quality — GO or REVISE?” Do not begin R3.3/R3.4,
merge or deploy.
