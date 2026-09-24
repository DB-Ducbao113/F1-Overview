import React from 'react';
import { useCarStore } from '../../store/useCarStore';
import { t } from '../../i18n/translations';

export const Footer: React.FC = () => {
  const { lang, setActiveTab } = useCarStore();
  const strings = t[lang].footer;

  return (
    <footer className="border-t border-studio-200 bg-white">
      <div className="page-container py-12 md:py-16">
        {/* Top row */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-10 mb-12">

          {/* Brand */}
          <div className="shrink-0">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 rounded-full border-2 border-f1red flex items-center justify-center bg-white shadow-subtle">
                <span className="text-[10px] font-body font-black text-studio-950">F1</span>
              </span>
              <span className="text-[12px] font-body uppercase tracking-widest2 text-studio-950 font-bold">
                Ground Effect
              </span>
            </div>
            <p className="text-[12px] font-body text-studio-600 max-w-xs leading-relaxed font-light">
              {strings.desc}
            </p>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-[11px] font-body uppercase tracking-wider">
            <div>
              <p className="text-studio-400 mb-4 tracking-widest2 font-semibold">{strings.colExplore}</p>
              {[
                { label: t[lang].nav.overview, tab: 'home' as const },
                { label: t[lang].nav.models,   tab: 'models' as const },
                { label: t[lang].nav.compare,  tab: 'compare' as const },
                { label: t[lang].nav.gallery,  tab: 'gallery' as const },
              ].map(item => (
                <button
                  key={item.label}
                  onClick={() => {
                    setActiveTab(item.tab);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="block text-studio-700 hover:text-f1red cursor-pointer transition-colors mb-2.5 text-left"
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div>
              <p className="text-studio-400 mb-4 tracking-widest2 font-semibold">{strings.colCars}</p>
              {['Red Bull RB20', 'Ferrari SF-24', 'McLaren MCL38', 'Mercedes W15'].map(l => (
                <p key={l} className="text-studio-700 hover:text-f1red cursor-pointer transition-colors mb-2.5">{l}</p>
              ))}
            </div>

            <div>
              <p className="text-studio-400 mb-4 tracking-widest2 font-semibold">{strings.colTech}</p>
              {['Ground Effect', 'Venturi Floor', 'DRS Aerodynamics', '1.6L Hybrid V6', 'Active Aero 2026'].map(l => (
                <p key={l} className="text-studio-700 hover:text-f1red cursor-pointer transition-colors mb-2.5">{l}</p>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="border-t border-studio-200 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[10px] font-body text-studio-500 uppercase tracking-widest2">
            {strings.copyright}
          </p>
          <a
            href="https://github.com/DB-Ducbao113/F1-Overview"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] font-body text-studio-600 hover:text-f1red uppercase tracking-widest2 transition-colors font-medium"
          >
            {strings.repo}
          </a>
        </div>
      </div>
    </footer>
  );
};
