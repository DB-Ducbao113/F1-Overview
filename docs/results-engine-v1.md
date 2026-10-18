# Results Engine V1 (offline prototype)

## Scope and safety

V1 is an offline-first prototype. Its default provider is the synthetic fixture at `src/results-engine/fixtures/<sessionId>.json`; it neither contacts a live provider nor writes to `src/data`, `public`, or an existing update workflow. Publication accepts only `APPROVED` sources. Synthetic, restricted, and unknown-source records are always refused.

The canonical `SessionResult` contract is the only input accepted by state and publication code. Provider adapters validate untrusted JSON field-by-field before constructing it. OpenF1 uses documented `sessions`, `session_result`, and `drivers` endpoints with `session_key`; Jolpica uses `https://api.jolpi.ca/ergast/f1/{year}/{round}/results.json`. Both live adapters are `RESTRICTED` and disabled for publication pending rights approval.

## State, revisions, and UTC scheduling

State is atomically replaced in `.results-engine/state.json` (or `RESULTS_ENGINE_STATE_PATH`). It contains session state and append-only revisions. A retry of the same canonical classification is idempotent; a changed final classification appends a revision and transitions `FINAL` to `CORRECTED` without mutating earlier revisions.

Calendar timestamps must end in `Z`. A scheduled end opens a check window only; it never proves completion. The engine records nothing until a validated provider result has an observed `endUtc` in the past. It records `PROVISIONAL`, `FINAL`, or `CORRECTED` only when the validated payload explicitly declares that status. Historical correction checks require `allowHistoricalCorrections`.

Calendar data is configurable with `npm run results-engine -- --calendar <absolute-or-relative-json-path>`. The supplied JSON uses the validated `CalendarEvent[]` schema, with explicit identifiers and provider references. No bundled calendar is a live-race schedule.

## Read-only shadow observation

`src/results-engine/shadow.ts` is a separate local evidence ledger for an approved shadow run. It has no import from publication code, and `.results-engine/` is ignored, so observations cannot reach public result pages or be committed as race results. Each record has a stable identity derived from event/session, provider, evidence type, and a provider event/document/snapshot identifier. Repeated polls preserve the original first-observed time instead of creating a new record.

Actual completion requires an OpenF1 `race_control` `CHEQUERED` event with a provider-derived identity. A scheduled end, provider `date_end`, or missing flag is not completion. A non-empty `session_result` creates only `SOURCE_RESULT_AVAILABLE`; it is not a validated classification. Validation checks driver identities, duplicate drivers/positions, status flags, and coverage of the observed driver list. Only a successful persisted validation report creates `VALIDATED_RESULT` and contributes to the 15-30 minute KPI. Replay observations calculate the same metrics for deterministic verification but are labelled `REPLAY_ONLY`; only an authorized live observation with provider-derived actual-completion evidence can produce a measured target result.

FIA reconciliation uses `FiaDocumentMonitor`, an interface for permitted document metadata only: document ID, explicit classification, UTC publication/observation times, URL, title, and authority flag. A title never infers finality. `FINAL` and `CORRECTED` evidence require authoritative FIA metadata. Documents are append-only evidence; the engine never scrapes, mirrors, or publishes FIA documents.

For an approved live shadow run:

```bash
npm run results-engine:shadow -- --event <event-id> --session <session-id> --scheduled-end <utc-z> --openf1-session-key <key> --source-permission <reviewed-json> --authorize-network-observation
```

The command makes read-only OpenF1 requests to `race_control`, `session_result`, and `drivers`. Network access fails closed unless the operator supplies the explicit manual-authorization flag and a reviewed permission record for the exact source registry entry. The repository contains no pre-approved live provider. The command records availability separately, stores failed and successful validation reports, and emits validated evidence only for a complete successful report. Alternatively, `--evidence <json-array>` records reviewed non-validation evidence; every item requires a stable `sourceEventId`. The command reports metrics only and cannot publish a canonical classification.

The CLI reloads state through a short-lived exclusive local lock before writing, preventing concurrent local CLI processes from overwriting one another. The lock plus atomic replacement protects one filesystem only: it is not remote durability, distributed locking, backup, or recovery. An interrupted process can leave a lock file, which must be investigated before manual removal.

## M4 manual observation workflow

The M4 command discovers a race from a validated configurable calendar, records
completion and source availability independently, validates classification
coverage, persists immutable evidence, and accepts reviewed FIA document metadata:

```bash
npm run results-engine:observe -- \
  --calendar src/results-engine/fixtures/m4-observation-calendar.json \
  --replay src/results-engine/fixtures/m4-complete-replay.json \
  --fia-documents src/results-engine/fixtures/m4-fia-document-reviews.json \
  --state .results-engine/m4-phase1-shadow-state.json
```

The default evidence path is synthetic replay. Repeat execution is idempotent and
preserves the first-observed timestamps. A scheduled end only makes a session
eligible for discovery; it never creates completion evidence. Live OpenF1 mode
requires `--live-openf1`, an explicit session key, the manual-authorization flag,
and a reviewed source-permission record. `--list-sources` prints the registry and
network eligibility without making a request.

M4 Phase 2 adds `--replay-sequence` for ordered observation snapshots and
`--durable-store` for a branch-local content-addressed evidence prototype. The
sequence records no-result, completion, partial, complete, cross-source and later
document-review transitions. It reports latency bounds based on the last negative
poll and first positive poll, so polling uncertainty is explicit.

The durable prototype writes immutable linked revisions, an atomic `HEAD`, and a
recoverable transaction journal. It verifies every revision after read-back and
rejects stale expected-HEAD writers. Files remain under ignored `.results-engine/`
storage; the module has no publication or remote-push behavior. It is suitable for
local failure testing, not multi-host production durability.

Live requests are sequential and use bounded timeout, retry and rate-limit backoff.
They still require an explicit command flag, a reviewed calendar session-key
mapping and a schema-v2 permission control referencing external provider
authorization. The local control is not itself evidence of provider permission.

## Local execution

Use Node 22+ and run a deterministic offline example:

```bash
npm run results-engine -- --now 2026-03-14T14:30:00Z
```

This creates `.results-engine/state.json`, records a synthetic provisional revision, and prints a concise run report. Re-running does not duplicate the revision. No result is published.

## GitHub Actions and persistence

`results-engine.yml` is manual-dispatch only and rejects refs other than `Per-PEDS`. It has no cron because scheduled workflows execute from the default branch. It uses a branch-scoped, per-run cache containing only `.results-engine`; a missing cache starts from the schema-defined empty state. Caches can be evicted and are not durable storage, so this is suitable only for prototype testing.

GitHub requires a `workflow_dispatch` workflow to exist on the default branch before dispatching it against `Per-PEDS`. Since V1 must not change `main`, remote manual execution is blocked pending separately approved default-branch bootstrap. Local execution remains available.

The zero-cost persistent-state design proposed for a future approved release is a protected dedicated `results-engine-state` branch containing only atomic state and append-only revision/evidence files. A separate workflow would use narrowly scoped `contents: write`, optimistic retry, a concurrency group, and verified post-push read-back. It is documented only, not activated. Git history and branch protection are recovery aids, not a durability guarantee; retention, backup/export, branch protection, and legal-source approval remain mandatory.

The Results Engine workflow does not modify `auto-update-f1.yml` or any existing data pipeline.
