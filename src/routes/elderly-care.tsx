import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Heart,
  Bed,
  PersonStanding,
  UtensilsCrossed,
  ShieldCheck,
  Clock3,
  Bell,
  Users,
  Star,
  HeartHandshake,
  Phone,
  ArrowRight,
  Check,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";
import { categoriesQ, faqsQ, settingsQ } from "@/lib/api/queries";
import { BookingForm } from "@/components/forms/BookingForm";
import { Section } from "@/components/site/Section";

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
    icon: Heart,
    emoji: "👵",
    title: "Elderly Care",
    description:
      "Compassionate home care and companionship for seniors who need assistance with their daily routine, personal care and comfort.",
    gradient: "from-rose-50 to-pink-50",
    iconColor: "text-rose-500",
    iconBg: "bg-rose-100",
  },
  {
    icon: Bed,
    emoji: "🛏️",
    title: "Bedridden Patient Care",
    description:
      "Support for bedridden seniors with personal hygiene, feeding, position changes, mobility assistance and daily supervision.",
    gradient: "from-blue-50 to-indigo-50",
    iconColor: "text-blue-500",
    iconBg: "bg-blue-100",
  },
  {
    icon: PersonStanding,
    emoji: "🚶",
    title: "Mobility Assistance",
    description:
      "Our attendants assist elderly people with walking, transfers, movement and safe mobility at home to help reduce the risk of falls.",
    gradient: "from-emerald-50 to-teal-50",
    iconColor: "text-emerald-500",
    iconBg: "bg-emerald-100",
  },
  {
    icon: UtensilsCrossed,
    emoji: "🍲",
    title: "Daily Living Support",
    description:
      "Assistance with bathing, grooming, hygiene, meals, feeding and other everyday activities that become difficult for elderly people.",
    gradient: "from-amber-50 to-orange-50",
    iconColor: "text-amber-500",
    iconBg: "bg-amber-100",
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
    title: "Trained Caregivers",
    description:
      "Our attendants are selected and trained to provide dependable assistance to elderly people at home.",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    iconBg: "bg-emerald-100",
  },
  {
    icon: Clock3,
    title: "Flexible Care Options",
    description:
      "Choose care according to your requirement, including hourly, 8-hour, 12-hour and 24-hour support.",
    color: "text-blue-600",
    bg: "bg-blue-50",
    iconBg: "bg-blue-100",
  },
  {
    icon: Bell,
    title: "Medication Support",
    description:
      "Caregivers can provide timely medication reminders according to the family's instructions and prescribed routine.",
    color: "text-violet-600",
    bg: "bg-violet-50",
    iconBg: "bg-violet-100",
  },
  {
    icon: Users,
    title: "Family Updates",
    description:
      "Families can stay informed about the elderly person's daily routine, care and well-being.",
    color: "text-pink-600",
    bg: "bg-pink-50",
    iconBg: "bg-pink-100",
  },
  {
    icon: Heart,
    title: "Personalised Care",
    description:
      "Every senior has different needs. We understand the patient's routine and provide care accordingly.",
    color: "text-rose-600",
    bg: "bg-rose-50",
    iconBg: "bg-rose-100",
  },
  {
    icon: HeartHandshake,
    title: "Safety & Comfort",
    description:
      "Our caregivers focus on safe mobility, hygiene, comfort and respectful assistance at home.",
    color: "text-teal-600",
    bg: "bg-teal-50",
    iconBg: "bg-teal-100",
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

/* ─────────────────────── Component ─────────────────────── */

function ElderlyCarePage() {
  const { data: settings } = useQuery(settingsQ());
  const { data: faqData } = useQuery(faqsQ({ limit: 20 }));
  const { data: catData } = useQuery(categoriesQ({ limit: 100 }));

  const category = (catData?.items ?? []).find(
    (c) =>
      c.name.toLowerCase().includes("elder") ||
      c.slug?.toLowerCase().includes("elder")
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
      f.category?.toLowerCase().includes("elder") ||
      f.category?.toLowerCase().includes("senior") ||
      !f.category
  );
  const displayFaqs = faqs.length > 0 ? faqs.slice(0, 8) : DEFAULT_FAQS;

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <ElderlyHero phone={phone} whatsapp={whatsapp} heroImage={heroImageStr} />

      {/* ── Our Elderly Care Services ─────────────────────── */}
      <ServicesSection />

      {/* ── Trusted Elderly Care Services (Checklist) ─────── */}
      <TrustedSection />

      {/* ── Why Choose Nupun ─────────────────────────────── */}
      <WhyChooseSection />

      {/* ── CTA Band ─────────────────────────────────────── */}
      <CtaBand phone={phone} whatsapp={whatsapp} />

      {/* ── FAQ ──────────────────────────────────────────── */}
      <FaqSection faqs={displayFaqs} />

      {/* ── Booking Panel ────────────────────────────────── */}
      <BookingPanel phone={phone} whatsapp={whatsapp} />
    </>
  );
}

