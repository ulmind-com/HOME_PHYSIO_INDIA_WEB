import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { api } from "@/lib/api/client";
import {
  PackageSearch,
  ArrowRight,
  Check,
  ChevronDown,
  BedDouble,
  CircleGauge,
  Wind,
  Stethoscope,
  SquareDashedBottom,
  Footprints,
  Phone,
  Timer,
  CheckCircle2,
  Box,
  Truck,
  MessageCircleQuestion,
  Info,
  Layers,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { settingsQ, categoriesQ, equipmentQ } from "@/lib/api/queries";
import { CITIES } from "@/components/forms/BookingForm";
import {
  EquipmentBookingModal,
  EQUIPMENT_OPTIONS,
} from "@/components/forms/EquipmentBookingModal";
import { Section } from "@/components/site/Section";

export const Route = createFileRoute("/medical-equipment")({
  head: () => ({
    meta: [
      { title: "Medical Equipment for Home Care — Nupun Home Health Care Services" },
      {
        name: "description",
        content:
          "Essential medical equipment to support safer, more comfortable and convenient care at home. We arrange hospital beds, oxygen concentrators, wheelchairs, and more.",
      },
      { property: "og:title", content: "Medical Equipment for Home Care — Nupun Home Health Care" },
      {
        property: "og:description",
        content:
          "Essential medical equipment for patients who need support during recovery, elderly care, post-hospitalisation care or long-term home care.",
      },
      { property: "og:url", content: "/medical-equipment" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/medical-equipment" }],
  }),
  component: MedicalEquipmentPage,
});

/* ─────────────────────── Static data ─────────────────────── */

const EQUIPMENT_CHECKLIST = [
  "Essential equipment for home-based patient care",
  "Hospital beds for comfortable patient positioning",
  "Mobility equipment for elderly and recovering patients",
  "Respiratory support equipment",
  "Pressure-relieving support for bedridden patients",
  "Equipment availability confirmation before booking",
  "Home delivery options based on location",
  "Setup assistance for applicable equipment",
];

const WHY_CHOOSE = [
  {
    emoji: "📦",
    title: "Essential Equipment Options",
    description:
      "Access commonly required medical equipment for patients receiving care at home.",
  },
  {
    emoji: "🚚",
    title: "Convenient Home Delivery",
    description:
      "Available equipment can be arranged for delivery to your required location, subject to service availability.",
  },
  {
    emoji: "🧑‍⚕️",
    title: "Requirement-Based Guidance",
    description:
      "Tell us about the patient's requirement and our team can guide you regarding the available equipment options.",
  },
  {
    emoji: "📱",
    title: "Easy Enquiry Process",
    description:
      "Simply tell us which equipment you need, your location and expected duration of use.",
  },
  {
    emoji: "🏡",
    title: "Support for Home Care",
    description:
      "Our medical equipment services can complement nursing care, elderly care, physiotherapy and post-hospitalisation care.",
  },
  {
    emoji: "✅",
    title: "Availability Confirmation",
    description:
      "We confirm equipment availability and applicable charges before proceeding with the booking.",
  },
];

const HOW_IT_WORKS = [
  {
    title: "Tell Us Your Requirement",
    description: "Share the equipment you need, patient requirement and location.",
  },
  {
    title: "Check Availability",
    description: "Our team will confirm availability and provide the applicable charges and terms.",
  },
  {
    title: "Arrange Delivery",
    description: "Once confirmed, the equipment can be arranged for delivery to your location.",
  },
];

const FAQS = [
  {
    id: "e1",
    question: "What medical equipment is available?",
    answer:
      "We can provide equipment such as hospital beds, wheelchairs, oxygen concentrators, BiPAP machines, CPAP machines, suction machines, air mattresses and walkers, subject to availability.",
  },
  {
    id: "e2",
    question: "Can I get a hospital bed for a bedridden patient?",
    answer:
      "Yes. Hospital beds can be arranged for patients receiving home-based care, subject to availability.",
  },
  {
    id: "e3",
    question: "Can I get an oxygen concentrator for home use?",
    answer:
      "Yes. Oxygen concentrators may be available for home use. The patient's oxygen requirement should always be determined by the treating healthcare professional.",
  },
  {
    id: "e4",
    question: "Do you provide wheelchairs for elderly patients?",
    answer:
      "Yes. Wheelchairs can be arranged for elderly patients and people who require mobility support.",
  },
  {
    id: "e5",
    question: "Are BiPAP and CPAP machines available?",
    answer:
      "Yes, these machines may be available depending on stock and requirement. They should be used according to the treating healthcare professional's advice.",
  },
  {
    id: "e6",
    question: "Do you provide an air mattress for bedridden patients?",
    answer:
      "Yes. Pressure-relieving air mattresses may be available for patients who spend extended periods in bed.",
  },
  {
    id: "e7",
    question: "Can medical equipment be delivered to my home?",
    answer:
      "Home delivery can be arranged depending on the equipment, location and availability.",
  },
  {
    id: "e8",
    question: "How can I check the availability of equipment?",
    answer:
      "Contact us by phone or WhatsApp and share the equipment name, location and your requirement. Our team will confirm availability and applicable charges.",
  },
];

/* ─────────────────────── Component ─────────────────────── */

function MedicalEquipmentPage() {
  const { data: settings } = useQuery(settingsQ());
  const phone = settings?.phone?.replace(/[^\d+]/g, "");
  const whatsapp = (settings?.whatsapp ?? settings?.phone)?.replace(/\D/g, "");

  const { data: catData } = useQuery(categoriesQ({ limit: 100 }));
  const category = (catData?.items ?? []).find(
    (c) =>
      c.name.toLowerCase().includes("equipment") ||
      c.slug?.toLowerCase().includes("equipment")
  );

  return (
    <>
      <EquipmentHero phone={phone} category={category} />
      <EquipmentGridSection />
      <EquipmentChecklistSection />
      <EquipmentWhyChooseSection />
      <EquipmentHowItWorksSection />
      <EquipmentCtaBand phone={phone} whatsapp={whatsapp} />
      <EquipmentFaqSection />
      <EquipmentBookingPanel phone={phone} whatsapp={whatsapp} />
      <FinalCtaBand phone={phone} />
    </>
  );
}

/* ─────────────────────── Hero ─────────────────────── */

function EquipmentHero({ phone, category }: { phone?: string; category?: any }) {
  const heroBadge = category?.hero_badge || "Equipment Rentals";
  const heroTitle = category?.hero_title || "Medical Equipment \nfor Home Care";
  const heroDescription = category?.hero_description || "Nupun Home Health Care Services provides essential medical equipment on rent to support patients, elderly people and families during home care and recovery. From hospital beds and wheelchairs to oxygen concentrators, BiPAP/CPAP and suction machines, we help you get the equipment you need with convenient rental options and dependable support.";
  const heroCtaPrimaryText = category?.hero_cta_primary_text || "Check Availability";
  const heroCtaSecondaryText = category?.hero_cta_secondary_text || "Call Now";
  
  const heroImageStr = category?.hero_image
    ? typeof category.hero_image === "string"
      ? category.hero_image
      : category.hero_image.url
    : null;

  const images = category?.hero_images?.length 
    ? category.hero_images.map((img: any) => ({
        desktop: typeof img === "string" ? img : img.url,
        mobile: typeof img === "string" ? img : img.url,
      }))
    : [
        {
          desktop: heroImageStr || "/assets/equipment-hero-21-9-1.png",
          mobile: "/assets/mobile/equipment-hero-9-16-1.png",
        },
        {
          desktop: "/assets/equipment-hero-21-9-2.png",
          mobile: "/assets/mobile/equipment-hero-9-16-2.png",
        },
        {
          desktop: "/assets/equipment-hero-21-9-3.png",
          mobile: "/assets/mobile/equipment-hero-9-16-3.png",
        },
      ];

  if (category?.hero_images_mobile?.length) {
    images.forEach((img: any, i: number) => {
      const mobImg = category.hero_images_mobile[i];
      if (mobImg) {
        img.mobile = typeof mobImg === "string" ? mobImg : mobImg.url;
      }
    });
  }

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
              scale: { duration: 8, ease: "easeOut" },
            }}
            className="absolute inset-0 w-full h-full"
          >
            <picture className="w-full h-full">
              <source media="(min-width: 768px)" srcSet={images[currentIdx].desktop} />
              <img 
                src={images[currentIdx].mobile} 
                alt="Medical Equipment for Home Care" 
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

      <div className="container-x relative z-10 pt-24 pb-12 lg:pt-28 lg:pb-14">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-md px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/90 mb-5">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-400 animate-pulse" />
              {heroBadge}
            </div>

            <h1 className="font-display text-4xl md:text-5xl lg:text-[3.5rem] font-medium text-white leading-[1.08] tracking-tight mb-4 whitespace-pre-line">
              {heroTitle}
            </h1>

            <p className="text-white/70 text-base md:text-lg leading-relaxed max-w-xl mb-6">
              {heroDescription}
            </p>

            <div className="flex flex-col sm:flex-row flex-wrap gap-3">
              <EquipmentBookingModal>
                <button className="inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3.5 sm:py-3 text-[15px] font-semibold shadow-[0_20px_40px_-10px_rgba(0,128,128,0.4)] hover:bg-primary/90 hover:-translate-y-0.5 transition-all duration-300 w-full sm:w-auto">
                  {heroCtaPrimaryText} <ArrowRight className="h-4 w-4" />
                </button>
              </EquipmentBookingModal>
              <a
                href={`tel:${phone || "+918100346590"}`}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 backdrop-blur-md px-6 py-3.5 sm:py-3 text-[15px] font-semibold text-white hover:bg-white/20 transition-all duration-300 w-full sm:w-auto"
              >
                <Phone className="h-4 w-4" /> {heroCtaSecondaryText}
              </a>
            </div>
          </motion.div>

          {/* Right: Glass equipment card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="hidden lg:block"
          >
            <div className="relative rounded-[2rem] border border-white/15 bg-white/8 backdrop-blur-2xl p-6 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)]">
              <div className="absolute -top-6 -right-6 h-20 w-20 rounded-full bg-teal-400/20 blur-3xl" />

              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-teal-400/20 text-teal-300 border border-teal-400/20 mb-4">
                <PackageSearch className="h-6 w-6" strokeWidth={1.5} />
              </div>

              <div className="text-white/50 text-xs uppercase tracking-[0.2em] font-semibold mb-4">
                Available Equipment
              </div>

              <div className="grid grid-cols-2 gap-2 mb-5">
                {[
                  "Hospital Bed",
                  "Oxygen Concentrator",
                  "BiPAP Machine",
                  "Wheelchair",
                  "CPAP Machine",
                  "Suction Machine",
                  "Air Mattress",
                  "Walker",
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-2.5 py-1.5"
                  >
                    <div className="h-1.5 w-1.5 rounded-full bg-teal-400 shrink-0" />
                    <span className="text-white/80 text-xs font-medium">{item}</span>
                  </div>
                ))}
              </div>

              <div className="h-px bg-white/10 mb-4" />
              <p className="text-white/55 text-xs leading-relaxed">
                We confirm equipment availability and applicable charges before proceeding with the booking. Home delivery options are available based on location.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Progress Dots + Navigation (Matches Home Hero) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
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
                    className="absolute inset-0 rounded-full bg-teal-400"
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

/* ─────────────────────── Equipment Grid ─────────────────────── */

function EquipmentGridSection() {
  const { data: equipData } = useQuery(equipmentQ({ limit: 100 }));
  const equipments = equipData?.items ?? [];

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
          Our Medical Equipment
        </div>
        <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground tracking-tight mb-4">
          Our Medical Equipment
        </h2>
        <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto">
          Explore essential equipment designed to support patients and caregivers with comfortable and convenient home-based care.
        </p>
      </motion.div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {equipments.map((item, i) => {
          const imgUrl = typeof item.featured_image === "string" ? item.featured_image : item.featured_image?.url;
          const iconBg = item.specifications?.iconBg || "bg-gray-100";
          const color = item.specifications?.color || "text-gray-600";
          const emoji = item.specifications?.emoji || "📦";

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (i % 4) * 0.07, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="group h-full flex flex-col rounded-2xl bg-white border border-border p-4 sm:p-5 shadow-sm transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.1)] cursor-default">
                {imgUrl ? (
                  <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-rose-50 mb-4 transform transition-transform group-hover:scale-110 duration-300">
                    <img src={imgUrl} alt={item.name} className="w-9 h-9 object-contain mix-blend-multiply" />
                  </div>
                ) : (
                  <div
                    className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center mb-3`}
                  >
                    <span className={`text-xl ${color}`}>{emoji}</span>
                  </div>
                )}
                <h3 className="font-display text-lg sm:text-[21px] font-semibold text-foreground mb-2 sm:mb-3 leading-tight tracking-wide">
                  {item.name}
                </h3>
                <p className="text-muted-foreground text-[15px] sm:text-[17px] leading-relaxed font-medium flex-1">
                  {item.description || item.short_description}
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

function EquipmentChecklistSection() {
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
            <h2 className="font-display text-4xl md:text-5xl text-white tracking-tight leading-tight mb-3">
              Trusted Support
            </h2>
            <h3 className="text-xl md:text-2xl text-white/90 font-medium mb-6">
              Reliable Equipment for Home Care
            </h3>
            <p className="text-white/60 text-lg leading-relaxed">
              Choosing the right equipment can make home care more comfortable and manageable. Nupun helps families identify the equipment they need based on the patient's requirements and available options.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
          >
            {EQUIPMENT_CHECKLIST.map((feat, i) => (
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

function EquipmentWhyChooseSection() {
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
          Why Choose Nupun
        </div>
        <h2 className="font-display text-4xl md:text-5xl tracking-tight text-foreground mb-4">
          Why Choose Nupun for Medical Equipment?
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

/* ─────────────────────── How It Works ─────────────────────── */

function EquipmentHowItWorksSection() {
  return (
    <Section className="py-20 lg:py-28 bg-[#F8F9FA]">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <h2 className="font-display text-4xl md:text-5xl tracking-tight text-foreground mb-4">
          Getting Medical Equipment Is Simple
        </h2>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {HOW_IT_WORKS.map((step, i) => (
          <div key={i} className="relative text-center">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-teal-100 text-teal-600 font-display text-2xl font-bold mb-6 relative z-10 border-4 border-[#F8F9FA]">
              {i + 1}
            </div>
            {i !== HOW_IT_WORKS.length - 1 && (
              <div className="hidden md:block absolute top-8 left-1/2 w-full h-[2px] bg-teal-100 -z-0" />
            )}
            <h3 className="font-display text-xl font-medium text-foreground mb-3">
              {step.title}
            </h3>
            <p className="text-muted-foreground text-[15px] leading-relaxed">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ─────────────────────── CTA Band ─────────────────────── */

function EquipmentCtaBand({ phone, whatsapp }: { phone?: string; whatsapp?: string }) {
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
            Need Medical Equipment at Home?
          </h2>
          <h3 className="text-xl md:text-2xl text-white/90 font-medium mb-6 tracking-wide" style={{ wordSpacing: "0.06em" }}>
            Whether you need a hospital bed for a bedridden patient, a wheelchair for mobility support, an oxygen concentrator or respiratory equipment, Nupun Home Health Care Services can help you arrange the required equipment according to availability.
          </h3>
          <p className="text-white/65 text-lg leading-relaxed max-w-2xl mb-10">
            Tell us what you need and our team will guide you through the available options.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <EquipmentBookingModal>
              <button className="inline-flex items-center justify-center w-full sm:w-auto gap-2 rounded-full bg-cyan-400 text-slate-900 px-8 py-4 text-base font-semibold hover:bg-cyan-300 transition-all duration-300 shadow-[0_15px_35px_-10px_rgba(34,211,238,0.4)]">
                Check Equipment Availability <ArrowRight className="h-5 w-5" />
              </button>
            </EquipmentBookingModal>
            {whatsapp && (
              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center w-full sm:w-auto gap-2 rounded-full border border-white/30 text-white px-8 py-4 text-base font-semibold hover:bg-white/10 transition-all duration-300"
              >
                WhatsApp Us
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────── FAQ ─────────────────────── */

function EquipmentFaqSection() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <Section className="py-20 lg:py-28">
      <div className="grid gap-12 lg:grid-cols-2 items-start max-w-6xl mx-auto">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Common Questions
          </div>
          <h2 className="font-display text-4xl md:text-5xl tracking-tight text-foreground mb-6">
            Frequently Asked{" "}
            <span className="text-primary">Questions</span>
          </h2>
          <div className="flex flex-col gap-3">
            <EquipmentBookingModal>
              <button className="inline-flex items-center justify-center gap-2 rounded-full bg-primary/10 text-teal-600 px-6 py-3 text-sm font-semibold hover:bg-primary hover:text-white transition-colors duration-300 w-fit">
                Enquire Now →
              </button>
            </EquipmentBookingModal>
          </div>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq) => (
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

const formSchema = z.object({
  customer_name: z.string().min(2, "Enter full name"),
  customer_phone: z.string().min(7, "Enter a valid phone number"),
  address: z.string().min(1, "Enter delivery location"),
  equipment_name: z.string().min(1, "Select equipment"),
  duration_days: z.string().optional(),
  message: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

function EquipmentBookingPanel({ phone, whatsapp }: { phone?: string; whatsapp?: string }) {
  const [done, setDone] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customer_name: "",
      customer_phone: "",
      address: "",
      equipment_name: "",
      duration_days: "",
      message: "",
    },
  });

  const mut = useMutation({
    mutationFn: (data: FormValues) => {
      const combinedAddress = `${data.address}. ${
        data.message ? `Requirement: ${data.message}` : ""
      }`;

      let days = 30;
      if (data.duration_days) {
        if (data.duration_days.includes("week")) days = parseInt(data.duration_days) * 7;
        else if (data.duration_days.includes("month")) days = parseInt(data.duration_days) * 30;
      }

      return api.post("/equipment/rentals", {
        equipment_id: `eq_${data.equipment_name.toLowerCase().replace(/\\s+/g, "_")}`,
        equipment_name: data.equipment_name,
        customer_name: data.customer_name,
        customer_phone: data.customer_phone,
        address: combinedAddress,
        start_date: new Date().toISOString().split("T")[0],
        quantity: 1,
        duration_days: days,
      });
    },
    onSuccess: () => {
      setDone(true);
      toast.success("Equipment request received.");
    },
    onError: (err: Error) => toast.error(err.message || "Something went wrong."),
  });

  return (
    <section className="py-20 lg:py-28 bg-[#F8F9FA]" id="booking">
      <div className="container-x max-w-md mx-auto">
        <div className="rounded-2xl border border-border bg-white p-6 md:p-8 shadow-sm">
          {done ? (
            <div className="text-center py-6">
              <h3 className="font-display text-2xl mb-2">Request Received!</h3>
              <p className="text-muted-foreground mb-6">
                Our team will check equipment availability and contact you shortly.
              </p>
              <button
                onClick={() => {
                  setDone(false);
                  form.reset();
                }}
                className="rounded-full border border-border bg-white px-6 py-2.5 text-sm font-medium hover:border-teal-500 transition-colors"
              >
                Request More Equipment
              </button>
            </div>
          ) : (
            <>
              <h3 className="font-display text-2xl md:text-3xl tracking-tight text-foreground mb-2">
                Check Medical Equipment Availability
              </h3>
              <p className="text-muted-foreground text-sm mb-8">
                Tell us what you need and our team will contact you shortly.
              </p>

              <form onSubmit={form.handleSubmit((v) => mut.mutate(v))} className="space-y-4">
                <div>
                  <input
                    {...form.register("customer_name")}
                    placeholder="Full name"
                    className="w-full rounded-full border border-border bg-transparent px-5 py-3.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15 placeholder:text-muted-foreground"
                  />
                  {form.formState.errors.customer_name && (
                    <p className="text-xs text-destructive mt-1.5 pl-1">
                      {form.formState.errors.customer_name.message}
                    </p>
                  )}
                </div>

                <div>
                  <input
                    {...form.register("customer_phone")}
                    placeholder="Phone number"
                    type="tel"
                    className="w-full rounded-full border border-border bg-transparent px-5 py-3.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15 placeholder:text-muted-foreground"
                  />
                  {form.formState.errors.customer_phone && (
                    <p className="text-xs text-destructive mt-1.5 pl-1">
                      {form.formState.errors.customer_phone.message}
                    </p>
                  )}
                </div>

                <div>
                  <div className="relative">
                    <select
                      {...form.register("equipment_name")}
                      className="w-full rounded-full border border-border bg-black/5 px-5 py-3.5 pr-10 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15 text-foreground appearance-none cursor-pointer"
                    >
                      <option value="">Select equipment</option>
                      {EQUIPMENT_OPTIONS.map((e) => (
                        <option key={e} value={e}>
                          {e}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  </div>
                  {form.formState.errors.equipment_name && (
                    <p className="text-xs text-destructive mt-1.5 pl-1">
                      {form.formState.errors.equipment_name.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="relative">
                      <select
                        {...form.register("address")}
                        className="w-full rounded-full border border-border bg-transparent px-5 py-3.5 pr-10 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15 text-foreground appearance-none cursor-pointer"
                      >
                        <option value="">Location</option>
                        {CITIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    </div>
                    {form.formState.errors.address && (
                      <p className="text-xs text-destructive mt-1.5 pl-1">
                        {form.formState.errors.address.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <div className="relative">
                      <select
                        {...form.register("duration_days")}
                        className="w-full rounded-full border border-border bg-transparent px-5 py-3.5 pr-10 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15 text-foreground appearance-none cursor-pointer"
                      >
                        <option value="">Duration</option>
                        {["1 week", "2 weeks", "1 month", "3 months", "Other"].map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div>
                  <textarea
                    {...form.register("message")}
                    placeholder="Patient condition / requirement (optional)"
                    rows={3}
                    className="w-full rounded-2xl border border-border bg-transparent px-5 py-3.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15 placeholder:text-muted-foreground resize-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={mut.isPending}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#0A252E] px-4 py-3.5 text-sm font-semibold text-white hover:bg-[#0A252E]/90 transition-colors disabled:opacity-60"
                  >
                    {mut.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Check Availability"}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

function FinalCtaBand({ phone }: { phone?: string }) {
  return (
    <section className="bg-primary py-16">
      <div className="container-x text-center max-w-3xl mx-auto">
        <h2 className="font-display text-3xl md:text-4xl text-white mb-4">
          Make Home Care More Comfortable
        </h2>
        <p className="text-white/90 text-lg mb-8">
          Get the essential medical equipment you need to support your loved one's care and recovery at home.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <EquipmentBookingModal>
            <button className="inline-flex items-center gap-2 rounded-full bg-slate-900 text-white px-8 py-3.5 text-sm font-semibold hover:bg-slate-800 transition-colors">
              Check Equipment Availability
            </button>
          </EquipmentBookingModal>
          {phone && (
            <a
              href={`tel:${phone}`}
              className="inline-flex items-center gap-2 rounded-full border border-white/40 text-white px-8 py-3.5 text-sm font-semibold hover:bg-white/10 transition-colors"
            >
              Call Now
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
