import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { PageHero } from "@/components/site/PageHero";
import { Section, SectionHeader } from "@/components/site/Section";
import {
  CONSULTATION_FEE,
  DAILY_FREQUENCY,
  MACHINE_CHARGE,
  MASSAGE_OPTIONS,
  PACKAGES,
  SERVICES,
  WEEKLY_RATE,
} from "@/lib/plan";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — Home Physio India" },
      {
        name: "description",
        content:
          "Transparent home therapy pricing: ₹400 per physiotherapy visit, ₹100 per portable machine, massage from ₹800, and a clear platform fee.",
      },
      { property: "og:title", content: "Pricing — Home Physio India" },
      { property: "og:url", content: "/pricing" },
    ],
    links: [{ rel: "canonical", href: "/pricing" }],
  }),
  component: PricingPage,
});

const EXAMPLES = [
  {
    label: "Without machine",
    rows: [
      ["Therapist visit", 400],
      ["Machine charge", 0],
    ] as [string, number][],
    total: 400,
    fee: 80,
    payout: 320,
    percent: 20,
  },
  {
    label: "With 1 machine",
    rows: [
      ["Therapist visit", 400],
      ["Machine charge", 100],
    ] as [string, number][],
    total: 500,
    fee: 100,
    payout: 400,
    percent: 20,
  },
  {
    label: "With 2 machines",
    rows: [
      ["Therapist visit", 400],
      ["Machine charges", 200],
    ] as [string, number][],
    total: 600,
    fee: 120,
    payout: 480,
    percent: 20,
  },
];

