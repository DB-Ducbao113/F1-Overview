import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useNavigationStore } from '../../store/useNavigationStore';
import { t } from '../../i18n/translations';
import { Menu, X, Trophy, Home, Box } from 'lucide-react';

export const Navbar: React.FC = React.memo(() => {
  const { lang, setLang } = useNavigationStore();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const strings = t[lang].nav;

  const NAV_ITEMS = useMemo(
    () => [
      { id: 'home', path: '/', label: strings.home, icon: <Home className="w-4 h-4" /> },
      {
        id: 'championship',
        path: '/season/2026',
        label: strings.championship,
        icon: <Trophy className="w-4 h-4" />,
      },
      {
        id: 'collection',
        path: '/showroom',
        label: strings.collection,
        icon: <Box className="w-4 h-4" />,
      },
    ],
    [strings],
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md border-b border-studio-300 shadow-subtle'
            : 'bg-white/85 backdrop-blur-sm border-b border-studio-200'
        }`}
        style={{ height: 64 }}
      >
        <div className="page-container h-full flex items-center justify-between gap-6">
          {/* Brand Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 group shrink-0 text-left focus:outline-none"
            aria-label="Formula 1 Hub"
          >
            <span className="w-9 h-9 rounded-full border-2 border-f1red flex items-center justify-center bg-white shadow-subtle group-hover:scale-105 transition-transform duration-200">
              <span className="text-[11px] font-black text-studio-950 tracking-tight">F1</span>
            </span>
            <div className="flex flex-col">
              <span className="text-[13px] font-display uppercase tracking-widest font-black text-studio-950 group-hover:text-f1red transition-colors duration-200 leading-tight">
                {strings.brandTitle}
              </span>
              <span className="text-[9px] uppercase tracking-widest text-studio-500 font-semibold">
                {strings.brandSub}
              </span>
            </div>
          </Link>

          {/* Center Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6" aria-label="Main navigation">
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.id === 'home'
                  ? location.pathname === '/'
                  : item.id === 'championship'
                    ? location.pathname.startsWith('/season') ||
                      location.pathname.startsWith('/teams') ||
                      location.pathname.startsWith('/drivers')
                    : location.pathname.startsWith('/showroom') ||
                      location.pathname.startsWith('/gallery');
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`flex items-center gap-2 py-1 text-[13px] font-bold uppercase tracking-wider transition-all duration-200 border-b-2 ${
                    isActive
                      ? 'border-f1red text-f1red'
                      : 'border-transparent text-studio-600 hover:text-studio-950 hover:border-studio-300'
                  }`}
                >
                  <span className={isActive ? 'text-f1red' : 'text-studio-400'}>{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right — Language Selector & Mobile Toggle */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Language Switcher */}
            <div className="flex items-center bg-studio-100 p-0.5 rounded-full border border-studio-200">
              <button
                onClick={() => setLang('vi')}
                className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-200 ${
                  lang === 'vi'
                    ? 'bg-f1red text-white shadow-sm'
                    : 'text-studio-600 hover:text-studio-950'
                }`}
                title="Tiếng Việt"
              >
                VI
              </button>
              <button
                onClick={() => setLang('en')}
                className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-200 ${
                  lang === 'en'
                    ? 'bg-f1red text-white shadow-sm'
                    : 'text-studio-600 hover:text-studio-950'
                }`}
                title="English"
              >
                EN
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2 text-studio-700 hover:text-studio-950 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden animate-fade-in"
          onClick={() => setMenuOpen(false)}
        >
          <div
            className="fixed top-16 left-0 right-0 bg-white border-b border-studio-300 shadow-xl p-6 flex flex-col gap-4 animate-slide-down"
            onClick={(e) => e.stopPropagation()}
          >
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.id === 'home'
                  ? location.pathname === '/'
                  : item.id === 'championship'
                    ? location.pathname.startsWith('/season') ||
                      location.pathname.startsWith('/teams') ||
                      location.pathname.startsWith('/drivers')
                    : location.pathname.startsWith('/showroom') ||
                      location.pathname.startsWith('/gallery');
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-3 p-3 rounded-md text-sm font-bold uppercase tracking-wider text-left transition-colors ${
                    isActive
                      ? 'bg-f1red/10 text-f1red font-black'
                      : 'text-studio-700 hover:bg-studio-100'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
});
