import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { settingsQ } from "@/lib/api/queries";
import { PageHero } from "@/components/site/PageHero";
import { Section } from "@/components/site/Section";
import { LegalPage } from "@/components/site/LegalPage";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions — Nupun Home Health Care" },
      { name: "description", content: "Terms governing use of Nupun's services and website." },
      { property: "og:url", content: "/terms" },
    ],
    links: [{ rel: "canonical", href: "/terms" }],
  }),
  component: Page,
});

function Page() {
  const { data: settings } = useQuery(settingsQ());

  const defaultSections = [
    {
      title: "Acceptance",
      body: "By booking care, renting equipment or using this website, you agree to these terms.",
    },
    {
      title: "Services",
      body: "Nupun coordinates home nursing, physiotherapy, elder care and equipment rentals. Availability, pricing and clinical suitability are confirmed at the time of booking.",
    },
    {
      title: "Payments",
      body: "Fees are as quoted at booking. Additional charges may apply for extended visits, materials or emergencies, and will be communicated in advance where possible.",
    },
    {
      title: "Cancellations",
      body: "You may cancel or reschedule as per the terms shown at booking. Late cancellations may incur a fee.",
    },
    {
      title: "Medical disclaimer",
      body: "Our services complement, but do not replace, direct physician care. In emergencies please call your local emergency number.",
    },
    {
      title: "Liability",
      body: "To the maximum extent permitted by law, Nupun's liability is limited to the fees paid for the specific service in question.",
    },
    {
      title: "Changes",
      body: "We may update these terms from time to time; continued use of our services means acceptance of the updated terms.",
    },
  ];

  const sections = settings?.terms_sections?.length ? settings.terms_sections : defaultSections;

  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Terms & conditions"
        crumbs={[{ label: "Home", to: "/" }, { label: "Terms" }]}
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
