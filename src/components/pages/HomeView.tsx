import React, { useState } from 'react';
import { useCarStore } from '../../store/useCarStore';
import { CARS_DATA } from '../../data/cars';
import { CarId } from '../../types';
import { t } from '../../i18n/translations';
import {
  ArrowRight,
  Zap,
  Gauge,
  Wind,
  Shield,
  Camera,
  Layers,
  Trophy,
  Medal,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

const fmt = (n: number) => n.toLocaleString('en-US');

// 11 Official teams in championship order
const ALL_11_TEAMS: CarId[] = [
  'sf24',
  'mcl38',
  'rb20',
  'w15',
  'astonmartin',
  'alpine',
  'racingbulls',
  'haas',
  'williams',
  'audi',
  'cadillac',
];

// Official 2025/2026 Drivers Championship Live Standings (22 Drivers)
interface DriverStanding {
  rank: number;
  driverName: string;
  driverNumber: string;
  country: string;
  team: string;
  carId: CarId;
  points: number;
  wins: number;
  podiums: number;
  accentColor: string;
}

const DRIVER_STANDINGS: DriverStanding[] = [
  { rank: 1, driverName: 'Max Verstappen', driverNumber: '#1', country: 'NED', team: 'Red Bull Racing', carId: 'rb20', points: 395, wins: 8, podiums: 14, accentColor: '#0600ef' },
  { rank: 2, driverName: 'Lando Norris', driverNumber: '#4', country: 'GBR', team: 'McLaren F1 Team', carId: 'mcl38', points: 370, wins: 6, podiums: 13, accentColor: '#ff8000' },
  { rank: 3, driverName: 'Charles Leclerc', driverNumber: '#16', country: 'MON', team: 'Scuderia Ferrari HP', carId: 'sf24', points: 340, wins: 5, podiums: 12, accentColor: '#e80020' },
  { rank: 4, driverName: 'Oscar Piastri', driverNumber: '#81', country: 'AUS', team: 'McLaren F1 Team', carId: 'mcl38', points: 295, wins: 2, podiums: 9, accentColor: '#ff8000' },
  { rank: 5, driverName: 'Lewis Hamilton', driverNumber: '#44', country: 'GBR', team: 'Scuderia Ferrari HP', carId: 'sf24', points: 265, wins: 2, podiums: 7, accentColor: '#e80020' },
  { rank: 6, driverName: 'George Russell', driverNumber: '#63', country: 'GBR', team: 'Mercedes-AMG F1', carId: 'w15', points: 240, wins: 1, podiums: 6, accentColor: '#00a19c' },
  { rank: 7, driverName: 'Carlos Sainz', driverNumber: '#55', country: 'ESP', team: 'Williams Racing', carId: 'williams', points: 165, wins: 0, podiums: 4, accentColor: '#00a0de' },
  { rank: 8, driverName: 'Fernando Alonso', driverNumber: '#14', country: 'ESP', team: 'Aston Martin F1', carId: 'astonmartin', points: 110, wins: 0, podiums: 2, accentColor: '#229971' },
  { rank: 9, driverName: 'Kimi Antonelli', driverNumber: '#12', country: 'ITA', team: 'Mercedes-AMG F1', carId: 'w15', points: 95, wins: 0, podiums: 1, accentColor: '#00a19c' },
  { rank: 10, driverName: 'Alexander Albon', driverNumber: '#23', country: 'THA', team: 'Williams Racing', carId: 'williams', points: 72, wins: 0, podiums: 1, accentColor: '#00a0de' },
  { rank: 11, driverName: 'Pierre Gasly', driverNumber: '#10', country: 'FRA', team: 'Alpine F1 Team', carId: 'alpine', points: 54, wins: 0, podiums: 0, accentColor: '#0090ff' },
  { rank: 12, driverName: 'Nico Hülkenberg', driverNumber: '#27', country: 'GER', team: 'Audi F1 Team', carId: 'audi', points: 48, wins: 0, podiums: 0, accentColor: '#f50537' },
  { rank: 13, driverName: 'Esteban Ocon', driverNumber: '#31', country: 'FRA', team: 'Haas F1 Team', carId: 'haas', points: 44, wins: 0, podiums: 0, accentColor: '#b6babd' },
  { rank: 14, driverName: 'Liam Lawson', driverNumber: '#30', country: 'NZL', team: 'Visa Cash App RB', carId: 'racingbulls', points: 38, wins: 0, podiums: 0, accentColor: '#6692ff' },
  { rank: 15, driverName: 'Lance Stroll', driverNumber: '#18', country: 'CAN', team: 'Aston Martin F1', carId: 'astonmartin', points: 32, wins: 0, podiums: 0, accentColor: '#229971' },
  { rank: 16, driverName: 'Oliver Bearman', driverNumber: '#87', country: 'GBR', team: 'Haas F1 Team', carId: 'haas', points: 28, wins: 0, podiums: 0, accentColor: '#b6babd' },
  { rank: 17, driverName: 'Franco Colapinto', driverNumber: '#43', country: 'ARG', team: 'Alpine F1 Team', carId: 'alpine', points: 22, wins: 0, podiums: 0, accentColor: '#0090ff' },
  { rank: 18, driverName: 'Sergio Pérez', driverNumber: '#11', country: 'MEX', team: 'Cadillac F1 Team', carId: 'cadillac', points: 18, wins: 0, podiums: 0, accentColor: '#8a8d8f' },
  { rank: 19, driverName: 'Valtteri Bottas', driverNumber: '#77', country: 'FIN', team: 'Cadillac F1 Team', carId: 'cadillac', points: 14, wins: 0, podiums: 0, accentColor: '#8a8d8f' },
  { rank: 20, driverName: 'Arvid Lindblad', driverNumber: '#41', country: 'GBR', team: 'Visa Cash App RB', carId: 'racingbulls', points: 12, wins: 0, podiums: 0, accentColor: '#6692ff' },
  { rank: 21, driverName: 'Gabriel Bortoleto', driverNumber: '#5', country: 'BRA', team: 'Audi F1 Team', carId: 'audi', points: 8, wins: 0, podiums: 0, accentColor: '#f50537' },
  { rank: 22, driverName: 'Isack Hadjar', driverNumber: '#6', country: 'FRA', team: 'Red Bull Racing', carId: 'rb20', points: 6, wins: 0, podiums: 0, accentColor: '#0600ef' },
];

// Official 2025/2026 Constructors Championship Live Standings (11 Teams)
interface ConstructorStanding {
  rank: number;
  team: string;
  carName: string;
  carId: CarId;
  engine: string;
  drivers: string;
  points: number;
  wins: number;
  podiums: number;
  accentColor: string;
}

const CONSTRUCTOR_STANDINGS: ConstructorStanding[] = [
  { rank: 1, team: 'McLaren Formula 1 Team', carName: 'MCL38', carId: 'mcl38', engine: 'Mercedes-AMG M15', drivers: 'L. Norris · O. Piastri', points: 665, wins: 8, podiums: 22, accentColor: '#ff8000' },
  { rank: 2, team: 'Scuderia Ferrari HP', carName: 'SF-24', carId: 'sf24', engine: 'Ferrari 066/12', drivers: 'C. Leclerc · L. Hamilton', points: 605, wins: 7, podiums: 19, accentColor: '#e80020' },
  { rank: 3, team: 'Oracle Red Bull Racing', carName: 'RB20', carId: 'rb20', engine: 'Honda RBPTH002', drivers: 'M. Verstappen · I. Hadjar', points: 401, wins: 8, podiums: 14, accentColor: '#0600ef' },
  { rank: 4, team: 'Mercedes-AMG Petronas F1 Team', carName: 'W15', carId: 'w15', engine: 'Mercedes-AMG M15', drivers: 'G. Russell · K. Antonelli', points: 335, wins: 1, podiums: 7, accentColor: '#00a19c' },
  { rank: 5, team: 'Williams Racing', carName: 'FW47', carId: 'williams', engine: 'Mercedes-AMG M15', drivers: 'C. Sainz · A. Albon', points: 237, wins: 0, podiums: 5, accentColor: '#00a0de' },
  { rank: 6, team: 'Aston Martin Aramco F1 Team', carName: 'AMR25', carId: 'astonmartin', engine: 'Mercedes-AMG M15', drivers: 'F. Alonso · L. Stroll', points: 142, wins: 0, podiums: 2, accentColor: '#229971' },
  { rank: 7, team: 'BWT Alpine F1 Team', carName: 'A525', carId: 'alpine', engine: 'Renault RE25', drivers: 'P. Gasly · F. Colapinto', points: 76, wins: 0, podiums: 0, accentColor: '#0090ff' },
  { rank: 8, team: 'MoneyGram Haas F1 Team', carName: 'VF-25', carId: 'haas', engine: 'Ferrari 066/12', drivers: 'E. Ocon · O. Bearman', points: 72, wins: 0, podiums: 0, accentColor: '#b6babd' },
  { rank: 9, team: 'Audi F1 Team', carName: 'R26', carId: 'audi', engine: 'Audi Sport F1', drivers: 'N. Hülkenberg · G. Bortoleto', points: 56, wins: 0, podiums: 0, accentColor: '#f50537' },
  { rank: 10, team: 'Visa Cash App RB F1 Team', carName: 'VCARB 02', carId: 'racingbulls', engine: 'Honda RBPTH002', drivers: 'L. Lawson · A. Lindblad', points: 50, wins: 0, podiums: 0, accentColor: '#6692ff' },
  { rank: 11, team: 'Cadillac F1 Team', carName: 'CT6-R', carId: 'cadillac', engine: 'Cadillac GM Twin-Turbo', drivers: 'S. Pérez · V. Bottas', points: 32, wins: 0, podiums: 0, accentColor: '#8a8d8f' },
];

export const HomeView: React.FC = () => {
  const { openCarIn3D, setActiveTab, lang } = useCarStore();
  const cars = Object.values(CARS_DATA);
  const strings = t[lang].home;

  // Selected car on Hero showcase (Defaults to Ferrari SF-24)
  const [featuredCarId, setFeaturedCarId] = useState<CarId>('sf24');
  const featuredCar = CARS_DATA[featuredCarId] || CARS_DATA['sf24'];

  // Leaderboard state
  const [leaderboardTab, setLeaderboardTab] = useState<'drivers' | 'constructors'>('drivers');

  // 3D Tilt state for hero showcase card
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleHeroMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rx = ((y - rect.height / 2) / rect.height) * -6;
    const ry = ((x - rect.width / 2) / rect.width) * 6;
    setTilt({ rx, ry });
  };

  const handleHeroMouseLeave = () => {
    setIsHovered(false);
    setTilt({ rx: 0, ry: 0 });
  };

  return (
    <div className="bg-studio-100 text-studio-900 selection:bg-f1red selection:text-white">

      {/* ══════════════════════════════════════════════════════
          1. DYNAMIC AUTOMOTIVE HERO — ALL 11 TEAMS SELECTOR
          ══════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-studio-50 to-studio-100 pt-20 pb-14 lg:py-20 border-b border-studio-200">
        {/* Subtle engineering grid & ambient glow */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            backgroundImage: `
              radial-gradient(ellipse 80% 50% at 50% -20%, rgba(225,6,0,0.12) 0%, transparent 70%),
              repeating-linear-gradient(0deg, transparent, transparent 49px, rgba(0,0,0,0.03) 50px),
              repeating-linear-gradient(90deg, transparent, transparent 49px, rgba(0,0,0,0.03) 50px)
            `,
          }}
        />

        <div className="page-container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">

            {/* ── Left Column: Editorial Typography & All 11 Cars Selector ── */}
            <div className="lg:col-span-5 flex flex-col justify-center">
              {/* Badge */}
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-f1red animate-pulse" />
                <span className="text-[11px] font-mono uppercase tracking-widest text-f1red font-bold">
                  {strings.eraBadge}
                </span>
              </div>

              {/* Headline */}
              <h1 className="heading-display text-4xl sm:text-6xl lg:text-[72px] font-light italic leading-tight text-studio-950">
                {strings.heroTitle1}
              </h1>
              <h1 className="heading-display text-4xl sm:text-6xl lg:text-[72px] font-bold leading-tight text-studio-950 mb-3">
                {strings.heroTitle2}
              </h1>

              {/* Red racing bar */}
              <div className="w-16 h-[3px] bg-f1red mb-5" />

              {/* Description */}
              <p className="text-xs sm:text-sm font-body text-studio-600 leading-relaxed font-light mb-6 max-w-lg">
                {strings.heroDesc}
              </p>

              {/* ALL 11 TEAMS CAR SELECTOR CHIPS */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-studio-400 font-bold">
                    {strings.heroContenders} (11 Đội đua)
                  </span>
                  <span className="text-[10px] font-mono text-studio-500 font-semibold">
                    {featuredCar.name}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 max-h-[140px] overflow-y-auto pr-1 scrollbar-none">
                  {ALL_11_TEAMS.map((id) => {
                    const c = CARS_DATA[id];
                    if (!c) return null;
                    const isSelected = featuredCarId === id;
                    return (
                      <button
                        key={id}
                        onClick={() => setFeaturedCarId(id)}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-sm border text-[11px] font-mono font-bold transition-all ${
                          isSelected
                            ? 'bg-studio-950 text-white border-studio-950 shadow-md scale-105 ring-1 ring-black'
                            : 'bg-white hover:bg-studio-50 text-studio-700 border-studio-200 shadow-xs'
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full shrink-0 ${isSelected ? 'ring-2 ring-white/60' : ''}`}
                          style={{ background: c.primaryColor }}
                        />
                        <span className="truncate max-w-[120px]">{c.shortName}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <button
                  onClick={() => openCarIn3D(featuredCarId)}
                  className="btn-primary shadow-luxury flex items-center gap-2"
                >
                  <span>{strings.viewAnatomy}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setActiveTab('gallery')}
                  className="btn-ghost"
                >
                  <Camera className="w-3.5 h-3.5 text-f1red" />
                  <span>{strings.explore3d}</span>
                </button>
              </div>

              {/* Telemetry Micro Stats Strip */}
              <div className="grid grid-cols-3 gap-3 pt-5 border-t border-studio-200">
                <div>
                  <span className="text-[9px] font-mono uppercase tracking-wider text-studio-400 block">{strings.stats.hp}</span>
                  <span className="text-base sm:text-lg font-display font-bold text-studio-950">
                    {featuredCar.horsepower} <span className="text-[10px] font-mono font-normal text-studio-500">bhp</span>
                  </span>
                </div>
                <div>
                  <span className="text-[9px] font-mono uppercase tracking-wider text-studio-400 block">{strings.stats.downforce}</span>
                  <span className="text-base sm:text-lg font-display font-bold text-studio-950">
                    {featuredCar.topSpeedKmh} <span className="text-[10px] font-mono font-normal text-studio-500">km/h</span>
                  </span>
                </div>
                <div>
                  <span className="text-[9px] font-mono uppercase tracking-wider text-studio-400 block">0–100 KM/H</span>
                  <span className="text-base sm:text-lg font-display font-bold text-studio-950">
                    {featuredCar.zeroToHundredSec} <span className="text-[10px] font-mono font-normal text-studio-500">s</span>
                  </span>
                </div>
              </div>

            </div>

            {/* ── Right Column: Automotive Hero Stage (Centerpiece) ── */}
            <div className="lg:col-span-7 relative">
              <div
                onMouseMove={handleHeroMouseMove}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={handleHeroMouseLeave}
                className="relative aspect-[16/10] sm:aspect-[16/9.5] w-full rounded-sm overflow-hidden bg-studio-950 border border-studio-300 shadow-2xl transition-all duration-300 group cursor-pointer"
                style={{
                  transform: `perspective(1000px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
                  transformStyle: 'preserve-3d',
                  transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
                onClick={() => openCarIn3D(featuredCarId)}
              >
                {/* Dynamic Livery Halo Ambient Glow */}
                <div
                  className="absolute inset-0 pointer-events-none transition-all duration-700"
                  style={{
                    background: `radial-gradient(ellipse 85% 65% at 50% 50%, ${featuredCar.primaryColor}2e 0%, transparent 70%)`,
                  }}
                />

                {/* Studio Top Lighting Grid Bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/40 to-transparent" />

                {/* Spotlight from top */}
                <div
                  className="absolute -top-24 left-1/2 -translate-x-1/2 w-3/4 h-48 pointer-events-none rounded-full blur-3xl opacity-30"
                  style={{ background: 'radial-gradient(circle, #ffffff 0%, transparent 70%)' }}
                />

                {/* Ground reflection floor line */}
                <div className="absolute bottom-10 left-12 right-12 h-16 pointer-events-none opacity-40 blur-xl rounded-full bg-white/10" />

                {/* Top-Left Floating Badge: Power */}
                <div className="absolute top-4 left-4 z-20 pointer-events-none">
                  <div className="bg-black/80 backdrop-blur-md border border-white/15 px-3 py-1.5 rounded-sm shadow-luxury flex items-center gap-2 text-white">
                    <Zap className="w-3.5 h-3.5 text-yellow-400" />
                    <div>
                      <span className="text-[8.5px] font-mono uppercase tracking-wider text-white/60 block leading-none">
                        {strings.stats.hp}
                      </span>
                      <span className="text-xs font-mono font-bold leading-tight">
                        {featuredCar.horsepower} bhp · {featuredCar.engine}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Top-Right Floating Badge: Top Speed */}
                <div className="absolute top-4 right-4 z-20 pointer-events-none">
                  <div className="bg-black/80 backdrop-blur-md border border-white/15 px-3 py-1.5 rounded-sm shadow-luxury flex items-center gap-2 text-white">
                    <Gauge className="w-3.5 h-3.5 text-f1red" />
                    <div>
                      <span className="text-[8.5px] font-mono uppercase tracking-wider text-white/60 block leading-none">
                        TOP SPEED
                      </span>
                      <span className="text-xs font-mono font-bold leading-tight">
                        {featuredCar.topSpeedKmh} km/h (0-100: {featuredCar.zeroToHundredSec}s)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Hero Car Center Visual */}
                <div
                  key={featuredCarId}
                  className="absolute inset-0 flex items-center justify-center p-6 sm:p-10 pointer-events-none animate-car-switch"
                >
                  <img
                    src={featuredCar.image}
                    alt={featuredCar.name}
                    className="max-w-[94%] max-h-[88%] object-contain drop-shadow-[0_25px_45px_rgba(0,0,0,0.85)] filter contrast-105"
                  />
                </div>

                {/* Bottom Left: Team & Drivers Card */}
                <div className="absolute bottom-4 left-4 z-20 pointer-events-none">
                  <div className="bg-black/80 backdrop-blur-md border border-white/15 px-3.5 py-2 rounded-sm shadow-luxury flex items-center gap-2.5 text-white">
                    <span
                      className="w-2.5 h-2.5 rounded-full ring-2 ring-white/30 shrink-0"
                      style={{ background: featuredCar.primaryColor }}
                    />
                    <div>
                      <span
                        className="text-[9px] font-mono uppercase font-bold tracking-wider block leading-none mb-0.5"
                        style={{ color: featuredCar.primaryColor }}
                      >
                        {featuredCar.team}
                      </span>
                      <span className="text-xs font-display font-bold leading-none block">
                        {featuredCar.name} · {featuredCar.drivers.join(' & ')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Right: Quick Enter Showroom Button */}
                <div className="absolute bottom-4 right-4 z-20">
                  <button
                    onClick={() => openCarIn3D(featuredCarId)}
                    className="bg-f1red hover:bg-f1red-dark text-white px-3.5 py-2 rounded-xs text-[10.5px] font-mono uppercase tracking-wider font-bold shadow-luxury flex items-center gap-1.5 transition-all group-hover:scale-105"
                  >
                    <span>{strings.viewInShowroom}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════
          2. 11 TEAMS CHAMPIONSHIP LIVERY TICKER
          ══════════════════════════════════════════════════════ */}
      <section className="bg-white border-b border-studio-200 py-3 shadow-xs">
        <div className="page-container">
          <div className="flex items-center gap-3 overflow-x-auto scrollbar-none py-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-studio-400 font-bold shrink-0 flex items-center gap-1.5">
              <Layers className="w-3 h-3 text-f1red" />
              {strings.tickerTitle}:
            </span>
            <div className="flex items-center gap-2 shrink-0">
              {ALL_11_TEAMS.map((id) => {
                const c = CARS_DATA[id];
                if (!c) return null;
                const isCurrent = featuredCarId === id;
                return (
                  <button
                    key={id}
                    onClick={() => {
                      setFeaturedCarId(id);
                      openCarIn3D(id);
                    }}
                    className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xs border text-[11px] font-mono font-bold transition-all shrink-0 ${
                      isCurrent
                        ? 'bg-studio-950 text-white border-studio-950 shadow-xs'
                        : 'bg-studio-50 hover:bg-studio-100 text-studio-700 border-studio-200'
                    }`}
                  >
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ background: c.primaryColor }}
                    />
                    <span className="uppercase">{c.shortName}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════
          3. F1 LIVE CHAMPIONSHIP LEADERBOARD & STANDINGS
          ══════════════════════════════════════════════════════ */}
      <section className="page-section bg-studio-100 border-b border-studio-200">
        <div className="page-container">
          {/* Header & Tabs */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="w-4 h-4 text-yellow-500" />
                <span className="text-[11px] font-mono uppercase tracking-widest text-f1red font-bold">
                  {strings.leaderboardBadge}
                </span>
              </div>
              <h2 className="heading-display text-3xl sm:text-5xl font-light text-studio-950">
                {strings.leaderboardTitle}
              </h2>
              <p className="text-xs sm:text-sm font-body text-studio-600 mt-1 max-w-xl font-light">
                {strings.leaderboardDesc}
              </p>
            </div>

            {/* Toggle Tab between Drivers & Constructors */}
            <div className="flex items-center gap-1.5 bg-white p-1 rounded-sm border border-studio-200 shadow-xs shrink-0">
              <button
                onClick={() => setLeaderboardTab('drivers')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xs text-xs font-mono font-bold uppercase tracking-wider transition-all ${
                  leaderboardTab === 'drivers'
                    ? 'bg-studio-950 text-white shadow-xs'
                    : 'text-studio-600 hover:text-studio-950'
                }`}
              >
                <Medal className="w-3.5 h-3.5 text-yellow-400" />
                <span>{strings.tabDrivers}</span>
              </button>
              <button
                onClick={() => setLeaderboardTab('constructors')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xs text-xs font-mono font-bold uppercase tracking-wider transition-all ${
                  leaderboardTab === 'constructors'
                    ? 'bg-studio-950 text-white shadow-xs'
                    : 'text-studio-600 hover:text-studio-950'
                }`}
              >
                <Trophy className="w-3.5 h-3.5 text-f1red" />
                <span>{strings.tabConstructors}</span>
              </button>
            </div>
          </div>

          {/* Standings Table Container */}
          <div className="bg-white border border-studio-200 rounded-sm shadow-subtle overflow-hidden">
            {leaderboardTab === 'drivers' ? (
              /* ── DRIVERS CHAMPIONSHIP TABLE ── */
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-body">
                  <thead>
                    <tr className="border-b border-studio-200 bg-studio-50/80 text-[10px] font-mono uppercase tracking-wider text-studio-500">
                      <th className="py-3.5 px-4 w-16 text-center">{strings.colRank}</th>
                      <th className="py-3.5 px-4">{strings.colDriver}</th>
                      <th className="py-3.5 px-4">{strings.colTeam}</th>
                      <th className="py-3.5 px-4 text-center">{strings.colWins}</th>
                      <th className="py-3.5 px-4 text-center">{strings.colPodiums}</th>
                      <th className="py-3.5 px-4 text-right font-bold text-studio-900">{strings.colPoints}</th>
                      <th className="py-3.5 px-4 text-right">{strings.colGap}</th>
                      <th className="py-3.5 px-4 text-center w-24">Showroom</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-studio-100">
                    {DRIVER_STANDINGS.map((d, idx) => {
                      const isPodium = d.rank <= 3;
                      const gap = idx === 0 ? 'Leader' : `-${DRIVER_STANDINGS[0].points - d.points}`;
                      return (
                        <tr
                          key={d.driverNumber}
                          className={`hover:bg-studio-50/80 transition-colors ${
                            isPodium ? 'bg-studio-50/30 font-medium' : ''
                          }`}
                        >
                          {/* Rank with Podium badges */}
                          <td className="py-3.5 px-4 text-center">
                            {d.rank === 1 && (
                              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-yellow-400 text-black font-display font-bold text-xs shadow-xs">
                                1
                              </span>
                            )}
                            {d.rank === 2 && (
                              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-zinc-300 text-black font-display font-bold text-xs shadow-xs">
                                2
                              </span>
                            )}
                            {d.rank === 3 && (
                              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-600 text-white font-display font-bold text-xs shadow-xs">
                                3
                              </span>
                            )}
                            {d.rank > 3 && (
                              <span className="font-mono text-studio-400 font-bold text-xs">
                                {d.rank}
                              </span>
                            )}
                          </td>

                          {/* Driver Name & Number */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2">
                              <span
                                className="w-1.5 h-6 rounded-full shrink-0"
                                style={{ background: d.accentColor }}
                              />
                              <div>
                                <span className="font-display font-bold text-studio-950 text-sm block">
                                  {d.driverName}
                                </span>
                                <span className="text-[10px] font-mono text-studio-400 font-medium">
                                  {d.driverNumber} · {d.country}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Team */}
                          <td className="py-3.5 px-4 font-body text-studio-600 font-normal">
                            {d.team}
                          </td>

                          {/* Wins */}
                          <td className="py-3.5 px-4 text-center font-mono font-bold text-studio-800">
                            {d.wins > 0 ? (
                              <span className="px-2 py-0.5 rounded-xs bg-yellow-100 text-yellow-800 font-bold">
                                {d.wins}
                              </span>
                            ) : (
                              <span className="text-studio-300">0</span>
                            )}
                          </td>

                          {/* Podiums */}
                          <td className="py-3.5 px-4 text-center font-mono text-studio-700">
                            {d.podiums}
                          </td>

                          {/* Points PTS */}
                          <td className="py-3.5 px-4 text-right">
                            <span className="font-mono font-bold text-sm text-studio-950 bg-studio-100 px-2 py-0.5 rounded-xs">
                              {d.points} <span className="text-[9px] text-studio-400 font-normal">PTS</span>
                            </span>
                          </td>

                          {/* Gap */}
                          <td className="py-3.5 px-4 text-right font-mono text-[11px] text-studio-400">
                            {gap}
                          </td>

                          {/* Action Link */}
                          <td className="py-3.5 px-4 text-center">
                            <button
                              onClick={() => openCarIn3D(d.carId)}
                              className="text-[10px] font-mono uppercase tracking-wider font-bold text-f1red hover:underline inline-flex items-center gap-0.5"
                            >
                              <span>{strings.viewCarBtn}</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              /* ── CONSTRUCTORS CHAMPIONSHIP TABLE ── */
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-body">
                  <thead>
                    <tr className="border-b border-studio-200 bg-studio-50/80 text-[10px] font-mono uppercase tracking-wider text-studio-500">
                      <th className="py-3.5 px-4 w-16 text-center">{strings.colRank}</th>
                      <th className="py-3.5 px-4">{strings.colTeam}</th>
                      <th className="py-3.5 px-4">{strings.colEngine}</th>
                      <th className="py-3.5 px-4">{strings.modelRange.driversLabel}</th>
                      <th className="py-3.5 px-4 text-center">{strings.colWins}</th>
                      <th className="py-3.5 px-4 text-center">{strings.colPodiums}</th>
                      <th className="py-3.5 px-4 text-right font-bold text-studio-900">{strings.colPoints}</th>
                      <th className="py-3.5 px-4 text-center w-24">Showroom</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-studio-100">
                    {CONSTRUCTOR_STANDINGS.map((c, idx) => {
                      const maxPts = CONSTRUCTOR_STANDINGS[0].points;
                      const pct = Math.round((c.points / maxPts) * 100);
                      return (
                        <tr
                          key={c.team}
                          className="hover:bg-studio-50/80 transition-colors"
                        >
                          {/* Rank */}
                          <td className="py-3.5 px-4 text-center">
                            {c.rank <= 3 ? (
                              <span
                                className={`inline-flex items-center justify-center w-6 h-6 rounded-full font-display font-bold text-xs shadow-xs ${
                                  c.rank === 1
                                    ? 'bg-yellow-400 text-black'
                                    : c.rank === 2
                                    ? 'bg-zinc-300 text-black'
                                    : 'bg-amber-600 text-white'
                                }`}
                              >
                                {c.rank}
                              </span>
                            ) : (
                              <span className="font-mono text-studio-400 font-bold text-xs">
                                {c.rank}
                              </span>
                            )}
                          </td>

                          {/* Team Name & Livery Bar */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2.5">
                              <span
                                className="w-2 h-7 rounded-xs shrink-0"
                                style={{ background: c.accentColor }}
                              />
                              <div>
                                <span className="font-display font-bold text-studio-950 text-sm block">
                                  {c.team}
                                </span>
                                <span className="text-[10px] font-mono text-studio-500 font-semibold">
                                  {c.carName}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Engine */}
                          <td className="py-3.5 px-4 font-mono text-[11px] text-studio-600">
                            {c.engine}
                          </td>

                          {/* Drivers */}
                          <td className="py-3.5 px-4 font-body text-studio-700">
                            {c.drivers}
                          </td>

                          {/* Wins */}
                          <td className="py-3.5 px-4 text-center font-mono font-bold text-studio-800">
                            {c.wins > 0 ? (
                              <span className="px-2 py-0.5 rounded-xs bg-yellow-100 text-yellow-800 font-bold">
                                {c.wins}
                              </span>
                            ) : (
                              <span className="text-studio-300">0</span>
                            )}
                          </td>

                          {/* Podiums */}
                          <td className="py-3.5 px-4 text-center font-mono text-studio-700">
                            {c.podiums}
                          </td>

                          {/* Points PTS & Mini Progress Bar */}
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex flex-col items-end gap-1">
                              <span className="font-mono font-bold text-sm text-studio-950 bg-studio-100 px-2 py-0.5 rounded-xs">
                                {c.points} <span className="text-[9px] text-studio-400 font-normal">PTS</span>
                              </span>
                              <div className="w-20 h-1 bg-studio-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full rounded-full transition-all"
                                  style={{ width: `${pct}%`, background: c.accentColor }}
                                />
                              </div>
                            </div>
                          </td>

                          {/* Action */}
                          <td className="py-3.5 px-4 text-center">
                            <button
                              onClick={() => openCarIn3D(c.carId)}
                              className="text-[10px] font-mono uppercase tracking-wider font-bold text-f1red hover:underline inline-flex items-center gap-0.5"
                            >
                              <span>{strings.viewCarBtn}</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════
          4. THE 11 CARS — MODEL RANGE GRID
          ══════════════════════════════════════════════════════ */}
      <section className="page-section bg-white border-b border-studio-200">
        <div className="page-container">
          {/* Section header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="label-overline mb-2 block">{strings.modelRange.badge}</span>
              <h2 className="heading-display text-3xl sm:text-5xl font-light text-studio-950">
                {strings.modelRange.title}
              </h2>
            </div>
            <p className="text-[12px] font-body text-studio-600 leading-relaxed max-w-sm font-light">
              {strings.modelRange.desc}
            </p>
          </div>

          {/* Car grid — 11 official teams */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {cars.map((car, idx) => (
              <div
                key={car.id}
                className="model-card rounded-sm relative group flex flex-col justify-between animate-metric-pop bg-white border border-studio-200 shadow-subtle hover:shadow-luxury transition-all duration-300"
                style={{ animationDelay: `${(idx % 8) * 50}ms` }}
                onClick={() => openCarIn3D(car.id as CarId)}
              >
                {/* Livery colour strip */}
                <div
                  className="w-full h-1.5"
                  style={{ background: `linear-gradient(90deg, ${car.primaryColor}, ${car.accentColor})` }}
                />

                <div className="p-6">
                  {/* Team label */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9.5px] font-mono uppercase tracking-widest text-studio-500 font-bold truncate max-w-[170px]">
                      {car.team}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-studio-400">
                      {car.year}
                    </span>
                  </div>

                  {/* Car name */}
                  <h3 className="heading-display text-2xl font-bold mb-4 text-studio-950 group-hover:text-f1red transition-colors">
                    {car.name}
                  </h3>

                  {/* Car image preview */}
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-studio-950 rounded-xs mb-5 border border-black/10">
                    <img
                      src={car.image}
                      alt={car.name}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                    <span className="absolute bottom-2 right-2 text-[9px] font-mono text-white/80 bg-black/70 px-1.5 py-0.5 rounded-xs">
                      4K Studio
                    </span>
                  </div>

                  {/* Telemetry specs grid */}
                  <div className="grid grid-cols-2 gap-2.5 py-3 border-t border-b border-studio-100 text-xs font-mono mb-4">
                    <div>
                      <span className="text-[8.5px] uppercase text-studio-400 block">{strings.stats.hp}</span>
                      <span className="font-bold text-studio-950">{fmt(car.horsepower)} bhp</span>
                    </div>
                    <div>
                      <span className="text-[8.5px] uppercase text-studio-400 block">TOP SPEED</span>
                      <span className="font-bold text-studio-950">{car.topSpeedKmh} km/h</span>
                    </div>
                    <div>
                      <span className="text-[8.5px] uppercase text-studio-400 block">0–100 KM/H</span>
                      <span className="font-bold text-studio-950">{car.zeroToHundredSec} s</span>
                    </div>
                    <div>
                      <span className="text-[8.5px] uppercase text-studio-400 block">POWER UNIT</span>
                      <span className="font-bold text-studio-950 truncate block max-w-[90px]">{car.engine}</span>
                    </div>
                  </div>

                  {/* Drivers & CTA */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[8.5px] font-mono uppercase tracking-wider text-studio-400 block">
                        {strings.modelRange.driversLabel}
                      </span>
                      <p className="text-[11px] font-body text-studio-700 font-medium truncate max-w-[180px]">
                        {car.drivers.join(' · ')}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-studio-400 group-hover:text-f1red group-hover:translate-x-1 transition-all duration-200 shrink-0 ml-2" />
                  </div>
                </div>

                {/* Bottom subtle red hover bar */}
                <div className="w-full h-0 bg-f1red group-hover:h-1 transition-all duration-300" />
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════
          5. TECHNICAL BENTO GRID (GROUND EFFECT, ENGINE, CHASSIS)
          ══════════════════════════════════════════════════════ */}
      <section className="page-section bg-studio-100 border-b border-studio-200">
        <div className="page-container">
          <div className="mb-10">
            <span className="label-overline mb-2 block">{strings.techBadge}</span>
            <h2 className="heading-display text-3xl sm:text-5xl font-light text-studio-950">
              {strings.techTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Ground Effect */}
            <div className="bg-white p-7 border border-studio-200 rounded-sm shadow-subtle flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-sm bg-studio-100 flex items-center justify-center text-f1red mb-5">
                  <Wind className="w-5 h-5" />
                </div>
                <h3 className="font-display text-xl font-bold text-studio-950 mb-3">
                  {strings.techGroundEffectTitle}
                </h3>
                <p className="text-xs font-body text-studio-600 leading-relaxed font-light">
                  {strings.techGroundEffectDesc}
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-studio-100 flex items-center justify-between text-[11px] font-mono text-studio-500">
                <span>VENTURI TUNNELS</span>
                <span className="font-bold text-f1red">60% DOWNFORCE</span>
              </div>
            </div>

            {/* Card 2: Turbo Hybrid ERS */}
            <div className="bg-white p-7 border border-studio-200 rounded-sm shadow-subtle flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-sm bg-studio-100 flex items-center justify-center text-yellow-500 mb-5">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="font-display text-xl font-bold text-studio-950 mb-3">
                  {strings.techPowerUnitTitle}
                </h3>
                <p className="text-xs font-body text-studio-600 leading-relaxed font-light">
                  {strings.techPowerUnitDesc}
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-studio-100 flex items-center justify-between text-[11px] font-mono text-studio-500">
                <span>V6 TURBO + MGU-K</span>
                <span className="font-bold text-yellow-600">1,055+ BHP</span>
              </div>
            </div>

            {/* Card 3: Titanium Halo & Monocoque */}
            <div className="bg-white p-7 border border-studio-200 rounded-sm shadow-subtle flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-sm bg-studio-100 flex items-center justify-center text-cyan-600 mb-5">
                  <Shield className="w-5 h-5" />
                </div>
                <h3 className="font-display text-xl font-bold text-studio-950 mb-3">
                  {strings.techChassisTitle}
                </h3>
                <p className="text-xs font-body text-studio-600 leading-relaxed font-light">
                  {strings.techChassisDesc}
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-studio-100 flex items-center justify-between text-[11px] font-mono text-studio-500">
                <span>GRADE 5 TITANIUM</span>
                <span className="font-bold text-cyan-600">12T IMPACT RESIST</span>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════
          6. FEATURES — 3-COLUMN SHORTCUT STRIP
          ══════════════════════════════════════════════════════ */}
      <section className="page-section bg-white">
        <div className="page-container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {strings.features.map((f, idx) => {
              const tabTarget = idx === 0 ? 'models' : idx === 1 ? 'gallery' : 'compare';
              return (
                <div
                  key={f.no}
                  className="bg-studio-50 p-8 border border-studio-200 rounded-sm shadow-subtle flex flex-col justify-between min-h-[260px] animate-metric-pop hover:border-studio-400 transition-all"
                  style={{ animationDelay: `${idx * 80}ms` }}
                >
                  <div>
                    <span className="text-[11px] font-mono text-f1red font-bold tracking-widest block mb-3">
                      {f.no}
                    </span>
                    <h3 className="heading-display text-2xl font-bold mb-2.5 text-studio-950">
                      {f.title}
                    </h3>
                    <p className="text-[12px] font-body font-light text-studio-600 leading-relaxed">
                      {f.desc}
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab(tabTarget as any)}
                    className="mt-6 flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest font-bold text-studio-800 hover:text-f1red transition-colors group"
                  >
                    <span>{f.cta}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomeView;
