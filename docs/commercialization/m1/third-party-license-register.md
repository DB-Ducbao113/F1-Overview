# EDS-M1.3 — Third-Party License Register & Compliance Audit

**Project:** Podium Effet De Sol (EDS)  
**Branch Audited:** `Per-PEDS`  
**Audit Date:** 2026-10-17  
**Auditor:** Principal Software Architect & Release Gatekeeper  

---

## 1. Executive Summary

This register cataloges all software dependencies, runtime libraries, development tools, typography licenses, and third-party assets utilized in Podium Effet De Sol. Each item is audited against commercial licensing requirements, copyleft obligations, redistribution conditions, and patent grants.

**Conclusion:** The runtime codebase contains **zero** copyleft (GPL/AGPL/LGPL) dependencies. All runtime software libraries are distributed under permissive open-source licenses (MIT, Apache-2.0, BSD-2-Clause, ISC). Commercial software risk is strictly confined to asset provenance (3D geometry and trademarks), not the software library supply chain.

---

## 2. Runtime Software Dependencies (`package.json`)

| Package Name | Installed Version | License Type | Commercial Use Permitted? | Attribution Obligation | Notes / Compliance Requirements |
|---|---|---|---|---|---|
| `react` | `18.3.1` | MIT | YES | YES | Meta Platforms copyright notice must be preserved in bundled licenses. |
| `react-dom` | `18.3.1` | MIT | YES | YES | Standard MIT conditions. |
| `react-router-dom` | `7.18.4` | MIT | YES | YES | Shopify Inc. copyright notice. |
| `three` | `0.165.0` | MIT | YES | YES | Core 3D engine. Ricardo Cabello (Mr.doob) & Three.js authors. |
| `@react-three/fiber` | `8.16.8` | MIT | YES | YES | Poimandres open-source collective. |
| `@react-three/drei` | `9.108.4` | Apache-2.0 | YES | YES + State Changes | Apache 2.0 requires preservation of NOTICE files and explicit statement of modifications. |
| `zustand` | `4.5.4` | MIT | YES | YES | Reactive state store. Standard MIT. |
| `clsx` | `2.1.1` | MIT | YES | YES | Luke Edwards. |
| `tailwind-merge` | `2.3.0` | MIT | YES | YES | Dany Castillo. |
| `leaflet` | `1.9.4` | BSD-2-Clause | YES | YES | Vladimir Agafonkin & CloudMade. Requires reproducing copyright notice and disclaimer in documentation. |
| `@types/leaflet` | `1.9.22` | MIT | YES | NO (types only) | DefinitelyTyped. |
| `lucide-react` | `0.400.0` | ISC | YES | YES | Permissive ISC license, functionally equivalent to MIT. |
| `@vercel/analytics` | `2.0.1` | Apache-2.0 | YES | YES | Vercel Inc. telemetry library. Free tier subject to Vercel Fair Use. |
| `@vercel/speed-insights` | `2.0.0` | Apache-2.0 | YES | YES | Vercel Inc. Web Vitals library. |

---

## 3. Development & Build Dependencies

| Package Name | Version | License | Development-Only Scope |
|---|---|---|---|
| `vite` | `6.4.3` | MIT | Build tool / bundler. Not shipped in production bundle. |
| `typescript` | `5.5.3` | Apache-2.0 | Compiler. Not shipped in production bundle. |
| `tailwindcss` | `3.4.4` | MIT | PostCSS CSS compiler. Output CSS is pure stylesheet. |
| `postcss` / `autoprefixer` | `8.4.39` / `10.4.19` | MIT | CSS build tools. |
| `eslint` / `typescript-eslint` | `10.11.0` / `8.70.1` | MIT | Static linting tool. |
| `prettier` | `3.9.9` | MIT | Code formatting engine. |
| `vitest` / `@vitest/coverage-v8` | `5.0.3` | MIT | Test harness and code coverage engine. |
| `pngjs` | `7.0.0` | MIT | Raster testing fixture utility. |

---

## 4. Typography & Font Licenses

| Font Family | Files / Distribution | Source | License | Commercial Permissibility & Requirements |
|---|---|---|---|---|
| **Inter** | `Inter:ital,opsz,wght@0,14..32,100..900` | Google Fonts CDN (and `public/fonts/` on `main`) | SIL Open Font License 1.1 (OFL-1.1) | **PERMITTED FOR COMMERCIAL USE**. Freely usable in commercial web applications. Restriction: Cannot be sold by itself. |
| **Playfair Display** | `Playfair+Display:ital,wght@0,400;0,600;0,700` | Google Fonts CDN (and `public/fonts/` on `main`) | SIL Open Font License 1.1 (OFL-1.1) | **PERMITTED FOR COMMERCIAL USE**. Claus Eggers Sørensen. |

---

## 5. Non-Code & Media Asset Licenses

| Asset | Description | Source / Declared License | Actual Legal Status |
|---|---|---|---|
| `c42.v2.glb` | 3D Car Model | GitHub `markste-in/c42` (`LICENSE.md`: WTFPL v2) | **CODE/DATA ONLY**: WTFPL v2 permits anyone to do anything with the 3D file data. However, the model geometry is a direct derivative of Alfa Romeo's copyrighted and design-patented Formula 1 car. **Unlicensed for commercial use.** |
| Map Tiles (OSM) | Street / track vector data | OpenStreetMap Foundation | Open Database License (ODbL 1.0) / CC BY-SA 2.0. Requires credit: *"© OpenStreetMap contributors"*. Commercial tile usage limits apply. |
| Satellite Imagery | World Imagery tiles | Esri ArcGIS Online | **PROPRIETARY**: Free access is limited to non-commercial evaluation. For-profit websites must license via ArcGIS Location Services. |

---

## 6. License Compatibility Matrix & Recommendations

```text
LICENSING MATRIX EVALUATION:
[PASS] MIT License:               100% Commercial Compatible (Redistribution with notice)
[PASS] Apache-2.0 License:        100% Commercial Compatible (Includes patent grant)
[PASS] BSD-2-Clause License:      100% Commercial Compatible (Redistribution with disclaimer)
[PASS] ISC License:               100% Commercial Compatible (Functionally equivalent to MIT)
[PASS] SIL Open Font License 1.1: 100% Commercial Compatible (Embedded in web apps)
[FAIL] WTFPL on 3D Model:         Invalid for commercial automotive trade dress clearance
[WARN] Esri Map Tiles:            Requires commercial subscription or replacement
```

### Actionable Next Steps:
1. Generate an automated `THIRD_PARTY_LICENSES.txt` bundle during production build via Rollup/Vite plugin (`rollup-plugin-license` or similar) to satisfy MIT/Apache notice requirements.
2. Replace Esri ArcGIS tile source with open/commercial tile service (Mapbox, Protomaps, or Stadia Maps).
3. Replace `c42.v2.glb` with original **EDS-G01** chassis authored specifically under internal proprietary or MIT license for Podium Effet De Sol.
