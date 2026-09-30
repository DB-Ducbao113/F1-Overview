import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { ContactShadows, Environment } from '@react-three/drei';
import { F1Car3DModel } from './F1Car3DModel';
import { CameraController, CameraPreset } from './CameraController';
import { Showroom3DLoader } from './Showroom3DLoader';
import { HotspotDetailsModal } from './HotspotDetailsModal';
import { LiverySelector } from './LiverySelector';
import { F1_HOTSPOTS, HotspotItem } from '../../data/showroom/hotspotsData';
import { TeamId } from '../../types';
import { TEAMS_DATA } from '../../data/teams';
import { getTeam3DLivery } from '../../data/showroom/teamLiveries';
import { useNavigationStore } from '../../store/useNavigationStore';

import {
  RotateCcw,
  Wind,
  Play,
  Pause,
  Box,
  Sparkles,
  Eye,
  Crosshair,
  Shield,
  Zap,
  ArrowRight,
  Layers,
  Maximize2,
  ChevronDown,
  ChevronUp,
  ZoomIn,
  ZoomOut,
  Camera,
} from 'lucide-react';
import { getTeamComponentCloseUp } from '../../data/showroom/teamCloseups';

export const ShowroomView: React.FC = () => {
  const { lang } = useNavigationStore();
  const [searchParams, setSearchParams] = useSearchParams();

  // Selected Team for 3D Livery synced with query param ?team=...
  const teamParam = searchParams.get('team') as TeamId | null;
  const initialTeamId = teamParam && TEAMS_DATA[teamParam] ? teamParam : 'ferrari';
  const [selectedTeamId, setSelectedTeamId] = useState<TeamId>(initialTeamId);

  // Sync state if URL query param changes from external navigation
  useEffect(() => {
    if (teamParam && TEAMS_DATA[teamParam] && teamParam !== selectedTeamId) {
      setSelectedTeamId(teamParam);
    }
  }, [teamParam]);

  const handleSelectTeam = (newTeamId: TeamId) => {
    setSelectedTeamId(newTeamId);
    setSearchParams({ team: newTeamId }, { replace: true });
  };

  // Active Hotspot item
  const [activeHotspot, setActiveHotspot] = useState<HotspotItem | null>(null);

  // Active Camera Preset
  const [cameraPreset, setCameraPreset] = useState<CameraPreset | null>('overview');

  // 3D Visualizer settings
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [showWindTunnel, setShowWindTunnel] = useState<boolean>(false);

  // Smooth Scrolling & Zoom controls: wheel zoom is false by default so mouse wheel scrolls webpage
  const [enableWheelZoom, setEnableWheelZoom] = useState<boolean>(false);
  const [zoomTrigger, setZoomTrigger] = useState<number>(0);
  const [zoomDirection, setZoomDirection] = useState<'in' | 'out' | null>(null);
  const [showBackToTop, setShowBackToTop] = useState<boolean>(false);

  // Listen to window scroll to show Back to Top floating button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 450);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToDossier = () => {
    document.getElementById('technical-dossier')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleZoom = (dir: 'in' | 'out') => {
    setZoomDirection(dir);
    setZoomTrigger((prev) => prev + 1);
  };

  const team = TEAMS_DATA[selectedTeamId] || TEAMS_DATA.ferrari;
  const livery = getTeam3DLivery(selectedTeamId);

  const CAMERA_PRESETS: {
    id: CameraPreset;
    labelVi: string;
    labelEn: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: 'overview',
      labelVi: 'Toàn Cảnh',
      labelEn: '360° View',
      icon: <Eye className="w-3.5 h-3.5" />,
    },
    {
      id: 'front',
      labelVi: 'Cánh Trước',
      labelEn: 'Front Aero',
      icon: <Crosshair className="w-3.5 h-3.5" />,
    },
    {
      id: 'cockpit',
      labelVi: 'Buồng Lái',
      labelEn: 'Cockpit',
      icon: <Shield className="w-3.5 h-3.5" />,
    },
    {
      id: 'rear',
      labelVi: 'Cánh Đuôi',
      labelEn: 'Rear & DRS',
      icon: <Zap className="w-3.5 h-3.5" />,
    },
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
        </div>
      </div>

      {/* ── 3D Interactive Showroom & Visualizer ── */}
      <div className="flex flex-col w-full">
          <div className="relative w-full h-[620px] sm:h-[680px] lg:h-[740px] overflow-hidden bg-radial from-[#12121a] via-[#09090e] to-[#040407] select-none border-b border-studio-800/80">
            {/* Top Left Floating Team & Engine Info Badge */}
            <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20 pointer-events-none">
              <div className="p-3 sm:p-3.5 rounded-2xl bg-studio-950/85 backdrop-blur-xl border border-studio-800/80 shadow-2xl space-y-1 max-w-[280px] sm:max-w-xs">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0 shadow-md ring-2 ring-white/20"
                    style={{ backgroundColor: team.primaryColor }}
                  />
                  <span className="text-[10px] font-black uppercase tracking-widest text-studio-400">
                    {team.name} · 2026 Livery
                  </span>
                </div>
                <h2 className="font-display text-sm sm:text-base font-black uppercase text-white leading-tight">
                  {team.fullName}
                </h2>
                <div className="text-[11px] text-studio-300 space-y-0.5 pt-1 border-t border-studio-800/60 font-medium">
                  <p className="truncate">⚡ {team.powerUnit}</p>
                  <p className="text-studio-400">Trụ sở: {team.base}</p>
                </div>
              </div>
            </div>

            {/* Top Center Camera Preset Quick Switcher */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 hidden md:flex items-center gap-1.5 p-1 rounded-xl bg-studio-950/85 backdrop-blur-xl border border-studio-800/80 shadow-2xl">
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
            <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 flex items-center gap-2 flex-wrap justify-end">
              {/* Bespoke Close-Up Inspection Button */}
              <button
                type="button"
                onClick={() => {
                  setActiveHotspot(F1_HOTSPOTS[0]);
                  setCameraPreset(null);
                  setAutoRotate(false);
                }}
                className="p-2 sm:p-2.5 rounded-xl border backdrop-blur-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-lg bg-studio-950/85 text-studio-200 border-studio-800 hover:text-white hover:bg-studio-900 cursor-pointer"
                title={lang === 'vi' ? 'Soi cận cảnh linh kiện của mẫu xe này' : 'Inspect bespoke component close-ups'}
              >
                <Camera className="w-4 h-4 text-f1red" />
                <span className="hidden sm:inline">
                  {lang === 'vi' ? 'Soi Cận Cảnh' : 'Close-Ups'}
                </span>
              </button>

              {/* Zoom In & Zoom Out HUD Controls */}
              <div className="flex items-center rounded-xl bg-studio-950/85 border border-studio-800 p-0.5 shadow-lg backdrop-blur-xl">
                <button
                  type="button"
                  onClick={() => handleZoom('in')}
                  className="p-2 text-studio-300 hover:text-white hover:bg-studio-800/80 rounded-lg transition-colors cursor-pointer"
                  title={lang === 'vi' ? 'Phóng to góc nhìn xe (+)' : 'Zoom In (+)'}
                >
                  <ZoomIn className="w-4 h-4 text-studio-200" />
                </button>
                <button
                  type="button"
                  onClick={() => handleZoom('out')}
                  className="p-2 text-studio-300 hover:text-white hover:bg-studio-800/80 rounded-lg transition-colors cursor-pointer"
                  title={lang === 'vi' ? 'Thu nhỏ góc nhìn xe (-)' : 'Zoom Out (-)'}
                >
                  <ZoomOut className="w-4 h-4 text-studio-200" />
                </button>
              </div>

              {/* Wheel Zoom Toggle (Default Off so mouse wheel scrolls page smoothly) */}
              <button
                type="button"
                onClick={() => setEnableWheelZoom(!enableWheelZoom)}
                className={`p-2 sm:p-2.5 rounded-xl border backdrop-blur-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-lg cursor-pointer ${
                  enableWheelZoom
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-amber-500/20'
                    : 'bg-studio-950/85 text-studio-400 border-studio-800 hover:text-white'
                }`}
                title={
                  enableWheelZoom
                    ? (lang === 'vi' ? 'Lăn chuột đang Zoom 3D (Bấm để chuyển sang cuộn trang web)' : 'Wheel is Zooming 3D (Click to scroll webpage)')
                    : (lang === 'vi' ? 'Lăn chuột đang Cuộn Trang Web (Bấm nếu muốn lăn chuột Zoom 3D)' : 'Wheel is Scrolling Page (Click to zoom 3D)')
                }
              >
                <span className="text-[10px] font-mono font-bold">
                  {enableWheelZoom ? 'Zoom: BẬT' : 'Cuộn Trang'}
                </span>
              </button>

              {/* Wind Tunnel FX Toggle */}
              <button
                type="button"
                onClick={() => setShowWindTunnel(!showWindTunnel)}
                className={`p-2 sm:p-2.5 rounded-xl border backdrop-blur-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-lg cursor-pointer ${
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
                className={`p-2 sm:p-2.5 rounded-xl border backdrop-blur-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-lg cursor-pointer ${
                  autoRotate
                    ? 'bg-studio-800 text-white border-studio-700'
                    : 'bg-studio-950/85 text-studio-400 border-studio-800 hover:text-white'
                }`}
                title={lang === 'vi' ? 'Bật/Tắt xoay tự động' : 'Toggle Auto-Rotation'}
              >
                {autoRotate ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span className="hidden sm:inline">
                  {lang === 'vi' ? 'Tự Xoay' : 'Auto Rotate'}
                </span>
              </button>

              {/* Reset Camera Button */}
              <button
                type="button"
                onClick={() => {
                  setActiveHotspot(null);
                  setCameraPreset('overview');
                  setAutoRotate(true);
                }}
                className="p-2 sm:p-2.5 rounded-xl bg-studio-950/85 hover:bg-studio-900 border border-studio-800 hover:border-studio-700 backdrop-blur-xl text-xs font-bold text-studio-300 hover:text-white transition-all flex items-center gap-1.5 shadow-lg cursor-pointer"
                title={lang === 'vi' ? 'Góc nhìn toàn cảnh' : 'Reset Full View'}
              >
                <RotateCcw className="w-4 h-4 text-f1red" />
                <span className="hidden sm:inline">{lang === 'vi' ? 'Toàn Cảnh' : 'Reset'}</span>
              </button>
            </div>

            {/* ── Three.js WebGL 3D Canvas ── */}
            <Canvas
              shadows
              camera={{ position: [3.2, 1.6, -3.4], fov: 42 }}
              gl={{ antialias: true, alpha: true, toneMappingExposure: 1.25 }}
              className="w-full h-full cursor-grab active:cursor-grabbing"
            >
              {/* Photorealistic Studio Reflections for Metallic & Carbon Surfaces */}
              <Environment preset="city" />

              {/* Cinematic Studio Lighting */}
              <ambientLight intensity={1.5} />
              <directionalLight
                position={[6, 9, -5]}
                intensity={2.4}
                castShadow
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
                shadow-bias={-0.0001}
              />
              {/* Rim backlights */}
              <directionalLight position={[-6, 4, 5]} intensity={1.3} color="#60a5fa" />
              <directionalLight position={[0, -2, 0]} intensity={0.5} color="#ffffff" />
              <pointLight position={[0, 4.5, 0]} intensity={1.5} color="#ffffff" />
              <spotLight
                position={[0, 7, -2]}
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
                enableWheelZoom={enableWheelZoom}
                zoomTrigger={zoomTrigger}
                zoomDirection={zoomDirection}
              />
            </Canvas>

            {/* Quick Scroll Down Indicator Button */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 z-30 pointer-events-auto">
              <button
                type="button"
                onClick={scrollToDossier}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-studio-900/95 hover:bg-studio-800 border border-studio-700/80 text-xs font-bold text-studio-200 hover:text-white shadow-2xl backdrop-blur-md transition-all hover:scale-105 cursor-pointer group"
                title={lang === 'vi' ? 'Cuộn nhanh xuống xem hồ sơ kỹ thuật xe' : 'Scroll down to technical dossier'}
              >
                <span>{lang === 'vi' ? 'Cuộn xem hồ sơ xe' : 'Technical Dossier'}</span>
                <ChevronDown className="w-3.5 h-3.5 text-f1red animate-bounce" />
              </button>
            </div>

            {/* ── Bottom Overlay Panel (Hotspot Quick Jump + Livery Selector) ── */}
            <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 z-20 space-y-2 pointer-events-auto">
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
              <div className="p-2.5 sm:p-3 rounded-2xl bg-studio-950/85 backdrop-blur-xl border border-studio-800/80 shadow-2xl">
                <LiverySelector
                  selectedTeamId={selectedTeamId}
                  onSelectTeam={handleSelectTeam}
                  lang={lang}
                />
              </div>
            </div>

            {/* ── Slide-Over Technical Details Modal Drawer: Synced with selected team ── */}
            <HotspotDetailsModal
              hotspot={activeHotspot}
              teamId={selectedTeamId}
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

          {/* ── Scrollable Technical Overview & Constructor Machine Dossier Below Canvas ── */}
          <div id="technical-dossier" className="bg-studio-950 text-white border-t border-studio-800 py-12 scroll-mt-14">
            <div className="page-container space-y-10">
              {/* Section Header: Dynamically reflects active team */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-studio-800 pb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shadow-xs"
                      style={{ backgroundColor: livery.bodyColor }}
                    />
                    <span className="text-xs font-black uppercase tracking-widest text-f1red">
                      {lang === 'vi' ? 'Hồ Sơ Kỹ Thuật Đội Đua' : 'Technical Dossier & Machine'}
                    </span>
                  </div>
                  <h3 className="font-display text-2xl sm:text-3xl font-black uppercase text-white mt-1 flex items-center gap-3 flex-wrap">
                    <span>{livery.fullName}</span>
                    <span className="text-sm font-bold tracking-wider text-studio-400 font-mono bg-studio-900 border border-studio-800 px-3 py-1 rounded-full">
                      {livery.carModelName}
                    </span>
                  </h3>
                </div>
                <div className="flex items-center gap-3">
                  <Link
                    to={`/teams/${selectedTeamId}?season=2026`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider border border-white/15 backdrop-blur-md transition-all cursor-pointer"
                  >
                    <span>{lang === 'vi' ? 'Xem Hồ Sơ Đội' : 'Team Profile'}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-f1red" />
                  </Link>
                </div>
              </div>

              {/* Showcase Banner: Bespoke Macro Close-Up + Core Pillars */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
                {/* Left: Dedicated Macro Close-Up Card */}
                {(() => {
                  const heroCloseup = getTeamComponentCloseUp(selectedTeamId, 'wings');
                  return (
                    <div className="relative rounded-2xl overflow-hidden bg-studio-900/80 border border-studio-800 shadow-xl flex flex-col justify-between p-6 group">
                      {/* Subtle Team Ambient Radial Glow */}
                      <div
                        className="absolute inset-0 pointer-events-none opacity-20 transition-all duration-700"
                        style={{
                          background: `radial-gradient(circle at 50% 40%, ${livery.bodyColor} 0%, transparent 70%)`,
                        }}
                      />

                      <div className="relative z-10 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-300 bg-amber-950/70 border border-amber-800/80 px-2 py-0.5 rounded flex items-center gap-1">
                            <Camera className="w-3 h-3 text-amber-400" />
                            CẬN CẢNH KỸ THUẬT
                          </span>
                          <span className="text-[10px] font-mono text-studio-400">
                            {heroCloseup.partCode}
                          </span>
                        </div>
                        <h4 className="font-display text-lg font-black uppercase text-white pt-1">
                          {lang === 'vi' ? heroCloseup.titleVi : heroCloseup.titleEn}
                        </h4>
                        <p className="text-xs text-studio-400">{livery.base}</p>
                      </div>

                      {/* Bespoke Close-up Image Container */}
                      <div
                        onClick={() => {
                          setActiveHotspot(F1_HOTSPOTS[0]);
                          setCameraPreset(null);
                          setAutoRotate(false);
                        }}
                        className="relative z-10 my-4 rounded-xl overflow-hidden border border-studio-700/60 bg-black/80 aspect-video flex items-center justify-center cursor-pointer group/img shadow-lg"
                      >
                        <img
                          src={heroCloseup.imageUrl}
                          alt={heroCloseup.titleEn}
                          className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-studio-950/90 via-transparent to-black/20 opacity-80 group-hover/img:opacity-60 transition-opacity" />
                        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-xs">
                          <span className="text-[11px] font-bold text-white bg-studio-950/80 px-2 py-1 rounded backdrop-blur-md border border-studio-700/60 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: livery.bodyColor }} />
                            {livery.teamName} {livery.shortCarName}
                          </span>
                          <span className="text-[11px] font-mono text-amber-300 font-bold bg-black/70 px-2 py-1 rounded border border-amber-900/60 flex items-center gap-1">
                            <Camera className="w-3 h-3 text-amber-400" />
                            {lang === 'vi' ? 'Soi Cận Cảnh' : 'Inspect'}
                          </span>
                        </div>
                      </div>

                      {/* Drivers & Leadership */}
                      <div className="relative z-10 pt-3 border-t border-studio-800/80 text-xs text-studio-300 space-y-1">
                        <div className="flex items-center gap-1.5 font-mono text-[11px] text-white">
                          <span className="text-studio-500 font-sans">Tay đua:</span>
                          <span>{lang === 'vi' ? livery.driversVi : livery.driversEn}</span>
                        </div>
                        <div className="text-[11px] text-studio-400">
                          Lãnh đội: <span className="text-studio-200">{livery.teamPrincipal}</span>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Right: 4 Technical Pillars tailored to active team */}
                <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* 1. Aero */}
                  <div className="p-5 rounded-2xl bg-studio-900/60 border border-studio-800 space-y-2 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="w-8 h-8 rounded-lg bg-red-950/70 border border-red-800/80 flex items-center justify-center text-f1red font-bold text-sm">
                          01
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-studio-500 font-mono">
                          Aerodynamics
                        </span>
                      </div>
                      <h4 className="font-display text-base font-bold text-white uppercase">
                        {lang === 'vi' ? 'Khí Động Học & Khung Gầm' : 'Aero & Ground Effect'}
                      </h4>
                      <p className="text-xs text-studio-400 leading-relaxed">
                        {lang === 'vi' ? livery.aeroPhilosophyVi : livery.aeroPhilosophyEn}
                      </p>
                    </div>
                  </div>

                  {/* 2. Powertrain */}
                  <div className="p-5 rounded-2xl bg-studio-900/60 border border-studio-800 space-y-2 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="w-8 h-8 rounded-lg bg-amber-950/70 border border-amber-800/80 flex items-center justify-center text-amber-400 font-bold text-sm">
                          02
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-studio-500 font-mono">
                          Power Unit
                        </span>
                      </div>
                      <h4 className="font-display text-base font-bold text-white uppercase truncate">
                        {livery.powerUnit.split(' ')[0]} {livery.powerUnit.split(' ')[1] || 'Hybrid'}
                      </h4>
                      <p className="text-xs text-studio-300 font-mono">
                        {livery.powerUnit}
                      </p>
                      <p className="text-xs text-studio-400 leading-relaxed">
                        {lang === 'vi' ? livery.powertrainNoteVi : livery.powertrainNoteEn}
                      </p>
                    </div>
                  </div>

                  {/* 3. Halo Safety */}
                  <div className="p-5 rounded-2xl bg-studio-900/60 border border-studio-800 space-y-2 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="w-8 h-8 rounded-lg bg-emerald-950/70 border border-emerald-800/80 flex items-center justify-center text-emerald-400 font-bold text-sm">
                          03
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-studio-500 font-mono">
                          Safety Cell
                        </span>
                      </div>
                      <h4 className="font-display text-base font-bold text-white uppercase">
                        {lang === 'vi' ? 'An Toàn Titan Halo' : 'Titanium Halo Cell'}
                      </h4>
                      <p className="text-xs text-studio-400 leading-relaxed">
                        {lang === 'vi'
                          ? `Khung bảo vệ Titan Grade 5 sơn phối màu ${livery.teamName} chịu lực va chạm tĩnh 12.3 tấn bảo vệ tuyệt đối vùng buồng lái tay đua.`
                          : `Grade 5 Titanium safety cell finished in ${livery.teamName} livery withstanding 12.3 tonnes of impact force shielding the cockpit.`}
                      </p>
                    </div>
                  </div>

                  {/* 4. Pirelli & Brakes */}
                  <div className="p-5 rounded-2xl bg-studio-900/60 border border-studio-800 space-y-2 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="w-8 h-8 rounded-lg bg-sky-950/70 border border-sky-800/80 flex items-center justify-center text-sky-400 font-bold text-sm">
                          04
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-studio-500 font-mono">
                          Pirelli & Brakes
                        </span>
                      </div>
                      <h4 className="font-display text-base font-bold text-white uppercase">
                        {lang === 'vi' ? 'Lốp Pirelli 18-Inch & Phanh' : '18-Inch Pirelli & Brakes'}
                      </h4>
                      <p className="text-xs text-studio-400 leading-relaxed">
                        {lang === 'vi'
                          ? 'Thành lốp mỏng 18 inch kết hợp mâm hợp kim Magiê và đĩa phanh Carbon Brembo đạt 1,000°C khi hãm tốc từ 340 km/h.'
                          : 'Low-profile rubber minimizes sidewall deflection, paired with Brembo carbon-carbon brake discs glowing red at 1,000°C.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
      </div>

      {/* Floating Back to Top 3D Stage Button */}
      {showBackToTop && (
        <button
          type="button"
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-40 p-3 rounded-2xl bg-f1red/95 hover:bg-f1red text-white shadow-2xl backdrop-blur-md border border-white/20 transition-all hover:scale-110 cursor-pointer animate-fade-in flex items-center gap-2 text-xs font-bold shadow-f1red/30 active:scale-95"
          title={lang === 'vi' ? 'Lên đầu trang xem xe 3D' : 'Back to 3D Stage'}
        >
          <ChevronUp className="w-4 h-4" />
          <span className="hidden sm:inline">
            {lang === 'vi' ? 'Lên Đầu Trang 3D' : 'Back to 3D'}
          </span>
        </button>
      )}
    </div>
  );
};
