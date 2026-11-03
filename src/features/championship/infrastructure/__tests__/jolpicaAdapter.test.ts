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

    it('handles exactly 500 records across 5 full pages without truncation', async () => {
      let fetchCount = 0;
      globalThis.fetch = vi.fn().mockImplementation(async (url: string) => {
        fetchCount++;
        const parsedUrl = new URL(url, 'http://localhost');
        const offset = parseInt(parsedUrl.searchParams.get('offset') || '0', 10);
        const roundNum = offset / 100 + 1;
        return {
          ok: true,
          status: 200,
          headers: new Headers(),
          json: async () => ({
            MRData: {
              total: '500',
              limit: '100',
              offset: String(offset),
              RaceTable: {
                Races: [
                  {
                    round: String(roundNum),
                    raceName: `Round ${roundNum}`,
                    Results: Array.from({ length: 100 }, (_, i) => ({
                      position: String(i + 1),
                      Driver: { driverId: `driver_${roundNum}_${i}` },
                      points: '1',
                    })),
                  },
                ],
              },
            },
          }),
        } as Response;
      });

      const races = await fetchAllRacesFromJolpica(2026, 'results');
      expect(fetchCount).toBe(5);
      expect(races).toHaveLength(5);
      const totalResults = races.reduce((sum, r) => sum + (r.Results?.length || 0), 0);
      expect(totalResults).toBe(500);
    });

    it('handles more than 500 records (e.g. 528 records for a 24-round 22-car grid)', async () => {
      let fetchCount = 0;
      globalThis.fetch = vi.fn().mockImplementation(async (url: string) => {
        fetchCount++;
        const parsedUrl = new URL(url, 'http://localhost');
        const offset = parseInt(parsedUrl.searchParams.get('offset') || '0', 10);
        const isLastPage = offset === 500;
        const count = isLastPage ? 28 : 100;
        const roundNum = Math.floor(offset / 100) + 1;
        return {
          ok: true,
          status: 200,
          headers: new Headers(),
          json: async () => ({
            MRData: {
              total: '528',
              limit: '100',
              offset: String(offset),
              RaceTable: {
                Races: [
                  {
                    round: String(roundNum),
                    raceName: `Round ${roundNum}`,
                    Results: Array.from({ length: count }, (_, i) => ({
                      position: String(i + 1),
                      Driver: { driverId: `driver_${roundNum}_${i}` },
                      points: '1',
                    })),
                  },
                ],
              },
            },
          }),
        } as Response;
      });

      const races = await fetchAllRacesFromJolpica(2026, 'results');
      expect(fetchCount).toBe(6);
      expect(races).toHaveLength(6);
      const totalResults = races.reduce((sum, r) => sum + (r.Results?.length || 0), 0);
      expect(totalResults).toBe(528);
    });

    it('terminates cleanly on incomplete last page without requesting unnecessary pages', async () => {
      let fetchCount = 0;
      globalThis.fetch = vi.fn().mockImplementation(async (url: string) => {
        fetchCount++;
        const parsedUrl = new URL(url, 'http://localhost');
        const offset = parseInt(parsedUrl.searchParams.get('offset') || '0', 10);
        const count = offset === 0 ? 100 : 45;
        return {
          ok: true,
          status: 200,
          headers: new Headers(),
          json: async () => ({
            MRData: {
              total: '145',
              limit: '100',
              offset: String(offset),
              RaceTable: {
                Races: [
                  {
                    round: offset === 0 ? '1' : '2',
                    raceName: 'Race',
                    Results: Array.from({ length: count }, (_, i) => ({
                      position: String(i + 1),
                      Driver: { driverId: `d_${offset}_${i}` },
                    })),
                  },
                ],
              },
            },
          }),
        } as Response;
      });

      const races = await fetchAllRacesFromJolpica(2026, 'results');
      expect(fetchCount).toBe(2);
      expect(races).toHaveLength(2);
    });

    it('handles inconsistent pagination metadata safely when total is missing or 0', async () => {
      let fetchCount = 0;
      globalThis.fetch = vi.fn().mockImplementation(async () => {
        fetchCount++;
        return {
          ok: true,
          status: 200,
          headers: new Headers(),
          json: async () => ({
            MRData: {
              total: '0', // Inconsistent: 0 total but 10 results returned
              limit: '100',
              offset: '0',
              RaceTable: {
                Races: [
                  {
                    round: '1',
                    raceName: 'Race 1',
                    Results: Array.from({ length: 10 }, (_, i) => ({
                      position: String(i + 1),
                      Driver: { driverId: `d_${i}` },
                    })),
                  },
                ],
              },
            },
          }),
        } as Response;
      });

      const races = await fetchAllRacesFromJolpica(2026, 'results');
      expect(fetchCount).toBe(1);
      expect(races).toHaveLength(1);
      expect(races[0].Results).toHaveLength(10);
    });

    it('merges duplicate entries across page boundaries without duplicate drivers', async () => {
      let fetchCount = 0;
      globalThis.fetch = vi.fn().mockImplementation(async (url: string) => {
        fetchCount++;
        const parsedUrl = new URL(url, 'http://localhost');
        const offset = parseInt(parsedUrl.searchParams.get('offset') || '0', 10);
        if (offset === 0) {
          // Page 1: Round 5 has drivers 1..12
          return {
            ok: true,
            status: 200,
            headers: new Headers(),
            json: async () => ({
              MRData: {
                total: '150',
                limit: '100',
                offset: '0',
                RaceTable: {
                  Races: [
                    {
                      round: '5',
                      raceName: 'Round 5 GP',
                      Results: Array.from({ length: 12 }, (_, i) => ({
                        position: String(i + 1),
                        Driver: { driverId: `driver_${i + 1}` },
                      })),
                    },
                  ],
                },
              },
            }),
          } as Response;
        }

        // Page 2: Round 5 has drivers 11..22 (overlapping 11, 12, plus new 13..22)
        return {
          ok: true,
          status: 200,
          headers: new Headers(),
          json: async () => ({
            MRData: {
              total: '150',
              limit: '100',
              offset: '100',
              RaceTable: {
                Races: [
                  {
                    round: '5',
                    raceName: 'Round 5 GP',
                    Results: Array.from({ length: 12 }, (_, i) => ({
                      position: String(i + 11),
                      Driver: { driverId: `driver_${i + 11}` },
                    })),
                  },
                ],
              },
            },
          }),
        } as Response;
      });

      const races = await fetchAllRacesFromJolpica(2026, 'results');
      expect(fetchCount).toBe(2);
      expect(races).toHaveLength(1);
      expect(races[0].round).toBe('5');
      // Overlapping drivers 11 and 12 must not be duplicated; exactly 22 drivers
      expect(races[0].Results).toHaveLength(22);
      const driverIds = races[0].Results?.map((r) => r.Driver?.driverId);
      expect(new Set(driverIds).size).toBe(22);
    });

    it('throws PartialSyncError when failure occurs after several successful pages', async () => {
      let pageCall = 0;
      globalThis.fetch = vi.fn().mockImplementation(async () => {
        pageCall++;
        if (pageCall <= 2) {
          return {
            ok: true,
            status: 200,
            headers: new Headers(),
            json: async () => ({
              MRData: {
                total: '350',
                limit: '100',
                offset: String((pageCall - 1) * 100),
                RaceTable: {
                  Races: [{ round: String(pageCall), raceName: `R${pageCall}`, Results: [] }],
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

      let caughtError: any;
      try {
        await fetchAllRacesFromJolpica(2026, 'results');
      } catch (err) {
        caughtError = err;
      }

      expect(caughtError).toBeInstanceOf(PartialSyncError);
      expect(caughtError.loadedPages).toBe(2);
      expect(caughtError.message).toContain('failed after 2 page(s) loaded');
    });

    it('throws PartialSyncError if total exceeds the 1,000 entry page cap', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        headers: new Headers(),
        json: async () => ({
          MRData: {
            total: '1200', // exceeds 10 * 100 = 1000
            RaceTable: { Races: [] },
          },
        }),
      } as Response);

      await expect(fetchAllRacesFromJolpica(2026, 'results')).rejects.toThrow(PartialSyncError);
    });

    it('throws PartialSyncError when upstream declared 528 records but unexpectedly returns an empty page after 400 records', async () => {
      let pageCall = 0;
      globalThis.fetch = vi.fn().mockImplementation(async (url: string) => {
        pageCall++;
        const parsedUrl = new URL(url, 'http://localhost');
        const offset = parseInt(parsedUrl.searchParams.get('offset') || '0', 10);

        if (offset < 400) {
          // Pages 1..4 return 100 results each (400 total)
          return {
            ok: true,
            status: 200,
            headers: new Headers(),
            json: async () => ({
              MRData: {
                total: '528',
                limit: '100',
                offset: String(offset),
                RaceTable: {
                  Races: [
                    {
                      round: String(Math.floor(offset / 100) + 1),
                      raceName: `GP ${Math.floor(offset / 100) + 1}`,
                      Results: Array.from({ length: 100 }, (_, i) => ({
                        position: String(i + 1),
                        Driver: { driverId: `drv_${offset}_${i}` },
                      })),
                    },
                  ],
                },
              },
            }),
          } as Response;
        }

        // Page 5 (offset 400) unexpectedly returns an empty list while total is 528
        return {
          ok: true,
          status: 200,
          headers: new Headers(),
          json: async () => ({
            MRData: {
              total: '528',
              limit: '100',
              offset: '400',
              RaceTable: {
                Races: [],
              },
            },
          }),
        } as Response;
      });

      let caught: any;
      try {
        await fetchAllRacesFromJolpica(2026, 'results');
      } catch (err) {
        caught = err;
      }

      expect(caught).toBeInstanceOf(PartialSyncError);
      expect(caught.message).toContain('unexpected empty batch');
      expect(caught.loadedPages).toBe(4);
      expect(pageCall).toBe(5);
    });

    it('throws PartialSyncError when upstream returns an inconsistent offset', async () => {
      globalThis.fetch = vi.fn().mockImplementation(async (url: string) => {
        const parsedUrl = new URL(url, 'http://localhost');
        const offset = parseInt(parsedUrl.searchParams.get('offset') || '0', 10);
        return {
          ok: true,
          status: 200,
          headers: new Headers(),
          json: async () => ({
            MRData: {
              total: '200',
              limit: '100',
              // Return wrong offset 0 when offset 100 is requested
              offset: offset === 100 ? '0' : '0',
              RaceTable: {
                Races: [{ round: '1', Results: [{ Driver: { driverId: 'd1' } }] }],
              },
            },
          }),
        } as Response;
      });

      let caught: any;
      try {
        await fetchAllRacesFromJolpica(2026, 'results');
      } catch (err) {
        caught = err;
      }

      expect(caught).toBeInstanceOf(PartialSyncError);
      expect(caught.message).toContain('inconsistent offset');
    });

    it('throws PartialSyncError when total fluctuates mid-sync below accumulated records', async () => {
      let pageCall = 0;
      globalThis.fetch = vi.fn().mockImplementation(async (url: string) => {
        pageCall++;
        const parsedUrl = new URL(url, 'http://localhost');
        const offset = parseInt(parsedUrl.searchParams.get('offset') || '0', 10);

        return {
          ok: true,
          status: 200,
          headers: new Headers(),
          json: async () => ({
            MRData: {
              // Page 1 says 300, Page 2 says 50 (below the 100 already accumulated)
              total: offset === 0 ? '300' : '50',
              limit: '100',
              offset: String(offset),
              RaceTable: {
                Races: [
                  {
                    round: String(pageCall),
                    Results: Array.from({ length: 100 }, (_, i) => ({
                      position: String(i + 1),
                      Driver: { driverId: `drv_${offset}_${i}` },
                    })),
                  },
                ],
              },
            },
          }),
        } as Response;
      });

      let caught: any;
      try {
        await fetchAllRacesFromJolpica(2026, 'results');
      } catch (err) {
        caught = err;
      }

      expect(caught).toBeInstanceOf(PartialSyncError);
      expect(caught.message).toContain('total fluctuated');
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
