# EDS-M1 — Commercialization Readiness & Original IP Audit: Final Decision Report

**Project:** Podium Effet De Sol (EDS)  
**Branch Audited:** `Per-PEDS` (commit `989a0e7` based on `version-1.3`, cross-referenced with `main` at `2779cac`)  
**Audit Milestone:** M1 (Commercialization Readiness & Original IP Audit)  
**Date:** 2026-10-17  
**Gatekeepers:** Principal Software Architect, IP Asset Auditor, Senior QA Engineer, DevOps Release Engineer  

---

## 1. Executive Summary & Audit Overview

Under milestone EDS-M1, a rigorous multi-disciplinary audit of the Podium Effet De Sol codebase, static assets, 3D showroom pipeline, third-party licenses, data ingestion pipelines, and hosting configuration was performed.

### Verified Architecture Baseline:
- **Application Engine:** Single Page Application built on React 18.3.1, TypeScript 5.5.3, Vite 6.4.3, Three.js 0.165.0, `@react-three/fiber` 8.16.8, `@react-three/drei` 9.108.4, Zustand 4.5.4, and Tailwind CSS 3.4.4.
- **Production Infrastructure:** Hosted on Vercel (`podiumeds.vercel.app`) with serverless edge functions (`api/openf1.ts`, `api/jolpica.ts`), supported by an unprivileged non-root Docker / Nginx 1.27 container setup.
- **Dual Automatic Data Pipelines:**
  1. `sync-openf1-sessions.js`: Scrapes official Formula 1 live timing static servers with spoofed User-Agent and jitter backoff, falling back to Jolpica.
  2. `update-2026-data.js`: Automatically ingests 2026 race results, sprint classifications, and standings from `api.jolpi.ca/ergast/f1`.

---

## 2. Evidence of Executed Static Quality Gates

All checks were executed locally on the working branch with the following verifiable results:

| Quality Gate | Command Executed | Exit Code | Result | Key Observations & Evidence |
|---|---|---|---|---|
| **TypeScript** | `npx tsc --noEmit` | `0` | **PASS** | 0 type errors across all application and script files. |
| **Focused Lint** | `npx eslint src api scripts` | `0` | **PASS** | 0 ESLint errors and 0 warnings across all active source code. |
| **Root Lint** | `npm run lint` (`eslint .`) | `1` | **DEFECT** | Fails with `RangeError: Invalid string length` due to untracked `dist-*` directories unignored in `eslint.config.js`. |
| **Unit & Integration Tests** | `npm test` (`vitest run`) | `0` | **PASS** | **194 passed out of 194 tests across 25 test files** (duration: 18.37s). |
| **Production Build** | `npm run build` | `0` | **PASS** | 2,199 modules transformed in 12.24s. Vendor chunking verified. |
| **Security Audit** | `npm audit` | `1` | **FAIL (HIGH)** | 8 vulnerabilities (2 moderate, 6 high in `braces` and `source-map-js` build tools). |
| **Code Formatting** | `npm run format:check` | `1` | **FAIL** | Style deviations in untracked benchmark outputs and 271 project files. |

---

## 3. Risk Summary & Affected File Paths

| Risk Category | Severity | Affected File Paths / Subsystems | Impact on Commercialization |
|---|---|---|---|
| **3D Automotive Trade Dress** | **P0 (CRITICAL)** | `public/models/c42.v2.glb`<br>`src/components/showroom/F1Car3DModel.tsx` | High risk of trade dress / design patent infringement claims by Alfa Romeo / Sauber / Stellantis. |
| **Procedural Trademark Logos** | **P0 (CRITICAL)** | `src/components/showroom/F1CarTextures.ts`<br>`src/data/showroom/teamLogoSVGs.ts`<br>`src/components/common/ConstructorLogo.tsx` | Procedurally draws 18 registered trademarks (Ferrari, HP, Shell, Mercedes, Red Bull, etc.) without authorization. |
| **Automated Server Scraping** | **P0 (CRITICAL)** | `scripts/sync-openf1-sessions.js`<br>`.github/workflows/auto-update-f1.yml` | Scrapes `livetiming.formula1.com` using spoofed Chrome User-Agent in direct violation of FOM website terms. |
| **Hosting Terms Violation** | **P0 (CRITICAL)** | `vercel.json`<br>`https://podiumeds.vercel.app` | Vercel Hobby tier strictly prohibits commercial operation, advertising, sponsorships, or monetization. |
| **Canonical SEO De-indexing** | **P1 (HIGH)** | `index.html` (Line 50) | Hardcoded canonical tag pointing to root `/` causes Google to de-index all inner pages. |
| **Unlicensed Satellite Tiles** | **P1 (HIGH)** | `src/components/championship/CircuitTrackMap.tsx` | Unauthenticated commercial calls to Esri ArcGIS World Imagery violate Esri Terms of Use. |
| **Missing Consent / CMP** | **P2 (MEDIUM)** | `index.html`<br>`src/main.tsx` | Commercial deployment lacks GDPR/CCPA cookie consent and privacy policies. |

