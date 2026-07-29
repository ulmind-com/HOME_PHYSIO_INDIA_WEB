import { useNavigate, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowRight, Phone, Building2, Stethoscope, Users } from "lucide-react";
import { reviewSummaryQ } from "@/lib/api/queries";
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
  const navigate = useNavigate();
  const { data: reviews } = useQuery(reviewSummaryQ());

  return (
    <section className="relative isolate overflow-hidden w-full bg-white min-h-[100svh]">

      {/* ── Decorative outline rings scattered around the section ── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <svg className="absolute top-[8%] left-[6%] w-[70px] h-[70px] opacity-30" viewBox="0 0 70 70">
          <circle cx="35" cy="35" r="30" fill="none" stroke="#43D4B0" strokeWidth="2" />
        </svg>
        <svg className="absolute top-[20%] left-[14%] w-[38px] h-[38px] opacity-25" viewBox="0 0 38 38">
          <circle cx="19" cy="19" r="16" fill="none" stroke="#43D4B0" strokeWidth="2" />
        </svg>
        <svg className="absolute bottom-[10%] left-[3%] w-[54px] h-[54px] opacity-25" viewBox="0 0 54 54">
          <circle cx="27" cy="27" r="23" fill="none" stroke="#43D4B0" strokeWidth="2" />
        </svg>
        <svg className="absolute bottom-[6%] right-[4%] w-[60px] h-[60px] opacity-25" viewBox="0 0 60 60">
          <circle cx="30" cy="30" r="26" fill="none" stroke="#43D4B0" strokeWidth="2" />
        </svg>
      </div>

      {/* ── MAIN CONTENT GRID ── */}
      <div className="relative z-10 container-x min-h-[100svh] flex flex-col lg:flex-row items-center">

        {/* ─── LEFT: Text Content ─── */}
        <div className="relative z-20 flex flex-col justify-center pt-28 pb-10 lg:pt-0 lg:pb-0 lg:w-[46%] lg:pr-8">


          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0}
            className="font-display text-[clamp(2.4rem,4.8vw,4rem)] font-semibold leading-[1.1] tracking-[-0.02em] text-foreground"
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
            className="mt-6 max-w-[420px] text-[15px] leading-relaxed text-muted-foreground"
          >
            We are a leading home healthcare facility across Delhi NCR,
            dedicated to providing exceptional service for all patients
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={2}
            className="mt-8 flex items-center gap-4"
          >
            <button
              onClick={() => navigate({ to: "/booking" })}
              className="group inline-flex items-center gap-2 rounded-full bg-[#43D4B0] px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-[#43D4B0]/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#43D4B0]/40"
            >
              Get Started
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>

            <Link
              to="/contact"
              className="group inline-flex items-center gap-2.5 text-sm font-medium text-foreground hover:text-accent transition-colors"
            >
              <span className="grid h-10 w-10 place-items-center rounded-full bg-[#E8F8F5] text-[#43D4B0] ring-1 ring-[#43D4B0]/20">
                <Phone className="h-4 w-4" />
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
            className="mt-14 flex items-center gap-10"
          >
            <StatItem
              icon={<ClinicIcon />}
              value={<><Counter value={50} />+</>}
              label="Clinics"
            />
            <StatItem
              icon={<DoctorIcon />}
              value={<><Counter value={2} />K+</>}
              label="Doctors"
            />
            <StatItem
              icon={<PatientIcon />}
              value={<><Counter value={50} />K+</>}
              label="Patients"
            />
          </motion.div>
        </div>

        {/* ─── RIGHT: Doctors Image inside hand-crafted SVG shape (full-bleed to right edge) ─── */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="relative lg:w-[54%] w-full self-stretch flex items-stretch justify-end py-6 lg:py-10"
        >
          <HeroShape
            imageUrl={heroTeam.url}
            alt="Nupun Home Health Care — Compassionate nurse with elderly patient"
            className="w-full h-full max-h-[720px]"
          />
        </motion.div>

      </div>

    </section>
  );
}

/* ── Stat Item ── */
function StatItem({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: React.ReactNode;
  label: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="grid h-12 w-12 place-items-center rounded-full bg-[#E8F8F5] text-[#43D4B0]">
        {icon}
      </span>
      <div>
        <div className="font-display text-[26px] font-bold text-foreground leading-none">
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
