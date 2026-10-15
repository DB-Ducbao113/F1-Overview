# M3A Showroom profiling baseline

## Scope and revision

- Branch: `perf/speed-insights-v2`
- Profiled commit: `4ec147e1c1c685384067625e8f0cc4017f3dc0b9`
- Date: 2026-10-14, Asia/Bangkok
- Application source changes during M3A: none. A temporary React `Profiler` wrapper was used in Vite development mode, then removed before this report.
- Production build: `npm run build`, Vite 6.4.3, React 18.3.1, Three 0.165.0, React Three Fiber 8.16.8.
- Browser: Chrome 155.0.8059.40 on Windows; native WebGL renderer was ANGLE/Intel UHD Graphics/D3D11.

The Lighthouse runs use localhost and Lighthouse 13.5.0 simulated throttling. Interaction traces use the production build without network throttling unless a CPU rate is stated. These are controlled lab results, not Vercel field data.

## Source inspection

The inspected implementation is summarized below.

| Area            | Current implementation                                                                         | Source                                                   |
| --------------- | ---------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| Canvas          | Shadows enabled, DPR clamped to 1–1.25, antialias off, high-performance context                | `ShowroomView.tsx:350-362`                               |
| Frame loop      | `always` while the document and stage are visible; `never` when hidden/off-screen/context-lost | `ShowroomView.tsx:145-166`, `ShowroomView.tsx:354`       |
| GLB             | `useGLTF('/models/c42.v2.glb')` plus module-level preload                                      | `F1Car3DModel.tsx:36`, `F1Car3DModel.tsx:366`            |
| Car textures    | Three 1024² and six 512² `CanvasTexture` objects, mipmaps and anisotropy 16                    | `F1CarTextures.ts:10-43`, generators at lines 675–4623   |
| Studio textures | Four 1024×512 canvas textures, mipmaps and anisotropy 16                                       | `StudioBackdropTexture.ts:94-1034`                       |
| Materials       | New PBR materials are assigned per mesh and disposed on dependency change/unmount              | `F1Car3DModel.tsx:114-298`                               |
| Stage           | Seven lights, shadow-casting key light, 512 px `MeshReflectorMaterial` floor                   | `StudioW15Stage.tsx:60-86`, `StudioW15Stage.tsx:433-450` |
| Camera          | `useFrame` transition lerp plus damped `OrbitControls`; auto-rotate is enabled initially       | `CameraController.tsx:139-172`                           |
| Contact shadow  | One 256 px contact-shadow render                                                               | `ShowroomView.tsx:380-388`                               |
| Cleanup         | Generated textures/materials are disposed; R3F tears down the context on route unmount         | `F1Car3DModel.tsx:269-279`, `StudioW15Stage.tsx:43-50`   |
| Resize          | R3F observes the Canvas container; no application resize handler creates textures              | `ShowroomView.tsx:350-362`                               |

## Lighthouse reproduction

Each value below is the median of three cold runs. Raw reports and every run are in [`artifacts/lighthouse`](artifacts/lighthouse) and [`lighthouse-summary.csv`](artifacts/lighthouse-summary.csv).

| Profile | Score |      FCP |       LCP |       TBT |    CLS | Main thread |    Transfer | Requests |
| ------- | ----: | -------: | --------: | --------: | -----: | ----------: | ----------: | -------: |
| Desktop |    45 |   581 ms |  2,799 ms |  4,078 ms | 0.0012 |    8,238 ms | 2,993,678 B |       26 |
| Mobile  |    31 | 2,900 ms | 16,367 ms | 14,160 ms |      0 |   28,722 ms | 3,005,396 B |       27 |

M0 recorded 39/22 and 33,251/154,181 ms TBT. The current branch reproduces the same severe Showroom-only CPU problem, but not the original magnitude. The difference predates M3A and includes M1/M2 changes, local machine/browser variance, and current Lighthouse behavior. M3A made no application change, so it does not claim this difference as an optimization result.

