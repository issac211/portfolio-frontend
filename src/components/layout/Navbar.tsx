import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "../ui/Button";

/** Navigation anchor link definition. */
interface NavLinkItem {
  label: string;
  href: string;
}

const NAV_LINKS: NavLinkItem[] = [
  { label: "Home", href: "/#home" },
  { label: "Projects", href: "/#projects" },
  { label: "Contact", href: "/#contact" },
];

/**
 * Public navigation bar with single-page scroll anchor links,
 * mobile drawer menu, and auth-aware admin navigation.
 */
export function Navbar() {
  const { isAuthenticated, handleLogout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function closeMenu() {
    setIsMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200/80 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand / Logo */}
        <Link
          to="/"
          onClick={closeMenu}
          className="text-xl font-bold tracking-tight text-gray-900 transition-colors hover:text-blue-600"
        >
          Itzik<span className="text-blue-600">.</span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          className="hidden items-center gap-8 md:flex"
          aria-label="Main navigation"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-gray-600 transition-colors hover:text-blue-600"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop Auth Controls */}
        <div className="hidden items-center gap-4 md:flex">
          {isAuthenticated ? (
            <>
              <Link
                to="/admin"
                className="text-sm font-medium text-gray-700 transition-colors hover:text-blue-600"
              >
                Dashboard
              </Link>
              <Button variant="secondary" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <Link
              to="/login"
              className="text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
            >
              Admin
            </Link>
          )}
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <button
          type="button"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="inline-flex items-center justify-center rounded-lg p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 md:hidden cursor-pointer"
          aria-expanded={isMenuOpen}
          aria-label="Toggle navigation menu"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            aria-hidden="true"
          >
            {isMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div className="border-b border-gray-200 bg-white/95 px-4 pt-2 pb-4 backdrop-blur-md md:hidden">
          <nav
            className="flex flex-col space-y-3"
            aria-label="Mobile navigation"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="py-1 text-base font-medium text-gray-700 transition-colors hover:text-blue-600"
              >
                {link.label}
              </a>
            ))}

            <div className="flex items-center justify-between border-t border-gray-100 pt-3">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/admin"
                    onClick={closeMenu}
                    className="text-base font-medium text-blue-600 transition-colors hover:text-blue-700"
                  >
                    Dashboard
                  </Link>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      closeMenu();
                      handleLogout();
                    }}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
                >
                  Admin Login
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
