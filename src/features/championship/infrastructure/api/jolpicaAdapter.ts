import { SeasonYear } from '../../../../types';
import {
  IJolpicaAdapter,
  JolpicaFetchType,
  RawJolpicaRace,
  RawJolpicaResponse,
  RawJolpicaResultEntry,
} from '../contracts/infrastructureContracts';

export const JOLPICA_API_BASE = '/api/jolpica/ergast/f1';
export const JOLPICA_DEFAULT_LIMIT = 100;
export const JOLPICA_MAX_PAGES = 5;
export const JOLPICA_MAX_ATTEMPTS = 3;
export const JOLPICA_TOTAL_BUDGET_MS = 30_000;
export const JOLPICA_REQUEST_TIMEOUT_MS = 12_000;

export class PartialSyncError extends Error {
  readonly partial = true;
  readonly loadedPages: number;

  constructor(message: string, loadedPages: number) {
    super(message);
    this.name = 'PartialSyncError';
    this.loadedPages = loadedPages;
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function retryDelayMs(attempt: number, retryAfter: string | null): number {
  if (retryAfter) {
    const seconds = Number.parseInt(retryAfter, 10);
    if (Number.isFinite(seconds) && seconds >= 0) {
      return Math.min(seconds * 1000, 30_000);
    }
  }
  return Math.min(1000 * 2 ** attempt, 8000);
}

export function buildJolpicaUrl(
  season: SeasonYear,
  type: JolpicaFetchType,
  limit: number,
  offset: number,
): string {
  if (typeof import.meta !== 'undefined' && import.meta.env?.DEV) {
    return `${JOLPICA_API_BASE}/${season}/${type}.json?limit=${limit}&offset=${offset}`;
  }

  const params = new URLSearchParams({
    path: `ergast/f1/${season}/${type}.json`,
    limit: String(limit),
    offset: String(offset),
  });
  return `/api/jolpica?${params.toString()}`;
}

/**
 * Single Jolpica page fetch with bounded retry (max attempts + total budget).
 * Retries 429/5xx with backoff and honors numeric Retry-After; other errors
 * throw immediately. The total budget covers sleeps AND fetch time: each
 * request timeout shrinks to the remaining budget.
 */
export async function fetchJolpicaPage(
  url: string,
  options?: {
    maxAttempts?: number;
    totalBudgetMs?: number;
    requestTimeoutMs?: number;
  },
): Promise<Response> {
  const maxAttempts = options?.maxAttempts ?? JOLPICA_MAX_ATTEMPTS;
  const totalBudgetMs = options?.totalBudgetMs ?? JOLPICA_TOTAL_BUDGET_MS;
  const requestTimeoutMs = options?.requestTimeoutMs ?? JOLPICA_REQUEST_TIMEOUT_MS;
  const deadline = Date.now() + totalBudgetMs;
  let lastStatus = 0;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const remaining = deadline - Date.now();
    if (remaining <= 0) {
      throw new Error(`Jolpica endpoint timed out (retry budget of 30s exhausted)`);
    }
    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(Math.min(requestTimeoutMs, remaining)),
    });
    if (res.ok) return res;
    lastStatus = res.status;
    const retryable = res.status === 429 || res.status >= 500;
    if (!retryable || attempt === maxAttempts - 1) {
      throw new Error(`Jolpica endpoint returned ${res.status}`);
    }
    const delay = retryDelayMs(attempt, res.headers.get('Retry-After'));
    if (Date.now() + delay >= deadline) {
      throw new Error(`Jolpica endpoint returned ${res.status} (retry budget exhausted)`);
    }
    await sleep(delay);
  }
  throw new Error(`Jolpica endpoint returned ${lastStatus}`);
}

/**
 * Paginated fetch helper for Jolpica API (capped at 100 entries per request,
 * at most 5 pages). Throws PartialSyncError when a later page fails after
 * earlier pages succeeded, so callers never report partial data as success.
 */
