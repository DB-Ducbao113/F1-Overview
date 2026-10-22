# FIA 2026 registry review

Source reviewed: [FIA 2026 Formula 1 Regulations, Section C, Issue 21, published 19 October 2026](https://api.fia.com/system/files/documents/fia_2026_f1_regulations_-_section_c_technical_-_iss_21_-_2026-10-19.pdf).
The FIA Formula One World Championship regulations index was rechecked on
2026-10-22 and still listed Issue 21 as the latest 2026 Section C publication.

This is a design-registry comparison, not a homologation or compliance claim.
The FIA document defines many reference volumes and setup-dependent checks that
are not represented by a simple GLB bounding box.

## Coordinate mapping

FIA C2.1.1 uses longitudinal `+X` rearward, transverse `+Y` to the driver's
right and vertical `+Z` upward. EDS-G03 uses lateral `X`, vertical `Y` and
longitudinal `+Z` rearward. Any future regulatory checker must explicitly map
FIA longitudinal X to EDS project Z, FIA vertical Z to EDS project Y, and choose
the correct sign for driver-right transverse coordinates.

## Verified conflicts

| Item                    |               Locked EDS-G03 |                                       FIA Issue 21 | Disposition                                          |
| ----------------------- | ---------------------------: | -------------------------------------------------: | ---------------------------------------------------- |
| Wheelbase               |                     3,600 mm |                            C2.3.3 maximum 3,400 mm | **Conflict: +200 mm. Registry unchanged.**           |
| Non-wheel overall width | Front wing reaches ±1,000 mm | C2.3.1 generally limits non-wheel parts to ±950 mm | **Conflict: 100 mm total span. Registry unchanged.** |

The locked total width includes wheel envelopes, so the 2,000 mm overall bound
alone neither proves nor disproves C2.3.1. The explicit front-wing envelope does
exceed the general ±950 mm limit. Cockpit, front-wheel and rear-bulkhead rules
in C2.3.4–C2.3.6 depend on FIA datum planes not fully encoded by the current
registry; they are **NOT VERIFIED**.

Conclusion: the clay study preserves the owner-approved EDS registry and must
not be described as FIA 2026 compliant.
