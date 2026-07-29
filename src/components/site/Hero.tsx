import { useNavigate, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useState } from "react";
import { ArrowRight, ArrowUpRight, ShieldCheck, Star } from "lucide-react";
import { servicesQ, reviewSummaryQ } from "@/lib/api/queries";
import { Counter } from "@/components/site/ui/Counter";
const heroCare = { url: "/assets/hero-care.jpg" };

export function Hero() {
  const navigate = useNavigate();
  const { data: servicesData } = useQuery(servicesQ({ limit: 30 }));
  const { data: reviews } = useQuery(reviewSummaryQ());
  const services = servicesData?.items ?? [];

  const rating = reviews?.average_rating ?? 0;
  const totalReviews = reviews?.total_reviews ?? 0;

  const [selectedService, setSelectedService] = useState("");

  return (
    <section className="relative isolate overflow-hidden min-h-[100svh] lg:h-[100svh] w-full">
      {/* Mint gradient background */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(120deg, #DDEEEE 0%, #EAF6F6 45%, #F8FCFC 100%)",
        }}
      />
      <div
        aria-hidden
        className="absolute -top-40 -left-40 h-[560px] w-[560px] rounded-full opacity-60 blur-3xl"
        style={{ background: "radial-gradient(circle, color-mix(in oklab, var(--primary) 30%, transparent), transparent 70%)" }}
      />
      <div
        aria-hidden
        className="absolute bottom-0 left-1/3 h-[420px] w-[420px] rounded-full opacity-50 blur-3xl"
        style={{ background: "radial-gradient(circle, color-mix(in oklab, var(--accent) 25%, transparent), transparent 70%)" }}
      />

      <div className="relative container-x pt-24 pb-8 lg:pt-28 lg:pb-10 h-full flex items-center">
        <div className="grid w-full items-center gap-8 lg:grid-cols-12 lg:h-full">
          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-6 space-y-5 lg:space-y-6"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-white/70 backdrop-blur px-4 py-1.5 text-xs uppercase tracking-[0.18em] text-accent ring-1 ring-white/80">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              24/7 care desk — accepting new bookings
            </div>

            <h1 className="font-display text-[clamp(2.4rem,5.6vw,4.75rem)] font-bold leading-[1.02] tracking-[-0.02em] text-foreground">
              Hospital-grade
              <br />
              care, <span className="italic text-accent">at home.</span>
            </h1>

            <p className="max-w-lg text-base md:text-lg text-muted-foreground leading-relaxed">
              Verified nurses, physiotherapists and premium medical equipment —
              orchestrated by a dedicated care advisor and delivered to your door
              within hours.
            </p>

            <div>
              <button
                onClick={() => navigate({ to: "/booking" })}
                className="group inline-flex items-center gap-2 rounded-full bg-foreground px-7 py-4 text-sm font-semibold text-background shadow-[var(--shadow-float)] hover:bg-accent transition-colors"
              >
                Book a caregiver
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-2 max-w-lg">
              <Stat
                value={<><Counter value={10} />k+</>}
                label="Families served"
              />
              <Stat
                value={
                  <>
                    <Counter value={rating} duration={1.4} />
                    <Star className="inline h-5 w-5 -mt-1 ml-0.5 fill-primary text-primary" />
                  </>
                }
                label={`${totalReviews} reviews`}
              />
              <Stat value={<><Counter value={2} />h</>} label="Response time" />
            </div>
          </motion.div>

          {/* RIGHT — image card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-6 lg:h-full"
          >
            <div className="relative h-full w-full lg:min-h-0 aspect-[4/5] lg:aspect-auto overflow-hidden rounded-[2rem] ring-1 ring-white/60 shadow-[0_40px_90px_-30px_rgba(15,80,80,0.45)]">
              <img
                src={heroCare.url}
                alt="Compassionate home healthcare — nurse with elderly patient"
                className="absolute inset-0 h-full w-full object-cover"
              />

              {/* Verified badge */}
              <div className="absolute top-5 left-5 md:top-6 md:left-6 flex items-center gap-3 rounded-2xl bg-white/80 backdrop-blur-xl px-4 py-2.5 ring-1 ring-white/70 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.25)]">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary-soft text-accent">
                  <ShieldCheck className="h-4 w-4" />
                </span>
                <div className="leading-tight">
                  <div className="text-[9px] uppercase tracking-[0.18em] text-muted-foreground">Verified</div>
                  <div className="text-sm font-semibold text-foreground">Background-checked</div>
                </div>
              </div>

              {/* Rating badge */}
              <div className="absolute top-5 right-5 md:top-6 md:right-6 rounded-2xl bg-white/80 backdrop-blur-xl px-4 py-2.5 ring-1 ring-white/70 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.25)]">
                <div className="flex items-center gap-0.5 text-primary">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5" fill={i < Math.round(rating) ? "currentColor" : "none"} />
                  ))}
                </div>
                <div className="mt-0.5 text-sm font-semibold text-foreground leading-none">
                  {rating.toFixed(1)} rating
                </div>
                <div className="mt-1 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                  {totalReviews} Google reviews
                </div>
              </div>

              {/* Quick Book */}
              <div className="absolute inset-x-4 bottom-4 md:inset-x-5 md:bottom-5">
                <div className="relative overflow-hidden rounded-2xl bg-white/25 backdrop-blur-2xl backdrop-saturate-150 ring-1 ring-white/60 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.35)]">
                  <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/60 to-transparent" />
                  <div className="relative flex items-center justify-between px-4 pt-3 pb-1">
                    <div className="text-[10px] uppercase tracking-[0.2em] text-white font-semibold drop-shadow">
                      <span className="text-accent">✦</span> Quick book
                    </div>
                    <Link
                      to="/services"
                      className="text-[11px] font-semibold text-white/95 hover:text-white inline-flex items-center gap-0.5 drop-shadow"
                    >
                      All services <ArrowUpRight className="h-3 w-3" />
                    </Link>
                  </div>
                  <div className="relative flex items-center gap-2 p-2">
                    <label className="flex-1 rounded-xl bg-white/85 backdrop-blur px-4 py-2.5">
                      <select
                        value={selectedService}
                        onChange={(e) => setSelectedService(e.target.value)}
                        className="w-full bg-transparent text-sm font-medium text-foreground outline-none truncate"
                      >
                        <option value="">Home Nursing Care</option>
                        {services.map((s) => (
                          <option key={s.id} value={s.title}>
                            {s.title}
                          </option>
                        ))}
                      </select>
                    </label>
                    <button
                      onClick={() =>
                        navigate({
                          to: "/booking",
                          search: selectedService ? { service: selectedService } : {},
                        })
                      }
                      aria-label="Book now"
                      className="grid h-11 w-11 place-items-center rounded-xl bg-foreground text-background hover:bg-accent transition-colors"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
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
      <div className="font-display text-2xl md:text-3xl font-bold text-foreground leading-none">
        {value}
      </div>
      <div className="mt-2 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </div>
    </div>
  );
}
