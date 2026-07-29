# Fix equipment carousel images not showing on Vercel

## Problem

The 5 equipment images use Lovable CDN paths (`/__l5e/assets-v1/...`) via `.asset.json` pointers. Those URLs only resolve on `*.lovable.app`, not on the Vercel deployment — same failure mode already fixed earlier for the hero and other sections.

## Fix

1. Download the 5 originals from the Lovable CDN into `public/assets/equipment/`:
   - `ultrasound.jpeg`
   - `monitoring-1.jpeg`
   - `monitoring-2.jpeg`
   - `anesthesiology.jpeg`
   - `stethoscope.jpeg`
2. Update `src/components/site/EquipmentCarousel.tsx` to reference the static paths (`/assets/equipment/*.jpeg`) instead of importing the `.asset.json` pointers.
3. Delete the now-unused `.asset.json` files under `src/assets/equipment/` via `lovable-assets delete` so orphaned CDN objects are cleaned up.

No design, API, or layout changes — only the image source paths.
