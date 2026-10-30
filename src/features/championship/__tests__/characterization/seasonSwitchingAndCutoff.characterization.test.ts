import { describe, it, expect } from 'vitest';
import { recalculateStandingsFromRaces } from '../../../../services/standingsEngine';
import { reconcileSeasonRaces } from '../../../../services/f1DataService';
import { attachOpenF1SprintResults } from '../../../../data/championship/openF1SprintBridge';
import { BASELINE_CUTOFF_BY_SEASON } from '../../../../data/championship/baselineCutoff';
import {
  DRIVER_STANDINGS_2024,
  CONSTRUCTOR_STANDINGS_2024,
  DRIVER_STANDINGS_2025,
  CONSTRUCTOR_STANDINGS_2025,
} from '../../../../data/championship/standings';
import { DetailedRaceResult } from '../../../../types';

describe('Characterization Baseline — Season Switching, Cutoffs & Source Priority', () => {
  describe('Season Switching Standings Invariance', () => {
    it('returns official final standings for completed season 2024 unchanged', () => {
      const dummyPostRace: DetailedRaceResult = {
        id: 'dummy-2024-r25',
        season: 2024,
        round: 25,
        grandPrix: 'Phantom GP',
        officialName: 'Phantom GP',
        circuit: 'Phantom Circuit',
        date: '2024-12-31',
        status: 'completed',
        lapsTotal: 50,
        entries: [
          {
            position: 1,
            driverId: 'verstappen',
            driverName: 'Max Verstappen',
            driverCode: 'VER',
            teamId: 'redbull',
            teamName: 'Red Bull',
            laps: 50,
            status: 'Finished',
            timeOrGap: '1:00:00',
            points: 25,
          },
        ],
      };

      const result = recalculateStandingsFromRaces(
        2024,
        [dummyPostRace],
        DRIVER_STANDINGS_2024,
        CONSTRUCTOR_STANDINGS_2024,
      );

      // 2024 is locked; base standings are returned verbatim without modification
      expect(result.drivers).toBe(DRIVER_STANDINGS_2024);
      expect(result.constructors).toBe(CONSTRUCTOR_STANDINGS_2024);
      expect(result.drivers[0].driverId).toBe('verstappen');
      expect(result.drivers[0].points).toBe(437);
    });

    it('returns official final standings for transition season 2025 unchanged', () => {
      const result = recalculateStandingsFromRaces(
        2025,
        [],
        DRIVER_STANDINGS_2025,
        CONSTRUCTOR_STANDINGS_2025,
      );

      expect(result.drivers).toBe(DRIVER_STANDINGS_2025);
      expect(result.constructors).toBe(CONSTRUCTOR_STANDINGS_2025);
    });
  });

  describe('Baseline Cutoff Policy Enforcement', () => {
    it('defines completedRounds cutoffs as internal data integrity policies', () => {
      expect(BASELINE_CUTOFF_BY_SEASON[2024].completedRounds).toBe(24);
      expect(BASELINE_CUTOFF_BY_SEASON[2024].final).toBe(true);

      expect(BASELINE_CUTOFF_BY_SEASON[2025].completedRounds).toBe(24);
      expect(BASELINE_CUTOFF_BY_SEASON[2025].final).toBe(true);

      expect(BASELINE_CUTOFF_BY_SEASON[2026].completedRounds).toBe(17);
      expect(BASELINE_CUTOFF_BY_SEASON[2026].final).toBe(false);
    });
  });

  describe('Source Priority & Reconciliation Logic', () => {
    it('cached races with valid entries supersede baseline placeholders', () => {
      const baselineRace: DetailedRaceResult = {
        id: 'race-2026-r18-baseline',
        season: 2026,
        round: 18,
        grandPrix: 'United States GP',
        officialName: 'United States GP',
        circuit: 'COTA',
        date: '2026-10-25',
        status: 'scheduled',
        lapsTotal: 56,
        entries: [],
      };

      const cachedRace: DetailedRaceResult = {
        id: 'race-2026-r18-synced',
        season: 2026,
        round: 18,
        grandPrix: 'United States GP',
        officialName: 'United States GP',
        circuit: 'COTA',
        date: '2026-10-25',
        status: 'completed',
        lapsTotal: 56,
        entries: [
          {
            position: 1,
            driverId: 'russell',
            driverName: 'George Russell',
            driverCode: 'RUS',
            teamId: 'mercedes',
            teamName: 'Mercedes',
            laps: 56,
            status: 'Finished',
            timeOrGap: '1:35:00',
            points: 25,
          },
        ],
      };

      const reconciled = reconcileSeasonRaces([baselineRace], [cachedRace]);

      expect(reconciled).toHaveLength(1);
      expect(reconciled[0].id).toBe('race-2026-r18-synced');
      expect(reconciled[0].status).toBe('completed');
      expect(reconciled[0].entries).toHaveLength(1);
    });

    it('attachOpenF1SprintResults preserves official sprint results over provisional data', () => {
      const raceWithOfficialSprint: DetailedRaceResult = {
        id: 'race-2026-r2-chinese-gp',
        season: 2026,
        round: 2,
        grandPrix: 'Chinese GP',
        officialName: 'Chinese GP',
        circuit: 'Shanghai',
        date: '2026-03-22',
        status: 'completed',
        lapsTotal: 56,
        entries: [],
        sprintEntries: [
          {
            position: 1,
            driverId: 'hamilton',
            driverName: 'Lewis Hamilton',
            driverCode: 'HAM',
            teamId: 'ferrari',
            teamName: 'Ferrari',
            laps: 19,
            status: 'Finished',
            timeOrGap: '30:00.000',
            points: 8,
          },
        ],
        sprintProvenance: 'official',
      };

      const input = {
        2024: [],
        2025: [],
        2026: [raceWithOfficialSprint],
      };

      const output = attachOpenF1SprintResults(input);
      const r2 = output[2026].find((r) => r.round === 2);

      // Official sprintEntries must NOT be overwritten by OpenF1 snapshot
      expect(r2?.sprintProvenance).toBe('official');
      expect(r2?.sprintEntries?.[0].driverId).toBe('hamilton');
    });
  });
});
