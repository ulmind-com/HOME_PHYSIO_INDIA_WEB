import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import type { Equipment } from "@/lib/api/types";

export function EquipmentCard({ equipment }: { equipment: Equipment }) {
  const price = equipment.rental_price ?? equipment.daily_rate;
  return (
    <Link
      to="/equipment/$slug"
      params={{ slug: equipment.slug }}
      className="group relative flex h-full flex-col overflow-hidden rounded-[2.5rem] border border-white/60 bg-white/40 p-3 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.04),inset_0_0_0_1px_rgba(255,255,255,0.4)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(26,130,118,0.15)] hover:border-primary/40 hover:bg-white/60"
    >
      {/* Top Glossy Highlight */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-80" />

      <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-primary/5 shadow-inner">
        {equipment.featured_image ? (
          <img
            src={equipment.featured_image}
            alt={equipment.title}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="grid h-full w-full place-items-center">
            <svg
              viewBox="0 0 24 24"
              className="h-10 w-10 text-primary/40"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <rect x="3" y="9" width="18" height="6" rx="3" />
              <path d="M12 9v6" />
            </svg>
          </div>
        )}

        {/* Image overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </div>

      <div className="p-6 flex flex-col flex-1 relative z-10">
        {equipment.category_name && (
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-accent backdrop-blur-md self-start mb-4 border border-white shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
            {equipment.category_name}
          </div>
        )}

        <h3 className="font-display text-2xl font-bold leading-tight text-foreground transition-colors group-hover:text-primary">
          {equipment.title}
        </h3>

        {equipment.short_description && (
          <p className="mt-2.5 text-[15px] leading-relaxed text-muted-foreground/90 line-clamp-2">
            {equipment.short_description}
          </p>
        )}

        <div className="mt-auto pt-7 flex items-end justify-between">
          {price ? (
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                Rental Rate
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="font-display text-[26px] font-bold text-foreground">
                  ₹{price.toLocaleString()}
                </span>
                <span className="text-[13px] font-semibold text-muted-foreground">
                  / {equipment.price_unit ?? "day"}
                </span>
              </div>
            </div>
          ) : (
            <span className="text-sm font-medium text-muted-foreground">Contact for pricing</span>
          )}

          <div className="grid h-12 w-12 place-items-center rounded-full bg-white shadow-md border border-black/5 text-foreground transition-all duration-500 group-hover:scale-110 group-hover:bg-primary group-hover:text-white group-hover:shadow-[0_10px_20px_rgba(26,130,118,0.3)] group-hover:border-primary">
            <ArrowUpRight className="h-5 w-5 transition-transform duration-500 group-hover:rotate-12" />
          </div>
        </div>
      </div>
    </Link>
  );
}
