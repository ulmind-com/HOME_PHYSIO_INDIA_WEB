import * as React from "react";
import { PerspectiveCarousel } from "@/components/ui/perspective-carousel";
import ultrasound from "@/assets/equipment/ultrasound.jpeg.asset.json";
import monitoring1 from "@/assets/equipment/monitoring-1.jpeg.asset.json";
import monitoring2 from "@/assets/equipment/monitoring-2.jpeg.asset.json";
import anesthesiology from "@/assets/equipment/anesthesiology.jpeg.asset.json";
import stethoscope from "@/assets/equipment/stethoscope.jpeg.asset.json";

const ITEMS = [
  { src: ultrasound.url, title: "Siemens X700 Ultrasound", alt: "Siemens X700 ultrasound system" },
  { src: monitoring1.url, title: "At-Home Health Monitoring", alt: "Home BP, glucose and pulse oximeter kit" },
  { src: anesthesiology.url, title: "Anesthesiology Equipment", alt: "Hospital anesthesiology station" },
  { src: monitoring2.url, title: "Vitals Testing Kit", alt: "Home vitals and testing kit" },
  { src: stethoscope.url, title: "Clinical Stethoscope", alt: "Professional clinical stethoscope" },
];

export function EquipmentCarousel() {
  const [active, setActive] = React.useState(0);
  const [paused, setPaused] = React.useState(false);

  React.useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % ITEMS.length);
    }, 3500);
    return () => window.clearInterval(id);
  }, [paused]);

  React.useEffect(() => {
    const onVis = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className="relative"
    >
      <PerspectiveCarousel
        items={ITEMS}
        activeIndex={active}
        onActiveIndexChange={setActive}
        loop
        slideWidth={230}
        rotationStep={55}
        inactiveScale={0.82}
        className="h-[560px] bg-gradient-to-br from-primary-soft/40 to-surface"
      />
    </div>
  );
}
