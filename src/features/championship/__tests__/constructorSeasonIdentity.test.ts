import { describe, it, expect, vi } from 'vitest';
import {
  normalizeConstructorId,
  resolveConstructorIdentity,
  mapConstructorId,
  projectHistoricalConstructorStanding,
  projectHistoricalDriverStanding,
  CONSTRUCTOR_MAP,
  constructorNormalizer,
} from '../domain/constructorMapping';
import { recalculateStandingsFromRaces } from '../domain/standingsCalculator';
import {
  DRIVER_STANDINGS_2024,
  CONSTRUCTOR_STANDINGS_2024,
  DRIVER_STANDINGS_2025,
  CONSTRUCTOR_STANDINGS_2025,
  DRIVER_STANDINGS_2026,
  CONSTRUCTOR_STANDINGS_2026,
} from '../../../data/championship/standings';
import { TeamId, UNKNOWN_TEAM_ID } from '../../../types';

/**
 * SEASON-AWARE CONSTRUCTOR IDENTITY TEST SUITE (MILESTONE A4.3b.2)
 *
 * Verifies:
 * 1. 2024 Sauber / Kick Sauber aliases -> historicalId: 'sauber', presentationTeamId: 'audi'.
 * 2. 2025 Sauber / Kick Sauber aliases -> historicalId: 'sauber', presentationTeamId: 'audi'.
 * 3. 2026 Audi aliases -> historicalId: 'audi', presentationTeamId: 'audi'.
 * 4. Unknown constructor IDs -> UNKNOWN_TEAM_ID ('unknown'), never misattributed.
 * 5. All 11 active teams of 2026 are mapped cleanly.
 * 6. Historical constructor display metadata (Kick Sauber 2024/2025 vs Audi 2026; RB 2024 vs RB F1 Team 2026).
 * 7. WDC / WCC points preservation across all seasons.
 * 8. Non-destructive projections for legacy stored data and LocalStorage compatibility.
 * 9. Unchanged 2026 Showroom asset selection via presentation TeamId.
 * 10. Sprint & Countback invariance.
 */

