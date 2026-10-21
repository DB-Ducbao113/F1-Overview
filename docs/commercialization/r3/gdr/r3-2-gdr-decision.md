# R3.2 GDR — owner design decision required

Branch/baseline: `Per-PEDS` / `4a40ddc5c6bbf52e2513a1b9bd32c10de7e29855`.
Status: **OWNER DESIGN GATE — DECISION REQUIRED. HOLD.** This investigation
does not implement Revision 5 or grant Gate 2 visual approval.

## Decision summary

Verified causes: the rear lower exit is narrower than its own registry
(`≈1.020 m` exported versus `1.160 m` specified) and its channel lower
profile falls again immediately before the exit. The upper tail and full-car
view further obscure the intended twin-channel reading. At both rear halo
feet, the tube and body are independent penetrating meshes (96 bounded
strict crossing pairs). Enlarging a fairing alone raised the count to 106.
See `r3-2-gdr-root-cause.md` for methods, source anchors and uncertainty.

**Recommendation for a possible Revision 5: Option C, hybrid authoring, with
Option B-style local stitched topology at both problem regions.** Keep the
approved procedural chassis everywhere else. Author a dedicated rear
underfloor exit patch with explicit inlet/exit cross-sections and a boundary
loop stitched to the existing floor shell. Author local, non-circular halo
mount loops whose support tubes share vertices/edge loops with the survival
cell; retain a deliberate mechanical seam only where physically credible.
Version every control point and export step so repeated GLBs hash identically.
This is a recommendation **for owner approval**, not authority to begin work.

Do **not** directly reuse prototype B's sharp W diffuser or round halo pads:
both failed visual inspection despite technically valid GLBs. Prototype A
was too subtle and did not remove the halo mesh collision. The six prototype
GLBs, matched renders, section/profile data and QA results are in `evidence/`;
see `r3-2-gdr-alternatives.md` for the comparison and limitations.

## Proposed Revision 5 acceptance contract (requires owner approval)

1. Preserve full-car bounds **5.050 × 2.000 × 1.180 m**, 3.600 m wheelbase,
   all axle/track/wheel/halo hardpoints, approved sidepod/nose/wing/overall
   surfaces and neutral material presentation. Resolve the mismatch between
   registered 1.160 m diffuser exit and current 1.020 m exported width
   explicitly; do not silently modify either value.
2. With identical full-car and unobstructed low-rear/underside cameras,
   show a legible pair of exit channels, a controlled centre region and a
   monotone, smooth throat-to-exit profile. No sharp shoulders, folded-looking
   ribs or out-of-envelope geometry. Provide numerical cross-sections and
   curvature/tangent continuity at stitch boundaries.
3. At all three halo mounts, shell/tube transitions must be mechanically
   credible with no floating collar, spherical pad or accidental inter-mesh
   penetration. Publish edge-loop maps, boundary counts, face orientation,
   and local collision results. A deliberate engineering seam may be visible
   only if designed and explained.
4. Run deterministic export, full dimensional/hardpoint and internal geometry
   checks, Khronos glTF Validator, independent open-boundary and collision
   checks, ESLint, TypeScript, full tests, production build/commercial
   isolation, and matched diffuse/reflective/wireframe WebGL evidence.
   Mark physical-device and exhaustive collision checks NOT TESTED unless run.
5. Owner reviews six full-car views plus low-rear, underside and each halo
   mount closeup. Technical PASS alone does not constitute visual GO.

## Risks and rollback

- A local exit resection may create a visible seam, overlap, inverted normal
  or unexpected floor clearance change. Halo welding can create non-manifold
  boundaries or alter the approved survival-cell silhouette. Local mesh
  density may grow substantially (prototype diffuser B was 4× triangles).
- Before any authorized Revision 5 work, keep Revision 4 GLB/hash and this
  GDR commit as the rollback reference. Develop new geometry in isolated
  files/branch-scoped review assets, re-run comparisons, and replace the
  DEV preview only after tests and owner visual direction. No destructive
  reset, history rewrite, commercial-model swap, merge or deployment.
- Provenance remains original G03-only. C42 stays DEV-only and cannot be
  used as a topology, UV or texture source.

## GDR QA status (executed, not release approval)

- ESLint `npm.cmd run lint`: **PASS**, exit 0. TypeScript
  `npx.cmd tsc --noEmit`: **PASS**, exit 0. Full unit suite
  `npm.cmd test`: **PASS**, 39 files/281 tests, exit 0.
- `npm.cmd run build`: **PASS**, exit 0, 2,214 Vite modules. Commercial
  visual-isolation guard **PASS** (28 Showroom source modules and 108 dist
  files checked). Neither `gdr-review.html` nor the accepted G03 GLB appears
  in `dist`; G01 remains the commercial default. This is a local build only.
- Six region GLBs: repeated export produced matching SHA-256 hashes;
  `evidence/prototype-geometry.json` records each final hash. Khronos glTF
  Validator **PASS** for 0 errors/0 warnings, with 2–4 non-blocking
  buffer-view-target hints per prototype. Open-boundary, degenerate triangle,
  finite face-normal, relative normal-orientation and bounded collision
  results are in `evidence/`. One inverted halo-B prototype winding was
  found, corrected and retested before final capture.
- Local Chrome WebGL capture: **PASS for operation**, zero page errors in
  `evidence/prototype-browser-report.json`; 6 matched comparison sheets.
  Visual quality **NOT APPROVED**. Full-car integrated prototype, mobile and
  physical GPU, sustained performance, exhaustive inter-mesh and coplanar
  collision testing: **NOT TESTED**. CI/deployment: **NOT RUN**.

## Owner decisions requested

1. Approve **Option C / local stitched topology** for the next _separately
   authorized_ Revision 5, or choose A/B/another approach?
2. Confirm whether the diffuser should be brought to the existing **1.160 m
   registered exit width** while preserving all locked vehicle hardpoints.
3. Approve the proposed acceptance contract and allow further design work?

**Recommendation: HOLD / REVISE.** Do not self-approve this architecture,
visual quality, Revision 5, R3.3, commercial activation or release.
