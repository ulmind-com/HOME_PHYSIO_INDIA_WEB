import { useId } from "react";

interface HeroShapeProps {
  imageUrl: string;
  className?: string;
  alt?: string;
}

/**
 * Hand-crafted SVG hero shape matching the MediWise reference:
 * - Top edge straight, right edge straight
 * - Bottom edge is a diagonal (bottom-left lower than bottom-right)
 * - Left edge diagonal (top-left inset right of bottom-left) — panel leans
 * - All four corners are sharp (no rounding, no arcs)
 * - Flat mint fill with white decorative outline rings inside the panel
 * - The transparent doctor/nurse PNG is clipped to the shape and anchored bottom
 */
export function HeroShape({ imageUrl, className, alt = "" }: HeroShapeProps) {
  const uid = useId().replace(/:/g, "");
  const clipId = `heroClip-${uid}`;

  // viewBox 0 0 600 600 — leaning trapezoid with softly rounded corners (r≈24)
  // Corners: TL(60,0) TR(600,0) BR(600,520) BL(0,600)
  const shapePath =
    "M84 0 H576 A24 24 0 0 1 600 24 V496 A24 24 0 0 1 578.4 519.9 L21.6 599.5 A24 24 0 0 1 0 575.7 V84 A24 24 0 0 1 22.6 60.1 Z";


  return (
    <svg
      className={className}
      viewBox="0 0 600 600"
      preserveAspectRatio="none"
      role={alt ? "img" : undefined}
      aria-label={alt || undefined}
      aria-hidden={alt ? undefined : true}
    >
      <defs>
        <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
          <path d={shapePath} />
        </clipPath>
      </defs>

      {/* mint fill */}
      <path d={shapePath} fill="#4ED9B8" />

      {/* decorative outline rings inside the mint panel */}
      <g clipPath={`url(#${clipId})`} fill="none" stroke="#ffffff" strokeOpacity="0.35" strokeWidth="2">
        <circle cx="500" cy="120" r="55" />
        <circle cx="380" cy="180" r="32" />
        <circle cx="205" cy="255" r="18" />
        <circle cx="340" cy="470" r="14" />
        <circle cx="545" cy="330" r="22" />
      </g>

      {/* clipped photo — anchored to the bottom of the panel */}
      <image
        href={imageUrl}
        x="0"
        y="0"
        width="600"
        height="600"
        clipPath={`url(#${clipId})`}
        preserveAspectRatio="xMidYMax slice"
      />
    </svg>
  );
}
