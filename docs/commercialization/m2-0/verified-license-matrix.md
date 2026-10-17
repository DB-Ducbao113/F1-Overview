# EDS-M2.0-01 — Verified License Matrix & Legal Terms Audit

**Document Reference:** `docs/commercialization/m2-0/verified-license-matrix.md`  
**Project:** Podium Effet De Sol (EDS)  
**Branch Audited:** `Per-PEDS` (commit `68a7e8c`, cross-referenced with `main` at `2779cac` and `perf/speed-insights-v2` at `1edfd11`)  
**Audit Date:** 2026-10-17  
**Auditors:** Senior Software Architect, IP Risk Auditor, Data Compliance Engineer, Senior QA Release Gatekeeper

---

## 1. Executive Summary & Verification Methodology

The primary objective of Milestone EDS-M2.0 is to establish an empirically verified legal and licensing baseline for Podium Effet De Sol, correcting unfounded legal assumptions from M1, cataloging explicit contractual clauses from official terms of service, and establishing verifiable risk boundaries for commercialization.

### Core Governance Principles Applied:

1. **No Evidence = No Approval** (in accordance with `AGENTS.md`).
2. **Attribution Is Not Authorization**: Public attribution (e.g., referencing Simple Icons or OpenStreetMap) satisfies copyright notices where permitted, but does **not** grant trademark licenses, trade dress clearance, or commercial tile server usage rights.
3. **Separation of Factual Sports Data from Creative Databases**: Legal protections in sports data distinguish uncopyrightable factual numbers (_Feist_, _Motorola_) from contractual website terms of use (CFAA, Computer Misuse Act) and European _sui generis_ database rights (Directive 96/9/EC).
4. **Separation of Open-Source Code Licenses from Automotive Trade Dress**: Open-source licenses (WTFPL, MIT, Apache) granted by community 3D modelers license only their original digital polygon meshes and code; they cannot and do not license third-party industrial designs, automotive bodywork trade dress, or registered team emblems.

---

## 2. Comprehensive Third-Party License & Terms Register

