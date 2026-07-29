import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Truck, ShieldCheck, Sparkles, ArrowRight, Phone } from "lucide-react";
import { equipmentQ, settingsQ } from "@/lib/api/queries";
import { PageHero } from "@/components/site/PageHero";
import { EquipmentCard } from "@/components/site/cards/EquipmentCard";
import { EmptyState, Section, SectionHeader } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";

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

const PERKS = [
  { icon: Truck, title: "Same-day delivery", body: "Ordered before noon? Most units are delivered and installed the same day across the city." },
  { icon: ShieldCheck, title: "Sanitised & insured", body: "Every unit is hospital-grade sanitised, serviced and insured before it reaches your door." },
  { icon: Sparkles, title: "Flexible durations", body: "Rent by the day, week or month — extend or return anytime, no long lock-ins." },
];

function EquipmentIndex() {
  const { data, isLoading } = useQuery(equipmentQ({ limit: 60 }));
  const { data: settings } = useQuery(settingsQ());
  const items = data?.items ?? [];
  const phone = settings?.phone?.replace(/[^\d+]/g, "");

  return (
    <>
      <PageHero
        eyebrow="Equipment rental"
        title="Hospital-grade equipment, at home."
        description="Oxygen concentrators, hospital beds, wheelchairs and more — sanitised, insured and delivered, usually the same day."
        crumbs={[{ label: "Home", to: "/" }, { label: "Equipment" }]}
        badges={["Same-day delivery", "Sanitised & insured", "Flexible durations"]}
        actions={
          phone ? (
            <a
              href={`tel:${phone}`}
              className="inline-flex items-center gap-2 rounded-lg bg-white px-7 py-3.5 text-sm font-semibold text-primary shadow-[0_16px_36px_-18px_rgba(0,0,0,0.6)] transition-transform hover:-translate-y-0.5"
            >
              <Phone className="h-4 w-4" /> Request equipment
            </a>
          ) : undefined
        }
      />

      {/* ── Why rent from Nupun ──────────────────────────────── */}
      <Section className="pt-16 lg:pt-20">
        <div className="grid gap-6 md:grid-cols-3">
          {PERKS.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.07}>
              <div className="h-full rounded-3xl border border-border bg-surface p-7 hover-glow">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary-soft text-accent">
                  <p.icon className="h-5 w-5" />
                </div>
                <div className="mt-5 font-display text-xl">{p.title}</div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ── Catalogue ────────────────────────────────────────── */}
      <Section className="pt-0">
        <SectionHeader
          eyebrow="Catalogue"
          title="Browse the rental catalogue"
          description="Every unit is delivery-tracked and backed by our care desk if anything needs attention."
        />
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-72 rounded-3xl border border-border bg-surface animate-pulse" />
            ))}
          </div>
        ) : items.length ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((e) => (
              <EquipmentCard key={e.id} equipment={e} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Equipment catalogue coming soon"
            description="We're adding units to the rental catalogue — talk to our team for immediate availability."
          />
        )}
      </Section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <Section className="pt-0">
        <div className="flex flex-col items-center justify-between gap-6 rounded-[2rem] border border-border bg-gradient-to-br from-primary-soft to-surface p-8 text-center lg:flex-row lg:p-12 lg:text-left">
          <div>
            <h2 className="font-display text-2xl tracking-tight md:text-3xl">Need a unit urgently?</h2>
            <p className="mt-2 max-w-lg text-muted-foreground">
              Tell us what you need — we'll confirm availability and delivery time, often within the hour.
            </p>
          </div>
          <Link
            to="/contact"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-foreground px-6 py-3.5 text-sm font-medium text-background"
          >
            Request equipment <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Section>
    </>
  );
}
