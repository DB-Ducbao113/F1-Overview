# EDS QA RELEASE REPORT — R2 skin polish and studio quality

Verified remote baseline: `17628a33576257a0d2ea8a6472ab3fd595625e25`

Target branch: `Per-PEDS`

Target environment: Local Vite DEV only

Change summary: Polish pass for all six original EDS skins on the preserved detailed
C42-derived geometry, seamless dark DEV studio, consistent comparison/close-up cameras,
48 skin acceptance captures, matched A/B evidence, and repeat-switch instrumentation.

Risk level: **HIGH** — WebGL, third-party-derived geometry and commercial-isolation boundary.

## STATIC CHECKS

- ESLint: **PASS** — `npm.cmd run lint`, exit 0.
- TypeScript: **PASS** — `npm.cmd exec tsc -- --noEmit`, exit 0.
- Unit tests: **PASS** — `npm.cmd run test`, exit 0; 38 files, 274 tests.
- Focused regression: **PASS** — 1 file, 12 tests; includes all nine legacy material-slot
  mappings, Carbon/Stealth differentiation, and bright-accent limits.
- Integration tests: **NOT APPLICABLE** — no service or data integration changed.
- Formatting: **PASS** — scoped Prettier check, exit 0.
- Build: **PASS** — `npm.cmd run build`, exit 0; 2,214 modules transformed.

## FUNCTIONAL CHECKS

- Core functionality: **PASS** — A original detailed geometry, B EDS-skinned detailed
  geometry, C EDS-G01 and D local EDS-G02 are selectable; B remains the DEV default.
- Regression: **PASS** — production Showroom remains EDS-G01 by default; no C42 module is
  reachable from its checked source graph.
- Browser: **PASS** — local headless Chrome completed all captures with no page exceptions,
  console errors or failed local requests.
- Mobile/physical device: **NOT TESTED** — no physical mobile GPU was available.
- Accessibility: **HOLD** — controls use native buttons and visible labels, but keyboard/axe
  audit was not run for this DEV-only review surface.
- SEO: **PASS** — `dev-showroom.html` retains `noindex, nofollow` and is removed from `dist`.

## SPECIALIZED CHECKS

- 3D Showroom: **PASS for local review** — C42 GLB loaded; 11/11 meshes share source cached
  geometry; geometry/UV buffers are not cloned or disposed; suspension, wheels, wings,
  bodywork, cockpit, floor and diffuser remain visible.
- Texture coverage: **PASS by screenshot inspection** — all six liveries were inspected at
  front three-quarter, side, rear, sidepod, front wing, rear wing, wheel/suspension and cockpit
  views. No missing regions, inverted UV evidence, unexplained white patches or absent detailed
  surfaces were observed.
- Design acceptance: **PASS for owner review** — body-part graphics are composed per slot;
  Carbon Heritage uses visible twill weave and satin clearcoat while Studio Stealth is sparse
  and matte. Cyan, gold, white/crimson and kinetic accents remain secondary to the body color,
  and tire-side accents are thin and low-opacity.
- DEV studio: **PASS** — one unlit dark enclosing backdrop removes the grey horizon seam;
  controlled local reflections and identical A/B lights/cameras preserve geometry readability.
- Color space/orientation: **PASS** — generated color textures use `SRGBColorSpace`,
  `flipY=false`, mipmaps and bounded anisotropy for GLTF UV orientation.
- Repeated switching: **PASS with limitations** — 30 switches across six liveries; active
  renderer texture count returned to 13 after each cycle. Sampled JS heap was non-monotonic;
  this short run does not prove long-session leak freedom.
- Performance: **HOLD for physical-device characterization** — Intel UHD Graphics
  ANGLE/D3D11, 1440×900 headless Chrome, 237,708 triangles, 13 draw calls; final steady sample
  median RAF interval 16.7 ms and p95 27.9 ms after the final switch. Median is unchanged from
  the earlier 16.7 ms baseline, but the short-run p95 is 10.9 ms worse and may include headless
  capture/GC jitter; it is reported as an observed regression, not dismissed.
- GPU limitations: **DOCUMENTED** — no physical mobile device, discrete GPU, sustained thermal
  run, exact GPU memory measurement or Web Vitals field data.
- Security: **PASS (scoped review)** — no remote imagery, untrusted HTML injection, credential
  handling or generated trademark/sponsor/tire lettering added.
- Automated data source 1: **NOT APPLICABLE** — no Results Engine/data workflow change and no
  release push.
- Automated data source 2: **NOT APPLICABLE** — no Results Engine/data workflow change and no
  release push.

## CI/CD

- Required GitHub Actions: **PENDING** — to be inspected after the owner-authorized branch push.
- Preview deployment: **NOT RUN**.
- Production deployment: **NOT APPLICABLE** — explicitly prohibited.
- Production smoke tests: **NOT APPLICABLE**.
- Commercial isolation: **PASS** — build removed 14 legacy targets and one G02 review-only
  target, verified 73 required original EDS assets, and scanned 28 production Showroom source
  modules plus 108 text artifacts without violation.

## DEFECTS

- P0: None observed.
- P1: None observed.
- P2: None observed in the scoped DEV renderer.
- P3: `R2-LEGACY-QA-01` — physical mobile rendering, long soak and formal accessibility
  testing remain unverified. Status: open; does not authorize commercial release.
- P3: `R2-LEGACY-QA-02` — final short-run p95 RAF interval is 27.9 ms versus the earlier
  17.0 ms evidence baseline while median remains 16.7 ms. Suspected headless capture/GC jitter
  is unconfirmed. Status: open for physical-device/longer-run measurement.

## EVIDENCE

- Commands and exit codes: lint 0; TypeScript 0; full tests 0; focused tests 0; build 0;
  browser capture 0.
- Test results: 38 files / 274 tests; focused 1 file / 12 tests.
- Screenshots: 48 six-skin acceptance captures plus six matched A/B captures in
  `docs/commercialization/r2/legacy-skin-polish-evidence/`.
- Benchmark and renderer data: `legacy-skin-polish-evidence/browser-report.json`.
- Workflow/deployment URLs: branch push pending at report generation; production deployment is
  explicitly prohibited.

## UNVERIFIED ITEMS

- Physical mobile/touch behavior, sustained memory/thermal behavior, discrete-GPU behavior,
  formal accessibility scan, and independent rights clearance.

## RESIDUAL RISKS

- The C42-derived model's file license does not clear third-party design or trademark rights.
- Runtime canvas texture generation causes switching stalls; the short final RAF sample also
  shows p95 variability that requires a longer physical-device run before commercial use.
- The high-detail model is materially heavier than EDS-G01 and remains DEV-only.

## RECOMMENDATION

The polished detailed legacy chassis with original EDS skins best matches the owner's stated
visual expectation: its bodywork, suspension, wheel and aerodynamic surface fidelity is
substantially higher than the procedural G01/G02 directions. Keep it as the selected DEV visual
direction, but do not promote it to the commercial Showroom without independent rights
clearance and a real-device performance/interaction pass.

**FINAL DECISION: HOLD**

**REASON:** Implementation, static gates, geometry/material lifetime checks, visual capture and
commercial isolation pass. Owner visual approval and legal rights review remain mandatory;
physical-device/long-soak evidence and the p95 regression disposition are incomplete.

**NEXT REQUIRED ACTION:** Push the scoped R2 review commit to `Per-PEDS`, then inspect any
applicable CI result. Owner reviews the polished 48-view collection and matched A/B views; no
merge or deployment should occur before explicit approval.
