import { createFileRoute, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { blogBySlugQ } from "@/lib/api/queries";
import { Section } from "@/components/site/Section";
import { PageHero } from "@/components/site/PageHero";

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params, context }) => {
    try {
      const b = await context.queryClient.ensureQueryData(blogBySlugQ(params.slug));
      return { title: b.title, description: b.excerpt ?? undefined, image: b.featured_image ?? undefined };
    } catch {
      throw notFound();
    }
  },
  head: ({ loaderData, params }) => ({
    meta: [
      { title: `${loaderData?.title ?? "Article"} — Nupun` },
      { name: "description", content: loaderData?.description ?? "Article from the Nupun blog." },
      { property: "og:title", content: loaderData?.title ?? "Article" },
      { property: "og:description", content: loaderData?.description ?? "" },
      { property: "og:type", content: "article" },
      { property: "og:url", content: `/blog/${params.slug}` },
      ...(loaderData?.image ? [
        { property: "og:image", content: loaderData.image },
        { name: "twitter:image", content: loaderData.image },
      ] : []),
    ],
    links: [{ rel: "canonical", href: `/blog/${params.slug}` }],
    scripts: loaderData ? [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Article",
        headline: loaderData.title,
        image: loaderData.image ? [loaderData.image] : undefined,
        description: loaderData.description,
      }),
    }] : [],
  }),
  component: BlogDetail,
});

function BlogDetail() {
  const { slug } = Route.useParams();
  const { data: b } = useQuery(blogBySlugQ(slug));
  if (!b) return null;
  const date = b.published_at ?? b.created_at;
  return (
    <>
      <PageHero
        eyebrow={b.category_name ?? "Article"}
        title={b.title}
        description={b.excerpt ?? undefined}
        crumbs={[{ label: "Home", to: "/" }, { label: "Blog", to: "/blog" }, { label: b.title }]}
      />
      <Section className="pt-4">
        <div className="mx-auto max-w-3xl">
          {(b.author_name || date) && (
            <div className="mb-8 flex items-center gap-3 text-sm text-muted-foreground">
              {b.author_name && <span className="font-medium text-foreground">{b.author_name}</span>}
              {date && <span>· {new Date(date).toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" })}</span>}
              {b.read_time && <span>· {b.read_time} min read</span>}
            </div>
          )}
          {b.featured_image && (
            <div className="mb-10 overflow-hidden rounded-3xl border border-border">
              <img src={b.featured_image} alt={b.title} className="w-full h-auto" />
            </div>
          )}
          {b.content && (
            <article className="prose prose-neutral max-w-none text-base leading-[1.8] text-foreground/90 whitespace-pre-line">
              {b.content}
            </article>
          )}
        </div>
      </Section>
    </>
  );
}
