import { useState, useEffect, useRef } from 'react';
import { LiveCarPosition, LiveTrackResponse } from '../../lib/live/openf1-types';
import { interpolateFleet } from '../../lib/live/interpolate';

export function useLiveTrack(
  sessionKey: number | null | undefined,
  enabled: boolean = true,
  at?: string,
) {
  const [cars, setCars] = useState<LiveCarPosition[]>([]);
  const [sampledAt, setSampledAt] = useState<string>('');
  const [isReplay, setIsReplay] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const prevMapRef = useRef<Record<number, LiveCarPosition>>({});
  const targetMapRef = useRef<Record<number, LiveCarPosition>>({});
  const lastPollTimeRef = useRef<number>(0);
  const rafRef = useRef<number>(0);

  // 1. Poll proxy every 2000ms
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

        const res = await fetch(`/api/live/track?${queryParams.toString()}`);
        if (!res.ok) return;

        const data: LiveTrackResponse = await res.json();
        if (!isSubscribed) return;

        const now = performance.now();
        lastPollTimeRef.current = now;
        setSampledAt(data.sampled_at);
        setIsReplay(data.is_replay);

        // Update target positions while preserving previous positions for Lerp
        const newTargetMap: Record<number, LiveCarPosition> = {};
        for (const car of data.cars) {
          newTargetMap[car.driver_number] = car;
          // Set prev to current target position or initial position
          prevMapRef.current[car.driver_number] = targetMapRef.current[car.driver_number] ?? {
            ...car,
          };
        }
        targetMapRef.current = newTargetMap;
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

  // 2. Interpolate fleet at 60 FPS between polls
  useEffect(() => {
    if (!enabled) return;

    const tick = () => {
      const elapsed = performance.now() - lastPollTimeRef.current;
      // t scales from 0 to 1 over the 2000ms poll window
      const t = Math.min(1, elapsed / 2000);

      const fleet = interpolateFleet(prevMapRef.current, targetMapRef.current, t);
      if (fleet.length > 0) {
        setCars(fleet);
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, [enabled]);

  return {
    cars,
    sampledAt,
    isReplay,
    loading,
  };
}
