# Release 2 — Rollback plan

## Merge rollback (after merging `perf/speed-insights-v2` into `main`)

Preferred: a forward-fix revert commit on `main`.

```
git revert -m 1 <merge-commit-sha>
```

This restores `main` to the pre-Release-2 state (commit `1cafeae` content)
while keeping history. Vercel redeploys `main` automatically; verify
production serves the `main` asset hashes afterwards.

Emergency alternative (only if the revert itself is broken): force-reset
`main` to `1cafeae` and push with `--force-with-lease`, then immediately
re-apply `main`-only commits made after the merge (F1 data updates land
again on the next scheduled run — no permanent data loss; the auto-update
workflow regenerates them).

## Component-level rollbacks (partial, each independently revertible)

| Change                                                | Rollback action                                                                          | Risk                                                                                                       |
| ----------------------------------------------------- | ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| M3C mobile composition                                | Revert the M3C commit (`71a929f`) — restores the floating dock/badge; renderer untouched | Low; mobile overlap returns                                                                                |
| Reactive breakpoint + touch targets (Release-2 fixes) | Revert `b2ec359` — restores once-per-mount layout and compact targets                    | Low                                                                                                        |
| M3B.3 texture cache                                   | Revert the M3B.3 commit — generators go back to direct `useMemo` disposal                | Medium: first-generation path unchanged; livery switches regenerate every time                             |
| M3B.2 reduced motion                                  | Revert its commit — reduced-motion users get continuous rendering again                  | Accessibility regression; keep only with cause                                                             |
| M3B.1 demand rendering                                | Revert to `frameloop='always'` — restores idle rendering                                 | High idle CPU/GPU; this is the anchor optimization — do not revert unless a critical rendering bug appears |
| M3B.4.1 readiness gate                                | Revert its commit — loader hides earlier but first-frame correctness risk returns        | Medium                                                                                                     |

## Cache-header / data rollbacks

- `vercel.json` CDN cache headers: revert the `main` commit that added them
  (they are merged into the branch unchanged; a revert on `main` after merge
  applies to production).
- F1 data: never hand-rollback; the scheduled auto-update workflow
  regenerates and reconciles (it has self-healed transient weekend failures
  historically).

## Verification after any rollback

1. Exact-SHA CI run passes.
2. Vercel production serves the expected asset hashes (`curl` + compare with
   a local build of the reverted SHA).
3. Quick browser smoke: `/`, `/season/2026`, `/showroom` render; static idle
   instrumentation still shows 0 recurring draws if M3B.1 remains in place.
