# EDS-G03 D2 vs C42 Reference & EDS D1 — Geometry Landmark Comparison Report

**Author**: Lead F1 Vehicle Designer & Independent QA Engineer

**Date**: 2026-10-22

**Target Environment**: Local Blender 5.2.2 LTS / DEV Review Only
**Gate**: OWNER D2 SHAPE & C42 FIDELITY REVIEW

---

## 1. Executive Summary

The owner directed a complete geometric upgrade from **EDS-G03 D1** to **EDS-G03 D2**, utilizing the authoritative repository reference `public/models/c42.v2.glb` as the principal geometric benchmark rather than merely an evaluation backdrop.

D1 suffered from a soft, bulbous, toy-like appearance resulting from primitive superellipses, flat airfoil plates, planar endplates, and round cylinder wishbones. D2 introduces a professional F1 automotive modeling pipeline with:

- True 3D multi-element aerodynamic front wing (4 cascaded elements with dihedral and anhedral curvature)
- Modern F1 sculpted endplates with outward flare, trailing edge cutouts, footplates, and dive planes
- Chiseled monocoque cross-sections with defined bevel shoulders and concave aerodynamic floor channels
- Predatory sidepod intakes with forward-jutting upper overbite lips, deep sculpted undercuts, downwash decks with longitudinal cooling louvres, and tight coke-bottle waists
- Ground-effect Venturi underbody with forward tea-tray splitter, 4 leading-edge tunnel fences per side, stepped floor edge wings, and a diffuser kicking up to the locked 1.160 m exit width with 4 divider strakes
- Sculpted rear wing with 3D spoon camber, DRS actuator bullet pod, double-element beam wing, and swan-neck pylons
- 18-inch Pirelli-style slick tyres with square shoulders, flat contact patch, aero wheel dish covers, carbon ceramic brakes, multi-piston calipers, and mandatory 2022+ tyre-wake eyebrow deflectors

---

## 2. Quantitative Dimension & Landmark Comparison

| Vehicle Landmark / Dimension | C42 Reference (Raw Units) | C42 Reference (Norm. 5.05m) |   EDS-G03 D1   |    EDS-G03 D2    | Locked Registry Target  |             Compliance Status             |
| :--------------------------- | :-----------------------: | :-------------------------: | :------------: | :--------------: | :---------------------: | :---------------------------------------: |
| **Overall Length**           |          46.317           |           5.050 m           |    5.050 m     |   **5.046 m**    |         5.050 m         |          **PASS** (within 4 mm)           |
| **Overall Width**            |          16.613           |           1.811 m           |    2.000 m     |   **1.990 m**    |      $\le$ 2.000 m      |     **PASS** (strictly $\le$ 2.000 m)     |
| **Overall Height**           |           9.109           |           0.993 m           |    1.178 m     |   **1.089 m**    |      $\le$ 1.180 m      |         **PASS** (below ceiling)          |
| **Wheelbase**                |          29.373           |           3.203 m           |    3.600 m     |   **3.600 m**    |         3.600 m         |      **PASS** (exact locked axle Z)       |
| **Front Axle Z**             |          +12.339          |          +1.345 m           |    -1.750 m    |   **-1.750 m**   |        -1.750 m         |        **PASS** (locked hardpoint)        |
| **Rear Axle Z**              |          -17.034          |          -1.857 m           |    +1.850 m    |   **+1.850 m**   |        +1.850 m         |        **PASS** (locked hardpoint)        |
| **Wheelbase / Length Ratio** |          0.6342           |           0.6342            |     0.7129     |    **0.7135**    |         0.7129          | **PASS** (coherent open-wheel proportion) |
| **Front Track**              |          14.223           |           1.551 m           |    1.780 m     |   **1.780 m**    |         1.780 m         |       **PASS** (exact locked track)       |
| **Rear Track**               |          15.251           |           1.663 m           |    1.720 m     |   **1.720 m**    |         1.720 m         |       **PASS** (exact locked track)       |
| **Front Tyre Radius**        |           1.739           |           0.190 m           |    0.360 m     |   **0.360 m**    |         0.360 m         |      **PASS** (18-inch low profile)       |
| **Rear Tyre Radius**         |           1.740           |           0.190 m           |    0.380 m     |   **0.380 m**    |         0.380 m         |      **PASS** (18-inch low profile)       |
| **Front Tyre Width**         |           1.090           |           0.119 m           |    0.220 m     |   **0.210 m**    |         0.220 m         |                 **PASS**                  |
| **Rear Tyre Width**          |           1.023           |           0.112 m           |    0.280 m     |   **0.268 m**    |         0.280 m         |                 **PASS**                  |
| **Diffuser Exit Width**      |           9.905           |           1.080 m           |    1.160 m     |   **1.160 m**    |         1.160 m         |     **PASS** (exact locked hardpoint)     |
| **Diffuser Exit Height**     |           2.614           |           0.285 m           |    0.315 m     |   **0.320 m**    |      0.300–0.350 m      |                 **PASS**                  |
| **Front Wing Elements**      |        4 elements         |         4 elements          |   3 elements   |  **4 elements**  |  Multi-element cascade  |                 **PASS**                  |
| **Rear Wing Beam Wing**      |       Dual element        |        Dual element         |  Single beam   | **Dual element** | Multi-element rear aero |                 **PASS**                  |
| **Front Upright Deflector**  |        Eyebrow fin        |         Eyebrow fin         | None (omitted) | **Eyebrow fin**  | 2022+ Regulation device |                 **PASS**                  |

