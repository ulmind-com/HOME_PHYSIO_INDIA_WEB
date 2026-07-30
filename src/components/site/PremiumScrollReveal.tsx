import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function PremiumScrollReveal({ children }: { children: ReactNode }) {
  return (
    <div style={{ perspective: "1200px" }}>
      <motion.div
        initial={{ opacity: 0, y: 80, rotateX: 30, scale: 0.9, filter: "blur(8px)" }}
        whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1, filter: "blur(0px)" }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
}
