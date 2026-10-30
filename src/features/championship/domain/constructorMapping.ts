import { TeamId, UNKNOWN_TEAM_ID } from '../../../types';
import { IConstructorNormalizer } from './contracts/domainContracts';

/**
 * PURE DOMAIN: CONSTRUCTOR MAPPING & CANONICALIZATION
 *
 * Maps upstream external API / Ergast constructor identifiers to strongly typed TeamId.
 *
 * NOTE (A4.3a DISCREPANCY RECORD):
 * In A4.3a, 'sauber' is mapped to 'audi' to strictly preserve 100% backward compatibility
 * with existing calculations. Season-aware mapping (Sauber 2024/2025 vs Audi 2026) is
 * scheduled for Milestone A4.3b.
 *
 * Pure TypeScript — zero dependencies on React, Zustand, DOM, fetch or localStorage.
 */

export const CONSTRUCTOR_MAP: Record<string, TeamId> = {
  red_bull: 'redbull',
  cadillac: 'cadillac',
  ferrari: 'ferrari',
  mclaren: 'mclaren',
  mercedes: 'mercedes',
  aston_martin: 'astonmartin',
  alpine: 'alpine',
  rb: 'racingbulls',
  sauber: 'audi', // Legacy: preserved in A4.3a
  audi: 'audi',
  haas: 'haas',
  williams: 'williams',
};

/**
 * Maps external API constructor ID to canonical internal TeamId.
 * Falls back to UNKNOWN_TEAM_ID ('unknown') when unmapped.
 */
export function mapConstructorId(constructorId: string | undefined): TeamId {
  if (constructorId && CONSTRUCTOR_MAP[constructorId]) {
    return CONSTRUCTOR_MAP[constructorId];
  }
  // Never credit an unmapped constructor to another team: park under 'unknown'.
  if (typeof console !== 'undefined') {
    console.warn(`Unmapped constructorId "${constructorId ?? ''}", falling back to 'unknown'.`);
  }
  return UNKNOWN_TEAM_ID;
}

/**
 * Pure Domain Normalizer implementing IConstructorNormalizer contract.
 */
export const constructorNormalizer: IConstructorNormalizer = {
  normalize(rawConstructorId: string | undefined): TeamId {
    return mapConstructorId(rawConstructorId);
  },
};
