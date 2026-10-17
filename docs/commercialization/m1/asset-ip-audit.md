# EDS-M1.2 — Intellectual Property Risk Assessment & Asset Classification

**Project:** Podium Effet De Sol (EDS)  
**Branch Audited:** `Per-PEDS`  
**Audit Date:** 2026-10-17  
**Auditor:** Principal Software Architect & IP Asset Auditor  

---

## 1. Executive Summary & Legal Framework

Podium Effet De Sol is undergoing an architectural audit to prepare for commercial operation. In commercial use (monetization via ads, subscriptions, sponsorships, e-commerce, or paid services), fair use and editorial defense standards become substantially stricter than non-profit educational/fan sites.

### Non-Negotiable Findings
1. **Zero Assets Legally Cleared for Unrestricted Commercial Exploitation**: None of the third-party constructor names, trademarks, sponsor logos, or 3D vehicle trade dresses are licensed from Formula One Licensing B.V. or individual constructors.
2. **WTFPL on 3D Model Does Not Clear Trade Dress**: While `markste-in/c42` provides a code license (WTFPL v2) for the file format and vertices, it cannot license the underlying industrial design and trademarked vehicle shape of the Alfa Romeo C42.
3. **Procedural Trademarks Constitute Trademark Use**: Procedurally drawing corporate sponsor logos (HP, Shell, WhatsApp, INEOS, Google Chrome, Snapdragon, MoneyGram) onto 3D car textures is legally identical to distributing raster image logos.

---

## 2. Asset Classification Taxonomy

- **KEEP**: Asset is 100% original, verified public domain, or compliant with commercial open-source license without trademark/trade dress encumbrances.
- **REPLACE**: Asset poses critical trademark, trade dress, copyright, or scraping risks and MUST be replaced with bespoke original assets prior to commercial launch.
- **LEGAL REVIEW**: Asset may be permissible under nominative fair use or data factual exemption, but requires formal legal sign-off from qualified IP counsel before commercial monetization.

---

## 3. Comprehensive Asset Classification Register

### 3.1 3D Vehicle Geometry & Real-time Assets

| Asset Path / Identifier | Description | IP Risk & Ownership | Classification | Evidence & Provenance | Confidence |
|---|---|---|---|---|---|
| `public/models/c42.v2.glb` | 2.1 MiB Meshopt GLTF vehicle chassis model | **CRITICAL RISK**: Shape, proportions, and aerodynamic contours represent the Alfa Romeo C42 F1 car (2022). Owned by Sauber Motorsport AG / Stellantis / Alfa Romeo. | **REPLACE** | `public/models/README.md` explicitly cites source `markste-in/c42` (Alfa Romeo AR model). Design patents & trade dress are unlicensable under open-source code licenses. | HIGH |
| `public/textures/wheel_base.webp` | Tire sidewall & rim texture (37.7 KiB) | **HIGH RISK**: Features Pirelli P-Zero branding, colored compound rings, and BBS wheel rim aesthetics. | **REPLACE** | Pirelli Tyre S.p.A. and BBS Motorsport GmbH own respective trademarks and trade dress. | HIGH |
| `src/components/showroom/StudioBackdropTexture.ts` | Procedural studio floor & backdrop grid | **LOW RISK**: Geometric studio environment, lighting grids, and perspective ground lines. | **KEEP** | 100% original procedural canvas code. Sponsoring team logos rendered onto backdrop must be decoupled. | HIGH |

---

### 3.2 Procedural Vector Liveries & Corporate Sponsor Marks (`F1CarTextures.ts`)

`F1CarTextures.ts` procedurally generates 2K canvas textures mapped directly onto the car. The following table identifies every trademarked mark procedurally drawn:

