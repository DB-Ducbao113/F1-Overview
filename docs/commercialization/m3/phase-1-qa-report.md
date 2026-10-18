# EDS QA RELEASE REPORT — M3 Phase 1

**Commit SHA:** captured by the M3 Phase 1 commit containing this report

**Target branch:** `Per-PEDS`

**Target environment:** local production build and Chrome browser

**Change summary:** original EDS team/car studies, abstract driver profiles, neutral constructor identifiers, provenance and commercial artifact containment
**Risk level:** HIGH — application-wide visual replacement and rights containment

## M2 closure

- M2 final closure commit: `927a4907d4539a82593141d7bbfeb03f1f7dd7ea`.
- Local `HEAD` and `origin/Per-PEDS` matched that SHA before M3 implementation.
- Milestone status: **M2 FUNCTIONAL ACCEPTANCE: COMPLETE.**
- Physical-device gestures, long thermal/memory soak, optional further low-end GPU work and formal rights review are carried to the pre-commercial launch gate.

## STATIC CHECKS

- ESLint: **PASS** — `npm run lint`, exit 0.
- TypeScript: **PASS** — `npx tsc --noEmit`, exit 0.
- Unit tests: **PASS** — 31 files / 226 tests, exit 0.
- Integration tests: **NOT APPLICABLE** — no service contract or data workflow changed.
- Build: **PASS** — Vite 6.4.3 transformed 2,208 modules; commercial guard removed 11 legacy visual targets and required 48 original EDS assets.
- Changed-file formatting: **PASS** — scoped Prettier check, exit 0.
- Reproducible generation: **PASS** — 39/39 files byte-identical after regeneration; asset-set SHA-256 `5857824189A4D5445F5200F75A8A1C6B6F6C6881821B4956D51A95B7EAA165BE`.

## FUNCTIONAL CHECKS

- Core functionality: **PASS** — homepage, team directory/detail, driver directory/detail and car detail loaded original assets.
- Regression: **PASS** — factual driver/team content and route structure remained unchanged.
- Browser: **PASS** — Chrome checked six routes at 375×812 and 1440×900; 12 route/viewport combinations reported zero broken images, zero legacy team/driver bitmap references, zero horizontal overflow, zero page exceptions and zero unexpected local request failures.
- Mobile: **PASS in emulation** — 375×812 layout and image decode verified. Physical touch testing remains a launch-gate item.
- Accessibility: **PASS for changed visuals** — meaningful alternative text and SVG title/description metadata are present.
- SEO: **NOT APPLICABLE** — metadata and indexing behavior were not modified.

## SPECIALIZED CHECKS

- 3D Showroom: **PASS / UNCHANGED** — M2 model and interaction code were not modified by M3 Phase 1.
- Performance: **PASS for asset transfer footprint** — the 39 generated SVGs total 109,560 bytes versus 5,989,908 bytes for the replaced 39 bitmap sources, a 98.2% reduction before HTTP compression. No formal Web Vitals run was required for this phase.
- Security: **PASS** — generated SVGs contain no external image, data URI, script or network reference.
- Automated data source 1: **NOT APPLICABLE** — no data workflow change and production is permanently out of scope.
- Automated data source 2: **NOT APPLICABLE** — no data workflow change and production is permanently out of scope.

## CI/CD

- Required GitHub Actions: **NOT RUN** — M3 changes are intentionally uncommitted.
- Preview deployment: **NOT APPLICABLE**.
- Production deployment: **NOT APPLICABLE**.
- Production smoke tests: **NOT APPLICABLE**.

## DEFECTS

- P0: none.
- P1: none.
- P2 `EDS-M3-CONT-001`: the production Showroom JavaScript chunk still contains pre-existing DEV-comparison livery/hotspot/logo data because legacy and original implementations share modules. Legacy public files are absent, but source-level bundle isolation remains required before commercial launch.
- P3 `EDS-M3-QA-002`: Vite preview cannot serve Vercel analytics scripts or the serverless Jolpica proxy; these known preview-only failures were recorded separately and did not hide application-local asset failures.

## EVIDENCE

- Commands and exit codes: recorded above.
- Browser harness: `scripts/qa-m3-visual-assets.mjs`.
- Visual inspection: desktop team cards and desktop/mobile driver cards showed the original EDS studies without clipping or broken layout.
- Build containment: `dist/images/teams`, `dist/images/drivers`, the C42 GLB, branded wheel texture and legacy Showroom image directories were absent after build.

## UNVERIFIED ITEMS

- Physical-device touch behavior and assistive-technology screen-reader traversal.
- Formal legal review of factual racing numbers, brand identity and all remaining third-party rights.
- Real deployment behavior, by explicit scope exclusion.

## RESIDUAL RISKS

- Local circuit photographs, Unsplash images, ArcGIS imagery and the unprovenanced homepage hero remain for later M3 phases.
- Known legacy comparison code must be isolated from production JavaScript before commercial launch.

## FINAL DECISION: HOLD

**REASON:** M3 Phase 1 implementation and branch-local QA pass, but the changes are intentionally awaiting review and the known legacy Showroom code-bundle dependency remains unresolved for the commercial launch gate.

**NEXT REQUIRED ACTION:** review the uncommitted M3 Phase 1 diff, then isolate legacy Showroom modules and replace the remaining circuit/home/social imagery in the next M3 phase.
