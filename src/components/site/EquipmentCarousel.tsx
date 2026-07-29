import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { equipmentQ } from "@/lib/api/queries";
import { PerspectiveCarousel } from "@/components/ui/perspective-carousel";

const FALLBACK_IMG =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 5'><rect width='4' height='5' fill='%23e6f4f0'/></svg>";

export function EquipmentCarousel() {
  const { data, isLoading } = useQuery(equipmentQ({ limit: 12 }));
  const navigate = useNavigate();
  const items = React.useMemo(
    () =>
      (data?.items ?? [])
        .filter((e) => e.featured_image)
        .map((e) => ({
          src: e.featured_image || FALLBACK_IMG,
          title: e.title,
          alt: e.title,
          slug: e.slug,
          price: e.rental_price ?? e.daily_rate ?? null,
          unit: e.price_unit ?? "day",
        })),
    [data],
  );

  const [active, setActive] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Autoscroll
  React.useEffect(() => {
    if (paused || items.length < 2) return;
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % items.length);
    }, 3500);
    return () => window.clearInterval(id);
  }, [paused, items.length]);

  // Pause when tab hidden
  React.useEffect(() => {
    const onVis = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  if (isLoading) {
    return (
      <div className="h-[520px] rounded-3xl border border-border bg-surface animate-pulse" />
    );
  }

  if (!items.length) return null;

  const activeItem = items[Math.min(active, items.length - 1)];

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className="relative"
    >
      <PerspectiveCarousel
        items={items}
        activeIndex={active}
        onActiveIndexChange={setActive}
        onSlideClick={(i) =>
          navigate({ to: "/equipment/$slug", params: { slug: items[i].slug } })
        }
        loop
        slideWidth={230}
        rotationStep={55}
        inactiveScale={0.82}
        className="h-[560px] bg-gradient-to-br from-primary-soft/40 to-surface"
      />
      {activeItem && (
        <div className="pointer-events-none absolute bottom-24 left-1/2 -translate-x-1/2 text-center">
          {activeItem.price != null && (
            <div className="text-sm text-muted-foreground">
              <span className="font-display text-lg text-foreground">
                ₹{activeItem.price.toLocaleString()}
              </span>{" "}
              / {activeItem.unit}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
