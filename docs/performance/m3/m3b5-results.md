# M3B.5 adaptive rendering results — NO CHANGE SHIPPED

## Outcome

M3B.5 completes its investigation and ships **no adaptive rendering change**.
Every experiment was measured independently, and none met the acceptance
bar of "meaningful performance gain without visible degradation" plus "paired
measurements support the claim". The branch remains at the M3B.4.1 head with a
clean tree; visual quality, DPR, reflection, shadows, and materials are
byte-identical to the reviewed M3B.4.1 state.

## Why (one paragraph)

DPR reduction on constrained mobile produced a +50% frame-rate gain in 2 of 3
headless runs (50.1→33.3 ms P50) but did not reproduce stably, softens text at
390 px, and — critically — when wired as a real candidate build it produced
predominantly one-directional **TBT regressions** in a 5×5 paired Lighthouse
battery against the fixed baseline (desktop mean +1,393 ms, mobile mean
+3,885 ms; 9 of 10 pairs slower). A reflector 512→256 downgrade gave no
additional gain at DPR 1 and carries moiré risk. Shadow and motion-aware
experiments had no supporting profiling evidence or no safe implementation
path. Per the task's own decision rule, the honest result is "no adaptive
change".

## Verification that nothing regressed (executed)

- Working tree clean; `git diff` empty against M3B.4.1 head; adaptive module
  and wiring removed.
- `npm run lint` — pass (0 errors/warnings).
- `npm run format:check` — pass.
- `npm test` — 33 files / 246 tests pass.
- `npm run build` — production build succeeds; bundle unchanged from the
  reviewed M3B.4.1 artifacts.
- Static idle behavior (0 recurring draws) untouched — no source change.
- Visual QA screenshots at 1280/1440/1920 desktop and 390/768 mobile-emulated
  captured and reviewed (headless artifacts; the floor moiré visible in both
  baseline and candidate captures is a headless-reflectance artifact, present
  identically in the pre-change baseline capture).

## Deliverables

- [`m3b5-baseline.md`](m3b5-baseline.md) — profiling of the M3B.4.1 state
  (idle/auto-rotate/orbit, desktop and mobile 4×, reduced-motion note,
  dominant-cost attribution).
- [`m3b5-experiments.md`](m3b5-experiments.md) — each isolated experiment with
  measurements, visual evidence, and the paired Lighthouse battery that failed
  the gate.
- [`artifacts/m3b5-before-after.csv`](artifacts/m3b5-before-after.csv) —
  paired-run metrics and frame-time table.
- [`artifacts/m3b5-visual-qa.json`](artifacts/m3b5-visual-qa.json) — viewport
  probes, screenshot inventory, moiré finding.
- Raw Lighthouse reports: [`artifacts/m3b5/lighthouse/*`](artifacts/m3b5/lighthouse)
  (20 paired runs + 2 recheck runs).

## Release position

M3B.4.1's own gate status (GO for branch review; production NO-GO pending the
startup TBT/LCP targets) is unchanged by M3B.5. The M3B.4.1 open blocker
(first-usable-frame regression from the readiness gate) remains the priority
for the next milestone, ahead of any adaptive-quality work. M3B.5 adds no new
open items; its conclusion is documented so the review session can decide
whether a real-device measurement campaign (not headless) should reopen
adaptive quality later.

## Rollback

None required — nothing shipped. If a reviewer wants the candidate wiring back
for real-device testing, the experiment code is described precisely in
[`m3b5-experiments.md`](m3b5-experiments.md) (policy module + two prop wires)
and can be reconstructed from that specification.
