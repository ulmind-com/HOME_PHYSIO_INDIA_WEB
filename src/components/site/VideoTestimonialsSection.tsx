import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { videosQ } from "@/lib/api/queries";
import { VideoCard } from "@/components/site/cards/VideoCard";
import { VideoPlayerModal } from "@/components/site/VideoPlayerModal";
import { Section } from "@/components/site/Section";
import type { Video } from "@/lib/api/types";
import { useIsMobile } from "@/hooks/use-mobile";

const WALL = "/assets/testimonials-wall.jpg";

export function VideoTestimonialsSection() {
  const { data } = useQuery(videosQ({ limit: 24 }));
  const items = data?.items ?? [];
  const isMobile = useIsMobile();
  const perPage = isMobile ? 1 : 2;
  const pages = useMemo(() => {
    const out: Video[][] = [];
    for (let i = 0; i < items.length; i += perPage) out.push(items.slice(i, i + perPage));
    return out;
  }, [items, perPage]);

  const [page, setPage] = useState(0);
  const [playing, setPlaying] = useState<Video | null>(null);

  if (!items.length) return null;
  const safePage = Math.min(page, Math.max(0, pages.length - 1));
  const current = pages[safePage] ?? [];

  return (
    <Section>
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-14 items-center">
        {/* Left: decorative wall image */}
        <div className="lg:col-span-5">
          <div className="overflow-hidden rounded-[2rem] shadow-[var(--shadow-elegant)]">
            <img
              src={WALL}
              alt="Wall of family photos and thank-you notes"
              loading="lazy"
              width={800}
              height={1024}
              className="h-full w-full object-cover aspect-[4/5]"
            />
          </div>
        </div>

        {/* Right: header + carousel */}
        <div className="lg:col-span-7">
          <h2 className="font-display text-4xl md:text-5xl font-bold leading-[1.1]">
            What They Say About<br />
            <span className="text-primary">Nupun Home Care</span>
          </h2>
          <p className="mt-4 max-w-lg text-muted-foreground">
            Our members value the peace of mind our caregivers provide. Hear their stories below.
          </p>

          <div className="mt-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={safePage}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className={"grid gap-5 " + (perPage === 2 ? "sm:grid-cols-2" : "grid-cols-1")}
              >
                {current.map((v) => (
                  <VideoCard key={v.id} v={v} onPlay={setPlaying} variant="testimonial" aspect="16/9" />
                ))}
              </motion.div>
            </AnimatePresence>

            {pages.length > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                {pages.map((_, i) => (
                  <button
                    key={i}
                    aria-label={`Go to slide ${i + 1}`}
                    onClick={() => setPage(i)}
                    className={
                      "h-2.5 rounded-full transition-all " +
                      (i === safePage ? "w-8 bg-primary" : "w-2.5 bg-border hover:bg-muted-foreground/50")
                    }
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <VideoPlayerModal video={playing} onClose={() => setPlaying(null)} />
    </Section>
  );
}
