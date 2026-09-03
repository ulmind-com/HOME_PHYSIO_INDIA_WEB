import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { BookingWizard } from "@/components/booking/BookingWizard";
import { PageHero } from "@/components/site/PageHero";
import { SLUG_TO_CATEGORY, type ServiceCategory } from "@/lib/api/therapy";

const searchSchema = z.object({
  service: z.string().optional(),
});

export const Route = createFileRoute("/booking")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Book a home visit — Home Physio India" },
      {
        name: "description",
        content:
          "Book home physiotherapy, yoga therapy, massage therapy or home rehabilitation across West Bengal. Transparent pricing, verified therapists.",
      },
      { property: "og:title", content: "Book a home visit — Home Physio India" },
      { property: "og:url", content: "/booking" },
    ],
    links: [{ rel: "canonical", href: "/booking" }],
  }),
  component: BookingPage,
});

function BookingPage() {
  const { service } = Route.useSearch();
  const initialCategory: ServiceCategory =
    (service && SLUG_TO_CATEGORY[service]) || "physiotherapy";

  return (
    <>
      <PageHero
        eyebrow="Booking"
        title="Book your home visit"
        description="Five short steps. Your price is calculated live and itemised before you pay a rupee."
        crumbs={[{ label: "Home", to: "/" }, { label: "Book a visit" }]}
        badges={["Verified therapists", "Itemised pricing", "OTP-backed attendance"]}
      />
      <section className="py-14 lg:py-20">
        <div className="container-x">
          <BookingWizard initialCategory={initialCategory} />
        </div>
      </section>
    </>
  );
}
