import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowRight, Check, ShieldCheck, Sparkles, HeartPulse } from "lucide-react";
import { servicesQ } from "@/lib/api/queries";
import { NursingBookingModal } from "@/components/forms/NursingBookingModal";

type ServiceStaticCard = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  badge: string;
  highlight: string;
  features: string[];
  buttonText: string;
  buttonLink: string;
};

const DEFAULT_SERVICES: ServiceStaticCard[] = [
  {
    id: "physio",
    eyebrow: "Physiotherapy & Rehab",
    title: "Expert Physiotherapy",
    description:
      "Our certified physiotherapists deliver hospital-grade rehabilitation directly at your doorstep — specializing in fast, structured recovery and chronic pain relief.",
    image: "/assets/hero-slide-1.jpeg",
    badge: "98% Recovery Rate",
    highlight: "45+ Senior Physiotherapists",
    features: [
      "Post-Surgical & Orthopedic Recovery",
      "Stroke & Neurological Rehabilitation",
      "Chronic Pain & Mobility Management",
      "Personalized Home Exercise Regimens",
    ],
    buttonText: "Book Physiotherapy",
    buttonLink: "/booking",
  },
  {
    id: "elder",
    eyebrow: "Elderly Care",
    title: "Compassionate Senior Care",
    description:
      "Dedicated attendants and qualified nurses providing 24/7 assisted elderly care — combining medical assistance, hygiene, mobility support, and emotional companionship.",
    image: "/assets/hero-slide-2.jpeg",
    badge: "24/7 Assistance",
    highlight: "200+ Verified Attendants",
    features: [
      "Round-the-Clock Bedside Attendants",
      "Daily Living, Hygiene & Mobility Aid",
      "Timed Medication & Vitals Monitoring",
      "Specialized Memory & Dementia Support",
    ],
    buttonText: "Explore Elderly Care",
    buttonLink: "/elderly-care",
  },
  {
    id: "nursing",
    eyebrow: "Skilled Nursing",
    title: "Clinical Nursing at Home",
    description:
      "From intensive wound dressing and IV infusions to post-operative monitoring — our background-checked registered nurses deliver ICU-level precision with tenderness.",
    image: "/assets/hero-slide-3.jpeg",
    badge: "Top 4% Vetted Nurses",
    highlight: "Hospital-Grade Standards",
    features: [
      "Post-Operative & Intensive ICU Care",
      "IV Injections, Infusions & Catheterization",
      "Complex Wound & Pressure Ulcer Care",
      "Continuous Vitals & Doctor Surveillance",
    ],
    buttonText: "Get Nursing Care",
    buttonLink: "/nursing-care",
  },
  {
    id: "rehab",
    eyebrow: "Rehabilitation",
    title: "Specialized Rehabilitation",
    description:
      "Multidisciplinary therapies designed to restore confidence and self-sufficiency following cardiopulmonary episodes, severe illness, or traumatic injury.",
    image: "/assets/hero-slide-4.jpeg",
    badge: "1hr Quick Setup",
    highlight: "30+ Therapy Specialties",
    features: [
      "Cardiac & Pulmonary Recovery Plans",
      "Speech & Swallowing Restoration Therapy",
      "Occupational & Ergonomic Home Adaptations",
      "Regular Doctor-Led Progress Assessments",
    ],
    buttonText: "Start Rehab Plan",
    buttonLink: "/booking",
  },
];

