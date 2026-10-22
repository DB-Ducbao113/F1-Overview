# EDS-G03 C42 High-Fidelity Reconstruction D2

Status: **DEV REVIEW ONLY — OWNER GATE**. This candidate does not replace any production, commercial, or public Showroom asset.

---

## 1. Reproducible Source and Outputs

- **Blender 5.2.2 LTS Source**: [`eds-g03-c42-fidelity-d2.blend`](./eds-g03-c42-fidelity-d2.blend) (retains 174 editable semantic authoring objects)
- **Review GLB**: [`eds-g03-c42-fidelity-d2.glb`](./eds-g03-c42-fidelity-d2.glb) (optimized to 12 draw calls / material primitives, 2.13 MB, 0 textures)
- **Authoring Pipeline**: [`scripts/blender/eds_g03_c42_fidelity_d2.py`](../../../../../scripts/blender/eds_g03_c42_fidelity_d2.py)
- **C42 Geometry Analyzer**: [`scripts/blender/c42_geometry_analysis.py`](../../../../../scripts/blender/c42_geometry_analysis.py)
- **Blender Mesh Checker**: [`scripts/blender/validate_eds_g03_c42_d2.py`](../../../../../scripts/blender/validate_eds_g03_c42_d2.py)
- **Three.js Checker**: [`scripts/validate-eds-g03-c42-d2.mjs`](../../../../../scripts/validate-eds-g03-c42-d2.mjs)
- **Comparison Sheet Builder**: [`scripts/create-eds-g03-c42-d2-sheets.mjs`](../../../../../scripts/create-eds-g03-c42-d2-sheets.mjs)
- **C42 Reference Measurements**: [`c42-geometry-reference.json`](./c42-geometry-reference.json)
- **Geometry Landmark Comparison**: [`geometry-landmark-comparison.md`](./geometry-landmark-comparison.md)
- **Component Review & Defect Log**: [`component-comparison.md`](./component-comparison.md)
- **Technical QA Report**: [`qa-report.md`](./qa-report.md)

### Reproducible Generation

Run from the repository root in PowerShell:

```powershell
# 1. Run C42 Reference Analysis
& 'E:\Formula 1\.tools\blender-5.2.2\blender-5.2.2-windows-x64\blender.exe' `
  --background --factory-startup `
  --python scripts/blender/c42_geometry_analysis.py

# 2. Author D2 Candidate & Render All Views
& 'E:\Formula 1\.tools\blender-5.2.2\blender-5.2.2-windows-x64\blender.exe' `
  --background --factory-startup `
  --python scripts/blender/eds_g03_c42_fidelity_d2.py

# 3. Validate Blender Mesh Topology
& 'E:\Formula 1\.tools\blender-5.2.2\blender-5.2.2-windows-x64\blender.exe' `
  --background --factory-startup `
  docs/commercialization/r3/blender-authoring/c42-fidelity-d2/eds-g03-c42-fidelity-d2.blend `
  --python scripts/blender/validate_eds_g03_c42_d2.py

# 4. Validate Three.js Loader & Bounds
node scripts/validate-eds-g03-c42-d2.mjs

