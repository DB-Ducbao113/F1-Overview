import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useCarStore } from '../../store/useCarStore';

const PARTICLE_COUNT = 450;

interface StreamlinePath {
  points: THREE.Vector3[];
  speed: number;
  colorType: 'venturi' | 'upper' | 'sidepod';
}

export const WindTunnelStreamlines: React.FC = () => {
  const { windTunnelActive } = useCarStore();
  const pointsRef = useRef<THREE.Points>(null);

  // Generate realistic curved aerodynamics paths around an F1 car
  const { paths, particleData } = useMemo(() => {
    const generatedPaths: StreamlinePath[] = [];

    // 1. Underfloor Venturi paths (accelerating under floor, kicking up at diffuser)
    for (let i = 0; i < 60; i++) {
      const xSign = (i % 2 === 0 ? 1 : -1);
      const xOffset = xSign * (0.2 + (i % 10) * 0.05);
      generatedPaths.push({
        points: [
          new THREE.Vector3(xOffset * 0.4, 0.15, 3.2),
          new THREE.Vector3(xOffset * 0.8, 0.08, 1.8),
          new THREE.Vector3(xOffset * 1.1, 0.04, 0.0), // Venturi throat (lowest, fastest)
          new THREE.Vector3(xOffset * 1.2, 0.06, -1.0),
          new THREE.Vector3(xOffset * 1.0, 0.28, -2.2), // Diffuser kick-up
          new THREE.Vector3(xOffset * 0.7, 0.65, -3.4),
        ],
        speed: 1.4 + Math.random() * 0.4,
        colorType: 'venturi',
      });
    }

    // 2. Upper bodywork paths (over nosecone, halo and down to rear wing)
    for (let i = 0; i < 50; i++) {
      const xOffset = ((i % 10) - 4.5) * 0.09;
      generatedPaths.push({
        points: [
          new THREE.Vector3(xOffset, 0.35, 3.4),
          new THREE.Vector3(xOffset * 1.2, 0.52, 1.9),
          new THREE.Vector3(xOffset * 1.3, 0.88, 0.4),  // Over cockpit/halo
          new THREE.Vector3(xOffset * 1.1, 0.95, -0.8), // Over engine cover
          new THREE.Vector3(xOffset * 0.9, 1.12, -2.1), // Over rear wing
          new THREE.Vector3(xOffset * 0.6, 1.35, -3.2),
        ],
        speed: 1.0 + Math.random() * 0.3,
        colorType: 'upper',
      });
    }

    // 3. Sidepod undercut paths (air directed along the Coke-bottle waist)
    for (let i = 0; i < 40; i++) {
      const xSign = (i % 2 === 0 ? 1 : -1);
      const width = 0.55 + (i % 8) * 0.06;
      generatedPaths.push({
        points: [
          new THREE.Vector3(xSign * 0.5, 0.25, 2.5),
          new THREE.Vector3(xSign * width, 0.32, 1.2),
          new THREE.Vector3(xSign * (width * 0.85), 0.35, -0.5), // Tucking into Coke-bottle
          new THREE.Vector3(xSign * 0.42, 0.45, -1.8),
          new THREE.Vector3(xSign * 0.35, 0.7, -3.0),
        ],
        speed: 1.1 + Math.random() * 0.3,
        colorType: 'sidepod',
      });
    }

    // Initialize individual particles along the paths
    const particles = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const progress = new Float32Array(PARTICLE_COUNT);
    const pathIndices = new Uint16Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const pIdx = i % generatedPaths.length;
      pathIndices[i] = pIdx;
      progress[i] = Math.random(); // random phase offset

      // Default colors (venturi = cyan, upper = amber/red, sidepod = emerald)
      const p = generatedPaths[pIdx];
      if (p.colorType === 'venturi') {
        colors[i * 3]     = 0.0;
        colors[i * 3 + 1] = 0.85;
        colors[i * 3 + 2] = 1.0;
      } else if (p.colorType === 'upper') {
        colors[i * 3]     = 1.0;
        colors[i * 3 + 1] = 0.2;
        colors[i * 3 + 2] = 0.1;
      } else {
        colors[i * 3]     = 0.1;
        colors[i * 3 + 1] = 0.9;
        colors[i * 3 + 2] = 0.5;
      }
    }

    return {
      paths: generatedPaths,
      particleData: { particles, colors, progress, pathIndices },
    };
  }, []);

  // Frame animation
  useFrame((_, delta) => {
    if (!pointsRef.current || !windTunnelActive) return;

    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const { progress, pathIndices } = particleData;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const path = paths[pathIndices[i]];
      progress[i] = (progress[i] + delta * path.speed * 0.45) % 1.0;

      // Sample path using Catmull-Rom or linear interpolation across keyframes
      const pts = path.points;
      const totalSegments = pts.length - 1;
      const tVal = progress[i] * totalSegments;
      const segIndex = Math.min(Math.floor(tVal), totalSegments - 1);
      const localT = tVal - segIndex;

      const p0 = pts[segIndex];
      const p1 = pts[segIndex + 1];

      positions[i * 3]     = p0.x + (p1.x - p0.x) * localT;
      positions[i * 3 + 1] = p0.y + (p1.y - p0.y) * localT;
      positions[i * 3 + 2] = p0.z + (p1.z - p0.z) * localT;
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  if (!windTunnelActive) return null;

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={PARTICLE_COUNT}
          array={particleData.particles}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={PARTICLE_COUNT}
          array={particleData.colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.065}
        vertexColors
        transparent
        opacity={0.85}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};
