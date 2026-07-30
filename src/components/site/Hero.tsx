import { useNavigate, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowRight, Building2, Stethoscope, Users, HeartPulse } from "lucide-react";
import { reviewSummaryQ, settingsQ } from "@/lib/api/queries";
import { Counter } from "@/components/site/ui/Counter";
import { HeroShape } from "@/components/site/HeroShape";

const HERO_NURSE_PATIENT_IMAGE = "/assets/hero-nurse-patient.png";

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
  const { data: settings } = useQuery(settingsQ());
  
  // Try to get whatsapp from settings, fallback to phone, and finally a default number if settings are empty
  const rawNumber = settings?.whatsapp || settings?.phone || "919876543210";
  const whatsapp = rawNumber.replace(/\D/g, "");

  // Dynamic hero content from settings with fallbacks
  const heroHeadline = settings?.hero_headline || "Trusted Home Health Care at Your Doorstep";
  const heroSubtitle = settings?.hero_subtitle || "Har Pal Aapke Apno Ke Sath";
  const heroDescription = settings?.hero_description || "Professional Nursing Care, Patient Attendant, Elderly Care, Physiotherapist, Medical Equipment at home across Delhi, Noida, Gurugram, and Faridabad.";

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

          {/* Sub-heading / Premium Badge */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-semibold text-primary shadow-sm w-fit"
          >
            <HeartPulse className="h-4 w-4" fill="currentColor" />
            {heroSubtitle}
          </motion.div>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={1}
            className="font-display text-[clamp(2.4rem,4.5vw,4rem)] leading-[1.1] tracking-tight text-foreground"
          >
            {heroHeadline.includes("Doorstep") ? (
              <>Trusted Home Health Care at Your <span className="text-primary">Doorstep</span></>
            ) : (
              <>{heroHeadline}</>
            )}
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={2}
            className="mt-6 max-w-[480px] text-[16px] leading-relaxed text-muted-foreground font-medium"
          >
            {heroDescription}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={3}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <button
              onClick={() => navigate({ to: "/booking" })}
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-[15px] font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/30"
            >
              Book Trusted Care
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>

            <a
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2.5 rounded-full border border-primary/20 bg-white px-7 py-3.5 text-[15px] font-semibold text-foreground shadow-sm hover:border-[#25D366] hover:text-[#25D366] transition-all duration-300 hover:-translate-y-0.5"
            >
              <WhatsappIcon className="h-5 w-5 text-[#25D366]" />
              WhatsApp Now
            </a>
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
          className="relative lg:w-[54%] w-full self-stretch flex items-stretch justify-end py-6 lg:py-10 lg:-mr-6 xl:-mr-10"
        >
          <HeroShape
            imageUrl={HERO_NURSE_PATIENT_IMAGE}
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

function WhatsappIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}
