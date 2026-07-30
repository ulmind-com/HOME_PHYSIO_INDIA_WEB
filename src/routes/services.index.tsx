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
  HeartHandshake,
  BellRing,
  Zap,
  Star,
} from "lucide-react";
import { servicesQ, testimonialsQ, faqsQ, settingsQ } from "@/lib/api/queries";
import { Section, SectionHeader } from "@/components/site/Section";
import { FaqAccordion } from "@/components/site/FaqAccordion";
import { ServiceCardPro } from "@/components/site/cards/ServiceCardPro";
import { VideoTestimonialsSection } from "@/components/site/VideoTestimonialsSection";
import { ServicesHeroSlider } from "@/components/site/ServicesHeroSlider";

export const Route = createFileRoute("/services/")({
  head: () => ({
    meta: [
      { title: "Services — Nupun Home Health Care" },
      {
        name: "description",
        content:
          "Nurses, physios, elder care, post-op recovery and more — medically supervised care delivered at home.",
      },
      { property: "og:title", content: "Services — Nupun Home Health Care" },
      {
        property: "og:description",
        content: "Medically supervised home care — nurses, physios, elder care and more.",
      },
      { property: "og:url", content: "/services" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
  component: ServicesIndex,
});

const WHY = [
  {
    icon: ShieldCheck,
    title: "Verified Professionals",
    detail: "Background-verified and trained caregivers, nurses, and attendants.",
    theme: {
      bg: "bg-emerald-50/70 dark:bg-emerald-950/20",
      iconBg: "bg-emerald-100 dark:bg-emerald-900/40",
      iconColor: "text-emerald-600 dark:text-emerald-400",
    },
  },
  {
    icon: Clock3,
    title: "Flexible Hourly Care",
    detail: "Book care for a few hours, overnight, or as per your requirement.",
    theme: {
      bg: "bg-blue-50/70 dark:bg-blue-950/20",
      iconBg: "bg-blue-100 dark:bg-blue-900/40",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
  },
  {
    icon: BellRing,
    title: "Medication Alerts",
    detail: "Timely reminders to help patients stay on track with medications.",
    theme: {
      bg: "bg-fuchsia-50/70 dark:bg-fuchsia-950/20",
      iconBg: "bg-fuchsia-100 dark:bg-fuchsia-900/40",
      iconColor: "text-fuchsia-600 dark:text-fuchsia-400",
    },
  },
  {
    icon: Zap,
    title: "Quick Service Support",
    detail: "Fast caregiver deployment and responsive assistance when you need it most.",
    theme: {
      bg: "bg-orange-50/70 dark:bg-orange-950/20",
      iconBg: "bg-orange-100 dark:bg-orange-900/40",
      iconColor: "text-orange-600 dark:text-orange-400",
    },
  },
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
  const { data: settings } = useQuery(settingsQ());

  const items = data?.items ?? [];
  const testimonials = tData?.items ?? [];
  const faqs = fData?.items ?? [];

  const [active, setActive] = useState<string>("all");

  const phone = settings?.phone?.replace(/[^\d+]/g, "");
  const whatsapp = (settings?.whatsapp ?? settings?.phone)?.replace(/[^\d]/g, "");

  const heroSlides = settings?.services_hero?.slides;

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
      {/* ── Full-screen 3D hero slider ────────────────────────── */}
      <ServicesHeroSlider slides={heroSlides} />

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
      <Section id="catalogue" className="pt-12 pb-8 lg:pb-12">
        <SectionHeader
          align="center"
          eyebrow="What we do"
          title="Our Healthcare Services"
          description="Comprehensive home healthcare and patient-care services for elderly care, recovery support, ICU transition and rehabilitation."
        />

        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-[360px] rounded-[1.5rem] border border-border bg-surface animate-pulse"
              />
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
            <p className="mt-2 text-sm text-muted-foreground">
              Try another category, or talk to an advisor.
            </p>
          </div>
        )}

        <div className="mt-10 text-center text-sm text-muted-foreground">
          Don't see what you need?{" "}
          <Link
            to="/contact"
            className="text-accent font-medium underline-offset-4 hover:underline"
          >
            Talk to a care advisor →
          </Link>
        </div>
      </Section>

      {/* ── Why Choose Nupun ─────────────────────────────────── */}
      <section className="relative overflow-hidden bg-background">
        <div className="container-x pb-20 lg:pb-28 pt-0">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 rounded-full bg-surface border border-border px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground shadow-sm mb-5">
              <HeartHandshake className="h-3.5 w-3.5 text-primary" /> Why families choose us
            </div>
            <h2 className="font-display text-4xl md:text-5xl tracking-tight text-foreground">
              Why Choose Nupun?
            </h2>
          </div>

          <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-4">
            {WHY.map(({ icon: Icon, title, detail, theme }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className={`group flex items-center gap-5 rounded-[24px] ${theme.bg} p-6 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-transparent hover:border-black/5 dark:hover:border-white/5`}
              >
                {/* Icon Circle */}
                <div
                  className={`grid h-16 w-16 shrink-0 place-items-center rounded-full ${theme.iconBg} ${theme.iconColor} transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-inner`}
                >
                  <Icon className="h-7 w-7" strokeWidth={2.5} />
                </div>

                {/* Content */}
                <div>
                  <h3 className="font-display text-lg font-bold leading-tight tracking-tight text-foreground">
                    {title}
                  </h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground line-clamp-3 pr-2">
                    {detail}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Conditions We Support (Pro Liquid Glass) ────────────────────────────── */}
      <section className="relative overflow-hidden pt-0 pb-20">
        {/* Animated Liquid Background Blobs (No giant white container) */}
        <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-[10%] left-[5%] w-[450px] h-[450px] bg-primary/20 rounded-full mix-blend-multiply filter blur-[90px] opacity-70 animate-float-slow" />
          <div
            className="absolute bottom-[5%] right-[10%] w-[550px] h-[550px] bg-accent/20 rounded-full mix-blend-multiply filter blur-[120px] opacity-60 animate-float-slower"
            style={{ animationDelay: "1.5s" }}
          />
          <div
            className="absolute top-[40%] left-[60%] w-[350px] h-[350px] bg-primary/10 rounded-full mix-blend-multiply filter blur-[80px] opacity-80 animate-float-slow"
            style={{ animationDelay: "3s" }}
          />
        </div>

        <div className="container-x relative z-10 max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-primary backdrop-blur-md mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Clinical coverage
            </div>
            <h2 className="font-display text-4xl tracking-tight text-foreground md:text-5xl lg:text-6xl mb-5">
              Conditions We Support
            </h2>
            <p className="text-lg text-foreground/70 leading-relaxed max-w-2xl mx-auto">
              Specialised, medically supervised care plans across a wide range of conditions.
            </p>
          </div>

          {/* Grid of Glass Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {CONDITIONS.map((c, i) => (
              <motion.div
                key={c}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (i % 8) * 0.05 }}
                className="group cursor-pointer h-full"
              >
                {/* Individual Glassmorphism Card */}
                <div className="relative h-full overflow-hidden rounded-[1.5rem] border border-white/60 bg-white/40 p-6 flex items-center justify-center text-center backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.04),inset_0_0_0_1px_rgba(255,255,255,0.3)] transition-all duration-300 group-hover:scale-105 group-hover:-translate-y-1 group-hover:bg-primary group-hover:border-primary group-hover:shadow-[0_15px_30px_-10px_rgba(26,130,118,0.4)]">
                  {/* Top Glossy Highlight */}
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-80" />
                  {/* Inner glossy reflection on hover */}
                  <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  <span className="relative z-10 font-semibold text-foreground/90 text-[15px] leading-snug group-hover:text-white transition-colors duration-300">
                    {c}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials (live data only) ────────────────────── */}
      {testimonials.length > 0 && (
        <section className="border-t border-border/60 bg-surface/60 overflow-hidden">
          <div className="container-x pt-20 pb-6">
            <div className="text-[10px] uppercase tracking-[0.24em] text-accent mb-3">
              What they say about Nupun
            </div>
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
                      <img
                        src={t.avatar ?? t.image ?? ""}
                        alt={t.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <div className="font-display text-sm">{t.name}</div>
                      {(t.role || t.designation) && (
                        <div className="text-xs text-muted-foreground">
                          {t.role ?? t.designation}
                        </div>
                      )}
                    </div>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── FAQ (Home Page Style) ─────────────────────────────── */}
      {faqs.length > 0 && (
        <Section className="bg-[#F8F9FA]">
          <div className="grid gap-12 lg:grid-cols-2 items-start">
            {/* Left Side: Illustration */}
            <div className="flex items-center justify-center lg:justify-end pr-0 lg:pr-8">
              <img
                src="/assets/faq-illustration.jpeg"
                alt="Telemedicine Consultation"
                className="w-[85%] md:w-[70%] lg:w-[85%] max-w-md h-auto mix-blend-multiply"
              />
            </div>

            {/* Right Side: FAQs (Animated) */}
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.1 } },
              }}
              className="flex flex-col justify-center"
            >
              <motion.h2
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
                  },
                }}
                className="font-display text-3xl md:text-4xl lg:text-[2.75rem] font-bold text-foreground mb-6 leading-tight tracking-tight"
              >
                Frequently Asked
                <br />
                <span className="text-primary">Questions</span>
              </motion.h2>

              <FaqAccordion items={faqs.slice(0, 6)} />

              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
                  },
                }}
                className="mt-8 text-center sm:text-left"
              >
                <Link
                  to="/faq"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-primary/10 text-primary px-8 py-3.5 font-semibold hover:bg-primary hover:text-white transition-colors duration-300"
                >
                  Read More...
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </Section>
      )}

      {/* ── Video testimonials ───────────────────────────────── */}
      <VideoTestimonialsSection />

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
            <div className="text-[10px] uppercase tracking-[0.24em] text-background/70 mb-4">
              Not sure which service fits?
            </div>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl tracking-tight leading-[1.05]">
              Speak with a senior nurse.{" "}
              <em className="not-italic text-primary-glow">Free, in 15 minutes.</em>
            </h2>
            <p className="mt-5 text-background/75 max-w-xl">
              Describe the situation once — we'll shape a care plan and share pricing before the
              call ends.
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
