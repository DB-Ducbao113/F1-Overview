# Performance V2 post-implementation review

Review date: 2026-10-14 (UTC+7)  
Branch: `perf/speed-insights-v2`  
Base: `main` at `cfbd651390c151a8746e3cccc39fe15e32611429`  
Reviewed head: `517da27e1b4703bdd70569e2b937637e5c7b83a7`

## Scope and commit identity

`517da27` contains the M0 evidence, guarded load-test architecture, API proxy/cache changes, and the consolidated scaffold history. The branch is ahead of `main` by the commits below; it has not been merged to `main`.

- `bc78532` — M0 evidence and release gates.
- `c4529dd` — preview-only load-test harness and proxy safeguards.
- `8a7abdb` — preserved scaffold creator/QR changes, already represented by the current tree.
- `a5fb498`, `517da27` — consolidation merge commits.

The M0 Lighthouse, network, trace, and visual evidence describes production built from `cfbd651` only. It is a valid baseline, not a before/after measurement of `517da27`.

## Verification

| Check                                  | Result              | Evidence                                                                                                                                                       |
| -------------------------------------- | ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Format                                 | Pass                | `npm run format:check`                                                                                                                                         |
| Lint                                   | Pass                | `npm run lint`                                                                                                                                                 |
| Unit tests and coverage                | Pass                | 26 files, 202 tests; 63.20% statements, 63.96% lines in the configured `src` scope                                                                             |
| Production build                       | Pass                | `npm run build:check`; initial JS 109.4 KiB gzip, below 180 KiB                                                                                                |
| Guard accepts an explicit preview host | Pass                | `load:validate` accepted `https://preview-example.vercel.app`                                                                                                  |
| Guard rejects production               | Pass                | `load:validate` rejected `https://podiumeds.vercel.app`                                                                                                        |
| Vercel commit status                   | Pass                | GitHub commit status named `Vercel` reports success and links to deployment `Fw2VxUbM3uKEGAyauh8tYCujp21w`                                                     |
| CI for reviewed SHA                    | Unverified / absent | `ci.yml` only pushes on `main`, `develop`, `feature/**`, `fix/**`, and `chore/**`; it does not include `perf/**`. No workflow run exists for the reviewed SHA. |
| Docker workflow for reviewed SHA       | Unverified / absent | `docker-publish.yml` only pushes on `main` or tags. No workflow run exists for the reviewed SHA.                                                               |
| Preview Smoke workflow                 | Unverified / absent | No run is attached to the reviewed SHA. The Vercel success commit status does not prove the `deployment_status` workflow ran.                                  |

No high-load, spike, soak, or production test was run in this review.

## Load-test architecture review

### Verified controls

- `scripts/load-test/lib.js` requires an explicit HTTPS host match and rejects `podiumeds.vercel.app` before k6 sends a request.
- `scripts/load-test/validate.mjs` provides the same production-host rejection for operator preflight.
- `server/loadTest.ts` exposes simulated data only when `VERCEL_ENV=preview`, `LOAD_TEST_TOKEN` exists, and the request token matches. Production simulation attempts return `403`.
- `api/openf1.ts` and `api/jolpica.ts` accept only GET/OPTIONS, use endpoint/path allowlists, cap result windows, and apply origin allowlists without wildcard Vercel origins.
- OpenF1 has a 12-second in-memory TTL, single-flight suppression, 5-minute bounded stale fallback, timeout, and a 200-entry cap. Jolpica has a 15-minute in-memory TTL, bounded offset/limit, stale fallback, timeout, and a 200-entry cap.
- Simulated responses set `private, no-store`, so fixture/fault responses are not retained by the CDN.
- `preview-smoke.yml` accepts only successful deployments labelled `Preview`; it validates the target through the k6 safety gate before running the low-rate live smoke.

### Corrections required

