# Plan: Ultra-Premium "About / Categories" Section After Hero

## Goal
Add a new section immediately after the existing Hero on the home page — before the TrustBar and Services grid — that feels ultra-premium, unique, and visually rich (not just text). The section should be inspired by the ArohaCares reference layout (editorial intro + category cards) but expressed in Nupun's existing teal/mint theme with custom SVG decorations and liquid-glass cards.

## What will be built

### 1. New `AboutWelcomeSection` component
- Positioned directly after `<Hero />` in `src/routes/index.tsx`.
- Two visual zones:
  - **Intro zone:** large editorial headline + paragraph on the left, a premium rounded photo card on the right with a floating glass stat badge.
  - **Categories zone:** a centered section title + a bento-style grid of category cards built from the live `/services` API.
- Custom SVG illustrations layered behind the content for uniqueness:
  - A large soft organic blob shape in the background.
  - Thin decorative rings and dots that animate subtly on scroll.
- All motion powered by Framer Motion: staggered fade-up text, image scale-in, and hover-lift cards.

### 2. New `CategoryShowcase` component
- Renders service categories from admin panel data (`servicesQ`).
- Each card uses:
  - Liquid-glass surface (`glass` utility) with a subtle border.
  - Service `featured_image` or a premium generated gradient fallback.
  - Slow zoom on hover and a soft shadow.
  - A custom SVG icon marker per card.
- Empty-state fallback shows 4 premium placeholder category cards so the design always looks complete.

### 3. Data sources
- `/settings` for website name / tagline.
- `/services` for live category cards.
- Hardcoded premium fallback copy and image for the intro zone, which can be swapped once the admin panel exposes page-content fields.

### 4. Styling rules
- Uses existing design tokens only: `var(--primary)`, `var(--accent)`, `var(--surface)`, `glass`, `text-gradient`, etc.
- No hardcoded hex colors; the mint/teal palette stays consistent.
- Responsive from mobile to desktop; the photo card stacks above text on small screens.

## Files to create / edit
- Create `src/components/site/AboutWelcomeSection.tsx`
- Create `src/components/site/CategoryShowcase.tsx`
- Edit `src/routes/index.tsx` to insert `<AboutWelcomeSection />` between `<Hero />` and `<TrustBar />`
- Edit `src/styles.css` only if a new reusable utility is needed (e.g., `.premium-card` or `.blob-bg`)

## Verification
- Build passes (`bun run build` or harness build).
- Preview shows the new section directly below the hero with no layout breakage.
- Category cards populate from the live `/services` endpoint.
- Mobile layout stacks cleanly and text remains readable.
