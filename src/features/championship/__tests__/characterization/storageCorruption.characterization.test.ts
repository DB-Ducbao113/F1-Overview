import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  loadSavedDetailedResults,
  persistDetailedResults,
  loadSyncMetadata,
  persistSyncMetadata,
  clearStaleSyncReview,
  INITIAL_DETAILED_RESULTS,
} from '../../../../services/f1DataService';
import { attachOpenF1SprintResults } from '../../../../data/championship/openF1SprintBridge';

describe('Characterization Baseline — Storage Corruption & Recovery', () => {
  const STORAGE_DETAILED_KEY = 'f1_detailed_results_v3';
  const STORAGE_SYNC_META_KEY = 'f1_sync_meta_v2';
  const STORAGE_SYNC_REVIEW_KEY = 'f1_sync_review_v1';
  const STORAGE_DISMISSED_KEY = 'f1_sync_review_dismissed_v1';

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

  const expectedFallback = attachOpenF1SprintResults(INITIAL_DETAILED_RESULTS);

  beforeEach(() => {
    mockStorage.clear();
    vi.stubGlobal('localStorage', fakeLocalStorage);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  describe('loadSavedDetailedResults Error Recovery', () => {
    it('recovers gracefully from corrupted JSON in localStorage', () => {
      mockStorage.set(STORAGE_DETAILED_KEY, '{"2026": [ INVALID_SYNTAX ...');

      const results = loadSavedDetailedResults();

      // Must not throw, and must return initial baseline detailed results (with OpenF1 sprints attached)
      expect(results[2024]).toBeDefined();
      expect(results[2026]).toBeDefined();
      expect(results[2026].length).toBe(expectedFallback[2026].length);
    });

    it('recovers gracefully when localStorage throws SecurityError or access denied', () => {
      fakeLocalStorage.getItem.mockImplementationOnce(() => {
        throw new Error('SecurityError: The operation is insecure.');
      });

      const results = loadSavedDetailedResults();

      expect(results[2026]).toBeDefined();
      expect(results[2026].length).toBe(expectedFallback[2026].length);
    });

    it('safely handles empty or missing storage', () => {
      const results = loadSavedDetailedResults();
      expect(results[2026].length).toBe(expectedFallback[2026].length);
    });
  });

  describe('persistDetailedResults Error Recovery', () => {
    it('safely catches QuotaExceededError without bubbling unhandled exception to UI', () => {
      fakeLocalStorage.setItem.mockImplementationOnce(() => {
        throw new Error('QuotaExceededError: DomException 22');
      });

      expect(() => {
        persistDetailedResults(INITIAL_DETAILED_RESULTS);
      }).not.toThrow();
    });
  });

  describe('loadSyncMetadata Error Recovery', () => {
    it('recovers with default metadata when stored metadata JSON is corrupted', () => {
      mockStorage.set(STORAGE_SYNC_META_KEY, '{"bad_json:');

      const meta = loadSyncMetadata();

      expect(meta.syncStatus).toBe('idle');
      expect(meta.source).toBe('Local snapshot');
      expect(meta.lastSyncTimestamp).toBe('Chưa đồng bộ');
    });

    it('persists and retrieves valid sync metadata cleanly', () => {
      const testMeta = {
        lastSyncTimestamp: '2026-10-30 12:00:00',
        syncStatus: 'success' as const,
        source: 'Jolpica F1 API',
        completedRoundsCount: 18,
        message: 'Đã đồng bộ 18 chặng.',
      };

      persistSyncMetadata(testMeta);
      const loaded = loadSyncMetadata();

      expect(loaded).toEqual(testMeta);
    });
  });

  describe('clearStaleSyncReview', () => {
    it('removes legacy review keys from localStorage cleanly', () => {
      mockStorage.set(STORAGE_SYNC_REVIEW_KEY, '{"legacy": true}');
      mockStorage.set(STORAGE_DISMISSED_KEY, 'true');

      clearStaleSyncReview();

      expect(mockStorage.get(STORAGE_SYNC_REVIEW_KEY)).toBeUndefined();
      expect(mockStorage.get(STORAGE_DISMISSED_KEY)).toBeUndefined();
    });
  });
});
