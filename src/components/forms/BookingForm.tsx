import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import { servicesQ } from "@/lib/api/queries";
import { toast } from "sonner";
import { CheckCircle2, Loader2 } from "lucide-react";

const emptyToUndef = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess((v) => (v === "" || v === null ? undefined : v), schema);

const schema = z.object({
  patient_name: z.string().trim().min(2, "Please enter the patient's name").max(120),
  patient_age: emptyToUndef(z.coerce.number().int().min(0).max(120).optional()),
  patient_gender: emptyToUndef(z.enum(["male", "female", "other"]).optional()),
  contact_phone: z.string().trim().min(7, "Enter a valid phone").max(20),
  contact_email: emptyToUndef(z.string().trim().email("Enter a valid email").optional()),
  service_name: z.string().trim().min(2, "Please choose a service"),
  service_id: emptyToUndef(z.string().optional()),
  preferred_date: z.string().min(1, "Pick a date"),
  preferred_time: emptyToUndef(z.string().optional()),
  address: z.string().trim().min(5, "Enter the full address").max(500),
  city: emptyToUndef(z.string().optional()),
  pincode: emptyToUndef(z.string().optional()),
  message: emptyToUndef(z.string().max(1000).optional()),
});
type Values = z.infer<typeof schema>;

export function BookingForm({ presetServiceSlug }: { presetServiceSlug?: string } = {}) {
  const [done, setDone] = useState(false);
  const { data: services } = useQuery(servicesQ({ limit: 100 }));
  const options = services?.items ?? [];
  const preset = presetServiceSlug ? options.find((s) => s.slug === presetServiceSlug) : undefined;

  const form = useForm<Values>({
    resolver: zodResolver(schema) as never,
    defaultValues: {
      service_name: preset?.title ?? "",
      service_id: preset?.id ?? "",
    },
  });

  const mut = useMutation({
    mutationFn: (data: Values) => api.post("/bookings", data),
    onSuccess: () => {
      setDone(true);
      toast.success("Booking received — we'll call you shortly.");
      form.reset();
    },
    onError: (err: Error) => {
      toast.error(err.message || "Something went wrong. Please try again.");
    },
  });

  if (done) {
    return (
      <div className="rounded-3xl border border-border bg-surface p-10 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-primary" />
        <h3 className="mt-4 font-display text-2xl">Request received</h3>
        <p className="mt-2 text-muted-foreground max-w-md mx-auto">
          A care advisor will call you within 2 hours to confirm your booking.
        </p>
        <button
          onClick={() => setDone(false)}
          className="mt-6 inline-flex items-center rounded-full border border-border px-5 py-2.5 text-sm font-medium"
        >
          Book another
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={form.handleSubmit((v) => mut.mutate(v))}
      className="grid gap-5 rounded-3xl border border-border bg-surface p-6 md:p-8"
    >
      <Field label="Patient name" error={form.formState.errors.patient_name?.message}>
        <input {...form.register("patient_name")} className={inputCls} placeholder="Full name" />
      </Field>
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Age" error={form.formState.errors.patient_age?.message as string}>
          <input type="number" {...form.register("patient_age")} className={inputCls} placeholder="e.g. 68" />
        </Field>
        <Field label="Gender">
          <select {...form.register("patient_gender")} className={inputCls}>
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </Field>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Phone" error={form.formState.errors.contact_phone?.message}>
          <input {...form.register("contact_phone")} className={inputCls} placeholder="+91 98765 43210" />
        </Field>
        <Field label="Email" error={form.formState.errors.contact_email?.message as string}>
          <input {...form.register("contact_email")} className={inputCls} placeholder="you@example.com" />
        </Field>
      </div>
      <Field label="Service" error={form.formState.errors.service_name?.message}>
        <select
          {...form.register("service_name", {
            onChange: (e) => {
              const opt = options.find((s) => s.title === e.target.value);
              form.setValue("service_id", opt?.id ?? "");
            },
          })}
          className={inputCls}
        >
          <option value="">Choose a service</option>
          {options.map((s) => (
            <option key={s.id} value={s.title}>{s.title}</option>
          ))}
        </select>
      </Field>
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Preferred date" error={form.formState.errors.preferred_date?.message}>
          <input type="date" {...form.register("preferred_date")} className={inputCls} />
        </Field>
        <Field label="Preferred time">
          <input type="time" {...form.register("preferred_time")} className={inputCls} />
        </Field>
      </div>
      <Field label="Address" error={form.formState.errors.address?.message}>
        <textarea {...form.register("address")} rows={2} className={inputCls} placeholder="House / street / area" />
      </Field>
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="City">
          <input {...form.register("city")} className={inputCls} />
        </Field>
        <Field label="Pincode">
          <input {...form.register("pincode")} className={inputCls} />
        </Field>
      </div>
      <Field label="Anything we should know?">
        <textarea {...form.register("message")} rows={3} className={inputCls} placeholder="Conditions, preferences, timings..." />
      </Field>
      <button
        type="submit"
        disabled={mut.isPending}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3.5 text-sm font-medium text-background hover-glow disabled:opacity-60"
      >
        {mut.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
        Request booking
      </button>
      <p className="text-xs text-muted-foreground">
        By submitting, you agree to our terms and privacy policy. We only use your details to arrange care.
      </p>
    </form>
  );
}

const inputCls =
  "w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
      <div className="mt-1.5">{children}</div>
      {error && <span className="mt-1 block text-xs text-destructive">{error}</span>}
    </label>
  );
}
