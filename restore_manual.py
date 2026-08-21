import re

# 1. Patch CategoryShowcasePremium.tsx
with open('src/components/site/CategoryShowcasePremium.tsx', 'r') as f:
    cat = f.read()

fallback_addition = """
  {
    title: "Infection Control Nurse Services",
    description: "Professional infection prevention & control support, training and guidance for healthcare settings.",
    image: "/assets/infection_control_desktop.jpg",
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
"""

cat = cat.replace("];\n\nexport function usePremiumCategories()", fallback_addition + "\nexport function usePremiumCategories()")

with open('src/components/site/CategoryShowcasePremium.tsx', 'w') as f:
    f.write(cat)

# 2. Patch ServicesHeroSlider.tsx
with open('src/components/site/ServicesHeroSlider.tsx', 'r') as f:
    slider = f.read()

slider_addition = """
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
"""

slider = slider.replace("];\n\nconst SLIDE_DURATION", slider_addition + "\nconst SLIDE_DURATION")

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

