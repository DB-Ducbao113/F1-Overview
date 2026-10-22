# C42 Reference vs EDS-G03 D1 vs EDS-G03 D2 — Component-Level Comparison & Defect Resolution

**Author**: Senior QA Engineer / SDET & Lead F1 Vehicle Designer

**Date**: 2026-10-22
**Target Environment**: DEV Review Only — Owner Gate

---

## 1. Subsystem Assessment & Visual Disposition

| Component Subsystem              | D1 Baseline Assessment                                          | D2 Reconstruction Implementation                                                                                                                   | Visual Disposition vs C42 |
| :------------------------------- | :-------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------ |
| **Overall Stance & Stature**     | Correct dimensions but toy-like, rounded body volumes           | Aggressive, low-slung, purposeful F1 racing machine stance; sharp transitions, tight packaging                                                     | **PASS FOR OWNER REVIEW** |
| **Nose & Monocoque**             | Generic smooth superellipse loft; blunt tip floating above wing | Chiseled top bevel shoulders, concave floor-channel underside, concave droop to crash tip, dual FOM camera pods, pitot sensor                      | **PASS FOR OWNER REVIEW** |
| **Cockpit & Driver Environment** | Simplistic oval void with plain seat primitive                  | FIA head protection collar surround, contoured carbon seat shell, headrest padding, digital steering wheel with color telemetry display            | **PASS FOR OWNER REVIEW** |
| **Halo Safety Device**           | Generic round hose with soft, indistinct rear leg transitions   | Triangular front aerodynamic pylon blade, titanium curved crown hoop with aerodynamic fairing and top micro-fin, structural rear lugs              | **PASS FOR OWNER REVIEW** |
| **Front Wing Assembly**          | 3 flat rectangular planks; planar box endplates                 | 4 cascaded 3D aerodynamic airfoil elements with center anhedral scoop, flared endplates with footplate, upper cutout, dive planes                  | **PASS FOR OWNER REVIEW** |
| **Sidepods & Cooling**           | Bulbous tube with round hole; abrupt shell junction             | Predatory angled mouth with upper leading overbite lip, dark radiator throat core, deep undercut chine, downwash deck with 7 cooling louvres       | **PASS FOR OWNER REVIEW** |
| **Engine Cover & Spine**         | Generic cylinder with flat rectangular spine                    | Shrink-wrapped packaging hugging power unit, razor-sharp dorsal shark fin to rear wing, cooling exit cannon, central exhaust tailpipe              | **PASS FOR OWNER REVIEW** |
| **Floor & Diffuser**             | Planar slab with generic rectangular strakes                    | Ground-effect Venturi underbody, tea-tray bib splitter with stay, 4 leading-edge strakes per side, stepped edge wings, diffuser with 4 fences      | **PASS FOR OWNER REVIEW** |
| **Rear Wing & Beam Wing**        | Flat planks; silhouette-grade endplates                         | 3D spoon-cambered mainplane, upper flap with DRS notch and bullet actuator pod, double-element beam wing, sculpted endplates, swan-neck pylons     | **PASS FOR OWNER REVIEW** |
| **Wheels & Tyres**               | Generic tori without rim faces or brakes                        | 18-inch Pirelli-style slicks with square shoulders and flat tread, carbon aero wheel covers, center lock nuts, carbon discs with monobloc calipers | **PASS FOR OWNER REVIEW** |
| **Suspension & Deflectors**      | Simple round cylinder links                                     | Aerodynamic streamlined carbon blade wishbones, pushrod/pullrod layout, upright brake ducts, mandatory 2022+ tyre-wake eyebrow deflectors          | **PASS FOR OWNER REVIEW** |
| **Aerodynamic Mirrors**          | Simple rectangular box on single cylinder                       | Sculpted aerodynamic housings with twin-blade stays, glass inserts, and outer airflow turning vanes                                                | **PASS FOR OWNER REVIEW** |

---

## 2. Resolution Status of Historical D1 Defects

| Defect ID       | Severity | Component    | Historical D1 Defect Description                                   | D2 Implementation & Resolution Status                                                                                                             | Disposition  |
| :-------------- | :------: | :----------- | :----------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------ | :----------: |
| `EDS-R3-D1-001` |    P2    | Sidepods     | Sidepod inlet-to-shell joint is visibly abrupt                     | Rebuilt as an integrated multi-station loft with an extended upper overbite leading lip and continuous undercut chine feeding the floor edge      | **RESOLVED** |
| `EDS-R3-D1-002` |    P2    | Front Wing   | Front-wing outboard profiles/endplates are too planar              | Upgraded to 4 cascaded 3D airfoil elements with spanwise curvature, flared outwash endplates, footplate vortex generator, and outer dive planes   | **RESOLVED** |
| `EDS-R3-D1-003` |    P2    | Engine Cover | Engine cover and rear shoulder lack secondary transitions          | Added downwash ramp upper deck, 7 longitudinal cooling louvres along the shoulder, dorsal shark fin, and severe coke-bottle waist narrowing       | **RESOLVED** |
| `EDS-R3-D1-004` |    P2    | Suspension   | Suspension upright/attachment fairings are simplified              | Implemented streamlined carbon blade wishbones, upright brake ducts, and mandatory curved tyre-wake eyebrow deflectors over the front wheels      | **RESOLVED** |
| `EDS-R3-D1-005` |    P2    | Rear Wing    | Rear-wing endplates and support interfaces remain silhouette-grade | Built 3D spoon-cambered mainplane, upper flap with DRS bullet pod, double-element beam wing, sculpted endplates, and dual swan-neck pylons        | **RESOLVED** |
| `EDS-R3-D1-006` |    P3    | Halo         | Halo rear-leg/crown transition is visually soft                    | Crown hoop fairing sculpted with aerodynamic teardrop section, top micro-fin, and structural rear mounting lugs anchored into monocoque shoulders | **RESOLVED** |

---

## 3. Component-Level Remaining Issue Log (D2 Scope)

| Defect ID       | Severity | Subsystem                 | Description                                                                                                                | Root Cause / Context                                                                                                                        | Required Action / Next Gate                     |
| :-------------- | :------: | :------------------------ | :------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------ | :---------------------------------------------- |
| `EDS-R3-D2-001` |    P2    | Fine Mechanical Packaging | Internal suspension rockers, dampers, and steering rack internals are not modeled                                          | Phase 2 focuses strictly on visible outer bodywork, aerodynamic surfaces, and stance. Fine internal mechanical packaging belongs to Phase 3 | Deferred to Phase 3 after Owner shape approval  |
| `EDS-R3-D2-002` |    P3    | Livery & PBR Textures     | Model is rendered in neutral clay and reflective diagnostic materials without PBR livery textures                          | Phase 2 gate strictly forbids premature texturing or livery application before geometry sign-off                                            | Preserved texture-free per Master Plan Gate 1–2 |
| `EDS-R3-D2-003` |    P3    | LOD Hierarchy             | GLB is single review LOD; mobile LOD1 and low-end LOD2 variants are not yet generated                                      | Addendum performance gate requires LOD variants before commercial integration                                                               | Scheduled for post-shape optimization phase     |
| `EDS-R3-D2-004` |    P4    | Steering Wheel Buttons    | Steering wheel rotary dials and toggle switches are represented as surface geometry rather than individual animated meshes | Interactive cockpit controls are out of scope for whole-car exterior review                                                                 | Low priority; detail polish                     |
