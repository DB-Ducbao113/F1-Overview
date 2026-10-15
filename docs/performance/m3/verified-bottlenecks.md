# M3A verified Showroom bottlenecks

## Ranked findings

| Rank | Finding                                            | Evidence and impact                                                                                                                                                                                                                                                    | Frequency                                      | Scope                      | Benefit potential       | Regression risk                                           |
| ---: | -------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- | -------------------------- | ----------------------- | --------------------------------------------------------- |
|    1 | The visible Canvas renders continuously while idle | `ShowroomView.tsx:354` selects `always`. Mobile 4× idle spent 9.84 of 10 s in frame callbacks and issued 58,014 indexed draws. Auto-rotate off and on were similarly expensive. This can delay input and timers.                                                       | Every visible frame                            | Continuous                 | Very high               | Medium: demand rendering needs complete invalidation      |
|    2 | Initial WebGL setup creates a long CPU/GPU burst   | `F1Car3DModel.tsx:114-264` creates PBR materials; `StudioW15Stage.tsx:60-450` creates the lit reflective stage. Init recorded a 249.8 ms main task, 2,197.8 ms aggregate GPU tasks and a 331.7 ms maximum GPU task. Mobile first usable loading state ended at 6.34 s. | Route entry/context recreation                 | Initialization             | High                    | Medium–high: shader/material changes can alter appearance |
|    3 | Cold procedural texture generation is synchronous  | `F1Car3DModel.tsx:77-112` and `StudioW15Stage.tsx:31-41` call 13 generators during render. Cold cost was 175.1 ms desktop and 414.3 ms at CPU 4×; the wheel path contributed 63.9/383.2 ms. A livery switch produced a 358 ms `vendor-three` frame.                    | Entry and each distinct livery/language change | Initialization/interaction | Medium–high             | Medium: cache lifetime and disposal must be correct       |
|    4 | Mobile controls obscure the 3D subject             | `ShowroomView.tsx:284-427` overlays the badge, dock and quick HUD on one 620/680 px stage. Screenshots at 390 and 768 show material overlap with the car and board.                                                                                                    | Every mobile visit                             | Continuous visual issue    | High UX benefit         | Low–medium: control discoverability must remain           |
|    5 | Reduced-motion still runs the full animated Canvas | The media query matched while the Canvas emitted 81 callbacks and 9,069 indexed draws in three seconds; CSS pulse animations also continued.                                                                                                                           | Reduced-motion users                           | Continuous                 | High for affected users | Low if static state and controls remain available         |

## Findings that rule out proposed causes

These measurements prevent effort from being spent on low-impact changes first.

| Candidate                   | Result                                                                                                                                                    |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GLB decode/parse            | 20.6 ms native desktop and 44.4 ms at CPU 4×. The 2.16 MB transfer is material on slow networks, but parsing is not the measured multi-second CPU source. |
| React rendering             | Development Profiler commits were 2.5–10 ms for interactions and 17.6 ms at mount. React reconciliation is not the dominant steady-state cost.            |
| Auto-rotation logic alone   | Paused and rotating ten-second windows had similar draw counts and CPU occupancy. The always-running full scene is the cause.                             |
| Resource leak on route exit | The Canvas was removed, context became lost, GPU delete calls fired, and heap fell by about 11 MB. No route-unmount leak was reproduced.                  |
| Hidden-tab rendering        | Only one trailing frame was recorded over 3.13 seconds after the tab became hidden. The existing guard works.                                             |

## Measured attribution by source

### `src/components/showroom/ShowroomView.tsx`

- `isCanvasActive` correctly combines visibility, viewport and context state at lines 145–166.
- `frameloop={isCanvasActive ? 'always' : 'never'}` at line 354 forces continuous work whenever active, including stable idle scenes.
- The 390/768 overlays at lines 284–427 produce the verified mobile composition issue.

### `src/components/showroom/CameraController.tsx`

- `useFrame` at lines 139–158 only changes the camera during a transition.
- `OrbitControls` at lines 161–172 enables damping and optional auto-rotation. When neither needs motion, the rest of the scene still renders because the Canvas frame loop remains `always`.

### `src/components/showroom/F1Car3DModel.tsx`

- The GLB load at line 36 is cached by `useGLTF`; preload occurs at line 366.
- Texture generators at lines 77–112 run synchronously for each team identity.
- Material replacement at lines 114–264 causes shader/material and texture-upload work.
- Cleanup at lines 269–279 is effective on livery change/unmount.

### `src/components/showroom/F1CarTextures.ts`

- `createUVTexture` at lines 10–44 creates mipmapped textures with anisotropy 16.
- Three 1024² and six 512² generator calls are verified. The cold aggregate is significant, particularly the wheel texture.

### `src/components/showroom/StudioW15Stage.tsx`

- Four backdrop textures are created per team/language and disposed at lines 31–50.
- The 512 px reflector at lines 437–450 adds an extra reflection render path during every requested frame.
- The trace proves substantial GPU frame work, but it does not isolate the reflector from the rest of the stage. Treat the reflector's exact share as a hypothesis until an A/B trace is run.

### `src/components/showroom/StudioBackdropTexture.ts`

- Four 1024×512 mipmapped, anisotropic textures are regenerated for each team/language.
- Cold backdrop generation contributes to the measured 175/414 ms aggregate, but no single backdrop dominates like the wheel texture.

## Hypotheses requiring an M3B A/B measurement

1. The mirror floor is likely a large part of per-frame GPU cost because it renders a reflected scene at 512 px, but the current trace cannot assign an exact percentage.
2. A bounded current/previous-team texture cache should remove most repeat-switch generation, but retained GPU memory must be measured before choosing the cache size.
3. A mobile DPR cap of 1 and a lower reflector target may improve frame time. This is justified for an experiment by the 4× CPU saturation, not yet approved as a shipped quality setting.
4. Shader warm-up with `compileAsync` may move compilation before the first visible frame; it may also delay usability without lowering total work. It requires an A/B result.

## Data-quality notes

- GPU event totals can overlap nested trace events and should not be added to wall time.
- WebGL JavaScript wrapper duration measures command submission, not completion on the GPU.
- The local GLB fetch does not model Vercel edge latency or a cold public network.
- M0 and M3A used the same Lighthouse version and simulated profiles, but the branch and environment changed; the lower TBT is a current baseline, not an M3A gain.
