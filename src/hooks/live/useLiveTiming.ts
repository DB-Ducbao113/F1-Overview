import { useState, useEffect, useRef } from 'react';
import { LiveTimingRow, LiveTimingResponse } from '../../lib/live/openf1-types';

export interface TimingRowWithGainLoss extends LiveTimingRow {
  gainLoss: number; // positive = gained positions (e.g. +2), negative = lost positions (e.g. -1), 0 = no change
}

export function useLiveTiming(
  sessionKey: number | null | undefined,
  enabled: boolean = true,
  at?: string
) {
  const [tower, setTower] = useState<TimingRowWithGainLoss[]>([]);
  const [fastestLap, setFastestLap] = useState<LiveTimingResponse['fastest_lap'] | undefined>();
  const [sampledAt, setSampledAt] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  // Position history snapshot to calculate Gain/Loss per poll cycle
  const prevPositionsRef = useRef<Record<number, number>>({});

  useEffect(() => {
    if (!enabled || !sessionKey) {
      setLoading(false);
      return;
    }

    let isSubscribed = true;

    const poll = async () => {
      try {
        const queryParams = new URLSearchParams({
          session_key: String(sessionKey),
        });
        if (at) {
          queryParams.set('at', at);
        }

        const res = await fetch(`/api/live/timing?${queryParams.toString()}`);
        if (!res.ok) return;

        const data: LiveTimingResponse = await res.json();
        if (!isSubscribed) return;

        setSampledAt(data.sampled_at);
        setFastestLap(data.fastest_lap);

        // Compute Gain/Loss compared to previous position snapshot
        const newTower: TimingRowWithGainLoss[] = (data.tower || []).map((row) => {
          const prevPos = prevPositionsRef.current[row.driver_number];
          // If was P5, now P3: prevPos (5) - currPos (3) = +2 (gained 2 positions)
          const gainLoss = prevPos !== undefined ? prevPos - row.position : 0;
          return {
            ...row,
            gainLoss,
          };
        });

        // Update the snapshot for the next poll
        const nextPositions: Record<number, number> = {};
        for (const row of data.tower || []) {
          nextPositions[row.driver_number] = row.position;
        }
        prevPositionsRef.current = nextPositions;

        setTower(newTower);
        setLoading(false);
      } catch {
        // network or server busy
      }
    };

    poll();
    const intervalId = window.setInterval(poll, 2000);

    return () => {
      isSubscribed = false;
      window.clearInterval(intervalId);
    };
  }, [sessionKey, enabled, at]);

  return {
    tower,
    fastestLap,
    sampledAt,
    loading,
  };
}
