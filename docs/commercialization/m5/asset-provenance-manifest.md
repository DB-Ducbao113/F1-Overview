# M5 Phase 1 Content and Asset Provenance

Status: **EDITORIAL REVIEW REQUIRED**

Milestone: M5 Phase 1

Branch: `Per-PEDS`

This record documents authorship method and dependencies. It is not a legal-clearance opinion. AI assistance does not by itself make an asset legally risk-free.

## Editorial content

| Source path                         | Topic                                    | Authoring method                                                                                                  | External dependencies                                                                     | Verification status                                                                     | Commercial readiness |
| ----------------------------------- | ---------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | -------------------- |
| `src/data/engineeringArticles.json` | Ground Effect Aerodynamics               | Newly drafted bilingual VI/EN explanation using the EDS-G01 concept; AI-assisted drafting under project direction | NASA Glenn aerodynamic-force and boundary-layer education; FIA technical-regulation index | Technical citations recorded; human editorial review pending                            | REVIEW_REQUIRED      |
| `src/data/engineeringArticles.json` | Active Aerodynamics and Wing Mechanics   | Newly drafted bilingual VI/EN systems explanation; AI-assisted drafting under project direction                   | FIA 2026 technical press material and current regulation index; NASA Glenn                | Claims qualified by regulation-version caveat; human editorial review pending           | REVIEW_REQUIRED      |
| `src/data/engineeringArticles.json` | Hybrid Powertrains and Energy Management | Newly drafted bilingual VI/EN energy-system explanation; AI-assisted drafting under project direction             | US Department of Energy AFDC; FIA 2026 regulation material                                | No EDS performance values claimed; human editorial review pending                       | REVIEW_REQUIRED      |
| `src/data/engineeringArticles.json` | Vehicle Dynamics and Suspension          | Newly drafted bilingual VI/EN first-principles explanation; AI-assisted drafting under project direction          | MIT repository thesis; Yale engineering project; NASA Glenn                               | No optimized kinematics or measured EDS results claimed; human editorial review pending | REVIEW_REQUIRED      |

External references support factual context only. Their wording and illustrations were not copied into the articles. No publication date or individual author credential is asserted in structured data.

## Original illustrations

| Generator/source                              | Exported asset                                            | Creation method                                                           | Third-party visual dependency | Rights evidence                  | Commercial readiness                     |
| --------------------------------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------- | ----------------------------- | -------------------------------- | ---------------------------------------- |
| `scripts/generate-eds-engineering-assets.mjs` | `public/images/eds/engineering/ground-effect-flow.svg`    | Deterministic project-authored SVG derived from abstract EDS-G01 geometry | None                          | Source generator and Git history | ORIGINAL_PROJECT_ASSET / REVIEW_REQUIRED |
| `scripts/generate-eds-engineering-assets.mjs` | `public/images/eds/engineering/active-aero-mechanism.svg` | Deterministic project-authored SVG mechanism diagram                      | None                          | Source generator and Git history | ORIGINAL_PROJECT_ASSET / REVIEW_REQUIRED |
| `scripts/generate-eds-engineering-assets.mjs` | `public/images/eds/engineering/hybrid-energy-loop.svg`    | Deterministic project-authored SVG system diagram                         | None                          | Source generator and Git history | ORIGINAL_PROJECT_ASSET / REVIEW_REQUIRED |
| `scripts/generate-eds-engineering-assets.mjs` | `public/images/eds/engineering/suspension-load-path.svg`  | Deterministic project-authored SVG load-path diagram                      | None                          | Source generator and Git history | ORIGINAL_PROJECT_ASSET / REVIEW_REQUIRED |

The diagrams contain no official Formula One, constructor or sponsor logos and do not reproduce FIA/F1 illustrations. Their labels explicitly state that they are not CFD output or measured data.

## Reproduction

```bash
npm.cmd run asset:eds-engineering
npm.cmd run asset:eds-engineering:check
```

The check command compares every exported SVG byte-for-byte with the deterministic generator output.
