import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Check, ShieldCheck } from "lucide-react";

import { PageHero } from "@/components/site/PageHero";
import { Section, SectionHeader } from "@/components/site/Section";
import { FaqAccordion } from "@/components/site/FaqAccordion";
import { faqsQ } from "@/lib/api/queries";
import {
  CARE_CATEGORIES,
  DAILY_FREQUENCY,
  MACHINE_RECOMMENDATIONS,
  MASSAGE_OPTIONS,
  MODALITIES,
  PACKAGES,
  SERVICES,
  serviceBySlug,
} from "@/lib/plan";
import { equipmentIcon, serviceArtwork, SERVICE_IMAGES } from "@/lib/placeholders";

export const Route = createFileRoute("/services/$slug")({
  loader: ({ params }) => {
    const service = serviceBySlug(params.slug);
    if (!service) throw notFound();
    return { service };
  },
  head: ({ loaderData }) => {
    const name = loaderData?.service.name ?? "Service";
    return {
      meta: [
        { title: `${name} — Home Physio India` },
        { name: "description", content: loaderData?.service.description ?? "" },
        { property: "og:title", content: `${name} — Home Physio India` },
      ],
    };
  },
  component: ServiceDetail,
});

function ServiceDetail() {
  const { service } = Route.useLoaderData();
  const faqs = useQuery(faqsQ({ limit: 8 }));
  const isMassage = service.category === "massage_therapy";

  return (
    <>
      <PageHero
        eyebrow={service.tagline}
        title={service.name}
        description={service.description}
        image={serviceArtwork(service.category)}
        crumbs={[
          { label: "Home", to: "/" },
          { label: "Services", to: "/services" },
          { label: service.name },
        ]}
        badges={[
          `From ₹${service.startingAt}`,
          service.duration,
          `${service.platformFee}% platform fee`,
        ]}
        actions={
          <Link
            to="/booking"
            search={{ service: service.slug }}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
          >
            Book this service
            <ArrowRight className="h-4 w-4" />
          </Link>
        }
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
          <div>
            <SectionHeader
              eyebrow="What's included"
              title="A session built around your condition"
            />
            <ul className="space-y-4">
              {service.highlights.map((h) => (
                <li key={h} className="flex gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-soft">
                    <Check className="h-3 w-3 text-primary" />
                  </span>
                  <span className="text-sm text-foreground/80">{h}</span>
                </li>
              ))}
            </ul>
          </div>

          <aside className="rounded-3xl border border-border/70 bg-secondary/40 p-6 sm:p-8">
            <h3 className="font-display text-xl tracking-tight">Pricing at a glance</h3>
            {isMassage ? (
              <ul className="mt-5 space-y-3">
                {MASSAGE_OPTIONS.map((m) => (
                  <li
                    key={m.value}
                    className="flex items-baseline justify-between gap-4 text-sm"
                  >
                    <span className="text-foreground/80">{m.label}</span>
                    <span className="font-semibold tabular-nums">₹{m.price}</span>
                  </li>
                ))}
                <li className="border-t border-border/70 pt-3 text-xs text-muted-foreground">
                  45–60 minutes standard. Beyond 60 minutes, an additional ₹100 applies.
                  No package discounts on massage therapy.
                </li>
              </ul>
            ) : (
              <ul className="mt-5 space-y-3">
                {DAILY_FREQUENCY.map((d) => (
                  <li
                    key={d.visits}
                    className="flex items-baseline justify-between gap-4 text-sm"
                  >
                    <span className="text-foreground/80">{d.label}</span>
                    <span className="font-semibold tabular-nums">₹{d.price}</span>
                  </li>
                ))}
                <li className="flex items-baseline justify-between gap-4 text-sm">
                  <span className="text-foreground/80">Weekly / package visit</span>
                  <span className="font-semibold tabular-nums">₹400</span>
                </li>
                <li className="flex items-baseline justify-between gap-4 text-sm">
                  <span className="text-foreground/80">Each portable machine</span>
                  <span className="font-semibold tabular-nums">₹100</span>
                </li>
                <li className="border-t border-border/70 pt-3 text-xs text-muted-foreground">
                  Package visits include applicable machine use at no extra charge.
                </li>
              </ul>
            )}
            <Link
              to="/pricing"
              className="mt-6 inline-flex text-sm font-medium text-primary hover:underline"
            >
              See the full pricing breakdown →
            </Link>
          </aside>
        </div>
      </Section>

      {!isMassage && (
        <Section className="bg-secondary/30">
          <SectionHeader
            eyebrow="Portable modality library"
            title="Machines we can bring to your home"
            description="Only portable equipment travels on a home visit. Large clinic machines such as SWD and ESWT are not part of the home library."
          />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {MODALITIES.map((m) => (
              <div
                key={m.code}
                className="flex items-start gap-3 rounded-2xl border border-border/70 bg-card p-4"
              >
                <img src={equipmentIcon(m.code)} alt="" className="h-10 w-10 shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold">{m.name}</p>
                  <p className="text-xs text-muted-foreground">{m.indication}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-3xl border border-border/70 bg-card p-6 sm:p-8">
            <h3 className="font-display text-xl tracking-tight">
              Typical machine recommendations
            </h3>
            <p className="mt-1.5 text-sm text-muted-foreground">
              A starting point only — final selection follows your physiotherapist's
              assessment and any doctor's prescription you upload.
            </p>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {MACHINE_RECOMMENDATIONS.map((r) => (
                <li
                  key={r.condition}
                  className="flex items-baseline justify-between gap-4 rounded-xl bg-secondary/50 px-4 py-3 text-sm"
                >
                  <span className="font-medium">{r.condition}</span>
                  <span className="text-muted-foreground">
                    {r.codes
                      .map((c) => MODALITIES.find((m) => m.code === c)?.name ?? c)
                      .join(" / ")}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Section>
      )}

      {isMassage && (
        <Section className="bg-secondary/30">
          <div className="mx-auto max-w-2xl rounded-3xl border border-border/70 bg-card p-8 text-center">
            <ShieldCheck className="mx-auto h-8 w-8 text-primary" />
            <h3 className="mt-4 font-display text-2xl tracking-tight">
              Safety and conduct policy
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Male patients are assigned male therapists and female patients female
              therapists — this rule applies to massage therapy without exception. We do
              not provide intimate or sexual services of any kind. Any such request, from
              either side, ends the booking and the account immediately.
            </p>
          </div>
        </Section>
      )}

      {!isMassage && (
        <Section>
          <SectionHeader
            eyebrow="Care categories"
            title="We start by understanding severity"
            description="Your described condition suggests a starting care category. The final treatment plan always comes from your physiotherapist's assessment."
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CARE_CATEGORIES.map((c) => (
              <div
                key={c.key}
                className="rounded-2xl border border-border/70 bg-card p-5"
              >
                <p className="font-display text-lg">{c.label}</p>
                <p className="mt-1.5 text-sm text-muted-foreground">{c.blurb}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {!isMassage && (
        <Section className="bg-secondary/30">
          <SectionHeader
            eyebrow="Packages"
            title="Commit longer, pay per visit"
            description="Every package is billed at ₹400 per visit with applicable portable machine use included."
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {PACKAGES.map((p) => (
              <div
                key={p.value}
                className="rounded-2xl border border-border/70 bg-card p-5 text-center"
              >
                <p className="font-display text-lg">{p.label}</p>
                <p className="mt-1 text-xs text-muted-foreground">{p.months}</p>
                <p className="mt-4 font-display text-2xl text-primary">₹400</p>
                <p className="text-[11px] text-muted-foreground">per visit</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {(faqs.data?.items?.length ?? 0) > 0 && (
        <Section id="faq">
          <SectionHeader eyebrow="FAQ" title="Common questions" align="center" />
          <div className="mx-auto max-w-3xl">
            <FaqAccordion items={faqs.data!.items} />
          </div>
        </Section>
      )}

      <Section className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl tracking-tight md:text-4xl">
            Ready to start {service.name.toLowerCase()}?
          </h2>
          <p className="mt-3 text-primary-foreground/80">
            Book in five steps and see your full price before you pay.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/booking"
              search={{ service: service.slug }}
              className="inline-flex items-center gap-2 rounded-full bg-background px-6 py-3 text-sm font-semibold text-foreground transition hover:opacity-90"
            >
              Book a visit
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/video-consultation"
              className="inline-flex items-center rounded-full border border-primary-foreground/30 px-6 py-3 text-sm font-semibold transition hover:bg-primary-foreground/10"
            >
              Talk to a physio first — ₹199
            </Link>
          </div>
        </div>
      </Section>

      <div className="sr-only">
        Other services:{" "}
        {SERVICES.filter((s) => s.slug !== service.slug)
          .map((s) => s.name)
          .join(", ")}
      </div>
    </>
  );
}
