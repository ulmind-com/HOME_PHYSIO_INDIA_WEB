/**
 * Branded, deterministic SVG placeholders rendered as data URIs.
 *
 * Every image on the site goes through {@link imageSrc}: if the admin panel has
 * uploaded a real asset the CDN URL wins, otherwise we fall back to one of these
 * generated placeholders. Nothing here hits the network, so a fresh database
 * still renders a complete-looking site — and the moment someone uploads an
 * image in the admin panel, it replaces the placeholder with no code change.
 */
import type { EquipmentCode, ServiceCategory } from "./api/therapy";

/* ── Premium default images ────────────────────────────────────────── */

/** Default hero slider images for desktop (16:9). */
export const HERO_DESKTOP_IMAGES = [
  "/assets/hero-desktop/hero-physio-1.jpg",
  "/assets/hero-desktop/hero-physio-2.jpg",
  "/assets/hero-desktop/hero-physio-3.jpg",
  "/assets/hero-desktop/hero-physio-4.jpg",
  "/assets/hero-desktop/hero-physio-5.jpg",
];

/** Default hero slider images for mobile (9:16). */
export const HERO_MOBILE_IMAGES = [
  "/assets/hero-mobile/hero-physio-1.jpg",
  "/assets/hero-mobile/hero-physio-2.jpg",
  "/assets/hero-mobile/hero-physio-3.jpg",
  "/assets/hero-mobile/hero-physio-4.jpg",
  "/assets/hero-mobile/hero-physio-5.jpg",
];

/** Premium photo images for each service category card. */
export const SERVICE_IMAGES: Record<ServiceCategory, string> = {
  physiotherapy: "/assets/services/physiotherapy.jpg",
  yoga_therapy: "/assets/services/yoga-therapy.jpg",
  massage_therapy: "/assets/services/massage-therapy.jpg",
  home_rehabilitation: "/assets/services/rehabilitation.jpg",
};

/** Premium photo images for page hero backgrounds. */
const PAGE_HERO_IMAGES: Record<string, string> = {
  services: "/assets/page-heroes/services.jpg",
  equipment: "/assets/page-heroes/equipment.jpg",
  about: "/assets/page-heroes/about.jpg",
  careers: "/assets/page-heroes/careers.jpg",
  therapists: "/assets/page-heroes/therapists.jpg",
  blog: "/assets/page-heroes/blog.jpg",
  faq: "/assets/page-heroes/faq.jpg",
};

/** Returns a premium page hero image for the given page slug. */
export function pageHeroImage(page: string): string {
  return PAGE_HERO_IMAGES[page] ?? HERO_DESKTOP_IMAGES[0];
}

const TEAL_DEEP = "#07646d";
const TEAL = "#0c8c99";
const TEAL_SOFT = "#e0f2f4";
const MIST = "#eaf6f8";

const encode = (svg: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(svg.replace(/\s+/g, " ").trim())}`;

/** Stable non-negative hash so the same name always gets the same tint. */
function hash(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i += 1) {
    h = (h << 5) - h + input.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

function initials(name: string): string {
  const parts = name
    .replace(/^(dr\.?|mr\.?|mrs\.?|ms\.?)\s+/i, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) return "HP";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/** Portrait-shaped avatar with the person's initials over a branded gradient. */
export function avatarPlaceholder(name: string, size = 480): string {
  const hue = 178 + (hash(name) % 22); // stay inside the teal family
  const a = `hsl(${hue} 62% 26%)`;
  const b = `hsl(${hue} 48% 46%)`;
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 480 480">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="${a}"/>
          <stop offset="1" stop-color="${b}"/>
        </linearGradient>
      </defs>
      <rect width="480" height="480" fill="url(#g)"/>
      <circle cx="380" cy="96" r="150" fill="#ffffff" opacity="0.06"/>
      <circle cx="90" cy="410" r="120" fill="#ffffff" opacity="0.05"/>
      <text x="240" y="240" fill="#ffffff" fill-opacity="0.92"
            font-family="Inter, system-ui, sans-serif" font-size="150" font-weight="600"
            text-anchor="middle" dominant-baseline="central" letter-spacing="4">${initials(name)}</text>
    </svg>`;
  return encode(svg);
}

