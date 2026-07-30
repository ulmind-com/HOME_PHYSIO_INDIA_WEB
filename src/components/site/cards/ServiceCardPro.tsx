import { Link } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";
import type { Service } from "@/lib/api/types";
import { serviceImage } from "@/lib/service-images";

/**
 * Reference-style vertical service card: image on top, title, short copy,
 * up to three feature bullets, then a "Read more" link and a primary
 * "Book" action — kept compact/premium (shorter than the reference).
 */
export function ServiceCardPro({ service, index = 0 }: { service: Service; index?: number }) {
  const features = (service.features ?? []).slice(0, 3);
  const bookLabel = service.title.length <= 18 ? `Book ${service.title}` : "Book this service";

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[28px] border border-white/60 bg-white/40 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.04),inset_0_0_0_1px_rgba(255,255,255,0.6)] transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] hover:-translate-y-2 hover:shadow-[0_40px_80px_rgba(0,0,0,0.08),inset_0_0_0_1px_rgba(255,255,255,1)] hover:bg-white/60">
      {/* ── Liquid Glowing Orbs (Behind Glass) ── */}
      <div className="absolute -right-16 -top-16 z-0 h-64 w-64 rounded-full bg-primary/20 blur-[50px] transition-all duration-700 group-hover:scale-150 group-hover:bg-primary/30" />
      <div className="absolute -bottom-16 -left-16 z-0 h-64 w-64 rounded-full bg-accent/20 blur-[50px] transition-all duration-700 group-hover:scale-150 group-hover:bg-accent/30" />

      {/* ── Media ── */}
      <div className="relative z-10 p-2.5">
        <Link
          to="/services/$slug"
          params={{ slug: service.slug }}
          className="relative block aspect-[16/11] overflow-hidden rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.05)]"
        >
          <img
            src={serviceImage(service, index)}
            alt={service.title}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-110"
          />
          {/* Glass Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-black/10 opacity-70 transition-opacity duration-500 group-hover:opacity-40" />

          {/* Floating Badges (Glassmorphism) */}
          {service.category_name && (
            <span className="absolute left-3 top-3 rounded-full border border-white/30 bg-white/20 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white shadow-[0_4px_12px_rgba(0,0,0,0.1)] backdrop-blur-md">
              {service.category_name}
            </span>
          )}
          {service.price ? (
            <span className="absolute right-3 top-3 rounded-full border border-white/20 bg-black/30 px-3 py-1.5 text-[11px] font-semibold text-white shadow-[0_4px_12px_rgba(0,0,0,0.1)] backdrop-blur-md">
              <span className="font-display tracking-wide">₹{service.price.toLocaleString()}</span>
              {service.price_unit && <span className="opacity-80"> / {service.price_unit}</span>}
            </span>
          ) : null}
        </Link>
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 flex flex-1 flex-col px-6 pb-6 pt-2">
        <h3 className="font-display text-[22px] leading-tight tracking-tight text-foreground transition-colors group-hover:text-primary">
          {service.title}
        </h3>

        {service.short_description && (
          <p className="mt-2.5 text-[14px] leading-relaxed text-muted-foreground line-clamp-2">
            {service.short_description}
          </p>
        )}

        {/* Feature Bullets */}
        {features.length > 0 && (
          <ul className="mt-5 space-y-2.5">
            {features.map((f, i) => (
              <li
                key={i}
                className="flex items-center gap-3 text-[13px] font-medium text-foreground/80"
              >
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors duration-500 group-hover:bg-primary group-hover:text-white">
                  <Check className="h-3 w-3" strokeWidth={3} />
                </div>
                <span className="line-clamp-1">{f}</span>
              </li>
            ))}
          </ul>
        )}

        {/* ── Actions (Pinned to bottom) ── */}
        <div className="mt-auto pt-7 flex items-center justify-between gap-3">
          <Link
            to="/services/$slug"
            params={{ slug: service.slug }}
            className="group/link inline-flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-[0.1em] text-muted-foreground transition-colors hover:text-primary"
          >
            Details
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-1" />
          </Link>

          <Link
            to="/booking"
            search={{ service: service.slug }}
            className="group/btn relative overflow-hidden rounded-xl bg-foreground px-5 py-2.5 text-sm font-semibold text-background shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary hover:shadow-[0_10px_20px_var(--color-primary),0.3)]"
          >
            <span className="relative z-10">{bookLabel}</span>
            {/* Liquid shine sweep */}
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-[800ms] ease-out group-hover/btn:translate-x-full" />
          </Link>
        </div>
      </div>
    </article>
  );
}
