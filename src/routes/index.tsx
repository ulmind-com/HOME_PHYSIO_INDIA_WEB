import { useState, useEffect, useCallback } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import {
  blogsQ,
  faqsQ,
  reviewSummaryQ,
  servicesQ,
  testimonialsQ,
} from "@/lib/api/queries";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/site/Reveal";
import { Section, SectionHeader, EmptyState } from "@/components/site/Section";
import { ServicesMarquee } from "@/components/site/ServicesMarquee";
import { EquipmentCarousel } from "@/components/site/EquipmentCarousel";
import { BlogCard } from "@/components/site/cards/BlogCard";
import { VideoTestimonialsSection } from "@/components/site/VideoTestimonialsSection";
import { TestimonialCard } from "@/components/site/cards/TestimonialCard";
import { FaqAccordion } from "@/components/site/FaqAccordion";
import { GoogleReviews } from "@/components/site/GoogleReviews";
import { Hero } from "@/components/site/Hero";
import { AboutWelcomeSection } from "@/components/site/AboutWelcomeSection";
import { HowItWorksSection } from "@/components/site/HowItWorksSection";
import { ProfessionalsSection } from "@/components/site/ProfessionalsSection";



export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nupun Home Health Care — Hospital-grade care, at home" },
      {
        name: "description",
        content:
          "Verified nurses, physiotherapists and premium medical equipment — orchestrated by a dedicated advisor and delivered to your door in hours.",
      },
      { property: "og:title", content: "Nupun Home Health Care — Hospital-grade care, at home" },
      {
        property: "og:description",
        content: "Verified nurses, physiotherapists and premium medical equipment — delivered home.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

function Home() {
  return (
    <>
      <Hero />
      <AboutWelcomeSection />
      <TrustBar />
      <ServicesMarquee />
      <HowItWorksSection />
      <ProfessionalsSection />
      <EquipmentSection />
      <CareTeamSection />
      <TestimonialsSection />
      <VideoTestimonialsSection />
      <BlogVideosSection />

      <FaqSection />
      <ReviewsSection />
      <ContactCta />
    </>
  );
}



function TrustBar() {
  const items = ["Licensed nurses", "24/7 helpline", "Insurance-friendly", "Transparent pricing", "Background-checked"];
  return (
    <div className="border-y border-border/70 bg-surface/60 backdrop-blur">
      <div className="container-x py-4 overflow-hidden">
        <div className="flex items-center gap-10 whitespace-nowrap text-xs uppercase tracking-[0.2em] text-muted-foreground animate-marquee">
          {[...items, ...items, ...items].map((t, i) => (
            <span key={i} className="flex items-center gap-3">
              <span className="h-1 w-1 rounded-full bg-primary" /> {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}




function EquipmentSection() {
  return (
    <Section className="py-24 lg:py-32">
      <div className="flex items-end justify-between gap-6 mb-12 flex-wrap">
        <SectionHeader
          eyebrow="Equipment"
          title="Hospital-grade equipment, at home."
          description="Ultrasound, monitoring, anesthesiology and clinical kits — sanitised, insured and delivered."
        />
        <Link to="/equipment" className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:gap-2 transition-all">
          Browse equipment <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <EquipmentCarousel />
    </Section>
  );
}

function CareTeamSection() {
  const [active, setActive] = useState(0);
  const slides = [
    { image: "/assets/hero-slide-1.jpeg", count: "120+", role: "Registered Nurse" },
    { image: "/assets/hero-slide-2.jpeg", count: "45", role: "Physiotherapists" },
    { image: "/assets/hero-slide-3.jpeg", count: "30", role: "Doctors on panel" },
    { image: "/assets/hero-slide-4.jpeg", count: "200+", role: "Care attendants" },
  ];
  const total = slides.length;

  const next = useCallback(() => setActive((p) => (p + 1) % total), [total]);
  const prev = useCallback(() => setActive((p) => (p - 1 + total) % total), [total]);

  // Auto-play
  useEffect(() => {
    const id = setInterval(next, 4000);
    return () => clearInterval(id);
  }, [next, active]);

  return (
    <Section className="bg-dark text-white/90 rounded-[3rem] mx-4 lg:mx-10">
      <div className="grid gap-12 lg:grid-cols-2 items-center">
        {/* Left — Text */}
        <div>
          <div className="text-sm uppercase tracking-[0.2em] text-primary mb-4">Our people</div>
          <h2 className="font-display text-4xl md:text-5xl text-white">
            Nurses, physios and doctors — <span className="text-gradient">handpicked</span>.
          </h2>
          <p className="mt-5 text-white/70 max-w-lg">
            Our team is selected through a five-step vetting process: credentials, background,
            clinical assessment, communication and empathy. Only 4% make the cut.
          </p>
          <Link
            to="/about"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-white text-dark px-5 py-3 text-sm font-medium"
          >
            Meet the team <ArrowRight className="h-4 w-4" />
          </Link>

          {/* Stats row below text */}
          <div className="mt-10 grid grid-cols-2 gap-3">
            {slides.map((s, i) => (
              <button
                key={s.role}
                onClick={() => setActive(i)}
                className={`rounded-2xl border p-4 text-left transition-all duration-300 ${
                  i === active
                    ? "bg-white/10 border-primary/50 ring-1 ring-primary/30"
                    : "bg-white/5 border-white/10 hover:bg-white/8"
                }`}
              >
                <div className="font-display text-3xl text-white">{s.count}</div>
                <div className="text-sm text-white/60 mt-1">{s.role}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Right — Image Slider */}
        <div className="relative rounded-3xl overflow-hidden aspect-[4/3]">
          {/* Images */}
          <AnimatePresence mode="sync">
            <motion.img
              key={slides[active].image}
              src={slides[active].image}
              alt={slides[active].role}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </AnimatePresence>

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />

          {/* Bottom overlay — active stat + controls */}
          <div className="absolute bottom-0 inset-x-0 p-5 flex items-end justify-between">
            <div>
              <div className="font-display text-4xl text-white font-bold">
                {slides[active].count}
              </div>
              <div className="text-sm text-white/80">{slides[active].role}</div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={prev}
                className="grid h-9 w-9 place-items-center rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
                aria-label="Previous"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              {/* Dots */}
              <div className="flex gap-1.5">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    aria-label={`Slide ${i + 1}`}
                    className={`rounded-full transition-all duration-300 ${
                      i === active ? "w-6 h-2 bg-primary" : "w-2 h-2 bg-white/40 hover:bg-white/60"
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={next}
                className="grid h-9 w-9 place-items-center rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
                aria-label="Next"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

function TestimonialsSection() {
  const { data } = useQuery(testimonialsQ({ limit: 8 }));
  const items = data?.items ?? [];
  if (!items.length) return null;
  return (
    <Section>
      <SectionHeader eyebrow="Testimonials" title="Words from the families we serve." />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.slice(0, 6).map((t) => (<TestimonialCard key={t.id} t={t} />))}
      </div>
    </Section>
  );
}

function BlogVideosSection() {
  const { data: blogs } = useQuery(blogsQ({ limit: 3 }));
  const bItems = blogs?.items ?? [];
  if (!bItems.length) return null;

  return (
    <Section>
      {!!bItems.length && (
        <>
          <div className="flex items-end justify-between mb-10">
            <SectionHeader eyebrow="Journal" title="From the care blog" />
            <Link to="/blog" className="text-sm font-medium text-accent">All posts →</Link>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {bItems.map((b) => (<BlogCard key={b.id} blog={b} />))}
          </div>
        </>
      )}
    </Section>
  );
}

function FaqSection() {
  const { data } = useQuery(faqsQ({ limit: 6 }));
  const items = data?.items ?? [];
  if (!items.length) return null;
  return (
    <Section className="bg-primary-soft/40">
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionHeader eyebrow="FAQ" title="Answers, before you ask." description="Common questions from families like yours." />
          <Link to="/faq" className="inline-flex items-center gap-1 text-sm font-medium text-accent">
            All questions <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="lg:col-span-7">
          <FaqAccordion items={items.slice(0, 6)} />
        </div>
      </div>
    </Section>
  );
}

function ReviewsSection() {
  const { data } = useQuery(reviewSummaryQ());
  if (!data || data.total_reviews === 0) return null;
  return (
    <Section>
      <GoogleReviews summary={data} />
    </Section>
  );
}

function ContactCta() {
  return (
    <Section>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative overflow-hidden rounded-[2.5rem] p-10 lg:p-16 text-white shadow-[var(--shadow-elegant)]"
        style={{ background: "linear-gradient(135deg, var(--accent), var(--primary))" }}
      >
        <div className="absolute inset-0 opacity-30 mix-blend-overlay bg-[radial-gradient(circle_at_20%_20%,white,transparent_40%)]" />
        <div className="relative grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="text-sm uppercase tracking-[0.2em] text-white/70 mb-3">Ready when you are</div>
            <h2 className="font-display text-4xl md:text-5xl text-white">
              Talk to a care advisor.
            </h2>
            <p className="mt-4 text-white/80 max-w-md">
              Tell us what you need — we'll match the right nurse or equipment, usually within two hours.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <Link to="/booking" className="rounded-full bg-white text-dark px-6 py-3.5 text-sm font-medium">
              Book care
            </Link>
            <Link to="/contact" className="rounded-full border border-white/30 text-white px-6 py-3.5 text-sm font-medium">
              Contact us
            </Link>
          </div>
        </div>
      </motion.div>
    </Section>
  );
}

function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-64 rounded-3xl border border-border bg-surface animate-pulse" />
      ))}
    </div>
  );
}
