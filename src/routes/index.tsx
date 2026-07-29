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
    {
      image: "/assets/hero-slide-1.jpeg",
      eyebrow: "Physiotherapy",
      title: "Expert physiotherapists\nbringing recovery home.",
      description:
        "Our certified physios deliver hospital-grade rehabilitation at your doorstep — from post-surgery recovery to chronic pain management.",
      buttonText: "Book Physiotherapy",
      buttonLink: "/booking",
      stats: [
        { count: "45+", label: "Physiotherapists" },
        { count: "10K+", label: "Sessions Done" },
        { count: "98%", label: "Recovery Rate" },
        { count: "2hr", label: "Avg Response" },
      ],
    },
    {
      image: "/assets/hero-slide-2.jpeg",
      eyebrow: "Elder Care",
      title: "Compassionate senior\ncare — with dignity.",
      description:
        "Dedicated attendants and nurses providing 24/7 elder care — medication, mobility support and emotional companionship your loved ones deserve.",
      buttonText: "Explore Elder Care",
      buttonLink: "/services",
      stats: [
        { count: "200+", label: "Care Attendants" },
        { count: "50K+", label: "Families Served" },
        { count: "24/7", label: "Available" },
        { count: "4.9★", label: "Google Rating" },
      ],
    },
    {
      image: "/assets/hero-slide-3.jpeg",
      eyebrow: "Skilled Nursing",
      title: "Nurses, trained and\nverified — handpicked.",
      description:
        "From wound dressing and IV therapy to post-operative care — our nurses deliver clinical precision with a gentle, caring touch. Only 4% make the cut.",
      buttonText: "Get Nursing Care",
      buttonLink: "/booking",
      stats: [
        { count: "120+", label: "Registered Nurses" },
        { count: "30+", label: "Doctors on Panel" },
        { count: "5-step", label: "Vetting Process" },
        { count: "4%", label: "Selection Rate" },
      ],
    },
    {
      image: "/assets/hero-slide-4.jpeg",
      eyebrow: "Rehabilitation",
      title: "Rehabilitation that\nrestores confidence.",
      description:
        "Advanced physical therapy for stroke recovery, joint replacement and neurological conditions — guided by experts who truly care.",
      buttonText: "Start Rehab Plan",
      buttonLink: "/booking",
      stats: [
        { count: "95%", label: "Improvement Rate" },
        { count: "30+", label: "Specializations" },
        { count: "5K+", label: "Patients Helped" },
        { count: "1hr", label: "First Session" },
      ],
    },
  ];

  const total = slides.length;
  const next = useCallback(() => setActive((p) => (p + 1) % total), [total]);
  const prev = useCallback(() => setActive((p) => (p - 1 + total) % total), [total]);

  useEffect(() => {
    const id = setInterval(next, 6000);
    return () => clearInterval(id);
  }, [next, active]);

  const slide = slides[active];

  return (
    <section className="relative isolate overflow-hidden w-full">
      {/* Full-width background image */}
      <AnimatePresence mode="sync">
        <motion.div
          key={slide.image}
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute inset-0 -z-10"
        >
          <img
            src={slide.image}
            alt=""
            className="h-full w-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />
        </motion.div>
      </AnimatePresence>

      {/* Content overlay */}
      <div className="relative z-10 container-x py-8 lg:py-10 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.image}
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const, staggerChildren: 0.07 } }}
            exit={{ opacity: 0, y: -15, transition: { duration: 0.3 } }}
            className="max-w-2xl"
          >
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm uppercase tracking-[0.2em] text-primary mb-2"
            >
              {slide.eyebrow}
            </motion.div>

            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.05 } }}
              className="font-display text-4xl md:text-5xl lg:text-[3.5rem] font-semibold leading-[1.1] text-white whitespace-pre-line"
            >
              {slide.title}
            </motion.h2>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
              className="mt-3 max-w-lg text-[15px] md:text-base leading-relaxed text-white/75"
            >
              {slide.description}
            </motion.p>

            {/* Button */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.15 } }}
              className="mt-5"
            >
              <Link
                to={slide.buttonLink}
                className="group inline-flex items-center gap-2 rounded-full bg-[#43D4B0] px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#43D4B0]/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#43D4B0]/40"
              >
                {slide.buttonText}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </motion.div>

            {/* Stats — 4 glass cards */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
              className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3"
            >
              {slide.stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl bg-white/10 backdrop-blur-md ring-1 ring-white/15 px-4 py-4"
                >
                  <div className="font-display text-2xl sm:text-[26px] font-bold text-white leading-none">
                    {s.count}
                  </div>
                  <div className="mt-1.5 text-xs text-white/55">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Slider controls — bottom */}
        <div className="mt-8 flex items-center gap-4">
          <button
            onClick={prev}
            className="grid h-10 w-10 place-items-center rounded-full bg-white/15 backdrop-blur-sm text-white ring-1 ring-white/25 hover:bg-white/25 transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`transition-all duration-300 rounded-full ${
                  i === active
                    ? "w-8 h-2.5 bg-[#43D4B0]"
                    : "w-2.5 h-2.5 bg-white/40 hover:bg-white/60"
                }`}
              />
            ))}
          </div>

          <button
            onClick={next}
            className="grid h-10 w-10 place-items-center rounded-full bg-white/15 backdrop-blur-sm text-white ring-1 ring-white/25 hover:bg-white/25 transition-colors"
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <span className="ml-2 text-sm font-medium text-white/40 tabular-nums">
            {String(active + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
        </div>
      </div>
    </section>
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
