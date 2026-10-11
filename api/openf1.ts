/**
 * Same-origin OpenF1 proxy (dev Vite proxy and prod serverless share this
 * path/allowlist contract — see `vite.config.ts`).
 *
 * CORS is a browser-compatibility mechanism, NOT authentication or quota
 * protection: only explicitly configured production/preview origins (plus
 * same-origin requests) are allowed. Never allow `*` or `*.vercel.app`.
 */

const OPENF1_ORIGIN = 'https://api.openf1.org/v1';
const ALLOWED_ENDPOINTS = new Set([
  'sessions',
  'drivers',
  'location',
  'car_data',
  'position',
  'race_control',
  'meetings',
]);
const CACHE_TTL_MS = 12_000;
const MAX_CACHE_ENTRIES = 200;
// Stale fallback is bounded: entries older than this are never served,
// even during an upstream outage (fail loudly instead of showing fossils).
const STALE_MAX_AGE_MS = 5 * 60_000;

const responseCache = new Map<string, { storedAt: number; payload: unknown }>();
const inflight = new Map<string, Promise<unknown>>();

function firstQueryValue(value: unknown): string {
  return Array.isArray(value) ? String(value[0] ?? '') : String(value ?? '');
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

function applyCors(req: any, res: any): boolean {
  const origin = String(req.headers?.origin || '');
  const host = String(req.headers?.host || '');
  res.setHeader('Vary', 'Origin');
  if (!origin) return true;
  if (!isOriginAllowed(origin, host)) {
    res.status(403).json({ error: 'Origin not allowed' });
    return false;
  }
  res.setHeader('Access-Control-Allow-Origin', origin);
  return true;
}

function pruneCache(): void {
  // Size cap only (insertion-ordered oldest first). Expired entries are NOT
  // deleted here: they remain servable as bounded STALE during outages and
  // are refreshed on the next successful upstream fetch.
  while (responseCache.size > MAX_CACHE_ENTRIES) {
    const oldest = responseCache.keys().next();
    if (oldest.done) break;
    responseCache.delete(oldest.value);
  }
}

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'public, s-maxage=12, stale-while-revalidate=60');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  if (!applyCors(req, res)) return undefined;

  const endpoint = firstQueryValue(req.query?.endpoint).replace(/^\/+/, '');
  if (!ALLOWED_ENDPOINTS.has(endpoint)) {
    return res.status(400).json({ error: 'Unsupported OpenF1 endpoint' });
  }

  const params = new URLSearchParams();
  const rawQuery = (req.query || {}) as Record<string, unknown>;
  for (const [key, value] of Object.entries(rawQuery)) {
    if (key === 'endpoint') continue;
    const v = firstQueryValue(value);
    if (v !== '') params.append(key, v);
  }
  // Least-privilege: cap result windows so one client cannot page the whole archive.
  if (!params.has('limit')) params.set('limit', '500');

  const cacheKey = `${endpoint}?${params.toString()}`;
  const now = Date.now();
  pruneCache();
  const cached = responseCache.get(cacheKey);
  if (cached && now - cached.storedAt < CACHE_TTL_MS) {
    res.setHeader('X-Cache', 'HIT');
    return res.status(200).json(cached.payload);
  }

  const pending = inflight.get(cacheKey);
  if (pending) {
    try {
      const payload = await pending;
      res.setHeader('X-Cache', 'SHARED');
      return res.status(200).json(payload);
    } catch {
      if (cached && Date.now() - cached.storedAt < STALE_MAX_AGE_MS) {
        res.setHeader('X-Cache', 'STALE');
        res.setHeader('Warning', '110 - Response is stale');
        return res.status(200).json(cached.payload);
      }
      return res.status(503).json({ error: 'OpenF1 is temporarily unavailable' });
    }
  }

  const upstreamTask = (async () => {
    const upstream = await fetch(`${OPENF1_ORIGIN}/${cacheKey}`, {
      headers: { Accept: 'application/json', 'User-Agent': 'PODIUM-Effet-de-Sol/1.0' },
      signal: AbortSignal.timeout(8000),
    });
    if (upstream.status === 429) {
      const e = new Error('rate-limited') as Error & { code?: string };
      e.code = 'rate-limited';
      throw e;
    }
    if (!upstream.ok) throw new Error(`OpenF1 returned ${upstream.status}`);
    const payload = await upstream.json();
    // Refresh recency for the size cap, then store.
    responseCache.delete(cacheKey);
    responseCache.set(cacheKey, { storedAt: Date.now(), payload });
    pruneCache();
    return payload;
  })();
  inflight.set(cacheKey, upstreamTask);

  try {
    const payload = await upstreamTask;
    res.setHeader('X-Cache', 'MISS');
    return res.status(200).json(payload);
  } catch (err: any) {
    // Bounded stale: only serve a cached payload younger than STALE_MAX_AGE_MS.
    if (cached && Date.now() - cached.storedAt < STALE_MAX_AGE_MS) {
      res.setHeader('X-Cache', 'STALE');
      res.setHeader('Warning', '110 - Response is stale');
      return res.status(200).json(cached.payload);
    }
    if (err?.code === 'rate-limited') {
      return res.status(429).json({ error: 'rate-limited' });
    }
    return res.status(503).json({ error: 'OpenF1 is temporarily unavailable' });
  } finally {
    // Always release the single-flight slot, including on errors, so the
    // next request starts a fresh upstream attempt instead of hanging.
    inflight.delete(cacheKey);
  }
}
