import {
  DetailedRaceResult,
  DetailedRaceResultEntry,
  F1SyncMetadata,
  SeasonYear,
} from '../../../../types';
import { attachOpenF1SprintResults } from '../../../../data/championship/openF1SprintBridge';
import { mapConstructorId, normalizeDriverId } from '../../domain';
import {
  championshipStorage,
  IChampionshipStorage,
  IJolpicaAdapter,
  jolpicaAdapter,
  PartialSyncError,
  RawJolpicaRace,
} from '../../infrastructure';
import {
  ISyncSeasonResultsUseCase,
  SyncSeasonUseCaseResult,
} from '../contracts/applicationContracts';
import { calculateSeasonStandingsUseCase } from './calculateSeasonStandingsUseCase';
import { INITIAL_DETAILED_RESULTS } from './loadInitialChampionshipDataUseCase';

export class SyncSeasonResultsUseCase implements ISyncSeasonResultsUseCase {
  constructor(
    private readonly api: IJolpicaAdapter = jolpicaAdapter,
    private readonly storage: IChampionshipStorage = championshipStorage,
  ) {}

  private transformJolpicaRaces(
    season: SeasonYear,
    racesApi: RawJolpicaRace[],
    sprintRaces: RawJolpicaRace[],
    existingResults: DetailedRaceResult[],
    syncedAt: string,
  ): DetailedRaceResult[] {
    const racesByRound = new Map<number, any>();
    racesApi.forEach((race: any) => racesByRound.set(parseInt(race.round, 10), race));
    sprintRaces.forEach((race: any) => {
      const round = parseInt(race.round, 10);
      const existing = racesByRound.get(round);
      racesByRound.set(round, {
        ...race,
        ...existing,
        SprintResults: race.SprintResults || existing?.SprintResults || [],
      });
    });

    const savedByRound = new Map(existingResults.map((race) => [race.round, race]));

    const transformed = [...racesByRound.values()].map((race: any): DetailedRaceResult | null => {
      const entries: DetailedRaceResultEntry[] = (race.Results || []).map((res: any) => {
        const teamId = mapConstructorId(res.Constructor?.constructorId, season);
        const pos = parseInt(res.position, 10) || 20;
        return {
          position: pos,
          driverId: normalizeDriverId(res.Driver?.driverId),
          driverName: `${res.Driver?.givenName || ''} ${res.Driver?.familyName || ''}`.trim(),
          driverCode: res.Driver?.code || 'F1',
          driverNumber: parseInt(res.Driver?.permanentNumber, 10) || undefined,
          teamId,
          teamName: res.Constructor?.name || 'Constructor',
          laps: parseInt(res.laps, 10) || 0,
          status: res.status || 'Finished',
          timeOrGap: res.Time?.time || res.status || '+1 Lap',
          points: parseFloat(res.points) || 0,
          fastestLap: res.FastestLap?.rank === '1',
          fastestLapTime: res.FastestLap?.Time?.time,
          gridPosition: parseInt(res.grid, 10) || undefined,
        };
      });

      const fetchedSprintEntries: DetailedRaceResultEntry[] = (race.SprintResults || []).map(
        (res: any, index: number) => ({
          position: parseInt(res.position, 10) || index + 1,
          driverId: normalizeDriverId(res.Driver?.driverId),
          driverName: `${res.Driver?.givenName || ''} ${res.Driver?.familyName || ''}`.trim(),
          driverCode: res.Driver?.code || 'F1',
          driverNumber: parseInt(res.Driver?.permanentNumber, 10) || undefined,
          teamId: mapConstructorId(res.Constructor?.constructorId, season),
          teamName: res.Constructor?.name || 'Constructor',
          laps: parseInt(res.laps, 10) || 0,
          status: res.status || 'Finished',
          timeOrGap: res.Time?.time || res.status || '',
          points: parseFloat(res.points) || 0,
          gridPosition: parseInt(res.grid, 10) || undefined,
        }),
      );

      const savedRace = savedByRound.get(parseInt(race.round, 10));
      const sprintEntries =
        fetchedSprintEntries.length > 0
          ? fetchedSprintEntries
          : savedRace?.sprintEntries ||
            savedRace?.entries
              .filter((entry) => entry.sprintPoints)
              .map((entry) => ({
                ...entry,
                points: entry.sprintPoints || 0,
                sprintPoints: undefined,
              })) ||
            [];

      const sprintProvenance =
        fetchedSprintEntries.length > 0
          ? ('official' as const)
          : sprintEntries.length > 0
            ? (savedRace?.sprintProvenance ?? ('provisional' as const))
            : undefined;

      const round = parseInt(race.round, 10);
      if (!Number.isFinite(round)) return null;

      const safeRaceName =
        typeof race.raceName === 'string' && race.raceName.length > 0
          ? race.raceName
          : `Round ${Number.isFinite(round) ? round : 'unknown'}`;

      return {
        id: `race-${season}-r${race.round}-${safeRaceName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
        season,
        round,
        grandPrix: safeRaceName,
        officialName: safeRaceName,
        circuit: race.Circuit?.circuitName || 'Circuit',
        location: race.Circuit?.Location?.locality,
        country: race.Circuit?.Location?.country,
        date: race.date,
        dataSource: 'Jolpica F1 API',
        dataUpdatedAt: syncedAt,
        status: entries.length > 0 ? 'completed' : 'scheduled',
        lapsTotal: entries[0]?.laps || 57,
        winner: entries[0]
          ? {
              driver: entries[0].driverName,
              team: entries[0].teamName,
              time: entries[0].timeOrGap,
            }
          : undefined,
        fastestLap: entries.find((e) => e.fastestLap)
          ? {
              driver: entries.find((e) => e.fastestLap)!.driverName,
              team: entries.find((e) => e.fastestLap)!.teamName,
              time: entries.find((e) => e.fastestLap)!.fastestLapTime || '',
            }
          : undefined,
        entries,
        sprintEntries,
        sprintProvenance,
      };
    });

    const raceByRound = new Map(
      transformed
        .filter((race): race is DetailedRaceResult => race !== null)
        .map((race) => [race.round, race] as const),
    );

    // Baseline only fills rounds missing from sync
    for (const race of INITIAL_DETAILED_RESULTS[season] || []) {
      if (race && typeof race.round === 'number' && !raceByRound.has(race.round)) {
        raceByRound.set(race.round, race);
      }
    }

    return attachOpenF1SprintResults({
      ...INITIAL_DETAILED_RESULTS,
      [season]: [...raceByRound.values()].sort((a, b) => a.round - b.round),
    })[season];
  }

  async execute(
    season: SeasonYear,
    existingResults: DetailedRaceResult[],
    options?: {
      abortSignal?: AbortSignal;
      currentResultsMap?: Record<SeasonYear, DetailedRaceResult[]>;
    },
  ): Promise<SyncSeasonUseCaseResult> {
    const fallbackResults =
      existingResults.length > 0 ? existingResults : INITIAL_DETAILED_RESULTS[season] || [];

    // Check pre-execution cancellation
    if (options?.abortSignal?.aborted) {
      const cancelledMeta: F1SyncMetadata = {
        lastSyncTimestamp: new Date().toLocaleTimeString('vi-VN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          day: '2-digit',
          month: '2-digit',
        }),
        syncStatus: 'error',
        source: 'Cancelled',
        completedRoundsCount: fallbackResults.length,
        message: 'Đồng bộ đã bị hủy.',
      };
      return {
        success: false,
        results: fallbackResults,
        message: 'Đồng bộ đã bị hủy.',
        source: 'Cancelled',
        syncMetadata: cancelledMeta,
      };
    }

    try {
      // 1. Fetch live classifications from API adapter
      const racesApi = await this.api.fetchAllRaces(season, 'results');

      // Check cancellation between requests
      if (options?.abortSignal?.aborted) {
        throw new DOMException('Sync operation was cancelled', 'AbortError');
      }

      let sprintRaces: RawJolpicaRace[] = [];
      let sprintSyncWarning = '';
      try {
        sprintRaces = await this.api.fetchAllRaces(season, 'sprint');
      } catch (error) {
        sprintSyncWarning =
          ' Không thể làm mới kết quả Sprint; vẫn giữ điểm Sprint đã lưu gần nhất.';
        console.warn('Sprint classification refresh failed:', error);
      }

      // Check cancellation before processing
      if (options?.abortSignal?.aborted) {
        throw new DOMException('Sync operation was cancelled', 'AbortError');
      }

      if (racesApi.length > 0 || sprintRaces.length > 0) {
        const syncedAt = new Date().toISOString();
        const syncedResults = this.transformJolpicaRaces(
          season,
          racesApi,
          sprintRaces,
          existingResults,
          syncedAt,
        );

        // Check cancellation before persistence
        if (options?.abortSignal?.aborted) {
          throw new DOMException('Sync operation was cancelled', 'AbortError');
        }

        // 2. Recalculate standings for this season
        const calculatedStandings = calculateSeasonStandingsUseCase.execute(season, syncedResults);

        // 3. Format sync metadata
        const syncMeta: F1SyncMetadata = {
          lastSyncTimestamp: new Date().toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            day: '2-digit',
            month: '2-digit',
          }),
          syncStatus: 'success',
          source: 'Jolpica F1 API',
          completedRoundsCount: syncedResults.length,
          message: `Đã đồng bộ ${syncedResults.length} chặng, gồm cả điểm Sprint nếu có, từ Jolpica.${sprintSyncWarning}`,
        };

        // 4. Persist updated results and metadata to storage
        if (options?.currentResultsMap) {
          const nextResultsMap = {
            ...options.currentResultsMap,
            [season]: syncedResults,
          };
          this.storage.persistRawDetailedResults(nextResultsMap);
        }
        this.storage.persistSyncMetadata(syncMeta);

        return {
          success: true,
          results: syncedResults,
          standings: calculatedStandings,
          message: syncMeta.message || 'Đồng bộ thành công.',
          source: 'Jolpica F1 API',
          syncMetadata: syncMeta,
        };
      }
    } catch (err: any) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        const cancelledMeta: F1SyncMetadata = {
          lastSyncTimestamp: new Date().toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            day: '2-digit',
            month: '2-digit',
          }),
          syncStatus: 'error',
          source: 'Cancelled',
          completedRoundsCount: fallbackResults.length,
          message: 'Đồng bộ đã bị hủy.',
        };
        return {
          success: false,
          results: fallbackResults,
          message: 'Đồng bộ đã bị hủy.',
          source: 'Cancelled',
          syncMetadata: cancelledMeta,
        };
      }

      const partial = err instanceof PartialSyncError;
      const failMeta: F1SyncMetadata = {
        lastSyncTimestamp: new Date().toLocaleTimeString('vi-VN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          day: '2-digit',
          month: '2-digit',
        }),
        syncStatus: 'error',
        source: 'Local saved snapshot',
        completedRoundsCount: fallbackResults.length,
        message: partial
          ? 'Đồng bộ dở dang (một số trang lỗi); đang giữ nguyên dữ liệu đã lưu, không báo thành công.'
          : 'Không thể kết nối Jolpica lúc này; đang giữ dữ liệu đã lưu gần nhất.',
      };

      // Persist failure metadata honestly (without touching stored results)
      this.storage.persistSyncMetadata(failMeta);

      return {
        success: false,
        partial: partial || undefined,
        results: fallbackResults,
        message: failMeta.message || 'Lỗi đồng bộ.',
        source: 'Local saved snapshot',
        syncMetadata: failMeta,
      };
    }

    // Empty upstream payload fallback
    const emptyMeta: F1SyncMetadata = {
      lastSyncTimestamp: new Date().toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        day: '2-digit',
        month: '2-digit',
      }),
      syncStatus: 'error',
      source: 'Local saved snapshot',
      completedRoundsCount: fallbackResults.length,
      message: 'Jolpica chua co du lieu moi; dang giu du lieu da luu gan nhat.',
    };
    this.storage.persistSyncMetadata(emptyMeta);

    return {
      success: false,
      results: fallbackResults,
      message: emptyMeta.message || 'Không có dữ liệu mới.',
      source: 'Local saved snapshot',
      syncMetadata: emptyMeta,
    };
  }
}

export const syncSeasonResultsUseCase = new SyncSeasonResultsUseCase();
