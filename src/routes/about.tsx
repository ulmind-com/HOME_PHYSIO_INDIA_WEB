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
  Search,
  Award,
  Calendar,
  Activity,
} from "lucide-react";
import { settingsQ, reviewSummaryQ } from "@/lib/api/queries";
import { PageHero } from "@/components/site/PageHero";
import { Section, SectionHeader } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { ServicesMarquee } from "@/components/site/ServicesMarquee";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Nupun Home Health Care" },
      {
        name: "description",
        content: "The story, values and clinical standards behind Nupun's home care.",
      },
      { property: "og:title", content: "About — Nupun Home Health Care" },
      { property: "og:description", content: "Our story, values and clinical standards." },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

const DEFAULT_VALUES = [
  {
    icon: HeartPulse,
    title: "Care first, always",
    body: "Every decision starts with what's right for the patient — not what's easy.",
  },
  {
    icon: ShieldCheck,
    title: "Clinical rigour",
    body: "Protocols, audits and continuous training keep our care safe and consistent.",
  },
  {
    icon: Sparkles,
    title: "Warm hospitality",
    body: "Care shouldn't feel clinical. Our caregivers bring warmth, patience and presence.",
  },
  {
    icon: Users,
    title: "Family, involved",
    body: "We keep families informed and empowered — you're part of the care team.",
  },
];
const ICONS = [HeartPulse, ShieldCheck, Sparkles, Users];

const PROCESS = [
  {
    icon: Phone,
    step: "01",
    title: "Book a consultation",
    body: "Tell us your needs over a call or online. A care expert listens and advises — no pressure.",
  },
  {
    icon: ClipboardCheck,
    step: "02",
    title: "Get a custom care plan",
    body: "We shape a personalised plan around the condition, schedule and budget, with clear pricing.",
  },
  {
    icon: UserCheck,
    step: "03",
    title: "Meet your caregiver",
    body: "You're matched with a verified, trained and compassionate professional from our team.",
  },
];

