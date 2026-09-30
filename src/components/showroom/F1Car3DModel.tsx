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

  // Clone scene once
  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  useEffect(() => {
    if (!clonedScene) return;

    const primaryThreeColor = new THREE.Color(primaryColor);
    const accentThreeColor = new THREE.Color(accentColor);

    clonedScene.traverse((child: any) => {
      if (child.isMesh && child.material) {
        child.castShadow = true;
        child.receiveShadow = true;

        const originalMat = child.material;
        const mat = originalMat.clone();
        const matName = (mat.name || '').toLowerCase();

        // 1. Tires & Wheel Rims (006 = Front Wheels, 011 = Rear L, 013 = Rear R)
        if (matName.includes('006') || matName.includes('011') || matName.includes('013')) {
          mat.roughness = 0.82;
          mat.metalness = 0.08;
          mat.color = new THREE.Color('#ffffff'); // Keep authentic Pirelli tire markings
        }
        // 2. Main Aerodynamic Bodywork & Chassis Panels
        else if (
          matName.includes('001') || // Nose & Front Wing
          matName.includes('003') || // Engine Cover
          matName.includes('004') || // Front Chassis
          matName.includes('009')    // Sidepods
        ) {
          mat.color = primaryThreeColor;
          mat.roughness = 0.18;
          mat.metalness = 0.22;
          if ('clearcoat' in mat) {
            mat.clearcoat = 0.95;
            mat.clearcoatRoughness = 0.1;
          }
        }
        // 3. Rear Wing, DRS & Wings Detailing
        else if (matName.includes('005')) {
          mat.color = accentThreeColor;
          mat.roughness = 0.28;
          mat.metalness = 0.3;
        }
        // 4. Cockpit Interior, Seat & Floor
        else {
          mat.roughness = 0.55;
          mat.metalness = 0.2;
        }

        mat.envMapIntensity = 1.35;
        mat.needsUpdate = true;
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
const STREAMLINES = Array.from({ length: 28 }, (_, i) => {
  const rnd1 = ((i * 9301 + 49297) % 233280) / 233280;
  const rnd2 = ((i * 12345 + 6789) % 233280) / 233280;
  const rnd3 = ((i * 54321 + 9876) % 233280) / 233280;
  return {
    offsetX: (rnd1 - 0.5) * 2.2,
    offsetY: 0.12 + rnd2 * 1.0,
    speed: 5.0 + rnd3 * 3.5,
    length: 1.5 + rnd1 * 1.8,
    zOffset: (rnd2 - 0.5) * 6,
  };
});

const WindTunnelEffect: React.FC = () => {
  const linesRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!linesRef.current) return;
    linesRef.current.children.forEach((child: any, i) => {
      const s = STREAMLINES[i];
      child.position.z += delta * s.speed;
      if (child.position.z > 4) {
        child.position.z = -4;
      }
    });
  });

  return (
    <group ref={linesRef}>
      {STREAMLINES.map((s, i) => (
        <mesh key={i} position={[s.offsetX, s.offsetY, s.zOffset]}>
          <cylinderGeometry args={[0.006, 0.003, s.length, 6]} />
          <meshBasicMaterial
            color={i % 2 === 0 ? '#38bdf8' : '#34d399'}
            transparent
            opacity={0.75}
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
            {/* Elegant 3D Pinpoint HTML Marker (Fixed screen scale to avoid clustering) */}
            <Html center zIndexRange={[100, 0]}>
              <div className="relative flex items-center justify-center">
                {/* Subtle pulsating beacon radar */}
                <span
                  className={`absolute w-7 h-7 rounded-full animate-ping pointer-events-none ${
                    isSelected ? 'bg-f1red/60' : 'bg-sky-400/40'
                  }`}
                  style={{ animationDuration: '2.5s' }}
                />

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectHotspot(hotspot);
                  }}
                  className={`group relative flex items-center justify-center transition-all duration-200 cursor-pointer focus:outline-none ${
                    isSelected ? 'scale-115 z-30' : 'hover:scale-110'
                  }`}
                  aria-label={lang === 'vi' ? hotspot.nameVi : hotspot.nameEn}
                >
                  {/* Clean circular numbered badge */}
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-display text-[11px] font-black shadow-lg transition-all border ${
                      isSelected
                        ? 'bg-f1red text-white border-white ring-2 ring-f1red/50 shadow-f1red/40'
                        : 'bg-studio-900/90 text-white border-studio-500 hover:border-white hover:bg-f1red shadow-black/80'
                    }`}
                  >
                    {idx + 1}
                  </span>

                  {/* Tooltip on hover / active */}
                  <div
                    className={`absolute left-8 px-2.5 py-1 rounded-lg backdrop-blur-md border shadow-xl whitespace-nowrap pointer-events-none transition-all duration-200 ${
                      isSelected
                        ? 'bg-studio-950/95 border-f1red text-white opacity-100 translate-x-0'
                        : 'bg-studio-900/90 border-studio-700 text-studio-200 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0'
                    }`}
                  >
                    <p className="text-[9px] font-bold uppercase tracking-wider text-f1red leading-tight">
                      {lang === 'vi' ? hotspot.categoryVi : hotspot.categoryEn}
                    </p>
                    <p className="text-[11px] font-black leading-tight text-white">
                      {lang === 'vi' ? hotspot.nameVi : hotspot.nameEn}
                    </p>
                  </div>
                </button>
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
};

// Preload the model asset to ensure instant caching
useGLTF.preload('/models/c42.glb');