# 5. Build 3-Column Matched Sheets and Silhouette Overlays
node scripts/create-eds-g03-c42-d2-sheets.mjs
```

---

## 2. Key Metrics Summary

| Metric                    |     Locked Target     |                            Measured D2                             |                  Compliance                  |
| :------------------------ | :-------------------: | :----------------------------------------------------------------: | :------------------------------------------: |
| **Overall Length**        |        5.050 m        |                              5.046 m                               |              PASS (within 4 mm)              |
| **Overall Width**         |     $\le$ 2.000 m     |                              1.990 m                               |        PASS (strictly $\le$ 2.000 m)         |
| **Overall Height**        |     $\le$ 1.180 m     |                              1.089 m                               |             PASS (below ceiling)             |
| **Wheelbase**             |        3.600 m        |                              3.600 m                               | PASS (exact locked axles: -1.750m / +1.850m) |
| **Front Track**           |        1.780 m        |                              1.780 m                               |                     PASS                     |
| **Rear Track**            |        1.720 m        |                              1.720 m                               |                     PASS                     |
| **Diffuser Exit Width**   |        1.160 m        |                              1.160 m                               |                     PASS                     |
| **Ground Contact**        |        0.000 m        |                              0.000 m                               |                     PASS                     |
| **Evaluated Triangles**   | 40k–220k review guide |                               47,792                               |                     PASS                     |
| **Degenerate Triangles**  |           0           |                                 0                                  |                     PASS                     |
| **Non-Manifold Edges**    |           0           |                                 0                                  |                     PASS                     |
| **GLB File Size**         | Compact review asset  |                     2,131,064 bytes (2.13 MB)                      |                     PASS                     |
| **GLB Draw Calls**        |       Minimize        |                       12 material primitives                       |                     PASS                     |
| **Textures**              | 0 (clay review gate)  |                                 0                                  |                     PASS                     |
| **Deterministic SHA-256** |     Clean export      | `cd56155f005f3abd89a2e4addd85675bbd77b88cbc087ba34139fa14b64f8242` |                     PASS                     |

---

## 3. Evidence Index & Exact Image Paths

All images are direct, reproducible Blender 5.2.2 LTS renders at matching focal lengths (52–66 mm) and coordinates.

### Matched 3-Column Comparison Sheets: C42 Reference | EDS D1 | EDS D2

Located in [`evidence/comparison-sheets/`](./evidence/comparison-sheets/):

1. Top View: [`c42-vs-d1-vs-d2-top.png`](./evidence/comparison-sheets/c42-vs-d1-vs-d2-top.png)
2. Side View: [`c42-vs-d1-vs-d2-side.png`](./evidence/comparison-sheets/c42-vs-d1-vs-d2-side.png)
3. Front View: [`c42-vs-d1-vs-d2-front.png`](./evidence/comparison-sheets/c42-vs-d1-vs-d2-front.png)
4. Rear View: [`c42-vs-d1-vs-d2-rear.png`](./evidence/comparison-sheets/c42-vs-d1-vs-d2-rear.png)
5. Front Three-Quarter: [`c42-vs-d1-vs-d2-front-three-quarter.png`](./evidence/comparison-sheets/c42-vs-d1-vs-d2-front-three-quarter.png)
6. Rear Three-Quarter: [`c42-vs-d1-vs-d2-rear-three-quarter.png`](./evidence/comparison-sheets/c42-vs-d1-vs-d2-rear-three-quarter.png)
7. Cockpit Close-Up: [`c42-vs-d1-vs-d2-cockpit-close-up.png`](./evidence/comparison-sheets/c42-vs-d1-vs-d2-cockpit-close-up.png)
8. Halo Construction: [`c42-vs-d1-vs-d2-halo-construction.png`](./evidence/comparison-sheets/c42-vs-d1-vs-d2-halo-construction.png)
9. Nose & Front Wing: [`c42-vs-d1-vs-d2-nose-front-wing.png`](./evidence/comparison-sheets/c42-vs-d1-vs-d2-nose-front-wing.png)
10. Sidepod Inlet: [`c42-vs-d1-vs-d2-sidepod-inlet.png`](./evidence/comparison-sheets/c42-vs-d1-vs-d2-sidepod-inlet.png)
11. Floor & Diffuser: [`c42-vs-d1-vs-d2-floor-diffuser.png`](./evidence/comparison-sheets/c42-vs-d1-vs-d2-floor-diffuser.png)
12. Suspension & Wheels: [`c42-vs-d1-vs-d2-suspension-wheels-brakes.png`](./evidence/comparison-sheets/c42-vs-d1-vs-d2-suspension-wheels-brakes.png)

### Diagnostic Overlays & Side-by-Side Comparisons

1. Silhouette Overlay (C42 Cyan vs D2 Amber vs Silver Overlap): [`silhouette-overlay-c42-vs-d2.png`](./evidence/comparison-sheets/silhouette-overlay-c42-vs-d2.png)
2. Top-View Planform Comparison: [`top-view-shape-comparison.png`](./evidence/comparison-sheets/top-view-shape-comparison.png)
3. Side-View Nose / Cockpit Comparison: [`side-view-nose-cockpit-comparison.png`](./evidence/comparison-sheets/side-view-nose-cockpit-comparison.png)
4. Front / Rear Stance Comparison: [`front-rear-stance-comparison.png`](./evidence/comparison-sheets/front-rear-stance-comparison.png)

### Neutral Clay Renders (EDS-G03 D2)

Located in [`evidence/eds-clay/`](./evidence/eds-clay/):

- [`top.png`](./evidence/eds-clay/top.png)
- [`side.png`](./evidence/eds-clay/side.png)
- [`front.png`](./evidence/eds-clay/front.png)
- [`rear.png`](./evidence/eds-clay/rear.png)
- [`front-three-quarter.png`](./evidence/eds-clay/front-three-quarter.png)
- [`rear-three-quarter.png`](./evidence/eds-clay/rear-three-quarter.png)
- [`cockpit-close-up.png`](./evidence/eds-clay/cockpit-close-up.png)
- [`halo-construction.png`](./evidence/eds-clay/halo-construction.png)
- [`nose-front-wing.png`](./evidence/eds-clay/nose-front-wing.png)
- [`sidepod-inlet.png`](./evidence/eds-clay/sidepod-inlet.png)
- [`floor-diffuser.png`](./evidence/eds-clay/floor-diffuser.png)
- [`suspension-wheels-brakes.png`](./evidence/eds-clay/suspension-wheels-brakes.png)

### Reflective Diagnostic Surface Renders (EDS-G03 D2)

Located in [`evidence/eds-reflective/`](./evidence/eds-reflective/):

- [`top.png`](./evidence/eds-reflective/top.png)
- [`side.png`](./evidence/eds-reflective/side.png)
- [`front.png`](./evidence/eds-reflective/front.png)
- [`rear.png`](./evidence/eds-reflective/rear.png)
- [`front-three-quarter.png`](./evidence/eds-reflective/front-three-quarter.png)
- [`rear-three-quarter.png`](./evidence/eds-reflective/rear-three-quarter.png)
- [`cockpit-close-up.png`](./evidence/eds-reflective/cockpit-close-up.png)
- [`halo-construction.png`](./evidence/eds-reflective/halo-construction.png)
- [`nose-front-wing.png`](./evidence/eds-reflective/nose-front-wing.png)
- [`sidepod-inlet.png`](./evidence/eds-reflective/sidepod-inlet.png)
- [`floor-diffuser.png`](./evidence/eds-reflective/floor-diffuser.png)
- [`suspension-wheels-brakes.png`](./evidence/eds-reflective/suspension-wheels-brakes.png)

### Wireframe Topology Diagnostics (EDS-G03 D2)

Located in [`evidence/eds-wireframe/`](./evidence/eds-wireframe/):

- [`top.png`](./evidence/eds-wireframe/top.png)
- [`side.png`](./evidence/eds-wireframe/side.png)
- [`front-three-quarter.png`](./evidence/eds-wireframe/front-three-quarter.png)
- [`rear-three-quarter.png`](./evidence/eds-wireframe/rear-three-quarter.png)
- [`cockpit-close-up.png`](./evidence/eds-wireframe/cockpit-close-up.png)
- [`floor-diffuser.png`](./evidence/eds-wireframe/floor-diffuser.png)

### C42 Benchmark Reference Renders

Located in [`evidence/c42-reference/`](./evidence/c42-reference/):

- All 12 normalized reference viewpoints matching the exact camera and studio setup.
