# Equipment carousel: add autoscroll and enlarge images

## What changes

1. **Verify & strengthen autoscroll** in `src/components/site/EquipmentCarousel.tsx`
   - Keep the existing 3.5s interval, pause-on-hover/focus, and visibility-change pause.
   - Add a short interaction pause so manual clicks on prev/next/dots stop the timer briefly and resume automatically.
   - Ensure the interval resets cleanly when `active` changes so the carousel never "stutters".

2. **Enlarge the carousel images**
   - Increase `slideWidth` from `230` to `300`.
   - Increase container height from `h-[560px]` to `h-[640px]` so the larger cards fit.
   - Keep `rotationStep` and `inactiveScale` balanced so the 3D perspective still looks premium.

3. **Fine-tune spacing**
   - Slightly increase the section vertical padding so the bigger carousel has room to breathe.

## Outcome

The Equipment section will automatically rotate through the five curated images with a smooth spring animation, and the slides will be noticeably larger and more impactful.
