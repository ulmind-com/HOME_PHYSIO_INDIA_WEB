import { createFileRoute } from "@tanstack/react-router";
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
  Clock,
  Pill,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";
import { useState, useEffect } from "react";
import { settingsQ, faqsQ } from "@/lib/api/queries";
import { ElderCareBookingModal } from "@/components/forms/ElderCareBookingModal";
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
    title: "Trained Caregivers",
    desc: "Our attendants are selected and trained to provide dependable assistance to elderly people at home.",
  },
  {
    icon: Clock,
    title: "Flexible Care Options",
    desc: "Choose care according to your requirement, including hourly, 8-hour, 12-hour and 24-hour support.",
  },
  {
    icon: Pill,
    title: "Medication Support",
    desc: "Caregivers can provide timely medication reminders according to the family's instructions and prescribed routine.",
  },
  {
    icon: MessageCircle,
    title: "Family Updates",
    desc: "Families can stay informed about the elderly person's daily routine, care and well-being.",
  },
  {
    icon: Heart,
    title: "Personalised Care",
    desc: "Every senior has different needs. We understand the patient's routine and provide care accordingly.",
  },
  {
    icon: CheckCircle2,
    title: "Safety & Comfort",
    desc: "Our caregivers focus on safe mobility, hygiene, comfort and respectful assistance at home.",
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
      <ElderlyHero phone={phone} whatsapp={whatsapp} />
      <ElderlyServices />
      <TrustedFeatures />
      <WhyChooseUs />
      <ElderlyCtaBand phone={phone} whatsapp={whatsapp} />
      <ElderlyFaq faqs={displayFaqs} />
      <ElderlyInlineForm />
      <ElderlyFooter phone={phone} whatsapp={whatsapp} />
    </>
  );
}

/* ─────────────────────── Hero ─────────────────────── */

