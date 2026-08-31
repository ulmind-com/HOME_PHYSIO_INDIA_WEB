import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import {
  Phone,
  MessageCircle,
  Clock3,
  ShieldCheck,
  BadgeCheck,
  HeartHandshake,
  CheckCircle2,
} from "lucide-react";
import { settingsQ } from "@/lib/api/queries";
import { Section } from "@/components/site/Section";
import { BookingForm } from "@/components/forms/BookingForm";

const searchSchema = z.object({ service: z.string().optional() });

export const Route = createFileRoute("/booking")({
  validateSearch: (s) => searchSchema.parse(s),
  head: () => ({
    meta: [
      { title: "Book care — Home Physio India" },
      {
        name: "description",
        content: "Book a nurse, physio or attendant at home. Confirmation within 2 hours.",
      },
      { property: "og:title", content: "Book care — Home Physio India" },
      { property: "og:description", content: "Book care at home in minutes." },
      { property: "og:url", content: "/booking" },
    ],
    links: [{ rel: "canonical", href: "/booking" }],
  }),
  component: BookingPage,
});

const STEPS = [
  {
    icon: BadgeCheck,
    title: "You send the request",
    body: "Share who needs care, the type and a preferred time.",
  },
  {
    icon: HeartHandshake,
    title: "We shape a plan",
    body: "A care advisor calls to confirm details and pricing.",
  },
  {
    icon: ShieldCheck,
    title: "Your caregiver arrives",
    body: "A verified professional is matched and dispatched.",
  },
];

const TRUST = [
  { icon: ShieldCheck, label: "Verified & trained staff" },
  { icon: Clock3, label: "Confirmation within 2 hours" },
  { icon: BadgeCheck, label: "Transparent pricing, no surprises" },
];

