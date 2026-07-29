# Fix: Hero image not showing on Vercel

## Problem

The hero shows only the alt text ("Compassionate home healthcare — nurse with elderly patient") on `nupun-health-frontend.vercel.app`. The image itself is broken.

Root cause: `src/components/site/Hero.tsx` imports `hero-care.jpg.asset.json`, whose URL is `/__l5e/assets-v1/...`. That path is served by Lovable's CDN infrastructure only. On Vercel there is no `/__l5e/*` route, so the request 404s and the browser renders the alt text.

The same project already hosts hero imagery under `public/assets/` (e.g. `hero-doctor.jpg`) which works on any host because Vercel serves `public/` at the site root.

## Fix

1. Move the hero photo out of the Lovable Assets CDN and into `public/assets/hero-care.jpg` so it is served as a static file by whichever host is running the site (Lovable preview and Vercel).
2. Update `src/components/site/Hero.tsx`:
   - Remove `import heroCare from "@/assets/hero-care.jpg.asset.json"`.
   - Set `<img src="/assets/hero-care.jpg" ... />`.
3. Delete the now-unused `src/assets/hero-care.jpg.asset.json` pointer via `lovable-assets delete` so the CDN object is cleaned up.

No other files, layout, styling, or API wiring change.

## Technical notes

- `public/*` files are copied verbatim to the deployed site root by Vite, so `/assets/hero-care.jpg` resolves identically on localhost, Lovable preview, and Vercel.
- The image is ~66 KB, well within an acceptable static-asset size; no need to keep it on the CDN.
