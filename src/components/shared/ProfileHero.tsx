import { useMemo, useState } from "react";
import { IMAGE_BASE_URL } from "../../config/constants";
import type { PersonalInfoResponse } from "../../types/profile";
import { handleSmoothScroll } from "../../utils/scroll";
import { ArrowDownIcon, UserIcon } from "../ui/icons";

interface ProfileHeroProps {
  profile: PersonalInfoResponse | null;
}

/** Status pill style mapping keyed by status indicator. */
interface StatusStyle {
  badge: string;
  dot: string;
  hasPing: boolean;
  defaultText: string;
}

const STATUS_STYLES: Record<string, StatusStyle> = {
  success: {
    badge: "border-emerald-500/20 bg-emerald-50/70 text-emerald-700",
    dot: "bg-emerald-500",
    hasPing: true,
    defaultText: "Available for new opportunities",
  },
  warning: {
    badge: "border-amber-500/20 bg-amber-50/70 text-amber-700",
    dot: "bg-amber-500",
    hasPing: true,
    defaultText: "Limited availability",
  },
  error: {
    badge: "border-red-500/20 bg-red-50/70 text-red-700",
    dot: "bg-red-500",
    hasPing: false,
    defaultText: "Currently unavailable",
  },
  neutral: {
    badge: "border-gray-500/20 bg-gray-50/70 text-gray-700",
    dot: "bg-gray-400",
    hasPing: false,
    defaultText: "Open to inquiries",
  },
};

/**
 * Calculates current full age in years from an ISO birth date string.
 * Returns null if the birth date is absent, invalid, or in the future.
 */
function calculateAge(birthDateString: string | null | undefined): number | null {
  if (!birthDateString) return null;
  const birthDate = new Date(birthDateString);
  if (Number.isNaN(birthDate.getTime())) return null;

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age >= 0 ? age : null;
}

/**
 * Splits the hero headline into a primary text segment and a stylized gradient highlight.
 *
 * Supports an optional explicit pipe delimiter (`|`) for manual curation (e.g. "Headline | Highlighted"),
 * while automatically falling back to styling the final 1-2 words if no delimiter is supplied.
 */
function splitHeroTitle(title: string | null | undefined): {
  primary: string;
  highlight: string;
} {
  const trimmed = title?.trim();
  if (!trimmed) {
    return {
      primary: "Building scalable, modern",
      highlight: "web applications",
    };
  }

  // Explicit manual delimiter support
  if (trimmed.includes("|")) {
    const parts = trimmed.split("|");
    const primary = parts[0].trim();
    const highlight = parts.slice(1).join("|").trim();
    if (primary && highlight) {
      return { primary, highlight };
    }
  }

  const words = trimmed.split(/\s+/);
  if (words.length <= 1) {
    return { primary: "", highlight: words[0] || "" };
  }

  // Highlight the final 2 words for phrases with 4+ words, or the final word for shorter phrases
  const splitIndex = words.length > 3 ? words.length - 2 : words.length - 1;
  const primary = words.slice(0, splitIndex).join(" ");
  const highlight = words.slice(splitIndex).join(" ");

  return { primary, highlight };
}

/**
 * Top-of-page Hero section displaying developer introduction and portrait.
 *
 * Anchors the page with `id="home"`, serves as the sole semantic `<h1>` on the
 * public portfolio, resolves relative profile image paths using `IMAGE_BASE_URL`,
 * and adheres strictly to Single Source of Truth by conditionally rendering
 * profile data only when provided by the backend.
 */
