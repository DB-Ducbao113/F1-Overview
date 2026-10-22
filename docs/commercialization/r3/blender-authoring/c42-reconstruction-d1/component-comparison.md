# C42 benchmark vs EDS-G03 D1 component review

C42 is used only as a DEV visual-quality benchmark. Ratings describe visible
construction density, not copy fidelity or commercial-rights clearance.

| Component                  | D1 evidence                        | Assessment                                                                                                                                                        | Disposition                                             |
| -------------------------- | ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| Overall architecture       | six whole-car sheets               | Correct open-wheel stance and locked dimensions; EDS is visibly original, but its large body surfaces remain calmer and less resolved than C42                    | **NEEDS REWORK**                                        |
| Cockpit / monocoque        | cockpit and top sheets             | Real recessed opening, seat, dashboard, steering column, integrated rim and separate shoulder volumes are present                                                 | PASS for D1 review; owner approval pending              |
| Halo                       | halo clay/reflective/wireframe     | Crown, front blade and three mount regions are coherent; rear crown-to-leg transition is still softer and simpler than the benchmark                              | **NEEDS REWORK**                                        |
| Nose                       | nose/front-wing and side sheets    | Long continuous sectional taper is credible and no old EDS mesh is reused; lower nose/floor junction remains visually plain                                       | **NEEDS REWORK**                                        |
| Front wing                 | front and nose sheets              | Three full-span airfoil elements, endplates, pylons and cascades are present; endplates and outboard flap shaping remain less sophisticated than C42              | **NEEDS REWORK**                                        |
| Sidepods / cooling         | sidepod and three-quarter sheets   | Real annular lips, dark throats, deep undercut volumes and cooling louvres exist; inlet/body blend shows a visible junction and the upper shoulder is too bulbous | **NEEDS REWORK**                                        |
| Floor / venturi / diffuser | floor/diffuser sheets              | Closed twin-channel floor, shaped lower surfaces, edge wings and four strakes are present; outlet profile reads clearly and winding validation passes             | PASS for D1 review; CFD/physical validity not claimed   |
| Suspension                 | suspension and whole-car sheets    | Five links per corner plus joints are present and aligned to wheel centers; attachment fairings and upright packaging remain simplified                           | **NEEDS REWORK**                                        |
| Wheels / brakes            | wheel/brake close-up               | Volumetric tyres, open barrels, hubs, 12-spoke faces, discs, calipers and ducts are visible                                                                       | PASS for D1 review; physical brake packaging unverified |
| Engine cover               | side/rear-three-quarter sheets     | Continuous independent cover taper exists; spine, cooling exits and rear transition lack C42-level surface articulation                                           | **NEEDS REWORK**                                        |
| Rear wing / supports       | rear and rear-three-quarter sheets | Main plane, upper flap, beam wing, supports and endplates are complete; endplates remain visually planar and generic                                              | **NEEDS REWORK**                                        |
| Fine-detail distribution   | component sheets                   | Details are mechanically concentrated rather than random, but front/rear aero and engine-cover density are not yet benchmark-equivalent                           | **NEEDS REWORK**                                        |

## Explicit remaining visual defects

1. `EDS-R3-D1-001` — P2: sidepod inlet-to-shell joint is visibly abrupt.
2. `EDS-R3-D1-002` — P2: front-wing outboard profiles/endplates are too planar
   relative to the reference benchmark.
3. `EDS-R3-D1-003` — P2: engine-cover and rear shoulder lack secondary
   engineering transitions.
4. `EDS-R3-D1-004` — P2: suspension upright/attachment fairings are simplified.
5. `EDS-R3-D1-005` — P2: rear-wing endplates and support interfaces remain
   silhouette-grade.
6. `EDS-R3-D1-006` — P3: halo rear-leg/crown transition is visually soft.

These findings prevent a visual PASS and are not silently downgraded by the
successful geometry/build checks.
