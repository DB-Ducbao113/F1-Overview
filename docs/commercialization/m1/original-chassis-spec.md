# EDS-M1.5 — Original 3D Chassis Specification: EDS-G01

**Project:** Podium Effet De Sol (EDS)  
**Document:** Technical Specification & 3D Engineering Architecture  
**Concept Code:** `EDS-G01` (Effet De Sol — Generation 01 Modular Ground Effect Vehicle)  
**Author:** Principal Software Architect & 3D Technical Director  
**Date:** 2026-10-17  

---

## 1. Design Vision & Legal Positioning

The **EDS-G01** is a bespoke, 100% original high-downforce motorsport vehicle engineered specifically for the Podium Effet De Sol digital showroom.

### Core Legal & Engineering Principles:
1. **Zero Trade Dress Infringement**: Designed from first aerodynamic principles, avoiding the signature contours, nose cones, sidepod inlets, and liveries of any existing Formula 1 constructor (Ferrari, Red Bull, Mercedes, McLaren, etc.).
2. **Authentic Ground Effect Physics**: Conforms faithfully to FIA Ground Effect aerodynamic philosophy (Venturi tunnels, contoured floor fences, diffuser expansion chambers, active DRS actuation, and halo safety structure).
3. **Drop-in Showroom Compatibility**: The geometry hierarchy directly maps to the existing 9 material slots in `F1Car3DModel.tsx` and the 6 interactive hotspots in `hotspotsData.ts`, guaranteeing zero regression in user experience.

---

## 2. Vehicle Dimensional & Aerodynamic Architecture

```
                    ┌─────── AIRBOX INLET (350mm) ────────┐
                    │                                     │
    [NOSE CONE]─────┴──[MONOCOQUE]────[SIDEPODS]──────────┴────[REAR WING / DRS]
      Length: 5.05m      Width: 2.00m      Height: 0.95m      Wheelbase: 3.60m
     Underfloor: Dual Venturi Tunnels (Height 120mm -> Expansion Diffuser 320mm)
```

| Parameter | Specification | Engineering Rationale |
|---|---|---|
| **Overall Length** | `5,050 mm` | Optimized for 1:1 real-time canvas rendering at `MODEL_SCALE = 0.105` |
| **Overall Width** | `2,000 mm` | Full track width for authentic proportion and camera framing |
| **Overall Height** | `950 mm` | Monocoque to top of engine airbox intake |
| **Wheelbase** | `3,600 mm` | Stable visual wheelbase matching existing showroom camera orbits |
| **Minimum Dry Mass** | `768 kg` | Regulation standard 2026 ground effect formula |
| **Floor Concept** | Venturi Ground Effect | Continuous shaped carbon tunnels with 4 vortex edge fences |
| **Active Aero System** | Dual-mode DRS flap | Rotating upper rear wing element with hydraulic pivot arm |

---

## 3. Modular Geometry Subassemblies (9-Slot Primitive Architecture)

To ensure seamless integration with the existing `F1Car3DModel.tsx` material assignment logic, the EDS-G01 model hierarchy is structured into exactly 9 mesh primitives:

| Mesh Name | Primitive ID | Description & Aerodynamic Function | Materials / Shaders |
|---|---|---|---|
| `EDS_007_Monocoque_Nose` | `007` | Survival cell, nose cone, front crash structure, driver cockpit rim | `MeshPhysicalMaterial` (Bespoke lacquer, clearcoat 1.0, metallic 0.25) |
| `EDS_005_Wings_Assembly` | `005` | 4-element front wing cascade, endplates, outwash vanes, rear wing main plane and DRS flap | `MeshPhysicalMaterial` (Pre-preg carbon weave, clearcoat 0.9, roughness 0.22) |
| `EDS_004_Bodywork_Sidepods` | `004` | Undercut sidepods, cooling louvres, engine cover, dorsal shark fin, central airbox | `MeshPhysicalMaterial` (Primary livery paint, clearcoat 1.0, metallic 0.3) |
| `EDS_001_Floor_Underfloor` | `001` | Twin Venturi ground-effect floor, floor edge fences, Jabroc skid plank, diffuser strakes | `MeshStandardMaterial` (Matte resin carbon, roughness 0.55, metallic 0.25) |
| `EDS_008_Halo_Structure` | `008` | Grade 5 titanium safety halo with aerodynamic top fairing and transition fairings | `MeshPhysicalMaterial` (Titanium satin, clearcoat 0.7, metallic 0.45) |
| `EDS_003_Suspension_Mirrors` | `003` | Carbon aero wishbones, pushrods, track rods, wing mirror stalks and glass | `MeshPhysicalMaterial` (Aero carbon + chrome mirror reflection) |
| `EDS_009_Diffuser_RainLight` | `009` | Rear diffuser extraction ramps, exhaust outlet, FIA 24-LED ruby rain light | `MeshPhysicalMaterial` (Inconel exhaust heat-tint, ruby emissive LED) |
| `EDS_002_Cockpit_Interior` | `002` | Carbon tub seat, 6-point harness, PCU-8D telemetry display, multi-dial steering wheel | `MeshStandardMaterial` (Matte carbon, Alcantara, LED emissive display) |
| `EDS_006_Wheels_Tires` | `006`, `011`, `013` | 18" forged magnesium lightweight rims, aerodynamic flush wheel covers, smooth competition slicks | `MeshStandardMaterial` (Vulcanized rubber, satin magnesium, roughness 0.45) |

