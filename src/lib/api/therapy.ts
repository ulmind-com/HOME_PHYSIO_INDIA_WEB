/**
 * Therapy domain — the priced home-visit booking flow.
 *
 * Mirrors `app/api/v1/therapy_bookings` on the backend. Every one of these
 * endpoints requires an authenticated user, so callers must gate on auth
 * before enabling the query.
 */
import { queryOptions } from "@tanstack/react-query";
import { api, type Paginated } from "./client";

export type ServiceCategory =
  | "physiotherapy"
  | "yoga_therapy"
  | "massage_therapy"
  | "home_rehabilitation";

export type FrequencyType = "daily" | "weekly" | "package";
export type Shift = "morning" | "noon" | "afternoon" | "evening";
export type MassageType = "normal_oil" | "dry" | "deep_tissue";
export type PackageDuration =
  | "monthly"
  | "quarterly"
  | "half_yearly"
  | "yearly"
  | "custom";
export type EquipmentCode =
  | "ift"
  | "tens"
  | "ust"
  | "nmes"
  | "fes"
  | "portable_ems"
  | "wax_bath"
  | "hot_cold"
  | "theraband";
export type Gender = "male" | "female" | "other";

/** Mirrors the backend `BookingStatus` enum exactly — do not invent values. */
export type BookingStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "in_progress"
  | "completed"
  | "cancelled";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export type EquipmentOption = {
  code: EquipmentCode;
  name: string;
  charge: number;
};

export type PricingQuote = {
  visit_fee: number;
  machine_charge: number;
  total_amount: number;
  platform_fee_percent: number;
  platform_fee_amount: number;
  therapist_payout: number;
};

export type QuoteRequest = {
  therapist_id?: string;
  equipment_ids?: string[];
  service_category: ServiceCategory;
  frequency_type?: FrequencyType;
  daily_visits_per_day?: number;
  equipment?: EquipmentCode[];
  massage_type?: MassageType;
  massage_duration_minutes?: number;
};

export type TherapyBookingCreate = {
  patient_name: string;
  patient_age?: number;
  patient_gender?: Gender;
  contact_phone: string;
  contact_email?: string;
  address: string;
  city?: string;
  pincode?: string;
  service_category: ServiceCategory;
  condition_notes?: string;
  /** Therapist-first flow: pick a therapist + one of their published slots. */
  therapist_id?: string;
  slot_id?: string;
  /** Derived from the slot when slot_id is sent; required otherwise. */
  preferred_date?: string;
  shift?: Shift;
  time_slot?: string;
  session_duration_minutes: number;
  /** Equipment chosen from the catalogue (platform + therapist's own). */
  equipment_ids?: string[];
  frequency_type?: FrequencyType;
  daily_visits_per_day?: number;
  weekly_days_count?: number;
  package_duration?: PackageDuration;
  package_custom_months?: number;
  equipment?: EquipmentCode[];
  massage_type?: MassageType;
  massage_duration_minutes?: number;
};

export type BookedEquipment = {
  equipment_id: string;
  name: string;
  charge: number;
  owner_type: "platform" | "therapist";
};

export type TherapyBooking = {
  id: string;
  reference: string;
  patient_id?: string | null;
  patient_name: string;
  patient_age?: number | null;
  patient_gender?: Gender | null;
  contact_phone: string;
  contact_email?: string | null;
  address: string;
  city?: string | null;
  pincode?: string | null;
  service_category: ServiceCategory;
  condition_notes?: string | null;
  preferred_date: string;
  shift: Shift;
  time_slot: string;
  session_duration_minutes: number;
  frequency_type?: FrequencyType | null;
  daily_visits_per_day?: number | null;
  weekly_days_count?: number | null;
  package_duration?: PackageDuration | null;
  package_custom_months?: number | null;
  equipment: EquipmentCode[];
  massage_type?: MassageType | null;
  massage_duration_minutes?: number | null;
  visit_fee: number;
  machine_charge: number;
  total_amount: number;
  platform_fee_percent: number;
  platform_fee_amount: number;
  therapist_payout: number;
  payment_status: PaymentStatus;
  amount_paid: number;
  status: BookingStatus;
  assigned_staff_id?: string | null;
  assigned_staff_name?: string | null;
  cancellation_reason?: string | null;
  refund_amount: number;
  created_at: string;
  updated_at: string;
};

export type BookingPaymentInit = {
  booking: TherapyBooking;
  razorpay_order_id: string;
  razorpay_key_id: string;
  amount: number;
  currency: string;
};

export type PaymentVerifyRequest = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

