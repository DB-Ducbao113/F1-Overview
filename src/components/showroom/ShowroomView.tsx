import React, { useState, useEffect, Suspense } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { F1Car3DModel } from './F1Car3DModel';
import { CameraController, CameraPreset } from './CameraController';
import { Showroom3DLoader } from './Showroom3DLoader';
import { HotspotDetailsModal } from './HotspotDetailsModal';
import { LiverySelector } from './LiverySelector';
import { F1_HOTSPOTS, HotspotItem } from '../../data/showroom/hotspotsData';
import { TeamId } from '../../types';
import { TEAMS_DATA } from '../../data/teams';
import { useNavigationStore } from '../../store/useNavigationStore';
import { CollectionView } from '../collection/CollectionView';

// ── Photorealistic Studio Environment (100% Offline, Zero Network Delay) ──
const StudioEnvironment: React.FC = () => {
  const { gl, scene } = useThree();
  useEffect(() => {
    const pmremGenerator = new THREE.PMREMGenerator(gl);
    pmremGenerator.compileEquirectangularShader();
    const envScene = new RoomEnvironment();
    const envMap = pmremGenerator.fromScene(envScene, 0.04).texture;
    scene.environment = envMap;
    return () => {
      pmremGenerator.dispose();
      envMap.dispose();
      scene.environment = null;
    };
  }, [gl, scene]);
  return null;
};

import {
  RotateCcw,
  Wind,
  Play,
  Pause,
  Box,
  Image as ImageIcon,
  Sparkles,
  Eye,
  Crosshair,
  Shield,
  Zap,
} from 'lucide-react';

