# M3D — Optimization Opportunities & Architectural Proposals

**Date:** 2026-10-16  
**Mission:** Showroom Speed & Stability (M3D.1 + M3D.2)  
**Branch:** `perf/showroom-speed-r21`  
**Base Commit:** `2779cac5d685a06092d4d38f81e23daccccec1f4`

---

## 1. Top Three Performance Bottlenecks (Ranked by Impact)

Based on empirical Chrome Performance traces, PerformanceObserver long-task records, and WebGL telemetry measured during the M3D.2 baseline:

```
Critical Path to First Usable Showroom Frame (Total: 4,364 ms desktop baseline)
├─ 0ms ── Direct Navigation to /showroom
├─ 566ms ── Canvas Mounted in DOM
├─ 906ms ── Studio Texture Generation (208ms)
├─ 1,127ms ── GLTF Model Parse & Geometry Processing (1,046ms LONG TASK) ── [BOTTLENECK #1]
├─ 2,177ms ── Car Procedural Texture Generation (73ms) ─────────────────── [BOTTLENECK #2]
├─ 2,413ms ── Three.js Material Setup (1,189ms LONG TASK)
├─ 3,676ms ── Scene Assembly Ready (`showroom:required-resources-ready`)
├─ 3,676ms ── Parallel Shader Compilation (666ms) ───────────────────────── [BOTTLENECK #3]
└─ 4,364ms ── First Usable Frame Submitted (`showroom:first-usable-frame`)
```

---

### Bottleneck #1: Main-Thread GLTF Model Parse & BufferGeometry Ingestion

- **Empirical Measurement:** A continuous **1,046 ms long task** occurs starting at 1,127ms when the 2.16 MB `c42.v2.glb` model is parsed by Three.js GLTFLoader on the main JavaScript thread.
- **Mobile Impact:** Under Lighthouse's simulated 4× CPU slowdown, this single long task expands to **~4,200 ms** of uninterrupted main-thread starvation, directly driving Mobile Total Blocking Time (TBT).
- **Proposed Optimization:**
  1. Offload GLTF parsing and mesh decoding to a Web Worker (`DRACOLoader` or `MeshoptDecoder` worker).
  2. Implement progressive buffer transfer (`transferControlToOffscreen` or chunked worker geometry transfer) so the main thread never blocks for >50ms during model ingestion.
- **Expected Benefit:** 60%–75% reduction in model-parsing blocking time on mobile (~2,500ms to 3,000ms TBT reduction).
- **Technical Risk:** Low; worker scripts must be bundled with Vite worker syntax (`new Worker(new URL(..., import.meta.url), { type: 'module' })`).

---

### Bottleneck #2: Synchronous Procedural Texture Generation

- **Empirical Measurement:** Synchronous 2D canvas drawing blocks the main thread for **281 ms** total (208ms for studio cyclorama cove/lightboxes across north/south/west/east walls + 73ms for 8 car livery canvases).
- **Mobile Impact:** Scaled by 4× CPU throttling, procedural texture generation causes **>1,100 ms** of blocking time directly before scene attachment.
- **Proposed Optimization:**
  1. **Studio Wall Textures:** Replace dynamic canvas gradient rendering with static, highly compressed WebP/AVIF textures (or SVG data URIs) that load directly from CDN cache in <15ms.
  2. **Car Livery Textures:** Offload dynamic team decal composition to an `OffscreenCanvas` in a background worker, or retain the existing `showroomTextureCache` in IndexedDB across visits.
- **Expected Benefit:** Eliminates 200–250ms of synchronous main-thread execution on desktop; saves ~800–1,000ms TBT on mobile.
- **Technical Risk:** Very low; studio stage textures are static and identical across all 11 teams.

---

### Bottleneck #3: GPU Shader Compilation & Pipeline Linking

- **Empirical Measurement:** `showroom:compile` takes **666 ms** of GPU compilation time. Even with `KHR_parallel_shader_compile`, the subsequent `gl.render(scene, camera)` frame causes program validation and uniform binding spikes (83ms long task).
- **Mobile Impact:** Mobile GPUs (Mali, Adreno) take significantly longer to compile PBR shaders with multiple lights and contact shadows, delaying the first usable frame.
- **Proposed Optimization:**
  1. Prune unused shader defines and chunks from Three.js `MeshStandardMaterial` (e.g. disable unused specular maps, ambient occlusion maps, or redundant environment map reflections on hidden geometry).
  2. Warm up shaders using lightweight fallback materials during the initial loading phase.
  3. Ensure contact shadow frame render (`ContactShadows frames={1}`) is strictly coordinated so it does not compete with the initial scene shader compile.
- **Expected Benefit:** 20%–30% faster shader compilation (reducing compilation duration from 666ms to <480ms).
- **Technical Risk:** Medium; all 11 liveries and 7 technical hotspot materials must undergo visual regression testing to guarantee zero visual loss.

---

## 2. Target Performance Budgets for M3D.3

Based on Release 2 historical references and M3D engineering targets:

| Metric                          | Release 2 Baseline    | M3D Experimental Target | Required Delta           |
| ------------------------------- | --------------------- | ----------------------- | ------------------------ |
| **Mobile TBT**                  | 14,844 ms             | **≤ 11,875 ms**         | ≥ 20% improvement        |
| **First Usable Showroom Frame** | 4,364 ms (desktop)    | **≤ 3,490 ms**          | ≥ 20% faster             |
| **Desktop TBT**                 | 2,888 ms              | **≤ 2,310 ms**          | ≥ 20% improvement        |
| **Initial JS Bundle Size**      | 109.9 KiB gzip        | **≤ 180 KiB gzip**      | Maintain strict budget   |
| **Zero-Idle Rendering**         | 0 RAF / 0 draws       | **0 RAF / 0 draws**     | Strict 0-idle preserved  |
| **Desktop Visual Quality**      | Pristine studio stage | **No regression**       | 11 liveries + 7 hotspots |

---

## 3. Implementation Roadmap for M3D.3

| Task ID     | Description                                       | Impact                                    | Risk     | Phase     |
| ----------- | ------------------------------------------------- | ----------------------------------------- | -------- | --------- |
| **M3D.3.1** | Static Studio Stage WebP Texture Replacement      | High (~250ms main-thread reduction)       | Very Low | Immediate |
| **M3D.3.2** | Worker-Based GLTF Ingestion & Geometry Streaming  | Very High (~2,000ms mobile TBT reduction) | Low      | Core      |
| **M3D.3.3** | PBR Material Shader Chunk Pruning & Shadow Tuning | Medium (~180ms compile reduction)         | Medium   | Polish    |
