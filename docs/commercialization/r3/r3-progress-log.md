# R3 EDS-G03 progress log

## 2026-10-20 — R3.1 Hardpoints and proportion blockout

- Branch / HEAD / worktree baseline: `Per-PEDS` at
  `ca2476cf2545cf29b26607a6c79e83ad032fc5f6`; pre-existing modified
  `docs/cloudflare-migration-readiness.md` and untracked `.github/workflows/per-peds-ci.yml`,
  R3 master plan and `references/` were preserved.
- Owner approval for this gate (where recorded): task explicitly authorizes R3.0 baseline and
  R3.1 hardpoint/blockout work only; R3.2 is not approved.
- Source files changed: `scripts/eds-g03-design.mjs`, `scripts/generate-eds-g03.mjs`,
  `scripts/validate-eds-g03.mjs`, `scripts/capture-r3-g03-blockout.mjs`, focused test and package
  scripts; DEV viewer and commercial guards; R3 evidence/docs.
- Reproducible generation command and hash: `npm.cmd run asset:eds-g03`; SHA-256
  `89b6077efbca5562ac57334e32b9b80d2729a401bb7b3ebeffb73a12286520a8`. Two consecutive
  generations matched.
- Dimension table / actual model bounds: min `[-1, 0, -2.6]`, max `[1, 1.18, 2.45]`; actual
  5.050 × 2.000 × 1.180 m; 3.600 m wheelbase; exact axle, track, tyre and ground-contact checks
  recorded in `g03-dimensional-validation.json`.
- Visual files for 6 camera views: `evidence/r3-1-blockout/comparison-*.png`; side/top sheet at
  `silhouette-side-top-contact-sheet.png`.
- QA PASS / FAIL / NOT TESTED: generator/validator, deterministic export, ESLint, TypeScript,
  39 files/280 tests, build, browser capture and commercial isolation PASS. Khronos validator,
  physical device, Blender and sustained performance NOT TESTED. Visual owner acceptance HOLD.
- Open shape defects (P0/P1/P2): no P0/P1; three P2 issues — schematic floor/body junction,
  full sidepod/engine transition and visually heavy rear endplates. See `r3-1-issues.md`.
- Protected/unrelated local changes preserved: G01, G02, C42/R2 skins, Results Engine, CI,
  Cloudflare and `references/` were not overwritten or removed.
- Proposed next action: owner reviews stance, wheel placement, nose/cockpit, sidepod envelope,
  floor planform and wing balance.
- Status: **WAITING_FOR_OWNER_REVIEW**

## 2026-10-21 — R3.1 Revision 1 proportion correction

- Owner decision: **REVISE** at Gate 1; R3.2 remained prohibited.
- Verified baseline: `Per-PEDS` at `c182a668540129d19da26cc8bb6fe6127843668c`.
- Locked dimensions preserved: 5.050 x 2.000 x 1.180 m, 3.600 m wheelbase, axle stations,
  track, tyres, front-wing envelope and ground contact unchanged.
- Local envelope corrections: sidepod half-width 0.76 to 0.66 m; halo top 1.08 to 0.94 m;
  rear-wing span 1.48 to 1.36 m; floor planform narrowed and given an undercut bridge.
- Comparison correction: added six physical-scale sheets and six normalized silhouette sheets;
  recorded per-view visible pixel bounds and ground alignment in `browser-report.json`.
- Ratio disposition: retained wheelbase/length 0.712871. Older 0.63-0.66 illustrative values
  conflict with locked 5.05 m / 3.60 m dimensions and were not used.
- Reproducible generation: `npm.cmd run asset:eds-g03`; candidate SHA-256
  `8a63d6834b28e4a436b4012946dc033f50664a514b109cc30b49282c2a4fb861`; two consecutive
  final exports matched.
- No stage, commit, push, merge or deployment performed.
- Status: **WAITING_FOR_OWNER_REVIEW — REVISION 1**

## 2026-10-21 — R3.2 high-fidelity primary surface refinement

- Owner Gate 1 decision: **GO**; verified baseline `0808b72d62420ff7bfbcab2e6aa7e48f25a692d1`.
- Locked 5.050 x 2.000 x 1.180 m bounds, 3.600 m wheelbase, axles, tracks, tyre sizes,
  ground contact and all approved R3.1 sidepod/halo/cockpit/rear-wing envelopes were preserved.
