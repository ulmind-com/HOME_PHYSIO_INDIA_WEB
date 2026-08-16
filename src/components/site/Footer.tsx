import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { settingsQ, socialQ, servicesQ } from "@/lib/api/queries";
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

const TwitterIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const YoutubeIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.015 3.015 0 0 0-2.122 2.136C0 8.07 0 12 0 12s0 3.93.498 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.55 9.377.55 9.377.55s7.505 0 9.377-.55a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

export function Footer() {
  const { data: settings } = useQuery(settingsQ());
  const { data: social } = useQuery(socialQ());
  const { data: servicesData } = useQuery(servicesQ({ limit: 5 }));

  const name = settings?.website_name ?? "Nupun Home Health Care";
  const services = servicesData?.items ?? [];

  return (
    <footer className="relative mt-0 bg-black sm:bg-[#F2F0EC] pt-16 pb-0 sm:pt-20 flex flex-col">
      {/* Background Image at the bottom half */}
      <div
        className="absolute inset-x-0 bottom-0 h-full sm:h-[80%] z-0 pointer-events-none [mask-image:none] sm:[mask-image:linear-gradient(to_bottom,transparent,black_35%)] [-webkit-mask-image:none] sm:[-webkit-mask-image:linear-gradient(to_bottom,transparent,black_35%)]"
      >
        <picture>
          <source media="(max-width: 639px)" srcSet="/assets/footer_mobile_bg.jpg" />
          <img
            src={settings?.footer_image || "/assets/hero-slide-2.jpeg"}
            alt=""
            className="w-full h-full object-cover object-[center_30%] opacity-60 sm:opacity-100"
          />
        </picture>
        {/* Darken/tint the image slightly so white text pops */}
        <div className="absolute inset-0 bg-black/10 mix-blend-multiply sm:block hidden"></div>
      </div>

      <div className="container-x relative z-10 flex flex-col justify-between flex-grow">
        <div className="grid gap-10 md:gap-16 lg:grid-cols-12">
          {/* Left Column (Brand & CTA) */}
          <div className="lg:col-span-5 flex flex-col items-start">
            <div className="flex items-center gap-3 mb-5 md:mb-8">
              {settings?.logo ? (
                <img src={settings.logo} alt={name} className="h-10 w-10 object-contain rounded-lg" />
              ) : (
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
              )}
              <div className="font-display text-xl tracking-tight text-white sm:text-foreground">{name}</div>
            </div>

            {settings?.tagline && (
              <h3 className="font-display text-xl sm:text-2xl md:text-3xl tracking-tight text-white sm:text-foreground mb-3 md:mb-4 leading-[1.15]">
                {settings.tagline}
              </h3>
            )}

            {settings?.footer_description && (
              <p className="text-[13px] md:text-[15px] leading-relaxed text-white/80 sm:text-muted-foreground max-w-md mb-6 md:mb-8">
                {settings.footer_description}
              </p>
            )}

            <div className="mt-6 md:mt-10">
              <h4 className="text-[15px] font-medium text-white sm:text-foreground mb-4">
                Follow our social media
              </h4>
              <div className="flex gap-3">
                {social?.facebook && <SocialIcon Icon={FacebookIcon} href={social.facebook} />}
                {social?.instagram && <SocialIcon Icon={InstagramIcon} href={social.instagram} />}
                {social?.twitter && <SocialIcon Icon={TwitterIcon} href={social.twitter} />}
                {social?.youtube && <SocialIcon Icon={YoutubeIcon} href={social.youtube} />}
                {/* Fallback if no social links from API */}
                {!social?.facebook &&
                  !social?.instagram &&
                  !social?.twitter &&
                  !social?.youtube && (
                    <>
                      <SocialIcon Icon={FacebookIcon} href="#" />
                      <SocialIcon Icon={InstagramIcon} href="#" />
                      <SocialIcon Icon={TwitterIcon} href="#" />
                      <SocialIcon Icon={YoutubeIcon} href="#" />
                    </>
                  )}
              </div>
            </div>


          </div>

          {/* Right Column (Links) */}
          <div className="lg:col-span-6 lg:col-start-7 flex flex-col justify-between h-full">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 md:gap-x-8 gap-y-8 md:gap-y-12">
              <FooterCol title="Menu">
                <FooterLink to="/">Home</FooterLink>
                <FooterLink to="/about">About Us</FooterLink>
                <FooterLink to="/medical-equipment">Equipment</FooterLink>
                <FooterLink to="/testimonials">Testimonials</FooterLink>
                <FooterLink to="/blogs">Care Blog</FooterLink>
              </FooterCol>

              <FooterCol title="Services">
                {services.length > 0 ? (
                  services.map((s) => (
                    <FooterLink key={s.id} to={`/services`}>
                      {s.title}
                    </FooterLink>
                  ))
                ) : (
                  <>
                    <FooterLink to="/elderly-care">Elderly Care</FooterLink>
                    <FooterLink to="/nursing-care">Nursing Care</FooterLink>
                    <FooterLink to="/services">Physiotherapy</FooterLink>
                    <FooterLink to="/services">Rehabilitation</FooterLink>
                    <FooterLink to="/services">Medical Equipment</FooterLink>
                  </>
                )}
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
                className="flex items-center gap-2.5 text-[13px] font-sans text-white/90 sm:text-muted-foreground group cursor-pointer transition-colors sm:hover:text-foreground"
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
      <div className="relative z-10 w-full overflow-hidden flex flex-col items-center justify-center pt-12 md:pt-20 pb-4 pointer-events-none">
        <div className="mb-8 text-[13px] text-white/90 font-medium drop-shadow-md text-center pointer-events-auto">
          © {new Date().getFullYear()} {name}. All Rights Reserved.
        </div>
        <h1 className="font-display text-[26vw] leading-[0.75] font-bold tracking-tighter text-white drop-shadow-2xl select-none whitespace-nowrap opacity-90">
          {name.split(" ")[0] || "Nupun"}
        </h1>
        {/* Gradient fade at the absolute bottom to blend everything out */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#EAEAEA] to-transparent -z-10"></div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col">
      <div className="text-base font-semibold text-white sm:text-foreground mb-6">{title}</div>
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  );
}

function FooterLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="text-[15px] font-medium text-white/80 sm:text-muted-foreground hover:text-white sm:hover:text-primary transition-colors"
    >
      {children}
    </Link>
  );
}

function SocialIcon({
  Icon,
  href,
}: {
  Icon: any /* eslint-disable-line @typescript-eslint/no-explicit-any */ /* eslint-disable-line @typescript-eslint/no-explicit-any */;
  href: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-9 h-9 rounded-full bg-white/20 sm:bg-primary text-white sm:text-primary-foreground flex items-center justify-center hover:bg-white/40 sm:hover:bg-accent sm:hover:text-accent-foreground transition-colors shadow-sm"
    >
      <Icon className="w-4 h-4" fill="currentColor" />
    </a>
  );
}
