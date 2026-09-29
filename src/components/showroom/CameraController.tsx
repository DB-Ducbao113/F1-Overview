import React, { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import { HotspotItem } from '../../data/showroom/hotspotsData';

interface CameraControllerProps {
  activeHotspot: HotspotItem | null;
  autoRotate: boolean;
}

const DEFAULT_POS = new THREE.Vector3(3.2, 1.6, 3.8);
const DEFAULT_TARGET = new THREE.Vector3(0, 0.35, 0);

export const CameraController: React.FC<CameraControllerProps> = ({
  activeHotspot,
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
    } else {
      desiredPos.current.copy(DEFAULT_POS);
      desiredTarget.current.copy(DEFAULT_TARGET);
    }
  }, [activeHotspot]);

  useFrame((_, delta) => {
    // Smooth lerp speed (higher = faster snap, lower = smoother drift)
    const factor = Math.min(delta * 4.5, 1);

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
      maxPolarAngle={Math.PI / 2 + 0.05} // Don't flip below ground
      minDistance={1.2}
      maxDistance={8.5}
      autoRotate={autoRotate && !activeHotspot}
      autoRotateSpeed={0.8}
    />
  );
};
