# Production performance audit — M0

Audit date: 2026-10-14 (UTC+7)  
Production: <https://podiumeds.vercel.app/>  
Source commit: [`cfbd651390c151a8746e3cccc39fe15e32611429`](https://github.com/DB-Ducbao113/F1-Overview/commit/cfbd651390c151a8746e3cccc39fe15e32611429)  
Audit branch: `perf/speed-insights-v2`

## Scope and method

M0 is evidence only. No application behavior, F1 data, animation, image, or runtime code was changed.

- Chrome 155.0.8059.40 on Windows 11 23H2.
- Lighthouse 13.5.0, `performance` category, simulated throttling, cold browser context.
- Desktop uses Lighthouse's desktop preset. Mobile uses Lighthouse's default mobile profile.
- Homepage was measured three times for each form factor. Every other required route was measured once per form factor as a diagnostic baseline.
- Production screenshots were captured after a 6.5-second virtual-time budget at 1280×900, 1440×1000, 1920×1080, 390×844, and 768×1024.
- Raw Lighthouse reports, DevTools logs, compressed traces, network exports, and bundle exports are stored under this directory. File hashes are recorded in `artifacts/artifact-manifest.csv`.

Lab results are not interchangeable with the seven-day Vercel field score. The field window includes older deployments; the current production build was deployed on 2026-10-14.

## Source and production identity

`origin/main`, local `main`, and the audit branch started at the same commit: `cfbd651390c151a8746e3cccc39fe15e32611429`.

Production returned `Last-Modified: Wed, 14 Oct 2026 04:32:11 GMT`. Its hashed entry assets exactly match the local build from `cfbd651`:

- `index-BJ33uq_5.js`
- `vendor-react-B62-MmwA.js`
- `vendor-core-ckwbz45p.js`
- `vendor-icons-Dvp9uySH.js`
- `index-CG_hlt_G.css`

This is strong artifact-level evidence that the audited production deployment was built from the latest `main`. Vercel does not expose a commit SHA in the public response headers, so the asset match is the available public verification.

The source commit's workflows both completed successfully:

- [CI run 38511671924](https://github.com/DB-Ducbao113/F1-Overview/actions/runs/38511671924)
- [Build & Publish Docker Image run 38511671839](https://github.com/DB-Ducbao113/F1-Overview/actions/runs/38511671839)

## Architecture

The app is a client-rendered React 18.3/Vite 6 SPA using React Router 7 and Zustand. Major page components are lazy route chunks. Three.js, React Three Fiber, and Drei are separated into `vendor-three` and requested by `/showroom`; Leaflet is used by circuit details. Static F1 snapshots are bundled from `src/data`, while scheduled GitHub Actions update 2026 data from OpenF1/Jolpica.

The initial HTML references four JavaScript bundles totaling 109.4 KiB gzip, below the existing 180 KiB gate. `/showroom` adds 331.7 KiB gzip of Three.js and showroom JavaScript plus the 2.11 MiB GLB resource.

## Browser smoke results

All seven routes rendered at all five required widths. Across the Lighthouse run-1 reports, 29–38 network requests were observed per page and no request returned an HTTP error status.

| Route                | Render                             | Main observation                                                                                 |
| -------------------- | ---------------------------------- | ------------------------------------------------------------------------------------------------ |
| `/`                  | Pass                               | Hero and navigation render; intro completes; all 11 team images are fetched during initial load. |
| `/season/2026`       | Pass                               | 2026 standings render with current data snapshot.                                                |
| `/season/2025`       | Pass                               | Historical season route renders independently.                                                   |
| `/teams`             | Pass                               | Eleven-team directory renders and images load.                                                   |
| `/showroom`          | Pass with severe performance issue | 3D scene renders, but lab traces show sustained main-thread blocking.                            |
| `/teams/mercedes`    | Pass with 390px overflow           | Content renders; the hero title/action row extends beyond the viewport.                          |
| `/drivers/antonelli` | Pass with 390px overflow           | Content renders; the team badge and media card extend beyond the viewport.                       |

The 390px showroom screenshot also shows horizontal overflow and controls covering a large part of the vehicle. These are existing visual defects and must be protected against during M1–M3.

## Screenshot matrix

| Page        | 1280                                             | 1440                                             | 1920                                             | 390                                            | 768                                            |
| ----------- | ------------------------------------------------ | ------------------------------------------------ | ------------------------------------------------ | ---------------------------------------------- | ---------------------------------------------- |
| Homepage    | [PNG](screenshots/home--desktop-1280.png)        | [PNG](screenshots/home--desktop-1440.png)        | [PNG](screenshots/home--desktop-1920.png)        | [PNG](screenshots/home--mobile-390.png)        | [PNG](screenshots/home--mobile-768.png)        |
| Season 2026 | [PNG](screenshots/season-2026--desktop-1280.png) | [PNG](screenshots/season-2026--desktop-1440.png) | [PNG](screenshots/season-2026--desktop-1920.png) | [PNG](screenshots/season-2026--mobile-390.png) | [PNG](screenshots/season-2026--mobile-768.png) |
| Season 2025 | [PNG](screenshots/season-2025--desktop-1280.png) | [PNG](screenshots/season-2025--desktop-1440.png) | [PNG](screenshots/season-2025--desktop-1920.png) | [PNG](screenshots/season-2025--mobile-390.png) | [PNG](screenshots/season-2025--mobile-768.png) |
| Teams       | [PNG](screenshots/teams--desktop-1280.png)       | [PNG](screenshots/teams--desktop-1440.png)       | [PNG](screenshots/teams--desktop-1920.png)       | [PNG](screenshots/teams--mobile-390.png)       | [PNG](screenshots/teams--mobile-768.png)       |
| Showroom    | [PNG](screenshots/showroom--desktop-1280.png)    | [PNG](screenshots/showroom--desktop-1440.png)    | [PNG](screenshots/showroom--desktop-1920.png)    | [PNG](screenshots/showroom--mobile-390.png)    | [PNG](screenshots/showroom--mobile-768.png)    |
| Mercedes    | [PNG](screenshots/mercedes--desktop-1280.png)    | [PNG](screenshots/mercedes--desktop-1440.png)    | [PNG](screenshots/mercedes--desktop-1920.png)    | [PNG](screenshots/mercedes--mobile-390.png)    | [PNG](screenshots/mercedes--mobile-768.png)    |
| Antonelli   | [PNG](screenshots/antonelli--desktop-1280.png)   | [PNG](screenshots/antonelli--desktop-1440.png)   | [PNG](screenshots/antonelli--desktop-1920.png)   | [PNG](screenshots/antonelli--mobile-390.png)   | [PNG](screenshots/antonelli--mobile-768.png)   |

## Speed Insights and `Unknown`

The integration uses `@vercel/speed-insights` 2.0.0 with `sampleRate={1}` and a `beforeSend` callback that replaces `route` with `new URL(event.url).pathname`. The package script loads successfully from `/_vercel/speed-insights/script.js`; migration to the deprecated Intake API is neither needed nor recommended.

The `Unknown` attribution in the seven-day dashboard is expected to contain historical samples. Path normalization was only introduced by commit `f192453` at 2026-10-14 09:44 UTC+7, while the dashboard shown spans October 8–14. Therefore most samples in that window predate normalization. Vercel's generic React integration also supports an explicit `route` prop; wiring that prop to React Router's current pathname is the clearest M1 hardening step. The current `beforeSend` should remain as a query-string scrubber.

Vercel documents a seven-day reporting window and 10,000 monthly data-point cap on Hobby. `sampleRate=1` remains free until that cap, after which collection pauses. There is no reason to migrate to a paid service. Sources: [package configuration](https://vercel.com/docs/speed-insights/package), [limits and pricing](https://vercel.com/docs/speed-insights/limits-and-pricing), and [metric collection behavior](https://vercel.com/docs/speed-insights/metrics).

## Audit limitations

- Vercel field data cannot be exported on Hobby and the dashboard sample count is low.
- Only Homepage has three lab repetitions in M0; other routes have one cold diagnostic run per form factor.
- Lighthouse's CPU throttling exaggerates continuous WebGL work, so Showroom's absolute TBT is a stress signal rather than a prediction of every real device.
- INP needs real interaction traces and field samples. Navigation screenshots and load-only Lighthouse runs cannot establish INP.
- Public Vercel headers do not expose the deployment commit SHA directly.