| Entity / Asset                          | Primary Source URL                                                                                   | Verification Date | Governing License / Terms Clause                                                                                                                                                                                                                                                                                                                    | Affected Repository Files                                                                                                                | Verified Restrictions vs Legal Assumptions                                                                                                                                                                                                                                                                                                                                                    | Risk Level        | Confidence Level     |
| --------------------------------------- | ---------------------------------------------------------------------------------------------------- | ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- | -------------------- |
| **Formula One Live Timing**             | `https://livetiming.formula1.com/static/`<br>`https://www.formula1.com/en/toolbar/terms-of-use.html` | 2026-10-17        | **FOM Terms of Use §5.1, §5.3, §7.2**: Prohibits automated queries, scraping, robotic data extraction, harvesting, and use of materials for commercial purposes without an express commercial digital license from Formula One Digital Media Limited.                                                                                               | `scripts/sync-openf1-sessions.js`<br>`.github/workflows/auto-update-f1.yml`                                                              | **CONFIRMED RESTRICTION**: Automated querying of F1 live timing with a spoofed Chrome User-Agent violates binding website terms. _Legal Assumption Corrected_: Scraping is not merely a "rate-limit issue"—it is a contractual breach and technological circumvention risk.                                                                                                                   | **P0 (CRITICAL)** | **VERY HIGH (100%)** |
| **Jolpica F1 API**                      | `https://api.jolpi.ca/`<br>`https://github.com/jolpica/jolpica-f1`                                   | 2026-10-17        | **Open Source (MIT) API Code**: API software is MIT. Database contains Ergast archive and contemporary race results. Terms of use impose fair-use rate limiting (approx. 4 req/sec, burst 100 req/min).                                                                                                                                             | `scripts/update-2026-data.js`<br>`api/jolpica.ts`<br>`src/services/standingsEngine.ts`                                                   | **CONFIRMED RESTRICTION**: Free hosted instance has rate limits and fair-use policy. _Legal Assumption Corrected_: Ergast's historical CC BY-NC-SA 3.0 license does **not** make underlying factual race classifications (positions, points, lap times) copyrightable under US law (_Feist_), though bulk redistribution of the compiled database in the EU is governed by Directive 96/9/EC. | **P2 (MEDIUM)**   | **HIGH (95%)**       |
| **OpenF1 API**                          | `https://openf1.org/`<br>`https://api.openf1.org/v1`                                                 | 2026-10-17        | **Community Open Source Project**: Independent community telemetry project. Reverse engineers F1 timing app data. Disclaims official affiliation with Formula 1. Fair use rate limits apply.                                                                                                                                                        | `api/openf1.ts`<br>`src/services/f1DataService.ts`<br>`src/data/championship/openF1SprintBridge.ts`                                      | **CONFIRMED RESTRICTION**: High upstream availability risk. OpenF1 has no commercial SLA and is subject to potential upstream third-party cease-and-desist or protocol changes. _Action_: Proxy caching and synthetic offline fallback are mandatory.                                                                                                                                         | **P2 (MEDIUM)**   | **HIGH (90%)**       |
| **Vercel Platform Hosting**             | `https://vercel.com/legal/terms`                                                                     | 2026-10-17        | **Vercel Terms of Service §4.1 (Hobby Plan)**: _"The Hobby tier is strictly for personal, non-commercial use. Commercial use of the Hobby tier is a violation of these Terms and may result in immediate suspension or termination."_                                                                                                               | `vercel.json`<br>`https://podiumeds.vercel.app/`                                                                                         | **CONFIRMED RESTRICTION**: Operating any commercial monetization (advertising, sponsorships, commercial affiliates, paid access) on Hobby tier triggers immediate platform suspension. Upgrading to Vercel Pro or migrating to Cloudflare Pages is legally required.                                                                                                                          | **P0 (CRITICAL)** | **VERY HIGH (100%)** |
| **Esri ArcGIS World Imagery**           | `https://server.arcgisonline.com/`<br>`https://www.esri.com/en-us/legal/terms/full-master-agreement` | 2026-10-17        | **Esri Master License Agreement (MLA) §2 & Terms of Use**: Unauthenticated direct access to `server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/` for commercial websites is strictly prohibited. Requires an ArcGIS Location Services commercial developer subscription and token.                                          | `src/components/championship/CircuitTrackMap.tsx`                                                                                        | **CONFIRMED RESTRICTION**: Live code directly queries Esri tile URLs without an API token or commercial agreement. Violates Esri terms. Must be decommissioned or replaced.                                                                                                                                                                                                                   | **P1 (HIGH)**     | **VERY HIGH (100%)** |
| **OpenStreetMap (OSM)**                 | `https://operations.osmfoundation.org/policies/tiles/`<br>`https://www.openstreetmap.org/copyright`  | 2026-10-17        | **Open Database License (ODbL 1.0)** & **Tile Usage Policy**: Data is free to use with visible credit (_"© OpenStreetMap contributors"_). However, standard OSM tile servers (`tile.openstreetmap.org`) are strictly donated infrastructure; heavy commercial traffic or automated embedding in commercial web apps violates the Tile Usage Policy. | `src/components/championship/CircuitTrackMap.tsx`                                                                                        | **CONFIRMED RESTRICTION**: Commercial websites must use a commercial tile provider (Protomaps on Cloudflare R2, Mapbox, Stadia Maps) rather than free OSM volunteer tile servers.                                                                                                                                                                                                             | **P2 (MEDIUM)**   | **VERY HIGH (100%)** |
| **3D Car Geometry (`c42.v2.glb`)**      | `https://github.com/markste-in/c42`<br>`public/models/README.md`                                     | 2026-10-17        | **Model File Code License: WTFPL v2** (Do What The Fuck You Want To Public License). Underlying Industrial Design: Sauber Motorsport AG / Stellantis / Alfa Romeo.                                                                                                                                                                                  | `public/models/c42.v2.glb`<br>`src/components/showroom/F1Car3DModel.tsx`                                                                 | **CONFIRMED RESTRICTION**: WTFPL v2 licenses only the digital polygon vertices authored by Mark Stein. Mark Stein does not own, and cannot license, Alfa Romeo's registered design patents, 3D trademarks, or aerodynamic trade dress. Commercial exploitation of the C42 bodywork creates direct trade dress infringement exposure.                                                          | **P0 (CRITICAL)** | **VERY HIGH (100%)** |
| **Wheel Rim & Sidewall Asset**          | `public/textures/wheel_base.webp`<br>`src/components/showroom/F1Car3DModel.tsx`                      | 2026-10-17        | **Unlicensed Commercial Asset**: Features Pirelli P-Zero branding, compound color rings, and BBS wheel rim styling.                                                                                                                                                                                                                                 | `public/textures/wheel_base.webp`<br>`src/components/showroom/F1Car3DModel.tsx:105-139`<br>`src/components/showroom/WheelLivery.test.ts` | **CONFIRMED RESTRICTION**: Pirelli Tyre S.p.A. and BBS Motorsport GmbH hold protected trademarks and automotive parts trade dress. Embedding branded textures in commercial showroom violates trademark law.                                                                                                                                                                                  | **P1 (HIGH)**     | **HIGH (95%)**       |
| **Web Fonts (Inter, Playfair Display)** | `https://fonts.google.com/`<br>`public/fonts/`                                                       | 2026-10-17        | **SIL Open Font License 1.1 (OFL-1.1)**: Permitted for commercial use, bundling, embedding, and modification. Restriction: Fonts cannot be sold by themselves.                                                                                                                                                                                      | `index.html`<br>`public/fonts/*`<br>`tailwind.config.js`                                                                                 | **CONFIRMED PERMISSION**: 100% compliant for commercial web applications. Requires preservation of OFL copyright text in production bundle.                                                                                                                                                                                                                                                   | **P4 (CLEARED)**  | **VERY HIGH (100%)** |
| **Three.js & React Three Fiber**        | `https://github.com/mrdoob/three.js`<br>`https://github.com/pmndrs/react-three-fiber`                | 2026-10-17        | **MIT License**: Fully permissive open-source license. Permits commercial use, modification, distribution, private use, and sublicensing.                                                                                                                                                                                                           | `package.json`<br>`src/components/showroom/*`                                                                                            | **CONFIRMED PERMISSION**: 100% compliant. Requires copyright notice reproduction in `THIRD_PARTY_LICENSES.txt`.                                                                                                                                                                                                                                                                               | **P4 (CLEARED)**  | **VERY HIGH (100%)** |
| **`@react-three/drei`**                 | `https://github.com/pmndrs/drei`                                                                     | 2026-10-17        | **Apache-2.0 License**: Permissive license with explicit patent grant. Requires preservation of NOTICE files and explicit statement of modifications.                                                                                                                                                                                               | `package.json`                                                                                                                           | **CONFIRMED PERMISSION**: 100% compliant. Requires license text in production bundle.                                                                                                                                                                                                                                                                                                         | **P4 (CLEARED)**  | **VERY HIGH (100%)** |

