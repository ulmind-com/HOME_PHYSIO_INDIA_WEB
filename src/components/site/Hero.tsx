import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Phone, ChevronLeft, ChevronRight } from "lucide-react";
import { Counter } from "@/components/site/ui/Counter";

/* ──────────────────────────────────────────────────────
   DYNAMIC SLIDE DATA
   Each slide has its own image, title, description,
   button (text + link) and 4 stat cards.
   Later this can be fetched from a CMS / API.
   ────────────────────────────────────────────────────── */

interface HeroStat {
  value: string;
  numericValue: number;
  suffix: string;
  label: string;
}

interface HeroSlide {
  id: number;
  image: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  stats: HeroStat[];
}

const heroSlides: HeroSlide[] = [
  {
    id: 1,
    image: "/assets/hero-slide-1.jpeg",
    title: "Expert Physiotherapy\nRight at Your Doorstep",
    description:
      "Our certified physiotherapists bring hospital-grade rehabilitation care to your home — from post-surgery recovery to chronic pain management.",
    buttonText: "Book Physiotherapy",
    buttonLink: "/booking",
    stats: [
      { value: "45", numericValue: 45, suffix: "+", label: "Physiotherapists" },
      { value: "10K", numericValue: 10, suffix: "K+", label: "Sessions Done" },
      { value: "98", numericValue: 98, suffix: "%", label: "Recovery Rate" },
      { value: "2", numericValue: 2, suffix: "hr", label: "Avg Response" },
    ],
  },
  {
    id: 2,
    image: "/assets/hero-slide-2.jpeg",
    title: "Compassionate Senior\nCare at Home",
    description:
      "Dedicated attendants and nurses providing 24/7 elder care — medication management, mobility support, and emotional companionship your loved ones deserve.",
    buttonText: "Explore Elder Care",
    buttonLink: "/services",
    stats: [
      { value: "120", numericValue: 120, suffix: "+", label: "Registered Nurses" },
      { value: "200", numericValue: 200, suffix: "+", label: "Care Attendants" },
      { value: "50K", numericValue: 50, suffix: "K+", label: "Families Served" },
      { value: "4.9", numericValue: 4.9, suffix: "★", label: "Google Rating" },
    ],
  },
  {
    id: 3,
    image: "/assets/hero-slide-3.jpeg",
    title: "Skilled Nursing Care\nWhen You Need It Most",
    description:
      "From wound dressing and IV therapy to post-operative care — our verified nurses deliver clinical precision with a gentle, caring touch.",
    buttonText: "Get Nursing Care",
    buttonLink: "/booking",
    stats: [
      { value: "120", numericValue: 120, suffix: "+", label: "Trained Nurses" },
      { value: "30", numericValue: 30, suffix: "+", label: "Doctors on Panel" },
      { value: "24", numericValue: 24, suffix: "/7", label: "Available" },
      { value: "4", numericValue: 4, suffix: "%", label: "Selection Rate" },
    ],
  },
  {
    id: 4,
    image: "/assets/hero-slide-4.jpeg",
    title: "Rehabilitation That\nRestores Confidence",
    description:
      "Advanced physical therapy programs for stroke recovery, joint replacement, and neurological conditions — guided by experts who truly care.",
    buttonText: "Start Rehab Plan",
    buttonLink: "/booking",
    stats: [
      { value: "95", numericValue: 95, suffix: "%", label: "Improvement Rate" },
      { value: "30", numericValue: 30, suffix: "+", label: "Specializations" },
      { value: "5K", numericValue: 5, suffix: "K+", label: "Patients Helped" },
      { value: "1", numericValue: 1, suffix: "hr", label: "First Session" },
    ],
  },
];

const AUTOPLAY_MS = 6000;

/* ── Framer Motion variants ── */
const contentVariants = {
  enter: { opacity: 0, y: 30 },
  center: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const, staggerChildren: 0.08 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.35 } },
};

