# Replace "Our people" stats grid with auto-scrolling people cards

The screen you're pointing at is the dark rounded section titled "Our people / Nurses, physios and doctors — handpicked." — that's `CareTeamSection` inside `src/routes/index.tsx` (not `ProfessionalsSection.tsx`). Its right column currently renders four dark stat tiles (120+, 45, 30, 200+). That's the "color shape" you want gone.

## Scope

One file: `src/routes/index.tsx` — only the `CareTeamSection` function. Left column (eyebrow, headline, intro, "Meet the team" CTA) stays exactly as-is.

## What changes

1. Delete the 4 stat tiles (`Registered Nurse / Physiotherapists / Doctors on panel / Care attendants`) from the right column.
2. Right column becomes a right-to-left auto-scrolling marquee of compact people cards, matching the pattern already built in `ProfessionalsSection.tsx`:
   - Card ~200–230px wide, 4:5 aspect, rounded-[1.75rem], full-bleed image with slow hover zoom.
   - Bottom gradient scrim + overlay: title (e.g. "Skilled Nursing") + one-line subtitle.
   - Liquid-glass pill button ("Book Now" → `/booking`) using `bg-white/20 backdrop-blur-xl border border-white/30`.
   - Framer Motion infinite marquee: `animate={{ x: ["0%", "-50%"] }}`, linear, `repeat: Infinity`, ~35s. Track = `[...items, ...items]`. Pause on hover. Left/right edge fade masks blending to the dark section background (`to-dark`, not `to-background`, so the fade matches the dark card).
3. Per-card entrance animation as each card scrolls into view from the right: overlay text + button fade-up with slight blur-to-clear (`whileInView`, `viewport={{ once: false, amount: 0.6 }}` so it re-triggers each loop pass).
4. Fully dynamic from admin panel:
   - Read `settingsQ()` → use `settings.professionals` or `settings.people` array of `{ image, title, subtitle, cta_label?, cta_href? }` when present.
   - Fallback to the 4 images already copied to `public/assets/people/`:
     - `skilled-nursing.jpg` → "Skilled Nursing" / "Trained nurses at home"
     - `senior-care.jpg` → "Senior Care" / "Companionship & mobility"
     - `physiotherapy.jpg` → "Physiotherapy" / "Movement & recovery"
     - `specialist-doctor.jpg` → "Specialist Doctors" / "Consult at home"

## Cleanup

Remove the now-duplicate `<ProfessionalsSection />` render from `src/routes/index.tsx` (it was rendering an extra "About Us / Professionals dedicated to your health" band right above this section). The file `ProfessionalsSection.tsx` itself stays on disk — just no longer mounted.

## Styling rules

Only design tokens (`var(--primary)`, `glass`, `text-gradient`, `shadow-elegant`, `bg-dark`). No purple, no hardcoded hex. Mobile: marquee stacks under the copy column, cards shrink to ~180px.

## Verification

- Build passes.
- The dark "Our people" section shows the 4 uploaded images auto-scrolling right-to-left with liquid-glass "Book Now" buttons and per-card fade-up animation.
- The stats tiles are gone.
- Uploading `settings.professionals` from the admin panel replaces the 4 defaults automatically.
