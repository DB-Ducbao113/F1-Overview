# M3C — Mobile Showroom UX baseline audit

## Scope

Audit of the pre-M3C Showroom composition on branch `perf/speed-insights-v2`
at HEAD `1cafeae`, production build served by `vite preview`, Chrome headless
capture, CDP-driven measurement.

## Viewport captures (before)

`artifacts/m3c/screenshots/m3c-base-*.png` at 320×568, 375×667, 390×844,
430×932, 768×1024, 1024×768, 1280×900, 1440×1000, 1920×1080. Document-level
horizontal overflow: **0 px at all nine widths** (the M3A finding stands —
the problem is overlap, not overflow).

## Quantified overlap with the car focus zone

The car focus zone is the central band of the canvas
(x: 25–75 %, y: 30–75 % of the canvas rect). Controls intersecting it by more
than 200 px² are listed with their measured overlap area.

### 390×844

| Control                                                                                       |                                             Overlap (px²) |
| --------------------------------------------------------------------------------------------- | --------------------------------------------------------: |
| Control Dock — camera preset buttons (Vách Kỹ Thuật / Toàn Cảnh Xe / ORBIT tag / preset grid) |               ≈3,500–5,200 each; dock panel total ≈17,900 |
| Hotspot toggle row (Điểm Kỹ Thuật, Tự Xoay Xe)                                                |                               part of the same dock panel |
| **Total dock overlap**                                                                        |                                           **≈17,900 px²** |
| Team badge (top-left, three-line card)                                                        | touches the focus zone's upper-left at some scroll states |
| Quick HUD (bottom)                                                                            |                               outside the focus zone — OK |

Root cause: the Control Dock renders `expanded` by default as a fixed
290 px-wide panel pinned to the top-right of a 620 px-tall canvas; at 390 px
viewport width it covers roughly 60 % of the canvas height.

### 768×1024

| Control                                                      | Overlap (px²) |
| ------------------------------------------------------------ | ------------: |
| Control Dock panel (expanded) over rear wing / rear bodywork |    ≈9,800 px² |

## Component inventory and current behavior (pre-redesign)

| Component                 | Behavior before M3C                                                                                                                                                                  |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `ShowroomView.tsx`        | Stage container `h-[620px] sm:h-[680px] lg:h-[720px]`; badge top-left card; dock top-right; QuickHUD bottom-center; hotspot strip + dossier below the canvas                         |
| `ShowroomControlDock.tsx` | Floating 290/320 px panel, top-right, expanded by default on all devices; 3 tabs (Panoramas / Read Boards / Car Aero), 4-wall tour, hotspot toggle, auto-rotate toggle, 2D blueprint |
| `ShowroomQuickHUD.tsx`    | Bottom-center bar: wheel-mode toggle (page scroll vs 3D zoom), zoom ±, 4-wall cycle, 360° toggle, reset, 2D CAD link                                                                 |
| `LiverySelector.tsx`      | Horizontal team tabs in the header bar (all teams reachable by horizontal scroll)                                                                                                    |
| `HotspotSelectorBar.tsx`  | Component 1–6 strip below the canvas                                                                                                                                                 |
| `HotspotDetailsModal.tsx` | Slide-over drawer synced with the selected team                                                                                                                                      |
| `CameraController.tsx`    | Orbit + damping + presets + demand invalidation (M3B.1/M3B.2 behavior; untouched in M3C)                                                                                             |

## Findings that shaped the redesign

1. The overlap is a **default-expanded dock** problem, not a width overflow
   problem — collapsing by default on mobile removes most of the obstruction
   without hiding any function.
2. The Quick HUD at the bottom is already non-obstructive and must be kept
   as the primary mobile control surface.
3. The badge's three-line card wastes vertical space on phones; a one-line
   pill preserves team identification.
4. Safe-area insets matter for the bottom-fixed HUD on notched phones.
5. Any mobile redesign must keep every function reachable (the acceptance
   list) — the bottom-sheet dock pattern satisfies this while keeping the
   desktop composition byte-identical above 1023 px.
