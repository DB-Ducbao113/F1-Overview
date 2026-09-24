import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useCarStore } from '../../store/useCarStore';

export const WindTunnelStreamlines: React.FC = () => {
  const { windTunnelActive } = useCarStore();
  const count = 350;
  const pointsRef = useRef<THREE.Points>(null);

  // Generate stream paths along F1 aerodynamic channels
  const [positions, speeds] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Spawn streamlines ahead of the car [x: -1.2 to 1.2, y: 0.05 to 1.1, z: 2.8 to 4.5]
      const lane = Math.random();
      let x = (Math.random() - 0.5) * 2.2;
      let y = Math.random() * 0.9 + 0.05;

      // Ground effect Venturi tunnels concentration
      if (lane < 0.45) {
        x = (Math.random() - 0.5) * 1.3;
        y = Math.random() * 0.2 + 0.02; // Under the floor!
      }

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = Math.random() * 6 - 2;

      spd[i] = Math.random() * 6 + 10; // High speed flow
    }

    return [pos, spd];
  }, []);

  useFrame((_, delta) => {
    if (!windTunnelActive || !pointsRef.current) return;

    const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const array = posAttr.array as Float32Array;

    for (let i = 0; i < count; i++) {
      // Move backwards along Z axis (from front to rear)
      array[i * 3 + 2] -= speeds[i] * delta;

      // When particle passes beyond rear diffuser (z < -3.2), reset to front
      if (array[i * 3 + 2] < -3.2) {
        array[i * 3 + 2] = 3.6 + Math.random() * 1.2;
      }
    }
    posAttr.needsUpdate = true;
  });

  if (!windTunnelActive) return null;

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color="#00f0ff"
        transparent
        opacity={0.75}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};
