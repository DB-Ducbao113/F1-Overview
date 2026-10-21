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
