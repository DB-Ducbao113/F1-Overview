/**
 * Vercel Serverless Function: /api/live-map
 * High-performance proxy and cache layer for OpenF1 API (openf1.org).
 * Prevents hitting OpenF1's 30 req/min rate limit by caching aggregated responses.
 */

interface CacheEntry {
  timestamp: number;
  data: any;
}

const cache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 2000; // 2 seconds TTL

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { session_key = 'latest', date_window, endpoint = 'aggregate' } = req.query;

    const cacheKey = `${endpoint}_${session_key}_${date_window || ''}`;
    const cached = cache.get(cacheKey);

    const now = Date.now();
    if (cached && now - cached.timestamp < CACHE_TTL_MS) {
      res.setHeader('X-Cache', 'HIT');
      return res.status(200).json(cached.data);
    }

    const OPENF1_BASE = 'https://api.openf1.org/v1';

    if (endpoint === 'sessions') {
      const response = await fetch(`${OPENF1_BASE}/sessions?session_key=${session_key}`);
      const data = await response.json();
      cache.set(cacheKey, { timestamp: now, data });
      res.setHeader('X-Cache', 'MISS');
      return res.status(200).json(data);
    }

    // Default aggregate endpoint
    let sessionKey = session_key;
    if (sessionKey === 'latest') {
      const sRes = await fetch(`${OPENF1_BASE}/sessions?session_key=latest`);
      const sData = await sRes.json();
      if (sData && sData.length > 0) {
        sessionKey = sData[0].session_key;
      }
    }

    // Parallel fetch core telemetry with minimal data window
    const [driversRes, posRes, flagRes] = await Promise.all([
      fetch(`${OPENF1_BASE}/drivers?session_key=${sessionKey}`).then((r) => r.json()).catch(() => []),
      fetch(`${OPENF1_BASE}/position?session_key=${sessionKey}`).then((r) => r.json()).catch(() => []),
      fetch(`${OPENF1_BASE}/race_control?session_key=${sessionKey}`).then((r) => r.json()).catch(() => []),
    ]);

    // Fetch location window if date_window provided or fallback
    let locData = [];
    if (date_window) {
      const locRes = await fetch(`${OPENF1_BASE}/location?session_key=${sessionKey}&${date_window}`);
      locData = await locRes.json().catch(() => []);
    }

    const payload = {
      sessionKey,
      timestamp: new Date().toISOString(),
      drivers: driversRes,
      positions: posRes.slice(-30),
      raceControl: flagRes.slice(-10),
      locations: locData,
    };

    cache.set(cacheKey, { timestamp: now, data: payload });
    res.setHeader('X-Cache', 'MISS');
    return res.status(200).json(payload);
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to fetch OpenF1 data' });
  }
}
