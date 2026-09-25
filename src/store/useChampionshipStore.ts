import { create } from 'zustand';
import {
  SeasonYear,
  DriverStanding,
  ConstructorStanding,
  DetailedRaceResult,
  F1SyncMetadata,
} from '../types';
import {
  loadSavedDetailedResults,
  persistDetailedResults,
  loadSyncMetadata,
  persistSyncMetadata,
  syncF1SeasonData,
  simulateNextGrandPrixCompletion,
} from '../services/f1DataService';
import { recalculateStandingsFromRaces } from '../services/standingsEngine';
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
  calculatedStandings: Record<SeasonYear, { drivers: DriverStanding[]; constructors: ConstructorStanding[] }>;
  syncMeta: F1SyncMetadata;

  // Modal inspection state
  selectedRaceForModal: DetailedRaceResult | null;

  // Actions
  setSelectedSeason: (season: SeasonYear) => void;
  setActiveSubTab: (tab: 'standings' | 'calendar' | 'results') => void;
  setStandingsCategory: (category: 'drivers' | 'constructors') => void;
  openRaceModal: (race: DetailedRaceResult) => void;
  closeRaceModal: () => void;

  // Data Pipeline Synchronization Actions
  syncSeasonData: (season: SeasonYear) => Promise<void>;
  simulateNewRace: (season: SeasonYear) => void;
}

const initialDetailedResults = loadSavedDetailedResults();

// Compute initial calculated standings from the loaded results
function computeInitialStandings(resultsMap: Record<SeasonYear, DetailedRaceResult[]>) {
  const out: Record<SeasonYear, { drivers: DriverStanding[]; constructors: ConstructorStanding[] }> = {
    2024: { drivers: DRIVER_STANDINGS_2024, constructors: CONSTRUCTOR_STANDINGS_2024 },
    2025: { drivers: DRIVER_STANDINGS_2025, constructors: CONSTRUCTOR_STANDINGS_2025 },
    2026: { drivers: DRIVER_STANDINGS_2026, constructors: CONSTRUCTOR_STANDINGS_2026 },
  };

  // Only recalculate for ongoing season (2026) if there are rounds completed beyond round 14
  const races2026 = resultsMap[2026];
  if (races2026 && races2026.some((r) => r.round > 14 && r.status === 'completed')) {
    out[2026] = recalculateStandingsFromRaces(
      2026,
      races2026,
      BASE_DRIVER_STANDINGS[2026],
      BASE_CONSTRUCTOR_STANDINGS[2026]
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
  selectedRaceForModal: null,

  setSelectedSeason: (season) => set({ selectedSeason: season }),
  setActiveSubTab: (tab) => set({ activeSubTab: tab }),
  setStandingsCategory: (category) => set({ standingsCategory: category }),

  openRaceModal: (race) => set({ selectedRaceForModal: race }),
  closeRaceModal: () => set({ selectedRaceForModal: null }),

  syncSeasonData: async (season) => {
    set({
      syncMeta: {
        ...get().syncMeta,
        syncStatus: 'syncing',
        message: `Đang kết nối và đối chiếu dữ liệu mùa giải ${season}...`,
      },
    });

    const currentRaces = get().detailedResults[season] || [];
    const syncRes = await syncF1SeasonData(season, currentRaces);

    const nextDetailedResults = {
      ...get().detailedResults,
      [season]: syncRes.results,
    };

    // Recalculate standings live
    const nextStandingsForSeason = recalculateStandingsFromRaces(
      season,
      syncRes.results,
      BASE_DRIVER_STANDINGS[season],
      BASE_CONSTRUCTOR_STANDINGS[season]
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

  simulateNewRace: (season) => {
    const currentRaces = get().detailedResults[season] || [];
    const { updatedRaces, newRace } = simulateNextGrandPrixCompletion(season, currentRaces);

    const nextDetailedResults = {
      ...get().detailedResults,
      [season]: updatedRaces,
    };

    // Recalculate standings live with new race results
    const nextStandingsForSeason = recalculateStandingsFromRaces(
      season,
      updatedRaces,
      BASE_DRIVER_STANDINGS[season],
      BASE_CONSTRUCTOR_STANDINGS[season]
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
      }),
      syncStatus: 'success',
      source: 'Automated Pipeline Simulator (Grand Prix Result Ingestion)',
      completedRoundsCount: updatedRaces.length,
      message: `Đã tự động tính toán lại Standings sau khi hoàn thành ${newRace.grandPrix}!`,
    };

    persistDetailedResults(nextDetailedResults);
    persistSyncMetadata(nextMeta);

    set({
      detailedResults: nextDetailedResults,
      calculatedStandings: nextCalculated,
      syncMeta: nextMeta,
    });
  },
}));