/* ─────────────────────── Hero ─────────────────────── */

function ElderlyHero({
  phone,
  whatsapp,
  heroImage,
}: {
  phone?: string;
  whatsapp?: string;
  heroImage?: string | null;
}) {
  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden">
      {/* Gradient background */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.22 0.04 200) 0%, oklch(0.30 0.06 260) 50%, oklch(0.25 0.05 300) 100%)",
        }}
      />

      {/* Decorative blobs (only if no image) */}
      {!heroImage && (
        <div className="absolute inset-0 -z-10 pointer-events-none" aria-hidden>
          <div className="absolute top-[15%] left-[8%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] opacity-60 animate-pulse" />
          <div className="absolute bottom-[10%] right-[5%] w-[600px] h-[600px] bg-violet-500/15 rounded-full blur-[140px] opacity-50" />
          <div
            className="absolute top-[40%] right-[20%] w-[300px] h-[300px] bg-rose-400/10 rounded-full blur-[100px]"
            style={{ animationDelay: "2s" }}
          />
        </div>
      )}

      {/* Dynamic Hero Image */}
      {heroImage && (
        <>
          <img
            src={heroImage}
            alt="Elderly Care Background"
            className="absolute inset-0 w-full h-full object-cover -z-10"
          />
          <div className="absolute inset-0 bg-black/60 -z-10 mix-blend-multiply" />
        </>
      )}

      {/* Dot grid overlay */}
      <div
        className="absolute inset-0 -z-10 opacity-10"
        style={{
          backgroundImage: "radial-gradient(white 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
        aria-hidden
      />

      <div className="container-x relative z-10 pt-32 pb-20 lg:pt-40">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-md px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/90 mb-8">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              Nupun Home Health Care Services
            </div>

            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.05] tracking-tight mb-6">
              Trusted Elder Care,{" "}
              <em className="not-italic text-primary">Right at Home</em>
            </h1>

            <p className="text-white/75 text-lg md:text-xl leading-relaxed max-w-xl mb-10">
              Nupun Home Health Care Services provides trained and caring
              attendants for elderly people who need support at home. Our
              caregivers assist seniors with personal hygiene, mobility, meals,
              companionship, medication reminders and daily routine activities.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Link
                to="/booking"
                search={{ service: "elderly-care" }}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-base font-semibold text-primary-foreground shadow-[0_20px_40px_-10px_rgba(0,0,0,0.4)] hover:bg-primary/90 hover:-translate-y-0.5 transition-all duration-300"
              >
                Book an Attendant <ArrowRight className="h-5 w-5" />
              </Link>
              {phone && (
                <a
                  href={`tel:${phone}`}
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 backdrop-blur-md px-8 py-4 text-base font-semibold text-white hover:bg-white/20 transition-all duration-300"
                >
                  <Phone className="h-5 w-5" /> Call Now
                </a>
              )}
            </div>

            {/* Trust stats */}
            <div className="mt-12 flex flex-wrap gap-8">
              {[
                { val: "24/7", label: "Care Available" },
                { val: "200+", label: "Verified Attendants" },
                { val: "4 Cities", label: "NCR Coverage" },
              ].map((s) => (
                <div key={s.label}>
                  <div className="text-2xl font-display font-bold text-white">{s.val}</div>
                  <div className="text-sm text-white/60 mt-0.5">{s.label}</div>
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
            <div className="relative rounded-[2.5rem] border border-white/20 bg-white/10 backdrop-blur-2xl p-8 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5)]">
              <div className="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-primary/30 blur-2xl" />

              <div className="text-white/60 text-xs uppercase tracking-[0.2em] font-semibold mb-5">
                Whether your loved one needs
              </div>

              {[
                "Support for a few hours",
                "Daytime care",
                "Overnight assistance",
                "Long-term elderly care",
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 mb-4 last:mb-0"
                >
                  <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary/30 text-primary border border-primary/40">
                    <Check className="h-4 w-4" strokeWidth={3} />
                  </div>
                  <span className="text-white font-medium">{item}</span>
                </div>
              ))}

              <div className="mt-8 h-px bg-white/10" />
              <p className="mt-6 text-white/70 text-sm leading-relaxed">
                Our team provides dependable care according to the individual
                needs of your loved one.
              </p>

              <div className="mt-6 flex items-center gap-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                ))}
                <span className="text-white/70 text-sm ml-1">Trusted by families across NCR</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────── Our Elderly Care Services ─────────────────────── */

function ServicesSection() {
  return (
    <Section className="py-20 lg:py-28">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-2xl mx-auto mb-14"
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-5">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          What We Offer
        </div>
        <h2 className="font-display text-4xl md:text-5xl lg:text-6xl tracking-tight text-foreground mb-4">
          Our Elderly Care Services
        </h2>
        <p className="text-muted-foreground text-lg leading-relaxed">
          We provide reliable elderly care at home to help seniors live safely,
          comfortably and independently with the support they need.
        </p>
      </motion.div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {SERVICES.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <div
                className={`group h-full flex flex-col rounded-[2rem] bg-gradient-to-br ${s.gradient} border border-white p-7 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.14)] cursor-default`}
              >
                <div className={`text-4xl mb-5`}>{s.emoji}</div>
                <div className={`w-12 h-12 rounded-2xl ${s.iconBg} flex items-center justify-center mb-5`}>
                  <Icon className={`h-6 w-6 ${s.iconColor}`} strokeWidth={2} />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                  {s.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground flex-1">
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

/* ─────────────────────── Trusted Section ─────────────────────── */

function TrustedSection() {
  return (
    <section className="relative py-20 lg:py-28 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-0 left-[20%] w-96 h-96 bg-primary/15 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-[10%] w-80 h-80 bg-violet-500/10 rounded-full blur-[80px]" />
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
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Our Commitment
            </div>
            <h2 className="font-display text-4xl md:text-5xl text-white tracking-tight leading-tight mb-6">
              Trusted Elderly Care Services
            </h2>
            <p className="text-white/65 text-lg leading-relaxed">
              At Nupun Home Health Care Services, we understand that caring for
              an elderly family member requires patience, responsibility and
              trust. Our trained attendants provide respectful support while
              maintaining the senior's dignity, comfort and independence.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
          >
            {TRUST_FEATURES.map((feat, i) => (
              <motion.div
                key={feat}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md px-4 py-3"
              >
                <div className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary/30 text-primary">
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
          Why Families Trust Us
        </div>
        <h2 className="font-display text-4xl md:text-5xl tracking-tight text-foreground mb-4">
          Why Choose Nupun Home Health Care Services?
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

/* ─────────────────────── CTA Band ─────────────────────── */

function CtaBand({ phone, whatsapp }: { phone?: string; whatsapp?: string }) {
  return (
    <section className="relative overflow-hidden">
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.35 0.08 160) 0%, oklch(0.28 0.06 220) 100%)",
        }}
      />
      <div className="absolute inset-0 -z-10 opacity-20 pointer-events-none">
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
          <div className="text-[10px] uppercase tracking-[0.28em] text-white/60 mb-5">
            Need Elderly Care at Home?
          </div>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-white tracking-tight leading-[1.1] mb-6">
            If your loved one needs help with daily activities, we're{" "}
            <em className="not-italic text-primary">here to help.</em>
          </h2>
          <p className="text-white/70 text-lg leading-relaxed max-w-2xl mb-10">
            Get a trained caregiver according to your family's requirement and schedule.
            Whether it's a few hours or round-the-clock care — we're ready.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/booking"
              search={{ service: "elderly-care" }}
              className="inline-flex items-center gap-2 rounded-full bg-white text-foreground px-8 py-4 text-base font-semibold hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-[0_15px_35px_-10px_rgba(0,0,0,0.3)]"
            >
              Book Elderly Care <ArrowRight className="h-5 w-5" />
            </Link>
            {phone && (
              <a
                href={`tel:${phone}`}
                className="inline-flex items-center gap-2 rounded-full border border-white/30 text-white px-8 py-4 text-base font-semibold hover:bg-white/10 transition-all duration-300"
              >
                <Phone className="h-5 w-5" /> Request a Callback
              </a>
            )}
            {whatsapp && (
              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
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

function FaqSection({ faqs }: { faqs: { id: string; question: string; answer: string }[] }) {
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
            Have questions about our elderly care services? Find answers to
            common queries below. Still have doubts? Call us anytime.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              to="/booking"
              search={{ service: "elderly-care" }}
              className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-6 py-3 text-sm font-semibold hover:bg-primary hover:text-white transition-colors duration-300 w-fit"
            >
              Book Elderly Care →
            </Link>
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

function BookingPanel({ phone, whatsapp }: { phone?: string; whatsapp?: string }) {
  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container-x">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Left: Info */}
          <div className="lg:col-span-5">
            <div className="sticky top-28">
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-6">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Book Now
              </div>
              <h2 className="font-display text-3xl md:text-4xl tracking-tight text-foreground mb-4">
                Book an Elderly Care Attendant
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Fill in your details and our care team will contact you shortly.
                It takes under two minutes — no payment required to request.
              </p>

              <div className="space-y-4 mb-8">
                {[
                  "Trained and verified attendants",
                  "Flexible hourly to 24/7 care",
                  "Male or female caregiver options",
                  "Serving Faridabad, Delhi, Noida & Gurugram",
                ].map((f) => (
                  <div key={f} className="flex items-center gap-3 text-sm font-medium text-foreground">
                    <div className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary/15 text-primary">
                      <Check className="h-3.5 w-3.5" strokeWidth={3} />
                    </div>
                    {f}
                  </div>
                ))}
              </div>

              {(phone || whatsapp) && (
                <div className="space-y-3">
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-3">
                    Prefer to speak directly?
                  </div>
                  {phone && (
                    <a
                      href={`tel:${phone}`}
                      className="flex items-center gap-3 rounded-2xl border border-border bg-surface px-5 py-3.5 text-sm font-medium hover:border-primary hover:text-primary transition-colors"
                    >
                      <Phone className="h-4 w-4 text-primary" /> Call Now
                    </a>
                  )}
                  {whatsapp && (
                    <a
                      href={`https://wa.me/${whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 rounded-2xl border border-border bg-surface px-5 py-3.5 text-sm font-medium hover:border-primary hover:text-primary transition-colors"
                    >
                      <span className="h-4 w-4 text-primary font-bold text-base">W</span> WhatsApp Us
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right: Booking Form */}
          <div className="lg:col-span-7">
            <BookingForm
              presetServiceName="Elderly Care"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