const DEFAULT_COMMITMENTS = [
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

  const name = settings?.website_name || "Nupun";
  const phone = settings?.phone?.replace(/[^\d+]/g, "");
  const rating = reviews?.average_rating ? `${reviews.average_rating.toFixed(1)}★` : "4.9★";

  // Dynamic values from admin panel with defaults
  const VALUES = settings?.about_values?.length
    ? settings.about_values.map((v, i) => ({
        icon: ICONS[i % ICONS.length],
        title: v.title,
        body: v.body,
      }))
    : DEFAULT_VALUES;

  const COMMITMENTS = settings?.about_commitments?.length
    ? settings.about_commitments
    : DEFAULT_COMMITMENTS;

  const heroTitle = settings?.about_hero_title || "Healthcare for Good. Today. Tomorrow. Always.";
  const heroBadge = settings?.about_hero_badge || "Trusted by millions. Driven by excellence.";
  const heroDesc =
    settings?.about_hero_description ||
    "World-class medical care with compassion and innovation, for you and your family.";

  const defaultStats = [
    { k: "10,000+", v: "Families served" },
    { k: "50k+", v: "Visits completed" },
    { k: rating, v: "Average rating" },
    { k: "< 2 hrs", v: "Average response" },
  ];
  const stats = settings?.about_stats?.length
    ? settings.about_stats.map((s) => ({ k: s.value, v: s.label }))
    : defaultStats;

  return (
    <>
      {/* ── Custom Split Hero (Screenshot Match) ──────────────── */}
      <div className="relative isolate overflow-hidden bg-[#fafafa]">
        {/* Subtle background blob */}
        <div className="absolute top-0 right-0 -z-10 w-full h-full opacity-30 bg-gradient-to-l from-primary/10 to-transparent" />

        <div className="container-x pt-24 pb-6 md:pb-8 lg:pt-28 lg:pb-10 grid lg:grid-cols-12 gap-6 lg:gap-6 items-center">
          {/* Left Content */}
          <div className="space-y-4 lg:col-span-7 xl:col-span-6 lg:pr-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-semibold text-primary">
              <ShieldCheck className="h-4 w-4" fill="currentColor" /> {heroBadge}
            </div>

            {/* Title */}
            <h1 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-[1.15] tracking-tight text-foreground">
              {heroTitle.includes("Always") ? (
                <>
                  Healthcare for Good. Today. Tomorrow.{" "}
                  <span className="text-primary">Always.</span>
                </>
              ) : (
                <>{heroTitle}</>
              )}
            </h1>

            {/* Description */}
            <p className="text-sm md:text-lg text-foreground/80 max-w-lg leading-relaxed">
              {heroDesc}
            </p>

            {/* Search Bar */}
            <div className="relative max-w-lg flex items-center bg-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-black/5 overflow-hidden p-1.5 transition-shadow focus-within:shadow-[0_8px_30px_var(--color-primary),0.15)] focus-within:border-primary/20">
              <div className="pl-4 pr-2 text-muted-foreground">
                <Search className="h-5 w-5 text-primary" strokeWidth={2.5} />
              </div>
              <input
                type="text"
                placeholder="Search for Doctors, Specialities and Hospitals"
                className="w-full bg-transparent border-none outline-none text-[15px] py-3 text-foreground placeholder:text-muted-foreground/70"
              />
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-3 md:gap-5 pt-0">
              <div className="flex items-center gap-3">
                <div className="text-primary">
                  <Award className="h-9 w-9" strokeWidth={1.5} />
                </div>
                <div>
                  <div className="font-display text-[22px] font-bold leading-tight">35+</div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mt-0.5">
                    Years of Trust
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-primary">
                  <Stethoscope className="h-9 w-9" strokeWidth={1.5} />
                </div>
                <div>
                  <div className="font-display text-[22px] font-bold leading-tight">4000+</div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mt-0.5">
                    Expert Doctors
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-primary">
                  <HeartPulse className="h-9 w-9" strokeWidth={1.5} />
                </div>
                <div>
                  <div className="font-display text-[22px] font-bold leading-tight">30M+</div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mt-0.5">
                    Lives Touched
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-2 md:gap-3 pt-0">
              <a
                href={`tel:${phone || "18001234567"}`}
                className="inline-flex items-center gap-2 rounded-full bg-white border border-border/80 px-4 md:px-5 py-2 md:py-2.5 text-[12px] md:text-[13px] font-semibold text-foreground shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:bg-surface hover:-translate-y-0.5 transition-all"
              >
                <Phone className="h-4 w-4 text-muted-foreground" /> Request a Callback
              </a>
              <Link
                to="/booking"
                className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-5 py-2.5 text-[13px] font-bold text-primary hover:bg-primary/15 hover:-translate-y-0.5 transition-all"
              >
                <Calendar className="h-4 w-4" /> Book Appointment
              </Link>
              <Link
                to="/services"
                className="inline-flex items-center gap-2 rounded-full bg-white border border-border/80 px-5 py-2.5 text-[13px] font-semibold text-foreground shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:bg-surface hover:-translate-y-0.5 transition-all"
              >
                <ShieldCheck className="h-4 w-4 text-muted-foreground" /> Health Checkup
              </Link>
            </div>
          </div>
        </div>

        {/* Right Image */}
        <div className="relative h-[400px] w-full lg:absolute lg:right-0 lg:top-0 lg:h-full lg:w-[45%] xl:w-[50%] -z-10">
          {/* Replace this with an actual image that fits the doctor/patient context */}
          <img
            src="/assets/Get professional and compassionate elderly care at home in Ranchi (2)-Picsart-BackgroundRemover.jpeg"
            alt="Doctor and Patient"
            className="w-full h-full object-cover object-top"
          />
          {/* Fade mask for smooth blending into the background color */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#fafafa] via-[#fafafa]/50 to-transparent lg:w-48" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#fafafa] via-transparent to-transparent lg:hidden" />
        </div>
      </div>

      {/* ── Story + values (Liquid Glassmorphism) ────────────────── */}
      <Section className="relative pt-16 lg:pt-24 pb-16 overflow-hidden">
        {/* Animated Liquid Blobs in Background */}
        <div
          className="absolute inset-0 z-0 pointer-events-none overflow-hidden"
          aria-hidden="true"
        >
          <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] bg-primary/30 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-float-slow" />
          <div
            className="absolute bottom-[10%] right-[10%] w-[600px] h-[600px] bg-[#2E9296]/20 rounded-full mix-blend-multiply filter blur-[120px] opacity-60 animate-float-slower"
            style={{ animationDelay: "2s" }}
          />
          <div
            className="absolute top-[40%] left-[60%] w-[400px] h-[400px] bg-[#7DF8D6]/30 rounded-full mix-blend-multiply filter blur-[90px] opacity-60 animate-float-slow"
            style={{ animationDelay: "1s" }}
          />
        </div>

        <div className="relative z-10 grid items-stretch gap-8 lg:grid-cols-12 max-w-[1400px] mx-auto px-4 lg:px-0">
          {/* Left: Premium Glass Block for Text */}
          <div className="relative overflow-hidden rounded-[2.5rem] bg-white/40 backdrop-blur-3xl border border-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.04),inset_0_0_0_1px_rgba(255,255,255,0.5)] lg:col-span-5 p-10 lg:p-14 flex flex-col justify-center transition-all hover:bg-white/50">
            {/* Glossy highlight line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-80" />

            <div className="relative z-10 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/60 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-primary shadow-sm backdrop-blur-md">
                <Stethoscope className="h-3.5 w-3.5" /> Our story
              </div>
              <h2 className="font-display text-3xl tracking-tight text-foreground md:text-4xl lg:text-5xl leading-[1.1]">
                {settings?.about_story_title ||
                  "The best care doesn't happen in corridors — it happens at home."}
              </h2>
              <div className="space-y-4 text-[15px] leading-relaxed text-foreground/80">
                {settings?.about_story_text ? (
                  <p>{settings.about_story_text}</p>
                ) : (
                  <>
                    <p>
                      {name} began with a simple observation: the best care is delivered by people
                      who show up on time, know exactly what they're doing, and treat every family
                      with respect.
                    </p>
                    <p>
                      We recruit less than 4% of nurses who apply. Every caregiver is
                      background-checked, clinically assessed and continuously trained.
                    </p>
                    <p className="font-semibold text-foreground/90">
                      What we're building is quiet but ambitious: the most trusted home-care brand
                      in the country.
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right: Premium Glass Block for Values */}
          <div className="relative rounded-[2.5rem] bg-white/40 backdrop-blur-3xl border border-white/80 lg:col-span-7 p-8 lg:p-12 shadow-[0_8px_32px_rgba(0,0,0,0.04),inset_0_0_0_1px_rgba(255,255,255,0.5)] transition-all hover:bg-white/50">
            {/* Glossy highlight line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-80" />

            <h3 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-8">
              Why families trust us
            </h3>
            <div className="grid gap-5 sm:grid-cols-2">
              {VALUES.map((v, i) => (
                <Reveal key={v.title} delay={i * 0.05}>
                  <div className="group h-full flex flex-col rounded-3xl border border-white/60 bg-white/50 backdrop-blur-lg p-6 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 hover:border-white hover:bg-white/80">
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/80 shadow-[inset_0_0_0_1px_rgba(255,255,255,1)] text-primary transition-transform duration-500 group-hover:scale-110 group-hover:bg-primary group-hover:text-white">
                      <v.icon className="h-5 w-5" />
                    </div>
                    <div className="font-display text-xl font-bold text-foreground transition-colors group-hover:text-primary">
                      {v.title}
                    </div>
                    <div className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {v.body}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
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
              <div className="font-display text-4xl tracking-tight text-primary md:text-5xl">
                {s.k}
              </div>
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
        <div className="grid gap-6 lg:grid-cols-3">
          {PROCESS.map((p, i) => {
            const themes = [
              {
                bg: "bg-[#F5FAF6]",
                iconBg: "bg-[#E5F4EA]",
                iconColor: "text-[#16A34A]",
                border: "border-[#E5F4EA]",
              },
              {
                bg: "bg-[#F4F7FC]",
                iconBg: "bg-[#E6F0FD]",
                iconColor: "text-[#2563EB]",
                border: "border-[#E6F0FD]",
              },
              {
                bg: "bg-[#FDF5FB]",
                iconBg: "bg-[#FCE6F5]",
                iconColor: "text-[#C026D3]",
                border: "border-[#FCE6F5]",
              },
            ];
            const theme = themes[i % themes.length];

            return (
              <Reveal key={p.step} delay={i * 0.08}>
                <div
                  className={`group relative h-full rounded-[2rem] border ${theme.border} ${theme.bg} p-6 transition-all duration-500 hover:shadow-xl hover:-translate-y-1 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-5`}
                >
                  {/* Glowing Icon Wrapper */}
                  <div
                    className={`shrink-0 relative grid h-20 w-20 place-items-center rounded-full ${theme.iconBg} ${theme.iconColor} transition-transform duration-500 group-hover:scale-105`}
                  >
                    {/* Inner glowing pulse */}
                    <div className="absolute inset-0 rounded-full bg-white opacity-40 blur-md transition-opacity group-hover:opacity-80" />
                    <p.icon className="relative z-10 h-8 w-8" strokeWidth={2} />
                  </div>

                  {/* Text Wrapper */}
                  <div className="flex-1 mt-2 sm:mt-0">
                    <div className="font-display text-xl md:text-[22px] font-bold text-foreground leading-tight group-hover:text-primary transition-colors">
                      {p.title}
                    </div>
                    <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground/90">
                      {p.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Section>

      {/* ── Commitment (dark band) ───────────────────────────── */}
      <section className="relative overflow-hidden rounded-[2.5rem] mx-4 lg:mx-auto max-w-[1400px] shadow-2xl shadow-primary/20 my-16">
        {/* Background Image */}
        <div className="absolute inset-0 -z-20">
          <img
            src="/assets/hero-slide-1.jpeg"
            alt="Commitment to excellence"
            className="w-full h-full object-cover object-center"
          />
        </div>
        {/* Premium Gradient Overlay */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#179686]/95 via-[#117669]/90 to-[#0A4A41]/95 mix-blend-multiply" />
        <div className="absolute inset-0 -z-10 bg-primary/40 backdrop-blur-[2px]" />
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
                We go beyond standard care to protect your peace of mind and your loved one's
                well-being — every visit, every time.
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

      {/* ── Services Marquee ──────────────────────────────────────────────── */}
      <ServicesMarquee />
    </>
  );
}
