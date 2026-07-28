import { createFileRoute, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { equipmentBySlugQ } from "@/lib/api/queries";
import { PageHero } from "@/components/site/PageHero";
import { Section } from "@/components/site/Section";
import { RentalForm } from "@/components/forms/RentalForm";
import { Check } from "lucide-react";

export const Route = createFileRoute("/equipment/$slug")({
  loader: async ({ params, context }) => {
    try {
      const e = await context.queryClient.ensureQueryData(equipmentBySlugQ(params.slug));
      return { title: e.title, description: e.short_description ?? undefined, image: e.featured_image ?? undefined };
    } catch {
      throw notFound();
    }
  },
  head: ({ loaderData, params }) => ({
    meta: [
      { title: `${loaderData?.title ?? "Equipment"} — Rent from Nupun` },
      { name: "description", content: loaderData?.description ?? "Medical equipment for rent." },
      { property: "og:title", content: loaderData?.title ?? "Equipment" },
      { property: "og:description", content: loaderData?.description ?? "" },
      { property: "og:url", content: `/equipment/${params.slug}` },
      ...(loaderData?.image ? [
        { property: "og:image", content: loaderData.image },
        { name: "twitter:image", content: loaderData.image },
      ] : []),
    ],
    links: [{ rel: "canonical", href: `/equipment/${params.slug}` }],
  }),
  component: EquipmentDetail,
});

function EquipmentDetail() {
  const { slug } = Route.useParams();
  const { data: e } = useQuery(equipmentBySlugQ(slug));
  if (!e) return null;
  const price = e.rental_price ?? e.daily_rate;

  return (
    <>
      <PageHero
        eyebrow={e.category_name ?? "Equipment"}
        title={e.title}
        description={e.short_description ?? undefined}
        crumbs={[{ label: "Home", to: "/" }, { label: "Equipment", to: "/equipment" }, { label: e.title }]}
      />
      <Section className="pt-4">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7 space-y-8">
            {e.featured_image && (
              <div className="overflow-hidden rounded-3xl border border-border">
                <img src={e.featured_image} alt={e.title} className="w-full h-auto" />
              </div>
            )}
            {e.description && (
              <div className="text-base leading-relaxed text-foreground/90 whitespace-pre-line">
                {e.description}
              </div>
            )}
            {e.features && e.features.length > 0 && (
              <div>
                <h3 className="font-display text-2xl mb-4">Features</h3>
                <ul className="grid gap-3 md:grid-cols-2">
                  {e.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 rounded-2xl border border-border bg-surface p-4">
                      <Check className="mt-0.5 h-4 w-4 text-primary shrink-0" />
                      <span className="text-sm">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {e.specs && Object.keys(e.specs).length > 0 && (
              <div>
                <h3 className="font-display text-2xl mb-4">Specifications</h3>
                <div className="rounded-3xl border border-border bg-surface divide-y divide-border overflow-hidden">
                  {Object.entries(e.specs).map(([k, v]) => (
                    <div key={k} className="grid grid-cols-2 gap-4 px-5 py-3 text-sm">
                      <div className="text-muted-foreground">{k}</div>
                      <div className="font-medium">{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="lg:col-span-5">
            <div className="sticky top-24 space-y-5">
              {price && (
                <div className="rounded-3xl border border-border bg-gradient-to-br from-primary-soft to-surface p-6">
                  <div className="text-xs uppercase tracking-widest text-accent">Rental price</div>
                  <div className="mt-1 font-display text-4xl">
                    ₹{price.toLocaleString()}
                    <span className="text-base text-muted-foreground"> / {e.price_unit ?? "day"}</span>
                  </div>
                </div>
              )}
              <div className="rounded-3xl border border-border bg-surface p-6">
                <h3 className="font-display text-2xl mb-4">Request this equipment</h3>
                <RentalForm equipmentId={e.id} />
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
