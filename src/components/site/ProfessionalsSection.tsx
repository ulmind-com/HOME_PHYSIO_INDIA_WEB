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
  icon_image?: string | null;
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
];const DEFAULT_TILES: TileItem[] = [
  {
    image: "/assets/ic_nurse_desktop.jpg",
    count: "24/7",
    title: "Infection Control Nurse Services",
    description: "Infection prevention & control support and training",
    cta_label: "Learn More",
    cta_link: "/infection-control-nurse",
  },
  {
    image: "/assets/categories/nursing-v2.jpg?v=2",
    count: "200+",
    title: "Home Nursing Care",
    description: "Round-the-clock bedside medical care",
    cta_label: "Book Now",
    cta_link: "/booking",
  },
  {
    image: "/assets/categories/elder.jpg?v=2",
    count: "150+",
    title: "Elderly Care",
    description: "Daily living support & elderly companionship",
    cta_label: "Book Now",
    cta_link: "/booking",
  },
  {
    image: "/assets/categories/mother-baby.png",
    count: "50+",
    title: "Mother & Baby Care",
    description: "Post-delivery care for mother & newborn",
    cta_label: "Book Now",
    cta_link: "/booking",
  },
  {
    image: "/assets/categories/physio-v2.jpg?v=2",
    count: "45+",
    title: "Physiotherapy & Recovery",
    description: "In-home rehab & pain recovery",
    cta_label: "Book Now",
    cta_link: "/booking",
  },
  {
    image: "/assets/categories/equipment-v2.jpg?v=2",
    count: "100+",
    title: "Medical Equipment",
    description: "Rental medical equipment at home",
    cta_label: "Book Now",
    cta_link: "/medical-equipment",
  },
  {
    image: "/assets/categories/icu-setup.png",
    count: "30+",
    title: "ICU Setup",
    description: "Hospital-grade ICU setup delivered",
    cta_label: "Book Now",
    cta_link: "/booking",
  },
  {
    image: "/assets/categories/home-sample.png",
    count: "500+",
    title: "Home Sample Collection",
    description: "Lab tests from the comfort of home",
    cta_label: "Book Now",
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

function FeatureIcon({ icon, iconImage, className = "" }: { icon: string; iconImage?: string | null; className?: string }) {
  if (iconImage) {
    const src = typeof iconImage === "object" ? (iconImage as any).url : iconImage;
    return (
      <img
        src={src}
        alt=""
        className={className.replace("h-6 w-6", "h-9 w-9 md:h-10 md:w-10") + " object-contain scale-110"}
      />
    );
  }

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
      ? settings.home_about_features.map((f: any) => ({
          ...f,
          icon_image: typeof f.icon_image === "string" ? f.icon_image : (f.icon_image?.url || "")
        }))
      : DEFAULT_FEATURES;

  const tiles: TileItem[] =
    settings?.home_about_tiles?.length
      ? settings.home_about_tiles.map((t: any) => ({
          ...t,
          image: typeof t.image === "string" ? t.image : (t.image?.url || "")
        }))
      : DEFAULT_TILES;

  const backdrop = backdropAsset.url;

  return (
    <Section className="relative overflow-hidden pt-0 pb-10 md:pt-0 md:pb-10 lg:pt-0 lg:pb-12">
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
                      <FeatureIcon icon={f.icon} iconImage={f.icon_image} className="h-6 w-6 text-primary" />
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
          </div>

          {/* RIGHT — image tiles grid */}
          <motion.div
            variants={gridVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-2 sm:gap-3"
          >
            {tiles.map((t, idx) => {
              // Create an interesting masonry-like layout
              const offset = idx % 2 === 1 ? "sm:mt-4" : "";
              return (
                <motion.article
                  key={t.title + idx}
                  variants={tileVariants}
                  className={`group relative overflow-hidden rounded-xl sm:rounded-2xl border border-primary/10 shadow-[var(--shadow-elegant)] ${offset}`}
                >
                  <div className="aspect-square w-full">
                    <img
                      src={typeof t.image === "object" ? (t.image as any)?.url : (t.image || "/assets/nursing.webp")}
                      alt={t.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <motion.div
                    variants={overlayVariants}
                    className="absolute inset-x-0 bottom-0 p-2 sm:p-3 text-white"
                  >
                    <motion.h3
                      variants={overlayItem}
                      className="font-display text-xs sm:text-sm leading-tight text-white/95"
                    >
                      {t.title}
                    </motion.h3>
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
