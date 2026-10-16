# M3B.2 final browser verification

## Environment

- Candidate application commit: `a66100aba3236f46b8c86865c4a8958fcdc31d68`.
- Chrome: `155.0.8059.40`.
- Production build served by Vite preview on localhost.
- Evidence: [`m3b2-browser-qa.json`](artifacts/m3b3-hardening/m3b2-browser-qa.json).

All scenarios below were executed again against the final candidate. They are
browser measurements rather than source-level inferences.

## Reduced motion

| Scenario               | Measured result                                                                                                                                                                      | Status |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------ |
| Reduced-motion default | Media query matched; auto-rotation defaulted OFF; 5 s settled window recorded 0 rAF callbacks, 0 draws, and 0 long tasks                                                             | PASS   |
| Manual orbit drag      | 14 callbacks and 1,627 draws while dragging; the following 2 s recorded 0 callbacks and 0 draws                                                                                      | PASS   |
| Live preference change | Normal motion was enabled, auto-rotation started, then the preference changed to reduce; the stop transition used 3 callbacks and 410 draws, then a separate 2 s window recorded 0/0 | PASS   |
| Damping tail           | Reduced-motion drag stopped immediately after interaction; no recurring tail work remained                                                                                           | PASS   |

The live preference fix is in `CameraController.tsx`: changing to reduced
motion clears `dampingUntil`, disables OrbitControls damping, updates controls,
and invalidates one finite frame.

## Language, visibility, and context lifecycle

| Scenario                   | Measured result                                                                                                              | Status                          |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| Language switch            | English UI and English studio backdrop rendered; active references remained car `1`, studio `1`                              | PASS                            |
| Off-screen pause           | 3 s off-screen window: 0 callbacks / 0 draws; restore: 3 callbacks / 298 draws                                               | PASS                            |
| Hidden tab                 | 3 s hidden window: 0 callbacks / 0 draws; restore: 2 callbacks / 372 draws                                                   | PASS                            |
| WebGL context loss/restore | `WEBGL_lose_context` supported; cache references stayed valid; restore produced 1 callback / 186 draws; programs remained 23 | PASS with measured rebuild cost |

Context restoration caused one 398 ms long task while the renderer rebuilt GPU
state. This is a real measured initialization cost. It does not recur during
settled rendering and is not attributed to the texture cache.

The only browser console errors were local 404s for Vercel Analytics and Speed
Insights endpoints under `vite preview`. No React, Three.js, WebGL, or cache
warning was emitted.

## Verdict

M3B.2 browser verification is **closed**. Reduced-motion defaults, live
preference changes, drag without a damping tail, language switching,
hidden/off-screen restoration, and WebGL context restoration were all executed
on the final candidate. The WebGL restore long task remains documented for a
future initialization phase; it does not block this lifecycle hardening gate.
