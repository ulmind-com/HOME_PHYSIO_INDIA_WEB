# Replace Equipment Rental section with Perspective Carousel

Swap the current 4-card grid in the home page's "Equipment rental" section with a new 3D perspective carousel wired to admin data, with autoscroll.

## What changes

- **New component** `src/components/ui/perspective-carousel.tsx` — the vengenceui PerspectiveCarousel (framer-motion + lucide) adapted to our stack (`cn` from `@/lib/utils`, plain `<img>`, no Next).
- **New wrapper** `src/components/site/EquipmentCarousel.tsx` — fetches equipment via existing `equipmentQ({ limit: 12 })`, maps `{ src: featured_image, title, alt }`, and renders `PerspectiveCarousel` with:
  - `loop`, `showControls`, `showDots`
  - **Autoscroll**: `setInterval` advances `activeIndex` every ~3.5s; pauses on hover, on focus-within, and when tab is hidden; resets timer on manual interaction.
  - Clicking active slide navigates to `/equipment/$slug`; title overlay shows equipment name + price.
  - Skeleton state when loading; hides section if API returns empty (falls back to existing `EquipmentTeaser`).
- **Home page edit** `src/routes/index.tsx` — replace the grid inside `EquipmentSection` with `<EquipmentCarousel />`; keep the SectionHeader, "Browse equipment" link, and empty-state teaser intact.

## Dynamic / admin wiring

Fully dynamic — pulls from the same `/equipment` proxy endpoint the catalogue page uses. Any equipment added, edited, reordered or unpublished in the admin panel appears here on next fetch (5-min staleTime). No hardcoded slides.

## Technical notes

- Component is client-only motion; safe under SSR because framer-motion is already used elsewhere.
- Uses design tokens (`bg-surface`, `text-foreground`, `border-border`) instead of the demo's neutral colors so it matches the luxury-medical palette.
- Autoscroll implemented in the wrapper (not the base component) so the base stays reusable.
- No backend or type changes; `Equipment.featured_image` already exists.
