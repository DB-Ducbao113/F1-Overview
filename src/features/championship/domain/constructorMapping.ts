import {
  SeasonYear,
  TeamId,
  UNKNOWN_TEAM_ID,
  ConstructorStanding,
  DriverStanding,
} from '../../../types';
import {
  ConstructorIdentityResolution,
  HistoricalConstructorId,
  IConstructorNormalizer,
} from './contracts/domainContracts';

/**
 * PURE DOMAIN: CONSTRUCTOR MAPPING & SEASON-AWARE IDENTITY RESOLUTION
 *
 * Distinguishes:
 * 1. Historical constructor identity (e.g. 'sauber' for 2024/2025 vs 'audi' for 2026).
 * 2. Constructor lineage / organizational continuity (e.g. Hinwil lineage 'sauber_audi').
 * 3. Current presentation TeamId (e.g. 'audi' for 3D showroom models, liveries, and 2026 UI assets).
 *
 * Rules:
 * - 2024 Sauber / Kick Sauber -> historicalId: 'sauber', displayName: 'Kick Sauber', presentationTeamId: 'audi'.
 * - 2025 Sauber / Kick Sauber -> historicalId: 'sauber', displayName: 'Kick Sauber', presentationTeamId: 'audi'.
 * - 2026 Audi -> historicalId: 'audi', displayName: 'Audi', presentationTeamId: 'audi'.
 * - Unknown aliases must never be credited to another team; parked under UNKNOWN_TEAM_ID ('unknown').
 * - Pure TypeScript — zero dependencies on React, Zustand, DOM, fetch or localStorage.
 */

/**
 * Legacy canonical mapping table to 2026 presentation TeamId.
 * Preserves 100% backward compatibility for asset and showroom loaders.
 */
export const CONSTRUCTOR_MAP: Record<string, TeamId> = {
  red_bull: 'redbull',
  redbull: 'redbull',
  red_bull_racing: 'redbull',
  cadillac: 'cadillac',
  ferrari: 'ferrari',
  scuderia_ferrari: 'ferrari',
  mclaren: 'mclaren',
  mercedes: 'mercedes',
  mercedes_amg: 'mercedes',
  aston_martin: 'astonmartin',
  astonmartin: 'astonmartin',
  alpine: 'alpine',
  renault: 'alpine',
  rb: 'racingbulls',
  vcarb: 'racingbulls',
  racing_bulls: 'racingbulls',
  racingbulls: 'racingbulls',
  toro_rosso: 'racingbulls',
  alphatauri: 'racingbulls',
  alpha_tauri: 'racingbulls',
  sauber: 'audi', // Legacy presentation: maps to audi for 2026 asset compatibility
  kick_sauber: 'audi',
  stake: 'audi',
  audi: 'audi',
  haas: 'haas',
  williams: 'williams',
};

const SAUBER_ALIASES = new Set([
  'sauber',
  'kick_sauber',
  'kick',
  'stake',
  'stake_f1_team_kick_sauber',
  'sauber_ferrari',
  'kick_sauber_ferrari',
]);

const AUDI_ALIASES = new Set(['audi', 'audi_f1', 'audi_revolut', 'audi_formula_one_team']);

/**
 * Normalizes raw constructor ID to official historical championship constructor ID.
 * Season-aware:
 * - For 2024 and 2025: Sauber / Kick Sauber aliases normalize to 'sauber'.
 * - For 2026: Audi and historical Sauber aliases normalize to 'audi'.
 * - For other active constructors: normalizes to canonical TeamId.
 * - For unmapped/unknown IDs: returns UNKNOWN_TEAM_ID ('unknown').
 */
