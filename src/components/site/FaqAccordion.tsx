import type { Faq } from "@/lib/api/types";
import { Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
};

export function FaqAccordion({ items }: { items: Faq[] }) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-4">
      {items.map((f) => {
        const isOpen = openId === f.id;
        return (
          <motion.div
            variants={itemVariants}
            key={f.id}
            className={`overflow-hidden rounded-xl border transition-all duration-300 ${
              isOpen
                ? "bg-white border-primary/20 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
                : "bg-white/60 border-border hover:bg-white hover:border-primary/10 hover:shadow-sm"
            }`}
          >
            <button
              onClick={() => setOpenId(isOpen ? null : f.id)}
              className="flex w-full items-center justify-between px-5 py-4 text-left"
            >
              <span className={`font-semibold text-[15px] transition-colors ${isOpen ? "text-primary" : "text-foreground"}`}>
                {f.question}
              </span>
              <span className={`ml-4 shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}>
                {isOpen ? (
                  <Minus className="h-4 w-4 text-primary" />
                ) : (
                  <Plus className="h-4 w-4 text-muted-foreground" />
                )}
              </span>
            </button>
            
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">
                    {f.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
