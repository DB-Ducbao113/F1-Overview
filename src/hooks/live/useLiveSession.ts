import { useState, useEffect, useCallback, useRef } from 'react';
import { LiveSessionResponse } from '../../lib/live/openf1-types';
import { tabSync } from '../../lib/live/tabSync';

export function useLiveSession() {
  const [data, setData] = useState<LiveSessionResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<any>(null);
  const lastFetchTimeRef = useRef<number>(0);

  const fetchSession = useCallback(async () => {
    try {
      const res = await fetch('/api/live/session');
      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }
      const json: LiveSessionResponse = await res.json();
      setData(json);
      setError(null);
      lastFetchTimeRef.current = Date.now();
      // Broadcast to other tabs so all open tabs sync state instantly
      tabSync.broadcast('live_session_update', json);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch live session');
    } finally {
      setLoading(false);
    }
  }, []);

  // Cross-tab sync subscription & visibilitychange handler
  useEffect(() => {
    const unsub = tabSync.subscribe('live_session_update', (incomingData: LiveSessionResponse) => {
      if (incomingData) {
        setData(incomingData);
        setLoading(false);
        setError(null);
        lastFetchTimeRef.current = Date.now();
      }
    });

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        if (Date.now() - lastFetchTimeRef.current >= 15_000) {
          void fetchSession();
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      unsub();
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [fetchSession]);

  // Adaptive polling: 30s by default, 15s if live or within 15 mins of race start
  useEffect(() => {
    let isSubscribed = true;

    const scheduleNext = () => {
      if (!isSubscribed) return;

      let intervalMs = 30_000;
      if (data?.state === 'live') {
        intervalMs = 15_000;
      } else if (data?.session?.date_start) {
        const timeToStart = new Date(data.session.date_start).getTime() - Date.now();
        if (timeToStart > 0 && timeToStart <= 15 * 60_000) {
          intervalMs = 15_000;
        }
      }

      timerRef.current = setTimeout(async () => {
        if (!isSubscribed) return;
        await fetchSession();
        scheduleNext();
      }, intervalMs);
    };

    fetchSession().then(scheduleNext);

    return () => {
      isSubscribed = false;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [fetchSession, data?.state, data?.session?.date_start]);

  return {
    data,
    loading,
    error,
    refresh: fetchSession,
  };
}
