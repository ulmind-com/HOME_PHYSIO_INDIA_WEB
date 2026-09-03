import { useState, useEffect, useCallback, useRef } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  Clock,
  FileCheck2,
  MapPin,
  MonitorPlay,
  Receipt,
  ShieldCheck,
} from "lucide-react";

import { blogsQ, equipmentQ, faqsQ, settingsQ, testimonialsQ, staffQ } from "@/lib/api/queries";
import { Section, SectionHeader } from "@/components/site/Section";
import { FaqAccordion } from "@/components/site/FaqAccordion";
import { OurStaffSection, FallbackStaffGrid } from "@/components/site/OurStaffSection";
import { VideoTestimonialsSection } from "@/components/site/VideoTestimonialsSection";
import { TestimonialsSection } from "@/components/site/TestimonialsSection";
import { BlogSection } from "@/components/site/BlogSection";
import { PremiumScrollReveal } from "@/components/site/PremiumScrollReveal";
import {
  CONSULTATION_FEE,
  COVERAGE,
  HOW_IT_WORKS,
  MODALITIES,
  SERVICES,
  TRUST_POINTS,
} from "@/lib/plan";
import { equipmentIcon, imageSrc, serviceArtwork, slugToEquipmentCode, HERO_DESKTOP_IMAGES, HERO_MOBILE_IMAGES } from "@/lib/placeholders";
import { useIsMobile } from "@/hooks/use-mobile";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Home Physio India — Expert care at your doorstep" },
      {
        name: "description",
        content:
          "Home physiotherapy, yoga therapy, massage therapy and rehabilitation across West Bengal. Verified therapists, portable modalities, transparent per-visit pricing from ₹400.",
      },
      {
        property: "og:title",
        content: "Home Physio India — Expert care at your doorstep",
      },
      {
        property: "og:description",
        content:
          "Verified home-visit therapists across West Bengal. Physiotherapy from ₹400 a visit, priced before you book.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: HomePage,
});

function HomePage() {
  const faqs = useQuery(faqsQ({ limit: 6 }));
  const staff = useQuery(staffQ({ limit: 50 }));
  const hasStaffData = (staff.data?.items?.length ?? 0) > 0;

  return (
    <>
      <Hero />
      {hasStaffData ? <OurStaffSection /> : <FallbackStaffGrid />}
      <ServicesSection />
      <HowItWorks />
      <PricingStrip />
      <ModalitySection />
      <TrustSection />
      <ConsultationBanner />
      <CoverageSection />

      <BlogSection />
      <VideoTestimonialsSection />
      <TestimonialsSection />

      {(faqs.data?.items?.length ?? 0) > 0 && (
        <Section>
          <SectionHeader eyebrow="FAQ" title="Questions, answered" align="center" />
          <div className="mx-auto max-w-3xl">
            <FaqAccordion items={faqs.data!.items} />
          </div>
        </Section>
      )}

      <FinalCta />
    </>
  );
}

/* ------------------------------------------------------------------ */

const SLIDE_DURATION = 6000;

