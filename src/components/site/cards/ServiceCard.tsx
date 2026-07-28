import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import type { Service } from "@/lib/api/types";

export function ServiceCard({ service }: { service: Service }) {
  return (
    <Link
      to="/services/$slug"
      params={{ slug: service.slug }}
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-surface p-7 hover-glow transition-colors hover:border-primary/60"
    >
      {service.featured_image ? (
        <div className="mb-6 aspect-[4/3] overflow-hidden rounded-2xl">
          <img
            src={service.featured_image}
            alt={service.title}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
      ) : (
        <div className="mb-6 grid aspect-[4/3] place-items-center rounded-2xl bg-gradient-to-br from-primary-soft to-surface">
          <svg viewBox="0 0 24 24" className="h-10 w-10 text-primary/80" fill="currentColor" aria-hidden>
            <path d="M12 21s-7-4.35-9.5-8.5C.85 9.5 2.4 5.5 6 5c2.05-.28 3.7.9 6 3 2.3-2.1 3.95-3.28 6-3 3.6.5 5.15 4.5 3.5 7.5C19 16.65 12 21 12 21Z" />
          </svg>
        </div>
      )}

      {service.category_name && (
        <div className="text-xs uppercase tracking-[0.18em] text-accent">{service.category_name}</div>
      )}
      <h3 className="mt-2 font-display text-2xl leading-tight">{service.title}</h3>
      {service.short_description && (
        <p className="mt-3 text-sm text-muted-foreground line-clamp-3">{service.short_description}</p>
      )}

      <div className="mt-auto pt-6 flex items-center justify-between">
        {service.price ? (
          <div className="text-sm">
            <span className="font-display text-xl text-foreground">₹{service.price.toLocaleString()}</span>
            {service.price_unit && <span className="text-muted-foreground"> / {service.price_unit}</span>}
          </div>
        ) : <span />}
        <span className="grid h-9 w-9 place-items-center rounded-full bg-foreground text-background transition-transform group-hover:rotate-45">
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}
