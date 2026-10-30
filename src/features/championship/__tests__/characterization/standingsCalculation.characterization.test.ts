import { describe, it, expect } from 'vitest';
import { recalculateStandingsFromRaces } from '../../../../services/standingsEngine';
import { fastestLapBonusPoints } from '../../../../data/championship/raceClassificationHelper';
import { sprintPointsForPosition } from '../../../../data/championship/openF1SprintBridge';
import {
  DRIVER_STANDINGS_2026,
  CONSTRUCTOR_STANDINGS_2026,
} from '../../../../data/championship/standings';
import { DetailedRaceResult } from '../../../../types';

describe('Characterization Baseline — Standings Calculation & Scoring', () => {
  it('correctly calculates WDC and WCC points for post-cutoff Grand Prix finishes', () => {
    const mockRace: DetailedRaceResult = {
      id: 'race-2026-r18-test',
      season: 2026,
      round: 18,
      grandPrix: 'Test Grand Prix',
      officialName: 'Test Grand Prix 2026',
      circuit: 'Test Circuit',
      date: '2026-10-18',
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
          timeOrGap: '1:25:00.000',
          points: 25,
        },
        {
          position: 2,
          driverId: 'piastri',
          driverName: 'Oscar Piastri',
          driverCode: 'PIA',
          teamId: 'mclaren',
          teamName: 'McLaren',
          laps: 50,
          status: 'Finished',
          timeOrGap: '+2.500s',
          points: 18,
        },
      ],
    };

    const initialNorris = DRIVER_STANDINGS_2026.find((d) => d.driverId === 'norris')!;
    const initialPiastri = DRIVER_STANDINGS_2026.find((d) => d.driverId === 'piastri')!;
    const initialMcLaren = CONSTRUCTOR_STANDINGS_2026.find((c) => c.teamId === 'mclaren')!;

    const result = recalculateStandingsFromRaces(
      2026,
      [mockRace],
      DRIVER_STANDINGS_2026,
      CONSTRUCTOR_STANDINGS_2026,
    );

    const updatedNorris = result.drivers.find((d) => d.driverId === 'norris')!;
    const updatedPiastri = result.drivers.find((d) => d.driverId === 'piastri')!;
    const updatedMcLaren = result.constructors.find((c) => c.teamId === 'mclaren')!;

    // Driver points
    expect(updatedNorris.points).toBe(initialNorris.points + 25);
    expect(updatedNorris.wins).toBe(initialNorris.wins + 1);
    expect(updatedNorris.podiums).toBe(initialNorris.podiums + 1);

    expect(updatedPiastri.points).toBe(initialPiastri.points + 18);
    expect(updatedPiastri.wins).toBe(initialPiastri.wins);
    expect(updatedPiastri.podiums).toBe(initialPiastri.podiums + 1);

    // Constructor points (McLaren 1-2 finish: +25 + 18 = +43)
    expect(updatedMcLaren.points).toBe(initialMcLaren.points + 43);
    expect(updatedMcLaren.wins).toBe(initialMcLaren.wins + 1);
    expect(updatedMcLaren.podiums).toBe(initialMcLaren.podiums + 2);
  });

  describe('Sprint Points Accounting', () => {
    it('awards points according to the FIA sprint table (P1-P8: 8..1, P9+: 0)', () => {
      expect(sprintPointsForPosition(1)).toBe(8);
      expect(sprintPointsForPosition(2)).toBe(7);
      expect(sprintPointsForPosition(3)).toBe(6);
      expect(sprintPointsForPosition(4)).toBe(5);
      expect(sprintPointsForPosition(5)).toBe(4);
      expect(sprintPointsForPosition(6)).toBe(3);
      expect(sprintPointsForPosition(7)).toBe(2);
      expect(sprintPointsForPosition(8)).toBe(1);
      expect(sprintPointsForPosition(9)).toBe(0);
      expect(sprintPointsForPosition(20)).toBe(0);
    });

    it('counts sprint points exactly once when explicit sprintEntries are present', () => {
      const mockSprintRace: DetailedRaceResult = {
        id: 'race-2026-r18-sprint',
        season: 2026,
        round: 18,
        grandPrix: 'Sprint Weekend GP',
        officialName: 'Sprint Weekend GP 2026',
        circuit: 'Sprint Circuit',
        date: '2026-10-18',
        status: 'completed',
        lapsTotal: 50,
        entries: [
          {
            position: 1,
            driverId: 'russell',
            driverName: 'George Russell',
            driverCode: 'RUS',
            teamId: 'mercedes',
            teamName: 'Mercedes',
            laps: 50,
            status: 'Finished',
            timeOrGap: '1:30:00.000',
            points: 25,
            sprintPoints: 8, // Legacy duplicate field
          },
        ],
        sprintEntries: [
          {
            position: 1,
            driverId: 'russell',
            driverName: 'George Russell',
            driverCode: 'RUS',
            teamId: 'mercedes',
            teamName: 'Mercedes',
            laps: 24,
            status: 'Finished',
            timeOrGap: '30:00.000',
            points: 8,
          },
        ],
      };

      const initialRussell = DRIVER_STANDINGS_2026.find((d) => d.driverId === 'russell')!;
      const result = recalculateStandingsFromRaces(
        2026,
        [mockSprintRace],
        DRIVER_STANDINGS_2026,
        CONSTRUCTOR_STANDINGS_2026,
      );

      const updatedRussell = result.drivers.find((d) => d.driverId === 'russell')!;
      // Expected: baseline + 25 (race) + 8 (sprint once) = baseline + 33 (NOT 25 + 8 + 8)
      expect(updatedRussell.points).toBe(initialRussell.points + 33);
    });
  });

  describe('Fastest Lap Bonus Points by Season', () => {
    it('awards 1 bonus point for fastest lap in 2024 ONLY if finished in Top 10', () => {
      expect(fastestLapBonusPoints(2024, 1, true)).toBe(1);
      expect(fastestLapBonusPoints(2024, 10, true)).toBe(1);
      expect(fastestLapBonusPoints(2024, 11, true)).toBe(0); // Outside top 10
      expect(fastestLapBonusPoints(2024, 1, false)).toBe(0); // No fastest lap
    });

    it('awards 0 bonus points for fastest lap in 2025 and 2026 regardless of position', () => {
      // FIA World Motor Sport Council abolished the fastest lap bonus point from 2025
      expect(fastestLapBonusPoints(2025, 1, true)).toBe(0);
      expect(fastestLapBonusPoints(2025, 5, true)).toBe(0);
      expect(fastestLapBonusPoints(2026, 1, true)).toBe(0);
      expect(fastestLapBonusPoints(2026, 3, true)).toBe(0);
    });
  });
});
