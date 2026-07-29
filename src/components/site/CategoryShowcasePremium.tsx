import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { Service } from "@/lib/api/types";
import { CategoryCardShape } from "./CategoryCardShape";
import nursingAsset from "@/assets/categories/nursing.jpg.asset.json";
import elderAsset from "@/assets/categories/elder.jpg.asset.json";
import physioAsset from "@/assets/categories/physio.jpg.asset.json";
import equipmentAsset from "@/assets/categories/equipment.jpg.asset.json";

type Variant = "a" | "b" | "c" | "d";

const fallbacks: Array<{ title: string; description: string; image: string; variant: Variant }> = [
  {
    title: "Home Nursing Care",
    description: "24/7 qualified nurses at your home — injections, wound care, monitoring.",
    image: nursingAsset.url,
    variant: "a",
  },
  {
    title: "Elder Care",
    description: "Compassionate daily companionship and assisted living support.",
    image: elderAsset.url,
    variant: "b",
  },
  {
    title: "Physiotherapy & Recovery",
    description: "In-home rehab, mobility & pain management by expert therapists.",
    image: physioAsset.url,
    variant: "c",
  },
  {
    title: "Medical Equipment Rental",
    description: "Hospital-grade beds, oxygen, monitors — delivered & installed.",
    image: equipmentAsset.url,
    variant: "d",
  },
];

export function CategoryShowcasePremium({ services }: { services: Service[] }) {
  const items = fallbacks.map((fb, i) => {
    const svc = services[i];
    return {
      title: svc?.title || fb.title,
      description: svc?.short_description || fb.description,
      image: svc?.featured_image || fb.image,
      slug: svc?.slug || "",
      variant: fb.variant,
    };
  });

  return (
    <div className="relative z-10 container-x pb-24 lg:pb-32">
      {/* Decorative background dots */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
        <div
          className="absolute right-[6%] top-[8%] h-40 w-40 opacity-30"
          style={{
            backgroundImage: "radial-gradient(currentColor 1px, transparent 1px)",
            backgroundSize: "14px 14px",
            color: "var(--primary)",
          }}
        />
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-14 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end"
      >
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-accent backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            What we specialize in
          </div>
          <h3 className="relative font-display text-4xl tracking-tight md:text-5xl lg:text-6xl">
            Our Categories
            <svg
              className="absolute -bottom-3 left-0 h-3 w-40 text-primary"
              viewBox="0 0 160 12"
              fill="none"
              aria-hidden
            >
              <path
                d="M2 8 Q 40 -2, 80 6 T 158 4"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </h3>
        </div>
        <p className="max-w-md text-base leading-relaxed text-muted-foreground">
          Four pillars of premium home care — each designed around your family's unique rhythm and delivered by
          verified professionals.
        </p>
      </motion.div>

      {/* Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
        {items.map((item, i) => {
          const CardInner = (
            <>
              {/* Image */}
              <div className="absolute inset-0">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.08]"
                  loading="lazy"
                  decoding="async"
                />
              </div>

              {/* Base darkening for legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

              {/* Unique SVG shape overlay (themed mint) */}
              <div className="absolute inset-0 text-primary opacity-90 mix-blend-multiply transition-opacity duration-500 group-hover:opacity-95">
                <CategoryCardShape variant={item.variant} className="h-full w-full" />
              </div>

              {/* Index */}
              <div className="absolute left-6 top-6 flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-white backdrop-blur-md ring-1 ring-white/20">
                <span>{String(i + 1).padStart(2, "0")}</span>
                <span className="opacity-60">/ {String(items.length).padStart(2, "0")}</span>
              </div>

              {/* Text */}
              <div className="absolute inset-x-0 bottom-0 p-7 md:p-9">
                <h4 className="font-display text-2xl leading-tight text-white drop-shadow-sm md:text-3xl lg:text-[2rem]">
                  {item.title}
                </h4>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-white/85 opacity-0 translate-y-2 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0 md:text-[15px]">
                  {item.description}
                </p>
              </div>

              {/* Arrow */}
              <div className="absolute bottom-6 right-6 md:bottom-8 md:right-8">
                <div className="grid h-14 w-14 place-items-center rounded-full bg-white/95 text-foreground shadow-[0_10px_30px_-10px_rgba(0,0,0,0.4)] ring-1 ring-white/60 backdrop-blur transition-all duration-500 group-hover:bg-primary group-hover:text-primary-foreground group-hover:rotate-45">
                  <ArrowUpRight className="h-5 w-5" />
                </div>
              </div>
            </>
          );

          const cardClasses =
            "group relative block aspect-[4/5] w-full overflow-hidden rounded-[2rem] shadow-[0_20px_60px_-30px_rgba(0,0,0,0.35)] ring-1 ring-black/5 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_40px_80px_-30px_rgba(0,0,0,0.45)] md:aspect-[16/11] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary";

          return (
            <motion.div
              key={item.title + i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              {item.slug ? (
                <Link to="/services/$slug" params={{ slug: item.slug }} className={cardClasses}>
                  {CardInner}
                </Link>
              ) : (
                <div className={cardClasses}>{CardInner}</div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
