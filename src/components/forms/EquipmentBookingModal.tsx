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
  ChevronDown,
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
  const phone = settings?.phone?.replace(/[^\d+]/g, "");

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
        equipment_id: `eq_${data.equipment_name.toLowerCase().replace(/\s+/g, "_")}`,
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
      <DialogContent className="max-w-[480px] w-[95vw] overflow-hidden rounded-[1.75rem] border border-border bg-white p-6 md:p-8 shadow-2xl sm:h-auto h-auto max-h-[90dvh] overflow-y-auto">
        <DialogTitle className="sr-only">Check Equipment Availability</DialogTitle>
        
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
                {/* Animated checkmark ring */}
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
                  Request Received!
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
                  Our team will check equipment availability and contact you shortly with delivery details and applicable charges.
                </motion.p>

                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  onClick={() => setOpen(false)}
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
                {/* Header */}
                <div className="mb-6">
                  <h3 className="font-display text-2xl md:text-3xl tracking-tight text-foreground mb-2">
                    Check Availability
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Tell us what you need and our team will contact you shortly.
                  </p>
                </div>

                <form onSubmit={form.handleSubmit((v) => mut.mutate(v))} className="space-y-4">
                  {/* Name */}
                  <div>
                    <input
                      {...form.register("customer_name")}
                      placeholder="Full name"
                      className="w-full rounded-full border border-border bg-transparent px-5 py-3.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15 placeholder:text-muted-foreground"
                    />
                    {form.formState.errors.customer_name && (
                      <p className="text-xs text-destructive mt-1.5 pl-1">
                        {form.formState.errors.customer_name.message}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <input
                      {...form.register("customer_phone")}
                      placeholder="Phone number"
                      type="tel"
                      className="w-full rounded-full border border-border bg-transparent px-5 py-3.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15 placeholder:text-muted-foreground"
                    />
                    {form.formState.errors.customer_phone && (
                      <p className="text-xs text-destructive mt-1.5 pl-1">
                        {form.formState.errors.customer_phone.message}
                      </p>
                    )}
                  </div>

                  {/* Equipment */}
                  <div>
                    <div className="relative">
                      <select
                        {...form.register("equipment_name")}
                        className="w-full rounded-full border border-border bg-black/5 px-5 py-3.5 pr-10 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15 text-muted-foreground focus:text-foreground appearance-none cursor-pointer"
                      >
                        <option value="">Select equipment</option>
                        {EQUIPMENT_OPTIONS.map((e) => (
                          <option key={e} value={e}>
                            {e}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    </div>
                    {form.formState.errors.equipment_name && (
                      <p className="text-xs text-destructive mt-1.5 pl-1">
                        {form.formState.errors.equipment_name.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {/* Location */}
                    <div>
                      <div className="relative">
                        <select
                          {...form.register("address")}
                          className="w-full rounded-full border border-border bg-transparent px-5 py-3.5 pr-10 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15 text-muted-foreground focus:text-foreground appearance-none cursor-pointer"
                        >
                          <option value="">Location</option>
                          {CITIES.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                      </div>
                      {form.formState.errors.address && (
                        <p className="text-xs text-destructive mt-1.5 pl-1">
                          {form.formState.errors.address.message}
                        </p>
                      )}
                    </div>

                    {/* Duration */}
                    <div>
                      <div className="relative">
                        <select
                          {...form.register("duration_days")}
                          className="w-full rounded-full border border-border bg-transparent px-5 py-3.5 pr-10 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15 text-muted-foreground focus:text-foreground appearance-none cursor-pointer"
                        >
                          <option value="">Duration</option>
                          {["1 week", "2 weeks", "1 month", "3 months", "Other"].map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <textarea
                      {...form.register("message")}
                      placeholder="Patient condition / requirement (optional)"
                      rows={3}
                      className="w-full rounded-2xl border border-border bg-transparent px-5 py-3.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15 placeholder:text-muted-foreground resize-none"
                    />
                  </div>

                  {/* Submit Action */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={mut.isPending}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#0A252E] px-4 py-3.5 text-sm font-semibold text-white hover:bg-[#0A252E]/90 transition-colors disabled:opacity-60"
                    >
                      {mut.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Check Availability"}
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
