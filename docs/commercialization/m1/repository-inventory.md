# EDS-M1.1 — Repository Inventory & Technical Baseline

**Project:** Podium Effet De Sol (EDS)  
**Branch Audited:** `Per-PEDS` (commit `989a0e7`, based on `version-1.3` with comparison against `main` commit `2779cac`)  
**Audit Date:** 2026-10-17  
**Auditor:** Principal Software Architect & Release Gatekeeper  

---

## 1. Executive Summary

This inventory documents the structural, architectural, and asset footprint of the Podium Effet De Sol (EDS) repository. The application is a high-fidelity motorsport technical hub featuring interactive 3D vehicle anatomy, race calendars, championship standings, and real-time live timing proxies.

---

## 2. Core Architecture & Technology Stack

| Layer | Technology | Version | Purpose / Configuration |
|---|---|---|---|
| **Runtime / UI Framework** | React | `18.3.1` | Client-side SPA rendering with Hooks |
| **Language & Typings** | TypeScript | `5.5.3` | Strict type checking (`tsconfig.json` target ES2020) |
| **Bundler & Dev Server** | Vite | `6.4.3` | Native ESM dev server + Rollup production build |
| **3D Engine** | Three.js | `0.165.0` | WebGL 2.0 / WebGL 1.0 scene graph and PBR pipeline |
| **3D React Bindings** | `@react-three/fiber` | `8.16.8` | Declarative R3F component tree |
| **3D Helpers** | `@react-three/drei` | `9.108.4` | OrbitControls, Html overlays, GLTF loaders |
| **State Management** | Zustand | `4.5.4` | Lightweight reactive store (`useChampionshipStore.ts`) |
| **Routing** | React Router DOM | `7.18.4` | Client-side SPA routing (`BrowserRouter`) |
| **CSS Framework** | Tailwind CSS | `3.4.4` | Utility-first CSS with PostCSS & Autoprefixer |
| **Class Utilities** | `clsx` + `tailwind-merge` | `2.1.1` / `2.3.0` | Dynamic style merging |
| **GIS / Mapping** | Leaflet + `@types/leaflet` | `1.9.4` / `1.9.22` | Satellite and GPS circuit track mapping |
| **Icons** | `lucide-react` | `0.400.0` | Technical motorsport UI iconography |
| **Observability** | `@vercel/analytics` + `@vercel/speed-insights` | `2.0.1` / `2.0.0` | Real-user Web Vitals & route analytics |

---

## 3. Hosting, Deployment & Infrastructure Configuration

### 3.1 Primary Hosting: Vercel Serverless & Edge Network
- **Production URL:** `https://podiumeds.vercel.app/`
- **Routing & Rewrite Rules (`vercel.json`):**
  - `/api/:path*` rewrites directly to serverless route handlers in `api/`.
  - `/(.*)` rewrites all navigation requests to `/index.html` (SPA fallback).
- **Edge Cache Headers:**
  - `/assets/(.*)` and `/models/(.*)`: `public, max-age=31536000, immutable` (1-year immutable edge caching).
  - `/images/(.*)`: `public, max-age=604800, stale-while-revalidate=86400` (7-day cache with 24h background revalidation).
