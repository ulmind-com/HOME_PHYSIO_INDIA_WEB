import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Clock3,
  ArrowRight,
  Search,
  Phone,
  MessageCircle,
  HeartHandshake,
  BellRing,
  Zap,
  Star,
  Play,
  Quote,
} from "lucide-react";
import { servicesQ, testimonialsQ, faqsQ, settingsQ, videosQ } from "@/lib/api/queries";
import type { Video } from "@/lib/api/types";
import { Section, SectionHeader } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { FaqAccordion } from "@/components/site/FaqAccordion";
import { ServiceCardPro } from "@/components/site/cards/ServiceCardPro";

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

const HERO_FALLBACK_IMG = "/assets/hero-doctor.jpg";

const STATS = [
  { value: "24/7", label: "Patient Support" },
  { value: "500+", label: "Patients Served" },
  { value: "2 Hr", label: "Replacement SLA" },
  { value: "100%", label: "Verified Staff" },
];

const WHY = [
  { icon: ShieldCheck, title: "Verified Professionals", detail: "Background-verified and trained caregivers, nurses, and attendants." },
  { icon: Clock3, title: "Flexible Hourly Care", detail: "Book care for a few hours, overnight, or as per your requirement." },
  { icon: BellRing, title: "Medication Alerts", detail: "Timely reminders to help patients stay on track with medications." },
  { icon: Zap, title: "Quick Service Support", detail: "Fast caregiver deployment and responsive assistance when you need it most." },
];

const CONDITIONS = [
  "Post-Surgery Recovery",
  "Stroke & Paralysis",
  "Cardiac Care",
  "Cancer & Palliative",
  "Orthopedic Rehab",
  "Dementia & Alzheimer's",
  "Diabetes Management",
  "Parkinson's Care",
  "Bed-ridden Patients",
  "ICU-at-Home",
];

