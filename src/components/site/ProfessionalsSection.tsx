import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/site/Section";
import { settingsQ } from "@/lib/api/queries";

type PersonCard = {
  image: string;
  title: string;
  subtitle: string;
  cta_label?: string;
  cta_href?: string;
};

const DEFAULT_PEOPLE: PersonCard[] = [
  {
    image: "/assets/people/skilled-nursing.jpg",
    title: "Skilled Nursing",
    subtitle: "Trained nurses at home",
  },
  {
    image: "/assets/people/senior-care.jpg",
    title: "Senior Care",
    subtitle: "Companionship & mobility",
  },
  {
    image: "/assets/people/physiotherapy.jpg",
    title: "Physiotherapy",
    subtitle: "Movement & recovery",
  },
  {
    image: "/assets/people/specialist-doctor.jpg",
    title: "Specialist Doctors",
    subtitle: "Consult at home",
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
    desc: "On-panel physicians and physiotherapists just a call away.",
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
  const adminPeople = (settings as unknown as { professionals?: PersonCard[]; people?: PersonCard[] } | undefined);
  const source =
    adminPeople?.professionals?.length ? adminPeople.professionals :
    adminPeople?.people?.length ? adminPeople.people :
    DEFAULT_PEOPLE;

  const items = source;
  const loop = [...items, ...items];
  const duration = Math.max(28, items.length * 7);

  return (
    <Section className="relative overflow-hidden py-14 md:py-20">
      <div className="relative grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
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
            className="mt-5 font-display text-3xl md:text-4xl lg:text-5xl leading-[1.05] tracking-tight"
          >
            Professionals <span className="text-gradient">dedicated</span> to your health
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-4 max-w-lg text-sm md:text-base text-muted-foreground"
          >
            Nurses, physios and doctors — handpicked, background-checked and trained to deliver
            hospital-grade care inside your home.
          </motion.p>

          <ul className="mt-8 space-y-5">
            {FEATURES.map((f, i) => (
              <motion.li
                key={f.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: 0.1 + i * 0.08 }}
                className="flex items-start gap-4"
              >
                <div className="relative shrink-0">
                  <div className="absolute inset-0 rounded-2xl bg-primary/15 blur-md" />
                  <div className="relative grid h-12 w-12 place-items-center rounded-2xl glass border border-primary/20">
                    <f.Icon className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <div>
                  <div className="font-display text-lg">{f.title}</div>
                  <p className="mt-0.5 text-sm text-muted-foreground max-w-md">{f.desc}</p>
                </div>
              </motion.li>
            ))}
          </ul>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8"
          >
            <Link
              to="/about"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-[var(--shadow-elegant)] hover:gap-3 transition-all"
            >
              View More About Us <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>

        {/* RIGHT — auto-scrolling people marquee */}
        <div className="relative">
          <div className="relative overflow-hidden group">
            {/* edge fade masks */}
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 md:w-16 bg-gradient-to-r from-background to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 md:w-16 bg-gradient-to-l from-background to-transparent" />

            <motion.div
              className="flex gap-4 w-max py-2 [--play-state:running] group-hover:[--play-state:paused]"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration, ease: "linear", repeat: Infinity }}
              style={{ willChange: "transform", animationPlayState: "var(--play-state)" as unknown as string }}
              whileHover={{}}
            >
              {loop.map((p, i) => (
                <PeopleCard key={`${p.title}-${i}`} card={p} />
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ---------- Person card ---------- */
function PeopleCard({ card }: { card: PersonCard }) {
  const href = card.cta_href ?? "/booking";
  const ctaLabel = card.cta_label ?? "Book Now";

  return (
    <div className="w-[200px] md:w-[230px] shrink-0">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] border border-primary/10 shadow-[var(--shadow-elegant)] bg-surface">
        <img
          src={card.image}
          alt={card.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out hover:scale-[1.06]"
        />
        {/* bottom scrim */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* overlay content — animates in each time it enters view */}
        <motion.div
          initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: false, amount: 0.6 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="absolute inset-x-3 bottom-3 flex flex-col gap-2 text-white"
        >
          <div>
            <div className="font-display text-base leading-tight">{card.title}</div>
            <p className="text-[11px] text-white/80 leading-snug line-clamp-2">{card.subtitle}</p>
          </div>
          <Link
            to={href}
            className="inline-flex w-fit items-center gap-1.5 rounded-full border border-white/40 bg-white/20 backdrop-blur-xl px-3 py-1.5 text-[11px] font-medium text-white hover:bg-white/30 transition-colors"
          >
            {ctaLabel}
            <ArrowRight className="h-3 w-3" />
          </Link>
        </motion.div>
      </div>
    </div>
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
