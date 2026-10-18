// src/results-engine/engine.ts

import { readFileSync } from "fs";
import { join } from "path";
import { CalendarEvent, SessionDefinition, SessionState } from "./types";
import { loadState, saveState, initSession, transitionSession, SessionContext } from "./state";
import { FixtureProvider } from "./provider";
import { verifySessionResult } from "./verification";
import { publishResult } from "./publish";

/**
 * Load the static calendar JSON.
 */
function loadCalendar(): CalendarEvent[] {
  const path = join(process.cwd(), "src", "results-engine", "calendar.json");
  const raw = readFileSync(path, { encoding: "utf-8" });
  return JSON.parse(raw) as CalendarEvent[];
}

/**
 * Determine if a session is within the initial polling window.
 * Returns true if now is after the scheduled start and before scheduledStart + 30 min.
 */
function isInInitialWindow(session: SessionDefinition, now: Date): boolean {
  const start = new Date(session.scheduledStartUtc);
  const end = new Date(start.getTime() + 30 * 60 * 1000); // 30 min after start
  return now >= start && now <= end;
}

/**
 * Determine if a session is within the follow‑up window (up to 6 h after start).
 */
function isInFollowupWindow(session: SessionDefinition, now: Date): boolean {
  const start = new Date(session.scheduledStartUtc);
  const end = new Date(start.getTime() + 6 * 60 * 60 * 1000); // 6h
  return now > start && now <= end;
}

/**
 * Main engine entry point – runs once per scheduled GitHub Action.
 */
export async function runEngine() {
  const calendar = loadCalendar();
  const now = new Date();
  const stateMap = loadState();
  const provider = new FixtureProvider();

  for (const event of calendar) {
    for (const sessDef of event.sessions) {
      const sessionKey = sessDef.sessionId;
      // Initialise state if missing
      if (!stateMap[sessionKey]) {
        stateMap[sessionKey] = initSession(event, sessDef);
      }
      const ctx = stateMap[sessionKey] as SessionContext;

      // Skip already FINAL or CORRECTED
      if (ctx.state === SessionState.FINAL || ctx.state === SessionState.CORRECTED) continue;

      // Determine which polling window we are in
      const inInitial = isInInitialWindow(sessDef, now);
      const inFollowup = isInFollowupWindow(sessDef, now);

      if (!inInitial && !inFollowup) continue; // not time to poll yet

      // Transition to RUNNING if we just passed scheduled start
      if (ctx.state === SessionState.SCHEDULED && now >= new Date(sessDef.scheduledStartUtc)) {
        transitionSession(stateMap, sessionKey, SessionState.RUNNING);
      }

      // Attempt to fetch data
      try {
        const result = await provider.fetchSessionData(sessionKey);
        const report = verifySessionResult(result);
        if (!report.valid) {
          console.warn(`Verification failed for ${sessionKey}:`, report.errors);
          // stay in RESULT_PENDING
          if (ctx.state !== SessionState.RESULT_PENDING) {
            transitionSession(stateMap, sessionKey, SessionState.RESULT_PENDING);
          }
          continue;
        }
        // Publish provisional result
        const revisionId = publishResult(result);
        ctx.provisionalResultId = revisionId;
        // Move state forward
        const newState = inInitial ? SessionState.PROVISIONAL : SessionState.FINAL;
        transitionSession(stateMap, sessionKey, newState);
        if (newState === SessionState.FINAL) {
          ctx.finalResultId = revisionId;
        }
      } catch (e) {
        console.error(`Provider error for ${sessionKey}:`, e);
        // keep current state; next run will retry
      }
    }
  }

  saveState(stateMap);
}

// If this file is executed directly (node), run the engine.
if (require.main === module) {
  runEngine().catch((e) => {
    console.error("Engine crashed:", e);
    process.exit(1);
  });
}
