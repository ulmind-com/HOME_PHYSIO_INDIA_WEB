import { useState, useCallback, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Eye } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { staffQ } from "@/lib/api/queries";
import { Section, SectionHeader } from "@/components/site/Section";
import { useIsMobile } from "@/hooks/use-mobile";
import { imgUrl } from "@/lib/utils";
import type { StaffMember } from "@/lib/api/types";

type Duration = "7" | "15" | "30";

function StaffCard({ staff }: { staff: StaffMember }) {
  const [duration, setDuration] = useState<Duration>("7");
  const photo = imgUrl(staff.photo);

  const price =
    duration === "7"
      ? staff.price_7_days
      : duration === "15"
        ? staff.price_15_days
        : staff.price_30_days;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-white shadow-[0_2px_20px_rgba(0,0,0,0.06)] transition-all duration-300 hover:shadow-[0_8px_40px_rgba(0,0,0,0.12)] hover:border-primary/40 hover:-translate-y-1"
    >
      {/* Photo */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        {photo ? (
          <img
            src={photo}
            alt={staff.name}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl font-bold text-primary/20">
            {staff.name.charAt(0)}
          </div>
        )}
        
        {/* Premium gradient overlay */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4 gap-3">
        {/* Name & Rating */}
        <div className="flex flex-col items-center gap-1.5">
          <h3 className="text-base font-bold text-gray-900 leading-tight text-center">{staff.name}</h3>
          
          <div className="flex items-center justify-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star 
                key={i} 
                className={`h-3.5 w-3.5 ${
                  i < Math.round(staff.rating) ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"
                }`} 
              />
            ))}
            <span className="ml-1 text-xs font-semibold text-gray-700">{staff.rating}</span>
          </div>
        </div>

        {/* Duration Tabs */}
        <div className="flex gap-1 rounded-lg bg-gray-100 p-1 mt-1">
          {(["7", "15", "30"] as Duration[]).map((d) => (
            <button
              key={d}
              onClick={() => setDuration(d)}
              className={`relative flex-1 rounded-md py-1.5 text-[11px] font-semibold transition-all duration-200 ${
                duration === d
                  ? "text-white"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {duration === d && (
                <motion.div
                  layoutId={`duration-${staff.id}`}
                  className="absolute inset-0 rounded-md bg-primary shadow-sm"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{d} Days</span>
            </button>
          ))}
        </div>

        {/* Service Label */}
        {staff.service_label && (
           <p className="text-xs text-center text-gray-500 line-clamp-1">
             {staff.service_label}
           </p>
        )}

        {/* Price + CTA */}
        <div className="mt-auto flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-500 font-medium">Price:</span>
            <span className="text-sm font-bold text-gray-900">
              {price != null ? (
                <>₹{price.toLocaleString("en-IN")}</>
              ) : (
                <span className="text-xs text-gray-400">—</span>
              )}
            </span>
          </div>

          <button className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-1.5 text-xs font-bold text-white transition-all duration-200 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25 uppercase tracking-wide">
            Book Now
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* ---- Mobile Dot Indicators ---- */
function Dots({
  count,
  active,
  onSelect,
}: {
  count: number;
  active: number;
  onSelect: (i: number) => void;
}) {
  return (
    <div className="flex justify-center gap-2 mt-6">
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          onClick={() => onSelect(i)}
          className={`h-2 rounded-full transition-all duration-300 ${
            i === active ? "w-6 bg-primary" : "w-2 bg-primary/20"
          }`}
          aria-label={`Go to slide ${i + 1}`}
        />
      ))}
    </div>
  );
}

export function OurStaffSection() {
  const { data } = useQuery(staffQ({ limit: 50 }));
  const items = data?.items ?? [];

  /* Extract unique categories from API data, preserving order of first appearance */
  const categories = useMemo(() => {
    const seen = new Set<string>();
    const result: string[] = [];
    for (const s of items) {
      if (!seen.has(s.category)) {
        seen.add(s.category);
        result.push(s.category);
      }
    }
    return result;
  }, [items]);

  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  /* Default to first available category */
  useEffect(() => {
    if (!activeCategory && categories.length) {
      setActiveCategory(categories[0]);
    }
  }, [categories, activeCategory]);

  const filteredStaff = useMemo(
    () => items.filter((s) => s.category === activeCategory),
    [items, activeCategory],
  );

  const isMobile = useIsMobile();

  /* Embla for mobile carousel */
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    dragFree: false,
    align: "start",
    active: isMobile,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const onInit = useCallback((api: any) => setScrollSnaps(api.scrollSnapList()), []);
  const onSelect = useCallback((api: any) => setSelectedIndex(api.selectedScrollSnap()), []);

  useEffect(() => {
    if (!emblaApi) return;
    onInit(emblaApi);
    onSelect(emblaApi);
    emblaApi.on("reInit", onInit).on("reInit", onSelect).on("select", onSelect);
  }, [emblaApi, onInit, onSelect]);

  /* Reset carousel on category change */
  useEffect(() => {
    if (emblaApi) {
      emblaApi.scrollTo(0);
      setSelectedIndex(0);
    }
  }, [activeCategory, emblaApi]);

  if (!items.length) return null;

  return (
    <Section className="pt-4 pb-8 lg:pt-8 lg:pb-4">
      <div className="mb-6 max-w-3xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted-foreground mb-2">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          Our Staff
        </div>
        <h2 className="font-display text-3xl md:text-4xl lg:text-5xl tracking-tight">Meet Our Expert Caregivers</h2>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap justify-center gap-2 md:gap-3">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`relative rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300 ${
              activeCategory === cat
                ? "text-white shadow-lg shadow-primary/30"
                : "text-gray-600 bg-gray-100 hover:bg-gray-200 hover:text-gray-900"
            }`}
          >
            {activeCategory === cat && (
              <motion.div
                layoutId="staff-tab"
                className="absolute inset-0 rounded-full bg-primary"
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
              />
            )}
            <span className="relative z-10">{cat}</span>
          </button>
        ))}
      </div>

      {/* Staff Grid / Carousel */}
      <div className="mt-6">
        {isMobile ? (
          /* Mobile: Embla Carousel */
          <>
            <div className="overflow-hidden cursor-grab active:cursor-grabbing" ref={emblaRef}>
              <div className="flex gap-4 pl-1">
                <AnimatePresence mode="popLayout">
                  {filteredStaff.map((staff) => (
                    <div
                      key={staff.id}
                      className="min-w-0 flex-[0_0_80%] sm:flex-[0_0_55%]"
                    >
                      <StaffCard staff={staff} />
                    </div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
            {scrollSnaps.length > 1 && (
              <Dots
                count={scrollSnaps.length}
                active={selectedIndex}
                onSelect={(i) => emblaApi?.scrollTo(i)}
              />
            )}
          </>
        ) : (
          /* Desktop: Grid */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredStaff.map((staff) => (
                <StaffCard key={staff.id} staff={staff} />
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Empty state */}
        {filteredStaff.length === 0 && activeCategory && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-gray-400 text-sm">No staff members in this category yet.</p>
          </div>
        )}
      </div>
    </Section>
  );
}
