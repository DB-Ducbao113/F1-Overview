import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, RefreshCw, Calendar, MapPin, Radio, Film } from 'lucide-react';
import { LiveState, OpenF1SessionRaw } from '../../lib/live/openf1-types';
import { useNavigationStore } from '../../store/useNavigationStore';
import {
  SIMULATION_RACES,
  SimulationRaceConfig,
  getSimulationRace,
} from '../../data/live/simulationRaces';
import { scheduleWallClockSecondTick, tabSync } from '../../lib/live/tabSync';

export type LiveCenterMode = 'live' | 'replay';

interface SessionBannerProps {
  mode: LiveCenterMode;
  onModeChange: (mode: LiveCenterMode) => void;
  // Live mode
  liveState: LiveState;
  liveSession: OpenF1SessionRaw | null;
  onRefreshLive: () => void;
  // Replay mode
  selectedReplayRaceId: string;
  onSelectReplayRace: (race: SimulationRaceConfig) => void;
  replayOffsetSec: number;
  onReplayOffsetChange: (offsetSec: number) => void;
  isReplayPlaying: boolean;
  onToggleReplayPlay: () => void;
  replaySpeed: number;
  onReplaySpeedChange: (speed: number) => void;
}

export const SessionBanner: React.FC<SessionBannerProps> = ({
  mode,
  onModeChange,
  liveState,
  liveSession,
  onRefreshLive,
  selectedReplayRaceId,
  onSelectReplayRace,
  replayOffsetSec,
  onReplayOffsetChange,
  isReplayPlaying,
  onToggleReplayPlay,
  replaySpeed,
  onReplaySpeedChange,
}) => {
  const { lang } = useNavigationStore();
  const isVi = lang === 'vi';
  const [countdown, setCountdown] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const selectedRace = getSimulationRace(selectedReplayRaceId);

  // Compute countdown timer strictly for live upcoming session
  useEffect(() => {
    if (liveState !== 'upcoming' || !liveSession?.date_start) {
      setCountdown('');
      return;
    }

    const updateCountdown = () => {
      const now = Date.now();
      const start = new Date(liveSession.date_start).getTime();
      const diff = start - now;

      if (diff <= 0) {
        setCountdown(isVi ? 'Sắp khai mạc' : 'Starting momentarily');
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      const parts = [];
      if (days > 0) parts.push(`${days.toString().padStart(2, '0')}d`);
      parts.push(`${hours.toString().padStart(2, '0')}h`);
      parts.push(`${minutes.toString().padStart(2, '0')}m`);
      parts.push(`${seconds.toString().padStart(2, '0')}s`);

      setCountdown(parts.join(' '));
    };

    const cleanupTick = scheduleWallClockSecondTick(updateCountdown);

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        updateCountdown();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    const unsub = tabSync.subscribe('countdown_sync', () => {
      updateCountdown();
    });

    return () => {
      cleanupTick();
      document.removeEventListener('visibilitychange', handleVisibility);
      unsub();
    };
  }, [liveState, liveSession?.date_start, isVi]);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await onRefreshLive();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const formatOffsetTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${mins}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full bg-[#0a0a0f] border border-white/10 rounded-2xl p-4 sm:p-5 shadow-2xl relative overflow-hidden select-none">
      {/* Background glow banner accent */}
      <div
        className="absolute top-0 right-0 w-96 h-48 pointer-events-none opacity-20 blur-3xl"
        style={{
          background:
            mode === 'live'
              ? 'radial-gradient(circle, rgba(239,68,68,0.4) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(245,158,11,0.4) 0%, transparent 70%)',
        }}
      />

      {/* Top Segmented Mode Selector & Session Header */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 relative z-10">
        {/* Left Section: Segmented Control & Title */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
          {/* Segmented Control [ ● Trực tiếp | ○ Mô phỏng ] */}
          <div className="inline-flex items-center p-1 rounded-xl bg-black/60 border border-white/10 shrink-0">
            <button
              type="button"
              onClick={() => onModeChange('live')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-black tracking-wider uppercase transition-all cursor-pointer ${
                mode === 'live'
                  ? 'bg-f1red text-white shadow-[0_0_12px_rgba(225,6,0,0.5)]'
                  : 'text-studio-400 hover:text-white'
              }`}
            >
              <Radio className={`w-3.5 h-3.5 ${mode === 'live' ? 'animate-pulse' : ''}`} />
              <span>{isVi ? 'Trực tiếp' : 'Live'}</span>
            </button>

            <button
              type="button"
              onClick={() => onModeChange('replay')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-black tracking-wider uppercase transition-all cursor-pointer ${
                mode === 'replay'
                  ? 'bg-amber-500 text-black shadow-[0_0_12px_rgba(245,158,11,0.5)]'
                  : 'text-studio-400 hover:text-white'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span>{isVi ? 'Mô phỏng' : 'Simulation'}</span>
            </button>
          </div>

          {/* Mode-Specific Status & Details */}
          {mode === 'live' ? (
            /* ── Mode TRỰC TIẾP (Singapore GP or active Grand Prix) ── */
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl">🇸🇬</span>
                <h2 className="font-display text-lg sm:text-xl font-black uppercase text-white tracking-wide">
                  {liveSession?.session_name
                    ? `${liveSession.session_name} · Marina Bay`
                    : 'Singapore Grand Prix · Marina Bay'}
                </h2>
                {liveState === 'live' && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-500/20 border border-red-500/50 text-red-400 text-[10px] font-black tracking-widest uppercase animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                    LIVE
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-studio-400 font-medium mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-f1red shrink-0" />
                <span>Marina Bay Street Circuit, Singapore</span>
                <span className="text-studio-600">·</span>
                <span className="text-studio-300">
                  {liveSession?.year || 2026} FIA Formula 1 World Championship
                </span>
              </div>
            </div>
          ) : (
            /* ── Mode MÔ PHỎNG (Replay Archive) ── */
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-400 text-xs font-black tracking-wider uppercase">
                  <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
                  <span>
                    {isVi ? 'MÔ PHỎNG · DỮ LIỆU LỊCH SỬ' : 'SIMULATION · HISTORICAL DATA'}
                  </span>
                </div>

                {/* Race Picker Dropdown */}
                <select
                  value={selectedReplayRaceId}
                  onChange={(e) => {
                    const r = SIMULATION_RACES.find((item) => item.id === e.target.value);
                    if (r) onSelectReplayRace(r);
                  }}
                  className="bg-white/10 border border-amber-500/40 text-white text-xs font-bold rounded-xl px-3 py-1.5 outline-none focus:border-amber-400 transition-colors cursor-pointer"
                >
                  {SIMULATION_RACES.map((race) => (
                    <option key={race.id} value={race.id} className="bg-studio-900 text-white">
                      {race.flag} {race.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 text-xs text-studio-400 font-medium mt-1">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{selectedRace.circuitName}</span>
                <span className="text-studio-600">·</span>
                <span className="text-studio-300">{selectedRace.year} Formula 1 Season</span>
              </div>
            </div>
          )}
        </div>

        {/* Right Section: Countdown (Live) OR Refresh */}
        <div className="flex items-center gap-3 shrink-0">
          {mode === 'live' && liveState === 'upcoming' && countdown && (
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-xl shadow-inner">
              <span className="text-[10px] uppercase font-bold text-studio-400 tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                {isVi ? 'Bắt đầu sau:' : 'Starts in:'}
              </span>
              <span className="font-mono text-base font-black text-amber-400 tracking-wider">
                {countdown}
              </span>
            </div>
          )}

          {mode === 'live' && (
            <button
              onClick={handleManualRefresh}
              title={isVi ? 'Cập nhật trạng thái' : 'Refresh session state'}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/15 text-studio-300 hover:text-white border border-white/10 transition-all cursor-pointer"
            >
              <RefreshCw
                className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`}
              />
            </button>
          )}
        </div>
      </div>

      {/* Mode MÔ PHỎNG: Playback & Timeline Scrubber Bar */}
      {mode === 'replay' && (
        <div className="mt-4 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center gap-4 relative z-10">
          <div className="flex items-center gap-2 shrink-0">
            {/* Play / Pause Toggle */}
            <button
              onClick={onToggleReplayPlay}
              className="p-2 rounded-lg bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 border border-amber-500/40 transition-all cursor-pointer flex items-center gap-1.5 font-bold text-xs"
              title={isReplayPlaying ? 'Tạm dừng mô phỏng' : 'Phát mô phỏng'}
            >
              {isReplayPlaying ? (
                <Pause className="w-3.5 h-3.5" />
              ) : (
                <Play className="w-3.5 h-3.5" />
              )}
              <span>{isReplayPlaying ? (isVi ? 'Dừng' : 'Pause') : isVi ? 'Phát' : 'Play'}</span>
            </button>

            {/* Reset to Start */}
            <button
              onClick={() => onReplayOffsetChange(0)}
              className="p-2 rounded-lg bg-white/5 text-studio-400 hover:text-white hover:bg-white/10 border border-white/10 transition-all cursor-pointer"
              title={isVi ? 'Quay về đầu chặng đua' : 'Reset to Start'}
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Playback Speed Multipliers */}
            <div className="flex items-center gap-1 bg-white/5 p-1 rounded-lg border border-white/10">
              {[1, 2, 4].map((spd) => (
                <button
                  key={spd}
                  onClick={() => onReplaySpeedChange(spd)}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors cursor-pointer ${
                    replaySpeed === spd
                      ? 'bg-amber-500 text-black font-black'
                      : 'text-studio-400 hover:text-white'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>

          {/* Timeline Slider with Clear Label */}
          <div className="flex-1 w-full flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-bold text-amber-400 shrink-0 min-w-[42px]">
                {formatOffsetTime(replayOffsetSec)}
              </span>
              <input
                type="range"
                min={0}
                max={1800} // 30-minute race segment
                step={2}
                value={replayOffsetSec}
                onChange={(e) => onReplayOffsetChange(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer h-1.5 bg-white/15 rounded-lg"
              />
              <span className="font-mono text-xs text-studio-500 shrink-0">30:00</span>
            </div>
            <div className="text-[10px] font-medium text-studio-400 text-right pr-1">
              {isVi ? 'Phút 0–30 của chặng đua' : 'Minutes 0–30 of the race'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
