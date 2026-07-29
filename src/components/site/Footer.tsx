import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { settingsQ, socialQ } from "@/lib/api/queries";
import { Heart } from "lucide-react";

export function Footer() {
  const { data: settings } = useQuery(settingsQ());
  const { data: social } = useQuery(socialQ());

  const name = settings?.website_name ?? "Nupun Home Health Care";

  return (
    <footer className="relative mt-24 overflow-hidden bg-[#F4F4F5] pt-24 pb-8 sm:pt-32">
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/assets/hero-slide-2.jpeg" 
          alt="" 
          className="w-full h-full object-cover object-[center_30%] opacity-[0.35] mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#F4F4F5] via-[#F4F4F5]/60 to-[#F4F4F5]"></div>
      </div>

      <div className="container-x relative z-10 flex flex-col justify-between">
        <div className="grid gap-16 lg:grid-cols-12">
          
          {/* Left Column (Brand & CTA) */}
          <div className="lg:col-span-5 flex flex-col items-start">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-10 w-10 rounded-[14px] bg-gradient-to-br from-primary to-accent grid place-items-center shadow-lg shadow-primary/20">
                <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="currentColor" aria-hidden>
                  <path d="M12 21s-7-4.35-9.5-8.5C.85 9.5 2.4 5.5 6 5c2.05-.28 3.7.9 6 3 2.3-2.1 3.95-3.28 6-3 3.6.5 5.15 4.5 3.5 7.5C19 16.65 12 21 12 21Z" />
                </svg>
              </div>
              <div className="font-display text-xl font-bold tracking-tight text-foreground">{name}</div>
            </div>

            <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-4">
              Your premium home healthcare partner
            </h3>
            
            <p className="text-[15px] leading-relaxed text-muted-foreground max-w-md mb-8">
              Nupun brings expert doctors, compassionate nurses, and hospital-grade equipment directly to your doorstep. Verified professionals ensuring your loved ones get the care they deserve.
            </p>

            <Link
              to="/booking"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-black px-6 py-3.5 text-sm font-medium text-white shadow-xl shadow-black/10 hover:bg-black/80 hover:-translate-y-0.5 transition-all duration-300"
            >
              Book an Appointment
            </Link>

            <div className="mt-16 text-sm text-muted-foreground flex items-center gap-1.5">
              Built with <Heart className="h-4 w-4 text-rose-500 fill-rose-500" /> by Ulmind
            </div>
          </div>

          {/* Right Column (Links) */}
          <div className="lg:col-span-6 lg:col-start-7 grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-12">
            <FooterCol title="Menu">
              <FooterLink to="/">Home</FooterLink>
              <FooterLink to="/about">About Us</FooterLink>
              <FooterLink to="/equipment">Equipment</FooterLink>
              <FooterLink to="/testimonials">Testimonials</FooterLink>
              <FooterLink to="/blog">Care Blog</FooterLink>
            </FooterCol>

            <FooterCol title="Services">
              <FooterLink to="/services">Elder Care</FooterLink>
              <FooterLink to="/services">Physiotherapy</FooterLink>
              <FooterLink to="/services">Skilled Nursing</FooterLink>
              <FooterLink to="/services">Rehabilitation</FooterLink>
              <FooterLink to="/services">Medical Equipment</FooterLink>
            </FooterCol>

            <FooterCol title="Support">
              <FooterLink to="/contact">Contact Us</FooterLink>
              <FooterLink to="/faq">FAQ</FooterLink>
              <FooterLink to="/privacy">Privacy Policy</FooterLink>
              <FooterLink to="/terms">Terms of Service</FooterLink>
              <FooterLink to="/refund-policy">Refund Policy</FooterLink>
            </FooterCol>
          </div>
        </div>

        <div className="mt-20 border-t border-black/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <div>© {new Date().getFullYear()} {name} - All rights reserved</div>
          <div className="flex gap-6">
            {social?.facebook && <a href={social.facebook} className="hover:text-primary transition-colors">Facebook</a>}
            {social?.instagram && <a href={social.instagram} className="hover:text-primary transition-colors">Instagram</a>}
            {social?.linkedin && <a href={social.linkedin} className="hover:text-primary transition-colors">LinkedIn</a>}
          </div>
        </div>
      </div>

      {/* Massive Brand Typography at the Bottom */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 overflow-hidden flex justify-center translate-y-[20%] z-0">
        <h1 className="font-display text-[25vw] leading-none font-bold tracking-tighter text-black/[0.05] select-none whitespace-nowrap">
          Nupun
        </h1>
        {/* Gradient fade to seamlessly blend with the bottom edge */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#F4F4F5]/30 to-[#F4F4F5]"></div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col">
      <div className="text-base font-semibold text-foreground mb-6">{title}</div>
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  );
}

function FooterLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link to={to} className="text-[15px] font-medium text-muted-foreground hover:text-primary transition-colors">
      {children}
    </Link>
  );
}
