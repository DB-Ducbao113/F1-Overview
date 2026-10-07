import { describe, it, expect } from 'vitest';
import { DRIVER_STANDINGS_2026, CONSTRUCTOR_STANDINGS_2026 } from '../data/championship/standings';
import { recalculateStandingsFromRaces } from './standingsEngine';
import { DetailedRaceResult } from '../types';

describe('2026 Standings and Podiums Integrity', () => {
  it('should have positive podium counts for top drivers in 2026', () => {
    const antonelli = DRIVER_STANDINGS_2026.find((d) => d.driverId === 'antonelli');
    const russell = DRIVER_STANDINGS_2026.find((d) => d.driverId === 'russell');
    const hamilton = DRIVER_STANDINGS_2026.find((d) => d.driverId === 'hamilton');

    expect(antonelli).toBeDefined();
    expect(antonelli!.podiums).toBeGreaterThan(0);
    expect(antonelli!.podiums).toBe(13);

    expect(russell).toBeDefined();
    expect(russell!.podiums).toBeGreaterThan(0);
    expect(russell!.podiums).toBe(8);

    expect(hamilton).toBeDefined();
    expect(hamilton!.podiums).toBeGreaterThan(0);
    expect(hamilton!.podiums).toBe(6);
  });

  it('should have positive podium counts for top constructors in 2026', () => {
    const mercedes = CONSTRUCTOR_STANDINGS_2026.find((c) => c.teamId === 'mercedes');
    const ferrari = CONSTRUCTOR_STANDINGS_2026.find((c) => c.teamId === 'ferrari');
    const mclaren = CONSTRUCTOR_STANDINGS_2026.find((c) => c.teamId === 'mclaren');

    expect(mercedes).toBeDefined();
    expect(mercedes!.podiums).toBeGreaterThan(0);
    expect(mercedes!.podiums).toBe(21);

    expect(ferrari).toBeDefined();
    expect(ferrari!.podiums).toBeGreaterThan(0);
    expect(ferrari!.podiums).toBe(10);

    expect(mclaren).toBeDefined();
    expect(mclaren!.podiums).toBeGreaterThan(0);
    expect(mclaren!.podiums).toBe(7);
  });

  it('recalculateStandingsFromRaces should increment podiums for additional races', () => {
    const sampleRound17Race: DetailedRaceResult = {
      id: 'race-2026-r17-singapore',
      season: 2026,
      round: 17,
      grandPrix: 'Singapore Grand Prix',
      officialName: 'Singapore Grand Prix 2026',
      circuit: 'Marina Bay',
      date: '11 Oct 2026',
      status: 'completed',
      lapsTotal: 62,
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
        {
          position: 2,
          driverId: 'norris',
          driverName: 'Lando Norris',
          driverCode: 'NOR',
          teamId: 'mclaren',
          teamName: 'McLaren',
          laps: 62,
          status: 'Finished',
          timeOrGap: '+2.123s',
          points: 18,
        },
        {
          position: 3,
          driverId: 'antonelli',
          driverName: 'Andrea Kimi Antonelli',
          driverCode: 'ANT',
          teamId: 'mercedes',
          teamName: 'Mercedes',
          laps: 62,
          status: 'Finished',
          timeOrGap: '+4.567s',
          points: 15,
        },
      ],
    };

    const res = recalculateStandingsFromRaces(
      2026,
      [sampleRound17Race],
      DRIVER_STANDINGS_2026,
      CONSTRUCTOR_STANDINGS_2026,
    );

    const russell = res.drivers.find((d) => d.driverId === 'russell');
    const antonelli = res.drivers.find((d) => d.driverId === 'antonelli');
    const mercedes = res.constructors.find((c) => c.teamId === 'mercedes');

    // Russell got P1 (podium +1) -> 8 + 1 = 9
    expect(russell!.podiums).toBe(9);
    // Antonelli got P3 (podium +1) -> 13 + 1 = 14
    expect(antonelli!.podiums).toBe(14);
    // Mercedes got P1 & P3 (podiums +2) -> 21 + 2 = 23
    expect(mercedes!.podiums).toBe(23);
  });

  it('recalculateStandingsFromRaces should defensively recover podiums if base has 0 podiums', () => {
    const zeroPodiumDrivers = DRIVER_STANDINGS_2026.map((d) => ({ ...d, podiums: 0 }));
    const zeroPodiumConstructors = CONSTRUCTOR_STANDINGS_2026.map((c) => ({ ...c, podiums: 0 }));

    const mockRace: DetailedRaceResult = {
      id: 'race-2026-r1',
      season: 2026,
      round: 1,
      grandPrix: 'Australian Grand Prix',
      officialName: 'Australian Grand Prix 2026',
      circuit: 'Albert Park',
      date: '08 Mar 2026',
      status: 'completed',
      lapsTotal: 58,
      entries: [
        {
          position: 1,
          driverId: 'antonelli',
          driverName: 'Andrea Kimi Antonelli',
          driverCode: 'ANT',
          teamId: 'mercedes',
          teamName: 'Mercedes',
          laps: 58,
          status: 'Finished',
          timeOrGap: '1:30:00.000',
          points: 25,
        },
        {
          position: 2,
          driverId: 'russell',
          driverName: 'George Russell',
          driverCode: 'RUS',
          teamId: 'mercedes',
          teamName: 'Mercedes',
          laps: 58,
          status: 'Finished',
          timeOrGap: '+1.000s',
          points: 18,
        },
        {
          position: 3,
          driverId: 'norris',
          driverName: 'Lando Norris',
          driverCode: 'NOR',
          teamId: 'mclaren',
          teamName: 'McLaren',
          laps: 58,
          status: 'Finished',
          timeOrGap: '+2.000s',
          points: 15,
        },
      ],
    };

    const res = recalculateStandingsFromRaces(
      2026,
      [mockRace],
      zeroPodiumDrivers,
      zeroPodiumConstructors,
    );

    const antonelli = res.drivers.find((d) => d.driverId === 'antonelli');
    const mercedes = res.constructors.find((c) => c.teamId === 'mercedes');

    expect(antonelli!.podiums).toBe(1);
    expect(mercedes!.podiums).toBe(2);
  });
});