function BookingPage() {
  const { service } = Route.useSearch();
  const { data: settings } = useQuery(settingsQ());
  const phone = (settings?.phone || "+919813095627").replace(/[^\d+]/g, "");
  const whatsapp = (settings?.whatsapp ?? settings?.phone ?? "+919813095627").replace(/\D/g, "");

  return (
    <main className="min-h-screen bg-[#F8F9FA] relative flex flex-col">
      {/* ── Custom Split Hero (Reversed) ──────────────── */}
      <div className="relative isolate overflow-hidden bg-[#fafafa]">
        {/* Subtle background blob */}
        <div className="absolute top-0 left-0 -z-10 w-full h-full opacity-30 bg-gradient-to-r from-primary/10 to-transparent pointer-events-none" />

        <div className="container-x pt-32 pb-12 lg:pt-36 lg:pb-16 grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Image */}
          <div className="relative h-[450px] w-full lg:col-span-5 xl:col-span-5 lg:h-[550px] rounded-[32px] overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] z-10 border border-black/5 transform transition-transform duration-700 hover:scale-[1.02]">
            <img
              src="/assets/hero-nurse-patient.png"
              alt="Doctor and Patient"
              className="w-full h-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80" />
          </div>

          {/* Right Content */}
          <div className="space-y-6 lg:col-span-7 xl:col-span-7 z-10 relative">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
              <ShieldCheck className="h-4 w-4" fill="currentColor" /> Simple, Fast, Secure
            </div>

            {/* Title */}
            <h1 className="font-display text-4xl md:text-5xl lg:text-[64px] font-semibold leading-[1.1] tracking-tight text-foreground">
              Book care in{" "}
              <span className="text-primary relative whitespace-nowrap">
                minutes.
                <svg
                  className="absolute -bottom-1 left-0 w-full h-3 text-accent/30 -z-10"
                  viewBox="0 0 100 20"
                  preserveAspectRatio="none"
                >
                  <path d="M0 10 Q50 0 100 10" stroke="currentColor" strokeWidth="4" fill="none" />
                </svg>
              </span>
            </h1>

            {/* Description */}
            <p className="text-[17px] text-muted-foreground max-w-lg leading-relaxed font-medium">
              Tell us who and when — a care advisor will confirm the details shortly, usually within
              two hours.
            </p>

            {/* Trust Badges */}
            <div className="flex flex-col sm:flex-row gap-5 sm:gap-8 pt-6">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 shadow-sm">
                  <Clock3 className="w-5 h-5" />
                </div>
                <div className="font-bold text-[15px] text-foreground leading-snug">
                  Confirmation
                  <br />
                  <span className="text-muted-foreground font-medium text-[13px]">
                    within 2 hours
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 shadow-sm">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <div className="font-bold text-[15px] text-foreground leading-snug">
                  24/7 care desk
                  <br />
                  <span className="text-muted-foreground font-medium text-[13px]">
                    always available
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Section className="py-16 lg:py-20 relative flex-1">
        <div className="absolute inset-0 bg-[#F8F9FA] z-0 pointer-events-none" />
        <div className="grid gap-10 lg:grid-cols-12 relative z-10">
          {/* Form */}
          <div className="lg:col-span-7">
            <div className="rounded-[32px] border border-white/60 bg-white/70 backdrop-blur-3xl p-8 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.06)] lg:p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -z-10 pointer-events-none" />
              <h2 className="font-display text-[28px] font-semibold tracking-tight md:text-[34px] mb-2 leading-tight">
                Tell us about the care you need
              </h2>
              <p className="text-[15px] text-muted-foreground font-medium mb-10">
                It takes under two minutes — no payment required to request.
              </p>
              <div className="mt-6">
                <BookingForm presetServiceSlug={service} />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-5 h-full">
            <div className="sticky top-28 rounded-[32px] border border-primary/10 bg-gradient-to-b from-primary/[0.03] to-primary/[0.08] backdrop-blur-2xl p-8 lg:p-12 relative overflow-hidden shadow-lg shadow-primary/5">
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -z-10 pointer-events-none" />

              <h3 className="text-[13px] font-bold uppercase tracking-widest text-primary mb-10">
                What happens next
              </h3>

              <div className="relative space-y-10 before:absolute before:inset-y-2 before:left-[1.375rem] before:w-px before:bg-gradient-to-b before:from-primary/20 before:via-primary/20 before:to-transparent">
                {STEPS.map((s, i) => {
                  const Icon = s.icon;
                  return (
                    <div key={i} className="relative flex items-start gap-6 group">
                      <div className="relative z-10 grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white shadow-sm ring-4 ring-white/50 group-hover:scale-110 transition-transform duration-300">
                        <Icon className="h-[22px] w-[22px] text-primary" strokeWidth={2.5} />
                      </div>
                      <div className="pt-1">
                        <div className="font-bold text-[16px] text-foreground">{s.title}</div>
                        <div className="mt-1.5 text-[14px] leading-relaxed text-muted-foreground font-medium">
                          {s.body}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-12 pt-8 border-t border-black/5 space-y-4">
                {TRUST.map((t, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 text-[14px] font-medium text-foreground"
                  >
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0" strokeWidth={2.5} />
                    {t.label}
                  </div>
                ))}
              </div>

              {(phone || whatsapp) && (
                <>
                  <div className="my-8 h-px bg-black/5" />
                  <div className="text-[14px] font-semibold text-muted-foreground mb-4">
                    Prefer to talk to someone now?
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    {phone && (
                      <a
                        href={`tel:${phone}`}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-[14px] font-semibold text-primary-foreground transition-all hover:bg-accent hover:-translate-y-0.5 shadow-md shadow-primary/20"
                      >
                        <Phone className="h-4 w-4" /> Call now
                      </a>
                    )}
                    {whatsapp && (
                      <a
                        href={`https://wa.me/${whatsapp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-black/10 bg-white px-5 py-3 text-[14px] font-semibold transition-all hover:border-primary hover:text-primary hover:-translate-y-0.5 shadow-sm"
                      >
                        <MessageCircle className="h-4 w-4 text-primary" /> WhatsApp
                      </a>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </Section>
    </main>
  );
}
