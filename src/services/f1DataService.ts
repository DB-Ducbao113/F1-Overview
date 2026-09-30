import {
  DetailedRaceResult,
  DetailedRaceResultEntry,
  SeasonYear,
  TeamId,
  F1SyncMetadata,
  F1SyncReview,
} from '../types';
import { DETAILED_RACE_RESULTS_2024 } from '../data/championship/detailedResults2024';
import { DETAILED_RACE_RESULTS_2026 } from '../data/championship/detailedResults2026';

const STORAGE_DETAILED_RESULTS_KEY = 'f1_detailed_results_v2';
const STORAGE_SYNC_META_KEY = 'f1_sync_meta_v2';
const STORAGE_SYNC_REVIEW_KEY = 'f1_sync_review_v1';
const STORAGE_DISMISSED_REVIEW_KEY = 'f1_sync_review_dismissed_v1';
const JOLPICA_API_BASE =
  typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV
    ? '/api/jolpica/ergast/f1'
    : 'https://api.jolpi.ca/ergast/f1';

// Initial baseline data mapped by season
export const INITIAL_DETAILED_RESULTS: Record<SeasonYear, DetailedRaceResult[]> = {
  2024: DETAILED_RACE_RESULTS_2024,
  2025: [], // 2025 transition season
  2026: DETAILED_RACE_RESULTS_2026,
};

// Map Ergast/Jolpica constructor IDs to our internal TeamId
const CONSTRUCTOR_MAP: Record<string, TeamId> = {
  red_bull: 'redbull',
  cadillac: 'cadillac',
  ferrari: 'ferrari',
  mclaren: 'mclaren',
  mercedes: 'mercedes',
  aston_martin: 'astonmartin',
  alpine: 'alpine',
  rb: 'racingbulls',
  sauber: 'audi',
  haas: 'haas',
  williams: 'williams',
};

/**
 * Load persisted results from localStorage, merging with initial baseline
 */
export function loadSavedDetailedResults(): Record<SeasonYear, DetailedRaceResult[]> {
  try {
    const raw = localStorage.getItem(STORAGE_DETAILED_RESULTS_KEY);
    if (raw) {
      const parsed: Record<SeasonYear, DetailedRaceResult[]> = JSON.parse(raw);
      return {
        2024:
          parsed[2024] && parsed[2024].length > 0 ? parsed[2024] : INITIAL_DETAILED_RESULTS[2024],
        2025: parsed[2025] || INITIAL_DETAILED_RESULTS[2025],
        2026: (() => {
          const saved =
            parsed[2026] && Array.isArray(parsed[2026]) && parsed[2026].length > 0
              ? parsed[2026]
              : INITIAL_DETAILED_RESULTS[2026];
          const officialRound15 = INITIAL_DETAILED_RESULTS[2026]?.find((race) => race.round === 15);
          const merged = saved.filter(
            (race) =>
              race &&
              race.round !== 15 &&
              !(race.id && race.id.includes('simulated')) &&
              race.id !== 'race-2026-r1-australia' &&
              race.id !== 'race-2026-r2-china',
          );
          if (officialRound15) merged.push(officialRound15);
          return merged.sort((a, b) => a.round - b.round);
        })(),
      };
    }
  } catch {
    // ignore
  }
  return INITIAL_DETAILED_RESULTS;
}

export function loadSyncReview(): F1SyncReview | null {
  try {
    const raw = localStorage.getItem(STORAGE_SYNC_REVIEW_KEY);
    return raw ? (JSON.parse(raw) as F1SyncReview) : null;
  } catch {
    return null;
  }
}

export function loadDismissedSyncSignature(): string | null {
  try {
    return localStorage.getItem(STORAGE_DISMISSED_REVIEW_KEY);
  } catch {
    return null;
  }
}

