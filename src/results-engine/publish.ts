// src/results-engine/publish.ts

import { SessionResult } from "./types";
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import { createHash } from "crypto";

/**
 * Generate a deterministic revision ID based on the payload content.
 */
function computeRevisionId(result: SessionResult): string {
  const hash = createHash("sha256");
  hash.update(JSON.stringify(result));
  return hash.digest("hex").slice(0, 12);
}

/**
 * Persist a result record to the public output directory.
 * The file name includes the revision ID to guarantee immutability.
 */
export function publishResult(result: SessionResult): string {
  const revId = computeRevisionId(result);
  const outDir = join(process.cwd(), "public", "results");
  // Ensure directory exists (free‑tier Vercel static hosting)
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, `${result.sessionId}-${revId}.json`);
  const record = {
    revisionId: revId,
    generatedAt: new Date().toISOString(),
    sourceLicense: result.sourceLicense,
    result,
  };
  writeFileSync(outPath, JSON.stringify(record, null, 2), { encoding: "utf-8" });
  console.log(`Published result ${result.sessionId} rev ${revId}`);
  return revId;
}
