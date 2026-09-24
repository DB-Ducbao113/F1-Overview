import React, { useState, useEffect, useRef } from 'react';
import { useCarStore } from '../../store/useCarStore';
import { CARS_DATA } from '../../data/cars';
import { CarId } from '../../types';
import {
  Play,
  Pause,
  Maximize2,
  Minimize2,
  Camera,
  Layers,
  Sparkles,
  ArrowUp,
  X,
  Zap,
  Gauge,
  Timer,
  Scale,
} from 'lucide-react';

// 11 Official F1 Teams in Championship Order
const ALL_TEAMS_ORDER: CarId[] = [
  'sf24',        // Ferrari
  'mcl38',       // McLaren
  'rb20',        // Red Bull Racing
  'w15',         // Mercedes
  'astonmartin', // Aston Martin
  'alpine',      // Alpine
  'racingbulls', // Racing Bulls
  'haas',        // Haas F1 Team
  'williams',    // Williams Racing
  'audi',        // Audi F1 Team
  'cadillac',    // Cadillac F1 Team
];

interface PhotoItem {
  id: string;
  title: string;
  subtitle: string;
  team: string;
  imageUrl: string;
  type: 'studio' | 'action';
  accentColor: string;
  carId?: CarId;
}

const PHOTO_DATA: PhotoItem[] = [
  // 11 Studio shots
  { id: 'studio_sf24',      title: 'Ferrari SF-24',                   subtitle: 'Rosso Corsa Vĩnh Cửu · Scuderia Ferrari HP',    team: 'Scuderia Ferrari HP',     imageUrl: '/images/teams/sf24.jpg',       type: 'studio', accentColor: '#e80020', carId: 'sf24' },
  { id: 'studio_mcl38',     title: 'McLaren MCL38',                   subtitle: 'Papaya Power · Mùa Giải Hoàng Kim',          team: 'McLaren F1 Team',         imageUrl: '/images/teams/mcl38.jpg',      type: 'studio', accentColor: '#ff8000', carId: 'mcl38' },
  { id: 'studio_rb20',      title: 'Red Bull RB20',                   subtitle: 'Tốc Độ Vô Song · Oracle Red Bull Racing',    team: 'Oracle Red Bull Racing',  imageUrl: '/images/teams/rb20.jpg',       type: 'studio', accentColor: '#3671c6', carId: 'rb20' },
  { id: 'studio_w15',       title: 'Mercedes-AMG W15 E Performance', subtitle: 'Mũi Tên Bạc Tái Sinh · Mùa Giải 2025',        team: 'Mercedes-AMG Petronas',   imageUrl: '/images/teams/w15.jpg',        type: 'studio', accentColor: '#00a19c', carId: 'w15' },
  { id: 'studio_am',        title: 'Aston Martin AMR25',              subtitle: 'British Racing Green · Aston Martin Aramco',  team: 'Aston Martin Aramco F1',  imageUrl: '/images/teams/astonmartin.jpg',type: 'studio', accentColor: '#00594f', carId: 'astonmartin' },
  { id: 'studio_alpine',    title: 'Alpine A525',                     subtitle: 'Bleu de France · BWT Alpine F1 Team',         team: 'BWT Alpine F1 Team',      imageUrl: '/images/teams/alpine.jpg',     type: 'studio', accentColor: '#ff87bc', carId: 'alpine' },
  { id: 'studio_rbulls',    title: 'Racing Bulls VCARB 02',           subtitle: 'Thiết Kế Đột Phá · Visa Cash App RB',        team: 'Visa Cash App RB F1 Team',imageUrl: '/images/teams/racingbulls.jpg',type: 'studio', accentColor: '#6692ff', carId: 'racingbulls' },
  { id: 'studio_haas',      title: 'Haas VF-25',                      subtitle: 'Đội Đua Mỹ Duy Nhất · Haas F1 Team',         team: 'MoneyGram Haas F1 Team',  imageUrl: '/images/teams/haas.jpg',       type: 'studio', accentColor: '#b6babd', carId: 'haas' },
  { id: 'studio_williams',  title: 'Williams FW47',                   subtitle: 'Racing Blue Sails · Williams Racing',        team: 'Williams Racing',         imageUrl: '/images/teams/williams.jpg',   type: 'studio', accentColor: '#005aff', carId: 'williams' },
  { id: 'studio_audi',      title: 'Audi F1 AG 001',                  subtitle: 'Vorsprung Durch Technik · Audi F1 AG',      team: 'Audi F1 AG',              imageUrl: '/images/teams/audi.jpg',       type: 'studio', accentColor: '#bb0a30', carId: 'audi' },
  { id: 'studio_cadillac',  title: 'Cadillac TWO',                    subtitle: 'Biểu Tượng Cơ Bắp Trở Lại · GM Cadillac',    team: 'GM Cadillac F1 Team',     imageUrl: '/images/teams/cadillac.jpg',   type: 'studio', accentColor: '#b8992c', carId: 'cadillac' },
  // 6 Action shots
  { id: 'action_sf24',      title: 'SF-24 · Khúc Cua Vàng Monza',    subtitle: 'Curva Grande · Rosso Corsa Bừng Sáng',        team: 'Scuderia Ferrari HP',     imageUrl: '/images/gallery/sf24_action.jpg',      type: 'action', accentColor: '#e80020', carId: 'sf24' },
  { id: 'action_mcl38',     title: 'MCL38 · Đêm Marina Bay',          subtitle: 'Singapore GP · Đĩa Phanh Đỏ Rực 1050°C',     team: 'McLaren F1 Team',         imageUrl: '/images/gallery/mcl38_action.jpg',     type: 'action', accentColor: '#ff8000', carId: 'mcl38' },
  { id: 'action_rb20',      title: 'RB20 · Tia Lửa Đỉnh Cao',        subtitle: 'Red Bull Ring · Mưa Tia Lửa Titan',           team: 'Oracle Red Bull Racing',  imageUrl: '/images/gallery/rb20_action.jpg',       type: 'action', accentColor: '#cc1e4a', carId: 'rb20' },
  { id: 'action_w15',       title: 'W15 · Xoáy Khí Silverstone',      subtitle: 'Maggotts & Becketts · 5.3G Lateral',         team: 'Mercedes-AMG Petronas',   imageUrl: '/images/gallery/w15_action.jpg',        type: 'action', accentColor: '#27f4d2', carId: 'w15' },
  { id: 'action_cockpit',   title: 'Góc Nhìn Buồng Lái · 338 km/h',  subtitle: 'Baku City Circuit · Halo & Carbon Wheel',    team: 'Oracle Red Bull Racing',  imageUrl: '/images/gallery/cockpit_action.jpg',    type: 'action', accentColor: '#38bdf8' },
  { id: 'action_pitstop',   title: 'Pit Stop Kỷ Lục · 1.9 Giây',     subtitle: 'Spa-Francorchamps · 20 Thợ Máy Tinh Nhuệ',   team: 'Red Bull Racing Pit Crew',imageUrl: '/images/gallery/pitstop_action.jpg',    type: 'action', accentColor: '#eab308' },
];

