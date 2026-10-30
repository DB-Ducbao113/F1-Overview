import { describe, it, expect, vi } from 'vitest';
import { mapConstructorId, normalizeDriverId } from '../../../../services/f1DataService';
import { LOCKED_DRIVERS } from '../../../../services/standingsEngine';
import { UNKNOWN_TEAM_ID } from '../../../../types';

describe('Characterization Baseline — Constructor & Driver Normalization', () => {
  describe('Constructor ID Mapping (Current Behavior)', () => {
    it('maps all 10 conventional constructors to canonical TeamId', () => {
      expect(mapConstructorId('red_bull')).toBe('redbull');
      expect(mapConstructorId('ferrari')).toBe('ferrari');
      expect(mapConstructorId('mclaren')).toBe('mclaren');
      expect(mapConstructorId('mercedes')).toBe('mercedes');
      expect(mapConstructorId('aston_martin')).toBe('astonmartin');
      expect(mapConstructorId('alpine')).toBe('alpine');
      expect(mapConstructorId('haas')).toBe('haas');
      expect(mapConstructorId('williams')).toBe('williams');
      expect(mapConstructorId('rb')).toBe('racingbulls');
      expect(mapConstructorId('cadillac')).toBe('cadillac');
      expect(mapConstructorId('audi')).toBe('audi');
    });

    it('CHARACTERIZATION: verifies current mapping converts "sauber" to "audi" regardless of season', () => {
      // In current implementation, mapConstructorId is not season-aware and maps sauber -> audi.
      // This is documented as a known domain discrepancy for pre-2026 seasons.
      expect(mapConstructorId('sauber')).toBe('audi');
    });

    it('safely falls back to UNKNOWN_TEAM_ID ("unknown") for unmapped constructor IDs', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      expect(mapConstructorId('unknown_constructor_x')).toBe(UNKNOWN_TEAM_ID);
      expect(mapConstructorId(undefined)).toBe(UNKNOWN_TEAM_ID);
      expect(mapConstructorId('')).toBe(UNKNOWN_TEAM_ID);
      warnSpy.mockRestore();
    });
  });

  describe('Driver ID Normalization (Current Behavior)', () => {
    it('normalizes full-name Jolpica driver IDs to canonical surname IDs', () => {
      expect(normalizeDriverId('max_verstappen')).toBe('verstappen');
      expect(normalizeDriverId('arvid_lindblad')).toBe('lindblad');
      expect(normalizeDriverId('carlos_sainz')).toBe('sainz');
      expect(normalizeDriverId('lewis_hamilton')).toBe('hamilton');
      expect(normalizeDriverId('charles_leclerc')).toBe('leclerc');
    });

    it('safely handles missing or empty driverId', () => {
      expect(normalizeDriverId(undefined)).toBe('unknown');
      expect(normalizeDriverId('')).toBe('unknown');
    });
  });

  describe('Locked Drivers Registry', () => {
    it('guarantees key driver seats remain bound to official 2026 teams', () => {
      expect(LOCKED_DRIVERS['antonelli']?.teamId).toBe('mercedes');
      expect(LOCKED_DRIVERS['russell']?.teamId).toBe('mercedes');
      expect(LOCKED_DRIVERS['norris']?.teamId).toBe('mclaren');
      expect(LOCKED_DRIVERS['piastri']?.teamId).toBe('mclaren');
      expect(LOCKED_DRIVERS['hamilton']?.teamId).toBe('ferrari');
      expect(LOCKED_DRIVERS['leclerc']?.teamId).toBe('ferrari');
      expect(LOCKED_DRIVERS['verstappen']?.teamId).toBe('redbull');
      expect(LOCKED_DRIVERS['hadjar']?.teamId).toBe('redbull');
      expect(LOCKED_DRIVERS['bottas']?.teamId).toBe('cadillac');
      expect(LOCKED_DRIVERS['perez']?.teamId).toBe('cadillac');
    });
  });
});
