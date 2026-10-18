import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

/**
 * Read-only shadow-mode evidence. This deliberately has no import from
 * publication code: collecting an observation can never publish a result.
 */
export type ShadowEvidenceKind =
  | 'ACTUAL_SESSION_END'
  | 'SOURCE_RESULT_AVAILABLE'
  | 'VALIDATED_RESULT'
  | 'FIA_PROVISIONAL'
  | 'FIA_FINAL'
  | 'FIA_CORRECTED'
  | 'SOURCE_DISAGREEMENT';

export type ShadowSource = 'openf1' | 'fia' | 'operator';

const shadowEvidenceKinds: readonly ShadowEvidenceKind[] = [
  'ACTUAL_SESSION_END',
  'SOURCE_RESULT_AVAILABLE',
  'VALIDATED_RESULT',
  'FIA_PROVISIONAL',
  'FIA_FINAL',
  'FIA_CORRECTED',
  'SOURCE_DISAGREEMENT',
];
const shadowSources: readonly ShadowSource[] = ['openf1', 'fia', 'operator'];

export interface ShadowEvidenceInput {
  kind: ShadowEvidenceKind;
  source: ShadowSource;
  /** UTC instant asserted by the source, never a scheduled timestamp. */
  occurredAtUtc: string;
  /** UTC instant the observer first saw it. */
  observedAtUtc: string;
  sourceReference: string;
  detail?: string;
}

export interface ShadowEvidence extends ShadowEvidenceInput {
  evidenceId: string;
}

export interface ShadowSessionLedger {
  eventId: string;
  sessionId: string;
  scheduledEndUtc: string;
  evidence: readonly ShadowEvidence[];
}

export interface ShadowState {
  schemaVersion: 1;
  sessions: Record<string, ShadowSessionLedger>;
}

export interface ShadowMetrics {
  actualSessionEndUtc: string | null;
  firstSourceResultAtUtc: string | null;
  firstValidatedResultAtUtc: string | null;
  officialProvisionalAtUtc: string | null;
  officialFinalAtUtc: string | null;
  sourceDisagreements: number;
  timeToFirstAvailableMinutes: number | null;
  timeToFirstValidatedMinutes: number | null;
  timeToOfficialProvisionalMinutes: number | null;
  timeToOfficialFinalMinutes: number | null;
  provisionalTarget: 'PENDING' | 'PASS' | 'FAIL';
}

export const emptyShadowState = (): ShadowState => ({ schemaVersion: 1, sessions: {} });

export function getShadowStatePath(override?: string): string {
  return resolve(
    override ?? process.env.RESULTS_ENGINE_SHADOW_STATE_PATH ?? '.results-engine/shadow-state.json',
  );
}

/** Missing local evidence starts clean; malformed evidence is never silently discarded. */
export function loadShadowState(path?: string): ShadowState {
  try {
    const parsed: unknown = JSON.parse(readFileSync(getShadowStatePath(path), 'utf8'));
    if (!isShadowState(parsed)) throw new Error('shadow state schema is invalid');
    return parsed;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return emptyShadowState();
    throw error;
  }
}

/** Atomic replacement avoids partial evidence writes if the observer is interrupted. */
export function saveShadowState(state: ShadowState, path?: string): void {
  const target = getShadowStatePath(path);
  mkdirSync(dirname(target), { recursive: true });
  const temporary = `${target}.${process.pid}.tmp`;
  writeFileSync(temporary, `${JSON.stringify(state, null, 2)}\n`, 'utf8');
  renameSync(temporary, target);
}

/**
 * Adds immutable evidence exactly once. Repeated fetches of the same source
 * observation are idempotent; changed or late observations get a new record.
 */
export function appendShadowEvidence(
  state: ShadowState,
  session: Pick<ShadowSessionLedger, 'eventId' | 'sessionId' | 'scheduledEndUtc'>,
  input: unknown,
): { state: ShadowState; duplicate: boolean; evidence: ShadowEvidence } {
  validateSession(session);
  validateEvidence(input);
  const evidence: ShadowEvidence = {
    ...input,
    evidenceId: evidenceIdFor(session.sessionId, input),
  };
  const current = state.sessions[session.sessionId] ?? { ...session, evidence: [] };
  if (
    current.eventId !== session.eventId ||
    current.sessionId !== session.sessionId ||
    current.scheduledEndUtc !== session.scheduledEndUtc
  ) {
    throw new Error(`shadow session identity mismatch for ${session.sessionId}`);
  }
  const existing = current.evidence.find((item) => item.evidenceId === evidence.evidenceId);
  if (existing) return { state, duplicate: true, evidence: existing };
  const nextSession: ShadowSessionLedger = {
    ...current,
    evidence: [...current.evidence, evidence],
  };
  return {
    state: { ...state, sessions: { ...state.sessions, [session.sessionId]: nextSession } },
    duplicate: false,
    evidence,
  };
}

