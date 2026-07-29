# Match hero shape + image exactly to the MediWise reference

The current shape (big rounded top-right, sweeping bottom-left) is the wrong geometry. The reference is a slightly clockwise-tilted rounded rectangle whose right edge bleeds off the container; only the left corners and bottom-right corner are visible as rounds.

## Shape geometry to build

- Overall: a rounded rectangle tilted ~4° clockwise.
- Top-left corner: soft round (~28px).
- Top edge: near-straight, gently sloping up toward the right, exiting the visible frame.
- Right edge: straight vertical, extends past the container's right padding so the corner is off-canvas (bleed).
- Bottom-right corner: small soft round (~20px), visible near the bottom edge.
- Bottom edge: near-straight, sloping down toward the right (bottom-right lower than bottom-left).
- Bottom-left corner: soft round (~28px).
- Left edge: straight vertical.

Rewrite `HeroShape.tsx` with a new SVG path implementing this. Keep the same `<clipPath>` so the photo follows the outline. Keep the mint fill and inner decorative circles.

## Image positioning

Reference shows the three doctors framed from head to hips, centered horizontally. Update the `<image>` inside `HeroShape.tsx` to use `preserveAspectRatio="xMidYMid slice"` (center-crop) instead of bottom-anchored, so the group is centered inside the panel, not clipped at the top.

## Layout tweak in Hero.tsx

To achieve the "right edge off-canvas" effect while keeping the left text column inside the container:
- Keep the outer grid as `container-x`.
- On `lg`, add negative right margin to the right column (`lg:-mr-6 xl:-mr-10`) so the shape bleeds past the container gutter.
- Remove the current `pr-4 sm:pr-6 lg:pr-10` on the right column.

## Technical notes

New path (viewBox 0 0 600 600, ~4° tilt encoded directly into coordinates):
`M 28 60 A 28 28 0 0 1 60 28 L 600 0 V 560 A 20 20 0 0 1 578 580 L 60 600 A 28 28 0 0 1 28 568 Z`

Radii and end points will be tuned against the reference after first render.

No backend, data, or copy changes.
