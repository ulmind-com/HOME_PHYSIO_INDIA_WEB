import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { serviceBySlugQ } from "@/lib/api/queries";
import { PageHero } from "@/components/site/PageHero";
import { Section } from "@/components/site/Section";
import { BookingForm } from "@/components/forms/BookingForm";
import { Check } from "lucide-react";

export const Route = createFileRoute("/services/$slug")({
  loader: async ({ params, context }) => {
    try {
      const svc = await context.queryClient.ensureQueryData(serviceBySlugQ(params.slug));
      return {
        title: svc.title,
        description: svc.short_description ?? svc.description ?? undefined,
        image: (typeof svc.featured_image === 'string' ? svc.featured_image : svc.featured_image?.url) ?? undefined,
      };
    } catch {
      throw notFound();
    }
  },
  head: ({ loaderData, params }) => ({
    meta: [
      { title: `${loaderData?.title ?? "Service"} — Home Physio India` },
      {
        name: "description",
        content: loaderData?.description ?? "Home health care service by Home Physio India.",
      },
      { property: "og:title", content: loaderData?.title ?? "Service" },
      { property: "og:description", content: loaderData?.description ?? "" },
      { property: "og:url", content: `/services/${params.slug}` },
      ...(loaderData?.image
        ? [
            { property: "og:image", content: loaderData.image },
            { name: "twitter:image", content: loaderData.image },
          ]
        : []),
    ],
    links: [{ rel: "canonical", href: `/services/${params.slug}` }],
  }),
  component: ServiceDetail,
});

function ServiceDetail() {
  const { slug } = Route.useParams();
  const { data: service } = useQuery(serviceBySlugQ(slug));
  if (!service) return null;

  return (
    <>
      <PageHero
        eyebrow={service.category_name ?? "Service"}
        title={service.title}
        description={service.short_description ?? undefined}
        crumbs={[
          { label: "Home", to: "/" },
          { label: "Services", to: "/services" },
          { label: service.title },
        ]}
      />
      <Section className="pt-4">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7 space-y-8">
            {service.featured_image && (
              <div className="overflow-hidden rounded-3xl border border-border">
                <img
                  src={typeof service.featured_image === 'string' ? service.featured_image : service.featured_image.url}
                  alt={service.title}
                  className="w-full h-auto object-cover"
                />
              </div>
            )}
            {service.description && (
              <article className="prose prose-neutral max-w-none">
                <div className="text-base leading-relaxed text-foreground/90 whitespace-pre-line">
                  {service.description}
                </div>
              </article>
            )}
            {service.features && service.features.length > 0 && (
              <div>
                <h3 className="font-display text-2xl mb-4">What's included</h3>
                <ul className="grid gap-3 md:grid-cols-2">
                  {service.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-3 rounded-2xl border border-border bg-surface p-4"
                    >
                      <Check className="mt-0.5 h-4 w-4 text-primary shrink-0" />
                      <span className="text-sm">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {service.gallery && service.gallery.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {service.gallery.map((g) => (
                  <img
                    key={g}
                    src={g}
                    alt=""
                    className="aspect-square w-full rounded-2xl object-cover"
                    loading="lazy"
                  />
                ))}
              </div>
            )}
          </div>
          <div className="lg:col-span-5">
            <div className="sticky top-24 space-y-5">
              {service.price && (
                <div className="rounded-3xl border border-border bg-gradient-to-br from-primary-soft to-surface p-6">
                  <div className="text-xs uppercase tracking-widest text-accent">Starting at</div>
                  <div className="mt-1 font-display text-4xl">
                    ₹{service.price.toLocaleString()}
                    {service.price_unit && (
                      <span className="text-base text-muted-foreground">
                        {" "}
                        / {service.price_unit}
                      </span>
                    )}
                  </div>
                </div>
              )}
              <div>
                <h3 className="font-display text-2xl mb-4">Book this service</h3>
                <BookingForm presetServiceSlug={service.slug} />
              </div>
              <div className="text-center text-sm text-muted-foreground">
                Prefer to talk?{" "}
                <Link to="/contact" className="text-accent font-medium">
                  Contact us →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
