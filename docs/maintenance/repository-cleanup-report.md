# Podium EDS repository cleanup report

**Date:** 2026-10-23

**Repository:** `DB-Ducbao113/F1-Overview`

**Branch / baseline:** `Per-PEDS` / `a63c9896ccc0a69cf1b2fcbcf82d08fd1e53fcf6`

**Scope:** repository cleanup and delivery to `Per-PEDS`; no merge or deployment

**Decision:** **GO** for scoped `Per-PEDS` branch delivery

## Outcome

Obsolete commercialization reports, redundant evidence packages, historical D1/D2/D3 authoring outputs, and experiment-only QA scripts were removed from the repository working tree. The complete source set was moved to a recoverable archive before removal, and all archived file hashes were verified.

The requested Anime.js intro implementation was rolled back at the owner's direction. No `/intro` route, Anime.js dependency, intro component, intro SEO entry, intro sitemap entry, or new intro evidence remains.

## Before and after

| Metric                         |                   Before |       After review set |        Delta |
| ------------------------------ | -----------------------: | ---------------------: | -----------: |
| Tracked files                  |                    1,199 |                    491 |         -708 |
| Tracked bytes                  | 219,878,700 (209.69 MiB) | 30,019,630 (28.63 MiB) | -189,859,070 |
| Files under `docs/`            |                      701 |                     20 |         -681 |
| Bytes under `docs/`            | 199,202,706 (189.97 MiB) |   9,579,320 (9.14 MiB) | -189,623,386 |
| Curated visual-feedback images |                        0 |                     12 |          +12 |

The after values include the 12 curated images and their provenance index that are currently new local files.

## Recoverable archives

- Complete cleanup source: `E:/Formula 1/archives/F1-Overview-repository-cleanup-2026-10-23-r2`
  - 1,190 files
  - 616,553,565 bytes (587.99 MiB)
  - 0 SHA-256 mismatches after move
  - Includes tracked historical content and untracked D3/D3-R1 work
- Dedicated D3 safeguard: `E:/Formula 1/archives/F1-Overview-D3-history-2026-10-23`
  - 470 files
  - 417,364,932 bytes (398.03 MiB)
  - 0 SHA-256 mismatches

The exact per-file path, byte count, SHA-256 and removal reason are recorded in [`deletion-manifest.json`](./deletion-manifest.json). The complete archive also contains its own copy of that manifest.

### Manifest review and restore drill

- Reviewed all 1,190 manifest entries: 1,152 are under `docs/`, 37 are historical scripts, and one is the root `gdr-review.html`; none are under `src/`, `public/`, `api/`, or runtime configuration paths.
- All 721 tracked deletions are represented in the manifest; no tracked deletion is missing and no manifest-tracked path remains unexpectedly present.
- Searched the remaining application, package configuration, workflows, README, and scripts for all 38 removed script/HTML basenames; no live references were found.
- Restored the complete archive into a new temporary directory, producing 1,191 files and 617,175,726 bytes including the archive's own manifest.
- Opened and parsed all 116 JSON files, read all 134 text/code files, decoded all 919 PNG files, and checked all eight GLB containers. No missing file, size mismatch, parse failure, decode failure, or invalid GLB header was found.
- All 13 Blender files were restored byte-for-byte and carry Blender's Zstandard-compressed file signature. Blender was unavailable on this machine, so application-level opening of those 13 files was not run.
- The temporary restore directory was used only for the drill; the source archive remained untouched.

## Curated visual feedback

Twelve genuine images were retained under [`docs/visual-feedback/`](../visual-feedback/README.md). They cover the initial blockout, aero and clay revisions, a rejected concept, cockpit experimentation, D1/D2/D3 progression, the preferred legacy visual reference, a homepage before/after, and a historical mobile intro state. No screenshots were fabricated.

## Protected local model candidates

The expected `original.*` names were not present. The actual files are named `origin.*`; all four remain nonempty and untouched. `references/model-candidates/` is now ignored without ignoring the rest of `references/`.

| Actual local path                                         |      Bytes | SHA-256                                                            |
| --------------------------------------------------------- | ---------: | ------------------------------------------------------------------ |
| `references/model-candidates/f1-2022-free/origin.blend`   | 16,891,744 | `D2B324DA8F954CC2C13CBDFD0944E2C335DBC2C7B6DFC80ADA45091DDD05A1CA` |
| `references/model-candidates/f1-2022-free/origin.glb`     |  9,005,916 | `80F885292E8617186EA40C492AEBA7E8F21D42871BBCCF91DD743082252A388B` |
| `references/model-candidates/formula-1-2022/origin.blend` | 14,238,080 | `789CA355E6884090C0A6B36D878187791C52FEF2A09AB2CDEC4AF7F4FD1EC235` |
| `references/model-candidates/formula-1-2022/origin.glb`   |  6,883,776 | `3BC57199B9AEB0BEFB979DE610167AEC28069816011822EAA0D14B009762BBA7` |

