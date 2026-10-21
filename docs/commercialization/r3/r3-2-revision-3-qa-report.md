# EDS QA RELEASE REPORT — R3.2 Revision 3 / Owner Gate 2

Commit SHA: local candidate based on `14b99b6`; final local SHA in owner handoff.
Target branch: `Per-PEDS`. Target environment: DEV review only.
Risk: HIGH (authored WebGL geometry). Final decision: **HOLD / recommend REVISE**.

## Change and visual assessment

- Inlet: rounded body-grid aperture and deeper multi-ring duct on both sides.
  The sidepod comparison shows a clear improvement over the rectangular
  baseline. A diagonal inner-duct reflection remains; exhaustive
  self-intersection clearance is not established.
- Diffuser: two broader underbody channels and a lower, wider centre spine
  keep the approved floor envelope. Low-rear and underside views show more
  form than Revision 2, but the exit still reads as a shallow lip with a small
  central gable. This is not a confident visual GO.
- Halo: the three separate collars were removed. Variable-radius tubes follow
  the locked centreline into shell fairings. The body/tube junction is still
  visible in the rear-mount close-up. Owner visual approval is pending.
- Evidence: 12 matched BEFORE/AFTER diffuse/reflective views and three closer
  wireframe diagnostics at `evidence/r3-2-revision-3-surface-refinement/`.
  Local headless Chrome, 1440 × 900, 38° FOV, same viewer code/camera/lighting
  in each pair. `browser-report.json` records the exact view IDs and no
  page/console/local-request errors. It is not physical-device evidence.

## Static and functional checks

- ESLint: **PASS**, `npm.cmd run lint`, exit 0.
- TypeScript: **PASS**, `npx.cmd tsc --noEmit`, exit 0.
- Full unit tests: **PASS**, `npm.cmd test`, exit 0; 39 files / 281 tests.
- Build: **PASS**, `npm.cmd run build`, exit 0; 2,214 Vite modules.
- Commercial isolation: **PASS** in the build guard; 14 legacy and two
  review-only assets pruned, 28 Showroom source modules and 108 dist files
  checked. G03 is not the commercial default and is absent from dist.
- DEV browser capture: **PASS for operation**, `npm.cmd run qa:r3:continuity`,
  exit 0. Visual acceptance remains **PENDING OWNER REVIEW**.
- Integration/data pipelines/SEO/accessibility: **NOT APPLICABLE** to this
  DEV-only geometry candidate; no production route or data workflow changed.

## Geometry and independent validation

- Two deterministic GLB generations matched SHA-256
  `9a9424af2fd6ad1b83b9a49d6c8ab0c580a518c9b9a850b9f62f7b73c56a0604`.
- Internal dimensional/geometry validator: **PASS**, exit 0. Bounds
  5.050 × 2.000 × 1.180 m; wheelbase 3.600 m; front/rear axles, tracks,
  wheel radii, tyre ground contact and locked bounds match the registry.
  Zero nonfinite values, degenerate triangles, invalid normals, or
  normal/winding disagreements.
- GLB: 1,136,876 bytes, 57,320 triangles, 32,791 vertices, five mesh/material
  groups, five GLB draw calls and zero textures. Versus Revision 2: +7,204
  bytes, +848 triangles, +87 vertices. The additional topology is localized
  to the duct and variable-radius halo junctions.
- Khronos glTF Validator `2.0.0-dev.3.10`: **PASS**, `validateBytes` on the final
  GLB; 0 errors, 0 warnings, 0 infos, 0 hints. The official npm package was
  installed in TEMP, not added to the repository. Its checks do not prove
  watertightness or absence of self-intersections.
- Independent topology with `trimesh 5.1.1`: **PARTIAL**. All five baseline and
  candidate mesh groups have consistent winding; none are watertight in
  either version. No claim of a closed manifold or all-angle intersection
  clearance is made. Blender inspection: **NOT TESTED** (not installed).

## Performance, defects and release gate

- Headless Chrome on ANGLE / Intel UHD / D3D11: seven renderer calls and seven
  geometries for both models, four renderer textures each. Baseline 56,698
  rendered triangles; candidate 57,546. Approx. 175 RAF samples per model:
  median 16.7 ms for both; p95 17.0 vs 17.2 ms. RAF is
  display-capped and is not GPU time. Sustained and physical-device
  performance: **NOT TESTED**.
- P0/P1: none found by the scoped checks. P2: R3-G03-006 inlet inner reflection,
  R3-G03-009 shallow diffuser/central gable, R3-G03-008 visible halo joint
  boundary. See `r3-2-issues.md` for evidence and retest disposition.
- CI, Preview deployment, production deployment and smoke tests: **NOT RUN**.
  This is a local owner-review candidate. No `main`, merge or production action.

**FINAL DECISION: HOLD — REVISE recommended for Gate 2.** Technical checks
passed, but the diffuser and halo still need owner visual judgment. Do not
start R3.3 or make G03 the commercial default. Next action: owner reviews the
15 evidence sheets and decides GO or REVISE.
