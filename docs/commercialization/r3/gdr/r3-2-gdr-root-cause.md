# R3.2 Geometry Design Review — root-cause investigation

Baseline: local `Per-PEDS` commit `4a40ddc5c6bbf52e2513a1b9bd32c10de7e29855`.
This is an investigation, not an EDS-G03 revision. The accepted GLB is read
only; its SHA-256 remains
`c197b483bcee8736f74a998a4763bf6f66be1197f645c831b789aacd8d41eb10`.

## Verified: diffuser

1. `scripts/generate-eds-g03.mjs` uses one 72-radial-station,
   168-axial-station closed body loft (see design registry). `centerBody` contracts its
   final core section to `rx=.025` at `z=2.3`; `floorHalfWidth` asks for
   `.58 m`, but lateral floor weighting acts only on the lower ring. The
   exported lower exit occupies approximately `x=±.510 m` at `z>2.255`, or
   **1.020 m**, versus the registry's **1.160 m** diffuser-exit width.
   Overall car width remains locked at 2.000 m. This is a local spec/mesh
   discrepancy, not permission to change hardpoints.
2. The final rise is shared by the same body cross-section and is then
   reduced by the paired `channel` subtraction, the negative `centerSpine`,
   underbody blending and rounded-exit term. Sampling the exported surface
   near `|x|=.31 m` shows lower-envelope `Y=.0663 m` at `Z≈1.0`, `.1655 m`
   at `Z≈2.1`, then `.1584 m` at `Z≈2.3`. The fall in the final 0.2 m
   helps explain a lip rather than a strong exit. These are sampled vertices,
   not fluid-flow/CFD measures.
3. The rear-view central high silhouette is not simply a material artefact:
   it remains visible under the neutral, diffuse and wireframe inspections.
   The same loft contains the upper engine-cover/airbox spine and the lower
   centre region; the upper rear body is projected over the diffuser from
   behind. The relative contribution of upper-body occlusion versus lower
   centre profile is **not fully isolated**. A camera can exaggerate the
   shallow appearance, but isolated rear-region renders also show it, so a
   camera-only change cannot be the solution.
4. The current global ring can encode a gentle paired trough, but the
   cross-section must also satisfy the tapering upper tail and floor edge.
   Prototype A deepens it slightly without extra triangles and remains weak;
   prototype B locally retessellates and makes a deeper exit but introduces
   a sharp, unconvincing folded-looking silhouette in the matched reflective
   view. The prototype has **0 strict triangle crossings and no reversed
   face-normal dots**; its defect is visual curvature, not proven foldover.
   A convincing exit may need its own controlled section topology and a
   stitched seam, not more amplitude in the existing Gaussian alone.

Relevant source: `loft`, `centerBody`, `floorHalfWidth`, `channel`,
`centerSpine`, `diffuserRise` and `roundedExitZ` in
`scripts/generate-eds-g03.mjs`; diffuser landmarks in
`scripts/eds-g03-design.mjs`. Numerical evidence:
`evidence/diffuser-section-profile.json` and
`evidence/diffuser-section-profile.svg`. See the three diffuser comparison
PNGs under `evidence/`.

## Verified: rear halo mounts

1. `variableHaloTube` produces a separately merged MECHANICAL surface.
   Three body fairings are only vertex-height deformations of the BODY loft;
   no vertices or edge loops are shared with the tube. This is an actual
   intersecting-mesh construction, not a continuous body-to-tube junction.
2. The two rear mount centres are fixed at `(±.26,.66,.12) m`. The nearest
   sampled body surface lies around `Y=.6866–.6868 m` at these coordinates,
   **26.7–26.8 mm** above the tube centreline start. Near the feet, the
   unsigned mechanical-vertex-to-body distance spans approximately zero to
   57.6 mm. A bounded strict edge/triangle test finds **96 shell/tube
   crossing pairs** around the rear mounts in the cropped Revision 4 GLB.
   These crossings support geometric penetration, not just a shading seam.
3. Prototype A only lifts/widens the local shell fairing. The same test rises
   to **106 crossing pairs** while the visible boundary remains. Increasing
   fairing amplitude is therefore not a demonstrated cure. BODY winding is
   consistent; no changed face reverses against Revision 4. The matched
   unlit diffuse and specular images still expose the joint, so material
   mismatch and normals are secondary, not the verified primary cause.
4. Prototype B connects each rear tube directly to an annular local shell
   through shared edge loops. Its 40-segment tube-to-shell transition has no
   separate overlapping tube mesh at the junction; an initial inverted
   winding was detected and corrected before final evidence. However, the
   isolated patch looks like a raised round pad and is **not an acceptable
   final shape**. It proves the topology mechanism is feasible in a review
   specimen, not that the design has been solved or integrated.

The front mount was measured, but the GDR prototype and inter-mesh crossing
count focus on the rejected rear pair. A future integrated design must still
solve all three mounts. Relevant source: `variableHaloTube`, the shell
fairing loop and mechanical merge in `scripts/generate-eds-g03.mjs`;
the halo hardpoints in `scripts/eds-g03-design.mjs`. Measurements are
reproducible with `scripts/gdr-eds-g03-measure.py`.

## Findings versus hypotheses

| Statement                                                      | Status                                                                    |
| -------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Exit width is about 1.020 m, below the 1.160 m registry entry  | Verified from exported vertices                                           |
| Final channel lower envelope declines after Z≈2.1 m            | Verified from sampled exported vertices                                   |
| Full-car camera and rear suspension partially obscure the exit | Visible in Revision 4 sheets; exact occlusion share not measured          |
| Upper tail contributes to the central gable                    | Strong source/render inference; not separately masked and quantified      |
| Rear halo BODY and MECHANICAL intersect                        | Verified by separate mesh topology and 96 strict local triangle crossings |
| The existing fairing profile is insufficient by itself         | Supported by A prototype's 106 crossings and matched render               |
| Full watertightness or all-angle collision freedom             | NOT VERIFIED                                                              |

The isolated crops have intentionally open cut boundaries and expose jagged
crop edges. They are diagnostic specimens, not full-car design approval.
