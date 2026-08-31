import { motion } from "framer-motion";
import { ShieldCheck, Stethoscope, Clock, HeartHandshake, Activity, Sparkles } from "lucide-react";
import { Section, SectionHeader } from "@/components/site/Section";
import { cn } from "@/lib/utils";

const REASONS = [
  {
    id: 1,
    title: "Hospital-Grade Expertise",
    description:
      "Our staff is trained in top-tier hospitals, ensuring clinical excellence at home.",
    icon: Stethoscope,
    gradient: "from-blue-500/20 to-cyan-500/20",
    iconColor: "text-blue-500",
  },
  {
    id: 2,
    title: "Verified & Trusted",
    description: "Every professional undergoes rigorous 5-step background and clinical checks.",
    icon: ShieldCheck,
    gradient: "from-emerald-500/20 to-teal-500/20",
    iconColor: "text-emerald-500",
  },
  {
    id: 3,
    title: "24/7 Dedicated Support",
    description: "Round-the-clock helpline and care coordinators for complete peace of mind.",
    icon: Clock,
    gradient: "from-orange-500/20 to-amber-500/20",
    iconColor: "text-orange-500",
  },
  {
    id: 4,
    title: "Compassionate Care",
    description: "We treat your loved ones like family, prioritizing empathy and respect.",
    icon: HeartHandshake,
    gradient: "from-rose-500/20 to-pink-500/20",
    iconColor: "text-rose-500",
  },
  {
    id: 5,
    title: "Advanced Equipment",
    description: "Premium ICU setup and specialized medical devices delivered to your door.",
    icon: Activity,
    gradient: "from-violet-500/20 to-purple-500/20",
    iconColor: "text-violet-500",
  },
  {
    id: 6,
    title: "Transparent Process",
    description:
      "Clear pricing, zero hidden fees, and straightforward care plans tailored for you.",
    icon: Sparkles,
    gradient: "from-amber-500/20 to-yellow-500/20",
    iconColor: "text-amber-500",
  },
];

export function WhyChooseUsSection() {
  return (
    <Section className="relative overflow-hidden bg-surface/30">
      {/* Decorative background elements (Optimized for performance) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-0 w-96 h-96 rounded-full opacity-30 bg-[radial-gradient(circle,var(--primary)_0%,transparent_70%)]" style={{ transform: 'translateZ(0)' }} />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 rounded-full opacity-30 bg-[radial-gradient(circle,var(--accent)_0%,transparent_70%)]" style={{ transform: 'translateZ(0)' }} />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        <SectionHeader
          align="center"
          eyebrow="The Home Physio India Advantage"
          title={
            <>
              Why Choose <span className="text-primary">Home Physio India</span>
            </>
          }
          description="Experience the perfect blend of clinical excellence, compassion, and reliability right in the comfort of your home."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-8 w-full">
          {REASONS.map((reason, i) => (
            <motion.div
              key={reason.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="group relative rounded-3xl p-[1px] bg-gradient-to-b from-border/50 to-transparent hover:from-primary/50 hover:to-accent/50 transition-colors duration-500 will-change-transform"
              style={{ transform: 'translateZ(0)' }}
            >
              <div className="relative h-full bg-surface/90 backdrop-blur-md rounded-[calc(1.5rem-1px)] p-8 overflow-hidden transition-transform duration-500 group-hover:scale-[0.98]">
                {/* Glow effect on hover */}
                <div
                  className={cn(
                    "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-br",
                    reason.gradient,
                  )}
                />

                <div className="relative z-10 flex flex-col h-full">
                  <div
                    className={cn(
                      "w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-surface shadow-sm border border-border/50 group-hover:scale-110 transition-transform duration-500",
                      reason.iconColor,
                    )}
                  >
                    <reason.icon className="w-7 h-7" strokeWidth={1.5} />
                  </div>

                  <h3 className="text-xl font-bold font-display mb-3 text-foreground group-hover:text-primary transition-colors duration-300">
                    {reason.title}
                  </h3>

                  <p className="text-muted-foreground leading-relaxed group-hover:text-foreground/80 transition-colors duration-300 mt-auto">
                    {reason.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}
