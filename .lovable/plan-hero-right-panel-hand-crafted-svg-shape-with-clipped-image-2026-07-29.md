# Hero right panel — hand-crafted SVG shape with clipped image

Replace the current mint panel (CSS clip-path + separate `<img>`) with a real SVG shape that clips the doctors photo inside it, matching the MediWise reference geometry.

## Shape geometry (from reference)

Reference panel: top and right edges straight, left edge slanted slightly inward (top-left sits right of bottom-left), bottom edge diagonal (rises left→right), bottom-left corner a large smooth rounded curve. Rough proportions from the reference: width ~600, height ~600, top-left ~x=87, bottom starts curving around y=482, big corner radius ~123, bottom edge ends near (544, 600), right edge height ~492.

SVG path (viewBox `0 0 600 600`):

```text
M 87.4771 0
H 600
V 492.035
L 147.253 600
H 125.577
C 55.3147 600 0 544.6885 0 476.423
V 87.4771 Z
```

- `M 87.4771 0` → top-left (slanted in)
- `H 600` → straight top
- `V 492.035` → straight right
- `L 147.253 600` → diagonal bottom
- `H 125.577` → tiny flat before curve
- `C … 0 476.423` → large smooth bottom-left corner (~R123)
- `V 87.4771 Z` → slanted left edge back up

## Files

1. `src/components/site/HeroShape.svg` — standalone SVG asset with the exact `<path>` above, `<defs>`, `<clipPath id="heroClip">`, and an `<image href="/assets/hero-care.jpg">` clipped by it, `preserveAspectRatio="xMidYMid slice"`. Kept for reference/reuse.
2. `src/components/site/HeroShape.tsx` — React component that renders the same SVG inline (so `href` can be prop-driven and it stays fully responsive via `width="100%" height="100%"` + `preserveAspectRatio="none"` on the outer svg while the inner `<image>` uses `slice`). Props: `imageUrl`, `className`, optional `fill` for the mint background layer behind the image.
   - Structure: outer `<svg viewBox="0 0 600 600" preserveAspectRatio="none">` → `<defs><clipPath id="heroClip"><path d="…"/></clipPath></defs>` → mint `<path d="…" fill="url(#heroGrad)"/>` (linear gradient teal→mint) → `<image href={imageUrl} … clipPath="url(#heroClip)" preserveAspectRatio="xMidYMid slice"/>`.
   - IDs suffixed with a `useId()` value so multiple instances don't collide.
3. `src/components/site/Hero.tsx` — right column swaps the current clip-path div + `<img>` for `<HeroShape imageUrl="/assets/hero-care.jpg" className="absolute inset-0 w-full h-full" />`. Floating "Verified" / "Rating" glass badges and decorative rings stay as-is, positioned over the SVG.

## Constraints honored

- No CSS `border-radius` or `clip-path: polygon()` for the panel shape.
- No PNG mask; clipping done entirely via SVG `<clipPath>`.
- Responsive: outer `<svg>` scales to container; inner `<image>` uses `xMidYMid slice` so the photo always fills without distortion even when the outer uses `none`.

## Out of scope

Left column, header, other sections, backend — untouched.
