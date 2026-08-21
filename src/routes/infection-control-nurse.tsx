import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { api } from "@/lib/api/client";
import {
  Shield,
  Activity,
  Home,
  HeartPulse,
  Users,
  Phone,
  ArrowRight,
  Check,
  ChevronDown,
  ThumbsUp,
  Loader2,
  ArrowUpRight,
  BookOpen,
  ClipboardCheck,
  Microscope,
  Trash2,
  FileText,
  Sparkles,
  GraduationCap,
  Stethoscope,
  ShieldCheck,
  Mail,
  Send,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState, useCallback, useEffect, type ReactNode } from "react";
import { settingsQ, infectionControlQ } from "@/lib/api/queries";
import { Section } from "@/components/site/Section";
import { InfectionEnquiryForm, InfectionEnquiryModal, DEFAULT_REQUIREMENT_OPTIONS } from "@/components/forms/InfectionEnquiryModal";
import type {
  InfectionControlPageContent,
  ICServiceItem,
  ICWhyChooseItem,
  ICHowItWorksStep,
  ICFaqItem,
} from "@/lib/api/types";

export const Route = createFileRoute("/infection-control-nurse")({
  head: () => ({
    meta: [
      { title: "Infection Control Nurse Services — Nupun Home Health Care Services" },
      {
        name: "description",
        content:
          "Professional infection prevention and control support, training and guidance for healthcare professionals and care environments.",
      },
      { property: "og:title", content: "Infection Control Nurse Services — Nupun Home Health Care" },
      {
        property: "og:description",
        content:
          "Get professional guidance and support in infection prevention and control practices, healthcare hygiene, staff training and infection-control protocols.",
      },
      { property: "og:url", content: "/infection-control-nurse" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/infection-control-nurse" }],
  }),
  component: InfectionControlNursePage,
});

/* ─────────────────────── Static fallback data ─────────────────────── */

const DEFAULT_SERVICES: ICServiceItem[] = [
  { title: "Infection Prevention & Control", description: "Support in implementing appropriate infection prevention and control practices.", order: 0 },
  { title: "Hand Hygiene & PPE Practices", description: "Guidance on proper hand hygiene, personal protective equipment and safe healthcare practices.", order: 1 },
  { title: "Infection Control Training", description: "Educational training and awareness sessions for healthcare staff and nursing professionals.", order: 2 },
  { title: "Infection Control Audit & Monitoring", description: "Support with monitoring infection-control practices and identifying areas for improvement.", order: 3 },
  { title: "Biomedical Waste Management Guidance", description: "Guidance regarding safe segregation, handling and disposal practices for biomedical waste.", order: 4 },
  { title: "Infection Surveillance & Documentation", description: "Support with infection monitoring, documentation and maintaining appropriate records.", order: 5 },
  { title: "Infection Control Policies & Protocols", description: "Guidance in developing and following appropriate infection-control policies and protocols.", order: 6 },
  { title: "Environmental Hygiene & Safety", description: "Support for maintaining hygienic and safer healthcare environments.", order: 7 },
  { title: "Home Healthcare Infection Prevention", description: "Infection-prevention guidance for home healthcare and patient-care environments.", order: 8 },
  { title: "Healthcare Staff Awareness & Education", description: "Awareness and educational sessions covering essential infection-control practices.", order: 9 },
];

const DEFAULT_WHY_CHOOSE: ICWhyChooseItem[] = [
  { title: "Professional Guidance", description: "Focused support in infection prevention and control practices." },
  { title: "Healthcare-Focused Approach", description: "Our content and services are designed around practical healthcare environments." },
  { title: "Training & Awareness", description: "Promoting proper hygiene, PPE and infection-control practices among healthcare teams." },
  { title: "Practical Support", description: "Focus on implementing appropriate infection-control procedures in real-world settings." },
  { title: "Patient Safety Focused", description: "Helping healthcare environments maintain safer infection-prevention practices." },
];

const DEFAULT_HOW_IT_WORKS: ICHowItWorksStep[] = [
  { step_label: "Step 1", title: "Submit Your Enquiry", description: "Tell us about your requirement through the online enquiry form." },
  { step_label: "Step 2", title: "Requirement Discussion", description: "Our team contacts you to understand your specific requirement." },
  { step_label: "Step 3", title: "Service Planning", description: "The appropriate guidance, training or support requirement is discussed." },
  { step_label: "Step 4", title: "Support / Training", description: "The agreed infection-control support or educational service is provided." },
  { step_label: "Step 5", title: "Follow-Up", description: "Further guidance can be discussed according to the requirement." },
];

const DEFAULT_FAQS: ICFaqItem[] = [
  { question: "What is an Infection Control Nurse?", answer: "An Infection Control Nurse is a healthcare professional involved in infection prevention, monitoring, education and implementation of infection-control practices in healthcare settings." },
  { question: "Who can benefit from Infection Control Nurse services?", answer: "Healthcare facilities, nursing teams, healthcare professionals and home-care environments can benefit from appropriate infection prevention and control support." },
  { question: "Do you provide Infection Control training?", answer: "Training and educational support can be provided according to the specific requirement and scope of service." },
  { question: "Do you provide Infection Control support for home healthcare?", answer: "Yes, infection-prevention guidance can be provided for appropriate home healthcare and patient-care environments." },
  { question: "What topics can be covered in Infection Control training?", answer: "Topics may include hand hygiene, PPE, standard precautions, infection prevention practices, biomedical waste management and other relevant infection-control procedures." },
  { question: "Can nursing students enquire about Infection Control Nurse training?", answer: "Yes. Nursing students and healthcare professionals can submit an enquiry regarding available educational or training support." },
  { question: "Do you provide an Infection Control Nurse certificate?", answer: "Any certificate or training credential should be provided only according to the actual course, authorization, affiliation or recognition applicable to the program. Do not describe it as university/government recognized unless such recognition officially exists." },
  { question: "How can I enquire about Infection Control Nurse services?", answer: "You can submit the enquiry form on this page or contact Nupun Home Health Care Services directly." },
];


const SERVICE_EMOJIS = ["🛡️", "🧤", "📚", "🔍", "♻️", "📋", "📜", "🏥", "🏠", "👩‍⚕️"];
const WHY_CHOOSE_EMOJIS = ["✅", "🏥", "📖", "🔧", "❤️"];

/* ─────────────────────── Component ─────────────────────── */

function InfectionControlNursePage() {
  const { data: settings } = useQuery(settingsQ());
  const { data: pageContent } = useQuery(infectionControlQ());

  const rawPhone = settings?.phone || "+919876543210";
  const rawWhatsapp = settings?.whatsapp || settings?.phone || "919876543210";
  const phone = rawPhone.replace(/[^\d+]/g, "");
  const whatsapp = rawWhatsapp.replace(/\D/g, "");

  const content = pageContent;

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <ICHero phone={phone} whatsapp={whatsapp} content={content} />

      {/* ── Short Introduction ────────────────────────────────── */}
      <ICIntroSection content={content} />

      {/* ── Our Comprehensive Services ────────────────────────── */}
      <ICServicesSection content={content} />

      {/* ── Why Choose Us ─────────────────────────────────────── */}
      <ICWhyChooseSection content={content} />

      {/* ── How It Works ──────────────────────────────────────── */}
      <ICHowItWorksSection content={content} />

      {/* ── FAQ ────────────────────────────────────────────────── */}
      <ICFaqSection content={content} />

      {/* ── Enquiry Form ──────────────────────────────────────── */}
      <ICEnquirySection content={content} />
    </>
  );
}

/* ─────────────────────── Hero ─────────────────────── */

function ICHero({
  phone,
  whatsapp,
  content,
}: {
  phone?: string;
  whatsapp?: string;
  content?: InfectionControlPageContent;
}) {
  const heading = content?.hero_heading || "Infection Control Nurse Services";
  const subheading = content?.hero_subheading || "Professional Infection Prevention & Control Support for Healthcare Professionals and Care Settings";
  const shortText = content?.hero_short_text || "Get professional guidance and support in infection prevention and control practices, healthcare hygiene, staff training and infection-control protocols.";
  const btnPrimary = content?.hero_btn_primary || "Enquire Now";
  const btnSecondary = content?.hero_btn_secondary || "Call Now";

  const images = [
    "/assets/ic_nurse_desktop.jpg",
    "/assets/ic_nurse_desktop_2.jpg",
    "/assets/ic_nurse_desktop_3.jpg",
  ];
  const mobileImages = [
    "/assets/ic_nurse_mobile.jpg",
    "/assets/ic_nurse_mobile_2.jpg",
    "/assets/ic_nurse_mobile_3.jpg",
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
      {/* Background */}
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
                alt="Infection Control Nurse" 
                className="w-full h-full object-cover object-center"
              />
            </picture>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Overlays */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/70 via-black/40 to-black/20" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

      {/* Dot grid */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.06]"
        style={{
          backgroundImage: "radial-gradient(white 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
        aria-hidden
      />

      {/* Floating accent blobs */}
      <div className="absolute top-20 right-[15%] w-72 h-72 bg-primary/10 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-20 left-[10%] w-64 h-64 bg-cyan-500/8 rounded-full blur-[100px] -z-10" />

      <div className="container-x relative z-10 pt-24 pb-12 lg:pt-28 lg:pb-14">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-md px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/90 mb-5">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              Infection Prevention & Control
            </div>

            <h1
              className="font-display font-medium text-white tracking-tight leading-[1.1] text-[36px] sm:text-[44px] md:text-[52px] lg:text-[60px] mb-4"
              style={{ textShadow: "0 4px 40px rgba(0,0,0,0.5)" }}
            >
              {heading}
            </h1>

            <p className="text-white/80 text-lg md:text-xl font-medium leading-relaxed max-w-xl mb-3">
              {subheading}
            </p>

            <p className="text-white/60 text-base md:text-lg leading-relaxed max-w-xl mb-6">
              {shortText}
            </p>

            <div className="mt-6 md:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <InfectionEnquiryModal
                heading={content?.enquiry_heading}
                subheading={content?.enquiry_subheading}
                requirementOptions={
                  content?.enquiry_requirement_options?.length
                    ? content.enquiry_requirement_options
                    : undefined
                }
              >
                <button
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-3.5 text-[15px] font-semibold text-white shadow-sm transition-all duration-300 hover:brightness-110 hover:-translate-y-0.5 hover:shadow-[0_15px_35px_-10px_var(--color-primary)]"
                >
                  {btnPrimary}
                  <ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              </InfectionEnquiryModal>

              <a
                href={`tel:${phone || "+919876543210"}`}
                className="group inline-flex items-center justify-center gap-2.5 rounded-full border border-white/30 bg-white/10 backdrop-blur-md px-8 py-3.5 text-[15px] font-medium text-white shadow-sm hover:bg-white/20 hover:border-white/50 transition-all duration-300 hover:-translate-y-0.5"
              >
                <Phone className="h-5 w-5 text-primary" />
                {btnSecondary}
              </a>
            </div>

            <div className="mt-8 flex flex-wrap gap-6">
              {[
                { val: "IPC", label: "Focused" },
                { val: "Training", label: "Support" },
                { val: "Healthcare", label: "Environments" },
              ].map((s) => (
                <div key={s.label}>
                  <div className="text-xl font-display font-bold text-white">{s.val}</div>
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

              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/20 text-white/90 border border-primary/20 mb-4">
                <ShieldCheck className="h-6 w-6" strokeWidth={1.5} />
              </div>

              <div className="text-white/50 text-xs uppercase tracking-[0.2em] font-semibold mb-4">
                Infection Control Services
              </div>

              <div className="grid grid-cols-2 gap-2 mb-5">
                {[
                  "IPC Practices",
                  "Hand Hygiene",
                  "PPE Guidance",
                  "Staff Training",
                  "Audit Support",
                  "Waste Management",
                  "Documentation",
                  "Home Healthcare",
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
                Professional support in infection prevention, control practices and healthcare staff education.
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

/* ─────────────────────── Introduction ─────────────────────── */

function ICIntroSection({ content }: { content?: InfectionControlPageContent }) {
  const heading = content?.intro_heading || "Professional Infection Prevention & Control Support";
  const body = content?.intro_content || "Nupun Home Health Care Services provides professional infection prevention and control support for healthcare professionals, nursing teams, healthcare facilities and home-care environments. Our services focus on promoting safe practices, proper hygiene, infection prevention protocols and awareness in healthcare settings.";

  return (
    <Section className="py-20 lg:py-28">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-5">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            About Our Services
          </div>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl tracking-tight text-foreground mb-6">
            {heading}
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed max-w-3xl mx-auto">
            {body}
          </p>
        </motion.div>
      </div>
    </Section>
  );
}

/* ─────────────────────── Services Grid ─────────────────────── */

function ICServicesSection({ content }: { content?: InfectionControlPageContent }) {
  const services = content?.services?.length
    ? [...content.services].sort((a, b) => (a.order || 0) - (b.order || 0))
    : DEFAULT_SERVICES;

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
          Our Comprehensive Services
        </div>
        <h2 className="font-display text-4xl md:text-5xl tracking-tight text-foreground mb-4">
          Infection Control Nurse Services
        </h2>
        <p className="text-muted-foreground text-lg leading-relaxed">
          Professional infection prevention and control support for healthcare settings.
        </p>
      </motion.div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {services.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: (i % 5) * 0.07, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="group h-full flex flex-col items-start text-left rounded-2xl bg-white border border-black/5 p-6 shadow-sm transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.1)] cursor-default">
              <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-primary/10 mb-4 transform transition-transform group-hover:scale-110 duration-300">
                <span className="text-4xl leading-none">{SERVICE_EMOJIS[i % SERVICE_EMOJIS.length]}</span>
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

/* ─────────────────────── Why Choose Us ─────────────────────── */

function ICWhyChooseSection({ content }: { content?: InfectionControlPageContent }) {
  const items = content?.why_choose_items?.length ? content.why_choose_items : DEFAULT_WHY_CHOOSE;

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
          Why Choose Us
        </div>
        <h2 className="font-display text-4xl md:text-5xl tracking-tight text-foreground mb-4">
          Why Choose Nupun?
        </h2>
      </motion.div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {items.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: (i % 5) * 0.1 }}
            className="group h-full flex flex-col items-start text-left rounded-[1.75rem] bg-white border border-black/5 p-8 shadow-sm transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)] cursor-default"
          >
            <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-primary/10 mb-6 transform transition-transform duration-400 group-hover:scale-110 group-hover:rotate-3">
              <span className="text-3xl leading-none">{WHY_CHOOSE_EMOJIS[i % WHY_CHOOSE_EMOJIS.length]}</span>
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

function ICHowItWorksSection({ content }: { content?: InfectionControlPageContent }) {
  const steps = content?.how_it_works_steps?.length ? content.how_it_works_steps : DEFAULT_HOW_IT_WORKS;

  return (
    <section className="relative py-20 lg:py-28 overflow-hidden bg-white">
      <div className="container-x relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-5">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            How It Works
          </div>
          <h2 className="font-display text-4xl md:text-5xl text-foreground tracking-tight mb-4">
            Simple Steps to Get Started
          </h2>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-0">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative flex gap-6 pb-10 last:pb-0"
            >
              {/* Timeline line */}
              {i < steps.length - 1 && (
                <div className="absolute left-[23px] top-[48px] w-px h-[calc(100%-48px)] bg-gradient-to-b from-primary/30 to-transparent" />
              )}

              {/* Step number */}
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-primary/10 border border-primary/20 text-primary font-display font-bold text-lg">
                {i + 1}
              </div>

              <div className="pt-1">
                <div className="text-primary text-xs font-semibold uppercase tracking-[0.15em] mb-1">
                  {step.step_label}
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-base leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────── FAQ ─────────────────────── */

function ICFaqSection({ content }: { content?: InfectionControlPageContent }) {
  const faqs = content?.faqs?.length ? content.faqs : DEFAULT_FAQS;
  const [open, setOpen] = useState<number | null>(null);

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
            Have questions about our Infection Control Nurse services? Find answers below.
            Still unsure? Our team is ready to help.
          </p>
          <div className="flex flex-col gap-3">
            <a
              href="#enquiry"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary/10 text-primary px-6 py-3 text-sm font-semibold hover:bg-primary hover:text-white transition-colors duration-300 w-fit"
            >
              Submit an Enquiry →
            </a>
            <Link
              to="/contact"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors w-fit"
            >
              Contact us directly →
            </Link>
          </div>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-border bg-white overflow-hidden shadow-sm"
            >
              <button
                className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                onClick={() => setOpen(open === idx ? null : idx)}
              >
                <span className="font-semibold text-foreground text-[15px] leading-snug">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`h-5 w-5 text-muted-foreground shrink-0 transition-transform duration-300 ${
                    open === idx ? "rotate-180" : ""
                  }`}
                />
              </button>
              {open === idx && (
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

/* ─────────────────────── Enquiry Form ─────────────────────── */


function ICEnquirySection({ content }: { content?: InfectionControlPageContent }) {
  const heading = content?.enquiry_heading || "Have an Infection Control Enquiry?";
  const subheading =
    content?.enquiry_subheading ||
    "Tell us about your requirement and our team will contact you to discuss the appropriate Infection Prevention & Control support.";
  const requirementOptions = content?.enquiry_requirement_options?.length
    ? content.enquiry_requirement_options
    : DEFAULT_REQUIREMENT_OPTIONS;

  return (
    <section className="py-20 lg:py-28" id="enquiry">
      <div className="container-x">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-5">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Enquire Now
            </div>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl tracking-tight text-foreground mb-4">
              {heading}
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-xl mx-auto">
              {subheading}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <InfectionEnquiryForm requirementOptions={requirementOptions} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

