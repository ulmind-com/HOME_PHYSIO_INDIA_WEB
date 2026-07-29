# Swap "Getting Started is Easy" illustration

Replace the current right-side illustration in the `HowItWorksSection` with the newly uploaded community-care illustration (two nurses caring for an elderly man in a wheelchair).

## Steps

1. Upload the image to Lovable Assets CDN:
   - `lovable-assets create --file /mnt/user-uploads/Illustration_der_vektorbezogenen_Gemeindepflege_Premium_KI-generierter_Vektor.jpeg --filename community-care.jpeg > src/assets/community-care.jpeg.asset.json`
2. In `src/components/site/HowItWorksSection.tsx`:
   - Import the new asset pointer instead of `nurse-companion`.
   - Use it as the default `image` value so the section renders the new illustration.
3. Leave the surrounding sculptural SVG backdrop, floating glass chips, motion, and admin `illustration` override prop untouched — admin uploads still win.

No other sections or files change.
