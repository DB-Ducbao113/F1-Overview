# M4 Source Provenance

M4 Phase 1 is replay-first and read-only. No live provider observation was made
for the recorded Phase 1 evidence.

M4 Phase 2 remains replay-only. Current provider evidence is evaluated separately
in `source-eligibility-matrix.md`; no local permission record is treated as proof
of provider authorization.

| Registry ID                     | Category                          | Authorship or source                                                                        | Phase 1 use                                               | Rights status                                                                               |
| ------------------------------- | --------------------------------- | ------------------------------------------------------------------------------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `podium-results-engine`         | Software                          | Independently authored Podium EDS parsing, validation, revision, evidence, and latency code | Enabled                                                   | Project-owned software; repository history is authorship evidence, not legal clearance      |
| `synthetic-openf1-replay`       | Synthetic observations            | Project-authored fixtures with invented event and driver data                               | Default observation source                                | Approved for local replay and tests; not factual race evidence                              |
| `synthetic-cross-source-replay` | Synthetic comparison observations | Project-authored conflicting classification fixture                                         | Cross-source validation tests                             | Approved for local replay and tests; not factual race evidence                              |
| `openf1-community-api`          | Third-party factual dataset       | OpenF1 community API                                                                        | Disabled by default                                       | Review required before each authorized observation mode; no publication permission inferred |
| `jolpica-ergast-api`            | Third-party factual dataset       | Jolpica/Ergast-compatible API                                                               | Existing adapter only; not used by M4 observation command | Review required; disabled for publication                                                   |
| `fia-document-metadata`         | Official-document metadata        | Human-reviewed FIA document identifiers, titles, URLs, classification and timestamps        | Review interface only; Phase 1 evidence is synthetic      | Review required; documents are not scraped, mirrored, or republished                        |

## Live-observation gate

The manual command fails closed unless the operator supplies both:

1. `--authorize-network-observation`; and
2. a reviewed permission JSON record for the exact registry source.

The permission record must identify its reviewer, evidence, approved scope, and
UTC review time. This is an operator control and audit record, not proof that a
provider license permits commercial reuse. The repository contains no bundled
approval for live providers.

Provider responses, calendars, replay files, FIA metadata, and permission files
are treated as untrusted input and validated before persistence. Protected
live-timing endpoints and access-control bypasses are outside scope.

Phase 2 adds project-authored `network-policy.ts`, `observation-sequence.ts`, and
`durable-evidence-store.ts`. Durable revision files are generated from validated
shadow state in ignored local storage; they are not public results and are not
pushed automatically.
