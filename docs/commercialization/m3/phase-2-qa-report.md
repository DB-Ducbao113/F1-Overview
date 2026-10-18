# EDS QA Release Report - M3 Phase 2

**Candidate baseline SHA:** `257cea3a0891b9e4f6285d29f667456177238d9b`; the resulting M3 Phase 2 commit is recorded in the delivery handoff

**Target branch:** `Per-PEDS`

**Target environment:** local production build and preview at `127.0.0.1`

**Change summary:** original homepage/circuit visuals, offline circuit atlas, production Showroom isolation and commercial artifact guards

**Risk level:** HIGH - 3D rendering, production bundle composition and application-wide visual references

## Static checks

- ESLint: **PASS** - `npm run lint`, exit 0.
- TypeScript: **PASS** - `npx tsc --noEmit`, exit 0.
- Unit tests: **PASS** - `npm run test`, 32 files and 229 tests passed, exit 0.
- Integration tests: **PASS (scoped)** - circuit map, image migration and commercial-isolation regressions are included in the unit suite.
- Build: **PASS** - `npm run build`, 2,203 modules transformed, exit 0.
- Changed-file formatting: **PASS** - scoped Prettier write/check completed; generated SVGs remain generator-owned.
- Deterministic generation: **PASS** - two consecutive runs produced the same 25-file SHA-256: `1800024F04CF1C7666020F6D04609CB3E12F69207D95542917D6E6D5FB627379`.

## Functional checks

- Core functionality: **PASS** - homepage, team and driver directories/details, car detail, 2026 calendar and Showroom rendered in the browser harness.
- Circuit experience: **PASS** - calendar opens the circuit card, full review and offline atlas; the atlas supports layer switching, turn markers and zoom controls in source/tests.
- Showroom: **PASS** - WebGL canvas rendered with six livery controls and seven hotspot controls at both tested viewports.
- Image references: **PASS** - no broken images, legacy team/driver image requests or prohibited visual requests were observed.
- Browser: **PASS** - Chrome headless production preview across eight routes at 375x812 and 1440x900 (16 route/viewport combinations).
- Mobile: **PASS (synthetic touch viewport)** - no horizontal overflow at 375x812; physical-device touch/pinch is **NOT RUN**.
- Accessibility: **NOT RUN** - no full automated/manual accessibility audit was performed; dialog Escape behavior was exercised.
- SEO: **PASS (scoped)** - existing title/social metadata remained present and the retained OG asset path is documented; no indexability audit was required by this change.

## Specialized checks

- 3D Showroom: **PASS (functional)** - EDS-G01, six liveries, seven hotspots and canvas rendering verified. Real-GPU profiling and long-duration resource behavior are **NOT RUN**.
- Commercial artifact isolation: **PASS** - 14 legacy visual targets removed, 73 required EDS assets verified, 27 Showroom source modules and 94 emitted text artifacts scanned.
- Circuit remote dependencies: **PASS** - no runtime Unsplash, ArcGIS or OpenStreetMap tile request was observed. All 77 circuit-review image slots resolve to local EDS assets.
- Performance: **NOT RUN** - no comparable real-device performance benchmark was requested or available in this phase.
- Security: **PASS (scoped source review)** - no new external rendering host, HTML injection, secret handling or dependency was introduced; Leaflet packages were removed. Full dependency vulnerability audit was **NOT RUN**.
- Automated data source 1: **NOT APPLICABLE** - no release/deployment or data-pipeline change was authorized.
- Automated data source 2: **NOT APPLICABLE** - no release/deployment or data-pipeline change was authorized.

## CI/CD

- Required GitHub Actions: **PENDING** - the candidate was locally verified before commit; branch CI status must be checked after push.
- Preview deployment: **NOT APPLICABLE** - local preview only.
- Production deployment: **NOT APPLICABLE** - explicitly out of scope.
- Production smoke tests: **NOT APPLICABLE**.

## Defects

- P0: none observed.
- P1: none observed.
- P2: none observed.
- P3/P4: none attributed to this change.

The local static preview logged expected failures for Vercel Analytics scripts (`/_vercel/...`, HTTP 404) and the serverless Jolpica proxy (`/api/jolpica`, HTTP 500). These are preview-environment limitations, were separated from application failures by the harness, and did not produce broken local assets or prohibited visual requests.

## Evidence

- Commands and exit codes: generator x2, ESLint, TypeScript, tests, build, browser QA and comparison capture all exited 0.
- Screenshots: `docs/commercialization/m3/evidence/phase-2-after/` covers homepage, teams, drivers, circuit calendar, offline atlas and Showroom at mobile/desktop sizes.
- Before/after: `docs/commercialization/m3/evidence/phase-2-comparison/` contains homepage and circuit visual comparisons.
- Bundle evidence: build output reports commercial artifact pruning and import/artifact isolation scan counts.

## Unverified items

- Physical-device touch, pinch and rotation.
- Real-GPU performance and long-duration thermal/memory behavior.
- Full accessibility audit.
- CI status for a future committed revision.
- Independent legal review of Podium branding, EDS-G01 and circuit geometry provenance.

## Residual risks

- Repository authorship and deterministic generation reduce dependency risk but do not constitute legal clearance.
- Legacy source assets remain in the repository for local comparison/rollback and therefore rely on the build guards remaining mandatory.
- Local preview cannot validate hosted serverless proxies or analytics scripts.

## Final decision: HOLD

**Reason:** branch-local functional and build acceptance passed, but launch-gate physical-device, CI and independent rights evidence remain incomplete.

**Next required action:** inspect branch CI for the committed candidate. Keep physical-device and rights review in the pre-commercial launch gate.
