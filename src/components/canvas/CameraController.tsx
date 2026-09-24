import React, { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useCarStore } from '../../store/useCarStore';
import { CameraPreset } from '../../types';

const PRESET_POSITIONS: Record<CameraPreset, [number, number, number]> = {
  isometric: [3.8, 2.0, 3.6],
  front: [0, 0.9, 4.2],
  side: [4.6, 1.1, 0.1],
  top: [0.01, 5.4, 0.1],
  floor: [0, -0.2, 3.2],
  rear: [0, 1.3, -4.1],
};

export const CameraController: React.FC = () => {
  const { cameraPreset, selectedPartId } = useCarStore();
  const controlsRef = useRef<any>(null);
  const { camera } = useThree();

  const targetPosition = useRef(new THREE.Vector3(...PRESET_POSITIONS.isometric));
  const targetLookAt = useRef(new THREE.Vector3(0, 0.4, 0));

  useEffect(() => {
    const pos = PRESET_POSITIONS[cameraPreset] || PRESET_POSITIONS.isometric;
    targetPosition.current.set(...pos);

    if (cameraPreset === 'floor') {
      targetLookAt.current.set(0, 0.1, 0);
    } else {
      targetLookAt.current.set(0, 0.4, 0);
    }
  }, [cameraPreset]);

  // If a part is selected, adjust camera focus slightly towards the part
  useEffect(() => {
    if (!selectedPartId) return;

    if (selectedPartId === 'front-wing') {
      targetPosition.current.set(1.5, 1.1, 3.2);
      targetLookAt.current.set(0, 0.3, 2.2);
    } else if (selectedPartId === 'rear-wing') {
      targetPosition.current.set(1.6, 1.4, -2.8);
      targetLookAt.current.set(0, 0.8, -1.5);
    } else if (selectedPartId === 'venturi-floor') {
      targetPosition.current.set(2.8, 0.3, 0.5);
      targetLookAt.current.set(0, 0, 0);
    } else if (selectedPartId === 'power-unit') {
      targetPosition.current.set(1.8, 1.6, -0.6);
      targetLookAt.current.set(0, 0.5, -0.5);
    }
  }, [selectedPartId]);

  useFrame((_, delta) => {
    if (!controlsRef.current) return;

    // Smooth lerp camera position
    camera.position.lerp(targetPosition.current, delta * 3.5);

    // Smooth lerp OrbitControls target
    controlsRef.current.target.lerp(targetLookAt.current, delta * 4);
    controlsRef.current.update();
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.06}
      maxPolarAngle={Math.PI / 2 + 0.12} // Prevent camera from going too far below floor
      minDistance={1.8}
      maxDistance={9.0}
    />
  );
};
