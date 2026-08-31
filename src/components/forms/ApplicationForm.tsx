import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import { toast } from "sonner";
import { CheckCircle2, Loader2, Upload } from "lucide-react";

const schema = z.object({
  full_name: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(7).max(20),
  experience: z
    .string()
    .max(200)
    .optional()
    .or(z.literal("").transform(() => undefined)),
  cover_letter: z
    .string()
    .max(3000)
    .optional()
    .or(z.literal("").transform(() => undefined)),
});
type Values = z.infer<typeof schema>;

export function ApplicationForm({ jobId, jobTitle }: { jobId?: string; jobTitle: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [done, setDone] = useState(false);
  const { user } = useAuth();
  const form = useForm<Values>({ resolver: zodResolver(schema) });

  const mut = useMutation({
    mutationFn: async (v: Values) => {
      const fd = new FormData();
      if (jobId) fd.append("job_id", jobId);
      fd.append("job_title", jobTitle);
      fd.append("full_name", v.full_name);
      if (user?.email) fd.append("email", user.email);
      fd.append("phone", v.phone);
      if (v.experience) fd.append("experience", v.experience);
      if (v.cover_letter) fd.append("cover_letter", v.cover_letter);
      if (file) fd.append("resume", file);
      return api.postForm("/careers/applications", fd);
    },
    onSuccess: () => {
      setDone(true);
      toast.success("Application submitted.");
      form.reset();
      setFile(null);
    },
    onError: (err: Error) => toast.error(err.message || "Submission failed"),
  });

  if (done) {
    return (
      <div className="rounded-3xl border border-border bg-surface p-8 text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-primary" />
        <h3 className="mt-3 font-display text-xl">Application received</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          We'll review and reach out if there's a fit.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit((v) => mut.mutate(v))} className="grid gap-4">
      <Field label="Full name" error={form.formState.errors.full_name?.message}>
        <input {...form.register("full_name")} className={inputCls} />
      </Field>
      <Field label="Phone" error={form.formState.errors.phone?.message}>
        <input {...form.register("phone")} className={inputCls} />
      </Field>
      <Field label="Experience">
        <input
          {...form.register("experience")}
          placeholder="e.g. 3 years in critical care"
          className={inputCls}
        />
      </Field>
      <Field label="Cover letter">
        <textarea rows={4} {...form.register("cover_letter")} className={inputCls} />
      </Field>
      <label className="block">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Resume (PDF, DOC)
        </span>
        <div className="mt-1.5 flex items-center gap-3 rounded-2xl border border-dashed border-border bg-background px-4 py-3 text-sm">
          <Upload className="h-4 w-4 text-muted-foreground" />
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="text-sm"
          />
          {file && <span className="text-muted-foreground truncate">{file.name}</span>}
        </div>
      </label>
      <button
        type="submit"
        disabled={mut.isPending}
        className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3.5 text-sm font-medium text-background hover-glow disabled:opacity-60"
      >
        {mut.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
        Submit application
      </button>
    </form>
  );
}

const inputCls =
  "w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";
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
      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <div className="mt-1.5">{children}</div>
      {error && <span className="mt-1 block text-xs text-destructive">{error}</span>}
    </label>
  );
}
