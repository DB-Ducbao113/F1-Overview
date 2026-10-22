# Clay gate issue log

## EDS-BLEND-001 — P2 — sidepod inlet composition — OPEN

- Reproduce: review `evidence/clay-gate/sidepod-close-up-clay.png` and the
  matched sidepod sheet.
- Expected: a layered, smoothly blended intake whose lip, shoulder, undercut and
  duct read as one intentional aerodynamic composition.
- Actual: the duct is a real open/recessed volume, but its circular termination
  and surrounding shoulder still read too much like an attached tube.
- Suspected root cause: the inlet lip and primary sidepod loft have independent
  section networks without a shared transition patch.
- Retest: **FAIL visually**; geometry loads and contains no degenerate triangles.

## EDS-BLEND-002 — P2 — floor/sidepod relationship — OPEN

- Reproduce: side and front-three-quarter clay sheets.
- Expected: a continuous undercut feeding a thin, supported floor edge.
- Actual: the new blend volume reduces the gap, but the outer floor still reads
  as a broad horizontal plate in side silhouette.
- Suspected root cause: floor plan/vertical thickness remains too uniform ahead
  of the diffuser.
- Retest: **REVISE visually**.

## EDS-BLEND-003 — P2 — diffuser exit design — OPEN

- Reproduce: `diffuser-underside-{clay,reflective}.png` and matched sheets.
- Expected: two deep, legible outlets with controlled roof/wall continuity.
- Actual: twin channels and four wall boundaries exist, but the rear cross
  section remains angular and the centre gable dominates the silhouette.
- Retest: **FAIL visual quality**; width and geometry validity pass.

## EDS-BLEND-004 — P2 — reference-level detail gap — OPEN

- Reproduce: all six full-car matched comparison sheets.
- Actual: wheel/brake/suspension assemblies are richer than Revision 6, but the
  model remains materially less sophisticated than Detailed + EDS in panel,
  duct, aero-edge and mechanical definition.
- Retest: **FAIL target fidelity**.

## EDS-BLEND-005 — P3 — runtime draw-call density — OPEN

- Evidence: `browser-performance.json` records 157 geometries/draw calls and
  77,426 triangles.
- Impact: acceptable for a DEV clay review on the measured desktop run, but too
  fragmented for a future commercial LOD0 without semantic batching.
- Status: optimization intentionally deferred until geometry approval.

## Unverified geometry risks

Strict whole-scene self-intersection and classified inter-mesh collision checks
are **NOT TESTED**. Independent validation confirms finite data, zero degenerate
triangles and consistent winding, but intentional open ducts and mechanically
contacting semantic objects require a more capable collision classifier.
