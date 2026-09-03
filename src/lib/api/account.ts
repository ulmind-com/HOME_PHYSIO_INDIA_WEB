/**
 * Account-scoped APIs: medical reports and therapist earnings.
 *
 * Both surfaces are auth-gated; pass `enabled` from the caller's auth state.
 */
import { queryOptions } from "@tanstack/react-query";
import { api, apiFetch, type Paginated } from "./client";

/* ------------------------------------------------------------------ */
/* Medical reports (§4 of the plan)                                    */
/* ------------------------------------------------------------------ */

export type ReportType = "Prescription" | "X-Ray" | "MRI" | "Medical Report";
export type ReportStatus = "Uploaded" | "Viewed" | "Reviewed";

export const REPORT_TYPES: ReportType[] = [
  "Prescription",
  "X-Ray",
  "MRI",
  "Medical Report",
];

/** Ordered pipeline the patient sees on each report card. */
export const REPORT_STAGES: ReportStatus[] = ["Uploaded", "Viewed", "Reviewed"];

export type ReportFile = {
  url: string;
  filename?: string | null;
  content_type?: string | null;
  size?: number | null;
};

export type MedicalReport = {
  id: string;
  patient_id: string;
  title: string;
  report_type: ReportType;
  file: ReportFile;
  status: ReportStatus;
  physio_notes: string;
  reviewed_by_id?: string | null;
  created_at: string;
  updated_at: string;
};

export const myReportsQ = (enabled = true) =>
  queryOptions({
    queryKey: ["medical-reports", "mine"],
    queryFn: ({ signal }) =>
      api.get<Paginated<MedicalReport>>(
        "/medical-reports",
        { page_size: 50 },
        signal,
      ),
    enabled,
  });

export const patientReportsQ = (patientId: string | undefined) =>
  queryOptions({
    queryKey: ["medical-reports", "patient", patientId],
    queryFn: ({ signal }) =>
      api.get<MedicalReport[]>(`/auth/me/patient-reports/${patientId}`, undefined, signal),
    enabled: Boolean(patientId),
  });

export function uploadReport(input: {
  title: string;
  report_type: ReportType;
  file: File;
  patient_id?: string;
}) {
  const fd = new FormData();
  fd.append("title", input.title);
  fd.append("report_type", input.report_type);
  fd.append("patient_id", input.patient_id ?? "");
  fd.append("file", input.file);
  return api.postForm<MedicalReport>("/medical-reports", fd);
}

export const reviewReport = (
  reportId: string,
  payload: { status?: ReportStatus; physio_notes?: string },
) => api.patch<MedicalReport>(`/medical-reports/${reportId}/review`, payload);

export const deleteReport = (reportId: string) =>
  apiFetch<void>(`/medical-reports/${reportId}`, { method: "DELETE" });

/* ------------------------------------------------------------------ */
/* Therapist earnings (§11, §19 of the plan)                           */
/* ------------------------------------------------------------------ */

export type EarningStatus = "pending" | "settled" | "reversed";

export type EarningsSummary = {
  therapist_id: string;
  pending_amount: number;
  pending_count: number;
  settled_amount: number;
  settled_count: number;
  reversed_amount: number;
  reversed_count: number;
  total_earned: number;
  total_bookings: number;
};

export type TherapistEarning = {
  id: string;
  booking_id: string;
  booking_reference: string;
  service_category: string;
  patient_name: string;
  total_amount: number;
  platform_fee_percent: number;
  platform_fee_amount: number;
  therapist_payout: number;
  status: EarningStatus;
  booking_completed_at?: string | null;
  created_at: string;
};

export type TherapistPayout = {
  id: string;
  reference?: string;
  therapist_id: string;
  total_amount: number;
  status: string;
  period_start?: string | null;
  period_end?: string | null;
  paid_at?: string | null;
  created_at: string;
};

export const myEarningsSummaryQ = (enabled = true) =>
  queryOptions({
    queryKey: ["commissions", "my-summary"],
    queryFn: ({ signal }) =>
      api.get<EarningsSummary>("/commissions/my-summary", undefined, signal),
    enabled,
  });

export const myEarningsQ = (enabled = true) =>
  queryOptions({
    queryKey: ["commissions", "my-earnings"],
    queryFn: ({ signal }) =>
      api.get<Paginated<TherapistEarning>>(
        "/commissions/my-earnings",
        { page_size: 50 },
        signal,
      ),
    enabled,
  });

export const myPayoutsQ = (enabled = true) =>
  queryOptions({
    queryKey: ["commissions", "my-payouts"],
    queryFn: ({ signal }) =>
      api.get<Paginated<TherapistPayout>>(
        "/commissions/my-payouts",
        { page_size: 50 },
        signal,
      ),
    enabled,
  });
