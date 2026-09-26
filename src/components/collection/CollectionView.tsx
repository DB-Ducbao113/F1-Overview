import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigationStore } from '../../store/useNavigationStore';
import { useCollectionStore } from '../../store/useCollectionStore';
import { TEAMS_DATA } from '../../data/teams';
import { CollectionItem, CollectionCategory, TeamId } from '../../types';
import { CommunityContributorsBar } from './CommunityContributorsBar';
import { CommunityUploadModal } from './CommunityUploadModal';
import { AdminModerationModal } from './AdminModerationModal';
import { AdminLoginModal } from '../auth/AdminLoginModal';
import {
  Search,
  Heart,
  Eye,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Trophy,
  Camera,
  Calendar,
  Layers,
  Check,
  Share2,
  ArrowRight,
  Filter,
  Grid3X3,
  LayoutGrid,
  User,
  ShieldCheck,
  Upload,
} from 'lucide-react';

const CATEGORIES: { id: CollectionCategory; labelVi: string; labelEn: string; icon: string }[] = [
  { id: 'all', labelVi: 'Tất cả sản phẩm', labelEn: 'All Products', icon: '🌟' },
  { id: 'driver', labelVi: 'Chân dung & Tay đua', labelEn: 'Driver Portraits', icon: '👤' },
  { id: 'car', labelVi: 'Xe đua & Thiết kế', labelEn: 'Race Cars & Livery', icon: '🏎️' },
  { id: 'race', labelVi: 'Khoảnh khắc GP', labelEn: 'Grand Prix Action', icon: '🏁' },
  { id: 'team', labelVi: 'Nhà đua & Kỹ thuật', labelEn: 'Paddock & Mechanics', icon: '🛠️' },
];

type EditionFilter = 'all' | 'pinterest' | 'portraits' | 'cars' | 'races';

const EDITIONS: { id: EditionFilter; labelVi: string; labelEn: string }[] = [
  { id: 'all', labelVi: 'Tất cả nguồn', labelEn: 'All Sources' },
  { id: 'pinterest', labelVi: 'Pinterest Curation', labelEn: 'Pinterest Curation' },
  { id: 'portraits', labelVi: 'Chân dung Paddock', labelEn: 'Paddock Portraits' },
  { id: 'cars', labelVi: 'Cỗ máy Tốc độ', labelEn: 'Speed Machinery' },
  { id: 'races', labelVi: 'Đường đua Lịch sử', labelEn: 'Historic Races' },
];