function ElderlyHero({ phone, whatsapp }: { phone?: string; whatsapp?: string }) {
  const images = ["/assets/services/nurse-elder.jpg"];
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % images.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <section className="relative min-h-[100svh] lg:min-h-svh flex items-center overflow-hidden">
      {/* Hero background image slider */}
      <div className="absolute inset-0 -z-20 w-full h-full bg-[#051114]">
        <AnimatePresence>
          <motion.img
            key={currentIdx}
            src={images[currentIdx]}
            alt="Trusted Elder Care"
            initial={{ opacity: 0, scale: 1.15 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              opacity: { duration: 1.8, ease: "easeInOut" },
              scale: { duration: 10, ease: "linear" },
            }}
            className="w-full h-full object-cover object-[center_30%]"
          />
        </AnimatePresence>
      </div>

      {/* Overlays */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/95 via-black/70 to-black/30" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

      <div className="container-x relative z-10 pt-32 pb-20">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-md px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/90 mb-5">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              Elderly Care Services
            </div>

            <h1 className="font-display text-4xl md:text-5xl lg:text-[4rem] font-bold text-white leading-[1.08] tracking-tight mb-6">
              Trusted Elder Care, <br />
              <span className="text-teal-400">Right at Home</span>
            </h1>

            <p className="text-white/80 text-base md:text-lg leading-relaxed max-w-xl mb-6">
              Nupun Home Health Care Services provides trained and caring attendants for elderly people who need support at home. Our caregivers assist seniors with personal hygiene, mobility, meals, companionship, medication reminders and daily routine activities.
            </p>
            <p className="text-white/70 text-base md:text-lg leading-relaxed max-w-xl mb-8">
              Whether your loved one needs support for a few hours, daytime care, overnight assistance or long-term elderly care, our team provides dependable care according to their individual needs.
            </p>

            <div className="flex flex-wrap gap-3">
              <ElderCareBookingModal>
                <button className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3.5 text-sm font-semibold shadow-[0_20px_40px_-10px_rgba(0,128,128,0.4)] hover:bg-primary/90 hover:-translate-y-0.5 transition-all duration-300">
                  Book an Attendant <ArrowRight className="h-4 w-4" />
                </button>
              </ElderCareBookingModal>
              <a
                href={phone ? `tel:${phone}` : "tel:+918981289812"}
                className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 backdrop-blur-md px-6 py-3.5 text-sm font-semibold text-white hover:bg-white/20 transition-all duration-300"
              >
                <Phone className="h-4 w-4" />
                Call Now
              </a>
            </div>
          </motion.div>

          {/* Right side floating card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="hidden lg:block relative"
          >
            <div className="relative rounded-[2.5rem] border border-white/15 bg-white/5 backdrop-blur-3xl p-8 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)] overflow-hidden group">
              <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-primary/20 blur-[50px] transition-transform duration-700 group-hover:scale-150" />
              <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-blue-500/10 blur-[50px] transition-transform duration-700 group-hover:scale-150" />
              
              <div className="relative z-10">
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary/20 text-teal-300 border border-primary/20 mb-6">
                  <Heart className="h-7 w-7" />
                </div>
                
                <h3 className="text-2xl font-display font-semibold text-white mb-3">
                  Compassionate Care
                </h3>
                <p className="text-white/60 leading-relaxed text-[15px] mb-8">
                  We provide reliable elderly care at home to help seniors live safely, comfortably and independently with the support they need.
                </p>

                <div className="space-y-3">
                  {["Trained Attendants", "24/7 Support Available", "Personalised Care"].map(
                    (feature) => (
                      <div
                        key={feature}
                        className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5"
                      >
                        <div className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                        <span className="text-sm font-medium text-white/80">{feature}</span>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
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
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground tracking-tight leading-[1.1] mb-6">
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
                    className="w-full h-full object-contain filter transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-display text-xl font-bold text-foreground leading-tight mb-3">
                    {s.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed flex-1">
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
            
            <h2 className="font-display text-3xl md:text-5xl font-bold text-white tracking-tight leading-[1.1] mb-6">
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
            <div className="absolute -bottom-8 -left-8 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-5 shadow-2xl">
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
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground tracking-tight leading-[1.1]">
            Why Choose Nupun Home Health Care Services?
          </h2>
        </motion.div>
      </div>

      <div className="container-x">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {WHY_CHOOSE.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="h-full rounded-3xl border border-border bg-surface/50 p-8 transition-colors hover:bg-surface">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                    <Icon className="h-6 w-6 text-primary" strokeWidth={2} />
                  </div>
                  <h3 className="font-display text-xl font-bold text-foreground mb-3">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-[15px]">
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
    <section className="relative overflow-hidden bg-primary">
      <div className="absolute inset-0 -z-10" />
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
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/60 mb-5">
            Need Elderly Care at Home?
          </div>
          <h2 className="font-display text-4xl md:text-5xl text-white tracking-tight leading-[1.1] mb-6">
            If your parent, grandparent or loved one needs help with daily activities, personal care, mobility, meals or companionship, <strong className="font-bold">Nupun is here to help.</strong>
          </h2>
          <p className="text-white/80 text-lg leading-relaxed max-w-2xl mx-auto mb-10">
            Get a trained caregiver according to your family's requirement and schedule.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <ElderCareBookingModal>
              <button className="inline-flex items-center gap-2 rounded-full bg-slate-900 text-white px-8 py-4 text-base font-semibold hover:bg-slate-800 transition-all duration-300 shadow-xl">
                Book Elderly Care <ArrowRight className="h-5 w-5" />
              </button>
            </ElderCareBookingModal>
            {phone && (
              <a
                href={`tel:${phone}`}
                className="inline-flex items-center gap-2 rounded-full border border-white/30 text-white px-8 py-4 text-base font-semibold hover:bg-white/10 transition-all duration-300"
              >
                <Phone className="h-5 w-5" />
                Request a Callback
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
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground tracking-tight leading-[1.1]">
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
                  <span className="font-display text-lg font-bold text-foreground pr-8">
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

import { api } from "@/lib/api/client";

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
    };

    try {
      await api.post("/elder-care", data);
      setIsSuccess(true);
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
    <Section className="py-20 lg:py-28 bg-white" id="book">
      <div className="container-x max-w-3xl mx-auto">
        <div className="rounded-[2rem] border border-border bg-surface p-8 md:p-12 shadow-sm">
          {!isSuccess ? (
            <>
              <div className="text-center mb-10">
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Book an Elderly Care Attendant
                </h2>
                <p className="text-muted-foreground text-[15px]">
                  Fill in your details and our care team will contact you shortly.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Full Name</label>
                    <input
                      name="fullName"
                      required
                      type="text"
                      className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Phone Number</label>
                    <input
                      name="phone"
                      required
                      type="tel"
                      className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Select City</label>
                    <select name="city" required className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary">
                      <option value="">Select...</option>
                      <option value="Faridabad">Faridabad</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Noida">Noida</option>
                      <option value="Gurugram">Gurugram</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Select Service</label>
                  <select name="service" required className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary">
                    <option value="">Select...</option>
                    <option value="Elderly care">Elderly care</option>
                    <option value="Patient care">Patient care</option>
                    <option value="Bedridden">Bedridden</option>
                    <option value="24 hour attendant">24 hour attendant</option>
                  </select>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-xl bg-primary px-6 py-4 text-sm font-semibold text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Request"}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="py-16 text-center">
              <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">Request Submitted!</h3>
              <p className="text-muted-foreground">We will contact you shortly.</p>
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}

/* ─────────────────────── Footer ─────────────────────── */

function ElderlyFooter({ phone, whatsapp }: { phone?: string; whatsapp?: string }) {
  return (
    <footer className="bg-slate-900 pt-16 pb-8 border-t border-white/10">
      <div className="container-x text-center max-w-2xl mx-auto">
        <h3 className="font-display text-2xl font-bold text-white mb-4">
          Nupun Home Health Care Services
        </h3>
        <p className="text-white/60 mb-8 leading-relaxed">
          Providing compassionate and professional home care services for elderly people, patients and families.
        </p>
        
        <div className="flex flex-wrap items-center justify-center gap-4 text-sm font-medium">
          <a href={phone ? `tel:${phone}` : "tel:+918981289812"} className="text-white hover:text-teal-400 transition-colors">
            Call Now
          </a>
          <span className="text-white/20">|</span>
          <a href={whatsapp ? `https://wa.me/${whatsapp}` : "#"} className="text-white hover:text-teal-400 transition-colors">
            WhatsApp Us
          </a>
          <span className="text-white/20">|</span>
          <a href="#book" className="text-white hover:text-teal-400 transition-colors">
            Book an Attendant
          </a>
        </div>
      </div>
    </footer>
  );
}
