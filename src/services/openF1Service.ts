/**
 * OpenF1 Real-Time & Replay Data Service
 * Backward compatibility facade delegating to Championship Infrastructure Layer.
 */

import {
  openF1Adapter,
  CURATED_REPLAY_RACES,
  OpenF1Adapter,
  type OpenF1Session,
  type OpenF1Driver,
  type OpenF1Location,
  type OpenF1CarData,
  type OpenF1Position,
  type OpenF1RaceControl,
  type OpenF1DriverState,
  type OpenF1Bounds,
  type CuratedReplayRace,
  type OpenF1ErrorCode,
} from '../features/championship/infrastructure';

export type {
  OpenF1Session,
  OpenF1Driver,
  OpenF1Location,
  OpenF1CarData,
  OpenF1Position,
  OpenF1RaceControl,
  OpenF1DriverState,
  OpenF1Bounds,
  CuratedReplayRace,
  OpenF1ErrorCode,
};

export { CURATED_REPLAY_RACES, OpenF1Adapter };

/**
 * Singleton service instance delegated to the infrastructure adapter.
 */
export const openF1Service = openF1Adapter;
