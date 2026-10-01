import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNavigationStore } from '../../store/useNavigationStore';
import { t } from '../../i18n/translations';
import { TeamId } from '../../types';
import { Sparkles, Trophy, ArrowRight, Box } from 'lucide-react';
import { ConstructorLogo } from '../common/ConstructorLogo';

interface PosterCar {
  id: string;
  name: string; // Tên xe
  shortName: string;
  team: string; // Đội đua
  teamId: TeamId;
  watermark: string;
  color: string;
  imageUrl: string;
  drivers: string; // Thành viên đội đua
}

const POSTER_CARS: PosterCar[] = [
  {
    id: 'sf24',
    name: 'Ferrari SF-24',
    shortName: 'SF-24',
    team: 'Scuderia Ferrari HP',
    teamId: 'ferrari',
    watermark: 'FERRARI',
    color: '#dc0000',
    imageUrl: '/images/teams/sf24.jpg',
    drivers: 'Charles Leclerc #16 · Lewis Hamilton #44',
  },
  {
    id: 'mcl38',
    name: 'McLaren MCL38',
    shortName: 'MCL38',
    team: 'McLaren Formula 1 Team',
    teamId: 'mclaren',
    watermark: 'MCLAREN',
    color: '#ff8000',
    imageUrl: '/images/teams/mcl38.jpg',
    drivers: 'Lando Norris #4 · Oscar Piastri #81',
  },
  {
    id: 'rb20',
    name: 'Red Bull RB20',
    shortName: 'RB20',
    team: 'Oracle Red Bull Racing',
    teamId: 'redbull',
    watermark: 'RED BULL',
    color: '#050f26',
    imageUrl: '/images/teams/rb20.jpg',
    drivers: 'Max Verstappen #1 · Isack Hadjar #6',
  },
  {
    id: 'w15',
    name: 'Mercedes F1 W15',
    shortName: 'W15',
    team: 'Mercedes-AMG Petronas F1 Team',
    teamId: 'mercedes',
    watermark: 'MERCEDES',
    color: '#c8ccce',
    imageUrl: '/images/teams/w15.jpg',
    drivers: 'George Russell #63 · Kimi Antonelli #12',
  },
  {
    id: 'amr25',
    name: 'Aston Martin AMR25',
    shortName: 'AMR25',
    team: 'Aston Martin Aramco F1 Team',
    teamId: 'astonmartin',
    watermark: 'ASTON MARTIN',
    color: '#00594f',
    imageUrl: '/images/teams/astonmartin.jpg',
    drivers: 'Fernando Alonso #14 · Lance Stroll #18',
  },
  {
    id: 'a525',
    name: 'Alpine A525',
    shortName: 'A525',
    team: 'BWT Alpine Formula 1 Team',
    teamId: 'alpine',
    watermark: 'ALPINE',
    color: '#0090ff',
    imageUrl: '/images/teams/alpine.jpg',
    drivers: 'Pierre Gasly #10 · Franco Colapinto #43',
  },
  {
    id: 'vcarb02',
    name: 'Racing Bulls VCARB 02',
    shortName: 'VCARB 02',
    team: 'Visa Cash App RB F1 Team',
    teamId: 'racingbulls',
    watermark: 'RACING BULLS',
    color: '#1634cb',
    imageUrl: '/images/teams/racingbulls.jpg',
    drivers: 'Liam Lawson #30 · Arvid Lindblad #3',
  },
  {
    id: 'vf25',
    name: 'Haas VF-25',
    shortName: 'VF-25',
    team: 'MoneyGram Haas F1 Team',
    teamId: 'haas',
    watermark: 'HAAS',
    color: '#e5e7eb',
    imageUrl: '/images/teams/haas.jpg',
    drivers: 'Esteban Ocon #31 · Oliver Bearman #87',
  },
  {
    id: 'fw47',
    name: 'Williams FW47',
    shortName: 'FW47',
    team: 'Williams Racing',
    teamId: 'williams',
    watermark: 'WILLIAMS',
    color: '#002447',
    imageUrl: '/images/teams/williams.jpg',
    drivers: 'Carlos Sainz #55 · Alex Albon #23',
  },
  {
    id: 'c45',
    name: 'Audi F1 (Sauber C45)',
    shortName: 'C45',
    team: 'Audi Formula 1 Team',
    teamId: 'audi',
    watermark: 'AUDI F1',
    color: '#c4c8cc',
    imageUrl: '/images/teams/audi.jpg',
    drivers: 'Nico Hülkenberg #27 · Gabriel Bortoleto #5',
  },
  {
    id: 'cadillac-mac26',
    name: 'Cadillac MAC-26',
    shortName: 'CADILLAC',
    team: 'Cadillac Formula 1 Team',
    teamId: 'cadillac',
    watermark: 'CADILLAC',
    color: '#d4af37',
    imageUrl: '/images/teams/cadillac.jpg',
    drivers: 'Sergio Pérez #11 · Valtteri Bottas #77',
  },
];

