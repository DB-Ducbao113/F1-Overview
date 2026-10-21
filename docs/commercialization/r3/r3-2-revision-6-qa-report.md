# EDS-G03 R3.2 Revision 6 — Owner Gate 2 QA

Date: 2026-10-21. Branch: `Per-PEDS`. Baseline:
`ff29e5ae526ddc1df6034861987e112a63e5cc70`. This is a DEV-only,
original EDS-G03 candidate; it is **not production-approved**. The existing
commercial Showroom model, Results Engine and production configuration were
not changed. Owner has authorized a push to `Per-PEDS` and its automatic
Preview, not a merge or production deployment.

## Change and measured result

- The rear halo arch has a local cut aperture. The front support terminates
  in an indexed, stitched transition to that aperture. No independent tube
  overlaps at the upper T. Three mount coordinates, the approved centreline
  controls, wheel placement and all dimension locks are unchanged.
- The paired diffuser terminal profile is broadened and deepened locally;
  the surrounding body/floor source is unchanged. Its lower exit measures
  **1.160 m** and the candidate minimum trailing clearance is **0.152364 m**
  versus **0.192363 m** in Revision 5. The visual result remains insufficient
  in the unobstructed low-rear full-car view.
- GLB SHA-256: `ba04651b1f6f79971c8c69bc0667e7000b87f6d170b55614604c869831a2544f`;
  1,238,204 bytes, 62,992 triangles, 5 neutral material groups, 0 textures.
  Revision 5: 1,236,212 bytes, 62,864 triangles. The 128-triangle increase
  makes the upper T a shared junction rather than a crossing.
- Two successive exports after final metadata changes produced the same SHA-256
  (determinism PASS). The generated dimensional registry reports
  **5.050 × 2.000 × 1.180 m**, wheelbase **3.600 m**, and all internal lock,
  normal and degenerate checks PASS.

## Prototype gate before integration

The isolated `halo-prototype.glb` and `diffuser-prototype.glb` were exported
before the integrated GLB was overwritten. Both passed independent bounded
triangle-crossing (0), consistent winding, nonfinite (0), degenerate (0),
and Khronos glTF Validator (0 errors, 0 warnings) checks. Cropped prototype
outer edges are intentional inspection boundaries. The halo prototype has
no open edge in its upper T test box. Matched diffuse, controlled reflective,
and wireframe images are in `evidence/r3-2-revision-6/`.

## Independent topology and commercial QA

| Check | Baseline | Candidate | Result |
|---|---:|---:|---|
| Bounded BODY strict intersections (halo/floor zones) | 140 | 0 | PASS in tested bounds |
| Upper halo T strict intersections | 140 | 0 | PASS in tested bounds |
| BODY open edges | 400 | 372 | Former free top tip closed; remaining open edges need classification |
| Rear BODY/mechanical strict intersections | 0 | 0 | PASS in tested bounds; 0 candidate AABB pairs |
| Diffuser strict intersections | 0 | 0 | PASS in tested bounds |
| BODY winding / degenerates | consistent / 0 | consistent / 0 | PASS |
| Sidepod unique baseline vertices missing | — | 0 of 1,502 | PASS |
| Khronos glTF Validator 2.0.0-dev.3.10 | — | 0 errors, 0 warnings | PASS |
| Production build asset isolation | — | 14 legacy + 2 review targets pruned; 108 artifacts scanned | PASS |

The triangle test is an exact bounded edge/triangle crossing test; it does
not certify every coplanar overlap, enclosed volume, or every inter-mesh
collision. The rear BODY/mechanical test had no candidate AABB pair to
intersect in its selected box. These limits are not silently upgraded to
global PASS.

## Executed software checks

| Check | Observed result |
|---|---|
| `npm.cmd run lint` | PASS, exit 0 |
| `npx.cmd tsc --noEmit` | PASS, exit 0 |
| `npm.cmd test` | PASS, 39 files / 281 tests, exit 0 after updating the revision metadata assertion; initial run was 280/281 because it expected Revision 5 |
| `npm.cmd run build` | PASS, exit 0; includes TypeScript, Vite, SEO/prerender, commercial pruning and isolation |
| `node scripts/validate-eds-g03.mjs` | PASS, no errors or warnings |
| Final GLB Khronos validation | PASS, 0 errors and 0 warnings |
| DEV Playwright WebGL capture | PASS for loading/rendering; no page, console or local-request errors |
| Physical device / sustained GPU test | NOT TESTED |
| Production deployment / data pipelines | NOT APPLICABLE to this DEV asset push; no production release approval implied |

Local headless Chrome reported Intel UHD Graphics / ANGLE Direct3D11,
7 draw calls, 7 geometries and 4 viewer textures in both matched scenes.
The viewer's final sampled median requestAnimationFrame interval was about
16.7 ms; this is **not** a certified sustained GPU frame-time benchmark.
The GLB itself has 0 textures. Full figures and browser errors are in
`evidence/r3-2-revision-6/browser-report.json`.

## Visual acceptance — HOLD

The closest `continuity-halo-rear-mount.png` still shows a sharply triangular
rear attachment fairing. The stitched upper T removes crossings, but its
controlled-reflective cropped view retains a faceted blend. The low-rear
diffuser comparison shows stronger geometric channel relief but still lacks
two clearly legible exit openings and retains a large central gable. These
are P2 visual defects, not automated-check failures. No claim of full visual
PASS or owner approval is made.

Evidence: `evidence/r3-2-revision-6/continuity-*.png`,
`wireframe-*.png`, `halo-prototype-*.png`, `diffuser-prototype-*.png`,
`diffuser-cross-sections.svg`, `full-topology.json`,
`integrated-khronos.json`, `browser-report.json`.

Release decision: **HOLD at Owner Gate 2**. No R3.3, production Showroom
replacement, merge or production deployment. The next technical step, if
authorized, is a local topology design for the rear fairing and a genuinely
open paired diffuser outlet; it must be prototyped and reviewed before
integration. This report does not self-approve that work.
