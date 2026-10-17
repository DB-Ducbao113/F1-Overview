# EDS-M1.9 — QA Baseline & Static Quality Gates Verification

**Project:** Podium Effet De Sol (EDS)  
**Branch Audited:** `Per-PEDS` (commit `989a0e7`)  
**Audit Date:** 2026-10-17  
**Auditor:** Senior QA Engineer / SDET & Release Gatekeeper  

---

## 1. Governance Policy & Evaluation Principles

In accordance with `AGENTS.md` (Podium Effet De Sol AI Agent QA & Release Governance):
- **PRIMARY RULE:** *No evidence = No approval.*
- All commands reported in this baseline were executed locally on the actual codebase.
- No outputs, statuses, or benchmarks are simulated or assumed.

---

## 2. Static Quality Gate Execution Evidence

### 2.1 TypeScript Type Checking (`npx tsc --noEmit`)
- **Command:** `npx tsc --noEmit`
- **Working Directory:** `E:\Formula 1\F1-Overview`
- **Execution Date:** 2026-10-17 14:29:05 UTC+7
- **Exit Code:** `0` (PASS)
- **Output:**
  ```text
  [No output — 0 TypeScript compiler errors across all files]
  ```
- **Finding:** The TypeScript type definitions, interfaces, and component properties across the entire codebase are fully coherent and error-free.

---

### 2.2 ESLint Static Analysis
#### Run A: Project Script (`npm run lint` → `eslint .`)
- **Command:** `npm run lint`
- **Exit Code:** `1` (FAIL)
- **Error Output:**
  ```text
  [BABEL] Note: The code generator has deoptimised the styling of E:\Formula 1\F1-Overview\dist-baseline\assets\vendor-three-CZCoFc9s.js as it exceeds the max of 500KB.
  [BABEL] Note: The code generator has deoptimised the styling of E:\Formula 1\F1-Overview\dist-test2\assets\vendor-three-fGAZCfVW.js as it exceeds the max of 500KB.
  [BABEL] Note: The code generator has deoptimised the styling of E:\Formula 1\F1-Overview\dist-worker\assets\vendor-three-fGAZCfVW.js as it exceeds the max of 500KB.
  [BABEL] Note: The code generator has deoptimised the styling of E:\Formula 1\F1-Overview\dist-worker-test\assets\vendor-three-fGAZCfVW.js as it exceeds the max of 500KB.

  Oops! Something went wrong! :(
  ESLint: 10.11.0
  RangeError: Invalid string length
      at .../eslint/lib/cli-engine/formatters/stylish.js:134:5
  ```
- **Root Cause Analysis:** In `eslint.config.js`, the `globalIgnores` configuration ignores `'dist/**'`, but fails to ignore untracked benchmark build folders (`dist-*/**`). When earlier benchmarking scripts generated `dist-baseline`, `dist-test2`, and `dist-worker`, ESLint attempted to parse hundreds of megabytes of minified Three.js bundles, exceeding Node's V8 string buffer limit.

#### Run B: Focused Source Code Lint (`npx eslint src api scripts`)
- **Command:** `npx eslint src api scripts`
- **Exit Code:** `0` (PASS)
- **Output:**
  ```text
  [0 errors, 0 warnings across all active source code]
  ```
- **Remediation Required:** Update `eslint.config.js` to add `'dist-*/**'` to `globalIgnores`.

---

### 2.3 Unit & Integration Testing (`npm test` → `vitest run`)
- **Command:** `npm test`
- **Working Directory:** `E:\Formula 1\F1-Overview`
- **Exit Code:** `0` (PASS)
- **Execution Duration:** 18.37s
- **Test Summary:**
  ```text
  Test Files  25 passed (25)
       Tests  194 passed (194)
    Duration  18.37s (tests 55%, transform 32%, import 12%, worker 2%)
  ```
- **Key Suites Verified:**
  - `src/components/layout/Navbar.test.tsx` (2 tests — passed)
  - `src/data/championship/calendar.test.ts` (7 tests — passed)
  - `src/components/showroom/SchematicComparisonModal.test.tsx` (14 tests — passed)
  - `src/services/sprint-standings.test.ts` (21 tests — passed)
  - `src/services/f1DataService.test.ts` (6 tests — passed)
  - `src/components/common/BrandLogo.test.tsx` (4 tests — passed)
  - `src/data/championship/circuitsData.test.ts` (7 tests — passed)
  - `src/components/common/F1StartLightsPreloader.test.tsx` (22 tests — passed)
  - `src/components/championship/CircuitTrackMap.test.tsx` (10 tests — passed)
  - `src/services/critical-fixes.test.ts` (34 tests — passed, verifies proxy error codes, client timeouts, and cache bounds)

---

