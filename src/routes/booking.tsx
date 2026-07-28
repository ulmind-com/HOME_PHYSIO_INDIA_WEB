import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
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

function BookingPage() {
  const { service } = Route.useSearch();
  return (
    <>
      <PageHero
        eyebrow="Book care"
        title="Book care in minutes."
        description="Tell us who and when — a care advisor will confirm the details shortly."
        crumbs={[{ label: "Home", to: "/" }, { label: "Book care" }]}
      />
      <Section className="pt-4">
        <div className="mx-auto max-w-2xl">
          <BookingForm presetServiceSlug={service} />
        </div>
      </Section>
    </>
  );
}
