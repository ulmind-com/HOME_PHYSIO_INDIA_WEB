import * as React from "react";
import { PerspectiveCarousel } from "@/components/ui/perspective-carousel";

const ITEMS = [
  { src: "/assets/equipment/ultrasound.jpeg", title: "Siemens X700 Ultrasound", alt: "Siemens X700 ultrasound system" },
  { src: "/assets/equipment/monitoring-1.jpeg", title: "At-Home Health Monitoring", alt: "Home BP, glucose and pulse oximeter kit" },
  { src: "/assets/equipment/anesthesiology.jpeg", title: "Anesthesiology Equipment", alt: "Hospital anesthesiology station" },
  { src: "/assets/equipment/monitoring-2.jpeg", title: "Vitals Testing Kit", alt: "Home vitals and testing kit" },
  { src: "/assets/equipment/stethoscope.jpeg", title: "Clinical Stethoscope", alt: "Professional clinical stethoscope" },
];

const AUTO_SCROLL_MS = 2500;
const INTERACTION_PAUSE_MS = 4000;

export function EquipmentCarousel() {
  const [active, setActive] = React.useState(0);
  const [hovered, setHovered] = React.useState(false);
  const [hidden, setHidden] = React.useState(false);
  const [interacted, setInteracted] = React.useState(false);
  const interactionTimeoutRef = React.useRef<number | null>(null);

  // Do not pause on hover, only when the user explicitly clicks/interacts or switches tabs
  const paused = hidden || interacted;

  React.useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % ITEMS.length);
    }, AUTO_SCROLL_MS);
    return () => window.clearInterval(id);
  }, [paused]);

  React.useEffect(() => {
    const onVis = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  React.useEffect(() => {
    return () => {
      if (interactionTimeoutRef.current) {
        window.clearTimeout(interactionTimeoutRef.current);
      }
    };
  }, []);

  const selectSlide = React.useCallback((index: number) => {
    setActive(index);
    setInteracted(true);
    if (interactionTimeoutRef.current) window.clearTimeout(interactionTimeoutRef.current);
    interactionTimeoutRef.current = window.setTimeout(() => {
      setInteracted(false);
      interactionTimeoutRef.current = null;
    }, INTERACTION_PAUSE_MS);
  }, []);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative"
    >
      <PerspectiveCarousel
        items={ITEMS}
        activeIndex={active}
        onActiveIndexChange={selectSlide}
        loop
        slideWidth={300}
        rotationStep={48}
        inactiveScale={0.78}
        showControls
        showDots
        className="h-[640px] bg-gradient-to-br from-primary-soft/40 to-surface"
      />
    </div>
  );
}
