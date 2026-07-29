## Goal
Rebuild the video/testimonial section on the Home page to mirror the "What They Say About Aroha Cares" block from arohacares.com/services — decorative left panel + carousel of playable video cards on the right — driven entirely by the existing admin `videosQ` API, supporting both 9:16 (portrait/Shorts) and 16:9 (landscape) videos.

## Layout (matches reference)
```
┌─────────────────────┬──────────────────────────────────────┐
│                     │  What They Say About                 │
│   Decorative        │  Nupun Home Care                     │
│   image panel       │  (subtext, 2 lines)                  │
│   (tall rounded     │                                      │
│    card, ~4:5)      │  ┌──────────┐  ┌──────────┐          │
│                     │  │ video 1  │  │ video 2  │  ← cards │
│                     │  │  [▶]     │  │  [▶]     │          │
│                     │  │ name     │  │ name     │          │
│                     │  │ category │  │ category │          │
│                     │  └──────────┘  └──────────┘          │
│                     │       •  ○  ○  ○   (pager dots)      │
└─────────────────────┴──────────────────────────────────────┘
```
- Desktop: 5/7 or 5/12–7/12 split. Mobile: image on top, carousel below.
- Carousel: 2 visible cards on desktop, 1 on mobile, arrow + dot navigation, Framer Motion slide transitions.

## Aspect-ratio handling (9:16 + 16:9)
Video type has no aspect field, so infer per card:
- If `youtube_url` matches `/shorts/` → 9:16.
- Else if the raw `video_url` is a portrait file → measure `videoWidth/videoHeight` on `loadedmetadata` and cache.
- Else default → 16:9.
- Card container uses `aspect-[9/16]` or `aspect-video` based on that flag; grid keeps a uniform card **height** so mixed ratios sit neatly (portrait card is narrower/centered with soft blurred backdrop of the thumbnail filling the sides — same trick Aroha uses).

## Playback
- Click card → opens a full-screen modal (`Dialog`) with the correct aspect wrapper:
  - YouTube → `<iframe>` with `autoplay=1`, `youtube.com/embed/{id}` (handles both regular and Shorts IDs).
  - MP4 → native `<video autoplay controls playsInline>`.
- Close on backdrop / Esc.
- Preview thumbnail: use `v.thumbnail` if present, else derive from YouTube ID (`hqdefault.jpg`).

## Files to change
1. **New** `src/components/site/VideoTestimonialsSection.tsx` — the whole section: decorative image panel, header text, carousel state, pager dots, aspect detection, opens player modal.
2. **New** `src/components/site/VideoPlayerModal.tsx` — reusable modal with YouTube/MP4 branching + aspect wrapper.
3. **Update** `src/components/site/cards/VideoCard.tsx` — accept an `aspect` prop (`"9/16" | "16/9"`), render title + category overlay like the reference, no external link (click handled by parent).
4. **Update** `src/routes/index.tsx` — replace the current inline videos grid inside `BlogVideosSection` with `<VideoTestimonialsSection />`. Blog block stays untouched.
5. **Update** `src/routes/videos.tsx` — apply the same aspect-aware card + modal player so the dedicated Videos page also supports 9:16 and 16:9 playback (grid layout preserved).

## Data / admin connection
- Continues to read from `videosQ()` → `/api/public/proxy/videos` (existing FastAPI endpoint). No new endpoints, no mocks.
- Admin-uploaded fields consumed: `title`, `category`, `thumbnail`, `youtube_url`, `video_url`, `duration`.
- Nothing hardcoded — if admin uploads 0 videos the section renders an `EmptyState`; if admin uploads a Short (9:16), the card and modal switch automatically.

## Decorative left image
- Reuse an existing asset (e.g. a warm care-moments image) placed at `public/assets/testimonials-wall.jpg`. If none suits, generate one (soft photo collage feel, warm tones, portrait crop). Rounded `2rem`, subtle shadow — matches the reference's "photo wall" energy without copying their exact artwork.

## Out of scope
- No backend changes, no new admin fields, no changes to header/hero, no changes to service cards.
