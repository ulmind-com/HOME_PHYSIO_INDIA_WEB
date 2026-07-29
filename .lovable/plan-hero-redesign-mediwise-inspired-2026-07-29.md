# Hero redesign — MediWise-inspired

Rebuild the home hero to match the reference's structure and premium feel without copying it verbatim. Keep the existing backend wiring (services, review summary) and the current floating liquid‑glass navbar.

## Layout

Two-column hero inside a large white rounded content card (radius 32px) that sits on a soft mint/teal gradient page background with abstract circular decorations.

```text
┌─────────────────────────────────────────────────────────────┐
│  soft mint gradient + floating circles                      │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ WHITE CARD  (rounded-[32px], soft shadow)             │  │
│  │  [nav overlays above]                                 │  │
│  │                                                       │  │
│  │  LEFT 45%                    RIGHT 55%                │  │
│  │  • eyebrow pill              • angled mint panel      │  │
│  │  • H1 3–4 lines (Clash)      • cut-out caregiver img  │  │
│  │    accent word in teal       • floating ring shapes   │  │
│  │  • supporting paragraph      • small glass badge      │  │
│  │  • Primary CTA (Book)          (Verified / Rating)    │  │
│  │  • Secondary CTA (Call, icon)                         │  │
│  │  • Stats row: 3 glass cards                           │  │
│  │    (Families, Rating, Response)                       │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

Fits within one viewport on desktop (min-h ~92svh). Stacks on tablet/mobile: text card first, image panel below.

## Visual style

- Background: soft teal→mint radial/linear gradient with 2–3 large blurred circles and outline ring SVGs (original assets, not copied).
- Content card: white, `rounded-[32px]`, subtle shadow, ~64px padding.
- Right panel: mint fill with an angled left edge (clip-path) so the caregiver image appears to "break out" — geometric feel from the reference, original shape.
- Glassmorphism on badges + stat cards (`bg-white/60 backdrop-blur-xl` with hairline border).
- Typography: Clash Display for H1 (clamp 44–72px), Inter for body/labels. Accent word italic teal.
- Buttons: pill-shaped. Primary = filled teal gradient with soft glow on hover. Secondary = white/glass outline with phone icon and micro-scale on hover.

## Content & data

- Headline: "Compassionate care, delivered at home." (accent: "at home")
- Sub: short 1–2 line supporting copy.
- Stats (live where available):
  - Families served — static/config number
  - Rating — from `reviewSummaryQ` (fallback 4.9)
  - Response time — static ("< 30 min")
- Primary CTA → `/booking`. Secondary CTA → `tel:` link from site settings if present, else `/contact`.
- Image: reuse `public/assets/hero-care.jpg` (already in project).

## Motion (Framer Motion)

- Staggered fade-up for eyebrow → H1 → paragraph → CTAs → stats.
- Image: scale/opacity entrance + slow parallax on scroll.
- Floating circles: infinite subtle y/x drift (6–10s, ease-in-out).
- Buttons: hover lift + magnetic effect (reuse `MagneticButton`).

## Responsive

- ≥1024px: two-column as above.
- 768–1023px: single column, image panel becomes a wide banner under CTAs, stats in 3-col row.
- <768px: single column, stats become horizontal scroll or 3-col compact, right panel simplified (no clip-path angle, just rounded).

## Files to change

- `src/components/site/Hero.tsx` — full rewrite for new layout, shapes, motion.
- `src/routes/index.tsx` — wrap hero section with the mint gradient + decorative circles background; ensure header overlay still works.
- `src/styles.css` — add helper utilities if needed (mint gradient token, ring-decoration animation keyframes).
- No changes to backend, API client, admin panel, or other routes.

## Out of scope

- No changes to services/videos/other sections.
- No new dependencies.
