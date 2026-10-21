# EDS-G03 R3.2 primary-surface issue log

## Gate 2 Revision 6 retest (2026-10-21)

Baseline `ff29e5ae526ddc1df6034861987e112a63e5cc70`; candidate evidence
in `evidence/r3-2-revision-6/`. The new upper halo T uses an arch aperture
stitched to the trimmed front support in the same BODY index buffer, not an
overlapping fairing. Independent bounded strict crossings fell from **140 to
0**; BODY open edges fell from **400 to 372** (the former 28-edge free support
tip is closed). Winding remained consistent and the three mount coordinates
and other locked dimensions remained unchanged.

- **R3-G03-008, P2, halo junctions:** Upper T collision is resolved by the
  bounded intersection test and matched diffuse/reflective/wireframe renders.
  The rear mount sleeve still reads as a triangular pedestal in
  `continuity-halo-rear-mount.png` and the upper blend still has visible
  faceting in `halo-prototype-reflective.png`. A broader/lower rear fairing
  trial had no meaningful visual benefit and was reverted. **Retest: topology
  PASS, visual REVISE; owner review required.**
- **R3-G03-009, P2, diffuser exit:** The approved 1.160 m lower exit is
  preserved. Terminal channel clearance at the sampled low point changes
  from 0.192363 to 0.152364 m, with a broader paired profile and no bounded
  strict crossing. The matched low-rear image still reads as a broad plate
  with a central gable rather than two unmistakable exits; the accepted
  continuous-shell architecture occludes the channel relief from that view.
  **Retest: geometric profile changed, visual acceptance NOT MET.**
- **R3-G03-006, P2, accepted sidepod:** The sidepod, inlet and primary floor
  source functions were not remodeled. Independent vertex-set comparison in
  the sidepod envelope found **0 missing of 1,502 unique baseline vertices**.
  **Retest: preserved in sampled geometry and matched renders.**

Limitations: local strict edge/triangle tests are bounded; zero detected
crossings does not prove globally collision-free or watertight geometry.
BODY retains 372 classified open edges. Physical-device and long-duration
performance testing were **NOT TESTED**. Final Gate 2 remains **HOLD**.

## Gate 2 Revision 4 retest (2026-10-21)

Baseline: `4762005`. Reproduction evidence: twelve matched four-panel
diffuse/reflective sheets and three targeted wireframe sheets in
`evidence/r3-2-revision-4-gate-2-closure/`. The same DEV camera, FOV, lighting,
viewer and model transform are used in each BEFORE/AFTER pair.

- **R3-G03-009, P2, diffuser exit:** Compare `diffuser-low-rear`,
  `diffuser-underside`, `diffuser-exit` and the diffuser wireframe. The paired
  channels have slightly stronger, wider relief and a more progressive rear
  rise without changing the locked envelope. An initially deeper trial made
  the underside transition look too abrupt and was rejected before handoff.
  The final low-rear exit is still visually shallow and the central body gable
  remains conspicuous. No new normal/winding error or strict local triangle
  crossing was detected. **Retest: PARTIAL; visual acceptance NOT MET.**
- **R3-G03-008, P2, three halo mounts:** Compare `halo-mounts`,
  `halo-rear-mount` and the halo wireframe. A broader deformation of the same
  survival-cell shell rises toward each unchanged mount; the variable-radius
  tubes retain their locked centreline and no collar/pad was added. The front
  junction reads cleaner, but a distinct body/tube boundary remains at the
  rear attachments. **Retest: PARTIAL; visual acceptance NOT MET.**
- **R3-G03-006, P2, inlet/body/floor preservation:** Compare `sidepod`,
  `sidepod-floor`, `full-side` and `full-front-three-quarter`. No inlet cutting,
  sidepod loft, body/floor join or hardpoint source was changed in Revision 4.
  The matched images show no evident regression in those accepted regions.
  **Retest: PRESERVED in sampled views; owner review pending.**

Independent `trimesh` inspection reports the same open-edge counts in all five
mesh groups as baseline; BODY has 372 open edges (72 rear exit, 72 front tip,
228 inlet zone). All five groups retain consistent winding but are not
watertight. The bounded BODY diffuser and halo-shell strict edge/triangle
intersection tests found 0 crossings in both versions. Coplanar contact,
inter-mesh overlap and exhaustive all-surface intersections were **NOT TESTED**.
Khronos glTF Validator found 0 errors/warnings. No technical check overrides
the remaining visual defects. **Owner Gate 2: HOLD / recommend REVISE.**

## Gate 2 Revision 3 retest (2026-10-21)

