import { create } from 'zustand';
import {
  SeasonYear,
  DriverStanding,
  ConstructorStanding,
  DetailedRaceResult,
  F1SyncMetadata,
  F1SyncReview,
  F1ResultDifference,
  RaceResult,
} from '../types';
import {
  loadSavedDetailedResults,
  persistDetailedResults,
  loadSyncMetadata,
  persistSyncMetadata,
  syncF1SeasonData,
  loadSyncReview,
  persistSyncReview,
  loadDismissedSyncSignature,
  persistDismissedSyncSignature,
} from '../services/f1DataService';
import { recalculateStandingsFromRaces } from '../services/standingsEngine';
import { getRaceResults } from '../data/championship/results';
import {
  DRIVER_STANDINGS_2024,
  CONSTRUCTOR_STANDINGS_2024,
  DRIVER_STANDINGS_2025,
  CONSTRUCTOR_STANDINGS_2025,
  DRIVER_STANDINGS_2026,
  CONSTRUCTOR_STANDINGS_2026,
} from '../data/championship/standings';

// Base standings fallback
const BASE_DRIVER_STANDINGS: Record<SeasonYear, DriverStanding[]> = {
  2024: DRIVER_STANDINGS_2024,
  2025: DRIVER_STANDINGS_2025,
  2026: DRIVER_STANDINGS_2026,
};

const BASE_CONSTRUCTOR_STANDINGS: Record<SeasonYear, ConstructorStanding[]> = {
  2024: CONSTRUCTOR_STANDINGS_2024,
  2025: CONSTRUCTOR_STANDINGS_2025,
  2026: CONSTRUCTOR_STANDINGS_2026,
};

interface ChampionshipStoreState {
  selectedSeason: SeasonYear;
  activeSubTab: 'standings' | 'calendar' | 'results';
  standingsCategory: 'drivers' | 'constructors';

  // Live and Raw Data
  detailedResults: Record<SeasonYear, DetailedRaceResult[]>;
  calculatedStandings: Record<
    SeasonYear,
    { drivers: DriverStanding[]; constructors: ConstructorStanding[] }
  >;
  syncMeta: F1SyncMetadata;
  pendingSyncReview: F1SyncReview | null;
  dismissedSyncSignature: string | null;

  // Actions
  setSelectedSeason: (season: SeasonYear) => void;
  setActiveSubTab: (tab: 'standings' | 'calendar' | 'results') => void;
  setStandingsCategory: (category: 'drivers' | 'constructors') => void;

  // Data Pipeline Synchronization Actions
  syncSeasonData: (season: SeasonYear) => Promise<void>;
  acceptSyncReview: () => void;
  dismissSyncReview: () => void;
}

const initialDetailedResults = loadSavedDetailedResults();

function describePodium(race: DetailedRaceResult): string {
  return [1, 2, 3]
    .map((position) => {
      const entry = race.entries.find((candidate) => candidate.position === position);
      return entry ? `${position}. ${entry.driverName} (${entry.points} pts)` : null;
    })
    .filter(Boolean)
    .join(' · ');
}

function describeSavedPodium(result: RaceResult): string {
  return [result.podium.p1, result.podium.p2, result.podium.p3]
    .map((entry, index) => `${index + 1}. ${entry.driver} (${entry.points} pts)`)
    .join(' · ');
}

function describeClassificationDifferences(
  saved: DetailedRaceResult,
  incoming: DetailedRaceResult,
): { previous: string; incoming: string } {
  const savedByPosition = new Map(saved.entries.map((entry) => [entry.position, entry]));
  const incomingByPosition = new Map(incoming.entries.map((entry) => [entry.position, entry]));
  const positions = [...new Set([...savedByPosition.keys(), ...incomingByPosition.keys()])].sort(
    (a, b) => a - b,
  );
  const changed = positions.filter((position) => {
    const oldEntry = savedByPosition.get(position);
    const newEntry = incomingByPosition.get(position);
    return (
      !oldEntry ||
      !newEntry ||
      [
        oldEntry.driverId,
        oldEntry.laps,
        oldEntry.status,
        oldEntry.timeOrGap,
        oldEntry.points,
        oldEntry.fastestLap,
        oldEntry.fastestLapTime,
      ].join('|') !==
        [
          newEntry.driverId,
          newEntry.laps,
          newEntry.status,
          newEntry.timeOrGap,
          newEntry.points,
          newEntry.fastestLap,
          newEntry.fastestLapTime,
        ].join('|')
    );
  });
  const describe = (entry: DetailedRaceResult['entries'][number] | undefined, position: number) =>
    entry
      ? `P${position} ${entry.driverName} (${entry.points} pts, ${entry.timeOrGap})`
      : `P${position} —`;
  return {
    previous: changed
      .slice(0, 8)
      .map((position) => describe(savedByPosition.get(position), position))
      .join(' · '),
    incoming: changed
      .slice(0, 8)
      .map((position) => describe(incomingByPosition.get(position), position))
      .join(' · '),
  };
}

