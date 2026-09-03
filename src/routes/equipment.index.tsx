import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, PackageCheck, XCircle } from "lucide-react";

import { PageHero } from "@/components/site/PageHero";
import { Section, SectionHeader } from "@/components/site/Section";
import { MACHINE_RECOMMENDATIONS, MODALITIES } from "@/lib/plan";
import { equipmentIcon, pageHeroImage } from "@/lib/placeholders";

export const Route = createFileRoute("/equipment/")({
  head: () => ({
    meta: [
      { title: "Portable modality library — Home Physio India" },
      {
        name: "description",
        content:
          "IFT, TENS, UST, NMES, FES, wax bath and more — the portable physiotherapy modalities our therapists bring to your home for ₹100 each.",
      },
      {
        property: "og:title",
        content: "Portable modality library — Home Physio India",
      },
      { property: "og:url", content: "/equipment" },
    ],
    links: [{ rel: "canonical", href: "/equipment" }],
  }),
  component: EquipmentLibrary,
});

const NOT_PORTABLE = ["ESWT", "SWD", "Traction tables", "Large clinic modalities"];

function EquipmentLibrary() {
  return (
    <>
      <PageHero
        eyebrow="Modality library"
        title="The machines that travel to you"
        description="Home visits carry portable equipment only. Add any of these to your booking for ₹100 each — or let your physiotherapist decide after assessment."
        image={pageHeroImage("equipment")}
        crumbs={[{ label: "Home", to: "/" }, { label: "Equipment" }]}
        badges={["₹100 per machine", "Included in packages", "Physio-supervised"]}
      />

      <Section>
        <SectionHeader
          eyebrow="Available at home"
          title="Nine portable modalities"
          description="Each one is carried, set up and operated by your therapist during the session — you don't rent, store or handle any equipment."
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {MODALITIES.map((m) => (
            <article
              key={m.code}
              className="rounded-3xl border border-border/70 bg-card p-6 transition hover:shadow-soft"
            >
              <img src={equipmentIcon(m.code)} alt={m.name} className="h-20 w-20 rounded-2xl object-cover" />
              <h3 className="mt-5 font-display text-xl tracking-tight">{m.name}</h3>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                {m.short}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-foreground/80">
                {m.indication}
              </p>
              <p className="mt-5 text-sm font-semibold text-primary">
                ₹{m.charge} per visit
              </p>
            </article>
          ))}
        </div>
      </Section>

      <Section className="bg-secondary/30">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-3xl border border-border/70 bg-card p-6 sm:p-8">
            <PackageCheck className="h-7 w-7 text-primary" />
            <h3 className="mt-4 font-display text-2xl tracking-tight">
              Suggested by condition
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              A starting point only. Your physiotherapist confirms the final selection
              after assessment and against any doctor's prescription you upload.
            </p>
            <ul className="mt-6 space-y-3">
              {MACHINE_RECOMMENDATIONS.map((r) => (
                <li
                  key={r.condition}
                  className="flex items-baseline justify-between gap-4 rounded-xl bg-secondary/60 px-4 py-3 text-sm"
                >
                  <span className="font-medium">{r.condition}</span>
                  <span className="text-right text-muted-foreground">
                    {r.codes
                      .map((c) => MODALITIES.find((m) => m.code === c)?.name ?? c)
                      .join(" / ")}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-border/70 bg-card p-6 sm:p-8">
            <XCircle className="h-7 w-7 text-muted-foreground" />
            <h3 className="mt-4 font-display text-2xl tracking-tight">
              Not part of home visits
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Non-portable and large clinic equipment cannot be delivered safely to a
              home setting, so it is deliberately absent from our library.
            </p>
            <ul className="mt-6 space-y-2.5">
              {NOT_PORTABLE.map((n) => (
                <li key={n} className="flex items-center gap-2.5 text-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50" />
                  <span className="text-muted-foreground">{n}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 rounded-xl bg-secondary/60 p-4 text-xs leading-relaxed text-muted-foreground">
              If your treatment plan needs clinic-only modalities, your physiotherapist
              will tell you during the assessment rather than after you have paid.
            </p>
          </div>
        </div>
      </Section>

      <Section className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl tracking-tight md:text-4xl">
            Add modalities while you book
          </h2>
          <p className="mt-3 text-primary-foreground/80">
            Select any machines in step two — the price updates instantly, before you pay.
          </p>
          <Link
            to="/booking"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-background px-6 py-3 text-sm font-semibold text-foreground transition hover:opacity-90"
          >
            Book a visit
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Section>
    </>
  );
}