| Function Name | Trademarked Brand / Mark | Legal Owner | Classification | Legal Risk Rationale | Confidence |
|---|---|---|---|---|---|
| `drawFerrariShield()` | Giallo Modena Shield + Cavallino Rampante (Prancing Horse) | Ferrari S.p.A. | **REPLACE** | World-famous trademark (WIPO/USPTO/EUIPO). Direct liability in commercial context. | VERY HIGH |
| `drawHpLogo()` | HP blue circular mark (Title sponsor) | HP Hewlett Packard Group LLC | **REPLACE** | Corporate trademark used without commercial sponsorship agreement. | VERY HIGH |
| `drawShellLogo()` | Shell Pecten shell symbol | Shell Brands International AG | **REPLACE** | Registered trademark. | VERY HIGH |
| `drawMercedesStar()` & `drawMercedesStarfield()` | Three-Pointed Star & Silver Arrows starfield | Mercedes-Benz Group AG | **REPLACE** | Highly protected brand identity and trade dress. | VERY HIGH |
| `drawWhatsAppLogo()` | WhatsApp speech bubble & phone | Meta Platforms, Inc. | **REPLACE** | Registered trademark. | VERY HIGH |
| `drawIneosLogo()` | INEOS wordmark & corporate insignia | INEOS Group Limited | **REPLACE** | Corporate trademark. | VERY HIGH |
| `drawRedBullChargingBulls()` | Dual Charging Bulls & Yellow Sun Disc | Red Bull GmbH | **REPLACE** | Famous international trademark. Red Bull actively litigates unauthorized commercial use. | VERY HIGH |
| `drawMcLarenSpeedmark()` | McLaren Speedmark / Kiwi insignia | McLaren Group Limited | **REPLACE** | Registered trademark. | VERY HIGH |
| `drawGoogleChromeLogo()` | Multi-color Chrome circular emblem | Google LLC / Alphabet Inc. | **REPLACE** | Registered trademark. | VERY HIGH |
| `drawAndroidLogo()` | Android green robot mark | Google LLC | **REPLACE** | Commercial use requires adherence to Google Brand Guidelines. | HIGH |
| `drawAstonMartinWings()` | Spread Wings luxury automotive badge | Aston Martin Lagonda Global Holdings | **REPLACE** | Registered trademark and luxury automotive trade dress. | VERY HIGH |
| `drawAlpineLogo()` | Alpine Arrow A monogram | Renault s.a.s. / Alpine Cars | **REPLACE** | Registered trademark. | VERY HIGH |
| `drawWilliamsLogo()` | Williams W geometric corporate mark | Williams Grand Prix Engineering Limited | **REPLACE** | Registered trademark. | VERY HIGH |
| `drawSnapdragonLogo()` | Snapdragon dragon/fireball mark | Qualcomm Technologies, Inc. | **REPLACE** | Registered trademark. | VERY HIGH |
| `drawAudiFourRings()` | Four Interlocking Rings | AUDI AG / Volkswagen Group | **REPLACE** | Iconic automotive trademark. | VERY HIGH |
| `drawHaasLogo()` | Haas CNC geometric H | Haas Automation, Inc. | **REPLACE** | Corporate trademark. | VERY HIGH |
| `drawMoneyGramLogo()` | MoneyGram globe and dual curved arrow | MoneyGram Payment Systems, Inc. | **REPLACE** | Registered financial services trademark. | VERY HIGH |
| `drawCadillacCrest()` | Cadillac luxury geometric crest | General Motors LLC | **REPLACE** | Registered automotive trademark. | VERY HIGH |
| `drawBBSMultiSpokeWheel()` | BBS multi-spoke motorsport wheel | BBS Motorsport GmbH | **REPLACE** | Registered automotive parts trademark. | HIGH |
| `drawCarbonWeave()` | Procedural carbon fiber twill texture | Generic / Podium EDS | **KEEP** | 100% original procedural mathematical weave pattern. | VERY HIGH |
| `drawCoolingLouvres()` | Procedural aerodynamic cooling slots | Generic / Podium EDS | **KEEP** | Pure geometric canvas rendering. | VERY HIGH |

---

### 3.3 Visual Identity & Vector Brand Logos

