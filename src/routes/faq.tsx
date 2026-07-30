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
      {
        name: "description",
        content: "Answers to common questions about Nupun's care services and equipment.",
      },
      { property: "og:title", content: "FAQ — Nupun Home Health Care" },
      { property: "og:description", content: "Common questions about our care and equipment." },
      { property: "og:url", content: "/faq" },
    ],
    links: [{ rel: "canonical", href: "/faq" }],
  }),
  component: FaqPage,
});

const DUMMY_FAQS = [
  {
    id: "1",
    question: "Do you provide elder care at home?",
    answer:
      "Yes, we provide comprehensive elder care services right at your home, ensuring comfort and professional medical attention.",
    category: "Elder Care",
  },
  {
    id: "2",
    question: "I live outside my home town. Can I still arrange care for my parents there?",
    answer:
      "Absolutely. You can coordinate and monitor the care plan remotely through our care desk.",
    category: "Support",
  },
  {
    id: "3",
    question: "Can I book a caregiver for only a few hours a day?",
    answer:
      "Yes, we offer flexible durations. You can book a caregiver for as little as 4 hours a day or opt for 24/7 care.",
    category: "Services",
  },
  {
    id: "4",
    question: "What's the difference between a caregiver and a nurse at home?",
    answer:
      "A caregiver assists with daily living activities (bathing, feeding, mobility), while a registered nurse provides medical care (injections, wound care, monitoring).",
    category: "Medical Care",
  },
  {
    id: "5",
    question: "Can you help after a hospital discharge or surgery at home?",
    answer:
      "Yes, our post-operative care team ensures a smooth transition from hospital to home, including wound care and physiotherapy.",
    category: "Medical Care",
  },
  {
    id: "6",
    question: "Do you provide 24-hour or overnight care if required?",
    answer:
      "Yes, we provide round-the-clock 24-hour care as well as dedicated overnight shifts based on your requirements.",
    category: "Elder Care",
  },
];

function FaqPage() {
  const { data, isLoading } = useQuery(faqsQ({ limit: 200 }));
  const dbItems = data?.items ?? [];
  const items = dbItems.length > 0 ? dbItems : DUMMY_FAQS;

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
    <main className="min-h-screen bg-[#fafafa] pt-32 pb-24">
      <div className="container-x max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="font-display text-4xl md:text-[44px] font-bold tracking-tight text-foreground mb-8">
            Frequently Asked Questions
          </h1>

          {categories.length > 1 && (
            <div className="flex flex-wrap justify-center gap-3 mb-10">
              {categories.map((c) => {
                const isActive = c === active;
                return (
                  <button
                    key={c}
                    onClick={() => setActive(c)}
                    className={`rounded-full px-5 py-2.5 text-[15px] font-medium transition-all duration-300 shadow-sm ${
                      isActive
                        ? "bg-[#007BFF] text-white border border-[#007BFF] shadow-[0_4px_14px_rgba(0,123,255,0.3)] hover:-translate-y-0.5"
                        : "bg-white text-foreground border border-black/5 hover:border-black/10 hover:shadow-md hover:-translate-y-0.5"
                    }`}
                  >
                    {c === "all" ? "All" : c}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <FaqAccordion key={active} items={filtered} />
      </div>
    </main>
  );
}
