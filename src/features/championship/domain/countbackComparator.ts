import { DetailedRaceResult, DetailedRaceResultEntry, UNKNOWN_TEAM_ID } from '../../../types';
import {
  DriverStandingEntity,
  ConstructorStandingEntity,
  ICountbackComparator,
} from './contracts/domainContracts';

/**
 * PURE DOMAIN: COUNTBACK COMPARATOR & TIE-BREAKER ENGINE
 *
 * Authoritative Regulatory Reference:
 * - 2026 FIA Formula One General Regulatory Provisions, Section A, Issue 03, Article A2.1.4(c).
 * - 2024/2025 FIA Formula One Sporting Regulations, Article 7.2.
 *
 * Rules:
 * 1. Points DESC: The competitor with the greatest number of points finishes higher.
 * 2. Wins (P1) DESC: If points are equal, greatest number of 1st places in standard competitions (Grands Prix).
 * 3. Race Finish Countback (P2..P[max]): If wins are equal, greatest number of 2nd places, 3rd places,
 *    and so on across ALL valid classified finishing positions until a winner emerges.
 *    - Does NOT truncate arbitrarily at P10.
 *    - Does NOT use total podiums as an independent fallback.
 *    - Sprints are not standard competitions (Grands Prix) under Article A2.1.4(c); sprint finishing
 *      positions are strictly excluded from Race finish countback.
 * 4. Qualifying Countback: If race finish countback cannot resolve a tie, countback of qualifying
 *    results is evaluated if qualifying data is available.
 * 5. Unresolved Dead Heat & Data Limitation Handling:
 *    Under FIA Article A2.1.4(c)(iv), ties that cannot be broken by race finishes (and qualifying)
 *    are decided by the FIA according to such criteria as it shall think fit.
 *    When qualifying session data or an FIA nomination is unavailable in domain inputs,
 *    this limitation is documented, and the engine preserves official baseline ranking (or deterministic
 *    identifier ordering) for UI stability without claiming authoritative FIA resolution.
 *
 * Pure TypeScript — zero dependencies on React, Zustand, DOM, fetch or localStorage.
 */

export const DEFAULT_MAX_POSITION = 24;

export const zerosHistogram = (maxPosition: number = DEFAULT_MAX_POSITION): number[] =>
  new Array(Math.max(1, maxPosition) + 1).fill(0);

/**
 * Validates whether a race classification entry constitutes a valid classified finish.
 * In FIA regulations, Did Not Start (DNS) and Disqualified (DSQ) do not count as classified finishes.
 */
export function isValidClassifiedFinish(position: number, status?: string): boolean {
  if (typeof position !== 'number' || !Number.isInteger(position) || position < 1) {
    return false;
  }
  if (status) {
    const s = status.trim().toUpperCase();
    if (
      s.startsWith('DSQ') ||
      s.startsWith('DNS') ||
      s === 'DISQUALIFIED' ||
      s === 'DID NOT START'
    ) {
      return false;
    }
  }
  return true;
}

/**
 * Tally Grand Prix finishing positions into unbounded histograms for drivers and constructors.
 * Sprints are excluded from Grand Prix finish countback.
 */
export function buildCountbackHistograms(races: readonly DetailedRaceResult[]): {
  driverHistograms: Map<string, number[]>;
  teamHistograms: Map<string, number[]>;
} {
  const driverHistograms = new Map<string, number[]>();
  const teamHistograms = new Map<string, number[]>();

  const tally = (map: Map<string, number[]>, key: string, position: number, status?: string) => {
    if (!isValidClassifiedFinish(position, status)) return;

    let hist = map.get(key);
    if (!hist) {
      hist = zerosHistogram(Math.max(DEFAULT_MAX_POSITION, position));
      map.set(key, hist);
    } else if (position >= hist.length) {
      const next = new Array(position + 1).fill(0);
      for (let i = 0; i < hist.length; i++) next[i] = hist[i];
      hist = next;
      map.set(key, hist);
    }
    hist[position] += 1;
  };

  (Array.isArray(races) ? races : [])
    .filter((r) => r && !r.isSynthesized)
    .forEach((race) => {
      const entries: DetailedRaceResultEntry[] =
        race.status === 'completed' && Array.isArray(race.entries) ? race.entries : [];

      // FIA countback uses Grand Prix finishes only: sprint positions never
      // decide ties, for drivers or constructors.
      entries.forEach((entry: DetailedRaceResultEntry) => {
        if (!entry) return;
        if (entry.driverId && entry.driverId !== 'unknown') {
          tally(driverHistograms, entry.driverId, entry.position, entry.status);
        }
        if (entry.teamId && entry.teamId !== UNKNOWN_TEAM_ID) {
          tally(teamHistograms, entry.teamId, entry.position, entry.status);
        }
      });
    });

  return { driverHistograms, teamHistograms };
}

