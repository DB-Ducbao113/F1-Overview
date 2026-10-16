# Release 2 — Regression matrix

Executed on the Release 2 candidate (`21a4ad6`, post-merge). Browser checks
use the headless CDP harness on `vite preview` production builds; unit tests
and gates are the project's own commands. Items marked "not re-executed" rely
on recorded milestone evidence with unchanged code paths.

## Routes and composition

| Area                                                         | Check                                                           | Result |
| ------------------------------------------------------------ | --------------------------------------------------------------- | ------ |
| `/` Homepage                                                 | Intro + hero render, body content present                       | PASS   |
| `/season/2026`                                               | Standings render (22 rows recorded in earlier QA; page renders) | PASS   |
| `/season/2025`                                               | Renders + season switcher                                       | PASS   |
| `/teams`                                                     | Directory renders                                               | PASS   |
| `/teams/mercedes`                                            | Team detail renders                                             | PASS   |
| `/drivers/antonelli`                                         | Driver page renders                                             | PASS   |
| `/showroom`                                                  | Canvas + all controls                                           | PASS   |
| Document overflow at 320/375/390/430/768/1024/1280/1440/1920 | 0 px each                                                       | PASS   |
| Desktop composition (>1023 px)                               | Identical to pre-M3C baseline captures                          | PASS   |

## Showroom functions

| Function                                     | Result                                                                                                                                                                 |
| -------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Loading state and readiness gate             | PASS (canvas mounts; loader path exercised in every visit)                                                                                                             |
| 11 liveries                                  | 9 switched by exact label in the automated pass; remaining two verified reachable by selector inspection — PASS with note                                              |
| 7 hotspots                                   | Selector bar + modal render; open/close exercised in M3C QA — PASS                                                                                                     |
| Orbit drag                                   | PASS (desktop + mobile)                                                                                                                                                |
| Camera presets                               | PASS (from bottom sheet on mobile; floating panel on desktop)                                                                                                          |
| Zoom (wheel mode + buttons)                  | PASS                                                                                                                                                                   |
| Auto-rotation                                | PASS (continuous; P50 50 ms headless)                                                                                                                                  |
| Reduced motion                               | Inherited M3B.2 behavior (auto-rotate default off, no damping tail, CSS block) — unit + unit/browser hybrid; OS-toggle browser window not re-executed — PASS with note |
| Language switching                           | Not re-executed this session (M3B.1 recorded; code path unchanged) — PASS by scope                                                                                     |
| Texture cache lifecycle                      | Unit tests (10) + browser cache-hit measurement (122 ms vs 476 ms) from M3B.3 — PASS                                                                                   |
| Hidden/off-screen pause                      | M3B.1 recorded; code path unchanged — PASS by scope                                                                                                                    |
| WebGL context restoration                    | M3B.1 recorded; guard code unchanged — PASS by scope                                                                                                                   |
| Five Showroom enter/exit cycles              | PASS (executed this session)                                                                                                                                           |
| Mobile breakpoint crossing (rotation/resize) | PASS (executed this session: 390→1280→390)                                                                                                                             |
| Touch targets ≥44 px mobile                  | PASS (33/33 measured)                                                                                                                                                  |
| Sheet scroll/safe-area/Escape                | PASS (overflow-y auto, overscroll contain, maxH dvh; Escape no error; not a dialog so no trap)                                                                         |
| Zero recurring idle draws                    | PASS (0 rAF / 0 draws after full interaction sequence)                                                                                                                 |
| Console errors                               | 0 real errors (local analytics 404s under `vite preview` are known artifacts)                                                                                          |

## Data and workflows

| Item                              | Result                                                                                   |
| --------------------------------- | ---------------------------------------------------------------------------------------- |
| F1 data files                     | Untouched by the branch; `main`'s data-update commits merged intact                      |
| Auto Update F1 Data workflow      | Unchanged (`auto-update-f1.yml` not modified by the branch; verified in merge file list) |
| Preview Smoke workflow            | Unchanged; skips k6 without bypass secret (SKIP, not PASS)                               |
| CDN cache headers (`vercel.json`) | Merged from `main` unchanged                                                             |
| Seasonal identity fix (`1cafeae`) | Merged; 272 tests including its updates pass                                             |

## Gates

| Gate                    | Result                                                                  |
| ----------------------- | ----------------------------------------------------------------------- |
| `npm run lint`          | PASS                                                                    |
| `npm run format:check`  | PASS                                                                    |
| `npm test`              | PASS (38 files / 272 tests)                                             |
| `npm run test:coverage` | PASS (63.2% statements)                                                 |
| `npm run build`         | PASS                                                                    |
| `npx tsc --noEmit`      | PASS                                                                    |
| GitHub CI on RC SHA     | Recorded in `release-gates.md` (run triggered by push)                  |
| Vercel Preview          | Auto-deploy per push; alias verification recorded in `release-gates.md` |
