import { describe, expect, it } from 'vitest';
import { DRIVER_STANDINGS_2026, CONSTRUCTOR_STANDINGS_2026 } from '../data/championship/standings';
import {
  attachOpenF1SprintResults,
  sprintPointsForPosition,
  OpenF1SprintSource,
} from '../data/championship/openF1SprintBridge';
import { DetailedRaceResult, DetailedRaceResultEntry } from '../types';
import { recalculateStandingsFromRaces } from './standingsEngine';

const emptySource: OpenF1SprintSource = { getFinishedSprintEntries: () => null };

function totals(results: DetailedRaceResult[]) {
  return recalculateStandingsFromRaces(
    2026,
    results,
    DRIVER_STANDINGS_2026,
    CONSTRUCTOR_STANDINGS_2026,
  );
}

function driverPoints(res: ReturnType<typeof totals>, id: string) {
  return res.drivers.find((d) => d.driverId === id)?.points;
}

function teamPoints(res: ReturnType<typeof totals>, id: string) {
  return res.constructors.find((c) => c.teamId === id)?.points;
}

function baseDriverPoints(id: string) {
  return DRIVER_STANDINGS_2026.find((d) => d.driverId === id)!.points;
}

function baseTeamPoints(id: string) {
  return CONSTRUCTOR_STANDINGS_2026.find((c) => c.teamId === id)!.points;
}

describe('sprint standings: no sprint yet', () => {
  it('1. leaves standings untouched when no sprint session finished', () => {
    const attached = attachOpenF1SprintResults({ 2024: [], 2025: [], 2026: [] }, emptySource);
    expect(attached[2026]).toEqual([]);
    const res = totals(attached[2026]);
    expect(driverPoints(res, 'verstappen')).toBe(baseDriverPoints('verstappen'));
    expect(teamPoints(res, 'redbull')).toBe(baseTeamPoints('redbull'));
  });

  it('9. leaves non-sprint weekends untouched', () => {
    // Round 18 has no sprint sessions anywhere: nothing may be attached.
    const attached = attachOpenF1SprintResults({ 2024: [], 2025: [], 2026: [] });
    expect(attached[2026].some((r) => r.round === 18)).toBe(false);
  });
});

describe('sprint standings: sprint completed before main race', () => {
  it('2. reflects sprint points in both championships without waiting for the race', () => {
    const attached = attachOpenF1SprintResults({ 2024: [], 2025: [], 2026: [] });
    const r17 = attached[2026].find((r) => r.round === 17);
    expect(r17).toBeDefined();
    expect(r17!.status).toBe('scheduled');
    expect(r17!.entries).toEqual([]);
    expect((r17!.sprintEntries || []).length).toBeGreaterThan(0);

    const res = totals(attached[2026]);
    // Expected deltas derived from the attached entries, not hardcoded.
    const byDriver = new Map<string, number>();
    const byTeam = new Map<string, number>();
    for (const e of r17!.sprintEntries || []) {
      byDriver.set(e.driverId, (byDriver.get(e.driverId) || 0) + (e.points || 0));
      byTeam.set(e.teamId, (byTeam.get(e.teamId) || 0) + (e.points || 0));
    }
    for (const [id, delta] of byDriver) {
      expect(driverPoints(res, id)).toBe(baseDriverPoints(id) + delta);
    }
    for (const [id, delta] of byTeam) {
      expect(teamPoints(res, id)).toBe(baseTeamPoints(id) + delta);
    }
    // Sprint points are real: P1 got 8, the field shares exactly 36.
    const total = [...byDriver.values()].reduce((a, b) => a + b, 0);
    expect(total).toBe(36);
    expect(byDriver.get('verstappen')).toBe(8);
  });

  it('3. reads the sprint race, never sprint qualifying', () => {
    const attached = attachOpenF1SprintResults({ 2024: [], 2025: [], 2026: [] });
    const res = totals(attached[2026]);
    // Sprint-qualifying order (VER, RUS, ...) differs from the sprint race
    // (VER, HAM, ...): Hamilton must gain 7, Russell must gain nothing.
    expect(driverPoints(res, 'hamilton')).toBe(baseDriverPoints('hamilton') + 7);
    expect(driverPoints(res, 'russell')).toBe(baseDriverPoints('russell'));
  });

  it('4. refreshing twice never accumulates points', () => {
    const once = attachOpenF1SprintResults({ 2024: [], 2025: [], 2026: [] });
    const twice = attachOpenF1SprintResults({
      2024: [],
      2025: [],
      2026: once[2026],
    });
    const a = totals(once[2026]);
    const b = totals(twice[2026]);
    expect(JSON.stringify(b.drivers)).toBe(JSON.stringify(a.drivers));
    expect(JSON.stringify(b.constructors)).toBe(JSON.stringify(a.constructors));
  });

  it('8. credits constructors from their eligible drivers exactly once', () => {
    const attached = attachOpenF1SprintResults({ 2024: [], 2025: [], 2026: [] });
    const res = totals(attached[2026]);
    // Ferrari: HAM 7 + LEC 6 = 13; Red Bull: VER 8; Mercedes: ANT 5.
    expect(teamPoints(res, 'ferrari')).toBe(baseTeamPoints('ferrari') + 13);
    expect(teamPoints(res, 'redbull')).toBe(baseTeamPoints('redbull') + 8);
    expect(teamPoints(res, 'mercedes')).toBe(baseTeamPoints('mercedes') + 5);
  });
});

