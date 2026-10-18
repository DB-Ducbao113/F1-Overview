import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import {
  appendShadowEvidence,
  emptyShadowState,
  fiaDocumentEvidence,
  loadShadowState,
  metricsFor,
  openF1ChequeredEvidence,
  observeOpenF1Session,
  saveShadowState,
} from './shadow.ts';

const temporaryDirectories: string[] = [];
const session = {
  eventId: '2026-test-gp',
  sessionId: '2026-test-gp-race',
  scheduledEndUtc: '2026-10-18T14:00:00Z',
};

function statePath(): string {
  const directory = mkdtempSync(join(tmpdir(), 'results-engine-shadow-'));
  temporaryDirectories.push(directory);
  return join(directory, 'shadow-state.json');
}

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0))
    rmSync(directory, { recursive: true, force: true });
});

describe('Results Engine shadow mode', () => {
  it('records observed completion separately from schedule and measures an on-target validated result', () => {
    let state = emptyShadowState();
    const completion = openF1ChequeredEvidence({
      raceControl: [
        { flag: 'YELLOW', date: '2026-10-18T13:50:00Z' },
        { flag: 'CHEQUERED', date: '2026-10-18T14:07:30Z' },
      ],
      observedAtUtc: '2026-10-18T14:08:00Z',
      sourceReference: 'https://api.openf1.org/v1/race_control?session_key=999',
    });
    expect(completion?.occurredAtUtc).toBe('2026-10-18T14:07:30Z');
    state = appendShadowEvidence(state, session, completion!).state;
    state = appendShadowEvidence(state, session, {
      kind: 'SOURCE_RESULT_AVAILABLE',
      source: 'openf1',
      occurredAtUtc: '2026-10-18T14:15:00Z',
      observedAtUtc: '2026-10-18T14:15:30Z',
      sourceReference: 'https://api.openf1.org/v1/session_result?session_key=999',
    }).state;
    state = appendShadowEvidence(state, session, {
      kind: 'VALIDATED_RESULT',
      source: 'operator',
      occurredAtUtc: '2026-10-18T14:20:00Z',
      observedAtUtc: '2026-10-18T14:20:00Z',
      sourceReference: 'validation:sha256:example',
    }).state;

    const ledger = state.sessions[session.sessionId]!;
    expect(metricsFor(ledger)).toMatchObject({
      actualSessionEndUtc: '2026-10-18T14:07:30Z',
      sourceDisagreements: 0,
      provisionalTarget: 'PASS',
    });
    expect(metricsFor(ledger).timeToFirstValidatedMinutes).toBe(12.5);
  });

  it('is idempotent across repeated runs, atomically persists evidence, and retains late FIA correction evidence', () => {
    const path = statePath();
    const provisional = fiaDocumentEvidence({
      title: 'Provisional Classification',
      publishedAtUtc: '2026-10-18T14:31:00Z',
      observedAtUtc: '2026-10-18T14:32:00Z',
      sourceReference: 'https://www.fia.com/document/1',
    })!;
    let first = appendShadowEvidence(emptyShadowState(), session, provisional);
    expect(first.duplicate).toBe(false);
    first = appendShadowEvidence(first.state, session, provisional);
    expect(first.duplicate).toBe(true);
    saveShadowState(first.state, path);

    const resumed = loadShadowState(path);
    const corrected = fiaDocumentEvidence({
      title: 'Revised Final Classification',
      publishedAtUtc: '2026-10-18T16:15:00Z',
      observedAtUtc: '2026-10-18T16:16:00Z',
      sourceReference: 'https://www.fia.com/document/2',
    })!;
    const afterInterruption = appendShadowEvidence(resumed, session, corrected);
    saveShadowState(afterInterruption.state, path);

    const persisted = loadShadowState(path).sessions[session.sessionId]!;
    expect(persisted.evidence).toHaveLength(2);
    expect(persisted.evidence.map((item) => item.kind)).toEqual([
      'FIA_PROVISIONAL',
      'FIA_CORRECTED',
    ]);
    expect(JSON.parse(readFileSync(path, 'utf8')).schemaVersion).toBe(1);
  });

  it('does not infer completion when OpenF1 has no chequered flag and rejects malformed evidence', () => {
    expect(
      openF1ChequeredEvidence({
        raceControl: [{ flag: 'YELLOW', date: '2026-10-18T14:00:00Z' }],
        observedAtUtc: '2026-10-18T14:01:00Z',
        sourceReference: 'https://api.openf1.org/v1/race_control?session_key=999',
      }),
    ).toBeNull();
    expect(() =>
      appendShadowEvidence(emptyShadowState(), session, {
        kind: 'ACTUAL_SESSION_END',
        source: 'openf1',
        occurredAtUtc: '2026-10-18T14:00:00+01:00',
        observedAtUtc: '2026-10-18T14:01:00Z',
        sourceReference: 'x',
      }),
    ).toThrow('UTC');
    expect(() =>
      appendShadowEvidence(emptyShadowState(), session, {
        kind: 'UNTRUSTED_KIND' as 'ACTUAL_SESSION_END',
        source: 'openf1',
        occurredAtUtc: '2026-10-18T14:00:00Z',
        observedAtUtc: '2026-10-18T14:01:00Z',
        sourceReference: 'x',
      }),
    ).toThrow('kind');
    expect(() =>
      appendShadowEvidence(emptyShadowState(), session, {
        kind: 'ACTUAL_SESSION_END',
        source: 'openf1',
        occurredAtUtc: 123 as unknown as string,
        observedAtUtc: '2026-10-18T14:01:00Z',
        sourceReference: 'x',
      }),
    ).toThrow('string fields');
  });

  it('performs an explicit read-only OpenF1 availability observation with injected responses', async () => {
    const evidence = await observeOpenF1Session({
      sessionKey: 999,
      observedAtUtc: '2026-10-18T14:10:00Z',
      fetchJson: async (url) =>
        url.includes('race_control')
          ? [{ flag: 'CHEQUERED', date: '2026-10-18T14:07:30Z' }]
          : [{ driver_number: 1 }],
    });
    expect(evidence.map((item) => item.kind)).toEqual([
      'ACTUAL_SESSION_END',
      'SOURCE_RESULT_AVAILABLE',
    ]);
    expect(evidence.every((item) => item.source === 'openf1')).toBe(true);
  });

  it('runs the shadow CLI with reviewed evidence and persists a reviewable local artifact', () => {
    const path = statePath();
    const evidencePath = join(dirname(path), 'evidence.json');
    writeFileSync(
      evidencePath,
      JSON.stringify([
        {
          kind: 'ACTUAL_SESSION_END',
          source: 'operator',
          occurredAtUtc: '2026-10-18T14:07:30Z',
          observedAtUtc: '2026-10-18T14:08:00Z',
          sourceReference: 'operator:approved-observation',
        },
      ]),
    );
    const result = spawnSync(
      process.execPath,
      [
        '--experimental-strip-types',
        'src/results-engine/shadow-cli.ts',
        '--event',
        session.eventId,
        '--session',
        session.sessionId,
        '--scheduled-end',
        session.scheduledEndUtc,
        '--state',
        path,
        '--evidence',
        evidencePath,
      ],
      { cwd: process.cwd(), encoding: 'utf8' },
    );
    expect(result.status).toBe(0);
    expect(result.stdout).toContain('observationsRecorded');
    expect(loadShadowState(path).sessions[session.sessionId]?.evidence).toHaveLength(1);
  });
});
