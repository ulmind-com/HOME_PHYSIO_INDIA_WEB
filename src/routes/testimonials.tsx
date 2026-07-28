import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { testimonialsQ } from "@/lib/api/queries";
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
  const items = data?.items ?? [];
  return (
    <>
      <PageHero
        eyebrow="Words from families"
        title="Care remembered."
        description="What patients and their families told us — in their own words."
        crumbs={[{ label: "Home", to: "/" }, { label: "Testimonials" }]}
      />
      <Section className="pt-4">
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-60 rounded-3xl border border-border bg-surface animate-pulse" />
            ))}
          </div>
        ) : items.length ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((t) => <TestimonialCard key={t.id} t={t} />)}
          </div>
        ) : (
          <EmptyState title="Stories will appear here soon" />
        )}
      </Section>
    </>
  );
}
