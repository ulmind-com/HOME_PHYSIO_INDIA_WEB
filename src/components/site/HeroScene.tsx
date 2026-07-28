import { motion, useReducedMotion } from "framer-motion";

/**
 * Lightweight "3D-feel" hero scene — layered SVG blobs, floating medical glyphs,
 * soft depth from blur + gradient. SSR-safe, no WebGL cost.
 */
export function HeroScene() {
  const reduce = useReducedMotion();
  return (
    <div className="relative aspect-square w-full max-w-[560px]">
      {/* halo */}
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_50%,color-mix(in_oklab,var(--primary)_40%,transparent),transparent_65%)] blur-2xl" />
      {/* base disc */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-6 rounded-[42%_58%_46%_54%/54%_44%_56%_46%] glass-strong shadow-[var(--shadow-elegant)]"
        style={{
          background:
            "linear-gradient(135deg, color-mix(in oklab, var(--primary) 55%, white), color-mix(in oklab, var(--accent) 60%, white))",
        }}
      />
      {/* inner ring */}
      <div className="absolute inset-14 rounded-full border border-white/50" />
      <div className="absolute inset-24 rounded-full border border-white/30" />

      {/* Floating glyphs */}
      <FloatGlyph
        style={{ top: "6%", left: "8%" }}
        reduce={!!reduce}
        className="animate-float-slow"
        label="Heart"
      >
        <svg viewBox="0 0 24 24" className="h-7 w-7 text-primary" fill="currentColor" aria-hidden>
          <path d="M12 21s-7-4.35-9.5-8.5C.85 9.5 2.4 5.5 6 5c2.05-.28 3.7.9 6 3 2.3-2.1 3.95-3.28 6-3 3.6.5 5.15 4.5 3.5 7.5C19 16.65 12 21 12 21Z" />
        </svg>
      </FloatGlyph>

      <FloatGlyph
        style={{ top: "10%", right: "6%" }}
        reduce={!!reduce}
        className="animate-float-slower"
        label="Plus"
      >
        <svg viewBox="0 0 24 24" className="h-6 w-6 text-accent" fill="currentColor" aria-hidden>
          <path d="M11 3h2v8h8v2h-8v8h-2v-8H3v-2h8V3Z" />
        </svg>
      </FloatGlyph>

      <FloatGlyph
        style={{ bottom: "12%", left: "4%" }}
        reduce={!!reduce}
        className="animate-float-slower"
        label="Capsule"
      >
        <svg viewBox="0 0 24 24" className="h-7 w-7 text-primary" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
          <rect x="3" y="9" width="18" height="6" rx="3" />
          <path d="M12 9v6" />
        </svg>
      </FloatGlyph>

      <FloatGlyph
        style={{ bottom: "8%", right: "10%" }}
        reduce={!!reduce}
        className="animate-float-slow"
        label="Stethoscope"
      >
        <svg viewBox="0 0 24 24" className="h-8 w-8 text-accent" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
          <path d="M6 3v6a4 4 0 0 0 8 0V3" />
          <path d="M10 13v3a4 4 0 0 0 8 0v-2" />
          <circle cx="18" cy="12" r="2" />
        </svg>
      </FloatGlyph>

      {/* Floating card badge */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="glass-strong absolute -left-4 bottom-10 flex items-center gap-3 rounded-2xl px-4 py-3 shadow-[var(--shadow-soft)]"
      >
        <div className="h-9 w-9 rounded-full bg-primary/15 flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="h-4 w-4 text-primary" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Verified caregivers</div>
          <div className="text-sm font-medium">Background-checked</div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.8 }}
        className="glass-strong absolute -right-2 top-10 flex items-center gap-3 rounded-2xl px-4 py-3 shadow-[var(--shadow-soft)]"
      >
        <div className="flex -space-x-2">
          <div className="h-8 w-8 rounded-full border-2 border-white bg-gradient-to-br from-primary to-accent" />
          <div className="h-8 w-8 rounded-full border-2 border-white bg-gradient-to-br from-accent to-primary" />
          <div className="h-8 w-8 rounded-full border-2 border-white bg-gradient-to-br from-primary-soft to-primary" />
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Trusted by</div>
          <div className="text-sm font-medium">10,000+ families</div>
        </div>
      </motion.div>
    </div>
  );
}

function FloatGlyph({
  children,
  style,
  className,
  reduce,
  label,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  reduce: boolean;
  label: string;
}) {
  return (
    <div
      className={`absolute glass-strong grid h-14 w-14 place-items-center rounded-2xl shadow-[var(--shadow-soft)] ${
        reduce ? "" : className ?? ""
      }`}
      style={style}
      aria-label={label}
      role="img"
    >
      {children}
    </div>
  );
}
