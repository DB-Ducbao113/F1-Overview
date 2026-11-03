import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  ChampionshipLocalStorage,
  championshipStorage,
  STORAGE_DETAILED_RESULTS_KEY,
  STORAGE_SYNC_META_KEY,
  STORAGE_SYNC_REVIEW_KEY,
  STORAGE_DISMISSED_REVIEW_KEY,
} from '../storage/championshipLocalStorage';
import { DetailedRaceResult, F1SyncMetadata, SeasonYear } from '../../../../types';

describe('Championship Local Storage Infrastructure Repository', () => {
  const mockStorage = new Map<string, string>();
  const fakeLocalStorage = {
    getItem: vi.fn((key: string) => mockStorage.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => {
      mockStorage.set(key, String(value));
    }),
    removeItem: vi.fn((key: string) => {
      mockStorage.delete(key);
    }),
    clear: vi.fn(() => {
      mockStorage.clear();
    }),
    get length() {
      return mockStorage.size;
    },
    key: vi.fn((index: number) => Array.from(mockStorage.keys())[index] ?? null),
  };

  beforeEach(() => {
    mockStorage.clear();
    vi.stubGlobal('localStorage', fakeLocalStorage);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  describe('Storage Keys Integrity', () => {
    it('uses exact backward-compatible versioned localStorage keys', () => {
      const storage = new ChampionshipLocalStorage();
      expect(storage.keys.detailedResults).toBe('f1_detailed_results_v3');
      expect(storage.keys.syncMeta).toBe('f1_sync_meta_v2');
      expect(storage.keys.syncReview).toBe('f1_sync_review_v1');
      expect(storage.keys.dismissedReview).toBe('f1_sync_review_dismissed_v1');

      expect(STORAGE_DETAILED_RESULTS_KEY).toBe('f1_detailed_results_v3');
      expect(STORAGE_SYNC_META_KEY).toBe('f1_sync_meta_v2');
      expect(STORAGE_SYNC_REVIEW_KEY).toBe('f1_sync_review_v1');
      expect(STORAGE_DISMISSED_REVIEW_KEY).toBe('f1_sync_review_dismissed_v1');
    });
  });

  describe('Detailed Results Persistence & Hydration', () => {
    const sampleResults: Record<SeasonYear, DetailedRaceResult[]> = {
      2024: [],
      2025: [],
      2026: [
        {
          id: 'race-2026-r1-bahrain',
          season: 2026,
          round: 1,
          grandPrix: 'Bahrain Grand Prix',
          officialName: 'Formula 1 Bahrain Grand Prix 2026',
          circuit: 'Bahrain International Circuit',
          date: '2026-03-02',
          status: 'completed',
          lapsTotal: 57,
          entries: [],
        },
      ],
    };

    it('persists and loads raw detailed results cleanly', () => {
      const storage = new ChampionshipLocalStorage();
      storage.persistRawDetailedResults(sampleResults);

      const loaded = storage.loadRawDetailedResults();
      expect(loaded).toBeDefined();
      expect(loaded?.[2026]).toHaveLength(1);
      expect(loaded?.[2026][0].id).toBe('race-2026-r1-bahrain');
    });

    it('returns null when storage is empty', () => {
      const storage = new ChampionshipLocalStorage();
      const loaded = storage.loadRawDetailedResults();
      expect(loaded).toBeNull();
    });

    it('recovers gracefully with null when stored JSON is corrupted', () => {
      mockStorage.set(STORAGE_DETAILED_RESULTS_KEY, '{ invalid_json_syntax...');
      const storage = new ChampionshipLocalStorage();

      expect(() => {
        const loaded = storage.loadRawDetailedResults();
        expect(loaded).toBeNull();
      }).not.toThrow();
    });

    it('silently absorbs QuotaExceededError when persisting', () => {
      fakeLocalStorage.setItem.mockImplementationOnce(() => {
        throw new Error('QuotaExceededError: DOM Exception 22');
      });

      const storage = new ChampionshipLocalStorage();
      expect(() => {
        storage.persistRawDetailedResults(sampleResults);
      }).not.toThrow();
    });
  });

  describe('Sync Metadata Persistence & Hydration', () => {
    const sampleMeta: F1SyncMetadata = {
      lastSyncTimestamp: '2026-11-03 09:00:00',
      syncStatus: 'success',
      source: 'Jolpica F1 API',
      completedRoundsCount: 24,
      message: 'All rounds synchronized',
    };

    it('persists and loads sync metadata cleanly', () => {
      const storage = new ChampionshipLocalStorage();
      storage.persistSyncMetadata(sampleMeta);

      const loaded = storage.loadSyncMetadata();
      expect(loaded).toEqual(sampleMeta);
    });

    it('returns null on empty storage', () => {
      const storage = new ChampionshipLocalStorage();
      expect(storage.loadSyncMetadata()).toBeNull();
    });

    it('returns null when sync metadata JSON is corrupted', () => {
      mockStorage.set(STORAGE_SYNC_META_KEY, 'bad_meta_json');
      const storage = new ChampionshipLocalStorage();

      expect(() => {
        const loaded = storage.loadSyncMetadata();
        expect(loaded).toBeNull();
      }).not.toThrow();
    });
  });

  describe('Review Snapshot Cleanup', () => {
    it('removes both sync review and dismissed review keys', () => {
      mockStorage.set(STORAGE_SYNC_REVIEW_KEY, '{"stale": true}');
      mockStorage.set(STORAGE_DISMISSED_REVIEW_KEY, 'true');

      const storage = new ChampionshipLocalStorage();
      storage.clearStaleSyncReview();

      expect(mockStorage.has(STORAGE_SYNC_REVIEW_KEY)).toBe(false);
      expect(mockStorage.has(STORAGE_DISMISSED_REVIEW_KEY)).toBe(false);
    });

    it('does not throw when removeItem fails or localStorage is restricted', () => {
      fakeLocalStorage.removeItem.mockImplementationOnce(() => {
        throw new Error('SecurityError: Access denied');
      });

      const storage = new ChampionshipLocalStorage();
      expect(() => {
        storage.clearStaleSyncReview();
      }).not.toThrow();
    });
  });

  describe('championshipStorage Singleton Export', () => {
    it('exports a valid ChampionshipLocalStorage singleton', () => {
      expect(championshipStorage).toBeInstanceOf(ChampionshipLocalStorage);
    });
  });
});
