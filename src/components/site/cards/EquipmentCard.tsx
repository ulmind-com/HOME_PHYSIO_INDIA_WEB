import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import type { Equipment } from "@/lib/api/types";

export function EquipmentCard({ equipment }: { equipment: Equipment }) {
  const price = equipment.rental_price ?? equipment.daily_rate;
  return (
    <Link
      to="/equipment/$slug"
      params={{ slug: equipment.slug }}
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-surface hover-glow hover:border-primary/60"
    >
      <div className="aspect-[4/3] overflow-hidden bg-primary-soft">
        {equipment.featured_image ? (
          <img
            src={equipment.featured_image}
            alt={equipment.title}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full w-full place-items-center">
            <svg viewBox="0 0 24 24" className="h-10 w-10 text-primary/70" fill="none" stroke="currentColor" strokeWidth="1.6">
              <rect x="3" y="9" width="18" height="6" rx="3" /><path d="M12 9v6" />
            </svg>
          </div>
        )}
      </div>
      <div className="p-6 flex flex-col flex-1">
        {equipment.category_name && (
          <div className="text-xs uppercase tracking-[0.18em] text-accent">{equipment.category_name}</div>
        )}
        <h3 className="mt-1.5 font-display text-xl leading-tight">{equipment.title}</h3>
        {equipment.short_description && (
          <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{equipment.short_description}</p>
        )}
        <div className="mt-auto pt-5 flex items-center justify-between">
          {price ? (
            <div className="text-sm">
              <span className="font-display text-lg">₹{price.toLocaleString()}</span>
              <span className="text-muted-foreground"> / {equipment.price_unit ?? "day"}</span>
            </div>
          ) : <span className="text-xs text-muted-foreground">Rental available</span>}
          <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
        </div>
      </div>
    </Link>
  );
}
