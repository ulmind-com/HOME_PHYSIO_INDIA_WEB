# Hero — exact MediWise shape + transparent nurse/patient photo

Match the reference screenshot's right-panel shape precisely and swap the doctors photo for the newly uploaded transparent PNG (nurse checking elderly man's blood pressure).

## Shape (from reference)

Right panel is a tilted quadrilateral, NOT rounded:
- Top edge: straight, full width
- Right edge: straight, vertical, full height
- Bottom edge: straight diagonal — rises from left to right (bottom-right corner sits higher than bottom-left)
- Left edge: straight diagonal — top-left is inset to the right of bottom-left (panel leans)
- All four corners are sharp (no rounding, no curves)
- Small decorative outline rings scattered inside the mint area (top-right cluster + one bottom-right outside)

Rewrite `HeroShape.tsx` path:

```text
viewBox 0 0 600 600, preserveAspectRatio="none"
M 60 0        // top-left (inset right)
H 600         // straight top
V 560         // straight right, stops above bottom
L 0 600       // diagonal bottom rising left→right (reversed: right side higher)
Z             // straight left edge back to (60,0), producing the lean
```

Corrected reading of reference: bottom-LEFT is lower than bottom-RIGHT. Path becomes:
`M 60 0 H 600 V 520 L 0 600 Z` — top straight, right straight to y=520, diagonal down-left to (0,600), left edge diagonal up to (60,0). No arcs, no rounded corners.

Remove the linear gradient — reference uses a flat mint fill `#43D4B0` (slightly lighter, closer to `#4ED9B8`). Keep `<clipPath>` + `<image>` structure so the transparent PNG is clipped to the shape.

## Decorative rings inside the mint panel

Add 4–5 white/light-mint outline circles as `<circle>` elements inside the SVG, clipped by the same path so they only appear inside the mint area. Positions approximated from reference:
- large ring top-right (~cx 500 cy 120 r 55, stroke rgba(255,255,255,0.35))
- medium ring upper-mid (~cx 380 cy 180 r 32)
- small ring mid-left (~cx 200 cy 260 r 18)
- tiny ring lower-mid (~cx 340 cy 480 r 14)

Keep the existing outside-panel decorative rings in `Hero.tsx` as-is.

## Image swap

Upload the new transparent PNG as a Lovable asset and use its CDN URL:

```bash
lovable-assets create \
  --file /mnt/user-uploads/Get_professional_and_compassionate_elderly_care_at_home_in_Ranchi_1_-Picsart-BackgroundRemover.jpeg \
  --filename hero-nurse-patient.png \
  > src/assets/hero-nurse-patient.png.asset.json
```

In `Hero.tsx`:
- Import the asset JSON, pass `imageUrl={heroAsset.url}` to `<HeroShape/>`.
- Remove the old `/assets/hero-doctors-team.png` reference.

In `HeroShape.tsx`:
- `<image>` uses `preserveAspectRatio="xMidYEnd slice"` so the subjects sit at the bottom of the panel (matching reference where the clipboard/hands extend to bottom edge).

## Files changed

- `src/components/site/HeroShape.tsx` — new path (sharp corners, no gradient), flat mint fill, inner decorative rings, image alignment `xMidYEnd slice`.
- `src/components/site/Hero.tsx` — import new asset JSON, update `imageUrl` prop and alt text.
- `src/assets/hero-nurse-patient.png.asset.json` — new asset pointer created via `lovable-assets`.

## Out of scope

Left column text, header, other sections, backend — untouched.
