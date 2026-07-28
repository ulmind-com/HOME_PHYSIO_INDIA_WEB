import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { blogsQ } from "@/lib/api/queries";
import { PageHero } from "@/components/site/PageHero";
import { BlogCard } from "@/components/site/cards/BlogCard";
import { EmptyState, Section } from "@/components/site/Section";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "Blog — Nupun Home Health Care" },
      { name: "description", content: "Notes on caregiving, recovery and living well at home." },
      { property: "og:title", content: "Blog — Nupun Home Health Care" },
      { property: "og:description", content: "Notes on caregiving and recovery." },
      { property: "og:url", content: "/blog" },
    ],
    links: [{ rel: "canonical", href: "/blog" }],
  }),
  component: BlogIndex,
});

function BlogIndex() {
  const { data, isLoading } = useQuery(blogsQ({ limit: 60 }));
  const items = data?.items ?? [];
  return (
    <>
      <PageHero
        eyebrow="Journal"
        title="Notes on care, at home."
        description="Practical guides, family stories and clinical perspectives from the Nupun team."
        crumbs={[{ label: "Home", to: "/" }, { label: "Blog" }]}
      />
      <Section className="pt-4">
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-80 rounded-3xl border border-border bg-surface animate-pulse" />
            ))}
          </div>
        ) : items.length ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((b) => <BlogCard key={b.id} blog={b} />)}
          </div>
        ) : (
          <EmptyState title="The journal is coming soon" description="Fresh writing from our care team is on the way." />
        )}
      </Section>
    </>
  );
}
