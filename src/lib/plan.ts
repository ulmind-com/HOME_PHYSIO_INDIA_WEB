/**
 * The client's business plan expressed as data.
 *
 * Marketing copy and the pricing rules from the plan document live here so the
 * pages stay presentational. Anything the admin panel owns (services, staff,
 * blogs, settings) is fetched from the API instead — these constants only cover
 * the fixed product rules the admin panel doesn't edit.
 */
import type {
  EquipmentCode,
  MassageType,
  PackageDuration,
  ServiceCategory,
  Shift,
} from "./api/therapy";

export type ServiceDefinition = {
  category: ServiceCategory;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  highlights: string[];
  startingAt: number;
  platformFee: number;
  duration: string;
};

export const SERVICES: ServiceDefinition[] = [
  {
    category: "physiotherapy",
    slug: "physiotherapy",
    name: "Home Visit Physiotherapy",
    tagline: "Clinic-grade recovery, at your bedside",
    description:
      "A verified physiotherapist visits your home with portable modalities, assesses your condition and delivers a structured 40–60 minute session. Choose daily visits, a weekly rhythm, or a long-term package.",
    highlights: [
      "40–60 minute assessed session",
      "Portable IFT, TENS, UST, NMES and more",
      "Daily, weekly or package frequency",
      "Machine charges shown before you pay",
    ],
    startingAt: 400,
    platformFee: 20,
    duration: "40–60 min",
  },
  {
    category: "yoga_therapy",
    slug: "yoga-therapy",
    name: "Home Visit Yoga Therapy",
    tagline: "Therapeutic yoga, guided one-to-one",
    description:
      "Condition-specific yoga therapy at home — breathing work, mobility and graded strengthening designed around your medical history rather than a generic class.",
    highlights: [
      "One-to-one therapeutic sessions",
      "Built around your condition, not a class plan",
      "Daily, weekly or package frequency",
      "Progress reviewed every visit",
    ],
    startingAt: 400,
    platformFee: 20,
    duration: "40–60 min",
  },
  {
    category: "massage_therapy",
    slug: "massage-therapy",
    name: "Home Visit Massage Therapy",
    tagline: "Clinical massage, strictly professional",
    description:
      "Oil, dry and deep tissue massage delivered at home by a gender-matched therapist under a strict professional-conduct policy.",
    highlights: [
      "Normal oil, dry and deep tissue options",
      "45–60 minutes standard duration",
      "Gender-matched therapist, always",
      "Zero-tolerance professional conduct policy",
    ],
    startingAt: 800,
    platformFee: 35,
    duration: "45–60 min",
  },
  {
    category: "home_rehabilitation",
    slug: "home-rehabilitation",
    name: "Home Rehabilitation",
    tagline: "Intensive recovery programmes at home",
    description:
      "Specialised, higher-intensity rehabilitation for stroke, post-surgical and complex neurological recovery — delivered as a supervised programme rather than single visits.",
    highlights: [
      "Stroke and post-surgery recovery",
      "Intensive, supervised programmes",
      "Full portable modality access",
      "Progress tracked across the programme",
    ],
    startingAt: 400,
    platformFee: 35,
    duration: "40–60 min",
  },
];

export const serviceBySlug = (slug: string) =>
  SERVICES.find((s) => s.slug === slug);

export const serviceByCategory = (category: ServiceCategory) =>
  SERVICES.find((s) => s.category === category)!;

/* ------------------------------------------------------------------ */
/* Portable equipment library (§9)                                     */
/* ------------------------------------------------------------------ */

export type ModalityDefinition = {
  code: EquipmentCode;
  name: string;
  short: string;
  indication: string;
  charge: number;
};

export const MODALITIES: ModalityDefinition[] = [
  {
    code: "ift",
    name: "IFT",
    short: "Interferential Therapy",
    indication: "Deep pain relief — back, neck and joint pain",
    charge: 100,
  },
  {
    code: "tens",
    name: "TENS",
    short: "Transcutaneous Electrical Nerve Stimulation",
    indication: "Nerve pain modulation and acute pain control",
    charge: 100,
  },
  {
    code: "ust",
    name: "UST",
    short: "Ultrasound Therapy",
    indication: "Soft tissue healing — knee pain, tendon injury",
    charge: 100,
  },
  {
    code: "nmes",
    name: "NMES",
    short: "Neuromuscular Electrical Stimulation",
    indication: "Muscle re-education and weakness",
    charge: 100,
  },
  {
    code: "fes",
    name: "FES",
    short: "Functional Electrical Stimulation",
    indication: "Functional movement retraining after stroke",
    charge: 100,
  },
  {
    code: "portable_ems",
    name: "Portable EMS",
    short: "Electrical Muscle Stimulation",
    indication: "Muscle strengthening and atrophy prevention",
    charge: 100,
  },
  {
    code: "wax_bath",
    name: "Wax Bath",
    short: "Paraffin Wax Therapy",
    indication: "Joint stiffness, arthritis of hands and feet",
    charge: 100,
  },
  {
    code: "hot_cold",
    name: "Hot / Cold Therapy",
    short: "Thermotherapy & Cryotherapy",
    indication: "Swelling, inflammation and muscle spasm",
    charge: 100,
  },
  {
    code: "theraband",
    name: "TheraBand",
    short: "Resistance Band Training",
    indication: "Graded strengthening and mobility work",
    charge: 100,
  },
];

