import { describe, it, expect } from 'vitest';
import {
  compareCountback,
  zerosHistogram,
  buildCountbackHistograms,
  countbackComparator,
  isValidClassifiedFinish,
} from '../domain/countbackComparator';
import { recalculateStandingsFromRaces } from '../domain/standingsCalculator';
import { DetailedRaceResult, DriverStanding, ConstructorStanding, TeamId } from '../../../types';
import {
  DriverStandingEntity,
  ConstructorStandingEntity,
} from '../domain/contracts/domainContracts';

/**
 * FIA COUNTBACK CORRECTNESS TEST SUITE (MILESTONE A4.3b.1)
 *
 * Authoritative Regulatory Reference:
 * - 2026 FIA Formula One General Regulatory Provisions, Section A, Issue 03, Article A2.1.4(c).
 * - 2024/2025 FIA Formula One Sporting Regulations, Article 7.2.
 *
 * Verifies all 9 mandatory countback scenarios:
 * 1. Equal points, different wins (P1 count).
 * 2. Equal wins, different P2/P3.
 * 3. Equal P1–P10, different P11+ (full grid depth countback).
 * 4. Fully equal Race countback (ties across all finishes).
 * 5. Available and missing Qualifying results (Article A2.1.4(c)(iv)).
 * 6. Sprint results excluded from Race countback.
 * 7. Both WDC (Drivers) and WCC (Constructors).
 * 8. Incomplete classifications (DNS, DSQ, missing positions).
 * 9. Stable ordering with incomplete data.
 */

