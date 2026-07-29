import { useEffect } from "react";
import { X } from "lucide-react";
import type { Video } from "@/lib/api/types";

export function getYouTubeId(url?: string | null): { id: string; isShort: boolean } | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) return { id: u.pathname.slice(1), isShort: false };
    if (u.pathname.startsWith("/shorts/")) return { id: u.pathname.split("/")[2], isShort: true };
    const v = u.searchParams.get("v");
    if (v) return { id: v, isShort: false };
    if (u.pathname.startsWith("/embed/")) return { id: u.pathname.split("/")[2], isShort: false };
  } catch {
    /* ignore */
  }
  return null;
}

export function inferAspect(v: Video): "9/16" | "16/9" {
  const yt = getYouTubeId(v.youtube_url);
  if (yt?.isShort) return "9/16";
  return "16/9";
}

export function VideoPlayerModal({ video, onClose }: { video: Video | null; onClose: () => void }) {
  useEffect(() => {
    if (!video) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [video, onClose]);

  if (!video) return null;
  const aspect = inferAspect(video);
  const yt = getYouTubeId(video.youtube_url);
  const src = video.video_url || video.video_file?.url || null;

  return (
    <div
      className="fixed inset-0 z-[100] grid place-items-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <button
        onClick={onClose}
        aria-label="Close video"
        className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
      >
        <X className="h-5 w-5" />
      </button>
      <div
        onClick={(e) => e.stopPropagation()}
        className={
          aspect === "9/16"
            ? "relative w-full max-w-[380px] aspect-[9/16] overflow-hidden rounded-3xl bg-black shadow-2xl"
            : "relative w-full max-w-6xl aspect-video overflow-hidden rounded-3xl bg-black shadow-2xl"
        }
      >
        {yt ? (
          <iframe
            src={`https://www.youtube.com/embed/${yt.id}?autoplay=1&rel=0&modestbranding=1`}
            title={video.title}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : video.video_url ? (
          <video
            src={video.video_url}
            controls
            autoPlay
            playsInline
            className="h-full w-full object-contain bg-black"
          />
        ) : (
          <div className="grid h-full place-items-center text-white/70">No playable source</div>
        )}
      </div>
    </div>
  );
}