function sameRaceClassification(a: DetailedRaceResult, b: DetailedRaceResult): boolean {
  const fingerprint = (race: DetailedRaceResult) =>
    race.entries
      .slice()
      .sort((left, right) => left.position - right.position)
      .map(({ position, driverId, laps, status, timeOrGap, points, fastestLap, fastestLapTime }) =>
        [position, driverId, laps, status, timeOrGap, points, fastestLap, fastestLapTime].join('|'),
      )
      .join('\n');
  return fingerprint(a) === fingerprint(b);
}

function getSyncSignature(results: DetailedRaceResult[]): string {
  return JSON.stringify(
    results
      .slice()
      .sort((left, right) => left.round - right.round)
      .map((race) => ({
        round: race.round,
        entries: race.entries
          .slice()
          .sort((left, right) => left.position - right.position)
          .map(
            ({
              position,
              driverId,
              laps,
              status,
              timeOrGap,
              points,
              fastestLap,
              fastestLapTime,
            }) => [position, driverId, laps, status, timeOrGap, points, fastestLap, fastestLapTime],
          ),
      })),
  );
}

function findSyncDifferences(
  season: SeasonYear,
  savedResults: DetailedRaceResult[],
  incomingResults: DetailedRaceResult[],
): F1ResultDifference[] {
  const savedByRound = new Map(savedResults.map((race) => [race.round, race]));
  const summaryByRound = new Map(getRaceResults(season).map((race) => [race.round, race]));
  const differences: F1ResultDifference[] = [];

  for (const incoming of incomingResults) {
    const saved = savedByRound.get(incoming.round);
    if (saved) {
      if (!sameRaceClassification(saved, incoming)) {
        const classification = describeClassificationDifferences(saved, incoming);
        differences.push({
          round: incoming.round,
          grandPrix: incoming.grandPrix,
          ...classification,
        });
      }
      continue;
    }

    const summary = summaryByRound.get(incoming.round);
    const podium = [1, 2, 3].map((position) =>
      incoming.entries.find((entry) => entry.position === position),
    );
    if (!summary || podium.some((entry) => !entry)) continue;
    const [p1, p2, p3] = podium;
    const matchesSnapshot =
      p1!.driverName === summary.podium.p1.driver &&
      p1!.points === summary.podium.p1.points &&
      p1!.timeOrGap === summary.podium.p1.time &&
      p2!.driverName === summary.podium.p2.driver &&
      p2!.points === summary.podium.p2.points &&
      p2!.timeOrGap === summary.podium.p2.gap &&
      p3!.driverName === summary.podium.p3.driver &&
      p3!.points === summary.podium.p3.points &&
      p3!.timeOrGap === summary.podium.p3.gap;
    if (!matchesSnapshot) {
      differences.push({
        round: incoming.round,
        grandPrix: incoming.grandPrix,
        previous: describeSavedPodium(summary),
        incoming: describePodium(incoming),
      });
    }
  }

  return differences;
}

// Compute initial calculated standings from the loaded results
function computeInitialStandings(resultsMap: Record<SeasonYear, DetailedRaceResult[]>) {
  const out: Record<
    SeasonYear,
    { drivers: DriverStanding[]; constructors: ConstructorStanding[] }
  > = {
    2024: { drivers: DRIVER_STANDINGS_2024, constructors: CONSTRUCTOR_STANDINGS_2024 },
    2025: { drivers: DRIVER_STANDINGS_2025, constructors: CONSTRUCTOR_STANDINGS_2025 },
    2026: { drivers: DRIVER_STANDINGS_2026, constructors: CONSTRUCTOR_STANDINGS_2026 },
  };

  // Only recalculate for ongoing season (2026) if there are rounds completed beyond round 15
  const races2026 = resultsMap[2026];
  if (races2026 && races2026.some((r) => r.round > 15 && r.status === 'completed')) {
    out[2026] = recalculateStandingsFromRaces(
      2026,
      races2026,
      BASE_DRIVER_STANDINGS[2026],
      BASE_CONSTRUCTOR_STANDINGS[2026],
    );
  }

  return out;
}

