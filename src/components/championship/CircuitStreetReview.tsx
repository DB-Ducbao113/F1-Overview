import React, { useState } from 'react';
import { CircuitData } from '../../types/circuit';
import {
  TrackReviewPoint,
  getCircuitReviewPoints,
} from '../../data/championship/circuitReviewPoints';
import {
  Camera,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Gauge,
  Navigation,
  Compass,
  Zap,
  Info,
  Maximize2,
} from 'lucide-react';

interface CircuitStreetReviewProps {
  circuit: CircuitData;
  lang: 'vi' | 'en';
}

export const CircuitStreetReview: React.FC<CircuitStreetReviewProps> = ({ circuit, lang }) => {
  const isVi = lang === 'vi';
  const checkpoints = getCircuitReviewPoints(circuit.id);

  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isPhotoExpanded, setIsPhotoExpanded] = useState<boolean>(false);

  const activePoint: TrackReviewPoint = checkpoints[activeIndex] || checkpoints[0];

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % checkpoints.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + checkpoints.length) % checkpoints.length);
  };

  // Google Maps Street View viewpoint URL
  const streetViewUrl = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${activePoint.lat},${activePoint.lng}`;
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${activePoint.lat},${activePoint.lng}`;

  return (
    <div className="relative rounded-2xl bg-studio-950 border border-studio-800/80 overflow-hidden flex flex-col shadow-2xl">
      {/* ── Top Header Bar ── */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-studio-900/90 border-b border-studio-850">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-f1red/20 text-f1red border border-f1red/40 shadow-[0_0_10px_rgba(255,24,1,0.3)]">
            <Camera className="w-3 h-3" />
            <span>TRACK STREET VIEW</span>
          </span>
          <span className="text-xs font-bold font-display text-white">
            {isVi ? 'Review Chi Tiết Từng Khúc Đường' : 'Corner-by-Corner Track Walk'}
          </span>
        </div>

        <div className="flex items-center gap-1 text-[11px] font-mono text-studio-400">
          <span className="text-white font-bold">{activeIndex + 1}</span>
          <span>/</span>
          <span>{checkpoints.length} {isVi ? 'khúc đường' : 'checkpoints'}</span>
        </div>
      </div>

      {/* ── Visual Area: Map + Photo Inspector ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 bg-studio-950">
        {/* Left (5 cols): Schematic Map with Clickable Camera Pins */}
        <div className="lg:col-span-5 relative p-4 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-studio-850 min-h-[260px] bg-radial from-studio-900/40 to-studio-950">
          {/* Subtle grid pattern */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.2) 1px, transparent 0)',
              backgroundSize: '20px 20px',
            }}
          />

          <span className="absolute top-2.5 left-3 text-[10px] font-mono text-studio-500 uppercase tracking-wider">
            {isVi ? 'Bấm vào góc cua để xem ảnh' : 'Click camera to view corner'}
          </span>

          <div className="relative w-full max-w-[340px] aspect-[16/11] flex items-center justify-center">
            <svg
              viewBox={circuit.viewBox}
              className="w-full h-full filter drop-shadow-[0_0_10px_rgba(255,24,1,0.35)]"
            >
              {/* Circuit Outer Glow */}
              <path
                d={circuit.svgPath}
                fill="none"
                stroke="#ff1801"
                strokeWidth="16"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="opacity-20 blur-xs"
              />

              {/* Asphalt Road Track Line */}
              <path
                d={circuit.svgPath}
                fill="none"
                stroke="#1f2430"
                strokeWidth="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Center Line Vector */}
              <path
                d={circuit.svgPath}
                fill="none"
                stroke="#ffffff"
                strokeWidth="2"
                strokeDasharray="6 4"
                className="opacity-40"
              />

              {/* Clickable Camera Hotspots along the track */}
              {checkpoints.map((pt, idx) => {
                const isActive = idx === activeIndex;
                return (
                  <g
                    key={pt.id}
                    className="cursor-pointer transition-transform duration-100"
                    onClick={() => setActiveIndex(idx)}
                  >
                    {/* Pulsing ring for active checkpoint */}
                    {isActive && (
                      <circle
                        cx={pt.svgPoint.x}
                        cy={pt.svgPoint.y}
                        r="18"
                        fill="#ff1801"
                        className="opacity-40 animate-ping"
                      />
                    )}

                    {/* Camera pin button */}
                    <circle
                      cx={pt.svgPoint.x}
                      cy={pt.svgPoint.y}
                      r={isActive ? '12' : '9'}
                      fill={isActive ? '#e10600' : '#0f172a'}
                      stroke={isActive ? '#ffffff' : '#ff1801'}
                      strokeWidth={isActive ? '2.5' : '1.5'}
                      className="shadow-xl filter drop-shadow-[0_0_8px_rgba(0,0,0,0.9)]"
                    />

                    {/* Number / Camera tag */}
                    <text
                      x={pt.svgPoint.x}
                      y={pt.svgPoint.y + 3.5}
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize={isActive ? '9.5' : '8'}
                      fontWeight="900"
                      fontFamily="monospace"
                      className="select-none pointer-events-none"
                    >
                      {idx + 1}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="w-full flex items-center justify-between text-[10px] font-mono text-studio-400 mt-2 px-1">
            <span>{circuit.circuitName}</span>
            <span className="text-f1red font-bold">● {activePoint.turnLabel}</span>
          </div>
        </div>

        {/* Right (7 cols): Photo View Inspector Card */}
        <div className="lg:col-span-7 flex flex-col justify-between p-4 sm:p-5 bg-studio-950 relative">
          <div>
            {/* Real Corner Photo with overlay badges */}
            <div className="relative rounded-xl overflow-hidden border border-studio-800 shadow-xl group aspect-[16/9] bg-studio-900">
              <img
                src={activePoint.imageUrl}
                alt={activePoint.nameVi}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
              />

              {/* Gradient Dark Scrim on Bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

              {/* Top Badge: Turn Name & Expand button */}
              <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10">
                <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-black/80 text-white backdrop-blur-md border border-white/20 flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-f1red" />
                  <span>{activePoint.turnLabel}</span>
                </span>

                <button
                  type="button"
                  onClick={() => setIsPhotoExpanded(true)}
                  className="p-1.5 rounded-lg bg-black/70 hover:bg-black/90 text-white backdrop-blur-md border border-white/20 transition-all cursor-pointer"
                  title={isVi ? 'Phóng to ảnh' : 'Expand full photo'}
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Telemetry HUD overlay on Photo (Speed, Gear, G-Force) */}
              <div className="absolute bottom-2.5 left-2.5 right-2.5 flex flex-wrap items-center justify-between gap-2 z-10">
                <div className="flex items-center gap-1.5">
                  <div className="px-2 py-0.5 rounded bg-black/80 backdrop-blur-sm border border-white/10 text-white font-mono text-[11px] font-bold">
                    <span className="text-studio-400 text-[9px] mr-1">TỐC ĐỘ</span>
                    <span className="text-emerald-400">{activePoint.telemetry.speedKmh}</span> km/h
                  </div>

                  <div className="px-2 py-0.5 rounded bg-black/80 backdrop-blur-sm border border-white/10 text-white font-mono text-[11px] font-bold">
                    <span className="text-studio-400 text-[9px] mr-1">SỐ</span>
                    <span className="text-amber-400">G{activePoint.telemetry.gear}</span>
                  </div>

                  {activePoint.telemetry.gForceLateral && (
                    <div className="px-2 py-0.5 rounded bg-black/80 backdrop-blur-sm border border-white/10 text-white font-mono text-[11px] font-bold">
                      <span className="text-studio-400 text-[9px] mr-1">LỰC G</span>
                      <span className="text-red-400">{activePoint.telemetry.gForceLateral}G</span>
                    </div>
                  )}
                </div>

                <a
                  href={streetViewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-f1red/90 hover:bg-f1red text-white font-mono text-[10px] font-bold flex items-center gap-1 shadow-lg transition-all"
                  title="Mở Google Street View 360 độ"
                >
                  <span>Street View</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Corner Description & Racing Review Notes */}
            <div className="mt-3.5 space-y-2">
              <h3 className="text-base font-black font-display text-white">
                {isVi ? activePoint.nameVi : activePoint.nameEn}
              </h3>
              <p className="text-xs text-studio-300 leading-relaxed">
                {isVi ? activePoint.descriptionVi : activePoint.descriptionEn}
              </p>

              {/* Racing Tip Box */}
              <div className="p-2.5 rounded-xl bg-studio-900/90 border border-studio-800 flex items-start gap-2">
                <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-[11px] text-studio-300 leading-snug">
                  <span className="font-bold text-amber-400 mr-1">
                    {isVi ? 'Kỹ thuật tay đua:' : 'Driving Tip:'}
                  </span>
                  <span>{isVi ? activePoint.racingTipVi : activePoint.racingTipEn}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Controls: Previous / Next Corner */}
          <div className="flex items-center justify-between gap-3 pt-3 mt-3 border-t border-studio-850">
            <button
              type="button"
              onClick={handlePrev}
              className="px-3 py-1.5 rounded-xl bg-studio-900 hover:bg-studio-850 text-studio-300 hover:text-white border border-studio-800 text-xs font-mono font-bold flex items-center gap-1 transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>{isVi ? 'Khúc trước' : 'Previous'}</span>
            </button>

            {/* Checkpoints Dots Indicator */}
            <div className="flex items-center gap-1.5">
              {checkpoints.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveIndex(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                    i === activeIndex
                      ? 'bg-f1red w-6 shadow-[0_0_8px_rgba(255,24,1,0.6)]'
                      : 'bg-studio-800 hover:bg-studio-700'
                  }`}
                  aria-label={`Go to checkpoint ${i + 1}`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={handleNext}
              className="px-3 py-1.5 rounded-xl bg-studio-900 hover:bg-studio-850 text-studio-300 hover:text-white border border-studio-800 text-xs font-mono font-bold flex items-center gap-1 transition-all cursor-pointer"
            >
              <span>{isVi ? 'Khúc kế tiếp' : 'Next'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Bottom Carousel: Corner Thumbnails Row ── */}
      <div className="p-2.5 bg-studio-900/95 border-t border-studio-850 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <span className="text-[10px] font-mono text-studio-500 uppercase font-bold shrink-0 ml-1 mr-1">
          {isVi ? 'Các khúc cua:' : 'Corners:'}
        </span>
        {checkpoints.map((pt, idx) => (
          <button
            key={pt.id}
            type="button"
            onClick={() => setActiveIndex(idx)}
            className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl border text-xs font-mono transition-all cursor-pointer shrink-0 ${
              idx === activeIndex
                ? 'bg-studio-800 border-f1red text-white shadow-md'
                : 'bg-studio-950/80 border-studio-800/80 text-studio-400 hover:text-white hover:bg-studio-900'
            }`}
          >
            <span
              className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${
                idx === activeIndex ? 'bg-f1red text-white' : 'bg-studio-800 text-studio-300'
              }`}
            >
              {idx + 1}
            </span>
            <span className="font-bold text-[11px]">{pt.turnLabel}</span>
            <span className="text-[10px] text-studio-500">{pt.telemetry.speedKmh} km/h</span>
          </button>
        ))}
      </div>

      {/* ── Fullscreen Photo Lightbox Modal ── */}
      {isPhotoExpanded && (
        <div
          className="fixed inset-0 z-[99999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setIsPhotoExpanded(false)}
        >
          <div
            className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={activePoint.imageUrl}
              alt={activePoint.nameVi}
              className="w-full h-auto max-h-[80vh] object-contain rounded-xl border border-studio-800 shadow-2xl"
            />
            <div className="flex items-center justify-between w-full mt-3 px-2 text-white">
              <div className="flex flex-col">
                <span className="text-sm font-bold">{isVi ? activePoint.nameVi : activePoint.nameEn}</span>
                <span className="text-xs text-studio-400 font-mono">
                  {circuit.circuitName} • {activePoint.telemetry.speedKmh} km/h • Gear {activePoint.telemetry.gear}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsPhotoExpanded(false)}
                className="px-4 py-1.5 rounded-lg bg-f1red text-white text-xs font-mono font-bold cursor-pointer"
              >
                {isVi ? 'Đóng' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
