# Performance release gates

These gates apply to M1–M5. They use free local and GitHub Actions tooling and do not require a paid Vercel plan or service.

## Required checks for every optimization commit

- `npm run lint`
- `npm run format:check`
- `npm run test:coverage`
- `npm run build:check`
- No changes to F1 standings, calendars, classifications, or update scripts unless the change is explicitly a data correction and its data tests pass.
- Initial JavaScript must remain at or below 180 KiB gzip.
- Homepage, Season, Teams, Mercedes, and Antonelli must not request `vendor-three`, `ShowroomView`, or `c42.v2.glb`.

## Lighthouse acceptance

Use Chrome and Lighthouse versions pinned in CI. Run three cold-cache measurements and compare medians under identical settings.

| Gate              |   Desktop |    Mobile |
| ----------------- | --------: | --------: |
| Performance score |       ≥90 |       ≥90 |
| LCP               | ≤2,500 ms | ≤2,500 ms |
| TBT lab proxy     |   ≤200 ms |   ≤200 ms |
| CLS               |     ≤0.10 |     ≤0.10 |

An individual run may vary, but no run may regress more than 10% from the branch baseline without a documented trace explanation. Homepage and `/season/2026` are blocking routes. Showroom is also blocking after M3; until then, each Showroom change must improve TBT and preserve visual quality.

## Visual and functional regression gates

- Capture `/`, `/season/2026`, `/season/2025`, `/teams`, `/showroom`, `/teams/mercedes`, and `/drivers/antonelli` at 1280, 1440, 1920, 390, and 768 widths.
- Compare screenshots against the M0 set. Intentional changes require reviewed before/after images.
- Assert no horizontal document overflow at 390 and 768 widths.
- Verify intro lights, cue text, skip control, route navigation, language toggle, standings tabs, season switcher, team cards, driver/team links, and Showroom controls.
- Verify reduced-motion, hidden-tab, Save-Data, and mobile animation behavior.
- Verify all production network requests required by the active route return successful status codes.

## Automation design for M4

- Add Lighthouse CI or a pinned Lighthouse CLI job using the existing free GitHub-hosted runner.
- Add Playwright smoke and screenshot tests at the five required widths. Store only failure diffs as short-lived Actions artifacts to control repository size.
- Keep the existing CI and Docker workflows. Add jobs rather than replacing data-update or deployment behavior.
- Keep the bundle script and add route-chunk assertions for Three.js isolation.
- Run performance checks on pull requests and the target branch. Avoid running the full 35-screenshot matrix on scheduled F1 data-only commits unless UI files changed.

## Deployment gate

Before GO:

1. Record the exact target commit SHA.
2. Require the CI workflow to complete successfully for that SHA.
3. Require the Docker build/publish workflow to complete successfully where its branch trigger applies.
4. Verify Vercel production serves the target artifact hashes and record the deployment URL and response headers.
5. Repeat the seven-route browser smoke and three-run Lighthouse comparison against production.
6. Confirm Speed Insights receives named routes; keep query strings out of route aggregation.

## Field validation

Monitor the seven-day Hobby window and report P75 Desktop/Mobile FCP, LCP, INP, and CLS by path. Do not treat a route with fewer than 30 visits as stable evidence. At low volume, report the sample count and use lab traces as supporting evidence rather than declaring success.

## GO / NO-GO rule

GO requires all functional, visual, bundle, CI, deployment, and blocking Lighthouse gates to pass for the target commit. Any F1 data regression, failed workflow, unverified production artifact, horizontal overflow introduced by the change, or unexplained Core Web Vital regression is NO-GO.

## M1A gate status

