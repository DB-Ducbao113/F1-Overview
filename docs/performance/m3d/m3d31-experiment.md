# M3D.3.1 — Static Studio Texture Experiment: Investigation & Determination

**Mission:** Showroom Speed & Stability (M3D.3)  
**Branch:** `perf/showroom-speed-r21`  
**Base commit:** `2779cac5`  
**Status:** **REJECTED — static-asset substitution not technically appropriate under current constraints**  
**Original implementation retained:** `src/components/showroom/StudioBackdropTexture.ts` (canonical; serves as its own A/B reference)

---

## 1. What was investigated

**Current studio texture pipeline** (`StudioBackdropTexture.ts` + `StudioW15Stage.tsx` + `useShowroomTextureSet.ts`):

- Four backdrop textures per (team, language): north (premiere branding), south (technical dossier), west (drivers hall of fame), east (all-time achievements).
- Each is a `THREE.CanvasTexture` from a 1024×512 canvas (logical 2048×1024 drawn at `ctx.scale(0.5, 0.5)`), generated **synchronously on mount** inside `useShowroomTextureSet`'s effect, with `yieldToMain()` yielded between slots.
- Per texture: gradients, brushed-grain rects (~256 hairlines), wrapped bilingual text, team accent colors, team name / model / power unit / base, plus an **async SVG logo overlay** (blob URL → `Image` onload → redraw + `texture.needsUpdate`).
- Texture settings preserved on every texture: `anisotropy=16`, `generateMipmaps=true`, `colorSpace=SRGBColorSpace`, `magFilter=LinearFilter`, `minFilter=LinearMipmapLinearFilter`, `wrap=ClampToEdge`.
- Materials in `StudioW15Stage.tsx` consume each wall texture as both `map` and `emissiveMap` on `meshStandardMaterial` (roughness 0.25, metalness 0.2, emissiveIntensity 0.36–0.38).
- Cache: `showroomTextureCache` namespace `studio`, key `${teamId}:${lang}:studio-v1`, bounded (1 inactive set retained), refcounted, `disposeAll()` on route unmount.

**Measured cost (M3D.2 baseline, `docs/performance/m3d/baseline.md` §2):**

| Phase | Desktop | Mobile (4× simulated slowdown) |
|-------|---------|--------------------------------|
| Studio texture generation | 208 ms (LONG TASK) | ~830 ms (scales ~4×) |
| Combined procedural textures (studio + car) | 281 ms | >1,100 ms |
| Main-thread JS (showroom) | ~3,423 ms | ~12,844 ms |

Per `optimization-opportunities.md` §1, studio wall textures are static and identical in structure across teams (only colors/text/logo vary), rated "Very Low" technical risk for static replacement, estimated ~200–250 ms main-thread saving on desktop.

## 2. Experiment plan (M3D.3.1 as scoped)

Per the M3D.3 plan, M3D.3.1 was to:

1. Generate static studio backdrop assets at build time.
2. Prefer WebP or other lossless/visually acceptable format.
3. Preserve original material/texture settings (filters, anisotropy, colorSpace, map+emissiveMap usage).
4. Avoid adding unnecessary initial downloads.
5. Keep the original implementation as an A/B reference.
6. Measure first-frame, TBT, LCP, JS work, transfer bytes — ≥5 cold runs per configuration under identical conditions.

And per the acceptance criteria: reject and restore if no meaningful repeatable improvement; no reduction in desktop visual quality; identical walls; no new console errors; no new WebGL deps in shell; no initial JS bundle regression; tests/lint/type-check/build pass.

## 3. Technical appropriateness determination

**Determination: NOT technically appropriate in this environment.** Blockers:

1. **No server-side image rasterization tooling.** The studio backdrops are produced by the browser's Canvas 2D API (gradients, wrapped text with `measureText`-driven line breaking, radial flares, SVG logo compositing). There is no `canvas`/`sharp`/image library in `node_modules`, no Puppeteer/Playwright, no Lighthouse CLI, and network installs are out of scope ($0, no external retrieval). Generating pixel-faithful WebP/PNG backdrops at build time in Node is therefore impossible.
2. **Pixel fidelity cannot be verified without a browser.** Even an SVG port of the canvas drawing would re-rasterize text and gradients in the browser at runtime; text wrap points and glyph metrics can differ from Canvas 2D output. This risks violating the acceptance gate "Identical studio walls" / "No reduction in desktop visual quality" (release gate GATE-03). There is no headless browser available to render diff evidence.
3. **Cold-run measurement constraint.** The acceptance criteria require ≥5 cold runs per configuration. IndexedDB persistence of generated textures (the other M3D.3 proposal for textures) only helps repeat visits, not cold runs, so it cannot be validated against the cold-run criteria either.
4. **Budget ceiling below target.** Even a perfect M3D.3.1 removes at most 208 ms of desktop main-thread work. The M3D.3 desktop first-usable-frame target requires ≥874 ms saved (4,364 ms → ≤3,490 ms). Studio texture removal alone cannot meet the target; it depends on M3D.3.2 (worker GLTF ingestion, the 1,046 ms long task) and M3D.3.3 (shader pruning).

