import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { Section } from "@/components/site/Section";
import { HeartPulse, ShieldCheck, Sparkles, Users } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Nupun Home Health Care" },
      { name: "description", content: "The story, values and clinical standards behind Nupun's home care." },
      { property: "og:title", content: "About — Nupun Home Health Care" },
      { property: "og:description", content: "Our story, values and clinical standards." },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  const values = [
    { icon: HeartPulse, title: "Care first, always", body: "Every decision starts with what's right for the patient — not what's easy." },
    { icon: ShieldCheck, title: "Clinical rigour", body: "Protocols, audits and continuous training keep our care safe and consistent." },
    { icon: Sparkles, title: "Warm hospitality", body: "Care shouldn't feel clinical. Our caregivers bring warmth, patience and presence." },
    { icon: Users, title: "Family, involved", body: "We keep families informed and empowered — you're part of the care team." },
  ];
  return (
    <>
      <PageHero
        eyebrow="About"
        title="Home care, thoughtfully re-designed."
        description="Nupun was built for the moment your loved one comes home from the hospital — or simply needs steady, skilled hands nearby. We combine clinical rigour with unusual warmth."
        crumbs={[{ label: "Home", to: "/" }, { label: "About" }]}
      />
      <Section className="pt-4">
        <div className="grid gap-12 lg:grid-cols-12 items-start">
          <div className="lg:col-span-6 space-y-6 text-base leading-relaxed text-foreground/90">
            <p>
              Nupun began with a simple observation: the best care doesn't happen in hospital corridors — it
              happens at home, delivered by people who show up on time, know what they're doing, and treat every
              family with respect.
            </p>
            <p>
              We recruit less than 4% of nurses who apply. Every caregiver is background-checked, clinically
              assessed, and continuously trained. Every case is supervised by a senior nurse or doctor. And every
              piece of equipment we rent out is sanitised, insured and delivery-tracked.
            </p>
            <p>
              What we're building is quiet but ambitious: the most trusted home-care brand in the country — one
              well-cared-for family at a time.
            </p>
          </div>
          <div className="lg:col-span-6 grid gap-4 sm:grid-cols-2">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.05}>
                <div className="h-full rounded-3xl border border-border bg-surface p-6 hover-glow">
                  <div className="h-11 w-11 rounded-2xl bg-primary-soft grid place-items-center text-accent">
                    <v.icon className="h-5 w-5" />
                  </div>
                  <div className="mt-4 font-display text-lg">{v.title}</div>
                  <div className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{v.body}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      <Section className="bg-primary-soft/40">
        <div className="grid gap-10 lg:grid-cols-4">
          {[
            { k: "10,000+", v: "families served" },
            { k: "50k+", v: "visits completed" },
            { k: "4.9★", v: "average rating" },
            { k: "< 2 hrs", v: "average response" },
          ].map((s) => (
            <div key={s.v}>
              <div className="font-display text-5xl">{s.k}</div>
              <div className="mt-2 text-sm text-muted-foreground">{s.v}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <div className="rounded-[2.5rem] border border-border bg-gradient-to-br from-primary-soft to-surface p-10 lg:p-16 text-center">
          <h2 className="font-display text-4xl md:text-5xl">Care that shows up.</h2>
          <p className="mt-4 max-w-xl mx-auto text-muted-foreground">Talk to a care advisor — we'll match the right nurse or equipment to your family's needs.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/booking" className="rounded-full bg-foreground text-background px-6 py-3.5 text-sm font-medium">Book care</Link>
            <Link to="/contact" className="rounded-full border border-border bg-surface px-6 py-3.5 text-sm font-medium">Contact us</Link>
          </div>
        </div>
      </Section>
    </>
  );
}
