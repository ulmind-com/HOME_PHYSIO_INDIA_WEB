import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { careersQ } from "@/lib/api/queries";
import { PageHero } from "@/components/site/PageHero";
import { EmptyState, Section } from "@/components/site/Section";
import { ArrowUpRight, MapPin, Briefcase } from "lucide-react";

export const Route = createFileRoute("/careers/")({
  head: () => ({
    meta: [
      { title: "Careers — Join Nupun Home Health Care" },
      { name: "description", content: "Join a caregiving team where clinical excellence meets compassion. Open roles for nurses, physios and more." },
      { property: "og:title", content: "Careers — Nupun Home Health Care" },
      { property: "og:description", content: "Open roles for nurses, physios and care coordinators." },
      { property: "og:url", content: "/careers" },
    ],
    links: [{ rel: "canonical", href: "/careers" }],
  }),
  component: CareersIndex,
});

function CareersIndex() {
  const { data, isLoading } = useQuery(careersQ({ limit: 60 }));
  const items = data?.items ?? [];
  return (
    <>
      <PageHero
        eyebrow="Careers"
        title="Do the most meaningful work of your life."
        description="We're building a team of caregivers who bring skill, warmth and integrity to every home visit."
        crumbs={[{ label: "Home", to: "/" }, { label: "Careers" }]}
      />
      <Section className="pt-4">
        {isLoading ? (
          <div className="grid gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-28 rounded-3xl border border-border bg-surface animate-pulse" />
            ))}
          </div>
        ) : items.length ? (
          <div className="grid gap-4">
            {items.map((c) => (
              <Link
                key={c.id}
                to="/careers/$slug"
                params={{ slug: c.slug }}
                className="group flex items-center justify-between gap-6 rounded-3xl border border-border bg-surface p-6 md:p-7 hover-glow hover:border-primary/60"
              >
                <div className="min-w-0">
                  {c.category_name && (
                    <div className="text-xs uppercase tracking-[0.18em] text-accent">{c.category_name}</div>
                  )}
                  <div className="mt-1 font-display text-2xl truncate">{c.title}</div>
                  <div className="mt-2 flex flex-wrap gap-4 text-xs text-muted-foreground">
                    {c.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {c.location}</span>}
                    {c.employment_type && <span className="flex items-center gap-1"><Briefcase className="h-3 w-3" /> {c.employment_type}</span>}
                    {c.experience && <span>{c.experience} experience</span>}
                  </div>
                </div>
                <span className="hidden sm:grid h-11 w-11 place-items-center rounded-full bg-foreground text-background transition-transform group-hover:rotate-45">
                  <ArrowUpRight className="h-5 w-5" />
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState title="No open roles right now" description="Send us your resume — we'll reach out when a fit opens up." />
        )}
      </Section>
    </>
  );
}
