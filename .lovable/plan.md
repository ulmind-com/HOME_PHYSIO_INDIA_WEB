# Match video testimonials section to Aroha reference exactly

Rework the "What They Say About Nupun Home Care" section on Home + Services so it mirrors the uploaded Aroha screenshot pixel-for-pixel in structure, spacing, and styling. Data stays wired to the admin `videosQ` API and the existing modal player.

## Visual changes

Left panel (decorative wall):
- Replace the current warm caregiver photo with a new wood-plank "photo wall" style image: brush-lettered headline "What They Say About Nupun ♥ Care", framed family photos, sticky-note thank-you cards, small whiteboard with "Community, Compassion, Connection", potted plant + chair corner. Generate as `public/assets/testimonials-wall.jpg` at 800x1024, warm wood tones.
- Remove the dark gradient overlay + serif heading + quote glyph that currently sit on top. The image itself carries the headline in the reference, so the left panel becomes just the rounded image, no text overlay.
- Keep aspect `4/5`, `rounded-[2rem]`, soft shadow.

Right panel (header + carousel):
- Remove the small teal "Testimonials" eyebrow.
- Headline becomes two lines, left-aligned, heavy sans (not serif) to match reference: `What They Say About` on line 1, `Nupun Home Care` on line 2 in the brand red/primary accent.
- Subcopy: "Our members value the peace of mind our caregivers provide. Hear their stories below." muted, two lines.
- Cards: 2-up on desktop, 1-up on mobile (unchanged count). Card visuals updated:
  - `rounded-2xl` white card with soft shadow and thin border.
  - Media area is 16:9-ish landscape with the real video preview (already implemented) but with a centered white circular play button with a red/primary triangle (reference uses solid white circle + colored play icon).
  - Under the media, a white footer strip inside the same card: bold name (from `video.title`), italic muted category line (from `video.category`).
  - No dark gradient across the media, no floating duration chip in this variant, no title overlaid on the image.
- Pager: remove the prev/next chevron buttons. Keep only the dot row, centered under the cards. Active dot = filled primary, inactive = light gray. Wider active dot like reference.

## Files to touch

- `src/components/site/VideoTestimonialsSection.tsx` — restructure layout, remove eyebrow, change headline styling, drop chevrons, center dots, drop overlay on left panel.
- `src/components/site/cards/VideoCard.tsx` — add a new `variant="testimonial"` (or a sibling `VideoTestimonialCard`) that renders the white-card + footer style described above, keeping the real-video preview fallback and click-to-open-modal wiring. The existing full-bleed variant stays for `/videos` page and other places.
- `public/assets/testimonials-wall.jpg` — regenerate to the wood-plank photo wall look.

## Out of scope

- No backend / admin panel changes. Same `videosQ` source, same `VideoPlayerModal` (still 9:16 for Shorts, 16:9 otherwise).
- `/videos` page grid is unchanged.
