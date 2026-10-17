# M3D.3.2 — Worker-Based GLTF Ingestion: Feasibility Report

**Mission:** Showroom Speed & Stability (M3D.3)  
**Branch:** `perf/showroom-speed-r21`  
**Base commit:** `b143ac5` (after M3D.2.1 commit)  
**Status:** Feasible — isolated feature-flagged PoC implemented (default OFF)  
**Experiment files:** `src/components/showroom/useWorkerGLTF.ts`, `src/components/showroom/workers/gltfMeshoptWorker.ts`, `src/components/showroom/F1Car3DModel.tsx` (edited)

---

## 1. Model & pipeline facts (measured from `public/models/c42.v2.glb`)

| Property | Value |
|----------|-------|
| File size | 2,164,896 bytes (~2.16 MB) |
| Container | glTF-Binary (glB), version 2 |
| Chunks | 1 JSON (15,496 B) + 1 BIN (2,149,372 B) |
| `extensionsUsed` / `extensionsRequired` | `EXT_meshopt_compression`, `EXT_texture_webp`, `KHR_mesh_quantization` |
| BufferViews | 34 — **every one uses `EXT_meshopt_compression`** |
| Accessors | 44 (positions, normals, UVs, indices — quantized ints + floats) |
| Meshes | 1 mesh with 11 primitives |
| Materials | 9 flat materials (roughness/metallic only) |
| Textures / Images | **0** — all car textures are procedural canvases (`F1CarTextures.ts`) |
| Draco | Not used |
| Meshopt decode | **Required** — compressed source lives in buffer 0 (the BIN chunk); logical buffer 1 is declared with `{EXT_meshopt_compression: {fallback: true}}` |

Baseline telemetry (`docs/performance/m3d/baseline.md` §2): GLTF parse & geometry processing is a **1,046 ms main-thread long task** on desktop (~4,200 ms under mobile 4× simulated slowdown). This is the largest single main-thread blocker after GLTF fetch (21 ms, CDN-cached).

---

