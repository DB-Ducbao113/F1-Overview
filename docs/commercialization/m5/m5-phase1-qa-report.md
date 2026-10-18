# EDS QA RELEASE REPORT — M5 Phase 1

Commit SHA: see the Git commit containing this report; baseline `821749d93962fd0af7c97919982c21686e31bbb8`

Target branch: `Per-PEDS`

Target environment: local production preview `http://127.0.0.1:4177`

Change summary: four bilingual Engineering Insights articles, four deterministic EDS-G01 diagrams, article/index routes, hotspot deep links, route metadata, configurable canonical/indexing policy, generated sitemap and crawlable article prerendering

Risk level: **HIGH** — routing, SEO output, prerendered HTML and Showroom integration

## STATIC CHECKS

- ESLint: **PASS** — `npm.cmd run lint`, exit 0.
- TypeScript: **PASS** — `npm.cmd exec tsc -- --noEmit`, exit 0; repeated by production build.
- Unit tests: **PASS** — `npm.cmd test`, 35 files and 243 tests passed, exit 0.
- Integration tests: **PASS** — M5 SEO generator/prerender QA and commercial visual isolation guard passed.
- Build: **PASS** — `npm.cmd run build`, 2,209 modules transformed, exit 0. Generated 72 sitemap routes when a site URL is configured; the unconfigured local artifact intentionally remains `noindex` with an empty sitemap.
- Changed-file formatting: **PASS** — targeted Prettier check, exit 0.
- Reproducible assets: **PASS** — `npm.cmd run asset:eds-engineering:check`, byte-for-byte comparison, exit 0.

## FUNCTIONAL CHECKS

- Core functionality: **PASS** — index and all four article routes rendered with bilingual content, reading time, topic navigation, related articles and technical sources.
- Regression: **PASS** — full unit suite and production build; existing Showroom assets and Results Engine remained present.
- Browser: **PASS** — Chrome at 1440×900 and 768×1024; no horizontal overflow, broken article images or JavaScript page exceptions.
- Mobile: **PASS** — Chrome emulation at 375×812; no horizontal overflow or broken article images.
- Accessibility: **NOT RUN** — descriptive image alternatives and semantic headings/landmarks are implemented and content-tested, but an automated accessibility audit plus full keyboard/focus review was not executed.
- SEO: **PASS** — unique article metadata, `TechArticle` JSON-LD, configurable canonical URLs, preview `noindex`, 72-route data-discovered sitemap, crawlable VI/EN prerendered HTML, internal relationships and article 404/noindex state verified.

## SPECIALIZED CHECKS

- 3D Showroom: **PASS (TARGETED)** — `/showroom?hotspot=floor` focused the corresponding EDS-G01 detail dialog and exposed the reciprocal Engineering Insights link. Six liveries, seven hotspots and commercial bundle isolation remain protected by existing tests/build guards; a new GPU benchmark was not required for this content milestone.
- Performance: **NOT RUN** — no Lighthouse/Core Web Vitals measurement was collected. Engineering routes are code-split; generated route chunks were 3.40 kB and 6.12 kB before gzip, but chunk size is not a user-performance result.
- Security: **PASS (SCOPED)** — no dependency change, credential material or executable external content was introduced; source links open with `rel="noreferrer"`. Dependency vulnerability audit was not rerun because the dependency graph did not change.
- Automated data source 1: **NOT RUN** — no data-workflow change and no release was requested.
- Automated data source 2: **NOT RUN** — no data-workflow change and no release was requested.

## CI/CD

- Required GitHub Actions: **PENDING** — M5 is intentionally uncommitted and unpushed.
- Preview deployment: **NOT APPLICABLE** — local preview only; no Cloudflare or Vercel deployment authorized.
- Production deployment: **NOT APPLICABLE**.
- Production smoke tests: **NOT APPLICABLE**.

## DEFECTS

- P0: none found.
- P1: none found.
- P2: none found.
- P3/P4: none attributed to M5.

Local-preview observations, not classified as M5 defects:

- Google Fonts was denied by the isolated browser network and the browser used local fallback/cached rendering.
- `/_vercel/insights/script.js` and `/_vercel/speed-insights/script.js` returned 404 because Vite preview is not Vercel.
- The pre-existing Jolpica background refresh returned 500 because external network access was unavailable. Article content remained usable and no page exception occurred.

## EVIDENCE

- Commands and exit codes: recorded above; all executed M5 code gates exited 0 after remediation.
- Test results: 35 files / 243 tests passed.
- SEO results: `qa:m5:seo` passed four bilingual prerenders, structured data, configurable indexing and sitemap checks.
- Browser results: [`browser-results.json`](evidence/browser-results.json).
- Screenshots:
  - [`engineering-index-desktop-1440x900.png`](evidence/engineering-index-desktop-1440x900.png)
  - [`engineering-index-tablet-768x1024.png`](evidence/engineering-index-tablet-768x1024.png)
  - [`ground-effect-article-desktop-1440x900.png`](evidence/ground-effect-article-desktop-1440x900.png)
  - [`ground-effect-article-mobile-375x812.png`](evidence/ground-effect-article-mobile-375x812.png)
- Benchmark results: **NOT RUN**.
- Workflow run URLs: **PENDING**.
- Deployment URLs: **NOT APPLICABLE**.

## UNVERIFIED ITEMS

- Final commercial hostname and production canonical/indexing configuration.
- Human technical/editorial review of every VI/EN article and source interpretation.
- Independent rights/provenance review.
- Automated accessibility scan, complete keyboard/focus pass and contrast audit.
- Lighthouse/Core Web Vitals and social-card rendering on target platforms.
- CI status and deployed-environment smoke tests.

## RESIDUAL RISKS

- The safe default emits `noindex` until `VITE_SITE_URL` and `VITE_ALLOW_INDEXING=true` are deliberately configured on a non-preview hostname. Incorrect environment configuration could keep a commercial deployment out of search results.
- Article Open Graph images currently use original SVG diagrams. Some social crawlers have weaker SVG support than JPEG/PNG; raster social-card exports should be added before launch.
- Technical references can be revised externally. A human editor should record the reviewed issue/version at launch.
- AI-assisted drafting is disclosed in provenance and is not treated as evidence of legal clearance.

## M5 PHASE 2 RECOMMENDATIONS

1. Complete human bilingual technical editing, terminology consistency and source-version review.
2. Generate project-owned 1200×630 PNG/JPEG social cards from each EDS diagram while retaining SVG sources and generator records.
3. Finalize the commercial hostname, configure indexing only on that hostname, then validate canonical URLs, robots and the full 72-route sitemap in a permitted preview.
4. Add automated accessibility and keyboard-navigation coverage plus a contrast review.
5. Establish Lighthouse baselines for the article index and a flagship article, then optimize only measured regressions.
6. Expand original engineering coverage with braking, cooling, tyre behavior and data-acquisition topics after Phase 1 editorial sign-off.

## FINAL DECISION: HOLD

## REASON

M5 Phase 1 implementation and branch-local functional QA are complete, but production release approval is withheld because the commercial hostname, human editorial/rights review, accessibility/performance audits, CI and deployed-environment checks remain unverified.

## NEXT REQUIRED ACTION

Review the uncommitted M5 diff and editorial content. Do not commit or push until that review is complete.
