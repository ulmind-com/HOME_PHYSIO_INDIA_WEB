import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { settingsQ } from "@/lib/api/queries";
import { PageHero } from "@/components/site/PageHero";
import { Section } from "@/components/site/Section";
import { LegalPage } from "@/components/site/LegalPage";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Home Physio India" },
      { name: "description", content: "How Home Physio India collects, uses and protects your information." },
      { property: "og:url", content: "/privacy" },
    ],
    links: [{ rel: "canonical", href: "/privacy" }],
  }),
  component: Page,
});

function Page() {
  const { data: settings } = useQuery(settingsQ());
  
  const defaultSections = [
    {
      title: "What we collect",
      body: "We collect the details you provide when booking care, requesting equipment, contacting us, or applying to jobs — names, contact info, addresses, and any information you volunteer about care needs. We may also collect basic device information (browser, IP) for security and analytics.",
    },
    {
      title: "How we use it",
      body: "To arrange and deliver the care you request, to communicate with you about bookings, to improve our services, and to comply with legal obligations.",
    },
    {
      title: "Who we share it with",
      body: "Only with the caregivers assigned to your case, our internal care coordinators, and trusted service providers (SMS, email, hosting) under strict confidentiality.",
    },
    {
      title: "How we protect it",
      body: "We store information on secure servers, restrict access on a need-to-know basis, and use TLS in transit. Medical information is treated with additional care.",
    },
    {
      title: "Your choices",
      body: "You can request access, correction or deletion of your personal information at any time by contacting us.",
    },
    { title: "Contact", body: "For privacy questions, email us via the contact page." },
  ];

  const sections = settings?.privacy_sections?.length ? settings.privacy_sections : defaultSections;

  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Privacy policy"
        description="How Home Physio India collects, uses and protects your information."
        crumbs={[{ label: "Home", to: "/" }, { label: "Privacy" }]}
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
