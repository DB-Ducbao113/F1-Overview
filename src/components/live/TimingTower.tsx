import React, { useEffect, useRef, useState } from 'react';
import { TimingRowWithGainLoss } from '../../hooks/live/useLiveTiming';
import { useNavigationStore } from '../../store/useNavigationStore';
import { ArrowUp, ArrowDown, Minus, Zap, Flag } from 'lucide-react';
import { TyreCompound } from '../../lib/live/openf1-types';

interface TimingTowerProps {
  tower: TimingRowWithGainLoss[];
  loading?: boolean;
  selectedDriverNumber?: number | null;
  onSelectDriver?: (driverNumber: number) => void;
  fastestLap?: {
    driver_number: number;
    driver_name: string;
    time: string;
  };
  emptyMessage?: string;
}

const TYRE_BADGE_COLORS: Record<TyreCompound, { bg: string; text: string; letter: string }> = {
  SOFT: { bg: 'bg-red-500', text: 'text-white', letter: 'S' },
  MEDIUM: { bg: 'bg-yellow-400', text: 'text-black', letter: 'M' },
  HARD: { bg: 'bg-white', text: 'text-black', letter: 'H' },
  INTERMEDIATE: { bg: 'bg-emerald-500', text: 'text-black', letter: 'I' },
  WET: { bg: 'bg-blue-500', text: 'text-white', letter: 'W' },
  UNKNOWN: { bg: 'bg-studio-700', text: 'text-studio-300', letter: '?' },
};

