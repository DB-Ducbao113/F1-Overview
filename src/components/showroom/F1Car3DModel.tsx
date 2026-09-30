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

// Model scale factor: converts 46.3 unit raw model into ~4.86m real F1 dimensions
const MODEL_SCALE = 0.105;

// ── Realistic C42 Formula 1 GLB Model with Dynamic Team Livery ──
const RealF1CarMesh: React.FC<{
  teamId: TeamId;
}> = ({ teamId }) => {
  const { scene } = useGLTF('/models/c42.glb');
  const team = TEAMS_DATA[teamId] || TEAMS_DATA.ferrari;
  const primaryColor = team.primaryColor;
  const accentColor = team.accentColor || '#ffffff';

  // Clone scene to avoid mutating shared cache
  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  useEffect(() => {
    if (!clonedScene) return;

    const primaryThreeColor = new THREE.Color(primaryColor);
    const accentThreeColor = new THREE.Color(accentColor);
    const tireBlackColor = new THREE.Color('#161616');
    const carbonColor = new THREE.Color('#121212');

    clonedScene.traverse((child: any) => {
      if (child.isMesh && child.material) {
        child.castShadow = true;
        child.receiveShadow = true;

        const originalMat = child.material;
        const mat = originalMat.clone();
        const matName = (mat.name || '').toLowerCase();

        // 1. Tires & Wheels
        if (matName.includes('005') || matName.includes('006') || matName.includes('tire')) {
          mat.color = tireBlackColor;
          mat.roughness = 0.82;
          mat.metalness = 0.08;
        }
        // 2. Main Livery Bodywork & Chassis Paint
        else if (
          matName.includes('001') ||
          matName.includes('003') ||
          matName.includes('004') ||
          matName.includes('008') ||
          matName.includes('paint') ||
          matName.includes('body')
        ) {
          mat.color = primaryThreeColor;
          mat.roughness = 0.22;
          mat.metalness = 0.65;
          if ('clearcoat' in mat) {
            mat.clearcoat = 0.9;
            mat.clearcoatRoughness = 0.15;
          }
        }
        // 3. Aero Accents & Wings Detailing
        else if (
          matName.includes('002') ||
          matName.includes('009') ||
          matName.includes('011') ||
          matName.includes('accent')
        ) {
          mat.color = accentThreeColor;
          mat.roughness = 0.35;
          mat.metalness = 0.45;
        }
        // 4. Floor, Diffuser & Carbon Structural Elements
        else {
          mat.color = carbonColor;
          mat.roughness = 0.6;
          mat.metalness = 0.25;
        }

        child.material = mat;
      }
    });
  }, [clonedScene, primaryColor, accentColor]);

  return (
    <primitive
      object={clonedScene}
      scale={[MODEL_SCALE, MODEL_SCALE, MODEL_SCALE]}
      position={[0, 0, 0]}
    />
  );
};

// ── Aerodynamic Wind Tunnel Streamlines Visualization ──
const STREAMLINES = Array.from({ length: 24 }, (_, i) => {
  const rnd1 = ((i * 9301 + 49297) % 233280) / 233280;
  const rnd2 = ((i * 12345 + 6789) % 233280) / 233280;
  const rnd3 = ((i * 54321 + 9876) % 233280) / 233280;
  return {
    offsetX: (rnd1 - 0.5) * 2.2,
    offsetY: 0.12 + rnd2 * 1.1,
    speed: 4.0 + rnd3 * 3.0,
    length: 1.4 + rnd1 * 1.6,
    zOffset: (rnd2 - 0.5) * 6,
  };
});

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
          <cylinderGeometry args={[0.007, 0.003, s.length, 6]} />
          <meshBasicMaterial
            color={i % 2 === 0 ? '#00e5ff' : '#00ff88'}
            transparent
            opacity={0.7}
          />
        </mesh>
      ))}
    </group>
  );
};

// ── Master F1Car3DModel Component with Hotspots & Wind Tunnel ──
export const F1Car3DModel: React.FC<F1Car3DModelProps> = ({
  teamId,
  activeHotspot,
  onSelectHotspot,
  showWindTunnel,
  lang,
}) => {
  return (
    <group position={[0, 0, 0]}>
      {/* Real 18MB Alfa Romeo / Sauber C42 High-Polygon F1 Car Model */}
      <RealF1CarMesh teamId={teamId} />

      {/* Aerodynamic Wind Tunnel Particle Streamlines */}
      {showWindTunnel && <WindTunnelEffect />}

      {/* ── 3D Interactive Hotspot Markers ── */}
      {F1_HOTSPOTS.map((hotspot, idx) => {
        const isSelected = activeHotspot?.id === hotspot.id;

        return (
          <group key={hotspot.id} position={hotspot.position}>
            <Html center distanceFactor={7.5} zIndexRange={[100, 0]}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectHotspot(hotspot);
                }}
                className={`group relative flex items-center justify-center transition-all duration-300 focus:outline-none cursor-pointer ${
                  isSelected ? 'scale-125 z-50' : 'hover:scale-115'
                }`}
                aria-label={lang === 'vi' ? hotspot.nameVi : hotspot.nameEn}
              >
                {/* Outer animated radar pulse ring */}
                <span
                  className={`absolute -inset-3 rounded-full border border-dashed transition-all duration-300 animate-spin-slow ${
                    isSelected
                      ? 'border-f1red bg-f1red/25 scale-110'
                      : 'border-white/50 bg-black/40 group-hover:border-f1red group-hover:bg-f1red/20'
                  }`}
                />

                {/* Inner button badge */}
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center font-display text-[11px] font-black shadow-2xl transition-all border ${
                    isSelected
                      ? 'bg-f1red text-white border-white ring-4 ring-f1red/40'
                      : 'bg-studio-950/90 text-white border-studio-400 group-hover:bg-f1red group-hover:border-white shadow-black/80'
                  }`}
                >
                  {idx + 1}
                </span>

                {/* Tooltip on hover / active */}
                <div
                  className={`absolute left-9 px-3 py-1.5 rounded-xl backdrop-blur-xl border shadow-2xl whitespace-nowrap pointer-events-none transition-all duration-200 ${
                    isSelected
                      ? 'bg-studio-950/95 border-f1red text-white opacity-100 scale-100'
                      : 'bg-studio-900/90 border-studio-700 text-studio-200 opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100'
                  }`}
                >
                  <p className="text-[10px] font-bold uppercase tracking-wider text-f1red">
                    {lang === 'vi' ? hotspot.categoryVi : hotspot.categoryEn}
                  </p>
                  <p className="text-xs font-black leading-tight">
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

// Preload the model asset to ensure instant caching
useGLTF.preload('/models/c42.glb');
