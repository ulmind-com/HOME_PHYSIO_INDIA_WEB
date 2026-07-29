# Plan: Swap About/Welcome Section Layout

## Goal
Move the image to the **left side** and the text content to the **right side** in the `AboutWelcomeSection` on the home page.

## Changes
1. **Reorder the two-column grid in `src/components/site/AboutWelcomeSection.tsx`**
   - Image column: currently `order-1 lg:order-2` → change to `order-1 lg:order-1` so it sits on the left on desktop.
   - Text column: currently `order-2 lg:order-1` → change to `order-2 lg:order-2` so it sits on the right on desktop.
   - Mobile stacking order can remain image-first (image on top, text below) for readability.

2. **Reposition floating glass badges**
   - The badges currently anchor to the image edges (`-left-6`, `-right-2`). With the image now on the left, adjust badge placement so they do not overlap the text column on desktop. Keep them visually attached to the image card.

3. **Verify**
   - Run typecheck/build to ensure no errors.
   - Capture a preview screenshot to confirm the image is on the left and text on the right.
