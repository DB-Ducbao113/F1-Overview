import { useState, useEffect } from 'react';
import {
  FlagColor,
  LiveRaceControlMessage,
  LiveControlResponse,
} from '../../lib/live/openf1-types';

export function useLiveControl(sessionKey: number | null | undefined, enabled: boolean = true) {
  const [activeFlag, setActiveFlag] = useState<FlagColor>('CLEAR');
  const [messages, setMessages] = useState<LiveRaceControlMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!enabled || !sessionKey) {
      setLoading(false);
      return;
    }

    let isSubscribed = true;

    const poll = async () => {
      try {
        const res = await fetch(`/api/live/control?session_key=${sessionKey}`);
        if (!res.ok) return;

        const data: LiveControlResponse = await res.json();
        if (!isSubscribed) return;

        setActiveFlag(data.active_flag || 'CLEAR');
        setMessages(data.messages || []);
        setLoading(false);
      } catch {
        // network error
      }
    };

    poll();
    const intervalId = window.setInterval(poll, 5000);

    return () => {
      isSubscribed = false;
      window.clearInterval(intervalId);
    };
  }, [sessionKey, enabled]);

  return {
    activeFlag,
    messages,
    loading,
  };
}
