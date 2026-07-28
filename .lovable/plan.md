# Services Page — Ultra Premium Redesign

Reference direction (Aroha) noted, but we go **different**: editorial + luxury-medical, not stat-block + card-grid. Backend/admin data (`servicesQ`) stays the source of truth — nothing hardcoded.

## Visual direction

- **Split editorial hero** (replaces `PageHero`): left = huge serif headline "Care, engineered around your life.", eyebrow, short paragraph, twin CTAs (Book a consult / Talk to advisor). Right = a stacked "proof column" with three micro-cards (24/7 · Verified · 2‑hr replacement) as glass tiles — lifted, not the flat peach blocks in the reference.
- **Mint→ivory gradient background** with soft radial glows; a thin hairline divider marks section transitions (no heavy peach bands).
- **Sticky category rail** just under hero: pill filters generated from distinct `service.category` values coming from the API. Clicking filters the grid in place with Framer Motion layout animation.

## Services showcase (the hero of the page)

Replace the uniform 3-col grid with a **bento/asymmetric layout**:

```text
┌─────────────────┬───────────┐
│  FEATURED (2x)  │  standard │
│  large image    ├───────────┤
│  overlay title  │  standard │
├───────┬─────────┴───────────┤
│ std   │  WIDE (2 cols)      │
├───────┼─────────┬───────────┤
│ std   │  std    │  std      │
└───────┴─────────┴───────────┘
```

- First item = large featured tile (image full-bleed, gradient scrim, title + 2-line desc + price chip overlaid).
- Every 5th item = wide 2-col tile (image left, content right).
- Rest = compact tiles reusing existing `ServiceCard` (already redesigned, compact).
- Hover: image `scale-[1.04]`, glass chip lifts, arrow slides — motion-safe.

## New sections below the grid

1. **"How care arrives" — 4-step horizontal timeline** (Enquire → Assess → Match → Care) with numbered serif numerals, hairline connector, no boxes. Static copy.
2. **"Trusted by families across India" — testimonial marquee** pulling from `testimonialsQ` if available, otherwise hidden (no fake data).
3. **CTA band** — dark teal, serif headline "Not sure which service fits?", inline advisor form → posts to existing contact endpoint (reuse `ContactForm` in compact mode). No new backend.

## Technical

- Edit `src/routes/services.index.tsx` only; add a small `src/components/site/services/ServicesBento.tsx` for the asymmetric layout logic (takes `items[]`, decides tile size by index).
- Category filter = `useMemo` over `items.map(i => i.category)`, `useState` for active filter, `AnimatePresence` + `layout` on the bento container.
- Reuse existing `ServiceCard` for standard tiles; create inline `FeaturedServiceTile` + `WideServiceTile` variants in the same new file (all consume the same `Service` type).
- Colors/typography via existing tokens (`--color-primary`, `--color-accent`, Fraunces/Inter). No hardcoded hexes.
- Loading = shimmer tiles matching the bento shape (not a plain 3-col grid).
- Empty state kept, restyled to match.
- Admin/backend connection unchanged — all content comes from `servicesQ`, including `featured_image`, `title`, `short_description`, `category`, `price`, `slug`.

## Out of scope

- No changes to `ServiceCard.tsx` (already compact per your last request).
- No changes to header, home, or other routes.
- No new API endpoints; no mock data.
