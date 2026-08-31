import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { settingsQ } from "@/lib/api/queries";
import type { HeroSlide } from "@/lib/api/types";
import { ElderCareBookingModal } from "@/components/forms/ElderCareBookingModal";
import { EquipmentBookingModal } from "@/components/forms/EquipmentBookingModal";
import { NursingBookingModal } from "@/components/forms/NursingBookingModal";
import { MotherBabyBookingModal } from "@/components/forms/MotherBabyBookingModal";
import { IcuBookingModal } from "@/components/forms/IcuBookingModal";
import { LabBookingModal } from "@/components/forms/LabBookingModal";
import { PhysioBookingModal } from "@/components/forms/PhysioBookingModal";
import { InfectionEnquiryModal } from "@/components/forms/InfectionEnquiryModal";

/* ── Default / fallback slides (static assets) ────────────────────── */

const FALLBACK_SLIDES: HeroSlide[] = [
  {
    title: "Expert Home Nursing Care",
    subtitle: "Compassionate and reliable home healthcare with professional nurses available 24/7.",
    button_text: "Book a Nurse",
    button_link: "/services/home-nursing-care",
    image_desktop: { url: "/assets/hero-desktop/hero_desktop_1_nursing_1786737139820.jpg" },
    image_mobile: { url: "/assets/hero-mobile/hero_mobile_1_nursing_1786737195851.jpg" },
  },
  {
    title: "Compassionate Elderly Care",
    subtitle: "Dedicated caregivers providing dignified, patient-centred elder care in the comfort of home.",
    button_text: "Book an Attendant",
    button_link: "/services/elderly-care",
    image_desktop: { url: "/assets/hero-desktop/hero_desktop_2_elderly_1786737273511.jpg" },
    image_mobile: { url: "/assets/hero-mobile/hero_mobile_2_elderly_1786737290173.jpg" },
  },
  {
    title: "Mother & Baby Care",
    subtitle: "Specialized postnatal care to ensure the health and comfort of both mother and newborn.",
    button_text: "Book Newborn Care",
    button_link: "/services/mother-and-baby-care",
    image_desktop: { url: "/assets/hero-desktop/hero_desktop_3_mother_baby_1786737385210.jpg" },
    image_mobile: { url: "/assets/hero-mobile/hero_mobile_3_mother_baby_1786737410186.jpg" },
  },
  {
    title: "Physiotherapy & Recovery",
    subtitle: "Medically supervised recovery care and physiotherapy delivered at home for faster healing.",
    button_text: "Book a Physiotherapist",
    button_link: "/services/physiotherapy-and-recovery",
    image_desktop: { url: "/assets/hero-desktop/hero_desktop_4_physio_1786737419510.jpg" },
    image_mobile: { url: "/assets/hero-mobile/hero_mobile_4_physio_1786737469387.jpg" },
  },
  {
    title: "Medical Equipment Rental",
    subtitle: "High-quality, sanitized medical equipment like hospital beds and oxygen concentrators delivered to your home.",
    button_text: "Rent Equipment Now",
    button_link: "/equipment",
    image_desktop: { url: "/assets/hero-desktop/hero_desktop_5_equipment_1786737493628.jpg" },
    image_mobile: { url: "/assets/hero-mobile/hero_mobile_5_equipment_1786737520362.jpg" },
  },
  {
    title: "Professional ICU Setup",
    subtitle: "Complete ICU-level care and equipment setup at home for critically ill patients.",
    button_text: "Request ICU Setup",
    button_link: "/contact",
    image_desktop: { url: "/assets/hero-desktop/hero_desktop_6_icu_1786737546853.jpg" },
    image_mobile: { url: "/assets/hero-mobile/hero_mobile_6_icu_1786737784974.jpg" },
  },
  {
    title: "Home Sample Collection",
    subtitle: "Safe and hygienic diagnostic sample collection right from your doorstep by professional phlebotomists.",
    button_text: "Book Home Lab Test",
    button_link: "/sample-collection",
    image_desktop: { url: "/assets/sample-collection/web.jpg" },
    image_mobile: { url: "/assets/sample-collection/mobile.jpg" },
  },
  {
    title: "I​nfection Control Nurse Services",
    subtitle: "Professional infection prevention & control support, training and guidance for healthcare settings.",
    button_text: "Enquire Now",
    button_link: "/infection-control-nurse",
    image_desktop: { url: "/assets/service_img_8_desktop.jpg" },
    image_mobile: { url: "/assets/service_img_8_desktop.jpg" },
  }
];

