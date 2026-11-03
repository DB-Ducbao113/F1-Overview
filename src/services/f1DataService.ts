import { DetailedRaceResult, DetailedRaceResultEntry, SeasonYear, F1SyncMetadata } from '../types';
import { DETAILED_RACE_RESULTS_2024 } from '../data/championship/detailedResults2024';
import { DETAILED_RACE_RESULTS_2026 } from '../data/championship/detailedResults2026';
import { attachOpenF1SprintResults } from '../data/championship/openF1SprintBridge';
import {
  championshipStorage,
  fetchAllRacesFromJolpica,
  PartialSyncError,
  STORAGE_DETAILED_RESULTS_KEY,
  STORAGE_SYNC_META_KEY,
  STORAGE_SYNC_REVIEW_KEY,
  STORAGE_DISMISSED_REVIEW_KEY,
} from '../features/championship/infrastructure';
import {
  mapConstructorId,
  normalizeConstructorId,
  resolveConstructorIdentity,
  normalizeDriverId,
} from '../features/championship/domain';

export {
  mapConstructorId,
  normalizeConstructorId,
  resolveConstructorIdentity,
  normalizeDriverId,
  STORAGE_DETAILED_RESULTS_KEY,
  STORAGE_SYNC_META_KEY,
  STORAGE_SYNC_REVIEW_KEY,
  STORAGE_DISMISSED_REVIEW_KEY,
};

// Initial baseline data mapped by season
export const INITIAL_DETAILED_RESULTS: Record<SeasonYear, DetailedRaceResult[]> = {
  2024: DETAILED_RACE_RESULTS_2024,
  2025: [], // 2025 transition season
  2026: DETAILED_RACE_RESULTS_2026,
};

function normalizeRaceResults(races: DetailedRaceResult[]): DetailedRaceResult[] {
  return (Array.isArray(races) ? races : []).map((race) => {
    if (!race) return race;
    const entries = Array.isArray(race.entries) ? race.entries : [];
    const normalizedEntries = entries.map((entry) => {
      if (!entry) return entry;
      const { sprintPoints: _legacySprintPoints, ...raceEntry } = entry;
      return { ...raceEntry, driverId: normalizeDriverId(entry.driverId) };
    });
    const legacySprintEntries = entries
      .filter((entry) => entry?.sprintPoints)
      .map((entry) => ({
        ...entry,
        driverId: normalizeDriverId(entry.driverId),
        points: entry.sprintPoints || 0,
        sprintPoints: undefined,
      }));
    const sprintEntries =
      race.sprintEntries && race.sprintEntries.length > 0
        ? race.sprintEntries.map((entry) => ({
            ...entry,
            driverId: normalizeDriverId(entry.driverId),
          }))
        : legacySprintEntries;
    return {
      ...race,
      entries: normalizedEntries,
      sprintEntries,
    };
  });
}

/**
 * Reconcile baseline static results with dynamic client cache.
 * Cached (synced or user-applied) results win whenever they carry a real
 * classification — otherwise every reload would silently roll accepted data
 * back to the static snapshot and re-trigger the sync review banner.
 * The baseline snapshot only fills rounds the cache has no entries for.
 */
export function reconcileSeasonRaces(
  baseline: DetailedRaceResult[],
  cached: DetailedRaceResult[],
): DetailedRaceResult[] {
  const raceMap = new Map<number, DetailedRaceResult>();
  const hasEntries = (race: DetailedRaceResult | undefined): boolean =>
    Boolean(race && Array.isArray(race.entries) && race.entries.length > 0);

  for (const race of cached) {
    if (
      race &&
      typeof race.round === 'number' &&
      !race.id?.includes('simulated') &&
      hasEntries(race)
    ) {
      raceMap.set(race.round, race);
    }
  }
  for (const race of baseline) {
    if (race && typeof race.round === 'number' && !hasEntries(raceMap.get(race.round))) {
      raceMap.set(race.round, race);
    }
  }
  // Keep cached shells (scheduled rounds, sprint-only bridges) not covered above.
  for (const race of cached) {
    if (race && typeof race.round === 'number' && !race.id?.includes('simulated')) {
      if (!raceMap.has(race.round)) raceMap.set(race.round, race);
    }
  }
  return Array.from(raceMap.values()).sort((a, b) => a.round - b.round);
}

/**
 * Load persisted results from localStorage, merging cleanly with initial baseline.
 * Delegates storage read to Championship Infrastructure Layer.
 */
