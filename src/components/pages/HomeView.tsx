import React, { useEffect, useRef } from 'react';
import { useCarStore } from '../../store/useCarStore';
import { CARS_DATA } from '../../data/cars';
import { CarId } from '../../types';
import { t } from '../../i18n/translations';
import { ArrowRight, ChevronDown } from 'lucide-react';

const fmt = (n: number) => n.toLocaleString('en-US');

export const HomeView: React.FC = () => {
  const { openCarIn3D, setActiveTab, lang } = useCarStore();
  const cars = Object.values(CARS_DATA);
  const heroRef = useRef<HTMLDivElement>(null);
  const strings = t[lang].home;

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const handle = () => {
      const y = window.scrollY;
      el.style.setProperty('--parallax-y', `${y * 0.3}px`);
    };
    window.addEventListener('scroll', handle, { passive: true });
    return () => window.removeEventListener('scroll', handle);
  }, []);

  return (
    <div className="bg-studio-100 text-studio-900">

      {/* ══════════════════════════════════════════════════════
          1.  HERO — White Luxury Editorial Opener
          ══════════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative hero-height flex flex-col justify-end overflow-hidden bg-gradient-to-b from-white via-studio-50 to-studio-100"
        style={{ paddingTop: 64 }}
      >
        {/* Subtle engineering grid overlay for white background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(to bottom, rgba(255,255,255,0.4) 0%, rgba(250,250,250,0.95) 100%),
              repeating-linear-gradient(0deg, transparent, transparent 59px, rgba(0,0,0,0.03) 60px),
              repeating-linear-gradient(90deg, transparent, transparent 59px, rgba(0,0,0,0.03) 60px)
            `
          }}
        />

        {/* Soft Red Ambient Glow */}
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, rgba(225,6,0,0.06) 0%, transparent 70%)' }}
        />

        {/* Statline — Top right corner (White Studio Porsche style) */}
        <div className="absolute top-20 right-6 lg:right-20 flex flex-col items-end gap-5">
          {[
            { label: strings.stats.hp,              value: '1,055',  unit: strings.stats.bhpUnit },
            { label: strings.stats.downforce,       value: '1,880',  unit: strings.stats.kgfUnit },
            { label: strings.stats.groundClearance, value: '15–25',  unit: strings.stats.mmUnit  },
          ].map((s) => (
            <div key={s.label} className="text-right">
              <span className="spec-label block">{s.label}</span>
              <span className="text-2xl font-display font-semibold text-studio-950 tracking-tight leading-none">
                {s.value}
                <span className="text-xs font-body text-studio-500 ml-1 font-normal">{s.unit}</span>
              </span>
            </div>
          ))}
        </div>

        {/* Main headline */}
        <div className="page-container pb-14 relative z-10">
          <span className="label-overline mb-3 block animate-fade-in-up"
            style={{ animationDelay: '100ms' }}>
            {strings.eraBadge}
          </span>

          <h1
            className="heading-display text-5xl sm:text-7xl lg:text-[84px] font-light italic mb-1 animate-fade-in-up"
            style={{ animationDelay: '200ms' }}
          >
            {strings.heroTitle1}
          </h1>
          <h1
            className="heading-display text-5xl sm:text-7xl lg:text-[84px] font-bold mb-6 animate-fade-in-up text-studio-950"
            style={{ animationDelay: '280ms' }}
          >
            {strings.heroTitle2}
          </h1>

          {/* Thin red accent line */}
          <div className="w-16 h-[2px] bg-f1red mb-7 animate-line-grow" style={{ animationDelay: '400ms' }} />

          <p
            className="text-studio-600 text-sm max-w-md leading-relaxed mb-10 font-body font-light animate-fade-in-up"
            style={{ animationDelay: '450ms' }}
          >
            {strings.heroDesc}
          </p>

          <div className="flex items-center gap-4 animate-fade-in-up" style={{ animationDelay: '550ms' }}>
            <button onClick={() => setActiveTab('gallery')} className="btn-primary">
              {strings.explore3d}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => setActiveTab('models')} className="btn-ghost">
              {strings.viewAnatomy}
            </button>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-studio-400 animate-bounce">
          <span className="text-[9px] font-body uppercase tracking-widest2 font-semibold">{strings.scroll}</span>
          <ChevronDown className="w-4 h-4 text-studio-400" />
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════
          2.  THE CARS — Model Range Grid (White Porsche showroom style)
          ══════════════════════════════════════════════════════ */}
      <section className="page-section border-t border-studio-200 bg-white">
        <div className="page-container">

          {/* Section header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="label-overline mb-2 block">{strings.modelRange.badge}</span>
              <h2 className="heading-display text-3xl sm:text-5xl font-light">
                {strings.modelRange.title}
              </h2>
            </div>
            <p className="text-[12px] font-body text-studio-600 leading-relaxed max-w-sm font-light">
              {strings.modelRange.desc}
            </p>
          </div>

          {/* Car grid — Responsive columns for 11 official teams */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {cars.map((car) => (
              <div
                key={car.id}
                className="model-card rounded-sm relative group flex flex-col justify-between"
                onClick={() => openCarIn3D(car.id as CarId)}
              >
                {/* Livery colour strip */}
                <div
                  className="w-full h-1.5"
                  style={{ background: `linear-gradient(90deg, ${car.primaryColor}, ${car.accentColor})` }}
                />

                <div className="p-7">
                  {/* Team label */}
                  <span className="label-overline mb-3 block text-studio-500 font-semibold">
                    {car.team}
                  </span>

                  {/* Model name */}
                  <h3 className="font-display text-2xl font-semibold text-studio-950 mb-1 group-hover:text-f1red transition-colors duration-200">
                    {car.shortName}
                  </h3>
                  <p className="text-[11px] font-body text-studio-500 mb-6 leading-relaxed">
                    {car.name}
                  </p>

                  {/* Spec rows */}
                  <div className="space-y-0 divide-y divide-studio-200 mb-6">
                    <div className="stat-block">
                      <span className="spec-label">{strings.modelRange.puLabel}</span>
                      <span className="spec-value text-xs font-medium text-studio-800 leading-snug">{car.engine}</span>
                    </div>
                    <div className="stat-block">
                      <span className="spec-label">{strings.modelRange.powerLabel}</span>
                      <span className="spec-value">{fmt(car.horsepower)} bhp</span>
                    </div>
                    <div className="stat-block">
                      <span className="spec-label">{strings.modelRange.downforceLabel}</span>
                      <span className="spec-value">{fmt(car.downforceAt250KmhKgf)} kgf</span>
                    </div>
                  </div>

                  {/* Drivers */}
                  <div className="pt-2 border-t border-studio-200 flex items-center justify-between">
                    <div>
                      <span className="text-[9px] font-body uppercase tracking-widest text-studio-400 font-semibold block mb-1">
                        {strings.modelRange.driversLabel}
                      </span>
                      <p className="text-[11px] font-body text-studio-700 font-medium">
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
          3.  FEATURES — 3-Column Photo-first Strip
          ══════════════════════════════════════════════════════ */}
      <section className="page-section border-t border-studio-200 bg-studio-100">
        <div className="page-container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {strings.features.map((f, idx) => {
              const tabTarget = idx === 0 ? 'models' : idx === 1 ? 'gallery' : 'compare';
              return (
                <div key={f.no} className="bg-white p-9 border border-studio-300 rounded-sm shadow-subtle flex flex-col justify-between min-h-[280px]">
                  <div>
                    <span className="text-[11px] font-body text-studio-400 font-bold tracking-widest block mb-4">{f.no}</span>
                    <h3 className="heading-display text-2xl font-semibold mb-3 text-studio-950">{f.title}</h3>
                    <p className="text-[12px] font-body font-light text-studio-600 leading-relaxed">{f.desc}</p>
                  </div>
                  <button
                    onClick={() => setActiveTab(tabTarget as any)}
                    className="mt-8 flex items-center gap-2 text-[11px] font-body uppercase tracking-widest font-semibold text-studio-800 hover:text-f1red transition-colors group"
                  >
                    {f.cta}
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
