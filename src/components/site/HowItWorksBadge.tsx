import { motion } from "framer-motion";

const palettes = {
  primary: { blob: "text-primary/20", ring: "text-primary/40", text: "text-primary" },
  accent: { blob: "text-accent/20", ring: "text-accent/40", text: "text-accent" },
  glow: { blob: "text-primary/25", ring: "text-primary/50", text: "text-primary" },
} as const;

export function HowItWorksBadge({
  n,
  variant = "primary",
}: {
  n: number;
  variant?: keyof typeof palettes;
}) {
  const c = palettes[variant];
  return (
    <div className="relative grid h-20 w-20 shrink-0 place-items-center" aria-hidden>
      {/* Soft floating blob */}
      <motion.svg
        className={`absolute inset-0 h-full w-full ${c.blob}`}
        viewBox="0 0 100 100"
        animate={{ rotate: [0, 6, -4, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      >
        <path
          fill="currentColor"
          d="M45.7,-63.8C58.1,-56.2,66.5,-41.3,71.6,-25.6C76.7,-9.9,78.6,6.7,73.7,20.9C68.9,35.1,57.4,46.9,43.7,55.4C30,63.9,14.9,69,-0.9,70.2C-16.8,71.4,-33.6,68.7,-46.5,60.1C-59.4,51.6,-68.5,37.2,-72.7,21.5C-76.9,5.9,-76.3,-11.1,-70.1,-25.4C-63.9,-39.7,-52.1,-51.3,-38.6,-58.6C-25.1,-65.9,-9.9,-68.9,4.3,-74.7C18.5,-80.5,33.2,-71.4,45.7,-63.8Z"
          transform="translate(50 50) scale(0.55)"
        />
      </motion.svg>

      {/* Inner glass ring */}
      <div
        className={`relative grid h-14 w-14 place-items-center rounded-full bg-surface/85 backdrop-blur ring-1 ring-inset ${c.ring.replace("text-", "ring-")}`}
      >
        <span className={`font-display text-2xl font-bold leading-none ${c.text}`}>{n}</span>
      </div>

      {/* Outer pulse dot */}
      <span
        className={`absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full ${c.text.replace("text-", "bg-")} opacity-80`}
      >
        <span
          className={`absolute inset-0 rounded-full ${c.text.replace("text-", "bg-")} animate-ping opacity-60`}
        />
      </span>
    </div>
  );
}
