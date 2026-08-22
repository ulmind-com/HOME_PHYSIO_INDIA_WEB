import { useState, useCallback, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Phone,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Loader2,
  AlertTriangle,
  Activity,
} from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { Section } from "@/components/site/Section";
import { api } from "@/lib/api/client";
import { settingsQ, faqsQ } from "@/lib/api/queries";
import { CITIES } from "@/components/forms/BookingForm";
import { triggerBookingSuccess } from "@/components/site/GlobalBookingSuccess";
import { IcuBookingModal } from "@/components/forms/IcuBookingModal";

export const Route = createFileRoute("/icu-setup")({
  head: () => ({
    meta: [
      { title: "ICU Setup at Home — Nupun Home Health Care Services" },
      {
        name: "description",
        content:
          "Complete ICU setup at home with trained nursing professionals, essential medical equipment and continuous patient care — planned according to the patient's clinical requirements.",
      },
      { property: "og:title", content: "ICU Setup at Home — Nupun Home Health Care" },
      {
        property: "og:description",
        content:
          "Hospital-level critical care at home — ICU bed, patient monitoring, oxygen support, BiPAP/CPAP, suction and trained nursing staff.",
      },
      { property: "og:url", content: "/icu-setup" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/icu-setup" }],
  }),
  component: IcuSetupPage,
});

/* ─────────────────────── Static data ─────────────────────── */

const ICU_SERVICES = [
  {
    emoji: "🛏️",
    title: "ICU Hospital Bed",
    description: "Adjustable hospital bed suitable for critical-care patients.",
  },
  {
    emoji: "❤️",
    title: "Patient Monitoring",
    description: "Monitoring support for vital parameters as required.",
  },
  {
    emoji: "🫁",
    title: "Oxygen Support",
    description: "Oxygen concentrator/cylinder arrangements based on requirement.",
  },
  {
    emoji: "💨",
    title: "BiPAP / CPAP Support",
    description: "Non-invasive respiratory support equipment where prescribed.",
  },
  {
    emoji: "🧹",
    title: "Suction Machine",
    description: "For patients requiring airway secretion management.",
  },
  {
    emoji: "💉",
    title: "Nursing Care",
    description: "Trained nursing staff for continuous or scheduled patient care.",
  },
  {
    emoji: "🩺",
    title: "Medical Care Support",
    description:
      "Assistance with prescribed procedures, medication schedules and routine monitoring.",
  },
];

const WHO_MAY_REQUIRE = [
  "Post-operative patients",
  "Patients discharged from ICU",
  "Stroke / paralysis patients",
  "Patients requiring oxygen support",
  "Respiratory-care patients",
  "Bedridden critical-care patients",
  "Patients requiring close monitoring",
  "Patients requiring long-term supportive care",
];

const CARE_DURATIONS = ["8 Hours", "12 Hours", "24 Hours"];

const ICU_EQUIPMENT_LIST = [
  "ICU / Fowler Hospital Bed",
  "Patient Monitor",
  "Oxygen Concentrator",
  "Oxygen Cylinder",
  "Suction Machine",
  "BiPAP",
  "CPAP",
  "Air Mattress",
  "Nebulizer",
  "Other required medical equipment",
];

const WHY_CHOOSE = [
  {
    emoji: "👩‍⚕️",
    title: "Trained Care Team",
    description: "Experienced nursing and caregiving professionals.",
  },
  {
    emoji: "🏠",
    title: "Complete Home Setup",
    description: "Equipment and care requirements can be coordinated together.",
  },
  {
    emoji: "⏰",
    title: "Flexible Care Hours",
    description: "8, 12 and 24-hour care options.",
  },
  {
    emoji: "📋",
    title: "Personalized Care Plan",
    description: "Services based on the patient's individual requirements.",
  },
  {
    emoji: "❤️",
    title: "Home-Based Convenience",
    description: "Continue appropriate care in a familiar home environment.",
  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Submit Your Requirement",
    desc: "Tell us about the patient's condition and required care.",
  },
  {
    step: "02",
    title: "Requirement Assessment",
    desc: "Our team discusses the patient's care and equipment requirements.",
  },
  {
    step: "03",
    title: "Setup Planning",
    desc: "Required equipment and nursing support are arranged.",
  },
  {
    step: "04",
    title: "Home ICU Setup",
    desc: "The required equipment is delivered and arranged at home.",
  },
  {
    step: "05",
    title: "Nursing Support Begins",
    desc: "Trained staff starts the scheduled home-care service.",
  },
];

const FAQS = [
  {
    id: "f1",
    question: "Can you arrange a complete ICU setup at home?",
    answer:
      "Yes, we can coordinate the required home-care equipment and nursing support according to the patient's requirements.",
  },
  {
    id: "f2",
    question: "Do you provide 24-hour ICU nursing?",
    answer:
      "Yes, 24-hour nursing support can be requested, subject to staff availability and patient requirements.",
  },
  {
    id: "f3",
    question: "Can I take only equipment without nursing staff?",
    answer: "Yes, equipment requirements can be discussed separately.",
  },
  {
    id: "f4",
    question: "Do you provide ventilator support?",
    answer:
      "Ventilator-dependent patients require specialist assessment and appropriate clinical supervision. Availability and suitability should be confirmed before arranging the setup.",
  },
  {
    id: "f5",
    question: "How quickly can the setup be arranged?",
    answer: "It depends on the equipment and nursing requirements and their availability.",
  },
];

/* ─────────────────────── Component ─────────────────────── */

function IcuSetupPage() {
  const { data: settings } = useQuery(settingsQ());
  const { data: faqData } = useQuery(faqsQ({ limit: 20 }));

  const rawPhone = settings?.phone || "+919813095627";
  const rawWhatsapp = settings?.whatsapp || settings?.phone || "+919813095627";

  const phone = rawPhone.replace(/[^\d+]/g, "");
  const whatsapp = rawWhatsapp.replace(/\D/g, "");

  const apiFaqs = (faqData?.items ?? []).filter(
    (f) =>
      f.category?.toLowerCase().includes("icu")
  );

  // Hardcoded FAQs always stay; API FAQs are appended (deduplicated by question)
  const hardcodedQuestions = new Set(FAQS.map((f) => f.question.toLowerCase()));
  const extraFaqs = apiFaqs.filter((f) => !hardcodedQuestions.has(f.question.toLowerCase()));
  const displayFaqs = [...FAQS, ...extraFaqs];

  return (
    <>
      <IcuHero phone={phone} whatsapp={whatsapp} />
      <IntroSection />
      <ServicesSection />
      <WhoMayRequireSection />
      <DurationEquipmentSection />
      <WhyChooseSection />
      <HowItWorksSection />
      <SafetySection />
      <IcuCtaBand phone={phone} whatsapp={whatsapp} />
      <IcuFaqSection faqs={displayFaqs} />
      <IcuBookingPanel phone={phone} whatsapp={whatsapp} />
    </>
  );
}

/* ─────────────────────── Hero ─────────────────────── */

function IcuHero({ phone, whatsapp }: { phone?: string; whatsapp?: string }) {
  const images = [
    "/assets/hero-desktop/icu_desktop_1_1787204981037.jpg",
    "/assets/hero-desktop/icu_desktop_2_1787204991157.jpg",
    "/assets/hero-desktop/icu_desktop_3_1787205006319.jpg",
  ];

  const mobileImages = [
    "/assets/hero-mobile/icu_mobile_1_1787205029486.jpg",
    "/assets/hero-mobile/icu_mobile_2_1787205041595.jpg",
    "/assets/hero-mobile/icu_mobile_3_1787205063978.jpg",
  ];

  const heroStats = [
    { val: "24/7", label: "ICU Support" },
    { val: "Complete", label: "Home Setup" },
    { val: "4 Cities", label: "NCR Coverage" },
  ];

  const [currentIdx, setCurrentIdx] = useState(0);

  const go = useCallback(
    (next: number) => {
      setCurrentIdx(((next % images.length) + images.length) % images.length);
    },
    [images.length]
  );

  useEffect(() => {
    const timer = setInterval(() => {
      go(currentIdx + 1);
    }, 5500);
    return () => clearInterval(timer);
  }, [currentIdx, go]);

  return (
    <section className="relative min-h-[100svh] lg:min-h-svh flex items-center overflow-hidden">
      {/* Hero background image slider */}
      <div className="absolute inset-0 -z-20 w-full h-full bg-[#0a0a0a]">
        <AnimatePresence>
          <motion.div
            key={currentIdx}
            initial={{ opacity: 0, scale: 1 }}
            animate={{ opacity: 1, scale: 1.15 }}
            exit={{ opacity: 0 }}
            transition={{
              opacity: { duration: 1.8, ease: "easeInOut" },
              scale: { duration: 8, ease: "easeOut" },
            }}
            className="absolute inset-0 w-full h-full"
          >
            <picture>
              <source media="(max-width: 768px)" srcSet={mobileImages[currentIdx]} />
              <img
                src={images[currentIdx]}
                alt="ICU Setup at Home"
                className="w-full h-full object-cover object-center"
              />
            </picture>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Cinematic dark overlay */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/90 via-black/60 to-black/30" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

      {/* Dot grid */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.08]"
        style={{
          backgroundImage: "radial-gradient(white 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
        aria-hidden
      />

      {/* Cross/plus pattern */}
      <div className="absolute inset-0 -z-10 opacity-5 pointer-events-none" aria-hidden>
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="absolute text-white font-bold text-4xl"
            style={{
              top: `${15 + i * 15}%`,
              left: `${60 + (i % 3) * 12}%`,
              transform: `rotate(${i * 12}deg)`,
            }}
          >
            +
          </div>
        ))}
      </div>

      <div className="container-x relative z-10 pt-24 pb-12 lg:pt-28 lg:pb-14">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-md px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/90 mb-5">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
              ICU Setup at Home
            </div>

            <h1
              className="font-display font-medium text-white tracking-tight leading-[1.1] text-[40px] sm:text-[48px] md:text-[56px] lg:text-[64px] mb-4"
              style={{ textShadow: "0 4px 40px rgba(0,0,0,0.5)" }}
            >
              Hospital-Level Critical Care, In the Comfort of Home
            </h1>

            <p className="text-white/70 text-base md:text-lg leading-relaxed max-w-xl mb-6">
              Complete ICU setup at home with trained nursing professionals, essential
              medical equipment and continuous patient care — planned according to the
              patient's clinical requirements.
            </p>

            <div className="mt-6 md:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <IcuBookingModal>
                <button className="group inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-3.5 text-[15px] font-semibold text-primary-foreground shadow-sm transition-all duration-300 hover:brightness-110 hover:-translate-y-0.5">
                  Book ICU Setup
                  <ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              </IcuBookingModal>

              <a
                href={`tel:${phone || "+919813095627"}`}
                className="group inline-flex items-center justify-center gap-2.5 rounded-full border border-white/30 bg-white/10 backdrop-blur-md px-8 py-3.5 text-[15px] font-medium text-white shadow-sm hover:bg-white/20 hover:border-white/50 transition-all duration-300 hover:-translate-y-0.5"
              >
                <Phone className="h-5 w-5 text-[#25D366]" />
                Call Now
              </a>
            </div>

            <div className="mt-8 flex flex-wrap gap-6">
              {heroStats.map((s) => (
                <div key={s.label}>
                  <div className="text-xl font-display font-bold text-white">{s.val}</div>
                  <div className="text-xs text-white/55 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Glass ICU card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="hidden lg:block"
          >
            <div className="relative rounded-[2rem] border border-white/15 bg-white/8 backdrop-blur-2xl p-6 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)]">
              <div className="absolute -top-6 -right-6 h-20 w-20 rounded-full bg-cyan-400/20 blur-3xl" />

              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-cyan-400/20 text-cyan-300 border border-cyan-400/20 mb-4">
                <Activity className="h-6 w-6" strokeWidth={1.5} />
              </div>

              <div className="text-white/50 text-xs uppercase tracking-[0.2em] font-semibold mb-4">
                ICU Equipment Available
              </div>

              <div className="grid grid-cols-2 gap-2 mb-5">
                {[
                  "Hospital Bed",
                  "Patient Monitor",
                  "Oxygen Support",
                  "BiPAP / CPAP",
                  "Suction Machine",
                  "Air Mattress",
                  "Nebulizer",
                  "Nursing Staff",
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-2.5 py-1.5"
                  >
                    <div className="h-1.5 w-1.5 rounded-full bg-cyan-400 shrink-0" />
                    <span className="text-white/80 text-xs font-medium">{item}</span>
                  </div>
                ))}
              </div>

              <div className="h-px bg-white/10 mb-4" />
              <p className="text-white/55 text-xs leading-relaxed">
                From single equipment to a complete ICU setup — we arrange the right care
                for your patient.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Progress Dots + Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="flex items-center gap-5 mt-10 lg:mt-8 w-full lg:justify-end"
        >
          <div className="flex items-center gap-2">
            <button
              onClick={() => go(currentIdx - 1)}
              className="grid h-12 w-12 place-items-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition-all hover:bg-white/20 hover:border-white/40"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => go(currentIdx + 1)}
              className="grid h-12 w-12 place-items-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition-all hover:bg-white/20 hover:border-white/40"
              aria-label="Next slide"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => go(i)}
                className="group relative h-1.5 overflow-hidden rounded-full transition-all duration-500"
                style={{ width: i === currentIdx ? 48 : 20 }}
                aria-label={`Go to slide ${i + 1}`}
              >
                <span className="absolute inset-0 rounded-full bg-white/30" />
                {i === currentIdx && (
                  <motion.span
                    className="absolute inset-0 rounded-full bg-cyan-400"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 5.5, ease: "linear" }}
                    style={{ transformOrigin: "left" }}
                  />
                )}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────── Intro ─────────────────────── */

function IntroSection() {
  return (
    <Section className="py-20 lg:py-28">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto text-center"
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-5">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          Critical Care at Home
        </div>
        <h2 className="font-display text-4xl md:text-5xl tracking-tight text-foreground mb-6">
          Complete ICU Care Setup at Home
        </h2>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Nupun Home Health Care Services provides a comprehensive home ICU setup for
          patients who require critical care after hospital discharge or prefer continued
          medical care at home. Our team helps arrange the required equipment, trained
          nursing support and essential monitoring facilities according to the patient's
          needs.
        </p>
      </motion.div>
    </Section>
  );
}

/* ─────────────────────── Services Grid ─────────────────────── */

function ServicesSection() {
  return (
    <Section className="py-20 lg:py-28 bg-[#F8F9FA]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center max-w-2xl mx-auto mb-14"
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-5">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          ICU Equipment & Care
        </div>
        <h2 className="font-display text-4xl md:text-5xl lg:text-6xl tracking-tight text-foreground mb-4">
          What Our ICU Setup Includes
        </h2>
        <p className="text-muted-foreground text-lg leading-relaxed">
          Essential equipment and trained care support, arranged around the patient's
          clinical requirements.
        </p>
      </motion.div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {ICU_SERVICES.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: (i % 4) * 0.07, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="group h-full flex flex-col items-start text-left rounded-2xl bg-white border border-black/5 p-6 shadow-sm transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.1)] cursor-default">
              <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-rose-50 mb-4 transform transition-transform group-hover:scale-110 duration-300">
                <span className="text-4xl leading-none">{s.emoji}</span>
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-3 leading-tight tracking-wide">
                {s.title}
              </h3>
              <p className="text-muted-foreground text-base leading-relaxed font-medium">
                {s.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

/* ─────────────────────── Who May Require ─────────────────────── */

function WhoMayRequireSection() {
  return (
    <section className="relative py-20 lg:py-28 overflow-hidden bg-gradient-to-br from-slate-900 to-blue-950">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-0 right-[20%] w-80 h-80 bg-cyan-500/15 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-[10%] w-64 h-64 bg-blue-600/10 rounded-full blur-[80px]" />
      </div>

      <div className="container-x relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="font-display text-4xl md:text-5xl text-white tracking-tight leading-tight mb-6">
              Who May Require Home ICU Setup?
            </h2>
            <p className="text-white/80 text-sm max-w-lg border-l-2 border-cyan-400 pl-4 py-2 bg-white/5 rounded-r-lg">
              Note: ICU setup and clinical equipment should be arranged according to the
              patient's doctor's / medical team's recommendations.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
          >
            {WHO_MAY_REQUIRE.map((feat, i) => (
              <motion.div
                key={feat}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md px-4 py-3"
              >
                <div className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-cyan-400/25 text-cyan-300">
                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                </div>
                <span className="text-sm font-medium text-white/85">{feat}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────── Duration + Equipment ─────────────────────── */

function DurationEquipmentSection() {
  return (
    <Section className="py-20 lg:py-28">
      <div className="grid lg:grid-cols-2 gap-16 items-start">
        {/* Care Duration */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="bg-[#F8F9FA] rounded-[2rem] p-10 border border-border"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Care Options
          </div>
          <h2 className="font-display text-3xl md:text-4xl tracking-tight text-foreground mb-6">
            Choose Your Care Duration
          </h2>
          <div className="flex flex-wrap gap-3 mb-6">
            {CARE_DURATIONS.map((d) => (
              <span
                key={d}
                className="px-5 py-2.5 rounded-full bg-white border border-border text-foreground font-semibold text-sm shadow-sm"
              >
                {d}
              </span>
            ))}
          </div>
          <p className="text-muted-foreground leading-relaxed">
            Patient families can select the required nursing-care duration according to
            their needs and the patient's condition.
          </p>
        </motion.div>

        {/* Equipment List */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-[2rem] p-10 border border-border shadow-sm"
        >
          <h2 className="font-display text-3xl md:text-4xl tracking-tight text-foreground mb-6">
            ICU Equipment We Can Arrange
          </h2>
          <ul className="space-y-4">
            {ICU_EQUIPMENT_LIST.map((eq) => (
              <li key={eq} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-green-50 flex items-center justify-center text-green-600 shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span className="font-medium text-foreground/80">{eq}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </Section>
  );
}

/* ─────────────────────── Why Choose Nupun ─────────────────────── */

function WhyChooseSection() {
  return (
    <Section className="py-20 lg:py-28 bg-[#F8F9FA]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center max-w-2xl mx-auto mb-14"
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-5">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          Why Families Choose Us
        </div>
        <h2 className="font-display text-4xl md:text-5xl tracking-tight text-foreground mb-4">
          Why Choose Nupun Home Health Care Services?
        </h2>
      </motion.div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {WHY_CHOOSE.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
            className="group h-full flex flex-col items-start text-left rounded-[1.75rem] bg-white border border-black/5 p-8 shadow-sm transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)] cursor-default"
          >
            <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-rose-50 mb-6 transform transition-transform duration-400 group-hover:scale-110 group-hover:rotate-3">
              <span className="text-3xl leading-none">{item.emoji}</span>
            </div>
            <h3 className="font-display text-xl font-semibold text-foreground mb-3 leading-tight tracking-wide">
              {item.title}
            </h3>
            <p className="text-muted-foreground text-base leading-relaxed font-medium">
              {item.description}
            </p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

/* ─────────────────────── How It Works ─────────────────────── */

function HowItWorksSection() {
  return (
    <Section className="py-20 lg:py-28">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center max-w-2xl mx-auto mb-16"
      >
        <h2 className="font-display text-4xl md:text-5xl tracking-tight text-foreground mb-4">
          How It Works
        </h2>
      </motion.div>

      <div className="max-w-4xl mx-auto grid gap-6">
        {HOW_IT_WORKS.map((step, i) => (
          <motion.div
            key={step.step}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="flex items-start gap-6 p-6 rounded-2xl border border-border bg-white hover:border-primary/30 transition-colors"
          >
            <div className="font-display text-3xl font-bold text-primary/30 shrink-0 mt-1">
              {step.step}
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-2">{step.title}</h3>
              <p className="text-muted-foreground text-base leading-relaxed">{step.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

/* ─────────────────────── Safety ─────────────────────── */

function SafetySection() {
  return (
    <Section className="py-12 bg-red-50/50">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-red-100 p-8 md:p-12 text-center shadow-sm">
        <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-6">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-4">
          Critical Care at Home Requires Proper Planning
        </h2>
        <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-6">
          Home ICU care is not suitable for every patient. The patient's medical
          condition, required equipment, nursing support and emergency plan should be
          assessed before shifting critical care to home.
        </p>
        <div className="inline-block px-6 py-3 rounded-xl bg-red-50 text-red-700 text-sm font-medium border border-red-200">
          For emergencies, always contact your treating doctor or local emergency medical
          services.
        </div>
      </div>
    </Section>
  );
}

/* ─────────────────────── CTA Band ─────────────────────── */

function IcuCtaBand({ phone, whatsapp }: { phone?: string; whatsapp?: string }) {
  return (
    <section className="relative overflow-hidden">
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.22 0.08 240) 0%, oklch(0.28 0.06 260) 100%)",
        }}
      />
      <div className="absolute inset-0 -z-10 opacity-10 pointer-events-none">
        <div
          style={{
            backgroundImage: "radial-gradient(white 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
          className="w-full h-full"
          aria-hidden
        />
      </div>

      <div className="container-x py-20 lg:py-24">
        <div className="max-w-3xl">
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-white tracking-tight leading-tight mb-3">
            Need an ICU Setup at Home?
          </h2>
          <h3
            className="text-xl md:text-2xl text-white/90 font-medium mb-6 tracking-wide"
            style={{ wordSpacing: "0.06em" }}
          >
            Get the required equipment and professional home-care support planned for your
            loved one's needs.
          </h3>
          <div className="flex flex-wrap gap-4 mt-8">
            <IcuBookingModal>
              <button className="inline-flex items-center gap-2 rounded-full bg-cyan-400 text-slate-900 px-8 py-4 text-base font-semibold hover:bg-cyan-300 transition-all duration-300 shadow-[0_15px_35px_-10px_rgba(34,211,238,0.4)]">
                Book ICU Setup <ArrowRight className="h-5 w-5" />
              </button>
            </IcuBookingModal>
            {phone && (
              <a
                href={`tel:${phone}`}
                className="inline-flex items-center gap-2 rounded-full border border-white/30 text-white px-8 py-4 text-base font-semibold hover:bg-white/10 transition-all duration-300"
              >
                <Phone className="h-5 w-5" /> Call Nupun Home Health Care Services
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────── FAQ ─────────────────────── */

function IcuFaqSection({
  faqs,
}: {
  faqs: { id: string; question: string; answer: string }[];
}) {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <Section className="bg-[#F8F9FA] py-20 lg:py-28" id="faq">
      <div className="grid gap-12 lg:grid-cols-2 items-start max-w-6xl mx-auto">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Common Questions
          </div>
          <h2 className="font-display text-4xl md:text-5xl tracking-tight text-foreground mb-6">
            Frequently Asked <span className="text-primary">Questions</span>
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-8">
            Have questions about our ICU setup services? Find answers below. Still unsure?
            Our care team is ready to help.
          </p>
          <div className="flex flex-col gap-3">
            <IcuBookingModal>
              <button className="inline-flex items-center justify-center gap-2 rounded-full bg-primary/10 text-primary px-6 py-3 text-sm font-semibold hover:bg-primary hover:text-white transition-colors duration-300 w-fit">
                Request ICU Setup →
              </button>
            </IcuBookingModal>
            <Link
              to="/contact"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors w-fit"
            >
              Contact a care advisor →
            </Link>
          </div>
        </div>

        <div className="space-y-3">
          {faqs.map((faq) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-border bg-white overflow-hidden shadow-sm"
            >
              <button
                className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                onClick={() => setOpen(open === faq.id ? null : faq.id)}
              >
                <span className="font-semibold text-foreground text-[15px] leading-snug">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`h-5 w-5 text-muted-foreground shrink-0 transition-transform duration-300 ${
                    open === faq.id ? "rotate-180" : ""
                  }`}
                />
              </button>
              {open === faq.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="px-6 pb-5 text-sm text-muted-foreground leading-relaxed border-t border-border/50 pt-4"
                >
                  {faq.answer}
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ─────────────────────── Booking Panel ─────────────────────── */

const icuFormSchema = z.object({
  patient_name: z.string().min(2, "Enter full name"),
  patient_age: z.string().min(1, "Enter patient age"),
  contact_phone: z.string().min(7, "Enter a valid phone number"),
  city: z.string().min(1, "Select a city"),
  patient_condition: z.string().min(2, "Enter patient condition / diagnosis"),
  required_equipment: z.array(z.string()).min(1, "Select at least one equipment"),
  expected_start_date: z.string().optional(),
});

type IcuFormValues = z.infer<typeof icuFormSchema>;

function IcuBookingPanel({ phone, whatsapp }: { phone?: string; whatsapp?: string }) {
  const [done, setDone] = useState(false);
  const form = useForm<IcuFormValues>({
    resolver: zodResolver(icuFormSchema),
    defaultValues: {
      patient_name: "",
      patient_age: "",
      contact_phone: "",
      city: "",
      patient_condition: "",
      required_equipment: [],
      expected_start_date: "",
    },
  });

  const mut = useMutation({
    mutationFn: (data: IcuFormValues) =>
      api.post("/bookings", {
        patient_name: data.patient_name,
        contact_phone: data.contact_phone,
        city: data.city,
        service_name: "ICU Setup at Home",
        patient_condition: [
          `Age: ${data.patient_age}`,
          `Condition: ${data.patient_condition}`,
          `Equipment: ${data.required_equipment.join(", ")}`,
        ]
          .filter(Boolean)
          .join(" | "),
        source: "ICU Setup Inline Form",
        preferred_date:
          data.expected_start_date || new Date().toISOString().split("T")[0],
        address: "Pending (Provided via Quick Form)",
      }),
    onSuccess: () => {
      setDone(true);
      triggerBookingSuccess();
      toast.success("Booking received — we'll contact you shortly.");
    },
    onError: (err: Error) => toast.error(err.message || "Something went wrong."),
  });

  const inputCls =
    "w-full rounded-full border border-border bg-transparent px-5 py-3.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15 placeholder:text-muted-foreground";
  const selectCls =
    "w-full rounded-full border border-border bg-transparent px-5 py-3.5 pr-10 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15 text-foreground appearance-none";
  const errCls = "text-xs text-destructive mt-1";

  const selectedEquipment = form.watch("required_equipment");
  const handleEquipmentToggle = (eq: string) => {
    if (selectedEquipment.includes(eq)) {
      form.setValue(
        "required_equipment",
        selectedEquipment.filter((i) => i !== eq),
        { shouldValidate: true }
      );
    } else {
      form.setValue("required_equipment", [...selectedEquipment, eq], {
        shouldValidate: true,
      });
    }
  };

  return (
    <section className="py-20 lg:py-28 bg-[#F8F9FA]" id="booking">
      <div className="container-x max-w-lg mx-auto">
        <div className="rounded-2xl border border-border bg-white p-6 md:p-8 shadow-sm">
          {done ? (
            <div className="text-center py-6">
              <h3 className="font-display text-2xl mb-2">Thank You!</h3>
              <p className="text-muted-foreground mb-6">
                Our care team will contact you shortly to discuss your setup.
              </p>
              <button
                onClick={() => {
                  setDone(false);
                  form.reset();
                }}
                className="rounded-full border border-border bg-white px-6 py-2.5 text-sm font-medium hover:border-primary transition-colors"
              >
                Request Another
              </button>
            </div>
          ) : (
            <>
              <h3 className="font-display text-2xl md:text-3xl tracking-tight text-foreground mb-2">
                Request Your ICU Setup
              </h3>
              <p className="text-muted-foreground text-sm mb-8">
                Tell us about the patient's condition and required care.
              </p>

              <form onSubmit={form.handleSubmit((v) => mut.mutate(v))} className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <input
                      {...form.register("patient_name")}
                      placeholder="Full Name"
                      className={inputCls}
                    />
                    {form.formState.errors.patient_name && (
                      <p className={errCls}>{form.formState.errors.patient_name.message}</p>
                    )}
                  </div>
                  <div>
                    <input
                      {...form.register("patient_age")}
                      placeholder="Age"
                      type="number"
                      className={inputCls}
                    />
                    {form.formState.errors.patient_age && (
                      <p className={errCls}>{form.formState.errors.patient_age.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <input
                      {...form.register("contact_phone")}
                      placeholder="Phone Number"
                      type="tel"
                      className={inputCls}
                    />
                    {form.formState.errors.contact_phone && (
                      <p className={errCls}>{form.formState.errors.contact_phone.message}</p>
                    )}
                  </div>
                  <div>
                    <div className="relative">
                      <select {...form.register("city")} className={selectCls}>
                        <option value="">Select City</option>
                        {CITIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    </div>
                    {form.formState.errors.city && (
                      <p className={errCls}>{form.formState.errors.city.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <input
                    {...form.register("patient_condition")}
                    placeholder="Patient Condition / Diagnosis"
                    className={inputCls}
                  />
                  {form.formState.errors.patient_condition && (
                    <p className={errCls}>
                      {form.formState.errors.patient_condition.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2 border border-border/50 rounded-2xl p-4 bg-slate-50/50">
                  <label className="text-sm font-semibold text-foreground">
                    Required Equipment
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {ICU_EQUIPMENT_LIST.map((eq) => (
                      <label
                        key={eq}
                        className="flex items-center gap-2 cursor-pointer group"
                      >
                        <div
                          className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                            selectedEquipment.includes(eq)
                              ? "bg-primary border-primary text-white"
                              : "border-input bg-white group-hover:border-primary/50"
                          }`}
                        >
                          {selectedEquipment.includes(eq) && (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          )}
                        </div>
                        <span className="text-sm text-foreground/80">{eq}</span>
                        <input
                          type="checkbox"
                          className="hidden"
                          checked={selectedEquipment.includes(eq)}
                          onChange={() => handleEquipmentToggle(eq)}
                        />
                      </label>
                    ))}
                  </div>
                  {form.formState.errors.required_equipment && (
                    <p className={errCls}>
                      {form.formState.errors.required_equipment.message}
                    </p>
                  )}
                </div>

                <div>
                  <input
                    {...form.register("expected_start_date")}
                    type="date"
                    className={inputCls}
                    title="Expected Start Date"
                  />
                </div>

                <button
                  type="submit"
                  disabled={mut.isPending}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#0A252E] px-4 py-3.5 text-sm font-semibold text-white hover:bg-[#0A252E]/90 transition-colors disabled:opacity-60 mt-2"
                >
                  {mut.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                  Submit Request
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
