import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Phone, ClipboardCheck, UserCheck } from "lucide-react";
import { settingsQ } from "@/lib/api/queries";

const DEFAULT_STEPS = [
  {
    stepLabel: "Step 1",
    number: "01",
    title: "Book a consultation",
    body: "Tell us your needs over a call or online. A care expert listens and advises — with zero pressure.",
    icon: Phone,
    bg: "bg-[#F4FAF6] hover:bg-[#EAF6ED]",
    border: "border-[#D6EFE0]",
    badgeBg: "bg-[#16A34A] text-white shadow-[0_4px_12px_rgba(22,163,74,0.25)]",
    iconBg: "bg-[#E2F5E8] text-[#16A34A]",
  },
  {
    stepLabel: "Step 2",
    number: "02",
    title: "Get a custom care plan",
    body: "We shape a personalised, clinical care plan around the patient's condition, schedule, and budget with transparent pricing.",
    icon: ClipboardCheck,
    bg: "bg-[#F3F7FE] hover:bg-[#E8F0FD]",
    border: "border-[#D1E2FA]",
    badgeBg: "bg-[#2563EB] text-white shadow-[0_4px_12px_rgba(37,99,235,0.25)]",
    iconBg: "bg-[#E1EDFC] text-[#2563EB]",
  },
  {
    stepLabel: "Step 3",
    number: "03",
    title: "Meet your caregiver",
    body: "You are quickly matched with a 5-step background-verified, trained, and compassionate medical professional from our core team.",
    icon: UserCheck,
    bg: "bg-[#FDF4FB] hover:bg-[#FAE8F7]",
    border: "border-[#F8D4F0]",
    badgeBg: "bg-[#C026D3] text-white shadow-[0_4px_12px_rgba(192,38,211,0.25)]",
    iconBg: "bg-[#FCE6F5] text-[#C026D3]",
  },
];

export function HowItWorksSection() {
  const { data: settings } = useQuery(settingsQ());

  const steps = settings?.how_it_works_steps?.length
    ? settings.how_it_works_steps.slice(0, 3).map((s, i) => ({
        stepLabel: `Step ${i + 1}`,
        number: `0${i + 1}`,
        title: s.title || DEFAULT_STEPS[i]?.title || `Step ${i + 1}`,
        body: s.body || DEFAULT_STEPS[i]?.body || "",
        icon: DEFAULT_STEPS[i]?.icon || Phone,
        bg: DEFAULT_STEPS[i]?.bg || "bg-surface",
        border: DEFAULT_STEPS[i]?.border || "border-border",
        badgeBg: DEFAULT_STEPS[i]?.badgeBg || "bg-primary text-white",
        iconBg: DEFAULT_STEPS[i]?.iconBg || "bg-primary/10 text-primary",
      }))
    : DEFAULT_STEPS;

  return (
    <section className="relative isolate overflow-hidden bg-background py-20 md:py-28 lg:py-32">
      {/* Subtle ambient lighting */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
        <div className="absolute left-[10%] top-[10%] h-80 w-80 rounded-full bg-primary/5 blur-[90px]" />
        <div className="absolute right-[10%] bottom-[10%] h-80 w-80 rounded-full bg-accent/5 blur-[90px]" />
      </div>

      <div className="container-x relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-16 max-w-3xl text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-accent backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            How it works
          </div>
          <h2 className="relative inline-block font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground">
            Getting Started is Easy
            <svg
              className="absolute -bottom-3 left-1/2 h-3 w-56 -translate-x-1/2 text-primary opacity-90"
              viewBox="0 0 220 12"
              fill="none"
              aria-hidden
            >
              <path
                d="M2 8 Q 55 -2, 110 6 T 218 4"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </h2>
          <p className="mt-8 text-base md:text-lg leading-relaxed text-muted-foreground font-normal">
            Three simple steps to arrange compassionate, hospital-grade care for your loved ones at home.
          </p>
        </motion.div>

        {/* 3-Column Horizontal Grid with Step 1, Step 2, Step 3 */}
        <div className="grid gap-6 md:grid-cols-3 max-w-7xl mx-auto">
          {steps.map((step, i) => (
            <motion.div
              key={step.stepLabel}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
              className={`group relative h-full rounded-[2.5rem] border ${step.border} ${step.bg} p-7 sm:p-8 transition-all duration-500 hover:shadow-xl hover:-translate-y-2 flex flex-col justify-between`}
            >
              <div>
                {/* Step Pill Badge & Big Number Watermark */}
                <div className="flex items-center justify-between w-full mb-8">
                  <span
                    className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-[0.15em] transition-transform duration-300 group-hover:scale-105 ${step.badgeBg}`}
                  >
                    {step.stepLabel}
                  </span>
                  <span className="font-display text-4xl font-extrabold opacity-20 select-none text-foreground/80 transition-opacity duration-300 group-hover:opacity-40">
                    {step.number}
                  </span>
                </div>

                {/* Content with Glowing Icon & Text */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-5">
                  {/* Icon Wrapper */}
                  <div
                    className={`shrink-0 relative grid h-20 w-20 place-items-center rounded-2xl ${step.iconBg} shadow-sm transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}
                  >
                    <div className="absolute inset-0 rounded-2xl bg-white opacity-40 blur-sm transition-opacity group-hover:opacity-80" />
                    <step.icon className="relative z-10 h-8 w-8" strokeWidth={2.2} />
                  </div>

                  {/* Title & Body */}
                  <div className="flex-1 mt-2 sm:mt-0">
                    <h3 className="font-display text-xl md:text-2xl font-bold text-foreground leading-snug group-hover:text-primary transition-colors duration-300">
                      {step.title}
                    </h3>
                    <p className="mt-3 text-sm md:text-[15px] leading-relaxed text-muted-foreground/90 font-normal">
                      {step.body}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom Decorative Connector Dot on Mobile / Indicator */}
              <div className="mt-8 pt-4 border-t border-black/5 flex items-center justify-between text-xs text-muted-foreground font-medium">
                <span>Guaranteed quality assistance</span>
                <span className="h-1.5 w-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
