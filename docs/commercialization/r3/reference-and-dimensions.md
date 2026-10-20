# R3.1 EDS-G03 reference and dimensions

Status: **DEV REVIEW — OWNER GATE 1**. Date: 2026-10-20. Branch: `Per-PEDS`.

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

The six comparisons use the same perspective camera, target, FOV, viewport, light rig and canvas
for both vehicles. The legacy asset retains its existing `0.105` review scale; G03 is authored
directly in metres. No pixel-outline matching or C42 dimension inference is used.

| View                | Camera position        | Target             |
| ------------------- | ---------------------- | ------------------ |
| Front three-quarter | `[4.10, 1.70, 4.15]`   | `[0, 0.42, 0]`     |
| Side                | `[5.45, 1.15, 0]`      | `[0, 0.38, 0]`     |
| Top                 | `[0.01, 6.70, 0]`      | `[0, 0.15, 0]`     |
| Front               | `[0, 0.82, 5.25]`      | `[0, 0.32, 0.75]`  |
| Rear                | `[0, 0.94, -5.25]`     | `[0, 0.38, -0.70]` |
| Rear three-quarter  | `[-4.15, 1.55, -4.10]` | `[0, 0.40, -0.35]` |

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
- Cockpit location is balanced between the axles. The halo envelope is readable but visually
  oversized from the front and remains an owner-review item.
- Sidepod volume is now lower and the floor tapers from the nose/monocoque rather than appearing
  as a full-width rectangle. The undercut and body-to-floor junction remain coarse blockout
  surfaces.
- Front-wing span is tied to the 2.00 m envelope and clears the front tyre leading plane by
  0.09 m. The rear wing fits the rear overhang but its endplates still dominate the rear view.
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

These are real local WebGL renders captured in headless Chrome at 1440×900. They are
qualitative review evidence, not proof of rights clearance or physical-device performance.
