# Match the hero shape to the reference

Reshape `HeroShape.tsx` so the mint panel matches the uploaded reference:

- Top edge: straight, meeting a large rounded top-right corner (~40px).
- Right edge: straight vertical.
- Bottom-right: small soft round (~20px).
- Bottom edge: diagonal, sloping downward from right to left.
- Bottom-left: large sweeping round (~60px) — the most prominent curve.
- Left edge: near-vertical with a slight inward lean at the top; top-left corner soft (~24px).

Keep the same `<clipPath>` driving the photo so the doctors image follows the new curves. Photo stays bottom-anchored via `preserveAspectRatio="xMidYMax slice"`. Decorative inner rings and Hero.tsx layout stay as-is.

## Technical notes

New path (viewBox 0 0 600 600):
`M 40 24 A 24 24 0 0 1 64 0 H 560 A 40 40 0 0 1 600 40 V 500 A 20 20 0 0 1 582 519.9 L 80 599 A 60 60 0 0 1 16 543 V 84 Q 16 60 40 48 Z`

Radii will be tuned after visual check against the reference.