export const CollectionView: React.FC = () => {
  const { lang } = useNavigationStore();
  const { items: allItems, likeItem, selectedTeamId } = useCollectionStore();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CollectionCategory>('all');
  const [selectedTeam, setSelectedTeam] = useState<string>(selectedTeamId || 'all');
  const [selectedEdition, setSelectedEdition] = useState<EditionFilter>('all');
  const [selectedContributor, setSelectedContributor] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'featured' | 'likes' | 'newest' | 'name' | 'team'>('featured');
  const [gridCols, setGridCols] = useState<3 | 4>(3);

  // Sync selectedTeamId if changed externally (e.g. from HomeView or Team detail)
  useEffect(() => {
    if (selectedTeamId) {
      setSelectedTeam(selectedTeamId);
    }
  }, [selectedTeamId]);

  // Modals for Community & Security
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Wishlist State (persisted in localStorage)
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('f1_collection_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [onlyWishlist, setOnlyWishlist] = useState(false);

  // Modal / Quick View State
  const [quickViewItem, setQuickViewItem] = useState<CollectionItem | null>(null);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Lock body scroll when modal or fullscreen is active
  useEffect(() => {
    if (quickViewItem || fullscreenImage || isUploadOpen || isAdminOpen || isLoginModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [quickViewItem, fullscreenImage, isUploadOpen, isAdminOpen, isLoginModalOpen]);

  // Global Escape key listener to close any active modal in CollectionView
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (fullscreenImage) setFullscreenImage(null);
        else if (quickViewItem) setQuickViewItem(null);
        else if (isUploadOpen) setIsUploadOpen(false);
        else if (isAdminOpen) setIsAdminOpen(false);
        else if (isLoginModalOpen) setIsLoginModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [fullscreenImage, quickViewItem, isUploadOpen, isAdminOpen, isLoginModalOpen]);

  // Save wishlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('f1_collection_wishlist', JSON.stringify(wishlist));
    } catch {
      // Ignore localStorage errors
    }
  }, [wishlist]);

  const toggleWishlist = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
    likeItem(id);
  };

  // Filtered & Sorted items
  const filteredItems = useMemo(() => {
    return allItems.filter((item) => {
      // Wishlist filter
      if (onlyWishlist && !wishlist.includes(item.id)) return false;

      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;

      // Team filter
      if (selectedTeam !== 'all' && item.teamId !== selectedTeam) return false;

      // Contributor filter
      if (selectedContributor && (item.uploadedBy || '@baobungbu') !== selectedContributor) return false;

      // Edition filter (replacing year filter)
      if (selectedEdition === 'pinterest' && item.source !== 'Pinterest') return false;
      if (selectedEdition === 'portraits' && item.category !== 'driver') return false;
      if (selectedEdition === 'cars' && item.category !== 'car') return false;
      if (selectedEdition === 'races' && item.category !== 'race') return false;

      // Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const team = TEAMS_DATA[item.teamId];
        const matchTitle =
          (item.titleVi || '').toLowerCase().includes(query) ||
          (item.titleEn || '').toLowerCase().includes(query);
        const matchCaption =
          (item.captionVi || '').toLowerCase().includes(query) ||
          (item.captionEn || '').toLowerCase().includes(query);
        const matchTeam =
          (team?.name || '').toLowerCase().includes(query) ||
          (team?.fullName || '').toLowerCase().includes(query);
        const matchDriver = (item.driver || '').toLowerCase().includes(query);
        const matchRace = (item.race || '').toLowerCase().includes(query);
        const matchSku = (item.sku || '').toLowerCase().includes(query);
        const matchSource = (item.source || '').toLowerCase().includes(query);
        const matchContributor = (item.uploadedBy || '').toLowerCase().includes(query);

        if (
          !matchTitle &&
          !matchCaption &&
          !matchTeam &&
          !matchDriver &&
          !matchRace &&
          !matchSku &&
          !matchSource &&
          !matchContributor
        ) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'featured') {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return (b.likes || 0) - (a.likes || 0);
      }
      if (sortBy === 'likes') {
        return (b.likes || 0) - (a.likes || 0);
      }
      if (sortBy === 'newest') {
        return (b.publishedAt || '').localeCompare(a.publishedAt || '');
      }
      if (sortBy === 'name') {
        const nameA = (lang === 'vi' ? a.titleVi : a.titleEn) || '';
        const nameB = (lang === 'vi' ? b.titleVi : b.titleEn) || '';
        return nameA.localeCompare(nameB);
      }
      if (sortBy === 'team') {
        return (a.teamId || '').localeCompare(b.teamId || '');
      }
      return 0;
    });
  }, [
    allItems,
    selectedCategory,
    selectedTeam,
    selectedEdition,
    selectedContributor,
    searchQuery,
    sortBy,
    onlyWishlist,
    wishlist,
    lang,
  ]);

  // Quick View Next / Prev navigation
  const currentQuickViewIndex = useMemo(() => {
    if (!quickViewItem) return -1;
    return filteredItems.findIndex((i) => i.id === quickViewItem.id);
  }, [quickViewItem, filteredItems]);

  const handleNextQuickView = () => {
    if (currentQuickViewIndex >= 0 && currentQuickViewIndex < filteredItems.length - 1) {
      setQuickViewItem(filteredItems[currentQuickViewIndex + 1]);
    } else if (filteredItems.length > 0) {
      setQuickViewItem(filteredItems[0]);
    }
  };

  const handlePrevQuickView = () => {
    if (currentQuickViewIndex > 0) {
      setQuickViewItem(filteredItems[currentQuickViewIndex - 1]);
    } else if (filteredItems.length > 0) {
      setQuickViewItem(filteredItems[filteredItems.length - 1]);
    }
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedTeam('all');
    setSelectedEdition('all');
    setSelectedContributor(null);
    setOnlyWishlist(false);
  };

  const handleCopyShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="bg-studio-100 min-h-screen pb-28 animate-fade-in">
      {/* ── 1. STOREFRONT HERO BANNER ── */}
      <section className="bg-gradient-to-b from-studio-950 via-studio-900 to-studio-950 text-white relative overflow-hidden border-b border-white/10 pt-10 pb-16 sm:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-f1red/20 via-transparent to-transparent pointer-events-none" />

        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        <div className="page-container relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold uppercase tracking-widest text-f1red">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{lang === 'vi' ? 'Community F1 Archive & Curation' : 'Community F1 Archive & Showcase'}</span>
          </div>

          <div className="max-w-3xl space-y-3">
            <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-none">
              {lang === 'vi' ? 'Kho Lưu Trữ Ảnh F1 Cộng Đồng' : 'Community F1 Visual Archive'}
            </h1>
            <p className="text-sm sm:text-base text-studio-300 font-light leading-relaxed max-w-2xl">
              {lang === 'vi'
                ? 'Không gian trưng bày hình ảnh do cộng đồng người hâm mộ và nhiếp ảnh gia đóng góp. Hệ thống tự động cập nhật, ghi nhận tác quyền và lưu trữ minh bạch.'
                : 'An open visual archive crowdsourced by fans and trackside photographers. Featuring automated collection updates and verified attribution.'}
            </p>
          </div>

          {/* Quick Metrics Badges */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-studio-200">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{allItems.length} {lang === 'vi' ? 'Tác phẩm lưu trữ' : 'Archived Works'}</span>
            </div>
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-studio-200">
              <Trophy className="w-3.5 h-3.5 text-yellow-400" />
              <span>11 {lang === 'vi' ? 'Đội đua F1' : 'Constructors'}</span>
            </div>
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-studio-200">
              <Camera className="w-3.5 h-3.5 text-f1red" />
              <span>{lang === 'vi' ? 'Đóng góp mở cộng đồng' : 'Open Community Upload'}</span>
            </div>
            {wishlist.length > 0 && (
              <button
                onClick={() => setOnlyWishlist(!onlyWishlist)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                  onlyWishlist
                    ? 'bg-f1red text-white border-f1red shadow-sm'
                    : 'bg-white/10 text-pink-400 border-pink-500/30 hover:bg-white/20'
                }`}
              >
                <Heart className="w-3.5 h-3.5 fill-current" />
                <span>
                  {wishlist.length} {lang === 'vi' ? 'Mục yêu thích' : 'Wishlist Items'}
                </span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ── 2. DEPARTMENT CATEGORY PILLS (E-COMMERCE TABS) ── */}
      <div className="bg-white border-b border-studio-200 sticky top-16 z-30 shadow-xs">
        <div className="page-container py-3">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              const count =
                cat.id === 'all'
                  ? allItems.length
                  : allItems.filter((i) => i.category === cat.id).length;

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 uppercase tracking-wider ${
                    isActive
                      ? 'bg-studio-950 text-white shadow-sm'
                      : 'bg-studio-50 text-studio-600 hover:bg-studio-100 hover:text-studio-900 border border-studio-200/60'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{lang === 'vi' ? cat.labelVi : cat.labelEn}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-white/20 text-white' : 'bg-studio-200 text-studio-700'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── 3. COMMUNITY CONTRIBUTORS & MODERATION BAR ── */}
      <div className="page-container pt-8 space-y-6">
        <CommunityContributorsBar
          onOpenUpload={() => setIsUploadOpen(true)}
          onOpenAdmin={() => setIsAdminOpen(true)}
          onOpenLogin={() => setIsLoginModalOpen(true)}
          activeContributor={selectedContributor}
          onSelectContributor={setSelectedContributor}
        />

        <div className="bg-white rounded-2xl border border-studio-200 p-4 shadow-subtle flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Live Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-studio-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                lang === 'vi'
                  ? 'Tìm kiếm theo tên tay đua, đội, mã SKU, Pinterest...'
                  : 'Search by driver, constructor, SKU, Pinterest...'
              }
              className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-studio-50 border border-studio-200 text-xs sm:text-sm font-medium text-studio-900 focus:outline-none focus:border-f1red focus:bg-white transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-studio-400 hover:text-studio-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Team Dropdown */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-studio-500 uppercase tracking-wider hidden sm:inline">
                {lang === 'vi' ? 'Đội đua:' : 'Team:'}
              </span>
              <select
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
                className="px-3 py-2 rounded-xl bg-studio-50 border border-studio-200 text-xs font-bold text-studio-800 focus:outline-none focus:border-f1red cursor-pointer"
              >
                <option value="all">{lang === 'vi' ? 'Tất cả Đội đua' : 'All Constructors'}</option>
                {Object.keys(TEAMS_DATA).map((teamKey) => {
                  const tData = TEAMS_DATA[teamKey as TeamId];
                  return (
                    <option key={teamKey} value={teamKey}>
                      {tData.name}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Collection Edition (Replaced Year filter!) */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-studio-500 uppercase tracking-wider hidden sm:inline">
                {lang === 'vi' ? 'Chủ đề:' : 'Theme:'}
              </span>
              <select
                value={selectedEdition}
                onChange={(e) => setSelectedEdition(e.target.value as EditionFilter)}
                className="px-3 py-2 rounded-xl bg-studio-50 border border-studio-200 text-xs font-bold text-studio-800 focus:outline-none focus:border-f1red cursor-pointer"
              >
                {EDITIONS.map((ed) => (
                  <option key={ed.id} value={ed.id}>
                    {lang === 'vi' ? ed.labelVi : ed.labelEn}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-studio-500 uppercase tracking-wider hidden sm:inline">
                {lang === 'vi' ? 'Sắp xếp:' : 'Sort:'}
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 rounded-xl bg-studio-50 border border-studio-200 text-xs font-bold text-studio-800 focus:outline-none focus:border-f1red cursor-pointer"
              >
                <option value="featured">{lang === 'vi' ? 'Nổi bật nhất' : 'Featured'}</option>
                <option value="likes">{lang === 'vi' ? 'Nhiều tim nhất' : 'Most Liked'}</option>
                <option value="newest">{lang === 'vi' ? 'Mới đăng' : 'Newest'}</option>
                <option value="name">{lang === 'vi' ? 'Tên A-Z' : 'Name A-Z'}</option>
                <option value="team">{lang === 'vi' ? 'Theo Đội đua' : 'By Constructor'}</option>
              </select>
            </div>

            {/* Grid Column Layout Switcher */}
            <div className="hidden md:flex items-center bg-studio-100 p-1 rounded-xl border border-studio-200">
              <button
                onClick={() => setGridCols(3)}
                className={`p-1.5 rounded-lg transition-colors ${
                  gridCols === 3 ? 'bg-white shadow-xs text-studio-950' : 'text-studio-500 hover:text-studio-800'
                }`}
                title="Showroom 3-Column View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setGridCols(4)}
                className={`p-1.5 rounded-lg transition-colors ${
                  gridCols === 4 ? 'bg-white shadow-xs text-studio-950' : 'text-studio-500 hover:text-studio-800'
                }`}
                title="Compact 4-Column Product Grid"
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Active Filter Badges */}
        {(selectedCategory !== 'all' ||
          selectedTeam !== 'all' ||
          selectedEdition !== 'all' ||
          selectedContributor !== null ||
          searchQuery ||
          onlyWishlist) && (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs text-studio-500 font-semibold flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-f1red" />
              {lang === 'vi' ? 'Đang lọc:' : 'Active filters:'}
            </span>

            {selectedContributor && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-f1red/15 text-f1red border border-f1red/30 text-[11px] font-mono font-bold">
                <User className="w-3 h-3" />
                <span>{selectedContributor}</span>
                <button onClick={() => setSelectedContributor(null)}>
                  <X className="w-3 h-3 hover:text-white" />
                </button>
              </span>
            )}

            {selectedCategory !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-studio-200 text-studio-800 text-[11px] font-bold">
                {CATEGORIES.find((c) => c.id === selectedCategory)?.[lang === 'vi' ? 'labelVi' : 'labelEn']}
                <button onClick={() => setSelectedCategory('all')}>
                  <X className="w-3 h-3 hover:text-f1red" />
                </button>
              </span>
            )}

            {selectedTeam !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-studio-200 text-studio-800 text-[11px] font-bold">
                {TEAMS_DATA[selectedTeam as TeamId]?.name}
                <button onClick={() => setSelectedTeam('all')}>
                  <X className="w-3 h-3 hover:text-f1red" />
                </button>
              </span>
            )}

            {selectedEdition !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-studio-200 text-studio-800 text-[11px] font-bold">
                {EDITIONS.find((e) => e.id === selectedEdition)?.[lang === 'vi' ? 'labelVi' : 'labelEn']}
                <button onClick={() => setSelectedEdition('all')}>
                  <X className="w-3 h-3 hover:text-f1red" />
                </button>
              </span>
            )}

            {onlyWishlist && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-pink-100 text-pink-700 text-[11px] font-bold">
                {lang === 'vi' ? 'Chỉ mục yêu thích' : 'Wishlist only'}
                <button onClick={() => setOnlyWishlist(false)}>
                  <X className="w-3 h-3 hover:text-f1red" />
                </button>
              </span>
            )}

            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-studio-200 text-studio-800 text-[11px] font-bold">
                "{searchQuery}"
                <button onClick={() => setSearchQuery('')}>
                  <X className="w-3 h-3 hover:text-f1red" />
                </button>
              </span>
            )}

            <button
              onClick={resetFilters}
              className="text-xs font-bold text-f1red hover:underline ml-2"
            >
              {lang === 'vi' ? 'Xóa tất cả' : 'Clear all'}
            </button>
          </div>
        )}

        {/* ── 4. PRODUCT CATALOG GRID ── */}
        {filteredItems.length > 0 ? (
          <div
            className={`grid gap-6 ${
              gridCols === 4
                ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4'
                : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
            }`}
          >
            {filteredItems.map((item) => {
              const team = TEAMS_DATA[item.teamId];
              const isWishlisted = wishlist.includes(item.id);

              return (
                <div
                  key={item.id}
                  onClick={() => setQuickViewItem(item)}
                  className="group bg-white rounded-2xl border border-studio-200 overflow-hidden shadow-subtle hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col cursor-pointer"
                >
                  {/* Product Visual Container */}
                  <div className="relative aspect-[16/10] bg-studio-900 overflow-hidden">
                    {/* Top Team Color Accent Line */}
                    <div
                      className="absolute top-0 left-0 right-0 h-1 z-10"
                      style={{ backgroundColor: team?.primaryColor || '#e80020' }}
                    />

                    {/* Image with zoom effect */}
                    <img
                      src={item.imageUrl}
                      alt={lang === 'vi' ? item.titleVi : item.titleEn}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.opacity = '0.5';
                      }}
                    />

                    {/* Gradient shading */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent pointer-events-none" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
                      {/* Team Brand Tag */}
                      <span
                        className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider text-white shadow-sm flex items-center gap-1.5 backdrop-blur-md"
                        style={{ backgroundColor: (team?.primaryColor || '#e80020') + 'dd' }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        {team?.name || item.teamId}
                      </span>

                      {/* Status / SKU Badge */}
                      {item.badge ? (
                        <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold uppercase tracking-wider">
                          {item.badge}
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md border border-white/20 text-white text-[10px] font-mono">
                          {item.sku}
                        </span>
                      )}
                    </div>

                    {/* Hover Quick Action Buttons */}
                    <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/30 backdrop-blur-[2px]">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setQuickViewItem(item);
                        }}
                        className="px-3.5 py-2 rounded-xl bg-white text-studio-950 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-lg hover:bg-f1red hover:text-white transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{lang === 'vi' ? 'Xem Nhanh' : 'Quick View'}</span>
                      </button>

                      <button
                        onClick={(e) => toggleWishlist(item.id, e)}
                        className={`p-2 rounded-xl backdrop-blur-md shadow-lg transition-colors ${
                          isWishlisted
                            ? 'bg-f1red text-white'
                            : 'bg-black/60 text-white hover:bg-white hover:text-f1red'
                        }`}
                        title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                      >
                        <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setFullscreenImage(item.imageUrl);
                        }}
                        className="p-2 rounded-xl bg-black/60 text-white hover:bg-white hover:text-studio-950 backdrop-blur-md shadow-lg transition-colors"
                        title="Zoom Image"
                      >
                        <Maximize2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Bottom Metadata Overlay */}
                    <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] text-white/80 pointer-events-none">
                      <span className="font-mono text-[10px] text-white/70">{item.sku}</span>
                      <span className="font-semibold text-white/90 flex items-center gap-1">
                        <Heart className="w-3 h-3 text-f1red fill-current" />
                        {(item.likes || 1200).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Product Information Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      {/* Constructor Sub-Label */}
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold uppercase tracking-wider text-studio-500">
                          {team?.fullName || team?.name}
                        </span>
                        {item.driver && (
                          <span className="font-semibold text-f1red text-[11px]">
                            {item.driver}
                          </span>
                        )}
                      </div>

                      {/* Product Title */}
                      <h3 className="font-display font-black text-base uppercase tracking-tight text-studio-950 group-hover:text-f1red transition-colors line-clamp-1 leading-snug">
                        {lang === 'vi' ? item.titleVi : item.titleEn}
                      </h3>

                      {/* Product Description */}
                      <p className="text-xs text-studio-600 line-clamp-2 leading-relaxed font-light">
                        {lang === 'vi' ? item.captionVi : item.captionEn}
                      </p>
                    </div>

                    {/* Publish Date & Source Info */}
                    <div className="pt-2 border-t border-studio-100 flex items-center justify-between text-[11px] text-studio-500">
                      <span className="flex items-center gap-1 font-medium">
                        <Calendar className="w-3 h-3 text-f1red" />
                        {item.publishedAt || '25/09/2026'}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-studio-100 text-[10px] font-bold text-studio-700">
                        {item.source}
                      </span>
                    </div>

                    {/* Card Footer: Attribution & CTA */}
                    <div className="pt-2 border-t border-studio-100 flex items-center justify-between">
                      <div className="truncate pr-2 space-y-0.5">
                        <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-studio-900">
                          <User className="w-3 h-3 text-f1red" />
                          <span className="truncate">{item.uploadedBy || '@baobungbu'}</span>
                        </div>
                        <span className="text-[10px] text-studio-500 font-medium truncate block">
                          {item.licenseType || item.license || 'CC BY 4.0'}
                        </span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setQuickViewItem(item);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-studio-50 text-studio-900 group-hover:bg-f1red group-hover:text-white text-xs font-bold uppercase tracking-wider transition-colors shrink-0"
                      >
                        <span>{lang === 'vi' ? 'Chi tiết' : 'Inspect'}</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty Search / Filter State */
          <div className="bg-white rounded-2xl border border-studio-200 p-12 text-center space-y-4 shadow-subtle">
            <div className="w-16 h-16 rounded-full bg-studio-100 flex items-center justify-center mx-auto text-studio-400">
              <Search className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="font-display font-black text-lg uppercase text-studio-950">
                {lang === 'vi' ? 'Không tìm thấy sản phẩm phù hợp' : 'No products found'}
              </h3>
              <p className="text-xs sm:text-sm text-studio-500 max-w-md mx-auto">
                {lang === 'vi'
                  ? 'Thử điều chỉnh lại từ khóa tìm kiếm, bỏ bớt bộ lọc hoặc chọn "Tất cả sản phẩm" để khám phá toàn bộ kho lưu trữ.'
                  : 'Try adjusting your search terms, removing active filters, or selecting "All Products" to browse the complete archive.'}
              </p>
            </div>
            <button
              onClick={resetFilters}
              className="px-5 py-2.5 rounded-xl bg-f1red text-white text-xs font-bold uppercase tracking-wider hover:bg-f1red/90 transition-colors shadow-sm"
            >
              {lang === 'vi' ? 'Đặt lại tất cả bộ lọc' : 'Reset All Filters'}
            </button>
          </div>
        )}
      </div>

      {/* ── 5. PRODUCT QUICK VIEW MODAL (RENDERED VIA PORTAL TO BODY FOR VIEWPORT CENTERING!) ── */}
      {quickViewItem &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in"
            onClick={() => setQuickViewItem(null)}
          >
            <div
              className="relative bg-white rounded-3xl max-w-5xl w-full max-h-[92vh] overflow-hidden shadow-2xl flex flex-col lg:flex-row border border-studio-200 my-auto animate-scale-up"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setQuickViewItem(null)}
                className="absolute top-4 right-4 z-30 p-2 rounded-full bg-black/60 text-white hover:bg-black/90 transition-colors shadow-md"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Left Column: Visual Showcase Gallery (60%) */}
              <div className="lg:w-3/5 bg-studio-950 relative flex flex-col justify-center items-center min-h-[320px] lg:min-h-[560px] overflow-hidden group">
                {/* Product Image */}
                <img
                  src={quickViewItem.imageUrl}
                  alt={lang === 'vi' ? quickViewItem.titleVi : quickViewItem.titleEn}
                  className="w-full h-full object-contain max-h-[55vh] lg:max-h-[85vh] p-4 cursor-pointer"
                  onClick={() => setFullscreenImage(quickViewItem.imageUrl)}
                />

                {/* Top Accent Ribbon */}
                <div
                  className="absolute top-0 left-0 right-0 h-1.5"
                  style={{
                    backgroundColor:
                      TEAMS_DATA[quickViewItem.teamId]?.primaryColor || '#e80020',
                  }}
                />

                {/* Prev / Next Navigation Arrows */}
                <button
                  onClick={handlePrevQuickView}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 text-white hover:bg-white hover:text-studio-950 transition-colors shadow-lg"
                  title="Previous item"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNextQuickView}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 text-white hover:bg-white hover:text-studio-950 transition-colors shadow-lg"
                  title="Next item"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Zoom hint badge */}
                <button
                  onClick={() => setFullscreenImage(quickViewItem.imageUrl)}
                  className="absolute bottom-4 left-4 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-1.5 hover:bg-white hover:text-studio-950 transition-colors"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>{lang === 'vi' ? 'Xem ảnh gốc 4K' : 'Fullscreen 4K Zoom'}</span>
                </button>

                {/* Catalog Index Indicator */}
                <div className="absolute bottom-4 right-4 text-white/60 text-xs font-mono">
                  {currentQuickViewIndex + 1} / {filteredItems.length}
                </div>
              </div>

              {/* Right Column: Product Detail & Technical Sheet (40%) */}
              <div className="lg:w-2/5 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto max-h-[50vh] lg:max-h-[92vh] space-y-6">
                <div className="space-y-4">
                  {/* Team Tag & SKU */}
                  <div className="flex items-center justify-between gap-2 border-b border-studio-100 pb-3">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor:
                            TEAMS_DATA[quickViewItem.teamId]?.primaryColor || '#e80020',
                        }}
                      />
                      <span className="text-xs font-bold uppercase tracking-widest text-studio-600">
                        {TEAMS_DATA[quickViewItem.teamId]?.fullName || quickViewItem.teamId}
                      </span>
                    </div>
                    <span className="text-xs font-mono font-bold text-studio-400">
                      {quickViewItem.sku}
                    </span>
                  </div>

                  {/* Title & Badge */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-1 rounded-md bg-studio-900 text-white text-[10px] font-black uppercase tracking-wider">
                        {quickViewItem.category}
                      </span>
                      {quickViewItem.badge && (
                        <span className="px-2.5 py-1 rounded-md bg-f1red/10 text-f1red text-[10px] font-black uppercase tracking-wider">
                          {quickViewItem.badge}
                        </span>
                      )}
                      <span className="px-2.5 py-1 rounded-md bg-pink-50 text-f1red border border-pink-200 text-[10px] font-bold flex items-center gap-1">
                        <Heart className="w-2.5 h-2.5 fill-current" />
                        {(quickViewItem.likes || 1200).toLocaleString()} tim
                      </span>
                    </div>

                    <h2 className="font-display font-black text-2xl uppercase tracking-tight text-studio-950 leading-tight">
                      {lang === 'vi' ? quickViewItem.titleVi : quickViewItem.titleEn}
                    </h2>
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-studio-600 font-light leading-relaxed">
                    {lang === 'vi' ? quickViewItem.captionVi : quickViewItem.captionEn}
                  </p>

                  {/* Specifications Matrix Table (Bảng thông số chi tiết & Ngày publish) */}
                  <div className="bg-studio-50 rounded-2xl p-4 border border-studio-200/80 space-y-3">
                    <h4 className="text-[11px] font-black uppercase tracking-wider text-studio-400 flex items-center justify-between">
                      <span>{lang === 'vi' ? 'Thông Số Lưu Trữ Kỹ Thuật' : 'Technical Specifications'}</span>
                      <span className="font-mono text-[10px] text-f1red">F1-ARCHIVE</span>
                    </h4>

                    <div className="space-y-2 text-xs">
                      {/* Ngày publish - Requested explicitly by user */}
                      <div className="flex items-center justify-between border-b border-studio-200/60 pb-1.5 bg-white/60 px-2 py-1 rounded-lg">
                        <span className="text-studio-600 font-bold flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-f1red" />
                          {lang === 'vi' ? 'Ngày xuất bản (Publish):' : 'Published Date:'}
                        </span>
                        <span className="font-black text-f1red">
                          {quickViewItem.publishedAt || '25/09/2026'}
                        </span>
                      </div>

                      {/* Người đóng góp / Contributor attribution */}
                      <div className="flex items-center justify-between border-b border-studio-200/60 pb-1.5 bg-f1red/5 px-2 py-1 rounded-lg">
                        <span className="text-studio-700 font-bold flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-f1red" />
                          {lang === 'vi' ? 'Người đóng góp (Contributor):' : 'Contributor:'}
                        </span>
                        <span className="font-mono font-bold text-f1red">
                          {quickViewItem.uploadedBy || '@baobungbu'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between border-b border-studio-200/60 pb-1.5">
                        <span className="text-studio-500">{lang === 'vi' ? 'Đội đua' : 'Constructor'}:</span>
                        <span className="font-bold text-studio-900">
                          {TEAMS_DATA[quickViewItem.teamId]?.name}
                        </span>
                      </div>

                      {quickViewItem.driver && (
                        <div className="flex items-center justify-between border-b border-studio-200/60 pb-1.5">
                          <span className="text-studio-500">{lang === 'vi' ? 'Tay đua' : 'Driver'}:</span>
                          <span className="font-bold text-f1red">{quickViewItem.driver}</span>
                        </div>
                      )}

                      {quickViewItem.race && (
                        <div className="flex items-center justify-between border-b border-studio-200/60 pb-1.5">
                          <span className="text-studio-500">{lang === 'vi' ? 'Chặng đua' : 'Grand Prix'}:</span>
                          <span className="font-bold text-studio-900">{quickViewItem.race}</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between border-b border-studio-200/60 pb-1.5">
                        <span className="text-studio-500">{lang === 'vi' ? 'Nhiếp ảnh gia / Nguồn' : 'Photographer'}:</span>
                        <span className="font-bold text-studio-900">{quickViewItem.photographer}</span>
                      </div>

                      <div className="flex items-center justify-between border-b border-studio-200/60 pb-1.5">
                        <span className="text-studio-500">{lang === 'vi' ? 'Nguồn phát hành' : 'Source'}:</span>
                        <span className="font-bold text-studio-900 flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-red-500" />
                          {quickViewItem.source}
                        </span>
                      </div>

                      <div className="flex items-center justify-between border-b border-studio-200/60 pb-1.5">
                        <span className="text-studio-500">{lang === 'vi' ? 'Bản quyền & Giấy phép' : 'License & Copyright'}:</span>
                        <span className="font-bold text-emerald-600 text-[11px] flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          {quickViewItem.licenseType || quickViewItem.license || 'CC BY 4.0'}
                        </span>
                      </div>

                      {quickViewItem.contributorNotes && (
                        <div className="flex items-start justify-between">
                          <span className="text-studio-500 text-[11px] shrink-0">{lang === 'vi' ? 'Ghi chú tác giả:' : 'Notes:'}</span>
                          <span className="text-studio-700 text-[11px] italic text-right pl-2 font-medium">{quickViewItem.contributorNotes}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons Row */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-3">
                    {/* Wishlist CTA */}
                    <button
                      onClick={() => toggleWishlist(quickViewItem.id)}
                      className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                        wishlist.includes(quickViewItem.id)
                          ? 'bg-f1red text-white shadow-md'
                          : 'bg-studio-950 text-white hover:bg-studio-800'
                      }`}
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          wishlist.includes(quickViewItem.id) ? 'fill-current' : ''
                        }`}
                      />
                      <span>
                        {wishlist.includes(quickViewItem.id)
                          ? lang === 'vi'
                            ? 'Đã Thêm Vào Yêu Thích'
                            : 'Saved to Wishlist'
                          : lang === 'vi'
                          ? 'Lưu Vào Yêu Thích'
                          : 'Add to Wishlist'}
                      </span>
                    </button>

                    {/* Share button */}
                    <button
                      onClick={handleCopyShare}
                      className="p-3 rounded-xl border border-studio-200 text-studio-700 hover:border-f1red hover:text-f1red transition-colors"
                      title="Copy Link"
                    >
                      {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* ── 6. FULLSCREEN 4K IMAGE MODAL (VIA PORTAL) ── */}
      {fullscreenImage &&
        createPortal(
          <div
            className="fixed inset-0 z-[10000] bg-black/95 backdrop-blur-lg flex items-center justify-center p-4 animate-fade-in"
            onClick={() => setFullscreenImage(null)}
          >
            <button
              onClick={() => setFullscreenImage(null)}
              className="absolute top-6 right-6 p-3 rounded-full bg-white/10 text-white hover:bg-white hover:text-studio-950 transition-colors z-10"
              aria-label="Close fullscreen"
            >
              <X className="w-6 h-6" />
            </button>

            <img
              src={fullscreenImage}
              alt="Fullscreen capture"
              className="max-w-[95vw] max-h-[92vh] object-contain rounded-xl shadow-2xl"
            />
          </div>,
          document.body
        )}

      {/* ── 7. COMMUNITY CROWDSOURCE UPLOAD MODAL ── */}
      <CommunityUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        defaultTeamId={selectedTeam !== 'all' ? (selectedTeam as TeamId) : null}
      />

      {/* ── 8. ADMIN MODERATION QUEUE MODAL ── */}
      <AdminModerationModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />

      {/* ── 9. ADMIN SECURE LOGIN MODAL ── */}
      <AdminLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={() => setIsAdminOpen(true)}
      />
    </div>
  );
};

export default CollectionView;
