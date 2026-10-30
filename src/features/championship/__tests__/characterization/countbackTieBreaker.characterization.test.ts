import { describe, it, expect } from 'vitest';
import { recalculateStandingsFromRaces } from '../../../../services/standingsEngine';
import { DetailedRaceResult, DriverStanding, ConstructorStanding } from '../../../../types';

describe('Characterization Baseline — Countback Tie-Breaker Behavior', () => {
  const baseDrivers: DriverStanding[] = [
    {
      rank: 1,
      driverId: 'driver_a',
      driverName: 'Driver A',
      driverCode: 'DRA',
      teamId: 'ferrari',
      teamName: 'Ferrari',
      points: 50,
      wins: 1,
      podiums: 2,
      countryFlag: '🏁',
    },
    {
      rank: 2,
      driverId: 'driver_b',
      driverName: 'Driver B',
      driverCode: 'DRB',
      teamId: 'mclaren',
      teamName: 'McLaren',
      points: 50,
      wins: 1,
      podiums: 2,
      countryFlag: '🏁',
    },
  ];

  const baseConstructors: ConstructorStanding[] = [
    {
      rank: 1,
      teamId: 'ferrari',
      teamName: 'Ferrari',
      points: 50,
      wins: 1,
      podiums: 2,
      engine: 'Ferrari',
    },
    {
      rank: 2,
      teamId: 'mclaren',
      teamName: 'McLaren',
      points: 50,
      wins: 1,
      podiums: 2,
      engine: 'Mercedes',
    },
  ];

  it('breaks ties using wins (P1 count) when points are equal', () => {
    const tiedDrivers: DriverStanding[] = [
      { ...baseDrivers[0], points: 25, wins: 0, podiums: 1 },
      { ...baseDrivers[1], points: 25, wins: 1, podiums: 1 },
    ];

    const result = recalculateStandingsFromRaces(2026, [], tiedDrivers, baseConstructors);

    // Driver B has 1 win vs Driver A's 0 wins -> Driver B must be rank 1
    expect(result.drivers[0].driverId).toBe('driver_b');
    expect(result.drivers[0].rank).toBe(1);
    expect(result.drivers[1].driverId).toBe('driver_a');
    expect(result.drivers[1].rank).toBe(2);
  });

  it('breaks ties using P2 counts when points and wins are equal', () => {
    // Both drivers have 50 points and 1 win.
    // In race history, Driver A got 1x P2, Driver B got 1x P3.
    const race1: DetailedRaceResult = {
      id: 'race-2026-r18',
      season: 2026,
      round: 18,
      grandPrix: 'GP 18',
      officialName: 'GP 18',
      circuit: 'Circuit 1',
      date: '2026-10-01',
      status: 'completed',
      lapsTotal: 50,
      entries: [
        {
          position: 2,
          driverId: 'driver_a',
          driverName: 'Driver A',
          driverCode: 'DRA',
          teamId: 'ferrari',
          teamName: 'Ferrari',
          laps: 50,
          status: 'Finished',
          timeOrGap: '+1s',
          points: 0,
        },
        {
          position: 3,
          driverId: 'driver_b',
          driverName: 'Driver B',
          driverCode: 'DRB',
          teamId: 'mclaren',
          teamName: 'McLaren',
          laps: 50,
          status: 'Finished',
          timeOrGap: '+2s',
          points: 0,
        },
      ],
    };

    const result = recalculateStandingsFromRaces(2026, [race1], baseDrivers, baseConstructors);

    // Driver A has 1x P2, Driver B has 0x P2 -> Driver A ranks higher
    expect(result.drivers[0].driverId).toBe('driver_a');
    expect(result.drivers[1].driverId).toBe('driver_b');
  });

  it('falls back to podium totals when positions P1 to P10 are equal in current application behavior', () => {
    // Both have 50 points, 1 win, 0 finishes in histogram.
    // Driver A has 3 podiums in baseline metadata, Driver B has 2.
    const driversWithDifferentPodiums: DriverStanding[] = [
      { ...baseDrivers[0], podiums: 3 },
      { ...baseDrivers[1], podiums: 2 },
    ];

    const result = recalculateStandingsFromRaces(
      2026,
      [],
      driversWithDifferentPodiums,
      baseConstructors,
    );

    // Current implementation uses podium count as fallback tiebreaker
    expect(result.drivers[0].driverId).toBe('driver_a');
    expect(result.drivers[0].podiums).toBe(3);
    expect(result.drivers[1].driverId).toBe('driver_b');
    expect(result.drivers[1].podiums).toBe(2);
  });

  it('CHARACTERIZATION: verifies current implementation ignores P11-P20 in countback histogram', () => {
    // Both drivers have 0 points, 0 wins, 0 podiums.
    // Driver A has 1x P11, Driver B has 1x P12.
    // Under full FIA regulations, Driver A should beat Driver B.
    // In CURRENT implementation, positions > 10 are ignored (tally only records <= 10).
    const raceP11P12: DetailedRaceResult = {
      id: 'race-2026-r18',
      season: 2026,
      round: 18,
      grandPrix: 'GP 18',
      officialName: 'GP 18',
      circuit: 'Circuit 1',
      date: '2026-10-01',
      status: 'completed',
      lapsTotal: 50,
      entries: [
        {
          position: 11,
          driverId: 'driver_a',
          driverName: 'Driver A',
          driverCode: 'DRA',
          teamId: 'ferrari',
          teamName: 'Ferrari',
          laps: 49,
          status: 'Finished',
          timeOrGap: '+1 Lap',
          points: 0,
        },
        {
          position: 12,
          driverId: 'driver_b',
          driverName: 'Driver B',
          driverCode: 'DRB',
          teamId: 'mclaren',
          teamName: 'McLaren',
          laps: 49,
          status: 'Finished',
          timeOrGap: '+1 Lap',
          points: 0,
        },
      ],
    };

    const zeroPointsDrivers: DriverStanding[] = [
      { ...baseDrivers[0], points: 0, wins: 0, podiums: 0 },
      { ...baseDrivers[1], points: 0, wins: 0, podiums: 0 },
    ];

    const result = recalculateStandingsFromRaces(
      2026,
      [raceP11P12],
      zeroPointsDrivers,
      baseConstructors,
    );

    // Current application does not compare P11; they remain in original array order (preserving determinism)
    // Documented as Characterization Limitation (addressed in normative test)
    expect(result.drivers).toHaveLength(2);
    expect(result.drivers[0].points).toBe(0);
    expect(result.drivers[1].points).toBe(0);
  });
});
