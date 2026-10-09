import React from 'react';
import { TeamId } from '../../types';

interface ConstructorLogoProps {
  teamId: TeamId;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  badgeMode?: boolean;
  lang?: 'vi' | 'en';
}

const TEAM_MARKS: Record<TeamId, { code: string; label: string; color: string }> = {
  ferrari: { code: 'FER', label: 'Ferrari', color: '#dc2626' },
  mclaren: { code: 'MCL', label: 'McLaren', color: '#ff8000' },
  redbull: { code: 'RBR', label: 'Red Bull Racing', color: '#2563eb' },
  mercedes: { code: 'MER', label: 'Mercedes', color: '#00a19c' },
  astonmartin: { code: 'AMR', label: 'Aston Martin', color: '#008c76' },
  alpine: { code: 'ALP', label: 'Alpine', color: '#2293d1' },
  racingbulls: { code: 'RB', label: 'Racing Bulls', color: '#4f46e5' },
  haas: { code: 'HAS', label: 'Haas', color: '#e5e7eb' },
  williams: { code: 'WIL', label: 'Williams', color: '#0891b2' },
  audi: { code: 'AUD', label: 'Audi', color: '#ef4444' },
  cadillac: { code: 'CAD', label: 'Cadillac', color: '#d4af37' },
};

const sizeMap = {
  sm: 'h-7 min-w-7 px-1 text-[8px]',
  md: 'h-9 min-w-9 px-1.5 text-[9px]',
  lg: 'h-12 min-w-12 px-2 text-[10px]',
  xl: 'h-16 min-w-16 px-2.5 text-xs',
};

export const ConstructorLogo: React.FC<ConstructorLogoProps> = ({
  teamId,
  className = '',
  size = 'md',
  showText = false,
  badgeMode = false,
  lang = 'vi',
}) => {
  const mark = TEAM_MARKS[teamId];
  const monogram = (
    <span
      aria-label={`${mark.label} text badge`}
      className={`${sizeMap[size]} relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white/20 bg-[#101116] font-display font-black italic tracking-[-0.04em] text-white shadow-lg`}
    >
      <span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-1"
        style={{ backgroundColor: mark.color }}
      />
      <span className="relative">{mark.code}</span>
    </span>
  );

  if (badgeMode) {
    return (
      <div
        className={`inline-flex items-center gap-2.5 rounded-xl border border-white/20 bg-black/80 px-3 py-1.5 shadow-xl backdrop-blur-md ${className}`}
      >
        {monogram}
        <div className="flex flex-col text-left">
          <span className="text-[9px] font-mono font-black uppercase tracking-wider text-amber-300">
            {lang === 'vi' ? 'HUY HIỆU PODIUM' : 'PODIUM BADGE'}
          </span>
          <span className="text-xs font-display font-black uppercase leading-tight tracking-wider text-white">
            {mark.label}
          </span>
        </div>
      </div>
    );
  }

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      {monogram}
      {showText && (
        <span className="font-display text-xs font-black uppercase tracking-wide text-white sm:text-sm">
          {mark.label}
        </span>
      )}
    </span>
  );
};
