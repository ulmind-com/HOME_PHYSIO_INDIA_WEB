# Fix hero shape image not showing on GitHub/Vercel deployment

## Problem
The hand-crafted SVG hero shape (`HeroShape.tsx`) references the nurse/patient image through a Lovable CDN asset URL (`/__l5e/assets-v1/...`). This URL is only valid inside the Lovable sandbox preview. When the codebase is pushed to GitHub and deployed (e.g., Vercel), the image 404s and the shape appears empty/broken.

## Goal
Make the hero shape image load reliably on the Lovable preview, the GitHub repository, and any external deployment (Vercel) by using a static, source-controlled image file instead of the sandbox-only CDN URL.

## Steps

1. **Obtain the source PNG**
   - The current asset pointer is `src/assets/hero-nurse-patient.png.asset.json`.
   - Download or copy the actual `hero-nurse-patient.png` binary into the project so it can be committed.

2. **Move image to a static public folder**
   - Place the file at `public/assets/hero-nurse-patient.png`.
   - This makes it available at the absolute URL `/assets/hero-nurse-patient.png` in both Lovable preview and Vercel.

3. **Update the hero component**
   - In `src/components/site/Hero.tsx`, replace `heroTeam.url` (the Lovable CDN URL) with `/assets/hero-nurse-patient.png`.
   - Keep the `HeroShape` SVG clipping logic unchanged.

4. **Verify locally and on deploy**
   - Confirm the image renders inside the SVG shape in the Lovable preview.
   - After the next GitHub sync, confirm the image also loads on the Vercel deployment.

## Files to change
- `src/components/site/Hero.tsx` — switch image source to static path.
- Add `public/assets/hero-nurse-patient.png` — static image asset.

## Notes
- The existing `src/assets/hero-nurse-patient.png.asset.json` can remain as a reference, but the runtime image source must point to the public folder.
- No backend or admin-panel changes are needed; this is purely a frontend asset-path fix.
