# R3.1 Revision 1 EDS-G03 reference and dimensions

Status: **DEV REVIEW — OWNER GATE 1 REVISED**. Date: 2026-10-21. Branch: `Per-PEDS`.

## Reference boundary and authoring method

Detailed + EDS is used only to assess broad single-seater proportion quality: stance, wheel
spacing, nose/wing balance, cockpit location, sidepod fullness, engine-cover taper and floor
continuity. EDS-G03 is generated independently from
`scripts/eds-g03-design.mjs` and `scripts/generate-eds-g03.mjs`. The workflow does not read,
sample, deform, retopologize or transfer vertices, topology, UVs, textures or styling contours
from `c42.v2.glb`.

Blender and the Khronos glTF Validator CLI were not installed. The selected zero-cost workflow
is deterministic Node.js + Three.js parametric generation with a separate GLB parser/validator.
The GLB is editable by changing the versioned hardpoint registry and generator source, then
running:

```text
npm.cmd run asset:eds-g03
npm.cmd run asset:eds-g03:validate
```

## Coordinate and camera conventions

The native GLB uses metres, `+Y` up, `-Z` front, `+Z` rear and `X=0` as the centreline. The
existing legacy review viewer regards `+Z` as the visual front after its legacy transform, so
EDS-G03 is rotated exactly `π` radians around Y in the DEV viewer only. This does not alter the
GLB or its measured hardpoints.

The physical-scale comparisons use the same perspective camera, target, FOV, viewport, light rig
and canvas for both vehicles. The legacy asset retains its existing `0.105` review scale; G03 is
authored directly in metres. A separate normalized set crops measured visible bounds, assigns
equal apparent width and aligns the ground line. No C42 geometry or inferred C42 dimensions are
used. Full methodology and pixel extents are in `r3-1-revision-1-measurements.md`.

| View                | Camera position        | Target             |
| ------------------- | ---------------------- | ------------------ |
| Front three-quarter | `[4.80, 1.95, 4.85]`   | `[0, 0.42, 0]`     |
| Side                | `[7.20, 1.35, 0]`      | `[0, 0.38, 0]`     |
| Top                 | `[0.01, 7.80, 0]`      | `[0, 0.15, 0]`     |
| Front               | `[0, 0.95, 6.25]`      | `[0, 0.32, 0.75]`  |
| Rear                | `[0, 1.05, -6.25]`     | `[0, 0.38, -0.70]` |
| Rear three-quarter  | `[-4.80, 1.80, -4.80]` | `[0, 0.40, -0.35]` |

## Target versus measured GLB

Measurements come from the exported binary accessors, not generator constants alone.

| Parameter              |   Target | Measured | Difference | Result |
| ---------------------- | -------: | -------: | ---------: | ------ |
| Overall length         |  5.050 m |  5.050 m |    0.000 m | PASS   |
| Overall width          |  2.000 m |  2.000 m |    0.000 m | PASS   |
| Locked blockout height |  1.180 m |  1.180 m |    0.000 m | PASS   |
| Wheelbase              |  3.600 m |  3.600 m |    0.000 m | PASS   |
| Front axle Z           | −1.750 m | −1.750 m |    0.000 m | PASS   |
| Rear axle Z            | +1.850 m | +1.850 m |    0.000 m | PASS   |
| Front track            |  1.780 m |  1.780 m |    0.000 m | PASS   |
| Rear track             |  1.720 m |  1.720 m |    0.000 m | PASS   |
| Front tyre radius      |  0.360 m |  0.360 m |    0.000 m | PASS   |
| Rear tyre radius       |  0.380 m |  0.380 m |    0.000 m | PASS   |
| Front tyre width       |  0.220 m |  0.220 m |    0.000 m | PASS   |
| Rear tyre width        |  0.280 m |  0.280 m |    0.000 m | PASS   |
| Ground contact         |    Y = 0 |    Y = 0 |    0.000 m | PASS   |

Measured normalized ratios:

| Ratio                         | Measured |
| ----------------------------- | -------: |
| Wheelbase / length            | 0.712871 |
| Width / length                | 0.396040 |
| Front-wheel diameter / length | 0.142574 |
| Rear-wheel diameter / length  | 0.150495 |

No numerical inconsistency was observed within the R3.1 target tolerances. The machine-readable
source is `g03-hardpoints.json`; measured results are in `g03-dimensional-validation.json`.

## Broad visual assessment

- Wheel placement and long-wheelbase stance read coherently across side, top and three-quarter
  views. The larger rear tyre and narrower rear track remain visible.
- The nose-to-front-axle distance is plausible and the low nose connects continuously into the
  monocoque; its final sectional curvature is intentionally deferred to R3.2.
- Cockpit location remains fixed between the axles. The opening is 0.04 m narrower and the halo
  arch is 0.08 m narrower per side and 0.14 m lower than the rejected baseline.
- Sidepod maximum half-width fell from 0.76 m to 0.66 m. The intake, waist and rear taper are now
  distinct in top and three-quarter views. A separate floor-edge bridge establishes the undercut
  relationship without adding R3.2 surface detail.
- Front-wing span remains tied to the 2.00 m envelope. Rear-wing span fell from 1.48 m to 1.36 m
  and its endplate height/depth were reduced while preserving rear-most Z and total height.
- The exported blockout is intentionally neutral grey: five simple inspection materials, zero
  textures, skins, decals or detailed PBR treatment.

## Original G03 markers

1. Low split-keel nose with a shallow centre valley.
2. Crescent sidepod inlets with a falling outer shoulder.
3. Twin-ridge engine-cover taper around a compact airbox.
4. Forward-swept front-wing tips with clipped pentagonal endplates.
5. Tapered floor edge rising into a twin-channel diffuser envelope.

## Evidence

- `evidence/r3-1-blockout/comparison-front-three-quarter.png`
- `evidence/r3-1-blockout/comparison-side.png`
- `evidence/r3-1-blockout/comparison-top.png`
- `evidence/r3-1-blockout/comparison-front.png`
- `evidence/r3-1-blockout/comparison-rear.png`
- `evidence/r3-1-blockout/comparison-rear-three-quarter.png`
- `evidence/r3-1-blockout/silhouette-side-top-contact-sheet.png`
- `evidence/r3-1-blockout/physical-comparison-*.png` (six non-normalized camera views)

These are real local WebGL renders captured in headless Chrome at 1440×900. They are
qualitative review evidence, not proof of rights clearance or physical-device performance.
