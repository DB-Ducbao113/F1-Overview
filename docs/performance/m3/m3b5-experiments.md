# M3B.5 isolated quality experiments

Each experiment was applied alone on top of the M3B.4.1 build, measured with
the same CDP frame-time harness, then reverted before the next experiment.
Mobile profile = 390×844 viewport + 4× CPU throttling via CDP.

## Experiment A — adaptive device pixel ratio (bounded)

**Policy implemented and measured:** `showroomQuality.ts` resolves once per
mount; constrained coarse-pointer, narrow (<1024 px), low-core (<8),
non-Save-Data devices get DPR [1,1]; everything else keeps [1,1.25]. Seven
unit tests covered desktop width, tablets, high-core phones, Save-Data, SSR
safety, and the width boundary.

**Measurement (mobile 4×, auto-rotation 10 s):**

| Run                   | P50     | P95     |
| --------------------- | ------- | ------- |
| Baseline (DPR 1–1.25) | 50.1 ms | 83.9 ms |
| Adaptive DPR=1 run 1  | 33.3 ms | 50.1 ms |
| Adaptive DPR=1 run 2  | 50.0 ms | 50.1 ms |
| Adaptive DPR=1 run 3  | 33.3 ms | 50.1 ms |

2 of 3 runs show P50 50→33.3 ms (+50% frame rate). Run 2 did not reproduce,
demonstrating headless GPU-scheduling variance. Canvas backing-size probes
confirmed the policy engaged (backing = CSS width at DPR 1 vs ×1.25 before).

**Verdict:** promising but not stable under the headless harness; DPR also
softens text/sponsor rendering at 390 px (visual check). Not shippable on
this evidence alone.

## Experiment B — lower reflection resolution on mobile (512→256)

**Measurement (mobile 4×, auto-rotation 10 s):** P50 50.1→33.4 ms, P95
50.2→50.1 ms — same magnitude as experiment A.

**Visual evidence:** screenshot comparison at 390 px shows pronounced floor
moiré (checker pattern) with the 256 px reflector. Critically, a baseline
screenshot at the same viewport/state shows the **same moiré pattern at 512
px** in the headless capture, so the moiré is a headless-capture artifact of
the reflector at this scale rather than a policy regression — but with DPR
fixed at 1 the reflector change contributed **no additional frame-time gain**
over experiment A (P50 identical at 33.3 ms). The visible-risk/zero-extra-gain
combination fails the acceptance criteria.

**Verdict:** rejected. Reflector stays 512 px everywhere.

## Experiment C — conditional shadow quality

Not implemented. After A/B isolation, DPR alone explained the entire measured
frame-time delta; there is no profiling evidence that shadow map quality is a
dominant active-rendering cost on this scene. Adding a shadow downgrade would
introduce visual risk (shadow flicker during motion) without a demonstrated
gain. Per the task rule ("test conditional shadow quality only if profiling
supports it"), skipped.

## Experiment D — motion-aware quality reduction during camera movement

Rejected at design stage. `MeshReflectorMaterial` resolution is baked into
shader/texture setup and cannot change per-frame without recreating the
material (visible hitch, allocation churn). A DPR ramp during motion would
produce the quality oscillation the task explicitly forbids ("avoid visible
quality oscillations"). No safe implementation path exists for the measured
levers; skipped rather than shipping a risky mechanism.

## Paired Lighthouse follow-through (experiments A+B wired as candidate)

A full paired Lighthouse battery (5 runs per device per build, alternating)
was run with the adaptive wiring live, using two fixed builds served
simultaneously (candidate = WIP with `showroomQuality` + wiring; baseline =
M3B.4.1 head `50b6602`). Verified distinct chunks (`index-C4AqZYI3` vs
`index-CPg1cxE-`), same Chrome/Lighthouse/throttling/hardware.

| Profile | Metric | Baseline median | Candidate median | Paired diffs (cand − base)                       |
| ------- | ------ | --------------: | ---------------: | ------------------------------------------------ |
| Desktop | TBT    |        2,844 ms |         3,665 ms | +1,617/+378/+4,264/+27/+679; mean +1,393 ms      |
| Mobile  | TBT    |       11,823 ms |        17,421 ms | +6,102/+3,139/+9,485/+1,616/−918; mean +3,885 ms |
| Desktop | LCP    |        3,101 ms |         3,235 ms | mean +134 ms                                     |
| Mobile  | LCP    |       16,354 ms |        16,556 ms | mean +202 ms                                     |

The paired differences are predominantly one-directional (9 of 10 pairs
slower on the candidate), which **cannot be attributed to run variance** per
the task's evidence rule. A recheck pair confirmed +117 ms desktop TBT.
The regression mechanism is not fully identified: the candidate adds only a
one-time quality-resolution call in module render, which cannot explain
hundreds of milliseconds of TBT; the plausible contributors are the extra
module plus hydration-order sensitivity in the headless trace, but the task
requires fixing the cause before approval and no fixable cause was
demonstrated. Combined with the unstable frame-time gains (experiment A) and
the visual risk, the adaptive changes fail the paired evidence gate.

## Decision

**No adaptive changes shipped.** Per the acceptance criteria ("if no
experiment provides a meaningful performance gain without visible
degradation, ship no adaptive changes and report the result"): the code was
fully reverted (`ShowroomView.tsx`, `StudioW15Stage.tsx` restored; the
`showroomQuality` module removed), the working tree is clean at the M3B.4.1
head, and the full local gate passes (33 test files / 246 tests, lint clean,
format clean, build succeeds).
