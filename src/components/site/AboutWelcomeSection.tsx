import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowRight, Award, Users, Clock, ShieldCheck, Headphones } from "lucide-react";
import { servicesQ, settingsQ } from "@/lib/api/queries";
import { CategoryShowcasePremium } from "./CategoryShowcasePremium";

const INTRO_IMAGE = "/assets/hero-nurse-patient.png";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export function AboutWelcomeSection() {
  const { data: settings } = useQuery(settingsQ());
  const { data: servicesData } = useQuery(servicesQ({ limit: 8 }));

  return (
    <section className="relative isolate overflow-hidden bg-background">
      {/* Decorative SVG blobs */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <svg
          className="absolute -top-[10%] -right-[10%] w-[60vw] h-[60vw] max-w-[900px] max-h-[900px] text-primary opacity-[0.12]"
          viewBox="0 0 200 200"
        >
          <path
            fill="currentColor"
            d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.5,90.1,-16.3,88.1,-1.2C86.1,13.8,79.4,27.7,70.6,39.6C61.8,51.5,50.9,61.5,38.3,68.6C25.7,75.7,11.5,79.9,-2.3,84.2C-16.1,88.5,-29.5,92.9,-41.7,87.8C-53.9,82.7,-64.9,68.1,-73.2,52.6C-81.5,37.1,-87.1,20.7,-86.4,4.4C-85.7,-11.9,-78.7,-28.1,-68.2,-41.3C-57.7,-54.5,-43.7,-64.7,-29.4,-71.8C-15.1,-78.9,-0.4,-82.9,13.6,-81.1C27.6,-79.3,41.2,-71.7,44.7,-76.4Z"
            transform="translate(100 100)"
          />
        </svg>
        <svg
          className="absolute bottom-[5%] left-[2%] w-[30vw] h-[30vw] max-w-[500px] max-h-[500px] text-accent opacity-[0.08]"
          viewBox="0 0 200 200"
        >
          <path
            fill="currentColor"
            d="M39.9,-65.7C52.8,-58.5,65,-49.1,73.4,-36.6C81.8,-24.1,86.4,-8.5,84.6,6.1C82.8,20.7,74.6,34.3,64.4,45.4C54.2,56.5,42,65.1,28.8,70.3C15.6,75.5,1.4,77.3,-12.3,75.6C-26,73.9,-39.2,68.7,-50.6,60.1C-62,51.5,-71.6,39.5,-77.2,25.6C-82.8,11.7,-84.4,-4.1,-80.3,-18.3C-76.2,-32.5,-66.4,-45.1,-54.4,-52.7C-42.4,-60.3,-28.2,-62.9,-14.6,-63.9C-1,-64.9,12,-64.3,25.2,-65.7C38.4,-67.1,51.8,-70.5,39.9,-65.7Z"
            transform="translate(100 100)"
          />
        </svg>
        {/* Decorative rings */}
        <svg className="absolute top-[20%] left-[8%] h-16 w-16 text-primary opacity-20" viewBox="0 0 70 70">
          <circle cx="35" cy="35" r="30" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
        <svg className="absolute bottom-[30%] right-[12%] h-12 w-12 text-accent opacity-15" viewBox="0 0 50 50">
          <circle cx="25" cy="25" r="20" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      </div>

      <div className="relative z-10 container-x pb-12 pt-24 lg:pb-20 lg:pt-32">
        {/* Intro zone */}
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Text */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="order-2"
          >
            <motion.div
              variants={fadeUp}
              custom={0}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-accent backdrop-blur"
            >
              <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
              About Nupun
            </motion.div>

            <motion.h2
              variants={fadeUp}
              custom={1}
              className="font-display text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.08] tracking-tight text-foreground"
            >
              Professional Home Care Services for Your Loved Ones with{" "}
              <span className="text-gradient">{settings?.website_name || "Nupun"}</span>
            </motion.h2>

            <motion.p
              variants={fadeUp}
              custom={2}
              className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg"
            >
              {settings?.tagline ||
                "Nupun is a trusted provider of patient and elder care services with trained caregivers, attendants and qualified nurses at your home in Delhi NCR and across the country."}
            </motion.p>

            <motion.p
              variants={fadeUp}
              custom={3}
              className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base"
            >
              Our services include{" "}
              <span className="font-semibold text-foreground">
                home nursing care, elder care services, physiotherapy, ICU setup at home and medical equipment rental
              </span>
              . Whether you need short-term recovery support or long-term care, our team ensures dependable,
              personalized care in the comfort of your home.
            </motion.p>

            <motion.div variants={fadeUp} custom={4} className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                to="/services"
                className="group inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background transition-all hover:bg-primary hover:text-primary-foreground"
              >
                Explore services
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                to="/booking"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary/40 hover:bg-surface"
              >
                Book trusted care
              </Link>
            </motion.div>

            {/* Mini trust row */}
            <motion.div variants={fadeUp} custom={5} className="mt-10 grid max-w-md grid-cols-3 gap-4">
              <MiniStat icon={Users} value="50K+" label="Patients" />
              <MiniStat icon={Award} value="4.9" label="Rating" />
              <MiniStat icon={Clock} value="24/7" label="Support" />
            </motion.div>
          </motion.div>

          {/* Image card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, x: -40 }}
            whileInView={{ opacity: 1, scale: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative order-1"
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-[2.5rem] shadow-float lg:aspect-[4/3.2]">
              <img
                src={INTRO_IMAGE}
                alt="Nupun care team"
                className="h-full w-full object-cover"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
            </div>

            {/* Floating glass badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="glass absolute -bottom-6 -right-6 max-w-[200px] rounded-2xl p-4 shadow-soft lg:-right-10"
            >
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-display text-lg font-semibold leading-none">100%</div>
                  <div className="mt-0.5 text-xs text-muted-foreground">Verified staff</div>
                </div>
              </div>
            </motion.div>

            {/* Floating support badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.55, duration: 0.6 }}
              className="glass absolute -left-2 -top-4 rounded-2xl p-3 shadow-soft lg:-left-6"
            >
              <div className="flex items-center gap-2.5">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent text-accent-foreground">
                  <Headphones className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-display text-sm font-semibold leading-none">24/7</div>
                  <div className="mt-0.5 text-[10px] text-muted-foreground">Care support</div>
                </div>
              </div>
            </motion.div>

            {/* Floating ring decoration */}
            <div className="absolute -left-4 -top-4 h-20 w-20 animate-pulse-ring rounded-full border-2 border-primary/20" />
          </motion.div>
        </div>
      </div>

      {/* Categories zone */}
      <CategoryShowcasePremium services={servicesData?.items ?? []} />
    </section>
  );
}

function MiniStat({ icon: Icon, value, label }: { icon: React.ElementType; value: string; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className="font-display text-lg font-bold leading-none">{value}</div>
        <div className="mt-0.5 text-xs text-muted-foreground">{label}</div>
      </div>
    </div>
  );
}
