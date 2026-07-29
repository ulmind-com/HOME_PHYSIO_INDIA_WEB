# Full Redesign: Nupun Home Health Care

Goal: Rebuild the entire public website as a luxury, award-worthy digital product. Backend (FastAPI) and Admin Panel stay untouched — every section still reads from the existing `/api/v1/*` endpoints via the current proxy.

## Design language

- Typography: Clash Display (headings) + Inter (body), loaded via `<link>` in `__root.tsx`. Oversized editorial headings, tight tracking, generous line-height for body.
- Palette: keep tokens (#33C4C7 / #1F8E94 / #0F172A / #F8FCFC / #FFFFFF / #DDEEEE / #EAF6F6). Layer whites and glass; color used sparingly as accent.
- Surface system: soft shadows, 20–32px radii, frosted glass, subtle mesh gradients, grain overlay, floating cards with parallax.
- Motion: Framer Motion + Lenis smooth scroll + GSAP ScrollTrigger for section reveals; magnetic buttons, cursor glow, tilt on cards, animated counters, blur/scale page transitions.
- No two sections share the same layout. Every card family is bespoke per page.

## Global shell

- `__root.tsx`: add Lenis provider, custom cursor, page transition wrapper, font links, refreshed JSON-LD.
- `Header`: liquid-glass pill nav (kept), refined type, magnetic CTA, mega-menu on Services.
- `Footer`: editorial multi-column, large wordmark, live settings/social from `/settings`.

## Pages

1. Home (`/`)
   - Hero: full-viewport editorial split — huge Clash headline, emotional sub, primary CTA + phone. Right side: layered glass cards (live "next available slot", verified caregivers, rating) floating over a soft mesh + doctor cutout. Mouse-parallax, animated stats counters, particle motes.
   - Trust marquee (Google Reviews rating from `/google-reviews`).
   - Services preview: asymmetric bento pulling `/services` (featured + 4 tiles).
   - "How it works": horizontal scroll pinned section (GSAP).
   - Equipment teaser: 3-up premium catalog cards from `/equipment`.
   - Video testimonials: keep Aroha-style section (already built) with polish.
   - Blog editorial strip from `/blogs`.
   - FAQ preview + CTA band.

2. About — editorial long-form, timeline, team grid (from settings/media).

3. Services list (`/services`) — luxury bento, sticky category rail, magnetic cards.
   Detail (`/services/$slug`) — magazine layout: hero image, sticky booking card, inclusions, FAQ, related services.

4. Equipment list — premium catalog grid with filters.
   Detail — gallery + specs + rental CTA → prefilled booking.

5. Careers list + detail — clean job board, apply form (multipart resume) to existing endpoint.

6. Blog list — magazine grid (feature + masonry).
   Detail — long-form reading experience, large type, TOC, share.

7. Videos (`/videos`) — Netflix-style rails by category, hover-preview cards, modal player (existing) with 9:16 & 16:9 support.

8. Testimonials — luxury carousel + wall of quote cards; ratings animate in.

9. FAQ — premium accordion, category tabs.

10. Contact — split: glass form (POST `/contact`) + map + settings info + WhatsApp/Call magnetic buttons.

11. Booking (`/booking`) — full redesign as multi-step wizard:
    Steps: (1) Service (from `/services`), (2) Care type & schedule (date/time pickers), (3) Patient details, (4) Contact & confirm. Animated progress bar, floating labels, glass fields, validation (zod + RHF), success state with confetti/check animation. Submits to `POST /api/v1/bookings` unchanged.

## Data / API

- No backend changes. All reads go through existing `src/routes/api/public/proxy.$.ts` → `nupun-health-backend.onrender.com`.
- Reuse `src/lib/api/queries.ts`; add missing queries only if a page needs them (e.g. google-reviews, testimonials list).
- TanStack Query `ensureQueryData` in route loaders, `useSuspenseQuery` in components.

## Technical section

- New deps: `lenis`, `gsap` (+ ScrollTrigger), `@fontsource-variable/inter` or `<link>` for Clash Display + Inter via Fontshare/Google.
- Keep `framer-motion`. Skip Three.js unless a section explicitly needs it (hero uses CSS/SVG "3D-feel" for perf); R3F only added if we build a real 3D object.
- New shared primitives in `src/components/site/ui/`: `MagneticButton`, `TiltCard`, `Cursor`, `Reveal` (upgrade existing), `Counter`, `Marquee`, `SmoothScroll`.
- Refactor `styles.css`: add Clash Display font-family token, new shadow/glass utilities, grain + mesh utilities.
- Route files rewritten page-by-page; card components under `src/components/site/cards/` replaced with bespoke variants per page (no shared generic card).
- Accessibility: respect `prefers-reduced-motion`, keyboard focus rings, semantic landmarks, alt text from admin `image.alt`.
- SEO: per-route `head()` unique titles/descriptions/OG; JSON-LD MedicalBusiness on home, Article on blog detail, FAQPage on FAQ, Service on service detail.
- Performance target: Lighthouse 95+. Lazy-load below-fold sections, `loading="lazy"` images, responsive `srcset` via Cloudinary URL params where available, preloaded hero image, code-split heavy libs (GSAP/Lenis client-only).

## Build order

1. Foundations: fonts, tokens, Lenis, cursor, magnetic/tilt primitives, page transition.
2. Header + Footer refresh.
3. Home hero + trust + services bento.
4. Booking wizard (highest-value fix).
5. Services list/detail.
6. Equipment list/detail.
7. Blog list/detail.
8. Videos, Testimonials, FAQ, Contact, About, Careers.
9. SEO/JSON-LD pass + perf pass.

## Out of scope

- No backend, schema, or admin changes.
- No new auth or user accounts.
- No payments.
