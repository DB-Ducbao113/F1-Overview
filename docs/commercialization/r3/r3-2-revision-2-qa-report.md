# EDS QA RELEASE REPORT — R3.2 Revision 2

Commit SHA: local candidate based on `a4a36a09acc52bc8e1c95f47403aaa199bbdc567`;
record the resulting local SHA at handoff.
Target branch: `Per-PEDS`
Target environment: local DEV owner review only
Change summary: geometric sidepod apertures/ducts, revised diffuser exit profile,
and three halo fairing/collar transitions.
Risk level: HIGH — authored WebGL geometry and commercial asset isolation.

## Static checks

- ESLint: **PASS** — `npm.cmd run lint`, exit 0.
- TypeScript: **PASS** — `npx.cmd tsc --noEmit`, exit 0.
- Unit tests: **PASS** — `npm.cmd test`, exit 0; 39 files / 281 tests.
- Integration tests: **NOT APPLICABLE** — no service/data integration changed.
- Production build: **PASS** — `npm.cmd run build`, exit 0; 2,214 modules.
- Commercial isolation: **PASS** — build guard removed 14 legacy and two
  review-only assets; 28 commercial Showroom source modules and 108 dist files
  scanned. G03 and C42 remain absent from the commercial bundle.

## Functional and visual checks

- DEV browser: **PASS for capture operation** — `npm.cmd run qa:r3:continuity`,
  exit 0; nine matched BEFORE/AFTER sheets from local headless Chrome at
  1440 x 900, 38-degree FOV. Both versions use identical viewer code, camera,
  zoom and lighting in diffuse and reflective modes. No page/console/local
  request errors were recorded.
- Intake: **IMPROVED, NOT VISUALLY APPROVED** — actual body-grid apertures,
  lip, tapered duct walls and terminal walls are visible. Mouth corners remain
  square and the reflective interior has a triangular highlight.
- Diffuser: **PARTIAL, NOT VISUALLY APPROVED** — profile/channel shaping has
  zero validator foldovers, but rear-camera improvement is subtle and the exit
  remains broad/simple.
- Halo: **IMPROVED, NOT VISUALLY APPROVED** — no spherical feet; short tapered
  joints and shell fairings are visible. Joint boundaries remain simplified.
- Physical mobile/device, WebGL context loss and sustained switching:
  **NOT TESTED**. No production route or commercial default changed.
- Accessibility/SEO: **NOT APPLICABLE** — no public-facing UI or route change.

## Specialized checks

- Deterministic export: **PASS** — two exports matched SHA-256
  `93a1416b3d68e7323c1b2ff0bbb666d7d6008b75dc1b21e1de3cc0af8ab1ec33`.
- Dimensional/internal geometry validation: **PASS** — 5.050 x 2.000 x
  1.180 m; 3.600 m wheelbase; axles, track, wheel radii and ground contact
  unchanged. 56,472 triangles, 32,704 vertices, five GLB nodes/materials,
  zero textures, 1,129,672 bytes. Zero invalid values, degenerate triangles,
  invalid unit normals and normal/winding disagreements. Internal checks do
  not establish watertightness or exhaustive self-intersection freedom.
- Khronos glTF Validator: **NOT TESTED** — no local CLI or package available.
- Performance: **PASS for short comparable browser sample only** — Intel UHD
  via ANGLE/D3D11, 1440 x 900; baseline/current rendered triangles 56,142 /
  56,698; seven calls, seven renderer geometries and four textures each.
  Approx. 175 RAF samples each: median 16.7 ms, p95 17.0 ms. RAF is not GPU
  time and is display-capped; sustained/physical-device performance is unknown.
- Security/provenance: **PASS in changed scope** — no external geometry,
  texture, branding, unsafe URL or credential added.
- Automated data sources 1/2: **NOT APPLICABLE** — Results Engine untouched;
  this is not a production release.

## CI/CD and deployment

- GitHub Actions: **NOT RUN** for this local candidate.
- Push: **BLOCKED by task policy**. Vercel project `podiumeffetdesol` has Git
  integration: its deployment list shows successful preview deployments for
  prior `Per-PEDS` commits `a4a36a0` and `a6549c6` (target `null`). A new push
  would therefore trigger a preview deployment, which the owner explicitly
  prohibited. No project settings were changed to bypass this.
- Preview/production deployment and smoke: **NOT RUN**. No merge or `main`
  change performed.

## Defects and evidence

- P0/P1: none detected by scoped checks.
- P2: R3-G03-006 intake lip quality, R3-G03-009 diffuser visual definition,
  R3-G03-008 halo junction realism all require owner review. See
  `r3-2-issues.md` for reproduction and disposition.
- Evidence: `evidence/r3-2-revision-2-surface-refinement/` (nine four-panel
  sheets plus `browser-report.json`), `g03-dimensional-validation.json`,
  `g03-hardpoints.json`, `r3-2-surface-authorship.md`.
- Existing unrelated Cloudflare document, CI draft, master plan and
  `references/` remain untouched.

Unverified: independent glTF/Blender validation, physical device, sustained
GPU behavior, all-angle self-intersections and owner visual acceptance.

**FINAL DECISION: HOLD**

Reason: local technical checks pass, but the three visual items lack owner GO;
the requested remote push would cause a prohibited Vercel preview deployment.

Next required action: owner reviews the nine matched sheets and either requests
another Gate 2 revision or explicitly changes the deployment/push policy.
Do not start R3.3, merge or deploy.
