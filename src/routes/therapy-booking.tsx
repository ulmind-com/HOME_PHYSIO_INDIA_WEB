import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import {
  therapyBookingService,
  type FrequencyType,
  type MassageType,
  type PackageDuration,
  type Shift,
  type ServiceCategory,
} from "@/services/api/therapy-booking.service";
import { ApiError } from "@/lib/api/client";
import { Loader2, Activity, Flower2, Hand, HeartPulse, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/therapy-booking")({
  component: TherapyBookingPage,
});

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

const SERVICES: { value: ServiceCategory; label: string; icon: typeof Activity; description: string }[] = [
  { value: "physiotherapy", label: "Physiotherapy", icon: Activity, description: "Home visit physiotherapy sessions" },
  { value: "yoga_therapy", label: "Yoga Therapy", icon: Flower2, description: "Certified yoga & wellness sessions" },
  { value: "massage_therapy", label: "Massage Therapy", icon: Hand, description: "Therapeutic massage at home" },
  { value: "home_rehabilitation", label: "Home Rehabilitation", icon: HeartPulse, description: "Specialised intensive rehab care" },
];

const SHIFTS: { value: Shift; label: string }[] = [
  { value: "morning", label: "Morning" },
  { value: "noon", label: "Noon" },
  { value: "afternoon", label: "Afternoon" },
  { value: "evening", label: "Evening" },
];

