# Image rights audit

Status: **Superseded for commercial-track decisions** by `docs/commercialization/m3/asset-inventory.md`. This historical note must not be treated as legal clearance evidence.

M3 Phase 1 routes driver profiles to original abstract EDS SVGs and replaces recognizable constructor insignias with neutral EDS editorial identifiers.

The original `public/models/eds-g01.glb` is the default Showroom model. The C42 source remains only for DEV comparison and is pruned from commercial builds.

| Directory / File Category      | Status       | Action Taken                                                             |
| ------------------------------ | ------------ | ------------------------------------------------------------------------ |
| `public/assets/*` (legacy)     | **Purged**   | Completely deleted to eliminate unverified external downloads.           |
| `public/images/showroom/*`     | **Verified** | Bespoke CAD schematics & technical close-up renders created for project. |
| `public/images/teams/*`        | **Retained** | Low-res livery teaser thumbnails for team directory.                     |
| `public/images/gallery/*`      | **Retained** | Action photography referenced in editorial gallery view.                 |
| `public/images/og-preview.jpg` | **Verified** | Bespoke OpenGraph social preview asset.                                  |
| `public/models/c42.v2.glb`     | **Retained** | Meshopt-compressed real-time GLTF vehicle chassis model.                 |
