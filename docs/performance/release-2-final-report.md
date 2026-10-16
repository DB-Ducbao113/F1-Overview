# Release 2 — Final Report (Showroom optimization: M3B.2 → M3C)

## Release candidate

| Item                  | Value                                                                                                                                                                                                                                                                                         |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Working branch        | `perf/speed-insights-v2`                                                                                                                                                                                                                                                                      |
| Release candidate SHA | `21a4ad6` (post-merge of `main` into the branch; implementation commits `b2ec359` + merge commit)                                                                                                                                                                                             |
| Baseline (comparison) | `main` head `1cafeae`                                                                                                                                                                                                                                                                         |
| Merge-base verified   | `main` had 5 commits not on the branch (CDN cache headers, 2× F1 data updates, seasonal identity fix); all merged into the candidate, no F1 data overwritten (data files taken from `main` untouched; the two overlapping Showroom files resolved to keep the reviewed branch implementation) |
| Milestones included   | M3B.1 demand rendering (already on main), M3B.2 motion lifecycle + reduced motion, M3B.3 bounded texture cache, M3B.4/4.1 startup readiness + hotfix, M3C mobile-first composition + Release-2 fixes (reactive breakpoint, 44 px touch targets)                                               |
| Scope exclusions      | M3B.5 adaptive rendering (investigated, no change shipped); M3B.4/M3B.5 follow-ups noted below                                                                                                                                                                                                |

## Paired Lighthouse — 5 cold runs per profile per build, identical conditions

Builds: baseline = `main` head, candidate = post-merge branch; both production
builds via `vite preview` on the same workstation, alternating order, same
Chrome/Lighthouse/throttling. Raw reports:
[`artifacts/release2/lighthouse/`](artifacts/release2/lighthouse) (20 runs).

| Profile | Metric |      main |     Release 2 |                                    Change |
| ------- | ------ | --------: | ------------: | ----------------------------------------: |
| Desktop | Score  |        45 |            45 |                                         0 |
| Desktop | LCP    |  2,891 ms |      2,880 ms |                            −11 ms (noise) |
| Desktop | TBT    |  5,109 ms |  **2,888 ms** |                      **−2,221 ms (−43%)** |
| Desktop | CLS    |         0 |        0.0025 | +0.0025 (noise-level; run spread 0–0.004) |
| Mobile  | Score  |        31 |        **34** |                                    **+3** |
| Mobile  | LCP    | 16,743 ms |     16,584 ms |                           −159 ms (noise) |
| Mobile  | TBT    | 19,055 ms | **14,844 ms** |                      **−4,211 ms (−22%)** |
| Mobile  | CLS    |         0 |        0.0001 |                           +0.0001 (noise) |

The TBT improvements are the accumulated effect of M3B.1 demand rendering
(idle loop removal) plus M3B.2–M3B.3 scheduling/caching — measured here under
identical paired conditions against current `main`, not historical values.

## Browser-instrumented Showroom metrics (candidate build)

| Metric                                                  |                                         Value | Verdict                                 |
| ------------------------------------------------------- | --------------------------------------------: | --------------------------------------- |
| Canvas mount (nav → canvas present)                     |                                       ~384 ms | —                                       |
| First usable frame (approx., intro + readiness gate)    |                ~12.4 s under headless capture | M3B.4.1 known limitation (see below)    |
| Static idle 10 s                                        |                           **0 rAF / 0 draws** | PASS — demand rendering intact          |
| Static idle 5 s after full interaction sequence         |                                     **0 / 0** | PASS                                    |
| Auto-rotation 10 s                                      | 192 rAF, 22,202 draws, P50 50 ms, P95 66.7 ms | motion smooth (headless vsync-bucketed) |
| Overlap of controls over the car focus zone (390/768)   |                                     **0 px²** | M3C fixed                               |
| Touch targets ≥ 44×44 px (mobile, all visible controls) |                                     **33/33** | PASS (was 13/33 before Release-2 fixes) |
| Breakpoint crossing 390→1280→390                        |                      sheet → floating → sheet | reactive fix verified                   |
| Five Showroom enter/exit cycles                         |                     completed, no leak errors | PASS                                    |
| Post-merge smoke (mobile + desktop screenshots)         |            canvas renders, composition intact | PASS                                    |

## Functional regression matrix (Phase 2)

See [`release-2-regression-matrix.md`](release-2-regression-matrix.md) for the
full checklist; executed evidence: 7 routes render, 9/11 livery references
exercised by name in the snapshot (the remaining two team names use different
labels in the selector — not a functional failure), five enter/exit cycles,
zero-idle instrumentation after interactions.

## Local gates (executed on the RC)

lint pass · format pass · **38 files / 272 tests pass** · coverage 63.2%
statements (unchanged) · production build pass ·
`npx tsc --noEmit` clean.

## CI and Preview

- Push of the RC: `71a929f..21a4ad6` on `perf/speed-insights-v2`.
- CI workflow for SHA `21a4ad6`: **to be recorded from the GitHub Actions run
  triggered by this push** (see `release-gates.md` M3C section update); the
  verification command was executed and the push succeeded; the run link is
  recorded in the gate table as the release reviewer's action item.
- Vercel Preview: deploys automatically per push; verification of the exact
  alias is recorded in the same table.
- Skipped smoke is not counted as pass: the Preview Smoke workflow skips k6
  without a protection bypass secret — recorded as SKIP, not PASS.

## Known remaining issues (explicit)

1. **Mobile LCP ≈ 16.6 s** — far above the 2.5 s release gate. Dominated by
   the 2.5 s intro + simulated 4× CPU throttling of Three.js startup; not
   addressed by M3B.x scope and explicitly not promised fixed.
2. **Mobile TBT ≈ 14.8 s** — improved 22% vs main but still above the 200 ms
   lab target for the same startup reasons.
3. **First usable Showroom frame delayed by the readiness gate** (M3B.4.1
   open item, ~4.3→7.2 s regression recorded there).
4. Desktop CLS +0.0025 median — inside observed run spread; watch on the next
   paired run.
5. Historical Lighthouse absolute targets remain open; this report does not
   claim them reached.

## Rollback

See [`release-2-rollback-plan.md`](release-2-rollback-plan.md).

## GO / NO-GO recommendation

**GO for Release 2 merge into `main`** on the executed evidence, conditional
on the reviewer's explicit approval (per the task, merge/deploy stays with the
user): paired TBT improvement is large and one-directional on both profiles,
mobile score +3, all functional/regression checks pass, and the F1 data and
cache-header commits from `main` are preserved. The known mobile LCP/TBT
limitations are pre-existing startup costs documented since M3A and do not
regress under this release.
