# Hero shape corners + right-side spacing

Two small visual tweaks to the hero:

## 1. Round the shape corners

In the reference the mint panel has softly rounded corners on all four sides — not sharp. Update `HeroShape.tsx` so the hand-crafted SVG path uses rounded corners (~24px radius) at each of the four vertices while keeping the leaning-trapezoid geometry (top-left inset, diagonal bottom edge). The `<clipPath>` uses the same rounded path so the photo follows the curves.

## 2. Remove the empty gap on the right

Currently the right column is `lg:w-[54%]` inside `container-x`, leaving noticeable whitespace to the right of the mint panel. Fix by letting the shape reach the right edge of the viewport:

- Move the right column out of `container-x` so it can bleed to the screen edge, or set its right padding/margin to 0 and pin the SVG to `right-0`.
- Set the SVG width to fill the column with no max-width cap on large screens, and increase `max-h` so it reads as a full-height panel.
- Keep the left text column inside the container so the copy stays aligned.

## Technical notes

- New rounded path (approx): `M 84 0 H 576 A 24 24 0 0 1 600 24 V 496 A 24 24 0 0 1 578 519.6 L 22 599.1 A 24 24 0 0 1 0 575.3 V 84 A 24 24 0 0 1 24 60 Z` — tune radii so the curves match the reference's softness.
- In `Hero.tsx`, restructure the grid so the right column sits outside `container-x` (e.g. absolute-positioned on `lg` or a full-bleed flex row with the text column constrained by max-width).
- No backend/data changes; admin-panel wiring untouched.
