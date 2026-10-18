# Podium EDS M3 Visual Asset Inventory

**Repository snapshot:** `Per-PEDS` after M2 closure commit `927a490`

**Scope:** visual assets across the application, excluding data-pipeline and deployment work
**Classification note:** these engineering classifications are not legal opinions. `KEEP_ORIGINAL` records project authorship evidence; it does not by itself establish freedom to operate.

## Inventory

| Asset or source                                                                        | Actual coverage and consumers                                                          | Classification    | M3 disposition                                                                                                                                                        |
| -------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `public/models/eds-g01.glb`, `public/images/showroom/eds-g01/*.svg`                    | One original chassis and eight deterministic Showroom diagrams                         | `KEEP_ORIGINAL`   | Retain; M2 technical validation complete, formal rights review remains a launch gate.                                                                                 |
| `public/logo/*`                                                                        | Seven Podium EDS logo, icon and social-preview files                                   | `KEEP_ORIGINAL`   | Retain based on M1 project-authorship record; final brand-rights review remains required.                                                                             |
| `public/images/podium-diffuser-hero-v2.webp`                                           | Homepage engineering hero                                                              | `REVIEW_REQUIRED` | Retain temporarily. No reproducible source or sufficiently specific authorship record was found.                                                                      |
| `public/images/teams/*.webp`                                                           | 11 constructor-car renders formerly used by homepage, team and car pages               | `REPLACE`         | **Phase 1 replaced** by 11 deterministic EDS-G01 field-study SVGs; legacy directory is removed from commercial builds.                                                |
| `public/images/drivers/*.webp`                                                         | 28 photographic or likeness-based portraits formerly used by driver cards and profiles | `REPLACE`         | **Phase 1 replaced** by 28 abstract EDS data-profile SVGs; legacy directory is removed from commercial builds. Factual names and statistics remain editorial content. |
| `src/components/common/ConstructorLogo.tsx` before M3                                  | Recognizable constructor insignias used throughout cards, standings and modals         | `REPLACE`         | **Phase 1 replaced** with an original EDS hexagonal editorial identifier and plain factual team labels.                                                               |
| `src/data/showroom/teamLogoSVGs.ts` and legacy livery modules                          | Constructor and sponsor marks used only by the retained local comparison path          | `REPLACE`         | Not used by the default original experience; retain for local comparison for now and verify bundle exclusion before commercial launch.                                |
| `public/images/showroom/closeups/*.webp`, `schematics/*.webp`, five root hotspot WebPs | 82 legacy constructor-specific Showroom visuals                                        | `REPLACE`         | Replaced by eight EDS-G01 SVG runtime slots in M2 and removed from commercial builds.                                                                                 |
| `public/models/c42.v2.glb`, `public/textures/wheel_base.webp`                          | Legacy comparison chassis and branded wheel appearance                                 | `REPLACE`         | M2 keeps source copies only for DEV comparison and removes both from commercial builds.                                                                               |
| `public/images/circuits/*.webp`                                                        | Three Albert Park track photographs used by circuit review cards and fallbacks         | `REVIEW_REQUIRED` | Source/license evidence is insufficient; replace in a later M3 phase.                                                                                                 |
| Unsplash URLs in `src/data/championship/circuitReviewPoints.ts`                        | 71 references using 10 unique remote photographs                                       | `REVIEW_REQUIRED` | Per-image attribution and license evidence is not stored. Capture evidence or replace before launch.                                                                  |
| ArcGIS World Imagery in `CircuitRealWorldMap.tsx`                                      | Remote satellite tile layer                                                            | `REPLACE`         | Commercial entitlement is not recorded. Replace with an original/open circuit presentation in a later M3 phase.                                                       |
| OpenStreetMap tiles in `CircuitRealWorldMap.tsx`                                       | Remote street tile layer                                                               | `REVIEW_REQUIRED` | ODbL attribution and tile-policy compliance require verification; not changed in Phase 1.                                                                             |
| Procedural circuit paths in `circuitsData.ts` and canvas/SVG UI backgrounds            | Route diagrams, grids, noise and interface decoration                                  | `KEEP_ORIGINAL`   | Retain as repository-authored geometry/code; factual circuit-shape rights review remains prudent.                                                                     |
| `public/images/gallery/*`                                                              | Directory absent in the current repository                                             | `KEEP_ORIGINAL`   | No gallery bitmap asset exists to replace in this snapshot. Re-audit if a gallery is added.                                                                           |

## M3 Phase 1 coverage

- 11 original EDS-G01 vehicle field studies now cover team directories, team profiles, homepage vehicle panels and car-detail heroes.
- 28 abstract driver data profiles now cover current and historical driver cards without using a photographic likeness.
- One reusable original constructor identifier replaces the eleven recognizable logo drawings while keeping factual team names visible.
- The commercial artifact guard removes the legacy team and driver bitmap directories and requires all 39 new SVG outputs.

## Remaining priority order

1. Replace or document the homepage diffuser hero and OpenGraph preview source chain.
2. Replace the three local circuit photographs and 10 unique Unsplash dependencies with original circuit visualizations.
3. Remove ArcGIS imagery and verify OpenStreetMap attribution/tile-policy compliance.
4. Isolate or remove legacy constructor/sponsor SVG source from the commercial JavaScript bundle.
5. Complete formal provenance and third-party-rights review before commercial launch.
