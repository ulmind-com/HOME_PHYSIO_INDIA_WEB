import { animate, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/** Counts from 0 → value once the element enters the viewport. */
export function Counter({
  value,
  suffix = "",
  duration = 1.6,
  className,
}: {
  value: number;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setN(v),
    });
    return () => controls.stop();
  }, [inView, value, duration]);

  const display = value >= 100 ? Math.round(n) : n.toFixed(value % 1 === 0 ? 0 : 1);
  return (
    <span ref={ref} className={className}>
      {display}
      {suffix}
    </span>
  );
}
