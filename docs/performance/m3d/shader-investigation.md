# M3D.1 — Shader Lifecycle Investigation & Resolution

**Date:** 2026-10-16  
**Mission:** Showroom Speed & Stability  
**Branch:** `perf/showroom-speed-r21`  
**Base Commit:** `2779cac5d685a06092d4d38f81e23daccccec1f4`  
**Status:** ✅ REPRODUCED & RESOLVED

---

## 1. Problem Statement

During rapid Showroom navigation and team switching in Release 2 production telemetry, an uncaught runtime exception was recorded:
```
TypeError: Cannot read properties of undefined (reading 'isReady')
```
This error occurred intermittently when users navigated away from `/showroom` before 3D model resources and shaders had completed compilation, or during rapid sequential livery changes.

---

## 2. Reproduction Methodology

An automated reproduction script (`scratch/reproduce-isready.mjs`) was executed against the local production preview bundle using Chrome DevTools Protocol (CDP) with hardware acceleration enabled:
- **Scenario 1:** Initial load of homepage with Start Lights dismissal.
- **Scenario 2:** 30 rapid sequential route transitions (`/showroom` ↔ `/season/2026`) with random dwell intervals between 50ms and 500ms (coinciding with active shader compilation).
- **Scenario 3:** Rapid sequential team switching (20 clicks across all 11 teams) with 40–190ms intervals.
- **Scenario 4:** Navigation away during rapid team switches.

### Reproduction Results (Baseline before fix)
- Total Exceptions Captured: **11**
- Exception Pattern: **100% matched `Cannot read properties of undefined (reading 'isReady')`**
- Occurred during rapid exit from `/showroom` while `compileAsync` was pending.

### Captured Stack Trace
```
TypeError: Cannot read properties of undefined (reading 'isReady')
    at http://127.0.0.1:4173/assets/vendor-three-DnMMrDP1.js:3802:26935
    at Set.forEach (<anonymous>)
    at Be (http://127.0.0.1:4173/assets/vendor-three-DnMMrDP1.js:3802:26889)
    at (http://127.0.0.1:4173/assets/vendor-three-DnMMrDP1.js:3801:26934)
    at Be (http://127.0.0.1:4173/assets/vendor-three-DnMMrDP1.js:3801:26888)
```

Mapping to unminified Three.js source (`three@0.165.0/src/renderers/WebGLRenderer.js:1008-1013`):
```javascript
function checkMaterialsReady() {
    materials.forEach( function ( material ) {
        const materialProperties = properties.get( material );
        const program = materialProperties.currentProgram;

        if ( program.isReady() ) { // <-- Throws when program is undefined
            materials.delete( material );
        }
    } );
    ...
    setTimeout( checkMaterialsReady, 10 );
}
```

---

## 3. Root Cause Analysis

1. **Async Polling Loop:** In Three.js `WebGLRenderer.compileAsync()`, when the `KHR_parallel_shader_compile` extension is present, Three.js gathers all scene materials into a `Set<Material>` and enters a recurring `setTimeout(checkMaterialsReady, 10)` timer loop.
2. **Material Deallocation on Route Exit:** When the user leaves `/showroom`, React unmounts `<ShowroomView>`, `<ShowroomScene>`, and R3F's `<Canvas>`. The canvas disposal routine or material cleanup dispatches `'dispose'` events on the scene's materials.
3. **Property Clearing:** Three.js's internal `deallocateMaterial(material)` executes:
   ```javascript
   function deallocateMaterial( material ) {
       releaseMaterialProgramReferences( material );
       properties.remove( material );
   }
   ```
   `properties.remove(material)` removes the material from `WebGLProperties`'s internal `WeakMap`.
4. **Unhandled Event Loop Crash:** The previously scheduled `setTimeout(checkMaterialsReady, 10)` fires on the global event loop 10ms later. It calls `properties.get(material)`, which now returns an empty object `{}`. Consequently, `materialProperties.currentProgram` is `undefined`.
5. **Evaluating `program.isReady()`:** Evaluating `undefined.isReady()` throws a `TypeError`. Because this occurs inside a `setTimeout` callback rather than inside a promise execution block, it cannot be caught by `.catch()` on the `compileAsync` promise—it escapes directly to the `window` error handler as an unhandled exception.

---

## 4. Safe Architectural Correction

Per engineering rules:
- **No global error suppression** (e.g. `window.onerror = () => true` was NOT used).
- **No modification to `node_modules`** (strictly non-invasive).
- **Minimal safe correction** targeting the renderer instance.

### Implementation: `ensureSafeCompileAsync(gl)`
Located in [`src/components/showroom/safeCompileAsync.ts`](file:///E:/Formula%201/F1-Overview/src/components/showroom/safeCompileAsync.ts):

```typescript
export function ensureSafeCompileAsync(gl: WebGLRenderer): void {
  // Idempotent guard
  if (glAny[SAFE_COMPILE_INSTALLED]) return;
  glAny[SAFE_COMPILE_INSTALLED] = true;

  if (typeof glAny.compileAsync !== 'function' || typeof glAny.compile !== 'function') return;

  glAny.compileAsync = function (scene, camera, targetScene = null): Promise<Scene> {
    const materials = gl.compile(scene, camera, targetScene);
    const properties = glAny.properties;
    const extensions = glAny.extensions;

    return new Promise((resolve) => {
      function checkMaterialsReady() {
        materials.forEach((material) => {
          const materialProperties = properties?.get(material);
          const program = materialProperties?.currentProgram;

          // If the material was deallocated, disposed, or lacked a compiled program,
          // program is undefined. Drop it from the waiting set so the loop can
          // cleanly finish or resolve without throwing.
          if (!program || (typeof program.isReady === 'function' && program.isReady())) {
            materials.delete(material);
          }
        });

        if (materials.size === 0) {
          resolve(scene);
          return;
        }

        setTimeout(checkMaterialsReady, 10);
      }

      if (extensions?.get('KHR_parallel_shader_compile') !== null) {
        checkMaterialsReady();
      } else {
        setTimeout(checkMaterialsReady, 10);
      }
    });
  };
}
```

### Integration Points:
1. **[`ShowroomScene.tsx`](file:///E:/Formula%201/F1-Overview/src/components/showroom/ShowroomScene.tsx):**
   ```tsx
   <Canvas
     ...
     onCreated={({ gl }) => {
       ensureSafeCompileAsync(gl);
     }}
   >
   ```
2. **[`ShowroomStartupCoordinator.tsx`](file:///E:/Formula%201/F1-Overview/src/components/showroom/ShowroomStartupCoordinator.tsx):**
   ```tsx
   ensureSafeCompileAsync(gl);
   const compileAsync = gl.compileAsync?.bind(gl);
   ```

---

## 5. Verification & Test Results

1. **Unit Test Suite:**
   Added [`src/components/showroom/safeCompileAsync.test.ts`](file:///E:/Formula%201/F1-Overview/src/components/showroom/safeCompileAsync.test.ts):
   - Verified that materials with missing/undefined programs drop out of the compilation set and resolve cleanly.
   - Verified idempotency (does not wrap twice).
   - **Result:** `PASS (2/2 tests)` in 4ms.

2. **Automated Reproduction Re-run (30 Rapid Cycles):**
   - Executed against the rebuilt preview bundle.
   - Total Exceptions: **0 (down from 11)**.
   - Total Console Errors: **0**.
   - `isReady` Exceptions: **0**.

3. **Status:** Confirmed completely resolved.
