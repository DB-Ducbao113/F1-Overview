import { SeasonYear } from '../../../types';
import { IFiaScoringRules } from './contracts/domainContracts';

/**
 * PURE DOMAIN RULES: FIA SCORING ENGINE
 *
 * Implements authoritative FIA Formula 1 sporting regulation points tables:
 * - Grand Prix race points (Top 10: 25, 18, 15, 12, 10, 8, 6, 4, 2, 1)
 * - Sprint race points (Top 8: 8, 7, 6, 5, 4, 3, 2, 1)
 * - Fastest lap bonus point (1 pt in 2024 if in top 10; abolished from 2025 onwards)
 *
 * Pure TypeScript — zero dependencies on React, Zustand, DOM, fetch or localStorage.
 */

export const FIA_RACE_POINTS: readonly number[] = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];

export const FIA_SPRINT_POINTS: readonly number[] = [8, 7, 6, 5, 4, 3, 2, 1];

/**
 * Legacy alias for sprint points array to preserve 100% backward compatibility.
 */
export const SPRINT_POINTS_BY_POSITION: readonly number[] = FIA_SPRINT_POINTS;

/**
 * Returns standard race points for a classified finishing position.
 */
export function racePointsForPosition(position: number): number {
  if (position >= 1 && position <= 10) {
    return FIA_RACE_POINTS[position - 1];
  }
  return 0;
}

/**
 * Returns Sprint points for a classified finishing position.
 * Respects official points if already assigned.
 */
export function sprintPointsForPosition(position: number, official?: number): number {
  if (Number.isFinite(official)) return official as number;
  if (position >= 1 && position <= 8) return FIA_SPRINT_POINTS[position - 1];
  return 0;
}

/**
 * Fastest-lap bonus point rule:
 * - 2024: +1 point only for top-10 finisher holding fastest lap (FIA Sporting Regs 2024 Art. 6.4).
 * - 2025 onwards: 0 points (Abolished by FIA World Motor Sport Council in October 2024).
 */
export function fastestLapBonusPoints(
  season: SeasonYear,
  position: number,
  hasFastestLap: boolean,
): number {
  if (season !== 2024) return 0;
  return hasFastestLap && position >= 1 && position <= 10 ? 1 : 0;
}

/**
 * Pure Domain Service implementing IFiaScoringRules contract.
 */
export const fiaScoringRules: IFiaScoringRules = {
  getRacePoints(position: number): number {
    return racePointsForPosition(position);
  },
  getSprintPoints(position: number): number {
    return sprintPointsForPosition(position);
  },
  getFastestLapBonus(season: SeasonYear, position: number, hasFastestLap: boolean): number {
    return fastestLapBonusPoints(season, position, hasFastestLap);
  },
};
