/**
 * OpenF1 Live Telemetry & Track Visualization Types
 * Strictly aligned with OpenF1 API v1 (api.openf1.org)
 */

export type LiveState = 'live' | 'upcoming' | 'replay';

export interface OpenF1SessionRaw {
  session_key: number;
  session_name: string;
  meeting_key: number;
  circuit_key: number;
  circuit_short_name: string;
  country_name: string;
  country_code: string;
  location: string;
  date_start: string;
  date_end: string;
  gmt_offset: string;
  year: number;
}

export interface LiveSessionResponse {
  state: LiveState;
  session: OpenF1SessionRaw | null;
  server_time: string;
  is_fallback?: boolean;
}

export interface LiveCarPosition {
  driver_number: number;
  x: number;
  y: number;
  z?: number;
  date: string;
}

export interface LiveTrackResponse {
  session_key: number;
  sampled_at: string;
  is_replay: boolean;
  cars: LiveCarPosition[];
}

export type TyreCompound = 'SOFT' | 'MEDIUM' | 'HARD' | 'INTERMEDIATE' | 'WET' | 'UNKNOWN';

export interface LiveDriverTelemetry {
  speed: number;       // km/h (from /v1/car_data)
  gear: number;        // 1-8
  drs: boolean;        // true if DRS open (10, 12, 14 in raw telemetry)
  throttle?: number;   // 0-100%
  brake?: number;      // 0-100%
  rpm?: number;
}

export interface LiveTimingRow {
  position: number;
  driver_number: number;
  broadcast_name: string;
  name_acronym: string;
  team_name: string;
  team_colour: string;
  gap_to_leader: string | null;  // e.g. "+3.421" or "LEADER"
  interval: string | null;       // e.g. "+0.312"
  best_lap: string | null;       // e.g. "1:19.813"
  last_lap: string | null;
  in_pit: boolean;
  sectors: [string | null, string | null, string | null];
  tyre: {
    compound: TyreCompound;
    laps_used: number;
  };
  telemetry?: LiveDriverTelemetry;
}

export interface LiveTimingResponse {
  session_key: number;
  sampled_at: string;
  tower: LiveTimingRow[];
  fastest_lap?: {
    driver_number: number;
    driver_name: string;
    time: string;
  };
}

export type FlagColor = 'GREEN' | 'YELLOW' | 'DOUBLE_YELLOW' | 'RED' | 'SAFETY_CAR' | 'VSC' | 'CLEAR';

export interface LiveRaceControlMessage {
  date: string;
  category: string;
  message: string;
  flag?: string;
  scope?: string;
  sector?: number;
}

export interface LiveControlResponse {
  session_key: number;
  active_flag: FlagColor;
  messages: LiveRaceControlMessage[];
}

export interface CircuitBounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  rotate?: number;   // degrees, if track needs rotation
  mirrorX?: boolean; // if track needs horizontal mirror
  mirrorY?: boolean;
}
