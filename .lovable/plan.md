# Equipment Carousel: Continuous Right-to-Left Scroll

## Goal
Change the Equipment section carousel so the slides flow continuously from right to left (infinite marquee style) instead of snapping one slide at a time and jumping back left.

## Current State
- `src/components/site/EquipmentCarousel.tsx` drives `PerspectiveCarousel` via an `activeIndex` timer that increments every 3.5 s.
- `src/components/ui/perspective-carousel.tsx` is a 3D perspective carousel built around a single active slide; every index change recalculates positions and animates to the new active item, which creates the "snap back" feel the user dislikes.

## Plan
1. **Add a continuous-scroll mode to `PerspectiveCarousel`**
   - Introduce an optional `continuous?: boolean` prop.
   - When `continuous` is true, render a duplicated item set so the track can loop seamlessly.
   - Use a CSS `@keyframes` animation (or Framer Motion `animate` with `repeat: Infinity`) to translate the track horizontally from `0` to `-50%` (one full set) over a configurable duration (e.g. 25 s).
   - Direction is right-to-left, so the negative X translation moves items toward the left edge.
   - Pause the animation on hover/focus/interaction, matching the existing pause logic in `EquipmentCarousel`.

2. **Keep the existing 3D look**
   - Preserve slide dimensions (300 px width, 1.35 aspect), rounded corners, shadow, and image object-cover.
   - Keep the slight perspective/scale treatment by applying static transforms to non-active items or by reusing the current per-slide styling so the carousel still looks premium.

3. **Update `EquipmentCarousel`**
   - Pass `continuous` to `PerspectiveCarousel`.
   - Remove the `activeIndex` timer-based advancement; instead rely on the CSS/motion loop.
   - Keep the hover/focus/hidden/interaction pause behavior.
   - Keep the title label and optional controls/dots if they still make sense, or hide dots in continuous mode since the concept of a single active index is replaced by a flowing strip.

4. **Verify**
   - Check the homepage Equipment section in the preview.
   - Confirm slides enter from the right, move steadily left, and loop without blank gaps or snap-back.

## Files to Change
- `src/components/ui/perspective-carousel.tsx`
- `src/components/site/EquipmentCarousel.tsx`
