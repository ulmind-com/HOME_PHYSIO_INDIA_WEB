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
  Droplets,
  Activity,
  Home,
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
  ArrowUpRight,
  TestTube,
  Microscope,
  FileHeart,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { categoriesQ, settingsQ } from "@/lib/api/queries";
import { CITIES } from "@/components/forms/BookingForm";
import { NursingBookingModal } from "@/components/forms/NursingBookingModal";
import { Section } from "@/components/site/Section";

export const Route = createFileRoute("/sample-collection")({
  head: () => ({
    meta: [
      { title: "Home Sample Collection — Nupun Home Health Care Services" },
      {
        name: "description",
        content:
          "Convenient home sample collection for blood, urine, stool and other diagnostic tests. Professional and hygienic sample handling.",
      },
      { property: "og:title", content: "Home Sample Collection — Nupun Home Health Care" },
      {
        property: "og:description",
        content:
          "Convenient home sample collection for blood, urine, stool and other diagnostic tests. Professional and hygienic sample handling.",
      },
      { property: "og:url", content: "/sample-collection" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/sample-collection" }],
  }),
  component: SampleCollectionPage,
});

/* ─────────────────────── Static data ─────────────────────── */

const SAMPLE_SERVICES = [
  {
    icon: Droplets,
    emoji: "🩸",
    title: "Blood Sample Collection",
    description: "Safe and hygienic blood sample collection by trained professionals in the comfort of your home.",
    color: "text-rose-600",
    bg: "from-rose-50 to-pink-50",
    iconBg: "bg-rose-100",
  },
  {
    icon: TestTube,
    emoji: "🧪",
    title: "Urine Sample Collection",
    description: "Convenient collection of urine samples with proper sterile containers and guidelines.",
    color: "text-amber-600",
    bg: "from-amber-50 to-yellow-50",
    iconBg: "bg-amber-100",
  },
  {
    icon: Microscope,
    emoji: "🔬",
    title: "Stool Sample Collection",
    description: "Hassle-free stool sample collection following appropriate hygiene and safety protocols.",
    color: "text-emerald-600",
    bg: "from-emerald-50 to-green-50",
    iconBg: "bg-emerald-100",
  },
  {
    icon: Activity,
    emoji: "📊",
    title: "Other Diagnostic Sample",
    description: "Collection of various other diagnostic samples as prescribed by your doctor.",
    color: "text-violet-600",
    bg: "from-violet-50 to-purple-50",
    iconBg: "bg-violet-100",
  },
  {
    icon: FileHeart,
    emoji: "📋",
    title: "Routine Blood Tests",
    description: "Regular monitoring and routine tests such as CBC, blood sugar, and thyroid profile.",
    color: "text-blue-600",
    bg: "from-blue-50 to-sky-50",
    iconBg: "bg-blue-100",
  },
  {
    icon: Stethoscope,
    emoji: "🩺",
    title: "Health Check-up Sample",
    description: "Comprehensive sample collection for full-body health check-ups and preventive care.",
    color: "text-teal-600",
    bg: "from-teal-50 to-emerald-50",
    iconBg: "bg-teal-100",
  },
  {
    icon: FileHeart,
    emoji: "📝",
    title: "Doctor-Prescribed Investigations",
    description: "Specialized investigations and specific tests recommended by your treating physician.",
    color: "text-indigo-600",
    bg: "from-indigo-50 to-blue-50",
    iconBg: "bg-indigo-100",
  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Book Your Collection",
    description: "Submit your details and required test information.",
  },
  {
    step: "02",
    title: "Confirm Your Appointment",
    description: "Our team coordinates the collection time.",
  },
  {
    step: "03",
    title: "Home Visit",
    description: "A trained professional visits your home for sample collection.",
  },
  {
    step: "04",
    title: "Sample Processing",
    description: "The collected sample is handled and submitted according to the applicable laboratory process.",
  },
];

const WHY_CHOOSE = [
  {
    icon: Home,
    emoji: "🏡",
    title: "Convenient Home Visits",
    description: "No need to travel to a collection centre.",
    color: "text-blue-600",
    bg: "bg-blue-50",
    iconBg: "bg-blue-100",
  },
  {
    icon: Users,
    emoji: "👨‍⚕️",
    title: "Trained Professionals",
    description: "Sample collection is performed by trained healthcare professionals.",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    iconBg: "bg-emerald-100",
  },
  {
    icon: Droplets,
    emoji: "🧼",
    title: "Hygienic Collection",
    description: "Appropriate hygiene and safe sample-handling practices are followed.",
    color: "text-rose-600",
    bg: "bg-rose-50",
    iconBg: "bg-rose-100",
  },
  {
    icon: Users,
    emoji: "🧓",
    title: "Suitable for Different Patients",
    description: "Useful for elderly, bedridden and patients who have difficulty travelling.",
    color: "text-violet-600",
    bg: "bg-violet-50",
    iconBg: "bg-violet-100",
  },
];

const WHO_CAN_BENEFIT = [
  "Elderly patients",
  "Bedridden patients",
  "Post-hospitalization patients",
  "Patients with limited mobility",
  "Children",
  "Patients requiring routine blood tests",
  "Anyone who prefers home collection",
];


/* ─────────────────────── Component ─────────────────────── */

function SampleCollectionPage() {
  const { data: settings } = useQuery(settingsQ());
  const { data: catData } = useQuery(categoriesQ({ limit: 100 }));

  const category = (catData?.items ?? []).find(
    (c) =>
      c.name.toLowerCase().includes("sample") ||
      c.slug?.toLowerCase().includes("sample")
  );

  const rawPhone = settings?.phone || "+919876543210";
  const rawWhatsapp = settings?.whatsapp || settings?.phone || "919876543210";

  const phone = rawPhone.replace(/[^\d+]/g, "");
  const whatsapp = rawWhatsapp.replace(/\D/g, "");

  return (
    <>
      <SampleCollectionHero phone={phone} whatsapp={whatsapp} category={category} />
      <SampleServicesSection />
      <WhyChooseSection />
      <HowItWorksSection />
      <WhoCanBenefitSection />
      <SampleCollectionCtaBand phone={phone} whatsapp={whatsapp} />
      <SampleBookingPanel phone={phone} whatsapp={whatsapp} />
    </>
  );
}

/* ─────────────────────── Hero ─────────────────────── */

function SampleCollectionHero({
  phone,
  whatsapp,
  category,
}: {
  phone?: string;
  whatsapp?: string;
  category?: any;
}) {
  const heroBadge = "Home Sample Collection";
  const heroTitle = "Reliable Home Sample Collection Services";
  const heroDescription = "Nupun Home Health Care Services provides convenient home sample collection for patients who prefer to get their blood and other diagnostic samples collected at home. Our trained professionals follow appropriate sample-collection and handling procedures.";
  const heroCtaPrimaryText = "Book Home Sample Collection";
  const heroCtaSecondaryText = "Call Now";
  const heroStats = [
    { val: "Safe", label: "Handling" },
    { val: "Hygienic", label: "Collection" },
    { val: "Trained", label: "Professionals" },
  ];

  const images = ["/assets/sample-collection/web.jpg"];
  const mobileImages = ["/assets/sample-collection/mobile.jpg"];
  
  const [currentIdx, setCurrentIdx] = useState(0);

  const go = useCallback(
    (next: number) => {
      setCurrentIdx(((next % images.length) + images.length) % images.length);
    },
    [images.length]
  );

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
                alt="Home Sample Collection" 
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

      <div className="container-x relative z-10 pt-24 pb-12 lg:pt-28 lg:pb-14">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-md px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/90 mb-5">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-400 animate-pulse" />
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
              <a href="#booking"
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-3.5 text-[15px] font-semibold text-primary-foreground shadow-sm transition-all duration-300 hover:brightness-110 hover:-translate-y-0.5"
                >
                  {heroCtaPrimaryText}
                  <ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>

              <a
                href={`tel:${phone || "+919876543210"}`}
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
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────── Services Grid ─────────────────────── */

function SampleServicesSection() {
  return (
    <Section className="py-12 lg:py-16">
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
          Our Home Sample Collection Services
        </h2>
        <p className="text-muted-foreground text-lg leading-relaxed">
          Comprehensive diagnostic sample collection handled with care right at your doorstep.
        </p>
      </motion.div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {SAMPLE_SERVICES.map((s, i) => {
          const Icon = s.icon;
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


/* ─────────────────────── Why Choose ─────────────────────── */

function WhyChooseSection() {
  return (
    <Section className="py-12 lg:py-16 bg-[#F8F9FA]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center max-w-2xl mx-auto mb-14"
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-5">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          Benefits
        </div>
        <h2 className="font-display text-4xl md:text-5xl tracking-tight text-foreground mb-4">
          Why Choose Home Sample Collection?
        </h2>
      </motion.div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {WHY_CHOOSE.map((item, i) => {
          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (i % 4) * 0.1 }}
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

function HowItWorksSection() {
  return (
    <section className="relative py-12 lg:py-16 overflow-hidden bg-white">
      <div className="container-x relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-5">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Process
          </div>
          <h2 className="font-display text-4xl md:text-5xl text-foreground tracking-tight leading-tight mb-3">
            How It Works
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {HOW_IT_WORKS.map((step, i) => (
             <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative p-6 rounded-2xl bg-[#F8F9FA] border border-border hover:border-primary/40 transition-colors"
             >
                <div className="text-4xl font-display font-bold text-primary/20 mb-4">{step.step}</div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
             </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────── Who Can Benefit ─────────────────────── */

function WhoCanBenefitSection() {
  return (
    <section className="py-10 lg:py-14 bg-white">
      <div className="container-x">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-5">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Who Needs This
          </div>
          <h2 className="font-display text-3xl md:text-4xl tracking-tight text-foreground">
            Who Can Use This Service?
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
              className="group flex items-center gap-2.5 rounded-full border border-border bg-[#F8F9FA] px-5 py-2.5 text-sm font-medium text-foreground shadow-sm transition-all duration-300 hover:border-primary/40 hover:bg-primary/5 hover:text-primary hover:shadow-md cursor-default"
            >
              <div className="h-2 w-2 rounded-full bg-primary/60 group-hover:bg-primary transition-colors" />
              {item}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────── CTA Band ─────────────────────── */

function SampleCollectionCtaBand({ phone, whatsapp }: { phone?: string; whatsapp?: string }) {
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

      <div className="container-x py-12 lg:py-16">
        <div className="max-w-3xl">
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-white tracking-tight leading-tight mb-3">
            Need a Sample Collection at Home?
          </h2>
          <h3 className="text-xl md:text-2xl text-white/90 font-medium mb-6 tracking-wide" style={{ wordSpacing: "0.06em" }}>
            Book a convenient home sample collection with Nupun Home Health Care Services.
          </h3>
          
          <div className="flex flex-wrap gap-4 mt-8">
            <a
              href="#booking"
              className="inline-flex items-center gap-2 rounded-full bg-rose-400 text-slate-900 px-8 py-4 text-base font-semibold hover:bg-rose-300 transition-all duration-300 shadow-[0_15px_35px_-10px_rgba(251,113,133,0.4)]"
            >
              Book Home Sample Collection <ArrowRight className="h-5 w-5" />
            </a>
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


/* ─────────────────────── Booking Panel ─────────────────────── */

const sampleFormSchema = z.object({
  patient_name: z.string().min(2, "Enter full name"),
  patient_age: z.string().min(1, "Enter patient age"),
  contact_phone: z.string().min(7, "Enter a valid phone number"),
  city: z.string().min(1, "Select a city"),
  sample_type: z.string().min(1, "Select a sample type"),
  test_name: z.string().min(1, "Enter test name"),
  preferred_date: z.string().min(1, "Select preferred date"),
  preferred_time: z.string().min(1, "Select preferred time"),
  patient_condition: z.string().optional(),
  address: z.string().min(5, "Enter full address"),
});

type SampleFormValues = z.infer<typeof sampleFormSchema>;

function SampleBookingPanel({ phone, whatsapp }: { phone?: string; whatsapp?: string }) {
  const [done, setDone] = useState(false);
  const form = useForm<SampleFormValues>({
    resolver: zodResolver(sampleFormSchema),
    defaultValues: {
      patient_name: "",
      patient_age: "",
      contact_phone: "",
      city: "",
      sample_type: "",
      test_name: "",
      preferred_date: "",
      preferred_time: "",
      patient_condition: "",
      address: "",
    },
  });

  const mut = useMutation({
    mutationFn: (data: SampleFormValues) =>
      api.post("/bookings", {
        ...data,
        service_name: `Sample Collection - ${data.sample_type} (${data.test_name})`,
      }),
    onSuccess: () => {
      setDone(true);
      triggerBookingSuccess();
      toast.success("Booking received — we'll contact you shortly.");
    },
    onError: (err: Error) => toast.error(err.message || "Something went wrong."),
  });

  return (
    <section className="py-12 lg:py-16 bg-[#F8F9FA]" id="booking">
      <div className="container-x max-w-2xl mx-auto">
        <div className="rounded-3xl border border-border bg-white p-6 md:p-10 shadow-xl shadow-black/5">
          {done ? (
            <div className="text-center py-10">
              <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600 mb-6">
                <Check className="h-10 w-10" />
              </div>
              <h3 className="font-display text-3xl mb-3">Request Submitted!</h3>
              <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
                Thank you for booking with us. Our team will contact you shortly to confirm the appointment.
              </p>
              <button
                onClick={() => {
                  setDone(false);
                  form.reset();
                }}
                className="rounded-full border border-border bg-white px-8 py-3 text-sm font-semibold hover:border-primary transition-colors"
              >
                Book Another Request
              </button>
            </div>
          ) : (
            <>
              <div className="text-center mb-10">
                 <h3 className="font-display text-3xl md:text-4xl tracking-tight text-foreground mb-3">
                   Book Home Sample Collection
                 </h3>
                 <p className="text-muted-foreground text-base">
                   Please fill out the details below and we will coordinate your sample collection at home.
                 </p>
              </div>

              <form onSubmit={form.handleSubmit((v) => mut.mutate(v))} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Full Name */}
                <div className="md:col-span-2 text-left">
                  <label className="block text-sm font-medium text-foreground mb-1.5">Full Name</label>
                  <input
                    {...form.register("patient_name")}
                    placeholder="Patient's Full Name"
                    className="w-full rounded-xl border border-border bg-transparent px-5 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15 placeholder:text-muted-foreground"
                  />
                  {form.formState.errors.patient_name && (
                    <p className="text-xs text-destructive mt-1">
                      {form.formState.errors.patient_name.message}
                    </p>
                  )}
                </div>

                {/* Patient Age */}
                <div className="text-left">
                  <label className="block text-sm font-medium text-foreground mb-1.5">Patient Age</label>
                  <input
                    {...form.register("patient_age")}
                    placeholder="e.g. 45"
                    className="w-full rounded-xl border border-border bg-transparent px-5 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15 placeholder:text-muted-foreground"
                  />
                  {form.formState.errors.patient_age && (
                    <p className="text-xs text-destructive mt-1">
                      {form.formState.errors.patient_age.message}
                    </p>
                  )}
                </div>

                {/* Phone Number */}
                <div className="text-left">
                  <label className="block text-sm font-medium text-foreground mb-1.5">Phone Number</label>
                  <input
                    {...form.register("contact_phone")}
                    placeholder="10-digit number"
                    className="w-full rounded-xl border border-border bg-transparent px-5 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15 placeholder:text-muted-foreground"
                  />
                  {form.formState.errors.contact_phone && (
                    <p className="text-xs text-destructive mt-1">
                      {form.formState.errors.contact_phone.message}
                    </p>
                  )}
                </div>

                {/* Select City */}
                <div className="text-left">
                  <label className="block text-sm font-medium text-foreground mb-1.5">Select City</label>
                  <div className="relative">
                    <select
                      {...form.register("city")}
                      className="w-full rounded-xl border border-border bg-transparent px-5 py-3 pr-10 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15 text-foreground appearance-none"
                    >
                      <option value="">Select city</option>
                      {CITIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  </div>
                  {form.formState.errors.city && (
                    <p className="text-xs text-destructive mt-1">
                      {form.formState.errors.city.message}
                    </p>
                  )}
                </div>

                {/* Select Sample Type */}
                <div className="text-left">
                  <label className="block text-sm font-medium text-foreground mb-1.5">Sample Type</label>
                  <div className="relative">
                    <select
                      {...form.register("sample_type")}
                      className="w-full rounded-xl border border-border bg-transparent px-5 py-3 pr-10 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15 text-foreground appearance-none"
                    >
                      <option value="">Select sample type</option>
                      <option value="Blood">Blood</option>
                      <option value="Urine">Urine</option>
                      <option value="Stool">Stool</option>
                      <option value="Other">Other</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  </div>
                  {form.formState.errors.sample_type && (
                    <p className="text-xs text-destructive mt-1">
                      {form.formState.errors.sample_type.message}
                    </p>
                  )}
                </div>

                {/* Test / Investigation Name */}
                <div className="md:col-span-2 text-left">
                  <label className="block text-sm font-medium text-foreground mb-1.5">Test / Investigation Name</label>
                  <input
                    {...form.register("test_name")}
                    placeholder="e.g. Complete Blood Count, Thyroid Profile, etc."
                    className="w-full rounded-xl border border-border bg-transparent px-5 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15 placeholder:text-muted-foreground"
                  />
                  {form.formState.errors.test_name && (
                    <p className="text-xs text-destructive mt-1">
                      {form.formState.errors.test_name.message}
                    </p>
                  )}
                </div>

                {/* Preferred Date */}
                <div className="text-left">
                  <label className="block text-sm font-medium text-foreground mb-1.5">Preferred Date</label>
                  <input
                    type="date"
                    {...form.register("preferred_date")}
                    className="w-full rounded-xl border border-border bg-transparent px-5 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15 placeholder:text-muted-foreground"
                  />
                  {form.formState.errors.preferred_date && (
                    <p className="text-xs text-destructive mt-1">
                      {form.formState.errors.preferred_date.message}
                    </p>
                  )}
                </div>

                {/* Preferred Time */}
                <div className="text-left">
                  <label className="block text-sm font-medium text-foreground mb-1.5">Preferred Time</label>
                  <div className="relative">
                    <select
                      {...form.register("preferred_time")}
                      className="w-full rounded-xl border border-border bg-transparent px-5 py-3 pr-10 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15 text-foreground appearance-none"
                    >
                      <option value="">Select preferred time</option>
                      <option value="Morning (7 AM - 10 AM)">Morning (7 AM - 10 AM)</option>
                      <option value="Late Morning (10 AM - 12 PM)">Late Morning (10 AM - 12 PM)</option>
                      <option value="Afternoon (12 PM - 4 PM)">Afternoon (12 PM - 4 PM)</option>
                      <option value="Evening (4 PM - 7 PM)">Evening (4 PM - 7 PM)</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  </div>
                  {form.formState.errors.preferred_time && (
                    <p className="text-xs text-destructive mt-1">
                      {form.formState.errors.preferred_time.message}
                    </p>
                  )}
                </div>

                {/* Full Address */}
                <div className="md:col-span-2 text-left">
                  <label className="block text-sm font-medium text-foreground mb-1.5">Full Address</label>
                  <textarea
                    {...form.register("address")}
                    placeholder="House number, street name, area, etc."
                    rows={2}
                    className="w-full rounded-xl border border-border bg-transparent px-5 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15 placeholder:text-muted-foreground resize-none"
                  />
                  {form.formState.errors.address && (
                    <p className="text-xs text-destructive mt-1">
                      {form.formState.errors.address.message}
                    </p>
                  )}
                </div>

                {/* Patient Condition / Special Requirement */}
                <div className="md:col-span-2 text-left">
                  <label className="block text-sm font-medium text-foreground mb-1.5">Patient Condition / Special Requirement (Optional)</label>
                  <textarea
                    {...form.register("patient_condition")}
                    placeholder="Any specific requirement like fasting, needle anxiety, etc."
                    rows={2}
                    className="w-full rounded-xl border border-border bg-transparent px-5 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15 placeholder:text-muted-foreground resize-none"
                  />
                </div>

                <div className="md:col-span-2 pt-4">
                   <button
                     type="submit"
                     disabled={mut.isPending}
                     className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-4 text-base font-semibold text-primary-foreground shadow-lg hover:brightness-110 transition-all disabled:opacity-60"
                   >
                     {mut.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : "Submit Request"}
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
