# EDS QA RELEASE REPORT — G03 full vehicle design reset

Commit SHA: recorded in the owner-gate handoff (not embedded to avoid a self-referential commit)
Target branch: `Per-PEDS`
Target environment: DEV review only
Change summary: Two original full-vehicle primary-geometry concepts and matched review evidence
Risk level: HIGH — new 3D geometry and DEV renderer path

## STATIC CHECKS

- ESLint: PASS — `npm.cmd run lint`, exit 0.
- TypeScript: PASS — `npx.cmd tsc --noEmit`, exit 0.
- Unit tests: PASS — 39 files, 281 tests, exit 0.
- Integration tests: NOT APPLICABLE — no separate integration script is configured.
- Build: PASS — `npm.cmd run build`, exit 0; Vite transformed 2,214 modules.

## FUNCTIONAL CHECKS

- Core functionality: PASS — both WIP GLBs loaded in the local Three.js review renderer.
- Regression: PASS — full configured Vitest suite, 281/281.
- Browser: PASS — 48 model/view/mode canvas loads, 12 comparison sheets and 24 concept images; zero captured page, console or local request errors.
- Mobile: NOT RUN — design evidence uses the fixed 900 × 650 review viewport.
- Accessibility: NOT APPLICABLE — no user-facing production UI introduced.
- SEO: NOT APPLICABLE — review assets and reports only.

## SPECIALIZED CHECKS

- 3D Showroom: PASS for local DEV rendering only; production Showroom default is unchanged.
- Dimensions/hardpoints: PASS for A and B — measured `5.050 × 2.000 × 1.180 m`, wheelbase `3.600 m`, axle/track/wheel/ground locks unchanged, diffuser lower exit `1.160 m`.
- Internal GLB geometry: PASS — finite values, zero degenerate triangles, normalized vertex normals and zero face/vertex-normal winding disagreements in both assets.
- Deterministic export: PASS — repeated SHA-256 matched for both concepts.
- Khronos glTF Validator: PASS — validator `2.0.0-dev.3.10`, zero errors/warnings/infos/hints for both GLBs.
- Independent topology: HOLD — winding and finite checks pass, but concept-stage assemblies remain open and the bounded strict-intersection diagnostic reports overlaps. See `topology-inspection.json`.
- Performance: limited browser evidence only; A = 80,132 triangles, B = 78,980 triangles, five draw calls each. Sustained FPS/GPU/physical-device testing NOT RUN.
- Security: PASS for scoped static review — no secret-like assignment in changed files; no network integration or external runtime content added.
- Automated data source 1: NOT APPLICABLE — no Results Engine/data workflow change and no release requested.
- Automated data source 2: NOT APPLICABLE — no Results Engine/data workflow change and no release requested.

## CI/CD

- Required GitHub Actions: NOT RUN — no push authorized for this gate.
- Preview deployment: NOT RUN.
- Production deployment: NOT RUN and prohibited.
- Production smoke tests: NOT APPLICABLE.

## DEFECTS

- P0: none observed.
- P1: none observed.
- P2 `G03-RESET-001`: both concepts remain below the Detailed + EDS reference in secondary aero/mechanical refinement and are not ready for integration.
- P2 `G03-RESET-002`: independent bounded diagnostics report strict crossings among merged concept-stage body/fairing and floor/strake assemblies. A: 723 body-halo self, 424 aero-diffuser self, 287 body/mechanical halo intermesh. B: 538, 401 and 266 respectively. These require shared-boundary re-authoring after owner selection.
- P3 `G03-RESET-003`: open boundaries are present in intentionally open airfoils, inlet ducts and surface sheets; classification must be tightened in the selected detailed-authoring path.
- P3 `G03-RESET-004`: rear-wing endplate masses remain visually simple in both concepts.

## EVIDENCE

- GLBs: `docs/commercialization/r3/evidence/r3-design-reset/eds-g03-design-concept-{a,b}.glb`
- Dimensional reports: `concept-{a,b}-validation.json`
- Khronos reports: `concept-{a,b}-khronos.json`
- Topology report: `topology-inspection.json`
- Browser report: `browser-report.json`
- Matched sheets: `comparison-<view>-<diffuse|reflective>.png`
- Individual renders: `concept-<a|b>-<name>-<view>-<diffuse|reflective>.png`
- Production build: exit 0; commercial guard removed review-only targets and reported `Commercial visual isolation: PASS`.
- Asset invariants: working-tree blobs for `eds-g01.glb` and `eds-g03-preview.glb` match baseline blobs; `dist/models` contains only `eds-g01.glb` plus provenance README.

## UNVERIFIED ITEMS

- Blender/bpy editing and validation: NOT TESTED — Blender unavailable.
- Physical GPU/device and sustained thermal performance: NOT RUN.
- Complete coplanar/containment collision detection across every assembly: NOT TESTED.
- Final shared-boundary watertight topology: not part of this primary design-selection milestone.
- Owner visual approval: PENDING.

## RESIDUAL RISKS

- Selecting either concept commits later work to re-authoring critical body/halo/floor boundaries rather than polishing intersecting WIP assemblies.
- Neutral renders show composition, but secondary detail density is still substantially below the Detailed + EDS reference.

FINAL DECISION: **HOLD**

REASON: Required design evidence exists and dimensional/GLB/browser checks pass, but owner selection is pending and independent topology plus visual-refinement gaps prevent approval.

NEXT REQUIRED ACTION: Owner selects Concept A, Concept B, requests a hybrid, or rejects both. Do not begin detailed modeling before that decision.