export const FullscreenCarStage: React.FC = React.memo(() => {
  const { lang } = useNavigationStore();
  const navigate = useNavigate();
  const strings = t[lang].home;

  // Active expanded car index (default to null: show all 11 teams evenly)
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const isAnyActive = activeIndex !== null;

  return (
    <div className="relative w-full bg-[#050508] text-white pt-6 pb-10 overflow-hidden select-none border-b border-studio-800">
      {/* ── Top Header Controls & Badges ── */}
      <div className="page-container mb-6 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[11px] font-bold uppercase tracking-widest text-f1red">
            <span className="w-2 h-2 rounded-full bg-f1red animate-pulse" />
            <span>
              {lang === 'vi'
                ? 'F1 2026 GRID · 11 ĐỘI ĐUA CHÍNH THỨC'
                : 'F1 2026 GRID · 11 OFFICIAL CONSTRUCTORS'}
            </span>
          </div>

          <h1 className="font-display text-2xl sm:text-4xl font-black uppercase tracking-tight text-white leading-tight">
            {strings.heroTitle1} · {strings.heroTitle2}
          </h1>
        </div>

        {/* Action CTAs & Hint */}
        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          <span className="hidden xl:inline-block text-[11px] font-mono uppercase tracking-wider text-studio-400 mr-2">
            {lang === 'vi'
              ? '✦ Rê chuột để xem cận cảnh cỗ máy'
              : '✦ Hover a team to inspect machine'}
          </span>

          <button
            onClick={() => {
              navigate('/showroom');
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-f1red text-white text-xs font-bold uppercase tracking-wider hover:bg-f1red/90 shadow-lg hover:shadow-f1red/30 transition-all hover:scale-105 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{lang === 'vi' ? 'Khám Phá Showroom 3D' : 'Explore 3D Showroom'}</span>
          </button>

          <button
            onClick={() => {
              navigate('/season/2026');
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider border border-white/15 backdrop-blur-md transition-all cursor-pointer"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>{strings.viewStandings}</span>
          </button>
        </div>
      </div>

      {/* ── 11-Car Interactive Multi-Slice Poster Canvas ── */}
      <div className="page-container">
        <div
          onMouseLeave={() => setActiveIndex(null)}
          className="relative w-full h-[560px] sm:h-[640px] lg:h-[700px] rounded-3xl overflow-hidden bg-[#07070b] border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.9)] flex flex-row"
        >
          {POSTER_CARS.map((car, idx) => {
            const isExpanded = idx === activeIndex;

            return (
              <div
                key={car.id}
                onMouseEnter={() => setActiveIndex(idx)}
                onClick={() => {
                  setActiveIndex(activeIndex === idx ? null : idx);
                }}
                style={{
                  flex: isExpanded ? 12 : 1,
                  transition: 'flex 450ms cubic-bezier(0.25, 1, 0.5, 1)',
                }}
                className={`relative h-full overflow-hidden cursor-pointer select-none group border-r border-white/10 last:border-r-0 min-w-[28px] sm:min-w-[32px] ${
                  isExpanded ? 'z-20 shadow-2xl' : 'z-10 hover:brightness-125'
                }`}
              >
                {/* ── 1. COLLAPSED VIEW (SLICE / RIBBON STATE) ── */}
                <div
                  className={`absolute inset-0 flex flex-col justify-between items-center py-6 px-1 transition-opacity duration-300 pointer-events-none ${
                    isExpanded ? 'opacity-0 pointer-events-none' : 'opacity-100'
                  }`}
                >
                  {/* Background Sliced Image with Vignette */}
                  <img
                    src={car.imageUrl}
                    alt={car.name}
                    className={`absolute inset-0 w-full h-full object-cover object-center filter contrast-125 group-hover:scale-110 transition-all duration-700 ${
                      !isAnyActive
                        ? 'brightness-[0.45] group-hover:brightness-[0.7]'
                        : 'brightness-[0.35]'
                    }`}
                    loading="lazy"
                  />

                  {/* Gradient Overlay & Ambient Tint */}
                  <div
                    className="absolute inset-0 opacity-40 mix-blend-screen transition-opacity duration-300 group-hover:opacity-75"
                    style={{
                      background: `linear-gradient(to bottom, transparent 20%, ${car.color} 100%)`,
                    }}
                  />
                  <div
                    className={`absolute inset-0 transition-colors ${
                      !isAnyActive
                        ? 'bg-black/35 group-hover:bg-black/10'
                        : 'bg-black/40 group-hover:bg-black/10'
                    }`}
                  />

                  {/* Accent Line Indicator & Constructor Logo */}
                  <div className="z-10 flex flex-col items-center gap-2">
                    <div
                      className={`rounded-full shadow-sm transition-all duration-300 ${
                        !isAnyActive ? 'w-2 h-7 group-hover:h-10' : 'w-1.5 h-8 group-hover:h-12'
                      }`}
                      style={{ backgroundColor: car.color }}
                    />
                    <ConstructorLogo
                      teamId={car.teamId}
                      size="sm"
                      className={`transition-all ${
                        !isAnyActive
                          ? 'w-6 h-6 opacity-95 group-hover:scale-110'
                          : 'w-4 h-4 opacity-75 group-hover:opacity-100'
                      }`}
                    />
                  </div>

                  {/* Typography: When all 11 teams are showing evenly vs when squeezed */}
                  <div className="z-10 flex flex-col items-center justify-center flex-1 my-auto">
                    <span
                      className={`font-display font-black uppercase text-white/90 group-hover:text-white tracking-[0.2em] whitespace-nowrap [writing-mode:vertical-rl] rotate-180 transition-all duration-300 ${
                        !isAnyActive ? 'text-[14px] lg:text-[16px]' : 'text-[12px] lg:text-[13px]'
                      }`}
                      style={{
                        textShadow: '0 2px 10px rgba(0,0,0,0.85)',
                      }}
                    >
                      {car.shortName}
                    </span>
                  </div>

                  {/* Bottom Indicator & Driver badge when wide */}
                  <div className="z-10 flex flex-col items-center gap-1.5 pb-2">
                    {!isAnyActive && (
                      <span className="text-[10px] font-mono font-bold text-white/70 group-hover:text-white transition-colors">
                        {car.teamId.slice(0, 3).toUpperCase()}
                      </span>
                    )}
                    <span
                      className="w-2.5 h-2.5 rounded-full shadow-xs ring-2 ring-white/20 transition-transform group-hover:scale-125"
                      style={{ backgroundColor: car.color }}
                    />
                  </div>
                </div>

                {/* ── 2. EXPANDED VIEW (FULL CAR POSTER SHOWCASE) ── */}
                <div
                  className={`absolute inset-0 w-full h-full flex flex-col justify-between p-6 sm:p-10 transition-all duration-500 ${
                    isExpanded
                      ? 'opacity-100 pointer-events-auto delay-75 scale-100'
                      : 'opacity-0 pointer-events-none scale-98'
                  }`}
                >
                  {/* Ambient Livery Radial Glow Behind Active Car */}
                  <div
                    className="absolute inset-0 pointer-events-none opacity-30 transition-all duration-1000"
                    style={{
                      background: `radial-gradient(ellipse at 50% 50%, ${car.color} 0%, transparent 70%)`,
                    }}
                  />

                  {/* Huge Watermark Background Text */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden z-0">
                    <span className="font-display text-[12vw] font-black uppercase tracking-widest text-white/[0.04] whitespace-nowrap select-none">
                      {car.watermark}
                    </span>
                  </div>

                  {/* ── MASSIVE UNCROPPED FULL CAR PRESENTATION ── */}
                  <div className="relative z-10 w-full flex-1 flex items-center justify-center my-auto">
                    <div className="relative w-full h-[300px] sm:h-[390px] lg:h-[450px] flex items-center justify-center">
                      <img
                        src={car.imageUrl}
                        alt={car.name}
                        className="max-h-full max-w-full object-contain filter drop-shadow-[0_30px_45px_rgba(0,0,0,0.95)] hover:scale-102 transition-transform duration-500 ease-out"
                        loading="eager"
                      />

                      {/* Glowing Underfloor Light Floor Reflection */}
                      <div
                        className="absolute -bottom-6 w-3/4 h-12 rounded-full blur-2xl pointer-events-none opacity-50 transition-all duration-700"
                        style={{ backgroundColor: car.color }}
                      />
                    </div>
                  </div>

                  {/* Minimalist Bottom Bar: Chỉ đơn giản là Tên xe, Đội đua, và Thành viên đội đua */}
                  <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 sm:p-6 rounded-2xl border border-white/10 backdrop-blur-md">
                    <div className="space-y-1">
                      {/* Đội đua */}
                      <div className="flex items-center gap-2">
                        <ConstructorLogo teamId={car.teamId} size="sm" />
                        <span className="text-xs font-bold uppercase tracking-widest text-white/90">
                          {car.team}
                        </span>
                      </div>

                      {/* Tên xe */}
                      <h2 className="font-display text-3xl sm:text-5xl font-black uppercase tracking-tight text-white leading-none">
                        {car.name}
                      </h2>

                      {/* Thành viên của đội đua */}
                      <p className="text-xs sm:text-sm font-mono text-studio-300 font-medium pt-1">
                        {car.drivers}
                      </p>
                    </div>

                    {/* Nút vào Showroom 3D */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/showroom?team=${car.teamId}`);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-studio-950 hover:bg-white/90 text-xs font-black uppercase tracking-wider shadow-xl hover:scale-105 transition-all shrink-0 cursor-pointer"
                    >
                      <span>{lang === 'vi' ? `Xem Showroom 3D` : `View 3D Showroom`}</span>
                      <ArrowRight className="w-4 h-4 text-f1red" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});
