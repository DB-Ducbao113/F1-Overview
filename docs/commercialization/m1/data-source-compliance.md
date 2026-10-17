# EDS-M1.4 — Data Source Compliance & Pipeline Verification

**Project:** Podium Effet De Sol (EDS)  
**Branch Audited:** `Per-PEDS`  
**Audit Date:** 2026-10-17  
**Auditor:** Principal Software Architect & DevOps Release Gatekeeper  

---

## 1. Executive Summary

Podium Effet De Sol relies on **TWO independently operating automatic data update pipelines** and two client-facing serverless API proxies. For commercial readiness, all automated ingestion routines, third-party data providers, and caching mechanisms must be legally permissible, robust against upstream breaking changes, and free from intellectual property and website abuse liabilities.

---

## 2. In-Depth Analysis of Both Automated Update Pipelines

### Pipeline 1: `scripts/sync-openf1-sessions.js` (Session Classification Pipeline)

#### Configuration & Execution
- **Trigger:** Configured in `.github/workflows/auto-update-f1.yml` under cron schedule `*/15 * * * 4,5,6,0` (Thursday through Sunday every 15 minutes during race weekends).
- **Primary Upstream Source:** `https://livetiming.formula1.com/static/` (Formula One Digital Media Limited official live-timing archive).
- **Secondary Fallback Source:** `https://api.jolpi.ca/ergast/f1` (Jolpica Ergast API).
- **Target Output File:** `src/data/championship/openF1SessionResults2026.json`.

#### Technical Operation & Ingestion Logic
1. Attempts to fetch `Index.json` from the official F1 live timing server.
2. Identifies the latest active race meeting and downloads raw JSON streams (`DriverList.jsonStream`, `TimingData.jsonStream`, `TimingStats.jsonStream`).
3. Reconstructs full 22-driver classifications for Practice (FP1/FP2/FP3), Qualifying (Q1/Q2/Q3), and Sprint sessions.
4. If the F1 archive returns HTTP 403 (bot protection) or fails across 6 retries, falls back to `api.jolpi.ca/ergast/f1/2026/qualifying.json` and `sprint.json`.
5. Compares generated JSON against disk and writes only when an exact diff is observed.

#### Critical Compliance & Legal Risks
1. **Terms of Use Violation**: The Formula One official website terms explicitly forbid automated access, robotic extraction, or scraping of `livetiming.formula1.com` without a commercial digital license from Formula One Digital Media Limited.
2. **User-Agent Spoofing**: `sync-openf1-sessions.js` hardcodes a spoofed desktop Chrome User-Agent (`Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36... Chrome/131.0.0.0 Safari/537.36`) and introduces exponential backoff with jitter to evade bot detection. In a commercial entity, intentional technological circumvention of access controls creates potential CFAA / Computer Misuse Act and civil liability.
3. **Fragility & Outage Vulnerability**: Formula 1 actively tightens Akamai/Cloudflare bot management during Grand Prix sessions, resulting in frequent HTTP 403 blocks in CI environments.

---

### Pipeline 2: `scripts/update-2026-data.js` (Championship Standings & Results Pipeline)

#### Configuration & Execution
- **Trigger:** Follows Pipeline 1 in `.github/workflows/auto-update-f1.yml`.
- **Primary Upstream Source:** `https://api.jolpi.ca/ergast/f1` (Jolpica API).
- **Target Output Files:**
  - `src/data/championship/standings.ts` (Driver and Constructor standings tables).
  - `src/data/championship/results.ts` (`RACE_RESULTS_2026`).
  - `src/services/standingsEngine.ts` (Cutoff rounds).
  - `src/store/useChampionshipStore.ts` (Active season status).

#### Technical Operation & Ingestion Logic
1. Checks UTC day of week: Skips execution on Mondays and Tuesdays (unless `--force` is provided) to prevent redundant CI runs.
2. Fetches paginated driver standings (`driverStandings.json`), constructor standings (`constructorStandings.json`), and race results (`results.json`).
3. Maps third-party constructor IDs (e.g. `red_bull` → `redbull`, `sauber` → `audi`) and driver IDs.
4. Recalculates podium finishes and updates TypeScript source code files via AST/regex string replacement.
5. Employs timestamp normalization (`withoutStandingsTimestamp`) to guarantee that trivial timestamp changes alone do not trigger spurious Git commits or Vercel rebuilds.

