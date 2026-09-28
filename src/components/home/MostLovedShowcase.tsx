import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useNavigationStore } from '../../store/useNavigationStore';
import {
  getTopFavoriteCollectionItems,
  FAVORITE_SELECTION_RULES,
} from '../../data/collections';
import { TEAMS_DATA } from '../../data/teams';
import { CollectionItem } from '../../types';
import {
  Heart,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Info,
  X,
  Play,
  Pause,
  ArrowRight,
  Trophy,
  Camera,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export const MostLovedShowcase: React.FC = () => {
  const { lang, setActiveTab } = useNavigationStore();
  const topItems = getTopFavoriteCollectionItems(6);

  // Active index for sliding
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [showRulesModal, setShowRulesModal] = useState(false);

  // Escape key handler for rules modal
  useEffect(() => {
    if (!showRulesModal) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowRulesModal(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showRulesModal]);

  // Local likes tracking
  const [userLikedMap, setUserLikedMap] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('f1_user_likes_map');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [likeCountDelta, setLikeCountDelta] = useState<Record<string, number>>({});

  // Slide auto-play interval
  useEffect(() => {
    if (!isPlaying || isHovered) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % topItems.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [isPlaying, isHovered, topItems.length]);

  const toggleLike = (item: CollectionItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const isLiked = !!userLikedMap[item.id];
    const newLiked = !isLiked;

    const newMap = { ...userLikedMap, [item.id]: newLiked };
    setUserLikedMap(newMap);
    try {
      localStorage.setItem('f1_user_likes_map', JSON.stringify(newMap));

      // Also sync to collection wishlist
      const savedWishlist = localStorage.getItem('f1_collection_wishlist');
      let wishlistArr: string[] = savedWishlist ? JSON.parse(savedWishlist) : [];
      if (newLiked && !wishlistArr.includes(item.id)) {
        wishlistArr.push(item.id);
      } else if (!newLiked) {
        wishlistArr = wishlistArr.filter((id) => id !== item.id);
      }
      localStorage.setItem('f1_collection_wishlist', JSON.stringify(wishlistArr));
    } catch {
      // Ignore localStorage error
    }

    setLikeCountDelta((prev) => ({
      ...prev,
      [item.id]: (prev[item.id] || 0) + (newLiked ? 1 : -1),
    }));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % topItems.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + topItems.length) % topItems.length);
  };

  const currentItem = topItems[currentIndex];
  const team = TEAMS_DATA[currentItem.teamId];
  const isCurrentLiked = !!userLikedMap[currentItem.id];
  const currentLikes = (currentItem.likes || 0) + (likeCountDelta[currentItem.id] || 0);

  const RANK_COLORS = [
    'from-amber-400 to-yellow-600 text-yellow-950', // #1 Gold
    'from-slate-200 to-slate-400 text-slate-900', // #2 Silver
    'from-amber-600 to-amber-800 text-amber-100', // #3 Bronze
    'from-studio-700 to-studio-900 text-white', // #4
    'from-studio-700 to-studio-900 text-white', // #5
    'from-studio-700 to-studio-900 text-white', // #6
  ];

  return (
    <section className="page-container space-y-6">
      {/* ── Header Row ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-studio-200 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 border border-pink-200 text-f1red text-[11px] font-bold uppercase tracking-wider mb-2">
            <Heart className="w-3.5 h-3.5 fill-current" />
            <span>
              {lang === 'vi' ? 'Tuyển Chọn Được Yêu Thích Nhất' : 'Most Loved Showcase'}
            </span>
          </div>
          <h2 className="font-display text-2xl sm:text-4xl font-black uppercase tracking-tight text-studio-950">
            {lang === 'vi' ? 'Tiêu Điểm Bình Chọn Cộng Đồng' : 'Community Top Favorites'}
          </h2>
          <p className="text-xs sm:text-sm text-studio-500 font-light mt-1">
            {lang === 'vi'
              ? 'Top 6 tác phẩm đại diện cho các đội đua dẫn đầu về lượt tim và tương tác tuyển chọn.'
              : 'The top 6 standout masterpieces across official constructors with the highest community love.'}
          </p>
        </div>

        {/* Action Buttons & Rules CTA */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          {/* Rules Button */}
          <button
            onClick={() => setShowRulesModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-studio-200 text-xs font-bold text-studio-700 hover:text-f1red hover:border-f1red transition-colors shadow-xs"
          >
            <Info className="w-3.5 h-3.5 text-f1red" />
            <span>{lang === 'vi' ? 'Quy Tắc Tuyển Chọn' : 'Selection Rules'}</span>
          </button>

          {/* View All in Collection */}
          <button
            onClick={() => {
              setActiveTab('collection');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-studio-950 text-white text-xs font-bold uppercase tracking-wider hover:bg-f1red transition-colors shadow-xs"
          >
            <span>{lang === 'vi' ? 'Vào Bộ Sưu Tập' : 'View Full Showcase'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ── Main Sliding Showcase Container ── */}
      <div
        className="relative bg-studio-950 rounded-3xl overflow-hidden shadow-2xl border border-studio-800"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Top Team Color Accent Line */}
        <div
          className="absolute top-0 left-0 right-0 h-1.5 z-20 transition-all duration-700"
          style={{ backgroundColor: team?.primaryColor || '#e80020' }}
        />

        {/* Slide Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[460px] lg:min-h-[520px]">
          {/* Left Visual Area (7 cols on desktop) */}
          <div
            className="lg:col-span-7 relative overflow-hidden bg-studio-900 cursor-pointer group"
            onClick={() => {
              setActiveTab('collection');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            {/* Smooth crossfading picture */}
            <img
              key={currentItem.id}
              src={currentItem.imageUrl}
              alt={lang === 'vi' ? currentItem.titleVi : currentItem.titleEn}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              loading="lazy"
            />

            {/* Gradient Dark Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

            {/* Rank Podium Badge */}
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
              <div
                className={`px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider bg-gradient-to-r shadow-lg ${
                  RANK_COLORS[currentIndex] || 'bg-studio-800 text-white'
                }`}
              >
                #{currentIndex + 1} {lang === 'vi' ? 'YÊU THÍCH NHẤT' : 'MOST LOVED'}
              </div>

              <span
                className="px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider text-white shadow-md backdrop-blur-md"
                style={{ backgroundColor: (team?.primaryColor || '#e80020') + 'dd' }}
              >
                {team?.name}
              </span>
            </div>

            {/* Interactive Tim (Heart) Button overlay */}
            <button
              onClick={(e) => toggleLike(currentItem, e)}
              className={`absolute top-4 right-4 z-20 flex items-center gap-2 px-3.5 py-2 rounded-2xl backdrop-blur-md text-xs font-black shadow-xl transition-all active:scale-95 ${
                isCurrentLiked
                  ? 'bg-f1red text-white ring-2 ring-white/30'
                  : 'bg-black/60 text-white hover:bg-white hover:text-f1red'
              }`}
              title={isCurrentLiked ? 'Đã yêu thích' : 'Thả tim tác phẩm'}
            >
              <Heart
                className={`w-4 h-4 transition-transform ${
                  isCurrentLiked ? 'fill-current scale-110' : ''
                }`}
              />
              <span>{currentLikes.toLocaleString()}</span>
            </button>

            {/* Bottom Left Image Attribution */}
            <div className="absolute bottom-4 left-4 right-4 pointer-events-none text-white/80 text-xs">
              <p className="font-mono text-[10px] text-white/60">{currentItem.sku}</p>
              <p className="font-semibold truncate">
                📸 {currentItem.photographer} · {currentItem.source}
              </p>
            </div>
          </div>

          {/* Right Information Area (5 cols on desktop) */}
          <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between bg-gradient-to-b from-studio-950 to-studio-900 text-white space-y-6">
            <div className="space-y-4">
              {/* Category & Tag chips */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-1 rounded-lg bg-white/10 text-white text-[10px] font-bold uppercase tracking-wider">
                  {currentItem.category}
                </span>
                {currentItem.badge && (
                  <span className="px-2.5 py-1 rounded-lg bg-f1red/20 text-f1red text-[10px] font-bold uppercase tracking-wider border border-f1red/30">
                    {currentItem.badge}
                  </span>
                )}
                <span className="px-2.5 py-1 rounded-lg bg-white/5 text-studio-400 text-[10px] font-mono flex items-center gap-1">
                  🗓️ {currentItem.publishedAt || '25/09/2026'}
                </span>
              </div>

              {/* Title */}
              <h3 className="font-display font-black text-2xl sm:text-3xl uppercase tracking-tight text-white leading-tight">
                {lang === 'vi' ? currentItem.titleVi : currentItem.titleEn}
              </h3>

              {/* Description */}
              <p className="text-xs sm:text-sm text-studio-300 font-light leading-relaxed">
                {lang === 'vi' ? currentItem.captionVi : currentItem.captionEn}
              </p>

              {/* Technical Attribute Specs Grid */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/10 text-xs">
                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <span className="block text-[10px] uppercase font-bold text-studio-400">
                    {lang === 'vi' ? 'Đội Đua' : 'Constructor'}
                  </span>
                  <span className="font-semibold text-white truncate block">
                    {team?.fullName}
                  </span>
                </div>

                {currentItem.driver && (
                  <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                    <span className="block text-[10px] uppercase font-bold text-studio-400">
                      {lang === 'vi' ? 'Tay Đua' : 'Driver'}
                    </span>
                    <span className="font-semibold text-f1red truncate block">
                      {currentItem.driver}
                    </span>
                  </div>
                )}

                {currentItem.race && (
                  <div className="p-3 rounded-xl bg-white/5 border border-white/5 col-span-2">
                    <span className="block text-[10px] uppercase font-bold text-studio-400">
                      {lang === 'vi' ? 'Chặng Đua' : 'Grand Prix Circuit'}
                    </span>
                    <span className="font-semibold text-white truncate block">
                      📍 {currentItem.race}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Controls & Slide CTA */}
            <div className="space-y-4 pt-4 border-t border-white/10">
              <div className="flex items-center justify-between">
                {/* Auto-play toggle & Index indicator */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors"
                    title={isPlaying ? 'Tạm dừng trượt' : 'Tiếp tục tự động trượt'}
                  >
                    {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  </button>

                  <span className="text-xs font-mono text-studio-400">
                    {currentIndex + 1} / {topItems.length}
                  </span>
                </div>

                {/* Arrow navigation buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrev}
                    className="p-2.5 rounded-xl bg-white/10 text-white hover:bg-white hover:text-studio-950 transition-colors"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="p-2.5 rounded-xl bg-white/10 text-white hover:bg-white hover:text-studio-950 transition-colors"
                    aria-label="Next slide"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Pagination Dots */}
              <div className="flex items-center gap-1.5 justify-center">
                {topItems.map((item, idx) => (
                  <button
                    key={item.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-1.5 rounded-full transition-all ${
                      idx === currentIndex
                        ? 'w-8 bg-f1red'
                        : 'w-2 bg-white/20 hover:bg-white/40'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Selection Rules Modal ── */}
      {showRulesModal &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
            onClick={() => setShowRulesModal(false)}
          >
            <div
              className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-studio-200 animate-scale-up"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-studio-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-f1red/10 flex items-center justify-center text-f1red font-bold">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-black text-lg uppercase text-studio-950">
                      {lang === 'vi' ? 'Quy Tắc Tuyển Chọn Ảnh Tiêu Biểu' : 'Showcase Selection Rules'}
                    </h3>
                    <p className="text-xs text-studio-500">
                      {lang === 'vi' ? 'Tiêu chí xếp hạng 6 tác phẩm xuất sắc nhất' : 'Official criteria for top 6 community picks'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowRulesModal(false)}
                  className="p-1.5 rounded-lg text-studio-400 hover:text-studio-900 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {FAVORITE_SELECTION_RULES.map((rule, i) => (
                  <div
                    key={rule.id}
                    className="p-4 rounded-2xl bg-studio-50 border border-studio-200/80 flex items-start gap-3.5"
                  >
                    <span className="text-xl shrink-0 p-2 rounded-xl bg-white shadow-xs">
                      {rule.icon}
                    </span>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold text-f1red px-1.5 py-0.5 rounded bg-f1red/10">
                          Rule 0{i + 1}
                        </span>
                        <h4 className="font-bold text-xs sm:text-sm text-studio-900">
                          {lang === 'vi' ? rule.titleVi : rule.titleEn}
                        </h4>
                      </div>
                      <p className="text-xs text-studio-600 leading-relaxed font-light">
                        {lang === 'vi' ? rule.descriptionVi : rule.descriptionEn}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setShowRulesModal(false)}
                  className="w-full py-3 rounded-xl bg-studio-950 text-white text-xs font-bold uppercase tracking-wider hover:bg-f1red transition-colors shadow-sm"
                >
                  {lang === 'vi' ? 'Đã Hiểu' : 'Understood'}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </section>
  );
};
