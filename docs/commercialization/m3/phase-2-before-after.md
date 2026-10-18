# M3 Phase 2 Before / After Evidence

## Homepage hero

- Before: `public/images/podium-diffuser-hero-v2.webp`, with insufficient source/authorship evidence in the M3 inventory.
- After: `public/images/eds/editorial/eds-g01-hero.svg`, generated from repository-authored vector geometry.
- Evidence: `evidence/phase-2-comparison/homepage-hero-before-after.png` and responsive application captures under `evidence/phase-2-after/`.

## Circuit imagery

- Before: three unverified local Albert Park photographs plus 71 remote Unsplash references across 77 checkpoint image slots.
- After: 24 deterministic circuit SVGs generated from local path records; all 77 checkpoint slots resolve locally.
- Evidence: `evidence/phase-2-comparison/circuit-visual-before-after.png`, responsive calendar captures and the mobile/desktop offline-atlas captures under `evidence/phase-2-after/`.

## Showroom isolation

- Before: the production Showroom entry could statically reach legacy C42, sponsor/logo and constructor-livery routines through feature-flagged imports.
- After: the production entry is EDS-only; legacy comparison is behind `dev-showroom.html`, which throws outside Vite DEV and is absent from production output.
- Evidence: responsive Showroom captures under `evidence/phase-2-after/`, plus the production import-graph and artifact scan executed by `npm run build`.

The screenshots are implementation evidence, not proof of legal clearance.