- **HTTP Security Headers (`vercel.json`):**
  - `X-Frame-Options: SAMEORIGIN`
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=()`
  - `Strict-Transport-Security: max-age=31536000; includeSubDomains`
  - `Cross-Origin-Opener-Policy-Report-Only: same-origin`
  - `Cross-Origin-Embedder-Policy-Report-Only: require-corp`
  - `Content-Security-Policy`: Restricts scripts to `'self' 'wasm-unsafe-eval'`, fonts to Google Fonts (`fonts.gstatic.com`), images to `'self' data: blob: images.unsplash.com server.arcgisonline.com *.tile.openstreetmap.org`, and connects to `api.jolpi.ca`, `api.openf1.org`, and `vitals.vercel-insights.com`.

### 3.2 Container Infrastructure: Docker & Nginx
- **`Dockerfile`:**
  - Multi-stage build based on `node:22-alpine` builder and `nginx:1.27-alpine` runtime.
  - Security hardening: Runs as unprivileged non-root user `nginx` (UID 101) on port `8080`.
  - Includes custom `nginx.conf` with gzip compression, security headers, and `/healthz` health check endpoint.
- **`docker-compose.yml`:**
  - Exposes port `8080:8080` with restart policy `unless-stopped`.

### 3.3 CI/CD Workflows (`.github/workflows/`)
1. **`ci.yml`**:
   - Triggers: Push to `main`, `develop`, feature/fix branches; all pull requests.
   - Jobs: `npm ci`, `npm run lint`, `npm run format:check`, `npm run test:coverage`, `npm run build`, `npm audit --audit-level=critical`, and `Secret scan` (detects raw GitHub PAT tokens `ghp_*`).
2. **`auto-update-f1.yml`**:
   - Triggers: Scheduled cron (`*/15 * * * 4,5,6,0` — Thu-Sun race weekends every 15 min), manual `workflow_dispatch`.
   - Actions: Executes `scripts/sync-openf1-sessions.js` (live timing) and `scripts/update-2026-data.js` (Jolpica), commits data changes if detected, and builds to verify integrity before pushing to repository.
3. **`docker-publish.yml`**:
   - Triggers: Push to `main`, version tags `v*.*.*`, manual trigger.
   - Actions: Builds multi-arch Docker image, publishes to GitHub Container Registry (`ghcr.io`), and executes Aquasecurity Trivy vulnerability scan for `CRITICAL,HIGH` CVEs.

---

## 4. Media & Static Asset Inventory

### 4.1 3D Models
| Asset Path | File Size | Format | Usage Reference | Provenance / License |
|---|---|---|---|---|
| `public/models/c42.v2.glb` | 2,164,896 B (~2.06 MiB) | GLTF 2.0 Binary (Meshopt) | `src/components/showroom/F1Car3DModel.tsx` | Derived from `markste-in/c42` (Alfa Romeo C42 AR model). Code/mesh under WTFPL v2; vehicle shape, trade dress & logos owned by Alfa Romeo / Sauber / Stellantis. |

### 4.2 Textures
| Asset Path | File Size | Format | Usage Reference | Provenance / License |
|---|---|---|---|---|
| `public/textures/wheel_base.webp` | 37,792 B (~36.9 KiB) | WebP | `src/components/showroom/F1Car3DModel.tsx` | Base Pirelli tire sidewall & BBS magnesium rim texture. |
| Runtime Canvas Textures | N/A (RAM) | HTML5 2D Canvas | `src/components/showroom/F1CarTextures.ts` | 9 procedural texture maps generated dynamically: Nose, Bodywork, Wings, Floor, Suspension, Diffuser, Cockpit, Halo, Wheels. Contains procedural sponsor wordmarks. |
| Studio Backdrop Texture | N/A (RAM) | HTML5 2D Canvas | `src/components/showroom/StudioBackdropTexture.ts` | Procedural studio floor grid and manufacturer logo backdrop. |

### 4.3 Schematics & Technical CAD Assets
| Asset Directory | Count | Total Size | Format | Usage Reference | Provenance |
|---|---|---|---|---|---|
| `public/images/showroom/schematics/*.webp` | 11 files | 1,864,800 B (~1.78 MiB) | WebP (1024x1024) | `src/components/showroom/SchematicComparisonModal.tsx` | Technical CAD top-view wireframe schematics for 11 teams: Alpine, Aston Martin, Audi, Cadillac, Ferrari, Haas, McLaren, Mercedes, Racing Bulls, Red Bull, Williams. |

### 4.4 Technical Close-Up Renders
| Asset Directory | Count | Total Size | Format | Usage Reference | Provenance |
|---|---|---|---|---|---|
| `public/images/showroom/closeups/*.webp` | 66 files | 1,213,248 B (~1.16 MiB) | WebP (~600x400) | `src/data/showroom/teamCloseups.ts` | 6 component renders per team (drs, halo, power_unit, sidepods, tires, wings) across all 11 teams. Bespoke technical close-ups rendered for the project. |

### 4.5 Team Teasers & Vehicle Renders
| Asset Directory | Count | Total Size | Format | Usage Reference | Provenance |
|---|---|---|---|---|---|
| `public/images/teams/*.webp` | 11 files | 815,198 B (~796 KiB) | WebP (~1200x800) | `src/data/cars/2026.ts`, `TeamsDirectoryPage.tsx` | Official car teaser renders: `alpine.webp`, `astonmartin.webp`, `audi.webp`, `cadillac.webp`, `haas.webp`, `mcl38.webp`, `racingbulls.webp`, `rb20.webp`, `sf24.webp`, `w15.webp`, `williams.webp`. Direct representations of manufacturer F1 cars. |

### 4.6 Brand & Iconography Assets
| Asset Path | File Size | Format | Usage Reference | Provenance |
|---|---|---|---|---|
| `public/logo/logo.png` | 246,326 B | PNG | `OfficialBrandLogo.tsx`, `Navbar.tsx` | Primary metallic brand mark for Podium Effet De Sol. |
| `public/logo/icon-512.png` | 235,669 B | PNG | `manifest.webmanifest`, PWA icon | 512x512 PWA application icon. |
| `public/logo/icon-192.png` | 44,554 B | PNG | `manifest.webmanifest`, `OfficialBrandLogo.tsx` | 192x192 PWA application icon. |
| `public/logo/apple-touch-icon.png` | 39,844 B | PNG | `index.html` | iOS home screen icon. |
| `public/logo/logo-compact.png` | 11,451 B | PNG | `OfficialBrandLogo.tsx` | Compact horizontal brand mark. |
| `public/logo/favicon.ico` | 15,086 B | ICO | `index.html` | Browser favicon. |
| `public/logo/og-preview.jpg` | 84,131 B | JPEG | `index.html` (og:image) | 1200x630 OpenGraph social share card. |
| `src/data/showroom/teamLogoSVGs.ts` | 61,264 B | TypeScript (Inline SVG) | `StudioBackdropTexture.ts` | High-precision vector SVGs for all 11 constructors (Ferrari shield, Mercedes star, Cadillac crest, Red Bull bulls, etc.). Sourced from Simple Icons & FIA assets. |
| `src/components/common/ConstructorLogo.tsx` | 64,648 B | TypeScript (React SVG) | Standings, Calendar, Directives | High-precision vector SVGs for 11 constructors. |

### 4.7 Fonts & Typography
- **Google Fonts CDN:**
  - `Inter`: Weights 100–900 variable, Latin + Vietnamese glyphs (Technical UI & telemetry).
  - `Playfair Display`: Weights 400, 600, 700 italic/normal, Latin + Vietnamese glyphs (Editorial headlines).
  - Preconnected to `https://fonts.googleapis.com` and `https://fonts.gstatic.com`.
  - License: SIL Open Font License (OFL) 1.1.

---

## 5. Architectural Observations: `Per-PEDS` vs `main`

1. **Chassis & Showroom Implementation**:
   - `Per-PEDS` retains the direct monolithic `ShowroomScene` with procedural 2K textures generated at startup.
   - `main` has merged Release 2 optimizations: lazy `ShowroomScene`, split bundle loading, reactive mobile breakpoints, and initial texture caching.
2. **Font Hosting**:
   - `main` includes self-hosted fonts under `public/fonts/` (`inter-latin.woff2`, `playfair-display-latin.woff2`), whereas `Per-PEDS` loads via Google Fonts CDN.
3. **Data Pipelines**:
   - Both branches share identical data contracts for `auto-update-f1.yml`, `scripts/sync-openf1-sessions.js`, and `scripts/update-2026-data.js`.