---

## 3. Detailed Component Geometry Landmark Analysis

### 3.1 Nose & Front Aero Architecture

- **C42 Reference**: Features a sharp drop from the bulkhead (Y=8.00 raw) down to the front wing mainplane (Y=23.21 raw), with a clean aerodynamic crash structure tip meeting the wing elements, dual FOM camera housings mounted on the flanks, and a central pitot tube.
- **EDS D1 Defect**: A generic superellipse loft with a blunt circular tip floating high above the wing plane, accompanied by simple flat rectangular wing planks and flat box endplates (`EDS-R3-D1-002`).
- **EDS D2 Reconstruction**:
  - Longitudinal concave droop from the front bulkhead ($Z = -1.05\text{ m}$) to the crash tip ($Z = -2.48\text{ m}$).
  - Monocoque cross section with distinct chiseled top bevel shoulders and concave bottom feeding the bib splitter.
  - Four full-span 3D aerodynamic airfoil elements with dihedral in the center and washout toward the endplates.
  - Sculpted endplates with outward outwash flare, bottom footplate, curved upper trailing edge cutout, and exterior dive plane.
  - Dual FOM camera pods and metal pitot sensor tube.

### 3.2 Cockpit, Halo & Survival Cell

- **C42 Reference**: Low-slung cockpit opening with raised driver headrest collar, aerodynamic halo with front pylon blade and curved crown fairing, and a high-mounted trapezoidal airbox intake with internal splitter.
- **EDS D1 Defect**: Inflated, bulbous cockpit opening with generic round hose halo and soft, indistinct rear leg transitions (`EDS-R3-D1-006`).
- **EDS D2 Reconstruction**:
  - Stepped cockpit opening with raised carbon head protection collar (FIA safety coaming) framing the driver aperture.
  - Recessed survival cell interior tub with reclined carbon racing seat, headrest cushion, and harness guide slots.
  - Multi-function digital racing steering wheel with rectangular yoke, carbon grips, color telemetry display screen, rotary switches, and pushbuttons.
  - Halo with triangular aerodynamic front pylon blade, titanium curved crown hoop with aerodynamic fairing and top micro vortex generator, and structural rear mounting lugs anchored with sharp definition into the monocoque shoulders.
  - Trapezoidal forward airbox intake scoop with internal vertical aerodynamic splitter blade and integrated rollover hoop.

### 3.3 Sidepods & Cooling Architecture

- **C42 Reference**: Aggressive predatory intake mouth with forward-projecting upper overbite lip, deep forward undercut channel below the inlet, steep downwash ramp deck toward the rear beam wing, cooling louvres along the shoulder, and tight coke-bottle waist.
- **EDS D1 Defect**: Bulbous rounded box sidepod with simple oval hole and visibly abrupt shell seam (`EDS-R3-D1-001`).
- **EDS D2 Reconstruction**:
  - Forward-projecting upper overbite leading lip ($Z = -0.74\text{ m}$) framing an angled intake mouth with a dark recessed radiator core.
  - Deep forward undercut chine sweeping airflow around the lower chassis to the floor edge.
  - Smooth, seamless blend into the main monocoque flanks.
  - Ramped downwash upper deck with 7 longitudinal cooling louvres along the shoulder.
  - Severe coke-bottle waist narrowing tightly ahead of the rear wheels, exposing the floor and rear suspension arms.

### 3.4 Floor & Diffuser

