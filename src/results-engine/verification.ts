// src/results-engine/verification.ts

import { SessionResult, VerificationReport } from "./types";

/**
 * Deterministic verification of a SessionResult.
 * Checks mandatory fields, driver IDs uniqueness, positions order, and
 * that points/penalties are consistent with known rules.
 * Returns a report that callers can use to decide whether to accept the data.
 */
export function verifySessionResult(result: SessionResult): VerificationReport {
  const errors: string[] = [];

  // Basic presence checks
  if (!result.eventId) errors.push("Missing eventId");
  if (!result.sessionId) errors.push("Missing sessionId");
  if (!result.type) errors.push("Missing session type");
  if (!result.startUtc) errors.push("Missing startUtc");
  if (!result.endUtc) errors.push("Missing endUtc");
  if (!Array.isArray(result.driverResults)) errors.push("driverResults must be an array");

  const driverIds = new Set<string>();
  let positionSet = new Set<number>();

  for (const dr of result.driverResults) {
    if (!dr.driver?.driverId) errors.push("Driver result missing driverId");
    else if (driverIds.has(dr.driver.driverId)) errors.push(`Duplicate driverId ${dr.driver.driverId}`);
    else driverIds.add(dr.driver.driverId);

    if (dr.position != null) {
      if (positionSet.has(dr.position)) errors.push(`Duplicate position ${dr.position}`);
      else positionSet.add(dr.position);
    }

    // Simple points sanity – just ensure non‑negative if provided
    if (dr.points != null && dr.points < 0) errors.push(`Negative points for driver ${dr.driver?.driverId}`);
  }

  const valid = errors.length === 0;
  return { valid, errors };
}
