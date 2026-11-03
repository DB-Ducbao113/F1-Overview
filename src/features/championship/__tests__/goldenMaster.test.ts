import { describe, it, expect } from 'vitest';
import { recalculateStandingsFromRaces } from '../../../services/standingsEngine';
import {
  DRIVER_STANDINGS_2026,
  CONSTRUCTOR_STANDINGS_2026,
} from '../../../data/championship/standings';
import {
  FIXTURE_COMPLETED_RACE_2026_R18,
  FIXTURE_COMPLETED_RACE_2026_R19,
  FIXTURE_SPRINT_RACE_2026_R19,
  FIXTURE_SCHEDULED_RACE_2026_R20,
  FIXTURE_CUTOFF_LOCKED_RACE_2026_R16,
} from './fixtures/goldenMasterFixtures';

describe('Championship Data Integrity — Golden Master Deterministic Snapshots', () => {
  it('produces deterministic baseline standings when no additional post-cutoff races are provided', () => {
    const result = recalculateStandingsFromRaces(
      2026,
      [],
      DRIVER_STANDINGS_2026,
      CONSTRUCTOR_STANDINGS_2026,
    );

    expect(result.drivers).toHaveLength(22);
    expect(result.constructors).toHaveLength(11);

    // Baseline leader checks (official verified baseline through Round 18)
    const p1Driver = result.drivers[0];
    expect(p1Driver.driverId).toBe('antonelli');
    expect(p1Driver.points).toBe(365);
    expect(p1Driver.wins).toBe(9);
    expect(p1Driver.podiums).toBe(15);

    const p1Constructor = result.constructors[0];
    expect(p1Constructor.teamId).toBe('mercedes');
    expect(p1Constructor.points).toBe(607);
    expect(p1Constructor.wins).toBe(12);
    expect(p1Constructor.podiums).toBe(23);
  });

  it('matches golden master snapshot for post-cutoff Grand Prix (Round 19)', () => {
    const result = recalculateStandingsFromRaces(
      2026,
      [FIXTURE_COMPLETED_RACE_2026_R19],
      DRIVER_STANDINGS_2026,
      CONSTRUCTOR_STANDINGS_2026,
    );

    // Russell won R19: baseline points 242 + 25 = 267, wins 3 + 1 = 4, podiums 8 + 1 = 9
    const russell = result.drivers.find((d) => d.driverId === 'russell')!;
    expect(russell.points).toBe(267);
    expect(russell.wins).toBe(4);
    expect(russell.podiums).toBe(9);

    // Norris got P2: baseline 211 + 18 = 229, podiums 5 + 1 = 6
    const norris = result.drivers.find((d) => d.driverId === 'norris')!;
    expect(norris.points).toBe(229);
    expect(norris.podiums).toBe(6);

    // Antonelli got P3: baseline 365 + 15 = 380, podiums 15 + 1 = 16
    const antonelli = result.drivers.find((d) => d.driverId === 'antonelli')!;
    expect(antonelli.points).toBe(380);
    expect(antonelli.podiums).toBe(16);

    // Mercedes got P1 & P3: baseline 607 + 25 + 15 = 647, wins 12 + 1 = 13, podiums 23 + 2 = 25
    const mercedes = result.constructors.find((c) => c.teamId === 'mercedes')!;
    expect(mercedes.points).toBe(647);
    expect(mercedes.wins).toBe(13);
    expect(mercedes.podiums).toBe(25);
  });

  it('matches golden master snapshot for Sprint Weekend (Round 19 Race + Round 19 Sprint)', () => {
    const result = recalculateStandingsFromRaces(
      2026,
      [FIXTURE_COMPLETED_RACE_2026_R19, FIXTURE_SPRINT_RACE_2026_R19],
      DRIVER_STANDINGS_2026,
      CONSTRUCTOR_STANDINGS_2026,
    );

    // Russell: baseline 242 + R19 Race 1(25) + R19 Sprint(8) + R19 Race 2(18) = 293
    const russell = result.drivers.find((d) => d.driverId === 'russell')!;
    expect(russell.points).toBe(293);

    // Norris: baseline 211 + R19 Race 1(18) + R19 Sprint(7) + R19 Race 2(25) = 261
    const norris = result.drivers.find((d) => d.driverId === 'norris')!;
    expect(norris.points).toBe(261);

    // Antonelli: baseline 365 + R19 Race 1(15) + R19 Sprint(5) = 385
    const antonelli = result.drivers.find((d) => d.driverId === 'antonelli')!;
    expect(antonelli.points).toBe(385);

    // Piastri: baseline 144 + R19 Race 1(12) + R19 Sprint(6) = 162
    const piastri = result.drivers.find((d) => d.driverId === 'piastri')!;
    expect(piastri.points).toBe(162);
  });

  it('preserves data integrity policy by ignoring races at or below baseline cutoff (Round 16 and Round 18)', () => {
    const before = recalculateStandingsFromRaces(
      2026,
      [],
      DRIVER_STANDINGS_2026,
      CONSTRUCTOR_STANDINGS_2026,
    );

    const afterR16 = recalculateStandingsFromRaces(
      2026,
      [FIXTURE_CUTOFF_LOCKED_RACE_2026_R16],
      DRIVER_STANDINGS_2026,
      CONSTRUCTOR_STANDINGS_2026,
    );

    // Round 16 is at or below cutoff (18), so Antonelli points must NOT be double-counted!
    expect(afterR16.drivers.find((d) => d.driverId === 'antonelli')?.points).toBe(
      before.drivers.find((d) => d.driverId === 'antonelli')?.points,
    );
    expect(afterR16.constructors.find((c) => c.teamId === 'mercedes')?.points).toBe(
      before.constructors.find((c) => c.teamId === 'mercedes')?.points,
    );

    const afterR18 = recalculateStandingsFromRaces(
      2026,
      [FIXTURE_COMPLETED_RACE_2026_R18],
      DRIVER_STANDINGS_2026,
      CONSTRUCTOR_STANDINGS_2026,
    );

    // Round 18 is at or below cutoff (18), so Antonelli points must NOT be double-counted!
    expect(afterR18.drivers.find((d) => d.driverId === 'antonelli')?.points).toBe(
      before.drivers.find((d) => d.driverId === 'antonelli')?.points,
    );
    expect(afterR18.constructors.find((c) => c.teamId === 'mercedes')?.points).toBe(
      before.constructors.find((c) => c.teamId === 'mercedes')?.points,
    );
  });

  it('guarantees scheduled races with 0 entries cause 0 mutations to standings', () => {
    const before = recalculateStandingsFromRaces(
      2026,
      [FIXTURE_COMPLETED_RACE_2026_R19],
      DRIVER_STANDINGS_2026,
      CONSTRUCTOR_STANDINGS_2026,
    );

    const after = recalculateStandingsFromRaces(
      2026,
      [FIXTURE_COMPLETED_RACE_2026_R19, FIXTURE_SCHEDULED_RACE_2026_R20],
      DRIVER_STANDINGS_2026,
      CONSTRUCTOR_STANDINGS_2026,
    );

    expect(after.drivers.map((d) => d.points)).toEqual(before.drivers.map((d) => d.points));
    expect(after.constructors.map((c) => c.points)).toEqual(
      before.constructors.map((c) => c.points),
    );
  });
});
