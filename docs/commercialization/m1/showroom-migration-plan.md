# EDS-M1.6 — 3D Showroom Migration & Replacement Plan

**Project:** Podium Effet De Sol (EDS)  
**Document:** Showroom Migration Architecture & Engineering Plan  
**Target Vehicle:** `EDS-G01.glb` (Replacing `c42.v2.glb`)  
**Auditor:** Principal Software Architect & Senior QA Engineer  
**Date:** 2026-10-17  

---

## 1. Executive Summary

The 3D Showroom is the visual centerpiece of Podium Effet De Sol. This migration plan details the end-to-end operational roadmap to decommission the Alfa Romeo-derived `c42.v2.glb` model, eliminate trademarked constructor sponsor liveries, and introduce the original **EDS-G01** modular platform without degrading runtime performance or user experience.

---

## 2. Core Functional Requirements to Preserve

During and after the migration, the Showroom must maintain 100% of the following capabilities:
1. **Interactive Camera Controller (`CameraController.tsx`)**: Smooth cinematic lerp transitions between orbit angles, preset camera angles, and hotspot focus points.
2. **Interactive Technical Hotspots (`HotspotSelectorBar.tsx`, `HotspotDetailsModal.tsx`)**: 6 inspection nodes (`wings`, `drs`, `sidepods`, `power_unit`, `halo`, `tires`) rendered as HTML overlay badges with pulse animations.
3. **Schematic Comparison Modal (`SchematicComparisonModal.tsx`)**: High-contrast top-view technical wireframe blueprints with component callouts.
4. **Lighting & Stage Presentation (`StudioW15Stage.tsx`)**: Three-point studio lighting, soft ground contact shadows, ambient occlusion, and floor reflections.
5. **Responsive Performance**: Fluid touch rotation, pinch-to-zoom on iOS/Android, and 60 FPS rendering across mobile (375x812) and desktop (1440x900).

---

## 3. Five-Phase Migration Implementation Roadmap

```
Phase 1: Asset Authoring & Validation
  └── Model Bake (glTF 2.0) ──> Meshopt Compression ──> UV & Normal Verification

Phase 2: Dual-Model Component Abstraction
  └── Refactor F1Car3DModel.tsx ──> Feature Flag (VITE_USE_ORIGINAL_CHASSIS)

Phase 3: Livery & Shader Modernization
  └── Replace procedural F1 trademarks with 6 Original EDS Engineering Liveries

Phase 4: 2D Imagery & Schematic Overhaul
  └── Render new CAD schematics (11) & close-ups (66) from EDS-G01 master CAD

Phase 5: Automated Verification & Production Cutover
  └── Playwright E2E visual regression ──> Canary Deployment ──> Decommission c42
```

---

### Phase 1: 3D Asset Authoring & Compression
- **Tooling:** Blender 4.x / Maya → `gltfpack` (Meshopt & KTX2 texture compression).
- **Deliverables:**
  - `public/models/eds-g01.glb` (Meshopt-compressed, target file size ≤ 1.8 MiB).
  - Normal, roughness, and AO texture atlases.
- **Verification Gate:**
  - Geometry passes `gltf-validator` with 0 errors and 0 warnings.
  - Draw call count verified at ≤ 18 draw calls.

---

### Phase 2: Showroom Component Abstraction & Feature Toggling
Refactor `F1Car3DModel.tsx` into a modular architecture:
```tsx
// src/components/showroom/CarModelLoader.tsx
const activeModelPath = import.meta.env.VITE_USE_ORIGINAL_CHASSIS === 'true'
  ? '/models/eds-g01.glb'
  : '/models/c42.v2.glb';

export const CarModelLoader: React.FC<CarModelLoaderProps> = (props) => {
  return <RealF1CarMesh modelPath={activeModelPath} {...props} />;
};
```
- Ensures development teams and stakeholders can toggle between models locally and in staging environments with zero code modifications.

---

### Phase 3: Original EDS Engineering Livery System
Replace the 11 trademarked team liveries (`teamLiveries.ts` and `F1CarTextures.ts`) with **6 Bespoke EDS Motorsport Presets**:

