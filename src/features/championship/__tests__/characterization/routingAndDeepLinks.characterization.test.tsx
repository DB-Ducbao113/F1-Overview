import { describe, it, expect, beforeEach } from 'vitest';
import { useChampionshipStore } from '../../../../store/useChampionshipStore';
import { isSeasonYear, SeasonYear } from '../../../../types';

describe('Characterization Baseline — Routing, Deep Links & Store Actions', () => {
  beforeEach(() => {
    useChampionshipStore.setState({
      selectedSeason: 2026,
      activeSubTab: 'standings',
      standingsCategory: 'drivers',
      selectedRaceRound: null,
    });
  });

  describe('Season Validation & Routing Guards', () => {
    it('validates supported F1 championship seasons (2024, 2025, 2026)', () => {
      expect(isSeasonYear(2024)).toBe(true);
      expect(isSeasonYear(2025)).toBe(true);
      expect(isSeasonYear(2026)).toBe(true);
      expect(isSeasonYear('2024')).toBe(true);
      expect(isSeasonYear('2025')).toBe(true);
      expect(isSeasonYear('2026')).toBe(true);

      // Unsupported or invalid seasons
      expect(isSeasonYear(2023)).toBe(false);
      expect(isSeasonYear(2027)).toBe(false);
      expect(isSeasonYear('invalid')).toBe(false);
      expect(isSeasonYear(undefined)).toBe(false);
    });
  });

  describe('Deep Linking & Tab State Resolution', () => {
    const validTabs = ['standings', 'calendar', 'results', 'teams', 'drivers'] as const;

    it.each(validTabs)('correctly transitions activeSubTab to "%s"', (tab) => {
      useChampionshipStore.getState().setActiveSubTab(tab);
      expect(useChampionshipStore.getState().activeSubTab).toBe(tab);
    });

    it('switches seasons correctly via store actions', () => {
      const seasons: SeasonYear[] = [2024, 2025, 2026];
      for (const season of seasons) {
        useChampionshipStore.getState().setSelectedSeason(season);
        expect(useChampionshipStore.getState().selectedSeason).toBe(season);
      }
    });

    it('selects and deselects race rounds for modal deep links', () => {
      useChampionshipStore.getState().setSelectedRaceRound(18);
      expect(useChampionshipStore.getState().selectedRaceRound).toBe(18);

      useChampionshipStore.getState().setSelectedRaceRound(null);
      expect(useChampionshipStore.getState().selectedRaceRound).toBeNull();
    });

    it('switches standings category between drivers and constructors', () => {
      useChampionshipStore.getState().setStandingsCategory('constructors');
      expect(useChampionshipStore.getState().standingsCategory).toBe('constructors');

      useChampionshipStore.getState().setStandingsCategory('drivers');
      expect(useChampionshipStore.getState().standingsCategory).toBe('drivers');
    });
  });
});