/* ------------------------------------------------------------------ */
/* Queries                                                             */
/* ------------------------------------------------------------------ */

const FIVE_MIN = 5 * 60 * 1000;

export const equipmentCatalogueQ = (enabled = true) =>
  queryOptions({
    queryKey: ["therapy", "equipment"],
    queryFn: ({ signal }) =>
      api.get<EquipmentOption[]>("/therapy-bookings/equipment", undefined, signal),
    staleTime: FIVE_MIN,
    enabled,
  });

export const timeSlotsQ = (shift: Shift | undefined) =>
  queryOptions({
    queryKey: ["therapy", "time-slots", shift],
    queryFn: ({ signal }) =>
      api.get<string[]>("/therapy-bookings/time-slots", { shift }, signal),
    staleTime: FIVE_MIN,
    enabled: Boolean(shift),
  });

export const myBookingsQ = (enabled = true) =>
  queryOptions({
    queryKey: ["therapy", "my-bookings"],
    queryFn: ({ signal }) =>
      api.get<Paginated<TherapyBooking>>(
        "/therapy-bookings/me",
        { page_size: 50 },
        signal,
      ),
    enabled,
  });

export const assignedBookingsQ = (enabled = true) =>
  queryOptions({
    queryKey: ["therapy", "assigned-bookings"],
    queryFn: ({ signal }) =>
      api.get<Paginated<TherapyBooking>>(
        "/therapy-bookings/assigned-to-me",
        { page_size: 50 },
        signal,
      ),
    enabled,
  });

/* ---- Therapist-first booking: equipment, slots ------------------- */

export type TherapyEquipment = {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: ServiceCategory;
  charge: number;
  owner_type: "platform" | "therapist";
  therapist_id?: string | null;
  therapist_name?: string | null;
  is_active: boolean;
  sort_order: number;
};

export type TherapistSlot = {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  is_booked: boolean;
  booked_by_patient_name?: string | null;
  booking_reference?: string | null;
};

/** Platform equipment for the category + that therapist's own kit. */
export const bookableEquipmentQ = (
  category: ServiceCategory | undefined,
  therapistId: string | undefined,
) =>
  queryOptions({
    queryKey: ["therapy", "equipment", "for-booking", category, therapistId],
    queryFn: ({ signal }) =>
      api.get<TherapyEquipment[]>(
        "/therapy-equipment/for-booking",
        { category, therapist_id: therapistId },
        signal,
      ),
    staleTime: FIVE_MIN,
    enabled: Boolean(category),
  });

export type BookableTherapist = {
  id: string;
  name: string;
  email: string;
  user_type?: string;
  gender?: string | null;
  specialization?: string | null;
  qualification?: string | null;
  therapist_tier?: string | null;
  experience_years?: number | null;
  avatar?: { url: string } | null;
};

/**
 * Therapists a patient may book for this category.
 *
 * The backend applies the gender-matching safety rule for massage itself, so
 * a massage search only ever returns therapists of the caller's own gender.
 */
export const bookableTherapistsQ = (
  category: ServiceCategory | undefined,
  search: string,
  enabled = true,
) => {
  const userType =
    category === "massage_therapy"
      ? "massage_therapist"
      : category === "yoga_therapy"
        ? "yoga_therapist"
        : "physiotherapist";
  return queryOptions({
    queryKey: ["therapy", "bookable-therapists", userType, search],
    queryFn: ({ signal }) =>
      api.get<Paginated<BookableTherapist>>(
        "/therapists",
        { user_type: userType, search: search || undefined, page_size: 24 },
        signal,
      ),
    enabled: enabled && Boolean(category),
  });
};

/** Free home-visit slots a patient can pick from. */
export const therapistAvailabilityQ = (therapistId: string | undefined) =>
  queryOptions({
    queryKey: ["therapy", "availability", therapistId],
    queryFn: ({ signal }) =>
      api.get<TherapistSlot[]>(
        "/therapy-bookings/therapist-availability",
        { therapist_id: therapistId },
        signal,
      ),
    enabled: Boolean(therapistId),
  });

/** The logged-in therapist's own published slots. */
export const mySlotsQ = (enabled = true) =>
  queryOptions({
    queryKey: ["therapy", "my-slots"],
    queryFn: ({ signal }) => api.get<TherapistSlot[]>("/therapy-bookings/my-slots", undefined, signal),
    enabled,
  });

/** The logged-in therapist's own equipment. */
export const myEquipmentQ = (enabled = true) =>
  queryOptions({
    queryKey: ["therapy", "my-equipment"],
    queryFn: ({ signal }) => api.get<TherapyEquipment[]>("/therapy-equipment/mine", undefined, signal),
    enabled,
  });

