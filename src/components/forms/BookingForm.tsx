import { useState } from "react";
import { useForm, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, ChevronLeft, ChevronRight, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api/client";
import { servicesQ } from "@/lib/api/queries";
import { cn } from "@/lib/utils";

const emptyToUndef = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess((v) => (v === "" || v === null ? undefined : v), schema);

const schema = z.object({
  service_name: z.string().trim().min(2, "Please choose a service"),
  service_id: emptyToUndef(z.string().optional()),
  care_type: emptyToUndef(z.enum(["home_visit", "consultation", "equipment"]).optional()),
  preferred_date: z.string().min(1, "Pick a date"),
  preferred_time: emptyToUndef(z.string().optional()),
  patient_name: z.string().trim().min(2, "Enter patient name").max(120),
  patient_age: emptyToUndef(z.coerce.number().int().min(0).max(120).optional()),
  patient_gender: emptyToUndef(z.enum(["male", "female", "other"]).optional()),
  message: emptyToUndef(z.string().max(1000).optional()),
  contact_phone: z.string().trim().min(7, "Enter a valid phone").max(20),
  contact_email: emptyToUndef(z.string().trim().email("Enter a valid email").optional()),
  address: z.string().trim().min(5, "Enter the full address").max(500),
  city: emptyToUndef(z.string().optional()),
  pincode: emptyToUndef(z.string().optional()),
});
type Values = z.infer<typeof schema>;

const STEPS = [
  { key: "service", label: "Service", fields: ["service_name", "care_type"] as const },
  { key: "schedule", label: "Schedule", fields: ["preferred_date", "preferred_time"] as const },
  {
    key: "patient",
    label: "Patient",
    fields: ["patient_name", "patient_age", "patient_gender", "message"] as const,
  },
  {
    key: "contact",
    label: "Contact",
    fields: ["contact_phone", "contact_email", "address", "city", "pincode"] as const,
  },
];

export function BookingForm({ presetServiceSlug }: { presetServiceSlug?: string } = {}) {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const { data: services } = useQuery(servicesQ({ limit: 100 }));
  const options = services?.items ?? [];
  const preset = presetServiceSlug ? options.find((s) => s.slug === presetServiceSlug) : undefined;

  const form = useForm<Values>({
    resolver: zodResolver(schema) as never,
    mode: "onBlur",
    defaultValues: {
      service_name: preset?.title ?? "",
      service_id: preset?.id ?? "",
      care_type: "home_visit",
    },
  });

  const mut = useMutation({
    mutationFn: (data: Values) => api.post("/bookings", data),
    onSuccess: () => {
      setDone(true);
      toast.success("Booking received — we'll call you shortly.");
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
            key={STEPS[step].key}
            initial={{ opacity: 0, x: 30, filter: "blur(6px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, x: -30, filter: "blur(6px)" }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {step === 0 && <ServiceStep form={form} options={options} />}
            {step === 1 && <ScheduleStep form={form} />}
            {step === 2 && <PatientStep form={form} />}
            {step === 3 && <ContactStep form={form} />}
          </motion.div>
        </AnimatePresence>

        {/* Nav */}
        <div className="mt-10 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={back}
            disabled={step === 0}
            className="inline-flex items-center gap-1 rounded-full border border-border bg-surface px-5 py-3 text-sm font-medium disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" /> Back
          </button>
          <button
            type="submit"
            disabled={mut.isPending}
            className="group inline-flex items-center gap-2 rounded-full bg-foreground px-7 py-3.5 text-sm font-semibold text-background shadow-[var(--shadow-soft)] hover:bg-accent transition-colors disabled:opacity-60"
          >
            {mut.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            {step === STEPS.length - 1 ? "Confirm booking" : "Continue"}
            {!mut.isPending && (
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

/* --------------------------------- Steps --------------------------------- */

function ServiceStep({
  form,
  options,
}: {
  form: UseFormReturn<Values>;
  options: { id: string; title: string; slug: string; short_description?: string | null }[];
}) {
  const selected = form.watch("service_name");
  const care = form.watch("care_type");
  return (
    <div className="grid gap-6">
      <StepHeader
        eyebrow="Care you need"
        title="Which service brings you here?"
        description="Pick a service — you can add details in the next steps."
      />
      <input type="hidden" {...form.register("service_id")} />
      <div className="grid gap-3 md:grid-cols-2">
        {options.slice(0, 8).map((s) => {
          const active = selected === s.title;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => {
                form.setValue("service_name", s.title, { shouldValidate: true });
                form.setValue("service_id", s.id);
              }}
              className={cn(
                "text-left rounded-2xl border p-4 transition-all",
                active
                  ? "border-primary bg-primary/5 shadow-[var(--shadow-soft)]"
                  : "border-border bg-surface hover:border-primary/50 hover:-translate-y-0.5",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold text-sm">{s.title}</div>
                  {s.short_description && (
                    <div className="mt-1 text-xs text-muted-foreground line-clamp-2">
                      {s.short_description}
                    </div>
                  )}
                </div>
                <div
                  className={cn(
                    "grid h-5 w-5 shrink-0 place-items-center rounded-full border",
                    active ? "border-primary bg-primary" : "border-border",
                  )}
                >
                  {active && <CheckCircle2 className="h-4 w-4 text-primary-foreground" />}
                </div>
              </div>
            </button>
          );
        })}
      </div>
      {form.formState.errors.service_name && (
        <p className="text-xs text-destructive">{form.formState.errors.service_name.message}</p>
      )}

      <div className="mt-2">
        <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-3">
          Care type
        </div>
        <div className="grid gap-2 sm:grid-cols-3">
          {[
            { v: "home_visit", label: "Home visit" },
            { v: "consultation", label: "Consultation" },
            { v: "equipment", label: "Equipment rental" },
          ].map((o) => {
            const active = care === o.v;
            return (
              <button
                key={o.v}
                type="button"
                onClick={() => form.setValue("care_type", o.v as Values["care_type"])}
                className={cn(
                  "rounded-full border px-4 py-2.5 text-sm font-medium transition-all",
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-surface hover:border-primary/50",
                )}
              >
                {o.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ScheduleStep({ form }: { form: UseFormReturn<Values> }) {
  return (
    <div className="grid gap-6">
      <StepHeader
        eyebrow="When"
        title="When should we arrive?"
        description="Pick your preferred date and time — final slot is confirmed on the call."
      />
      <div className="grid gap-4 md:grid-cols-2">
        <FloatField label="Preferred date" error={form.formState.errors.preferred_date?.message}>
          <input type="date" {...form.register("preferred_date")} className={inputCls} />
        </FloatField>
        <FloatField label="Preferred time">
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

function PatientStep({ form }: { form: UseFormReturn<Values> }) {
  return (
    <div className="grid gap-6">
      <StepHeader eyebrow="Patient" title="Who are we caring for?" />
      <FloatField label="Patient name" error={form.formState.errors.patient_name?.message}>
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
      <FloatField label="Anything we should know?">
        <textarea
          {...form.register("message")}
          rows={3}
          className={inputCls}
          placeholder="Conditions, preferences, timings..."
        />
      </FloatField>
    </div>
  );
}

function ContactStep({ form }: { form: UseFormReturn<Values> }) {
  return (
    <div className="grid gap-6">
      <StepHeader eyebrow="Contact" title="Where should we reach you?" />
      <div className="grid gap-4 md:grid-cols-2">
        <FloatField label="Phone" error={form.formState.errors.contact_phone?.message}>
          <input
            {...form.register("contact_phone")}
            className={inputCls}
            placeholder="+91 98765 43210"
          />
        </FloatField>
        <FloatField label="Email">
          <input
            {...form.register("contact_email")}
            className={inputCls}
            placeholder="you@example.com"
          />
        </FloatField>
      </div>
      <FloatField label="Address" error={form.formState.errors.address?.message}>
        <textarea
          {...form.register("address")}
          rows={2}
          className={inputCls}
          placeholder="House / street / area"
        />
      </FloatField>
      <div className="grid gap-4 md:grid-cols-2">
        <FloatField label="City">
          <input {...form.register("city")} className={inputCls} />
        </FloatField>
        <FloatField label="Pincode">
          <input {...form.register("pincode")} className={inputCls} />
        </FloatField>
      </div>
    </div>
  );
}

/* -------------------------------- Pieces --------------------------------- */

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
      <h3 className="relative mt-6 font-display text-3xl tracking-[-0.03em]">Booking received</h3>
      <p className="relative mt-3 text-muted-foreground max-w-md mx-auto">
        A care advisor will call you within <b className="text-foreground">2 hours</b> to confirm
        your slot and match a verified caregiver.
      </p>
      <button
        onClick={onReset}
        className="relative mt-8 inline-flex items-center rounded-full border border-border bg-surface px-6 py-3 text-sm font-medium hover:border-primary"
      >
        Book another
      </button>
    </motion.div>
  );
}
