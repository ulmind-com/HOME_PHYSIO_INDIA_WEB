# Redesign "Our people" section — compact auto-scrolling people cards

Reshape the `ProfessionalsSection` so it feels lighter and more premium. Replace the layered shape/image composition on the right with a right-to-left auto-scrolling row of compact people cards. Keep the left copy column (eyebrow, headline, intro, feature list, CTA) but tighten spacing so the whole section is shorter.

## Scope

File: `src/components/site/ProfessionalsSection.tsx` only. No backend or admin panel changes.

## What changes

1. Compact section
   - Reduce vertical padding and shrink the display headline one step.
   - Keep left column: eyebrow chip, headline, intro, 3 feature rows, primary CTA.
   - Drop the layered main+inset image composition, decorative blob rings, and the floating "Opening Hours" glass card from the right column.

2. Right column becomes an auto-scrolling people marquee
   - Horizontal track of compact vertical cards (~220–240px wide, 4:5 aspect — shorter than before, not tall editorial slabs).
   - Each card:
     - Full-bleed image with slow zoom on hover.
     - Bottom gradient scrim for legibility.
     - Overlay text: role/name line (e.g. "Skilled Nursing" / "Home Physiotherapy") + one-line supporting copy.
     - Liquid-glass pill button ("Book Now" → `/booking`) using `bg-white/20 backdrop-blur-xl border border-white/30`.
   - Infinite right-to-left marquee via Framer Motion (`animate={{ x: ["0%", "-50%"] }}`, linear, repeat Infinity, duration scales with item count ~35s baseline). Track holds `[...items, ...items]`.
   - Pause on hover. Edge fade masks (left/right gradients to background) so cards fade in/out cleanly.

3. Per-card entrance animation
   - As each card enters the viewport from the right, its overlay text and button animate in with a small staggered fade-up + slight blur-to-clear (Framer Motion `whileInView` on each card's inner overlay, `viewport={{ once: false, amount: 0.6 }}` so it re-triggers each loop pass).

4. Fully dynamic, admin-driven
   - Data source: `settingsQ()` — read `settings.professionals` (or `settings.people`) as an array of `{ image, title, subtitle, cta_label?, cta_href? }`. If admin exposes a different field name already used elsewhere, reuse it; do not invent a new API contract.
   - When the settings array is empty/missing, fall back to a hard-coded default list of 4 people cards using the 4 uploaded images bundled into `public/assets/people/`:
     - `Skilled_Nursing.jpeg` → "Skilled Nursing" / "Trained nurses at home"
     - `Discover_Trusted_and_Best_Care_Senior_Services_at_Antara_Senior_Care.jpeg` → "Senior Care" / "Companionship & mobility"
     - `Therapists_for_Parkinson_s_Disease_Symptom_Management.jpeg` → "Physiotherapy" / "Movement & recovery"
     - `Crossroads_Chiropractic_Health_Center_Introduces_Advanced_Headache_Relief_in_West_Henrietta_Ne.jpeg` → "Specialist Doctors" / "Consult at home"
   - Images live under `public/assets/people/` (static paths, same Vercel-safe pattern already used across the site).

## Styling rules

- Only design tokens (`var(--primary)`, `var(--accent)`, `var(--surface)`, `glass`, `text-gradient`, `shadow-elegant`). No purple, no hardcoded hex.
- Responsive: on mobile the marquee sits below the copy column; card width shrinks to ~180px.

## Verification

- Build passes.
- Section is visibly shorter than the current version.
- Cards auto-scroll right-to-left, pause on hover, and text+button animate in per card.
- Uploading `settings.professionals` from the admin panel replaces the 4 defaults automatically.
