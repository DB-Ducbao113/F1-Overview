# M3 Original Visual Authoring Record

The Podium EDS M3 visual system was authored in this repository on branch `Per-PEDS`.

## Phase 1

`scripts/generate-eds-visual-assets.mjs` deterministically creates 11 EDS-G01 vehicle studies and 28 abstract driver profiles. It uses repository-authored SVG geometry, neutral Podium EDS palettes and system-font fallbacks. It does not ingest photographs, official constructor logos, sponsor marks or driver portraits.

```bash
npm run asset:eds-visuals
```

Expected output: 39 SVG files. Asset-set SHA-256: `5857824189A4D5445F5200F75A8A1C6B6F6C6881821B4956D51A95B7EAA165BE`.

## Phase 2

`scripts/generate-eds-editorial-assets.mjs` deterministically creates one EDS-G01 homepage hero and 24 circuit studies. The hero is a fresh vector interpretation of the repository-authored EDS-G01 design language. Circuit illustrations use the path records in `src/data/championship/circuitsData.ts`; they do not trace or embed the replaced local photographs, Unsplash images or map tiles.

```bash
npm run asset:eds-editorial
```

Expected output: 25 SVG files. Asset-set SHA-256: `1800024F04CF1C7666020F6D04609CB3E12F69207D95542917D6E6D5FB627379`.

`scripts/replace-circuit-image-references.mjs` is the one-time reproducible migration that maps all 77 circuit-review checkpoint image slots to the corresponding local circuit study. `scripts/check-commercial-visual-isolation.mjs` verifies that prohibited image hosts, legacy chassis assets and sponsor/logo routines do not enter the commercial artifact.

Team, driver and circuit names remain factual editorial labels. Procedural or AI-assisted authorship does not itself establish legal clearance; formal provenance and rights review remains required before commercial launch.
