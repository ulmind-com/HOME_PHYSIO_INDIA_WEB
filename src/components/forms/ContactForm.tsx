import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import { toast } from "sonner";
import { CheckCircle2, Loader2, ChevronDown } from "lucide-react";

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(120),
  phone: z.string().trim().min(5, "Please enter your phone number").max(20),
  email: z.string().trim().email("Enter a valid email").optional().or(z.literal("").transform(() => undefined)),
  service_required: z.string().trim().max(100).optional().or(z.literal("").transform(() => undefined)),
  patient_location: z.string().trim().max(200).optional().or(z.literal("").transform(() => undefined)),
  message: z.string().trim().min(10, "Tell us a little more").max(2000),
});
type Values = z.infer<typeof schema>;

export function ContactForm() {
  const [done, setDone] = useState(false);
  const form = useForm<Values>({ 
    resolver: zodResolver(schema),
    defaultValues: {
      service_required: "",
    }
  });

  const mut = useMutation({
    mutationFn: (v: Values) => api.post("/contact", v),
    onSuccess: () => {
      setDone(true);
      toast.success("Message sent.");
      form.reset();
    },
    onError: (err: Error) => toast.error(err.message || "Could not send message"),
  });

  if (done) {
    return (
      <div className="rounded-3xl border border-border bg-surface p-10 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-primary" />
        <h3 className="mt-4 font-display text-2xl">Thank you</h3>
        <p className="mt-2 text-muted-foreground">We'll be in touch shortly.</p>
        <button
          onClick={() => setDone(false)}
          className="mt-6 inline-flex items-center rounded-full border border-border px-5 py-2.5 text-sm font-medium"
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit((v) => mut.mutate(v))} className="grid gap-5">
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Name" error={form.formState.errors.name?.message}>
          <input placeholder="Name" {...form.register("name")} className={inputCls} />
        </Field>
        <Field label="Phone Number" error={form.formState.errors.phone?.message}>
          <input placeholder="Phone Number" {...form.register("phone")} className={inputCls} />
        </Field>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Email (optional)" error={form.formState.errors.email?.message}>
          <input
            type="email"
            placeholder="Email (optional)"
            {...form.register("email")}
            className={inputCls}
          />
        </Field>
        <Field label="Patient Location" error={form.formState.errors.patient_location?.message}>
          <input placeholder="Patient Location" {...form.register("patient_location")} className={inputCls} />
        </Field>
      </div>
      <Field label="Service Required" error={form.formState.errors.service_required?.message}>
        <div className="relative">
          <select 
            {...form.register("service_required")} 
            className="w-full rounded-2xl border border-black/10 bg-black/5 px-4 py-3.5 pr-10 text-[14px] outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 backdrop-blur-md appearance-none text-foreground cursor-pointer"
          >
            <option value="" disabled hidden>Service Required</option>
            <option value="Home Nursing Care">Home Nursing Care</option>
            <option value="Elderly Care">Elderly Care</option>
            <option value="Mother & Baby Care">Mother & Baby Care</option>
            <option value="Physiotherapy & Recovery">Physiotherapy & Recovery</option>
            <option value="Medical Equipment Rental">Medical Equipment Rental</option>
            <option value="ICU Setup">ICU Setup</option>
            <option value="Home Sample Collection">Home Sample Collection</option>
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/70 pointer-events-none" />
        </div>
      </Field>
      <Field label="Message / Requirement" error={form.formState.errors.message?.message}>
        <textarea
          rows={4}
          placeholder="Message / Requirement"
          {...form.register("message")}
          className={inputCls}
        />
      </Field>
      <button
        type="submit"
        disabled={mut.isPending}
        className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-[15px] font-semibold text-primary-foreground shadow-[0_4px_14px_var(--color-primary),0.15)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_var(--color-primary),0.25)] hover:bg-accent hover:text-accent-foreground transition-all disabled:opacity-60"
      >
        {mut.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
        Send Enquiry
      </button>
    </form>
  );
}

const inputCls =
  "w-full rounded-2xl border border-black/10 bg-white/80 px-4 py-3.5 text-[14px] outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 backdrop-blur-md";
function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block relative">
      <span className="sr-only">{label}</span>
      <div>{children}</div>
      {error && <span className="mt-1 block text-[13px] text-red-500">{error}</span>}
    </label>
  );
}
