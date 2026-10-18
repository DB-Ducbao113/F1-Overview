# EDS QA Release Report - M4 Phase 2

**Commit SHA:** baseline `4ec794b57a7d76408eeb2d209b71b6420761c54d` with uncommitted Phase 2 changes

**Target branch:** `Per-PEDS`

**Target environment:** local offline replay and branch-local durable-store prototype

**Change summary:** verified session mapping metadata, ordered observation replay, stable event identities, partial-to-complete transitions, cross-source reports, polling uncertainty, bounded network request policy, and recoverable content-addressed evidence revisions

**Risk level:** HIGH - result correctness, source rights, external request behavior, concurrency and evidence durability

## Static checks

- ESLint: **PASS** - `npm.cmd run lint`, exit 0.
- TypeScript: **PASS** - `npm.cmd exec tsc -- --noEmit`, exit 0.
- Unit tests: **PASS** - `npm.cmd run test`, 34 files and 240 tests passed, exit 0.
- Focused integration tests: **PASS** - 4 Results Engine files and 28 tests passed, exit 0.
- Build: **PASS** - `npm.cmd run build`, 2,203 modules transformed, exit 0.
- Changed-file formatting: **PASS** - scoped Prettier write completed; final check recorded after this report.
- Dependency changes: **NONE** - no package or lockfile modification.

## Functional checks

- Calendar/session mapping: **PASS (synthetic)** - the replay calendar requires an invented OpenF1-shaped session key plus explicit synthetic verification metadata.
- No-result to complete transition: **PASS** - seven ordered snapshots preserve no-result, completion, partial, complete, provisional, final and corrected stages.
- Stable identities/idempotency: **PASS** - the first CLI run created seven durable revisions; the second added no evidence or revisions and retained the same HEAD.
- Cross-source inconsistency: **PASS** - one synthetic classification mismatch persisted as immutable `SOURCE_DISAGREEMENT` evidence.
- Availability/validation timestamps: **PASS** - separate evidence and validation times are retained.
- Polling uncertainty: **PASS** - availability bound 0.5-7.5 minutes; validation bound 7.5-12.5 minutes.
- Retry/timeout/rate limit: **PASS** - tests cover HTTP 429 backoff, retry exhaustion boundaries, non-retryable 403 and timeout cancellation.
- Interrupted execution: **PASS** - tests recover after pending-journal and immutable-revision write interruption points.
- Browser/mobile/accessibility/SEO: **NOT APPLICABLE** - no UI or public route changed.

## Specialized checks

- Public result isolation: **PASS** - no Results Engine or replay reference exists outside `src/results-engine`; observation/durable modules do not import publication or public data paths.
- Automatic publication: **PASS** - no publication call, remote push or credential path was added.
- Cron/workflows: **PASS** - no tracked `.github/workflows` diff; the pre-existing untracked `per-peds-ci.yml` remains outside scope.
- Existing data pipelines: **PASS** - no `src/data`, `public`, workflow or lockfile diff.
- Commercial visuals: **PASS** - build guard removed 14 legacy visual targets, verified 73 EDS assets, and passed 27-source/94-artifact isolation scans.
- Performance: **PASS (scoped)** - deterministic sequence runs locally; no real-provider latency or load claim is made.
- Security: **PASS (scoped)** - untrusted JSON validation, bounded requests, atomic writes, content hashes, read-back, local locks and stale-HEAD conflict checks are present. No secrets or dependencies were added.
- Source rights: **HOLD** - published evidence does not establish commercial observation, storage or redistribution rights for OpenF1, Jolpica or FIA metadata.
- Automated data source 1: **NOT APPLICABLE** - existing workflow unchanged and not executed.
- Automated data source 2: **NOT APPLICABLE** - existing workflow unchanged and not executed.

## CI/CD

- Required GitHub Actions: **NOT RUN** - work stops before commit/push.
- Preview deployment: **NOT APPLICABLE**.
- Production deployment: **NOT APPLICABLE** and prohibited by scope.
- Production smoke tests: **NOT APPLICABLE**.

## Defects

### M4P2-001 - P2 Major - repeated classification identity collision

- Reproduction: replay the same complete classification in later FIA-document polls.
- Expected: stable source identity is treated as a duplicate.
- Actual: snapshot-specific source references collided with a stable validation-report ID.
- Evidence: initial focused suite failed in `recordValidatedResult` with `validation report identity collision`.
- Root cause: replay source reference included the poll snapshot ID.
- Resolution: source references are now stable per replay sequence; snapshot IDs remain in the step report.
- Retest: **PASS** in focused and full suites; identical restart adds zero evidence/revisions.

### M4P2-002 - P2 Major - cross-source mismatch silently omitted

- Reproduction: compare two Maps containing different driver positions.
- Expected: `SOURCE_DISAGREEMENT` evidence.
- Actual: direct `JSON.stringify(Map)` produced `{}` for both maps.
- Evidence: initial test reported `sourceDisagreements: 0` instead of 1.
- Root cause: non-serializable Map comparison.
- Resolution: compare sorted Map entry arrays and hash those arrays.
- Retest: **PASS**; report records one disagreement.

- P0/P1: none observed.
- Open P2: none in the offline Phase 2 implementation.
- P3/P4: none observed.

## Evidence

- Commands and exit codes: focused tests 0; CLI run 1 and run 2 both 0; ESLint 0; TypeScript 0; full tests 0; build 0.
- Test results: 34/34 files, 240/240 tests; focused 28/28.
- CLI replay run 1: seven linked durable revisions and one source disagreement.
- CLI replay run 2: zero new observations and unchanged seven-revision HEAD.
- Machine report: `docs/commercialization/m4/evidence/m4-phase2-sequence-report.json`.
- Source evidence: `docs/commercialization/m4/source-eligibility-matrix.md`.
- Screenshots: **NOT APPLICABLE** - no UI change.

## Unverified items

- Written commercial observation/storage permission for an actual provider.
- Exact real-session calendar and session-key mapping.
- Real source availability, latency, completeness and correction behavior.
- Multi-host remote durability, backup, retention and disaster recovery.
- Independent legal review of factual metadata versus protected documents.
- CI for a future committed candidate.

## Residual risks

- A local permission record can be forged and is not provider authorization.
- Content-addressed local revisions are reviewable but not remotely durable.
- Provider behavior, limits and terms may change after the recorded review date.
- Replay timings cannot establish the 15-30 minute real-source target.

## Final decision: HOLD

**Reason:** offline functionality and recovery gates pass, but no provider is independently authorized for the intended commercial observation and storage scope; no real observation was executed.

**Next required action:** obtain written provider authorization and independent rights review, then submit an exact race/session mapping and manual shadow-run plan for owner approval. Keep output private and publication disabled.
