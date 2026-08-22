import { createFileRoute, Link } from "@tanstack/react-router";
import { triggerBookingSuccess } from "@/components/site/GlobalBookingSuccess";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { api } from "@/lib/api/client";
import {
  Baby,
  Heart,
  HeartHandshake,
  ShieldCheck,
  Phone,
  ArrowRight,
  Check,
  ChevronDown,
  Loader2,
  Clock,
  Users,
  ThumbsUp,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { categoriesQ, faqsQ, settingsQ } from "@/lib/api/queries";
import { BookingForm, CITIES } from "@/components/forms/BookingForm";
import { MotherBabyBookingModal } from "@/components/forms/MotherBabyBookingModal";
import { Section } from "@/components/site/Section";

export const Route = createFileRoute("/mother-baby-care")({
  head: () => ({
    meta: [
      { title: "Mother & Baby Care at Home — Nupun Home Health Care Services" },
      {
        name: "description",
        content:
          "Reliable and personalised mother and baby care at home — postnatal recovery, newborn care, feeding support and everyday assistance for families.",
      },
      { property: "og:title", content: "Mother & Baby Care at Home — Nupun Home Health Care" },
      {
        property: "og:description",
        content:
          "Trusted mother and baby care at home — postnatal support, newborn care, feeding assistance and flexible care options by trained caregivers.",
      },
      { property: "og:url", content: "/mother-baby-care" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/mother-baby-care" }],
  }),
  component: MotherBabyCarePage,
});

/* ─────────────────────── Static data ─────────────────────── */

const MOTHER_BABY_SERVICES = [
  {
    emoji: "👩",
    title: "Postnatal Mother Care",
    description: "New mothers ko daily care, comfort, hygiene and recovery support.",
    color: "text-pink-600",
    bg: "from-pink-50 to-rose-50",
    iconBg: "bg-pink-100",
  },
  {
    emoji: "👶",
    title: "Newborn Baby Care",
    description: "Newborn ki daily routine, feeding support, hygiene and basic baby care.",
    color: "text-blue-600",
    bg: "from-blue-50 to-sky-50",
    iconBg: "bg-blue-100",
  },
  {
    emoji: "🍼",
    title: "Mother & Baby Support",
    description: "Mother aur baby dono ki routine care aur assistance according to family requirements.",
    color: "text-violet-600",
    bg: "from-violet-50 to-purple-50",
    iconBg: "bg-violet-100",
  },
  {
    emoji: "🤱",
    title: "Feeding Support",
    description: "Mother ko baby feeding routine aur daily baby-care activities mein assistance.",
    color: "text-amber-600",
    bg: "from-amber-50 to-yellow-50",
    iconBg: "bg-amber-100",
  },
];

const TRUST_CHECKLIST = [
  "Trained & verified caregivers",
  "Mother and newborn care support",
  "Personal hygiene assistance",
  "Baby feeding & routine support",
  "Postnatal recovery assistance",
  "Flexible 8 / 12 / 24-hour care options",
  "Personalised care according to family requirements",
  "Regular family communication",
];

const WHY_CHOOSE = [
  {
    icon: Users,
    emoji: "✅",
    title: "Trained Caregivers",
    description: "Mother and baby care requirements ke according trained staff.",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    iconBg: "bg-emerald-100",
  },
  {
    icon: Clock,
    emoji: "⏰",
    title: "Flexible Care Options",
    description: "8, 12 aur 24-hour care according to requirement.",
    color: "text-sky-600",
    bg: "bg-sky-50",
    iconBg: "bg-sky-100",
  },
  {
    icon: Heart,
    emoji: "💖",
    title: "Personalised Care",
    description: "Har mother aur baby ki requirement alag hoti hai.",
    color: "text-rose-600",
    bg: "bg-rose-50",
    iconBg: "bg-rose-100",
  },
  {
    icon: ShieldCheck,
    emoji: "🛡️",
    title: "Safety & Comfort",
    description: "Hygiene, comfort aur respectful assistance par focus.",
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    iconBg: "bg-indigo-100",
  },
  {
    icon: ThumbsUp,
    emoji: "🤝",
    title: "Family Support",
    description: "Family ko care routine aur requirements ke according coordination.",
    color: "text-amber-600",
    bg: "bg-amber-50",
    iconBg: "bg-amber-100",
  },
];

const DEFAULT_FAQS = [
  {
    id: "1",
    question: "What is Mother & Baby Care at home?",
    answer:
      "Mother & Baby Care at home provides trained caregiver support for new mothers and newborn babies. This includes postnatal recovery assistance, newborn hygiene, feeding support, and daily routine care — all in the comfort of your home.",
  },
  {
    id: "2",
    question: "Do you provide postnatal care?",
    answer:
      "Yes. Our trained caregivers assist new mothers with postnatal recovery, personal hygiene, comfort, rest and daily care needs after delivery.",
  },
  {
    id: "3",
    question: "Do you provide newborn baby care?",
    answer:
      "Yes. Our caregivers support newborn baby care including bathing, diaper changes, feeding assistance, hygiene and establishing a healthy daily routine.",
  },
  {
    id: "4",
    question: "Can I book 8, 12 or 24-hour care?",
    answer:
      "Yes. We offer flexible care options — 8-hour, 12-hour and 24-hour shifts — so you can choose the support that best fits your family's needs.",
  },
  {
    id: "5",
    question: "Can I request a female caregiver?",
    answer:
      "Yes. Female caregivers are available for mother and baby care services, subject to availability in your area.",
  },
  {
    id: "6",
    question: "Can care be arranged after C-section delivery?",
    answer:
      "Yes. Post C-section care can be arranged for new mothers who need additional support with mobility, hygiene, feeding and recovery at home.",
  },
  {
    id: "7",
    question: "How can I book Mother & Baby Care?",
    answer:
      "Contact Nupun Home Health Care Services by phone or WhatsApp. Share the mother's and baby's details, your location, required care type and preferred timing. Our team will guide you regarding the best available option.",
  },
];

/* ─────────────────────── Component ─────────────────────── */

function MotherBabyCarePage() {
  const { data: settings } = useQuery(settingsQ());
  const { data: faqData } = useQuery(faqsQ({ limit: 20 }));
  const { data: catData } = useQuery(categoriesQ({ limit: 100 }));

  const category = (catData?.items ?? []).find(
    (c) =>
      c.name.toLowerCase().includes("mother") ||
      c.name.toLowerCase().includes("baby") ||
      c.slug?.toLowerCase().includes("mother")
  );

  const rawPhone = settings?.phone || "+919813095627";
  const rawWhatsapp = settings?.whatsapp || settings?.phone || "+919813095627";

  const phone = rawPhone.replace(/[^\d+]/g, "");
  const whatsapp = rawWhatsapp.replace(/\D/g, "");

  const faqs = (faqData?.items ?? []).filter(
    (f) =>
      f.category?.toLowerCase().includes("mother") ||
      f.category?.toLowerCase().includes("baby")
  );

  // Hardcoded FAQs always stay; API FAQs are appended (deduplicated by question)
  const hardcodedQuestions = new Set(DEFAULT_FAQS.map((f) => f.question.toLowerCase()));
  const apiFaqs = faqs.filter((f) => !hardcodedQuestions.has(f.question.toLowerCase()));
  const displayFaqs = [...DEFAULT_FAQS, ...apiFaqs];

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <MotherBabyHero phone={phone} whatsapp={whatsapp} category={category} />

      {/* ── Our Mother & Baby Care Services ───────────────── */}
      <MotherBabyServicesSection />

      {/* ── Trusted Mother & Baby Care Checklist ──────────── */}
      <ChecklistSection />

      {/* ── Why Choose Nupun ─────────────────────────────── */}
      <WhyChooseSection />

      {/* ── CTA Band ─────────────────────────────────────── */}
      <MotherBabyCtaBand phone={phone} whatsapp={whatsapp} />

      {/* ── FAQ ──────────────────────────────────────────── */}
      <MotherBabyFaqSection faqs={displayFaqs} />

      {/* ── Booking Panel ────────────────────────────────── */}
      <MotherBabyBookingPanel phone={phone} whatsapp={whatsapp} />
    </>
  );
}

/* ─────────────────────── Hero ─────────────────────── */

function MotherBabyHero({
  phone,
  whatsapp,
  category,
}: {
  phone?: string;
  whatsapp?: string;
  category?: any;
}) {
  const heroBadge = category?.hero_badge || "Mother & Baby Care Services";
  const heroTitle = category?.hero_title || "Trusted Mother & Baby Care at Home";
  const heroDescription = category?.hero_description || "Nupun Home Health Care Services provides reliable and personalised support for mothers and babies at home, helping families manage postnatal recovery, newborn care and everyday needs with comfort and confidence.";
  const heroCtaPrimaryText = category?.hero_cta_primary_text || "Book Mother & Baby Care";
  const heroCtaSecondaryText = category?.hero_cta_secondary_text || "Call Now / WhatsApp";
  const heroStats = category?.hero_stats?.length ? category.hero_stats : [
    { val: "100+", label: "Caregivers" },
    { val: "24/7", label: "Availability" },
    { val: "4 Cities", label: "NCR Coverage" },
  ];

  const heroImageStr = category?.hero_image
    ? typeof category.hero_image === "string"
      ? category.hero_image
      : category.hero_image.url
    : null;

  const images = category?.hero_images?.length
    ? category.hero_images.map((img: any) => typeof img === "string" ? img : img.url)
    : [
        "/assets/hero-desktop/mother_baby_desktop_1_1787204531372.jpg",
        "/assets/hero-desktop/mother_baby_desktop_2_1787204543889.jpg",
        "/assets/hero-desktop/mother_baby_desktop_3_1787204554373.jpg",
      ];

  const mobileImages = category?.hero_images_mobile?.length
    ? category.hero_images_mobile.map((img: any) => typeof img === "string" ? img : img.url)
    : [
        "/assets/hero-mobile/mother_baby_mobile_1_1787204578046.jpg",
        "/assets/hero-mobile/mother_baby_mobile_2_1787204592769.jpg",
        "/assets/hero-mobile/mother_baby_mobile_3_1787204605595.jpg",
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
              scale: { duration: 8, ease: "easeOut" }
            }}
            className="absolute inset-0 w-full h-full"
          >
            <picture>
              <source media="(max-width: 768px)" srcSet={mobileImages[currentIdx]} />
              <img
                src={images[currentIdx]}
                alt="Mother & Baby Care"
                className="w-full h-full object-cover object-center"
              />
            </picture>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Cinematic dark overlay similar to nursing page hero */}
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
              <span className="h-1.5 w-1.5 rounded-full bg-pink-400 animate-pulse" />
              {heroBadge}
            </div>

            <h1
              className="font-display font-medium text-white tracking-tight leading-[1.1] text-[40px] sm:text-[48px] md:text-[56px] lg:text-[64px] mb-4"
              style={{ textShadow: "0 4px 40px rgba(0,0,0,0.5)" }}
            >
              {heroTitle}
            </h1>

            <p className="text-white/70 text-base md:text-lg leading-relaxed max-w-xl mb-6">
              {heroDescription}
            </p>

            <div className="mt-6 md:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <MotherBabyBookingModal>
                <button
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-3.5 text-[15px] font-semibold text-primary-foreground shadow-sm transition-all duration-300 hover:brightness-110 hover:-translate-y-0.5"
                >
                  {heroCtaPrimaryText}
                  <ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              </MotherBabyBookingModal>

              <a
                href={`tel:${phone || "+919813095627"}`}
                className="group inline-flex items-center justify-center gap-2.5 rounded-full border border-white/30 bg-white/10 backdrop-blur-md px-8 py-3.5 text-[15px] font-medium text-white shadow-sm hover:bg-white/20 hover:border-white/50 transition-all duration-300 hover:-translate-y-0.5"
              >
                <Phone className="h-5 w-5 text-[#25D366]" />
                {heroCtaSecondaryText}
              </a>
            </div>

            <div className="mt-8 flex flex-wrap gap-6">
              {heroStats.map((s: any) => (
                <div key={s.label}>
                  <div className="text-xl font-display font-bold text-white">{s.val || s.value}</div>
                  <div className="text-xs text-white/55 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Glass card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="hidden lg:block"
          >
            <div className="relative rounded-[2rem] border border-white/15 bg-white/8 backdrop-blur-2xl p-6 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)]">
              <div className="absolute -top-6 -right-6 h-20 w-20 rounded-full bg-pink-400/20 blur-3xl" />

              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-pink-400/20 text-pink-300 border border-pink-400/20 mb-4">
                <Baby className="h-6 w-6" strokeWidth={1.5} />
              </div>

              <div className="text-white/50 text-xs uppercase tracking-[0.2em] font-semibold mb-4">
                Care services available
              </div>

              <div className="grid grid-cols-2 gap-2 mb-5">
                {[
                  "Postnatal Care",
                  "Newborn Care",
                  "Feeding Support",
                  "Hygiene Care",
                  "Recovery Support",
                  "Baby Routine",
                  "Flexible Hours",
                  "Trained Staff",
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-2.5 py-1.5"
                  >
                    <div className="h-1.5 w-1.5 rounded-full bg-pink-400 shrink-0" />
                    <span className="text-white/80 text-xs font-medium">{item}</span>
                  </div>
                ))}
              </div>

              <div className="h-px bg-white/10 mb-4" />
              <p className="text-white/55 text-xs leading-relaxed">
                From postnatal recovery to newborn care —
                we arrange the right support for your family.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Progress Dots + Navigation (Matches Nursing Hero) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="flex items-center gap-5 mt-10 lg:mt-8 w-full lg:justify-end"
        >
          {/* Arrow Nav */}
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

          {/* Progress Bars */}
          <div className="flex items-center gap-2">
            {images.map((_: any, i: number) => (
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
                    className="absolute inset-0 rounded-full bg-pink-400"
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

/* ─────────────────────── Services Grid (Same as Nursing) ─────────────────────── */

function MotherBabyServicesSection() {
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
          Our Services
        </div>
        <h2 className="font-display text-4xl md:text-5xl lg:text-6xl tracking-tight text-foreground mb-4">
          Our Mother & Baby Care Services
        </h2>
        <p className="text-muted-foreground text-lg leading-relaxed">
          Personalised care and support for mothers and newborns at home.
        </p>
      </motion.div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {MOTHER_BABY_SERVICES.map((s, i) => {
          return (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (i % 4) * 0.07, ease: [0.22, 1, 0.36, 1] }}
            >
              <div
                className="group h-full flex flex-col items-start text-left rounded-2xl bg-white border border-black/5 p-6 shadow-sm transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.1)] cursor-default"
              >
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
          );
        })}
      </div>
    </Section>
  );
}

/* ─────────────────────── Checklist Section (Same as Nursing) ─────────────────────── */

function ChecklistSection() {
  return (
    <section className="relative py-20 lg:py-28 overflow-hidden bg-gradient-to-br from-slate-900 to-blue-950">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-0 right-[20%] w-80 h-80 bg-pink-500/15 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-[10%] w-64 h-64 bg-rose-600/10 rounded-full blur-[80px]" />
      </div>

      <div className="container-x relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="font-display text-4xl md:text-5xl text-white tracking-tight leading-tight mb-3">
              Trusted Mother & Baby Care
            </h2>
            <h3 className="text-xl md:text-2xl text-white/90 font-medium mb-6">
              Care Designed Around Mother & Baby
            </h3>
            <p className="text-white/60 text-lg leading-relaxed">
              Every mother and baby has different care requirements. Our
              trained caregivers provide gentle, personalised support to
              help families manage postnatal recovery, newborn care and
              everyday needs with comfort and confidence.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
          >
            {TRUST_CHECKLIST.map((feat, i) => (
              <motion.div
                key={feat}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md px-4 py-3"
              >
                <div className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-pink-400/25 text-pink-300">
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

/* ─────────────────────── Why Choose Nupun (Same as Nursing) ─────────────────────── */

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
          Why Choose Nupun?
        </h2>
      </motion.div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {WHY_CHOOSE.map((item, i) => {
          return (
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
          );
        })}
      </div>
    </Section>
  );
}

/* ─────────────────────── CTA Band (Same as Nursing) ─────────────────────── */

function MotherBabyCtaBand({ phone, whatsapp }: { phone?: string; whatsapp?: string }) {
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
            Need Mother & Baby Care at Home?
          </h2>
          <h3 className="text-xl md:text-2xl text-white/90 font-medium mb-6 tracking-wide" style={{ wordSpacing: "0.06em" }}>
            Whether you need support after delivery, newborn care or assistance with everyday mother and baby needs,{" "}
            <em className="not-italic text-white">Nupun Home Health Care Services is here to help.</em>
          </h3>
          <p className="text-white/65 text-lg leading-relaxed max-w-2xl mb-10">
            Tell us about your requirement and our care team will
            guide you regarding the available support option.
          </p>
          <div className="flex flex-wrap gap-4">
            <MotherBabyBookingModal>
              <button
                className="inline-flex items-center gap-2 rounded-full bg-cyan-400 text-slate-900 px-8 py-4 text-base font-semibold hover:bg-cyan-300 transition-all duration-300 shadow-[0_15px_35px_-10px_rgba(34,211,238,0.4)]"
              >
                Book Mother & Baby Care <ArrowRight className="h-5 w-5" />
              </button>
            </MotherBabyBookingModal>
            {whatsapp && (
              <a
                href={`https://wa.me/${whatsapp}?text=Hi%2C%20I%20need%20Mother%20%26%20Baby%20Care%20at%20home.`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 text-white px-8 py-4 text-base font-semibold hover:bg-white/10 transition-all duration-300"
              >
                <Phone className="h-5 w-5" /> WhatsApp Us
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────── FAQ (Same 2-col layout as Nursing) ─────────────────────── */

function MotherBabyFaqSection({
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
            Frequently Asked{" "}
            <span className="text-primary">Questions</span>
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-8">
            Have questions about our mother & baby care services? Find answers below.
            Still unsure? Our care team is ready to help.
          </p>
          <div className="flex flex-col gap-3">
            <MotherBabyBookingModal>
              <button
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary/10 text-primary px-6 py-3 text-sm font-semibold hover:bg-primary hover:text-white transition-colors duration-300 w-fit"
              >
                Book Mother & Baby Care →
              </button>
            </MotherBabyBookingModal>
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

/* ─────────────────────── Booking Panel (Same fields as Modal) ─────────────────────── */

const inlineFormSchema = z.object({
  patient_name: z.string().min(2, "Enter full name"),
  contact_phone: z.string().min(7, "Enter a valid phone number"),
  city: z.string().min(1, "Select a city"),
  service_required: z.string().min(1, "Select service required"),
  care_duration: z.string().min(1, "Select care duration"),
  mother_care_requirement: z.string().optional(),
  baby_care_requirement: z.string().optional(),
  delivery_type: z.string().optional(),
  preferred_date: z.string().optional(),
  patient_age: z.string().optional(),
  additional_message: z.string().optional(),
});

type InlineFormValues = z.infer<typeof inlineFormSchema>;

function MotherBabyBookingPanel({ phone, whatsapp }: { phone?: string; whatsapp?: string }) {
  const [done, setDone] = useState(false);
  const form = useForm<InlineFormValues>({
    resolver: zodResolver(inlineFormSchema),
    defaultValues: {
      patient_name: "",
      contact_phone: "",
      city: "",
      service_required: "",
      care_duration: "",
      mother_care_requirement: "",
      baby_care_requirement: "",
      delivery_type: "",
      preferred_date: "",
      patient_age: "",
      additional_message: "",
    },
  });

  const mut = useMutation({
    mutationFn: (data: InlineFormValues) =>
      api.post("/bookings", {
        patient_name: data.patient_name,
        contact_phone: data.contact_phone,
        city: data.city,
        service_name: data.service_required,
        patient_condition: [
          `Care Duration: ${data.care_duration}`,
          data.mother_care_requirement ? `Mother Care: ${data.mother_care_requirement}` : "",
          data.baby_care_requirement ? `Baby Care: ${data.baby_care_requirement}` : "",
          data.delivery_type ? `Delivery Type: ${data.delivery_type}` : "",
          data.patient_age ? `Patient/Baby Age: ${data.patient_age}` : "",
          data.additional_message ? `Message: ${data.additional_message}` : "",
        ].filter(Boolean).join(" | "),
        source: "Mother & Baby Care Inline Form",
        preferred_date: data.preferred_date || new Date().toISOString().split("T")[0],
        address: "Pending (Provided via Quick Form)",
      }),
    onSuccess: () => {
      setDone(true);
      triggerBookingSuccess();
      toast.success("Booking received — we'll contact you shortly.");
    },
    onError: (err: Error) => toast.error(err.message || "Something went wrong."),
  });

  const inputCls = "w-full rounded-full border border-border bg-transparent px-5 py-3.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15 placeholder:text-muted-foreground";
  const selectCls = "w-full rounded-full border border-border bg-transparent px-5 py-3.5 pr-10 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15 text-foreground appearance-none";
  const errCls = "text-xs text-destructive mt-1";

  return (
    <section className="py-20 lg:py-28 bg-[#F8F9FA]" id="booking">
      <div className="container-x max-w-md mx-auto">
        <div className="rounded-2xl border border-border bg-white p-6 md:p-8 shadow-sm">
          {done ? (
            <div className="text-center py-6">
              <h3 className="font-display text-2xl mb-2">Thank You!</h3>
              <p className="text-muted-foreground mb-6">
                Our care team will contact you shortly.
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
                Mother & Baby Care – Booking Form
              </h3>
              <p className="text-muted-foreground text-sm mb-8">
                Tell us about your requirements and our care team will contact you shortly.
              </p>

              <form onSubmit={form.handleSubmit((v) => mut.mutate(v))} className="space-y-4">
                {/* Full Name */}
                <div>
                  <input
                    {...form.register("patient_name")}
                    placeholder="Full Name"
                    className={inputCls}
                  />
                  {form.formState.errors.patient_name && (
                    <p className={errCls}>{form.formState.errors.patient_name.message}</p>
                  )}
                </div>

                {/* Phone Number */}
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

                {/* Select City */}
                <div>
                  <div className="relative">
                    <select {...form.register("city")} className={selectCls}>
                      <option value="">Select City</option>
                      {CITIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  </div>
                  {form.formState.errors.city && (
                    <p className={errCls}>{form.formState.errors.city.message}</p>
                  )}
                </div>

                {/* Service Required */}
                <div>
                  <div className="relative">
                    <select
                      {...form.register("service_required")}
                      className="w-full rounded-full border border-primary/20 bg-primary/5 px-5 py-3.5 pr-10 text-sm outline-none transition hover:bg-primary/10 hover:border-primary/30 focus:border-primary focus:ring-2 focus:ring-primary/15 text-foreground appearance-none cursor-pointer"
                    >
                      <option value="">Service Required</option>
                      <option value="Mother Care">Mother Care</option>
                      <option value="Baby Care">Baby Care</option>
                      <option value="Mother & Baby Care">Mother & Baby Care</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  </div>
                  {form.formState.errors.service_required && (
                    <p className={errCls}>{form.formState.errors.service_required.message}</p>
                  )}
                </div>

                {/* Care Duration */}
                <div>
                  <div className="relative">
                    <select {...form.register("care_duration")} className={selectCls}>
                      <option value="">Care Duration / Service Required For</option>
                      <option value="8 Hours">8 Hours</option>
                      <option value="12 Hours">12 Hours</option>
                      <option value="24 Hours">24 Hours</option>
                      <option value="Visit Basis">Visit Basis</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  </div>
                  {form.formState.errors.care_duration && (
                    <p className={errCls}>{form.formState.errors.care_duration.message}</p>
                  )}
                </div>

                {/* Mother's Care Requirement */}
                <div>
                  <div className="relative">
                    <select {...form.register("mother_care_requirement")} className={selectCls}>
                      <option value="">Mother's Care Requirement</option>
                      <option value="Post-Delivery Care">Post-Delivery Care</option>
                      <option value="C-Section Care">C-Section Care</option>
                      <option value="Normal Delivery Care">Normal Delivery Care</option>
                      <option value="Mother Assistance">Mother Assistance</option>
                      <option value="Feeding Support">Feeding Support</option>
                      <option value="Personal Hygiene & Daily Care">Personal Hygiene & Daily Care</option>
                      <option value="Other">Other</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>

                {/* Baby's Care Requirement */}
                <div>
                  <div className="relative">
                    <select {...form.register("baby_care_requirement")} className={selectCls}>
                      <option value="">Baby's Care Requirement</option>
                      <option value="Newborn Baby Care">Newborn Baby Care</option>
                      <option value="Feeding Support">Feeding Support</option>
                      <option value="Diaper Changing">Diaper Changing</option>
                      <option value="Bathing & Hygiene">Bathing & Hygiene</option>
                      <option value="Baby Monitoring">Baby Monitoring</option>
                      <option value="Other">Other</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>

                {/* Delivery Type */}
                <div>
                  <div className="relative">
                    <select {...form.register("delivery_type")} className={selectCls}>
                      <option value="">Delivery Type</option>
                      <option value="Normal Delivery">Normal Delivery</option>
                      <option value="C-Section">C-Section</option>
                      <option value="Not Applicable / Other">Not Applicable / Other</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>

                {/* Expected Start Date + Patient / Baby Age */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <input
                      {...form.register("preferred_date")}
                      type="date"
                      className={inputCls}
                      title="Expected Start Date"
                    />
                  </div>
                  <div>
                    <input
                      {...form.register("patient_age")}
                      placeholder="Patient / Baby Age"
                      className={inputCls}
                    />
                  </div>
                </div>

                {/* Additional Requirements / Message */}
                <div>
                  <textarea
                    {...form.register("additional_message")}
                    placeholder="Additional Requirements / Message"
                    rows={3}
                    className="w-full rounded-2xl border border-border bg-transparent px-5 py-3.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15 placeholder:text-muted-foreground resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={mut.isPending}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#0A252E] px-4 py-3.5 text-sm font-semibold text-white hover:bg-[#0A252E]/90 transition-colors disabled:opacity-60 mt-2"
                >
                  {mut.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                  Submit Booking Request
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

