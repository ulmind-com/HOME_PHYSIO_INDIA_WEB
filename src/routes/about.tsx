import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  HeartPulse,
  ShieldCheck,
  Sparkles,
  Users,
  ArrowRight,
  Phone,
  ClipboardCheck,
  UserCheck,
  Stethoscope,
  BadgeCheck,
} from "lucide-react";
import { settingsQ, reviewSummaryQ } from "@/lib/api/queries";
import { PageHero } from "@/components/site/PageHero";
import { Section, SectionHeader } from "@/components/site/Section";
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

const VALUES = [
  { icon: HeartPulse, title: "Care first, always", body: "Every decision starts with what's right for the patient — not what's easy." },
  { icon: ShieldCheck, title: "Clinical rigour", body: "Protocols, audits and continuous training keep our care safe and consistent." },
  { icon: Sparkles, title: "Warm hospitality", body: "Care shouldn't feel clinical. Our caregivers bring warmth, patience and presence." },
  { icon: Users, title: "Family, involved", body: "We keep families informed and empowered — you're part of the care team." },
];

const PROCESS = [
  { icon: Phone, step: "01", title: "Book a consultation", body: "Tell us your needs over a call or online. A care expert listens and advises — no pressure." },
  { icon: ClipboardCheck, step: "02", title: "Get a custom care plan", body: "We shape a personalised plan around the condition, schedule and budget, with clear pricing." },
  { icon: UserCheck, step: "03", title: "Meet your caregiver", body: "You're matched with a verified, trained and compassionate professional from our team." },
];

const COMMITMENTS = [
  "2-hour caregiver replacement SLA",
  "Background-verified & trained staff",
  "Clinical oversight on invasive care",
  "Transparent hourly / daily pricing",
  "WhatsApp shift updates & vitals",
  "24/7 care desk, always reachable",
];

function AboutPage() {
  const { data: settings } = useQuery(settingsQ());
  const { data: reviews } = useQuery(reviewSummaryQ());

  const phone = settings?.phone?.replace(/[^\d+]/g, "");
  const rating = reviews?.average_rating ? `${reviews.average_rating.toFixed(1)}★` : "4.9★";

  const stats = [
    { k: "10,000+", v: "Families served" },
    { k: "50k+", v: "Visits completed" },
    { k: rating, v: "Average rating" },
    { k: "< 2 hrs", v: "Average response" },
  ];

  return (
    <>
      <PageHero
        eyebrow="About Nupun"
        title="Home care, thoughtfully re-designed."
        description="Nupun was built for the moment your loved one comes home from the hospital — or simply needs steady, skilled hands nearby. We combine clinical rigour with unusual warmth."
        crumbs={[{ label: "Home", to: "/" }, { label: "About" }]}
        badges={[`${rating} rated`, "Certified staff", "24/7 available"]}
        actions={
          <>
            <Link
              to="/booking"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-7 py-3.5 text-sm font-semibold text-primary shadow-[0_16px_36px_-18px_rgba(0,0,0,0.6)] transition-transform hover:-translate-y-0.5"
            >
              Book a consult <ArrowRight className="h-4 w-4" />
            </Link>
            {phone && (
              <a
                href={`tel:${phone}`}
                className="inline-flex items-center gap-2 rounded-lg border border-white/40 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/20"
              >
                <Phone className="h-4 w-4" /> Call now
              </a>
            )}
          </>
        }
      />

      {/* ── Story + values ───────────────────────────────────── */}
      <Section className="pt-16 lg:pt-24">
        <div className="grid items-start gap-12 lg:grid-cols-12">
          <div className="space-y-6 text-base leading-relaxed text-foreground/90 lg:col-span-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">
              <Stethoscope className="h-3.5 w-3.5" /> Our story
            </div>
            <h2 className="font-display text-3xl tracking-tight text-foreground md:text-4xl">
              The best care doesn't happen in corridors — it happens at home.
            </h2>
            <p>
              Nupun began with a simple observation: the best care is delivered by people who show up on
              time, know exactly what they're doing, and treat every family with respect.
            </p>
            <p>
              We recruit less than 4% of nurses who apply. Every caregiver is background-checked, clinically
              assessed and continuously trained. Every case is supervised by a senior nurse or doctor. And
              every piece of equipment we rent is sanitised, insured and delivery-tracked.
            </p>
            <p className="text-foreground font-medium">
              What we're building is quiet but ambitious: the most trusted home-care brand in the country —
              one well-cared-for family at a time.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-6">
            {VALUES.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.05}>
                <div className="h-full rounded-3xl border border-border bg-surface p-6 hover-glow">
                  <div className="grid h-11 w-11 place-items-center rounded-2xl bg-primary-soft text-accent">
                    <v.icon className="h-5 w-5" />
                  </div>
                  <div className="mt-4 font-display text-lg">{v.title}</div>
                  <div className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{v.body}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* ── Stat band ────────────────────────────────────────── */}
      <div className="container-x pb-4">
        <div className="grid grid-cols-2 gap-4 rounded-[2rem] border border-border/60 bg-primary-soft/50 p-6 lg:grid-cols-4 lg:p-10">
          {stats.map((s, i) => (
            <motion.div
              key={s.v}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="text-center"
            >
              <div className="font-display text-4xl tracking-tight text-primary md:text-5xl">{s.k}</div>
              <div className="mt-2 text-sm font-medium text-foreground/70">{s.v}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── How it works ─────────────────────────────────────── */}
      <Section>
        <SectionHeader
          align="center"
          eyebrow="How it works"
          title="Getting started is easy"
          description="Three simple steps to arrange compassionate, skilled care for your loved ones."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {PROCESS.map((p, i) => (
            <Reveal key={p.step} delay={i * 0.08}>
              <div className="relative h-full rounded-3xl border border-border bg-surface p-8 hover-glow">
                <div className="font-display text-5xl text-primary/15">{p.step}</div>
                <div className="-mt-6 grid h-12 w-12 place-items-center rounded-2xl bg-primary text-primary-foreground">
                  <p.icon className="h-5 w-5" />
                </div>
                <div className="mt-5 font-display text-xl">{p.title}</div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ── Commitment (dark band) ───────────────────────────── */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "linear-gradient(135deg, var(--accent), color-mix(in oklab, var(--primary) 80%, black 8%))",
          }}
        />
        <div className="container-x py-20 text-primary-foreground lg:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]">
                <BadgeCheck className="h-3.5 w-3.5" /> Our commitment to excellence
              </div>
              <h2 className="font-display text-4xl tracking-tight md:text-5xl">
                Standards we won't compromise on.
              </h2>
              <p className="mt-5 max-w-lg text-white/80">
                We go beyond standard care to protect your peace of mind and your loved one's well-being —
                every visit, every time.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {COMMITMENTS.map((c, i) => (
                <motion.div
                  key={c}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.05 }}
                  className="flex items-start gap-3 rounded-2xl border border-white/15 bg-white/10 p-4 text-sm backdrop-blur"
                >
                  <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-white" />
                  <span className="text-white/90">{c}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <Section>
        <div className="rounded-[2.5rem] border border-border bg-gradient-to-br from-primary-soft to-surface p-10 text-center lg:p-16">
          <h2 className="font-display text-4xl md:text-5xl">Care that shows up.</h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Talk to a care advisor — we'll match the right nurse or equipment to your family's needs, usually
            within two hours.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/booking" className="rounded-full bg-foreground px-6 py-3.5 text-sm font-medium text-background">
              Book care
            </Link>
            <Link to="/contact" className="rounded-full border border-border bg-surface px-6 py-3.5 text-sm font-medium">
              Contact us
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
