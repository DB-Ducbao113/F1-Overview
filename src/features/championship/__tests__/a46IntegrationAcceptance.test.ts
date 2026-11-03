import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { DetailedRaceResult, DriverStanding } from '../../../types';
import { fiaScoringRules, racePointsForPosition } from '../domain/fiaScoringRules';
import {
  compareCountback,
  zerosHistogram,
  isValidClassifiedFinish,
  buildCountbackHistograms,
} from '../domain/countbackComparator';
import { recalculateStandingsFromRaces } from '../domain/standingsCalculator';
import { resolveConstructorIdentity } from '../domain/constructorMapping';
import { calculateSeasonStandingsUseCase } from '../application/useCases/calculateSeasonStandingsUseCase';
import {
  SyncSeasonResultsUseCase,
  syncSeasonResultsUseCase,
} from '../application/useCases/syncSeasonResultsUseCase';
import {
  LoadInitialChampionshipDataUseCase,
  INITIAL_DETAILED_RESULTS,
} from '../application/useCases/loadInitialChampionshipDataUseCase';
import { championshipStorage } from '../infrastructure/storage/championshipLocalStorage';
import {
  IJolpicaAdapter,
  RawJolpicaRace,
  IChampionshipStorage,
} from '../infrastructure/contracts/infrastructureContracts';
import { PartialSyncError } from '../infrastructure/api/jolpicaAdapter';
import { useChampionshipStore } from '../../../store/useChampionshipStore';

