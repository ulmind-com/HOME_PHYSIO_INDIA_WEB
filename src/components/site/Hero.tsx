import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Menu, Phone } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Counter } from "@/components/site/ui/Counter";
import { HeroShape } from "@/components/site/HeroShape";
import heroTeam from "@/assets/hero-nurse-patient.png.asset.json";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export function Hero() {
  return (
    <section className="relative isolate min-h-[100svh] overflow-hidden bg-primary p-3 sm:p-5 lg:p-6">
      <div className="relative mx-auto min-h-[calc(100svh-1.5rem)] max-w-[1180px] overflow-hidden rounded-[2rem] bg-surface shadow-float sm:min-h-[calc(100svh-2.5rem)] lg:min-h-0 lg:aspect-[1.56/1] lg:max-h-[calc(100svh-3rem)]">
        <HeroCardNav />

        <div className="pointer-events-none absolute inset-0 text-primary" aria-hidden>
          <Ring className="absolute bottom-[4.5%] left-[3.5%] h-12 w-12 opacity-20" />
          <Ring className="absolute right-[3.5%] top-[8%] h-[74px] w-[74px] opacity-20" />
          <Ring className="absolute bottom-[15%] right-[4.5%] h-11 w-11 opacity-20" />
        </div>

        <div className="relative z-10 grid min-h-[calc(100svh-1.5rem)] grid-cols-1 lg:min-h-0 lg:aspect-[1.56/1] lg:grid-cols-[45%_55%]">
          <div className="flex flex-col justify-center px-8 pb-10 pt-28 sm:px-12 lg:px-[72px] lg:pb-12 lg:pt-24 xl:px-[76px]">
            <motion.h1
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={0}
              className="max-w-[500px] font-display text-[clamp(2.45rem,4.6vw,3.65rem)] font-semibold leading-[1.12] text-foreground"
            >
              Putting your
              <br />
              health first with
              <br />
              empathy and skill
            </motion.h1>

            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={1}
              className="mt-7 max-w-[430px] text-[15px] leading-relaxed text-muted-foreground"
            >
              We are a leading home healthcare facility across Delhi NCR,
              dedicated to providing exceptional service for all patients
            </motion.p>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={2}
              className="mt-9 flex flex-wrap items-center gap-4"
            >
              <Button asChild className="group h-12 rounded-full px-7 text-sm font-semibold shadow-soft transition-transform duration-300 hover:-translate-y-0.5">
                <Link to="/booking">
                  Get Started
                  <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Button>

              <Link
                to="/contact"
                className="group inline-flex h-12 items-center gap-3 rounded-full border border-border bg-surface px-5 text-sm font-semibold text-accent shadow-soft transition-colors hover:text-foreground"
              >
                <span className="grid h-8 w-8 place-items-center rounded-full bg-primary-soft text-accent">
                  <Phone className="h-4 w-4" />
                </span>
                Call us now!
              </Link>
            </motion.div>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={3}
              className="mt-12 grid max-w-[520px] grid-cols-1 gap-5 sm:grid-cols-3 lg:gap-7"
            >
              <StatItem icon={<ClinicIcon />} value={<><Counter value={50} />+</>} label="Clinics" />
              <StatItem icon={<DoctorIcon />} value={<><Counter value={2} />K+</>} label="Doctors" />
              <StatItem icon={<PatientIcon />} value={<><Counter value={50} />K+</>} label="Patients" />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="relative min-h-[500px] px-5 pb-8 pt-0 sm:px-10 lg:min-h-0 lg:px-0 lg:pb-0 lg:pt-[72px]"
          >
            <HeroShape
              imageUrl={heroTeam.url}
              alt="Nupun Home Health Care — Compassionate nurse with elderly patient"
              className="ml-auto h-full min-h-[500px] w-full max-w-[620px] lg:min-h-0 lg:max-w-none"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function HeroCardNav() {
  const navItems = [
    { to: "/services", label: "Service" },
    { to: "/equipment", label: "Equipment" },
    { to: "/careers", label: "Careers" },
    { to: "/blog", label: "Blog" },
    { to: "/about", label: "About" },
  ] as const;

  return (
    <div className="absolute inset-x-0 top-0 z-30 flex h-[72px] items-center justify-between px-7 sm:px-12 lg:px-[58px]">
      <Link to="/" className="flex items-center gap-2.5 text-foreground">
        <span className="grid h-6 w-6 place-items-center rounded-full bg-primary text-primary-foreground">
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden>
            <path d="M12 5v14M5 12h14" strokeLinecap="round" />
          </svg>
        </span>
        <span className="font-display text-lg font-semibold">Nupun</span>
      </Link>

      <nav className="hidden items-center gap-10 lg:flex">
        {navItems.map((item) => (
          <Link key={item.to} to={item.to} className="text-sm font-medium text-foreground/70 transition-colors hover:text-accent">
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-2">
        <Button asChild className="hidden h-10 rounded-full px-6 text-sm font-semibold sm:inline-flex">
          <Link to="/contact">Contact</Link>
        </Button>
        <Button variant="secondary" size="icon" className="rounded-full lg:hidden" aria-label="Open menu">
          <Menu className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}

function Ring({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" aria-hidden>
      <circle cx="32" cy="32" r="24" stroke="currentColor" strokeWidth="8" />
    </svg>
  );
}

/* ── Stat Item ── */
function StatItem({
  icon,
  value,
  label,
}: {
  icon: ReactNode;
  value: ReactNode;
  label: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
        {icon}
      </span>
      <div>
        <div className="font-display text-[26px] font-bold leading-none text-foreground">
          {value}
        </div>
        <div className="mt-0.5 text-xs text-muted-foreground">{label}</div>
      </div>
    </div>
  );
}

/* ── Custom SVG icons matching the MediWise stat icons ── */
function ClinicIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 21h18M5 21V7l7-4 7 4v14" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 21v-4h6v4M12 11v-2M11 10h2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DoctorIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="8" r="4" />
      <path d="M6 21v-2a6 6 0 0 1 12 0v2" strokeLinecap="round" />
      <path d="M12 14v3M10 16h4" strokeLinecap="round" />
    </svg>
  );
}

function PatientIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="9" cy="7" r="3.5" />
      <path d="M3 21v-2a6 6 0 0 1 12 0v2" strokeLinecap="round" />
      <circle cx="18" cy="9" r="2.5" />
      <path d="M21 21v-1.5a4.5 4.5 0 0 0-4-4.47" strokeLinecap="round" />
    </svg>
  );
}
