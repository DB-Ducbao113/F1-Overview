import { DetailedRaceResult, F1SyncMetadata, SeasonYear } from '../../../../types';
import {
  ChampionshipStorageKeys,
  IChampionshipStorage,
} from '../contracts/infrastructureContracts';

export const STORAGE_DETAILED_RESULTS_KEY = 'f1_detailed_results_v3';
export const STORAGE_SYNC_META_KEY = 'f1_sync_meta_v2';
export const STORAGE_SYNC_REVIEW_KEY = 'f1_sync_review_v1';
export const STORAGE_DISMISSED_REVIEW_KEY = 'f1_sync_review_dismissed_v1';

export const CHAMPIONSHIP_STORAGE_KEYS: ChampionshipStorageKeys = {
  detailedResults: STORAGE_DETAILED_RESULTS_KEY,
  syncMeta: STORAGE_SYNC_META_KEY,
  syncReview: STORAGE_SYNC_REVIEW_KEY,
  dismissedReview: STORAGE_DISMISSED_REVIEW_KEY,
} as const;

/**
 * Concrete browser localStorage persistence adapter for Championship data.
 * Fully encapsulated: resilient against quota errors, security restrictions,
 * and JSON syntax corruption.
 */
export class ChampionshipLocalStorage implements IChampionshipStorage {
  readonly keys = CHAMPIONSHIP_STORAGE_KEYS;

  loadRawDetailedResults(): Record<SeasonYear, DetailedRaceResult[]> | null {
    try {
      if (typeof localStorage === 'undefined') return null;
      const raw = localStorage.getItem(this.keys.detailedResults);
      if (!raw) return null;
      return JSON.parse(raw) as Record<SeasonYear, DetailedRaceResult[]>;
    } catch {
      // Corruption, SecurityError, or missing storage: return null to let caller fallback safely
      return null;
    }
  }

  persistRawDetailedResults(data: Record<SeasonYear, DetailedRaceResult[]>): void {
    try {
      if (typeof localStorage === 'undefined') return;
      localStorage.setItem(this.keys.detailedResults, JSON.stringify(data));
    } catch {
      // Ignore QuotaExceededError or security restrictions gracefully
    }
  }

  loadSyncMetadata(): F1SyncMetadata | null {
    try {
      if (typeof localStorage === 'undefined') return null;
      const raw = localStorage.getItem(this.keys.syncMeta);
      if (!raw) return null;
      return JSON.parse(raw) as F1SyncMetadata;
    } catch {
      return null;
    }
  }

  persistSyncMetadata(meta: F1SyncMetadata): void {
    try {
      if (typeof localStorage === 'undefined') return;
      localStorage.setItem(this.keys.syncMeta, JSON.stringify(meta));
    } catch {
      // Ignore storage errors gracefully
    }
  }

  clearStaleSyncReview(): void {
    try {
      if (typeof localStorage === 'undefined') return;
      localStorage.removeItem(this.keys.syncReview);
      localStorage.removeItem(this.keys.dismissedReview);
    } catch {
      // Continue without error if browser storage is unavailable
    }
  }
}

export const championshipStorage = new ChampionshipLocalStorage();
