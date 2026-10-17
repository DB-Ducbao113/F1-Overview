import type { WebGLRenderer, Scene, Camera } from 'three';

const SAFE_COMPILE_INSTALLED = Symbol('SAFE_COMPILE_INSTALLED');

/**
 * Three.js WebGLRenderer.compileAsync contains a known lifecycle flaw:
 * when materials or scene meshes are disposed/unmounted while KHR_parallel_shader_compile
 * setTimeout polling is in-flight, `properties.get(material)` returns an empty object,
 * causing `program.isReady()` to throw:
 *   TypeError: Cannot read properties of undefined (reading 'isReady')
 *
 * This utility wraps gl.compileAsync on the renderer instance to safely check
 * `program?.isReady()` and remove any deallocated or disposed materials from
 * the waiting set without throwing uncaught async errors.
 */
export function ensureSafeCompileAsync(gl: WebGLRenderer): void {
  const glAny = gl as unknown as {
    [SAFE_COMPILE_INSTALLED]?: boolean;
    properties?: { get: (obj: unknown) => { currentProgram?: { isReady?: () => boolean } } };
    extensions?: { get: (ext: string) => unknown };
    compileAsync: (scene: Scene, camera: Camera, targetScene?: Scene | null) => Promise<Scene>;
    compile: (scene: Scene, camera: Camera, targetScene?: Scene | null) => Set<unknown>;
  };

  if (glAny[SAFE_COMPILE_INSTALLED]) return;
  glAny[SAFE_COMPILE_INSTALLED] = true;

  if (typeof glAny.compileAsync !== 'function' || typeof glAny.compile !== 'function') return;

  glAny.compileAsync = function (
    scene: Scene,
    camera: Camera,
    targetScene: Scene | null = null,
  ): Promise<Scene> {
    const materials = gl.compile(scene, camera, targetScene);
    const properties = glAny.properties;
    const extensions = glAny.extensions;

    return new Promise((resolve) => {
      function checkMaterialsReady() {
        materials.forEach((material) => {
          const materialProperties = properties?.get(material);
          const program = materialProperties?.currentProgram;

          // If the material was deallocated, disposed, or lacked a compiled program,
          // program is undefined. In Three.js core, calling program.isReady() throws.
          // In our safe wrapper, we drop it from the compilation set so the loop can
          // cleanly finish or resolve.
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