- Re-authored primary surfaces with deterministic cross-section lofts, connected floor channels,
  integrated airbox/engine spine, curved airfoil volumes and blended halo mounts. No skin, UV,
  branding, secondary-detail pass or C42-derived geometry was added.
- Preview: 1,977,056 bytes; 102,072 triangles; 56,620 vertices; five draw calls/materials; zero
  textures; SHA-256 `97c60980185db2ba491d9fa9244da70e2bb1ae73d829ec231fceb0050d957dc9`.
- Evidence: six normalized views, six physical-camera views, six R3.1/R3.2 before/after sheets,
  side/top silhouette sheet and six diffuse/reflective close-ups under
  `evidence/r3-2-surfaces/`.
- Local gates: deterministic export, internal GLB validation, ESLint, TypeScript, 39 files/281
  tests, production build, commercial isolation and DEV browser capture passed. Khronos,
  physical-device, Blender and sustained thermal tests were not run.
- Existing owner changes in Cloudflare/CI/references and all G01/G02/R2 work were preserved.
- No stage, commit, push, merge or deployment performed.
- Status: **WAITING_FOR_OWNER_REVIEW — OWNER GATE 2**

## 2026-10-21 — Owner-authorized review-branch push

- Owner explicitly requested `push đi` after the local R3.2 Gate 2 handoff. This authorizes a
  focused commit and push to `Per-PEDS`; it is not a Gate 2 shape GO or a production release.
- Remote `Per-PEDS` was verified at baseline `0808b72d62420ff7bfbcab2e6aa7e48f25a692d1`.
- Commit scope: R3.2 source, preview GLB, DEV viewer, visual evidence and R3 documentation only.
  Existing unrelated Cloudflare, CI, master-plan and `references/` edits remain local.
- Tracked `ci.yml` does not trigger on `Per-PEDS`; the local `per-peds-ci.yml` is unrelated
  untracked owner work and is excluded from this commit. No CI run is expected for this push.
- Deployment status: **NOT RUN**; this is a review-branch push.
- Owner Gate 2 shape decision: **HOLD — visual review still required**.

## 2026-10-21 — R3.2 Revision 2 intake, diffuser and halo review

- Branch/baseline: `Per-PEDS`, `a4a36a0`; unrelated Cloudflare, local CI,
  master-plan and `references/` edits preserved.
- Owner instruction: revise three Gate 2 visual items; no R3.3, merge or
  deployment. A push is conditional on not triggering a deployment.
- Source: parametric body grid apertures plus recessed ducts; revised diffuser
  channel/exit profile; three tapered halo joint collars and shell fairings.
  Hardpoint registry unchanged apart from revision metadata.
- Preview: `npm.cmd run asset:eds-g03`; 1,129,672 bytes; 56,472 triangles,
  32,704 vertices; five neutral materials and no textures. Two generated GLBs
  matched SHA-256 `93a1416b3d68e7323c1b2ff0bbb666d7d6008b75dc1b21e1de3cc0af8ab1ec33`.
- Actual bounds: 5.050 x 2.000 x 1.180 m; wheelbase 3.600 m; all locked
  axle/track/tyre/ground checks PASS. No invalid normals, winding disagreements
  or degenerate triangles in the internal validator.
- Visual evidence: nine matched diffuse/reflective sheets in
  `evidence/r3-2-revision-2-surface-refinement/`. Inlet is an actual dark duct
  but mouth remains angular; diffuser improvement is subtle; halo joints remain
  simple. Owner Gate 2 is **HOLD**, not visually approved.
- QA: ESLint, TypeScript, 39 files/281 tests, production build, commercial
  isolation and DEV browser capture PASS. Khronos validator, physical devices,
  Blender and sustained performance NOT TESTED.
- Deployment guard: Vercel lists preview deployments for prior `Per-PEDS`
  pushes, including `a4a36a0`. Therefore this candidate must **not be pushed**
  under the owner's no-deployment condition. No deploy/merge/main action.
  This corrects the older review-push entry's "no deployment expected" claim:
  that claim did not account for Vercel's Git-triggered previews.
