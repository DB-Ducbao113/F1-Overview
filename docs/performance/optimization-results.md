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
