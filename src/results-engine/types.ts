// src/results-engine/types.ts

/**
 * Core enumerations and interfaces for the Podium EDS Results Engine.
 */
export enum SessionType {
  Practice = "Practice",
  Qualifying = "Qualifying",
  Sprint = "Sprint",
  SprintQualifying = "SprintQualifying",
  Race = "Race",
}

export enum SessionState {
  SCHEDULED = "SCHEDULED",
  RUNNING = "RUNNING",
  FINISHED = "FINISHED",
  RESULT_PENDING = "RESULT_PENDING",
  PROVISIONAL = "PROVISIONAL",
  FINAL = "FINAL",
  CORRECTED = "CORRECTED",
}

/**
 * Minimal driver identifier – in production this would map to a FIA driver ID.
 */
export interface Driver {
  driverId: string; // e.g., "max_verstappen"
  fullName: string;
  country: string;
}

/**
 * Result of a single driver in a session.
 */
export interface DriverResult {
  driver: Driver;
  position: number | null; // null for DNFs etc.
  laps?: number;
  time?: string; // e.g., "1:31.456"
  points?: number;
  status?: string; // "Finished", "Disqualified", etc.
  penalties?: string[];
}

/**
 * Complete session result payload.
 */
export interface SessionResult {
  eventId: string; // matches CalendarEvent.eventId
  sessionId: string;
  type: SessionType;
  startUtc: string; // ISO timestamp
  endUtc: string; // ISO timestamp
  driverResults: DriverResult[];
  sourceLicense: "APPROVED" | "RESTRICTED" | "UNKNOWN";
}

/**
 * Calendar definitions – static JSON file `calendar.json` loads these.
 */
export interface SessionDefinition {
  type: SessionType;
  sessionId: string;
  scheduledStartUtc: string; // ISO
  durationMinutes: number;
}

export interface CalendarEvent {
  eventId: string;
  name: string;
  sessions: SessionDefinition[];
}

/**
 * Verification report – deterministic checks for factual fields.
 */
export interface VerificationReport {
  valid: boolean;
  errors: string[];
  warnings?: string[];
}
