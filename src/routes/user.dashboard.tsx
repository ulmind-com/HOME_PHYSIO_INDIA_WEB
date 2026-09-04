import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { toast } from "sonner";
import {
  CalendarDays,
  Download,
  FileUp,
  Loader2,
  Plus,
  Trash2,
  Upload,
} from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import { openAuthDialog } from "@/lib/auth-dialog";
import {
  cancelBooking,
  formatINR,
  myBookingsQ,
  SERVICE_LABELS,
  SHIFT_LABELS,
  STATUS_LABELS,
  type BookingStatus,
  type TherapyBooking,
} from "@/lib/api/therapy";
import {
  deleteReport,
  myReportsQ,
  REPORT_STAGES,
  REPORT_TYPES,
  uploadReport,
  type MedicalReport,
  type ReportType,
} from "@/lib/api/account";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/user/dashboard")({
  head: () => ({
    meta: [{ title: "My dashboard — Home Physio India" }],
  }),
  component: PatientDashboard,
});

function PatientDashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container-x flex min-h-[60vh] items-center justify-center">
        <div className="max-w-sm rounded-3xl border border-border/70 bg-card p-8 text-center">
          <h1 className="font-display text-2xl">Sign in to continue</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your bookings, reports and visit history live behind your account.
          </p>
          <Button className="mt-6 w-full rounded-full" onClick={() => openAuthDialog()}>
            Sign in
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-x py-12 lg:py-16">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-primary">Your account</p>
          <h1 className="mt-1.5 font-display text-3xl tracking-tight md:text-4xl">
            Hello, {user?.name?.split(" ")[0] ?? "there"}
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Track your visits, upload prescriptions and follow their review status.
          </p>
        </div>
        <Link
          to="/booking"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          New booking
        </Link>
      </header>

      <Tabs defaultValue="bookings" className="mt-10">
        <TabsList>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="reports">Reports & prescriptions</TabsTrigger>
        </TabsList>

        <TabsContent value="bookings" className="mt-8">
          <BookingsPanel />
        </TabsContent>

        <TabsContent value="reports" className="mt-8">
          <ReportsPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Bookings                                                            */
/* ------------------------------------------------------------------ */

const STATUS_TONE: Record<BookingStatus, string> = {
  pending: "bg-amber-100 text-amber-800",
  approved: "bg-emerald-100 text-emerald-800",
  rejected: "bg-rose-100 text-rose-800",
  in_progress: "bg-indigo-100 text-indigo-800",
  completed: "bg-primary-soft text-primary",
  cancelled: "bg-muted text-muted-foreground",
};

function BookingsPanel() {
  const queryClient = useQueryClient();
  const bookings = useQuery(myBookingsQ());

  const cancel = useMutation({
    mutationFn: (id: string) => cancelBooking(id, "Cancelled by patient"),
    onSuccess: () => {
      toast.success("Booking cancelled");
      queryClient.invalidateQueries({ queryKey: ["therapy", "my-bookings"] });
    },
    onError: (e: Error) => toast.error(e.message || "Could not cancel"),
  });

  if (bookings.isLoading) return <PanelLoading />;

  const items = bookings.data?.items ?? [];
  if (items.length === 0) {
    return (
      <EmptyPanel
        icon={<CalendarDays className="h-6 w-6 text-primary" />}
        title="No bookings yet"
        body="Book a home visit and it will appear here with its full price breakdown."
        action={
          <Link
            to="/booking"
            className="inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
          >
            Book a visit
          </Link>
        }
      />
    );
  }

  return (
    <div className="grid gap-4">
      {items.map((b) => (
        <BookingCard key={b.id} booking={b} onCancel={() => cancel.mutate(b.id)} />
      ))}
    </div>
  );
}