#### Compliance & Legal Risks
1. **Ergast CC BY-NC-SA Heritage**: Jolpica is built as a modernized replacement for the legacy Ergast Developer API. Historical Ergast data was originally distributed under Creative Commons Attribution-NonCommercial-ShareAlike (CC BY-NC-SA). Commercial websites relying on CC BY-NC-SA data risk non-compliance if commercial profit is derived directly from the dataset.
2. **Factual Sports Data Protection**: While pure factual sports scores and times (e.g., "Driver X finished 1st in 1:23.456") are generally not copyrightable under US and international copyright law (e.g., *Feist Publications* doctrine), entire compiled databases can be protected under the EU Database Directive (Directive 96/9/EC) if substantial investment was made in obtaining or verifying the data.

---

## 3. Serverless API Proxies

### 3.1 `api/openf1.ts` (OpenF1 Proxy)
- **Upstream Origin:** `https://api.openf1.org/v1`
- **Allowlist Enforced:** `sessions`, `drivers`, `location`, `car_data`, `position`, `race_control`, `meetings`.
- **CORS Protection:** Strict origin allowlist (`ALLOWED_ORIGINS`). Blocks unauthorized third-party origins; rejects wildcard `*`.
- **Edge Caching & In-Flight Coalescing:**
  - In-memory response cache: `MAX_CACHE_ENTRIES = 200`, `CACHE_TTL_MS = 12_000` (12s fresh).
  - Single-flight coalescing (`inflight.set`): Absorbs concurrent client requests to prevent upstream rate-limiting.
  - Stale fallback: Serves cached data up to 5 minutes (`STALE_MAX_AGE_MS = 300_000`) during upstream outages.
- **Risk Assessment:** OpenF1 is an independent open-source project. If OpenF1 experiences downtime, rate limits, or receives legal notices from Formula 1, the client telemetry feeds will fail.

### 3.2 `api/jolpica.ts` (Jolpica Proxy)
- **Upstream Origin:** `https://api.jolpi.ca`
- **Endpoint Pattern:** Strictly limited to `^ergast\/f1\/(2024|2025|2026)\/(results|sprint)\.json$`.
- **Edge Caching:** 15-minute memory cache (`CACHE_TTL_MS = 900_000`), bounded to 200 entries with LRU-style eviction.
- **Headers:** `Cache-Control: public, s-maxage=900, stale-while-revalidate=86400`.

---

## 4. Map & Geospatial Data Compliance

- **OpenStreetMap (`tile.openstreetmap.org`)**:
  - The OSM tile servers are funded by donations and strictly intended for low-volume testing. Heavy commercial traffic violates the OSM Tile Usage Policy.
  - **Requirement:** Commercial EDS deployment must transition to a commercial vector/raster tile vendor (Mapbox, Protomaps on Cloudflare R2, or Stadia Maps) and maintain visible attribution: *"© OpenStreetMap contributors"*.
- **Esri World Imagery (`server.arcgisonline.com`)**:
  - Currently called directly from `CircuitTrackMap.tsx`.
  - **Requirement:** Direct unauthenticated access to Esri tile servers in a commercial for-profit application breaches Esri's Terms of Use. Must be replaced or properly licensed with an ArcGIS Developer commercial token.

---

## 5. Commercial Data Migration Roadmap

| Source / Subsystem | Current Status | Commercial Target State | Priority |
|---|---|---|---|
| `scripts/sync-openf1-sessions.js` | Direct F1 scraping with spoofed User-Agent | **DISCONTINUE SCRAPING**. Transition to Jolpica-only ingestion or licensed sports telemetry provider. | **P0 (Immediate)** |
| `scripts/update-2026-data.js` | Automated Jolpica ingestion | **RETAIN WITH ATTRIBUTION**. Verify factual fair use and add clean data source disclaimers. | **P2** |
| `api/openf1.ts` | OpenF1 community proxy | Retain with robust offline simulation fallback. | **P2** |
| Circuit Map Imagery | Esri ArcGIS unauthenticated tiles | Replace with self-hosted OpenMapTiles or licensed Mapbox imagery. | **P1** |
