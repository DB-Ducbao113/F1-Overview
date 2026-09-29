import React from 'react';
import { HotspotItem, F1_HOTSPOTS } from '../../data/showroom/hotspotsData';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Gauge,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

interface HotspotDetailsModalProps {
  hotspot: HotspotItem | null;
  onClose: () => void;
  onSelectHotspot: (hotspot: HotspotItem) => void;
  lang: 'vi' | 'en';
}

export const HotspotDetailsModal: React.FC<HotspotDetailsModalProps> = ({
  hotspot,
  onClose,
  onSelectHotspot,
  lang,
}) => {
  if (!hotspot) return null;

  const currentIndex = F1_HOTSPOTS.findIndex((h) => h.id === hotspot.id);
  const prevHotspot = F1_HOTSPOTS[(currentIndex - 1 + F1_HOTSPOTS.length) % F1_HOTSPOTS.length];
  const nextHotspot = F1_HOTSPOTS[(currentIndex + 1) % F1_HOTSPOTS.length];

  return (
    <aside
      className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-studio-950/95 text-white backdrop-blur-xl border-l border-studio-800 shadow-2xl flex flex-col transition-all duration-300 animate-slide-left overflow-hidden"
      aria-label="F1 Technical Hotspot Visualizer"
    >
      {/* ── Top Bar Header ── */}
      <div className="p-4 sm:p-5 border-b border-studio-800/80 flex items-center justify-between gap-3 bg-studio-900/60">
        <div className="flex items-center gap-2.5">
          <span className="w-7 h-7 rounded-lg bg-f1red flex items-center justify-center font-display text-xs font-black text-white shadow-md">
            {currentIndex + 1}
          </span>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-f1red">
              {lang === 'vi' ? hotspot.categoryVi : hotspot.categoryEn}
            </span>
            <h3 className="font-display text-base sm:text-lg font-bold uppercase tracking-wide text-white leading-tight">
              {lang === 'vi' ? hotspot.nameVi : hotspot.nameEn}
            </h3>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-2 rounded-xl bg-studio-800/60 hover:bg-studio-700/80 text-studio-400 hover:text-white transition-colors"
          title={lang === 'vi' ? 'Đóng & Reset Camera' : 'Close & Reset Camera'}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* ── Scrollable Technical Body ── */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 custom-scrollbar">
        {/* Component AI-generated high-tech illustration */}
        <div className="relative rounded-2xl overflow-hidden border border-studio-700/60 shadow-xl group bg-black/40">
          <img
            src={hotspot.imageUrl}
            alt={lang === 'vi' ? hotspot.nameVi : hotspot.nameEn}
            className="w-full aspect-video object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-studio-950 via-transparent to-transparent opacity-80" />
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-studio-300 font-medium">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-studio-900/80 backdrop-blur-md border border-studio-700/60 text-[11px] font-bold text-emerald-400">
              <Sparkles className="w-3 h-3" />
              {lang === 'vi' ? 'Bản vẽ kỹ thuật 8K' : '8K Technical Schematic'}
            </span>
            <span className="text-[11px] text-studio-400">
              Hotspot #{currentIndex + 1} / {F1_HOTSPOTS.length}
            </span>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="p-3.5 rounded-xl bg-studio-900/80 border border-studio-800">
          <p className="text-xs sm:text-sm text-studio-300 leading-relaxed font-medium">
            {lang === 'vi' ? hotspot.summaryVi : hotspot.summaryEn}
          </p>
        </div>

        {/* Detailed Engineering Explanation */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-studio-400 flex items-center gap-1.5">
            <Gauge className="w-3.5 h-3.5 text-f1red" />
            {lang === 'vi' ? 'Nguyên Lý Khí Động & Hoạt Động' : 'Engineering Principle & Aero'}
          </h4>
          <p className="text-xs sm:text-sm text-studio-300 leading-relaxed font-normal">
            {lang === 'vi' ? hotspot.descriptionVi : hotspot.descriptionEn}
          </p>
        </div>

        {/* Key Technical Specifications Table */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-studio-400 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            {lang === 'vi' ? 'Thông Số Kỹ Thuật (FIA Regulation)' : 'Technical Specifications'}
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {hotspot.specs.map((spec, i) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-studio-900/60 border border-studio-800/80 space-y-1"
              >
                <span className="text-[10px] uppercase font-bold text-studio-400 block truncate">
                  {lang === 'vi' ? spec.labelVi : spec.labelEn}
                </span>
                <span className="text-xs sm:text-sm font-black text-white block">{spec.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Key Highlights Bullet Points */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-studio-400">
            {lang === 'vi' ? 'Điểm Nhấn Công Nghệ' : 'Engineering Highlights'}
          </h4>
          <ul className="space-y-2">
            {(lang === 'vi' ? hotspot.highlightsVi : hotspot.highlightsEn).map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-studio-300">
                <CheckCircle2 className="w-4 h-4 text-f1red shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── Bottom Navigation Controls ── */}
      <div className="p-4 border-t border-studio-800/80 bg-studio-900/80 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => onSelectHotspot(prevHotspot)}
          className="flex-1 py-2.5 px-3 rounded-xl bg-studio-800 hover:bg-studio-700 text-xs font-bold text-studio-200 hover:text-white transition-colors flex items-center justify-center gap-1.5"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>{lang === 'vi' ? 'Linh kiện trước' : 'Previous'}</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectHotspot(nextHotspot)}
          className="flex-1 py-2.5 px-3 rounded-xl bg-f1red hover:bg-f1red/90 text-xs font-bold text-white transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-f1red/20"
        >
          <span>{lang === 'vi' ? 'Linh kiện tiếp' : 'Next'}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
