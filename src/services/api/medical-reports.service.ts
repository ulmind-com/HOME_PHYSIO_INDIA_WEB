import { api, apiFetch } from "@/lib/api/client";

export type ReportType = "Prescription" | "X-Ray" | "MRI" | "Medical Report";
export type ReportStatus = "Uploaded" | "Viewed" | "Reviewed";

export interface MedicalReport {
  id: string;
  patient_id: string;
  title: string;
  report_type: ReportType;
  file: {
    url: string;
    public_id?: string;
    format?: string;
    resource_type?: string;
    bytes?: number;
    original_filename?: string;
    width?: number;
    height?: number;
  };
  status: ReportStatus;
  physio_notes: string;
  reviewed_by_id?: string | null;
  created_at?: string;
  updated_at?: string;
}

export const medicalReportsService = {
  list: async (): Promise<MedicalReport[]> => {
    const res = await apiFetch<{ items: MedicalReport[] }>("/medical-reports");
    // The backend returns paginated response with items array
    return (res as any)?.items ?? (Array.isArray(res) ? res : []);
  },

  upload: async (data: {
    title: string;
    report_type: ReportType;
    file: File;
  }): Promise<MedicalReport> => {
    const fd = new FormData();
    fd.append("title", data.title);
    fd.append("report_type", data.report_type);
    fd.append("file", data.file);
    return apiFetch<MedicalReport>("/medical-reports", {
      method: "POST",
      formData: fd,
    });
  },

  update: async (
    id: string,
    data: { title?: string; report_type?: string; file?: File }
  ): Promise<MedicalReport> => {
    const fd = new FormData();
    if (data.title) fd.append("title", data.title);
    if (data.report_type) fd.append("report_type", data.report_type);
    if (data.file) fd.append("file", data.file);
    return apiFetch<MedicalReport>(`/medical-reports/${id}`, {
      method: "PUT",
      formData: fd,
    });
  },

  remove: async (id: string): Promise<void> => {
    await apiFetch(`/medical-reports/${id}`, { method: "DELETE" });
  },
};
