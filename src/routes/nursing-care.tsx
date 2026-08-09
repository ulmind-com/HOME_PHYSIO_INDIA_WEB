import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { api } from "@/lib/api/client";
import {
  Syringe,
  Droplets,
  BandageIcon as Bandage,
  Shield,
  Activity,
  Zap,
  Home,
  HeartPulse,
  Users,
  Clock3,
  Phone,
  ArrowRight,
  Check,
  ChevronDown,
  Stethoscope,
  ThumbsUp,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { categoriesQ, faqsQ, settingsQ } from "@/lib/api/queries";
import { BookingForm, CITIES } from "@/components/forms/BookingForm";
import { NursingBookingModal } from "@/components/forms/NursingBookingModal";
import { Section } from "@/components/site/Section";

export const Route = createFileRoute("/nursing-care")({
  head: () => ({
    meta: [
      { title: "Home Nursing Care — Nupun Home Health Care Services" },
      {
        name: "description",
        content:
          "Professional nursing support at home — injections, IV infusion, wound care, catheter care, tracheostomy care, post-hospitalisation nursing and more.",
      },
      { property: "og:title", content: "Home Nursing Care — Nupun Home Health Care" },
      {
        property: "og:description",
        content:
          "Skilled nursing at home — wound care, IV infusions, injections, catheter care and post-operative monitoring by trained nursing professionals.",
      },
      { property: "og:url", content: "/nursing-care" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/nursing-care" }],
  }),
  component: NursingCarePage,
});

/* ─────────────────────── Static data ─────────────────────── */

const NURSING_SERVICES = [
  {
    icon: Stethoscope,
    emoji: "🩺",
    title: "Nursing Care at home",
    description: "Qualified nursing staff provide routine patient care, health monitoring and assistance according to the patient's care requirements and medical instructions.",
    color: "text-blue-600",
    bg: "from-blue-50 to-sky-50",
    iconBg: "bg-blue-100",
  },
  {
    icon: Syringe,
    emoji: "💉",
    title: "Injection Administration",
    description: "Nursing staff can provide prescribed injections at home, helping patients avoid unnecessary visits to a clinic or hospital.",
    color: "text-violet-600",
    bg: "from-violet-50 to-purple-50",
    iconBg: "bg-violet-100",
  },
  {
    icon: Droplets,
    emoji: "💧",
    title: "IV Infusion & Drip Care",
    description: "Prescribed IV fluids and medications can be administered at home by trained nursing professionals with appropriate monitoring.",
    color: "text-cyan-600",
    bg: "from-cyan-50 to-teal-50",
    iconBg: "bg-cyan-100",
  },
  {
    icon: Bandage,
    emoji: "🩹",
    title: "Wound & Dressing Care",
    description: "Professional wound dressing support for patients recovering from surgery, injuries, wounds or other conditions requiring regular dressing changes.",
    color: "text-rose-600",
    bg: "from-rose-50 to-pink-50",
    iconBg: "bg-rose-100",
  },
  {
    icon: Shield,
    emoji: "🛡️",
    title: "Bed Sore Care",
    description: "Regular nursing support for patients with pressure sores, including prescribed dressing care and assistance with positioning and hygiene.",
    color: "text-amber-600",
    bg: "from-amber-50 to-yellow-50",
    iconBg: "bg-amber-100",
  },
  {
    icon: Activity,
    emoji: "🔬",
    title: "Catheter Care",
    description: "Support for catheter insertion, removal and routine catheter-related care when prescribed and clinically appropriate.",
    color: "text-emerald-600",
    bg: "from-emerald-50 to-green-50",
    iconBg: "bg-emerald-100",
  },
  {
    icon: HeartPulse,
    emoji: "🫁",
    title: "Ryles Tube Care & Feeding",
    description: "Nursing assistance for patients requiring Ryles/NG tube feeding and related routine care as advised by the treating healthcare professional.",
    color: "text-indigo-600",
    bg: "from-indigo-50 to-blue-50",
    iconBg: "bg-indigo-100",
  },
  {
    icon: Zap,
    emoji: "⚡",
    title: "Tracheostomy Care",
    description: "Home nursing support for patients with a tracheostomy, including prescribed routine care and monitoring.",
    color: "text-orange-600",
    bg: "from-orange-50 to-amber-50",
    iconBg: "bg-orange-100",
  },
  {
    icon: Activity,
    emoji: "📊",
    title: "Vital Signs Monitoring",
    description: "Monitoring of basic vital signs such as blood pressure, pulse, temperature and oxygen saturation as required.",
    color: "text-teal-600",
    bg: "from-teal-50 to-emerald-50",
    iconBg: "bg-teal-100",
  },
  {
    icon: Home,
    emoji: "🏥",
    title: "Post-Hospitalisation Nursing Care",
    description: "Nursing support for patients returning home after surgery, hospitalisation or treatment who still require medical supervision and routine care.",
    color: "text-primary",
    bg: "from-primary/5 to-primary/10",
    iconBg: "bg-primary/15",
  },
];

const NURSING_CHECKLIST = [
  "Prescribed nursing procedures at home",
  "Regular patient monitoring",
  "Injection administration",
  "IV infusion and drip support",
  "Wound and dressing care",
  "Bed sore dressing support",
  "Catheter-related care",
  "Ryles/NG tube feeding support",
  "Tracheostomy care",
  "Post-hospitalisation nursing",
  "Vital signs monitoring",
  "Regular communication with family members",
];

const WHY_CHOOSE = [
  {
    icon: Users,
    title: "Trained Nursing Professionals",
    description: "We connect families with nursing staff suitable for the patient's care requirements and prescribed nursing needs.",
    color: "text-blue-600",
    bg: "bg-blue-50",
    iconBg: "bg-blue-100",
  },
  {
    icon: Home,
    title: "Care at Your Home",
    description: "Receive nursing support without making frequent trips to a clinic or hospital for routine home-care requirements.",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    iconBg: "bg-emerald-100",
  },
  {
    icon: HeartPulse,
    title: "Patient-Focused Care",
    description: "Our nursing support is arranged according to the patient's condition, care plan and required duty hours.",
    color: "text-rose-600",
    bg: "bg-rose-50",
    iconBg: "bg-rose-100",
  },
  {
    icon: Clock3,
    title: "Flexible Nursing Visits",
    description: "Nursing visits can be arranged according to the patient's requirement, subject to staff availability and service area.",
    color: "text-violet-600",
    bg: "bg-violet-50",
    iconBg: "bg-violet-100",
  },
  {
    icon: ThumbsUp,
    title: "Family Communication",
    description: "Families can stay informed about the patient's routine care and important observations.",
    color: "text-amber-600",
    bg: "bg-amber-50",
    iconBg: "bg-amber-100",
  },
  {
    icon: Shield,
    title: "Professional & Respectful Approach",
    description: "We focus on patient comfort, privacy, dignity and proper adherence to the prescribed care instructions.",
    color: "text-teal-600",
    bg: "bg-teal-50",
    iconBg: "bg-teal-100",
  },
];

const WHO_CAN_BENEFIT = [
  "Recovering after hospitalisation",
  "Need regular wound dressing",
  "Require prescribed injections",
  "Need IV therapy at home",
  "Have a catheter or feeding tube",
  "Require tracheostomy care",
  "Need support after surgery",
  "Are bedridden and require nursing assistance",
  "Need regular monitoring of vital signs",
  "Require ongoing nursing support at home",
];

const DEFAULT_FAQS = [
  {
    id: "1",
    question: "What is home nursing care?",
    answer:
      "Home nursing care provides professional nursing support to patients in their own homes for prescribed medical procedures, monitoring, recovery and routine nursing needs.",
  },
  {
    id: "2",
    question: "Can I book a nurse for an injection at home?",
    answer:
      "Yes. Prescribed injections can be administered at home by appropriate nursing staff, subject to availability and the required procedure.",
  },
  {
    id: "3",
    question: "Do you provide wound dressing at home?",
    answer:
      "Yes. We provide home wound dressing support for patients who require regular dressing according to their medical care plan.",
  },
  {
    id: "4",
    question: "Do you provide catheter insertion and removal?",
    answer:
      "Yes. Catheter insertion and removal services can be arranged through appropriate nursing professionals when medically indicated and prescribed.",
  },
  {
    id: "5",
    question: "Can you provide IV drip at home?",
    answer:
      "Prescribed IV fluids or medications may be administered at home by trained nursing staff when the patient is suitable for home-based care.",
  },
  {
    id: "6",
    question: "Do you provide Ryles tube feeding care?",
    answer:
      "Yes. Nursing support can be arranged for patients requiring Ryles/NG tube feeding and routine tube care according to medical instructions.",
  },
  {
    id: "7",
    question: "Do you provide tracheostomy care at home?",
    answer:
      "Yes. Home nursing support is available for patients requiring routine tracheostomy care, subject to the patient's condition and nursing requirements.",
  },
  {
    id: "8",
    question: "Can I book a nurse after hospital discharge?",
    answer:
      "Yes. Post-hospitalisation nursing support can be arranged for patients who continue to require nursing care at home.",
  },
  {
    id: "9",
    question: "Can I book a nurse for one visit only?",
    answer:
      "Yes. Single nursing visits can be arranged for eligible services, subject to location, procedure and staff availability.",
  },
  {
    id: "10",
    question: "How can I book home nursing care?",
    answer:
      "Contact Nupun Home Health Care Services by phone or WhatsApp. Share the patient's age, condition, location, required service and preferred timing. Our team will guide you regarding the available nursing option.",
  },
];

/* ─────────────────────── Component ─────────────────────── */

function NursingCarePage() {
  const { data: settings } = useQuery(settingsQ());
  const { data: faqData } = useQuery(faqsQ({ limit: 20 }));
  const { data: catData } = useQuery(categoriesQ({ limit: 100 }));

  const category = (catData?.items ?? []).find(
    (c) =>
      c.name.toLowerCase().includes("nurs") ||
      c.slug?.toLowerCase().includes("nurs")
  );
  
  const heroImageStr = category?.hero_image
    ? typeof category.hero_image === "string"
      ? category.hero_image
      : category.hero_image.url
    : null;

  const phone = settings?.phone?.replace(/[^\d+]/g, "");
  const whatsapp = (settings?.whatsapp ?? settings?.phone)?.replace(/\D/g, "");

  const faqs = (faqData?.items ?? []).filter(
    (f) =>
      f.category?.toLowerCase().includes("nurs") ||
      f.category?.toLowerCase().includes("nursing") ||
      !f.category
  );
  const displayFaqs = faqs.length > 0 ? faqs.slice(0, 10) : DEFAULT_FAQS;

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <NursingHero phone={phone} whatsapp={whatsapp} heroImage={heroImageStr} />

      {/* ── Our Home Nursing Services ─────────────────────── */}
      <NursingServicesSection />

      {/* ── Nursing Support Checklist ─────────────────────── */}
      <ChecklistSection />

      {/* ── Why Choose Nupun ─────────────────────────────── */}
      <WhyChooseSection />

      {/* ── Who Can Benefit ──────────────────────────────── */}
      <WhoCanBenefitSection />

      {/* ── CTA Band ─────────────────────────────────────── */}
      <NursingCtaBand phone={phone} whatsapp={whatsapp} />

      {/* ── FAQ ──────────────────────────────────────────── */}
      <NursingFaqSection faqs={displayFaqs} />

      {/* ── Booking Panel ────────────────────────────────── */}
      <NursingBookingPanel phone={phone} whatsapp={whatsapp} />
    </>
  );
}

/* ─────────────────────── Hero ─────────────────────── */

function NursingHero({
  phone,
  whatsapp,
  heroImage,
}: {
  phone?: string;
  whatsapp?: string;
  heroImage?: string | null;
}) {
  const images = [
    heroImage || "/assets/nurse-hero-21-9-1.png",
    "/assets/nurse-hero-21-9-2.png",
    "/assets/nurse-hero-21-9-3.png",
  ];

  const mobileImages = [
    "/assets/nurse-hero-mobile-1.png",
    "/assets/nurse-hero-mobile-2.png",
    "/assets/nurse-hero-mobile-3.png",
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
            initial={{ opacity: 0, scale: 1.15 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ 
              opacity: { duration: 1.8, ease: "easeInOut" },
              scale: { duration: 8, ease: "easeOut" }
            }}
            className="absolute inset-0 w-full h-full"
          >
            <picture>
              <source media="(max-width: 768px)" srcSet={mobileImages[currentIdx]} />
              <img 
                src={images[currentIdx]} 
                alt="Home Nursing Care" 
                className="w-full h-full object-cover object-center"
              />
            </picture>
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Cinematic dark overlay similar to home page hero */}
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
              Skilled Nursing Care at Home
            </div>

            <h1 className="font-display text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-white leading-[1.08] tracking-tight mb-4">
              Professional <br />
              Nursing Support{" "}
              <em className="not-italic text-cyan-300">Delivered at Home</em>
            </h1>

            <p className="text-white/70 text-base md:text-lg leading-relaxed max-w-xl mb-6">
              Nupun Home Health Care Services provides nursing support for patients who need professional medical care in the comfort of their own home. Our nursing services are designed for patients recovering after hospitalisation, managing ongoing health needs, or requiring regular nursing procedures.
              <span className="block mt-3">
                From routine monitoring and injections to wound care, catheter care and other prescribed nursing procedures, our team helps families manage patient care with greater convenience and confidence.
              </span>
            </p>

            <div className="flex flex-wrap gap-3">
              <NursingBookingModal>
                <button
                  className="inline-flex items-center gap-2 rounded-full bg-cyan-400 text-slate-900 px-6 py-3 text-sm font-semibold shadow-[0_20px_40px_-10px_rgba(34,211,238,0.4)] hover:bg-cyan-300 hover:-translate-y-0.5 transition-all duration-300"
                >
                  Book a Nurse <ArrowRight className="h-4 w-4" />
                </button>
              </NursingBookingModal>
              {phone && (
                <a
                  href={`tel:${phone}`}
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 backdrop-blur-md px-6 py-3 text-sm font-semibold text-white hover:bg-white/20 transition-all duration-300"
                >
                  <Phone className="h-4 w-4" /> Call Now
                </a>
              )}
            </div>

            <div className="mt-8 flex flex-wrap gap-6">
              {[
                { val: "40+", label: "Nurses" },
                { val: "24/7", label: "Availability" },
                { val: "4 Cities", label: "NCR Coverage" },
              ].map((s) => (
                <div key={s.label}>
                  <div className="text-xl font-display font-bold text-white">{s.val}</div>
                  <div className="text-xs text-white/55 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Glass nursing card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="hidden lg:block"
          >
            <div className="relative rounded-[2rem] border border-white/15 bg-white/8 backdrop-blur-2xl p-6 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)]">
              <div className="absolute -top-6 -right-6 h-20 w-20 rounded-full bg-cyan-400/20 blur-3xl" />

              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-cyan-400/20 text-cyan-300 border border-cyan-400/20 mb-4">
                <Stethoscope className="h-6 w-6" strokeWidth={1.5} />
              </div>

              <div className="text-white/50 text-xs uppercase tracking-[0.2em] font-semibold mb-4">
                Nursing services available
              </div>

              <div className="grid grid-cols-2 gap-2 mb-5">
                {[
                  "Injections",
                  "IV Infusion",
                  "Wound Dressing",
                  "Bed Sore Care",
                  "Catheter Care",
                  "Ryles Tube",
                  "Tracheostomy",
                  "Vital Monitoring",
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
                From a single nursing visit to regular ongoing nursing support —
                we arrange the right care for your patient.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────── Nursing Services Grid ─────────────────────── */

function NursingServicesSection() {
  return (
    <Section className="py-20 lg:py-28">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center max-w-2xl mx-auto mb-14"
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-5">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          Nursing Procedures
        </div>
        <h2 className="font-display text-4xl md:text-5xl lg:text-6xl tracking-tight text-foreground mb-4">
          Our Home Nursing services
        </h2>
        <p className="text-muted-foreground text-lg leading-relaxed">
          Professional nursing assistance for patients who require medical support at home.
        </p>
      </motion.div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {NURSING_SERVICES.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (i % 5) * 0.07, ease: [0.22, 1, 0.36, 1] }}
            >
              <div
                className={`group h-full flex flex-col rounded-2xl bg-white border border-white p-5 shadow-sm transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.1)] cursor-default`}
              >
                <div className={`w-10 h-10 rounded-xl ${s.iconBg} flex items-center justify-center mb-3`}>
                  <Icon className={`h-5 w-5 ${s.color}`} strokeWidth={2} />
                </div>
                <h3 className="font-display text-base font-semibold text-foreground mb-2 leading-tight">
                  {s.title}
                </h3>
                <p className="text-xs leading-relaxed text-muted-foreground flex-1">
                  {s.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </Section>
  );
}

/* ─────────────────────── Checklist Section ─────────────────────── */

function ChecklistSection() {
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
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-md px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-white/70 mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
              What We Cover
            </div>
            <h2 className="font-display text-4xl md:text-5xl text-white tracking-tight leading-tight mb-6">
              Nursing Support Designed Around the Patient
            </h2>
            <p className="text-white/60 text-lg leading-relaxed">
              Every patient has different care requirements. Our nursing team
              follows the care instructions provided by the treating doctor and
              helps families maintain a safe and organised home-care routine.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
          >
            {NURSING_CHECKLIST.map((feat, i) => (
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

/* ─────────────────────── Why Choose Nupun ─────────────────────── */

function WhyChooseSection() {
  return (
    <Section className="py-20 lg:py-28">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center max-w-2xl mx-auto mb-14"
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-5">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          Why Families Choose Us
        </div>
        <h2 className="font-display text-4xl md:text-5xl tracking-tight text-foreground mb-4">
          Why Choose Nupun for Home Nursing?
        </h2>
      </motion.div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {WHY_CHOOSE.map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
              className={`group flex items-start gap-5 rounded-[1.75rem] ${item.bg} border border-transparent hover:border-black/5 p-6 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.06)]`}
            >
              <div
                className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl ${item.iconBg} ${item.color} transition-transform duration-400 group-hover:scale-110 group-hover:rotate-3`}
              >
                <Icon className="h-6 w-6" strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </Section>
  );
}

/* ─────────────────────── Who Can Benefit ─────────────────────── */

function WhoCanBenefitSection() {
  return (
    <section className="py-16 lg:py-20 bg-[#F8F9FA]">
      <div className="container-x">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-5">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Who Needs This
          </div>
          <h2 className="font-display text-3xl md:text-4xl tracking-tight text-foreground">
            Who Can Benefit From Home Nursing Care?
          </h2>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
          {WHO_CAN_BENEFIT.map((item, i) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="group flex items-center gap-2.5 rounded-full border border-border bg-white px-5 py-2.5 text-sm font-medium text-foreground shadow-sm transition-all duration-300 hover:border-primary/40 hover:bg-primary/5 hover:text-primary hover:shadow-md cursor-default"
            >
              <div className="h-2 w-2 rounded-full bg-primary/60 group-hover:bg-primary transition-colors" />
              Patients who {item}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────── CTA Band ─────────────────────── */

function NursingCtaBand({ phone, whatsapp }: { phone?: string; whatsapp?: string }) {
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
          <div className="text-[10px] uppercase tracking-[0.28em] text-white/55 mb-5">
            Need a Nurse at Home?
          </div>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-white tracking-tight leading-[1.1] mb-6">
            Whether you need a single visit or regular nursing support,{" "}
            <em className="not-italic text-cyan-300">we can help.</em>
          </h2>
          <p className="text-white/65 text-lg leading-relaxed max-w-2xl mb-10">
            Tell us about the patient and the required nursing service. Our team
            will guide you regarding the available nursing support option.
          </p>
          <div className="flex flex-wrap gap-4">
            <NursingBookingModal>
              <button
                className="inline-flex items-center gap-2 rounded-full bg-cyan-400 text-slate-900 px-8 py-4 text-base font-semibold hover:bg-cyan-300 transition-all duration-300 shadow-[0_15px_35px_-10px_rgba(34,211,238,0.4)]"
              >
                Book a Nurse <ArrowRight className="h-5 w-5" />
              </button>
            </NursingBookingModal>
            {phone && (
              <a
                href={`tel:${phone}`}
                className="inline-flex items-center gap-2 rounded-full border border-white/30 text-white px-8 py-4 text-base font-semibold hover:bg-white/10 transition-all duration-300"
              >
                <Phone className="h-5 w-5" /> Request a Callback
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────── FAQ ─────────────────────── */

function NursingFaqSection({
  faqs,
}: {
  faqs: { id: string; question: string; answer: string }[];
}) {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <Section className="bg-[#F8F9FA] py-20 lg:py-28">
      <div className="grid gap-12 lg:grid-cols-2 items-start max-w-6xl mx-auto">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Common Questions
          </div>
          <h2 className="font-display text-4xl md:text-5xl tracking-tight text-foreground mb-6">
            Frequently Asked{" "}
            <span className="text-primary">Questions</span>
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-8">
            Have questions about our home nursing services? Find answers below.
            Still unsure? Our care team is ready to help.
          </p>
          <div className="flex flex-col gap-3">
            <NursingBookingModal>
              <button
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary/10 text-primary px-6 py-3 text-sm font-semibold hover:bg-primary hover:text-white transition-colors duration-300 w-fit"
              >
                Book Home Nursing Care →
              </button>
            </NursingBookingModal>
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

const nursingFormSchema = z.object({
  patient_name: z.string().min(2, "Enter full name"),
  contact_phone: z.string().min(7, "Enter a valid phone number"),
  city: z.string().min(1, "Select a city"),
  service_name: z.string().min(1, "Select a service"),
});

type NursingFormValues = z.infer<typeof nursingFormSchema>;

function NursingBookingPanel({ phone, whatsapp }: { phone?: string; whatsapp?: string }) {
  const [done, setDone] = useState(false);
  const form = useForm<NursingFormValues>({
    resolver: zodResolver(nursingFormSchema),
    defaultValues: {
      patient_name: "",
      contact_phone: "",
      city: "",
      service_name: "",
    },
  });

  const mut = useMutation({
    mutationFn: (data: NursingFormValues) =>
      api.post("/bookings", {
        ...data,
        preferred_date: new Date().toISOString().split("T")[0],
        address: "Pending (Provided via Quick Form)",
      }),
    onSuccess: () => {
      setDone(true);
      toast.success("Booking received — we'll contact you shortly.");
    },
    onError: (err: Error) => toast.error(err.message || "Something went wrong."),
  });

  return (
    <section className="py-20 lg:py-28 bg-[#F8F9FA]" id="booking">
      <div className="container-x max-w-md mx-auto">
        <div className="rounded-2xl border border-border bg-white p-6 md:p-8 shadow-sm">
          {done ? (
            <div className="text-center py-6">
              <h3 className="font-display text-2xl mb-2">Thank You!</h3>
              <p className="text-muted-foreground mb-6">
                Our nursing team will contact you shortly.
              </p>
              <button
                onClick={() => {
                  setDone(false);
                  form.reset();
                }}
                className="rounded-full border border-border bg-white px-6 py-2.5 text-sm font-medium hover:border-primary transition-colors"
              >
                Book Another
              </button>
            </div>
          ) : (
            <>
              <h3 className="font-display text-2xl md:text-3xl tracking-tight text-foreground mb-2">
                Book an nurse
              </h3>
              <p className="text-muted-foreground text-sm mb-8">
                Fill out the form and our nursing team will contact you shortly.
              </p>

              <form onSubmit={form.handleSubmit((v) => mut.mutate(v))} className="space-y-4">
                <div>
                  <input
                    {...form.register("patient_name")}
                    placeholder="Full name"
                    className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
                  />
                  {form.formState.errors.patient_name && (
                    <p className="text-xs text-destructive mt-1">
                      {form.formState.errors.patient_name.message}
                    </p>
                  )}
                </div>

                <div>
                  <input
                    {...form.register("contact_phone")}
                    placeholder="Phone number"
                    className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
                  />
                  {form.formState.errors.contact_phone && (
                    <p className="text-xs text-destructive mt-1">
                      {form.formState.errors.contact_phone.message}
                    </p>
                  )}
                </div>

                <div>
                  <select
                    {...form.register("city")}
                    className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15 text-muted-foreground focus:text-foreground"
                  >
                    <option value="">Select city drop-down</option>
                    {CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  {form.formState.errors.city && (
                    <p className="text-xs text-destructive mt-1">
                      {form.formState.errors.city.message}
                    </p>
                  )}
                </div>

                <div>
                  <select
                    {...form.register("service_name")}
                    className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15 text-muted-foreground focus:text-foreground"
                  >
                    <option value="">Select service drop down-Nursing Care at Home</option>
                    <option value="Injection Administration">Injection Administration</option>
                    <option value="IV Infusion & Drip Care">IV Infusion & Drip Care</option>
                    <option value="Wound Dressing Care">Wound Dressing Care</option>
                    <option value="Catheter Care">Catheter Care</option>
                    <option value="Ryles Tube Feeding">Ryles Tube Feeding</option>
                    <option value="Tracheostomy Care">Tracheostomy Care</option>
                    <option value="Post-Hospitalisation Nursing Care">
                      Post-Hospitalisation Nursing Care
                    </option>
                    <option value="Vital Signs Monitoring">Vital Signs Monitoring</option>
                    <option value="Other Nursing Requirement">Other Nursing Requirement</option>
                  </select>
                  {form.formState.errors.service_name && (
                    <p className="text-xs text-destructive mt-1">
                      {form.formState.errors.service_name.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={mut.isPending}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-foreground px-4 py-3.5 text-sm font-semibold text-background hover:bg-accent transition-colors disabled:opacity-60 mt-2"
                >
                  {mut.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                  Submit request
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

