import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Html } from '@react-three/drei';
import * as THREE from 'three';
import { F1_HOTSPOTS, HotspotItem } from '../../data/showroom/hotspotsData';
import { TeamId } from '../../types';
import { TEAMS_DATA } from '../../data/teams';

interface F1Car3DModelProps {
  teamId: TeamId;
  activeHotspot: HotspotItem | null;
  onSelectHotspot: (hotspot: HotspotItem) => void;
  showWindTunnel: boolean;
  lang: 'vi' | 'en';
}

// ── Fallback High-Fidelity Procedural F1 Car Mesh ──
const ProceduralF1Car: React.FC<{
  primaryColor: string;
  accentColor: string;
}> = ({ primaryColor, accentColor }) => {
  const primaryMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: primaryColor,
        roughness: 0.25,
        metalness: 0.7,
      }),
    [primaryColor],
  );

  const accentMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: accentColor,
        roughness: 0.3,
        metalness: 0.5,
      }),
    [accentColor],
  );

  const carbonMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#151515',
        roughness: 0.55,
        metalness: 0.2,
      }),
    [],
  );

  const rubberMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#1a1a1a',
        roughness: 0.85,
        metalness: 0.1,
      }),
    [],
  );

  const rimMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#333333',
        roughness: 0.3,
        metalness: 0.85,
      }),
    [],
  );

  const brakeGlowMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#ff3300',
        emissive: '#ff2200',
        emissiveIntensity: 0.8,
        roughness: 0.4,
      }),
    [],
  );

  const haloMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#2a2a2a',
        roughness: 0.35,
        metalness: 0.9,
      }),
    [],
  );

  return (
    <group position={[0, 0, 0]}>
      {/* ── Main Nosecone & Chassis ── */}
      <mesh position={[0, 0.32, 1.0]} material={primaryMat} castShadow receiveShadow>
        <boxGeometry args={[0.55, 0.25, 2.4]} />
      </mesh>
      {/* Nose taper tip */}
      <mesh position={[0, 0.24, 2.3]} rotation={[-0.15, 0, 0]} material={primaryMat} castShadow>
        <boxGeometry args={[0.35, 0.14, 0.6]} />
      </mesh>

      {/* ── Cockpit & Monocoque ── */}
      <mesh position={[0, 0.42, 0.1]} material={carbonMat} castShadow>
        <boxGeometry args={[0.58, 0.3, 0.9]} />
      </mesh>
      {/* Cockpit opening recess */}
      <mesh position={[0, 0.5, 0.15]}>
        <boxGeometry args={[0.36, 0.12, 0.55]} />
        <meshStandardMaterial color="#050505" roughness={0.9} />
      </mesh>
      {/* Driver Helmet */}
      <mesh position={[0, 0.54, 0.05]} material={accentMat}>
        <sphereGeometry args={[0.12, 16, 16]} />
      </mesh>

      {/* ── Titanium Halo Safety Structure ── */}
      <group position={[0, 0.68, 0.3]}>
        {/* Center forward pillar */}
        <mesh position={[0, -0.08, 0.22]} rotation={[0.4, 0, 0]} material={haloMat}>
          <cylinderGeometry args={[0.025, 0.025, 0.35, 12]} />
        </mesh>
        {/* Curved upper halo loop */}
        <mesh rotation={[Math.PI / 2, 0, 0]} material={haloMat}>
          <torusGeometry args={[0.26, 0.028, 12, 24, Math.PI]} />
        </mesh>
      </group>

      {/* ── Engine Airbox / Roll Hoop ── */}
      <mesh position={[0, 0.72, -0.3]} material={primaryMat} castShadow>
        <boxGeometry args={[0.22, 0.28, 0.45]} />
      </mesh>
      <mesh position={[0, 0.72, -0.1]}>
        <boxGeometry args={[0.14, 0.14, 0.06]} />
        <meshStandardMaterial color="#000000" roughness={0.95} />
      </mesh>
      {/* Shark Fin */}
      <mesh position={[0, 0.76, -1.0]} material={carbonMat}>
        <boxGeometry args={[0.02, 0.25, 1.0]} />
      </mesh>

      {/* ── Sidepods (Left & Right) with Aerodynamic Undercut ── */}
      {[-1, 1].map((side) => (
        <group key={`sidepod-${side}`} position={[side * 0.58, 0.3, -0.3]}>
          <mesh material={primaryMat} castShadow receiveShadow>
            <boxGeometry args={[0.46, 0.26, 1.4]} />
          </mesh>
          {/* Air intake opening */}
          <mesh position={[0, 0.04, 0.71]}>
            <boxGeometry args={[0.34, 0.16, 0.05]} />
            <meshStandardMaterial color="#080808" roughness={0.95} />
          </mesh>
          {/* Sidepod livery accent stripe */}
          <mesh position={[0, 0.14, 0]} material={accentMat}>
            <boxGeometry args={[0.47, 0.03, 1.3]} />
          </mesh>
          {/* Bargeboard / Floor Edge Winglet */}
          <mesh position={[side * 0.12, -0.12, 0]} material={carbonMat}>
            <boxGeometry args={[0.28, 0.03, 1.7]} />
          </mesh>
        </group>
      ))}

      {/* ── Front Wing (Multi-element & Endplates) ── */}
      <group position={[0, 0.14, 2.3]}>
        {/* Main horizontal cascade */}
        <mesh material={carbonMat} castShadow>
          <boxGeometry args={[1.85, 0.03, 0.38]} />
        </mesh>
        <mesh position={[0, 0.06, -0.06]} material={primaryMat}>
          <boxGeometry args={[1.75, 0.025, 0.24]} />
        </mesh>
        <mesh position={[0, 0.1, -0.12]} material={accentMat}>
          <boxGeometry args={[1.65, 0.02, 0.16]} />
        </mesh>
        {/* Endplates */}
        {[-1, 1].map((side) => (
          <mesh key={`f-endplate-${side}`} position={[side * 0.94, 0.08, 0]} material={carbonMat}>
            <boxGeometry args={[0.02, 0.18, 0.44]} />
          </mesh>
        ))}
      </group>

      {/* ── Rear Wing & DRS Actuator Flap ── */}
      <group position={[0, 0.88, -2.15]}>
        {/* Rear Endplates */}
        {[-1, 1].map((side) => (
          <mesh key={`r-endplate-${side}`} position={[side * 0.62, 0, 0]} material={carbonMat}>
            <boxGeometry args={[0.02, 0.44, 0.42]} />
          </mesh>
        ))}
        {/* Main Plane Wing */}
        <mesh position={[0, -0.05, 0]} material={carbonMat} castShadow>
          <boxGeometry args={[1.22, 0.03, 0.28]} />
        </mesh>
        {/* Upper DRS Flap */}
        <mesh position={[0, 0.12, -0.04]} rotation={[-0.15, 0, 0]} material={primaryMat} castShadow>
          <boxGeometry args={[1.2, 0.03, 0.22]} />
        </mesh>
        {/* Central DRS Hydraulic Actuator Pod */}
        <mesh position={[0, 0.14, 0]} material={accentMat}>
          <cylinderGeometry args={[0.025, 0.025, 0.12, 12]} />
        </mesh>
        {/* Twin Center Pylon Mounts */}
        {[-0.08, 0.08].map((x, i) => (
          <mesh key={`pylon-${i}`} position={[x, -0.3, 0]} material={carbonMat}>
            <boxGeometry args={[0.025, 0.55, 0.06]} />
          </mesh>
        ))}
        {/* Lower Beam Wing */}
        <mesh position={[0, -0.38, 0]} material={carbonMat}>
          <boxGeometry args={[0.95, 0.025, 0.2]} />
        </mesh>
        {/* FIA Rain Light LED */}
        <mesh position={[0, -0.48, 0.08]}>
          <boxGeometry args={[0.08, 0.04, 0.02]} />
          <meshStandardMaterial
            color="#ff0000"
            emissive="#ff0000"
            emissiveIntensity={2.0}
            roughness={0.2}
          />
        </mesh>
      </group>

      {/* ── 4 Wheels (18-inch Pirelli Tires & Glowing Brakes) ── */}
      {[
        { x: -0.86, y: 0.34, z: 1.45, radius: 0.34, width: 0.3 }, // Front Left
        { x: 0.86, y: 0.34, z: 1.45, radius: 0.34, width: 0.3 }, // Front Right
        { x: -0.92, y: 0.36, z: -1.45, radius: 0.36, width: 0.38 }, // Rear Left
        { x: 0.92, y: 0.36, z: -1.45, radius: 0.36, width: 0.38 }, // Rear Right
      ].map((wheel, index) => (
        <group key={`wheel-${index}`} position={[wheel.x, wheel.y, wheel.z]}>
          {/* Rubber Tire */}
          <mesh rotation={[0, 0, Math.PI / 2]} material={rubberMat} castShadow>
            <cylinderGeometry args={[wheel.radius, wheel.radius, wheel.width, 24]} />
          </mesh>
          {/* Wheel Rim */}
          <mesh rotation={[0, 0, Math.PI / 2]} material={rimMat}>
            <cylinderGeometry
              args={[wheel.radius * 0.65, wheel.radius * 0.65, wheel.width + 0.01, 16]}
            />
          </mesh>
          {/* Pirelli Red Soft Stripe Ring */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <torusGeometry args={[wheel.radius * 0.82, 0.01, 8, 24]} />
            <meshBasicMaterial color="#e80020" />
          </mesh>
          {/* Glowing Carbon Brake Disc Inside */}
          <mesh rotation={[0, 0, Math.PI / 2]} material={brakeGlowMat}>
            <cylinderGeometry
              args={[wheel.radius * 0.48, wheel.radius * 0.48, wheel.width * 0.5, 16]}
            />
          </mesh>
          {/* Suspension Wishbone Arms to Chassis */}
          <mesh
            position={[wheel.x > 0 ? -0.25 : 0.25, 0.02, 0]}
            rotation={[0, 0, wheel.x > 0 ? 0.2 : -0.2]}
            material={carbonMat}
          >
            <boxGeometry args={[0.42, 0.02, 0.04]} />
          </mesh>
        </group>
      ))}

      {/* ── Underfloor & Rear Diffuser ── */}
      <mesh position={[0, 0.1, -0.1]} material={carbonMat} receiveShadow>
        <boxGeometry args={[1.5, 0.04, 3.4]} />
      </mesh>
      {/* Diffuser kick-up ramps */}
      <mesh position={[0, 0.18, -1.75]} rotation={[0.3, 0, 0]} material={carbonMat}>
        <boxGeometry args={[0.95, 0.03, 0.5]} />
      </mesh>
    </group>
  );
};

