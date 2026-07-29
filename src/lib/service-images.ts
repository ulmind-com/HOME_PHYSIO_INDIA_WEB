import type { Service } from "@/lib/api/types";

/**
 * Curated default healthcare imagery used when a service has no
 * `featured_image` set in the admin panel. Keeps the grid looking
 * premium and complete even before content is uploaded.
 */
const DEFAULT_SERVICE_IMAGES = [
  "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80", // nurse + patient
  "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=1200&q=80", // home care
  "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=1200&q=80", // nurse portrait
  "https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?auto=format&fit=crop&w=1200&q=80", // physiotherapy
  "https://images.unsplash.com/photo-1666214280391-8ff5bd3c0bf0?auto=format&fit=crop&w=1200&q=80", // elderly care
  "https://images.unsplash.com/photo-1571772996211-2f02c9727629?auto=format&fit=crop&w=1200&q=80", // medical equipment
];

const KEYWORD_IMAGES: Array<{ test: RegExp; url: string }> = [
  { test: /elder|senior|old|attendant|geriatric/i, url: DEFAULT_SERVICE_IMAGES[4] },
  { test: /nurs|icu|critical|post[- ]?op|injection|wound/i, url: DEFAULT_SERVICE_IMAGES[0] },
  { test: /physio|rehab|mobility|therap/i, url: DEFAULT_SERVICE_IMAGES[3] },
  { test: /equipment|oxygen|bed|wheelchair|rental|concentrator/i, url: DEFAULT_SERVICE_IMAGES[5] },
  { test: /home|family|companion/i, url: DEFAULT_SERVICE_IMAGES[1] },
];

/** Deterministic default image for a service (stable across renders). */
export function serviceImage(service: Service, index = 0): string {
  if (service.featured_image) return service.featured_image;

  const haystack = `${service.title} ${service.category_name ?? ""}`;
  for (const { test, url } of KEYWORD_IMAGES) {
    if (test.test(haystack)) return url;
  }
  return DEFAULT_SERVICE_IMAGES[index % DEFAULT_SERVICE_IMAGES.length];
}
