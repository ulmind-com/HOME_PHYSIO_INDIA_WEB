import { useState, useEffect, useCallback, useRef } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import {
  blogsQ,
  faqsQ,
  reviewSummaryQ,
  servicesQ,
  settingsQ,
  testimonialsQ,
} from "@/lib/api/queries";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/site/Reveal";
import { Section, SectionHeader, EmptyState } from "@/components/site/Section";
import { BlogCard } from "@/components/site/cards/BlogCard";
import { VideoTestimonialsSection } from "@/components/site/VideoTestimonialsSection";
import { TestimonialCard } from "@/components/site/cards/TestimonialCard";
import { FaqAccordion } from "@/components/site/FaqAccordion";
import { GoogleReviews } from "@/components/site/GoogleReviews";
import { Hero } from "@/components/site/Hero";
import { CategoryShowcasePremium } from "@/components/site/CategoryShowcasePremium";
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
        content:
          "Verified nurses, physiotherapists and premium medical equipment — delivered home.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

import { PremiumScrollReveal } from "@/components/site/PremiumScrollReveal";

function Home() {
  return (
    <>
      <Hero />
      <PremiumScrollReveal>
        <CategoryShowcasePremium />
      </PremiumScrollReveal>
      <PremiumScrollReveal>
        <TrustBar />
      </PremiumScrollReveal>
      <PremiumScrollReveal>
        <HowItWorksSection />
      </PremiumScrollReveal>
      <ProfessionalsSection />
      <PremiumScrollReveal>
        <CareTeamSection />
      </PremiumScrollReveal>
      <PremiumScrollReveal>
        <TestimonialsSection />
      </PremiumScrollReveal>
      <PremiumScrollReveal>
        <VideoTestimonialsSection />
      </PremiumScrollReveal>
      <PremiumScrollReveal>
        <BlogVideosSection />
      </PremiumScrollReveal>

      <PremiumScrollReveal>
        <FaqSection />
      </PremiumScrollReveal>
      <PremiumScrollReveal>
        <ReviewsSection />
      </PremiumScrollReveal>
      <PremiumScrollReveal>
        <ContactCta />
      </PremiumScrollReveal>
    </>
  );
}

