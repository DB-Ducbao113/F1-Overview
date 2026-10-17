# EDS-M2.0-03 — Automated Data Pipeline Audit & Commercial Containment Plan

**Document Reference:** `docs/commercialization/m2-0/data-pipeline-containment-plan.md`  
**Project:** Podium Effet De Sol (EDS)  
**Branch Audited:** `Per-PEDS` (commit `68a7e8c`)  
**Audit Date:** 2026-10-17  
**Auditors:** Data Compliance Engineer, DevOps Release Engineer, Senior Software Architect, QA Release Gatekeeper

---

## 1. Executive Summary & Regulatory Context

Podium Effet De Sol operates **TWO independently configured automatic data update pipelines** within GitHub Actions (`.github/workflows/auto-update-f1.yml`). While these pipelines successfully synchronize live race classifications and driver standings, Pipeline 1 relies on automated web scraping of official Formula One timing infrastructure.

In a commercial context (operating with ads, sponsorships, subscriptions, or commercial entity ownership), unauthorized automated scraping with spoofed client headers violates binding terms of use and exposes the enterprise to technological circumvention claims.

This plan details the technical operation of both pipelines, maps all downstream frontend dependencies, defines a policy-based containment mechanism, and establishes non-negotiable governance requirements for commercial release.

---

## 2. Technical Code Audit of Both Automated Data Pipelines

### 2.1 Pipeline 1: `scripts/sync-openf1-sessions.js` (Session Classification Pipeline)

#### Configuration & Workflow Trigger:

- **Workflow File:** `.github/workflows/auto-update-f1.yml:47-49`
- **Execution Schedule:** `cron: '*/15 * * * 4,5,6,0'` (every 15 minutes UTC Thursday through Sunday during active race weekends).
- **Primary Upstream Source:** `https://livetiming.formula1.com/static/` (Formula One Digital Media Limited official live-timing archive).
- **Secondary Fallback Source:** `https://api.jolpi.ca/ergast/f1` (Jolpica API).
- **Target Output File:** `src/data/championship/openF1SessionResults2026.json`.

#### Specific Code Evidence of Unauthorized Scraping:

1. **User-Agent Header Spoofing (`scripts/sync-openf1-sessions.js:38-39`):**
   ```js
   const USER_AGENT =
     'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';
   ```
   _Analysis:_ The script hardcodes a desktop Windows Chrome browser User-Agent header to conceal its identity as an automated Node.js process and bypass bot filtering.
2. **Bot-Evasion Jitter Delays (`scripts/sync-openf1-sessions.js:50-51`):**
   ```js
   const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
   const jitterSleep = () => sleep(150 + Math.random() * 150);
   ```
   _Analysis:_ Generates randomized delays before JSON stream parsing to simulate human browsing patterns.
3. **Automated Retry on Bot-Protection HTTP 403 (`scripts/sync-openf1-sessions.js:125-134`):**
   ```js
   const retryable =
     response.status === 403 ||
     response.status === 408 ||
     response.status === 429 ||
     response.status >= 500;
   if (retryable && attempt < MAX_ATTEMPTS) {
     const backoff = Math.min(RETRY_BASE_MS * 2 ** attempt, RETRY_CAP_MS);
     await sleep(backoff + Math.random() * 500);
     return fetchText(url, attempt + 1);
   }
   ```
   _Analysis:_ Explicitly catches HTTP 403 (Forbidden / Bot Blocked) and executes up to 6 retries with exponential backoff to bypass Akamai / Cloudflare bot management.

#### Legal & Contractual Infringement Analysis:

- **Breach of FOM Terms:** Section 5.1 and 5.3 of the Formula One Digital Media Limited Terms of Use explicitly forbid:
  > _"using any robot, spider, scraper, deep link or other automated data gathering or extraction tools, program, algorithm or methodology to access, acquire, copy or monitor any portion of the Website."_
