import { describe, expect, it } from 'vitest';
import { getTeamDisplayName } from './teamNames';

describe('getTeamDisplayName', () => {
  it.each([
    ['Oracle Red Bull Racing', 'Red Bull Racing'],
    ['Red Bull Racing Honda RBPT', 'Red Bull Racing'],
    ['Mercedes-AMG PETRONAS Formula One Team', 'Mercedes'],
    ['MoneyGram Haas F1 Team', 'Haas'],
    ['Scuderia Ferrari HP', 'Ferrari'],
    ['RB F1 Team', 'Racing Bulls'],
    ['VCARB', 'Racing Bulls'],
    ['RB', 'Racing Bulls'],
    ['BWT Alpine F1 Team', 'Alpine'],
  ])('normalizes %s to %s', (input, expected) => {
    expect(getTeamDisplayName(input)).toBe(expected);
  });

  it('preserves an unknown historical constructor', () => {
    expect(getTeamDisplayName('Unknown Constructor')).toBe('Unknown Constructor');
  });

  it('keeps historical names tied to the selected season', () => {
    expect(getTeamDisplayName('audi', 2024)).toBe('Kick Sauber');
    expect(getTeamDisplayName('audi', 2025)).toBe('Kick Sauber');
    expect(getTeamDisplayName('audi', 2026)).toBe('Audi');
    expect(getTeamDisplayName('racingbulls', 2024)).toBe('RB');
    expect(getTeamDisplayName('racingbulls', 2025)).toBe('Racing Bulls');
  });
});
