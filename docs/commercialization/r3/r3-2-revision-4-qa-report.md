# EDS QA RELEASE REPORT — R3.2 Revision 4 / Owner Gate 2

Commit SHA: local candidate based on `4762005`; handoff SHA recorded after
the scoped local commit. Target branch: `Per-PEDS`. Target environment: DEV
review only. Risk: HIGH (3D primary-surface geometry). **Decision: HOLD;
recommend REVISE.** This is not a release or visual approval.

## Change and visual assessment

- Accepted inlet, body/floor continuity, nose, wings, wheel geometry, tracks,
  wheelbase and all locked hardpoints are retained. The selected geometry edits
  affect the original rear underbody relief/rise and three shell-based halo
  mount fairings only. No collar or additional floor mesh was added.
- Diffuser: the paired channels have more definition than baseline, but the
  actual rear view still reads as a broad shallow exit with a conspicuous
  central gable. A stronger trial produced an abrupt visible underside ridge
  and was discarded. Final visual criterion **NOT MET**.
- Halo: the front fairing and rear feet show some cleaner blending into the
  shell, but the rear tube/shell junctions remain visibly separate. Final
  visual criterion **NOT MET**. The accepted inlet/body/floor show no visible
  regression in the matched sampled views.
- Twelve final four-panel diffuse/controlled-reflective BEFORE/AFTER sheets,
  three targeted wireframe sheets and `browser-report.json` are in
  `evidence/r3-2-revision-4-gate-2-closure/`. Each pair uses the same DEV
  renderer code, 1440 × 900 viewport, 38° FOV, camera preset, lighting,
  framing and transform. Baseline GLB is served from committed `4762005` via
  a local browser response override. The wireframes are dense even after
  irrelevant groups were hidden; they are diagnostics, not manifold proof.

## Checks actually executed

- ESLint: **PASS**, `npm.cmd run lint`, exit 0.
- TypeScript: **PASS**, `npx.cmd tsc --noEmit`, exit 0.
- Full unit tests: **PASS**, `npm.cmd test`, exit 0; 39 files / 281 tests.
- Production build: **PASS**, `npm.cmd run build`, exit 0; 2,214 modules.
- Commercial isolation: **PASS** in the build guard, 14 legacy and two
  review-only asset targets removed from `dist`; 28 Showroom source modules
  and 108 artifact files scanned. `dist/models/eds-g03-preview.glb` absent.
  EDS-G01 remains the commercial model. This local build is not a deployment.
- Deterministic GLB: **PASS**, regenerated twice with identical SHA-256
  `c197b483bcee8736f74a998a4763bf6f66be1197f645c831b789aacd8d41eb10`.
- Internal dimensional/hardpoint/geometry validation: **PASS**,
  `npm.cmd run asset:eds-g03:validate`, exit 0. Bounds 5.050 × 2.000 ×
  1.180 m, wheelbase 3.600 m, axles, tracks, wheel radii, ground contact and
  locked bounds match the registry. Zero invalid values, degenerate triangles,
  invalid normals and normal/winding disagreements.
- Khronos glTF Validator `2.0.0-dev.3.10`: **PASS**, final GLB checked with
  the official npm package in TEMP; 0 errors, warnings, infos or hints.
- DEV browser capture: **PASS for operation**, `npm.cmd run qa:r3:continuity`,
  exit 0; no page, console or local-request errors. Visual approval is **NOT
  GRANTED** by this result.
- Responsive/mobile, keyboard/accessibility and physical-device GPU:
  **NOT TESTED** for this DEV-only GLB review. Data pipelines, production SEO,
  Preview/production deployment and post-deploy smoke: **NOT APPLICABLE / NOT
  RUN** because this candidate is not released.

## Geometry, topology and performance

- Final GLB: 1,136,864 bytes, 57,320 triangles, 32,791 vertices, five
  mesh/material groups, five GLB draw calls, zero textures. Baseline:
  1,136,876 bytes and the same triangle/vertex/group counts. No topology
  increase was needed for this revision.
- Independent `trimesh 5.1.1` + `numpy`/`rtree` diagnostic:
  `scripts/check-eds-g03-topology.py`, exit 0, compared committed baseline
  and final candidate. All five groups have consistent winding and identical
  open-edge counts; none is watertight in either model. BODY has 372 open
  edges in both: 72 rear exit, 72 front tip and 228 sidepod-inlet-zone edges.
  Other groups also unchanged: AERO 2,812, TIRE 512, MECHANICAL 3,004,
  COCKPIT 1,248. Bounded non-adjacent strict edge/triangle checks found 0
  crossings in both versions: 5,173 diffuser triangles and 3,410 halo-shell
  triangles. This does **not** cover coplanar contacts, containment,
  inter-mesh intersections or all car surfaces; those are **NOT TESTED**.
  Blender/manual independent topology inspection: **NOT TESTED**.
- Headless Chrome ANGLE / Intel UHD / D3D11: both versions showed seven
  renderer calls, seven renderer geometries, four renderer textures and
  57,546 rendered triangles. Over 170 RAF samples each, median was 16.7 ms
  both; p95 19.9 ms baseline vs 18.8 ms candidate. RAF is display-capped,
  not GPU frame time. Sustained frame time, memory/leak and physical-device
  performance are **NOT TESTED**.

## Defects, release state and next action

- P0/P1: none observed in the executed scoped tests; this is not proof of
  absence under all conditions.
- P2: R3-G03-009 diffuser exit still shallow/central gable; R3-G03-008 rear
  halo boundaries still visible. R3-G03-006 inlet is unchanged and remains
  under owner review. See `r3-2-issues.md` for reproduction and evidence.
- Required GitHub Actions: **NOT RUN** for this local-only candidate. No push,
  merge, deployment, production configuration or Results Engine change.
- **FINAL DECISION: HOLD — recommend REVISE at Owner Gate 2.** The technical
  checks pass, but the two targeted visual acceptance conditions are not yet
  satisfied. Owner visual approval is required before any further stage.
  Next action: owner reviews the image sheets and chooses Gate 2 direction;
  do not start R3.3 or change the commercial Showroom default.
