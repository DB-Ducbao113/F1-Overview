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
  Users,
  ChevronRight,
  ArrowUp,
  X,
} from 'lucide-react';

// 11 Official F1 Teams in Championship Order
const ALL_TEAMS_ORDER: CarId[] = [
  'w15',         // Mercedes
  'sf24',        // Ferrari
  'mcl38',       // McLaren
  'rb20',        // Red Bull Racing
  'racingbulls', // Racing Bulls
  'alpine',      // Alpine
  'haas',        // Haas F1 Team
  'audi',        // Audi F1 Team
  'williams',    // Williams Racing
  'astonmartin', // Aston Martin
  'cadillac'     // Cadillac F1 Team
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
  { id: 'studio_w15',       title: 'Mercedes-AMG W15 E Performance', subtitle: 'Mũi Tên Bạc Tái Sinh · Mùa Giải 2025',        team: 'Mercedes-AMG Petronas',   imageUrl: '/images/teams/w15.jpg',        type: 'studio', accentColor: '#00a19c', carId: 'w15' },
  { id: 'studio_sf24',      title: 'Ferrari SF-24',                   subtitle: 'Rosso Corsa Vĩnh Cửu · Scuderia Ferrari',    team: 'Scuderia Ferrari HP',     imageUrl: '/images/teams/sf24.jpg',       type: 'studio', accentColor: '#e80020', carId: 'sf24' },
  { id: 'studio_mcl38',     title: 'McLaren MCL38',                   subtitle: 'Papaya Power · Mùa Giải Hoàng Kim',          team: 'McLaren F1 Team',         imageUrl: '/images/teams/mcl38.jpg',      type: 'studio', accentColor: '#ff8000', carId: 'mcl38' },
  { id: 'studio_rb20',      title: 'Red Bull RB20',                   subtitle: 'Tốc Độ Vô Song · Oracle Red Bull',           team: 'Oracle Red Bull Racing',  imageUrl: '/images/teams/rb20.jpg',       type: 'studio', accentColor: '#3671c6', carId: 'rb20' },
  { id: 'studio_rbulls',    title: 'Racing Bulls VCARB 02',           subtitle: 'Trang Sức Junior · Visa Cash App RB',        team: 'Visa Cash App RB F1 Team',imageUrl: '/images/teams/racingbulls.jpg',type: 'studio', accentColor: '#6692ff', carId: 'racingbulls' },
  { id: 'studio_alpine',    title: 'Alpine A525',                     subtitle: 'Bleu de France · BWT Alpine F1',             team: 'BWT Alpine F1 Team',      imageUrl: '/images/teams/alpine.jpg',     type: 'studio', accentColor: '#ff87bc', carId: 'alpine' },
  { id: 'studio_haas',      title: 'Haas VF-25',                      subtitle: 'Đội Mỹ Duy Nhất · Haas F1 Team',             team: 'MoneyGram Haas F1 Team',  imageUrl: '/images/teams/haas.jpg',       type: 'studio', accentColor: '#b6babd', carId: 'haas' },
  { id: 'studio_audi',      title: 'Audi F1 AG 001',                  subtitle: 'Vorsprung Durch Technik · Audi F1 AG',      team: 'Audi F1 AG',              imageUrl: '/images/teams/audi.jpg',       type: 'studio', accentColor: '#bb0a30', carId: 'audi' },
  { id: 'studio_williams',  title: 'Williams FW47',                   subtitle: 'Racing Blue Sails · Williams Racing',        team: 'Williams Racing',         imageUrl: '/images/teams/williams.jpg',   type: 'studio', accentColor: '#005aff', carId: 'williams' },
  { id: 'studio_am',        title: 'Aston Martin AMR25',              subtitle: 'British Racing Green · Aston Martin',         team: 'Aston Martin Aramco F1',  imageUrl: '/images/teams/astonmartin.jpg',type: 'studio', accentColor: '#00594f', carId: 'astonmartin' },
  { id: 'studio_cadillac',  title: 'Cadillac TWO',                    subtitle: 'American Icon Returns · GM Cadillac',         team: 'GM Cadillac F1 Team',     imageUrl: '/images/teams/cadillac.jpg',   type: 'studio', accentColor: '#b8992c', carId: 'cadillac' },
  // 6 Action shots
  { id: 'action_rb20',      title: 'RB20 · Tia Lửa Đỉnh Cao',        subtitle: 'Red Bull Ring · Mưa Tia Lửa Titan',           team: 'Oracle Red Bull Racing',  imageUrl: '/images/gallery/rb20_action.jpg',       type: 'action', accentColor: '#cc1e4a', carId: 'rb20' },
  { id: 'action_sf24',      title: 'SF-24 · Khúc Cua Vàng Monza',    subtitle: 'Curva Grande · Rosso Corsa Bừng Sáng',        team: 'Scuderia Ferrari HP',     imageUrl: '/images/gallery/sf24_action.jpg',      type: 'action', accentColor: '#e80020', carId: 'sf24' },
  { id: 'action_mcl38',     title: 'MCL38 · Đêm Marina Bay',          subtitle: 'Singapore GP · Đĩa Phanh Đỏ Rực 1050°C',     team: 'McLaren F1 Team',         imageUrl: '/images/gallery/mcl38_action.jpg',     type: 'action', accentColor: '#ff8000', carId: 'mcl38' },
  { id: 'action_w15',       title: 'W15 · Xoáy Khí Silverstone',      subtitle: 'Maggotts & Becketts · 5.3G Lateral',         team: 'Mercedes-AMG Petronas',   imageUrl: '/images/gallery/w15_action.jpg',        type: 'action', accentColor: '#27f4d2', carId: 'w15' },
  { id: 'action_cockpit',   title: 'Góc Nhìn Buồng Lái · 338 km/h',  subtitle: 'Baku City Circuit · Halo & Carbon Wheel',    team: 'Oracle Red Bull Racing',  imageUrl: '/images/gallery/cockpit_action.jpg',    type: 'action', accentColor: '#38bdf8' },
  { id: 'action_pitstop',   title: 'Pit Stop Kỷ Lục · 1.9 Giây',     subtitle: 'Spa-Francorchamps · 20 Thợ Máy Tinh Nhuệ',   team: 'Red Bull Racing Pit Crew',imageUrl: '/images/gallery/pitstop_action.jpg',    type: 'action', accentColor: '#eab308' },
];

