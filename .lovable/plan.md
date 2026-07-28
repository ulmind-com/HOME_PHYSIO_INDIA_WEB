
# Nupun Home Health Care — Public Website Plan

A premium, luxury-medical marketing site that consumes the existing FastAPI backend at `https://nupun-health-backend.onrender.com`. No backend, no database, no auth — the site is 100% a public consumer of the existing REST APIs.

## Scope of pages

Public routes (each a TanStack Router file route with its own SEO `head()`):

- `/` Home
- `/about`
- `/services`, `/services/$slug`
- `/equipment`, `/equipment/$slug`
- `/careers`, `/careers/$slug`
- `/blog`, `/blog/$slug`
- `/videos`
- `/testimonials`
- `/faq`
- `/contact`
- `/booking` (general booking; service pages also deep-link with `?service=slug`)
- `/privacy`, `/terms`, `/refund-policy`

Shared chrome (header/nav/footer, mobile menu, cookie-safe smooth scroll) lives in `__root.tsx`.

## Backend integration

Confirmed live endpoints (from `openapi.json`). All reads are anonymous; three write endpoints are the only mutations used from the public site:

- Content (GET): `/api/v1/services`, `/api/v1/services/slug/{slug}`, `/api/v1/services/categories`, `/api/v1/equipment`, `/api/v1/equipment/slug/{slug}`, `/api/v1/equipment/categories`, `/api/v1/blogs`, `/api/v1/blogs/slug/{slug}`, `/api/v1/blogs/categories`, `/api/v1/videos`, `/api/v1/testimonials`, `/api/v1/faqs`, `/api/v1/careers`, `/api/v1/careers/slug/{slug}`, `/api/v1/careers/categories`, `/api/v1/reviews/summary`, `/api/v1/settings`, `/api/v1/settings/social`, `/api/v1/settings/seo`, `/api/v1/settings/seo/all`
- Public writes: `POST /api/v1/bookings`, `POST /api/v1/equipment/rentals`, `POST /api/v1/careers/applications` (multipart, resume), `POST /api/v1/contact`

Response envelope is `{ success, message, data: { items, ... } | {...} }` — the axios client will unwrap `data` automatically.

## Stack notes (adjustments to the requested list)

The project template is **TanStack Start + React 19 + Vite + Tailwind v4**. That changes a few library choices; everything else in the requested stack stays:

