import React from 'react';
import { TeamId } from '../../types';
import { TEAMS_DATA } from '../../data/teams';
import { Palette, Check } from 'lucide-react';
import { getTeam3DLivery } from '../../data/showroom/teamLiveries';
import { ConstructorLogo } from '../common/ConstructorLogo';

interface LiverySelectorProps {
  selectedTeamId: TeamId;
  onSelectTeam: (teamId: TeamId) => void;
  lang: 'vi' | 'en';
}

const TEAMS_LIST: { id: TeamId; name: string }[] = [
  { id: 'mclaren', name: 'McLaren' },
  { id: 'ferrari', name: 'Ferrari' },
  { id: 'redbull', name: 'Red Bull' },
  { id: 'mercedes', name: 'Mercedes' },
  { id: 'astonmartin', name: 'Aston Martin' },
  { id: 'alpine', name: 'Alpine' },
  { id: 'racingbulls', name: 'Racing Bulls' },
  { id: 'haas', name: 'Haas' },
  { id: 'williams', name: 'Williams' },
  { id: 'audi', name: 'Audi' },
  { id: 'cadillac', name: 'Cadillac' },
];

export const LiverySelector: React.FC<LiverySelectorProps> = React.memo(
  ({ selectedTeamId, onSelectTeam, lang }) => {
    const currentLivery = getTeam3DLivery(selectedTeamId);

    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs text-studio-400 font-bold uppercase tracking-wider px-1">
          <span className="flex items-center gap-1.5 text-white">
            <Palette className="w-3.5 h-3.5 text-f1red" />
            {lang === 'vi' ? 'Chọn Đội Đua (11 Mẫu Tem 2026)' : 'Constructor Liveries'}
          </span>
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full shadow-xs"
              style={{ backgroundColor: currentLivery.bodyColor }}
            />
            <span className="text-[11px] text-white font-bold truncate max-w-[200px] sm:max-w-xs font-mono">
              {currentLivery.fullName} · {currentLivery.carModelName}
            </span>
          </div>
        </div>

        {/* Horizontal Scrollable Constructor Cards */}
        <div className="flex items-center gap-2 overflow-x-auto py-1 px-1 custom-scrollbar">
          {TEAMS_LIST.map(({ id, name }) => {
            const team = TEAMS_DATA[id];
            const isSelected = selectedTeamId === id;

            return (
              <button
                key={id}
                type="button"
                onClick={() => onSelectTeam(id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200 shrink-0 border cursor-pointer ${
                  isSelected
                    ? 'bg-studio-900 text-white border-white/80 ring-2 ring-f1red shadow-xl scale-105'
                    : 'bg-studio-950/80 text-studio-300 border-studio-800/80 hover:bg-studio-900 hover:text-white hover:border-studio-700'
                }`}
              >
                {/* Official Team Logo Emblem */}
                <ConstructorLogo teamId={id} size="sm" className="w-5 h-5 shrink-0" />

                {/* Color swatch circle with split accent */}
                <span
                  className="w-3.5 h-3.5 rounded-full border border-black/40 shrink-0 relative overflow-hidden"
                  style={{ backgroundColor: team.primaryColor }}
                >
                  <span
                    className="absolute inset-y-0 right-0 w-1/2"
                    style={{ backgroundColor: team.accentColor || team.primaryColor }}
                  />
                </span>

                <span>{name}</span>

                {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400 ml-0.5" />}
              </button>
            );
          })}
        </div>
      </div>
    );
  },
);
