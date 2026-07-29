# Plan: Fix the video testimonial section on the Services page

## Goal
Make the Services page video section show properly on the Lovable published link, use the admin-uploaded video, display the actual video preview instead of a color placeholder, and play in the correct 9:16 portrait format.

## What I verified
- The admin backend is returning one uploaded video named `abc` with a Cloudinary MP4 source under `video_file.url`.
- The Lovable published `/services` page contains the video section further down the page, but the visible card still needs the final Aroha-style layout and reliable playback behavior.
- The page currently has duplicate/older video-testimonial rendering on the Services page, which can make the visible section inconsistent.

## Implementation steps
1. **Clean up the Services page video area**
   - Keep only one video testimonial section in `/services`.
   - Remove the older inline/duplicate video block so the Aroha-style section is the only one shown.

2. **Make admin-uploaded videos render as real previews**
   - Use `video_file.url` as the primary playable source when `video_url` is empty.
   - If no thumbnail exists, show a muted `<video preload="metadata">` preview so the first frame appears instead of a teal placeholder.

3. **Force testimonial cards to support 9:16 portrait videos**
   - For the testimonial section, default the card to `aspect-[9/16]` so your uploaded portrait video looks correct immediately.
   - Keep metadata detection for mixed future uploads, but do not let the first render look like 16:9.

4. **Fix play behavior**
   - Ensure the play button opens the modal instead of behaving like a normal link.
   - In the modal, use the same resolved video source and show the video in a portrait-sized player for 9:16 uploads.
   - Reset the detected aspect when switching videos so old state cannot affect new videos.

5. **Match the reference section more closely**
   - Left side: keep the photo-wall image block at the same visual size.
   - Right side: use white rounded video cards, centered circular play button, name/category footer, and dots pager.
   - Remove any visible default/placeholder color card state when a real video source exists.

## Validation
- Check `/services` in the Lovable preview and published-style URL.
- Confirm the video card shows the real uploaded video frame.
- Click play and confirm the video opens and plays in a 9:16 modal.
- Confirm the section appears only once and stays connected to admin backend data.