On the median reports, `vendor-three` accounts for 6,072 ms desktop and 23,725 ms mobile boot-up time. The largest long task is 1,578 ms desktop and 6,257 ms mobile. React/vendor scheduling also contributes large initialization tasks, but the steady-state traces below separate that startup work from WebGL frame work.

## Route navigation and network

The SPA navigation trace started on Homepage, then selected `/showroom`. On native desktop hardware:

| Resource             |    Transfer |     Decoded | Start-to-finish |
| -------------------- | ----------: | ----------: | --------------: |
| `ShowroomView` chunk |    90,680 B |   332,649 B |         12.6 ms |
| `vendor-three` chunk |   249,577 B |   917,635 B |         27.9 ms |
| `c42.v2.glb`         | 2,165,196 B | 2,164,896 B |         63.5 ms |
| `wheel_base.webp`    |    38,092 B |    37,792 B |          1.9 ms |

The GLB contains 11 meshes, 204,593 vertices, approximately 237,482 triangles, and 9 source materials. An isolated `GLTFLoader` + Meshopt benchmark measured 20.6 ms parse/decode on native desktop CPU and 44.4 ms at 4× CPU throttling. The local network time was 11.2/31.8 ms in that isolated test. This establishes that GLB parsing is not the multi-second CPU bottleneck on this hardware, although the 2.16 MB transfer still matters on real networks.

The first WebGL draw occurred about 1.15 seconds after the SPA route click. The direct mobile trace at 4× CPU throttling recorded first draw at 3.22 seconds and the loading UI disappearing at 6.34 seconds. The earlier DOM-only probe returned 178 ms and is deliberately excluded because it observed the Canvas before the model was usable.

## Initialization costs

The production initialization trace contains 604.9 ms renderer-main work and 2,197.8 ms of GPU tasks during its 2.66-second window. Its longest renderer task was 249.8 ms. WebGL instrumentation observed:

- 14 initial `texImage2D` calls.
- 8 `texSubImage2D` calls.
- 32 shader compilations and 16 program links.
- 198 buffer uploads before the settled snapshot.
- A maximum GPU task of 331.7 ms during initialization.

The synchronous procedural texture benchmark calls the exact production generators. Cold generation took 175.1 ms on native desktop and 414.3 ms at 4× CPU throttling. Warm repetitions took 24.8–25.6 ms desktop and 62.9–86.6 ms throttled. The wheel texture alone took 63.9 ms desktop and 383.2 ms throttled on the cold pass because its first `drawImage` also realizes the decoded base image. Exact per-generator values are in [`texture-and-gltf-benchmark.json`](artifacts/texture-and-gltf-benchmark.json).

The JavaScript duration of `texImage2D`/shader API calls was below 1 ms because driver work is asynchronous. GPU trace events, rather than wrapper call duration, are the evidence for upload/compilation cost. Chrome does not expose a reliable per-texture split in this trace, so attributing the 331.7 ms task to a specific texture remains a hypothesis.

## Steady-state rendering

Auto-rotation was paused through the real UI before the idle measurement.

| State                 | Profile                 | Observation                                                                                                              |
| --------------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Idle, auto-rotate off | Desktop native          | 263 frame callbacks and 29,442 indexed draws over 12.56 s; 743.9 ms inside measured callbacks                            |
| Auto-rotate on        | Desktop native          | 278 callbacks and 30,963 indexed draws over 10.55 s; trace recorded 783.4 ms main-thread RAF work and 507.8 ms GPU tasks |
| Idle, auto-rotate off | Mobile viewport, CPU 4× | 586 callbacks and 58,014 indexed draws over 10 s; 9,838.9 ms inside callbacks; GPU tasks totaled 1,211.1 ms              |
| Auto-rotate on        | Mobile viewport, CPU 4× | 607 callbacks and 56,288 indexed draws over 10 s; 9,426.5 ms inside callbacks; GPU tasks totaled 1,237.9 ms              |

