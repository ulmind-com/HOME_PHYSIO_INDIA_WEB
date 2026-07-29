import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { settingsQ, socialQ } from "@/lib/api/queries";
import { Heart } from "lucide-react";

export function Footer() {
  const { data: settings } = useQuery(settingsQ());
  const { data: social } = useQuery(socialQ());

  const name = settings?.website_name ?? "Nupun Home Health Care";

  return (
    <footer className="relative mt-24 bg-[#F2F0EC] pt-24 pb-0 sm:pt-32 flex flex-col">
      {/* Background Image at the bottom half */}
      <div 
        className="absolute inset-x-0 bottom-0 h-[80%] z-0 pointer-events-none"
        style={{ 
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 35%)', 
          maskImage: 'linear-gradient(to bottom, transparent, black 35%)' 
        }}
      >
        <img 
          src="/assets/hero-slide-2.jpeg" 
          alt="" 
          className="w-full h-full object-cover object-[center_30%]"
        />
        {/* Darken/tint the image slightly so white text pops */}
        <div className="absolute inset-0 bg-black/10 mix-blend-multiply"></div>
      </div>

      <div className="container-x relative z-10 flex flex-col justify-between flex-grow">
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
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-black px-6 py-3.5 text-sm font-semibold text-white shadow-xl shadow-black/10 hover:bg-black/80 hover:-translate-y-0.5 transition-all duration-300"
            >
              Book an Appointment
            </Link>

            <div className="mt-12 flex flex-col gap-2.5">
              <div className="text-[13px] text-black font-semibold">
                © {new Date().getFullYear()} {name} - All rights reserved
              </div>

              <div className="flex items-center gap-1.5 text-[13px] text-black font-semibold">
                Built with <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500" /> by Ulmind
              </div>
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
      </div>

      {/* Massive Brand Typography at the Bottom over the image */}
      <div className="relative z-10 w-full overflow-hidden flex justify-center pt-32 pb-4 pointer-events-none">
        <h1 className="font-display text-[26vw] leading-[0.75] font-bold tracking-tighter text-white drop-shadow-2xl select-none whitespace-nowrap opacity-90">
          Nupun
        </h1>
        {/* Gradient fade at the absolute bottom to blend everything out */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#EAEAEA] to-transparent"></div>
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
