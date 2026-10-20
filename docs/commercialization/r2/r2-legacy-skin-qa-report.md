# EDS QA RELEASE REPORT — R2 legacy chassis skin review

Baseline SHA before the R2 commit: `9ab517f0b25fefad7e6da5a1cf96afb567912cbf`

Target branch: `Per-PEDS`

Target environment: Local Vite DEV only

Change summary: Standalone original EDS skin engine for the preserved detailed C42-derived
geometry, four-way DEV comparison viewer, six matched A/B views, six skin previews, browser
instrumentation and provenance evidence.

Risk level: **HIGH** — WebGL, third-party-derived geometry and commercial-isolation boundary.

## STATIC CHECKS

- ESLint: **PASS** — `npm.cmd run lint`, exit 0.
- TypeScript: **PASS** — `npm.cmd exec tsc -- --noEmit`, exit 0.
- Unit tests: **PASS** — `npm.cmd run test`, exit 0; 38 files, 272 tests.
- Focused regression: **PASS** — 2 files, 18 tests; includes all nine legacy material-slot
  mappings and six-livery data coverage.
- Integration tests: **NOT APPLICABLE** — no service or data integration changed.
- Formatting: **PASS** — scoped Prettier check, exit 0.
- Build: **PASS** — `npm.cmd run build`, exit 0; 2,214 modules transformed.

## FUNCTIONAL CHECKS

- Core functionality: **PASS** — A original detailed geometry, B EDS-skinned detailed
  geometry, C EDS-G01 and D local EDS-G02 are selectable; B is the default.
- Regression: **PASS** — production Showroom remains EDS-G01 by default; no C42 module is
  reachable from its checked source graph.
- Browser: **PASS** — local headless Chrome completed all captures with no page exceptions,
  console errors or failed local requests.
- Mobile: **NOT RUN** — owner requested matched visual angles; no physical mobile GPU was
  available.
- Accessibility: **HOLD** — controls use native buttons and visible labels, but keyboard/axe
  audit was not run for this DEV-only review surface.
- SEO: **PASS** — `dev-showroom.html` retains `noindex, nofollow` and is removed from `dist`.

## SPECIALIZED CHECKS

- 3D Showroom: **PASS for local review** — C42 GLB loaded; 11/11 meshes share source cached
  geometry; geometry/UV buffers are not cloned or disposed; suspension, wheels, wings,
  bodywork, cockpit, floor and diffuser remain visible in all six inspected views.
- Texture coverage: **PASS by screenshot inspection** — six liveries rendered with no missing
  regions, inverted UV evidence, unexplained white patches or absent wheel/suspension detail.
  Reflections are intentionally produced by the neutral studio lighting/PBR materials.
- Color space/orientation: **PASS** — generated color textures use `SRGBColorSpace`,
  `flipY=false`, mipmaps and bounded anisotropy for GLTF UV orientation.
- Repeated switching: **PASS with limitations** — 30 switches across six liveries; active
  renderer texture count returned to 13 after each cycle; sampled JS heap was non-monotonic
  and ended below the first sample. This short run does not prove long-session leak freedom.
- Performance: **PASS for DEV review, not a production benchmark** — Intel UHD Graphics
  ANGLE/D3D11, 1440×900 headless Chrome, 237,486 triangles, 13 draw calls; steady sample
  median RAF interval 16.7 ms and p95 17.0 ms after the final switch.
- GPU limitations: **DOCUMENTED** — no physical mobile device, discrete GPU, sustained thermal
  run, exact GPU memory measurement or Web Vitals field data.
- Security: **PASS (scoped review)** — no remote imagery, untrusted HTML injection, credential
  handling or generated trademark/sponsor/tire lettering added.
- Automated data source 1: **NOT APPLICABLE** — no Results Engine/data workflow change and no
  release push.
- Automated data source 2: **NOT APPLICABLE** — no Results Engine/data workflow change and no
  release push.

## CI/CD

- Required GitHub Actions: **NOT RUN** — task stops before commit/push.
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
- P3/P4: `R2-LEGACY-QA-01` — physical mobile rendering, long soak and formal accessibility
  testing remain unverified. Status: open; does not authorize commercial release.

## EVIDENCE

- Commands and exit codes: lint 0; TypeScript 0; full tests 0; focused tests 0; build 0;
  browser capture 0.
- Test results: 38 files / 272 tests; focused 2 files / 18 tests.
- Screenshots: 12 matched A/B angle captures plus six livery captures in
  `docs/commercialization/r2/legacy-skin-evidence/`.
- Benchmark and renderer data: `legacy-skin-evidence/browser-report.json`.
- Workflow/deployment URLs: none; no push or deployment was performed.

## UNVERIFIED ITEMS

- Physical mobile/touch behavior, sustained memory/thermal behavior, discrete-GPU behavior,
  formal accessibility scan, and independent rights clearance.

## RESIDUAL RISKS

- The C42-derived model's file license does not clear third-party design or trademark rights.
- Runtime canvas texture generation causes short switching stalls not represented by the final
  steady RAF sample.
- The high-detail model is materially heavier than EDS-G01 and remains DEV-only.

## RECOMMENDATION

The detailed legacy chassis with original EDS skins best matches the owner's stated visual
expectation: its bodywork, suspension, wheel and aerodynamic surface fidelity is substantially
higher than the procedural G01/G02 directions. Keep it as the selected DEV visual direction,
but do not promote it to the commercial Showroom without independent rights clearance and a
real-device performance/interaction pass.

**FINAL DECISION: HOLD**

**REASON:** Implementation and local QA evidence pass, but owner visual approval and legal
rights review are mandatory; mobile/long-soak evidence is incomplete.

**NEXT REQUIRED ACTION:** Owner reviews the six matched A/B views and six skin previews. No
stage, commit, push, merge or deployment should occur before that decision.
