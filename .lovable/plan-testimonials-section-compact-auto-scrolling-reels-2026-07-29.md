# Testimonials Section — Compact + Auto-scrolling Reels

Reshape the "What They Say About Nupun Home Care" section so it feels lighter, with smaller reel cards that continuously auto-scroll right-to-left. Admin-uploaded videos remain the source (no backend changes).

## Changes

Scope: `src/components/site/VideoTestimonialsSection.tsx` only.

1. Shrink the section
   - Reduce vertical spacing (tighter `Section` padding wrapper) and drop the large left "wall" image column. Move to a single-column, centered header + marquee layout so overall section height is significantly smaller.
   - Trim heading size (e.g. `text-3xl md:text-4xl`) and shorten subcopy spacing.

2. Smaller reel cards
   - Render 9:16 `VideoCard`s at a reduced fixed width (~180–200px) inside the marquee track instead of the current 2-up grid. Height scales from the 9:16 aspect.

3. Right-to-left auto-scroll marquee
   - Replace the paginated `AnimatePresence` carousel with an infinite marquee: duplicate the video list twice inside a flex track and animate `x` from `0` to `-50%` using Framer Motion with a linear, looping transition (duration scales with item count, ~40s baseline).
   - Pause on hover for readability; keep click-to-play wired to the existing `VideoPlayerModal`.
   - Add left/right fade masks (gradient overlays) so cards fade in/out at the edges.

4. Keep intact
   - `videosQ` data source, `VideoCard` component, `VideoPlayerModal`, and mobile behavior (marquee works identically on mobile — no separate pagination logic needed).

## Technical notes

- Marquee uses `motion.div` with `animate={{ x: ["0%", "-50%"] }}` and `transition={{ duration, ease: "linear", repeat: Infinity }}`; track holds `[...items, ...items]`.
- Edge fades via absolutely positioned gradient divs using existing surface tokens.
- No new dependencies. No API/admin panel changes.
