import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { Texture } from 'three';
import {
  acquireExistingSet,
  acquirePreparedSet,
  disposePreparedSet,
  type AcquireResult,
  type TextureNamespace,
} from './showroomTextureCache';
import { yieldToMain } from './showroomTaskScheduler';

/**
 * Acquire generated texture sets only after React commits the consumer.
 *
 * Rendering can be restarted or abandoned under StrictMode and concurrent
 * React. Performing cache acquisition in render (including useMemo/state
 * initializers) leaks an unreleasable handle when that render never commits.
 * Generation happens after commit and yields between slots. This preserves
 * cache ownership while preventing one cache miss from becoming a single
 * multi-hundred-millisecond startup task.
 */
export const useShowroomTextureSet = (
  namespace: TextureNamespace,
  setKey: string,
  slotNames: readonly string[],
  generate: (slot: string) => Texture,
): Map<string, Texture> | null => {
  const [handle, setHandle] = useState<AcquireResult | null>(null);
  const committedHandleRef = useRef<AcquireResult | null>(null);
  const pendingHandleRef = useRef<AcquireResult | null>(null);

  useEffect(() => {
    let cancelled = false;
    let effectHandle: AcquireResult | null = null;
    const existing = acquireExistingSet(namespace, setKey);
    if (existing) {
      effectHandle = existing;
      pendingHandleRef.current = existing;
      performance.mark(`showroom:${namespace}:textures-ready`);
      setHandle(existing);
      return () => {
        cancelled = true;
        if (pendingHandleRef.current === effectHandle) {
          pendingHandleRef.current = null;
          effectHandle?.release();
        }
      };
    }

    const prepared = new Map<string, Texture>();
    const generateSet = async () => {
      performance.mark(`showroom:${namespace}:texture-generation:start`);
      try {
        for (const slot of slotNames) {
          if (cancelled) {
            disposePreparedSet(prepared);
            return;
          }
          const started = performance.now();
          prepared.set(slot, generate(slot));
          performance.measure(`showroom:${namespace}:texture:${slot}`, {
            start: started,
            end: performance.now(),
          });
          await yieldToMain();
        }

        if (cancelled) {
          disposePreparedSet(prepared);
          return;
        }

        const acquired = acquirePreparedSet(namespace, setKey, prepared);
        effectHandle = acquired;
        performance.mark(`showroom:${namespace}:texture-generation:end`);
        performance.measure(`showroom:${namespace}:texture-generation`, {
          start: `showroom:${namespace}:texture-generation:start`,
          end: `showroom:${namespace}:texture-generation:end`,
        });
        performance.mark(`showroom:${namespace}:textures-ready`);
        if (cancelled) acquired.release();
        else {
          pendingHandleRef.current = acquired;
          setHandle(acquired);
        }
      } catch (error) {
        disposePreparedSet(prepared);
        throw error;
      }
    };

    void generateSet();

    return () => {
      cancelled = true;
      if (pendingHandleRef.current === effectHandle) {
        pendingHandleRef.current = null;
        effectHandle?.release();
      }
    };
  }, [generate, namespace, setKey, slotNames]);

  // Release the previous committed set only after the replacement has
  // committed, so no material can reference an evicted texture.
  useLayoutEffect(() => {
    if (!handle || handle.key !== setKey || committedHandleRef.current === handle) return;
    if (pendingHandleRef.current === handle) pendingHandleRef.current = null;
    const previous = committedHandleRef.current;
    committedHandleRef.current = handle;
    previous?.release();
  }, [handle, setKey]);

  useEffect(
    () => () => {
      committedHandleRef.current?.release();
      committedHandleRef.current = null;
      pendingHandleRef.current?.release();
      pendingHandleRef.current = null;
    },
    [],
  );

  // Keep the committed set attached during a key transition. The layout
  // effect replaces it synchronously before paint, while avoiding a transient
  // scene unmount that would recreate reflection render targets and shaders.
  // The previous handle is released by the same layout-effect cleanup and the
  // cache keeps that entry valid through the replacement commit.
  return handle?.key === setKey ? handle.textures : null;
};
