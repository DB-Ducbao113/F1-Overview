import { DetailedRaceResult, DetailedRaceResultEntry } from '../../../types';
import {
  DriverStandingEntity,
  ConstructorStandingEntity,
  ICountbackComparator,
} from './contracts/domainContracts';

/**
 * PURE DOMAIN: COUNTBACK COMPARATOR & TIE-BREAKER ENGINE
 *
 * Implements finishing-position histograms and sorting comparison:
 * Order: Points DESC -> Wins (P1) DESC -> P2..P10 counts DESC -> Podiums DESC.
 *
 * NOTE (A4.3a DISCREPANCY RECORD):
 * In A4.3a, histogram tallying only covers finishing positions P1..P10, and
 * trailing fallback compares total podiums. Under full 2026 FIA General Regulations
 * Article A2.1.4(c), countback extends through all classified positions (P1..P22),
 * and ties not broken by race results fall back to qualifying results (not podiums).
 * Correcting this behavior is scheduled for Milestone A4.3b.
 *
 * Pure TypeScript — zero dependencies on React, Zustand, DOM, fetch or localStorage.
 */

export const zerosHistogram = (): number[] => new Array(11).fill(0);

/**
 * Tally Grand Prix finishing positions (P1-P10) into histograms for drivers and constructors.
 * Sprints are excluded from Grand Prix finish countback.
 */
export function buildCountbackHistograms(races: readonly DetailedRaceResult[]): {
  driverHistograms: Map<string, number[]>;
  teamHistograms: Map<string, number[]>;
} {
  const driverHistograms = new Map<string, number[]>();
  const teamHistograms = new Map<string, number[]>();

  const tally = (map: Map<string, number[]>, key: string, position: number) => {
    if (position < 1 || position > 10) return;
    let hist = map.get(key);
    if (!hist) {
      hist = zerosHistogram();
      map.set(key, hist);
    }
    hist[position] += 1;
  };

  (Array.isArray(races) ? races : [])
    .filter((r) => r && !r.isSynthesized)
    .forEach((race) => {
      const entries: DetailedRaceResultEntry[] =
        race.status === 'completed' && Array.isArray(race.entries) ? race.entries : [];
      entries.forEach((entry: DetailedRaceResultEntry) => {
        if (!entry) return;
        tally(driverHistograms, entry.driverId, entry.position);
        tally(teamHistograms, entry.teamId, entry.position);
      });
    });

  return { driverHistograms, teamHistograms };
}

/**
 * Core countback comparator matching current application behavior:
 * Points DESC -> Wins DESC -> P2 DESC -> ... -> P10 DESC -> Podiums DESC
 */
export function compareCountback(
  a: { points: number; wins: number; podiums: number },
  b: { points: number; wins: number; podiums: number },
  histA: number[] = zerosHistogram(),
  histB: number[] = zerosHistogram(),
): number {
  if (b.points !== a.points) return b.points - a.points;
  if (b.wins !== a.wins) return b.wins - a.wins;
  for (let pos = 2; pos <= 10; pos++) {
    const diff = (histB[pos] || 0) - (histA[pos] || 0);
    if (diff !== 0) return diff;
  }
  return b.podiums - a.podiums;
}

/**
 * Pure Domain Comparator implementing ICountbackComparator contract.
 */
export const countbackComparator: ICountbackComparator = {
  compareDrivers(
    a: DriverStandingEntity,
    b: DriverStandingEntity,
    driverHistograms: ReadonlyMap<string, readonly number[]>,
  ): number {
    const histA = (driverHistograms.get(a.driverId) as number[]) || zerosHistogram();
    const histB = (driverHistograms.get(b.driverId) as number[]) || zerosHistogram();
    return compareCountback(a, b, histA, histB);
  },
  compareConstructors(
    a: ConstructorStandingEntity,
    b: ConstructorStandingEntity,
    teamHistograms: ReadonlyMap<string, readonly number[]>,
  ): number {
    const histA = (teamHistograms.get(a.teamId) as number[]) || zerosHistogram();
    const histB = (teamHistograms.get(b.teamId) as number[]) || zerosHistogram();
    return compareCountback(a, b, histA, histB);
  },
};
