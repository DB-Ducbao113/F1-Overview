import { DetailedRaceResult, F1SyncMetadata, SeasonYear } from '../../../../types';
import { DETAILED_RACE_RESULTS_2024 } from '../../../../data/championship/detailedResults2024';
import { DETAILED_RACE_RESULTS_2026 } from '../../../../data/championship/detailedResults2026';
import { attachOpenF1SprintResults } from '../../../../data/championship/openF1SprintBridge';
import { normalizeDriverId } from '../../domain';
import { championshipStorage, IChampionshipStorage } from '../../infrastructure';
import {
  InitialChampionshipData,
  ILoadInitialChampionshipDataUseCase,
} from '../contracts/applicationContracts';
import { calculateSeasonStandingsUseCase } from './calculateSeasonStandingsUseCase';

export const INITIAL_DETAILED_RESULTS: Record<SeasonYear, DetailedRaceResult[]> = {
  2024: DETAILED_RACE_RESULTS_2024,
  2025: [], // 2025 transition season
  2026: DETAILED_RACE_RESULTS_2026,
};

export function normalizeRaceResults(races: DetailedRaceResult[]): DetailedRaceResult[] {
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

export class LoadInitialChampionshipDataUseCase implements ILoadInitialChampionshipDataUseCase {
  constructor(private readonly storage: IChampionshipStorage = championshipStorage) {}

  loadSavedResults(): Record<SeasonYear, DetailedRaceResult[]> {
    try {
      const parsed = this.storage.loadRawDetailedResults();
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
      // Fallback cleanly on corruption
    }
    return attachOpenF1SprintResults(INITIAL_DETAILED_RESULTS);
  }

  loadMetadata(): F1SyncMetadata {
    try {
      const raw = this.storage.loadSyncMetadata();
      if (raw) return raw;
    } catch {
      // Fallback cleanly
    }
    return {
      lastSyncTimestamp: 'Chưa đồng bộ',
      syncStatus: 'idle',
      source: 'Local snapshot',
      completedRoundsCount: INITIAL_DETAILED_RESULTS[2026].length,
      message: 'Đang chờ kiểm tra dữ liệu mới từ Jolpica.',
    };
  }

  execute(): InitialChampionshipData {
    // 1. Clear any stale interactive-sync review snapshots left by older builds
    this.storage.clearStaleSyncReview();

    // 2. Load and hydrate detailed race results
    const detailedResults = this.loadSavedResults();

    // 3. Compute initial standings across all seasons
    const calculatedStandings =
      calculateSeasonStandingsUseCase.computeAllInitialStandings(detailedResults);

    // 4. Load sync metadata
    const syncMeta = this.loadMetadata();

    return {
      detailedResults,
      calculatedStandings,
      syncMeta,
    };
  }
}

export const loadInitialChampionshipDataUseCase = new LoadInitialChampionshipDataUseCase();
