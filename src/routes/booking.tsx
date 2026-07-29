import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { Phone, MessageCircle, Clock3, ShieldCheck, BadgeCheck, HeartHandshake } from "lucide-react";
import { settingsQ } from "@/lib/api/queries";
import { PageHero } from "@/components/site/PageHero";
import { Section } from "@/components/site/Section";
import { BookingForm } from "@/components/forms/BookingForm";

const searchSchema = z.object({ service: z.string().optional() });

export const Route = createFileRoute("/booking")({
  validateSearch: (s) => searchSchema.parse(s),
  head: () => ({
    meta: [
      { title: "Book care — Nupun Home Health Care" },
      { name: "description", content: "Book a nurse, physio or attendant at home. Confirmation within 2 hours." },
      { property: "og:title", content: "Book care — Nupun" },
      { property: "og:description", content: "Book care at home in minutes." },
      { property: "og:url", content: "/booking" },
    ],
    links: [{ rel: "canonical", href: "/booking" }],
  }),
  component: BookingPage,
});

const STEPS = [
  { icon: BadgeCheck, title: "You send the request", body: "Share who needs care, the type and a preferred time." },
  { icon: HeartHandshake, title: "We shape a plan", body: "A care advisor calls to confirm details and pricing." },
  { icon: ShieldCheck, title: "Your caregiver arrives", body: "A verified professional is matched and dispatched." },
];

const TRUST = [
  { icon: ShieldCheck, label: "Verified & trained staff" },
  { icon: Clock3, label: "Confirmation within 2 hours" },
  { icon: BadgeCheck, label: "Transparent pricing, no surprises" },
];

function BookingPage() {
  const { service } = Route.useSearch();
  const { data: settings } = useQuery(settingsQ());
  const phone = settings?.phone?.replace(/[^\d+]/g, "");
  const whatsapp = (settings?.whatsapp ?? settings?.phone)?.replace(/\D/g, "");

  return (
    <>
      <PageHero
        eyebrow="Book care"
        title="Book care in minutes."
        description="Tell us who and when — a care advisor will confirm the details shortly, usually within two hours."
        crumbs={[{ label: "Home", to: "/" }, { label: "Book care" }]}
        badges={["Confirmation within 2 hours", "24/7 care desk"]}
      />
      <Section className="pt-16 lg:pt-20">
        <div className="grid gap-10 lg:grid-cols-12">
          {/* Form */}
          <div className="lg:col-span-7">
            <div className="rounded-[2rem] border border-border bg-surface p-6 shadow-[0_30px_80px_-50px_rgba(0,0,0,0.4)] lg:p-9">
              <h2 className="font-display text-2xl tracking-tight md:text-3xl">Tell us about the care you need</h2>
              <p className="mt-1.5 text-sm text-muted-foreground">
                It takes under two minutes — no payment required to request.
              </p>
              <div className="mt-6">
                <BookingForm presetServiceSlug={service} />
              </div>
            </div>
          </div>

          {/* Reassurance sidebar */}
          <div className="space-y-6 lg:col-span-5">
            <div className="rounded-[2rem] border border-border bg-primary-soft/40 p-6 lg:p-8">
              <div className="text-xs uppercase tracking-[0.18em] text-accent">What happens next</div>
              <div className="mt-5 space-y-5">
                {STEPS.map((s, i) => (
                  <div key={s.title} className="flex gap-4">
                    <div className="relative">
                      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground">
                        <s.icon className="h-4 w-4" />
                      </div>
                      {i < STEPS.length - 1 && (
                        <span className="absolute left-1/2 top-10 h-5 w-px -translate-x-1/2 bg-border" />
                      )}
                    </div>
                    <div>
                      <div className="font-display text-base">{s.title}</div>
                      <div className="mt-0.5 text-sm text-muted-foreground">{s.body}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-border bg-surface p-6 lg:p-8">
              <div className="space-y-3">
                {TRUST.map((t) => (
                  <div key={t.label} className="flex items-center gap-3 text-sm">
                    <t.icon className="h-4 w-4 text-accent" />
                    <span className="text-foreground/80">{t.label}</span>
                  </div>
                ))}
              </div>
              {(phone || whatsapp) && (
                <>
                  <div className="my-6 h-px bg-border" />
                  <div className="text-sm text-muted-foreground">Prefer to talk to someone now?</div>
                  <div className="mt-3 flex flex-wrap gap-3">
                    {phone && (
                      <a
                        href={`tel:${phone}`}
                        className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-accent"
                      >
                        <Phone className="h-4 w-4" /> Call now
                      </a>
                    )}
                    {whatsapp && (
                      <a
                        href={`https://wa.me/${whatsapp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-semibold transition-colors hover:border-primary"
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
    </>
  );
}
