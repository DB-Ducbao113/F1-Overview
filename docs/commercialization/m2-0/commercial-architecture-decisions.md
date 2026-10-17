# EDS-M2.0-04 — Commercial Architecture Decision Records (ADRs)

**Document Reference:** `docs/commercialization/m2-0/commercial-architecture-decisions.md`  
**Project:** Podium Effet De Sol (EDS)  
**Branch Audited:** `Per-PEDS` (commit `68a7e8c`)  
**Audit Date:** 2026-10-17  
**Auditors:** Principal Software Architect, Senior QA Release Gatekeeper, DevOps Release Engineer

---

## 1. Overview & ADR Governance

This document records the foundational architectural decisions governing Podium Effet De Sol's transition to a commercial-ready, original-IP digital platform. Each Architecture Decision Record (ADR) follows standard industry practice (Context, Decision, Consequences, Rollback Strategy, and Compliance Verification) and strictly incorporates the QA governance rules from `AGENTS.md`.

---

## 2. ADR-001: Original 3D Chassis Migration (EDS-G01) & Rollback Containment

### Status: APPROVED FOR M2.1 PLANNING

### Context:

The current production showroom relies on `public/models/c42.v2.glb` (2.1 MiB Meshopt GLTF). As confirmed in `public/models/README.md`, this geometry is a direct digital replica of the 2022 Alfa Romeo C42 Formula 1 car, authored by Mark Stein under WTFPL v2. While the code license covers the digital polygon array, it cannot and does not license the underlying automotive trade dress, design patents, and brand shapes owned by Sauber Motorsport AG / Stellantis. Exploiting this model in a commercial context creates immediate trademark and trade dress liability.

### Decision:

1. Commission and deploy the **EDS-G01** (Effet De Sol — Generation 01), an original modular ground-effect chassis engineered from first aerodynamic principles.
2. The EDS-G01 geometry will adhere strictly to FIA ground-effect philosophy (dual underfloor Venturi tunnels, shaped diffuser ramps, active DRS upper flap, halo safety cell, and 18-inch wheels) without replicating the trademarked contours or nose cone shapes of any active constructor.
3. The geometry hierarchy must map 1:1 to the existing 9 material primitive slots in `F1Car3DModel.tsx` (`007_Monocoque_Nose`, `005_Wings_Assembly`, `004_Bodywork_Sidepods`, `001_Floor_Underfloor`, `008_Halo_Structure`, `003_Suspension_Mirrors`, `009_Diffuser_RainLight`, `002_Cockpit_Interior`, `006_011_013_Wheels_Tires`).
4. The 6 interactive inspection hotspots (`wings`, `drs`, `sidepods`, `power_unit`, `halo`, `tires`) in `src/data/showroom/hotspotsData.ts` will align precisely to the EDS-G01 coordinate space.

### Correction of M1 Rollback Contradiction:

- **M1 Contradiction:** M1 suggested rolling back to `c42.v2.glb` via an environment variable if mobile performance dropped.
- **M2.0 Rectification:** In a commercial deployment, rolling back to an infringing asset re-exposes the enterprise to legal liability. **The commercial rollback target MUST be a legally cleared release.**
- **Compliant Rollback Architecture:**
  - Level 1 Rollback: High-poly `eds-g01-lod0.glb` (110k tris) falls back to low-poly `eds-g01-lod1.glb` (38k tris).
  - Level 2 Rollback: If WebGL context loss occurs on unsupported low-end devices, the system falls back to an original 2D canvas wireframe or SVG schematic visualizer.
  - At no point in the commercial release line will `c42.v2.glb` be served to users.

### Consequences:

- **Positive:** 100% intellectual property ownership; zero automotive trade dress infringement risk; bespoke marketing and licensing freedom.
- **Preserved Baselines:** OrbitControls, camera tweening, mobile LOD switching, responsive canvas scaling, and WebGL memory cleanup are 100% preserved.

---

## 3. ADR-002: Decommissioning Procedural Trademarks & Deploying Clean Presets

### Status: APPROVED FOR M2.1 PLANNING

### Context:

`src/components/showroom/F1CarTextures.ts` contains 19 vector drawing functions that procedurally render registered trademarks (Ferrari Shield, HP, Shell, Mercedes Star, WhatsApp, INEOS, Red Bull Charging Bulls, McLaren Speedmark, Google Chrome, Android, Aston Martin Wings, Alpine A, Williams W, Snapdragon, Audi Rings, Haas H, MoneyGram, Cadillac Crest, BBS Wheels) onto 2K canvas textures. Procedurally rendering trademarks on commercial assets is legally equivalent to distributing counterfeit logos.

### Decision:

1. Decommission all 19 procedural trademark drawing functions in `F1CarTextures.ts`.
2. Introduce **6 Original Motorsport Engineering Livery Presets** authored specifically for Podium Effet De Sol:
   - Preset 1: _Aero Dynamicist_ (Signature EDS Racing Red, Carbon Weave, Titanium Accents)
   - Preset 2: _Carbon Stealth_ (Matte Pre-Preg Carbon, Gloss Black Flow Lines, Fluo Green Edge Fences)
   - Preset 3: _Titanium Pulse_ (Brushed Chrome/Platinum, Liquid Cyan Strakes, White Halo)
   - Preset 4: _Venturi Velocity_ (Deep Midnight Blue, Papaya Underfloor Highlights, Gold Pinstripe)
   - Preset 5: _Apex Synthetic_ (British Racing Green, Electric Lime Wing Elements, Carbon Tub)
   - Preset 6: _Monocoque Prototype_ (High-Contrast Dazzle Camouflage, Technical Grid Scale, Engineering Markings)
3. Decouple `src/components/common/ConstructorLogo.tsx` and `src/data/showroom/teamLogoSVGs.ts` into neutral technical badges for the commercial edition while retaining plain text constructor names for historical classification tables under nominative fair use.

### Consequences:

- Eliminates 100% of corporate trademark liabilities in the 3D showroom.
- Preserves the existing texture rendering architecture (`createUVTexture`, anisotropy 16, mipmaps, `THREE.SRGBColorSpace`).

---

## 4. ADR-003: Hosting Platform Migration: Cloudflare Pages vs Vercel Pro

### Status: APPROVED FOR M2.1 PLANNING

### Context:

Podium Effet De Sol is hosted on the Vercel Hobby tier (`podiumeds.vercel.app`). Section 4.1 of the Vercel Terms of Service strictly limits the Hobby tier to non-commercial personal projects. Commercial operation on Hobby triggers immediate account termination.

### Evaluation of Commercial Hosting Alternatives:

| Evaluation Dimension        | Option A: Vercel Pro                     | Option B: Cloudflare Pages + Workers                | Option C: Self-Hosted Docker (AWS / Hetzner) |
| --------------------------- | ---------------------------------------- | --------------------------------------------------- | -------------------------------------------- |
| **Base Monthly Cost**       | $20.00 / month / seat                    | $0.00 (Generous commercial free tier)               | $5.00 – $15.00 / month                       |
| **Bandwidth Allowance**     | 1 TB / month included                    | **Unlimited Free Bandwidth**                        | 20 TB included                               |
| **Heavy 3D Asset Delivery** | Bandwidth charges beyond 1TB ($40/100GB) | Optimal: Global Anycast CDN, zero egress fees       | Subject to server bandwidth                  |
| **Serverless Functions**    | Native Vercel Edge/Node functions        | Cloudflare Workers (50ms CPU free, 100k req/day)    | Managed in Nginx container                   |
| **DDoS & Security Defense** | Standard enterprise                      | Industry-leading Cloudflare DDoS defense            | Self-managed iptables/fail2ban               |
| **Deployment Complexity**   | Zero code change                         | Minor: Adapt `api/*.ts` to Cloudflare Worker syntax | Higher: Docker registry, VPS management      |

### Decision:

1. **Primary Recommendation:** Migrate production hosting to **Cloudflare Pages + Cloudflare Workers**. Cloudflare Pages permits commercial use on its free tier, provides unlimited bandwidth (essential for serving multi-megabyte 3D models and 2K textures to global traffic), and completely eliminates Vercel Hobby violations.
2. **Secondary Fallback:** If minimal configuration change is required, the owner may upgrade the existing project to **Vercel Pro** ($20/month) with zero infrastructure rewrites.

---

