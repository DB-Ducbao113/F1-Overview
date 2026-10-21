# R3.2 Revision 7 — Prototype Design Gate

Status: **HOLD — owner selection required**. Baseline: `48ddf12818fc978b9b4d7d6ef649897f3e83ea10` on `Per-PEDS`. This is Phase A only. The integrated EDS-G03 GLB was not changed; its SHA-256 remains `ba04651b1f6f79971c8c69bc0667e7000b87f6d170b55614604c869831a2544f`. No main, production, commercial G01, accepted sidepod or upper halo T-junction change was made.

## Design comparison

| Region | A | B | Recommendation for owner selection |
|---|---|---|---|
| Diffuser | Rounded parallel-channel roof, 60 mm center splitter, fuller outlet height. Clearer two-channel reading in low-rear diffuse view, but the isolated vertical outer walls look too tall and still need a body/floor transition. | Flared channel with flatter roof and angular bevel. More restrained profile, but two outlets read flatter and less distinct. | **A**, conditional on narrowing/connecting the exposed outer-wall transition in Phase B without changing the locked outlet width. |
| Rear halo | Symmetric wide oval saddle. Smooth tube transition, but broad crop reads like a separate pad before shell stitching. | Narrower, longer asymmetric boat-tail. More directional, lower-profile visual and less pedestal-like in side view. Its open perimeter remains conspicuous as an isolated specimen. | **B**, conditional on direct boundary stitching to the survival cell; never add it as a floating overlay. |

Both diffuser options have an actual M-section, two roofed outlet channels, and an open lower passage. Their measured lower exit width at `z=+2.300 m` is **1.160 m** (`x=-0.580…+0.580 m`). A bounds: `x ±0.580, y 0.120…0.356, z 1.500…2.300 m`; B bounds: `x ±0.580, y 0.130…0.330, z 1.500…2.300 m`. Thus both stay inside the approved full-car envelope, but their local mating with the accepted floor has **not** been proven. [Cross-section diagram](evidence/r3-2-revision-7-prototypes/diffuser-exit-profiles.svg).

Both halo options are individually connected annulus-to-tube meshes, not overlapping tube plus cosmetic pad meshes. They are placed at the locked rear mount centers `(±0.260, 0.660, 0.120) m` and remain inside the full-car envelope. The *outer crop* and *upper tube tip* are deliberately open prototype boundaries. They are **not yet stitched to the real survival-cell shell or arch**. The crop edge visible in images is not evidence of a full-vehicle seam, but also cannot establish full-vehicle continuity. No claim of zero integrated crossings is made.

## Matched WebGL evidence

All sheets show baseline/A/B side by side under the same per-view camera, FOV 38, 900×650 panel viewport and lighting. The baseline is a cropped region of Revision 6, so its jagged exterior crop boundary is not a full-car defect. Diffuse mode uses lit Lambert shading; reflective mode uses controlled studio material. Wireframe is diagnostic, not a visual-quality substitute.

| View | Diffuse | Reflective | Wireframe |
|---|---|---|---|
| Diffuser low rear | [PNG](evidence/r3-2-revision-7-prototypes/diffuser-rear-diffuse.png) | [PNG](evidence/r3-2-revision-7-prototypes/diffuser-rear-reflective.png) | [PNG](evidence/r3-2-revision-7-prototypes/diffuser-rear-wireframe.png) |
| Diffuser underside | [PNG](evidence/r3-2-revision-7-prototypes/diffuser-under-diffuse.png) | [PNG](evidence/r3-2-revision-7-prototypes/diffuser-under-reflective.png) | [PNG](evidence/r3-2-revision-7-prototypes/diffuser-under-wireframe.png) |
| Rear halo three-quarter | [PNG](evidence/r3-2-revision-7-prototypes/halo-rear-diffuse.png) | [PNG](evidence/r3-2-revision-7-prototypes/halo-rear-reflective.png) | [PNG](evidence/r3-2-revision-7-prototypes/halo-rear-wireframe.png) |
| Rear halo side | [PNG](evidence/r3-2-revision-7-prototypes/halo-side-diffuse.png) | [PNG](evidence/r3-2-revision-7-prototypes/halo-side-reflective.png) | [PNG](evidence/r3-2-revision-7-prototypes/halo-side-wireframe.png) |