export function normalizeConstructorId(
  rawConstructorId: string | undefined,
  season?: SeasonYear,
): HistoricalConstructorId {
  if (!rawConstructorId || typeof rawConstructorId !== 'string') {
    return UNKNOWN_TEAM_ID;
  }

  const clean = rawConstructorId
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, '_');
  if (!clean) return UNKNOWN_TEAM_ID;

  // 1. Check Sauber / Audi lineage with explicit season awareness
  if (SAUBER_ALIASES.has(clean)) {
    if (season === 2024 || season === 2025) {
      return 'sauber';
    }
    // For 2026 (or default ongoing season), Hinwil team is Audi
    return 'audi';
  }

  if (AUDI_ALIASES.has(clean)) {
    if (season === 2024 || season === 2025) {
      // In 2024/2025 Audi had not entered; attribution maps to historical Sauber entry
      return 'sauber';
    }
    return 'audi';
  }

  // 2. Conventional constructors
  if (CONSTRUCTOR_MAP[clean]) {
    return CONSTRUCTOR_MAP[clean];
  }

  // Fallback check against CONSTRUCTOR_MAP keys
  const directMatch = CONSTRUCTOR_MAP[rawConstructorId];
  if (directMatch) {
    if (directMatch === 'audi' && (season === 2024 || season === 2025)) {
      return 'sauber';
    }
    return directMatch;
  }

  return UNKNOWN_TEAM_ID;
}

/**
 * Resolves full identity metadata for a constructor in a given season, separating
 * historical competition identity from 2026 presentation assets.
 */
export function resolveConstructorIdentity(
  rawConstructorId: string | undefined,
  season?: SeasonYear,
): ConstructorIdentityResolution {
  const effectiveSeason: SeasonYear = season ?? 2026;
  const historicalId = normalizeConstructorId(rawConstructorId, effectiveSeason);

  if (historicalId === UNKNOWN_TEAM_ID) {
    return {
      historicalId: UNKNOWN_TEAM_ID,
      presentationTeamId: UNKNOWN_TEAM_ID,
      displayName: 'Unknown',
      fullName: 'Unknown Constructor',
      powerUnit: 'Hybrid Turbo V6',
      lineageId: 'unknown',
      isHistorical: false,
    };
  }

  // Sauber / Audi special resolution
  if (historicalId === 'sauber') {
    return {
      historicalId: 'sauber',
      presentationTeamId: 'audi',
      displayName: 'Kick Sauber',
      fullName: 'Stake F1 Team Kick Sauber',
      powerUnit: 'Ferrari',
      lineageId: 'sauber_audi',
      isHistorical: true,
    };
  }

  if (historicalId === 'audi') {
    return {
      historicalId: 'audi',
      presentationTeamId: 'audi',
      displayName: 'Audi',
      fullName: 'Audi Formula One Team',
      powerUnit: 'Audi Sport F1 Power Unit',
      lineageId: 'sauber_audi',
      isHistorical: false,
    };
  }

  // Racing Bulls season naming
  if (historicalId === 'racingbulls') {
    if (effectiveSeason === 2024) {
      return {
        historicalId: 'racingbulls',
        presentationTeamId: 'racingbulls',
        displayName: 'RB',
        fullName: 'Visa Cash App RB Formula One Team',
        powerUnit: 'Honda RBPT',
        lineageId: 'racingbulls',
        isHistorical: true,
      };
    }
    if (effectiveSeason === 2025) {
      return {
        historicalId: 'racingbulls',
        presentationTeamId: 'racingbulls',
        displayName: 'Racing Bulls',
        fullName: 'Visa Cash App RB Formula One Team',
        powerUnit: 'Honda RBPT',
        lineageId: 'racingbulls',
        isHistorical: true,
      };
    }
    return {
      historicalId: 'racingbulls',
      presentationTeamId: 'racingbulls',
      displayName: 'RB F1 Team',
      fullName: 'Visa Cash App RB Formula One Team',
      powerUnit: 'Red Bull Ford',
      lineageId: 'racingbulls',
      isHistorical: false,
    };
  }

  // Standard active 2026 teams
  const teamId = historicalId as TeamId;
  const standardNames: Record<TeamId, { display: string; full: string; engine: string }> = {
    ferrari: { display: 'Ferrari', full: 'Scuderia Ferrari HP', engine: 'Ferrari' },
    mclaren: { display: 'McLaren', full: 'McLaren Formula 1 Team', engine: 'Mercedes' },
    redbull: {
      display: 'Red Bull',
      full: 'Oracle Red Bull Racing',
      engine: effectiveSeason === 2026 ? 'Red Bull Ford' : 'Honda RBPT',
    },
    mercedes: { display: 'Mercedes', full: 'Mercedes-AMG PETRONAS F1 Team', engine: 'Mercedes' },
    astonmartin: {
      display: 'Aston Martin',
      full: 'Aston Martin Aramco F1 Team',
      engine: effectiveSeason === 2026 ? 'Honda' : 'Mercedes',
    },
    alpine: {
      display: 'Alpine',
      full: 'BWT Alpine F1 Team',
      engine: effectiveSeason === 2026 ? 'Mercedes' : 'Renault',
    },
    haas: { display: 'Haas', full: 'MoneyGram Haas F1 Team', engine: 'Ferrari' },
    williams: { display: 'Williams', full: 'Williams Racing', engine: 'Mercedes' },
    cadillac: { display: 'Cadillac', full: 'Cadillac Formula 1 Team', engine: 'Ferrari' },
    audi: { display: 'Audi', full: 'Audi Formula One Team', engine: 'Audi Sport F1 Power Unit' },
    racingbulls: {
      display: 'RB F1 Team',
      full: 'Visa Cash App RB Formula One Team',
      engine: 'Red Bull Ford',
    },
  };

  const meta = standardNames[teamId];
  return {
    historicalId,
    presentationTeamId: teamId,
    displayName: meta?.display || teamId,
    fullName: meta?.full || teamId,
    powerUnit: meta?.engine || 'Hybrid Turbo V6',
    lineageId: teamId,
    isHistorical: false,
  };
}