- Next action: local handoff for owner Gate 2 review and deployment-policy
  clarification if remote sharing is required.

## 2026-10-21 — R3.2 Revision 3 rounded inlet, diffuser and halo

- Branch/baseline: `Per-PEDS`, `14b99b6`; pre-existing Cloudflare document,
  untracked CI draft, R3 master plan and `references/` preserved.
- Owner decision: **REVISE** at Gate 2. Owner explicitly authorized a local
  commit but did not authorize a push or any deployment for this revision.
- Source: rounded aperture and deeper duct cut into the original shell grid;
  wider twin-channel rear underbody relief; variable-radius halo sweeps at the
  three unchanged mount centres. No skins or R3.3 details.
- Generator: `npm.cmd run asset:eds-g03`; two GLBs matched SHA-256
  `9a9424af2fd6ad1b83b9a49d6c8ab0c580a518c9b9a850b9f62f7b73c56a0604`.
  Preview size 1,136,876 bytes; 57,320 triangles, 32,791 vertices, five
  materials/draw calls and no textures.
- Measured bounds: 5.050 × 2.000 × 1.180 m; wheelbase 3.600 m. Axles, tracks,
  tyre radii, ground plane and approved wing/halo envelopes unchanged.
- Evidence: 12 matched four-panel diffuse/reflective sheets and three matched
  closer wireframes under `evidence/r3-2-revision-3-surface-refinement/`.
- Local QA: internal validator, Khronos glTF Validator, deterministic export,
  browser capture, ESLint, TypeScript, 39 files/281 unit tests, production build
  and commercial isolation PASS. Independent trimesh winding consistent; all
  five mesh groups remain non-watertight as in the baseline. Physical device,
  Blender and sustained GPU performance NOT TESTED.
- Shape issues: inlet visibly rounder; diffuser exit still shallow with a small
  central gable; halo body/tube boundary remains visible. No owner visual GO.
- Proposed next action: owner reviews images and decides Gate 2 GO or REVISE.
- Status: **WAITING_FOR_OWNER_REVIEW — OWNER GATE 2 HOLD**. No R3.3, push,
  merge or deployment.

## 2026-10-21 — R3.2 Revision 4 focused Gate 2 closure attempt

- Branch/baseline: `Per-PEDS`, `4762005`. Existing unrelated Cloudflare
  document, CI draft, R3 master-plan file and `references/` preserved.
- Scope: preserved rounded inlet and body/floor; revised only rear underbody
  channel/rise and the three shell-to-halo mount transitions. Accepted
  hardpoints, wheelbase, tracks and 5.050 × 2.000 × 1.180 m bounds unchanged.
- Final deterministic DEV GLB SHA-256:
  `c197b483bcee8736f74a998a4763bf6f66be1197f645c831b789aacd8d41eb10`;
  1,136,864 bytes, 57,320 triangles, 32,791 vertices, five material groups,
  zero textures. No polygon increase over the Revision 3 baseline.
- Evidence: twelve matched diffuse/reflective comparison sheets, three
  targeted wireframe sheets and browser metadata under
  `evidence/r3-2-revision-4-gate-2-closure/`.
- Independent topology: unchanged open-edge counts and consistent winding;
  no strict local BODY triangle crossings in bounded diffuser/halo zones.
  Inter-mesh/coplanar and physical-device inspection are unverified.
- Technical QA and precise visual disposition: see
  `r3-2-revision-4-qa-report.md`. The diffuser still reads shallow and rear
  halo attachment boundaries remain visible. **OWNER GATE 2 HOLD; recommend
  REVISE, not R3.3.** No merge, deploy or push.

## 2026-10-21 — R3.2 Geometry Design Review (GDR)

- Branch/baseline: `Per-PEDS`, `4a40ddc5c6bbf52e2513a1b9bd32c10de7e29855`.
  Accepted Revision 4 GLB unchanged at SHA-256
  `c197b483bcee8736f74a998a4763bf6f66be1197f645c831b789aacd8d41eb10`.
- Investigation: exported diffuser lower exit measured about 1.020 m wide
  against 1.160 m in the registry; channel lower envelope falls near its
  rear termination. BODY and MECHANICAL halo meshes cross at 96 strict
  local triangle pairs around the rear mounts.
