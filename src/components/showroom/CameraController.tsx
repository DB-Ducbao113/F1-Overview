import React, { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import { HotspotItem } from '../../data/showroom/hotspotsData';

export type CameraPreset = 'overview' | 'front' | 'cockpit' | 'rear' | 'top';

interface CameraControllerProps {
  activeHotspot: HotspotItem | null;
  cameraPreset?: CameraPreset | null;
  autoRotate: boolean;
}

const PRESET_VIEWS: Record<CameraPreset, { pos: [number, number, number]; target: [number, number, number] }> = {
  overview: { pos: [3.2, 1.6, -3.4], target: [0, 0.42, 0] },
  front: { pos: [0, 0.8, -3.7], target: [0, 0.3, -1.8] },
  cockpit: { pos: [0.8, 1.1, -0.6], target: [0, 0.55, -0.2] },
  rear: { pos: [0, 1.25, 3.9], target: [0, 0.65, 1.8] },
  top: { pos: [0.01, 5.8, 0], target: [0, 0.2, 0] },
};

const DEFAULT_POS = new THREE.Vector3(...PRESET_VIEWS.overview.pos);
const DEFAULT_TARGET = new THREE.Vector3(...PRESET_VIEWS.overview.target);

export const CameraController: React.FC<CameraControllerProps> = ({
  activeHotspot,
  cameraPreset,
  autoRotate,
}) => {
  const { camera } = useThree();
  const controlsRef = useRef<OrbitControlsImpl>(null);

  const desiredPos = useRef(DEFAULT_POS.clone());
  const desiredTarget = useRef(DEFAULT_TARGET.clone());
  const isTransitioning = useRef<boolean>(true);

  useEffect(() => {
    if (activeHotspot) {
      desiredPos.current.set(...activeHotspot.cameraPos);
      desiredTarget.current.set(...activeHotspot.cameraTarget);
      isTransitioning.current = true;
    } else if (cameraPreset && PRESET_VIEWS[cameraPreset]) {
      const p = PRESET_VIEWS[cameraPreset];
      desiredPos.current.set(...p.pos);
      desiredTarget.current.set(...p.target);
      isTransitioning.current = true;
    }
  }, [activeHotspot, cameraPreset]);

  useFrame((_, delta) => {
    if (!controlsRef.current) return;

    if (isTransitioning.current) {
      const factor = Math.min(delta * 3.5, 1);
      camera.position.lerp(desiredPos.current, factor);
      controlsRef.current.target.lerp(desiredTarget.current, factor);
      controlsRef.current.update();

      const distPos = camera.position.distanceTo(desiredPos.current);
      const distTarget = controlsRef.current.target.distanceTo(desiredTarget.current);

      if (distPos < 0.05 && distTarget < 0.05) {
        camera.position.copy(desiredPos.current);
        controlsRef.current.target.copy(desiredTarget.current);
        controlsRef.current.update();
        isTransitioning.current = false;
      }
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.06}
      maxPolarAngle={Math.PI / 2 + 0.02} // Prevent camera going below floor
      minDistance={0.8}
      maxDistance={8.5}
      autoRotate={autoRotate && !activeHotspot && !isTransitioning.current}
      autoRotateSpeed={0.8}
      onStart={() => {
        // User manually dragged the mouse: pause programmatic transition
        isTransitioning.current = false;
      }}
    />
  );
};

