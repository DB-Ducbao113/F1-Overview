# M3B.2 Showroom motion lifecycle and reduced-motion results

## Scope

M3B.2 changes only Showroom motion lifecycle and accessibility behavior on top of the
M3B.1 demand renderer (`f6bde5474d9692ef3fa58e8cd466a76abc14f202`). Model geometry,
materials, procedural texture sizes, the 512 px reflection, DPR, lighting, shadows,
camera presets, hotspot and livery controls, loading UI, and responsive composition
remain unchanged. No F1 data, API, synchronization, Homepage, Season, or Teams source
was changed. M3B.1's demand scheduling is preserved: the Canvas stays in `demand`
while active and `never` when hidden, off-screen, or context-lost.

The comparison baseline is the M3B.1 evidence in
[`m3b1-results.md`](m3b1-results.md) and
[`artifacts/m3b1-interaction-qa.json`](artifacts/m3b1-interaction-qa.json).

## Implementation

### Motion lifecycle (`src/components/showroomMotionState.ts`, new)

Renderer activity is now an explicit, testable state machine with nine states:
`initial`, `autoRotate`, `orbit`, `damping`, `preset`, `static`, `hidden`,
`offscreen`, `contextLost`. Only the five active states
(`MOTION_ACTIVE_STATES`) request frames; the settled scene resolves to
`static` and stays at zero recurring draws exactly like M3B.1. The Canvas
frame-loop mode is derived by `getFrameLoopMode(isCanvasActive)` — the same
`demand`/`never` split as M3B.1 — so hidden-tab, off-screen, and context-loss
freezing are unchanged.

### Reduced-motion tracking (`src/hooks/useReducedMotion.ts`, new)

- `getReducedMotionPreference()` reads `prefers-reduced-motion: reduce` safely
  (returns `false` during SSR or without `matchMedia`).
- `subscribeReducedMotion()` subscribes to changes with the modern
  `addEventListener` API, falling back to the deprecated `addListener`, and
  returns an unsubscribe handle so no duplicate listeners accumulate across
  route mounts.
- `useReducedMotion()` re-renders live when the preference changes while the
  Showroom is open, so a mid-session preference change is honored without a
  reload. The scene-revision string includes the flag, so the M3B.1 frame
  invalidator repaints the scene on the change.

### Showroom behavior (`ShowroomView.tsx`, `CameraController.tsx`)

- Auto-rotation now defaults to OFF for reduced-motion users
  (`getDefaultAutoRotate`); normal users keep the previous ON default.
- When the preference turns ON mid-session, auto-rotation is stopped
  immediately. When it turns OFF, rotation is not forced back on — the user
  keeps manual control.
- `CameraController` receives `reducedMotion` and, under it:
  - `OrbitControls.autoRotate` is forced off even if the user re-enables the
    toggle during the same session;
  - damping is disabled (`enableDamping={!reducedMotion}`) and the post-drag
    damping tail is 0 ms instead of 2,000 ms, so a drag settles instantly with
    no trailing frames;
  - the per-frame auto-rotate invalidation condition excludes reduced motion.
- Manual orbit drag, wheel-zoom mode, programmatic zoom, camera presets,
  hotspot open/close, and livery switching are untouched and remain fully
  functional in both modes.

### CSS motion (`src/index.css`)

The `prefers-reduced-motion: reduce` block now also disables the continuously
looping utility animations (`animate-pulse`, `animate-ping`, `animate-bounce`,
`animate-spin`, `animate-float-gentle`, `animate-pulse-cyan`,
`animate-glow-red`, `animate-car-entrance`, `animate-ticker-marquee`,
`animate-streamline`). These cover the pulsing indicator dots in the
Showroom HUD and Control Dock. One-shot entrance/feedback animations
(fade-in, metric-pop, page-enter, car-switch, speed-scan, digit-slide, etc.)
are preserved so every control remains visible and usable.

## Motion-state table

| State         | Trigger                                          | Frames? | M3B.1 behavior preserved?             |
| ------------- | ------------------------------------------------ | ------- | ------------------------------------- |
| `initial`     | First scene paint and readiness                  | Yes     | Yes — same invalidator                |
| `autoRotate`  | Auto-rotation on, no hotspot, stage active       | Yes     | Yes — normal users unchanged          |
| `orbit`       | Pointer drag / wheel zoom in progress            | Yes     | Yes — same onStart/onChange           |
| `damping`     | 2 s tail after drag (0 s reduced motion)         | Yes     | Yes — tail length only differs        |
| `preset`      | Camera preset / hotspot transition interpolating | Yes     | Yes — same lerp + invalidate          |
| `static`      | Everything settled                               | No      | Yes — 0 recurring draws               |
| `hidden`      | `document.visibilityState !== 'visible'`         | No      | Yes — frameloop `never`               |
| `offscreen`   | Stage outside viewport (`IntersectionObserver`)  | No      | Yes — frameloop `never`               |
| `contextLost` | WebGL context lost                               | No      | Yes — frameloop `never` + fallback UI |

