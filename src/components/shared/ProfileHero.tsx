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
}

const STATUS_STYLES: Record<string, StatusStyle> = {
  success: {
    badge: "border-emerald-500/20 bg-emerald-50/70 text-emerald-700",
    dot: "bg-emerald-500",
    hasPing: true,
  },
  warning: {
    badge: "border-amber-500/20 bg-amber-50/70 text-amber-700",
    dot: "bg-amber-500",
    hasPing: true,
  },
  error: {
    badge: "border-red-500/20 bg-red-50/70 text-red-700",
    dot: "bg-red-500",
    hasPing: false,
  },
  neutral: {
    badge: "border-gray-500/20 bg-gray-50/70 text-gray-700",
    dot: "bg-gray-400",
    hasPing: false,
  },
};

/**
 * Top-of-page Hero section displaying developer introduction and portrait.
 *
 * Anchors the page with `id="home"`, serves as the sole semantic `<h1>` on the
 * public portfolio, resolves relative profile image paths using `IMAGE_BASE_URL`,
 * and adheres strictly to Single Source of Truth by conditionally rendering
 * profile data only when provided by the backend.
 */
export function ProfileHero({ profile }: ProfileHeroProps) {
  const fullName = profile
    ? `${profile.first_name} ${profile.last_name}`.trim()
    : "";

  const shortBio = profile?.short_bio?.trim() || "";
  const fullBio = profile?.bio?.trim() || "";
  const leadBio = shortBio || fullBio;
  const extendedBio =
    shortBio && fullBio && shortBio !== fullBio ? fullBio : null;

  const availabilityText =
    profile?.availability_status || "Available for new opportunities";

  const statusConfig =
    STATUS_STYLES[profile?.status_indicator ?? "neutral"] ??
    STATUS_STYLES.neutral;

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
      className="relative overflow-hidden pt-8 pb-16 sm:pt-12 sm:pb-20 lg:pt-16 lg:pb-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Left Column: Text & CTAs */}
          <div className="flex flex-col items-center text-center lg:col-span-7 lg:items-start lg:text-left animate-fade-in-up">
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

            {/* Primary SEO Heading (Single H1 rule) */}
            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              {profile?.hero_title ? (
                profile.hero_title
              ) : (
                <>
                  Building scalable, modern{" "}
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    web applications
                  </span>
                </>
              )}
            </h1>

            {/* Render developer name only when present in database */}
            {fullName && (
              <p className="mt-4 text-lg font-medium text-gray-800 sm:text-xl">
                Hi, I'm{" "}
                <span className="font-semibold text-gray-900">{fullName}</span>.
              </p>
            )}

            {/* Render primary bio / tagline */}
            {leadBio && (
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-gray-600 sm:text-lg">
                {leadBio}
              </p>
            )}

            {/* Render extended bio if both short and full bios exist */}
            {extendedBio && (
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-500 sm:text-base">
                {extendedBio}
              </p>
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

          {/* Right Column: Avatar Portrait */}
          <div className="flex justify-center lg:col-span-5 animate-fade-in">
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
    </section>
  );
}