## 4. Benchmark: original vs candidate

| Metric | Baseline (original, committed artifacts) | Candidate (static WebP backdrops) | Delta | Verdict |
|--------|------------------------------------------|-----------------------------------|-------|---------|
| Studio texture main-thread cost (desktop) | 208 ms | ~0 ms (network decode instead) | −208 ms | Not achievable without build-time rasterization tooling |
| Studio texture main-thread cost (mobile 4×) | ~830 ms | ~0 ms | −830 ms | Not achievable |
| Desktop first usable frame | 4,364 ms | — | Needs ≥ −874 ms for M3D.3 target | M3D.3.1 alone insufficient |
| Mobile TBT | 8,441 ms | — | Needs ≥ −1,688 ms | M3D.3.1 alone insufficient |
| Initial JS bundle | 109.9 KiB gzip | — | ≤180 KiB budget | N/A — no change |
| Static studio assets in `public/` | none | 88 files (11 teams × 2 langs × 4 walls) | +transfer | Would add initial downloads unless carefully lazy-loaded — conflicts with "avoid unnecessary initial downloads" |

**Original vs candidate could not be executed:** no static assets were generated (see determination), no browser automation exists for ≥5 cold Lighthouse runs, and no code change was made to `StudioBackdropTexture.ts`. The original implementation remains the A/B reference by default (it is the implementation).

**Measured telemetry available for future runs** (already instrumented in code): `showroom:studio:texture-generation`, per-slot `showroom:studio:texture:<slot>` marks, and `showroom:first-usable-frame` — see `useShowroomTextureSet.ts` and `ShowroomStartupCoordinator.tsx`.

## 5. Decision

**REJECT M3D.3.1 static studio texture substitution.**

- No code changes to `src/components/showroom/` were made.
- `StudioBackdropTexture.ts` remains the canonical implementation.
- No new files in `public/`; no new WebGL dependencies in the shell; no initial JS bundle change.
- Zero runtime diff: identical liveries, colors, studio walls, reflections, all 11 liveries and 7 hotspots unaffected.

## 6. Updated M3D.3 recommendation

| Phase | Recommendation | Rationale |
|-------|---------------|-----------|
| **M3D.3.1** Static studio WebP textures | **Deferred** | Not technically appropriate without server-side canvas/image tooling; cannot guarantee pixel-faithful walls; cold-run criteria unverifiable offline. Revisit when a build-time image pipeline (e.g. `sharp`/node-canvas + committed static WebPs) is available. |
| **M3D.3.2** Worker-based GLTF ingestion | **Priority** | Largest verified long task: GLTF parse 1,046 ms (desktop main thread; ~4,200 ms under mobile 4×). Offloading to a Web Worker attacks the dominant TBT driver. |
| **M3D.3.3** PBR shader chunk pruning | **Secondary** | Shader compilation 666 ms; safe only after the M3D.1 `safeCompileAsync` lifecycle is stable (audited above) and with visual regression coverage for all 11 liveries × 7 hotspots. |

**Long-task attribution note (Phase B):** Lighthouse long-tasks attribute by script URL, so `vendor-three-DnMMrDP1.js` bundles GLTF parse, texture generation, material setup, and shader compilation together. A 1.5 s wall-clock interval must **not** be attributed entirely to shader CPU work without profiler/trace evidence — the committed traces attribute GLTF parse (1,046 ms), procedural textures (281 ms), material setup (1,189 ms), and compileAsync (666 ms) as separate telemetry phases, some of which overlap in wall-clock time (studio texture generation overlaps GLTF download/parse; compileAsync starts only after both car and studio are ready).

## 7. Gate status (unchanged)

- Tests: 279/279 pass (incl. new `safeCompileAsync.reproduction.test.ts`)
- Lint: 0 errors (4 pre-existing warnings)
- Type-check: 0 errors
- Build: passes; initial bundle 109.9 KiB gzip; showroom shell has 0 static WebGL deps
- No console errors introduced; no visual change (original retained)

**Commit:** No experiment was accepted, so no commit is made. Tree remains at `8c65b93` (M3D.1/M3D.2). Stop after M3D.3.1 as instructed — no push, merge, or deploy.