// 3D Tilt Card with glare spotlight
interface TiltPhotoCardProps {
  item: PhotoItem;
  onSelect: (item: PhotoItem) => void;
}

const TiltPhotoCard: React.FC<TiltPhotoCardProps> = ({ item, onSelect }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)');
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });
  const [hovered, setHovered] = useState(false);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const rx = ((y - r.height / 2) / r.height) * -8;
    const ry = ((x - r.width / 2) / r.width) * 8;
    setTransform(`perspective(1000px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) scale3d(1.025,1.025,1.025)`);
    setGlare({ x: (x / r.width) * 100, y: (y / r.height) * 100, opacity: 0.35 });
  };

  const onLeave = () => {
    setHovered(false);
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)');
    setGlare(prev => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={onMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={onLeave}
      onClick={() => onSelect(item)}
      className="group relative cursor-pointer rounded-sm overflow-hidden bg-white border border-studio-200 shadow-subtle hover:shadow-luxury flex flex-col transition-all duration-300"
      style={{
        transform,
        transformStyle: 'preserve-3d',
        transition: hovered ? 'transform 0.08s ease-out' : 'transform 0.5s cubic-bezier(0.2,0.8,0.2,1), box-shadow 0.3s ease',
      }}
    >
      {/* Photo */}
      <div className="relative aspect-video w-full overflow-hidden bg-studio-950">
        <img
          src={item.imageUrl}
          alt={item.title}
          loading="lazy"
          className={`w-full h-full object-cover transition-transform duration-700 ease-out ${hovered ? 'scale-105' : 'scale-100'}`}
        />

        {/* Glare */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            opacity: glare.opacity,
            background: `radial-gradient(circle 260px at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.45) 0%, transparent 80%)`,
            mixBlendMode: 'overlay',
          }}
        />

        {/* Type pill */}
        <span
          className="absolute top-2.5 right-2.5 text-[9px] font-mono uppercase tracking-wider font-bold px-2 py-0.5 rounded-xs backdrop-blur-md"
          style={{
            background: item.type === 'studio' ? 'rgba(0,0,0,0.75)' : 'rgba(232,0,32,0.85)',
            color: '#fff',
          }}
        >
          {item.type === 'studio' ? 'Studio 4K' : 'Action Track'}
        </span>
      </div>

      {/* Info */}
      <div className="p-3.5 flex flex-col justify-between flex-1">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: item.accentColor }} />
            <span className="text-[9.5px] font-mono uppercase tracking-wider text-studio-500 font-semibold truncate">
              {item.team}
            </span>
          </div>
          <h4 className="text-xs font-display font-bold text-studio-950 group-hover:text-f1red transition-colors line-clamp-1">
            {item.title}
          </h4>
        </div>
        <p className="text-[10.5px] font-body text-studio-500 line-clamp-1 mt-1 font-light">
          {item.subtitle}
        </p>
      </div>
    </div>
  );
};

