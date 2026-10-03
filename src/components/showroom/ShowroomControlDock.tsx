import React, { useState } from 'react';
import { CameraPreset } from './CameraController';
import {
  RotateCcw,
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
  Sparkles,
  Flame,
  Award,
  Camera,
} from 'lucide-react';

export type StudioLightingMode = 'studio';

interface ShowroomControlDockProps {
  cameraPreset: CameraPreset | null;
  onSelectPreset: (preset: CameraPreset) => void;
  autoRotate: boolean;
  onToggleAutoRotate: () => void;
  enableWheelZoom: boolean;
  onToggleWheelZoom: () => void;
  onZoom: (direction: 'in' | 'out') => void;
  onResetView: () => void;
  lang: 'vi' | 'en';
  // Audio Controls
  isAudioActive: boolean;
  onToggleAudio: () => void;
  onRevEngine: () => void;
  // Studio Lighting Mode
  lightingMode?: StudioLightingMode;
  onChangeLightingMode?: (mode: StudioLightingMode) => void;
  // Sponsor Decals
  showSponsors?: boolean;
  onToggleSponsors?: () => void;
  // Interactive Hotspots
  showHotspots?: boolean;
  onToggleHotspots?: () => void;
}

export const ShowroomControlDock: React.FC<ShowroomControlDockProps> = React.memo(
  ({
    cameraPreset,
    onSelectPreset,
    autoRotate,
    onToggleAutoRotate,
    enableWheelZoom,
    onToggleWheelZoom,
    onZoom,
    onResetView,
    lang,
    isAudioActive,
    onToggleAudio,
    onRevEngine,
    lightingMode: _lightingMode = 'studio',
    showSponsors = true,
    onToggleSponsors,
    showHotspots = false,
    onToggleHotspots,
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

    return (
      <div className="flex flex-col items-end gap-2 pointer-events-auto">
        {/* ── Main Floating Control Deck ── */}
        <div className="rounded-2xl bg-studio-950/90 backdrop-blur-2xl border border-studio-800 shadow-2xl p-2 sm:p-3 text-white max-w-[290px] xs:max-w-xs sm:max-w-md w-full transition-all">
          {/* Header: Title & Collapse Button */}
          <div className="flex items-center justify-between pb-1.5 sm:pb-2 border-b border-studio-800/80 mb-1.5 sm:mb-2">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-f1red animate-pulse" />
              <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-studio-300 flex items-center gap-1 sm:gap-1.5">
                <Settings2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-f1red" />
                {lang === 'vi' ? 'Điều Khiển 3D' : '3D Control Deck'}
              </span>
            </div>

            <div className="flex items-center gap-1">
              {/* Quick Reset Button */}
              <button
                type="button"
                onClick={onResetView}
                className="p-1 rounded-md text-studio-400 hover:text-white hover:bg-studio-800 transition-colors cursor-pointer min-w-[28px] min-h-[28px] flex items-center justify-center"
                aria-label={lang === 'vi' ? 'Đặt lại góc nhìn mặc định' : 'Reset to default view'}
              >
                <RotateCcw className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </button>

              {/* Minimize / Expand Toggle */}
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1 rounded-md text-studio-400 hover:text-white hover:bg-studio-800 transition-colors cursor-pointer min-w-[28px] min-h-[28px] flex items-center justify-center"
                aria-label={
                  isExpanded
                    ? lang === 'vi'
                      ? 'Thu gọn'
                      : 'Collapse'
                    : lang === 'vi'
                      ? 'Mở rộng'
                      : 'Expand'
                }
              >
                {isExpanded ? (
                  <ChevronUp className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                ) : (
                  <ChevronDown className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                )}
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

              {/* 2. Studio Lighting Environment (Studio W15 Dedicated Photoshoot Stage) */}
              <div className="pt-2 border-t border-studio-800/80">
                <div className="text-[10px] font-bold uppercase tracking-wider text-studio-400 mb-1.5 flex items-center justify-between">
                  <span>{lang === 'vi' ? 'Ánh sáng trường quay:' : 'Studio Lighting:'}</span>
                  <span className="text-amber-400 font-mono text-[9px] uppercase flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                    STUDIO W15 SPEC
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-gradient-to-r from-studio-900/90 to-studio-950/90 border border-studio-800/90 flex items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
                      <Camera className="w-3.5 h-3.5 text-amber-400" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-[11px] font-bold text-white truncate">
                        {lang === 'vi' ? 'Studio W15 Photoshoot' : 'Studio W15 Photoshoot'}
                      </h4>
                      <p className="text-[9px] text-studio-400 truncate">
                        {lang === 'vi'
                          ? 'Dàn Softbox trần & Vách cong vô cực 5600K'
                          : 'Overhead Softbox rig & Cyclorama 5600K'}
                      </p>
                    </div>
                  </div>
                  <span className="shrink-0 text-[9px] font-black uppercase px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    {lang === 'vi' ? 'CHUẨN STUDIO' : 'CALIBRATED'}
                  </span>
                </div>
              </div>

              {/* 3. Official Sponsor Decals on 3D Car */}
              {onToggleSponsors && (
                <div className="pt-2 border-t border-studio-800/80">
                  <button
                    type="button"
                    onClick={onToggleSponsors}
                    className={`w-full p-2 rounded-xl border flex items-center justify-between gap-2 text-[11px] font-bold transition-all cursor-pointer ${
                      showSponsors
                        ? 'bg-amber-950/80 text-amber-300 border-amber-500 shadow-sm shadow-amber-500/20'
                        : 'bg-studio-900/70 text-studio-400 border-studio-800 hover:text-white hover:bg-studio-800'
                    }`}
                    aria-label={
                      lang === 'vi'
                        ? 'Bật/Tắt thiết kế tem tài trợ thực tế trên xe 3D'
                        : 'Toggle Official Sponsor Liveries'
                    }
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      <Award
                        className={`w-3.5 h-3.5 shrink-0 ${showSponsors ? 'text-amber-400' : 'text-studio-400'}`}
                      />
                      <span className="truncate">
                        {lang === 'vi' ? 'Tem Tài Trợ Xe' : 'Sponsor Liveries'}
                      </span>
                    </div>
                    <span
                      className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                        showSponsors ? 'bg-amber-500 text-black' : 'bg-studio-800 text-studio-400'
                      }`}
                    >
                      {showSponsors
                        ? lang === 'vi'
                          ? 'BẬT'
                          : 'ON'
                        : lang === 'vi'
                          ? 'TẮT'
                          : 'OFF'}
                    </span>
                  </button>
                </div>
              )}

              {/* 4. Interactive Hotspots (Điểm kỹ thuật) */}
              {onToggleHotspots && (
                <div className="pt-2 border-t border-studio-800/80">
                  <button
                    type="button"
                    onClick={onToggleHotspots}
                    className={`w-full p-2 rounded-xl border flex items-center justify-between gap-2 text-[11px] font-bold transition-all cursor-pointer ${
                      showHotspots
                        ? 'bg-f1red/20 text-red-200 border-f1red shadow-sm shadow-f1red/20'
                        : 'bg-studio-900/70 text-studio-400 border-studio-800 hover:text-white hover:bg-studio-800'
                    }`}
                    aria-label={
                      lang === 'vi'
                        ? 'Bật/Tắt các điểm kỹ thuật tương tác trên xe 3D'
                        : 'Toggle Interactive Hotspots'
                    }
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      <Crosshair
                        className={`w-3.5 h-3.5 shrink-0 ${showHotspots ? 'text-f1red' : 'text-studio-400'}`}
                      />
                      <span className="truncate">
                        {lang === 'vi' ? 'Điểm Kỹ Thuật (Hotspots)' : 'Engineering Hotspots'}
                      </span>
                    </div>
                    <span
                      className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                        showHotspots ? 'bg-f1red text-white' : 'bg-studio-800 text-studio-400'
                      }`}
                    >
                      {showHotspots
                        ? lang === 'vi'
                          ? 'HIỂN THỊ'
                          : 'SHOW'
                        : lang === 'vi'
                          ? 'ẨN'
                          : 'HIDE'}
                    </span>
                  </button>
                </div>
              )}

              {/* 4. Auto-Rotate 360 Toggle */}
              <div className="pt-2 border-t border-studio-800/80">
                <button
                  type="button"
                  onClick={onToggleAutoRotate}
                  className={`w-full p-2 rounded-xl border flex items-center justify-between gap-2 text-[11px] font-bold transition-all cursor-pointer ${
                    autoRotate
                      ? 'bg-sky-950/80 text-sky-300 border-sky-500 shadow-sm shadow-sky-500/20'
                      : 'bg-studio-900/70 text-studio-400 border-studio-800 hover:text-white hover:bg-studio-800'
                  }`}
                  aria-label={
                    lang === 'vi' ? 'Bật/Tắt chế độ tự xoay xe 360 độ' : 'Toggle 360 Auto-Rotation'
                  }
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    {autoRotate ? (
                      <Pause className="w-3.5 h-3.5 shrink-0 text-sky-400" />
                    ) : (
                      <Play className="w-3.5 h-3.5 shrink-0 text-studio-400" />
                    )}
                    <span className="truncate">
                      {lang === 'vi' ? 'Tự Xoay Xe 360°' : '360° Auto-Rotation'}
                    </span>
                  </div>
                  <span
                    className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                      autoRotate ? 'bg-sky-500 text-black' : 'bg-studio-800 text-studio-400'
                    }`}
                  >
                    {autoRotate ? (lang === 'vi' ? 'CHẠY' : 'ON') : lang === 'vi' ? 'DỪNG' : 'OFF'}
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
                  aria-label={
                    lang === 'vi'
                      ? 'Bật/Tắt âm thanh động cơ V6 Turbo Hybrid'
                      : 'Toggle F1 V6 Turbo Hybrid engine sound'
                  }
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    {isAudioActive ? (
                      <Volume2 className="w-3.5 h-3.5 shrink-0 text-purple-400 animate-pulse" />
                    ) : (
                      <VolumeX className="w-3.5 h-3.5 shrink-0 text-studio-400" />
                    )}
                    <span className="truncate">
                      {lang === 'vi' ? 'Âm Động Cơ' : 'Engine Audio'}
                    </span>
                  </div>
                  <span
                    className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${
                      isAudioActive ? 'bg-purple-500 text-black' : 'bg-studio-800 text-studio-400'
                    }`}
                  >
                    {isAudioActive ? (lang === 'vi' ? 'BẬT' : 'ON') : lang === 'vi' ? 'TẮT' : 'OFF'}
                  </span>
                </button>

                {/* Rev Throttle Burst */}
                <button
                  type="button"
                  onClick={onRevEngine}
                  className="p-2 rounded-xl border border-red-900/60 bg-red-950/50 hover:bg-f1red text-red-300 hover:text-white flex items-center justify-center gap-1.5 text-[11px] font-bold transition-all cursor-pointer shadow-sm group"
                  aria-label={
                    lang === 'vi'
                      ? 'Rồ ga nẹt pô động cơ V6 Turbo Hybrid (12,000 RPM)'
                      : 'Throttle blip & rev V6 engine (12,000 RPM)'
                  }
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
                      aria-label={
                        lang === 'vi'
                          ? 'Lăn chuột cuộn trang web mượt mà (Mặc định)'
                          : 'Mouse wheel scrolls web page'
                      }
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
                      aria-label={
                        lang === 'vi'
                          ? 'Lăn chuột phóng to / thu nhỏ xe 3D'
                          : 'Mouse wheel zooms 3D car'
                      }
                    >
                      {lang === 'vi' ? 'Zoom 3D' : '3D Zoom'}
                    </button>
                  </div>
                  <p className="text-[9px] text-studio-500 font-medium">
                    ✦{' '}
                    {lang === 'vi'
                      ? 'Đổi nhanh tại thanh đáy màn hình 3D'
                      : 'Quick toggle on bottom 3D HUD'}
                  </p>
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
                      aria-label={lang === 'vi' ? 'Phóng to (+)' : 'Zoom In (+)'}
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                    </button>
                    <div className="w-[1px] h-4 bg-studio-800" />
                    <button
                      type="button"
                      onClick={() => onZoom('out')}
                      className="p-1.5 text-studio-300 hover:text-white hover:bg-studio-800 rounded-md transition-colors cursor-pointer"
                      aria-label={lang === 'vi' ? 'Thu nhỏ (-)' : 'Zoom Out (-)'}
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
  },
);
