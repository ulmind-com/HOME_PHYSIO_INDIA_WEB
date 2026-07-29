# Restore Left Wall Image in Testimonials Section

Bring back the decorative wall image (`/assets/testimonials-wall.jpg`) that was on the left side of the "What They Say About Nupun Home Care" section, while keeping the compact size and the right-to-left auto-scrolling reels.

## Changes

Scope: `src/components/site/VideoTestimonialsSection.tsx` only.

- Two-column layout on `lg+`: left column (5/12) shows the wall image in a rounded card; right column (7/12) holds the compact heading + the right-to-left auto-scrolling reels marquee.
- On mobile/tablet, stack: image on top (smaller), then heading + marquee.
- Keep the section compact: smaller heading (`text-3xl md:text-4xl`), tighter vertical padding, reel cards at ~180–200px width, 9:16 aspect.
- Keep the infinite right-to-left marquee wired to admin-uploaded videos (`videosQ`), with edge fade masks and click-to-play via `VideoPlayerModal`.

No backend or admin panel changes.
