Add the existing Aroha-style `VideoTestimonialsSection` to the Services page while keeping it on Home.

## Changes
- **`src/routes/services.index.tsx`**: Import `VideoTestimonialsSection` and render it between the process/timeline section and the dark teal CTA band. It will use the same live `videosQ` admin data and the same aspect-aware modal player (9:16 / 16:9) already wired on Home.

## Notes
- No new components, assets, or API calls — reuses what's already built.
- No backend changes; admin-uploaded videos automatically appear on both Home and Services.