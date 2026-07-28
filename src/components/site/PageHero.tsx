import { Link } from "@tanstack/react-router";
import { Reveal } from "./Reveal";

export function PageHero({
  eyebrow,
  title,
  description,
  crumbs,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  crumbs?: { label: string; to?: string }[];
}) {
  return (
    <section className="relative overflow-hidden grid-bg">
      <div className="container-x pt-16 pb-14 lg:pt-24 lg:pb-20">
        {crumbs && (
          <nav aria-label="Breadcrumb" className="mb-6 text-xs text-muted-foreground flex items-center gap-2 flex-wrap">
            {crumbs.map((c, i) => (
              <span key={i} className="flex items-center gap-2">
                {c.to ? (
                  <Link to={c.to} className="hover:text-foreground">{c.label}</Link>
                ) : (
                  <span className="text-foreground/70">{c.label}</span>
                )}
                {i < crumbs.length - 1 && <span>/</span>}
              </span>
            ))}
          </nav>
        )}
        <Reveal>
          {eyebrow && (
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/70 px-3 py-1 text-xs font-medium text-muted-foreground mb-5">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              {eyebrow}
            </div>
          )}
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl tracking-tight max-w-3xl">
            {title}
          </h1>
          {description && (
            <p className="mt-5 max-w-2xl text-base md:text-lg text-muted-foreground leading-relaxed">
              {description}
            </p>
          )}
        </Reveal>
      </div>
    </section>
  );
}
