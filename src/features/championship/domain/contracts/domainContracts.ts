import { SeasonYear, TeamId } from '../../../../types';

/**
 * PURE DOMAIN CONTRACTS — CHAMPIONSHIP & CORE DATA ENGINE
 *
 * Strictly adheres to Clean Architecture:
 * - 100% Pure TypeScript.
 * - Zero external framework dependencies (No React, Zustand, Three.js, fetch, localStorage).
 * - Represents enterprise business rules and domain entities for Formula 1 championships.
 */

// --- 1. Domain Primitive Identifiers ---
export type DriverId = string;
export type ConstructorId = TeamId;

export type SessionType =
  'fp1' | 'fp2' | 'fp3' | 'qualifying' | 'sprint_qualifying' | 'sprint' | 'race';

export type SessionClassificationStatus =
  'Finished' | 'Lapped' | 'DNF' | 'DNS' | 'DSQ' | 'NC' | string;

export type RaceEventStatus = 'completed' | 'scheduled' | 'live' | 'cancelled' | 'suspended';

export type ClassificationProvenance = 'official' | 'provisional' | 'baseline' | 'synthesized';

// --- 2. Domain Entities ---

export interface DriverEntity {
  readonly id: DriverId;
  readonly fullName: string;
  readonly code: string;
  readonly permanentNumber?: number;
  readonly countryFlag: string;
  readonly currentTeamId: ConstructorId;
}

export interface ConstructorEntity {
  readonly id: ConstructorId;
  readonly name: string;
  readonly fullName: string;
  readonly powerUnit: string;
  readonly activeSeasons: readonly SeasonYear[];
}

export interface FastestLapInfo {
  readonly driverId: DriverId;
  readonly driverName: string;
  readonly teamName: string;
  readonly lapTime: string;
  readonly lapNumber?: number;
}

export interface RaceWinnerInfo {
  readonly driverName: string;
  readonly teamName: string;
  readonly time: string;
}

export interface RaceClassificationEntry {
  readonly position: number;
  readonly driverId: DriverId;
  readonly driverName: string;
  readonly driverCode: string;
  readonly driverNumber?: number;
  readonly teamId: ConstructorId;
  readonly teamName: string;
  readonly laps: number;
  readonly status: SessionClassificationStatus;
  readonly timeOrGap: string;
  readonly points: number;
  readonly fastestLap?: boolean;
  readonly fastestLapTime?: string;
  readonly gridPosition?: number;
}

export interface SprintClassificationEntry {
  readonly position: number;
  readonly driverId: DriverId;
  readonly driverName: string;
  readonly driverCode: string;
  readonly driverNumber?: number;
  readonly teamId: ConstructorId;
  readonly teamName: string;
  readonly laps: number;
  readonly status: SessionClassificationStatus;
  readonly timeOrGap: string;
  readonly points: number;
  readonly gridPosition?: number;
}

export interface RaceSession {
  readonly id: string;
  readonly season: SeasonYear;
  readonly round: number;
  readonly grandPrix: string;
  readonly officialName: string;
  readonly circuit: string;
  readonly location?: string;
  readonly country?: string;
  readonly date: string;
  readonly status: RaceEventStatus;
  readonly lapsTotal: number;
  readonly winner?: RaceWinnerInfo;
  readonly fastestLap?: FastestLapInfo;
  readonly entries: readonly RaceClassificationEntry[];
  readonly sprintEntries?: readonly SprintClassificationEntry[];
  readonly sprintProvenance?: ClassificationProvenance;
  readonly dataSource?: string;
  readonly dataUpdatedAt?: string;
  readonly isSynthesized?: boolean;
}

export interface DriverStandingEntity {
  readonly rank: number;
  readonly driverId: DriverId;
  readonly driverName: string;
  readonly driverCode: string;
  readonly teamId: ConstructorId;
  readonly teamName: string;
  readonly points: number;
  readonly wins: number;
  readonly podiums: number;
  readonly countryFlag: string;
}

export interface ConstructorStandingEntity {
  readonly rank: number;
  readonly teamId: ConstructorId;
  readonly teamName: string;
  readonly points: number;
  readonly wins: number;
  readonly podiums: number;
  readonly engine: string;
}

export interface SeasonStandingsEntity {
  readonly season: SeasonYear;
  readonly drivers: readonly DriverStandingEntity[];
  readonly constructors: readonly ConstructorStandingEntity[];
  readonly isFinal: boolean;
  readonly calculatedAt?: string;
}

// --- 3. Domain Rules & Engine Contracts (Ports) ---

export interface IFiaScoringRules {
  /**
   * Calculate standard Grand Prix race points for a given finishing position.
   * Handles race distance thresholds (e.g. 25%, 50%, 75%).
   */
  getRacePoints(position: number, distancePercentage?: number): number;

  /**
   * Calculate Sprint race points for a finishing position (P1..P8: 8..1).
   */
  getSprintPoints(position: number): number;

  /**
   * Determine fastest lap bonus points based on season regulations.
   * - 2024: 1 point if in top 10.
   * - 2025 onwards: 0 points (abolished by FIA WMSC).
   */
  getFastestLapBonus(season: SeasonYear, position: number, hasFastestLap: boolean): number;
}

export interface ICountbackComparator {
  /**
   * Compares two drivers according to FIA Sporting Regulations countback criteria.
   * Order: Points -> Race finishes (P1, P2... down to lowest classified finish).
   */
  compareDrivers(
    a: DriverStandingEntity,
    b: DriverStandingEntity,
    driverFinishHistograms: ReadonlyMap<DriverId, readonly number[]>,
    qualifyingHistograms?: ReadonlyMap<DriverId, readonly number[]>,
  ): number;

  /**
   * Compares two constructors according to FIA Sporting Regulations countback criteria.
   */
  compareConstructors(
    a: ConstructorStandingEntity,
    b: ConstructorStandingEntity,
    teamFinishHistograms: ReadonlyMap<ConstructorId, readonly number[]>,
    qualifyingHistograms?: ReadonlyMap<ConstructorId, readonly number[]>,
  ): number;
}

export interface IStandingsCalculator {
  /**
   * Recalculates Driver and Constructor Championship standings dynamically.
   */
  calculate(
    season: SeasonYear,
    races: readonly (RaceSession | any)[],
    baseDrivers?: readonly DriverStandingEntity[],
    baseConstructors?: readonly ConstructorStandingEntity[],
  ): SeasonStandingsEntity;
}

export interface IConstructorNormalizer {
  /**
   * Canonicalizes external API / historical constructor aliases to strongly-typed TeamId.
   * Must be season-aware to avoid mapping pre-2026 Sauber to Audi.
   */
  normalize(rawConstructorId: string | undefined, season?: SeasonYear): ConstructorId;
}

export interface IDriverNormalizer {
  /**
   * Normalizes external API driver identifiers to canonical driver IDs.
   */
  normalize(rawDriverId: string | undefined, season?: SeasonYear): DriverId;
}
