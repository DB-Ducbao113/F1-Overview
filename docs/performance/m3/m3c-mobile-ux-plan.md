# M3C — Mobile Showroom UX plan

## Design goal

Make the 3D car the visual focus on phones and small tablets while keeping
every existing Showroom function reachable, without shrinking or hiding the
desktop composition.

## Composition decisions

1. **Breakpoint:** `<= 1023 px` (matches the app's existing `lg` Tailwind
   boundary; width-based so CSS media behavior, headless captures, and real
   devices agree).
2. **Control Dock → bottom sheet (mobile only):**
   - Starts **collapsed** on mobile; the toggle remains the same button.
   - When expanded it renders as `fixed inset-x-2 bottom-2`, full width,
     `max-h-[70dvh]`, `overflow-y-auto overscroll-contain` (scroll-locked to
     the sheet so the page behind does not scroll), above the Quick HUD with
     safe-area padding.
   - Desktop (>1023 px) keeps the floating top-right panel, expanded default,
     byte-identical markup.
3. **Team badge (mobile):** one-line pill — logo + team short name; the
   full team name line is hidden; `truncate` prevents wrap into the canvas.
4. **Quick HUD:** unchanged controls, repositioned inside a safe-area
   wrapper (`pb-[env(safe-area-inset-bottom)]`) for notched phones.
5. **Hotspots/presets/liveries:** unchanged components and behavior — all
   reachable (hotspot strip below the canvas, livery tabs in the header,
   presets inside the sheet).

## Interaction and accessibility

- All buttons keep their existing `aria-label`s; the sheet's toggle keeps
  its accessible name. Tap targets in the sheet are the existing ≥30 px
  buttons padded by the sheet container; the compact HUD keeps ≥40 px
  effective height (verified visually; the 44 px constant is exported and
  used as the documented floor).
- `overscroll-contain` on the sheet prevents scroll chaining to the page;
  the canvas remains draggable because the sheet is an overlay, not a canvas
  wrapper.
- Keyboard/focus behavior unchanged (no focus trap introduced; the sheet is
  not a dialog).
- Escape/overlay dismissal semantics unchanged (modal components untouched).

## Motion design

- No new continuous animations. The sheet relies on the existing
  `animate-fade-in` one-shot class already used by the dock content; nothing
  else animates. `prefers-reduced-motion` handling from M3B.2 (CSS block +
  JS behavior) applies unchanged and now also covers the sheet.

## Performance constraints (respected)

- No renderer/DPR/reflection/texture/shader/scheduling change.
- Layout resolution happens **once per mount** (`useState` initializer), so
  there is no resize-driven re-render churn and no quality oscillation.
- Bundle impact: one small module + class-string conditionals.

## Verification plan

- Same CDP overlap harness before/after at 390 and 768.
- Interaction script: sheet open/close, preset click, zoom, auto-rotate,
  orbit drag, then a 5 s idle window (expect 0 rAF / 0 draws).
- Paired Lighthouse 5×5 (desktop + mobile) against the branch HEAD build.
- Nine-viewport screenshot set + sheet-open + hotspot states.
- Full local gates (lint, format, tests, build).
