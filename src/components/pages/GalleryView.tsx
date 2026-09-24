import React, { useState, useEffect, useRef } from 'react';
import { useCarStore } from '../../store/useCarStore';
import { t } from '../../i18n/translations';
import {
  Zap,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  Gauge,
  Activity,
  Layers,
  Sparkles,
  Flame,
  Wind
} from 'lucide-react';

interface GalleryItem {
  id: string;
  title: string;
  titleEn?: string;
  subtitle: string;
  subtitleEn?: string;
  team: string;
  carId: string;
  driver: string;
  track: string;
  speedKmh: number;
  gear: number;
  rpm: number;
  gForce: number;
  drsActive: boolean;
  category: 'redbull' | 'ferrari' | 'mclaren' | 'mercedes' | 'action';
  imageUrl: string;
  descriptionVi: string;
  descriptionEn: string;
  techNoteVi: string;
  techNoteEn: string;
  accentColor: string;
}

const GALLERY_DATA: GalleryItem[] = [
  {
    id: 'rb20_sparks',
    title: 'Red Bull RB20 · Cơn Mưa Tia Lửa Sàn Xe',
    titleEn: 'Red Bull RB20 · Titanium Spark Shower',
    subtitle: 'Chạy đè áp suất gầm đỉnh cao tại khúc cua vận tốc lớn',
    subtitleEn: 'Peak underfloor aerodynamic compression through high-speed apex',
    team: 'Oracle Red Bull Racing',
    carId: 'rb20',
    driver: 'Max Verstappen #1',
    track: 'Red Bull Ring — Turn 1 Apex',
    speedKmh: 314,
    gear: 7,
    rpm: 11450,
    gForce: 4.9,
    drsActive: false,
    category: 'redbull',
    imageUrl: '/images/gallery/rb20_action.jpg',
    descriptionVi: 'Chiếc RB20 nén chặt xuống mặt đường nhờ hơn 2.400 kgf lực nén khí động học. Tấm giáp titan (skid block) dưới sàn cọ sát với mặt nhựa đường ở khoảng sáng gầm chỉ 12mm, bắn ra những chùm tia lửa rực rỡ.',
    descriptionEn: 'The RB20 sucked to the asphalt under 2,400+ kgf of ground effect downforce. Titanium skid blocks scrape the tarmac at a microscopic 12mm ride height, sending showers of golden sparks.',
    techNoteVi: 'Ống hầm Venturi dưới sàn xe Red Bull đạt tốc độ dòng khí Mach 0.35, tạo áp suất âm hút chặt thân xe qua góc cua.',
    techNoteEn: 'Underfloor Venturi tunnels accelerate air to Mach 0.35, creating immense suction that locks the car to the apex.',
    accentColor: '#cc1e4a',
  },
  {
    id: 'sf24_monza',
    title: 'Ferrari SF-24 · Khúc Cua Vàng Monza',
    titleEn: 'Ferrari SF-24 · Curva Grande at Monza',
    subtitle: 'Rosso Corsa rực cháy trong ánh hoàng hôn Curva Grande',
    subtitleEn: 'Rosso Corsa in golden hour light through Curva Grande',
    team: 'Scuderia Ferrari',
    carId: 'sf24',
    driver: 'Charles Leclerc #16',
    track: 'Autodromo Nazionale Monza — Curva Grande',
    speedKmh: 336,
    gear: 8,
    rpm: 11820,
    gForce: 4.4,
    drsActive: true,
    category: 'ferrari',
    imageUrl: '/images/gallery/sf24_action.jpg',
    descriptionVi: 'Chiếc SF-24 với thiết kế lòng máng sidepod Bathtub đặc trưng đang duy trì vận tốc kinh hoàng trên 335 km/h. Luồng khí nóng từ bộ tản nhiệt động cơ V6 Turbo hybrid cuộn trào qua đuôi xe.',
    descriptionEn: 'The SF-24 flaunting its iconic scalloped bathtub sidepods screaming past 335 km/h. Thermal heat distortion ripples from the Ferrari 066/12 hybrid power unit over the rear wing.',
    techNoteVi: 'Rãnh lòng máng sidepod dẫn luồng khí sạch trực tiếp vào khe gió giữa dầm cánh sau beam wing và bộ khuếch tán diffuser.',
    techNoteEn: 'Scalloped sidepod troughs channel clean high-energy airflow directly onto the beam wing and diffuser exit.',
    accentColor: '#e80020',
  },
  {
    id: 'mcl38_singapore',
    title: 'McLaren MCL38 · Vũ Điệu Đêm Marina Bay',
    titleEn: 'McLaren MCL38 · Marina Bay Night Dance',
    subtitle: 'Phanh đĩa carbon rực lửa dưới ánh đèn rực rỡ Singapore',
    subtitleEn: 'Glowing carbon brake discs beneath Singapore floodlights',
    team: 'McLaren F1 Team',
    carId: 'mcl38',
    driver: 'Lando Norris #4',
    track: 'Marina Bay Street Circuit — Singapore GP',
    speedKmh: 285,
    gear: 6,
    rpm: 11100,
    gForce: 5.1,
    drsActive: false,
    category: 'mclaren',
    imageUrl: '/images/gallery/mcl38_action.jpg',
    descriptionVi: 'Dưới ánh đèn pha đêm Singapore, đĩa phanh sợi carbon của chiếc MCL38 nóng đỏ hơn 1.050°C khi tay đua đạp phanh đột ngột. Màu cam Papaya tương phản nổi bật cùng vệt sáng neon barrier.',
    descriptionEn: 'Under Singapore night race floodlights, carbon-ceramic brake rotors glow incandescent cherry-red at over 1,050°C. Vibrant Papaya orange carves through motion-blurred street circuit barriers.',
    techNoteVi: 'Hệ thống dẫn khí làm mát phanh carbon với van thông gió đa tầng ngăn ngừa quá nhiệt dầu phanh trong điều kiện nhiệt đới.',
    techNoteEn: 'Bespoke brake duct cooling vanes channel turbulent air outward while keeping hydraulic fluid below boiling threshold.',
    accentColor: '#ff8000',
  },
  {
    id: 'w15_vortex',
    title: 'Mercedes-AMG W15 · Xoáy Khí Áp Suất Silverstone',
    titleEn: 'Mercedes-AMG W15 · Silverstone Pressure Vortices',
    subtitle: 'Vệt hơi nước ngưng tụ ngoạn mục qua khúc cua Maggotts',
    subtitleEn: 'Spectacular moisture vapor trails through Maggotts & Becketts',
    team: 'Mercedes-AMG Petronas F1 Team',
    carId: 'w15',
    driver: 'Lewis Hamilton #44',
    track: 'Silverstone Circuit — Maggotts & Becketts',
    speedKmh: 298,
    gear: 7,
    rpm: 11600,
    gForce: 5.3,
    drsActive: false,
    category: 'mercedes',
    imageUrl: '/images/gallery/w15_action.jpg',
    descriptionVi: 'Áp suất thấp cực hạn tại mép cánh sau tạo nên những cuộn xoáy ngưng tụ hơi nước (wingtip condensation vortices) hữu hình giữa không trung, chứng minh sức mạnh khí động học của Mũi Tên Bạc.',
    descriptionEn: 'Extreme low pressure at the rear wing endplates causes atmospheric moisture to instantly condense into spiraling vapor trails, visually manifesting the aerodynamic forces at play.',
    techNoteVi: 'Thiết kế cánh sau W15 với gờ gurney flap tối ưu hóa tỷ lệ Lực nén / Lực cản (L/D) cho phép xe ôm cua gắt ở tốc độ gần 300 km/h.',
    techNoteEn: 'Optimized wing profiles yield an extraordinary lift-to-drag ratio, sustaining 5.3G lateral loading through the British esses.',
    accentColor: '#27f4d2',
  },
  {
    id: 'cockpit_pov',
    title: 'Góc Nhìn Buồng Lái F1 · 338 km/h Trên Đại Lộ Baku',
    titleEn: 'F1 Cockpit POV · 338 km/h on Baku Boulevard',
    subtitle: 'Trải nghiệm trực quan góc nhìn của tay đua đằng sau vô lăng',
    subtitleEn: 'First-person driver perspective behind the steering wheel',
    team: 'Oracle Red Bull Racing / F1 Cockpit',
    carId: 'rb20',
    driver: 'First-Person POV Driver',
    track: 'Baku City Circuit — Main Straight',
    speedKmh: 338,
    gear: 8,
    rpm: 11800,
    gForce: 1.2,
    drsActive: true,
    category: 'action',
    imageUrl: '/images/gallery/cockpit_action.jpg',
    descriptionVi: 'Góc nhìn buồng lái từ mắt tay đua lướt đi với vận tốc 338 km/h. Toàn bộ đèn LED chuyển số trên vô lăng sợi carbon sáng rực, thanh an toàn Halo bằng titan bảo vệ đầu tay đua khỏi mọi va chạm.',
    descriptionEn: 'First-person cockpit perspective roaring down the straight at 338 km/h. Shift indicator LEDs illuminate across the carbon steering wheel as the world blurs past under the titanium Halo.',
    techNoteVi: 'Vô lăng F1 tích hợp màn hình OLED hiển thị hơn 30 thông số vi sai, bản đồ động cơ ERS, cân bằng phanh và nhiệt độ lốp.',
    techNoteEn: 'The F1 steering wheel houses a custom digital display controlling brake bias, differential settings, and hybrid energy deployment.',
    accentColor: '#38bdf8',
  },
  {
    id: 'pitstop_record',
    title: 'Pit Stop Kỷ Lục · 1.9 Giây Thay Cả 4 Bánh',
    titleEn: 'Record Pit Stop · 1.9-Second Four-Wheel Swap',
    subtitle: 'Đỉnh cao của sự phối hợp và cơ khí chính xác tuyệt đối',
    subtitleEn: 'The pinnacle of human coordination and mechanical precision',
    team: 'Red Bull Racing Pit Crew',
    carId: 'rb20',
    driver: 'Pit Crew Squad',
    track: 'Belgian GP — Spa-Francorchamps Pitlane',
    speedKmh: 0,
    gear: 1,
    rpm: 4200,
    gForce: 0,
    drsActive: false,
    category: 'action',
    imageUrl: '/images/gallery/pitstop_action.jpg',
    descriptionVi: 'Hơn 20 thợ máy tinh nhuệ thay trọn vẹn 4 bánh xe lốp Pirelli trong thời gian chớp nhoáng dưới 2 giây. Súng siết ốc khí nén quay với vận tốc 10.000 vòng/phút trong làn khói phanh bốc lên nghi ngút.',
    descriptionEn: 'Over 20 synchronized crew members swap four Pirelli tyres in an eye-blink 1.9 seconds. High-torque pneumatic wheel guns spin at 10,000 RPM amid brake smoke and adrenaline.',
    techNoteVi: 'Ốc bánh xe F1 sử dụng ren ngược tự khóa bằng hợp kim nhôm-titan siêu nhẹ, chỉ cần 1 phát siết nửa giây để khóa chặt ở mô-men 650 Nm.',
    techNoteEn: 'Single center-lock titanium-alloy wheel nuts feature captive retaining pins torqued to 650 Nm in a fraction of a second.',
    accentColor: '#eab308',
  },
];

