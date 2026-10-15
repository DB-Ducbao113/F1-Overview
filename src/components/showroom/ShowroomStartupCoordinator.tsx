import React, { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';

interface ShowroomStartupCoordinatorProps {
  sceneKey: string;
  active: boolean;
  carReady: boolean;
  studioReady: boolean;
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
  carReady,
  studioReady,
  onFirstUsableFrame,
}) => {
  const { gl, scene, camera, invalidate } = useThree();
  const phaseRef = useRef<StartupPhase>('waiting-resources');
  const sceneKeyRef = useRef(sceneKey);
  const mountedRef = useRef(true);
  const carReadyMarkedRef = useRef(false);
  const studioReadyMarkedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    sceneKeyRef.current = sceneKey;
    phaseRef.current = 'waiting-resources';
    carReadyMarkedRef.current = false;
    studioReadyMarkedRef.current = false;
    invalidate();
  }, [invalidate, sceneKey]);

  useEffect(() => {
    // Readiness is owned by ShowroomView, outside the R3F root. Its React
    // commit does not itself guarantee a demand frame, so schedule one after
    // the coordinator has received the committed readiness props.
    if (active && (carReady || studioReady)) invalidate();
  }, [active, carReady, invalidate, studioReady]);

  useFrame(() => {
    if (!active) return;

    if (phaseRef.current === 'waiting-resources') {
      const carRoot = scene.getObjectByName('showroom-car');
      const studioRoot = scene.getObjectByName('showroom-studio');
      if (carReady && carRoot && !carReadyMarkedRef.current) {
        carReadyMarkedRef.current = true;
        performance.mark('showroom:car-ready');
      }
      if (studioReady && studioRoot && !studioReadyMarkedRef.current) {
        studioReadyMarkedRef.current = true;
        performance.mark('showroom:studio-ready');
      }
      if (!carReady || !studioReady || !carRoot || !studioRoot) {
        // Keep the loader covering the canvas until both committed scene
        // parts are ready. Rendering a newly attached partial scene here can
        // synchronously compile its shaders before compileAsync gets control,
        // which was the M3B.4 first-usable regression on throttled devices.
        return;
      }

      const compilingKey = sceneKeyRef.current;
      phaseRef.current = 'compiling';
      performance.mark('showroom:required-resources-ready');
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
      // M3B.4.1: this component owns the render pass (priority 1). Skipping
      // gl.render while compileAsync is pending prevents R3F's automatic
      // render from forcing the same shaders through a synchronous startup
      // path. Once compilation resolves, submit exactly one complete frame.
      gl.render(scene, camera);
      const renderedKey = sceneKeyRef.current;
      phaseRef.current = 'complete';
      requestAnimationFrame(() => {
        if (
          !mountedRef.current ||
          sceneKeyRef.current !== renderedKey ||
          phaseRef.current !== 'complete'
        )
          return;
        performance.mark('showroom:first-complete-submitted-frame');
        performance.mark('showroom:first-usable-frame');
        onFirstUsableFrame(renderedKey);
      });
      return;
    }

    if (phaseRef.current === 'complete') gl.render(scene, camera);
  }, 1);

  return null;
};
