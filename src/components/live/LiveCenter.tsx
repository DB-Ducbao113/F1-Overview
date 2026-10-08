import React, { useState, useEffect, useMemo } from 'react';
import { useLiveSession } from '../../hooks/live/useLiveSession';
import { useLiveTrack } from '../../hooks/live/useLiveTrack';
import { useLiveTiming, TimingRowWithGainLoss } from '../../hooks/live/useLiveTiming';
import { useLiveControl } from '../../hooks/live/useLiveControl';
import { SessionBanner, LiveCenterMode } from './SessionBanner';
import { LiveMap } from './LiveMap';
import { TimingTower } from './TimingTower';
import { RaceControlFeed } from './RaceControlFeed';
import { LiveCreditBadge } from './LiveCreditBadge';
import {
  SimulationRaceConfig,
  getSimulationRace,
} from '../../data/live/simulationRaces';
import { useNavigationStore } from '../../store/useNavigationStore';

export const LiveCenter: React.FC = () => {
  const { lang } = useNavigationStore();
  const isVi = lang === 'vi';

  // 1. Mode System: 'live' (Default) or 'replay' (Simulation)
  const [mode, setMode] = useState<LiveCenterMode>('live');

  // 2. Real-World Live / Upcoming Session
  const { data: sessionData, refresh: refreshSession, loading: sessionLoading } = useLiveSession();

  // 3. Replay Simulation State
  const [selectedReplayRaceId, setSelectedReplayRaceId] = useState<string>('melbourne-2024');
  const [replayOffsetSec, setReplayOffsetSec] = useState<number>(0);
  const [isReplayPlaying, setIsReplayPlaying] = useState<boolean>(true);
  const [replaySpeed, setReplaySpeed] = useState<number>(1);
  const [isSwitchingRace, setIsSwitchingRace] = useState<boolean>(false);

  // Selected driver for synchronized highlight on Map & Timing Tower
  const [selectedDriverNumber, setSelectedDriverNumber] = useState<number | null>(null);

  const selectedReplayRace: SimulationRaceConfig = useMemo(
    () => getSimulationRace(selectedReplayRaceId),
    [selectedReplayRaceId]
  );

  // Advance replay slider timer when playing
  useEffect(() => {
    if (mode !== 'replay' || !isReplayPlaying) return;

    const interval = window.setInterval(() => {
      setReplayOffsetSec((prev) => {
        const next = prev + 2 * replaySpeed;
        return next > 1800 ? 0 : next;
      });
    }, 2000);

    return () => window.clearInterval(interval);
  }, [mode, isReplayPlaying, replaySpeed]);

  // Compute 'at' ISO timestamp for live track hook if querying OpenF1
  const replayAtTimestamp = useMemo(() => {
    if (mode !== 'replay') return undefined;
    const baseDate = new Date(selectedReplayRace.sampleStartTime);
    const offsetMs = replayOffsetSec * 1000;
    return new Date(baseDate.getTime() + offsetMs).toISOString();
  }, [mode, selectedReplayRace.sampleStartTime, replayOffsetSec]);

  // Active session and circuit identifiers based strictly on mode
  const activeSessionKey =
    mode === 'live'
      ? sessionData?.session?.session_key
      : selectedReplayRace.sessionKey;

  const activeCircuitKey =
    mode === 'live'
      ? sessionData?.session?.circuit_key || 61 // 61 is Singapore
      : selectedReplayRace.circuitKey;

  const activeCircuitName =
    mode === 'live'
      ? sessionData?.session?.circuit_short_name || 'Marina Bay'
      : selectedReplayRace.circuitName;

  // 4. Telemetry & Track Hooks
  const { sampledAt: trackSampledAt } = useLiveTrack(
    activeSessionKey,
    mode === 'live' ? sessionData?.state === 'live' : false,
    replayAtTimestamp
  );

  const { tower: openF1Tower, fastestLap: openF1FastestLap, loading: timingLoading } = useLiveTiming(
    activeSessionKey,
    mode === 'live' ? sessionData?.state === 'live' : false,
    replayAtTimestamp
  );

  const { activeFlag, messages: controlMessages } = useLiveControl(
    activeSessionKey,
    mode === 'live' ? sessionData?.state === 'live' : false
  );

  // 5. Build Resolved Timing Tower Rows
  const resolvedTower: TimingRowWithGainLoss[] = useMemo(() => {
    if (mode === 'live') {
      if (sessionData?.state === 'live') {
        return openF1Tower;
      }
      return [];
    }

    // In Replay mode: use OpenF1 rows if available, else use curated authentic historical race grid
    if (openF1Tower.length > 0) {
      return openF1Tower;
    }

    // Map curated drivers with slight dynamic speed & DRS variations according to replay offset
    return selectedReplayRace.drivers.map((d, idx) => {
      // Dynamic simulated speed curve based on lap section
      const progress = ((replayOffsetSec / 85) + idx * 0.05) % 1;
      const isStraight = progress < 0.25 || (progress > 0.55 && progress < 0.75);
      const isHairpin = progress > 0.4 && progress < 0.5;

      const dynamicSpeed = isStraight
        ? 310 + ((idx * 7 + Math.floor(replayOffsetSec)) % 25)
        : isHairpin
        ? 85 + ((idx * 3) % 20)
        : 220 + ((idx * 5) % 40);

      const dynamicDrs = isStraight && idx > 0;
      const dynamicGear = isStraight ? 8 : isHairpin ? 2 : 6;

      return {
        ...d,
        interval: d.position === 1 ? null : '+0.500',
        best_lap: '1:20.142',
        last_lap: '1:21.050',
        in_pit: Boolean(d.in_pit),
        sectors: ['28.1', '29.4', '22.8'],
        telemetry: {
          speed: d.in_pit ? 0 : dynamicSpeed,
          gear: d.in_pit ? 0 : dynamicGear,
          drs: dynamicDrs,
        },
      };
    });
  }, [mode, sessionData?.state, openF1Tower, selectedReplayRace.drivers, replayOffsetSec]);

  // Fastest lap resolution
  const resolvedFastestLap =
    mode === 'live' ? openF1FastestLap : selectedReplayRace.fastestLap;

  // Handle switching replay race with a brief skeleton loading phase
  const handleSelectReplayRace = (race: SimulationRaceConfig) => {
    setIsSwitchingRace(true);
    setSelectedReplayRaceId(race.id);
    setReplayOffsetSec(0);
    setTimeout(() => {
      setIsSwitchingRace(false);
    }, 450);
  };

  const isMapOrTowerLoading =
    mode === 'live'
      ? sessionLoading || (sessionData?.state === 'live' && timingLoading)
      : isSwitchingRace;

  return (
    <div className="bg-[#050508] min-h-screen text-white pt-6 pb-16 animate-fade-in select-none">
      <div className="page-container space-y-6">
        {/* Top Session Banner with Mode Segmented Control */}
        <SessionBanner
          mode={mode}
          onModeChange={setMode}
          liveState={sessionData?.state || 'upcoming'}
          liveSession={
            sessionData?.session || {
              session_key: 11378,
              session_name: 'Practice 1',
              meeting_key: 1245,
              circuit_key: 61,
              circuit_short_name: 'Marina Bay',
              country_name: 'Singapore',
              country_code: 'SGP',
              location: 'Marina Bay',
              date_start: '2026-10-09T09:30:00.000Z',
              date_end: '2026-10-09T10:30:00.000Z',
              gmt_offset: '+08:00',
              year: 2026,
            }
          }
          onRefreshLive={refreshSession}
          selectedReplayRaceId={selectedReplayRaceId}
          onSelectReplayRace={handleSelectReplayRace}
          replayOffsetSec={replayOffsetSec}
          onReplayOffsetChange={setReplayOffsetSec}
          isReplayPlaying={isReplayPlaying}
          onToggleReplayPlay={() => setIsReplayPlaying((prev) => !prev)}
          replaySpeed={replaySpeed}
          onReplaySpeedChange={setReplaySpeed}
        />

        {/* Main 2-Column Responsive Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (8 cols): Interactive Track Map & Race Control */}
          <div className="lg:col-span-8 space-y-6">
            <LiveMap
              circuitKey={activeCircuitKey}
              circuitName={activeCircuitName}
              mode={mode}
              liveState={sessionData?.state || 'upcoming'}
              loading={isMapOrTowerLoading}
              selectedDriverNumber={selectedDriverNumber}
              onSelectDriver={(num) =>
                setSelectedDriverNumber(selectedDriverNumber === num ? null : num)
              }
              timingRows={resolvedTower}
              replayOffsetSec={replayOffsetSec}
              onSwitchToReplay={() => setMode('replay')}
            />

            <RaceControlFeed activeFlag={activeFlag} messages={controlMessages} />

            <LiveCreditBadge
              isReplay={mode === 'replay'}
              sampledAt={trackSampledAt || new Date().toISOString()}
            />
          </div>

          {/* Right Column (4 cols): F1 TV Style Timing Tower */}
          <div className="lg:col-span-4">
            <TimingTower
              tower={resolvedTower}
              loading={isMapOrTowerLoading}
              selectedDriverNumber={selectedDriverNumber}
              onSelectDriver={(num) =>
                setSelectedDriverNumber(selectedDriverNumber === num ? null : num)
              }
              fastestLap={resolvedFastestLap}
              emptyMessage={
                mode === 'live' && sessionData?.state === 'upcoming'
                  ? isVi
                    ? 'Singapore GP chưa bắt đầu — Chuyển sang Mô phỏng để xem xếp hạng'
                    : 'Singapore GP has not started — Switch to Simulation to view timing'
                  : undefined
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};
