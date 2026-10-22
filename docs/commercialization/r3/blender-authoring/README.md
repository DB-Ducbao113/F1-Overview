# EDS-G03 Blender clay-design gate

Status: **OWNER DESIGN GATE — AWAITING VISUAL APPROVAL**.

This directory is a DEV-only, independently authored Blender design study. It
does not replace `public/models/eds-g01.glb`, `public/models/eds-g03-preview.glb`
or the commercial Showroom model. No C42 geometry, topology, UV, texture,
branding or distinctive styling surface is imported by the authoring script.

## Deliverables

- `eds-g03-clay-design.blend` — editable Blender 5.2.2 LTS source.
- `eds-g03-clay-review.glb` — deterministic Three.js review export.
- `eds-g03-clay-review.sha256` — exported-byte identity.
- `geometry-report.json` — dimensions, locks and Blender-side triangle count.
- `topology-report.json` — independent trimesh inspection.
- `khronos-validation.json` — Khronos glTF Validator output.
- `browser-performance.json` — measured headless WebGL load and RAF intervals.
- `evidence/clay-gate/` — retained baseline evidence.
- `evidence/matched-comparison/` — retained baseline comparison evidence.
- `evidence/refinement-revision-2/` — 22 final Blender renders, 22 three-model
  matched sheets, 12 focused BEFORE/AFTER sheets and browser emulation evidence.

## Reproduction

```powershell
& 'E:\Formula 1\.tools\blender-5.2.2\blender-5.2.2-windows-x64\blender.exe' `
  --background --factory-startup `
  --python scripts\blender\eds_g03_clay_authoring.py
```

`EDS_G03_SKIP_RENDER=1` skips the PNG pass while retaining `.blend` and GLB
generation. The script rounds exported floating-point accessors and recomputes
their declared extrema to remove Blender's sub-precision UV jitter. Two clean
exports produced identical SHA-256 hashes.

## Gate result

Revision 2 replaces the attached-tube inlet with a rounded-D annulus and
recessed duct, joins the sidepod undercut to a thinner variable floor, smooths
the twin-channel diffuser profile, and exposes the brake package through open
rims. Dimensional, deterministic-export, validator, browser and production
isolation gates pass. Final visual quality is not self-approved; see
`issues.md` and `evidence/refinement-revision-2/README.md`. Do not begin PBR,
LOD, R3.3 or commercial integration from this gate.
