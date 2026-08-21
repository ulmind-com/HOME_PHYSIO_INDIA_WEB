import re

# 1. Patch ServicesHeroSlider.tsx
with open('src/components/site/ServicesHeroSlider.tsx', 'r') as f:
    slider = f.read()

fallback = """
const FALLBACK_SLIDES: HeroSlide[] = [
  {
    title: "Expert Home Nursing Care",
    subtitle: "Compassionate and reliable home healthcare with professional nurses available 24/7.",
    button_text: "Book a Nurse",
    button_link: "/services/home-nursing-care",
    image_desktop: { url: "/assets/hero-desktop/hero_desktop_1_nursing_1786737139820.jpg" },
    image_mobile: { url: "/assets/hero-mobile/hero_mobile_1_nursing_1786737195851.jpg" },
  },
  {
    title: "Compassionate Elderly Care",
    subtitle: "Dedicated caregivers providing dignified, patient-centred elder care in the comfort of home.",
    button_text: "Book an Attendant",
    button_link: "/services/elderly-care",
    image_desktop: { url: "/assets/hero-desktop/hero_desktop_2_elderly_1786737273511.jpg" },
    image_mobile: { url: "/assets/hero-mobile/hero_mobile_2_elderly_1786737290173.jpg" },
  },
  {
    title: "Mother & Baby Care",
    subtitle: "Specialized postnatal care to ensure the health and comfort of both mother and newborn.",
    button_text: "Book Newborn Care",
    button_link: "/services/mother-and-baby-care",
    image_desktop: { url: "/assets/hero-desktop/hero_desktop_3_mother_baby_1786737385210.jpg" },
    image_mobile: { url: "/assets/hero-mobile/hero_mobile_3_mother_baby_1786737410186.jpg" },
  },
  {
    title: "Physiotherapy & Recovery",
    subtitle: "Medically supervised recovery care and physiotherapy delivered at home for faster healing.",
    button_text: "Book a Physiotherapist",
    button_link: "/services/physiotherapy-and-recovery",
    image_desktop: { url: "/assets/hero-desktop/hero_desktop_4_physio_1786737419510.jpg" },
    image_mobile: { url: "/assets/hero-mobile/hero_mobile_4_physio_1786737469387.jpg" },
  },
  {
    title: "Medical Equipment Rental",
    subtitle: "High-quality, sanitized medical equipment like hospital beds and oxygen concentrators delivered to your home.",
    button_text: "Rent Equipment Now",
    button_link: "/equipment",
    image_desktop: { url: "/assets/hero-desktop/hero_desktop_5_equipment_1786737493628.jpg" },
    image_mobile: { url: "/assets/hero-mobile/hero_mobile_5_equipment_1786737520362.jpg" },
  },
  {
    title: "Professional ICU Setup",
    subtitle: "Complete ICU-level care and equipment setup at home for critically ill patients.",
    button_text: "Request ICU Setup",
    button_link: "/contact",
    image_desktop: { url: "/assets/hero-desktop/hero_desktop_6_icu_1786737546853.jpg" },
    image_mobile: { url: "/assets/hero-mobile/hero_mobile_6_icu_1786737784974.jpg" },
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

const SLIDE_DURATION = 6000;
"""

slider = re.sub(r"const SLIDE_DURATION = 6000;", fallback, slider)

dynamic_slides_logic = """  const slides = useMemo(() => {
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
  }, [dynamicSlides]);
"""

slider = slider.replace("const slides = dynamicSlides && dynamicSlides.length > 0 ? dynamicSlides : [];", dynamic_slides_logic)
with open('src/components/site/ServicesHeroSlider.tsx', 'w') as f:
    f.write(slider)

# 2. Patch CategoryShowcasePremium.tsx
with open('src/components/site/CategoryShowcasePremium.tsx', 'r') as f:
    cat = f.read()

