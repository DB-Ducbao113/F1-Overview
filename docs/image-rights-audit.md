# Image rights audit

Status: **Cleaned and monetization-ready** as of 2026-10-09. Unverified third-party driver photography, constructor car thumbnails, and copied constructor-logo vectors have been removed from the runtime and repository.

Driver and constructor profiles now use PODIUM-owned text badges, racing-number typography, team data colors, and original aerodynamic artwork instead of official insignias or unverified photography.

The optimized 3D model `public/models/c42.v2.glb` remains in use as the base procedural showcase model.

| Directory / File Category      | Status       | Action Taken                                                                                   |
| ------------------------------ | ------------ | ---------------------------------------------------------------------------------------------- |
| `public/assets/*` (legacy)     | **Purged**   | Completely deleted to eliminate unverified external downloads.                                 |
| `public/images/drivers/*`      | **Purged**   | Removed 28 portraits without a complete provenance record.                                     |
| `public/images/teams/*`        | **Purged**   | Removed 11 constructor/car thumbnails without a complete provenance record.                    |
| `public/images/circuits/*`     | **Purged**   | Removed third-party circuit photography and replaced it with PODIUM artwork.                   |
| `podium-diffuser-hero-v2.webp` | **Verified** | Original PODIUM aerodynamic artwork used as the shared editorial visual.                       |
| `public/images/showroom/*`     | **Verified** | Project-created schematics and technical close-up renders.                                     |
| `public/models/c42.v2.glb`     | **Retained** | Adapted from Mark Stein's open-source C42 model under WTFPL v2; see `public/models/README.md`. |

Constructor names remain only as factual labels. All constructor marks shown by the interface are original PODIUM text badges and do not reproduce official logo geometry.
