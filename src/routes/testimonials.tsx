import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Star, ArrowRight } from "lucide-react";
import { testimonialsQ, reviewSummaryQ } from "@/lib/api/queries";
import { PageHero } from "@/components/site/PageHero";
import { TestimonialCard } from "@/components/site/cards/TestimonialCard";
import { EmptyState, Section } from "@/components/site/Section";

export const Route = createFileRoute("/testimonials")({
  head: () => ({
    meta: [
      { title: "Testimonials — Nupun Home Health Care" },
      { name: "description", content: "Real stories from the families we've cared for." },
      { property: "og:title", content: "Testimonials — Nupun Home Health Care" },
      { property: "og:description", content: "Real stories from families." },
      { property: "og:url", content: "/testimonials" },
    ],
    links: [{ rel: "canonical", href: "/testimonials" }],
  }),
  component: TestimonialsPage,
});

function TestimonialsPage() {
  const { data, isLoading } = useQuery(testimonialsQ({ limit: 60 }));
  const { data: reviews } = useQuery(reviewSummaryQ());
  const items = data?.items ?? [];

  const rating = reviews?.average_rating ? reviews.average_rating.toFixed(1) : "4.9";
  const total = reviews?.total_reviews;

  return (
    <>
      <PageHero
        eyebrow="Words from families"
        title="Care remembered."
        description="What patients and their families told us — in their own words, after care that mattered."
        crumbs={[{ label: "Home", to: "/" }, { label: "Testimonials" }]}
        badges={[
          `${rating}★ average rating`,
          ...(total ? [`${total}+ reviews`] : ["Trusted by families"]),
        ]}
      />

      {/* Rating summary band */}
      <div className="container-x pt-16 lg:pt-20">
        <div className="flex flex-col items-center justify-between gap-6 rounded-[2rem] border border-border/60 bg-primary-soft/40 p-8 sm:flex-row lg:p-10">
          <div className="flex items-center gap-5">
            <div className="font-display text-6xl tracking-tight text-primary">{rating}</div>
            <div>
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                ))}
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                {total
                  ? `Across ${total}+ verified reviews`
                  : "Rated by families across the region"}
              </div>
            </div>
          </div>
          <Link
            to="/booking"
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3.5 text-sm font-medium text-background"
          >
            Book care <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <Section className="pt-12">
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-60 rounded-3xl border border-border bg-surface animate-pulse"
              />
            ))}
          </div>
        ) : items.length ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((t) => (
              <TestimonialCard key={t.id} t={t} />
            ))}
          </div>
        ) : (
          <EmptyState title="Stories will appear here soon" />
        )}
      </Section>
    </>
  );
}
