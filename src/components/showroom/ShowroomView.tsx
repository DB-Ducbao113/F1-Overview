import React, { useState, useEffect, Suspense, useCallback, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { ContactShadows, Environment, MeshReflectorMaterial } from '@react-three/drei';
import { F1Car3DModel } from './F1Car3DModel';
import { CameraController, CameraPreset } from './CameraController';
import { Showroom3DLoader } from './Showroom3DLoader';
import { HotspotDetailsModal } from './HotspotDetailsModal';
import { LiverySelector } from './LiverySelector';
import { ShowroomControlDock, StudioLightingMode } from './ShowroomControlDock';
import { HotspotSelectorBar } from './HotspotSelectorBar';

import { HotspotItem } from '../../data/showroom/hotspotsData';
import { TeamId } from '../../types';
import { TEAMS_DATA } from '../../data/teams';
import { getTeam3DLivery } from '../../data/showroom/teamLiveries';
import { useNavigationStore } from '../../store/useNavigationStore';
import { ConstructorLogo } from '../common/ConstructorLogo';
import { getTeamSponsors } from '../../data/showroom/teamSponsors';
import { f1AudioEngine } from '../../utils/f1AudioEngine';

import { ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';

export const ShowroomView: React.FC = () => {
  const { lang } = useNavigationStore();
  const [searchParams, setSearchParams] = useSearchParams();

  // Selected Team for 3D Livery synced with query param ?team=...
  const teamParam = searchParams.get('team') as TeamId | null;
  const validTeamParam = teamParam && TEAMS_DATA[teamParam] ? teamParam : null;
  const [prevTeamParam, setPrevTeamParam] = useState<TeamId | null>(validTeamParam);
  const [selectedTeamId, setSelectedTeamId] = useState<TeamId>(validTeamParam || 'mercedes');

  if (validTeamParam && validTeamParam !== prevTeamParam) {
    setPrevTeamParam(validTeamParam);
    setSelectedTeamId(validTeamParam);
  }

  const handleSelectTeam = useCallback(
    (newTeamId: TeamId) => {
      setSelectedTeamId(newTeamId);
      setSearchParams({ team: newTeamId }, { replace: true });
    },
    [setSearchParams],
  );

  // Active Hotspot item
  const [activeHotspot, setActiveHotspot] = useState<HotspotItem | null>(null);

  // Active Camera Preset
  const [cameraPreset, setCameraPreset] = useState<CameraPreset | null>('overview');

  // 3D Visualizer settings
  const [autoRotate, setAutoRotate] = useState<boolean>(true);

  // Studio Lighting Mode (Direction 3): 'studio' | 'night_gp' | 'daylight'
  const [lightingMode, setLightingMode] = useState<StudioLightingMode>('studio');

  // Audio Engine State (Direction 2): Web Audio API V6 Turbo Hybrid
  const [isAudioActive, setIsAudioActive] = useState<boolean>(false);

  // Realistic 3D Sponsor Decals on 3D Car
  const [showSponsors, setShowSponsors] = useState<boolean>(true);

  // Engineering Hotspots Visibility (Clean default view matching studio photo)
  const [showHotspots, setShowHotspots] = useState<boolean>(false);

  // Smooth Scrolling & Zoom controls: wheel zoom is false by default so mouse wheel scrolls webpage
  const [enableWheelZoom, setEnableWheelZoom] = useState<boolean>(false);
  const [zoomTrigger, setZoomTrigger] = useState<number>(0);
  const [zoomDirection, setZoomDirection] = useState<'in' | 'out' | null>(null);
  const [showBackToTop, setShowBackToTop] = useState<boolean>(false);

  const handleToggleHotspots = useCallback(() => {
    setShowHotspots((prev) => !prev);
  }, []);

  const handleToggleSponsors = useCallback(() => {
    setShowSponsors((prev) => !prev);
  }, []);

  const handleToggleAutoRotate = useCallback(() => {
    setAutoRotate((prev) => !prev);
  }, []);

  const handleToggleWheelZoom = useCallback(() => {
    setEnableWheelZoom((prev) => !prev);
  }, []);

  const handleChangeLightingMode = useCallback((mode: StudioLightingMode) => {
    setLightingMode(mode);
  }, []);

  // Stop audio when unmounting
  useEffect(() => {
    return () => {
      f1AudioEngine.stop();
    };
  }, []);

  const handleToggleAudio = useCallback(() => {
    const isNowMuted = f1AudioEngine.toggleMute();
    setIsAudioActive(!isNowMuted);
  }, []);

  const handleRevEngine = useCallback(() => {
    f1AudioEngine.revUp(3.2);
    setIsAudioActive(true);
  }, []);

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

  const handleZoom = useCallback((dir: 'in' | 'out') => {
    setZoomDirection(dir);
    setZoomTrigger((prev) => prev + 1);
  }, []);

  const handleResetView = useCallback(() => {
    setActiveHotspot(null);
    setCameraPreset('overview');
    setAutoRotate(true);
  }, []);

  const handleSelectPreset = useCallback((preset: CameraPreset) => {
    setCameraPreset(preset);
    setActiveHotspot(null);
    setAutoRotate(false);
  }, []);

  const handleSelectHotspot = useCallback((hotspot: HotspotItem) => {
    setActiveHotspot(hotspot);
    setCameraPreset(null);
    setAutoRotate(false);
    // When inspecting Power Unit (Hotspot 3), trigger authentic engine rev
    if (hotspot.id === 'power_unit') {
      f1AudioEngine.revUp(3.0);
      setIsAudioActive(true);
    }
  }, []);

  const team = useMemo(() => TEAMS_DATA[selectedTeamId] || TEAMS_DATA.ferrari, [selectedTeamId]);
  const livery = useMemo(() => getTeam3DLivery(selectedTeamId), [selectedTeamId]);
  const teamSponsors = useMemo(() => getTeamSponsors(selectedTeamId), [selectedTeamId]);

  return (
    <div className="min-h-screen bg-studio-950 text-white flex flex-col font-sans">
      {/* ── Sub-Navigation Bar ── */}
      <div className="bg-studio-900/95 backdrop-blur-md border-b border-studio-800 sticky top-16 z-30">
        <div className="page-container flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 py-3">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-f1red flex items-center justify-center font-display text-xs font-black text-white shadow-md shadow-f1red/30">
              3D
            </span>
            <div>
              <h1 className="font-display text-lg sm:text-xl font-black uppercase tracking-wider text-white flex items-center gap-2">
                {lang === 'vi' ? 'Showroom Kỹ Thuật 3D Xe F1' : 'F1 3D Technical Showroom'}
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-950/70 border border-emerald-700/80 px-2 py-0.5 rounded-full">
                  2026 SPEC
                </span>
              </h1>
              <p className="text-xs text-studio-400">
                {lang === 'vi'
                  ? 'Mô hình xe F1 khí động học chân thực · 6 Điểm tương tác linh kiện · Đổi màu tem 11 đội đua'
                  : 'Authentic ground-effect F1 aerodynamics · 6 Interactive hotspots · 11 Constructor liveries'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={scrollToDossier}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-studio-800 hover:bg-studio-700 text-xs font-bold text-studio-200 hover:text-white transition-colors border border-studio-700/60 cursor-pointer"
            >
              <span>{lang === 'vi' ? 'Hồ Sơ Kỹ Thuật' : 'Dossier'}</span>
              <ChevronDown className="w-3.5 h-3.5 text-f1red" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Constructor Livery Quick-Selector Ribbon ── */}
      <div className="bg-studio-950 border-b border-studio-800/80 py-2.5 px-3 sm:px-6 shadow-sm z-20">
        <div className="max-w-7xl mx-auto">
          <LiverySelector
            selectedTeamId={selectedTeamId}
            onSelectTeam={handleSelectTeam}
            lang={lang}
          />
        </div>
      </div>

      {/* ── 3D Interactive Showroom Canvas Stage ── */}
      <div className="relative w-full h-[620px] sm:h-[680px] lg:h-[720px] overflow-hidden bg-radial from-[#12121a] via-[#09090e] to-[#040407] select-none">
        {/* Top Left Floating Team Badge with Official Logo */}
        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20 pointer-events-none">
          <div className="p-3 sm:p-3.5 rounded-2xl bg-studio-950/85 backdrop-blur-xl border border-studio-800/80 shadow-2xl space-y-1.5 max-w-[280px] sm:max-w-xs">
            <div className="flex items-center gap-2">
              <ConstructorLogo teamId={selectedTeamId} size="sm" />
              <span className="text-[10px] font-black uppercase tracking-widest text-studio-400">
                {team.name} · {livery.carModelName}
              </span>
            </div>
            <h2 className="font-display text-sm sm:text-base font-black uppercase text-white leading-tight">
              {team.fullName}
            </h2>
            <div className="text-[11px] text-studio-300 space-y-0.5 pt-1.5 border-t border-studio-800/60 font-medium">
              <p className="truncate">⚡ {team.powerUnit}</p>
              <p className="text-studio-400">Trụ sở: {team.base}</p>
            </div>
          </div>
        </div>

        {/* Top Right Unified Control Dock (Camera Presets, Lighting, Audio, Toggles, Wheel Mode, Zoom) */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20">
          <ShowroomControlDock
            cameraPreset={cameraPreset}
            onSelectPreset={handleSelectPreset}
            autoRotate={autoRotate}
            onToggleAutoRotate={handleToggleAutoRotate}
            enableWheelZoom={enableWheelZoom}
            onToggleWheelZoom={handleToggleWheelZoom}
            onZoom={handleZoom}
            onResetView={handleResetView}
            lang={lang}
            isAudioActive={isAudioActive}
            onToggleAudio={handleToggleAudio}
            onRevEngine={handleRevEngine}
            lightingMode={lightingMode}
            onChangeLightingMode={handleChangeLightingMode}
            showSponsors={showSponsors}
            onToggleSponsors={handleToggleSponsors}
            showHotspots={showHotspots}
            onToggleHotspots={handleToggleHotspots}
          />
        </div>

        {/* ── Three.js WebGL 3D Canvas ── */}
        <Canvas
          shadows
          camera={{ position: [3.4, 1.25, -2.8], fov: 38 }}
          gl={useMemo(
            () => ({
              antialias: true,
              alpha: true,
              toneMappingExposure:
                lightingMode === 'night_gp' ? 1.2 : lightingMode === 'daylight' ? 1.1 : 1.0,
            }),
            [lightingMode],
          )}
          className="w-full h-full cursor-grab active:cursor-grabbing"
        >
          {/* Photorealistic Studio Reflections for Metallic & Carbon Surfaces */}
          <Environment
            preset={
              lightingMode === 'night_gp'
                ? 'night'
                : lightingMode === 'daylight'
                  ? 'sunset'
                  : 'city'
            }
          />

          {/* ── Cinematic Studio Lighting according to lightingMode (Direction 3) ── */}
          {lightingMode === 'studio' && (
            <>
              {/* High-End Automotive Studio Key, Fill & Rim Lights (Calibrated for rich, authentic paint colors) */}
              <ambientLight intensity={0.5} color="#f8fafc" />
              <directionalLight
                position={[5, 8, -4]}
                intensity={1.8}
                color="#ffffff"
                castShadow
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
                shadow-bias={-0.0001}
              />
              <directionalLight position={[-6, 5, 4]} intensity={1.1} color="#e0f2fe" />
              <directionalLight position={[0, -2, 0]} intensity={0.3} color="#ffffff" />

              {/* Overhead Softbox Ceiling Light Panel (visible in Hình 2 above the car) */}
              <group position={[0, 4.2, -0.2]}>
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                  <planeGeometry args={[3.6, 7.5]} />
                  <meshBasicMaterial color="#ffffff" toneMapped={false} />
                </mesh>
                <spotLight
                  position={[0, 0, 0]}
                  angle={0.8}
                  penumbra={0.7}
                  intensity={1.8}
                  color="#ffffff"
                />
              </group>

              {/* Polished Luxury Dark Mirror Floor (Reflecting the F1 car like Hình 2) */}
              <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.002, 0]}>
                <planeGeometry args={[30, 30]} />
                <MeshReflectorMaterial
                  blur={[300, 100]}
                  resolution={1024}
                  mirror={0.7}
                  mixBlur={0.6}
                  mixStrength={2.2}
                  roughness={0.15}
                  depthScale={1.2}
                  minDepthThreshold={0.4}
                  maxDepthThreshold={1.4}
                  color="#090a0d"
                  metalness={0.7}
                />
              </mesh>
            </>
          )}

          {lightingMode === 'night_gp' && (
            <>
              {/* Singapore GP Stadium Floodlights */}
              <ambientLight intensity={0.9} color="#94a3b8" />
              <spotLight
                position={[6, 12, 6]}
                angle={0.55}
                penumbra={0.5}
                intensity={3.8}
                color="#ffffff"
                castShadow
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
              />
              <spotLight
                position={[-6, 12, -6]}
                angle={0.55}
                penumbra={0.5}
                intensity={3.8}
                color="#e0f2fe"
              />
              <spotLight
                position={[-6, 12, 6]}
                angle={0.55}
                penumbra={0.5}
                intensity={3.5}
                color="#ffffff"
              />
              <spotLight
                position={[6, 12, -6]}
                angle={0.55}
                penumbra={0.5}
                intensity={3.5}
                color="#e0f2fe"
              />
              <pointLight position={[0, 5, 0]} intensity={2.0} color="#ffffff" />
              {/* Floor: Asphalt Track with High-Contrast White Grid & Yellow Curbs */}
              <group position={[0, -0.01, 0]}>
                <gridHelper args={[16, 32, '#ffffff', '#0f172a']} position={[0, 0, 0]} />
                <mesh rotation={[-Math.PI / 2, 0, 0]}>
                  <ringGeometry args={[3.0, 3.06, 64]} />
                  <meshBasicMaterial color="#eab308" transparent opacity={0.6} />
                </mesh>
                <mesh rotation={[-Math.PI / 2, 0, 0]}>
                  <ringGeometry args={[4.5, 4.54, 64]} />
                  <meshBasicMaterial color={team.primaryColor} transparent opacity={0.5} />
                </mesh>
              </group>
            </>
          )}

          {lightingMode === 'daylight' && (
            <>
              {/* Monaco Daylight: Mediterranean Sun */}
              <ambientLight intensity={1.8} color="#fffbeb" />
              <directionalLight
                position={[8, 14, -6]}
                intensity={3.4}
                color="#fffbeb"
                castShadow
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
                shadow-bias={-0.0001}
              />
              <directionalLight position={[-8, 6, 8]} intensity={1.6} color="#bae6fd" />
              <directionalLight position={[0, -2, 0]} intensity={0.7} color="#fef08a" />
              <spotLight
                position={[0, 8, 0]}
                angle={0.7}
                penumbra={0.9}
                intensity={1.8}
                color="#fef08a"
              />
              {/* Floor: Sunlit Pavement Grid */}
              <group position={[0, -0.01, 0]}>
                <gridHelper args={[16, 32, team.primaryColor, '#334155']} position={[0, 0, 0]} />
                <mesh rotation={[-Math.PI / 2, 0, 0]}>
                  <ringGeometry args={[3.0, 3.05, 64]} />
                  <meshBasicMaterial color={team.primaryColor} transparent opacity={0.4} />
                </mesh>
                <mesh rotation={[-Math.PI / 2, 0, 0]}>
                  <ringGeometry args={[4.5, 4.53, 64]} />
                  <meshBasicMaterial color="#0284c7" transparent opacity={0.3} />
                </mesh>
              </group>
            </>
          )}

          {/* F1 3D Car Model with Suspense Loading HUD */}
          <Suspense fallback={<Showroom3DLoader />}>
            <F1Car3DModel
              teamId={selectedTeamId}
              activeHotspot={activeHotspot}
              onSelectHotspot={handleSelectHotspot}
              lang={lang}
              showHotspots={showHotspots}
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

        {/* ── Slide-Over Technical Details Modal Drawer: Synced with selected team ── */}
        <HotspotDetailsModal
          hotspot={activeHotspot}
          teamId={selectedTeamId}
          onClose={() => {
            setActiveHotspot(null);
            setCameraPreset('overview');
          }}
          onSelectHotspot={handleSelectHotspot}
          lang={lang}
        />
      </div>

      {/* ── Component 1-6 Interactive Navigation Strip ── */}
      <HotspotSelectorBar
        activeHotspot={activeHotspot}
        onSelectHotspot={handleSelectHotspot}
        teamId={selectedTeamId}
        lang={lang}
      />

      {/* ── Scrollable Technical Overview & Constructor Machine Dossier Below Canvas ── */}
      <div
        id="technical-dossier"
        className="bg-studio-950 text-white border-t border-studio-800 py-12 scroll-mt-14"
      >
        <div className="page-container space-y-10">
          {/* Section Header: Dynamically reflects active team */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-studio-800 pb-6">
            <div>
              <div className="flex items-center gap-2">
                <ConstructorLogo teamId={selectedTeamId} size="sm" />
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

          {/* Team Drivers, Principal & Technical Details Bar */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-studio-300 font-mono py-2.5 px-4 rounded-xl bg-studio-900/60 border border-studio-800/80">
            <div>
              <span className="text-studio-500 font-sans">
                {lang === 'vi' ? 'Tay đua: ' : 'Drivers: '}
              </span>
              <span className="text-white font-bold">
                {lang === 'vi' ? livery.driversVi : livery.driversEn}
              </span>
            </div>
            <div className="w-1 h-1 rounded-full bg-studio-700 hidden sm:block" />
            <div>
              <span className="text-studio-500 font-sans">
                {lang === 'vi' ? 'Lãnh đội: ' : 'Principal: '}
              </span>
              <span className="text-studio-200">{livery.teamPrincipal}</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-studio-700 hidden sm:block" />
            <div>
              <span className="text-studio-500 font-sans">
                {lang === 'vi' ? 'Trụ sở: ' : 'Base: '}
              </span>
              <span className="text-studio-200">{livery.base}</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-studio-700 hidden sm:block" />
            <div>
              <span className="text-studio-500 font-sans">
                {lang === 'vi' ? 'Tài trợ chính: ' : 'Title Partner: '}
              </span>
              <span className="text-amber-300 font-bold">{teamSponsors.primarySponsor}</span>
            </div>
          </div>

          {/* 4 Technical Pillars tailored to active team */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                <p className="text-xs text-studio-300 font-mono">{livery.powerUnit}</p>
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

      {/* Floating Back to Top 3D Stage Button */}
      {showBackToTop && (
        <button
          type="button"
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-40 p-3 rounded-2xl bg-f1red/95 hover:bg-f1red text-white shadow-2xl backdrop-blur-md border border-white/20 transition-all hover:scale-110 cursor-pointer animate-fade-in flex items-center gap-2 text-xs font-bold shadow-f1red/30 active:scale-95"
          aria-label={lang === 'vi' ? 'Lên đầu trang xem xe 3D' : 'Back to 3D Stage'}
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
