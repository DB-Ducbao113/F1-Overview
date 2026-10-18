# EDS-G01 M2 Phase 1 Authoring Record

**Asset:** `public/models/eds-g01.glb`  
**Milestone:** M2 Phase 1  
**Author/owner:** Podium Effet De Sol repository owner, implemented through the project AI coding workflow  
**Date:** 2026-10-18  
**Source of truth:** `scripts/generate-eds-g01.mjs`

## Authorship and generation method

EDS-G01 was authored from an empty Three.js scene using only mathematical primitives and original assembly rules in the source generator. The generator does not load, sample, trace, deform, or inspect `c42.v2.glb` or any other vehicle mesh. It exports glTF 2.0 binary (`.glb`) with `THREE.GLTFExporter` from the MIT-licensed Three.js dependency already used by the application.

The design language was established specifically for Podium EDS:

- faceted hexagonal spear monocoque ending in a split-keel nose;
- delta floor shoulders with twin Venturi channels and four longitudinal fences;
- compact teardrop sidepods around a narrow dorsal engine spine;
- a bridge-mounted rear wing supported by inward diagonal pylons;
- diamond mirror housings and flush, unbranded wheel discs;
- swept halo loop with a central aerodynamic blade.

These choices intentionally avoid copying the C42 vertex data, UV layout, material names, proportions, sponsor placement, and recognizable livery graphics. The model contains no logos, team names, sponsor marks, tire branding, or imported textures.

## Reproduction

```text
npm run asset:eds-g01
npm run asset:eds-g01:validate
```

The first command deterministically regenerates the GLB. The second verifies the GLB header, glTF version, required nine assemblies, primitive/draw-call count, triangle ceiling, and file-size ceiling.

Official Khronos validation can be repeated without adding a production dependency:

```text
npm install --no-save --package-lock=false gltf-validator
node scripts/validate-eds-g01-khronos.cjs
```

## Geometry hierarchy

1. `EDS_001_Floor_Underfloor`
2. `EDS_002_Cockpit_Interior`
3. `EDS_003_Suspension_Mirrors`
4. `EDS_004_Bodywork_Sidepods`
5. `EDS_005_Wings_Assembly`
6. `EDS_006_Wheels_Tires`
7. `EDS_007_Monocoque_Nose`
8. `EDS_008_Halo_Structure`
9. `EDS_009_Diffuser_RainLight`

## Legal qualification

This record documents the generation process and supports provenance review; it is not a legal clearance opinion. Original or AI-assisted authorship does not automatically eliminate design-right, trade-dress, trademark, or other IP risk. Commercial release still requires the remaining M2 replacement work and appropriate legal review.
