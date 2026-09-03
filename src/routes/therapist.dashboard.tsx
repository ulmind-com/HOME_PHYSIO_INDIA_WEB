import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { BadgeCheck, CalendarDays, Loader2, ShieldAlert, Wallet } from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import { openAuthDialog } from "@/lib/auth-dialog";
import {
  assignedBookingsQ,
  formatINR,
  SERVICE_LABELS,
  SHIFT_LABELS,
  STATUS_LABELS,
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
          <TabsTrigger value="earnings">Earnings</TabsTrigger>
          <TabsTrigger value="payouts">Payouts</TabsTrigger>
        </TabsList>

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
    </article>
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
