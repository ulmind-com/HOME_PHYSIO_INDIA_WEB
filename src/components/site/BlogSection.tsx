import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import { blogsQ } from "@/lib/api/queries";
import { Section, SectionHeader } from "@/components/site/Section";
import { BlogCard } from "@/components/site/cards/BlogCard";
import { useIsMobile } from "@/hooks/use-mobile";

const DEFAULT_BLOGS: any[] = [
  {
    id: "1",
    title: "How to Ensure Safety & Comfort for Seniors Recovering at Home",
    slug: "senior-home-recovery-safety",
    category_name: "Elder Care",
    excerpt:
      "Essential guidelines for home adaptations, fall prevention, and vitals monitoring to create a safe post-hospitalization healing sanctuary.",
    author_name: "Dr. A. Sengupta",
    read_time: "4",
    featured_image: "/assets/hero-slide-2.jpg",
    published_at: "2026-07-28T10:00:00Z",
  },
  {
    id: "2",
    title: "Understanding In-Home Physiotherapy: Timeline & Milestones",
    slug: "in-home-physiotherapy-milestones",
    category_name: "Physiotherapy",
    excerpt:
      "What to expect during orthopedic or stroke rehabilitation, and why familiarity of home accelerates cognitive and physical recovery.",
    author_name: "S. Roy, PT",
    read_time: "5",
    featured_image: "/assets/hero-slide-1.jpg",
    published_at: "2026-07-22T10:00:00Z",
  },
  {
    id: "3",
    title: "When Do You Need Skilled ICU Nursing Care at Home?",
    slug: "skilled-icu-nursing-at-home-guide",
    category_name: "Skilled Nursing",
    excerpt:
      "A step-by-step assessment guide for families evaluating round-the-clock ventilator, tracheostomy, or palliative nursing care.",
    author_name: "Nurse Lead Team",
    read_time: "3",
    featured_image: "/assets/hero-slide-3.jpg",
    published_at: "2026-07-15T10:00:00Z",
  },
];

export function BlogSection() {
  const { data: blogs } = useQuery(blogsQ({ limit: 6 }));
  const rawItems = blogs?.items ?? [];
  const bItems = rawItems.length ? rawItems : [...DEFAULT_BLOGS, ...DEFAULT_BLOGS];

  const isMobile = useIsMobile();
  const plugins = !isMobile ? [
    AutoScroll({
      playOnInit: true,
      speed: 1.2,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
      direction: "forward",
    })
  ] : [];

  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true, 
    dragFree: !isMobile, 
    align: "start" 
  }, plugins);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const onInit = useCallback((api: any) => {
    setScrollSnaps(api.scrollSnapList());
  }, []);

  const onSelect = useCallback((api: any) => {
    setSelectedIndex(api.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    onInit(emblaApi);
    onSelect(emblaApi);
    emblaApi.on("reInit", onInit);
    emblaApi.on("reInit", onSelect);
    emblaApi.on("select", onSelect);
  }, [emblaApi, onInit, onSelect]);

  return (
    <Section className="overflow-hidden pt-10 pb-2 lg:pt-12 lg:pb-4">
      <div className="md:flex items-end justify-between mb-10">
        <SectionHeader
          eyebrow="Care Blog"
          title="Latest from Our Care Blog"
          align="center"
        />
      </div>

      <div className="-mx-4 md:-mx-8">
        <div className="overflow-hidden cursor-grab active:cursor-grabbing" ref={emblaRef}>
          <div className="flex pl-4 md:pl-8">
            {[...bItems, ...bItems, ...bItems].map((b, i) => (
              <div
                key={`${b.id}-${i}`}
                className="min-w-0 flex-[0_0_58%] sm:flex-[0_0_40%] md:flex-[0_0_27%] lg:flex-[0_0_21%] pr-4 md:pr-6"
              >
                <BlogCard blog={b} />
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {isMobile && (
        <div className="flex justify-center gap-2 mt-6">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              onClick={() => emblaApi?.scrollTo(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === selectedIndex ? "w-6 bg-primary" : "w-2 bg-primary/20"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
      
    </Section>
  );
}
