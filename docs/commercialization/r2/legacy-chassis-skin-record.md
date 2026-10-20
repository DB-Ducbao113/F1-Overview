# R2 legacy detailed chassis skin record

Date: 2026-10-20. Branch: `Per-PEDS`. Status: **DEV-only owner review**.

## Geometry and model provenance

- Runtime review asset: `public/models/c42.v2.glb`, SHA-256
  `3A0272A5EA84CC28004C0D167205805D5D76E86F895B34E517E4610447DA6DE2`.
- The optimized file derives from `markste-in/c42`, commit
  `6c87b04a9c2738e33c1167801e9d9c164e7b0035`; the repository identifies the model as
  based on the Alfa Romeo C42 AR model. Full upstream file/license details are retained in
  `public/models/README.md`.
- The upstream WTFPL file license does not establish permission for Alfa Romeo design,
  trade dress, trademarks, team graphics, sponsor artwork or tire branding.
- The legacy GLB remains a local engineering reference. The production build prunes
  `dist/models/c42.v2.glb` and `dist/dev-showroom.html`; the commercial dependency-graph
  guard rejects legacy Showroom modules from the production Showroom.

The DEV renderer clones the scene hierarchy but retains every cached GLTF geometry and UV
buffer. Browser instrumentation found 11/11 displayed meshes sharing their source geometry.
No geometry deformation, subdivision, procedural chassis reconstruction or UV rewrite is
performed.

## EDS skin authorship

The EDS skin implementation is repository-authored in:

- `src/dev/LegacyEDSSkinEngine.ts`
- `src/dev/LegacyDetailedCar.tsx`
- `src/dev/LegacyShowroomComparison.tsx`

It uses the six palettes from `src/data/showroom/edsLiveries.ts`:

1. Carbon Heritage
2. Aero Velocity
3. Crimson Prototype
4. Studio Stealth
5. Grand Prix Edition
6. Cyber Kinetic

Nine original runtime texture slots cover nose, bodywork, wings, floor, suspension and
mirrors, diffuser/mechanical rear surfaces, cockpit, halo, and wheels/tires. Artwork consists
of repository-authored twill carbon weave, gradients, body-part-specific tapered panels,
geometric speed bands, restrained accent lines, and unbranded wheel graphics drawn with the
browser Canvas API. Carbon Heritage uses a visible satin weave; Studio Stealth uses a sparse,
matte treatment. The implementation does not import
`F1CarTextures.ts`, `teamLiveries.ts`, sponsor helpers, team logos, the legacy wheel texture,
or third-party imagery. It generates no team wordmarks, sponsor marks or tire lettering.

The skin owns nine Canvas textures and nine PBR materials per active preset. Cleanup disposes
only those owned resources. Cached GLTF geometry and source materials are never disposed.

## Review evidence

The six matched A/B camera views are stored in `legacy-skin-evidence/` using these pairs:

| View                | Neutral original geometry                 | EDS-skinned detailed geometry        |
| ------------------- | ----------------------------------------- | ------------------------------------ |
| Front three-quarter | `legacy-original-front-three-quarter.png` | `legacy-eds-front-three-quarter.png` |
| Side                | `legacy-original-side.png`                | `legacy-eds-side.png`                |
| Top                 | `legacy-original-top.png`                 | `legacy-eds-top.png`                 |
| Front               | `legacy-original-front.png`               | `legacy-eds-front.png`               |
| Rear                | `legacy-original-rear.png`                | `legacy-eds-rear.png`                |
| Rear three-quarter  | `legacy-original-rear-three-quarter.png`  | `legacy-eds-rear-three-quarter.png`  |

One front-three-quarter image per skin is recorded as `skin-<livery-id>.png`. Exact browser,
geometry, renderer, frame-time and switching samples are in
`legacy-skin-evidence/browser-report.json`.

The polish acceptance set is stored in `legacy-skin-polish-evidence/`. It contains front
three-quarter, side, rear, sidepod, front-wing, rear-wing, wheel/suspension and cockpit views
for each of the six skins (48 captures), plus matched neutral/skinned A/B captures for front
three-quarter, side and rear. Its `browser-report.json` records the final renderer and
repeat-switch evidence. The DEV studio uses a single seamless dark enclosure, controlled local
lights and the same camera/light state for A/B comparisons.

This technical provenance record is not legal clearance. Any commercial use of the legacy
chassis requires independent rights review even when the applied skin contains no third-party
marks.
