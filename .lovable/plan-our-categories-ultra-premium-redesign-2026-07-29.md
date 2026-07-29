# Our Categories — Ultra Premium Redesign

Redesign the "Our Categories" section on the home page into a bold, editorial 2×2 image-card grid inspired by the reference, but with a unique Nupun signature (custom SVG shape overlays, layered depth, magnetic hover, mint theme instead of maroon).

## Visual direction

- Large 2×2 grid (stacks to 1 column on mobile) of tall image cards (~aspect 16/10 desktop, 4/5 mobile).
- Full-bleed image inside each card with a slow zoom on hover.
- Custom SVG shape overlay on each card: a hand-crafted asymmetric curve (unique per card, rotated variants) sitting at the bottom-left, tinted with the site's primary mint gradient — this replaces flat gradient scrims and gives each card a distinct sculptural feel.
- Title in Clash Display (large, white, bottom-left), thin one-line description that fades in on hover.
- Floating circular arrow button (bottom-right) — glassmorphism, magnetic hover, rotates 45° on hover.
- Small numeric index ("01 / 04" etc.) in top-left as an editorial touch.
- Section header: eyebrow chip + "Our Categories" headline with a mint underline SVG squiggle + intro copy. Decorative dotted grid + soft blob in the section background.
- Reveal on scroll via existing framer-motion patterns.

## Data & admin integration

- The 4 cards are backed by the existing `servicesQ` list (already fetched in `AboutWelcomeSection`). Each card uses `service.featured_image`, `service.title`, `service.short_description`, and links to `/services/$slug` — so admins upload/edit through the existing service admin panel with zero backend changes.
- Fallback: when fewer than 4 services exist or an image is missing, render a bundled asset from `src/assets/categories/*` with a friendly label, so the grid always looks complete.
- Bundle 4 curated images (the user's uploaded reference photos) into `src/assets/categories/` via `lovable-assets` pointers so they ship as CDN assets, not in the repo.

## Files

- New: `src/components/site/CategoryShowcasePremium.tsx` — the redesigned section (replaces current `CategoryShowcase` usage on home).
- New: `src/components/site/CategoryCardShape.tsx` — small component exporting 4 unique inline SVG shape overlays (variant A/B/C/D) used behind the text on each card.
- New asset pointers: `src/assets/categories/nursing.jpg.asset.json`, `elder.jpg.asset.json`, `physio.jpg.asset.json`, `equipment.jpg.asset.json` — created from the user's uploaded images via `lovable-assets create --file /mnt/user-uploads/...`.
- Edit: `src/components/site/AboutWelcomeSection.tsx` — swap `<CategoryShowcase />` for `<CategoryShowcasePremium />`.
- Keep `CategoryShowcase.tsx` in place (unused) for now; safe to delete later.

## Technical notes

- Cards use `Link to="/services/$slug"` when a slug exists; otherwise a plain `div` (no dead links).
- SVG overlays use `currentColor` + `text-primary/85` so they inherit the theme mint automatically.
- Hover motion: `whileHover` scale on image (1.06), translate-y on card (-6px), arrow rotate 45°, description opacity 0→1.
- Accessibility: each card has descriptive alt text, keyboard focus ring on the card, arrow button is decorative (aria-hidden).
- No backend changes, no new dependencies.
