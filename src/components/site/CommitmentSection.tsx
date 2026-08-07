import { motion } from "framer-motion";
import { BadgeCheck } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { settingsQ } from "@/lib/api/queries";

const DEFAULT_COMMITMENTS = [
  "2-hour caregiver replacement SLA",
  "Background-verified & trained staff",
  "Clinical oversight on invasive care",
  "Transparent hourly / daily pricing",
  "WhatsApp shift updates & vitals",
  "24/7 care desk, always reachable",
];

export function CommitmentSection() {
  const { data: settings } = useQuery(settingsQ());
  const COMMITMENTS = settings?.about_commitments?.length
    ? settings.about_commitments
    : DEFAULT_COMMITMENTS;

  return (
    <section className="relative overflow-hidden rounded-[2.5rem] mx-4 lg:mx-auto max-w-[1400px] shadow-2xl shadow-primary/20 my-16">
      {/* Background Image */}
      <div className="absolute inset-0 -z-20">
        <img
          src="/assets/hero-slide-1.jpeg"
          alt="Commitment to excellence"
          className="w-full h-full object-cover object-center"
        />
      </div>
      {/* Premium Gradient Overlay */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#179686]/95 via-[#117669]/90 to-[#0A4A41]/95 mix-blend-multiply" />
      <div className="absolute inset-0 -z-10 bg-primary/40 backdrop-blur-[2px]" />
      <div className="container-x py-20 text-primary-foreground lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]">
              <BadgeCheck className="h-3.5 w-3.5" /> Our commitment to excellence
            </div>
            <h2 className="font-display text-4xl tracking-tight md:text-5xl">
              Standards we won't compromise on.
            </h2>
            <p className="mt-5 max-w-lg text-white/80">
              We go beyond standard care to protect your peace of mind and your loved one's
              well-being — every visit, every time.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {COMMITMENTS.map((c, i) => (
              <motion.div
                key={c}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.05 }}
                className="flex items-start gap-3 rounded-2xl border border-white/15 bg-white/10 p-4 text-sm backdrop-blur"
              >
                <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-white" />
                <span className="text-white/90">{c}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
