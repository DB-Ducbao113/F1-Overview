import { describe, expect, it } from 'vitest';
import { getTeamDisplayName } from './teamNames';

describe('getTeamDisplayName', () => {
  it.each([
    ['Oracle Red Bull Racing', 'Red Bull Racing'],
    ['Red Bull Racing Honda RBPT', 'Red Bull Racing'],
    ['Mercedes-AMG PETRONAS Formula One Team', 'Mercedes'],
    ['MoneyGram Haas F1 Team', 'Haas'],
    ['Scuderia Ferrari HP', 'Ferrari'],
  ])('normalizes %s to %s', (input, expected) => {
    expect(getTeamDisplayName(input)).toBe(expected);
  });

  it('preserves an unknown historical constructor', () => {
    expect(getTeamDisplayName('Unknown Constructor')).toBe('Unknown Constructor');
  });
});