export const createMySlot = (payload: { date: string; start_time: string; end_time: string }) =>
  api.post<{ id: string }>("/therapy-bookings/my-slots", payload);

export const deleteMySlot = (slotId: string) =>
  api.delete<null>(`/therapy-bookings/my-slots/${slotId}`);

export const createMyEquipment = (payload: {
  name: string;
  description?: string;
  category: ServiceCategory;
  charge: number;
}) => api.post<TherapyEquipment>("/therapy-equipment/mine", payload);

export const deleteMyEquipment = (id: string) => api.delete<null>(`/therapy-equipment/${id}`);

/** Therapist moves one of their own bookings along. */
export const updateMyBookingStatus = (
  bookingId: string,
  status: BookingStatus,
  reason?: string,
) =>
  api.patch<TherapyBooking>(
    `/therapy-bookings/${bookingId}/my-status?status=${encodeURIComponent(status)}`,
    { reason },
  );

/* ------------------------------------------------------------------ */
/* Mutations                                                           */
/* ------------------------------------------------------------------ */

export const getQuote = (payload: QuoteRequest) =>
  api.post<PricingQuote>("/therapy-bookings/quote", payload);

export const createBooking = (payload: TherapyBookingCreate) =>
  api.post<BookingPaymentInit>("/therapy-bookings", payload);

export const verifyPayment = (bookingId: string, payload: PaymentVerifyRequest) =>
  api.post<TherapyBooking>(`/therapy-bookings/${bookingId}/verify-payment`, payload);

export const cancelBooking = (bookingId: string, reason?: string) =>
  api.post<TherapyBooking>(`/therapy-bookings/${bookingId}/cancel`, { reason });

/* ------------------------------------------------------------------ */
/* Display helpers — the client plan's vocabulary in one place          */
/* ------------------------------------------------------------------ */

export const SERVICE_LABELS: Record<ServiceCategory, string> = {
  physiotherapy: "Home Visit Physiotherapy",
  yoga_therapy: "Home Visit Yoga Therapy",
  massage_therapy: "Home Visit Massage Therapy",
  home_rehabilitation: "Home Rehabilitation",
};

export const SERVICE_SLUGS: Record<ServiceCategory, string> = {
  physiotherapy: "physiotherapy",
  yoga_therapy: "yoga-therapy",
  massage_therapy: "massage-therapy",
  home_rehabilitation: "home-rehabilitation",
};

export const SLUG_TO_CATEGORY: Record<string, ServiceCategory> = {
  physiotherapy: "physiotherapy",
  "yoga-therapy": "yoga_therapy",
  "massage-therapy": "massage_therapy",
  "home-rehabilitation": "home_rehabilitation",
};

export const SHIFT_LABELS: Record<Shift, string> = {
  morning: "Morning",
  noon: "Noon",
  afternoon: "Afternoon",
  evening: "Evening",
};

export const MASSAGE_LABELS: Record<MassageType, string> = {
  normal_oil: "Normal Oil Massage",
  dry: "Dry Massage",
  deep_tissue: "Deep Tissue Massage",
};

export const MASSAGE_PRICES: Record<MassageType, number> = {
  normal_oil: 800,
  dry: 900,
  deep_tissue: 1000,
};

export const PACKAGE_LABELS: Record<PackageDuration, string> = {
  monthly: "Monthly — 1 Month",
  quarterly: "Quarterly — 3 Months",
  half_yearly: "Half-Yearly — 6 Months",
  yearly: "Yearly — 12 Months",
  custom: "Custom Duration",
};

export const STATUS_LABELS: Record<BookingStatus, string> = {
  pending: "Pending",
  approved: "Confirmed",
  rejected: "Rejected",
  in_progress: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

/** Platform fee percentage per the client's final commission structure. */
export const PLATFORM_FEE_PERCENT: Record<ServiceCategory, number> = {
  physiotherapy: 20,
  yoga_therapy: 20,
  home_rehabilitation: 35,
  massage_therapy: 35,
};

/** Daily-frequency visit pricing from the plan (§6A). */
export const DAILY_VISIT_PRICES: Record<number, number> = {
  1: 400,
  2: 600,
  3: 800,
};

export const formatINR = (paise: number) => `₹${paise.toLocaleString("en-IN")}`;

/** Categories that use the frequency/equipment engine (everything but massage). */
export const usesFrequency = (c: ServiceCategory) => c !== "massage_therapy";
