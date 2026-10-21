# EDS QA RELEASE REPORT — R3.2 Revision 1 surface continuity

Commit SHA: working tree based on `a6549c6fa1754caf10e4d98103ba424f2b73c575`
Target branch: `Per-PEDS`
Target environment: local DEV visual review only
Change summary: original single-shell sidepod/floor/undercut/engine-cover construction and
flush halo fairings; seven matched before/after sheets in two inspection modes.
Risk level: HIGH — generated WebGL geometry and commercial asset isolation.

## Static checks

- ESLint: **PASS** — `npm.cmd run lint`, exit 0.
- TypeScript: **PASS** — `npx.cmd tsc --noEmit`, exit 0.
- Unit tests: **PASS** — `npm.cmd test`, exit 0, 39 files / 281 tests.
- Integration tests: **NOT APPLICABLE** — no service/data integration changed.
- Build: **PASS** — `npm.cmd run build`, exit 0, 2,214 modules transformed.

## Functional and visual checks

- DEV renderer: **PASS for seven target views** — `npm.cmd run qa:r3:continuity`, exit 0.
  The before page receives the baseline GLB from commit `a6549c6` through a local
  Playwright response override; the after page receives the working GLB. Each uses
  the same 1440 x 900 viewport, DEV viewer, 38-degree FOV, preset, model transform
  and lighting. Seven 1600 x 1280 sheets contain BEFORE/AFTER in both neutral
  diffuse and controlled reflective modes. No page, console or failed local-request
  errors were recorded.
- Visual verdict: **IMPROVED, NOT OWNER-APPROVED**. Detached sidepod tube, fairing
  and broad floor sheet no longer read as separate masses. No obvious open gap,
  flipped shaded region, white patch or broad shell overlap was observed in the
  seven target cameras. Remaining limitations: inlet is a shallow depression rather
  than an open duct; rear diffuser exit is pointed; halo tube/skin connections are
  mechanically simple. See `r3-2-issues.md` for defect IDs and reproduction.
- Browser mobile/responsive, keyboard and WebGL context loss: **NOT RUN** — this
  change affects only the DEV visual review route; not release-approved.
- Accessibility/SEO: **NOT APPLICABLE** — no commercial UI or public route changed.

## Specialized checks

- Determinism: **PASS** — two exports byte-identical, SHA-256
  `dcd203387f584d2b68160a1f740eb413274d9204a651b113434a668ab3496af8`.
- Dimensions: **PASS** — validator exit 0; measured 5.050 x 2.000 x 1.180 m,
  3.600 m wheelbase, unchanged axles, tracks, wheel radii and ground contact.
- Geometry: **PASS by internal validator** — 55,916 triangles, 32,064 vertices,
  five nodes/materials/draw calls, zero embedded textures, zero nonfinite values,
  zero degenerate triangles, zero invalid unit normals, zero triangle/vertex-normal
  winding disagreements. This does not prove watertightness, intended outward
  orientation of every closed surface or absence of all self-intersections.
- Independent Khronos glTF Validator / Blender: **NOT TESTED** — no local validator
  package was available; no independent mesh inspection performed.
- Performance: **PASS for short browser observation only** — Intel UHD Graphics
  via ANGLE/D3D11 at 1440 x 900. Baseline/current renderer triangles 102,298 /
  56,142; seven draw calls each. Approx. 176 RAF samples: median 16.7 ms and p95
  16.8 ms for both. RAF is display-capped and is **not** a GPU-time measurement.
  No physical-device, mobile GPU, sustained-thermal or long-run leak test was run.
- Security/provenance: **PASS (scoped)** — no imported C42 mesh/UV/texture/branding,
  external assets or secrets in the changed source.
- Commercial isolation: **PASS** — production build guard removed 14 legacy and
  two review-only visual targets; scanned 28 Showroom modules and 108 artifacts.
  G01 remains the commercial Showroom model; G03 is DEV-only and absent from `dist`.
- Automated data sources 1/2: **NOT APPLICABLE** — no Results Engine or release push.

## CI/CD and release status

- Required GitHub Actions: **PENDING** — owner subsequently requested a scoped
  `Per-PEDS` review push; record the observed remote checks separately.
- Preview/production deployment and smoke: **NOT RUN** — deployment prohibited.
- Existing unrelated Cloudflare document, local CI draft, master-plan attachment
  and references were preserved untouched.

## Defects and evidence

- P0/P1: none detected in scoped checks; this is not a production clearance.
- P2: R3-G03-006 and R3-G03-008 remain owner visual-review items.
  R3-G03-009 local profile foldover was fixed and internally retested.
- P3: shallow inlet, pointed rear exit and simplified tubular joints; owner to
  judge whether these satisfy primary-surface quality.
- Evidence: `evidence/r3-2-revision-1-continuity/continuity-*.png` (seven sheets)
  and `browser-report.json`; `g03-dimensional-validation.json`,
  `g03-hardpoints.json`, `r3-2-issues.md`, `r3-2-surface-authorship.md`.

Unverified items: owner visual approval, independent glTF validation, manifoldness,
physical devices, sustained GPU memory/thermals and non-target camera angles.

**FINAL DECISION: HOLD**

Reason: technical checks pass locally and the target junctions improve, but Gate 2
visual acceptance is owner-controlled and outstanding checks do not justify release.

Next required action: after the owner-authorized scoped `Per-PEDS` review push,
owner reviews the seven matched sheets and decides Gate 2 GO or REVISE. Do not
begin R3.3/R3.4, merge or deploy.
