import { useNavigate, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowRight, Phone, ShieldCheck, Star, HeartPulse, Users, Clock3 } from "lucide-react";
import { reviewSummaryQ } from "@/lib/api/queries";
import { Counter } from "@/components/site/ui/Counter";

const heroCare = { url: "/assets/hero-care.jpg" };

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

  const rating = reviews?.average_rating ?? 4.9;
  const totalReviews = reviews?.total_reviews ?? 320;

  return (
    <section className="relative isolate overflow-hidden min-h-[100svh] w-full pt-24 lg:pt-28 pb-10 lg:pb-14">
      {/* Soft mint page background */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(120% 80% at 100% 0%, #C7E8E6 0%, transparent 55%), radial-gradient(120% 80% at 0% 100%, #DCEFED 0%, transparent 55%), linear-gradient(160deg, #E9F5F3 0%, #F4FAF9 100%)",
        }}
      />
      {/* Decorative floating circles */}
      <FloatingDecor />

      <div className="relative container-x">
        {/* WHITE CONTENT CARD */}
        <div className="relative rounded-[32px] bg-white/85 backdrop-blur-xl ring-1 ring-white/70 shadow-[0_50px_120px_-40px_rgba(20,80,80,0.28)] overflow-hidden">
          {/* subtle inner rings */}
          <svg
            aria-hidden
            className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 opacity-[0.14] text-primary"
          >
            <circle cx="144" cy="144" r="120" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="144" cy="144" r="80" fill="none" stroke="currentColor" strokeWidth="1.5" />
          </svg>

          <div className="grid gap-10 lg:gap-6 lg:grid-cols-12 items-center p-6 sm:p-10 lg:p-14">
            {/* LEFT — 45% */}
            <div className="lg:col-span-5 relative z-10">
              <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}>
                <span className="inline-flex items-center gap-2 rounded-full bg-primary-soft/70 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-accent ring-1 ring-primary/20">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                  Premium home healthcare
                </span>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                initial="hidden"
                animate="show"
                custom={1}
                className="mt-6 font-display text-[clamp(2.6rem,5.4vw,4.5rem)] font-semibold leading-[1.02] tracking-[-0.03em] text-foreground"
              >
                Putting your{" "}
                <span className="relative inline-block">
                  <span className="relative z-10">health</span>
                  <span
                    aria-hidden
                    className="absolute inset-x-0 bottom-1 h-3 -z-0 rounded-full"
                    style={{ background: "color-mix(in oklab, var(--primary) 55%, transparent)" }}
                  />
                </span>{" "}
                first with{" "}
                <span className="italic text-accent">empathy</span>
                <br className="hidden sm:block" /> and expert care.
              </motion.h1>

              <motion.p
                variants={fadeUp}
                initial="hidden"
                animate="show"
                custom={2}
                className="mt-6 max-w-xl text-base md:text-lg leading-relaxed text-muted-foreground"
              >
                Verified nurses, physiotherapists and hospital-grade equipment —
                delivered to your door within hours, orchestrated by a dedicated
                care advisor.
              </motion.p>

              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="show"
                custom={3}
                className="mt-8 flex flex-wrap items-center gap-3"
              >
                <button
                  onClick={() => navigate({ to: "/booking" })}
                  className="group relative inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-accent to-primary px-7 py-4 text-sm font-semibold text-white shadow-[0_18px_40px_-15px_color-mix(in_oklab,var(--accent)_70%,transparent)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_60px_-18px_color-mix(in_oklab,var(--accent)_80%,transparent)]"
                >
                  Get started
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </button>

                <Link
                  to="/contact"
                  className="group inline-flex items-center gap-2 rounded-full bg-white/70 backdrop-blur px-5 py-3.5 text-sm font-semibold text-foreground ring-1 ring-border/70 hover:bg-white transition-all"
                >
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-primary-soft text-accent">
                    <Phone className="h-3.5 w-3.5" />
                  </span>
                  Call us now
                </Link>
              </motion.div>

              {/* Stats row */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="show"
                custom={4}
                className="mt-10 grid grid-cols-3 gap-3 sm:gap-4 max-w-xl"
              >
                <StatCard icon={Users} value={<><Counter value={10} />k+</>} label="Families" />
                <StatCard
                  icon={HeartPulse}
                  value={
                    <span className="inline-flex items-center">
                      <Counter value={rating} duration={1.4} />
                      <Star className="ml-1 h-4 w-4 fill-primary text-primary" />
                    </span>
                  }
                  label={`${totalReviews}+ reviews`}
                />
                <StatCard icon={Clock3} value={<><Counter value={2} />h</>} label="Response" />
              </motion.div>
            </div>

            {/* RIGHT — 55% */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-7 relative"
            >
              <div className="relative aspect-[5/4.6] sm:aspect-[5/4] lg:aspect-[6/5]">
                {/* Angled mint panel behind image */}
                <div
                  aria-hidden
                  className="absolute inset-0 rounded-[28px] overflow-hidden"
                  style={{
                    background:
                      "linear-gradient(135deg, color-mix(in oklab, var(--primary) 55%, white) 0%, color-mix(in oklab, var(--accent) 35%, white) 100%)",
                    clipPath:
                      "polygon(8% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 12%)",
                  }}
                />

                {/* Outline ring decorations */}
                <svg
                  aria-hidden
                  className="absolute -top-6 -right-6 h-40 w-40 text-white/60 animate-float-slow"
                  viewBox="0 0 160 160"
                >
                  <circle cx="80" cy="80" r="70" fill="none" stroke="currentColor" strokeWidth="1.5" />
                  <circle cx="80" cy="80" r="46" fill="none" stroke="currentColor" strokeWidth="1.5" />
                </svg>
                <svg
                  aria-hidden
                  className="absolute -bottom-8 -left-6 h-32 w-32 text-accent/25 animate-float-slower"
                  viewBox="0 0 128 128"
                >
                  <circle cx="64" cy="64" r="60" fill="none" stroke="currentColor" strokeWidth="1.5" />
                </svg>

                {/* Image container — angled cutout */}
                <div
                  className="absolute inset-3 sm:inset-5 rounded-[24px] overflow-hidden shadow-[0_40px_80px_-30px_rgba(15,80,80,0.45)] ring-1 ring-white/60"
                  style={{
                    clipPath:
                      "polygon(12% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 16%)",
                  }}
                >
                  <img
                    src={heroCare.url}
                    alt="Compassionate home healthcare — nurse with elderly patient"
                    className="h-full w-full object-cover"
                    loading="eager"
                    fetchPriority="high"
                  />
                  {/* subtle top gradient for legibility of floating badge */}
                  <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/10 to-transparent pointer-events-none" />
                </div>

                {/* Floating glass badge — Verified */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  className="absolute left-6 sm:left-8 top-8 sm:top-10 flex items-center gap-3 rounded-2xl bg-white/85 backdrop-blur-xl px-4 py-2.5 ring-1 ring-white/80 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.25)]"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary-soft text-accent">
                    <ShieldCheck className="h-4 w-4" />
                  </span>
                  <div className="leading-tight">
                    <div className="text-[9px] uppercase tracking-[0.18em] text-muted-foreground">Verified</div>
                    <div className="text-sm font-semibold text-foreground">Licensed team</div>
                  </div>
                </motion.div>

                {/* Floating glass badge — Rating */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.75, duration: 0.6 }}
                  className="absolute right-4 sm:right-6 bottom-8 sm:bottom-10 rounded-2xl bg-white/90 backdrop-blur-xl px-4 py-3 ring-1 ring-white/80 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.25)]"
                >
                  <div className="flex items-center gap-0.5 text-primary">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-3.5 w-3.5"
                        fill={i < Math.round(rating) ? "currentColor" : "none"}
                      />
                    ))}
                  </div>
                  <div className="mt-1 text-sm font-semibold text-foreground leading-none">
                    {rating.toFixed(1)} · Google
                  </div>
                  <div className="mt-1 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                    {totalReviews}+ reviews
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatCard({
  icon: Icon,
  value,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>;
  value: React.ReactNode;
  label: string;
}) {
  return (
    <div className="rounded-2xl bg-white/70 backdrop-blur-md ring-1 ring-white/80 px-3 py-3 sm:px-4 sm:py-3.5 shadow-[0_10px_30px_-15px_rgba(15,80,80,0.25)]">
      <div className="flex items-center gap-2">
        <span className="grid h-8 w-8 place-items-center rounded-xl bg-primary-soft text-accent">
          <Icon className="h-4 w-4" />
        </span>
        <div className="font-display text-xl sm:text-2xl font-semibold text-foreground leading-none">
          {value}
        </div>
      </div>
      <div className="mt-2 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </div>
    </div>
  );
}

