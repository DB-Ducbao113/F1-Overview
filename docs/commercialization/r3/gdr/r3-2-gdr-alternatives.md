# R3.2 GDR — architecture alternatives and prototypes

All options keep EDS-G03 original and unbranded, preserve the existing
commercial Showroom/G01, and use the current hardpoint registry as a lock.
No C42 mesh, UV, texture or protected contour is involved.

| Criterion        | A — Parametric refinement                                               | B — Local topology replacement                                         | C — Hybrid authoring                                                                 |
| ---------------- | ----------------------------------------------------------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| Visual potential | Limited for diffuser exit/halo junction; gentle curves easy             | High if seams and curvature are designed well                          | Highest flexibility: procedural global shell plus purpose-authored junctions         |
| Continuity       | Existing body ring remains continuous; halo remains intersecting meshes | Explicit shared border loops can make true continuity                  | Explicit stitched boundaries with separately authored local patches                  |
| Determinism      | Existing generator already deterministic                                | Deterministic if patch generator/vertex order fixed                    | Deterministic if authored control points or `.blend` export are versioned and pinned |
| Complexity       | Low initial cost, high risk of repeated ineffective tweaking            | High seam indexing, manifold/collision and rollback cost               | Medium-high tooling/coordination cost; clearest separation of responsibilities       |
| Geometry locks   | Easy to constrain, but may not achieve registered exit width            | Can keep external bounds and exact seam coordinates; needs gate checks | Same, with required hardpoint and silhouette regression comparison                   |
| Provenance       | Pure original math, straightforward                                     | Pure original local mesh, inspectable                                  | Original authored patch requires source/provenance record; no reference extraction   |
| Testability/risk | Existing tests apply; visual failure remains likely                     | Boundary, normals, collision and full-car regression must expand       | Same as B plus export reproducibility; review-only until approved                    |
| Tools            | Existing Three.js generator                                             | Three.js or scripted mesh topology library                             | Scripted control mesh; Blender only if installed/approved (not installed here)       |

## Isolated exported specimens

`scripts/gdr-eds-g03-prototypes.py` reads but never overwrites the Revision 4
GLB. It exports six region-only GLBs in `evidence/`: two Revision 4 crops and
two alternatives per rejected region. All images use a separate DEV renderer
with fixed 38° camera, framing and lights **within each region**. The crop
edge is intentionally open; halo B is an incomplete local specimen, not a
full-car alternative. See `evidence/prototype-geometry.json`,
`evidence/prototype-topology.json`, `evidence/khronos-validation.json` and
`evidence/prototype-browser-report.json`.

### Diffuser

- **Revision 4 crop:** 5,453 triangles; final sampled channel minimum
  `Y=.1584 m` at `Z≈2.3`, effective rear half-width `.5098 m`.
- **A, profile-only:** same 5,453 triangles and open edge count (197).
  A wider, moderate paired depression lowers the rear channel sample to
  `Y=.1316 m`; the longitudinal profile still rises then falls near the exit.
  Diffuse/reflective images show an incremental change, not a clearly
  convincing twin-channel outlet. No strict local self-crossings detected.
- **B, local resection test:** locally subdivided crop, 21,812 triangles
  (4×), stronger independently shaped W-profile. Sampled rear channel
  `Y=.1433 m`, raised outer shoulders to `.3855 m` at `|X|=.5 m`, unchanged
  crop minimum ground clearance `.0663 m`. The geometry remains within the
  source crop's X/Z bounds, but the matched reflective view shows harsh
  internal transitions. **Reject this exact profile and triangle cost.**
  It demonstrates that additional local samples alone do not fix curvature.

The actual exported cross-section and longitudinal lower-envelope arrays are
in `evidence/diffuser-section-profile.json`; their overlay is
`evidence/diffuser-section-profile.svg`. These are geometric samples, not CFD.

### Rear halo mounts

- **Revision 4 crop:** BODY 3,465 triangles + MECHANICAL 3,808. Two separate
  meshes cross in 96 strict local triangle pairs.
- **A, larger body fairing:** same counts and hardpoint positions; no changed
  BODY face flips. Crossings increase to 106 and the joint remains visible.
  **Reject amplitude-only refinement** as the proposed fix.
- **B, welded loop specimen:** 1,120 triangles per rear mount, two meshes
  only because the left and right specimens are independent; each individual
  shell-to-tube transition shares a ring of vertices. Each specimen has 80
  intentional open boundary edges (outer perimeter and unclosed tube top),
  zero local strict self-crossings and positive-Y shell orientation after
  correction. Mount centres remain `(±.26,.66,.12) m`; bounds are local and
  below the locked car height. **Reject its circular-pad silhouette.** A
  future B/C design would need non-circular, flush shell boundary loops and
  a stitched full-body interface.

All six GLBs exported deterministically on a repeat run. Khronos glTF
Validator `2.0.0-dev.3.10` reports 0 errors and 0 warnings for every GLB;
it reports 2–4 non-blocking `BUFFER_VIEW_TARGET_MISSING` hints per asset from
the isolated trimesh exporter. All listed mesh groups have consistent
winding, finite face normals and zero degenerate triangles. The bounded
intersection checker does not prove absence of coplanar or out-of-region
collisions. Physical-device rendering and integrated full-car behavior are
**NOT TESTED** for these specimens.

Open-boundary location classification is in `evidence/prototype-topology.json`.
For the diffuser crop, 197 edges split into 44 front-crop, 72 rear-exit and
81 upper-crop edges; B has exactly twice these counts after subdivision.
Halo Revision 4 and A body crops each have 453 edges: 88 front-crop,
86 rear-crop, 139 lateral-crop, 72 lower-crop and 68 **unclassified** edges.
Their separate cropped tube mesh has 56 unclassified open edges. These are
not claimed as a watertight join. Halo B has 80 edges per specimen: 40 at
the intentional outer patch perimeter and 40 at the open tube top.

## Visual evidence

- `evidence/diffuser-diffuse-comparison.png`
- `evidence/diffuser-reflective-comparison.png`
- `evidence/diffuser-wireframe-comparison.png`
- `evidence/halo-diffuse-comparison.png`
- `evidence/halo-reflective-comparison.png`
- `evidence/halo-wireframe-comparison.png`

The diffuse mode is deliberately unlit and the reflective mode uses a
controlled Phong highlight; neither hides the contour with postprocessing.
Prototype renderings are diagnostic, **not** accepted visual designs.
