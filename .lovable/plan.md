# Home hero: two-column card layout, fit in one viewport

Rebuild the home hero to match the attached reference exactly, and make the whole hero fit within a single viewport (100svh) with no scroll needed to see the Quick Book bar.

## Layout

Two-column split inside `container-x`, vertically centered, `min-h-[100svh]` (also `max-h-[100svh]` on `lg`) so it never spills:

```text
┌───────────────────────────────┬───────────────────────────────┐
│  • 24/7 care desk pill        │  ┌─────────────────────────┐  │
│                               │  │ [Verified · Background- │  │
│  Hospital-grade               │  │   checked]      [0.0★]  │  │
│  care, at home.               │  │                         │  │
│  (italic "at home" in teal)   │  │      Doctor photo       │  │
│                               │  │      (rounded card,     │  │
│  Verified nurses…             │  │       object-cover)     │  │
│                               │  │                         │  │
│  [ Book a caregiver → ]       │  │  ┌───────────────────┐  │  │
│                               │  │  │ QUICK BOOK  All ↗ │  │  │
│  10k+   0★     2h             │  │  │ Home Nursing Care→│  │  │
│  fams   revs   response       │  │  └───────────────────┘  │  │
│                               │  └─────────────────────────┘  │
└───────────────────────────────┴───────────────────────────────┘
```

- Background: soft mint gradient (`#DDEEEE → #EAF6F6 → #F8FCFC`), keep the two blurred mesh blobs.
- Left column (`lg:col-span-6`):
  - Small pill: green dot + "24/7 care desk — accepting new bookings".
  - Headline in Clash Display, tight tracking, "at home." italic in `text-accent`.
  - One-paragraph description (Nupun copy from current site).
  - Single dark rounded-full CTA "Book a caregiver →" to `/booking`. WhatsApp/tel line moves under the CTA as a small text link (kept, minimized).
  - Stats row: `10k+ families served` · `{rating}★ {total} reviews` (live from `reviewSummaryQ`) · `2h response time`, using `Counter` primitive for the numbers.
- Right column (`lg:col-span-6`):
  - Rounded-[2rem] card, full column height, holding the doctor image (`hero-care.jpg`) as `absolute inset-0 object-cover`, soft inner shadow, subtle ring.
  - Floating glass badge top-left: shield icon + "VERIFIED / Background-checked".
  - Floating glass badge top-right: 5-star row + "{rating} rating / {total} Google reviews" (live from `reviewSummaryQ`).
  - Bottom of the card: liquid-glass Quick Book pill inside the card (not overlapping outside), one row:
    - Label "QUICK BOOK" + "All services ↗" link on the right.
    - Single Service select (from `servicesQ`) with arrow button; on submit navigates to `/booking?service=…`.
    - The multi-field version is dropped for the reference match; the full multi-step wizard already lives on `/booking`.

## Fit-in-one-viewport rules

- Hero section: `min-h-[100svh] lg:h-[100svh] lg:max-h-[100svh] overflow-hidden`.
- Container padding tuned so top clears the floating header (`pt-24 lg:pt-28`) and bottom sits above the fold (`pb-6 lg:pb-8`).
- Right card uses `h-full` inside a `grid grid-rows-[1fr]` column so it fills available height instead of pushing content down.
- Left column uses fluid clamp typography (already in place) plus tighter spacing (`space-y-5`) so it never exceeds the viewport on 13" laptops.
- On mobile: stack vertically, drop `h-[100svh]` (allow natural height), keep the doctor card at `aspect-[4/5]`.

## Data / API

No backend changes. Reuses existing queries:
- `servicesQ({ limit: 30 })` — Quick Book select and "All services" link.
- `reviewSummaryQ()` — rating badge + reviews count in stats and badge.
- `settingsQ()` — phone for the small tel link under the CTA.

## What stays untouched

- Header, Footer, all non-home routes, booking wizard, video testimonials, service cards, and every section below the hero on `/`.
- Backend and admin panel.

## Technical section

- Rewrite `src/components/site/Hero.tsx` to the two-column layout above.
- Delete the previous absolute-positioned Quick Book bar (was overlapping the whole viewport). The new Quick Book is a compact pill inside the right card.
- Keep using `heroCare` asset pointer already in `src/assets/hero-care.jpg.asset.json`.
- Reuse `src/components/site/ui/Counter.tsx` for the stats numbers.
- No changes to `src/routes/index.tsx` other than continuing to render `<Hero />` at the top.
- No new dependencies.