/** Condition → suggested modality mapping from §14. */
export const MACHINE_RECOMMENDATIONS: {
  condition: string;
  codes: EquipmentCode[];
}[] = [
  { condition: "Back pain", codes: ["ift", "tens"] },
  { condition: "Knee pain", codes: ["ust"] },
  { condition: "Muscle weakness", codes: ["nmes", "fes"] },
  { condition: "Joint stiffness", codes: ["wax_bath", "hot_cold"] },
  { condition: "Post-surgery recovery", codes: ["portable_ems", "theraband"] },
];

/* ------------------------------------------------------------------ */
/* Care categories (§13)                                               */
/* ------------------------------------------------------------------ */

export const CARE_CATEGORIES = [
  {
    key: "mild",
    label: "Mild",
    blurb: "Early-stage pain or stiffness with full independent movement.",
  },
  {
    key: "moderate",
    label: "Moderate",
    blurb: "Persistent pain limiting daily activity or range of motion.",
  },
  {
    key: "severe",
    label: "Severe",
    blurb: "Significant weakness or pain requiring assisted movement.",
  },
  {
    key: "stroke",
    label: "Stroke",
    blurb: "Neurological recovery with functional retraining needs.",
  },
  {
    key: "post_surgery",
    label: "Post-Surgery",
    blurb: "Structured recovery after an operative procedure.",
  },
];

/* ------------------------------------------------------------------ */
/* Pricing rules (§6, §10, §11, §12, §15, §19)                         */
/* ------------------------------------------------------------------ */

export const DAILY_FREQUENCY = [
  { visits: 1, price: 400, label: "1 visit / day" },
  { visits: 2, price: 600, label: "2 visits / day" },
  { visits: 3, price: 800, label: "3 visits / day" },
];

export const WEEKLY_DAYS = [1, 2, 3, 4, 5, 6, 7];
export const WEEKLY_RATE = 400;
export const PACKAGE_RATE = 400;
export const MACHINE_CHARGE = 100;
export const CONSULTATION_FEE = 199;

export const PACKAGES: { value: PackageDuration; label: string; months: string }[] =
  [
    { value: "monthly", label: "Monthly", months: "1 month" },
    { value: "quarterly", label: "Quarterly", months: "3 months" },
    { value: "half_yearly", label: "Half-Yearly", months: "6 months" },
    { value: "yearly", label: "Yearly", months: "12 months" },
    { value: "custom", label: "Custom", months: "2–24 months" },
  ];

export const MASSAGE_OPTIONS: {
  value: MassageType;
  label: string;
  price: number;
}[] = [
  { value: "normal_oil", label: "Normal Oil Massage", price: 800 },
  { value: "dry", label: "Dry Massage", price: 900 },
  { value: "deep_tissue", label: "Deep Tissue Massage", price: 1000 },
];

export const SHIFTS: { value: Shift; label: string; window: string }[] = [
  { value: "morning", label: "Morning", window: "7 AM – 11 AM" },
  { value: "noon", label: "Noon", window: "12 PM – 2 PM" },
  { value: "afternoon", label: "Afternoon", window: "3 PM – 5 PM" },
  { value: "evening", label: "Evening", window: "6 PM – 9 PM" },
];

/* ------------------------------------------------------------------ */
/* Journey & trust content                                             */
/* ------------------------------------------------------------------ */

export const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Tell us your condition",
    body: "Share your medical condition, symptoms and how long you've had them. Upload a prescription, X-Ray or MRI if you have one.",
  },
  {
    step: "02",
    title: "Choose your care plan",
    body: "Pick your service, visit frequency, shift and any portable modalities. The full price breakdown is shown before you pay.",
  },
  {
    step: "03",
    title: "Pay the booking confirmation fee",
    body: "Advance payment confirms your slot. Visit fee, machine charge and total are itemised on every booking.",
  },
  {
    step: "04",
    title: "Your therapist arrives",
    body: "A verified therapist reaches your address, marks attendance with OTP and location, and delivers the session.",
  },
];

export const TRUST_POINTS = [
  {
    title: "Verified therapists only",
    body: "Every therapist is document-verified and admin-approved before taking a single booking.",
  },
  {
    title: "Transparent pricing",
    body: "Visit fee, machine charges and platform fee are itemised. No charge appears after booking.",
  },
  {
    title: "OTP-backed attendance",
    body: "Therapist arrival is confirmed by OTP and location tracking, visible to you and to our admin team.",
  },
  {
    title: "Report review trail",
    body: "Uploaded prescriptions and scans move through Uploaded → Viewed → Reviewed with physio notes.",
  },
];

export const THERAPIST_TIERS = [
  {
    tier: "Verified Physio",
    body: "Documents verified and admin-approved. Ready to take home visits across the state.",
  },
  {
    tier: "Associate Physio",
    body: "Working alongside senior physiotherapists on supervised home-visit caseloads.",
  },
  {
    tier: "Premium Physio",
    body: "Senior clinicians handling complex neurological and post-surgical rehabilitation.",
  },
];

export const QUALIFICATIONS = ["MPT", "BPT", "PT", "DPT"];

export const COVERAGE = {
  headline: "Launching across West Bengal",
  body: "Urban, rural, village and locality areas — every district in West Bengal is inside our service coverage from day one.",
  roadmap: ["West Bengal", "Other States", "Pan-India"],
};
