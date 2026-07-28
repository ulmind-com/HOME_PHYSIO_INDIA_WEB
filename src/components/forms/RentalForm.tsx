import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import { toast } from "sonner";
import { CheckCircle2, Loader2 } from "lucide-react";

const schema = z.object({
  customer_name: z.string().trim().min(2).max(120),
  customer_phone: z.string().trim().min(7).max(20),
  customer_email: z.string().trim().email().optional().or(z.literal("").transform(() => undefined)),
  address: z.string().trim().min(5).max(500),
  start_date: z.string().min(1, "Pick a date"),
  end_date: z.string().optional().or(z.literal("").transform(() => undefined)),
  quantity: z.coerce.number().int().min(1).max(20).default(1),
});
type Values = z.infer<typeof schema>;

export function RentalForm({ equipmentId }: { equipmentId: string }) {
  const [done, setDone] = useState(false);
  const form = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { quantity: 1 } });

  const mut = useMutation({
    mutationFn: (v: Values) => api.post("/equipment/rentals", { equipment_id: equipmentId, ...v }),
    onSuccess: () => { setDone(true); toast.success("Rental request received."); form.reset(); },
    onError: (err: Error) => toast.error(err.message || "Request failed"),
  });

  if (done) {
    return (
      <div className="rounded-3xl border border-border bg-surface p-8 text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-primary" />
        <h3 className="mt-3 font-display text-xl">Request received</h3>
        <p className="mt-1 text-sm text-muted-foreground">Our team will confirm availability and delivery.</p>
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit((v) => mut.mutate(v))} className="grid gap-4">
      <Field label="Full name" error={form.formState.errors.customer_name?.message}>
        <input {...form.register("customer_name")} className={inputCls} />
      </Field>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Phone" error={form.formState.errors.customer_phone?.message}>
          <input {...form.register("customer_phone")} className={inputCls} />
        </Field>
        <Field label="Email">
          <input {...form.register("customer_email")} className={inputCls} />
        </Field>
      </div>
      <Field label="Delivery address" error={form.formState.errors.address?.message}>
        <textarea rows={2} {...form.register("address")} className={inputCls} />
      </Field>
      <div className="grid gap-4 md:grid-cols-3">
        <Field label="Start date" error={form.formState.errors.start_date?.message}>
          <input type="date" {...form.register("start_date")} className={inputCls} />
        </Field>
        <Field label="End date">
          <input type="date" {...form.register("end_date")} className={inputCls} />
        </Field>
        <Field label="Quantity">
          <input type="number" min={1} {...form.register("quantity")} className={inputCls} />
        </Field>
      </div>
      <button
        type="submit"
        disabled={mut.isPending}
        className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3.5 text-sm font-medium text-background hover-glow disabled:opacity-60"
      >
        {mut.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
        Request rental
      </button>
    </form>
  );
}

const inputCls = "w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";
function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
      <div className="mt-1.5">{children}</div>
      {error && <span className="mt-1 block text-xs text-destructive">{error}</span>}
    </label>
  );
}
