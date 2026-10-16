# M3C — Mobile Showroom UX results

## Outcome

M3C ships an intentional mobile-first Showroom composition: on viewports up
to 1023 px the Control Dock starts **collapsed** and opens as a **full-width
bottom sheet**, the team badge collapses to a single compact line, and the
Quick HUD gains safe-area padding. The 3D car becomes the dominant visual on
phones and small tablets. Measured control-to-car overlap drops from
≈18,700 px² (six controls across the focus zone) to **0 px²** at 390 and 768
in the same measurement harness. Desktop composition (>1023 px) is unchanged.

## Implementation

- `src/components/showroom/showroomMobileLayout.ts` (new): width-based
  breakpoint (`<= 1023 px`), dock-default-expanded rule, 44 px touch-target
  constant, safe-area class. Width-based detection was chosen over
  pointer-based after headless capture verification: `emulateMedia`
  pointer features are not honored by the capture driver, and CSS-width
  behavior is identical on real devices and headless.
- `ShowroomControlDock.tsx`: receives `isMobileLayout`; starts collapsed on
  mobile (desktop keeps `expanded=true`); mobile renders as a fixed
  bottom sheet (`fixed inset-x-2 bottom-2`, max-height 70dvh, scrollable,
  overscroll-contain) instead of the floating top-right panel.
- `ShowroomView.tsx`: resolves the layout once per mount (no per-frame or
  resize oscillation); passes the flag to the dock; team badge collapses to a
  compact one-line pill on mobile (logo + short name, full name hidden);
  QuickHUD is wrapped in a safe-area bottom container.
- `ShowroomQuickHUD.tsx`: root switches from absolute page positioning to
  positioning inside the safe-area wrapper (visual position identical).
- No renderer, DPR, reflection, texture, or scheduling change.

## Before/after overlap audit (same CDP harness)

| Viewport                         |                     Before overlapping controls | After |
| -------------------------------- | ----------------------------------------------: | ----: |
| 390×844                          | 6 controls, ≈18,700 px² over the car focus zone | **0** |
| 768×1024                         |                  dock panel over rear wing area | **0** |
| Document overflow (all 9 widths) |                                            0 px |  0 px |

## Interaction QA (executed, 390×844)

- Dock opens/closes via the existing toggle (verified in DOM probe + screenshots).
- Camera preset click from the sheet works; canvas re-renders.
- Quick HUD zoom in/out works; auto-rotate toggle works.
- Orbit drag on the canvas works (no gesture conflict with the sheet).
- After all interactions, the 5 s static idle window records **0 rAF /
  0 draws** — M3B.1 demand rendering intact.
- 0 real console errors (the only 4xx are the local analytics endpoints
  absent under `vite preview`, a known local-only artifact).

## Paired Lighthouse (5 cold runs per device per build, alternating)

Fixed builds: baseline = branch HEAD `1cafeae` (M3C absent), candidate = M3C
applied; both production builds served by `vite preview`; identical Chrome
/Lighthouse/throttling. Raw reports:
[`artifacts/m3c/lighthouse/`](artifacts/m3c/lighthouse) (20 runs).

| Profile | Metric | Baseline median | M3C median |                                    Change |
| ------- | ------ | --------------: | ---------: | ----------------------------------------: |
| Mobile  | Score  |              31 |         32 |                                        +1 |
| Mobile  | LCP    |       16,740 ms |  16,675 ms |                                    −65 ms |
| Mobile  | TBT    |       18,907 ms |  19,048 ms |        +141 ms (~0.7%, inside run spread) |
| Mobile  | CLS    |               0 |     0.0001 |                           +0.0001 (noise) |
| Desktop | Score  |              45 |         44 |                           −1 (run spread) |
| Desktop | LCP    |        2,870 ms |   2,894 ms |                            +24 ms (noise) |
| Desktop | TBT    |        4,957 ms |   4,200 ms | −757 ms (run spread; not claimed as gain) |
| Desktop | CLS    |          0.0023 |     0.0025 |                           +0.0002 (noise) |

Conclusion: **no material Lighthouse or startup regression**. Every median
delta is inside the observed per-run spread for that profile; the UI change
touches only overlay composition after first paint, consistent with the
measured neutrality. TBT remains dominated by the known startup costs
(documented in M3B.4/M3B.4.1; unchanged scope here).

## Visual QA

Nine viewports captured after the change
([`artifacts/m3c/screenshots/`](artifacts/m3c/screenshots)): 320/375/390/430
mobile states show the collapsed dock, compact badge, and unobstructed car;
768 keeps the car fully visible; 1024–1920 match the pre-M3C desktop
composition (verified side-by-side against the baseline set captured in
Phase 1). Sheet-open state and the final post-interaction state captured at 390. No clipped buttons, no hidden hotspots, no modal/dock conflict, no
document overflow at any width.

## Files changed

- `src/components/showroom/showroomMobileLayout.ts` (new) + test (new)
- `src/components/showroom/ShowroomView.tsx`
- `src/components/showroom/ShowroomControlDock.tsx`
- `src/components/showroom/ShowroomQuickHUD.tsx`

## Gates

- lint: pass · format: pass · 34 files / 251 tests pass · build pass.
- CI/Preview for the final SHA: recorded after push in
  `release-gates.md` (updated alongside this report).

## Rollback

Revert the single M3C commit; the three touched components restore verbatim
and the two new files disappear. No asset/data migration.