describe('sprint standings: official data priority', () => {
  function officialRound(): DetailedRaceResult {
    const entry = (over: Partial<DetailedRaceResultEntry>): DetailedRaceResultEntry => ({
      position: 1,
      driverId: 'verstappen',
      driverName: 'Max Verstappen',
      driverCode: 'VER',
      teamId: 'redbull',
      teamName: 'Red Bull',
      laps: 19,
      status: 'Finished',
      timeOrGap: '30:00.000',
      points: 8,
      ...over,
    });
    return {
      id: 'race-2026-r17-singapore',
      season: 2026,
      round: 17,
      grandPrix: 'Singapore Grand Prix',
      officialName: 'Singapore Grand Prix',
      circuit: 'Marina Bay',
      date: '10 Oct 2026',
      status: 'scheduled',
      lapsTotal: 62,
      entries: [],
      sprintEntries: [
        entry({}),
        entry({
          position: 2,
          driverId: 'hamilton',
          driverName: 'Lewis Hamilton',
          driverCode: 'HAM',
          teamId: 'ferrari',
          teamName: 'Ferrari',
          points: 7,
        }),
      ],
      dataSource: 'Jolpica F1 API',
    };
  }

  it('5. never adds provisional points on top of official sprint entries', () => {
    const attached = attachOpenF1SprintResults({ 2024: [], 2025: [], 2026: [officialRound()] });
    const r17 = attached[2026].find((r) => r.round === 17)!;
    // Official entries kept verbatim (2 entries), provisional ignored.
    expect(r17.sprintEntries).toHaveLength(2);
    expect(r17.dataSource).toBe('Jolpica F1 API');
    const res = totals(attached[2026]);
    expect(driverPoints(res, 'verstappen')).toBe(baseDriverPoints('verstappen') + 8);
    expect(driverPoints(res, 'hamilton')).toBe(baseDriverPoints('hamilton') + 7);
  });

  it('6. adds race points on top of sprint points after the main race', () => {
    const race: DetailedRaceResult = {
      ...officialRound(),
      status: 'completed',
      entries: [
        {
          position: 1,
          driverId: 'russell',
          driverName: 'George Russell',
          driverCode: 'RUS',
          teamId: 'mercedes',
          teamName: 'Mercedes',
          laps: 62,
          status: 'Finished',
          timeOrGap: '1:40:00.000',
          points: 25,
        },
      ],
    };
    const attached = attachOpenF1SprintResults({ 2024: [], 2025: [], 2026: [race] });
    const res = totals(attached[2026]);
    const russell = res.drivers.find((d) => d.driverId === 'russell')!;
    const mercedes = res.constructors.find((c) => c.teamId === 'mercedes')!;
    // Russell: 25 race + 0 sprint (absent from these sprint entries); win and podium from race only.
    expect(russell.points).toBe(baseDriverPoints('russell') + 25);
    expect(russell.wins).toBe(
      DRIVER_STANDINGS_2026.find((d) => d.driverId === 'russell')!.wins + 1,
    );
    expect(mercedes.points).toBe(baseTeamPoints('mercedes') + 25);
  });

  it('7. follows official corrections instead of keeping stale points', () => {
    const v1: OpenF1SprintSource = {
      getFinishedSprintEntries: (_season, round) =>
        round === 17
          ? [
              {
                position: 1,
                driverId: 'verstappen',
                driverName: 'Max Verstappen',
                driverCode: 'VER',
                teamId: 'redbull',
                teamName: 'Red Bull',
                laps: 19,
                status: 'Finished',
                timeOrGap: '',
                points: 8,
              },
            ]
          : null,
    };
    const v2: OpenF1SprintSource = {
      getFinishedSprintEntries: (_season, round) =>
        round === 17
          ? [
              {
                position: 1,
                driverId: 'hamilton',
                driverName: 'Lewis Hamilton',
                driverCode: 'HAM',
                teamId: 'ferrari',
                teamName: 'Ferrari',
                laps: 19,
                status: 'Finished',
                timeOrGap: '',
                points: 8,
              },
            ]
          : null,
    };
    const before = totals(attachOpenF1SprintResults({ 2024: [], 2025: [], 2026: [] }, v1)[2026]);
    expect(driverPoints(before, 'verstappen')).toBe(baseDriverPoints('verstappen') + 8);
    const after = totals(attachOpenF1SprintResults({ 2024: [], 2025: [], 2026: [] }, v2)[2026]);
    expect(driverPoints(after, 'verstappen')).toBe(baseDriverPoints('verstappen'));
    expect(driverPoints(after, 'hamilton')).toBe(baseDriverPoints('hamilton') + 8);
  });
});

