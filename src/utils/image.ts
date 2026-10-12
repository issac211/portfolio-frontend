import { IMAGE_BASE_URL } from "../config/constants";

/** Default fallback placeholder image path served from the public asset directory */
export const DEFAULT_PLACEHOLDER_IMAGE = "/placeholder-image.svg";

/**
 * Resolves an image path from the backend API into a valid, renderable image URL.
 *
 * Backend API responses may contain:
 * 1. Absolute URLs (e.g. Cloudinary CDN in production: `https://res.cloudinary.com/...`)
 * 2. Relative URLs (e.g. Local uploads in development: `/uploads/...` or `uploads/...`)
 * 3. Client protocols (e.g. `blob:` / `data:` during local preview)
 * 4. `null` / `undefined` / empty string when no asset is present
 *
 * @param imagePath - Raw image path or URL from API / form state
 * @param fallback - Optional fallback path when imagePath is absent (defaults to `/placeholder-image.svg`)
 * @returns Clean, fully-qualified URL or fallback placeholder path
 */
export function getImageUrl(
  imagePath?: string | null,
  fallback: string = DEFAULT_PLACEHOLDER_IMAGE,
): string {
  if (!imagePath || !imagePath.trim()) {
    return fallback;
  }

  const trimmed = imagePath.trim();

  // Return absolute URLs (http://, https://) and client-side protocols (blob:, data:) unchanged
  if (
    /^https?:\/\//i.test(trimmed) ||
    trimmed.startsWith("blob:") ||
    trimmed.startsWith("data:")
  ) {
    return trimmed;
  }

  // Prepend base URL safely, stripping trailing slashes on base and leading slashes on relative path
  const baseUrl = (IMAGE_BASE_URL || "").trim();
  const cleanBase = baseUrl.replace(/\/+$/, "");
  const cleanPath = trimmed.replace(/^\/+/, "");

  return cleanBase ? `${cleanBase}/${cleanPath}` : `/${cleanPath}`;
}
