# R1 responsive adaptive redesign — QA report

Date: 2026-10-20. Branch: `Per-PEDS`. Pre-change baseline HEAD: `868e92cebb323e00499c7f7ca2374a5ea94ccff8`. Target: branch review only; no deployment.

## Change and impact

Risk: **HIGH** (routing, responsive UI, WebGL lifecycle). At widths up to 860 px, the three primary experiences share a Home / Championship / Showroom scrolling page with a fixed section bar and URL hashes. Wider screens retain their separate routes. The EDS-G01 Showroom remains the original model; its six liveries and seven hotspots remain available. The desktop home hero now uses a lazy EDS-G01 scene. A static original illustration covers loading, reduced-motion and no-WebGL cases. The news ticker now derives its items from project calendar/store data rather than hardcoded racing claims. No data-update workflow was edited.

The supplied `references/podium-review.html` was used as a visual layout reference, not as a source of telemetry or assets. Reference captures in `evidence/reference-layout-*.png` are **layout-only**: their external CDN 3D import was unavailable in the offline test environment.

## EDS QA RELEASE REPORT

Pre-change baseline SHA: `868e92cebb323e00499c7f7ca2374a5ea94ccff8` (R1 validation performed before its commit)

Target branch: `Per-PEDS`

Target environment: local Vite production preview

Change summary: adaptive primary routes, original model hero, mobile navigation, Showroom visibility lifecycle, responsive controls and factual ticker.

Risk level: HIGH

### STATIC CHECKS

- ESLint: PASS — `npm.cmd run lint`, exit 0.
- TypeScript: PASS — `npm.cmd run build` includes `tsc`, exit 0.
- Unit tests: PASS — `npm.cmd run test`, 36 files / 254 tests, exit 0.
- Integration tests: PASS for local browser regression only; no provider integration test was run.
- Build: PASS — `npm.cmd run build`, exit 0; 72 SEO routes generated, four article prerenders, 14 legacy visual targets removed, commercial isolation guard PASS across 28 Showroom source modules and 108 artifacts.
- Changed-file formatting: PASS — Prettier check, exit 0.
- Diff whitespace: PASS — `git diff --check -- src scripts`, exit 0 (line-ending warnings only).

### FUNCTIONAL CHECKS

- Core functionality: See `evidence/browser-results.json` for recorded viewport, routes, canvas counts, interactions, console events, resource failures and timing samples.
- Regression: 6 livery selections, 7 hotspot dialogs, hash history back/forward and keyboard section navigation exercised in local headless Chrome.
- Browser: PASS — `node scripts/qa-r1-responsive.mjs`, exit 0, 12/12 views with zero harness failures. Viewports 320 × 720, 375 × 812, 390 × 844, 768 × 1024, 1024 × 768 and 1440 × 900; direct deep link and 860 → 861 → 860 resize boundary exercised. No horizontal overflow or app page exceptions in those cases.
- Mobile: Desktop-emulated viewports PASS for layout checks; physical touch/pinch NOT RUN.
- Accessibility: Keyboard section navigation and `aria-pressed` interactions tested; full screen-reader/contrast audit NOT RUN.
- SEO: PASS — `npm.cmd run qa:m5:seo`, 72 routes, bilingual prerenders and initial-HTML preview noindex. No commercial hostname set.

### SPECIALIZED CHECKS

- 3D Showroom: Browser checks verify one active WebGL canvas on mobile Showroom and none on initial mobile Home; six liveries/seven hotspots exercised. Context loss/recovery, unmount memory soak and physical GPU appearance NOT RUN.
- Performance: Headless Chrome frame timing and JS heap are recorded in JSON as **HEADLESS_CHROME_ONLY**. No comparable before/after or physical GPU result. Lighthouse NOT RUN because the package is not installed and registry access was denied; do not infer Core Web Vitals from these samples.
- Security: No secrets, external script, API workflow or authentication changes were intentionally introduced. Automated dependency audit NOT RUN.
- Automated data source 1: NOT APPLICABLE to branch-local R1 review; no production release. Local browser received 503 from `/api/jolpica`; no live data collection succeeded.
- Automated data source 2: NOT APPLICABLE to branch-local R1 review; no production release.

### CI/CD

- Required GitHub Actions: PENDING at the time of this pre-push report.
- Preview deployment: NOT RUN (local Vite preview only).
- Production deployment: NOT RUN.
- Production smoke tests: NOT RUN.

### DEFECTS

- P0: None observed in exercised flows.
- P1: None observed in exercised flows.
- P2: Initial `/showroom?hotspot=floor` scroll drift after lazy preceding sections — fixed with bounded `ResizeObserver` alignment; retest PASS (`showroomTop: 63.5px`, hotspot panel visible, zero overflow). No open P2 observed in tested flows.
- P3/P4: The browser harness records expected local-only Google Fonts network denial, Vercel analytics 404s and intentionally stubbed Jolpica 503s. No app page exceptions were observed in the final run.

### EVIDENCE

- Commands and exit codes: As recorded above; final browser command with `R1_QA_URL=http://127.0.0.1:4176` exited 0 (`views: 12`, `failures: 0`).
- Test results: `evidence/browser-results.json` and the unit-test totals above.
- Screenshots: `evidence/mobile-home-375.png`, `mobile-championship-375.png`, `mobile-showroom-375.png`, `desktop-home-1440.png`, `desktop-championship-1440.png`, `desktop-showroom-1440.png`.
- Benchmark results: Headless-only RAF frame samples in JSON; no real-device benchmark.
- Workflow run URLs: Not applicable.
- Deployment URLs: Not applicable.

UNVERIFIED ITEMS: Real mobile touch/pinch; physical GPU; Lighthouse; WebGL context recovery and long-session memory; full accessibility audit; real provider availability; CI and deployment gates.

RESIDUAL RISKS: External font availability and production analytics behavior differ from the offline preview; headless timing is not real-device performance evidence. Original user-provided `references/` and unrelated pre-existing Cloudflare/CI changes remain outside R1 scope.

FINAL DECISION: HOLD

REASON: Release-level performance, physical-device and accessibility evidence is incomplete. Branch-local implementation is not a production approval.

NEXT REQUIRED ACTION: Run physical-device, Lighthouse and launch-gate validation before seeking release approval. Keep unrelated files outside the R1 commit.