function TrustBar() {
  const { data: settings } = useQuery(settingsQ());
  const items = settings?.trust_bar_items?.length
    ? settings.trust_bar_items
    : [
        "Licensed nurses",
        "24/7 helpline",
        "Insurance-friendly",
        "Transparent pricing",
        "Background-checked",
      ];
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

function CareTeamSection() {
  const { data: settings } = useQuery(settingsQ());
  const containerRef = useRef<HTMLDivElement>(null);

  const DEFAULT_SLIDES = [
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

  // Use slides from admin panel if available, otherwise use defaults
  const slides = settings?.care_team_slides?.length
    ? settings.care_team_slides.map((s) => ({
        image: s.image,
        eyebrow: s.eyebrow,
        title: s.title,
        description: s.description,
        buttonText: s.button_text,
        buttonLink: s.button_link,
        stats: s.stats,
      }))
    : DEFAULT_SLIDES;

  const total = slides.length;

  // Container-level scroll tracking (like ulmind.com)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 30,
    damping: 40,
    restDelta: 0.001,
  });

  // Create opacity + scale for each card based on its segment of the total scroll
  // Each card occupies 1/total of the scroll, fading out during its segment
  const cardAnimations = slides.map((_, i) => {
    const segmentSize = 1 / total;
    const start = i * segmentSize;
    const end = (i + 1) * segmentSize;
    const isLast = i === total - 1;

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const opacity = isLast ? 1 : useTransform(smoothProgress, [start, end], [1, 0]);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const scale = isLast ? 1 : useTransform(smoothProgress, [start, end], [1, 0.9]);

    return { opacity, scale };
  });

  return (
    <section className="relative w-full bg-background">
      {/* Stacking zone: height = slides × 100vh for scroll room */}
      <div ref={containerRef} style={{ height: `${total * 100}vh` }} className="relative">
        {slides.map((slide, i) => (
          <div
            key={i}
            className="sticky top-0 h-screen w-full flex items-center justify-center"
            style={{ zIndex: i + 1 }}
          >
            <StackedCard
              slide={slide}
              index={i}
              total={total}
              opacity={cardAnimations[i].opacity}
              scale={cardAnimations[i].scale}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

function StackedCard({
  slide,
  index,
  total,
  opacity,
  scale,
}: {
  slide: any /* eslint-disable-line @typescript-eslint/no-explicit-any */;
  index: number;
  total: number;
  opacity: any /* eslint-disable-line @typescript-eslint/no-explicit-any */;
  scale: any /* eslint-disable-line @typescript-eslint/no-explicit-any */;
}) {
  return (
    <motion.div
      style={{ opacity, scale }}
      className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[85vh] md:h-[80vh] will-change-transform"
    >
      <div className="relative w-full h-full rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-[0_-10px_60px_rgba(0,0,0,0.2)]">
        {/* Background image */}
        <img
          src={slide.image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-[center_30%]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/55 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

        {/* Content overlay */}
        <div className="relative z-10 h-full p-8 md:p-14 lg:p-20 flex flex-col justify-center">
          <div className="max-w-2xl mt-4 md:mt-0">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 backdrop-blur-md mb-5 md:mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-[11px] md:text-xs uppercase tracking-[0.2em] font-semibold text-white/90">
                {slide.eyebrow}
              </span>
            </div>

            <h2 className="font-display text-3xl sm:text-5xl md:text-[3.5rem] font-medium leading-[1.05] text-white tracking-tight drop-shadow-lg whitespace-pre-line">
              {slide.title}
            </h2>
            <p className="mt-4 md:mt-6 max-w-[500px] text-[15px] md:text-[17px] leading-relaxed text-white/80 drop-shadow-md font-light">
              {slide.description}
            </p>

            <div className="mt-8 md:mt-10">
              <Link
                to={slide.buttonLink}
                className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 md:px-8 py-3.5 md:py-4 text-[14px] md:text-[15px] font-semibold text-white shadow-[0_15px_40px_-10px_var(--color-primary),0.5)] transition-all duration-300 hover:bg-primary/90 hover:-translate-y-0.5 hover:shadow-[0_20px_50px_-10px_var(--color-primary),0.6)]"
              >
                {slide.buttonText}
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="mt-12 md:mt-16 grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-5">
              {slide.stats.map(
                (
                  s: any /* eslint-disable-line @typescript-eslint/no-explicit-any */,
                  idx: number,
                ) => (
                  <div
                    key={idx}
                    className="rounded-[1.25rem] border border-white/10 bg-white/[0.03] backdrop-blur-xl p-4 md:p-5 shadow-sm transition-all hover:bg-white/[0.05]"
                  >
                    <div className="font-display text-2xl md:text-3xl font-bold text-white tracking-tight">
                      {s.count}
                    </div>
                    <div className="mt-2 text-[10px] md:text-[11px] text-white/60 font-medium uppercase tracking-[0.1em]">
                      {s.label}
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
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
        {items.slice(0, 6).map((t) => (
          <TestimonialCard key={t.id} t={t} />
        ))}
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
            <Link to="/blog" className="text-sm font-medium text-accent">
              All posts →
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {bItems.map((b) => (
              <BlogCard key={b.id} blog={b} />
            ))}
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
    <Section className="bg-[#F8F9FA]">
      <div className="grid gap-12 lg:grid-cols-2 items-start">
        {/* Left Side: Illustration (No Animation) */}
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
              show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
            }}
            className="font-display text-3xl md:text-4xl lg:text-[2.75rem] font-bold text-foreground mb-6 leading-tight tracking-tight"
          >
            Frequently Asked
            <br />
            <span className="text-primary">Questions</span>
          </motion.h2>

          <FaqAccordion items={items.slice(0, 6)} />

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
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
  const { data: settings } = useQuery(settingsQ());
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
            <div className="text-sm uppercase tracking-[0.2em] text-white/70 mb-3">
              Ready when you are
            </div>
            <h2 className="font-display text-4xl md:text-5xl text-white">
              {settings?.cta_title || "Talk to a care advisor."}
            </h2>
            <p className="mt-4 text-white/80 max-w-md">
              {settings?.cta_description ||
                "Tell us what you need — we'll match the right nurse or equipment, usually within two hours."}
            </p>
          </div>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <Link
              to="/booking"
              className="rounded-full bg-white text-dark px-6 py-3.5 text-sm font-medium"
            >
              Book care
            </Link>
            <Link
              to="/contact"
              className="rounded-full border border-white/30 text-white px-6 py-3.5 text-sm font-medium"
            >
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
