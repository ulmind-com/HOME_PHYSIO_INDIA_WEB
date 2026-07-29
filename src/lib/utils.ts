import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Normalise an image field that may be a plain URL string or a Cloudinary ImageAsset object. */
export function imgUrl(
  value: string | { url?: string | null } | null | undefined,
): string | undefined {
  if (!value) return undefined;
  return typeof value === "string" ? value : value.url ?? undefined;
}
