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
      className="group relative flex flex-col overflow-hidden rounded-[20px] border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1"
    >
      {/* Photo */}
      <div className="relative aspect-[5/4] w-full overflow-hidden bg-gray-100">
        {photo ? (
          <img
            src={photo}
            alt={staff.name}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl font-bold text-gray-300">
            {staff.name.charAt(0)}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-3.5">
        {/* Name & Rating */}
        <div className="flex flex-col items-center gap-1.5 mb-5">
          <h3 className="text-[15px] font-medium text-gray-800 text-center">{staff.name}</h3>
          
          <div className="flex items-center justify-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star 
                key={i} 
                className={`h-3.5 w-3.5 ${
                  i < Math.round(staff.rating) ? "fill-[#ffb800] text-[#ffb800]" : "fill-gray-200 text-gray-200"
                }`} 
              />
            ))}
            <span className="ml-1 text-[13px] font-medium text-gray-700">{staff.rating}</span>
          </div>
        </div>

        {/* Duration Tabs */}
        <div className="flex justify-center gap-5 mb-2">
          {(["7", "15", "30"] as Duration[]).map((d) => (
            <button
              key={d}
              onClick={() => setDuration(d)}
              className="text-[13px] transition-colors"
            >
              {duration === d ? (
                <span className="text-primary font-bold">{d} Days</span>
              ) : (
                <span className="text-gray-500 font-medium">{d} Days</span>
              )}
            </button>
          ))}
        </div>

        {/* Service Label */}
        {staff.service_label && (
           <p className="text-[12px] text-center text-gray-500 mb-2">
             {staff.service_label}
           </p>
        )}
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
        <h2 className="font-display text-3xl md:text-4xl lg:text-5xl tracking-tight">Our Staff</h2>
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
                      className="min-w-0 flex-[0_0_70%] sm:flex-[0_0_45%]"
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
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-5">
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
