# Blender refinement Revision 2 issue log

Baseline: `8fda531d222acda2fd68b33ab8cf8b980b9ac6d8`

Evidence: `evidence/refinement-revision-2/`

Gate: **OWNER DESIGN GATE - AWAITING VISUAL APPROVAL**

## EDS-BLEND-001 - P2 - sidepod inlet composition - OWNER REVIEW

- Previous defect: independent circular lip and duct sections read as an
  attached tube.
- Revision 2: one rounded-D outer section now drives the sidepod shoulder; an
  authored annular lip converges into a recessed dark throat and duct.
- Evidence: `focused-before-after/sidepod-inlet-{diffuse,reflective}.png`.
- Technical retest: finite geometry, consistent winding, no degenerate
  triangles. Aperture boundaries are intentional.
- Visual retest: clear improvement observed; final shape quality is **not
  self-approved** and remains for owner review.

## EDS-BLEND-002 - P2 - floor/sidepod relationship - OWNER REVIEW

- Previous defect: uniform broad plate and weak undercut support.
- Revision 2: variable-width floor plan, approximately 45 mm forward shell
  thickness and watertight ruled sidepod-to-floor transition shells.
- Evidence: `focused-before-after/floor-undercut-{diffuse,reflective}.png` and
  side silhouette sheets.
- Technical retest: floor and both transition shells are watertight with zero
  open boundary edges; dimensions and ground clearance remain locked.
- Residual visual risk: the outer edge remains deliberately horizontal and may
  still read too planar from a pure side camera. Owner decision required.

## EDS-BLEND-003 - P2 - diffuser exit design - OWNER REVIEW

- Previous defect: sparse cross-section sampling and two tall centre fences
  created an angular M-profile/central gable.
- Revision 2: 25 lateral samples, 13 longitudinal stations, lower-amplitude
  twin roof lobes, one low tapered splitter and two slim outer strakes.
- Evidence: `focused-before-after/diffuser-exit-{diffuse,reflective}.png` and
  Blender rear/underside views.
- Technical retest: floor/diffuser and all three strakes are watertight; exit
  width remains 1.160 m; zero degenerates and consistent winding.
- Residual visual risk: outlets are smoother and distinct but remain broad clay
  volumes rather than final detailed tunnels. Owner decision required.

## EDS-BLEND-004 - P2 - Detailed + EDS fidelity gap - OPEN

- Revision 2 adds open rims, hubs, visible brake discs/calipers, controlled
  panel boundaries and more coherent inlet/floor/diffuser definition.
- The candidate remains less dense than the Detailed + EDS reference in local
  aero edges, panel segmentation and mechanical assemblies.
- This gate intentionally excludes PBR, UV, LOD and production detailing.

## EDS-BLEND-005 - P3 - runtime draw-call density - OPEN

- Previous: 157 calls/geometries, 77,426 triangles, 1,715,424 bytes.
- Revision 2: 164 calls/geometries, 71,952 triangles, 1,594,552 bytes.
- Assessment: triangles and bytes decreased; seven additional semantic draw
  calls are a known DEV-review cost. Batching remains deferred until approval.

## Unverified geometry risks

- Strict whole-scene self-intersection: **NOT TESTED**.
- Classified inter-mesh collision: **NOT TESTED**.
- Reason: the available independent checker cannot reliably distinguish
  intended mechanical contact and designed open apertures across 164 semantic
  geometries. This limitation is not treated as PASS.
