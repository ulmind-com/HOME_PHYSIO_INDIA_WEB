import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight, MapPin, Briefcase, GraduationCap, HeartHandshake, TrendingUp, ShieldCheck } from "lucide-react";
import { careersQ } from "@/lib/api/queries";
import { PageHero } from "@/components/site/PageHero";
import { EmptyState, Section, SectionHeader } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";

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

const PERKS = [
  { icon: TrendingUp, title: "Real growth", body: "Structured training, certifications and a clear path from attendant to senior nurse." },
  { icon: ShieldCheck, title: "Respect & safety", body: "Fair pay, on-time payouts, insurance and a team that has your back on every shift." },
  { icon: GraduationCap, title: "Learn continuously", body: "Access our NCR training hub and clinical mentorship from senior practitioners." },
  { icon: HeartHandshake, title: "Meaningful work", body: "Care for people who need you most — and go home knowing the day mattered." },
];

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
        badges={["Training & certification", "On-time payouts", "Insurance covered"]}
      />

      {/* Open roles */}
      <Section className="pt-16 lg:pt-20">
        <SectionHeader eyebrow="Open roles" title="Positions we're hiring for" />
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
                className="group flex items-center justify-between gap-6 rounded-3xl border border-border bg-surface p-6 hover-glow hover:border-primary/60 md:p-7"
              >
                <div className="min-w-0">
                  {c.category_name && (
                    <div className="text-xs uppercase tracking-[0.18em] text-accent">{c.category_name}</div>
                  )}
                  <div className="mt-1 truncate font-display text-2xl">{c.title}</div>
                  <div className="mt-2 flex flex-wrap gap-4 text-xs text-muted-foreground">
                    {c.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {c.location}
                      </span>
                    )}
                    {c.employment_type && (
                      <span className="flex items-center gap-1">
                        <Briefcase className="h-3 w-3" /> {c.employment_type}
                      </span>
                    )}
                    {c.experience && <span>{c.experience} experience</span>}
                  </div>
                </div>
                <span className="hidden h-11 w-11 place-items-center rounded-full bg-foreground text-background transition-transform group-hover:rotate-45 sm:grid">
                  <ArrowUpRight className="h-5 w-5" />
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState title="No open roles right now" description="Send us your resume — we'll reach out when a fit opens up." />
        )}
      </Section>

      {/* Why join */}
      <Section className="pt-0">
        <SectionHeader align="center" eyebrow="Why Nupun" title="A place worth building a career" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {PERKS.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.06}>
              <div className="h-full rounded-3xl border border-border bg-surface p-7 hover-glow">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary-soft text-accent">
                  <p.icon className="h-5 w-5" />
                </div>
                <div className="mt-5 font-display text-lg">{p.title}</div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section className="pt-0">
        <div className="rounded-[2.5rem] border border-border bg-gradient-to-br from-primary-soft to-surface p-10 text-center lg:p-16">
          <h2 className="font-display text-3xl md:text-4xl">Don't see your role?</h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            We're always looking for exceptional caregivers. Tell us about yourself and we'll be in touch when
            the right opening appears.
          </p>
          <Link
            to="/contact"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3.5 text-sm font-medium text-background"
          >
            Send your resume <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </Section>
    </>
  );
}