- Six isolated region GLBs (Revision 4 crops plus two prototypes for each
  problem), six matched diffuse/reflective/wireframe comparison sheets,
  cross-section/profile, topology, normal and Khronos results in `gdr/evidence/`.
  No prototype replaced the full-car preview.
- A profile-only diffuser is still subtle; B's stronger local resection
  looks too harsh. A broader halo fairing raises crossings to 106; the
  welded-loop concept eliminates that separate junction but its specimen
  still looks like round pads. Neither exact prototype is approved.
- GDR local QA: ESLint, TypeScript, 39 files/281 tests, build/commercial
  isolation, deterministic region exports, Khronos Validator and DEV WebGL
  capture PASS for their stated scope. Physical-device, integrated full-car
  prototype and exhaustive collision inspection NOT TESTED.
- Recommendation: hybrid global procedural shell plus explicitly stitched
  original local diffuser/halo topology, subject to owner approval of the
  architecture and 1.160 m diffuser exit target. See `gdr/r3-2-gdr-decision.md`.
- Unrelated Cloudflare/CI/master-plan/reference changes preserved. No push,
  merge, deploy, Revision 5 or R3.3. **OWNER DESIGN GATE — DECISION REQUIRED;
  HOLD / REVISE.**

## 2026-10-21 — R3.2 Revision 5, hybrid local topology

- Branch/baseline: `Per-PEDS` at `47fcfca54cc5a2208216af19c36806806ba8d415`.
  Owner authorized Option C and later explicitly authorized pushing only to
  `Per-PEDS`, including any automatic Preview. No `main`/merge/production work.
- Source: authored rear terminal diffuser section and three grid-hole/stitched
  halo mounting sleeves, preserving original G03 global dimensions, sidepods,
  nose, wings, registry hardpoints, neutral materials and commercial G01.
- Preview GLB: 1,236,212 bytes, 62,864 triangles, 5 material groups, zero
  textures. Two exports matched SHA-256
  `d083d75f2b76f825e58272412ea7925dd251385a5d97d76a917391a763211fde`.
  Measured bounds 5.050 × 2.000 × 1.180 m; wheelbase 3.600 m.
- Exit width corrected from 1.019646 to the locked 1.160000 m. Prior terminal
  channel drop eliminated. Original 96 strict rear BODY/MECHANICAL crossing
  pairs reduced to 0, with 0 bounded crossings at all three modified feet.
- Evidence: 14 matched four-panel diffuse/reflective comparison sheets,
  5 wireframe sheets, cross-section SVG and machine-readable browser,
  Khronos/topology reports under `evidence/r3-2-revision-5/`.
- QA: internal dimensional/normal/degenerate checks, Khronos, deterministic
  export, ESLint, TypeScript, 39 files/281 tests, build, commercial isolation
  and DEV Chrome capture PASS for their stated scope. Physical-device,
  sustained GPU and exhaustive collision testing NOT TESTED.
- Open issues: low-rear twin exit still visually weak; rear mount shoulder
  appears too angular. Upper front support/arch junction retains 140 bounded
  strict BODY self-crossings and a 28-edge branch opening. See
  `r3-2-revision-5-qa-report.md` and `r3-2-issues.md`. No shape GO.
- Pre-existing Cloudflare/CI/master-plan/reference changes preserved outside
  the revision commit scope. Next action: owner reviews evidence and requests
  another focused Gate 2 revision if desired. **OWNER GATE 2 HOLD / REVISE.**

## 2026-10-21 — R3.2 Revision 7, prototype design gate

- Baseline: `Per-PEDS` at `48ddf12818fc978b9b4d7d6ef649897f3e83ea10`.
  Phase A only: two local diffuser exit concepts and two rear halo fairing
  concepts, exported as isolated GLBs. Accepted integrated G03 SHA-256 stayed
  `ba04651b1f6f79971c8c69bc0667e7000b87f6d170b55614604c869831a2544f`.
- Both diffuser exits measure 1.160 m wide; four candidate meshes have zero
  degenerate triangles, consistent winding, zero bounded strict self-crossings,
  and only classified intentional crop boundaries. Khronos: zero errors and
  warnings, with bufferView-target hints.
