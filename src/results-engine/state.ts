// src/results-engine/state.ts

import { SessionState, SessionType, CalendarEvent, SessionDefinition } from "./types";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

/**
 * Represents the persisted state of a session.
 */
export interface SessionContext {
  eventId: string;
  sessionId: string;
  type: SessionType;
  state: SessionState;
  lastUpdateUtc: string; // ISO timestamp of last state transition
  // optional fields for storing provisional/final result IDs
  provisionalResultId?: string;
  finalResultId?: string;
}

/**
 * Load persisted state map from JSON file. If file does not exist, returns empty map.
 */
export function loadState(): Record<string, SessionContext> {
  const statePath = join(process.cwd(), "src", "results-engine", "state.json");
  try {
    const raw = readFileSync(statePath, { encoding: "utf-8" });
    return JSON.parse(raw) as Record<string, SessionContext>;
  } catch {
    return {};
  }
}

/**
 * Persist the full state map back to disk.
 */
export function saveState(state: Record<string, SessionContext>): void {
  const statePath = join(process.cwd(), "src", "results-engine", "state.json");
  writeFileSync(statePath, JSON.stringify(state, null, 2), { encoding: "utf-8" });
}

/**
 * Initialise a session entry based on the calendar definition.
 */
export function initSession(event: CalendarEvent, def: SessionDefinition): SessionContext {
  const ctx: SessionContext = {
    eventId: event.eventId,
    sessionId: def.sessionId,
    type: def.type as SessionType,
    state: SessionState.SCHEDULED,
    lastUpdateUtc: new Date().toISOString(),
  };
  return ctx;
}

/**
 * Transition a session to a new state, updating timestamps.
 */
export function transitionSession(
  state: Record<string, SessionContext>,
  sessionId: string,
  newState: SessionState
): void {
  const ctx = state[sessionId];
  if (!ctx) throw new Error(`Session ${sessionId} not found in state`);
  ctx.state = newState;
  ctx.lastUpdateUtc = new Date().toISOString();
}
