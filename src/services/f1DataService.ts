import { DetailedRaceResult, SeasonYear, F1SyncMetadata } from '../types';
import {
  STORAGE_DETAILED_RESULTS_KEY,
  STORAGE_SYNC_META_KEY,
  STORAGE_SYNC_REVIEW_KEY,
  STORAGE_DISMISSED_REVIEW_KEY,
  championshipStorage,
} from '../features/championship/infrastructure';
import {
  mapConstructorId,
  normalizeConstructorId,
  resolveConstructorIdentity,
  normalizeDriverId,
} from '../features/championship/domain';
import {
  INITIAL_DETAILED_RESULTS,
  reconcileSeasonRaces,
  loadInitialChampionshipDataUseCase,
  syncSeasonResultsUseCase,
} from '../features/championship/application';

export {
  mapConstructorId,
  normalizeConstructorId,
  resolveConstructorIdentity,
  normalizeDriverId,
  STORAGE_DETAILED_RESULTS_KEY,
  STORAGE_SYNC_META_KEY,
  STORAGE_SYNC_REVIEW_KEY,
  STORAGE_DISMISSED_REVIEW_KEY,
  INITIAL_DETAILED_RESULTS,
  reconcileSeasonRaces,
};

/**
 * Load persisted results from localStorage, merging cleanly with initial baseline.
 * Delegates to Championship Application Use Case.
 */
export function loadSavedDetailedResults(): Record<SeasonYear, DetailedRaceResult[]> {
  return loadInitialChampionshipDataUseCase.loadSavedResults();
}

/**
 * Remove any leftover interactive-sync review snapshot persisted by older builds.
 * Delegates storage cleanup to Championship Infrastructure Layer.
 */
export function clearStaleSyncReview(): void {
  championshipStorage.clearStaleSyncReview();
}

/**
 * Save updated results to localStorage.
 * Delegates storage persistence to Championship Infrastructure Layer.
 */
export function persistDetailedResults(data: Record<SeasonYear, DetailedRaceResult[]>): void {
  championshipStorage.persistRawDetailedResults(data);
}

/**
 * Load or initialize sync metadata.
 * Delegates to Championship Application Use Case.
 */
export function loadSyncMetadata(): F1SyncMetadata {
  return loadInitialChampionshipDataUseCase.loadMetadata();
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
 * Delegates full season synchronization to Championship Application Use Case.
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
  const result = await syncSeasonResultsUseCase.execute(season, existingResults);
  return {
    success: result.success,
    partial: result.partial,
    results: result.results,
    message: result.message,
    source: result.source,
  };
}
