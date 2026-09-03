import { useState, useEffect, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, BadgeCheck, GraduationCap, Star } from "lucide-react";

import { PageHero } from "@/components/site/PageHero";
import { Section, SectionHeader } from "@/components/site/Section";
import { staffQ } from "@/lib/api/queries";
import { QUALIFICATIONS, THERAPIST_TIERS } from "@/lib/plan";
import { avatarPlaceholder, imageSrc, pageHeroImage } from "@/lib/placeholders";
import { openAuthDialog } from "@/lib/auth-dialog";
import { useIsMobile } from "@/hooks/use-mobile";
import type { StaffMember } from "@/lib/api/types";

export const Route = createFileRoute("/therapists")({
  head: () => ({
    meta: [
      { title: "Our therapists — Home Physio India" },
      {
        name: "description",
        content:
          "Document-verified physiotherapists, yoga therapists and massage therapists delivering home visits across West Bengal.",
      },
      { property: "og:title", content: "Our therapists — Home Physio India" },
      { property: "og:url", content: "/therapists" },
    ],
    links: [{ rel: "canonical", href: "/therapists" }],
  }),
  component: TherapistsPage,
});

import { OurStaffSection, FallbackStaffGrid } from "@/components/site/OurStaffSection";

/* ── Main Page ──────────────────────────────────────────────────── */

function TherapistsPage() {
  const staff = useQuery(staffQ({ limit: 50 }));
  const hasRealData = (staff.data?.items?.length ?? 0) > 0;

  return (
    <>
      <PageHero
        eyebrow="Our therapists"
        title="Verified professionals, matched to you"
        description="Every therapist on the platform is document-verified and admin-approved before taking a single home visit."
        image={pageHeroImage("therapists")}
        crumbs={[{ label: "Home", to: "/" }, { label: "Therapists" }]}
        badges={["Document verified", "Admin approved", "MPT · BPT · PT · DPT"]}
      />

      {/* Category-tabbed staff section (Nupun style) when API has data */}
      {hasRealData ? <OurStaffSection /> : <FallbackStaffGrid />}

      <Section className="bg-secondary/30">
        <SectionHeader
          eyebrow="Tiers"
          title="Three levels of physiotherapy expertise"
          description="Your care category and condition determine which tier is assigned to your booking."
        />
        <div className="grid gap-5 lg:grid-cols-3">
          {THERAPIST_TIERS.map((t) => (
            <div
              key={t.tier}
              className="rounded-3xl border border-border/70 bg-card p-6 sm:p-8"
            >
              <GraduationCap className="h-7 w-7 text-primary" />
              <h3 className="mt-4 font-display text-xl tracking-tight">{t.tier}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{t.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-3xl border border-border/70 bg-card p-6 sm:p-8">
          <h3 className="font-display text-xl tracking-tight">Accepted qualifications</h3>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Registration is approved only after qualification and document verification.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {QUALIFICATIONS.map((q) => (
              <span
                key={q}
                className="rounded-full bg-primary-soft px-4 py-1.5 text-sm font-semibold text-primary"
              >
                {q}
              </span>
            ))}
          </div>
        </div>
      </Section>

      <Section className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl tracking-tight md:text-4xl">
            Are you a therapist?
          </h2>
          <p className="mt-3 text-primary-foreground/80">
            Join a platform with steady home-visit work, portable equipment support and
            transparent payouts. No subscription fee at launch.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => openAuthDialog("therapist_signup")}
              className="inline-flex items-center gap-2 rounded-full bg-background px-6 py-3 text-sm font-semibold text-foreground transition hover:opacity-90"
            >
              Register as a therapist
              <ArrowRight className="h-4 w-4" />
            </button>
            <Link
              to="/careers"
              className="inline-flex items-center rounded-full border border-primary-foreground/30 px-6 py-3 text-sm font-semibold transition hover:bg-primary-foreground/10"
            >
              See open roles
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
