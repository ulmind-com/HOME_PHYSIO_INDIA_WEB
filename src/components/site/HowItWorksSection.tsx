import { motion } from "framer-motion";
import { ShieldCheck, Sparkles } from "lucide-react";
import { HowItWorksBadge } from "./HowItWorksBadge";
import communityCare from "@/assets/community-care.jpeg.asset.json";

const steps = [
  {
    n: 1,
    variant: "primary" as const,
    title: "Book Consultation",
    body: "Tell us your needs online or over the phone. Our care expert will guide you.",
  },
  {
    n: 2,
    variant: "accent" as const,
    title: "Get a Custom Plan",
    body: "We create a personalised care plan tailored to your specific requirements and schedule.",
  },
  {
    n: 3,
    variant: "glow" as const,
    title: "Meet Your Caregiver",
    body: "We match you with a verified, trained, and compassionate caregiver from our team.",
  },
];

export function HowItWorksSection({ illustration }: { illustration?: string }) {
  const image = illustration || nurseCompanion.url;

  return (
    <section className="relative isolate overflow-hidden bg-background py-24 lg:py-32">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div
          className="absolute left-[6%] top-[18%] h-40 w-40 text-primary opacity-30"
          style={{
            backgroundImage: "radial-gradient(currentColor 1px, transparent 1px)",
            backgroundSize: "14px 14px",
          }}
        />
        <svg
          className="absolute -right-24 top-1/3 h-[480px] w-[480px] text-primary opacity-[0.08]"
          viewBox="0 0 200 200"
        >
          <path
            fill="currentColor"
            d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.5,90.1,-16.3,88.1,-1.2C86.1,13.8,79.4,27.7,70.6,39.6C61.8,51.5,50.9,61.5,38.3,68.6C25.7,75.7,11.5,79.9,-2.3,84.2C-16.1,88.5,-29.5,92.9,-41.7,87.8C-53.9,82.7,-64.9,68.1,-73.2,52.6C-81.5,37.1,-87.1,20.7,-86.4,4.4C-85.7,-11.9,-78.7,-28.1,-68.2,-41.3C-57.7,-54.5,-43.7,-64.7,-29.4,-71.8C-15.1,-78.9,-0.4,-82.9,13.6,-81.1C27.6,-79.3,41.2,-71.7,44.7,-76.4Z"
            transform="translate(100 100)"
          />
        </svg>
      </div>

      <div className="container-x relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-accent backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            How it works
          </div>
          <h2 className="relative inline-block font-display text-4xl tracking-tight md:text-5xl lg:text-6xl">
            Getting Started is Easy
            <svg
              className="absolute -bottom-3 left-1/2 h-3 w-56 -translate-x-1/2 text-primary"
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
          <p className="mt-8 text-base leading-relaxed text-muted-foreground md:text-lg">
            Follow these simple steps to arrange compassionate care for your loved ones — in three easy moves.
          </p>
        </motion.div>

        {/* Two-column layout */}
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          {/* LEFT: animated timeline */}
          <div className="relative order-2 lg:order-1">
            {/* Drawing connector */}
            <svg
              className="pointer-events-none absolute left-[39px] top-6 bottom-6 h-[calc(100%-3rem)] w-6 text-primary"
              viewBox="0 0 20 400"
              preserveAspectRatio="none"
              aria-hidden
            >
              <defs>
                <linearGradient id="hiw-connector" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="currentColor" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="currentColor" stopOpacity="0.15" />
                </linearGradient>
              </defs>
              <motion.path
                d="M10 0 Q 20 100, 10 200 T 10 400"
                fill="none"
                stroke="url(#hiw-connector)"
                strokeWidth="2.5"
                strokeDasharray="6 8"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 1.6, ease: "easeInOut" }}
              />
            </svg>

            <ol className="relative space-y-10">
              {steps.map((s, i) => (
                <motion.li
                  key={s.n}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.7, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                  className="group flex items-start gap-6"
                >
                  <motion.div
                    whileHover={{ scale: 1.08, rotate: -3 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  >
                    <HowItWorksBadge n={s.n} variant={s.variant} />
                  </motion.div>
                  <div className="flex-1 pt-2">
                    <h3 className="font-display text-2xl leading-tight text-foreground md:text-[1.65rem]">
                      {s.title}
                    </h3>
                    <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground md:text-base">
                      {s.body}
                    </p>
                  </div>
                </motion.li>
              ))}
            </ol>
          </div>

          {/* RIGHT: illustration card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, x: 30 }}
            whileInView={{ opacity: 1, scale: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative order-1 lg:order-2"
          >
            {/* Sculptural SVG backdrop */}
            <svg
              className="absolute -inset-4 -z-10 h-[calc(100%+2rem)] w-[calc(100%+2rem)] text-primary opacity-25"
              viewBox="0 0 400 400"
              aria-hidden
            >
              <defs>
                <linearGradient id="hiw-shape" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="currentColor" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="currentColor" stopOpacity="0.15" />
                </linearGradient>
              </defs>
              <path
                fill="url(#hiw-shape)"
                d="M60,80 C60,40 90,20 140,30 L300,50 C350,58 380,90 380,140 L370,300 C368,340 340,370 300,372 L110,378 C60,380 30,340 32,290 L60,80 Z"
              />
            </svg>

            <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary-soft via-surface to-background p-3 shadow-float ring-1 ring-black/5">
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="relative aspect-[4/5] overflow-hidden rounded-[2rem]"
              >
                <img
                  src={image}
                  alt="How Nupun home care works"
                  className="h-full w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/25 via-transparent to-transparent" />
              </motion.div>
            </div>

            {/* Floating "Verified caregivers" chip */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="glass absolute -bottom-6 -left-6 flex items-center gap-3 rounded-2xl p-4 shadow-soft lg:-left-10"
            >
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <div className="font-display text-sm font-semibold leading-none">Verified caregivers</div>
                <div className="mt-1 text-[11px] text-muted-foreground">Background-checked & trained</div>
              </div>
            </motion.div>

            {/* Floating sparkle badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.65, duration: 0.6 }}
              className="glass absolute -top-4 -right-4 flex items-center gap-2.5 rounded-2xl p-3 shadow-soft lg:-right-8"
            >
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent text-accent-foreground">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <div className="font-display text-sm font-semibold leading-none">Matched in 24h</div>
                <div className="mt-0.5 text-[10px] text-muted-foreground">Fast, personal care</div>
              </div>
            </motion.div>

            {/* Pulse ring decoration */}
            <div className="absolute -right-4 top-1/3 h-24 w-24 animate-pulse-ring rounded-full border-2 border-primary/20" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
