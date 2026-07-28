import { Star } from "lucide-react";
import type { ReviewSummary } from "@/lib/api/types";

export function GoogleReviews({ summary }: { summary: ReviewSummary }) {
  const rating = summary.average_rating || 0;
  const dist = summary.distribution ?? {};
  const total = summary.total_reviews || 1;
  return (
    <div className="rounded-[2.5rem] border border-border bg-surface p-10 lg:p-14 grid gap-10 lg:grid-cols-12">
      <div className="lg:col-span-5">
        <div className="text-xs uppercase tracking-[0.2em] text-accent">Google reviews</div>
        <h2 className="mt-3 font-display text-4xl md:text-5xl">
          {rating.toFixed(1)} <span className="text-muted-foreground text-2xl">/ 5</span>
        </h2>
        <div className="mt-2 flex gap-1 text-primary">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="h-5 w-5" fill={i < Math.round(rating) ? "currentColor" : "none"} />
          ))}
        </div>
        <div className="mt-3 text-sm text-muted-foreground">Based on {summary.total_reviews} verified reviews</div>
        {summary.google_reviews_link && (
          <a
            href={summary.google_reviews_link}
            target="_blank"
            rel="noreferrer noopener"
            className="mt-6 inline-flex items-center rounded-full border border-border px-5 py-2.5 text-sm font-medium hover:border-primary"
          >
            Read on Google
          </a>
        )}
      </div>
      <div className="lg:col-span-7 space-y-3">
        {[5, 4, 3, 2, 1].map((star) => {
          const count = dist[String(star)] ?? 0;
          const pct = Math.round((count / total) * 100);
          return (
            <div key={star} className="flex items-center gap-4">
              <div className="w-8 text-sm text-muted-foreground">{star}★</div>
              <div className="flex-1 h-2 rounded-full bg-primary-soft overflow-hidden">
                <div className="h-full bg-gradient-to-r from-accent to-primary" style={{ width: `${pct}%` }} />
              </div>
              <div className="w-10 text-right text-sm text-muted-foreground">{count}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
