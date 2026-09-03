import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { MessageCircle, Phone, ExternalLink } from "lucide-react";
import { faqsQ, settingsQ } from "@/lib/api/queries";
import { PageHero } from "@/components/site/PageHero";
import { FaqAccordion } from "@/components/site/FaqAccordion";
import { EmptyState, Section } from "@/components/site/Section";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — Home Physio India" },
      {
        name: "description",
        content: "Answers to common questions about Home Physio India's care services and equipment.",
      },
      { property: "og:title", content: "FAQ — Home Physio India" },
      { property: "og:description", content: "Common questions about our care and equipment." },
      { property: "og:url", content: "/faq" },
    ],
    links: [{ rel: "canonical", href: "/faq" }],
  }),
  component: FaqPage,
});

/**
 * Maps FAQ category names to their corresponding service page routes.
 * When a user clicks a category tab, they are navigated to the service
 * page's FAQ section (with #faq hash) for that category.
 */
const CATEGORY_ROUTES: Record<string, string> = {
  Physiotherapy: "/services/physiotherapy#faq",
  "Yoga Therapy": "/services/yoga-therapy#faq",
  "Massage Therapy": "/services/massage-therapy#faq",
  "Home Rehabilitation": "/services/home-rehabilitation#faq",
  Equipment: "/equipment",
  Pricing: "/pricing",
  Booking: "/booking",
  Services: "/services",
  Support: "/faq",
};

/**
 * Seed answers to the questions the business plan commits us to, shown until
 * the admin panel has published its own FAQ set. API entries are appended and
 * de-duplicated by question, so an admin answer always wins.
 */
const SEED_FAQS = [
  {
    id: "seed-1",
    question: "Which services do you provide at home?",
    answer:
      "Home visit physiotherapy, home visit yoga therapy, home visit massage therapy and home rehabilitation — all delivered at your address by a verified therapist.",
    category: "Services",
  },
  {
    id: "seed-2",
    question: "How much does a physiotherapy visit cost?",
    answer:
      "A therapist visit is ₹400. One visit a day is ₹400, two visits ₹600 and three visits ₹800. Each portable machine used adds ₹100 per visit. Your total is shown before you pay.",
    category: "Pricing",
  },
  {
    id: "seed-3",
    question: "How long is a session?",
    answer:
      "Physiotherapy, yoga therapy and rehabilitation sessions run 40 to 60 minutes. Massage therapy runs 45 to 60 minutes; beyond 60 minutes an additional ₹100 applies.",
    category: "Services",
  },
  {
    id: "seed-4",
    question: "Which machines can the therapist bring?",
    answer:
      "Portable modalities only — IFT, TENS, UST, NMES, FES, portable EMS, wax bath, hot/cold therapy and TheraBand. Large clinic equipment such as SWD and ESWT is not part of home visits.",
    category: "Equipment",
  },
  {
    id: "seed-5",
    question: "Do packages include machine charges?",
    answer:
      "Yes. Monthly, quarterly, half-yearly, yearly and custom packages are billed at ₹400 per visit with applicable portable machine use included.",
    category: "Pricing",
  },
  {
    id: "seed-6",
    question: "Will I get a therapist of the same gender for massage?",
    answer:
      "Always. Male patients are assigned male therapists and female patients female therapists. We do not provide intimate or sexual services of any kind.",
    category: "Massage Therapy",
  },
  {
    id: "seed-7",
    question: "Can I upload my prescription or scans?",
    answer:
      "Yes. Upload prescriptions, X-Rays, MRI scans and medical reports from your dashboard. You can follow each one through Uploaded, Viewed and Reviewed, along with your physiotherapist's notes.",
    category: "Booking",
  },
  {
    id: "seed-8",
    question: "Where do you operate?",
    answer:
      "Across West Bengal — urban, rural, village and locality areas. We expand to other states next, and then across India.",
    category: "Services",
  },
];

function FaqPage() {
  const { data, isLoading } = useQuery(faqsQ({ limit: 200 }));
  const dbItems = data?.items ?? [];
  const navigate = useNavigate();

  // Seed answers stay; admin-published FAQs are appended, de-duplicated by question.
  const seedQuestions = new Set(SEED_FAQS.map((f) => f.question.toLowerCase()));
  const apiFaqs = dbItems.filter((f) => !seedQuestions.has(f.question.toLowerCase()));
  const items = [...SEED_FAQS, ...apiFaqs];

  const categories = useMemo(() => {
    const set = new Set<string>();
    items.forEach((f) => f.category && set.add(f.category));
    return ["all", ...Array.from(set)];
  }, [items]);

  const handleCategoryClick = (category: string) => {
    if (category === "all") return; // "All" stays on this page

    const route = CATEGORY_ROUTES[category];
    if (route && route !== "/faq") {
      // Navigate to the service page's FAQ section
      const [path, hash] = route.split("#");
      navigate({ to: path }).then(() => {
        // After navigation, scroll to the FAQ section
        setTimeout(() => {
          const el = document.getElementById(hash || "faq");
          el?.scrollIntoView({ behavior: "smooth" });
        }, 300);
      });
    }
  };

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
                const isAll = c === "all";
                const hasRoute = !isAll && CATEGORY_ROUTES[c] && CATEGORY_ROUTES[c] !== "/faq";
                return isAll ? (
                  <button
                    key={c}
                    className="rounded-full px-5 py-2.5 text-[15px] font-medium transition-all duration-300 shadow-sm bg-primary text-white border border-primary shadow-[0_4px_14px_var(--color-primary),0.3)] hover:-translate-y-0.5"
                  >
                    All
                  </button>
                ) : (
                  <button
                    key={c}
                    onClick={() => handleCategoryClick(c)}
                    className="group rounded-full px-5 py-2.5 text-[15px] font-medium transition-all duration-300 shadow-sm bg-white text-foreground border border-black/5 hover:border-primary/30 hover:shadow-md hover:-translate-y-0.5 inline-flex items-center gap-2"
                  >
                    {c}
                    {hasRoute && (
                      <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <FaqAccordion key="all" items={items} />
      </div>
    </main>
  );
}
