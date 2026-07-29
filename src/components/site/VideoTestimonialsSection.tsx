import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { videosQ } from "@/lib/api/queries";
import { VideoCard } from "@/components/site/cards/VideoCard";
import { VideoPlayerModal } from "@/components/site/VideoPlayerModal";
import type { Video } from "@/lib/api/types";

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
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold leading-[1.1]">
            What They Say About{" "}
            <span className="text-primary">Nupun Home Care</span>
          </h2>
          <p className="mt-3 text-sm md:text-base text-muted-foreground">
            Our members value the peace of mind our caregivers provide.
          </p>
        </div>

        <div className="relative mt-10 overflow-hidden group">
          {/* Edge fade masks */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 md:w-24 bg-gradient-to-r from-background to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 md:w-24 bg-gradient-to-l from-background to-transparent" />

          <motion.div
            className="flex gap-5 w-max"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration, ease: "linear", repeat: Infinity }}
            style={{ willChange: "transform" }}
          >
            {loop.map((v, i) => (
              <div
                key={`${v.id}-${i}`}
                className="w-[180px] md:w-[200px] shrink-0"
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

      <VideoPlayerModal video={playing} onClose={() => setPlaying(null)} />
    </section>
  );
}
