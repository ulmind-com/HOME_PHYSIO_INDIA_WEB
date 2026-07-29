# Restore previous hero: split-fade doctor + liquid-glass nav + Quick Book bar

Revert the home hero from the "Aroha consultation-form" version back to the earlier split-fade version the user preferred. Only the home hero and the header treatment on `/` change — all other pages, API wiring, and admin integration stay exactly as they are.

## What comes back

- Full-viewport hero section on `/` (`min-h-[100svh]`, full-bleed, no container gutters).
- Mint-gradient background on the left; doctor photo (`src/assets/hero-care.jpg`) pinned to the right at ~58% width, feathered into the background via a `linear-gradient(to right, transparent 0%, black 18%)` CSS mask.
- Left column content (kept from the current hero, restyled on the mint background):
  - Editorial Clash Display headline "Trusted Home Healthcare Services at your door."
  - Italic tagline "Hospital-grade care with a human touch."
  - Short supporting paragraph.
  - Trust row: rating (from `reviewSummaryQ`), Certified Staff, 24/7 Available.
  - CTAs: "Book Trusted Care" → `/booking`, WhatsApp button (from `settingsQ`).
- Floating liquid-glass "Quick book" bar overlapping the hero's bottom edge:
  - Three fields — Service (from `servicesQ`), Care type (Home visit / Consultation / Equipment rental), Date.
  - "Book Now" navigates to `/booking` with the selected values as query params.
  - Styling: `bg-white/25`, `backdrop-blur-2xl`, soft top sheen, ring + float shadow.
- Header on `/` becomes a floating liquid-glass pill overlaying the hero (`absolute top-4 inset-x-0`), and switches to `fixed top-4` with a solidified glass once `window.scrollY > 20`. Other routes keep the header exactly as it is today.

## What is removed

- The right-side "Get Free Consultation" glass form card and its `/contact` submit flow inside the hero (the standalone Contact page form is untouched).
- The full-bleed dark image overlay currently on `/`.

## What stays untouched

- Backend, admin panel, all API queries and endpoints.
- All non-home routes and sections below the hero on `/` (TrustBar, Services, WhyUs, Equipment, Care team, Testimonials, Video testimonials, Blog, FAQ, Reviews, CTA).
- Booking wizard, video testimonials section, service cards, and every other redesign already shipped.

## Technical section

- Rewrite `src/components/site/Hero.tsx` to the split-fade layout described above; drop the consultation-form state, mutation, and inputs. Keep `servicesQ`, `reviewSummaryQ`, `settingsQ` usage for rating, phone, WhatsApp, and the Quick Book service list.
- Reintroduce a `QuickBookBar` block inside `Hero.tsx` (or a small sibling under `src/components/site/`) rendered absolutely at the bottom of the hero; on submit, `navigate({ to: "/booking", search: { service, careType, date } })`.
- Update `src/components/site/Header.tsx`: on route `/`, render as `absolute top-4 inset-x-0` overlay; on scroll > 20px switch to `fixed top-4` with stronger glass. Non-home routes keep the current behavior.
- `src/routes/index.tsx` continues to render `<Hero />` at the top; no other section order changes.
- Keep asset at `src/assets/hero-care.jpg` (already present). No new deps.
