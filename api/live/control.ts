/**
 * Vercel Serverless Function: /api/live/control
 * Fetches latest Race Control messages, flags, safety cars, and steward decisions.
 * Caches responses in-memory with a 5-second TTL.
 */

const OPENF1_BASE = 'https://api.openf1.org/v1';

interface ControlCacheEntry {
  at: number;
  data: any;
}

const controlCache = new Map<string, ControlCacheEntry>();
const CACHE_TTL_MS = 5000;

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const sessionKey = req.query.session_key as string;
  if (!sessionKey) {
    return res.status(400).json({ error: 'Missing session_key parameter' });
  }

  const sKeyNum = Number(sessionKey);
  const cacheKey = `${sessionKey}`;
  const now = Date.now();

  const cached = controlCache.get(cacheKey);
  if (cached && now - cached.at < CACHE_TTL_MS) {
    res.setHeader('X-Cache', 'HIT');
    return res.status(200).json(cached.data);
  }

  try {
    const r = await fetch(`${OPENF1_BASE}/race_control?session_key=${sessionKey}`);
    const events = await r.json().catch(() => []);

    const rawList: any[] = Array.isArray(events) ? events : [];
    // Take the 15 latest messages
    const latestMessages = rawList.slice(-15).reverse();

    // Determine current track flag state
    let activeFlag = 'GREEN';
    const lastFlagEvent = rawList.filter((e) => e.flag || e.category === 'Flag').pop();

    if (lastFlagEvent) {
      const msg = (lastFlagEvent.message || '').toUpperCase();
      const flagType = (lastFlagEvent.flag || '').toUpperCase();

      if (msg.includes('SAFETY CAR') && !msg.includes('ENDING')) {
        activeFlag = 'SAFETY_CAR';
      } else if (msg.includes('VIRTUAL SAFETY CAR') && !msg.includes('ENDING')) {
        activeFlag = 'VSC';
      } else if (flagType === 'RED' || msg.includes('RED FLAG')) {
        activeFlag = 'RED';
      } else if (flagType === 'DOUBLE YELLOW' || msg.includes('DOUBLE YELLOW')) {
        activeFlag = 'DOUBLE_YELLOW';
      } else if (flagType === 'YELLOW' || msg.includes('YELLOW FLAG')) {
        activeFlag = 'YELLOW';
      } else if (flagType === 'CLEAR' || flagType === 'GREEN' || msg.includes('GREEN FLAG')) {
        activeFlag = 'GREEN';
      }
    }

    const payload = {
      session_key: sKeyNum,
      active_flag: activeFlag,
      messages: latestMessages.map((m: any) => ({
        date: m.date || new Date().toISOString(),
        category: m.category || 'Race Control',
        message: m.message || '',
        flag: m.flag || undefined,
        scope: m.scope || undefined,
        sector: m.sector !== undefined ? Number(m.sector) : undefined,
      })),
    };

    controlCache.set(cacheKey, { at: now, data: payload });
    res.setHeader('X-Cache', 'MISS');
    return res.status(200).json(payload);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to fetch race control messages' });
  }
}