export function ProfileHero({ profile }: ProfileHeroProps) {
  const [isBioExpanded, setIsBioExpanded] = useState(true);

  const fullName = profile
    ? `${profile.first_name} ${profile.last_name}`.trim()
    : "";

  const age = calculateAge(profile?.birth_date);
  const shortBio = profile?.short_bio?.trim() || "";
  const fullBio = profile?.bio?.trim() || "";
  const leadBio = shortBio || fullBio;
  const extendedBio =
    shortBio && fullBio && shortBio !== fullBio ? fullBio : null;

  const bioParagraphs = useMemo(() => {
    if (!extendedBio) return [];
    return extendedBio
      .split(/\n+/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean);
  }, [extendedBio]);

  const statusConfig =
    STATUS_STYLES[profile?.status_indicator ?? "neutral"] ??
    STATUS_STYLES.neutral;

  const availabilityText =
    profile?.availability_status?.trim() || statusConfig.defaultText;

  const heroHeading = splitHeroTitle(profile?.hero_title);

  // Prepend IMAGE_BASE_URL to relative backend image path
  const avatarUrl = profile?.image_url
    ? `${IMAGE_BASE_URL}${profile.image_url}`
    : null;

  const initials = profile
    ? `${profile.first_name?.[0] || ""}${profile.last_name?.[0] || ""}`.toUpperCase()
    : "";

  return (
    <section
      id="home"
      aria-label="Introduction"
      className="relative pt-8 pb-16 sm:pt-12 sm:pb-20 lg:pt-16 lg:pb-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Left Column: Text & CTAs */}
          <div className="flex flex-col items-center text-center lg:col-span-8 lg:items-start lg:text-left animate-fade-in-up">
            {/* Status Pill */}
            <div
              className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1 text-xs font-medium ${statusConfig.badge}`}
            >
              <span className="relative flex h-2 w-2">
                {statusConfig.hasPing && (
                  <span
                    className={`absolute inline-flex h-full w-full animate-ping rounded-full ${statusConfig.dot} opacity-75`}
                  />
                )}
                <span
                  className={`relative inline-flex h-2 w-2 rounded-full ${statusConfig.dot}`}
                />
              </span>
              {availabilityText}
            </div>

            {/* Primary SEO Heading (Single H1 rule) - reduced size for better visual hierarchy */}
            <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
              {heroHeading.primary ? `${heroHeading.primary} ` : ""}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {heroHeading.highlight}
              </span>
            </h1>

            {/* Render developer name and calculated age */}
            {fullName && (
              <p className="mt-4 text-lg font-medium text-gray-800 sm:text-xl">
                Hi, I'm{" "}
                <span className="font-semibold text-gray-900">{fullName}</span>
                {age !== null && (
                  <span className="text-gray-500 font-normal text-base">
                    {" "}
                    ({age} years old)
                  </span>
                )}
                .
              </p>
            )}

            {/* Render primary bio / tagline with prominent contrast */}
            {leadBio && (
              <p className="mt-3 max-w-3xl text-base font-medium leading-relaxed text-gray-800 sm:text-lg whitespace-pre-line">
                {leadBio}
              </p>
            )}

            {/* Render collapsible extended bio with subtle border-l accent and narrative styling */}
            {extendedBio && (
              <div className="mt-3 max-w-3xl w-full text-left">
                <div
                  className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
                    isBioExpanded
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="pl-2 py-1">
                      <div className="relative border-l-2 border-blue-500/30 pl-4 sm:pl-5 py-0.5 space-y-3.5 sm:space-y-4">
                        {bioParagraphs.map((paragraph, index) => (
                          <div key={index} className="relative group">
                            {/* Subtle timeline node marker for each distinct paragraph */}
                            <span
                              className="absolute -left-5 sm:-left-6 top-2 sm:top-2.5 h-1.5 w-1.5 rounded-full bg-blue-500 ring-[3px] ring-white transition-all duration-200 group-hover:scale-125 group-hover:bg-blue-600"
                              aria-hidden="true"
                            />
                            <p className="text-sm font-normal leading-relaxed text-gray-600 transition-colors duration-200 group-hover:text-gray-900 sm:text-base">
                              {paragraph}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsBioExpanded((prev) => !prev)}
                  className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
                  aria-expanded={isBioExpanded}
                >
                  <span>{isBioExpanded ? "Show less" : "Read full bio"}</span>
                  <ArrowDownIcon
                    className={`h-3 w-3 transition-transform duration-300 ${
                      isBioExpanded ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </div>
            )}

            {/* Profile not yet configured — visible only to site visitors before setup */}
            {!profile && (
              <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-50 px-4 py-1.5 text-xs font-medium text-amber-700">
                <span aria-hidden="true">🚧</span>
                Portfolio is being set up — check back soon!
              </p>
            )}

            {/* Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
              <a
                href="/#projects"
                onClick={(e) => handleSmoothScroll(e, "/#projects")}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-xs transition-all duration-150 ease-out hover:bg-blue-700 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                View Projects
                <ArrowDownIcon className="h-4 w-4" />
              </a>

              <a
                href="/#contact"
                onClick={(e) => handleSmoothScroll(e, "/#contact")}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-xs transition-all duration-150 ease-out hover:bg-gray-50 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
              >
                Contact Me
              </a>
            </div>
          </div>

          {/* Right Column: Avatar Portrait that follows scroll within Hero */}
          <div className="lg:col-span-4 relative">
            <div className="lg:sticky lg:top-24 flex justify-center lg:justify-end">
              <div className="relative">
                {/* Radial gradient glow background */}
                <div
                  className="absolute -inset-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 opacity-20 blur-xl transition-opacity duration-300"
                  aria-hidden="true"
                />

                {/* Portrait Container with 3-tier fallback */}
                <div className="relative flex h-60 w-60 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-gray-100 shadow-xl transition-transform duration-300 ease-out hover:scale-[1.02] sm:h-72 sm:w-72 lg:h-80 lg:w-80">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={fullName || "Developer portrait"}
                      className="h-full w-full object-cover"
                      loading="eager"
                    />
                  ) : initials ? (
                    <span className="text-5xl font-bold tracking-wider text-gray-400">
                      {initials}
                    </span>
                  ) : (
                    <UserIcon className="h-28 w-28 text-gray-300" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