`references/podium-review.html` and other unrelated owner files remain in place.

## Reference and script repair

- Removed package scripts whose implementation was archived with obsolete R1/R2/R3/M3/M5 evidence tooling.
- Changed Showroom browser evidence output from deleted tracked docs to ignored `scratch/showroom-evidence/`.
- Changed EDS-G03 validation report defaults from deleted tracked docs to ignored `scratch/eds-g03/`.
- Verified every remaining direct `node scripts/...` package target exists.
- Searched runtime source, scripts, workflows, package configuration and README: no stale `docs/commercialization`, `scripts/blender`, or `vehicle-evolution` references remain.
- Updated README's inaccurate statement that the repository had no automated tests.

## Protected runtime and pipelines

- Production and review models under `public/models/` were not changed.
- The existing homepage and Showroom were not changed.
- `Auto Update F1 2026 Data` still invokes both `scripts/sync-openf1-sessions.js` and `scripts/update-2026-data.js` on its configured schedule.
- `Results Engine (manual prototype)` and its workflow remain unchanged.
- No files under `.github/workflows/`, `src/data/`, or the two automatic update scripts were changed by this cleanup.
- Pre-existing owner changes to `docs/cloudflare-migration-readiness.md`, untracked `.github/workflows/per-peds-ci.yml`, and `references/` were preserved and explicitly excluded from the cleanup commit scope.

## QA evidence

| Check                           | Result  | Evidence                                         |
| ------------------------------- | ------- | ------------------------------------------------ |
| `git diff --check`              | PASS    | exit 0; line-ending warnings only                |
| ESLint                          | PASS    | `npm run lint`, exit 0                           |
| TypeScript                      | PASS    | `npx tsc --noEmit`, exit 0                       |
| Unit tests                      | PASS    | 39 files / 281 tests, exit 0                     |
| Production build                | PASS    | 2,214 modules transformed, exit 0                |
| Commercial visual isolation     | PASS    | 28 source modules and 108 artifact files scanned |
| Package script target audit     | PASS    | all direct Node script targets exist             |
| Stale reference audit           | PASS    | no runtime/script/README references found        |
| Model-candidate integrity       | PASS    | 4 files present; hashes recorded above           |
| Manifest-to-Git audit           | PASS    | 721/721 tracked deletions mapped; 0 omissions    |
| Archive restore drill           | PASS    | complete copy and content-level checks completed |
| Browser smoke (isolated)        | PASS    | 14/14 route/viewport combinations                |
| Physical-device testing         | NOT RUN | cleanup-only scope                               |
| CI and data-workflow runs       | PENDING | requires the authorized branch push              |
| Preview / production deployment | NOT RUN | explicitly prohibited                            |

The browser smoke covered `/`, `/season/2026`, `/showroom`, `/teams`, `/drivers`, `/engineering`, and `/about` at 1440 x 900 and 375 x 812. Every route returned HTTP 200, rendered nonempty content, had no horizontal overflow, and produced no application exception. The first unrestricted local run recorded expected failures for blocked Google Fonts/Vercel telemetry and the unavailable Vite-local Jolpica function. A second isolated run stubbed only those three external/service boundaries and passed 14/14 with zero console errors, page errors, or failed requests. Screenshots and the JSON report are retained under ignored `scratch/cleanup-browser-smoke/`.

## Unverified items and residual risk

- Owner authorized branch delivery after the manifest, browser, restore, isolation, and Git-status checks.
- Remote CI and data-workflow evidence remains pending until after the branch push.
- Preview deployment and production smoke tests are outside this cleanup-only branch delivery.
- Blender application-level opening of the 13 restored compressed `.blend`/`.blend1` files was not run because Blender is unavailable; copy, size, signature, and archive integrity checks passed.
- Dependency vulnerability audit was not rerun; this cleanup introduces no dependency or lockfile change.

## Final decision

**GO**

Reason: the owner approved the cleanup review and authorized a push after the five requested verification gates. Manifest scope, runtime references, browser behavior, practical archive restoration, owner-change isolation, and unstaged Git state were verified locally.

Next required action: stage only the cleanup scope, commit and push to `Per-PEDS`, then inspect remote CI without triggering a deployment.
