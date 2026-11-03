import { DetailedRaceResult, F1SyncMetadata, SeasonYear } from '../../../../types';

/**
 * INFRASTRUCTURE CONTRACTS — CHAMPIONSHIP & CORE DATA ENGINE
 *
 * Defines explicit abstraction boundaries for external I/O:
 * - External HTTP APIs (Jolpica / Ergast, OpenF1).
 * - Browser persistence (localStorage).
 *
 * Guarantees:
 * - Domain layer has zero knowledge of these contracts or implementations.
 * - Application layer depends on these abstractions (Dependency Inversion).
 * - Infrastructure layer implements these contracts.
 */

// ── 1. Jolpica API Adapter Contracts ──

export interface RawJolpicaDriver {
  driverId: string;
  code?: string;
  permanentNumber?: string;
  givenName?: string;
  familyName?: string;
  nationality?: string;
}

export interface RawJolpicaConstructor {
  constructorId: string;
  name: string;
  nationality?: string;
}

export interface RawJolpicaResultEntry {
  number?: string;
  position: string;
  positionText?: string;
  points: string;
  Driver: RawJolpicaDriver;
  Constructor: RawJolpicaConstructor;
  grid?: string;
  laps?: string;
  status?: string;
  Time?: {
    millis?: string;
    time?: string;
  };
  FastestLap?: {
    rank?: string;
    lap?: string;
    Time?: {
      time?: string;
    };
  };
}

export interface RawJolpicaRace {
  season: string;
  round: string;
  url?: string;
  raceName: string;
  Circuit?: {
    circuitId?: string;
    circuitName?: string;
    Location?: {
      locality?: string;
      country?: string;
    };
  };
  date: string;
  time?: string;
  Results?: RawJolpicaResultEntry[];
  SprintResults?: RawJolpicaResultEntry[];
}

export interface RawJolpicaResponse {
  MRData?: {
    xmlns?: string;
    series?: string;
    url?: string;
    limit?: string;
    offset?: string;
    total?: string;
    RaceTable?: {
      season?: string;
      round?: string;
      Races?: RawJolpicaRace[];
    };
  };
}

export type JolpicaFetchType = 'results' | 'sprint';

export interface IJolpicaAdapter {
  buildUrl(season: SeasonYear, type: JolpicaFetchType, limit: number, offset: number): string;
  fetchPage(url: string): Promise<Response>;
  fetchAllRaces(season: SeasonYear, type?: JolpicaFetchType): Promise<RawJolpicaRace[]>;
}

// ── 2. OpenF1 API Adapter Contracts ──

export interface OpenF1Session {
  session_key: number;
  session_name: string;
  session_type: string;
  circuit_short_name: string;
  country_name: string;
  country_code: string;
  location: string;
  year: number;
  date_start: string;
  date_end: string;
}

export interface OpenF1Driver {
  driver_number: number;
  name_acronym: string;
  broadcast_name: string;
  full_name: string;
  team_name: string;
  team_colour: string;
  headshot_url?: string;
}

export interface OpenF1Location {
  driver_number: number;
  x: number;
  y: number;
  z: number;
  date: string;
}

export interface OpenF1CarData {
  driver_number: number;
  speed: number;
  gear: number;
  drs: number;
  rpm?: number;
  throttle?: number;
  brake?: number;
  date?: string;
}

export interface OpenF1Position {
  driver_number: number;
  position: number;
  date: string;
}

export interface OpenF1RaceControl {
  category: string;
  flag?: 'GREEN' | 'YELLOW' | 'RED' | 'CHEQUERED' | 'BLACK' | null;
  message: string;
  scope?: string | null;
  sector?: number | null;
  date: string;
}

export interface OpenF1DriverState {
  driver: OpenF1Driver;
  position: number;
  x: number;
  y: number;
  speed: number;
  gear: number;
  drs: boolean;
  gapSec?: number;
}

export interface OpenF1Bounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  spanX: number;
  spanY: number;
}

export interface CuratedReplayRace {
  id: string;
  name: string;
  circuitName: string;
  circuitKey: number;
  sessionKey: number;
  year: number;
  dateStart: string;
  dateEnd: string;
  sampleStartTime: string;
}

export type OpenF1ErrorCode =
  'ok' | 'proxy-error' | 'upstream-rate-limited' | 'upstream-down' | 'timeout' | null;

export interface IOpenF1Adapter {
  readonly lastErrorCode: OpenF1ErrorCode;
  getLatestSession(): Promise<OpenF1Session | null>;
  getSessionDrivers(sessionKey: number): Promise<OpenF1Driver[]>;
  getLocationWindow(
    sessionKey: number,
    dateStartIso: string,
    dateEndIso: string,
  ): Promise<OpenF1Location[]>;
  getCarDataWindow(
    sessionKey: number,
    dateStartIso: string,
    dateEndIso: string,
  ): Promise<OpenF1CarData[]>;
  getPositions(sessionKey: number): Promise<OpenF1Position[]>;
  getRaceControl(sessionKey: number): Promise<OpenF1RaceControl[]>;
}

// ── 3. Browser Storage Repository Contracts ──

export interface ChampionshipStorageKeys {
  readonly detailedResults: string;
  readonly syncMeta: string;
  readonly syncReview: string;
  readonly dismissedReview: string;
}

export interface IChampionshipStorage {
  readonly keys: ChampionshipStorageKeys;
  loadRawDetailedResults(): Record<SeasonYear, DetailedRaceResult[]> | null;
  persistRawDetailedResults(data: Record<SeasonYear, DetailedRaceResult[]>): void;
  loadSyncMetadata(): F1SyncMetadata | null;
  persistSyncMetadata(meta: F1SyncMetadata): void;
  clearStaleSyncReview(): void;
}
