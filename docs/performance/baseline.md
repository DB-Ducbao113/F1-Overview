# Performance baseline

## Field observations supplied for the audit

| Segment          | Vercel RES |
| ---------------- | ---------: |
| Desktop          |         49 |
| Mobile           |         78 |
| Homepage         |         55 |
| Season 2026      |         57 |
| Season 2025      |         57 |
| Teams            |         66 |
| Showroom         |         83 |
| Mercedes team    |         94 |
| Antonelli driver |         97 |

These are seven-day field observations across multiple deployments. They establish the user-visible problem but do not isolate the latest production build.

## Lighthouse 13.5.0 cold-load baseline

Homepage figures are medians of three runs. Other figures are one-run diagnostics and should be repeated before an optimization is accepted.

| Page        | Form factor    | Score |      FCP |       LCP |        TBT |   CLS |  Transfer |
| ----------- | -------------- | ----: | -------: | --------: | ---------: | ----: | --------: |
| Homepage    | Desktop median |    80 |   770 ms |  1,473 ms |       0 ms | 0.233 | 1,514 KiB |
| Homepage    | Mobile median  |    64 | 2,363 ms |  5,772 ms |      34 ms | 0.222 | 1,515 KiB |
| Season 2026 | Desktop        |    78 | 1,030 ms |  1,432 ms |       0 ms | 0.233 |   713 KiB |
| Season 2026 | Mobile         |    66 | 4,387 ms |  5,503 ms |       0 ms | 0.000 |   713 KiB |
| Season 2025 | Desktop        |    82 |   640 ms |  1,314 ms |       0 ms | 0.232 |   630 KiB |
| Season 2025 | Mobile         |    67 | 3,849 ms |  5,597 ms |       0 ms | 0.000 |   630 KiB |
| Teams       | Desktop        |    80 |   760 ms |  1,602 ms |       0 ms | 0.233 | 1,408 KiB |
| Teams       | Mobile         |    70 | 3,855 ms |  4,977 ms |       0 ms | 0.000 | 1,082 KiB |
| Showroom    | Desktop        |    39 |   703 ms |  2,892 ms |  33,251 ms | 0.145 | 2,598 KiB |
| Showroom    | Mobile         |    22 | 2,394 ms | 15,203 ms | 154,181 ms | 0.223 | 2,598 KiB |
| Mercedes    | Desktop        |    88 |   894 ms |  1,374 ms |       0 ms | 0.108 |   686 KiB |
| Mercedes    | Mobile         |    69 | 3,818 ms |  5,306 ms |       0 ms | 0.000 |   686 KiB |
| Antonelli   | Desktop        |    90 |   934 ms |  1,477 ms |       0 ms | 0.081 |   784 KiB |
| Antonelli   | Mobile         |    70 | 3,851 ms |  4,922 ms |       0 ms | 0.000 |   783 KiB |

Homepage variability is material. Desktop scores were 80, 80, and 81. Mobile scores were 66, 55, and 64. The mobile LCP candidate changed between intro text, the `PODIUM` hero heading, and the hero image; CLS changed from 0 to approximately 0.223. This variation is evidence that the intro and web-font timing affect what Lighthouse observes.

The complete table is in [lighthouse-summary.csv](artifacts/lighthouse-summary.csv), and raw reports are under `lighthouse/`.

## LCP elements

| Route       | Desktop LCP                            | Mobile LCP                                                           |
| ----------- | -------------------------------------- | -------------------------------------------------------------------- |
| Homepage    | `/images/podium-diffuser-hero-v2.webp` | Intro `LIGHTS OUT.`, hero heading, or hero image depending on timing |
| Season 2026 | Footer brand image after layout shift  | Compact navbar logo                                                  |
| Season 2025 | Page heading                           | Intro `LIGHTS OUT.`                                                  |
| Teams       | Ferrari card image                     | Mercedes card image                                                  |
| Showroom    | Team information heading               | No stable node reported under the stressed run                       |
| Mercedes    | Team heading                           | Car image                                                            |
| Antonelli   | Driver image                           | Driver image                                                         |

The Homepage hero is client-discovered. `fetchpriority="high"` is present, but Lighthouse reports that the request is not discoverable in the initial HTML. Desktop resource-load delay ranged from 374 to 482 ms in two of three runs.

## Render-blocking and layout-shift evidence

The Google Fonts stylesheet and the generated application CSS are render blocking. Lighthouse estimates 80–430 ms savings on desktop routes and 1,880–2,370 ms on typical mobile routes.

Homepage desktop CLS is almost entirely a font swap:

- Total CLS in the representative trace: 0.2329.
- Footer shift attributed to an Inter WOFF2 load: 0.2319.
- Smaller navbar shifts are attributed to Inter and Playfair Display.

The route-wide desktop CLS near 0.233 explains why Homepage, Season, and Teams cluster near a score of 80 in lab even when their LCP and TBT are healthy.

## Network baseline

Homepage transfers 1.51 MiB in 37 resource-summary requests. Images account for 1.18 MiB. Although the team carousel images use `loading="lazy"`, all 11 team images are requested during the initial audit because their horizontal stage is close enough to Chrome's lazy-load threshold. Lighthouse estimates 879 KiB desktop and 1,033 KiB mobile image savings. The 246 KiB full logo is also used at 118×44 and 150×56 without intrinsic dimensions.

Showroom transfers 2.60 MiB:

- `c42.v2.glb`: 1,556.9 KiB transferred, 2,114.2 KiB decoded resource.
- `vendor-three`: 249.9 KiB transferred, 243.4 KiB local gzip.
- `ShowroomView`: 88.5 KiB transferred, 88.3 KiB local gzip.
- External fonts: six requests in the desktop resource summary.

Network waterfalls are available as [Homepage desktop](artifacts/network-home-desktop.csv), [Showroom desktop](artifacts/network-showroom-desktop.csv), and [Showroom mobile](artifacts/network-showroom-mobile.csv).

## JavaScript and trace baseline

Initial JavaScript is 109.4 KiB gzip against the current 180 KiB limit:

| Initial bundle    |     Gzip |
| ----------------- | -------: |
| `vendor-react`    | 62.9 KiB |
| application entry | 40.4 KiB |
| `vendor-icons`    |  5.4 KiB |
| `vendor-core`     |  0.6 KiB |

Route chunks include `HomeView` at 12.8 KiB gzip, `ChampionshipView` at 12.9 KiB, and `TeamsDirectoryPage` at 2.8 KiB. Three.js is absent from the initial bundle and isolated to Showroom. Full bundle sizes are in [bundle-sizes.csv](artifacts/bundle-sizes.csv).

Homepage desktop main-thread work was 0.50–0.59 seconds with zero TBT and one representative 55 ms task. Showroom desktop recorded 42.3 seconds of main-thread work and 33.25 seconds TBT; Showroom mobile recorded 176.9 seconds and 154.18 seconds TBT. Desktop's longest captured tasks were 1,622 ms and 1,096 ms, followed by repeated 366–390 ms tasks attributed mainly to `vendor-three` and React scheduling.

Raw compressed traces:

- [Homepage desktop trace](lighthouse/home--desktop--run2-0.trace.json.gz)
- [Showroom desktop trace](lighthouse/showroom--desktop--run1-0.trace.json.gz)
