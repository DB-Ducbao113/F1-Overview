# R3.1 Revision 1 proportion measurements

Status: **OWNER GATE 1 REVIEW**. Baseline: `c182a66` (`R3.1-blockout-1`). Candidate:
`R3.1-revision-1`.

## Comparison methodology correction

Two distinct evidence sets are generated from the same six cameras:

- `physical-comparison-*.png` preserves the same world-space camera, target, 38 degree FOV,
  viewport and model transforms. It does not crop or normalize either vehicle.
- `comparison-*.png` measures the visible foreground bounds, crops each render with 10 px
  padding, assigns both crops 92% panel width and bottom-aligns them. The top view is centred
  because it has no meaningful ground line.

Foreground segmentation uses RGB distance 48 from the measured canvas-corner background and
requires at least eight active pixels per row/column. The numbers are comparative image extents,
not physical metrology. Physical dimensions come only from GLB accessors.

The original R3.1 camera was too close for the 5.05 m candidate: the side render touched both
canvas edges. Revision 1 moves the standardized cameras back for complete framing. The legacy
asset also retains its historical `0.105` DEV review scale, which is not a certified physical
C42 scale. Therefore physical-scale sheets document the viewer transforms; normalized sheets
are the appropriate evidence for silhouette shape alone.

### Final visible extents under the physical-scale cameras

| View                | Reference width | G03 width | G03 / reference | Normalization applied to G03 |
| ------------------- | --------------: | --------: | --------------: | ---------------------------: |
| Front three-quarter |          560 px |    668 px |           1.193 |                        0.838 |
| Side                |          636 px |    730 px |           1.148 |                        0.871 |
| Top                 |          606 px |    662 px |           1.092 |                        0.915 |
| Front               |          360 px |    504 px |           1.400 |                        0.714 |
| Rear                |          374 px |    438 px |           1.171 |                        0.854 |
| Rear three-quarter  |          582 px |    658 px |           1.131 |                        0.884 |

The large front-view difference is primarily width/shape plus the legacy review transform. It
must not be treated as evidence that the locked 2.00 m G03 width is wrong.

## Locked dimensions: before and after

| Parameter                |        Baseline |      Revision 1 | Change | Impact |
| ------------------------ | --------------: | --------------: | -----: | ------ |
| Overall length           |         5.050 m |         5.050 m |      0 | None   |
| Overall width            |         2.000 m |         2.000 m |      0 | None   |
| Overall height           |         1.180 m |         1.180 m |      0 | None   |
| Wheelbase                |         3.600 m |         3.600 m |      0 | None   |
| Front axle Z             |        -1.750 m |        -1.750 m |      0 | None   |
| Rear axle Z              |        +1.850 m |        +1.850 m |      0 | None   |
| Front / rear track       | 1.780 / 1.720 m | 1.780 / 1.720 m |      0 | None   |
| Front / rear tyre radius | 0.360 / 0.380 m | 0.360 / 0.380 m |      0 | None   |
| Front-wing envelope      |    2.000 m span |    2.000 m span |      0 | None   |
| Ground contact           |           Y = 0 |           Y = 0 |      0 | None   |

## Revised local hardpoints and envelopes

| Feature              | Baseline                                          | Revision 1                                    | Reason                                        | Locked-envelope impact                        |
| -------------------- | ------------------------------------------------- | --------------------------------------------- | --------------------------------------------- | --------------------------------------------- |
| Cockpit opening      | 0.52 m wide; sill Y 0.62                          | 0.48 m; sill Y 0.59                           | Better driver-cell scale                      | None                                          |
| Halo                 | max half-width 0.38 m; top Y 1.08                 | 0.30 m; top Y 0.94                            | Remove broad circular appearance              | Height remains set by rear wing               |
| Sidepod              | half-width 0.76 m; Y 0.20-0.73                    | 0.66 m; Y 0.22-0.63                           | Reduce capsule fullness; stronger waist/taper | Track and wheel clearances unchanged          |
| Sidepod inlet centre | X 0.51, Y 0.49, Z -0.43                           | X 0.46, Y 0.47, Z -0.38                       | Balance inlet against nose/cockpit            | No axle change                                |
| Floor                | start Z -1.35; max half-width 0.72; 0.045 m shell | Z -1.08; 0.68; 0.065 m shell plus edge bridge | Remove detached flat-plate reading            | Ground clearance and overall bounds unchanged |
| Rear wing            | 1.48 m span; endplate Y 0.70-1.18, Z 1.98-2.45    | 1.36 m; Y 0.82-1.18, Z 2.06-2.45              | Reduce rectangular visual mass                | Rear-most Z and total height unchanged        |
| Diffuser             | inlet/exit widths 1.18/1.32 m; exit Y 0.36        | 1.12/1.16 m; exit Y 0.34                      | Match narrower floor and rear body            | Rear overhang unchanged                       |

## Ratio reconciliation

The locked values imply:

- wheelbase / length = `3.60 / 5.05 = 0.712871`;
- width / length = `2.00 / 5.05 = 0.396040`;
- front/rear wheel diameter / length = `0.142574 / 0.150495`.

Earlier illustrative `0.63-0.66` wheelbase/length suggestions are incompatible with both locked
values. At 5.05 m they imply a 3.18-3.33 m wheelbase; at 3.60 m wheelbase they imply a
5.45-5.71 m vehicle. Revision 1 therefore keeps 0.712871 and corrects mass distribution inside
that envelope instead of changing hardpoints to imitate image scale.

## Measured candidate result

The exported GLB accessor bounds are exactly `[-1, 0, -2.6]` to `[1, 1.18, 2.45]`, or
`5.050 x 2.000 x 1.180 m`. Axles, track, tyres, wheel contact, symmetry and material/texture
counts match the registry. See `g03-dimensional-validation.json` for machine-readable evidence.
