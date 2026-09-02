import { api, type PaginatedResponse } from "@/lib/api/client";

export type ServiceCategory = "physiotherapy" | "yoga_therapy" | "massage_therapy" | "home_rehabilitation";
export type FrequencyType = "daily" | "weekly" | "package";
export type Shift = "morning" | "noon" | "afternoon" | "evening";
export type PackageDuration = "monthly" | "quarterly" | "half_yearly" | "yearly" | "custom";
export type MassageType = "normal_oil" | "dry" | "deep_tissue";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface EquipmentOption {
  code: string;
  name: string;
  charge: number;
}

export interface PricingQuote {
  visit_fee: number;
  machine_charge: number;
  total_amount: number;
  platform_fee_percent: number;
  platform_fee_amount: number;
  therapist_payout: number;
}

export interface TherapyBookingDraft {
  service_category: ServiceCategory;
  frequency_type?: FrequencyType;
  daily_visits_per_day?: number;
  equipment?: string[];
  massage_type?: MassageType;
  massage_duration_minutes?: number;
}

export interface TherapyBookingCreatePayload extends TherapyBookingDraft {
  patient_name: string;
  patient_age?: number;
  patient_gender?: "male" | "female" | "other";
  contact_phone: string;
  contact_email?: string;
  address: string;
  city?: string;
  pincode?: string;
  condition_notes?: string;
  preferred_date: string;
  shift: Shift;
  time_slot: string;
  session_duration_minutes?: number;
  weekly_days_count?: number;
  package_duration?: PackageDuration;
  package_custom_months?: number;
}

export interface TherapyBooking {
  id: string;
  reference: string;
  patient_name: string;
  service_category: ServiceCategory;
  preferred_date: string;
  shift: Shift;
  time_slot: string;
  visit_fee: number;
  machine_charge: number;
  total_amount: number;
  payment_status: PaymentStatus;
  refund_amount: number;
  cancellation_reason?: string | null;
  cancelled_by?: string | null;
  status: string;
  assigned_staff_name?: string | null;
  created_at: string;
}

export interface PaymentInit {
  booking: TherapyBooking;
  razorpay_order_id: string;
  razorpay_key_id: string;
  amount: number;
  currency: string;
}

export const therapyBookingService = {
  getEquipment: () => api.get<EquipmentOption[]>("/therapy-bookings/equipment"),
  getTimeSlots: (shift: Shift) => api.get<string[]>("/therapy-bookings/time-slots", { shift }),
  getQuote: (draft: TherapyBookingDraft) => api.post<PricingQuote>("/therapy-bookings/quote", draft),
  create: (payload: TherapyBookingCreatePayload) => api.post<PaymentInit>("/therapy-bookings", payload),
  verifyPayment: (
    bookingId: string,
    payload: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }
  ) => api.post<TherapyBooking>(`/therapy-bookings/${bookingId}/verify-payment`, payload),
  listMine: () => api.get<PaginatedResponse<TherapyBooking>>("/therapy-bookings/me"),
  cancel: (bookingId: string, reason?: string) =>
    api.post<TherapyBooking>(`/therapy-bookings/${bookingId}/cancel`, { reason }),
};
