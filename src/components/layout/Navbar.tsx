import React, { useState, useEffect } from 'react';
import { useNavigationStore } from '../../store/useNavigationStore';
import { useAuthStore } from '../../store/useAuthStore';
import { AdminLoginModal } from '../auth/AdminLoginModal';
import { NavTab } from '../../types';
import { t } from '../../i18n/translations';
import { Menu, X, Trophy, LayoutGrid, Home, ShieldCheck, LogOut, KeyRound } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { activeTab, setActiveTab, lang, setLang } = useNavigationStore();
  const { user, isAdmin, logout } = useAuthStore();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  const strings = t[lang].nav;

  const NAV_ITEMS: { id: NavTab; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: strings.home, icon: <Home className="w-4 h-4" /> },
    { id: 'championship', label: strings.championship, icon: <Trophy className="w-4 h-4" /> },
    { id: 'collection', label: strings.collection, icon: <LayoutGrid className="w-4 h-4" /> },
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
          <button
            onClick={() => handleNav('home')}
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
          </button>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
            {NAV_ITEMS.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`flex items-center gap-2 py-1 text-[12px] font-bold uppercase tracking-wider transition-all duration-200 border-b-2 ${
                    isActive
                      ? 'border-f1red text-f1red'
                      : 'border-transparent text-studio-600 hover:text-studio-950 hover:border-studio-300'
                  }`}
                >
                  <span className={isActive ? 'text-f1red' : 'text-studio-400'}>{item.icon}</span>
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right — Language Selector & Mobile Toggle */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Admin Profile Chip or Key Button */}
            {isAdmin && user ? (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 text-[11px] font-mono font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden sm:inline">@{user.username}</span>
                <button
                  onClick={logout}
                  className="hover:text-f1red transition-colors p-0.5"
                  title="Đăng xuất Admin"
                >
                  <LogOut className="w-3 h-3 text-studio-500 hover:text-f1red" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setLoginModalOpen(true)}
                className="p-1.5 rounded-full text-studio-500 hover:text-studio-950 hover:bg-studio-100 transition-colors"
                title="Đăng nhập Quản Trị Viên (Admin)"
              >
                <KeyRound className="w-4 h-4 text-studio-600" />
              </button>
            )}

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
              className="md:hidden p-2 text-studio-700 hover:text-studio-950 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Admin Login Modal from Navbar */}
      <AdminLoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
      />

      {/* Mobile Drawer Menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden animate-fade-in" onClick={() => setMenuOpen(false)}>
          <div
            className="fixed top-16 left-0 right-0 bg-white border-b border-studio-300 shadow-xl p-6 flex flex-col gap-4 animate-slide-down"
            onClick={(e) => e.stopPropagation()}
          >
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`flex items-center gap-3 p-3 rounded-md text-sm font-bold uppercase tracking-wider text-left transition-colors ${
                  activeTab === item.id
                    ? 'bg-f1red/10 text-f1red'
                    : 'text-studio-700 hover:bg-studio-100'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
};