function BookingCard({
  booking,
  onCancel,
}: {
  booking: TherapyBooking;
  onCancel: () => void;
}) {
  const cancellable = ["pending", "confirmed", "assigned"].includes(booking.status);
  return (
    <article className="rounded-3xl border border-border/70 bg-card p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-display text-lg tracking-tight">
              {SERVICE_LABELS[booking.service_category]}
            </h3>
            <span
              className={cn(
                "rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
                STATUS_TONE[booking.status],
              )}
            >
              {STATUS_LABELS[booking.status]}
            </span>
            {booking.payment_status !== "paid" && (
              <span className="rounded-full bg-destructive/10 px-2.5 py-0.5 text-[11px] font-semibold text-destructive">
                Payment {booking.payment_status}
              </span>
            )}
          </div>
          <p className="mt-1 font-mono text-xs text-muted-foreground">
            {booking.reference}
          </p>
        </div>
        <div className="text-right">
          <p className="font-display text-2xl text-primary">
            {formatINR(booking.total_amount)}
          </p>
          <p className="text-[11px] text-muted-foreground">total booking amount</p>
        </div>
      </div>

      <dl className="mt-5 grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
        <Detail label="Date" value={booking.preferred_date} />
        <Detail
          label="Shift & slot"
          value={`${SHIFT_LABELS[booking.shift]} · ${booking.time_slot}`}
        />
        <Detail
          label="Therapist"
          value={booking.assigned_staff_name ?? "Being assigned"}
        />
        <Detail
          label="Fees"
          value={`Visit ${formatINR(booking.visit_fee)} · Machines ${formatINR(booking.machine_charge)}`}
        />
      </dl>

      {booking.condition_notes && (
        <p className="mt-4 rounded-xl bg-secondary/50 p-3 text-xs text-muted-foreground">
          {booking.condition_notes}
        </p>
      )}

      {cancellable && (
        <div className="mt-5 flex justify-end">
          <Button variant="ghost" size="sm" onClick={onCancel}>
            Cancel booking
          </Button>
        </div>
      )}
    </article>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-0.5 font-medium">{value}</dd>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Reports                                                             */
/* ------------------------------------------------------------------ */

function ReportsPanel() {
  const queryClient = useQueryClient();
  const reports = useQuery(myReportsQ());
  const fileRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [type, setType] = useState<ReportType>("Prescription");
  const [file, setFile] = useState<File | null>(null);

  const upload = useMutation({
    mutationFn: () => {
      if (!file) throw new Error("Choose a file first");
      return uploadReport({ title: title.trim(), report_type: type, file });
    },
    onSuccess: () => {
      toast.success("Report uploaded");
      setTitle("");
      setFile(null);
      if (fileRef.current) fileRef.current.value = "";
      queryClient.invalidateQueries({ queryKey: ["medical-reports", "mine"] });
    },
    onError: (e: Error) => toast.error(e.message || "Upload failed"),
  });

  const remove = useMutation({
    mutationFn: (id: string) => deleteReport(id),
    onSuccess: () => {
      toast.success("Report removed");
      queryClient.invalidateQueries({ queryKey: ["medical-reports", "mine"] });
    },
    onError: (e: Error) => toast.error(e.message || "Could not remove"),
  });

  return (
    <div className="grid gap-8 lg:grid-cols-[380px_1fr] lg:items-start">
      <div className="rounded-3xl border border-border/70 bg-card p-6">
        <div className="flex items-center gap-2.5">
          <FileUp className="h-5 w-5 text-primary" />
          <h2 className="font-display text-xl tracking-tight">Upload a report</h2>
        </div>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Prescriptions, X-Rays, MRI scans and medical reports. Your physiotherapist
          reviews each one before your visit.
        </p>

        <div className="mt-6 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="report-title">Title</Label>
            <Input
              id="report-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Knee X-Ray — March"
            />
          </div>

          <div className="space-y-1.5">
            <Label>Type</Label>
            <Select value={type} onValueChange={(v) => setType(v as ReportType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {REPORT_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="report-file">File</Label>
            <Input
              id="report-file"
              ref={fileRef}
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </div>

          <Button
            className="w-full rounded-full"
            disabled={upload.isPending || !file || title.trim().length < 2}
            onClick={() => upload.mutate()}
          >
            {upload.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Upload className="mr-2 h-4 w-4" />
            )}
            Upload
          </Button>
        </div>
      </div>

      <div>
        {reports.isLoading ? (
          <PanelLoading />
        ) : (reports.data?.items?.length ?? 0) === 0 ? (
          <EmptyPanel
            icon={<FileUp className="h-6 w-6 text-primary" />}
            title="No reports uploaded"
            body="Upload a prescription or scan so your therapist can prepare before the first visit."
          />
        ) : (
          <div className="grid gap-4">
            {reports.data!.items.map((r) => (
              <ReportCard key={r.id} report={r} onDelete={() => remove.mutate(r.id)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ReportCard({
  report,
  onDelete,
}: {
  report: MedicalReport;
  onDelete: () => void;
}) {
  const stageIndex = REPORT_STAGES.indexOf(report.status);
  return (
    <article className="rounded-3xl border border-border/70 bg-card p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-display text-lg tracking-tight">{report.title}</h3>
          <p className="text-xs text-muted-foreground">{report.report_type}</p>
        </div>
        <div className="flex items-center gap-1">
          {report.file?.url && (
            <a
              href={report.file.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition hover:bg-secondary hover:text-foreground"
              aria-label="Open report"
            >
              <Download className="h-4 w-4" />
            </a>
          )}
          <button
            type="button"
            onClick={onDelete}
            aria-label="Delete report"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Uploaded → Viewed → Reviewed */}
      <ol className="mt-5 flex items-center gap-2">
        {REPORT_STAGES.map((stage, i) => (
          <li key={stage} className="flex flex-1 items-center gap-2">
            <span
              className={cn(
                "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold",
                i <= stageIndex
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground",
              )}
            >
              {i + 1}
            </span>
            <span
              className={cn(
                "text-xs",
                i <= stageIndex ? "font-medium text-foreground" : "text-muted-foreground",
              )}
            >
              {stage}
            </span>
            {i < REPORT_STAGES.length - 1 && (
              <span
                className={cn(
                  "h-px flex-1",
                  i < stageIndex ? "bg-primary" : "bg-border",
                )}
              />
            )}
          </li>
        ))}
      </ol>

      {report.physio_notes && (
        <div className="mt-5 rounded-xl bg-primary-soft/50 p-4">
          <p className="text-[11px] uppercase tracking-wide text-primary">Physio notes</p>
          <p className="mt-1 text-sm text-foreground/80">{report.physio_notes}</p>
        </div>
      )}
    </article>
  );
}

/* ------------------------------------------------------------------ */

function PanelLoading() {
  return (
    <div className="flex min-h-[200px] items-center justify-center rounded-3xl border border-dashed border-border">
      <Loader2 className="h-5 w-5 animate-spin text-primary" />
    </div>
  );
}

function EmptyPanel({
  icon,
  title,
  body,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-dashed border-border bg-secondary/20 p-12 text-center">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary-soft">
        {icon}
      </div>
      <h3 className="mt-5 font-display text-xl tracking-tight">{title}</h3>
      <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">{body}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
