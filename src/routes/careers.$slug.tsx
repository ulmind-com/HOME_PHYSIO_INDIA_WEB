import { createFileRoute, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { careerBySlugQ } from "@/lib/api/queries";
import { PageHero } from "@/components/site/PageHero";
import { Section } from "@/components/site/Section";
import { ApplicationForm } from "@/components/forms/ApplicationForm";
import { MapPin, Briefcase, Clock } from "lucide-react";

export const Route = createFileRoute("/careers/$slug")({
  loader: async ({ params, context }) => {
    try {
      const c = await context.queryClient.ensureQueryData(careerBySlugQ(params.slug));
      return { title: c.title, description: c.short_description ?? undefined };
    } catch {
      throw notFound();
    }
  },
  head: ({ loaderData, params }) => ({
    meta: [
      { title: `${loaderData?.title ?? "Career"} — Nupun` },
      { name: "description", content: loaderData?.description ?? "Join our care team." },
      { property: "og:title", content: loaderData?.title ?? "Career" },
      { property: "og:description", content: loaderData?.description ?? "" },
      { property: "og:url", content: `/careers/${params.slug}` },
    ],
    links: [{ rel: "canonical", href: `/careers/${params.slug}` }],
  }),
  component: CareerDetail,
});

function CareerDetail() {
  const { slug } = Route.useParams();
  const { data: c } = useQuery(careerBySlugQ(slug));
  if (!c) return null;
  return (
    <>
      <PageHero
        eyebrow={c.category_name ?? "Open role"}
        title={c.title}
        description={c.short_description ?? undefined}
        crumbs={[{ label: "Home", to: "/" }, { label: "Careers", to: "/careers" }, { label: c.title }]}
      />
      <Section className="pt-4">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7 space-y-6">
            <div className="flex flex-wrap gap-3 text-sm">
              {c.location && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5">
                  <MapPin className="h-3.5 w-3.5" /> {c.location}
                </span>
              )}
              {c.employment_type && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5">
                  <Briefcase className="h-3.5 w-3.5" /> {c.employment_type}
                </span>
              )}
              {c.experience && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5">
                  <Clock className="h-3.5 w-3.5" /> {c.experience}
                </span>
              )}
            </div>
            {c.description && (
              <div className="prose prose-neutral max-w-none text-base leading-relaxed whitespace-pre-line">
                {c.description}
              </div>
            )}
          </div>
          <div className="lg:col-span-5">
            <div className="sticky top-24 rounded-3xl border border-border bg-surface p-6">
              <h3 className="font-display text-2xl mb-4">Apply for this role</h3>
              <ApplicationForm jobId={c.id} jobTitle={c.title} />
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
