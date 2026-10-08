import { Link, useLocation } from "react-router-dom";
import { useToast } from "../../context/ToastContext";
import { useProfile } from "../../hooks/useProfile";
import { handleSmoothScroll } from "../../utils/scroll";
import { GithubIcon, LinkedInIcon, MailIcon } from "../ui/icons";

/** Social and contact link definition. */
interface SocialLink {
  label: string;
  href: string;
  icon: (props: { className?: string }) => React.JSX.Element;
}

/** Navigation link item. */
interface NavLinkItem {
  label: string;
  href: string;
}

const QUICK_LINKS: NavLinkItem[] = [
  { label: "Home", href: "/#home" },
  { label: "Projects", href: "/#projects" },
  { label: "Contact", href: "/#contact" },
];

import { StatusBadge } from "../ui/StatusBadge";

/**
 * Public website footer containing social links, quick navigation,
 * and contact anchor target for smooth scrolling.
 */
export function Footer() {
  const currentYear = new Date().getFullYear();
  const { profile } = useProfile();
  const { addToast } = useToast();
  const location = useLocation();

  function handleNavClick(
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) {
    // If already on root page, smooth scroll in place; otherwise let React Router navigate
    if (location.pathname === "/") {
      handleSmoothScroll(e, href);
    }
  }

  const brandName = profile?.first_name || "Portfolio";
  const fullName = profile
    ? `${profile.first_name} ${profile.last_name}`.trim()
    : "";

  const shortBio = profile?.short_bio || "";

  const contactEmail = profile?.email || "contact@example.com";

  async function handleSocialClick(
    _e: React.MouseEvent<HTMLAnchorElement>,
    social: SocialLink
  ) {
    if (social.label === "Email") {
      try {
        await navigator.clipboard.writeText(contactEmail);
        addToast({
          message: `Email copied to clipboard (${contactEmail})`,
          variant: "success",
        });
      } catch {
        addToast({
          message: `Contact email: ${contactEmail}`,
          variant: "info",
        });
      }
      // Note: We deliberately do not call preventDefault(), allowing browsers with
      // a registered mail handler to attempt opening the mail client concurrently.
    }
  }

  const socialLinks: SocialLink[] = [
    {
      label: "GitHub",
      href: profile?.github_url || "https://github.com",
      icon: GithubIcon,
    },
    {
      label: "LinkedIn",
      href: profile?.linkedin_url || "https://linkedin.com",
      icon: LinkedInIcon,
    },
    {
      label: "Email",
      href: `mailto:${contactEmail}`,
      icon: MailIcon,
    },
  ];

  return (
    // id="contact" serves as the anchor target for the Navbar "Contact" link
    <footer
      id="contact"
      className="border-t border-gray-200 bg-gray-50/80 text-gray-600"
    >
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Brand & Bio summary */}
          <div className="space-y-3">
            <Link
              to="/"
              className="text-xl font-bold tracking-tight text-gray-900 transition-colors hover:text-blue-600"
            >
              {brandName}
              <span className="text-blue-600">.</span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-gray-500">
              {shortBio}
            </p>
            <StatusBadge
              indicator={profile?.status_indicator ?? null}
              text={profile?.availability_status}
              variant="inline"
            />
          </div>

          {/* Quick Navigation Links */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-900">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="text-sm text-gray-600 transition-colors hover:text-blue-600"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social & Contact links */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-900">
              Connect
            </h3>
            <p className="text-sm text-gray-500">
              Feel free to reach out for collaborations or project inquiries.
            </p>
            <div className="flex items-center gap-4 pt-1">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                const isMailto = social.href.startsWith("mailto:");
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    onClick={(e) => handleSocialClick(e, social)}
                    // noopener noreferrer protects against tabnabbing when opening external links
                    target={isMailto ? undefined : "_blank"}
                    rel={isMailto ? undefined : "noopener noreferrer"}
                    aria-label={social.label}
                    title={
                      isMailto
                        ? `Send email or copy: ${contactEmail}`
                        : social.label
                    }
                    className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-500 hover:text-blue-600 hover:shadow-xs active:scale-95 cursor-pointer"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom copyright divider */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-gray-200 pt-8 sm:flex-row">
          <p className="text-xs text-gray-500">
            &copy; {currentYear} {fullName}. All rights reserved.
          </p>
          <p className="text-xs text-gray-400">
            Built with React, TypeScript &amp; Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
}
