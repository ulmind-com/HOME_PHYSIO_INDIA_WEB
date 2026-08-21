import { useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Check, ChevronDown, Loader2, Send } from "lucide-react";
import { api } from "@/lib/api/client";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";

export const DEFAULT_REQUIREMENT_OPTIONS = [
  "Infection Control Training",
  "Infection Prevention & Control Support",
  "Healthcare Staff Training",
  "Infection Control Audit",
  "Home Healthcare Infection Prevention",
  "Student / Professional Enquiry",
  "Other",
];

const DEFAULT_HEADING = "Have an Infection Control Enquiry?";
const DEFAULT_SUBHEADING =
  "Tell us about your requirement and our team will contact you to discuss the appropriate Infection Prevention & Control support.";

const enquiryFormSchema = z.object({
  full_name: z.string().min(2, "Enter your full name"),
  phone_number: z.string().min(7, "Enter a valid phone number"),
  email: z.string().email("Enter a valid email").optional().or(z.literal("")),
  requirement_type: z.string().min(1, "Select your requirement"),
  message: z.string().optional(),
});
type EnquiryFormValues = z.infer<typeof enquiryFormSchema>;

export function InfectionEnquiryForm({
  requirementOptions = DEFAULT_REQUIREMENT_OPTIONS,
}: {
  requirementOptions?: string[];
}) {
  const [done, setDone] = useState(false);
  const form = useForm<EnquiryFormValues>({
    resolver: zodResolver(enquiryFormSchema),
    defaultValues: {
      full_name: "",
      phone_number: "",
      email: "",
      requirement_type: "",
      message: "",
    },
  });

  const mut = useMutation({
    mutationFn: (data: EnquiryFormValues) => api.post("/infection-control/enquiry", data),
    onSuccess: () => {
      setDone(true);
      toast.success("Enquiry submitted — our team will contact you shortly.");
    },
    onError: (err: Error) => toast.error(err.message || "Something went wrong."),
  });

  return (
    <div className="rounded-2xl border border-border bg-white p-6 md:p-8 shadow-sm">
      {done ? (
        <div className="text-center py-6">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-primary/10 mx-auto mb-4">
            <Check className="h-8 w-8 text-primary" />
          </div>
          <h3 className="font-display text-2xl mb-2">Thank You!</h3>
          <p className="text-muted-foreground mb-6">
            Our team will contact you shortly regarding your enquiry.
          </p>
          <button
            onClick={() => {
              setDone(false);
              form.reset();
            }}
            className="rounded-full border border-border bg-white px-6 py-2.5 text-sm font-medium hover:border-primary transition-colors"
          >
            Submit Another Enquiry
          </button>
        </div>
      ) : (
        <form onSubmit={form.handleSubmit((v) => mut.mutate(v))} className="space-y-4">
          <div>
            <input
              {...form.register("full_name")}
              placeholder="Full Name"
              className="w-full rounded-full border border-border bg-transparent px-5 py-3.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15 placeholder:text-muted-foreground"
            />
            {form.formState.errors.full_name && (
              <p className="text-xs text-destructive mt-1">
                {form.formState.errors.full_name.message}
              </p>
            )}
          </div>

          <div>
            <input
              {...form.register("phone_number")}
              placeholder="Phone Number"
              className="w-full rounded-full border border-border bg-transparent px-5 py-3.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15 placeholder:text-muted-foreground"
            />
            {form.formState.errors.phone_number && (
              <p className="text-xs text-destructive mt-1">
                {form.formState.errors.phone_number.message}
              </p>
            )}
          </div>

          <div>
            <input
              {...form.register("email")}
              placeholder="Email Address"
              type="email"
              className="w-full rounded-full border border-border bg-transparent px-5 py-3.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15 placeholder:text-muted-foreground"
            />
            {form.formState.errors.email && (
              <p className="text-xs text-destructive mt-1">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          <div>
            <div className="relative">
              <select
                {...form.register("requirement_type")}
                className="w-full rounded-full border border-border bg-black/5 px-5 py-3.5 pr-10 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15 text-foreground appearance-none cursor-pointer"
              >
                <option value="">Select Your Requirement</option>
                {requirementOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
            {form.formState.errors.requirement_type && (
              <p className="text-xs text-destructive mt-1">
                {form.formState.errors.requirement_type.message}
              </p>
            )}
          </div>

          <div>
            <textarea
              {...form.register("message")}
              placeholder="Message / Requirement (optional)"
              rows={3}
              className="w-full rounded-2xl border border-border bg-transparent px-5 py-3.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15 placeholder:text-muted-foreground resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={mut.isPending}
            className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-3.5 text-sm font-semibold text-white hover:bg-primary transition-colors disabled:opacity-60 mt-2"
          >
            {mut.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            <Send className="h-4 w-4" />
            Submit Enquiry
          </button>
        </form>
      )}
    </div>
  );
}

export function InfectionEnquiryModal({
  children,
  heading,
  subheading,
  requirementOptions = DEFAULT_REQUIREMENT_OPTIONS,
  onOpenChange,
}: {
  children: ReactNode;
  heading?: string;
  subheading?: string;
  requirementOptions?: string[];
  onOpenChange?: (open: boolean) => void;
}) {
  return (
    <Dialog onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="mb-4 pr-6">
          <DialogTitle className="font-display text-2xl md:text-3xl tracking-tight text-foreground">
            {heading || DEFAULT_HEADING}
          </DialogTitle>
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed mt-2">
            {subheading || DEFAULT_SUBHEADING}
          </p>
        </div>
        <InfectionEnquiryForm requirementOptions={requirementOptions} />
      </DialogContent>
    </Dialog>
  );
}
