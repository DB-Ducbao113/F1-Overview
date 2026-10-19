# M5 Phase 1 Content and Asset Provenance

Status: **TECHNICAL SOURCE CHECK COMPLETE / INDEPENDENT HUMAN REVIEW REQUIRED**

Milestone: M5 Phase 1

Branch: `Per-PEDS`

This record documents authorship method and dependencies. It is not a legal-clearance opinion. AI assistance does not by itself make an asset legally risk-free.

## Editorial content

| Source path                         | Topic                                    | Authoring method                                                                                                  | External dependencies                                                         | Verification status                                                                                                           | Commercial readiness |
| ----------------------------------- | ---------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | -------------------- |
| `src/data/engineeringArticles.json` | Ground Effect Aerodynamics               | Newly drafted bilingual VI/EN explanation using the EDS-G01 concept; AI-assisted drafting under project direction | NASA Glenn aerodynamic-force, boundary-layer and diffuser validation material | Source checked 2026-10-18; ride-height behavior remains geometry-dependent; independent specialist review pending             | REVIEW_REQUIRED      |
| `src/data/engineeringArticles.json` | Active Aerodynamics and Wing Mechanics   | Newly drafted bilingual VI/EN systems explanation; AI-assisted drafting under project direction                   | FIA 2024 development transcript, 2026 Section C Issue 20; NASA Glenn          | Historical X/Z terminology separated from operative rules; independent specialist review pending                              | REVIEW_REQUIRED      |
| `src/data/engineeringArticles.json` | Hybrid Powertrains and Energy Management | Newly drafted bilingual VI/EN energy-system explanation; AI-assisted drafting under project direction             | US Department of Energy AFDC; FIA 2026-04-20 notice and Section C Issue 20    | Road-hybrid principles separated from F1 regulatory context and EDS concepts; independent specialist review pending           | REVIEW_REQUIRED      |
| `src/data/engineeringArticles.json` | Vehicle Dynamics and Suspension          | Newly drafted bilingual VI/EN first-principles explanation; AI-assisted drafting under project direction          | MIT DSpace thesis landing record; Yale engineering project; NASA Glenn        | Yale objectives are not presented as measured results; detailed tyre and kinematics claims need independent specialist review | REVIEW_REQUIRED      |

External references support factual context only. Their wording and illustrations were not copied into the articles. No publication date or individual author credential is asserted in structured data.

## Original illustrations

| Generator/source                              | Exported asset                                            | Creation method                                                           | Third-party visual dependency | Rights evidence                  | Commercial readiness                     |
| --------------------------------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------- | ----------------------------- | -------------------------------- | ---------------------------------------- |
| `scripts/generate-eds-engineering-assets.mjs` | `public/images/eds/engineering/ground-effect-flow.svg`    | Deterministic project-authored SVG derived from abstract EDS-G01 geometry | None                          | Source generator and Git history | ORIGINAL_PROJECT_ASSET / REVIEW_REQUIRED |
| `scripts/generate-eds-engineering-assets.mjs` | `public/images/eds/engineering/active-aero-mechanism.svg` | Deterministic project-authored SVG mechanism diagram                      | None                          | Source generator and Git history | ORIGINAL_PROJECT_ASSET / REVIEW_REQUIRED |
| `scripts/generate-eds-engineering-assets.mjs` | `public/images/eds/engineering/hybrid-energy-loop.svg`    | Deterministic project-authored SVG system diagram                         | None                          | Source generator and Git history | ORIGINAL_PROJECT_ASSET / REVIEW_REQUIRED |
| `scripts/generate-eds-engineering-assets.mjs` | `public/images/eds/engineering/suspension-load-path.svg`  | Deterministic project-authored SVG load-path diagram                      | None                          | Source generator and Git history | ORIGINAL_PROJECT_ASSET / REVIEW_REQUIRED |

The diagrams contain no official Formula One, constructor or sponsor logos and do not reproduce FIA/F1 illustrations. Their labels explicitly state that they are not CFD output or measured data.

## Original social cards

| Generator/source                                                                  | Exported asset                                                                  | Method                                                                                          | Dependencies                                                 | Rights evidence                                                     | Commercial readiness                     |
| --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------------- | ---------------------------------------- |
| `scripts/generate-eds-engineering-social-cards.mjs` + `ground-effect-flow.svg`    | `public/images/eds/engineering/social/ground-effect-aerodynamics.png`           | Deterministic 1200×630 local Chrome render of the project SVG and original editorial typography | Local Chrome/Chromium and `playwright-core`; no remote image | Generator, SVG source and Git history; SHA-256 `01CFF3F6...28DD81`  | ORIGINAL_PROJECT_ASSET / REVIEW_REQUIRED |
| `scripts/generate-eds-engineering-social-cards.mjs` + `active-aero-mechanism.svg` | `public/images/eds/engineering/social/active-aerodynamics-wing-mechanics.png`   | Same project-owned render pipeline                                                              | Same                                                         | Generator, SVG source and Git history; SHA-256 `5ECDAFB1...AC07294` | ORIGINAL_PROJECT_ASSET / REVIEW_REQUIRED |
| `scripts/generate-eds-engineering-social-cards.mjs` + `hybrid-energy-loop.svg`    | `public/images/eds/engineering/social/hybrid-powertrains-energy-management.png` | Same project-owned render pipeline                                                              | Same                                                         | Generator, SVG source and Git history; SHA-256 `67304071...32A1C17` | ORIGINAL_PROJECT_ASSET / REVIEW_REQUIRED |
| `scripts/generate-eds-engineering-social-cards.mjs` + `suspension-load-path.svg`  | `public/images/eds/engineering/social/vehicle-dynamics-suspension.png`          | Same project-owned render pipeline                                                              | Same                                                         | Generator, SVG source and Git history; SHA-256 `3F9119DA...FC2F80A` | ORIGINAL_PROJECT_ASSET / REVIEW_REQUIRED |

The PNG exports reuse only the four project-authored EDS SVGs. They contain no third-party photograph, official series/team logo or sponsor mark. This provenance record does not constitute independent legal clearance.

## Reproduction

```bash
npm.cmd run asset:eds-engineering
npm.cmd run asset:eds-engineering:check
npm.cmd run asset:eds-engineering:social
npm.cmd run asset:eds-engineering:social:check
```

The check commands compare every exported SVG and PNG byte-for-byte with locally regenerated output. PNG reproduction requires the same browser rendering environment; the checked run used Chrome available on Windows and produced four 1200×630 files.