export function metricsFor(session: ShadowSessionLedger): ShadowMetrics {
  const actualEnd = firstOccurrence(session.evidence, 'ACTUAL_SESSION_END');
  const firstAvailable = firstOccurrence(session.evidence, 'SOURCE_RESULT_AVAILABLE');
  const firstValidated = firstOccurrence(session.evidence, 'VALIDATED_RESULT');
  const provisional = firstOccurrence(session.evidence, 'FIA_PROVISIONAL');
  const final = firstOccurrence(session.evidence, 'FIA_FINAL');
  const validatedLatency = latencyMinutes(actualEnd?.occurredAtUtc, firstValidated?.observedAtUtc);
  return {
    actualSessionEndUtc: actualEnd?.occurredAtUtc ?? null,
    firstSourceResultAtUtc: firstAvailable?.observedAtUtc ?? null,
    firstValidatedResultAtUtc: firstValidated?.observedAtUtc ?? null,
    officialProvisionalAtUtc: provisional?.observedAtUtc ?? null,
    officialFinalAtUtc: final?.observedAtUtc ?? null,
    sourceDisagreements: session.evidence.filter((item) => item.kind === 'SOURCE_DISAGREEMENT')
      .length,
    timeToFirstAvailableMinutes: latencyMinutes(
      actualEnd?.occurredAtUtc,
      firstAvailable?.observedAtUtc,
    ),
    timeToFirstValidatedMinutes: validatedLatency,
    timeToOfficialProvisionalMinutes: latencyMinutes(
      actualEnd?.occurredAtUtc,
      provisional?.observedAtUtc,
    ),
    timeToOfficialFinalMinutes: latencyMinutes(actualEnd?.occurredAtUtc, final?.observedAtUtc),
    provisionalTarget:
      validatedLatency === null ? 'PENDING' : validatedLatency <= 30 ? 'PASS' : 'FAIL',
  };
}

/** A chequered-flag record is the only OpenF1 signal accepted as actual completion. */
export function openF1ChequeredEvidence(input: {
  raceControl: unknown;
  observedAtUtc: string;
  sourceReference: string;
}): ShadowEvidenceInput | null {
  if (!Array.isArray(input.raceControl)) throw new Error('OpenF1 race_control must be an array');
  const chequered = input.raceControl
    .filter(isRecord)
    .filter((item) => typeof item.flag === 'string' && item.flag.toUpperCase() === 'CHEQUERED')
    .map((item) => item.date)
    .filter((value): value is string => typeof value === 'string' && validUtc(value))
    .sort();
  const completionUtc = chequered[chequered.length - 1];
  return completionUtc
    ? {
        kind: 'ACTUAL_SESSION_END',
        source: 'openf1',
        occurredAtUtc: completionUtc,
        observedAtUtc: input.observedAtUtc,
        sourceReference: input.sourceReference,
        detail: 'OpenF1 race_control CHEQUERED flag',
      }
    : null;
}

/**
 * Explicitly invoked, read-only OpenF1 probe for a permitted shadow session.
 * It reports availability only; it neither validates a classification nor
 * routes data to publication.
 */
export async function observeOpenF1Session(input: {
  sessionKey: number;
  observedAtUtc: string;
  fetchJson?: (url: string) => Promise<unknown>;
}): Promise<ShadowEvidenceInput[]> {
  if (!Number.isInteger(input.sessionKey)) throw new Error('OpenF1 sessionKey must be an integer');
  if (!validUtc(input.observedAtUtc)) throw new Error('OpenF1 observation time must be UTC');
  const fetchJson = input.fetchJson ?? fetchOpenF1Json;
  const key = encodeURIComponent(String(input.sessionKey));
  const raceControlReference = `https://api.openf1.org/v1/race_control?session_key=${key}`;
  const resultsReference = `https://api.openf1.org/v1/session_result?session_key=${key}`;
  const [raceControl, results] = await Promise.all([
    fetchJson(raceControlReference),
    fetchJson(resultsReference),
  ]);
  if (!Array.isArray(results)) throw new Error('OpenF1 session_result must be an array');
  const evidence: ShadowEvidenceInput[] = [];
  const completion = openF1ChequeredEvidence({
    raceControl,
    observedAtUtc: input.observedAtUtc,
    sourceReference: raceControlReference,
  });
  if (completion) evidence.push(completion);
  if (results.length > 0) {
    evidence.push({
      kind: 'SOURCE_RESULT_AVAILABLE',
      source: 'openf1',
      occurredAtUtc: input.observedAtUtc,
      observedAtUtc: input.observedAtUtc,
      sourceReference: resultsReference,
      detail: `${results.length} OpenF1 session_result records observed`,
    });
  }
  return evidence;
}

