import React from 'react';
import { CircuitData } from '../../types/circuit';
import { X, Trophy, MapPin, Compass, Activity, Zap } from 'lucide-react';
import { useNavigationStore } from '../../store/useNavigationStore';

interface CircuitDetailModalProps {
  circuit: CircuitData;
  onClose: () => void;
}

export const CircuitDetailModal: React.FC<CircuitDetailModalProps> = ({ circuit, onClose }) => {
  const { lang } = useNavigationStore();
  const isVi = lang === 'vi';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="circuit-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-studio-950 text-white rounded-2xl border border-studio-800 shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between p-4 sm:p-6 bg-studio-950/95 backdrop-blur-sm border-b border-studio-850">
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
              <h2 id="circuit-modal-title" className="text-lg sm:text-2xl font-black font-display text-white mt-0.5">
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

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-6">
          {/* Main Visual Track Map Display */}
          <div className="relative rounded-2xl bg-gradient-to-b from-studio-900 to-studio-950 border border-studio-800/80 p-4 sm:p-8 overflow-hidden flex flex-col items-center justify-center">
            {/* Background Grid Pattern */}
            <div
              className="absolute inset-0 opacity-15 pointer-events-none"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.2) 1px, transparent 0)',
                backgroundSize: '24px 24px',
              }}
            />

            {/* Glowing Track Path SVG */}
            <div className="relative w-full max-w-[500px] max-h-[290px] sm:max-h-[340px] aspect-4/3 flex items-center justify-center">
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
              <div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-studio-900/90 border border-studio-700/80 px-2.5 py-1 rounded-lg text-[10px] font-bold text-white flex items-center gap-1.5 backdrop-blur-sm shadow-md">
                <span className="w-2 h-2 rounded-full bg-f1red animate-pulse" />
                <span>{isVi ? 'Vạch Xuất Phát / Đích' : 'Start / Finish'}</span>
              </div>

              {/* Direction Indicator */}
              <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-studio-900/90 border border-studio-700/80 px-2.5 py-1 rounded-lg text-[10px] font-bold text-white flex items-center gap-1.5 backdrop-blur-sm shadow-md">
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

          {/* Quick Telemetry Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-studio-900/80 border border-studio-800">
              <span className="text-[10px] uppercase font-bold text-studio-400 block tracking-wider">
                {isVi ? 'Chiều Dài Vòng' : 'Circuit Length'}
              </span>
              <span className="text-lg font-black font-display text-white mt-0.5 block">
                {circuit.telemetry.circuitLengthKm}{' '}
                <span className="text-xs font-normal text-studio-400">km</span>
              </span>
              <span className="text-[11px] text-studio-500 block mt-0.5">
                {isVi ? `${circuit.telemetry.lapsCount} vòng đua` : `${circuit.telemetry.lapsCount} laps`}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-studio-900/80 border border-studio-800">
              <span className="text-[10px] uppercase font-bold text-studio-400 block tracking-wider">
                {isVi ? 'Tổng Cự Ly Đua' : 'Race Distance'}
              </span>
              <span className="text-lg font-black font-display text-white mt-0.5 block">
                {circuit.telemetry.raceDistanceKm}{' '}
                <span className="text-xs font-normal text-studio-400">km</span>
              </span>
              <span className="text-[11px] text-studio-500 block mt-0.5">
                {isVi ? `Chặng chính` : `Grand Prix`}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-studio-900/80 border border-studio-800">
              <span className="text-[10px] uppercase font-bold text-studio-400 block tracking-wider">
                {isVi ? 'Số Khúc Cua' : 'Total Turns'}
              </span>
              <span className="text-lg font-black font-display text-white mt-0.5 block">
                {circuit.telemetry.turns.total}{' '}
                <span className="text-xs font-normal text-studio-400">
                  ({circuit.telemetry.turns.right}R / {circuit.telemetry.turns.left}L)
                </span>
              </span>
              <span className="text-[11px] text-studio-500 block mt-0.5">
                {isVi
                  ? `${circuit.telemetry.turns.right} phải · ${circuit.telemetry.turns.left} trái`
                  : `${circuit.telemetry.turns.right} right · ${circuit.telemetry.turns.left} left`}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-studio-900/80 border border-studio-800">
              <span className="text-[10px] uppercase font-bold text-studio-400 block tracking-wider">
                {isVi ? 'Vùng DRS' : 'DRS Zones'}
              </span>
              <span className="text-lg font-black font-display text-emerald-400 mt-0.5 block flex items-center gap-1.5">
                <Zap className="w-4 h-4 fill-current text-emerald-400" />
                <span>
                  {circuit.telemetry.drsZonesCount}{' '}
                  <span className="text-xs font-normal text-studio-400">
                    {isVi ? 'vùng' : 'zones'}
                  </span>
                </span>
              </span>
              <span className="text-[11px] text-studio-500 block mt-0.5">
                {isVi ? 'Tăng tốc vượt xe' : 'Overtaking aid'}
              </span>
            </div>
          </div>

          {/* Lap Record Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-studio-900 to-studio-900 border border-amber-500/30 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0">
                <Trophy className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 block">
                  {isVi ? 'Kỷ Lục Vòng Chạy Nhanh Nhất (Lap Record)' : 'Official Race Lap Record'}
                </span>
                <span className="text-xl sm:text-2xl font-black font-display text-white block mt-0.5 tracking-tight">
                  {circuit.lapRecord.time}
                </span>
                <p className="text-xs text-studio-400">
                  {circuit.lapRecord.driver}{' '}
                  <span className="text-studio-500 font-medium">({circuit.lapRecord.team})</span> ·{' '}
                  <span className="text-amber-300 font-bold">{circuit.lapRecord.year}</span>
                </p>
              </div>
            </div>

            <div className="text-right hidden sm:block">
              <span className="text-xs text-studio-400 block">
                {isVi ? 'Năm ra mắt F1:' : 'First Grand Prix:'}
              </span>
              <span className="text-base font-bold text-white">{circuit.firstGrandPrixYear}</span>
            </div>
          </div>

          {/* DRS Zones Detailed Breakdown */}
          {circuit.drsZones.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-studio-400 flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-emerald-400" />
                <span>
                  {isVi
                    ? `Chi Tiết Các Khu Vực DRS (${circuit.drsZones.length} Vùng)`
                    : `Designated DRS Activation Zones (${circuit.drsZones.length} Zones)`}
                </span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {circuit.drsZones.map((zone) => (
                  <div
                    key={zone.id}
                    className="p-3 rounded-xl bg-studio-900/60 border border-studio-800 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-400">
                        {isVi ? zone.nameVi : zone.nameEn}
                      </span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-black uppercase">
                        DRS {zone.id}
                      </span>
                    </div>
                    <p className="text-studio-400 text-[11px]">
                      <span className="text-studio-500 font-medium">
                        {isVi ? 'Điểm kích hoạt: ' : 'Activation: '}
                      </span>
                      {zone.activationPoint}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Key Circuit Features Bullet Points */}
          <div className="space-y-2.5 pt-2 border-t border-studio-850">
            <h3 className="text-xs font-bold uppercase tracking-wider text-studio-400 flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-f1red" />
              <span>
                {isVi ? 'Đặc Tính Kỹ Thuật Đáng Chú Ý' : 'Key Engineering Characteristics'}
              </span>
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {(isVi ? circuit.keyFeaturesVi : circuit.keyFeaturesEn).map((feature, idx) => (
                <li
                  key={idx}
                  className="p-3 rounded-xl bg-studio-900/40 border border-studio-800/80 text-xs text-studio-300 flex items-start gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-f1red shrink-0 mt-1.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-studio-950 border-t border-studio-850 flex items-center justify-between">
          <span className="text-xs text-studio-500 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-studio-400" />
            {circuit.officialName}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-studio-800 hover:bg-studio-700 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            {isVi ? 'Đóng Bản Đồ' : 'Close Map'}
          </button>
        </div>
      </div>
    </div>
  );
};
