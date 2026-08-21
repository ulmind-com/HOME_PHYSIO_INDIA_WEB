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
const nursingAsset = { url: "/assets/categories/nursing-v2.jpg?v=2" };
const elderAsset = { url: "/assets/categories/elder.jpg?v=2" };
const motherBabyAsset = { url: "/assets/categories/mother-baby.png" };
const physioAsset = { url: "/assets/categories/physio-v2.jpg?v=2" };
const equipmentAsset = { url: "/assets/categories/equipment-v2.jpg?v=2" };
const icuSetupAsset = { url: "/assets/categories/icu-setup.png" };
const homeSampleAsset = { url: "/assets/categories/home-sample.png" };

type Variant = "a" | "b" | "c" | "d";

const fallbacks: Array<{ title: string; description: string; image: string; variant: Variant; dedicatedLink?: string }> = [
  {
    title: "Infection Control Nurse Services",
    description: "Professional infection prevention & control support, training and guidance for healthcare settings.",
    image: "/assets/ic_nurse_desktop.jpg",
    variant: "d",
    dedicatedLink: "/infection-control-nurse",
  },
  {
    title: "Home Nursing Care",
    description: "24/7 qualified nurses at your home — injections, wound care, monitoring.",
    image: nursingAsset.url,
    variant: "a",
    dedicatedLink: "/nursing-care",
  },
  {
    title: "Elderly Care",
    description: "Compassionate daily companionship and assisted living support.",
    image: elderAsset.url,
    variant: "b",
    dedicatedLink: "/elderly-care",
  },
  {
    title: "Mother & Baby Care",
    description: "Expert postnatal care for new mothers & newborns — feeding support, baby care & recovery.",
    image: motherBabyAsset.url,
    variant: "c",
    dedicatedLink: "/mother-baby-care",
  },
  {
    title: "Physiotherapy & Recovery",
    description: "In-home rehab, mobility & pain management by expert therapists.",
    image: physioAsset.url,
    variant: "b",
    dedicatedLink: "/physiotherapy",
  },
  {
    title: "Medical Equipment Rental",
    description: "Hospital-grade beds, oxygen, monitors — delivered & installed.",
    image: equipmentAsset.url,
    variant: "d",
    dedicatedLink: "/medical-equipment",
  },
  {
    title: "ICU Setup",
    description: "Complete home ICU setup with ventilators, monitors & trained ICU nurses round the clock.",
    image: icuSetupAsset.url,
    variant: "a",
    dedicatedLink: "/icu-setup",
  },
  {
    title: "Home Sample Collection",
    description: "Convenient at-home blood tests & lab sample collection by certified phlebotomists.",
    image: homeSampleAsset.url,
    variant: "c",
    dedicatedLink: "/sample-collection",
  },
];

export function usePremiumCategories() {
  const { data: categoriesData } = useQuery(categoriesQ({ limit: 10 }));
  const categories = [...(categoriesData?.items ?? [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return fallbacks.map((fb) => {
    // Match by trimmed name only — avoids the positional fallback grabbing the
    // wrong category when two categories share the same `order` (e.g. the new
    // Injection/Infection categories both use order 8) and tolerates stray
    // whitespace in DB names like "Infection Control Nurse Services ".
    const cat = categories.find(
      (c) => c.name?.trim().toLowerCase() === fb.title.trim().toLowerCase(),
    );
    
    // Extract string URL if it's an ImageAsset object
    let imageStr = cat?.image 
      ? (typeof cat.image === "string" ? cat.image : cat.image.url) 
      : fb.image;

    if (imageStr && !imageStr.includes("?")) {
      imageStr = `${imageStr}?v=2`;
    }

    // Detect dedicated landing pages by slug or name matching
    const catNameLower = (cat?.name ?? "").toLowerCase();
    const catSlugLower = (cat?.slug ?? "").toLowerCase();
    const dedicatedLink =
      catNameLower.includes("infection") || catSlugLower.includes("infection")
        ? "/infection-control-nurse"
        : catNameLower.includes("elder") || catNameLower.includes("senior") || catSlugLower.includes("elder")
        ? "/elderly-care"
        : catNameLower.includes("nurs") || catSlugLower.includes("nurs")
        ? "/nursing-care"
        : catNameLower.includes("mother") || catNameLower.includes("baby") || catSlugLower.includes("mother")
        ? "/mother-baby-care"
        : catNameLower.includes("physio") || catSlugLower.includes("physio")
        ? "/physiotherapy"
        : catNameLower.includes("equip") || catSlugLower.includes("equip")
        ? "/medical-equipment"
        : catNameLower.includes("icu") || catSlugLower.includes("icu")
        ? "/icu-setup"
        : catNameLower.includes("sample") || catSlugLower.includes("sample")
        ? "/sample-collection"
        : fb.dedicatedLink ?? null;

    return {
      title: cat?.name || fb.title,
      description: cat?.description || fb.description,
      image: imageStr || fb.image,
      slug: cat?.slug || "",
      variant: fb.variant,
      dedicatedLink,
    };
  });
}

export function CategoryShowcasePremium() {
  const items = usePremiumCategories();
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

  return (
    <div className="relative z-10 pt-4 lg:pt-4 pb-8 lg:pb-12 overflow-hidden">
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
        className="container-x mb-14 flex flex-col items-center text-center"
      >
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-accent backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          What we specialize in
        </div>
        <h3 className="relative font-display text-4xl tracking-tight md:text-5xl lg:text-6xl flex justify-center">
          Our Categories
          <svg
            className="absolute -bottom-3 left-1/2 -translate-x-1/2 h-3 w-40 text-primary"
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

        <div className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground">
          Pillars of premium home care — each designed around your family's unique rhythm and
          delivered by verified professionals.
        </div>
        
        <div className="mt-8 flex items-center gap-2">
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
                "group relative block aspect-[4/3] w-full overflow-hidden rounded-[2rem] shadow-[0_20px_60px_-30px_rgba(0,0,0,0.35)] ring-1 ring-black/5 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_40px_80px_-30px_rgba(0,0,0,0.45)] md:aspect-[16/11] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary";

              return (
                <motion.div
                  key={item.title + i}
                  className="min-w-0 w-full md:w-auto md:flex-[0_0_50%] lg:flex-[0_0_38%] md:pl-6 lg:pl-8"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                >
                  {item.dedicatedLink ? (
                    <Link to={item.dedicatedLink as any} className={cardClasses}>
                      {CardInner}
                    </Link>
                  ) : item.slug ? (
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
