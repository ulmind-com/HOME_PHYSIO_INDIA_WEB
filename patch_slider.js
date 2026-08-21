const fs = require('fs');
const file = 'src/components/site/ServicesHeroSlider.tsx';
let content = fs.readFileSync(file, 'utf8');

const fallbackContent = `
const FALLBACK_SLIDES: HeroSlide[] = [
  {
    title: "Expert Home Nursing Care",
    subtitle: "Professional and compassionate 24/7 nursing care at the comfort of your home.",
    button_text: "Book Nursing Care",
    button_link: "/nursing-care",
    image_desktop: { url: "/assets/hero-slider/nursing-web.jpg" },
    image_mobile: { url: "/assets/hero-slider/nursing-mobile.jpg" },
  },
  {
    title: "Compassionate Elderly Care",
    subtitle: "Dedicated support and companionship ensuring safety and dignity for seniors.",
    button_text: "Explore Elder Care",
    button_link: "/elderly-care",
    image_desktop: { url: "/assets/hero-slider/elderly-web.jpg" },
    image_mobile: { url: "/assets/hero-slider/elderly-mobile.jpg" },
  },
  {
    title: "Mother & Baby Care",
    subtitle: "Specialized postnatal care for new mothers and their newborns.",
    button_text: "Book Mother & Baby Care",
    button_link: "/mother-baby-care",
    image_desktop: { url: "/assets/hero-slider/mother-web.jpg" },
    image_mobile: { url: "/assets/hero-slider/mother-mobile.jpg" },
  },
  {
    title: "Physiotherapy & Recovery",
    subtitle: "In-home rehabilitation and mobility training by expert physiotherapists.",
    button_text: "Book Physiotherapy",
    button_link: "/physiotherapy",
    image_desktop: { url: "/assets/hero-slider/physio-web.jpg" },
    image_mobile: { url: "/assets/hero-slider/physio-mobile.jpg" },
  },
  {
    title: "Medical Equipment Rental",
    subtitle: "Hospital-grade beds, oxygen cylinders, and monitoring equipment delivered to you.",
    button_text: "Rent Equipment",
    button_link: "/medical-equipment",
    image_desktop: { url: "/assets/hero-slider/equipment-web.jpg" },
    image_mobile: { url: "/assets/hero-slider/equipment-mobile.jpg" },
  },
  {
    title: "Professional ICU Setup",
    subtitle: "Transform your room into a fully equipped ICU with trained intensive care nurses.",
    button_text: "Book ICU Setup",
    button_link: "/icu-setup",
    image_desktop: { url: "/assets/hero-slider/icu-web.jpg" },
    image_mobile: { url: "/assets/hero-slider/icu-mobile.jpg" },
  },
  {
    title: "Home Sample Collection",
    subtitle: "Safe and hygienic diagnostic sample collection right from your doorstep by professional phlebotomists.",
    button_text: "Book Home Lab Test",
    button_link: "/sample-collection",
    image_desktop: { url: "/assets/sample-collection/web.jpg" },
    image_mobile: { url: "/assets/sample-collection/mobile.jpg" },
  },
  {
    title: "Infection Control Nurse Services",
    subtitle: "Professional infection prevention & control support, training and guidance for healthcare settings.",
    button_text: "Learn More",
    button_link: "/infection-control-nurse",
    image_desktop: { url: "/assets/infection_control_desktop.jpg" },
    image_mobile: { url: "/assets/infection_control_desktop.jpg" },
  },
  {
    title: "Injection Administration",
    subtitle: "Prescribed injections safely administered at home by trained and verified nursing staff.",
    button_text: "Book Injection",
    button_link: "/nursing-care",
    image_desktop: { url: "/assets/categories/injection.png" },
    image_mobile: { url: "/assets/categories/injection.png" },
  }
];

const SLIDE_DURATION`;

content = content.replace('const SLIDE_DURATION', fallbackContent);

const dynamicLogic = `  const slides = useMemo(() => {
    const s = dynamicSlides && dynamicSlides.length > 0 ? [...dynamicSlides] : [...FALLBACK_SLIDES];
    
    const infectionControl = FALLBACK_SLIDES.find(f => f.title === "Infection Control Nurse Services");
    const injection = FALLBACK_SLIDES.find(f => f.title === "Injection Administration");
    
    if (infectionControl && !s.some(slide => slide.title === infectionControl.title)) {
      s.push(infectionControl);
    }
    if (injection && !s.some(slide => slide.title === injection.title)) {
      s.push(injection);
    }
    
    return s;
  }, [dynamicSlides]);`;

content = content.replace('const slides = dynamicSlides && dynamicSlides.length > 0 ? dynamicSlides : [];', dynamicLogic);

fs.writeFileSync(file, content);
