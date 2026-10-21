# EDS-G03 R3.2 primary-surface issue log

Status: **RETESTED — OWNER GATE 2 REVIEW**. Technical PASS does not replace owner visual
approval.

## R3-G03-005 — Simplified primary aero and wheel sections

- Previous severity: P3 Minor / accepted R3.1 limitation.
- Expected: curved wing sections and more credible tyre/rim profiles without entering secondary
  detail modeling.
- R3.2 change: front/rear blades now use closed cambered airfoil volumes; tyres use a nine-station
  rounded profile and the rim face has an inset ring.
- Evidence: `evidence/r3-2-surfaces/closeup-front-wing-closeup.png`,
  `closeup-rear-wing-closeup.png` and six before/after sheets.
- Retest: **PASS FOR R3.2 PRIMARY SURFACES**.

## R3-G03-006 — Surface continuity and separate-shell risk

- Severity: P2 Major if visible gaps, reversed normals or disconnected masses occur.
- Expected: coherent nose/monocoque, sidepod/floor, engine-cover and diffuser transitions in
  diffuse and controlled reflective inspection.
- Actual after refinement: no visible flipped region, white patch or clipping was observed in
  six full-car views and six paired close-ups. Sidepod fairings and floor edge shells make the
  intended continuity readable.
- Retest: **PASS** in local WebGL evidence.

## R3-G03-007 — Runtime inspection resource lifetime

- Severity: P2 Major if repeated switching grows GPU resources.
- Reproduction: load G03, switch diffuse/reflective 12 times, then alternate G01/G03 for six
  unmount/remount cycles.
- Evidence: `evidence/r3-2-surfaces/browser-report.json`.
- Actual: renderer memory stayed at 32 geometries and 10 textures before, after material
  switching and after model reload cycles.
- Retest: **PASS**. Cached GLTF geometry is shared; only owned reflective materials are disposed.

## Open limitations

- P3: Endplates, suspension members and wheel internals intentionally remain primary-form level;
  secondary detail is outside R3.2.
- P3: Internal validator checks finite values, degenerate triangles, bounds and hardpoints, but
  does not certify watertight manifold topology.
- Physical devices, sustained thermals, Blender inspection and Khronos glTF Validator remain
  **NOT TESTED**.
