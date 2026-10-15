# Optimization results

## M1A result

M1A self-hosts the existing Inter and Playfair Display families, removes Google Fonts from the critical path, and reserves a full viewport for lazy route content so the footer cannot enter the initial viewport while a route chunk is loading.

The candidate was measured locally with Chrome 155 and Lighthouse 13.5.0 using the desktop preset, simulated throttling, and a new Lighthouse browser context for every run. Each route has three cold runs. M0 was measured against Production, while M1A was measured against the local production build; the LCP/FCP comparison is directional until the preview and production deployments are measured. CLS source removal is directly confirmed in the candidate reports.

| Route       | Metric | M0 desktop | M1A median | Change |
| ----------- | ------ | ---------: | ---------: | -----: |
| Homepage    | Score  |         80 |         95 |    +15 |
| Homepage    | FCP    |     770 ms |     465 ms |   -40% |
| Homepage    | LCP    |   1,473 ms |   1,396 ms |    -5% |
| Homepage    | CLS    |      0.233 |      0.001 | -99.6% |
| Season 2026 | Score  |         78 |         97 |    +19 |
| Season 2026 | FCP    |   1,030 ms |     474 ms |   -54% |
| Season 2026 | LCP    |   1,432 ms |   1,024 ms |   -28% |
| Season 2026 | CLS    |      0.233 |      0.001 | -99.6% |
| Teams       | Score  |         80 |         96 |    +16 |
| Teams       | FCP    |     760 ms |     428 ms |   -44% |
| Teams       | LCP    |   1,602 ms |   1,324 ms |   -17% |
| Teams       | CLS    |      0.233 |      0.003 | -98.7% |

All nine final runs have CLS between 0.000 and 0.003, LCP below 1.5 seconds, and zero TBT.

Raw final reports are under [`m1a/lighthouse/`](m1a/lighthouse/), with per-run values in [`m1a/lighthouse-summary.csv`](m1a/lighthouse-summary.csv). The font-only attempt remained near 0.234 CLS because its route skeleton exposed the footer before lazy content mounted. Reserving `calc(100vh - 4rem)` reduced CLS to 0.065–0.069 but still exposed 64 px of footer. The final `min-h-screen` route container removes the footer shift. Both failed summaries are retained as [`font-only-lighthouse-summary.csv`](m1a/font-only-lighthouse-summary.csv) and [`reserved-main-lighthouse-summary.csv`](m1a/reserved-main-lighthouse-summary.csv).

## Font and visual evidence

- Four variable WOFF2 subsets total 106,024 bytes: Inter Latin/Vietnamese and Playfair Display Latin/Vietnamese.
- The external Google Fonts stylesheet, preconnects, and CSP origins are gone.
- The four local subsets are preloaded because Vietnamese first-render content needs both Unicode subsets and the first viewport uses both families.
- OFL license texts are stored beside the font assets.
- Fifteen candidate screenshots cover `/`, `/season/2026`, and `/teams` at 390×844, 768×1024, 1280×900, 1440×1000, and 1920×1080 under [`m1a/screenshots/`](m1a/screenshots/).
- Visual review found no new wrapping, clipping, or typography regression in the three target routes. Two Homepage captures initially missed the client-discovered hero image and passed after a 10-second retry; this remains evidence for the planned M1B hero discoverability task.

## Load-test verification fixes

- CI now runs for `perf/**` pushes and pull requests.
- `load.js`, `spike.js`, `soak.js`, and `fault.js` reject any `DATA_MODE` other than `simulated` before a request can run.
- Shared target validation requires the exact HTTPS preview hostname and rejects `podiumeds.vercel.app` even if it is supplied as the allowed host.
- Automated tests cover target guards, simulated-mode guards, Jolpica preview fixtures, production rejection, 429/503 responses, and slow/timeout schedules.
- The preview deployment smoke workflow remains a short live smoke only. When Vercel Deployment Protection is active and the bypass secret is absent, it now records an explicit skip before k6 is installed or run. No high-load test was run against Preview or Production during M1A.
- `docker-publish.yml` remains limited to `main`, tags, and manual dispatch. F1 synchronization workflows and F1 data files are unchanged.

## Validation performed