// ── Loaded GLB Model Component with Fallback ──
const LoadedGLBCar: React.FC<{
  primaryColor: string;
  accentColor: string;
}> = ({ primaryColor, accentColor }) => {
  const { scene } = useGLTF('/models/c42.glb');
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  useEffect(() => {
    if (!clonedScene) return;
    clonedScene.traverse((child: any) => {
      if (child.isMesh && child.material) {
        child.castShadow = true;
        child.receiveShadow = true;
        // Customize livery paint color if material matches bodywork
        const matName = child.material.name?.toLowerCase() || '';
        if (
          matName.includes('001') ||
          matName.includes('003') ||
          matName.includes('paint') ||
          matName.includes('body')
        ) {
          const mat = child.material.clone();
          mat.color = new THREE.Color(primaryColor);
          mat.roughness = 0.25;
          mat.metalness = 0.65;
          child.material = mat;
        } else if (matName.includes('accent') || matName.includes('004')) {
          const mat = child.material.clone();
          mat.color = new THREE.Color(accentColor);
          child.material = mat;
        }
      }
    });
  }, [clonedScene, primaryColor, accentColor]);

  return <primitive object={clonedScene} scale={[0.9, 0.9, 0.9]} position={[0, 0, 0]} />;
};

// Deterministic streamlines for aerodynamic wind tunnel visualization
const STREAMLINES = Array.from({ length: 18 }, (_, i) => {
  const rnd1 = ((i * 9301 + 49297) % 233280) / 233280;
  const rnd2 = ((i * 12345 + 6789) % 233280) / 233280;
  const rnd3 = ((i * 54321 + 9876) % 233280) / 233280;
  return {
    offsetX: (rnd1 - 0.5) * 1.8,
    offsetY: 0.15 + rnd2 * 0.8,
    speed: 3.5 + rnd3 * 2.5,
    length: 1.2 + rnd1 * 1.5,
    zOffset: (rnd2 - 0.5) * 6,
  };
});

