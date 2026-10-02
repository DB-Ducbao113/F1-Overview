import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigationStore } from '../../store/useNavigationStore';
import { t } from '../../i18n/translations';

export const Footer: React.FC = React.memo(() => {
  const { lang } = useNavigationStore();
  const strings = t[lang].footer;
  const navStrings = t[lang].nav;

  return (
    <footer className="bg-studio-950 text-white border-t border-studio-800 pt-16 pb-12 mt-auto">
      <div className="page-container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Info */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 rounded-full border-2 border-f1red flex items-center justify-center bg-white">
                <span className="text-[10px] font-black text-studio-950">F1</span>
              </span>
              <span className="font-display text-lg uppercase tracking-wider font-bold text-white">
                Ground Effect Hub
              </span>
            </div>
            <p className="text-sm text-studio-400 font-light leading-relaxed max-w-md mb-6">
              {strings.desc}
            </p>
            <p className="text-xs text-studio-500 font-light leading-relaxed max-w-lg">
              {strings.disclaimer}
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-studio-300 mb-4">
              {strings.colExplore}
            </h4>
            <ul className="space-y-2.5 text-xs text-studio-400 font-medium">
              <li>
                <Link to="/" className="hover:text-f1red transition-colors">
                  {navStrings.home}
                </Link>
              </li>
              <li>
                <Link to="/season/2026" className="hover:text-f1red transition-colors">
                  {navStrings.championship}
                </Link>
              </li>
              <li>
                <Link to="/showroom" className="hover:text-f1red transition-colors">
                  {navStrings.collection}
                </Link>
              </li>
              <li>
                <Link to="/teams" className="hover:text-f1red transition-colors">
                  {lang === 'vi' ? 'Danh sách đội đua' : 'Teams'}
                </Link>
              </li>
              <li>
                <Link to="/drivers" className="hover:text-f1red transition-colors">
                  {lang === 'vi' ? 'Danh sách tay đua' : 'Drivers'}
                </Link>
              </li>
            </ul>
            <Link
              to="/about"
              className="inline-block mt-4 text-xs text-studio-400 hover:text-f1red transition-colors"
            >
              {lang === 'vi' ? 'Về dự án' : 'About'}
            </Link>
          </div>

          {/* Legal & Provenance */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-studio-300 mb-4">
              {strings.colLegal}
            </h4>
            <div className="space-y-2 text-xs text-studio-400 leading-relaxed font-light">
              <p>
                Photography: LAT Images, DPPI, Motorsport Images, Red Bull Media House, Official F1
                Team Press Kits.
              </p>
              <p className="text-studio-500">
                All rights reserved to their respective copyright holders.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="border-t border-studio-800/80 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-studio-500">
          <p>{strings.copyright}</p>
          <div className="flex items-center gap-4">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>2026 Ground Effect Hub · Curated by BaoBungBu</span>
          </div>
        </div>
      </div>
    </footer>
  );
});
