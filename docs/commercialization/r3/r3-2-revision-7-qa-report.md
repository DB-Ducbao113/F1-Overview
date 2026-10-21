# R3.2 Revision 7 Phase B — Owner Gate 2 QA

Decision: **HOLD / REVISE**. The owner approved the *directions* Diffuser A and rear Halo B, not the resulting model. A reproducible integrated trial was built and measured, but it **fails the diffuser visual acceptance** and does not yet demonstrate a credible final Halo B transition. It was deliberately kept behind `EDS_G03_REV7_EXPERIMENT=1`; the existing `public/models/eds-g03-preview.glb` and default generator output remain Revision 6 byte-for-byte. There is no commercial activation, merge, push or deployment.

## Source and reproducibility

- Branch/baseline: `Per-PEDS` / `48ddf12818fc978b9b4d7d6ef649897f3e83ea10`.
- Revision 6 SHA-256: `ba04651b1f6f79971c8c69bc0667e7000b87f6d170b55614604c869831a2544f`. Default generator reproduction matched this exact hash.
- Selected Phase A GLBs: [Diffuser A](evidence/r3-2-revision-7-prototypes/diffuser-A-rounded.glb), SHA-256 `06b5a236b7946626523fc9175bb712017c08c5e8e07d18ee28724c8837157c6d`; [Halo B](evidence/r3-2-revision-7-prototypes/halo-B-boattail.glb), SHA-256 `3388961324046c2851175613a11324f0f469f56185a5aebd6b5d065c0036e4b0`.
- Phase A geometry source hash: `scripts/prototype-r3-rev7.py` SHA-256 `9658faf0cfa5d0c2c592b914e53c617b1605e1310a659a904ddcf887aa79d6de`.
- [Revision 7 experimental GLB](evidence/r3-2-revision-7/eds-g03-rev7-candidate.glb) SHA-256 `414330bb130614f720927dedac0536f96e8d9256e64dc0a066e16453f72e78ac`, 1,238,308 bytes. Two consecutive experimental exports matched this hash. Command: set `EDS_G03_REV7_EXPERIMENT=1`, then run `node scripts/generate-eds-g03.mjs docs/commercialization/r3/evidence/r3-2-revision-7/eds-g03-rev7-candidate.glb`.
- Changed architecture: selected A's paired roof idea was mapped to the existing continuous BODY underside, and selected B's narrow/long boat-tail field and lower bridge rise were applied to the existing stitched rear aperture. **These are derived integration trials, not exact topology transplantation.** The unchanged closed diffuser BODY ring prevents the open-bottom Prototype A from surviving integration. No third-party mesh/UV/texture/branding was used.
- Review-only source changes: `scripts/generate-eds-g03.mjs`, `scripts/validate-eds-g03.mjs`, `src/dev/GDRReview.ts`, Phase A/Phase B evidence generators and reports. Registry locks, G01/G02, commercial routes and production configuration are unchanged. Unrelated CI/Cloudflare/reference edits were preserved.

## Measured geometry, not visual approval

| Check | Revision 6 | Revision 7 trial | Interpretation |
|---|---:|---:|---|
| Overall L × W × H | 5.050 × 2.000 × 1.180 m | 5.050 × 2.000 × 1.180 m | Locked envelope PASS. |
| Wheelbase | 3.600 m | 3.600 m | PASS; axle, track, radius and ground-contact checks also passed. |
| Lower diffuser exit width | 1.160 m | 1.160 m | PASS numerically only. |
| Sampled minimum exit Y | 0.152364 m | 0.259913 m | Trial raised the outlet and visually flattened it. Ground clearance remains positive. |
| Roof sample at each `|x|≈0.30 m` | 0.152–0.180 m | 0.314–0.316 m | Measured pair exists but is occluded/plate-like from low rear. It is **not** a successfully open tunnel. |
| Individual channel aperture width/height; central splitter | Not an actual open aperture | **NOT MEASURABLE / FAIL** | No distinct open-bottom channel boundary/splitter exists in the integrated closed shell. Prototype A itself has a 0.060 m splitter, but the trial cannot claim to retain it. |
| BODY triangles / total rendered triangles | 33,464 / 62,992 | 33,464 / 62,992 | No polygon-count change; topology index buffer identical. |
| Material groups / textures / DEV draw calls | 5 / 0 / 5 | 5 / 0 / 5 | No material or draw-call regression in the measured DEV scene. |

