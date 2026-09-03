/**
 * The five-step home-visit booking flow.
 *
 * Pricing is never computed here — every change to the priced fields refetches
 * `/therapy-bookings/quote` so the number the patient sees is the number the
 * server will charge. All the priced endpoints are auth-gated, so the wizard
 * asks for sign-in before step 1 rather than failing mid-flow.
 */
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import { openAuthDialog } from "@/lib/auth-dialog";
import { equipmentIcon } from "@/lib/placeholders";
import {
  DAILY_FREQUENCY,
  MASSAGE_OPTIONS,
  MODALITIES,
  PACKAGES,
  SERVICES,
  SHIFTS,
  WEEKLY_DAYS,
} from "@/lib/plan";
import {
  createBooking,
  formatINR,
  getQuote,
  timeSlotsQ,
  verifyPayment,
  type EquipmentCode,
  type FrequencyType,
  type Gender,
  type MassageType,
  type PackageDuration,
  type PricingQuote,
  type ServiceCategory,
  type Shift,
  type TherapyBookingCreate,
} from "@/lib/api/therapy";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { loadRazorpay } from "@/lib/razorpay";

const STEPS = ["Service", "Care plan", "Schedule", "Your details", "Review"] as const;

type Draft = {
  service_category: ServiceCategory;
  frequency_type?: FrequencyType;
  daily_visits_per_day?: number;
  weekly_days_count?: number;
  package_duration?: PackageDuration;
  package_custom_months?: number;
  equipment: EquipmentCode[];
  massage_type?: MassageType;
  massage_duration_minutes?: number;
  preferred_date: string;
  shift?: Shift;
  time_slot?: string;
  session_duration_minutes: number;
  patient_name: string;
  patient_age?: string;
  patient_gender?: Gender;
  contact_phone: string;
  contact_email: string;
  address: string;
  city: string;
  pincode: string;
  condition_notes: string;
};

const todayISO = () => new Date().toISOString().slice(0, 10);

const emptyDraft = (category: ServiceCategory): Draft => ({
  service_category: category,
  frequency_type: category === "massage_therapy" ? undefined : "daily",
  daily_visits_per_day: category === "massage_therapy" ? undefined : 1,
  equipment: [],
  massage_type: category === "massage_therapy" ? "normal_oil" : undefined,
  massage_duration_minutes: category === "massage_therapy" ? 50 : undefined,
  preferred_date: todayISO(),
  session_duration_minutes: 45,
  patient_name: "",
  contact_phone: "",
  contact_email: "",
  address: "",
  city: "",
  pincode: "",
  condition_notes: "",
});