The paused and rotating results are similar. Auto-rotation itself is therefore not the primary bottleneck. The visible `frameloop="always"` keeps rendering the full scene even when the camera and scene are unchanged. Under 4× CPU throttling, frame callbacks occupy nearly the entire ten-second interval.

## Interaction and React profiling

| Interaction                              | Measured result                                                                                    |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Camera preset                            | 4.07 s trace; 118 rendered frames; 370.7 ms RAF main-thread work; one 61.9 ms instrumentation task |
| Actual livery switch, Mercedes → Ferrari | 5.19 s trace; longest frame/task 358 ms in `vendor-three`; 826.3 ms RAF work; 780.5 ms GPU tasks   |
| Hotspot toggle + front-wing hotspot      | 4.09 s trace; no task over 50 ms; modal content appeared                                           |
| React mount                              | 17.6 ms development Profiler commit                                                                |
| React livery update                      | 10.0, 4.3, and 2.7 ms commits                                                                      |
| React camera/hotspot updates             | 2.5–7.3 ms commits                                                                                 |

React commits are small relative to WebGL frame and livery resource work. Broad React memoization is not justified by this evidence.

## Lifecycle, accessibility, and layout QA

- Hidden tab: after another tab became active, `document.visibilityState` was `hidden`; only one trailing frame and 104 indexed draws occurred over 3.13 seconds. The current visibility guard works.
- Off-screen behavior: source inspection confirms an `IntersectionObserver` switches the frame loop to `never` outside a 160 px margin. The same state gate is used for hidden tabs and context loss.
- Reduced motion: the media query matched, but the Canvas remained active; 81 callbacks and 9,069 indexed draws occurred in three seconds, and two pulse animations remained running. Showroom does not yet honor reduced motion.
- Cleanup: SPA navigation away removed the Canvas, lost the WebGL context, deleted 27 textures, 24 programs, 192 buffers, one framebuffer and one renderbuffer; measured JS heap fell from 29.95 MB to 18.89 MB. No retained Canvas was observed.
- Resize: all five widths resized the Canvas without WebGL errors. Document-level horizontal overflow was zero at 390 and 768. Team and hotspot rows intentionally use internal horizontal scrolling.
- At 390 px, the expanded control dock covers most of the upper model/stage and the bottom HUD covers the car. At 768 px, both panels still cover a material portion of the model. At 1280–1920 px, controls remain inside the stage and the model is usable.
- Livery selection, camera presets, auto-rotation, hotspot opening, loading UI, and responsive resizing all executed through their real handlers during profiling. Keyboard focus and physical pointer/touch gestures were not replayed as a full end-to-end suite in M3A; they remain an M3B regression gate.

Screenshots: [390](artifacts/screenshots/showroom-390.webp), [768](artifacts/screenshots/showroom-768.webp), [1280](artifacts/screenshots/showroom-1280.webp), [1440](artifacts/screenshots/showroom-1440.webp), and [1920](artifacts/screenshots/showroom-1920.webp).

## Evidence index and limitations

- [`cdp-profile.json`](artifacts/cdp-profile.json): desktop resources, WebGL counters, memory, lifecycle and layout data.
- [`mobile-cdp-profile.json`](artifacts/mobile-cdp-profile.json): mobile 4× CPU initialization and ten-second steady-state counters.
- [`trace-summary.json`](artifacts/trace-summary.json): aggregated main/GPU thread events and long tasks.
- [`traces`](artifacts/traces): compressed Chrome Performance traces for initialization and interactions.
- [`react-profiler.json`](artifacts/react-profiler.json): temporary development React Profiler commits.
- [`hotspot-and-cleanup.json`](artifacts/hotspot-and-cleanup.json): actual hotspot interaction and route-unmount disposal.

Chrome's JavaScript heap counters are snapshots, not dominator-tree heap dumps. GPU task time is available, but exact VRAM residency and per-resource GPU upload duration are not exposed reliably. These limitations are carried into the M3B proposal rather than filled with estimates.
