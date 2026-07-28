import { Star } from "lucide-react";
import type { Testimonial } from "@/lib/api/types";

export function TestimonialCard({ t }: { t: Testimonial }) {
  const text = t.content ?? t.message ?? "";
  const role = t.role ?? t.designation;
  const avatar = t.image ?? t.avatar;
  const rating = Math.max(0, Math.min(5, Math.round(t.rating ?? 5)));
  return (
    <figure className="flex h-full flex-col rounded-3xl border border-border bg-surface p-7">
      <div className="flex gap-1 text-primary">
        {Array.from({ length: rating }).map((_, i) => <Star key={i} className="h-4 w-4" fill="currentColor" />)}
      </div>
      <blockquote className="mt-4 text-base leading-relaxed text-foreground/90">
        “{text}”
      </blockquote>
      <figcaption className="mt-6 flex items-center gap-3">
        {avatar ? (
          <img src={avatar} alt={t.name} className="h-10 w-10 rounded-full object-cover" />
        ) : (
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent grid place-items-center text-white text-sm font-medium">
            {t.name?.[0] ?? "N"}
          </div>
        )}
        <div>
          <div className="text-sm font-medium">{t.name}</div>
          {role && <div className="text-xs text-muted-foreground">{role}</div>}
        </div>
      </figcaption>
    </figure>
  );
}
