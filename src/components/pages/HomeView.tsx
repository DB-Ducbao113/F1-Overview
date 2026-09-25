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
} from 'lucide-react';

const fmt = (n: number) => n.toLocaleString('en-US');

// Top 4 powerhouse contenders for the interactive hero switcher
const FEATURED_HERO_CARS: CarId[] = ['sf24', 'rb20', 'mcl38', 'w15'];

// 11 Official teams in order for the ribbon
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

export const HomeView: React.FC = () => {
  const { openCarIn3D, setActiveTab, lang } = useCarStore();
  const cars = Object.values(CARS_DATA);
  const strings = t[lang].home;

  // Selected car on Hero showcase
  const [featuredCarId, setFeaturedCarId] = useState<CarId>('sf24');
  const featuredCar = CARS_DATA[featuredCarId] || CARS_DATA['sf24'];

  // 3D Tilt state for hero showcase card
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleHeroMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rx = ((y - rect.height / 2) / rect.height) * -7;
    const ry = ((x - rect.width / 2) / rect.width) * 7;
    setTilt({ rx, ry });
  };

  const handleHeroMouseLeave = () => {
    setIsHovered(false);
    setTilt({ rx: 0, ry: 0 });
  };

  return (
    <div className="bg-studio-100 text-studio-900 selection:bg-f1red selection:text-white">

      {/* ══════════════════════════════════════════════════════
          1. DYNAMIC AUTOMOTIVE HERO — SHOWCASE CENTERPIECE
          ══════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-studio-50 to-studio-100 pt-20 pb-16 lg:py-24 border-b border-studio-200">
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

            {/* ── Left Column: Editorial Typography & Contender Pills ── */}
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
              <h1 className="heading-display text-4xl sm:text-6xl lg:text-[72px] font-bold leading-tight text-studio-950 mb-4">
                {strings.heroTitle2}
              </h1>

              {/* Red racing bar */}
              <div className="w-16 h-[3px] bg-f1red mb-6" />

              {/* Description */}
              <p className="text-xs sm:text-sm font-body text-studio-600 leading-relaxed font-light mb-8 max-w-lg">
                {strings.heroDesc}
              </p>

              {/* Interactive Quick-Contender Selector */}
              <div className="mb-8">
                <span className="text-[10px] font-mono uppercase tracking-widest text-studio-400 font-bold block mb-2.5">
                  {strings.heroContenders}
                </span>
                <div className="flex flex-wrap gap-2">
                  {FEATURED_HERO_CARS.map((id) => {
                    const c = CARS_DATA[id];
                    if (!c) return null;
                    const isSelected = featuredCarId === id;
                    return (
                      <button
                        key={id}
                        onClick={() => setFeaturedCarId(id)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-sm border text-xs font-mono font-bold transition-all ${
                          isSelected
                            ? 'bg-studio-950 text-white border-studio-950 shadow-md scale-105'
                            : 'bg-white hover:bg-studio-50 text-studio-700 border-studio-200 shadow-xs'
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${isSelected ? 'ring-2 ring-white/60' : ''}`}
                          style={{ background: c.primaryColor }}
                        />
                        <span>{c.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 mb-8">
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
              <div className="grid grid-cols-3 gap-3 pt-6 border-t border-studio-200">
                <div>
                  <span className="text-[9px] font-mono uppercase tracking-wider text-studio-400 block">{strings.stats.hp}</span>
                  <span className="text-lg sm:text-xl font-display font-bold text-studio-950">
                    1,055+ <span className="text-[10px] font-mono font-normal text-studio-500">bhp</span>
                  </span>
                </div>
                <div>
                  <span className="text-[9px] font-mono uppercase tracking-wider text-studio-400 block">{strings.stats.downforce}</span>
                  <span className="text-lg sm:text-xl font-display font-bold text-studio-950">
                    1,880 <span className="text-[10px] font-mono font-normal text-studio-500">kgf</span>
                  </span>
                </div>
                <div>
                  <span className="text-[9px] font-mono uppercase tracking-wider text-studio-400 block">{strings.stats.groundClearance}</span>
                  <span className="text-lg sm:text-xl font-display font-bold text-studio-950">
                    15–25 <span className="text-[10px] font-mono font-normal text-studio-500">mm</span>
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
          3. CINEMATIC DUAL SPOTLIGHT (STUDIO 4K vs TRACK ACTION)
          ══════════════════════════════════════════════════════ */}
      <section className="page-section bg-studio-100 border-b border-studio-200">
        <div className="page-container">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <span className="label-overline mb-2 block">{strings.spotlightBadge}</span>
              <h2 className="heading-display text-3xl sm:text-5xl font-light text-studio-950">
                {strings.spotlightTitle}
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Spotlight 1: Studio 4K Precision */}
            <div
              onClick={() => setActiveTab('models')}
              className="group relative rounded-sm overflow-hidden bg-studio-950 border border-studio-300 shadow-subtle hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-studio-950">
                <img
                  src="/images/teams/sf24.jpg"
                  alt="Ferrari SF-24 Studio"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                <span className="absolute top-4 left-4 px-2.5 py-1 bg-black/80 backdrop-blur-md border border-white/20 text-[9.5px] font-mono uppercase tracking-wider text-white font-bold rounded-xs">
                  {strings.spotlightStudioTitle}
                </span>
              </div>
              <div className="p-6 bg-studio-950 text-white flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-display font-bold text-white group-hover:text-f1red transition-colors mb-2">
                    {strings.spotlightStudioSubtitle}
                  </h3>
                  <p className="text-xs font-body text-white/70 leading-relaxed font-light mb-6">
                    {strings.spotlightStudioDesc}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-f1red uppercase tracking-wider">
                  <span>{strings.spotlightStudioCta}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>

            {/* Spotlight 2: Track Action Thrills */}
            <div
              onClick={() => setActiveTab('gallery')}
              className="group relative rounded-sm overflow-hidden bg-studio-950 border border-studio-300 shadow-subtle hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-studio-950">
                <img
                  src="/images/gallery/mcl38_action.jpg"
                  alt="McLaren MCL38 Marina Bay Action"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                <span className="absolute top-4 left-4 px-2.5 py-1 bg-f1red text-[9.5px] font-mono uppercase tracking-wider text-white font-bold rounded-xs shadow-xs">
                  {strings.spotlightActionTitle}
                </span>
              </div>
              <div className="p-6 bg-studio-950 text-white flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-display font-bold text-white group-hover:text-yellow-400 transition-colors mb-2">
                    {strings.spotlightActionSubtitle}
                  </h3>
                  <p className="text-xs font-body text-white/70 leading-relaxed font-light mb-6">
                    {strings.spotlightActionDesc}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-yellow-400 uppercase tracking-wider">
                  <span>{strings.spotlightActionCta}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
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