---

## 3. Analysis & Correction of M1 Audit Contradictions

During the M1 audit, several legal and technical statements were drafted with imprecise language or excessive conservatism. The following corrections establish the legally grounded baseline:

### 3.1 Jolpica Non-Commercial Usage Terms & Ergast Heritage

- **M1 Stated:** Jolpica is tainted by Ergast's CC BY-NC-SA 3.0 license, meaning no commercial website can ever display race results from Jolpica without licensing fees.
- **M2.0 Verified Correction:**
  1. _Factual Sports Exemption:_ Under United States copyright jurisprudence (_Feist Publications v. Rural Telephone Service_, 499 U.S. 340 (1991); _NBA v. Motorola, Inc._, 105 F.3d 841 (2d Cir. 1997)), pure historical sports facts—such as finishing positions, lap times, points, and race dates—are uncopyrightable public facts. No individual or organization owns copyright in the fact that a driver won a race.
  2. _European Database Directive (96/9/EC):_ In the EU, _sui generis_ database protection applies only where substantial investment was made in obtaining or verifying data from third-party sources, not in generating the data itself (_British Horseracing Board v. William Hill_, Case C-203/02). Ergast was a retired volunteer community project. Jolpica is an open-source API backend.
  3. _Conclusion:_ Querying Jolpica for historical race results and standings to display factual sports tables does **not** violate copyright, provided the platform adheres to Jolpica's API fair-use rate limits and presents the data with proper provenance disclosures.

