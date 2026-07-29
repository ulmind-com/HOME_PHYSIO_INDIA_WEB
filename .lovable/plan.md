# Match the hero exactly to the supplied MediWise-style reference

## Goal
Rebuild only the homepage hero so it visually matches the screenshot much more closely: white rounded hero card, nav sitting inside the card, left-side copy/stats, and a right-side teal SVG image panel with the same angled geometry and photo placement.

## What will change
- Rework the hero wrapper into a large centered white card on a teal page background, matching the reference proportions and spacing.
- Move the hero layout closer to the screenshot:
  - left content starts lower under the nav,
  - heading width and line breaks match the reference,
  - CTAs and stats sit in the same vertical rhythm,
  - right image panel occupies the upper/right side without sticking to the browser edge.
- Replace the current right SVG path with a closer hand-crafted SVG path:
  - straight top edge,
  - vertical right edge,
  - slanted left edge,
  - diagonal bottom edge,
  - smooth rounded bottom-left transition like the screenshot,
  - no CSS `border-radius` or `clip-path: polygon()` for the panel shape.
- Clip the uploaded nurse/patient transparent image inside the SVG and tune its `x/y/width/height` so the people sit on the shape like the reference instead of touching the right edge.
- Keep the shape color tied to the website theme token, not a random hardcoded color.
- Keep all backend/Admin Panel/API connections unchanged.

## Technical details
- Update `src/components/site/HeroShape.tsx` to use an SVG `<clipPath>` with a new custom `<path>` approximating the reference shape, including the rounded lower-left curve.
- Update `src/components/site/Hero.tsx` layout classes so the hero card, right panel size, and image spacing match the screenshot at the current desktop viewport.
- Replace raw hardcoded mint utility colors in the hero where practical with existing semantic theme tokens so the hero remains theme-consistent.
- Verify in the live preview at the current desktop size that the image no longer sticks to the right and the SVG shape matches the screenshot hierarchy.

## Scope guard
- No backend changes.
- No Admin Panel changes.
- No API/mock data changes.
- No redesign of sections below the hero.