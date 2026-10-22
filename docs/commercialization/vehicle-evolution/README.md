# Podium EDS — Vehicle Evolution History

This directory contains a curated historical archive of real screenshots documenting the progressive development of the Podium Effet De Sol (EDS) chassis.

These images are organized by major milestone and indexed in [`vehicle-evolution-manifest.json`](./vehicle-evolution-manifest.json). They demonstrate the design journey from early parametric primitives to the active C42-referenced D1 reconstruction, and are structured for future integration into an interactive EDS vehicle-development timeline on the website.

## Milestones Overview

| Milestone | Revision | Description | Curated Assets |
| --- | --- | --- | --- |
| **1. Initial EDS Blockout** | R3.1 | Early box/primitive dimensions establishing overall envelope (5.050 m length, 2.000 m width, 3.600 m wheelbase) | `01-blockout-front-three-quarter.png`<br>`01-blockout-side.png`<br>`01-blockout-top.png` |
| **2. Early Aerodynamic Revisions** | R3.2 | Parametric surface continuity, sidepod undercut profiles, and floor edge transitions | `02-aero-revision-front-three-quarter.png`<br>`02-aero-revision-side.png`<br>`02-aero-revision-sidepod-floor.png` |
| **3. Blender Clay Refinement** | R3.2 Clay Gate | Professional Blender subdivision modeling, rounded-D sidepod inlets, twin-channel venturi diffuser | `03-clay-refinement-front-three-quarter.png`<br>`03-clay-refinement-side.png`<br>`03-clay-refinement-diffuser-underside.png` |
| **4. Rejected Visual Design Concepts** | R3 Design Reset | Radical concept studies (*Aero Predator*, *Hyper Aero*, *Precision Machine*); rejected for unrealistic proportions | `04-rejected-concept-aero-predator.png`<br>`04-rejected-concept-hyper-aero.png`<br>`04-rejected-concept-precision-machine.png` |
| **5. Cockpit & Nose Experiments** | R3 Cockpit/Nose | Detailed geometric studies on cockpit opening geometry, halo fairing attachment, and nose taper (N20, N30) | `05-experiment-n20-cockpit-halo.png`<br>`05-experiment-n20-nose-monocoque.png`<br>`05-experiment-n30-suspension-nose.png` |
| **6. C42-Referenced D1 Reconstruction** | R3-D1 (Active) | Active 3D authoring direction: 100% original EDS geometry achieving high visual realism and harmonious single-seater proportions | `06-reconstruction-d1-front-three-quarter-comparison.png`<br>`06-reconstruction-d1-clay-front-three-quarter.png`<br>`06-reconstruction-d1-cockpit-comparison.png` |

## Model Policy & Active Direction

- **Primary 3D Reference**: `public/models/c42.v2.glb` (DEV-only proportion benchmark, never a geometry copy source).
- **Active 3D Reconstruction**: `docs/commercialization/r3/blender-authoring/c42-reconstruction-d1/` (Blender source `.blend`, evaluation `.glb`, Python pipeline, QA evidence).
- **Failed Revisions**: Historical artifacts in this directory are preserved for timeline and documentation purposes only. They must not be used as geometric baselines for further chassis development.

