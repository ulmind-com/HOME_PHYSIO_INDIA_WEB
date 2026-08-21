import { useState } from "react";
import { useForm, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, ChevronLeft, ChevronRight, Loader2, Sparkles, ShieldCheck, Clock, DollarSign } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api/client";
import { triggerBookingSuccess } from "@/components/site/GlobalBookingSuccess";
import { categoriesQ } from "@/lib/api/queries";
import { cn } from "@/lib/utils";

/* ─────────────── Schema ─────────────── */

const emptyToUndef = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess((v) => (v === "" || v === null ? undefined : v), schema);

const CITIES = ["Faridabad", "Gurugram", "Noida", "Delhi", "Other"] as const;
type City = (typeof CITIES)[number];

const schema = z.object({
  // Step 1 — Service
  service_name: z.string().trim().min(2, "Please choose a service"),
  service_id: emptyToUndef(z.string().optional()),

  // Step 2 — Location & Schedule
  city: z.string().min(1, "Please select a city"),
  preferred_date: z.string().min(1, "Pick a date"),
  preferred_time: emptyToUndef(z.string().optional()),

  // Step 3 — Patient
  patient_name: z.string().trim().min(2, "Enter patient name").max(120),
  patient_age: emptyToUndef(z.coerce.number().int().min(0).max(120).optional()),
  patient_gender: emptyToUndef(z.enum(["male", "female", "other"]).optional()),
  care_required: emptyToUndef(z.string().max(1000).optional()),
  message: emptyToUndef(z.string().max(1000).optional()),

  // Step 4 — Contact
  contact_phone: z.string().trim().min(7, "Enter a valid phone").max(20),
  whatsapp_number: emptyToUndef(z.string().max(20).optional()),
  contact_email: emptyToUndef(z.string().trim().email("Enter a valid email").optional()),
  address: z.string().trim().min(5, "Enter the full address").max(500),
  pincode: emptyToUndef(z.string().optional()),
});

type Values = z.infer<typeof schema>;

export { CITIES };
export type { City };

/* ─────────────── Steps ─────────────── */

const STEPS = [
  { key: "service", label: "Training", fields: ["service_name"] as const },
  { key: "schedule", label: "Location & Schedule", fields: ["city", "preferred_date", "preferred_time"] as const },
  {
    key: "patient",
    label: "Patient Details",
    fields: ["patient_name", "patient_age", "patient_gender", "care_required", "message"] as const,
  },
  {
    key: "contact",
    label: "Contact & Address",
    fields: ["contact_phone", "whatsapp_number", "contact_email", "address", "pincode"] as const,
  },
];

/* ─────────────── Service helpers ─────────────── */

const DEFAULT_SERVICES = [
  { name: "Home Sample Collection", slug: "home-sample-collection" },
  { name: "ICU Setup", slug: "icu-setup" },
  { name: "Medical Equipment Rental", slug: "medical-equipment-rental" },
  { name: "Physiotherapy & Recovery", slug: "physiotherapy-recovery" },
  { name: "Mother & Baby Care", slug: "mother-baby-care" },
  { name: "Elderly Care", slug: "elderly-care" },
  { name: "Home Nursing Care", slug: "home-nursing-care" },
];

const SERVICE_CARE_HINTS: Record<string, string> = {
  "Home Sample Collection": "What test/sample collection is required?",
  "ICU Setup": "What ICU setup and equipment are needed?",
  "Medical Equipment Rental": "Which equipment is required and for how long?",
  "Physiotherapy & Recovery": "What type of physiotherapy is required?",
  "Mother & Baby Care": "What type of mother/baby care is needed?",
  "Elderly Care": "What type of elderly care is required?",
  "Home Nursing Care": "What type of nursing care is required?",
};

/* ─────────────── Main Component ─────────────── */

