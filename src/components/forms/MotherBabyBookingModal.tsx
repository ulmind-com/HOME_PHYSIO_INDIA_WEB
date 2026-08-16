import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Loader2,
  CheckCircle2,
  ChevronDown,
} from "lucide-react";
import { api } from "@/lib/api/client";
import { triggerBookingSuccess } from "@/components/site/GlobalBookingSuccess";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";

const motherBabyFormSchema = z.object({
  patient_name: z.string().min(2, "Enter full name"),
  contact_phone: z.string().min(7, "Enter a valid phone number"),
  service_package: z.string().min(1, "Select a service package"),
  shift_required: z.string().min(1, "Select shift required"),
});

type MotherBabyFormValues = z.infer<typeof motherBabyFormSchema>;

const SERVICE_PACKAGES = [
  "Newborn Baby Care Only",
  "Mother Care Only",
  "Mother & Baby Care Both",
];

const SHIFTS = [
  "12 Hours Day Shift",
  "12 Hours Night Shift",
  "24 Hours Live-in Care",
];

export function MotherBabyBookingModal({
  children,
  onOpenChange,
}: {
  children: React.ReactNode;
  onOpenChange?: (open: boolean) => void;
}) {
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const [refCode, setRefCode] = useState("");

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    onOpenChange?.(newOpen);
  };

  const form = useForm<MotherBabyFormValues>({
    resolver: zodResolver(motherBabyFormSchema),
    defaultValues: {
      patient_name: "",
      contact_phone: "",
      service_package: "",
      shift_required: "",
    },
  });

  const mut = useMutation({
    mutationFn: (data: MotherBabyFormValues) =>
      api.post<{ reference?: string }>("/bookings", {
        patient_name: data.patient_name,
        contact_phone: data.contact_phone,
        service_name: data.service_package,
        patient_condition: `Shift: ${data.shift_required}`,
        city: "Not specified",
        source: "Mother & Baby Care Modal",
        preferred_date: new Date().toISOString().split("T")[0],
        address: "Pending (Provided via Quick Form)",
      }),
    onSuccess: (res) => {
      setRefCode(res?.reference ?? "");
      setDone(true);
      triggerBookingSuccess();
      toast.success("Booking received — we'll contact you shortly.");
    },
    onError: (err: Error) => toast.error(err.message || "Something went wrong."),
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        handleOpenChange(val);
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
      <DialogContent className="max-w-[480px] w-[95vw] overflow-hidden rounded-[1.75rem] border border-border bg-white p-6 md:p-8 shadow-2xl sm:h-auto h-auto max-h-[90dvh] overflow-y-auto">
        <DialogTitle className="sr-only">Book Mother & Baby Care</DialogTitle>
        
        <div className="relative pt-2 pb-2">
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
                  <div className="h-20 w-20 mx-auto rounded-full bg-green-100 grid place-items-center">
                    <CheckCircle2 className="h-10 w-10 text-green-600" strokeWidth={2} />
                  </div>
                </motion.div>

                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-2"
                >
                  Booking Confirmed!
                </motion.h3>

                {refCode && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="inline-flex items-center gap-2 rounded-full bg-muted border border-border px-4 py-1.5 mb-3"
                  >
                    <span className="text-xs font-mono font-medium text-muted-foreground tracking-wider">
                      Ref: {refCode}
                    </span>
                  </motion.div>
                )}

                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45, duration: 0.5 }}
                  className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto mb-8"
                >
                  Our care team will contact you shortly to confirm the details.
                </motion.p>

                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  onClick={() => handleOpenChange(false)}
                  className="rounded-full border border-border bg-white px-8 py-3 text-sm font-medium text-foreground hover:border-primary transition-colors duration-300"
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
                <div className="mb-6">
                  <h3 className="font-display text-2xl md:text-3xl tracking-tight text-foreground mb-2">
                    Mother & Baby Care
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Tell us about your requirements and our care team will contact you shortly.
                  </p>
                </div>

                <form onSubmit={form.handleSubmit((v) => mut.mutate(v))} className="space-y-4">
                  {/* Patient Name */}
                  <div>
                    <input
                      {...form.register("patient_name")}
                      placeholder="Full name"
                      className="w-full rounded-full border border-border bg-transparent px-5 py-3.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15 placeholder:text-muted-foreground"
                    />
                    {form.formState.errors.patient_name && (
                      <p className="text-xs text-destructive mt-1.5 pl-1">
                        {form.formState.errors.patient_name.message}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <input
                      {...form.register("contact_phone")}
                      placeholder="Phone number"
                      type="tel"
                      className="w-full rounded-full border border-border bg-transparent px-5 py-3.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15 placeholder:text-muted-foreground"
                    />
                    {form.formState.errors.contact_phone && (
                      <p className="text-xs text-destructive mt-1.5 pl-1">
                        {form.formState.errors.contact_phone.message}
                      </p>
                    )}
                  </div>

                  {/* Service Package */}
                  <div>
                    <div className="relative">
                      <select
                        {...form.register("service_package")}
                        className="w-full rounded-full border border-border bg-transparent px-5 py-3.5 pr-10 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15 text-foreground appearance-none cursor-pointer"
                      >
                        <option value="">Select Service Package</option>
                        {SERVICE_PACKAGES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    </div>
                    {form.formState.errors.service_package && (
                      <p className="text-xs text-destructive mt-1.5 pl-1">
                        {form.formState.errors.service_package.message}
                      </p>
                    )}
                  </div>

                  {/* Shift Required */}
                  <div>
                    <div className="relative">
                      <select
                        {...form.register("shift_required")}
                        className="w-full rounded-full border border-border bg-transparent px-5 py-3.5 pr-10 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15 text-foreground appearance-none cursor-pointer"
                      >
                        <option value="">Select Shift Required</option>
                        {SHIFTS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    </div>
                    {form.formState.errors.shift_required && (
                      <p className="text-xs text-destructive mt-1.5 pl-1">
                        {form.formState.errors.shift_required.message}
                      </p>
                    )}
                  </div>

                  {/* Submit Action */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={mut.isPending}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#0A252E] px-4 py-3.5 text-sm font-semibold text-white hover:bg-[#0A252E]/90 transition-colors disabled:opacity-60"
                    >
                      {mut.isPending && <Loader2 className="h-4.5 w-4.5 animate-spin" />}
                      {mut.isPending ? "Submitting..." : "Submit Request"}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
