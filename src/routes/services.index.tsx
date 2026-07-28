import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Clock3, BadgeCheck, ArrowRight, Search } from "lucide-react";
import { servicesQ, testimonialsQ } from "@/lib/api/queries";
import { Section } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { ServicesBento } from "@/components/site/services/ServicesBento";

export const Route = createFileRoute("/services/")({
  head: () => ({
    meta: [
      { title: "Services — Nupun Home Health Care" },
      { name: "description", content: "Nurses, physios, elder care, post-op recovery and more — medically supervised care delivered at home." },
      { property: "og:title", content: "Services — Nupun Home Health Care" },
      { property: "og:description", content: "Medically supervised home care — nurses, physios, elder care and more." },
      { property: "og:url", content: "/services" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
  component: ServicesIndex,
});

const PROOF = [
  { icon: Clock3, label: "24 / 7 care desk", detail: "Answer within 90 seconds" },
  { icon: ShieldCheck, label: "Verified professionals", detail: "Background + skill audited" },
  { icon: BadgeCheck, label: "2‑hour replacement", detail: "Zero-gap guarantee" },
];

const STEPS = [
  { n: "01", t: "Enquire", d: "Tell us the situation in two minutes." },
  { n: "02", t: "Assess", d: "A senior nurse builds the care brief." },
  { n: "03", t: "Match", d: "Best-fit professional confirmed with you." },
  { n: "04", t: "Care", d: "Daily oversight, weekly clinical reviews." },
];

function ServicesIndex() {
  const { data, isLoading } = useQuery(servicesQ({ limit: 60 }));
  const { data: tData } = useQuery(testimonialsQ({ limit: 8 }));
  const items = data?.items ?? [];
  const testimonials = tData?.items ?? [];

  const [active, setActive] = useState<string>("all");

  const categories = useMemo(() => {
    const set = new Set<string>();
    items.forEach((s) => s.category_name && set.add(s.category_name));
    return ["all", ...Array.from(set)];
  }, [items]);

  const filtered = useMemo(() => {
    if (active === "all") return items;
    return items.filter((s) => s.category_name === active);
  }, [items, active]);

  return (
    <>
      {/* Editorial hero */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(60% 50% at 15% 10%, color-mix(in oklab, var(--primary) 18%, transparent), transparent 70%), radial-gradient(45% 40% at 90% 30%, color-mix(in oklab, var(--accent) 15%, transparent), transparent 70%), linear-gradient(180deg, var(--background), var(--surface))",
          }}
        />
        <div className="container-x pt-32 pb-16 lg:pt-40 lg:pb-24">
          <nav aria-label="Breadcrumb" className="mb-8 text-xs text-muted-foreground flex items-center gap-2">
            <Link to="/" className="hover:text-foreground">Home</Link>
            <span>/</span>
            <span className="text-foreground/70">Services</span>
          </nav>

          <div className="grid lg:grid-cols-[1.3fr_1fr] gap-14 items-end">
            <Reveal>
              <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-white/60 backdrop-blur-md px-3 py-1 text-[11px] font-medium text-muted-foreground mb-6">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" /> The Nupun catalogue
              </div>
              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl tracking-tight leading-[1.02]">
                Care, <em className="not-italic text-primary">engineered</em> around your life.
              </h1>
              <p className="mt-6 max-w-xl text-base md:text-lg text-muted-foreground leading-relaxed">
                Every service below is medically supervised, matched by a senior nurse, and delivered at home with the calm of a five‑star hospital.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  to="/booking"
                  className="inline-flex items-center gap-2 rounded-full bg-foreground text-background px-6 py-3 text-sm font-medium hover:bg-primary transition-colors"
                >
                  Book a consult <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-white/70 backdrop-blur px-6 py-3 text-sm font-medium hover:bg-white"
                >
                  Talk to an advisor
                </Link>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="space-y-3">
                {PROOF.map(({ icon: Icon, label, detail }) => (
                  <div
                    key={label}
                    className="flex items-center gap-4 rounded-2xl border border-white/50 bg-white/50 backdrop-blur-xl px-5 py-4 shadow-[0_20px_40px_-30px_color-mix(in_oklab,var(--primary)_35%,transparent)]"
                  >
                    <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" strokeWidth={1.6} />
                    </div>
                    <div>
                      <div className="font-display text-base leading-tight">{label}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{detail}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Sticky category rail */}
      {categories.length > 1 && (
        <div className="sticky top-20 z-30">
          <div className="container-x">
            <div className="flex items-center gap-3 overflow-x-auto rounded-full border border-white/60 bg-white/60 backdrop-blur-2xl px-3 py-2 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.15)]">
              <Search className="h-4 w-4 text-muted-foreground shrink-0 ml-2" />
              {categories.map((c) => {
                const isActive = c === active;
                return (
                  <button
                    key={c}
                    onClick={() => setActive(c)}
                    className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
                      isActive
                        ? "bg-foreground text-background"
                        : "text-muted-foreground hover:text-foreground hover:bg-white"
                    }`}
                  >
                    {c === "all" ? "All services" : c}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Bento showcase */}
      <Section className="pt-10">
        {isLoading ? (
          <div className="space-y-6">
            <div className="h-[420px] rounded-[2rem] border border-border bg-surface animate-pulse" />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-72 rounded-3xl border border-border bg-surface animate-pulse" />
              ))}
            </div>
          </div>
        ) : filtered.length ? (
          <ServicesBento items={filtered} />
        ) : (
          <div className="rounded-3xl border border-dashed border-border bg-surface/50 p-16 text-center">
            <div className="font-display text-2xl">Nothing here yet</div>
            <p className="mt-2 text-sm text-muted-foreground">Try another category, or talk to an advisor.</p>
          </div>
        )}

        <div className="mt-16 text-center text-sm text-muted-foreground">
          Don't see what you need?{" "}
          <Link to="/contact" className="text-accent font-medium underline-offset-4 hover:underline">
            Talk to a care advisor →
          </Link>
        </div>
      </Section>

      {/* How care arrives */}
      <section className="border-t border-border/60">
        <div className="container-x py-24 lg:py-32">
          <Reveal>
            <div className="max-w-2xl mb-14">
              <div className="text-[10px] uppercase tracking-[0.24em] text-accent mb-3">The process</div>
              <h2 className="font-display text-4xl md:text-5xl tracking-tight leading-tight">
                How care arrives at your door.
              </h2>
            </div>
          </Reveal>
          <div className="relative grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-6">
            <div className="hidden md:block absolute top-6 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            {STEPS.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="relative"
              >
                <div className="font-display text-sm text-accent tracking-[0.2em] mb-3">{s.n}</div>
                <div className="font-display text-2xl tracking-tight">{s.t}</div>
                <p className="mt-2 text-sm text-muted-foreground max-w-[220px] leading-relaxed">{s.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial marquee (live data only) */}
      {testimonials.length > 0 && (
        <section className="border-t border-border/60 bg-surface/60 overflow-hidden">
          <div className="container-x pt-20 pb-6">
            <div className="text-[10px] uppercase tracking-[0.24em] text-accent mb-3">Trusted at home</div>
            <h2 className="font-display text-3xl md:text-4xl tracking-tight max-w-2xl">
              Families across India, in their own words.
            </h2>
          </div>
          <div className="relative py-10">
            <div className="flex gap-6 animate-[marquee_50s_linear_infinite] hover:[animation-play-state:paused]">
              {[...testimonials, ...testimonials].map((t, i) => (
                <figure
                  key={`${t.id}-${i}`}
                  className="shrink-0 w-[340px] md:w-[400px] rounded-3xl border border-border/60 bg-background p-6"
                >
                  <blockquote className="text-sm text-foreground/85 leading-relaxed line-clamp-5">
                    "{t.content ?? t.message}"
                  </blockquote>
                  <figcaption className="mt-5 flex items-center gap-3">
                    {(t.avatar || t.image) && (
                      <img src={t.avatar ?? t.image ?? ""} alt={t.name} className="h-10 w-10 rounded-full object-cover" />
                    )}
                    <div>
                      <div className="font-display text-sm">{t.name}</div>
                      {(t.role || t.designation) && (
                        <div className="text-xs text-muted-foreground">{t.role ?? t.designation}</div>
                      )}
                    </div>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA band */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(70% 60% at 20% 30%, color-mix(in oklab, var(--primary) 35%, transparent), transparent 70%), linear-gradient(135deg, oklch(0.28 0.05 200), oklch(0.22 0.04 210))",
          }}
        />
        <div className="container-x py-24 lg:py-28 text-background">
          <div className="max-w-3xl">
            <div className="text-[10px] uppercase tracking-[0.24em] text-background/70 mb-4">Not sure which service fits?</div>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl tracking-tight leading-[1.05]">
              Speak with a senior nurse. <em className="not-italic text-primary-glow">Free, in 15 minutes.</em>
            </h2>
            <p className="mt-5 text-background/75 max-w-xl">
              Describe the situation once — we'll shape a care plan and share pricing before the call ends.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/booking"
                className="inline-flex items-center gap-2 rounded-full bg-background text-foreground px-6 py-3 text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                Book a consult <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-background/30 px-6 py-3 text-sm font-medium hover:bg-background/10"
              >
                Message an advisor
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
