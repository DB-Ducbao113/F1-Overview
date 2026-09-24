import React, { useState, useEffect } from 'react';
import { useCarStore } from '../../store/useCarStore';
import { NavTab } from '../../types';
import { t } from '../../i18n/translations';
import { Menu, X, Globe } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { activeTab, setActiveTab, lang, setLang } = useCarStore();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const strings = t[lang].nav;

  const NAV_ITEMS: { id: NavTab; label: string }[] = [
    { id: 'home',    label: strings.overview },
    { id: 'models',  label: strings.models   },
    { id: 'compare', label: strings.compare  },
    { id: 'gallery', label: strings.gallery  },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNav = (id: NavTab) => {
    setActiveTab(id);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* ── Fixed Navbar (White Luxury Studio) ── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md border-b border-studio-300 shadow-subtle'
            : 'bg-white/80 backdrop-blur-sm border-b border-studio-200'
        }`}
        style={{ height: 64 }}
      >
        <div className="page-container h-full flex items-center justify-between gap-6">

          {/* Left — Logo mark */}
          <button
            onClick={() => handleNav('home')}
            className="flex items-center gap-3 group shrink-0"
            aria-label="F1 Ground Effect Home"
          >
            {/* F1 ring emblem */}
            <span className="w-8 h-8 rounded-full border-2 border-f1red flex items-center justify-center bg-white shadow-subtle">
              <span className="text-[10px] font-body font-black text-studio-950 tracking-tight">F1</span>
            </span>
            {/* Wordmark */}
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-[12px] font-body uppercase tracking-widest2 text-studio-950 font-bold group-hover:text-f1red transition-colors duration-200 leading-tight">
                Ground Effect
              </span>
              <span className="text-[9px] font-body uppercase tracking-widest text-studio-500 font-medium">
                {strings.brandSub}
              </span>
            </div>
          </button>

          {/* Center — Navigation links */}
          <nav className="hidden md:flex items-center gap-7 lg:gap-9" aria-label="Main navigation">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`nav-link pb-1 ${activeTab === item.id ? 'nav-link-active' : ''}`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right — Language Switcher + CTA */}
          <div className="flex items-center gap-3 shrink-0">
            {/* ── Language Switcher Toggle [ VI | EN ] ── */}
            <div className="flex items-center bg-studio-200 p-0.5 rounded-full border border-studio-300">
              <button
                onClick={() => setLang('vi')}
                className={`px-2.5 py-1 rounded-full text-[10px] font-body uppercase tracking-wider font-bold transition-all duration-200 ${
                  lang === 'vi'
                    ? 'bg-white text-f1red shadow-subtle'
                    : 'text-studio-600 hover:text-studio-950'
                }`}
                title="Tiếng Việt"
              >
                VI
              </button>
              <button
                onClick={() => setLang('en')}
                className={`px-2.5 py-1 rounded-full text-[10px] font-body uppercase tracking-wider font-bold transition-all duration-200 ${
                  lang === 'en'
                    ? 'bg-white text-f1red shadow-subtle'
                    : 'text-studio-600 hover:text-studio-950'
                }`}
                title="English"
              >
                EN
              </button>
            </div>

            {/* 3D Action CTA */}
            <button
              onClick={() => handleNav('models')}
              className="hidden md:inline-flex btn-primary"
            >
              {strings.view3d}
            </button>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 text-studio-700 hover:text-studio-950 transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile Fullscreen Menu (White Theme) ── */}
      <div
        className={`fixed inset-0 z-40 bg-white flex flex-col justify-center items-center gap-6 transition-all duration-300 md:hidden ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Language switch on mobile menu */}
        <div className="flex items-center gap-2 mb-4 bg-studio-100 p-1 rounded-full border border-studio-300">
          <Globe className="w-3.5 h-3.5 text-studio-500 ml-2" />
          <button
            onClick={() => setLang('vi')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
              lang === 'vi' ? 'bg-f1red text-white' : 'text-studio-600'
            }`}
          >
            Tiếng Việt
          </button>
          <button
            onClick={() => setLang('en')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
              lang === 'en' ? 'bg-f1red text-white' : 'text-studio-600'
            }`}
          >
            English
          </button>
        </div>

        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNav(item.id)}
            className={`text-2xl font-display font-medium tracking-wide transition-colors ${
              activeTab === item.id ? 'text-f1red' : 'text-studio-800 hover:text-f1red'
            }`}
          >
            {item.label}
          </button>
        ))}

        <button
          onClick={() => handleNav('models')}
          className="mt-6 btn-primary"
        >
          {strings.view3d}
        </button>
      </div>
    </>
  );
};
