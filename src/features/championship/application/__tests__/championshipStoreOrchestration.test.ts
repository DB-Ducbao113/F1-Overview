import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useChampionshipStore } from '../../../../store/useChampionshipStore';
import { syncSeasonResultsUseCase } from '../useCases/syncSeasonResultsUseCase';

describe('Championship Store Orchestration & Concurrency Protection', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('initializes with default 2026 season, standings subtab, and drivers category', () => {
    const state = useChampionshipStore.getState();
    expect(state.selectedSeason).toBe(2026);
    expect(state.activeSubTab).toBe('standings');
    expect(state.standingsCategory).toBe('drivers');
    expect(state.detailedResults[2024]).toBeDefined();
    expect(state.detailedResults[2026]).toBeDefined();
    expect(state.calculatedStandings[2026]).toBeDefined();
  });

  it('updates selected tab and standings category cleanly', () => {
    const { setActiveSubTab, setStandingsCategory, setSelectedRaceRound } =
      useChampionshipStore.getState();

    setActiveSubTab('calendar');
    expect(useChampionshipStore.getState().activeSubTab).toBe('calendar');

    setStandingsCategory('constructors');
    expect(useChampionshipStore.getState().standingsCategory).toBe('constructors');

    setSelectedRaceRound(5);
    expect(useChampionshipStore.getState().selectedRaceRound).toBe(5);

    // Reset back
    setActiveSubTab('standings');
    setStandingsCategory('drivers');
    setSelectedRaceRound(null);
  });

  it('guards against duplicate concurrent sync operations for the same season', async () => {
    let executeCalls = 0;
    vi.spyOn(syncSeasonResultsUseCase, 'execute').mockImplementation(async () => {
      executeCalls++;
      // Simulate delay
      await new Promise((r) => setTimeout(r, 50));
      return {
        success: true,
        results: [],
        message: 'Sync OK',
        source: 'Jolpica F1 API',
        syncMetadata: {
          lastSyncTimestamp: '10:00:00',
          syncStatus: 'success',
          source: 'Jolpica F1 API',
          completedRoundsCount: 0,
        },
      };
    });

    const p1 = useChampionshipStore.getState().syncSeasonData(2026);
    const p2 = useChampionshipStore.getState().syncSeasonData(2026);

    await Promise.all([p1, p2]);

    // Should only call execute once because the second call was blocked while syncing
    expect(executeCalls).toBe(1);
  });

  it('cancels in-flight sync when season is switched', async () => {
    let aborted = false;
    vi.spyOn(syncSeasonResultsUseCase, 'execute').mockImplementation(
      async (_season, _races, options) => {
        return new Promise((resolve) => {
          options?.abortSignal?.addEventListener('abort', () => {
            aborted = true;
            resolve({
              success: false,
              results: [],
              message: 'Aborted',
              source: 'Cancelled',
              syncMetadata: {
                lastSyncTimestamp: '10:00:00',
                syncStatus: 'error',
                source: 'Cancelled',
                completedRoundsCount: 0,
              },
            });
          });
        });
      },
    );

    // Start sync for 2026
    const syncPromise = useChampionshipStore.getState().syncSeasonData(2026);

    // Immediately switch to 2024
    useChampionshipStore.getState().setSelectedSeason(2024);

    await syncPromise;

    expect(aborted).toBe(true);
    expect(useChampionshipStore.getState().selectedSeason).toBe(2024);
  });

  it('updates state on successful synchronization', async () => {
    vi.spyOn(syncSeasonResultsUseCase, 'execute').mockResolvedValueOnce({
      success: true,
      results: [],
      standings: {
        drivers: [],
        constructors: [],
      },
      message: 'Đã đồng bộ 24 chặng',
      source: 'Jolpica F1 API',
      syncMetadata: {
        lastSyncTimestamp: '10:05:00',
        syncStatus: 'success',
        source: 'Jolpica F1 API',
        completedRoundsCount: 24,
      },
    });

    await useChampionshipStore.getState().syncSeasonData(2026);

    const state = useChampionshipStore.getState();
    expect(state.syncMeta.syncStatus).toBe('success');
    expect(state.syncMeta.source).toBe('Jolpica F1 API');
    expect(state.syncMeta.completedRoundsCount).toBe(24);
  });
});
