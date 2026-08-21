import { createFileRoute, Link } from "@tanstack/react-router";
import { triggerBookingSuccess } from "@/components/site/GlobalBookingSuccess";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Bed,
  PersonStanding,
  UtensilsCrossed,
  CheckCircle2,
  Phone,
  ArrowRight,
  ChevronDown,
  Loader2,
  Clock,
  Pill,
  MessageCircle,
  ShieldCheck,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState, useEffect } from "react";
import { settingsQ, faqsQ, categoriesQ } from "@/lib/api/queries";
import { ElderCareBookingModal } from "@/components/forms/ElderCareBookingModal";
import { Section } from "@/components/site/Section";
import { api } from "@/lib/api/client";

const HERO_IMAGES = [
  "/assets/elderly-hero/1.png",
  "/assets/elderly-hero/2.png",
  "/assets/elderly-hero/3.png",
];

const MOBILE_HERO_IMAGES = [
  "/assets/elderly-hero-mobile/1.png",
  "/assets/elderly-hero-mobile/2.png",
  "/assets/elderly-hero-mobile/3.png",
];

export const Route = createFileRoute("/elderly-care")({
  head: () => ({
    meta: [
      { title: "Elderly Care at Home — Nupun Home Health Care Services" },
      {
        name: "description",
        content:
          "Trained and caring attendants for elderly people. Personal hygiene, mobility, meals, companionship, medication reminders and daily routine support — right at home.",
      },
      { property: "og:title", content: "Elderly Care at Home — Nupun Home Health Care" },
      {
        property: "og:description",
        content:
          "Compassionate home care for seniors — personal hygiene, mobility, meals, companionship and medication reminders.",
      },
      { property: "og:url", content: "/elderly-care" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/elderly-care" }],
  }),
  component: ElderlyCarePage,
});

/* ─────────────────────── Static data ─────────────────────── */

const SERVICES = [
  {
    image: "/assets/services/elderly_care.png",
    title: "Elderly Care",
    description:
      "Compassionate home care and companionship for seniors who need assistance with their daily routine, personal care and comfort.",
  },
  {
    image: "/assets/services/bedridden_care.png",
    title: "Bedridden Patient Care",
    description:
      "Support for bedridden seniors with personal hygiene, feeding, position changes, mobility assistance and daily supervision.",
  },
  {
    image: "/assets/services/mobility_care.png",
    title: "Mobility Assistance",
    description:
      "Our attendants assist elderly people with walking, transfers, movement and safe mobility at home to help reduce the risk of falls.",
  },
  {
    image: "/assets/services/daily_living.png",
    title: "Daily Living Support",
    description:
      "Assistance with bathing, grooming, hygiene, meals, feeding and other everyday activities that become difficult for elderly people.",
  },
];

const TRUST_FEATURES = [
  "Trained and verified attendants",
  "Elderly care at home",
  "Personal hygiene assistance",
  "Mobility and walking support",
  "Meal and feeding assistance",
  "Medication reminders",
  "Companionship and emotional support",
  "Daytime, overnight and long-term care",
  "Regular family updates",
  "Personalised care plans",
];

const WHY_CHOOSE = [
  {
    icon: ShieldCheck,
    emoji: "✅",
    title: "Trained Caregivers",
    desc: "Our attendants are selected and trained to provide dependable assistance to elderly people at home.",
    color: "text-emerald-600",
    iconBg: "bg-emerald-100",
  },
  {
    icon: Clock,
    emoji: "⏰",
    title: "Flexible Care Options",
    desc: "Choose care according to your requirement, including hourly, 8-hour, 12-hour and 24-hour support.",
    color: "text-sky-600",
    iconBg: "bg-sky-100",
  },
  {
    icon: Pill,
    emoji: "💊",
    title: "Medication Support",
    desc: "Caregivers can provide timely medication reminders according to the family's instructions and prescribed routine.",
    color: "text-rose-600",
    iconBg: "bg-rose-100",
  },
  {
    icon: MessageCircle,
    emoji: "💬",
    title: "Family Updates",
    desc: "Families can stay informed about the elderly person's daily routine, care and well-being.",
    color: "text-amber-600",
    iconBg: "bg-amber-100",
  },
  {
    icon: Heart,
    emoji: "💖",
    title: "Personalised Care",
    desc: "Every senior has different needs. We understand the patient's routine and provide care accordingly.",
    color: "text-pink-600",
    iconBg: "bg-pink-100",
  },
  {
    icon: CheckCircle2,
    emoji: "🛡️",
    title: "Safety & Comfort",
    desc: "Our caregivers focus on safe mobility, hygiene, comfort and respectful assistance at home.",
    color: "text-indigo-600",
    iconBg: "bg-indigo-100",
  },
];

const DEFAULT_FAQS = [
  {
    id: "1",
    question: "What is elderly care at home?",
    answer:
      "Elderly care at home provides assistance to senior citizens with daily activities such as personal hygiene, bathing, meals, mobility, companionship and medication reminders.",
  },
  {
    id: "2",
    question: "Who can benefit from elderly care services?",
    answer:
      "Elderly people who need help with daily activities, mobility, personal care, companionship or routine support can benefit from home elderly care.",
  },
  {
    id: "3",
    question: "Can I book elderly care for a few hours?",
    answer:
      "Yes. Care can be arranged according to your requirement, including hourly, daytime, overnight, 12-hour and 24-hour support.",
  },
  {
    id: "4",
    question: "Do you provide care for bedridden elderly patients?",
    answer:
      "Yes. Our attendants can assist bedridden patients with hygiene, feeding, position changes, diaper care, mobility assistance and routine support.",
  },
  {
    id: "5",
    question: "Can the caregiver remind the patient about medicines?",
    answer:
      "Yes. Caregivers can provide medication reminders according to the schedule provided by the family or treating doctor.",
  },
  {
    id: "6",
    question: "Can I get a male or female caregiver?",
    answer:
      "Yes, depending on availability and the patient's requirements, we can arrange a suitable male or female caregiver.",
  },
  {
    id: "7",
    question: "Do you provide long-term elderly care?",
    answer:
      "Yes. Long-term care arrangements can be made according to the patient's needs and family's preferred duty hours.",
  },
  {
    id: "8",
    question: "How can I book an elderly caregiver?",
    answer:
      "You can contact Nupun Home Health Care Services by phone or WhatsApp. Share the patient's age, condition, location and required duty hours, and our team will guide you regarding the suitable care option.",
  },
];

/* ─────────────────────── Components ─────────────────────── */

function ElderlyCarePage() {
  const { data: settings } = useQuery(settingsQ());
  const { data: faqData } = useQuery(faqsQ({ limit: 20 }));

  const { data: catData } = useQuery(categoriesQ({ limit: 100 }));
  const category = (catData?.items ?? []).find(
    (c) =>
      c.name.toLowerCase().includes("elder") ||
      c.name.toLowerCase().includes("senior") ||
      c.slug?.toLowerCase().includes("elder")
  );

  const phone = settings?.phone?.replace(/[^\d+]/g, "");
  const whatsapp = (settings?.whatsapp ?? settings?.phone)?.replace(/\D/g, "");

  const faqs = (faqData?.items ?? []).filter(
    (f) =>
      f.category?.toLowerCase().includes("elder") ||
      f.category?.toLowerCase().includes("senior")
  );

  // Hardcoded FAQs always stay; API FAQs are appended (deduplicated by question)
  const hardcodedQuestions = new Set(DEFAULT_FAQS.map((f) => f.question.toLowerCase()));
  const apiFaqs = faqs.filter((f) => !hardcodedQuestions.has(f.question.toLowerCase()));
  const displayFaqs = [...DEFAULT_FAQS, ...apiFaqs];

  return (
    <>
      <ElderlyHero phone={phone} whatsapp={whatsapp} category={category} />
      <ElderlyServices />
      <TrustedFeatures />
      <WhyChooseUs />
      <ElderlyCtaBand phone={phone} whatsapp={whatsapp} />
      <ElderlyFaq faqs={displayFaqs} />
      <ElderlyInlineForm />
    </>
  );
}

/* ─────────────────────── Hero ─────────────────────── */

function ElderlyHero({ phone, whatsapp, category }: { phone?: string; whatsapp?: string; category?: any }) {
  const [currentIdx, setCurrentIdx] = useState(0);

  const heroBadge = category?.hero_badge || "Elderly Care Services";
  const heroTitle = category?.hero_title || "Trusted Elderly Care \nRight at Home";
  const heroDescription = category?.hero_description || "Nupun Home Health Care Services, we provide caring and personalised support for seniors with their daily needs. Our trained attendants assist with personal care, mobility, meals, companionship and medication reminders, helping elderly people stay comfortable, safe and independent at home.";
  const heroCtaPrimaryText = category?.hero_cta_primary_text || "Book an Attendant";
  const heroCtaSecondaryText = category?.hero_cta_secondary_text || "Call Now";
  const heroStats = category?.hero_stats?.length ? category.hero_stats : [
    { val: "250+", label: "Caregivers" },
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
        heroImageStr || HERO_IMAGES[0],
        HERO_IMAGES[1],
        HERO_IMAGES[2],
      ];

  const mobileImages = category?.hero_images_mobile?.length
    ? category.hero_images_mobile.map((img: any) => typeof img === "string" ? img : img.url)
    : MOBILE_HERO_IMAGES;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % images.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

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
                alt="Trusted Elderly Care" 
                className="w-full h-full object-cover object-[center_30%]"
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
        {Array.from({ length: 6 }).map((_: any, i: number) => (
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
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-12 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-md px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/90 mb-5">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              {heroBadge}
            </div>

            <h1 
              className="font-display font-medium text-white tracking-tight leading-[1.1] text-[40px] sm:text-[48px] md:text-[56px] lg:text-[64px] mb-4 whitespace-pre-line"
              style={{ textShadow: "0 4px 40px rgba(0,0,0,0.5)" }}
            >
              {heroTitle}
            </h1>

            <p className="text-white/70 text-base md:text-lg leading-relaxed max-w-xl mb-6">
              {heroDescription}
            </p>

            <div className="mt-6 md:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <ElderCareBookingModal>
                <button
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-3.5 text-[15px] font-semibold text-primary-foreground shadow-sm transition-all duration-300 hover:brightness-110 hover:-translate-y-0.5"
                >
                  {heroCtaPrimaryText}
                  <ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              </ElderCareBookingModal>

              <a
                href={phone ? `tel:${phone}` : "tel:+918981289812"}
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
              <div className="absolute -top-6 -right-6 h-20 w-20 rounded-full bg-primary/20 blur-3xl" />

              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/20 text-teal-300 border border-primary/20 mb-4">
                <Heart className="h-6 w-6" strokeWidth={1.5} />
              </div>

              <div className="text-white/50 text-xs uppercase tracking-[0.2em] font-semibold mb-4">
                Compassionate Care
              </div>

              <div className="grid grid-cols-2 gap-2 mb-5">
                {[
                  "Personal Hygiene",
                  "Mobility Support",
                  "Companionship",
                  "Medication Reminder",
                  "Feeding Assistance",
                  "Routine Checking",
                  "24/7 Support",
                  "Trained Attendants",
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-2.5 py-1.5"
                  >
                    <div className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                    <span className="text-white/80 text-xs font-medium">{item}</span>
                  </div>
                ))}
              </div>

              <div className="h-px bg-white/10 mb-4" />
              <p className="text-white/55 text-xs leading-relaxed">
                We provide reliable elderly care at home to help seniors live safely, comfortably and independently with the support they need.
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
          {/* Arrow Nav */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentIdx(((currentIdx - 1) % images.length + images.length) % images.length)}
              className="grid h-12 w-12 place-items-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition-all hover:bg-white/20 hover:border-white/40"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => setCurrentIdx((currentIdx + 1) % images.length)}
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
                onClick={() => setCurrentIdx(i)}
                className="group relative h-1.5 overflow-hidden rounded-full transition-all duration-500"
                style={{ width: i === currentIdx ? 48 : 20 }}
                aria-label={`Go to slide ${i + 1}`}
              >
                <span className="absolute inset-0 rounded-full bg-white/30" />
                {i === currentIdx && (
                  <motion.span
                    className="absolute inset-0 rounded-full bg-primary"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 6, ease: "linear" }}
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

/* ─────────────────────── Services ─────────────────────── */

function ElderlyServices() {
  return (
    <Section className="bg-[#F8F9FA] py-20 lg:py-28">
      <div className="container-x mb-16 max-w-2xl text-center mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-5">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Our Services
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-semibold text-foreground tracking-tight leading-[1.1] mb-6">
            Our Elderly Care Services
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            We provide reliable elderly care at home to help seniors live safely, comfortably and independently with the support they need.
          </p>
        </motion.div>
      </div>

      <div className="container-x">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((s, i) => {
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="group h-full flex flex-col rounded-3xl bg-white border border-border overflow-hidden shadow-sm transition-all duration-400 hover:-translate-y-1.5 hover:shadow-xl"
              >
                <div className="aspect-[4/3] w-full bg-slate-50 relative overflow-hidden flex items-center justify-center p-4">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />
                  <img
                    src={s.image}
                    alt={s.title}
                    className="w-full h-full object-contain mix-blend-multiply filter transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2 leading-tight tracking-wide">
                    {s.title}
                  </h3>
                  <p className="text-muted-foreground text-base leading-relaxed flex-1">
                    {s.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}

/* ─────────────────────── Trusted Features ─────────────────────── */

function TrustedFeatures() {
  return (
    <section className="relative py-20 lg:py-28 overflow-hidden bg-gradient-to-br from-[#0c1c20] to-[#0a1818]">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-teal-600/10 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="container-x relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-md px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-white/70 mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Trusted Care
            </div>
            
            <h2 className="font-display text-3xl md:text-5xl font-semibold text-white tracking-tight leading-[1.1] mb-6">
              Trusted Elderly Care Services
            </h2>
            <p className="text-white/70 text-lg leading-relaxed mb-6">
              At Nupun Home Health Care Services, we understand that caring for an elderly family member requires patience, responsibility and trust.
            </p>
            <p className="text-white/70 text-lg leading-relaxed mb-10">
              Our trained attendants provide respectful support while maintaining the senior's dignity, comfort and independence.
            </p>
            
            <div className="grid sm:grid-cols-2 gap-x-6 gap-y-4">
              {TRUST_FEATURES.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="mt-1 flex-shrink-0 grid h-5 w-5 place-items-center rounded-full bg-primary/20 text-teal-300">
                    <CheckCircle2 className="h-3 w-3" />
                  </div>
                  <span className="text-white/80 text-[15px] leading-snug">{feature}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-[2rem] overflow-hidden border border-white/10 relative shadow-2xl">
              <img 
                src="/assets/services/nurse-elder.jpg" 
                alt="Elderly Care" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c1c20] via-transparent to-transparent" />
            </div>
            
            {/* Floating badge */}
            <div className="absolute -bottom-4 -left-2 sm:-left-4 md:-bottom-8 md:-left-8 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-4 md:p-5 shadow-2xl">
              <div className="flex items-center gap-4">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/20 text-teal-300">
                  <Heart className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white leading-none mb-1">100%</div>
                  <div className="text-sm font-medium text-white/70">Verified Caregivers</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────── Why Choose Us ─────────────────────── */

function WhyChooseUs() {
  return (
    <Section className="py-20 lg:py-28">
      <div className="container-x text-center max-w-2xl mx-auto mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-5">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Why Choose Us
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-semibold text-foreground tracking-tight leading-[1.1]">
            Why Choose Nupun Home Health Care Services?
          </h2>
        </motion.div>
      </div>

      <div className="container-x">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {WHY_CHOOSE.map((item, i) => {
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="group h-full flex flex-col items-start text-left rounded-[1.75rem] bg-white border border-black/5 p-8 shadow-sm transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)] cursor-default">
                  <div
                    className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-rose-50 mb-6"
                  >
                    <span className="text-3xl leading-none">{item.emoji}</span>
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground mb-3 tracking-wide">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground text-base leading-relaxed font-medium">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}

/* ─────────────────────── CTA Band ─────────────────────── */

function ElderlyCtaBand({ phone, whatsapp }: { phone?: string; whatsapp?: string }) {
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
            Need Elderly Care at Home?
          </h2>
          <h3 className="text-xl md:text-2xl text-white/90 font-medium mb-6 tracking-wide" style={{ wordSpacing: "0.06em" }}>
            If your loved one needs help with daily activities or personal care,{" "}
            <em className="not-italic text-white">we can help.</em>
          </h3>
          <p className="text-white/65 text-lg leading-relaxed max-w-2xl mb-10">
            Get a trained caregiver according to your family's requirement and schedule. Our team will guide you regarding the best available options.
          </p>
          <div className="flex flex-wrap gap-4">
            <ElderCareBookingModal>
              <button
                className="inline-flex items-center gap-2 rounded-full bg-cyan-400 text-slate-900 px-8 py-4 text-base font-semibold hover:bg-cyan-300 transition-all duration-300 shadow-[0_15px_35px_-10px_rgba(34,211,238,0.4)]"
              >
                Book Elderly Care <ArrowRight className="h-5 w-5" />
              </button>
            </ElderCareBookingModal>
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

function ElderlyFaq({ faqs }: { faqs: any[] }) {
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id || null);

  if (!faqs.length) return null;

  return (
    <Section className="bg-[#F8F9FA] py-20 lg:py-28" id="faq">
      <div className="container-x max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            FAQ
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-semibold text-foreground tracking-tight leading-[1.1]">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className="rounded-2xl border border-border bg-white overflow-hidden shadow-sm transition-shadow hover:shadow-md"
              >
                <button
                  onClick={() => setOpenId(isOpen ? null : faq.id)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <span className="font-display text-lg font-semibold text-foreground pr-8">
                    {faq.question}
                  </span>
                  <div
                    className={`shrink-0 h-8 w-8 rounded-full border border-border grid place-items-center transition-transform duration-300 ${
                      isOpen ? "rotate-180 bg-primary/5 border-primary/20 text-primary" : "text-muted-foreground"
                    }`}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 pt-2 text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}

/* ─────────────────────── Inline Form ─────────────────────── */

function ElderlyInlineForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const data = {
      full_name: formData.get("fullName") as string,
      phone_number: formData.get("phone") as string,
      city: formData.get("city") as string,
      service_type: formData.get("service") as string,
      patient_condition: formData.get("patient_condition") as string,
    };

    try {
      await api.post("/elder-care", data);
      setIsSuccess(true);
      triggerBookingSuccess();
      (e.target as HTMLFormElement).reset();
      setTimeout(() => setIsSuccess(false), 4000);
    } catch (error) {
      console.error("Booking failed:", error);
      alert("Failed to submit request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Section className="py-20 lg:py-28 bg-[#F8F9FA]" id="book">
      <div className="container-x max-w-md mx-auto">
        <div className="rounded-2xl border border-border bg-white p-6 md:p-8 shadow-sm">
          {isSuccess ? (
            <div className="py-16 text-center">
              <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h3 className="font-display text-2xl mb-2">Request Submitted!</h3>
              <p className="text-muted-foreground mb-6">We will contact you shortly.</p>
              <button
                onClick={() => setIsSuccess(false)}
                className="rounded-full border border-border bg-white px-6 py-2.5 text-sm font-medium hover:border-primary transition-colors"
              >
                Book Another
              </button>
            </div>
          ) : (
            <>
              <h3 className="font-display text-2xl md:text-3xl tracking-tight text-foreground mb-2">
                Book an Attendant
              </h3>
              <p className="text-muted-foreground text-sm mb-8">
                Fill in your details and our care team will contact you shortly.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    name="fullName"
                    required
                    placeholder="Full name"
                    className="w-full rounded-full border border-border bg-transparent px-5 py-3.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15 placeholder:text-muted-foreground"
                  />
                </div>

                <div>
                  <input
                    name="phone"
                    required
                    type="tel"
                    placeholder="Phone number"
                    className="w-full rounded-full border border-border bg-transparent px-5 py-3.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15 placeholder:text-muted-foreground"
                  />
                </div>

                <div>
                  <div className="relative">
                    <select
                      name="city"
                      required
                      className="w-full rounded-full border border-border bg-transparent px-5 py-3.5 pr-10 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15 text-foreground appearance-none"
                    >
                      <option value="">Select city</option>
                      <option value="Faridabad">Faridabad</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Noida">Noida</option>
                      <option value="Gurugram">Gurugram</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>

                <div>
                  <div className="relative">
                    <select
                      name="service"
                      required
                      className="w-full rounded-full border border-border bg-black/5 px-5 py-3.5 pr-10 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15 text-foreground appearance-none"
                    >
                      <option value="">Select service</option>
                      <option value="Elderly care">Elderly care</option>
                      <option value="Patient care">Patient care</option>
                      <option value="Bedridden Care">Bedridden Care</option>
                      <option value="24 Hours attendant">24 Hours attendant</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>

                <div>
                  <textarea
                    name="patient_condition"
                    placeholder="Patient condition / requirement (optional)"
                    rows={3}
                    className="w-full rounded-2xl border border-border bg-transparent px-5 py-3.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15 placeholder:text-muted-foreground resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#0A252E] px-4 py-3.5 text-sm font-semibold text-white hover:bg-[#0A252E]/90 transition-colors disabled:opacity-60 mt-2"
                >
                  {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  Submit Request
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </Section>
  );
}