export function BookingWizard({
  initialCategory = "physiotherapy",
}: {
  initialCategory?: ServiceCategory;
}) {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<Draft>(() => emptyDraft(initialCategory));
  const [quote, setQuote] = useState<PricingQuote | null>(null);
  const [quoteError, setQuoteError] = useState<string | null>(null);

  const isMassage = draft.service_category === "massage_therapy";
  const set = <K extends keyof Draft>(key: K, value: Draft[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  // Prefill from the signed-in profile — patients shouldn't retype what the
  // admin panel already holds about them.
  useEffect(() => {
    if (!user) return;
    setDraft((d) => ({
      ...d,
      patient_name: d.patient_name || user.name || "",
      contact_phone: d.contact_phone || user.phone || "",
      contact_email: d.contact_email || user.email || "",
      address: d.address || user.address || "",
      pincode: d.pincode || user.pincode || "",
      patient_age: d.patient_age ?? (user.age ? String(user.age) : undefined),
      patient_gender: d.patient_gender ?? ((user.gender as Gender) || undefined),
      condition_notes: d.condition_notes || user.medical_condition || "",
    }));
  }, [user]);

  const slots = useQuery(timeSlotsQ(isAuthenticated ? draft.shift : undefined));

  // Live price preview — refetched whenever a priced field changes.
  const quoteKey = JSON.stringify({
    c: draft.service_category,
    f: draft.frequency_type,
    d: draft.daily_visits_per_day,
    e: [...draft.equipment].sort(),
    m: draft.massage_type,
    md: draft.massage_duration_minutes,
  });

  useEffect(() => {
    if (!isAuthenticated) return;
    let active = true;
    setQuoteError(null);
    getQuote({
      service_category: draft.service_category,
      frequency_type: isMassage ? undefined : draft.frequency_type,
      daily_visits_per_day:
        !isMassage && draft.frequency_type === "daily"
          ? draft.daily_visits_per_day
          : undefined,
      equipment: isMassage ? [] : draft.equipment,
      massage_type: isMassage ? draft.massage_type : undefined,
      massage_duration_minutes: isMassage
        ? draft.massage_duration_minutes
        : undefined,
    })
      .then((q) => active && setQuote(q))
      .catch((e: Error) => {
        if (active) {
          setQuote(null);
          setQuoteError(e.message);
        }
      });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quoteKey, isAuthenticated]);

  const payload = useMemo<TherapyBookingCreate | null>(() => {
    if (!draft.shift || !draft.time_slot) return null;
    const base: TherapyBookingCreate = {
      patient_name: draft.patient_name.trim(),
      patient_age: draft.patient_age ? Number(draft.patient_age) : undefined,
      patient_gender: draft.patient_gender,
      contact_phone: draft.contact_phone.trim(),
      contact_email: draft.contact_email.trim() || undefined,
      address: draft.address.trim(),
      city: draft.city.trim() || undefined,
      pincode: draft.pincode.trim() || undefined,
      service_category: draft.service_category,
      condition_notes: draft.condition_notes.trim() || undefined,
      preferred_date: draft.preferred_date,
      shift: draft.shift,
      time_slot: draft.time_slot,
      session_duration_minutes: draft.session_duration_minutes,
    };
    if (isMassage) {
      return {
        ...base,
        massage_type: draft.massage_type,
        massage_duration_minutes: draft.massage_duration_minutes,
      };
    }
    return {
      ...base,
      frequency_type: draft.frequency_type,
      daily_visits_per_day:
        draft.frequency_type === "daily" ? draft.daily_visits_per_day : undefined,
      weekly_days_count:
        draft.frequency_type === "weekly" ? draft.weekly_days_count : undefined,
      package_duration:
        draft.frequency_type === "package" ? draft.package_duration : undefined,
      package_custom_months:
        draft.frequency_type === "package" && draft.package_duration === "custom"
          ? draft.package_custom_months
          : undefined,
      equipment: draft.equipment,
    };
  }, [draft, isMassage]);

  const booking = useMutation({
    mutationFn: async () => {
      if (!payload) throw new Error("Please complete every step first");
      const init = await createBooking(payload);
      const Razorpay = await loadRazorpay();
      if (!Razorpay) {
        // Payment SDK unavailable — the booking exists and stays payable from
        // the dashboard rather than being silently lost.
        return { init, paid: false as const };
      }
      const verified = await new Promise<boolean>((resolve) => {
        const rz = new Razorpay({
          key: init.razorpay_key_id,
          amount: init.amount,
          currency: init.currency || "INR",
          name: "Home Physio India",
          description: `Booking ${init.booking.reference}`,
          order_id: init.razorpay_order_id,
          prefill: {
            name: draft.patient_name,
            email: draft.contact_email,
            contact: draft.contact_phone,
          },
          theme: { color: "#07646d" },
          modal: { ondismiss: () => resolve(false) },
          handler: async (res: {
            razorpay_order_id: string;
            razorpay_payment_id: string;
            razorpay_signature: string;
          }) => {
            try {
              await verifyPayment(init.booking.id, res);
              resolve(true);
            } catch (err) {
              toast.error((err as Error).message || "Payment verification failed");
              resolve(false);
            }
          },
        });
        rz.open();
      });
      return { init, paid: verified };
    },
    onSuccess: ({ init, paid }) => {
      queryClient.invalidateQueries({ queryKey: ["therapy", "my-bookings"] });
      toast[paid ? "success" : "info"](
        paid
          ? `Booking ${init.booking.reference} confirmed`
          : `Booking ${init.booking.reference} created — payment pending`,
      );
      navigate({ to: "/user/dashboard" });
    },
    onError: (e: Error) => toast.error(e.message || "Could not create the booking"),
  });

  /* ---------------- validation per step ---------------- */
  const stepValid = (index: number): boolean => {
    switch (index) {
      case 0:
        return Boolean(draft.service_category);
      case 1:
        if (isMassage)
          return Boolean(draft.massage_type && draft.massage_duration_minutes);
        if (draft.frequency_type === "daily") return Boolean(draft.daily_visits_per_day);
        if (draft.frequency_type === "weekly") return Boolean(draft.weekly_days_count);
        if (draft.frequency_type === "package")
          return (
            Boolean(draft.package_duration) &&
            (draft.package_duration !== "custom" ||
              Boolean(draft.package_custom_months))
          );
        return false;
      case 2:
        return Boolean(draft.preferred_date && draft.shift && draft.time_slot);
      case 3:
        return (
          draft.patient_name.trim().length >= 2 &&
          draft.contact_phone.trim().length >= 6 &&
          draft.address.trim().length >= 3 &&
          (!isMassage || Boolean(draft.patient_gender))
        );
      default:
        return true;
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <SignInGate />;
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
      <div className="rounded-3xl border border-border/70 bg-card p-6 shadow-soft sm:p-8">
        <Stepper current={step} />

        <div className="mt-8">
          {step === 0 && <ServiceStep draft={draft} setDraft={setDraft} />}
          {step === 1 &&
            (isMassage ? (
              <MassageStep draft={draft} set={set} />
            ) : (
              <CarePlanStep draft={draft} set={set} />
            ))}
          {step === 2 && (
            <ScheduleStep
              draft={draft}
              set={set}
              slots={slots.data ?? []}
              slotsLoading={slots.isLoading}
            />
          )}
          {step === 3 && <DetailsStep draft={draft} set={set} isMassage={isMassage} />}
          {step === 4 && <ReviewStep draft={draft} quote={quote} />}
        </div>

        <div className="mt-10 flex items-center justify-between gap-4 border-t border-border/70 pt-6">
          <Button
            variant="ghost"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0 || booking.isPending}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          {step < STEPS.length - 1 ? (
            <Button
              onClick={() => setStep((s) => s + 1)}
              disabled={!stepValid(step)}
              className="rounded-full px-6"
            >
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={() => booking.mutate()}
              disabled={booking.isPending || !payload}
              className="rounded-full px-6"
            >
              {booking.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Pay {quote ? formatINR(quote.total_amount) : ""} & confirm
            </Button>
          )}
        </div>
      </div>

      <PriceSummary
        draft={draft}
        quote={quote}
        error={quoteError}
        isMassage={isMassage}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Steps                                                               */
/* ------------------------------------------------------------------ */

function Stepper({ current }: { current: number }) {
  return (
    <ol className="flex flex-wrap items-center gap-x-2 gap-y-3 text-xs font-medium">
      {STEPS.map((label, i) => (
        <li key={label} className="flex items-center gap-2">
          <span
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-full border text-[11px] transition",
              i < current && "border-primary bg-primary text-primary-foreground",
              i === current && "border-primary text-primary",
              i > current && "border-border text-muted-foreground",
            )}
          >
            {i < current ? <Check className="h-3.5 w-3.5" /> : i + 1}
          </span>
          <span
            className={cn(
              "hidden sm:inline",
              i === current ? "text-foreground" : "text-muted-foreground",
            )}
          >
            {label}
          </span>
          {i < STEPS.length - 1 && (
            <span className="mx-1 hidden h-px w-6 bg-border sm:inline-block" />
          )}
        </li>
      ))}
    </ol>
  );
}

function StepHeading({ title, hint }: { title: string; hint: string }) {
  return (
    <div className="mb-6">
      <h2 className="font-display text-2xl tracking-tight">{title}</h2>
      <p className="mt-1.5 text-sm text-muted-foreground">{hint}</p>
    </div>
  );
}

function OptionCard({
  selected,
  onClick,
  title,
  meta,
  body,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  title: string;
  meta?: string;
  body?: string;
  children?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative flex w-full flex-col gap-1 rounded-2xl border p-4 text-left transition",
        selected
          ? "border-primary bg-primary-soft/60 shadow-soft"
          : "border-border bg-background hover:border-primary/40 hover:bg-secondary/40",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="text-sm font-semibold">{title}</span>
        {meta && (
          <span
            className={cn(
              "shrink-0 text-sm font-semibold",
              selected ? "text-primary" : "text-muted-foreground",
            )}
          >
            {meta}
          </span>
        )}
      </div>
      {body && <span className="text-xs text-muted-foreground">{body}</span>}
      {children}
      {selected && (
        <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Check className="h-3 w-3" />
        </span>
      )}
    </button>
  );
}

function ServiceStep({
  draft,
  setDraft,
}: {
  draft: Draft;
  setDraft: React.Dispatch<React.SetStateAction<Draft>>;
}) {
  return (
    <>
      <StepHeading
        title="What care do you need?"
        hint="Each service has its own pricing rules — pick one to see the plan options."
      />
      <div className="grid gap-3 sm:grid-cols-2">
        {SERVICES.map((s) => (
          <OptionCard
            key={s.category}
            selected={draft.service_category === s.category}
            onClick={() =>
              setDraft((d) => ({
                ...emptyDraft(s.category),
                // carry the patient's details across a service change
                patient_name: d.patient_name,
                patient_age: d.patient_age,
                patient_gender: d.patient_gender,
                contact_phone: d.contact_phone,
                contact_email: d.contact_email,
                address: d.address,
                city: d.city,
                pincode: d.pincode,
                condition_notes: d.condition_notes,
              }))
            }
            title={s.name}
            meta={`from ₹${s.startingAt}`}
            body={s.tagline}
          />
        ))}
      </div>
    </>
  );
}

function CarePlanStep({
  draft,
  set,
}: {
  draft: Draft;
  set: <K extends keyof Draft>(k: K, v: Draft[K]) => void;
}) {
  const freq = draft.frequency_type;
  return (
    <>
      <StepHeading
        title="How often should we visit?"
        hint="Daily and weekly visits are ₹400 per visit. Packages include applicable machine use."
      />

      <div className="grid gap-3 sm:grid-cols-3">
        {(
          [
            ["daily", "Daily", "Multiple visits in one day"],
            ["weekly", "Weekly", "Fixed days every week"],
            ["package", "Package", "1–24 month programme"],
          ] as const
        ).map(([value, title, body]) => (
          <OptionCard
            key={value}
            selected={freq === value}
            onClick={() => set("frequency_type", value)}
            title={title}
            body={body}
          />
        ))}
      </div>

      {freq === "daily" && (
        <div className="mt-6">
          <Label className="mb-3 block text-xs uppercase tracking-wide text-muted-foreground">
            Visits per day
          </Label>
          <div className="grid gap-3 sm:grid-cols-3">
            {DAILY_FREQUENCY.map((o) => (
              <OptionCard
                key={o.visits}
                selected={draft.daily_visits_per_day === o.visits}
                onClick={() => set("daily_visits_per_day", o.visits)}
                title={o.label}
                meta={`₹${o.price}`}
              />
            ))}
          </div>
        </div>
      )}

      {freq === "weekly" && (
        <div className="mt-6">
          <Label className="mb-3 block text-xs uppercase tracking-wide text-muted-foreground">
            Days per week — one visit on each selected day, ₹400 per visit
          </Label>
          <div className="flex flex-wrap gap-2">
            {WEEKLY_DAYS.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => set("weekly_days_count", n)}
                className={cn(
                  "h-11 w-11 rounded-full border text-sm font-semibold transition",
                  draft.weekly_days_count === n
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border hover:border-primary/40",
                )}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      )}

      {freq === "package" && (
        <div className="mt-6 space-y-4">
          <Label className="block text-xs uppercase tracking-wide text-muted-foreground">
            Package duration — ₹400 per visit, machine use included
          </Label>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {PACKAGES.map((p) => (
              <OptionCard
                key={p.value}
                selected={draft.package_duration === p.value}
                onClick={() => set("package_duration", p.value)}
                title={p.label}
                body={p.months}
              />
            ))}
          </div>
          {draft.package_duration === "custom" && (
            <div className="max-w-xs">
              <Label htmlFor="months">Number of months</Label>
              <Input
                id="months"
                type="number"
                min={1}
                max={24}
                value={draft.package_custom_months ?? ""}
                onChange={(e) =>
                  set("package_custom_months", Number(e.target.value) || undefined)
                }
                placeholder="e.g. 4"
              />
            </div>
          )}
        </div>
      )}

      <EquipmentPicker draft={draft} set={set} />
    </>
  );
}

function EquipmentPicker({
  draft,
  set,
}: {
  draft: Draft;
  set: <K extends keyof Draft>(k: K, v: Draft[K]) => void;
}) {
  const included = draft.frequency_type === "package";
  const toggle = (code: EquipmentCode) =>
    set(
      "equipment",
      draft.equipment.includes(code)
        ? draft.equipment.filter((c) => c !== code)
        : [...draft.equipment, code],
    );

  return (
    <div className="mt-8 border-t border-border/70 pt-6">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <Label className="text-xs uppercase tracking-wide text-muted-foreground">
          Portable modalities (optional)
        </Label>
        <span className="text-xs text-muted-foreground">
          {included
            ? "Included in your package — no extra charge"
            : "₹100 per machine, per visit"}
        </span>
      </div>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {MODALITIES.map((m) => {
          const active = draft.equipment.includes(m.code);
          return (
            <button
              key={m.code}
              type="button"
              onClick={() => toggle(m.code)}
              className={cn(
                "flex items-center gap-3 rounded-2xl border p-3 text-left transition",
                active
                  ? "border-primary bg-primary-soft/60"
                  : "border-border hover:border-primary/40",
              )}
            >
              <img src={equipmentIcon(m.code)} alt="" className="h-9 w-9 shrink-0" />
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold">{m.name}</span>
                <span className="block truncate text-[11px] text-muted-foreground">
                  {m.short}
                </span>
              </span>
            </button>
          );
        })}
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        Final machine selection is confirmed by your physiotherapist after assessment
        and against any doctor's prescription you upload.
      </p>
    </div>
  );
}

function MassageStep({
  draft,
  set,
}: {
  draft: Draft;
  set: <K extends keyof Draft>(k: K, v: Draft[K]) => void;
}) {
  return (
    <>
      <StepHeading
        title="Choose your massage"
        hint="Sessions run 45–60 minutes. Beyond 60 minutes an additional ₹100 applies."
      />
      <div className="grid gap-3 sm:grid-cols-3">
        {MASSAGE_OPTIONS.map((m) => (
          <OptionCard
            key={m.value}
            selected={draft.massage_type === m.value}
            onClick={() => set("massage_type", m.value)}
            title={m.label}
            meta={`₹${m.price}`}
          />
        ))}
      </div>

      <div className="mt-6">
        <Label className="mb-3 block text-xs uppercase tracking-wide text-muted-foreground">
          Session duration
        </Label>
        <div className="grid gap-3 sm:grid-cols-3">
          {[45, 60, 90].map((mins) => (
            <OptionCard
              key={mins}
              selected={draft.massage_duration_minutes === mins}
              onClick={() => set("massage_duration_minutes", mins)}
              title={`${mins} minutes`}
              body={mins > 60 ? "+₹100 extended session" : "Standard duration"}
            />
          ))}
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-border bg-secondary/40 p-4">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <div className="text-sm">
            <p className="font-semibold">Gender-matched, strictly clinical</p>
            <p className="mt-1 text-muted-foreground">
              Male patients are assigned male therapists and female patients female
              therapists. We do not provide intimate or sexual services of any kind —
              any such request ends the booking immediately.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

function ScheduleStep({
  draft,
  set,
  slots,
  slotsLoading,
}: {
  draft: Draft;
  set: <K extends keyof Draft>(k: K, v: Draft[K]) => void;
  slots: string[];
  slotsLoading: boolean;
}) {
  return (
    <>
      <StepHeading
        title="When should we come?"
        hint="Pick a date, a shift, and a slot inside that shift."
      />

      <div className="max-w-xs">
        <Label htmlFor="date">Preferred date</Label>
        <Input
          id="date"
          type="date"
          min={todayISO()}
          value={draft.preferred_date}
          onChange={(e) => set("preferred_date", e.target.value)}
        />
      </div>

      <div className="mt-6">
        <Label className="mb-3 block text-xs uppercase tracking-wide text-muted-foreground">
          Shift
        </Label>
        <div className="grid gap-3 sm:grid-cols-4">
          {SHIFTS.map((s) => (
            <OptionCard
              key={s.value}
              selected={draft.shift === s.value}
              onClick={() => {
                set("shift", s.value);
                set("time_slot", undefined);
              }}
              title={s.label}
              body={s.window}
            />
          ))}
        </div>
      </div>

      {draft.shift && (
        <div className="mt-6">
          <Label className="mb-3 block text-xs uppercase tracking-wide text-muted-foreground">
            Time slot
          </Label>
          {slotsLoading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading slots…
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {slots.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => set("time_slot", slot)}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm font-medium transition",
                    draft.time_slot === slot
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border hover:border-primary/40",
                  )}
                >
                  {slot}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {draft.service_category !== "massage_therapy" && (
        <div className="mt-6 max-w-xs">
          <Label htmlFor="duration">Session length (40–60 min)</Label>
          <Input
            id="duration"
            type="number"
            min={40}
            max={60}
            value={draft.session_duration_minutes}
            onChange={(e) =>
              set("session_duration_minutes", Number(e.target.value) || 45)
            }
          />
        </div>
      )}
    </>
  );
}

function DetailsStep({
  draft,
  set,
  isMassage,
}: {
  draft: Draft;
  set: <K extends keyof Draft>(k: K, v: Draft[K]) => void;
  isMassage: boolean;
}) {
  return (
    <>
      <StepHeading
        title="Who are we visiting?"
        hint="Your address and condition help us match the right therapist."
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name" required>
          <Input
            value={draft.patient_name}
            onChange={(e) => set("patient_name", e.target.value)}
            placeholder="Patient's full name"
          />
        </Field>
        <Field label="Age">
          <Input
            type="number"
            min={0}
            max={130}
            value={draft.patient_age ?? ""}
            onChange={(e) => set("patient_age", e.target.value)}
            placeholder="e.g. 54"
          />
        </Field>
        <Field
          label="Gender"
          required={isMassage}
          hint={isMassage ? "Required — we match therapist gender" : undefined}
        >
          <div className="flex gap-2">
            {(["male", "female", "other"] as Gender[]).map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => set("patient_gender", g)}
                className={cn(
                  "flex-1 rounded-xl border px-3 py-2 text-sm capitalize transition",
                  draft.patient_gender === g
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border hover:border-primary/40",
                )}
              >
                {g}
              </button>
            ))}
          </div>
        </Field>
        <Field label="Mobile number" required>
          <Input
            type="tel"
            value={draft.contact_phone}
            onChange={(e) => set("contact_phone", e.target.value)}
            placeholder="+91"
          />
        </Field>
        <Field label="Email">
          <Input
            type="email"
            value={draft.contact_email}
            onChange={(e) => set("contact_email", e.target.value)}
            placeholder="optional"
          />
        </Field>
        <Field label="PIN code">
          <Input
            value={draft.pincode}
            onChange={(e) => set("pincode", e.target.value)}
            placeholder="e.g. 700001"
          />
        </Field>
        <Field label="City / town">
          <Input
            value={draft.city}
            onChange={(e) => set("city", e.target.value)}
            placeholder="e.g. Kolkata"
          />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Full address" required>
            <Textarea
              rows={2}
              value={draft.address}
              onChange={(e) => set("address", e.target.value)}
              placeholder="House / flat, street, landmark, locality"
            />
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field
            label="Condition & symptoms"
            hint="Pain, movement or walking difficulty, muscle weakness, how long you've had it — anything relevant."
          >
            <Textarea
              rows={4}
              value={draft.condition_notes}
              onChange={(e) => set("condition_notes", e.target.value)}
              placeholder="Describe the medical condition, symptoms and duration…"
            />
          </Field>
        </div>
      </div>
    </>
  );
}

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm">
        {label}
        {required && <span className="ml-0.5 text-destructive">*</span>}
      </Label>
      {children}
      {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  );
}

function ReviewStep({ draft, quote }: { draft: Draft; quote: PricingQuote | null }) {
  const service = SERVICES.find((s) => s.category === draft.service_category)!;
  const rows: [string, string][] = [
    ["Service", service.name],
    ["Date", draft.preferred_date],
    ["Shift & slot", `${draft.shift ?? "—"} · ${draft.time_slot ?? "—"}`],
    ["Patient", draft.patient_name || "—"],
    ["Contact", draft.contact_phone || "—"],
    ["Address", draft.address || "—"],
  ];
  if (draft.service_category === "massage_therapy") {
    rows.splice(1, 0, [
      "Massage",
      `${MASSAGE_OPTIONS.find((m) => m.value === draft.massage_type)?.label ?? "—"} · ${draft.massage_duration_minutes} min`,
    ]);
  } else {
    rows.splice(1, 0, [
      "Plan",
      draft.frequency_type === "daily"
        ? `${draft.daily_visits_per_day} visit(s) per day`
        : draft.frequency_type === "weekly"
          ? `${draft.weekly_days_count} day(s) per week`
          : `${draft.package_duration ?? "—"} package${
              draft.package_custom_months ? ` · ${draft.package_custom_months} months` : ""
            }`,
    ]);
    rows.splice(2, 0, [
      "Modalities",
      draft.equipment.length
        ? draft.equipment
            .map((c) => MODALITIES.find((m) => m.code === c)?.name ?? c)
            .join(", ")
        : "None",
    ]);
  }

  return (
    <>
      <StepHeading
        title="Review and confirm"
        hint="Your advance payment is the booking confirmation fee. Nothing is charged after this."
      />
      <dl className="divide-y divide-border/70 rounded-2xl border border-border/70">
        {rows.map(([k, v]) => (
          <div key={k} className="flex gap-4 px-4 py-3 text-sm">
            <dt className="w-32 shrink-0 text-muted-foreground">{k}</dt>
            <dd className="min-w-0 flex-1 font-medium">{v}</dd>
          </div>
        ))}
      </dl>
      {draft.condition_notes && (
        <div className="mt-4 rounded-2xl border border-border/70 bg-secondary/30 p-4 text-sm">
          <p className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">
            Condition notes
          </p>
          <p className="whitespace-pre-wrap">{draft.condition_notes}</p>
        </div>
      )}
      {quote && (
        <p className="mt-4 text-xs text-muted-foreground">
          Platform fee of {quote.platform_fee_percent}% (
          {formatINR(quote.platform_fee_amount)}) is included in the total shown — it
          is not added on top.
        </p>
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Sidebar                                                             */
/* ------------------------------------------------------------------ */

function PriceSummary({
  draft,
  quote,
  error,
  isMassage,
}: {
  draft: Draft;
  quote: PricingQuote | null;
  error: string | null;
  isMassage: boolean;
}) {
  const service = SERVICES.find((s) => s.category === draft.service_category)!;
  return (
    <aside className="lg:sticky lg:top-24">
      <div className="overflow-hidden rounded-3xl border border-border/70 bg-card shadow-soft">
        <div className="bg-primary px-6 py-5 text-primary-foreground">
          <p className="text-[11px] uppercase tracking-[0.2em] opacity-80">
            Booking summary
          </p>
          <p className="mt-1 font-display text-lg">{service.name}</p>
        </div>

        <div className="space-y-3 px-6 py-5 text-sm">
          {error && <p className="text-xs text-destructive">{error}</p>}

          <Row
            label={isMassage ? "Session fee" : "Therapist visit fee"}
            value={quote ? formatINR(quote.visit_fee) : "—"}
          />
          <Row
            label={`Machine charge${draft.equipment.length ? ` (${draft.equipment.length})` : ""}`}
            value={quote ? formatINR(quote.machine_charge) : "—"}
          />
          <div className="border-t border-border/70 pt-3">
            <Row
              label="Total booking amount"
              value={quote ? formatINR(quote.total_amount) : "—"}
              emphasis
            />
          </div>
          <Row
            label={`Platform fee (${quote?.platform_fee_percent ?? service.platformFee}%)`}
            value={quote ? formatINR(quote.platform_fee_amount) : "—"}
            muted
          />
          <Row
            label="Therapist payout"
            value={quote ? formatINR(quote.therapist_payout) : "—"}
            muted
          />
        </div>

        <div className="border-t border-border/70 bg-secondary/40 px-6 py-4 text-[11px] leading-relaxed text-muted-foreground">
          Prices are calculated by our server, not this page — what you see here is
          exactly what will be charged. Cancellation and refund terms follow our
          published refund policy.
        </div>
      </div>
    </aside>
  );
}

function Row({
  label,
  value,
  emphasis,
  muted,
}: {
  label: string;
  value: string;
  emphasis?: boolean;
  muted?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span
        className={cn(
          "text-sm",
          muted ? "text-muted-foreground" : "text-foreground/80",
          emphasis && "font-semibold text-foreground",
        )}
      >
        {label}
      </span>
      <span
        className={cn(
          "shrink-0 tabular-nums",
          emphasis ? "font-display text-xl text-primary" : "text-sm font-medium",
          muted && "text-muted-foreground",
        )}
      >
        {value}
      </span>
    </div>
  );
}

function SignInGate() {
  return (
    <div className="mx-auto max-w-md rounded-3xl border border-border/70 bg-card p-8 text-center shadow-soft">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-soft">
        <LockKeyhole className="h-5 w-5 text-primary" />
      </div>
      <h2 className="mt-5 font-display text-2xl tracking-tight">Sign in to book</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Your booking, prescriptions and visit history stay attached to your account —
        so sign in before we price your care plan.
      </p>
      <Button className="mt-6 w-full rounded-full" onClick={() => openAuthDialog("login")}>
        Sign in or create an account
      </Button>
    </div>
  );
}