export function persistDismissedSyncSignature(signature: string | null): void {
  try {
    if (signature) localStorage.setItem(STORAGE_DISMISSED_REVIEW_KEY, signature);
    else localStorage.removeItem(STORAGE_DISMISSED_REVIEW_KEY);
  } catch {
    // Continue with in-memory reconciliation if browser storage is unavailable.
  }
}

export function persistSyncReview(review: F1SyncReview | null): void {
  try {
    if (review) localStorage.setItem(STORAGE_SYNC_REVIEW_KEY, JSON.stringify(review));
    else localStorage.removeItem(STORAGE_SYNC_REVIEW_KEY);
  } catch {
    // Keep the in-memory review available if browser storage is unavailable.
  }
}

/**
 * Save updated results to localStorage (ready for Supabase database sync)
 */
export function persistDetailedResults(data: Record<SeasonYear, DetailedRaceResult[]>): void {
  try {
    localStorage.setItem(STORAGE_DETAILED_RESULTS_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

/**
 * Load or initialize sync metadata
 */
export function loadSyncMetadata(): F1SyncMetadata {
  try {
    const raw = localStorage.getItem(STORAGE_SYNC_META_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return {
    lastSyncTimestamp: 'Chưa đồng bộ',
    syncStatus: 'idle',
    source: 'Local snapshot',
    completedRoundsCount: INITIAL_DETAILED_RESULTS[2026].length,
    message: 'Đang chờ kiểm tra dữ liệu mới từ Jolpica.',
  };
}

export function persistSyncMetadata(meta: F1SyncMetadata): void {
  try {
    localStorage.setItem(STORAGE_SYNC_META_KEY, JSON.stringify(meta));
  } catch {
    // ignore
  }
}

/**
 * Paginated fetch helper for Jolpica API (capped at 100 entries per request)
 */
async function fetchAllRacesFromJolpica(
  season: SeasonYear,
  type: 'results' | 'sprint' = 'results',
): Promise<any[]> {
  const LIMIT = 100;
  let offset = 0;
  const raceMap = new Map<number, any>();

  while (true) {
    const url = `${JOLPICA_API_BASE}/${season}/${type}.json?limit=${LIMIT}&offset=${offset}`;
    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(12000),
    });
    if (!res.ok) break;
    const data = await res.json();
    const races = data?.MRData?.RaceTable?.Races || [];
    const total = parseInt(data?.MRData?.total || '0', 10);

    for (const r of races) {
      const rnd = parseInt(r.round, 10);
      if (!raceMap.has(rnd)) {
        raceMap.set(rnd, {
          ...r,
          Results: r.Results ? [...r.Results] : [],
          SprintResults: r.SprintResults ? [...r.SprintResults] : [],
        });
      } else {
        const existing = raceMap.get(rnd)!;
        if (r.Results) existing.Results.push(...r.Results);
        if (r.SprintResults) existing.SprintResults.push(...r.SprintResults);
      }
    }

    offset += LIMIT;
    if (offset >= total || races.length === 0) break;
  }

  return [...raceMap.values()].sort((a, b) => parseInt(a.round, 10) - parseInt(b.round, 10));
}

/**
 * Sync F1 Season Data:
 * Fetches race and sprint classifications from Jolpica, retaining the last saved snapshot if unavailable
 */
export async function syncF1SeasonData(
  season: SeasonYear,
  existingResults: DetailedRaceResult[],
): Promise<{
  success: boolean;
  results: DetailedRaceResult[];
  message: string;
  source: string;
}> {
  try {
    // Try live Ergast/Jolpica API with full pagination
    const racesApi = await fetchAllRacesFromJolpica(season, 'results');

    if (Array.isArray(racesApi) && racesApi.length > 0) {
      let sprintPointsByRoundDriver = new Map<string, number>();
      try {
        const sprintRaces = await fetchAllRacesFromJolpica(season, 'sprint');
        sprintPointsByRoundDriver = new Map(
          sprintRaces.flatMap((sprintRace: any) =>
            (sprintRace.SprintResults || []).map((entry: any) => [
              `${parseInt(sprintRace.round, 10)}:${entry.Driver?.driverId}`,
              parseFloat(entry.points) || 0,
            ]),
          ),
        );
      } catch {
        // Grand Prix classifications can still refresh if sprint data is unavailable.
      }

      const syncedAt = new Date().toISOString();
      const transformed: DetailedRaceResult[] = racesApi.map((race: any) => {
        const entries: DetailedRaceResultEntry[] = (race.Results || []).map((res: any) => {
          const teamId = CONSTRUCTOR_MAP[res.Constructor?.constructorId] || 'redbull';
          const pos = parseInt(res.position, 10) || 20;
          return {
            position: pos,
            driverId: res.Driver?.driverId || 'unknown',
            driverName: `${res.Driver?.givenName || ''} ${res.Driver?.familyName || ''}`.trim(),
            driverCode: res.Driver?.code || 'F1',
            driverNumber: parseInt(res.Driver?.permanentNumber, 10) || undefined,
            teamId,
            teamName: res.Constructor?.name || 'Constructor',
            laps: parseInt(res.laps, 10) || 0,
            status: res.status || 'Finished',
            timeOrGap: res.Time?.time || res.status || '+1 Lap',
            points: parseFloat(res.points) || 0,
            sprintPoints:
              sprintPointsByRoundDriver.get(
                `${parseInt(race.round, 10)}:${res.Driver?.driverId}`,
              ) || 0,
            fastestLap: res.FastestLap?.rank === '1',
            fastestLapTime: res.FastestLap?.Time?.time,
            gridPosition: parseInt(res.grid, 10) || undefined,
          };
        });

        return {
          id: `race-${season}-r${race.round}-${race.raceName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
          season,
          round: parseInt(race.round, 10),
          grandPrix: race.raceName,
          officialName: race.raceName,
          circuit: race.Circuit?.circuitName || 'Circuit',
          location: race.Circuit?.Location?.locality,
          country: race.Circuit?.Location?.country,
          date: race.date,
          dataSource: 'Jolpica F1 API',
          dataUpdatedAt: syncedAt,
          status: 'completed',
          lapsTotal: entries[0]?.laps || 57,
          winner: entries[0]
            ? {
                driver: entries[0].driverName,
                team: entries[0].teamName,
                time: entries[0].timeOrGap,
              }
            : undefined,
          fastestLap: entries.find((e) => e.fastestLap)
            ? {
                driver: entries.find((e) => e.fastestLap)!.driverName,
                team: entries.find((e) => e.fastestLap)!.teamName,
                time: entries.find((e) => e.fastestLap)!.fastestLapTime || '',
              }
            : undefined,
          entries,
        };
      });

      const raceByRound = new Map(transformed.map((race) => [race.round, race]));
      if (season === 2026) {
        INITIAL_DETAILED_RESULTS[2026]
          .filter((race) => race.round === 15)
          .forEach((race) => raceByRound.set(race.round, race));
      }
      const syncedResults = [...raceByRound.values()].sort((a, b) => a.round - b.round);

      return {
        success: true,
        results: syncedResults,
        message: `Đã đồng bộ ${syncedResults.length} chặng, gồm cả điểm Sprint nếu có, từ Jolpica.`,
        source: 'Jolpica F1 API',
      };
    }
  } catch {
    // Network or DNS restriction occurred, fall through to high-fidelity cache
  }

  // Keep the last saved snapshot visible, but report the failed refresh honestly.
  const fallback = existingResults.length > 0 ? existingResults : INITIAL_DETAILED_RESULTS[season];
  return {
    success: false,
    results: fallback,
    message: 'Không thể kết nối Jolpica lúc này; đang giữ dữ liệu đã lưu gần nhất.',
    source: 'Local saved snapshot',
  };
}
