import { Star, Quote } from "lucide-react";
import type { Testimonial } from "@/lib/api/types";

export function TestimonialCard({ t }: { t: Testimonial & Record<string, any> }) {
  // Gracefully map both Backend Admin schema (patient_name, message, designation, photo) and fallback props
  const name = t.patient_name ?? t.name ?? "Valued Client";
  const text = t.message ?? t.content ?? "";
  const role = t.designation ?? t.role ?? "";
  const avatar = typeof t.photo === "string" ? t.photo : t.photo?.url ?? t.image ?? t.avatar;
  const rating = Math.max(1, Math.min(5, Math.round(Number(t.rating ?? 5))));

  return (
    <figure className="group flex h-full flex-col justify-between rounded-2xl md:rounded-3xl border border-border/80 bg-background dark:bg-card/40 p-5 sm:p-7 md:p-8 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-primary/40 relative overflow-hidden">
      {/* Subtle quote watermark styling */}
      <Quote className="absolute -top-2 -right-2 h-20 w-20 text-primary/[0.04] -rotate-12 transition-transform duration-500 group-hover:scale-110 group-hover:text-primary/[0.08] pointer-events-none" />

      <div>
        {/* Star Rating from Admin Panel */}
        <div className="flex items-center gap-0.5 md:gap-1 text-primary mb-3 md:mb-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-3.5 w-3.5 md:h-4 md:w-4 transition-transform duration-300 group-hover:scale-110 ${
                i < rating ? "fill-current text-primary" : "text-muted-foreground/25"
              }`}
              style={{ transitionDelay: `${i * 50}ms` }}
            />
          ))}
        </div>

        {/* Review / Testimonial Message */}
        <blockquote className="text-sm sm:text-base md:text-[17px] leading-relaxed text-foreground/90 font-normal line-clamp-5 md:line-clamp-none">
          “{text}”
        </blockquote>
      </div>

      {/* Author Footer (Photo + Name + Designation) */}
      <figcaption className="mt-5 md:mt-8 flex items-center gap-3 md:gap-4 pt-4 md:pt-5 border-t border-border/40">
        {avatar ? (
          <div className="relative shrink-0">
            <img
              src={avatar}
              alt={name}
              className="h-10 w-10 md:h-12 md:w-12 rounded-full object-cover shadow-sm ring-2 ring-primary/20 group-hover:ring-primary/50 transition-all duration-300"
            />
          </div>
        ) : (
          <div className="shrink-0 h-10 w-10 md:h-12 md:w-12 rounded-full bg-primary/10 border border-primary/20 grid place-items-center text-primary font-display text-base md:text-lg font-bold group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shadow-sm">
            {name?.[0]?.toUpperCase() ?? "U"}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="font-display text-sm md:text-[16px] font-semibold text-foreground group-hover:text-primary transition-colors duration-300 truncate">
            {name}
          </div>
          {role && (
            <div className="text-xs sm:text-sm font-medium text-muted-foreground truncate mt-0.5">
              {role}
            </div>
          )}
        </div>
      </figcaption>
    </figure>
  );
}
