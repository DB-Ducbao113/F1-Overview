import React, { useState } from 'react';
import { CameraPreset } from './CameraController';
import {
  RotateCcw,
  Wind,
  Play,
  Pause,
  Eye,
  Crosshair,
  Shield,
  Zap,
  Box,
  ZoomIn,
  ZoomOut,
  MousePointer,
  ChevronDown,
  ChevronUp,
  Settings2,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Sparkles,
  Flame,
} from 'lucide-react';

export type StudioLightingMode = 'cyber' | 'night_gp' | 'daylight';

interface ShowroomControlDockProps {
  cameraPreset: CameraPreset | null;
  onSelectPreset: (preset: CameraPreset) => void;
  autoRotate: boolean;
  onToggleAutoRotate: () => void;
  showWindTunnel: boolean;
  onToggleWindTunnel: () => void;
  enableWheelZoom: boolean;
  onToggleWheelZoom: () => void;
  onZoom: (direction: 'in' | 'out') => void;
  onResetView: () => void;
  lang: 'vi' | 'en';
  // Audio Controls (Direction 2)
  isAudioActive: boolean;
  onToggleAudio: () => void;
  onRevEngine: () => void;
  // Studio Lighting Mode (Direction 3)
  lightingMode: StudioLightingMode;
  onChangeLightingMode: (mode: StudioLightingMode) => void;
}

