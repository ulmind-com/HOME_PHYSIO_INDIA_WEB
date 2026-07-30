import os
import re

files_to_fix = [
    "src/routes/equipment.index.tsx",
    "src/routes/about.tsx",
    "src/routes/faq.tsx",
    "src/routes/services.index.tsx",
    "src/routes/index.tsx",
    "src/components/forms/ContactForm.tsx",
    "src/components/site/ServicesHeroSlider.tsx",
    "src/components/site/cards/ServiceCardPro.tsx",
    "src/components/site/cards/EquipmentCard.tsx"
]

replacements = {
    "rgba(26,130,118,": "var(--color-primary),",
    "rgba(67,212,176,": "var(--color-primary),",
    "rgba(0,123,255,": "var(--color-primary),",
    "bg-[#43D4B0]": "bg-primary",
    "bg-[#007BFF]": "bg-primary",
    "border-[#007BFF]": "border-primary",
    "hover:bg-[#3bc3a0]": "hover:bg-primary/90",
    "shadow-[0_8px_20px_rgba(26,130,118,0.25)]": "shadow-md shadow-primary/25",
    "shadow-[0_20px_50px_rgba(26,130,118,0.15)]": "shadow-xl shadow-primary/15",
    "shadow-[0_10px_20px_rgba(26,130,118,0.3)]": "shadow-lg shadow-primary/30",
    "shadow-[0_8px_30px_rgba(67,212,176,0.15)]": "shadow-lg shadow-primary/15",
    "shadow-[0_4px_14px_rgba(0,123,255,0.3)]": "shadow-md shadow-primary/30",
    "shadow-[0_15px_30px_-10px_rgba(26,130,118,0.4)]": "shadow-xl shadow-primary/40",
    "shadow-[0_15px_40px_-10px_rgba(67,212,176,0.5)]": "shadow-xl shadow-primary/50",
    "shadow-[0_20px_50px_-10px_rgba(67,212,176,0.6)]": "shadow-2xl shadow-primary/60",
    "shadow-[0_4px_14px_rgba(0,123,255,0.15)]": "shadow-md shadow-primary/15",
    "shadow-[0_6px_20px_rgba(0,123,255,0.25)]": "shadow-lg shadow-primary/25",
    "shadow-[0_20px_50px_-20px_rgba(67,212,176,0.5)]": "shadow-xl shadow-primary/50",
    "shadow-[0_25px_60px_-15px_rgba(67,212,176,0.6)]": "shadow-2xl shadow-primary/60",
    "shadow-[0_10px_20px_rgba(67,212,176,0.3)]": "shadow-lg shadow-primary/30",
    "boxShadow: \"0 0 12px rgba(67,212,176,0.6)\"": "boxShadow: \"0 0 12px var(--color-primary)\"",
    "bg-[#43D4B0]/30": "bg-primary/30"
}

for filepath in files_to_fix:
    if os.path.exists(filepath):
        with open(filepath, 'r') as f:
            content = f.read()
        
        original_content = content
        for old, new in replacements.items():
            content = content.replace(old, new)
        
        # Also catch any raw rgba that didn't match the exact shadow strings above
        content = re.sub(r'rgba\(26,130,118,([0-9.]+)\)', r'rgba(var(--color-primary-rgb), \1)', content)
        content = re.sub(r'rgba\(67,212,176,([0-9.]+)\)', r'rgba(var(--color-primary-rgb), \1)', content)
        content = re.sub(r'rgba\(0,123,255,([0-9.]+)\)', r'rgba(var(--color-primary-rgb), \1)', content)

        if content != original_content:
            with open(filepath, 'w') as f:
                f.write(content)
            print(f"Fixed {filepath}")
