import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Reveal } from "./Reveal";

type Crumb = { label: string; to?: string };

export function PageHero({
  eyebrow,
  title,
  description,
  crumbs,
  image,
  badges,
  actions,
  align = "left",
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  crumbs?: Crumb[];
  /** Optional full-bleed background image URL. Falls back to a brand gradient. */
  image?: string | null;
  /** Small trust chips shown under the description (e.g. "4.9★ Rated"). */
  badges?: string[];
  /** Optional CTA row rendered under the copy. */
  actions?: ReactNode;
  align?: "left" | "center";
}) {
  const centered = align === "center";
  return (
    <section className="relative isolate flex min-h-[440px] items-center overflow-hidden lg:min-h-[520px]">
      {/* Background */}
      {image ? (
        <img
          src={image}
          alt=""
          aria-hidden
          className="absolute inset-0 -z-20 h-full w-full object-cover"
        />
      ) : (
        <div
          className="absolute inset-0 -z-20"
          style={{
            background:
              "radial-gradient(55% 55% at 18% 12%, color-mix(in oklab, var(--primary) 42%, transparent), transparent 70%), radial-gradient(50% 50% at 88% 20%, color-mix(in oklab, var(--accent) 30%, transparent), transparent 70%), linear-gradient(135deg, var(--accent), color-mix(in oklab, var(--primary) 80%, black 12%))",
          }}
        />
      )}
      {/* Warm brand overlay for legibility */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(180deg, color-mix(in oklab, var(--accent) 55%, black 28%) 0%, color-mix(in oklab, var(--primary) 40%, black 40%) 60%, color-mix(in oklab, black 72%, transparent) 100%)",
        }}
      />
      {/* Soft grain / vignette */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-40 mix-blend-overlay bg-[radial-gradient(circle_at_25%_20%,white,transparent_45%)]" />

      <div
        className={`container-x relative w-full pt-28 pb-16 lg:pt-36 lg:pb-24 text-white ${
          centered ? "text-center" : ""
        }`}
      >
        {crumbs && (
          <nav
            aria-label="Breadcrumb"
            className={`mb-6 flex flex-wrap items-center gap-2 text-xs text-white/70 ${
              centered ? "justify-center" : ""
            }`}
          >
            {crumbs.map((c, i) => (
              <span key={i} className="flex items-center gap-2">
                {c.to ? (
                  <Link to={c.to} className="transition-colors hover:text-white">
                    {c.label}
                  </Link>
                ) : (
                  <span className="text-white/90">{c.label}</span>
                )}
                {i < crumbs.length - 1 && <span className="text-white/40">/</span>}
              </span>
            ))}
          </nav>
        )}
        <Reveal>
          {eyebrow && (
            <div
              className={`inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/90 backdrop-blur mb-5 ${
                centered ? "mx-auto" : ""
              }`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
              {eyebrow}
            </div>
          )}
          <h1
            className={`font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl ${
              centered ? "mx-auto max-w-4xl" : "max-w-3xl"
            }`}
          >
            {title}
          </h1>
          {description && (
            <p
              className={`mt-5 text-base leading-relaxed text-white/85 md:text-lg ${
                centered ? "mx-auto max-w-2xl" : "max-w-2xl"
              }`}
            >
              {description}
            </p>
          )}
        </Reveal>

        {badges && badges.length > 0 && (
          <Reveal delay={0.08}>
            <div
              className={`mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-medium text-white/90 ${
                centered ? "justify-center" : ""
              }`}
            >
              {badges.map((b) => (
                <span key={b} className="inline-flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  {b}
                </span>
              ))}
            </div>
          </Reveal>
        )}

        {actions && (
          <Reveal delay={0.14}>
            <div className={`mt-8 flex flex-wrap items-center gap-3 ${centered ? "justify-center" : ""}`}>
              {actions}
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
