## Goal

Rework the Home page hero and the site header to match the CarePlus Medical reference screenshot — clean mint/teal medical aesthetic, pill-shaped floating nav, big bold headline on the left, doctor+patient photo on the right, floating booking bar overlapping the bottom of the hero. Keep all existing backend/admin data flow intact (nothing changes in `src/lib/api/*` or the proxy route).

## Reference cues from the screenshot

- Soft mint page background, rounded hero container with subtle inner border
- Floating white pill nav at top: logo left ("CarePlus Medical" style — we keep "Nupun Home Health Care"), center links, teal pill "Book Appointment" CTA on the right
- Hero: left column — huge bold sans headline "Your Health, Our Priority", sub "Compassionate Care for You and Your Family". Right column — real photo of a doctor with a patient
- Bottom of hero: floating white card with 3 selects (Department / Doctor / Date) + teal "Book Now" pill button, overlapping the hero image
- Palette: mint/aqua background `#DFF3F1`-ish, teal accent `#2FB6AE`-ish, near-black text

## Changes

### 1. `src/components/site/Header.tsx`
- Convert to a floating pill navbar: wrap contents in a container with `mt-4`, white background, `rounded-full`, soft shadow, sitting above content (still `sticky top-4 z-50`)
- Logo: keep existing Nupun mark + wordmark, tightened
- Center nav links styled as inline text (Home / Services / Equipment / About / Contact — trim to match reference density; keep all routes reachable via mobile menu)
- Right side: single teal pill "Book Appointment" → `/booking` (replaces the current dark pill)
- Active link: teal text
- Mobile menu unchanged in behavior, restyled to match

### 2. `src/routes/index.tsx` — `Hero()` only
Replace the current split hero (`HeroScene` on right) with:
- Outer section with mint background token
- Rounded 3xl hero card containing:
  - Left: eyebrow chip (kept, optional), H1 "Premium care, delivered home." rendered in bold sans (keep current copy so backend/CMS isn't affected), supporting paragraph, existing CTAs
  - Right: doctor/patient hero image (generated via imagegen since no user asset supplied — realistic doctor+patient in clinic, warm, on mint background) using a local asset import
- Floating "Quick book" card overlapping the bottom edge:
  - 3 fields styled as selects: **Service** (populated from `servicesQ`), **Care type** (static: Home visit / Consultation / Equipment), **Date** (native date input)
  - Teal "Book Now" pill → navigates to `/booking?service=<slug>&date=<date>&type=<type>` (booking route already deep-links via search params)
- Remove usage of `HeroScene` on Home only (component file stays for reuse)

### 3. `src/styles.css`
- Add two tokens if missing: `--mint` (hero bg) and `--teal` (accent pill). Reuse existing `--primary`/`--accent` if they already match; otherwise add semantic tokens `--hero-bg`, `--cta`. No hardcoded hex in components.

### 4. Assets
- Generate `src/assets/hero-doctor.jpg` (standard quality) — "professional doctor in white coat consulting a smiling patient in a bright modern clinic, soft mint background, natural light, editorial photography"
- Import via ES6 in `index.tsx`

## Backend / admin panel

- No API changes. Header still reads `settingsQ()` for phone.
- Hero quick-book uses live `servicesQ()` results and forwards selection to `/booking` where the existing form (already wired to backend POST) handles submission. Admin-managed services list drives the dropdown automatically.

## Out of scope

- Other pages, footer, forms, and card components stay as-is.
- No changes to routing, API client, or admin integration.

## Files touched

- `src/components/site/Header.tsx` (rewrite)
- `src/routes/index.tsx` (Hero function only)
- `src/styles.css` (add tokens if needed)
- `src/assets/hero-doctor.jpg` (new)
