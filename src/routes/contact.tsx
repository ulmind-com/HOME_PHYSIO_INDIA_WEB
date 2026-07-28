import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { settingsQ } from "@/lib/api/queries";
import { PageHero } from "@/components/site/PageHero";
import { Section } from "@/components/site/Section";
import { ContactForm } from "@/components/forms/ContactForm";
import { Mail, Phone, MapPin, MessageCircle, Clock } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Nupun Home Health Care" },
      { name: "description", content: "Talk to a care advisor. We respond within 2 hours." },
      { property: "og:title", content: "Contact — Nupun Home Health Care" },
      { property: "og:description", content: "Talk to a care advisor." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { data: settings } = useQuery(settingsQ());
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Talk to a care advisor."
        description="Tell us what you need — we typically respond within two hours."
        crumbs={[{ label: "Home", to: "/" }, { label: "Contact" }]}
      />
      <Section className="pt-4">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5 space-y-4">
            {settings?.phone && (
              <InfoCard icon={Phone} label="Call" value={settings.phone} href={`tel:${settings.phone}`} />
            )}
            {settings?.whatsapp && (
              <InfoCard icon={MessageCircle} label="WhatsApp" value={settings.whatsapp} href={`https://wa.me/${settings.whatsapp.replace(/\D/g, "")}`} />
            )}
            {settings?.email && (
              <InfoCard icon={Mail} label="Email" value={settings.email} href={`mailto:${settings.email}`} />
            )}
            {settings?.address && (
              <InfoCard icon={MapPin} label="Visit" value={settings.address} />
            )}
            {settings?.working_hours && settings.working_hours.length > 0 && (
              <div className="rounded-3xl border border-border bg-surface p-6">
                <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-accent mb-3">
                  <Clock className="h-3.5 w-3.5" /> Working hours
                </div>
                <div className="grid gap-2 text-sm">
                  {settings.working_hours.map((h) => (
                    <div key={h.day} className="flex justify-between border-t border-border pt-2 first:border-0 first:pt-0">
                      <span className="text-muted-foreground">{h.day}</span>
                      <span className="font-medium">{h.hours}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {settings?.google_map_embed && (
              <div
                className="overflow-hidden rounded-3xl border border-border aspect-video"
                dangerouslySetInnerHTML={{ __html: settings.google_map_embed }}
              />
            )}
          </div>
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
        </div>
      </Section>
    </>
  );
}

function InfoCard({ icon: Icon, label, value, href }: { icon: typeof Mail; label: string; value: string; href?: string }) {
  const inner = (
    <>
      <div className="h-10 w-10 rounded-2xl bg-primary-soft grid place-items-center text-accent shrink-0">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <div className="text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
        <div className="mt-0.5 text-sm font-medium break-words">{value}</div>
      </div>
    </>
  );
  return href ? (
    <a href={href} className="flex items-center gap-4 rounded-3xl border border-border bg-surface p-5 hover:border-primary transition-colors">
      {inner}
    </a>
  ) : (
    <div className="flex items-start gap-4 rounded-3xl border border-border bg-surface p-5">{inner}</div>
  );
}
