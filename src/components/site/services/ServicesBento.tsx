import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, HeartPulse, Sparkles } from "lucide-react";
import type { Service } from "@/lib/api/types";
import { ServiceCard } from "@/components/site/cards/ServiceCard";

/** Featured hero tile — image full-bleed, content overlaid */
function FeaturedServiceTile({ service }: { service: Service }) {
  return (
    <Link
      to="/services/$slug"
      params={{ slug: service.slug }}
      className="group relative flex min-h-[420px] md:min-h-[520px] flex-col justify-end overflow-hidden rounded-[2rem] border border-border/60 bg-foreground text-background shadow-[0_40px_80px_-40px_color-mix(in_oklab,var(--primary)_45%,transparent)] transition-all duration-500 hover:-translate-y-1"
    >
      {service.featured_image ? (
        <img
          src={typeof service.featured_image === 'string' ? service.featured_image : service.featured_image.url}
          alt={service.title}
          className="absolute inset-0 h-full w-full object-cover opacity-90 transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-accent to-primary-glow" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

      <div className="absolute left-6 top-6 inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-md px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-white border border-white/25">
        <Sparkles className="h-3 w-3" /> Signature care
      </div>

      <div className="relative p-8 md:p-10">
        {service.category_name && (
          <div className="text-[10px] uppercase tracking-[0.24em] text-white/70 mb-3">
            {service.category_name}
          </div>
        )}
        <h3 className="font-display text-3xl md:text-4xl lg:text-5xl tracking-tight max-w-xl leading-[1.05]">
          {service.title}
        </h3>
        {service.short_description && (
          <p className="mt-4 max-w-lg text-sm md:text-base text-white/80 line-clamp-2">
            {service.short_description}
          </p>
        )}
        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-medium">
            Explore this service
            <span className="grid h-9 w-9 place-items-center rounded-full bg-white text-foreground transition-transform duration-500 group-hover:rotate-45">
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </div>
          {service.price ? (
            <div className="rounded-full bg-white/15 backdrop-blur-md border border-white/25 px-4 py-1.5 text-sm">
              <span className="font-display">₹{service.price.toLocaleString()}</span>
              {service.price_unit && <span className="text-white/70"> / {service.price_unit}</span>}
            </div>
          ) : null}
        </div>
      </div>
    </Link>
  );
}

/** Wide tile — image left, editorial content right */
function WideServiceTile({ service }: { service: Service }) {
  return (
    <Link
      to="/services/$slug"
      params={{ slug: service.slug }}
      className="group relative grid md:grid-cols-2 overflow-hidden rounded-[2rem] border border-border/70 bg-surface transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_color-mix(in_oklab,var(--primary)_35%,transparent)]"
    >
      <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[300px] overflow-hidden">
        {service.featured_image ? (
          <img
            src={typeof service.featured_image === 'string' ? service.featured_image : service.featured_image.url}
            alt={service.title}
            className="h-full w-full object-cover transition-transform duration-[1000ms] ease-out group-hover:scale-[1.05]"
          />
        ) : (
          <div className="h-full w-full grid place-items-center bg-primary-soft">
            <HeartPulse className="h-12 w-12 text-primary/40" strokeWidth={1.25} />
          </div>
        )}
      </div>
      <div className="flex flex-col justify-between p-6 md:p-8">
        <div>
          {service.category_name && (
            <div className="text-[10px] uppercase tracking-[0.22em] text-accent mb-3">
              {service.category_name}
            </div>
          )}
          <h3 className="font-display text-2xl md:text-3xl tracking-tight leading-tight">
            {service.title}
          </h3>
          {service.short_description && (
            <p className="mt-3 text-sm text-muted-foreground line-clamp-3">
              {service.short_description}
            </p>
          )}
          {service.features && service.features.length > 0 && (
            <ul className="mt-5 space-y-1.5">
              {service.features.slice(0, 3).map((f, i) => (
                <li key={i} className="flex items-center gap-2 text-xs text-foreground/80">
                  <span className="h-1 w-1 rounded-full bg-primary" /> {f}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="mt-6 flex items-center justify-between pt-4 border-t border-border/60">
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">
            View details
          </span>
          <span className="grid h-9 w-9 place-items-center rounded-full bg-foreground text-background transition-transform duration-500 group-hover:rotate-45 group-hover:bg-primary">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export function ServicesBento({ items }: { items: Service[] }) {
  if (items.length === 0) return null;
  const [featured, ...rest] = items;

  // Break rest into rows of standard tiles, injecting a wide tile every 5th standard slot.
  const tiles: Array<{ kind: "std" | "wide"; service: Service }> = [];
  rest.forEach((s, i) => {
    tiles.push({ kind: (i + 1) % 6 === 0 ? "wide" : "std", service: s });
  });

  return (
    <div className="space-y-6">
      <FeaturedServiceTile service={featured} />
      <AnimatePresence mode="popLayout">
        <motion.div layout className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tiles.map(({ kind, service }) => (
            <motion.div
              key={service.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className={kind === "wide" ? "md:col-span-2 lg:col-span-2" : ""}
            >
              {kind === "wide" ? (
                <WideServiceTile service={service} />
              ) : (
                <ServiceCard service={service} />
              )}
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
