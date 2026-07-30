import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion, type Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/site/Section";
import { settingsQ } from "@/lib/api/queries";
import backdropAsset from "@/assets/professionals-backdrop.jpeg.asset.json";

type PeopleTile = {
  image: string;
  count: string;
  title: string;
  desc: string;
  ctaLabel: string;
  ctaHref: string;
};

const DEFAULT_TILES: PeopleTile[] = [
  {
    image: "/assets/equipment/ultrasound.jpeg",
    count: "120+",
    title: "Registered Nurses",
    desc: "Round-the-clock bedside care",
    ctaLabel: "Meet the nurses",
    ctaHref: "/about",
  },
  {
    image: "/assets/equipment/monitoring-1.jpeg",
    count: "45",
    title: "Physiotherapists",
    desc: "In-home rehab & recovery",
    ctaLabel: "Book a session",
    ctaHref: "/booking",
  },
  {
    image: "/assets/equipment/anesthesiology.jpeg",
    count: "30",
    title: "Doctors on panel",
    desc: "Specialist consults on call",
    ctaLabel: "Consult a doctor",
    ctaHref: "/booking",
  },
  {
    image: "/assets/equipment/monitoring-2.jpeg",
    count: "200+",
    title: "Care attendants",
    desc: "Daily-living support at home",
    ctaLabel: "Get an attendant",
    ctaHref: "/booking",
  },
];

const FEATURES = [
  {
    title: "Patient-Centered Care",
    desc: "Every plan is built around your family — routines, preferences and dignity first.",
    Icon: HeartPulseIcon,
  },
  {
    title: "Specialist Doctors",
    desc: "On-panel physicians and physiotherapists just a call away, day or night.",
    Icon: StethoIcon,
  },
  {
    title: "24 Hours Service",
    desc: "A live care advisor is always awake — dispatching help within hours.",
    Icon: ClockShieldIcon,
  },
];

// Grid order: TR, TL, BR, BL — sweep reads right → left
const REVEAL_ORDER = [1, 0, 3, 2];

const gridVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.18 } },
};

const tileVariants: Variants = {
  hidden: { opacity: 0, x: 80 },
  show: {
    opacity: 1,
    x: 0,
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

export function ProfessionalsSection() {
  const { data: settings } = useQuery(settingsQ());
  const tiles: PeopleTile[] =
    settings?.team_tiles?.length
      ? settings.team_tiles.map(t => ({
          image: t.image,
          count: t.count,
          title: t.title,
          desc: t.desc,
          ctaLabel: `View ${t.title.toLowerCase()}`,
          ctaHref: "/about",
        }))
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
            Professionals <span className="text-gradient">dedicated</span> to your health
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-3 md:mt-5 max-w-lg text-sm md:text-base text-muted-foreground"
          >
            Our team of skilled nurses, physiotherapists and doctors is committed to compassionate,
            personalised care — hospital-grade standards, delivered inside your home.
          </motion.p>

          <ul className="mt-6 md:mt-10 space-y-4 md:space-y-6">
            {FEATURES.map((f, i) => (
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
                    <f.Icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div>
                  <div className="font-display text-base md:text-xl">{f.title}</div>
                  <p className="mt-1 text-sm text-muted-foreground max-w-md">{f.desc}</p>
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

        {/* RIGHT — 2×2 image tiles */}
        <motion.div
          variants={gridVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="grid grid-cols-2 gap-4 sm:gap-5"
        >
          {REVEAL_ORDER.map((idx, position) => {
            const t = tiles[idx];
            if (!t) return null;
            // Give bottom row a slight vertical offset for editorial feel
            const offset = position >= 2 ? "sm:mt-6" : "";
            return (
              <motion.article
                key={t.title}
                variants={tileVariants}
                className={`group relative overflow-hidden rounded-3xl border border-primary/10 shadow-[var(--shadow-elegant)] ${offset}`}
                style={{ order: idx }}
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
                  className="absolute inset-x-0 bottom-0 p-4 sm:p-5 text-white"
                >
                  <motion.div variants={overlayItem}>
                    <span className="inline-flex items-center rounded-full bg-white/15 backdrop-blur-md border border-white/25 px-2.5 py-0.5 text-[11px] font-medium tracking-wide">
                      {t.count}
                    </span>
                  </motion.div>
                  <motion.h3
                    variants={overlayItem}
                    className="mt-2 font-display text-lg leading-tight"
                  >
                    {t.title}
                  </motion.h3>
                  <motion.p
                    variants={overlayItem}
                    className="mt-1 text-[11px] text-white/85 leading-snug"
                  >
                    {t.desc}
                  </motion.p>
                  <motion.div variants={overlayItem} className="mt-3 pointer-events-auto">
                    <Link
                      to={t.ctaHref}
                      className="inline-flex items-center gap-1.5 rounded-full bg-white/95 text-foreground px-3 py-1.5 text-[11px] font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      {t.ctaLabel}
                      <ArrowRight className="h-3 w-3" />
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
function HeartPulseIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.8 8.6a5.2 5.2 0 0 0-9-3.5 5.2 5.2 0 0 0-9 3.5c0 5.4 9 11 9 11s9-5.6 9-11Z" />
      <path d="M3 12h4l2-3 3 6 2-4h7" />
    </svg>
  );
}
function StethoIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 3v6a5 5 0 0 0 10 0V3" />
      <path d="M4 3h4M14 3h4" />
      <path d="M11 14v2a5 5 0 0 0 10 0v-1" />
      <circle cx="21" cy="12" r="2" />
    </svg>
  );
}
function ClockShieldIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2 4 5v6c0 5 3.5 9 8 11 4.5-2 8-6 8-11V5l-8-3Z" />
      <circle cx="12" cy="12" r="3.5" />
      <path d="M12 10v2.5l1.5 1" />
    </svg>
  );
}
