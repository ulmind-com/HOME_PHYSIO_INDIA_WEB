import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import {
  BadgeCheck,
  CalendarDays,
  Loader2,
  MessageSquare,
  Plus,
  ShieldAlert,
  Wallet,
  Wrench,
} from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import { openAuthDialog } from "@/lib/auth-dialog";
import {
  assignedBookingsQ,
  createMyEquipment,
  createMySlot,
  deleteMyEquipment,
  deleteMySlot,
  formatINR,
  myEquipmentQ,
  mySlotsQ,
  SERVICE_LABELS,
  SHIFT_LABELS,
  STATUS_LABELS,
  updateMyBookingStatus,
  type BookingStatus,
  type ServiceCategory,
  type TherapyBooking,
} from "@/lib/api/therapy";
import {
  myEarningsQ,
  myEarningsSummaryQ,
  myPayoutsQ,
} from "@/lib/api/account";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { avatarPlaceholder, imageSrc } from "@/lib/placeholders";

export const Route = createFileRoute("/therapist/dashboard")({
  head: () => ({
    meta: [{ title: "Therapist dashboard — Home Physio India" }],
  }),
  component: TherapistDashboard,
});

function TherapistDashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const isTherapist = user?.role === "therapist";
  const approved = user?.verification_status === "approved";

  // A therapist's user_type decides which category their equipment belongs to.
  const defaultCategory: ServiceCategory =
    user?.user_type === "massage_therapist"
      ? "massage_therapy"
      : user?.user_type === "yoga_therapist"
        ? "yoga_therapy"
        : "physiotherapy";

  const bookings = useQuery(assignedBookingsQ(isTherapist));
  const summary = useQuery(myEarningsSummaryQ(isTherapist));
  const earnings = useQuery(myEarningsQ(isTherapist));
  const payouts = useQuery(myPayoutsQ(isTherapist));

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Gate
        title="Sign in to continue"
        body="Your assigned visits and earnings live behind your therapist account."
        action={
          <Button className="w-full rounded-full" onClick={() => openAuthDialog()}>
            Sign in
          </Button>
        }
      />
    );
  }

  if (!isTherapist) {
    return (
      <Gate
        title="Therapist account required"
        body="This dashboard is for registered therapists. Patients can track visits from their own dashboard."
      />
    );
  }

  return (
    <div className="container-x py-12 lg:py-16">
      <header className="flex flex-wrap items-center gap-5">
        <img
          src={imageSrc(user?.avatar, avatarPlaceholder(user?.name ?? "Therapist"))}
          alt=""
          className="h-16 w-16 rounded-2xl object-cover"
        />
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-display text-2xl tracking-tight md:text-3xl">
              {user?.name}
            </h1>
            {approved ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-2.5 py-0.5 text-[11px] font-semibold text-primary">
                <BadgeCheck className="h-3 w-3" />
                Verified
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-semibold text-amber-800">
                <ShieldAlert className="h-3 w-3" />
                {user?.verification_status ?? "pending"}
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {[user?.qualification, user?.specialization, user?.therapist_tier]
              .filter(Boolean)
              .join(" · ") || "Home visit therapist"}
          </p>
        </div>
      </header>

      {!approved && (
        <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
          Your documents are with our admin team. Once verification is approved you'll
          start receiving home-visit assignments here.
        </div>
      )}

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label="Pending earnings"
          value={formatINR(summary.data?.pending_amount ?? 0)}
          hint={`${summary.data?.pending_count ?? 0} visits`}
        />
        <Stat
          label="Settled"
          value={formatINR(summary.data?.settled_amount ?? 0)}
          hint={`${summary.data?.settled_count ?? 0} visits`}
        />
        <Stat
          label="Total earned"
          value={formatINR(summary.data?.total_earned ?? 0)}
          hint={`${summary.data?.total_bookings ?? 0} bookings`}
          accent
        />
        <Stat
          label="Assigned visits"
          value={String(bookings.data?.items?.length ?? 0)}
          hint="currently on your list"
        />
      </div>

      <Tabs defaultValue="visits" className="mt-10">
        <TabsList>
          <TabsTrigger value="visits">Assigned visits</TabsTrigger>
          <TabsTrigger value="slots">My availability</TabsTrigger>
          <TabsTrigger value="equipment">My equipment</TabsTrigger>
          <TabsTrigger value="earnings">Earnings</TabsTrigger>
          <TabsTrigger value="payouts">Payouts</TabsTrigger>
        </TabsList>

        <TabsContent value="slots" className="mt-8">
          <SlotsPanel />
        </TabsContent>

        <TabsContent value="equipment" className="mt-8">
          <EquipmentPanel category={defaultCategory} />
        </TabsContent>

        <TabsContent value="visits" className="mt-8">
          {bookings.isLoading ? (
            <Loading />
          ) : (bookings.data?.items?.length ?? 0) === 0 ? (
            <Empty
              icon={<CalendarDays className="h-6 w-6 text-primary" />}
              title="No assigned visits"
              body="When our admin team assigns you a home visit it will appear here with the patient's address and condition notes."
            />
          ) : (
            <div className="grid gap-4">
              {bookings.data!.items.map((b) => (
                <VisitCard key={b.id} booking={b} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="earnings" className="mt-8">
          {earnings.isLoading ? (
            <Loading />
          ) : (earnings.data?.items?.length ?? 0) === 0 ? (
            <Empty
              icon={<Wallet className="h-6 w-6 text-primary" />}
              title="No earnings yet"
              body="Each completed visit creates an earning entry showing the total, the platform fee and your payout."
            />
          ) : (
            <div className="overflow-x-auto rounded-3xl border border-border/70">
              <table className="w-full min-w-[640px] text-sm">
                <thead className="bg-secondary/60 text-left">
                  <tr>
                    <th className="px-5 py-3.5 font-medium">Booking</th>
                    <th className="px-5 py-3.5 font-medium">Patient</th>
                    <th className="px-5 py-3.5 text-right font-medium">Total</th>
                    <th className="px-5 py-3.5 text-right font-medium">Platform fee</th>
                    <th className="px-5 py-3.5 text-right font-medium">Your payout</th>
                    <th className="px-5 py-3.5 text-right font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/70 bg-card">
                  {earnings.data!.items.map((e) => (
                    <tr key={e.id}>
                      <td className="px-5 py-3.5 font-mono text-xs">
                        {e.booking_reference}
                      </td>
                      <td className="px-5 py-3.5">{e.patient_name}</td>
                      <td className="px-5 py-3.5 text-right tabular-nums">
                        {formatINR(e.total_amount)}
                      </td>
                      <td className="px-5 py-3.5 text-right tabular-nums text-muted-foreground">
                        {formatINR(e.platform_fee_amount)} ({e.platform_fee_percent}%)
                      </td>
                      <td className="px-5 py-3.5 text-right font-semibold tabular-nums text-primary">
                        {formatINR(e.therapist_payout)}
                      </td>
                      <td className="px-5 py-3.5 text-right capitalize">{e.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>

        <TabsContent value="payouts" className="mt-8">
          {payouts.isLoading ? (
            <Loading />
          ) : (payouts.data?.items?.length ?? 0) === 0 ? (
            <Empty
              icon={<Wallet className="h-6 w-6 text-primary" />}
              title="No payouts yet"
              body="Once our admin team settles a payout cycle, the record appears here."
            />
          ) : (
            <div className="grid gap-4">
              {payouts.data!.items.map((p) => (
                <div
                  key={p.id}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border/70 bg-card p-5"
                >
                  <div>
                    <p className="font-medium">{p.reference ?? p.id}</p>
                    <p className="text-xs text-muted-foreground">
                      {p.period_start && p.period_end
                        ? `${p.period_start} → ${p.period_end}`
                        : new Date(p.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-xl text-primary">
                      {formatINR(p.total_amount)}
                    </p>
                    <p className="text-xs capitalize text-muted-foreground">{p.status}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* My availability                                                     */
/* ------------------------------------------------------------------ */

function SlotsPanel() {
  const queryClient = useQueryClient();
  const slots = useQuery(mySlotsQ());
  const [date, setDate] = useState("");
  const [start, setStart] = useState("10:00");
  const [end, setEnd] = useState("11:00");

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["therapy", "my-slots"] });
  };

  const add = useMutation({
    mutationFn: () => createMySlot({ date, start_time: start, end_time: end }),
    onSuccess: () => {
      invalidate();
      setDate("");
      toast.success("Slot published — patients can now book it");
    },
    onError: (err: unknown) =>
      toast.error(err instanceof Error ? err.message : "Could not publish that slot"),
  });

  const remove = useMutation({
    mutationFn: (id: string) => deleteMySlot(id),
    onSuccess: () => {
      invalidate();
      toast.success("Slot removed");
    },
    onError: (err: unknown) =>
      toast.error(err instanceof Error ? err.message : "Could not remove that slot"),
  });

  const today = new Date().toISOString().slice(0, 10);
  const canAdd = Boolean(date) && start < end;

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-border/70 bg-card p-5 sm:p-6">
        <h3 className="font-display text-lg tracking-tight">Publish a visit slot</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Patients booking you pick from these. A slot disappears from their view the moment
          someone takes it.
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto_auto_auto] sm:items-end">
          <Field label="Date">
            <input
              type="date"
              min={today}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="h-10 w-full rounded-xl border border-input bg-transparent px-3 text-sm"
            />
          </Field>
          <Field label="From">
            <input
              type="time"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className="h-10 rounded-xl border border-input bg-transparent px-3 text-sm"
            />
          </Field>
          <Field label="To">
            <input
              type="time"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              className="h-10 rounded-xl border border-input bg-transparent px-3 text-sm"
            />
          </Field>
          <Button
            className="h-10 rounded-full"
            disabled={!canAdd || add.isPending}
            onClick={() => add.mutate()}
          >
            {add.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Add slot
          </Button>
        </div>
        {date && start >= end && (
          <p className="mt-2 text-xs text-destructive">End time must be after the start time.</p>
        )}
      </section>

      {slots.isLoading ? (
        <Loading />
      ) : (slots.data?.length ?? 0) === 0 ? (
        <Empty
          icon={<CalendarDays className="h-6 w-6 text-primary" />}
          title="No slots published yet"
          body="Add your available times above so patients can book you directly."
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {slots.data!.map((s) => (
            <div
              key={s.id}
              className="flex items-center justify-between gap-3 rounded-2xl border border-border/70 bg-card px-4 py-3"
            >
              <div className="min-w-0">
                <p className="text-sm font-semibold">
                  {s.date} · {s.start_time} – {s.end_time}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {s.is_booked
                    ? `Booked${s.booked_by_patient_name ? ` by ${s.booked_by_patient_name}` : ""}`
                    : "Open for booking"}
                </p>
              </div>
              {s.is_booked ? (
                <span className="shrink-0 rounded-full bg-primary-soft px-3 py-1 text-[11px] font-semibold text-primary">
                  Booked
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => remove.mutate(s.id)}
                  disabled={remove.isPending}
                  className="shrink-0 rounded-full border border-border px-3 py-1 text-[11px] font-semibold text-muted-foreground transition-colors hover:bg-secondary disabled:opacity-50"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* My equipment                                                        */
/* ------------------------------------------------------------------ */

function EquipmentPanel({ category }: { category: ServiceCategory }) {
  const queryClient = useQueryClient();
  const items = useQuery(myEquipmentQ());
  const [name, setName] = useState("");
  const [charge, setCharge] = useState("");

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["therapy", "my-equipment"] });

  const add = useMutation({
    mutationFn: () =>
      createMyEquipment({ name: name.trim(), category, charge: Number(charge) }),
    onSuccess: () => {
      invalidate();
      setName("");
      setCharge("");
      toast.success("Equipment added — patients booking you can now select it");
    },
    onError: (err: unknown) =>
      toast.error(err instanceof Error ? err.message : "Could not add that equipment"),
  });

  const remove = useMutation({
    mutationFn: (id: string) => deleteMyEquipment(id),
    onSuccess: () => {
      invalidate();
      toast.success("Equipment removed");
    },
    onError: (err: unknown) =>
      toast.error(err instanceof Error ? err.message : "Could not remove that equipment"),
  });

  const canAdd = name.trim().length > 1 && Number(charge) >= 0 && charge !== "";

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-border/70 bg-card p-5 sm:p-6">
        <h3 className="font-display text-lg tracking-tight">Add your own equipment</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Anything you bring yourself, with the charge you want for it. It shows up as an optional
          add-on for patients booking your {SERVICE_LABELS[category].toLowerCase()} sessions.
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto_auto] sm:items-end">
          <Field label="Equipment name">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Portable massage table"
              className="h-10 w-full rounded-xl border border-input bg-transparent px-3 text-sm"
            />
          </Field>
          <Field label="Charge (₹)">
            <input
              type="number"
              min={0}
              value={charge}
              onChange={(e) => setCharge(e.target.value)}
              placeholder="150"
              className="h-10 w-28 rounded-xl border border-input bg-transparent px-3 text-sm"
            />
          </Field>
          <Button
            className="h-10 rounded-full"
            disabled={!canAdd || add.isPending}
            onClick={() => add.mutate()}
          >
            {add.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Add
          </Button>
        </div>
      </section>

      {items.isLoading ? (
        <Loading />
      ) : (items.data?.length ?? 0) === 0 ? (
        <Empty
          icon={<Wrench className="h-6 w-6 text-primary" />}
          title="No equipment added"
          body="Add the equipment you carry so patients can include it — and its charge — when they book you."
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {items.data!.map((e) => (
            <div
              key={e.id}
              className="flex items-center justify-between gap-3 rounded-2xl border border-border/70 bg-card px-4 py-3"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{e.name}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {SERVICE_LABELS[e.category]} · {formatINR(e.charge)} per session
                </p>
              </div>
              <button
                type="button"
                onClick={() => remove.mutate(e.id)}
                disabled={remove.isPending}
                className="shrink-0 rounded-full border border-border px-3 py-1 text-[11px] font-semibold text-muted-foreground transition-colors hover:bg-secondary disabled:opacity-50"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

function VisitCard({ booking }: { booking: TherapyBooking }) {
  return (
    <article className="rounded-3xl border border-border/70 bg-card p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="font-display text-lg tracking-tight">
            {SERVICE_LABELS[booking.service_category]}
          </h3>
          <p className="mt-0.5 font-mono text-xs text-muted-foreground">
            {booking.reference} · {STATUS_LABELS[booking.status]}
          </p>
        </div>
        <div className="text-right">
          <p className="font-display text-xl text-primary">
            {formatINR(booking.therapist_payout)}
          </p>
          <p className="text-[11px] text-muted-foreground">your payout</p>
        </div>
      </div>

      <dl className="mt-5 grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
        <Row label="Patient" value={`${booking.patient_name}${booking.patient_age ? `, ${booking.patient_age}` : ""}`} />
        <Row label="Contact" value={booking.contact_phone} />
        <Row
          label="When"
          value={`${booking.preferred_date} · ${SHIFT_LABELS[booking.shift]} · ${booking.time_slot}`}
        />
        <Row
          label="Address"
          value={[booking.address, booking.city, booking.pincode]
            .filter(Boolean)
            .join(", ")}
        />
      </dl>

      {booking.condition_notes && (
        <p className="mt-4 rounded-xl bg-secondary/50 p-3 text-xs text-muted-foreground">
          {booking.condition_notes}
        </p>
      )}

      <VisitActions booking={booking} />
    </article>
  );
}

/** What the therapist can do with a visit: move it along, or talk to the patient. */
function VisitActions({ booking }: { booking: TherapyBooking }) {
  const queryClient = useQueryClient();
  const [busy, setBusy] = useState<BookingStatus | null>(null);

  const move = useMutation({
    mutationFn: (status: BookingStatus) => updateMyBookingStatus(booking.id, status),
    onMutate: (status) => setBusy(status),
    onSuccess: (_data, status) => {
      queryClient.invalidateQueries({ queryKey: ["therapy", "assigned-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["therapy", "my-slots"] });
      toast.success(`Visit marked ${STATUS_LABELS[status].toLowerCase()}`);
    },
    onError: (err: unknown) =>
      toast.error(err instanceof Error ? err.message : "Could not update this visit"),
    onSettled: () => setBusy(null),
  });

  const terminal = ["completed", "cancelled", "rejected"].includes(booking.status);
  const chatRoom = `booking_${booking.reference}`;

  return (
    <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-border/60 pt-4">
      {!terminal && booking.status === "pending" && (
        <ActionButton
          label="Confirm visit"
          busy={busy === "approved"}
          onClick={() => move.mutate("approved")}
        />
      )}
      {!terminal && booking.status === "approved" && (
        <ActionButton
          label="Start visit"
          busy={busy === "in_progress"}
          onClick={() => move.mutate("in_progress")}
        />
      )}
      {booking.status === "in_progress" && (
        <span className="text-xs text-muted-foreground">
          Our team closes the visit out once it's done — your payout is credited then.
        </span>
      )}
      {!terminal && (
        <ActionButton
          label="Cancel"
          tone="danger"
          busy={busy === "cancelled"}
          onClick={() => move.mutate("cancelled")}
        />
      )}

      <a
        href={`/video-consultation?roomId=${encodeURIComponent(chatRoom)}`}
        className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-1.5 text-xs font-semibold transition-colors hover:bg-secondary"
      >
        <MessageSquare className="h-3.5 w-3.5" /> Chat / Video
      </a>
    </div>
  );
}

function ActionButton({
  label,
  onClick,
  busy,
  tone = "default",
}: {
  label: string;
  onClick: () => void;
  busy?: boolean;
  tone?: "default" | "danger";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      className={
        tone === "danger"
          ? "inline-flex items-center gap-1.5 rounded-full border border-destructive/40 px-4 py-1.5 text-xs font-semibold text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-50"
          : "inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
      }
    >
      {busy && <Loader2 className="h-3 w-3 animate-spin" />}
      {label}
    </button>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-0.5 font-medium">{value}</dd>
    </div>
  );
}

function Stat({
  label,
  value,
  hint,
  accent,
}: {
  label: string;
  value: string;
  hint: string;
  accent?: boolean;
}) {
  return (
    <div
      className={
        accent
          ? "rounded-3xl border border-primary/30 bg-primary-soft/50 p-5"
          : "rounded-3xl border border-border/70 bg-card p-5"
      }
    >
      <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 font-display text-2xl tabular-nums">{value}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}

function Loading() {
  return (
    <div className="flex min-h-[200px] items-center justify-center rounded-3xl border border-dashed border-border">
      <Loader2 className="h-5 w-5 animate-spin text-primary" />
    </div>
  );
}

function Empty({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-3xl border border-dashed border-border bg-secondary/20 p-12 text-center">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary-soft">
        {icon}
      </div>
      <h3 className="mt-5 font-display text-xl tracking-tight">{title}</h3>
      <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">{body}</p>
    </div>
  );
}

function Gate({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="container-x flex min-h-[60vh] items-center justify-center">
      <div className="max-w-sm rounded-3xl border border-border/70 bg-card p-8 text-center">
        <h1 className="font-display text-2xl">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{body}</p>
        {action && <div className="mt-6">{action}</div>}
      </div>
    </div>
  );
}
