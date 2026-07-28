import { Link } from "@tanstack/react-router";
import { ArrowUpRight, HeartPulse } from "lucide-react";
import type { Service } from "@/lib/api/types";

export function ServiceCard({ service }: { service: Service }) {
  return (
    <Link
      to="/services/$slug"
      params={{ slug: service.slug }}
      className="group relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-border/70 bg-surface shadow-[0_1px_0_rgba(0,0,0,0.02)] transition-all duration-500 ease-out hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_30px_60px_-30px_color-mix(in_oklab,var(--primary)_35%,transparent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      {/* Media block */}
      <div className="relative aspect-[4/5] overflow-hidden">
        {service.featured_image ? (
          <img
            src={service.featured_image}
            alt={service.title}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        ) : (
          <div className="grid h-full w-full place-items-center bg-gradient-to-br from-primary-soft via-surface to-primary-soft/60">
            <HeartPulse className="h-16 w-16 text-primary/40" strokeWidth={1.25} />
          </div>
        )}

        {/* Bottom scrim for legibility of chips */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/25 to-transparent" />

        {/* Category chip */}
        {service.category_name && (
          <div className="absolute left-4 top-4 rounded-full bg-white/75 backdrop-blur-md px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground/80 shadow-sm">
            {service.category_name}
          </div>
        )}

        {/* Price chip */}
        {service.price ? (
          <div className="absolute right-4 top-4 rounded-full bg-white/75 backdrop-blur-md px-3 py-1.5 text-xs font-medium text-foreground shadow-sm">
            <span className="font-display text-sm">₹{service.price.toLocaleString()}</span>
            {service.price_unit && (
              <span className="text-muted-foreground"> / {service.price_unit}</span>
            )}
          </div>
        ) : null}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-7">
        <h3 className="font-display text-2xl leading-tight tracking-tight line-clamp-2">
          {service.title}
        </h3>
        {service.short_description && (
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground line-clamp-2">
            {service.short_description}
          </p>
        )}

        <div className="mt-auto pt-6 border-t border-border/60 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            Learn more
          </span>
          <span className="grid h-10 w-10 place-items-center rounded-full bg-foreground text-background transition-all duration-500 ease-out group-hover:rotate-45 group-hover:bg-primary group-hover:text-primary-foreground motion-reduce:transition-none motion-reduce:group-hover:rotate-0">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}
