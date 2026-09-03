import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BadgeCheck } from "lucide-react";

import { PageHero } from "@/components/site/PageHero";
import { Section, SectionHeader } from "@/components/site/Section";
import { SERVICES } from "@/lib/plan";
import { serviceArtwork, pageHeroImage } from "@/lib/placeholders";

export const Route = createFileRoute("/services/")({
  head: () => ({
    meta: [
      { title: "Our services — Home Physio India" },
      {
        name: "description",
        content:
          "Home physiotherapy, yoga therapy, massage therapy and home rehabilitation delivered across West Bengal by verified therapists.",
      },
      { property: "og:title", content: "Our services — Home Physio India" },
      { property: "og:url", content: "/services" },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
  component: ServicesIndex,
});

function ServicesIndex() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Four ways we bring recovery home"
        description="Every service is delivered at your address by a document-verified therapist, priced transparently before you book."
        image={pageHeroImage("services")}
        crumbs={[{ label: "Home", to: "/" }, { label: "Services" }]}
      />

      <Section>
        <SectionHeader
          eyebrow="What we do"
          title="Choose the care that fits your condition"
          description="Not sure which one you need? Book a physiotherapy assessment — your therapist will recommend the right path."
          align="center"
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((s) => (
            <div
              key={s.category}
              className="group flex flex-col overflow-hidden rounded-3xl border border-border/70 bg-card transition hover:shadow-elegant"
            >
              {/* Image with title overlay */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={serviceArtwork(s.category)}
                  alt={s.name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.05]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <h3 className="absolute bottom-4 left-5 right-5 font-display text-lg font-medium text-white leading-tight tracking-tight">
                  {s.name}
                </h3>
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col p-5">
                <p className="text-xs uppercase tracking-[0.18em] text-primary mb-3">
                  {s.tagline}
                </p>
                <ul className="flex-1 space-y-2.5">
                  {s.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-2.5 text-[13px] text-muted-foreground leading-snug">
                      <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>

                {/* Price & Duration */}
                <div className="mt-4 flex items-center gap-2 border-t border-border/50 pt-4">
                  <span className="text-sm font-semibold">from ₹{s.startingAt}</span>
                  <span className="text-xs text-muted-foreground">· {s.duration}</span>
                </div>

                {/* CTA Button */}
                <Link
                  to="/services/$slug"
                  params={{ slug: s.slug }}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 hover:-translate-y-0.5"
                >
                  Explore
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}

