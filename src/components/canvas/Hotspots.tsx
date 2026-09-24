import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useCarStore } from '../../store/useCarStore';

interface HotspotConfig {
  id: string;
  nameKey: string;
  position: [number, number, number];
  cameraPreset: 'front' | 'floor' | 'top' | 'rear' | 'isometric';
}

const HOTSPOTS: HotspotConfig[] = [
  { id: 'front-wing',    nameKey: 'Cánh gió trước', position: [0, 0.36, 2.15],   cameraPreset: 'front' },
  { id: 'venturi-floor', nameKey: 'Sàn Venturi',    position: [0.82, 0.22, 0.1], cameraPreset: 'floor' },
  { id: 'halo',          nameKey: 'Vòng Halo',      position: [0, 0.92, -0.25],  cameraPreset: 'top'   },
  { id: 'power-unit',    nameKey: 'Động cơ Hybrid', position: [0, 0.68, -0.95],  cameraPreset: 'isometric' },
  { id: 'rear-wing',     nameKey: 'Cánh sau DRS',   position: [0, 1.12, -2.15],  cameraPreset: 'rear'  },
];

export const Hotspots: React.FC = () => {
  const { selectPart, selectedPartId, setCameraPreset, isExploded, showHotspots, lang } = useCarStore();

  // Hide hotspots if turned off or during exploded view
  if (!showHotspots || isExploded) return null;

  return (
    <group>
      {HOTSPOTS.map((spot) => (
        <HotspotBeacon
          key={spot.id}
          config={spot}
          isActive={selectedPartId === spot.id}
          onSelect={() => {
            selectPart(spot.id);
            setCameraPreset(spot.cameraPreset);
          }}
          lang={lang}
        />
      ))}
    </group>
  );
};

const HotspotBeacon: React.FC<{
  config: HotspotConfig;
  isActive: boolean;
  onSelect: () => void;
  lang: 'vi' | 'en';
}> = ({ config, isActive, onSelect, lang }) => {
  const ringRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((_, delta) => {
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 1.2;
      const s = 1 + Math.sin(Date.now() * 0.006) * 0.18;
      ringRef.current.scale.set(s, s, s);
    }
  });

  const label = lang === 'vi' ? config.nameKey : (
    config.id === 'front-wing' ? 'Front Wing' :
    config.id === 'venturi-floor' ? 'Venturi Floor' :
    config.id === 'halo' ? 'Halo Safety' :
    config.id === 'power-unit' ? 'Power Unit' : 'DRS Wing'
  );

  return (
    <group position={config.position}>
      {/* 3D Animated Core Dot — Subtle and non-intrusive */}
      <mesh
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.035, 16, 16]} />
        <meshBasicMaterial color={isActive ? '#e10600' : hovered ? '#ff3b30' : '#ffffff'} />
      </mesh>

      {/* Pulsing Outer Ring */}
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.05, 0.065, 20]} />
        <meshBasicMaterial
          color={isActive ? '#e10600' : '#ffffff'}
          side={THREE.DoubleSide}
          transparent
          opacity={isActive ? 0.9 : hovered ? 0.8 : 0.35}
        />
      </mesh>

      {/* HTML Tag Tooltip — ONLY shown when hovered or active, NEVER auto-blocking the car! */}
      {(hovered || isActive) && (
        <Html
          position={[0, 0.08, 0]}
          center
          distanceFactor={5.5}
          style={{
            pointerEvents: 'auto',
            animation: 'fadeInUp 0.15s ease-out',
          }}
        >
          <div
            onClick={onSelect}
            className={`cursor-pointer whitespace-nowrap px-2.5 py-1 rounded-sm text-[10px] font-sans font-bold uppercase tracking-wider transition-all shadow-md select-none border ${
              isActive
                ? 'bg-f1red text-white border-f1red shadow-f1red/30'
                : 'bg-white/95 text-studio-950 border-studio-300 hover:bg-studio-50 shadow-subtle'
            }`}
          >
            {label}
          </div>
        </Html>
      )}
    </group>
  );
};
