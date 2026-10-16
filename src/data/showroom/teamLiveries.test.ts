import { describe, expect, it } from 'vitest';
import { CARS_2026 } from '../cars/2026';
import { getTeam3DLivery } from './teamLiveries';

describe('showroom current car identity', () => {
  it('matches the 2026 car catalogue for every team', () => {
    for (const car of CARS_2026) {
      const livery = getTeam3DLivery(car.teamId);
      expect(livery.shortCarName).toBe(car.shortName);
      expect(livery.carModelName).toContain(car.name);
      expect(livery.carModelName).toContain('2026');
    }
    expect(getTeam3DLivery('mercedes').shortCarName).toBe('W17');
    expect(getTeam3DLivery('ferrari').shortCarName).toBe('SF-26');
  });
});
