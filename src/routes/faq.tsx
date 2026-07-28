import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { faqsQ } from "@/lib/api/queries";
import { PageHero } from "@/components/site/PageHero";
import { FaqAccordion } from "@/components/site/FaqAccordion";
import { EmptyState, Section } from "@/components/site/Section";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — Nupun Home Health Care" },
      { name: "description", content: "Answers to common questions about Nupun's care services and equipment." },
      { property: "og:title", content: "FAQ — Nupun Home Health Care" },
      { property: "og:description", content: "Common questions about our care and equipment." },
      { property: "og:url", content: "/faq" },
    ],
    links: [{ rel: "canonical", href: "/faq" }],
  }),
  component: FaqPage,
});

function FaqPage() {
  const { data, isLoading } = useQuery(faqsQ({ limit: 200 }));
  const items = data?.items ?? [];
  return (
    <>
      <PageHero
        eyebrow="FAQ"
        title="Answers, before you ask."
        crumbs={[{ label: "Home", to: "/" }, { label: "FAQ" }]}
      />
      <Section className="pt-4">
        <div className="mx-auto max-w-3xl">
          {isLoading ? (
            <div className="h-96 rounded-3xl border border-border bg-surface animate-pulse" />
          ) : items.length ? (
            <FaqAccordion items={items} />
          ) : (
            <EmptyState title="FAQs coming soon" />
          )}
        </div>
      </Section>
    </>
  );
}
