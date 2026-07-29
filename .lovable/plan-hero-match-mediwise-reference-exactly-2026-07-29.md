# Hero — match MediWise reference exactly

Rebuild the mint background shape and image placement in `src/components/site/Hero.tsx` so it matches the reference screenshots pixel-close. No other files change.

## What's wrong now

- Current mint shape uses a soft Q-curve on the left edge. Reference uses **straight angled edges** — a leaning parallelogram-style panel.
- Current shape fills full height. Reference panel is **inset from top and bottom** with white gaps, and has a **small white rounded notch** cut into the bottom-right corner.
- Doctors image sits inside the panel. Reference image **breaks out** past the bottom edge into the white area.

## Shape spec (SVG path)

Single filled path, mint `#43D4B0`, `preserveAspectRatio="none"`, sized ~58% width, full height, anchored top-right.

```text
viewBox 1000 x 1000
- Top edge:    starts ~x=180 y=0  → straight to x=1000 y=0
- Right edge:  x=1000 y=0 → x=1000 y=950
- Bottom-right notch: small concave arc curving inward
  (approx x=1000 y=950 → arc → x=920 y=1000)
- Bottom edge: straight diagonal from x=920 y=1000 → x=60 y=920
- Left edge:   straight diagonal from x=60 y=920 → x=180 y=0
  (creates the leaning/tilted look)
```

Result: a tilted trapezoid tilted slightly counter-clockwise, with the top-left and bottom-left edges angled, and a small white bite out of the bottom-right corner.

## Decorative rings

Keep white outline concentric rings in current positions, but ensure at least one large ring sits **top-right partially clipped** and one sits **bottom-left inside the mint** — matches reference.

## Doctors image

- Anchor bottom-center of the mint panel.
- Allow image to extend ~80–120px **below** the panel's bottom edge (image z-index above the shape, container `overflow-visible`).
- Remove `mixBlendMode: multiply` — reference uses a clean cut-out PNG on mint; blend mode dulls it.
- Keep `object-contain object-bottom`, max-width ~620px.

## Left column

No changes to headline, paragraph, CTAs, or stats — those already match. Only spacing tweaks if needed after the shape change.

## Files

- `src/components/site/Hero.tsx` — replace the shape SVG `<path d="…">`, adjust image container to `overflow-visible` and drop `mixBlendMode`.

## Out of scope

Header, other sections, backend, routes — all untouched.