Independent [integration measurements](evidence/r3-2-revision-7/integration-measurements.json): 0/276 corresponding sidepod-inlet vertices moved; 0/1,612 upper T vertices moved. Rear left/right fairings changed 262/1,739 sampled vertices per side (maximum 0.047037 m), symmetrically. The BODY triangle index array is unchanged. These finite boxes do not prove the entire sidepod or whole car unchanged. The registered three halo mount coordinates and centreline controls were not changed in source. The shape of the rear fairing was adjusted around them, but still fails visual review.

## Topology and independent validation

| Executed check | Observed result |
|---|---|
| Internal [dimensional/normal JSON](evidence/r3-2-revision-7/dimensional-validation.json) | PASS: locked bounds/axles/tracks/radii, finite geometry, 0 degenerates, 0 reversed normal/winding mismatches, 5 material groups and 0 textures. |
| Bounded [halo](evidence/r3-2-revision-7/halo-topology.json) and [diffuser](evidence/r3-2-revision-7/diffuser-topology.json) self-crossing tests | 0 strict crossings in each selected box; 0 nonfinite vertices, 0 degenerate triangles, consistent BODY winding. These are local tests, not whole-vehicle clearance. |
| Open boundaries | 372 BODY edges in each revision, **identical indexed edge sets**; 0 in the upper T test box. The 372 are inherited from Revision 6; exhaustive semantic classification of each inherited edge was NOT TESTED. No new indexed opening was created by this trial. |
| Rear BODY/mechanical inter-mesh box | 6,641 BODY triangles, 0 mechanical triangles, 0 AABB candidate pairs: **NOT TESTED for actual mechanical penetration** in this box, because there was no opposing surface to test. Whole-car inter-mesh collision: NOT TESTED. |
| [Khronos glTF Validator](evidence/r3-2-revision-7/khronos-validation.json) | PASS: version 2.0.0-dev.3.10, 0 errors, 0 warnings. |
| Default-generator rollback | PASS: default export exactly reproduced the Revision 6 SHA; the rejected trial requires the explicit DEV environment flag. |

## Matched visual evidence

The [browser report](evidence/r3-2-revision-7/browser-report.json) binds the final candidate SHA above to **27 real Chrome/WebGL comparison sheets**: 11 required cameras in diffuse and controlled reflective mode, plus wireframes for five targeted areas. Baseline/candidate camera, FOV 38, model transform, 900×650 canvas, lighting and mode are identical within each sheet. No page, console or failed-request error was recorded.