- **C42 Reference**: Twin-channel Venturi tunnels, forward tea-tray splitter, 4 leading-edge tunnel fences per side, stepped floor edge wings, and an expanding diffuser with 4 vertical flow dividers.
- **EDS D1 Defect**: Planar slab floor with generic rectangular strakes.
- **EDS D2 Reconstruction**:
  - Ground-effect Venturi underbody with shaped 35 mm minimum ground clearance throat.
  - Forward bib splitter with central metallic support stay.
  - 4 curved 3D leading-edge floor fences (strakes) per side conditioning tyre wake at the tunnel entry.
  - Stepped floor edges with aerodynamic edge wings, longitudinal slit vents, and metallic support stays.
  - Diffuser kicking up smoothly from ahead of the rear axle ($Z = 1.45\text{ m}$) to the exit ($Z = 2.32\text{ m}$), spanning exactly the locked 1.160 m width, with 4 vertical divider fences and integrated rear crash structure + FIA red rain safety LED cluster.

### 3.5 Rear Aero & Wing

- **C42 Reference**: 3D spoon-shaped rear wing mainplane, upper flap with DRS notch and actuator bullet pod, double-element beam wing, and sculpted endplates with wake cutouts.
- **EDS D1 Defect**: Flat rectangular planks on flat box endplates (`EDS-R3-D1-005`).
- **EDS D2 Reconstruction**:
  - 3D spoon-cambered rear wing mainplane with variable spanwise chord and camber.
  - Upper flap with trailing edge Gurney flap, central DRS notch, and streamlined central DRS hydraulic actuator bullet pod.
  - Double-element cascaded beam wing mounted low over the diffuser exit.
  - Sculpted aerodynamic endplates with chamfered edges, lower cutouts, and rear flow strakes.
  - Dual swan-neck mounting pylons.
  - Razor-sharp engine cover dorsal shark fin and central exhaust tailpipe.

### 3.6 Running Gear & Suspension

- **C42 Reference**: Aerodynamic blade-section wishbones, pushrod/pullrod linkages, upright brake ducts, 18-inch wheels with aero dish covers, and mandatory upper tyre-wake eyebrow deflectors.
- **EDS D1 Defect**: Plain round cylinder links (`EDS-R3-D1-004`) and plain torus tyres.
- **EDS D2 Reconstruction**:
  - Multi-link wishbones with streamlined carbon blade cross-sections (cambered aerofoil wishbone fairings), steering track rod, and pushrod/pullrod linkages.
  - Front uprights with carbon brake cooling ducts and mandatory upper tyre-wake eyebrow deflectors curved over the front tyres.
  - 18-inch Pirelli-style slick tyres: cylindrical flat contact patch with rounded square shoulders and sidewall curvature.
  - Aerodynamic wheel dish covers with recessed center locking nut and contrasting rim flange.
  - Visible carbon ceramic brake discs with ventilation holes, multi-piston monobloc brake calipers, and brake bells.

---

## 4. Conflict Resolution with Locked Registry

1. **Wheelbase Conflict**:
   - _Reference_: C42 normalized wheelbase is 3.203 m (ratio 0.6342).
   - _Locked Registry_: EDS specifies a 3.600 m wheelbase (ratio 0.7129) with front axle at $Z = -1.750\text{ m}$ and rear axle at $Z = +1.850\text{ m}$.
   - _Resolution_: EDS D2 hardpoints are locked precisely at $Z = -1.750\text{ m}$ and $+1.850\text{ m}$. Monocoque and sidepod lengths are adjusted to span the 3.600 m wheelbase without distorting C42 sectional curvatures, undercut depth, or wing sweeps.
2. **Track Width Conflict**:
   - _Reference_: C42 normalized track is 1.551 m front / 1.663 m rear.
   - _Locked Registry_: EDS specifies 1.780 m front / 1.720 m rear.
   - _Resolution_: Wishbone lengths and wheel hub offsets are dimensioned to place wheel centers exactly at $X = \pm 0.890\text{ m}$ (front) and $\pm 0.860\text{ m}$ (rear), keeping total car width at 1.990 m (strictly $\le 2.000\text{ m}$).
3. **Diffuser Exit Width Conflict**:
   - _Reference_: C42 normalized diffuser exit width is 1.080 m.
   - _Locked Registry_: EDS specifies 1.160 m.
   - _Resolution_: Diffuser outer sidewalls expand to precisely $X = \pm 0.580\text{ m}$ ($1.160\text{ m}$ total width).
