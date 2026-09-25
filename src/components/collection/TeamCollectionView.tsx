import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigationStore } from '../../store/useNavigationStore';
import { useCollectionStore } from '../../store/useCollectionStore';
import { TEAMS_DATA } from '../../data/teams';
import { TeamId, CollectionCategory } from '../../types';
import { ArrowLeft, X, ChevronLeft, ChevronRight, ExternalLink, Camera } from 'lucide-react';

interface TeamCollectionViewProps {
  teamId: TeamId;
  onBack: () => void;
}

const CATEGORY_LABELS: Record<string, { vi: string; en: string }> = {
  all: { vi: 'Tất cả', en: 'All' },
  car: { vi: 'Xe đua', en: 'Car' },
  race: { vi: 'Đường đua', en: 'Race' },
  driver: { vi: 'Tay đua', en: 'Driver' },
  team: { vi: 'Đội đua', en: 'Team' },
};

export const TeamCollectionView: React.FC<TeamCollectionViewProps> = ({ teamId, onBack }) => {
  const { lang } = useNavigationStore();
  const { activeSeason, activeCategory, setActiveSeason, setActiveCategory, items } = useCollectionStore();

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const team = TEAMS_DATA[teamId];
  const allItems = items.filter((item) => item.teamId === teamId);

  // Get available seasons for this team
  const seasons = [...new Set(allItems.map((item) => Number(item.season) || 2024))].sort((a, b) => b - a);

  // Filter items by season + category
  const filteredItems = allItems.filter((item) => {
    const seasonMatch = activeSeason === 'all' || (item.season && Number(item.season) === activeSeason);
    const categoryMatch = activeCategory === 'all' || item.category === activeCategory;
    return seasonMatch && categoryMatch;
  });

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const prevLightbox = () => setLightboxIndex((i) => (i !== null && i > 0 ? i - 1 : filteredItems.length - 1));
  const nextLightbox = () => setLightboxIndex((i) => (i !== null && i < filteredItems.length - 1 ? i + 1 : 0));

  const currentLightboxItem = lightboxIndex !== null ? filteredItems[lightboxIndex] : null;

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!currentLightboxItem) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      else if (e.key === 'ArrowLeft') prevLightbox();
      else if (e.key === 'ArrowRight') nextLightbox();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentLightboxItem, filteredItems.length]);

  if (!team) return null;

  return (
    <div className="bg-studio-100 min-h-screen pb-20 animate-fade-in">

      {/* ── Lightbox Modal ── */}
      {currentLightboxItem &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
            onClick={closeLightbox}
          >
          <div
            className="relative max-w-5xl w-full space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={closeLightbox}
              className="absolute -top-10 right-0 text-white/70 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Counter */}
            <div className="absolute -top-10 left-0 text-white/50 text-xs font-mono">
              {(lightboxIndex ?? 0) + 1} / {filteredItems.length}
            </div>

            {/* Main image */}
            <div className="relative rounded-xl overflow-hidden bg-studio-950">
              <img
                src={currentLightboxItem.imageUrl}
                alt={lang === 'vi' ? currentLightboxItem.titleVi : currentLightboxItem.titleEn}
                className="w-full max-h-[70vh] object-contain"
              />
              {/* Prev / Next arrows */}
              {filteredItems.length > 1 && (
                <>
                  <button
                    onClick={prevLightbox}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextLightbox}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Caption + Provenance */}
            <div className="bg-studio-950/80 rounded-xl p-5 space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="font-display font-black text-white text-base">
                    {lang === 'vi' ? currentLightboxItem.titleVi : currentLightboxItem.titleEn}
                  </h3>
                  <p className="text-studio-400 text-xs leading-relaxed">
                    {lang === 'vi' ? currentLightboxItem.captionVi : currentLightboxItem.captionEn}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  {currentLightboxItem.season && (
                    <span className="px-2 py-0.5 rounded-md bg-white/10 text-white text-[10px] font-bold">
                      {currentLightboxItem.season}
                    </span>
                  )}
                  <span className="px-2 py-0.5 rounded-md bg-white/10 text-white text-[10px] font-bold uppercase">
                    {currentLightboxItem.category}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-white/10 pt-3">
                <div>
                  <p className="text-[10px] text-studio-500 uppercase tracking-wider font-semibold">
                    {lang === 'vi' ? 'Nhiếp ảnh gia' : 'Photographer'}
                  </p>
                  <p className="text-white text-xs font-medium">{currentLightboxItem.photographer}</p>
                </div>
                <div>
                  <p className="text-[10px] text-studio-500 uppercase tracking-wider font-semibold">
                    {lang === 'vi' ? 'Nguồn ảnh' : 'Source'}
                  </p>
                  <p className="text-white text-xs font-medium">{currentLightboxItem.source}</p>
                </div>
                <div>
                  <p className="text-[10px] text-studio-500 uppercase tracking-wider font-semibold">
                    {lang === 'vi' ? 'Bản quyền' : 'License'}
                  </p>
                  <p className="text-white text-xs font-medium">{currentLightboxItem.license}</p>
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      <div className="page-container space-y-8 py-10">

        {/* ── Back navigation ── */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-studio-600 hover:text-f1red transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{lang === 'vi' ? 'Toàn bộ đội đua' : 'All Teams'}</span>
        </button>

        {/* ── Team Hero header ── */}
        <div
          className="relative rounded-2xl overflow-hidden p-8 sm:p-12"
          style={{
            background: `linear-gradient(135deg, ${team.primaryColor}cc 0%, ${team.primaryColor}88 40%, #0a0a0b 100%)`,
          }}
        >
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0 text-[200px] font-black text-white select-none flex items-center justify-center leading-none overflow-hidden"
              style={{ letterSpacing: '-0.05em' }}
            >
              {team.name.toUpperCase()}
            </div>
          </div>
          <div className="relative z-10 space-y-3">
            <div className="flex items-center gap-3">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: team.primaryColor }}
              />
              <span className="text-white/60 text-xs font-bold uppercase tracking-widest">
                F1 Collection
              </span>
            </div>
            <h1 className="font-display text-4xl sm:text-6xl font-black uppercase tracking-tight text-white leading-none">
              {team.name}
            </h1>
            <p className="text-white/70 text-sm font-light max-w-xl">{team.fullName}</p>
            {seasons.length > 0 && (
              <p className="text-white/50 text-xs font-semibold">
                {seasons[seasons.length - 1]} — {seasons[0]} · {allItems.length}{' '}
                {lang === 'vi' ? 'hình ảnh trong bộ sưu tập' : 'images in collection'}
              </p>
            )}
          </div>
        </div>

        {/* ── Filter Controls ── */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          {/* Season filter */}
          {seasons.length > 0 && (
            <div className="flex items-center gap-1 p-1 rounded-xl bg-white border border-studio-200 shadow-xs">
              <button
                onClick={() => setActiveSeason('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeSeason === 'all'
                    ? 'bg-studio-950 text-white shadow-xs'
                    : 'text-studio-600 hover:text-studio-950'
                }`}
              >
                {lang === 'vi' ? 'Tất cả' : 'All seasons'}
              </button>
              {seasons.map((s) => (
                <button
                  key={s}
                  onClick={() => setActiveSeason(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeSeason === s
                      ? 'bg-f1red text-white shadow-xs'
                      : 'text-studio-600 hover:text-studio-950'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Category filter */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-white border border-studio-200 shadow-xs flex-wrap">
            {(['all', 'car', 'race', 'driver', 'team'] as CollectionCategory[]).map((cat) => {
              const count = allItems.filter((i) => cat === 'all' || i.category === cat).length;
              if (count === 0 && cat !== 'all') return null;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all capitalize ${
                    activeCategory === cat
                      ? 'bg-f1red text-white shadow-xs'
                      : 'text-studio-600 hover:text-studio-950'
                  }`}
                >
                  {CATEGORY_LABELS[cat]?.[lang] ?? cat}
                  {cat !== 'all' && (
                    <span className="ml-1 opacity-60">({count})</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Photo Grid ── */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredItems.map((item, index) => (
              <button
                key={item.id}
                onClick={() => openLightbox(index)}
                className="group relative bg-white rounded-xl border border-studio-200 overflow-hidden shadow-subtle hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 text-left focus:outline-none focus:ring-2 focus:ring-f1red/30"
                aria-label={lang === 'vi' ? item.titleVi : item.titleEn}
              >
                {/* Image */}
                <div className="relative h-52 bg-studio-900 overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={lang === 'vi' ? item.titleVi : item.titleEn}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.opacity = '0';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Tags */}
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    <span className="px-2 py-0.5 rounded-full bg-black/50 backdrop-blur text-white text-[10px] font-bold uppercase">
                      {item.season}
                    </span>
                    <span
                      className="px-2 py-0.5 rounded-full text-white text-[10px] font-bold uppercase"
                      style={{ backgroundColor: team.primaryColor + 'cc' }}
                    >
                      {CATEGORY_LABELS[item.category]?.[lang] ?? item.category}
                    </span>
                  </div>

                  {/* Expand icon on hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="p-3 rounded-full bg-white/20 backdrop-blur">
                      <Camera className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>

                {/* Card info */}
                <div className="p-4 space-y-1.5">
                  <h3 className="font-bold text-sm text-studio-900 leading-tight line-clamp-1">
                    {lang === 'vi' ? item.titleVi : item.titleEn}
                  </h3>
                  <p className="text-xs text-studio-500 line-clamp-2 leading-relaxed">
                    {lang === 'vi' ? item.captionVi : item.captionEn}
                  </p>
                  {item.driver && (
                    <p className="text-[10px] text-f1red font-bold uppercase tracking-wider">
                      {item.driver}
                      {item.race ? ` · ${item.race}` : ''}
                    </p>
                  )}
                </div>
              </button>
            ))}
          </div>
        ) : (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-studio-200 flex items-center justify-center">
              <Camera className="w-7 h-7 text-studio-400" />
            </div>
            <p className="font-bold text-studio-700 text-sm">
              {lang === 'vi' ? 'Chưa có ảnh cho bộ lọc này' : 'No photos for this filter'}
            </p>
            <p className="text-xs text-studio-500 max-w-xs">
              {lang === 'vi'
                ? 'Thử chọn "Tất cả" để xem toàn bộ ảnh của đội đua này.'
                : 'Try selecting "All" to see all images for this team.'}
            </p>
          </div>
        )}

        {/* ── Team Info ── */}
        <div className="bg-white rounded-2xl border border-studio-200 p-6 space-y-4">
          <h2 className="font-display font-black text-lg uppercase text-studio-950">
            {lang === 'vi' ? 'Thông tin đội đua' : 'Team Information'}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            {[
              { label: lang === 'vi' ? 'Đội đua' : 'Team', value: team.fullName },
              { label: lang === 'vi' ? 'Trụ sở' : 'Base', value: team.base },
              { label: lang === 'vi' ? 'Team Principal' : 'Team Principal', value: team.teamPrincipal },
              { label: lang === 'vi' ? 'Power Unit' : 'Power Unit', value: team.powerUnit.split(' ').slice(0, 3).join(' ') },
            ].map(({ label, value }) => (
              <div key={label} className="space-y-1">
                <p className="text-[10px] text-studio-500 uppercase tracking-wider font-bold">{label}</p>
                <p className="font-semibold text-studio-900 leading-tight">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
