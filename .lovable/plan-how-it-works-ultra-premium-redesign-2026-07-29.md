# "How It Works" — Ultra Premium Redesign

Replace the current "Care built on trust, not tricks." pillar grid with a signature **"Getting Started is Easy"** 3-step section — illustration on the RIGHT, animated timeline on the LEFT, with a unique SVG-crafted look on brand mint (not maroon like the reference).

## Visual direction

- Section eyebrow chip + big Clash Display headline "Getting Started is Easy" with the mint hand-drawn underline squiggle (reuses site pattern), and a short intro line.
- Layout: two-column, `lg:grid-cols-2`, illustration on the **right**, steps on the **left** (mobile stacks: steps first, illustration below).
- **Left column — animated 3-step timeline:**
  - Vertical connector: a hand-crafted dashed SVG path with a mint gradient stroke that "draws in" on scroll (framer-motion `pathLength` 0 → 1).
  - Each step is a horizontal row: big circular gradient-mint numeral badge on the left, title + description on the right.
  - Numeral badge: layered SVG — soft mint blob + inner glass ring + bold display numeral. Subtle floating idle animation.
  - On scroll, each row fades + slides in staggered; badge pops with a spring scale.
  - On hover: badge tilts / lifts, connector highlights.
- **Right column — illustration card:**
  - Big rounded-[2.5rem] card, mint gradient background (`from-primary-soft via-surface to-background`), inner ring, `shadow-float`.
  - Hero illustration image (admin-editable, see below) sits inside with a slight parallax float.
  - Decorative flourishes: dotted grid, a soft blob behind the card, a floating glass "Verified caregivers" chip, and a mini animated pulse ring — matches existing AboutWelcomeSection language for cohesion.
  - Unique custom SVG shape (crafted `<path>`) sits behind the image as a sculptural backdrop (like the hero shape idiom).

## Content (default copy)

1. **Book Consultation** — Tell us your needs online or over the phone. Our care expert will guide you.
2. **Get a Custom Plan** — We create a personalised care plan tailored to your specific requirements and schedule.
3. **Meet Your Caregiver** — We match you with a verified, trained, and compassionate caregiver from our team.

## Data & admin integration

- The 3 step texts are pulled from the existing `site_settings` if `how_it_works_steps` (JSON) is present; otherwise fall back to the defaults above. Zero backend change required — the component reads `settings` already fetched in the page and does an optional lookup.
- The illustration image resolves in this priority order:
  1. `settings.how_it_works_image` (admin-uploaded URL, if the field exists)
  2. Bundled asset `src/assets/how-it-works/hero.jpg.asset.json` (uploaded via `lovable-assets` from user's uploaded reference-style illustration OR a curated caregiver photo)
- This mirrors the pattern used by `AboutWelcomeSection` and `CategoryShowcasePremium`, so admins upload once through the existing settings/services panel and it appears here.

## Files

- **New:** `src/components/site/HowItWorksSection.tsx` — the full section.
- **New:** `src/components/site/HowItWorksBadge.tsx` — small SVG numeral badge component (layered blob + ring + numeral, 3 variant colours: primary, accent, primary-glow).
- **New asset pointer:** `src/assets/how-it-works/hero.jpg.asset.json` — created via `lovable-assets create --file /mnt/user-uploads/<selected-image>` from an existing curated project photo (e.g. reuse one of the `src/assets/services/*` nurse-companion images already in the repo, or a fresh one if the user provides).
- **Edit:** `src/routes/index.tsx` — replace `<WhyUs />` usage with `<HowItWorksSection />`, remove the `WhyUs` function and now-unused imports (`ShieldCheck`, `HeartPulse`, `Clock`, `Star`).

## Technical notes

- Reveal on scroll via existing `framer-motion` patterns (`whileInView`, staggered `custom` delays).
- SVG connector draws with `motion.path` + `pathLength` and `viewport={{ once: true }}`.
- Colours strictly via semantic tokens (`--primary`, `--primary-soft`, `--accent`, `--foreground`, `--muted-foreground`) — no hard-coded hex.
- Fully responsive: `grid-cols-1 lg:grid-cols-2`, illustration order flips on `lg:` so it stays right on desktop, below on mobile.
- Accessibility: numerals as `aria-hidden`, step titles as proper `<h3>`s, illustration `alt="How Nupun home care works"`.
- No new dependencies, no backend changes.
