# M4 Phase 1 Latency Report

**Evidence mode:** synthetic replay

**Measurement status:** `NOT_MEASURED` for real provider performance

The deterministic fixture models a race completion at `2026-10-18T14:07:30Z`,
source availability at `14:18:00Z`, validation at `14:20:00Z`, provisional FIA
metadata at `14:27:00Z`, final metadata at `15:12:00Z`, and corrected metadata at
`16:02:00Z`.

| Replay metric                         |       Result |
| ------------------------------------- | -----------: |
| Source availability latency           | 10.5 minutes |
| Validated-result latency              | 12.5 minutes |
| Provisional-document metadata latency | 19.5 minutes |
| Final-document metadata latency       | 64.5 minutes |

The 12.5-minute replay result demonstrates calculation and evidence persistence;
it does **not** demonstrate that a real validated provisional result is available
within the 15-30 minute target. Replay completion is kept separate from verified
actual-session completion, so the report target state is `REPLAY_ONLY` and the
claim is `NOT_MEASURED`.

The first execution added six evidence records and one successful validation
report. An identical second execution added zero records and ignored all six as
stable duplicates while preserving first-observed timestamps.

Machine-readable evidence is stored in
`docs/commercialization/m4/evidence/m4-phase1-replay-report.json`. Runtime shadow
state remains under ignored `.results-engine/` storage and is not a publishable
result.