### 2.4 Production Build (`npm run build` → `tsc && vite build`)
- **Command:** `npm run build`
- **Exit Code:** `0` (PASS)
- **Execution Duration:** 12.24s
- **Module Count:** 2,199 modules transformed
- **Output Bundle Breakdown:**
  ```text
  dist/index.html                                 4.13 kB │ gzip:   1.51 kB
  dist/assets/index-DGYCZ_AJ.css                103.51 kB │ gzip:  17.92 kB
  dist/assets/vendor-core-ckwbz45p.js             1.14 kB │ gzip:   0.66 kB
  dist/assets/Card3DTilt-DfkhISKY.js              2.60 kB │ gzip:   1.41 kB
  dist/assets/teamSeasons-C1XHo0kd.js             3.21 kB │ gzip:   0.94 kB
  dist/assets/drivers-BInhU8OE.js                 6.49 kB │ gzip:   1.97 kB
  dist/assets/DriversDirectoryPage-SUC7VVcF.js    7.10 kB │ gzip:   2.50 kB
  dist/assets/TeamsDirectoryPage-BxRfhGcy.js      7.60 kB │ gzip:   2.84 kB
  dist/assets/CarDetailPage-D9Yr7GJR.js           8.64 kB │ gzip:   2.90 kB
  dist/assets/TeamDetailPage-KFSkK175.js         11.87 kB │ gzip:   3.56 kB
  dist/assets/DriverDetailPage-Grl3QeNF.js       12.84 kB │ gzip:   3.93 kB
  dist/assets/AboutPage-B1OuFde1.js              14.35 kB │ gzip:   5.44 kB
  dist/assets/vendor-icons-ZH5cEITo.js           26.14 kB │ gzip:   5.37 kB
  dist/assets/index-BOmzSMTs.js                  27.16 kB │ gzip:   7.53 kB
  dist/assets/HomeView-DhetYX4S.js               42.24 kB │ gzip:  12.54 kB
  dist/assets/ConstructorLogo-CU71dZ54.js        58.56 kB │ gzip:  19.63 kB
  dist/assets/ChampionshipView-MIFW2JrJ.js       62.14 kB │ gzip:  13.04 kB
  dist/assets/circuitsData-DxcGj9Uf.js           76.60 kB │ gzip:  17.49 kB
  dist/assets/vendor-react-BNpPU2E_.js          194.71 kB │ gzip:  64.42 kB
  dist/assets/index-DHD84x86.js                 227.23 kB │ gzip:  44.00 kB
  dist/assets/ShowroomView-D2SAn2ZU.js          332.49 kB │ gzip:  90.36 kB
  dist/assets/vendor-three-Bhz7FECr.js          917.64 kB │ gzip: 249.28 kB
  ```

---

### 2.5 Security Audit (`npm audit`)
- **Command:** `npm audit`
- **Exit Code:** `1` (FAIL / WARNINGS)
- **Findings:** 8 vulnerabilities (2 moderate, 6 high):
  - `braces` (High — GHSA-vfj7-8cjw-p6xm): Denial of service through deeply nested patterns via `chokidar` / `tailwindcss 3.4.4`.
  - `postcss-selector-parser` (Moderate — GHSA-rj75-hqrm-r3gf): Quadratic complexity in flat selector parsing.
  - `source-map-js` (High — GHSA-68fv-2mgg-jv7q): Denial of service through indexed source-map offsets.
- **Risk Assessment:** All flagged packages are build-time CSS dependencies; none represent executable runtime vulnerabilities exposed to the public browser. Remediating requires planning Tailwind v4 migration or updating sub-dependencies.

---

### 2.6 Code Formatting (`npm run format:check` → `prettier --check .`)
- **Command:** `npm run format:check`
- **Exit Code:** `1` (FAIL)
- **Output:** Flagged style issues in untracked benchmark outputs (`dist-worker/`), runs records, and certain source files.

---

## 3. Commercial Launch Quality Gate Criteria

### 3.1 Hard Release Blockers (Non-negotiable GO/NO-GO Gates)
1. **0 TypeScript Errors**: `tsc --noEmit` must exit 0.
2. **0 ESLint Errors on Source Tree**: `eslint` on `src/`, `api/`, `scripts/` must exit 0.
3. **100% Passing Unit & Integration Tests**: Zero test failures in Vitest.
4. **Successful Production Build**: Clean bundle output under size budgets.
5. **No Committed Secrets or PAT Tokens**: `ci.yml` secret scanner must pass.
6. **Zero Direct Scraping of Formula 1 Live Timing**: Decommissioning of unauthorized scraping routines.
7. **Complete 3D Trade Dress Clearance**: Decommissioning of Alfa Romeo C42 model and procedural constructor trademarks.

### 3.2 Soft Quality Gates (Assess & Document)
1. Prettier formatting pass across documentation and test fixtures.
2. Tailwind CSS dependency upgrade to resolve `braces` security audit advisory.
3. Vercel Hobby to Cloudflare/Pro hosting migration.
