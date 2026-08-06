import { motion } from "framer-motion";

const STEPS = [
  {
    num: "1",
    title: "Book Consultation",
    description:
      "Tell us your needs online or over the phone. Our care expert will guide you.",
  },
  {
    num: "2",
    title: "Get a Custom Plan",
    description:
      "We create a personalized care plan tailored to your specific requirements and schedule.",
  },
  {
    num: "3",
    title: "Meet Your Caregiver",
    description:
      "We match you with a verified, trained, and compassionate caregiver from our team.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="relative isolate overflow-hidden bg-background py-20 md:py-28 lg:py-32">
      <div className="container-x relative z-10 max-w-7xl mx-auto">
        {/* Centered Section Header utilizing Nupun Health brand styling */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-16 max-w-3xl text-center"
        >
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground">
            Getting Started is <span className="text-primary font-extrabold">Easy</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg md:text-xl leading-relaxed text-muted-foreground font-normal">
            Follow these simple steps to arrange compassionate care for your loved ones.
          </p>
        </motion.div>

        {/* Two-column Layout: Custom Brand Illustration & Vertical Timeline */}
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left Column: Custom Medical Vector Illustration with Seamless Blend */}
          <motion.div
            initial={{ opacity: 0, x: -40, scale: 0.95 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-6 flex items-center justify-center relative"
          >
            {/* Soft background aura using brand primary color */}
            <div className="absolute inset-0 max-w-md mx-auto aspect-square rounded-full bg-primary/10 blur-3xl -z-10" />

            <div className="relative w-full max-w-xl mx-auto overflow-hidden bg-transparent transition-all duration-500 hover:scale-[1.02]">
              <img
                src="/assets/home-care-steps.png"
                alt="Compassionate home healthcare consultation and scheduling illustration"
                className="w-full h-auto object-contain mix-blend-multiply drop-shadow-xl"
              />
            </div>
          </motion.div>

          {/* Right Column: Vertical Timeline matching Nupun Health typography and palette */}
          <div className="lg:col-span-6 pl-2 sm:pl-6">
            <div className="flex flex-col gap-10 sm:gap-12 relative">
              {STEPS.map((step, idx) => (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.6, delay: idx * 0.15, ease: [0.22, 1, 0.36, 1] }}
                  className="relative flex items-start gap-6 sm:gap-8 group"
                >
                  {/* Vertical Dotted Connector Line */}
                  {idx < STEPS.length - 1 && (
                    <div className="absolute left-[26px] sm:left-[30px] top-[64px] h-[calc(100%-36px)] w-0.5 border-l-[3px] border-dotted border-primary/30 group-hover:border-primary transition-colors duration-300" />
                  )}

                  {/* Brand Styled Circle Badge */}
                  <div className="shrink-0 z-10 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary/10 text-primary border border-primary/20 font-display text-2xl sm:text-3xl font-extrabold flex items-center justify-center shadow-sm group-hover:scale-105 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                    {step.num}
                  </div>

                  {/* Step Content */}
                  <div className="pt-1 sm:pt-1.5 flex-1">
                    <h3 className="font-display text-xl sm:text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm sm:text-base leading-relaxed text-muted-foreground font-normal">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
