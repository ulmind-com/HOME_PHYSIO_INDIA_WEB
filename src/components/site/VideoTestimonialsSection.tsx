import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { videosQ } from "@/lib/api/queries";
import { VideoCard } from "@/components/site/cards/VideoCard";
import { VideoPlayerModal } from "@/components/site/VideoPlayerModal";
import type { Video } from "@/lib/api/types";

const WALL = "/assets/testimonials-wall.jpg";

export function VideoTestimonialsSection() {
  const { data } = useQuery(videosQ({ limit: 24 }));
  const items = data?.items ?? [];
  const [playing, setPlaying] = useState<Video | null>(null);

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
              What They Say About{" "}
              <span className="text-primary">Nupun Home Care</span>
            </h2>
            <p className="mt-3 max-w-lg text-sm md:text-base text-muted-foreground">
              Our members value the peace of mind our caregivers provide.
            </p>

            <div className="relative mt-8 overflow-hidden">
              <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 md:w-16 bg-gradient-to-r from-background to-transparent" />
              <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 md:w-16 bg-gradient-to-l from-background to-transparent" />

              <motion.div
                className="flex gap-4 w-max"
                animate={{ x: ["0%", "-50%"] }}
                transition={{ duration, ease: "linear", repeat: Infinity }}
                style={{ willChange: "transform" }}
              >
                {loop.map((v, i) => (
                  <div
                    key={`${v.id}-${i}`}
                    className="w-[170px] md:w-[190px] shrink-0"
                  >
                    <VideoCard
                      v={v}
                      onPlay={setPlaying}
                      variant="testimonial"
                      aspect="9/16"
                    />
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <VideoPlayerModal video={playing} onClose={() => setPlaying(null)} />
    </section>
  );
}
