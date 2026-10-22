# Environment and authoring architecture

## Pinned environment

| Tool                       | Verified version                              |
| -------------------------- | --------------------------------------------- |
| Blender portable           | 5.2.2 LTS, build `d13f752e3b9c`               |
| Blender bundled Python     | 3.13.13                                       |
| Blender glTF exporter      | bundled `io_scene_gltf2`; GLB export executed |
| Node                       | 24.21.0                                       |
| npm                        | 11.19.0                                       |
| Host Python                | 3.14.7                                        |
| Khronos glTF Validator     | 2.0.0-dev.3.10                                |
| Independent topology tools | trimesh 5.1.1, numpy 2.5.4, rtree 1.4.1       |

Blender was not installed system-wide. The official Windows x64 portable ZIP
was downloaded from the [Blender 5.2 release directory](https://download.blender.org/release/Blender5.2/)
and extracted outside the repository under `E:\Formula 1\.tools`. ZIP SHA-256:
`3849d17a682cba006075aaa3f3597ecb5c9c30ec31035b2e092c53e40679b535`,
matching Blender's published checksum. Blender identifies 5.2.2 as an LTS
release; no administrator or system-level installation was used.

The background save emitted a non-fatal thumbnail-cache warning for a malformed
temporary Unicode path. The `.blend`, GLB and all requested renders were written
successfully; this warning is retained as an environment limitation.

## Scene architecture

The `.blend` contains the required independent collections:

1. `00_REFERENCE_CONTROLS`
2. `01_MONOCOQUE_NOSE`
3. `02_COCKPIT_HALO`
4. `03_SIDEPODS_ENGINE_COVER`
5. `04_FRONT_WING`
6. `05_REAR_WING`
7. `06_FLOOR_DIFFUSER`
8. `07_WHEELS_TYRES`
9. `08_SUSPENSION_BRAKES`
10. `09_MATERIALS`
11. `10_LOD_EXPORTS`

Source units are metres. Project coordinates are `+Y` up, `-Z` forward and
`+Z` rearward. Blender source coordinates use `X = project X`,
`Y = -project Z`, `Z = project Y`; the glTF exporter returns a Y-up asset.
Hardpoint empties retain their project coordinates as custom properties.

Primary volume is authored as original longitudinal superellipse lofts.
Secondary structures use controlled airfoil grids, Bezier tube sweeps, explicit
open inlet ducts, a variable-section floor/diffuser mesh, separate brake/rim/
tyre geometry and mechanical suspension links. These semantic objects remain
independently editable; they were not joined merely to hide intersections.

`scripts/blender/eds_g03_clay_authoring.py` is the reproducible source of truth.
`scripts/inspect-eds-g03-blender.py`, `scripts/capture-eds-g03-blender-clay.mjs`
and `scripts/benchmark-eds-g03-blender.mjs` provide independent inspection,
matched browser evidence and limited lab performance evidence.
