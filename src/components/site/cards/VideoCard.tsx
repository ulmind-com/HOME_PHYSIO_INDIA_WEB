import { Play } from "lucide-react";
import type { Video } from "@/lib/api/types";

export function VideoCard({ v }: { v: Video }) {
  const url = v.youtube_url ?? v.video_url ?? "#";
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer noopener"
      className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-surface hover-glow"
    >
      <div className="relative aspect-video overflow-hidden bg-dark">
        {v.thumbnail ? (
          <img src={v.thumbnail} alt={v.title} loading="lazy" className="h-full w-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-105" />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-accent to-primary" />
        )}
        <div className="absolute inset-0 grid place-items-center">
          <div className="h-14 w-14 rounded-full bg-white/95 text-dark grid place-items-center shadow-[var(--shadow-elegant)] transition-transform group-hover:scale-110">
            <Play className="h-6 w-6" fill="currentColor" />
          </div>
        </div>
        {v.duration && (
          <div className="absolute bottom-3 right-3 rounded-full bg-black/60 backdrop-blur px-2.5 py-1 text-[11px] font-medium text-white">
            {v.duration}
          </div>
        )}
      </div>
      <div className="p-5">
        {v.category && <div className="text-xs uppercase tracking-[0.18em] text-accent">{v.category}</div>}
        <div className="mt-1 font-display text-lg line-clamp-2">{v.title}</div>
      </div>
    </a>
  );
}