## 5. ADR-004: Geospatial Tile Provider: Migration from Esri to Protomaps / Mapbox

### Status: APPROVED FOR M2.1 PLANNING

### Context:

`src/components/championship/CircuitTrackMap.tsx` currently performs unauthenticated tile requests to `server.arcgisonline.com/.../World_Imagery/MapServer/tile/`. Unauthenticated access to Esri tile servers in a commercial web application violates the Esri Master License Agreement §2 and subjects the site to IP-level blocking. Furthermore, using volunteer `tile.openstreetmap.org` servers for heavy commercial traffic violates the OSM Tile Usage Policy.

### Decision:

1. Decommission direct unauthenticated queries to Esri ArcGIS servers.
2. Replace with a compliant commercial tile architecture:
   - _Option 1 (Cost-Optimal):_ Self-host vector/raster circuit tiles via **Protomaps PMTiles** hosted on Cloudflare R2 (zero egress fees, 100% legal under ODbL with attribution).
   - _Option 2 (Turnkey):_ Integrate a commercial **Mapbox GL** satellite layer using a properly scoped public access token with strict domain allowlisting.
3. Retain the existing Leaflet 1.9.4 UI controls, GPS track interpolation, and zoom behaviors in `CircuitTrackMap.tsx`.

---

## 6. ADR-005: Privacy, GDPR Consent Management Platform (CMP) & Legal Pages

### Status: APPROVED FOR M2.1 PLANNING

### Context:

Under EU GDPR (Articles 13 & 14), ePrivacy Directive, and California CCPA/CPRA, commercial websites utilizing analytics or third-party advertising must present explicit cookie consent mechanisms and maintain clear privacy policies.

### Decision:

1. Implement a lightweight, zero-dependency **Cookie Consent Management Platform (CMP)** component (or integrate Klaro!) loaded before any optional telemetry scripts.
2. Create three dedicated legal routes:
   - `/privacy`: Comprehensive Privacy Policy detailing data controller identity, cookieless Vercel Web Analytics, server logging, and GDPR data subject rights.
   - `/terms`: Terms of Service disclaiming official Formula One affiliation, establishing acceptable use, and governing intellectual property ownership.
   - `/cookies`: Cookie and Local Storage Policy detailing session tokens and telemetry.

---

## 7. ADR-006: Technical SEO & Metadata Remediation

### Status: APPROVED FOR M2.1 PLANNING

### Context:

1. `index.html:50` hardcodes `<link rel="canonical" href="https://podiumeds.vercel.app/" />`, which presents search engines with an ambiguous canonical hint across all inner SPA routes (`/showroom`, `/season/2026`, `/teams`).
2. `public/sitemap.xml` contains only 6 static routes and omits all 11 team detail routes and 22 driver detail routes.
3. `<meta name="keywords">` in `index.html` contains competitor brand names.

### Decision:

1. Replace the hardcoded canonical tag in `index.html` with a dynamic reactive canonical updater component in `src/App.tsx` (using `react-helmet-async` or standard DOM effect) that reflects the exact active route URL.
2. Implement an automated pre-build sitemap generation script (`scripts/generate-sitemap.mjs`) that crawls active route configurations and generates a comprehensive `sitemap.xml` with dynamic routes and accurate `<lastmod>` timestamps.
3. Sanitize `<meta name="keywords">` and OpenGraph descriptions to focus strictly on original motorsport engineering terminology (_"ground effect aerodynamics, venturi tunnel physics, telemetry analysis, active aerodynamics 2026"_).

---

## 8. Architectural Governance Sign-Off

```text
========================================================================================
                          ADR APPROVAL SUMMARY
========================================================================================
ADR-001: Original 3D Chassis Migration (EDS-G01)             [APPROVED FOR M2.1]
ADR-002: Decommissioning Procedural Trademarks & Presets    [APPROVED FOR M2.1]
ADR-003: Hosting Migration (Cloudflare Pages / Vercel Pro)   [APPROVED FOR M2.1]
ADR-004: Geospatial Tile Provider Migration                  [APPROVED FOR M2.1]
ADR-005: Privacy & GDPR Consent Architecture                 [APPROVED FOR M2.1]
ADR-006: Technical SEO & Canonical Remediation               [APPROVED FOR M2.1]
========================================================================================
```
