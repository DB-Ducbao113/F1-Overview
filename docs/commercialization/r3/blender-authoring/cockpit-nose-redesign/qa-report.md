# EDS QA RELEASE REPORT — R3 cockpit, halo and long-nose design gate

Commit SHA: `6aa2e12a4662a5499e669c6c20ef82765bcccbff`  
Target branch: `Per-PEDS`  
Target environment: local Blender design gate only  
Change summary: two independent Precision Machine cockpit/halo/nose studies,
N30 and N20, plus matched evidence and diagnostics  
Risk level: HIGH — 3D geometry and owner-facing visual direction

## STATIC CHECKS

- ESLint: PASS — `npm.cmd run lint`, exit 0.
- TypeScript: PASS — executed by production build, exit 0.
- Unit tests: PASS — 39 files, 281 tests.
- Integration tests: NOT APPLICABLE — no runtime integration authorized.
- Build: PASS — `npm.cmd run build`, exit 0; commercial visual isolation passed.
- Scoped formatting: PASS after formatting the two new JavaScript utilities.
- `git diff --check`: PASS; one line-ending warning belongs to the pre-existing
  unrelated Cloudflare document.

## FUNCTIONAL CHECKS

- Core functionality: PASS in authoring scope — both `.blend` files open and
  both GLBs parse as glTF 2.0.
- Regression: PASS — existing A/B/C concept files and commercial assets were
  not replaced.
- Browser: NOT APPLICABLE — no application integration.
- Mobile: NOT RUN — prohibited before owner selection/high-detail phase.
- Accessibility: NOT APPLICABLE.
- SEO: NOT APPLICABLE.

## SPECIALIZED CHECKS

- 3D Showroom: NOT RUN — no Showroom asset was changed.
- Geometry registry: PASS — both studies measure 5.05 × 2.00 × 1.18 m with
  3.60 m wheelbase and retained locked hardpoints.
- Ratio gate: PASS — N30 is exactly 30:70 (A 1.515 m, B 3.535 m); N20 is
  exactly 20:80 (A 1.010 m, B 4.040 m).
- Mesh diagnostics: PASS in stated scope — each evaluated Blender scene reports
  56,934 triangles, 0 degenerate triangles, 0 non-finite vertices/normals,
  0 inconsistent shared-edge directions and 0 non-manifold shared edges.
- Inter-assembly collision/self-intersection: NOT RUN.
- Deterministic export: FAIL — three exports retained stable byte counts and
  measured geometry but produced different SHA-256 hashes; see
  `deterministic-export.json`.
- Performance: NOT RUN — silhouette gate only; no LOD/PBR/performance claim.
- Security: PASS — no secrets, external runtime inputs or production settings added.
- Automated data source 1: NOT APPLICABLE — no release/push.
- Automated data source 2: NOT APPLICABLE — no release/push.

## CI/CD

- Required GitHub Actions: NOT RUN — push explicitly prohibited.
- Preview deployment: NOT RUN.
- Production deployment: NOT RUN.
- Production smoke tests: NOT RUN.

## VISUAL QA

- N30: strongest overall solution. Top and side evidence show a continuous,
  slender monocoque-to-opening transition; the cockpit rim and halo fairings
  read as one architecture. The 0.665 m front-axle clearance keeps suspension,
  nose and driver zones visually separated.
- N20: valid extreme proportion study, but the 0.160 m front-axle clearance
  creates a compressed driver/front-suspension package. Its longer opening and
  forward head position dominate the upper silhouette and reduce restraint.
- Baseline comparison: both studies replace the baseline's abrupt, wide opening
  with a longer recessed volume and stronger centerline continuity. N30 retains
  the baseline's premium composure more successfully.
- Reference use: only general packaging principles were used. No proprietary
  geometry, livery, logo or protected surface was copied.
- FIA compliance: NOT CLAIMED.

## DEFECTS

- P0: none observed.
- P1: none observed.
- P2 `EDS-R3-CNR-001`: N20 cockpit edge is only 0.160 m behind the front axle;
  physical packaging feasibility is unverified. Status: OPEN / owner-direction
  decision required.
- P2 `EDS-R3-CNR-002`: GLB export is not byte-deterministic across clean runs.
  Status: OPEN / resolve before production asset authoring.
- P3/P4: none recorded.

## EVIDENCE

- Commands and exit codes: Blender authoring 0; Blender geometry diagnostics 0;
  Node GLB validation 0; contact-sheet capture 0; ESLint 0; Vitest 0; build 0;
  `git diff --check` 0.
- Test results: `validation.json`, `geometry-validation.json`,
  `deterministic-export.json`.
- Screenshots: 48 direct Blender PNGs plus 16 three-way sheets, 9 focused
  comparisons and one ratio PNG, indexed in the evidence `README.md`.
- Benchmark results: NOT RUN at silhouette gate.
- Workflow/deployment URLs: NOT APPLICABLE.

## UNVERIFIED ITEMS

Driver ergonomics, survival-cell packaging, visibility envelope, aerodynamic
performance, inter-part collision, FIA legality, physical-device rendering,
sustained FPS, GPU memory, LOD transitions and production integration.

## RESIDUAL RISKS

N20 may require hardpoint changes to become physically credible. Both concepts
remain silhouette studies, and current driver-head geometry is a neutral
packaging indicator rather than a final ergonomic model. Export reproducibility
must be fixed before any promoted asset pipeline.

## FINAL DECISION: HOLD

Reason: owner cockpit/nose approval is mandatory; N20 packaging is unverified;
deterministic export failed.  
Next required action: owner selects N30, N20, or requests a focused revision.
Do not begin high-detail modeling, PBR, LOD or integration.

**FINAL STATUS: AWAITING OWNER COCKPIT & NOSE DESIGN APPROVAL.**