export async function fetchAllRacesFromJolpica(
  season: SeasonYear,
  type: JolpicaFetchType = 'results',
  config?: {
    limit?: number;
    maxPages?: number;
  },
): Promise<RawJolpicaRace[]> {
  const limit = config?.limit ?? JOLPICA_DEFAULT_LIMIT;
  const maxPages = config?.maxPages ?? JOLPICA_MAX_PAGES;
  let offset = 0;
  let pages = 0;
  const raceMap = new Map<number, RawJolpicaRace>();

  while (true) {
    const url = buildJolpicaUrl(season, type, limit, offset);
    let res: Response;
    try {
      res = await fetchJolpicaPage(url);
    } catch (err) {
      if (raceMap.size === 0) throw err;
      throw new PartialSyncError(
        `Jolpica ${type} page ${pages + 1} failed after ${pages} page(s) loaded`,
        pages,
      );
    }
    const data = (await res.json()) as RawJolpicaResponse;
    const races = data?.MRData?.RaceTable?.Races || [];
    const rawTotal = parseInt(data?.MRData?.total || '0', 10);
    const safeRawTotal = Number.isFinite(rawTotal) && rawTotal >= 0 ? rawTotal : 0;
    // The cap truncates the season: surface it as partial, never as success.
    if (pages === 0 && safeRawTotal > limit * maxPages) {
      throw new PartialSyncError(
        `Jolpica ${type} total ${safeRawTotal} exceeds the ${limit * maxPages}-entry page cap`,
        0,
      );
    }
    const total = Math.min(safeRawTotal, limit * maxPages);

    for (const r of races) {
      const rnd = parseInt(r.round, 10);
      if (!Number.isFinite(rnd)) continue;
      if (!raceMap.has(rnd)) {
        const seenDrivers = new Set<string>();
        const uniqueResults: RawJolpicaResultEntry[] = [];
        if (r.Results) {
          for (const e of r.Results) {
            const id = e?.Driver?.driverId;
            if (id && seenDrivers.has(id)) continue;
            if (id) seenDrivers.add(id);
            uniqueResults.push(e);
          }
        }
        const seenSprint = new Set<string>();
        const uniqueSprint: RawJolpicaResultEntry[] = [];
        if (r.SprintResults) {
          for (const e of r.SprintResults) {
            const id = e?.Driver?.driverId;
            if (id && seenSprint.has(id)) continue;
            if (id) seenSprint.add(id);
            uniqueSprint.push(e);
          }
        }
        raceMap.set(rnd, {
          ...r,
          Results: uniqueResults,
          SprintResults: uniqueSprint,
        });
      } else {
        const existing = raceMap.get(rnd)!;
        const seenDrivers = new Set(
          (existing.Results || []).map((e) => e?.Driver?.driverId).filter(Boolean),
        );
        if (r.Results) {
          for (const e of r.Results) {
            if (e?.Driver?.driverId && seenDrivers.has(e.Driver.driverId)) continue;
            if (e?.Driver?.driverId) seenDrivers.add(e.Driver.driverId);
            existing.Results = existing.Results || [];
            existing.Results.push(e);
          }
        }
        const seenSprint = new Set(
          (existing.SprintResults || []).map((e) => e?.Driver?.driverId).filter(Boolean),
        );
        if (r.SprintResults) {
          for (const e of r.SprintResults) {
            if (e?.Driver?.driverId && seenSprint.has(e.Driver.driverId)) continue;
            if (e?.Driver?.driverId) seenSprint.add(e.Driver.driverId);
            existing.SprintResults = existing.SprintResults || [];
            existing.SprintResults.push(e);
          }
        }
      }
    }

    pages += 1;
    offset += limit;
    if (offset >= total || races.length === 0 || pages >= maxPages) break;
  }

  return [...raceMap.values()].sort((a, b) => parseInt(a.round, 10) - parseInt(b.round, 10));
}

/**
 * Concrete Jolpica API Adapter implementation
 */
export class JolpicaAdapter implements IJolpicaAdapter {
  buildUrl(season: SeasonYear, type: JolpicaFetchType, limit: number, offset: number): string {
    return buildJolpicaUrl(season, type, limit, offset);
  }

  fetchPage(url: string): Promise<Response> {
    return fetchJolpicaPage(url);
  }

  fetchAllRaces(season: SeasonYear, type: JolpicaFetchType = 'results'): Promise<RawJolpicaRace[]> {
    return fetchAllRacesFromJolpica(season, type);
  }
}

export const jolpicaAdapter = new JolpicaAdapter();
