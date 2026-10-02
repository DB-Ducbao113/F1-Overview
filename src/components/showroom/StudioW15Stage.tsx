import React, { useMemo } from 'react';
import * as THREE from 'three';
import { MeshReflectorMaterial } from '@react-three/drei';
import { TeamId } from '../../types';
import { TEAMS_DATA } from '../../data/teams';

interface StudioW15StageProps {
  teamId: TeamId;
}

/**
 * StudioW15Stage — Authentic F1 Automotive Photoshoot Stage
 * Inspired by the Mercedes-AMG F1 W15 launch reveal & high-end Maranello photo studios:
 * 1. Seamless Cyclorama Infinity Cove (no visible horizon line)
 * 2. Overhead Suspended Softbox Rig with 3 parallel LED strip tubes
 * 3. Lateral Angled Rim Softboxes for crisp aerodynamic body highlights
 * 4. High-Fidelity Mirror Reflector Floor with FIA engineering datum lines
 * 5. Dynamic Rear Backdrop Uplight responsive to team colors
 */
export const StudioW15Stage: React.FC<StudioW15StageProps> = ({ teamId }) => {
  const team = TEAMS_DATA[teamId] || TEAMS_DATA.ferrari;

  // ── 1. Seamless Cyclorama Geometry (Curves from floor up into a vertical studio wall) ──
  const cycloramaGeometry = useMemo(() => {
    // 38m wide, 18m deep plane
    const geom = new THREE.PlaneGeometry(38, 18, 48, 40);
    // Rotate to lie flat initially
    geom.rotateX(-Math.PI / 2);
    const pos = geom.attributes.position;

    // Floor extends from z = 6 to z = -12
    // Curving upward smoothly behind the car starting at z = -2.0 towards y = 8.5 at z = -8.5
    for (let i = 0; i < pos.count; i++) {
      const z = pos.getZ(i);
      if (z < -1.8) {
        const t = Math.min(1.0, Math.max(0.0, (-z - 1.8) / 6.5));
        // Smooth S-curve (cubic hermite)
        const smoothT = t * t * (3 - 2 * t);
        const y = smoothT * 8.2;
        pos.setY(i, y);
        pos.setZ(i, z - smoothT * 1.8);
      }
    }
    geom.computeVertexNormals();
    return geom;
  }, []);

  return (
    <group position={[0, 0, 0]}>
      {/* ── Studio Ambient & Global Photometric Lighting ── */}
      <ambientLight intensity={0.55} color="#f8fafc" />

      {/* Main Studio Key Light (Simulating high-mounted directional key with soft shadow) */}
      <directionalLight
        position={[5.5, 8.5, -4.5]}
        intensity={1.8}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0001}
      />

      {/* Secondary Studio Cool Fill Light (Softens contrast on the opposite flank) */}
      <directionalLight position={[-6.5, 5.5, 3.8]} intensity={0.95} color="#e2e8f0" />

      {/* Subtle Under-Floor Ground Bounce */}
      <directionalLight position={[0, -2.5, 0]} intensity={0.3} color="#ffffff" />

      {/* ── Cyclorama Infinity Backdrop ── */}
      <mesh geometry={cycloramaGeometry} position={[0, -0.01, -0.5]} receiveShadow>
        <meshStandardMaterial color="#08090d" roughness={0.94} metalness={0.06} />
      </mesh>

      {/* ── Rear Backdrop Uplight / Studio Wall Wash ── */}
      {/* Projects a subtle, luxurious glow behind the car's halo/rear-wing silhouette */}
      <spotLight
        position={[0, 0.25, -4.2]}
        target-position={[0, 3.8, -9.5]}
        angle={0.95}
        penumbra={1.0}
        intensity={2.4}
        color={team.primaryColor}
      />
      <pointLight position={[0, 1.8, -6.5]} intensity={0.8} color="#f8fafc" distance={12} />

      {/* ── Suspended Overhead Softbox Rig (Mercedes W15 Photoshoot Signature) ── */}
      <group position={[0, 4.4, -0.1]}>
        {/* Outer Dark Anodized Aluminum Housing */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[4.4, 9.0]} />
          <meshStandardMaterial color="#12131a" roughness={0.35} metalness={0.8} />
        </mesh>

        {/* Luminous Diffuser Panel (Pure 5600K Daylight White) */}
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
          <planeGeometry args={[4.0, 8.5]} />
          <meshBasicMaterial color="#ffffff" toneMapped={false} />
        </mesh>

        {/* 3 High-Intensity Longitudinal LED Strip Tubes (create iconic crisp reflection streaks) */}
        {/* Center Stripe */}
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
          <planeGeometry args={[0.12, 8.2]} />
          <meshBasicMaterial color="#ffffff" toneMapped={false} />
        </mesh>
        {/* Left Stripe */}
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[-1.3, -0.02, 0]}>
          <planeGeometry args={[0.08, 8.2]} />
          <meshBasicMaterial color="#ffffff" toneMapped={false} />
        </mesh>
        {/* Right Stripe */}
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[1.3, -0.02, 0]}>
          <planeGeometry args={[0.08, 8.2]} />
          <meshBasicMaterial color="#ffffff" toneMapped={false} />
        </mesh>

        {/* Downward Flood Spotlight from the Softbox */}
        <spotLight
          position={[0, 0, 0]}
          angle={0.85}
          penumbra={0.75}
          intensity={2.2}
          color="#ffffff"
          castShadow
          shadow-bias={-0.0001}
        />
      </group>

      {/* ── Lateral Studio Strip Softboxes (Side Rim Fill for aerodynamic curves) ── */}
      {/* Left Lateral Strip */}
      <group position={[-3.8, 1.9, 0]} rotation={[0.15, Math.PI / 4, 0]}>
        <mesh>
          <planeGeometry args={[0.3, 7.2]} />
          <meshBasicMaterial color="#ffffff" toneMapped={false} />
        </mesh>
        <pointLight intensity={1.1} distance={7} color="#ffffff" />
      </group>

      {/* Right Lateral Strip */}
      <group position={[3.8, 1.9, 0]} rotation={[0.15, -Math.PI / 4, 0]}>
        <mesh>
          <planeGeometry args={[0.3, 7.2]} />
          <meshBasicMaterial color="#ffffff" toneMapped={false} />
        </mesh>
        <pointLight intensity={1.1} distance={7} color="#ffffff" />
      </group>

      {/* ── Polished Luxury Mirror Floor with MeshReflectorMaterial ── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.002, 0]}>
        <planeGeometry args={[32, 32]} />
        <MeshReflectorMaterial
          blur={[300, 100]}
          resolution={1024}
          mirror={0.72}
          mixBlur={0.65}
          mixStrength={2.4}
          roughness={0.14}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#07080c"
          metalness={0.75}
        />
      </mesh>

      {/* ── Engineering Studio Floor Markings & Technical Datum Lines ── */}
      <group position={[0, 0.001, 0]}>
        {/* Subtle Longitudinal Centerline (x = 0) */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <planeGeometry args={[0.015, 6.2]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.18} />
        </mesh>

        {/* Front Axle Datum Line (z = -1.82) */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -1.82]}>
          <planeGeometry args={[2.4, 0.012]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.25} />
        </mesh>

        {/* Rear Axle Datum Line (z = 1.78) */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 1.78]}>
          <planeGeometry args={[2.4, 0.012]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.25} />
        </mesh>

        {/* Wheelbase Measurement Circles (FIA 3.6m wheelbase accent) */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <ringGeometry args={[3.2, 3.22, 64]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.12} />
        </mesh>

        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <ringGeometry args={[4.4, 4.43, 64]} />
          <meshBasicMaterial color={team.primaryColor} transparent opacity={0.25} />
        </mesh>
      </group>
    </group>
  );
};
