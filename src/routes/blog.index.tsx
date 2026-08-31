import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import { blogsQ } from "@/lib/api/queries";
import { imgUrl } from "@/lib/utils";
import { PageHero } from "@/components/site/PageHero";
import { BlogCard } from "@/components/site/cards/BlogCard";
import { EmptyState, Section } from "@/components/site/Section";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "Blog — Home Physio India" },
      { name: "description", content: "Notes on caregiving, recovery and living well at home." },
      { property: "og:title", content: "Blog — Home Physio India" },
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
  const [active, setActive] = useState("all");

  const categories = useMemo(() => {
    const set = new Set<string>();
    items.forEach((b) => b.category_name && set.add(b.category_name));
    return ["all", ...Array.from(set)];
  }, [items]);

  const filtered = useMemo(
    () => (active === "all" ? items : items.filter((b) => b.category_name === active)),
    [items, active],
  );

  const [featured, ...rest] = filtered;

  return (
    <>
      <PageHero
        eyebrow="Journal"
        title="Our Blogs"
        description="Compassionate stories, practical guides and clinical perspectives for a healthier life at home."
        crumbs={[{ label: "Home", to: "/" }, { label: "Blog" }]}
      />

      <Section className="pt-16 lg:pt-20">
        {/* Category pills */}
        {categories.length > 1 && (
          <div className="mb-10 flex flex-wrap gap-3 border-b border-border pb-8">
            {categories.map((c) => {
              const isActive = c === active;
              return (
                <button
                  key={c}
                  onClick={() => setActive(c)}
                  className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "border border-border bg-surface text-muted-foreground hover:border-primary hover:text-foreground"
                  }`}
                >
                  {c === "all" ? "All Blogs" : c}
                </button>
              );
            })}
          </div>
        )}

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-80 rounded-3xl border border-border bg-surface animate-pulse"
              />
            ))}
          </div>
        ) : filtered.length ? (
          <div className="space-y-12">
            {/* Featured post */}
            {featured && (
              <Link
                to="/blog/$slug"
                params={{ slug: featured.slug }}
                className="group grid overflow-hidden rounded-[2rem] border border-border bg-surface hover-glow hover:border-primary/60 lg:grid-cols-2"
              >
                <div className="aspect-[16/10] overflow-hidden bg-primary-soft lg:aspect-auto">
                  {imgUrl(featured.featured_image) ? (
                    <img
                      src={imgUrl(featured.featured_image)}
                      alt={featured.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="grid h-full w-full place-items-center font-display text-5xl text-primary/60">
                      Home Physio India
                    </div>
                  )}
                </div>
                <div className="flex flex-col justify-center p-8 lg:p-12">
                  <div className="inline-flex w-fit items-center gap-2 rounded-full bg-primary-soft px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">
                    {featured.category_name ?? "Featured"}
                  </div>
                  <h2 className="mt-4 font-display text-3xl leading-tight tracking-tight md:text-4xl">
                    {featured.title}
                  </h2>
                  {featured.excerpt && (
                    <p className="mt-4 max-w-lg text-muted-foreground line-clamp-3">
                      {featured.excerpt}
                    </p>
                  )}
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent">
                    Read story{" "}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            )}

            {/* Rest */}
            {rest.length > 0 && (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {rest.map((b) => (
                  <BlogCard key={b.id} blog={b} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <EmptyState
            title="The journal is coming soon"
            description="Fresh writing from our care team is on the way."
          />
        )}
      </Section>
    </>
  );
}
