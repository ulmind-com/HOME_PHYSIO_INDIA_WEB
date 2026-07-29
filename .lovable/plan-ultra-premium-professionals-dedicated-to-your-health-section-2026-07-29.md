# Ultra-premium "Professionals dedicated to your health" section

## Goal
Add a new section immediately after `HowItWorksSection` on the home page, inspired by the attached reference (About Us / Professionals). Keep Nupun's mint/teal theme (no purple), our design tokens, and connect to existing backend data. Must feel unique, editorial, and premium — not a copy-paste of the reference.

## Layout
Two-column editorial split inside `Section`:

- **Left column** — copy + feature list
  - Eyebrow: `stethoscope icon + "About Us"` in a soft glass chip
  - Display headline (Clash Display): "Professionals dedicated to your health"
  - Short intro paragraph
  - 3 feature rows, each with:
    - Custom hand-crafted SVG icon in a soft circular glass tile (unique per row — not lucide defaults)
    - Title + one-line description
    - Rows: "Patient-Centered Care", "Specialist Doctors", "24 Hours Service"
  - Primary pill CTA → `/about` ("View More About Us")

- **Right column** — layered image composition
  - Large tall rounded-image card (main nurse/patient photo) with a subtle inner border
  - Overlapping smaller rounded-image card top-left ("Video Call Support" style) with a dark caption strip at its bottom
  - Floating glass "Opening Hours" card bottom-right with a small clock badge
    - Mon–Fri, Saturday, Sunday rows
  - Decorative SVG layer behind the images: soft organic blob + thin concentric rings + dotted grid (all in `--primary` / `--accent` tints, low opacity)

All motion via Framer Motion: staggered fade-up for text/feature rows, scale-in for image cards, subtle float loop on the Opening Hours card and decorative rings.

## Data & admin panel
- **Copy, feature list, opening hours, and CTA target**: pulled from `settingsQ()` where fields exist (`about_short`, `opening_hours`, etc.). If a field is missing, fall back to premium hard-coded defaults so the section always looks complete.
- **Images**: 2 image slots (main + inset). Resolution order:
  1. `settings.about_main_image` / `settings.about_inset_image` (absolute URLs from admin panel)
  2. Local bundled fallbacks in `public/assets/about/` (`professionals-main.jpg`, `professionals-inset.jpg`) — reuse existing category/nurse imagery already in `public/assets/`.
- Admin panel already exposes settings + featured images through `/settings`; no backend changes. When the admin uploads new images there, they appear automatically. No new API contract invented.

## Files
- Create `src/components/site/ProfessionalsSection.tsx` (section + inline custom SVG icons + decorative background)
- Edit `src/routes/index.tsx` — insert `<ProfessionalsSection />` right after `<HowItWorksSection />`
- Reuse fallback images already in `public/assets/` (e.g. `hero-nurse-patient.png`, a category image for the inset). No new binaries required; if the user later wants distinct defaults, drop them into `public/assets/about/`.

## Styling rules
- Only design tokens: `var(--primary)`, `var(--accent)`, `var(--surface)`, `glass`, `text-gradient`, `shadow-elegant`
- No purple; the reference's indigo is re-expressed in our teal/mint palette
- Responsive: columns stack on mobile, Opening Hours card moves under main image, decorative SVGs scale down

## Verification
- Build passes
- Section appears directly under How It Works with no layout breakage
- Fallback images render on Vercel (static `/assets/...` paths, same fix pattern already used)
- Opening hours + copy swap in when admin panel provides them
