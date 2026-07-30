import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { settingsQ, socialQ } from "@/lib/api/queries";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

export function Footer() {
  const { data: settings } = useQuery(settingsQ());
  const { data: social } = useQuery(socialQ());

  const name = settings?.website_name ?? "Nupun Home Health Care";

  return (
    <footer className="relative mt-0 bg-[#F2F0EC] pt-16 pb-0 sm:pt-20 flex flex-col">
      {/* Background Image at the bottom half */}
      <div
        className="absolute inset-x-0 bottom-0 h-[80%] z-0 pointer-events-none"
        style={{
          WebkitMaskImage: "linear-gradient(to bottom, transparent, black 35%)",
          maskImage: "linear-gradient(to bottom, transparent, black 35%)",
        }}
      >
        <img
          src={settings?.footer_image || "/assets/hero-slide-2.jpeg"}
          alt=""
          className="w-full h-full object-cover object-[center_30%]"
        />
        {/* Darken/tint the image slightly so white text pops */}
        <div className="absolute inset-0 bg-black/10 mix-blend-multiply"></div>
      </div>

      <div className="container-x relative z-10 flex flex-col justify-between flex-grow">
        <div className="grid gap-10 md:gap-16 lg:grid-cols-12">
          {/* Left Column (Brand & CTA) */}
          <div className="lg:col-span-5 flex flex-col items-start">
            <div className="flex items-center gap-3 mb-5 md:mb-8">
              <div className="h-10 w-10 rounded-[14px] bg-gradient-to-br from-primary to-accent grid place-items-center shadow-lg shadow-primary/20">
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5 text-white"
                  fill="currentColor"
                  aria-hidden
                >
                  <path d="M12 21s-7-4.35-9.5-8.5C.85 9.5 2.4 5.5 6 5c2.05-.28 3.7.9 6 3 2.3-2.1 3.95-3.28 6-3 3.6.5 5.15 4.5 3.5 7.5C19 16.65 12 21 12 21Z" />
                </svg>
              </div>
              <div className="font-display text-xl tracking-tight text-foreground">{name}</div>
            </div>

            <h3 className="font-display text-xl sm:text-2xl md:text-3xl tracking-tight text-foreground mb-3 md:mb-4 leading-[1.15]">
              {settings?.tagline || "Your premium home healthcare partner"}
            </h3>

            <p className="text-[13px] md:text-[15px] leading-relaxed text-muted-foreground max-w-md mb-6 md:mb-8">
              {settings?.footer_description ||
                `${name} brings expert doctors, compassionate nurses, and hospital-grade equipment directly to your doorstep. Verified professionals ensuring your loved ones get the care they deserve.`}
            </p>

            <Link
              to="/booking"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-black px-5 md:px-6 py-3 md:py-3.5 text-xs md:text-sm font-semibold text-white shadow-xl shadow-black/10 hover:bg-black/80 hover:-translate-y-0.5 transition-all duration-300"
            >
              Book an Appointment
            </Link>

            <div className="mt-6 md:mt-10">
              <h4 className="text-[15px] font-semibold text-foreground mb-4">
                Follow our social media
              </h4>
              <div className="flex gap-3">
                {social?.facebook && <SocialIcon Icon={Facebook} href={social.facebook} />}
                {social?.instagram && <SocialIcon Icon={Instagram} href={social.instagram} />}
                {social?.twitter && <SocialIcon Icon={Twitter} href={social.twitter} />}
                {social?.youtube && <SocialIcon Icon={Youtube} href={social.youtube} />}
                {/* Fallback if no social links from API */}
                {!social?.facebook &&
                  !social?.instagram &&
                  !social?.twitter &&
                  !social?.youtube && (
                    <>
                      <SocialIcon Icon={Facebook} href="#" />
                      <SocialIcon Icon={Instagram} href="#" />
                      <SocialIcon Icon={Twitter} href="#" />
                      <SocialIcon Icon={Youtube} href="#" />
                    </>
                  )}
              </div>
            </div>

            <div className="mt-8 md:mt-12 flex flex-col gap-2.5">
              <div className="text-[13px] text-white font-semibold drop-shadow-md">
                © {new Date().getFullYear()} {name} - All rights reserved
              </div>
            </div>
          </div>

          {/* Right Column (Links) */}
          <div className="lg:col-span-6 lg:col-start-7 flex flex-col justify-between h-full">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 md:gap-x-8 gap-y-8 md:gap-y-12">
              <FooterCol title="Menu">
                <FooterLink to="/">Home</FooterLink>
                <FooterLink to="/about">About Us</FooterLink>
                <FooterLink to="/equipment">Equipment</FooterLink>
                <FooterLink to="/testimonials">Testimonials</FooterLink>
                <FooterLink to="/blogs">Care Blog</FooterLink>
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

            <div className="flex justify-start sm:justify-end mt-12 sm:mt-auto">
              <a
                href="https://www.ulmind.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-[13px] text-white/90 font-medium drop-shadow-md group cursor-pointer"
              >
                <span className="opacity-80 transition-opacity group-hover:opacity-100">
                  Designed and Developed by
                </span>
                <img
                  src="/assets/ulmind.png"
                  alt="Ulmind"
                  className="h-10 sm:h-12 w-auto object-contain drop-shadow-lg opacity-100 transition-all group-hover:scale-105"
                />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Massive Brand Typography at the Bottom over the image */}
      <div className="relative z-10 w-full overflow-hidden flex justify-center pt-16 md:pt-32 pb-4 pointer-events-none">
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
    <Link
      to={to}
      className="text-[15px] font-medium text-muted-foreground hover:text-primary transition-colors"
    >
      {children}
    </Link>
  );
}

function SocialIcon({ Icon, href }: { Icon: any; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors shadow-sm"
    >
      <Icon className="w-4 h-4" fill="currentColor" />
    </a>
  );
}
