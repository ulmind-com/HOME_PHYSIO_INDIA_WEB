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

  return (
    <section className="relative isolate overflow-hidden w-full bg-white min-h-[100svh]">

      {/* ── TEAL BACKGROUND SHAPE (right ~55%, curved left edge) ── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <svg
          className="absolute top-0 right-0 h-full"
          viewBox="0 0 900 900"
          preserveAspectRatio="none"
          style={{ width: "58%", height: "100%" }}
        >
          <path
            d="M120,0 L900,0 L900,900 L80,900 Q0,700 60,450 Q120,200 120,0 Z"
            fill="#43D4B0"
          />
        </svg>
      </div>

      {/* ── DECORATIVE SVG CIRCLES on teal side ── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        {/* Top-right: large double concentric ring, partially off-screen */}
        <svg className="absolute -top-8 -right-8 w-[180px] h-[180px] opacity-25" viewBox="0 0 180 180">
          <circle cx="90" cy="90" r="80" fill="none" stroke="white" strokeWidth="2" />
          <circle cx="90" cy="90" r="55" fill="none" stroke="white" strokeWidth="2" />
        </svg>

        {/* Mid-right: small filled dot */}
        <svg className="absolute top-[28%] right-[6%] w-3 h-3 opacity-30" viewBox="0 0 12 12">
          <circle cx="6" cy="6" r="6" fill="white" />
        </svg>

        {/* Center-right: medium concentric ring */}
        <svg className="absolute top-[38%] right-[18%] w-[90px] h-[90px] opacity-15" viewBox="0 0 90 90">
          <circle cx="45" cy="45" r="40" fill="none" stroke="white" strokeWidth="2" />
          <circle cx="45" cy="45" r="25" fill="none" stroke="white" strokeWidth="2" />
        </svg>

        {/* Bottom-left of teal: double concentric ring */}
        <svg className="absolute bottom-[12%] right-[42%] w-[120px] h-[120px] opacity-20" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="52" fill="none" stroke="white" strokeWidth="2" />
          <circle cx="60" cy="60" r="32" fill="none" stroke="white" strokeWidth="2" />
        </svg>

        {/* Bottom edge: half-circle ring poking up */}
        <svg className="absolute -bottom-6 right-[20%] w-[100px] h-[50px] opacity-25" viewBox="0 0 100 50">
          <circle cx="50" cy="50" r="40" fill="none" stroke="white" strokeWidth="2" />
        </svg>

        {/* Small dot near top-left of teal */}
        <svg className="absolute top-[16%] right-[46%] w-2 h-2 opacity-35" viewBox="0 0 8 8">
          <circle cx="4" cy="4" r="4" fill="white" />
        </svg>

        {/* Small ring bottom-right */}
        <svg className="absolute bottom-[5%] right-[5%] w-[60px] h-[60px] opacity-20" viewBox="0 0 60 60">
          <circle cx="30" cy="30" r="24" fill="none" stroke="white" strokeWidth="2" />
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

        {/* ─── RIGHT: Doctors Image ─── */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="relative lg:w-[54%] flex items-end justify-center self-end"
        >
          <img
            src={heroTeam.url}
            alt="Nupun Home Health Care — Expert medical team"
            className="relative z-10 w-full max-w-[600px] object-contain object-bottom"
            loading="eager"
            fetchPriority="high"
            style={{ mixBlendMode: "multiply" }}
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