- **Circumvention Liability:** In commercial operations, intentionally bypassing technological access restrictions (spoofing headers to evade HTTP 403 blocks) creates severe legal exposure under the US Computer Fraud and Abuse Act (CFAA) and the UK Computer Misuse Act 1990.
- **Classification:** **P0 RELEASE BLOCKER**. Direct scraping of `livetiming.formula1.com` must be contained prior to commercial launch.

---

### 2.2 Pipeline 2: `scripts/update-2026-data.js` (Championship Standings & Results Pipeline)

#### Configuration & Workflow Trigger:

- **Workflow File:** `.github/workflows/auto-update-f1.yml:51-58`
- **Execution Schedule:** Runs immediately after Pipeline 1 in the same CI job.
- **Primary Upstream Source:** `https://api.jolpi.ca/ergast/f1` (Jolpica Ergast API).
- **Target Output Files:**
  - `src/data/championship/standings.ts` (Driver and Constructor standings tables).
  - `src/data/championship/results.ts` (`RACE_RESULTS_2026` array).
  - `src/services/standingsEngine.ts` (Cutoff rounds and podium calculations).
  - `src/store/useChampionshipStore.ts` (Active season status).

#### Technical Operation:

1. Skips automatic execution on Mondays and Tuesdays (lines 24-30) unless `--force` is supplied.
2. Ingests paginated JSON data from `api.jolpi.ca` for driver standings, constructor standings, and race results.
3. Normalizes team tokens (e.g. `red_bull` → `redbull`, `sauber` → `audi`).
4. Updates TypeScript source files directly on disk via regex AST replacements.
5. Employs timestamp normalization (`withoutStandingsTimestamp`) to avoid empty Git commits when data is unchanged.

#### Compliance & Legal Assessment:

- **No Spoofing / Public REST API:** Uses standard `node:https` without deceptive browser User-Agents.
- **Factual Sports Results:** Raw finishing positions, points, and race dates are factual numbers exempt from copyright protection (_Feist Publications_).
- **Rate-Limiting Compliance:** Runs sequentially with modest request counts (3–5 HTTP calls per CI run), well within Jolpica's fair use limit (4 req/sec).
- **Classification:** **P2 (COMPLIANT WITH RETENTION)**. Safe to retain with proper data attribution disclosures.

---

## 3. Downstream Frontend Dependency Mapping

The data generated by these pipelines is deeply integrated into the frontend application. Containment must ensure that disabling scraping does **not** break UI rendering:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        DATA PIPELINE DOWNSTREAM DEPENDENCY GRAPH                       │
├────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                        │
│ [Pipeline 1: sync-openf1-sessions.js]                                                  │
│         │                                                                              │
│         ▼                                                                              │
│   src/data/championship/openF1SessionResults2026.json                                  │
│         │                                                                              │
│         ├──► src/data/championship/openF1SprintBridge.ts                               │
│         │         │                                                                    │
│         │         ├──► src/services/standingsEngine.ts (Calculates sprint points)      │
│         │         └──► src/store/useChampionshipStore.ts                               │
│         │                                                                              │
│         └──► src/components/championship/RaceCalendar.tsx (Displays completed sessions)│
│                                                                                        │
├────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                        │
│ [Pipeline 2: update-2026-data.js]                                                      │
│         │                                                                              │
│         ├──► src/data/championship/standings.ts                                        │
│         │         │                                                                    │
│         │         ├──► src/components/championship/ChampionshipView.tsx                │
│         │         └──► src/components/championship/DriverStandingsTable.tsx            │
│         │                                                                              │
│         └──► src/data/championship/results.ts                                          │
│                   │                                                                    │
│                   └──► src/components/championship/RaceResultsTable.tsx                │
│                                                                                        │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### Critical Observation on Application Resilience:

If `openF1SessionResults2026.json` is missing or corrupted:

1. `openF1SprintBridge.ts` imports the file statically: `import openF1SessionResults from './openF1SessionResults2026.json';`. If the file is deleted, **Vite build fails with an unresolved import error.**
2. `RaceCalendar.tsx` imports the file directly.
3. **Containment Rule:** The physical file `src/data/championship/openF1SessionResults2026.json` MUST remain in the repository as a valid JSON structure at all times.