fallback_cat = """const nursingAsset = { url: "/assets/categories/nursing-v2.jpg?v=2" };
const elderAsset = { url: "/assets/categories/elder.jpg?v=2" };
const motherBabyAsset = { url: "/assets/categories/mother-baby.png" };
const physioAsset = { url: "/assets/categories/physio-v2.jpg?v=2" };
const equipmentAsset = { url: "/assets/categories/equipment-v2.jpg?v=2" };
const icuSetupAsset = { url: "/assets/categories/icu-setup.png" };
const homeSampleAsset = { url: "/assets/categories/home-sample.png" };
const infectionControlAsset = { url: "/assets/infection_control_desktop.jpg" };

type Variant = "a" | "b" | "c" | "d";

const fallbacks: Array<{ title: string; description: string; image: string; variant: Variant; dedicatedLink?: string }> = [
  {
    title: "Home Nursing Care",
    description: "24/7 qualified nurses at your home — injections, wound care, monitoring.",
    image: nursingAsset.url,
    variant: "a",
    dedicatedLink: "/nursing-care",
  },
  {
    title: "Elderly Care",
    description: "Compassionate daily companionship and assisted living support.",
    image: elderAsset.url,
    variant: "b",
    dedicatedLink: "/elderly-care",
  },
  {
    title: "Mother & Baby Care",
    description: "Expert postnatal care for new mothers & newborns — feeding support, baby care & recovery.",
    image: motherBabyAsset.url,
    variant: "c",
    dedicatedLink: "/mother-baby-care",
  },
  {
    title: "Physiotherapy & Recovery",
    description: "In-home rehab, mobility & pain management by expert therapists.",
    image: physioAsset.url,
    variant: "b",
    dedicatedLink: "/physiotherapy",
  },
  {
    title: "Medical Equipment Rental",
    description: "Hospital-grade beds, oxygen, monitors — delivered & installed.",
    image: equipmentAsset.url,
    variant: "d",
    dedicatedLink: "/medical-equipment",
  },
  {
    title: "ICU Setup",
    description: "Complete home ICU setup with ventilators, monitors & trained ICU nurses round the clock.",
    image: icuSetupAsset.url,
    variant: "a",
    dedicatedLink: "/icu-setup",
  },
  {
    title: "Home Sample Collection",
    description: "Convenient at-home blood tests & lab sample collection by certified phlebotomists.",
    image: homeSampleAsset.url,
    variant: "c",
    dedicatedLink: "/sample-collection",
  },
  {
    title: "Infection Control Nurse Services",
    description: "Professional infection prevention & control support, training and guidance for healthcare settings.",
    image: infectionControlAsset.url,
    variant: "d",
    dedicatedLink: "/infection-control-nurse",
  },
  {
    title: "Injection Administration",
    description: "Prescribed injections safely administered at home by trained and verified nursing staff.",
    image: "/assets/categories/injection.png",
    variant: "a",
    dedicatedLink: "/nursing-care",
  },
];

export function usePremiumCategories() {
  const { data: categoriesData } = useQuery(categoriesQ({ limit: 10 }));
  const categories = [...(categoriesData?.items ?? [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return fallbacks.map((fb, i) => {
    const cat = categories.find(c => c.name?.toLowerCase() === fb.title.toLowerCase()) || categories[i];
    
    // Extract string URL if it's an ImageAsset object
    let imageStr = cat?.image 
      ? (typeof cat.image === "string" ? cat.image : cat.image.url) 
      : fb.image;

    if (imageStr && !imageStr.includes("?")) {
      imageStr += "?v=2"; // Cache bust for old placeholder images
    }

    return {
      title: cat?.name || fb.title,
      description: cat?.description || fb.description,
      image: imageStr,
      variant: fb.variant,
      slug: cat?.slug || fb.title.toLowerCase().replace(/ /g, '-'),
      dedicatedLink: fb.dedicatedLink
    };
  });
}
"""

cat = re.sub(
    r'const nursingAsset = \{ url: "/assets/categories/nursing-v2.jpg\?v=2" \};\nconst elderAsset = \{ url: "/assets/categories/elder.jpg\?v=2" \};\nconst motherBabyAsset = \{ url: "/assets/categories/mother-baby.png" \};\n\ntype Variant = "a" \| "b" \| "c" \| "d";\n\nexport function usePremiumCategories\(\) \{.*?\n\}\n',
    fallback_cat,
    cat,
    flags=re.DOTALL
)

with open('src/components/site/CategoryShowcasePremium.tsx', 'w') as f:
    f.write(cat)

