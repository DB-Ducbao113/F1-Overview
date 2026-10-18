# M2 Phase 1 — Concise Before/After Comparison

| Area                | Before: legacy Showroom                                | After: EDS-G01 prototype                                                   |
| ------------------- | ------------------------------------------------------ | -------------------------------------------------------------------------- |
| Geometry            | Alfa Romeo C42-derived third-party mesh                | Original procedural EDS-G01 geometry with nine named assemblies            |
| Source              | Upstream binary provenance; no editable project source | Deterministic, repository-controlled JavaScript generator                  |
| Livery              | Eleven constructor and sponsor-derived texture paths   | Six Podium EDS presets with generic PBR colors and no sponsor marks        |
| Wheels              | Pirelli/BBS-derived texture                            | Unbranded slick torus and flush aero-disc geometry                         |
| Studio walls        | Constructor logos, drivers, achievements               | EDS-G01 identity, engineering, aero and provenance panels in original mode |
| Runtime selection   | Fixed C42 asset                                        | Build-time feature flag; EDS-G01 safe default, legacy explicit opt-out     |
| Commercial artifact | Legacy GLB and wheel texture copied by Vite            | Post-build guard excludes both legacy files from `dist`                    |
| Camera/hotspots     | Existing orbit controls and six inspection points      | Same controls and hotspot coordinate system retained                       |

## Known Phase 1 risks

- Prototype geometry is deliberately lightweight and requires an expert visual/design review before it can be called a production master.
- The official Khronos validator passed with 0 errors and 0 warnings. It reported nine informational `UNUSED_OBJECT` messages for generated UV attributes because Phase 1 uses solid runtime materials rather than texture maps.
- Legacy team dossier content, hotspot copy/images, and 2D schematic assets remain outside the Phase 1 replacement scope and are not commercially cleared.
- No legal conclusion is made from original or AI-assisted generation alone.

## Next implementation step

M2 Phase 2 should refine EDS-G01 topology/UVs and LOD1, run the official Khronos validator, replace original-mode hotspot imagery and dossier copy, then add Playwright screenshot baselines for mobile, tablet and desktop before any commercial cutover.

## Phase 2 visual refinement

| Area              | Phase 1 prototype                                         | Phase 2 result                                                                |
| ----------------- | --------------------------------------------------------- | ----------------------------------------------------------------------------- |
| Body silhouette   | rounded ellipsoid sidepods and box-heavy assemblies       | custom lofted teardrop sidepods, faceted spear nose and defined central spine |
| Wheels            | tire torus plus flush opaque disc in one assembly         | separately shaded unbranded slicks, rims and conceptual brake discs           |
| Wings             | rectangular four-plane and rear-wing boxes                | swept/tapered front planforms and two-plane bridge rear wing                  |
| Floor/diffuser    | rectangular slab and coarse ramp                          | original delta planform, four Venturi fences and five diffuser strakes        |
| Technical imagery | legacy team schematics and close-ups disabled in EDS mode | original EDS schematic and seven component illustrations are operational      |
| Dossier           | team/constructor data remained below the EDS canvas       | original EDS engineering dossier with no team logo or sponsor association     |

Evidence: `before-phase2-desktop.png` compared with `desktop-1440x900.png`; inspection captures are `silhouette-front.png`, `silhouette-side.png`, `silhouette-cockpit.png`, `silhouette-rear.png` and `silhouette-top.png`.