- Twelve matched Chrome/WebGL diffuse, reflective and wireframe sheets plus
  exit-profile SVG are in `evidence/r3-2-revision-7-prototypes/`.
- ESLint, TypeScript, 39 files / 281 tests, production build and commercial
  isolation passed. Integrated collision/full-car visual checks and physical
  device performance are NOT TESTED because integration was not authorized.
- Design recommendation: diffuser A / rear halo B, conditionally. Their exposed
  specimen boundaries still need direct shell stitching; no visual GO claimed.
  See `r3-2-revision-7-prototype-design-gate.md`. No stage, commit, push,
  merge or deployment. **HOLD — owner selection required before Phase B.**

## 2026-10-21 — R3.2 Revision 7 Phase B, selected-prototype integration trial

- Owner authorized Diffuser A and Halo B implementation and local commits,
  but not push, merge, Preview or production deployment. Branch/HEAD at
  pre-flight: `Per-PEDS` / `48ddf12818fc978b9b4d7d6ef649897f3e83ea10`.
  Phase A and unrelated Cloudflare/CI/reference changes were preserved.
- Trial source: `EDS_G03_REV7_EXPERIMENT=1 node scripts/generate-eds-g03.mjs
docs/commercialization/r3/evidence/r3-2-revision-7/eds-g03-rev7-candidate.glb`.
  Two candidate exports matched SHA-256
  `414330bb130614f720927dedac0536f96e8d9256e64dc0a066e16453f72e78ac`.
  Unflagged output still reproduces the Revision 6 GLB hash
  `ba04651b1f6f79971c8c69bc0667e7000b87f6d170b55614604c869831a2544f`.
- Measured locked bounds 5.050 × 2.000 × 1.180 m, wheelbase 3.600 m, diffuser
  exit width 1.160 m; 62,992 triangles, 5 material groups, 0 textures.
  Sampled sidepod inlet and upper halo T vertices remained unchanged.
- QA: internal dimensions/normals/degenerates, bounded strict crossings,
  inherited open-edge comparison, Khronos, ESLint, TypeScript, 281 tests,
  build and commercial isolation PASS in their stated scopes. Local
  inter-mesh test had no mechanical triangles in its target box; whole-car
  collision and physical-device GPU performance NOT TESTED.
- 27 matched real-WebGL comparison sheets, browser stats, machine-readable
  geometry reports and cross-section diagram in `evidence/r3-2-revision-7/`.
  **Visual FAIL:** candidate diffuser reads flatter than Revision 6 and does
  not retain Prototype A's two open channels. Halo rear shoulder is still
  visually too steep. See `r3-2-revision-7-qa-report.md` and `r3-2-issues.md`.
- The experimental GLB was not promoted to `public/models`; G01/commercial
  Showroom, Results Engine, main, production and unrelated work untouched.
  **OWNER GATE 2 HOLD / REVISE.** No R3.3.

## 2026-10-22 — R3 full visual design reset, silhouette concepts A/B/C

- Branch/baseline: `Per-PEDS` at `4491808`; Revision 2 failed owner visual
  approval. Existing Cloudflare/CI/reference changes and all prior G03 assets
  were preserved. No stage, commit, push, merge or deployment.
- Source: new reproducible Blender 5.2.2 authoring script created three original
  whole-car clay concepts: `EDS-G03-SR-A-r1` Aero Predator,
  `EDS-G03-SR-B-r1` EDS Hyper Aero and `EDS-G03-SR-C-r1` Precision Machine.
- Locked dimensions: every concept measured 5.050 x 2.000 x 1.180 m with
  3.600 m wheelbase, front/rear axle Z -1.75/+1.85 m and unchanged wheel/track
  registry. No FIA-compliance claim.
- Reproducibility: three second clean exports matched SHA-256. GLB sizes are
  1,315,264 / 1,398,568 / 1,268,676 bytes; evaluated Blender triangle counts
  are 57,192 / 57,188 / 54,668 for A/B/C respectively.
- Evidence: 36 actual Blender PNGs, 12 matched A/B/C contact sheets and 12
  dedicated previous-Revision-2 comparison sheets under
  `blender-authoring/evidence/visual-design-reset/`. Exact model revisions and
  direct image paths are indexed in that directory's `README.md`.
