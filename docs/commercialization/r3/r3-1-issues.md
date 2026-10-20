# R3.1 EDS-G03 proportion issues log

Status: **OPEN — OWNER GATE 1**. These are observed visual issues, not hidden by the numeric
dimension PASS.

## R3-G03-001 — Floor/body junction remains schematic

- Severity: P2 Major for future surface quality.
- Affected views: side, rear three-quarter, rear.
- Expected: floor volume should appear structurally continuous with sidepod undercut and diffuser.
- Actual: the tapered planform is improved, but the side profile still reads as a broad, thin
  shell beneath the body.
- Evidence: `evidence/r3-1-blockout/comparison-side.png` and
  `comparison-rear-three-quarter.png`.
- Suspected cause: R3.1 floor uses upper/lower blockout grids without the R3.2 Venturi sectional
  progression.
- Status: OPEN; address only after Gate 1 GO, unless the owner requests a hardpoint revision.

## R3-G03-002 — Sidepod and engine-cover transition is too full

- Severity: P2 Major for future surface quality.
- Affected views: front three-quarter, side, top.
- Expected: a clear intake shoulder, undercut and controlled rear taper.
- Actual: the volume establishes location and envelope but still reads as one soft capsule at
  some angles.
- Evidence: `comparison-front-three-quarter.png`, `comparison-side.png`, `comparison-top.png`.
- Suspected cause: coarse elliptical blockout sections intentionally omit R3.2 primary-surface
  control.
- Status: OPEN; owner may accept the volume envelope or request a hardpoint revision.

## R3-G03-003 — Rear wing/endplates dominate the rear silhouette

- Severity: P2 Major proportion-review item.
- Affected views: rear and rear three-quarter.
- Expected: rear aero should balance the tyres, diffuser and engine-cover taper.
- Actual: span and bounds are valid, but the slab-like endplate blockout appears visually heavy.
- Evidence: `comparison-rear.png` and `comparison-rear-three-quarter.png`.
- Suspected cause: endplate envelope has no R3.2 cut-outs, curvature or thickness transitions.
- Status: OPEN; revise hardpoints now only if the owner rejects the current wing balance.

## R3-G03-004 — Halo envelope reads oversized from the front

- Severity: P3 Minor at blockout stage.
- Affected views: front and front three-quarter.
- Expected: credible driver protection scale without dominating the cockpit.
- Actual: the 1.08 m top point is consistent, but the lateral arch looks broad relative to the
  simplified cockpit opening.
- Evidence: `comparison-front.png`.
- Suspected cause: thick inspection tube and coarse cockpit aperture amplify the visual width.
- Status: OPEN for owner decision; hardpoint width can be revised within R3.1.

## R3-G03-005 — Wheel/rim forms are deliberately simplified

- Severity: P3 Minor at blockout stage.
- Affected views: all.
- Expected: accurate tyre diameter, width, track and contact patch for Gate 1.
- Actual: those dimensions pass, but wheel faces are simple concentric volumes and not an
  engineering-detail proposal.
- Evidence: all six comparisons.
- Status: ACCEPTED LIMITATION for R3.1; detail work is prohibited before later gates.
