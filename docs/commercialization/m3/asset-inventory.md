# Podium EDS M3 Visual Asset Inventory

**Repository baseline:** `Per-PEDS` at `257cea3a0891b9e4f6285d29f667456177238d9b`

**Scope:** commercial-facing visual assets across the application. These engineering classifications are not legal opinions. `KEEP_ORIGINAL` records repository authorship evidence, not automatic legal clearance.

| Asset or source                                                                       | Coverage                                              | Classification    | M3 disposition                                                                                                                                                |
| ------------------------------------------------------------------------------------- | ----------------------------------------------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `public/models/eds-g01.glb`, `public/images/showroom/eds-g01/*.svg`                   | Original chassis and eight Showroom diagrams          | `KEEP_ORIGINAL`   | Retained. Six liveries and seven hotspots remain active. Formal rights review remains a launch gate.                                                          |
| `public/logo/*`, including `public/logo/og-preview.jpg`                               | Podium EDS marks and social preview                   | `KEEP_ORIGINAL`   | Retained based on M1 project-authorship records. The M1 inventory confirms the actual OG path; final brand-rights review remains required.                    |
| `public/images/podium-diffuser-hero-v2.webp`                                          | Previous homepage hero                                | `REPLACE`         | Replaced at runtime by `public/images/eds/editorial/eds-g01-hero.svg`; removed from commercial artifacts.                                                     |
| `public/images/eds/vehicle-studies/*.svg`                                             | 11 team/car editorial studies                         | `KEEP_ORIGINAL`   | M3 Phase 1 retained; legacy team bitmaps remain excluded from commercial artifacts.                                                                           |
| `public/images/eds/driver-profiles/*.svg`                                             | 28 abstract driver profiles                           | `KEEP_ORIGINAL`   | M3 Phase 1 retained; legacy driver bitmaps remain excluded from commercial artifacts.                                                                         |
| `src/components/common/ConstructorLogo.tsx`                                           | Constructor identifier                                | `KEEP_ORIGINAL`   | Original EDS editorial identifier retained; factual team labels remain.                                                                                       |
| Legacy Showroom sponsor/logo/livery modules                                           | Local comparison only                                 | `REPLACE`         | Removed from the production import graph. `dev-showroom.html` and `src/dev/LegacyShowroomComparison.tsx` provide a Vite-DEV-only comparison entry.            |
| `public/models/c42.v2.glb`, `public/textures/wheel_base.webp`, legacy Showroom images | Legacy comparison chassis and branded visuals         | `REPLACE`         | Source copies remain local for comparison/rollback; the commercial artifact prune and isolation scanner prohibit them.                                        |
| `public/images/circuits/*.webp`                                                       | Three unverified local circuit photographs            | `REPLACE`         | Replaced by generated local EDS circuit vectors and removed from commercial artifacts.                                                                        |
| Unsplash URLs in `circuitReviewPoints.ts`                                             | 71 remote references using 10 unique photographs      | `REPLACE`         | Eliminated. All 77 checkpoint image slots, including six repeated local-photo slots, now resolve to local EDS circuit SVGs.                                   |
| ArcGIS World Imagery and OpenStreetMap runtime tiles                                  | Satellite/street map layers                           | `REPLACE`         | Removed from the commercial experience. The map is now a self-contained SVG atlas; no tile-provider request or attribution obligation remains in the runtime. |
| `public/images/eds/circuits/*.svg`                                                    | 24 circuit-focused visualizations                     | `KEEP_ORIGINAL`   | Generated deterministically from repository circuit path records. Circuit names and geometry remain factual/editorial; formal rights review remains prudent.  |
| Procedural circuit paths in `circuitsData.ts`                                         | Track geometry used by cards, reviews and offline map | `REVIEW_REQUIRED` | Repository-authored data source with no external image dependency. Provenance and factual circuit-shape rights should receive final review.                   |
| Gallery assets                                                                        | No gallery bitmap directory in this snapshot          | `KEEP_ORIGINAL`   | No replacement required. Re-audit if a gallery is added.                                                                                                      |

## M3 Phase 2 coverage

- One original EDS-G01 homepage hero and 24 circuit studies were added without external image input.
- All 71 remote image references and all six uses of the three unverified local circuit photographs were replaced.
- ArcGIS and OpenStreetMap tile loading was replaced by an offline SVG map-style display while retaining circuit selection, markers, zoom, layer toggle and an optional user-initiated coordinates link.
- Production Showroom imports are EDS-only. Legacy source remains available solely through a development-only entry and is absent from the production artifact.
- The commercial build guard now requires 73 EDS assets and scans both the production Showroom import graph and emitted text artifacts for prohibited dependencies.

## Remaining review work

1. Independent review of Podium brand, EDS-G01 and circuit-shape provenance before commercial launch.
2. Physical-device touch/pinch and long-duration thermal/memory testing at the pre-launch gate.
3. Re-audit any future gallery, sponsor or externally sourced editorial imagery before it enters the commercial build.
