# Professionals section — replace layered shape with 4 image tiles

Rebuild the right side of `src/components/site/ProfessionalsSection.tsx`. Remove the current layered image composition (main tall image + inset video-call card + opening-hours gradient card) and the decorative background blob. In its place, render 4 compact image tiles arranged in a 2×2 grid. Each tile is one of the existing equipment images with its own overlay text + button on top of the image. Left column (heading, description, feature list, "View More About Us" button) stays exactly as-is.

## The 4 tiles (right column, 2×2 grid)

Reuse the same 4 images already used in the equipment carousel from `public/assets/equipment/`:

1. `/assets/equipment/siemens-x700.jpg` — Registered Nurses — `120+` — "Round-the-clock bedside care" — button "Meet the nurses" → `/about`
2. `/assets/equipment/at-home-testing.jpg` — Physiotherapists — `45` — "In-home rehab & recovery" — button "Book a session" → `/booking`
3. `/assets/equipment/anesthesiology.jpg` — Doctors on panel — `30` — "Specialist consults on call" — button "Consult a doctor" → `/booking`
4. `/assets/equipment/x.jpg` — Care attendants — `200+` — "Daily-living support at home" — button "Get an attendant" → `/booking`

Each tile:
- Aspect-ratio ~4/5, rounded-3xl, `overflow-hidden`, subtle border + `shadow-[var(--shadow-elegant)]`.
- `<img>` fills the tile with `object-cover` and a slow-zoom on hover (`group-hover:scale-105 transition-transform duration-700`).
- Dark gradient overlay from bottom (`bg-gradient-to-t from-black/75 via-black/25 to-transparent`) so text is legible.
- Content stack pinned to bottom-left with `p-5`:
  - small count chip (`120+`) in a glass pill
  - title in `font-display text-lg text-white`
  - one-line description in `text-xs text-white/80`
  - button: small pill `rounded-full bg-white/90 text-foreground px-3 py-1.5 text-xs` with arrow icon; hover fills primary

## Motion — one-by-one right→left reveal, text animated

Use framer-motion. Tiles animate in sequence from the right edge:
- Container: `whileInView` with `viewport={{ once: true, amount: 0.3 }}`, `staggerChildren: 0.18`.
- Each tile variant: `hidden: { opacity: 0, x: 80 }` → `show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.22,1,0.36,1] } }`.
- Inside each tile, overlay text uses its own nested stagger so chip → title → desc → button fade+rise (`y: 12 → 0`, 0.08s stagger) after the tile lands.
- Grid order: top-right tile first, then top-left, then bottom-right, then bottom-left, so the sweep reads right→left.

## Dynamic wiring

Keep it static-default + settings override, matching how `hours` is handled today:

```ts
const { data: settings } = useQuery(settingsQ());
const tiles = settings?.people_tiles?.length ? settings.people_tiles : DEFAULT_TILES;
```

`DEFAULT_TILES` is the 4-item array above (image, count, title, desc, ctaLabel, ctaHref). If `settings.people_tiles` is present in the API response later, it overrides; no other backend change is required now. `people_tiles` field stays optional on the Settings type.

## Cleanup

- Delete `DecorBackdrop` usage and the SVG blob behind the section.
- Delete `DEFAULT_MAIN`, `DEFAULT_INSET`, opening-hours card and its `ClockGlyph` icon (no longer used).
- Keep `HeartPulseIcon`, `StethoIcon`, `ClockShieldIcon` (used by the left feature list).

## Files touched

- `src/components/site/ProfessionalsSection.tsx` — right column rewrite, motion sequence, cleanup.

## Out of scope

Left column copy, header, other sections, backend/admin panel schema.
