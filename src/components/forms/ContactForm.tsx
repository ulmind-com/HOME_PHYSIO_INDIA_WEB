import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import { toast } from "sonner";
import { CheckCircle2, Loader2 } from "lucide-react";

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(120),
  company: z
    .string()
    .trim()
    .max(120)
    .optional()
    .or(z.literal("").transform(() => undefined)),
  email: z.string().trim().email("Enter a valid email"),
  phone: z
    .string()
    .trim()
    .max(20)
    .optional()
    .or(z.literal("").transform(() => undefined)),
  subject: z
    .string()
    .trim()
    .max(200)
    .optional()
    .or(z.literal("").transform(() => undefined)),
  message: z.string().trim().min(10, "Tell us a little more").max(2000),
});
type Values = z.infer<typeof schema>;

export function ContactForm() {
  const [done, setDone] = useState(false);
  const form = useForm<Values>({ resolver: zodResolver(schema) });

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
        <Field label="Company" error={form.formState.errors.company?.message}>
          <input placeholder="Company" {...form.register("company")} className={inputCls} />
        </Field>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Phone">
          <input placeholder="Phone" {...form.register("phone")} className={inputCls} />
        </Field>
        <Field label="Email" error={form.formState.errors.email?.message}>
          <input
            type="email"
            placeholder="Email"
            {...form.register("email")}
            className={inputCls}
          />
        </Field>
      </div>
      <Field label="Subject">
        <input placeholder="Subject" {...form.register("subject")} className={inputCls} />
      </Field>
      <Field label="Message" error={form.formState.errors.message?.message}>
        <textarea
          rows={4}
          placeholder="Message"
          {...form.register("message")}
          className={inputCls}
        />
      </Field>
      <button
        type="submit"
        disabled={mut.isPending}
        className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-[15px] font-semibold text-primary-foreground shadow-[0_4px_14px_rgba(0,123,255,0.15)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(0,123,255,0.25)] hover:bg-accent hover:text-accent-foreground transition-all disabled:opacity-60"
      >
        {mut.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
        Send
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
    <label className="block">
      <span className="text-[14px] font-medium text-foreground">{label}</span>
      <div className="mt-1.5">{children}</div>
      {error && <span className="mt-1 block text-[13px] text-red-500">{error}</span>}
    </label>
  );
}