| Livery ID | Name | Theme & Color Palette | Material Treatment |
|---|---|---|---|
| `eds-carbon` | **Carbon Heritage** | Raw matte carbon fiber weave (`#101216`) with titanium accents (`#94A3B8`) | Exposed carbon weave, satin clearcoat 0.4 |
| `eds-aero` | **Aero Velocity** | Deep Navy (`#0A1128`) + High-contrast Neon Cyan flowlines (`#00F0FF`) | High-gloss metallic lacquer, clearcoat 1.0 |
| `eds-crimson`| **Scuderia Prototype** | Racing Crimson (`#D90429`) + Championship White (`#FFFFFF`) | Ultra-gloss PBR paint, mirror finish |
| `eds-monochrome`| **Studio Stealth** | Obsidian Black (`#050505`) + Brushed Platinum (`#E2E8F0`) | Matte stealth finish, low reflectance |
| `eds-gold` | **Grand Prix Edition** | Imperial Gold (`#D4AF37`) + Royal Emerald (`#004B42`) | Metallic pearlescent flake, clearcoat 1.0 |
| `eds-electric`| **Cyber Kinetic** | Matte Gunmetal (`#1F2421`) + Electric Yellow accents (`#CCFF00`) | High-visibility technical livery |

All procedural sponsor drawing functions in `F1CarTextures.ts` (`drawHpLogo`, `drawFerrariShield`, `drawRedBullChargingBulls`, etc.) are decommissioned and replaced with generic technical sponsor markings:
- `drawEdsEngineeredBadge()`: Precision mathematical caliper logo.
- `drawFlowStreamPinstripe()`: High-energy aerodynamic vortex markers.
- `drawTechnicalTelemetryMarkers()`: Tire temperature indicator bands, pitot tube sensor indicators.

---

### Phase 4: Supporting 2D Imagery & Blueprint Overhaul
1. **Schematic Blueprints (`public/images/showroom/schematics/*.webp`)**:
   - Re-render the 11 wireframe schematics directly from the EDS-G01 master 3D model at 1024x1024 WebP.
   - Map each wireframe to the 6 livery presets and 5 experimental aerodynamic trim configurations (High Downforce, Low Drag Monza spec, Active Aero X-Mode).
2. **Component Closeups (`public/images/showroom/closeups/*.webp`)**:
   - Re-render the 66 closeup assets from EDS-G01 CAD geometry:
     - Front wing flap cascades & vortex generators.
     - Hydraulic DRS actuator mechanism in open/closed state.
     - Undercut sidepod inlets and cooling louvre channels.
     - Powertrain packaging, hybrid turbo and 350kW MGU-K motor enclosure.
     - Grade 5 titanium halo fairing and cockpit display.
     - Unbranded 18" forged wheel rims and slick tire tread.

---

### Phase 5: QA Testing, WebGL Validation & Cutover

#### Automated Quality Gates:
1. **WebGL Context Loss & Recovery**:
   - Synthetic crash test: Simulate `gl.getExtension('WEBGL_lose_context').loseContext()` and verify clean scene reconstruction without memory leaks.
2. **VRAM & Heap Leak Verification**:
   - Repeatedly switch between all 6 livery presets 50 times in automated headless browser test.
   - Max allowable heap growth: ≤ 5.0 MB across 50 iterations.
3. **Playwright Visual Parity Test**:
   - Capture regression screenshots across 3 viewports:
     - Mobile: iPhone 14 Pro (390 x 844)
     - Tablet: iPad Mini (768 x 1024)
     - Desktop: 1440 x 900
   - Verify zero clipping of 3D canvas, zero horizontal overflow, and accessible touch target sizes (≥ 44px).

---

## 4. Rollback & Contingency Protocols

If any critical rendering regression or memory leak is discovered on production devices:
1. Toggle Vercel environment variable `VITE_USE_ORIGINAL_CHASSIS=false`.
2. Vercel automatically deploys the rollback within 45 seconds without code commits.
3. Rollback retains full user functionality while engineering resolves the shader or geometry defect.
