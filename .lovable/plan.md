# Our Services — Auto-scrolling Premium Marquee Redesign

Redesign the home page "Our Services" section into an ultra-premium, right-to-left auto-scrolling marquee of image cards, each with a "Book Now" CTA just below the image. Backend/admin panel untouched — cards render from the existing `servicesQ` list.

## Visual direction

- Right-to-left seamless marquee (CSS-only, duplicated track for infinite loop), pauses on hover.
- Each card ~320×460px: full-bleed service image on top (~65% height), custom SVG bottom shape that curves up into the image (unique hand-drawn wave, mint themed via `text-primary`), then title + short description + "Book Now" pill button.
- Premium touches: soft shadow-float, ring-1 border, index chip "01" top-left over image, small floating icon badge top-right, slow zoom on image hover, magnetic-style Book Now button that fills with primary on hover.
- Section header: eyebrow chip + "Our Services" headline with mint SVG underline squiggle (matches CategoryShowcasePremium style) + right-side "View all services" link.
- Left/right fade masks on the marquee edges so cards fade into the background.
- Decorative dotted grid + soft blob background, consistent with AboutWelcomeSection.

## Data & admin integration

- Cards come from `servicesQ({ limit: 12 })` — every service the admin adds appears automatically in the marquee (loop duplicates the list so even 3-4 services fill the row).
- Each card uses `service.featured_image`, `service.title`, `service.short_description`, `service.slug`.
- Book Now button links to `/booking?service=<slug>` (existing booking route); card image/title link to `/services/$slug`.
- Fallback: if a service has no `featured_image`, use one of 4 curated images bundled in `src/assets/services/` (uploaded via `lovable-assets` from the user's uploaded photos).

## Files

- New: `src/components/site/ServicesMarquee.tsx` — the marquee section (header + track + card).
- New: `src/components/site/ServicesMarquee.tsx` internally defines `ServiceMarqueeCard` with an inline SVG wave divider between image and text.
- New asset pointers in `src/assets/services/`: `nurse-elder.jpg.asset.json`, `nurse-companion.jpg.asset.json`, `physio.jpg.asset.json`, `mobility.jpg.asset.json` — created via `lovable-assets create --file /mnt/user-uploads/...`.
- Edit: `src/routes/index.tsx` — replace the current `<ServicesSection />` (grid of ServiceCard) with `<ServicesMarquee />`. Remove the now-unused `ServicesSection` function and `ServiceCard` import.

## Technical notes

- Marquee animation: CSS `@keyframes marquee-rtl` translating `-50%` over ~40s linear infinite; track renders `[...items, ...items]` for seamless loop. Pause via `group-hover:[animation-play-state:paused]`.
- Edge fade: `mask-image: linear-gradient(to right, transparent, black 6%, black 94%, transparent)`.
- SVG wave divider sits at the bottom edge of the image using absolute positioning + `preserveAspectRatio="none"`, fills with `var(--card)` so it blends into the text panel.
- Book Now uses Link to `/booking` with search params so admin-configured services drive prefill.
- Accessibility: marquee wrapper has `role="region" aria-label="Our services"`, respects `prefers-reduced-motion` (animation disabled).
- No new dependencies, no backend changes.
