import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import { testimonialsQ } from "@/lib/api/queries";
import { Section, SectionHeader } from "@/components/site/Section";
import { TestimonialCard } from "@/components/site/cards/TestimonialCard";
import { useIsMobile } from "@/hooks/use-mobile";

// Fallback testimonials if none are returned by API
const DEFAULT_TESTIMONIALS: any[] = [
  {
    id: "1",
    name: "Rajeshwar Roy",
    role: "Son of Patient, Kolkata",
    rating: 5,
    content:
      "Home Physio India arranged a neuro-physiotherapist within two hours after my father was discharged. The clinical discipline and empathy shown by the staff were exceptional.",
  },
  {
    id: "2",
    name: "Anjali Mukherjee",
    role: "Post-Surgery Patient",
    rating: 5,
    content:
      "The physiotherapist assigned to me for knee replacement recovery was thorough and patient. I walked without assistance much faster than my doctor anticipated!",
  },
  {
    id: "3",
    name: "Saurabh Banerjee",
    role: "Chronic Pain Patient",
    rating: 5,
    content:
      "Having a dedicated yoga therapist for my back pain brought me so much relief. Truly hospital-grade standards at home.",
  },
];

export function TestimonialsSection() {
  const { data } = useQuery(testimonialsQ({ limit: 8 }));
  const rawItems = data?.items ?? [];
  const items = rawItems.length ? rawItems : DEFAULT_TESTIMONIALS;

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
    <Section className="overflow-hidden pb-4 pt-2 lg:pt-4">
      <SectionHeader eyebrow="Testimonials & Reviews" title="They Say About Us" align="center" />
      <div className="mt-10 -mx-4 md:-mx-8">
        <div className="overflow-hidden cursor-grab active:cursor-grabbing" ref={emblaRef}>
          <div className="flex pl-4 md:pl-8">
            {[...items, ...items, ...items].map((t, i) => (
              <div
                key={`${t.id}-${i}`}
                className="min-w-0 flex-[0_0_85%] sm:flex-[0_0_50%] md:flex-[0_0_35%] lg:flex-[0_0_28%] pr-4 md:pr-6"
              >
                <TestimonialCard t={t} />
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