export function BookingForm({
  presetServiceSlug,
  presetServiceName,
  presetCity,
}: {
  presetServiceSlug?: string;
  presetServiceName?: string;
  presetCity?: City;
} = {}) {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);

  const { data: categoriesData } = useQuery(categoriesQ({ limit: 20 }));
  const categories = categoriesData?.items ?? [];

  const serviceOptions =
    categories.length > 0
      ? categories.map((c) => ({ name: c.name || "", slug: c.slug || "" }))
      : DEFAULT_SERVICES;

  const form = useForm<Values>({
    resolver: zodResolver(schema) as never,
    mode: "onBlur",
    defaultValues: {
      service_name: presetServiceName ?? "",
      service_id: "",
      city: presetCity ?? "",
      preferred_date: "",
      preferred_time: "",
      patient_name: "",
      care_required: "",
      message: "",
      contact_phone: "",
      whatsapp_number: "",
      contact_email: "",
      address: "",
      pincode: "",
    },
  });

  const mut = useMutation({
    mutationFn: (data: Values) => api.post("/bookings", { ...data, source: "website" }),
    onSuccess: () => {
      setDone(true);
      triggerBookingSuccess();
      toast.success("Request received — we'll contact you shortly.");
    },
    onError: (err: Error) => toast.error(err.message || "Something went wrong. Please try again."),
  });

  const next = async () => {
    const fields = STEPS[step].fields as unknown as (keyof Values)[];
    const ok = await form.trigger(fields, { shouldFocus: true });
    if (!ok) return;
    if (step < STEPS.length - 1) setStep(step + 1);
    else form.handleSubmit((v) => mut.mutate(v))();
  };
  const back = () => setStep((s) => Math.max(0, s - 1));

  if (done)
    return (
      <SuccessState
        onReset={() => {
          setDone(false);
          setStep(0);
          form.reset();
        }}
      />
    );

  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-border bg-gradient-to-b from-surface to-background/60 shadow-[var(--shadow-float)]">
      {/* Ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full blur-3xl opacity-40"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--primary) 55%, transparent), transparent 65%)",
        }}
      />

      {/* Progress header */}
      <div className="relative border-b border-border/70 px-6 pt-6 pb-4 lg:px-9 lg:pt-8">
        <div className="flex items-center justify-between text-xs uppercase tracking-[0.18em]">
          <span className="text-accent font-semibold">
            Step {step + 1} of {STEPS.length}
          </span>
          <span className="text-muted-foreground">{STEPS[step].label}</span>
        </div>
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-primary-soft">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
        <div className="mt-4 hidden md:flex items-center justify-between gap-2">
          {STEPS.map((s, i) => (
            <button
              key={s.key}
              type="button"
              onClick={() => i < step && setStep(i)}
              className={cn(
                "flex items-center gap-2 text-xs font-medium transition-colors",
                i === step ? "text-foreground" : i < step ? "text-accent" : "text-muted-foreground",
              )}
            >
              <span
                className={cn(
                  "grid h-6 w-6 place-items-center rounded-full border text-[11px] font-semibold",
                  i === step
                    ? "border-primary bg-primary text-primary-foreground"
                    : i < step
                      ? "border-accent bg-accent text-accent-foreground"
                      : "border-border bg-transparent",
                )}
              >
                {i < step ? <CheckCircle2 className="h-3.5 w-3.5" /> : i + 1}
              </span>
              <span className="hidden lg:inline">{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Body */}
      <form
        className="relative px-6 py-8 lg:px-9 lg:py-10"
        onSubmit={(e) => {
          e.preventDefault();
          next();
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {step === 0 && <ServiceStep form={form} services={serviceOptions} />}
            {step === 1 && <ScheduleStep form={form} />}
            {step === 2 && <PatientStep form={form} />}
            {step === 3 && <ContactStep form={form} />}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="mt-10 flex items-center justify-between">
          <button
            type="button"
            onClick={back}
            className={cn(
              "flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors",
              step === 0 && "invisible",
            )}
          >
            <ChevronLeft className="h-4 w-4" /> Back
          </button>
          <button
            type="submit"
            disabled={mut.isPending}
            className="group flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 disabled:opacity-70"
          >
            {mut.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Submitting…
              </>
            ) : step < STEPS.length - 1 ? (
              <>
                Continue <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </>
            ) : (
              "Submit Request"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

/* ─────────────── Step 1: Service ─────────────── */

function ServiceStep({
  form,
  services,
}: {
  form: UseFormReturn<Values>;
  services: { name: string; slug: string }[];
}) {
  const selected = form.watch("service_name");

  return (
    <div className="grid gap-6">
      <StepHeader
        eyebrow="Training"
        title="Which training do you need?"
        description="Select the type of training you're looking for."
      />
      <div className="grid gap-3 sm:grid-cols-2">
        {services.map((svc) => {
          const active = selected === svc.name;
          return (
            <button
              key={svc.slug}
              type="button"
              onClick={() => {
                form.setValue("service_name", svc.name, { shouldValidate: true });
                form.setValue("service_id", svc.slug);
              }}
              className={cn(
                "flex items-center gap-3 rounded-2xl border px-5 py-4 text-left text-[15px] font-medium transition-all duration-200",
                active
                  ? "border-primary bg-primary/5 text-primary shadow-md shadow-primary/10 ring-2 ring-primary/20"
                  : "border-border bg-white hover:border-primary/40 hover:bg-primary/[0.02] text-foreground",
              )}
            >
              <span
                className={cn(
                  "grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 transition-colors",
                  active ? "border-primary bg-primary" : "border-gray-300",
                )}
              >
                {active && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="h-2 w-2 rounded-full bg-white"
                  />
                )}
              </span>
              {svc.name}
            </button>
          );
        })}
      </div>
      {form.formState.errors.service_name && (
        <p className="text-xs text-destructive">{form.formState.errors.service_name.message}</p>
      )}
    </div>
  );
}

/* ─────────────── Step 2: Location & Schedule ─────────────── */

function ScheduleStep({ form }: { form: UseFormReturn<Values> }) {
  return (
    <div className="grid gap-6">
      <StepHeader
        eyebrow="Location & Schedule"
        title="Where and when do you need care?"
        description="Pick your preferred city, date and time — final slot is confirmed on the call."
      />
      <FloatField label="Select City" error={form.formState.errors.city?.message}>
        <select {...form.register("city")} className={inputCls}>
          <option value="">Select city</option>
          {CITIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </FloatField>
      <div className="grid gap-4 md:grid-cols-2">
        <FloatField label="Preferred Date" error={form.formState.errors.preferred_date?.message}>
          <input type="date" {...form.register("preferred_date")} className={inputCls} />
        </FloatField>
        <FloatField label="Preferred Time">
          <input type="time" {...form.register("preferred_time")} className={inputCls} />
        </FloatField>
      </div>
      <div className="rounded-2xl border border-border bg-primary-soft/40 p-4 text-sm text-muted-foreground flex items-start gap-3">
        <Sparkles className="h-4 w-4 mt-0.5 text-accent shrink-0" />
        <span>
          Our care desk is open 24/7. A dedicated advisor will confirm your slot within 2 hours.
        </span>
      </div>
    </div>
  );
}

/* ─────────────── Step 3: Patient & Requirement ─────────────── */

function PatientStep({ form }: { form: UseFormReturn<Values> }) {
  const serviceName = form.watch("service_name");
  const careHint = SERVICE_CARE_HINTS[serviceName] || "What specific care/service do you require?";

  return (
    <div className="grid gap-6">
      <StepHeader
        eyebrow="Patient Details"
        title="Tell us about the patient and care required"
      />
      <FloatField label="Patient Name" error={form.formState.errors.patient_name?.message}>
        <input {...form.register("patient_name")} className={inputCls} placeholder="Full name" />
      </FloatField>
      <div className="grid gap-4 md:grid-cols-2">
        <FloatField label="Age">
          <input
            type="number"
            {...form.register("patient_age")}
            className={inputCls}
            placeholder="e.g. 68"
          />
        </FloatField>
        <FloatField label="Gender">
          <select {...form.register("patient_gender")} className={inputCls}>
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </FloatField>
      </div>
      <FloatField label="Service / Care Required">
        <textarea
          {...form.register("care_required")}
          rows={3}
          className={inputCls}
          placeholder={careHint}
        />
      </FloatField>
      <FloatField label="Additional Information / Special Requirements">
        <textarea
          {...form.register("message")}
          rows={2}
          className={inputCls}
          placeholder="Any other details — medical conditions, preferences, timings…"
        />
      </FloatField>
    </div>
  );
}

/* ─────────────── Step 4: Contact & Address ─────────────── */

function ContactStep({ form }: { form: UseFormReturn<Values> }) {
  return (
    <div className="grid gap-6">
      <StepHeader eyebrow="Contact & Address" title="How can we reach you?" />
      <div className="grid gap-4 md:grid-cols-2">
        <FloatField label="Phone Number *" error={form.formState.errors.contact_phone?.message}>
          <input
            {...form.register("contact_phone")}
            className={inputCls}
            placeholder="+91 98765 43210"
          />
        </FloatField>
        <FloatField label="WhatsApp Number (Optional)">
          <input
            {...form.register("whatsapp_number")}
            className={inputCls}
            placeholder="+91 98765 43210"
          />
        </FloatField>
      </div>
      <FloatField label="Email (Optional)">
        <input
          {...form.register("contact_email")}
          className={inputCls}
          placeholder="you@example.com"
        />
      </FloatField>
      <FloatField label="Full Address *" error={form.formState.errors.address?.message}>
        <textarea
          {...form.register("address")}
          rows={2}
          className={inputCls}
          placeholder="House / street / area"
        />
      </FloatField>
      <div className="grid gap-4 md:grid-cols-2">
        <FloatField label="City">
          <input
            {...form.register("city")}
            className={inputCls}
            readOnly
          />
        </FloatField>
        <FloatField label="Pincode">
          <input {...form.register("pincode")} className={inputCls} placeholder="e.g. 121001" />
        </FloatField>
      </div>
    </div>
  );
}

/* ─────────────── Pieces ─────────────── */

function StepHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-[0.22em] text-accent font-semibold">
        {eyebrow}
      </div>
      <h3 className="mt-2 font-display text-2xl md:text-3xl tracking-[-0.03em]">{title}</h3>
      {description && <p className="mt-2 text-sm text-muted-foreground max-w-md">{description}</p>}
    </div>
  );
}

const inputCls =
  "peer w-full rounded-2xl border border-border bg-white/70 backdrop-blur px-4 py-3.5 text-sm outline-none transition placeholder:text-muted-foreground/70 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/15";

function FloatField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </span>
      <div className="mt-1.5">{children}</div>
      {error && <span className="mt-1 block text-xs text-destructive">{error}</span>}
    </label>
  );
}

function SuccessState({ onReset }: { onReset: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-[2rem] border border-border bg-surface p-10 text-center shadow-[var(--shadow-float)]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full blur-3xl opacity-50"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--primary) 55%, transparent), transparent 65%)",
        }}
      />
      <motion.div
        initial={{ scale: 0, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.15, type: "spring", stiffness: 200, damping: 15 }}
        className="relative mx-auto grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-primary to-accent text-white"
      >
        <CheckCircle2 className="h-8 w-8" />
      </motion.div>
      <h3 className="relative mt-6 font-display text-3xl tracking-[-0.03em]">
        Request Received Successfully
      </h3>
      <p className="relative mt-3 text-muted-foreground max-w-md mx-auto">
        Our care team will review your requirement and contact you for confirmation.
      </p>

      <div className="relative mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-sm font-medium text-foreground">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-primary" />
          Verified & Trained Staff
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" />
          Confirmation within 2 Hours
        </div>
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-primary" />
          Transparent Pricing
        </div>
      </div>

      <button
        onClick={onReset}
        className="relative mt-8 inline-flex items-center rounded-full border border-border bg-surface px-6 py-3 text-sm font-medium hover:border-primary transition-colors"
      >
        Book another
      </button>
    </motion.div>
  );
}
