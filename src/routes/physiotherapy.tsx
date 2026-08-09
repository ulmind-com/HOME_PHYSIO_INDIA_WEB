import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { api } from "@/lib/api/client";
import {
  Activity,
  ArrowRight,
  Check,
  ChevronDown,
  Home,
  HeartPulse,
  Users,
  Clock3,
  Phone,
  Shield,
  Footprints,
  Brain,
  Bone,
  Dumbbell,
  BedDouble,
  PersonStanding,
  ThumbsUp,
  Loader2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { faqsQ, settingsQ } from "@/lib/api/queries";
import { CITIES } from "@/components/forms/BookingForm";
import { PhysioBookingModal, PHYSIO_SERVICES } from "@/components/forms/PhysioBookingModal";
import { Section } from "@/components/site/Section";

export const Route = createFileRoute("/physiotherapy")({
  head: () => ({
    meta: [
      { title: "Physiotherapy at Home — Nupun Home Health Care Services" },
      {
        name: "description",
        content:
          "Professional physiotherapy at home — post-surgery rehabilitation, stroke recovery, orthopedic physiotherapy, geriatric care, mobility training and more.",
      },
      { property: "og:title", content: "Physiotherapy at Home — Nupun Home Health Care" },
      {
        property: "og:description",
        content:
          "Home-based physiotherapy for elderly, post-surgery, stroke recovery and bedridden patients by trained physiotherapy professionals.",
      },
      { property: "og:url", content: "/physiotherapy" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/physiotherapy" }],
  }),
  component: PhysiotherapyPage,
});

/* ─────────────────────── Static data ─────────────────────── */

const PHYSIO_SERVICE_CARDS = [
  {
    icon: Home,
    emoji: "🏥",
    title: "Post-Hospitalization Physiotherapy",
    description:
      "Physiotherapy support for patients recovering after hospitalization, helping them regain strength, mobility and confidence in daily activities.",
    color: "text-blue-600",
    bg: "from-blue-50 to-sky-50",
    iconBg: "bg-blue-100",
  },
  {
    icon: Activity,
    emoji: "🦴",
    title: "Post-Surgery Rehabilitation",
    description:
      "Personalised rehabilitation exercises after surgery to improve movement, strength, flexibility and recovery under professional guidance.",
    color: "text-violet-600",
    bg: "from-violet-50 to-purple-50",
    iconBg: "bg-violet-100",
  },
  {
    icon: Brain,
    emoji: "🧠",
    title: "Stroke Rehabilitation",
    description:
      "Home-based physiotherapy for stroke patients focusing on mobility, balance, coordination, muscle strength and functional recovery.",
    color: "text-cyan-600",
    bg: "from-cyan-50 to-teal-50",
    iconBg: "bg-cyan-100",
  },
  {
    icon: Bone,
    emoji: "🦿",
    title: "Orthopedic Physiotherapy",
    description:
      "Physiotherapy support for joint, muscle and bone-related conditions, including stiffness, weakness, reduced mobility and recovery after orthopedic procedures.",
    color: "text-rose-600",
    bg: "from-rose-50 to-pink-50",
    iconBg: "bg-rose-100",
  },
  {
    icon: Dumbbell,
    emoji: "💪",
    title: "Pain Management & Exercise Therapy",
    description:
      "Guided therapeutic exercises and physiotherapy techniques to support recovery from common muscle and joint pain and improve movement.",
    color: "text-amber-600",
    bg: "from-amber-50 to-yellow-50",
    iconBg: "bg-amber-100",
  },
  {
    icon: BedDouble,
    emoji: "🛏️",
    title: "Bedridden Patient Physiotherapy",
    description:
      "Gentle physiotherapy for bedridden patients to support mobility, joint movement, muscle strength and prevention of complications related to prolonged immobility.",
    color: "text-emerald-600",
    bg: "from-emerald-50 to-green-50",
    iconBg: "bg-emerald-100",
  },
  {
    icon: PersonStanding,
    emoji: "🧓",
    title: "Geriatric Physiotherapy",
    description:
      "Specialised physiotherapy support for elderly patients to improve strength, balance, mobility and independence in daily life.",
    color: "text-indigo-600",
    bg: "from-indigo-50 to-blue-50",
    iconBg: "bg-indigo-100",
  },
  {
    icon: Footprints,
    emoji: "🚶",
    title: "Mobility & Balance Training",
    description:
      "Exercises designed to improve walking, balance, transfers and functional movement while helping reduce the risk of falls.",
    color: "text-teal-600",
    bg: "from-teal-50 to-emerald-50",
    iconBg: "bg-teal-100",
  },
];

const PHYSIO_CHECKLIST = [
  "Trained Physiotherapy Professionals",
  "Personalised Physiotherapy Plans",
  "Convenient Home-Based Sessions",
  "Elderly Patient Support",
  "Bedridden Patient Physiotherapy",
  "Post-Surgery Rehabilitation",
  "Mobility & Balance Training",
  "Recovery-Focused Exercise Therapy",
];

const WHY_CHOOSE = [
  {
    icon: Users,
    title: "Professional Physiotherapy Support",
    description:
      "Physiotherapy sessions are provided by trained professionals according to the patient's individual needs.",
    color: "text-blue-600",
    bg: "bg-blue-50",
    iconBg: "bg-blue-100",
  },
  {
    icon: HeartPulse,
    title: "Personalised Care Plans",
    description:
      "Exercises and therapy are planned according to the patient's condition, mobility and recovery requirements.",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    iconBg: "bg-emerald-100",
  },
  {
    icon: Home,
    title: "Care at Your Home",
    description:
      "Patients can receive physiotherapy without the stress and inconvenience of travelling to a clinic.",
    color: "text-rose-600",
    bg: "bg-rose-50",
    iconBg: "bg-rose-100",
  },
  {
    icon: ThumbsUp,
    title: "Family-Friendly Care",
    description:
      "Family members can stay informed about the patient's progress and ongoing care requirements.",
    color: "text-violet-600",
    bg: "bg-violet-50",
    iconBg: "bg-violet-100",
  },
];

const DEFAULT_FAQS = [
  {
    id: "p1",
    question: "What is physiotherapy at home?",
    answer:
      "Physiotherapy at home allows patients to receive professional physiotherapy sessions in the comfort of their own home instead of travelling to a clinic.",
  },
  {
    id: "p2",
    question: "Who can benefit from home physiotherapy?",
    answer:
      "Home physiotherapy can be helpful for elderly patients, post-surgery patients, stroke recovery patients, bedridden patients and people experiencing mobility or movement difficulties.",
  },
  {
    id: "p3",
    question: "Do you provide physiotherapy for bedridden patients?",
    answer:
      "Yes. Home physiotherapy can be arranged for bedridden patients based on their condition and rehabilitation requirements.",
  },
  {
    id: "p4",
    question: "Do you provide physiotherapy after surgery?",
    answer:
      "Yes. Physiotherapy support can be arranged for patients recovering after surgery, according to the rehabilitation plan recommended for the patient.",
  },
  {
    id: "p5",
    question: "Do you provide physiotherapy for elderly patients?",
    answer:
      "Yes. Our home physiotherapy service can support elderly patients with mobility, balance, strength and functional movement.",
  },
  {
    id: "p6",
    question: "How can I book a physiotherapist at home?",
    answer:
      "You can contact Nupun Home Health Care Services by phone or WhatsApp, or submit the booking form on our website. Our team will contact you to understand the patient's requirements and schedule the service.",
  },
];

/* ─────────────────────── Component ─────────────────────── */

function PhysiotherapyPage() {
  const { data: settings } = useQuery(settingsQ());
  const { data: faqData } = useQuery(faqsQ({ limit: 20 }));

  const phone = settings?.phone?.replace(/[^\d+]/g, "");
  const whatsapp = (settings?.whatsapp ?? settings?.phone)?.replace(/\D/g, "");

  const faqs = (faqData?.items ?? []).filter(
    (f) =>
      f.category?.toLowerCase().includes("physio") ||
      f.category?.toLowerCase().includes("physiotherapy") ||
      !f.category
  );
  const displayFaqs = faqs.length > 0 ? faqs.slice(0, 10) : DEFAULT_FAQS;

  return (
    <>
      <PhysioHero phone={phone} whatsapp={whatsapp} />
      <PhysioServicesSection />
      <PhysioChecklistSection />
      <PhysioWhyChooseSection />
      <PhysioCtaBand phone={phone} whatsapp={whatsapp} />
      <PhysioFaqSection faqs={displayFaqs} />
      <PhysioBookingPanel phone={phone} whatsapp={whatsapp} />
    </>
  );
}

/* ─────────────────────── Hero ─────────────────────── */

function PhysioHero({
  phone,
  whatsapp,
}: {
  phone?: string;
  whatsapp?: string;
}) {
  const images = [
    "/assets/physio-hero-21-9-1.png",
    "/assets/physio-hero-21-9-2.png",
    "/assets/physio-hero-21-9-3.png",
  ];

  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % images.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <section className="relative min-h-[100svh] lg:min-h-svh flex items-center overflow-hidden">
      {/* Hero background image slider */}
      <div className="absolute inset-0 -z-20 w-full h-full bg-[#0a0a0a]">
        <AnimatePresence>
          <motion.img
            key={currentIdx}
            src={images[currentIdx]}
            alt="Physiotherapy at Home"
            initial={{ opacity: 0, scale: 1.15 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              opacity: { duration: 1.8, ease: "easeInOut" },
              scale: { duration: 8, ease: "easeOut" },
            }}
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
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
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Physiotherapy & Recovery
            </div>

            <h1 className="font-display text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-white leading-[1.08] tracking-tight mb-4">
              Physiotherapy <br />
              at Home{" "}
            </h1>

            <p className="text-white/70 text-base md:text-lg leading-relaxed max-w-xl mb-6">
              Nupun Home Health Care Services provides personalised physiotherapy at home for
              elderly patients, post-surgery patients, bedridden patients and people recovering
              from illness or injury. Our physiotherapists focus on safe movement, pain management,
              rehabilitation and improving day-to-day independence.
            </p>

            <div className="flex flex-wrap gap-3">
              <PhysioBookingModal>
                <button className="inline-flex items-center gap-2 rounded-full bg-emerald-400 text-slate-900 px-6 py-3 text-sm font-semibold shadow-[0_20px_40px_-10px_rgba(52,211,153,0.4)] hover:bg-emerald-300 hover:-translate-y-0.5 transition-all duration-300">
                  Book a Physiotherapist <ArrowRight className="h-4 w-4" />
                </button>
              </PhysioBookingModal>
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
                { val: "20+", label: "Physiotherapists" },
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

          {/* Right: Glass physio card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="hidden lg:block"
          >
            <div className="relative rounded-[2rem] border border-white/15 bg-white/8 backdrop-blur-2xl p-6 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)]">
              <div className="absolute -top-6 -right-6 h-20 w-20 rounded-full bg-emerald-400/20 blur-3xl" />

              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-400/20 text-emerald-300 border border-emerald-400/20 mb-4">
                <Activity className="h-6 w-6" strokeWidth={1.5} />
              </div>

              <div className="text-white/50 text-xs uppercase tracking-[0.2em] font-semibold mb-4">
                Physiotherapy services available
              </div>

              <div className="grid grid-cols-2 gap-2 mb-5">
                {[
                  "Post-Surgery Rehab",
                  "Stroke Recovery",
                  "Orthopedic Care",
                  "Pain Management",
                  "Geriatric Physio",
                  "Mobility Training",
                  "Bedridden Care",
                  "Balance Training",
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-2.5 py-1.5"
                  >
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
                    <span className="text-white/80 text-xs font-medium">{item}</span>
                  </div>
                ))}
              </div>

              <div className="h-px bg-white/10 mb-4" />
              <p className="text-white/55 text-xs leading-relaxed">
                From post-surgery rehabilitation to regular physiotherapy sessions — we arrange
                the right care for your recovery.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────── Physio Services Grid ─────────────────────── */

function PhysioServicesSection() {
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
          Physiotherapy Services
        </div>
        <h2 className="font-display text-4xl md:text-5xl lg:text-6xl tracking-tight text-foreground mb-4">
          Our Physiotherapy Services
        </h2>
        <p className="text-muted-foreground text-lg leading-relaxed">
          Nupun Home Health Care Services provides professional physiotherapy and rehabilitation
          support at home based on the patient's condition, mobility and recovery needs.
        </p>
      </motion.div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {PHYSIO_SERVICE_CARDS.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (i % 4) * 0.07, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="group h-full flex flex-col rounded-2xl bg-white border border-white p-5 shadow-sm transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.1)] cursor-default">
                <div
                  className={`w-10 h-10 rounded-xl ${s.iconBg} flex items-center justify-center mb-3`}
                >
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

function PhysioChecklistSection() {
  return (
    <section className="relative py-20 lg:py-28 overflow-hidden bg-gradient-to-br from-slate-900 to-emerald-950">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-0 right-[20%] w-80 h-80 bg-emerald-500/15 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-[10%] w-64 h-64 bg-teal-600/10 rounded-full blur-[80px]" />
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
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              What We Cover
            </div>
            <h2 className="font-display text-4xl md:text-5xl text-white tracking-tight leading-tight mb-6">
              Trusted Physiotherapy Care at Home
            </h2>
            <p className="text-white/60 text-lg leading-relaxed">
              At Nupun Home Health Care Services, our physiotherapy support is focused on safe,
              personalised and convenient care at home. Each session is planned according to the
              patient's condition, recovery goals and comfort.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
          >
            {PHYSIO_CHECKLIST.map((feat, i) => (
              <motion.div
                key={feat}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md px-4 py-3"
              >
                <div className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-emerald-400/25 text-emerald-300">
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

function PhysioWhyChooseSection() {
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
          Why Choose Nupun for Physiotherapy at Home?
        </h2>
        <p className="text-muted-foreground text-lg leading-relaxed">
          Getting physiotherapy at home makes rehabilitation easier and more convenient, especially
          for elderly, bedridden and recovering patients.
        </p>
      </motion.div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {WHY_CHOOSE.map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (i % 4) * 0.1 }}
              className={`group flex flex-col items-start gap-4 rounded-[1.75rem] ${item.bg} border border-transparent hover:border-black/5 p-6 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.06)]`}
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

/* ─────────────────────── CTA Band ─────────────────────── */

function PhysioCtaBand({ phone, whatsapp }: { phone?: string; whatsapp?: string }) {
  return (
    <section className="relative overflow-hidden">
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.22 0.06 160) 0%, oklch(0.28 0.08 180) 100%)",
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
            Need Physiotherapy at Home?
          </div>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-white tracking-tight leading-[1.1] mb-6">
            Whether your loved one is recovering after surgery or needs rehabilitation,{" "}
            <em className="not-italic text-emerald-300">we can help.</em>
          </h2>
          <p className="text-white/65 text-lg leading-relaxed max-w-2xl mb-10">
            Our team provides convenient home-based physiotherapy focused on mobility, strength,
            balance and functional recovery.
          </p>
          <div className="flex flex-wrap gap-4">
            <PhysioBookingModal>
              <button className="inline-flex items-center gap-2 rounded-full bg-emerald-400 text-slate-900 px-8 py-4 text-base font-semibold hover:bg-emerald-300 transition-all duration-300 shadow-[0_15px_35px_-10px_rgba(52,211,153,0.4)]">
                Book a Physiotherapist <ArrowRight className="h-5 w-5" />
              </button>
            </PhysioBookingModal>
            {phone && (
              <a
                href={`tel:${phone}`}
                className="inline-flex items-center gap-2 rounded-full border border-white/30 text-white px-8 py-4 text-base font-semibold hover:bg-white/10 transition-all duration-300"
              >
                <Phone className="h-5 w-5" /> Call Now
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────── FAQ ─────────────────────── */

function PhysioFaqSection({
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
            Find answers to common questions about our physiotherapy at home services.
            Still unsure? Our care team is ready to help.
          </p>
          <div className="flex flex-col gap-3">
            <PhysioBookingModal>
              <button className="inline-flex items-center justify-center gap-2 rounded-full bg-primary/10 text-primary px-6 py-3 text-sm font-semibold hover:bg-primary hover:text-white transition-colors duration-300 w-fit">
                Book Physiotherapy Care →
              </button>
            </PhysioBookingModal>
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

const physioFormSchema = z.object({
  patient_name: z.string().min(2, "Enter full name"),
  contact_phone: z.string().min(7, "Enter a valid phone number"),
  city: z.string().min(1, "Select a city"),
  service_name: z.string().min(1, "Select a service"),
  message: z.string().optional(),
});

type PhysioFormValues = z.infer<typeof physioFormSchema>;

function PhysioBookingPanel({ phone, whatsapp }: { phone?: string; whatsapp?: string }) {
  const [done, setDone] = useState(false);
  const form = useForm<PhysioFormValues>({
    resolver: zodResolver(physioFormSchema),
    defaultValues: {
      patient_name: "",
      contact_phone: "",
      city: "",
      service_name: "",
      message: "",
    },
  });

  const mut = useMutation({
    mutationFn: (data: PhysioFormValues) =>
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
                Our physiotherapy team will contact you shortly.
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
                Book a Physiotherapist
              </h3>
              <p className="text-muted-foreground text-sm mb-8">
                Tell us about your requirements and our care team will contact you shortly.
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
                    <option value="">Select city</option>
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
                    <option value="">Select physiotherapy service</option>
                    {PHYSIO_SERVICES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  {form.formState.errors.service_name && (
                    <p className="text-xs text-destructive mt-1">
                      {form.formState.errors.service_name.message}
                    </p>
                  )}
                </div>

                <div>
                  <textarea
                    {...form.register("message")}
                    placeholder="Patient condition / requirement (optional)"
                    rows={3}
                    className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={mut.isPending}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-foreground px-4 py-3.5 text-sm font-semibold text-background hover:bg-accent transition-colors disabled:opacity-60 mt-2"
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
