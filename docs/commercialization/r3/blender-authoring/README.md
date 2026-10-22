# Podium EDS — R3 Blender Authoring

Status: **SINGLE ACTIVE 3D AUTHORING DIRECTION — C42-REFERENCED RECONSTRUCTION D1**

Following repository consolidation and the non-negotiable model policy:
- **Primary 3D Reference**: `public/models/c42.v2.glb` (DEV-only proportion & presence benchmark).
- **Active 3D Reconstruction**: [`c42-reconstruction-d1/`](./c42-reconstruction-d1/)
- **Vehicle Development History**: [`docs/commercialization/vehicle-evolution/`](../../vehicle-evolution/)
- All earlier experimental EDS model revisions (clay gate, visual design resets, cockpit/nose experiments, prototype diffusers/halos) have been audited and rejected as reconstruction foundations.
- Active authoring workflow: **Existing C42 reference → Blender reconstruction → Original EDS design development → QA → Owner approval.**

---

## Active Reconstruction: EDS-G03 D1

The active authoring deliverables, validation scripts, and evidence are located in [`c42-reconstruction-d1/`](./c42-reconstruction-d1/):

- **Blender Source**: `c42-reconstruction-d1/EDS-G03-C42-Referenced-Reconstruction-D1.blend`
- **Review GLB**: `c42-reconstruction-d1/eds-g03-c42-reconstruction-d1.glb`
- **Authoring Script**: `scripts/blender/eds_g03_c42_reconstruction_d1.py`
- **Mesh Validation**: `scripts/blender/validate_eds_g03_c42_d1.py`
- **Three.js Validation**: `scripts/validate-eds-g03-c42-d1.mjs`
- **Contact Sheet Builder**: `scripts/create-eds-g03-c42-d1-sheets.mjs`

### Reproducible Generation

Run Blender 5.2.2 LTS from repository root:

```powershell
& 'E:\Formula 1\.tools\blender-5.2.2\blender-5.2.2-windows-x64\blender.exe' `
  --background --factory-startup `
  --python scripts/blender/eds_g03_c42_reconstruction_d1.py
node scripts/create-eds-g03-c42-d1-sheets.mjs
```

### Key Metrics Summary

| Metric | Target | Measured |
| --- | ---: | ---: |
| Overall Length | 5.050 m | 5.050 m |
| Overall Width | 2.000 m | 2.000 m |
| Overall Height | 1.180 m | 1.178 m |
| Wheelbase | 3.600 m | 3.600 m |
| Evaluated Triangles | 120k–220k review guide | 141,768 |
| Review GLB Bytes | Compact review asset | 5,522,424 |
| Draw Calls / Material Primitives | Minimize | 11 |
| Textures | Texture-free preferred | 0 |
| Deterministic SHA-256 | Deterministic export | `b14bae143e5e64ea52fa3564e05bba857a1a46ee8e20d58e6d2edcd4493fde1f` |

See [`c42-reconstruction-d1/README.md`](./c42-reconstruction-d1/README.md), [`component-comparison.md`](./c42-reconstruction-d1/component-comparison.md), and [`qa-report.md`](./c42-reconstruction-d1/qa-report.md) for full details.
