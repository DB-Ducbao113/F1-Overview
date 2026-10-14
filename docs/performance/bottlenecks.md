# Verified bottlenecks

The ranking uses current-production Lighthouse reports, network logs, traces, screenshots, and source inspection. Impact refers to expected user impact, not only Lighthouse points.

| Rank | Verified bottleneck                                                        | Impact                       | Effort | Regression risk | Evidence                                                                                                                                                                          |
| ---: | -------------------------------------------------------------------------- | ---------------------------- | ------ | --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|    1 | External font loading causes route-wide layout shifts and blocks rendering | Very high                    | Medium | Low–medium      | Desktop CLS ≈0.233 on Homepage/Season/Teams; 0.2319 is attributed to the footer's Inter swap. Google Fonts CSS is render blocking.                                                |
|    2 | Showroom continuously saturates the main thread under throttling           | Very high on Showroom        | High   | High            | Desktop TBT 33.25 s and mobile TBT 154.18 s; repeated long tasks are attributed to `vendor-three`/React. The visible canvas runs `frameloop="always"` with auto-rotation enabled. |
|    3 | The 2.5-second intro changes or delays the LCP candidate on hard loads     | High on all direct entries   | Medium | High            | Mobile LCP alternates among intro text, hero text, and hero image. Homepage mobile scores vary 55–66 with identical settings.                                                     |
|    4 | Homepage fetches all 11 off-axis team images during initial load           | High on constrained networks | Medium | Medium          | 1.18 MiB of images and 1.51 MiB total transfer; image-delivery savings estimated at 879 KiB desktop/1,033 KiB mobile.                                                             |
|    5 | Homepage hero cannot be discovered from initial HTML                       | Medium–high                  | Low    | Low             | LCP audit confirms `fetchpriority=high` but `requestDiscoverable=false`; observed load delay is 374–482 ms.                                                                       |
|    6 | Oversized, unsized brand images waste bytes and contribute instability     | Medium                       | Low    | Low             | `/logo/logo.png` is 246 KiB but renders at 118×44 or 150×56; Lighthouse estimates about 245 KiB waste and flags missing intrinsic dimensions.                                     |
|    7 | Mobile detail and Showroom layouts overflow at 390px                       | High visual risk             | Medium | Medium          | Mercedes, Antonelli, and Showroom screenshots visibly extend beyond the viewport; Showroom controls obscure the model.                                                            |

## Showroom trace interpretation

The Showroom route correctly isolates its network payload from other routes, but isolation does not reduce work once the route is open. Its initial route payload is approximately 2.60 MiB, led by the GLB, `vendor-three`, and `ShowroomView`.

Source inspection confirms that initial mount creates three 1024×1024 car textures, six 512×512 car textures, and four 1024×512 backdrop textures, all with mipmaps and high anisotropy. The canvas remains in an always-running frame loop while visible. The trace attributes most CPU time to `vendor-three`, so M3 must profile texture generation separately from steady-state frame rendering before changing quality.

## Homepage critical path interpretation

The hero image itself is only about 94 KiB and is not the largest transfer. The critical-path problems are delayed discovery, the 2.5-second overlay timeline, and font-induced layout shifts. The first M1 experiment should therefore avoid recompressing the hero blindly. It should establish a stable LCP candidate, preload it from HTML, and remove external font timing from the first render while preserving the intro.

## Lower-priority observations needing targeted profiling

- `App` stores scroll progress in React state, causing root-level reconciliation on scroll. The current load traces do not prove an INP regression, so this remains a hypothesis for interaction profiling.
- `F1SpeedStream` starts after 1.2 seconds and caps itself at 24 FPS on capable desktop devices. It is absent on mobile and did not create Lighthouse TBT on non-Showroom routes; retain it unless a real interaction trace shows contention.
- Season routes transfer 630–713 KiB but show zero TBT in the current lab runs. Their priority is font stability and route payload inspection, not speculative memoization.

## Recommended phase order

1. M1: stabilize fonts, hero discovery, and intro/LCP timing; prevent initial loading of hidden team imagery.
2. M2: repeat route navigation traces, then optimize Season/Teams only where React Profiler or network evidence identifies waste.
3. M3: split Showroom initialization from steady-state animation, apply adaptive frame scheduling without degrading capable desktop quality, and fix 390px composition.
4. M4: enforce performance and visual gates using free GitHub Actions tooling.
