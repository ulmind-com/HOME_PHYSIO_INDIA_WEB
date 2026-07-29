import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { videosQ } from "@/lib/api/queries";
import { PageHero } from "@/components/site/PageHero";
import { VideoCard } from "@/components/site/cards/VideoCard";
import { EmptyState, Section } from "@/components/site/Section";

export const Route = createFileRoute("/videos")({
  head: () => ({
    meta: [
      { title: "Videos — Nupun Home Health Care" },
      { name: "description", content: "Watch care in action — guides, family stories and behind-the-scenes." },
      { property: "og:title", content: "Videos — Nupun Home Health Care" },
      { property: "og:description", content: "Watch care in action." },
      { property: "og:url", content: "/videos" },
    ],
    links: [{ rel: "canonical", href: "/videos" }],
  }),
  component: VideosPage,
});

function VideosPage() {
  const { data, isLoading } = useQuery(videosQ({ limit: 60 }));
  const items = data?.items ?? [];
  return (
    <>
      <PageHero
        eyebrow="Watch"
        title="Care, on screen."
        description="Short films, guides and family stories — a look at how Nupun's care actually feels."
        crumbs={[{ label: "Home", to: "/" }, { label: "Videos" }]}
      />
      <Section className="pt-16 lg:pt-20">
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-video rounded-3xl border border-border bg-surface animate-pulse" />
            ))}
          </div>
        ) : items.length ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((v) => <VideoCard key={v.id} v={v} />)}
          </div>
        ) : (
          <EmptyState title="Videos coming soon" />
        )}
      </Section>
    </>
  );
}
