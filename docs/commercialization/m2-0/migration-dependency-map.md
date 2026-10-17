# EDS-M2.0-05 — Migration Dependency Map & Implementation Graph

**Document Reference:** `docs/commercialization/m2-0/migration-dependency-map.md`  
**Project:** Podium Effet De Sol (EDS)  
**Branch Audited:** `Per-PEDS` (commit `68a7e8c`)  
**Audit Date:** 2026-10-17  
**Auditors:** Senior Software Architect, DevOps Release Engineer, Senior QA Engineer / SDET

---

## 1. Executive Summary

This document charts the complete technical dependency graph, execution sequence, critical path, component interconnections, and test prerequisites for the original-IP commercialization migration of Podium Effet De Sol.

To ensure zero production downtime and prevent test suite regressions, changes are decoupled into **6 sequential sub-milestones (M2.1 through M2.6)**. No phase may begin until its prerequisite acceptance gates are verified.

---

## 2. Phased Migration Execution Graph

```
┌────────────────────────────────────────────────────────────────────────┐
│                        PHASED MIGRATION TIMELINE                       │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ [M2.1] Data Pipeline Containment & Legal Gate                          │
│ • Implement DATA_PIPELINE_MODE toggle in sync-openf1-sessions.js       │
│ • Decommission live-timing scraping; lock to Jolpica API only          │
│ • Preserve openF1SessionResults2026.json static schema on disk         │
│ • PREREQUISITE GATE: Owner written authorization                       │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ [M2.2] 3D Chassis Authoring & Geometry Integration                     │
│ • Author original EDS-G01 Meshopt GLTF model (9 primitive slots)       │
│ • Map 6 interactive hotspots in hotspotsData.ts to EDS-G01 coords      │
│ • Author bespoke eds_wheel_base.webp (EDS Competition sidewall)        │
│ • Retain OrbitControls, camera tweening, and WebGL memory disposal     │
│ • PREREQUISITE GATE: 60 FPS mobile benchmark parity                    │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ [M2.3] Procedural Livery Decoupling & Vector Branding                  │
│ • Decommission 19 trademark vector functions in F1CarTextures.ts       │
│ • Deploy 6 Original Motorsport Engineering Livery Presets              │
│ • Decouple ConstructorLogo.tsx into neutral technical badges           │
│ • Preserve drawCarbonWeave() and drawCoolingLouvres() algorithms       │
│ • PREREQUISITE GATE: F1CarTextures.test.ts & WheelLivery.test.ts PASS  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ [M2.4] 2D Media Asset Overhaul & Test Fixture Updates                  │
│ • Deploy 11 EDS-G01 CAD technical schematics (schematics/*.webp)       │
│ • Deploy 66 EDS-G01 high-res closeup renders (closeups/*.webp)         │
│ • Deploy 11 EDS-G01 team configuration studio teasers (teams/*.webp)   │
│ • Update SchematicComparisonModal.test.tsx assertions                  │
│ • PREREQUISITE GATE: SchematicComparisonModal.test.tsx 14/14 PASS      │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ [M2.5] Infrastructure, SEO & Privacy CMP Deployment                    │
│ • Migrate production hosting to Cloudflare Pages (or Vercel Pro)       │
│ • Deploy reactive dynamic canonical tag in App.tsx (fixing index.html) │
│ • Deploy scripts/generate-sitemap.mjs for dynamic route indexing       │
│ • Deploy GDPR Cookie Consent banner and /privacy, /terms, /cookies     │
│ • PREREQUISITE GATE: SEO canonical verification & privacy audit        │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ [M2.6] QA Full Regression, Core Web Vitals Gate & Release Sign-Off     │
│ • 100% Vitest suite verification (194/194 tests)                       │
│ • Playwright E2E real-browser visual regression testing                │
│ • Performance benchmarks: LCP ≤ 2.5s, CLS ≤ 0.1, INP ≤ 200ms           │
│ • FINAL GATE: SDET Formal Release Gatekeeper GO Sign-off               │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Subsystem Interconnection Matrix

The following matrix identifies which source modules, data files, and test suites are affected by each migration component:

| Migration Component        | Direct Source Files Modified                                                                                             | Dependent Subsystems / Importers                                                                                                                         | Impacted Test Suites                                                                                       | Critical Risk / Breakage Mode                                                                                                                          |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Pipeline 1 Containment** | `scripts/sync-openf1-sessions.js`<br>`.github/workflows/auto-update-f1.yml`                                              | `src/data/championship/openF1SessionResults2026.json`<br>`src/data/championship/openF1SprintBridge.ts`<br>`src/components/championship/RaceCalendar.tsx` | `src/services/critical-fixes.test.ts`<br>`src/services/sprint-standings.test.ts`                           | Deleting or emptying `openF1SessionResults2026.json` causes build failure in Vite. Must preserve valid JSON schema.                                    |
| **EDS-G01 3D Model**       | `public/models/eds-g01.glb`<br>`src/components/showroom/F1Car3DModel.tsx`                                                | `src/components/showroom/ShowroomScene.tsx`<br>`src/components/showroom/ShowroomView.tsx`<br>`src/data/showroom/hotspotsData.ts`                         | Showroom E2E Playwright canvas test<br>WebGL memory leak test                                              | Mismatched mesh primitive names will break material assignment in `F1Car3DModel.tsx:122-180`. Must match 9-slot primitive contract.                    |
| **Wheel Texture Asset**    | `public/textures/eds_wheel_base.webp`<br>`src/components/showroom/F1Car3DModel.tsx:106`                                  | `src/components/showroom/F1CarTextures.ts:generateWheelTexture`                                                                                          | `src/components/showroom/WheelLivery.test.ts`                                                              | Removing BBS/Pirelli tokens breaks `WheelLivery.test.ts` assertions. Test must be updated to expect EDS Competition tokens.                            |
| **Procedural Textures**    | `src/components/showroom/F1CarTextures.ts`<br>`src/data/showroom/teamLiveries.ts`<br>`src/data/showroom/teamSponsors.ts` | `src/components/showroom/F1Car3DModel.tsx`<br>`src/components/showroom/StudioBackdropTexture.ts`                                                         | `src/components/showroom/F1CarTextures.test.ts`<br>`src/components/showroom/StudioBackdropTexture.test.ts` | Altering exported function signatures breaks `F1CarTextures.test.ts`. Must retain `drawCoolingLouvres` and `drawCarbonWeave`.                          |
| **CAD Schematics**         | `public/images/showroom/schematics/*.webp`<br>`src/components/showroom/SchematicComparisonModal.tsx`                     | `src/components/showroom/ShowroomView.tsx`                                                                                                               | `src/components/showroom/SchematicComparisonModal.test.tsx` (14 tests)                                     | Changing schematic filenames or blueprint titles (`MERC-W15-AERO-8K`) will immediately fail 14 unit tests. Assertions must be refactored concurrently. |
| **Constructor Badges**     | `src/components/common/ConstructorLogo.tsx`<br>`src/data/showroom/teamLogoSVGs.ts`                                       | `ChampionshipView.tsx`<br>`RaceCalendar.tsx`<br>`TeamsDirectoryPage.tsx`<br>`TeamDetailPage.tsx`                                                         | `src/components/common/BrandLogo.test.tsx`                                                                 | Broken SVG viewBox or missing exports will cause React component render crashes in championship tables.                                                |
| **Circuit Map Tiles**      | `src/components/championship/CircuitTrackMap.tsx`                                                                        | `ChampionshipView.tsx`<br>`RaceCalendar.tsx`                                                                                                             | `src/components/championship/CircuitTrackMap.test.tsx` (10 tests)                                          | Changing tile layer URL must preserve Leaflet tile mock responses in tests.                                                                            |
| **Canonical SEO Head**     | `src/App.tsx`<br>`index.html`                                                                                            | Client-side router history                                                                                                                               | Playwright route title & canonical tag inspection                                                          | Incomplete helmet wrapper can cause hydration mismatch warnings.                                                                                       |

---

## 4. Test Prerequisites & Regression Prevention Strategy

To ensure strict adherence to `AGENTS.md` ("No evidence = No approval; Never delete or weaken tests to pass a build"), the following test update protocol is enforced:

### 4.1 `SchematicComparisonModal.test.tsx` Refactor Protocol

- **Current State:**
  ```tsx
  expect(html).toContain('/images/showroom/schematics/mercedes.webp');
  expect(html).toContain('MERC-W15-AERO-8K');
  ```
- **Prerequisite Update:** When replacing CAD schematics in M2.4, update the blueprint metadata registry in `SchematicComparisonModal.tsx` and the test expectations in `SchematicComparisonModal.test.tsx` simultaneously to match the new EDS-G01 technical configurations (e.g., `EDS-G01-AERO-SPEC-01`).
- **Forbidden:** Never skip or comment out tests. All 14 tests must continue to assert valid markup, image paths, and localization.

### 4.2 `WheelLivery.test.ts` Refactor Protocol

- **Current State:** Asserts `wheelCoverColor`, `wheelAccentColor`, `wheelRimColor`, and `wheelPirelliCompound`.
- **Prerequisite Update:** When replacing Pirelli compound names with original compound identifiers (`soft` → `eds-s90`, `medium` → `eds-m50`, `hard` → `eds-h10`), update the test enum validation in `WheelLivery.test.ts`.

### 4.3 `F1CarTextures.test.ts` Refactor Protocol

- **Current State:** Verifies sidepod cooling louvres and upper decks across all 11 teams using mock canvas contexts.
- **Guarantee:** `drawCoolingLouvres` is a 100% original mathematical function. It will be completely preserved, ensuring all 11 cooling louvre tests pass without modification.

---

## 5. Critical Path & Resource Allocation

```text
========================================================================================
                          CRITICAL PATH ANALYSIS
========================================================================================
CRITICAL PATH:
M2.1 (Containment) ──► M2.2 (EDS-G01 GLTF) ──► M2.3 (Texture Presets)
  ──► M2.4 (2D Media & Tests) ──► M2.5 (Infra & SEO) ──► M2.6 (QA Gate)

ESTIMATED ENGINEERING EFFORT PER STAGE:
- M2.1: Data Pipeline Containment:         4 – 6 hours
- M2.2: 3D Chassis Authoring (EDS-G01):    16 – 24 hours
- M2.3: Procedural Livery Presets:         8 – 12 hours
- M2.4: 2D Media Overhaul & Test Sync:     8 – 12 hours
- M2.5: Infrastructure, CMP & SEO:         6 – 8 hours
- M2.6: QA E2E & Web Vitals Gate:          6 – 8 hours
----------------------------------------------------------------------------------------
TOTAL PROJECTED IMPLEMENTATION EFFORT:     48 – 70 engineering hours
========================================================================================
```

---

## 6. Dependency Map Approval

- **Architecture Gatekeeper:** APPROVED FOR M2.1 PLANNING
- **Execution Constraint:** Implementation is BLOCKED until owner authorization is granted.
