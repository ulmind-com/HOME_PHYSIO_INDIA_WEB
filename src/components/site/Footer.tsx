import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Facebook, Instagram, Linkedin, Youtube, Twitter, Mail, Phone, MapPin } from "lucide-react";
import { settingsQ, socialQ } from "@/lib/api/queries";

export function Footer() {
  const { data: settings } = useQuery(settingsQ());
  const { data: social } = useQuery(socialQ());

  const name = settings?.website_name ?? "Nupun Home Health Care Services";

  return (
    <footer className="mt-24 border-t border-border bg-gradient-to-b from-background to-primary-soft/40">
      <div className="container-x py-16 grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4 space-y-5">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-accent grid place-items-center">
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="currentColor" aria-hidden>
                <path d="M12 21s-7-4.35-9.5-8.5C.85 9.5 2.4 5.5 6 5c2.05-.28 3.7.9 6 3 2.3-2.1 3.95-3.28 6-3 3.6.5 5.15 4.5 3.5 7.5C19 16.65 12 21 12 21Z" />
              </svg>
            </div>
            <div className="font-display text-xl">{name}</div>
          </div>
          <p className="text-sm text-muted-foreground max-w-sm">
            Compassionate, medically-supervised care delivered to your doorstep. Nurses, physiotherapists,
            attendants and premium equipment — all in one trusted place.
          </p>
          <div className="flex items-center gap-3">
            {social?.facebook && <SocialIcon href={social.facebook} label="Facebook"><Facebook className="h-4 w-4" /></SocialIcon>}
            {social?.instagram && <SocialIcon href={social.instagram} label="Instagram"><Instagram className="h-4 w-4" /></SocialIcon>}
            {social?.linkedin && <SocialIcon href={social.linkedin} label="LinkedIn"><Linkedin className="h-4 w-4" /></SocialIcon>}
            {social?.youtube && <SocialIcon href={social.youtube} label="YouTube"><Youtube className="h-4 w-4" /></SocialIcon>}
            {social?.twitter && <SocialIcon href={social.twitter} label="Twitter"><Twitter className="h-4 w-4" /></SocialIcon>}
          </div>
        </div>

        <FooterCol title="Explore" className="lg:col-span-2">
          <FooterLink to="/services">Services</FooterLink>
          <FooterLink to="/equipment">Equipment</FooterLink>
          <FooterLink to="/blog">Blog</FooterLink>
          <FooterLink to="/videos">Videos</FooterLink>
          <FooterLink to="/testimonials">Testimonials</FooterLink>
        </FooterCol>

        <FooterCol title="Company" className="lg:col-span-2">
          <FooterLink to="/about">About</FooterLink>
          <FooterLink to="/careers">Careers</FooterLink>
          <FooterLink to="/faq">FAQ</FooterLink>
          <FooterLink to="/contact">Contact</FooterLink>
          <FooterLink to="/booking">Book care</FooterLink>
        </FooterCol>

        <div className="lg:col-span-4 space-y-3">
          <div className="text-sm font-medium">Get in touch</div>
          {settings?.phone && (
            <a href={`tel:${settings.phone}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
              <Phone className="h-4 w-4" /> {settings.phone}
            </a>
          )}
          {settings?.email && (
            <a href={`mailto:${settings.email}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
              <Mail className="h-4 w-4" /> {settings.email}
            </a>
          )}
          {settings?.address && (
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 mt-0.5" /> <span>{settings.address}</span>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container-x py-6 flex flex-col md:flex-row justify-between gap-3 text-xs text-muted-foreground">
          <div>© {new Date().getFullYear()} {name}. All rights reserved.</div>
          <div className="flex gap-5">
            <Link to="/privacy" className="hover:text-foreground">Privacy</Link>
            <Link to="/terms" className="hover:text-foreground">Terms</Link>
            <Link to="/refund-policy" className="hover:text-foreground">Refund policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      aria-label={label}
      className="h-9 w-9 rounded-full border border-border bg-surface grid place-items-center hover:border-primary hover:text-primary transition-colors"
    >
      {children}
    </a>
  );
}

function FooterCol({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <div className="text-sm font-medium mb-4">{title}</div>
      <div className="grid gap-2.5">{children}</div>
    </div>
  );
}

function FooterLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    // @ts-expect-error dynamic path
    <Link to={to} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
      {children}
    </Link>
  );
}