---

## 4. Texture Maps, UV Layout & PBR Specifications

Each mesh primitive is UV-unwrapped without overlapping islands across 4 dedicated 2K texture sets:

```
┌────────────────────────────────────────────────────────┐
│                   EDS-G01 TEXTURE SETS                 │
├────────────────────┬───────────────────┬───────────────┤
│ Map Name           │ Resolution        │ Format        │
├────────────────────┼───────────────────┼───────────────┤
│ 1. EDS_Aero_Body   │ 2048 x 2048 px    │ WebP / KTX2   │
│ 2. EDS_Mechanical  │ 2048 x 2048 px    │ WebP / KTX2   │
│ 3. EDS_Cockpit     │ 1024 x 1024 px    │ WebP / KTX2   │
│ 4. EDS_Wheels      │ 1024 x 1024 px    │ WebP / KTX2   │
└────────────────────┴───────────────────┴───────────────┘
```

### PBR Surface Channels:
- **Albedo / Base Color (`map`)**: 24-bit sRGB color space. Contains bespoke EDS livery graphics, geometric pinstripes, and technical sponsors.
- **Normal Map (`normalMap`)**: 16-bit tangent-space normals for fasteners, carbon fiber weave micro-relief, panel gaps, and cooling louvre depth.
- **Roughness / Metalness (`roughnessMap`, `metalnessMap`)**: Packed RMA format (Roughness: R, Metalness: G, Ambient Occlusion: B).
- **Emissive Map (`emissiveMap`)**: Steering wheel OLED telemetry, steering wheel RPM shift lights, FIA rear rain light.

---

## 5. Performance Budget: Desktop vs Mobile

To maintain 60 FPS across all viewports and satisfy Core Web Vitals (INP ≤ 200ms, LCP ≤ 2.5s), the model must strictly adhere to the following hardware budget:

| Metric | Target Budget (Desktop) | Target Budget (Mobile) | Hard Ceiling |
|---|---|---|---|
| **Triangle Count (LOD0)** | 85,000 – 110,000 | N/A (switches to LOD1) | 120,000 |
| **Triangle Count (LOD1)** | N/A | 35,000 – 45,000 | 50,000 |
| **Draw Calls** | ≤ 18 | ≤ 12 | 25 |
| **VRAM Consumption** | ≤ 32 MiB | ≤ 18 MiB | 40 MiB |
| **GLB File Size (Compressed)** | ≤ 1.8 MiB | ≤ 1.2 MiB | 2.0 MiB |
| **Meshopt Compression Ratio** | ≥ 65% | ≥ 70% | N/A |
| **Target Frame Rate** | 60 FPS (V-Sync) | 60 FPS (V-Sync) | ≥ 45 FPS |

---

## 6. Hotspot & Camera Alignment

The 6 interactive inspection hotspots (`wings`, `drs`, `sidepods`, `power_unit`, `halo`, `tires`) are aligned to the exact coordinate space:

| Hotspot ID | EDS-G01 3D Marker Position `[x, y, z]` | Target Focus Point `[x, y, z]` | Inspection Camera Orbit `[x, y, z]` |
|---|---|---|---|
| `wings` | `[0.00, 0.28, -2.25]` | `[0.00, 0.25, -2.20]` | `[1.20, 0.90, -3.20]` |
| `drs` | `[0.00, 0.85, 2.05]` | `[0.00, 0.82, 2.00]` | `[1.30, 1.15, 3.10]` |
| `sidepods` | `[0.85, 0.38, 0.05]` | `[0.55, 0.35, 0.05]` | `[2.10, 0.80, 0.20]` |
| `power_unit`| `[0.00, 0.62, 0.65]` | `[0.00, 0.55, 0.60]` | `[1.50, 1.20, 1.10]` |
| `halo` | `[0.00, 0.78, -0.42]` | `[0.00, 0.70, -0.40]` | `[0.95, 1.10, -0.70]` |
| `tires` | `[0.98, 0.35, -1.60]` | `[0.85, 0.32, -1.55]` | `[2.00, 0.65, -1.90]` |

---

## 7. Migration & Rollback Strategy

1. **Dual Asset Pipeline**: The asset loader will support both `c42.v2.glb` and `eds-g01.glb` concurrently behind an environment toggle:
   ```ts
   const MODEL_ASSET = import.meta.env.VITE_USE_ORIGINAL_CHASSIS === 'true'
     ? '/models/eds-g01.glb'
     : '/models/c42.v2.glb';
   ```
2. **Automated Visual Regression Test**: Playwright E2E test will capture WebGL canvas screenshots at 3 canonical camera angles to ensure parity in lighting, shadows, and hotspot placement.
3. **Instant Rollback**: If frame rate or WebGL context recovery fails on lower-end mobile devices during canary testing, `VITE_USE_ORIGINAL_CHASSIS` can be reverted instantly without database or API migrations.