| Check                          | Result                    | Detail                                                                                                                                                                            |
| ------------------------------ | ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run lint`                 | Pass                      | No ESLint errors.                                                                                                                                                                 |
| `npm run format:check`         | Pass                      | All authored files conform.                                                                                                                                                       |
| `npm test`                     | Pass                      | 27 files, 210 tests.                                                                                                                                                              |
| `npm run test:coverage`        | Pass                      | 63.2% statements, 59.8% branches, 68.51% functions, 63.96% lines.                                                                                                                 |
| `npm run build:check`          | Pass                      | Initial JavaScript 109.4 KiB gzip against the 180 KiB limit.                                                                                                                      |
| First build after adding tests | Failed, corrected         | A multiline import left an unused `@ts-expect-error`; the import was corrected and the production build then passed.                                                              |
| First font-only Lighthouse set | Failed, corrected         | CLS stayed near 0.234 because lazy route loading moved the footer.                                                                                                                |
| First Preview Smoke run        | Failed, corrected         | Vercel Protection returned HTML because `VERCEL_PROTECTION_BYPASS` was empty; the workflow now skips before k6 and emits a notice.                                                |
| Final Lighthouse, 9 runs       | Pass                      | All route medians pass score, LCP, TBT, and CLS desktop gates.                                                                                                                    |
| Five-width visual capture      | Pass with M1B observation | 15 final screenshots; two delayed Homepage hero captures required a longer wait.                                                                                                  |
| High-load execution            | Not run by design         | Guard behavior is unit tested; no load was sent to Production.                                                                                                                    |
| Target-commit CI               | Pass                      | SHA `a3cec587972a77ab2e27fe7c87cab27fb4ead8f6`; [CI run 38535918940](https://github.com/DB-Ducbao113/F1-Overview/actions/runs/38535918940).                                       |
| Vercel Preview deployment      | Pass                      | Vercel reported Ready for `a3cec58`; [deployment status](https://vercel.com/bao-bung-bu/podiumeffetdesol/9XT4HuDjKohZtDEWHEu3UfkdxYNH).                                           |
| Preview Smoke workflow         | Pass with explicit skip   | [Run 38536017325](https://github.com/DB-Ducbao113/F1-Overview/actions/runs/38536017325) skipped k6 because the protected Preview has no bypass secret; no smoke traffic was sent. |
| Docker publish                 | Not applicable            | `perf/**` does not match its `main`/tag/manual triggers, so no image was published.                                                                                               |

## Exact changed files

Application and configuration:

- `.prettierignore`
- `.github/workflows/ci.yml`
- `.github/workflows/preview-smoke.yml`
- `index.html`
- `src/App.tsx`
- `src/index.css`
- `vercel.json`
- `public/fonts/inter-latin.woff2`
- `public/fonts/inter-vietnamese.woff2`
- `public/fonts/playfair-display-latin.woff2`
- `public/fonts/playfair-display-vietnamese.woff2`
- `public/fonts/LICENSE-Inter.txt`
- `public/fonts/LICENSE-Playfair-Display.txt`

Load-test safety and tests:

- `scripts/load-test/README.md`
- `scripts/load-test/lib.js`
- `scripts/load-test/load.js`
- `scripts/load-test/spike.js`
- `scripts/load-test/soak.js`
- `scripts/load-test/fault.js`
- `scripts/load-test/safety.js`
- `scripts/load-test/validate.mjs`
- `src/services/load-test-safety.test.ts`

Evidence and release documentation:

- `docs/performance/optimization-results.md`
- `docs/performance/release-gates.md`
- `docs/performance/m1a/lighthouse/*.json`
- `docs/performance/m1a/*.csv`
- `docs/performance/m1a/screenshots/*.png`

## Risks and rollback

- Production field RES cannot validate this work until the new deployment accumulates samples. Low traffic and the seven-day rolling window can delay a visible change.
- Candidate LCP/FCP values include localhost rather than Vercel network latency; Production validation remains required before release GO.
- Four font preloads are deliberate for the bilingual first viewport but consume about 106 KiB. M1B should verify whether route-aware preload reduction is safe without reintroducing font shifts.
- Revert the M1A commit to restore Google Fonts and the previous route minimum height. The load-test guard can be reverted independently from the font/layout files if necessary.

## M1B result

M1B was measured against the M1A branch head on the same local production server with Chrome 155 and Lighthouse 13.5.0. Both the before and after sets contain three cold runs for Desktop and three for Mobile. These measurements isolate the implementation change but remain local lab evidence; they do not replace Preview or Production field validation.

| Form factor | Metric | M1A median | M1B median | Change |
| ----------- | ------ | ---------: | ---------: | -----: |
| Desktop     | Score  |         95 |         99 |     +4 |
| Desktop     | FCP    |     459 ms |     459 ms |      0 |
| Desktop     | LCP    |   1,395 ms |     776 ms |   -44% |
| Desktop     | TBT    |       0 ms |       0 ms |      0 |
| Desktop     | CLS    |      0.001 |      0.000 | -0.001 |
| Mobile      | Score  |         83 |         84 |     +1 |
| Mobile      | FCP    |   2,145 ms |   2,148 ms |  +3 ms |
| Mobile      | LCP    |   4,290 ms |   4,068 ms |    -5% |
| Mobile      | TBT    |      33 ms |      32 ms |  -1 ms |
| Mobile      | CLS    |      0.000 |      0.000 |      0 |

The preload moved the hero network request start from a median 186 ms to 8 ms. All three after reports contain exactly one hero request with `High` priority and `isLinkPreload: true`; the preload does not duplicate the component request. Desktop selected the navbar logo as the final LCP candidate in two runs and the hero in one. Mobile selected the navbar logo in all three runs, so the candidate is stable while the intentional 2.5-second intro remains part of the observed mobile timeline.

### Network and asset result

| Form factor | Measurement    |     M1A median |    M1B median |     Change |
| ----------- | -------------- | -------------: | ------------: | ---------: |
| Desktop     | Requests       |             36 |            27 |         -9 |
| Desktop     | Image requests |             14 |             5 |         -9 |
| Desktop     | Image transfer |    1,176,757 B |     349,514 B |       -70% |
| Mobile      | Requests       |             36 |            28 |         -8 |
| Mobile      | Image requests |             14 |             6 |         -8 |
| Mobile      | Image transfer |    1,176,757 B |     361,232 B |       -69% |
| Both        | Team images    | 11 / 822,082 B | 3 / 223,054 B | -73% bytes |

The carousel initially mounts Ferrari plus its wrapped neighbours, Cadillac and McLaren. It adds the new active car and adjacent images only as navigation advances, retaining already decoded images to avoid a flash when users move back. The original 246,326-byte full logo remains as a rollback source; the rendered full logo is a 430×160 WebP of 29,830 bytes, an 87.9% source-size reduction. Navbar source selection now requests the compact PNG below 640 px and the full WebP above it instead of downloading both navbar variants.

### Functional and visual verification

- Browser QA confirmed the intro exists after refresh with all ten lamp elements, Skip dismisses it, Escape dismisses it, and reduced-motion uses no continuous speed-line animation plus the quiet brand fade.
- Browser QA observed one ready hero request, 11 carousel panels, and only three initial team images. ArrowRight moved focus and expansion to panel 1, pointer hover expanded panel 5, and an emulated touch tap expanded panel 7. The touch run first exposed a synthetic click toggle; `onTouchEnd` now handles touch directly and prevents that duplicate click.
- Five final screenshots at 390×844, 768×1024, 1280×900, 1440×1000, and 1920×1080 are under [`m1b/screenshots/`](m1b/screenshots/). The first 1440 capture occurred before the asynchronous hero decode and was replaced by a CDP capture after `naturalWidth > 0`; the final set shows the hero at every width.
- Raw before/after Lighthouse reports are under [`m1b/`](m1b/), the complete comparison is in [`m1b/lighthouse-summary.csv`](m1b/lighthouse-summary.csv), and the interaction evidence is in [`m1b/browser-qa.json`](m1b/browser-qa.json).

### Exact M1B changed files

Application and tests:

- `index.html`
- `public/logo/logo-full.webp`
- `src/main.tsx`
- `src/components/analytics/SpeedInsightsRoute.tsx`
- `src/components/analytics/speedInsightsRouteUtils.ts`
- `src/components/analytics/SpeedInsightsRoute.test.ts`
- `src/components/common/OfficialBrandLogo.tsx`
- `src/components/home/PodiumBrandHero.tsx`
- `src/components/home/FullscreenCarStage.tsx`
- `src/components/home/carStageLoading.ts`
- `src/components/home/carStageLoading.test.ts`
- `src/components/layout/Navbar.tsx`

Evidence and formatting:

- `.prettierignore`
- `docs/performance/m1b/before/lighthouse/*.json`
- `docs/performance/m1b/after/lighthouse/*.json`
- `docs/performance/m1b/lighthouse-summary.csv`
- `docs/performance/m1b/browser-qa.json`
- `docs/performance/m1b/screenshots/*.png`
- `docs/performance/optimization-results.md`
- `docs/performance/release-gates.md`

### M1B checks, limitations, and rollback

- `npm run lint`, `npm run test`, `npm run test:coverage`, and `npm run build:check` pass locally. The suite has 29 files and 215 tests; coverage remains 63.2% statements, 59.8% branches, 68.51% functions, and 63.96% lines. Initial JavaScript is 109.7 KiB gzip against the 180 KiB limit.
- The first format check included the raw Lighthouse JSON and failed. `.prettierignore` now excludes M1B raw reports, and the final format check passes.
- Implementation SHA `8fd843b24ea66476cd6eab3c82c2f81da37b4e27` passed [CI run 38544072976](https://github.com/DB-Ducbao113/F1-Overview/actions/runs/38544072976). Vercel reported the matching [Preview deployment](https://podiumeffetdesol-olobsm68r-bao-bung-bu.vercel.app) Ready; its [deployment dashboard](https://vercel.com/bao-bung-bu/podiumeffetdesol/3DjddkpScxUJBqM7Zsfb6HH32UAu) also reports success.
- [Preview Smoke run 38544181385](https://github.com/DB-Ducbao113/F1-Overview/actions/runs/38544181385) passed target validation, then deliberately skipped k6 setup and the live smoke because `VERCEL_PROTECTION_BYPASS` is not configured. No smoke or high-load request was sent to Preview or Production.
- Mobile lab LCP remains above the 2.5-second release gate because the requested intro remains visible for 2.5 seconds and CPU-throttled timers extend its observed transition. M1B improves it without shortening or visually degrading the intro, but this gate remains open.
- Explicit Speed Insights `route={pathname}` and query/hash stripping are implemented. Correct named aggregation cannot be claimed until the Preview/Production deployment accumulates real samples.
- Roll back M1B by reverting its implementation commit. Individual rollback paths are: remove the two image preloads, restore all carousel image mounts, restore `logo.png` plus the two navbar logo instances, and restore the inline Speed Insights callback in `src/main.tsx`.

## M2 result — Season and Teams

M2 was measured locally from the M1B head with Chrome 155 and Lighthouse 13.5.0. Each route and form factor has three cold-cache runs before and after the implementation. Medians below compare the same local production build setup; Production field data is not available because this branch is not merged.

| Route       | Form    | Metric            |                Before |                 After |             Change |
| ----------- | ------- | ----------------- | --------------------: | --------------------: | -----------------: |
| Season 2026 | Desktop | Score / FCP / LCP |     97 / 477 / 874 ms |     98 / 441 / 758 ms | +1 / -36 / -116 ms |
| Season 2026 | Mobile  | Score / FCP / LCP | 81 / 2,240 / 4,338 ms | 83 / 2,153 / 4,002 ms | +2 / -87 / -336 ms |
| Season 2025 | Desktop | Score / FCP / LCP |     97 / 465 / 863 ms |     98 / 440 / 756 ms | +1 / -25 / -107 ms |
| Season 2025 | Mobile  | Score / FCP / LCP | 81 / 2,240 / 4,104 ms | 83 / 2,153 / 4,003 ms | +2 / -87 / -101 ms |
| Teams       | Desktop | Score / FCP / LCP |     98 / 424 / 862 ms |     98 / 439 / 874 ms |   0 / +15 / +12 ms |
| Teams       | Mobile  | Score / FCP / LCP | 81 / 2,077 / 4,416 ms | 83 / 2,150 / 4,107 ms | +2 / +73 / -309 ms |

CLS stayed at 0.000 for both Season routes and at 0.002 Desktop / 0.000 Mobile for Teams. Desktop Teams' 12 ms LCP and 15 ms FCP increases are below 2% and within run-to-run noise; transferred bytes fell materially. Mobile LCP remains above 2.5 seconds on every target route because the requested intro remains unchanged.

### Evidence and implementation

The baseline waterfall made no API request on Season 2026, Season 2025, or Teams, so M2 does not alter API, store synchronization, snapshots, standings, schedules, or classifications. The baseline React Profiler recorded Season at 15.6 ms for mount plus 8.9 ms for its immediate update and Teams at 20.9 ms for mount, with no navigation `RunTask` over 50 ms. This did not support broad memoization or virtualization.

Season instead loaded 18 scripts on its default Standings tab, including Calendar, Results, Teams, Drivers, and three classification modals. `ChampionshipView` now keeps Standings in the initial chunk and lazy-loads the selected secondary tab behind a stable local skeleton. Race, Practice, and Qualifying classification modals load only when opened. The median Season request count falls from 29 to 23 on Desktop and from 30 to 24 on Mobile; script transfer falls from 179 KiB to 138 KiB. Navigation QA confirms all deferred tabs and result modals still open correctly.

Teams' native lazy loading fetched 11 car images on Desktop and 8 on Mobile during a cold load. `ViewportImage` now mounts team and driver images within 150 px of the viewport, preserving each banner's aspect ratio and loading remaining images during scroll. Median Teams image transfer falls from 926 to 536 KiB on Desktop and from 613 to 208 KiB on Mobile. Browser QA observed six team images initially at 1280 px and all eleven after progressive scrolling.

### Functional and visual validation

- Season switching changed `/season/2026` to `/season/2025`; Driver and Constructor standings rendered 22 and 10 rows respectively.
- Calendar rendered 24 expandable rounds. Results loaded on demand, opened a classification with three rows, and the focused close control worked from the keyboard.
- Teams rendered 11 cards. Searching for `Mercedes` returned four valid matches because the search includes power-unit data; clearing restored all 11 cards.
- Vietnamese and English switching changed the heading between `Trung Tâm Giải Đấu` and `Championship Hub`.
- Keyboard Tab produced a visible link focus target. No document-level horizontal overflow occurred at 390, 768, 1280, 1440, or 1920 px.
- No F1 API request occurred during the functional run. Local-only 404 responses came from Vercel Analytics and Speed Insights endpoints, which are unavailable under `vite preview`; they are not application asset failures.
- Fifteen screenshots cover Season 2026, Season 2025, and Teams at all five required widths under [`m2/screenshots/`](m2/screenshots/). Raw Lighthouse reports, the complete run CSV, navigation traces, and browser QA are under [`m2/`](m2/).
- The intro source files were not edited. Their SHA-256 values remain `847C71C493EB2BDC08C89CB17E81FFDD1AA79D73FDA130998CA7CDD98231028F`, `7757B05F5BDADE05EE97C50F2E8176294A5F0A3B3254B604772665F6CBFFEFD0`, and `407B927FAD936039CE4EDD718B983533DD6CF5933788A60173FD3ECACB421918` for the component, stylesheet, and timing module.
- Homepage regression checks produced Desktop 99/98/99 with median FCP 458 ms, LCP 879 ms, TBT 0 ms, CLS 0.000 and Mobile 84/84/84 with median FCP 2,148 ms, LCP 4,067 ms, TBT 30 ms, CLS 0.000. Mobile matches M1B. The Desktop median is 103 ms above M1B because M1B selected the smaller navbar logo as LCP in two runs; the one M1B run that selected the hero measured 878 ms, matching M2's 879 ms hero candidate. No Homepage, intro, font, logo, or hero source changed in M2.

### Exact M2 changed files

Application:

- `src/components/championship/ChampionshipView.tsx`
- `src/components/championship/RaceCalendar.tsx`
- `src/components/championship/RaceResults.tsx`
- `src/components/common/ViewportImage.tsx`
- `src/components/pages/DriversDirectoryPage.tsx`
- `src/components/pages/TeamsDirectoryPage.tsx`

Evidence and documentation:

- `.prettierignore`
- `docs/performance/m2/before/lighthouse/*.json`
- `docs/performance/m2/before/profiling/*`
- `docs/performance/m2/after/lighthouse/*.json`
- `docs/performance/m2/lighthouse-runs.csv`
- `docs/performance/m2/browser-qa.json`
- `docs/performance/m2/regression/lighthouse/*.json`
- `docs/performance/m2/screenshots/*.png`
- `docs/performance/optimization-results.md`
- `docs/performance/release-gates.md`

### Risks and rollback

- Images are mounted by `IntersectionObserver`; browsers without it use the eager fallback. A card still reserves its fixed banner ratio before the image arrives. Roll back by replacing `ViewportImage` with the original native-lazy `<img>` elements and deleting the helper.
- A first visit to Calendar, Results, Teams, or Drivers may show the local skeleton while its chunk downloads. Roll back by restoring static imports in `ChampionshipView`; modal imports can be reverted independently.
- Local gates pass: lint, format, 29 test files / 215 tests, coverage, production build, and the 109.7 KiB initial JavaScript budget. Coverage remains 63.2% statements, 59.8% branches, 68.51% functions, and 63.96% lines.
- Implementation SHA `c2a92537ff244ac9d96eb64a3161071012e73410` passed [CI run 38552026235](https://github.com/DB-Ducbao113/F1-Overview/actions/runs/38552026235). Vercel reported the matching deployment Ready in its [deployment dashboard](https://vercel.com/bao-bung-bu/podiumeffetdesol/8sHTVcbfeT9ehYEZ8twQieBFhbdP). The branch [Preview alias](https://podiumeffetdesol-git-perf-speed-insights-v2-bao-bung-bu.vercel.app) is protected and returns the expected SSO redirect to unauthenticated requests.
- [Preview Smoke run 38552129395](https://github.com/DB-Ducbao113/F1-Overview/actions/runs/38552129395) passed target validation. k6 setup and the live smoke were explicitly skipped because `VERCEL_PROTECTION_BYPASS` is not configured; no live smoke or high-load request was sent to Preview or Production.
- Docker publishing is not applicable to `perf/**` and did not run. Local lab results do not establish Production field improvement because M2 is not merged.

## M3B.1 result — Showroom demand-driven rendering

M3B.1 changes the visible Showroom Canvas from a continuous frame loop to demand rendering while retaining the existing hidden-tab and off-screen `never` states. Explicit invalidation covers initial/model/material readiness, preset and orbit camera motion, damping, auto-rotation, livery and backdrop textures, hotspots/Drei HTML state, resize, language, visibility restoration, and WebGL restoration. No separate RAF loop, quality reduction, texture cache, shader warm-up, adaptive DPR, or responsive redesign was introduced.

Three cold Lighthouse runs per profile produced these medians against the M3A baseline:

| Profile | Metric      |       M3A |     M3B.1 | Change |
| ------- | ----------- | --------: | --------: | -----: |
| Desktop | Score       |        45 |        47 |     +2 |
| Desktop | LCP         |  2,799 ms |  2,785 ms | -14 ms |
| Desktop | TBT         |  4,078 ms |  2,925 ms | -28.3% |
| Desktop | Main thread |  8,238 ms |  6,358 ms | -22.8% |
| Mobile  | Score       |        31 |        31 |      0 |
| Mobile  | LCP         | 16,367 ms | 16,336 ms | -31 ms |
| Mobile  | TBT         | 14,160 ms | 13,125 ms |  -7.3% |
| Mobile  | Main thread | 28,722 ms | 27,678 ms |  -3.6% |

With auto-rotation off and the camera settled, the final instrumented ten-second window contains zero RAF callbacks and zero WebGL draws. Camera presets, orbit drag plus damping, livery switching, hotspot open/close, language, resize, hidden-tab restoration, off-screen restoration, and WebGL context restoration all repaint and return to zero recurring draws. Auto-rotation remains continuous: 285 callbacks and 31,768 indexed draws over ten seconds, comparable to M3A's 278 callbacks and 30,963 draws over 10.55 seconds.

Before/after screenshots at 390, 768, 1280, 1440, and 1920 use the same overview camera, Mercedes livery, lighting, DPR, and auto-rotation-off state. Visual review found no quality or layout change, and document overflow remains zero. Full results, raw Lighthouse reports, interaction JSON, Chrome traces, CSV, screenshots, risks, and rollback steps are in [`m3/m3b1-results.md`](m3/m3b1-results.md).

Evidence and deployment:

- Implementation SHA `f6bde5474d9692ef3fa58e8cd466a76abc14f202` passed [CI run 38667313537](https://github.com/DB-Ducbao113/F1-Overview/actions/runs/38667313537). Vercel deployed the branch preview at the protected [Preview alias](https://podiumeffetdesol-git-perf-speed-insights-v2-bao-bung-bu.vercel.app) returning the expected SSO redirect.
- [Preview Smoke run 38667377888](https://github.com/DB-Ducbao113/F1-Overview/actions/runs/38667377888) passed target validation. k6 setup and the live smoke were explicitly skipped because `VERCEL_PROTECTION_BYPASS` is not configured; no live smoke or high-load request was sent to Preview or Production.
- Docker publishing is not applicable to `perf/**` and did not run. Stop after M3B.1 for review before M3B.2; do not merge into main.

## M3B.2 result — Showroom motion lifecycle and reduced motion

M3B.2 builds on the M3B.1 demand renderer and adds an explicit motion-state model plus full `prefers-reduced-motion` support, without touching geometry, materials, textures, reflection, DPR, lighting, camera presets, or any F1 data source.

- `src/components/showroom/showroomMotionState.ts` (new) defines nine motion states (`initial`, `autoRotate`, `orbit`, `damping`, `preset`, `static`, `hidden`, `offscreen`, `contextLost`). Only the five active states request frames; the settled scene resolves to `static` and keeps M3B.1's zero recurring draws. The Canvas frame-loop mapping (`demand`/`never`) is unchanged.
- `src/hooks/useReducedMotion.ts` (new) tracks `prefers-reduced-motion: reduce` live, including mid-session changes while the Showroom is open, with a listener that is removed on unmount (no duplicate callbacks).
- `ShowroomView.tsx` defaults auto-rotation to OFF for reduced-motion users, stops it immediately when the preference turns ON mid-session, and includes the flag in `sceneRevision` so the frame invalidator repaints without a reload.
- `CameraController.tsx` receives `reducedMotion` and, under it, forces OrbitControls auto-rotation off, disables damping, and shortens the post-drag tail from 2,000 ms to 0 ms so drags settle instantly with no trailing frames. Manual orbit, wheel-zoom, presets, hotspots, and livery switching are untouched and remain fully functional.
- `src/index.css` extends the existing reduced-motion media query to disable ten continuously looping utility animations (pulse, ping, bounce, spin, float, glow, marquee, stream, entrance) covering the Showroom HUD indicator dots. One-shot feedback animations remain so every control stays visible.

Local verification on the implementation worktree: ESLint pass, Prettier format pass, 30 test files / 224 tests pass (+9 new motion/reduced-motion tests), coverage unchanged at 63.2% statements, production build passes with initial JavaScript at 109.7 KiB gzip (budget 180 KiB), Showroom chunk 90.95 KiB gzip (+0.29), and `vendor-three` unchanged at 249.28 KiB gzip and route-isolated.

Browser-instrumented QA and Lighthouse evidence for M3B.2 are **pending execution** with the same harness as M3B.1 and are tracked with explicit `pending` markers in [`m3/m3b2-results.md`](m3/m3b2-results.md), [`m3/artifacts/m3b2-before-after.csv`](m3/artifacts/m3b2-before-after.csv), and [`m3/artifacts/m3b2-interaction-qa.json`](m3/artifacts/m3b2-interaction-qa.json); no unexecuted browser measurement is claimed. Full results, pending-measurement list, and rollback steps are in [`m3/m3b2-results.md`](m3/m3b2-results.md).

## M3B.2 final verification and M3B.3 result � texture cache

M3B.2's pending browser/Lighthouse evidence gate is closed in
[`m3/m3b2-final-verification.md`](m3/m3b2-final-verification.md): static idle
(0 rAF / 0 draws), mobile 4x CPU-throttled idle (0/0), motion lifecycle QA,
and three-run Lighthouse per profile are recorded; secondary windows that rely
on unchanged M3B.1 code paths are explicitly marked not re-executed.

M3B.3 adds a bounded, reference-counted procedural texture cache
(`src/components/showroom/showroomTextureCache.ts`) with two namespaces (car,
studio), keys including team and language, and retention of the active set
plus one inactive set. `F1Car3DModel` and `StudioW15Stage` acquire through the
cache and release references instead of disposing; route unmount disposes
everything. Ten unit tests cover hits/misses, refcounts, eviction, key
separation, no-disposed-reuse, concurrent same-key acquisition, and
stale-handle safety. Livery-switch long tasks: cold generation unchanged
(476 ms first Ferrari), cache-hit return 122 ms, rapid-cycle p50 180 ms with
all post-first-generation tasks under the 200 ms target. Zero recurring idle
draws hold on desktop and 4x-throttled mobile. Lighthouse medians (Desktop 46,
Mobile 31) overlap the M3B.1 baseline within run variance; a paired re-run is
registered as follow-up. Full details, exact files, and rollback are in
[`m3/m3b3-results.md`](m3/m3b3-results.md).

## M3B.4 result — Showroom WebGL initialization

M3B.4 keeps all visual resources and moves procedural initialization into bounded, cancellable tasks. Car and studio texture sets are prepared one slot at a time and committed atomically through the hardened cache. The 512 px wheel texture now reads its physical 512 × 512 backing store instead of allocating and scanning an unused logical 1024 × 1024 region. `ShowroomStartupCoordinator` waits for the named car/studio roots, uses `WebGLRenderer.compileAsync` with a compatibility fallback, requests a submitted frame, and then dismisses the loader.

The required fixed-build, alternating five-run Lighthouse comparison produced these medians:

| Profile | Baseline TBT | M3B.4 TBT | Change | Baseline main thread | M3B.4 main thread |                LCP |
| ------- | -----------: | --------: | -----: | -------------------: | ----------------: | -----------------: |
| Desktop |     5,299 ms |  4,790 ms |  -9.6% |            10,613 ms |         10,209 ms |   2,869 → 2,859 ms |
| Mobile  |    20,808 ms | 18,702 ms | -10.1% |            40,429 ms |         33,819 ms | 16,480 → 16,478 ms |

Idle with auto-rotation off remains at zero RAF callbacks and zero WebGL draws for ten seconds. Camera presets, orbit/damping, auto-rotation, livery, hotspots, language, resize, hidden/off-screen restoration and context restoration passed instrumented browser QA. Five widths from 390 to 1920 px have zero overflow and same-camera screenshots show no visible quality change.

The stricter complete-frame readiness gate increases the measured first-usable proxy from about 4,301 to 7,223 ms desktop and 5,820 to 9,384 ms mobile. Both absolute TBT targets also remain unmet. M3B.4 is therefore **NO-GO for Production** despite the verified reduction in blocking work. Full evidence, experiments, risks and rollback are in [`m3/m3b4-results.md`](m3/m3b4-results.md), with raw reports in [`m3/artifacts/m3b4/`](m3/artifacts/m3b4/).

Local validation passes: ESLint, Prettier, 33 test files / 246 tests, coverage (63.2% statements), and production build/bundle budget. The Showroom chunk is 93.62 KiB gzip and `vendor-three` remains 249.28 KiB gzip. Implementation SHA `fb1184918df6e5e5e673c00956aaddc2ef0a6466` passed [CI 38718226381](https://github.com/DB-Ducbao113/F1-Overview/actions/runs/38718226381), Vercel reported the matching Preview Ready, and [Preview Smoke 38718313823](https://github.com/DB-Ducbao113/F1-Overview/actions/runs/38718313823) passed target validation with k6/live smoke explicitly skipped.

## M3B.4.1 result — Showroom startup readiness hotfix

M3B.4.1 removes the startup race in which React Three Fiber's automatic render ran after `compileAsync` began and forced the same full scene through a competing synchronous render path. The startup coordinator now owns the render pass, waits for explicit committed car/studio texture and material readiness, skips competing draws during compilation, submits one complete frame and only then clears the loader. Demand rendering and every visual resource remain unchanged.

Five cold readiness runs reduced median loader removal from 8,031 to 4,940 ms desktop and 11,492 to 7,335 ms on 4x CPU-throttled mobile. Median first successful interaction improved from 8,063 to 4,976 ms desktop and 12,009 to 7,586 ms mobile.

The fixed-build alternating five-run Lighthouse comparison also preserved and improved M3B.4's blocking-work result:

| Profile | Metric      |     M3B.4 |   M3B.4.1 |         Change |
| ------- | ----------- | --------: | --------: | -------------: |
| Desktop | TBT         |  2,137 ms |  1,870 ms |         -12.5% |
| Desktop | Main thread |  5,210 ms |  4,177 ms |         -19.8% |
| Desktop | LCP         |  2,848 ms |  2,846 ms |          -2 ms |
| Mobile  | TBT         | 12,160 ms |  9,229 ms |         -24.1% |
| Mobile  | Main thread | 19,461 ms | 14,510 ms |         -25.4% |
| Mobile  | LCP         | 16,477 ms | 16,560 ms | +83 ms / +0.5% |

Executed browser QA passed the complete readiness order, settled zero-draw idle, camera/preset/auto-rotation, livery, language, live reduced motion, WebGL restore and five route enter/exit cycles. Same-state captures at 390, 768, 1280, 1440 and 1920 px were pixel-identical with zero overflow. Full measurements, raw reports, screenshots, exact files and rollback are in [`m3/m3b4-1-startup-hotfix.md`](m3/m3b4-1-startup-hotfix.md).