## 2. Pipeline dependency diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     SHOWROOM FIRST-USABLE-FRAME CRITICAL PATH               │
└─────────────────────────────────────────────────────────────────────────────┘
  ┌──────────────┐  ┌─────────────────┐  ┌──────────────────┐  ┌───────────┐
  │ 1. Fetch glb │→ │ 2. Parse glB    │→ │ 3. Meshopt decode│→ │ 4. Build  │
  │ (2.16 MB)    │  │ (JSON+BIN)      │  │ (34 bufferViews) │  │ accessors │
  └──────────────┘  └─────────────────┘  └──────────────────┘  └───────────┘
       │                   │                   │                   │
       │  WORKER-COMPATIBLE│  WORKER-COMPATIBLE│ WORKER-COMPATIBLE │ WORKER-COMPATIBLE
       │  (fetch in worker │  (pure JS)        │  (WASM, sync)     │  (typed arrays) │
       │   overlaps net)   │                   │                   │
       ▼                   ▼                   ▼                   ▼
  ┌───────────────────────────────────────────────────────────────────────────┐
  │  TRANSFER decoded ArrayBuffers to main thread (Transferable, zero-copy)   │
  └───────────────────────────────────────────────────────────────────────────┘
       │
       ▼  MAIN-THREAD ONLY (Three.js objects, no WebGL context needed but tied
  ┌──────────────┐  ┌─────────────────┐  ┌──────────────────┐  ┌───────────┐
  │ 5. Reconstruct│→ │ 6. Build Mesh/│→ │ 7. WebGL texture │→ │ 8. Shader │
  │ BufferGeometry│  │ Material/Scene│  │ upload (procedural│  │ compile   │
  │ BufferAttribute│  │ graph         │  │ canvas textures) │  │ (compileAsync)
  └──────────────┘  └─────────────────┘  └──────────────────┘  └───────────┘
       MAIN-THREAD ONLY   MAIN-THREAD ONLY   MAIN-THREAD ONLY   MAIN-THREAD ONLY
```

**Which operations are Worker-compatible:**
- ✅ Fetch the glb (Worker `fetch`, overlaps with network; HTTP cache warmed by `useGLTF.preload` when flag off, or worker fetches directly when flag on).
- ✅ Parse the glB container (walk JSON + BIN chunks — pure JS, no DOM/WebGL).
- ✅ Meshopt decompression (`MeshoptDecoder` from `three-stdlib` is **self-contained**: WASM embedded as a string, `WebAssembly.instantiate` works inside a Worker; `decodeGltfBuffer` is synchronous CPU work on ArrayBuffers).
- ✅ Slicing accessors into typed arrays over the decoded buffers.

**Which operations MUST stay on the main thread:**
- ❌ Three.js object construction (`BufferGeometry`, `BufferAttribute`, `Mesh`, `Material`, `Group`, `Scene`).
- ❌ WebGL texture upload (procedural canvas textures from `StudioBackdropTexture.ts` / `F1CarTextures.ts`).
- ❌ Shader compilation (`gl.compileAsync` / the `safeCompileAsync` patch).
- ❌ No WebGL context may be created in the Worker.

**Workload chosen for offloading:** Steps 1–4 (fetch + parse + meshopt decode + accessor slicing). This is exactly the 1,046 ms long task's CPU-bound portion. Steps 5–8 (Three.js scene assembly + texture upload + shader compile) remain on the main thread.

---

## 3. MeshoptDecoder worker compatibility (verified in source)

`node_modules/three-stdlib/libs/MeshoptDecoder.js`:
- `MeshoptDecoder()` instantiates WASM from an **embedded string** (`wasm_base` / `wasm_simd`) via `WebAssembly.instantiate(unpack(wasm), {})` — **no external `.wasm` file** and no network fetch for the decoder.
- `WebAssembly` is available inside Dedicated Workers.
- `decodeGltfBuffer(target, count, stride, source, mode, filter)` is **synchronous** — ideal for a Worker.
- WASM module has **zero imports** (`WebAssembly.Module.imports` = `[]`).

**Dependency risk:** `three-stdlib/package.json` uses an `exports` map, so the worker imports `MeshoptDecoder` from the bare specifier `three-stdlib` (the public index, same as drei's `useGLTF`), not a deep subpath.

---

## 4. Implementation design (feature flagged, default OFF)

`src/components/showroom/useWorkerGLTF.ts`:
- Exports `EXPERIMENTAL_WORKER_GLTF` — `true` only when `VITE_EXPERIMENTAL_WORKER_GLTF=true`. Defaults to `false` → behavior **byte-for-byte identical to `useGLTF`**.
- When on: spawns `./workers/gltfMeshoptWorker.ts` via `new Worker(new URL(...), { type: 'module' })` (Vite emits it as a separate lazy chunk: `gltfMeshoptWorker-*.js`).
- Worker receives the glb `ArrayBuffer` as a **Transferable** (zero-copy).
- Worker returns a JSON scene descriptor + the decoded `ArrayBuffer`s as Transferables.
- Main thread reconstructs `BufferGeometry`/`BufferAttribute`/meshes/materials/scene from the descriptor.
- **Failure handling:** worker init failure, fetch failure, decode error, and a 20 s timeout all fall back to the original `useGLTF` path. Component unmount terminates the worker and ignores stale messages (`abortedRef`/`cancelled`).
- `useGLTF.preload('/models/c42.v2.glb')` is guarded by `!EXPERIMENTAL_WORKER_GLTF` so the worker experiment does not double-parse on the main thread.

`src/components/showroom/workers/gltfMeshoptWorker.ts`:
- Minimal glB parser (magic/version/length, JSON + BIN chunks).
- Decodes every compressed bufferView via `MeshoptDecoder.decodeGltfBuffer`.
- Posts `{type:'RESULT', id, descriptor}` + transferred decoded buffers; `{type:'ERROR', id, error}` on failure.

`src/components/showroom/F1Car3DModel.tsx`:
- Replaces `useGLTF('/models/c42.v2.glb')` with `useWorkerGLTF()`.
- `scene = gltf?.scene ?? null`; the clone `useMemo` guards `!scene`.
- Preload guarded by `!EXPERIMENTAL_WORKER_GLTF`.

---

## 5. Feasibility verdict

**FEASIBLE.** A suitable, isolated, Worker-compatible workload exists (meshopt decode of all 34 bufferViews) and is the CPU-bound core of the 1,046 ms long task. The PoC is implemented and:
- Type-check: clean (`tsc --noEmit` exit 0)
- Lint: clean (0 errors)
- Tests: 278/278 pass
- Build: clean
- Initial JS bundle: 109.9 KiB gzip (unchanged, ≤ 180 KiB budget)
- Showroom shell: 0 static WebGL dependencies (unchanged)
- Worker emitted as a separate lazy chunk (`gltfMeshoptWorker-*.js`)

**Not yet validated:** live multi-run browser benchmarking (5 cold runs per profile) **could not be executed** in this offline environment — no Lighthouse CLI, no Puppeteer/Playwright, and no browser automation tooling is installed. Therefore the actual main-thread saving cannot be measured here. See `m3d32-benchmark.md` and `m3d32-decision.md`.