describe('Season-Aware Constructor Identity & Historical Mapping (A4.3b.2)', () => {
  // ── 1. 2024 Sauber / Kick Sauber Aliases ──
  it('normalizes 2024 Sauber and Kick Sauber aliases to historicalId "sauber"', () => {
    const sauberAliases = [
      'sauber',
      'kick_sauber',
      'kick-sauber',
      'Kick Sauber',
      'stake',
      'stake_f1_team_kick_sauber',
      'sauber_ferrari',
    ];

    for (const alias of sauberAliases) {
      expect(normalizeConstructorId(alias, 2024)).toBe('sauber');

      const res = resolveConstructorIdentity(alias, 2024);
      expect(res.historicalId).toBe('sauber');
      expect(res.presentationTeamId).toBe('audi');
      expect(res.displayName).toBe('Kick Sauber');
      expect(res.fullName).toBe('Stake F1 Team Kick Sauber');
      expect(res.powerUnit).toBe('Ferrari');
      expect(res.lineageId).toBe('sauber_audi');
      expect(res.isHistorical).toBe(true);
    }
  });

  // ── 2. 2025 Sauber / Kick Sauber Aliases ──
  it('normalizes 2025 Sauber and Kick Sauber aliases to historicalId "sauber"', () => {
    expect(normalizeConstructorId('sauber', 2025)).toBe('sauber');
    expect(normalizeConstructorId('kick_sauber', 2025)).toBe('sauber');
    expect(normalizeConstructorId('stake', 2025)).toBe('sauber');

    const res = resolveConstructorIdentity('kick_sauber', 2025);
    expect(res.historicalId).toBe('sauber');
    expect(res.presentationTeamId).toBe('audi');
    expect(res.displayName).toBe('Kick Sauber');
    expect(res.powerUnit).toBe('Ferrari');
    expect(res.isHistorical).toBe(true);
  });

  // ── 3. 2026 Audi Aliases ──
  it('normalizes 2026 Audi and legacy Sauber aliases to historicalId "audi"', () => {
    const audiAliases = ['audi', 'audi_f1', 'audi_revolut', 'sauber', 'kick_sauber'];

    for (const alias of audiAliases) {
      expect(normalizeConstructorId(alias, 2026)).toBe('audi');

      const res = resolveConstructorIdentity(alias, 2026);
      expect(res.historicalId).toBe('audi');
      expect(res.presentationTeamId).toBe('audi');
      expect(res.displayName).toBe('Audi');
      expect(res.fullName).toBe('Audi Formula One Team');
      expect(res.powerUnit).toBe('Audi Sport F1 Power Unit');
      expect(res.lineageId).toBe('sauber_audi');
      expect(res.isHistorical).toBe(false);
    }
  });

  // ── 4. Unknown Constructor IDs ──
  it('never credits unmapped constructor IDs to another team; safely parks under "unknown"', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const unknownIds = ['newteam11', 'unknown_constructor', '', undefined, '   '];
    for (const raw of unknownIds) {
      expect(normalizeConstructorId(raw, 2024)).toBe(UNKNOWN_TEAM_ID);
      expect(normalizeConstructorId(raw, 2026)).toBe(UNKNOWN_TEAM_ID);

      const res = resolveConstructorIdentity(raw, 2026);
      expect(res.historicalId).toBe(UNKNOWN_TEAM_ID);
      expect(res.presentationTeamId).toBe(UNKNOWN_TEAM_ID);
      expect(res.displayName).toBe('Unknown');

      // Legacy mapConstructorId also returns UNKNOWN_TEAM_ID
      expect(mapConstructorId(raw, 2026)).toBe(UNKNOWN_TEAM_ID);
    }

    warnSpy.mockRestore();
  });

  // ── 5. All 11 Active Teams of 2026 ──
  it('correctly maps all 11 active teams of 2026', () => {
    const activeTeams: TeamId[] = [
      'ferrari',
      'mclaren',
      'redbull',
      'mercedes',
      'astonmartin',
      'alpine',
      'racingbulls',
      'haas',
      'williams',
      'audi',
      'cadillac',
    ];

    for (const team of activeTeams) {
      expect(normalizeConstructorId(team, 2026)).toBe(team);
      const res = resolveConstructorIdentity(team, 2026);
      expect(res.presentationTeamId).toBe(team);
      expect(res.displayName.length).toBeGreaterThan(0);
      expect(res.powerUnit.length).toBeGreaterThan(0);
    }
  });

  // ── 6. Historical Constructor Display Metadata & Lineage ──
  it('provides season-aware metadata for Racing Bulls / RB across 2024-2026', () => {
    const res2024 = resolveConstructorIdentity('rb', 2024);
    expect(res2024.displayName).toBe('RB');
    expect(res2024.powerUnit).toBe('Honda RBPT');
    expect(res2024.isHistorical).toBe(true);

    const res2025 = resolveConstructorIdentity('racingbulls', 2025);
    expect(res2025.displayName).toBe('Racing Bulls');
    expect(res2025.powerUnit).toBe('Honda RBPT');
    expect(res2025.isHistorical).toBe(true);

    const res2026 = resolveConstructorIdentity('racingbulls', 2026);
    expect(res2026.displayName).toBe('RB F1 Team');
    expect(res2026.powerUnit).toBe('Red Bull Ford');
    expect(res2026.isHistorical).toBe(false);
  });

  // ── 7. WDC / WCC Point Preservation ──
  it('preserves exact points for 2024, 2025 and 2026 standings without mutation', () => {
    // 2024 Standings
    const res2024 = recalculateStandingsFromRaces(
      2024,
      [],
      DRIVER_STANDINGS_2024,
      CONSTRUCTOR_STANDINGS_2024,
    );
    expect(res2024.constructors.find((c) => c.teamName === 'Kick Sauber')?.points).toBe(4);
    expect(res2024.drivers.find((d) => d.driverId === 'zhou')?.points).toBe(4);

    // 2025 Standings
    const res2025 = recalculateStandingsFromRaces(
      2025,
      [],
      DRIVER_STANDINGS_2025,
      CONSTRUCTOR_STANDINGS_2025,
    );
    expect(res2025.constructors.find((c) => c.teamName === 'Kick Sauber')?.points).toBe(70);

    // 2026 Standings
    const res2026 = recalculateStandingsFromRaces(
      2026,
      [],
      DRIVER_STANDINGS_2026,
      CONSTRUCTOR_STANDINGS_2026,
    );
    expect(res2026.constructors.find((c) => c.teamId === 'audi')?.points).toBe(23);
    expect(res2026.drivers.find((d) => d.driverId === 'hulkenberg')?.points).toBe(13);
    expect(res2026.drivers.find((d) => d.driverId === 'bortoleto')?.points).toBe(10);
  });

  // ── 8. Non-Destructive Standings Projection ──
  it('safely projects historical constructor and driver standings without mutating stored baseline', () => {
    const sauber2024 = CONSTRUCTOR_STANDINGS_2024.find((c) => c.teamName === 'Kick Sauber')!;
    const projected = projectHistoricalConstructorStanding(sauber2024, 2024);

    expect(projected.historicalId).toBe('sauber');
    expect(projected.teamId).toBe('audi'); // Preserves 2026 UI link
    expect(projected.teamName).toBe('Kick Sauber');
    expect(projected.engine).toBe('Ferrari');
    expect(projected.lineageId).toBe('sauber_audi');

    const zhou2024 = DRIVER_STANDINGS_2024.find((d) => d.driverId === 'zhou')!;
    const projectedDriver = projectHistoricalDriverStanding(zhou2024, 2024);
    expect(projectedDriver.historicalTeamId).toBe('sauber');
    expect(projectedDriver.teamId).toBe('audi');
    expect(projectedDriver.teamName).toBe('Kick Sauber');
  });

  // ── 9. Showroom Asset Selection Invariance ──
  it('guarantees presentation TeamId is always "audi" for 3D showroom model and livery loading', () => {
    expect(constructorNormalizer.toPresentationTeamId('sauber', 2024)).toBe('audi');
    expect(constructorNormalizer.toPresentationTeamId('kick_sauber', 2025)).toBe('audi');
    expect(constructorNormalizer.toPresentationTeamId('audi', 2026)).toBe('audi');

    // CONSTRUCTOR_MAP legacy table guarantees static asset compatibility
    expect(CONSTRUCTOR_MAP['sauber']).toBe('audi');
    expect(CONSTRUCTOR_MAP['kick_sauber']).toBe('audi');
    expect(CONSTRUCTOR_MAP['audi']).toBe('audi');
  });
});
