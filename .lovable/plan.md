## Goal
Make the hero image cover the entire hero section as a full-width background, with the heading, subheading, buttons, and booking bar layered on top (matching the CarePlus reference).

## Changes
**`src/routes/index.tsx` — Hero section only**
- Replace the current two-column grid (text left / image right) with a single full-bleed hero container.
- Doctor image becomes an absolutely-positioned background `<img>` covering the full hero (`absolute inset-0 h-full w-full object-cover`), with a soft left-to-right gradient overlay (`bg-gradient-to-r from-primary-soft/95 via-primary-soft/70 to-transparent`) so the left-side text stays readable.
- Text block (eyebrow, "Your Health, Our Priority" heading, subheading, Book Appointment + Explore services buttons) moves into a relative content layer, left-aligned, vertically centered, constrained to ~max-w-xl.
- Keep the floating glassmorphism booking bar (Service / Care type / Date / Book Now) pinned at the bottom of the hero, full width — unchanged fields and wiring to `/booking` and live services query.
- Preserve rounded hero card, mint tint edges, framer-motion reveals, and responsive stacking (on mobile: overlay darkens more, text stays on top of image).

## Out of scope
- Header, other sections, backend, styles.css tokens — no changes.
