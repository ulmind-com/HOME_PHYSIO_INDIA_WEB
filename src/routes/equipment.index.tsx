import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { equipmentQ } from "@/lib/api/queries";
import { PageHero } from "@/components/site/PageHero";
import { EquipmentCard } from "@/components/site/cards/EquipmentCard";
import { EmptyState, Section } from "@/components/site/Section";

export const Route = createFileRoute("/equipment/")({
  head: () => ({
    meta: [
      { title: "Medical Equipment Rental — Nupun Home Health Care" },
      { name: "description", content: "Rent oxygen concentrators, hospital beds, wheelchairs and more, delivered and sanitised." },
      { property: "og:title", content: "Medical Equipment Rental — Nupun" },
      { property: "og:description", content: "Hospital-grade equipment for home use." },
      { property: "og:url", content: "/equipment" },
    ],
    links: [{ rel: "canonical", href: "/equipment" }],
  }),
  component: EquipmentIndex,
});

function EquipmentIndex() {
  const { data, isLoading } = useQuery(equipmentQ({ limit: 60 }));
  const items = data?.items ?? [];
  return (
    <>
      <PageHero
        eyebrow="Equipment rental"
        title="Hospital-grade equipment, at home."
        description="Sanitised, insured, and delivered — usually the same day."
        crumbs={[{ label: "Home", to: "/" }, { label: "Equipment" }]}
      />
      <Section className="pt-4">
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-72 rounded-3xl border border-border bg-surface animate-pulse" />
            ))}
          </div>
        ) : items.length ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((e) => <EquipmentCard key={e.id} equipment={e} />)}
          </div>
        ) : (
          <EmptyState title="Equipment catalogue coming soon" description="We're adding units to the rental catalogue — check back shortly." />
        )}
      </Section>
    </>
  );
}
