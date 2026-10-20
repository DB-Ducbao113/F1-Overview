# R1 Phase 2 — visual polish and mobile UX QA

Date: 2026-10-20. Branch: `Per-PEDS`. Baseline: `90d3b7e7f28d59a6064c00a61990b4cb66d7b019`. Scope: local review only; no commit, push or deployment.

## Visual comparison

The supplied `references/podium-review.html` and its [mobile](evidence/reference-layout-mobile-375.png) / [desktop](evidence/reference-layout-desktop-1440.png) captures were compared with the [R1 mobile](evidence/mobile-home-375.png) / [desktop](evidence/desktop-home-1440.png) captures and new [Phase 2 mobile](phase2-evidence/mobile-home-375.png) / [desktop](phase2-evidence/desktop-home-1440.png) captures. Reference captures are **layout-only** because their external 3D CDN was unavailable offline. Its procedural car and illustrative telemetry were not copied.

| Area               | R1 before                                                                                | Phase 2 after                                                                                                                                                                             |
| ------------------ | ---------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Mobile hero        | Oversized brand type over a heavily cropped EDS illustration; no direct section actions  | Editorial VI/EN headline and concise technical introduction, two 48px-minimum actions, and a visible original EDS-G01 side silhouette; original static asset remains the loading fallback |
| Primary navigation | Header drawer repeated Home/Championship/Showroom from fixed bottom bar                  | Bottom bar owns the three primary sections; header drawer holds Engineering, Teams, Drivers and About; Escape closes it                                                                   |
| Mobile controls    | Language/menu targets below 44px; hotspot query persisted after leaving Showroom         | 44px header controls; unrelated sections remove hotspot query; hotspot/schematic overlays close on section departure                                                                      |
| Championship       | Calendar title squeezed beside the next-round button; some tab/season targets under 44px | Full-width calendar title above the action on mobile; 44px tab, season and refresh targets; desktop layout preserved                                                                      |
| Technical modal    | Focus and Escape behavior not managed                                                    | Close control receives focus, Tab is contained, Escape closes, and prior focus is restored                                                                                                |
| Desktop            | Existing original EDS-G01 3D hero, separate routes and Showroom                          | Preserved; no forced reference-copy redesign                                                                                                                                              |

Championship standings/calendar and Showroom controls were visually reviewed at mobile size. They retain the approved R1 structure, data, six liveries and seven hotspots. No racing telemetry or invented results were added.

## Mobile navigation, font and EDS Feed retest

The follow-up report on mobile section mixing, broken Vietnamese display type and the ineffective EDS Feed pause button was reproduced in a 375 x 812 browser with reduced motion **off**. The [before snapshot](phase2-evidence/mobile-defect-before.json) showed `#home` while Showroom remained visible (`targetTop: -6364`) and the Feed still had `animationPlayState: running` after Pause. The [before image](phase2-evidence/mobile-defect-before.png) shows the overlapping Vietnamese hero letterforms.

The section navigator now jumps to the requested section without traversing thousands of pixels by smooth scrolling, aligns it beneath the 64px header, and determines the active bottom-nav item from the actual scroll position. The Vietnamese mobile hero uses the system sans stack with less compressed line-height; English keeps the display face. The Feed pause state now controls the marquee CSS animation, and the pause control is hidden when reduced-motion already disables that animation.

The [after snapshot](phase2-evidence/mobile-defect-after.json) records Showroom, Home, Championship, Showroom, Home in sequence: each target is 63.75-64px beneath the viewport top, with matching visible and active section. Feed state changed to `paused`, its transform stayed identical after 300ms, then returned to `running` on Resume. The [after image](phase2-evidence/mobile-defect-after.png) shows legible Vietnamese hero type. This is browser-emulated evidence, not physical-device proof.

## Mobile 3D decision

The optional tap-to-activate home hero was **evaluated but not enabled** in this phase. The initial mobile Home continues to use the original static EDS-G01 illustration, leaving the Showroom as the sole mobile WebGL experience. This avoids a second canvas and duplicate GPU/model initialization in the continuous page; a tap hero would require physical-device memory/thermal measurements and an explicit hand-off to the Showroom canvas. Desktop 3D hero behavior remains unchanged.

