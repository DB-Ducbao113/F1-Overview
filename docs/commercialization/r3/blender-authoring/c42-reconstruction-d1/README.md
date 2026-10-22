# EDS-G03 C42-referenced reconstruction D1

Status: **DEV REVIEW ONLY — OWNER GATE**. This candidate does not replace any
production or commercial Showroom asset.

## Reproducible source and outputs

- Blender source: `EDS-G03-C42-Referenced-Reconstruction-D1.blend`
- Review GLB: `eds-g03-c42-reconstruction-d1.glb`
- Authoring source: `scripts/blender/eds_g03_c42_reconstruction_d1.py`
- Blender mesh checker: `scripts/blender/validate_eds_g03_c42_d1.py`
- Three.js checker: `scripts/validate-eds-g03-c42-d1.mjs`
- Contact-sheet builder: `scripts/create-eds-g03-c42-d1-sheets.mjs`

Run Blender 5.2.2 from the repository root:

```powershell
& 'E:\Formula 1\.tools\blender-5.2.2\blender-5.2.2-windows-x64\blender.exe' `
  --background --factory-startup `
  --python scripts/blender/eds_g03_c42_reconstruction_d1.py
node scripts/create-eds-g03-c42-d1-sheets.mjs
```

The `.blend` retains 220 semantic EDS authoring objects. The exporter creates a
temporary evaluated mesh and emits 11 material primitives to avoid 220 WebGL
draw calls. The temporary object is not saved to the editable source.

## Reference provenance and isolation

No owner-accessible original C42 `.blend` was found under `E:\Formula 1`.
`public/models/c42.v2.glb` is therefore imported into
`00_C42_REFERENCE_DEV_ONLY`. Direct source measurements are in
`c42-reference-breakdown.json`. It is normalized only for camera comparison,
is not read as a vertex source, and is excluded from the EDS GLB selection.

All EDS geometry is generated from original analytic sections and the locked
EDS hardpoints. No C42 mesh, topology, UV, texture, branding or exact surface
contour is copied, deformed, retopologized or exported.

## Evidence index

All images are actual Blender 5.2.2 renders.

- `evidence/c42-reference/`: 12 normalized C42 reference views.
- `evidence/eds-clay/`: 12 EDS clay/full-car/component views.
- `evidence/eds-reflective/`: 12 reflective surface-diagnostic views.
- `evidence/eds-wireframe/`: six selected EDS wireframe views.
- `evidence/comparison-sheets/`: 12 matched sheets. **C42 is left; EDS-G03 D1
  is right.** Filenames identify top, side, front, rear, both three-quarter
  views, cockpit, halo, nose/front wing, sidepod/inlet, floor/diffuser and
  suspension/wheels/brakes.
- `evidence/browser/`: headless Chrome WebGL screenshots and error report.

The required six whole-car sheets are:

- `evidence/comparison-sheets/c42-vs-eds-top.png`
- `evidence/comparison-sheets/c42-vs-eds-side.png`
- `evidence/comparison-sheets/c42-vs-eds-front.png`
- `evidence/comparison-sheets/c42-vs-eds-rear.png`
- `evidence/comparison-sheets/c42-vs-eds-front-three-quarter.png`
- `evidence/comparison-sheets/c42-vs-eds-rear-three-quarter.png`

## Measured result

| Metric                             |                 Target |                                                           Measured |
| ---------------------------------- | ---------------------: | -----------------------------------------------------------------: |
| Length                             |                5.050 m |                                                       5.04999995 m |
| Width                              |                2.000 m |                                                       2.00000000 m |
| Height ceiling                     |                1.180 m |                                                       1.17785287 m |
| Wheelbase                          |                3.600 m |                                     3.600 m (locked axle registry) |
| Front/rear axle Z                  |      -1.750 / +1.850 m |                                                          unchanged |
| Front/rear tyre radius             |        0.360 / 0.380 m |                                                          unchanged |
| Diffuser exit                      |                1.160 m |                                                             locked |
| Evaluated triangles                | 120k–220k review guide |                                                            141,768 |
| GLB bytes                          |   compact review asset |                                                          5,522,424 |
| GLB draw calls/material primitives |               minimize |                                                                 11 |
| Textures                           | texture-free preferred |                                                                  0 |
| SHA-256                            |          deterministic | `b14bae143e5e64ea52fa3564e05bba857a1a46ee8e20d58e6d2edcd4493fde1f` |

See `component-comparison.md` and `qa-report.md` for visual disposition,
limitations and the release decision.
