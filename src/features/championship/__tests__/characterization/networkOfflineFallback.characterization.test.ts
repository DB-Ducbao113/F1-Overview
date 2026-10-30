import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { syncF1SeasonData } from '../../../../services/f1DataService';
import { FIXTURE_COMPLETED_RACE_2026_R18 } from '../fixtures/goldenMasterFixtures';

describe('Characterization Baseline — Network Timeout & Offline Fallback', () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('preserves existing results and reports failure honestly when network is offline', async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new Error('Failed to fetch (offline)'));

    const existingRaces = [FIXTURE_COMPLETED_RACE_2026_R18];
    const syncRes = await syncF1SeasonData(2026, existingRaces);

    // Must report false for success, and return existing races intact
    expect(syncRes.success).toBe(false);
    expect(syncRes.source).toBe('Local saved snapshot');
    expect(syncRes.results).toEqual(existingRaces);
    expect(syncRes.message).toContain('Không thể kết nối Jolpica');
  });

  it('preserves existing results when upstream endpoint returns 500 internal server error', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      headers: new Headers(),
    } as Response);

    const existingRaces = [FIXTURE_COMPLETED_RACE_2026_R18];
    const syncRes = await syncF1SeasonData(2026, existingRaces);

    expect(syncRes.success).toBe(false);
    expect(syncRes.source).toBe('Local saved snapshot');
    expect(syncRes.results).toEqual(existingRaces);
  });

  it('never reports success when upstream returns an empty payload', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers(),
      json: async () => ({ MRData: { RaceTable: { Races: [] }, total: '0' } }),
    } as Response);

    const existingRaces = [FIXTURE_COMPLETED_RACE_2026_R18];
    const syncRes = await syncF1SeasonData(2026, existingRaces);

    expect(syncRes.success).toBe(false);
    expect(syncRes.results).toEqual(existingRaces);
  });
});