export const ModelsView: React.FC = () => {
  const { selectedCarId, setCarId } = useCarStore();
  const car = CARS_DATA[selectedCarId] || CARS_DATA['sf24'];

  const stageRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);

  // Studio Pan interactive state
  const [isPlaying, setIsPlaying] = useState(true);
  const [panAngle, setPanAngle] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loopProgress, setLoopProgress] = useState(0);

  // Gallery filter & lightbox
  const [galleryFilter, setGalleryFilter] = useState<'all' | 'studio' | 'action'>('all');
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null);

  // Auto-pan drift animation
  useEffect(() => {
    let animId: number;
    let startTime = performance.now();
    const cycleDuration = 10000;

    const tick = (now: number) => {
      if (isPlaying && !isHovered) {
        const elapsed = (now - startTime) % cycleDuration;
        const progress = elapsed / cycleDuration;
        setLoopProgress(Math.round(progress * 100));
        const angle = Math.sin(progress * Math.PI * 2) * 5;
        setPanAngle(angle);
      }
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, isHovered]);

  // Mouse pan interaction
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const xRatio = (e.clientX - rect.left) / rect.width;
    const angle = (xRatio - 0.5) * 12;
    setPanAngle(angle);
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setPanAngle(0);
  };

  const toggleFullscreen = () => {
    if (!stageRef.current) return;
    if (!isFullscreen) {
      if (stageRef.current.requestFullscreen) {
        stageRef.current.requestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Filter photos
  const filteredPhotos = PHOTO_DATA.filter((p) => {
    if (galleryFilter === 'all') return true;
    return p.type === galleryFilter;
  });

  // Action shot for the current selected car (if exists)
  const currentCarActionPhoto = PHOTO_DATA.find(
    (p) => p.type === 'action' && p.carId === selectedCarId
  );

  const handleSelectCar = (id: CarId) => {
    setCarId(id);
    // Smoothly scroll stage into view if needed
    if (stageRef.current) {
      const topOffset = stageRef.current.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({ top: topOffset, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-studio-100 min-h-screen text-studio-900 pb-28 pt-20">
      <div className="page-container">

        {/* ══════════════════════════════════════════════════════
            1. SHOWROOM HEADER (MINIMALIST & ART GALLERY VIBE)
            ══════════════════════════════════════════════════════ */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-f1red animate-pulse" />
              <span className="text-[11px] font-mono uppercase tracking-widest text-f1red font-bold">
                F1 Hyper-Showroom · 11 Cỗ Máy 2025/2026
              </span>
            </div>
            <h1 className="heading-display text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-studio-950">
              Trưng Bày Siêu Xe F1
            </h1>
            <p className="text-xs sm:text-sm font-body text-studio-600 mt-2 max-w-2xl font-light leading-relaxed">
              Chiêm ngưỡng vẻ đẹp đỉnh cao của các cỗ máy tốc độ đắt giá nhất hành tinh với chất lượng ảnh Dark Studio 4K và khoảnh khắc đường đua nghẹt thở.
            </p>
          </div>

          {/* Quick jump anchor pill */}
          <div className="flex items-center gap-2 shrink-0">
            <a
              href="#gallery-section"
              className="px-4 py-2 rounded-xs bg-white hover:bg-studio-950 text-studio-800 hover:text-white border border-studio-200 text-xs font-body font-semibold transition-all shadow-subtle flex items-center gap-2"
            >
              <Camera className="w-3.5 h-3.5 text-f1red" />
              <span>Xem Bộ Sưu Tập 17 Ảnh</span>
            </a>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════
            2. CAR SELECTOR RAIL (11 TEAM CARS SLIDER / TABS)
            ══════════════════════════════════════════════════════ */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2.5 px-0.5">
            <span className="text-[10px] font-mono uppercase tracking-widest text-studio-500 font-bold flex items-center gap-1.5">
              <Layers className="w-3 h-3 text-studio-400" />
              Chọn xe để chiêm ngưỡng (11 Đội đua)
            </span>
            <span className="text-[10px] font-mono text-studio-400 font-medium">
              Đang chọn: <strong className="text-studio-950">{car.name}</strong>
            </span>
          </div>

          {/* Horizontal scrollable rail */}
          <div
            ref={railRef}
            className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none snap-x"
          >
            {ALL_TEAMS_ORDER.map((id) => {
              const item = CARS_DATA[id];
              if (!item) return null;
              const isSelected = selectedCarId === id;

              return (
                <button
                  key={id}
                  onClick={() => handleSelectCar(id)}
                  className={`group relative shrink-0 snap-start flex items-center gap-2.5 py-2 px-3 rounded-sm border transition-all duration-200 text-left ${
                    isSelected
                      ? 'bg-studio-950 text-white border-studio-950 shadow-luxury'
                      : 'bg-white hover:bg-studio-50 text-studio-800 border-studio-200 hover:border-studio-400 shadow-xs'
                  }`}
                >
                  {/* Team livery color accent dot */}
                  <span
                    className={`w-2.5 h-2.5 rounded-full shrink-0 transition-transform ${
                      isSelected ? 'scale-125 ring-2 ring-white/50' : 'group-hover:scale-110'
                    }`}
                    style={{ background: item.primaryColor }}
                  />

                  {/* Thumbnail */}
                  <div className="w-10 h-6 rounded-xs overflow-hidden bg-black shrink-0 border border-white/10">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Team & Car Name */}
                  <div className="flex flex-col leading-tight">
                    <span
                      className={`text-[9px] font-mono uppercase tracking-wider font-semibold truncate max-w-[90px] ${
                        isSelected ? 'text-white/70' : 'text-studio-400'
                      }`}
                    >
                      {item.shortName}
                    </span>
                    <span className="text-xs font-display font-bold truncate max-w-[90px]">
                      {item.name}
                    </span>
                  </div>

                  {/* Active Indicator bar */}
                  {isSelected && (
                    <span
                      className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full"
                      style={{ background: item.primaryColor }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════
            3. CINEMA SHOWROOM STAGE (16:9 WIDESCREEN HERO)
            ══════════════════════════════════════════════════════ */}
        <div
          ref={stageRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="relative w-full aspect-[16/9] sm:aspect-[21/9] lg:aspect-[20/8.5] bg-studio-950 rounded-sm overflow-hidden border border-studio-300 shadow-2xl mb-8 group select-none"
        >
          {/* Subtle Ambient Radial Lighting tinted to Team Livery */}
          <div
            className="absolute inset-0 pointer-events-none transition-all duration-700 ease-out"
            style={{
              background: `radial-gradient(ellipse 90% 70% at 50% 45%, ${car.primaryColor}22 0%, transparent 70%)`,
            }}
          />

          {/* Luxury Studio Top Spotlight */}
          <div
            className="absolute -top-32 left-1/2 -translate-x-1/2 w-[80%] h-64 pointer-events-none opacity-40 blur-3xl rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.7) 0%, transparent 70%)' }}
          />

          {/* Interactive Car Canvas / Image with Pan & Scale */}
          <div
            className="absolute inset-0 flex items-center justify-center p-4 sm:p-8 transition-transform duration-100 ease-out pointer-events-none"
            style={{
              transform: `perspective(1200px) rotateY(${panAngle}deg) scale(${1 + Math.abs(panAngle) * 0.008})`,
              transformStyle: 'preserve-3d',
            }}
          >
            <img
              src={car.image}
              alt={car.name}
              className="max-w-[94%] max-h-[92%] object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.9)]"
            />

            {/* Specular glare overlay */}
            <div
              className="absolute inset-0 pointer-events-none transition-all duration-300"
              style={{
                background: `radial-gradient(circle 460px at ${50 + panAngle * 2.5}% 45%, rgba(255, 255, 255, 0.28) 0%, transparent 75%)`,
                mixBlendMode: 'overlay',
              }}
            />
          </div>

          {/* Top Left: Team & Car Identity */}
          <div className="absolute top-4 left-4 z-20 pointer-events-none">
            <div className="bg-black/80 backdrop-blur-md border border-white/15 px-4 py-2.5 rounded-sm shadow-luxury flex items-center gap-3 text-white">
              <span
                className="w-3 h-3 rounded-full shrink-0 ring-2 ring-white/30"
                style={{ background: car.primaryColor }}
              />
              <div>
                <span
                  className="text-[9px] uppercase tracking-widest font-mono font-bold block leading-none mb-0.5"
                  style={{ color: car.primaryColor }}
                >
                  {car.team}
                </span>
                <span className="text-base sm:text-lg font-display font-bold leading-tight block">
                  {car.name}
                </span>
              </div>
            </div>
          </div>

          {/* Top Right: Driver Pair Badge */}
          <div className="absolute top-4 right-4 z-20 pointer-events-none hidden sm:flex items-center gap-2">
            <div className="bg-black/80 backdrop-blur-md border border-white/15 px-3.5 py-2 rounded-sm shadow-luxury text-right">
              <span className="text-[8px] uppercase tracking-widest text-white/50 block font-mono">
                BỘ ĐÔI TAY ĐUA
              </span>
              <span className="text-xs font-mono font-bold text-white tracking-wide">
                {car.drivers.join(' · ')}
              </span>
            </div>
          </div>

          {/* Bottom Controls Bar */}
          <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between gap-3 pointer-events-auto">
            {/* Auto-drift control */}
            <div className="flex items-center gap-2.5 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/15">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-5 h-5 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition-all"
                title={isPlaying ? 'Tạm dừng góc xoay nhẹ' : 'Tiếp tục xoay nhẹ'}
              >
                {isPlaying ? <Pause className="w-2.5 h-2.5" /> : <Play className="w-2.5 h-2.5" />}
              </button>

              <div className="w-16 sm:w-24 h-1 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-f1red transition-all duration-75"
                  style={{ width: `${loopProgress}%` }}
                />
              </div>

              <span className="text-[8.5px] font-mono text-white/60">
                {isHovered ? 'Rê chuột để chỉnh góc' : 'Góc xoay 3D'}
              </span>
            </div>

            {/* Fullscreen Button */}
            <button
              onClick={toggleFullscreen}
              className="w-8 h-8 rounded-full bg-black/80 hover:bg-black/95 text-white/80 hover:text-white flex items-center justify-center border border-white/20 transition-all shadow-subtle"
              title={isFullscreen ? 'Thu nhỏ' : 'Toàn màn hình'}
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════
            4. THE 4 GOLD SPECS & FOCUSED MULTI-VIEW OF SELECTED CAR
            ══════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-16">

          {/* Left: 4 Gold Telemetry Metrics (Minimalist Luxury) */}
          <div className="lg:col-span-5 bg-white border border-studio-200 rounded-sm p-6 shadow-subtle flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3.5 border-b border-studio-100 mb-5">
                <div>
                  <span className="text-[9px] font-mono uppercase tracking-widest text-studio-400 font-bold block mb-0.5">
                    THÔNG SỐ HIỆU NĂNG
                  </span>
                  <h3 className="font-display text-lg font-bold text-studio-950">
                    4 Chỉ Số Vàng Của {car.name}
                  </h3>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-studio-100 rounded-xs text-studio-700">
                  {car.year} FIA Spec
                </span>
              </div>

              {/* The 4 Big Metric Cards */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                {/* 1. Công suất */}
                <div className="bg-studio-50/80 border border-studio-200/80 p-3.5 rounded-sm">
                  <div className="flex items-center gap-1.5 text-studio-500 mb-1">
                    <Zap className="w-3.5 h-3.5 text-yellow-500" />
                    <span className="text-[9px] font-mono uppercase font-bold tracking-wider">Công Suất</span>
                  </div>
                  <div className="text-2xl font-display font-bold text-studio-950 leading-none">
                    {car.horsepower} <span className="text-[11px] font-mono font-normal text-studio-500">BHP</span>
                  </div>
                  <span className="text-[9.5px] font-body text-studio-400 mt-1 block">
                    Động cơ Turbo Hybrid V6
                  </span>
                </div>

                {/* 2. Tốc độ đỉnh */}
                <div className="bg-studio-50/80 border border-studio-200/80 p-3.5 rounded-sm">
                  <div className="flex items-center gap-1.5 text-studio-500 mb-1">
                    <Gauge className="w-3.5 h-3.5 text-f1red" />
                    <span className="text-[9px] font-mono uppercase font-bold tracking-wider">Tốc Độ Đỉnh</span>
                  </div>
                  <div className="text-2xl font-display font-bold text-studio-950 leading-none">
                    {car.topSpeedKmh} <span className="text-[11px] font-mono font-normal text-studio-500">KM/H</span>
                  </div>
                  <span className="text-[9.5px] font-body text-studio-400 mt-1 block">
                    Vận tốc tối đa DRS mở
                  </span>
                </div>

                {/* 3. Gia tốc 0-100 */}
                <div className="bg-studio-50/80 border border-studio-200/80 p-3.5 rounded-sm">
                  <div className="flex items-center gap-1.5 text-studio-500 mb-1">
                    <Timer className="w-3.5 h-3.5 text-cyan-600" />
                    <span className="text-[9px] font-mono uppercase font-bold tracking-wider">0–100 KM/H</span>
                  </div>
                  <div className="text-2xl font-display font-bold text-studio-950 leading-none">
                    {car.zeroToHundredSec} <span className="text-[11px] font-mono font-normal text-studio-500">Giây</span>
                  </div>
                  <span className="text-[9.5px] font-body text-studio-400 mt-1 block">
                    Khởi động đứng yên
                  </span>
                </div>

                {/* 4. Trọng lượng */}
                <div className="bg-studio-50/80 border border-studio-200/80 p-3.5 rounded-sm">
                  <div className="flex items-center gap-1.5 text-studio-500 mb-1">
                    <Scale className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-[9px] font-mono uppercase font-bold tracking-wider">Trọng Lượng</span>
                  </div>
                  <div className="text-2xl font-display font-bold text-studio-950 leading-none">
                    798 <span className="text-[11px] font-mono font-normal text-studio-500">KG</span>
                  </div>
                  <span className="text-[9.5px] font-body text-studio-400 mt-1 block">
                    Tiêu chuẩn tối thiểu FIA
                  </span>
                </div>
              </div>

              {/* Minimal Engine Specs Line */}
              <div className="py-2.5 px-3 bg-studio-100 rounded-sm flex items-center justify-between text-[11px] font-mono">
                <span className="text-studio-500 uppercase tracking-wider text-[9px] font-bold">Nhà Cung Cấp Động Cơ</span>
                <span className="text-studio-950 font-bold truncate max-w-[200px]">{car.engine}</span>
              </div>
            </div>

            {/* Quick summary note */}
            <div className="mt-4 pt-3 border-t border-studio-100 text-[11px] font-body text-studio-600 font-light leading-relaxed flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-f1red shrink-0" />
              <span>
                Cỗ máy đại diện cho đỉnh cao khí động học và sức mạnh của <strong>{car.team}</strong>.
              </span>
            </div>
          </div>

          {/* Right: Multi-View / Action Shot Showcase of this specific car */}
          <div className="lg:col-span-7 bg-white border border-studio-200 rounded-sm p-6 shadow-subtle flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3.5 border-b border-studio-100 mb-4">
                <div>
                  <span className="text-[9px] font-mono uppercase tracking-widest text-studio-400 font-bold block mb-0.5">
                    GÓC ẢNH ĐẶC TẢ
                  </span>
                  <h3 className="font-display text-lg font-bold text-studio-950">
                    Khoảnh Khắc Của {car.name}
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-studio-500">
                  {currentCarActionPhoto ? 'Studio 4K & Action Track' : 'Studio 4K Render'}
                </span>
              </div>

              {/* 2-Column Photo Comparison (Studio Render + Action Photo if available) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Photo 1: Studio Shot */}
                <div
                  onClick={() => {
                    const studioPhoto = PHOTO_DATA.find((p) => p.id === `studio_${selectedCarId}`);
                    if (studioPhoto) setSelectedPhoto(studioPhoto);
                  }}
                  className="group relative aspect-video rounded-sm overflow-hidden bg-studio-950 border border-studio-200 cursor-pointer shadow-subtle hover:shadow-luxury transition-all"
                >
                  <img
                    src={car.image}
                    alt={car.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
                  <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white">
                    <div>
                      <span className="text-[8.5px] font-mono uppercase tracking-wider text-white/60 block">Góc Chụp</span>
                      <span className="text-xs font-display font-bold">Studio Chi Tiết 4K</span>
                    </div>
                    <Maximize2 className="w-3.5 h-3.5 text-white/70 group-hover:text-white" />
                  </div>
                </div>

                {/* Photo 2: Action Shot OR High-res detail */}
                {currentCarActionPhoto ? (
                  <div
                    onClick={() => setSelectedPhoto(currentCarActionPhoto)}
                    className="group relative aspect-video rounded-sm overflow-hidden bg-studio-950 border border-studio-200 cursor-pointer shadow-subtle hover:shadow-luxury transition-all"
                  >
                    <img
                      src={currentCarActionPhoto.imageUrl}
                      alt={currentCarActionPhoto.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
                    <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white">
                      <div>
                        <span className="text-[8.5px] font-mono uppercase tracking-wider text-white/60 block">Đường Đua</span>
                        <span className="text-xs font-display font-bold truncate max-w-[140px]">
                          {currentCarActionPhoto.title}
                        </span>
                      </div>
                      <Maximize2 className="w-3.5 h-3.5 text-white/70 group-hover:text-white" />
                    </div>
                  </div>
                ) : (
                  <div className="aspect-video rounded-sm bg-studio-50 border border-dashed border-studio-300 flex flex-col items-center justify-center p-4 text-center">
                    <Camera className="w-6 h-6 text-studio-400 mb-2" />
                    <span className="text-xs font-display font-bold text-studio-800">
                      Góc Studio Chuẩn Quốc Tế
                    </span>
                    <span className="text-[10px] font-body text-studio-500 mt-0.5">
                      Ảnh độ phân giải cao được render với hệ thống ánh sáng studio độc quyền.
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Bar: Action link to open gallery */}
            <div className="mt-4 pt-3.5 border-t border-studio-100 flex items-center justify-between">
              <span className="text-[10px] font-mono text-studio-500">
                Nhấn vào ảnh để xem chi tiết ở chế độ toàn màn hình.
              </span>
              <a
                href="#gallery-section"
                className="text-xs font-mono uppercase tracking-wider font-bold text-f1red hover:underline flex items-center gap-1"
              >
                <span>Xem Thư Viện 17 Ảnh</span>
                <span>→</span>
              </a>
            </div>
          </div>

        </div>

        {/* ══════════════════════════════════════════════════════
            5. BỘ SƯU TẬP ẢNH NGHỆ THUẬT (17 HIGH-RES PHOTOS)
            ══════════════════════════════════════════════════════ */}
        <section id="gallery-section" className="pt-8 border-t border-studio-300">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Camera className="w-4 h-4 text-f1red" />
                <span className="text-[11px] font-mono uppercase tracking-widest text-f1red font-bold">
                  Bộ Sưu Tập Nghệ Thuật F1
                </span>
              </div>
              <h2 className="heading-display text-2xl sm:text-4xl font-bold text-studio-950">
                17 Bức Ảnh Xe Đua & Khoảnh Khắc Đỉnh Cao
              </h2>
              <p className="text-xs sm:text-sm font-body text-studio-600 mt-1 max-w-xl font-light">
                Trọn bộ 11 cỗ máy F1 studio chuyên nghiệp và các khoảnh khắc đua nghẹt thở trên đường đua thế giới.
              </p>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1.5 bg-white p-1 rounded-sm border border-studio-200 shadow-xs shrink-0">
              <button
                onClick={() => setGalleryFilter('all')}
                className={`px-3 py-1.5 rounded-xs text-[11px] font-body font-semibold transition-all ${
                  galleryFilter === 'all'
                    ? 'bg-studio-950 text-white shadow-xs'
                    : 'text-studio-600 hover:text-studio-950'
                }`}
              >
                Tất Cả ({PHOTO_DATA.length})
              </button>
              <button
                onClick={() => setGalleryFilter('studio')}
                className={`px-3 py-1.5 rounded-xs text-[11px] font-body font-semibold transition-all ${
                  galleryFilter === 'studio'
                    ? 'bg-studio-950 text-white shadow-xs'
                    : 'text-studio-600 hover:text-studio-950'
                }`}
              >
                Studio 4K (11)
              </button>
              <button
                onClick={() => setGalleryFilter('action')}
                className={`px-3 py-1.5 rounded-xs text-[11px] font-body font-semibold transition-all ${
                  galleryFilter === 'action'
                    ? 'bg-studio-950 text-white shadow-xs'
                    : 'text-studio-600 hover:text-studio-950'
                }`}
              >
                Action Đường Đua (6)
              </button>
            </div>
          </div>

          {/* 3D Tilt Card Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredPhotos.map((item) => (
              <TiltPhotoCard key={item.id} item={item} onSelect={setSelectedPhoto} />
            ))}
          </div>
        </section>

      </div>

      {/* ══════════════════════════════════════════════════════
          6. LIGHTBOX MODAL CHO BỘ SƯU TẬP ẢNH
          ══════════════════════════════════════════════════════ */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/92 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-fade-in"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="relative max-w-5xl w-full bg-studio-950 border border-white/20 rounded-sm overflow-hidden shadow-2xl flex flex-col max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 bg-black/70">
              <div className="flex items-center gap-2.5">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ background: selectedPhoto.accentColor }}
                />
                <span className="text-xs font-mono uppercase tracking-wider text-white/70">
                  {selectedPhoto.team}
                </span>
              </div>
              <button
                onClick={() => setSelectedPhoto(null)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors"
                title="Đóng (ESC)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Photo Container */}
            <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden min-h-[300px] max-h-[68vh]">
              <img
                src={selectedPhoto.imageUrl}
                alt={selectedPhoto.title}
                className="max-w-full max-h-full object-contain"
              />
            </div>

            {/* Bottom Details & CTA */}
            <div className="p-5 bg-studio-950 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base sm:text-lg font-display font-bold text-white mb-0.5">
                  {selectedPhoto.title}
                </h3>
                <p className="text-xs font-body text-white/60">
                  {selectedPhoto.subtitle}
                </p>
              </div>

              {selectedPhoto.carId && (
                <button
                  onClick={() => {
                    const cId = selectedPhoto.carId!;
                    setSelectedPhoto(null);
                    handleSelectCar(cId);
                  }}
                  className="px-4 py-2 bg-f1red hover:bg-red-700 text-white rounded-xs text-xs font-body uppercase tracking-wider font-bold transition-all shadow-subtle flex items-center gap-2 self-start sm:self-auto"
                >
                  <span>Xem Trên Sân Khấu Chính</span>
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