- Routing/SEO: TanStack Router file routes with `head()` per route (replaces React Helmet — same result, correctly SSR'd).
- No server functions, no Supabase, no auth. The backend is called directly from the browser via axios/TanStack Query.
- Kept: Framer Motion, GSAP + ScrollTrigger, Lenis, Three.js + R3F + Drei, shadcn/ui, React Hook Form + Zod, Axios, TanStack Query, Lucide, Swiper, Embla, Sonner (toasts).
- Spline only if a specific scene calls for it; otherwise pure R3F to keep bundle lean.

## Architecture

```
src/
  lib/
    api/
      client.ts            axios instance + response unwrap + retry + error toast
      queries.ts           queryOptions() factories per resource (services, blogs, ...)
      types.ts             typed models derived from OpenAPI response shapes
    seo/
      buildMeta.ts         merges /settings/seo/{page} with per-route defaults
      schema.ts            JSON-LD builders (MedicalOrganization, Article, FAQ, Breadcrumb)
    motion/
      lenis-provider.tsx   client-only Lenis, respects reduced-motion
      cursor.tsx           mouse follower + glow, disabled on touch
      magnetic.tsx         magnetic button wrapper
      reveal.tsx           text/scale/fade reveal primitives (Framer + GSAP ScrollTrigger)
  components/
    layout/  Header, Footer, MobileNav, Announcement
    home/    Hero3D, Stats, ServiceGrid, WhyUs, EquipmentStrip, CareTeam,
             TestimonialsMarquee, LatestBlogs, LatestVideos, FaqPreview,
             GoogleReviews, ContactCTA
    services/ ServiceCard, ServiceHero, ServiceDetail, BookingSidebar
    equipment/ EquipmentCard, EquipmentDetail, RentalForm
    careers/  JobCard, JobDetail, ApplicationForm (multipart)
    blog/     BlogCard, BlogDetail, BlogGrid
    videos/   VideoCard, VideoLightbox
    forms/    BookingForm, ContactForm (Zod + RHF, shared field primitives)
    three/    FloatingMedicalScene (subtle R3F: caduceus/cross/pill capsules,
                                    soft bloom, reduced-motion fallback to static SVG)
    ui/       shadcn primitives (button, card, dialog, sheet, sonner, ...)
  routes/
    __root.tsx             providers, header/footer, Lenis, cursor, Sonner
    index.tsx              Home
    about.tsx, contact.tsx, booking.tsx, faq.tsx, testimonials.tsx, videos.tsx
    services.index.tsx, services.$slug.tsx
    equipment.index.tsx, equipment.$slug.tsx
    careers.index.tsx, careers.$slug.tsx
    blog.index.tsx, blog.$slug.tsx
    privacy.tsx, terms.tsx, refund-policy.tsx
  styles.css               design tokens below
```

Router already sets `defaultPreloadStaleTime: 0` — TanStack Query owns freshness. Each loader calls `context.queryClient.ensureQueryData(...)`; components use `useSuspenseQuery`.

## Design system

Tokens land in `src/styles.css` (`@theme inline` + `:root`) using OKLCH equivalents of the provided hex palette:

- `--primary` #33C4C7, `--accent` #1F8E94, `--secondary` #EAF6F6
- `--background` #F8FCFC, `--surface` #FFFFFF, `--border` #DDEEEE
- `--foreground` #111827, `--dark` #0F172A
- Gradients: `--gradient-hero` (mint→teal), `--gradient-glass` (translucent white/mint)
- Shadows: `--shadow-elegant`, `--shadow-glow` (teal glow), radii up to `--radius-3xl`
- Type: display serif (Fraunces or Instrument Serif) + Inter body, loaded via `<link>` in `__root.tsx`
- Reusable utilities: `.glass`, `.glass-strong` (backdrop-blur + border), `.hover-glow`, `.text-gradient`

Aesthetic: generous whitespace, hairline borders, soft teal gradients on white, restrained motion, one hero 3D moment per key page — deliberately not another dashboard-y template.

## Motion system

- Lenis smooth scroll mounted client-only in `__root.tsx`, disabled under `prefers-reduced-motion`.
- Custom cursor + glow + magnetic buttons (desktop pointer only).
- GSAP ScrollTrigger drives section reveals, parallax hero, counter numbers.
- Framer Motion for page transitions (`AnimatePresence` per outlet), card hovers, list stagger.
- R3F hero scene: soft floating medical shapes with bloom; static poster image as SSR/reduced-motion fallback.

## Forms (public writes)

- `BookingForm` → `POST /api/v1/bookings` (name, phone, email, service, address, preferred_date, notes) with Zod validation, TanStack Query mutation, Sonner success + inline error mapping.
- `RentalForm` → `POST /api/v1/equipment/rentals`.
- `ApplicationForm` → `POST /api/v1/careers/applications` as `multipart/form-data` with resume upload + progress.
- `ContactForm` → `POST /api/v1/contact`.

All forms share field primitives, loading skeletons, and success screens.

## SEO

- Per-route `head()` returns page-specific `title`, `description`, `og:*`, `twitter:*`, canonical.
- On mount, each page merges dynamic overrides from `/api/v1/settings/seo?page=...` and injects JSON-LD:
  - Sitewide MedicalOrganization + WebSite in `__root.tsx`
  - Article on `/blog/$slug`
  - FAQPage on `/faq`
  - BreadcrumbList on deep routes
- `robots.txt` and `sitemap.xml` generated from the known static routes (dynamic slugs deferred to a later pass).

## Performance & a11y

- Route-level code splitting (default in TanStack Start); Three.js scene lazy-loaded behind `<ClientOnly>`; Swiper/Embla dynamically imported per section.
- `loading="lazy"` + `decoding="async"` on images, `aspect-*` wrappers to avoid CLS.
- Skeletons for every async section; Suspense boundaries around detail pages.
- Semantic landmarks, single `<main>` per route, focus-visible rings, `aria-label`s on icon-only buttons, keyboard-navigable menus/dialogs via shadcn/Radix, reduced-motion honored throughout.

## Delivery order

1. Tokens, fonts, header/footer, Lenis + cursor, API client, query factories.
2. Home page (with 3D hero, all sections wired to live endpoints).
3. Services list + detail + BookingForm.
4. Equipment list + detail + RentalForm.
5. Blog list + detail; Videos; Testimonials; FAQ; Google Reviews.
6. Careers list + detail + multipart ApplicationForm.
7. Contact, Booking standalone, Privacy/Terms/Refund.
8. SEO polish (JSON-LD, sitemap, per-route meta), a11y sweep, performance pass.

## Open questions before I build

1. **Fonts**: OK to use Fraunces (display) + Inter (body) from Google Fonts, or do you want a specific pair (e.g. Instrument Serif, Söhne-style, GT Walsheim)?
2. **Hero 3D**: subtle floating medical shapes (cross, capsule, stethoscope silhouette) is my default. Prefer that, an abstract liquid-glass blob, or a Spline scene?
3. **Legal pages** (Privacy / Terms / Refund): the backend has no endpoint for these. Should I ship well-written placeholder copy tailored to a home-healthcare business in India, or leave them as "Coming soon" until you provide final copy?
4. **Contact info & address** for the footer/contact page — should I pull whatever `/api/v1/settings` returns as-is, or do you have specific phone/email/address to hardcode as a fallback if settings are empty?