const fadeUp = {
  hidden: { opacity: 0, y: 40, filter: "blur(4px)" },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 1, delay: 0.2 + i * 0.12, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

function Hero() {
  const { data: settings } = useQuery(settingsQ());
  const isMobile = useIsMobile();

  const heroHeadline = settings?.hero_headline || "Expert care at your doorstep";
  const heroDescription =
    settings?.hero_description ||
    "Physiotherapy, yoga therapy, massage therapy and rehabilitation — delivered at home by document-verified therapists, with portable modalities and a price you see before you pay.";

  const homeHero = settings?.home_hero;

  // Use mobile images on mobile devices if available, fallback to desktop images
  const mobileImages = homeHero?.slider_images_mobile?.length
    ? homeHero.slider_images_mobile.map((img) => img.url).filter(Boolean) as string[]
    : null;
  const desktopImages = homeHero?.slider_images?.length
    ? homeHero.slider_images.map((img) => img.url).filter(Boolean) as string[]
    : HERO_DESKTOP_IMAGES;
  const defaultMobile = (mobileImages && mobileImages.length > 0) ? mobileImages : HERO_MOBILE_IMAGES;
  const sliderImages = isMobile ? defaultMobile : desktopImages;

  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Preload all slider images on mount to prevent blank flashes
  useEffect(() => {
    sliderImages.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [sliderImages]);

  const go = useCallback(
    (next: number) => {
      setCurrent(((next % sliderImages.length) + sliderImages.length) % sliderImages.length);
    },
    [sliderImages.length],
  );

  useEffect(() => {
    timerRef.current = setInterval(() => {
      go(current + 1);
    }, SLIDE_DURATION);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [current, go]);

  return (
    <section
      id="hero-section"
      className="relative isolate flex min-h-[100svh] w-full items-center overflow-hidden"
    >
      {/* ── All images stacked, crossfade via opacity ── */}
      {sliderImages.map((src, i) => (
        <div
          key={i}
          className="absolute inset-0 -z-20"
          style={{
            opacity: i === current ? 1 : 0,
            transition: "opacity 1s ease-in-out",
            willChange: "opacity",
          }}
        >
          <img
            src={src}
            alt="Home Physiotherapy Service"
            loading="eager"
            decoding="async"
            className="h-full w-full object-cover object-center"
            style={{
              animation: i === current ? `heroKenBurns ${SLIDE_DURATION}ms ease-out forwards` : "none",
              transform: i === current ? undefined : "scale(1)",
              willChange: "transform",
              backfaceVisibility: "hidden",
            }}
          />
        </div>
      ))}

      {/* ── Overlays ── */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/90 via-black/60 to-black/30" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

      {/* ── Main Content ── */}
      <div className="relative z-10 container-x w-full flex flex-col pt-28 pb-8 lg:pt-32 lg:pb-10 justify-center min-h-[100svh]">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12 w-full h-full justify-between">
          {/* Left Text Content */}
          <div className="flex flex-col justify-center w-full lg:w-[60%] xl:w-[55%]">
            <motion.span
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={0}
              className="inline-flex self-start items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-medium backdrop-blur mb-5"
            >
              <MapPin className="h-3.5 w-3.5 text-white" />
              <span className="text-white">Now live across West Bengal</span>
            </motion.span>

            <motion.h1
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={1}
              className="font-display font-medium text-white tracking-tight leading-[1.08] text-[38px] sm:text-[48px] md:text-[56px] lg:text-[64px]"
              style={{ textShadow: "0 4px 40px rgba(0,0,0,0.5)" }}
            >
              {heroHeadline}
            </motion.h1>

            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={2}
              className="mt-5 max-w-xl text-[15px] md:text-[17px] leading-relaxed text-white/80 font-light"
              style={{ textShadow: "0 2px 20px rgba(0,0,0,0.3)" }}
            >
              {heroDescription}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={3}
              className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4"
            >
              <Link
                to="/booking"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-background px-8 py-3.5 text-[15px] font-semibold text-foreground shadow-sm transition-all duration-300 hover:opacity-90 hover:-translate-y-0.5"
              >
                Book a home visit
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </Link>
              <Link
                to="/pricing"
                className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/10 backdrop-blur-md px-8 py-3.5 text-[15px] font-medium text-white transition-all duration-300 hover:bg-white/20 hover:border-white/50 hover:-translate-y-0.5"
              >
                See pricing
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.dl
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={4}
              className="mt-10 grid max-w-lg grid-cols-3 gap-6 border-t border-white/20 pt-8"
            >
              {[
                ["₹400", "per visit, from"],
                ["40–60", "minute sessions"],
                ["24×7", "online consultation"],
              ].map(([value, label]) => (
                <div key={label}>
                  <dt className="font-display text-2xl sm:text-3xl text-white drop-shadow-md">{value}</dt>
                  <dd className="mt-1 text-xs text-white/60">{label}</dd>
                </div>
              ))}
            </motion.dl>
          </div>

          {/* Right - Slider Controls */}
          <div className="flex flex-col items-end justify-end gap-8 lg:w-[35%] h-full mt-8 lg:mt-0">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 1 }}
              className="flex items-center gap-5 mt-auto"
            >
              {/* Arrow Nav */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => go(current - 1)}
                  className="grid h-12 w-12 place-items-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition-all hover:bg-white/20 hover:border-white/40"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={() => go(current + 1)}
                  className="grid h-12 w-12 place-items-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition-all hover:bg-white/20 hover:border-white/40"
                  aria-label="Next slide"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>

              {/* Progress Bars */}
              <div className="flex items-center gap-2">
                {sliderImages.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => go(i)}
                    className="group relative h-1.5 overflow-hidden rounded-full transition-all duration-500"
                    style={{ width: i === current ? 48 : 20 }}
                    aria-label={`Go to slide ${i + 1}`}
                  >
                    <span className="absolute inset-0 rounded-full bg-white/30" />
                    {i === current && (
                      <motion.span
                        className="absolute inset-0 rounded-full bg-primary"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: SLIDE_DURATION / 1000, ease: "linear" }}
                        style={{ transformOrigin: "left" }}
                      />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── Ken Burns keyframes ── */}
      <style>{`
        @keyframes heroKenBurns {
          0%   { transform: scale(1); }
          100% { transform: scale(1.08); }
        }
      `}</style>
    </section>
  );
}

function ServicesSection() {
  return (
    <Section>
      <SectionHeader
        eyebrow="Our services"
        title="Four ways we bring recovery home"
        description="Each one is priced by its own rules, and every rule is visible before you book."
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

            {/* Highlights list */}
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
  );
}

function HowItWorks() {
  return (
    <Section className="bg-secondary/30">
      <SectionHeader
        eyebrow="How it works"
        title="From symptom to session in four steps"
      />
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {HOW_IT_WORKS.map((s) => (
          <div
            key={s.step}
            className="rounded-3xl border border-border/70 bg-card p-6 sm:p-7"
          >
            <span className="font-display text-3xl text-primary/25">{s.step}</span>
            <h3 className="mt-3 font-display text-lg tracking-tight">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {s.body}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}

function PricingStrip() {
  const items = [
    { icon: Receipt, label: "Therapist visit", value: "₹400" },
    { icon: Clock, label: "Each portable machine", value: "₹100" },
    { icon: ShieldCheck, label: "Platform fee", value: "20–35%" },
    { icon: MonitorPlay, label: "Video consultation", value: `₹${CONSULTATION_FEE}` },
  ];
  return (
    <PremiumScrollReveal>
      <section className="border-y border-border/70 bg-card py-12">
        <div className="container-x grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-primary-soft">
                <Icon className="h-5 w-5 text-primary" />
              </span>
              <div>
                <p className="font-display text-2xl leading-none">{value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </PremiumScrollReveal>
  );
}

function ModalitySection() {
  const { data: equipmentData } = useQuery(equipmentQ({ limit: 12 }));
  const apiEquipment = equipmentData?.items ?? [];
  const hasApiData = apiEquipment.length > 0;

  return (
    <Section>
      <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:items-center lg:gap-16">
        <div>
          <SectionHeader
            eyebrow="Portable modality library"
            title="Clinic machines, carried to your bedside"
            description="IFT, TENS, ultrasound, NMES and more — set up and operated by your therapist during the session. ₹100 each, and included in package plans."
          />
          <Link
            to="/equipment"
            className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium transition hover:border-primary/50 hover:text-primary"
          >
            Browse the full library
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          {hasApiData
            ? apiEquipment.map((eq) => {
                const slug = eq.slug ?? "";
                const fallbackSrc = equipmentIcon(slugToEquipmentCode(slug));
                return (
                  <Link
                    key={eq.id}
                    to="/equipment"
                    className="rounded-2xl border border-border/70 bg-card p-4 text-center transition hover:shadow-soft hover:border-primary/30"
                  >
                    <img
                      src={imageSrc(eq.featured_image, fallbackSrc)}
                      alt={eq.title ?? eq.slug}
                      className="mx-auto h-20 w-20 rounded-xl object-cover"
                    />
                    <p className="mt-2.5 text-xs font-semibold truncate">{eq.title ?? eq.slug}</p>
                  </Link>
                );
              })
            : MODALITIES.map((m) => (
                <div
                  key={m.code}
                  className="rounded-2xl border border-border/70 bg-card p-4 text-center"
                >
                  <img src={equipmentIcon(m.code)} alt={m.name} className="mx-auto h-20 w-20 rounded-xl object-cover" />
                  <p className="mt-2.5 text-xs font-semibold">{m.name}</p>
                </div>
              ))}
        </div>
      </div>
    </Section>
  );
}

function TrustSection() {
  const icons = [BadgeCheck, Receipt, MapPin, FileCheck2];
  return (
    <Section className="bg-secondary/30">
      <SectionHeader
        eyebrow="Why families choose us"
        title="Built to be checked, not just trusted"
        align="center"
      />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {TRUST_POINTS.map((t, i) => {
          const Icon = icons[i % icons.length];
          return (
            <div
              key={t.title}
              className="rounded-3xl border border-border/70 bg-card p-6 sm:p-7"
            >
              <Icon className="h-7 w-7 text-primary" />
              <h3 className="mt-4 font-display text-lg tracking-tight">{t.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {t.body}
              </p>
            </div>
          );
        })}
      </div>
    </Section>
  );
}

function ConsultationBanner() {
  return (
    <PremiumScrollReveal>
      <section className="py-16 lg:py-20">
        <div className="container-x">
          <div className="flex flex-col items-start gap-6 rounded-3xl border border-primary/25 bg-primary-soft/50 p-8 sm:flex-row sm:items-center sm:justify-between sm:p-10">
            <div className="max-w-xl">
              <p className="text-xs uppercase tracking-[0.18em] text-primary">
                Not sure where to start?
              </p>
              <h2 className="mt-2 font-display text-2xl tracking-tight sm:text-3xl">
                Talk to a physiotherapist, 24×7
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                A ₹{CONSULTATION_FEE} video consultation tells you whether you need home
                visits, which modalities help, and how many sessions to expect.
              </p>
            </div>
            <Link
              to="/video-consultation"
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
            >
              Book a consultation
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </PremiumScrollReveal>
  );
}

function CoverageSection() {
  return (
    <Section>
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div>
          <SectionHeader eyebrow="Coverage" title={COVERAGE.headline} />
          <p className="text-base leading-relaxed text-muted-foreground">
            {COVERAGE.body}
          </p>
          <ol className="mt-8 flex flex-wrap items-center gap-3">
            {COVERAGE.roadmap.map((step, i) => (
              <li key={step} className="flex items-center gap-3">
                <span
                  className={
                    i === 0
                      ? "rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground"
                      : "rounded-full border border-border px-4 py-1.5 text-sm text-muted-foreground"
                  }
                >
                  {step}
                </span>
                {i < COVERAGE.roadmap.length - 1 && (
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                )}
              </li>
            ))}
          </ol>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {["Urban", "Rural", "Village", "Locality"].map((area) => (
            <div
              key={area}
              className="rounded-3xl border border-border/70 bg-card p-6 text-center"
            >
              <MapPin className="mx-auto h-6 w-6 text-primary" />
              <p className="mt-3 font-display text-lg">{area}</p>
              <p className="text-xs text-muted-foreground">areas covered</p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

function FinalCta() {
  return (
    <Section className="bg-primary text-primary-foreground">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-display text-3xl tracking-tight md:text-5xl">
          Care that comes to you
        </h2>
        <p className="mt-4 text-primary-foreground/80">
          Book in five steps, see your full price before paying, and track every visit
          from your dashboard.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link
            to="/booking"
            className="inline-flex items-center gap-2 rounded-full bg-background px-7 py-3.5 text-sm font-semibold text-foreground transition hover:opacity-90"
          >
            Book a home visit
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center rounded-full border border-primary-foreground/30 px-7 py-3.5 text-sm font-semibold transition hover:bg-primary-foreground/10"
          >
            Talk to us
          </Link>
        </div>
      </div>
    </Section>
  );
}
