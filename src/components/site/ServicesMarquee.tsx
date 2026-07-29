import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, CalendarCheck } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { servicesQ } from "@/lib/api/queries";
import type { Service } from "@/lib/api/types";
const FALLBACK_IMAGES = [
  "/assets/services/nurse-elder.jpg",
  "/assets/services/nurse-companion.jpg",
  "/assets/services/physio.jpg",
  "/assets/services/mobility.jpg",
];

export function ServicesMarquee() {
  const { data } = useQuery(servicesQ({ limit: 12 }));
  const items = data?.items ?? [];

  // Ensure enough cards for a smooth loop — pad with fallbacks if under 4
  const base: Service[] =
    items.length >= 4
      ? items
      : [
          ...items,
          ...Array.from({ length: 4 - items.length }).map((_, i) => ({
            id: `placeholder-${i}`,
            title: ["Home Nursing", "Elder Care", "Physiotherapy", "Mobility Support"][i],
            slug: "",
            short_description:
              [
                "24/7 qualified nurses at your home.",
                "Compassionate daily companionship.",
                "In-home rehab by expert therapists.",
                "Assisted mobility & recovery.",
              ][i],
            featured_image: FALLBACK_IMAGES[i],
          })) as unknown as Service[],
        ];

  const track = [...base, ...base];

  return (
    <section className="relative isolate overflow-hidden bg-background py-24 lg:py-32">
      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div
          className="absolute left-[4%] top-[10%] h-40 w-40 opacity-30 text-primary"
          style={{
            backgroundImage: "radial-gradient(currentColor 1px, transparent 1px)",
            backgroundSize: "14px 14px",
          }}
        />
        <svg
          className="absolute -right-24 top-1/3 h-[420px] w-[420px] text-primary opacity-[0.08]"
          viewBox="0 0 200 200"
        >
          <path
            fill="currentColor"
            d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.5,90.1,-16.3,88.1,-1.2C86.1,13.8,79.4,27.7,70.6,39.6C61.8,51.5,50.9,61.5,38.3,68.6C25.7,75.7,11.5,79.9,-2.3,84.2C-16.1,88.5,-29.5,92.9,-41.7,87.8C-53.9,82.7,-64.9,68.1,-73.2,52.6C-81.5,37.1,-87.1,20.7,-86.4,4.4C-85.7,-11.9,-78.7,-28.1,-68.2,-41.3C-57.7,-54.5,-43.7,-64.7,-29.4,-71.8C-15.1,-78.9,-0.4,-82.9,13.6,-81.1C27.6,-79.3,41.2,-71.7,44.7,-76.4Z"
            transform="translate(100 100)"
          />
        </svg>
      </div>

      {/* Header */}
      <div className="container-x relative z-10 mb-14 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-accent backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Our Services
          </div>
          <h3 className="relative font-display text-4xl tracking-tight md:text-5xl lg:text-6xl">
            Care that meets you<br />where you are.
            <svg
              className="absolute -bottom-3 left-0 h-3 w-52 text-primary"
              viewBox="0 0 200 12"
              fill="none"
              aria-hidden
            >
              <path
                d="M2 8 Q 50 -2, 100 6 T 198 4"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </h3>
        </motion.div>
        <Link
          to="/services"
          className="group inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 px-5 py-2.5 text-sm font-semibold text-foreground backdrop-blur transition-all hover:border-primary/40 hover:bg-surface"
        >
          View all services
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* Marquee */}
      <div
        className="group relative"
        role="region"
        aria-label="Our services"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
        }}
      >
        <div className="flex w-max gap-6 animate-marquee-rtl motion-reduce:animate-none group-hover:[animation-play-state:paused]">
          {track.map((svc, i) => (
            <ServiceMarqueeCard
              key={`${svc.id}-${i}`}
              service={svc}
              index={(i % base.length) + 1}
              fallbackImage={FALLBACK_IMAGES[i % FALLBACK_IMAGES.length]}
            />
          ))}
        </div>
      </div>

      {/* Marquee animation styles */}
      <style>{`
        @keyframes marquee-rtl {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-rtl {
          animation: marquee-rtl 50s linear infinite;
        }
      `}</style>
    </section>
  );
}

function ServiceMarqueeCard({
  service,
  index,
  fallbackImage,
}: {
  service: Service;
  index: number;
  fallbackImage: string;
}) {
  const img = service.featured_image || fallbackImage;
  const hasSlug = !!service.slug;

  return (
    <article className="group/card relative w-[320px] shrink-0 overflow-hidden rounded-[2rem] bg-card shadow-[0_20px_60px_-30px_rgba(0,0,0,0.3)] ring-1 ring-black/5 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_40px_80px_-30px_rgba(0,0,0,0.4)]">
      {/* Image */}
      <div className="relative h-[280px] overflow-hidden">
        {hasSlug ? (
          <Link to="/services/$slug" params={{ slug: service.slug }} className="block h-full w-full">
            <img
              src={img}
              alt={service.title}
              className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover/card:scale-[1.08]"
              loading="lazy"
              decoding="async"
            />
          </Link>
        ) : (
          <img
            src={img}
            alt={service.title}
            className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover/card:scale-[1.08]"
            loading="lazy"
            decoding="async"
          />
        )}

        {/* Index chip */}
        <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-white/85 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-foreground backdrop-blur-md ring-1 ring-white/60">
          {String(index).padStart(2, "0")}
        </div>

        {/* Floating icon badge */}
        <div className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground shadow-[0_10px_30px_-10px_rgba(0,0,0,0.4)] ring-1 ring-white/40">
          <CalendarCheck className="h-4 w-4" />
        </div>

        {/* SVG wave divider into the text panel */}
        <svg
          className="pointer-events-none absolute inset-x-0 -bottom-px h-8 w-full text-card"
          viewBox="0 0 320 32"
          preserveAspectRatio="none"
          aria-hidden
        >
          <path
            d="M0,32 L0,18 C60,0 120,26 180,14 C240,4 280,18 320,10 L320,32 Z"
            fill="currentColor"
          />
        </svg>
      </div>

      {/* Text panel */}
      <div className="relative px-6 pb-6 pt-2">
        <h4 className="font-display text-xl leading-tight text-foreground line-clamp-1">
          {service.title}
        </h4>
        <p className="mt-2 line-clamp-2 min-h-[40px] text-sm leading-relaxed text-muted-foreground">
          {service.short_description || "Personalised premium care delivered at home."}
        </p>

        <Link
          to="/booking"
          search={hasSlug ? ({ service: service.slug } as never) : undefined}
          className="group/btn mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background transition-all hover:bg-primary hover:text-primary-foreground"
        >
          Book Now
          <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" />
        </Link>
      </div>
    </article>
  );
}