---

## 4. Policy-Based Pipeline Containment Architecture

To decouple the application from unauthorized scraping while preserving 100% production functionality, we propose a **Policy-Based Multi-Tier Ingestion Controller**:

### 4.1 Ingestion Policy Configuration Modes

```ts
export type DataPipelineMode =
  | 'compliant' // Commercial production: Jolpica API + committed snapshots only. Zero F1 scraping.
  | 'unrestricted' // Non-commercial testing only: Allows F1 live timing scraping (requires explicit flag).
  | 'simulation' // Offline CI/testing: Generates synthetic engineering telemetry.
  | 'frozen'; // Zero external network calls: Uses disk snapshots exclusively.
```

### 4.2 Code Containment Implementation (Proposed for M2.1)

In `scripts/sync-openf1-sessions.js`:

```js
// Environment-driven containment gate
const PIPELINE_MODE = process.env.DATA_PIPELINE_MODE || 'compliant';
const DISABLE_F1_SCRAPING =
  process.env.DISABLE_F1_SCRAPING === 'true' || PIPELINE_MODE === 'compliant';

if (DISABLE_F1_SCRAPING && (PINNED_SOURCE === 'f1' || !PINNED_SOURCE)) {
  console.log(
    '[sync-openf1-sessions] INFO: Direct F1 live-timing scraping is DISABLED under compliance policy.',
  );
  console.log('[sync-openf1-sessions] Switching source mode to: JOLPICA_ONLY.');

  // Gracefully divert execution to Jolpica API fallback without throwing
  await syncFromJolpica();
  process.exit(0);
}
```

### 4.3 GitHub Actions Workflow Containment (`auto-update-f1.yml`)

Update GitHub Actions step with strict policy controls:

```yaml
- name: Sync completed sessions (Compliant Mode)
  if: steps.check_ready.outputs.ready == 'true'
  env:
    DATA_PIPELINE_MODE: 'compliant'
    DISABLE_F1_SCRAPING: 'true'
  run: node scripts/sync-openf1-sessions.js --source=jolpica
```

---

## 5. Prohibition on Fabricated Data & Synthetic Integrity Rules

> [!IMPORTANT]
> **Strict Compliance Directive: Never Fabricate Real-World Race Data.**
>
> - If an external race result is not yet available from compliant data providers (e.g., Jolpica has not published FP3 or Sprint classifications), the system **MUST NOT** invent, estimate, or fabricate finishing times or driver positions to fill the UI.
> - Missing sessions must remain in the UI state as `"Upcoming"` or `"Awaiting Official Classification"`.
> - If simulated telemetry is generated for 3D engineering demonstrations or local CI testing, all mock objects must be explicitly marked with `isSimulated: true` and display a clear UI badge: `"Simulated Aerodynamic Test Dataset"`.

---

## 6. Pre-Implementation Governance & Approval Requirements

In accordance with `AGENTS.md` Stage 9 and Release Policy:

1. **No Pipeline Code Modified During M2.0:** This document serves as the architectural audit and containment design. No script or workflow changes will be committed until Milestone M2.1.
2. **Owner Authorization Gate:** The repository owner must explicitly review and sign off on the containment approach before modifying `.github/workflows/auto-update-f1.yml` or `scripts/sync-openf1-sessions.js`.
3. **Rollback Safety:** If Jolpica experiences an upstream outage, the existing static JSON files in `src/data/championship/` guarantee that the web application remains fully operational in read-only snapshot mode.

---

## 7. Containment Readiness Decision

- **Pipeline 1 (`sync-openf1-sessions.js`):** CONTAINMENT SPECIFICATION COMPLETE. Ready for policy-flag integration in M2.1 upon owner approval.
- **Pipeline 2 (`update-2026-data.js`):** COMPLIANT. Retained with data attribution notice.
- **Downstream Safety:** 100% verified. Zero build-breaking file removals.
