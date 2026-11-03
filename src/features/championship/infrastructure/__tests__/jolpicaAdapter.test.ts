import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  buildJolpicaUrl,
  fetchJolpicaPage,
  fetchAllRacesFromJolpica,
  PartialSyncError,
  retryDelayMs,
  JolpicaAdapter,
  jolpicaAdapter,
} from '../api/jolpicaAdapter';

describe('Jolpica API Infrastructure Adapter', () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  describe('URL Construction', () => {
    it('constructs valid Jolpica query url with season, type, limit, and offset', () => {
      const url = buildJolpicaUrl(2026, 'results', 100, 0);
      expect(url).toContain('2026');
      expect(url).toContain('results.json');
      expect(url).toContain('limit=100');
      expect(url).toContain('offset=0');
    });

    it('constructs valid sprint url', () => {
      const url = buildJolpicaUrl(2024, 'sprint', 50, 50);
      expect(url).toContain('2024');
      expect(url).toContain('sprint.json');
      expect(url).toContain('limit=50');
      expect(url).toContain('offset=50');
    });
  });

  describe('Retry and Delay Logic', () => {
    it('uses Retry-After header when provided with numeric seconds', () => {
      expect(retryDelayMs(0, '5')).toBe(5000);
      expect(retryDelayMs(1, '10')).toBe(10000);
      expect(retryDelayMs(2, '60')).toBe(30000); // capped at 30,000ms
    });

    it('falls back to exponential backoff when Retry-After is absent or invalid', () => {
      expect(retryDelayMs(0, null)).toBe(1000);
      expect(retryDelayMs(1, null)).toBe(2000);
      expect(retryDelayMs(2, null)).toBe(4000);
      expect(retryDelayMs(0, 'invalid')).toBe(1000);
    });
  });

  describe('fetchJolpicaPage Resilience', () => {
    it('returns response successfully on 200 OK', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        headers: new Headers(),
        json: async () => ({}),
      } as Response);

      const res = await fetchJolpicaPage('/api/test');
      expect(res.ok).toBe(true);
      expect(res.status).toBe(200);
    });

    it('retries on 429 and succeeds if subsequent attempt succeeds', async () => {
      let callCount = 0;
      globalThis.fetch = vi.fn().mockImplementation(async () => {
        callCount++;
        if (callCount === 1) {
          return {
            ok: false,
            status: 429,
            headers: new Headers({ 'Retry-After': '0' }),
          } as Response;
        }
        return {
          ok: true,
          status: 200,
          headers: new Headers(),
          json: async () => ({ test: true }),
        } as Response;
      });

      const res = await fetchJolpicaPage('/api/test', {
        maxAttempts: 3,
        totalBudgetMs: 5000,
        requestTimeoutMs: 1000,
      });

      expect(callCount).toBe(2);
      expect(res.ok).toBe(true);
    });

    it('throws error immediately on non-retryable 404 client error', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        headers: new Headers(),
      } as Response);

      await expect(
        fetchJolpicaPage('/api/test', {
          maxAttempts: 3,
          totalBudgetMs: 5000,
          requestTimeoutMs: 1000,
        }),
      ).rejects.toThrow('Jolpica endpoint returned 404');
    });

    it('throws when retry budget is exhausted', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 503,
        headers: new Headers({ 'Retry-After': '10' }),
      } as Response);

      await expect(
        fetchJolpicaPage('/api/test', {
          maxAttempts: 3,
          totalBudgetMs: 200, // Small budget that cannot cover the 10s delay
          requestTimeoutMs: 100,
        }),
      ).rejects.toThrow('retry budget exhausted');
    });
  });

  describe('fetchAllRacesFromJolpica Pagination & Deduplication', () => {
    it('fetches and sorts multiple rounds across pages', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        headers: new Headers(),
        json: async () => ({
          MRData: {
            total: '2',
            RaceTable: {
              Races: [
                {
                  round: '2',
                  raceName: 'Round 2 GP',
                  date: '2026-03-22',
                  Results: [{ position: '1', Driver: { driverId: 'norris' }, points: '25' }],
                },
                {
                  round: '1',
                  raceName: 'Round 1 GP',
                  date: '2026-03-08',
                  Results: [{ position: '1', Driver: { driverId: 'verstappen' }, points: '25' }],
                },
              ],
            },
          },
        }),
      } as Response);

      const races = await fetchAllRacesFromJolpica(2026, 'results');
      expect(races).toHaveLength(2);
      expect(races[0].round).toBe('1');
      expect(races[1].round).toBe('2');
    });

    it('deduplicates drivers within the same round', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        headers: new Headers(),
        json: async () => ({
          MRData: {
            total: '1',
            RaceTable: {
              Races: [
                {
                  round: '1',
                  raceName: 'Round 1 GP',
                  date: '2026-03-08',
                  Results: [
                    { position: '1', Driver: { driverId: 'verstappen' }, points: '25' },
                    { position: '1', Driver: { driverId: 'verstappen' }, points: '25' }, // Duplicate
                  ],
                },
              ],
            },
          },
        }),
      } as Response);

      const races = await fetchAllRacesFromJolpica(2026, 'results');
      expect(races[0].Results).toHaveLength(1);
    });

    it('throws PartialSyncError when second page fails after first page succeeded', async () => {
      let pageCall = 0;
      globalThis.fetch = vi.fn().mockImplementation(async () => {
        pageCall++;
        if (pageCall === 1) {
          return {
            ok: true,
            status: 200,
            headers: new Headers(),
            json: async () => ({
              MRData: {
                total: '150', // indicates more than 100 results, triggers second page
                limit: '100',
                offset: '0',
                RaceTable: {
                  Races: [{ round: '1', raceName: 'R1', Results: [] }],
                },
              },
            }),
          } as Response;
        }
        return {
          ok: false,
          status: 500,
          headers: new Headers(),
        } as Response;
      });

      await expect(fetchAllRacesFromJolpica(2026, 'results')).rejects.toThrow(PartialSyncError);
    });

    it('throws PartialSyncError if total exceeds the 500 entry page cap', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        headers: new Headers(),
        json: async () => ({
          MRData: {
            total: '600', // exceeds 5 * 100 = 500
            RaceTable: { Races: [] },
          },
        }),
      } as Response);

      await expect(fetchAllRacesFromJolpica(2026, 'results')).rejects.toThrow(PartialSyncError);
    });
  });

  describe('JolpicaAdapter Class Instance', () => {
    it('implements IJolpicaAdapter methods correctly', async () => {
      const adapter = new JolpicaAdapter();
      expect(adapter).toBeInstanceOf(JolpicaAdapter);
      expect(jolpicaAdapter).toBeDefined();

      const url = adapter.buildUrl(2026, 'results', 10, 0);
      expect(url).toContain('2026');
    });
  });
});