## EDS QA RELEASE REPORT

Commit SHA: `90d3b7e7f28d59a6064c00a61990b4cb66d7b019` (pre-change baseline; Phase 2 uncommitted)

Target branch: `Per-PEDS`

Target environment: local Vite production preview

Change summary: original visual hierarchy, mobile nav de-duplication and alignment, Vietnamese hero font correction, working EDS Feed pause/resume, Championship touch targets/calendar layout, hotspot URL cleanup, dialog keyboard focus and responsive image framing.

Risk level: HIGH (responsive routing interactions and Showroom dialog)

### STATIC CHECKS

- ESLint: PASS — `npm.cmd run lint`, exit 0 after the modal ref fix.
- TypeScript: PASS — `npm.cmd run build` includes `tsc`, exit 0.
- Unit tests: PASS — `npm.cmd run test`, 36 files / 254 tests, exit 0.
- Integration tests: PASS — local browser harness, 13/13 views, exit 0. This is not a live-provider integration test.
- Build: PASS — `npm.cmd run build`, exit 0; 72 SEO routes and four Engineering prerenders generated; commercial visual isolation PASS (28 Showroom source modules / 108 artifact files scanned); 14 legacy visual targets removed.
- Changed-file Prettier: PASS for the changed R1 code/style files, mobile defect browser harness and this report, exit 0.

### FUNCTIONAL CHECKS

- Core functionality: PASS in tested routes — Home, Championship and Showroom at mobile/desktop widths, plus direct `/showroom?hotspot=floor` link. No horizontal overflow or app page exceptions recorded.
- Regression: PASS — 6 livery selections, 7 hotspot dialogs, focus on modal close button, Escape close, history back/forward, keyboard section navigation, menu/VI-EN, 23 calendar rounds and 44px minimum measured Championship targets, 860 → 861 → 860 resize and one mobile WebGL canvas. Normal-motion mobile section switching and EDS Feed pause/resume also PASS in `scripts/qa-r1-mobile-defects.mjs`.
- Browser: PASS — `node scripts/qa-r1-responsive.mjs`, exit 0, 13/13 views at 320, 375, 390, 768, 860, 1024 and 1440px plus direct link. Normal-motion mobile defect harness exit 0. See `phase2-evidence/browser-results.json` and `phase2-evidence/mobile-defect-after.json`.
- Mobile: Emulated viewport tests PASS; physical-device touch/pinch NOT TESTED (no device available). Initial Home had zero WebGL canvases and visible Showroom had one at all five tested mobile widths.
- Accessibility: Keyboard menu closes with Escape, VI/EN switches, modal receives focus and closes with Escape; full screen-reader/contrast audit NOT RUN.
- SEO: PASS — `npm.cmd run qa:m5:seo`, 72 routes, bilingual prerenders and initial-HTML preview noindex.

### SPECIALIZED CHECKS

- 3D Showroom: Commercial isolation PASS. WebGL context loss/recovery, long-duration memory and real GPU rendering NOT RUN in this phase.
- Performance: Lighthouse NOT RUN (not installed locally; no tooling added). Headless Chrome frame/heap samples are diagnostic only, not real-device or LCP/Core Web Vitals evidence. Comparable real-device before/after NOT TESTED.
- Headless diagnostic comparison (same harness and 375px viewport): mobile Showroom median RAF interval 16.7 → 16.7ms, p95 16.8 → 16.7ms, JS heap snapshot 18 → 21 MiB. Desktop Home p95 at 1440px was 16.8 → 16.8ms. A single heap snapshot is not a memory-growth test; none of these values establishes physical-GPU parity.
- Security: No secrets, API/provider code or dependency changes in the Phase 2 diff. Dependency vulnerability audit NOT RUN.
- Automated data source 1: NOT APPLICABLE to branch-local visual review; no data workflow file changed and no production release. Provider health/freshness NOT VERIFIED.
- Automated data source 2: NOT APPLICABLE to branch-local visual review; no data workflow file changed and no production release. Provider health/freshness NOT VERIFIED.