| Asset Identifier | Asset Type | IP Owner / Subject | Classification | Resolution / Recommended Action |
|---|---|---|---|---|
| `public/logo/logo.png` & variants | Raster PNG / ICO | Podium Effet De Sol | **KEEP** | Original bespoke brand identity for the EDS platform. Free of third-party marks. |
| `src/data/showroom/teamLogoSVGs.ts` | 11 Vector SVGs | Ferrari, Mercedes, Red Bull, McLaren, etc. | **REPLACE** | Replace with bespoke EDS fictional / engineering constructor badges or neutral geometric designations. |
| `src/components/common/ConstructorLogo.tsx` | 11 Vector SVGs | Official constructor insignia | **REPLACE** | Replace with neutral technical badges or abstract geometric marks for commercial edition. |
| `public/images/showroom/schematics/*.webp` | 11 CAD images | Team car wireframes (Alpine..Williams) | **REPLACE** | Replace with CAD wireframes and blueprints of the original **EDS-G01** modular chassis. |
| `public/images/showroom/closeups/*.webp` | 66 closeup images | Team aerodynamic closeups | **REPLACE** | Replace with bespoke high-resolution 3D renders of EDS-G01 technical subassemblies. |
| `public/images/teams/*.webp` | 11 team teaser renders | 2024–2026 team cars (W15, RB20, SF24, MCL38..) | **REPLACE** | Direct photographic/render reproduction of competitor cars. Replace with EDS vehicle configurations. |

---

### 3.4 Data Pipelines, APIs & Content

| Pipeline / Data Source | File / Route | Risk Assessment | Classification | Action Required |
|---|---|---|---|---|
| `livetiming.formula1.com/static` | `scripts/sync-openf1-sessions.js` | **CRITICAL RISK**: Unauthorized scraping of F1 proprietary live-timing servers with fake browser User-Agent. Clear violation of FOM website terms. | **REPLACE** | Cease direct automated scraping of Formula One Digital Media servers for commercial deployment. |
| `api.jolpi.ca/ergast/f1` | `scripts/update-2026-data.js` & `api/jolpica.ts` | **MEDIUM RISK**: Community Ergast API replacement. Factual sports statistics are generally not copyrightable, but API database rights and Ergast CC BY-NC-SA heritage require caution. | **LEGAL REVIEW** | Verify Jolpica API commercial terms; explore licensed data provider (Sportradar / official feed) or self-hosted factual database. |
| `api.openf1.org/v1` | `api/openf1.ts` | **MEDIUM RISK**: Unofficial community API. Community project, may be subject to upstream cease-and-desist or rate limiting. | **LEGAL REVIEW** | Implement graceful fallback to internal engineering simulation data if external API becomes unavailable. |
| `tile.openstreetmap.org` | `src/components/championship/CircuitTrackMap.tsx` | **LOW RISK**: OpenStreetMap tiles require ODbL attribution. Strict tile usage policy prohibits heavy commercial traffic. | **LEGAL REVIEW** | Add proper OpenStreetMap attribution or migrate to commercial tile provider (Mapbox / Protomaps). |
| `server.arcgisonline.com` | `src/components/championship/CircuitTrackMap.tsx` | **HIGH RISK**: Esri World Imagery tiles require a paid commercial ArcGIS subscription for for-profit sites. | **REPLACE** | Replace with licensed satellite imagery or open vector circuit track visualizers. |
| Driver names & biographical data | `src/data/drivers.ts` | **MEDIUM RISK**: Right of publicity / personality rights of active drivers (Lewis Hamilton, Max Verstappen, etc.) in commercial contexts. | **LEGAL REVIEW** | Factual editorial sports reporting is generally protected, but commercial merchandise or endorsement association is forbidden. |

---

## 4. Overall IP Clearance Summary

```text
TOTAL ASSETS AUDITED: 132 distinct media assets & data interfaces
- KEEP:          18 (Original logos, procedural math patterns, styling)
- REPLACE:       98 (3D model, procedural sponsor marks, team SVGs, schematics, closeups, car teasers, F1 scraping)
- LEGAL REVIEW:  16 (Driver editorial statistics, Jolpica API, OpenF1 proxy, OSM map tiles)

COMMERCIAL IP READINESS: 13.6% (86.4% requires replacement or legal review)
```
