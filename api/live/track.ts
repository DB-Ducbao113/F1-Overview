/**
 * Vercel Serverless Function: /api/live/track
 * Aggregates car locations across the 20-car grid for an active or replay session.
 *
 * Rate-limit protection:
 * Browser sends 1 request to this proxy every 2s.
 * Inside, requests are dispatched in batches of 5 drivers separated by 400ms delay
 * to stay comfortably below OpenF1's 3 req/sec rate limit.
 * Responses are cached in-memory with a 2-second TTL.
 */

const OPENF1_BASE = 'https://api.openf1.org/v1';

interface TrackCacheEntry {
  at: number;
  data: any;
}

const trackCache = new Map<string, TrackCacheEntry>();
const CACHE_TTL_MS = 2000;

// Driver list cache per session (drivers rarely change within a session)
const driversCache = new Map<number, number[]>();

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const sessionKey = req.query.session_key as string;
  const atParam = req.query.at as string | undefined; // ISO timestamp for replay mode

  if (!sessionKey) {
    return res.status(400).json({ error: 'Missing session_key parameter' });
  }

  const sKeyNum = Number(sessionKey);
  const cacheKey = `${sessionKey}_${atParam || 'live'}`;
  const now = Date.now();

  const cached = trackCache.get(cacheKey);
  if (cached && now - cached.at < CACHE_TTL_MS) {
    res.setHeader('X-Cache', 'HIT');
    return res.status(200).json(cached.data);
  }

  try {
    // 1. Get driver numbers for this session (cached per session)
    let driverNumbers = driversCache.get(sKeyNum);
    if (!driverNumbers || driverNumbers.length === 0) {
      const dRes = await fetch(`${OPENF1_BASE}/drivers?session_key=${sessionKey}`);
      const drivers = await dRes.json().catch(() => []);
      if (Array.isArray(drivers) && drivers.length > 0) {
        driverNumbers = drivers.map((d: any) => d.driver_number);
        driversCache.set(sKeyNum, driverNumbers);
      } else {
        // Fallback default grid numbers
        driverNumbers = [
          1, 11, 16, 55, 63, 44, 4, 81, 14, 18, 10, 31, 23, 2, 22, 3, 77, 24, 20, 27,
        ];
      }
    }

    // 2. Build time window query if 'at' is provided (Replay mode)
    let timeWindowQuery = '';
    if (atParam) {
      const atDate = new Date(atParam);
      if (!isNaN(atDate.getTime())) {
        const atStartIso = atDate.toISOString();
        const atEndIso = new Date(atDate.getTime() + 4000).toISOString(); // 4s window
        timeWindowQuery = `&date>=${encodeURIComponent(atStartIso)}&date<=${encodeURIComponent(atEndIso)}`;
      }
    }

    // 3. Dispatch batch requests (5 drivers per batch with 400ms delay)
    const BATCH_SIZE = 5;
    const latestPositions: Record<number, any> = {};

    for (let i = 0; i < driverNumbers.length; i += BATCH_SIZE) {
      const slice = driverNumbers.slice(i, i + BATCH_SIZE);
      const batchResults = await Promise.all(
        slice.map(async (driverNumber) => {
          try {
            const url = `${OPENF1_BASE}/location?session_key=${sessionKey}&driver_number=${driverNumber}${timeWindowQuery}`;
            const r = await fetch(url);
            const arr = await r.json();
            if (Array.isArray(arr) && arr.length > 0) {
              return { driverNumber, last: arr[arr.length - 1] };
            }
          } catch {
            // driver might not have location in this window
          }
          return { driverNumber, last: null };
        }),
      );

      for (const { driverNumber, last } of batchResults) {
        if (last) {
          latestPositions[driverNumber] = last;
        }
      }

      // Delay between batches if there are more drivers to query
      if (i + BATCH_SIZE < driverNumbers.length) {
        await new Promise((resolve) => setTimeout(resolve, 400));
      }
    }

    const cars = Object.entries(latestPositions).map(([numStr, pos]) => ({
      driver_number: Number(numStr),
      x: pos.x,
      y: pos.y,
      z: pos.z,
      date: pos.date,
    }));

    const responsePayload = {
      session_key: sKeyNum,
      sampled_at: new Date().toISOString(),
      is_replay: Boolean(atParam),
      cars,
    };

    trackCache.set(cacheKey, { at: now, data: responsePayload });
    res.setHeader('X-Cache', 'MISS');
    return res.status(200).json(responsePayload);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to fetch car locations' });
  }
}
