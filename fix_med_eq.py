import re

with open('src/routes/medical-equipment.tsx', 'r') as f:
    c = f.read()

c = c.replace('item.featured_image?.url', '(item.featured_image as any)?.url')
c = c.replace('item.specifications', '(item as any).specifications')
c = c.replace('item.name', '(item as any).name || (item as any).title')

with open('src/routes/medical-equipment.tsx', 'w') as f:
    f.write(c)