export function loadSavedDetailedResults(): Record<SeasonYear, DetailedRaceResult[]> {
  try {
    const parsed = championshipStorage.loadRawDetailedResults();
    if (parsed) {
      return attachOpenF1SprintResults({
        2024:
          parsed[2024] && parsed[2024].length > 0
            ? normalizeRaceResults(parsed[2024])
            : INITIAL_DETAILED_RESULTS[2024],
        2025: normalizeRaceResults(parsed[2025] || INITIAL_DETAILED_RESULTS[2025]),
        2026: reconcileSeasonRaces(
          INITIAL_DETAILED_RESULTS[2026] || [],
          normalizeRaceResults(parsed[2026] || []),
        ),
      });
    }
  } catch {
    // ignore
  }
  return attachOpenF1SprintResults(INITIAL_DETAILED_RESULTS);
}

/**
 * Remove any leftover interactive-sync review snapshot persisted by older builds.
 * Delegates storage cleanup to Championship Infrastructure Layer.
 */
export function clearStaleSyncReview(): void {
  championshipStorage.clearStaleSyncReview();
}

/**
 * Save updated results to localStorage (ready for Supabase database sync).
 * Delegates storage persistence to Championship Infrastructure Layer.
 */
export function persistDetailedResults(data: Record<SeasonYear, DetailedRaceResult[]>): void {
  championshipStorage.persistRawDetailedResults(data);
}

/**
 * Load or initialize sync metadata.
 * Delegates storage read to Championship Infrastructure Layer.
 */
