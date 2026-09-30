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
  overview: { pos: [3.4, 1.7, 3.8], target: [0, 0.35, 0] },
  front: { pos: [0, 0.8, 3.8], target: [0, 0.28, 2.0] },
  cockpit: { pos: [0, 1.05, 0.8], target: [0, 0.6, 0.1] },
  rear: { pos: [0, 1.3, -4.1], target: [0, 0.7, -1.9] },
  top: { pos: [0.01, 6.5, 0], target: [0, 0, 0] },
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

  // Target positions to smoothly interpolate towards
  const desiredPos = useRef(DEFAULT_POS.clone());
  const desiredTarget = useRef(DEFAULT_TARGET.clone());

  useEffect(() => {
    if (activeHotspot) {
      desiredPos.current.set(...activeHotspot.cameraPos);
      desiredTarget.current.set(...activeHotspot.cameraTarget);
    } else if (cameraPreset && PRESET_VIEWS[cameraPreset]) {
      const p = PRESET_VIEWS[cameraPreset];
      desiredPos.current.set(...p.pos);
      desiredTarget.current.set(...p.target);
    } else {
      desiredPos.current.copy(DEFAULT_POS);
      desiredTarget.current.copy(DEFAULT_TARGET);
    }
  }, [activeHotspot, cameraPreset]);

  useFrame((_, delta) => {
    // Smooth lerp speed (higher = faster snap, lower = smoother drift)
    const factor = Math.min(delta * 4.2, 1);

    camera.position.lerp(desiredPos.current, factor);

    if (controlsRef.current) {
      controlsRef.current.target.lerp(desiredTarget.current, factor);
      controlsRef.current.update();
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.06}
      maxPolarAngle={Math.PI / 2 + 0.04} // Prevent clipping below the showroom floor
      minDistance={1.0}
      maxDistance={8.5}
      autoRotate={autoRotate && !activeHotspot && !cameraPreset}
      autoRotateSpeed={0.7}
    />
  );
};
