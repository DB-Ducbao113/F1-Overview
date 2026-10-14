# Browser and 3D acceptance checklist

Run on the same staging deployment after API baseline, load and recovery tests. Headless Chrome establishes functionality; collect desktop and physical-phone evidence separately because headless rendering cannot prove GPU frame rate.

| Check           | Pass condition                                                         | Evidence                         |
| --------------- | ---------------------------------------------------------------------- | -------------------------------- |
| Network profile | 10 Mbps, 80 ms RTT recorded                                            | Browser network export           |
| Navigation      | Home, season, teams, drivers and showroom load without console errors  | Trace and console log            |
| Showroom        | Model appears and becomes interactive in five seconds                  | Screen recording                 |
| Interaction     | Rotate, change livery, open hotspot, navigate away/back, hide/show tab | Screen recording                 |
| Desktop         | Median FPS at least 45; no WebGL context loss                          | Performance trace                |
| Phone           | Median FPS at least 30; no WebGL context loss                          | Device and OS details plus trace |

Record device model, OS, browser/version, viewport and cache state. Do not infer GPU performance from k6 results.
