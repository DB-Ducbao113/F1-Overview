# M3B.5 Showroom adaptive rendering baseline

## Profiling setup

- Branch `perf/speed-insights-v2` at M3B.4.1 head `50b6602` (plus the M3B.5
  candidate wiring measured separately, see experiments).
- Production build served by `vite preview` (localhost), Chrome headless via
  CDP main-world instrumentation (`Page.addScriptToEvaluateOnNewDocument`
  installs an rAF frame-time recorder plus
  `WebGLRenderingContext/WebGL2RenderingContext.prototype.drawElements/
drawArrays` counters at prototype level, covering pre-existing contexts).
- Frame times recorded per rAF tick (delta between successive callbacks),
  sorted for P50/P95. CPU throttling via `Emulation.setCPUThrottlingRate(4)`
  for the mobile profile. Headless vsync in this environment quantizes frames
  to ≈16.7/33.3/50 ms buckets; relative before/after comparisons are the valid
  reading, not absolute FPS.

## Measured baseline (M3B.4.1 head, desktop profile, no throttling)

| Scenario                           | rAF callbacks | Indexed draws | Frame P50 | Frame P95 |
| ---------------------------------- | ------------: | ------------: | --------: | --------: |
| Static idle 10 s (auto-rotate off) |             0 |             0 |         — |         — |
| Active auto-rotation 10 s          |           216 |        25,001 |   50.0 ms |   50.2 ms |
| Orbit interaction + damping        |            93 |        10,674 |   49.9 ms |         — |

Idle remains zero-draw (M3B.1 behavior intact). Active rendering runs at
≈116 draw calls per frame (25,001/216), the dominant per-frame GPU submit
count; the 512 px MeshReflectorMaterial reflection is the known largest
single per-frame render path on this scene (M3A hypothesis, now quantified by
the reflector experiment below).

## Mobile 4× CPU-throttled profile

| Scenario                     | Frame P50 | Frame P95 | Static idle     |
| ---------------------------- | --------: | --------: | --------------- |
| Mobile 4× auto-rotation 10 s |   50.1 ms |   83.9 ms | 0 rAF / 0 draws |
| Mobile 4× orbit              |    ~50 ms |         — | —               |

Under 4× CPU throttling the same ≈116 draws/frame costs P95 83.9 ms — the
frame-time tail is CPU-bound during scene update and GPU submit, exactly the
population M3B.5 targets.

## Reduced-motion profile

Reduced motion (M3B.2) already renders on demand with auto-rotation disabled
by default; no continuous rendering exists to optimize further. No separate
adaptive policy is needed for reduced-motion users: they receive the static,
demand-driven path by design.

## Dominant cost attribution

1. **Per-frame draw-call count (≈116)** — the reflection render pass plus the
   full studio wall set dominates GPU submit work during motion.
2. **DPR (device pixel ratio up to 1.25)** — scales every fragment shaded
   during active frames; the strongest isolated lever measured (experiment A).
3. **Reflector resolution** — 512→256 cuts reflection pass cost but produces
   visible floor moiré (rejected on visual evidence, see experiments).
4. Shadows were **not** experimentally isolated: after A/B, the reflection
   pass and DPR explain the measured delta, so a shadow downgrade would add
   visual risk without a demonstrated need.
