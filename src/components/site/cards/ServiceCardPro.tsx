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
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-border/70 bg-surface shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-all duration-500 ease-out hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-[0_36px_70px_-38px_color-mix(in_oklab,var(--primary)_45%,transparent)]">
      {/* Media — compact 16/10 so the card stays short */}
      <Link
        to="/services/$slug"
        params={{ slug: service.slug }}
        className="relative block aspect-[16/10] overflow-hidden"
      >
        <img
          src={serviceImage(service, index)}
          alt={service.title}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
        {service.category_name && (
          <span className="absolute left-3 top-3 rounded-full bg-white/85 backdrop-blur-md px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-foreground/80 shadow-sm">
            {service.category_name}
          </span>
        )}
        {service.price ? (
          <span className="absolute right-3 top-3 rounded-full bg-primary/90 backdrop-blur-md px-2.5 py-1 text-[11px] font-medium text-primary-foreground shadow-sm">
            <span className="font-display">₹{service.price.toLocaleString()}</span>
            {service.price_unit && <span className="opacity-80"> / {service.price_unit}</span>}
          </span>
        ) : null}
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-xl leading-tight tracking-tight text-primary group-hover:text-accent transition-colors line-clamp-1">
          {service.title}
        </h3>

        {service.short_description && (
          <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground line-clamp-2">
            {service.short_description}
          </p>
        )}

        {features.length > 0 && (
          <ul className="mt-4 space-y-1.5">
            {features.map((f, i) => (
              <li key={i} className="flex items-start gap-2 text-[13px] text-foreground/85">
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" strokeWidth={2.5} />
                <span className="line-clamp-1">{f}</span>
              </li>
            ))}
          </ul>
        )}

        {/* Actions pinned to the bottom for equal-height cards */}
        <div className="mt-auto pt-5 space-y-3">
          <Link
            to="/services/$slug"
            params={{ slug: service.slug }}
            className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-accent underline-offset-4 hover:underline"
          >
            Read more <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <Link
            to="/booking"
            search={{ service: service.slug }}
            className="flex w-full items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-[0_10px_24px_-12px_color-mix(in_oklab,var(--primary)_70%,transparent)] transition-all duration-300 hover:bg-accent hover:-translate-y-0.5"
          >
            {bookLabel}
          </Link>
        </div>
      </div>
    </article>
  );
}