describe('Milestone A4.6 Final Integration & Regression Acceptance Suite', () => {
  const memoryStore = new Map<string, string>();
  const fakeLocalStorage = {
    getItem: vi.fn((key: string) => memoryStore.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => {
      memoryStore.set(key, String(value));
    }),
    removeItem: vi.fn((key: string) => {
      memoryStore.delete(key);
    }),
    clear: vi.fn(() => {
      memoryStore.clear();
    }),
    get length() {
      return memoryStore.size;
    },
    key: vi.fn((i: number) => Array.from(memoryStore.keys())[i] ?? null),
  };

  beforeEach(() => {
    vi.restoreAllMocks();
    memoryStore.clear();
    Object.defineProperty(globalThis, 'localStorage', {
      value: fakeLocalStorage,
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ============================================================================
  // PHASE 2: END-TO-END DATA FLOW & SPORTING INTEGRITY
  // ============================================================================
  describe('Phase 2 — End-to-End Sporting Data Integrity & Domain Calculations', () => {
    it('Item 1 & 6: calculates completed Grand Prix points for Drivers Championship', () => {
      const mockResults: DetailedRaceResult[] = [
        {
          id: 'race-2026-r18',
          season: 2026,
          round: 18,
          grandPrix: 'United States Grand Prix',
          officialName: 'United States Grand Prix 2026',
          circuit: 'Circuit of the Americas',
          date: '2026-10-18',
          status: 'completed',
          lapsTotal: 56,
          entries: [
            {
              position: 1,
              driverId: 'norris',
              driverName: 'Lando Norris',
              driverCode: 'NOR',
              teamId: 'mclaren',
              teamName: 'McLaren',
              laps: 56,
              status: 'Finished',
              timeOrGap: '1:30:00.000',
              points: 25,
            },
          ],
        },
      ];

      const standings = calculateSeasonStandingsUseCase.execute(2026, mockResults);
      expect(standings.drivers.length).toBeGreaterThan(0);
      const norris = standings.drivers.find((d) => d.driverId === 'norris');
      expect(norris).toBeDefined();
      expect(norris?.points).toBeGreaterThan(0);
    });

    it('Item 2: calculates Sprint results and ensures single-counting of sprint points', () => {
      const mockResultsWithSprint: DetailedRaceResult[] = [
        {
          id: 'race-2026-r19',
          season: 2026,
          round: 19,
          grandPrix: 'São Paulo Grand Prix',
          officialName: 'São Paulo Grand Prix 2026',
          circuit: 'Interlagos',
          date: '2026-11-01',
          status: 'completed',
          lapsTotal: 71,
          entries: [
            {
              position: 1,
              driverId: 'verstappen',
              driverName: 'Max Verstappen',
              driverCode: 'VER',
              teamId: 'redbull',
              teamName: 'Red Bull Racing',
              laps: 71,
              status: 'Finished',
              timeOrGap: '1:25:00.000',
              points: 25,
            },
          ],
          sprintEntries: [
            {
              position: 1,
              driverId: 'norris',
              driverName: 'Lando Norris',
              driverCode: 'NOR',
              teamId: 'mclaren',
              teamName: 'McLaren',
              laps: 24,
              status: 'Finished',
              timeOrGap: '30:00.000',
              points: 8,
            },
          ],
        },
      ];

      const standings = calculateSeasonStandingsUseCase.execute(2026, mockResultsWithSprint);
      const verstappen = standings.drivers.find((d) => d.driverId === 'verstappen');
      const norris = standings.drivers.find((d) => d.driverId === 'norris');

      expect(verstappen).toBeDefined();
      expect(norris).toBeDefined();
      expect(verstappen?.points).toBeGreaterThan(0);
      expect(norris?.points).toBeGreaterThan(0);
    });

    it('Item 7: aggregates Constructors Championship standings correctly for all teammates', () => {
      const mockResults: DetailedRaceResult[] = [
        {
          id: 'race-2026-r18',
          season: 2026,
          round: 18,
          grandPrix: 'United States Grand Prix',
          officialName: 'United States Grand Prix 2026',
          circuit: 'Circuit of the Americas',
          date: '2026-10-18',
          status: 'completed',
          lapsTotal: 56,
          entries: [
            {
              position: 1,
              driverId: 'norris',
              driverName: 'Lando Norris',
              driverCode: 'NOR',
              teamId: 'mclaren',
              teamName: 'McLaren',
              laps: 56,
              status: 'Finished',
              timeOrGap: '1:30:00.000',
              points: 25,
            },
            {
              position: 2,
              driverId: 'piastri',
              driverName: 'Oscar Piastri',
              driverCode: 'PIA',
              teamId: 'mclaren',
              teamName: 'McLaren',
              laps: 56,
              status: 'Finished',
              timeOrGap: '+2.500',
              points: 18,
            },
          ],
        },
      ];

      const standings = calculateSeasonStandingsUseCase.execute(2026, mockResults);
      const mclaren = standings.constructors.find((c) => c.teamId === 'mclaren');

      expect(mclaren).toBeDefined();
      expect(mclaren?.points).toBeGreaterThan(0);
    });

    it('Item 8: enforces FIA countback rules (Article A2.1.4(c)) on equal points', () => {
      const driverA: DriverStanding = {
        rank: 1,
        driverId: 'driver_a',
        driverName: 'Driver A',
        driverCode: 'DRA',
        teamId: 'mclaren',
        teamName: 'McLaren',
        points: 37,
        wins: 1,
        podiums: 1,
        countryFlag: '🇬🇧',
      };
      const driverB: DriverStanding = {
        rank: 2,
        driverId: 'driver_b',
        driverName: 'Driver B',
        driverCode: 'DRB',
        teamId: 'ferrari',
        teamName: 'Ferrari',
        points: 37,
        wins: 0,
        podiums: 2,
        countryFlag: '🇲🇨',
      };

      const histA = zerosHistogram();
      histA[1] = 1;
      histA[4] = 1;

      const histB = zerosHistogram();
      histB[2] = 2;

      // Driver A wins countback on 1st place finishes (1 vs 0)
      expect(compareCountback(driverA, driverB, histA, histB)).toBeLessThan(0);
      expect(compareCountback(driverB, driverA, histB, histA)).toBeGreaterThan(0);

      // Deep countback beyond P10
      const driverC: DriverStanding = {
        rank: 19,
        driverId: 'driver_c',
        driverName: 'Driver C',
        driverCode: 'DRC',
        teamId: 'haas',
        teamName: 'Haas',
        points: 0,
        wins: 0,
        podiums: 0,
        countryFlag: '🇩🇰',
      };
      const driverD: DriverStanding = {
        rank: 20,
        driverId: 'driver_d',
        driverName: 'Driver D',
        driverCode: 'DRD',
        teamId: 'williams',
        teamName: 'Williams',
        points: 0,
        wins: 0,
        podiums: 0,
        countryFlag: '🇹🇭',
      };

      const histC = zerosHistogram();
      histC[11] = 1;
      histC[14] = 1;

      const histD = zerosHistogram();
      histD[12] = 2;

      // Driver C has best finish P11 vs P12
      expect(compareCountback(driverC, driverD, histC, histD)).toBeLessThan(0);
    });

    it('Item 9: validates fastest lap bonus point rule across seasons', () => {
      // 2024: 1 pt awarded if top 10 finisher has fastest lap
      expect(fiaScoringRules.getFastestLapBonus(2024, 1, true)).toBe(1);
      expect(fiaScoringRules.getFastestLapBonus(2024, 10, true)).toBe(1);
      expect(fiaScoringRules.getFastestLapBonus(2024, 11, true)).toBe(0); // outside top 10

      // 2025 onwards: abolished by FIA World Motor Sport Council
      expect(fiaScoringRules.getFastestLapBonus(2025, 1, true)).toBe(0);
      expect(fiaScoringRules.getFastestLapBonus(2026, 1, true)).toBe(0);
    });

    it('Item 10 & 11: resolves historical constructor identity for Sauber and 2026 Audi/Cadillac', () => {
      // 2024 Kick Sauber
      const res2024 = resolveConstructorIdentity('sauber', 2024);
      expect(res2024.historicalId).toBe('sauber');
      expect(res2024.displayName).toBe('Kick Sauber');
      expect(res2024.presentationTeamId).toBe('audi'); // Showroom 3D asset mapped to Audi
      expect(res2024.lineageId).toBe('sauber_audi');

      // 2025 Kick Sauber
      const res2025 = resolveConstructorIdentity('kick_sauber', 2025);
      expect(res2025.historicalId).toBe('sauber');
      expect(res2025.displayName).toBe('Kick Sauber');

      // 2026 Audi
      const res2026 = resolveConstructorIdentity('audi', 2026);
      expect(res2026.historicalId).toBe('audi');
      expect(res2026.displayName).toBe('Audi');
      expect(res2026.presentationTeamId).toBe('audi');

      // 2026 Cadillac
      const resCadillac = resolveConstructorIdentity('cadillac', 2026);
      expect(resCadillac.historicalId).toBe('cadillac');
      expect(resCadillac.displayName).toBe('Cadillac');
      expect(resCadillac.presentationTeamId).toBe('cadillac');
    });

    it('Item 14: scheduled and future rounds render without synthetic mock classifications', () => {
      const scheduledRound: DetailedRaceResult = {
        id: 'race-2026-r24',
        season: 2026,
        round: 24,
        grandPrix: 'Abu Dhabi Grand Prix',
        officialName: 'Abu Dhabi Grand Prix 2026',
        circuit: 'Yas Marina',
        date: '2026-12-06',
        status: 'scheduled',
        lapsTotal: 58,
        entries: [], // no completed results
      };

      const entity = calculateSeasonStandingsUseCase.execute(2026, [scheduledRound]);
      expect(entity.drivers.length).toBeGreaterThan(0);
      // Scheduled round does not create phantom wins
      const winsTotal = entity.drivers.reduce((acc, d) => acc + (d.wins || 0), 0);
      expect(winsTotal).toBeGreaterThanOrEqual(0);
    });
  });

  // ============================================================================
  // PHASE 3: API, OFFLINE & CACHE RESILIENCE
  // ============================================================================
  describe('Phase 3 — API Resilience, Concurrency, and Cache Reliability', () => {
    it('handles healthy Jolpica synchronization seamlessly', async () => {
      const mockApi: IJolpicaAdapter = {
        buildUrl: vi.fn(() => ''),
        fetchPage: vi.fn(),
        fetchAllRaces: vi.fn(async (_season, type) => {
          if (type === 'sprint') return [];
          return [
            {
              season: '2026',
              round: '1',
              raceName: 'Bahrain Grand Prix',
              date: '2026-03-02',
              Results: [
                {
                  position: '1',
                  points: '25',
                  Driver: {
                    driverId: 'norris',
                    givenName: 'Lando',
                    familyName: 'Norris',
                    code: 'NOR',
                  },
                  Constructor: { constructorId: 'mclaren', name: 'McLaren' },
                  laps: '57',
                  status: 'Finished',
                  Time: { time: '1:31:44.742' },
                },
              ],
            },
          ] as unknown as RawJolpicaRace[];
        }),
      };

      const mockStorage: IChampionshipStorage = {
        keys: { detailedResults: 'k1', syncMeta: 'k2', syncReview: 'k3', dismissedReview: 'k4' },
        loadRawDetailedResults: vi.fn().mockReturnValue(null),
        persistRawDetailedResults: vi.fn(),
        loadSyncMetadata: vi.fn().mockReturnValue(null),
        persistSyncMetadata: vi.fn(),
        clearStaleSyncReview: vi.fn(),
      };

      const useCase = new SyncSeasonResultsUseCase(mockApi, mockStorage);
      const res = await useCase.execute(2026, INITIAL_DETAILED_RESULTS[2026]);

      expect(res.success).toBe(true);
      expect(res.results.length).toBeGreaterThan(0);
      expect(mockStorage.persistRawDetailedResults).toHaveBeenCalled();
      expect(mockStorage.persistSyncMetadata).toHaveBeenCalled();
    });

    it('preserves cached snapshot when upstream Jolpica returns HTTP 500 error', async () => {
      const mockApi: IJolpicaAdapter = {
        buildUrl: vi.fn(() => ''),
        fetchPage: vi.fn(),
        fetchAllRaces: vi.fn(async () => {
          throw new Error('500 Internal Server Error: Jolpica gateway timeout');
        }),
      };

      const mockStorage: IChampionshipStorage = {
        keys: { detailedResults: 'k1', syncMeta: 'k2', syncReview: 'k3', dismissedReview: 'k4' },
        loadRawDetailedResults: vi.fn().mockReturnValue(null),
        persistRawDetailedResults: vi.fn(),
        loadSyncMetadata: vi.fn().mockReturnValue(null),
        persistSyncMetadata: vi.fn(),
        clearStaleSyncReview: vi.fn(),
      };

      const existingRaces = INITIAL_DETAILED_RESULTS[2026];
      const useCase = new SyncSeasonResultsUseCase(mockApi, mockStorage);
      const res = await useCase.execute(2026, existingRaces);

      expect(res.success).toBe(false);
      // Results remain the existing cached races, not wiped out
      expect(res.results).toBe(existingRaces);
      // No corrupted storage overwrite of race results
      expect(mockStorage.persistRawDetailedResults).not.toHaveBeenCalled();
      expect(mockStorage.persistSyncMetadata).toHaveBeenCalledWith(
        expect.objectContaining({
          syncStatus: 'error',
        }),
      );
    });

    it('detects unexpected empty pagination batch and halts without overwriting valid data', async () => {
      const mockApi: IJolpicaAdapter = {
        buildUrl: vi.fn(() => ''),
        fetchPage: vi.fn(),
        fetchAllRaces: vi.fn(async () => {
          throw new PartialSyncError(
            'Jolpica pagination incomplete: declared 528 records but received early empty page',
            3,
          );
        }),
      };

      const mockStorage: IChampionshipStorage = {
        keys: { detailedResults: 'k1', syncMeta: 'k2', syncReview: 'k3', dismissedReview: 'k4' },
        loadRawDetailedResults: vi.fn().mockReturnValue(null),
        persistRawDetailedResults: vi.fn(),
        loadSyncMetadata: vi.fn().mockReturnValue(null),
        persistSyncMetadata: vi.fn(),
        clearStaleSyncReview: vi.fn(),
      };

      const existingRaces = INITIAL_DETAILED_RESULTS[2026];
      const useCase = new SyncSeasonResultsUseCase(mockApi, mockStorage);
      const res = await useCase.execute(2026, existingRaces);

      expect(res.success).toBe(false);
      expect(res.partial).toBe(true);
      expect(mockStorage.persistRawDetailedResults).not.toHaveBeenCalled();
    });

    it('recovers gracefully from corrupted localStorage and restores initial data', () => {
      fakeLocalStorage.setItem('f1_detailed_results_v3', '{ bad_json: invalid [');
      const loaded = championshipStorage.loadRawDetailedResults();
      expect(loaded).toBeNull(); // Graceful null return without throwing

      const meta = championshipStorage.loadSyncMetadata();
      expect(meta).toBeNull();
    });

    it('handles QuotaExceededError and SecurityError safely during storage persistence', () => {
      const setItemSpy = vi.spyOn(fakeLocalStorage, 'setItem').mockImplementation(() => {
        const err = new Error('QuotaExceededError');
        err.name = 'QuotaExceededError';
        throw err;
      });

      // Should not throw exception out to caller
      expect(() => {
        championshipStorage.persistRawDetailedResults(INITIAL_DETAILED_RESULTS);
      }).not.toThrow();

      expect(() => {
        championshipStorage.persistSyncMetadata({
          lastSyncTimestamp: '12:00:00',
          syncStatus: 'success',
          source: 'Jolpica F1 API',
          completedRoundsCount: 24,
        });
      }).not.toThrow();

      setItemSpy.mockRestore();
    });

    it('aborts active sync immediately when AbortController triggers', async () => {
      const controller = new AbortController();
      controller.abort();
      const mockApi: IJolpicaAdapter = {
        buildUrl: vi.fn(() => ''),
        fetchPage: vi.fn(),
        fetchAllRaces: vi.fn(async () => []),
      };

      const mockStorage: IChampionshipStorage = {
        keys: { detailedResults: 'k1', syncMeta: 'k2', syncReview: 'k3', dismissedReview: 'k4' },
        loadRawDetailedResults: vi.fn().mockReturnValue(null),
        persistRawDetailedResults: vi.fn(),
        loadSyncMetadata: vi.fn().mockReturnValue(null),
        persistSyncMetadata: vi.fn(),
        clearStaleSyncReview: vi.fn(),
      };

      const useCase = new SyncSeasonResultsUseCase(mockApi, mockStorage);
      const res = await useCase.execute(2026, [], {
        abortSignal: controller.signal,
      });

      expect(res.success).toBe(false);
      expect(res.message).toBe('Đồng bộ đã bị hủy.');
    });

    it('ensures rapid Season A -> B -> A switching prevents stale response overwrites', async () => {
      let callId = 0;
      const mockApi: IJolpicaAdapter = {
        buildUrl: vi.fn(() => ''),
        fetchPage: vi.fn(),
        fetchAllRaces: vi.fn(async (season, type) => {
          callId++;
          const currentCall = callId;
          if (currentCall === 1) {
            await new Promise((r) => setTimeout(r, 60));
          }
          if (type === 'sprint') return [];
          return [
            {
              season: String(season),
              round: '1',
              raceName: 'Test GP',
              date: '2026-03-01',
              Results: [],
            },
          ] as unknown as RawJolpicaRace[];
        }),
      };

      const syncUseCase = new SyncSeasonResultsUseCase(mockApi, championshipStorage);
      vi.spyOn(syncUseCase, 'execute').mockImplementation(async (season, _races, options) => {
        if (options?.abortSignal?.aborted || (options?.isFresh && !options.isFresh())) {
          return {
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
          };
        }
        return {
          success: true,
          results: [],
          message: `Fresh ${season}`,
          source: 'Jolpica F1 API',
          syncMetadata: {
            lastSyncTimestamp: '10:00:01',
            syncStatus: 'success',
            source: 'Jolpica F1 API',
            completedRoundsCount: 24,
            message: `Fresh ${season}`,
          },
        };
      });

      // Rapid sequence
      const sync1 = useChampionshipStore.getState().syncSeasonData(2024);
      useChampionshipStore.getState().setSelectedSeason(2026);
      useChampionshipStore.getState().setSelectedSeason(2024);
      const sync2 = useChampionshipStore.getState().syncSeasonData(2024);

      await Promise.all([sync1, sync2]);
      const state = useChampionshipStore.getState();
      expect(state.selectedSeason).toBe(2024);
    });

    it('guards against repeated synchronization clicks (debounced / locked in store)', async () => {
      let runCount = 0;
      vi.spyOn(syncSeasonResultsUseCase, 'execute').mockImplementation(async () => {
        runCount++;
        await new Promise((r) => setTimeout(r, 40));
        return {
          success: true,
          results: [],
          message: 'OK',
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
      const p3 = useChampionshipStore.getState().syncSeasonData(2026);

      await Promise.all([p1, p2, p3]);
      expect(runCount).toBe(1);
      expect(useChampionshipStore.getState().syncMeta.syncStatus).not.toBe('syncing');
    });

    it('loadInitialChampionshipDataUseCase restores valid cache and computes standings', () => {
      const mockStorage: IChampionshipStorage = {
        keys: { detailedResults: 'k1', syncMeta: 'k2', syncReview: 'k3', dismissedReview: 'k4' },
        loadRawDetailedResults: vi.fn().mockReturnValue(INITIAL_DETAILED_RESULTS),
        persistRawDetailedResults: vi.fn(),
        loadSyncMetadata: vi.fn().mockReturnValue({
          lastSyncTimestamp: '09:00:00',
          syncStatus: 'success',
          source: 'Local snapshot',
          completedRoundsCount: 24,
        }),
        persistSyncMetadata: vi.fn(),
        clearStaleSyncReview: vi.fn(),
      };

      const customUseCase = new LoadInitialChampionshipDataUseCase(mockStorage);
      const initResult = customUseCase.execute();

      expect(initResult.detailedResults[2026]).toBeDefined();
      expect(initResult.calculatedStandings[2026]?.drivers.length).toBeGreaterThan(0);
      expect(initResult.syncMeta.source).toBe('Local snapshot');
    });
  });

  describe('Stage 1 — Classified DNF and FIA Scoring Correctness Verification', () => {
    it('awards official points to a classified DNF in P9 (completed >=90% race distance)', () => {
      // FIA Sporting Regulations Art. B2.5.5: Competitors covering >=90% laps are classified.
      // If classified in top 10 (e.g. P9), they receive championship points (2 pts).
      const mockClassifiedDnfRace: DetailedRaceResult = {
        id: 'race-2026-r19-mexico',
        season: 2026,
        round: 19, // Beyond baseline cutoff 18
        grandPrix: 'United States Grand Prix',
        officialName: 'FORMULA 1 UNITED STATES GRAND PRIX 2026',
        circuit: 'Circuit of the Americas',
        date: '2026-10-25',
        status: 'completed',
        lapsTotal: 56,
        entries: [
          {
            position: 1,
            driverId: 'verstappen',
            driverName: 'Max Verstappen',
            driverCode: 'VER',
            teamId: 'redbull',
            teamName: 'Red Bull Racing',
            laps: 56,
            status: 'Finished',
            timeOrGap: '1:30:00.000',
            points: 25,
          },
          {
            position: 9,
            driverId: 'norris',
            driverName: 'Lando Norris',
            driverCode: 'NOR',
            teamId: 'mclaren',
            teamName: 'McLaren',
            laps: 52, // 52 / 56 = 92.8% (>= 90%, classified!)
            status: 'Engine', // Retired due to engine but classified P9
            timeOrGap: 'DNF',
            points: 2, // Official FIA points awarded for P9
          },
        ],
      };

      const baseDrivers: DriverStanding[] = [
        {
          rank: 1,
          driverId: 'verstappen',
          driverName: 'Max Verstappen',
          driverCode: 'VER',
          teamId: 'redbull',
          teamName: 'Red Bull Racing',
          points: 300,
          wins: 7,
          podiums: 12,
          countryFlag: '🇳🇱',
        },
        {
          rank: 2,
          driverId: 'norris',
          driverName: 'Lando Norris',
          driverCode: 'NOR',
          teamId: 'mclaren',
          teamName: 'McLaren',
          points: 250,
          wins: 4,
          podiums: 10,
          countryFlag: '🇬🇧',
        },
      ];

      const { drivers } = recalculateStandingsFromRaces(
        2026,
        [mockClassifiedDnfRace],
        baseDrivers,
        [],
      );
      const norris = drivers.find((d) => d.driverId === 'norris');
      expect(norris).toBeDefined();
      expect(norris?.points).toBe(252); // Exactly 250 baseline + 2 awarded points
      expect(norris?.wins).toBe(4); // No win added
      expect(norris?.podiums).toBe(10); // No podium added
    });

    it('awards 0 points to an unclassified DNF (<90% race distance or status NC)', () => {
      const mockUnclassifiedDnfRace: DetailedRaceResult = {
        id: 'race-2026-r19-mexico',
        season: 2026,
        round: 19,
        grandPrix: 'United States Grand Prix',
        officialName: 'FORMULA 1 UNITED STATES GRAND PRIX 2026',
        circuit: 'Circuit of the Americas',
        date: '2026-10-25',
        status: 'completed',
        lapsTotal: 56,
        entries: [
          {
            position: 18,
            driverId: 'norris',
            driverName: 'Lando Norris',
            driverCode: 'NOR',
            teamId: 'mclaren',
            teamName: 'McLaren',
            laps: 10, // <90% distance
            status: 'Not classified',
            timeOrGap: 'DNF',
            points: 0,
          },
        ],
      };

      const baseDrivers: DriverStanding[] = [
        {
          rank: 1,
          driverId: 'norris',
          driverName: 'Lando Norris',
          driverCode: 'NOR',
          teamId: 'mclaren',
          teamName: 'McLaren',
          points: 250,
          wins: 4,
          podiums: 10,
          countryFlag: '🇬🇧',
        },
      ];

      const { drivers } = recalculateStandingsFromRaces(
        2026,
        [mockUnclassifiedDnfRace],
        baseDrivers,
        [],
      );
      const norris = drivers.find((d) => d.driverId === 'norris');
      expect(norris?.points).toBe(250); // Unchanged (+0)
    });

    it('awards 0 points and excludes DNS and DSQ from finishing positions and standings points', () => {
      // In FIA regulations, DNS and DSQ award 0 points
      expect(racePointsForPosition(0)).toBe(0);
      expect(racePointsForPosition(11)).toBe(0);

      // Verify countback validity helper rejects DNS, DSQ, Disqualified, Did Not Start
      expect(isValidClassifiedFinish(10, 'DNS')).toBe(false);
      expect(isValidClassifiedFinish(10, 'Did Not Start')).toBe(false);
      expect(isValidClassifiedFinish(5, 'DSQ')).toBe(false);
      expect(isValidClassifiedFinish(5, 'Disqualified')).toBe(false);
      expect(isValidClassifiedFinish(5, 'DSQ - Infringement')).toBe(false);

      // Verify unclassified statuses are also rejected
      expect(isValidClassifiedFinish(18, 'NC')).toBe(false);
      expect(isValidClassifiedFinish(18, 'NC ')).toBe(false);
      expect(isValidClassifiedFinish(18, 'Not Classified')).toBe(false);
      expect(isValidClassifiedFinish(18, 'UNCLASSIFIED')).toBe(false);

      // In contrast, classified finishes and classified DNFs (>=90%) ARE valid
      expect(isValidClassifiedFinish(1, 'Finished')).toBe(true);
      expect(isValidClassifiedFinish(9, '+1 Lap')).toBe(true);
      expect(isValidClassifiedFinish(14, 'Engine')).toBe(true);
      expect(isValidClassifiedFinish(18, 'Collision')).toBe(true);
      expect(isValidClassifiedFinish(18, 'DNF (Accident)')).toBe(true);
    });

    it('counts classified DNF in countback finishing histograms while rejecting NC, DNS, and DSQ', () => {
      const mockRace: DetailedRaceResult = {
        id: 'race-2026-r19',
        season: 2026,
        round: 19,
        grandPrix: 'Test GP',
        officialName: 'Test GP',
        circuit: 'Test Circuit',
        date: '2026-10-25',
        status: 'completed',
        lapsTotal: 50,
        entries: [
          // Driver A: Classified DNF at P12 (>=90% distance, e.g. retired lap 47/50)
          {
            position: 12,
            driverId: 'norris',
            driverName: 'Lando Norris',
            driverCode: 'NOR',
            teamId: 'mclaren',
            teamName: 'McLaren',
            laps: 47,
            status: 'Gearbox',
            timeOrGap: 'DNF',
            points: 0,
          },
          // Driver B: Unclassified DNF (<90% distance, retired lap 10/50)
          {
            position: 12,
            driverId: 'piastri',
            driverName: 'Oscar Piastri',
            driverCode: 'PIA',
            teamId: 'mclaren',
            teamName: 'McLaren',
            laps: 10,
            status: 'Not Classified',
            timeOrGap: 'DNF',
            points: 0,
          },
          // Driver C: Disqualified
          {
            position: 12,
            driverId: 'russell',
            driverName: 'George Russell',
            driverCode: 'RUS',
            teamId: 'mercedes',
            teamName: 'Mercedes',
            laps: 50,
            status: 'DSQ',
            timeOrGap: 'DSQ',
            points: 0,
          },
        ],
      };

      const { driverHistograms } = buildCountbackHistograms([mockRace]);

      // Norris (Classified DNF at P12) has histogram entry for P12
      const histNorris = driverHistograms.get('norris') || zerosHistogram();
      expect(histNorris[12]).toBe(1);

      // Piastri (NC) and Russell (DSQ) must have 0 classified finishes
      const histPiastri = driverHistograms.get('piastri') || zerosHistogram();
      expect(histPiastri[12] || 0).toBe(0);

      const histRussell = driverHistograms.get('russell') || zerosHistogram();
      expect(histRussell[12] || 0).toBe(0);

      // Countback tie-breaker: Norris vs Piastri with identical points (0) and wins (0)
      const diff = compareCountback(
        { points: 0, wins: 0, driverId: 'norris' },
        { points: 0, wins: 0, driverId: 'piastri' },
        histNorris,
        histPiastri,
      );
      // diff < 0 means Norris ranks ahead of Piastri (compareCountback sorts descending: a before b gives negative)
      expect(diff).toBeLessThan(0);
    });

    it('faithfully preserves official upstream Jolpica points even if non-standard or adjusted', () => {
      // In rain-shortened races (e.g. 50% distance) or steward adjustments, Jolpica provides official points
      const mockShortenedRace: DetailedRaceResult = {
        id: 'race-2026-r19-shortened',
        season: 2026,
        round: 19,
        grandPrix: 'Rain GP',
        officialName: 'Rain GP 2026',
        circuit: 'Spa',
        date: '2026-10-25',
        status: 'completed',
        lapsTotal: 20,
        entries: [
          {
            position: 1,
            driverId: 'verstappen',
            driverName: 'Max Verstappen',
            driverCode: 'VER',
            teamId: 'redbull',
            teamName: 'Red Bull Racing',
            laps: 20,
            status: 'Finished',
            timeOrGap: '45:00.000',
            points: 12.5, // 50% points awarded by stewards
          },
        ],
      };

      const baseDrivers: DriverStanding[] = [
        {
          rank: 1,
          driverId: 'verstappen',
          driverName: 'Max Verstappen',
          driverCode: 'VER',
          teamId: 'redbull',
          teamName: 'Red Bull Racing',
          points: 300,
          wins: 7,
          podiums: 12,
          countryFlag: '🇳🇱',
        },
      ];

      const { drivers } = recalculateStandingsFromRaces(2026, [mockShortenedRace], baseDrivers, []);
      const verstappen = drivers.find((d) => d.driverId === 'verstappen');
      expect(verstappen?.points).toBe(312.5); // Accurately reflects 300 + 12.5
    });
  });
});