// 3D Tilt card with glare spotlight
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
    setTransform(`perspective(1000px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) scale3d(1.03,1.03,1.03)`);
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
      className="group relative cursor-pointer rounded-sm overflow-hidden bg-white border border-studio-200 shadow-subtle hover:shadow-luxury flex flex-col"
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
            background: item.type === 'studio' ? 'rgba(0,0,0,0.7)' : 'rgba(232,0,32,0.85)',
            color: '#fff',
          }}
        >
          {item.type === 'studio' ? 'Studio 4K' : 'Action'}
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
          <p className="text-[10px] font-body text-studio-500 line-clamp-1 mt-0.5">
            {item.subtitle}
          </p>
        </div>
      </div>
    </div>
  );
};

export const ModelsView: React.FC = () => {
  const { selectedCarId, setCarId, lang } = useCarStore();
  const car = CARS_DATA[selectedCarId] || CARS_DATA.w15;

  const [isPlaying, setIsPlaying] = useState(true);
  const [loopProgress, setLoopProgress] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  // Photo gallery filter & lightbox
  const [galleryFilter, setGalleryFilter] = useState<'all' | 'studio' | 'action'>('all');
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null);

  const stageRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);

  // Subtle 3D Turntable Pan Oscillation
  const [panAngle, setPanAngle] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setLoopProgress((prev) => {
        const next = (prev + 1) % 100;
        const rad = (next / 100) * Math.PI * 2;
        setPanAngle(Math.sin(rad) * 7.5);
        return next;
      });
    }, 45);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Interactive mouse tilt over stage
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -6;
    setMouseOffset({ x, y });
  };

  const handleMouseLeave = () => {
    setMouseOffset({ x: 0, y: 0 });
  };

  const toggleFullscreen = () => {
    if (!stageRef.current) return;
    if (!document.fullscreenElement) {
      stageRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleSelectCarAndScroll = (carId: CarId) => {
    setCarId(carId);
    stageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const filteredPhotos = PHOTO_DATA.filter((p) => {
    if (galleryFilter === 'all') return true;
    return p.type === galleryFilter;
  });

  const totalRotationY = panAngle + mouseOffset.x;
  const totalRotationX = mouseOffset.y;

  return (
    <div ref={topRef} className="min-h-screen bg-[#f8f9fb] pt-20 pb-24 select-none">
      <div className="page-container">

        {/* ══════════════════════════════════════════════════════
            1. TOP HEADER & QUICK SECTION JUMP
            ══════════════════════════════════════════════════════ */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-f1red animate-pulse" />
              <h1 className="text-sm font-display uppercase tracking-wider font-bold text-studio-950">
                {lang === 'vi' ? 'Đội Đua & Xe F1 — Mùa Giải FIA 2025' : 'FIA Formula 1 Championship Teams & Cars Grid'}
              </h1>
            </div>

            {/* Quick in-page section links */}
            <div className="flex items-center gap-2 text-xs">
              <button
                onClick={() => scrollToSection('car-stage')}
                className="px-3 py-1 rounded-full bg-white border border-studio-200 text-studio-700 hover:text-f1red hover:border-studio-400 font-body text-[11px] font-semibold transition-all shadow-xs"
              >
                🏎️ Sân Khấu Xe
              </button>
              <button
                onClick={() => scrollToSection('gallery-section')}
                className="px-3 py-1 rounded-full bg-white border border-studio-200 text-studio-700 hover:text-f1red hover:border-studio-400 font-body text-[11px] font-semibold transition-all shadow-xs flex items-center gap-1"
              >
                <Camera className="w-3 h-3 text-studio-500" />
                Bộ Sưu Tập (17)
              </button>
              <button
                onClick={() => scrollToSection('teams-section')}
                className="px-3 py-1 rounded-full bg-white border border-studio-200 text-studio-700 hover:text-f1red hover:border-studio-400 font-body text-[11px] font-semibold transition-all shadow-xs flex items-center gap-1"
              >
                <Users className="w-3 h-3 text-studio-500" />
                11 Đội & Tay Đua
              </button>
            </div>
          </div>

          {/* 11 Teams Horizontal Selector Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-11 gap-2 overflow-x-auto no-scrollbar pb-2">
            {ALL_TEAMS_ORDER.map((id) => {
              const tData = CARS_DATA[id];
              const isActive = selectedCarId === id;
              return (
                <button
                  key={id}
                  onClick={() => setCarId(id)}
                  className={`p-2.5 rounded-sm border text-left transition-all duration-200 relative flex flex-col justify-between min-h-[82px] ${
                    isActive
                      ? 'bg-studio-950 text-white border-studio-950 shadow-luxury scale-[1.02] z-10'
                      : 'bg-white hover:bg-studio-50 border-studio-200 text-studio-800 hover:border-studio-400 shadow-xs'
                  }`}
                  aria-pressed={isActive}
                >
                  {/* Top Color Accent Line */}
                  <div
                    className="absolute top-0 left-0 right-0 h-1 rounded-t-sm"
                    style={{ background: tData.primaryColor }}
                  />

                  <div>
                    <div className="flex items-center justify-between gap-1 mb-0.5 mt-0.5">
                      <span className="text-xs font-display font-bold leading-tight truncate">
                        {tData.shortName}
                      </span>
                      <span
                        className="w-2 h-2 rounded-full shrink-0 shadow-xs"
                        style={{ background: tData.primaryColor }}
                      />
                    </div>
                    <span className={`text-[9.5px] font-body line-clamp-1 leading-tight ${
                      isActive ? 'text-white/80' : 'text-studio-500'
                    }`}>
                      {tData.team.replace('Formula One Team', '').replace('Formula 1 Team', '').replace('F1 Team', '')}
                    </span>
                  </div>

                  {/* Drivers in concise single line */}
                  <div className={`pt-1 border-t text-[8.5px] font-mono leading-tight truncate ${
                    isActive ? 'border-white/15 text-emerald-400 font-semibold' : 'border-studio-100 text-studio-600'
                  }`}>
                    {(tData.drivers[0].split(' ')[1] || tData.drivers[0])} · {(tData.drivers[1].split(' ')[1] || tData.drivers[1])}
                  </div>

                  {/* Active bottom red indicator */}
                  {isActive && (
                    <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-f1red rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════
            2. THE CAR SHOWCASE STAGE
            ══════════════════════════════════════════════════════ */}
        <div
          id="car-stage"
          ref={stageRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative aspect-[16/9] min-h-[460px] sm:min-h-[560px] w-full rounded-sm overflow-hidden bg-gradient-to-br from-studio-950 via-[#0a1015] to-studio-950 border border-studio-300 shadow-luxury mb-8 group transition-all"
        >
          {/* Team Ambient Glow */}
          <div
            className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full pointer-events-none blur-[150px] opacity-35 transition-all duration-700"
            style={{ background: car.primaryColor }}
          />
          <div
            className="absolute -bottom-32 -right-32 w-[550px] h-[550px] rounded-full pointer-events-none blur-[140px] opacity-25 transition-all duration-700"
            style={{ background: car.accentColor }}
          />

          {/* Perspective Studio Grid Floor */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(to bottom, transparent 60%, rgba(255,255,255,0.18) 100%),
                repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(255,255,255,0.08) 40px),
                repeating-linear-gradient(90deg, transparent, transparent 59px, rgba(255,255,255,0.05) 60px)
              `,
            }}
          />

          {/* ── Studio Render with Dynamic 3D Pan ── */}
          <div
            className="w-full h-full relative transition-transform duration-300 ease-out select-none flex items-center justify-center overflow-hidden"
            style={{
              perspective: 1200,
              transform: `rotateX(${totalRotationX.toFixed(2)}deg) rotateY(${totalRotationY.toFixed(2)}deg) scale(1.02)`,
              transformStyle: 'preserve-3d',
            }}
          >
            <img
              key={car.id}
              src={car.image}
              alt={`${car.team} - ${car.name}`}
              className="w-full h-full object-cover select-none pointer-events-none filter brightness-105 animate-fade-in transition-opacity duration-500"
            />

            {/* Dynamic Sweeping Studio Light Sheen */}
            <div
              className="absolute inset-0 pointer-events-none transition-all duration-300"
              style={{
                background: `radial-gradient(circle 420px at ${50 + panAngle * 2.2}% 45%, rgba(255, 255, 255, 0.35) 0%, transparent 75%)`,
                mixBlendMode: 'overlay',
              }}
            />
          </div>

          {/* ── Top Left Floating Team Card ── */}
          <div className="absolute top-4 left-4 z-20 pointer-events-none">
            <div className="bg-black/85 backdrop-blur-md border border-white/20 px-4 py-3 rounded-sm shadow-luxury flex items-center gap-3.5 text-white">
              <span
                className="w-3.5 h-3.5 rounded-full shadow-xs shrink-0 ring-2 ring-white/30"
                style={{ background: car.primaryColor }}
              />
              <div>
                <span
                  className="text-[9px] uppercase tracking-widest font-bold block leading-none mb-1"
                  style={{ color: car.primaryColor }}
                >
                  {car.team}
                </span>
                <span className="text-base font-display font-bold leading-tight block">
                  {car.name}
                </span>
              </div>
            </div>
          </div>

          {/* ── Top Right Telemetry Card ── */}
          <div className="absolute top-4 right-4 z-20 pointer-events-none hidden sm:flex items-center gap-3">
            <div className="bg-black/85 backdrop-blur-md border border-white/20 px-4 py-2.5 rounded-sm shadow-luxury flex items-center gap-4 text-white font-mono text-xs">
              <div>
                <span className="text-[8px] uppercase tracking-widest text-white/50 block font-body">CÔNG SUẤT</span>
                <span className="font-bold text-yellow-400">{car.horsepower} BHP</span>
              </div>
              <div className="w-[1px] h-6 bg-white/20" />
              <div>
                <span className="text-[8px] uppercase tracking-widest text-white/50 block font-body">LỰC NÉN</span>
                <span className="font-bold text-cyan-400">{car.downforceAt250KmhKgf} KGF</span>
              </div>
              <div className="w-[1px] h-6 bg-white/20" />
              <div>
                <span className="text-[8px] uppercase tracking-widest text-white/50 block font-body">TỐC ĐỘ ĐỈNH</span>
                <span className="font-bold text-white">{car.topSpeedKmh} KM/H</span>
              </div>
            </div>
          </div>

          {/* ── Bottom Controls Bar ── */}
          <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between gap-3 pointer-events-auto">
            <div className="flex items-center gap-2 bg-black/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-all"
                title={isPlaying ? 'Tạm dừng chuyển động' : 'Phát chuyển động'}
              >
                {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              </button>

              <div className="w-20 sm:w-28 h-1 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-f1red transition-all duration-75"
                  style={{ width: `${loopProgress}%` }}
                />
              </div>

              <span className="text-[9px] font-mono text-white/70 w-8 text-right">
                {loopProgress}%
              </span>
            </div>

            <button
              onClick={toggleFullscreen}
              className="w-8 h-8 rounded-full bg-black/80 hover:bg-black/95 text-white/80 hover:text-white flex items-center justify-center border border-white/20 transition-all"
              title={isFullscreen ? 'Thu nhỏ' : 'Toàn màn hình'}
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════
            3. TECHNICAL SPECIFICATIONS SNAPSHOT
            ══════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16">
          {/* Main Car Profile */}
          <div className="lg:col-span-2 bg-white border border-studio-200 rounded-sm p-6 sm:p-7 shadow-subtle flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-studio-100 mb-5">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest font-bold block mb-0.5" style={{ color: car.primaryColor }}>
                    {car.team}
                  </span>
                  <h2 className="font-display text-xl sm:text-2xl font-bold text-studio-950 leading-tight">
                    {car.name}
                  </h2>
                </div>
                <span className="text-[11px] font-mono font-bold px-2.5 py-1 bg-studio-100 rounded-sm text-studio-700">
                  {car.year} FIA Spec
                </span>
              </div>

              <p className="text-sm font-body text-studio-700 leading-relaxed mb-5">
                {car.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-5">
                <div className="bg-studio-50/70 border border-studio-200/80 p-3.5 rounded-sm">
                  <span className="text-[9.5px] font-mono uppercase tracking-wider text-studio-500 font-bold block mb-1">
                    Khí Động Học
                  </span>
                  <p className="text-xs font-body text-studio-900 leading-snug font-medium">
                    {car.aeroPhilosophy}
                  </p>
                </div>
                <div className="bg-studio-50/70 border border-studio-200/80 p-3.5 rounded-sm">
                  <span className="text-[9.5px] font-mono uppercase tracking-wider text-f1red font-bold block mb-1">
                    Hiệu Ứng Mặt Đất
                  </span>
                  <p className="text-xs font-body text-studio-900 leading-snug font-medium">
                    {car.groundEffectNotes}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-studio-100 flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-studio-500">
              <span>Thiết kế: <strong className="text-studio-800 font-medium">{car.designer}</strong></span>
              <span>Treo: <strong className="text-studio-800 font-medium">{car.suspensionFront} / {car.suspensionRear}</strong></span>
            </div>
          </div>

          {/* Quick Specs Snapshot */}
          <div className="bg-white border border-studio-200 rounded-sm p-6 shadow-subtle flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-studio-100 mb-4">
                <h3 className="font-display text-sm font-bold uppercase tracking-wider text-studio-950">
                  Thông Số Kỹ Thuật
                </h3>
                <span className="text-[10px] font-mono text-studio-400">Telemetry</span>
              </div>

              <div className="grid grid-cols-2 gap-2.5 mb-4">
                <div className="bg-studio-50 p-3 rounded-sm border border-studio-100">
                  <span className="text-[9px] font-body uppercase text-studio-500 block mb-0.5">Công suất</span>
                  <span className="text-base font-display font-bold text-f1red">{car.horsepower} <span className="text-[10px] font-normal font-mono text-studio-600">bhp</span></span>
                </div>
                <div className="bg-studio-50 p-3 rounded-sm border border-studio-100">
                  <span className="text-[9px] font-body uppercase text-studio-500 block mb-0.5">Tốc độ đỉnh</span>
                  <span className="text-base font-display font-bold text-studio-950">{car.topSpeedKmh} <span className="text-[10px] font-normal font-mono text-studio-600">km/h</span></span>
                </div>
                <div className="bg-studio-50 p-3 rounded-sm border border-studio-100">
                  <span className="text-[9px] font-body uppercase text-studio-500 block mb-0.5">0-100 km/h</span>
                  <span className="text-base font-display font-bold text-studio-950">{car.zeroToHundredSec}s</span>
                </div>
                <div className="bg-studio-50 p-3 rounded-sm border border-studio-100">
                  <span className="text-[9px] font-body uppercase text-studio-500 block mb-0.5">Lực nén 250km/h</span>
                  <span className="text-base font-display font-bold text-cyan-600">{car.downforceAt250KmhKgf} <span className="text-[10px] font-normal font-mono text-studio-600">kgf</span></span>
                </div>
              </div>

              <div className="py-2 border-t border-b border-studio-100 flex items-center justify-between text-xs">
                <span className="font-body text-studio-500 text-[10px] uppercase">Động cơ:</span>
                <span className="font-mono text-[11px] font-semibold text-studio-900 truncate max-w-[170px]">{car.engine}</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-studio-100">
              <span className="text-[9.5px] font-body uppercase tracking-wider text-studio-400 font-semibold block mb-1">
                Tay đua chính:
              </span>
              <p className="text-xs font-mono font-semibold text-studio-950">
                {car.drivers.join(' · ')}
              </p>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════
            4. BỘ SƯU TẬP ẢNH F1 (17 HIGH-RES PHOTOS & 3D TILT CARDS)
            ══════════════════════════════════════════════════════ */}
        <section id="gallery-section" className="mb-20 pt-8 border-t border-studio-300">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Camera className="w-4 h-4 text-f1red" />
                <span className="text-[11px] font-mono uppercase tracking-widest text-f1red font-bold">
                  Bộ Sưu Tập Ảnh Độ Phân Giải Cao
                </span>
              </div>
              <h2 className="heading-display text-2xl sm:text-4xl font-bold text-studio-950">
                Bộ Sưu Tập Ảnh 11 Xe Đua & Khoảnh Khắc Đỉnh Cao
              </h2>
              <p className="text-xs font-body text-studio-600 mt-1 max-w-xl">
                Khám phá trọn vẹn 11 cỗ máy F1 studio chuyên nghiệp và các khoảnh khắc đua nghẹt thở trên đường đua.
              </p>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-2 bg-white p-1 rounded-sm border border-studio-200 shadow-xs shrink-0">
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

        {/* ══════════════════════════════════════════════════════
            5. LƯỚI XUẤT PHÁT 11 ĐỘI ĐUA & TAY ĐUA CHÍNH THỨC
            ══════════════════════════════════════════════════════ */}
        <section id="teams-section" className="pt-8 border-t border-studio-300">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-f1red" />
                <span className="text-[11px] font-mono uppercase tracking-widest text-f1red font-bold">
                  Lưới Xuất Phát FIA Formula 1
                </span>
              </div>
              <h2 className="heading-display text-2xl sm:text-4xl font-bold text-studio-950">
                11 Đội Đua & Danh Sách Tay Đua Chính Thức 2025
              </h2>
              <p className="text-xs font-body text-studio-600 mt-1 max-w-xl">
                Bấm vào bất kỳ đội đua nào để đưa chiếc xe của họ lên sân khấu trình diễn tương tác phía trên.
              </p>
            </div>

            <span className="text-[11px] font-mono text-studio-500 font-semibold shrink-0">
              Tổng cộng: 11 Đội · 22 Tay Đua
            </span>
          </div>

          {/* Teams Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {ALL_TEAMS_ORDER.map((carId) => {
              const teamCar = CARS_DATA[carId];
              if (!teamCar) return null;
              const isCurrentSelected = selectedCarId === carId;

              return (
                <div
                  key={teamCar.id}
                  className={`group bg-white border rounded-sm shadow-subtle hover:shadow-luxury transition-all duration-300 overflow-hidden flex flex-col justify-between ${
                    isCurrentSelected
                      ? 'border-f1red ring-1 ring-f1red'
                      : 'border-studio-200 hover:border-studio-400'
                  }`}
                >
                  {/* Livery top strip */}
                  <div
                    className="w-full h-1.5"
                    style={{ background: `linear-gradient(90deg, ${teamCar.primaryColor}, ${teamCar.accentColor})` }}
                  />

                  {/* Car photo preview */}
                  <div className="relative w-full aspect-video overflow-hidden bg-studio-950">
                    <img
                      src={teamCar.image}
                      alt={teamCar.name}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />

                    <div className="absolute bottom-2.5 left-3 right-3 flex items-end justify-between">
                      <div>
                        <span
                          className="text-[9px] font-mono uppercase tracking-widest font-bold block mb-0.5"
                          style={{ color: teamCar.primaryColor }}
                        >
                          {teamCar.team}
                        </span>
                        <span className="text-white font-display text-sm font-bold leading-tight block">
                          {teamCar.shortName} · {teamCar.name}
                        </span>
                      </div>
                      {isCurrentSelected && (
                        <span className="px-1.5 py-0.5 rounded-xs bg-f1red text-white text-[8px] font-mono uppercase tracking-wider font-bold">
                          Đang chọn
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Drivers & Specs */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Drivers */}
                      <div className="mb-3">
                        <span className="text-[9px] font-mono uppercase tracking-widest text-studio-400 font-semibold block mb-1.5">
                          Bộ Đôi Tay Đua
                        </span>
                        <div className="space-y-1">
                          {teamCar.drivers.map((driver) => (
                            <div key={driver} className="flex items-center gap-2">
                              <span
                                className="w-1.5 h-1.5 rounded-full shrink-0"
                                style={{ background: teamCar.primaryColor }}
                              />
                              <span className="text-xs font-body font-semibold text-studio-800">{driver}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Engine & HP */}
                      <div className="pt-2 border-t border-studio-100 flex items-center justify-between text-[11px] font-mono mb-4">
                        <span className="text-studio-500 truncate max-w-[140px]">{teamCar.engine}</span>
                        <span className="font-bold text-studio-900">{teamCar.horsepower} BHP</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => handleSelectCarAndScroll(carId)}
                      className={`w-full py-2 px-3 rounded-xs text-[11px] font-body uppercase tracking-wider font-semibold transition-all flex items-center justify-center gap-1.5 ${
                        isCurrentSelected
                          ? 'bg-f1red text-white shadow-xs'
                          : 'bg-studio-100 hover:bg-studio-950 text-studio-800 hover:text-white'
                      }`}
                    >
                      <span>{isCurrentSelected ? 'Xem Lại Trên Sân Khấu' : 'Khám Phá Xe Này'}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

      </div>

      {/* ══════════════════════════════════════════════════════
          6. LIGHTBOX MODAL CHO BỘ SƯU TẬP ẢNH
          ══════════════════════════════════════════════════════ */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-fade-in"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="relative max-w-5xl w-full bg-studio-950 border border-white/20 rounded-sm overflow-hidden shadow-2xl flex flex-col max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 bg-black/60">
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
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
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
                    handleSelectCarAndScroll(cId);
                  }}
                  className="px-4 py-2 bg-f1red hover:bg-red-700 text-white rounded-xs text-xs font-body uppercase tracking-wider font-bold transition-all shadow-subtle flex items-center gap-2 self-start sm:self-auto"
                >
                  <span>Xem Chi Tiết Trên Sân Khấu</span>
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
