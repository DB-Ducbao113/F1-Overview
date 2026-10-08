import React, { useMemo, useState, useEffect } from 'react';
import { LiveCarPosition, LiveState } from '../../lib/live/openf1-types';
import { CIRCUITS_DATA } from '../../data/championship/circuitsData';
import { getCircuitReviewPoints, TrackReviewPoint } from '../../data/championship/circuitReviewPoints';
import { resolveCircuitId } from '../../data/live/simulationRaces';
import { TimingRowWithGainLoss } from '../../hooks/live/useLiveTiming';
import { useNavigationStore } from '../../store/useNavigationStore';
import {
  Compass,
  AlertTriangle,
  RotateCcw,
  Zap,
  Gauge,
  X,
  Calendar,
  ChevronRight,
} from 'lucide-react';

interface LiveMapProps {
  cars?: LiveCarPosition[];
  circuitKey?: number;
  circuitName?: string;
  selectedDriverNumber?: number | null;
  onSelectDriver?: (driverNumber: number) => void;
  timingRows?: TimingRowWithGainLoss[];
  mode?: 'live' | 'replay';
  liveState?: LiveState;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  onSwitchToReplay?: () => void;
  replayOffsetSec?: number;
}

export const LiveMap: React.FC<LiveMapProps> = ({
  cars: _cars = [],
  circuitKey,
  circuitName = 'Circuit',
  selectedDriverNumber,
  onSelectDriver,
  timingRows = [],
  mode = 'live',
  liveState = 'upcoming',
  loading = false,
  error = null,
  onRetry,
  onSwitchToReplay,
  replayOffsetSec = 0,
}) => {
  const { lang } = useNavigationStore();
  const isVi = lang === 'vi';

  const [hoveredDriver, setHoveredDriver] = useState<number | null>(null);
  const [selectedCorner, setSelectedCorner] = useState<TrackReviewPoint | null>(null);

  // SVG Track Path reference for precise mathematical length & point calculation
  const [pathElement, setPathElement] = useState<SVGPathElement | null>(null);
  const [trackLength, setTrackLength] = useState<number>(0);

  // 1. Resolve Circuit Static Geometry
  const circuitId = useMemo(
    () => resolveCircuitId(circuitKey, circuitName),
    [circuitKey, circuitName]
  );
  const circuit = useMemo(
    () => CIRCUITS_DATA[circuitId] || CIRCUITS_DATA['albert-park'],
    [circuitId]
  );
  const reviewPoints = useMemo(
    () => getCircuitReviewPoints(circuit.id),
    [circuit.id]
  );

  // Reset selected corner when circuit changes
  useEffect(() => {
    setSelectedCorner(null);
  }, [circuit.id]);

  // Compute track length once SVG path mounts or changes
  useEffect(() => {
    if (pathElement) {
      try {
        const len = pathElement.getTotalLength();
        if (len > 0) setTrackLength(len);
      } catch {
        // fallback
      }
    }
  }, [circuit.svgPath, pathElement]);

  // 2. Compute 20 Car Positions along the circuit's static SVG track
  // Guaranteed to stay 100% on the racing line, turning corners naturally at 60 FPS
  const svgCars = useMemo(() => {
    if (timingRows.length === 0 || trackLength === 0 || !pathElement) {
      return [];
    }

    // Typical F1 lap time in seconds for progression calculation (~85s)
    const LAP_DURATION_SEC = 85;
    const baseProgress = (replayOffsetSec / LAP_DURATION_SEC) % 1;

    return timingRows.map((row, idx) => {
      // Leader is at base progress, trailing cars are staggered behind by their position & gap
      const staggerDelta = (idx * 0.046) % 1;
      const progress = (baseProgress - staggerDelta + 10) % 1;
      const distance = (progress * trackLength) % trackLength;

      let point = { x: 250, y: 180 };
      try {
        point = pathElement.getPointAtLength(distance);
      } catch {
        // fallback
      }

      // Lateral offset for cars close together so they don't completely overlap
      const lateralShift = (idx % 2 === 0 ? 1 : -1) * 2;

      return {
        driver_number: row.driver_number,
        cx: point.x + lateralShift,
        cy: point.y + lateralShift,
        teamColour: row.team_colour || '#dc0000',
        acronym: row.name_acronym || `#${row.driver_number}`,
        broadcast_name: row.broadcast_name,
        team_name: row.team_name,
        position: row.position,
        gap_to_leader: row.gap_to_leader,
        tyre: row.tyre,
        telemetry: row.telemetry,
      };
    });
  }, [timingRows, trackLength, replayOffsetSec, pathElement]);

  // Active highlighted car (either hovered or clicked)
  const activeCarNumber = hoveredDriver ?? selectedDriverNumber;
  const activeCar = svgCars.find((c) => c.driver_number === activeCarNumber);

  // Is race currently not started yet in Live mode?
  const isUpcomingLive = mode === 'live' && liveState === 'upcoming';

  return (
    <div className="relative w-full h-[450px] sm:h-[540px] lg:h-[600px] bg-[#06070a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col select-none">
      {/* ── Background Aesthetics: Subtle Grid & Deep Radial Glow ── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.2) 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 50%, rgba(225,6,0,0.06) 0%, rgba(13,16,28,0.4) 45%, rgba(6,7,10,0.95) 100%)',
        }}
      />

      {/* ── Top Map Header Bar ── */}
      <div className="absolute top-3 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Circuit Name Badge */}
          <div className="px-3 py-1.5 rounded-xl bg-black/70 backdrop-blur-md border border-white/10 text-xs font-bold text-white flex items-center gap-2 shadow-lg">
            <Compass className="w-3.5 h-3.5 text-f1red" />
            <span className="uppercase tracking-wider font-display font-black">
              {circuit.circuitName}
            </span>
          </div>

          {/* Mode Pill Badge */}
          <div
            className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border backdrop-blur-md ${
              mode === 'live'
                ? 'bg-red-500/15 border-red-500/30 text-red-400'
                : 'bg-amber-500/15 border-amber-500/30 text-amber-400'
            }`}
          >
            {mode === 'live'
              ? isUpcomingLive
                ? isVi
                  ? 'CHƯA DIỄN RA'
                  : 'UPCOMING'
                : 'LIVE'
              : isVi
              ? 'MÔ PHỎNG'
              : 'REPLAY'}
          </div>
        </div>

        {/* Status Indicator */}
        <div className="pointer-events-auto flex items-center gap-2">
          <span className="text-[10px] font-mono text-studio-300 bg-black/60 px-2.5 py-1 rounded-lg border border-white/10 backdrop-blur-md">
            {svgCars.length > 0 ? `${svgCars.length} CARS · 60 FPS` : 'TRACK READY'}
          </span>
        </div>
      </div>

      {/* ── SVG Circuit Canvas ── */}
      <div className="relative flex-1 w-full h-full flex items-center justify-center p-2 sm:p-4">
        <svg
          viewBox={circuit.viewBox || '0 0 500 360'}
          className={`w-full h-full object-contain filter drop-shadow-[0_0_24px_rgba(0,0,0,0.9)] transition-opacity duration-300 ${
            loading ? 'opacity-40 animate-pulse' : 'opacity-100'
          }`}
        >
          {/* ── Layer 1: Ambient Red Glow ── */}
          <path
            d={circuit.svgPath}
            fill="none"
            stroke="#ff1801"
            strokeWidth="24"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="opacity-20 blur-xs"
          />

          {/* ── Layer 2: High-Contrast White Kerb Ribbon ── */}
          <path
            d={circuit.svgPath}
            fill="none"
            stroke="#ffffff"
            strokeWidth="15"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="opacity-90"
          />

          {/* ── Layer 3: Dark Asphalt Track Bed ── */}
          <path
            d={circuit.svgPath}
            fill="none"
            stroke="#121520"
            strokeWidth="11"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* ── Layer 4: Neon F1 Red Racing Line ── */}
          <path
            ref={setPathElement}
            id="circuit-track-line"
            d={circuit.svgPath}
            fill="none"
            stroke="#ff1801"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="opacity-85"
          />

          {/* ── Layer 5: DRS Zones Highlights (Green on Track) ── */}
          {trackLength > 0 &&
            circuit.drsZones &&
            circuit.drsZones.map((drs, idx) => {
              // Position each DRS zone along the track path length
              const segmentLen = trackLength * 0.12; // ~12% of lap
              const offset = (idx * (trackLength / (circuit.drsZones.length || 1))) % trackLength;

              return (
                <g key={`drs-zone-${drs.id}`}>
                  <path
                    d={circuit.svgPath}
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="9"
                    strokeLinecap="round"
                    strokeDasharray={`${segmentLen} ${trackLength}`}
                    strokeDashoffset={-offset}
                    className="opacity-90 filter drop-shadow-[0_0_6px_rgba(34,197,94,0.8)]"
                  />
                </g>
              );
            })}

          {/* ── Layer 6: Start / Finish Line (Chequered Pattern) ── */}
          {circuit.startFinish && (
            <g transform={`translate(${circuit.startFinish.x}, ${circuit.startFinish.y})`}>
              {/* Chequered crossline */}
              <line
                x1="-10"
                y1="0"
                x2="10"
                y2="0"
                stroke="#ffffff"
                strokeWidth="5"
                strokeDasharray="3 3"
                transform={`rotate(${circuit.startFinish.angleDeg || 0})`}
                className="filter drop-shadow-sm"
              />
              {/* Outer pulsing ring */}
              <circle r="12" fill="none" stroke="#ff1801" strokeWidth="2" className="animate-ping opacity-60" />
              <circle r="7" fill="#ffffff" stroke="#ff1801" strokeWidth="2.5" />
            </g>
          )}

          {/* ── Layer 7: Apex Turn Numbers (Clickable) ── */}
          {reviewPoints.map((pt) => {
            if (!pt.turnNumber || !pt.svgPoint) return null;
            const isCornerActive = selectedCorner?.id === pt.id;

            return (
              <g
                key={pt.id}
                transform={`translate(${pt.svgPoint.x}, ${pt.svgPoint.y})`}
                onClick={() => setSelectedCorner(isCornerActive ? null : pt)}
                className="cursor-pointer group"
              >
                {/* Outer highlight if active */}
                {isCornerActive && (
                  <circle
                    r="15"
                    fill="none"
                    stroke="#ff1801"
                    strokeWidth="2"
                    className="animate-pulse"
                  />
                )}
                {/* Node circle */}
                <circle
                  r="9"
                  fill="#0b0e17"
                  stroke={isCornerActive ? '#ffffff' : '#ff1801'}
                  strokeWidth="1.5"
                  className="transition-all group-hover:scale-110 filter drop-shadow-md"
                />
                {/* Turn number text */}
                <text
                  textAnchor="middle"
                  dy={3}
                  fontSize="8px"
                  fontWeight="900"
                  fill="#ffffff"
                  fontFamily="system-ui, sans-serif"
                  pointerEvents="none"
                >
                  {pt.turnNumber}
                </text>
              </g>
            );
          })}

          {/* ── Layer 8: Cars Rendered with Team Colors & Numbers ── */}
          {svgCars.map((car) => {
            const isSelected = car.driver_number === selectedDriverNumber;
            const isHovered = car.driver_number === hoveredDriver;
            const isLeader = car.position === 1;

            return (
              <g
                key={car.driver_number}
                className="cursor-pointer transition-transform duration-75"
                transform={`translate(${car.cx}, ${car.cy})`}
                onClick={() => onSelectDriver?.(car.driver_number)}
                onMouseEnter={() => setHoveredDriver(car.driver_number)}
                onMouseLeave={() => setHoveredDriver(null)}
              >
                {/* Leader Yellow Glowing Aura */}
                {isLeader && (
                  <circle
                    r="18"
                    fill="none"
                    stroke="#eab308"
                    strokeWidth="2.5"
                    opacity="0.8"
                    className="animate-pulse filter drop-shadow-[0_0_8px_rgba(234,179,8,0.9)]"
                  />
                )}

                {/* Selected Driver White Glowing Aura */}
                {isSelected && (
                  <circle
                    r="17"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="2.5"
                    opacity="0.95"
                    className="animate-pulse filter drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]"
                  />
                )}

                {/* Hover Glow */}
                {isHovered && !isSelected && !isLeader && (
                  <circle
                    r="15"
                    fill="none"
                    stroke={car.teamColour}
                    strokeWidth="2"
                    opacity="0.7"
                  />
                )}

                {/* Car Main Dot */}
                <circle
                  r={isSelected || isHovered ? 10 : 8}
                  fill={car.teamColour}
                  stroke="#ffffff"
                  strokeWidth={isSelected || isLeader ? 2 : 1.5}
                  className="filter drop-shadow-md"
                />

                {/* Driver Number inside car dot */}
                <text
                  textAnchor="middle"
                  dy={2.8}
                  fontSize={isSelected || isHovered ? '7.5px' : '6.5px'}
                  fontWeight="900"
                  fill="#ffffff"
                  fontFamily="system-ui, sans-serif"
                  pointerEvents="none"
                >
                  {car.driver_number}
                </text>

                {/* Driver Tag (above car for leader or selected) */}
                {(isSelected || isHovered || isLeader) && (
                  <g transform="translate(0, -14)" pointerEvents="none">
                    <rect
                      x={-22}
                      y={-12}
                      width={44}
                      height={12}
                      rx={3}
                      fill="#0b0b14"
                      stroke={isLeader ? '#eab308' : isSelected ? '#ffffff' : car.teamColour}
                      strokeWidth={1}
                      opacity={0.95}
                    />
                    <text
                      textAnchor="middle"
                      dy={-3.5}
                      fontSize="7px"
                      fontWeight="bold"
                      fill="#ffffff"
                      fontFamily="monospace"
                    >
                      {car.acronym} {isLeader ? '👑' : `P${car.position}`}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>

        {/* ── State 1: Loading Overlay ── */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-xs z-30 pointer-events-none">
            <div className="px-5 py-3 rounded-2xl bg-studio-950/90 border border-white/15 shadow-2xl flex items-center gap-3">
              <div className="w-4 h-4 border-2 border-f1red border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-bold text-white tracking-wide">
                {isVi ? 'Đang tải dữ liệu đường đua…' : 'Loading track telemetry…'}
              </span>
            </div>
          </div>
        )}

        {/* ── State 2: Mode TRỰC TIẾP Session Chưa Diễn Ra ── */}
        {isUpcomingLive && !loading && (
          <div className="absolute inset-0 flex items-center justify-center p-4 z-20 pointer-events-none">
            <div className="pointer-events-auto max-w-md w-full bg-studio-950/90 backdrop-blur-md border border-white/15 p-5 rounded-2xl shadow-2xl text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-black text-base text-white uppercase tracking-wide">
                  {isVi ? 'Chặng Đua Chưa Bắt Đầu' : 'Session Has Not Started Yet'}
                </h3>
                <p className="text-xs text-studio-400 mt-1 leading-relaxed">
                  {isVi
                    ? 'Singapore Grand Prix 2026 đang đếm ngược đến giờ khai mạc. Bạn có muốn xem lại các chặng đua qua chế độ mô phỏng?'
                    : 'Singapore Grand Prix 2026 is scheduled to start soon. Would you like to review historical races in Simulation Mode?'}
                </p>
              </div>

              {onSwitchToReplay && (
                <button
                  type="button"
                  onClick={onSwitchToReplay}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-amber-500/20 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{isVi ? 'Xem Mô Phỏng Ngay' : 'Switch to Simulation'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* ── State 3: Error State Overlay ── */}
        {error && !loading && (
          <div className="absolute inset-0 flex items-center justify-center p-4 z-20 pointer-events-none">
            <div className="pointer-events-auto max-w-sm w-full bg-studio-950/90 backdrop-blur-md border border-red-500/30 p-5 rounded-2xl shadow-2xl text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-red-500/20 border border-red-500/40 text-red-400 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-black text-sm text-white uppercase">
                  {isVi ? 'Không kết nối được OpenF1' : 'Failed to connect to OpenF1'}
                </h3>
                <p className="text-xs text-studio-400 mt-1">{error}</p>
              </div>
              {onRetry && (
                <button
                  type="button"
                  onClick={onRetry}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>{isVi ? 'Thử lại' : 'Retry'}</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* ── Corner Review Panel Overlay (When Corner is Clicked) ── */}
        {selectedCorner && (
          <div className="absolute top-14 right-4 z-30 max-w-xs w-full bg-studio-950/95 backdrop-blur-md border border-f1red/50 p-4 rounded-xl shadow-2xl text-white animate-fade-in select-none">
            <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-f1red text-white flex items-center justify-center text-[10px] font-black">
                  {selectedCorner.turnNumber}
                </span>
                <span className="font-display font-black text-xs uppercase text-white truncate">
                  {isVi ? selectedCorner.nameVi : selectedCorner.nameEn}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCorner(null)}
                className="p-1 rounded-md text-studio-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Corner Telemetry Parameters */}
            <div className="grid grid-cols-2 gap-2 text-xs mb-2.5">
              <div className="bg-white/5 p-2 rounded-lg">
                <span className="text-[10px] uppercase font-bold text-studio-400 flex items-center gap-1">
                  <Gauge className="w-3 h-3 text-cyan-400" /> {isVi ? 'Tốc độ đỉnh' : 'Apex Speed'}
                </span>
                <span className="font-mono text-sm font-black text-white block mt-0.5">
                  {selectedCorner.telemetry.speedKmh}{' '}
                  <span className="text-[10px] font-normal text-studio-400">km/h</span>
                </span>
              </div>

              <div className="bg-white/5 p-2 rounded-lg">
                <span className="text-[10px] uppercase font-bold text-studio-400 flex items-center gap-1">
                  <Zap className="w-3 h-3 text-amber-400" /> {isVi ? 'Cấp số & Lực G' : 'Gear & G'}
                </span>
                <span className="font-mono text-sm font-black text-white block mt-0.5">
                  G{selectedCorner.telemetry.gear} · {selectedCorner.telemetry.gForceLateral}G
                </span>
              </div>
            </div>

            {/* Driving Tip */}
            <p className="text-[11px] text-studio-300 leading-relaxed italic border-l-2 border-f1red/60 pl-2">
              {isVi ? selectedCorner.racingTipVi : selectedCorner.racingTipEn}
            </p>
          </div>
        )}

        {/* ── Active Car Telemetry Card (Bottom-Left) ── */}
        {activeCar && (
          <div className="absolute bottom-4 left-4 z-20 bg-studio-950/90 backdrop-blur-md border border-white/15 p-3.5 rounded-xl shadow-2xl text-white min-w-[210px] animate-fade-in pointer-events-none select-none">
            <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2">
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full shadow-sm"
                  style={{ backgroundColor: activeCar.teamColour }}
                />
                <span className="font-display font-black text-sm uppercase">
                  {activeCar.acronym} #{activeCar.driver_number}
                </span>
              </div>
              <span className="px-2 py-0.5 rounded bg-white/10 font-mono text-xs font-bold text-amber-400">
                P{activeCar.position}
              </span>
            </div>

            <div className="text-[11px] text-studio-400 truncate mb-2">
              {activeCar.broadcast_name} · {activeCar.team_name}
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-white/5 p-2 rounded-lg">
                <span className="text-[10px] uppercase font-bold text-studio-400 flex items-center gap-1">
                  <Gauge className="w-3 h-3 text-cyan-400" /> {isVi ? 'Tốc độ' : 'Speed'}
                </span>
                <span className="font-mono text-sm font-black text-white block mt-0.5">
                  {Math.round(activeCar.telemetry?.speed || 290)}{' '}
                  <span className="text-[10px] font-normal text-studio-400">km/h</span>
                </span>
              </div>

              <div className="bg-white/5 p-2 rounded-lg">
                <span className="text-[10px] uppercase font-bold text-studio-400 flex items-center gap-1">
                  <Zap className="w-3 h-3 text-amber-400" /> DRS
                </span>
                <div className="flex items-center justify-between mt-0.5">
                  <span className="font-mono text-sm font-black text-white">
                    G{activeCar.telemetry?.gear || 7}
                  </span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase ${
                      activeCar.telemetry?.drs
                        ? 'bg-emerald-500 text-black animate-pulse'
                        : 'bg-white/10 text-studio-400'
                    }`}
                  >
                    DRS
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
