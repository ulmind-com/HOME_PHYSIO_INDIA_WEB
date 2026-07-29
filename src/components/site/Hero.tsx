import { Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, ShieldCheck, Sparkles, Star, PhoneCall } from "lucide-react";
import { servicesQ, reviewSummaryQ, settingsQ } from "@/lib/api/queries";
import { MagneticButton } from "@/components/site/ui/Magnetic";
import { Counter } from "@/components/site/ui/Counter";

const heroDoctor = "/assets/hero-doctor.jpg";

export function Hero() {
  const reduce = useReducedMotion();
  const { data: servicesData } = useQuery(servicesQ({ limit: 6, featured: true }));
  const { data: reviews } = useQuery(reviewSummaryQ());
  const { data: settings } = useQuery(settingsQ());
  const services = servicesData?.items ?? [];

  const rating = reviews?.average_rating ?? 4.9;
  const totalReviews = reviews?.total_reviews ?? 1240;
  const phone = settings?.phone?.replace(/[^\d+]/g, "");

  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -80]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -40]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 1.06]);

  const navigate = useNavigate();

  return (
    <section
      ref={ref}
      className="relative isolate overflow-hidden min-h-[100svh] mesh-bg noise"
    >
      {/* Animated gradient orbs */}
      <motion.div
        aria-hidden
        className="absolute -top-40 -right-40 h-[36rem] w-[36rem] rounded-full opacity-70 blur-3xl animate-mesh-drift"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--primary) 55%, transparent), transparent 65%)",
        }}
      />
      <motion.div
        aria-hidden
        className="absolute -bottom-52 -left-40 h-[40rem] w-[40rem] rounded-full opacity-60 blur-3xl animate-mesh-drift"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--accent) 45%, transparent), transparent 60%)",
          animationDelay: "-8s",
        }}
      />

      <div className="relative container-x pt-32 pb-16 lg:pt-40 lg:pb-24 min-h-[100svh] flex items-center">
        <div className="grid w-full items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* LEFT — editorial copy */}
          <motion.div style={{ y: y1 }} className="lg:col-span-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 rounded-full glass-strong px-4 py-1.5 text-xs font-medium text-accent"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inset-0 rounded-full bg-primary animate-pulse-ring" />
                <span className="relative h-2 w-2 rounded-full bg-primary" />
              </span>
              24/7 care desk — accepting new bookings
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
              className="mt-6 font-display text-[clamp(2.6rem,6vw,5.25rem)] leading-[0.95] tracking-[-0.04em] text-foreground"
            >
              Hospital-grade care,{" "}
              <span className="italic font-normal text-gradient">at home.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="mt-6 max-w-lg text-lg text-muted-foreground leading-relaxed"
            >
              Verified nurses, physiotherapists and premium medical equipment —
              orchestrated by a dedicated care advisor and delivered to your door
              within hours.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="mt-9 flex flex-wrap items-center gap-3"
            >
              <MagneticButton
                onClick={() => navigate({ to: "/booking" })}
                className="group rounded-full bg-foreground px-7 py-4 text-sm font-semibold text-background shadow-[var(--shadow-float)] hover:bg-accent transition-colors"
              >
                Book a caregiver
                <ArrowRight className="ml-2 inline h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </MagneticButton>
              {phone && (
                <a
                  href={`tel:${phone}`}
                  className="inline-flex items-center gap-2 rounded-full border border-foreground/15 bg-white/60 backdrop-blur px-6 py-4 text-sm font-medium hover:border-primary hover:text-accent transition-colors"
                >
                  <PhoneCall className="h-4 w-4 text-primary" />
                  {settings?.phone ?? "Call now"}
                </a>
              )}
            </motion.div>

            {/* Editorial stats */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="mt-14 grid max-w-lg grid-cols-3 gap-6 border-t border-border/70 pt-8"
            >
              <Stat value={<Counter value={10} suffix="k+" />} label="Families served" />
              <Stat value={<Counter value={rating} suffix="★" />} label={`${totalReviews.toLocaleString()} reviews`} />
              <Stat value={<Counter value={2} suffix="h" />} label="Response time" />
            </motion.div>
          </motion.div>

          {/* RIGHT — layered glass composition */}
          <motion.div style={{ y: y2, scale }} className="lg:col-span-6 relative">
            <div className="relative mx-auto aspect-[4/5] w-full max-w-xl">
              {/* Backdrop image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 overflow-hidden rounded-[2.5rem] shadow-[var(--shadow-float)]"
              >
                <img
                  src={heroDoctor}
                  alt="Verified Nupun caregiver attending to a patient at home"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-dark/50 via-transparent to-transparent" />
              </motion.div>

              {/* Floating glass card — verification */}
              <motion.div
                initial={{ opacity: 0, y: 30, rotate: -3 }}
                animate={{ opacity: 1, y: 0, rotate: -3 }}
                transition={{ delay: 0.5, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="absolute -left-4 top-16 w-56 glass-strong rounded-2xl p-4 shadow-[var(--shadow-float)]"
              >
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/15 text-accent">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
                      Verified
                    </div>
                    <div className="text-sm font-semibold">Background-checked</div>
                  </div>
                </div>
              </motion.div>

              {/* Floating glass card — rating */}
              <motion.div
                initial={{ opacity: 0, y: 30, rotate: 4 }}
                animate={{ opacity: 1, y: 0, rotate: 4 }}
                transition={{ delay: 0.7, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="absolute -right-2 top-40 w-52 glass-strong rounded-2xl p-4 shadow-[var(--shadow-float)]"
              >
                <div className="flex items-center gap-1 text-primary">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5" fill="currentColor" />
                  ))}
                </div>
                <div className="mt-1.5 text-lg font-semibold">{rating.toFixed(1)} rating</div>
                <div className="text-[11px] text-muted-foreground">
                  {totalReviews.toLocaleString()} Google reviews
                </div>
              </motion.div>

              {/* Floating glass card — quick-book services */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="absolute -bottom-6 left-1/2 w-[90%] -translate-x-1/2 glass-strong rounded-3xl p-5 shadow-[var(--shadow-float)]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.15em] text-accent">
                    <Sparkles className="h-3.5 w-3.5" /> Quick book
                  </div>
                  <Link to="/booking" className="text-[11px] font-semibold text-accent hover:underline">
                    All services →
                  </Link>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {services.slice(0, 4).map((s) => (
                    <Link
                      key={s.id}
                      to="/booking"
                      search={{ service: s.slug }}
                      className="group flex items-center justify-between rounded-xl bg-white/50 border border-white/60 px-3 py-2.5 text-xs font-medium text-foreground hover:border-primary hover:bg-white/80 transition-all"
                    >
                      <span className="truncate">{s.title}</span>
                      <ArrowRight className="h-3 w-3 shrink-0 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                    </Link>
                  ))}
                  {services.length === 0 &&
                    ["Home Nursing", "Physiotherapy", "Elder care", "Equipment"].map((s) => (
                      <div
                        key={s}
                        className="rounded-xl bg-white/50 border border-white/60 px-3 py-2.5 text-xs font-medium text-muted-foreground"
                      >
                        {s}
                      </div>
                    ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: React.ReactNode; label: string }) {
  return (
    <div>
      <div className="font-display text-4xl tracking-[-0.03em] text-foreground">{value}</div>
      <div className="mt-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{label}</div>
    </div>
  );
}
