import { useEffect } from "react";

export interface SEOOptions {
  /** Page title. Formatted as `${title} | Itzik Portfolio`, or defaults to site title if omitted. */
  title?: string;
  /** Meta description for search engines and social link cards. */
  description?: string;
  /** Preview image URL for social media link previews (og:image, twitter:image). */
  image?: string;
}

const DEFAULT_TITLE = "Itzik | Full Stack Developer Portfolio";
const DEFAULT_DESCRIPTION =
  "Portfolio of Itzik, a Full Stack Developer specializing in modern web applications, scalable architectures, and clean code.";
const DEFAULT_IMAGE = "/og-image.jpg";

/**
 * Resolves relative asset paths to fully-qualified absolute URLs required by
 * social media crawlers (WhatsApp, LinkedIn, Twitter/X).
 */
function toAbsoluteUrl(url: string): string {
  if (url.startsWith("http")) {
    return url;
  }
  const path = url.startsWith("/") ? url : `/${url}`;
  return `${window.location.origin}${path}`;
}

/**
 * Custom hook for managing dynamic per-page SEO metadata tags in a client-rendered SPA.
 *
 * Updates document.title, standard meta description, and Open Graph / Twitter Card tags (including absolute preview images).
 * Restores initial or default metadata upon unmount to prevent state leakage between route navigations.
 */
export function useSEO({ title, description, image }: SEOOptions = {}) {
  useEffect(() => {
    const formattedTitle = title
      ? `${title} | Itzik Portfolio`
      : DEFAULT_TITLE;
    document.title = formattedTitle;

    const currentDescription = description || DEFAULT_DESCRIPTION;
    const absoluteImageUrl = toAbsoluteUrl(image || DEFAULT_IMAGE);
    const defaultAbsoluteImageUrl = toAbsoluteUrl(DEFAULT_IMAGE);

    // Helper to idempotently update or create a meta tag in document.head
    function setMetaTag(selector: string, attrName: string, attrValue: string, content: string) {
      let meta = document.querySelector(selector) as HTMLMetaElement | null;
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute(attrName, attrValue);
        document.head.appendChild(meta);
      }
      meta.content = content;
    }

    // Standard Search Engine Description
    setMetaTag('meta[name="description"]', "name", "description", currentDescription);

    // Open Graph Metadata (Facebook, LinkedIn, Discord, WhatsApp)
    setMetaTag('meta[property="og:title"]', "property", "og:title", formattedTitle);
    setMetaTag('meta[property="og:description"]', "property", "og:description", currentDescription);
    setMetaTag('meta[property="og:image"]', "property", "og:image", absoluteImageUrl);

    // Twitter Card Metadata
    setMetaTag('meta[name="twitter:title"]', "name", "twitter:title", formattedTitle);
    setMetaTag('meta[name="twitter:description"]', "name", "twitter:description", currentDescription);
    setMetaTag('meta[name="twitter:image"]', "name", "twitter:image", absoluteImageUrl);

    // Cleanup: restore default metadata when navigating away
    return () => {
      document.title = DEFAULT_TITLE;
      setMetaTag('meta[name="description"]', "name", "description", DEFAULT_DESCRIPTION);
      setMetaTag('meta[property="og:title"]', "property", "og:title", DEFAULT_TITLE);
      setMetaTag('meta[property="og:description"]', "property", "og:description", DEFAULT_DESCRIPTION);
      setMetaTag('meta[property="og:image"]', "property", "og:image", defaultAbsoluteImageUrl);
      setMetaTag('meta[name="twitter:title"]', "name", "twitter:title", DEFAULT_TITLE);
      setMetaTag('meta[name="twitter:description"]', "name", "twitter:description", DEFAULT_DESCRIPTION);
      setMetaTag('meta[name="twitter:image"]', "name", "twitter:image", defaultAbsoluteImageUrl);
    };
  }, [title, description, image]);
}
