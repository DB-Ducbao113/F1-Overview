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

function readEnv(name: string): string {
  const proc = (globalThis as unknown as { process?: { env?: Record<string, string | undefined> } })
    .process;
  return proc?.env?.[name] || '';
}

function getAllowedOrigins(): string[] {
  return readEnv('ALLOWED_ORIGINS')
    .split(',')
    .map((s: string) => s.trim())
    .filter((s: string) => s.length > 0);
}

function isOriginAllowed(origin: string, host: string): boolean {
  if (!origin) return true; // non-browser or no-Origin request
  try {
    if (host && new URL(origin).host === host) return true; // same-origin
  } catch {
    return false;
  }
  return getAllowedOrigins().includes(origin);
}

export default async function handler(req: any, res: any) {
  // CORS is a browser-compatibility mechanism, NOT authentication or quota
  // protection. Only same-origin and explicitly configured origins pass;
  // never `*` or `*.vercel.app`.
  const origin = String(req.headers?.origin || '');
  const host = String(req.headers?.host || '');
  res.setHeader('Vary', 'Origin');
  if (origin) {
    if (!isOriginAllowed(origin, host)) {
      return res.status(403).json({ error: 'Origin not allowed' });
    }
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
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
    // Bound memory: serverless instances are ephemeral but enumeration of
    // offset=0..10000 must not grow the map without limit.
    if (responseCache.size > 200) {
      const oldest = responseCache.keys().next();
      if (!oldest.done) responseCache.delete(oldest.value);
    }
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
