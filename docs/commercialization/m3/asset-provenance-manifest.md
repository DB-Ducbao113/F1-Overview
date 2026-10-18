# Podium EDS Asset Provenance Manifest — M3 Phase 1

Commercial readiness is provisional until evidence-based rights review is complete. Procedural generation does not automatically make an asset legally risk-free.

| Exported asset path                                  | Creator or generator                               | Original source path                                                                                       | Authoring method and dependencies                                                                                                         | Rights evidence                                                            | Commercial-readiness status                                                           |
| ---------------------------------------------------- | -------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `public/images/eds/vehicle-studies/*.svg` (11 files) | Podium EDS deterministic vector generator          | `scripts/generate-eds-visual-assets.mjs`; EDS-G01 geometry language from the M2 source model               | Repository-authored SVG paths, gradients and typography; Node.js standard library only; no external images, fonts, logos or sponsor marks | Repository history, generator source and byte-identical regeneration check | **PROVISIONAL — original technical illustration; independent rights review required** |
| `public/images/eds/driver-profiles/*.svg` (28 files) | Podium EDS deterministic vector generator          | `scripts/generate-eds-visual-assets.mjs`; factual driver IDs and racing numbers from `src/data/drivers.ts` | Abstract helmet and data-card geometry; no portrait likeness, external image, team logo or sponsor mark                                   | Repository history, generator source and byte-identical regeneration check | **PROVISIONAL — abstract editorial identifier; publicity/number-use review required** |
| `src/components/common/ConstructorLogo.tsx`          | Podium EDS repository-authored React/SVG component | Component source and `TeamId` factual identifiers                                                          | Original hexagonal EDS mark with plain text abbreviations; no copied constructor paths                                                    | Repository history and source diff replacing recognizable insignias        | **PROVISIONAL — no third-party logo paths detected; legal review required**           |
| `src/config/originalVisualAssets.ts`                 | Podium EDS repository-authored routing utility     | Repository source                                                                                          | Deterministic local-path mapping only                                                                                                     | Repository history                                                         | **READY as editable source**                                                          |

## Reproduction

```bash
npm run asset:eds-visuals
```

The command writes exactly 11 vehicle studies and 28 driver profiles under `public/images/eds/`. It requires no network access and has no paid dependency.

Byte-identical regeneration was verified for all 39 outputs. The sorted path-and-content asset-set SHA-256 is `5857824189A4D5445F5200F75A8A1C6B6F6C6881821B4956D51A95B7EAA165BE`.

## Exhaustive exported asset index

All files below inherit the generator, authoring method, dependency, rights-evidence and provisional-readiness record above.

### Vehicle studies

- `public/images/eds/vehicle-studies/alpine.svg`
- `public/images/eds/vehicle-studies/astonmartin.svg`
- `public/images/eds/vehicle-studies/audi.svg`
- `public/images/eds/vehicle-studies/cadillac.svg`
- `public/images/eds/vehicle-studies/ferrari.svg`
- `public/images/eds/vehicle-studies/haas.svg`
- `public/images/eds/vehicle-studies/mclaren.svg`
- `public/images/eds/vehicle-studies/mercedes.svg`
- `public/images/eds/vehicle-studies/racingbulls.svg`
- `public/images/eds/vehicle-studies/redbull.svg`
- `public/images/eds/vehicle-studies/williams.svg`

### Driver data profiles

- `public/images/eds/driver-profiles/albon.svg`
- `public/images/eds/driver-profiles/alonso.svg`
- `public/images/eds/driver-profiles/antonelli.svg`
- `public/images/eds/driver-profiles/bearman.svg`
- `public/images/eds/driver-profiles/bortoleto.svg`
- `public/images/eds/driver-profiles/bottas.svg`
- `public/images/eds/driver-profiles/colapinto.svg`
- `public/images/eds/driver-profiles/doohan.svg`
- `public/images/eds/driver-profiles/gasly.svg`
- `public/images/eds/driver-profiles/hadjar.svg`
- `public/images/eds/driver-profiles/hamilton.svg`
- `public/images/eds/driver-profiles/hulkenberg.svg`
- `public/images/eds/driver-profiles/lawson.svg`
- `public/images/eds/driver-profiles/leclerc.svg`
- `public/images/eds/driver-profiles/lindblad.svg`
- `public/images/eds/driver-profiles/magnussen.svg`
- `public/images/eds/driver-profiles/norris.svg`
- `public/images/eds/driver-profiles/ocon.svg`
- `public/images/eds/driver-profiles/perez.svg`
- `public/images/eds/driver-profiles/piastri.svg`
- `public/images/eds/driver-profiles/ricciardo.svg`
- `public/images/eds/driver-profiles/russell.svg`
- `public/images/eds/driver-profiles/sainz.svg`
- `public/images/eds/driver-profiles/sargeant.svg`
- `public/images/eds/driver-profiles/stroll.svg`
- `public/images/eds/driver-profiles/tsunoda.svg`
- `public/images/eds/driver-profiles/verstappen.svg`
- `public/images/eds/driver-profiles/zhou.svg`