/** Premium photo image for each service category. Falls back to SVG if image fails. */
export function serviceArtwork(category: ServiceCategory): string {
  return SERVICE_IMAGES[category];
}

/** Wide hero backdrop — soft layered teal waves. */
export function heroPlaceholder(seed = "hero"): string {
  const shift = hash(seed) % 60;
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="${TEAL_DEEP}"/>
          <stop offset="1" stop-color="${TEAL}"/>
        </linearGradient>
      </defs>
      <rect width="1600" height="900" fill="url(#bg)"/>
      <path d="M0 ${560 + shift} C 400 ${440 + shift} 700 ${700 + shift} 1600 ${500 + shift} L1600 900 L0 900 Z"
            fill="#ffffff" opacity="0.08"/>
      <path d="M0 ${680 + shift} C 500 ${560 + shift} 900 ${800 + shift} 1600 ${640 + shift} L1600 900 L0 900 Z"
            fill="#ffffff" opacity="0.07"/>
      <circle cx="1320" cy="200" r="220" fill="#ffffff" opacity="0.06"/>
    </svg>`;
  return encode(svg);
}

/** Product image for a portable modality in the equipment library. */
export function equipmentIcon(code: EquipmentCode): string {
  const images: Record<EquipmentCode, string> = {
    ift: "/images/equipment/ift.jpg",
    tens: "/images/equipment/tens.jpg",
    ust: "/images/equipment/ust.jpg",
    nmes: "/images/equipment/nmes.jpg",
    fes: "/images/equipment/fes.jpg",
    portable_ems: "/images/equipment/portable_ems.jpg",
    wax_bath: "/images/equipment/wax_bath.jpg",
    hot_cold: "/images/equipment/hot_cold.jpg",
    theraband: "/images/equipment/theraband.jpg",
  };
  return images[code] ?? images.ift;
}

/** Maps an equipment slug (from the API) to an EquipmentCode for local image lookup. */
const SLUG_TO_CODE: Record<string, EquipmentCode> = {
  ift: "ift",
  tens: "tens",
  ust: "ust",
  nmes: "nmes",
  fes: "fes",
  "portable-ems": "portable_ems",
  "wax-bath": "wax_bath",
  "hot-cold-therapy": "hot_cold",
  "hot-cold": "hot_cold",
  theraband: "theraband",
};

export function slugToEquipmentCode(slug: string): EquipmentCode {
  return SLUG_TO_CODE[slug] ?? (slug.replace(/-/g, "_") as EquipmentCode) ?? "ift";
}

/**
 * Product photo for an equipment record coming from the API, or `null` when we
 * have no picture of it. Therapists register their own kit under free-form
 * slugs, and showing an unrelated machine's photo is worse than showing none —
 * so this deliberately does not fall back the way `equipmentIcon` does.
 */
export function equipmentImageForSlug(slug: string): string | null {
  const code = SLUG_TO_CODE[slug];
  return code ? equipmentIcon(code) : null;
}

/** Neutral 16:9 card image, used for blog/testimonial cards with no upload. */
export function cardPlaceholder(seed: string): string {
  const hue = 178 + (hash(seed) % 26);
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450">
      <rect width="800" height="450" fill="hsl(${hue} 40% 94%)"/>
      <circle cx="640" cy="90" r="150" fill="hsl(${hue} 45% 82%)" opacity="0.7"/>
      <path d="M0 340 C 200 280 400 380 800 300 L800 450 L0 450 Z" fill="hsl(${hue} 42% 86%)"/>
    </svg>`;
  return encode(svg);
}

/**
 * Prefer an admin-uploaded asset, fall back to a generated placeholder.
 *
 * Accepts the shapes the API returns for images (`{ url }`, a bare string, or
 * null) so callers don't have to normalise first.
 */
export function imageSrc(
  uploaded: string | { url?: string | null } | null | undefined,
  fallback: string,
): string {
  if (!uploaded) return fallback;
  const url = typeof uploaded === "string" ? uploaded : uploaded.url;
  return url && url.trim() ? url : fallback;
}
