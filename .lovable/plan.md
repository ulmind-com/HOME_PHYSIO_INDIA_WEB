# Swap Equipment Rental section for Perspective Carousel with 5 uploaded images

Replace the entire "Equipment rental" section on the home page with the PerspectiveCarousel, populated by the 5 uploaded medical-equipment photos, with autoscroll.

## What changes

- **Upload assets** — push the 5 uploaded images to Lovable CDN via `lovable-assets create` and write pointer JSON to `src/assets/equipment/*.asset.json`:
  1. Siemens X700 Ultrasound
  2. At-Home Health Testing & Monitoring
  3. At-Home Health Testing & Monitoring (2)
  4. Anesthesiology Equipment
  5. Stethoscope
- **Reuse** existing `src/components/ui/perspective-carousel.tsx` (already added last turn).
- **Rewrite wrapper** `src/components/site/EquipmentCarousel.tsx` — drop the API/dynamic wiring; import the 5 asset pointers as a static `items` array with friendly titles + alts, feed into `PerspectiveCarousel` with `loop`, autoscroll every 3.5s (pauses on hover, focus, hidden tab), `slideWidth={230}`, `rotationStep={55}`, `inactiveScale={0.82}`.
- **Home page** `src/routes/index.tsx` — remove the whole `EquipmentSection` (SectionHeader + grid + `EquipmentTeaser` fallback) and its `<EquipmentSection />` call site. Render the carousel in the same slot inside a `<Section>` with a fresh header: eyebrow "Equipment", title "Hospital-grade equipment, at home.", and a "Browse equipment" link to `/equipment` kept on the right.
- **Cleanup** — drop the now-unused `equipmentQ` import, `EquipmentTeaser`, and `Stethoscope` icon import if no longer referenced.

## Dynamic vs. static

Per the latest instruction ("oi 5ta image use kore"), this section becomes a curated static showcase using the 5 uploaded images. The `/equipment` catalogue page stays fully dynamic and admin-panel-driven; only the home-page teaser is static.

## Technical notes

- Assets go through `lovable-assets` (CDN) so they resolve on Vercel and stay out of the git repo.
- Autoscroll lives in the wrapper via `setInterval`, cleared on pause / unmount.
- No API, type, or backend changes.
