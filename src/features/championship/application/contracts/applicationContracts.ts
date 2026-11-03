import {
  SeasonYear,
  DetailedRaceResult,
  F1SyncMetadata,
  TeamId,
  DriverStanding,
  ConstructorStanding,
} from '../../../../types';

/**
 * APPLICATION LAYER CONTRACTS — CHAMPIONSHIP USE CASES & PORTS
 *
 * Defines application boundaries, use case contracts, and presentation identity abstractions.
 * Strictly decoupled from presentation UI and concrete infrastructure implementations.
 */

// --- 1. Presentation Identity Abstraction ---

/**
 * The canonical 11 active constructor identifiers for presentation.
 * Aligns strictly with the domain TeamId union without WebGL dependencies.
 */
export const ACTIVE_PRESENTATION_TEAMS: readonly TeamId[] = [
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
] as const;

const ACTIVE_PRESENTATION_TEAM_SET: ReadonlySet<string> = new Set<string>(
  ACTIVE_PRESENTATION_TEAMS,
);

/**
 * Presentation team identifier at the application boundary.
 * Disambiguates known active constructors from unmapped/unknown historical entrants
 * without unsafe type assertions or mutating global TeamId.
 */
export type PresentationTeamId = TeamId | 'unknown';

/**
 * Sound type guard verifying membership in the canonical set of 11 active TeamIds.
 * Strictly rejects 'unknown', empty strings, legacy aliases, and arbitrary strings.
 */
export function isKnownPresentationTeam(teamId: unknown): teamId is TeamId {
  return typeof teamId === 'string' && ACTIVE_PRESENTATION_TEAM_SET.has(teamId);
}

// --- 2. Freshness & Provenance Metadata ---

export type SyncStatusType = 'idle' | 'syncing' | 'success' | 'error';

export interface DataFreshnessMetadata {
  readonly lastSyncTimestamp: string;
  readonly syncStatus: SyncStatusType;
  readonly source: string;
  readonly completedRoundsCount: number;
  readonly message?: string;
}

// --- 3. Use Case Results & Contracts ---

export interface StandingsCalculationResult {
  readonly drivers: DriverStanding[];
  readonly constructors: ConstructorStanding[];
}

export interface ICalculateSeasonStandingsUseCase {
  execute(
    season: SeasonYear,
    races: DetailedRaceResult[],
    baseDrivers?: DriverStanding[],
    baseConstructors?: ConstructorStanding[],
  ): StandingsCalculationResult;
  computeAllInitialStandings(
    resultsMap: Record<SeasonYear, DetailedRaceResult[]>,
  ): Record<SeasonYear, StandingsCalculationResult>;
}

export interface SyncSeasonUseCaseResult {
  readonly success: boolean;
  readonly partial?: boolean;
  readonly results: DetailedRaceResult[];
  readonly standings?: StandingsCalculationResult;
  readonly message: string;
  readonly source: string;
  readonly syncMetadata: F1SyncMetadata;
}

export interface ISyncSeasonResultsUseCase {
  execute(
    season: SeasonYear,
    existingResults: DetailedRaceResult[],
    options?: {
      abortSignal?: AbortSignal;
      currentResultsMap?: Record<SeasonYear, DetailedRaceResult[]>;
      isFresh?: () => boolean;
    },
  ): Promise<SyncSeasonUseCaseResult>;
}

export interface InitialChampionshipData {
  readonly detailedResults: Record<SeasonYear, DetailedRaceResult[]>;
  readonly calculatedStandings: Record<SeasonYear, StandingsCalculationResult>;
  readonly syncMeta: F1SyncMetadata;
}

export interface ILoadInitialChampionshipDataUseCase {
  execute(): InitialChampionshipData;
}
