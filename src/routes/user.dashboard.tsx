import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  Camera,
  CalendarDays,
  Download,
  FileUp,
  Loader2,
  Plus,
  Trash2,
  Upload,
  UserRound,
} from "lucide-react";

import { authService } from "@/services/api/auth.service";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
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

type DashboardTab = "bookings" | "reports" | "profile";

export const Route = createFileRoute("/user/dashboard")({
  head: () => ({
    meta: [{ title: "My dashboard — Home Physio India" }],
  }),
  validateSearch: (search: Record<string, unknown>): { tab?: DashboardTab } => {
    const tab = search.tab;
    return tab === "bookings" || tab === "reports" || tab === "profile"
      ? { tab }
      : {};
  },
  component: PatientDashboard,
});

const HERO_BG =
  "radial-gradient(55% 55% at 15% 10%, color-mix(in oklab, var(--primary) 42%, transparent), transparent 70%), radial-gradient(50% 50% at 90% 15%, color-mix(in oklab, var(--accent) 32%, transparent), transparent 70%), linear-gradient(135deg, var(--accent), color-mix(in oklab, var(--primary) 80%, black 14%))";

function PatientDashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const bookings = useQuery({ ...myBookingsQ(), enabled: isAuthenticated });
  const reports = useQuery({ ...myReportsQ(), enabled: isAuthenticated });

  const [tab, setTab] = useState<DashboardTab>(search.tab ?? "bookings");
  useEffect(() => {
    if (search.tab && search.tab !== tab) setTab(search.tab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search.tab]);

  const changeTab = (next: string) => {
    const t = next as DashboardTab;
    setTab(t);
    navigate({ search: t === "bookings" ? {} : { tab: t }, replace: true });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container-x flex min-h-screen items-center justify-center pt-28">
        <div className="w-full max-w-sm rounded-3xl border border-border/60 bg-card p-8 text-center shadow-elegant">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary-soft">
            <CalendarDays className="h-6 w-6 text-primary" />
          </div>
          <h1 className="mt-5 font-display text-2xl tracking-tight">Sign in to continue</h1>
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

  const items = bookings.data?.items ?? [];
  const activeCount = items.filter((b) =>
    ["pending", "approved", "confirmed", "assigned", "in_progress"].includes(b.status),
  ).length;
  const reportCount = reports.data?.items?.length ?? 0;

  const stats = [
    { label: "Total bookings", value: items.length },
    { label: "Active visits", value: activeCount },
    { label: "Reports on file", value: reportCount },
  ];

  return (
    <div className="min-h-screen bg-secondary/20">
      {/* ── Premium account hero ─────────────────────────────── */}
      <section className="relative isolate overflow-hidden" style={{ background: HERO_BG }}>
        <div className="pointer-events-none absolute inset-0 -z-10 opacity-40 mix-blend-overlay bg-[radial-gradient(circle_at_20%_15%,white,transparent_45%)]" />
        <div className="container-x relative pt-32 pb-24 text-white lg:pt-40">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="min-w-0">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/90 backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-white" />
                Your account
              </div>
              <h1 className="mt-4 font-display text-4xl font-bold leading-[1.05] tracking-tight md:text-5xl">
                Hello, {user?.name?.split(" ")[0] ?? "there"}
              </h1>
              <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-white/85">
                Track your visits, upload prescriptions and follow their review status —
                all in one place.
              </p>
            </div>
            <Link
              to="/booking"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-primary shadow-lg transition hover:scale-[1.03] hover:bg-white/95"
            >
              <Plus className="h-4 w-4" />
              New booking
            </Link>
          </div>

          <dl className="mt-9 grid grid-cols-3 gap-3 sm:max-w-xl">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3.5 backdrop-blur-md"
              >
                <dt className="text-[11px] font-medium uppercase tracking-wide text-white/70">
                  {s.label}
                </dt>
                <dd className="mt-1 font-display text-2xl font-semibold sm:text-3xl">
                  {s.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── Content lifts over the hero ──────────────────────── */}
      <div className="container-x relative -mt-8 pb-20">
        <Tabs value={tab} onValueChange={changeTab}>
          <div className="inline-flex max-w-full overflow-x-auto rounded-full border border-border/60 bg-card p-1 shadow-elegant">
            <TabsList className="bg-transparent">
              <TabsTrigger value="bookings">Bookings</TabsTrigger>
              <TabsTrigger value="reports">Reports &amp; prescriptions</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="bookings" className="mt-8">
            <BookingsPanel />
          </TabsContent>

          <TabsContent value="reports" className="mt-8">
            <ReportsPanel />
          </TabsContent>

          <TabsContent value="profile" className="mt-8">
            <ProfilePanel />
          </TabsContent>
        </Tabs>
      </div>
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
    <article className="group rounded-3xl border border-border/60 bg-card p-5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-elegant sm:p-6">
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
    <article className="group rounded-3xl border border-border/60 bg-card p-5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-elegant sm:p-6">
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
/* Profile                                                             */
/* ------------------------------------------------------------------ */

const GENDERS = ["male", "female", "other"] as const;

function ProfilePanel() {
  const { user, setUser } = useAuth();
  const avatarRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: user?.name ?? "",
    phone: user?.phone ?? "",
    age: user?.age != null ? String(user.age) : "",
    gender: user?.gender ?? "",
    pincode: user?.pincode ?? "",
    address: user?.address ?? "",
    medical_condition: user?.medical_condition ?? "",
  });

  const set = (k: keyof typeof form, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const save = useMutation({
    mutationFn: () =>
      authService.updateProfile({
        name: form.name.trim() || undefined,
        phone: form.phone.trim() || undefined,
        age: form.age.trim() ? Number(form.age) : undefined,
        gender: form.gender || undefined,
        pincode: form.pincode.trim() || undefined,
        address: form.address.trim() || undefined,
        medical_condition: form.medical_condition.trim() || undefined,
      }),
    onSuccess: (updated) => {
      setUser(updated);
      toast.success("Profile updated");
    },
    onError: (e: Error) => toast.error(e.message || "Could not save profile"),
  });

  const avatar = useMutation({
    mutationFn: (file: File) => authService.uploadAvatar(file),
    onSuccess: (updated) => {
      setUser(updated);
      toast.success("Photo updated");
    },
    onError: (e: Error) => toast.error(e.message || "Upload failed"),
  });

  return (
    <div className="grid gap-8 lg:grid-cols-[320px_1fr] lg:items-start">
      {/* Avatar + identity card */}
      <div className="rounded-3xl border border-border/60 bg-card p-6 text-center shadow-sm">
        <div className="relative mx-auto w-fit">
          <Avatar className="h-28 w-28 border-4 border-primary-soft shadow-sm">
            <AvatarImage src={user?.avatar?.url} alt={user?.name || "You"} className="object-cover" />
            <AvatarFallback className="bg-primary/10 text-2xl font-semibold text-primary">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <button
            type="button"
            onClick={() => avatarRef.current?.click()}
            disabled={avatar.isPending}
            className="absolute -bottom-1 -right-1 grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground shadow-md transition hover:opacity-90 disabled:opacity-60"
            aria-label="Change photo"
          >
            {avatar.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Camera className="h-4 w-4" />
            )}
          </button>
          <input
            ref={avatarRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) avatar.mutate(f);
              if (avatarRef.current) avatarRef.current.value = "";
            }}
          />
        </div>
        <h3 className="mt-4 font-display text-xl tracking-tight">{user?.name}</h3>
        <p className="mt-0.5 text-sm text-muted-foreground">{user?.email}</p>
        <p className="mt-4 rounded-xl bg-secondary/40 p-3 text-xs text-muted-foreground">
          A clear photo and up-to-date details help your therapist prepare for the visit.
        </p>
      </div>

      {/* Editable fields */}
      <div className="rounded-3xl border border-border/60 bg-card p-6 shadow-sm sm:p-8">
        <div className="flex items-center gap-2.5">
          <UserRound className="h-5 w-5 text-primary" />
          <h2 className="font-display text-xl tracking-tight">Personal details</h2>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="p-name">Full name</Label>
            <Input id="p-name" value={form.name} onChange={(e) => set("name", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="p-phone">Phone</Label>
            <Input id="p-phone" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="10-digit mobile" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="p-age">Age</Label>
            <Input id="p-age" type="number" min={0} max={120} value={form.age} onChange={(e) => set("age", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Gender</Label>
            <Select value={form.gender} onValueChange={(v) => set("gender", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {GENDERS.map((g) => (
                  <SelectItem key={g} value={g} className="capitalize">
                    {g}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="p-pin">Pincode</Label>
            <Input id="p-pin" value={form.pincode} onChange={(e) => set("pincode", e.target.value)} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="p-addr">Address</Label>
            <Textarea id="p-addr" rows={2} value={form.address} onChange={(e) => set("address", e.target.value)} placeholder="Where should the therapist visit?" />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="p-cond">Medical condition / notes</Label>
            <Textarea id="p-cond" rows={3} value={form.medical_condition} onChange={(e) => set("medical_condition", e.target.value)} placeholder="Anything your therapist should know before the visit." />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button className="rounded-full px-6" disabled={save.isPending} onClick={() => save.mutate()}>
            {save.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save changes
          </Button>
        </div>
      </div>
    </div>
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
