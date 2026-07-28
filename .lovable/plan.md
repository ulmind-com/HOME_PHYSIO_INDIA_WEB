## Goal
Lift the booking bar up so it sits inside the hero (not clipped below the fold), and restyle both the navbar and the booking bar as premium "liquid glass" (frosted, translucent, layered highlights).

## Changes

**`src/routes/index.tsx` — Hero booking bar**
- Move the booking bar OUT of its current position below the hero card. Place it inside the hero as an absolutely-positioned element pinned to the bottom (`absolute bottom-8 lg:bottom-10 inset-x-0`) so it's visible within the viewport.
- Reduce hero min-height slightly (`min-h-[92svh]`) so nav + hero + booking bar all fit above the fold on a laptop.
- Restyle bar as liquid glass:
  - `bg-white/25 backdrop-blur-2xl backdrop-saturate-150`
  - `border border-white/40`
  - Inner top highlight: pseudo-gradient overlay `bg-gradient-to-b from-white/40 to-transparent` at ~30% height
  - `shadow-[0_20px_60px_-20px_rgba(0,0,0,0.25)]`
  - Field pills switch from `bg-primary-soft/60` → `bg-white/35 backdrop-blur border border-white/50`
  - Book Now button keeps solid teal for contrast.

**`src/components/site/Header.tsx` — Liquid-glass nav**
- Replace solid `bg-white` with:
  - `bg-white/30 backdrop-blur-2xl backdrop-saturate-150`
  - `border border-white/50`
  - `shadow-[0_20px_50px_-20px_rgba(20,80,80,0.35)]`
  - Add a subtle inner highlight via `before:` pseudo (top gradient sheen).
- Keep the pill shape, logo, and links. Ensure text stays readable — bump inactive links to `text-foreground/80`.
- Mobile menu panel also gets the same glass treatment.

**Tailwind v4 note**
- Use only standard `backdrop-filter` utilities (no hand-written `-webkit-` prefixes) per the build-time dedup rule.

## Out of scope
Hero image, headline copy, buttons in text block, other sections, backend wiring.
