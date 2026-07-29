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

const INTERACTION_PAUSE_MS = 2500;

export function EquipmentCarousel() {
  const [hovered, setHovered] = React.useState(false);
  const [focused, setFocused] = React.useState(false);
  const [hidden, setHidden] = React.useState(false);
  const [interacted, setInteracted] = React.useState(false);
  const interactionTimeoutRef = React.useRef<number | null>(null);

  const paused = hovered || focused || hidden || interacted;

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

  const handleInteraction = React.useCallback(() => {
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
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      className="relative"
    >
      <PerspectiveCarousel
        items={ITEMS}
        continuous
        continuousSpeed={28}
        isPaused={paused}
        slideWidth={300}
        slideGap={40}
        className="h-[640px] bg-gradient-to-br from-primary-soft/40 to-surface"
      />
    </div>
  );
}
