import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { calculateSeasonStandingsUseCase } from '../useCases/calculateSeasonStandingsUseCase';
import { LoadInitialChampionshipDataUseCase } from '../useCases/loadInitialChampionshipDataUseCase';
import { SyncSeasonResultsUseCase } from '../useCases/syncSeasonResultsUseCase';
import { DetailedRaceResult } from '../../../../types';
import { IJolpicaAdapter, IChampionshipStorage } from '../../infrastructure';
import {
  DRIVER_STANDINGS_2024,
  CONSTRUCTOR_STANDINGS_2024,
  DRIVER_STANDINGS_2026,
  CONSTRUCTOR_STANDINGS_2026,
} from '../../../../data/championship/standings';

describe('Championship Application Layer — Use Cases', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('CalculateSeasonStandingsUseCase', () => {
    it('calculates driver and constructor standings via domain rules', () => {
      const race: DetailedRaceResult = {
        id: 'race-2026-r19-test',
        season: 2026,
        round: 19,
        grandPrix: 'Test GP',
        officialName: 'Test GP 2026',
        circuit: 'Test Circuit',
        date: '2026-10-01',
        status: 'completed',
        lapsTotal: 50,
        entries: [
          {
            position: 1,
            driverId: 'norris',
            driverName: 'Lando Norris',
            driverCode: 'NOR',
            teamId: 'mclaren',
            teamName: 'McLaren',
            laps: 50,
            status: 'Finished',
            timeOrGap: '1:30:00.000',
            points: 25,
          },
        ],
      };

      const result = calculateSeasonStandingsUseCase.execute(
        2026,
        [race],
        DRIVER_STANDINGS_2026,
        CONSTRUCTOR_STANDINGS_2026,
      );

      expect(result.drivers.length).toBeGreaterThan(0);
      expect(result.constructors.length).toBeGreaterThan(0);
      const norris = result.drivers.find((d) => d.driverId === 'norris');
      expect(norris?.points).toBe(
        DRIVER_STANDINGS_2026.find((d) => d.driverId === 'norris')!.points + 25,
      );
    });

    it('credits sprint points without incrementing Grand Prix wins or podiums', () => {
      const sprintRace: DetailedRaceResult = {
        id: 'race-2026-r19-sprint',
        season: 2026,
        round: 19,
        grandPrix: 'Sprint GP',
        officialName: 'Sprint GP 2026',
        circuit: 'Sprint Circuit',
        date: '2026-10-15',
        status: 'scheduled',
        lapsTotal: 50,
        entries: [],
        sprintEntries: [
          {
            position: 1,
            driverId: 'norris',
            driverName: 'Lando Norris',
            driverCode: 'NOR',
            teamId: 'mclaren',
            teamName: 'McLaren',
            laps: 19,
            status: 'Finished',
            timeOrGap: '25:00.000',
            points: 8,
          },
        ],
      };

      const baseNorris = DRIVER_STANDINGS_2026.find((d) => d.driverId === 'norris')!;
      const result = calculateSeasonStandingsUseCase.execute(
        2026,
        [sprintRace],
        DRIVER_STANDINGS_2026,
        CONSTRUCTOR_STANDINGS_2026,
      );

      const updatedNorris = result.drivers.find((d) => d.driverId === 'norris')!;
      expect(updatedNorris.points).toBe(baseNorris.points + 8);
      expect(updatedNorris.wins).toBe(baseNorris.wins); // Sprints do not count as GP wins
      expect(updatedNorris.podiums).toBe(baseNorris.podiums); // Sprints do not count as GP podiums
    });

    it('computes initial standings respecting 2026 completed round cutoff', () => {
      const initialStandings = calculateSeasonStandingsUseCase.computeAllInitialStandings({
        2024: [],
        2025: [],
        2026: [],
      });

      expect(initialStandings[2024].drivers).toEqual(DRIVER_STANDINGS_2024);
      expect(initialStandings[2024].constructors).toEqual(CONSTRUCTOR_STANDINGS_2024);
      expect(initialStandings[2026].drivers).toEqual(DRIVER_STANDINGS_2026);
    });
  });

  describe('LoadInitialChampionshipDataUseCase', () => {
    it('hydrates initial championship data cleanly from storage', () => {
      const mockStorage: IChampionshipStorage = {
        keys: {
          detailedResults: 'k1',
          syncMeta: 'k2',
          syncReview: 'k3',
          dismissedReview: 'k4',
        },
        loadRawDetailedResults: vi.fn(() => null),
        persistRawDetailedResults: vi.fn(),
        loadSyncMetadata: vi.fn(() => null),
        persistSyncMetadata: vi.fn(),
        clearStaleSyncReview: vi.fn(),
      };

      const useCase = new LoadInitialChampionshipDataUseCase(mockStorage);
      const data = useCase.execute();

      expect(mockStorage.clearStaleSyncReview).toHaveBeenCalled();
      expect(data.detailedResults[2024]).toBeDefined();
      expect(data.detailedResults[2026]).toBeDefined();
      expect(data.calculatedStandings[2026]).toBeDefined();
      expect(data.syncMeta.syncStatus).toBe('idle');
      expect(data.syncMeta.source).toBe('Local snapshot');
    });

    it('recovers gracefully from corrupted storage', () => {
      const mockStorage: IChampionshipStorage = {
        keys: {
          detailedResults: 'k1',
          syncMeta: 'k2',
          syncReview: 'k3',
          dismissedReview: 'k4',
        },
        loadRawDetailedResults: vi.fn(() => {
          throw new Error('Corrupted storage');
        }),
        persistRawDetailedResults: vi.fn(),
        loadSyncMetadata: vi.fn(() => {
          throw new Error('Corrupted meta');
        }),
        persistSyncMetadata: vi.fn(),
        clearStaleSyncReview: vi.fn(),
      };

      const useCase = new LoadInitialChampionshipDataUseCase(mockStorage);
      expect(() => {
        const data = useCase.execute();
        expect(data.detailedResults[2026]).toBeDefined();
        expect(data.syncMeta.syncStatus).toBe('idle');
      }).not.toThrow();
    });
  });

  describe('SyncSeasonResultsUseCase', () => {
    it('successfully fetches and processes newly synchronized rounds', async () => {
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
          ];
        }),
      };

      const mockStorage: IChampionshipStorage = {
        keys: { detailedResults: 'k1', syncMeta: 'k2', syncReview: 'k3', dismissedReview: 'k4' },
        loadRawDetailedResults: vi.fn(() => null),
        persistRawDetailedResults: vi.fn(),
        loadSyncMetadata: vi.fn(() => null),
        persistSyncMetadata: vi.fn(),
        clearStaleSyncReview: vi.fn(),
      };

      const useCase = new SyncSeasonResultsUseCase(mockApi, mockStorage);
      const res = await useCase.execute(2026, [], {
        currentResultsMap: { 2024: [], 2025: [], 2026: [] },
      });

      expect(res.success).toBe(true);
      expect(res.source).toBe('Jolpica F1 API');
      expect(res.results.length).toBeGreaterThan(0);
      expect(mockStorage.persistRawDetailedResults).toHaveBeenCalled();
      expect(mockStorage.persistSyncMetadata).toHaveBeenCalled();
    });

    it('preserves existing snapshot and reports failure honestly on API failure', async () => {
      const mockApi: IJolpicaAdapter = {
        buildUrl: vi.fn(() => ''),
        fetchPage: vi.fn(),
        fetchAllRaces: vi.fn(async () => {
          throw new Error('API Offline 503');
        }),
      };

      const mockStorage: IChampionshipStorage = {
        keys: { detailedResults: 'k1', syncMeta: 'k2', syncReview: 'k3', dismissedReview: 'k4' },
        loadRawDetailedResults: vi.fn(() => null),
        persistRawDetailedResults: vi.fn(),
        loadSyncMetadata: vi.fn(() => null),
        persistSyncMetadata: vi.fn(),
        clearStaleSyncReview: vi.fn(),
      };

      const existingRaces: DetailedRaceResult[] = [
        {
          id: 'existing-r1',
          season: 2026,
          round: 1,
          grandPrix: 'Existing GP',
          officialName: 'Existing GP 2026',
          circuit: 'Existing Circuit',
          date: '2026-03-01',
          status: 'completed',
          lapsTotal: 50,
          entries: [],
        },
      ];

      const useCase = new SyncSeasonResultsUseCase(mockApi, mockStorage);
      const res = await useCase.execute(2026, existingRaces);

      expect(res.success).toBe(false);
      expect(res.source).toBe('Local saved snapshot');
      expect(res.results).toEqual(existingRaces);
      expect(mockStorage.persistRawDetailedResults).not.toHaveBeenCalled();
      expect(mockStorage.persistSyncMetadata).toHaveBeenCalledWith(
        expect.objectContaining({ syncStatus: 'error' }),
      );
    });

    it('aborts cleanly when AbortSignal is cancelled before or during sync', async () => {
      const mockApi: IJolpicaAdapter = {
        buildUrl: vi.fn(() => ''),
        fetchPage: vi.fn(),
        fetchAllRaces: vi.fn(async () => []),
      };

      const mockStorage: IChampionshipStorage = {
        keys: { detailedResults: 'k1', syncMeta: 'k2', syncReview: 'k3', dismissedReview: 'k4' },
        loadRawDetailedResults: vi.fn(() => null),
        persistRawDetailedResults: vi.fn(),
        loadSyncMetadata: vi.fn(() => null),
        persistSyncMetadata: vi.fn(),
        clearStaleSyncReview: vi.fn(),
      };

      const abortController = new AbortController();
      abortController.abort(); // Pre-aborted

      const useCase = new SyncSeasonResultsUseCase(mockApi, mockStorage);
      const res = await useCase.execute(2026, [], { abortSignal: abortController.signal });

      expect(res.success).toBe(false);
      expect(res.source).toBe('Cancelled');
      expect(mockStorage.persistRawDetailedResults).not.toHaveBeenCalled();
      expect(mockStorage.persistSyncMetadata).not.toHaveBeenCalled();
    });

    it('NEVER writes to LocalStorage when a delayed sync is superseded (isFresh returns false)', async () => {
      const mockApi: IJolpicaAdapter = {
        buildUrl: vi.fn(() => ''),
        fetchPage: vi.fn(),
        fetchAllRaces: vi.fn(async () => [
          {
            season: '2026',
            round: '1',
            raceName: 'Delayed GP',
            date: '2026-03-01',
            Results: [
              {
                position: '1',
                points: '25',
                Driver: { driverId: 'norris' },
                Constructor: { constructorId: 'mclaren', name: 'McLaren' },
              },
            ],
          },
        ]),
      };

      const mockStorage: IChampionshipStorage = {
        keys: { detailedResults: 'k1', syncMeta: 'k2', syncReview: 'k3', dismissedReview: 'k4' },
        loadRawDetailedResults: vi.fn(() => ({ 2024: [], 2025: [], 2026: [] })),
        persistRawDetailedResults: vi.fn(),
        loadSyncMetadata: vi.fn(() => null),
        persistSyncMetadata: vi.fn(),
        clearStaleSyncReview: vi.fn(),
      };

      const useCase = new SyncSeasonResultsUseCase(mockApi, mockStorage);

      // Simulate superseded sync where isFresh returns false
      const res = await useCase.execute(2026, [], {
        isFresh: () => false,
      });

      expect(res.success).toBe(false);
      expect(res.source).toBe('Cancelled');
      expect(mockStorage.persistRawDetailedResults).not.toHaveBeenCalled();
      expect(mockStorage.persistSyncMetadata).not.toHaveBeenCalled();
    });

    it('merges newly synced season with fresh storage state rather than clobbering other seasons', async () => {
      const mockApi: IJolpicaAdapter = {
        buildUrl: vi.fn(() => ''),
        fetchPage: vi.fn(),
        fetchAllRaces: vi.fn(async () => [
          {
            season: '2026',
            round: '1',
            raceName: 'Fresh 2026 GP',
            date: '2026-03-01',
            Results: [
              {
                position: '1',
                points: '25',
                Driver: { driverId: 'norris' },
                Constructor: { constructorId: 'mclaren', name: 'McLaren' },
              },
            ],
          },
        ]),
      };

      const existing2024Race: DetailedRaceResult = {
        id: 'race-2024-r1',
        season: 2024,
        round: 1,
        grandPrix: 'Bahrain 2024',
        officialName: 'Bahrain GP',
        circuit: 'Sakhir',
        date: '2024-03-02',
        status: 'completed',
        lapsTotal: 57,
        entries: [],
      };

      const mockStorage: IChampionshipStorage = {
        keys: { detailedResults: 'k1', syncMeta: 'k2', syncReview: 'k3', dismissedReview: 'k4' },
        loadRawDetailedResults: vi.fn(() => ({
          2024: [existing2024Race],
          2025: [],
          2026: [],
        })),
        persistRawDetailedResults: vi.fn(),
        loadSyncMetadata: vi.fn(() => null),
        persistSyncMetadata: vi.fn(),
        clearStaleSyncReview: vi.fn(),
      };

      const useCase = new SyncSeasonResultsUseCase(mockApi, mockStorage);
      const res = await useCase.execute(2026, [], {
        isFresh: () => true,
      });

      expect(res.success).toBe(true);
      expect(mockStorage.persistRawDetailedResults).toHaveBeenCalledWith(
        expect.objectContaining({
          2024: [existing2024Race], // Preserved!
          2026: expect.any(Array),
        }),
      );
    });
  });

  describe('Presentation Team Identity Type Guard (isKnownPresentationTeam)', () => {
    it('returns true for all 11 canonical active TeamIds', async () => {
      const { isKnownPresentationTeam, ACTIVE_PRESENTATION_TEAMS } =
        await import('../contracts/applicationContracts');

      expect(ACTIVE_PRESENTATION_TEAMS).toHaveLength(11);

      const expectedTeams = [
        'ferrari',
        'mclaren',
        'redbull',
        'mercedes',
        'astonmartin',
        'alpine',
        'racingbulls',
        'haas',
        'williams',
        'audi',
        'cadillac',
      ];

      for (const team of expectedTeams) {
        expect(ACTIVE_PRESENTATION_TEAMS).toContain(team);
        expect(isKnownPresentationTeam(team)).toBe(true);
      }
    });

    it('strictly rejects unknown, empty strings, legacy aliases, and arbitrary values', async () => {
      const { isKnownPresentationTeam } = await import('../contracts/applicationContracts');

      expect(isKnownPresentationTeam('unknown')).toBe(false);
      expect(isKnownPresentationTeam('')).toBe(false);
      expect(isKnownPresentationTeam('sauber')).toBe(false);
      expect(isKnownPresentationTeam('kick_sauber')).toBe(false);
      expect(isKnownPresentationTeam('audi_sport')).toBe(false);
      expect(isKnownPresentationTeam('random_team')).toBe(false);
      expect(isKnownPresentationTeam(undefined)).toBe(false);
      expect(isKnownPresentationTeam(null)).toBe(false);
      expect(isKnownPresentationTeam(123)).toBe(false);
      expect(isKnownPresentationTeam({})).toBe(false);
    });
  });
});