export const useChampionshipStore = create<ChampionshipStoreState>((set, get) => ({
  selectedSeason: 2026,
  activeSubTab: 'standings',
  standingsCategory: 'drivers',

  detailedResults: initialDetailedResults,
  calculatedStandings: computeInitialStandings(initialDetailedResults),
  syncMeta: loadSyncMetadata(),
  pendingSyncReview: loadSyncReview(),
  dismissedSyncSignature: loadDismissedSyncSignature(),

  setSelectedSeason: (season) => set({ selectedSeason: season }),
  setActiveSubTab: (tab) => set({ activeSubTab: tab }),
  setStandingsCategory: (category) => set({ standingsCategory: category }),

  syncSeasonData: async (season) => {
    if (get().pendingSyncReview) return;
    set({
      syncMeta: {
        ...get().syncMeta,
        syncStatus: 'syncing',
        message: `Đang kết nối và đối chiếu dữ liệu mùa giải ${season}...`,
      },
    });

    const currentRaces = get().detailedResults[season] || [];
    const syncRes = await syncF1SeasonData(season, currentRaces);

    if (syncRes.success) {
      const differences = findSyncDifferences(season, currentRaces, syncRes.results);
      if (differences.length > 0) {
        const signature = getSyncSignature(syncRes.results);
        if (signature === get().dismissedSyncSignature) {
          const keptMeta: F1SyncMetadata = {
            ...get().syncMeta,
            syncStatus: 'success',
            source: syncRes.source,
            message: 'Đã giữ bản lưu đã chọn; nguồn chưa có thay đổi mới.',
          };
          persistSyncMetadata(keptMeta);
          set({ syncMeta: keptMeta });
          return;
        }
        const review: F1SyncReview = {
          season,
          results: syncRes.results,
          differences,
          source: syncRes.source,
        };
        persistSyncReview(review);
        const reviewMeta: F1SyncMetadata = {
          lastSyncTimestamp: new Date().toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            day: '2-digit',
            month: '2-digit',
          }),
          syncStatus: 'review',
          source: syncRes.source,
          completedRoundsCount: syncRes.results.length,
          message: `${differences.length} chặng có dữ liệu khác bản lưu; cần xem xét trước khi áp dụng.`,
        };
        persistSyncMetadata(reviewMeta);
        set({ pendingSyncReview: review, syncMeta: reviewMeta });
        return;
      }
    }

    const nextDetailedResults = {
      ...get().detailedResults,
      [season]: syncRes.results,
    };

    // Recalculate standings live
    const nextStandingsForSeason = recalculateStandingsFromRaces(
      season,
      syncRes.results,
      BASE_DRIVER_STANDINGS[season],
      BASE_CONSTRUCTOR_STANDINGS[season],
    );

    const nextCalculated = {
      ...get().calculatedStandings,
      [season]: nextStandingsForSeason,
    };

    const nextMeta: F1SyncMetadata = {
      lastSyncTimestamp: new Date().toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        day: '2-digit',
        month: '2-digit',
      }),
      syncStatus: syncRes.success ? 'success' : 'error',
      source: syncRes.source,
      completedRoundsCount: syncRes.results.length,
      message: syncRes.message,
    };

    // Persist to storage
    persistDetailedResults(nextDetailedResults);
    persistSyncMetadata(nextMeta);

    set({
      detailedResults: nextDetailedResults,
      calculatedStandings: nextCalculated,
      syncMeta: nextMeta,
    });
  },

  acceptSyncReview: () => {
    const review = get().pendingSyncReview;
    if (!review) return;
    const nextDetailedResults = { ...get().detailedResults, [review.season]: review.results };
    const nextCalculated = {
      ...get().calculatedStandings,
      [review.season]: recalculateStandingsFromRaces(
        review.season,
        review.results,
        BASE_DRIVER_STANDINGS[review.season],
        BASE_CONSTRUCTOR_STANDINGS[review.season],
      ),
    };
    const nextMeta: F1SyncMetadata = {
      ...get().syncMeta,
      syncStatus: 'success',
      completedRoundsCount: review.results.length,
      message: 'Đã xác nhận dữ liệu mới và cập nhật bảng xếp hạng.',
    };
    persistDetailedResults(nextDetailedResults);
    persistSyncMetadata(nextMeta);
    persistSyncReview(null);
    persistDismissedSyncSignature(null);
    set({
      detailedResults: nextDetailedResults,
      calculatedStandings: nextCalculated,
      pendingSyncReview: null,
      dismissedSyncSignature: null,
      syncMeta: nextMeta,
    });
  },

  dismissSyncReview: () => {
    const review = get().pendingSyncReview;
    if (!review) return;
    const signature = getSyncSignature(review.results);
    persistSyncReview(null);
    persistDismissedSyncSignature(signature);
    const nextMeta: F1SyncMetadata = {
      ...get().syncMeta,
      syncStatus: 'success',
      message: 'Đã giữ nguyên dữ liệu hiện tại; đề xuất đồng bộ chưa được áp dụng.',
    };
    persistSyncMetadata(nextMeta);
    set({ pendingSyncReview: null, dismissedSyncSignature: signature, syncMeta: nextMeta });
  },
}));
