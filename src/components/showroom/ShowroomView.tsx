import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { ContactShadows } from '@react-three/drei';
import { F1Car3DModel } from './F1Car3DModel';
import { CameraController } from './CameraController';
import { HotspotDetailsModal } from './HotspotDetailsModal';
import { LiverySelector } from './LiverySelector';
import { F1_HOTSPOTS, HotspotItem } from '../../data/showroom/hotspotsData';
import { TeamId } from '../../types';
import { TEAMS_DATA } from '../../data/teams';
import { useNavigationStore } from '../../store/useNavigationStore';
import { CollectionView } from '../collection/CollectionView';
import { RotateCcw, Wind, Play, Pause, Box, Image as ImageIcon, Sparkles } from 'lucide-react';

export const ShowroomView: React.FC = () => {
  const { lang } = useNavigationStore();

  // Active top tab: 'showroom' (3D) or 'gallery' (Community Photo Collection)
  const [activeTab, setActiveTab] = useState<'showroom' | 'gallery'>('showroom');

  // Selected Team for 3D Livery
  const [selectedTeamId, setSelectedTeamId] = useState<TeamId>('ferrari');

  // Active Hotspot item
  const [activeHotspot, setActiveHotspot] = useState<HotspotItem | null>(null);

  // 3D Visualizer settings
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [showWindTunnel, setShowWindTunnel] = useState<boolean>(false);

  const team = TEAMS_DATA[selectedTeamId] || TEAMS_DATA.ferrari;

  return (
    <div className="min-h-screen bg-studio-950 text-white flex flex-col">
      {/* ── Sub-Navigation Bar: Toggle between 3D Showroom & Image Gallery ── */}
      <div className="bg-studio-900/90 backdrop-blur-md border-b border-studio-800 sticky top-16 z-40">
        <div className="page-container flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-3">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-f1red flex items-center justify-center font-display text-xs font-black text-white shadow-md">
              3D
            </span>
            <div>
              <h1 className="font-display text-lg sm:text-xl font-black uppercase tracking-wider text-white flex items-center gap-2">
                {lang === 'vi' ? 'Showroom Kỹ Thuật 3D Xe F1' : 'F1 3D Technical Showroom'}
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2 py-0.5 rounded-full">
                  Interactive
                </span>
              </h1>
              <p className="text-xs text-studio-400">
                {lang === 'vi'
                  ? 'Mô phỏng 3D đa góc nhìn · Điểm nóng kỹ thuật (Hotspots) · Bộ tem 11 đội đua'
                  : 'Interactive 3D hotspots · Engineering cutaway visualizer · 11 team liveries'}
              </p>
            </div>
          </div>

          {/* Mode Switcher Pills: Showroom 3D vs Community Gallery */}
          <div className="flex items-center p-1 rounded-xl bg-studio-950 border border-studio-800 self-stretch sm:self-auto">
            <button
              type="button"
              onClick={() => setActiveTab('showroom')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'showroom'
                  ? 'bg-f1red text-white shadow-md'
                  : 'text-studio-400 hover:text-white'
              }`}
            >
              <Box className="w-3.5 h-3.5" />
              <span>{lang === 'vi' ? 'Mô Hình 3D & Kỹ Thuật' : '3D Car & Tech'}</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('gallery')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
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
        // Render Existing Photo Collection View without deleting anything!
        <div className="bg-studio-100 text-studio-900 flex-1">
          <CollectionView />
        </div>
      ) : (
        // ── Render 3D Interactive Showroom & Visualizer ──
        <div className="relative flex-1 h-[calc(100vh-130px)] min-h-[640px] w-full overflow-hidden bg-radial from-studio-900 via-studio-950 to-black select-none">
          {/* Top Left Floating Team & Engine Info Badge */}
          <div className="absolute top-4 left-4 z-20 pointer-events-none">
            <div className="p-3.5 sm:p-4 rounded-2xl bg-studio-950/80 backdrop-blur-md border border-studio-800/80 shadow-2xl space-y-1.5 max-w-xs">
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full shrink-0 shadow-xs"
                  style={{ backgroundColor: team.primaryColor }}
                />
                <span className="text-[10px] font-black uppercase tracking-widest text-studio-400">
                  {team.name} · 2026 Specification
                </span>
              </div>
              <h2 className="font-display text-base sm:text-lg font-black uppercase text-white leading-tight">
                {team.fullName}
              </h2>
              <div className="text-[11px] text-studio-300 space-y-0.5 pt-1 border-t border-studio-800/60 font-medium">
                <p className="truncate">⚡ {team.powerUnit}</p>
                <p className="text-studio-400">Base: {team.base}</p>
              </div>
            </div>
          </div>

          {/* Top Right Quick Canvas Controls */}
          <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
            {/* Wind Tunnel FX Toggle */}
            <button
              type="button"
              onClick={() => setShowWindTunnel(!showWindTunnel)}
              className={`p-2.5 rounded-xl border backdrop-blur-md text-xs font-bold transition-all flex items-center gap-1.5 shadow-lg ${
                showWindTunnel
                  ? 'bg-emerald-500 text-black border-emerald-400 shadow-emerald-500/20'
                  : 'bg-studio-950/80 text-studio-300 border-studio-800 hover:text-white hover:bg-studio-900'
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
              onClick={() => setAutoRotate(!autoRotate)}
              className={`p-2.5 rounded-xl border backdrop-blur-md text-xs font-bold transition-all flex items-center gap-1.5 shadow-lg ${
                autoRotate
                  ? 'bg-studio-800 text-white border-studio-700'
                  : 'bg-studio-950/80 text-studio-400 border-studio-800 hover:text-white'
              }`}
              title={lang === 'vi' ? 'Bật/Tắt xoay tự động' : 'Toggle Auto-Rotation'}
            >
              {autoRotate ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span className="hidden sm:inline">{lang === 'vi' ? 'Tự Xoay' : 'Auto Rotate'}</span>
            </button>

            {/* Reset Camera Button */}
            <button
              type="button"
              onClick={() => setActiveHotspot(null)}
              className="p-2.5 rounded-xl bg-studio-950/80 hover:bg-studio-900 border border-studio-800 hover:border-studio-700 backdrop-blur-md text-xs font-bold text-studio-300 hover:text-white transition-all flex items-center gap-1.5 shadow-lg"
              title={lang === 'vi' ? 'Góc nhìn toàn cảnh' : 'Reset Full View'}
            >
              <RotateCcw className="w-4 h-4 text-f1red" />
              <span className="hidden sm:inline">{lang === 'vi' ? 'Toàn Cảnh' : 'Reset View'}</span>
            </button>
          </div>

          {/* ── Three.js WebGL 3D Canvas ── */}
          <Canvas
            shadows
            camera={{ position: [3.2, 1.6, 3.8], fov: 45 }}
            gl={{ antialias: true, alpha: true }}
            className="w-full h-full cursor-grab active:cursor-grabbing"
          >
            {/* Cinematic Studio Lighting */}
            <ambientLight intensity={1.2} />
            <directionalLight
              position={[5, 8, 5]}
              intensity={2.0}
              castShadow
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
              shadow-bias={-0.0001}
            />
            <directionalLight position={[-5, 4, -4]} intensity={1.0} color="#66aaff" />
            <pointLight position={[0, 4, 0]} intensity={1.5} color="#ffffff" />
            <spotLight
              position={[0, 6, 2]}
              angle={0.6}
              penumbra={0.8}
              intensity={2.5}
              color={team.primaryColor}
            />

            {/* F1 3D Car Model with Hotspots & Wind Tunnel */}
            <F1Car3DModel
              teamId={selectedTeamId}
              activeHotspot={activeHotspot}
              onSelectHotspot={(hotspot) => {
                setActiveHotspot(hotspot);
                setAutoRotate(false);
              }}
              showWindTunnel={showWindTunnel}
              lang={lang}
            />

            {/* Dynamic Ground Contact Shadows */}
            <ContactShadows
              position={[0, 0, 0]}
              opacity={0.85}
              scale={10}
              blur={1.8}
              far={4}
              color="#000000"
            />

            {/* Smooth Camera Controller & OrbitControls */}
            <CameraController activeHotspot={activeHotspot} autoRotate={autoRotate} />
          </Canvas>

          {/* ── Bottom Overlay Panel (Hotspot Quick Jump + Livery Selector) ── */}
          <div className="absolute bottom-4 left-4 right-4 z-20 space-y-3 pointer-events-auto">
            {/* Hotspots Quick Pills Selector */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-1 px-1 custom-scrollbar">
              <span className="text-[10px] font-black uppercase tracking-wider text-studio-400 bg-studio-950/90 border border-studio-800 px-2.5 py-1.5 rounded-lg shrink-0 flex items-center gap-1">
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
                      setAutoRotate(false);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 shrink-0 border flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-f1red text-white border-white/80 shadow-md shadow-f1red/30'
                        : 'bg-studio-950/80 text-studio-300 border-studio-800 hover:bg-studio-900 hover:text-white'
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
            <div className="p-3 rounded-2xl bg-studio-950/85 backdrop-blur-md border border-studio-800/80 shadow-2xl">
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
            onClose={() => setActiveHotspot(null)}
            onSelectHotspot={(hotspot) => {
              setActiveHotspot(hotspot);
              setAutoRotate(false);
            }}
            lang={lang}
          />
        </div>
      )}
    </div>
  );
};
