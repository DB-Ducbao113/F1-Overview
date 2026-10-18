# M3 Phase 1 Original Visual Authoring Record

The Podium EDS M3 Phase 1 vector system was authored in this repository on branch `Per-PEDS`. The editable source of record is `scripts/generate-eds-visual-assets.mjs`.

The generator uses only repository-authored geometric SVG primitives, an original EDS-G01-inspired side silhouette, an abstract helmet form, neutral Podium EDS palettes and system-font fallbacks. It does not ingest, trace or embed third-party photographs, official constructor logos, sponsor marks or driver portraits.

Team and driver identifiers are used as factual editorial routing labels. The generated graphics explicitly state that they are independent editorial visualizations and not official team renders or likenesses. This implementation reduces identified visual dependency risk but is not a legal clearance opinion.

Reproduction command:

```bash
npm run asset:eds-visuals
```

Expected output: 39 SVG files — 11 vehicle studies and 28 driver profiles.