/**
 * Backward-compatible helper mapping constructorId to 2026 presentation TeamId.
 * Guarantees that existing 3D showroom asset selection, team detail routes,
 * and UI component color/logo lookups continue to work without disruption.
 */
export function mapConstructorId(constructorId: string | undefined, season?: SeasonYear): TeamId {
  if (!constructorId) {
    if (typeof console !== 'undefined') {
      console.warn(`Unmapped constructorId "", falling back to 'unknown'.`);
    }
    return UNKNOWN_TEAM_ID;
  }

  const resolution = resolveConstructorIdentity(constructorId, season);
  if (resolution.presentationTeamId !== UNKNOWN_TEAM_ID) {
    return resolution.presentationTeamId;
  }

  if (typeof console !== 'undefined') {
    console.warn(`Unmapped constructorId "${constructorId}", falling back to 'unknown'.`);
  }
  return UNKNOWN_TEAM_ID;
}

/**
 * Pure Domain Normalizer implementing IConstructorNormalizer contract.
 */
export const constructorNormalizer: IConstructorNormalizer = {
  normalize(rawConstructorId: string | undefined, season?: SeasonYear): HistoricalConstructorId {
    return normalizeConstructorId(rawConstructorId, season);
  },
  resolve(
    rawConstructorId: string | undefined,
    season?: SeasonYear,
  ): ConstructorIdentityResolution {
    return resolveConstructorIdentity(rawConstructorId, season);
  },
  toPresentationTeamId(rawConstructorId: string | undefined, season?: SeasonYear): TeamId {
    return mapConstructorId(rawConstructorId, season);
  },
};

/**
 * Non-destructive projection helper for constructor standings.
 * Provides read-only historical identity and lineage without altering stored data structures.
 */
export function projectHistoricalConstructorStanding(
  standing: ConstructorStanding,
  season: SeasonYear,
): ConstructorStanding & { historicalId: HistoricalConstructorId; lineageId: string } {
  const resolution = resolveConstructorIdentity(standing.teamId, season);
  return {
    ...standing,
    teamName: standing.teamName || resolution.displayName,
    engine: standing.engine || resolution.powerUnit,
    historicalId: resolution.historicalId,
    lineageId: resolution.lineageId,
  };
}

/**
 * Non-destructive projection helper for driver standings.
 */
export function projectHistoricalDriverStanding(
  standing: DriverStanding,
  season: SeasonYear,
): DriverStanding & { historicalTeamId: HistoricalConstructorId; lineageId: string } {
  const resolution = resolveConstructorIdentity(standing.teamId, season);
  return {
    ...standing,
    teamName: standing.teamName || resolution.displayName,
    historicalTeamId: resolution.historicalId,
    lineageId: resolution.lineageId,
  };
}