### CI/CD

- Required GitHub Actions: NOT RUN (no push).
- Preview deployment: NOT RUN; only local preview.
- Production deployment: NOT RUN.
- Production smoke tests: NOT RUN.

### DEFECTS

- P0/P1: None observed in exercised checks.
- P2 `R1P2-001` (mobile Showroom URL/overlay): Reproduce at `/showroom?hotspot=floor`, close the dialog and navigate Home. Expected: no hotspot query or active overlay outside Showroom. Before: navigation preserved `?hotspot=floor` and could retain the overlay state. Root cause: the section navigator copied the query verbatim and the Showroom did not clear its dialog on section departure. Fixed with scoped query removal and overlay cleanup. Retest PASS: direct floor hotspot opened, Escape closed it, Home navigation removed `?hotspot=floor`, and the dialog stayed closed (`phase2-evidence/browser-results.json`).
- P2 `R1P2-002` (mobile section mixing): Reproduce by tapping Showroom, Home and Championship in succession at 375px with normal motion. Expected: URL, visible section and active bottom-nav item agree. Before: `#home` could show Showroom thousands of pixels away; active nav could show Championship over Home. Root cause: long smooth-scroll traversal combined with a whole-section intersection ratio on sections of unequal height. Fixed with direct offset alignment and scroll-position tracking. Retest PASS in five consecutive section selections (`phase2-evidence/mobile-defect-after.json`).
- P2 `R1P2-003` (EDS Feed pause): Reproduce by tapping Pause while the ticker moves. Expected: transform stops changing until Resume. Before: button label changed but computed animation remained `running` because the CSS `!important` animation shorthand overrode pause state. Fixed CSS pause state and button semantics. Retest PASS: computed `paused`, unchanged transform after 300ms, then `running` after Resume (`phase2-evidence/mobile-defect-after.json`).
- P3 `R1P2-004` (Vietnamese hero type): Reproduce at 375px with the mobile Home headline. Expected: readable diacritics and separate lines. Before: compressed display-serif glyphs overlapped. Fixed the Vietnamese hero font stack and line height; [after image](phase2-evidence/mobile-defect-after.png) visually reviewed. Physical-font coverage is still unverified.
- P3/P4: The reference's external 3D cannot render offline; layout-only comparisons are labeled. Local Google Fonts denial, Vercel analytics 404 and unavailable Jolpica proxy are expected preview conditions, not claimed as production PASS.

### EVIDENCE

- Commands and exit codes: lint 0, tests 0, build 0, SEO 0, responsive browser 0, mobile defect browser 0, changed-file Prettier 0, `git diff --check` 0.
- Test results: `phase2-evidence/browser-results.json`.
- Screenshots: `phase2-evidence/mobile-*.png` (including calendar at 375px), `phase2-evidence/desktop-*.png`; R1 baseline and reference images linked above.
- Benchmark results: Physical GPU and Lighthouse NOT RUN; any headless RAF measurements are marked HEADLESS_CHROME_ONLY.
- Workflow run URLs: Not applicable.
- Deployment URLs: Not applicable.

UNVERIFIED ITEMS: Physical touch/pinch/drag NOT TESTED; real GPU NOT TESTED; LCP/Lighthouse NOT RUN; WebGL loss/recovery and long soak NOT TESTED; full assistive-technology audit, CI, both production data-source states and deployment NOT RUN.

RESIDUAL RISKS: The project logo/header and high-density Showroom overlays differ from the minimal reference; changing them further could disturb approved original brand and technical controls. The original SVG remains illustrative, not a photograph or measured render. External fonts and API behavior need production-representative validation.

FINAL DECISION: HOLD

REASON: Release-level physical-device, accessibility and performance evidence is incomplete. Branch-local implementation is not production approval.

NEXT REQUIRED ACTION: Review the uncommitted Phase 2 diff, then perform physical-device and pre-release validation before any deployment decision.