---

## 4. Unresolved Legal & Licensing Questions

Before final commercial launch, the project owner should obtain formal counsel on:
1. **Factual Sports Data Fair Use**: Scope of permissible commercial display of Grand Prix names, driver lap times, and official standings derived from Jolpica / Ergast under EU Database Directive (Directive 96/9/EC) and US common law.
2. **Driver Publicity Rights**: Use of real-world active driver names (Lewis Hamilton, Max Verstappen, etc.) within non-endorsing technical editorial contexts versus commercial merchandising boundaries.
3. **Nominative Fair Use Boundaries**: Safe use of team names solely to identify historical racing results without implying official partnership or sponsorship.

---

## 5. Implementation Roadmap & Estimated Engineering Effort (Phase 2)

```
┌────────────────────────────────────────────────────────────────────────┐
│                   PHASE 2 IMPLEMENTATION TIMELINE                      │
├───────────────────────────────────────────────────┬────────────────────┤
│ Task Description                                  │ Estimated Effort   │
├───────────────────────────────────────────────────┼────────────────────┤
│ 1. 3D Chassis Authoring & GLTF Optimization (EDS-G01)│ 16 – 24 hours    │
│ 2. F1Car3DModel.tsx Modular Refactor & Hotspot Map│ 6 – 8 hours        │
│ 3. Decommission Trademark Vectors & Deploy 6 Presets│ 8 – 12 hours     │
│ 4. CAD Blueprint (11) & Technical Closeup (66) Renders│ 8 – 12 hours   │
│ 5. Decommission Scraping & Consolidate Jolpica Pipeline│ 4 – 6 hours   │
│ 6. Dynamic Canonical Tag & Dynamic Sitemap Script  │ 3 – 4 hours        │
│ 7. Host Migration (Cloudflare Pages or Vercel Pro) │ 3 – 5 hours        │
│ 8. GDPR CMP Integration & Privacy / Terms Pages    │ 4 – 6 hours        │
│ 9. Full QA E2E Playwright Regression & Benchmark   │ 6 – 8 hours        │
├───────────────────────────────────────────────────┼────────────────────┤
│ TOTAL ESTIMATED ENGINEERING EFFORT                │ 58 – 85 hours      │
└───────────────────────────────────────────────────┴────────────────────┘
```

---

## 6. Phase 2 Readiness Verdict

### FINAL DECISION: **HOLD**

### Rationale:
1. **Critical Legal & Commercial Blockers (P0)**: The current production model (`c42.v2.glb`) and texture generation engine (`F1CarTextures.ts`) contain unlicensable third-party automotive trade dress and registered corporate trademarks. Operating commercially in this state poses direct legal liability.
2. **Active Server Scraping (P0)**: Direct scraping of official Formula 1 timing infrastructure with spoofed headers is non-compliant with commercial standards.
3. **Infrastructure Non-Compliance (P0)**: Deployment is currently on Vercel Hobby, which forbids commercial monetization.
4. **Static Quality Verification**: The core application logic, TypeScript compiler, and unit test suite are in an exceptionally healthy state (**194/194 unit tests passing, 0 TypeScript errors**). The technical foundation is solid and ready for the migration.

### Required Owner Action to Achieve "GO":
Review and approve the 10 M1 audit deliverables located under `docs/commercialization/m1/`. Upon owner approval of the findings, Phase 2 (Implementation of the original EDS-G01 modular chassis, clean livery presets, and compliant data ingestion) may proceed.

---

**STATUS: M1 AUDIT COMPLETE. PHASE 2 AWAITING OWNER AUTHORIZATION.**