1. **High-load scripts are not simulation-enforced.** `load.js`, `spike.js`, `soak.js`, and `fault.js` permit `DATA_MODE=live`. The README instructs operators to use `simulated`, but a valid preview invocation can still apply high traffic to OpenF1 or Jolpica. This must be code-enforced before any high-load run.
2. **Fixture authorization has incomplete direct coverage.** `critical-fixes.test.ts` proves preview-only simulated OpenF1 and production rejection, but does not directly cover Jolpica simulation, each fault response, or the load-test request guard itself.
3. **Cache evidence is planned, not collected.** The scripts check JSON validity and can record headers, but no committed preview ledger, `X-Vercel-Cache`, function-log sample, or controlled cache run exists for this SHA. In-memory `X-Cache` behavior should not be treated as CDN evidence.
4. **Preview smoke is not proven.** No run is attached to this SHA, so the workflow's Vercel environment name, secret availability, and target URL behavior remain unverified.

## M0 evidence review

The evidence set is useful and internally consistent for the baseline: three home cold-loads, one diagnostic run for each remaining route/form factor, network waterfalls, two traces, screenshots, and bundle sizes. It correctly avoids claiming a performance gain from M0.

The following limitations need correction in later milestones:

- `release-gates.md` says Chrome and Lighthouse are pinned in CI, but no Lighthouse dependency or CI job exists. The current version is recorded in the audit, not enforced.
- The deployment gate requires CI and Docker success for the target commit, but their branch filters exclude `perf/**`. The gate cannot pass for this branch without a pull request or an explicit trigger change.
- The "all seven routes" screenshots and smoke result are production baseline evidence for `cfbd651`, not visual validation of `517da27`.
- Every non-homepage route has only one cold diagnostic run. It is insufficient to accept an optimization.
- Field RES and `Unknown` attribution remain seven-day, multi-deployment observations. They cannot establish a result for this branch or prove INP.
- The Showroom trace establishes severe total main-thread work but does not partition texture creation, shader/program compilation, GLB parse, and steady frame rendering. An M3 implementation must collect that partition before reducing quality.

## Showroom assessment

M0 records 33,251 ms desktop TBT and 154,181 ms mobile TBT under Lighthouse throttling. The route payload is about 2.60 MiB, including the 2.11 MiB decoded GLB and 249.9 KiB transferred Three.js vendor chunk. Current source already pauses the canvas outside the viewport or in a hidden tab via `frameloop={isCanvasActive ? 'always' : 'never'}` and caps DPR at 1.25. Those controls are useful, but cannot explain the trace without phase-specific measurement.

Texture initialization is distinct from steady rendering:

- `F1Car3DModel.tsx` creates livery textures at mount/team change.
- `StudioW15Stage.tsx` creates four backdrop textures at 1024×512 and disposes them on replacement/unmount.
- `F1CarTextures.ts` creates multiple 512×512 and 1024×1024 canvas textures with mipmaps; pixel loops and texture upload can block the initial phase.
- `CameraController.tsx`, auto-rotation, controls, lighting, and an `always` frame loop create continuing cost after initialization.

The right M3 strategy is to collect an initialization-only trace and an idle 10-second frame timeline separately; retain full desktop quality after a device capability check; use demand/invalidated rendering at rest; lower DPR and texture resolution only on constrained mobile/GPU classes; and fix the existing 390px stage/control overflow as a separate visual acceptance gate.

## Revised milestone order

1. Repair the verification path: add `perf/**` CI coverage or open a PR, make high-load simulation mandatory, and add focused server/load-test tests.
2. M1 critical path: fonts/CLS, hero discovery, intro/LCP stability, off-screen team images, logo dimensions/assets, explicit route attribution.
3. Re-run three cold measurements for Homepage and Season 2026 against the deployed candidate; compare median values only.
4. M2 only after route navigation profiler/network evidence identifies work beyond font and image effects.
5. M3 showroom phase profile, adaptive rendering, and mobile overflow repair.
6. M4 free CI performance/visual gates, then M5 deployment and field validation.

## Decision

**NO-GO for a production performance claim or merge to `main`.** Local correctness checks and Vercel's success status pass, but relevant CI/Docker/preview-smoke execution is absent, no current-branch production measurement exists, and high-load scripts are not simulation-enforced. This is a GO for the narrow M1 planning work only.
