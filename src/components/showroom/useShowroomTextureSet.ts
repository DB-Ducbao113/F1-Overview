import { useLayoutEffect, useState } from 'react';
import type { Texture } from 'three';
import { acquireSet, type AcquireResult, type TextureNamespace } from './showroomTextureCache';

/**
 * Acquire generated texture sets only after React commits the consumer.
 *
 * Rendering can be restarted or abandoned under StrictMode and concurrent
 * React. Performing cache acquisition in render (including useMemo/state
 * initializers) leaks an unreleasable handle when that render never commits.
 * A layout effect keeps generation before the browser paint while giving
 * React a deterministic cleanup for every successful acquisition.
 */
export const useShowroomTextureSet = (
  namespace: TextureNamespace,
  setKey: string,
  slotNames: readonly string[],
  generate: (slot: string) => Texture,
): Map<string, Texture> | null => {
  const [handle, setHandle] = useState<AcquireResult | null>(null);

  useLayoutEffect(() => {
    const acquired = acquireSet(namespace, setKey, slotNames, generate);
    setHandle(acquired);

    return () => acquired.release();
  }, [generate, namespace, setKey, slotNames]);

  // Keep the committed set attached during a key transition. The layout
  // effect replaces it synchronously before paint, while avoiding a transient
  // scene unmount that would recreate reflection render targets and shaders.
  // The previous handle is released by the same layout-effect cleanup and the
  // cache keeps that entry valid through the replacement commit.
  return handle?.textures ?? null;
};
