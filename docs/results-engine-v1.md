# Results Engine V1 (offline prototype)

## Scope and safety

The V1 engine is an offline-first prototype. Its only default provider is the synthetic fixture at `src/results-engine/fixtures/<sessionId>.json`; it neither contacts a live provider nor writes to `src/data`, `public`, or any existing update workflow. The publication API accepts only `APPROVED` sources; synthetic, restricted, and unknown-source records are always refused.

The canonical `SessionResult` contract is the only input accepted by state and publication code. Provider adapters validate untrusted JSON field-by-field before constructing it. OpenF1 uses its documented `sessions`, `session_result`, and `drivers` endpoints with `session_key`; Jolpica uses `https://api.jolpi.ca/ergast/f1/{year}/{round}/results.json` and reads `MRData.RaceTable.Races[].Results[]`. Both live adapters declare their output `RESTRICTED` and are disabled for publication pending legal approval.

## State, revisions, and UTC scheduling

State is stored atomically in `.results-engine/state.json` (or `RESULTS_ENGINE_STATE_PATH`). The schema holds session state plus append-only revisions. A revision hash is generated from the canonical classification payload; a retry of the same classification is idempotent. A changed final classification appends a revision and moves the state from `FINAL` to `CORRECTED`; previously recorded revisions are not modified.

Calendar timestamps must end in `Z`. Scheduled end only opens a provider-check window; it never proves a session completed. The engine records nothing until the provider's observed `endUtc` has passed, and it records `PROVISIONAL`, `FINAL`, or `CORRECTED` only when the validated provider payload explicitly declares that status. Historical correction checks require the explicit `allowHistoricalCorrections` option.

## Local execution

Use Node 22+ and run a deterministic offline example:

```bash
npm run results-engine -- --now 2026-03-14T14:30:00Z
```

This creates `.results-engine/state.json`, records a synthetic provisional revision, and prints a concise run report. Re-running at the same time does not duplicate the revision. No result is published.

## GitHub Actions design

`results-engine.yml` is manual-dispatch only and hard-rejects refs other than `Per-PEDS`. It has no cron because scheduled workflows execute from the repository default branch. It uses a branch-scoped, per-run Actions cache containing only `.results-engine` and a concurrency group: each run restores the newest matching cache and saves a new immutable cache key. A missing cache starts from the schema-defined empty state. Caches can be evicted and are not durable storage, so this is suitable only for remote prototype testing.

GitHub requires a `workflow_dispatch` workflow to exist on the repository default branch before it can be manually dispatched against `Per-PEDS`. Since V1 must not change `main`, the first remote manual run is blocked until a separately approved default-branch bootstrap is made. That bootstrap is not included here; local execution remains the available verification path.

The zero-cost persistence design proposed for any future approved release is a protected, dedicated `results-engine-state` Git branch containing only the atomic state file and append-only revision files. A separate workflow with narrowly scoped `contents: write`, optimistic retry, a concurrency group, and a verified post-push read-back would checkpoint that branch after successful validation; the application and shared datasets remain untouched. Git history and branch protection provide reviewable recovery points, but this is not a durability guarantee: repository retention, access, and GitHub availability remain external dependencies. Retention policy, backup/export procedure, branch protection, and legal-source approval are required before enabling it. This design is documented only; it is not activated by V1.

The workflow does not modify `auto-update-f1.yml` or any existing data pipeline.