const SLIDE_DURATION = 6000; // ms per slide

/* ── 3D slide transition variants ─────────────────────────────────── */
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

/* ── Staggered text animation variants ────────────────────────────── */
const textContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.35 },
  },
  exit: {
    opacity: 0,
    transition: { staggerChildren: 0.05, staggerDirection: -1, duration: 0.4 },
  },
};

const textChild = {
  hidden: { opacity: 0, y: 40, rotateX: -15, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
  },
  exit: {
    opacity: 0,
    y: -20,
    filter: "blur(4px)",
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const buttonVariant = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, delay: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: { duration: 0.4 },
  },
};

/* ── Component ────────────────────────────────────────────────────── */
export function ServicesHeroSlider({ slides: dynamicSlides }: { slides?: HeroSlide[] }) {
  const { data: settings } = useQuery(settingsQ());
  const whatsapp = settings?.whatsapp || "+919813095627";

  const slides = dynamicSlides && dynamicSlides.length > 0 ? dynamicSlides : FALLBACK_SLIDES;

  const [[current, direction], setCurrent] = useState([0, 0]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval>>(null);
  const pausedRef = useRef(false);

  const go = useCallback(
    (next: number, dir: number) => {
      setCurrent([((next % slides.length) + slides.length) % slides.length, dir]);
    },
    [slides.length],
  );

  /* Auto-advance */
  useEffect(() => {
    if (isModalOpen) return;
    timerRef.current = setInterval(() => {
      go(current + 1, 1);
    }, SLIDE_DURATION);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [current, go, isModalOpen]);

  const slide = slides[current];
  const desktopUrl = slide.image_desktop?.url || "/assets/hero-slide-1.jpeg";
  const mobileUrl = slide.image_mobile?.url || desktopUrl;

  return (
    <section
      className="relative isolate flex min-h-[480px] lg:min-h-[540px] items-end overflow-hidden"
      style={{ perspective: "1200px" }}
    >
      {/* ── Sliding background images ─────────────────────────── */}
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
          <picture>
            <source media="(max-width: 768px)" srcSet={mobileUrl} />
            <img
              src={desktopUrl}
              alt={slide.title ?? ""}
              className="h-full w-full object-cover object-center"
              style={{
                animation: `heroKenBurns ${SLIDE_DURATION}ms ease-out forwards`,
              }}
            />
          </picture>
        </motion.div>
      </AnimatePresence>

      {/* ── Cinematic overlays ─────────────────────────────────── */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(50% 80% at 30% 60%, color-mix(in oklab, var(--primary) 22%, transparent), transparent 70%)",
        }}
      />
      {/* Subtle animated grain texture */}
      <div
        className="absolute inset-0 -z-[5] pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E\")",
        }}
      />

      {/* ── Text content (per-slide, 3D-animated) ─────────────── */}
      <div className="relative z-20 container-x w-full pb-16 pt-32 lg:pb-20 lg:pt-36">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            variants={textContainer}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="max-w-3xl"
            style={{ perspective: "800px" }}
          >
            {/* Eyebrow */}
            <motion.div
              variants={textChild}
              className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/80"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              Home Physio India
            </motion.div>

            {/* Title */}
            <motion.h1
              variants={textChild}
              className="font-display text-4xl leading-[1.15] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
              style={{ textShadow: "0 4px 40px rgba(0,0,0,0.4)" }}
            >
              {slide.title}
            </motion.h1>

            {/* Subtitle */}
            {slide.subtitle && (
              <motion.p
                variants={textChild}
                className="mt-6 max-w-2xl text-base leading-relaxed text-white/80 md:text-lg"
                style={{ textShadow: "0 2px 20px rgba(0,0,0,0.3)" }}
              >
                {slide.subtitle}
              </motion.p>
            )}

            {/* CTA Buttons */}
            <motion.div variants={buttonVariant} className="mt-6 md:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              {(() => {
                const link = slide.button_link || "";
                const btnContent = (
                  <button
                    type="button"
                    className="group inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-3.5 text-[15px] font-semibold text-primary-foreground shadow-sm transition-all duration-300 hover:brightness-110 hover:-translate-y-0.5"
                  >
                    {slide.button_text || "Book Trusted Care"}
                    <ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </button>
                );

                if (link.includes("elderly")) {
                  return <ElderCareBookingModal onOpenChange={setIsModalOpen}>{btnContent}</ElderCareBookingModal>;
                }
                if (link.includes("mother")) {
                  return <MotherBabyBookingModal onOpenChange={setIsModalOpen}>{btnContent}</MotherBabyBookingModal>;
                }
                const t = (slide.title || "").toLowerCase();
                if (t.includes("infection") || link.includes("infection")) {
                  return <InfectionEnquiryModal onOpenChange={setIsModalOpen}>{btnContent}</InfectionEnquiryModal>;
                }
                if (t.includes("icu") || link.includes("icu")) {
                  return <IcuBookingModal onOpenChange={setIsModalOpen}>{btnContent}</IcuBookingModal>;
                }
                if (t.includes("sample") || link.includes("sample")) {
                  return <LabBookingModal onOpenChange={setIsModalOpen}>{btnContent}</LabBookingModal>;
                }
                if (link.includes("nursing")) {
                  return <NursingBookingModal onOpenChange={setIsModalOpen}>{btnContent}</NursingBookingModal>;
                }
                if (link.includes("physio")) {
                  return <PhysioBookingModal onOpenChange={setIsModalOpen}>{btnContent}</PhysioBookingModal>;
                }
                if (link.includes("equipment")) {
                  return <EquipmentBookingModal onOpenChange={setIsModalOpen}>{btnContent}</EquipmentBookingModal>;
                }

                return (
                  <Link to={link || "/booking"}>
                    {btnContent}
                  </Link>
                );
              })()}

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
          </motion.div>
        </AnimatePresence>

        {/* ── Progress dots + navigation ───────────────────────── */}
        <div className="mt-12 flex items-center gap-6">
          {/* Arrow nav */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => go(current - 1, -1)}
              className="grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition-all hover:bg-white/20 hover:border-white/40"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => go(current + 1, 1)}
              className="grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition-all hover:bg-white/20 hover:border-white/40"
              aria-label="Next slide"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Progress bars */}
          <div className="flex items-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => go(i, i > current ? 1 : -1)}
                className="group relative h-1 overflow-hidden rounded-full transition-all duration-500"
                style={{ width: i === current ? 48 : 20 }}
                aria-label={`Go to slide ${i + 1}`}
              >
                <span className="absolute inset-0 rounded-full bg-white/25" />
                {i === current && (
                  <motion.span
                    className="absolute inset-0 rounded-full bg-primary"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{
                      duration: SLIDE_DURATION / 1000,
                      ease: "linear",
                    }}
                    style={{
                      transformOrigin: "left",
                      boxShadow: "0 0 12px var(--color-primary),0.6)",
                    }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Counter */}
          <div className="ml-auto hidden sm:flex items-center gap-1.5 font-display text-sm text-white/60">
            <span className="text-white text-lg font-bold">
              {String(current + 1).padStart(2, "0")}
            </span>
            <span className="text-white/30">/</span>
            <span>{String(slides.length).padStart(2, "0")}</span>
          </div>
        </div>
      </div>

      {/* ── Ken Burns keyframes (injected once) ───────────────── */}
      <style>{`
        @keyframes heroKenBurns {
          0%   { transform: scale(1);    }
          100% { transform: scale(1.08); }
        }
      `}</style>
    </section>
  );
}

function WhatsappIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}
