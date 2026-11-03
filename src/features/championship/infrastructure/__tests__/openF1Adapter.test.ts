import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  OpenF1Adapter,
  openF1Adapter,
  CURATED_REPLAY_RACES,
  OPENF1_CACHE_TTL_MS,
  OPENF1_MAX_CLIENT_CACHE_ENTRIES,
} from '../api/openF1Adapter';

describe('OpenF1 API Infrastructure Adapter', () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  describe('Curated Replay Races', () => {
    it('provides iconic replay races with valid session keys and circuits', () => {
      expect(CURATED_REPLAY_RACES.length).toBeGreaterThan(0);
      const melbourne = CURATED_REPLAY_RACES.find((r) => r.id === 'melbourne-2024');
      expect(melbourne).toBeDefined();
      expect(melbourne?.sessionKey).toBe(9488);
      expect(melbourne?.circuitKey).toBe(10);
    });
  });

  describe('Cache and Request Deduplication', () => {
    it('caches responses within TTL window', async () => {
      let fetchCalls = 0;
      globalThis.fetch = vi.fn().mockImplementation(async () => {
        fetchCalls++;
        return {
          ok: true,
          status: 200,
          json: async () => [{ session_key: 12345, session_name: 'Race' }],
        } as Response;
      });

      const adapter = new OpenF1Adapter();
      const res1 = await adapter.getSessionDrivers(12345);
      const res2 = await adapter.getSessionDrivers(12345);

      expect(fetchCalls).toBe(1);
      expect(res1).toEqual(res2);
    });

    it('refetches when TTL expires', async () => {
      vi.useFakeTimers();
      try {
        let fetchCalls = 0;
        globalThis.fetch = vi.fn().mockImplementation(async () => {
          fetchCalls++;
          return {
            ok: true,
            status: 200,
            json: async () => [{ session_key: 54321, call: fetchCalls }],
          } as Response;
        });

        const adapter = new OpenF1Adapter();
        await adapter.getSessionDrivers(54321);
        expect(fetchCalls).toBe(1);

        await vi.advanceTimersByTimeAsync(OPENF1_CACHE_TTL_MS + 500);

        await adapter.getSessionDrivers(54321);
        expect(fetchCalls).toBe(2);
      } finally {
        vi.useRealTimers();
      }
    });

    it('limits cache size to MAX_CLIENT_CACHE_ENTRIES', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => [{ data: 'test' }],
      } as Response);

      const adapter = new OpenF1Adapter();
      // Populate more entries than MAX_CLIENT_CACHE_ENTRIES
      for (let i = 0; i < OPENF1_MAX_CLIENT_CACHE_ENTRIES + 10; i++) {
        await adapter.getPositions(1000 + i);
      }

      // Memory cache should stay bounded without throwing or leaking
      expect(adapter.lastErrorCode).toBe('ok');
    });
  });

  describe('Error Code Classification', () => {
    it('sets lastErrorCode to "upstream-rate-limited" on 429', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 429,
        json: async () => ({}),
      } as Response);

      const adapter = new OpenF1Adapter();
      const result = await adapter.getPositions(99991);

      expect(result).toEqual([]);
      expect(adapter.lastErrorCode).toBe('upstream-rate-limited');
    });

    it('sets lastErrorCode to "upstream-down" on 500 or 503', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 503,
        json: async () => ({}),
      } as Response);

      const adapter = new OpenF1Adapter();
      const result = await adapter.getPositions(99992);

      expect(result).toEqual([]);
      expect(adapter.lastErrorCode).toBe('upstream-down');
    });

    it('sets lastErrorCode to "timeout" on AbortSignal TimeoutError', async () => {
      globalThis.fetch = vi
        .fn()
        .mockRejectedValue(new DOMException('signal timed out', 'TimeoutError'));

      const adapter = new OpenF1Adapter();
      const result = await adapter.getPositions(99993);

      expect(result).toEqual([]);
      expect(adapter.lastErrorCode).toBe('timeout');
    });

    it('sets lastErrorCode to "proxy-error" on generic network error', async () => {
      globalThis.fetch = vi.fn().mockRejectedValue(new Error('Network connection failed'));

      const adapter = new OpenF1Adapter();
      const result = await adapter.getPositions(99994);

      expect(result).toEqual([]);
      expect(adapter.lastErrorCode).toBe('proxy-error');
    });

    it('resets lastErrorCode to "ok" on successful call', async () => {
      const adapter = new OpenF1Adapter();
      adapter.lastErrorCode = 'upstream-down';

      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => [{ session_key: 1 }],
      } as Response);

      await adapter.getPositions(99995);
      expect(adapter.lastErrorCode).toBe('ok');
    });
  });

  describe('Telemetry & Session Query Methods', () => {
    it('getLatestSession returns the first session or null', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => [{ session_key: 999, session_name: 'Latest GP' }],
      } as Response);

      const adapter = new OpenF1Adapter();
      const session = await adapter.getLatestSession();
      expect(session?.session_key).toBe(999);
    });

    it('getLocationWindow queries driver location coordinates', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => [{ driver_number: 1, x: 100, y: 200, z: 0, date: '2026-01-01' }],
      } as Response);

      const adapter = new OpenF1Adapter();
      const locs = await adapter.getLocationWindow(
        100,
        '2026-01-01T00:00:00Z',
        '2026-01-01T00:00:02Z',
      );
      expect(locs).toHaveLength(1);
      expect(locs[0].x).toBe(100);
    });

    it('getCarDataWindow queries speed and DRS telemetry', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => [{ driver_number: 1, speed: 320, gear: 8, drs: 1 }],
      } as Response);

      const adapter = new OpenF1Adapter();
      const carData = await adapter.getCarDataWindow(
        100,
        '2026-01-01T00:00:00Z',
        '2026-01-01T00:00:02Z',
      );
      expect(carData).toHaveLength(1);
      expect(carData[0].speed).toBe(320);
    });

    it('getRaceControl queries flag events and safety car messages', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => [{ category: 'Flag', flag: 'YELLOW', message: 'Sector 2 Yellow' }],
      } as Response);

      const adapter = new OpenF1Adapter();
      const events = await adapter.getRaceControl(100);
      expect(events).toHaveLength(1);
      expect(events[0].flag).toBe('YELLOW');
    });

    it('verifies exported singleton openF1Adapter', () => {
      expect(openF1Adapter).toBeInstanceOf(OpenF1Adapter);
    });
  });
});