- QA: Blender generation, independent GLB structure/hash/registry validation,
  contact-sheet capture, ESLint, 39 files / 281 tests, TypeScript/build and
  commercial isolation PASS. Full repository Prettier check remains FAIL on
  124 pre-existing/unrelated files; all reset files pass scoped Prettier.
  Khronos validation, strict topology/intersection checks, browser integration,
  physical-device and sustained GPU tests were NOT RUN.
- Open visual issues: rear wing/endplates remain silhouette-grade; A/B
  engine-cover peaks may be too abrupt; front endplates await selected-concept
  surfacing. See `blender-authoring/visual-design-reset/qa-report.md`.
- Next action: owner selects A, B or C, or requests a precise hybrid/revision.
  Do not begin high-detail modeling, PBR, LOD or integration.
  **FINAL STATUS: AWAITING OWNER SILHOUETTE APPROVAL.**

## 2026-10-22 — R3 cockpit, halo and long-nose design gate

- Branch/baseline: `Per-PEDS` at `6aa2e12`; unrelated Cloudflare/CI/reference
  work and all A/B/C silhouette concepts were preserved. No stage, commit,
  push, merge, deployment or production-asset replacement.
- Precision Machine was used as the comparison baseline. Original Blender
  geometry produced `EDS-G03-CNR-N30-r1` and `EDS-G03-CNR-N20-r1`; the supplied
  C42 image informed only general packaging and surface-transition principles.
- Both studies retain locked 5.050 × 2.000 × 1.180 m dimensions, 3.600 m
  wheelbase and existing hardpoints. N30 measures exact A:B 30:70; N20 20:80.
  The baseline measures 38.4:61.6 under the same definition, so the requested
  ratios move the cockpit forward rather than increasing measured A.
- Evidence: 48 direct Blender PNGs, 16 matched three-way contact sheets, nine
  focused before/after comparisons and one ratio diagram under
  `blender-authoring/evidence/cockpit-nose-redesign/`.
- Blender mesh diagnostics and independent GLB/registry validation PASS.
  ESLint, 39 files / 281 tests, TypeScript/build and commercial isolation PASS.
  Inter-assembly collision, ergonomics, FIA legality, browser integration and
  physical-device performance were NOT RUN.
- Deterministic export FAIL: three clean exports kept stable byte size and
  geometry but produced different SHA-256 hashes. This must be resolved before
  a production asset pipeline.
- Visual recommendation: N30. Its 0.665 m axle-to-opening clearance keeps a
  coherent nose, halo and shoulder relationship. N20 leaves only 0.160 m and
  reads as a packaging-stressed extreme study.
- **HOLD — AWAITING OWNER COCKPIT & NOSE DESIGN APPROVAL.**

## 2026-10-22 — C42-referenced full reconstruction D1

- Branch/baseline: `Per-PEDS` at `a3be318`; pre-existing Cloudflare document,
  CI draft, master-plan file and `references/` preserved. Owner subsequently
  authorized a focused D1 commit/push; no merge, production deployment or
  production model replacement is authorized.
- Reference: no owner C42 `.blend` found under `E:\Formula 1`; imported
  `public/models/c42.v2.glb` into a DEV-only collection. Directly measured
  204,593 vertices / 237,426 triangles on its primary mesh; source scale is
  non-metric and normalized only for matched visual review.
- Source: new `eds_g03_c42_reconstruction_d1.py`; no G01/G02/G03 mesh imported
  as EDS geometry. Editable `.blend` retains 220 semantic EDS objects.
- GLB: 5,522,424 bytes; 141,768 triangles; 11 material primitives/draw calls;
  zero textures. Two clean exports matched SHA-256
  `b14bae143e5e64ea52fa3564e05bba857a1a46ee8e20d58e6d2edcd4493fde1f`.
- Dimensions: 5.050 × 2.000 × 1.177853 m; wheelbase 3.600 m; locked axle,
  track, tyre and diffuser registry retained.
- Evidence: 42 direct Blender renders and 12 C42-left/EDS-right sheets under
  `blender-authoring/c42-reconstruction-d1/evidence/`.
