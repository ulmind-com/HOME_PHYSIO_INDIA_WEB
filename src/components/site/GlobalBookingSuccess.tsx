import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

/** 
 * Event helper to trigger the success modal from anywhere.
 */
export const triggerBookingSuccess = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("booking-success"));
  }
};

const playPremiumSuccessSound = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    const playNote = (freq: number, startTime: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = "sine";
      osc.frequency.value = freq;

      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.15, startTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    // Play a rising arpeggio (C major 7) for a premium, magical feel
    const now = ctx.currentTime;
    playNote(523.25, now, 1.5);       // C5
    playNote(659.25, now + 0.1, 1.4); // E5
    playNote(783.99, now + 0.2, 1.3); // G5
    playNote(987.77, now + 0.3, 2.0); // B5 (rings out)
  } catch (e) {
    // Ignore audio errors (e.g. strict browser policies)
  }
};

export function GlobalBookingSuccess() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleSuccess = () => {
      setOpen(true);
      playPremiumSuccessSound();
      
      // Fire confetti
      const end = Date.now() + 1.5 * 1000;
      const colors = ["#33C4C7", "#3b82f6", "#ffffff"];

      (function frame() {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors,
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors,
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      })();

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
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: -10 }}
            transition={{ type: "spring", damping: 22, stiffness: 300 }}
            className={cn(
              "relative w-full max-w-sm overflow-hidden rounded-[2rem] bg-white p-8 text-center shadow-2xl",
              "border border-white/50"
            )}
          >
            {/* Glowing background blob */}
            <div className="absolute left-1/2 top-0 -z-10 h-[200px] w-[200px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-[60px]" />

            <button
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mb-6 mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 relative">
               <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.1, damping: 15 }}
                className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary to-accent opacity-20 animate-pulse"
               />
               <motion.div
                 initial={{ scale: 0 }}
                 animate={{ scale: 1 }}
                 transition={{ type: "spring", delay: 0.2, damping: 12, stiffness: 200 }}
                 className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-tr from-primary to-accent shadow-lg shadow-primary/30"
               >
                 <motion.div
                   initial={{ pathLength: 0, opacity: 0 }}
                   animate={{ pathLength: 1, opacity: 1 }}
                   transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
                 >
                   <Check className="h-8 w-8 text-white stroke-[3px]" />
                 </motion.div>
               </motion.div>
            </div>

            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="font-display text-2xl font-bold tracking-tight text-foreground"
            >
              Booking Confirmed
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-3 text-[15px] leading-relaxed text-muted-foreground"
            >
              Thank you for trusting Nupun Home Health Care. Our care coordinator will contact you shortly to confirm the details.
            </motion.p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
