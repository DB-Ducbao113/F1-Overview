/**
 * Vercel Serverless Function: /api/live/session
 * Identifies active live session, upcoming countdown session, or curated replay session.
 * Caches at CDN level with s-maxage=30, stale-while-revalidate=60.
 */

const OPENF1_BASE = 'https://api.openf1.org/v1';

// In-memory instance cache (shared per serverless instance)
let sessionCache: { at: number; data: any } | null = null;
const TTL_MS = 30_000;

// Official calendar schedule overrides to reconcile OpenF1 provisional/inconsistent offsets
const SESSION_SCHEDULE_OVERRIDES: Record<
  number,
  { date_start: string; date_end: string; session_name?: string }
> = {
  11378: {
    // Singapore GP 2026 FP1: Fri 09 Oct 16:30 SGT (15:30 ICT)
    date_start: '2026-10-09T08:30:00.000Z',
    date_end: '2026-10-09T09:30:00.000Z',
    session_name: 'Practice 1',
  },
  11379: {
    // Sprint Qualifying: Fri 09 Oct 20:30 SGT (19:30 ICT)
    date_start: '2026-10-09T12:30:00.000Z',
    date_end: '2026-10-09T13:14:00.000Z',
    session_name: 'Sprint Qualifying',
  },
  11383: {
    // Sprint: Sat 10 Oct 17:00 SGT (16:00 ICT)
    date_start: '2026-10-10T09:00:00.000Z',
    date_end: '2026-10-10T10:00:00.000Z',
    session_name: 'Sprint',
  },
  11384: {
    // Singapore GP 2026 Qualifying: Sat 10 Oct 21:00 SGT (UTC+8) -> 13:00 UTC
    date_start: '2026-10-10T13:00:00.000Z',
    date_end: '2026-10-10T14:00:00.000Z',
    session_name: 'Qualifying',
  },
  11388: {
    // Singapore GP 2026 Grand Prix Race: Sun 11 Oct 20:00 SGT (UTC+8) -> 12:00 UTC
    date_start: '2026-10-11T12:00:00.000Z',
    date_end: '2026-10-11T14:00:00.000Z',
    session_name: 'Race',
  },
};

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=60');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const now = new Date();
  const nowTs = now.getTime();

  if (sessionCache && nowTs - sessionCache.at < TTL_MS) {
    res.setHeader('X-Cache', 'HIT');
    return res.status(200).json(sessionCache.data);
  }

  try {
    const year = now.getUTCFullYear();
    const r = await fetch(`${OPENF1_BASE}/sessions?year=${year}`);
    let sessions = await r.json().catch(() => []);

    // Fallback to previous year if current year has no sessions yet in OpenF1
    if (!Array.isArray(sessions) || sessions.length === 0) {
      const prevR = await fetch(`${OPENF1_BASE}/sessions?year=${year - 1}`);
      sessions = await prevR.json().catch(() => []);
    }

    if (!Array.isArray(sessions)) {
      sessions = [];
    }

    // Apply official schedule overrides for Singapore GP 2026 to guarantee synchronization
    sessions = sessions.map((s: any) => {
      const override = SESSION_SCHEDULE_OVERRIDES[s.session_key];
      if (override) {
        return {
          ...s,
          date_start: override.date_start,
          date_end: override.date_end,
          session_name: override.session_name || s.session_name,
        };
      }
      return s;
    });

    // 1. Session is "live" if now falls within [date_start - 30m, date_end + 30m]
    const live = sessions.find((s: any) => {
      if (!s.date_start || !s.date_end) return false;
      const start = new Date(s.date_start).getTime() - 30 * 60_000;
      const end = new Date(s.date_end).getTime() + 30 * 60_000;
      return nowTs >= start && nowTs <= end;
    });

    if (live) {
      const payload = {
        state: 'live',
        session: live,
        server_time: now.toISOString(),
      };
      sessionCache = { at: nowTs, data: payload };
      res.setHeader('X-Cache', 'MISS');
      return res.status(200).json(payload);
    }

    // 2. Upcoming session (for countdown)
    const upcoming = sessions
      .filter((s: any) => s.date_start && new Date(s.date_start).getTime() > nowTs)
      .sort((a: any, b: any) => +new Date(a.date_start) - +new Date(b.date_start))[0];

    // 3. Past session (for replay mode)
    const past = [...sessions]
      .filter((s: any) => s.date_end && new Date(s.date_end).getTime() < nowTs)
      .sort((a: any, b: any) => +new Date(b.date_end) - +new Date(a.date_end))[0];

    // Verified default replay session: Australia 2024 Race (session_key 9488, circuit_key 10)
    const defaultReplaySession = {
      session_key: 9488,
      session_name: 'Race',
      meeting_key: 1230,
      circuit_key: 10,
      circuit_short_name: 'Melbourne',
      country_name: 'Australia',
      country_code: 'AUS',
      location: 'Melbourne',
      date_start: '2024-03-24T04:00:00+00:00',
      date_end: '2024-03-24T06:00:00+00:00',
      gmt_offset: '+11:00',
      year: 2024,
    };

    const payload = {
      state: upcoming ? 'upcoming' : 'replay',
      session: upcoming ?? past ?? defaultReplaySession,
      server_time: now.toISOString(),
    };

    sessionCache = { at: nowTs, data: payload };
    res.setHeader('X-Cache', 'MISS');
    return res.status(200).json(payload);
  } catch {
    const isUpcomingSingapore = nowTs < new Date('2026-10-09T08:30:00.000Z').getTime();
    const fallbackPayload = isUpcomingSingapore
      ? {
          state: 'upcoming',
          session: {
            session_key: 11378,
            session_name: 'Practice 1',
            session_type: 'Practice',
            meeting_key: 1296,
            circuit_key: 61,
            circuit_short_name: 'Singapore',
            country_name: 'Singapore',
            country_code: 'SGP',
            location: 'Marina Bay',
            date_start: '2026-10-09T08:30:00.000Z',
            date_end: '2026-10-09T09:30:00.000Z',
            gmt_offset: '08:00:00',
            year: 2026,
          },
          server_time: now.toISOString(),
          is_fallback: true,
        }
      : {
          state: 'replay',
          session: {
            session_key: 9488,
            session_name: 'Race',
            meeting_key: 1230,
            circuit_key: 10,
            circuit_short_name: 'Melbourne',
            country_name: 'Australia',
            country_code: 'AUS',
            location: 'Melbourne',
            date_start: '2024-03-24T04:00:00+00:00',
            date_end: '2024-03-24T06:00:00+00:00',
            gmt_offset: '+11:00',
            year: 2024,
          },
          server_time: now.toISOString(),
          is_fallback: true,
        };
    return res.status(200).json(fallbackPayload);
  }
}
