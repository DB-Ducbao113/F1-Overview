# Optimization results

## M0 status

No performance optimization has been implemented. This document intentionally contains only the audited baseline so that later phases have an honest before/after comparison.

| Metric                             |         Before |       After M0 |
| ---------------------------------- | -------------: | -------------: |
| Homepage desktop Lighthouse median |             80 | Not applicable |
| Homepage mobile Lighthouse median  |             64 | Not applicable |
| Homepage desktop LCP median        |       1,473 ms | Not applicable |
| Homepage mobile LCP median         |       5,772 ms | Not applicable |
| Homepage desktop CLS median        |          0.233 | Not applicable |
| Initial JavaScript                 | 109.4 KiB gzip |      Unchanged |
| Showroom desktop TBT               |      33,251 ms | Not applicable |
| Showroom mobile TBT                |     154,181 ms | Not applicable |

## Validation performed

| Check                                         | Result                             | Detail                                                                                                   |
| --------------------------------------------- | ---------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `npm run lint`                                | Pass                               | No ESLint errors.                                                                                        |
| `npm test -- --run`                           | Pass                               | 26 files, 200 tests.                                                                                     |
| `npm run test:coverage`                       | Pass                               | 26 files, 200 tests; 63.2% statements and 63.96% lines in the configured service/utility scope.          |
| `npm run build:check`                         | Pass                               | Production build completed; initial JS 109.4 KiB gzip under 180 KiB.                                     |
| `npm run format:check` before artifact ignore | Fail                               | Raw Lighthouse JSON and downloaded production HTML are machine output and were not Prettier-formatted.   |
| Final `npm run format:check`                  | Pass                               | Machine-generated evidence paths are explicitly ignored; all authored files conform.                     |
| Production route smoke                        | Pass with noted visual defects     | All seven routes loaded at five widths; no HTTP request errors in run-1 Lighthouse reports.              |
| Latest-main CI                                | Pass                               | [CI run](https://github.com/DB-Ducbao113/F1-Overview/actions/runs/38511671924).                          |
| Latest-main Docker workflow                   | Pass                               | [Docker run](https://github.com/DB-Ducbao113/F1-Overview/actions/runs/38511671839).                      |
| Production deployment identity                | Pass with public-header limitation | Production entry asset hashes match the local build from `cfbd651`; public headers do not include a SHA. |

The expected machine-generated paths were added to `.prettierignore`; the final format check passes.

## Exact files changed in M0

Application source files changed: **none**.

Audit-owned changes are:

- `.prettierignore`
- `docs/performance/production-audit.md`
- `docs/performance/baseline.md`
- `docs/performance/bottlenecks.md`
- `docs/performance/optimization-results.md`
- `docs/performance/release-gates.md`
- `docs/performance/screenshots/*.png` — 35 viewport captures
- `docs/performance/lighthouse/*` — Lighthouse JSON, DevTools logs, and two compressed traces
- `docs/performance/artifacts/*` — headers, production HTML, Lighthouse/network/bundle summaries, and artifact manifest

Every generated file and SHA-256 hash is listed in [artifact-manifest.csv](artifacts/artifact-manifest.csv).

## Remaining risks

- Field RES will continue to include older deployments until the seven-day window rolls forward.
- `Unknown` route samples may remain visible for the same reason.
- One-run diagnostics for non-Homepage routes are insufficient for accepting a release; release measurements require three cold runs.
- Showroom's throttled trace is severe and must be reproduced with frame timing on representative hardware before a quality-preserving implementation is chosen.
- The 390px visual overflows are pre-existing and need explicit regression assertions.
