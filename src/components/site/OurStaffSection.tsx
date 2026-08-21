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
      <div className="relative aspect-[5/4] w-full overflow-hidden bg-gray-100 rounded-b-[20px]">
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
      <div className="flex flex-1 flex-col p-3">
        {/* Name & Rating */}
        <div className="flex flex-col items-center gap-1 mb-2.5">
          <h3 className="text-[14px] font-medium text-gray-800 text-center leading-tight">{staff.name}</h3>
          
          <div className="flex items-center justify-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star 
                key={i} 
                className={`h-3 w-3 ${
                  i < Math.round(staff.rating) ? "fill-[#ffb800] text-[#ffb800]" : "fill-gray-200 text-gray-200"
                }`} 
              />
            ))}
            <span className="ml-1 text-[12px] font-medium text-gray-700">{staff.rating}</span>
          </div>
        </div>

        {/* Duration Tabs */}
        <div className="flex justify-center gap-3 mt-1">
          {(["7", "15", "30"] as Duration[]).map((d) => (
            <button
              key={d}
              onClick={() => setDuration(d)}
              className="text-[11px] transition-colors"
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
           <p className="text-[11px] text-center text-gray-400 mt-2">
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
  const { data, isLoading, isError } = useQuery(staffQ({ limit: 50 }));
  const items = data?.items ?? [];

  // ... (keeping categories logic)

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

  if (isLoading) {
    return (
      <Section className="pt-4 pb-8 lg:pt-8 lg:pb-4">
        <div className="mb-6 max-w-3xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl tracking-tight">Our Staff</h2>
        </div>
        <div className="flex justify-center py-10">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </Section>
    );
  }

  if (isError || !items.length) return null;

  return (
    <Section className="pt-4 pb-8 lg:pt-8 lg:pb-4">
      <div className="mb-6 max-w-3xl mx-auto text-center">
        <h2 className="font-display text-3xl md:text-4xl lg:text-5xl tracking-tight">Our Staff</h2>
      </div>

      {/* Category Tabs */}
      <div className="relative mb-8 mt-6">
        <div className="flex overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] w-full px-4 md:px-0 mx-auto md:w-max min-w-full md:min-w-0 md:justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-4 py-3 text-[15px] font-medium transition-colors relative ${
                activeCategory === cat
                  ? "text-[#F97316]"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {cat}
              {activeCategory === cat && (
                <motion.div
                  layoutId="staff-tab"
                  className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-[#F97316]"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Staff Grid / Carousel */}
      <div className="mt-6">
        {isMobile ? (
          /* Mobile: Native Horizontal Scroll */
          <div className="flex overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] snap-x snap-mandatory gap-4 px-4 pb-4 w-full">
            <AnimatePresence mode="popLayout">
              {filteredStaff.map((staff) => (
                <div
                  key={staff.id}
                  className="w-[55%] sm:w-[40%] shrink-0 snap-center"
                >
                  <StaffCard staff={staff} />
                </div>
              ))}
            </AnimatePresence>
          </div>
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
