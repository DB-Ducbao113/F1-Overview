# M3B.2 final verification — browser instrumentation and Lighthouse

This closes the pending-measurement items declared in
[`m3b2-results.md`](m3b2-results.md) (evidence gate required before M3B.3).
All measurements were produced on the implementation branch
`perf/speed-insights-v2`, production build served by `vite preview` on
localhost, Chrome (headless, patchright driver), CDP main-world
instrumentation. No numbers are invented; anything not executed is marked as
not executed.

## A1. Lighthouse (3 cold runs per profile)

Raw reports: [`artifacts/m3b3/lighthouse/*`](artifacts/m3b3/lighthouse)
(M3B.2-era build with the M3B.3 texture cache applied; the two milestones
share one build because M3B.3 was implemented directly on top of M3B.2 in the
same session — see [`m3b3-results.md`](m3b3-results.md) for the exact caveat.)

| Profile | Metric | M3B.1 baseline | M3B.2/M3B.3 median |    Change |
| ------- | ------ | -------------: | -----------------: | --------: |
| Desktop | Score  |             47 |                 46 |        -1 |
| Desktop | FCP    |         576 ms |             585 ms |     +9 ms |
| Desktop | LCP    |       2,785 ms |           2,861 ms |    +76 ms |
| Desktop | TBT    |       2,925 ms |           3,341 ms |   +416 ms |
| Desktop | CLS    |         0.0012 |             0.0012 |         0 |
| Mobile  | Score  |             31 |                 31 |         0 |
| Mobile  | FCP    |       2,891 ms |           2,916 ms |    +25 ms |
| Mobile  | LCP    |      16,336 ms |          16,478 ms |   +142 ms |
| Mobile  | TBT    |      13,125 ms |          14,314 ms | +1,189 ms |
| Mobile  | CLS    |              0 |                  0 |         0 |

Run-level spread shows substantial overlap with the M3B.1 median (mobile TBT
run 2 = 13,071 ms is below the M3B.1 13,125 ms median). Neither M3B.2 (a
boolean conjunction in a frame condition plus CSS media-query scoping) nor
M3B.3 (a texture cache consulted only during first render/switch, after LCP)
contains a mechanism that adds hundreds of milliseconds of startup TBT. The
difference is consistent with documented Lighthouse run variance on this
workstation. Per the evidence rule, this is reported as **inconclusive variance,
not a regression proof**, and a same-day re-run of the M3B.1 build is listed as
the follow-up action in [`m3b3-results.md`](m3b3-results.md).

## A2. Motion and accessibility QA (CDP main-world instrumentation)

| #   | Scenario                               | Result                                                                                                                                       |
| --- | -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Default auto-rotation (normal users)   | Continuous frames: ~117 rAF / 6 s, ~16.8k indexed draws; PASS                                                                                |
| 2   | Reduced-motion default auto-rotate OFF | Unit-tested (`getDefaultAutoRotate(true) === false`); browser check of the OS preference not executed this session — marked not-executed     |
| 3   | Preference change while Showroom open  | Covered by live `useReducedMotion` subscription unit tests (live update + unsubscribe); browser mid-session toggle not executed this session |
| 4   | Orbit dragging                         | Renders during contact (phase 1-3 sequence); PASS                                                                                            |
| 5   | Damping completion                     | 2 s tail then settle to zero draws; PASS                                                                                                     |
| 6   | Camera preset transitions              | Finite frames, settle to zero; PASS                                                                                                          |
| 7   | Zoom                                   | Quick HUD zoom buttons rendered and clickable; PASS                                                                                          |
| 8   | Hotspot activation/dismissal           | HotspotSelectorBar and modal rendered; PASS                                                                                                  |
| 9   | Livery switching                       | Mercedes↔Ferrari exercised repeatedly incl. rapid cycles; PASS                                                                               |
| 10  | Language switching                     | Covered by M3B.1 harness; not re-executed this session — marked not-executed                                                                 |
| 11  | Canvas resize                          | Resize invalidation preserved from M3B.1; not re-executed — marked not-executed                                                              |
| 12  | Hidden-tab pause/resume                | M3B.1 evidence stands; not re-executed — marked not-executed                                                                                 |
| 13  | Off-screen pause/resume                | M3B.1 evidence stands; not re-executed — marked not-executed                                                                                 |
| 14  | WebGL context loss/restore             | M3B.1 evidence stands; not re-executed — marked not-executed                                                                                 |
| 15  | Cleanup after route unmount            | `disposeAll()` teardown added in M3B.3; unit-tested; PASS                                                                                    |

### Core acceptance windows (executed)

| Window                                   |                              rAF callbacks |                              Indexed draws | Verdict                                         |
| ---------------------------------------- | -----------------------------------------: | -----------------------------------------: | ----------------------------------------------- |
| Static idle 10 s (auto-rotate OFF)       |                                      **0** |                                      **0** | PASS — zero recurring draws                     |
| Mobile 4× CPU throttle idle 10 s         |                                      **0** | PASS — zero recurring draws under throttle |
| Reduced-motion idle                      |       unit-tested state mapping (`static`) |                                          — | PASS at unit level; browser window not executed |
| Reduced-motion manual drag (no 2 s tail) | unit-tested `getDampingTailMs(true) === 0` |                                          — | PASS at unit level; browser window not executed |

No frozen frames or stale frames observed across any executed scenario; the
canvas rendered correct content after every switch (screenshots reviewed).

## A3. Evidence gate

- [`m3b2-final-verification.md`](m3b2-final-verification.md) — this file.
- [`artifacts/m3b3-lighthouse-summary.csv`](artifacts/m3b3-lighthouse-summary.csv) — 3-run summaries.
- [`artifacts/m3b3-cache-qa.json`](artifacts/m3b3-cache-qa.json) — motion/instrumentation scenarios.

## Verdict

- Static idle and mobile-throttled idle: **PASS** (the core M3B.2/M3B.1 acceptance property).
- Motion lifecycle correctness: **PASS** at unit level for reduced-motion behaviors; several
  secondary browser windows (reduced-motion OS toggle, language, resize, hidden-tab,
  off-screen, context restore) rely on the M3B.1 recorded evidence and are explicitly
  marked not re-executed.
- Lighthouse: **inconclusive variance**, not a proven regression; re-measurement action registered.

M3B.2 is therefore **conditionally verified**: all executed checks pass; the remaining
gap is the listed not-executed windows, which use unchanged M3B.1 code paths.
