## Goal
Make the hero fill the full viewport width (no left/right gaps) and float the navbar on top of the hero instead of sitting above it.

## Changes

**`src/routes/index.tsx` — Hero only**
- Remove the `container-x` wrapper and outer rounded card border-radius on large screens so the hero spans edge-to-edge (`w-full`, no horizontal padding, no rounded corners at top).
- Give the hero section a real height (`min-h-screen` on desktop, ~90vh on mobile) so it fills the visible screen under the overlaid navbar.
- Keep the doctor image full-bleed (right-aligned, feathering into mint on the left) and the text block on the left, but shift the content down (`pt-32`) so it clears the overlaid navbar.
- Keep the floating booking bar at the bottom, but constrain it to a centered `max-w-6xl` with side padding so it doesn't touch the edges.
- Add top padding to the following section (`TrustBar`) so nothing tucks under the hero.

**`src/components/site/Header.tsx` — Overlay nav**
- Make the header `absolute top-0 inset-x-0 z-50` (over the hero) instead of sitting in normal flow.
- Keep the floating pill style; add a subtle backdrop so it stays readable over the image.
- Only overlay on the home route — on other routes keep it as a normal sticky header. Use `useRouterState` to detect `pathname === "/"` and toggle the positioning class.

**`src/routes/__root.tsx`**
- Remove any top padding/margin that would push the hero below the header on `/`, so the hero truly starts at viewport top.

## Out of scope
Header links, booking bar fields, backend wiring, other pages, styles.css tokens.