export function loadSyncMetadata(): F1SyncMetadata {
  try {
    const raw = championshipStorage.loadSyncMetadata();
    if (raw) return raw;
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

/**
 * Save updated sync metadata.
 * Delegates storage persistence to Championship Infrastructure Layer.
 */
export function persistSyncMetadata(meta: F1SyncMetadata): void {
  championshipStorage.persistSyncMetadata(meta);
}

/**
 * Sync F1 Season Data:
 * Fetches race and sprint classifications via Jolpica API adapter,
 * retaining the last saved snapshot if unavailable.
 */
export async function syncF1SeasonData(
  season: SeasonYear,
  existingResults: DetailedRaceResult[],
): Promise<{
  success: boolean;
  partial?: boolean;
  results: DetailedRaceResult[];
  message: string;
  source: string;
}> {
  try {
    // Try live Ergast/Jolpica API via Infrastructure Adapter
    const racesApi = await fetchAllRacesFromJolpica(season, 'results');
    let sprintRaces: any[] = [];
    let sprintSyncWarning = '';
    try {
      sprintRaces = await fetchAllRacesFromJolpica(season, 'sprint');
    } catch (error) {
      sprintSyncWarning = ' Không thể làm mới kết quả Sprint; vẫn giữ điểm Sprint đã lưu gần nhất.';
      console.warn('Sprint classification refresh failed:', error);
    }

    if (racesApi.length > 0 || sprintRaces.length > 0) {
      const syncedAt = new Date().toISOString();
      const racesByRound = new Map<number, any>();
      racesApi.forEach((race: any) => racesByRound.set(parseInt(race.round, 10), race));
      sprintRaces.forEach((race: any) => {
        const round = parseInt(race.round, 10);
        const existing = racesByRound.get(round);
        racesByRound.set(round, {
          ...race,
          ...existing,
          SprintResults: race.SprintResults || existing?.SprintResults || [],
        });
      });

      const savedByRound = new Map(existingResults.map((race) => [race.round, race]));
      const transformed = [...racesByRound.values()].map((race: any): DetailedRaceResult | null => {
        const entries: DetailedRaceResultEntry[] = (race.Results || []).map((res: any) => {
          const teamId = mapConstructorId(res.Constructor?.constructorId, season);
          const pos = parseInt(res.position, 10) || 20;
          return {
            position: pos,
            driverId: normalizeDriverId(res.Driver?.driverId),
            driverName: `${res.Driver?.givenName || ''} ${res.Driver?.familyName || ''}`.trim(),
            driverCode: res.Driver?.code || 'F1',
            driverNumber: parseInt(res.Driver?.permanentNumber, 10) || undefined,
            teamId,
            teamName: res.Constructor?.name || 'Constructor',
            laps: parseInt(res.laps, 10) || 0,
            status: res.status || 'Finished',
            timeOrGap: res.Time?.time || res.status || '+1 Lap',
            points: parseFloat(res.points) || 0,
            fastestLap: res.FastestLap?.rank === '1',
            fastestLapTime: res.FastestLap?.Time?.time,
            gridPosition: parseInt(res.grid, 10) || undefined,
          };
        });
        const fetchedSprintEntries: DetailedRaceResultEntry[] = (race.SprintResults || []).map(
          (res: any, index: number) => ({
            position: parseInt(res.position, 10) || index + 1,
            driverId: normalizeDriverId(res.Driver?.driverId),
            driverName: `${res.Driver?.givenName || ''} ${res.Driver?.familyName || ''}`.trim(),
            driverCode: res.Driver?.code || 'F1',
            driverNumber: parseInt(res.Driver?.permanentNumber, 10) || undefined,
            teamId: mapConstructorId(res.Constructor?.constructorId, season),
            teamName: res.Constructor?.name || 'Constructor',
            laps: parseInt(res.laps, 10) || 0,
            status: res.status || 'Finished',
            timeOrGap: res.Time?.time || res.status || '',
            points: parseFloat(res.points) || 0,
            gridPosition: parseInt(res.grid, 10) || undefined,
          }),
        );
        const savedRace = savedByRound.get(parseInt(race.round, 10));
        const sprintEntries =
          fetchedSprintEntries.length > 0
            ? fetchedSprintEntries
            : savedRace?.sprintEntries ||
              savedRace?.entries
                .filter((entry) => entry.sprintPoints)
                .map((entry) => ({
                  ...entry,
                  points: entry.sprintPoints || 0,
                  sprintPoints: undefined,
                })) ||
              [];
        // Provenance for the attach step: freshly fetched entries are
        // official; reused saved entries keep their marker (provisional saved
        // data stays replaceable, official saved data stays protected).
        const sprintProvenance =
          fetchedSprintEntries.length > 0
            ? ('official' as const)
            : sprintEntries.length > 0
              ? (savedRace?.sprintProvenance ?? ('provisional' as const))
              : undefined;
        const round = parseInt(race.round, 10);
        if (!Number.isFinite(round)) return null;

        const safeRaceName =
          typeof race.raceName === 'string' && race.raceName.length > 0
            ? race.raceName
            : `Round ${Number.isFinite(round) ? round : 'unknown'}`;

        return {
          id: `race-${season}-r${race.round}-${safeRaceName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
          season,
          round,
          grandPrix: safeRaceName,
          officialName: safeRaceName,
          circuit: race.Circuit?.circuitName || 'Circuit',
          location: race.Circuit?.Location?.locality,
          country: race.Circuit?.Location?.country,
          date: race.date,
          dataSource: 'Jolpica F1 API',
          dataUpdatedAt: syncedAt,
          status: entries.length > 0 ? 'completed' : 'scheduled',
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
          sprintEntries,
          sprintProvenance,
        };
      });

      const raceByRound = new Map(
        transformed
          .filter((race): race is DetailedRaceResult => race !== null)
          .map((race) => [race.round, race] as const),
      );
      // Baseline only fills rounds missing from sync — never overwrites
      // successfully synced rounds (see BASELINE_CUTOFF_BY_SEASON).
      for (const race of INITIAL_DETAILED_RESULTS[season] || []) {
        if (race && typeof race.round === 'number' && !raceByRound.has(race.round)) {
          raceByRound.set(race.round, race);
        }
      }
      const syncedResults = attachOpenF1SprintResults({
        ...INITIAL_DETAILED_RESULTS,
        [season]: [...raceByRound.values()].sort((a, b) => a.round - b.round),
      })[season];

      return {
        success: true,
        results: syncedResults,
        message: `Đã đồng bộ ${syncedResults.length} chặng, gồm cả điểm Sprint nếu có, từ Jolpica.${sprintSyncWarning}`,
        source: 'Jolpica F1 API',
      };
    }
  } catch (err) {
    // Network, timeout, or partial-page failure: keep the last saved snapshot
    // visible, but report honestly — never as success.
    const partial = err instanceof PartialSyncError;
    const fallback =
      existingResults.length > 0 ? existingResults : INITIAL_DETAILED_RESULTS[season];
    return {
      success: false,
      partial: partial || undefined,
      results: fallback,
      message: partial
        ? 'Đồng bộ dở dang (một số trang lỗi); đang giữ nguyên dữ liệu đã lưu, không báo thành công.'
        : 'Không thể kết nối Jolpica lúc này; đang giữ dữ liệu đã lưu gần nhất.',
      source: 'Local saved snapshot',
    };
  }

  // Empty upstream payload: keep snapshot, report honestly (never success).
  const emptyFallback =
    existingResults.length > 0 ? existingResults : INITIAL_DETAILED_RESULTS[season];
  return {
    success: false,
    results: emptyFallback,
    message: 'Jolpica chua co du lieu moi; dang giu du lieu da luu gan nhat.',
    source: 'Local saved snapshot',
  };
}