Baseline: `14b99b6`. Twelve matched diffuse/reflective four-panel views and
three closer wireframe comparisons are under
`evidence/r3-2-revision-3-surface-refinement/`. The DEV viewer applies the
same camera, FOV, lighting and model transform to baseline and candidate.

- **R3-G03-006, P2, sidepod inlet:** The rectangular body-grid mouth was
  reshaped to a rounded superellipse in the _same_ shell grid. Its immediate
  surrounding vertices are repositioned continuously; a multi-ring duct is
  recessed behind the continuous lip. In the sidepod sheet the mouth now reads
  as an oval/crescent rather than a rectangle. No exposed triangular terminal
  cap is visible in the diffuse view. A narrow diagonal highlight remains on
  the inner duct under reflective inspection, so all-angle fold/intersection
  clearance remains unproven. **Retest: IMPROVED; owner review required.**
- **R3-G03-009, P2, diffuser definition:** Broadened paired channel relief,
  reduced the pointed central spine after the first Revision 3 visual pass,
  and kept the existing rear/floor envelope. The new low-rear and underside
  cameras reveal a modest sculpted exit compared with the flat baseline.
  However, the rear lip remains shallow and the centre still forms a small
  gable in the low-rear silhouette. **Retest: PARTIAL; recommend REVISE if a
  clearly legible Venturi exit is the acceptance standard.**
- **R3-G03-008, P2, halo junctions:** Removed the three separate conical
  collars. The locked centreline now carries smoothly varying tube radii into
  the existing shell fairings. The front and two rear attachment points are
  unchanged. The junction reads less like an add-on, but its body-to-tube
  boundary is still visible in the rear-mount close-up. **Retest: IMPROVED;
  owner review required.**

No new internal degenerate triangles or normal/winding disagreements were
found. Khronos glTF Validator reported 0 errors and 0 warnings. Independent
`trimesh` inspection found consistent winding for all five mesh groups, but
neither the baseline nor candidate groups are watertight. These checks cannot
certify the absence of every self-intersection. Physical-device testing was
not performed. **Owner Gate 2 remains HOLD; no R3.3 work is authorized.**

## Gate 2 Revision 2 retest (2026-10-21)

Baseline: committed Revision 1 `a4a36a0`. Evidence:
`evidence/r3-2-revision-2-surface-refinement/` (nine matched four-panel sheets,
including diffuse and controlled reflective modes).

- **R3-G03-006, P2, sidepod inlet:** Reproduce with the `sidepod` and
  `sidepod-floor` sheets. Revision 1 presented a shallow solid depression.
  Revision 2 removes two sets of body-grid faces and adds a lip, tapered
  three-stage duct and geometric back wall. The cavity is real, not a dark
  decal. Internal validator reports no degenerate or reversed-normal faces.
  **Retest: IMPROVED; OWNER REVIEW PENDING.** The mouth remains visibly
  rectilinear in exact side view; the inner cap shows a triangular highlight
  under reflective inspection. Rounded-lip quality and all-angle
  self-intersection clearance are not proven. No obvious floating exterior
  patch was seen in the captured views.
- **R3-G03-009, P2, rear diffuser exit:** Reproduce with `rear-underfloor`,
  `diffuser-exit`, `full-rear` and `full-rear-three-quarter`. Revision 2 adds
  modest twin-channel curvature and rounds the final longitudinal profile
  within the existing floor envelope. No profile foldover or inverted normal
  was found by the internal GLB validator. **Retest: PARTIAL; OWNER REVIEW
  PENDING.** The trailing edge remains visually broad/simple; the rendered
  difference is subtle and should not be described as an approved fix.
- **R3-G03-008, P2, halo junctions:** Reproduce with `halo-mounts` and
  `full-front-three-quarter`. The three survival-cell fairings now use wider
  smooth shell deformations and each tube receives a short tapered mechanical
  collar at its unchanged locked mount coordinate. **Retest: IMPROVED;
  OWNER REVIEW PENDING.** No spherical pad is present, but the tiny tube-to-
  fairing boundary remains visible and simplified in close-up.

No P0/P1 was detected in scoped local checks. Physical-device inspection,
independent Khronos validation, watertightness and exhaustive self-intersection
testing are **NOT TESTED**. Technical PASS is not visual acceptance.

## Gate 2 Revision 1 owner correction (2026-10-21)

The owner rejected the visual conclusion below at commit `a6549c6`. The older R3-G03-006
"PASS" describes only the agent's prior inspection; it is **superseded, not an owner approval**.
Matched diffuse/reflective before/after sheets are in
`evidence/r3-2-revision-1-continuity/`.

