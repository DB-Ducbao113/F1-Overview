import React from 'react';
import { F1_HOTSPOTS, HotspotItem } from '../../data/showroom/hotspotsData';
import { TeamId } from '../../types';
import { getTeam3DLivery } from '../../data/showroom/teamLiveries';
import { Sparkles, Camera } from 'lucide-react';

interface HotspotSelectorBarProps {
  activeHotspot: HotspotItem | null;
  onSelectHotspot: (hotspot: HotspotItem) => void;
  teamId: TeamId;
  lang: 'vi' | 'en';
}

export const HotspotSelectorBar: React.FC<HotspotSelectorBarProps> = React.memo(
  ({ activeHotspot, onSelectHotspot, teamId, lang }) => {
    const livery = getTeam3DLivery(teamId);

    return (
      <div className="w-full bg-studio-950/95 backdrop-blur-xl border-t border-b border-studio-800/80 py-3 px-3 sm:px-6 shadow-xl z-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Section Title & Hint */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-xl bg-f1red/10 border border-f1red/30 flex items-center justify-center text-f1red">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-amber-300 font-bold flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  {lang === 'vi' ? '6 LINH KIỆN KỸ THUẬT' : '6 TECHNICAL COMPONENTS'}
                </span>
                <span
                  className="w-2 h-2 rounded-full shadow-xs"
                  style={{ backgroundColor: livery.bodyColor }}
                />
              </div>
              <h3 className="font-display text-xs sm:text-sm font-black uppercase text-white tracking-wide">
                {lang === 'vi'
                  ? `Soi Chi Tiết Mẫu Xe ${livery.shortCarName}`
                  : `Inspect ${livery.shortCarName} Parts`}
              </h3>
            </div>
          </div>

          {/* 6 Component Tabs Grid / Strip */}
          <div className="flex items-center gap-2 overflow-x-auto py-1 custom-scrollbar">
            {F1_HOTSPOTS.map((h, i) => {
              const isSelected = activeHotspot?.id === h.id;

              return (
                <button
                  key={h.id}
                  type="button"
                  onClick={() => onSelectHotspot(h)}
                  className={`flex items-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all duration-200 shrink-0 border cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-f1red to-red-700 text-white border-white/60 shadow-lg shadow-f1red/30 scale-105'
                      : 'bg-studio-900/90 text-studio-300 border-studio-800 hover:bg-studio-850 hover:text-white hover:border-studio-700'
                  }`}
                  aria-label={lang === 'vi' ? `Xem cận cảnh ${h.nameVi}` : `Inspect ${h.nameEn}`}
                >
                  {/* Number Badge */}
                  <span
                    className={`w-5 h-5 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0 ${
                      isSelected ? 'bg-white text-f1red shadow-sm' : 'bg-studio-800 text-studio-300'
                    }`}
                  >
                    {i + 1}
                  </span>

                  {/* Name */}
                  <span className="whitespace-nowrap">{lang === 'vi' ? h.nameVi : h.nameEn}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  },
);
