import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { User, Phone, CheckCircle2, Loader2, CalendarHeart, Clock, HeartHandshake } from "lucide-react";
import { api } from "@/lib/api/client";

const ELDER_SERVICES = [
  "Elderly Care",
  "Bedridden Patient Care",
  "Mobility Assistance",
  "Daily Living Support",
];

const DUTY_HOURS = [
  "Hourly Support",
  "Daytime Care (8-12 hours)",
  "Overnight Care",
  "24-Hour Care",
];

export function ElderCareBookingModal({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      full_name: formData.get("fullName") as string,
      phone_number: formData.get("phone") as string,
      service_type: formData.get("service") as string,
      patient_condition: formData.get("condition") as string,
      preferred_duty_hours: formData.get("dutyHours") as string,
    };

    try {
      await api.post("/elder-care", data);
      setIsSuccess(true);
      if (formRef.current) formRef.current.reset();
      
      setTimeout(() => {
        setIsSuccess(false);
        setIsOpen(false);
      }, 3000);
    } catch (error) {
      console.error("Booking failed:", error);
      alert("Failed to submit request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-[480px] w-full p-0 overflow-hidden rounded-[1.75rem] border border-white/15 bg-transparent shadow-[0_50px_100px_-30px_rgba(0,0,0,0.5)] sm:h-auto h-[100dvh] flex flex-col justify-center gap-0">
        {/* Glassmorphism Background */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#0c1c20] via-[#0f2a24] to-[#0a1818] backdrop-blur-3xl" />
        
        {/* Decorative elements */}
        <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-primary/15 blur-[80px] pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 h-36 w-36 rounded-full bg-teal-600/10 blur-[60px] pointer-events-none" />

        <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 sm:p-8 custom-scrollbar">
          {!isSuccess ? (
            <div className="relative">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-white/5 border border-white/10 mb-5 relative">
                  <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                  <HeartHandshake className="w-8 h-8 text-primary relative z-10" />
                </div>
                <DialogTitle className="text-2xl font-display font-bold text-white mb-2">
                  Book an Attendant
                </DialogTitle>
                <p className="text-white/60 text-sm">
                  Fill in your details and our care team will contact you shortly.
                </p>
              </div>

              <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-[13px] font-medium text-white/80 pl-1">
                    Full Name
                  </label>
                  <div className="relative group">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40 group-focus-within:text-primary transition-colors" />
                    <input
                      required
                      type="text"
                      name="fullName"
                      placeholder="Enter full name"
                      className="w-full rounded-xl border border-white/10 bg-white/[0.06] pl-11 pr-4 py-3.5 text-sm text-white placeholder-white/35 outline-none transition-all duration-300 focus:border-primary/50 focus:bg-white/[0.08] focus:shadow-[0_0_0_3px_rgba(0,128,128,0.08)]"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <label className="text-[13px] font-medium text-white/80 pl-1">
                    Phone Number
                  </label>
                  <div className="relative group">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40 group-focus-within:text-primary transition-colors" />
                    <input
                      required
                      type="tel"
                      name="phone"
                      placeholder="10-digit mobile number"
                      pattern="[0-9]{10}"
                      maxLength={10}
                      className="w-full rounded-xl border border-white/10 bg-white/[0.06] pl-11 pr-4 py-3.5 text-sm text-white placeholder-white/35 outline-none transition-all duration-300 focus:border-primary/50 focus:bg-white/[0.08] focus:shadow-[0_0_0_3px_rgba(0,128,128,0.08)]"
                    />
                  </div>
                </div>

                {/* Service Selection */}
                <div className="space-y-1.5">
                  <label className="text-[13px] font-medium text-white/80 pl-1">
                    Select Service
                  </label>
                  <div className="relative group">
                    <HeartHandshake className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40 group-focus-within:text-primary transition-colors z-10" />
                    <select
                      required
                      name="service"
                      className="w-full rounded-xl border border-white/10 bg-white/[0.06] pl-11 pr-4 py-3.5 text-sm text-white/60 focus:text-white outline-none transition-all duration-300 focus:border-primary/50 focus:bg-white/[0.08] focus:shadow-[0_0_0_3px_rgba(0,128,128,0.08)] appearance-none cursor-pointer"
                    >
                      <option value="" className="bg-[#0f2a1f] text-white/50">
                        Select required service...
                      </option>
                      {ELDER_SERVICES.map((c) => (
                        <option key={c} value={c} className="bg-[#0f2a1f] text-white">
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Patient Condition */}
                <div className="space-y-1.5">
                  <label className="text-[13px] font-medium text-white/80 pl-1">
                    Patient Condition / Requirement
                  </label>
                  <div className="relative group">
                    <CalendarHeart className="absolute left-3.5 top-4 h-5 w-5 text-white/40 group-focus-within:text-primary transition-colors" />
                    <textarea
                      required
                      name="condition"
                      rows={3}
                      placeholder="Briefly describe the patient's condition..."
                      className="w-full rounded-xl border border-white/10 bg-white/[0.06] pl-11 pr-4 py-3.5 text-sm text-white placeholder-white/35 outline-none transition-all duration-300 focus:border-primary/50 focus:bg-white/[0.08] focus:shadow-[0_0_0_3px_rgba(0,128,128,0.08)] resize-none"
                    />
                  </div>
                </div>

                {/* Duty Hours */}
                <div className="space-y-1.5">
                  <label className="text-[13px] font-medium text-white/80 pl-1">
                    Preferred Duty Hours
                  </label>
                  <div className="relative group">
                    <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40 group-focus-within:text-primary transition-colors z-10" />
                    <select
                      required
                      name="dutyHours"
                      className="w-full rounded-xl border border-white/10 bg-white/[0.06] pl-11 pr-4 py-3.5 text-sm text-white/60 focus:text-white outline-none transition-all duration-300 focus:border-primary/50 focus:bg-white/[0.08] focus:shadow-[0_0_0_3px_rgba(0,128,128,0.08)] appearance-none cursor-pointer"
                    >
                      <option value="" className="bg-[#0f2a1f] text-white/50">
                        Select duty hours...
                      </option>
                      {DUTY_HOURS.map((s) => (
                        <option key={s} value={s} className="bg-[#0f2a1f] text-white">
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group w-full relative inline-flex items-center justify-center gap-2.5 rounded-xl bg-primary px-6 py-4 text-[15px] font-semibold text-primary-foreground shadow-[0_20px_40px_-12px_rgba(0,128,128,0.35)] transition-all duration-300 hover:shadow-[0_25px_50px_-12px_rgba(0,128,128,0.45)] hover:-translate-y-0.5 disabled:opacity-60 disabled:pointer-events-none overflow-hidden"
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <>
                        Submit Request
                        <CheckCircle2 className="h-5 w-5 opacity-70 group-hover:opacity-100 transition-opacity" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center py-10">
              <div className="h-20 w-20 rounded-full bg-emerald-500/10 text-emerald-400 grid place-items-center mb-6 border border-emerald-500/20">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <h3 className="text-2xl font-display font-bold text-white mb-3">
                Request Received!
              </h3>
              <p className="text-white/60 text-[15px] max-w-[280px] mx-auto leading-relaxed">
                Thank you. Our care team will contact you shortly to confirm the details.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