export function ComprehensiveServicesSection() {
  const { data: servicesData } = useQuery(servicesQ({ limit: 4 }));
  const rawItems = servicesData?.items ?? [];

  // Use services from admin panel if present, else default to Aroha Cares style 4 cards
  const services: ServiceStaticCard[] = rawItems.length > 0
    ? rawItems.slice(0, 4).map((s, i) => {
        // Handle ImageAsset or string gracefully
        const imageStr = typeof s.featured_image === "string"
          ? s.featured_image
          : (s.featured_image as any)?.url || DEFAULT_SERVICES[i]?.image || "/assets/community-care.jpeg";

        return {
          id: s.id || `custom-${i}`,
          eyebrow: s.category_name || DEFAULT_SERVICES[i]?.eyebrow || "Service",
          title: s.title || DEFAULT_SERVICES[i]?.title || "Care Service",
          description: s.short_description || s.description || DEFAULT_SERVICES[i]?.description || "",
          image: imageStr,
          badge: s.price ? `Starts at ₹${s.price}` : (DEFAULT_SERVICES[i]?.badge || "Verified Care"),
          highlight: s.features?.[0] || DEFAULT_SERVICES[i]?.highlight || "Hospital-Grade",
          features: (s.features?.length ?? 0) > 1
            ? s.features!.slice(1, 5)
            : DEFAULT_SERVICES[i]?.features || [
                "Personalized home care plan",
                "Qualified & verified professionals",
                "24/7 dedicated advisor support",
                "Regular vitals monitoring & reports",
              ],
          buttonText: "Book Service",
          buttonLink: `/services/${s.slug || ""}`,
        };
      })
    : DEFAULT_SERVICES;

  return (
    <section className="relative w-full bg-background py-20 md:py-28 lg:py-32 overflow-hidden">
      {/* Decorative background grid & blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute top-1/4 -left-32 h-96 w-96 rounded-full bg-primary/5 blur-[100px]" />
        <div className="absolute bottom-1/3 -right-32 h-96 w-96 rounded-full bg-accent/5 blur-[100px]" />
        <div
          className="absolute left-[5%] bottom-[10%] h-40 w-40 opacity-20 text-primary"
          style={{
            backgroundImage: "radial-gradient(currentColor 1px, transparent 1px)",
            backgroundSize: "16px 16px",
          }}
        />
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
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            What We Provide
          </div>
          <h2 className="relative inline-block font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground">
            Our Comprehensive Services
            <svg
              className="absolute -bottom-3 left-1/2 h-3 w-56 -translate-x-1/2 text-primary opacity-90"
              viewBox="0 0 220 12"
              fill="none"
              aria-hidden="true"
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
            Four specialized clinical pillars designed around your family’s recovery and well-being — combining hospital-grade medical precision with compassionate, attentive home care.
          </p>
        </motion.div>

        {/* 4 Detailed Static Cards (2x2 Grid, Aroha Cares Style) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 max-w-7xl mx-auto">
          {services.map((service, idx) => (
            <article
              key={service.id}
              className="group relative flex flex-col overflow-hidden rounded-[2.5rem] border border-border/80 bg-surface/95 shadow-[0_15px_45px_-10px_rgba(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_25px_65px_-15px_rgba(0,0,0,0.15)] hover:border-primary/50"
            >
              {/* Media Header */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
                <img
                  src={service.image}
                  alt={service.title}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/10 transition-opacity duration-500 group-hover:opacity-90" />

                {/* Top Badges */}
                <div className="absolute top-5 left-5 right-5 flex items-center justify-between gap-2 z-10 pointer-events-none">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-black/40 border border-white/20 backdrop-blur-md px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-white shadow-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                    {service.eyebrow}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/95 text-foreground px-3 py-1.5 text-[11px] font-semibold tracking-wide shadow-md">
                    <Sparkles className="h-3.5 w-3.5 text-primary" />
                    {service.badge}
                  </span>
                </div>

                {/* Bottom Image Overlay text */}
                <div className="absolute bottom-5 left-5 right-5 z-10">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/90 drop-shadow-md">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                    {service.highlight}
                  </span>
                </div>
              </div>

              {/* Card Body & Features */}
              <div className="flex flex-1 flex-col justify-between p-7 md:p-9">
                <div>
                  <h3 className="font-display text-2xl md:text-3xl font-semibold leading-tight text-foreground transition-colors duration-300 group-hover:text-primary">
                    {service.title}
                  </h3>
                  <p className="mt-3 text-sm md:text-[15px] leading-relaxed text-muted-foreground">
                    {service.description}
                  </p>

                  <div className="my-6 h-px w-full bg-border/60" />

                  <div className="mb-4 text-xs font-bold uppercase tracking-[0.15em] text-foreground/70 flex items-center gap-2">
                    <HeartPulse className="h-4 w-4 text-primary" />
                    Key Treatments & Care Included
                  </div>

                  <ul className="space-y-3">
                    {service.features.map((feat, fIndex) => (
                      <li key={fIndex} className="flex items-start gap-3 text-sm font-medium text-foreground/85">
                        <div className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary/15 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
                          <Check className="h-3.5 w-3.5" strokeWidth={3} />
                        </div>
                        <span className="leading-snug">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Actions Footer */}
                <div className="mt-8 pt-5 border-t border-border/50 flex items-center justify-between gap-4">
                  <Link
                    to={service.buttonLink as any}
                    className="text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
                  >
                    Learn More →
                  </Link>

                  <NursingBookingModal defaultService={service.title}>
                    <button
                      className="group/btn relative overflow-hidden rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-white shadow-[0_10px_25px_-5px_var(--color-primary),0.4)] transition-all duration-300 hover:bg-primary/90 hover:-translate-y-0.5 hover:shadow-[0_15px_30px_-5px_var(--color-primary),0.6)]"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        {service.buttonText}
                        <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                      </span>
                      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-[800ms] ease-out group-hover/btn:translate-x-full" />
                    </button>
                  </NursingBookingModal>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