- **R3-G03-006, P2, sidepod/monocoque and floor:** Reproduction: open the baseline
  sidepod, sidepod-floor, full-side and rear-three-quarter views. Expected: one believable
  body/floor mass with a sculpted undercut. Actual baseline: exposed tube end, separate
  fairing and broad detached floor shell. Root cause: independent lofts, fairing patches,
  and floor sheets intersected without shared topology. Revision: a single closed
  parametric shell carries sidepod, undercut, floor lip and diffuser profile. Retest:
  **IMPROVED, OWNER REVIEW PENDING**. No old tube end or floor-shell junction is visible
  in the matched renders; a shallow rather than open sidepod inlet and soft rounded
  shoulder remain visual limitations.
- **R3-G03-008, P2, halo mount feet:** Reproduction: compare the halo-mount sheet.
  Expected: mounts meet survival-cell fairings without spherical pads. Baseline:
  three raised round pads. Root cause: independent ellipsoid mounts. Revision: local
  fairings are deformations of the main shell; halo centreline/hardpoints unchanged.
  Retest: **IMPROVED, OWNER REVIEW PENDING**. The tubular mount ends still have a
  visibly simple junction and require owner scrutiny; no pad remains.
- **R3-G03-009, P2, rear floor topology:** Reproduction: inspect baseline/revision
  rear-underfloor and rear-three-quarter sheets, then run
  `npm.cmd run asset:eds-g03:validate`. Expected: continuous underfloor with outward,
  valid normals. Initial revision contained 152 local normal/winding disagreements
  despite zero degenerate triangles. Root cause: a narrow floor-lip bump and diffuser
  rise folded the rear shell profile. Resolution: monotone lip weighting and a lower
  diffuser rise within the locked envelope. Final retest: **PASS by internal normal
  and degenerate-triangle checks** (0 reversed, 0 invalid normals, 0 degenerate).
  The diffuser exit remains a pointed, primary-form edge in rear views; watertightness
  and independent glTF validation are not established.

Visual audit of final seven matched sheets: sidepod inlet is closed/shallow; floor
and undercut connect with no apparent open gap; rear exit has a sharp terminal edge;
halo tube-to-shell joints are simple but no raised pads remain. No obvious white
patch, flipped shaded region or broad overlapping floor shell appears in these views.
This is limited to these cameras and lighting modes, not universal geometry clearance.

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
## R3.2 Revision 5 Gate 2 retest (2026-10-21)

Baseline: `47fcfca54cc5a2208216af19c36806806ba8d415` (Revision 4 GLB).
Matched diffuse/reflective WebGL sheets and wireframes are in
`evidence/r3-2-revision-5/`; dimensional and independent topology measurements
are in `g03-dimensional-validation.json` and `evidence/r3-2-revision-5/topology.json`.

- **R3-G03-009, P2, diffuser exit:** Registry and exported width now both
  measure **1.160 m**, up from 1.019646 m. At `|X|≈0.30 m`, lower profile
  rises from Y=0.17654 m at Z=2.1 to Y=0.19236 m at Z=2.3; Revision 4 fell
  from 0.16703 to 0.15836 m. No bounded strict diffuser crossing, invalid
  normal or degenerate triangle was found. **Retest: NUMERIC FIX PASS; VISUAL
  REVISE.** The low-rear and underside renders still make the twin exits look
  shallow/occluded by the rear body and suspension. This is not owner approval.
- **R3-G03-008, P2, halo feet:** Three body-grid apertures now share indexed
  edge loops with lofted mounting sleeves and swept halo geometry. The prior
  bounded rear BODY/MECHANICAL count of 96 strict crossings is now **0**; the
  front and rear mount zones have **0** bounded BODY self-crossings. Winding
  and normal checks pass. **Retest: TOPOLOGY IMPROVED; VISUAL REVISE.** The rear
  sleeves still form an abrupt triangular-looking shoulder in the close-up.
  The upper front-support-to-arch T-junction, outside the three revised feet,
  still contains **140** strict crossings after both surfaces were moved into
  BODY, plus an intentional 28-edge open branch end. That overlap existed as
  separate intersecting surfaces before; it is now exposed by the integrated
  BODY self-intersection test. It is not resolved or visually approved.
- **R3-G03-006, sidepod regression:** 1,502 sampled unique sidepod-shell
  vertices in the unaffected volume are present unchanged in the candidate;
  matched sidepod sheets show no deliberate redesign. **Retest: PASS for scoped
  vertex-preservation check, not a full surface identity proof.**

All findings above are bounded strict geometric tests; coplanar overlap,
containment, exhaustive collision clearance and physical-device rendering
remain **NOT TESTED**. **OWNER GATE 2: HOLD / REVISE.** Do not start R3.3 or
commercial activation.
