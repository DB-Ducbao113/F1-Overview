# R3.1 Revision 1 EDS-G03 proportion issues log

Status: **RETESTED — OWNER GATE 1 REVIEW**. Numeric PASS does not substitute for owner visual
approval.

## R3-G03-001 — Floor/body junction read as a detached plate

- Severity: P2 Major in rejected baseline.
- Expected: coherent floor volume with a readable sidepod undercut and rear diffuser rise.
- Baseline actual: broad thin shell appeared detached from the body in side/rear views.
- Revision: floor starts 0.27 m farther rearward, maximum half-width drops 0.04 m, shell thickness
  rises from 0.045 m to 0.065 m, and an original floor-edge bridge joins the undercut envelope.
- Evidence: normalized and physical `comparison-side.png`, `comparison-rear-three-quarter.png`.
- Retest: **PASS FOR R3.1**. The floor/undercut relationship is coherent at blockout resolution.
  Venturi sections and fine floor-edge geometry remain prohibited R3.2 work.

## R3-G03-002 — Sidepod/engine transition was capsule-like

- Severity: P2 Major in rejected baseline.
- Expected: identifiable intake, waist, undercut and controlled rear taper.
- Baseline actual: 0.76 m half-width and soft elliptical progression merged into one full volume.
- Revision: envelope half-width is 0.66 m, height is 0.41 m, inlet is moved inboard and the
  lower section is pinched more strongly; engine-cover stations are narrower and lower.
- Evidence: `comparison-front-three-quarter.png`, `comparison-side.png`, `comparison-top.png`.
- Retest: **PASS FOR R3.1**. The three mass zones are independently readable. Surface quality is
  intentionally deferred.

## R3-G03-003 — Rear wing/endplates dominated the silhouette

- Severity: P2 Major in rejected baseline.
- Expected: rear aero mass balanced against tyres, diffuser and engine cover.
- Revision: span 1.48 to 1.36 m; endplate envelope height 0.48 to 0.36 m; depth 0.47 to 0.39 m;
  polygon corners tightened while rear-most Z and 1.18 m overall height remain locked.
- Evidence: `comparison-rear.png`, `comparison-rear-three-quarter.png` and physical equivalents.
- Retest: **PASS FOR R3.1**. Rectangular visual dominance is materially reduced.

## R3-G03-004 — Halo read as an oversized circular ring

- Severity: P3 Minor in rejected baseline.
- Revision: maximum half-width 0.38 to 0.30 m; top Y 1.08 to 0.94 m; tube radius 0.028 to
  0.022 m; cockpit opening width 0.52 to 0.48 m.
- Evidence: `comparison-front.png`, `comparison-front-three-quarter.png`.
- Retest: **PASS FOR R3.1**. The halo no longer dominates the cockpit opening.

## R3-G03-005 — Simplified wheel/rim and aero sections

- Severity: P3 Minor, accepted blockout limitation.
- Actual: tyre dimensions, track and contact pass; wheel faces, wing sections and suspension are
  still coarse neutral blockout forms.
- Status: **OPEN / ACCEPTED FOR GATE 1**. Refining these now would violate the R3.1 stop condition.

## Remaining risk

No P0/P1/P2 defect remains open from the requested proportion correction. Owner aesthetic
approval is still mandatory, and a GO would authorize only the next explicitly approved stage.
