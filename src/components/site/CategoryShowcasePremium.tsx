import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import { useCallback, useEffect } from "react";
import type { Category } from "@/lib/api/types";
import { categoriesQ } from "@/lib/api/queries";
import { CategoryCardShape } from "./CategoryCardShape";
const nursingAsset = { url: "/assets/categories/nursing.jpg" };
const elderAsset = { url: "/assets/categories/elder.jpg" };
const physioAsset = { url: "/assets/categories/physio.jpg" };
const equipmentAsset = { url: "/assets/categories/equipment.jpg" };

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

export function CategoryShowcasePremium() {
  const { data: categoriesData } = useQuery(categoriesQ({ limit: 8 }));
  const categories = categoriesData?.items ?? [];
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { align: "start", loop: true, containScroll: "trimSnaps", breakpoints: { "(max-width: 767px)": { active: false } } },
    [
      AutoScroll({
        playOnInit: true,
        speed: 0.8,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
      }),
    ],
  );

  const scrollPrev = useCallback(() => {
    if (!emblaApi) return;
    const autoScroll = emblaApi.plugins().autoScroll;
    if (autoScroll) {
      autoScroll.stop();
    }
    emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (!emblaApi) return;
    const autoScroll = emblaApi.plugins().autoScroll;
    if (autoScroll) {
      autoScroll.stop();
    }
    emblaApi.scrollNext();
  }, [emblaApi]);

  // Restart auto-scroll when the manual scroll settles
  useEffect(() => {
    if (!emblaApi) return;
    const onSettle = () => {
      const autoScroll = emblaApi.plugins().autoScroll;
      if (autoScroll && !autoScroll.isPlaying()) {
        autoScroll.play();
      }
    };
    emblaApi.on("settle", onSettle);
    return () => {
      emblaApi.off("settle", onSettle);
    };
  }, [emblaApi]);

  const items = fallbacks.map((fb, i) => {
    const cat = categories[i];
    
    // Extract string URL if it's an ImageAsset object
    const imageStr = cat?.image 
      ? (typeof cat.image === "string" ? cat.image : cat.image.url) 
      : fb.image;

    return {
      title: cat?.name || fb.title,
      description: cat?.description || fb.description,
      image: imageStr || fb.image,
      slug: cat?.slug || "",
      variant: fb.variant,
    };
  });

  return (
    <div className="relative z-10 pt-16 lg:pt-24 pb-24 lg:pb-32 overflow-hidden">
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
        className="container-x mb-14 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end"
      >
        <div className="flex-1">
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
        <div className="flex flex-col items-start md:items-end gap-6 text-left md:text-right">
          <p className="max-w-md text-base leading-relaxed text-muted-foreground">
            Four pillars of premium home care — each designed around your family's unique rhythm and
            delivered by verified professionals.
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={scrollPrev}
              className="grid h-12 w-12 place-items-center rounded-full border border-border bg-surface text-foreground transition-all hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
              aria-label="Previous Category"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={scrollNext}
              className="grid h-12 w-12 place-items-center rounded-full border border-border bg-surface text-foreground transition-all hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
              aria-label="Next Category"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Carousel */}
      <div className="container-x">
        <div className="overflow-visible" ref={emblaRef}>
          <div className="flex flex-col gap-8 md:flex-row md:-ml-6 lg:-ml-8 md:gap-0">
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
                  className="min-w-0 w-full md:w-auto md:flex-[0_0_50%] lg:flex-[0_0_42%] md:pl-6 lg:pl-8"
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
      </div>
    </div>
  );
}