// ── Wind Tunnel Aerodynamic Streamlines ──
const WindTunnelEffect: React.FC = () => {
  const linesRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!linesRef.current) return;
    linesRef.current.children.forEach((child: any, i) => {
      const s = STREAMLINES[i];
      child.position.z -= delta * s.speed;
      if (child.position.z < -4) {
        child.position.z = 4;
      }
    });
  });

  return (
    <group ref={linesRef}>
      {STREAMLINES.map((s, i) => (
        <mesh key={i} position={[s.offsetX, s.offsetY, s.zOffset]}>
          <cylinderGeometry args={[0.006, 0.002, s.length, 6]} />
          <meshBasicMaterial
            color={i % 2 === 0 ? '#00e5ff' : '#00ff88'}
            transparent
            opacity={0.65}
          />
        </mesh>
      ))}
    </group>
  );
};

// ── Master F1Car3DModel Component ──
export const F1Car3DModel: React.FC<F1Car3DModelProps> = ({
  teamId,
  activeHotspot,
  onSelectHotspot,
  showWindTunnel,
  lang,
}) => {
  const team = TEAMS_DATA[teamId] || TEAMS_DATA.ferrari;
  const primaryColor = team.primaryColor;
  const accentColor = team.accentColor || '#ffffff';

  return (
    <group position={[0, 0, 0]}>
      {/* 3D Car Model (GLB or Engineered Procedural Mesh) */}
      <React.Suspense
        fallback={<ProceduralF1Car primaryColor={primaryColor} accentColor={accentColor} />}
      >
        <LoadedGLBCar primaryColor={primaryColor} accentColor={accentColor} />
      </React.Suspense>

      {/* Wind Tunnel Streamlines FX */}
      {showWindTunnel && <WindTunnelEffect />}

      {/* ── 3D Interactive Hotspot Markers ── */}
      {F1_HOTSPOTS.map((hotspot, idx) => {
        const isSelected = activeHotspot?.id === hotspot.id;

        return (
          <group key={hotspot.id} position={hotspot.position}>
            <Html center distanceFactor={7} zIndexRange={[100, 0]}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectHotspot(hotspot);
                }}
                className={`group relative flex items-center justify-center transition-all duration-300 focus:outline-none ${
                  isSelected ? 'scale-125 z-50' : 'hover:scale-115'
                }`}
                aria-label={lang === 'vi' ? hotspot.nameVi : hotspot.nameEn}
              >
                {/* Outer animated pulsing radar ring */}
                <span
                  className={`absolute -inset-2.5 rounded-full border border-dashed transition-colors animate-spin-slow ${
                    isSelected
                      ? 'border-f1red/80 bg-f1red/20'
                      : 'border-white/40 bg-black/20 group-hover:border-f1red group-hover:bg-f1red/20'
                  }`}
                />

                {/* Inner button badge */}
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center font-display text-[11px] font-black shadow-lg transition-all border ${
                    isSelected
                      ? 'bg-f1red text-white border-white ring-4 ring-f1red/30'
                      : 'bg-studio-950/90 text-white border-studio-400 group-hover:bg-f1red group-hover:border-white'
                  }`}
                >
                  {idx + 1}
                </span>

                {/* Tooltip on hover / active */}
                <div
                  className={`absolute left-9 px-3 py-1.5 rounded-lg backdrop-blur-md border shadow-xl whitespace-nowrap pointer-events-none transition-all duration-200 ${
                    isSelected
                      ? 'bg-studio-950/95 border-f1red text-white opacity-100 scale-100'
                      : 'bg-studio-900/90 border-studio-700 text-studio-200 opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100'
                  }`}
                >
                  <p className="text-[10px] font-bold uppercase tracking-wider text-f1red">
                    {lang === 'vi' ? hotspot.categoryVi : hotspot.categoryEn}
                  </p>
                  <p className="text-xs font-bold leading-tight">
                    {lang === 'vi' ? hotspot.nameVi : hotspot.nameEn}
                  </p>
                </div>
              </button>
            </Html>
          </group>
        );
      })}
    </group>
  );
};
