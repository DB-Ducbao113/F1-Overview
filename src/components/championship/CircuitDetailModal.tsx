import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CircuitData } from '../../types/circuit';
import { X, Trophy, MapPin, Compass, Activity, Zap, Radio, Globe, Camera } from 'lucide-react';
import { useNavigationStore } from '../../store/useNavigationStore';
import { CircuitRealWorldMap } from './CircuitRealWorldMap';
import { OpenF1LiveMap } from './OpenF1LiveMap';
import { CircuitStreetReview } from './CircuitStreetReview';

type MapMode = 'review' | 'real' | 'openf1' | 'vector';

interface CircuitDetailModalProps {
  circuit: CircuitData;
  onClose: () => void;
}

export const CircuitDetailModal: React.FC<CircuitDetailModalProps> = ({ circuit, onClose }) => {
  const { lang } = useNavigationStore();
  const isVi = lang === 'vi';
  const [mapMode, setMapMode] = useState<MapMode>('review');

  // Prevent background scrolling and support Escape key
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const modalContent = (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="circuit-modal-title"
      className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl max-h-[94vh] overflow-y-auto bg-studio-950 text-white rounded-2xl border border-studio-800 shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-5 py-3.5 sm:px-6 sm:py-4 bg-studio-950/95 backdrop-blur-sm border-b border-studio-850">
          <div className="flex items-center gap-3">
            <span className="text-2xl sm:text-3xl" title={circuit.country}>
              {circuit.flag}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded bg-f1red text-white">
                  {isVi ? `Vòng ${circuit.round}` : `Round ${circuit.round}`}
                </span>
                <span className="text-xs text-studio-400 font-medium">
                  {circuit.city}, {circuit.country}
                </span>
              </div>
              <h2 id="circuit-modal-title" className="text-base sm:text-xl font-black font-display text-white mt-0.5">
                {circuit.circuitName}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-studio-400 hover:text-white hover:bg-studio-800 transition-colors cursor-pointer"
            aria-label={isVi ? 'Đóng' : 'Close'}
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Modal Body: Responsive 2-column layout on desktop (lg:) so map and stats fit without scrolling */}
        <div className="p-4 sm:p-5 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left Column (7 cols): Map + Essential Telemetry Grid */}
          <div className="lg:col-span-7 space-y-3.5">
            {/* Header bar above map with 4-way Mode toggle */}
            <div className="flex flex-wrap items-center justify-between gap-2 px-1">
              <div className="flex flex-wrap items-center gap-1.5 p-1 bg-studio-900/90 rounded-xl border border-studio-800 shadow-sm">
                <button
                  type="button"
                  onClick={() => setMapMode('review')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    mapMode === 'review'
                      ? 'bg-f1red text-white shadow-[0_0_12px_rgba(255,24,1,0.5)]'
                      : 'text-studio-400 hover:text-white hover:bg-studio-800/60'
                  }`}
                  title={isVi ? 'Xem ảnh chụp thực tế từng khúc đường' : 'Street View review of each track section'}
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>{isVi ? '📸 Review Khúc Đường' : '📸 Track Review'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMapMode('real')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    mapMode === 'real'
                      ? 'bg-f1red text-white shadow-[0_0_12px_rgba(255,24,1,0.5)]'
                      : 'text-studio-400 hover:text-white hover:bg-studio-800/60'
                  }`}
                  title={isVi ? 'Bản đồ thực tế chụp vệ tinh' : 'Real-world Satellite Map'}
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>{isVi ? '🛰️ Vệ Tinh' : '🛰️ Satellite'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMapMode('openf1')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    mapMode === 'openf1'
                      ? 'bg-f1red text-white shadow-[0_0_12px_rgba(255,24,1,0.5)]'
                      : 'text-studio-400 hover:text-white hover:bg-studio-800/60'
                  }`}
                  title={isVi ? 'Live GPS xe đua thật từ OpenF1 API' : 'Real-time GPS tracker from OpenF1 API'}
                >
                  <Radio className={`w-3.5 h-3.5 ${mapMode === 'openf1' ? 'animate-pulse text-white' : ''}`} />
                  <span>{isVi ? '🔴 OpenF1 Live' : '🔴 OpenF1 Live'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMapMode('vector')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    mapMode === 'vector'
                      ? 'bg-f1red text-white shadow-[0_0_12px_rgba(255,24,1,0.5)]'
                      : 'text-studio-400 hover:text-white hover:bg-studio-800/60'
                  }`}
                  title={isVi ? 'Sơ đồ thiết kế vector' : 'Vector Track Schematic'}
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>{isVi ? '🏎️ Vector' : '🏎️ Vector'}</span>
                </button>
              </div>

              {mapMode === 'review' && (
                <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  PHOTO STREET VIEW
                </span>
              )}

              {mapMode === 'real' && (
                <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                  SATELLITE & GPS
                </span>
              )}

              {mapMode === 'openf1' && (
                <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-f1red/20 text-f1red border border-f1red/30 shadow-[0_0_8px_rgba(255,24,1,0.3)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-f1red animate-ping" />
                  OPENF1 TELEMETRY
                </span>
              )}
            </div>

            {/* Main Visual Track Map Display */}
            {mapMode === 'review' && (
              <CircuitStreetReview circuit={circuit} lang={lang} />
            )}

            {mapMode === 'real' && (
              <CircuitRealWorldMap circuit={circuit} lang={lang} />
            )}

            {mapMode === 'openf1' && (
              <OpenF1LiveMap lang={lang} />
            )}

            {mapMode === 'vector' && (
              <div className="relative rounded-2xl bg-gradient-to-b from-studio-900 to-studio-950 border border-studio-800/80 p-3 sm:p-5 overflow-hidden flex flex-col items-center justify-center min-h-[240px] sm:min-h-[280px]">
                {/* Background Grid Pattern */}
                <div
                  className="absolute inset-0 opacity-15 pointer-events-none"
                  style={{
                    backgroundImage:
                      'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.2) 1px, transparent 0)',
                    backgroundSize: '20px 20px',
                  }}
                />

                {/* Glowing Track Path SVG */}
                <div className="relative w-full max-w-[460px] aspect-[16/11] flex items-center justify-center">
                  <svg
                    viewBox={circuit.viewBox}
                    className="w-full h-full filter drop-shadow-[0_0_14px_rgba(255,24,1,0.55)]"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Track shadow / background glow */}
                    <path
                      d={circuit.svgPath}
                      fill="none"
                      stroke="#ff1801"
                      strokeWidth="20"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="opacity-25 blur-xs"
                    />

                    {/* Outer kerb border */}
                    <path
                      d={circuit.svgPath}
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth="14"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="opacity-85"
                    />

                    {/* Asphalt main track line */}
                    <path
                      d={circuit.svgPath}
                      fill="none"
                      stroke="#161922"
                      strokeWidth="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {/* Glowing speed vector line */}
                    <path
                      d={circuit.svgPath}
                      fill="none"
                      stroke="#ff1801"
                      strokeWidth="5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeDasharray="16 4"
                      className="animate-pulse"
                    />

                    {/* Start / Finish Marker */}
                    <circle
                      cx={circuit.startFinish.x}
                      cy={circuit.startFinish.y}
                      r="14"
                      fill="#ff1801"
                      className="opacity-60 animate-pulse"
                    />
                    <circle
                      cx={circuit.startFinish.x}
                      cy={circuit.startFinish.y}
                      r="8"
                      fill="#ffffff"
                      stroke="#ff1801"
                      strokeWidth="3.5"
                    />
                  </svg>

                  {/* Start / Finish Tag Floating */}
                  <div className="absolute top-2 left-2 bg-studio-900/90 border border-studio-700/80 px-2 py-0.5 rounded-lg text-[10px] font-bold text-white flex items-center gap-1.5 backdrop-blur-sm shadow-md">
                    <span className="w-2 h-2 rounded-full bg-f1red animate-pulse" />
                    <span>{isVi ? 'Vạch Xuất Phát / Đích' : 'Start / Finish'}</span>
                  </div>

                  {/* Direction Indicator */}
                  <div className="absolute top-2 right-2 bg-studio-900/90 border border-studio-700/80 px-2 py-0.5 rounded-lg text-[10px] font-bold text-white flex items-center gap-1.5 backdrop-blur-sm shadow-md">
                    <Compass className="w-3 h-3 text-amber-400" />
                    <span>
                      {circuit.telemetry.direction === 'clockwise'
                        ? isVi
                          ? 'Thuận chiều kim đồng hồ ↻'
                          : 'Clockwise ↻'
                        : isVi
                          ? 'Ngược chiều kim đồng hồ ↺'
                          : 'Anti-clockwise ↺'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Telemetry Grid (4 cards) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 rounded-xl bg-studio-900/80 border border-studio-800">
                <span className="text-[9px] uppercase font-bold text-studio-400 block tracking-wider">
                  {isVi ? 'Chiều Dài Vòng' : 'Circuit Length'}
                </span>
                <span className="text-base font-black font-display text-white mt-0.5 block">
                  {circuit.telemetry.circuitLengthKm}{' '}
                  <span className="text-[11px] font-normal text-studio-400">km</span>
                </span>
                <span className="text-[10px] text-studio-500 block mt-0.5">
                  {isVi ? `${circuit.telemetry.lapsCount} vòng đua` : `${circuit.telemetry.lapsCount} laps`}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-studio-900/80 border border-studio-800">
                <span className="text-[9px] uppercase font-bold text-studio-400 block tracking-wider">
                  {isVi ? 'Tổng Cự Ly Đua' : 'Race Distance'}
                </span>
                <span className="text-base font-black font-display text-white mt-0.5 block">
                  {circuit.telemetry.raceDistanceKm}{' '}
                  <span className="text-[11px] font-normal text-studio-400">km</span>
                </span>
                <span className="text-[10px] text-studio-500 block mt-0.5">
                  {isVi ? `Chặng chính` : `Grand Prix`}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-studio-900/80 border border-studio-800">
                <span className="text-[9px] uppercase font-bold text-studio-400 block tracking-wider">
                  {isVi ? 'Số Khúc Cua' : 'Total Turns'}
                </span>
                <span className="text-base font-black font-display text-white mt-0.5 block">
                  {circuit.telemetry.turns.total}{' '}
                  <span className="text-[11px] font-normal text-studio-400">
                    ({circuit.telemetry.turns.right}R / {circuit.telemetry.turns.left}L)
                  </span>
                </span>
                <span className="text-[10px] text-studio-500 block mt-0.5">
                  {isVi
                    ? `${circuit.telemetry.turns.right} phải · ${circuit.telemetry.turns.left} trái`
                    : `${circuit.telemetry.turns.right}R · ${circuit.telemetry.turns.left}L`}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-studio-900/80 border border-studio-800">
                <span className="text-[9px] uppercase font-bold text-studio-400 block tracking-wider">
                  {isVi ? 'Vùng DRS' : 'DRS Zones'}
                </span>
                <span className="text-base font-black font-display text-emerald-400 mt-0.5 block flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 fill-current text-emerald-400" />
                  <span>
                    {circuit.telemetry.drsZonesCount}{' '}
                    <span className="text-[11px] font-normal text-studio-400">
                      {isVi ? 'vùng' : 'zones'}
                    </span>
                  </span>
                </span>
                <span className="text-[10px] text-studio-500 block mt-0.5">
                  {isVi ? 'Tăng tốc vượt xe' : 'Overtaking aid'}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column (5 cols): Lap Record + DRS Zones + Key Characteristics */}
          <div className="lg:col-span-5 space-y-3.5">
            {/* Lap Record Card */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-gradient-to-r from-amber-950/40 via-studio-900 to-studio-900 border border-amber-500/30 flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0">
                  <Trophy className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <span className="text-[9px] font-black uppercase tracking-wider text-amber-400 block">
                    {isVi ? 'Kỷ Lục Vòng Nhanh Nhất (Lap Record)' : 'Official Race Lap Record'}
                  </span>
                  <span className="text-lg font-black font-display text-white block tracking-tight">
                    {circuit.lapRecord.time}
                  </span>
                  <p className="text-[11px] text-studio-300">
                    {circuit.lapRecord.driver}{' '}
                    <span className="text-studio-400 font-medium">({circuit.lapRecord.team})</span> ·{' '}
                    <span className="text-amber-300 font-bold">{circuit.lapRecord.year}</span>
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-studio-400 block">
                  {isVi ? 'Ra mắt F1' : 'Debut'}
                </span>
                <span className="text-sm font-bold text-white">{circuit.firstGrandPrixYear}</span>
              </div>
            </div>

            {/* DRS Zones */}
            {circuit.drsZones.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-[11px] font-bold uppercase tracking-wider text-studio-400 flex items-center gap-1.5">
                  <Zap className="w-3 h-3 text-emerald-400" />
                  <span>
                    {isVi
                      ? `Các Khu Vực DRS (${circuit.drsZones.length} Vùng)`
                      : `DRS Activation Zones (${circuit.drsZones.length} Zones)`}
                  </span>
                </h3>
                <div className="grid grid-cols-1 gap-2 max-h-[140px] overflow-y-auto pr-1">
                  {circuit.drsZones.map((zone) => (
                    <div
                      key={zone.id}
                      className="p-2.5 rounded-lg bg-studio-900/70 border border-studio-800 text-xs flex items-center justify-between"
                    >
                      <div>
                        <span className="font-bold text-emerald-400 block text-[11px]">
                          {isVi ? zone.nameVi : zone.nameEn}
                        </span>
                        <span className="text-studio-400 text-[10px] block mt-0.5">
                          {zone.activationPoint}
                        </span>
                      </div>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-black uppercase shrink-0">
                        DRS {zone.id}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Key Circuit Features */}
            <div className="space-y-2 pt-1 border-t border-studio-850">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-studio-400 flex items-center gap-1.5">
                <Activity className="w-3 h-3 text-f1red" />
                <span>
                  {isVi ? 'Đặc Tính Kỹ Thuật Đáng Chú Ý' : 'Key Engineering Characteristics'}
                </span>
              </h3>
              <ul className="space-y-1.5">
                {(isVi ? circuit.keyFeaturesVi : circuit.keyFeaturesEn).map((feature, idx) => (
                  <li
                    key={idx}
                    className="p-2 rounded-lg bg-studio-900/40 border border-studio-800/80 text-[11px] text-studio-300 flex items-start gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-f1red shrink-0 mt-1" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 sm:px-6 sm:py-3.5 bg-studio-950 border-t border-studio-850 flex items-center justify-between shrink-0">
          <span className="text-xs text-studio-400 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-f1red" />
            <span className="truncate max-w-[280px] sm:max-w-none">{circuit.officialName}</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-studio-800 hover:bg-studio-700 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            {isVi ? 'Đóng Bản Đồ' : 'Close Map'}
          </button>
        </div>
      </div>
    </div>
  );

  if (typeof document === 'undefined') {
    return modalContent;
  }

  return createPortal(modalContent, document.body);
};
