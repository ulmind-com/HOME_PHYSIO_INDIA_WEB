## Goal
Redesign the service cards in the "Care that meets you where you are." section (and reused elsewhere) to feel ultra-premium, image-forward, and editorial — while staying fully wired to the admin panel via the existing `servicesQ` API and `service.featured_image`.

## Scope
- File: `src/components/site/cards/ServiceCard.tsx` (only)
- No API, no route, no data changes. Cards keep pulling `title`, `slug`, `featured_image`, `category_name`, `short_description`, `price`, `price_unit` from the backend exactly as today.

## New card design (image-forward, luxury medical)
Layout: tall rounded card (`rounded-[2rem]`), full-bleed image top, editorial content block below, refined footer.

1. Media block (top, ~aspect 4/5)
   - Full-bleed `featured_image` with slow zoom on hover (scale 1.06, 900ms ease).
   - Subtle gradient scrim from bottom for legibility.
   - Floating category chip top-left: frosted glass pill (`bg-white/70 backdrop-blur-md`), tiny uppercase tracked label.
   - Floating price chip top-right when `price` exists: glass pill with `₹{price}` and unit in muted tone.
   - Fallback (no image): soft mint gradient with a large mono-line heart/stethoscope glyph and faint grain — still feels premium.

2. Content block (below image, generous padding `p-7`)
   - `h3` title in display serif, tighter tracking, 2-line clamp.
   - `short_description` in muted tone, 2-line clamp, refined leading.
   - Thin hairline divider (`border-t border-border/60`) before footer.

3. Footer row
   - Left: "Learn more" micro-label in accent color.
   - Right: circular arrow button that rotates 45° and shifts to primary on hover (kept from current design but refined size 10x10, primary bg on hover).

4. Card shell polish
   - Base: `bg-surface`, `border border-border/70`, `shadow-[0_1px_0_rgba(0,0,0,0.02)]`.
   - Hover: lift (`-translate-y-1`), softer premium shadow (`0_30px_60px_-30px_color-mix(in_oklab,var(--primary)_35%,transparent)`), border shifts to `primary/40`.
   - Focus-visible ring using `--ring`.
   - Motion: all transitions 500-700ms `ease-out`; respects `prefers-reduced-motion` (Tailwind's `motion-reduce:` variants disable transform/scale).

## Where it applies (automatically, no other edits)
- Home "Care that meets you where you are." grid (uses `ServiceCard`).
- `/services` index grid (same component).

## Non-goals
- Not touching Equipment/Blog/Video cards.
- Not adding new data fields or image generation — real admin-uploaded `featured_image` drives the look.

## Verification
- Read updated file, curl `/` and `/services` for HTTP 200, screenshot home services grid at desktop and mobile via Playwright to confirm image-forward layout and hover polish render correctly with live data.
