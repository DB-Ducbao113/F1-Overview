# Inside the Machine V2 — branch delivery / engineering-only

Branch: `feat/engineering-inside-machine-v2`

## Scope

- Adds `/engineering` and alias `/engineering/inside-the-machine`.
- Adds Engineering to desktop/mobile navigation.
- Lazy-loads an isolated React Three Fiber scene. Showroom and Championship remain unchanged.
- Adds a single normalized explosion timeline (0–100%), selected assembly focus, wireframe blueprint, isolation and reset.
- Uses the supplied R4.5 GLB node identifiers. The renderer does not generate fake interior parts.
- Rendering quality levels control DPR, antialiasing, and contact shadows.

## Required supplied assets — not yet committed to GitHub

The original user-supplied files are available in `inside-the-machine.zip`, under `inside-the-machine/exports/`. Copy these to:

```
public/models/engineering/model-b-cinematic-r4-5-balanced.glb
public/models/engineering/model-b-cinematic-r4-5-performance.glb
public/models/engineering/model-b-cinematic-r4-5-high.glb
public/models/engineering/assembly-manifest-r4-5.json
public/models/engineering/fallback.webp
```

The page currently references the balanced GLB; fallback image and an asset-installation message are shown if it is missing. **The GitHub branch cannot be accepted or released before these binary assets have been transferred and verified.**

## Asset & provenance caveat

The R4.5 asset manifest contains components that are authored additions rather than confirmed replicas. This is an educational demonstrator. Complete the license/provenance audit before any public deployment.

## Verification required

1. `npm ci`
2. `npm run lint`
3. `npm run format:check`
4. `npm run test:coverage`
5. `npm run build:check`
6. Browser QA at 375, 768, 1280, and 1920px.
7. Verify 0 → 100 → 0 reassembly and compare original world transforms.
8. Test with an unavailable GLB, WebGL context loss, slow network, keyboard and reduced-motion settings.
9. Record draw calls, GPU memory and frame timing on a low-spec device.
10. Owner approval before merge.

## Known limitations / HOLD

- Source repository branch `main` did not include the previous Inside-the-Machine page; the new page has been introduced as an isolated feature instead of replacing unobserved local work.
- GitHub access was through a connector without a working local clone. Full build/test and browser visual QA were not executed in this environment.
- The binary GLB assets were not pushed; the branch is not production-ready.
- The chapter interactions are a first functional pass; exact mechanical mating, textures, cinematic choreography and cutaway interiors remain unverified.
- No merge to `main` and no production deploy performed.
