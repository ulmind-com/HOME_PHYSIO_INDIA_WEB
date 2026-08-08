import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Phone } from "lucide-react";
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

export function NursingBookingModal({
  children,
  defaultService = "",
}: {
  children: React.ReactNode;
  defaultService?: string;
}) {
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  
  const { data: settings } = useQuery(settingsQ());
  const phone = settings?.phone?.replace(/[^\d+]/g, "");

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
      api.post("/bookings", {
        ...data,
        preferred_date: new Date().toISOString().split("T")[0],
        address: "Pending (Provided via Quick Form)",
      }),
    onSuccess: () => {
      setDone(true);
      toast.success("Booking received — we'll contact you shortly.");
    },
    onError: (err: Error) => toast.error(err.message || "Something went wrong."),
  });

  return (
    <Dialog open={open} onOpenChange={(val) => {
      setOpen(val);
      if (!val) {
        setTimeout(() => {
          setDone(false);
          form.reset();
        }, 300);
      }
    }}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-md w-full p-0 overflow-hidden bg-[#F8F9FA] rounded-[2rem] border-none sm:h-auto h-[100dvh] flex flex-col justify-center gap-0">
        <DialogTitle className="sr-only">Book a Nurse</DialogTitle>
        <div className="relative p-6 md:p-8 bg-white h-full sm:h-auto overflow-y-auto flex flex-col justify-center">
          {done ? (
            <div className="text-center py-12">
              <h3 className="font-display text-3xl mb-3">Thank You!</h3>
              <p className="text-muted-foreground mb-8">
                Our nursing team will contact you shortly to confirm the details.
              </p>
              <button
                onClick={() => setOpen(false)}
                className="rounded-full border border-border bg-white px-8 py-3 text-sm font-medium hover:border-primary transition-colors"
              >
                Close
              </button>
            </div>
          ) : (
            <>
              <h3 className="font-display text-2xl md:text-3xl tracking-tight text-foreground mb-2 mt-4 sm:mt-0">
                Book an nurse
              </h3>
              <p className="text-muted-foreground text-sm mb-8">
                Fill out the form and our nursing team will contact you shortly.
              </p>

              <form onSubmit={form.handleSubmit((v) => mut.mutate(v))} className="space-y-4">
                <div>
                  <input
                    {...form.register("patient_name")}
                    placeholder="Full name"
                    className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
                  />
                  {form.formState.errors.patient_name && (
                    <p className="text-xs text-destructive mt-1">
                      {form.formState.errors.patient_name.message}
                    </p>
                  )}
                </div>

                <div>
                  <input
                    {...form.register("contact_phone")}
                    placeholder="Phone number"
                    className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
                  />
                  {form.formState.errors.contact_phone && (
                    <p className="text-xs text-destructive mt-1">
                      {form.formState.errors.contact_phone.message}
                    </p>
                  )}
                </div>

                <div>
                  <select
                    {...form.register("city")}
                    className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15 text-muted-foreground focus:text-foreground"
                  >
                    <option value="">Select city drop-down</option>
                    {CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  {form.formState.errors.city && (
                    <p className="text-xs text-destructive mt-1">
                      {form.formState.errors.city.message}
                    </p>
                  )}
                </div>

                <div>
                  <select
                    {...form.register("service_name")}
                    className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15 text-muted-foreground focus:text-foreground"
                  >
                    <option value="">Select service drop down-Nursing Care at Home</option>
                    <option value="Injection Administration">Injection Administration</option>
                    <option value="IV Infusion & Drip Care">IV Infusion & Drip Care</option>
                    <option value="Wound Dressing Care">Wound Dressing Care</option>
                    <option value="Catheter Care">Catheter Care</option>
                    <option value="Ryles Tube Feeding">Ryles Tube Feeding</option>
                    <option value="Tracheostomy Care">Tracheostomy Care</option>
                    <option value="Post-Hospitalisation Nursing Care">
                      Post-Hospitalisation Nursing Care
                    </option>
                    <option value="Vital Signs Monitoring">Vital Signs Monitoring</option>
                    <option value="Other Nursing Requirement">Other Nursing Requirement</option>
                  </select>
                  {form.formState.errors.service_name && (
                    <p className="text-xs text-destructive mt-1">
                      {form.formState.errors.service_name.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={mut.isPending}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-foreground px-4 py-3.5 text-sm font-semibold text-background hover:bg-accent transition-colors disabled:opacity-60"
                  >
                    {mut.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                    Submit request
                  </button>
                  
                  <a
                    href={`tel:${phone || "+919830098300"}`}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-white px-4 py-3.5 text-sm font-semibold text-foreground hover:bg-surface transition-colors"
                  >
                    <Phone className="h-4 w-4 text-primary" />
                    Call now
                  </a>
                </div>
              </form>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