- QA: Blender mesh/Three.js/determinism/headless WebGL, ESLint, 39 files / 281
  tests, production build and commercial isolation PASS in stated scopes.
  Khronos, exhaustive collision, physical devices, LOD, sustained GPU/memory
  and commercial-rights review NOT RUN.
- Visual result: cockpit, floor/diffuser and wheel/brake construction are
  complete for D1 review. Sidepod joints, front/rear aero articulation,
  engine-cover transitions and suspension attachment detail remain NEEDS
  REWORK. See `component-comparison.md`.
- Status: **HOLD — OWNER GATE: C42-REFERENCED EDS RECONSTRUCTION REVIEW**.
  No PBR, LOD integration, production swap or release.

## 2026-10-22 — Repository Cleanup & D1 Asset Consolidation

- Objective: Audit repository, delete obsolete development artifacts, enforce English naming standards, and establish C42-referenced reconstruction D1 as the single active 3D authoring direction.
- Non-negotiable policy: `public/models/c42.v2.glb` preserved as DEV-only reference; `docs/commercialization/r3/blender-authoring/c42-reconstruction-d1/` preserved as single active reconstruction; earlier experimental EDS models rejected as reconstruction baselines.
- Curated Vehicle Evolution: Created `docs/commercialization/vehicle-evolution/` with 18 selected real screenshots covering 6 milestones (Blockout, Aerodynamic Revisions, Clay Refinement, Rejected Concepts, Cockpit/Nose Experiments, C42-Referenced D1) and `vehicle-evolution-manifest.json`.
- English naming: Purged 12 corrupted Blender thumbnail directories with non-ASCII names from root; zero non-ASCII filenames remaining in repository.
- Deleted obsolete artifacts: 329 tracked files (174.63 MB) deleted, cataloged in `docs/maintenance/deletion-manifest.json`:
  - 32 rejected/prototype `.blend` and `.glb` files removed (visual design reset, cockpit/nose, clay gate, R3.2 Gate 2 prototypes, GDR prototypes).
  - 241 obsolete review screenshots and contact sheets removed from `blender-authoring/evidence/`.
  - 34 superseded authoring, inspection, plotting, and capture utility scripts removed from `scripts/`.
- Consolidated active authoring: `docs/commercialization/r3/blender-authoring/` consolidated around `c42-reconstruction-d1/` and updated `README.md`.
- Protected assets verified: `public/models/c42.v2.glb`, active D1 `.blend`/`.glb`, automated F1 data pipelines, Results Engine, and website runtime assets intact.
- Git status: Local working tree cleanup only; no stage, commit, push, merge, or deployment.
- Status: **AWAITING OWNER REPOSITORY CLEANUP REVIEW**.

## 2026-10-22 — C42 high-fidelity reconstruction D2

- Branch/baseline: `Per-PEDS` at `7f31e7b`; owner authorized a focused D2
  commit/push. Unrelated Cloudflare, CI draft, master-plan and `references/`
  work remains outside the commit. No merge, deployment or production model
  replacement is authorized.
- Source: reproducible Blender 5.2.2 authoring pipeline with 174 editable
  semantic EDS objects. The C42 GLB remains a DEV-only normalized reference
  and is excluded from the EDS export.
- GLB: 2,131,064 bytes; 47,792 triangles; 12 material primitives/draw calls;
  zero textures. Two observed clean exports matched SHA-256
  `cd56155f005f3abd89a2e4addd85675bbd77b88cbc087ba34139fa14b64f8242`.
- Dimensions: 5.046 × 1.990 × 1.089 m; 3.600 m wheelbase; locked axle,
  track, tyre and 1.160 m diffuser-exit registry retained.
- Evidence: 36 D2/C42 renders, six regenerated topology-wireframe renders,
  12 matched C42/D1/D2 sheets and four diagnostic comparisons under
  `blender-authoring/c42-fidelity-d2/evidence/`.
- QA: Blender mesh validation, Node Three.js parsing, determinism, ESLint,
  39 files / 281 tests, TypeScript/build and commercial isolation PASS in
  their stated scopes. Browser integration, Khronos validation, physical
  devices, LOD, sustained FPS/GPU memory and commercial-rights review were
  NOT RUN.
- Status: **HOLD — OWNER D2 SHAPE & C42 FIDELITY REVIEW**.