export const TimingTower: React.FC<TimingTowerProps> = ({
  tower,
  loading = false,
  selectedDriverNumber,
  onSelectDriver,
  fastestLap,
  emptyMessage,
}) => {
  const { lang } = useNavigationStore();
  const isVi = lang === 'vi';

  // Flash highlight detection when position changes
  const [flashingDrivers, setFlashingDrivers] = useState<Record<number, 'gain' | 'loss'>>({});
  const prevPosMap = useRef<Record<number, number>>({});

  useEffect(() => {
    if (tower.length === 0) return;

    const newFlashes: Record<number, 'gain' | 'loss'> = {};
    let hasChanges = false;

    for (const row of tower) {
      const prev = prevPosMap.current[row.driver_number];
      if (prev !== undefined && prev !== row.position) {
        hasChanges = true;
        newFlashes[row.driver_number] = prev > row.position ? 'gain' : 'loss';
      }
      prevPosMap.current[row.driver_number] = row.position;
    }

    if (hasChanges) {
      setFlashingDrivers(newFlashes);
      const timer = setTimeout(() => {
        setFlashingDrivers({});
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [tower]);

  return (
    <div className="w-full min-w-[320px] bg-[#0a0a0f] border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col select-none">
      {/* Sticky Tower Header */}
      <div className="sticky top-0 z-10 bg-[#0d0e15] border-b border-white/10">
        <div className="px-4 py-3 bg-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-sm bg-f1red animate-pulse" />
            <h3 className="font-display text-xs font-black uppercase tracking-wider text-white">
              {isVi ? 'BẢNG XẾP HẠNG THỜI GIAN · P1-P20' : 'TIMING TOWER · P1-P20'}
            </h3>
          </div>
          {fastestLap && (
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-purple-500/20 border border-purple-500/40 text-[10px] text-purple-300 font-mono font-bold">
              <span>FL: {fastestLap.driver_name}</span>
              <span className="text-white">{fastestLap.time}</span>
            </div>
          )}
        </div>

        {/* Table Column Headers (Sticky) */}
        <div className="grid grid-cols-12 gap-1 px-3 py-1.5 bg-black/60 text-[10px] uppercase font-bold text-studio-400 border-t border-white/5">
          <div className="col-span-1 text-center">Pos</div>
          <div className="col-span-1 text-center">+/-</div>
          <div className="col-span-4 pl-1">{isVi ? 'Tay đua' : 'Driver'}</div>
          <div className="col-span-2 text-right">{isVi ? 'Khoảng cách' : 'Gap'}</div>
          <div className="col-span-2 text-center">{isVi ? 'Lốp' : 'Tyre'}</div>
          <div className="col-span-2 text-right pr-1">{isVi ? 'Tốc độ' : 'Speed'}</div>
        </div>
      </div>

      {/* Driver Rows / Skeletons */}
      {loading ? (
        /* ── State 1: 10 Skeleton Shimmer Rows ── */
        <div className="divide-y divide-white/5 max-h-[520px] overflow-y-auto">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={`skeleton-${i}`}
              className="grid grid-cols-12 gap-1 px-3 py-2 text-xs items-center animate-pulse"
            >
              <div className="col-span-1 font-mono font-bold text-center text-studio-600">
                {i + 1}
              </div>
              <div className="col-span-1 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-white/10" />
              </div>
              <div className="col-span-4 flex items-center gap-2">
                <div className="w-1.5 h-4 rounded-full bg-white/20 shrink-0" />
                <div className="space-y-1 w-full">
                  <div className="h-2.5 w-12 bg-white/20 rounded" />
                  <div className="h-2 w-16 bg-white/10 rounded" />
                </div>
              </div>
              <div className="col-span-2 text-right">
                <div className="h-2.5 w-10 bg-white/15 rounded ml-auto" />
              </div>
              <div className="col-span-2 flex items-center justify-center gap-1.5">
                <div className="w-4 h-4 rounded-full bg-white/20" />
                <div className="h-2 w-4 bg-white/10 rounded" />
              </div>
              <div className="col-span-2 text-right pr-1">
                <div className="h-2.5 w-8 bg-white/15 rounded ml-auto" />
              </div>
            </div>
          ))}
        </div>
      ) : tower.length === 0 ? (
        /* ── State 2: Empty Notice ── */
        <div className="py-16 px-4 text-center space-y-2">
          <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-studio-400">
            <Flag className="w-4 h-4" />
          </div>
          <p className="text-xs text-studio-400 font-medium">
            {emptyMessage ||
              (isVi
                ? 'Chưa có dữ liệu vị trí tay đua cho phiên này'
                : 'No timing data available for this session')}
          </p>
        </div>
      ) : (
        /* ── State 3: Ready Driver Rows ── */
        <div className="divide-y divide-white/5 max-h-[520px] overflow-y-auto">
          {tower.map((row) => {
            const isSelected = row.driver_number === selectedDriverNumber;
            const tyreInfo = TYRE_BADGE_COLORS[row.tyre.compound] || TYRE_BADGE_COLORS.UNKNOWN;
            const flash = flashingDrivers[row.driver_number];

            return (
              <div
                key={row.driver_number}
                onClick={() => onSelectDriver?.(row.driver_number)}
                className={`grid grid-cols-12 gap-1 px-3 py-2 text-xs items-center cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-white/10 border-l-4 border-white shadow-inner font-semibold'
                    : flash === 'gain'
                      ? 'bg-emerald-500/15 border-l-4 border-emerald-400'
                      : flash === 'loss'
                        ? 'bg-red-500/15 border-l-4 border-red-400'
                        : 'hover:bg-white/5 border-l-4 border-transparent'
                }`}
              >
                {/* Position */}
                <div className="col-span-1 font-mono font-black text-center text-white tabular-nums">
                  {row.position}
                </div>

                {/* Gain / Loss Arrow */}
                <div className="col-span-1 flex items-center justify-center font-mono text-[10px] font-bold">
                  {row.gainLoss > 0 ? (
                    <span
                      className="text-emerald-400 flex items-center"
                      title={`+${row.gainLoss} pos`}
                    >
                      <ArrowUp className="w-3 h-3" />
                    </span>
                  ) : row.gainLoss < 0 ? (
                    <span className="text-red-400 flex items-center" title={`${row.gainLoss} pos`}>
                      <ArrowDown className="w-3 h-3" />
                    </span>
                  ) : (
                    <span className="text-studio-600">
                      <Minus className="w-3 h-3" />
                    </span>
                  )}
                </div>

                {/* Driver Info + Team Color Accent */}
                <div className="col-span-4 flex items-center gap-2 overflow-hidden">
                  <span
                    className="w-1.5 h-4 rounded-full shrink-0 shadow-sm"
                    style={{ backgroundColor: row.team_colour }}
                  />
                  <div className="truncate">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-black text-white text-[11px] uppercase tracking-wider">
                        {row.name_acronym}
                      </span>
                      <span className="text-[10px] text-studio-400 truncate">
                        {row.broadcast_name}
                      </span>
                    </div>
                    <span className="text-[9px] text-studio-500 truncate block">
                      {row.team_name}
                    </span>
                  </div>
                </div>

                {/* Gap to Leader */}
                <div className="col-span-2 text-right font-mono text-[11px] font-semibold text-studio-200 tabular-nums">
                  {row.in_pit ? (
                    <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[9px] font-bold uppercase">
                      PIT
                    </span>
                  ) : (
                    row.gap_to_leader || '-'
                  )}
                </div>

                {/* Tyre Compound Badge + Laps */}
                <div className="col-span-2 flex items-center justify-center gap-1.5">
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black shadow-sm ${tyreInfo.bg} ${tyreInfo.text}`}
                    title={`${row.tyre.compound} (${row.tyre.laps_used} laps)`}
                  >
                    {tyreInfo.letter}
                  </span>
                  <span className="font-mono text-[10px] text-studio-400 tabular-nums">
                    {row.tyre.laps_used}L
                  </span>
                </div>

                {/* Live Telemetry Speed / DRS */}
                <div className="col-span-2 text-right pr-1 font-mono text-[11px] text-studio-300 tabular-nums">
                  {row.telemetry?.speed ? (
                    <div className="flex items-center justify-end gap-1">
                      {row.telemetry.drs && (
                        <Zap className="w-2.5 h-2.5 text-emerald-400 animate-pulse" />
                      )}
                      <span>{Math.round(row.telemetry.speed)}</span>
                    </div>
                  ) : (
                    <span className="text-studio-600">-</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
