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
