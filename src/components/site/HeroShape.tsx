import { useId } from "react";

interface HeroShapeProps {
  imageUrl: string;
  className?: string;
  alt?: string;
}

/**
 * Hand-crafted SVG hero panel matching the supplied MediWise-style reference:
 * straight top, vertical right edge, slanted left edge, diagonal bottom, and a
 * large smooth lower-left curve. The image is clipped inside this SVG path.
 */
export function HeroShape({ imageUrl, className, alt = "" }: HeroShapeProps) {
  const uid = useId().replace(/:/g, "");
  const clipId = `heroClip-${uid}`;

  // Tuned from the screenshot: inset top-left, leaning left edge, diagonal base,
  // and a broad rounded sweep where the lower-left corner meets the bottom cut.
  const shapePath = "M76 0 H620 V466 L168 584 C104 598 55 558 48 496 Z";

  return (
    <svg
      className={className}
      viewBox="0 0 620 600"
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

      <path d={shapePath} fill="var(--primary)" />

      <g clipPath={`url(#${clipId})`} fill="none" stroke="var(--primary-foreground)" strokeOpacity="0.28" strokeWidth="2.4">
        <circle cx="512" cy="72" r="52" />
        <circle cx="205" cy="92" r="48" />
        <circle cx="560" cy="330" r="24" />
        <circle cx="360" cy="470" r="15" />
      </g>

      <image
        href={imageUrl}
        x="72"
        y="70"
        width="470"
        height="500"
        clipPath={`url(#${clipId})`}
        preserveAspectRatio="xMidYMax meet"
      />
    </svg>
  );
}