## Measured verification performed locally

The following checks were executed on the implementation worktree
(branch `perf/speed-insights-v2`, Windows, Node >= 22):

| Check                   | Result | Detail                                                                                                               |
| ----------------------- | ------ | -------------------------------------------------------------------------------------------------------------------- |
| `npm run lint`          | Pass   | No ESLint errors.                                                                                                    |
| `npm run format:check`  | Pass   | After one Prettier pass over the four touched source files.                                                          |
| `npm test`              | Pass   | 30 test files, 224 tests (M3B.1: 29 files / 215 tests; +9 new motion/reduced-motion tests).                          |
| `npm run test:coverage` | Pass   | 63.2% statements, 59.8% branches, 68.51% functions, 63.96% lines — unchanged from M3B.1.                             |
| `npm run build:check`   | Pass   | Production build succeeded; initial JavaScript 109.7 KiB gzip against the 180 KiB budget.                            |
| Showroom chunk          | Pass   | `ShowroomView` chunk 334.14 kB raw / 90.95 KiB gzip; `vendor-three` unchanged at 249.28 KiB gzip and route-isolated. |

## Pending external measurements (not fabricated)

The task requires browser-instrumented QA and Lighthouse evidence that must be
produced with the same harness as M3B.1 on a running Chrome instance. These are
**not yet executed for M3B.2** and are tracked as open work; the CSV artifact
marks them `pending`. They must be completed before the release-gate row for
M3B.2 can move from "implementation verified" to "measured PASS":

- Three cold Lighthouse runs per profile (Desktop/Mobile) on `/showroom` against
  the M3B.1 medians (Desktop score 47 / TBT 2,925 ms / LCP 2,785 ms; Mobile
  score 31 / TBT 13,125 ms / LCP 16,336 ms).
- Instrumented interaction windows with the RAF/draw-call wrapper: static idle,
  auto-rotation, orbit + damping, preset completion, reduced-motion idle and
  drag, hidden tab, off-screen, context restore, livery/hotspot/language/resize.
- Reduced-motion CPU/GPU window: with `prefers-reduced-motion: reduce` matched
  and auto-rotation defaulting off, the settled scene must record 0 RAF
  callbacks and 0 draws; a manual drag must render only during the pointer
  contact and stop immediately afterwards (no 2 s tail).
- Mobile 4× CPU-throttled idle re-measurement with the same instrumentation as
  the M3A/M3B.1 baseline, which M3B.1 itself flagged as not repeated.
- Five-width identical-state screenshots (390/768/1280/1440/1920) for the
  visual no-regression check.

Acceptance expectations for those runs, derived from the implementation:

1. Static idle remains 0 callbacks / 0 draws (M3B.1 behavior, unchanged code
   path; `resolveMotionState` unit tests confirm the state mapping).
2. Reduced motion does not continuously render: no auto-rotation loop starts
   by default and no damping tail runs after drags.
3. Auto-rotation on supported hardware remains continuous and smooth for
   normal users; no per-frame cost was added (the frame condition only gained
   a boolean conjunction).
4. Camera transitions and damping complete reliably; the damping flush logic
   from M3B.1 is untouched.
5. No new memory leaks: the media-query subscription is removed on unmount
   (unit-tested), and no interval/RAF was added.
6. No regression in M1A/M1B/M2: no shared route or data source changed; the
   CSS additions are inside an existing reduced-motion media query that other
   routes already scope to their own animation classes.

## Exact changed files

Application:

- `src/components/showroom/showroomMotionState.ts` (new)
- `src/hooks/useReducedMotion.ts` (new)
- `src/components/showroom/ShowroomView.tsx`
- `src/components/showroom/CameraController.tsx`
- `src/index.css`

Tests and evidence:

- `src/components/showroom/showroomMotionState.test.ts` (new; 9 tests)
- `docs/performance/m3/m3b2-results.md` (this file)
- `docs/performance/m3/artifacts/m3b2-before-after.csv`
- `docs/performance/m3/artifacts/m3b2-interaction-qa.json`
- `docs/performance/optimization-results.md`
- `docs/performance/release-gates.md`

## Risks and rollback

- The main reduced-motion risk is a stale scene after a preference flip; the
  flag is part of `sceneRevision`, which is the same invalidation channel used
  for every other scene state change, so the repaint path is the proven one.
- Users who prefer reduced motion can still manually enable the 360° toggle;
  `CameraController` deliberately ignores it while the OS preference is active
  to guarantee zero continuous rendering. Roll that single condition back if
  manual re-enable should win.
- Disabling damping entirely under reduced motion changes drag feel
  (immediate stop instead of a 2 s glide). This is intentional and reversible
  via `getDampingTailMs`.
- Rollback is one commit revert; the M3B.1 demand renderer, camera flush
  logic, and all invalidation channels are untouched by this change's revert.

## Stop point

Per the task definition, work stops after M3B.2. M3B.3 texture caching must not
start, and the branch must not be merged into `main`, until review.