/** Classifies explicitly supplied FIA document metadata; it does not scrape or publish FIA content. */
export function fiaDocumentEvidence(input: {
  title: string;
  publishedAtUtc: string;
  observedAtUtc: string;
  sourceReference: string;
}): ShadowEvidenceInput | null {
  const normalised = input.title.trim().toUpperCase();
  const kind =
    normalised.includes('CORRECTED') || normalised.includes('REVISED')
      ? 'FIA_CORRECTED'
      : normalised.includes('FINAL')
        ? 'FIA_FINAL'
        : normalised.includes('PROVISIONAL')
          ? 'FIA_PROVISIONAL'
          : null;
  if (!kind) return null;
  return {
    kind,
    source: 'fia',
    occurredAtUtc: input.publishedAtUtc,
    observedAtUtc: input.observedAtUtc,
    sourceReference: input.sourceReference,
    detail: input.title,
  };
}

function evidenceIdFor(sessionId: string, evidence: ShadowEvidenceInput): string {
  return createHash('sha256')
    .update(JSON.stringify({ sessionId, ...evidence }))
    .digest('hex')
    .slice(0, 20);
}

function firstOccurrence(evidence: readonly ShadowEvidence[], kind: ShadowEvidenceKind) {
  return evidence
    .filter((item) => item.kind === kind)
    .sort((left, right) => Date.parse(left.observedAtUtc) - Date.parse(right.observedAtUtc))[0];
}

function latencyMinutes(startUtc: string | undefined, endUtc: string | undefined): number | null {
  if (!startUtc || !endUtc) return null;
  return Math.round(((Date.parse(endUtc) - Date.parse(startUtc)) / 60_000) * 100) / 100;
}

function validateSession(
  session: Pick<ShadowSessionLedger, 'eventId' | 'sessionId' | 'scheduledEndUtc'>,
) {
  if (
    typeof session.eventId !== 'string' ||
    typeof session.sessionId !== 'string' ||
    typeof session.scheduledEndUtc !== 'string' ||
    !session.eventId ||
    !session.sessionId ||
    !validUtc(session.scheduledEndUtc)
  )
    throw new Error('shadow session requires non-empty IDs and a UTC scheduledEndUtc');
}

function validateEvidence(evidence: unknown): asserts evidence is ShadowEvidenceInput {
  if (
    !isRecord(evidence) ||
    typeof evidence.kind !== 'string' ||
    typeof evidence.source !== 'string' ||
    typeof evidence.occurredAtUtc !== 'string' ||
    typeof evidence.observedAtUtc !== 'string' ||
    typeof evidence.sourceReference !== 'string' ||
    (evidence.detail !== undefined && typeof evidence.detail !== 'string')
  ) {
    throw new Error('shadow evidence must be an object with string fields');
  }
  if (!shadowEvidenceKinds.includes(evidence.kind as ShadowEvidenceKind))
    throw new Error('shadow evidence kind is invalid');
  if (!shadowSources.includes(evidence.source as ShadowSource))
    throw new Error('shadow evidence source is invalid');
  if (!validUtc(evidence.occurredAtUtc) || !validUtc(evidence.observedAtUtc))
    throw new Error('shadow evidence timestamps must be valid UTC instants');
  if (!evidence.sourceReference.trim())
    throw new Error('shadow evidence sourceReference is required');
}

function validUtc(value: string): boolean {
  return value.endsWith('Z') && Number.isFinite(Date.parse(value));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

async function fetchOpenF1Json(url: string): Promise<unknown> {
  const response = await fetch(url, { headers: { accept: 'application/json' } });
  if (!response.ok) throw new Error(`OpenF1 HTTP ${response.status} for ${url}`);
  return response.json();
}

function isShadowState(value: unknown): value is ShadowState {
  if (!isRecord(value) || value.schemaVersion !== 1 || !isRecord(value.sessions)) return false;
  return Object.values(value.sessions).every(
    (session) =>
      isRecord(session) &&
      typeof session.eventId === 'string' &&
      typeof session.sessionId === 'string' &&
      typeof session.scheduledEndUtc === 'string' &&
      validUtc(session.scheduledEndUtc) &&
      Array.isArray(session.evidence) &&
      session.evidence.every(isShadowEvidence),
  );
}

function isShadowEvidence(value: unknown): value is ShadowEvidence {
  return (
    isRecord(value) &&
    typeof value.evidenceId === 'string' &&
    typeof value.kind === 'string' &&
    shadowEvidenceKinds.includes(value.kind as ShadowEvidenceKind) &&
    typeof value.source === 'string' &&
    shadowSources.includes(value.source as ShadowSource) &&
    typeof value.occurredAtUtc === 'string' &&
    validUtc(value.occurredAtUtc) &&
    typeof value.observedAtUtc === 'string' &&
    validUtc(value.observedAtUtc) &&
    typeof value.sourceReference === 'string' &&
    (value.detail === undefined || typeof value.detail === 'string')
  );
}
