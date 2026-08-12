import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { api } from "@/lib/api/client";
import { settingsQ } from "@/lib/api/queries";
import { triggerBookingSuccess } from "@/components/site/GlobalBookingSuccess";
import { CITIES } from "@/components/forms/BookingForm";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";

const physioFormSchema = z.object({
  patient_name: z.string().min(2, "Enter full name"),
  contact_phone: z.string().min(7, "Enter a valid phone number"),
  city: z.string().min(1, "Select a city"),
  service_name: z.string().min(1, "Select a service"),
  patient_condition: z.string().optional(),
});

type PhysioFormValues = z.infer<typeof physioFormSchema>;

export const PHYSIO_SERVICES = [
  "Physiotherapy at Home",
  "Post-Hospitalization Physiotherapy",
  "Post-Surgery Rehabilitation",
  "Stroke Rehabilitation",
  "Orthopedic Physiotherapy",
  "Bedridden Patient Physiotherapy",
  "Geriatric Physiotherapy",
  "Mobility & Balance Training",
  "Pain Management & Exercise Therapy",
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

export function PhysioBookingModal({
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

  const form = useForm<PhysioFormValues>({
    resolver: zodResolver(physioFormSchema),
    defaultValues: {
      patient_name: "",
      contact_phone: "",
      city: "",
      service_name: defaultService,
      patient_condition: "",
    },
  });

  const mut = useMutation({
    mutationFn: (data: PhysioFormValues) =>
      api.post<{ reference?: string }>("/bookings", {
        ...data,
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
        <DialogTitle className="sr-only">Book a Physiotherapist</DialogTitle>

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
                  Our physiotherapy team will contact you shortly to confirm the details and
                  arrange a session for your patient.
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
                    Book a Physiotherapist
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Fill out the details and our team will reach out within minutes.
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

                  {/* City */}
                  <div>
                    <div className="relative">
                      <select
                        {...form.register("city")}
                        className="w-full rounded-full border border-border bg-transparent px-5 py-3.5 pr-10 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15 text-muted-foreground focus:text-foreground appearance-none cursor-pointer"
                      >
                        <option value="">Select city</option>
                        {CITIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none"
                      >
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </div>
                    {form.formState.errors.city && (
                      <p className="text-xs text-destructive mt-1.5 pl-1">
                        {form.formState.errors.city.message}
                      </p>
                    )}
                  </div>

                  {/* Service */}
                  <div>
                    <div className="relative">
                      <select
                        {...form.register("service_name")}
                        className="w-full rounded-full border border-border bg-black/5 px-5 py-3.5 pr-10 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15 text-muted-foreground focus:text-foreground appearance-none cursor-pointer"
                      >
                        <option value="">Select physiotherapy service</option>
                        {PHYSIO_SERVICES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none"
                      >
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </div>
                    {form.formState.errors.service_name && (
                      <p className="text-xs text-destructive mt-1.5 pl-1">
                        {form.formState.errors.service_name.message}
                      </p>
                    )}
                  </div>

                  {/* Patient Condition */}
                  <div>
                    <textarea
                      {...form.register("patient_condition")}
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
