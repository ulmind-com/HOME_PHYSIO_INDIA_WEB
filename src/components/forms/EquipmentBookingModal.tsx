import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Loader2,
  Phone,
  PackageSearch,
  User,
  MapPin,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Timer,
} from "lucide-react";
import { api } from "@/lib/api/client";
import { settingsQ } from "@/lib/api/queries";
import { CITIES } from "@/components/forms/BookingForm";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";

const equipmentFormSchema = z.object({
  customer_name: z.string().min(2, "Enter full name"),
  customer_phone: z.string().min(7, "Enter a valid phone number"),
  address: z.string().min(1, "Select a city"),
  equipment_name: z.string().min(1, "Select equipment"),
  duration_days: z.string().optional(),
  message: z.string().optional(),
});

type EquipmentFormValues = z.infer<typeof equipmentFormSchema>;

export const EQUIPMENT_OPTIONS = [
  "Hospital Bed",
  "Wheelchair",
  "Oxygen Concentrator",
  "BiPAP Machine",
  "CPAP Machine",
  "Suction Machine",
  "Air Mattress",
  "Walker",
  "Other",
];

const fieldAnim = {
  hidden: { opacity: 0, y: 16, filter: "blur(4px)" },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.5, delay: 0.1 + i * 0.08, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export function EquipmentBookingModal({
  children,
  defaultEquipment = "",
}: {
  children: React.ReactNode;
  defaultEquipment?: string;
}) {
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const [refCode, setRefCode] = useState("");

  const { data: settings } = useQuery(settingsQ());
  const phone = settings?.phone?.replace(/[^\\d+]/g, "");

  const form = useForm<EquipmentFormValues>({
    resolver: zodResolver(equipmentFormSchema),
    defaultValues: {
      customer_name: "",
      customer_phone: "",
      address: "",
      equipment_name: defaultEquipment,
      duration_days: "",
      message: "",
    },
  });

  const mut = useMutation({
    mutationFn: (data: EquipmentFormValues) => {
      // The backend EquipmentRental schema expects:
      // equipment_id, start_date, quantity, address (which we'll combine)
      const combinedAddress = `${data.address}. ${
        data.message ? `Requirement: ${data.message}` : ""
      }`;

      // We'll parse the duration string into an integer for duration_days if possible, or just default to 30.
      let days = 30;
      if (data.duration_days) {
        if (data.duration_days.includes("week")) days = parseInt(data.duration_days) * 7;
        else if (data.duration_days.includes("month")) days = parseInt(data.duration_days) * 30;
      }

      return api.post<{ reference?: string }>("/equipment/rentals", {
        equipment_id: `eq_${data.equipment_name.toLowerCase().replace(/\\s+/g, "_")}`,
        equipment_name: data.equipment_name,
        customer_name: data.customer_name,
        customer_phone: data.customer_phone,
        address: combinedAddress,
        start_date: new Date().toISOString().split("T")[0],
        quantity: 1,
        duration_days: days,
      });
    },
    onSuccess: (res) => {
      setRefCode(res?.reference ?? "");
      setDone(true);
      toast.success("Equipment request received.");
    },
    onError: (err: Error) => toast.error(err.message || "Something went wrong."),
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        setOpen(val);
        if (!val) {
          setTimeout(() => {
            setDone(false);
            setRefCode("");
            form.reset();
          }, 300);
        }
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-[480px] w-full p-0 overflow-hidden rounded-[1.75rem] border border-white/15 bg-transparent shadow-[0_50px_100px_-30px_rgba(0,0,0,0.5)] sm:h-auto h-[100dvh] flex flex-col justify-center gap-0">
        <DialogTitle className="sr-only">Check Equipment Availability</DialogTitle>

        {/* Glass background */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 backdrop-blur-3xl" />

        {/* Decorative gradient orbs */}
        <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-primary/15 blur-[80px] pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 h-36 w-36 rounded-full bg-cyan-600/10 blur-[60px] pointer-events-none" />

        {/* Subtle dot grid */}
        <div
          className="absolute inset-0 -z-[5] opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(white 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        <div className="relative p-6 md:p-8 h-full sm:h-auto overflow-y-auto flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {done ? (
              /* ── Success State ── */
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="text-center py-8"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                  className="mx-auto mb-6 relative"
                >
                  <div className="h-20 w-20 mx-auto rounded-full bg-gradient-to-br from-teal-400 to-cyan-400 grid place-items-center shadow-[0_0_40px_-5px_rgba(251,191,36,0.4)]">
                    <CheckCircle2 className="h-10 w-10 text-white" strokeWidth={2} />
                  </div>
                  <motion.div
                    initial={{ scale: 1.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.15 }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="absolute inset-0 rounded-full bg-teal-400 -z-10"
                  />
                </motion.div>

                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="font-display text-2xl md:text-3xl font-semibold text-white mb-2"
                >
                  Request Received!
                </motion.h3>

                {refCode && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/10 px-4 py-1.5 mb-3"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-teal-400" />
                    <span className="text-xs font-mono font-medium text-teal-300 tracking-wider">
                      {refCode}
                    </span>
                  </motion.div>
                )}

                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45, duration: 0.5 }}
                  className="text-white/60 text-sm leading-relaxed max-w-xs mx-auto mb-8"
                >
                  Our team will check equipment availability and contact you shortly with delivery details and applicable charges.
                </motion.p>

                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  onClick={() => setOpen(false)}
                  className="rounded-full bg-white/10 border border-white/15 px-8 py-3 text-sm font-medium text-white hover:bg-white/20 hover:border-white/30 transition-all duration-300"
                >
                  Close
                </motion.button>
              </motion.div>
            ) : (
              /* ── Form State ── */
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                {/* Header */}
                <motion.div
                  variants={fieldAnim}
                  initial="hidden"
                  animate="show"
                  custom={0}
                  className="mb-6"
                >
                  <div className="inline-flex items-center gap-2 rounded-full bg-teal-400/10 border border-teal-400/20 px-3 py-1 mb-4">
                    <PackageSearch className="h-3 w-3 text-teal-400" />
                    <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-teal-300">
                      Equipment Enquiry
                    </span>
                  </div>
                  <h3 className="font-display text-2xl md:text-[1.75rem] font-semibold tracking-tight text-white leading-tight">
                    Check Availability
                  </h3>
                  <p className="text-white/50 text-[13px] mt-1.5 leading-relaxed">
                    Tell us what you need and our team will contact you shortly.
                  </p>
                </motion.div>

                <form onSubmit={form.handleSubmit((v) => mut.mutate(v))} className="space-y-3.5">
                  {/* Name */}
                  <motion.div variants={fieldAnim} initial="hidden" animate="show" custom={1}>
                    <div className="relative group">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-teal-400 transition-colors">
                        <User className="h-4 w-4" />
                      </div>
                      <input
                        {...form.register("customer_name")}
                        placeholder="Full name"
                        className="w-full rounded-xl border border-white/10 bg-white/[0.06] pl-10 pr-4 py-3.5 text-sm text-white placeholder-white/35 outline-none transition-all duration-300 focus:border-teal-400/50 focus:bg-white/[0.08] focus:shadow-[0_0_0_3px_rgba(251,191,36,0.08)]"
                      />
                    </div>
                    {form.formState.errors.customer_name && (
                      <p className="text-xs text-rose-400 mt-1.5 pl-1">
                        {form.formState.errors.customer_name.message}
                      </p>
                    )}
                  </motion.div>

                  {/* Phone */}
                  <motion.div variants={fieldAnim} initial="hidden" animate="show" custom={2}>
                    <div className="relative group">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-teal-400 transition-colors">
                        <Phone className="h-4 w-4" />
                      </div>
                      <input
                        {...form.register("customer_phone")}
                        placeholder="Phone number"
                        type="tel"
                        className="w-full rounded-xl border border-white/10 bg-white/[0.06] pl-10 pr-4 py-3.5 text-sm text-white placeholder-white/35 outline-none transition-all duration-300 focus:border-teal-400/50 focus:bg-white/[0.08] focus:shadow-[0_0_0_3px_rgba(251,191,36,0.08)]"
                      />
                    </div>
                    {form.formState.errors.customer_phone && (
                      <p className="text-xs text-rose-400 mt-1.5 pl-1">
                        {form.formState.errors.customer_phone.message}
                      </p>
                    )}
                  </motion.div>

                  {/* Equipment */}
                  <motion.div variants={fieldAnim} initial="hidden" animate="show" custom={3}>
                    <div className="relative group">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-teal-400 transition-colors pointer-events-none">
                        <PackageSearch className="h-4 w-4" />
                      </div>
                      <select
                        {...form.register("equipment_name")}
                        className="w-full rounded-xl border border-white/10 bg-white/[0.06] pl-10 pr-4 py-3.5 text-sm text-white/60 focus:text-white outline-none transition-all duration-300 focus:border-teal-400/50 focus:bg-white/[0.08] focus:shadow-[0_0_0_3px_rgba(251,191,36,0.08)] appearance-none cursor-pointer"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.4)' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                          backgroundRepeat: "no-repeat",
                          backgroundPosition: "right 12px center",
                        }}
                      >
                        <option value="" className="bg-slate-800 text-white/50">
                          Select equipment
                        </option>
                        {EQUIPMENT_OPTIONS.map((e) => (
                          <option key={e} value={e} className="bg-slate-800 text-white">
                            {e}
                          </option>
                        ))}
                      </select>
                    </div>
                    {form.formState.errors.equipment_name && (
                      <p className="text-xs text-rose-400 mt-1.5 pl-1">
                        {form.formState.errors.equipment_name.message}
                      </p>
                    )}
                  </motion.div>

                  <div className="grid grid-cols-2 gap-3">
                    {/* Location */}
                    <motion.div variants={fieldAnim} initial="hidden" animate="show" custom={4}>
                      <div className="relative group">
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-teal-400 transition-colors pointer-events-none">
                          <MapPin className="h-4 w-4" />
                        </div>
                        <select
                          {...form.register("address")}
                          className="w-full rounded-xl border border-white/10 bg-white/[0.06] pl-10 pr-4 py-3.5 text-sm text-white/60 focus:text-white outline-none transition-all duration-300 focus:border-teal-400/50 focus:bg-white/[0.08] focus:shadow-[0_0_0_3px_rgba(251,191,36,0.08)] appearance-none cursor-pointer"
                          style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.4)' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "right 12px center",
                          }}
                        >
                          <option value="" className="bg-slate-800 text-white/50">
                            Location
                          </option>
                          {CITIES.map((c) => (
                            <option key={c} value={c} className="bg-slate-800 text-white">
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>
                      {form.formState.errors.address && (
                        <p className="text-xs text-rose-400 mt-1.5 pl-1">
                          {form.formState.errors.address.message}
                        </p>
                      )}
                    </motion.div>

                    {/* Duration */}
                    <motion.div variants={fieldAnim} initial="hidden" animate="show" custom={4}>
                      <div className="relative group">
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-teal-400 transition-colors pointer-events-none">
                          <Timer className="h-4 w-4" />
                        </div>
                        <select
                          {...form.register("duration_days")}
                          className="w-full rounded-xl border border-white/10 bg-white/[0.06] pl-10 pr-4 py-3.5 text-sm text-white/60 focus:text-white outline-none transition-all duration-300 focus:border-teal-400/50 focus:bg-white/[0.08] focus:shadow-[0_0_0_3px_rgba(251,191,36,0.08)] appearance-none cursor-pointer"
                          style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.4)' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "right 12px center",
                          }}
                        >
                          <option value="" className="bg-slate-800 text-white/50">
                            Duration
                          </option>
                          {["1 week", "2 weeks", "1 month", "3 months", "Other"].map((c) => (
                            <option key={c} value={c} className="bg-slate-800 text-white">
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>
                    </motion.div>
                  </div>

                  {/* Message */}
                  <motion.div variants={fieldAnim} initial="hidden" animate="show" custom={5}>
                    <input
                      {...form.register("message")}
                      placeholder="Patient condition / requirement (optional)"
                      className="w-full rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3.5 text-sm text-white placeholder-white/35 outline-none transition-all duration-300 focus:border-teal-400/50 focus:bg-white/[0.08] focus:shadow-[0_0_0_3px_rgba(251,191,36,0.08)]"
                    />
                  </motion.div>

                  {/* Actions */}
                  <motion.div
                    variants={fieldAnim}
                    initial="hidden"
                    animate="show"
                    custom={6}
                    className="flex flex-col gap-3 pt-3"
                  >
                    <button
                      type="submit"
                      disabled={mut.isPending}
                      className="group w-full relative inline-flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 px-6 py-4 text-[15px] font-semibold text-white shadow-[0_20px_40px_-12px_rgba(251,191,36,0.35)] transition-all duration-300 hover:shadow-[0_25px_50px_-12px_rgba(251,191,36,0.45)] hover:-translate-y-0.5 disabled:opacity-60 disabled:pointer-events-none overflow-hidden"
                    >
                      <span className="absolute inset-0 overflow-hidden rounded-xl">
                        <span className="absolute -top-[100%] left-[-100%] h-[300%] w-[50%] bg-gradient-to-r from-transparent via-white/20 to-transparent rotate-12 group-hover:left-[150%] transition-all duration-700 ease-in-out" />
                      </span>
                      <span className="relative flex items-center gap-2">
                        {mut.isPending ? (
                          <Loader2 className="h-4.5 w-4.5 animate-spin" />
                        ) : (
                          <ArrowRight className="h-4.5 w-4.5 transition-transform group-hover:translate-x-0.5" />
                        )}
                        {mut.isPending ? "Submitting..." : "Check Availability"}
                      </span>
                    </button>

                    <a
                      href={`tel:${phone || "+919830098300"}`}
                      className="w-full inline-flex items-center justify-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.04] px-6 py-3.5 text-sm font-medium text-white/80 hover:bg-white/[0.08] hover:border-white/20 hover:text-white transition-all duration-300"
                    >
                      <Phone className="h-4 w-4 text-teal-400" />
                      Prefer to call? Talk to us
                    </a>
                  </motion.div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