function ServicesIndex() {
  const { data, isLoading } = useQuery(servicesQ({ limit: 60 }));
  const { data: tData } = useQuery(testimonialsQ({ limit: 8 }));
  const { data: fData } = useQuery(faqsQ({ limit: 8 }));
  const { data: vData } = useQuery(videosQ({ limit: 8 }));
  const { data: settings } = useQuery(settingsQ());

  const items = data?.items ?? [];
  const testimonials = tData?.items ?? [];
  const faqs = fData?.items ?? [];
  const videos = vData?.items ?? [];

  const [active, setActive] = useState<string>("all");

  const phone = settings?.phone?.replace(/[^\d+]/g, "");
  const whatsapp = (settings?.whatsapp ?? settings?.phone)?.replace(/[^\d]/g, "");

  // ── Services hero content (admin-managed via Settings → Services Hero) ──
  const hero = settings?.services_hero;
  const heroTitle =
    hero?.title?.trim() || "Trusted Home Healthcare Services in Gurgaon & Delhi NCR";
  const heroSubtitle =
    hero?.subtitle?.trim() ||
    "Nupun provides compassionate and reliable home healthcare for seniors, patients and recovering individuals in the comfort of their homes. From trained attendants and nursing to physiotherapy, post-surgery support and elder care — flexible care with hourly, short-term and long-term options.";
  // Admin-set image wins; otherwise fall back to the bundled hero photo.
  const heroBg = hero?.background_image?.url || HERO_FALLBACK_IMG;
  const heroStats = hero?.stats?.length ? hero.stats : STATS;

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
      {/* ── Hero (full-bleed image + centred CTA) ────────────── */}
      <section className="relative isolate flex min-h-[560px] items-center overflow-hidden lg:min-h-[680px]">
        {/* Background image */}
        <img
          src={heroBg}
          alt={hero?.background_image?.alt ?? "Home healthcare"}
          className="absolute inset-0 -z-20 h-full w-full object-cover"
        />
        {/* Warm brand overlay for legibility */}
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "linear-gradient(180deg, color-mix(in oklab, var(--accent) 62%, black 30%) 0%, color-mix(in oklab, var(--primary) 45%, black 45%) 60%, color-mix(in oklab, black 78%, transparent) 100%)",
          }}
        />

        <div className="container-x relative w-full pt-32 pb-20 lg:pt-40 lg:pb-28 text-center text-white">
          <nav
            aria-label="Breadcrumb"
            className="mb-8 flex items-center justify-center gap-2 text-xs text-white/70"
          >
            <Link to="/" className="transition-colors hover:text-white">Home</Link>
            <span>/</span>
            <span className="text-white/90">Services</span>
          </nav>

          <Reveal>
            <h1 className="mx-auto max-w-5xl font-display text-4xl font-bold leading-[1.06] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              {heroTitle}
            </h1>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-white/85 md:text-lg">
              {heroSubtitle}
            </p>
          </Reveal>

          <Reveal delay={0.16}>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
              {phone && (
                <a
                  href={`tel:${phone}`}
                  className="inline-flex items-center gap-2 rounded-lg bg-white px-8 py-3.5 text-sm font-semibold text-primary shadow-[0_16px_36px_-18px_rgba(0,0,0,0.6)] transition-transform hover:-translate-y-0.5"
                >
                  <Phone className="h-4 w-4" /> Call Now
                </a>
              )}
              {whatsapp && (
                <a
                  href={`https://wa.me/${whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground shadow-[0_16px_36px_-18px_rgba(0,0,0,0.6)] transition-transform hover:-translate-y-0.5"
                >
                  <MessageCircle className="h-4 w-4" /> WhatsApp Now
                </a>
              )}
              <Link
                to="/booking"
                className="inline-flex items-center gap-2 rounded-lg border border-white/40 bg-white/10 px-8 py-3.5 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/20"
              >
                Book a consult <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Stats band ───────────────────────────────────────── */}
      <div className="container-x -mt-10 relative z-10 pb-4">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {heroStats.map((s, i) => (
            <motion.div
              key={`${s.label}-${i}`}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-3xl border border-border/60 bg-surface px-6 py-8 text-center shadow-[0_24px_60px_-40px_rgba(0,0,0,0.35)]"
            >
              <div className="font-display text-4xl tracking-tight text-primary md:text-5xl">{s.value}</div>
              <div className="mt-2 text-sm font-medium text-foreground/70">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Sticky category rail ─────────────────────────────── */}
      {categories.length > 1 && (
        <div className="sticky top-20 z-30 pt-8">
          <div className="container-x">
            <div className="flex items-center gap-3 overflow-x-auto rounded-full border border-white/60 bg-white/70 backdrop-blur-2xl px-3 py-2 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.15)]">
              <Search className="h-4 w-4 text-muted-foreground shrink-0 ml-2" />
              {categories.map((c) => {
                const isActive = c === active;
                return (
                  <button
                    key={c}
                    onClick={() => setActive(c)}
                    className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
                      isActive
                        ? "bg-primary text-primary-foreground"
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

      {/* ── Our Healthcare Services ──────────────────────────── */}
      <Section id="catalogue" className="pt-12">
        <SectionHeader
          align="center"
          eyebrow="What we do"
          title="Our Healthcare Services"
          description="Comprehensive home healthcare and patient-care services for elderly care, recovery support, ICU transition and rehabilitation."
        />

        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-[360px] rounded-[1.5rem] border border-border bg-surface animate-pulse" />
            ))}
          </div>
        ) : filtered.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((s, i) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: (i % 4) * 0.06, ease: [0.22, 1, 0.36, 1] }}
              >
                <ServiceCardPro service={s} index={i} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-border bg-surface/50 p-16 text-center">
            <div className="font-display text-2xl">Nothing here yet</div>
            <p className="mt-2 text-sm text-muted-foreground">Try another category, or talk to an advisor.</p>
          </div>
        )}

        <div className="mt-14 text-center text-sm text-muted-foreground">
          Don't see what you need?{" "}
          <Link to="/contact" className="text-accent font-medium underline-offset-4 hover:underline">
            Talk to a care advisor →
          </Link>
        </div>
      </Section>

      {/* ── Why Choose Nupun ─────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "linear-gradient(135deg, var(--accent), color-mix(in oklab, var(--primary) 80%, black 8%))",
          }}
        />
        <div className="container-x py-20 lg:py-28 text-primary-foreground">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 border border-white/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] mb-4">
              <HeartHandshake className="h-3.5 w-3.5" /> Why families choose us
            </div>
            <h2 className="font-display text-4xl md:text-5xl tracking-tight">Why Choose Nupun?</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {WHY.map(({ icon: Icon, title, detail }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-2xl bg-white/10 border border-white/15 backdrop-blur-sm p-6 hover:bg-white/15 transition-colors"
              >
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-white/15 mb-4">
                  <Icon className="h-5 w-5" strokeWidth={1.7} />
                </div>
                <div className="font-display text-lg leading-tight">{title}</div>
                <p className="mt-2 text-sm text-white/80 leading-relaxed">{detail}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Conditions we support ────────────────────────────── */}
      <Section>
        <SectionHeader
          align="center"
          eyebrow="Clinical coverage"
          title="Conditions We Support"
          description="Specialised, medically supervised care plans across a wide range of conditions."
        />
        <div className="flex flex-wrap justify-center gap-3">
          {CONDITIONS.map((c, i) => (
            <motion.span
              key={c}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: (i % 5) * 0.05 }}
              className="rounded-full border border-border/70 bg-surface px-5 py-2.5 text-sm font-medium text-foreground/80 hover:border-primary/50 hover:text-primary transition-colors"
            >
              {c}
            </motion.span>
          ))}
        </div>
      </Section>

      {/* ── Testimonials (live data only) ────────────────────── */}
      {testimonials.length > 0 && (
        <section className="border-t border-border/60 bg-surface/60 overflow-hidden">
          <div className="container-x pt-20 pb-6">
            <div className="text-[10px] uppercase tracking-[0.24em] text-accent mb-3">What they say about Nupun</div>
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
                  {t.rating ? (
                    <div className="flex gap-0.5 mb-3">
                      {Array.from({ length: Math.min(5, Math.round(t.rating)) }).map((_, s) => (
                        <Star key={s} className="h-4 w-4 fill-primary text-primary" />
                      ))}
                    </div>
                  ) : null}
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

      {/* ── Video stories (live data only) ───────────────────── */}
      {videos.length > 0 && (
        <Section>
          <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-stretch lg:gap-12">
            {/* Decorative panel */}
            <div
              className="relative flex min-h-[380px] flex-col justify-end overflow-hidden rounded-[2.5rem] p-9 text-white lg:p-10"
              style={{
                background:
                  "radial-gradient(70% 60% at 25% 20%, color-mix(in oklab, var(--primary) 45%, transparent), transparent 70%), linear-gradient(155deg, var(--accent), color-mix(in oklab, var(--primary) 80%, black 12%))",
              }}
            >
              <div className="pointer-events-none absolute inset-0 opacity-30 mix-blend-overlay bg-[radial-gradient(circle_at_80%_15%,white,transparent_45%)]" />
              <Quote className="absolute right-8 top-8 h-16 w-16 text-white/15" />
              <div className="relative">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/15 backdrop-blur">
                  <HeartHandshake className="h-6 w-6" />
                </div>
                <div className="mt-5 font-display text-3xl leading-tight tracking-tight md:text-4xl">
                  Real families.
                  <br />
                  Real recoveries.
                </div>
                <p className="mt-3 max-w-xs text-sm text-white/80">
                  The peace of mind a Nupun caregiver brings — told by the people who lived it.
                </p>
              </div>
            </div>

            {/* Heading + video cards */}
            <div className="flex flex-col justify-center">
              <SectionHeader
                eyebrow="Video stories"
                title={
                  <>
                    What They Say About <span className="text-primary">Nupun</span>
                  </>
                }
                description="Our members value the peace of mind our caregivers provide. Hear their stories below."
              />
              <div className="grid gap-6 sm:grid-cols-2">
                {videos.slice(0, 4).map((v, i) => (
                  <motion.div
                    key={v.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.5, delay: (i % 2) * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <VideoStoryCard v={v} />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </Section>
      )}

      {/* ── FAQ (live data only) ─────────────────────────────── */}
      {faqs.length > 0 && (
        <Section>
          <SectionHeader
            align="center"
            eyebrow="Good to know"
            title="Frequently Asked Questions"
          />
          <div className="max-w-3xl mx-auto">
            <FaqAccordion items={faqs} />
          </div>
        </Section>
      )}

      {/* ── CTA band ─────────────────────────────────────────── */}
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
              {phone && (
                <a
                  href={`tel:${phone}`}
                  className="inline-flex items-center gap-2 rounded-full bg-background text-foreground px-6 py-3 text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <Phone className="h-4 w-4" /> Call Now
                </a>
              )}
              <Link
                to="/booking"
                className="inline-flex items-center gap-2 rounded-full border border-background/30 px-6 py-3 text-sm font-medium hover:bg-background/10"
              >
                Book a consult <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function VideoStoryCard({ v }: { v: Video }) {
  const url = v.youtube_url ?? v.video_url ?? "#";
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer noopener"
      className="group flex flex-col overflow-hidden rounded-3xl border border-border/70 bg-background shadow-[0_24px_60px_-45px_rgba(0,0,0,0.4)] transition-colors hover:border-primary/50"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-dark">
        {v.thumbnail ? (
          <img
            src={v.thumbnail}
            alt={v.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-accent to-primary" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <div className="absolute inset-0 grid place-items-center">
          <div className="grid h-14 w-14 place-items-center rounded-full bg-white/95 text-primary shadow-[var(--shadow-elegant)] transition-transform group-hover:scale-110">
            <Play className="h-6 w-6" fill="currentColor" />
          </div>
        </div>
        {v.duration && (
          <div className="absolute bottom-3 right-3 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur">
            {v.duration}
          </div>
        )}
      </div>
      <div className="p-5">
        <div className="font-display text-lg leading-tight line-clamp-1">{v.title}</div>
        {v.category && (
          <div className="mt-1 text-sm italic text-muted-foreground">{v.category}</div>
        )}
      </div>
    </a>
  );
}
