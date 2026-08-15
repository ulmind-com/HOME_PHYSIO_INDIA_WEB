import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import { videosQ } from "@/lib/api/queries";
import { VideoCard } from "@/components/site/cards/VideoCard";
import { VideoPlayerModal } from "@/components/site/VideoPlayerModal";
import type { Video } from "@/lib/api/types";
import { useIsMobile } from "@/hooks/use-mobile";

const WALL = "/assets/testimonials-wall.jpg";

export function VideoTestimonialsSection() {
  const { data } = useQuery(videosQ({ limit: 24 }));
  const items = data?.items ?? [];
  const [playing, setPlaying] = useState<Video | null>(null);

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

  const onInit = useCallback((emblaApi: any) => {
    setScrollSnaps(emblaApi.scrollSnapList());
  }, []);

  const onSelect = useCallback((emblaApi: any) => {
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    onInit(emblaApi);
    onSelect(emblaApi);
    emblaApi.on("reInit", onInit);
    emblaApi.on("reInit", onSelect);
    emblaApi.on("select", onSelect);
  }, [emblaApi, onInit, onSelect]);

  if (!items.length) return null;

  const loop = [...items, ...items];
  const duration = Math.max(20, items.length * 5);

  return (
    <section className="py-14 md:py-20">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-12 items-center">
          {/* Left: wall image */}
          <div className="lg:col-span-5">
            <div className="overflow-hidden rounded-[2rem] shadow-[var(--shadow-elegant)]">
              <img
                src={WALL}
                alt="Wall of family photos and thank-you notes"
                loading="lazy"
                width={800}
                height={1000}
                className="h-full w-full object-cover aspect-[4/5]"
              />
            </div>
          </div>

          {/* Right: heading + marquee */}
          <div className="lg:col-span-7">
            <h2 className="font-display text-3xl md:text-4xl font-bold leading-[1.1]">
              What They Say About <span className="text-primary">Nupun Home Care</span>
            </h2>
            <p className="mt-3 max-w-lg text-sm md:text-base text-muted-foreground">
              Our members value the peace of mind our caregivers provide.
            </p>

            <div className="relative mt-8 overflow-hidden">
              <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 md:w-16 bg-gradient-to-r from-background to-transparent" />
              <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 md:w-16 bg-gradient-to-l from-background to-transparent" />

              <div className="overflow-hidden cursor-grab active:cursor-grabbing" ref={emblaRef}>
                <div className="flex gap-4">
                  {loop.map((v, i) => (
                    <div key={`${v.id}-${i}`} className="min-w-0 flex-[0_0_170px] md:flex-[0_0_190px]">
                      <VideoCard v={v} onPlay={setPlaying} variant="testimonial" aspect="9/16" />
                    </div>
                  ))}
                </div>
              </div>
              
              {isMobile && (
                <div className="flex justify-center gap-2 mt-6 relative z-20">
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
            </div>
          </div>
        </div>
      </div>

      <VideoPlayerModal video={playing} onClose={() => setPlaying(null)} />
    </section>
  );
}
