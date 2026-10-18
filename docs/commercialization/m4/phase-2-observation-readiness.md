# M4 Phase 2 Observation and Recovery Report

## Implemented workflow

The Phase 1 single-snapshot command remains supported. Phase 2 adds deterministic
multi-snapshot replay:

```bash
npm run results-engine:observe -- \
  --calendar src/results-engine/fixtures/m4-observation-calendar.json \
  --replay-sequence src/results-engine/fixtures/m4-multi-snapshot-replay.json \
  --state .results-engine/m4-phase2-state.json \
  --durable-store .results-engine/m4-phase2-durable
```

The supplied calendar contains an invented provider session key with explicit
synthetic mapping evidence. Live mode requires a separately reviewed mapping and
does not accept a CLI key that differs from the calendar.

## End-to-end replay evidence

Seven ordered snapshots verified:

1. no result available;
2. provider-shaped chequered completion observed;
3. partial classification persisted with failed validation;
4. complete classification validated;
5. provisional FIA-shaped metadata reviewed;
6. final metadata reviewed later;
7. corrected metadata reviewed later.

The complete snapshot also produced one synthetic cross-source inconsistency.
Stable source-event identities made later complete-result polls duplicates instead
of new evidence.

| Replay metric                    |                                 Result |
| -------------------------------- | -------------------------------------: |
| First result observed            | 7.5 minutes after synthetic completion |
| Availability bound               |                        0.5-7.5 minutes |
| Availability polling uncertainty |                            7.0 minutes |
| Complete validation observed     |          12.5 minutes after completion |
| Validation bound                 |                       7.5-12.5 minutes |
| Validation polling uncertainty   |                            5.0 minutes |
| FIA provisional metadata         |                           19.5 minutes |
| FIA final metadata               |                           64.5 minutes |

All figures are `REPLAY_ONLY`; target claim remains `NOT_MEASURED`.

## Durable evidence prototype

The branch-local prototype stores content-addressed immutable revision JSON files,
an atomic `HEAD`, and a recoverable pending transaction journal under ignored
`.results-engine/` storage. Each update verifies the state SHA-256 after read-back.

- First sequence execution created seven linked revisions.
- Identical restart created no revisions and preserved the same HEAD.
- Tests recover interruption after journal creation and after revision creation.
- An explicit expected-HEAD check rejects stale concurrent writers.
- The store has no import from public publication code, no credentials, no remote
  push, and no protected-branch operation.

This is a prototype, not remote durability. It has host-local locking only and
requires backup/retention, authenticated remote writes, repository protection and
multi-host conflict procedures before production use.

Machine-readable evidence:
`docs/commercialization/m4/evidence/m4-phase2-sequence-report.json`.

## Actual observation readiness decision

**NOT AUTHORIZED / HOLD.**

The software is technically ready for an owner-approved manual shadow trial after
source permission and exact session mapping are independently verified. No current
source has sufficient evidence for the intended commercial observation/storage
scope, so Phase 2 made no provider request.

Proposed later real-session trial: one manually invoked race-only run, reviewed
session key, explicit provider authorization reference, conservative timeout and
retry policy, no public output, evidence stored in an isolated protected state
location, and immediate stop on authentication, rate-limit or terms mismatch.
