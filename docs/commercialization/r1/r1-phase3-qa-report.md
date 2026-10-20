# R1 Phase 3 — Intro lifecycle and UX stability

Date: 2026-10-20. Branch: `Per-PEDS`. Baseline: `51e9bbc317a82a61ed1b2c5628b962756f9541d7`. Local review only; no stage, commit, push or deployment.

## Implementation

`F1StartLightsPreloader` was removed from the route-conditional `App` branch and is now owned by a stable sibling controller in `main.tsx`. The controller evaluates the Navigation Timing `navigation` entry once when its module loads. Only `type === 'reload'` permits the unchanged animation to mount. Missing, ambiguous or throwing timing data fails closed. No local/session storage gate was added. Skip, Escape, the 6.2-second timing sequence and body-scroll cleanup remain in the existing preloader.

This is an Intro lifecycle change, not a new animation or a change to the Results Engine or data workflows.

## EDS QA RELEASE REPORT

Commit SHA: `51e9bbc317a82a61ed1b2c5628b962756f9541d7` (pre-change baseline; Phase 3 uncommitted)

Target branch: `Per-PEDS`

Target environment: local Vite production preview at `127.0.0.1:4182`; no public deployment

Change summary: refresh-only Intro controller, navigation-type unit tests and browser lifecycle regression; R1 mobile defect harness output path and stable pause-state sample.

Risk level: HIGH (top-level lifecycle, route transitions and responsive Showroom regression exposure)

### STATIC CHECKS

- ESLint: PASS — `npm.cmd run lint`, exit 0.
- TypeScript: PASS — `npm.cmd run build` includes `tsc`, exit 0.
- Unit tests: PASS — `npm.cmd run test`, 36 files / 259 tests, exit 0. The old every-App-mount Intro assumption was removed; navigation types and fail-closed behavior are now asserted.
- Integration tests: PASS for local browser scenarios; live-provider integration is NOT APPLICABLE to this change.
- Build: PASS — production build, 72 SEO routes, four Engineering prerenders and commercial asset isolation; exit 0.
- Changed-file Prettier: PASS — scoped `prettier --check`, exit 0.

### FUNCTIONAL CHECKS

- Core functionality: PASS in tested local browser flows — new navigation has no Intro; real refresh has one; completion, Skip and Escape release body scroll and do not replay within the document.
- Intro A–L: PASS — 40/40 browser checks across 375×812 mobile emulation and 1440×900 desktop. [Full results](phase3-evidence/intro-lifecycle-results.json). Includes Home repetition, Home → Championship → Showroom → Home, Engineering → Home, Back/Forward, VI/EN, season, mobile section, 860/861px resize and refresh on three other routes.
- R1 responsive regression: PASS — 13/13 views, including 320–860px mobile, 1024/1440px desktop, one active WebGL canvas on mobile Showroom, six liveries, seven hotspots, modal focus/Escape, direct hotspot link and Championship targets ≥44px. [Results](phase3-evidence/responsive/browser-results.json).
- Mobile section/Feed regression: PASS — five section selections aligned at 63.75–64px with matching active nav; EDS Feed transform stable for 300ms after Pause and animation `running` again after Resume; Vietnamese hero uses the system sans stack. [Results](phase3-evidence/mobile-defect-current.json).
- Browser: PASS for the scripted local routes above; no uncaught page exceptions in the Intro or mobile-defect harnesses. Existing offline API intercepts mean this is not a provider-availability test.
- Mobile: Emulated 375px Intro and 320–860px responsive checks PASS. Physical-device touch/pinch NOT TESTED.
- Accessibility: Intro Skip and Escape, body-scroll restoration, existing Showroom dialog focus/Escape checked. Full assistive-technology audit NOT RUN.
- SEO: PASS — `npm.cmd run qa:m5:seo`, 72 valid routes and preview noindex verified.

### SPECIALIZED CHECKS

- 3D Showroom: Existing controls, liveries, hotspots and commercial asset isolation PASS in the R1 browser/build regressions. Physical GPU, WebGL context recovery and long-duration soak NOT TESTED.
- Performance: Lighthouse NOT RUN; no local Lighthouse installation. Physical-device and actual-GPU measurements NOT TESTED. No headless frame times are presented as physical-device results.
- Security: No dependency, credential, provider, data workflow or deployment configuration change in the scoped Phase 3 diff. Dependency vulnerability audit NOT RUN.
- Automated data source 1: NOT APPLICABLE to branch-local Intro review; production health/freshness NOT VERIFIED.
- Automated data source 2: NOT APPLICABLE to branch-local Intro review; production health/freshness NOT VERIFIED.

### CI/CD

- Required GitHub Actions: NOT RUN (no push).
- Preview deployment: NOT RUN; local preview only.
- Production deployment: NOT RUN.
- Production smoke tests: NOT RUN.

### DEFECTS

- P0/P1: None observed in exercised checks.
- P2 `R1P3-001` — Intro replay after Engineering → Home. Reproduce on baseline by entering Engineering then clicking Home. Expected: Intro only after a real browser refresh. Actual: route-conditional preloader remounted and replayed. Root cause confirmed in `App.tsx`: it was excluded from Engineering and remounted on return. Resolution: document-level controller outside route tree, gated by a single Navigation Timing read. Retest PASS in the Intro browser results on mobile and desktop, including Back/Forward and resize.
- Test-harness observation: one initial EDS Feed retest sampled its transform before the paused animation frame settled and exited 1 despite computed state `paused`. Waiting 50ms before the baseline sample produced a stable 300ms comparison; rerun exited 0. No Feed application code was changed in Phase 3.

### EVIDENCE

- Commands and exit codes: focused unit 0; lint 0; full unit 0; build 0; Intro browser 0; responsive browser 0; mobile defect browser 0; SEO 0; scoped Prettier 0; `git diff --check` 0. Git reported only existing Windows line-ending normalization warnings.
- Intro screenshots: [mobile during reload](phase3-evidence/mobile-intro-reload.png), [desktop during reload](phase3-evidence/desktop-intro-reload.png), [mobile after completion](phase3-evidence/mobile-after-intro.png), [desktop after completion](phase3-evidence/desktop-after-intro.png).
- R1 regression screenshots: `phase3-evidence/responsive/` and `phase3-evidence/mobile-defect-current.png`.
- Benchmark results: physical GPU and Lighthouse NOT TESTED.
- Workflow run and deployment URLs: NOT APPLICABLE; no push/deployment.

UNVERIFIED ITEMS: Physical-device touch/pinch/drag, actual GPU and long soak, WebGL context loss/recovery, Lighthouse/Core Web Vitals, full assistive-technology audit, CI, production data-source health and deployment.

RESIDUAL RISKS: The Navigation Timing API may be unavailable in some browsers; by design the Intro then does not play. Browser tests used headless Chrome with emulated viewports, not physical hardware. The local preview logged Jolpica proxy `EACCES` connection errors when the existing automatic data request fired; this did not affect the Intro checks and is not evidence of provider or production data health.

FINAL DECISION: HOLD

REASON: Branch-local functional checks pass, but release-level physical-device, performance, accessibility, pipeline and deployment evidence is incomplete.

NEXT REQUIRED ACTION: Review the uncommitted Phase 3 diff; perform physical-device and pre-release checks before any production decision.
