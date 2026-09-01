import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/services/api/auth.service";
import { apiFetch } from "@/lib/api/client";
import { toast } from "sonner";
import {
  Calendar,
  Clock,
  MapPin,
  Loader2,
  FileText,
  Eye,
  Download,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  X,
  StickyNote,
  CheckCircle2,
  Upload,
  Save,
  ClipboardList,
  User as UserIconLucide,
  Activity,
  ChevronLeft,
  Camera,
  Phone,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const Route = createFileRoute("/therapist/dashboard")({
  component: TherapistDashboard,
});

/* ──── Types ──── */
type ReportStatus = "Uploaded" | "Viewed" | "Reviewed";

interface MedicalReport {
  id: string;
  patient_id: string;
  title: string;
  report_type: string;
  file: { url: string; public_id?: string; format?: string; resource_type?: string };
  status: ReportStatus;
  physio_notes: string;
  reviewed_by_id?: string | null;
  created_at?: string;
}

interface AssignedBooking {
  id: string;
  reference: string;
  patient_id?: string;
  patient_name: string;
  contact_phone: string;
  contact_email?: string;
  service_name: string;
  preferred_date: string;
  preferred_time?: string;
  address: string;
  status: string;
}

/* ──── Helpers ──── */
const statusConfig: Record<string, { color: string; bg: string }> = {
  Uploaded: { color: "text-amber-600", bg: "bg-amber-500/10" },
  Viewed: { color: "text-blue-600", bg: "bg-blue-500/10" },
  Reviewed: { color: "text-green-600", bg: "bg-green-500/10" },
};

const reportTypeIcons: Record<string, string> = {
  Prescription: "💊",
  "X-Ray": "🦴",
  MRI: "🧠",
  "Medical Report": "📋",
};

function isImageUrl(url?: string): boolean {
  if (!url) return false;
  return /\.(jpeg|jpg|gif|png|webp)(\?|$)/i.test(url) || url.includes("/image/upload/");
}

const bookingStatusColors: Record<string, string> = {
  pending: "bg-amber-500/10 text-amber-600",
  approved: "bg-blue-500/10 text-blue-600",
  in_progress: "bg-indigo-500/10 text-indigo-600",
  completed: "bg-green-500/10 text-green-600",
  cancelled: "bg-red-500/10 text-red-600",
  rejected: "bg-red-500/10 text-red-600",
};

function TherapistDashboard() {
  const { user, setUser, logout } = useAuth();
  const queryClient = useQueryClient();

  /* ──── State ──── */
  const [activeTab, setActiveTab] = useState<"schedule" | "profile">("schedule");
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [selectedPatientName, setSelectedPatientName] = useState<string>("");
  const [previewReport, setPreviewReport] = useState<MedicalReport | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Review state
  const [reviewingReport, setReviewingReport] = useState<MedicalReport | null>(null);
  const [reviewStatus, setReviewStatus] = useState<ReportStatus>("Viewed");
  const [reviewNotes, setReviewNotes] = useState("");

  // Profile state
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [isUploading, setIsUploading] = useState(false);

  /* ──── Queries ──── */
  const { data: assignedBookings = [], isLoading: isLoadingBookings, isError: isErrorBookings, refetch: refetchBookings } = useQuery({
    queryKey: ["therapist", "assigned-bookings"],
    queryFn: () => apiFetch<AssignedBooking[]>("/auth/me/assigned-bookings"),
  });

  const { data: patientReports = [], isLoading: isLoadingReports, isError: isErrorReports, refetch: refetchReports } = useQuery({
    queryKey: ["therapist", "patient-reports", selectedPatientId],
    queryFn: () => apiFetch<MedicalReport[]>(`/auth/me/patient-reports/${selectedPatientId}`),
    enabled: Boolean(selectedPatientId),
  });

  /* ──── Unique patients from bookings ──── */
  const patients = (() => {
    const map = new Map<string, { id: string; name: string; phone: string; email?: string; bookingCount: number; latestBooking: string }>();
    for (const b of assignedBookings) {
      const pid = b.patient_id || b.contact_email || b.contact_phone;
      if (!pid) continue;
      const existing = map.get(pid);
      if (existing) {
        existing.bookingCount++;
      } else {
        map.set(pid, {
          id: pid,
          name: b.patient_name,
          phone: b.contact_phone,
          email: b.contact_email,
          bookingCount: 1,
          latestBooking: b.preferred_date,
        });
      }
    }
    return Array.from(map.values());
  })();

  /* ──── Mutations ──── */
  const reviewMut = useMutation({
    mutationFn: (data: { reportId: string; status: ReportStatus; physio_notes: string }) =>
      apiFetch(`/medical-reports/${data.reportId}/review`, {
        method: "PATCH",
        body: { status: data.status, physio_notes: data.physio_notes },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["therapist", "patient-reports"] });
      toast.success("Report reviewed successfully!");
      setReviewingReport(null);
    },
    onError: (err: any) => toast.error(err.message || "Failed to review report."),
  });

  const updateProfileMut = useMutation({
    mutationFn: authService.updateProfile,
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
      toast.success("Profile updated!");
    },
    onError: (err: any) => toast.error(err.message || "Failed to update profile."),
  });

  const [isUploadingDoc, setIsUploadingDoc] = useState(false);
  const [docTitle, setDocTitle] = useState("");

  const uploadDocMut = useMutation({
    mutationFn: (data: { title: string; file: File }) => authService.addDocument(data.title, data.file),
    onSuccess: () => {
      authService.me().then(setUser);
      toast.success("Document uploaded!");
      setDocTitle("");
      setIsUploadingDoc(false);
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to upload document.");
      setIsUploadingDoc(false);
    },
  });

  const deleteDocMut = useMutation({
    mutationFn: authService.deleteDocument,
    onSuccess: () => {
      authService.me().then(setUser);
      toast.success("Document deleted.");
    },
    onError: (err: any) => toast.error(err.message || "Failed to delete document."),
  });

  const handleDocChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!docTitle.trim()) {
      toast.error("Please enter a document title first.");
      e.target.value = "";
      return;
    }
    setIsUploadingDoc(true);
    uploadDocMut.mutate({ title: docTitle, file });
    e.target.value = "";
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const updatedUser = await authService.uploadAvatar(file);
      setUser(updatedUser);
      toast.success("Profile picture updated!");
    } catch (err: any) {
      toast.error(err.message || "Failed to upload picture.");
    } finally {
      setIsUploading(false);
    }
  };

  const openReview = (r: MedicalReport) => {
    setReviewingReport(r);
    setReviewStatus(r.status === "Uploaded" ? "Viewed" : r.status);
    setReviewNotes(r.physio_notes || "");
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewingReport) return;
    reviewMut.mutate({
      reportId: reviewingReport.id,
      status: reviewStatus,
      physio_notes: reviewNotes,
    });
  };

  const openPreview = (r: MedicalReport) => {
    setZoomLevel(1);
    setPreviewReport(r);
  };

  const selectPatient = (pid: string, pname: string) => {
    setSelectedPatientId(pid);
    setSelectedPatientName(pname);
  };

  return (
    <div className="container-x py-24 md:py-32">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Therapist Dashboard</h1>
            <p className="mt-2 text-muted-foreground">Welcome back, {user?.name}! Manage your patients and review medical reports.</p>
          </div>
          <button onClick={logout} className="px-5 py-2 rounded-xl text-sm font-medium border border-border hover:bg-muted transition-colors">
            Sign Out
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-1 p-1 rounded-2xl bg-muted/50 border border-border">
          <button
            onClick={() => setActiveTab("schedule")}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === "schedule" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <ClipboardList className="h-4 w-4" /> Patients & Reports
            {patients.length > 0 && (
              <span className="ml-1 inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold">
                {patients.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === "profile" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <UserIconLucide className="h-4 w-4" /> My Profile
          </button>
        </div>

        {/* ═══════ Schedule & Patients Tab ═══════ */}
        {activeTab === "schedule" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Patient List */}
            <div className="lg:col-span-1">
              <div className="rounded-3xl border border-border bg-surface shadow-sm overflow-hidden">
                <div className="p-5 border-b border-border/50 bg-background/50">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <UserIconLucide className="h-4.5 w-4.5 text-primary" /> Assigned Patients
                  </h2>
                </div>
                <div className="p-4">
                  {isLoadingBookings ? (
                    <div className="flex items-center justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
                  ) : isErrorBookings ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <p className="text-xs text-red-500 font-medium mb-2">Failed to load assigned patients.</p>
                      <button onClick={() => refetchBookings()} className="px-3 py-1 text-xs font-medium rounded-md bg-primary text-primary-foreground">Retry</button>
                    </div>
                  ) : patients.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                        <Activity className="h-7 w-7 text-primary" />
                      </div>
                      <h3 className="text-sm font-medium text-foreground">No patients assigned</h3>
                      <p className="text-xs text-muted-foreground mt-1">Patients will appear here once bookings are assigned to you.</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {patients.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => selectPatient(p.id, p.name)}
                          className={`w-full text-left p-4 rounded-2xl border transition-all ${
                            selectedPatientId === p.id
                              ? "border-primary bg-primary/5 shadow-sm"
                              : "border-border/60 hover:border-primary/30 hover:bg-muted/30"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                              <span className="text-sm font-bold text-primary">{p.name.charAt(0).toUpperCase()}</span>
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-sm text-foreground truncate">{p.name}</p>
                              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                <Phone className="h-3 w-3" /> {p.phone}
                              </p>
                            </div>
                          </div>
                          <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                            <span className="inline-flex items-center gap-1 rounded-full bg-primary/5 px-2 py-0.5 font-medium text-primary">
                              {p.bookingCount} booking{p.bookingCount > 1 ? "s" : ""}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Patient Reports */}
            <div className="lg:col-span-2">
              {!selectedPatientId ? (
                <div className="rounded-3xl border border-border bg-surface shadow-sm overflow-hidden p-8 flex flex-col items-center justify-center text-center min-h-[400px]">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <FileText className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium text-foreground">Select a Patient</h3>
                  <p className="text-sm text-muted-foreground mt-2 max-w-sm">
                    Choose a patient from the left panel to view and review their medical reports, prescriptions, and documents.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Patient Header */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => { setSelectedPatientId(null); setSelectedPatientName(""); }}
                      className="p-2 rounded-xl hover:bg-muted transition-colors lg:hidden"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">{selectedPatientName.charAt(0).toUpperCase()}</span>
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold">{selectedPatientName}</h2>
                      <p className="text-xs text-muted-foreground">Medical Reports & Documents</p>
                    </div>
                  </div>

                  {/* Reports Grid */}
                  <div className="rounded-3xl border border-border bg-surface shadow-sm overflow-hidden">
                    <div className="p-6">
                      {isLoadingReports ? (
                        <div className="flex items-center justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
                      ) : patientReports.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                          <FileText className="h-12 w-12 text-muted-foreground mb-3" />
                          <h3 className="text-sm font-medium text-foreground">No reports uploaded</h3>
                          <p className="text-xs text-muted-foreground mt-1">This patient hasn't uploaded any medical reports yet.</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {patientReports.map((report) => {
                            const st = statusConfig[report.status] || statusConfig.Uploaded;
                            return (
                              <div key={report.id} className="group rounded-2xl border border-border/60 overflow-hidden hover:border-primary/30 hover:shadow-md transition-all">
                                {/* Thumbnail */}
                                <button onClick={() => openPreview(report)} className="w-full h-36 bg-muted/30 flex items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors relative overflow-hidden">
                                  {isImageUrl(report.file?.url) ? (
                                    <img src={report.file.url} alt={report.title} className="w-full h-full object-cover" />
                                  ) : (
                                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                      <FileText className="h-10 w-10" />
                                      <span className="text-xs uppercase tracking-wider font-medium">{report.file?.format || "PDF"}</span>
                                    </div>
                                  )}
                                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                                    <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 text-black text-xs font-semibold shadow">
                                      <Eye className="h-3.5 w-3.5" /> Preview
                                    </span>
                                  </div>
                                </button>

                                {/* Info */}
                                <div className="p-4 space-y-3">
                                  <div className="flex items-start justify-between gap-2">
                                    <div className="min-w-0">
                                      <h4 className="font-semibold text-sm truncate">{report.title}</h4>
                                      <p className="text-xs text-muted-foreground mt-0.5">
                                        {report.created_at ? new Date(report.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : ""}
                                      </p>
                                    </div>
                                    <span className="text-lg">{reportTypeIcons[report.report_type] || "📋"}</span>
                                  </div>

                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="inline-flex items-center rounded-full border border-border px-2 py-0.5 text-xs font-medium text-muted-foreground">{report.report_type}</span>
                                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${st.bg} ${st.color}`}>
                                      {report.status}
                                    </span>
                                  </div>

                                  {report.physio_notes && (
                                    <div className="rounded-xl bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 p-3">
                                      <p className="text-xs font-semibold text-green-700 dark:text-green-400 flex items-center gap-1.5 mb-1">
                                        <StickyNote className="h-3 w-3" /> Your Notes
                                      </p>
                                      <p className="text-xs text-green-800 dark:text-green-300 leading-relaxed line-clamp-2">{report.physio_notes}</p>
                                    </div>
                                  )}

                                  <div className="flex items-center gap-2 pt-1">
                                    <button onClick={() => window.open(report.file?.url, "_blank")} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted/50 hover:bg-muted text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
                                      <Download className="h-3.5 w-3.5" /> Download
                                    </button>
                                    <button onClick={() => openReview(report)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-xs font-semibold text-primary transition-colors ml-auto">
                                      <StickyNote className="h-3.5 w-3.5" /> Review
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ═══════ Profile Tab ═══════ */}
        {activeTab === "profile" && (
          <div className="max-w-md mx-auto">
            <div className="rounded-3xl border border-border bg-surface shadow-sm overflow-hidden p-6 md:p-8">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <UserIconLucide className="h-5 w-5 text-primary" /> My Profile
              </h2>

              <div className="flex flex-col items-center mb-8">
                <div className="relative group">
                  <Avatar className="h-28 w-28 border-4 border-background shadow-md">
                    <AvatarImage src={user?.avatar?.url} alt={user?.name || "Therapist"} className="object-cover" />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold text-2xl">
                      {user?.name?.charAt(0).toUpperCase() || "T"}
                    </AvatarFallback>
                  </Avatar>
                  <label className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full shadow-lg cursor-pointer hover:scale-105 transition-transform">
                    {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
                    <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} disabled={isUploading} />
                  </label>
                </div>
                <p className="mt-4 font-medium text-foreground">{user?.email}</p>
                <div className="mt-1 inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                  Therapist
                </div>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); updateProfileMut.mutate({ name, phone }); }} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="flex h-10 w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Mobile Number</label>
                  <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="flex h-10 w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2" />
                </div>
                <button type="submit" disabled={updateProfileMut.isPending} className="w-full mt-4 flex h-10 items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-50">
                  {updateProfileMut.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Save Changes
                </button>
              </form>
            </div>

            {/* Documents Section */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-border">
              <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-slate-800">Documents & Certifications</h2>
                  <p className="text-sm text-muted-foreground mt-1">Manage your uploaded certificates. Admin will verify them.</p>
                </div>
              </div>

              <div className="space-y-4">
                {(user?.documents || []).length === 0 ? (
                  <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <FileText className="h-8 w-8 mx-auto text-slate-400 mb-2" />
                    <p className="text-sm text-slate-500">No documents uploaded yet.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {user?.documents?.map((doc) => (
                      <div key={doc.id} className="p-4 rounded-2xl border border-border bg-slate-50/50 flex flex-col gap-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                              <FileText className="h-4 w-4 text-primary" />
                            </div>
                            <div className="min-w-0">
                              <h4 className="text-sm font-medium text-slate-800 truncate" title={doc.title}>{doc.title}</h4>
                              <p className="text-xs text-muted-foreground">{new Date(doc.uploaded_at).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              if (confirm("Delete this document?")) deleteDocMut.mutate(doc.id);
                            }}
                            className="p-1.5 text-slate-400 hover:text-destructive transition-colors shrink-0"
                            title="Delete"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="flex items-center justify-between mt-auto pt-2 border-t border-border/50">
                          <div className="flex items-center gap-1.5">
                            {doc.is_verified ? (
                              <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                                <CheckCircle2 className="h-3 w-3" /> Verified
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                                <Clock className="h-3 w-3" /> Pending
                              </span>
                            )}
                          </div>
                          <a href={doc.file.url} target="_blank" rel="noreferrer" className="text-xs font-medium text-primary hover:underline flex items-center gap-1">
                            View <Eye className="h-3 w-3" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="pt-4 border-t border-border mt-4">
                  <h4 className="text-sm font-medium mb-3">Upload New Document</h4>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      placeholder="e.g. Master's Degree"
                      value={docTitle}
                      onChange={(e) => setDocTitle(e.target.value)}
                      className="flex h-10 w-full sm:max-w-xs rounded-xl border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                    />
                    <div className="relative">
                      <input
                        type="file"
                        id="doc-upload"
                        className="peer sr-only"
                        onChange={handleDocChange}
                        accept=".pdf,.png,.jpg,.jpeg"
                        disabled={isUploadingDoc}
                      />
                      <label
                        htmlFor="doc-upload"
                        className="cursor-pointer flex h-10 items-center justify-center gap-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 px-4 text-sm font-semibold transition-all peer-disabled:opacity-50 peer-disabled:cursor-not-allowed"
                      >
                        {isUploadingDoc ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                        {isUploadingDoc ? "Uploading..." : "Select File"}
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ═══════ REVIEW MODAL ═══════ */}
      {reviewingReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setReviewingReport(null)}>
          <div className="relative w-full max-w-md bg-background rounded-3xl border border-border shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-border/50">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Review Report</h3>
                <button onClick={() => setReviewingReport(null)} className="p-1.5 rounded-full hover:bg-muted transition-colors"><X className="h-4 w-4" /></button>
              </div>
              <p className="text-sm text-muted-foreground mt-1">Update the status and add your clinical notes for "{reviewingReport.title}".</p>
            </div>
            <form onSubmit={handleReviewSubmit} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <select value={reviewStatus} onChange={(e) => setReviewStatus(e.target.value as ReportStatus)} className="flex h-10 w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
                  <option value="Uploaded">Uploaded</option>
                  <option value="Viewed">Viewed</option>
                  <option value="Reviewed">Reviewed</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Physio Notes</label>
                <textarea value={reviewNotes} onChange={(e) => setReviewNotes(e.target.value)} rows={5} placeholder="Enter your clinical observations, recommendations, and notes..." className="flex w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 resize-none" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setReviewingReport(null)} className="flex-1 h-10 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors">Cancel</button>
                <button type="submit" disabled={reviewMut.isPending} className="flex-1 h-10 flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition-all">
                  {reviewMut.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                  Save Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══════ PREVIEW MODAL ═══════ */}
      {previewReport && (
        <div className="fixed inset-0 z-50 flex flex-col bg-black/90 backdrop-blur-md" onClick={() => setPreviewReport(null)}>
          <div className="flex items-center justify-between px-4 py-3 bg-black/50" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-sm font-semibold text-white truncate">{previewReport.title}</span>
              <span className="inline-flex items-center rounded-full border border-white/20 px-2 py-0.5 text-xs text-white/70">{previewReport.report_type}</span>
            </div>
            <div className="flex items-center gap-2">
              {isImageUrl(previewReport.file?.url) && (
                <>
                  <button onClick={(e) => { e.stopPropagation(); setZoomLevel((z) => Math.max(0.25, z - 0.25)); }} className="p-2 rounded-lg hover:bg-white/10 text-white transition-colors"><ZoomOut className="h-4 w-4" /></button>
                  <span className="text-xs text-white/70 min-w-[3rem] text-center">{Math.round(zoomLevel * 100)}%</span>
                  <button onClick={(e) => { e.stopPropagation(); setZoomLevel((z) => Math.min(5, z + 0.25)); }} className="p-2 rounded-lg hover:bg-white/10 text-white transition-colors"><ZoomIn className="h-4 w-4" /></button>
                  <button onClick={(e) => { e.stopPropagation(); setZoomLevel(1); }} className="p-2 rounded-lg hover:bg-white/10 text-white transition-colors"><RotateCcw className="h-4 w-4" /></button>
                  <div className="w-px h-5 bg-white/20 mx-1" />
                </>
              )}
              <button onClick={(e) => { e.stopPropagation(); window.open(previewReport.file?.url, "_blank"); }} className="p-2 rounded-lg hover:bg-white/10 text-white transition-colors"><Download className="h-4 w-4" /></button>
              <button onClick={() => setPreviewReport(null)} className="p-2 rounded-lg hover:bg-white/10 text-white transition-colors"><X className="h-4 w-4" /></button>
            </div>
          </div>
          <div className="flex-1 overflow-auto flex items-center justify-center p-4" onClick={(e) => e.stopPropagation()}>
            {isImageUrl(previewReport.file?.url) ? (
              <img src={previewReport.file.url} alt={previewReport.title} style={{ transform: `scale(${zoomLevel})`, transformOrigin: "center center", transition: "transform 0.2s ease" }} className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" draggable={false} />
            ) : (
              <div className="w-full max-w-3xl h-full">
                <iframe src={previewReport.file?.url} className="w-full h-full rounded-lg border-0 bg-white" title="PDF Preview" />
              </div>
            )}
          </div>
          {previewReport.physio_notes && (
            <div className="px-4 py-3 bg-green-900/50 border-t border-green-500/20" onClick={(e) => e.stopPropagation()}>
              <p className="text-xs font-semibold text-green-300 flex items-center gap-1.5 mb-1"><StickyNote className="h-3 w-3" /> Physio Notes</p>
              <p className="text-sm text-green-100 leading-relaxed">{previewReport.physio_notes}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
