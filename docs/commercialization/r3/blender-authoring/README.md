# EDS-G03 Blender clay-design gate

Status: **OWNER DESIGN GATE — HOLD / REVISE**.

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
- `evidence/clay-gate/` — ten Blender views in clay and reflective modes.
- `evidence/matched-comparison/` — twenty Three.js sheets comparing Detailed +
  EDS, Revision 6 and this Blender study under the same camera/light per sheet.

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

The dimensional and file-format gates pass. The new study is more modular and
editable than the prior monolithic generator, and it introduces explicit ducts,
semantic assemblies, detailed wheel/brake/suspension objects and open diffuser
channel boundaries. It does **not** yet reach the Detailed + EDS reference's
component density or surface sophistication. Sidepod inlet composition,
floor-edge integration and diffuser exit design remain owner-visible P2 issues.
Do not begin PBR, LOD or commercial integration from this gate.