export interface CountbackCompetitor {
  points: number;
  wins: number;
  podiums?: number;
  rank?: number;
  driverId?: string;
  teamId?: string;
  id?: string;
}

/**
 * Core countback comparator implementing FIA Article A2.1.4(c):
 * Points DESC -> Wins DESC -> P2..P[max] finishes DESC -> Qualifying countback -> Baseline Rank / Stable ID
 */
export function compareCountback(
  a: CountbackCompetitor,
  b: CountbackCompetitor,
  histA: readonly number[] = zerosHistogram(),
  histB: readonly number[] = zerosHistogram(),
  qualiHistA?: readonly number[],
  qualiHistB?: readonly number[],
): number {
  // 1. Points DESC
  if (b.points !== a.points) return b.points - a.points;

  // 2. Wins (P1) DESC (incorporates baseline wins as well)
  if (b.wins !== a.wins) return b.wins - a.wins;

  // 3. Race Countback across ALL classified positions starting from P2
  const maxPos = Math.max(histA.length, histB.length) - 1;
  for (let pos = 2; pos <= maxPos; pos++) {
    const countA = histA[pos] || 0;
    const countB = histB[pos] || 0;
    if (countB !== countA) {
      return countB - countA;
    }
  }

  // 4. Qualifying countback (FIA Article A2.1.4(c)(iv)) if qualifying histograms are provided
  if (qualiHistA && qualiHistB && (qualiHistA.length > 1 || qualiHistB.length > 1)) {
    const maxQualiPos = Math.max(qualiHistA.length, qualiHistB.length) - 1;
    for (let pos = 1; pos <= maxQualiPos; pos++) {
      const qCountA = qualiHistA[pos] || 0;
      const qCountB = qualiHistB[pos] || 0;
      if (qCountB !== qCountA) {
        return qCountB - qCountA;
      }
    }
  }

  // 5. Unresolved Dead Heat & Data Limitation Handling:
  // Under FIA Article A2.1.4(c)(iv), if Race finishes and Qualifying countback fail to break a tie,
  // the FIA nominates the winner. When official nomination / qualifying data is unavailable,
  // preserve existing official baseline rank if present, or sort deterministically by ID.
  if (typeof a.rank === 'number' && typeof b.rank === 'number' && a.rank !== b.rank) {
    return a.rank - b.rank;
  }

  const idA = a.driverId || a.teamId || a.id || '';
  const idB = b.driverId || b.teamId || b.id || '';
  if (idA && idB && idA !== idB) {
    return idA.localeCompare(idB);
  }

  return 0;
}

/**
 * Pure Domain Comparator implementing ICountbackComparator contract.
 */
export const countbackComparator: ICountbackComparator = {
  compareDrivers(
    a: DriverStandingEntity,
    b: DriverStandingEntity,
    driverHistograms: ReadonlyMap<string, readonly number[]>,
    qualifyingHistograms?: ReadonlyMap<string, readonly number[]>,
  ): number {
    const histA = (driverHistograms.get(a.driverId) as number[]) || zerosHistogram();
    const histB = (driverHistograms.get(b.driverId) as number[]) || zerosHistogram();
    const qHistA = qualifyingHistograms?.get(a.driverId);
    const qHistB = qualifyingHistograms?.get(b.driverId);
    return compareCountback(a, b, histA, histB, qHistA, qHistB);
  },
  compareConstructors(
    a: ConstructorStandingEntity,
    b: ConstructorStandingEntity,
    teamHistograms: ReadonlyMap<string, readonly number[]>,
    qualifyingHistograms?: ReadonlyMap<string, readonly number[]>,
  ): number {
    const histA = (teamHistograms.get(a.teamId) as number[]) || zerosHistogram();
    const histB = (teamHistograms.get(b.teamId) as number[]) || zerosHistogram();
    const qHistA = qualifyingHistograms?.get(a.teamId);
    const qHistB = qualifyingHistograms?.get(b.teamId);
    return compareCountback(a, b, histA, histB, qHistA, qHistB);
  },
};
