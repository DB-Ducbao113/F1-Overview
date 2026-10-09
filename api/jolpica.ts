/**
 * Same-origin Jolpica proxy for race and sprint classifications.
 * Vercel's CDN absorbs repeated client requests while stale data remains usable
 * during short upstream outages or rate-limit windows.
 */

const JOLPICA_ORIGIN = 'https://api.jolpi.ca';
const ALLOWED_PATH = /^ergast\/f1\/(2024|2025|2026)\/(results|sprint)\.json$/;
const CACHE_TTL_MS = 15 * 60_000;

const responseCache = new Map<string, { storedAt: number; payload: unknown }>();

function firstQueryValue(value: unknown): string {
  return Array.isArray(value) ? String(value[0] ?? '') : String(value ?? '');
}

function boundedInteger(value: unknown, fallback: number, maximum: number): number {
  const parsed = Number.parseInt(firstQueryValue(value), 10);
  if (!Number.isFinite(parsed) || parsed < 0) return fallback;
  return Math.min(parsed, maximum);
}

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'public, s-maxage=900, stale-while-revalidate=86400');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const path = firstQueryValue(req.query?.path).replace(/^\/+/, '');
  if (!ALLOWED_PATH.test(path)) {
    return res.status(400).json({ error: 'Unsupported Jolpica endpoint' });
  }

  const limit = boundedInteger(req.query?.limit, 100, 100);
  const offset = boundedInteger(req.query?.offset, 0, 10_000);
  const cacheKey = `${path}?limit=${limit}&offset=${offset}`;
  const cached = responseCache.get(cacheKey);
  const now = Date.now();

  if (cached && now - cached.storedAt < CACHE_TTL_MS) {
    res.setHeader('X-Cache', 'HIT');
    return res.status(200).json(cached.payload);
  }

  try {
    const upstream = await fetch(`${JOLPICA_ORIGIN}/${cacheKey}`, {
      headers: { Accept: 'application/json', 'User-Agent': 'PODIUM-Effet-de-Sol/1.0' },
      signal: AbortSignal.timeout(10_000),
    });
    if (!upstream.ok) throw new Error(`Jolpica returned ${upstream.status}`);

    const payload = await upstream.json();
    responseCache.set(cacheKey, { storedAt: now, payload });
    res.setHeader('X-Cache', 'MISS');
    return res.status(200).json(payload);
  } catch {
    if (cached) {
      res.setHeader('X-Cache', 'STALE');
      res.setHeader('Warning', '110 - Response is stale');
      return res.status(200).json(cached.payload);
    }
    return res.status(503).json({ error: 'Jolpica is temporarily unavailable' });
  }
}