describe('sprint standings: FIA countback for ties', () => {
  it('10. orders equal points and wins by P2 finishes, not by podium totals', () => {
    const base = [
      {
        rank: 1,
        driverId: 'aaa',
        driverName: 'Aaa',
        driverCode: 'AAA',
        teamId: 'mercedes',
        teamName: 'Mercedes',
        points: 100,
        wins: 1,
        podiums: 1,
        countryFlag: '',
      },
      {
        rank: 2,
        driverId: 'bbb',
        driverName: 'Bbb',
        driverCode: 'BBB',
        teamId: 'ferrari',
        teamName: 'Ferrari',
        points: 103,
        wins: 1,
        podiums: 5,
        countryFlag: '',
      },
    ] as typeof DRIVER_STANDINGS_2026;
    const teams = [
      {
        rank: 1,
        teamId: 'mercedes',
        teamName: 'Mercedes',
        points: 100,
        wins: 1,
        podiums: 1,
        engine: '',
      },
      {
        rank: 2,
        teamId: 'ferrari',
        teamName: 'Ferrari',
        points: 103,
        wins: 1,
        podiums: 5,
        engine: '',
      },
    ] as typeof CONSTRUCTOR_STANDINGS_2026;
    const mk = (
      driverId: string,
      teamId: 'mercedes' | 'ferrari',
      position: number,
      points: number,
    ): DetailedRaceResultEntry => ({
      position,
      driverId,
      driverName: driverId,
      driverCode: 'X',
      teamId,
      teamName: teamId,
      laps: 50,
      status: 'Finished',
      timeOrGap: '',
      points,
    });
    const races: DetailedRaceResult[] = [
      {
        id: 'r1',
        season: 2026,
        round: 17,
        grandPrix: 'GP',
        officialName: 'GP',
        circuit: 'C',
        date: '',
        status: 'completed',
        lapsTotal: 50,
        entries: [mk('aaa', 'mercedes', 2, 18), mk('bbb', 'ferrari', 3, 15)],
      },
    ];
    const res = recalculateStandingsFromRaces(2026, races, base, teams);
    // Both 118 pts / 1 win; aaa owns a P2, bbb's best is P3 — aaa leads even
    // though bbb holds more total podiums (6 vs 2). Old points→podiums logic
    // would have ranked bbb first.
    expect(res.drivers[0].driverId).toBe('aaa');
    expect(res.drivers[1].driverId).toBe('bbb');
  });
});

describe('sprint points table', () => {
  it('awards 8..1 for P1..P8 and 0 beyond, preferring official values', () => {
    expect([1, 2, 3, 4, 5, 6, 7, 8].map((p) => sprintPointsForPosition(p))).toEqual([
      8, 7, 6, 5, 4, 3, 2, 1,
    ]);
    expect(sprintPointsForPosition(9)).toBe(0);
    expect(sprintPointsForPosition(22)).toBe(0);
    expect(sprintPointsForPosition(1, 8)).toBe(8);
  });
});
