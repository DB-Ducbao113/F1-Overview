import React from 'react';
import { MousePointer, ZoomIn, ZoomOut, RotateCcw, Play, Pause } from 'lucide-react';

interface ShowroomQuickHUDProps {
  enableWheelZoom: boolean;
  onToggleWheelZoom: () => void;
  onZoom: (direction: 'in' | 'out') => void;
  onResetView: () => void;
  autoRotate: boolean;
  onToggleAutoRotate: () => void;
  lang: 'vi' | 'en';
}

/**
 * ShowroomQuickHUD — Prominent, convenient 3D viewport control bar
 * Placed directly at the bottom-center of the 3D canvas stage for immediate access.
 * Gives 1-click toggling between Page Scroll and 3D Zoom, plus direct +/- zoom buttons.
 */
export const ShowroomQuickHUD: React.FC<ShowroomQuickHUDProps> = React.memo(
  ({
    enableWheelZoom,
    onToggleWheelZoom,
    onZoom,
    onResetView,
    autoRotate,
    onToggleAutoRotate,
    lang,
  }) => {
    return (
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 pointer-events-auto">
        <div className="flex items-center gap-1.5 sm:gap-2.5 p-1.5 sm:p-2 rounded-2xl bg-studio-950/85 backdrop-blur-xl border border-studio-800/90 shadow-2xl shadow-black/80 text-white select-none">
          {/* ── 1. Wheel Mode Segmented Toggle ── */}
          <div className="flex items-center bg-studio-900/90 rounded-xl p-1 border border-studio-800 gap-1">
            <div className="hidden md:flex items-center gap-1.5 px-2 text-[10px] font-black uppercase tracking-wider text-studio-400">
              <MousePointer className="w-3.5 h-3.5 text-amber-400" />
              <span>{lang === 'vi' ? 'Lăn Chuột:' : 'Wheel:'}</span>
            </div>

            {/* Page Scroll Mode Button */}
            <button
              type="button"
              onClick={() => {
                if (enableWheelZoom) onToggleWheelZoom();
              }}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                !enableWheelZoom
                  ? 'bg-studio-800 text-white border border-studio-700 shadow-sm'
                  : 'text-studio-400 hover:text-white hover:bg-studio-800/50'
              }`}
              title={
                lang === 'vi'
                  ? 'Chế độ cuộn trang: Lăn chuột để cuộn xem hồ sơ kỹ thuật bên dưới'
                  : 'Page Scroll: Mouse wheel scrolls the web page down to the dossier'
              }
            >
              <span>{lang === 'vi' ? 'Cuộn Trang' : 'Page Scroll'}</span>
              {!enableWheelZoom && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
              )}
            </button>

            {/* 3D Zoom Mode Button */}
            <button
              type="button"
              onClick={() => {
                if (!enableWheelZoom) onToggleWheelZoom();
              }}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                enableWheelZoom
                  ? 'bg-amber-500 text-black border border-amber-400 shadow-md shadow-amber-500/20 font-black'
                  : 'text-studio-400 hover:text-white hover:bg-studio-800/50'
              }`}
              title={
                lang === 'vi'
                  ? 'Chế độ Zoom 3D: Lăn chuột để phóng to / thu nhỏ xe F1'
                  : '3D Zoom: Mouse wheel zooms the F1 car in/out'
              }
            >
              <span>{lang === 'vi' ? 'Zoom 3D' : '3D Zoom'}</span>
              {enableWheelZoom && (
                <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse ml-0.5" />
              )}
            </button>
          </div>

          {/* Divider */}
          <div className="w-[1px] h-6 bg-studio-800/90 hidden sm:block" />

          {/* ── 2. Direct Zoom In & Out Step Buttons ── */}
          <div className="flex items-center bg-studio-900/90 rounded-xl p-1 border border-studio-800 gap-0.5">
            <button
              type="button"
              onClick={() => onZoom('out')}
              className="p-1.5 text-studio-300 hover:text-white hover:bg-studio-800 rounded-lg transition-colors cursor-pointer"
              title={lang === 'vi' ? 'Thu nhỏ xe (-)' : 'Zoom Out (-)'}
              aria-label={lang === 'vi' ? 'Thu nhỏ xe' : 'Zoom Out'}
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <div className="w-[1px] h-4 bg-studio-800" />
            <button
              type="button"
              onClick={() => onZoom('in')}
              className="p-1.5 text-studio-300 hover:text-white hover:bg-studio-800 rounded-lg transition-colors cursor-pointer"
              title={lang === 'vi' ? 'Phóng to xe (+)' : 'Zoom In (+)'}
              aria-label={lang === 'vi' ? 'Phóng to xe' : 'Zoom In'}
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Divider */}
          <div className="w-[1px] h-6 bg-studio-800/90 hidden sm:block" />

          {/* ── 3. Quick Action Buttons: Auto-Rotate & Reset ── */}
          <div className="flex items-center gap-1">
            {/* Auto-Rotate 360 */}
            <button
              type="button"
              onClick={onToggleAutoRotate}
              className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border flex items-center gap-1.5 text-[11px] font-bold transition-all cursor-pointer ${
                autoRotate
                  ? 'bg-sky-500/20 text-sky-300 border-sky-500/60 shadow-sm'
                  : 'bg-studio-900/90 text-studio-400 border-studio-800 hover:text-white hover:bg-studio-800'
              }`}
              title={
                autoRotate
                  ? lang === 'vi'
                    ? 'Tạm dừng tự xoay 360°'
                    : 'Pause 360° rotation'
                  : lang === 'vi'
                    ? 'Bật tự xoay 360°'
                    : 'Start 360° rotation'
              }
              aria-label={lang === 'vi' ? 'Tự xoay 360°' : '360° Auto-Rotate'}
            >
              {autoRotate ? (
                <Pause className="w-3.5 h-3.5 text-sky-400" />
              ) : (
                <Play className="w-3.5 h-3.5" />
              )}
              <span className="hidden md:inline">{lang === 'vi' ? '360°' : '360°'}</span>
            </button>

            {/* Reset to Default Orbit View */}
            <button
              type="button"
              onClick={onResetView}
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-studio-900/90 text-studio-400 hover:text-white hover:bg-studio-800 border border-studio-800 flex items-center gap-1.5 text-[11px] font-bold transition-all cursor-pointer"
              title={lang === 'vi' ? 'Đặt lại góc nhìn mặc định' : 'Reset to default camera view'}
              aria-label={lang === 'vi' ? 'Đặt lại góc nhìn' : 'Reset View'}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{lang === 'vi' ? 'Mặc Định' : 'Reset'}</span>
            </button>
          </div>
        </div>
      </div>
    );
  },
);
