# EDS-G02 R2 — QA and owner-review gate

> **Superseded 2026-10-20:** the owner selected the legacy detailed chassis skin direction.
> EDS-G02 is preserved as a postponed local comparison artifact and is not under development.

Date: 2026-10-20. Branch: `Per-PEDS`. Baseline HEAD: `9ab517f0b25fefad7e6da5a1cf96afb567912cbf`. No stage, commit, push or deployment performed for R2.

## Outcome and scope

An original G02 GLB and reproducible procedural source were created. G01 is unchanged and remains the default. G02 can be inspected only in Vite development mode with `/showroom?model=eds-g02`; the production build removes the G02 GLB and source URL. The shared six EDS liveries, seven hotspots, camera controls and schematics remain wired in the review mode. The model is **not visually approved** and must not replace G01 until the owner reviews the six views in [the authoring record](eds-g02-authoring-record.md).

| Measure                              |     G01 |       G02 | Method/limit                                                        |
| ------------------------------------ | ------: | --------: | ------------------------------------------------------------------- |
| GLB bytes                            | 660,192 | 1,555,040 | Local files                                                         |
| GLB triangles                        |   9,004 |    72,916 | Repository validators                                               |
| Exported material/draw-call groups   |    8/14 |       9/9 | Exported GLB; studio draw calls differ                              |
| Embedded images                      |       0 |         0 | GLB JSON                                                            |
| Desktop 1200×750 median RAF interval | 16.7 ms |   33.3 ms | Short Chrome headless comparison; not a stable user FPS benchmark   |
| Desktop 1200×750 p95 RAF interval    | 33.5 ms |   50.1 ms | Same short sample; suggests possible standalone render cost         |
| Mobile 375×700 median RAF interval   | 16.7 ms |   16.7 ms | Desktop GPU with mobile viewport emulation, **not physical mobile** |

The identical-camera capture is in `evidence/g01-*.png` and `evidence/g02-*.png`; exact short-run data and GPU identifier are in [browser-report.json](evidence/browser-report.json). Both models were rendered on Chrome ANGLE Intel UHD Graphics (0x9BC4), Direct3D11, in headless mode. The G02 smooth hull, wing profiles and tire shoulders are visually improved, but sidepod joins, diffuser/floor surfacing and mechanical detail remain review concerns.

### Full Showroom comparison

Same local Vite dev server, same Intel UHD Graphics and 375×812 / 768×1024 / 1440×900 viewports. The browser harness scrolled the mobile Showroom into view before testing. Each FPS number is a single ~1.5-second headless sample after repeated livery/hotspot operations; sample order, shader cache and other machine activity can affect it. This is **not** physical-device or sustained thermal evidence.

| Viewport                 | G01 triangles / draw calls / sample FPS | G02 triangles / draw calls / sample FPS |
| ------------------------ | --------------------------------------- | --------------------------------------- |
| 375×812 emulated mobile  | 9,072 / 28 / 47.8                       | 72,984 / 23 / 54.0                      |
| 768×1024 tablet viewport | 9,056 / 25 / 39.7                       | 72,970 / 21 / 36.4                      |
| 1440×900 desktop         | 9,058 / 26 / 26.2                       | 72,970 / 21 / 26.5                      |

Reports: [G01 Showroom](evidence/showroom-g01/browser-report.json), [G02 Showroom](evidence/showroom-preview/browser-report.json). Both runs detected six livery buttons, seven functioning hotspot dialogs with loaded images, a loaded schematic, no horizontal overflow, and desktop WebGL context-loss recovery. G02's 50-switch JS heap delta was +1.3/+2.3/+1.2 MiB (mobile/tablet/desktop), versus G01 +1.7/+3.6/+3.3 MiB; these short heap samples do not establish long-session leak freedom. G02 livery-switch median varied 445–1,128 ms across viewports and should be repeated on real devices. Browser console errors/page exceptions were empty in both runs. External Google Fonts and Vercel debug scripts failed to load due to the isolated browser network environment, not a local asset 404.

## Verification results

| Gate                                                    | Result                      | Evidence                                                                                                                                                            |
| ------------------------------------------------------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Branch/worktree scope                                   | PASS                        | `Per-PEDS` at baseline HEAD; unrelated Cloudflare document, CI file and `references/` left untouched                                                                |
| Reproducible export                                     | PASS                        | Two fresh GLB exports matched checked-in SHA-256 `90B4A7096AE3DCA468D6C8EED1FBAA8BBC9B38CB84B6672AB53F2539D64D0ADF`; temporary copies removed                       |
| GLB structure/geometry                                  | PASS (repository validator) | `node scripts/validate-eds-g02.mjs`, exit 0; 0 invalid normals, 0 opposed normals, 0 degenerate triangles; bounds within ±1.067 m width, Y 0–1.25 m, Z −2.61–2.48 m |
| Independent Khronos glTF Validator                      | NOT RUN                     | Package not installed locally; do not infer its result from repository validator                                                                                    |
| Six identical-camera before/after views                 | PASS                        | Front, side, top, rear, three-quarter, Showroom screenshots generated and inspected; visual approval still pending                                                  |
| Showroom browser interactions                           | PASS (local headless)       | Both `capture-showroom-evidence.mjs` runs exited 0; reports linked above                                                                                            |
| Physical phone touch/pinch and sustained memory/thermal | NOT RUN                     | No physical mobile device test performed                                                                                                                            |
| ESLint                                                  | PASS                        | `npm run lint`, exit 0                                                                                                                                              |
| Unit tests                                              | PASS                        | `npm run test`, exit 0; 37 files, 262 tests                                                                                                                         |
| TypeScript and production build                         | PASS                        | `npm run build`, exit 0; TypeScript, Vite, SEO generation and prerender completed                                                                                   |
| Commercial visual isolation                             | PASS                        | Build removed 14 legacy + 1 G02 review-only asset; checked 28 Showroom source modules and 108 artifact files                                                        |
| Production deployment / CI / data workflows             | NOT APPLICABLE              | R2 is local review only; no push, deployment or pipeline modification                                                                                               |

## Defects and residual risks

- R2-VIS-01 (P2, unresolved): sidepod/engine-cover junction and broad floor/diffuser still read as an original concept study, not production-grade surfacing. Reproduce in the side and three-quarter screenshots. Owner should decide whether to approve this direction or request further sculpting.
- R2-PERF-01 (P2, unresolved): 1200×750 standalone headless comparison had worse G02 RAF intervals despite near-equal short full-Showroom desktop FPS. Repeat with warmed caches and physical hardware before default substitution; consider a measured LOD1 only if mobile hardware requires it.
- R2-QA-01 (P3, unresolved): Khronos validation, physical touch/pinch, longer memory soak and hotspot-coordinate visual review across all camera presets remain unverified. The existing seven hotspots function mechanically but their placement is not yet owner-approved for the changed shape.
- Rights review: source and deterministic authorship are recorded, but technical originality is not independent legal clearance.

**FINAL DECISION: HOLD.** G02 is available for owner visual review in DEV; default replacement and commercial release are withheld. Next action: owner reviews the six matched views and calls out desired surfacing changes, then perform targeted geometry revisions and longer real-device/performance QA before considering a default switch.
