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
