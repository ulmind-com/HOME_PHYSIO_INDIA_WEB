import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { MessageCircle, Phone } from "lucide-react";
import { faqsQ, settingsQ } from "@/lib/api/queries";
import { PageHero } from "@/components/site/PageHero";
import { FaqAccordion } from "@/components/site/FaqAccordion";
import { EmptyState, Section } from "@/components/site/Section";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — Nupun Home Health Care" },
      { name: "description", content: "Answers to common questions about Nupun's care services and equipment." },
      { property: "og:title", content: "FAQ — Nupun Home Health Care" },
      { property: "og:description", content: "Common questions about our care and equipment." },
      { property: "og:url", content: "/faq" },
    ],
    links: [{ rel: "canonical", href: "/faq" }],
  }),
  component: FaqPage,
});

function FaqPage() {
  const { data, isLoading } = useQuery(faqsQ({ limit: 200 }));
  const { data: settings } = useQuery(settingsQ());
  const items = data?.items ?? [];
  const phone = settings?.phone?.replace(/[^\d+]/g, "");
  const whatsapp = (settings?.whatsapp ?? settings?.phone)?.replace(/\D/g, "");

  const [active, setActive] = useState("all");

  const categories = useMemo(() => {
    const set = new Set<string>();
    items.forEach((f) => f.category && set.add(f.category));
    return ["all", ...Array.from(set)];
  }, [items]);

  const filtered = useMemo(
    () => (active === "all" ? items : items.filter((f) => f.category === active)),
    [items, active],
  );

  return (
    <>
      <PageHero
        eyebrow="FAQ"
        title="Frequently Asked Questions"
        description="Everything families usually want to know about our caregivers, pricing and how care at home works."
        crumbs={[{ label: "Home", to: "/" }, { label: "FAQ" }]}
      />
      <Section className="pt-16 lg:pt-20">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Sticky intro / CTA */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <h2 className="font-display text-2xl tracking-tight md:text-3xl">Still have a question?</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Our care desk is available around the clock. Reach out and a real person will help you figure
                out the right care.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
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
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-semibold transition-colors hover:border-primary"
                >
                  Contact us
                </Link>
              </div>
            </div>
          </div>

          {/* Category pills + accordion */}
          <div className="lg:col-span-8">
            {categories.length > 1 && (
              <div className="mb-6 flex flex-wrap gap-2.5">
                {categories.map((c) => {
                  const isActive = c === active;
                  return (
                    <button
                      key={c}
                      onClick={() => setActive(c)}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "border border-border bg-surface text-muted-foreground hover:border-primary hover:text-foreground"
                      }`}
                    >
                      {c === "all" ? "All" : c}
                    </button>
                  );
                })}
              </div>
            )}

            {isLoading ? (
              <div className="h-96 rounded-3xl border border-border bg-surface animate-pulse" />
            ) : filtered.length ? (
              <FaqAccordion key={active} items={filtered} />
            ) : (
              <EmptyState title="FAQs coming soon" />
            )}
          </div>
        </div>
      </Section>
    </>
  );
}
