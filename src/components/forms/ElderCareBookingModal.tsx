import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CheckCircle2, Loader2 } from "lucide-react";
import { api } from "@/lib/api/client";
import { triggerBookingSuccess } from "@/components/site/GlobalBookingSuccess";

const ELDER_SERVICES = [
  "Elderly care",
  "Patient care",
  "Bedridden Care",
  "24 Hours attendant"
];

const CITIES = [
  "Faridabad",
  "Delhi",
  "Noida",
  "Gurugram"
];

export function ElderCareBookingModal({ children, onOpenChange }: { children: React.ReactNode; onOpenChange?: (open: boolean) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);

  const handleOpenChange = (newOpen: boolean) => {
    setIsOpen(newOpen);
    onOpenChange?.(newOpen);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const dutyHours = formData.get("duty_hours") as string;
    const patientConditionRaw = formData.get("patient_condition") as string;
    const patientCondition = dutyHours 
      ? `Duty Hours: ${dutyHours}${patientConditionRaw ? ` | Condition: ${patientConditionRaw}` : ""}`
      : patientConditionRaw;

    const data = {
      full_name: formData.get("fullName") as string,
      phone_number: formData.get("phone") as string,
      city: formData.get("city") as string,
      service_type: formData.get("service") as string,
      patient_condition: patientCondition,
    };

    try {
      await api.post("/elder-care", data);
      setIsSuccess(true);
      triggerBookingSuccess();
      if (formRef.current) formRef.current.reset();
      
      setTimeout(() => {
        setIsSuccess(false);
        handleOpenChange(false);
      }, 3000);
    } catch (error) {
      console.error("Booking failed:", error);
      alert("Failed to submit request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-[480px] w-[95vw] overflow-hidden rounded-[1.75rem] border border-border bg-white p-6 md:p-8 shadow-2xl sm:h-auto h-auto max-h-[90dvh] overflow-y-auto">
        <DialogTitle className="sr-only">Book an Attendant</DialogTitle>

        <div className="relative pt-2 pb-2">
          {!isSuccess ? (
            <div>
              <div className="mb-6">
                <h3 className="font-display text-2xl md:text-3xl tracking-tight text-foreground mb-2">
                  Book an Attendant
                </h3>
                <p className="text-muted-foreground text-sm">
                  Fill in your details and our care team will contact you shortly.
                </p>
              </div>

              <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                  <input
                    required
                    type="text"
                    name="fullName"
                    placeholder="Full name"
                    className="w-full rounded-full border border-border bg-transparent px-5 py-3.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15 placeholder:text-muted-foreground"
                  />
                </div>

                {/* Phone */}
                <div>
                  <input
                    required
                    type="tel"
                    name="phone"
                    placeholder="Phone number"
                    pattern="[0-9]{10}"
                    maxLength={10}
                    className="w-full rounded-full border border-border bg-transparent px-5 py-3.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15 placeholder:text-muted-foreground"
                  />
                </div>

                {/* City Selection */}
                <div>
                  <div className="relative">
                    <select
                      required
                      name="city"
                      className="w-full rounded-full border border-border bg-transparent px-5 py-3.5 pr-10 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15 text-foreground appearance-none cursor-pointer"
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
                </div>

                {/* Duty Hours */}
                <div>
                  <div className="relative">
                    <select
                      required
                      name="duty_hours"
                      className="w-full rounded-full border border-border bg-transparent px-5 py-3.5 pr-10 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15 text-foreground appearance-none cursor-pointer"
                    >
                      <option value="">Select duty hours</option>
                      {["8 hours", "12 hours", "24 hours"].map((c) => (
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
                </div>

                {/* Service Selection */}
                <div>
                  <div className="relative">
                    <select
                      required
                      name="service"
                      className="w-full rounded-full border border-border bg-black/5 px-5 py-3.5 pr-10 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15 text-foreground appearance-none cursor-pointer"
                    >
                      <option value="">Select required service</option>
                      {ELDER_SERVICES.map((c) => (
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
                </div>

                {/* Patient Condition */}
                <div>
                  <textarea
                    name="patient_condition"
                    placeholder="Patient condition / requirement (optional)"
                    rows={3}
                    className="w-full rounded-2xl border border-border bg-transparent px-5 py-3.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15 placeholder:text-muted-foreground resize-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#0A252E] px-4 py-3.5 text-sm font-semibold text-white hover:bg-[#0A252E]/90 transition-colors disabled:opacity-60"
                  >
                    {isSubmitting && <Loader2 className="h-4.5 w-4.5 animate-spin" />}
                    {isSubmitting ? "Submitting..." : "Submit Request"}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="mx-auto mb-6 relative">
                <div className="h-20 w-20 mx-auto rounded-full bg-green-100 grid place-items-center">
                  <CheckCircle2 className="h-10 w-10 text-green-600" strokeWidth={2} />
                </div>
              </div>
              <h3 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-2">
                Request Received!
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto mb-8">
                Thank you. Our care team will contact you shortly to confirm the details.
              </p>
              <button
                onClick={() => handleOpenChange(false)}
                className="rounded-full border border-border bg-white px-8 py-3 text-sm font-medium text-foreground hover:border-primary transition-colors duration-300"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
