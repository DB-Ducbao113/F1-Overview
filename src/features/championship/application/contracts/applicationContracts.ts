import { SeasonYear, DetailedRaceResult, F1SyncMetadata } from '../../../../types';
import { SeasonStandingsEntity } from '../../domain/contracts/domainContracts';

/**
 * APPLICATION LAYER CONTRACTS — CHAMPIONSHIP USE CASES & PORTS
 *
 * Defines the application boundaries, storage repository ports, and external data adapters.
 * Independent of presentation UI and concrete infrastructure implementations.
 */

// --- 1. Freshness & Provenance Metadata ---

export type SyncStatusType = 'idle' | 'syncing' | 'success' | 'error';

export interface DataFreshnessMetadata {
  readonly lastSyncTimestamp: string;
  readonly syncStatus: SyncStatusType;
  readonly source: string;
  readonly completedRoundsCount: number;
  readonly message?: string;
}

// --- 2. Data Adapter Ports (Secondary / Driven Ports) ---

export interface AdapterFetchResult<T> {
  readonly success: boolean;
  readonly partial?: boolean;
  readonly data: T;
  readonly message: string;
  readonly source: string;
  readonly statusCode?: number;
}

export interface IF1RaceResultsAdapter {
  /**
   * Fetches full Grand Prix race results from an external API (e.g. Jolpica/Ergast).
   */
  fetchRaceResults(
    season: SeasonYear,
    limit?: number,
    offset?: number,
  ): Promise<AdapterFetchResult<DetailedRaceResult[]>>;
}

export interface IF1SprintResultsAdapter {
  /**
   * Fetches Sprint race results from an external timing source (e.g. Jolpica or OpenF1).
   */
  fetchSprintResults(
    season: SeasonYear,
    limit?: number,
    offset?: number,
  ): Promise<AdapterFetchResult<DetailedRaceResult[]>>;
}

// --- 3. Storage Repository Port (Secondary / Driven Port) ---

export interface IChampionshipStorageRepository {
  /**
   * Loads persisted race results across all supported seasons.
   */
  loadResults(): Record<SeasonYear, DetailedRaceResult[]>;

  /**
   * Persists updated season results to underlying client storage.
   */
  saveResults(results: Record<SeasonYear, DetailedRaceResult[]>): void;

  /**
   * Retrieves synchronization metadata.
   */
  loadMetadata(): F1SyncMetadata;

  /**
   * Persists synchronization metadata.
   */
  saveMetadata(metadata: F1SyncMetadata): void;

  /**
   * Clears legacy or stale review artifacts from older application versions.
   */
  clearStaleReview(): void;
}

// --- 4. Use Case Contract (Primary / Driving Port) ---

export interface SyncSeasonUseCaseResult {
  readonly success: boolean;
  readonly partial?: boolean;
  readonly results: DetailedRaceResult[];
  readonly standings?: SeasonStandingsEntity;
  readonly message: string;
  readonly source: string;
  readonly syncMetadata: F1SyncMetadata;
}

export interface ISyncSeasonUseCase {
  /**
   * Executes season synchronization, reconciling upstream API results with local cache
   * and recalculating live standings.
   */
  execute(
    season: SeasonYear,
    existingResults: DetailedRaceResult[],
  ): Promise<SyncSeasonUseCaseResult>;
}
