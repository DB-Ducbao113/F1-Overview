# EDS-G03 R3.2 Revision 5 — Owner Gate 2 QA

Date: 2026-10-21. Branch: `Per-PEDS`. Starting commit:
`47fcfca54cc5a2208216af19c36806806ba8d415`. Target: DEV preview only;
no merge, production model swap or production release. Risk: **HIGH** (3D
topology and renderer-facing GLB). Owner authorized Option C implementation and
push to `Per-PEDS` including an automatic Preview, but has **not** approved
the resulting shape or commercial use.

## Change and measured geometry

| Measure | Revision 4 | Revision 5 | Result |
| --- | ---: | ---: | --- |
| Diffuser lower exit width | 1.019646 m | **1.160000 m** | Registry target 1.160 m |
| Lower channel Y at `X≈0.30, Z≈2.1` | 0.16703 m | 0.17654 m | sampled vertices |
| Lower channel Y at `X≈0.30, Z≈2.3` | 0.15836 m | 0.19236 m | terminal drop removed |
| Rear shell/halo MECHANICAL strict crossings | 96 | **0** | bounded test |
| BODY self-crossings at three feet | 0 | **0** | bounded test |
| BODY upper front support/arch crossings | not tested as same mesh | **140** | unresolved overlap |
| BODY open-boundary edges | 372 | 400 | +28 at upper front branch end |
| Sidepod sampled vertices retained | — | 1,502/1,502 | scoped preservation |
| Model triangles | 57,320 | 62,864 | +5,544 (+9.7%) |
| GLB bytes | 1,136,864 | 1,236,212 | +99,348 (+8.7%) |
| Draw calls / neutral materials / textures | 5 / 5 / 0 | 5 / 5 / 0 | unchanged |

Measured full bounds: **5.050 × 2.000 × 1.180 m**; wheelbase **3.600 m**.
Axle centres, tracks, wheel radii, ground contact, wing envelope, halo
registry controls and approved global hardpoints remain unchanged. Internal
validator reports 0 nonfinite values, 0 degenerates, 0 invalid vertex
normals and 0 normal/winding disagreements. The revised GLB SHA-256 is
`d083d75f2b76f825e58272412ea7925dd251385a5d97d76a917391a763211fde`.
Two consecutive exports produced that same hash.

## Executed QA

| Check | Status | Evidence |
| --- | --- | --- |
| `npm.cmd run lint` | PASS, exit 0 | no ESLint errors |
| `npx.cmd tsc --noEmit` | PASS, exit 0 | no TypeScript errors |
| `npm.cmd test` | PASS, exit 0 | 39 files / 281 tests; first run failed on the previous hard-coded revision label, then metadata assertion and hardpoint regression assertions were updated and full suite rerun |
| `npm.cmd run build` | PASS, exit 0 | 2,214 Vite modules; commercial isolation guard PASS, 28 Showroom modules and 108 artifact files scanned; G03 remains excluded from `dist` |
| `npm.cmd run asset:eds-g03:validate` | PASS, exit 0 | `g03-dimensional-validation.json` |
| Deterministic export / SHA-256 | PASS | two consecutive GLBs matched |
| Khronos glTF Validator 2.0.0-dev.3.10 | PASS, exit 0 | 0 errors / 0 warnings / 0 hints; `evidence/r3-2-revision-5/khronos-validation.json` |
| Independent bounded geometry inspection | PARTIAL / FAIL for full halo | 96→0 old rear inter-mesh crossings and 0 at all feet, but 140 at upper T-junction; `topology.json` |
| DEV Chrome WebGL screenshots | PASS for capture, NOT visual approval | 14 matched diffuse/reflective sheets, 5 wireframes, no page/console/local-request errors; `browser-report.json` |
| Physical device, exhaustive mesh collision and sustained GPU load | NOT TESTED | no physical device or exhaustive checker used |
| CI, Preview, production and data pipelines | PENDING / NOT APPLICABLE | this is a branch review candidate, not a production release; no production deployment was requested |

The initial `npm.cmd test` failure was a stale test expectation for Revision 4
metadata, not a geometry failure. The test was changed only to reflect the
new revision identifier while adding checks for all three unchanged halo
mount coordinates and the 1.160 m locked diffuser registry target. An initial
Prettier command exited 1 because it was also passed a Python file for which
there is no configured parser; a scoped supported-file check then passed.

## Visual and runtime assessment

The measured exit is wider and its terminal longitudinal channel profile
no longer falls, but the matched low-rear and underside WebGL views **still
do not clearly read as deep twin channels**. The upper tail and suspension
obscure the exit. The rear halo roots have no detached tube/shell intersections,
but their taper appears too triangular/abrupt in close-up. Sidepod appearance
is broadly unchanged in the matched views. No white patches, upside-down
faces, broken model load or browser exceptions were observed in these views.
These statements are limited to the captured viewpoints and are **not**
owner visual approval.

In the short local headless Chrome run, ANGLE reported Intel UHD Graphics
D3D11. DEV rendered triangles rose from 57,546 to 63,090 and remained at
7 renderer calls. Median/p95 RAF intervals were 16.7/16.8 ms both before and
after across 175 reported samples per page. This is VSync-limited,
headless, short-duration evidence; it is **not** a physical-device FPS or
thermal stability certificate. Runtime geometry/texture counters were 7/4
in both pages. The generated GLB itself has no textures.

## Defects and limitations

- **R3-G03-009, P2:** Numeric diffuser correction complete; visual twin-exit
  legibility remains below Gate 2 acceptance. See low-rear/underside sheets.
- **R3-G03-008, P2:** Three foot interfaces have stitched topology and 0
  strict local crossings, but the rear shoulder remains visually angular.
  The upper front strut/arch T-junction has 140 bounded strict crossings and
  a 28-edge intentional open branch end; a full integrated halo topology
  check cannot be marked PASS. See the halo sheets and `topology.json`.
- Intersections are strict edge/triangle results inside declared bounds;
  coplanar surfaces, containment, other assembly interfaces and the full
  scene were not exhaustively certified.
- Original model provenance is G03-authored only. C42 remains DEV-only and
  no rights claim for a third-party design is made.

## Evidence / reproduction

`evidence/r3-2-revision-5/` contains all before/after PNGs, targeted
wireframes, `diffuser-cross-sections.svg`, browser metrics, independent
topology and Khronos reports. The browser script serves the committed
Revision 4 GLB to the BEFORE page and the working GLB to the AFTER page
using the same renderer, viewport, FOV, camera preset and lighting.

Run the generator and local checks as follows (independent Python and
Khronos dependencies are installed outside this repository):

```powershell
npm.cmd run asset:eds-g03
npm.cmd run asset:eds-g03:validate
python scripts/inspect-g03-rev5.py
node scripts/validate-r3-rev5-glb.mjs
npm.cmd run qa:r3:continuity
```

**FINAL DECISION: HOLD / REVISE at OWNER GATE 2.** Technical checks do not
override the remaining visual defects or the upper halo overlap. No R3.3,
commercial model activation, merge or production deployment is authorized.
