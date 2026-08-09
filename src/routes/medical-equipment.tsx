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
} from "lucide-react";
import { useState, useEffect } from "react";
import { settingsQ } from "@/lib/api/queries";
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

const EQUIPMENT_CARDS = [
  {
    icon: BedDouble,
    image: "/assets/equip_hospital_bed.png",
    emoji: "🛏️",
    title: "Hospital Bed on Rent",
    description:
      "Adjustable hospital beds designed to provide comfortable positioning and easier patient care at home.",
    color: "text-blue-600",
    bg: "from-blue-50 to-sky-50",
    iconBg: "bg-blue-100",
  },
  {
    icon: CircleGauge,
    image: "/assets/equip_wheelchair.png",
    emoji: "🦼",
    title: "Wheelchair on Rent",
    description:
      "Mobility support for elderly patients, patients recovering from illness or surgery and people with limited mobility.",
    color: "text-violet-600",
    bg: "from-violet-50 to-purple-50",
    iconBg: "bg-violet-100",
  },
  {
    icon: Wind,
    image: "/assets/equip_oxygen_concentrator.png",
    emoji: "💨",
    title: "Oxygen Concentrator on Rent",
    description:
      "Oxygen concentrator support for patients who have been prescribed supplemental oxygen for use at home.",
    color: "text-cyan-600",
    bg: "from-cyan-50 to-teal-50",
    iconBg: "bg-cyan-100",
  },
  {
    icon: Stethoscope,
    image: "/assets/equip_bipap_machine.png",
    emoji: "🩺",
    title: "BiPAP Machine on Rent",
    description:
      "Respiratory support equipment for patients who have been prescribed BiPAP therapy by their healthcare professional.",
    color: "text-rose-600",
    bg: "from-rose-50 to-pink-50",
    iconBg: "bg-rose-100",
  },
  {
    icon: Wind,
    image: "/assets/equip_cpap_machine.png",
    emoji: "🫁",
    title: "CPAP Machine on Rent",
    description:
      "CPAP equipment for patients who have been prescribed continuous positive airway pressure therapy.",
    color: "text-teal-600",
    bg: "from-teal-50 to-yellow-50",
    iconBg: "bg-teal-100",
  },
  {
    icon: Box,
    image: "/assets/equip_suction_machine.png",
    emoji: "💧",
    title: "Suction Machine on Rent",
    description:
      "Medical suction equipment to assist patients who require secretion-management support at home.",
    color: "text-emerald-600",
    bg: "from-emerald-50 to-green-50",
    iconBg: "bg-emerald-100",
  },
  {
    icon: SquareDashedBottom,
    image: "/assets/equip_air_mattress.png",
    emoji: "🛌",
    title: "Air Mattress on Rent",
    description:
      "Pressure-relieving mattress support for patients who spend extended periods in bed and require additional comfort and pressure management.",
    color: "text-indigo-600",
    bg: "from-indigo-50 to-blue-50",
    iconBg: "bg-indigo-100",
  },
  {
    icon: Footprints,
    emoji: "🩼",
    title: "Walker on Rent",
    description:
      "Walking support for elderly patients and people recovering from surgery, injury or mobility-related conditions.",
    color: "text-teal-600",
    bg: "from-teal-50 to-emerald-50",
    iconBg: "bg-teal-100",
  },
];

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
    icon: Box,
    title: "Essential Equipment Options",
    description:
      "Access commonly required medical equipment for patients receiving care at home.",
    color: "text-blue-600",
    bg: "bg-blue-50",
    iconBg: "bg-blue-100",
  },
  {
    icon: Truck,
    title: "Convenient Home Delivery",
    description:
      "Available equipment can be arranged for delivery to your required location, subject to service availability.",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    iconBg: "bg-emerald-100",
  },
  {
    icon: MessageCircleQuestion,
    title: "Requirement-Based Guidance",
    description:
      "Tell us about the patient's requirement and our team can guide you regarding the available equipment options.",
    color: "text-teal-600",
    bg: "bg-teal-50",
    iconBg: "bg-teal-100",
  },
  {
    icon: Info,
    title: "Easy Enquiry Process",
    description:
      "Simply tell us which equipment you need, your location and expected duration of use.",
    color: "text-violet-600",
    bg: "bg-violet-50",
    iconBg: "bg-violet-100",
  },
  {
    icon: Layers,
    title: "Support for Home Care",
    description:
      "Our medical equipment services can complement nursing care, elderly care, physiotherapy and post-hospitalisation care.",
    color: "text-cyan-600",
    bg: "bg-cyan-50",
    iconBg: "bg-cyan-100",
  },
  {
    icon: CheckCircle2,
    title: "Availability Confirmation",
    description:
      "We confirm equipment availability and applicable charges before proceeding with the booking.",
    color: "text-rose-600",
    bg: "bg-rose-50",
    iconBg: "bg-rose-100",
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

  return (
    <>
      <EquipmentHero phone={phone} />
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

function EquipmentHero({ phone }: { phone?: string }) {
  const images = [
    "/assets/equipment-hero-21-9-1.png",
    "/assets/equipment-hero-21-9-2.png",
    "/assets/equipment-hero-21-9-3.png",
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
            alt="Medical Equipment at Home"
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
              Equipment Rentals
            </div>

            <h1 className="font-display text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-white leading-[1.08] tracking-tight mb-4">
              Medical Equipment <br />
              for Home Care
            </h1>

            <div className="text-white/80 font-medium text-lg md:text-xl mb-4">
              Essential medical equipment to support safer, more comfortable and convenient care at home.
            </div>

            <p className="text-white/70 text-base md:text-lg leading-relaxed max-w-xl mb-6">
              Nupun Home Health Care Services provides essential medical equipment for patients who need support during recovery, elderly care, post-hospitalisation care or long-term home care.
              We help families arrange suitable equipment for patient comfort, mobility, respiratory support and everyday care needs.
            </p>

            <div className="flex flex-wrap gap-3">
              <EquipmentBookingModal>
                <button className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3 text-sm font-semibold shadow-[0_20px_40px_-10px_rgba(0,128,128,0.4)] hover:bg-primary/90 hover:-translate-y-0.5 transition-all duration-300">
                  Check Equipment Availability <ArrowRight className="h-4 w-4" />
                </button>
              </EquipmentBookingModal>
              {phone && (
                <a
                  href={`tel:${phone}`}
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 backdrop-blur-md px-6 py-3 text-sm font-semibold text-white hover:bg-white/20 transition-all duration-300"
                >
                  <Phone className="h-4 w-4" /> Call Now
                </a>
              )}
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
      </div>
    </section>
  );
}

/* ─────────────────────── Equipment Grid ─────────────────────── */

function EquipmentGridSection() {
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
        <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground tracking-tight leading-[1.1] mb-6">
          Medical Equipment Rental Services
        </h2>
        <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto">
          Nupun Home Health Care Services provides essential medical equipment on rent for patients who need comfortable and convenient care at home. Whether you need equipment for a few days, weeks or longer-term use, we help you arrange suitable equipment according to your requirement and availability.
        </p>
      </motion.div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {EQUIPMENT_CARDS.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (i % 4) * 0.07, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="group h-full flex flex-col rounded-2xl bg-white border border-border p-5 shadow-sm transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.1)] cursor-default">
                {s.image ? (
                  <div className="w-16 h-16 mb-4 relative -ml-1 mix-blend-multiply">
                    <img src={s.image} alt={s.title} className="w-full h-full object-contain" />
                  </div>
                ) : (
                  <div
                    className={`w-10 h-10 rounded-xl ${s.iconBg} flex items-center justify-center mb-3`}
                  >
                    <Icon className={`h-5 w-5 ${s.color}`} strokeWidth={2} />
                  </div>
                )}
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

function EquipmentChecklistSection() {
  return (
    <section className="relative py-20 lg:py-28 overflow-hidden bg-gradient-to-br from-slate-900 to-[#1c1209]">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-0 right-[20%] w-80 h-80 bg-primary/15 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-[10%] w-64 h-64 bg-cyan-600/10 rounded-full blur-[80px]" />
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
              <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
              Trusted Support
            </div>
            <h2 className="font-display text-4xl md:text-5xl text-white tracking-tight leading-tight mb-6">
              Reliable Equipment for Home Care
            </h2>
            <p className="text-white/60 text-lg leading-relaxed">
              Choosing the right equipment can make home care more comfortable and manageable. Nupun helps families identify the equipment they need based on the patient's requirements and available options.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="grid grid-cols-1 gap-3"
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
                <div className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-teal-400/25 text-teal-300">
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
          const Icon = item.icon;
          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
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
            <h3 className="font-display text-xl font-bold text-foreground mb-3">
              {step.title}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
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
            "linear-gradient(135deg, #1c1209 0%, #2a1a0f 100%)",
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
            Need Medical Equipment?
          </div>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-white tracking-tight leading-[1.1] mb-6">
            Need Medical Equipment at Home?
          </h2>
          <p className="text-white/65 text-lg leading-relaxed max-w-2xl mb-10">
            Whether you need a hospital bed for a bedridden patient, a wheelchair for mobility support, an oxygen concentrator or respiratory equipment, Nupun Home Health Care Services can help you arrange the required equipment according to availability.
            <br/><br/>
            Tell us what you need and our team will guide you through the available options.
          </p>
          <div className="flex flex-wrap gap-4">
            <EquipmentBookingModal>
              <button className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-8 py-4 text-base font-semibold hover:bg-primary/90 transition-all duration-300 shadow-[0_15px_35px_-10px_rgba(0,128,128,0.4)]">
                Check Equipment Availability <ArrowRight className="h-5 w-5" />
              </button>
            </EquipmentBookingModal>
            {whatsapp && (
              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 text-white px-8 py-4 text-base font-semibold hover:bg-white/10 transition-all duration-300"
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
                    placeholder="Full Name"
                    className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/15"
                  />
                  {form.formState.errors.customer_name && (
                    <p className="text-xs text-destructive mt-1">
                      {form.formState.errors.customer_name.message}
                    </p>
                  )}
                </div>

                <div>
                  <input
                    {...form.register("customer_phone")}
                    placeholder="Phone Number"
                    className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/15"
                  />
                  {form.formState.errors.customer_phone && (
                    <p className="text-xs text-destructive mt-1">
                      {form.formState.errors.customer_phone.message}
                    </p>
                  )}
                </div>

                <div>
                  <select
                    {...form.register("equipment_name")}
                    className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/15 text-muted-foreground focus:text-foreground"
                  >
                    <option value="">Select Equipment</option>
                    {EQUIPMENT_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  {form.formState.errors.equipment_name && (
                    <p className="text-xs text-destructive mt-1">
                      {form.formState.errors.equipment_name.message}
                    </p>
                  )}
                </div>

                <div>
                  <select
                    {...form.register("duration_days")}
                    className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/15 text-muted-foreground focus:text-foreground"
                  >
                    <option value="">Required Duration</option>
                    {["1 week", "2 weeks", "1 month", "3 months", "Other"].map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <input
                    {...form.register("address")}
                    placeholder="Delivery Location"
                    className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/15"
                  />
                  {form.formState.errors.address && (
                    <p className="text-xs text-destructive mt-1">
                      {form.formState.errors.address.message}
                    </p>
                  )}
                </div>

                <div>
                  <textarea
                    {...form.register("message")}
                    placeholder="Patient Requirement / Additional Details"
                    rows={3}
                    className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/15 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={mut.isPending}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-foreground px-4 py-3.5 text-sm font-semibold text-background hover:bg-accent transition-colors disabled:opacity-60 mt-2"
                >
                  {mut.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                  Check Availability
                </button>
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
        <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
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