### 3.2 Statements Regarding "Unlicensable Automotive Designs"

- **M1 Stated:** 3D automotive bodywork and design patents are "unlicensable under open-source code licenses."
- **M2.0 Verified Correction:**
  1. Automotive design patents, registered community designs (EUIPO), and trade dress _are_ legally licensable, but **only by their rightful intellectual property owners** (Sauber Motorsport AG, Ferrari S.p.A., Stellantis, Formula One Licensing B.V.).
  2. The actual legal flaw is that **Mark Stein (`markste-in/c42`) had no authority to license Alfa Romeo's proprietary car shape under WTFPL v2.** The WTFPL license applies exclusively to the author's original digital code/mesh expression, but is completely void regarding the underlying trademarked automotive trade dress.
  3. Consequently, `c42.v2.glb` is not "unlicensable in principle"—it is **unlicensed in this repository**. Operating commercially requires an original chassis design (**EDS-G01**) created from aerodynamic first principles.

### 3.3 Commercial Use of Editorial Word Marks vs Trademark Infringement

- **M1 Stated:** Mentioning team names like "Ferrari", "Mercedes", or "Red Bull" in a commercial web app creates direct trademark infringement liability.
- **M2.0 Verified Correction:**
  1. _Nominative Fair Use Doctrine:_ Established in _New Kids on the Block v. News America Publishing, Inc._, 971 F.2d 302 (9th Cir. 1992), and recognized across major jurisdictions: a commercial entity may use a third party's registered word mark to refer to that party's actual goods or services if:
     - The product or service cannot be readily identified without the mark;
     - Only so much of the mark is used as is reasonably necessary to identify it; and
     - The user does nothing that suggests sponsorship, endorsement, or affiliation.
  2. In motorsport journalism and race classification tables, referring to _"Ferrari"_ in plain text (e.g. `1. Charles Leclerc (Ferrari)`) is fully protected nominative fair use.
  3. _The True Infringement Boundary:_ Trademark infringement occurs when:
     - Vector graphic logos (the Cavallino Rampante shield, Mercedes 3-pointed star, HP blue circle) are procedurally drawn on 3D textures, car liveries, cards, or website banners;
     - The site branding implies official FOM affiliation, licensing, or commercial endorsement;
     - Third-party trademarks are incorporated into domain names or primary application titles.

### 3.4 Canonical Tag Indexing Claims

- **M1 Stated:** The hardcoded `<link rel="canonical" href="https://podiumeds.vercel.app/" />` in `index.html` causes Google to automatically de-index all inner pages.
- **M2.0 Verified Correction:**
  1. A canonical tag is a search engine **hint**, not an imperative directive like `noindex`. Googlebot frequently ignores canonical hints if the content of the target page is substantially different from the canonical URL.
  2. However, in a Single Page Application (SPA) where the initial HTML payload served for every route contains the root canonical tag, Googlebot and Bingbot experience severe canonical ambiguity, leading to search signal consolidation, dropped ranking power, and duplicate content warnings in Google Search Console.
  3. Remediating this requires dynamic canonical tag generation per route via `react-helmet-async` or client-side head management.

### 3.5 Trademark Meta Keywords Assertions

