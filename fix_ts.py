import re

# 1. BookingForm.tsx
with open('src/components/forms/BookingForm.tsx', 'r') as f:
    c = f.read()
c = c.replace(
    'categories.map((c) => ({ name: c.name, slug: c.slug }))',
    'categories.map((c) => ({ name: c.name || "", slug: c.slug || "" }))'
)
with open('src/components/forms/BookingForm.tsx', 'w') as f:
    f.write(c)

# 2. Footer.tsx
with open('src/components/site/Footer.tsx', 'r') as f:
    c = f.read()
c = c.replace('{social?.facebook}', '{social?.facebook || ""}')
c = c.replace('{social?.instagram}', '{social?.instagram || ""}')
c = c.replace('{social?.linkedin}', '{social?.linkedin || ""}')
with open('src/components/site/Footer.tsx', 'w') as f:
    f.write(c)

# 3. ProfessionalsSection.tsx
with open('src/components/site/ProfessionalsSection.tsx', 'r') as f:
    c = f.read()

features_fix = """  const features: FeatureItem[] =
    settings?.home_about_features?.length
      ? settings.home_about_features.map((f: any) => ({
          ...f,
          icon_image: typeof f.icon_image === "string" ? f.icon_image : (f.icon_image?.url || "")
        }))
      : DEFAULT_FEATURES;"""

tiles_fix = """  const tiles: TileItem[] =
    settings?.home_about_tiles?.length
      ? settings.home_about_tiles.map((t: any) => ({
          ...t,
          image: typeof t.image === "string" ? t.image : (t.image?.url || "")
        }))
      : DEFAULT_TILES;"""

c = re.sub(
    r'  const features: FeatureItem\[\] =\n    settings\?\.home_about_features\?\.length\n      \? settings\.home_about_features\n      : DEFAULT_FEATURES;',
    features_fix,
    c
)
c = re.sub(
    r'  const tiles: TileItem\[\] =\n    settings\?\.home_about_tiles\?\.length\n      \? settings\.home_about_tiles\n      : DEFAULT_TILES;',
    tiles_fix,
    c
)
with open('src/components/site/ProfessionalsSection.tsx', 'w') as f:
    f.write(c)

# 4. elderly-care.tsx
with open('src/routes/elderly-care.tsx', 'r') as f:
    c = f.read()
c = c.replace('map((_, i) =>', 'map((_: any, i: number) =>')
with open('src/routes/elderly-care.tsx', 'w') as f:
    f.write(c)

# 5. nursing-care.tsx
with open('src/routes/nursing-care.tsx', 'r') as f:
    c = f.read()
c = c.replace('map((_, i) =>', 'map((_: any, i: number) =>')
with open('src/routes/nursing-care.tsx', 'w') as f:
    f.write(c)

# 6. physiotherapy.tsx
with open('src/routes/physiotherapy.tsx', 'r') as f:
    c = f.read()
c = c.replace('map((_, i) =>', 'map((_: any, i: number) =>')
with open('src/routes/physiotherapy.tsx', 'w') as f:
    f.write(c)

# 7. medical-equipment.tsx
with open('src/routes/medical-equipment.tsx', 'r') as f:
    c = f.read()
c = c.replace('map((_, i) =>', 'map((_: any, i: number) =>')
c = c.replace('eq.specifications', '(eq as any).specifications')
c = c.replace('eq.name', '(eq as any).name')
c = c.replace('selectedItem.url', '(selectedItem as any).url')
with open('src/routes/medical-equipment.tsx', 'w') as f:
    f.write(c)

