import os

content = """import React from "react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { settingsQ, socialQ, servicesQ } from "@/lib/api/queries";
import { WebVitalsTracker } from "@/lib/telemetry";
import { Phone, Siren, HelpCircle } from "lucide-react";

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const YoutubeIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.015 3.015 0 0 0-2.122 2.136C0 8.07 0 12 0 12s0 3.93.498 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.55 9.377.55 9.377.55s7.505 0 9.377-.55a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

const MENU_LINKS = [
  { label: "About Us", to: "/about" },
  { label: "Care Blog", to: "/blogs" },
  { label: "Careers", to: "/careers" },
  { label: "Privacy Policy", to: "/privacy" },
  { label: "Terms of Service", to: "/terms" },
  { label: "Refund Policy", to: "/refund-policy" },
];

const SERVICES_LINKS = [
  { label: "Home Nursing Care", to: "/nursing-care" },
  { label: "Elderly Care", to: "/elderly-care" },
  { label: "Mother & Baby Care", to: "/mother-baby-care" },
  { label: "Physiotherapy & Recovery", to: "/physiotherapy" },
  { label: "Home Sample Collection", to: "/services" },
];

const SUPPORT_LINKS = [
  { label: "Contact Us", to: "/contact" },
  { label: "FAQ", to: "/faq" },
  { label: "Medical Equipment Rental", to: "/medical-equipment" },
  { label: "ICU Setup", to: "/icu-setup" },
];

export function Footer() {
  const { data: settings } = useQuery(settingsQ());
  const { data: social } = useQuery(socialQ());

  const name = settings?.website_name ?? "Home Physio India";
  const phone = settings?.contact_phone ?? "+91 9876543210";
  const whatsapp = settings?.whatsapp_number ?? phone;

  return (
    <>
      <footer className="relative mt-0 bg-primary-soft pt-12 pb-0 flex flex-col border-t border-primary/20">
        <div className="container-x relative z-10 flex flex-col justify-between flex-grow pb-16 md:pb-8">
          
          <div className="flex flex-col items-center md:items-start text-center md:text-left mb-10">
             <div className="flex items-center justify-center md:justify-start gap-3 mb-5 md:mb-6">
              {settings?.logo ? (
                <img src={settings.logo} alt={name} className="h-10 w-10 object-contain rounded-lg" />
              ) : (
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-accent grid place-items-center shadow-lg shadow-primary/20">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5 text-white"
                    fill="currentColor"
                    aria-hidden
                  >
                    <path d="M12 21s-7-4.35-9.5-8.5C.85 9.5 2.4 5.5 6 5c2.05-.28 3.7.9 6 3 2.3-2.1 3.95-3.28 6-3 3.6.5 5.15 4.5 3.5 7.5C19 16.65 12 21 12 21Z" />
                  </svg>
                </div>
              )}
              <div className="font-display text-2xl tracking-tight text-foreground font-bold">{name}</div>
             </div>
             
             <p className="text-[14px] text-slate-600 max-w-lg mb-6 leading-relaxed">
               {settings?.footer_description || "We go beyond standard care to ensure your peace of mind and your loved one's well-being — every visit, every time."}
             </p>
             <div className="flex justify-center md:justify-start gap-4">
                {social?.facebook && <SocialIcon Icon={FacebookIcon} href={social.facebook} />}
                {social?.instagram && <SocialIcon Icon={InstagramIcon} href={social.instagram} />}
                {social?.linkedin && <SocialIcon Icon={LinkedinIcon} href={social.linkedin} />}
                {social?.youtube && <SocialIcon Icon={YoutubeIcon} href={social.youtube} />}
             </div>
          </div>

          <div className="flex flex-col gap-8">
            <FooterCol title="Menu" links={MENU_LINKS} />
            <FooterCol title="Services" links={SERVICES_LINKS} />
            <FooterCol title="Other Services & Support" links={SUPPORT_LINKS} />
          </div>
          
        </div>
        
        {/* Bottom Bar (Desktop/Tablet) */}
        <div className="w-full bg-primary/10 pt-6 pb-24 md:pb-6 border-t border-primary/10">
          <div className="container-x flex flex-col md:flex-row items-center justify-center gap-4">
            <div className="text-[13px] text-slate-600 font-medium text-center">
              © {new Date().getFullYear()} {name}. All Rights Reserved.
            </div>
          </div>
        </div>
      </footer>

      {/* Sticky Bottom Navigation Bar (Mobile Only) */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.08)] border-t border-border">
        <div className="grid grid-cols-4 items-center">
          
          <a href={`tel:${phone}`} className="flex flex-col items-center justify-center py-2.5 gap-1.5 active:bg-primary/5 transition-colors">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-primary/10 text-primary shadow-sm">
              <Siren className="h-5 w-5" strokeWidth={2.5} />
            </div>
            <span className="text-[10px] font-bold text-foreground uppercase tracking-wider">Emergency</span>
          </a>

          <a href={`tel:${phone}`} className="flex flex-col items-center justify-center py-2.5 gap-1.5 active:bg-primary/5 transition-colors">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-primary/10 text-primary shadow-sm">
              <Phone className="h-5 w-5" strokeWidth={2.5} />
            </div>
            <span className="text-[10px] font-bold text-foreground uppercase tracking-wider">Call Now</span>
          </a>

          <Link to="/contact" className="flex flex-col items-center justify-center py-2.5 gap-1.5 active:bg-primary/5 transition-colors">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-primary/10 text-primary shadow-sm">
              <HelpCircle className="h-5 w-5" strokeWidth={2.5} />
            </div>
            <span className="text-[10px] font-bold text-foreground uppercase tracking-wider">Enquiry Now</span>
          </Link>

          <a href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}`} target="_blank" rel="noreferrer" className="flex flex-col items-center justify-center py-2.5 gap-1.5 active:bg-primary/5 transition-colors">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-green-500/10 text-green-600 shadow-sm">
              <WhatsAppIcon className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-bold text-foreground uppercase tracking-wider">WhatsApp</span>
          </a>

        </div>
      </div>
    </>
  );
}

function FooterCol({ title, links }: { title: string; links: {label: string, to: string}[] }) {
  return (
    <div className="flex flex-col">
      <div className="text-[18px] font-bold text-foreground mb-3">{title}</div>
      <div className="flex flex-wrap items-center gap-x-1.5 gap-y-2">
        {links.map((link, i) => (
          <React.Fragment key={i}>
            <Link
              to={link.to}
              className="text-[14px] font-medium text-slate-600 hover:text-primary hover:-translate-y-0.5 transition-all block leading-snug"
            >
              {link.label}
            </Link>
            {i < links.length - 1 && <span className="text-slate-300 text-[13px] font-bold mx-1">|</span>}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

function SocialIcon({
  Icon,
  href,
}: {
  Icon: any /* eslint-disable-line @typescript-eslint/no-explicit-any */;
  href: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-200 shadow-sm hover:shadow-md"
    >
      <Icon className="w-4 h-4" fill="currentColor" />
    </a>
  );
}
"""

with open("src/components/site/Footer.tsx", "w") as f:
    f.write(content)