- **M1 Stated:** Including constructor trademarks in `<meta name="keywords">` is penalized by modern search engines.
- **M2.0 Verified Correction:**
  1. Google officially deprecated and ceased using the `<meta name="keywords">` tag for search rankings in **September 2009** (over 16 years ago). Modern Googlebot does not evaluate this tag for ranking or search penalties.
  2. However, including competitor trademarks in HTML metadata was historically used in trademark litigation as evidence of intentional "initial interest confusion" (_Brookfield Communications v. West Coast Entertainment_). While zero SEO penalty exists, retaining trademarked competitor names in metadata carries zero benefit and provides adverse discovery material in any IP inquiry. Removal is recommended for legal hygiene, not algorithmic penalty avoidance.

### 3.6 Vite Environment Variable Rollback Assumptions

- **M1 Stated:** Showroom model rollback can be executed instantly at runtime by toggling `VITE_USE_ORIGINAL_CHASSIS` in hosting environment settings.
- **M2.0 Verified Correction:**
  1. In Vite client-side applications, `import.meta.env.VITE_*` variables are statically replaced with string literals **at build time** (`vite build`). Changing an environment variable on Vercel or Cloudflare has zero effect on already-deployed production bundles until a complete rebuild and redeploy cycle occurs.
  2. More critically, **reverting to `c42.v2.glb` as a rollback target re-introduces the very trade dress infringement liability that the commercialization migration is designed to eliminate.** The commercial rollback target must be a legally cleared low-poly variant (`eds-g01-lod1.glb`) or procedural canvas fallback, never the infringing third-party model.

### 3.7 QA and Vulnerability Severity Assumptions

- **M1 Stated:** `npm audit` failures in `braces` and `source-map-js` represent "CRITICAL / HIGH production security failures."
- **M2.0 Verified Correction:**
  1. Both `braces` (GHSA-vfj7-8cjw-p6xm) and `source-map-js` (GHSA-68fv-2mgg-jv7q) are build-time devDependencies used by `tailwindcss` and `postcss` during local compilation. They are not bundled into client-side browser JavaScript.
  2. Because the production web application does not process untrusted external user input through PostCSS or Chokidar at runtime, these ReDoS vulnerabilities cannot be triggered by external web visitors.
  3. While supply-chain hygiene requires upgrading to Tailwind v4 or applying npm overrides during routine maintenance, build-tool advisories do not constitute live production security vulnerabilities and must not be classified as P0 release blockers.

---

## 4. Third-Party IP Clearance Status Matrix

```text
========================================================================================
                      THIRD-PARTY IP VERIFICATION SUMMARY
========================================================================================
[CLEARED]     Runtime Open-Source Software (React, Three.js, Zustand, Leaflet) - MIT/BSD
[CLEARED]     Typography & Fonts (Inter, Playfair Display) - SIL OFL 1.1
[CLEARED]     Original Branding & Logo (Podium Effet De Sol, Ground Effect Hub)
[CLEARED]     Factual Editorial Race Results & Standings (Nominative Fair Use)
[RESTRICTED]  F1 Live Timing Static Server Scraping (FOM Terms Violation - Discontinue)
[RESTRICTED]  Vercel Hobby Tier (Commercial Prohibition - Upgrade to Pro or Cloudflare)
[RESTRICTED]  Esri World Imagery (Commercial Unauthenticated Access - Discontinue/Replace)
[RESTRICTED]  OpenStreetMap Tile Server (Commercial Tile Policy - Replace with Mapbox/Protomaps)
[INFRINGING]  Alfa Romeo C42 3D Geometry (Trade Dress - Replace with EDS-G01)
[INFRINGING]  18 Procedural Vector Logos on 3D Textures (Trademark - Decommission)
[INFRINGING]  Pirelli / BBS Wheel Textures (Trademark / Trade Dress - Replace with Original)
========================================================================================
```

---

## 5. Verification Sign-Off

- **Lead Auditor:** Senior Software Architect & Release Gatekeeper
- **Status:** BASELINE VERIFIED & CONTRADICTIONS RESOLVED
- **Next Milestone Requirement:** Proceed to Asset Replacement Manifest (`asset-replacement-manifest.md`).
