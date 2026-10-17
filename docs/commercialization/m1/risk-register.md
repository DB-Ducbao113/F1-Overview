# EDS-M1.10 — Comprehensive Risk Register & Mitigation Strategy

**Project:** Podium Effet De Sol (EDS)  
**Branch Audited:** `Per-PEDS`  
**Audit Date:** 2026-10-17  
**Auditor:** Principal Software Architect & Senior Risk Officer  

---

## 1. Risk Scoring Methodology

- **Probability (P):** 1 (Rare) to 5 (Almost Certain)
- **Impact (I):** 1 (Insignificant) to 5 (Catastrophic / Business Critical)
- **Risk Score (R = P × I):**
  - **15 – 25: CRITICAL** (Immediate launch blocker; must be resolved before commercialization)
  - **10 – 14: HIGH** (Major operational or legal exposure; mitigation required prior to public marketing)
  - **5 – 9: MEDIUM** (Important technical debt or manageable risk; workaround available)
  - **1 – 4: LOW** (Minor cosmetic or documentation issue)

---

## 2. Risk Register Matrix

| Risk ID | Category | Risk Description | P | I | Score | Severity | Mitigation Strategy | Residual Risk | Owner |
|---|---|---|---|---|---|---|---|---|---|
| **RSK-IP-01** | Legal / IP | **Alfa Romeo C42 3D Geometry**: `c42.v2.glb` reproduces protected automotive trade dress and design patents. | 5 | 5 | **25** | **CRITICAL** | Decommission `c42.v2.glb`. Author and deploy the original **EDS-G01** modular chassis. | Low (Original design) | 3D Lead |
| **RSK-IP-02** | Legal / IP | **Procedural Corporate Trademarks**: `F1CarTextures.ts` procedurally draws Ferrari, HP, Shell, Mercedes, Red Bull, etc. | 5 | 5 | **25** | **CRITICAL** | Remove all trademarked vector drawing routines. Replace with 6 original EDS engineering livery presets. | Nil | Frontend Lead |
| **RSK-IP-03** | Legal / Scraping | **F1 Live-Timing Bot Scraping**: `sync-openf1-sessions.js` scrapes official F1 servers with spoofed User-Agent. | 5 | 4 | **20** | **CRITICAL** | Cease direct automated scraping of Formula 1 servers. Transition to Jolpica API or licensed telemetry feed. | Low | DevOps Lead |
| **RSK-OPS-01** | Commercial Infra | **Vercel Hobby Commercial Violation**: Hosting a monetized or commercial site on Vercel Hobby risks suspension. | 5 | 4 | **20** | **CRITICAL** | Migrate production deployment to Cloudflare Pages + Workers or upgrade to Vercel Pro. | Nil | DevOps Lead |
| **RSK-SEO-01** | Technical SEO | **Static Canonical Tag Pointing to Root**: `<link rel="canonical">` in `index.html` causes de-indexing of inner pages. | 5 | 4 | **20** | **CRITICAL** | Implement dynamic canonical link updates in React Router per route. | Nil | Frontend Lead |
| **RSK-IP-04** | Legal / IP | **Constructor Vector SVGs**: `teamLogoSVGs.ts` and `ConstructorLogo.tsx` include official team insignia. | 4 | 4 | **16** | **HIGH** | Replace with original geometric constructor insignias and abstract motorsport team symbols. | Low | Design Lead |
| **RSK-GEO-01** | Legal / Lic. | **Unlicensed Esri Satellite Tiles**: `CircuitTrackMap.tsx` makes unauthenticated commercial calls to Esri ArcGIS. | 4 | 3 | **12** | **HIGH** | Replace with Mapbox / Protomaps vector tiles with clear OpenStreetMap ODbL attribution. | Low | Frontend Lead |
| **RSK-PRV-01** | Privacy / Legal | **Missing GDPR / CMP Consent**: Real-user telemetry and proposed ad tags deployed without consent banner. | 4 | 3 | **12** | **HIGH** | Implement compliant open-source CMP (Klaro!) and draft standard `/privacy` and `/terms` documents. | Low | Legal Counsel |
| **RSK-QA-01** | Build / QA | **ESLint Out-of-Memory on Untracked Dists**: `npm run lint` fails when benchmark build artifacts exist in tree. | 4 | 3 | **12** | **HIGH** | Add `'dist-*/**'` to `globalIgnores` in `eslint.config.js`. | Nil | QA Lead |
| **RSK-SEC-01** | Security | **NPM High-Severity Vulnerabilities**: `npm audit` flags 6 high vulnerabilities in `braces` and `source-map-js`. | 3 | 3 | **9** | **MEDIUM** | Upgrade build-time dependencies and plan Tailwind CSS 3.4 to 4.x migration. | Low | Frontend Lead |
| **RSK-DAT-01** | Data / Legal | **Ergast Legacy CC BY-NC-SA Exposure**: F1 historical data in Jolpica originated from CC BY-NC-SA database. | 3 | 3 | **9** | **MEDIUM** | Maintain clear attribution and limit historical data presentation to purely factual sports statistics. | Low | Backend Lead |
| **RSK-PERF-01**| Performance | **Mobile WebGL VRAM Exhaustion**: Large 2K procedural canvas textures can cause context loss on low-end mobile. | 3 | 3 | **9** | **MEDIUM** | Implement mobile LOD texture downscaling (1024x1024) and memory disposal on scene unmount. | Low | 3D Lead |

---

## 3. High-Priority Mitigation Roadmap

```
PHASE 1 (Pre-Commercialization - Launch Blockers):
├── [RSK-IP-01]  Deploy EDS-G01 Original Chassis
├── [RSK-IP-02]  Purge F1CarTextures.ts trademark vectors
├── [RSK-IP-03]  Decommission live timing scraping script
├── [RSK-OPS-01] Migrate hosting to Cloudflare Pages or Vercel Pro
└── [RSK-SEO-01] Fix dynamic canonical tag generation

PHASE 2 (Hardening & Compliance):
├── [RSK-IP-04]  Deploy original constructor badges
├── [RSK-GEO-01] Transition to licensed / open map tiles
├── [RSK-PRV-01] Deploy Cookie CMP and Privacy Policy
└── [RSK-QA-01]  Patch eslint.config.js dist-* ignore
```
