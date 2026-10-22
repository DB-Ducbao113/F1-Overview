# EDS-G03 Blender refinement Revision 2 evidence

Captured 2026-10-22 from working tree based on commit
`8fda531d222acda2fd68b33ab8cf8b980b9ac6d8`. Candidate images use the
reproducible Blender source and `eds-g03-clay-review.glb`; comparison sheets use
the previous clay GLB from that commit and the DEV-only Detailed + EDS reference.
All paired modes retain the same camera, viewport, lighting and model scale.

## Blender candidate renders

| Camera / defect | Clay image | Reflective image | Model / observation |
|---|---|---|---|
| Front / overall | `blender/front-clay.png` | `blender/front-reflective.png` | Revision 2; locked width and front aero silhouette retained. |
| Rear / EDS-BLEND-003 | `blender/rear-clay.png` | `blender/rear-reflective.png` | Revision 2; lower-amplitude twin diffuser roof profiles replace the central gable. |
| Side / EDS-BLEND-002 | `blender/side-clay.png` | `blender/side-reflective.png` | Revision 2; variable-width floor and thinner edge inspected in silhouette. |
| Top / overall | `blender/top-clay.png` | `blender/top-reflective.png` | Revision 2; hardpoints, track and planform symmetry retained. |
| Front three-quarter / overall | `blender/front-three-quarter-clay.png` | `blender/front-three-quarter-reflective.png` | Revision 2; integrated inlet/floor composition and open wheel assemblies visible. |
| Rear three-quarter / EDS-BLEND-002/003 | `blender/rear-three-quarter-clay.png` | `blender/rear-three-quarter-reflective.png` | Revision 2; floor-to-diffuser transition inspected without camera masking. |
| Cockpit / local continuity | `blender/cockpit-close-up-clay.png` | `blender/cockpit-close-up-reflective.png` | Revision 2; accepted halo/cockpit geometry unchanged. |
| Sidepod inlet / EDS-BLEND-001 | `blender/sidepod-close-up-clay.png` | `blender/sidepod-close-up-reflective.png` | Revision 2; rounded-D annulus, shared shoulder section and recessed dark throat. |
| Floor edge / EDS-BLEND-002 | `blender/floor-edge-undercut-clay.png` | `blender/floor-edge-undercut-reflective.png` | Revision 2; thin ruled transition shell supports the floor edge. |
| Diffuser underside / EDS-BLEND-003 | `blender/diffuser-underside-clay.png` | `blender/diffuser-underside-reflective.png` | Revision 2; densely sampled profiles and low central splitter. |
| Wheel/suspension / EDS-BLEND-004 | `blender/wheel-suspension-close-up-clay.png` | `blender/wheel-suspension-close-up-reflective.png` | Revision 2; open rim, hub, spokes, brake and suspension detail. |

## Three-model matched comparison sheets

Every sheet compares, left to right: Detailed + EDS DEV reference, previous
Blender clay revision at `8fda531d`, and uncommitted Revision 2 candidate.

| Camera / defect | Diffuse image | Reflective image | Observation |
|---|---|---|---|
| Front | `matched-comparison/front-diffuse.png` | `matched-comparison/front-reflective.png` | Overall front proportion and aero density. |
| Rear | `matched-comparison/rear-diffuse.png` | `matched-comparison/rear-reflective.png` | Rear mass and diffuser visibility. |
| Side | `matched-comparison/side-diffuse.png` | `matched-comparison/side-reflective.png` | EDS-BLEND-002 silhouette. |
| Top | `matched-comparison/top-diffuse.png` | `matched-comparison/top-reflective.png` | Planform and track comparison. |
| Front three-quarter | `matched-comparison/front-three-quarter-diffuse.png` | `matched-comparison/front-three-quarter-reflective.png` | Overall fidelity and inlet composition. |
| Rear three-quarter | `matched-comparison/rear-three-quarter-diffuse.png` | `matched-comparison/rear-three-quarter-reflective.png` | Floor/diffuser and rear mechanical definition. |
| Cockpit close-up | `matched-comparison/cockpit-close-up-diffuse.png` | `matched-comparison/cockpit-close-up-reflective.png` | Accepted cockpit/halo context. |
| Sidepod close-up | `matched-comparison/sidepod-close-up-diffuse.png` | `matched-comparison/sidepod-close-up-reflective.png` | EDS-BLEND-001 before/reference/candidate. |
| Floor edge undercut | `matched-comparison/floor-edge-undercut-diffuse.png` | `matched-comparison/floor-edge-undercut-reflective.png` | EDS-BLEND-002 local thickness and support. |
| Diffuser underside | `matched-comparison/diffuser-underside-diffuse.png` | `matched-comparison/diffuser-underside-reflective.png` | EDS-BLEND-003 profile continuity. |
| Wheel/suspension close-up | `matched-comparison/wheel-suspension-close-up-diffuse.png` | `matched-comparison/wheel-suspension-close-up-reflective.png` | EDS-BLEND-004 mechanical-detail gap. |

Renderer statistics and errors for these captures are in
`matched-comparison/browser-report.json`.

## Focused matched BEFORE/AFTER

These sheets compare only previous clay and Revision 2 using identical camera,
lighting, FOV, viewport and scale.

| Defect / camera | Diffuse image | Reflective image | Observation |
|---|---|---|---|
| EDS-BLEND-001 / inlet | `focused-before-after/sidepod-inlet-diffuse.png` | `focused-before-after/sidepod-inlet-reflective.png` | Circular tube replaced by integrated rounded-D lip/throat. |
| EDS-BLEND-002 / floor | `focused-before-after/floor-undercut-diffuse.png` | `focused-before-after/floor-undercut-reflective.png` | Uniform slab replaced by thin variable transition. |
| EDS-BLEND-003 / diffuser | `focused-before-after/diffuser-exit-diffuse.png` | `focused-before-after/diffuser-exit-reflective.png` | Angular central gable reduced; twin roof lobes are smoother. |
| Side silhouette | `focused-before-after/side-silhouette-diffuse.png` | `focused-before-after/side-silhouette-reflective.png` | Locked global silhouette retained. |
| Front three-quarter | `focused-before-after/front-three-quarter-diffuse.png` | `focused-before-after/front-three-quarter-reflective.png` | Intake, wheel and floor changes in full-car context. |
| Rear three-quarter | `focused-before-after/rear-three-quarter-diffuse.png` | `focused-before-after/rear-three-quarter-reflective.png` | Diffuser and open rear rim changes in full-car context. |

## Browser emulation

| Viewport | Image | Model / observation |
|---|---|---|
| Desktop 1440x900 | `browser/desktop-front-three-quarter.png` | Revision 2 DEV renderer loaded without recorded WebGL/page/request errors. |
| Mobile emulation 375x812 | `browser/mobile-emulation-front-three-quarter.png` | Revision 2 emulation only; no physical-device claim. |

`browser/browser-errors.json` records the observed error array. Browser timing is
in `../../browser-performance.json`; RAF interval is not GPU frame time.
