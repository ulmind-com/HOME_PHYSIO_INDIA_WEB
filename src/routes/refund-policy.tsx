import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { settingsQ } from "@/lib/api/queries";
import { PageHero } from "@/components/site/PageHero";
import { Section } from "@/components/site/Section";
import { LegalPage } from "@/components/site/LegalPage";

export const Route = createFileRoute("/refund-policy")({
  head: () => ({
    meta: [
      { title: "Refund Policy — Home Physio India" },
      {
        name: "description",
        content: "Our refund and cancellation policy for home care services and equipment rentals.",
      },
      { property: "og:url", content: "/refund-policy" },
    ],
    links: [{ rel: "canonical", href: "/refund-policy" }],
  }),
  component: Page,
});

function Page() {
  const { data: settings } = useQuery(settingsQ());

  const defaultSections = [
    {
      title: "Care services",
      body: "Cancellations made at least 24 hours before a scheduled visit are fully refundable. Cancellations within 24 hours may be charged up to 50% of the visit fee.",
    },
    {
      title: "Equipment rentals",
      body: "Prepaid rentals may be cancelled before delivery for a full refund. Once delivered, unused days are refundable pro-rata after inspection.",
    },
    {
      title: "Quality concerns",
      body: "If you're not satisfied with a visit, contact us within 48 hours — we'll investigate and, where appropriate, issue a full or partial refund.",
    },
    {
      title: "Refund method",
      body: "Refunds are processed to the original payment method within 7–10 business days.",
    },
    { title: "Contact", body: "For refund questions, reach us via the contact page." },
  ];

  const sections = settings?.refund_sections?.length ? settings.refund_sections : defaultSections;

  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Refund policy"
        crumbs={[{ label: "Home", to: "/" }, { label: "Refund policy" }]}
      />
      <Section className="pt-4">
        <LegalPage
          updated="July 2026"
          sections={sections}
        />
      </Section>
    </>
  );
}