| View | Diffuse | Reflective | Wireframe |
|---|---|---|---|
| Full front three-quarter | [PNG](evidence/r3-2-revision-7/full-front-three-quarter-diffuse.png) | [PNG](evidence/r3-2-revision-7/full-front-three-quarter-reflective.png) | — |
| Full side | [PNG](evidence/r3-2-revision-7/full-side-diffuse.png) | [PNG](evidence/r3-2-revision-7/full-side-reflective.png) | — |
| Full rear three-quarter | [PNG](evidence/r3-2-revision-7/full-rear-three-quarter-diffuse.png) | [PNG](evidence/r3-2-revision-7/full-rear-three-quarter-reflective.png) | — |
| Diffuser low rear | [PNG](evidence/r3-2-revision-7/diffuser-low-rear-diffuse.png) | [PNG](evidence/r3-2-revision-7/diffuser-low-rear-reflective.png) | [PNG](evidence/r3-2-revision-7/diffuser-low-rear-wireframe.png) |
| Diffuser underside | [PNG](evidence/r3-2-revision-7/diffuser-underside-diffuse.png) | [PNG](evidence/r3-2-revision-7/diffuser-underside-reflective.png) | [PNG](evidence/r3-2-revision-7/diffuser-underside-wireframe.png) |
| Diffuser outlet | [PNG](evidence/r3-2-revision-7/diffuser-outlet-diffuse.png) | [PNG](evidence/r3-2-revision-7/diffuser-outlet-reflective.png) | — |
| Halo front | [PNG](evidence/r3-2-revision-7/halo-front-mount-diffuse.png) | [PNG](evidence/r3-2-revision-7/halo-front-mount-reflective.png) | — |
| Halo rear left | [PNG](evidence/r3-2-revision-7/halo-rear-left-diffuse.png) | [PNG](evidence/r3-2-revision-7/halo-rear-left-reflective.png) | [PNG](evidence/r3-2-revision-7/halo-rear-left-wireframe.png) |
| Halo rear right | [PNG](evidence/r3-2-revision-7/halo-rear-right-diffuse.png) | [PNG](evidence/r3-2-revision-7/halo-rear-right-reflective.png) | [PNG](evidence/r3-2-revision-7/halo-rear-right-wireframe.png) |
| Halo upper T | [PNG](evidence/r3-2-revision-7/halo-upper-t-diffuse.png) | [PNG](evidence/r3-2-revision-7/halo-upper-t-reflective.png) | [PNG](evidence/r3-2-revision-7/halo-upper-t-wireframe.png) |
| Sidepod regression | [PNG](evidence/r3-2-revision-7/sidepod-regression-diffuse.png) | [PNG](evidence/r3-2-revision-7/sidepod-regression-reflective.png) | — |

[Diffuser exit cross-sections](evidence/r3-2-revision-7/diffuser-cross-sections.svg) explicitly compare Revision 6, the approved isolated Prototype A and this integrated attempt. The low-rear and outlet images show a flat shelf and loss of the prototype's open-channel visual. Halo rear images show a reduced but still noticeable steep tube shoulder. The sidepod and upper T comparison views show no observed regression, consistent with the sampled vertex checks. **Visual status: diffuser FAIL; halo REVISE; owner approval PENDING.**

## Software, runtime, performance and release status

- `npm.cmd run lint`: PASS, exit 0.
- `npx.cmd tsc --noEmit`: PASS, exit 0.
- `npm.cmd test`: PASS, 39 files / 281 tests, exit 0. No test was weakened to obtain a pass; the candidate's visual failure is not represented as a unit-test success.
- `npm.cmd run build`: PASS, exit 0. Includes commercial asset pruning and isolation: 14 legacy and 2 review targets removed from `dist`, 28 Showroom source modules / 108 artifact files scanned. G03 and C42 remain excluded from commercial output.
- Browser: headless Chrome on ANGLE/Intel UHD Graphics (D3D11). Both models: 5 draw calls, 62,992 triangles, 5 renderer geometries, 0 viewer textures. A one-off static-scene 90-sample `requestAnimationFrame` interval gave baseline median/p95 16.7/16.8 ms and candidate 16.7/16.8 ms. This samples scheduling, **not independent GPU render time or sustained performance**. Physical device, sustained GPU frame time, context-loss recovery and full mobile-device testing: NOT TESTED.
- GitHub Actions, both production data pipelines, Preview and production smoke: NOT RUN / NOT APPLICABLE to this local, non-release trial. No deployment approval is inferred from a local build.

**Final recommendation: HOLD / REVISE at Owner Gate 2.** The next technical work, only if authorized, is a true indexed local diffuser cut/replacement that carries Prototype A's open-bottom M-section into the floor boundary, and a rear-only Halo B topology replacement that stitches to the frozen shell without altering the upper T. Do not adopt this experiment as the preview default, start R3.3 or approve commercial use.
