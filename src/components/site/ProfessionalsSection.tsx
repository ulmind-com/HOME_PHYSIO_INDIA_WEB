import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/site/Section";
import { settingsQ } from "@/lib/api/queries";

const DEFAULT_MAIN = "/assets/categories/elder.jpg";
const DEFAULT_INSET = "/assets/categories/nursing.jpg";

const DEFAULT_HOURS = [
  { day: "Mon – Fri", hours: "09:30 – 19:30" },
  { day: "Saturday", hours: "10:30 – 17:00" },
  { day: "Sunday", hours: "Closed" },
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

export function ProfessionalsSection() {
  const { data: settings } = useQuery(settingsQ());
  const hours = settings?.working_hours?.length ? settings.working_hours : DEFAULT_HOURS;

  return (
    <Section className="relative overflow-hidden">
      {/* Decorative background */}
      <DecorBackdrop />

      <div className="relative grid gap-14 lg:grid-cols-2 lg:gap-20 items-center">
        {/* LEFT — copy + features */}
        <div>
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
            className="mt-5 font-display text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight"
          >
            Professionals <span className="text-gradient">dedicated</span> to your health
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-5 max-w-lg text-muted-foreground"
          >
            Our team of skilled nurses, physiotherapists and doctors is committed to compassionate,
            personalised care — hospital-grade standards, delivered inside your home.
          </motion.p>

          <ul className="mt-10 space-y-6">
            {FEATURES.map((f, i) => (
              <motion.li
                key={f.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: 0.1 + i * 0.08 }}
                className="flex items-start gap-5"
              >
                <div className="relative shrink-0">
                  <div className="absolute inset-0 rounded-2xl bg-primary/15 blur-md" />
                  <div className="relative grid h-14 w-14 place-items-center rounded-2xl glass border border-primary/20">
                    <f.Icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div>
                  <div className="font-display text-xl">{f.title}</div>
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
              className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground shadow-[var(--shadow-elegant)] hover:gap-3 transition-all"
            >
              View More About Us <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>

        {/* RIGHT — layered images */}
        <div className="relative mx-auto w-full max-w-[560px] lg:mx-0">
          <div className="relative aspect-[4/5]">
            {/* Main tall image (right, bottom) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="absolute right-0 bottom-0 w-[72%] h-[86%] overflow-hidden rounded-[2.5rem] border border-primary/10 shadow-[var(--shadow-elegant)]"
            >
              <img
                src={DEFAULT_MAIN}
                alt="Nupun caregiver attending an elderly patient"
                className="h-full w-full object-cover"
                loading="lazy"
              />
              <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/20 rounded-[2.5rem]" />
            </motion.div>

            {/* Inset card top-left */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="absolute left-0 top-0 w-[54%] rounded-[2rem] overflow-hidden shadow-[var(--shadow-elegant)] border border-primary/10 bg-surface"
            >
              <div className="aspect-[4/5]">
                <img
                  src={DEFAULT_INSET}
                  alt="Nupun nurse ready for a home visit"
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="bg-dark text-white text-center py-3 text-[11px] tracking-[0.28em] uppercase font-medium">
                Video Call Support
              </div>
            </motion.div>

            {/* Opening hours floating card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="absolute -right-2 -bottom-4 w-[60%] max-w-[300px]"
            >
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="relative rounded-3xl p-6 text-white shadow-[var(--shadow-elegant)]"
                style={{ background: "linear-gradient(135deg, var(--primary), var(--accent))" }}
              >
                <div className="absolute -top-5 right-5 grid h-11 w-11 place-items-center rounded-full bg-dark text-white shadow-lg">
                  <ClockGlyph className="h-5 w-5" />
                </div>
                <div className="font-display text-xl mb-4">Opening Hours</div>
                <ul className="space-y-2 text-sm">
                {hours.slice(0, 3).map((h) => (
                  <li key={h.day} className="flex items-center justify-between gap-4">
                    <span className="text-white/80">{h.day}</span>
                    <span className="font-medium">{h.hours}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </Section>
  );
}

/* ---------- Decorative backdrop ---------- */
function DecorBackdrop() {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute -right-24 top-10 w-[720px] max-w-[70%] opacity-[0.35]"
      viewBox="0 0 600 600"
      fill="none"
    >
      <defs>
        <radialGradient id="proBlob" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <path
        d="M420 90c70 30 130 100 130 190s-40 170-120 220-190 40-260-20-100-160-60-250S250 30 340 40s80 50 80 50z"
        fill="url(#proBlob)"
      />
      <g stroke="var(--primary)" strokeOpacity="0.25" fill="none">
        <circle cx="300" cy="300" r="120" />
        <circle cx="300" cy="300" r="180" strokeDasharray="2 8" />
        <circle cx="300" cy="300" r="240" strokeDasharray="1 12" />
      </g>
    </svg>
  );
}

/* ---------- Custom SVG icons (hand-crafted, unique) ---------- */
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
function ClockGlyph({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}
