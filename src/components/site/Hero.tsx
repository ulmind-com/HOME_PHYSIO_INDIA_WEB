import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  Heart,
  ShieldCheck,
  Clock,
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { settingsQ } from "@/lib/api/queries";
import { Counter } from "@/components/site/ui/Counter";

const HERO_IMAGES = [
  "/assets/premium-hero-new-1.png",
  "/assets/premium-hero-new-2.png",
  "/assets/premium-hero-new-3.png",
  "/assets/premium-hero-new-4.png",
  "/assets/premium-hero-new-5.png",
];

const SLIDE_DURATION = 6000;

const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? "100%" : "-100%",
    scale: 0.88,
    rotateY: dir > 0 ? 12 : -12,
    opacity: 0,
    filter: "brightness(0.4)",
  }),
  center: {
    x: 0,
    scale: 1,
    rotateY: 0,
    opacity: 1,
    filter: "brightness(1)",
    transition: {
      duration: 0.9,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
  exit: (dir: number) => ({
    x: dir > 0 ? "-50%" : "50%",
    scale: 0.92,
    rotateY: dir > 0 ? -8 : 8,
    opacity: 0,
    filter: "brightness(0.3)",
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: 0.4 + i * 0.1, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

export function Hero() {
  const navigate = useNavigate();
  const { data: settings } = useQuery(settingsQ());

  const rawNumber = settings?.whatsapp || settings?.phone || "919876543210";
  const whatsapp = rawNumber.replace(/\D/g, "");

  const heroHeadline = settings?.hero_headline || "Trusted Home Health Care at Your Doorstep";
  const heroSubtitle = settings?.hero_subtitle || "Har Pal Aapke Apno Ke Sath";
  const heroDescription =
    settings?.hero_description ||
    "Professional Nursing Care, Patient Attendant, Elderly Care, and Physiotherapy at home across Delhi NCR. Delivering hospital-quality care with compassion.";

  const homeHero = settings?.home_hero;
  const sliderImages = homeHero?.slider_images?.length
    ? homeHero.slider_images.map((img) => img.url)
    : HERO_IMAGES;
  const trustText = homeHero?.trust_badge_text || "Trusted by 5,000+";
  const trustQuote =
    homeHero?.trust_badge_quote ||
    '"Their nursing staff is extremely professional and compassionate. Highly recommended!"';
  const avatars = homeHero?.trust_badge_avatars?.length
    ? homeHero.trust_badge_avatars.map((img) => img.url)
    : [1, 2, 3, 4].map((i) => `https://i.pravatar.cc/100?img=${i + 20}`);

  const stats = homeHero?.stats?.length
    ? homeHero.stats
    : [
        { value: 100, suffix: "+", label: "Verified Caregivers" },
        { value: 5, suffix: "K+", label: "Happy Families" },
        { value: 24, suffix: "/7", label: "Support Available" },
      ];

  const getStatIcon = (index: number) => {
    const ICONS = [ShieldCheck, Users, Clock, Heart];
    const Icon = ICONS[index % ICONS.length];
    return <Icon className="w-5 h-5 text-primary" />;
  };

  const [[current, direction], setCurrent] = useState([0, 0]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const go = useCallback(
    (next: number, dir: number) => {
      setCurrent([((next % sliderImages.length) + sliderImages.length) % sliderImages.length, dir]);
    },
    [sliderImages.length],
  );

  useEffect(() => {
    timerRef.current = setInterval(() => {
      go(current + 1, 1);
    }, SLIDE_DURATION);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [current, go]);

  const bg = sliderImages[current];

  return (
    <section
      className="relative isolate flex min-h-[100svh] w-full items-center overflow-hidden"
      style={{ perspective: "1200px" }}
    >
      {/* ── Sliding Background Images ── */}
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={current}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0 -z-20"
          style={{ transformStyle: "preserve-3d" }}
        >
          <img
            src={bg}
            alt="Premium Home Health Care"
            className="h-full w-full object-cover object-[center_30%]"
            style={{
              animation: `heroKenBurns ${SLIDE_DURATION}ms ease-out forwards`,
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* ── Overlays ── */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/90 via-black/60 to-black/30" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

      {/* ── Subtle animated grain texture ── */}
      <div
        className="absolute inset-0 -z-[5] pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E\")",
        }}
      />

      {/* ── Main Content Grid ── */}
      <div className="relative z-10 container-x w-full flex flex-col pt-28 pb-8 lg:pt-32 lg:pb-10 justify-center min-h-[100svh]">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12 w-full h-full justify-between">
          {/* Left Text Content */}
          <div className="flex flex-col justify-center w-full lg:w-[60%] xl:w-[55%]">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={0}
              className="mb-4 inline-flex self-start items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md shadow-sm"
            >
              <Heart className="h-4 w-4 text-primary fill-primary/20" />
              <span className="text-[13px] sm:text-sm font-medium tracking-wide text-white uppercase">
                {heroSubtitle}
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={1}
              className="font-display font-medium text-white tracking-tight leading-[1.1] text-[40px] sm:text-[48px] md:text-[56px] lg:text-[64px]"
              style={{ textShadow: "0 4px 40px rgba(0,0,0,0.5)" }}
            >
              {heroHeadline.includes("Doorstep") ? (
                <>
                  Trusted Home Health Care at Your{" "}
                  <span className="text-primary font-semibold italic">Doorstep</span>
                </>
              ) : (
                <>{heroHeadline}</>
              )}
            </motion.h1>

            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={2}
              className="mt-4 max-w-[540px] text-[15px] md:text-[17px] leading-relaxed text-white/80 font-light"
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
              className="mt-6 md:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4"
            >
              <button
                onClick={() => navigate({ to: "/booking" })}
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-3.5 text-[15px] font-semibold text-primary-foreground shadow-sm transition-all duration-300 hover:brightness-110 hover:-translate-y-0.5"
              >
                Book Consultation
                <ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>

              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-2.5 rounded-full border border-white/30 bg-white/10 backdrop-blur-md px-8 py-3.5 text-[15px] font-medium text-white shadow-sm hover:bg-white/20 hover:border-white/50 transition-all duration-300 hover:-translate-y-0.5"
              >
                <WhatsappIcon className="h-5 w-5 text-[#25D366]" />
                WhatsApp Us
              </a>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={4}
              className="mt-8 md:mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 pt-6 border-t border-white/20"
            >
              {stats.map((stat, idx) => (
                <StatItem
                  key={idx}
                  icon={getStatIcon(idx)}
                  value={stat.value}
                  suffix={stat.suffix}
                  label={stat.label}
                />
              ))}
            </motion.div>
          </div>

          {/* Right Floating Trust Badge & Slider Controls */}
          <div className="flex flex-col items-end gap-8 lg:w-[35%]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl rounded-3xl p-5 md:p-6 flex flex-col gap-4 max-w-[280px]"
            >
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  {avatars.map((url, i) => (
                    <img
                      key={i}
                      src={url}
                      alt="User avatar"
                      className="w-10 h-10 rounded-full border-2 border-slate-800 object-cover shadow-sm"
                    />
                  ))}
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1 text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-white/90 mt-1">{trustText}</span>
                </div>
              </div>
              <p className="text-xs text-white/70 italic leading-relaxed">{trustQuote}</p>
            </motion.div>

            {/* Progress Dots + Navigation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 1 }}
              className="flex items-center gap-5 mt-auto"
            >
              {/* Arrow Nav */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => go(current - 1, -1)}
                  className="grid h-12 w-12 place-items-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition-all hover:bg-white/20 hover:border-white/40"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={() => go(current + 1, 1)}
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
                    onClick={() => go(i, i > current ? 1 : -1)}
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

function StatItem({
  icon,
  value,
  suffix,
  label,
}: {
  icon: React.ReactNode;
  value: number;
  suffix: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md shadow-sm border border-white/20">
        {icon}
      </span>
      <div>
        <div className="font-display text-2xl font-semibold text-white flex items-baseline drop-shadow-md">
          <Counter value={value} />
          <span>{suffix}</span>
        </div>
        <div className="mt-0.5 text-[11px] font-medium text-white/70 uppercase tracking-wider">
          {label}
        </div>
      </div>
    </div>
  );
}

function WhatsappIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}
