import React, { useState } from 'react';
import { CircuitData } from '../../types/circuit';
import { getCircuitByRound, findCircuitByName } from '../../data/championship/circuitsData';
import { useNavigationStore } from '../../store/useNavigationStore';
import { CircuitDetailModal } from './CircuitDetailModal';
import { Maximize2, Trophy, Zap, Compass } from 'lucide-react';

interface CircuitTrackMapProps {
  round?: number;
  circuitName?: string;
  circuitData?: CircuitData;
  variant?: 'card' | 'thumbnail';
  className?: string;
}

export const CircuitTrackMap: React.FC<CircuitTrackMapProps> = React.memo(
  ({ round, circuitName, circuitData: explicitData, variant = 'card', className = '' }) => {
    const { lang } = useNavigationStore();
    const isVi = lang === 'vi';
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Resolve circuit data by round, or fuzzy match by circuitName
    const circuit: CircuitData | undefined =
      explicitData ||
      (round ? getCircuitByRound(round) : undefined) ||
      (circuitName ? findCircuitByName(circuitName) : undefined);

    if (!circuit) {
      return null;
    }

    // 1. Thumbnail Variant (Compact silhouette displayed in collapsed calendar row)
    if (variant === 'thumbnail') {
      return (
        <div
          className={`relative group cursor-pointer inline-flex items-center justify-center ${className}`}
          onClick={(e) => {
            e.stopPropagation();
            setIsModalOpen(true);
          }}
          title={isVi ? `Xem bản đồ ${circuit.circuitName}` : `View ${circuit.circuitName} map`}
        >
          <div className="w-10 h-8 sm:w-12 sm:h-9 rounded-lg bg-studio-900 border border-studio-700/60 p-1 flex items-center justify-center overflow-hidden transition-all group-hover:border-f1red/60 group-hover:bg-studio-950 group-hover:shadow-xs shrink-0">
            <svg
              viewBox={circuit.viewBox}
              className="w-full h-full filter drop-shadow-[0_0_3px_rgba(225,6,0,0.5)] transition-transform group-hover:scale-105"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d={circuit.svgPath}
                fill="none"
                stroke="#e10600"
                strokeWidth="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle
                cx={circuit.startFinish.x}
                cy={circuit.startFinish.y}
                r="7"
                fill="#ffffff"
                stroke="#e10600"
                strokeWidth="3"
              />
            </svg>
          </div>

          {isModalOpen && (
            <CircuitDetailModal circuit={circuit} onClose={() => setIsModalOpen(false)} />
          )}
        </div>
      );
    }

    // 2. Card Variant (Full interactive track map inside expanded calendar round)
    return (
      <div
        className={`rounded-xl sm:rounded-2xl bg-studio-950 text-white border border-studio-800 shadow-md overflow-hidden ${className}`}
      >
        <div className="p-3.5 sm:p-5 flex flex-col md:flex-row items-stretch gap-4 sm:gap-6">
          {/* Left Canvas: SVG Track Map Display */}
          <div className="relative flex-1 min-h-[190px] sm:min-h-[220px] rounded-xl bg-gradient-to-b from-studio-900/90 to-studio-950 border border-studio-800/80 p-3 sm:p-4 flex items-center justify-center overflow-hidden group">
            {/* Background Grid Pattern */}
            <div
              className="absolute inset-0 opacity-15 pointer-events-none"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.2) 1px, transparent 0)',
                backgroundSize: '18px 18px',
              }}
            />

            {/* Glowing Track Path SVG */}
            <div className="relative w-full max-w-[360px] aspect-4/3 flex items-center justify-center">
              <svg
                viewBox={circuit.viewBox}
                className="w-full h-full filter drop-shadow-[0_0_8px_rgba(225,6,0,0.5)] transition-transform duration-300 group-hover:scale-102"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Track glow aura */}
                <path
                  d={circuit.svgPath}
                  fill="none"
                  stroke="#e10600"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="opacity-20 blur-2xs"
                />

                {/* Outer kerb white border */}
                <path
                  d={circuit.svgPath}
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="opacity-40"
                />

                {/* Asphalt main track line */}
                <path
                  d={circuit.svgPath}
                  fill="none"
                  stroke="#1c1f26"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* High-visibility F1 Red Line */}
                <path
                  d={circuit.svgPath}
                  fill="none"
                  stroke="#e10600"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="14 3"
                />

                {/* Start / Finish Point Marker */}
                <circle
                  cx={circuit.startFinish.x}
                  cy={circuit.startFinish.y}
                  r="6"
                  fill="#ffffff"
                  stroke="#e10600"
                  strokeWidth="2.5"
                />
              </svg>

              {/* Start / Finish Tag Floating */}
              <div className="absolute bottom-1 left-1 sm:bottom-2 sm:left-2 bg-studio-900/90 border border-studio-700/80 px-2 py-0.5 rounded text-[9px] font-bold text-white flex items-center gap-1 backdrop-blur-xs shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-f1red animate-pulse" />
                <span>{isVi ? 'Vạch xuất phát' : 'Start / Finish'}</span>
              </div>

              {/* Direction Indicator */}
              <div className="absolute top-1 right-1 sm:top-2 sm:right-2 bg-studio-900/90 border border-studio-700/80 px-2 py-0.5 rounded text-[9px] font-bold text-studio-300 flex items-center gap-1 backdrop-blur-xs shadow-xs">
                <Compass className="w-2.5 h-2.5 text-amber-400" />
                <span>
                  {circuit.telemetry.direction === 'clockwise'
                    ? isVi
                      ? 'Thuận kim đồng hồ ↻'
                      : 'Clockwise ↻'
                    : isVi
                      ? 'Ngược kim đồng hồ ↺'
                      : 'Anti-clockwise ↺'}
                </span>
              </div>
            </div>

            {/* Quick Inspect Button Overlay */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-studio-800/80 hover:bg-f1red text-studio-300 hover:text-white border border-studio-700 hover:border-f1red transition-all cursor-pointer shadow-md flex items-center gap-1 text-[10px] font-bold"
              title={isVi ? 'Xem toàn màn hình bản đồ' : 'Expand full map'}
            >
              <Maximize2 className="w-3 h-3" />
              <span className="hidden sm:inline">{isVi ? 'Chi tiết' : 'Full Map'}</span>
            </button>
          </div>

          {/* Right Info: Circuit Telemetry & Specs */}
          <div className="w-full md:w-[320px] lg:w-[360px] flex flex-col justify-between space-y-3 shrink-0">
            <div>
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-f1red flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-f1red animate-ping" />
                  {isVi ? 'Bản Đồ Đường Đua F1' : 'Circuit Track Layout'}
                </span>
                <span className="text-[10px] text-studio-400 font-bold">
                  {circuit.firstGrandPrixYear > 0 &&
                    (isVi
                      ? `Từ năm ${circuit.firstGrandPrixYear}`
                      : `Since ${circuit.firstGrandPrixYear}`)}
                </span>
              </div>
              <h4 className="text-base sm:text-lg font-bold font-display text-white leading-tight">
                {circuit.circuitName}
              </h4>
              <p className="text-xs text-studio-400 mt-0.5">
                {circuit.city}, {circuit.country} {circuit.flag}
              </p>
            </div>

            {/* Telemetry Micro Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded-lg bg-studio-900/80 border border-studio-800">
                <span className="text-[9px] uppercase font-bold text-studio-400 block tracking-wider">
                  {isVi ? 'Chiều Dài Vòng' : 'Circuit Length'}
                </span>
                <span className="font-extrabold font-display text-white mt-0.5 block">
                  {circuit.telemetry.circuitLengthKm}{' '}
                  <span className="text-[10px] font-normal text-studio-400">km</span>
                </span>
              </div>

              <div className="p-2 rounded-lg bg-studio-900/80 border border-studio-800">
                <span className="text-[9px] uppercase font-bold text-studio-400 block tracking-wider">
                  {isVi ? 'Số Khúc Cua' : 'Turns'}
                </span>
                <span className="font-extrabold font-display text-white mt-0.5 block">
                  {circuit.telemetry.turns.total}{' '}
                  <span className="text-[10px] font-normal text-studio-400">
                    ({circuit.telemetry.turns.right}R / {circuit.telemetry.turns.left}L)
                  </span>
                </span>
              </div>

              <div className="p-2 rounded-lg bg-studio-900/80 border border-studio-800">
                <span className="text-[9px] uppercase font-bold text-studio-400 block tracking-wider">
                  {isVi ? 'Vùng DRS' : 'DRS Zones'}
                </span>
                <span className="font-extrabold font-display text-emerald-400 mt-0.5 block flex items-center gap-1">
                  <Zap className="w-3 h-3 fill-current text-emerald-400" />
                  <span>
                    {circuit.telemetry.drsZonesCount}{' '}
                    <span className="text-[10px] font-normal text-studio-400">
                      {isVi ? 'vùng' : 'zones'}
                    </span>
                  </span>
                </span>
              </div>

              <div className="p-2 rounded-lg bg-studio-900/80 border border-studio-800">
                <span className="text-[9px] uppercase font-bold text-studio-400 block tracking-wider">
                  {isVi ? 'Độ Chênh Cao' : 'Elevation Change'}
                </span>
                <span className="font-extrabold font-display text-white mt-0.5 block">
                  {circuit.telemetry.elevationChangeM}{' '}
                  <span className="text-[10px] font-normal text-studio-400">m</span>
                </span>
              </div>
            </div>

            {/* Lap Record Pill */}
            <div className="p-2.5 rounded-xl bg-studio-900/70 border border-amber-500/30 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between text-[9px]">
                  <span className="font-bold text-amber-400 uppercase tracking-wider">
                    {isVi ? 'Kỷ lục vòng chạy' : 'Lap Record'}
                  </span>
                  <span className="font-bold text-studio-400">{circuit.lapRecord.year}</span>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xs font-black font-display text-white tracking-tight">
                    {circuit.lapRecord.time}
                  </span>
                  <span className="text-[10px] text-studio-300 truncate">
                    {circuit.lapRecord.driver}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Button to Open Full Modal */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full py-1.5 px-3 rounded-lg bg-studio-800 hover:bg-f1red text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs border border-studio-700 hover:border-f1red"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>{isVi ? 'Xem Chi Tiết Sơ Đồ & DRS' : 'View Full Circuit Map & DRS'}</span>
            </button>
          </div>
        </div>

        {/* Modal Portal */}
        {isModalOpen && (
          <CircuitDetailModal circuit={circuit} onClose={() => setIsModalOpen(false)} />
        )}
      </div>
    );
  },
);