// Interactive 3D Tilt Card with Cursor Glare Spotlight
interface TiltCardProps {
  item: GalleryItem;
  velocityMode: boolean;
  onSelect: (item: GalleryItem) => void;
  lang: 'vi' | 'en';
}

const TiltCard: React.FC<TiltCardProps> = ({ item, velocityMode, onSelect, lang }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transformStyle, setTransformStyle] = useState<string>('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
  const [glarePos, setGlarePos] = useState<{ x: number; y: number; opacity: number }>({ x: 50, y: 50, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -9; // Tilt vertical
    const rotateY = ((x - centerX) / centerX) * 9;  // Tilt horizontal

    setTransformStyle(`perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.025, 1.025, 1.025)`);
    setGlarePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.35,
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTransformStyle('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
    setGlarePos((prev) => ({ ...prev, opacity: 0 }));
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const desc = lang === 'vi' ? item.descriptionVi : item.descriptionEn;

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => onSelect(item)}
      className="group relative cursor-pointer rounded-sm overflow-hidden bg-white border border-studio-200 shadow-subtle hover:shadow-luxury transition-all duration-300 flex flex-col"
      style={{
        transform: transformStyle,
        transformStyle: 'preserve-3d',
        transition: isHovered ? 'transform 0.08s ease-out' : 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.3s ease',
      }}
    >
      {/* ── Visual Media Container ── */}
      <div className="relative aspect-video w-full overflow-hidden bg-studio-950">
        <img
          src={item.imageUrl}
          alt={item.title}
          loading="lazy"
          className={`w-full h-full object-cover transition-transform duration-700 ease-out ${
            isHovered ? 'scale-108' : 'scale-100'
          }`}
        />

        {/* Dynamic Specular Glare Overlay on cursor movement */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            opacity: glarePos.opacity,
            background: `radial-gradient(circle 280px at ${glarePos.x}% ${glarePos.y}%, rgba(255, 255, 255, 0.45) 0%, transparent 80%)`,
            mixBlendMode: 'overlay',
          }}
        />

        {/* Velocity Mode Streak Overlay */}

        {/* Top Driver Badge */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
          <span
            className="px-2.5 py-1 text-[9px] font-body uppercase tracking-wider font-bold rounded-full shadow-subtle backdrop-blur-md text-white flex items-center gap-1.5"
            style={{ background: 'rgba(9, 9, 11, 0.75)' }}
          >
            <span className="w-2 h-2 rounded-full" style={{ background: item.accentColor }} />
            {item.driver}
          </span>

          <span className="p-1.5 rounded-full bg-black/60 backdrop-blur-md text-white/80 group-hover:text-white group-hover:scale-110 transition-all shadow-subtle">
            <Maximize2 className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>

      {/* ── Content Card ── */}
      <div className="p-5 flex-1 flex flex-col justify-between bg-white">
        <div>
          <div className="flex items-center justify-between text-[10px] font-body uppercase tracking-wider text-studio-500 mb-1">
            <span>{item.team}</span>
            <span className="text-studio-400 font-medium">{item.track}</span>
          </div>

          <h3 className="font-display text-base font-bold text-studio-950 group-hover:text-f1red transition-colors line-clamp-1">
            {lang === 'en' && item.titleEn ? item.titleEn : item.title}
          </h3>

          <p className="text-[11px] font-body text-studio-600 mt-2 line-clamp-2 leading-relaxed">
            {desc}
          </p>
        </div>

        {/* Card footer CTA */}
        <div className="mt-4 pt-3 border-t border-studio-100 flex items-center justify-between text-[10px] font-body uppercase tracking-wider font-semibold text-studio-500 group-hover:text-studio-950 transition-colors">
          <span>{lang === 'vi' ? 'Xem ảnh toàn màn hình' : 'View fullscreen'}</span>
          <span className="text-f1red group-hover:translate-x-1 transition-transform">→</span>
        </div>
      </div>
    </div>
  );
};

export const GalleryView: React.FC = () => {
  const { lang } = useCarStore();
  const strings = t[lang].gallery;

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [velocityMode, setVelocityMode] = useState<boolean>(true);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [heroIndex, setHeroIndex] = useState<number>(0);

  const filteredItems = GALLERY_DATA.filter((item) => {
    if (activeCategory === 'all') return true;
    return item.category === activeCategory;
  });

  const heroItem = GALLERY_DATA[heroIndex];

  // Keyboard navigation in theater lightbox
  useEffect(() => {
    if (!selectedItem) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedItem(null);
      if (e.key === 'ArrowRight') {
        const curr = GALLERY_DATA.findIndex((i) => i.id === selectedItem.id);
        const next = (curr + 1) % GALLERY_DATA.length;
        setSelectedItem(GALLERY_DATA[next]);
      }
      if (e.key === 'ArrowLeft') {
        const curr = GALLERY_DATA.findIndex((i) => i.id === selectedItem.id);
        const prev = (curr - 1 + GALLERY_DATA.length) % GALLERY_DATA.length;
        setSelectedItem(GALLERY_DATA[prev]);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedItem]);

  const CATEGORIES = [
    { id: 'all',      label: strings.filterAll      },
    { id: 'redbull',  label: strings.filterRedBull  },
    { id: 'ferrari',  label: strings.filterFerrari  },
    { id: 'mclaren',  label: strings.filterMcLaren  },
    { id: 'mercedes', label: strings.filterMercedes },
    { id: 'action',   label: strings.filterAction   },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fb] pt-20 pb-28">
      {/* ── Page Header ── */}
      <section className="page-container mb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-studio-200 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-f1red/10 border border-f1red/20 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-f1red animate-pulse" />
              <span className="text-[10px] font-body uppercase tracking-wider font-bold text-f1red">
                {strings.badge}
              </span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-studio-950 tracking-tight">
              {strings.title} <span className="text-f1red">{strings.highlight}</span>
            </h1>
            <p className="text-sm font-body text-studio-600 max-w-2xl mt-3 leading-relaxed">
              {strings.desc}
            </p>
          </div>

          {/* Interactive Velocity Mode Switcher */}
          <div className="flex items-center gap-2 bg-white border border-studio-300 rounded-full p-1 shadow-subtle">
            <button
              onClick={() => setVelocityMode(true)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[10px] font-body uppercase tracking-wider font-bold transition-all ${
                velocityMode
                  ? 'bg-f1red text-white shadow-subtle'
                  : 'text-studio-600 hover:text-studio-950'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>{strings.modeSpeed}</span>
            </button>
            <button
              onClick={() => setVelocityMode(false)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[10px] font-body uppercase tracking-wider font-bold transition-all ${
                !velocityMode
                  ? 'bg-studio-900 text-white shadow-subtle'
                  : 'text-studio-600 hover:text-studio-950'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{strings.modeDetail}</span>
            </button>
          </div>
        </div>
      </section>

      {/* ── Cinematic Hero Motion Stage ── */}
      <section className="page-container mb-14">
        <div className="relative rounded-sm overflow-hidden bg-studio-950 border border-studio-300 shadow-luxury group">
          {/* Main Hero Visual with Ken Burns slow zoom animation */}
          <div className="relative aspect-[21/9] min-h-[360px] sm:min-h-[440px] w-full overflow-hidden">
            <img
              src={heroItem.imageUrl}
              alt={heroItem.title}
              key={heroItem.id}
              className={`w-full h-full object-cover transition-all duration-1000 ease-out ${
                velocityMode ? 'scale-105 filter brightness-105' : 'scale-100'
              }`}
            />

            {/* Gradient overlays for readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/40" />

            {/* Velocity animated streamlines when mode is active */}
            {velocityMode && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-cyan-500/5 to-transparent animate-pulse" />
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-cyan-500/10 to-transparent" />
              </div>
            )}

            {/* Hero info overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 z-10 flex flex-col justify-end">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-[10px] font-body uppercase tracking-wider font-bold border border-white/20 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ background: heroItem.accentColor }} />
                  {heroItem.team}
                </span>
                <span className="text-white/80 text-[11px] font-mono">{heroItem.track}</span>
              </div>

              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-black text-white max-w-3xl leading-tight">
                {lang === 'en' && heroItem.titleEn ? heroItem.titleEn : heroItem.title}
              </h2>
              <p className="text-white/80 text-xs sm:text-sm font-body max-w-2xl mt-2 line-clamp-2 leading-relaxed">
                {lang === 'vi' ? heroItem.descriptionVi : heroItem.descriptionEn}
              </p>

              <div className="mt-5 pt-4 border-t border-white/20 flex items-center justify-between gap-4">
                <button
                  onClick={() => setSelectedItem(heroItem)}
                  className="px-5 py-2.5 bg-f1red hover:bg-f1red-dark text-white rounded-sm text-[11px] font-body uppercase tracking-wider font-bold shadow-luxury transition-all flex items-center gap-2"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>{strings.clickToExpand}</span>
                </button>
              </div>
            </div>

            {/* Previous / Next Slide Controls */}
            <div className="absolute top-1/2 -translate-y-1/2 left-4 right-4 flex justify-between pointer-events-none z-20">
              <button
                onClick={() => setHeroIndex((prev) => (prev - 1 + GALLERY_DATA.length) % GALLERY_DATA.length)}
                className="pointer-events-auto w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 backdrop-blur-md text-white flex items-center justify-center border border-white/20 transition-all shadow-subtle hover:scale-105"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setHeroIndex((prev) => (prev + 1) % GALLERY_DATA.length)}
                className="pointer-events-auto w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 backdrop-blur-md text-white flex items-center justify-center border border-white/20 transition-all shadow-subtle hover:scale-105"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Bottom Thumbnails Scrubbing Bar */}
          <div className="bg-black/90 border-t border-white/10 px-4 py-3 flex items-center gap-3 overflow-x-auto no-scrollbar">
            {GALLERY_DATA.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => setHeroIndex(idx)}
                className={`relative shrink-0 h-14 w-24 rounded-xs overflow-hidden border-2 transition-all duration-200 ${
                  heroIndex === idx ? 'border-f1red scale-105 shadow-luxury' : 'border-white/20 opacity-60 hover:opacity-100'
                }`}
              >
                <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                <span className="absolute bottom-0 inset-x-0 bg-black/80 text-[8px] text-white font-mono text-center truncate px-1">
                  {item.driver.split(' ')[0]}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Category Filters & Grid ── */}
      <section className="page-container">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar border-b border-studio-200">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`shrink-0 px-4 py-2 rounded-full text-xs font-body uppercase tracking-wider font-semibold transition-all ${
                activeCategory === cat.id
                  ? 'bg-studio-950 text-white shadow-subtle'
                  : 'bg-white text-studio-600 border border-studio-200 hover:border-studio-400 hover:text-studio-950'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* 3D Tilt Cards Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <TiltCard
              key={item.id}
              item={item}
              velocityMode={velocityMode}
              onSelect={(it) => setSelectedItem(it)}
              lang={lang}
            />
          ))}
        </div>
      </section>

      {/* ── Fullscreen Lightbox ── */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-8 animate-fade-in"
          onClick={() => setSelectedItem(null)}
        >
          {/* Top close bar */}
          <div
            className="flex items-center justify-between pb-4 border-b border-white/10 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full" style={{ background: selectedItem.accentColor }} />
              <div>
                <h3 className="font-display text-lg font-bold text-white leading-tight">
                  {lang === 'en' && selectedItem.titleEn ? selectedItem.titleEn : selectedItem.title}
                </h3>
                <span className="text-[11px] font-body text-white/60">{selectedItem.team} · {selectedItem.track}</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedItem(null)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label={strings.closeLightbox}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Central Image */}
          <div
            className="relative flex-1 flex items-center justify-center my-4 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="absolute w-[600px] h-[350px] rounded-full blur-[120px] opacity-25 pointer-events-none"
              style={{ background: selectedItem.accentColor }}
            />
            <img
              src={selectedItem.imageUrl}
              alt={selectedItem.title}
              className="max-h-[70vh] max-w-[92vw] object-contain rounded-xs shadow-2xl z-10 border border-white/10"
            />
          </div>

          {/* Bottom Description */}
          <div
            className="bg-studio-950/80 border border-white/15 backdrop-blur-md rounded-sm p-4 sm:p-5 z-10 max-w-3xl mx-auto w-full text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <h4 className="font-display font-bold text-sm text-white mb-2">
              {lang === 'en' && selectedItem.subtitleEn ? selectedItem.subtitleEn : selectedItem.subtitle}
            </h4>
            <p className="text-xs font-body text-white/80 leading-relaxed">
              {lang === 'vi' ? selectedItem.descriptionVi : selectedItem.descriptionEn}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
