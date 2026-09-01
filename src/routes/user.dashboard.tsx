import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useRef, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/services/api/auth.service";
import {
  medicalReportsService,
  type MedicalReport,
  type ReportType,
} from "@/services/api/medical-reports.service";
import { therapistService } from "@/services/api/therapist.service";
import { toast } from "sonner";
import {
  Camera,
  Loader2,
  Save,
  Calendar,
  Clock,
  MapPin,
  Activity,
  FileText,
  Upload,
  Eye,
  Download,
  Trash2,
  Pencil,
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ClipboardList,
  StickyNote,
  CheckCircle2,
  AlertCircle,
  Search,
  Users,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const Route = createFileRoute("/user/dashboard")({
  component: UserDashboard,
});

/* ──── Status helpers ──── */
const statusConfig: Record<string, { color: string; bg: string; icon: typeof CheckCircle2 }> = {
  Uploaded: { color: "text-amber-600", bg: "bg-amber-500/10", icon: Upload },
  Viewed: { color: "text-blue-600", bg: "bg-blue-500/10", icon: Eye },
  Reviewed: { color: "text-green-600", bg: "bg-green-500/10", icon: CheckCircle2 },
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

function UserDashboard() {
  const { user, setUser } = useAuth();
  const queryClient = useQueryClient();

  /* ──── Profile Form State ──── */
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [address, setAddress] = useState(user?.address || "");
  const [isUploading, setIsUploading] = useState(false);

  /* ──── Active Tab ──── */
  const [activeTab, setActiveTab] = useState<"bookings" | "reports" | "therapists">("bookings");

  /* ──── Therapists Search State ──── */
  const [therapistSearch, setTherapistSearch] = useState("");
  const [therapistSpecialization, setTherapistSpecialization] = useState("");

  /* ──── Medical Report Modals ──── */
  const [uploadOpen, setUploadOpen] = useState(false);
  const [previewReport, setPreviewReport] = useState<MedicalReport | null>(null);
  const [editReport, setEditReport] = useState<MedicalReport | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MedicalReport | null>(null);

  /* ──── Upload Form ──── */
  const [reportTitle, setReportTitle] = useState("");
  const [reportType, setReportType] = useState<ReportType>("Prescription");
  const [reportFile, setReportFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ──── Edit Form ──── */
  const [editTitle, setEditTitle] = useState("");
  const [editType, setEditType] = useState<ReportType>("Prescription");
  const [editFile, setEditFile] = useState<File | null>(null);
  const editFileRef = useRef<HTMLInputElement>(null);

  /* ──── Preview Zoom ──── */
  const [zoomLevel, setZoomLevel] = useState(1);

  /* ──── Queries ──── */
  const { data: bookings = [], isLoading: isLoadingBookings } = useQuery({
    queryKey: ["myBookings"],
    queryFn: authService.getBookings,
  });

  const { data: reports = [], isLoading: isLoadingReports } = useQuery({
    queryKey: ["myReports"],
    queryFn: medicalReportsService.list,
  });

  const { data: therapistsData, isLoading: isLoadingTherapists } = useQuery({
    queryKey: ["therapists", therapistSearch, therapistSpecialization],
    queryFn: () => therapistService.list({ search: therapistSearch || undefined, specialization: therapistSpecialization || undefined }),
  });

  /* ──── Profile Mutations ──── */
  const updateProfileMut = useMutation({
    mutationFn: authService.updateProfile,
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
      toast.success("Profile updated successfully!");
    },
    onError: (err: any) => toast.error(err.message || "Failed to update profile."),
  });

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

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMut.mutate({ name, phone, address });
  };

  /* ──── Report Mutations ──── */
  const uploadMut = useMutation({
    mutationFn: medicalReportsService.upload,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myReports"] });
      toast.success("Report uploaded successfully!");
      resetUploadForm();
    },
    onError: (err: any) => toast.error(err.message || "Failed to upload report."),
  });

  const updateMut = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { title?: string; report_type?: string; file?: File } }) =>
      medicalReportsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myReports"] });
      toast.success("Report updated successfully!");
      setEditReport(null);
    },
    onError: (err: any) => toast.error(err.message || "Failed to update report."),
  });

  const deleteMut = useMutation({
    mutationFn: medicalReportsService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myReports"] });
      toast.success("Report deleted successfully!");
      setDeleteTarget(null);
    },
    onError: (err: any) => toast.error(err.message || "Failed to delete report."),
  });

  /* ──── Form Helpers ──── */
  const resetUploadForm = useCallback(() => {
    setReportTitle("");
    setReportType("Prescription");
    setReportFile(null);
    setUploadOpen(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportFile) return toast.error("Please select a file.");
    uploadMut.mutate({ title: reportTitle, report_type: reportType, file: reportFile });
  };

  const openEdit = (r: MedicalReport) => {
    setEditReport(r);
    setEditTitle(r.title);
    setEditType(r.report_type);
    setEditFile(null);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editReport) return;
    updateMut.mutate({
      id: editReport.id,
      data: {
        title: editTitle || undefined,
        report_type: editType || undefined,
        file: editFile || undefined,
      },
    });
  };

  const openPreview = (r: MedicalReport) => {
    setZoomLevel(1);
    setPreviewReport(r);
  };

  return (
    <div className="container-x py-24 md:py-32">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Patient Dashboard</h1>
            <p className="mt-2 text-muted-foreground">Manage your profile, medical reports, and track your healthcare bookings.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Profile Settings */}
          <div className="lg:col-span-1 space-y-8">
            <div className="rounded-3xl border border-border bg-surface shadow-sm overflow-hidden p-6 md:p-8">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <UserIcon className="h-5 w-5 text-primary" /> Profile Settings
              </h2>

              <div className="flex flex-col items-center mb-8">
                <div className="relative group">
                  <Avatar className="h-28 w-28 border-4 border-background shadow-md">
                    <AvatarImage src={user?.avatar?.url} alt={user?.name || "User"} className="object-cover" />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold text-2xl">
                      {user?.name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <label className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full shadow-lg cursor-pointer hover:scale-105 transition-transform group-hover:bg-primary/90">
                    {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
                    <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} disabled={isUploading} />
                  </label>
                </div>
                <p className="mt-4 font-medium text-foreground">{user?.email}</p>
                <div className="mt-1 inline-flex items-center rounded-full bg-green-500/10 px-2.5 py-0.5 text-xs font-semibold text-green-600">
                  Verified Account
                </div>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="flex h-10 w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Mobile Number</label>
                  <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="flex h-10 w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Detailed Address</label>
                  <textarea value={address} onChange={(e) => setAddress(e.target.value)} rows={3} className="flex w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 resize-none" placeholder="Enter your complete address..." />
                </div>
                <button type="submit" disabled={updateProfileMut.isPending} className="w-full mt-4 flex h-10 items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-50">
                  {updateProfileMut.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Save Changes
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Tabs */}
          <div className="lg:col-span-2 space-y-8">
            {/* Tab Switcher */}
            <div className="flex gap-1 p-1 rounded-2xl bg-muted/50 border border-border overflow-x-auto hide-scrollbar">
              <button
                onClick={() => setActiveTab("bookings")}
                className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === "bookings"
                    ? "bg-background shadow-sm text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Calendar className="h-4 w-4 shrink-0" /> <span className="whitespace-nowrap">Bookings</span>
              </button>
              <button
                onClick={() => setActiveTab("reports")}
                className={`flex-1 min-w-[150px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === "reports"
                    ? "bg-background shadow-sm text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <ClipboardList className="h-4 w-4 shrink-0" /> <span className="whitespace-nowrap">Medical Reports</span>
                {reports.length > 0 && (
                  <span className="ml-1 inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold">
                    {reports.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab("therapists")}
                className={`flex-1 min-w-[130px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === "therapists"
                    ? "bg-background shadow-sm text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Users className="h-4 w-4 shrink-0" /> <span className="whitespace-nowrap">Therapists</span>
              </button>
            </div>

            {/* ═══════ Bookings Tab ═══════ */}
            {activeTab === "bookings" && (
              <div className="rounded-3xl border border-border bg-surface shadow-sm overflow-hidden">
                <div className="p-6 md:p-8 border-b border-border/50 bg-background/50 flex justify-between items-center">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" /> Booking History
                  </h2>
                </div>
                <div className="p-6 md:p-8">
                  {isLoadingBookings ? (
                    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                      <Loader2 className="h-8 w-8 animate-spin mb-4" />
                      <p>Loading your appointments...</p>
                    </div>
                  ) : bookings.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        <Activity className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-lg font-medium text-foreground">No bookings yet</h3>
                      <p className="text-sm text-muted-foreground mt-2 max-w-sm">
                        You haven't made any appointments. Book a trusted healthcare professional to your home today.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {bookings.map((booking: any) => (
                        <div key={booking.id} className="p-5 rounded-2xl border border-border/60 hover:border-primary/30 hover:bg-primary-soft/30 transition-colors">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="space-y-1">
                              <h3 className="font-semibold text-foreground text-lg">{booking.service_name}</h3>
                              <p className="text-sm text-muted-foreground">For: {booking.patient_name}</p>
                              <div className="flex items-center gap-4 mt-2 text-xs font-medium text-muted-foreground">
                                <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> {new Date(booking.preferred_date).toLocaleDateString()}</span>
                                {booking.preferred_time && <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {booking.preferred_time}</span>}
                              </div>
                              <p className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground line-clamp-1"><MapPin className="h-3 w-3 shrink-0" /> {booking.address}</p>
                            </div>
                            <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center">
                              <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                                booking.status === "PENDING" ? "bg-amber-500/10 text-amber-600" :
                                booking.status === "CONFIRMED" ? "bg-blue-500/10 text-blue-600" :
                                booking.status === "COMPLETED" ? "bg-green-500/10 text-green-600" :
                                "bg-red-500/10 text-red-600"
                              }`}>
                                {booking.status}
                              </span>
                              <span className="text-[10px] text-muted-foreground mt-1 uppercase tracking-widest">{booking.reference}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ═══════ Medical Reports Tab ═══════ */}
            {activeTab === "reports" && (
              <div className="space-y-6">
                {/* Upload Button */}
                <div className="flex justify-end">
                  <button
                    onClick={() => setUploadOpen(true)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold shadow-md hover:opacity-90 transition-all"
                  >
                    <Upload className="h-4 w-4" /> Upload Report
                  </button>
                </div>

                {/* Reports List */}
                <div className="rounded-3xl border border-border bg-surface shadow-sm overflow-hidden">
                  <div className="p-6 md:p-8 border-b border-border/50 bg-background/50">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" /> Your Medical Reports
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">Upload and manage your prescriptions, X-rays, MRIs, and medical documents.</p>
                  </div>

                  <div className="p-6 md:p-8">
                    {isLoadingReports ? (
                      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                        <Loader2 className="h-8 w-8 animate-spin mb-4" />
                        <p>Loading your reports...</p>
                      </div>
                    ) : reports.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                          <FileText className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="text-lg font-medium text-foreground">No reports uploaded</h3>
                        <p className="text-sm text-muted-foreground mt-2 max-w-sm">
                          Upload your prescriptions, X-rays, MRIs, and other medical documents to share with your healthcare team.
                        </p>
                        <button onClick={() => setUploadOpen(true)} className="mt-4 px-5 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-all">
                          Upload Your First Report
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {reports.map((report) => {
                          const st = statusConfig[report.status] || statusConfig.Uploaded;
                          const StatusIcon = st.icon;
                          return (
                            <div key={report.id} className="group relative rounded-2xl border border-border/60 overflow-hidden hover:border-primary/30 hover:shadow-md transition-all">
                              {/* Thumbnail / Preview Area */}
                              <button
                                onClick={() => openPreview(report)}
                                className="w-full h-40 bg-muted/30 flex items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors relative overflow-hidden"
                              >
                                {isImageUrl(report.file?.url) ? (
                                  <img src={report.file.url} alt={report.title} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                    <FileText className="h-12 w-12" />
                                    <span className="text-xs uppercase tracking-wider font-medium">{report.file?.format || "PDF"}</span>
                                  </div>
                                )}
                                {/* Hover overlay */}
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
                                    <h4 className="font-semibold text-foreground text-sm truncate">{report.title}</h4>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                      {report.created_at ? new Date(report.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : ""}
                                    </p>
                                  </div>
                                  <span className="text-lg" title={report.report_type}>{reportTypeIcons[report.report_type] || "📋"}</span>
                                </div>

                                {/* Type & Status Badges */}
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="inline-flex items-center rounded-full border border-border px-2 py-0.5 text-xs font-medium text-muted-foreground">
                                    {report.report_type}
                                  </span>
                                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${st.bg} ${st.color}`}>
                                    <StatusIcon className="h-3 w-3" /> {report.status}
                                  </span>
                                </div>

                                {/* Physio Notes */}
                                {report.physio_notes && report.status === "Reviewed" && (
                                  <div className="rounded-xl bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 p-3">
                                    <p className="text-xs font-semibold text-green-700 dark:text-green-400 flex items-center gap-1.5 mb-1">
                                      <StickyNote className="h-3 w-3" /> Physiotherapist Notes
                                    </p>
                                    <p className="text-xs text-green-800 dark:text-green-300 leading-relaxed line-clamp-3">{report.physio_notes}</p>
                                  </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex items-center gap-2 pt-1">
                                  <button onClick={() => window.open(report.file?.url, "_blank")} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted/50 hover:bg-muted text-xs font-medium text-muted-foreground hover:text-foreground transition-colors" title="Download">
                                    <Download className="h-3.5 w-3.5" /> Download
                                  </button>
                                  <button onClick={() => openEdit(report)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted/50 hover:bg-muted text-xs font-medium text-muted-foreground hover:text-foreground transition-colors" title="Update">
                                    <Pencil className="h-3.5 w-3.5" /> Update
                                  </button>
                                  <button onClick={() => setDeleteTarget(report)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-xs font-medium text-red-600 transition-colors ml-auto" title="Delete">
                                    <Trash2 className="h-3.5 w-3.5" />
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

            {/* ═══════ Therapists Tab ═══════ */}
            {activeTab === "therapists" && (
              <div className="rounded-3xl border border-border bg-surface shadow-sm overflow-hidden flex flex-col min-h-[500px]">
                <div className="p-6 md:p-8 border-b border-border/50 bg-background/50 space-y-4">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" /> Therapist Directory
                    </h2>
                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                      <div className="relative flex-1 sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                          type="text"
                          placeholder="Search therapists..."
                          value={therapistSearch}
                          onChange={(e) => setTherapistSearch(e.target.value)}
                          className="flex h-10 w-full rounded-xl border border-input bg-transparent pl-9 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                        />
                      </div>
                      <select
                        value={therapistSpecialization}
                        onChange={(e) => setTherapistSpecialization(e.target.value)}
                        className="flex h-10 w-full sm:w-48 rounded-xl border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                      >
                        <option value="">All Specializations</option>
                        <option value="Orthopedic">Orthopedic</option>
                        <option value="Neurological">Neurological</option>
                        <option value="Cardiopulmonary">Cardiopulmonary</option>
                        <option value="Pediatric">Pediatric</option>
                        <option value="Geriatric">Geriatric</option>
                        <option value="Sports">Sports</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 md:p-8 flex-1 bg-background/30">
                  {isLoadingTherapists ? (
                    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground h-full">
                      <Loader2 className="h-8 w-8 animate-spin mb-4" />
                      <p>Loading therapists...</p>
                    </div>
                  ) : !therapistsData?.items || therapistsData.items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center h-full">
                      <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        <Users className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-lg font-medium text-foreground">No therapists found</h3>
                      <p className="text-sm text-muted-foreground mt-2 max-w-sm">
                        {therapistSearch || therapistSpecialization
                          ? "Try adjusting your search or filters to find what you're looking for."
                          : "There are currently no verified therapists available."}
                      </p>
                      {(therapistSearch || therapistSpecialization) && (
                        <button
                          onClick={() => { setTherapistSearch(""); setTherapistSpecialization(""); }}
                          className="mt-4 px-5 py-2 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors"
                        >
                          Clear Filters
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                      {therapistsData.items.map((therapist) => (
                        <div key={therapist.id} className="group relative rounded-2xl border border-border/60 bg-surface overflow-hidden hover:border-primary/30 hover:shadow-md transition-all flex flex-col">
                          <div className="p-5 flex gap-4">
                            <Avatar className="h-16 w-16 border border-border/50 shadow-sm shrink-0">
                              <AvatarImage src={therapist.avatar?.url} alt={therapist.name} className="object-cover" />
                              <AvatarFallback className="bg-primary/5 text-primary text-xl font-bold">
                                {therapist.name.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0 flex-1">
                              <h4 className="font-semibold text-foreground text-base truncate">{therapist.name}</h4>
                              {therapist.specialization && (
                                <p className="text-sm text-primary font-medium mt-0.5 truncate">{therapist.specialization} Physiotherapist</p>
                              )}
                              <div className="flex flex-col gap-1 mt-2 text-xs text-muted-foreground">
                                {therapist.experience_years !== undefined && therapist.experience_years > 0 && (
                                  <span className="flex items-center gap-1.5"><Activity className="h-3.5 w-3.5" /> {therapist.experience_years} years experience</span>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-auto p-4 border-t border-border/50 bg-background/50 flex gap-2">
                            <a
                              href={`/booking?therapist=${encodeURIComponent(therapist.name)}`}
                              className="flex-1 flex items-center justify-center gap-2 h-9 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity"
                            >
                              <Calendar className="h-3.5 w-3.5" /> Book Session
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Pagination placeholder if needed later */}
                  {therapistsData?.total > therapistsData?.items.length && (
                     <p className="text-center text-xs text-muted-foreground mt-8">Showing {therapistsData.items.length} of {therapistsData.total} therapists.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ═══════ UPLOAD MODAL ═══════ */}
      {uploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => resetUploadForm()}>
          <div className="relative w-full max-w-md bg-background rounded-3xl border border-border shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-border/50">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Upload Medical Report</h3>
                <button onClick={resetUploadForm} className="p-1.5 rounded-full hover:bg-muted transition-colors"><X className="h-4 w-4" /></button>
              </div>
              <p className="text-sm text-muted-foreground mt-1">Upload your prescriptions, X-rays, MRIs, or medical documents.</p>
            </div>
            <form onSubmit={handleUploadSubmit} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Report Title *</label>
                <input type="text" value={reportTitle} onChange={(e) => setReportTitle(e.target.value)} required minLength={2} placeholder="e.g. Post-Surgery X-Ray" className="flex h-10 w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Report Type *</label>
                <select value={reportType} onChange={(e) => setReportType(e.target.value as ReportType)} className="flex h-10 w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
                  <option value="Prescription">💊 Prescription</option>
                  <option value="X-Ray">🦴 X-Ray</option>
                  <option value="MRI">🧠 MRI</option>
                  <option value="Medical Report">📋 Medical Report</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">File *</label>
                <div className="relative">
                  <input ref={fileInputRef} type="file" accept="image/*,.pdf" onChange={(e) => setReportFile(e.target.files?.[0] || null)} required className="flex h-10 w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm file:mr-3 file:border-0 file:bg-primary/10 file:text-primary file:text-sm file:font-medium file:rounded-lg file:px-3 file:py-1" />
                </div>
                <p className="text-xs text-muted-foreground">Accepted: JPG, PNG, WEBP, PDF (max 10MB)</p>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={resetUploadForm} className="flex-1 h-10 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors">Cancel</button>
                <button type="submit" disabled={uploadMut.isPending} className="flex-1 h-10 flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition-all">
                  {uploadMut.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══════ EDIT MODAL ═══════ */}
      {editReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setEditReport(null)}>
          <div className="relative w-full max-w-md bg-background rounded-3xl border border-border shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-border/50">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Update Report</h3>
                <button onClick={() => setEditReport(null)} className="p-1.5 rounded-full hover:bg-muted transition-colors"><X className="h-4 w-4" /></button>
              </div>
              <p className="text-sm text-muted-foreground mt-1">Update the title, type, or replace the file entirely.</p>
            </div>
            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Report Title</label>
                <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} minLength={2} className="flex h-10 w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Report Type</label>
                <select value={editType} onChange={(e) => setEditType(e.target.value as ReportType)} className="flex h-10 w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
                  <option value="Prescription">💊 Prescription</option>
                  <option value="X-Ray">🦴 X-Ray</option>
                  <option value="MRI">🧠 MRI</option>
                  <option value="Medical Report">📋 Medical Report</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Replace File (optional)</label>
                <input ref={editFileRef} type="file" accept="image/*,.pdf" onChange={(e) => setEditFile(e.target.files?.[0] || null)} className="flex h-10 w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm file:mr-3 file:border-0 file:bg-primary/10 file:text-primary file:text-sm file:font-medium file:rounded-lg file:px-3 file:py-1" />
                <p className="text-xs text-muted-foreground">Leave empty to keep the current file. Uploading a new file will delete the old one.</p>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setEditReport(null)} className="flex-1 h-10 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors">Cancel</button>
                <button type="submit" disabled={updateMut.isPending} className="flex-1 h-10 flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition-all">
                  {updateMut.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══════ PREVIEW MODAL (with Zoom) ═══════ */}
      {previewReport && (
        <div className="fixed inset-0 z-50 flex flex-col bg-black/90 backdrop-blur-md" onClick={() => setPreviewReport(null)}>
          {/* Toolbar */}
          <div className="flex items-center justify-between px-4 py-3 bg-black/50" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-sm font-semibold text-white truncate">{previewReport.title}</span>
              <span className="inline-flex items-center rounded-full border border-white/20 px-2 py-0.5 text-xs text-white/70">{previewReport.report_type}</span>
            </div>
            <div className="flex items-center gap-2">
              {isImageUrl(previewReport.file?.url) && (
                <>
                  <button onClick={(e) => { e.stopPropagation(); setZoomLevel((z) => Math.max(0.25, z - 0.25)); }} className="p-2 rounded-lg hover:bg-white/10 text-white transition-colors" title="Zoom Out"><ZoomOut className="h-4 w-4" /></button>
                  <span className="text-xs text-white/70 min-w-[3rem] text-center">{Math.round(zoomLevel * 100)}%</span>
                  <button onClick={(e) => { e.stopPropagation(); setZoomLevel((z) => Math.min(5, z + 0.25)); }} className="p-2 rounded-lg hover:bg-white/10 text-white transition-colors" title="Zoom In"><ZoomIn className="h-4 w-4" /></button>
                  <button onClick={(e) => { e.stopPropagation(); setZoomLevel(1); }} className="p-2 rounded-lg hover:bg-white/10 text-white transition-colors" title="Reset Zoom"><RotateCcw className="h-4 w-4" /></button>
                  <div className="w-px h-5 bg-white/20 mx-1" />
                </>
              )}
              <button onClick={(e) => { e.stopPropagation(); window.open(previewReport.file?.url, "_blank"); }} className="p-2 rounded-lg hover:bg-white/10 text-white transition-colors" title="Download"><Download className="h-4 w-4" /></button>
              <button onClick={() => setPreviewReport(null)} className="p-2 rounded-lg hover:bg-white/10 text-white transition-colors" title="Close"><X className="h-4 w-4" /></button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto flex items-center justify-center p-4" onClick={(e) => e.stopPropagation()}>
            {isImageUrl(previewReport.file?.url) ? (
              <img
                src={previewReport.file.url}
                alt={previewReport.title}
                style={{ transform: `scale(${zoomLevel})`, transformOrigin: "center center", transition: "transform 0.2s ease" }}
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                draggable={false}
              />
            ) : (
              <div className="w-full max-w-3xl h-full">
                <iframe src={previewReport.file?.url} className="w-full h-full rounded-lg border-0 bg-white" title="PDF Preview" />
              </div>
            )}
          </div>

          {/* Notes Bar */}
          {previewReport.physio_notes && previewReport.status === "Reviewed" && (
            <div className="px-4 py-3 bg-green-900/50 border-t border-green-500/20" onClick={(e) => e.stopPropagation()}>
              <p className="text-xs font-semibold text-green-300 flex items-center gap-1.5 mb-1"><StickyNote className="h-3 w-3" /> Physiotherapist Notes</p>
              <p className="text-sm text-green-100 leading-relaxed">{previewReport.physio_notes}</p>
            </div>
          )}
        </div>
      )}

      {/* ═══════ DELETE CONFIRM ═══════ */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setDeleteTarget(null)}>
          <div className="relative w-full max-w-sm bg-background rounded-3xl border border-border shadow-2xl overflow-hidden p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex flex-col items-center text-center">
              <div className="h-14 w-14 rounded-full bg-red-100 dark:bg-red-500/10 flex items-center justify-center mb-4">
                <AlertCircle className="h-7 w-7 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold">Delete Report?</h3>
              <p className="text-sm text-muted-foreground mt-2">
                This will permanently delete "<span className="font-medium text-foreground">{deleteTarget.title}</span>" and remove the file from storage.
              </p>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 h-10 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors">Cancel</button>
              <button onClick={() => deleteMut.mutate(deleteTarget.id)} disabled={deleteMut.isPending} className="flex-1 h-10 flex items-center justify-center gap-2 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 disabled:opacity-50 transition-all">
                {deleteMut.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const UserIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);