export const ShowroomView: React.FC = () => {
  const { lang } = useNavigationStore();

  // Active top tab: 'showroom' (3D) or 'gallery' (Community Photo Collection)
  const [activeTab, setActiveTab] = useState<'showroom' | 'gallery'>('showroom');

  // Selected Team for 3D Livery
  const [selectedTeamId, setSelectedTeamId] = useState<TeamId>('ferrari');

  // Active Hotspot item
  const [activeHotspot, setActiveHotspot] = useState<HotspotItem | null>(null);

  // Active Camera Preset
  const [cameraPreset, setCameraPreset] = useState<CameraPreset | null>('overview');

  // 3D Visualizer settings
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [showWindTunnel, setShowWindTunnel] = useState<boolean>(false);

  const team = TEAMS_DATA[selectedTeamId] || TEAMS_DATA.ferrari;

  const CAMERA_PRESETS: { id: CameraPreset; labelVi: string; labelEn: string; icon: React.ReactNode }[] = [
    { id: 'overview', labelVi: 'Toàn Cảnh', labelEn: '360° View', icon: <Eye className="w-3.5 h-3.5" /> },
    { id: 'front', labelVi: 'Cánh Trước', labelEn: 'Front Aero', icon: <Crosshair className="w-3.5 h-3.5" /> },
    { id: 'cockpit', labelVi: 'Buồng Lái', labelEn: 'Cockpit', icon: <Shield className="w-3.5 h-3.5" /> },
    { id: 'rear', labelVi: 'Cánh Đuôi', labelEn: 'Rear & DRS', icon: <Zap className="w-3.5 h-3.5" /> },
    { id: 'top', labelVi: 'Từ Trên', labelEn: 'Top Down', icon: <Box className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="min-h-screen bg-studio-950 text-white flex flex-col font-sans">
      {/* ── Sub-Navigation Bar: Toggle between 3D Showroom & Image Gallery ── */}
      <div className="bg-studio-900/95 backdrop-blur-md border-b border-studio-800 sticky top-16 z-40">
        <div className="page-container flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-3">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-f1red flex items-center justify-center font-display text-xs font-black text-white shadow-md shadow-f1red/30">
              3D
            </span>
            <div>
              <h1 className="font-display text-lg sm:text-xl font-black uppercase tracking-wider text-white flex items-center gap-2">
                {lang === 'vi' ? 'Showroom Kỹ Thuật 3D Xe F1' : 'F1 3D Technical Showroom'}
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-950/70 border border-emerald-700/80 px-2 py-0.5 rounded-full">
                  C42 Specification
                </span>
              </h1>
              <p className="text-xs text-studio-400">
                {lang === 'vi'
                  ? 'Mô hình khí động học C42 nguyên bản · Điểm tương tác linh kiện · Đổi màu tem 11 đội đua'
                  : 'Official C42 ground-effect aerodynamics · 6 Interactive hotspots · 11 Team liveries'}
              </p>
            </div>
          </div>

          {/* Mode Switcher Pills: Showroom 3D vs Community Gallery */}
          <div className="flex items-center p-1 rounded-xl bg-studio-950 border border-studio-800 self-stretch sm:self-auto shadow-inner">
            <button
              type="button"
              onClick={() => setActiveTab('showroom')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'showroom'
                  ? 'bg-f1red text-white shadow-md shadow-f1red/30'
                  : 'text-studio-400 hover:text-white'
              }`}
            >
              <Box className="w-3.5 h-3.5" />
              <span>{lang === 'vi' ? 'Mô Hình 3D & Kỹ Thuật' : '3D Car & Tech'}</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('gallery')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'gallery'
                  ? 'bg-studio-800 text-white shadow-md'
                  : 'text-studio-400 hover:text-white'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>{lang === 'vi' ? 'Bộ Sưu Tập Ảnh' : 'Photo Gallery'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Content View ── */}
      {activeTab === 'gallery' ? (
        // Preserve Existing Community Gallery Intact
        <div className="bg-studio-100 text-studio-900 flex-1">
          <CollectionView />
        </div>
      ) : (
        // ── 3D Interactive Showroom & Visualizer ──
        <div className="relative flex-1 h-[calc(100vh-130px)] min-h-[640px] w-full overflow-hidden bg-radial from-[#12121a] via-[#09090e] to-[#040407] select-none">
          {/* Top Left Floating Team & Engine Info Badge */}
          <div className="absolute top-4 left-4 z-20 pointer-events-none">
            <div className="p-3.5 sm:p-4 rounded-2xl bg-studio-950/85 backdrop-blur-xl border border-studio-800/80 shadow-2xl space-y-1.5 max-w-xs">
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full shrink-0 shadow-md ring-2 ring-white/20"
                  style={{ backgroundColor: team.primaryColor }}
                />
                <span className="text-[10px] font-black uppercase tracking-widest text-studio-400">
                  {team.name} · 2026 Livery
                </span>
              </div>
              <h2 className="font-display text-base sm:text-lg font-black uppercase text-white leading-tight">
                {team.fullName}
              </h2>
              <div className="text-[11px] text-studio-300 space-y-0.5 pt-1 border-t border-studio-800/60 font-medium">
                <p className="truncate">⚡ {team.powerUnit}</p>
                <p className="text-studio-400">Trụ sở: {team.base}</p>
              </div>
            </div>
          </div>

          {/* Top Center Camera Preset Quick Switcher */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 hidden md:flex items-center gap-1.5 p-1 rounded-xl bg-studio-950/85 backdrop-blur-xl border border-studio-800/80 shadow-2xl">
            {CAMERA_PRESETS.map((p) => {
              const isActive = cameraPreset === p.id && !activeHotspot;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    setCameraPreset(p.id);
                    setActiveHotspot(null);
                    setAutoRotate(false);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-f1red text-white shadow-md shadow-f1red/30'
                      : 'text-studio-400 hover:text-white hover:bg-studio-800/50'
                  }`}
                >
                  {p.icon}
                  <span>{lang === 'vi' ? p.labelVi : p.labelEn}</span>
                </button>
              );
            })}
          </div>

          {/* Top Right Quick Canvas Controls */}
          <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
            {/* Wind Tunnel FX Toggle */}
            <button
              type="button"
              onClick={() => setShowWindTunnel(!showWindTunnel)}
              className={`p-2.5 rounded-xl border backdrop-blur-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-lg cursor-pointer ${
                showWindTunnel
                  ? 'bg-emerald-500 text-black border-emerald-400 shadow-emerald-500/30'
                  : 'bg-studio-950/85 text-studio-300 border-studio-800 hover:text-white hover:bg-studio-900'
              }`}
              title={
                lang === 'vi'
                  ? 'Bật/Tắt dòng khí động học đường hầm gió'
                  : 'Toggle Wind Tunnel Aerodynamic Streamlines'
              }
            >
              <Wind className="w-4 h-4" />
              <span className="hidden sm:inline">
                {lang === 'vi' ? 'Khí Động Học' : 'Wind Tunnel'}
              </span>
            </button>

            {/* Auto-rotate Toggle */}
            <button
              type="button"
              onClick={() => {
                setAutoRotate(!autoRotate);
                setCameraPreset(null);
              }}
              className={`p-2.5 rounded-xl border backdrop-blur-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-lg cursor-pointer ${
                autoRotate
                  ? 'bg-studio-800 text-white border-studio-700'
                  : 'bg-studio-950/85 text-studio-400 border-studio-800 hover:text-white'
              }`}
              title={lang === 'vi' ? 'Bật/Tắt xoay tự động' : 'Toggle Auto-Rotation'}
            >
              {autoRotate ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span className="hidden sm:inline">{lang === 'vi' ? 'Tự Xoay' : 'Auto Rotate'}</span>
            </button>

            {/* Reset Camera Button */}
            <button
              type="button"
              onClick={() => {
                setActiveHotspot(null);
                setCameraPreset('overview');
                setAutoRotate(true);
              }}
              className="p-2.5 rounded-xl bg-studio-950/85 hover:bg-studio-900 border border-studio-800 hover:border-studio-700 backdrop-blur-xl text-xs font-bold text-studio-300 hover:text-white transition-all flex items-center gap-1.5 shadow-lg cursor-pointer"
              title={lang === 'vi' ? 'Góc nhìn toàn cảnh' : 'Reset Full View'}
            >
              <RotateCcw className="w-4 h-4 text-f1red" />
              <span className="hidden sm:inline">{lang === 'vi' ? 'Toàn Cảnh' : 'Reset'}</span>
            </button>
          </div>

          {/* ── Three.js WebGL 3D Canvas ── */}
          <Canvas
            shadows
            camera={{ position: [3.2, 1.6, 3.6], fov: 42 }}
            gl={{ antialias: true, alpha: true, toneMappingExposure: 1.25 }}
            className="w-full h-full cursor-grab active:cursor-grabbing"
          >
            {/* Photorealistic Studio Reflections for Metallic & Carbon Surfaces */}
            <StudioEnvironment />

            {/* Cinematic Studio Lighting */}
            <ambientLight intensity={1.5} />
            <directionalLight
              position={[6, 9, 5]}
              intensity={2.4}
              castShadow
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
              shadow-bias={-0.0001}
            />
            {/* Rim backlights */}
            <directionalLight position={[-6, 4, -5]} intensity={1.2} color="#60a5fa" />
            <directionalLight position={[0, -2, 0]} intensity={0.4} color="#ffffff" />
            <pointLight position={[0, 4.5, 0]} intensity={1.5} color="#ffffff" />
            <spotLight
              position={[0, 7, 2]}
              angle={0.65}
              penumbra={0.8}
              intensity={2.2}
              color={team.primaryColor}
            />

            {/* High-Tech Showroom Floor Grid & Telemetry Rings */}
            <group position={[0, -0.01, 0]}>
              <gridHelper args={[16, 32, team.primaryColor, '#1e293b']} position={[0, 0, 0]} />
              <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[3.0, 3.05, 64]} />
                <meshBasicMaterial color={team.primaryColor} transparent opacity={0.4} />
              </mesh>
              <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[4.5, 4.53, 64]} />
                <meshBasicMaterial color="#38bdf8" transparent opacity={0.25} />
              </mesh>
            </group>

            {/* F1 3D Car Model with Suspense Loading HUD */}
            <Suspense fallback={<Showroom3DLoader />}>
              <F1Car3DModel
                teamId={selectedTeamId}
                activeHotspot={activeHotspot}
                onSelectHotspot={(hotspot) => {
                  setActiveHotspot(hotspot);
                  setCameraPreset(null);
                  setAutoRotate(false);
                }}
                showWindTunnel={showWindTunnel}
                lang={lang}
              />
            </Suspense>

            {/* Dynamic Ground Contact Shadows */}
            <ContactShadows
              position={[0, 0, 0]}
              opacity={0.9}
              scale={10}
              blur={2.0}
              far={4.5}
              color="#000000"
            />

            {/* Smooth Camera Controller & OrbitControls */}
            <CameraController
              activeHotspot={activeHotspot}
              cameraPreset={cameraPreset}
              autoRotate={autoRotate}
            />
          </Canvas>

          {/* ── Bottom Overlay Panel (Hotspot Quick Jump + Livery Selector) ── */}
          <div className="absolute bottom-4 left-4 right-4 z-20 space-y-3 pointer-events-auto">
            {/* Hotspots Quick Pills Selector */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-1 px-1 custom-scrollbar">
              <span className="text-[10px] font-black uppercase tracking-wider text-studio-400 bg-studio-950/90 border border-studio-800 px-2.5 py-1.5 rounded-lg shrink-0 flex items-center gap-1 shadow-md">
                <Sparkles className="w-3 h-3 text-f1red" />
                Hotspots:
              </span>
              {F1_HOTSPOTS.map((h, i) => {
                const isSelected = activeHotspot?.id === h.id;
                return (
                  <button
                    key={h.id}
                    type="button"
                    onClick={() => {
                      setActiveHotspot(h);
                      setCameraPreset(null);
                      setAutoRotate(false);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 shrink-0 border flex items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-f1red text-white border-white/80 shadow-md shadow-f1red/40 scale-105'
                        : 'bg-studio-950/85 text-studio-300 border-studio-800 hover:bg-studio-900 hover:text-white'
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full bg-white/20 text-[10px] flex items-center justify-center font-black">
                      {i + 1}
                    </span>
                    <span>
                      {lang === 'vi'
                        ? h.nameVi.split(' ')[0] + ' ' + (h.nameVi.split(' ')[1] || '')
                        : h.nameEn.split('&')[0].trim()}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* 11 Team Livery Selector */}
            <div className="p-3 rounded-2xl bg-studio-950/85 backdrop-blur-xl border border-studio-800/80 shadow-2xl">
              <LiverySelector
                selectedTeamId={selectedTeamId}
                onSelectTeam={(newTeamId) => setSelectedTeamId(newTeamId)}
                lang={lang}
              />
            </div>
          </div>

          {/* ── Slide-Over Technical Details Modal Drawer ── */}
          <HotspotDetailsModal
            hotspot={activeHotspot}
            onClose={() => {
              setActiveHotspot(null);
              setCameraPreset('overview');
            }}
            onSelectHotspot={(hotspot) => {
              setActiveHotspot(hotspot);
              setCameraPreset(null);
              setAutoRotate(false);
            }}
            lang={lang}
          />
        </div>
      )}
    </div>
  );
};
