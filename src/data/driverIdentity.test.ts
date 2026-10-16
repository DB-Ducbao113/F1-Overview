import { describe, expect, it } from 'vitest';
import { DRIVERS_DATA, getDriverNumber } from './drivers';
import { STANDINGS_DATA } from './championship/standings';
import { resolveTeamId } from '../utils/teamColors';

describe('seasonal driver identity', () => {
  it('uses the 2026 race numbers without changing historical champions', () => {
    expect(DRIVERS_DATA.verstappen.number).toBe(3);
    expect(DRIVERS_DATA.norris.number).toBe(1);
    expect(getDriverNumber('verstappen', 2026)).toBe(3);
    expect(getDriverNumber('norris', 2026)).toBe(1);
    for (const season of [2024, 2025] as const) {
      expect(getDriverNumber('verstappen', season)).toBe(1);
      expect(getDriverNumber('norris', season)).toBe(4);
    }
    expect(getDriverNumber('lawson', 2026)).toBe(30);
  });

  it('retains all 21 participants and the three Alpine drivers in 2025', () => {
    expect(STANDINGS_DATA[2025].drivers).toHaveLength(21);
    expect(STANDINGS_DATA[2025].drivers.filter((driver) => driver.teamId === 'alpine')
      .map((driver) => driver.driverId).sort()).toEqual(['colapinto', 'doohan', 'gasly']);
    expect(resolveTeamId('BWT Alpine F1 Team')).toBe('alpine');
    expect(STANDINGS_DATA[2025].constructors.some((team) => team.teamId === 'alpine')).toBe(true);
  });
});