function PricingPage() {
  return (
    <>
      <PageHero
        eyebrow="Pricing"
        title="Every rupee, itemised before you pay"
        description="Visit fee, machine charge and platform fee are shown on the booking screen and on every receipt. Nothing is added afterwards."
        crumbs={[{ label: "Home", to: "/" }, { label: "Pricing" }]}
      />

      <Section>
        <SectionHeader
          eyebrow="Visit pricing"
          title="Physiotherapy, yoga therapy & rehabilitation"
          description="Daily frequency is priced by the number of visits in a day. Weekly and package plans are a flat ₹400 per visit."
        />

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border border-border/70 bg-card p-6 sm:p-8">
            <p className="text-xs uppercase tracking-[0.18em] text-primary">Daily</p>
            <ul className="mt-5 space-y-3">
              {DAILY_FREQUENCY.map((d) => (
                <li key={d.visits} className="flex items-baseline justify-between gap-4">
                  <span className="text-sm text-foreground/80">{d.label}</span>
                  <span className="font-display text-xl tabular-nums">₹{d.price}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-border/70 bg-card p-6 sm:p-8">
            <p className="text-xs uppercase tracking-[0.18em] text-primary">Weekly</p>
            <p className="mt-5 font-display text-4xl">₹{WEEKLY_RATE}</p>
            <p className="mt-1 text-sm text-muted-foreground">per visit</p>
            <p className="mt-4 text-sm text-foreground/80">
              Choose 1 to 7 days per week. Each selected day carries one visit.
            </p>
          </div>

          <div className="rounded-3xl border border-primary/30 bg-primary-soft/50 p-6 sm:p-8">
            <p className="text-xs uppercase tracking-[0.18em] text-primary">
              Machine charge
            </p>
            <p className="mt-5 font-display text-4xl">₹{MACHINE_CHARGE}</p>
            <p className="mt-1 text-sm text-muted-foreground">per portable machine</p>
            <p className="mt-4 text-sm text-foreground/80">
              Applied per visit on daily and weekly plans. Package plans include
              applicable machine use at no extra charge.
            </p>
          </div>
        </div>
      </Section>

      <Section className="bg-secondary/30">
        <SectionHeader
          eyebrow="Worked examples"
          title="How the total is built"
          description="Total booking amount = visit fee + machine charges. The platform fee is a percentage of that total, not an addition to it."
        />
        <div className="grid gap-6 lg:grid-cols-3">
          {EXAMPLES.map((ex) => (
            <div
              key={ex.label}
              className="rounded-3xl border border-border/70 bg-card p-6 sm:p-8"
            >
              <p className="font-display text-lg">{ex.label}</p>
              <dl className="mt-5 space-y-2.5 text-sm">
                {ex.rows.map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">{k}</dt>
                    <dd className="tabular-nums">₹{v}</dd>
                  </div>
                ))}
                <div className="flex justify-between gap-4 border-t border-border/70 pt-2.5 font-semibold">
                  <dt>Total booking amount</dt>
                  <dd className="tabular-nums text-primary">₹{ex.total}</dd>
                </div>
                <div className="flex justify-between gap-4 text-muted-foreground">
                  <dt>Platform fee ({ex.percent}%)</dt>
                  <dd className="tabular-nums">₹{ex.fee}</dd>
                </div>
                <div className="flex justify-between gap-4 text-muted-foreground">
                  <dt>Therapist payout</dt>
                  <dd className="tabular-nums">₹{ex.payout}</dd>
                </div>
              </dl>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeader
          eyebrow="Packages"
          title="Longer programmes, same per-visit rate"
          description="Every package is billed at ₹400 per visit, with applicable portable machine use included where the package terms allow."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {PACKAGES.map((p) => (
            <div
              key={p.value}
              className="rounded-2xl border border-border/70 bg-card p-6 text-center"
            >
              <p className="font-display text-lg">{p.label}</p>
              <p className="mt-1 text-xs text-muted-foreground">{p.months}</p>
              <p className="mt-5 font-display text-3xl text-primary">₹400</p>
              <p className="text-[11px] text-muted-foreground">per visit</p>
            </div>
          ))}
        </div>
      </Section>

      <Section className="bg-secondary/30">
        <SectionHeader
          eyebrow="Massage therapy"
          title="Fixed session pricing"
          description="45–60 minutes standard. Sessions beyond 60 minutes carry an additional ₹100. No package discounts apply to massage therapy."
        />
        <div className="grid gap-4 sm:grid-cols-3">
          {MASSAGE_OPTIONS.map((m) => (
            <div
              key={m.value}
              className="rounded-2xl border border-border/70 bg-card p-6 text-center"
            >
              <p className="font-display text-lg">{m.label}</p>
              <p className="mt-5 font-display text-3xl text-primary">₹{m.price}</p>
              <p className="text-[11px] text-muted-foreground">45–60 minutes</p>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeader
          eyebrow="Platform fee"
          title="What we keep, and why"
          description="The platform fee covers verification, matching, payment handling, reporting and support. It is taken out of the total booking amount — never charged on top."
        />
        <div className="overflow-hidden rounded-3xl border border-border/70">
          <table className="w-full text-sm">
            <thead className="bg-secondary/60 text-left">
              <tr>
                <th className="px-5 py-3.5 font-medium">Service</th>
                <th className="px-5 py-3.5 text-right font-medium">Platform fee</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/70 bg-card">
              {SERVICES.map((s) => (
                <tr key={s.category}>
                  <td className="px-5 py-3.5">{s.name}</td>
                  <td className="px-5 py-3.5 text-right font-semibold tabular-nums">
                    {s.platformFee}%
                  </td>
                </tr>
              ))}
              <tr>
                <td className="px-5 py-3.5">Physiotherapy package</td>
                <td className="px-5 py-3.5 text-right font-semibold tabular-nums">20%</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-border/70 bg-card p-6">
            <p className="font-display text-lg">Online consultation</p>
            <p className="mt-4 font-display text-3xl text-primary">
              ₹{CONSULTATION_FEE}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              24×7 video consultation with a physiotherapist.
            </p>
          </div>
          <div className="rounded-2xl border border-border/70 bg-card p-6">
            <p className="font-display text-lg">Booking confirmation fee</p>
            <p className="mt-4 text-sm text-foreground/80">
              Your advance payment at booking is the confirmation fee. It secures your
              slot and appears in full on your booking record and receipt.
            </p>
            <Link
              to="/refund-policy"
              className="mt-4 inline-flex text-sm font-medium text-primary hover:underline"
            >
              Cancellation & refund terms →
            </Link>
          </div>
        </div>
      </Section>

      <Section className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl tracking-tight md:text-4xl">
            See your exact price in under a minute
          </h2>
          <p className="mt-3 text-primary-foreground/80">
            The booking flow prices your plan live as you choose it — no estimates.
          </p>
          <Link
            to="/booking"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-background px-6 py-3 text-sm font-semibold text-foreground transition hover:opacity-90"
          >
            Start booking
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Section>
    </>
  );
}