const childVariant = {
  enter: { opacity: 0, y: 20 },
  center: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.25 } },
};

/* ══════════════════════════════════════════════════════
   HERO COMPONENT
   ══════════════════════════════════════════════════════ */
export function Hero() {
  const navigate = useNavigate();
  const [active, setActive] = useState(0);
  const total = heroSlides.length;

  const next = useCallback(() => setActive((p) => (p + 1) % total), [total]);
  const prev = useCallback(() => setActive((p) => (p - 1 + total) % total), [total]);

  // Auto-play
  useEffect(() => {
    const id = setInterval(next, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [next, active]);

  const slide = heroSlides[active];

  return (
    <section className="relative isolate overflow-hidden w-full min-h-[100svh]">

      {/* ── BACKGROUND IMAGE SLIDES ── */}
      <AnimatePresence mode="sync">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute inset-0 -z-10"
        >
          <img
            src={slide.image}
            alt=""
            className="h-full w-full object-cover"
            loading={active === 0 ? "eager" : "lazy"}
            fetchPriority={active === 0 ? "high" : "auto"}
          />
          {/* Dark gradient overlay for text legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
        </motion.div>
      </AnimatePresence>

      {/* ── CONTENT OVERLAY ── */}
      <div className="relative z-10 container-x min-h-[100svh] flex flex-col justify-center pt-28 pb-16 lg:pt-32 lg:pb-20">

        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            variants={contentVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="max-w-2xl"
          >
            {/* Title */}
            <motion.h1
              variants={childVariant}
              className="font-display text-[clamp(2.2rem,5vw,4rem)] font-semibold leading-[1.1] tracking-[-0.02em] text-white whitespace-pre-line"
            >
              {slide.title}
            </motion.h1>

            {/* Description */}
            <motion.p
              variants={childVariant}
              className="mt-5 max-w-lg text-[15px] md:text-base leading-relaxed text-white/80"
            >
              {slide.description}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div variants={childVariant} className="mt-8 flex flex-wrap items-center gap-4">
              <button
                onClick={() => navigate({ to: slide.buttonLink })}
                className="group inline-flex items-center gap-2 rounded-full bg-[#43D4B0] px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#43D4B0]/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#43D4B0]/40"
              >
                {slide.buttonText}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>

              <Link
                to="/contact"
                className="group inline-flex items-center gap-2.5 text-sm font-medium text-white/90 hover:text-white transition-colors"
              >
                <span className="grid h-10 w-10 place-items-center rounded-full bg-white/15 backdrop-blur-sm text-white ring-1 ring-white/30">
                  <Phone className="h-4 w-4" />
                </span>
                Call us now!
              </Link>
            </motion.div>

            {/* Stats Row — 4 glass cards */}
            <motion.div
              variants={childVariant}
              className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-3"
            >
              {slide.stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl bg-white/10 backdrop-blur-md ring-1 ring-white/20 px-4 py-4"
                >
                  <div className="font-display text-2xl sm:text-[28px] font-bold text-white leading-none">
                    <Counter value={stat.numericValue} />
                    {stat.suffix}
                  </div>
                  <div className="mt-1.5 text-xs text-white/60">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* ── SLIDER CONTROLS (bottom) ── */}
        <div className="mt-auto pt-8 flex items-center gap-4">
          {/* Prev / Next arrows */}
          <button
            onClick={prev}
            className="grid h-10 w-10 place-items-center rounded-full bg-white/15 backdrop-blur-sm text-white ring-1 ring-white/25 hover:bg-white/25 transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          {/* Dot indicators */}
          <div className="flex items-center gap-2">
            {heroSlides.map((s, i) => (
              <button
                key={s.id}
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

          {/* Slide counter */}
          <span className="ml-2 text-sm font-medium text-white/50 tabular-nums">
            {String(active + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
        </div>
      </div>
    </section>
  );
}