function FloatingDecor() {
  return (
    <>
      <div
        aria-hidden
        className="absolute -top-32 -left-24 h-[520px] w-[520px] rounded-full opacity-60 blur-3xl -z-10"
        style={{ background: "radial-gradient(circle, color-mix(in oklab, var(--primary) 40%, transparent), transparent 70%)" }}
      />
      <div
        aria-hidden
        className="absolute bottom-0 right-0 h-[460px] w-[460px] rounded-full opacity-50 blur-3xl -z-10"
        style={{ background: "radial-gradient(circle, color-mix(in oklab, var(--accent) 35%, transparent), transparent 70%)" }}
      />
      {/* outline rings */}
      <svg
        aria-hidden
        className="absolute top-16 right-10 h-28 w-28 text-primary/25 animate-float-slow -z-10"
        viewBox="0 0 112 112"
      >
        <circle cx="56" cy="56" r="52" fill="none" stroke="currentColor" strokeWidth="1.2" />
      </svg>
      <svg
        aria-hidden
        className="absolute bottom-20 left-10 h-20 w-20 text-accent/30 animate-float-slower -z-10"
        viewBox="0 0 80 80"
      >
        <circle cx="40" cy="40" r="36" fill="none" stroke="currentColor" strokeWidth="1.2" />
        <circle cx="40" cy="40" r="20" fill="none" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    </>
  );
}
