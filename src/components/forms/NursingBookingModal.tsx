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
  Stethoscope,
  User,
  MapPin,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Heart,
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

const nursingFormSchema = z.object({
  patient_name: z.string().min(2, "Enter full name"),
  contact_phone: z.string().min(7, "Enter a valid phone number"),
  city: z.string().min(1, "Select a city"),
  service_name: z.string().min(1, "Select a service"),
});

type NursingFormValues = z.infer<typeof nursingFormSchema>;

const NURSING_SERVICES = [
  "Injection Administration",
  "IV Infusion & Drip Care",
  "Wound Dressing Care",
  "Catheter Care",
  "Ryles Tube Feeding",
  "Tracheostomy Care",
  "Post-Hospitalisation Nursing Care",
  "Vital Signs Monitoring",
  "Bed Sore Care",
  "Other Nursing Requirement",
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

export function NursingBookingModal({
  children,
  defaultService = "",
}: {
  children: React.ReactNode;
  defaultService?: string;
}) {
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const [refCode, setRefCode] = useState("");

  const { data: settings } = useQuery(settingsQ());
  const phone = settings?.phone?.replace(/[^\\d+]/g, "");

  const form = useForm<NursingFormValues>({
    resolver: zodResolver(nursingFormSchema),
    defaultValues: {
      patient_name: "",
      contact_phone: "",
      city: "",
      service_name: defaultService,
    },
  });

  const mut = useMutation({
    mutationFn: (data: NursingFormValues) =>
      api.post<{ reference?: string }>("/bookings", {
        ...data,
        preferred_date: new Date().toISOString().split("T")[0],
        address: "Pending (Provided via Quick Form)",
      }),
    onSuccess: (res) => {
      setRefCode(res?.reference ?? "");
      setDone(true);
      toast.success("Booking received — we'll contact you shortly.");
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
        <DialogTitle className="sr-only">Book a Nurse</DialogTitle>

        {/* Glass background */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#0c1825] via-[#0f1f33] to-[#0a1520] backdrop-blur-3xl" />

        {/* Decorative gradient orbs */}
        <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-cyan-500/15 blur-[80px] pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 h-36 w-36 rounded-full bg-blue-600/10 blur-[60px] pointer-events-none" />

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
                {/* Animated checkmark ring */}
                <motion.div
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                  className="mx-auto mb-6 relative"
                >
                  <div className="h-20 w-20 mx-auto rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 grid place-items-center shadow-[0_0_40px_-5px_rgba(52,211,153,0.4)]">
                    <CheckCircle2 className="h-10 w-10 text-white" strokeWidth={2} />
                  </div>
                  <motion.div
                    initial={{ scale: 1.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.15 }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="absolute inset-0 rounded-full bg-emerald-400 -z-10"
                  />
                </motion.div>

                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="font-display text-2xl md:text-3xl font-semibold text-white mb-2"
                >
                  Booking Confirmed!
                </motion.h3>

                {refCode && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/10 px-4 py-1.5 mb-3"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                    <span className="text-xs font-mono font-medium text-cyan-300 tracking-wider">
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
                  Our nursing team will contact you shortly to confirm the details and arrange
                  care for your patient.
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
                  <div className="inline-flex items-center gap-2 rounded-full bg-cyan-400/10 border border-cyan-400/20 px-3 py-1 mb-4">
                    <Heart className="h-3 w-3 text-cyan-400 fill-cyan-400/30" />
                    <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-300">
                      Quick Booking
                    </span>
                  </div>
                  <h3 className="font-display text-2xl md:text-[1.75rem] font-semibold tracking-tight text-white leading-tight">
                    Book a Nurse at Home
                  </h3>
                  <p className="text-white/50 text-[13px] mt-1.5 leading-relaxed">
                    Fill out the details and our team will reach out within minutes.
                  </p>
                </motion.div>

                <form onSubmit={form.handleSubmit((v) => mut.mutate(v))} className="space-y-3.5">
                  {/* Patient Name */}
                  <motion.div variants={fieldAnim} initial="hidden" animate="show" custom={1}>
                    <div className="relative group">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-cyan-400 transition-colors">
                        <User className="h-4 w-4" />
                      </div>
                      <input
                        {...form.register("patient_name")}
                        placeholder="Patient's full name"
                        className="w-full rounded-xl border border-white/10 bg-white/[0.06] pl-10 pr-4 py-3.5 text-sm text-white placeholder-white/35 outline-none transition-all duration-300 focus:border-cyan-400/50 focus:bg-white/[0.08] focus:shadow-[0_0_0_3px_rgba(34,211,238,0.08)]"
                      />
                    </div>
                    {form.formState.errors.patient_name && (
                      <p className="text-xs text-rose-400 mt-1.5 pl-1">
                        {form.formState.errors.patient_name.message}
                      </p>
                    )}
                  </motion.div>

                  {/* Phone */}
                  <motion.div variants={fieldAnim} initial="hidden" animate="show" custom={2}>
                    <div className="relative group">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-cyan-400 transition-colors">
                        <Phone className="h-4 w-4" />
                      </div>
                      <input
                        {...form.register("contact_phone")}
                        placeholder="Phone number"
                        type="tel"
                        className="w-full rounded-xl border border-white/10 bg-white/[0.06] pl-10 pr-4 py-3.5 text-sm text-white placeholder-white/35 outline-none transition-all duration-300 focus:border-cyan-400/50 focus:bg-white/[0.08] focus:shadow-[0_0_0_3px_rgba(34,211,238,0.08)]"
                      />
                    </div>
                    {form.formState.errors.contact_phone && (
                      <p className="text-xs text-rose-400 mt-1.5 pl-1">
                        {form.formState.errors.contact_phone.message}
                      </p>
                    )}
                  </motion.div>

                  {/* City */}
                  <motion.div variants={fieldAnim} initial="hidden" animate="show" custom={3}>
                    <div className="relative group">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-cyan-400 transition-colors pointer-events-none">
                        <MapPin className="h-4 w-4" />
                      </div>
                      <select
                        {...form.register("city")}
                        className="w-full rounded-xl border border-white/10 bg-white/[0.06] pl-10 pr-4 py-3.5 text-sm text-white/60 focus:text-white outline-none transition-all duration-300 focus:border-cyan-400/50 focus:bg-white/[0.08] focus:shadow-[0_0_0_3px_rgba(34,211,238,0.08)] appearance-none cursor-pointer"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.4)' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                          backgroundRepeat: "no-repeat",
                          backgroundPosition: "right 12px center",
                        }}
                      >
                        <option value="" className="bg-[#0f1f33] text-white/50">
                          Select your city
                        </option>
                        {CITIES.map((c) => (
                          <option key={c} value={c} className="bg-[#0f1f33] text-white">
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                    {form.formState.errors.city && (
                      <p className="text-xs text-rose-400 mt-1.5 pl-1">
                        {form.formState.errors.city.message}
                      </p>
                    )}
                  </motion.div>

                  {/* Service */}
                  <motion.div variants={fieldAnim} initial="hidden" animate="show" custom={4}>
                    <div className="relative group">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-cyan-400 transition-colors pointer-events-none">
                        <Stethoscope className="h-4 w-4" />
                      </div>
                      <select
                        {...form.register("service_name")}
                        className="w-full rounded-xl border border-white/10 bg-white/[0.06] pl-10 pr-4 py-3.5 text-sm text-white/60 focus:text-white outline-none transition-all duration-300 focus:border-cyan-400/50 focus:bg-white/[0.08] focus:shadow-[0_0_0_3px_rgba(34,211,238,0.08)] appearance-none cursor-pointer"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.4)' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                          backgroundRepeat: "no-repeat",
                          backgroundPosition: "right 12px center",
                        }}
                      >
                        <option value="" className="bg-[#0f1f33] text-white/50">
                          Select nursing service
                        </option>
                        {NURSING_SERVICES.map((s) => (
                          <option key={s} value={s} className="bg-[#0f1f33] text-white">
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                    {form.formState.errors.service_name && (
                      <p className="text-xs text-rose-400 mt-1.5 pl-1">
                        {form.formState.errors.service_name.message}
                      </p>
                    )}
                  </motion.div>

                  {/* Actions */}
                  <motion.div
                    variants={fieldAnim}
                    initial="hidden"
                    animate="show"
                    custom={5}
                    className="flex flex-col gap-3 pt-3"
                  >
                    <button
                      type="submit"
                      disabled={mut.isPending}
                      className="group w-full relative inline-flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-6 py-4 text-[15px] font-semibold text-white shadow-[0_20px_40px_-12px_rgba(34,211,238,0.35)] transition-all duration-300 hover:shadow-[0_25px_50px_-12px_rgba(34,211,238,0.45)] hover:-translate-y-0.5 disabled:opacity-60 disabled:pointer-events-none overflow-hidden"
                    >
                      {/* Shine effect */}
                      <span className="absolute inset-0 overflow-hidden rounded-xl">
                        <span className="absolute -top-[100%] left-[-100%] h-[300%] w-[50%] bg-gradient-to-r from-transparent via-white/20 to-transparent rotate-12 group-hover:left-[150%] transition-all duration-700 ease-in-out" />
                      </span>
                      <span className="relative flex items-center gap-2">
                        {mut.isPending ? (
                          <Loader2 className="h-4.5 w-4.5 animate-spin" />
                        ) : (
                          <ArrowRight className="h-4.5 w-4.5 transition-transform group-hover:translate-x-0.5" />
                        )}
                        {mut.isPending ? "Submitting..." : "Submit Request"}
                      </span>
                    </button>

                    <a
                      href={`tel:${phone || "+919830098300"}`}
                      className="w-full inline-flex items-center justify-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.04] px-6 py-3.5 text-sm font-medium text-white/80 hover:bg-white/[0.08] hover:border-white/20 hover:text-white transition-all duration-300"
                    >
                      <Phone className="h-4 w-4 text-cyan-400" />
                      Prefer to call? Talk to us
                    </a>
                  </motion.div>

                  {/* Trust indicators */}
                  <motion.div
                    variants={fieldAnim}
                    initial="hidden"
                    animate="show"
                    custom={6}
                    className="flex items-center justify-center gap-4 pt-2"
                  >
                    {["Trained Staff", "24/7 Support", "NCR Coverage"].map((t) => (
                      <div key={t} className="flex items-center gap-1.5">
                        <div className="h-1 w-1 rounded-full bg-cyan-400/60" />
                        <span className="text-[10px] text-white/35 font-medium uppercase tracking-wider">
                          {t}
                        </span>
                      </div>
                    ))}
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
