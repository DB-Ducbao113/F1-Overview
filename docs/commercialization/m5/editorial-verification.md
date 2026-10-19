# M5 Phase 2 Technical Editorial Verification

Reviewed: 2026-10-18

Scope: four existing Engineering Insights articles in Vietnamese and English

Status: **SOURCE CHECKED / INDEPENDENT HUMAN SPECIALIST REVIEW REQUIRED**

This is an editorial traceability record, not legal clearance or a professional engineering certification. The articles and EDS diagrams are AI-assisted project work. No EDS-G01 CFD, wind-tunnel, dyno or track measurement is claimed.

## Source versions and outcomes

| Source                                                                                                                                                       | Version observed                                                                     | Claims supported                                                                             | Outcome                                                                           |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| [NASA Glenn — Aerodynamic Forces](https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/aerodynamic-forces/)                                              | Current educational page accessed 2026-10-18                                         | Net force from integrated pressure and skin friction; Bernoulli is a limited simplification  | VERIFIED for first-principles explanation                                         |
| [NASA Glenn — Boundary Layer](https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/boundary-layer/)                                                      | Current educational page accessed 2026-10-18                                         | No-slip boundary layer and separation under adverse pressure gradients                       | VERIFIED                                                                          |
| [NASA Glenn — Buice diffuser validation](https://www.grc.nasa.gov/www/wind/valid/buice/buice01/buice01.html)                                                 | NASA validation archive accessed 2026-10-18                                          | Separated diffuser flow and adverse-pressure-gradient context                                | VERIFIED for general diffuser behavior; not EDS-G01 validation                    |
| [FIA Formula 1 regulations index](https://www.fia.com/regulations/category/110)                                                                              | 2026 Section C Technical Regulations, Issue 20 dated 2026-08-05, observed 2026-10-18 | Current location for operative 2026 technical rules                                          | VERIFIED as the current rule reference; no compliance opinion made                |
| [FIA 2026 technical-regulations press conference](https://www.fia.com/news/f1-fia-formula-1-2026-technical-regulations-press-conference-transcript)          | Transcript dated 2024-06-08                                                          | Historical X-mode/Z-mode development language and fail-safe discussion                       | VERIFIED AS HISTORICAL CONTEXT ONLY                                               |
| [FIA refinements notice](https://www.fia.com/news/refinements-2026-fia-formula-1-regulations-agreed-all-stakeholders)                                        | Notice dated 2026-04-20                                                              | Qualified 350 kW/250 kW MGU-K deployment statement                                           | VERIFIED for that dated notice; current Section C remains authoritative           |
| [US DOE AFDC — Hybrid Electric Vehicles](https://afdc.energy.gov/vehicles/how-do-hybrid-electric-cars-work)                                                  | Current educational page accessed 2026-10-18                                         | Generic energy store, motor/generator, regenerative braking and power-electronics principles | VERIFIED for road-hybrid fundamentals; not an F1 specification                    |
| [MIT — Vehicle Dynamics on an Electric Formula SAE Racecar](https://dspace.mit.edu/entities/publication/cb994dec-2439-445e-bd4c-a235120c068b)                | Audrey Gaither thesis, June 2021, handle 1721.1/139209                               | Vehicle-dynamics design and coupled system trade-offs                                        | VERIFIED at repository-record level; detailed calculations need specialist review |
| [Yale — Decoupled Roll/Heave Front Suspension](https://me-special-projects.yale.edu/decoupled-roll-heave-front-suspension-design-for-a-formula-sae-race-car) | Project page observed 2026-10-18; validation described as future work                | Design objective of separating roll/heave control                                            | VERIFIED as a project objective; NOT evidence of measured performance benefit     |

## Editorial corrections made

- Replaced the categorical “locally choke” floor statement with a geometry-dependent mass-flow/separation explanation and explicitly labelled it as a principle, not an EDS-G01 measurement.
- Labelled the FIA 2024 X-mode/Z-mode transcript as historical development context and identified Section C Issue 20 as the operative reference observed during review.
- Added the dated FIA 350/250 kW context with an explicit version caveat; no value is attributed to EDS-G01.
- Replaced the unstable MIT bitstream URL with its persistent DSpace publication record.
- Reworded “perfect decoupling is impossible” to a narrower statement about practical coupling through tyres, structure, kinematics and aerodynamics.
- Recorded per-source access dates, versions and bilingual verification notes in article data and displayed them on article pages.

## Claim classes

| Class              | Treatment in the articles                                                                               |
| ------------------ | ------------------------------------------------------------------------------------------------------- |
| Physical principle | Explained from cited educational or academic sources; no quantified EDS performance inferred            |
| Regulation         | Dated/versioned and separated from historical press terminology; current FIA text remains authoritative |
| EDS-G01 concept    | Described as reproducible educational geometry or a conceptual mechanism                                |
| Measured result    | None claimed; diagrams state NOT CFD / NOT MEASURED DATA                                                |

## Claims requiring human specialist review

- Geometry-specific floor sensitivity, leakage behavior and the boundaries of a stable ride-height window.
- Active-wing fatigue, flutter, actuator sizing, locking and complete failure-mode coverage.
- Battery thermal limits, brake blending behavior and race-specific control strategy.
- Tyre load sensitivity, roll-centre migration/jacking and damper-frequency terminology in both languages.
- Vietnamese terminology consistency for specialist motorsport usage.
- Rights/provenance conclusions and FIA publication/reuse conditions.

Automated source checking and this editorial pass do not establish independent legal clearance.