## M3 Phase 2 additions

Commercial readiness remains provisional. The records below document authorship and dependencies; they are not a legal-clearance opinion.

| Exported asset path                                                       | Creator or generator                                  | Original source path                                                                                 | Authoring method and dependencies                                                                                                         | Rights evidence                                                            | Commercial-readiness status                                                           |
| ------------------------------------------------------------------------- | ----------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `public/images/eds/editorial/eds-g01-hero.svg`                            | Podium EDS deterministic vector generator             | `scripts/generate-eds-editorial-assets.mjs`; EDS-G01 design language from the M2 source model        | Repository-authored SVG primitives and gradients; Node.js standard library only; no external image, logo or sponsor input                 | Generator source, repository history and byte-identical regeneration check | **PROVISIONAL - original technical illustration; independent rights review required** |
| `public/images/eds/circuits/*.svg` (24 files)                             | Podium EDS deterministic vector generator             | `scripts/generate-eds-editorial-assets.mjs`; path records in `src/data/championship/circuitsData.ts` | Repository-authored SVG presentation generated from local circuit geometry; no photograph, map tile, external font, logo or sponsor input | Generator/source records and byte-identical regeneration check             | **PROVISIONAL - factual circuit geometry and source provenance require final review** |
| `src/components/championship/CircuitRealWorldMap.tsx`                     | Podium EDS repository-authored React/SVG component    | Component source; local circuit geometry and coordinates                                             | Offline SVG atlas with local markers, layer modes and zoom; no ArcGIS, OpenStreetMap or remote tile dependency                            | Repository source diff and commercial artifact scan                        | **READY as editable source; factual map data review remains**                         |
| `src/components/showroom/EDSStudioStage.tsx`, `EDSHotspotSelectorBar.tsx` | Podium EDS repository-authored React/Three components | Component source and existing EDS-G01 hotspot records                                                | Original studio geometry, labels and controls; production import graph contains no legacy sponsor/logo/livery routines                    | Repository source diff and bundle-isolation regression check               | **PROVISIONAL - technical source; independent rights review required**                |

### Phase 2 reproduction

```bash
npm run asset:eds-editorial
```

The command writes exactly one hero and 24 circuit SVGs without network access or paid dependencies. The sorted path-and-content asset-set SHA-256 is `1800024F04CF1C7666020F6D04609CB3E12F69207D95542917D6E6D5FB627379`.

### Phase 2 exported asset index

- `public/images/eds/editorial/eds-g01-hero.svg`
- `public/images/eds/circuits/albert-park.svg`
- `public/images/eds/circuits/bahrain.svg`
- `public/images/eds/circuits/baku.svg`
- `public/images/eds/circuits/catalunya.svg`
- `public/images/eds/circuits/cota.svg`
- `public/images/eds/circuits/gilles-villeneuve.svg`
- `public/images/eds/circuits/hermanos-rodriguez.svg`
- `public/images/eds/circuits/hungaroring.svg`
- `public/images/eds/circuits/interlagos.svg`
- `public/images/eds/circuits/las-vegas.svg`
- `public/images/eds/circuits/lusail.svg`
- `public/images/eds/circuits/madring.svg`
- `public/images/eds/circuits/marina-bay.svg`
- `public/images/eds/circuits/miami.svg`
- `public/images/eds/circuits/monaco.svg`
- `public/images/eds/circuits/monza.svg`
- `public/images/eds/circuits/red-bull-ring.svg`
- `public/images/eds/circuits/sepang.svg`
- `public/images/eds/circuits/shanghai.svg`
- `public/images/eds/circuits/silverstone.svg`
- `public/images/eds/circuits/spa.svg`
- `public/images/eds/circuits/suzuka.svg`
- `public/images/eds/circuits/yas-marina.svg`
- `public/images/eds/circuits/zandvoort.svg`
