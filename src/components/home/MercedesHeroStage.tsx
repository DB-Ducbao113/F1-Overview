import React, { useState, useRef, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Grid } from '@react-three/drei';
import { CarModelAssembly } from '../canvas/CarModelAssembly';
import { useCarStore } from '../../store/useCarStore';
import { t } from '../../i18n/translations';
import {
  Wind,
  Maximize2,
  Zap,
  RotateCw,
  Sparkles,
  X,
  Gauge,
  Layers,
  ArrowRight,
  Compass,
  Play,
  Pause,
  Box
} from 'lucide-react';

export const MercedesHeroStage: React.FC = () => {
  const { openCarIn3D, setActiveTab, lang } = useCarStore();
  const strings = t[lang].home.mercedesStage;

  const containerRef = useRef<HTMLDivElement>(null);
  const [stageMode, setStageMode] = useState<'3d' | 'cinema'>('3d');
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [aeroFlowActive, setAeroFlowActive] = useState(true);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);

  // 360-degree rotation angle state (0 to 360)
  const [rotationAngle, setRotationAngle] = useState(45);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartXRef = useRef(0);
  const dragStartAngleRef = useRef(0);

  // 3D Parallax Tilt state for Cinema Mode
  const [tilt, setTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [glare, setGlare] = useState<{ x: number; y: number; opacity: number }>({ x: 50, y: 50, opacity: 0 });

  // Auto-rotation loop for Cinema mode
  useEffect(() => {
    if (!isAutoRotating || stageMode !== 'cinema' || isDragging) return;
    const interval = setInterval(() => {
      setRotationAngle((prev) => (prev + 0.6) % 360);
    }, 30);
    return () => clearInterval(interval);
  }, [isAutoRotating, stageMode, isDragging]);

  // Drag interaction for 360 rotation in Cinema mode
  const handleMouseDown = (e: React.MouseEvent) => {
    if (stageMode !== 'cinema') return;
    setIsDragging(true);
    dragStartXRef.current = e.clientX;
    dragStartAngleRef.current = rotationAngle;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    if (isDragging && stageMode === 'cinema') {
      const deltaX = e.clientX - dragStartXRef.current;
      const sensitivity = 0.5; // degrees per pixel
      let newAngle = (dragStartAngleRef.current + deltaX * sensitivity) % 360;
      if (newAngle < 0) newAngle += 360;
      setRotationAngle(newAngle);
    }

    // Dynamic tilt & glare
    const rotX = ((y - centerY) / centerY) * -6;
    const rotY = ((x - centerX) / centerX) * 8;
    setTilt({ x: rotX, y: rotY });
    setGlare({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.35,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const setAnglePreset = (angle: number) => {
    setRotationAngle(angle);
    setIsAutoRotating(false);
  };

  const HOTSPOTS = [
    {
      id: 'frontWing',
      x: '24%',
      y: '68%',
      title: strings.hotspots.frontWing.title,
      desc: strings.hotspots.frontWing.desc,
      tag: 'OUTWASH AERO',
    },
    {
      id: 'halo',
      x: '52%',
      y: '34%',
      title: strings.hotspots.halo.title,
      desc: strings.hotspots.halo.desc,
      tag: 'SAFETY 12-TONNE',
    },
    {
      id: 'engine',
      x: '64%',
      y: '38%',
      title: strings.hotspots.engine.title,
      desc: strings.hotspots.engine.desc,
      tag: '1,050+ BHP V6',
    },
    {
      id: 'rearWing',
      x: '82%',
      y: '33%',
      title: strings.hotspots.rearWing.title,
      desc: strings.hotspots.rearWing.desc,
      tag: 'DRS ACTUATION',
    },
  ];

  return (
    <div className="relative w-full max-w-6xl mx-auto my-12 px-4 select-none">
      {/* ── Section Badge & Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-2.5">
            <span className="w-2 h-2 rounded-full bg-[#00a19c] animate-ping" />
            <span className="text-[10px] font-body uppercase tracking-wider font-bold text-emerald-800">
              {strings.badge}
            </span>
          </div>

          <h2 className="font-display text-2xl sm:text-4xl font-bold text-studio-950 tracking-tight flex items-center gap-3">
            {strings.title}
            <span className="text-xs font-mono px-2.5 py-1 bg-studio-200 text-studio-700 rounded-sm font-normal uppercase">
              W15 · 360° Studio
            </span>
          </h2>
          <p className="text-xs sm:text-sm font-body text-studio-600 mt-1 max-w-xl">
            {strings.subtitle}
          </p>
        </div>

        {/* ── Mode & 360° Rotation Controls Bar ── */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          {/* Stage Mode Switcher (Real 3D vs Cinema Image) */}
          <div className="flex items-center bg-white border border-studio-300 rounded-full p-0.5 shadow-xs">
            <button
              onClick={() => setStageMode('3d')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-body uppercase tracking-wider font-bold transition-all ${
                stageMode === '3d'
                  ? 'bg-studio-950 text-white shadow-xs'
                  : 'text-studio-600 hover:text-studio-950'
              }`}
            >
              <Box className="w-3 h-3 text-[#27f4d2]" />
              <span>3D Orbit 360°</span>
            </button>
            <button
              onClick={() => setStageMode('cinema')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-body uppercase tracking-wider font-bold transition-all ${
                stageMode === 'cinema'
                  ? 'bg-studio-950 text-white shadow-xs'
                  : 'text-studio-600 hover:text-studio-950'
              }`}
            >
              <Layers className="w-3 h-3 text-yellow-400" />
              <span>Studio 8K</span>
            </button>
          </div>

          {/* Auto-Rotation Toggle */}
          <button
            onClick={() => setIsAutoRotating(!isAutoRotating)}
            className={`px-3.5 py-1.5 rounded-full text-[10px] font-body uppercase tracking-wider font-bold transition-all flex items-center gap-1.5 border shadow-xs ${
              isAutoRotating
                ? 'bg-f1red text-white border-f1red shadow-f1red/20'
                : 'bg-white text-studio-700 border-studio-300 hover:border-studio-900'
            }`}
            title="Bật/Tắt tự động xoay 360 độ liên tục"
          >
            {isAutoRotating ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            <span>{isAutoRotating ? 'Dừng Xoay' : 'Tự Động 360°'}</span>
          </button>

          {/* Aerodynamic Flow Toggle */}
          <button
            onClick={() => setAeroFlowActive(!aeroFlowActive)}
            className={`px-3 py-1.5 rounded-full text-[10px] font-body uppercase tracking-wider font-bold transition-all flex items-center gap-1.5 border shadow-xs ${
              aeroFlowActive
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-white text-studio-600 border-studio-300 hover:border-studio-900'
            }`}
            title="Bật/Tắt mô phỏng luồng khí động học Petronas Cyan"
          >
            <Wind className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{strings.aeroFlowBtn}</span>
          </button>
        </div>
      </div>

      {/* ── Main 3D / 360° Showcase Viewport ── */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="relative aspect-[16/9] w-full rounded-sm overflow-hidden bg-gradient-to-br from-studio-950 via-[#0d1419] to-studio-950 border border-studio-300 shadow-luxury cursor-grab active:cursor-grabbing group"
        style={{
          perspective: 1400,
        }}
      >
        {/* Subtle Ambient Light Reflections */}
        <div
          className="absolute -top-20 -left-20 w-96 h-96 rounded-full pointer-events-none blur-[120px] opacity-35 animate-pulse-cyan"
          style={{ background: '#00a19c' }}
        />
        <div
          className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full pointer-events-none blur-[100px] opacity-20"
          style={{ background: '#eb142b' }}
        />

        {/* ══════════════════════════════════════════════════════
            MODE 1: REAL 3D THREE.JS CANVAS ORBIT 360°
            ══════════════════════════════════════════════════════ */}
        {stageMode === '3d' && (
          <div className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing">
            <Canvas
              shadows
              camera={{ position: [3.8, 1.8, 4.0], fov: 40 }}
              gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
            >
              <color attach="background" args={['#090d10']} />
              <fog attach="fog" args={['#090d10', 10, 22]} />

              <ambientLight intensity={0.8} />
              <directionalLight
                position={[6, 10, 6]}
                intensity={1.8}
                castShadow
                shadow-mapSize={[1024, 1024]}
              />
              <directionalLight position={[-6, 4, -4]} intensity={1.2} color="#00f0ff" />
              <directionalLight position={[4, 2, -6]} intensity={0.8} color="#eb142b" />

              <Suspense fallback={null}>
                {/* Mercedes W15 assembly */}
                <CarModelAssembly carIdOverride="w15" />

                {/* Soft ground contact shadow */}
                <ContactShadows
                  position={[0, 0.01, 0]}
                  opacity={0.7}
                  scale={12}
                  blur={1.6}
                  far={4}
                  color="#00a19c"
                />

                {/* Perspective studio floor grid */}
                <Grid
                  position={[0, 0, 0]}
                  args={[20, 20]}
                  cellSize={0.5}
                  cellThickness={0.5}
                  cellColor="#12252a"
                  sectionSize={2}
                  sectionThickness={1.0}
                  sectionColor="#00a19c"
                  fadeDistance={14}
                  fadeStrength={1.6}
                />

                {/* Real-time 360° OrbitControls */}
                <OrbitControls
                  enableZoom={false}
                  enablePan={false}
                  autoRotate={isAutoRotating}
                  autoRotateSpeed={2.2}
                  maxPolarAngle={Math.PI / 2 - 0.04}
                  minPolarAngle={Math.PI / 6}
                />
              </Suspense>
            </Canvas>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════
            MODE 2: 8K CINEMATIC STUDIO IMAGE WITH 360° PERSPECTIVE SPIN
            ══════════════════════════════════════════════════════ */}
        {stageMode === 'cinema' && (
          <div
            className="w-full h-full relative transition-transform select-none"
            style={{
              transform: `perspective(1400px) rotateX(${tilt.x}deg) rotateY(${((rotationAngle - 45) * 0.35 + tilt.y).toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`,
              transformStyle: 'preserve-3d',
              transition: isDragging ? 'none' : 'transform 0.15s ease-out',
            }}
          >
            <img
              src="/images/mercedes_w15_hero.jpg"
              alt="Mercedes-AMG F1 W15 Silver Arrow 360"
              className="w-full h-full object-cover select-none pointer-events-none"
            />

            {/* Specular glare overlay */}
            <div
              className="absolute inset-0 pointer-events-none transition-opacity duration-300"
              style={{
                opacity: glare.opacity,
                background: `radial-gradient(circle 350px at ${glare.x}% ${glare.y}%, rgba(255, 255, 255, 0.45) 0%, rgba(39, 244, 210, 0.2) 40%, transparent 80%)`,
                mixBlendMode: 'overlay',
              }}
            />
          </div>
        )}

        {/* ── Aerodynamic Flow Streamlines SVG Overlay ── */}
        {aeroFlowActive && (
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-10"
            viewBox="0 0 1000 562"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M 120 420 Q 240 370 340 330 T 560 270 T 820 220"
              stroke="#00f0ff"
              strokeWidth="2.5"
              strokeLinecap="round"
              className="animate-streamline opacity-75"
            />
            <path
              d="M 160 460 Q 320 440 480 390 T 740 340 T 910 320"
              stroke="#27f4d2"
              strokeWidth="2"
              strokeLinecap="round"
              className="animate-streamline opacity-90"
              style={{ animationDuration: '0.9s' }}
            />
            <path
              d="M 280 290 Q 420 230 520 200 T 720 180 T 860 190"
              stroke="#38bdf8"
              strokeWidth="1.8"
              strokeLinecap="round"
              className="animate-streamline opacity-60"
              style={{ animationDuration: '1.4s' }}
            />
          </svg>
        )}

        {/* ── 3D Floating Holographic Badges (Z-Depth Parallax) ── */}
        <div className="absolute top-4 left-4 z-20 pointer-events-none">
          <div className="bg-black/80 backdrop-blur-md border border-white/20 px-3.5 py-2 rounded-sm shadow-luxury flex items-center gap-2 text-white">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00a19c] shadow-xs" />
            <div>
              <span className="text-[9px] uppercase tracking-widest text-emerald-400 font-bold block leading-none">
                360° Studio Showcase
              </span>
              <span className="text-xs font-display font-bold leading-tight">
                Mercedes-AMG F1 W15
              </span>
            </div>
          </div>
        </div>

        {/* Angle Indicator Pill in Top Right */}
        <div className="absolute top-4 right-4 z-20 pointer-events-none flex items-center gap-2">
          <div className="bg-black/80 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-full text-white text-[10px] font-mono flex items-center gap-1.5 shadow-subtle">
            <Compass className="w-3 h-3 text-[#27f4d2] animate-spin" style={{ animationDuration: '8s' }} />
            <span className="text-emerald-400 font-bold">{Math.round(rotationAngle)}°</span>
            <span className="text-white/60 uppercase text-[8px]">ROTATION</span>
          </div>
        </div>

        {/* ── 3D Interactive Hotspots (Cinema mode) ── */}
        {stageMode === 'cinema' && (
          <>
            {HOTSPOTS.map((h) => {
              const isActive = activeHotspot === h.id;
              return (
                <div
                  key={h.id}
                  className="absolute z-30 pointer-events-auto"
                  style={{
                    left: h.x,
                    top: h.y,
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveHotspot(isActive ? null : h.id);
                    }}
                    onMouseEnter={() => setActiveHotspot(h.id)}
                    className="relative group/hotspot w-7 h-7 flex items-center justify-center cursor-pointer"
                    aria-label={h.title}
                  >
                    <span className="absolute inset-0 rounded-full bg-[#00a19c] opacity-75 animate-ping" />
                    <span className="relative w-4 h-4 rounded-full bg-[#27f4d2] border-2 border-white shadow-luxury flex items-center justify-center text-studio-950 font-bold text-[9px]">
                      +
                    </span>
                  </button>

                  {isActive && (
                    <div
                      className="absolute bottom-9 left-1/2 -translate-x-1/2 w-64 p-3.5 bg-studio-950/95 backdrop-blur-md border border-emerald-500/40 rounded-sm shadow-2xl text-white z-40 animate-fade-in-up"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[8px] font-mono uppercase px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-xs font-bold">
                          {h.tag}
                        </span>
                        <button onClick={() => setActiveHotspot(null)} className="text-white/50 hover:text-white">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                      <h4 className="font-display font-bold text-xs text-white leading-tight mb-1">
                        {h.title}
                      </h4>
                      <p className="text-[10px] font-body text-white/80 leading-relaxed font-light">
                        {h.desc}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </>
        )}

        {/* ── Bottom Angle Presets & Controls ── */}
        <div className="absolute bottom-3 left-4 right-4 z-30 flex flex-wrap items-center justify-between gap-3 pointer-events-auto">
          {/* Quick 360° Angle Presets */}
          <div className="flex items-center gap-1 bg-black/75 backdrop-blur-md p-1 rounded-full border border-white/15 overflow-x-auto no-scrollbar">
            {[
              { angle: 0,   label: '0° Mũi xe'    },
              { angle: 45,  label: '45° Phối cảnh'},
              { angle: 90,  label: '90° Thân xe'  },
              { angle: 180, label: '180° Đuôi xe' },
              { angle: 270, label: '270° Hông đối'},
            ].map((p) => (
              <button
                key={p.angle}
                onClick={() => setAnglePreset(p.angle)}
                className={`px-2.5 py-1 rounded-full text-[9px] font-body uppercase tracking-wider font-semibold transition-all ${
                  Math.abs(rotationAngle - p.angle) < 15
                    ? 'bg-[#00a19c] text-white shadow-xs font-bold'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => openCarIn3D('w15')}
              className="px-3.5 py-1.5 bg-white hover:bg-studio-100 text-studio-950 rounded-sm text-[10px] font-body uppercase tracking-wider font-bold shadow-luxury transition-all flex items-center gap-1.5"
            >
              <Maximize2 className="w-3 h-3 text-f1red" />
              <span>{strings.open3dBtn}</span>
            </button>

            <button
              onClick={() => setActiveTab('gallery')}
              className="px-3.5 py-1.5 bg-[#00a19c] hover:bg-[#008f8a] text-white rounded-sm text-[10px] font-body uppercase tracking-wider font-bold shadow-luxury transition-all flex items-center gap-1.5"
            >
              <span>{strings.viewGalleryBtn}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