The four review-only prototype GLBs, baseline crops, measured [geometry JSON](evidence/r3-2-revision-7-prototypes/geometry.json), [independent topology JSON](evidence/r3-2-revision-7-prototypes/independent-topology.json), four `*-khronos.json` reports and [browser capture report](evidence/r3-2-revision-7-prototypes/browser-report.json) are in the same evidence directory. Reproducible source: `scripts/prototype-r3-rev7.py`, `scripts/inspect-r3-rev7-prototypes.py`, `scripts/plot-r3-rev7-sections.mjs`, `scripts/capture-r3-rev7-prototypes.mjs`, and the DEV-only `src/dev/GDRReview.ts` camera additions. Geometry is original procedural/local-authored work; no C42 mesh, UV, texture, logo or branding was used.

## Phase A QA — actual results

| Check | Result |
|---|---|
| ESLint / TypeScript | PASS — `npm.cmd run lint` / `npx.cmd tsc --noEmit`, exit 0 each. |
| Full unit tests | PASS — `npm.cmd test`, 39 files / 281 tests, exit 0. |
| Production build / commercial isolation | PASS — `npm.cmd run build`, exit 0; commercial guard removed review-only targets from `dist` and scanned 28 source modules / 108 artifact files. This does **not** authorize deployment. |
| Prototype determinism | PASS — two successive exports gave matching SHA-256 for all four candidate GLBs. Diffuser A `06b5a236b7946626523fc9175bb712017c08c5e8e07d18ee28724c8837157c6d`, B `e978711d4f1119a21d16ae0b88847bd2f80699a9888fe36d3aa310f87fc26d99`; halo A `bcf325a0cad7bec41c770ea26947729ab5cd40bf1664f4d43b5750f208e47bde`, B `3388961324046c2851175613a11324f0f469f56185a5aebd6b5d065c0036e4b0`. |
| Independent local topology | PASS for isolated specimens — finite vertices, zero degenerate triangles, consistent winding, zero *strict* self-crossings in bounded checks, zero unclassified open edges. Intentional open crop edges: 220 per diffuser, 112 per halo side. Diffuser underside median normal Y: A -0.982, B -0.986. |
| Khronos glTF Validator | PASS — all four candidates: zero errors, warnings or infos; 2–3 advisory bufferView-target hints per file. |
| DEV Chrome/WebGL evidence | PASS for capture — 12 sheets rendered, no recorded browser errors; fixed camera/light per comparison. |
| Integration collisions, locked full-model validation, full-car visual regression | **NOT TESTED** — no integration authorized. |
| Physical device, sustained GPU/frame time, Preview/production smoke | **NOT TESTED / NOT APPLICABLE** at this gate. |

## Open defects and decision

- `R7-P01` (P2): Isolated diffuser A outer side walls look high and potentially slab-like; physical blend into accepted floor is unverified. Integration must not merely overlay the current floor.
- `R7-P02` (P2): Both halo specimens show open outer crop perimeters and open top tips. Their shape is promising, but mechanical continuity into the survival cell and preserved arch is unverified. The current side view can still read as a separate plate until stitched.
- `R7-P03` (P2): No matched full-car BEFORE/AFTER image exists because the owner explicitly prohibited automatic integration.

**Decision: HOLD at Prototype Design Gate.** Recommended for further work: diffuser **A** and halo **B**, with the limitations above. Owner must explicitly choose one option per region (or request revised prototypes) before any Phase B integration. R3.3, production activation, merge, deployment and push were not performed.
