import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

export const triggerBookingSuccess = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("booking-success"));
  }
};

export function GlobalBookingSuccess() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleSuccess = () => {
      setOpen(true);
      // Auto-close after 5 seconds
      const t = setTimeout(() => {
        setOpen(false);
      }, 5000);
      return () => clearTimeout(t);
    };

    window.addEventListener("booking-success", handleSuccess);
    return () => window.removeEventListener("booking-success", handleSuccess);
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: -10 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={cn(
              "relative w-full max-w-sm overflow-hidden rounded-2xl bg-white p-8 text-center shadow-2xl",
              "border border-border"
            )}
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
              <Check className="h-8 w-8 stroke-[3px]" />
            </div>

            <h2 className="font-display text-xl font-bold text-foreground">
              Booking Confirmed
            </h2>

            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Thank you for choosing Home Physio India. Our team will contact you shortly.
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
