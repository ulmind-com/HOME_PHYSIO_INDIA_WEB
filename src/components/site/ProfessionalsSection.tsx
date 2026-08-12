import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion, type Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/site/Section";
import { settingsQ } from "@/lib/api/queries";
import backdropAsset from "@/assets/professionals-backdrop.jpeg.asset.json";

/* ---------- Types ---------- */

type FeatureItem = {
  title: string;
  description: string;
  icon: string;
};

type TileItem = {
  image: string;
  count: string;
  title: string;
  description: string;
  cta_label: string;
  cta_link: string;
};

/* ---------- Default content (fallback when API is empty) ---------- */

const DEFAULT_HEADING = "Professionals dedicated to your health";

const DEFAULT_DESCRIPTION =
  "Nupun Home Health Care provides a qualified team of nursing staff, care attendants, physiotherapists and equipment specialists — available 8, 12 or 24 hours as per your requirement.";

const DEFAULT_FEATURES: FeatureItem[] = [
  {
    title: "ICU at Home",
    description:
      "Hospital-grade ICU setup delivered and monitored by expert critical care nurses at home.",
    icon: "icu",
  },
  {
    title: "Verified & Trained Staff",
    description:
      "Every nurse and attendant is background-checked and medically trained before entering your home.",
    icon: "shield-check",
  },
  {
    title: "24/7 Care Coordination",
    description:
      "A dedicated care advisor monitors your case round-the-clock and is always one call away.",
    icon: "clock",
  },
];

const DEFAULT_TILES: TileItem[] = [
  {
    image: "/assets/equipment/ultrasound.jpeg",
    count: "120+",
    title: "Registered Nurses",
    description: "Round-the-clock bedside medical care",
    cta_label: "Meet the nurses",
    cta_link: "/about",
  },
  {
    image: "/assets/equipment/monitoring-2.jpeg",
    count: "200+",
    title: "Care Attendants",
    description: "Daily living support & elderly companionship",
    cta_label: "Get an attendant",
    cta_link: "/booking",
  },
  {
    image: "/assets/equipment/monitoring-1.jpeg",
    count: "45+",
    title: "Physiotherapists",
    description: "In-home rehab & pain recovery",
    cta_label: "Book a session",
    cta_link: "/booking",
  },
  {
    image: "/assets/home_medical_support.png",
    count: "50+",
    title: "Home Medical Support",
    description: "Injections, blood tests, catheter & oxygen",
    cta_label: "Book a service",
    cta_link: "/booking",
  },
];

/* ---------- Animation variants ---------- */

const gridVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

const tileVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const overlayVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.25 } },
};

const overlayItem: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

/* ---------- Icon resolver ---------- */

function FeatureIcon({ icon, className = "" }: { icon: string; className?: string }) {
  switch (icon) {
    case "icu":
      return (
        <img
          src="/assets/icu-icon.png"
          alt="ICU at Home"
          className={className.replace("h-6 w-6", "h-9 w-9 md:h-10 md:w-10") + " object-contain mix-blend-multiply scale-110"}
        />
      );
    case "shield-check":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );
    case "clock":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      );
    case "heart-pulse":
    default:
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.8 8.6a5.2 5.2 0 0 0-9-3.5 5.2 5.2 0 0 0-9 3.5c0 5.4 9 11 9 11s9-5.6 9-11Z" />
          <path d="M3 12h4l2-3 3 6 2-4h7" />
        </svg>
      );
  }
}

/* ---------- Component ---------- */

