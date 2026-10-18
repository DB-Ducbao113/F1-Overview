# M2 Phase 2 — Showroom Asset Replacement Inventory

## Replaced in the default EDS Showroom

| Legacy dependency                                                     | Default EDS replacement                                                   | Runtime disposition                                                       |
| --------------------------------------------------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| `public/models/c42.v2.glb`                                            | `public/models/eds-g01.glb`                                               | Source retained for local DEV comparison; removed from production `dist`. |
| `public/textures/wheel_base.webp`                                     | Geometry-native unbranded slick, rim and brake assemblies                 | Source retained for local DEV comparison; removed from production `dist`. |
| 11 constructor schematics under `public/images/showroom/schematics/`  | `public/images/showroom/eds-g01/schematic.svg`                            | Legacy directory removed from production `dist`.                          |
| 66 constructor close-ups under `public/images/showroom/closeups/`     | Seven EDS component illustrations under `public/images/showroom/eds-g01/` | Legacy directory removed from production `dist`.                          |
| Five generic legacy hotspot images in `public/images/showroom/*.webp` | EDS wing, DRS, power module, halo, sidepod, wheel and floor SVGs          | Legacy images removed from production `dist`.                             |
| Constructor logo/sponsor/team dossier inside the Showroom             | `EDSTechnicalDossier.tsx` and EDS-only detail modal                       | Legacy content remains reachable only in local DEV comparison mode.       |
| Constructor-branded studio boards                                     | Existing procedural `EDSStudioBackdropTexture.ts`                         | EDS mode renders neutral Podium engineering boards only.                  |

## Build exclusion control

`scripts/prune-legacy-showroom-assets.mjs` removes nine legacy targets after every production build and verifies that `eds-g01.glb` plus the EDS schematic remain. `src/config/showroomAssets.ts` additionally constrains `VITE_USE_ORIGINAL_CHASSIS=false` to Vite development mode, preventing a stale production environment variable from enabling the legacy chassis.

## Intentionally retained editorial material

Real team and driver names remain in editorial data and non-Showroom routes. Constructor car thumbnails used by historical/editorial car pages were not replaced with fictional EDS images because that would misrepresent the factual subject. Their commercial rights status remains **LEGAL REVIEW / NOT CLEARED**, not approved by this milestone.

## Known residual source assets

Legacy files remain in the repository for local visual comparison and rollback evidence. Presence in source does not imply commercial readiness. The commercial-build guard, not source deletion, is the current containment mechanism.

## Phase 3 coverage closure

- Original-mode route coverage: `/showroom` uses EDS-G01, six procedural livery presets, seven EDS hotspot illustrations, one EDS schematic and the text/CSS technical dossier.
- Cards and dossier sections do not require car raster imagery; creating 82 one-for-one fictional replacements would add unused assets and misleading constructor variants.
- Browser QA opened all seven hotspot dialogs and the schematic modal at mobile, tablet and desktop sizes; every local image completed with a positive natural width.
- The production build guard verifies the GLB and all eight SVG outputs, and fails if any prohibited legacy model, wheel texture, close-up, schematic or generic hotspot target remains.
- Historical/editorial car thumbnails outside the Showroom remain factual references and retain `LEGAL REVIEW / NOT CLEARED` status. They are not M2 Showroom dependencies.
