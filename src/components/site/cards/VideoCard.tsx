import { Play } from "lucide-react";
import type { Video } from "@/lib/api/types";
import { getYouTubeId, inferAspect } from "@/components/site/VideoPlayerModal";

type Props = {
  v: Video;
  onPlay?: (v: Video) => void;
  aspect?: "9/16" | "16/9";
  variant?: "default" | "testimonial";
};

export function VideoCard({ v, onPlay, aspect, variant = "default" }: Props) {
  const a = aspect ?? inferAspect(v);
  const yt = getYouTubeId(v.youtube_url);
  const thumb = v.thumbnail ?? (yt ? `https://i.ytimg.com/vi/${yt.id}/hqdefault.jpg` : null);

  const media = (
    <div
      className={
        "group relative w-full overflow-hidden " +
        (variant === "testimonial" ? "rounded-xl " : "rounded-3xl border border-border ") +
        "bg-dark " +
        (a === "9/16" ? "aspect-[9/16]" : "aspect-video")
      }
    >
      {thumb ? (
        <>
          {a === "9/16" && (
            <img
              src={thumb}
              alt=""
              aria-hidden
              className="absolute inset-0 h-full w-full object-cover scale-125 blur-2xl opacity-60"
            />
          )}
          <img
            src={thumb}
            alt={v.title}
            loading="lazy"
            className="relative h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </>
      ) : v.video_url ? (
        <video
          src={v.video_url}
          preload="metadata"
          muted
          playsInline
          disablePictureInPicture
          className="h-full w-full object-cover bg-black pointer-events-none"
        />
      ) : (
        <div className="h-full w-full bg-gradient-to-br from-accent to-primary" />
      )}

      {variant === "default" && (
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
      )}

      {/* play button */}
      <div className="absolute inset-0 grid place-items-center">
        <div className="grid h-16 w-16 place-items-center rounded-full bg-white/95 text-primary shadow-[var(--shadow-elegant)] transition-transform group-hover:scale-110">
          <Play className="h-6 w-6 translate-x-0.5" fill="currentColor" />
        </div>
      </div>

      {variant === "default" && v.duration && (
        <div className="absolute right-3 top-3 rounded-full bg-black/60 backdrop-blur px-2.5 py-1 text-[11px] font-medium text-white">
          {v.duration}
        </div>
      )}

      {variant === "default" && (
        <div className="absolute inset-x-0 bottom-0 p-5 text-white">
          <div className="font-display text-lg leading-tight line-clamp-2">{v.title}</div>
          {v.category && (
            <div className="mt-1 text-xs italic text-white/80">{v.category}</div>
          )}
        </div>
      )}
    </div>
  );

  const content =
    variant === "testimonial" ? (
      <div className="overflow-hidden rounded-2xl border border-border bg-background shadow-[var(--shadow-elegant)]">
        {media}
        <div className="p-5">
          <div className="font-display text-lg font-semibold leading-tight">{v.title}</div>
          {v.category && (
            <div className="mt-1 text-sm italic text-muted-foreground">{v.category}</div>
          )}
        </div>
      </div>
    ) : (
      media
    );

  if (onPlay) {
    return (
      <button type="button" onClick={() => onPlay(v)} className="block w-full text-left">
        {content}
      </button>
    );
  }
  const url = v.youtube_url ?? v.video_url ?? "#";
  return (
    <a href={url} target="_blank" rel="noreferrer noopener" className="block">
      {content}
    </a>
  );
}