export function ProfessionalsSection() {
  const { data: settings } = useQuery(settingsQ());

  // Resolve all dynamic content with fallback defaults
  const heading = settings?.home_about_heading || DEFAULT_HEADING;
  const description = settings?.home_about_description || DEFAULT_DESCRIPTION;

  const features: FeatureItem[] =
    settings?.home_about_features?.length
      ? settings.home_about_features
      : DEFAULT_FEATURES;

  const tiles: TileItem[] =
    settings?.home_about_tiles?.length
      ? settings.home_about_tiles
      : DEFAULT_TILES;

  const backdrop = backdropAsset.url;

  return (
    <Section className="relative overflow-hidden pt-12 pb-8 md:pt-20 md:pb-10 lg:pt-28 lg:pb-16">
      <div className="relative isolate overflow-hidden rounded-[2rem] border border-primary/10 shadow-[var(--shadow-elegant)]">
        {/* Full-section photo backdrop (replaces the dark shape) */}
        <motion.img
          src={backdrop}
          alt=""
          aria-hidden
          loading="lazy"
          initial={{ opacity: 0, scale: 1.06 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-none absolute inset-0 -z-20 h-full w-full object-cover"
        />
        {/* Soft light wash — no dark shape, just enough contrast for text on the left */}
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-white/85 via-white/55 to-transparent" />

        <div className="relative grid gap-8 md:gap-14 lg:grid-cols-2 lg:gap-20 items-center p-5 md:p-12 lg:p-16 text-foreground">
          {/* LEFT — copy + features */}
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs uppercase tracking-[0.22em] text-primary"
            >
              <StethoIcon className="h-4 w-4" />
              About Us
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.05 }}
              className="mt-4 md:mt-5 font-display text-2xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight"
            >
              {heading}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="mt-3 md:mt-5 max-w-lg text-sm md:text-base text-muted-foreground"
            >
              {description}
            </motion.p>

            <ul className="mt-6 md:mt-10 space-y-4 md:space-y-6">
              {features.map((f, i) => (
                <motion.li
                  key={f.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: 0.1 + i * 0.08 }}
                  className="flex items-start gap-3 md:gap-5"
                >
                  <div className="relative shrink-0">
                    <div className="absolute inset-0 rounded-2xl bg-primary/15 blur-md" />
                    <div className="relative grid h-11 w-11 md:h-14 md:w-14 place-items-center rounded-xl md:rounded-2xl glass border border-primary/20">
                      <FeatureIcon icon={f.icon} className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <div>
                    <div className="font-display text-base md:text-xl">{f.title}</div>
                    <p className="mt-1 text-sm text-muted-foreground max-w-md">
                      {f.description}
                    </p>
                  </div>
                </motion.li>
              ))}
            </ul>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-10"
            >
              <Link
                to="/about"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 md:px-7 py-3 md:py-3.5 text-xs md:text-sm font-medium text-primary-foreground shadow-[var(--shadow-elegant)] hover:gap-3 transition-all"
              >
                View More About Us <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </div>

          {/* RIGHT — 2×2 image tiles grid */}
          <motion.div
            variants={gridVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="grid grid-cols-2 gap-3 sm:gap-4"
          >
            {tiles.map((t, idx) => {
              // Offset odd rows slightly for editorial feel
              const offset = idx >= 2 ? "sm:mt-4" : "";
              return (
                <motion.article
                  key={t.title + idx}
                  variants={tileVariants}
                  className={`group relative overflow-hidden rounded-2xl sm:rounded-3xl border border-primary/10 shadow-[var(--shadow-elegant)] ${offset}`}
                >
                  <div className="aspect-[4/5] w-full">
                    <img
                      src={t.image}
                      alt={t.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
                  <motion.div
                    variants={overlayVariants}
                    className="absolute inset-x-0 bottom-0 p-3 sm:p-4 md:p-5 text-white"
                  >
                    <motion.div variants={overlayItem}>
                      <span className="inline-flex items-center rounded-full bg-primary text-white border border-white/20 px-2 sm:px-2.5 py-0.5 text-[10px] sm:text-[11px] font-bold tracking-wide shadow-sm">
                        {t.count}
                      </span>
                    </motion.div>
                    <motion.h3
                      variants={overlayItem}
                      className="mt-1.5 sm:mt-2 font-display text-sm sm:text-lg leading-tight"
                    >
                      {t.title}
                    </motion.h3>
                    <motion.p
                      variants={overlayItem}
                      className="mt-0.5 sm:mt-1 text-[10px] sm:text-[11px] text-white/85 leading-snug"
                    >
                      {t.description}
                    </motion.p>
                    <motion.div variants={overlayItem} className="mt-2 sm:mt-3 pointer-events-auto">
                      <Link
                        to={t.cta_link}
                        className="inline-flex items-center gap-1 sm:gap-1.5 rounded-full bg-white/95 text-foreground px-2.5 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-[11px] font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        {t.cta_label}
                        <ArrowRight className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                      </Link>
                    </motion.div>
                  </motion.div>
                </motion.article>
              );
            })}
          </motion.div>
        </div>
      </div>
    </Section>
  );
}

/* ---------- Custom SVG icons ---------- */
function StethoIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 3v6a5 5 0 0 0 10 0V3" />
      <path d="M4 3h4M14 3h4" />
      <path d="M11 14v2a5 5 0 0 0 10 0v-1" />
      <circle cx="21" cy="12" r="2" />
    </svg>
  );
}
