# Fix: Images and illustrations missing on Vercel

## Problem

Every image on the Vercel deployment (`nupun-health-frontend.vercel.app`) is broken. The Lovable preview shows them fine.

Root cause: all image imports go through `.asset.json` pointer files, and each pointer's `url` is a Lovable-only relative path like `/__l5e/assets-v1/{id}/{filename}`. That path is served by Lovable's asset infrastructure. Vercel has no such route, so every image 404s.

Affected pointer files (10 total):
- `src/assets/hero-nurse-patient.png.asset.json`
- `src/assets/community-care.jpeg.asset.json`
- `src/assets/categories/{nursing,elder,physio,equipment}.jpg.asset.json`
- `src/assets/services/{physio,mobility,nurse-elder,nurse-companion}.jpg.asset.json`

Consumers: `Hero.tsx` (already uses `public/assets/hero-nurse-patient.png`), `HowItWorksSection.tsx`, `CategoryShowcasePremium.tsx`, `ServicesMarquee.tsx`.

## Fix

Move the binaries out of the Lovable CDN and into the app bundle so any host (Vercel, Lovable, custom) serves them.

1. For each `.asset.json`, download the binary from the Lovable CDN (`https://nupun-care-nexus.lovable.app{url}`) into `public/assets/...` preserving filenames.
2. Update the three components (`HowItWorksSection.tsx`, `CategoryShowcasePremium.tsx`, `ServicesMarquee.tsx`) to import from static `/assets/...` paths instead of `.asset.json` pointers.
3. Delete the now-unused `.asset.json` pointer files.
4. Run `bun run build` to confirm no broken imports.

## Notes

- Admin-panel-uploaded images (services, videos, blogs) already come through the API as absolute URLs and are unaffected.
- Only the built-in decorative assets shipped with the site need this fix.
- No design, layout, or backend changes.
