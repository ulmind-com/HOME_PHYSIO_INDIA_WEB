import { useId } from "react";

interface HeroShapeProps {
  imageUrl: string;
  className?: string;
  alt?: string;
}

/**
 * Hand-crafted SVG hero shape matching the MediWise reference.
 * - Slanted left edge, straight top & right, diagonal bottom, large rounded bottom-left corner.
 * - The doctors image is clipped by the SVG path (no CSS clip-path, no border-radius).
 */
export function HeroShape({ imageUrl, className, alt = "" }: HeroShapeProps) {
  const uid = useId().replace(/:/g, "");
  const clipId = `heroClip-${uid}`;
  const gradId = `heroGrad-${uid}`;

  const shapePath =
    "M87.4771 0H600V492.035L147.253 600H125.577C55.3147 600 0 544.6885 0 476.423V87.4771Z";

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
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#5FE0C0" />
          <stop offset="100%" stopColor="#43D4B0" />
        </linearGradient>
      </defs>

      {/* mint fill behind the photo */}
      <path d={shapePath} fill={`url(#${gradId})`} />

      {/* clipped photo */}
      <image
        href={imageUrl}
        x="0"
        y="0"
        width="600"
        height="600"
        clipPath={`url(#${clipId})`}
        preserveAspectRatio="xMidYMid slice"
      />
    </svg>
  );
}