describe('FIA Countback Correctness — Article A2.1.4(c)', () => {
  // Test helper for base mock driver standings
  const createMockDriver = (
    driverId: string,
    points: number,
    wins: number = 0,
    podiums: number = 0,
    rank: number = 1,
  ): DriverStanding => ({
    rank,
    driverId,
    driverName: `Driver ${driverId.toUpperCase()}`,
    driverCode: driverId.substring(0, 3).toUpperCase(),
    teamId: 'ferrari',
    teamName: 'Ferrari',
    points,
    wins,
    podiums,
    countryFlag: '🏁',
  });

  // Test helper for base mock constructor standings
  const createMockConstructor = (
    teamId: any,
    points: number,
    wins: number = 0,
    podiums: number = 0,
    rank: number = 1,
  ): ConstructorStanding => ({
    rank,
    teamId,
    teamName: `Team ${teamId}`,
    points,
    wins,
    podiums,
    engine: 'Hybrid V6',
  });

  // ── Scenario 1: Equal points, different wins ──
  it('Scenario 1: breaks ties using wins (P1 count) when points are equal', () => {
    const driverA = createMockDriver('driver_a', 25, 0, 1, 1);
    const driverB = createMockDriver('driver_b', 25, 1, 1, 2);

    const cmp = compareCountback(driverA, driverB);
    // Driver B has 1 win vs Driver A's 0 wins -> driverB must rank higher (cmp > 0 means a sorts after b)
    expect(cmp).toBeGreaterThan(0);

    const standings = recalculateStandingsFromRaces(2026, [], [driverA, driverB], []);
    expect(standings.drivers[0].driverId).toBe('driver_b');
    expect(standings.drivers[1].driverId).toBe('driver_a');
  });

  // ── Scenario 2: Equal wins, different P2/P3 ──
  it('Scenario 2: breaks ties using P2 counts when points and wins are equal', () => {
    const histA = zerosHistogram();
    histA[2] = 2; // Driver A: 2x P2, 0x P3
    histA[3] = 0;

    const histB = zerosHistogram();
    histB[2] = 1; // Driver B: 1x P2, 3x P3
    histB[3] = 3;

    const driverA = createMockDriver('driver_a', 50, 1, 3);
    const driverB = createMockDriver('driver_b', 50, 1, 4);

    // Driver A has more P2s (2 vs 1) -> driverA ranks ahead of driverB despite driverB having more podiums!
    const cmp = compareCountback(driverA, driverB, histA, histB);
    expect(cmp).toBeLessThan(0); // a comes before b
  });

  // ── Scenario 3: Equal P1-P10, different P11+ (Non-truncation beyond P10) ──
  it('Scenario 3: breaks ties using P11-P22 finishes when positions P1 to P10 are identical', () => {
    // Both drivers have 0 points, 0 wins, 0 podiums, and 0 finishes from P1..P10.
    // Driver A has 1x P11. Driver B has 0x P11 and 1x P12.
    const histA = zerosHistogram(24);
    histA[11] = 1;

    const histB = zerosHistogram(24);
    histB[12] = 1;

    const driverA = createMockDriver('driver_a', 0, 0, 0);
    const driverB = createMockDriver('driver_b', 0, 0, 0);

    const cmp = compareCountback(driverA, driverB, histA, histB);
    // Driver A has 1x P11 vs Driver B's 0x P11 -> Driver A must rank higher!
    expect(cmp).toBeLessThan(0);

    // Test reverse comparison: driverB vs driverA
    const cmpRev = compareCountback(driverB, driverA, histB, histA);
    expect(cmpRev).toBeGreaterThan(0);
  });

  it('Scenario 3b: evaluates deep grid positions up to P22 in dynamic recalculation', () => {
    // Race with P21 and P22 finishes for drivers tied on 0 points
    const raceR18: DetailedRaceResult = {
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
          position: 21,
          driverId: 'cadillac_driver_1',
          driverName: 'Cadillac Driver 1',
          driverCode: 'CD1',
          teamId: 'cadillac',
          teamName: 'Cadillac F1 Team',
          laps: 47,
          status: 'Finished',
          timeOrGap: '+3 Laps',
          points: 0,
        },
        {
          position: 22,
          driverId: 'cadillac_driver_2',
          driverName: 'Cadillac Driver 2',
          driverCode: 'CD2',
          teamId: 'cadillac',
          teamName: 'Cadillac F1 Team',
          laps: 46,
          status: 'Finished',
          timeOrGap: '+4 Laps',
          points: 0,
        },
      ],
    };

    // Driver 2 is listed first in baseline array; driver 1 is listed second
    const tiedDrivers: DriverStanding[] = [
      createMockDriver('cadillac_driver_2', 0, 0, 0, 22),
      createMockDriver('cadillac_driver_1', 0, 0, 0, 21),
    ];

    const result = recalculateStandingsFromRaces(2026, [raceR18], tiedDrivers, []);

    // Driver 1 got P21, Driver 2 got P22 -> Driver 1 must rank higher!
    expect(result.drivers[0].driverId).toBe('cadillac_driver_1');
    expect(result.drivers[0].rank).toBe(1);
    expect(result.drivers[1].driverId).toBe('cadillac_driver_2');
    expect(result.drivers[1].rank).toBe(2);
  });

  // ── Scenario 4: Fully equal Race countback ──
  it('Scenario 4: preserves baseline rank or falls back to stable deterministic order when race countback is fully tied', () => {
    // Both drivers have 1x P12 and identical race countback across all positions
    const histA = zerosHistogram(24);
    histA[12] = 1;

    const histB = zerosHistogram(24);
    histB[12] = 1;

    // With baseline ranks: driverA (rank 5) vs driverB (rank 6)
    const driverA = createMockDriver('driver_a', 0, 0, 0, 5);
    const driverB = createMockDriver('driver_b', 0, 0, 0, 6);

    const cmpRanked = compareCountback(driverA, driverB, histA, histB);
    expect(cmpRanked).toBeLessThan(0); // driverA retains rank 5 over driverB rank 6

    // Without baseline ranks: deterministic alphabetical tie-break
    const unrankedA = { points: 0, wins: 0, driverId: 'driver_b' };
    const unrankedB = { points: 0, wins: 0, driverId: 'driver_a' };
    const cmpUnranked = compareCountback(unrankedA, unrankedB, histA, histB);
    expect(cmpUnranked).toBeGreaterThan(0); // driver_a alphabetically precedes driver_b
  });

  // ── Scenario 5: Available and missing Qualifying results (Article A2.1.4(c)(iv)) ──
  it('Scenario 5a: breaks race dead heats using qualifying countback when qualifying data is available', () => {
    // Race finishes identical for both drivers: 1x P4, 1x P6
    const raceHistA = zerosHistogram(24);
    raceHistA[4] = 1;
    raceHistA[6] = 1;

    const raceHistB = zerosHistogram(24);
    raceHistB[4] = 1;
    raceHistB[6] = 1;

    // Qualifying data: Driver A has 1x Pole (Q1), Driver B has 1x Q2
    const qualiHistA = zerosHistogram(24);
    qualiHistA[1] = 1;

    const qualiHistB = zerosHistogram(24);
    qualiHistB[2] = 1;

    const driverA = createMockDriver('driver_a', 20, 0, 0);
    const driverB = createMockDriver('driver_b', 20, 0, 0);

    const cmp = compareCountback(driverA, driverB, raceHistA, raceHistB, qualiHistA, qualiHistB);
    // Driver A wins countback via 1x Qualifying Pole position
    expect(cmp).toBeLessThan(0);
  });

  it('Scenario 5b: gracefully falls back to deterministic display order when qualifying results are missing', () => {
    const raceHistA = zerosHistogram(24);
    raceHistA[14] = 1;

    const raceHistB = zerosHistogram(24);
    raceHistB[14] = 1;

    const driverA = createMockDriver('driver_a', 0, 0, 0, 10);
    const driverB = createMockDriver('driver_b', 0, 0, 0, 11);

    // No qualifying histograms supplied (missing data)
    const cmp = compareCountback(driverA, driverB, raceHistA, raceHistB, undefined, undefined);
    // Preserves official baseline rank without throwing or fabricating FIA rank
    expect(cmp).toBeLessThan(0);
  });

  // ── Scenario 6: Sprint results excluded from Race countback ──
  it('Scenario 6: strictly excludes Sprint finishes from Grand Prix race countback', () => {
    // Both drivers finish the round with 8 points:
    // Driver A: Won the Sprint (P1 Sprint = 8 pts), finished P15 in Grand Prix Race (0 pts).
    // Driver B: Finished P6 in Grand Prix Race (8 pts), did not score in Sprint.
    const raceWithSprint: DetailedRaceResult = {
      id: 'race-2026-r19',
      season: 2026,
      round: 19,
      grandPrix: 'Sprint GP',
      officialName: 'Sprint GP',
      circuit: 'Circuit Sprint',
      date: '2026-10-15',
      status: 'completed',
      lapsTotal: 50,
      entries: [
        {
          position: 6,
          driverId: 'driver_b',
          driverName: 'Driver B',
          driverCode: 'DRB',
          teamId: 'mclaren',
          teamName: 'McLaren',
          laps: 50,
          status: 'Finished',
          timeOrGap: '+15s',
          points: 8,
        },
        {
          position: 15,
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
      ],
      sprintEntries: [
        {
          position: 1, // Driver A won sprint
          driverId: 'driver_a',
          driverName: 'Driver A',
          driverCode: 'DRA',
          teamId: 'ferrari',
          teamName: 'Ferrari',
          laps: 19,
          status: 'Finished',
          timeOrGap: 'Winner',
          points: 8,
        },
      ],
    };

    const zeroDrivers: DriverStanding[] = [
      createMockDriver('driver_a', 0, 0, 0, 1),
      createMockDriver('driver_b', 0, 0, 0, 2),
    ];

    const result = recalculateStandingsFromRaces(2026, [raceWithSprint], zeroDrivers, []);

    // Both drivers have 8 points total.
    expect(result.drivers.find((d) => d.driverId === 'driver_a')?.points).toBe(8);
    expect(result.drivers.find((d) => d.driverId === 'driver_b')?.points).toBe(8);

    // Race countback: Driver B has 1x Race P6. Driver A has 0x Race P6 (only Race P15).
    // Driver A's Sprint P1 must NEVER count as a Grand Prix P1 or race finish!
    // Therefore, Driver B must be ranked #1 and Driver A ranked #2!
    expect(result.drivers[0].driverId).toBe('driver_b');
    expect(result.drivers[0].rank).toBe(1);
    expect(result.drivers[1].driverId).toBe('driver_a');
    expect(result.drivers[1].rank).toBe(2);
  });

  // ── Scenario 7: Both WDC (Driver) and WCC (Constructor) ──
  it('Scenario 7: evaluates countback consistently across both Drivers (WDC) and Constructors (WCC)', () => {
    const driverEntityA: DriverStandingEntity = {
      rank: 1,
      driverId: 'driver_a',
      driverName: 'Driver A',
      driverCode: 'DRA',
      teamId: 'ferrari',
      teamName: 'Ferrari',
      points: 10,
      wins: 0,
      podiums: 0,
      countryFlag: '🏁',
    };
    const driverEntityB: DriverStandingEntity = {
      rank: 2,
      driverId: 'driver_b',
      driverName: 'Driver B',
      driverCode: 'DRB',
      teamId: 'mclaren',
      teamName: 'McLaren',
      points: 10,
      wins: 0,
      podiums: 0,
      countryFlag: '🏁',
    };

    const dHistA = zerosHistogram(24);
    dHistA[5] = 1; // P5 finish
    const dHistB = zerosHistogram(24);
    dHistB[6] = 1; // P6 finish

    const driverMap = new Map<string, readonly number[]>([
      ['driver_a', dHistA],
      ['driver_b', dHistB],
    ]);

    const dCmp = countbackComparator.compareDrivers(driverEntityA, driverEntityB, driverMap);
    expect(dCmp).toBeLessThan(0); // driver_a ahead

    // Test Constructors WCC
    const teamEntityA: ConstructorStandingEntity = createMockConstructor('ferrari', 10, 0, 0, 1);
    const teamEntityB: ConstructorStandingEntity = createMockConstructor('mclaren', 10, 0, 0, 2);

    const teamMap = new Map<TeamId, readonly number[]>([
      ['ferrari', dHistA],
      ['mclaren', dHistB],
    ]);

    const tCmp = countbackComparator.compareConstructors(teamEntityA, teamEntityB, teamMap);
    expect(tCmp).toBeLessThan(0); // ferrari ahead
  });

  // ── Scenario 8: Incomplete classifications (DNS, DSQ, unclassified) ──
  it('Scenario 8: excludes DNS and DSQ from valid race finishing countback', () => {
    expect(isValidClassifiedFinish(1, 'Finished')).toBe(true);
    expect(isValidClassifiedFinish(15, '+1 Lap')).toBe(true);
    expect(isValidClassifiedFinish(18, 'DNF (Collision)')).toBe(true);
    expect(isValidClassifiedFinish(20, 'DNS (Engine)')).toBe(false);
    expect(isValidClassifiedFinish(20, 'Did not start')).toBe(false);
    expect(isValidClassifiedFinish(2, 'DSQ (Plank wear)')).toBe(false);
    expect(isValidClassifiedFinish(2, 'Disqualified')).toBe(false);
    expect(isValidClassifiedFinish(0, 'Finished')).toBe(false);
    expect(isValidClassifiedFinish(-1, 'Finished')).toBe(false);
    expect(isValidClassifiedFinish(NaN, 'Finished')).toBe(false);

    // Build histograms with DSQ and DNS entries
    const raceWithDsqDns: DetailedRaceResult = {
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
          position: 2, // Crossed line P2 but disqualified
          driverId: 'driver_dsq',
          driverName: 'Driver DSQ',
          driverCode: 'DSQ',
          teamId: 'ferrari',
          teamName: 'Ferrari',
          laps: 50,
          status: 'DSQ (Fuel sample)',
          timeOrGap: 'DSQ',
          points: 0,
        },
        {
          position: 20, // DNS
          driverId: 'driver_dns',
          driverName: 'Driver DNS',
          driverCode: 'DNS',
          teamId: 'mclaren',
          teamName: 'McLaren',
          laps: 0,
          status: 'DNS',
          timeOrGap: 'DNS',
          points: 0,
        },
        {
          position: 12, // Valid classified finish
          driverId: 'driver_clean',
          driverName: 'Driver Clean',
          driverCode: 'CLN',
          teamId: 'williams',
          teamName: 'Williams',
          laps: 49,
          status: 'Finished',
          timeOrGap: '+1 Lap',
          points: 0,
        },
      ],
    };

    const { driverHistograms } = buildCountbackHistograms([raceWithDsqDns]);
    const dsqHist = driverHistograms.get('driver_dsq');
    const dnsHist = driverHistograms.get('driver_dns');
    const cleanHist = driverHistograms.get('driver_clean');

    // DSQ and DNS should not have tallied finishing positions
    expect(dsqHist).toBeUndefined();
    expect(dnsHist).toBeUndefined();
    expect(cleanHist).toBeDefined();
    expect(cleanHist![12]).toBe(1);
  });

  // ── Scenario 9: Stable ordering with incomplete data ──
  it('Scenario 9: guarantees invariant stable ordering when data is incomplete or empty', () => {
    const drivers: DriverStanding[] = [
      createMockDriver('driver_c', 0, 0, 0, 3),
      createMockDriver('driver_a', 0, 0, 0, 1),
      createMockDriver('driver_b', 0, 0, 0, 2),
    ];

    const run1 = recalculateStandingsFromRaces(2026, [], drivers, []);
    const run2 = recalculateStandingsFromRaces(2026, [], drivers, []);

    // Both runs must produce the exact same order preserved by baseline rank
    expect(run1.drivers.map((d) => d.driverId)).toEqual(['driver_a', 'driver_b', 'driver_c']);
    expect(run2.drivers.map((d) => d.driverId)).toEqual(['driver_a', 'driver_b', 'driver_c']);
    expect(run1.drivers.map((d) => d.rank)).toEqual([1, 2, 3]);
  });
});
