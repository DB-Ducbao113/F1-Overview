// src/results-engine/provider.ts

import { SessionResult, SessionType } from "./types";
import { readFileSync } from "fs";
import { join } from "path";

/**
 * Abstract interface for a results data provider.
 */
export interface ResultsProvider {
  /**
   * Fetch the latest session data for the given sessionId.
   * Should return a {@link SessionResult} or throw on failure.
   */
  fetchSessionData(sessionId: string): Promise<SessionResult>;

  /**
   * Optional: fetch an official FIA document (e.g., PDF/JSON) for the session.
   * Returns the URL or null if not available.
   */
  fetchOfficialDocument?(sessionId: string): Promise<string | null>;
}

/**
 * Simple synthetic provider that returns a static JSON fixture stored under
 * `src/results-engine/fixtures/`. This is safe for offline testing and
 * commercial‑use‑safe because the data is owned by the project.
 */
export class FixtureProvider implements ResultsProvider {
  async fetchSessionData(sessionId: string): Promise<SessionResult> {
    const fixturePath = join(process.cwd(), "src", "results-engine", "fixtures", `${sessionId}.json`);
    const raw = readFileSync(fixturePath, { encoding: "utf-8" });
    return JSON.parse(raw) as SessionResult;
  }
}
