import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { servicesQ } from "@/lib/api/queries";
import { PageHero } from "@/components/site/PageHero";
import { ServiceCard } from "@/components/site/cards/ServiceCard";
import { EmptyState, Section } from "@/components/site/Section";
import { StaggerGroup, StaggerItem } from "@/components/site/Reveal";

export const Route = createFileRoute("/services/")({
  head: () => ({
    meta: [
      { title: "Services — Nupun Home Health Care" },
      { name: "description", content: "Nursing, physiotherapy, elder care, post-operative recovery and more, delivered at home." },
      { property: "og:title", content: "Services — Nupun Home Health Care" },
      { property: "og:description", content: "Nursing, physiotherapy, elder care and more." },
      { property: "og:url", content: "/services" },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
  component: ServicesIndex,
});

function ServicesIndex() {
  const { data, isLoading } = useQuery(servicesQ({ limit: 60 }));
  const items = data?.items ?? [];
  return (
    <>
      <PageHero
        eyebrow="Our services"
        title="Care, built around your family."
        description="From nurses and physios to overnight attendants — every service is medically supervised and precisely matched to your needs."
        crumbs={[{ label: "Home", to: "/" }, { label: "Services" }]}
      />
      <Section className="pt-4">
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-72 rounded-3xl border border-border bg-surface animate-pulse" />
            ))}
          </div>
        ) : items.length ? (
          <StaggerGroup className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((s) => (<StaggerItem key={s.id}><ServiceCard service={s} /></StaggerItem>))}
          </StaggerGroup>
        ) : (
          <EmptyState
            title="Services will appear here"
            description="Our team is finalising the catalogue — please check back soon."
          />
        )}
        <div className="mt-16 text-center text-sm text-muted-foreground">
          Don't see what you need? <Link to="/contact" className="text-accent font-medium">Talk to a care advisor →</Link>
        </div>
      </Section>
    </>
  );
}
