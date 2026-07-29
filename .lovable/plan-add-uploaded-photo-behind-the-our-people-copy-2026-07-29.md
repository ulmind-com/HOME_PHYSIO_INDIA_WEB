# Add uploaded photo behind the "Our people" copy

Place the uploaded caregiver + elderly-man photo as a decorative backdrop behind the left column of the Professionals section (headline, features, CTA). The 2×2 image grid on the right stays exactly as it is.

## What changes

- Upload `Skilled_Nursing-2.jpeg` to Lovable Assets (`src/assets/professionals-backdrop.jpeg.asset.json`).
- In `src/components/site/ProfessionalsSection.tsx`, wrap the LEFT column in a `relative` container and add an absolutely-positioned decorative layer behind the text:
  - The uploaded photo, `object-cover`, sized to fill the column.
  - Rounded 3xl, subtle border, soft shadow — matches the current medical-glass aesthetic.
  - A readability treatment on top: white/surface gradient (`from-background via-background/85 to-background/40`) plus a faint mint tint, so headline, paragraph and feature rows remain fully legible.
  - Slight scale-in / fade-in on view via Framer Motion, consistent with existing reveals.
- Text, features list, badge, and "View More About Us" button keep their current markup and animations — only the container gains `relative` and a new backdrop layer as its first child (behind content via `-z-10` / stacking).
- Admin override: read `settings.professionals_backdrop` if present, else fall back to the uploaded asset URL — so the image can be swapped from the admin panel later.

## Technical notes

- Use `lovable-assets create --file /mnt/user-uploads/Skilled_Nursing-2.jpeg --filename professionals-backdrop.jpeg` to generate the pointer.
- Backdrop layer: `absolute inset-0 -z-10 rounded-[2rem] overflow-hidden` containing the `<img>` and the gradient overlays.
- Ensure the left column has enough padding (`p-6 md:p-10`) so text doesn't sit flush against the image edges.
- No API/business-logic changes; presentation-only.
