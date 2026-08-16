import { motion } from "framer-motion";
import { BadgeCheck, Shield, Clock, Users, HeartPulse, MessageCircle, Award } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { settingsQ } from "@/lib/api/queries";
import { imgUrl } from "@/lib/utils";

const DEFAULT_COMMITMENTS = [
  {
    icon: "clock",
    text: "2-hour caregiver replacement SLA",
  },
  {
    icon: "shield",
    text: "Background-verified & trained staff",
  },
  {
    icon: "heartpulse",
    text: "Clinical oversight on invasive care",
  },
  {
    icon: "award",
    text: "Transparent hourly / daily pricing",
  },
  {
    icon: "message",
    text: "WhatsApp shift updates & vitals",
  },
  {
    icon: "users",
    text: "24/7 care desk, always reachable",
  },
];

const ICON_MAP: Record<string, React.ElementType> = {
  clock: Clock,
  shield: Shield,
  heartpulse: HeartPulse,
  award: Award,
  message: MessageCircle,
  users: Users,
  default: BadgeCheck,
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function CommitmentSection() {
  const { data: settings } = useQuery(settingsQ());

  // Section header — dynamic with fallback
  const eyebrow = settings?.why_choose_eyebrow || "Our Promise";
  const sectionTitle = settings?.why_choose_title || "Why Choose Nupun Home Care?";
  const sectionDescription =
    settings?.why_choose_description ||
    "We go beyond standard care to ensure your peace of mind and your loved one\u2019s well-being \u2014 every visit, every time.";
  const commitmentSubtitle = settings?.commitment_subtitle || "Our Commitment to Excellence";
  const badgeValue = settings?.commitment_badge_value || "100%";
  const badgeLabel = settings?.commitment_badge_label || "Verified Staff";

  // Commitment items — prefer new commitment_items (with icons), fallback to about_commitments (text only), then defaults
  const commitmentItems = settings?.commitment_items?.length
    ? settings.commitment_items
    : settings?.about_commitments?.length
    ? settings.about_commitments.map((text) => ({ icon: "default", text }))
    : DEFAULT_COMMITMENTS;

  // Dynamic image from admin panel, fallback to default
  const rawImg = settings?.commitment_image;
  const teamImage = imgUrl(rawImg) || "/assets/commitment-team.png";

  // Parse title to highlight the brand name
  const titleParts = sectionTitle.split(/(Nupun)/i);

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-[#f7fafa] via-white to-[#f0f7f6] py-16 md:py-24 lg:py-28">
      {/* Decorative elements */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-primary/[0.04] blur-[100px]" />
        <div className="absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-accent/[0.04] blur-[100px]" />
        {/* Dot pattern */}
        <div
          className="absolute right-[8%] top-[15%] h-32 w-32 opacity-[0.08] text-primary"
          style={{
            backgroundImage: "radial-gradient(currentColor 1.2px, transparent 1.2px)",
            backgroundSize: "14px 14px",
          }}
        />
      </div>

      <div className="container-x relative z-10">
        {/* Top Section — Why Choose */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-14 md:mb-20 max-w-3xl text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-accent backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            {eyebrow}
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-medium tracking-tight text-foreground leading-[1.15]">
            {titleParts.map((part, i) =>
              part.toLowerCase() === "nupun" ? (
                <span key={i} className="relative inline-block">
                  <span className="relative z-10 text-primary">{part}</span>
                  <svg
                    className="absolute -bottom-2 left-0 h-3 w-full text-primary/30"
                    viewBox="0 0 200 12"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M2 8 Q 50 -2, 100 6 T 198 4"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              ) : (
                <span key={i}>{part}</span>
              )
            )}
          </h2>
          <p className="mt-6 text-base md:text-lg leading-relaxed text-muted-foreground max-w-2xl mx-auto">
            {sectionDescription}
          </p>
        </motion.div>

        {/* Bottom — Commitments Grid + Image */}
        <div className="grid items-center gap-10 lg:gap-16 lg:grid-cols-[1fr_auto]">
          {/* Left — Commitment Cards */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-8"
            >
              <h3 className="font-display text-2xl md:text-3xl font-medium text-foreground tracking-tight">
                {commitmentSubtitle}
              </h3>
            </motion.div>

            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              className="grid gap-3 sm:gap-4 sm:grid-cols-2"
            >
              {commitmentItems.map((item, i) => {
                const IconComp = ICON_MAP[item.icon] || ICON_MAP.default;
                return (
                  <motion.div
                    key={i}
                    variants={fadeUp}
                    className="group flex items-start gap-4 rounded-2xl border border-border/60 bg-white/80 p-5 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)] backdrop-blur-sm transition-all duration-300 hover:shadow-[0_8px_30px_-8px_rgba(0,0,0,0.1)] hover:-translate-y-0.5 hover:border-primary/30"
                  >
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
                      <IconComp className="h-5 w-5" strokeWidth={2} />
                    </div>
                    <span className="text-[15px] font-medium leading-snug text-foreground/90 pt-2">
                      {item.text}
                    </span>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

          {/* Right — Team Image (dynamic from admin panel) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: 30 }}
            whileInView={{ opacity: 1, scale: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto lg:mx-0 w-full max-w-md lg:max-w-[420px]"
          >
            {/* Decorative frame elements */}
            <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-primary/20 via-primary/5 to-accent/10 -z-10 blur-sm" />
            <div className="absolute -top-4 -right-4 h-20 w-20 rounded-full bg-primary/10 -z-10" />
            <div className="absolute -bottom-4 -left-4 h-16 w-16 rounded-full bg-accent/10 -z-10" />

            <div className="overflow-hidden rounded-[1.5rem] border-2 border-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)]">
              <img
                src={teamImage}
                alt="Nupun Home Health Care Team"
                loading="lazy"
                decoding="async"
                className="w-full h-auto object-cover aspect-[4/3]"
              />
            </div>

            {/* Floating badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="absolute -bottom-5 -left-5 md:-left-8 z-10 flex items-center gap-2.5 rounded-2xl border border-border/60 bg-white px-4 py-3 shadow-lg"
            >
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-white">
                <Shield className="h-4.5 w-4.5" strokeWidth={2.5} />
              </div>
              <div>
                <div className="text-sm font-bold text-foreground leading-none">{badgeValue}</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">{badgeLabel}</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
