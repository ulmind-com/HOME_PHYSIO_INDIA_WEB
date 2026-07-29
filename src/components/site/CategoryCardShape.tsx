// Unique SVG overlay shapes for each category card. currentColor is themed via text-primary.
export function CategoryCardShape({ variant = "a", className }: { variant?: "a" | "b" | "c" | "d"; className?: string }) {
  const paths: Record<string, string> = {
    // sweeping bottom-left curve
    a: "M0,600 L0,320 C0,240 60,220 140,240 C240,266 320,340 400,360 C500,384 600,360 600,360 L600,600 Z",
    // asymmetric wave
    b: "M0,600 L0,380 C80,340 180,420 280,400 C380,382 460,300 560,320 C580,324 600,336 600,336 L600,600 Z",
    // stepped curve
    c: "M0,600 L0,300 C0,260 40,240 100,260 L220,300 C280,320 320,300 340,260 L420,140 C440,100 480,90 520,120 L600,180 L600,600 Z",
    // gentle diagonal
    d: "M0,600 L0,420 C120,360 260,420 380,380 C480,348 540,280 600,260 L600,600 Z",
  };
  return (
    <svg
      viewBox="0 0 600 600"
      preserveAspectRatio="none"
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient id={`cshape-${variant}`} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.95" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.55" />
        </linearGradient>
      </defs>
      <path d={paths[variant]} fill={`url(#cshape-${variant})`} />
    </svg>
  );
}
