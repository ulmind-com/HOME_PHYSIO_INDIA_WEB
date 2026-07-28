## Goal
Match the reference hero exactly: a rounded hero card with a soft mint/teal ambient background, the doctor photo positioned on the RIGHT side of the card (not full-bleed), bold "Your Health, Our Priority" heading + short subtitle on the LEFT, and a white pill booking bar (Department / Doctor / Date / Book Now) overlapping the bottom of the card.

## Changes — `src/routes/index.tsx` (Hero only)

**Card structure**
- Rounded `rounded-[2.5rem]` card with mint gradient background (current `--primary-soft` tones), min-height ~620px, `overflow-hidden`.
- Doctor image absolutely positioned to the RIGHT half only: `absolute right-0 top-0 h-full w-[55%] object-cover object-left`, with a left-edge fade mask (`mask-image: linear-gradient(to right, transparent, black 15%)`) so it blends into the mint background — matching how the reference photo dissolves into the teal on its left edge.
- On mobile (`<lg`): image drops to bottom half, text stacks on top.

**Text block (left)**
- Positioned in a relative content layer, left-aligned, vertically centered, `max-w-md`.
- Heading: "Your Health,<br/>Our Priority" — same bold sans, `text-5xl md:text-6xl lg:text-7xl`.
- Short subtitle (2 lines): "Compassionate care for you and your family — verified nurses and hospital-grade equipment, delivered home."
- Keep Book Appointment (filled teal pill) + Explore services (outline pill) buttons below.

**Booking bar**
- Keep the existing white rounded pill bar overlapping the card's bottom edge (`-mt-14`), full width inside container.
- Same 3 fields (Service / Care type / Date) + teal "Book Now" pill — already wired to `/booking` and live services query.

## Out of scope
Header, other sections, styles.css, backend — no changes.
