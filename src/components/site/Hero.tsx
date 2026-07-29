import { useNavigate, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowRight, Phone, Building2, Stethoscope, Users } from "lucide-react";
import { reviewSummaryQ } from "@/lib/api/queries";
import { Counter } from "@/components/site/ui/Counter";

const heroTeam = { url: "/assets/hero-doctors-team.png" };

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export function Hero() {
  const navigate = useNavigate();
  const { data: reviews } = useQuery(reviewSummaryQ());
  const totalReviews = reviews?.total_reviews ?? 320;

  return (
    <section className="relative isolate overflow-hidden w-full bg-white">
      {/* ── MAIN SPLIT LAYOUT ── */}
      <div className="relative min-h-[100svh] flex flex-col lg:flex-row">

        {/* ─── LEFT SIDE: WHITE CONTENT ─── */}
        <div className="relative z-10 flex flex-col justify-center px-6 sm:px-10 lg:px-16 xl:px-24 pt-28 pb-10 lg:pt-0 lg:pb-0 lg:w-[52%]">

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0}
            className="font-display text-[clamp(2.2rem,4.5vw,3.8rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-foreground"
          >
            Putting your{" "}
            <span className="relative inline-block">
              <span className="relative z-10">health</span>
              <span
                aria-hidden
                className="absolute inset-x-0 bottom-1 h-3 -z-0 rounded-full"
                style={{ background: "color-mix(in oklab, var(--primary) 40%, transparent)" }}
              />
            </span>{" "}
            first with empathy and{" "}
            <span className="italic text-accent">skill</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={1}
            className="mt-6 max-w-lg text-base md:text-[17px] leading-relaxed text-muted-foreground"
          >
            We are a leading home healthcare provider across Delhi NCR,
            dedicated to providing exceptional and compassionate care for all
            patients right at their doorstep.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={2}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <button
              onClick={() => navigate({ to: "/booking" })}
              className="group relative inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-accent to-primary px-7 py-3.5 text-sm font-semibold text-white shadow-[0_14px_34px_-10px_color-mix(in_oklab,var(--accent)_70%,transparent)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_50px_-14px_color-mix(in_oklab,var(--accent)_80%,transparent)]"
            >
              Get Started
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>

            <Link
              to="/contact"
              className="group inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-foreground ring-1 ring-border/70 hover:bg-gray-50 transition-all"
            >
              <span className="grid h-8 w-8 place-items-center rounded-full bg-primary-soft text-accent">
                <Phone className="h-3.5 w-3.5" />
              </span>
              Call us now!
            </Link>
          </motion.div>

          {/* Stats Row */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={3}
            className="mt-12 flex flex-wrap items-center gap-8 sm:gap-12"
          >
            <StatItem
              icon={Building2}
              value={<><Counter value={50} />+</>}
              label="Clinics"
            />
            <StatItem
              icon={Stethoscope}
              value={<><Counter value={2} />K+</>}
              label="Doctors"
            />
            <StatItem
              icon={Users}
              value={<><Counter value={50} />K+</>}
              label="Patients"
            />
          </motion.div>
        </div>

        {/* ─── RIGHT SIDE: TEAL BACKGROUND + DOCTORS ─── */}
        <div className="relative lg:w-[48%] min-h-[340px] lg:min-h-full">

          {/* Teal background fill */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background: "linear-gradient(160deg, #3DD1C4 0%, #33C4C7 40%, #2BB8B0 100%)",
            }}
          />

          {/* Decorative SVG circles */}
          <DecorativeCircles />

          {/* Doctors image — positioned to overlap slightly into white area */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="relative h-full flex items-end justify-center lg:justify-start"
          >
            <img
              src={heroTeam.url}
              alt="Nupun Home Health Care — Expert medical team of doctors and nurses"
              className="relative z-10 w-full max-w-[520px] lg:max-w-none lg:w-[110%] lg:-ml-[10%] object-contain object-bottom drop-shadow-2xl"
              loading="eager"
              fetchPriority="high"
              style={{ mixBlendMode: "normal" }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ── Stat Item (bottom-left) ── */
function StatItem({
  icon: Icon,
  value,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>;
  value: React.ReactNode;
  label: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary-soft text-accent">
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <div className="font-display text-2xl sm:text-[28px] font-semibold text-foreground leading-none">
          {value}
        </div>
        <div className="mt-0.5 text-xs text-muted-foreground">{label}</div>
      </div>
    </div>
  );
}

/* ── Decorative concentric circles on the teal side ── */
function DecorativeCircles() {
  return (
    <>
      {/* Top-right large concentric */}
      <svg
        aria-hidden
        className="absolute -top-10 -right-10 h-52 w-52 text-white/20 animate-float-slow"
        viewBox="0 0 200 200"
      >
        <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="100" cy="100" r="60" fill="none" stroke="currentColor" strokeWidth="1.5" />
      </svg>

      {/* Middle-right small solid dot */}
      <svg
        aria-hidden
        className="absolute top-[30%] right-[8%] h-10 w-10 text-white/25"
        viewBox="0 0 40 40"
      >
        <circle cx="20" cy="20" r="8" fill="currentColor" />
      </svg>

      {/* Bottom-left concentric */}
      <svg
        aria-hidden
        className="absolute bottom-20 left-6 h-36 w-36 text-white/15 animate-float-slower"
        viewBox="0 0 140 140"
      >
        <circle cx="70" cy="70" r="60" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="70" cy="70" r="38" fill="none" stroke="currentColor" strokeWidth="1.5" />
      </svg>

      {/* Top-left small ring */}
      <svg
        aria-hidden
        className="absolute top-[15%] left-[12%] h-14 w-14 text-white/20"
        viewBox="0 0 56 56"
      >
        <circle cx="28" cy="28" r="22" fill="none" stroke="currentColor" strokeWidth="1.5" />
      </svg>

      {/* Bottom-right partial ring */}
      <svg
        aria-hidden
        className="absolute -bottom-8 -right-8 h-40 w-40 text-white/15"
        viewBox="0 0 160 160"
      >
        <circle cx="80" cy="80" r="70" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="80" cy="80" r="45" fill="none" stroke="currentColor" strokeWidth="1.5" />
      </svg>

      {/* Small filled dot top-center */}
      <svg
        aria-hidden
        className="absolute top-[10%] left-[45%] h-6 w-6 text-white/30"
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="12" r="5" fill="currentColor" />
      </svg>
    </>
  );
}
