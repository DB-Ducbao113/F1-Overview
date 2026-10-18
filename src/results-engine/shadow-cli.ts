import { readFileSync } from 'node:fs';
import {
  appendShadowEvidence,
  loadShadowState,
  metricsFor,
  observeOpenF1Session,
  saveShadowState,
} from './shadow.ts';

function readArgument(name: string): string | undefined {
  const index = process.argv.indexOf(name);
  return index === -1 ? undefined : process.argv[index + 1];
}

const eventId = requiredArgument('--event');
const sessionId = requiredArgument('--session');
const scheduledEndUtc = requiredArgument('--scheduled-end');
const evidencePath = readArgument('--evidence');
const sessionKey = readArgument('--openf1-session-key');
if (!evidencePath && sessionKey === undefined)
  throw new Error('Provide --evidence or --openf1-session-key');
let state = loadShadowState(readArgument('--state'));
const evidence = readEvidenceFile(evidencePath);
if (sessionKey !== undefined) {
  evidence.push(
    ...(await observeOpenF1Session({
      sessionKey: Number(sessionKey),
      observedAtUtc: new Date().toISOString(),
    })),
  );
}
for (const item of evidence)
  state = appendShadowEvidence(state, { eventId, sessionId, scheduledEndUtc }, item).state;
if (state.sessions[sessionId]) saveShadowState(state, readArgument('--state'));
console.log(
  JSON.stringify(
    {
      observationsRecorded: evidence.length,
      metrics: state.sessions[sessionId] ? metricsFor(state.sessions[sessionId]) : null,
    },
    null,
    2,
  ),
);

function requiredArgument(name: string): string {
  const value = readArgument(name);
  if (!value) throw new Error(`${name} is required`);
  return value;
}

function readEvidenceFile(path: string | undefined): unknown[] {
  if (!path) return [];
  const value: unknown = JSON.parse(readFileSync(path, 'utf8'));
  if (!Array.isArray(value)) throw new Error('--evidence must contain a JSON array');
  return value;
}
