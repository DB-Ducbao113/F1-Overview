# EDS-G03 full vehicle design reset

Status: **OWNER DESIGN GATE — selection required**
Branch/baseline: `Per-PEDS` / `cb942b48170126add1bea16d5b504125003471f1`

## Reference and gap analysis

The DEV-only Detailed + EDS asset was inspected and rendered as a quality reference only. No C42 vertices, topology, UVs, textures, materials or distinctive styling contours were imported into either concept.

| Area | Detailed + EDS reference | Existing G03 | Design-reset response |
|---|---|---|---|
| Silhouette and mass | Layered masses, narrow waist and visually supported aero assemblies | Large continuous centre mass; broad, smooth side volume | Both concepts separate the monocoque, shoulder, undercut and floor plan; A uses a flowing teardrop, B a tighter tensioned waist |
| Nose/cockpit | Slender nose with dense cockpit and structural detail | Nose is proportionally credible but transitions into a monolithic body | New authored nose profiles preserve locks; cockpit recess and halo remain deliberately primary-stage |
| Sidepods | Clear inlet, shoulder, undercut and rearward taper | Smooth but capsule-like volume with limited sectional hierarchy | A has a long organic shoulder/taper; B has a higher forward shoulder, deeper undercut and more abrupt rear contraction |
| Engine cover | Layered taper with fine cooling/bodywork definition | Tall bulbous crest | New centre lofts lower and lengthen the taper; micro-detail is postponed |
| Floor/diffuser | Visually integrated floor edge and detailed underbody | Floor/diffuser reads as an attached local repair | Variable-width floor plans replace the rectangular plate; both retain a measured 1.160 m twin-channel exit |
| Wings/endplates | Multi-element, shaped, mechanically supported | Simplified planar masses | A uses three swept/curved front elements; B uses two broader elements with stronger dihedral; both remain WIP masses |
| Wheels/suspension | Detailed rims, tyres, hubs and linkage | Simplified but recognizable assemblies | Correct radial tyre section and registered widths replace the earlier oversized torus section; independent suspension remains review-level |
| Highlights/materials | Complex PBR separation supports surface reading | Neutral presentation exposes broad uninterrupted highlights | Clay and controlled reflective modes intentionally expose continuity; no decorative finish is used to mask geometry |

Geometry is the dominant remaining gap. Lighting and neutral material replacement make the WIP surfaces readable, but cannot supply the missing secondary assemblies, shared-boundary body construction or fine mechanical detail.

## Original design language

### Concept A — Aero Ribbon

- Long, low, continuous shoulder line from inlet to gearbox taper.
- Rounded teardrop sidepod plan with a progressive lower undercut.
- Organic variable-width floor edge and three swept front-wing elements.
- Softer section exponents and highlight flow intended for a premium, sculpted showroom identity.

### Concept B — Tensioned Wedge

- Higher forward shoulder and tighter waist for a more technical plan-view signature.
- Deeper undercut and a deliberate secondary floor flare before the diffuser.
- Two broader front-wing elements with stronger dihedral and a straighter rear-wing language.
- Sharper section exponents intended to produce more directional highlight breaks than Concept A.

Neither concept claims CFD-validated performance.

## Modeling source and reproducibility

Blender was not available through `PATH` or the checked standard Windows installation locations. Therefore no Blender or `bpy` validation is claimed.

The equivalent reproducible workflow is:

1. `scripts/eds-g03-design.mjs` remains the authoritative dimensional registry.
2. `scripts/generate-eds-g03-design-reset.mjs` authors longitudinal section networks, closed body lofts, variable-width floor surfaces, explicit inlet/duct geometry and independent mechanical assemblies.
3. The generator exports deterministic GLB files with five semantic assemblies and no textures.
4. `scripts/validate-eds-g03.mjs` measures the exported binary rather than trusting source parameters.
5. `scripts/inspect-eds-g03-design-reset.py` performs independent bounded topology diagnostics through trimesh/numpy/rtree.
6. `scripts/capture-eds-g03-design-reset.mjs` renders the four-way matched comparison in the DEV-only viewer.

Reproduction commands:

```text
node scripts/generate-eds-g03-design-reset.mjs A docs/commercialization/r3/evidence/r3-design-reset/eds-g03-design-concept-a.glb
node scripts/generate-eds-g03-design-reset.mjs B docs/commercialization/r3/evidence/r3-design-reset/eds-g03-design-concept-b.glb
node scripts/validate-eds-g03.mjs <concept.glb> <report.json> <hardpoints.json>
```

## Provenance and commercial isolation

- Authorship: original Podium EDS profile and procedural surface definitions, AI-assisted, authored in this repository.
- Reference use: C42/Detailed + EDS used only for broad presentation-quality and single-seater proportion evaluation.
- Excluded: C42 mesh data, topology, UVs, textures, logos, branding and distinctive contours.
- Location: WIP GLBs and renders live only under `docs/commercialization/r3/evidence/r3-design-reset/`.
- Commercial status: review-only; neither asset is imported by the production Showroom or copied to `dist`.
- Existing `public/models/eds-g03-preview.glb` and commercial `public/models/eds-g01.glb` are not overwritten.

## Visual decision

Concept A is the recommended base for full-detail authoring because its shoulder, undercut and variable floor edge read as one continuous primary composition in side and three-quarter views. Concept B is a useful alternate because its plan view is more distinctive, but its stronger waist changes currently read more abruptly and need more surface-patch work.

This recommendation is **not** visual approval. Neither concept yet matches Detailed + EDS in secondary aero complexity, wheel/rim detail, shared-boundary topology or mechanical density. Owner selection—or rejection of both—is required before detailed modeling.