export const ShowroomControlDock: React.FC<ShowroomControlDockProps> = ({
  cameraPreset,
  onSelectPreset,
  autoRotate,
  onToggleAutoRotate,
  showWindTunnel,
  onToggleWindTunnel,
  enableWheelZoom,
  onToggleWheelZoom,
  onZoom,
  onResetView,
  lang,
  isAudioActive,
  onToggleAudio,
  onRevEngine,
  lightingMode,
  onChangeLightingMode,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  const CAMERA_PRESETS: {
    id: CameraPreset;
    labelVi: string;
    labelEn: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: 'overview',
      labelVi: 'Toàn Cảnh 360°',
      labelEn: '360° Orbit',
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
      labelVi: 'Cánh Đuôi & DRS',
      labelEn: 'Rear & DRS',
      icon: <Zap className="w-3.5 h-3.5" />,
    },
    {
      id: 'top',
      labelVi: 'Từ Trên Xuống',
      labelEn: 'Top Down',
      icon: <Box className="w-3.5 h-3.5" />,
    },
  ];

  const LIGHTING_MODES: {
    id: StudioLightingMode;
    labelVi: string;
    labelEn: string;
    descVi: string;
    descEn: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: 'cyber',
      labelVi: 'Hắc Kim',
      labelEn: 'Cyber',
      descVi: 'Studio Hắc Kim Công Nghệ Neon',
      descEn: 'High-Tech Dark Studio',
      icon: <Moon className="w-3.5 h-3.5" />,
    },
    {
      id: 'night_gp',
      labelVi: 'Đua Đêm',
      labelEn: 'Night GP',
      descVi: 'Đèn Pha Rọi Đường Đua Singapore GP',
      descEn: 'Singapore Floodlight GP',
      icon: <Sparkles className="w-3.5 h-3.5" />,
    },
    {
      id: 'daylight',
      labelVi: 'Ban Ngày',
      labelEn: 'Daylight',
      descVi: 'Nắng Địa Trung Hải Monaco GP',
      descEn: 'Monaco Mediterranean Sunlight',
      icon: <Sun className="w-3.5 h-3.5" />,
    },
  ];

  return (
    <div className="flex flex-col items-end gap-2 pointer-events-auto">
      {/* ── Main Floating Control Deck ── */}
      <div className="rounded-2xl bg-studio-950/90 backdrop-blur-2xl border border-studio-800 shadow-2xl p-2.5 sm:p-3 text-white max-w-sm sm:max-w-md w-full transition-all">
        {/* Header: Title & Collapse Button */}
        <div className="flex items-center justify-between pb-2 border-b border-studio-800/80 mb-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-f1red animate-pulse" />
            <span className="text-[11px] font-black uppercase tracking-wider text-studio-300 flex items-center gap-1.5">
              <Settings2 className="w-3.5 h-3.5 text-f1red" />
              {lang === 'vi' ? 'Bảng Điều Khiển 3D' : '3D Control Deck'}
            </span>
          </div>

          <div className="flex items-center gap-1">
            {/* Quick Reset Button */}
            <button
              type="button"
              onClick={onResetView}
              className="p-1 rounded-md text-studio-400 hover:text-white hover:bg-studio-800 transition-colors cursor-pointer"
              title={lang === 'vi' ? 'Đặt lại góc nhìn mặc định' : 'Reset to default view'}
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Minimize / Expand Toggle */}
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 rounded-md text-studio-400 hover:text-white hover:bg-studio-800 transition-colors cursor-pointer"
              title={isExpanded ? (lang === 'vi' ? 'Thu gọn' : 'Collapse') : (lang === 'vi' ? 'Mở rộng' : 'Expand')}
            >
              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {isExpanded && (
          <div className="space-y-3 animate-fade-in">
            {/* 1. Camera View Presets Grid */}
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-studio-400 mb-1.5 flex items-center justify-between">
                <span>{lang === 'vi' ? 'Góc nhìn camera:' : 'Camera Presets:'}</span>
                <span className="text-studio-400 font-mono text-[9px]">5 PRESETS</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                {CAMERA_PRESETS.map((p) => {
                  const isActive = cameraPreset === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => onSelectPreset(p.id)}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer border ${
                        isActive
                          ? 'bg-f1red text-white border-f1red shadow-md shadow-f1red/30'
                          : 'bg-studio-900/80 text-studio-300 border-studio-800 hover:bg-studio-800 hover:text-white'
                      }`}
                    >
                      {p.icon}
                      <span className="truncate">{lang === 'vi' ? p.labelVi : p.labelEn}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Studio Lighting Environment (Direction 3) */}
            <div className="pt-2 border-t border-studio-800/80">
              <div className="text-[10px] font-bold uppercase tracking-wider text-studio-400 mb-1.5 flex items-center justify-between">
                <span>{lang === 'vi' ? 'Ánh sáng trường quay:' : 'Studio Lighting:'}</span>
                <span className="text-amber-400 font-mono text-[9px] uppercase">
                  {lightingMode === 'cyber' ? 'CYBER' : lightingMode === 'night_gp' ? 'NIGHT GP' : 'DAYLIGHT'}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {LIGHTING_MODES.map((mode) => {
                  const isActive = lightingMode === mode.id;
                  return (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => onChangeLightingMode(mode.id)}
                      className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-[11px] font-bold transition-all cursor-pointer border ${
                        isActive
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500 shadow-sm shadow-amber-500/20'
                          : 'bg-studio-900/80 text-studio-400 border-studio-800 hover:bg-studio-800 hover:text-white'
                      }`}
                      title={lang === 'vi' ? mode.descVi : mode.descEn}
                    >
                      {mode.icon}
                      <span className="truncate">{lang === 'vi' ? mode.labelVi : mode.labelEn}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Interactive Simulation Toggles: Wind Tunnel & Auto Rotate */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-studio-800/80">
              {/* Wind Tunnel Streamlines Toggle */}
              <button
                type="button"
                onClick={onToggleWindTunnel}
                className={`p-2 rounded-xl border flex items-center justify-between gap-2 text-[11px] font-bold transition-all cursor-pointer ${
                  showWindTunnel
                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500 shadow-sm shadow-emerald-500/20'
                    : 'bg-studio-900/70 text-studio-400 border-studio-800 hover:text-white hover:bg-studio-800'
                }`}
                title={lang === 'vi' ? 'Bật/Tắt dòng hạt khí động học quanh xe' : 'Toggle Wind Tunnel Aerodynamic Streamlines'}
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <Wind className={`w-3.5 h-3.5 shrink-0 ${showWindTunnel ? 'text-emerald-400' : 'text-studio-400'}`} />
                  <span className="truncate">{lang === 'vi' ? 'Khí Động Học' : 'Wind Tunnel'}</span>
                </div>
                <span
                  className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${
                    showWindTunnel ? 'bg-emerald-500 text-black' : 'bg-studio-800 text-studio-400'
                  }`}
                >
                  {showWindTunnel ? (lang === 'vi' ? 'BẬT' : 'ON') : (lang === 'vi' ? 'TẮT' : 'OFF')}
                </span>
              </button>

              {/* Auto Rotate Toggle */}
              <button
                type="button"
                onClick={onToggleAutoRotate}
                className={`p-2 rounded-xl border flex items-center justify-between gap-2 text-[11px] font-bold transition-all cursor-pointer ${
                  autoRotate
                    ? 'bg-sky-950/80 text-sky-300 border-sky-500 shadow-sm shadow-sky-500/20'
                    : 'bg-studio-900/70 text-studio-400 border-studio-800 hover:text-white hover:bg-studio-800'
                }`}
                title={lang === 'vi' ? 'Bật/Tắt chế độ tự xoay xe 360 độ' : 'Toggle 360 Auto-Rotation'}
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  {autoRotate ? (
                    <Pause className="w-3.5 h-3.5 shrink-0 text-sky-400" />
                  ) : (
                    <Play className="w-3.5 h-3.5 shrink-0 text-studio-400" />
                  )}
                  <span className="truncate">{lang === 'vi' ? 'Tự Xoay' : 'Auto Rotate'}</span>
                </div>
                <span
                  className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${
                    autoRotate ? 'bg-sky-500 text-black' : 'bg-studio-800 text-studio-400'
                  }`}
                >
                  {autoRotate ? (lang === 'vi' ? 'CHẠY' : 'ON') : (lang === 'vi' ? 'DỪNG' : 'OFF')}
                </span>
              </button>
            </div>

            {/* 4. Engine Sound Engine (Direction 2): Audio Toggle & Rev Blip */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-studio-800/80">
              {/* Sound Audio Toggle */}
              <button
                type="button"
                onClick={onToggleAudio}
                className={`p-2 rounded-xl border flex items-center justify-between gap-2 text-[11px] font-bold transition-all cursor-pointer ${
                  isAudioActive
                    ? 'bg-purple-950/80 text-purple-300 border-purple-500 shadow-sm shadow-purple-500/20'
                    : 'bg-studio-900/70 text-studio-400 border-studio-800 hover:text-white hover:bg-studio-800'
                }`}
                title={lang === 'vi' ? 'Bật/Tắt âm thanh động cơ V6 Turbo Hybrid' : 'Toggle F1 V6 Turbo Hybrid engine sound'}
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  {isAudioActive ? (
                    <Volume2 className="w-3.5 h-3.5 shrink-0 text-purple-400 animate-pulse" />
                  ) : (
                    <VolumeX className="w-3.5 h-3.5 shrink-0 text-studio-400" />
                  )}
                  <span className="truncate">{lang === 'vi' ? 'Âm Động Cơ' : 'Engine Audio'}</span>
                </div>
                <span
                  className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${
                    isAudioActive ? 'bg-purple-500 text-black' : 'bg-studio-800 text-studio-400'
                  }`}
                >
                  {isAudioActive ? (lang === 'vi' ? 'BẬT' : 'ON') : (lang === 'vi' ? 'TẮT' : 'OFF')}
                </span>
              </button>

              {/* Rev Throttle Burst */}
              <button
                type="button"
                onClick={onRevEngine}
                className="p-2 rounded-xl border border-red-900/60 bg-red-950/50 hover:bg-f1red text-red-300 hover:text-white flex items-center justify-center gap-1.5 text-[11px] font-bold transition-all cursor-pointer shadow-sm group"
                title={lang === 'vi' ? 'Rồ ga nẹt pô động cơ V6 Turbo Hybrid (12,000 RPM)' : 'Throttle blip & rev V6 engine (12,000 RPM)'}
              >
                <Flame className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
                <span>{lang === 'vi' ? 'Gầm Máy F1' : 'Rev Engine'}</span>
              </button>
            </div>

            {/* 5. Mouse Wheel Mode & Zoom Step Controls */}
            <div className="pt-2 border-t border-studio-800/80 flex items-center justify-between gap-2">
              {/* Mouse Wheel Mode Segmented Switcher */}
              <div className="flex-1 flex flex-col gap-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-studio-400 flex items-center gap-1">
                  <MousePointer className="w-3 h-3 text-amber-400" />
                  {lang === 'vi' ? 'Chế độ lăn chuột:' : 'Wheel Mode:'}
                </span>
                <div className="inline-flex rounded-lg bg-studio-900 border border-studio-800 p-0.5 text-[10px] font-bold">
                  <button
                    type="button"
                    onClick={() => {
                      if (enableWheelZoom) onToggleWheelZoom();
                    }}
                    className={`flex-1 py-1 px-1.5 rounded-md transition-all text-center cursor-pointer ${
                      !enableWheelZoom
                        ? 'bg-amber-500 text-black shadow-sm font-black'
                        : 'text-studio-400 hover:text-white'
                    }`}
                    title={lang === 'vi' ? 'Lăn chuột cuộn trang web mượt mà (Mặc định)' : 'Mouse wheel scrolls web page'}
                  >
                    {lang === 'vi' ? 'Cuộn Trang' : 'Page Scroll'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!enableWheelZoom) onToggleWheelZoom();
                    }}
                    className={`flex-1 py-1 px-1.5 rounded-md transition-all text-center cursor-pointer ${
                      enableWheelZoom
                        ? 'bg-amber-500 text-black shadow-sm font-black'
                        : 'text-studio-400 hover:text-white'
                    }`}
                    title={lang === 'vi' ? 'Lăn chuột phóng to / thu nhỏ xe 3D' : 'Mouse wheel zooms 3D car'}
                  >
                    {lang === 'vi' ? 'Zoom 3D' : '3D Zoom'}
                  </button>
                </div>
              </div>

              {/* Direct Zoom In & Out Step Buttons */}
              <div className="flex flex-col gap-1 shrink-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-studio-400 text-right">
                  {lang === 'vi' ? 'Thu Phóng:' : 'Zoom Step:'}
                </span>
                <div className="inline-flex items-center rounded-lg bg-studio-900 border border-studio-800 p-0.5">
                  <button
                    type="button"
                    onClick={() => onZoom('in')}
                    className="p-1.5 text-studio-300 hover:text-white hover:bg-studio-800 rounded-md transition-colors cursor-pointer"
                    title={lang === 'vi' ? 'Phóng to (+)' : 'Zoom In (+)'}
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  <div className="w-[1px] h-4 bg-studio-800" />
                  <button
                    type="button"
                    onClick={() => onZoom('out')}
                    className="p-1.5 text-studio-300 hover:text-white hover:bg-studio-800 rounded-md transition-colors cursor-pointer"
                    title={lang === 'vi' ? 'Thu nhỏ (-)' : 'Zoom Out (-)'}
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