function inr(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

function TherapyBookingPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [serviceCategory, setServiceCategory] = useState<ServiceCategory>("physiotherapy");

  // Frequency (physio / yoga / rehab)
  const [frequencyType, setFrequencyType] = useState<FrequencyType>("daily");
  const [dailyVisits, setDailyVisits] = useState(1);
  const [weeklyDays, setWeeklyDays] = useState(3);
  const [packageDuration, setPackageDuration] = useState<PackageDuration>("monthly");
  const [packageCustomMonths, setPackageCustomMonths] = useState(2);
  const [equipment, setEquipment] = useState<string[]>([]);

  // Massage
  const [massageType, setMassageType] = useState<MassageType>("normal_oil");
  const [massageDuration, setMassageDuration] = useState(50);

  // Scheduling
  const [preferredDate, setPreferredDate] = useState("");
  const [shift, setShift] = useState<Shift>("morning");
  const [timeSlot, setTimeSlot] = useState("");

  // Patient / contact
  const [patientName, setPatientName] = useState(user?.name ?? "");
  const [patientAge, setPatientAge] = useState(user?.age ? String(user.age) : "");
  const [patientGender, setPatientGender] = useState<"male" | "female" | "other" | "">(
    (user?.gender as "male" | "female" | "other") ?? ""
  );
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [address, setAddress] = useState(user?.address ?? "");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState(user?.pincode ?? "");
  const [conditionNotes, setConditionNotes] = useState(user?.medical_condition ?? "");

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<{ reference: string } | null>(null);

  const isMassage = serviceCategory === "massage_therapy";

  const { data: equipmentOptions = [] } = useQuery({
    queryKey: ["therapy-equipment"],
    queryFn: () => therapyBookingService.getEquipment(),
    enabled: !isMassage,
  });

  const { data: timeSlots = [] } = useQuery({
    queryKey: ["therapy-time-slots", shift],
    queryFn: () => therapyBookingService.getTimeSlots(shift),
  });

  useEffect(() => {
    setTimeSlot("");
  }, [shift]);

  const draft = useMemo(
    () =>
      isMassage
        ? { service_category: serviceCategory, massage_type: massageType, massage_duration_minutes: massageDuration }
        : {
            service_category: serviceCategory,
            frequency_type: frequencyType,
            daily_visits_per_day: frequencyType === "daily" ? dailyVisits : undefined,
            equipment,
          },
    [isMassage, serviceCategory, massageType, massageDuration, frequencyType, dailyVisits, equipment]
  );

  const { data: quote, isFetching: isQuoting } = useQuery({
    queryKey: ["therapy-quote", draft],
    queryFn: () => therapyBookingService.getQuote(draft),
  });

  const toggleEquipment = (code: string) => {
    setEquipment((prev) => (prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]));
  };

  const createMut = useMutation({
    mutationFn: () =>
      therapyBookingService.create({
        ...draft,
        patient_name: patientName,
        patient_age: patientAge ? Number(patientAge) : undefined,
        patient_gender: patientGender || undefined,
        contact_phone: phone,
        contact_email: email || undefined,
        address,
        city: city || undefined,
        pincode: pincode || undefined,
        condition_notes: conditionNotes || undefined,
        preferred_date: preferredDate,
        shift,
        time_slot: timeSlot,
        weekly_days_count: !isMassage && frequencyType === "weekly" ? weeklyDays : undefined,
        package_duration: !isMassage && frequencyType === "package" ? packageDuration : undefined,
        package_custom_months:
          !isMassage && frequencyType === "package" && packageDuration === "custom" ? packageCustomMonths : undefined,
      }),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isMassage && !patientGender) {
      toast.error("Please select the patient's gender — required to match a same-gender therapist for massage therapy.");
      return;
    }
    if (!timeSlot) {
      toast.error("Please select a time slot.");
      return;
    }
    setSubmitting(true);
    try {
      const init = await createMut.mutateAsync();
      const loaded = await loadRazorpayScript();
      if (!loaded || !window.Razorpay) {
        toast.error("Could not load the payment widget. Please check your connection and try again.");
        return;
      }

      const rzp = new window.Razorpay({
        key: init.razorpay_key_id,
        amount: init.amount,
        currency: init.currency,
        name: "Home Physio India",
        description: `${patientName} — ${serviceCategory.replace("_", " ")}`,
        order_id: init.razorpay_order_id,
        prefill: { name: patientName, email, contact: phone },
        theme: { color: "#0f766e" },
        handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          try {
            await therapyBookingService.verifyPayment(init.booking.id, response);
            setSuccess({ reference: init.booking.reference });
            toast.success("Payment successful — booking confirmed!");
          } catch (err) {
            toast.error(err instanceof ApiError ? err.message : "Payment verification failed. Contact support with your reference: " + init.booking.reference);
          }
        },
        modal: {
          ondismiss: () => {
            toast.info("Payment cancelled. Your booking is saved as pending — you can try again.");
          },
        },
      });
      rzp.open();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not create booking. Please check the form and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="container-x py-24 md:py-32">
        <div className="max-w-md mx-auto text-center rounded-3xl border border-border bg-surface shadow-sm p-10">
          <CheckCircle2 className="h-14 w-14 text-green-600 mx-auto mb-4" />
          <h1 className="text-xl font-display font-bold">Booking Confirmed!</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Reference <span className="font-mono font-medium text-foreground">{success.reference}</span>. Our team will assign a therapist and confirm your visit shortly.
          </p>
          <button
            onClick={() => router.navigate({ to: "/user/dashboard" })}
            className="mt-6 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-x py-24 md:py-32">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Book a Home Visit</h1>
          <p className="mt-2 text-muted-foreground">Choose your service, schedule a visit, and pay securely to confirm.</p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Service selection */}
            <div className="rounded-3xl border border-border bg-surface shadow-sm p-6">
              <h2 className="font-semibold mb-4">1. Select Service</h2>
              <div className="grid grid-cols-2 gap-3">
                {SERVICES.map((s) => (
                  <button
                    type="button"
                    key={s.value}
                    onClick={() => setServiceCategory(s.value)}
                    className={`flex flex-col items-start gap-1 rounded-2xl border p-4 text-left transition-colors ${
                      serviceCategory === s.value ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"
                    }`}
                  >
                    <s.icon className="h-5 w-5 text-primary" />
                    <span className="text-sm font-semibold">{s.label}</span>
                    <span className="text-xs text-muted-foreground">{s.description}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Frequency / massage details */}
            <div className="rounded-3xl border border-border bg-surface shadow-sm p-6 space-y-4">
              <h2 className="font-semibold">2. {isMassage ? "Session Details" : "Frequency & Equipment"}</h2>

              {isMassage ? (
                <>
                  <div className="grid grid-cols-3 gap-2">
                    {(["normal_oil", "dry", "deep_tissue"] as MassageType[]).map((t) => (
                      <button
                        type="button"
                        key={t}
                        onClick={() => setMassageType(t)}
                        className={`rounded-xl border px-3 py-2 text-xs font-medium capitalize ${
                          massageType === t ? "border-primary bg-primary/5 text-primary" : "border-border"
                        }`}
                      >
                        {t.replace("_", " ")}
                      </button>
                    ))}
                  </div>
                  <div>
                    <label className="text-sm font-medium">Duration (minutes)</label>
                    <input
                      type="number"
                      min={30}
                      max={120}
                      value={massageDuration}
                      onChange={(e) => setMassageDuration(Number(e.target.value))}
                      className="mt-1 flex h-10 w-full rounded-xl border border-input bg-transparent px-3 text-sm"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Sessions over 60 minutes have a ₹100 surcharge.</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Patient Gender <span className="text-destructive">*</span></label>
                    <p className="text-xs text-muted-foreground mb-1">Required — a same-gender therapist will be assigned (safety policy).</p>
                    <div className="flex gap-2">
                      {(["male", "female", "other"] as const).map((g) => (
                        <button
                          type="button"
                          key={g}
                          onClick={() => setPatientGender(g)}
                          className={`px-4 py-2 rounded-xl border text-sm capitalize ${
                            patientGender === g ? "border-primary bg-primary/5 text-primary" : "border-border"
                          }`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex gap-2">
                    {(["daily", "weekly", "package"] as FrequencyType[]).map((f) => (
                      <button
                        type="button"
                        key={f}
                        onClick={() => setFrequencyType(f)}
                        className={`flex-1 rounded-xl border px-3 py-2 text-xs font-medium capitalize ${
                          frequencyType === f ? "border-primary bg-primary/5 text-primary" : "border-border"
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>

                  {frequencyType === "daily" && (
                    <div className="flex gap-2">
                      {[1, 2, 3].map((n) => (
                        <button
                          type="button"
                          key={n}
                          onClick={() => setDailyVisits(n)}
                          className={`flex-1 rounded-xl border px-3 py-2 text-xs font-medium ${
                            dailyVisits === n ? "border-primary bg-primary/5 text-primary" : "border-border"
                          }`}
                        >
                          {n} visit{n > 1 ? "s" : ""}/day
                        </button>
                      ))}
                    </div>
                  )}

                  {frequencyType === "weekly" && (
                    <div>
                      <label className="text-sm font-medium">Days per week</label>
                      <input
                        type="number" min={1} max={7} value={weeklyDays}
                        onChange={(e) => setWeeklyDays(Number(e.target.value))}
                        className="mt-1 flex h-10 w-full rounded-xl border border-input bg-transparent px-3 text-sm"
                      />
                    </div>
                  )}

                  {frequencyType === "package" && (
                    <div className="space-y-2">
                      <div className="grid grid-cols-3 gap-2">
                        {(["monthly", "quarterly", "half_yearly", "yearly", "custom"] as PackageDuration[]).map((p) => (
                          <button
                            type="button"
                            key={p}
                            onClick={() => setPackageDuration(p)}
                            className={`rounded-xl border px-3 py-2 text-xs font-medium capitalize ${
                              packageDuration === p ? "border-primary bg-primary/5 text-primary" : "border-border"
                            }`}
                          >
                            {p.replace("_", " ")}
                          </button>
                        ))}
                      </div>
                      {packageDuration === "custom" && (
                        <div>
                          <label className="text-sm font-medium">Custom duration (months)</label>
                          <input
                            type="number" min={1} max={24} value={packageCustomMonths}
                            onChange={(e) => setPackageCustomMonths(Number(e.target.value))}
                            className="mt-1 flex h-10 w-full rounded-xl border border-input bg-transparent px-3 text-sm"
                          />
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground">Package pricing already includes applicable machine use.</p>
                    </div>
                  )}

                  {frequencyType !== "package" && (
                    <div>
                      <label className="text-sm font-medium">Portable Equipment (₹100 each)</label>
                      <div className="grid grid-cols-2 gap-2 mt-1">
                        {equipmentOptions.map((eq) => (
                          <label key={eq.code} className="flex items-center gap-2 text-xs rounded-lg border border-border px-3 py-2 cursor-pointer">
                            <input type="checkbox" checked={equipment.includes(eq.code)} onChange={() => toggleEquipment(eq.code)} />
                            {eq.name}
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Scheduling */}
            <div className="rounded-3xl border border-border bg-surface shadow-sm p-6 space-y-4">
              <h2 className="font-semibold">3. Schedule</h2>
              <div>
                <label className="text-sm font-medium">Preferred Date</label>
                <input
                  type="date" required value={preferredDate} min={new Date().toISOString().slice(0, 10)}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="mt-1 flex h-10 w-full rounded-xl border border-input bg-transparent px-3 text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Shift</label>
                <div className="grid grid-cols-4 gap-2 mt-1">
                  {SHIFTS.map((s) => (
                    <button
                      type="button" key={s.value} onClick={() => setShift(s.value)}
                      className={`rounded-xl border px-2 py-2 text-xs font-medium ${
                        shift === s.value ? "border-primary bg-primary/5 text-primary" : "border-border"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Time Slot</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {timeSlots.map((slot) => (
                    <button
                      type="button" key={slot} onClick={() => setTimeSlot(slot)}
                      className={`rounded-lg border px-3 py-1.5 text-xs font-medium ${
                        timeSlot === slot ? "border-primary bg-primary/5 text-primary" : "border-border"
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Patient details */}
            <div className="rounded-3xl border border-border bg-surface shadow-sm p-6 space-y-4">
              <h2 className="font-semibold">4. Patient & Contact Details</h2>
              <div className="grid grid-cols-2 gap-3">
                <input required placeholder="Patient Name" value={patientName} onChange={(e) => setPatientName(e.target.value)} className="flex h-10 rounded-xl border border-input bg-transparent px-3 text-sm" />
                <input placeholder="Age" type="number" value={patientAge} onChange={(e) => setPatientAge(e.target.value)} className="flex h-10 rounded-xl border border-input bg-transparent px-3 text-sm" />
                <input required placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="flex h-10 rounded-xl border border-input bg-transparent px-3 text-sm" />
                <input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="flex h-10 rounded-xl border border-input bg-transparent px-3 text-sm" />
                <input placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} className="flex h-10 rounded-xl border border-input bg-transparent px-3 text-sm" />
                <input placeholder="PIN Code" value={pincode} onChange={(e) => setPincode(e.target.value)} className="flex h-10 rounded-xl border border-input bg-transparent px-3 text-sm" />
              </div>
              <textarea required placeholder="Full Address" value={address} onChange={(e) => setAddress(e.target.value)} rows={2} className="flex w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm resize-none" />
              <textarea placeholder="Describe the condition / problem (optional)" value={conditionNotes} onChange={(e) => setConditionNotes(e.target.value)} rows={3} className="flex w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm resize-none" />
            </div>
          </div>

          {/* Price summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-3xl border border-border bg-surface shadow-sm p-6 space-y-3">
              <h2 className="font-semibold">Price Summary</h2>
              {isQuoting || !quote ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground py-4"><Loader2 className="h-4 w-4 animate-spin" /> Calculating…</div>
              ) : (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Visit fee</span><span>{inr(quote.visit_fee)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Machine charge</span><span>{inr(quote.machine_charge)}</span></div>
                  <div className="border-t border-border my-2" />
                  <div className="flex justify-between font-semibold text-base"><span>Total</span><span>{inr(quote.total_amount)}</span></div>
                  <p className="text-xs text-muted-foreground pt-2">This is your booking confirmation payment. Charged now via Razorpay.</p>
                </div>
              )}
              <button
                type="submit"
                disabled={submitting || createMut.isPending || !quote}
                className="w-full mt-2 h-11 rounded-xl bg-primary text-primary-foreground text-sm font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {(submitting || createMut.isPending) && <Loader2 className="h-4 w-4 animate-spin" />}
                Pay {quote ? inr(quote.total_amount) : ""} & Confirm
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
