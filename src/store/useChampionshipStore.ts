import { create } from 'zustand';
import {
  SeasonYear,
  DriverStanding,
  ConstructorStanding,
  DetailedRaceResult,
  F1SyncMetadata,
} from '../types';
import {
  calculateSeasonStandingsUseCase,
  loadInitialChampionshipDataUseCase,
  syncSeasonResultsUseCase,
} from '../features/championship/application';

export interface ChampionshipStoreState {
  selectedSeason: SeasonYear;
  activeSubTab: 'standings' | 'calendar' | 'results' | 'drivers' | 'teams';
  standingsCategory: 'drivers' | 'constructors';
  selectedRaceRound: number | null;

  // Live and Raw Data
  detailedResults: Record<SeasonYear, DetailedRaceResult[]>;
  calculatedStandings: Record<
    SeasonYear,
    { drivers: DriverStanding[]; constructors: ConstructorStanding[] }
  >;
  syncMeta: F1SyncMetadata;

  // Actions
  setSelectedSeason: (season: SeasonYear) => void;
  setActiveSubTab: (tab: 'standings' | 'calendar' | 'results' | 'drivers' | 'teams') => void;
  setStandingsCategory: (category: 'drivers' | 'constructors') => void;
  setSelectedRaceRound: (round: number | null) => void;

  // Data Pipeline Synchronization Actions
  syncSeasonData: (season: SeasonYear) => Promise<void>;
}

// ── In-Flight Request & Concurrency Guard ──
let activeSyncController: AbortController | null = null;
let activeSyncSeason: SeasonYear | null = null;
let syncGeneration = 0;

// Load initial data via Championship Application Use Case
const initialData = loadInitialChampionshipDataUseCase.execute();

export const useChampionshipStore = create<ChampionshipStoreState>((set, get) => ({
  selectedSeason: 2026,
  activeSubTab: 'standings',
  standingsCategory: 'drivers',
  selectedRaceRound: null,

  detailedResults: initialData.detailedResults,
  calculatedStandings: initialData.calculatedStandings,
  syncMeta: initialData.syncMeta,

  setSelectedSeason: (season) => {
    // If season changes while an active sync for another season is in progress,
    // cancel the stale request to prevent late responses from overwriting state.
    if (activeSyncSeason !== null && activeSyncSeason !== season) {
      activeSyncController?.abort();
      activeSyncController = null;
      activeSyncSeason = null;
      syncGeneration++;
    }
    set({ selectedSeason: season });
  },

  setActiveSubTab: (tab) => set({ activeSubTab: tab }),
  setStandingsCategory: (category) => set({ standingsCategory: category }),
  setSelectedRaceRound: (round) => set({ selectedRaceRound: round }),

  syncSeasonData: async (season) => {
    // Guard against duplicate concurrent sync for the same season
    if (get().syncMeta.syncStatus === 'syncing' && activeSyncSeason === season) {
      return;
    }

    // Cancel any previous in-flight sync operation
    if (activeSyncController) {
      activeSyncController.abort();
    }

    const abortController = new AbortController();
    activeSyncController = abortController;
    activeSyncSeason = season;
    const currentGeneration = ++syncGeneration;

    try {
      set({
        syncMeta: {
          ...get().syncMeta,
          syncStatus: 'syncing',
          message: `Đang kết nối và đối chiếu dữ liệu mùa giải ${season}...`,
        },
      });

      const currentRaces = get().detailedResults[season] || [];
      const syncRes = await syncSeasonResultsUseCase.execute(season, currentRaces, {
        abortSignal: abortController.signal,
        currentResultsMap: get().detailedResults,
        isFresh: () => currentGeneration === syncGeneration && !abortController.signal.aborted,
      });

      // Discard stale responses if generation has changed or request was cancelled
      if (currentGeneration !== syncGeneration || abortController.signal.aborted) {
        return;
      }

      // Failed or partial sync: keep saved snapshot untouched, update metadata honestly
      if (!syncRes.success) {
        set({ syncMeta: syncRes.syncMetadata });
        return;
      }

      // Successful sync: apply reconciled results and recalculated standings
      const nextDetailedResults = {
        ...get().detailedResults,
        [season]: syncRes.results,
      };

      const nextStandingsForSeason =
        syncRes.standings ?? calculateSeasonStandingsUseCase.execute(season, syncRes.results);

      const nextCalculated = {
        ...get().calculatedStandings,
        [season]: nextStandingsForSeason,
      };

      set({
        detailedResults: nextDetailedResults,
        calculatedStandings: nextCalculated,
        syncMeta: syncRes.syncMetadata,
      });
    } catch (err: any) {
      // Ignore AbortError if cancelled intentionally
      if (err instanceof DOMException && err.name === 'AbortError') {
        return;
      }
      if (currentGeneration !== syncGeneration) {
        return;
      }
      console.error('syncSeasonData safe catch:', err);
      const fallbackMeta: F1SyncMetadata = {
        ...get().syncMeta,
        syncStatus: 'error',
        message: 'Đồng bộ tạm gián đoạn; đang sử dụng dữ liệu nội bộ sẵn có.',
      };
      set({ syncMeta: fallbackMeta });
    } finally {
      if (currentGeneration === syncGeneration) {
        activeSyncController = null;
        activeSyncSeason = null;
      }
    }
  },
}));
