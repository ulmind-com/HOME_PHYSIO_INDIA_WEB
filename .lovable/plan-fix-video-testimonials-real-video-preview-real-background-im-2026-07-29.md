# Fix video testimonials — real video preview + real background image

Three targeted fixes on the existing video testimonials section (used on Home and Services).

## 1. Show the actual video as the card preview (not a colored placeholder)

Right now `VideoCard` only renders an image when `thumbnail` or a YouTube ID is available. Admin-uploaded videos have `video_url` but usually no thumbnail, so the card falls back to the teal gradient (that's why you see the flat color with just "abc").

Update `src/components/site/cards/VideoCard.tsx`:
- If there is no `thumbnail` and no YouTube ID but `video_url` exists, render a muted, non-controls `<video src={video_url} preload="metadata" playsInline muted>` as the preview. This shows the real first frame of the uploaded video by default.
- Keep the existing image path for YouTube/thumbnail cases untouched.
- Keep the play button overlay + title on top.

## 2. Play the video properly when clicked

`VideoPlayerModal` already handles direct `video_url` playback with `<video controls autoPlay>` inside a large 16:9 (or 9:16) rounded stage. The click-to-play wiring is already in place — no change needed there. Once fix #1 lands, tapping the card opens the same modal and the video plays full-size on screen.

## 3. Real background image behind "Real families. Real recoveries."

The left panel in `VideoTestimonialsSection` points to `/assets/testimonials-wall.jpg`, but that file doesn't actually exist in `public/assets/`, so the browser renders the teal fallback color you see.

- Generate a warm, editorial image of a caregiver-with-family / hands-holding moment (soft light, muted tones) sized 800x1024 and save it to `public/assets/testimonials-wall.jpg`.
- Keep the existing overlay treatment in `VideoTestimonialsSection` (dark gradient + serif heading + quote glyph) so the text stays readable on top of the photo.

No backend, API, or admin-panel changes. Same `videosQ` data source, same modal player.
