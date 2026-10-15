import React, { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';

interface ShowroomStartupCoordinatorProps {
  sceneKey: string;
  active: boolean;
  onFirstUsableFrame: (sceneKey: string) => void;
}

type StartupPhase = 'waiting-resources' | 'compiling' | 'waiting-frame' | 'complete';

/**
 * Compiles the fully-attached scene, then keeps the loader visible until the
 * first frame containing both the car and studio has actually been submitted.
 */
export const ShowroomStartupCoordinator: React.FC<ShowroomStartupCoordinatorProps> = ({
  sceneKey,
  active,
  onFirstUsableFrame,
}) => {
  const { gl, scene, camera, invalidate } = useThree();
  const phaseRef = useRef<StartupPhase>('waiting-resources');
  const sceneKeyRef = useRef(sceneKey);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    sceneKeyRef.current = sceneKey;
    phaseRef.current = 'waiting-resources';
    invalidate();
  }, [invalidate, sceneKey]);

  useFrame(() => {
    if (!active) return;

    if (phaseRef.current === 'waiting-resources') {
      const carReady = scene.getObjectByName('showroom-car');
      const studioReady = scene.getObjectByName('showroom-studio');
      if (!carReady || !studioReady) return;

      const compilingKey = sceneKeyRef.current;
      phaseRef.current = 'compiling';
      performance.mark('showroom:compile:start');
      const compileAsync = gl.compileAsync?.bind(gl);
      const compilation = compileAsync
        ? compileAsync(scene, camera)
        : Promise.resolve().then(() => gl.compile(scene, camera));

      void compilation
        .catch(() => {
          // Some WebGL implementations expose compileAsync without the
          // parallel-shader extension. Fall back to Three's supported sync
          // compile path and keep the readiness contract intact.
          gl.compile(scene, camera);
        })
        .then(() => {
          if (
            !mountedRef.current ||
            sceneKeyRef.current !== compilingKey ||
            phaseRef.current !== 'compiling'
          )
            return;
          performance.mark('showroom:compile:end');
          performance.measure('showroom:compile', {
            start: 'showroom:compile:start',
            end: 'showroom:compile:end',
          });
          phaseRef.current = 'waiting-frame';
          invalidate();
        });
      return;
    }

    if (phaseRef.current === 'waiting-frame') {
      const renderedKey = sceneKeyRef.current;
      phaseRef.current = 'complete';
      requestAnimationFrame(() => {
        if (
          !mountedRef.current ||
          sceneKeyRef.current !== renderedKey ||
          phaseRef.current !== 'complete'
        )
          return;
        performance.mark('showroom:first-usable-frame');
        onFirstUsableFrame(renderedKey);
      });
    }
  });

  return null;
};