| Gate                            | Status              | Evidence                                                                                                                                                                 |
| ------------------------------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Lint, format, tests, coverage   | Pass                | 27 test files and 210 tests; coverage remains 63.2% statements.                                                                                                          |
| Production build and bundle     | Pass                | 109.4 KiB initial JavaScript, below the 180 KiB limit.                                                                                                                   |
| Desktop Lighthouse              | Pass locally        | Three cold runs each for Homepage, Season 2026, and Teams; median CLS is 0.001, 0.001, and 0.003.                                                                        |
| Five-width visual review        | Pass for M1A scope  | 15 screenshots preserve typography and responsive layouts; delayed Homepage hero discovery remains assigned to M1B.                                                      |
| Load-test safety                | Pass                | High-load, spike, soak, and fault scripts require simulated fixtures; target and response behavior have automated tests.                                                 |
| F1 synchronization isolation    | Pass                | No F1 synchronization workflow, schedule, or data file changed.                                                                                                          |
| CI for `perf/**`                | Pass                | SHA `a3cec58`: [run 38535918940](https://github.com/DB-Ducbao113/F1-Overview/actions/runs/38535918940).                                                                  |
| Docker workflow                 | Not applicable      | The workflow intentionally does not publish branch builds and remains unchanged.                                                                                         |
| Preview smoke/Vercel deployment | Pass with skip      | Vercel Ready for `a3cec58`; [run 38536017325](https://github.com/DB-Ducbao113/F1-Overview/actions/runs/38536017325) verified the protected-preview guard and skipped k6. |
| Production field validation     | Pending later phase | M1A is not merged and cannot yet affect Production field data.                                                                                                           |

M1A branch verification is **GO**. Overall release remains **NO-GO for merge** because this task does not merge to `main`, Production field validation is pending, and M1B requires explicit approval.

## M1B gate status

| Gate                         | Status               | Evidence                                                                                                                                                                                                                                                                                                          |
| ---------------------------- | -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Lint, tests, coverage        | Pass locally         | 29 test files, 215 tests; coverage remains 63.2% statements.                                                                                                                                                                                                                                                      |
| Format                       | Pass locally         | Raw Lighthouse reports are ignored after the first format-check failure; the final check passes.                                                                                                                                                                                                                  |
| Production build and bundle  | Pass locally         | Initial JavaScript is 109.7 KiB gzip, below the 180 KiB limit.                                                                                                                                                                                                                                                    |
| Desktop Homepage Lighthouse  | Pass locally         | Three cold runs; median score 99, LCP 776 ms, TBT 0 ms, CLS 0.000.                                                                                                                                                                                                                                                |
| Mobile Homepage Lighthouse   | Partial              | Three cold runs; median score 84, LCP 4,068 ms, TBT 32 ms, CLS 0.000. The preserved 2.5-second intro keeps LCP above the 2.5-second gate.                                                                                                                                                                         |
| Hero discovery               | Pass locally         | Median request start 186 ms → 8 ms; one high-priority preloaded request and no duplicate.                                                                                                                                                                                                                         |
| Carousel network             | Pass locally         | Initial team images 11 → 3 and bytes 822,082 → 223,054; keyboard, pointer, and emulated touch navigation pass.                                                                                                                                                                                                    |
| Intro regression             | Pass locally         | Refresh, Skip, Escape, and reduced-motion behavior pass without changing the 2.5-second choreography.                                                                                                                                                                                                             |
| Five-width visual review     | Pass locally         | Final Homepage screenshots cover 390, 768, 1280, 1440, and 1920 px.                                                                                                                                                                                                                                               |
| F1 synchronization isolation | Pass                 | No F1 data, API, schedule, synchronization script, or data workflow changed.                                                                                                                                                                                                                                      |
| Target SHA CI and Preview    | Pass with smoke skip | SHA `8fd843b`: [CI 38544072976](https://github.com/DB-Ducbao113/F1-Overview/actions/runs/38544072976) and Vercel Preview passed. [Smoke 38544181385](https://github.com/DB-Ducbao113/F1-Overview/actions/runs/38544181385) validated the target but skipped k6 because no protection bypass secret is configured. |
| Docker workflow              | Not applicable       | `perf/**` does not trigger Docker publishing.                                                                                                                                                                                                                                                                     |

M1B branch verification and Preview deployment are **GO**. It remains **NO-GO for merge** until the user approves the next phase; the Mobile LCP release gate also remains explicitly open.
